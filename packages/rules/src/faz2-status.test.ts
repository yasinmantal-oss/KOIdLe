import { describe, expect, it } from 'vitest';
import { apply } from './engine';
import { addCard, newBattle, setHand, setStatus } from './test-fixtures';
import type { BattleState, PlayerIndex } from './types';

function setup(hand: string[], mp = 8) {
  const { state } = newBattle(1);
  const me = state.active;
  const foe: PlayerIndex = me === 0 ? 1 : 0;
  setHand(state, me, hand, mp);
  return { state, me, foe };
}

const play = (s: BattleState, me: PlayerIndex, i: number) =>
  apply(s, { type: 'PLAY_CARD', player: me, iid: `t${me}-${i}` });
const endTurn = (s: BattleState) => apply(s, { type: 'END_TURN', player: s.active });

describe('Lanet', () => {
  it('raises card damage taken by the curse amount', () => {
    const { state, me, foe } = setup(['hit']);
    setStatus(state, foe, 'curse', 2);
    expect(play(state, me, 0).state.players[foe].hp).toBe(25); // 3 + 2
  });

  it('does not add to poison damage', () => {
    const { state, foe } = setup([]);
    setStatus(state, foe, 'curse', 2);
    setStatus(state, foe, 'poison', 4);
    expect(endTurn(state).state.players[foe].hp).toBe(26);
  });
});

describe('Zehir', () => {
  it('hits at the owner turn start, after TURN_STARTED and before the draw', () => {
    const { state, foe } = setup([]);
    setStatus(state, foe, 'poison', 4);
    const { state: s, events } = endTurn(state);
    expect(s.players[foe].hp).toBe(26);
    const kinds = events.map((e) =>
      e.type === 'DAMAGE_DEALT' ? `DAMAGE_${String(e.source)}` : e.type,
    );
    const started = kinds.indexOf('TURN_STARTED');
    const poison = kinds.indexOf('DAMAGE_poison');
    const drawn = kinds.indexOf('CARD_DRAWN');
    expect(started).toBeGreaterThanOrEqual(0);
    expect(poison).toBeGreaterThan(started);
    expect(drawn).toBeGreaterThan(poison);
  });

  it('lethal poison ends the battle as normalDamage and skips the draw', () => {
    const { state, me, foe } = setup([]);
    state.players[foe].hp = 3;
    setStatus(state, foe, 'poison', 4);
    const { state: s, events } = endTurn(state);
    expect(s.result).toEqual({ winner: me, reason: 'normalDamage' });
    expect(events.some((e) => e.type === 'CARD_DRAWN')).toBe(false);
  });

  it('a card that applies poison 4 ticks exactly twice', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'venom', 1, [
      { kind: 'applyStatus', target: 'enemy', status: 'poison', amount: 4 },
    ]);
    setHand(state, me, ['venom']);
    let s = play(state, me, 0).state;
    expect(s.players[foe].statuses).toContainEqual({ id: 'poison', amount: 4, turnsLeft: 2 });
    const ticks: number[] = [];
    for (let i = 0; i < 6; i++) {
      const r = endTurn(s);
      s = r.state;
      for (const e of r.events) {
        if (e.type === 'DAMAGE_DEALT' && e.source === 'poison') ticks.push(e.amount);
      }
    }
    expect(ticks).toEqual([4, 4]);
  });
});
