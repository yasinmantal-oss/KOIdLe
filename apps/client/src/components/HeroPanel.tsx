import type { BattleConfig, PlayerState } from '@koidle/rules';
import type { CSSProperties, ReactNode } from 'react';
import { statusLabel } from '../format';

export interface PopView {
  key: string;
  amount: number;
}

interface Props {
  player: PlayerState;
  config: BattleConfig;
  title: string;
  active: boolean;
  showHandCount: boolean;
  /** Bu aksiyonda hasar aldıysa seq çift/tek (animasyon yeniden başlasın diye), yoksa null. */
  hit: 0 | 1 | null;
  pops: PopView[];
}

export function HeroPanel({ player: p, config, title, active, showHandCount, hit, pops }: Props) {
  const nextFatigue = config.fatigue.start + p.fatigueCount * config.fatigue.step;
  return (
    <section
      className={`hero ${active ? 'hero--active' : ''}${hit === null ? '' : ` hero--hit${hit}`}`}
    >
      <div className="pops" aria-hidden="true">
        {pops.map((pop, i) => (
          <span key={pop.key} className="pop" style={{ '--i': i } as CSSProperties}>
            −{pop.amount}
          </span>
        ))}
      </div>
      <header>
        <h2>{title}</h2>
        {active && <span className="badge">Sıra burada</span>}
      </header>
      <div className="bars">
        <Meter label="HP" value={p.hp} max={p.maxHp} kind="hp" />
        <Meter label="MP" value={p.mp} max={p.maxMp} kind="mp" />
      </div>
      <dl className="stats">
        <Stat label="Kalkan" value={<span className="kw kw--shield">{p.shield}</span>} />
        <Stat
          label="Statüler"
          value={
            p.statuses.length === 0
              ? '—'
              : p.statuses.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 && ', '}
                    <span className={`kw kw--${s.id}`}>{statusLabel(s.id, s.amount)}</span>
                    {s.turnsLeft !== null && ` · ${s.turnsLeft} tur`}
                  </span>
                ))
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

function Stat(props: { label: string; value: ReactNode }) {
  return (
    <div className="stat">
      <dt>{props.label}</dt>
      <dd>{props.value}</dd>
    </div>
  );
}
