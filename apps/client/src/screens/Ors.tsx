import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { Bar, fmt, Gold, ItemName, ItemTile, Panel, pct } from '../ui/common';
import { HEAT_MAX, itemDef, RARITY_TR, SLOT_TR, UPGRADE_MAX } from '../world/protoData';
import {
  attemptUpgrade,
  dropsOnFail,
  findItem,
  type Item,
  itemHp,
  itemPower,
  type UpgradeOutcome,
  upgradeChance,
  upgradeCost,
} from '../world/world';
import type { ScreenProps } from './types';

const STRIKE_MS = 900;
const SPARKS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  const r = 60 + ((i * 37) % 50);
  return { x: Math.round(Math.cos(a) * r), y: Math.round(Math.sin(a) * r * 0.8 - 30) };
});

function mainStat(i: Item, plus: number): string {
  const probe = { ...i, plus };
  return itemDef(i.baseId).power > 0 ? `Güç ${itemPower(probe)}` : `HP ${itemHp(probe)}`;
}

export function OrsScreen({ world, update, toast, focus }: ScreenProps & { focus: string | null }) {
  const all: Item[] = [
    ...Object.values(world.equipped).filter((i): i is Item => i !== null),
    ...world.inventory,
  ];
  const [uid, setUid] = useState<string | null>(focus ?? all[0]?.uid ?? null);
  useEffect(() => {
    if (focus) setUid(focus);
  }, [focus]);
  const [phase, setPhase] = useState<'idle' | 'strike' | 'reveal'>('idle');
  const [strikes, setStrikes] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const seenN = useRef(world.lastUpgrade?.n ?? 0);
  useEffect(() => {
    const l = world.lastUpgrade;
    if (!l || l.n === seenN.current) return;
    seenN.current = l.n;
    const it = findItem(world, l.uid);
    if (!it) return;
    const name = itemDef(it.baseId).name;
    if (l.outcome === 'success') toast(`Başarılı! ${name} +${it.plus}`, 'ok');
    else if (l.outcome === 'drop') toast(`${name} +${it.plus}'e düştü. Örs ısındı.`, 'bad');
    else if (l.outcome === 'fail') toast('Başarısız. Örs ısındı, şansın arttı.', 'bad');
  }, [world, toast]);

  const item = uid ? findItem(world, uid) : null;
  if (!item) {
    return (
      <div className="screen screen--ors">
        <p className="empty">Örse koyacak item yok. Sınırdan bir şeyler getir.</p>
      </div>
    );
  }
  const d = itemDef(item.baseId);
  const maxed = item.plus >= UPGRADE_MAX;
  const ch = upgradeChance(item);
  const cost = upgradeCost(item);
  const poor = world.player.gold < cost;
  const busy = phase === 'strike';
  const equipped = Object.values(world.equipped).some((e) => e?.uid === item.uid);
  const last = world.lastUpgrade;
  const verdict: UpgradeOutcome | null =
    phase === 'reveal' && last?.uid === item.uid ? last.outcome : null;

  function strike() {
    if (!item || busy || maxed || poor) return;
    setPhase('strike');
    setStrikes((n) => n + 1);
    const target = item.uid;
    timer.current = setTimeout(() => {
      update((w) => attemptUpgrade(w, target).world);
      setPhase('reveal');
    }, STRIKE_MS);
  }

  return (
    <div className="screen screen--ors">
      <div
        className={`anvil anvil--${verdict ?? phase}`}
        key={`${strikes}-${phase === 'strike' ? 's' : 'r'}`}
        style={{ '--heat': item.heat / HEAT_MAX } as CSSProperties}
      >
        <div className="anvil__step">
          <span>+{item.plus}</span>
          <span className="anvil__arrow">→</span>
          <span className="anvil__to">{maxed ? 'MAX' : `+${item.plus + 1}`}</span>
        </div>
        <div className={`anvil__item r-${d.rarity}${item.plus >= 7 ? ' anvil__item--glow' : ''}`}>
          <span>{d.icon}</span>
        </div>
        <div className="anvil__hammer" aria-hidden="true">
          🔨
        </div>
        <div className="anvil__base" aria-hidden="true" />
        <div className="anvil__glow" aria-hidden="true" />
        <div className="anvil__sparks" aria-hidden="true">
          {SPARKS.map((s, i) => (
            <i
              // biome-ignore lint/suspicious/noArrayIndexKey: sabit kıvılcımlar
              key={i}
              style={
                {
                  '--x': `${s.x}px`,
                  '--y': `${s.y}px`,
                  animationDelay: `${(i % 4) * 30}ms`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        {verdict && verdict !== 'invalid' && (
          <div className={`anvil__verdict anvil__verdict--${verdict}`} role="status">
            {verdict === 'success'
              ? `+${item.plus}!`
              : verdict === 'drop'
                ? `+${item.plus}'e düştü`
                : 'Başarısız'}
          </div>
        )}
      </div>

      <Panel className="anvilinfo">
        <div className="anvilinfo__name">
          <ItemName item={item} />
          {equipped && <span className="tag">Kuşanılı</span>}
        </div>
        <small className="t-dim">
          {RARITY_TR[d.rarity]} · {SLOT_TR[d.slot]} · {mainStat(item, item.plus)}
          {!maxed && (
            <>
              {' '}
              → <b className="t-ok">{mainStat(item, item.plus + 1).split(' ')[1]}</b>
            </>
          )}
        </small>
        {maxed ? (
          <p className="anvilinfo__max">Bu item +{UPGRADE_MAX}. Örsün söyleyecek sözü kalmadı.</p>
        ) : (
          <>
            <div className="chancerow">
              <span className="chance">{pct(ch.total)}</span>
              <small>
                Taban {pct(ch.base)}
                <br />
                Örs Isısı +{pct(ch.heat)}
              </small>
            </div>
            <div className="heat">
              <span>🔥 Örs Isısı</span>
              <span>
                {item.heat} başarısızlık{item.heat >= HEAT_MAX ? ' · tavan' : ''}
              </span>
            </div>
            <Bar kind="heat" value={item.heat} max={HEAT_MAX} />
            <div className="costs">
              <span className={poor ? 't-bad' : ''}>
                Maliyet <Gold amount={cost} />
              </span>
              <span className="t-dim">Kasada {fmt(world.player.gold)}</span>
            </div>
            <p className="warn">
              {dropsOnFail(item)
                ? `Başarısızlıkta +${Math.max(0, item.plus - 1)}'e düşer. Item yanmaz; ısı kalır, şansın artar.`
                : 'Bu seviyede başarısızlık düşürmez. Item yanmaz; ısı kalır, şansın artar.'}
            </p>
          </>
        )}
      </Panel>

      <button
        type="button"
        className="btn btn--gold btn--anvil"
        disabled={busy || maxed || poor}
        onClick={strike}
      >
        {maxed ? 'TAVANDA' : poor ? 'ALTIN YETMİYOR' : busy ? 'VURULUYOR…' : 'ÖRSE VUR'}
      </button>

      <h3 className="label">Örse koy</h3>
      <div className="picker">
        {all.map((i) => (
          <ItemTile
            key={i.uid}
            item={i}
            size="md"
            selected={i.uid === item.uid}
            onClick={() => {
              if (!busy) {
                setUid(i.uid);
                setPhase('idle');
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
