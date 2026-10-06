import {
  type Action,
  apply,
  type BattleState,
  legalActions,
  type PlayerIndex,
} from '@koidle/rules';
import type { Planner, Scorer, Weights } from './types';

/** Tek adım, tek aday: Görev 6 öncesi açgözlü davranışın birebir karşılığı. */
export const GREEDY: Planner = { depth: 1, beam: 1 };

interface Node {
  state: BattleState;
  /** Bu düğüme götüren planın ilk aksiyonu. */
  first: Action | null;
  score: number;
}

/**
 * Işın araması: yalnız kendi turundaki kart dizilerine bakar. Kökün skorunu kesin aşan en iyi
 * yaprağın planının ilk aksiyonunu döndürür; hiçbiri aşmıyorsa turu bitirir. Eşitlikte
 * `legalActions` sırası kazanır (kararlı sıralama + kesin büyüklük).
 * `view` redactForAi çıktısı olmalıdır (gizli bilgi kuralı).
 */
export function planAction(
  view: BattleState,
  me: PlayerIndex,
  weights: Weights,
  planner: Planner,
  scorer: Scorer,
): Action {
  let best: Action = { type: 'END_TURN', player: me };
  let bestScore = scorer(view, me, weights);
  let frontier: Node[] = [{ state: view, first: null, score: bestScore }];
  for (let depth = 0; depth < planner.depth; depth++) {
    const children: Node[] = [];
    for (const node of frontier) {
      for (const action of legalActions(node.state)) {
        if (action.type === 'END_TURN') continue;
        const next = apply(node.state, action).state;
        const first = node.first ?? action;
        const score = scorer(next, me, weights);
        if (score > bestScore) {
          best = first;
          bestScore = score;
        }
        if (!next.result && next.active === me) children.push({ state: next, first, score });
      }
    }
    frontier = children.sort((a, b) => b.score - a.score).slice(0, planner.beam);
    if (frontier.length === 0) break;
  }
  return best;
}
