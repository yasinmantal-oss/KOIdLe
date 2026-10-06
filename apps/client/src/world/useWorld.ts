import { useCallback, useEffect, useState } from 'react';
import { MARKET_TICK_MS, TICK_MS } from './protoData';
import { clearWorld, freshWorld, loadWorld, saveWorld } from './storage';
import { driftOccupancy, farmTick, marketTick, type World } from './world';

const OFFLINE_FARM_CAP = 40;
const OFFLINE_MARKET_CAP = 30;

export interface OfflineNote {
  farmTicks: number;
  sales: number;
}

function boot(): { world: World; note: OfflineNote | null } {
  const saved = loadWorld();
  if (!saved) return { world: freshWorld(), note: null };
  let w = saved.world;
  const elapsed = Math.max(0, Date.now() - saved.savedAt);
  const farmTicks =
    w.farm && !w.raid ? Math.min(OFFLINE_FARM_CAP, Math.floor(elapsed / TICK_MS)) : 0;
  for (let i = 0; i < farmTicks; i++) w = farmTick(w, false);
  const salesBefore = w.stall.sales.length;
  const mt = Math.min(OFFLINE_MARKET_CAP, Math.floor(elapsed / MARKET_TICK_MS));
  for (let i = 0; i < mt; i++) w = marketTick(w);
  const sales = w.stall.sales.length - salesBefore;
  const note = farmTicks > 3 || sales > 0 ? { farmTicks, sales: Math.max(0, sales) } : null;
  return { world: w, note };
}

/** Dünya durumu + hızlandırılmış zaman. `paused` iken (savaş ekranı) farm ve pazar durur. */
export function useWorld(paused: boolean) {
  const [{ world, note }, setBoot] = useState(boot);
  const [offlineNote, setOfflineNote] = useState<OfflineNote | null>(note);

  const update = useCallback((fn: (w: World) => World) => {
    setBoot((s) => ({ ...s, world: fn(s.world) }));
  }, []);

  useEffect(() => saveWorld(world), [world]);

  const farming = !!world.farm && !world.raid;
  useEffect(() => {
    if (paused || !farming) return;
    const t = setInterval(() => update((w) => farmTick(w)), TICK_MS);
    return () => clearInterval(t);
  }, [paused, farming, update]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => update(marketTick), MARKET_TICK_MS);
    const d = setInterval(() => update(driftOccupancy), 6500);
    return () => {
      clearInterval(t);
      clearInterval(d);
    };
  }, [paused, update]);

  const reset = useCallback(() => {
    clearWorld();
    setBoot({ world: freshWorld(), note: null });
    setOfflineNote(null);
  }, []);

  return { world, update, reset, offlineNote, dismissNote: () => setOfflineNote(null) };
}
