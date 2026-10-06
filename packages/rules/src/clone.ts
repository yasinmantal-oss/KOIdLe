import type { BattleState } from './types';

// State saf JSON olmak zorunda; JSON kopyası bunu aynı zamanda garanti eder.
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Savaş durumu kopyası. `cards` (kart tanımları) savaş boyunca değişmez, bu yüzden paylaşılır;
 * en büyük parça odur ve AI araması çok sayıda apply çağırır. Gerisi derin kopyadır.
 */
export function cloneState(state: BattleState): BattleState {
  const { cards, ...rest } = state;
  return { ...clone(rest), cards };
}
