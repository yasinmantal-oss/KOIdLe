import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { apply, createBattle, legalActions } from './index';
import { testCards, testConfig, testDeck } from './test-fixtures';
import type { BattleState } from './types';

function checkInvariants(s: BattleState): void {
  const { mp, deck } = s.config;
  const iids: string[] = [];
  for (const p of s.players) {
    expect(p.mp).toBeGreaterThanOrEqual(0);
    expect(p.mp).toBeLessThanOrEqual(p.maxMp);
    expect(p.maxMp).toBeLessThanOrEqual(mp.max);
    expect(p.hp).toBeGreaterThanOrEqual(0);
    expect(p.hp).toBeLessThanOrEqual(p.maxHp);
    expect(p.shield).toBeGreaterThanOrEqual(0);
    for (const st of p.statuses) expect(st.turnsLeft).toBeGreaterThan(0);
    expect(p.deck.length + p.hand.length + p.discard.length).toBe(deck.size);
    expect(p.hand.length).toBeLessThanOrEqual(s.config.hand.limit);
    iids.push(...[...p.deck, ...p.hand, ...p.discard].map((c) => c.iid));
    for (const n of [p.hp, p.mp, p.maxMp, p.shield, p.shieldGainedThisTurn, p.fatigueCount]) {
      expect(Number.isInteger(n)).toBe(true);
    }
  }
  expect(new Set(iids).size).toBe(iids.length);
  expect(s.round).toBeLessThanOrEqual(s.config.roundCap);
}

describe('random legal play keeps every invariant', () => {
  it('holds for random seeds and choices', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 0xffffffff }),
        fc.array(fc.nat(), { minLength: 400, maxLength: 400 }),
        (seed, choices) => {
          let { state } = createBattle({
            config: testConfig,
            cards: testCards,
            decks: [testDeck, testDeck],
            names: ['A', 'B'],
            seed,
          });
          checkInvariants(state);
          let i = 0;
          while (!state.result) {
            const legal = legalActions(state);
            const choice = choices[i % choices.length] ?? 0;
            i++;
            const action = legal[choice % legal.length];
            if (!action) throw new Error('no legal action');
            const before = JSON.stringify(state);
            const next = apply(state, action).state;
            expect(JSON.stringify(state)).toBe(before);
            state = next;
            checkInvariants(state);
          }
          expect(legalActions(state)).toEqual([]);
          expect(() => apply(state, { type: 'END_TURN', player: state.active })).toThrow(
            'BATTLE_OVER',
          );
        },
      ),
      { numRuns: 200 },
    );
  });
});
