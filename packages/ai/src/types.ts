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
