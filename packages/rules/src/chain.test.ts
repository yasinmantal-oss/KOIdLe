import { describe, expect, it } from 'vitest';
import { apply } from './engine';
import { previewCard } from './preview';
import { addCard, newBattle, setHand } from './test-fixtures';
import type { BattleState, PlayerIndex } from './types';

function setup(hand: string[], mp = 8) {
  const { state } = newBattle(1);
  const me = state.active;
  const foe: PlayerIndex = me === 0 ? 1 : 0;
  addCard(state, 'jab', 1, [
    { kind: 'damage', amount: 2, bonus: { if: { cardsPlayedAtLeast: 1 }, amount: 2 } },
  ]);
  addCard(state, 'valor-like', 2, [
    { kind: 'heal', amount: 4, bonus: { if: { selfHpAtMost: 15 }, amount: 4 } },
  ]);
  setHand(state, me, hand, mp);
  return { state, me, foe };
}

const play = (s: BattleState, me: PlayerIndex, i: number) =>
  apply(s, { type: 'PLAY_CARD', player: me, iid: `t${me}-${i}` });
const endTurn = (s: BattleState) => apply(s, { type: 'END_TURN', player: s.active });

describe('Zincir', () => {
  it('the first card of the turn gets no chain bonus', () => {
    const { state, me, foe } = setup(['jab']);
    const { state: s, events } = play(state, me, 0);
    expect(s.players[foe].hp).toBe(28);
    expect(events.some((e) => e.type === 'CHAIN_TRIGGERED')).toBe(false);
  });

  it('a second card gets the bonus and announces the chain before the damage', () => {
    const { state, me, foe } = setup(['hit', 'jab']);
    const s1 = play(state, me, 0).state;
    expect(s1.players[me].cardsPlayedThisTurn).toBe(1);
    const { state: s2, events } = play(s1, me, 1);
    expect(s2.players[foe].hp).toBe(23); // 3 + (2 + 2)
    expect(events).toContainEqual({ type: 'CHAIN_TRIGGERED', player: me, chain: 2 });
    const kinds = events.map((e) => e.type);
    expect(kinds.indexOf('CHAIN_TRIGGERED')).toBeLessThan(kinds.indexOf('DAMAGE_DEALT'));
  });

  it('the counter resets at the start of the own next turn', () => {
    const { state, me, foe } = setup(['hit']);
    let s = play(state, me, 0).state;
    expect(s.players[me].cardsPlayedThisTurn).toBe(1);
    s = endTurn(s).state;
    expect(s.active).toBe(foe);
    s = endTurn(s).state;
    expect(s.active).toBe(me);
    expect(s.players[me].cardsPlayedThisTurn).toBe(0);
  });

  it('preview bonusActive flips after one card', () => {
    const { state, me } = setup(['hit', 'jab']);
    expect(previewCard(state, me, 'jab')).toEqual({ damage: 2, bonusActive: false });
    const s = play(state, me, 0).state;
    expect(previewCard(s, me, 'jab')).toEqual({ damage: 4, bonusActive: true });
  });
});

describe('Valor: heal bonus at low HP', () => {
  it('heals 4 above the threshold', () => {
    const { state, me } = setup(['valor-like']);
    state.players[me].hp = 20;
    expect(play(state, me, 0).state.players[me].hp).toBe(24);
  });

  it('heals 8 at or below the threshold and previews it', () => {
    const { state, me } = setup(['valor-like']);
    state.players[me].hp = 10;
    expect(previewCard(state, me, 'valor-like').bonusActive).toBe(true);
    expect(play(state, me, 0).state.players[me].hp).toBe(18);
  });

  it('is still capped by max HP', () => {
    const { state, me } = setup(['valor-like']);
    state.players[me].hp = 15;
    state.players[me].maxHp = 20;
    expect(play(state, me, 0).state.players[me].hp).toBe(20);
  });
});
