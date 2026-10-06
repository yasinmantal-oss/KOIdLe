import type { BattleConfig, PlayerState } from '@koidle/rules';
import type { CSSProperties } from 'react';
import { statusLabel } from '../format';
import { ItemTile } from '../ui/common';
import type { GearSlot } from '../world/protoData';
import type { Item } from '../world/world';

export interface PopView {
  key: string;
  amount: number;
}

interface Props {
  player: PlayerState;
  config: BattleConfig;
  title: string;
  sub: string;
  portrait: string;
  side: 'me' | 'opp';
  active: boolean;
  showHandCount: boolean;
  /** Bu aksiyonda hasar aldıysa seq çift/tek (animasyon yeniden başlasın diye), yoksa null. */
  hit: 0 | 1 | null;
  pops: PopView[];
  /** Kahramanın 3 item gözü (yalnız gösterim; kurala etkisi yok). */
  gear?: Record<GearSlot, Item | null> | null;
}

export function HeroPanel({
  player: p,
  config,
  title,
  sub,
  portrait,
  side,
  active,
  showHandCount,
  hit,
  pops,
  gear,
}: Props) {
  const nextFatigue = config.fatigue.start + p.fatigueCount * config.fatigue.step;
  const hpPct = p.maxHp === 0 ? 0 : Math.round((p.hp / p.maxHp) * 100);
  const por = (
    <div className="fighter__por">
      <span aria-hidden="true">{portrait}</span>
      {p.shield > 0 && (
        <span className="fighter__shield" title="Kalkan">
          {p.shield}
        </span>
      )}
    </div>
  );
  return (
    <section
      className={`fighter fighter--${side}${active ? ' fighter--active' : ''}${hit === null ? '' : ` hero--hit${hit}`}`}
      aria-label={title}
    >
      <div className="pops" aria-hidden="true">
        {pops.map((pop, i) => (
          <span key={pop.key} className="pop" style={{ '--i': i } as CSSProperties}>
            −{pop.amount}
          </span>
        ))}
      </div>
      {gear ? (
        <div className="fighter__gear">
          <ItemTile item={gear.armor} empty="armor" size="sm" />
          {por}
          <ItemTile item={gear.weapon} empty="weapon" size="sm" />
          <ItemTile item={gear.accessory} empty="accessory" size="sm" />
        </div>
      ) : (
        por
      )}
      <div className="fighter__body">
        <h2 className="fighter__name">
          {title} <small>{sub}</small>
          {active && <span className="badge">{side === 'me' ? 'Senin sıran' : 'Oynuyor…'}</span>}
        </h2>
        <div className="bar bar--hp">
          <i className="meter__fill" style={{ width: `${hpPct}%` }} />
          <b>
            <span className="sr-only">HP </span>
            {p.hp} / {p.maxHp}
          </b>
        </div>
        <div className="mpgems">
          {Array.from({ length: config.mp.max }, (_, i) => (
            <i
              aria-hidden="true"
              // biome-ignore lint/suspicious/noArrayIndexKey: sabit MP gözleri
              key={i}
              className={`gem gem--${i < p.mp ? 'full' : i < p.maxMp ? 'empty' : 'locked'}`}
            />
          ))}
          <b>
            {p.mp}/{p.maxMp} MP
          </b>
        </div>
        <div className="fxchips">
          {p.statuses.map((s) => (
            <span key={s.id} className={`fxchip kw--${s.id}`}>
              {statusLabel(s.id, s.amount)}
              {s.turnsLeft !== null && <small> · {s.turnsLeft} tur</small>}
            </span>
          ))}
        </div>
        <dl className="fighter__meta">
          {showHandCount && (
            <div>
              <dt>El</dt>
              <dd>{p.hand.length}</dd>
            </div>
          )}
          <div>
            <dt>Deste</dt>
            <dd>{p.deck.length}</dd>
          </div>
          <div>
            <dt>Iskarta</dt>
            <dd>{p.discard.length}</dd>
          </div>
          <div>
            <dt>Karıştırma</dt>
            <dd>{p.reshufflesLeft}</dd>
          </div>
          <div>
            <dt>Yorgunluk</dt>
            <dd>
              {p.fatigueCount} · sıradaki {nextFatigue}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
