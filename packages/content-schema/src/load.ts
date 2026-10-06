import aiProfilesJson from '@koidle/content/ai-profiles.json';
import battleConfigJson from '@koidle/content/battle-config.json';
import warriorJson from '@koidle/content/cards/warrior.json';
import type { BattleConfig, CardDef, Job } from '@koidle/rules';
import type { z } from 'zod';
import { type AiProfiles, AiProfilesSchema, BattleConfigSchema, CardListSchema } from './schema';

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

export function parseCards(raw: unknown, file: string): CardDef[] {
  const cards = parse(CardListSchema, raw, file) as CardDef[];
  const ids = cards.map((c) => c.id);
  const dupes = cards.filter((c, i) => ids.indexOf(c.id) !== i);
  if (dupes.length > 0) {
    throw new ContentError(
      file,
      dupes.map((c) => `id "${c.id}" birden fazla kez tanımlı`),
    );
  }
  return cards;
}

export function parseAiProfiles(raw: unknown, file = 'content/ai-profiles.json'): AiProfiles {
  return parse(AiProfilesSchema, raw, file);
}

export const loadBattleConfig = (): BattleConfig => parseBattleConfig(battleConfigJson);
export const loadAiProfiles = (): AiProfiles => parseAiProfiles(aiProfilesJson);

const CARD_FILES: Record<Job, unknown> = { warrior: warriorJson };

export function loadCards(job: Job): CardDef[] {
  return parseCards(CARD_FILES[job], `content/cards/${job}.json`);
}

/** Faz 1: job havuzundaki her karttan birer tane (deste boyutu config'den doğrulanır). */
export function defaultDeck(job: Job): string[] {
  return loadCards(job).map((c) => c.id);
}
