import { useEffect, useState } from 'react';
import { Bar, fmt, Gold, ItemName, ItemTile, Panel } from '../ui/common';
import { itemDef, RARITY_TR, SLOT_TR, SLOTS, slotDef } from '../world/protoData';
import {
  bestItem,
  clearSummary,
  equip,
  expToNext,
  type Item,
  itemHp,
  itemPower,
  itemValue,
  type Summary,
  sell,
} from '../world/world';
import { gameTime } from './Sinir';
import type { ScreenProps } from './types';

function statLine(i: Item): string {
  const p = itemPower(i);
  const h = itemHp(i);
  return [p ? `Güç ${p}` : null, h ? `HP ${h}` : null].filter(Boolean).join(' · ');
}

/** Kasabaya dönüş özeti: döngünün ödül anı. */
export function DonusScreen({ world, update, toast, summary }: ScreenProps & { summary: Summary }) {
  const slot = slotDef(summary.slotId);
  const leveled = summary.levelAfter > summary.levelBefore;
  const unlocked = SLOTS.filter(
    (s) => s.levelReq > summary.levelBefore && s.levelReq <= summary.levelAfter,
  );
  // Seviye çubuğu açılışta eski değerden yeniye dolar.
  const [fill, setFill] = useState(
    leveled ? 0 : (summary.expBefore / expToNext(summary.levelBefore)) * 100,
  );
  useEffect(() => {
    const t = setTimeout(
      () => setFill((summary.expAfter / expToNext(summary.levelAfter)) * 100),
      250,
    );
    return () => clearTimeout(t);
  }, [summary]);

  const best = bestItem(summary.items);
  const items = [...summary.items].sort((a, b) => (a === best ? -1 : b === best ? 1 : 0));
  const inInventory = (uid: string) => world.inventory.some((i) => i.uid === uid);

  return (
    <div className={`screen screen--reward${summary.defeated ? ' screen--defeat' : ''}`}>
      <div className="reward__crest" aria-hidden="true">
        {summary.defeated ? '🩹' : '🏰'}
      </div>
      <h2 className="reward__title">{summary.defeated ? 'BASKINDA DÜŞTÜN' : 'GANİMET GÜVENDE'}</h2>
      <p className="reward__sub">
        {slot.name} · {gameTime(summary.ticks)}
        {summary.raidsWon > 0 && ` · ${summary.raidsWon} baskın savuşturuldu`}
        {summary.defeated && ' · kasabada uyandın'}
      </p>
      <div className="sums">
        <Panel as="div">
          <small>Altın</small>
          <b className="t-gold">+{fmt(summary.gold)}</b>
        </Panel>
        <Panel as="div">
          <small>EXP</small>
          <b className="t-ok">+{fmt(summary.exp)}</b>
        </Panel>
      </div>
      <Panel className="lvlup">
        <div className="lvlup__t">
          <span>
            Seviye {summary.levelBefore}
            {leveled && (
              <>
                {' '}
                → <b className="t-ok lvlup__new">{summary.levelAfter}</b>
              </>
            )}
          </span>
          {unlocked.length > 0 && (
            <span className="t-gold">🔓 {unlocked.map((s) => s.name).join(', ')} açıldı</span>
          )}
        </div>
        <Bar
          kind="xp"
          value={fill}
          max={100}
          label={`${summary.expAfter} / ${expToNext(summary.levelAfter)}`}
        />
      </Panel>

      {items.length > 0 ? (
        <div className="newdrops">
          {items.map((it) => {
            const d = itemDef(it.baseId);
            const isBest = it === best;
            const done = summary.handled.includes(it.uid) || !inInventory(it.uid);
            return (
              <div key={it.uid} className={`nd${isBest ? ' nd--best' : ''}`}>
                <ItemTile item={it} size="sm" />
                <div className="nd__info">
                  <ItemName item={it} />
                  <small>
                    {RARITY_TR[d.rarity]} · {SLOT_TR[d.slot]} · {statLine(it)}
                  </small>
                </div>
                {done ? (
                  <span className="nd__done">✓</span>
                ) : (
                  <span className="nd__acts">
                    {isBest && (
                      <button
                        type="button"
                        className="act"
                        onClick={() => {
                          update((w) => equip(w, it.uid));
                          toast(`${d.name} kuşanıldı`, 'ok');
                        }}
                      >
                        KUŞAN
                      </button>
                    )}
                    <button
                      type="button"
                      className="act act--s"
                      onClick={() => {
                        update((w) => sell(w, it.uid));
                        toast(`${d.name} satıldı: +${fmt(itemValue(it))} altın`, 'ok');
                      }}
                    >
                      SAT {fmt(itemValue(it))}
                    </button>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="reward__empty">Bu seferde item düşmedi. Altın ve EXP yine de cebinde.</p>
      )}

      {(summary.lostGold > 0 || summary.lostItems.length > 0) && (
        <p className="lost">
          Baskında kaybedilen: <Gold amount={summary.lostGold} />
          {summary.lostItems.length > 0 &&
            ` · ${summary.lostItems.map((i) => itemDef(i.baseId).name).join(', ')}`}
        </p>
      )}
      <button
        type="button"
        className="btn btn--gold reward__go"
        onClick={() => update(clearSummary)}
      >
        KASABAYA GİR
      </button>
    </div>
  );
}
