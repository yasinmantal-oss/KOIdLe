import type { BattleEvent, BattleState, DamageSource, EndReason, PlayerIndex } from './types';

export const other = (p: PlayerIndex): PlayerIndex => (p === 0 ? 1 : 0);

export function endBattle(
  state: BattleState,
  winner: PlayerIndex | null,
  reason: EndReason,
  events: BattleEvent[],
): void {
  state.result = { winner, reason };
  events.push({ type: 'BATTLE_ENDED', winner, round: state.round, reason });
}

const REASON: Record<'arena' | 'fatigue', EndReason> = {
  arena: 'arenaCollapse',
  fatigue: 'fatigue',
};

/** Hasarı uygular; Kalkan önce emer (yok sayılmıyorsa). Hedef ölürse savaşı bitirir. */
export function dealDamage(
  state: BattleState,
  source: DamageSource,
  target: PlayerIndex,
  amount: number,
  ignoreShield: boolean,
  events: BattleEvent[],
): void {
  const t = state.players[target];
  const absorbed = ignoreShield ? 0 : Math.min(t.shield, amount);
  t.shield -= absorbed;
  t.hp = Math.max(0, t.hp - (amount - absorbed));
  t.damageTaken += amount;
  events.push({ type: 'DAMAGE_DEALT', source, target, amount, absorbed });
  if (t.hp === 0) {
    const reason = source === 'arena' || source === 'fatigue' ? REASON[source] : 'normalDamage';
    endBattle(state, other(target), reason, events);
  }
}
