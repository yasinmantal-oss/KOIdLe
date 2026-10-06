import type { BattleConfig, CardDef, CardType } from '@koidle/rules';
import type { AiProfiles } from './schema';

// docs/savas-degerleri.md üreticisi. Tek kaynak content/ JSON'larıdır (C2); bu dosya yalnız görünüm.

type Row = [label: string, key: string, value: unknown, meaning: string];

const fmt = (v: unknown): string => (typeof v === 'boolean' ? (v ? 'evet' : 'hayır') : String(v));

const TYPE_TR: Record<CardType, string> = {
  attack: 'Attack',
  skill: 'Skill',
  defense: 'Defense',
  heal: 'Heal',
  buff: 'Buff',
  debuff: 'Debuff',
};

function series(start: number, step: number, n = 4): string {
  return Array.from({ length: n }, (_, i) => start + i * step).join(', ');
}

function rows(c: BattleConfig): Row[] {
  const a = c.arenaCollapse;
  return [
    ['Kahraman HP', 'hero.hp', c.hero.hp, 'Başlangıç ve maks HP'],
    ['MP başlangıcı', 'mp.start', c.mp.start, 'Kendi 1. turundaki maks MP'],
    ['MP artışı', 'mp.perTurn', c.mp.perTurn, 'Her kendi turunda maks MP artışı'],
    ['MP tavanı', 'mp.max', c.mp.max, 'MP her tur başında dolar, devretmez'],
    ['Başlangıç eli', 'hand.starting', c.hand.starting, 'İki oyuncu için'],
    ['El sınırı', 'hand.limit', c.hand.limit, 'Dolu ele gelen kart yanar (ıskartaya gider)'],
    ['Tur başı çekiş', 'hand.drawPerTurn', c.hand.drawPerTurn, ''],
    [
      'İlk oyuncu ilk çekişi atlar',
      'hand.firstPlayerSkipsFirstDraw',
      c.hand.firstPlayerSkipsFirstDraw,
      'K3',
    ],
    ['Deste boyutu', 'deck.size', c.deck.size, 'Faz 1: Warrior havuzundaki her karttan birer tane'],
    [
      'Karıştırma hakkı',
      'deck.reshuffles',
      c.deck.reshuffles,
      'Deste bitince ıskarta karıştırılır. Iskarta boşsa hak harcanmaz (N4)',
    ],
    [
      'Yorgunluk başlangıcı',
      'fatigue.start',
      c.fatigue.start,
      'Hak bittikten sonra boş desteden çekiş',
    ],
    [
      'Yorgunluk artışı',
      'fatigue.step',
      c.fatigue.step,
      `Hasar dizisi: ${series(c.fatigue.start, c.fatigue.step)}…`,
    ],
    ['Yorgunluk Kalkanı yok sayar', 'fatigue.ignoresShield', c.fatigue.ignoresShield, 'N1'],
    [
      'Kalkan davranışı',
      'shield.persistence',
      c.shield.persistence,
      'K1. resetOnOwnTurnStart: kullanılmayan Kalkan sahibinin sonraki tur başında 0 olur. Alternatif: persistent',
    ],
    [
      'Arena Çöküşü başlangıcı',
      'arenaCollapse.startRound',
      a.startRound,
      'Bu rauntan itibaren her oyuncu kendi tur başında hasar alır',
    ],
    ['Arena ilk hasar', 'arenaCollapse.start', a.start, ''],
    [
      'Arena artışı',
      'arenaCollapse.step',
      a.step,
      `${a.startRound}. rauntan itibaren: ${series(a.start, a.step)}…`,
    ],
    ['Arena Kalkanı yok sayar', 'arenaCollapse.ignoresShield', a.ignoresShield, ''],
    [
      'Statü yığılması',
      'statuses.stacking',
      c.statuses.stacking,
      'K7. Gelen değer ≥ mevcut: değer güncellenir, süre yenilenir. Küçükse yok sayılır',
    ],
    [
      'Statü sayacı',
      'statuses.tickOn',
      c.statuses.tickOn,
      'Süre, etkilenen kahramanın kendi tur sonunda 1 düşer',
    ],
    [
      'Güç süresi',
      'statuses.strength.duration',
      c.statuses.strength.duration,
      `Kendine verilince: verildiği tur dahil ${c.statuses.strength.duration} kendi turu`,
    ],
    [
      'Zayıflık süresi',
      'statuses.weak.duration',
      c.statuses.weak.duration,
      `Rakibe verilince: rakibin sonraki ${c.statuses.weak.duration} turu`,
    ],
    [
      'Güvenlik tavanı',
      'roundCap',
      c.roundCap,
      'Bu raunt biterse berabere. Normalde tetiklenmemeli',
    ],
  ];
}

function mpCurve(c: BattleConfig): string {
  return Array.from({ length: 10 }, (_, i) =>
    Math.min(c.mp.start + i * c.mp.perTurn, c.mp.max),
  ).join(', ');
}

function countBy<T>(items: T[], key: (t: T) => string | number): string {
  const m: Record<string, number> = {};
  for (const it of items) m[String(key(it))] = (m[String(key(it))] ?? 0) + 1;
  return Object.entries(m)
    .map(([k, n]) => `${k} ×${n}`)
    .join(' · ');
}

export function renderValuesTable(config: BattleConfig, cards: CardDef[], ai: AiProfiles): string {
  const out: string[] = [];
  out.push('# Savaş Değerleri (Faz 1 · Gate 1)');
  out.push('');
  out.push(
    '> **Bu dosya üretilir, elle düzenlenmez.** Tek kaynak: `content/battle-config.json`, `content/cards/warrior.json`, `content/ai-profiles.json` (C2).',
  );
  out.push(
    "> Değer değiştirmek için JSON'u düzenle, sonra `pnpm values` çalıştır. JSON'la uyuşmazsa test kırılır.",
  );
  out.push('> Doğru denge değil, başlangıç değerleri. Denge önerileri bu tablo üzerinden yapılır.');
  out.push('');
  out.push('## 1. Kurallar');
  out.push('');
  out.push('| Alan | Config anahtarı | Değer | Anlamı |');
  out.push('|---|---|---|---|');
  for (const [label, key, value, meaning] of rows(config)) {
    out.push(`| ${label} | \`${key}\` | ${fmt(value)} | ${meaning} |`);
  }
  out.push('');
  out.push(
    '**Raunt:** iki oyuncunun da birer tur oynaması. Raunt, ilk oyuncunun turu başlarken artar.',
  );
  out.push('');
  out.push(
    '**Tur başı sırası (N3, C1):** tur başlar → Kalkan sıfırlanır → maks MP ve MP → Arena hasarı → kart çekme (gerekirse karıştırma veya Yorgunluk). Her sistem hasarından sonra savaş bitti mi bakılır; Arena öldürürse çekme olmaz.',
  );
  out.push('');
  out.push('### Formüller (hepsi tamsayı)');
  out.push('');
  out.push(
    `- Maks MP (kendi N. turu) = \`min(mp.start + (N − 1) × mp.perTurn, mp.max)\` → ${mpCurve(config)}`,
  );
  out.push('- Arena hasarı (raunt R ≥ startRound) = `start + (R − startRound) × step`');
  out.push('- Yorgunluk (oyuncunun k. yorgunluğu) = `start + (k − 1) × step`');
  out.push(
    "- Kart hasarı = `max(0, kart değeri + Güç − Zayıflık)`. Önce Kalkan emer, kalanı HP'den düşer (Kalkanı yok sayan kartlar hariç).",
  );
  out.push("- İyileşme maks HP'yi geçmez. Kalkan iyileşme sayılmaz.");
  out.push('');
  out.push(`## 2. Warrior kartları (${cards.length})`);
  out.push('');
  out.push('| id | Ad | Tür | MP | Etki |');
  out.push('|---|---|---|---|---|');
  for (const c of cards) {
    out.push(`| \`${c.id}\` | ${c.name} | ${TYPE_TR[c.type]} | ${c.cost} | ${c.text} |`);
  }
  out.push('');
  out.push(
    `Maliyet dağılımı: ${countBy(
      [...cards].sort((a, b) => a.cost - b.cost),
      (c) => `${c.cost} MP`,
    )}.`,
  );
  out.push(`Kart türleri: ${countBy(cards, (c) => TYPE_TR[c.type])}.`);
  out.push('');
  out.push(
    'Gözlem listesi (C3, C4): Siper + Kalkan Darbesi, Yarıp Geç ve Yıkım. Gate 1 ve simülasyonda izlenir; şimdilik değer değişikliği yok.',
  );
  out.push('');
  out.push('## 3. AI profilleri (AI ayarı, kural değeri değil)');
  out.push('');
  out.push('Skor = ağırlık × ölçüt toplamı. AI gizli bilgiyi görmez (rakibin eli, deste sırası).');
  out.push('');
  out.push('| Profil | Rakibe hasar | Kendi hasarı | Kalkan | Rakip Kalkanı | Statü | El |');
  out.push('|---|---|---|---|---|---|---|');
  const names = { aggressive: 'saldırgan', balanced: 'dengeli', defensive: 'savunmacı' } as const;
  for (const key of ['aggressive', 'balanced', 'defensive'] as const) {
    const w = ai[key];
    out.push(
      `| ${key} (${names[key]}) | ${w.enemyDamage} | ${w.selfDamage} | ${w.shield} | ${w.enemyShield} | ${w.status} | ${w.hand} |`,
    );
  }
  out.push('');
  return out.join('\n');
}
