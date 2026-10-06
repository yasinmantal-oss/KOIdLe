import type { BattleEvent, BattleState, PlayerIndex, PlayerState, StatusId } from './types';

export function statusAmount(pl: PlayerState, id: StatusId): number {
  return pl.statuses.find((s) => s.id === id)?.amount ?? 0;
}

/**
 * Statü uygulama kuralları:
 * - Zayıflık (K7): gelen değer mevcuttan büyük/eşitse değer güncellenir ve süre yenilenir; küçükse yok sayılır.
 * - Güç, Zehir: toplanır, config'deki üst sınırda kesilir.
 * - Kritik, Kaçınma: tek seferlik bayrak (değer 1); tekrar verilirse değişmez.
 */
export function applyStatus(
  state: BattleState,
  p: PlayerIndex,
  id: StatusId,
  amount: number,
  events: BattleEvent[],
): void {
  const pl = state.players[p];
  const cfg = state.config.statuses;
  const existing = pl.statuses.find((s) => s.id === id);
  let duration: number | null = null;
  let next = amount;
  if (id === 'weak') {
    duration = cfg.weak.duration;
    if (existing && amount < existing.amount) {
      events.push({ type: 'STATUS_IGNORED', player: p, status: id, amount });
      return;
    }
  } else if (id === 'strength' || id === 'poison') {
    next = Math.min((existing?.amount ?? 0) + amount, cfg[id].max);
  } else {
    next = 1;
  }
  if (existing) {
    existing.amount = next;
    existing.turnsLeft = duration;
  } else {
    pl.statuses.push({ id, amount: next, turnsLeft: duration });
  }
  events.push({ type: 'STATUS_APPLIED', player: p, status: id, amount: next, duration });
}

/** Etkilenen kahramanın kendi tur sonunda süreli statülerin (Zayıflık) süresi 1 düşer; 0 olan kalkar. */
export function tickStatuses(state: BattleState, p: PlayerIndex, events: BattleEvent[]): void {
  const pl = state.players[p];
  for (const s of pl.statuses) if (s.turnsLeft !== null) s.turnsLeft -= 1;
  for (const s of pl.statuses) {
    if (s.turnsLeft !== null && s.turnsLeft <= 0) {
      events.push({ type: 'STATUS_EXPIRED', player: p, status: s.id });
    }
  }
  pl.statuses = pl.statuses.filter((s) => s.turnsLeft === null || s.turnsLeft > 0);
}

/** Statüyü hemen kaldırır (Güç/Kritik/Kaçınma kullanılınca düşer). */
export function removeStatus(pl: PlayerState, id: StatusId): void {
  pl.statuses = pl.statuses.filter((s) => s.id !== id);
}
