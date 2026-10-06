import { cloneState } from './clone';
import { resolveEffect } from './effects';
import { endTurn } from './turn';
import type { Action, ApplyResult, BattleEvent, BattleState } from './types';

export type IllegalReason = 'BATTLE_OVER' | 'NOT_YOUR_TURN' | 'CARD_NOT_IN_HAND' | 'NOT_ENOUGH_MP';

export class IllegalActionError extends Error {
  constructor(readonly reason: IllegalReason) {
    super(reason);
    this.name = 'IllegalActionError';
  }
}

export function validateAction(state: BattleState, action: Action): IllegalReason | null {
  if (state.result) return 'BATTLE_OVER';
  if (action.player !== state.active) return 'NOT_YOUR_TURN';
  if (action.type === 'END_TURN') return null;
  const pl = state.players[action.player];
  const inst = pl.hand.find((c) => c.iid === action.iid);
  if (!inst) return 'CARD_NOT_IN_HAND';
  const def = state.cards[inst.cardId];
  if (!def || def.cost > pl.mp) return 'NOT_ENOUGH_MP';
  return null;
}

/** Saf: girdi state asla değişmez. Geçersiz aksiyonda IllegalActionError fırlatır. */
export function apply(state: BattleState, action: Action): ApplyResult {
  const reason = validateAction(state, action);
  if (reason) throw new IllegalActionError(reason);
  const next = cloneState(state);
  const events: BattleEvent[] = [];

  if (action.type === 'END_TURN') {
    endTurn(next, events);
    return { state: next, events };
  }

  const pl = next.players[action.player];
  const index = pl.hand.findIndex((c) => c.iid === action.iid);
  const [inst] = pl.hand.splice(index, 1);
  if (!inst) throw new IllegalActionError('CARD_NOT_IN_HAND');
  const def = next.cards[inst.cardId];
  if (!def) throw new IllegalActionError('CARD_NOT_IN_HAND');
  pl.mp -= def.cost;
  events.push({
    type: 'CARD_PLAYED',
    player: action.player,
    iid: inst.iid,
    cardId: def.id,
    cost: def.cost,
  });
  for (const effect of def.effects) {
    resolveEffect(next, action.player, effect, events);
    if (next.result) break;
  }
  pl.cardsPlayedThisTurn += 1;
  // Oynanan kart efektler çözüldükten sonra ıskartaya gider; kendi çekişiyle geri karışmaz.
  pl.discard.push(inst);
  return { state: next, events };
}
