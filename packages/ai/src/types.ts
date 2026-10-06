import type { BattleState, PlayerIndex } from '@koidle/rules';

export type AiProfile = 'aggressive' | 'balanced' | 'defensive';

/** Ağırlıklar content/ai-profiles.json'dan gelir; AI paketi değer içermez. */
export interface Weights {
  enemyDamage: number;
  selfDamage: number;
  shield: number;
  enemyShield: number;
  status: number;
  hand: number;
}

export const AI_PROFILES: readonly AiProfile[] = ['aggressive', 'balanced', 'defensive'];

/** Skor fonksiyonu: yüksek = `me` için iyi. */
export type Scorer = (state: BattleState, me: PlayerIndex, weights: Weights) => number;

/** Tur planı parametreleri; değerler content/ai-planner.json'dan gelir. */
export interface Planner {
  depth: number;
  beam: number;
}
