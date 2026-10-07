import { AI_PROFILES, type AiProfile, chooseAction, type Planner, type Weights } from '@koidle/ai';
import { ARCHETYPE_IDS, type ArchetypeId } from '@koidle/content-schema';
import {
  apply,
  type BattleConfig,
  type BattleEvent,
  type CardDef,
  createBattle,
  type EndReason,
  legalActions,
  type PlayerIndex,
} from '@koidle/rules';

export interface SimInput {
  config: BattleConfig;
  cards: CardDef[];
  decks: Record<ArchetypeId, string[]>;
  profiles: Record<AiProfile, Weights>;
  planner: Planner;
}

export interface Side {
  archetype: ArchetypeId;
  profile: AiProfile;
}

/** job = job eşleşmeleri (temel ölçüm), profile = profil eşleşmeleri. */
export type Pass = 'job' | 'profile';

export interface MatchRecord {
  seed: number;
  pass: Pass;
  p0Archetype: ArchetypeId;
  p1Archetype: ArchetypeId;
  p0Profile: AiProfile;
  p1Profile: AiProfile;
  firstPlayer: PlayerIndex;
  winner: PlayerIndex | null;
  endReason: EndReason;
  rounds: number;
  arenaSeen: boolean;
  fatigueSeen: boolean;
  reshuffleSeen: boolean;
  unusedMp: [number, number];
  turns: [number, number];
  cardsPlayed: [number, number];
  /** Oyuncunun ilk 2 turunda, tur başında oynanabilir kart yoktu (yalnız END_TURN yasal). */
  deadOpening: [boolean, boolean];
  /** Kritik'in harcanma sayısı (koltuk başına). */
  crits: [number, number];
  /** Kaçınma'nın bir vuruşu sıfırlama sayısı (koltuk başına, kaçınan koltuk). */
  evades: [number, number];
  /** Koltuğun Zehir'inin rakibe verdiği toplam hasar. */
  poisonDamage: [number, number];
  /** Koltuğun rakibe uyguladığı Donma sayısı (STATUS_APPLIED + freeze). */
  freezeApplied: [number, number];
  /** Koltuğun Ateş kartıyla tükettiği Donma sayısı = Ateş bonusunun tetiklenme anı. */
  fireBonus: [number, number];
  /** Koltuğun rakibin maks HP'sinde yaptığı kalıcı azaltma toplamı (MAX_HP_REDUCED amount). */
  maxHpReduced: [number, number];
  /** Koltuğun taşan iyileşmesinden gelen Kalkan (SHIELD_GAINED, hemen öncesi HEALED). */
  overhealShield: [number, number];
  /** kart id → [P0 kaç kez oynadı, P1 kaç kez oynadı]; yalnız oynanan kartlar yazılır. */
  plays: Record<string, [number, number]>;
}

/** Güvenlik sınırı: bir maçta bundan fazla aksiyon olursa AI döngüde demektir. */
const MAX_ACTIONS = 2000;

/** Faz 2b sayaçlarının olay topu başına koltuk artışları. */
export type Faz2bDeltas = Pick<
  MatchRecord,
  'freezeApplied' | 'fireBonus' | 'maxHpReduced' | 'overhealShield'
>;

/**
 * Faz 2b sayaçlarını olaylardan türetir (saf). Saldırgan sayaçlar (Donma uygulama, Ateş bonusu,
 * maks HP azaltma) eylemi yapan koltuk adına yazılır: bu olaylarda `player` statünün/hedefin
 * sahibidir, yapan ise rakiptir. Taşan iyileşme Kalkanı ise Kalkanı alan koltuk adına yazılır.
 */
export function faz2bDeltas(events: BattleEvent[]): Faz2bDeltas {
  const d: Faz2bDeltas = {
    freezeApplied: [0, 0],
    fireBonus: [0, 0],
    maxHpReduced: [0, 0],
    overhealShield: [0, 0],
  };
  const foe = (p: PlayerIndex): PlayerIndex => (p === 0 ? 1 : 0);
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (e === undefined) continue;
    if (e.type === 'STATUS_APPLIED' && e.status === 'freeze') d.freezeApplied[foe(e.player)] += 1;
    if (e.type === 'STATUS_CONSUMED' && e.status === 'freeze') d.fireBonus[foe(e.player)] += 1;
    if (e.type === 'MAX_HP_REDUCED') d.maxHpReduced[foe(e.player)] += e.amount;
    if (e.type === 'SHIELD_GAINED') {
      // Motor taşan iyileşmenin Kalkanını HEALED olayının hemen ardından yayar
      // (`effects.ts` heal dalı); başka bir kaynak araya giremez.
      const prev = events[i - 1];
      if (prev?.type === 'HEALED' && prev.player === e.player)
        d.overhealShield[e.player] += e.amount;
    }
  }
  return d;
}

export function playMatch(
  input: SimInput,
  seed: number,
  p0: Side,
  p1: Side,
  pass: Pass,
): MatchRecord {
  const { config, cards, decks, profiles, planner } = input;
  const sides = [p0, p1] as const;
  let { state, events } = createBattle({
    config,
    cards,
    decks: [decks[p0.archetype], decks[p1.archetype]],
    names: [`${p0.archetype}/${p0.profile}`, `${p1.archetype}/${p1.profile}`],
    seed,
  });
  const rec: MatchRecord = {
    seed,
    pass,
    p0Archetype: p0.archetype,
    p1Archetype: p1.archetype,
    p0Profile: p0.profile,
    p1Profile: p1.profile,
    firstPlayer: state.firstPlayer,
    winner: null,
    endReason: 'roundCap',
    rounds: 0,
    arenaSeen: false,
    fatigueSeen: false,
    reshuffleSeen: false,
    unusedMp: [0, 0],
    turns: [0, 0],
    cardsPlayed: [0, 0],
    deadOpening: [false, false],
    crits: [0, 0],
    evades: [0, 0],
    poisonDamage: [0, 0],
    freezeApplied: [0, 0],
    fireBonus: [0, 0],
    maxHpReduced: [0, 0],
    overhealShield: [0, 0],
    plays: {},
  };

  let actions = 0;
  for (;;) {
    const faz2b = faz2bDeltas(events);
    for (const seat of [0, 1] as const) {
      rec.freezeApplied[seat] += faz2b.freezeApplied[seat];
      rec.fireBonus[seat] += faz2b.fireBonus[seat];
      rec.maxHpReduced[seat] += faz2b.maxHpReduced[seat];
      rec.overhealShield[seat] += faz2b.overhealShield[seat];
    }
    for (const e of events) {
      if (e.type === 'DAMAGE_DEALT' && e.source === 'arena') rec.arenaSeen = true;
      if (e.type === 'DAMAGE_DEALT' && e.source === 'fatigue') rec.fatigueSeen = true;
      if (e.type === 'DAMAGE_DEALT' && e.source === 'poison') {
        // Zehir hedefe verilir; hasarı veren koltuk rakiptir.
        rec.poisonDamage[e.target === 0 ? 1 : 0] += e.amount;
      }
      if (e.type === 'DECK_RESHUFFLED') rec.reshuffleSeen = true;
      if (e.type === 'CRIT_USED') rec.crits[e.player] += 1;
      if (e.type === 'EVADED') rec.evades[e.player] += 1;
      if (e.type === 'TURN_ENDED') {
        rec.unusedMp[e.player] += e.unusedMp;
        rec.turns[e.player] += 1;
      }
      if (e.type === 'CARD_PLAYED') {
        rec.cardsPlayed[e.player] += 1;
        let slot = rec.plays[e.cardId];
        if (!slot) {
          slot = [0, 0];
          rec.plays[e.cardId] = slot;
        }
        slot[e.player] += 1;
      }
      if (e.type === 'BATTLE_ENDED') {
        rec.winner = e.winner;
        rec.endReason = e.reason;
        rec.rounds = e.round;
      }
    }
    if (state.result) return rec;
    if (++actions > MAX_ACTIONS) throw new Error(`seed ${seed}: ${MAX_ACTIONS} aksiyonu aştı`);
    const me = state.active;
    const pl = state.players[me];
    // Ölü açılış: ilk 2 turda, tur başında (henüz kart oynanmadan) yalnız END_TURN yasal.
    if (pl.turnsTaken <= 2 && pl.cardsPlayedThisTurn === 0 && legalActions(state).length === 1) {
      rec.deadOpening[me] = true;
    }
    const profile = profiles[sides[me].profile];
    ({ state, events } = apply(state, chooseAction(state, me, profile, { planner })));
  }
}

/** ARCHETYPE_IDS × ARCHETYPE_IDS job eşleşmesi (balanced vs balanced) × seed listesi. Varsayılan: 100 seed → 2500 maç. */
export function runJobMatrix(input: SimInput, seeds: number[]): MatchRecord[] {
  const out: MatchRecord[] = [];
  for (const a0 of ARCHETYPE_IDS) {
    for (const a1 of ARCHETYPE_IDS) {
      for (const seed of seeds) {
        out.push(
          playMatch(
            input,
            seed,
            { archetype: a0, profile: 'balanced' },
            { archetype: a1, profile: 'balanced' },
            'job',
          ),
        );
      }
    }
  }
  return out;
}

/** AI_PROFILES × AI_PROFILES profil eşleşmesi × ARCHETYPE_IDS aynalı job × seed listesi. Varsayılan: 10 seed → 450 maç. */
export function runProfileMatrix(input: SimInput, seeds: number[]): MatchRecord[] {
  const out: MatchRecord[] = [];
  for (const archetype of ARCHETYPE_IDS) {
    for (const p0 of AI_PROFILES) {
      for (const p1 of AI_PROFILES) {
        for (const seed of seeds) {
          out.push(
            playMatch(
              input,
              seed,
              { archetype, profile: p0 },
              { archetype, profile: p1 },
              'profile',
            ),
          );
        }
      }
    }
  }
  return out;
}

export const seedRange = (from: number, count: number): number[] =>
  Array.from({ length: count }, (_, i) => from + i);
