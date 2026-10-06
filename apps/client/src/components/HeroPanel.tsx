import type { BattleConfig, PlayerState } from '@koidle/rules';
import { STATUS_TR } from '../format';

interface Props {
  player: PlayerState;
  config: BattleConfig;
  title: string;
  active: boolean;
  showHandCount: boolean;
}

export function HeroPanel({ player: p, config, title, active, showHandCount }: Props) {
  const nextFatigue = config.fatigue.start + p.fatigueCount * config.fatigue.step;
  return (
    <section className={`hero ${active ? 'hero--active' : ''}`}>
      <header>
        <h2>{title}</h2>
        {active && <span className="badge">Sıra burada</span>}
      </header>
      <div className="bars">
        <Meter label="HP" value={p.hp} max={p.maxHp} kind="hp" />
        <Meter label="MP" value={p.mp} max={p.maxMp} kind="mp" />
      </div>
      <dl className="stats">
        <Stat label="Kalkan" value={p.shield} />
        <Stat
          label="Statüler"
          value={
            p.statuses.length === 0
              ? '—'
              : p.statuses
                  .map((s) => `${STATUS_TR[s.id]} ${s.amount} · ${s.turnsLeft} tur`)
                  .join(', ')
          }
        />
        {showHandCount && <Stat label="Eldeki kart" value={p.hand.length} />}
        <Stat label="Deste" value={p.deck.length} />
        <Stat label="Iskarta" value={p.discard.length} />
        <Stat label="Karıştırma hakkı" value={p.reshufflesLeft} />
        <Stat label="Yorgunluk" value={`${p.fatigueCount} kez · sıradaki ${nextFatigue}`} />
      </dl>
    </section>
  );
}

function Meter(props: { label: string; value: number; max: number; kind: 'hp' | 'mp' }) {
  const pct = props.max === 0 ? 0 : Math.round((props.value / props.max) * 100);
  return (
    <div className="meter">
      <span className="meter__label">
        {props.label} {props.value}/{props.max}
      </span>
      <span className={`meter__track meter__track--${props.kind}`}>
        <span className="meter__fill" style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}

function Stat(props: { label: string; value: string | number }) {
  return (
    <div className="stat">
      <dt>{props.label}</dt>
      <dd>{props.value}</dd>
    </div>
  );
}
