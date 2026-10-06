import { describe, expect, it } from 'vitest';
import { apply, IllegalActionError } from './engine';
import { addCard, newBattle, setHand, setStatus, testConfig } from './test-fixtures';
import type { BattleConfig, BattleEvent, BattleState } from './types';

const endTurn = (s: BattleState) => apply(s, { type: 'END_TURN', player: s.active });

/** Sırayla n kez tur bitirir; olayları biriktirir. */
function endTurns(state: BattleState, n: number) {
  let s = state;
  const events: BattleEvent[] = [];
  for (let i = 0; i < n && !s.result; i++) {
    const r = endTurn(s);
    s = r.state;
    events.push(...r.events);
  }
  return { state: s, events };
}

const withConfig = (patch: Partial<BattleConfig>) => ({ ...testConfig, ...patch });

describe('second player first-turn MP bonus', () => {
  it('gives +1 MP on the second player first turn only', () => {
    const cfg = withConfig({
      mp: { ...testConfig.mp, secondPlayerFirstTurnBonus: 1 },
    });
    const { state } = newBattle(1, cfg);
    const first = state.active;
    const second = first === 0 ? 1 : 0;
    expect(state.players[first].maxMp).toBe(1);
    const s1 = endTurn(state).state;
    expect(s1.players[second].maxMp).toBe(2);
    expect(s1.players[second].mp).toBe(2);
    const s2 = endTurns(s1, 2).state;
    expect(s2.active).toBe(second);
    expect(s2.players[first].maxMp).toBe(2);
    expect(s2.players[second].maxMp).toBe(2);
    const s3 = endTurns(s2, 2).state;
    expect(s3.players[second].maxMp).toBe(3);
  });
});

describe('END_TURN', () => {
  it('rejects the wrong player and leaves input untouched', () => {
    const { state } = newBattle(1);
    const before = JSON.stringify(state);
    const wrong = state.active === 0 ? 1 : 0;
    expect(() => apply(state, { type: 'END_TURN', player: wrong })).toThrow(IllegalActionError);
    expect(() => apply(state, { type: 'END_TURN', player: wrong })).toThrow('NOT_YOUR_TURN');
    expect(JSON.stringify(state)).toBe(before);
  });

  it('passes the turn; the second player draws and gets 1 MP', () => {
    const { state } = newBattle(1);
    const second = state.active === 0 ? 1 : 0;
    const { state: s, events } = endTurn(state);
    expect(s.active).toBe(second);
    expect(s.players[second].hand).toHaveLength(5);
    expect(s.players[second].maxMp).toBe(1);
    expect(s.round).toBe(1);
    expect(events[0]).toMatchObject({ type: 'TURN_ENDED', unusedMp: 1 });
  });

  it('increases round only when the first player starts', () => {
    const { state } = newBattle(1);
    expect(endTurns(state, 1).state.round).toBe(1);
    expect(endTurns(state, 2).state.round).toBe(2);
    expect(endTurns(state, 3).state.round).toBe(2);
  });

  it('follows the MP curve and caps at mp.max', () => {
    const { state } = newBattle(1);
    const first = state.firstPlayer;
    const curve = [1];
    let s = state;
    for (let turn = 2; turn <= 10; turn++) {
      s = endTurns(s, 2).state;
      s.players[first].hp = 30; // Arena/Yorgunluk testi bozmasın
      curve.push(s.players[first].maxMp);
    }
    expect(curve).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 8, 8]);
  });
});

describe('shield (K1)', () => {
  it('resets at the owner turn start, survives the enemy turn', () => {
    const { state } = newBattle(1);
    const me = state.active;
    setHand(state, me, ['guard', 'wall']);
    let s = apply(state, { type: 'PLAY_CARD', player: me, iid: `t${me}-0` }).state;
    s = apply(s, { type: 'PLAY_CARD', player: me, iid: `t${me}-1` }).state;
    expect(s.players[me].shield).toBe(11);
    s = endTurn(s).state;
    expect(s.players[me].shield).toBe(11);
    const r = endTurn(s);
    expect(r.state.players[me].shield).toBe(0);
    expect(r.events).toContainEqual({ type: 'SHIELD_EXPIRED', player: me, amount: 11 });
  });

  it('persists with the persistent variant', () => {
    const { state } = newBattle(1, withConfig({ shield: { persistence: 'persistent' } }));
    const me = state.active;
    setHand(state, me, ['guard']);
    let s = apply(state, { type: 'PLAY_CARD', player: me, iid: `t${me}-0` }).state;
    s = endTurns(s, 2).state;
    expect(s.players[me].shield).toBe(4);
    expect(s.players[me].shieldGainedThisTurn).toBe(0);
  });
});

describe('statuses (K7)', () => {
  it('self strength has no duration and survives turn ends until used', () => {
    const { state } = newBattle(1);
    const me = state.active;
    setHand(state, me, ['rally']);
    let s = apply(state, { type: 'PLAY_CARD', player: me, iid: `t${me}-0` }).state;
    expect(s.players[me].statuses).toEqual([{ id: 'strength', amount: 2, turnsLeft: null }]);
    s = endTurns(s, 6).state;
    expect(s.players[me].statuses).toEqual([{ id: 'strength', amount: 2, turnsLeft: null }]);
  });

  it('weak on the enemy lasts the enemy next two turns', () => {
    const { state } = newBattle(1);
    const me = state.active;
    const foe = me === 0 ? 1 : 0;
    setHand(state, me, ['taunt']);
    let s = apply(state, { type: 'PLAY_CARD', player: me, iid: `t${me}-0` }).state;
    s = endTurns(s, 2).state; // rakibin 1. turu bitti, sıra yine bende
    expect(s.players[foe].statuses[0]?.turnsLeft).toBe(1);
    s = endTurns(s, 2).state; // rakibin 2. turu bitti
    expect(s.players[foe].statuses).toEqual([]);
  });

  it('weak ignores smaller, refreshes equal, upgrades larger', () => {
    const { state } = newBattle(1);
    const me = state.active;
    state.players[me].statuses = [{ id: 'weak', amount: 2, turnsLeft: 1 }];
    addCard(state, 'small', 1, [
      { kind: 'applyStatus', target: 'self', status: 'weak', amount: 1 },
    ]);
    addCard(state, 'same', 1, [{ kind: 'applyStatus', target: 'self', status: 'weak', amount: 2 }]);
    addCard(state, 'big', 1, [{ kind: 'applyStatus', target: 'self', status: 'weak', amount: 3 }]);
    setHand(state, me, ['small', 'same', 'big']);
    let r = apply(state, { type: 'PLAY_CARD', player: me, iid: `t${me}-0` });
    expect(r.state.players[me].statuses).toEqual([{ id: 'weak', amount: 2, turnsLeft: 1 }]);
    expect(r.events).toContainEqual({
      type: 'STATUS_IGNORED',
      player: me,
      status: 'weak',
      amount: 1,
    });
    r = apply(r.state, { type: 'PLAY_CARD', player: me, iid: `t${me}-1` });
    expect(r.state.players[me].statuses).toEqual([{ id: 'weak', amount: 2, turnsLeft: 2 }]);
    setStatus(r.state, me, 'weak', 2, 1);
    r = apply(r.state, { type: 'PLAY_CARD', player: me, iid: `t${me}-2` });
    expect(r.state.players[me].statuses).toEqual([{ id: 'weak', amount: 3, turnsLeft: 2 }]);
  });

  it('strength and poison stack additively up to their caps', () => {
    const { state } = newBattle(1);
    const me = state.active;
    addCard(state, 's3', 0, [
      { kind: 'applyStatus', target: 'self', status: 'strength', amount: 3 },
    ]);
    addCard(state, 'p4', 0, [{ kind: 'applyStatus', target: 'self', status: 'poison', amount: 4 }]);
    setHand(state, me, ['s3', 's3', 'p4', 'p4']);
    let s = state;
    for (let i = 0; i < 4; i++)
      s = apply(s, { type: 'PLAY_CARD', player: me, iid: `t${me}-${i}` }).state;
    expect(s.players[me].statuses).toEqual([
      { id: 'strength', amount: 5, turnsLeft: null },
      { id: 'poison', amount: 6, turnsLeft: null },
    ]);
  });
});

describe('arena collapse', () => {
  it('starts at startRound, grows by step, ignores shield', () => {
    const { state } = newBattle(1);
    const first = state.firstPlayer;
    let s = endTurns(state, 12).state; // 7. raundun başı
    expect(s.round).toBe(7);
    const hp7 = s.players[first].hp;
    s.players[first].shield = 10;
    s.players[first].hp = 30;
    s = endTurns(s, 2).state; // 8. raunt
    const r8 = s.players[first];
    expect(s.round).toBe(8);
    expect(hp7).toBeGreaterThan(0);
    expect(r8.hp).toBe(30 - 1);
    s.players[first].hp = 30;
    s = endTurns(s, 2).state; // 9. raunt
    expect(s.players[first].hp).toBe(30 - 2);
  });

  it('a lethal collapse ends the battle before the draw (C1)', () => {
    const { state } = newBattle(1);
    const first = state.firstPlayer;
    const s = endTurns(state, 13).state; // 7. raunt, sıra ikinci oyuncuda
    s.players[first].hp = 1;
    const handBefore = s.players[first].hand.length;
    const r = endTurn(s);
    expect(r.state.result).toEqual({ winner: first === 0 ? 1 : 0, reason: 'arenaCollapse' });
    expect(r.state.players[first].hand).toHaveLength(handBefore);
    expect(r.events.at(-1)).toMatchObject({ type: 'BATTLE_ENDED', reason: 'arenaCollapse' });
    expect(() => apply(r.state, { type: 'END_TURN', player: r.state.active })).toThrow(
      'BATTLE_OVER',
    );
  });
});

describe('deck exhaustion (K2, N4)', () => {
  it('reshuffles once, then deals growing fatigue', () => {
    const cfg = withConfig({ arenaCollapse: { ...testConfig.arenaCollapse, startRound: 99 } });
    const { state } = newBattle(1, cfg);
    const me = state.active;
    const pl = state.players[me];
    pl.discard = pl.deck.splice(0); // deste boş, ıskarta dolu
    pl.hand = [];
    const s = endTurns(state, 2).state;
    expect(s.players[me].reshufflesLeft).toBe(0);
    expect(s.players[me].hand).toHaveLength(1);
    s.players[me].discard.push(...s.players[me].deck.splice(0));
    const r1 = endTurns(s, 2);
    expect(r1.events).toContainEqual({
      type: 'DAMAGE_DEALT',
      source: 'fatigue',
      target: me,
      amount: 1,
      absorbed: 0,
    });
    const r2 = endTurns(r1.state, 2);
    expect(r2.events).toContainEqual({
      type: 'DAMAGE_DEALT',
      source: 'fatigue',
      target: me,
      amount: 2,
      absorbed: 0,
    });
    expect(r2.state.players[me].fatigueCount).toBe(2);
  });

  it('does not spend the reshuffle when the discard is empty', () => {
    const { state } = newBattle(1);
    const me = state.active;
    state.players[me].deck = [];
    const s = endTurns(state, 2).state;
    expect(s.players[me].reshufflesLeft).toBe(1);
    expect(s.players[me].fatigueCount).toBe(1);
  });

  it('fatigue can end the battle', () => {
    const { state } = newBattle(1);
    const me = state.active;
    state.players[me].deck = [];
    state.players[me].hp = 1;
    const r = endTurns(state, 2);
    expect(r.state.result).toEqual({ winner: me === 0 ? 1 : 0, reason: 'fatigue' });
  });
});

describe('round cap', () => {
  it('ends in a draw after roundCap', () => {
    const cfg = withConfig({
      roundCap: 2,
      arenaCollapse: { ...testConfig.arenaCollapse, startRound: 99 },
    });
    const { state } = newBattle(1, cfg);
    const r = endTurns(state, 4);
    expect(r.state.result).toEqual({ winner: null, reason: 'roundCap' });
    expect(r.events.at(-1)).toMatchObject({ type: 'BATTLE_ENDED', winner: null, round: 2 });
  });
});
