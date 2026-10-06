import { readFileSync } from 'node:fs';
import battleConfigJson from '@koidle/content/battle-config.json';
import warriorJson from '@koidle/content/cards/warrior.json';
import { createBattle } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import {
  ContentError,
  defaultDeck,
  loadAiProfiles,
  loadBattleConfig,
  loadCards,
  parseBattleConfig,
  parseCards,
} from './index';
import { valuesDocPath, valuesDocText } from './values-doc';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

describe('real content', () => {
  it('loads and validates', () => {
    expect(loadBattleConfig().hero.hp).toBeGreaterThan(0);
    expect(loadAiProfiles().balanced).toBeDefined();
  });

  it('warrior pool: 12 unique kebab-case cards covering all six types', () => {
    const cards = loadCards('warrior');
    expect(cards).toHaveLength(12);
    expect(new Set(cards.map((c) => c.id)).size).toBe(12);
    expect(new Set(cards.map((c) => c.type))).toEqual(
      new Set(['attack', 'skill', 'defense', 'heal', 'buff', 'debuff']),
    );
  });

  it('default deck matches config deck.size and starts a battle', () => {
    const config = loadBattleConfig();
    const deck = defaultDeck('warrior');
    expect(deck).toHaveLength(config.deck.size);
    const { state } = createBattle({
      config,
      cards: loadCards('warrior'),
      decks: [deck, deck],
      names: ['A', 'B'],
      seed: 1,
    });
    expect(state.players[0].hp).toBe(config.hero.hp);
  });

  it('docs/savas-degerleri.md is generated from content (C2, N7)', () => {
    const onDisk = readFileSync(valuesDocPath, 'utf8');
    expect(onDisk, 'docs/savas-degerleri.md güncel değil: pnpm values çalıştır').toBe(
      valuesDocText(),
    );
  });
});

describe('invalid content stops with a readable message', () => {
  type RawCard = Record<string, unknown>;
  const cardsError = (mutate: (card: (i: number) => RawCard) => void): string => {
    const cards = clone(warriorJson) as RawCard[];
    mutate((i) => {
      const c = cards[i];
      if (!c) throw new Error(`kart ${i} yok`);
      return c;
    });
    try {
      parseCards(cards, 'content/cards/warrior.json');
    } catch (e) {
      expect(e).toBeInstanceOf(ContentError);
      return (e as Error).message;
    }
    throw new Error('beklenen hata gelmedi');
  };

  it('negative cost', () => {
    expect(
      cardsError((c) => {
        c(0).cost = -1;
      }),
    ).toMatch(/content\/cards\/warrior\.json[\s\S]*\[0\]\.cost/);
  });

  it('unknown effect kind', () => {
    expect(
      cardsError((c) => {
        c(3).effects = [{ kind: 'hasar', amount: 3 }];
      }),
    ).toMatch(/\[3\]\.effects\[0\]\.kind/);
  });

  it('fractional number', () => {
    expect(
      cardsError((c) => {
        c(0).effects = [{ kind: 'damage', amount: 2.5 }];
      }),
    ).toMatch(/\[0\]\.effects\[0\]\.amount/);
  });

  it('missing field and duplicate id', () => {
    expect(
      cardsError((c) => {
        delete c(1).name;
      }),
    ).toMatch(/\[1\]\.name/);
    expect(
      cardsError((c) => {
        c(1).id = c(0).id;
      }),
    ).toMatch(/"yarma" birden fazla/);
  });

  it('bad config value', () => {
    const cfg = clone(battleConfigJson) as { shield: { persistence: string } };
    cfg.shield.persistence = 'forever';
    expect(() => parseBattleConfig(cfg)).toThrow(/battle-config\.json[\s\S]*shield\.persistence/);
  });
});
