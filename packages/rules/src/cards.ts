import type { BattleConfig, CardDef } from './types';

/** Ağır kart: açılış eline gelmez, destede sayısı sınırlıdır. */
export const isHeavy = (card: CardDef): boolean => card.tags?.includes('heavy') ?? false;

/** Açılış kartı: ilk turda oynanabilir (maliyet ≤ başlangıç MP'si). */
export const isOpener = (card: CardDef, config: BattleConfig): boolean =>
  card.cost <= config.mp.start;
