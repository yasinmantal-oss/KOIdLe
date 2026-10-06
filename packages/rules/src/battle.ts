import { clone } from './clone';
import { drawCard } from './draw';
import { rollInt, shuffle } from './rng';
import { startTurn } from './turn';
import type {
  ApplyResult,
  BattleEvent,
  BattleSetup,
  BattleState,
  CardDef,
  PlayerIndex,
  PlayerState,
} from './types';

export function createBattle(setup: BattleSetup): ApplyResult {
  const { config, decks, names, seed } = setup;
  const cards: Record<string, CardDef> = {};
  for (const c of setup.cards) cards[c.id] = clone(c);

  decks.forEach((deck, i) => {
    if (deck.length !== config.deck.size) {
      throw new Error(
        `deck ${i} has ${deck.length} cards, config deck.size is ${config.deck.size}`,
      );
    }
    for (const id of deck) if (!cards[id]) throw new Error(`Unknown card: ${id}`);
  });

  const newPlayer = (i: PlayerIndex): PlayerState => ({
    name: names[i],
    hp: config.hero.hp,
    maxHp: config.hero.hp,
    mp: 0,
    maxMp: 0,
    shield: 0,
    shieldGainedThisTurn: 0,
    cardsPlayedThisTurn: 0,
    statuses: [],
    deck: decks[i].map((cardId, j) => ({ iid: `p${i}-${j}`, cardId })),
    hand: [],
    discard: [],
    turnsTaken: 0,
    reshufflesLeft: config.deck.reshuffles,
    fatigueCount: 0,
  });

  const state: BattleState = {
    config: clone(config),
    cards,
    rng: seed >>> 0,
    round: 1,
    active: 0,
    firstPlayer: 0,
    players: [newPlayer(0), newPlayer(1)],
    result: null,
  };
  const events: BattleEvent[] = [];

  state.firstPlayer = rollInt(state, 2) === 0 ? 0 : 1;
  state.active = state.firstPlayer;
  for (const pl of state.players) pl.deck = shuffle(state, pl.deck);
  events.push({ type: 'BATTLE_STARTED', firstPlayer: state.firstPlayer, seed: seed >>> 0 });

  for (const p of [0, 1] as const) {
    for (let i = 0; i < config.hand.starting; i++) drawCard(state, p, events);
  }
  startTurn(state, state.firstPlayer, events);
  return { state, events };
}
