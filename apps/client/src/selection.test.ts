import { describe, expect, it } from 'vitest';
import { NO_SELECTION, selectionStep, validSelection } from './selection';

const tap = (iid: string, playable = true, fits = true) =>
  ({ type: 'tap', iid, playable, fits }) as const;

describe('selectionStep', () => {
  it('first tap selects without playing', () => {
    expect(selectionStep(NO_SELECTION, tap('a'))).toEqual({ state: { selected: ['a'] }, play: [] });
  });
  it('tapping the selected card again deselects it, never plays', () => {
    expect(selectionStep({ selected: ['a', 'b'] }, tap('a'))).toEqual({
      state: { selected: ['b'] },
      play: [],
    });
  });
  it('tapping another card that fits adds it to the selection', () => {
    expect(selectionStep({ selected: ['a'] }, tap('b'))).toEqual({
      state: { selected: ['a', 'b'] },
      play: [],
    });
  });
  it('a card that does not fit the remaining MP or is unplayable changes nothing', () => {
    const s = { selected: ['a'] };
    expect(selectionStep(s, tap('b', true, false))).toEqual({ state: s, play: [] });
    expect(selectionStep(s, tap('b', false, true))).toEqual({ state: s, play: [] });
  });
  it('a selected card can be deselected even if it would no longer fit', () => {
    expect(selectionStep({ selected: ['a'] }, tap('a', true, false)).state.selected).toEqual([]);
  });
  it('confirm plays the selection in order, cancel clears it, empty confirm plays nothing', () => {
    expect(selectionStep({ selected: ['b', 'a'] }, { type: 'confirm' })).toEqual({
      state: NO_SELECTION,
      play: ['b', 'a'],
    });
    expect(selectionStep(NO_SELECTION, { type: 'confirm' }).play).toEqual([]);
    expect(selectionStep({ selected: ['a'] }, { type: 'cancel' })).toEqual({
      state: NO_SELECTION,
      play: [],
    });
  });
});

describe('validSelection', () => {
  const cost = (iid: string) => ({ a: 2, b: 3, c: 1 })[iid] ?? 0;
  it('drops cards that are gone or unplayable', () => {
    expect(validSelection({ selected: ['a', 'b'] }, ['a', 'c'], 10, cost)).toEqual(['a']);
    expect(validSelection(NO_SELECTION, ['b'], 10, cost)).toEqual([]);
  });
  it('keeps cards in order while MP lasts', () => {
    expect(validSelection({ selected: ['a', 'b', 'c'] }, ['a', 'b', 'c'], 4, cost)).toEqual([
      'a',
      'c',
    ]);
  });
});
