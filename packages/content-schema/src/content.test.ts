import { readFileSync } from 'node:fs';
import battleConfigJson from '@koidle/content/battle-config.json';
import commonJson from '@koidle/content/cards/common.json';
import rogueJson from '@koidle/content/cards/rogue.json';
import warriorJson from '@koidle/content/cards/warrior.json';
import { apply, createBattle, isHeavy } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import {
  ARCHETYPE_IDS,
  type ArchetypeId,
  ContentError,
  deckStats,
  loadAiPlanner,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPool,
  loadPresetDeck,
  loadPresetDecks,
  parseAiPlanner,
  parseBattleConfig,
  parseCards,
  validateDeck,
} from './index';
import { valuesDocPath, valuesDocText } from './values-doc';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const config = loadBattleConfig();
const cards = loadAllCards();
const issues = (deck: string[], id: ArchetypeId) => validateDeck(deck, id, cards, config);

describe('real content', () => {
  it('loads and validates', () => {
    expect(loadBattleConfig().hero.hp).toBeGreaterThan(0);
    expect(loadAiProfiles().balanced).toBeDefined();
  });

  it('32 cards, ids unique across files', () => {
    expect(cards).toHaveLength(32);
    expect(new Set(cards.map((c) => c.id)).size).toBe(32);
    const ids = [...commonJson, ...warriorJson, ...rogueJson].map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(ARCHETYPE_IDS)('%s pool: 15 cards, exactly 3 heavy', (id) => {
    const pool = loadPool(id);
    expect(pool).toHaveLength(15);
    expect(pool.filter(isHeavy)).toHaveLength(3);
  });

  it('a Rogue branch never leaks into the other branch pool', () => {
    expect(loadPool('assassin').some((c) => c.branch === 'archer')).toBe(false);
    expect(loadPool('archer').some((c) => c.branch === 'assassin')).toBe(false);
    expect(loadPool('warrior').some((c) => c.job === 'rogue')).toBe(false);
  });

  it.each(ARCHETYPE_IDS)('%s preset deck is valid and starts a battle', (id) => {
    const deck = loadPresetDeck(id);
    expect(deck).toHaveLength(config.deck.size);
    expect(issues(deck, id)).toEqual([]);
    const stats = deckStats(deck, cards, config);
    expect(stats.heavy).toBeLessThanOrEqual(config.deckBuilding.maxHeavy);
    expect(stats.openers).toBeGreaterThanOrEqual(config.deckBuilding.minOpeners);
    const { state } = createBattle({
      config,
      cards,
      decks: [deck, deck],
      names: ['A', 'B'],
      seed: 1,
    });
    expect(state.players[0].hp).toBe(config.hero.hp);
  });

  it('loadPresetDecks returns all three', () => {
    expect(Object.keys(loadPresetDecks()).sort()).toEqual(['archer', 'assassin', 'warrior']);
  });

  it('Stab → Thrust → Spike deals 16 in one turn (real content)', () => {
    const deck = loadPresetDeck('assassin');
    const { state } = createBattle({
      config,
      cards,
      decks: [deck, deck],
      names: ['A', 'B'],
      seed: 1,
    });
    const me = state.active;
    const foe = me === 0 ? 1 : 0;
    const pl = state.players[me];
    pl.hand = ['stab', 'thrust', 'spike'].map((cardId, i) => ({ iid: `c${i}`, cardId }));
    pl.mp = 6;
    pl.maxMp = 6;
    let s = state;
    for (let i = 0; i < 3; i++) s = apply(s, { type: 'PLAY_CARD', player: me, iid: `c${i}` }).state;
    expect(s.players[foe].hp).toBe(config.hero.hp - 16);
  });

  it('docs/savas-degerleri.md is generated from content (C2, N7)', () => {
    const onDisk = readFileSync(valuesDocPath, 'utf8');
    expect(onDisk, 'docs/savas-degerleri.md güncel değil: pnpm values çalıştır').toBe(
      valuesDocText(),
    );
  });
});

describe('validateDeck', () => {
  const warrior = loadPresetDeck('warrior');

  it('13 cards', () => {
    expect(issues([...warrior, 'valor'], 'warrior').join('\n')).toMatch(/12 kart/);
  });

  it('duplicate card', () => {
    const deck = [...warrior.slice(0, 11), warrior[0] ?? ''];
    expect(issues(deck, 'warrior').join('\n')).toMatch(/birden fazla/);
  });

  it('unknown card', () => {
    const deck = ['yok-boyle-kart', ...warrior.slice(1)];
    expect(issues(deck, 'warrior').join('\n')).toMatch(/bilinmeyen/);
  });

  it('an Assassin card in an Archer deck', () => {
    const deck = loadPresetDeck('archer').map((id) => (id === 'viper' ? 'stab' : id));
    expect(issues(deck, 'archer').join('\n')).toMatch(/Stab.*havuzunda değil/);
  });

  it('3 heavy cards', () => {
    const deck = warrior.map((id) => (id === 'absoluteness' ? 'wall-of-iron' : id));
    expect(issues(deck, 'warrior').join('\n')).toMatch(/Ağır kart en fazla 2/);
  });

  it('only 2 one-MP cards', () => {
    const deck = [
      'leg-cutting',
      'berserker',
      'iron-skin',
      'cleave',
      'howling-sword',
      'valor',
      'power-strike',
      'wall-of-iron',
      'sword-dancing',
      'hell-blade',
      'intimidate',
      'quick-strike',
    ];
    expect(deckStats(deck, cards, config)).toEqual({ size: 12, heavy: 3, openers: 2 });
    expect(issues(deck, 'warrior').join('\n')).toMatch(/MP'lik kart gerekli/);
  });
});

describe('invalid content stops with a readable message', () => {
  type RawCard = Record<string, unknown>;
  const cardsError = (mutate: (card: (i: number) => RawCard) => void): string => {
    const list = clone(warriorJson) as RawCard[];
    mutate((i) => {
      const c = list[i];
      if (!c) throw new Error(`kart ${i} yok`);
      return c;
    });
    try {
      parseCards(list, 'content/cards/warrior.json', 'warrior');
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

  it('unknown bonus condition', () => {
    expect(
      cardsError((c) => {
        c(0).effects = [
          { kind: 'damage', amount: 3, bonus: { if: { selfHas: 'rage' }, amount: 2 } },
        ];
      }),
    ).toMatch(/\[0\]\.effects\[0\]\.bonus\.if/);
  });

  it('single hit count is rejected (hits must be 2 or more)', () => {
    expect(
      cardsError((c) => {
        c(0).effects = [{ kind: 'damage', amount: 3, hits: 1 }];
      }),
    ).toMatch(/\[0\]\.effects\[0\]\.hits/);
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
    ).toMatch(/"slash" birden fazla/);
  });

  it('a card in the wrong job file', () => {
    expect(
      cardsError((c) => {
        c(0).job = 'rogue';
      }),
    ).toMatch(/\[0\]\.job/);
  });

  it('branch on a non-Rogue card', () => {
    expect(
      cardsError((c) => {
        c(0).branch = 'archer';
      }),
    ).toMatch(/\[0\]\.branch/);
  });

  it('bad config value', () => {
    const cfg = clone(battleConfigJson) as { shield: { persistence: string } };
    cfg.shield.persistence = 'forever';
    expect(() => parseBattleConfig(cfg)).toThrow(/battle-config\.json[\s\S]*shield\.persistence/);
  });
});

describe('ai planner', () => {
  it('loads within bounds', () => {
    const p = loadAiPlanner();
    expect(p.depth).toBeGreaterThanOrEqual(1);
    expect(p.depth).toBeLessThanOrEqual(6);
    expect(p.beam).toBeGreaterThanOrEqual(1);
  });

  it('rejects out of range values with a readable message', () => {
    expect(() => parseAiPlanner({ depth: 0, beam: 5 })).toThrow(/ai-planner\.json[\s\S]*depth/);
    expect(() => parseAiPlanner({ depth: 4, beam: 99 })).toThrow(/beam/);
  });
});
