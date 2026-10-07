import { describe, expect, it } from 'vitest';
import { apply } from './engine';
import { previewCard } from './preview';
import { addCard, newBattle, setHand, setStatus } from './test-fixtures';
import type { BattleState, PlayerIndex } from './types';

/** Karşılıklı tur: statülerin süresi sahibinin tur sonunda düşer. */
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

describe('Donma (freeze)', () => {
  it('verilir, süresi dolar ve Ateş onu tüketir', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'ice', 1, [
      { kind: 'applyStatus', target: 'enemy', status: 'freeze', amount: 1 },
    ]);
    addCard(state, 'flame', 1, [{ kind: 'damageFire', amount: 2, bonus: 3 }]);
    setHand(state, me, ['ice', 'flame']);
    const r1 = play(state, me, 0);
    expect(r1.state.players[foe].statuses).toEqual([{ id: 'freeze', amount: 1, turnsLeft: 2 }]);
    // Donma tek başına hasar vermez.
    expect(r1.state.players[foe].hp).toBe(30);

    const r2 = play(r1.state, me, 1);
    expect(r2.state.players[foe].hp).toBe(30 - 5); // 2 + 3 Ateş bonusu
    expect(r2.state.players[foe].statuses).toEqual([]);
    expect(r2.events).toContainEqual({ type: 'STATUS_CONSUMED', player: foe, status: 'freeze' });
  });

  it('Ateş, Donma yokken bonus vermez ve olay yazmaz', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'flame', 1, [{ kind: 'damageFire', amount: 2, bonus: 3 }]);
    setHand(state, me, ['flame']);
    const r = play(state, me, 0);
    expect(r.state.players[foe].hp).toBe(28);
    expect(r.events.some((e) => e.type === 'STATUS_CONSUMED')).toBe(false);
  });

  it('K7: küçük değer yok sayılır, eşit değer süreyi yeniler', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'ice', 1, [
      { kind: 'applyStatus', target: 'enemy', status: 'freeze', amount: 1 },
    ]);
    setHand(state, me, ['ice']);
    let s = play(state, me, 0).state;
    s = endTurn(s).state; // kendi turum bitti
    s = endTurn(s).state; // rakibin turu bitti → süre 2 → 1
    expect(s.players[foe].statuses[0]?.turnsLeft).toBe(1);
    setHand(s, me, ['ice']);
    const r = play(s, me, 0);
    expect(r.state.players[foe].statuses[0]?.turnsLeft).toBe(2); // yenilendi
  });

  it('süre bitince kalkan gibi kendiliğinden düşer', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'ice', 1, [
      { kind: 'applyStatus', target: 'enemy', status: 'freeze', amount: 1 },
    ]);
    setHand(state, me, ['ice']);
    let s = play(state, me, 0).state;
    s = endTurn(s).state; // kendi turum bitti
    s = endTurn(s).state; // rakip 1. tur: süre 1
    expect(s.players[foe].statuses).toHaveLength(1);
    s = endTurn(s).state; // kendi 2. turum bitti
    s = endTurn(s).state; // rakip 2. tur: süre bitti
    expect(s.players[foe].statuses).toEqual([]);
  });

  it('önizleme Donma varken bonusu gösterir', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'flame', 1, [{ kind: 'damageFire', amount: 2, bonus: 3 }]);
    addCard(state, 'ice', 1, [
      { kind: 'applyStatus', target: 'enemy', status: 'freeze', amount: 1 },
    ]);
    expect(previewCard(state, me, 'flame')).toEqual({ damage: 2, bonusActive: false });
    setStatus(state, foe, 'freeze', 1);
    expect(previewCard(state, me, 'flame')).toEqual({ damage: 5, bonusActive: true });
  });
});

describe('Taşan iyileşme (Priest)', () => {
  it('maks HP üstü iyileşme Kalkan olur', () => {
    const { state, me } = setup([]);
    addCard(state, 'ch', 1, [{ kind: 'heal', amount: 15, overflowToShield: true }]);
    setHand(state, me, ['ch']);
    state.players[me].hp = 20;
    const r = play(state, me, 0);
    expect(r.state.players[me].hp).toBe(30);
    expect(r.state.players[me].shield).toBe(5);
    expect(r.state.players[me].shieldGainedThisTurn).toBe(5);
    expect(r.events).toContainEqual({ type: 'HEALED', player: me, amount: 10 });
    expect(r.events).toContainEqual({ type: 'SHIELD_GAINED', player: me, amount: 5 });
  });

  it('bayrak kapalıysa taşma yok sayılır (eski davranış)', () => {
    const { state, me } = setup([]);
    addCard(state, 'mend', 1, [{ kind: 'heal', amount: 15 }]);
    setHand(state, me, ['mend']);
    state.players[me].hp = 20;
    const r = play(state, me, 0);
    expect(r.state.players[me].hp).toBe(30);
    expect(r.state.players[me].shield).toBe(0);
  });
});

describe('Maks HP azaltma (Parasite)', () => {
  it('kalıcıdır, HP maksa iner ve iyileşmeyle geri gelmez', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'db', 1, [{ kind: 'reduceMaxHp', amount: 4 }]);
    setHand(state, me, ['db']);
    const r = play(state, me, 0);
    expect(r.state.players[foe].maxHp).toBe(26);
    expect(r.state.players[foe].maxHpReduction).toBe(4);
    expect(r.events).toContainEqual({
      type: 'MAX_HP_REDUCED',
      player: foe,
      amount: 4,
      maxHp: 26,
    });
  });

  it('rakip tam HP iken HP düşmez, iyileşme yeni maksı geçemez', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'db', 1, [{ kind: 'reduceMaxHp', amount: 4 }]);
    addCard(state, 'mend', 1, [{ kind: 'heal', amount: 10 }]);
    setHand(state, me, ['db']);
    const s = play(state, me, 0).state;
    expect(s.players[foe].hp).toBe(26); // tavan 26'ya inince tam HP de maksa iner

    // Sıra rakipte: iyileşme yeni maksı (26) geçemez.
    const s2 = endTurn(s).state;
    expect(s2.active).toBe(foe);
    setHand(s2, foe, ['mend']);
    const r = apply(s2, { type: 'PLAY_CARD', player: foe, iid: `t${foe}-0` });
    expect(r.state.players[foe].hp).toBe(26);
    expect(r.state.players[foe].maxHp).toBe(26);
  });
  it('HP maksın üstündeyken maksa iner', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'db', 1, [{ kind: 'reduceMaxHp', amount: 20 }]);
    setHand(state, me, ['db']);
    const r = play(state, me, 0);
    expect(r.state.players[foe].maxHp).toBe(10);
    expect(r.state.players[foe].hp).toBe(10);
  });
});

describe('Judgement (debuff sayımı)', () => {
  const judge = (s: BattleState, me: PlayerIndex) => {
    addCard(s, 'judge', 1, [
      {
        kind: 'damage',
        amount: 3,
        bonus: { if: { enemyDebuffCount: { per: 3 } }, amount: 3 },
      },
    ]);
    setHand(s, me, ['judge']);
    return play(s, me, 0);
  };

  it('olumsuz statü yoksa taban hasar', () => {
    const { state, me, foe } = setup([]);
    expect(judge(state, me).state.players[foe].hp).toBe(27);
  });

  it('her olumsuz statü (Zayıflık, Zehir, Donma) +3 ekler', () => {
    const { state, me, foe } = setup([]);
    setStatus(state, foe, 'weak', 2);
    expect(judge(state, me).state.players[foe].hp).toBe(24);

    const second = setup([]);
    setStatus(second.state, second.foe, 'weak', 2);
    setStatus(second.state, second.foe, 'poison', 2);
    expect(judge(second.state, second.me).state.players[second.foe].hp).toBe(21);

    const third = setup([]);
    setStatus(third.state, third.foe, 'weak', 2);
    setStatus(third.state, third.foe, 'poison', 2);
    setStatus(third.state, third.foe, 'freeze', 1);
    expect(judge(third.state, third.me).state.players[third.foe].hp).toBe(30 - 12);
  });

  it('Güç, Kritik ve Kaçınma olumsuz sayılmaz', () => {
    // Kritik: taban 3 × 2 = 6 → sayıma girselerdi 12 olurdu.
    const crit = setup([]);
    setStatus(crit.state, crit.me, 'critical', 1);
    expect(judge(crit.state, crit.me).state.players[crit.foe].hp).toBe(24);

    // Kaçınma: ilk vuruş 0 → sayıma girselerdi en az 3 hasar geçerdi.
    const evade = setup([]);
    setStatus(evade.state, evade.foe, 'evade', 1);
    expect(judge(evade.state, evade.me).state.players[evade.foe].hp).toBe(30);

    // Güç: rakipte olması hasarı değiştirmez (statü sahibine yarar).
    const strength = setup([]);
    setStatus(strength.state, strength.foe, 'strength', 3);
    expect(judge(strength.state, strength.me).state.players[strength.foe].hp).toBe(27);
  });

  it('maks HP azaltma statü değildir, sayıma girmez', () => {
    const { state, me, foe } = setup([]);
    state.players[foe].maxHpReduction = 4;
    state.players[foe].maxHp = 26;
    expect(judge(state, me).state.players[foe].hp).toBe(27);
  });
});
