import { dealDamage } from './outcome';
import { shuffle } from './rng';
import type { BattleEvent, BattleState, PlayerIndex } from './types';

/**
 * Bir kart çeker (K2, N4). Deste boşsa: hak varsa ve ıskarta doluysa ıskarta karıştırılır;
 * yoksa Yorgunluk hasarı. El doluysa çekilen kart yanar.
 */
export function drawCard(state: BattleState, p: PlayerIndex, events: BattleEvent[]): void {
  const pl = state.players[p];
  const { fatigue, hand } = state.config;
  if (pl.deck.length === 0) {
    if (pl.reshufflesLeft > 0 && pl.discard.length > 0) {
      pl.deck = shuffle(state, pl.discard);
      pl.discard = [];
      pl.reshufflesLeft -= 1;
      events.push({
        type: 'DECK_RESHUFFLED',
        player: p,
        count: pl.deck.length,
        reshufflesLeft: pl.reshufflesLeft,
      });
    } else {
      pl.fatigueCount += 1;
      const amount = fatigue.start + (pl.fatigueCount - 1) * fatigue.step;
      dealDamage(state, 'fatigue', p, amount, fatigue.ignoresShield, events);
      return;
    }
  }
  const drawn = pl.deck.shift();
  if (!drawn) return;
  if (pl.hand.length >= hand.limit) {
    pl.discard.push(drawn);
    events.push({ type: 'CARD_BURNED', player: p, iid: drawn.iid, cardId: drawn.cardId });
  } else {
    pl.hand.push(drawn);
    events.push({ type: 'CARD_DRAWN', player: p, iid: drawn.iid, cardId: drawn.cardId });
  }
}
