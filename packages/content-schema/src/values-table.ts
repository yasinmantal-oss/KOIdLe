import { type BattleConfig, type CardDef, type CardType, isHeavy } from '@koidle/rules';
import { ARCHETYPE_IDS, ARCHETYPES, type ArchetypeId } from './archetypes';
import { deckStats } from './deck';
import type { AiPlanner, AiProfiles } from './schema';

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
    [
      'İkinci oyuncu 1. tur MP bonusu',
      'mp.secondPlayerFirstTurnBonus',
      c.mp.secondPlayerFirstTurnBonus,
      'Yalnız ikinci oyuncunun kendi 1. turunda maks MP’ye eklenir. 2026-10-07: 0 (telafi artık ekstra kart)',
    ],
    ['Başlangıç eli', 'hand.starting', c.hand.starting, 'İki oyuncu için'],
    ['El sınırı', 'hand.limit', c.hand.limit, 'Dolu ele gelen kart yanar (ıskartaya gider)'],
    ['Tur başı çekiş', 'hand.drawPerTurn', c.hand.drawPerTurn, ''],
    [
      'İlk oyuncu ilk çekişi atlar',
      'hand.firstPlayerSkipsFirstDraw',
      c.hand.firstPlayerSkipsFirstDraw,
      'K3',
    ],
    [
      'İkinci oyuncu 1. tur ekstra çekişi',
      'hand.secondPlayerFirstTurnExtraDraw',
      c.hand.secondPlayerFirstTurnExtraDraw,
      `İkinci oyuncu kendi 1. turunda ${c.hand.drawPerTurn} + bu kadar kart çeker (yalnız o tur); el sınırı ve Yorgunluk aynen geçerli`,
    ],
    [
      'Açılış eli garantisi',
      'hand.openingGuarantee',
      c.hand.openingGuarantee,
      `F2-7: başlangıç eline Ağır kart gelmez; elde en az bir ${c.mp.start} MP'lik kart olur`,
    ],
    [
      'Deste boyutu',
      'deck.size',
      c.deck.size,
      'Oyuncu tek kopyalık deste kurar (F2-4); havuz 15 karttır',
    ],
    [
      'Maks Ağır kart',
      'deckBuilding.maxHeavy',
      c.deckBuilding.maxHeavy,
      'F2-5: destede en fazla. Motor yok sayar; deste kurma, hazır desteler ve sim doğrular',
    ],
    [
      'Asgari açılış kartı',
      'deckBuilding.minOpeners',
      c.deckBuilding.minOpeners,
      `F2-6: destede en az ${c.mp.start} MP'lik kart sayısı`,
    ],
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
      'Arena Çöküşü açık',
      'arenaCollapse.enabled',
      a.enabled,
      'Yasin kararı: kapalı. Maç Yorgunluk ve raunt sınırıyla biter. Kod yolu config için durur',
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
      'Zayıflık süresi',
      'statuses.weak.duration',
      c.statuses.weak.duration,
      `Rakibe verilince: rakibin sonraki ${c.statuses.weak.duration} turu. K7: gelen değer ≥ mevcut ise yenilenir, küçükse yok sayılır; süre sahibinin tur sonunda 1 düşer`,
    ],
    [
      'Güç üst sınırı',
      'statuses.strength.max',
      c.statuses.strength.max,
      'Toplanır, bu değerde kesilir. Süresi yok; ilk hasar veren kartın ilk vuruşunda tamamı harcanır',
    ],
    [
      'Zehir üst sınırı',
      'statuses.poison.max',
      c.statuses.poison.max,
      'Toplanır, bu değerde kesilir',
    ],
    [
      'Zehir azalması',
      'statuses.poison.decay',
      c.statuses.poison.decay,
      'Sahibinin tur başında değer kadar hasar (Kalkanı yok sayar), sonra değer bu kadar azalır; ≤ 0 olunca kalkar',
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

const SECTIONS: { title: string; keep: (c: CardDef) => boolean }[] = [
  { title: 'Ortak', keep: (c) => c.job === 'common' },
  { title: 'Warrior', keep: (c) => c.job === 'warrior' },
  { title: 'Rogue ortak', keep: (c) => c.job === 'rogue' && c.branch === undefined },
  { title: 'Rogue · Asas', keep: (c) => c.branch === 'assassin' },
  { title: 'Rogue · Okçu', keep: (c) => c.branch === 'archer' },
];

const cardName = (c: CardDef): string => `${isHeavy(c) ? '★ ' : ''}${c.name}`;

export function renderValuesTable(
  config: BattleConfig,
  cards: CardDef[],
  ai: AiProfiles,
  decks: Record<ArchetypeId, string[]>,
  planner: AiPlanner,
): string {
  const out: string[] = [];
  out.push('# Savaş Değerleri (Faz 2a)');
  out.push('');
  out.push(
    '> **Bu dosya üretilir, elle düzenlenmez.** Tek kaynak: `content/battle-config.json`, `content/cards/*.json`, `content/decks/*.json`, `content/ai-profiles.json` (C2).',
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
    '**Tur başı sırası (N3, C1):** tur başlar → Kaçınma düşer → Kalkan sıfırlanır → maks MP ve MP → Zehir hasarı → Arena hasarı → kart çekme (gerekirse karıştırma veya Yorgunluk). Her sistem hasarından sonra savaş bitti mi bakılır; Zehir ya da Arena öldürürse çekme olmaz.',
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
    "- Vuruş hasarı = `max(0, kart değeri + Güç × çarpan (yalnız kartın ilk vuruşunda) − Zayıflık) × (Kritik ? 2 : 1)`. Önce Kalkan emer, kalanı HP'den düşer (Kalkanı yok sayan kartlar hariç). Zayıflık her vuruşa uygulanır.",
  );
  out.push(
    "- Güç: sonraki hasar veren kartın **ilk vuruşuna** eklenir, sonra tamamı harcanır. Hell Blade Güç'ü iki kat sayar.",
  );
  out.push(
    '- Kritik: sonraki hasar veren kartın **her vuruşu** iki katı (Güç/Zayıflık sonrası, Kalkandan önce); sonra harcanır. Yalnız Critical Point verir.',
  );
  out.push(
    '- Kaçınma: rakibin sonraki hasar veren kartının **ilk vuruşu** 0 hasar verir ve harcanır; kullanılmazsa sahibinin sonraki turunun başında düşer. Zehir, Arena ve Yorgunluğu durdurmaz.',
  );
  out.push(
    "- MP kazanma: bu tur MP'yi (gerekirse maks MP'nin üstüne) artırır. Kendine hasar Kalkanı yok sayar.",
  );
  out.push("- İyileşme maks HP'yi geçmez. Kalkan iyileşme sayılmaz.");
  out.push('');
  out.push(`## 2. Kartlar (${cards.length})`);
  out.push('');
  out.push(
    `★ = Ağır kart (destede en fazla ${config.deckBuilding.maxHeavy}; açılış eline gelmez). Kart başına tek anahtar kelime (F2-8).`,
  );
  for (const section of SECTIONS) {
    const list = cards.filter(section.keep);
    out.push('');
    out.push(`### ${section.title} (${list.length})`);
    out.push('');
    out.push('| id | Ad | Tür | MP | Etki |');
    out.push('|---|---|---|---|---|');
    for (const c of list) {
      out.push(`| \`${c.id}\` | ${cardName(c)} | ${TYPE_TR[c.type]} | ${c.cost} | ${c.text} |`);
    }
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
    "Kart mekaniği KO'daki skill etkisine karşılık gelir (Revizyon 1, Yasin 2026-10-07). Gözlem listesi: Gain/Berserker → Hell Blade, Critical Point + büyük kart, Viper + Poison Arrow. Sim ve Yasin testinde izlenir.",
  );
  out.push('');
  out.push('## 3. Hazır desteler (önerilen deste = AI destesi)');
  out.push('');
  out.push(`| Deste | Kartlar | Ağır | ${config.mp.start} MP'lik |`);
  out.push('|---|---|---|---|');
  for (const id of ARCHETYPE_IDS) {
    const deck = decks[id];
    const stats = deckStats(deck, cards, config);
    const names = deck.map((cid) => cards.find((c) => c.id === cid)?.name ?? cid).join(', ');
    out.push(
      `| ${ARCHETYPES[id].name} | ${names} | ${stats.heavy}/${config.deckBuilding.maxHeavy} | ${stats.openers} (en az ${config.deckBuilding.minOpeners}) |`,
    );
  }
  out.push('');
  out.push('## 4. AI profilleri (AI ayarı, kural değeri değil)');
  out.push('');
  out.push('Skor = ağırlık × ölçüt toplamı. AI gizli bilgiyi görmez (rakibin eli, deste sırası).');
  out.push('');
  out.push(
    '| Profil | Rakibe hasar | Kendi hasarı | Kalkan | Rakip Kalkanı | Statü | El | Kritik değeri | Kaçınma değeri |',
  );
  out.push('|---|---|---|---|---|---|---|---|---|');
  const names = { aggressive: 'saldırgan', balanced: 'dengeli', defensive: 'savunmacı' } as const;
  for (const key of ['aggressive', 'balanced', 'defensive'] as const) {
    const w = ai[key];
    out.push(
      `| ${key} (${names[key]}) | ${w.enemyDamage} | ${w.selfDamage} | ${w.shield} | ${w.enemyShield} | ${w.status} | ${w.hand} | ${w.criticalValue} | ${w.evadeValue} |`,
    );
  }
  out.push('');
  out.push('## 5. AI tur planı (AI ayarı, kural değeri değil)');
  out.push('');
  out.push(
    `AI kendi turunda en fazla ${planner.depth} kart derinliğe, her seviyede en iyi ${planner.beam} adayı tutarak bakar (ışın araması); planın ilk aksiyonunu oynar, sonra yeniden planlar. Arama gizli bilgisi silinmiş görünümde yapılır.`,
  );
  out.push('');
  out.push('| Parametre | Dosya | Değer |');
  out.push('|---|---|---|');
  out.push(`| Derinlik | \`content/ai-planner.json\` \`depth\` | ${planner.depth} |`);
  out.push(`| Işın genişliği | \`content/ai-planner.json\` \`beam\` | ${planner.beam} |`);
  out.push('');
  return out.join('\n');
}
