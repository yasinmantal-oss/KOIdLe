import type { BattleEvent, PlayerIndex } from '@koidle/rules';

/**
 * UI efekt sabitleri (F2-12). Bunlar KURAL DEĞERİ DEĞİLDİR: savaşın sonucuna dokunmaz, yalnız
 * görsel eşik ve süredir; bu yüzden content/ yerine burada durur (K4'e dar istisna).
 */
export const FX = {
  hitstopAt: 6,
  hitstopMs: 70,
  shakeAt: 10,
  shakePx: 5,
  shakeBigAt: 14,
  shakeBigPx: 12,
  shakeMs: 240,
  /** Sana tek aksiyonda bu kadar hasar gelirse ekran kenarı kırmızı yanar. */
  edgeFlashAt: 8,
  edgeFlashMs: 420,
  popMs: 500,
  calloutMs: 700,
  flashMs: 120,
} as const;

export interface Pop {
  target: PlayerIndex;
  amount: number;
}

export interface FxResult {
  /** Toplam kart hasarı ≥ hitstopAt: HP çubuğu hitstopMs gecikmeyle düşer. */
  hitstop: boolean;
  /** Ekran sarsıntısı genliği, piksel (0 = yok). */
  shakePx: number;
  /** Hasar alan kahramanlar (0 hasar sayılmaz). */
  hitTargets: PlayerIndex[];
  /** Her DAMAGE_DEALT için bir sayı. */
  pops: Pop[];
  callouts: string[];
  /** Bakış açısındaki oyuncu büyük hasar yedi: ekran kenarı kırmızı flaş. */
  edgeFlash: boolean;
}

/** Bir aksiyonun olay yığınından görsel efektleri türetir. Saf; kural kararı vermez. */
export function fxFor(events: readonly BattleEvent[], me: PlayerIndex = 0): FxResult {
  let cardDamage = 0;
  let toMe = 0;
  const hitTargets: PlayerIndex[] = [];
  const pops: Pop[] = [];
  const callouts: string[] = [];
  for (const e of events) {
    if (e.type === 'DAMAGE_DEALT') {
      // Sarsıntı ve hitstop yalnız oyuncu kartlarının hasarına bağlı (Arena/Yorgunluk/Zehir hariç).
      if (typeof e.source === 'number') cardDamage += e.amount;
      if (e.target === me) toMe += e.amount;
      pops.push({ target: e.target, amount: e.amount });
      if (e.amount > 0 && !hitTargets.includes(e.target)) hitTargets.push(e.target);
    } else if (e.type === 'CRIT_USED') {
      callouts.push('KRİTİK!');
    } else if (e.type === 'EVADED') {
      callouts.push('KAÇINDI!');
    } else if (e.type === 'STRENGTH_USED' && e.multiplier > 1 && e.amount >= 1) {
      callouts.push('KOMBO!');
    }
  }
  let shakePx = 0;
  if (cardDamage >= FX.shakeBigAt) shakePx = FX.shakeBigPx;
  else if (cardDamage >= FX.shakeAt) shakePx = FX.shakePx;
  return {
    hitstop: cardDamage >= FX.hitstopAt,
    shakePx,
    hitTargets,
    pops,
    callouts,
    edgeFlash: toMe >= FX.edgeFlashAt,
  };
}
