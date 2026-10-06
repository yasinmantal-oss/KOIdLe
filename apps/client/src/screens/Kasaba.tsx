import { ARCHETYPES } from '@koidle/content-schema';
import { Bar, Gold, ItemName, Panel } from '../ui/common';
import { ARCHETYPE_ICON, slotDef } from '../world/protoData';
import { expToNext, type Item, playerStats } from '../world/world';
import { DonusScreen } from './Donus';
import { gameTime } from './Sinir';
import type { ScreenProps } from './types';

export function KasabaScreen(props: ScreenProps & { onDuel: () => void }) {
  const { world, go, onDuel } = props;
  if (world.summary) return <DonusScreen {...props} summary={world.summary} />;
  const p = world.player;
  const stats = playerStats(world);
  const farm = world.farm;
  const listed = world.stall.listings.filter(Boolean).length;
  const unseen = world.stall.sales.filter((s) => !s.seen);
  const gear = Object.values(world.equipped).filter((i): i is Item => i !== null);
  const anvilPick = world.equipped.weapon ?? gear[0];

  return (
    <div className="screen screen--town">
      <div className="town__sky" aria-hidden="true">
        <span className="town__moon" />
        <span className="town__skyline" />
      </div>
      <Panel className="herocard">
        <span className="herocard__por">{ARCHETYPE_ICON[p.archetype]}</span>
        <div className="herocard__info">
          <h2>
            {p.name} <span className="nation nation--a">Ulus A</span>
          </h2>
          <small>
            {ARCHETYPES[p.archetype].name} · Lv {p.level} · Güç {stats.power} · HP {stats.hp}
          </small>
          <Bar
            kind="xp"
            value={p.exp}
            max={expToNext(p.level)}
            label={`${p.exp} / ${expToNext(p.level)} EXP`}
          />
        </div>
      </Panel>

      <button
        type="button"
        className={`cta${farm ? ' cta--live' : ''}`}
        onClick={() => go('sinir')}
      >
        <span className="cta__ic" aria-hidden="true">
          {farm ? slotDef(farm.slotId).icon : '🗺️'}
        </span>
        <span className="cta__txt">
          <b>{farm ? `${slotDef(farm.slotId).name} · farmdasın` : 'SINIRA ÇIK'}</b>
          <small>
            {farm ? (
              <>
                {gameTime(farm.ticks)} · taşınan <Gold amount={farm.gold} /> + {farm.items.length}{' '}
                item
              </>
            ) : (
              'Slot seç, farm et, ganimeti sağ salim getir.'
            )}
          </small>
        </span>
        <span className="cta__arrow" aria-hidden="true">
          ›
        </span>
      </button>

      <div className="buildings">
        <button type="button" className="bld" onClick={() => go('ors')}>
          <span className="bld__ic">⚒️</span>
          <b>Örs</b>
          <small>{anvilPick ? <ItemName item={anvilPick} /> : 'Yükselt'}</small>
        </button>
        <button type="button" className="bld" onClick={() => go('tezgah')}>
          <span className="bld__ic">⚖️</span>
          <b>Tezgâh</b>
          <small>
            {unseen.length > 0 ? `${unseen.length} yeni satış` : `${listed} / 6 ilanda`}
          </small>
          {unseen.length > 0 && <span className="bld__badge">{unseen.length}</span>}
        </button>
        <button type="button" className="bld" onClick={() => go('karakter')}>
          <span className="bld__ic">🎒</span>
          <b>Çanta</b>
          <small>{world.inventory.length} item</small>
        </button>
        <button type="button" className="bld bld--duel" onClick={onDuel}>
          <span className="bld__ic">🃏</span>
          <b>Düello</b>
          <small>Kart savaşı · sandbox</small>
        </button>
      </div>

      <p className="town__hint">
        Kasaba güvenli: buraya getirdiğin her şey senindir. Sınırda taşıdığın ganimet ise baskında
        gidebilir.
      </p>
    </div>
  );
}
