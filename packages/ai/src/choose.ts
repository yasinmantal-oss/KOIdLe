import type { Action, BattleState, PlayerIndex } from '@koidle/rules';
import { evaluate } from './evaluate';
import { GREEDY, planAction } from './plan';
import { redactForAi } from './redact';
import type { Planner, Scorer, Weights } from './types';

export interface ChooseOptions {
  /** Varsayılan: GREEDY (1 kart derinlik). */
  planner?: Planner;
  /** Varsayılan: `evaluate`. Testlerde "hileci" skor vermek için. */
  scorer?: Scorer;
}

/**
 * AI'ın bir sonraki aksiyonu. Durum önce gizli bilgisi silinmiş görünüme çevrilir (C6), arama
 * orada yapılır. Eşitlikte legalActions sırası kazanır (deterministik).
 */
export function chooseAction(
  state: BattleState,
  me: PlayerIndex,
  weights: Weights,
  options: ChooseOptions = {},
): Action {
  if (state.result) throw new Error('battle is over');
  if (state.active !== me) throw new Error('not the AI turn');
  return planAction(
    redactForAi(state, me),
    me,
    weights,
    options.planner ?? GREEDY,
    options.scorer ?? evaluate,
  );
}
