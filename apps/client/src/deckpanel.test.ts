import type { CardDef } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import { sortByCost } from './components/DeckPanel';

const def = (id: string, name: string, cost: number) => ({ id, name, cost }) as CardDef;

describe('sortByCost', () => {
  it('sorts by cost then name without mutating the input', () => {
    const defs = { a: def('a', 'Zıpla', 2), b: def('b', 'Ara', 2), c: def('c', 'Bir', 1) };
    const input = [
      { iid: '1', cardId: 'a' },
      { iid: '2', cardId: 'b' },
      { iid: '3', cardId: 'c' },
    ];
    expect(sortByCost(input, defs).map((c) => c.iid)).toEqual(['3', '2', '1']);
    expect(input.map((c) => c.iid)).toEqual(['1', '2', '3']);
  });
});
