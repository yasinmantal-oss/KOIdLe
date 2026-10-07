import type { BattleState, PlayerIndex, PlayerState } from '@koidle/rules';
import type { Weights } from './types';

export const WIN_SCORE = 1_000_000;

/**
 * Statü değeri (sahibi için, kendi tarafında artı): Güç = değer kadar ek hasar; Zayıflık = değer × kalan tur;
 * Zehir = kalan toplam hasar (her tur `decay` azalarak); Kritik/Kaçınma = profildeki sabit puan.
 * Zayıflık ve Zehir sahibi için kötüdür.
 */
function statusScore(state: BattleState, p: PlayerState, w: Weights): number {
  const { poison } = state.config.statuses;
  let score = 0;
  for (const s of p.statuses) {
    switch (s.id) {
      case 'strength':
        score += s.amount;
        break;
      case 'weak':
        score -= s.amount * (s.turnsLeft ?? 1);
        break;
      case 'poison':
        for (let left = s.amount; left > 0; left -= poison.decay) score -= left;
        break;
      case 'critical':
        score += w.criticalValue;
        break;
      case 'evade':
        score += w.evadeValue;
        break;
      case 'freeze':
        // Donma sahibi için kötüdür: Mage'in Ateş kartları bonus alır ve Donma'yı tüketir.
        score -= w.freezeValue;
        break;
      default:
        // Yeni statü eklenip burada ele alınmazsa derleme hatası verir.
        throw new Error(`Beklenmeyen statü: ${s.id satisfies never}`);
    }
  }
  return score;
}

/** Durum skoru (yüksek = AI için iyi). AI skoru kural değildir; float olabilir. */
export function evaluate(state: BattleState, me: PlayerIndex, w: Weights): number {
  if (state.result) {
    if (state.result.winner === null) return 0;
    return state.result.winner === me ? WIN_SCORE : -WIN_SCORE;
  }
  const mine = state.players[me];
  const theirs = state.players[me === 0 ? 1 : 0];
  // O an oynanırsa boşa gidecek iyileşme: tam HP'de heal kartı oynamak "ölü kart"dır.
  // (Elde duran heal cezalandırılmaz; yalnız boşa harcanan iyileşme ceza alır.)
  const missing = Math.max(0, mine.maxHp - mine.hp);
  return (
    // Alınan toplam hasar: maks HP azaltma (Parasite) bu terimi KÜÇÜLTMEZ, hasar gibi sayılır.
    w.enemyDamage * theirs.damageTaken -
    w.selfDamage * mine.damageTaken +
    w.shield * mine.shield -
    w.enemyShield * theirs.shield +
    w.status * (statusScore(state, mine, w) - statusScore(state, theirs, w)) +
    w.hand * mine.hand.length -
    w.wastedHeal * missing
  );
}
