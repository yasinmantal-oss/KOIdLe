import type { BattleState, CardInstance } from '@koidle/rules';
import { useEffect } from 'react';
import { HUMAN } from '../format';
import { TYPE_TR } from './Hand';

interface Group {
  title: string;
  hint: string;
  cards: CardInstance[];
}

/** Kart listesini maliyete, sonra ada göre sıralar (deste sırası gizli kalsın diye). */
export function sortByCost(cards: CardInstance[], defs: BattleState['cards']): CardInstance[] {
  return [...cards].sort((a, b) => {
    const da = defs[a.cardId];
    const db = defs[b.cardId];
    return (
      (da?.cost ?? 0) - (db?.cost ?? 0) || (da?.name ?? '').localeCompare(db?.name ?? '', 'tr')
    );
  });
}

export function DeckPanel({ state, onClose }: { state: BattleState; onClose: () => void }) {
  const me = state.players[HUMAN];
  const foe = state.players[HUMAN === 0 ? 1 : 0];
  const groups: Group[] = [
    { title: 'Elde', hint: 'oynayabileceklerin', cards: me.hand },
    { title: 'Destede', hint: 'kalan, sıra gizli', cards: sortByCost(me.deck, state.cards) },
    { title: 'Iskartada', hint: 'oynanan ve yanan', cards: sortByCost(me.discard, state.cards) },
  ];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="deckpanel" role="dialog" aria-modal="true" aria-label="Destem">
      <button type="button" className="deckpanel__scrim" aria-label="Kapat" onClick={onClose} />
      <div className="deckpanel__sheet">
        <header className="deckpanel__head">
          <h2>Destem</h2>
          <button type="button" className="chip chip--btn" onClick={onClose}>
            Kapat
          </button>
        </header>
        <p className="deckpanel__foe">
          Rakip: El <b>{foe.hand.length}</b> · Deste <b>{foe.deck.length}</b> · Iskarta{' '}
          <b>{foe.discard.length}</b>
        </p>
        {groups.map((g) => (
          <section key={g.title} className="deckpanel__group">
            <h3>
              {g.title} <b>{g.cards.length}</b> <small>{g.hint}</small>
            </h3>
            {g.cards.length === 0 ? (
              <p className="deckpanel__empty">Boş</p>
            ) : (
              <ul>
                {g.cards.map((c) => {
                  const def = state.cards[c.cardId];
                  return (
                    <li key={c.iid} className={`deckrow deckrow--${def?.type ?? 'skill'}`}>
                      <span className="deckrow__cost">{def?.cost ?? '?'}</span>
                      <span className="deckrow__name">{def?.name ?? c.cardId}</span>
                      <span className="deckrow__type">{def ? TYPE_TR[def.type] : ''}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
