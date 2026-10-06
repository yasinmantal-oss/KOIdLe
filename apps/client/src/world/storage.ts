import { createWorld, type World } from './world';

const KEY = 'koidle.dunya.v1';

interface Saved {
  world: World;
  savedAt: number;
}

/** Kayıtlı dünya ve kaydedildiği an; localStorage yoksa/bozuksa null (sessizce). */
export function loadWorld(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Saved;
    if (v?.world?.version !== 1 || typeof v.savedAt !== 'number') return null;
    return v;
  } catch {
    return null;
  }
}

export function saveWorld(world: World): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ world, savedAt: Date.now() } satisfies Saved));
  } catch {
    // kayıt olmadan da oynanır
  }
}

export function clearWorld(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // yok say
  }
}

/** Yeni dünya için seed: istemci tarafında saatten türer (rules paketi değil). */
export function freshWorld(): World {
  return createWorld(Date.now() % 2_147_483_647);
}
