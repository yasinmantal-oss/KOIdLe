import type { BattleConfig, BattleEvent, CardDef, PlayerIndex, StatusId } from '@koidle/rules';

// Olayları Türkçe kayıt satırına çevirir. Oyuncu her zaman 0, AI 1. UI kural kararı vermez.

export const HUMAN: PlayerIndex = 0;

const who = (p: PlayerIndex) => (p === HUMAN ? 'Sen' : 'Rakip');
const whose = (p: PlayerIndex) => (p === HUMAN ? 'Sana' : 'Rakibe');
export const STATUS_TR: Record<StatusId, string> = {
  strength: 'Güç',
  weak: 'Zayıflık',
  poison: 'Zehir',
  critical: 'Kritik',
  evade: 'Kaçınma',
  freeze: 'Donma',
};

/** Statü etiketi: Kritik/Kaçınma/Donma tek seferlik ya da değersizdir, değeri yazılmaz. */
export function statusLabel(id: StatusId, amount: number): string {
  return id === 'critical' || id === 'evade' || id === 'freeze'
    ? STATUS_TR[id]
    : `${STATUS_TR[id]} ${amount}`;
}

const END_TR = {
  normalDamage: 'kart hasarı',
  fatigue: 'Yorgunluk',
  arenaCollapse: 'Arena Çöküşü',
  roundCap: 'raunt tavanı',
} as const;

export function formatEvent(e: BattleEvent, cards: Record<string, CardDef>): string | null {
  const name = (id: string) => cards[id]?.name ?? id;
  switch (e.type) {
    case 'BATTLE_STARTED':
      return `Savaş başladı (seed ${e.seed}). İlk oynayan: ${who(e.firstPlayer)}.`;
    case 'TURN_STARTED':
      return `— ${e.round}. raunt · ${who(e.player)} sırası · ${e.maxMp} MP —`;
    case 'SHIELD_EXPIRED':
      return `${who(e.player)}: kullanılmayan ${e.amount} Kalkan sıfırlandı.`;
    case 'CARD_DRAWN':
      return e.player === HUMAN ? `Çektin: ${name(e.cardId)}.` : 'Rakip bir kart çekti.';
    case 'CARD_BURNED':
      return `${who(e.player)}: el dolu, ${name(e.cardId)} yandı.`;
    case 'DECK_RESHUFFLED':
      return `${who(e.player)}: deste bitti, ıskarta karıştırıldı (${e.count} kart, kalan hak ${e.reshufflesLeft}).`;
    case 'CARD_PLAYED':
      return `${who(e.player)} oynadı: ${name(e.cardId)} (${e.cost} MP).`;
    case 'DAMAGE_DEALT': {
      const absorbed = e.absorbed > 0 ? ` (${e.absorbed}'i Kalkan'a)` : '';
      if (e.source === 'arena') return `Arena çöküyor: ${whose(e.target)} ${e.amount} hasar.`;
      if (e.source === 'fatigue') return `Yorgunluk: ${whose(e.target)} ${e.amount} hasar.`;
      if (e.source === 'poison') return `Zehir: ${whose(e.target)} ${e.amount} hasar.`;
      if (e.source === e.target) return `${who(e.target)} kendine ${e.amount} hasar verdi.`;
      return `${whose(e.target)} ${e.amount} hasar${absorbed}.`;
    }
    case 'SHIELD_GAINED':
      return `${who(e.player)}: +${e.amount} Kalkan.`;
    case 'HEALED':
      return `${who(e.player)}: ${e.amount} HP iyileşti.`;
    case 'STATUS_APPLIED':
      return `${who(e.player)}: ${statusLabel(e.status, e.amount)}${
        e.duration === null ? '' : ` (${e.duration} tur)`
      }.`;
    case 'STATUS_IGNORED':
      return `${who(e.player)}: ${statusLabel(e.status, e.amount)} etkisiz (daha güçlüsü aktif).`;
    case 'STATUS_CONSUMED':
      // Şu an yalnız Ateş Donma'yı tüketiyor; olay tipi genele açık, not yalnız Donma'da düşülür.
      return `${who(e.player)}: ${STATUS_TR[e.status]} tükendi${
        e.status === 'freeze' ? ' (Ateş kombosu)' : ''
      }.`;
    case 'MAX_HP_REDUCED':
      return `${who(e.player)}: maks HP ${e.amount} azaldı (yeni maks ${e.maxHp}).`;
    case 'STATUS_EXPIRED':
      return `${who(e.player)}: ${STATUS_TR[e.status]} sona erdi.`;
    case 'STRENGTH_USED':
      return e.multiplier > 1
        ? `Güç iki kat sayıldı: ilk vuruşa +${e.amount} hasar.`
        : `Güç: ilk vuruşa +${e.amount} hasar.`;
    case 'CRIT_USED':
      return `${who(e.player)}: Kritik! Kartın her vuruşu iki kat.`;
    case 'EVADED':
      return `${who(e.player)}: Kaçınma! ${who(e.attacker)} kartının ilk vuruşu 0 hasar verdi.`;
    case 'TURN_ENDED':
      return null;
    case 'BATTLE_ENDED':
      if (e.winner === null) return `Berabere (${END_TR[e.reason]}).`;
      return `${e.winner === HUMAN ? 'Kazandın' : 'Kaybettin'} (${END_TR[e.reason]}, ${e.round}. raunt).`;
    default:
      // Yeni olay eklenip burada ele alınmazsa derleme hatası verir.
      throw new Error(`Bilinmeyen olay: ${e satisfies never}`);
  }
}

export type Keyword = 'strength' | 'weak' | 'shield' | 'poison' | 'critical' | 'evade' | 'freeze';
export interface TextPart {
  text: string;
  kw: Keyword | null;
}

const KEYWORDS: [RegExp, Keyword][] = [
  [/^Güç/, 'strength'],
  [/^Zayıf/, 'weak'],
  [/^Kalkan/, 'shield'],
  [/^Zehir/, 'poison'],
  [/^Kritik/, 'critical'],
  [/^Kaçınma/, 'evade'],
  [/^Donma/, 'freeze'],
];

/** Kartın metninde geçen anahtar kelimeler (sırayla, tekrarsız). */
export function keywordsIn(text: string): Keyword[] {
  const out: Keyword[] = [];
  for (const p of keywordParts(text)) if (p.kw && !out.includes(p.kw)) out.push(p.kw);
  return out;
}

/** Kartın altındaki tek satırlık sözlük; sayılar config'den gelir. Anahtar kelime yoksa null. */
export function glossaryLine(text: string, c: BattleConfig): string | null {
  const s = c.statuses;
  const defs: Record<Keyword, string> = {
    strength: 'Güç: sonraki hasar kartının ilk vuruşuna eklenir, sonra biter',
    critical: 'Kritik: sonraki hasar kartın her vuruşu 2 kat',
    evade: 'Kaçınma: rakibin sonraki kartının ilk vuruşu 0 hasar verir',
    weak: `Zayıflık: kart hasarın X azalır (${s.weak.duration} tur)`,
    poison: `Zehir: her tur başında X hasar (Kalkanı yok sayar), sonra ${s.poison.decay} azalır`,
    shield: "Kalkan: hasarı HP'den önce emer",
    freeze: `Donma: tek başına etkisi yok; Ateş kartı bonus alır ve Donma'yı tüketir (${s.freeze.duration} tur)`,
  };
  const kws = keywordsIn(text);
  return kws.length === 0 ? null : `${kws.map((k) => defs[k]).join(' · ')}.`;
}

/** Kart metnindeki anahtar kelimeleri işaretler; renkler statü rozetleriyle aynı (Combat v0.2 E). */
export function keywordParts(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let plain = '';
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    const hit = KEYWORDS.find(([re]) => re.test(rest));
    if (hit) {
      if (plain) parts.push({ text: plain, kw: null });
      plain = '';
      const word = (rest.match(hit[0]) as RegExpMatchArray)[0];
      parts.push({ text: word, kw: hit[1] });
      i += word.length;
    } else {
      plain += text[i];
      i += 1;
    }
  }
  if (plain) parts.push({ text: plain, kw: null });
  return parts;
}

/** "?" kural özeti: değerler config'den gelir, metin elle tekrar yazılmaz. */
export function rulesSummary(c: BattleConfig): string[] {
  const s = c.statuses;
  const shield =
    c.shield.persistence === 'resetOnOwnTurnStart'
      ? 'Kalkan: hasarı HP’den önce emer. Kullanılmayan Kalkan senin bir sonraki turunun başında sıfırlanır.'
      : 'Kalkan: hasarı HP’den önce emer ve birikir.';
  return [
    `MP: her turun başında dolar ve 1 artar, en fazla ${c.mp.max}. Kullanılmayan MP devretmez.`,
    `Güç X: sonraki hasar veren kartının ilk vuruşu X fazla vurur, sonra Güç biter (toplanır, en fazla ${s.strength.max}). Zayıflık X: kart hasarın X azalır (${s.weak.duration} tur).`,
    shield,
    ...(c.arenaCollapse.enabled
      ? [
          `Arena Çöküşü: ${c.arenaCollapse.startRound}. rauntan itibaren iki taraf her tur başında artan hasar alır (${c.arenaCollapse.start}, ${c.arenaCollapse.start + c.arenaCollapse.step}, …); Kalkanı yok sayar.`,
        ]
      : []),
    `Deste bitince ıskarta ${c.deck.reshuffles} kez karıştırılır. Sonra çekemediğin her kart için Yorgunluk hasarı alırsın (${c.fatigue.start}, ${c.fatigue.start + c.fatigue.step}, …).`,
    `Zehir X: sahibinin her tur başında X hasar (Kalkanı yok sayar), sonra ${s.poison.decay} azalır; toplanır, en fazla ${s.poison.max}.`,
    'Kritik: sonraki hasar veren kartın her vuruşu iki kat vurur (Güç ve Zayıflık sonrası, Kalkandan önce). Kaçınma: rakibin sonraki hasar veren kartının ilk vuruşu 0 hasar verir; kullanılmazsa sonraki turunda biter.',
    `Donma X: tek başına etkisi yoktur, ${s.freeze.duration} tur sürer (süre yenilenir). Rakip Donmuşken Mage'in Ateş kartları bonus hasar verir ve Donma'yı tüketir.`,
    `Parasite: rakibin maks HP'si kalıcı azalır (iyileşmeyle geri gelmez); taşan iyileşme Priest'te Kalkan olur. Judgement, rakipteki olumsuz statü (Zayıflık, Zehir, Donma) başına bonus kazanır.`,
    '"Bu tur oynanan kart" sayacı Turu Bitir’in yanında.',
    `Ağır kartlar (★): destede en fazla ${c.deckBuilding.maxHeavy}.${
      c.hand.openingGuarantee
        ? ` Açılış elinde Ağır kart gelmez, en az bir ${c.mp.start} MP'lik kart gelir.`
        : ''
    }`,
  ];
}
