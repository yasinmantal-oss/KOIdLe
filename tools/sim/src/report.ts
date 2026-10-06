import { AI_PROFILES, type AiProfile, type Planner } from '@koidle/ai';
import { ARCHETYPE_IDS, ARCHETYPES, type ArchetypeId } from '@koidle/content-schema';
import {
  type BattleConfig,
  type CardDef,
  type EndReason,
  isHeavy,
  type PlayerIndex,
} from '@koidle/rules';
import type { MatchRecord } from './run';

// Simülasyon "eğlenceli mi?" kararı vermez (C5). Gate 2 sim ölçütleri (spec §9) yalnız işaretlenir:
// job eşleşmesi %40–60 dışı ⚠, kart oynanma oranı < %30 "DÜŞÜK".

/** Gate 2 ölçütü: her kart içinde olduğu destelerde kabaca > %30 oynanmalı. */
export const LOW_PLAYED_RATE = 0.3;

const SEATS = [0, 1] as const;
const rate = (n: number, d: number): number => (d === 0 ? 0 : n / d);
const seatArchetype = (r: MatchRecord, seat: PlayerIndex): ArchetypeId =>
  seat === 0 ? r.p0Archetype : r.p1Archetype;
const seatProfile = (r: MatchRecord, seat: PlayerIndex): AiProfile =>
  seat === 0 ? r.p0Profile : r.p1Profile;

function perArchetype<T>(init: () => T): Record<ArchetypeId, T> {
  return Object.fromEntries(ARCHETYPE_IDS.map((a) => [a, init()])) as Record<ArchetypeId, T>;
}

export interface CardStat {
  id: string;
  name: string;
  cost: number;
  heavy: boolean;
  /** Kartın destesinde olduğu oyuncu-maç sayısı (payda). */
  inDeck: number;
  /** Destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. */
  playedRate: number;
  avgPlaysWhenInDeck: number;
  /** Kartı oynayan oyuncunun o maçlardaki kazanma oranı. */
  winRateWhenPlayed: number | null;
  flag: 'never' | 'low' | 'always' | null;
}

export interface ComboStat {
  /** Oyuncu-maç başına ortalama. */
  crits: number;
  evades: number;
  poisonDamage: number;
}

export interface SimSummary {
  /** Job geçişi (temel ölçüm) maç sayısı. */
  matches: number;
  profileMatches: number;
  rounds: { mean: number; median: number; min: number; max: number };
  firstPlayerWinRate: number;
  drawRate: number;
  arenaRate: number;
  fatigueRate: number;
  bothArenaAndFatigueReachedRate: number;
  reshuffleRate: number;
  endReason: Record<EndReason, number>;
  /** satır job'ının sütun job'ına karşı kazanma oranı (iki koltuk birleşik); ayna maçta null */
  jobMatrix: Record<ArchetypeId, Record<ArchetypeId, number | null>>;
  profileMatrix: Record<AiProfile, Record<AiProfile, number | null>>;
  unusedMpPerTurn: { overall: number; byProfile: Record<AiProfile, number> };
  /** İlk 2 turda oynanabilir kart olmayan oyuncu-maç oranı (hedef ~0). */
  deadOpening: { overall: number; byArchetype: Record<ArchetypeId, number> };
  combos: Record<ArchetypeId, ComboStat>;
  cards: CardStat[];
}

export interface SummaryInput {
  cards: CardDef[];
  decks: Record<ArchetypeId, string[]>;
}

/** Satır anahtarının sütun anahtarına karşı kazanma oranı; iki koltuk birleşik, ayna maç null. */
export function seatMatrix<K extends string>(
  records: MatchRecord[],
  keys: readonly K[],
  keyOf: (r: MatchRecord, seat: PlayerIndex) => K,
): Record<K, Record<K, number | null>> {
  const m = {} as Record<K, Record<K, number | null>>;
  for (const a of keys) {
    m[a] = {} as Record<K, number | null>;
    for (const b of keys) {
      if (a === b) {
        m[a][b] = null;
        continue;
      }
      let wins = 0;
      let games = 0;
      for (const r of records) {
        const s0 = keyOf(r, 0);
        const s1 = keyOf(r, 1);
        if (s0 === a && s1 === b) {
          games++;
          if (r.winner === 0) wins++;
        } else if (s0 === b && s1 === a) {
          games++;
          if (r.winner === 1) wins++;
        }
      }
      m[a][b] = rate(wins, games);
    }
  }
  return m;
}

function unusedMp(records: MatchRecord[], profile?: AiProfile): number {
  let unused = 0;
  let turns = 0;
  for (const r of records) {
    for (const seat of SEATS) {
      if (profile && seatProfile(r, seat) !== profile) continue;
      unused += r.unusedMp[seat];
      turns += r.turns[seat];
    }
  }
  return rate(unused, turns);
}

export function summarize(records: MatchRecord[], input: SummaryInput): SimSummary {
  const job = records.filter((r) => r.pass === 'job');
  const prof = records.filter((r) => r.pass === 'profile');
  const n = job.length;
  const rounds = job.map((r) => r.rounds).sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 ? (rounds[mid] ?? 0) : ((rounds[mid - 1] ?? 0) + (rounds[mid] ?? 0)) / 2;

  const endReason: Record<EndReason, number> = {
    normalDamage: 0,
    fatigue: 0,
    arenaCollapse: 0,
    roundCap: 0,
  };
  for (const r of job) endReason[r.endReason] += 1;

  const seatsBy = perArchetype(() => 0);
  const deadBy = perArchetype(() => 0);
  const critsBy = perArchetype(() => 0);
  const evadesBy = perArchetype(() => 0);
  const poisonBy = perArchetype(() => 0);
  for (const r of job) {
    for (const seat of SEATS) {
      const a = seatArchetype(r, seat);
      seatsBy[a] += 1;
      if (r.deadOpening[seat]) deadBy[a] += 1;
      critsBy[a] += r.crits[seat];
      evadesBy[a] += r.evades[seat];
      poisonBy[a] += r.poisonDamage[seat];
    }
  }
  const combos = Object.fromEntries(
    ARCHETYPE_IDS.map((a) => [
      a,
      {
        crits: rate(critsBy[a], seatsBy[a]),
        evades: rate(evadesBy[a], seatsBy[a]),
        poisonDamage: rate(poisonBy[a], seatsBy[a]),
      },
    ]),
  ) as Record<ArchetypeId, ComboStat>;
  const deadByArchetype = Object.fromEntries(
    ARCHETYPE_IDS.map((a) => [a, rate(deadBy[a], seatsBy[a])]),
  ) as Record<ArchetypeId, number>;
  const deadTotal = ARCHETYPE_IDS.reduce((sum, a) => sum + deadBy[a], 0);

  // Kartlar: yalnız en az bir hazır destede olanlar; payda = kartın destede olduğu oyuncu-maçlar.
  const deckSets = Object.fromEntries(
    ARCHETYPE_IDS.map((a) => [a, new Set(input.decks[a])]),
  ) as Record<ArchetypeId, Set<string>>;
  const cardStats: CardStat[] = input.cards
    .filter((c) => ARCHETYPE_IDS.some((a) => deckSets[a].has(c.id)))
    .map((c) => {
      let inDeck = 0;
      let played = 0;
      let plays = 0;
      let wins = 0;
      for (const r of job) {
        for (const seat of SEATS) {
          if (!deckSets[seatArchetype(r, seat)].has(c.id)) continue;
          inDeck++;
          const k = r.plays[c.id]?.[seat] ?? 0;
          plays += k;
          if (k > 0) {
            played++;
            if (r.winner === seat) wins++;
          }
        }
      }
      const playedRate = rate(played, inDeck);
      let flag: CardStat['flag'] = null;
      if (played === 0) flag = 'never';
      else if (playedRate >= 0.99) flag = 'always';
      else if (playedRate < LOW_PLAYED_RATE) flag = 'low';
      return {
        id: c.id,
        name: c.name,
        cost: c.cost,
        heavy: isHeavy(c),
        inDeck,
        playedRate,
        avgPlaysWhenInDeck: rate(plays, inDeck),
        winRateWhenPlayed: played === 0 ? null : wins / played,
        flag,
      };
    });

  return {
    matches: n,
    profileMatches: prof.length,
    rounds: {
      mean: rate(
        rounds.reduce((a, b) => a + b, 0),
        n,
      ),
      median,
      min: rounds[0] ?? 0,
      max: rounds[n - 1] ?? 0,
    },
    firstPlayerWinRate: rate(job.filter((r) => r.winner === r.firstPlayer).length, n),
    drawRate: rate(job.filter((r) => r.winner === null).length, n),
    arenaRate: rate(job.filter((r) => r.arenaSeen).length, n),
    fatigueRate: rate(job.filter((r) => r.fatigueSeen).length, n),
    bothArenaAndFatigueReachedRate: rate(job.filter((r) => r.arenaSeen && r.fatigueSeen).length, n),
    reshuffleRate: rate(job.filter((r) => r.reshuffleSeen).length, n),
    endReason,
    jobMatrix: seatMatrix(job, ARCHETYPE_IDS, seatArchetype),
    profileMatrix: seatMatrix(prof, AI_PROFILES, seatProfile),
    unusedMpPerTurn: {
      overall: unusedMp(job),
      byProfile: Object.fromEntries(AI_PROFILES.map((p) => [p, unusedMp(prof, p)])) as Record<
        AiProfile,
        number
      >,
    },
    deadOpening: { overall: rate(deadTotal, n * 2), byArchetype: deadByArchetype },
    combos,
    cards: cardStats,
  };
}

const pct = (x: number | null): string => (x === null ? '—' : `%${(x * 100).toFixed(1)}`);
const num = (x: number): string => x.toFixed(2);
/** Job eşleşmesi hücresi: Gate 2 aralığı (%40–60) dışındaysa ⚠. */
const pctJob = (x: number | null): string =>
  x === null ? '—' : `${pct(x)}${x < 0.4 || x > 0.6 ? ' ⚠' : ''}`;
const range = (s: number[]): string => (s.length === 0 ? '—' : `${s[0]}–${s.at(-1)}`);

export interface ReportMeta {
  jobSeeds: number[];
  profileSeeds: number[];
  planner: Planner;
}

export function renderMarkdown(s: SimSummary, config: BattleConfig, meta: ReportMeta): string {
  const o: string[] = [];
  o.push('# Simülasyon Raporu (AI vs AI) — Faz 2a');
  o.push('');
  o.push(
    '> `pnpm sim` ile üretilir. Simülasyon "eğlenceli mi?" kararı vermez; bariz matematik hatası ve anlamsız davranış arar. Otomatik kabul/red eşiği yoktur (C5); ⚠ ve DÜŞÜK işaretleri Gate 2 ölçütlerini (spec §9) hatırlatır.',
  );
  o.push(
    '> **Faz 1 sim sonuçları artık karşılaştırılamaz:** yeni kartlar, açılış eli kuralı ve AI tur planı (F2-11) yeni bir temel ölçüm başlattı.',
  );
  o.push(
    `> Job geçişi: ${s.matches} maç = 3×3 job eşleşmesi × ${meta.jobSeeds.length} seed (${range(meta.jobSeeds)}), balanced vs balanced, hazır desteler. Genel, Açılış, Kombo, Bitiş nedeni ve Kartlar bölümleri yalnız bu geçişten.`,
  );
  o.push(
    `> Profil geçişi: ${s.profileMatches} maç = 3×3 profil eşleşmesi × 3 aynalı job × ${meta.profileSeeds.length} seed (${range(meta.profileSeeds)}).`,
  );
  o.push(`> AI tur planı: derinlik ${meta.planner.depth}, ışın ${meta.planner.beam}.`);
  o.push(
    `> Config özeti: HP ${config.hero.hp} · MP ${config.mp.start}→${config.mp.max} · el ${config.hand.starting}/${config.hand.limit} · Kalkan ${config.shield.persistence} · karıştırma ${config.deck.reshuffles} · Arena ${config.arenaCollapse.startRound}. raunt · Yorgunluk ${config.fatigue.start}+${config.fatigue.step}`,
  );
  o.push('');
  o.push('## Genel');
  o.push('');
  o.push('| Ölçüt | Değer |');
  o.push('|---|---|');
  o.push(
    `| Raunt ortalama / medyan / min / maks | ${num(s.rounds.mean)} / ${s.rounds.median} / ${s.rounds.min} / ${s.rounds.max} |`,
  );
  o.push(`| İlk oyuncunun kazanma oranı | ${pct(s.firstPlayerWinRate)} |`);
  o.push(`| Berabere | ${pct(s.drawRate)} |`);
  o.push(`| Arena Çöküşü görülen maç | ${pct(s.arenaRate)} |`);
  o.push(`| Yorgunluk görülen maç | ${pct(s.fatigueRate)} |`);
  o.push(
    `| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | ${pct(s.bothArenaAndFatigueReachedRate)} |`,
  );
  o.push(`| Karıştırma görülen maç | ${pct(s.reshuffleRate)} |`);
  o.push(`| Tur başına kullanılmayan MP (ortalama) | ${num(s.unusedMpPerTurn.overall)} |`);
  o.push('');
  o.push('## Açılış (ilk 2 turda oynanabilir kart yok)');
  o.push('');
  o.push(
    'Hedef ~0 (spec §9). Oran: oyuncu-maçların kaçında ilk 2 turda bir kez bile oynanabilir kart yoktu.',
  );
  o.push('');
  o.push('| Job | Ölü açılış oranı |');
  o.push('|---|---|');
  o.push(`| Tümü | ${pct(s.deadOpening.overall)} |`);
  for (const a of ARCHETYPE_IDS) {
    o.push(`| ${ARCHETYPES[a].name} | ${pct(s.deadOpening.byArchetype[a])} |`);
  }
  o.push('');
  o.push('## Job eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)');
  o.push('');
  o.push('Gate 2 aralığı %40–60; dışındakiler ⚠.');
  o.push('');
  o.push(`| | ${ARCHETYPE_IDS.map((a) => ARCHETYPES[a].name).join(' | ')} |`);
  o.push(`|---|${ARCHETYPE_IDS.map(() => '---').join('|')}|`);
  for (const a of ARCHETYPE_IDS) {
    o.push(
      `| ${ARCHETYPES[a].name} | ${ARCHETYPE_IDS.map((b) => pctJob(s.jobMatrix[a][b])).join(' | ')} |`,
    );
  }
  o.push('');
  o.push('## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)');
  o.push('');
  o.push('| Job | Kritik kullanımı | Kaçınma tetiklenmesi | Zehir hasarı |');
  o.push('|---|---|---|---|');
  for (const a of ARCHETYPE_IDS) {
    const c = s.combos[a];
    o.push(
      `| ${ARCHETYPES[a].name} | ${num(c.crits)} | ${num(c.evades)} | ${num(c.poisonDamage)} |`,
    );
  }
  o.push('');
  o.push('## Bitiş nedeni (endReason)');
  o.push('');
  o.push('| Neden | Maç | Oran |');
  o.push('|---|---|---|');
  for (const [k, v] of Object.entries(s.endReason)) {
    o.push(`| ${k} | ${v} | ${pct(rate(v, s.matches))} |`);
  }
  o.push('');
  o.push('## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)');
  o.push('');
  o.push(`| | ${AI_PROFILES.join(' | ')} |`);
  o.push(`|---|${AI_PROFILES.map(() => '---').join('|')}|`);
  for (const a of AI_PROFILES) {
    o.push(`| ${a} | ${AI_PROFILES.map((b) => pct(s.profileMatrix[a][b])).join(' | ')} |`);
  }
  o.push('');
  o.push('## Kullanılmayan MP (tur başına, profile göre)');
  o.push('');
  o.push('| Profil | MP |');
  o.push('|---|---|');
  for (const p of AI_PROFILES) o.push(`| ${p} | ${num(s.unusedMpPerTurn.byProfile[p])} |`);
  o.push('');
  o.push('## Kartlar (yalnız en az bir hazır destede olanlar)');
  o.push('');
  o.push(
    `Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %${LOW_PLAYED_RATE * 100} (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.`,
  );
  o.push('');
  o.push(
    '| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |',
  );
  o.push('|---|---|---|---|---|---|---|');
  for (const c of s.cards) {
    const flag =
      c.flag === 'never'
        ? 'HİÇ OYNANMADI'
        : c.flag === 'low'
          ? 'DÜŞÜK'
          : c.flag === 'always'
            ? 'HER MAÇ'
            : '';
    o.push(
      `| ${c.heavy ? '★ ' : ''}${c.name} (\`${c.id}\`) | ${c.cost} | ${c.inDeck} | ${pct(c.playedRate)} | ${num(c.avgPlaysWhenInDeck)} | ${pct(c.winRateWhenPlayed)} | ${flag} |`,
    );
  }
  o.push('');
  return o.join('\n');
}

const CSV_HEADER = [
  'pass',
  'seed',
  'p0Archetype',
  'p1Archetype',
  'p0Profile',
  'p1Profile',
  'firstPlayer',
  'winner',
  'endReason',
  'rounds',
  'arenaSeen',
  'fatigueSeen',
  'reshuffleSeen',
  'unusedMpP0',
  'unusedMpP1',
  'turnsP0',
  'turnsP1',
  'cardsPlayedP0',
  'cardsPlayedP1',
  'deadOpeningP0',
  'deadOpeningP1',
  'critsP0',
  'critsP1',
  'evadesP0',
  'evadesP1',
  'poisonDamageP0',
  'poisonDamageP1',
];

export function renderCsv(records: MatchRecord[]): string {
  const rows = records.map((r) =>
    [
      r.pass,
      r.seed,
      r.p0Archetype,
      r.p1Archetype,
      r.p0Profile,
      r.p1Profile,
      r.firstPlayer,
      r.winner ?? 'draw',
      r.endReason,
      r.rounds,
      r.arenaSeen,
      r.fatigueSeen,
      r.reshuffleSeen,
      r.unusedMp[0],
      r.unusedMp[1],
      r.turns[0],
      r.turns[1],
      r.cardsPlayed[0],
      r.cardsPlayed[1],
      r.deadOpening[0],
      r.deadOpening[1],
      r.crits[0],
      r.crits[1],
      r.evades[0],
      r.evades[1],
      r.poisonDamage[0],
      r.poisonDamage[1],
    ].join(','),
  );
  return `${[CSV_HEADER.join(','), ...rows].join('\n')}\n`;
}
