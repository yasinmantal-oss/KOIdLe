import { AI_PROFILES, type AiProfile, chooseAction, type Weights } from '@koidle/ai';
import {
  apply,
  type BattleConfig,
  type CardDef,
  createBattle,
  type EndReason,
  type PlayerIndex,
} from '@koidle/rules';

export interface SimInput {
  config: BattleConfig;
  cards: CardDef[];
  deck: string[];
  profiles: Record<AiProfile, Weights>;
}

export interface MatchRecord {
  seed: number;
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
  /** kart id → [P0 kaç kez oynadı, P1 kaç kez oynadı] */
  plays: Record<string, [number, number]>;
}

/** Güvenlik sınırı: bir maçta bundan fazla aksiyon olursa AI döngüde demektir. */
const MAX_ACTIONS = 2000;

export function playMatch(
  input: SimInput,
  seed: number,
  p0: AiProfile,
  p1: AiProfile,
): MatchRecord {
  const { config, cards, deck, profiles } = input;
  let { state, events } = createBattle({
    config,
    cards,
    decks: [deck, deck],
    names: [p0, p1],
    seed,
  });
  const weights = [profiles[p0], profiles[p1]] as const;
  const rec: MatchRecord = {
    seed,
    p0Profile: p0,
    p1Profile: p1,
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
    plays: Object.fromEntries(cards.map((c) => [c.id, [0, 0]])),
  };

  let actions = 0;
  for (;;) {
    for (const e of events) {
      if (e.type === 'DAMAGE_DEALT' && e.source === 'arena') rec.arenaSeen = true;
      if (e.type === 'DAMAGE_DEALT' && e.source === 'fatigue') rec.fatigueSeen = true;
      if (e.type === 'DECK_RESHUFFLED') rec.reshuffleSeen = true;
      if (e.type === 'TURN_ENDED') {
        rec.unusedMp[e.player] += e.unusedMp;
        rec.turns[e.player] += 1;
      }
      if (e.type === 'CARD_PLAYED') {
        rec.cardsPlayed[e.player] += 1;
        const slot = rec.plays[e.cardId];
        if (slot) slot[e.player] += 1;
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
    ({ state, events } = apply(state, chooseAction(state, me, weights[me])));
  }
}

/** 3×3 profil eşleşmesi × seed listesi. Varsayılan: 100 seed → 900 maç. */
export function runMatrix(input: SimInput, seeds: number[]): MatchRecord[] {
  const out: MatchRecord[] = [];
  for (const p0 of AI_PROFILES) {
    for (const p1 of AI_PROFILES) {
      for (const seed of seeds) out.push(playMatch(input, seed, p0, p1));
    }
  }
  return out;
}

export const seedRange = (from: number, count: number): number[] =>
  Array.from({ length: count }, (_, i) => from + i);
