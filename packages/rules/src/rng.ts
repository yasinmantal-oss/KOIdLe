// mulberry32. Durum tek bir uint32; BattleState içinde saklanır, böylece savaş seri hale getirilip
// kaldığı yerden aynı sonuçlarla sürdürülebilir.
export interface RngHolder {
  rng: number;
}

export function nextUint32(h: RngHolder): number {
  h.rng = (h.rng + 0x6d2b79f5) >>> 0;
  let t = h.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return (t ^ (t >>> 14)) >>> 0;
}

export function rollInt(h: RngHolder, maxExclusive: number): number {
  return nextUint32(h) % maxExclusive;
}

export function shuffle<T>(h: RngHolder, items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = rollInt(h, i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}
