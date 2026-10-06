import {
  loadAiPlanner,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDeck,
} from '@koidle/content-schema';
import type { SimInput } from './run';

export function loadSimInput(): SimInput {
  return {
    config: loadBattleConfig(),
    cards: loadAllCards(),
    deck: loadPresetDeck('warrior'),
    profiles: loadAiProfiles(),
    planner: loadAiPlanner(),
  };
}
