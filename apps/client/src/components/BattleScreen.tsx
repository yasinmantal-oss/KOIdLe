import { ARCHETYPES } from '@koidle/content-schema';
import { type PlayerIndex, validateAction } from '@koidle/rules';
import { type CSSProperties, useEffect, useState, useSyncExternalStore } from 'react';
import type { LoadedContent } from '../content';
import { HUMAN } from '../format';
import { FX } from '../fx';
import type { MatchSetup } from '../match';
import { isMuted, playSfxFor, setMuted, subscribeMuted } from '../sfx';
import { useBattle } from '../useBattle';
import type { GearSlot } from '../world/protoData';
import type { Item } from '../world/world';
import { ArenaInfo, SeedLine } from './ArenaInfo';
import { BattleLog } from './BattleLog';
import { DeckPanel } from './DeckPanel';
import { Hand } from './Hand';
import { HeroPanel, type PopView } from './HeroPanel';
import { ResultPanel } from './ResultPanel';
import { RulesSummary } from './RulesSummary';
import { useFx } from './useFx';

const PROFILE_TR = {
  aggressive: 'Saldırgan',
  balanced: 'Dengeli',
  defensive: 'Savunmacı',
} as const;

export interface RaidContext {
  foeName: string;
  foeLevel: number;
  myName: string;
  myLevel: number;
  /** Savaş bitince sonuç: kazandın (berabere = baskın püskürtüldü) ya da kaybettin. */
  onFinish: (won: boolean) => void;
}

interface Props {
  content: LoadedContent;
  setup: MatchSetup;
  deck: string[];
  onNew: () => void;
  /** Kahramanın 3 item gözü (dünya ekipmanı; yalnız gösterim). */
  gear?: Record<GearSlot, Item | null> | null;
  /** Varsa bu bir Sınır baskını: form yok, sonuç dünyaya döner. */
  raid?: RaidContext | null;
  onExit?: (() => void) | null;
}

export function BattleScreen({ content, setup, deck, onNew, gear, raid, onExit }: Props) {
  const { seed, profile, mine, ai } = setup;
  const { state, log, startedAt, endedAt, lastEvents, seq, dispatch, restart } = useBattle(
    content,
    setup,
    deck,
  );
  const fx = useFx(lastEvents, seq);
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);
  const [deckOpen, setDeckOpen] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: ses yalnız yeni aksiyonda (seq) çalar
  useEffect(() => {
    if (seq > 0) playSfxFor(lastEvents, HUMAN);
  }, [seq]);
  const myTurn = !state.result && state.active === HUMAN;
  const foe: PlayerIndex = HUMAN === 0 ? 1 : 0;

  const hasPlayable =
    myTurn &&
    state.players[HUMAN].hand.some(
      (c) => validateAction(state, { type: 'PLAY_CARD', player: HUMAN, iid: c.iid }) === null,
    );
  // Tur değişince ya da oynanabilir kart kalmayınca bekleyen onay düşer.
  useEffect(() => {
    if (!hasPlayable) setConfirmEnd(false);
  }, [hasPlayable]);
  const endTurn = () => {
    setConfirmEnd(false);
    dispatch({ type: 'END_TURN', player: HUMAN });
  };

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
    '--edgeflash-ms': `${FX.edgeFlashMs}ms`,
    '--shake-px': `${fx?.result.shakePx ?? 0}px`,
  } as CSSProperties;
  const shake = fx && fx.result.shakePx > 0 ? ` fx-shake-${parity}` : '';
  const hitstop = fx?.result.hitstop ? ' fx-hitstop' : '';
  const callout = fx?.result.callouts.join(' ') ?? '';

  return (
    <main className={`battle${shake}${hitstop}`} style={cssVars}>
      <div className="battle__scene" aria-hidden="true" />
      <header className="battle__top">
        {onExit && !raid ? (
          <button type="button" className="chip chip--btn" onClick={onExit}>
            ‹ Kasaba
          </button>
        ) : (
          <span className="chip chip--raid">{raid ? '⚔️ Sınır Baskını' : '🃏 Düello'}</span>
        )}
        <span className="battle__tools">
          <button type="button" className="chip chip--btn" onClick={() => setDeckOpen(true)}>
            Destem
          </button>
          <button
            type="button"
            className="chip chip--btn"
            aria-pressed={!muted}
            aria-label={muted ? 'Sesi aç' : 'Sesi kapat'}
            title={muted ? 'Sesi aç' : 'Sesi kapat'}
            onClick={() => setMuted(!muted)}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </span>
        <ArenaInfo state={state} />
      </header>
      <HeroPanel
        player={state.players[foe]}
        config={state.config}
        title={raid ? raid.foeName : `Rakip`}
        sub={
          raid
            ? `${ARCHETYPES[ai].name} · Lv ${raid.foeLevel}`
            : `${ARCHETYPES[ai].name} · AI ${PROFILE_TR[profile]}`
        }
        archetype={ai}
        side="opp"
        active={!state.result && state.active === foe}
        showHandCount
        hit={hitFor(foe)}
        pops={popsFor(foe)}
      />
      <div className="battle__mid">
        <span className="battle__line" aria-hidden="true" />
        <span className={`turnflag${myTurn ? ' turnflag--me' : ''}`}>
          {state.result ? 'Bitti' : myTurn ? 'Senin sıran' : 'Rakip düşünüyor…'}
        </span>
        <span className={`played-count${myTurn ? '' : ' played-count--off'}`}>
          Bu tur oynanan kart: <strong>{state.players[HUMAN].cardsPlayedThisTurn}</strong>
        </span>
        <button
          type="button"
          className="end-turn"
          disabled={!myTurn}
          onClick={() => (hasPlayable && !confirmEnd ? setConfirmEnd(true) : endTurn())}
        >
          TURU
          <br />
          BİTİR
        </button>
      </div>
      <HeroPanel
        player={state.players[HUMAN]}
        config={state.config}
        title={raid ? raid.myName : 'Sen'}
        sub={raid ? `${ARCHETYPES[mine].name} · Lv ${raid.myLevel}` : ARCHETYPES[mine].name}
        archetype={mine}
        side="me"
        active={myTurn}
        showHandCount={false}
        hit={hitFor(HUMAN)}
        pops={popsFor(HUMAN)}
        gear={gear ?? null}
      />
      {confirmEnd && (
        <div className="endconfirm" role="alert">
          <span>Oynanabilir kartın var, yine de bitir?</span>
          <button type="button" className="confirmbar__play" onClick={endTurn}>
            Bitir
          </button>
          <button type="button" className="confirmbar__cancel" onClick={() => setConfirmEnd(false)}>
            Geri
          </button>
        </div>
      )}
      <Hand state={state} onPlay={(iid) => dispatch({ type: 'PLAY_CARD', player: HUMAN, iid })} />
      <details className="battle__more">
        <summary>Savaş kaydı ve kurallar</summary>
        <BattleLog log={log} cards={state.cards} />
        <RulesSummary config={state.config} />
        <SeedLine seed={seed} />
      </details>
      {fx?.result.edgeFlash && <div key={`ef${fx.seq}`} className="edgeflash" aria-hidden="true" />}
      {deckOpen && <DeckPanel state={state} onClose={() => setDeckOpen(false)} />}
      {callout && (
        <div key={fx?.seq} className="callout" aria-hidden="true">
          {callout}
        </div>
      )}
      {/* Kombo metni ekran okuyucuya da gider (F2-12); kayıttaki satır zaten var. */}
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
          raid={raid ?? null}
          onExit={onExit ?? null}
        />
      )}
    </main>
  );
}
