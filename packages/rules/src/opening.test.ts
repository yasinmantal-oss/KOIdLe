import { describe, expect, it } from 'vitest';
import { createBattle } from './battle';
import { isHeavy, isOpener } from './cards';
import { testCards, testConfig } from './test-fixtures';
import type { BattleConfig, CardDef, CardTag } from './types';

const heavyTag: CardTag[] = ['heavy'];
// 'heavy' ve 'pierce' Ağır sayılır; açılış adayı (MP ≤ 1) yalnız 'hit'.
const cards: CardDef[] = testCards.map((c) =>
  c.id === 'heavy' || c.id === 'pierce' ? { ...c, tags: heavyTag } : c,
);
const deck = [
  'hit',
  'heavy',
  'pierce',
  'bash',
  'rally',
  'wall',
  'mend',
  'surge',
  'ruin',
  'bash',
  'rally',
  'wall',
];
const withFlag = (openingGuarantee: boolean): BattleConfig => ({
  ...testConfig,
  hand: { ...testConfig.hand, openingGuarantee },
});

const battle = (seed: number, config: BattleConfig) =>
  createBattle({ config, cards, decks: [deck, deck], names: ['A', 'B'], seed }).state;

describe('card helpers', () => {
  it('isHeavy reads the tag, isOpener compares cost to the starting MP', () => {
    const byId = (id: string) => cards.find((c) => c.id === id) as CardDef;
    expect(isHeavy(byId('heavy'))).toBe(true);
    expect(isHeavy(byId('hit'))).toBe(false);
    expect(isOpener(byId('hit'), testConfig)).toBe(true);
    expect(isOpener(byId('mend'), testConfig)).toBe(false);
  });
});

describe('opening hand guarantee (F2-7)', () => {
  it('has no heavy card and at least one opener for 200 seeds', () => {
    const config = withFlag(true);
    for (let seed = 0; seed < 200; seed++) {
      const s = battle(seed, config);
      const iids: string[] = [];
      for (const pl of s.players) {
        const ids = pl.hand.map((c) => c.cardId);
        expect(ids, `seed ${seed}`).not.toContain('heavy');
        expect(ids, `seed ${seed}`).not.toContain('pierce');
        expect(ids, `seed ${seed}`).toContain('hit');
        expect(pl.deck.length + pl.hand.length + pl.discard.length).toBe(12);
        iids.push(...[...pl.deck, ...pl.hand, ...pl.discard].map((c) => c.iid));
      }
      expect(new Set(iids).size).toBe(iids.length);
    }
  });

  it('without the flag heavy cards do show up in the opening hand', () => {
    const config = withFlag(false);
    let seen = false;
    for (let seed = 0; seed < 200 && !seen; seed++) {
      seen = battle(seed, config).players.some((pl) =>
        pl.hand.some((c) => c.cardId === 'heavy' || c.cardId === 'pierce'),
      );
    }
    expect(seen).toBe(true);
  });
});
