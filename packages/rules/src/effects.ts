import { assertNever } from './assert-never';
import { drawCard } from './draw';
import { dealDamage, other } from './outcome';
import { applyStatus, removeStatus, statusAmount } from './status';
import type { BattleEvent, BattleState, Bonus, Condition, Effect, PlayerIndex } from './types';

export function conditionMet(state: BattleState, source: PlayerIndex, cond: Condition): boolean {
  if ('selfHas' in cond) return statusAmount(state.players[source], cond.selfHas) > 0;
  if ('enemyHas' in cond) return statusAmount(state.players[other(source)], cond.enemyHas) > 0;
  if ('enemyHpAtMost' in cond) return state.players[other(source)].hp <= cond.enemyHpAtMost;
  if ('selfHpAtMost' in cond) return state.players[source].hp <= cond.selfHpAtMost;
  if ('cardsPlayedAtLeast' in cond) {
    return state.players[source].cardsPlayedThisTurn >= cond.cardsPlayedAtLeast;
  }
  return assertNever(cond);
}

/** Koşul sağlanıyorsa bonus tutarı, değilse 0. */
export function bonusValue(
  state: BattleState,
  source: PlayerIndex,
  bonus: Bonus | undefined,
): number {
  return bonus && conditionMet(state, source, bonus.if) ? bonus.amount : 0;
}

/** Kartın taban hasarı + koşul sağlanıyorsa bonusu (Güç/Zayıflık/Lanet hariç). */
export function baseDamage(
  state: BattleState,
  source: PlayerIndex,
  effect: Extract<Effect, { kind: 'damage' }>,
): number {
  return effect.amount + bonusValue(state, source, effect.bonus);
}

/** İyileşme tutarı (maks HP sınırından önce). */
export function healAmount(
  state: BattleState,
  source: PlayerIndex,
  effect: Extract<Effect, { kind: 'heal' }>,
): number {
  return effect.amount + bonusValue(state, source, effect.bonus);
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

/** Zincir bonusu sağlanıyorsa "ZİNCİR ×N" olayı yazar (N = bu kartla birlikte oynanan sayısı). */
function noteChain(
  state: BattleState,
  source: PlayerIndex,
  bonus: Bonus | undefined,
  events: BattleEvent[],
): void {
  if (bonus && 'cardsPlayedAtLeast' in bonus.if && conditionMet(state, source, bonus.if)) {
    events.push({
      type: 'CHAIN_TRIGGERED',
      player: source,
      chain: state.players[source].cardsPlayedThisTurn + 1,
    });
  }
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
      noteChain(state, source, effect.bonus, events);
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
      noteChain(state, source, effect.bonus, events);
      const amount = Math.min(healAmount(state, source, effect), me.maxHp - me.hp);
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
    default:
      return assertNever(effect);
  }
}
