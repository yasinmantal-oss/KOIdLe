import { ARCHETYPES } from '@koidle/content-schema';
import type { PlayerIndex } from '@koidle/rules';
import type { CSSProperties } from 'react';
import type { LoadedContent } from '../content';
import { HUMAN } from '../format';
import { FX } from '../fx';
import type { MatchSetup } from '../match';
import { useBattle } from '../useBattle';
import { ArenaInfo } from './ArenaInfo';
import { BattleLog } from './BattleLog';
import { Hand } from './Hand';
import { HeroPanel, type PopView } from './HeroPanel';
import { ResultPanel } from './ResultPanel';
import { RulesSummary } from './RulesSummary';
import { useFx } from './useFx';

interface Props {
  content: LoadedContent;
  setup: MatchSetup;
  deck: string[];
  onNew: () => void;
}

export function BattleScreen({ content, setup, deck, onNew }: Props) {
  const { seed, profile, mine, ai } = setup;
  const { state, log, startedAt, endedAt, lastEvents, seq, dispatch, restart } = useBattle(
    content,
    setup,
    deck,
  );
  const fx = useFx(lastEvents, seq);
  const myTurn = !state.result && state.active === HUMAN;
  const foe: PlayerIndex = HUMAN === 0 ? 1 : 0;

  const parity = fx && fx.seq % 2 === 1 ? 1 : 0;
  const hitFor = (p: PlayerIndex): 0 | 1 | null =>
    fx?.result.hitTargets.includes(p) ? parity : null;
  const popsFor = (p: PlayerIndex): PopView[] =>
    fx
      ? fx.result.pops
          .filter((x) => x.target === p)
          .map((x, i) => ({ key: `${fx.seq}-${p}-${i}`, amount: x.amount }))
      : [];

  // Süreler fx.ts'ten CSS değişkeni olarak gider; animasyonlar styles.css'te.
  const cssVars = {
    '--hitstop-ms': `${FX.hitstopMs}ms`,
    '--shake-ms': `${FX.shakeMs}ms`,
    '--pop-ms': `${FX.popMs}ms`,
    '--callout-ms': `${FX.calloutMs}ms`,
    '--flash-ms': `${FX.flashMs}ms`,
    '--shake-px': `${fx?.result.shakePx ?? 0}px`,
  } as CSSProperties;
  const shake = fx && fx.result.shakePx > 0 ? ` fx-shake-${parity}` : '';
  const hitstop = fx?.result.hitstop ? ' fx-hitstop' : '';
  const callout = fx?.result.callouts.join(' ') ?? '';

  return (
    <main className={`battle${shake}${hitstop}`} style={cssVars}>
      <HeroPanel
        player={state.players[foe]}
        config={state.config}
        title={`Rakip · ${ARCHETYPES[ai].name} · AI ${profile}`}
        active={!state.result && state.active === foe}
        showHandCount
        hit={hitFor(foe)}
        pops={popsFor(foe)}
      />
      <ArenaInfo state={state} seed={seed} />
      <RulesSummary config={state.config} />
      <BattleLog log={log} cards={state.cards} />
      <HeroPanel
        player={state.players[HUMAN]}
        config={state.config}
        title={`Sen · ${ARCHETYPES[mine].name}`}
        active={myTurn}
        showHandCount={false}
        hit={hitFor(HUMAN)}
        pops={popsFor(HUMAN)}
      />
      <Hand state={state} onPlay={(iid) => dispatch({ type: 'PLAY_CARD', player: HUMAN, iid })} />
      <div className="controls">
        {myTurn && (
          <span className="chain-count">
            Bu tur oynanan kart: <strong>{state.players[HUMAN].cardsPlayedThisTurn}</strong>
          </span>
        )}
        <button
          type="button"
          className="end-turn"
          disabled={!myTurn}
          onClick={() => dispatch({ type: 'END_TURN', player: HUMAN })}
        >
          Turu Bitir
        </button>
      </div>
      {callout && (
        <div key={fx?.seq} className="callout" aria-hidden="true">
          {callout}
        </div>
      )}
      {/* Kombo metni ekran okuyucuya da gider (F2-12); kayıttaki "Zincir ×N!" satırı zaten var. */}
      <div className="sr-only" aria-live="polite">
        {callout}
      </div>
      {state.result && (
        <ResultPanel
          state={state}
          log={log}
          seed={seed}
          profile={profile}
          mine={mine}
          ai={ai}
          deck={deck}
          durationSec={Math.round(((endedAt ?? startedAt) - startedAt) / 1000)}
          onRestart={restart}
          onNew={onNew}
        />
      )}
    </main>
  );
}
