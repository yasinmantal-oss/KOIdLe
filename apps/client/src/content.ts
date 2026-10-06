import type { Planner } from '@koidle/ai';
import {
  loadAiPlanner,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDeck,
} from '@koidle/content-schema';
import type { BattleConfig, CardDef } from '@koidle/rules';

export interface LoadedContent {
  config: BattleConfig;
  cards: CardDef[];
  deck: string[];
  profiles: ReturnType<typeof loadAiProfiles>;
  planner: Planner;
}

export type ContentResult = { ok: true; content: LoadedContent } | { ok: false; message: string };

/** Geçersiz içerik ekranı kilitler ve dosya + alan yolunu gösterir. */
export function loadContent(): ContentResult {
  try {
    const cards = loadAllCards();
    return {
      ok: true,
      content: {
        config: loadBattleConfig(),
        cards,
        deck: loadPresetDeck('warrior'),
        profiles: loadAiProfiles(),
        planner: loadAiPlanner(),
      },
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
