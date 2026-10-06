import { describe, expect, it } from 'vitest';
import { loadSimInput } from './load-input';
import { renderCsv, summarize } from './report';
import { runMatrix, seedRange } from './run';

const input = loadSimInput();

describe('simulation smoke (3×3 × 10)', () => {
  const records = runMatrix(input, seedRange(1, 10));

  it('every match ends, no illegal action is thrown', () => {
    expect(records).toHaveLength(90);
    for (const r of records) expect(r.rounds).toBeGreaterThan(0);
  });

  it('is deterministic', () => {
    const again = runMatrix(input, seedRange(1, 10));
    expect(renderCsv(again)).toBe(renderCsv(records));
  });

  it('summary covers every card and end reason', () => {
    const s = summarize(records, input.cards);
    expect(s.cards).toHaveLength(input.cards.length);
    const total = Object.values(s.endReason).reduce((a, b) => a + b, 0);
    expect(total).toBe(90);
  });
});
