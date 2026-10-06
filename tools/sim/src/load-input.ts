import {
  loadAiPlanner,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDecks,
} from '@koidle/content-schema';
import type { SimInput } from './run';

export function loadSimInput(): SimInput {
  return {
    config: loadBattleConfig(),
    cards: loadAllCards(),
    decks: loadPresetDecks(),
    profiles: loadAiProfiles(),
    planner: loadAiPlanner(),
  };
}
