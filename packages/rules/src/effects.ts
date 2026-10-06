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

/** Kartın taban hasarı + koşul sağlanıyorsa bonusu (Güç/Zayıflık/Kritik hariç). */
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

export interface HitPlan {
  /** Her vuruşun Kalkan emmeden önceki hasarı (Kaçınma ilk vuruşu 0'lar). */
  hits: number[];
  /** Harcanacak Güç (çarpansız), 0 = yok. */
  strengthSpent: number;
  strengthMultiplier: number;
  crit: boolean;
  evaded: boolean;
}

/**
 * Bir hasar efektinin vuruşlarını hesaplar (motor ve önizleme aynı fonksiyonu kullanır).
 * Vuruş = max(0, taban + [yalnız ilk vuruşta Güç × çarpan] − Zayıflık) × (Kritik ? 2 : 1);
 * rakibin Kaçınması varsa ilk vuruş 0 olur.
 */
export function planHits(
  state: BattleState,
  source: PlayerIndex,
  base: number,
  hitCount: number,
  strengthMultiplier = 1,
): HitPlan {
  const me = state.players[source];
  const foe = state.players[other(source)];
  const strengthSpent = statusAmount(me, 'strength');
  const weak = statusAmount(me, 'weak');
  const crit = statusAmount(me, 'critical') > 0;
  const evaded = statusAmount(foe, 'evade') > 0;
  const hits: number[] = [];
  for (let i = 0; i < hitCount; i++) {
    const strength = i === 0 ? strengthSpent * strengthMultiplier : 0;
    let dmg = Math.max(0, base + strength - weak) * (crit ? 2 : 1);
    if (i === 0 && evaded) dmg = 0;
    hits.push(dmg);
  }
  return { hits, strengthSpent, strengthMultiplier, crit, evaded };
}

/** Planı uygular: Güç/Kritik/Kaçınma tüketilir, vuruşlar sırayla vurur. */
function strike(
  state: BattleState,
  source: PlayerIndex,
  plan: HitPlan,
  ignoreShield: boolean,
  events: BattleEvent[],
): void {
  const me = state.players[source];
  const enemy = other(source);
  if (plan.strengthSpent > 0) {
    removeStatus(me, 'strength');
    events.push({
      type: 'STRENGTH_USED',
      player: source,
      amount: plan.strengthSpent * plan.strengthMultiplier,
      multiplier: plan.strengthMultiplier,
    });
  }
  if (plan.crit) {
    removeStatus(me, 'critical');
    events.push({ type: 'CRIT_USED', player: source });
  }
  if (plan.evaded) {
    removeStatus(state.players[enemy], 'evade');
    events.push({ type: 'EVADED', player: enemy, attacker: source });
  }
  for (const [i, dmg] of plan.hits.entries()) {
    if (i === 0 && plan.evaded) continue;
    dealDamage(state, source, enemy, dmg, ignoreShield, events);
    if (state.result) return;
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
      const plan = planHits(
        state,
        source,
        baseDamage(state, source, effect),
        effect.hits ?? 1,
        effect.strengthMultiplier ?? 1,
      );
      strike(state, source, plan, effect.ignoreShield ?? false, events);
      return;
    }
    case 'damageFromShieldGainedThisTurn':
      strike(state, source, planHits(state, source, me.shieldGainedThisTurn, 1), false, events);
      return;
    case 'selfDamage':
      // Kendine hasar Kalkanı yok sayar.
      dealDamage(state, source, source, effect.amount, true, events);
      return;
    case 'gainMp':
      me.mp += effect.amount;
      events.push({ type: 'MP_GAINED', player: source, amount: effect.amount });
      return;
    case 'shield':
      me.shield += effect.amount;
      me.shieldGainedThisTurn += effect.amount;
      events.push({ type: 'SHIELD_GAINED', player: source, amount: effect.amount });
      return;
    case 'heal': {
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
      assertNever(effect);
  }
}
