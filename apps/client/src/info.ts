import type { BattleConfig, StatusId } from '@koidle/rules';

export type InfoKey =
  | 'hp'
  | 'mp'
  | 'hand'
  | 'deck'
  | 'discard'
  | 'reshuffle'
  | 'fatigue'
  | 'shield'
  | `status:${StatusId}`;

/** Savaş etiketlerinin açıklamaları. Sayılar config'den gelir, elle yazılmaz. */
export function infoText(key: InfoKey, c: BattleConfig): string {
  const s = c.statuses;
  switch (key) {
    case 'hp':
      return 'Can. 0 olan kaybeder.';
    case 'mp':
      return `Kart oynama gücü. Her turun başında dolar ve ${c.mp.perTurn} artar, en fazla ${c.mp.max}. Kullanılmayan MP devretmez.`;
    case 'hand':
      return `Elindeki kartlar. En fazla ${c.hand.limit}; taşan kart yanar.`;
    case 'deck':
      return `Henüz çekilmemiş kartlar (sıra gizli). Her tur ${c.hand.drawPerTurn} kart çekilir.`;
    case 'discard':
      return `Oynanan ve yanan kartlar. Deste bitince ıskarta karıştırılıp yeni deste olur (savaş başına ${c.deck.reshuffles} kez).`;
    case 'reshuffle':
      return `Kalan karıştırma hakkı. Deste bitince ıskarta karıştırılır; hak bittiyse çekemediğin her kart Yorgunluk hasarı verir.`;
    case 'fatigue':
      return `Deste ve karıştırma hakkı bitince, çekemediğin her kart için hasar: ${c.fatigue.start}, ${c.fatigue.start + c.fatigue.step}, ${c.fatigue.start + 2 * c.fatigue.step}… Kalkanı yok sayar. "Sıradaki" bir sonraki hasardır.`;
    case 'shield':
      return c.shield.persistence === 'resetOnOwnTurnStart'
        ? 'Hasarı HP’den önce emer. Kullanılmayan Kalkan sahibinin sonraki turunun başında sıfırlanır.'
        : 'Hasarı HP’den önce emer ve birikir.';
    case 'status:strength':
      return `Güç: sonraki hasar veren kartının ilk vuruşu Güç kadar fazla vurur, sonra biter. Toplanır, en fazla ${s.strength.max}.`;
    case 'status:weak':
      return `Zayıflık: verdiğin kart hasarı Zayıflık kadar azalır. ${s.weak.duration} tur sürer.`;
    case 'status:poison':
      return `Zehir: sahibinin her tur başında Zehir kadar hasar (Kalkanı yok sayar), sonra ${s.poison.decay} azalır. Toplanır, en fazla ${s.poison.max}.`;
    case 'status:critical':
      return 'Kritik: sonraki hasar veren kartının her vuruşu iki kat vurur. Bir kez kullanılır.';
    case 'status:evade':
      return 'Kaçınma: rakibin sonraki hasar veren kartının ilk vuruşu 0 hasar verir. Kullanılmazsa sonraki turunda biter.';
    case 'status:freeze':
      return `Donma: tek başına hasar vermez; ${s.freeze.duration} tur sürer. Rakip Donmuşken Ateş kartları bonus hasar verir ve Donma'yı tüketir.`;
    default:
      // Yeni anahtar eklenip burada ele alınmazsa derleme hatası verir.
      throw new Error(`Bilinmeyen bilgi anahtarı: ${key satisfies never}`);
  }
}
