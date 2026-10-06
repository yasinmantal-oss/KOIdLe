import { afterEach, describe, expect, it, vi } from 'vitest';
import { readSavedDeck, saveDeck } from './deck';

afterEach(() => vi.unstubAllGlobals());

describe('saved deck', () => {
  it('without localStorage: null and no throw', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(readSavedDeck('warrior')).toBeNull();
    expect(() => saveDeck('warrior', ['slash'])).not.toThrow();
  });

  it('round-trips through the per-archetype key', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    });
    saveDeck('archer', ['viper', 'power-shot']);
    expect(store.has('koidle.deck.archer')).toBe(true);
    expect(readSavedDeck('archer')).toEqual(['viper', 'power-shot']);
    expect(readSavedDeck('warrior')).toBeNull();
  });

  it('rejects garbage', () => {
    vi.stubGlobal('localStorage', { getItem: () => '{"a":1}' });
    expect(readSavedDeck('warrior')).toBeNull();
    vi.stubGlobal('localStorage', { getItem: () => '[1,2]' });
    expect(readSavedDeck('warrior')).toBeNull();
    vi.stubGlobal('localStorage', { getItem: () => 'not json' });
    expect(readSavedDeck('warrior')).toBeNull();
  });
});
