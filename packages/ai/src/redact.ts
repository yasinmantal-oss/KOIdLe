import type { BattleState, CardDef, CardInstance, PlayerIndex } from '@koidle/rules';

export const HIDDEN_CARD_ID = '__hidden__';

const HIDDEN_CARD: CardDef = {
  id: HIDDEN_CARD_ID,
  name: '?',
  job: 'warrior',
  type: 'skill',
  cost: 99,
  effects: [],
  text: '',
};

/**
 * AI'ın gördüğü durum: rakibin eli ve iki destenin içeriği/sırası gizli kartlarla değiştirilir.
 * iid'ler de yeniden adlandırılır (iid deste listesindeki sırayı, dolayısıyla kartı ele verirdi).
 * Sayılar korunur. Açık bilgi: kendi elin, iki tarafın ıskartası, HP/MP/Kalkan/statüler.
 */
export function redactForAi(state: BattleState, me: PlayerIndex): BattleState {
  const view = JSON.parse(JSON.stringify(state)) as BattleState;
  view.cards[HIDDEN_CARD_ID] = HIDDEN_CARD;
  const hide = (cards: CardInstance[], tag: string): CardInstance[] =>
    cards.map((_, i) => ({ iid: `${tag}-${i}`, cardId: HIDDEN_CARD_ID }));
  view.players.forEach((p, i) => {
    p.deck = hide(p.deck, `hd${i}`);
    if (i !== me) p.hand = hide(p.hand, `hh${i}`);
  });
  return view;
}
