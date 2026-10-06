import { AI_PROFILES, type AiProfile } from '@koidle/ai';
import type { BattleConfig, CardDef, EndReason } from '@koidle/rules';
import type { MatchRecord } from './run';

// Simülasyon "eğlenceli mi?" kararı vermez. Kabul/red eşiği yok (C5); sayılar Gate 1'de yorumlanır.

export interface CardStat {
  id: string;
  name: string;
  cost: number;
  /** Oyuncu-maçlarının (her maç 2 oyuncu) kaçında en az bir kez oynandı. */
  playedRate: number;
  avgPlaysPerPlayerMatch: number;
  /** Kartı oynayan oyuncunun o maçlardaki kazanma oranı. */
  winRateWhenPlayed: number | null;
  flag: 'never' | 'always' | null;
}

export interface SimSummary {
  matches: number;
  rounds: { mean: number; median: number; min: number; max: number };
  firstPlayerWinRate: number;
  drawRate: number;
  arenaRate: number;
  fatigueRate: number;
  bothArenaAndFatigueReachedRate: number;
  reshuffleRate: number;
  endReason: Record<EndReason, number>;
  /** satır profilinin sütun profiline karşı kazanma oranı (iki koltuk birleşik); ayna maçta null */
  profileMatrix: Record<AiProfile, Record<AiProfile, number | null>>;
  unusedMpPerTurn: { overall: number; byProfile: Record<AiProfile, number> };
  cards: CardStat[];
}

const rate = (n: number, d: number): number => (d === 0 ? 0 : n / d);

export function summarize(records: MatchRecord[], cards: CardDef[]): SimSummary {
  const n = records.length;
  const rounds = records.map((r) => r.rounds).sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 ? (rounds[mid] ?? 0) : ((rounds[mid - 1] ?? 0) + (rounds[mid] ?? 0)) / 2;

  const endReason: Record<EndReason, number> = {
    normalDamage: 0,
    fatigue: 0,
    arenaCollapse: 0,
    roundCap: 0,
  };
  for (const r of records) endReason[r.endReason] += 1;

  const matrix = {} as SimSummary['profileMatrix'];
  for (const a of AI_PROFILES) {
    matrix[a] = {} as Record<AiProfile, number | null>;
    for (const b of AI_PROFILES) {
      if (a === b) {
        matrix[a][b] = null;
        continue;
      }
      let wins = 0;
      let games = 0;
      for (const r of records) {
        if (r.p0Profile === a && r.p1Profile === b) {
          games++;
          if (r.winner === 0) wins++;
        } else if (r.p0Profile === b && r.p1Profile === a) {
          games++;
          if (r.winner === 1) wins++;
        }
      }
      matrix[a][b] = rate(wins, games);
    }
  }

  let unused = 0;
  let turns = 0;
  const byProfile = {} as Record<AiProfile, number>;
  for (const p of AI_PROFILES) {
    let u = 0;
    let t = 0;
    for (const r of records) {
      for (const seat of [0, 1] as const) {
        if ((seat === 0 ? r.p0Profile : r.p1Profile) !== p) continue;
        u += r.unusedMp[seat];
        t += r.turns[seat];
      }
    }
    byProfile[p] = rate(u, t);
    unused += u;
    turns += t;
  }

  const playerMatches = n * 2;
  const cardStats: CardStat[] = cards.map((c) => {
    let played = 0;
    let plays = 0;
    let wins = 0;
    for (const r of records) {
      for (const seat of [0, 1] as const) {
        const k = r.plays[c.id]?.[seat] ?? 0;
        plays += k;
        if (k > 0) {
          played++;
          if (r.winner === seat) wins++;
        }
      }
    }
    const playedRate = rate(played, playerMatches);
    return {
      id: c.id,
      name: c.name,
      cost: c.cost,
      playedRate,
      avgPlaysPerPlayerMatch: rate(plays, playerMatches),
      winRateWhenPlayed: played === 0 ? null : wins / played,
      flag: played === 0 ? 'never' : playedRate >= 0.99 ? 'always' : null,
    };
  });

  return {
    matches: n,
    rounds: {
      mean: rate(
        rounds.reduce((a, b) => a + b, 0),
        n,
      ),
      median,
      min: rounds[0] ?? 0,
      max: rounds[n - 1] ?? 0,
    },
    firstPlayerWinRate: rate(records.filter((r) => r.winner === r.firstPlayer).length, n),
    drawRate: rate(records.filter((r) => r.winner === null).length, n),
    arenaRate: rate(records.filter((r) => r.arenaSeen).length, n),
    fatigueRate: rate(records.filter((r) => r.fatigueSeen).length, n),
    bothArenaAndFatigueReachedRate: rate(
      records.filter((r) => r.arenaSeen && r.fatigueSeen).length,
      n,
    ),
    reshuffleRate: rate(records.filter((r) => r.reshuffleSeen).length, n),
    endReason,
    profileMatrix: matrix,
    unusedMpPerTurn: { overall: rate(unused, turns), byProfile },
    cards: cardStats,
  };
}

const pct = (x: number | null): string => (x === null ? '—' : `%${(x * 100).toFixed(1)}`);
const num = (x: number): string => x.toFixed(2);

export function renderMarkdown(s: SimSummary, config: BattleConfig, seeds: number[]): string {
  const o: string[] = [];
  o.push('# Simülasyon Raporu (AI vs AI)');
  o.push('');
  o.push(
    '> `pnpm sim` ile üretilir. Simülasyon "eğlenceli mi?" kararı vermez; bariz matematik hatası ve anlamsız davranış arar. Otomatik kabul/red eşiği yoktur (C5).',
  );
  o.push(
    `> ${s.matches} maç: 3×3 profil eşleşmesi × ${seeds.length} seed (${seeds[0]}–${seeds.at(-1)}). Warrior vs Warrior, varsayılan deste.`,
  );
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
  o.push('## Bitiş nedeni (endReason)');
  o.push('');
  o.push('| Neden | Maç | Oran |');
  o.push('|---|---|---|');
  for (const [k, v] of Object.entries(s.endReason))
    o.push(`| ${k} | ${v} | ${pct(v / s.matches)} |`);
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
  o.push('## Kartlar');
  o.push('');
  o.push(
    'Oynanma oranı: oyuncu-maçlarının (maç × 2) kaçında en az bir kez oynandı. Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.',
  );
  o.push('');
  o.push('| Kart | MP | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |');
  o.push('|---|---|---|---|---|---|');
  for (const c of s.cards) {
    const flag = c.flag === 'never' ? 'HİÇ OYNANMADI' : c.flag === 'always' ? 'HER MAÇ' : '';
    o.push(
      `| ${c.name} (\`${c.id}\`) | ${c.cost} | ${pct(c.playedRate)} | ${num(c.avgPlaysPerPlayerMatch)} | ${pct(c.winRateWhenPlayed)} | ${flag} |`,
    );
  }
  o.push('');
  return o.join('\n');
}

const CSV_HEADER = [
  'seed',
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
];

export function renderCsv(records: MatchRecord[]): string {
  const rows = records.map((r) =>
    [
      r.seed,
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
    ].join(','),
  );
  return `${[CSV_HEADER.join(','), ...rows].join('\n')}\n`;
}
