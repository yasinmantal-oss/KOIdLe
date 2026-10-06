import type { AiProfile } from '@koidle/ai';
import { ARCHETYPE_IDS, type ArchetypeId } from '@koidle/content-schema';

export interface MatchSetup {
  seed: number;
  mine: ArchetypeId;
  ai: ArchetypeId;
  profile: AiProfile;
}

/** "Rastgele" rakip job'ı seed'den türer; "Tekrar (aynı seed)" aynı rakibi verir. */
export function pickAi(seed: number): ArchetypeId {
  return ARCHETYPE_IDS[seed % ARCHETYPE_IDS.length] ?? 'warrior';
}
