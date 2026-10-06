import { type BattleState, previewCard, validateAction } from '@koidle/rules';
import { HUMAN } from '../format';
import { CardText } from './CardText';

const TYPE_TR = {
  attack: 'Saldırı',
  skill: 'Beceri',
  defense: 'Savunma',
  heal: 'İyileşme',
  buff: 'Güçlendirme',
  debuff: 'Zayıflatma',
} as const;

export function Hand({ state, onPlay }: { state: BattleState; onPlay: (iid: string) => void }) {
  const hand = state.players[HUMAN].hand;
  return (
    <div className="hand">
      {hand.map((c) => {
        const def = state.cards[c.cardId];
        if (!def) return null;
        const playable =
          validateAction(state, { type: 'PLAY_CARD', player: HUMAN, iid: c.iid }) === null;
        const preview = previewCard(state, HUMAN, c.cardId);
        return (
          <button
            type="button"
            key={c.iid}
            className={`card card--${def.type}${preview.bonusActive ? ' card--combo' : ''}`}
            disabled={!playable}
            onClick={() => onPlay(c.iid)}
          >
            <span className="card__cost">{def.cost}</span>
            <span className="card__name">{def.name}</span>
            <span className="card__type">{TYPE_TR[def.type]}</span>
            <span className="card__text">
              <CardText text={def.text} />
            </span>
            {preview.damage !== null && (
              <span className="card__dmg">
                Şu an: <strong>{preview.damage}</strong> hasar
                {preview.bonusActive && <span className="card__check"> ✓ bonus aktif</span>}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
