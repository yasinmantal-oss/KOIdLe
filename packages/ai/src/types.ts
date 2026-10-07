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
  criticalValue: number;
  evadeValue: number;
  /** Donma'nın AI için değeri: Ateş kombosunun kurulumu olduğu için pozitif. */
  freezeValue: number;
  /** Boşa giden iyileşmenin cezası (tam HP'de oynanan heal kartı). */
  wastedHeal: number;
}

export const AI_PROFILES: readonly AiProfile[] = ['aggressive', 'balanced', 'defensive'];

/** Skor fonksiyonu: yüksek = `me` için iyi. */
export type Scorer = (state: BattleState, me: PlayerIndex, weights: Weights) => number;

/** Tur planı parametreleri; değerler content/ai-planner.json'dan gelir. */
export interface Planner {
  depth: number;
  beam: number;
}
