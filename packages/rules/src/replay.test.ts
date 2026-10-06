import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { apply, createBattle, legalActions } from './index';
import { testCards, testConfig, testDeck } from './test-fixtures';
import type { Action, BattleEvent, BattleSetup, BattleState } from './types';

// Golden replay: setup + aksiyon listesi metin dosyasında durur; motor aynı olayları ve aynı son
// durumu üretmek zorunda. Kural bilerek değişince: UPDATE_REPLAYS=1 pnpm test
interface ReplayFile {
  name: string;
  description: string;
  setup: BattleSetup;
  actions: Action[];
  expected: { events: BattleEvent[]; finalState: BattleState };
}

type Policy = (state: BattleState) => Action;

const firstPlayable: Policy = (s) => legalActions(s)[0] as Action;
const alwaysEndTurn: Policy = (s) => ({ type: 'END_TURN', player: s.active });

const CASES: { name: string; description: string; seed: number; policy: Policy }[] = [
  {
    name: 'fixture-seed42',
    description: 'Normal maç: iki taraf da oynayabildiği ilk kartı oynar.',
    seed: 42,
    policy: firstPlayable,
  },
  {
    name: 'fatigue-and-arena',
    description:
      'Kimse kart oynamaz: el dolar, kartlar yanar, tek karıştırma, Yorgunluk ve Arena Çöküşü.',
    seed: 7,
    policy: alwaysEndTurn,
  },
];

const dir = join(import.meta.dirname, '..', 'test', 'replays');

function run(setup: BattleSetup, actions: Action[]) {
  let { state, events } = createBattle(setup);
  const all = [...events];
  for (const a of actions) {
    ({ state, events } = apply(state, a));
    all.push(...events);
  }
  return { events: all, finalState: state };
}

function record(c: (typeof CASES)[number]): ReplayFile {
  const setup: BattleSetup = {
    config: testConfig,
    cards: testCards,
    decks: [testDeck, testDeck],
    names: ['A', 'B'],
    seed: c.seed,
  };
  let { state } = createBattle(setup);
  const actions: Action[] = [];
  while (!state.result) {
    const a = c.policy(state);
    actions.push(a);
    state = apply(state, a).state;
  }
  return {
    name: c.name,
    description: c.description,
    setup,
    actions,
    expected: run(setup, actions),
  };
}

describe('golden replays', () => {
  it.each(CASES)('$name', (c) => {
    const file = join(dir, `${c.name}.json`);
    if (process.env.UPDATE_REPLAYS) {
      writeFileSync(file, `${JSON.stringify(record(c), null, 2)}\n`);
    }
    expect(existsSync(file), `${file} yok: UPDATE_REPLAYS=1 pnpm test`).toBe(true);
    const replay = JSON.parse(readFileSync(file, 'utf8')) as ReplayFile;
    const actual = run(replay.setup, replay.actions);
    expect(actual.events).toEqual(replay.expected.events);
    expect(actual.finalState).toEqual(replay.expected.finalState);
  });

  it('fatigue-and-arena really shows reshuffle, fatigue and arena', () => {
    const replay = JSON.parse(
      readFileSync(join(dir, 'fatigue-and-arena.json'), 'utf8'),
    ) as ReplayFile;
    const types = replay.expected.events.map((e) =>
      e.type === 'DAMAGE_DEALT' ? `DAMAGE_${String(e.source)}` : e.type,
    );
    expect(types).toContain('DECK_RESHUFFLED');
    expect(types).toContain('DAMAGE_fatigue');
    expect(types).toContain('DAMAGE_arena');
    expect(types).toContain('CARD_BURNED');
  });

  it('same input twice gives identical output', () => {
    const r = record(CASES[0] as (typeof CASES)[number]);
    const again = run(r.setup, r.actions);
    expect(JSON.stringify(again)).toBe(JSON.stringify(r.expected));
  });
});
