import { baseDamage, cardDamage, conditionMet } from './effects';
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
  for (const e of def.effects) {
    if (e.kind === 'damage') {
      damage = (damage ?? 0) + cardDamage(state, p, baseDamage(state, p, e));
      if (e.bonus) bonusActive = conditionMet(state, p, e.bonus.if);
    } else if (e.kind === 'damageFromShieldGainedThisTurn') {
      damage = (damage ?? 0) + cardDamage(state, p, state.players[p].shieldGainedThisTurn);
    }
  }
  return { damage, bonusActive };
}
