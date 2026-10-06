import { describe, expect, it } from 'vitest';
import { nextUint32, rollInt, shuffle } from './rng';

describe('rng', () => {
  it('produces the same sequence for the same seed', () => {
    const a = { rng: 42 };
    const b = { rng: 42 };
    const seqA = Array.from({ length: 5 }, () => nextUint32(a));
    const seqB = Array.from({ length: 5 }, () => nextUint32(b));
    expect(seqA).toEqual(seqB);
    expect(seqA).toMatchInlineSnapshot(`
      [
        2581720956,
        1925393290,
        3661312704,
        2876485805,
        750819978,
      ]
    `);
  });

  it('rollInt stays in range and covers every bucket', () => {
    const h = { rng: 7 };
    const seen = new Array<number>(6).fill(0);
    for (let i = 0; i < 10_000; i++) {
      const x = rollInt(h, 6);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(6);
      seen[x] = (seen[x] ?? 0) + 1;
    }
    for (const count of seen) expect(count).toBeGreaterThan(0);
  });

  it('shuffle is deterministic, pure and keeps elements', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const copy = items.slice();
    const a = shuffle({ rng: 99 }, items);
    const b = shuffle({ rng: 99 }, items);
    expect(a).toEqual(b);
    expect(items).toEqual(copy);
    expect(a.slice().sort((x, y) => x - y)).toEqual(copy);
    expect(a).not.toEqual(copy);
  });
});
