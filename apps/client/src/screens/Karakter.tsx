import { ARCHETYPES, type ArchetypeId } from '@koidle/content-schema';
import { useState } from 'react';
import { Bar, fmt, ItemName, ItemTile, Panel } from '../ui/common';
import { ARCHETYPE_ICON, type GearSlot, itemDef, RARITY_TR, SLOT_TR } from '../world/protoData';
import {
  equip,
  expToNext,
  findItem,
  type Item,
  itemHp,
  itemPower,
  itemValue,
  playerStats,
  sell,
  setArchetype,
  unequip,
} from '../world/world';
import type { ScreenProps } from './types';

const JOBS: { id: ArchetypeId | 'mage' | 'priest'; label: string; icon: string; note: string }[] = [
  { id: 'warrior', label: 'Warrior', icon: '🛡️', note: 'Kalkan, Güç, ağır vuruş' },
  { id: 'assassin', label: 'Rogue · Asas', icon: '🗡️', note: 'Kritik, Kaçınma, hızlı bıçak' },
  { id: 'archer', label: 'Rogue · Okçu', icon: '🏹', note: 'Zehir, çoklu atış' },
  { id: 'mage', label: 'Mage', icon: '🔮', note: 'yakında' },
  { id: 'priest', label: 'Priest', icon: '✨', note: 'yakında' },
];

const isArchetype = (id: string): id is ArchetypeId =>
  id === 'warrior' || id === 'assassin' || id === 'archer';

export function KarakterScreen({
  world,
  update,
  toast,
  go,
  onDeck,
  onDuel,
  onAnvil,
  onReset,
}: ScreenProps & {
  onDeck: () => void;
  onDuel: () => void;
  onAnvil: (uid: string) => void;
  onReset: () => void;
}) {
  const p = world.player;
  const st = playerStats(world);
  const [detail, setDetail] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const gearTile = (slot: GearSlot) => (
    <ItemTile
      item={world.equipped[slot]}
      empty={slot}
      size="lg"
      onClick={() => {
        const it = world.equipped[slot];
        if (it) setDetail(it.uid);
      }}
      label={`${SLOT_TR[slot]}: ${world.equipped[slot] ? itemDef(world.equipped[slot].baseId).name : 'boş'}`}
    />
  );
  const detailItem = detail ? findItem(world, detail) : null;

  return (
    <div className="screen screen--char">
      <div className="paperdoll">
        <div className="paperdoll__slot paperdoll__slot--w">{gearTile('weapon')}</div>
        <div className="paperdoll__por">
          <span>{ARCHETYPE_ICON[p.archetype]}</span>
          <span className="paperdoll__lv">{p.level}</span>
        </div>
        <div className="paperdoll__slot paperdoll__slot--a">{gearTile('armor')}</div>
        <div className="paperdoll__slot paperdoll__slot--c">{gearTile('accessory')}</div>
      </div>
      <h2 className="char__name">
        {p.name} <span className="nation nation--a">Ulus A</span>
      </h2>
      <p className="char__sub">
        {ARCHETYPES[p.archetype].name} · Seviye {p.level}
      </p>
      <Bar
        kind="xp"
        value={p.exp}
        max={expToNext(p.level)}
        label={`${p.exp} / ${expToNext(p.level)} EXP`}
      />
      <div className="sums sums--char">
        <Panel as="div">
          <small>Güç</small>
          <b className="t-gold">{st.power}</b>
        </Panel>
        <Panel as="div">
          <small>HP</small>
          <b className="t-hp">{st.hp}</b>
        </Panel>
      </div>
      <p className="t-dim char__note">
        Dünya statları prototiptir; kart savaşının değerlerini henüz değiştirmez.
      </p>

      <h3 className="label">Job · savaş destesi</h3>
      <div className="jobs">
        {JOBS.map((j) => {
          const live = isArchetype(j.id);
          const on = j.id === p.archetype;
          return (
            <button
              type="button"
              key={j.id}
              className={`job${on ? ' job--on' : ''}${live ? '' : ' job--soon'}`}
              disabled={!live || world.farm !== null}
              aria-pressed={on}
              onClick={() => {
                if (isArchetype(j.id)) update((w) => setArchetype(w, j.id as ArchetypeId));
              }}
            >
              <span className="job__ic">{j.icon}</span>
              <b>{j.label}</b>
              <small>{j.note}</small>
            </button>
          );
        })}
      </div>
      {world.farm && <p className="t-dim char__note">Farmdayken job değişmez.</p>}
      <div className="row2">
        <button type="button" className="btn btn--ghost" onClick={onDeck}>
          DESTENİ DÜZENLE
        </button>
        <button type="button" className="btn btn--gold" onClick={onDuel}>
          DÜELLO
        </button>
      </div>

      <h3 className="label">Çanta · {world.inventory.length}</h3>
      {world.inventory.length === 0 ? (
        <p className="t-dim">Çanta boş.</p>
      ) : (
        <div className="picker">
          {world.inventory.map((i) => (
            <ItemTile
              key={i.uid}
              item={i}
              selected={detail === i.uid}
              onClick={() => setDetail(i.uid)}
            />
          ))}
        </div>
      )}

      <div className="danger">
        {confirmReset ? (
          <>
            <span>Tüm ilerleme silinsin mi?</span>
            <button
              type="button"
              className="btn btn--red btn--sm"
              onClick={() => {
                onReset();
                setConfirmReset(false);
                go('kasaba');
              }}
            >
              EVET, SIFIRLA
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setConfirmReset(false)}
            >
              VAZGEÇ
            </button>
          </>
        ) : (
          <button type="button" className="linkbtn" onClick={() => setConfirmReset(true)}>
            Dünyayı sıfırla
          </button>
        )}
      </div>

      {detailItem && (
        <ItemSheet
          item={detailItem}
          equipped={Object.values(world.equipped).some((e) => e?.uid === detailItem.uid)}
          current={world.equipped[itemDef(detailItem.baseId).slot]}
          onClose={() => setDetail(null)}
          onEquip={() => {
            update((w) => equip(w, detailItem.uid));
            toast(`${itemDef(detailItem.baseId).name} kuşanıldı`, 'ok');
            setDetail(null);
          }}
          onUnequip={() => {
            update((w) => unequip(w, itemDef(detailItem.baseId).slot));
            setDetail(null);
          }}
          onSell={() => {
            update((w) => sell(w, detailItem.uid));
            toast(`Satıldı: +${fmt(itemValue(detailItem))} altın`, 'ok');
            setDetail(null);
          }}
          onAnvil={() => onAnvil(detailItem.uid)}
        />
      )}
    </div>
  );
}

function ItemSheet({
  item,
  equipped,
  current,
  onClose,
  onEquip,
  onUnequip,
  onSell,
  onAnvil,
}: {
  item: Item;
  equipped: boolean;
  current: Item | null;
  onClose: () => void;
  onEquip: () => void;
  onUnequip: () => void;
  onSell: () => void;
  onAnvil: () => void;
}) {
  const d = itemDef(item.baseId);
  const diff = (a: number, b: number) => (a > b ? `▲${a - b}` : a < b ? `▼${b - a}` : '=');
  return (
    <>
      <button type="button" className="scrim" aria-label="Kapat" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label={d.name}>
        <div className="sheet__grab" />
        <div className="itemhead">
          <ItemTile item={item} size="lg" />
          <div>
            <h2 className="sheet__title">
              <ItemName item={item} />
            </h2>
            <p className="sheet__sub">
              {RARITY_TR[d.rarity]} · {SLOT_TR[d.slot]} · değeri {fmt(itemValue(item))} altın
            </p>
            <p className="flavor">“{d.flavor}”</p>
          </div>
        </div>
        <div className="stats">
          <div>
            <small>Güç</small>
            <b>
              {itemPower(item)}{' '}
              {!equipped && current && (
                <em className="cmp">{diff(itemPower(item), itemPower(current))}</em>
              )}
            </b>
          </div>
          <div>
            <small>HP</small>
            <b>
              {itemHp(item)}{' '}
              {!equipped && current && (
                <em className="cmp">{diff(itemHp(item), itemHp(current))}</em>
              )}
            </b>
          </div>
        </div>
        <div className="row2 row2--flush">
          {equipped ? (
            <button type="button" className="btn btn--ghost" onClick={onUnequip}>
              ÇIKAR
            </button>
          ) : (
            <button type="button" className="btn btn--gold" onClick={onEquip}>
              KUŞAN
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={onAnvil}>
            ÖRSE GÖTÜR
          </button>
        </div>
        {!equipped && (
          <button type="button" className="linkbtn sheet__sell" onClick={onSell}>
            Tüccara sat · {fmt(itemValue(item))} altın
          </button>
        )}
      </div>
    </>
  );
}
