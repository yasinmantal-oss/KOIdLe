import { describe, expect, it } from 'vitest';
import { apply } from './engine';
import { previewCard } from './preview';
import { addCard, newBattle, setHand, setStatus } from './test-fixtures';
import type { BattleState, CardDef, PlayerIndex } from './types';

function setup(hand: string[], mp = 8) {
  const { state } = newBattle(1);
  const me = state.active;
  const foe: PlayerIndex = me === 0 ? 1 : 0;
  setHand(state, me, hand, mp);
  return { state, me, foe };
}

const play = (s: BattleState, me: PlayerIndex, i: number) =>
  apply(s, { type: 'PLAY_CARD', player: me, iid: `t${me}-${i}` });

describe('PLAY_CARD validation', () => {
  it('rejects missing card, too little MP and wrong player', () => {
    const { state, me, foe } = setup(['heavy'], 2);
    expect(() => play(state, me, 0)).toThrow('NOT_ENOUGH_MP');
    expect(() => apply(state, { type: 'PLAY_CARD', player: me, iid: 'nope' })).toThrow(
      'CARD_NOT_IN_HAND',
    );
    expect(() => apply(state, { type: 'PLAY_CARD', player: foe, iid: `t${me}-0` })).toThrow(
      'NOT_YOUR_TURN',
    );
  });

  it('moves the card to discard, spends MP, emits CARD_PLAYED first', () => {
    const { state, me } = setup(['hit'], 3);
    const discardBefore = state.players[me].discard.length;
    const { state: s, events } = play(state, me, 0);
    expect(s.players[me].hand).toHaveLength(0);
    expect(s.players[me].discard).toHaveLength(discardBefore + 1);
    expect(s.players[me].mp).toBe(2);
    expect(events[0]).toEqual({
      type: 'CARD_PLAYED',
      player: me,
      iid: `t${me}-0`,
      cardId: 'hit',
      cost: 1,
    });
  });
});

describe('damage', () => {
  it('shield absorbs first', () => {
    const { state, me, foe } = setup(['hit']);
    state.players[foe].shield = 2;
    const { state: s, events } = play(state, me, 0);
    expect(s.players[foe].shield).toBe(0);
    expect(s.players[foe].hp).toBe(29);
    expect(events).toContainEqual({
      type: 'DAMAGE_DEALT',
      source: me,
      target: foe,
      amount: 3,
      absorbed: 2,
    });
  });

  it('applies strength and weak, never below zero', () => {
    const a = setup(['hit']);
    setStatus(a.state, a.me, 'strength', 2);
    expect(play(a.state, a.me, 0).state.players[a.foe].hp).toBe(25);
    const b = setup(['hit']);
    setStatus(b.state, b.me, 'weak', 2);
    expect(play(b.state, b.me, 0).state.players[b.foe].hp).toBe(29);
    const c = setup(['hit']);
    setStatus(c.state, c.me, 'weak', 5);
    expect(play(c.state, c.me, 0).state.players[c.foe].hp).toBe(30);
  });

  it('ignoreShield leaves shield and hits HP', () => {
    const { state, me, foe } = setup(['pierce']);
    state.players[foe].shield = 10;
    const s = play(state, me, 0).state;
    expect(s.players[foe].shield).toBe(10);
    expect(s.players[foe].hp).toBe(24);
  });

  it('lethal damage ends the battle and skips remaining effects', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'finisher', 1, [
      { kind: 'damage', amount: 5 },
      { kind: 'shield', amount: 9 },
    ]);
    setHand(state, me, ['finisher']);
    state.players[foe].hp = 5;
    const { state: s, events } = play(state, me, 0);
    expect(s.result).toEqual({ winner: me, reason: 'normalDamage' });
    expect(s.players[me].shield).toBe(0);
    expect(events.at(-1)).toMatchObject({ type: 'BATTLE_ENDED', winner: me });
  });
});

describe('damageFromShieldGainedThisTurn (C3)', () => {
  it('deals the shield gained this turn, keeps the shield', () => {
    const { state, me, foe } = setup(['wall', 'bash']);
    let s = play(state, me, 0).state;
    s = play(s, me, 1).state;
    expect(s.players[me].shield).toBe(7);
    expect(s.players[foe].hp).toBe(23);
  });

  it('ignores shield carried over from an earlier turn', () => {
    const { state, me, foe } = setup(['bash']);
    state.players[me].shield = 9; // persistent varyantında önceki turdan kalmış gibi
    state.players[me].shieldGainedThisTurn = 0;
    const { events } = play(state, me, 0);
    expect(events).toContainEqual({
      type: 'DAMAGE_DEALT',
      source: me,
      target: foe,
      amount: 0,
      absorbed: 0,
    });
  });

  it('gets strength too', () => {
    const { state, me, foe } = setup(['guard', 'bash']);
    setStatus(state, me, 'strength', 2);
    let s = play(state, me, 0).state;
    s = play(s, me, 1).state;
    expect(s.players[foe].hp).toBe(24);
  });
});

describe('shield, heal, draw, status', () => {
  it('shield stacks within a turn', () => {
    const { state, me } = setup(['guard', 'wall']);
    const s = play(play(state, me, 0).state, me, 0 + 1).state;
    expect(s.players[me].shield).toBe(11);
    expect(s.players[me].shieldGainedThisTurn).toBe(11);
  });

  it('heal is capped at max HP and reports the real amount', () => {
    const { state, me } = setup(['mend']);
    state.players[me].hp = 27;
    state.players[me].shield = 3;
    const { state: s, events } = play(state, me, 0);
    expect(s.players[me].hp).toBe(30);
    expect(s.players[me].shield).toBe(3);
    expect(events).toContainEqual({ type: 'HEALED', player: me, amount: 3 });
  });

  it('draw adds to hand below the limit and burns at the limit', () => {
    const seven = ['hit', 'hit', 'hit', 'hit', 'hit', 'hit', 'hit'];
    const a = setup(['study', ...seven]); // oynayınca el 7 → çekilen kart ele girer
    const ra = play(a.state, a.me, 0);
    expect(ra.events.some((e) => e.type === 'CARD_DRAWN')).toBe(true);
    expect(ra.state.players[a.me].hand).toHaveLength(8);
    const b = setup(['study', ...seven, 'hit']); // oynayınca el 8 → çekilen kart yanar
    const rb = play(b.state, b.me, 0);
    expect(rb.events.some((e) => e.type === 'CARD_BURNED')).toBe(true);
    expect(rb.state.players[b.me].hand).toHaveLength(8);
  });

  it('draw from an empty deck with no reshuffle deals fatigue', () => {
    const { state, me } = setup(['study']);
    state.players[me].deck = [];
    state.players[me].reshufflesLeft = 0;
    const { events, state: s } = play(state, me, 0);
    expect(events).toContainEqual({
      type: 'DAMAGE_DEALT',
      source: 'fatigue',
      target: me,
      amount: 1,
      absorbed: 0,
    });
    expect(s.players[me].hp).toBe(29);
  });

  it('applyStatus targets the enemy and takes duration from config', () => {
    const { state, me, foe } = setup(['taunt']);
    const { state: s, events } = play(state, me, 0);
    expect(s.players[foe].statuses).toEqual([{ id: 'weak', amount: 2, turnsLeft: 2 }]);
    expect(events).toContainEqual({
      type: 'STATUS_APPLIED',
      player: foe,
      status: 'weak',
      amount: 2,
      duration: 2,
    });
  });
});

describe('conditional damage bonus (Combat v0.2)', () => {
  const bonusCard = (state: BattleState, id: string, bonus: Record<string, unknown>) =>
    addCard(state, id, 1, [
      { kind: 'damage', amount: 3, bonus: { if: bonus, amount: 4 } } as CardDef['effects'][0],
    ]);

  it('selfHas: adds the bonus only while the player has the status', () => {
    const a = setup([]);
    bonusCard(a.state, 'b', { selfHas: 'strength' });
    setHand(a.state, a.me, ['b']);
    expect(play(a.state, a.me, 0).state.players[a.foe].hp).toBe(27);

    const b = setup([]);
    bonusCard(b.state, 'b', { selfHas: 'strength' });
    setHand(b.state, b.me, ['b']);
    setStatus(b.state, b.me, 'strength', 2);
    // 3 + 4 bonus + 2 Güç
    expect(play(b.state, b.me, 0).state.players[b.foe].hp).toBe(21);
  });

  it('enemyHas: adds the bonus only while the enemy has the status', () => {
    const a = setup([]);
    bonusCard(a.state, 'b', { enemyHas: 'weak' });
    setHand(a.state, a.me, ['b']);
    expect(play(a.state, a.me, 0).state.players[a.foe].hp).toBe(27);

    const b = setup([]);
    bonusCard(b.state, 'b', { enemyHas: 'weak' });
    setHand(b.state, b.me, ['b']);
    setStatus(b.state, b.foe, 'weak', 2);
    expect(play(b.state, b.me, 0).state.players[b.foe].hp).toBe(23);
  });

  it('enemyHpAtMost: threshold is inclusive', () => {
    const at = setup([]);
    bonusCard(at.state, 'b', { enemyHpAtMost: 15 });
    setHand(at.state, at.me, ['b']);
    at.state.players[at.foe].hp = 15;
    expect(play(at.state, at.me, 0).state.players[at.foe].hp).toBe(8);

    const above = setup([]);
    bonusCard(above.state, 'b', { enemyHpAtMost: 15 });
    setHand(above.state, above.me, ['b']);
    above.state.players[above.foe].hp = 16;
    expect(play(above.state, above.me, 0).state.players[above.foe].hp).toBe(13);
  });
});

describe('previewCard (UI önizlemesi, saf)', () => {
  it('shows the damage the card would deal now and whether its bonus is active', () => {
    const { state, me } = setup([]);
    addCard(state, 'b', 1, [
      { kind: 'damage', amount: 3, bonus: { if: { selfHas: 'strength' }, amount: 4 } },
    ]);
    expect(previewCard(state, me, 'b')).toEqual({ damage: 3, bonusActive: false });
    setStatus(state, me, 'strength', 2);
    expect(previewCard(state, me, 'b')).toEqual({ damage: 9, bonusActive: true });
  });

  it('counts shield gained this turn for Kalkan Darbesi and ignores non-damage cards', () => {
    const { state, me } = setup(['wall', 'bash']);
    const s = play(state, me, 0).state;
    expect(previewCard(s, me, 'bash')).toEqual({ damage: 7, bonusActive: null });
    expect(previewCard(s, me, 'wall')).toEqual({ damage: null, bonusActive: null });
  });

  it('counts shield the card itself grants before its shield-based damage', () => {
    const { state, me } = setup([]);
    addCard(state, 'selfbash', 2, [
      { kind: 'shield', amount: 4 },
      { kind: 'damageFromShieldGainedThisTurn' },
    ]);
    expect(previewCard(state, me, 'selfbash')).toEqual({ damage: 4, bonusActive: null });
    state.players[me].shieldGainedThisTurn = 7;
    expect(previewCard(state, me, 'selfbash')).toEqual({ damage: 11, bonusActive: null });
  });

  it('does not mutate state', () => {
    const { state, me } = setup(['hit']);
    const before = JSON.stringify(state);
    previewCard(state, me, 'hit');
    expect(JSON.stringify(state)).toBe(before);
  });
});
