import { describe, expect, it } from 'vitest';
import { NO_SELECTION, selectionStep, validSelection } from './selection';

describe('selectionStep', () => {
  it('first tap selects without playing', () => {
    const r = selectionStep(NO_SELECTION, { type: 'tap', iid: 'a', playable: true });
    expect(r).toEqual({ state: { selected: 'a' }, play: null });
  });
  it('tapping the selected card again deselects it, never plays', () => {
    const r = selectionStep({ selected: 'a' }, { type: 'tap', iid: 'a', playable: true });
    expect(r).toEqual({ state: NO_SELECTION, play: null });
  });
  it('tapping another card moves the selection', () => {
    const r = selectionStep({ selected: 'a' }, { type: 'tap', iid: 'b', playable: true });
    expect(r).toEqual({ state: { selected: 'b' }, play: null });
  });
  it('unplayable taps change nothing', () => {
    const s = { selected: 'a' };
    expect(selectionStep(s, { type: 'tap', iid: 'b', playable: false })).toEqual({
      state: s,
      play: null,
    });
  });
  it('confirm plays the selection, cancel clears it, confirm without selection plays nothing', () => {
    expect(selectionStep({ selected: 'a' }, { type: 'confirm' }).play).toBe('a');
    expect(selectionStep(NO_SELECTION, { type: 'confirm' }).play).toBeNull();
    expect(selectionStep({ selected: 'a' }, { type: 'cancel' })).toEqual({
      state: NO_SELECTION,
      play: null,
    });
  });
  it('validSelection drops cards that are gone or unplayable', () => {
    expect(validSelection({ selected: 'a' }, ['a', 'b'])).toBe('a');
    expect(validSelection({ selected: 'a' }, ['b'])).toBeNull();
    expect(validSelection(NO_SELECTION, ['b'])).toBeNull();
  });
});
