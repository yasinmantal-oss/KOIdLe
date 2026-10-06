import type { ArchetypeId } from '@koidle/content-schema';

const key = (id: ArchetypeId): string => `koidle.deck.${id}`;

/** Kurulan deste tarayıcıda hatırlanır. localStorage yoksa/bozuksa null (sessizce). */
export function readSavedDeck(id: ArchetypeId): string[] | null {
  try {
    const raw = localStorage.getItem(key(id));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(value) && value.every((x): x is string => typeof x === 'string')) {
      return value;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveDeck(id: ArchetypeId, deck: string[]): void {
  try {
    localStorage.setItem(key(id), JSON.stringify(deck));
  } catch {
    // kayıt olmadan da devam
  }
}
