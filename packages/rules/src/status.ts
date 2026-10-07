import { assertNever } from './assert-never';
import type { BattleEvent, BattleState, PlayerIndex, PlayerState, StatusId } from './types';
import { NEGATIVE_STATUSES } from './types';

export function statusAmount(pl: PlayerState, id: StatusId): number {
  return pl.statuses.find((s) => s.id === id)?.amount ?? 0;
}

/** Statünün tur süresi (config'ten); null = süresiz (kullanılana kadar). */
export function statusDuration(state: BattleState, id: StatusId): number | null {
  const cfg = state.config.statuses;
  switch (id) {
    case 'weak':
      return cfg.weak.duration;
    case 'freeze':
      return cfg.freeze.duration;
    case 'strength':
    case 'poison':
    case 'critical':
    case 'evade':
      return null;
    default:
      return assertNever(id);
  }
}

/**
 * Statü uygulama kuralları:
 * - Zayıflık, Donma (K7): gelen değer mevcuttan büyük/eşitse değer güncellenir ve süre yenilenir;
 *   küçükse yok sayılır. Donma'nın tek başına etkisi yoktur; Ateş kartları tüketir.
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
  const duration = statusDuration(state, id);
  let next = amount;
  if (id === 'weak' || id === 'freeze') {
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

/** Etkilenen kahramanın kendi tur sonunda süreli statülerin süresi 1 düşer; 0 olan kalkar. */
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

/** Statüyü hemen kaldırır (Güç/Kritik/Kaçınma kullanılınca, Ateş Donma'yı yakınca düşer). */
export function removeStatus(pl: PlayerState, id: StatusId): void {
  pl.statuses = pl.statuses.filter((s) => s.id !== id);
}

/** Statüyü tüketir ve olay yazar; statü yoksa hiçbir şey yapmaz (yan etkisiz hale getirir). */
export function consumeStatus(
  pl: PlayerState,
  p: PlayerIndex,
  id: StatusId,
  events: BattleEvent[],
): boolean {
  if (statusAmount(pl, id) <= 0) return false;
  removeStatus(pl, id);
  events.push({ type: 'STATUS_CONSUMED', player: p, status: id });
  return true;
}

/** Judgement: rakipteki olumsuz statü sayısı (Zayıflık, Zehir, Donma). */
export function debuffCount(pl: PlayerState): number {
  let n = 0;
  for (const s of pl.statuses) {
    if (NEGATIVE_STATUSES.includes(s.id)) n += 1;
  }
  return n;
}
