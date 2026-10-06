import { validateAction } from './engine';
import type { Action, BattleState } from './types';

/** Aktif oyuncunun yasal aksiyonları: el sırasıyla oynanabilir kartlar, sonra END_TURN. */
export function legalActions(state: BattleState): Action[] {
  if (state.result) return [];
  const player = state.active;
  const actions: Action[] = [];
  for (const c of state.players[player].hand) {
    const action: Action = { type: 'PLAY_CARD', player, iid: c.iid };
    if (validateAction(state, action) === null) actions.push(action);
  }
  actions.push({ type: 'END_TURN', player });
  return actions;
}
