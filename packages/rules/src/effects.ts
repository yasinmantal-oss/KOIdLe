import { drawCard } from './draw';
import { dealDamage, other } from './outcome';
import { applyStatus, statusAmount } from './status';
import type { BattleEvent, BattleState, Effect, PlayerIndex } from './types';

/** Kart hasarı = max(0, değer + Güç − Zayıflık). */
function cardDamage(state: BattleState, source: PlayerIndex, base: number): number {
  const pl = state.players[source];
  return Math.max(0, base + statusAmount(pl, 'strength') - statusAmount(pl, 'weak'));
}

export function resolveEffect(
  state: BattleState,
  source: PlayerIndex,
  effect: Effect,
  events: BattleEvent[],
): void {
  const me = state.players[source];
  const enemy = other(source);
  switch (effect.kind) {
    case 'damage':
      dealDamage(
        state,
        source,
        enemy,
        cardDamage(state, source, effect.amount),
        effect.ignoreShield ?? false,
        events,
      );
      return;
    case 'damageFromShieldGainedThisTurn':
      dealDamage(
        state,
        source,
        enemy,
        cardDamage(state, source, me.shieldGainedThisTurn),
        false,
        events,
      );
      return;
    case 'shield':
      me.shield += effect.amount;
      me.shieldGainedThisTurn += effect.amount;
      events.push({ type: 'SHIELD_GAINED', player: source, amount: effect.amount });
      return;
    case 'heal': {
      const amount = Math.min(effect.amount, me.maxHp - me.hp);
      me.hp += amount;
      events.push({ type: 'HEALED', player: source, amount });
      return;
    }
    case 'draw':
      for (let i = 0; i < effect.count; i++) {
        drawCard(state, source, events);
        if (state.result) return;
      }
      return;
    case 'applyStatus':
      applyStatus(
        state,
        effect.target === 'self' ? source : enemy,
        effect.status,
        effect.amount,
        events,
      );
      return;
  }
}
