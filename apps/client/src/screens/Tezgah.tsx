import { useEffect, useState } from 'react';
import { fmt, Gold, ItemName, ItemTile, Panel } from '../ui/common';
import { itemDef, RARITY_TR, STALL_MOTTOS, TEZGAH_SLOTS } from '../world/protoData';
import {
  type Item,
  itemValue,
  listItem,
  markSalesSeen,
  saleBp,
  setMotto,
  unlist,
} from '../world/world';
import type { ScreenProps } from './types';

const PRICE_PRESETS = [
  { label: 'Hızlı', mult: 1 },
  { label: 'Adil', mult: 1.3 },
  { label: 'Sabırlı', mult: 1.8 },
];

function speedLabel(bp: number): string {
  if (bp >= 3000) return 'çok hızlı satar';
  if (bp >= 1500) return 'hızlı satar';
  if (bp >= 700) return 'zamanla satar';
  return 'alıcı bekler';
}

export function TezgahScreen({ world, update, toast }: ScreenProps) {
  const [picking, setPicking] = useState(false);
  const listings = world.stall.listings;
  const used = listings.filter(Boolean).length;
  const sales = world.stall.sales;
  const unseen = sales.filter((s) => !s.seen);
  const unseenTotal = unseen.reduce((a, s) => a + s.price, 0);

  return (
    <div className="screen screen--stall">
      <Panel className="stall">
        <h2 className="stall__h">
          {world.player.name}'in Tezgâhı <em className="live">● AÇIK · OFFLINE SATIŞ</em>
        </h2>
        <button
          type="button"
          className="stall__motto"
          onClick={() => update((w) => setMotto(w, (w.stall.motto + 1) % STALL_MOTTOS.length))}
          title="Tabelayı değiştir"
        >
          “{STALL_MOTTOS[world.stall.motto] ?? STALL_MOTTOS[0]}”
        </button>
        <div className="slots">
          {listings.map((l, idx) =>
            l ? (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: sabit 6 tezgâh gözü
                key={idx}
                className="sl"
                onClick={() => {
                  update((w) => unlist(w, idx));
                  toast(`${itemDef(l.item.baseId).name} tezgâhtan çekildi`, 'info');
                }}
                aria-label={`${itemDef(l.item.baseId).name}, ${l.price} altın. Geri çek`}
              >
                <ItemTile item={l.item} size="md" />
                <span className="sl__pr">
                  <Gold amount={l.price} />
                </span>
                <span className="sl__hint">{speedLabel(saleBp(l))}</span>
              </button>
            ) : (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: sabit 6 tezgâh gözü
                key={idx}
                className="sl sl--empty"
                onClick={() => setPicking(true)}
                aria-label="Item ekle"
              >
                +
              </button>
            ),
          )}
        </div>
        <p className="stall__foot">
          {used} / {TEZGAH_SLOTS} göz dolu · ilana dokununca geri çekilir
        </p>
      </Panel>

      <Panel className="inbox">
        <h3>SEN YOKKEN</h3>
        {sales.length === 0 ? (
          <p className="inbox__empty">Henüz satış yok. İlan koy; uygulama kapalıyken de satar.</p>
        ) : (
          <>
            {sales.slice(0, 6).map((s) => (
              <p key={s.id} className={s.seen ? 'seen' : 'new'}>
                <span>
                  {itemDef(s.item.baseId).icon} {itemDef(s.item.baseId).name}
                  {s.item.plus > 0 && ` +${s.item.plus}`} · {s.buyer} aldı
                </span>
                <b>+{fmt(s.price)}</b>
              </p>
            ))}
            {unseen.length > 0 && (
              <p className="inbox__total">
                <span>Yeni satışlar toplamı</span>
                <b>+{fmt(unseenTotal)}</b>
              </p>
            )}
          </>
        )}
        {unseen.length > 0 && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => update(markSalesSeen)}
          >
            TAMAM
          </button>
        )}
      </Panel>

      <button
        type="button"
        className="btn btn--gold"
        disabled={used >= TEZGAH_SLOTS}
        onClick={() => setPicking(true)}
      >
        {used >= TEZGAH_SLOTS ? 'TEZGÂH DOLU' : 'ITEM EKLE'}
      </button>

      {picking && (
        <ListSheet
          items={world.inventory}
          onClose={() => setPicking(false)}
          onList={(it, price) => {
            update((w) => listItem(w, it.uid, price));
            toast(`${itemDef(it.baseId).name} ${fmt(price)} altına ilanda`, 'ok');
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

function ListSheet({
  items,
  onClose,
  onList,
}: {
  items: Item[];
  onClose: () => void;
  onList: (it: Item, price: number) => void;
}) {
  const [sel, setSel] = useState<Item | null>(items[0] ?? null);
  const [mult, setMult] = useState(1.3);
  useEffect(() => {
    if (sel && !items.some((i) => i.uid === sel.uid)) setSel(items[0] ?? null);
  }, [items, sel]);
  const price = sel ? Math.round(itemValue(sel) * mult) : 0;
  return (
    <>
      <button type="button" className="scrim" aria-label="Kapat" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label="Tezgâha item koy">
        <div className="sheet__grab" />
        <h2 className="sheet__title">Tezgâha koy</h2>
        {items.length === 0 ? (
          <p className="sheet__sub">
            Çantan boş. Kuşanılı item'lar satılmaz; önce Karakter'den çıkar.
          </p>
        ) : (
          <>
            <div className="picker">
              {items.map((i) => (
                <ItemTile
                  key={i.uid}
                  item={i}
                  selected={sel?.uid === i.uid}
                  onClick={() => setSel(i)}
                />
              ))}
            </div>
            {sel && (
              <>
                <p className="sheet__sub">
                  <ItemName item={sel} /> · {RARITY_TR[itemDef(sel.baseId).rarity]} · değeri{' '}
                  <Gold amount={itemValue(sel)} />
                </p>
                <div className="seg">
                  {PRICE_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.label}
                      aria-pressed={mult === p.mult}
                      className={mult === p.mult ? 'on' : ''}
                      onClick={() => setMult(p.mult)}
                    >
                      {p.label}
                      <small>{fmt(Math.round(itemValue(sel) * p.mult))}</small>
                    </button>
                  ))}
                </div>
                <p className="t-dim sheet__speed">{speedLabel(saleBp({ item: sel, price }))}</p>
                <button type="button" className="btn btn--gold" onClick={() => onList(sel, price)}>
                  İLANA KOY · {fmt(price)}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
