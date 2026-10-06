import { describe, expect, it } from 'vitest';
import { apply } from './engine';
import { previewCard } from './preview';
import { addCard, newBattle, setHand, setStatus } from './test-fixtures';
import type { BattleState, Effect, PlayerIndex } from './types';

function setup(hand: string[], mp = 8) {
  const { state } = newBattle(1);
  const me = state.active;
  const foe: PlayerIndex = me === 0 ? 1 : 0;
  setHand(state, me, hand, mp);
  return { state, me, foe };
}

const play = (s: BattleState, me: PlayerIndex, i: number) =>
  apply(s, { type: 'PLAY_CARD', player: me, iid: `t${me}-${i}` });

// 3 vuruş × 2 hasar
const VOLLEY: Effect[] = [{ kind: 'damage', amount: 2, hits: 3 }];

describe('Gizli', () => {
  it('adds damage to the next hit, ignores shield, then falls off', () => {
    const { state, me, foe } = setup(['hit']);
    setStatus(state, me, 'stealth', 3);
    state.players[foe].shield = 5;
    const { state: s, events } = play(state, me, 0);
    expect(s.players[foe].hp).toBe(24);
    expect(s.players[foe].shield).toBe(5);
    expect(s.players[me].statuses.some((x) => x.id === 'stealth')).toBe(false);
    const kinds = events.map((e) => e.type);
    expect(kinds.indexOf('STEALTH_USED')).toBeGreaterThanOrEqual(0);
    expect(kinds.indexOf('STEALTH_USED')).toBeLessThan(kinds.indexOf('DAMAGE_DEALT'));
    expect(events).toContainEqual({ type: 'STEALTH_USED', player: me, amount: 3 });
    expect(events).toContainEqual({
      type: 'DAMAGE_DEALT',
      source: me,
      target: foe,
      amount: 6,
      absorbed: 0,
    });
  });

  it('applies to the first hit of a volley only; strength applies to every hit', () => {
    const { state, me, foe } = setup(['hit']);
    addCard(state, 'volley', 1, VOLLEY);
    setHand(state, me, ['volley']);
    setStatus(state, me, 'strength', 1);
    setStatus(state, me, 'stealth', 3);
    state.players[foe].shield = 4;
    const { state: s, events } = play(state, me, 0);
    const dmg = events.flatMap((e) => (e.type === 'DAMAGE_DEALT' ? [[e.amount, e.absorbed]] : []));
    expect(dmg).toEqual([
      [6, 0],
      [3, 3],
      [3, 1],
    ]);
    expect(s.players[foe].hp).toBe(22);
  });

  it('a volley stops at lethal damage', () => {
    const { state, me, foe } = setup(['hit']);
    addCard(state, 'volley', 1, VOLLEY);
    setHand(state, me, ['volley']);
    state.players[foe].hp = 3;
    const { events } = play(state, me, 0);
    expect(events.map((e) => e.type)).toEqual([
      'CARD_PLAYED',
      'DAMAGE_DEALT',
      'DAMAGE_DEALT',
      'BATTLE_ENDED',
    ]);
  });

  it('a non-damage card keeps stealth', () => {
    const { state, me } = setup(['guard']);
    setStatus(state, me, 'stealth', 3);
    const s = play(state, me, 0).state;
    expect(s.players[me].statuses).toContainEqual({ id: 'stealth', amount: 3, turnsLeft: 2 });
  });

  it('hit-then-vanish card consumes the old stealth, then grants the new one', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'vanish', 1, [
      { kind: 'damage', amount: 6 },
      { kind: 'applyStatus', target: 'self', status: 'stealth', amount: 3 },
    ]);
    setHand(state, me, ['vanish']);
    setStatus(state, me, 'stealth', 7);
    const s = play(state, me, 0).state;
    expect(s.players[foe].hp).toBe(17); // 6 + 7
    expect(s.players[me].statuses.find((x) => x.id === 'stealth')?.amount).toBe(3);
  });
});

describe('previewCard with stealth and hits', () => {
  it('shows stealth on a single hit', () => {
    const { state, me } = setup(['hit']);
    setStatus(state, me, 'stealth', 3);
    expect(previewCard(state, me, 'hit').damage).toBe(6);
  });

  it('sums a volley and adds strength to every hit', () => {
    const { state, me } = setup(['hit']);
    addCard(state, 'volley', 1, VOLLEY);
    setStatus(state, me, 'strength', 1);
    expect(previewCard(state, me, 'volley').damage).toBe(9);
    setStatus(state, me, 'stealth', 3);
    expect(previewCard(state, me, 'volley').damage).toBe(12);
  });
});
