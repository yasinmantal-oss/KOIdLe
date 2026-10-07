import { baseDamage, conditionMet, planHits } from './effects';
import type { BattleState, PlayerIndex } from './types';

export interface CardPreview {
  /** Kart şu an oynansa vereceği toplam hasar (Kalkan emmeden önce); hasar vermiyorsa null. */
  damage: number | null;
  /** Kartın koşullu bonusu şu an sağlanıyor mu; bonusu yoksa null. */
  bonusActive: boolean | null;
}

/** UI için saf önizleme: durumu değiştirmez, kural kararını motorla aynı fonksiyonlardan alır. */
export function previewCard(state: BattleState, p: PlayerIndex, cardId: string): CardPreview {
  const def = state.cards[cardId];
  if (!def) throw new Error(`Unknown card: ${cardId}`);
  let damage: number | null = null;
  let bonusActive: boolean | null = null;
  const foe = p === 0 ? 1 : 0;
  // Efektler sırayla çözülür: kartın önce verdiği Kalkan, sonraki Kalkan hasarına sayılır.
  let shieldGained = state.players[p].shieldGainedThisTurn;
  for (const e of def.effects) {
    if (e.kind === 'damage') {
      const plan = planHits(
        state,
        p,
        baseDamage(state, p, e),
        e.hits ?? 1,
        e.strengthMultiplier ?? 1,
      );
      damage = (damage ?? 0) + plan.hits.reduce((a, b) => a + b, 0);
      if (e.bonus) bonusActive = conditionMet(state, p, e.bonus.if);
    } else if (e.kind === 'damageFire') {
      const frozen = state.players[foe].statuses.some((s) => s.id === 'freeze');
      const plan = planHits(state, p, e.amount + (frozen ? e.bonus : 0), e.hits ?? 1);
      damage = (damage ?? 0) + plan.hits.reduce((a, b) => a + b, 0);
      bonusActive = frozen;
    } else if (e.kind === 'heal') {
      if (e.bonus) bonusActive = conditionMet(state, p, e.bonus.if);
    } else if (e.kind === 'damageFromShieldGainedThisTurn') {
      damage = (damage ?? 0) + (planHits(state, p, shieldGained, 1).hits[0] ?? 0);
    } else if (e.kind === 'shield') {
      shieldGained += e.amount;
    }
  }
  return { damage, bonusActive };
}
