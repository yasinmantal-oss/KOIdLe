import { drawCard } from './draw';
import { dealDamage, other } from './outcome';
import { applyStatus, removeStatus, statusAmount } from './status';
import type { BattleEvent, BattleState, Condition, Effect, PlayerIndex } from './types';

export function conditionMet(state: BattleState, source: PlayerIndex, cond: Condition): boolean {
  if ('selfHas' in cond) return statusAmount(state.players[source], cond.selfHas) > 0;
  if ('enemyHas' in cond) return statusAmount(state.players[other(source)], cond.enemyHas) > 0;
  return state.players[other(source)].hp <= cond.enemyHpAtMost;
}

/** Kartın taban hasarı + koşul sağlanıyorsa bonusu (Güç/Zayıflık hariç). */
export function baseDamage(
  state: BattleState,
  source: PlayerIndex,
  effect: Extract<Effect, { kind: 'damage' }>,
): number {
  const bonus =
    effect.bonus && conditionMet(state, source, effect.bonus.if) ? effect.bonus.amount : 0;
  return effect.amount + bonus;
}

/** Kart hasarı = max(0, değer + Güç(kaynak) − Zayıflık(kaynak) + Lanet(hedef)). */
export function cardDamage(state: BattleState, source: PlayerIndex, base: number): number {
  const pl = state.players[source];
  const target = state.players[other(source)];
  return Math.max(
    0,
    base + statusAmount(pl, 'strength') - statusAmount(pl, 'weak') + statusAmount(target, 'curse'),
  );
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
    case 'damage': {
      const base = baseDamage(state, source, effect);
      // Çoklu vuruş: her vuruş ayrı hesaplanır. Gizli yalnız ilk vuruşa girer ve Kalkanı yok sayar.
      for (let i = 0; i < (effect.hits ?? 1); i++) {
        const stealth = statusAmount(me, 'stealth');
        if (stealth > 0) {
          removeStatus(me, 'stealth');
          events.push({ type: 'STEALTH_USED', player: source, amount: stealth });
        }
        dealDamage(
          state,
          source,
          enemy,
          cardDamage(state, source, base + stealth),
          stealth > 0 || (effect.ignoreShield ?? false),
          events,
        );
        if (state.result) return;
      }
      return;
    }
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
