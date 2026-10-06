import { isHeavy, isOpener } from './cards';
import { dealDamage } from './outcome';
import { shuffle } from './rng';
import type { BattleEvent, BattleState, CardInstance, PlayerIndex } from './types';

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

/**
 * Açılış eli (F2-7): bayrak açıksa karışık destenin ilk `starting` Ağır olmayan kartı ele gider;
 * elde 1 MP'lik kart yoksa son seçilen, kalanlardan ilk Ağır olmayan açılış kartıyla değişir.
 * Kalan kartlar yeniden karıştırılır. Bayrak kapalıysa eski davranış (sırayla çek).
 */
export function drawOpeningHand(state: BattleState, p: PlayerIndex, events: BattleEvent[]): void {
  const pl = state.players[p];
  const { starting, openingGuarantee } = state.config.hand;
  if (openingGuarantee) {
    const defOf = (c: CardInstance) => state.cards[c.cardId];
    const picked: CardInstance[] = [];
    const rest: CardInstance[] = [];
    for (const c of pl.deck) {
      const def = defOf(c);
      if (picked.length < starting && def && !isHeavy(def)) picked.push(c);
      else rest.push(c);
    }
    const hasOpener = picked.some((c) => {
      const def = defOf(c);
      return def !== undefined && isOpener(def, state.config);
    });
    if (!hasOpener && picked.length > 0) {
      const at = rest.findIndex((c) => {
        const def = defOf(c);
        return def !== undefined && !isHeavy(def) && isOpener(def, state.config);
      });
      if (at >= 0) {
        const swapped = picked.pop();
        const [opener] = rest.splice(at, 1);
        if (swapped && opener) {
          picked.push(opener);
          rest.push(swapped);
        }
      }
    }
    pl.deck = [...picked, ...shuffle(state, rest)];
  }
  for (let i = 0; i < starting; i++) drawCard(state, p, events);
}
