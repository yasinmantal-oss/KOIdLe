import type { BattleEvent, BattleState, PlayerIndex, PlayerState, StatusId } from './types';

export function statusAmount(pl: PlayerState, id: StatusId): number {
  return pl.statuses.find((s) => s.id === id)?.amount ?? 0;
}

/**
 * K7: üst üste binmez. Gelen değer mevcut değerden büyük veya eşitse değer güncellenir ve süre
 * yenilenir; küçükse yok sayılır. Süre config'den gelir (N2).
 */
export function applyStatus(
  state: BattleState,
  p: PlayerIndex,
  id: StatusId,
  amount: number,
  events: BattleEvent[],
): void {
  const pl = state.players[p];
  const duration = state.config.statuses[id].duration;
  const existing = pl.statuses.find((s) => s.id === id);
  if (existing && amount < existing.amount) {
    events.push({ type: 'STATUS_IGNORED', player: p, status: id, amount });
    return;
  }
  if (existing) {
    existing.amount = amount;
    existing.turnsLeft = duration;
  } else {
    pl.statuses.push({ id, amount, turnsLeft: duration });
  }
  events.push({ type: 'STATUS_APPLIED', player: p, status: id, amount, duration });
}

/** Etkilenen kahramanın kendi tur sonunda süreler 1 düşer; 0 olan kalkar. */
export function tickStatuses(state: BattleState, p: PlayerIndex, events: BattleEvent[]): void {
  const pl = state.players[p];
  for (const s of pl.statuses) s.turnsLeft -= 1;
  for (const s of pl.statuses) {
    if (s.turnsLeft <= 0) events.push({ type: 'STATUS_EXPIRED', player: p, status: s.id });
  }
  pl.statuses = pl.statuses.filter((s) => s.turnsLeft > 0);
}
