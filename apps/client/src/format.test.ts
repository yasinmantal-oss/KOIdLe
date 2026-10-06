import { loadBattleConfig } from '@koidle/content-schema';
import type { CardDef } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import { formatEvent, keywordParts, rulesSummary } from './format';

const testConfigForSummary = loadBattleConfig();

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
  it('describes the chain', () => {
    expect(formatEvent({ type: 'CHAIN_TRIGGERED', player: 0, chain: 2 }, cards)).toBe('Zincir ×2!');
  });

  it('describes stealth', () => {
    expect(formatEvent({ type: 'STEALTH_USED', player: 0, amount: 3 }, cards)).toBe(
      'Gizli: +3 hasar, Kalkanı yok sayar.',
    );
  });

  it('names poison damage', () => {
    expect(
      formatEvent(
        { type: 'DAMAGE_DEALT', source: 'poison', target: 1, amount: 4, absorbed: 0 },
        cards,
      ),
    ).toBe('Zehir: Rakibe 4 hasar.');
  });

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

describe('keywordParts', () => {
  it('marks Güç, Zayıf and Kalkan so the card text matches the status colors', () => {
    expect(keywordParts("Güç'ün varsa +3. Rakip Zayıfsa. Kalkanı yok say.")).toEqual([
      { text: 'Güç', kw: 'strength' },
      { text: "'ün varsa +3. Rakip ", kw: null },
      { text: 'Zayıf', kw: 'weak' },
      { text: 'sa. ', kw: null },
      { text: 'Kalkan', kw: 'shield' },
      { text: 'ı yok say.', kw: null },
    ]);
  });
});

describe('keywordParts (Faz 2)', () => {
  it('marks Lanet, Zehir, Gizli and Zincir with their own colors', () => {
    const kws = (t: string) => keywordParts(t).flatMap((p) => (p.kw ? [p.kw] : []));
    expect(kws('Kendine Gizli 3 ver.')).toEqual(['stealth']);
    expect(kws('Rakibe Zehir 4 ver.')).toEqual(['poison']);
    expect(kws('Kendine Güç 3 ve Lanet 2 ver.')).toEqual(['strength', 'curse']);
    expect(kws('2 hasar ver. Zincir 1: +2.')).toEqual(['chain']);
  });
});

describe('rulesSummary (Faz 2)', () => {
  it('explains Lanet, Zehir, Gizli, Zincir and Ağır from config values', () => {
    const text = rulesSummary(testConfigForSummary).join(' ');
    for (const word of ['Lanet', 'Zehir', 'Gizli', 'Zincir', 'Ağır']) expect(text).toContain(word);
    expect(text).toContain(`en fazla ${testConfigForSummary.deckBuilding.maxHeavy}`);
  });
});

describe('rulesSummary', () => {
  it('builds the short rule list from config values', () => {
    const lines = rulesSummary(testConfigForSummary);
    expect(lines.join('\n')).toContain('en fazla 6');
    expect(lines.join('\n')).toContain('8. rauntan');
    expect(lines.join('\n')).toContain('bir sonraki turunun başında sıfırlanır');
  });
});
