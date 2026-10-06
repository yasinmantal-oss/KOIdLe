import type { CardDef } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import { formatEvent } from './format';

const cards: Record<string, CardDef> = {
  yarma: {
    id: 'yarma',
    name: 'Yarma',
    job: 'warrior',
    type: 'attack',
    cost: 1,
    effects: [],
    text: '',
  },
};

describe('formatEvent', () => {
  it('hides the opponent draw, shows mine', () => {
    expect(formatEvent({ type: 'CARD_DRAWN', player: 1, iid: 'x', cardId: 'yarma' }, cards)).toBe(
      'Rakip bir kart çekti.',
    );
    expect(formatEvent({ type: 'CARD_DRAWN', player: 0, iid: 'x', cardId: 'yarma' }, cards)).toBe(
      'Çektin: Yarma.',
    );
  });

  it('shows absorbed damage and system damage sources', () => {
    expect(
      formatEvent({ type: 'DAMAGE_DEALT', source: 0, target: 1, amount: 5, absorbed: 2 }, cards),
    ).toBe("Rakibe 5 hasar (2'i Kalkan'a).");
    expect(
      formatEvent(
        { type: 'DAMAGE_DEALT', source: 'arena', target: 0, amount: 2, absorbed: 0 },
        cards,
      ),
    ).toBe('Arena çöküyor: Sana 2 hasar.');
    expect(
      formatEvent(
        { type: 'DAMAGE_DEALT', source: 'fatigue', target: 1, amount: 3, absorbed: 0 },
        cards,
      ),
    ).toBe('Yorgunluk: Rakibe 3 hasar.');
  });

  it('describes the end', () => {
    expect(
      formatEvent({ type: 'BATTLE_ENDED', winner: 0, round: 9, reason: 'arenaCollapse' }, cards),
    ).toBe('Kazandın (Arena Çöküşü, 9. raunt).');
    expect(
      formatEvent({ type: 'BATTLE_ENDED', winner: null, round: 20, reason: 'roundCap' }, cards),
    ).toBe('Berabere (raunt tavanı).');
  });

  it('covers status events', () => {
    expect(
      formatEvent(
        { type: 'STATUS_APPLIED', player: 1, status: 'weak', amount: 2, duration: 2 },
        cards,
      ),
    ).toBe('Rakip: Zayıflık 2 (2 tur).');
  });
});
