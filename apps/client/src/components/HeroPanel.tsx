import type { ArchetypeId } from '@koidle/content-schema';
import type { BattleConfig, PlayerState } from '@koidle/rules';
import type { CSSProperties } from 'react';
import { statusLabel } from '../format';
import { type InfoKey, infoText } from '../info';
import { ItemTile } from '../ui/common';
import { Emblem } from '../ui/Emblem';
import { Info } from '../ui/Info';
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
  archetype: ArchetypeId;
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
  archetype,
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
      <Emblem id={archetype} size={46} />
      {p.shield > 0 && (
        <Info className="fighter__shield" text={infoText('shield', config)}>
          {p.shield}
        </Info>
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
          <span
            key={pop.key}
            className={`pop${pop.amount >= 14 ? ' pop--huge' : pop.amount >= 8 ? ' pop--big' : ''}`}
            style={{ '--i': i } as CSSProperties}
          >
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
        <div className="bar bar--hp" title={infoText('hp', config)}>
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
          <Info text={infoText('mp', config)}>
            <b>
              {p.mp}/{p.maxMp} MP
            </b>
          </Info>
        </div>
        <div className="fxchips">
          {p.statuses.map((s) => (
            <Info
              key={s.id}
              className={`fxchip kw--${s.id}`}
              text={infoText(`status:${s.id}`, config)}
            >
              {statusLabel(s.id, s.amount)}
              {s.turnsLeft !== null && <small> · {s.turnsLeft} tur</small>}
            </Info>
          ))}
        </div>
        <dl className="fighter__meta">
          {showHandCount && <Meta k="hand" label="El" value={p.hand.length} config={config} />}
          <Meta k="deck" label="Deste" value={p.deck.length} config={config} />
          <Meta k="discard" label="Iskarta" value={p.discard.length} config={config} />
          <Meta k="reshuffle" label="Karıştırma hakkı" value={p.reshufflesLeft} config={config} />
          <Meta
            k="fatigue"
            label="Yorgunluk"
            value={`${p.fatigueCount} · sıradaki ${nextFatigue}`}
            config={config}
          />
        </dl>
      </div>
    </section>
  );
}

function Meta({
  k,
  label,
  value,
  config,
}: {
  k: InfoKey;
  label: string;
  value: string | number;
  config: BattleConfig;
}) {
  return (
    <div>
      <dt>
        <Info text={infoText(k, config)}>{label}</Info>
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
