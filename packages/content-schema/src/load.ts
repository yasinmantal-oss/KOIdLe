import aiProfilesJson from '@koidle/content/ai-profiles.json';
import battleConfigJson from '@koidle/content/battle-config.json';
import commonJson from '@koidle/content/cards/common.json';
import rogueJson from '@koidle/content/cards/rogue.json';
import warriorJson from '@koidle/content/cards/warrior.json';
import archerDeckJson from '@koidle/content/decks/archer.json';
import assassinDeckJson from '@koidle/content/decks/assassin.json';
import warriorDeckJson from '@koidle/content/decks/warrior.json';
import type { BattleConfig, CardDef, Job } from '@koidle/rules';
import type { z } from 'zod';
import { type ArchetypeId, archetype, inPool } from './archetypes';
import { validateDeck } from './deck';
import {
  type AiProfiles,
  AiProfilesSchema,
  BattleConfigSchema,
  CardListSchema,
  DeckSchema,
} from './schema';

/** Geçersiz içerik: mesaj dosya yolu + alan yolu + sorunu içerir. */
export class ContentError extends Error {
  constructor(
    readonly file: string,
    readonly issues: string[],
  ) {
    super(`${file} geçersiz:\n${issues.map((i) => `  - ${i}`).join('\n')}`);
    this.name = 'ContentError';
  }
}

function formatPath(path: readonly PropertyKey[]): string {
  if (path.length === 0) return '(kök)';
  return path
    .map((k, i) => (typeof k === 'number' ? `[${k}]` : `${i === 0 ? '' : '.'}${String(k)}`))
    .join('');
}

function parse<T>(schema: z.ZodType<T>, raw: unknown, file: string): T {
  const r = schema.safeParse(raw);
  if (!r.success) {
    throw new ContentError(
      file,
      r.error.issues.map((i) => `${formatPath(i.path)}: ${i.message}`),
    );
  }
  return r.data;
}

export function parseBattleConfig(raw: unknown, file = 'content/battle-config.json'): BattleConfig {
  return parse(BattleConfigSchema, raw, file) as BattleConfig;
}

/** Bir kart dosyasını doğrular: şema + dosyanın job'ı + yol yalnız Rogue'da + yinelenen id yok. */
export function parseCards(raw: unknown, file: string, job: Job | 'common'): CardDef[] {
  const cards = parse(CardListSchema, raw, file) as CardDef[];
  const issues: string[] = [];
  cards.forEach((c, i) => {
    if (c.job !== job) {
      issues.push(`[${i}].job: bu dosya "${job}" kartları içermeli, "${c.job}" bulundu`);
    }
    if (c.branch !== undefined && c.job !== 'rogue') {
      issues.push(`[${i}].branch: yol yalnız Rogue kartlarında olabilir`);
    }
  });
  const ids = cards.map((c) => c.id);
  for (const c of cards.filter((c, i) => ids.indexOf(c.id) !== i)) {
    issues.push(`id "${c.id}" birden fazla kez tanımlı`);
  }
  if (issues.length > 0) throw new ContentError(file, issues);
  return cards;
}

export function parseAiProfiles(raw: unknown, file = 'content/ai-profiles.json'): AiProfiles {
  return parse(AiProfilesSchema, raw, file);
}

export const loadBattleConfig = (): BattleConfig => parseBattleConfig(battleConfigJson);
export const loadAiProfiles = (): AiProfiles => parseAiProfiles(aiProfilesJson);

const CARD_FILES: { file: string; job: Job | 'common'; raw: unknown }[] = [
  { file: 'content/cards/common.json', job: 'common', raw: commonJson },
  { file: 'content/cards/warrior.json', job: 'warrior', raw: warriorJson },
  { file: 'content/cards/rogue.json', job: 'rogue', raw: rogueJson },
];

/** Tüm kartlar (33). Dosyalar arası yinelenen id de hatadır. */
export function loadAllCards(): CardDef[] {
  const all = CARD_FILES.flatMap((f) => parseCards(f.raw, f.file, f.job));
  const dupes = all.filter((c, i) => all.findIndex((x) => x.id === c.id) !== i);
  if (dupes.length > 0) {
    throw new ContentError(
      'content/cards/*.json',
      dupes.map((c) => `id "${c.id}" birden fazla dosyada tanımlı`),
    );
  }
  return all;
}

/** Bir arketipin deste kurma havuzu (ortak + job + yol). */
export function loadPool(id: ArchetypeId): CardDef[] {
  const a = archetype(id);
  return loadAllCards().filter((c) => inPool(c, a));
}

const DECK_FILES: Record<ArchetypeId, unknown> = {
  warrior: warriorDeckJson,
  assassin: assassinDeckJson,
  archer: archerDeckJson,
};

/** Önerilen deste. `validateDeck` sorun bulursa ContentError fırlatır. */
export function loadPresetDeck(id: ArchetypeId): string[] {
  const file = `content/decks/${id}.json`;
  const deck = parse(DeckSchema, DECK_FILES[id], file);
  const issues = validateDeck(deck, id, loadAllCards(), loadBattleConfig());
  if (issues.length > 0) throw new ContentError(file, issues);
  return deck;
}

export function loadPresetDecks(): Record<ArchetypeId, string[]> {
  return {
    warrior: loadPresetDeck('warrior'),
    assassin: loadPresetDeck('assassin'),
    archer: loadPresetDeck('archer'),
  };
}
