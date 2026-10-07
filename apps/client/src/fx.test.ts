import type { BattleEvent } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import { FX, fxFor } from './fx';

const dmg = (
  amount: number,
  target: 0 | 1 = 1,
  source: 0 | 1 | 'arena' | 'poison' = 0,
  absorbed = 0,
): BattleEvent => ({ type: 'DAMAGE_DEALT', source, target, amount, absorbed });

describe('fxFor', () => {
  it('does nothing for an empty batch', () => {
    expect(fxFor([])).toEqual({
      hitstop: false,
      shakePx: 0,
      hitTargets: [],
      pops: [],
      callouts: [],
      edgeFlash: false,
    });
  });

  it('a small hit pops a number and flashes the target, no hitstop, no shake', () => {
    const r = fxFor([dmg(3)]);
    expect(r.pops).toEqual([{ target: 1, amount: 3 }]);
    expect(r.hitTargets).toEqual([1]);
    expect(r.hitstop).toBe(false);
    expect(r.shakePx).toBe(0);
  });

  it('thresholds: hitstop at 6, shake at 10, big shake at 14', () => {
    expect(fxFor([dmg(FX.hitstopAt)]).hitstop).toBe(true);
    expect(fxFor([dmg(FX.hitstopAt)]).shakePx).toBe(0);
    expect(fxFor([dmg(FX.shakeAt)]).shakePx).toBe(FX.shakePx);
    expect(fxFor([dmg(FX.shakeBigAt)]).shakePx).toBe(FX.shakeBigPx);
  });

  it('sums card damage across a multi-hit batch, one pop per hit', () => {
    const r = fxFor([dmg(2), dmg(2), dmg(2), dmg(2), dmg(2)]);
    expect(r.pops).toHaveLength(5);
    expect(r.shakePx).toBe(FX.shakePx);
  });

  it('system damage pops but does not shake or hitstop', () => {
    const r = fxFor([dmg(20, 0, 'arena'), dmg(15, 1, 'poison')]);
    expect(r.pops).toHaveLength(2);
    expect(r.hitstop).toBe(false);
    expect(r.shakePx).toBe(0);
  });

  it('zero damage pops but flashes nobody', () => {
    const r = fxFor([dmg(0)]);
    expect(r.pops).toEqual([{ target: 1, amount: 0 }]);
    expect(r.hitTargets).toEqual([]);
  });

  it('callouts for crit, evade and the Hell Blade combo, in event order', () => {
    const events: BattleEvent[] = [
      { type: 'STRENGTH_USED', player: 0, amount: 6, multiplier: 2 },
      { type: 'CRIT_USED', player: 0 },
      { type: 'EVADED', player: 1, attacker: 0 },
      dmg(13),
    ];
    expect(fxFor(events).callouts).toEqual(['KOMBO!', 'KRİTİK!', 'KAÇINDI!']);
  });

  it('plain Güç (multiplier 1) gives no combo callout', () => {
    expect(
      fxFor([{ type: 'STRENGTH_USED', player: 0, amount: 3, multiplier: 1 }]).callouts,
    ).toEqual([]);
  });

  it('calls out BUHARLAŞMA! when Donma is consumed in the same action as card damage', () => {
    const events: BattleEvent[] = [
      { type: 'STATUS_CONSUMED', player: 1, status: 'freeze' },
      dmg(5),
    ];
    expect(fxFor(events).callouts).toEqual(['BUHARLAŞMA!']);
    // Olay sırası ters gelirse de kombo çağrısı aynı kalır (hasar tüm yığından okunur).
    expect(fxFor([...events].reverse()).callouts).toEqual(['BUHARLAŞMA!']);
  });

  it('no BUHARLAŞMA! without damage or without consumed Donma', () => {
    expect(fxFor([{ type: 'STATUS_CONSUMED', player: 1, status: 'freeze' }]).callouts).toEqual([]);
    expect(
      fxFor([{ type: 'STATUS_CONSUMED', player: 1, status: 'poison' }, dmg(5)]).callouts,
    ).toEqual([]);
    // Sistem hasarı (Arena/Yorgunluk) kart hasarı sayılmaz.
    expect(
      fxFor([{ type: 'STATUS_CONSUMED', player: 1, status: 'freeze' }, dmg(5, 1, 'arena')])
        .callouts,
    ).toEqual([]);
  });

  it('calls out PARASİT! when max HP is reduced', () => {
    expect(fxFor([{ type: 'MAX_HP_REDUCED', player: 1, amount: 4, maxHp: 26 }]).callouts).toEqual([
      'PARASİT!',
    ]);
  });

  it('keeps the Faz 2b callouts in event order', () => {
    const events: BattleEvent[] = [
      { type: 'STATUS_CONSUMED', player: 1, status: 'freeze' },
      dmg(3),
      { type: 'MAX_HP_REDUCED', player: 1, amount: 2, maxHp: 28 },
    ];
    expect(fxFor(events).callouts).toEqual(['BUHARLAŞMA!', 'PARASİT!']);
  });

  it('edge flash only for big damage taken by the viewer', () => {
    expect(fxFor([dmg(FX.edgeFlashAt, 0, 1)], 0).edgeFlash).toBe(true);
    expect(fxFor([dmg(FX.edgeFlashAt - 1, 0, 1)], 0).edgeFlash).toBe(false);
    expect(fxFor([dmg(20, 1, 0)], 0).edgeFlash).toBe(false);
  });
});
