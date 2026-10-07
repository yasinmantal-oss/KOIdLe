import { type BattleState, isHeavy, previewCard, validateAction } from '@koidle/rules';
import { useEffect, useRef, useState } from 'react';
import { glossaryLine, HUMAN } from '../format';
import { NO_SELECTION, type SelectionAction, selectionStep, validSelection } from '../selection';
import { cardArt } from '../ui/cardArt';
import { CardText } from './CardText';

export const TYPE_TR = {
  attack: 'Saldırı',
  skill: 'Beceri',
  defense: 'Savunma',
  heal: 'İyileşme',
  buff: 'Güçlendirme',
  debuff: 'Zayıflatma',
} as const;

interface Flying {
  key: number;
  type: keyof typeof TYPE_TR;
  name: string;
  art: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export const FLY_MS = 420;

export function Hand({ state, onPlay }: { state: BattleState; onPlay: (iid: string) => void }) {
  const hand = state.players[HUMAN].hand;
  const [selection, setSelection] = useState(NO_SELECTION);
  const [flying, setFlying] = useState<Flying | null>(null);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const wrapRef = useRef<HTMLDivElement>(null);
  const flyKey = useRef(0);

  const playableIids = hand
    .filter((c) => validateAction(state, { type: 'PLAY_CARD', player: HUMAN, iid: c.iid }) === null)
    .map((c) => c.iid);
  const selected = validSelection(selection, playableIids);

  const play = (iid: string) => {
    const el = refs.current.get(iid);
    const inst = hand.find((c) => c.iid === iid);
    const def = inst ? state.cards[inst.cardId] : undefined;
    if (el && def) {
      const r = el.getBoundingClientRect();
      flyKey.current += 1;
      setFlying({
        key: flyKey.current,
        type: def.type,
        name: def.name,
        art: cardArt(def.id),
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      });
    }
    onPlay(iid);
  };

  const send = (a: SelectionAction) => {
    const r = selectionStep({ selected }, a);
    setSelection(r.state);
    if (r.play) play(r.play);
  };

  useEffect(() => {
    if (!flying) return;
    const t = setTimeout(() => setFlying(null), FLY_MS);
    return () => clearTimeout(t);
  }, [flying]);

  useEffect(() => {
    if (!selected) return;
    const onDown = (e: Event) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t)) return;
      setSelection(NO_SELECTION);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelection(NO_SELECTION);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  const selInst = hand.find((c) => c.iid === selected);
  const selDef = selInst ? state.cards[selInst.cardId] : undefined;
  const selPreview = selInst ? previewCard(state, HUMAN, selInst.cardId) : null;

  return (
    <div className="handwrap" ref={wrapRef}>
      <div className="hand">
        {hand.map((c) => {
          const def = state.cards[c.cardId];
          if (!def) return null;
          const playable = playableIids.includes(c.iid);
          const isSel = selected === c.iid;
          const preview = previewCard(state, HUMAN, c.cardId);
          const glossary = glossaryLine(def.text, state.config);
          return (
            <button
              type="button"
              key={c.iid}
              ref={(el) => {
                if (el) refs.current.set(c.iid, el);
                else refs.current.delete(c.iid);
              }}
              className={`card card--${def.type}${preview.bonusActive ? ' card--combo' : ''}${playable ? ' card--ready' : ''}${isSel ? ' card--selected' : ''}`}
              disabled={!playable}
              aria-pressed={isSel}
              onClick={() => send({ type: 'tap', iid: c.iid, playable })}
            >
              <span className="card__cost">{def.cost}</span>
              {isHeavy(def) && (
                <span className="card__heavy" title="Ağır kart: destede sayısı sınırlı">
                  ★
                </span>
              )}
              <span className="card__art" aria-hidden="true">
                {cardArt(def.id)}
              </span>
              <span className="card__name">{def.name}</span>
              <span className="card__type">{TYPE_TR[def.type]}</span>
              <span className="card__text">
                <CardText text={def.text} />
              </span>
              {preview.damage !== null && (
                <span className="card__dmg">
                  Şu an: <strong>{preview.damage}</strong> hasar
                  {preview.bonusActive && <span className="card__check"> ✓ bonus</span>}
                </span>
              )}
              {glossary && <span className="card__gloss">{glossary}</span>}
            </button>
          );
        })}
      </div>
      {selDef && selPreview && (
        <div className="confirmbar">
          <span className="confirmbar__info">
            <strong>{selDef.name}</strong>
            {selPreview.damage !== null && (
              <>
                {' '}
                · Şu an: <strong>{selPreview.damage}</strong> hasar
              </>
            )}
          </span>
          <button
            type="button"
            className="confirmbar__play"
            onClick={() => send({ type: 'confirm' })}
          >
            Oyna
          </button>
          <button
            type="button"
            className="confirmbar__cancel"
            onClick={() => send({ type: 'cancel' })}
          >
            Vazgeç
          </button>
        </div>
      )}
      {flying && (
        <div
          key={flying.key}
          className={`flyout card--${flying.type}`}
          aria-hidden="true"
          style={{
            left: flying.left,
            top: flying.top,
            width: flying.width,
            height: flying.height,
          }}
        >
          <span className="flyout__art">{flying.art}</span>
          <span className="flyout__name">{flying.name}</span>
        </div>
      )}
    </div>
  );
}
