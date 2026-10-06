import { defaultDeck, loadAiProfiles, loadBattleConfig, loadCards } from '@koidle/content-schema';
import {
  type Action,
  apply,
  type BattleState,
  createBattle,
  legalActions,
  type PlayerIndex,
  validateAction,
} from '@koidle/rules';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { chooseAction, HIDDEN_CARD_ID, redactForAi, type Scorer } from './index';

const profiles = loadAiProfiles();
const config = loadBattleConfig();
const cards = loadCards('warrior');
const deck = defaultDeck('warrior');

function battle(seed: number): BattleState {
  return createBattle({ config, cards, decks: [deck, deck], names: ['A', 'B'], seed }).state;
}

function withHand(seed: number, hand: string[], mp: number) {
  const state = battle(seed);
  const me = state.active;
  state.players[me].hand = hand.map((cardId, i) => ({ iid: `x-${i}`, cardId }));
  state.players[me].mp = mp;
  state.players[me].maxMp = mp;
  return { state, me };
}

const cardOf = (s: BattleState, me: PlayerIndex, a: Action) =>
  a.type === 'PLAY_CARD' ? s.players[me].hand.find((c) => c.iid === a.iid)?.cardId : 'END_TURN';

/** Rastgele yasal oyunla savaşın ortasından bir an üretir. */
function midBattle(seed: number, steps: number[]): BattleState {
  let s = battle(seed);
  for (const n of steps) {
    if (s.result) break;
    const legal = legalActions(s);
    const a = legal[n % legal.length];
    if (!a) break;
    const next = apply(s, a).state;
    if (next.result) break;
    s = next;
  }
  return s;
}

describe('chooseAction', () => {
  it('takes a winning move', () => {
    const { state, me } = withHand(1, ['siper', 'yarma'], 3);
    state.players[me === 0 ? 1 : 0].hp = 3;
    for (const p of ['aggressive', 'balanced', 'defensive'] as const) {
      expect(cardOf(state, me, chooseAction(state, me, profiles[p]))).toBe('yarma');
    }
  });

  it('ends the turn when nothing is affordable or useful', () => {
    const poor = withHand(1, ['yikim'], 2);
    expect(chooseAction(poor.state, poor.me, profiles.balanced)).toEqual({
      type: 'END_TURN',
      player: poor.me,
    });
    const useless = withHand(1, ['ikinci-nefes'], 2); // HP dolu → iyileşme 0
    expect(chooseAction(useless.state, useless.me, profiles.aggressive).type).toBe('END_TURN');
  });

  it('profiles differ: aggressive attacks, defensive blocks', () => {
    const { state, me } = withHand(1, ['yarma', 'siper'], 2);
    expect(cardOf(state, me, chooseAction(state, me, profiles.aggressive))).toBe('yarma');
    expect(cardOf(state, me, chooseAction(state, me, profiles.defensive))).toBe('siper');
  });

  it('always returns a legal action', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.array(fc.nat(), { maxLength: 40 }),
        fc.constantFrom('aggressive', 'balanced', 'defensive' as const),
        (seed, steps, profile) => {
          const s = midBattle(seed, steps);
          if (s.result) return;
          const a = chooseAction(s, s.active, profiles[profile]);
          expect(validateAction(s, a)).toBeNull();
        },
      ),
      { numRuns: 150 },
    );
  });
});

describe('hidden information (C6)', () => {
  // "Hileci" skor: elindeki kartlar ucuzsa iyi. Çekilecek kartın kimliğini görebilseydi Hazırlık'ı
  // oynayıp oynamamaya buna göre karar verirdi; gizli bilgi silindiği için veremez.
  const cheater: Scorer = (s, me) =>
    -s.players[me].hand.reduce((sum, c) => sum + (s.cards[c.cardId]?.cost ?? 0), 0) * 1000 -
    s.players[me].mp;

  it('a scorer that would peek at the deck cannot (structural guard)', () => {
    const decide = (topCard: string) => {
      const { state, me } = withHand(1, ['hazirlik'], 2);
      state.players[me].deck = state.players[me].deck.map((c, i) =>
        i === 0 ? { ...c, cardId: topCard } : c,
      );
      return chooseAction(state, me, profiles.balanced, cheater);
    };
    expect(decide('yikim')).toEqual(decide('yarma'));
  });

  it('redaction hides opponent hand and both decks, keeps counts', () => {
    const s = midBattle(3, [0, 1, 2, 0, 0]);
    const me = s.active;
    const view = redactForAi(s, me);
    const foe = me === 0 ? 1 : 0;
    expect(view.players[me].hand).toEqual(s.players[me].hand);
    expect(view.players[foe].hand.every((c) => c.cardId === HIDDEN_CARD_ID)).toBe(true);
    for (const p of [0, 1] as const) {
      expect(view.players[p].deck).toHaveLength(s.players[p].deck.length);
      expect(view.players[p].deck.every((c) => c.cardId === HIDDEN_CARD_ID)).toBe(true);
      expect(view.players[p].discard).toEqual(s.players[p].discard);
    }
  });

  it('decision does not change when hidden cards change', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.array(fc.nat(), { maxLength: 30 }),
        fc.nat(),
        fc.constantFrom('aggressive', 'balanced', 'defensive' as const),
        (seed, steps, shuffleSeed, profile) => {
          const s = midBattle(seed, steps);
          if (s.result) return;
          const me = s.active;
          const foe = me === 0 ? 1 : 0;
          const original = chooseAction(s, me, profiles[profile]);

          // Gizli kartları rastgele başka kartlarla değiştir, sırayı karıştır.
          const altered = JSON.parse(JSON.stringify(s)) as BattleState;
          const ids = cards.map((c) => c.id);
          let k = shuffleSeed;
          const pick = () => {
            k = (k * 1103515245 + 12345) >>> 0;
            return ids[k % ids.length] as string;
          };
          altered.players[foe].hand = altered.players[foe].hand.map((c) => ({
            ...c,
            cardId: pick(),
          }));
          for (const p of [0, 1] as const) {
            altered.players[p].deck = altered.players[p].deck
              .map((c) => ({ ...c, cardId: pick() }))
              .reverse();
          }
          expect(chooseAction(altered, me, profiles[profile])).toEqual(original);
          expect(chooseAction(altered, me, profiles[profile], cheater)).toEqual(
            chooseAction(s, me, profiles[profile], cheater),
          );
        },
      ),
      { numRuns: 150 },
    );
  });
});
