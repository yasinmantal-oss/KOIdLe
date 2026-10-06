import { defaultDeck, loadAiProfiles, loadBattleConfig, loadCards } from '@koidle/content-schema';
import type { SimInput } from './run';

export function loadSimInput(): SimInput {
  return {
    config: loadBattleConfig(),
    cards: loadCards('warrior'),
    deck: defaultDeck('warrior'),
    profiles: loadAiProfiles(),
  };
}
