import { describe, expect, it } from 'vitest';
import { apply } from './engine';
import { previewCard } from './preview';
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

describe('Güç', () => {
  it('adds to the first hit of the next damage card, then is fully consumed', () => {
    const { state, me, foe } = setup(['hit', 'hit']);
    setStatus(state, me, 'strength', 3);
    const r = play(state, me, 0);
    expect(r.state.players[foe].hp).toBe(24); // 3 + 3
    expect(r.state.players[me].statuses).toEqual([]);
    expect(r.events).toContainEqual({
      type: 'STRENGTH_USED',
      player: me,
      amount: 3,
      multiplier: 1,
    });
    expect(play(r.state, me, 1).state.players[foe].hp).toBe(21); // Güç kalmadı
  });

  it('only the first hit of a multi-hit card gets it', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'volley', 1, [{ kind: 'damage', amount: 2, hits: 3 }]);
    setHand(state, me, ['volley']);
    setStatus(state, me, 'strength', 2);
    expect(play(state, me, 0).state.players[foe].hp).toBe(30 - (4 + 2 + 2));
  });

  it('is not spent by cards that do no damage', () => {
    const { state, me } = setup(['guard']);
    setStatus(state, me, 'strength', 2);
    expect(play(state, me, 0).state.players[me].statuses).toHaveLength(1);
  });

  it('strengthMultiplier counts it twice (Hell Blade combo)', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'hell', 1, [{ kind: 'damage', amount: 9, strengthMultiplier: 2 }]);
    setHand(state, me, ['hell']);
    setStatus(state, me, 'strength', 3);
    const r = play(state, me, 0);
    expect(r.state.players[foe].hp).toBe(30 - 15);
    expect(r.events).toContainEqual({
      type: 'STRENGTH_USED',
      player: me,
      amount: 6,
      multiplier: 2,
    });
  });
});

describe('Kritik', () => {
  it('doubles every hit after strength and weak, before shield, then is consumed', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'volley', 1, [{ kind: 'damage', amount: 2, hits: 2 }]);
    setHand(state, me, ['volley', 'hit']);
    setStatus(state, me, 'critical', 1);
    setStatus(state, me, 'strength', 2);
    setStatus(state, me, 'weak', 1);
    state.players[foe].shield = 5;
    const r = play(state, me, 0);
    // vuruş 1: (2+2-1)*2 = 6, vuruş 2: (2-1)*2 = 2
    expect(r.state.players[foe].shield).toBe(0);
    expect(r.state.players[foe].hp).toBe(30 - (8 - 5));
    expect(r.events).toContainEqual({ type: 'CRIT_USED', player: me });
    expect(r.state.players[me].statuses.some((s) => s.id === 'critical')).toBe(false);
  });
});

describe('Kaçınma', () => {
  it('negates the first hit of the next damage card only, then is consumed', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'volley', 1, [{ kind: 'damage', amount: 2, hits: 3 }]);
    setHand(state, me, ['volley']);
    setStatus(state, foe, 'evade', 1, null);
    const r = play(state, me, 0);
    expect(r.state.players[foe].hp).toBe(26);
    expect(r.state.players[foe].statuses).toEqual([]);
    expect(r.events).toContainEqual({ type: 'EVADED', player: foe, attacker: me });
  });

  it('expires at the start of the owner next turn if unused', () => {
    const { state, me } = setup([]);
    setStatus(state, me, 'evade', 1, null);
    let r = endTurn(state); // rakibin turu
    expect(r.state.players[me].statuses).toHaveLength(1);
    r = endTurn(r.state); // benim turum başlıyor
    expect(r.state.players[me].statuses).toEqual([]);
    expect(r.events).toContainEqual({ type: 'STATUS_EXPIRED', player: me, status: 'evade' });
  });

  it('does not stop poison', () => {
    const { state, foe } = setup([]);
    setStatus(state, foe, 'evade', 1, null);
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

  it('decays by 2 each tick and is removed at zero (4 -> 2 -> gone)', () => {
    const { state, foe } = setup([]);
    setStatus(state, foe, 'poison', 4);
    const ticks: number[] = [];
    let s = state;
    for (let i = 0; i < 6; i++) {
      const r = endTurn(s);
      s = r.state;
      for (const e of r.events) {
        if (e.type === 'DAMAGE_DEALT' && e.source === 'poison') ticks.push(e.amount);
      }
    }
    expect(ticks).toEqual([4, 2]);
    expect(s.players[foe].statuses).toEqual([]);
  });

  it('ignores shield', () => {
    const { state, foe } = setup([]);
    setStatus(state, foe, 'poison', 3);
    state.config.shield.persistence = 'persistent';
    state.players[foe].shield = 10;
    const s = endTurn(state).state;
    expect(s.players[foe].hp).toBe(27);
    expect(s.players[foe].shield).toBe(10);
  });
});

describe('Kendine hasar', () => {
  it('selfDamage ignores own shield and can be lethal', () => {
    const { state, me, foe } = setup(['sting']);
    state.players[me].shield = 5;
    const r = play(state, me, 0);
    expect(r.state.players[me].hp).toBe(29);
    expect(r.state.players[me].shield).toBe(5);
    const low = setup(['sting']);
    low.state.players[low.me].hp = 1;
    const k = play(low.state, low.me, 0);
    expect(k.state.result).toEqual({ winner: low.foe, reason: 'normalDamage' });
    expect(foe).not.toBe(me);
  });
});

describe('önizleme', () => {
  it('preview matches the engine with strength, crit and evade', () => {
    const { state, me, foe } = setup(['hit']);
    setStatus(state, me, 'strength', 2);
    setStatus(state, me, 'critical', 1);
    expect(previewCard(state, me, 'hit').damage).toBe(10);
    setStatus(state, foe, 'evade', 1, null);
    expect(previewCard(state, me, 'hit').damage).toBe(0);
  });
});
