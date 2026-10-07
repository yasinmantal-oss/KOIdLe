import type { Branch, CardDef, Job } from '@koidle/rules';

/** Oynanabilir "arketip": Rogue iki yola ayrılır (F2-15); Mage ve Priest yolsuzdur. */
export type ArchetypeId = 'warrior' | 'assassin' | 'archer' | 'mage' | 'priest';

export interface Archetype {
  id: ArchetypeId;
  job: Job;
  branch?: Branch;
  name: string;
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  warrior: { id: 'warrior', job: 'warrior', name: 'Warrior' },
  assassin: { id: 'assassin', job: 'rogue', branch: 'assassin', name: 'Rogue · Asas' },
  archer: { id: 'archer', job: 'rogue', branch: 'archer', name: 'Rogue · Okçu' },
  mage: { id: 'mage', job: 'mage', name: 'Mage' },
  priest: { id: 'priest', job: 'priest', name: 'Priest' },
};

export const ARCHETYPE_IDS: readonly ArchetypeId[] = [
  'warrior',
  'assassin',
  'archer',
  'mage',
  'priest',
];

export const archetype = (id: ArchetypeId): Archetype => ARCHETYPES[id];

/** Kart bu arketipin havuzunda mı: ortak + job + (varsa) yol. Rogue ortak kartlarında yol yok. */
export function inPool(card: CardDef, a: Archetype): boolean {
  if (card.job === 'common') return true;
  if (card.job !== a.job) return false;
  return card.branch === undefined || card.branch === a.branch;
}
