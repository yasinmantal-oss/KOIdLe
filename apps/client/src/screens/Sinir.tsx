import { ARCHETYPES } from '@koidle/content-schema';
import { type CSSProperties, useState } from 'react';
import { Bar, Gold, ItemTile, NationDots, Panel, pct } from '../ui/common';
import {
  ARCHETYPE_ICON,
  BAG_ITEM_CAP,
  itemDef,
  RARITY_TR,
  RISK_TR,
  SLOTS,
  type SlotDef,
  slotDef,
  TICK_GAME_MIN,
  TICK_MS,
} from '../world/protoData';
import {
  acknowledgeThreat,
  canFarm,
  type Farm,
  goldCap,
  isBagFull,
  returnToTown,
  startFarm,
  type TickEvent,
} from '../world/world';
import type { ScreenProps } from './types';

const MOBS: Record<string, string[]> = {
  kamp: ['🐀', '🦇', '🐗'],
  'tas-sirti': ['🦎', '🐗', '🦂'],
  'kara-orman': ['🐺', '🕷️', '🦉'],
  'kul-cukuru': ['🦂', '🔥', '🦴'],
  'demir-tepe': ['🐺', '🦂', '🦴'],
  'olu-vadi': ['💀', '👻', '🦴'],
};

const perHour = (perTick: number) => Math.round((perTick * 60) / TICK_GAME_MIN);

export function gameTime(ticks: number): string {
  const m = ticks * TICK_GAME_MIN;
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}s ${m % 60}dk` : `${m}dk`;
}

export function SinirScreen(props: ScreenProps) {
  const { world } = props;
  const [showMap, setShowMap] = useState(false);
  if (world.farm && !showMap) {
    return <FarmView {...props} farm={world.farm} onMap={() => setShowMap(true)} />;
  }
  return <MapView {...props} onBackToFarm={world.farm ? () => setShowMap(false) : null} />;
}

function MapView({
  world,
  update,
  toast,
  onBackToFarm,
}: ScreenProps & { onBackToFarm: (() => void) | null }) {
  const [sel, setSel] = useState<string | null>(null);
  const farmSlot = world.farm?.slotId ?? null;
  // Yolun sırası: aşağıdan (güvenli) yukarıya (düşman toprağı).
  const pathD = SLOTS.map((s, i) => `${i === 0 ? 'M' : 'L'}${s.x} ${s.y}`).join(' ');
  const selected = sel ? slotDef(sel) : null;
  return (
    <div className="screen screen--map">
      <section className="map" aria-label="Sınır Bölgesi haritası">
        <svg
          className="map__path"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={pathD} />
        </svg>
        <div className="map__fog" aria-hidden="true" />
        <span className="zone-tag zone-tag--top">▲ DÜŞMAN TOPRAĞI · ULUS B</span>
        <span className="zone-tag zone-tag--bottom">▼ GÜVENLİ BÖLGE · ULUS A</span>
        {SLOTS.map((s) => {
          const locked = world.player.level < s.levelReq;
          const occ = world.occupancy[s.id] ?? [];
          const here = farmSlot === s.id;
          return (
            <button
              type="button"
              key={s.id}
              className={`node risk-${s.risk}${sel === s.id ? ' sel' : ''}${locked ? ' locked' : ''}${here ? ' here' : ''}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` } as CSSProperties}
              onClick={() => setSel(s.id)}
              aria-label={`${s.name}, Lv ${s.levelReq}+, risk ${RISK_TR[s.risk]}`}
            >
              {here && <span className="node__me">SEN</span>}
              <span className="node__ic" aria-hidden="true">
                {s.icon}
              </span>
              <span className="node__lb">{s.name}</span>
              {locked ? (
                <span className="node__lock">🔒 Lv {s.levelReq}</span>
              ) : (
                <NationDots occ={occ} />
              )}
            </button>
          );
        })}
      </section>
      <div className="legend">
        <span>
          <i className="d-a" />
          Ulusun (A)
        </span>
        <span>
          <i className="d-b" />
          Düşman (B)
        </span>
        <span>
          <i className="d-e" />
          Boş
        </span>
      </div>
      {onBackToFarm && (
        <div className="map__farmbar">
          <button type="button" className="btn btn--gold" onClick={onBackToFarm}>
            FARMA DÖN · {slotDef(world.farm?.slotId ?? 'kamp').name}
          </button>
        </div>
      )}
      {selected && (
        <SlotSheet
          slot={selected}
          world={world}
          onClose={() => setSel(null)}
          onStart={() => {
            update((w) => startFarm(w, selected.id));
            toast(`${selected.name}: farm başladı`, 'ok');
            setSel(null);
            onBackToFarm?.();
          }}
        />
      )}
    </div>
  );
}

function SlotSheet({
  slot,
  world,
  onClose,
  onStart,
}: {
  slot: SlotDef;
  world: ScreenProps['world'];
  onClose: () => void;
  onStart: () => void;
}) {
  const occ = world.occupancy[slot.id] ?? [];
  const filled = occ.filter((o) => o !== null).length;
  const enemies = occ.filter((o) => o === 'B').length;
  const locked = world.player.level < slot.levelReq;
  const ok = canFarm(world, slot.id);
  const reason = locked
    ? `Lv ${slot.levelReq} gerekli`
    : world.farm
      ? 'Zaten farmdasın'
      : filled >= 6
        ? 'Slot dolu'
        : null;
  return (
    <>
      <button type="button" className="scrim" aria-label="Kapat" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label={slot.name}>
        <div className="sheet__grab" />
        <h2 className="sheet__title">
          <span aria-hidden="true">{slot.icon}</span> {slot.name}
        </h2>
        <p className="sheet__sub">
          Lv {slot.levelReq}+ · {slot.blurb}
        </p>
        <div className="stats">
          <div>
            <small>Doluluk</small>
            <b>{filled} / 6</b>
            <NationDots occ={occ} />
          </div>
          <div>
            <small>Risk</small>
            <b className={`risk-txt risk-txt--${slot.risk}`}>{RISK_TR[slot.risk]}</b>
          </div>
          <div>
            <small>Altın / saat</small>
            <b>
              ≈ <Gold amount={perHour(slot.goldPerTick)} />
            </b>
          </div>
          <div>
            <small>EXP / saat</small>
            <b className="t-ok">≈ {perHour(slot.expPerTick).toLocaleString('tr-TR')}</b>
          </div>
        </div>
        <div className="eff">
          <span>{enemies > 0 ? `⚠ ${enemies} düşman bu slotta` : '✓ Şu an düşman yok'}</span>
          <span>Baskın şansı {pct(slot.threatBp)} / tik</span>
        </div>
        <small className="label">İmza drop'lar</small>
        <div className="drops">
          {slot.drops.map((id) => {
            const d = itemDef(id);
            return (
              <span
                key={id}
                className={`tile tile--md r-${d.rarity}`}
                title={`${d.name} · ${RARITY_TR[d.rarity]}`}
              >
                <span className="tile__icon">{d.icon}</span>
                <span className="tile__rar">{RARITY_TR[d.rarity][0]}</span>
              </span>
            );
          })}
          <span className="tile tile--md tile--q" title="Söylenti drop'u (yakında)">
            ?
          </span>
        </div>
        <button type="button" className="btn btn--gold" disabled={!ok} onClick={onStart}>
          {reason ?? "FARM'A BAŞLA"}
        </button>
      </div>
    </>
  );
}

function floaterText(e: TickEvent): { text: string; cls: string } | null {
  switch (e.kind) {
    case 'gold':
      return { text: `+${e.amount}`, cls: 'fl-gold' };
    case 'exp':
      return { text: `+${e.amount} EXP`, cls: 'fl-exp' };
    case 'item': {
      const d = itemDef(e.item.baseId);
      return { text: `${d.icon} ${RARITY_TR[d.rarity]}!`, cls: `fl-item r-${d.rarity}` };
    }
    case 'bagFull':
      return { text: 'Çanta dolu!', cls: 'fl-bad' };
    default:
      return null;
  }
}

function FarmView({
  world,
  update,
  go,
  farm,
  onMap,
}: ScreenProps & { farm: Farm; onMap: () => void }) {
  const slot = slotDef(farm.slotId);
  const occ = world.occupancy[slot.id] ?? [];
  const mobs = MOBS[slot.id] ?? ['🐺'];
  const cap = goldCap(slot.id);
  const full = isBagFull(farm);
  const threat = farm.threat;
  const secs = threat ? Math.ceil((threat.ticksLeft * TICK_MS) / 1000) : 0;
  return (
    <div className="screen screen--farm">
      <div className="farmstage">
        <span className="farmstage__tag">
          {slot.icon} {slot.name} · {occ.filter((o) => o !== null).length}/6
        </span>
        <span className="farmstage__timer">⏱ {gameTime(farm.ticks)}</span>
        {mobs.map((m, i) => (
          <span key={m} className={`mob mob--${i}`} aria-hidden="true">
            {m}
          </span>
        ))}
        <span className="farmstage__hero" aria-hidden="true">
          {ARCHETYPE_ICON[world.player.archetype]}
        </span>
        <span className="farmstage__ground" aria-hidden="true" />
        <div className="floaters" aria-hidden="true">
          {farm.last.map((e, i) => {
            const f = floaterText(e);
            if (!f) return null;
            return (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: tik başına yeni yüzen yazılar
                key={`${farm.ticks}-${i}`}
                className={`floater ${f.cls}`}
                style={
                  {
                    '--fx': `${[22, 62, 40, 70][i % 4]}%`,
                    animationDelay: `${i * 120}ms`,
                  } as CSSProperties
                }
              >
                {f.text}
              </span>
            );
          })}
        </div>
        {farm.shieldTicks > 0 && !threat && (
          <span className="farmstage__shield">
            🛡 Baskın kalkanı {Math.ceil((farm.shieldTicks * TICK_MS) / 1000)} sn
          </span>
        )}
      </div>

      <Panel className="carry">
        <h2 className="carry__h">
          TAŞINAN GANİMET <em>⚠ Henüz güvende değil</em>
        </h2>
        <div className="carry__nums">
          <Gold amount={farm.gold} />
          <span className="t-ok">+{farm.exp.toLocaleString('tr-TR')} EXP</span>
          <span className="t-dim">EXP risk dışı</span>
        </div>
        <Bar
          kind="loot"
          value={farm.gold}
          max={cap}
          label={farm.gold >= cap ? 'Kese dolu' : `Kese ${Math.round((farm.gold / cap) * 100)}%`}
        />
        <div className="loot">
          {Array.from({ length: BAG_ITEM_CAP }, (_, i) => {
            const it = farm.items[i];
            return it ? (
              <ItemTile key={it.uid} item={it} size="sm" />
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: boş çanta gözü
              <span key={`e${i}`} className="tile tile--sm tile--hole" />
            );
          })}
        </div>
        {full && (
          <p className="carry__full">
            Çantan dolu. Kalmak artık yalnız risk; kasabaya dönmenin vakti.
          </p>
        )}
      </Panel>

      {threat && (
        <div className={`alert${threat.acknowledged ? ' alert--ack' : ''}`} role="alert">
          <span className="alert__dot" aria-hidden="true" />
          <span>
            <b>Düşman yakında.</b> "{threat.raider.name}" (Lv {threat.level},{' '}
            {ARCHETYPES[threat.raider.archetype].name}) {slot.name} slotuna girdi. Baskına ~{secs}{' '}
            sn.
          </span>
        </div>
      )}

      <div className="row2">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => (threat && !threat.acknowledged ? update(acknowledgeThreat) : onMap())}
        >
          {threat && !threat.acknowledged ? 'RİSKİ AL, KAL' : 'HARİTA'}
        </button>
        <button
          type="button"
          className="btn btn--gold"
          onClick={() => {
            update((w) => returnToTown(w));
            go('kasaba');
          }}
        >
          KASABAYA DÖN
        </button>
      </div>

      <div className="farmfacts">
        <span>
          <small>Altın / saat</small>
          <Gold amount={perHour(slot.goldPerTick)} />
        </span>
        <span>
          <small>EXP / saat</small>
          <b className="t-ok">{perHour(slot.expPerTick).toLocaleString('tr-TR')}</b>
        </span>
        <span>
          <small>Risk</small>
          <b className={`risk-txt risk-txt--${slot.risk}`}>{RISK_TR[slot.risk]}</b>
        </span>
      </div>
      <div className="farmdrops">
        {slot.drops.map((id) => {
          const d = itemDef(id);
          const got = farm.items.some((i) => i.baseId === id);
          return (
            <span
              key={id}
              className={`tile tile--sm r-${d.rarity}${got ? '' : ' tile--dim'}`}
              title={d.name}
            >
              <span className="tile__icon">{d.icon}</span>
            </span>
          );
        })}
        <small>İmza drop'lar · düşenler parlar</small>
      </div>
    </div>
  );
}
