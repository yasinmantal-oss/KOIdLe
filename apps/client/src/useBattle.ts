import { chooseAction } from '@koidle/ai';
import {
  type Action,
  apply,
  type BattleEvent,
  type BattleState,
  createBattle,
} from '@koidle/rules';
import { useCallback, useEffect, useState } from 'react';
import type { LoadedContent } from './content';
import { HUMAN } from './format';
import type { MatchSetup } from './match';

export const AI_DELAY_MS = 700;

export interface BattleSession {
  state: BattleState;
  log: BattleEvent[];
  startedAt: number;
  endedAt: number | null;
}

function start(content: LoadedContent, setup: MatchSetup, myDeck: string[]): BattleSession {
  const { state, events } = createBattle({
    config: content.config,
    cards: content.cards,
    decks: [myDeck, content.presets[setup.ai]],
    names: ['Sen', `AI (${setup.profile})`],
    seed: setup.seed,
  });
  return { state, log: events, startedAt: Date.now(), endedAt: null };
}

export function useBattle(content: LoadedContent, setup: MatchSetup, myDeck: string[]) {
  const [session, setSession] = useState(() => start(content, setup, myDeck));

  const dispatch = useCallback((action: Action) => {
    setSession((s) => {
      if (s.state.result) return s;
      const r = apply(s.state, action);
      return {
        ...s,
        state: r.state,
        log: [...s.log, ...r.events],
        endedAt: r.state.result ? Date.now() : null,
      };
    });
  }, []);

  // AI sırası: kararı rules + ai verir, UI yalnız zamanlar.
  useEffect(() => {
    const { state } = session;
    if (state.result || state.active === HUMAN) return;
    const timer = setTimeout(() => {
      dispatch(
        chooseAction(state, state.active, content.profiles[setup.profile], {
          planner: content.planner,
        }),
      );
    }, AI_DELAY_MS);
    return () => clearTimeout(timer);
  }, [session, content, setup.profile, dispatch]);

  const restart = useCallback(
    () => setSession(start(content, setup, myDeck)),
    [content, setup, myDeck],
  );

  return { ...session, dispatch, restart };
}
