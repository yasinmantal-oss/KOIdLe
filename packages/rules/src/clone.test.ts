import { describe, expect, it } from 'vitest';
import { clone } from './clone';

describe('clone', () => {
  it('deep copies plain JSON data', () => {
    const v = { a: [1, 2, { b: 3 }], c: null };
    const c = clone(v);
    expect(c).toEqual(v);
    expect(c).not.toBe(v);
    expect(c.a).not.toBe(v.a);
  });
});
