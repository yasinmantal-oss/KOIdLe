// Yalnız testler için: content/ JSON'una bağımlı olmadan kuralları sınamak üzere küçük bir kart seti.
import { createBattle } from './battle';
import type { BattleConfig, BattleState, CardDef, PlayerIndex, StatusId } from './types';

export const testConfig: BattleConfig = {
  hero: { hp: 30 },
  mp: { start: 1, perTurn: 1, max: 8 },
  hand: {
    starting: 4,
    limit: 8,
    drawPerTurn: 1,
    firstPlayerSkipsFirstDraw: true,
    openingGuarantee: false,
  },
  deck: { size: 12, reshuffles: 1 },
  fatigue: { start: 1, step: 1, ignoresShield: true },
  shield: { persistence: 'resetOnOwnTurnStart' },
  arenaCollapse: { startRound: 8, start: 1, step: 1, ignoresShield: true },
  statuses: {
    stacking: 'maxAmountRefreshOnGte',
    tickOn: 'ownerTurnEnd',
    strength: { duration: 2 },
    weak: { duration: 2 },
    curse: { duration: 2 },
    poison: { duration: 2 },
    stealth: { duration: 2 },
  },
  deckBuilding: { maxHeavy: 2, minOpeners: 3 },
  roundCap: 20,
};

const card = (
  id: string,
  type: CardDef['type'],
  cost: number,
  effects: CardDef['effects'],
): CardDef => ({
  id,
  name: id,
  job: 'warrior',
  type,
  cost,
  effects,
  text: id,
});

export const testCards: CardDef[] = [
  card('hit', 'attack', 1, [{ kind: 'damage', amount: 3 }]),
  card('guard', 'defense', 1, [{ kind: 'shield', amount: 4 }]),
  card('taunt', 'debuff', 1, [{ kind: 'applyStatus', target: 'enemy', status: 'weak', amount: 2 }]),
  card('study', 'skill', 1, [
    { kind: 'draw', count: 1 },
    { kind: 'shield', amount: 2 },
  ]),
  card('bash', 'attack', 2, [{ kind: 'damageFromShieldGainedThisTurn' }]),
  card('rally', 'buff', 2, [
    { kind: 'applyStatus', target: 'self', status: 'strength', amount: 2 },
  ]),
  card('wall', 'defense', 2, [{ kind: 'shield', amount: 7 }]),
  card('mend', 'heal', 2, [{ kind: 'heal', amount: 6 }]),
  card('heavy', 'attack', 3, [{ kind: 'damage', amount: 7 }]),
  card('surge', 'skill', 3, [
    { kind: 'draw', count: 2 },
    { kind: 'damage', amount: 3 },
  ]),
  card('pierce', 'attack', 4, [{ kind: 'damage', amount: 6, ignoreShield: true }]),
  card('ruin', 'attack', 6, [{ kind: 'damage', amount: 14 }]),
];

export const testDeck = testCards.map((c) => c.id);

export function newBattle(seed = 1, config: BattleConfig = testConfig) {
  return createBattle({
    config,
    cards: testCards,
    decks: [testDeck, testDeck],
    names: ['A', 'B'],
    seed,
  });
}

/** Elle durum kurmak için: oyuncunun elini verilen kartlarla değiştirir, MP'yi ayarlar. */
export function setHand(state: BattleState, p: PlayerIndex, cardIds: string[], mp = 8): void {
  const pl = state.players[p];
  pl.hand = cardIds.map((cardId, i) => ({ iid: `t${p}-${i}`, cardId }));
  pl.mp = mp;
  pl.maxMp = Math.max(pl.maxMp, mp);
}

/** Testte geçici kart tanımı ekler. */
export function addCard(
  state: BattleState,
  id: string,
  cost: number,
  effects: CardDef['effects'],
): void {
  state.cards[id] = card(id, 'skill', cost, effects);
}

/** Oyuncuya doğrudan statü koyar. */
export function setStatus(
  state: BattleState,
  p: PlayerIndex,
  id: StatusId,
  amount: number,
  turnsLeft = 2,
): void {
  state.players[p].statuses = [
    ...state.players[p].statuses.filter((s) => s.id !== id),
    { id, amount, turnsLeft },
  ];
}
