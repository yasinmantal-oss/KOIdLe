import { ARCHETYPES } from '@koidle/content-schema';
import type { LoadedContent } from '../content';
import { HUMAN } from '../format';
import type { MatchSetup } from '../match';
import { useBattle } from '../useBattle';
import { ArenaInfo } from './ArenaInfo';
import { BattleLog } from './BattleLog';
import { Hand } from './Hand';
import { HeroPanel } from './HeroPanel';
import { ResultPanel } from './ResultPanel';
import { RulesSummary } from './RulesSummary';

interface Props {
  content: LoadedContent;
  setup: MatchSetup;
  deck: string[];
  onNew: () => void;
}

export function BattleScreen({ content, setup, deck, onNew }: Props) {
  const { seed, profile, mine, ai } = setup;
  const { state, log, startedAt, endedAt, dispatch, restart } = useBattle(content, setup, deck);
  const myTurn = !state.result && state.active === HUMAN;
  const foe = HUMAN === 0 ? 1 : 0;
  return (
    <main className="battle">
      <HeroPanel
        player={state.players[foe]}
        config={state.config}
        title={`Rakip · ${ARCHETYPES[ai].name} · AI ${profile}`}
        active={!state.result && state.active === foe}
        showHandCount
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
      />
      <Hand state={state} onPlay={(iid) => dispatch({ type: 'PLAY_CARD', player: HUMAN, iid })} />
      <div className="controls">
        <button
          type="button"
          className="end-turn"
          disabled={!myTurn}
          onClick={() => dispatch({ type: 'END_TURN', player: HUMAN })}
        >
          Turu Bitir
        </button>
      </div>
      {state.result && (
        <ResultPanel
          state={state}
          log={log}
          seed={seed}
          profile={profile}
          durationSec={Math.round(((endedAt ?? startedAt) - startedAt) / 1000)}
          onRestart={restart}
          onNew={onNew}
        />
      )}
    </main>
  );
}
