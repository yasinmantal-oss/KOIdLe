import type { AiProfile } from '@koidle/ai';
import type { LoadedContent } from '../content';
import { HUMAN } from '../format';
import { useBattle } from '../useBattle';
import { ArenaInfo } from './ArenaInfo';
import { BattleLog } from './BattleLog';
import { Hand } from './Hand';
import { HeroPanel } from './HeroPanel';
import { ResultPanel } from './ResultPanel';

interface Props {
  content: LoadedContent;
  seed: number;
  profile: AiProfile;
  onNew: () => void;
}

export function BattleScreen({ content, seed, profile, onNew }: Props) {
  const { state, log, startedAt, endedAt, dispatch, restart } = useBattle(content, seed, profile);
  const myTurn = !state.result && state.active === HUMAN;
  const foe = HUMAN === 0 ? 1 : 0;
  return (
    <main className="battle">
      <HeroPanel
        player={state.players[foe]}
        config={state.config}
        title={`Rakip · AI ${profile}`}
        active={!state.result && state.active === foe}
        showHandCount
      />
      <ArenaInfo state={state} seed={seed} />
      <BattleLog log={log} cards={state.cards} />
      <HeroPanel
        player={state.players[HUMAN]}
        config={state.config}
        title="Sen · Warrior"
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
