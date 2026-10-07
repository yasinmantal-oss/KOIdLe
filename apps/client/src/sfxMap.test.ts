import type { BattleEvent } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import { sfxFor } from './sfxMap';

describe('sfxFor', () => {
  it('maps a card play with crit, hit and shield in event order', () => {
    const events: BattleEvent[] = [
      { type: 'CARD_PLAYED', player: 0, iid: 'x', cardId: 'c', cost: 2 },
      { type: 'CRIT_USED', player: 0 },
      { type: 'DAMAGE_DEALT', source: 0, target: 1, amount: 12, absorbed: 0 },
      { type: 'SHIELD_GAINED', player: 0, amount: 4 },
    ];
    expect(sfxFor(events, 0)).toEqual([
      { kind: 'play' },
      { kind: 'crit' },
      { kind: 'hit', amount: 12 },
      { kind: 'shield' },
    ]);
  });
  it('poison ticks and evade sound, zero damage is silent', () => {
    const events: BattleEvent[] = [
      { type: 'DAMAGE_DEALT', source: 'poison', target: 0, amount: 2, absorbed: 0 },
      { type: 'DAMAGE_DEALT', source: 1, target: 0, amount: 0, absorbed: 3 },
      { type: 'EVADED', player: 0, attacker: 1 },
    ];
    expect(sfxFor(events, 0)).toEqual([{ kind: 'poison' }, { kind: 'evade' }]);
  });
  it('win and lose depend on the viewpoint; a draw is silent', () => {
    const end = (winner: 0 | 1 | null): BattleEvent => ({
      type: 'BATTLE_ENDED',
      winner,
      round: 5,
      reason: 'normalDamage',
    });
    expect(sfxFor([end(0)], 0)).toEqual([{ kind: 'win' }]);
    expect(sfxFor([end(1)], 0)).toEqual([{ kind: 'lose' }]);
    expect(sfxFor([end(null)], 0)).toEqual([]);
  });
});
