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

  it('callouts for chain and stealth, in event order', () => {
    const events: BattleEvent[] = [
      { type: 'CHAIN_TRIGGERED', player: 0, chain: 3 },
      { type: 'STEALTH_USED', player: 0, amount: 7 },
      dmg(13),
    ];
    expect(fxFor(events).callouts).toEqual(['ZİNCİR ×3!', 'CRITIC!']);
  });
});
