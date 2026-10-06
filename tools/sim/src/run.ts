import { AI_PROFILES, type AiProfile, chooseAction, type Planner, type Weights } from '@koidle/ai';
import { ARCHETYPE_IDS, type ArchetypeId } from '@koidle/content-schema';
import {
  apply,
  type BattleConfig,
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
  /** Zincir bonusu tetiklenme sayısı (koltuk başına). */
  chains: [number, number];
  /** Gizli'nin harcanma sayısı (koltuk başına). */
  stealthUses: [number, number];
  /** Koltuğun Zehir'inin rakibe verdiği toplam hasar. */
  poisonDamage: [number, number];
  /** kart id → [P0 kaç kez oynadı, P1 kaç kez oynadı]; yalnız oynanan kartlar yazılır. */
  plays: Record<string, [number, number]>;
}

/** Güvenlik sınırı: bir maçta bundan fazla aksiyon olursa AI döngüde demektir. */
const MAX_ACTIONS = 2000;

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
    chains: [0, 0],
    stealthUses: [0, 0],
    poisonDamage: [0, 0],
    plays: {},
  };

  let actions = 0;
  for (;;) {
    for (const e of events) {
      if (e.type === 'DAMAGE_DEALT' && e.source === 'arena') rec.arenaSeen = true;
      if (e.type === 'DAMAGE_DEALT' && e.source === 'fatigue') rec.fatigueSeen = true;
      if (e.type === 'DAMAGE_DEALT' && e.source === 'poison') {
        // Zehir hedefe verilir; hasarı veren koltuk rakiptir.
        rec.poisonDamage[e.target === 0 ? 1 : 0] += e.amount;
      }
      if (e.type === 'DECK_RESHUFFLED') rec.reshuffleSeen = true;
      if (e.type === 'CHAIN_TRIGGERED') rec.chains[e.player] += 1;
      if (e.type === 'STEALTH_USED') rec.stealthUses[e.player] += 1;
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

/** 3×3 job eşleşmesi (balanced vs balanced) × seed listesi. Varsayılan: 100 seed → 900 maç. */
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

/** 3×3 profil eşleşmesi × 3 aynalı job × seed listesi. Varsayılan: 10 seed → 270 maç. */
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
