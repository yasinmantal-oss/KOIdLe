import { describe, expect, it } from 'vitest';
import { clone } from './clone';
import { apply } from './engine';
import { newBattle } from './test-fixtures';

describe('clone', () => {
  it('deep copies plain JSON data', () => {
    const v = { a: [1, 2, { b: 3 }], c: null };
    const c = clone(v);
    expect(c).toEqual(v);
    expect(c).not.toBe(v);
    expect(c.a).not.toBe(v.a);
  });
});

describe('cloneState', () => {
  it('shares the immutable card table but copies everything else', () => {
    const { state } = newBattle(1);
    const before = JSON.stringify(state);
    const next = apply(state, { type: 'END_TURN', player: state.active }).state;
    expect(next.cards).toBe(state.cards);
    expect(next.players).not.toBe(state.players);
    expect(next.config).not.toBe(state.config);
    expect(JSON.stringify(state)).toBe(before);
  });
});
