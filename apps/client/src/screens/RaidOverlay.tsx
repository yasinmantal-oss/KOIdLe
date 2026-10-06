import { ARCHETYPES } from '@koidle/content-schema';
import { useEffect, useRef, useState } from 'react';
import { Gold, pct } from '../ui/common';
import { ARCHETYPE_ICON, RAID_COUNTDOWN_S, RAID_LOSS_PCT, slotDef } from '../world/protoData';
import { autoWinBp, type World } from '../world/world';

interface Props {
  world: World;
  onFight: () => void;
  onAuto: () => void;
}

/** Uygulama içi baskın bildirimi: hangi ekranda olursan ol üstte açılır. */
export function RaidOverlay({ world, onFight, onAuto }: Props) {
  const raid = world.raid;
  const farm = world.farm;
  const [left, setLeft] = useState(RAID_COUNTDOWN_S);
  const fired = useRef(false);
  // Ani beliren pencereye yanlışlıkla dokunulmasın: düğmeler kısa bir an kilitli.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (left === 0 && !fired.current) {
      fired.current = true;
      onAuto();
    }
  }, [left, onAuto]);

  if (!raid || !farm) return null;
  const slot = slotDef(farm.slotId);
  const p = world.player;
  return (
    <div className="overlay" role="alertdialog" aria-labelledby="raid-title">
      <div className="raid panel">
        <p className="raid__kicker">⚔️ BASKIN</p>
        <h2 id="raid-title" className="raid__title">
          {slot.name} saldırı altında
        </h2>
        <p className="raid__text">
          <b>{raid.raider.name}</b> sana saldırdı. {RAID_COUNTDOWN_S} sn içinde girmezsen savaşı
          senin desten AI ile oynar.
        </p>
        <div className="vs">
          <div className="vs__p">
            <span className="av av--me">{ARCHETYPE_ICON[p.archetype]}</span>
            <b>{p.name}</b>
            <small>
              {ARCHETYPES[p.archetype].name} · Lv {p.level}
            </small>
          </div>
          <span className="vs__x">VS</span>
          <div className="vs__p">
            <span className="av av--op">{ARCHETYPE_ICON[raid.raider.archetype]}</span>
            <b>{raid.raider.name}</b>
            <small>
              {ARCHETYPES[raid.raider.archetype].name} · Lv {raid.level}
            </small>
          </div>
        </div>
        <div className={`countdown${left <= 10 ? ' countdown--hot' : ''}`} aria-live="polite">
          0:{String(left).padStart(2, '0')}
          <small>AI devralmadan önce</small>
        </div>
        <p className="raid__risk">
          Risk altında: <Gold amount={farm.gold} /> + {farm.items.length} item · kaybedersen %
          {RAID_LOSS_PCT}'si gider
        </p>
        <button type="button" className="btn btn--red" disabled={!armed} onClick={onFight}>
          SAVAŞA GİR
        </button>
        <button
          type="button"
          className="btn btn--ghost raid__auto"
          disabled={!armed}
          onClick={onAuto}
        >
          AI'YA BIRAK · tahmini şans {pct(autoWinBp(world, raid))}
        </button>
      </div>
    </div>
  );
}
