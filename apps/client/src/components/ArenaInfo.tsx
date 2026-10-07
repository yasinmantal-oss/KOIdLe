import type { BattleState } from '@koidle/rules';

/** Raunt sayacı; Arena Çöküşü yalnız config'de açıksa satır gösterir. */
export function ArenaInfo({ state }: { state: BattleState }) {
  const a = state.config.arenaCollapse;
  const active = a.enabled && state.round >= a.startRound;
  const now = a.start + (state.round - a.startRound) * a.step;
  return (
    <div className="arenainfo">
      <span className="arenainfo__round">RAUNT {state.round}</span>
      {a.enabled && (
        <span className={`arenainfo__collapse${active ? ' arenainfo__collapse--hot' : ''}`}>
          {active
            ? `Arena çöküyor: bu raunt ${now}, sonra ${now + a.step}`
            : `Arena Çöküşü ${a.startRound}. rauntta (${a.startRound - state.round} kaldı)`}
        </span>
      )}
    </div>
  );
}

export function SeedLine({ seed }: { seed: number }) {
  return (
    <p className="seed">
      seed {seed}{' '}
      <button
        type="button"
        className="linkbtn"
        onClick={() => {
          navigator.clipboard?.writeText(String(seed)).catch(() => undefined);
        }}
      >
        kopyala
      </button>
    </p>
  );
}
