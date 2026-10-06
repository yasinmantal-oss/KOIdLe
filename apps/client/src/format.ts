import type { BattleConfig, BattleEvent, CardDef, PlayerIndex, StatusId } from '@koidle/rules';

// Olayları Türkçe kayıt satırına çevirir. Oyuncu her zaman 0, AI 1. UI kural kararı vermez.

export const HUMAN: PlayerIndex = 0;

const who = (p: PlayerIndex) => (p === HUMAN ? 'Sen' : 'Rakip');
const whose = (p: PlayerIndex) => (p === HUMAN ? 'Sana' : 'Rakibe');
export const STATUS_TR: Record<StatusId, string> = { strength: 'Güç', weak: 'Zayıflık' };

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
      return `${whose(e.target)} ${e.amount} hasar${absorbed}.`;
    }
    case 'SHIELD_GAINED':
      return `${who(e.player)}: +${e.amount} Kalkan.`;
    case 'HEALED':
      return `${who(e.player)}: ${e.amount} HP iyileşti.`;
    case 'STATUS_APPLIED':
      return `${who(e.player)}: ${STATUS_TR[e.status]} ${e.amount} (${e.duration} tur).`;
    case 'STATUS_IGNORED':
      return `${who(e.player)}: ${STATUS_TR[e.status]} ${e.amount} etkisiz (daha güçlüsü aktif).`;
    case 'STATUS_EXPIRED':
      return `${who(e.player)}: ${STATUS_TR[e.status]} sona erdi.`;
    case 'TURN_ENDED':
      return null;
    case 'BATTLE_ENDED':
      if (e.winner === null) return `Berabere (${END_TR[e.reason]}).`;
      return `${e.winner === HUMAN ? 'Kazandın' : 'Kaybettin'} (${END_TR[e.reason]}, ${e.round}. raunt).`;
  }
}

export type Keyword = 'strength' | 'weak' | 'shield';
export interface TextPart {
  text: string;
  kw: Keyword | null;
}

const KEYWORDS: [RegExp, Keyword][] = [
  [/^Güç/, 'strength'],
  [/^Zayıf/, 'weak'],
  [/^Kalkan/, 'shield'],
];

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
  const shield =
    c.shield.persistence === 'resetOnOwnTurnStart'
      ? 'Kalkan: hasarı HP’den önce emer. Kullanılmayan Kalkan senin bir sonraki turunun başında sıfırlanır.'
      : 'Kalkan: hasarı HP’den önce emer ve birikir.';
  return [
    `MP: her turun başında dolar ve 1 artar, en fazla ${c.mp.max}. Kullanılmayan MP devretmez.`,
    'Güç X: saldırıların X fazla hasar verir. Zayıf X: saldırıların X az hasar verir.',
    shield,
    `Arena Çöküşü: ${c.arenaCollapse.startRound}. rauntan itibaren iki taraf her tur başında artan hasar alır (${c.arenaCollapse.start}, ${c.arenaCollapse.start + c.arenaCollapse.step}, …); Kalkanı yok sayar.`,
    `Deste bitince ıskarta ${c.deck.reshuffles} kez karıştırılır. Sonra çekemediğin her kart için Yorgunluk hasarı alırsın (${c.fatigue.start}, ${c.fatigue.start + c.fatigue.step}, …).`,
  ];
}
