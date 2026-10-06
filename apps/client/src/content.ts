import { loadAiProfiles, loadBattleConfig, loadCards } from '@koidle/content-schema';
import type { BattleConfig, CardDef } from '@koidle/rules';

export interface LoadedContent {
  config: BattleConfig;
  cards: CardDef[];
  deck: string[];
  profiles: ReturnType<typeof loadAiProfiles>;
}

export type ContentResult = { ok: true; content: LoadedContent } | { ok: false; message: string };

/** Geçersiz içerik ekranı kilitler ve dosya + alan yolunu gösterir. */
export function loadContent(): ContentResult {
  try {
    const cards = loadCards('warrior');
    return {
      ok: true,
      content: {
        config: loadBattleConfig(),
        cards,
        deck: cards.map((c) => c.id),
        profiles: loadAiProfiles(),
      },
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
