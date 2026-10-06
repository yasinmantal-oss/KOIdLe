import { describe, expect, it } from 'vitest';
import { loadSimInput } from './load-input';
import { renderCsv, summarize } from './report';
import { runJobMatrix, runProfileMatrix, seedRange } from './run';

const input = loadSimInput();

describe('simulation smoke (job matrix 3×3 × 1 seed, profile matrix 3×(3×3) × 1 seed)', () => {
  const job = runJobMatrix(input, seedRange(1, 1));
  const profile = runProfileMatrix(input, seedRange(1, 1));
  const records = [...job, ...profile];

  it('every match ends, no illegal action is thrown', () => {
    expect(job).toHaveLength(9);
    expect(profile).toHaveLength(27);
    for (const r of records) expect(r.rounds).toBeGreaterThan(0);
    expect(job.every((r) => r.pass === 'job')).toBe(true);
    expect(profile.every((r) => r.pass === 'profile')).toBe(true);
  });

  it('is deterministic', () => {
    const again = runJobMatrix(input, seedRange(1, 1));
    expect(renderCsv(again)).toBe(renderCsv(job));
  });

  it('summary covers every card that is in a preset deck and every end reason', () => {
    const s = summarize(records, input);
    const deckCards = new Set(Object.values(input.decks).flat());
    expect(s.cards).toHaveLength(deckCards.size);
    expect(s.cards.every((c) => deckCards.has(c.id))).toBe(true);
    const total = Object.values(s.endReason).reduce((a, b) => a + b, 0);
    expect(total).toBe(9);
    expect(s.matches).toBe(9);
    expect(s.profileMatches).toBe(27);
  });

  it('records the new per-seat metrics', () => {
    for (const r of job) {
      expect(r.deadOpening).toHaveLength(2);
      expect(r.crits.every((n) => n >= 0)).toBe(true);
      expect(r.evades.every((n) => n >= 0)).toBe(true);
      expect(r.poisonDamage.every((n) => n >= 0)).toBe(true);
    }
  });
});
