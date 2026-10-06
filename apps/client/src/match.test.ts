import { ARCHETYPE_IDS } from '@koidle/content-schema';
import { describe, expect, it } from 'vitest';
import { pickAi } from './match';

describe('pickAi', () => {
  it('is deterministic per seed (Tekrar keeps the same opponent)', () => {
    for (let seed = 0; seed < 20; seed++) expect(pickAi(seed)).toBe(pickAi(seed));
  });

  it('reaches every archetype', () => {
    const seen = new Set(
      Array.from({ length: ARCHETYPE_IDS.length * 3 }, (_, seed) => pickAi(seed)),
    );
    expect(seen).toEqual(new Set(ARCHETYPE_IDS));
  });
});
