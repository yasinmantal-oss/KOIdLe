import {
  ARCHETYPES,
  type ArchetypeId,
  deckStats,
  inPool,
  validateDeck,
} from '@koidle/content-schema';
import { isHeavy } from '@koidle/rules';
import { useMemo, useState } from 'react';
import type { LoadedContent } from '../content';
import { readSavedDeck, saveDeck } from '../deck';
import { CardText } from './CardText';

interface Props {
  content: LoadedContent;
  archetypeId: ArchetypeId;
  onBack: () => void;
  onConfirm: (deck: string[]) => void;
}

export function DeckBuilder({ content, archetypeId, onBack, onConfirm }: Props) {
  const { config, cards, presets } = content;
  const arch = ARCHETYPES[archetypeId];
  const pool = useMemo(
    () => cards.filter((c) => inPool(c, arch)).sort((a, b) => a.cost - b.cost),
    [cards, arch],
  );
  const [deck, setDeck] = useState<string[]>(() => {
    const saved = readSavedDeck(archetypeId);
    return saved && validateDeck(saved, archetypeId, cards, config).length === 0
      ? saved
      : presets[archetypeId];
  });

  const issues = validateDeck(deck, archetypeId, cards, config);
  const stats = deckStats(deck, cards, config);
  const { maxHeavy, minOpeners } = config.deckBuilding;
  const full = deck.length >= config.deck.size;
  const toggle = (id: string) =>
    setDeck((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const mark = (ok: boolean) => (ok ? '✓' : '✗');
  const cls = (ok: boolean) => `deck__stat deck__stat--${ok ? 'ok' : 'bad'}`;

  return (
    <main className="deck">
      <header className="deck__head">
        <h1>Deste kur · {arch.name}</h1>
        <button type="button" onClick={() => setDeck(presets[archetypeId])}>
          Önerilen deste
        </button>
      </header>
      <p className="deck__stats" aria-live="polite">
        <span className={cls(stats.size === config.deck.size)}>
          {stats.size}/{config.deck.size} {mark(stats.size === config.deck.size)}
        </span>
        <span className={cls(stats.heavy <= maxHeavy)}>
          Ağır {stats.heavy}/{maxHeavy} {mark(stats.heavy <= maxHeavy)}
        </span>
        <span className={cls(stats.openers >= minOpeners)}>
          {config.mp.start} MP'lik kart: {stats.openers} (en az {minOpeners}){' '}
          {mark(stats.openers >= minOpeners)}
        </span>
      </p>
      {issues.length > 0 && (
        <ul className="deck__issues">
          {issues.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
      <div className="deck__pool">
        {pool.map((c) => {
          const on = deck.includes(c.id);
          return (
            <button
              type="button"
              key={c.id}
              className="pick"
              aria-pressed={on}
              disabled={!on && full}
              onClick={() => toggle(c.id)}
            >
              <span className="pick__top">
                <span>
                  {c.name}
                  {isHeavy(c) ? ' ★' : ''}
                </span>
                <span>{c.cost} MP</span>
              </span>
              <span className="pick__text">
                <CardText text={c.text} />
              </span>
            </button>
          );
        })}
      </div>
      <div className="deck__actions">
        <button type="button" onClick={onBack}>
          Geri
        </button>
        <button
          type="button"
          disabled={issues.length > 0}
          onClick={() => {
            saveDeck(archetypeId, deck);
            onConfirm(deck);
          }}
        >
          Savaşa Başla
        </button>
      </div>
    </main>
  );
}
