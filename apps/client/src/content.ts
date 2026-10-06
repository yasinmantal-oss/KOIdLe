import type { Planner } from '@koidle/ai';
import {
  type ArchetypeId,
  loadAiPlanner,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDecks,
} from '@koidle/content-schema';
import type { BattleConfig, CardDef } from '@koidle/rules';

export interface LoadedContent {
  config: BattleConfig;
  /** Tüm kartlar; deste havuzu `inPool` ile süzülür. */
  cards: CardDef[];
  /** Önerilen desteler: AI'ın destesi ve "Önerilen deste" butonu. */
  presets: Record<ArchetypeId, string[]>;
  profiles: ReturnType<typeof loadAiProfiles>;
  planner: Planner;
}

export type ContentResult = { ok: true; content: LoadedContent } | { ok: false; message: string };

/** Geçersiz içerik ekranı kilitler ve dosya + alan yolunu gösterir. */
export function loadContent(): ContentResult {
  try {
    return {
      ok: true,
      content: {
        config: loadBattleConfig(),
        cards: loadAllCards(),
        presets: loadPresetDecks(),
        profiles: loadAiProfiles(),
        planner: loadAiPlanner(),
      },
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
