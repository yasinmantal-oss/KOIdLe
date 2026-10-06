import {
  type Action,
  apply,
  type BattleState,
  legalActions,
  type PlayerIndex,
} from '@koidle/rules';
import { evaluate } from './evaluate';
import { redactForAi } from './redact';
import type { Weights } from './types';

/**
 * Açgözlü tek adım: oyuncuyla aynı yasal aksiyon listesinden her kartı gizli bilgisi silinmiş
 * kopyada dener; skoru en çok artıran kartı oynar, hiçbiri artırmıyorsa turu bitirir.
 * Eşitlikte legalActions sırası kazanır (deterministik).
 */
export type Scorer = (state: BattleState, me: PlayerIndex, weights: Weights) => number;

export function chooseAction(
  state: BattleState,
  me: PlayerIndex,
  weights: Weights,
  scorer: Scorer = evaluate,
): Action {
  if (state.result) throw new Error('battle is over');
  if (state.active !== me) throw new Error('not the AI turn');
  const view = redactForAi(state, me);
  let best: Action = { type: 'END_TURN', player: me };
  let bestScore = scorer(view, me, weights);
  for (const action of legalActions(view)) {
    if (action.type === 'END_TURN') continue;
    const score = scorer(apply(view, action).state, me, weights);
    if (score > bestScore) {
      best = action;
      bestScore = score;
    }
  }
  return best;
}
