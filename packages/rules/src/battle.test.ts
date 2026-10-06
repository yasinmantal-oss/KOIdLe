import { describe, expect, it } from 'vitest';
import { createBattle } from './battle';
import { newBattle, testCards, testConfig, testDeck } from './test-fixtures';

describe('createBattle', () => {
  it('sets up both heroes from config', () => {
    const { state } = newBattle(1);
    for (const p of state.players) {
      expect(p.hp).toBe(30);
      expect(p.maxHp).toBe(30);
      expect(p.shield).toBe(0);
      expect(p.hand).toHaveLength(4);
      expect(p.deck).toHaveLength(8);
      expect(p.reshufflesLeft).toBe(1);
      expect(p.fatigueCount).toBe(0);
    }
  });

  it('starts the first player turn without a draw (K3)', () => {
    const { state } = newBattle(1);
    const first = state.players[state.firstPlayer];
    expect(state.active).toBe(state.firstPlayer);
    expect(state.round).toBe(1);
    expect(first.maxMp).toBe(1);
    expect(first.mp).toBe(1);
    expect(first.turnsTaken).toBe(1);
    expect(first.hand).toHaveLength(4);
  });

  it('is deterministic per seed and both sides can go first', () => {
    expect(newBattle(5)).toEqual(newBattle(5));
    const firsts = new Set(Array.from({ length: 100 }, (_, s) => newBattle(s).state.firstPlayer));
    expect([...firsts].sort()).toEqual([0, 1]);
  });

  it('emits start, 8 draws, then turn start', () => {
    const { events } = newBattle(3);
    expect(events.map((e) => e.type)).toEqual([
      'BATTLE_STARTED',
      ...new Array(8).fill('CARD_DRAWN'),
      'TURN_STARTED',
    ]);
  });

  it('gives unique deterministic instance ids', () => {
    const { state } = newBattle(2);
    const iids = state.players.flatMap((p) => [...p.hand, ...p.deck].map((c) => c.iid));
    expect(new Set(iids).size).toBe(24);
    expect(iids).toContain('p0-0');
    expect(iids).toContain('p1-11');
  });

  it('rejects wrong deck size and unknown cards with a clear message', () => {
    const base = {
      config: testConfig,
      cards: testCards,
      names: ['A', 'B'] as [string, string],
      seed: 1,
    };
    expect(() => createBattle({ ...base, decks: [testDeck.slice(1), testDeck] })).toThrow(
      /deck 0 has 11 cards, config deck\.size is 12/,
    );
    expect(() =>
      createBattle({ ...base, decks: [testDeck, [...testDeck.slice(1), 'nope']] }),
    ).toThrow(/Unknown card: nope/);
  });
});
