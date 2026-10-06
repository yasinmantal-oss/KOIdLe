import { type BattleConfig, type CardDef, isHeavy, isOpener } from '@koidle/rules';
import { type ArchetypeId, archetype, inPool } from './archetypes';

export interface DeckStats {
  size: number;
  heavy: number;
  openers: number;
}

/** Bilinmeyen kimlikler sayılmaz. */
export function deckStats(
  deck: readonly string[],
  cards: readonly CardDef[],
  config: BattleConfig,
): DeckStats {
  let heavy = 0;
  let openers = 0;
  for (const id of deck) {
    const card = cards.find((c) => c.id === id);
    if (!card) continue;
    if (isHeavy(card)) heavy += 1;
    if (isOpener(card, config)) openers += 1;
  }
  return { size: deck.length, heavy, openers };
}

/** Boş liste = geçerli. Mesajlar oyuncuya gösterilir (Türkçe). */
export function validateDeck(
  deck: readonly string[],
  id: ArchetypeId,
  cards: readonly CardDef[],
  config: BattleConfig,
): string[] {
  const out: string[] = [];
  const a = archetype(id);
  const { maxHeavy, minOpeners } = config.deckBuilding;
  if (deck.length !== config.deck.size) {
    out.push(`Deste ${config.deck.size} kart olmalı (şu an ${deck.length}).`);
  }
  const unique = [...new Set(deck)];
  for (const cardId of unique) {
    if (deck.filter((x) => x === cardId).length > 1) {
      out.push(`"${cardId}" birden fazla kez seçilmiş.`);
    }
  }
  for (const cardId of unique) {
    const card = cards.find((c) => c.id === cardId);
    if (!card) out.push(`"${cardId}" bilinmeyen kart.`);
    else if (!inPool(card, a)) out.push(`${card.name}, ${a.name} havuzunda değil.`);
  }
  const stats = deckStats(deck, cards, config);
  if (stats.heavy > maxHeavy) {
    out.push(`Ağır kart en fazla ${maxHeavy} olabilir (şu an ${stats.heavy}).`);
  }
  if (stats.openers < minOpeners) {
    out.push(
      `En az ${minOpeners} adet ${config.mp.start} MP'lik kart gerekli (şu an ${stats.openers}).`,
    );
  }
  return out;
}
