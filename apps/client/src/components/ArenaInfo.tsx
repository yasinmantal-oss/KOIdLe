import type { BattleState } from '@koidle/rules';
import { HUMAN } from '../format';

export function ArenaInfo({ state, seed }: { state: BattleState; seed: number }) {
  const a = state.config.arenaCollapse;
  const active = state.round >= a.startRound;
  const now = a.start + (state.round - a.startRound) * a.step;
  const arena = active
    ? `Aktif — bu raunt ${now} hasar, sonraki ${now + a.step}`
    : `Pasif — ${a.startRound}. rauntta başlar (${a.startRound - state.round} raunt kaldı)`;
  return (
    <div className="arena">
      <span>
        <strong>{state.round}. raunt</strong> ·{' '}
        {state.active === HUMAN ? 'Senin sıran' : 'Rakibin sırası'}
      </span>
      <span className={active ? 'arena--hot' : ''}>Arena Çöküşü: {arena}</span>
      <span className="seed">
        seed {seed}{' '}
        <button
          type="button"
          className="link"
          onClick={() => navigator.clipboard?.writeText(String(seed))}
        >
          kopyala
        </button>
      </span>
    </div>
  );
}
