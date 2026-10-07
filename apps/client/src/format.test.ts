import { loadBattleConfig } from '@koidle/content-schema';
import type { CardDef } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import { formatEvent, glossaryLine, keywordParts, rulesSummary } from './format';

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
  it('describes Kritik, Kaçınma, Güç and MP gain', () => {
    expect(formatEvent({ type: 'CRIT_USED', player: 0 }, cards)).toBe(
      'Sen: Kritik! Kartın her vuruşu iki kat.',
    );
    expect(formatEvent({ type: 'EVADED', player: 1, attacker: 0 }, cards)).toBe(
      'Rakip: Kaçınma! Sen kartının ilk vuruşu 0 hasar verdi.',
    );
    expect(formatEvent({ type: 'STRENGTH_USED', player: 0, amount: 3, multiplier: 1 }, cards)).toBe(
      'Güç: ilk vuruşa +3 hasar.',
    );
    expect(formatEvent({ type: 'STRENGTH_USED', player: 0, amount: 6, multiplier: 2 }, cards)).toBe(
      'Güç iki kat sayıldı: ilk vuruşa +6 hasar.',
    );
  });

  it('describes self damage and valueless statuses', () => {
    expect(
      formatEvent({ type: 'DAMAGE_DEALT', source: 0, target: 0, amount: 2, absorbed: 0 }, cards),
    ).toBe('Sen kendine 2 hasar verdi.');
    expect(
      formatEvent(
        { type: 'STATUS_APPLIED', player: 0, status: 'evade', amount: 1, duration: null },
        cards,
      ),
    ).toBe('Sen: Kaçınma.');
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
  it('marks Zehir, Kritik and Kaçınma with their own colors', () => {
    const kws = (t: string) => keywordParts(t).flatMap((p) => (p.kw ? [p.kw] : []));
    expect(kws('Kendine Kritik kazan.')).toEqual(['critical']);
    expect(kws('6 hasar ver, sonra Kaçınma kazan.')).toEqual(['evade']);
    expect(kws('Rakibe 4 Zehir ver.')).toEqual(['poison']);
    expect(kws('3 Güç kazan. Kendine 2 hasar ver.')).toEqual(['strength']);
  });
});

describe('glossaryLine', () => {
  it('explains every keyword on the card in one line, null without keywords', () => {
    expect(glossaryLine('3 hasar ver.', testConfigForSummary)).toBeNull();
    const line = glossaryLine('2 hasar ver. Rakibe Zayıflık 2 ver.', testConfigForSummary);
    expect(line).toContain('Zayıflık:');
    expect(line).toContain(`${testConfigForSummary.statuses.weak.duration} tur`);
    expect(glossaryLine('6 hasar ver. Kalkanı deler.', testConfigForSummary)).toContain('Kalkan:');
    expect(glossaryLine('Kritik kazan.', testConfigForSummary)).toContain('Kritik:');
    expect(glossaryLine('9 hasar ver. Güç’ün iki kat sayılır.', testConfigForSummary)).toContain(
      'Güç:',
    );
  });
});

describe('rulesSummary (Faz 2)', () => {
  it('explains Zehir, Kritik, Kaçınma and Ağır from config values', () => {
    const text = rulesSummary(testConfigForSummary).join(' ');
    for (const word of ['Zehir', 'Kritik', 'Kaçınma', 'Ağır']) expect(text).toContain(word);
    expect(text).not.toMatch(/Lanet|Gizli|Zincir/);
    expect(text).toContain(`en fazla ${testConfigForSummary.deckBuilding.maxHeavy}`);
  });
});

describe('rulesSummary', () => {
  it('builds the short rule list from config values', () => {
    const lines = rulesSummary(testConfigForSummary);
    expect(lines.join('\n')).toContain('en fazla 6');
    expect(lines.join('\n')).not.toContain('Arena');
    const on = rulesSummary({
      ...testConfigForSummary,
      arenaCollapse: { ...testConfigForSummary.arenaCollapse, enabled: true },
    });
    expect(on.join('\n')).toContain('8. rauntan');
    expect(lines.join('\n')).toContain('bir sonraki turunun başında sıfırlanır');
  });
});
