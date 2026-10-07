import { loadBattleConfig } from '@koidle/content-schema';
import { describe, expect, it } from 'vitest';
import { infoText } from './info';

describe('infoText', () => {
  const c = loadBattleConfig();
  it('uses config values', () => {
    expect(infoText('mp', c)).toContain(`en fazla ${c.mp.max}`);
    expect(infoText('hand', c)).toContain(String(c.hand.limit));
    expect(infoText('status:poison', c)).toContain(`${c.statuses.poison.decay} azalır`);
    expect(infoText('status:weak', c)).toContain(`${c.statuses.weak.duration} tur`);
    expect(infoText('fatigue', c)).toContain(
      `${c.fatigue.start}, ${c.fatigue.start + c.fatigue.step}`,
    );
  });
  it('explains every key with a non-empty text', () => {
    for (const k of [
      'hp',
      'mp',
      'hand',
      'deck',
      'discard',
      'reshuffle',
      'fatigue',
      'shield',
      'status:strength',
      'status:weak',
      'status:poison',
      'status:critical',
      'status:evade',
    ] as const) {
      expect(infoText(k, c).length).toBeGreaterThan(10);
    }
  });
});
