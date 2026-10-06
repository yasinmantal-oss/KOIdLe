# KOIdLe — Faz 0–1 Uygulama Planı: Savaş Sandbox'ı (rev. 2)

> **Tarih:** 2026-10-06 · **Dayanak:** `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md` (onaylandı)
> **Hedef:** GATE 1 — *Warrior vs Warrior, Hero-vs-Hero kart savaşı tek başına eğlenceli mi?*
> **Kapsam:** P0.2 (test değerleri) + P1.1–P1.5. Karakter, item, farm, upgrade, backend **yok**.
> **rev. 2 (2026-10-06):** Yasin + Copilot kararları işlendi: K1 Kalkan tur başında sıfırlanır, K2 tek karıştırma + Yorgunluk, K7 süre kuralları, tek config dosyası, AI gizli bilgi görmez, `tools/sim` raporu, Gate 1 maç formu, çalışma düzeni ve durum raporu.

> **Claude için talimat:** Görevleri sırayla uygula. Her görev: önce test (kırmızı) → en küçük kod (yeşil) → `pnpm test && pnpm typecheck && pnpm lint` → commit → push. Bir görev bitmeden sonrakine geçme. Spec'teki ÇIKSIN listesinden ve §2'deki "Faz 1'de ekleme" listesinden hiçbir şey ekleme. Kural değerleri yalnız `content/battle-config.json` ve `content/cards/warrior.json` içinde durur; kodda sihirli sayı olmaz.

---

## 0. Kararlar

### 0.1 Yasin'in kararları (K1–K7)

| # | Konu | Karar | Durum |
|---|---|---|---|
| K1 | Kalkan | Hasarı HP'den önce emer. Kullanılmayan Kalkan **sahibinin bir sonraki tur başında sıfırlanır.** Aynı turdaki Kalkan etkileri toplanır. Kalkan HP değildir, iyileştirme sayılmaz. Config: `shield.persistence = "resetOnOwnTurnStart" \| "persistent"`. | Değişti (rev. 2) |
| K2 | Deste bitince | İlk bitişte ıskarta karıştırılıp yeni deste olur, **savaş başına 1 kez**. Sonra boş desteden çekmeye çalışmak artan **Yorgunluk** hasarı verir: 1, 2, 3… Arena Çöküşü ayrıca sürer. Config: `deck.reshuffles`, `fatigue.start`, `fatigue.step`. | Değişti (rev. 2) |
| K3 | İlk oyuncu | İki taraf 4 kartla başlar, ilk oyuncu kendi ilk turunda kart çekmez. Telafi yok. İlk oyuncu kazanma oranı simülasyonda ölçülür. | Onaylandı |
| K4 | Ekran | Sade React web arayüzü. Pixi, Harman görünümü ve animasyon yok. Savaşın tüm durumu okunur (bkz. Görev 12). | Onaylandı |
| K5 | Eşleşme | Gate 1 yalnız Warrior vs Warrior. | Onaylandı |
| K6 | Kahraman gücü | Yok. Gate 1 başarısız olursa denenecek kollardan biri; kendiliğinden eklenmez. | Onaylandı |
| K7 | Statüler | Yalnız Güç ve Zayıflık. Üst üste binmez: gelen değer **büyük veya eşitse** değer onunla değişir ve süre yenilenir; küçükse hiçbir şey olmaz. Süre config'de, sayaç etkilenen kahramanın **kendi tur sonunda** düşer. | Onaylandı |

### 0.2 Claude'un bu revizyonda verdiği küçük kararlar (Yasin/Copilot onayı istenir)

| # | Konu | Karar | Gerekçe |
|---|---|---|---|
| N1 | Yorgunluk ve Kalkan | Yorgunluk, Arena Çöküşü gibi **Kalkanı yok sayar** (config: `fatigue.ignoresShield`). | Kural hasarı oyuncu kararıyla engellenmemeli; bitirici işlevini korur. |
| N2 | Statü süresi nerede | Süre kartta değil, config'de statü başına (`statuses.strength.duration`). Kart yalnız değeri verir. | "Tüm kural değerleri tek config dosyasında" şartı. |
| N3 | Tur başı sırası | `TURN_STARTED` → Kalkan sıfırlanır → maks MP ve MP → Arena Çöküşü hasarı → kart çekme (gerekirse karıştırma/Yorgunluk). | Kayıtta okunaklı sıra; Arena ve Yorgunluk zaten Kalkanı yok saydığı için sonuç değişmez. |
| N4 | Boş ıskartada karıştırma | Deste boş, ıskarta da boşsa karıştırma hakkı **harcanmaz**, doğrudan Yorgunluk uygulanır. | Hakkın boşa gitmesi sürpriz bir ceza olurdu. |
| N5 | Simülasyon yeri | `tools/sim` paketi Faz 1'de açılır (spec bunu P2.2'de anıyordu). | Copilot'un istediği 900 maçlık rapor Gate 1 için şimdi lazım. Boş paket değil, bu fazın ihtiyacı. |
| N6 | Gate 1 formu nereye yazılır | `pnpm dev` sırasında yalnız geliştirme ortamında çalışan küçük bir Vite eklentisi formu `docs/gate-1/oturumlar.jsonl` dosyasına ekler. Ayrıca tarayıcıda yedek tutulur ve "JSON indir" düğmesi var. | Sonuçlar seed ile repo'da metin olarak durur; backend yok. |
| N7 | Okunabilir değer tablosu | `docs/savas-degerleri.md`, `pnpm values` komutuyla `content/` JSON'larından **üretilir**. Dosya JSON'la uyuşmazsa test kırılır. | Tek kaynak JSON, tek okunabilir tablo; ikisi asla ayrışmaz. |

### 0.3 Kart etkisi notu (K1 sonrası)
Kalkan tur başında sıfırlandığı için **Kalkan Darbesi** yalnız o tur içinde (ya da rakibin turundan artakalan değil, kendi turunda kazanılmış) Kalkanı sayar. Siper + Kalkan Darbesi = 4 MP'ye 7 Kalkan + 7 hasar. Bu kombinasyon simülasyonda izlenecek.

---

## 1. Çalışma düzeni

- **Claude:** tek uygulayıcı. Kod, test, commit, push.
- **Copilot:** bağımsız inceleyici. Yalnız Yasin'in ilettiği içeriği görür.
- **Yasin:** karar veren ve köprü.
- Copilot önerisi repo'daki gerçek durumla çelişirse Claude uygulamadan önce bunu yazar ve Yasin'e sorar.
- **DURUM RAPORU** (aşağıdaki şablon) şu noktalarda yazılır: Görev 1, Görev 8 (rules bitti), Görev 11 (sim raporu), Görev 13 (Gate 1'e hazır). Ham test/sim çıktıları raporun sonuna eklenir.

```
---------------- KOIdLe DURUM RAPORU ----------------
BRANCH:
SON COMMIT (hash + mesaj):
TAMAMLANAN GÖREVLER:
DEĞİŞEN/EKLENEN DOSYALAR (yol + 1 cümle açıklama):
ÇALIŞTIRILAN TESTLER VE SONUÇLARI:
SPEC/PLAN'DAN SAPMALAR (yoksa "Yok"):
VERDİĞİN YENİ KARARLAR (gerekçesiyle):
AÇIK SORULAR / RİSKLER:
COPILOT'UN İNCELEMESİ GEREKEN DOSYALAR:
SIRADAKİ GÖREV:
-----------------------------------------------------
```

---

## 2. Faz 1 kapsam disiplini

**Tek soru:** Warrior vs Warrior, Hero-vs-Hero kart savaşı eğlenceli mi?

**Faz 1'de ekleme:** item/ekipman, upgrade/örs, CZ, farm, merchant, diğer 3 job, hesap/auth, PostgreSQL, Colyseus, mobil, Electron, Pixi, premium, animasyon, ses, minion/çağırma, yeni savaş kaynağı, kahraman gücü, yeni statü.

Monorepo'da yalnız bu fazın kullandığı paketler açılır. "İleride lazım olur" klasörü yok.

---

## 3. Hedef dosya yapısı (Faz 1 sonu)

```
KOIdLe/
├─ package.json               # root scriptler: test, typecheck, lint, dev, sim, values
├─ pnpm-workspace.yaml        # packages/*, apps/*, tools/*, content
├─ turbo.json
├─ tsconfig.base.json         # strict ayarlar
├─ biome.json
├─ content/                   # @koidle/content — yalnız JSON (tek kural kaynağı)
│  ├─ battle-config.json
│  └─ cards/warrior.json
├─ packages/
│  ├─ rules/                  # @koidle/rules — saf, deterministik, bağımlılıksız
│  │  ├─ src/                 # rng, clone, types, draw, status, effects, turn, battle, engine, legal
│  │  └─ test/replays/*.json  # golden replay dosyaları (metin)
│  ├─ content-schema/         # @koidle/content-schema — Zod, yükleyici, değer tablosu üretici
│  └─ ai/                     # @koidle/ai — skor tabanlı AI, gizli bilgiyi görmez
├─ tools/
│  └─ sim/                    # @koidle/sim — AI-vs-AI toplu simülasyon + rapor
├─ apps/
│  └─ client/                 # Vite + React savaş sandbox'ı + Gate 1 formu
├─ reports/sim/               # latest.md, latest.json, latest.csv
└─ docs/
   ├─ test-degerleri.md       # P0.2 (savaş dışı değerler + savaş tablosuna bağlantı)
   ├─ savas-degerleri.md      # TEK okunabilir savaş değer tablosu (üretilir)
   ├─ gate-1.md               # Gate 1 protokolü ve sonuç
   └─ gate-1/oturumlar.jsonl  # maç başı form kayıtları
```

**Bağımlılık yönü:** `rules` (hiçbir şeye bağımlı değil) ← `content-schema` (+ zod) ← `ai` (yalnız `rules`) ← `tools/sim`, `apps/client`.
**React ekranı silinse bile** `rules`, `content`, replay testleri, `ai` ve `tools/sim` aynen çalışır.

**Paketler build edilmez.** İç paketler `exports: "./src/index.ts"` ile TS kaynağı olarak tüketilir. Vite ve Vitest TS'i doğrudan çözer; `tools/sim` CLI'ı `tsx` ile çalışır; `typecheck` her pakette `tsc --noEmit`.

---

## 4. Savaş config şekli (`content/battle-config.json`)

```json
{
  "hero":          { "hp": 30 },
  "mp":            { "start": 1, "perTurn": 1, "max": 8 },
  "hand":          { "starting": 4, "limit": 8, "drawPerTurn": 1, "firstPlayerSkipsFirstDraw": true },
  "deck":          { "size": 12, "reshuffles": 1 },
  "fatigue":       { "start": 1, "step": 1, "ignoresShield": true },
  "shield":        { "persistence": "resetOnOwnTurnStart" },
  "arenaCollapse": { "startRound": 8, "start": 1, "step": 1, "ignoresShield": true },
  "statuses": {
    "stacking": "maxAmountRefreshOnGte",
    "tickOn": "ownerTurnEnd",
    "strength": { "duration": 2 },
    "weak":     { "duration": 2 }
  },
  "roundCap": 20
}
```

Formüller (hepsi tamsayı):
- Maks MP (kendi N. turu) = `min(mp.start + (N − 1) × mp.perTurn, mp.max)`
- Arena hasarı (raunt R ≥ startRound) = `start + (R − startRound) × step`
- Yorgunluk (oyuncunun k. yorgunluğu) = `start + (k − 1) × step`
- Kart hasarı = `max(0, kart değeri + Güç − Zayıflık)`
- `roundCap` raundu biterse berabere (güvenlik tavanı; normalde tetiklenmemeli).

---

## Görev 1 — P0.2 Test değerleri

**Dosyalar (yeni):** `docs/savas-degerleri.md`, `docs/test-degerleri.md`

1. `docs/savas-degerleri.md`: §4 config'inin ve 12 Warrior kartının okunabilir tablosu. Görev 9'da bu dosya `pnpm values` ile üretilir hale gelir; o zamana kadar elle tutulur ve **tek okunabilir kaynaktır**.
2. `docs/test-degerleri.md`: P0.2'nin savaş dışı kısımları (level/EXP, farm, drop, upgrade, baskın). Savaş için `savas-degerleri.md`'ye bağlantı verir, değerleri tekrar etmez. Bu değerler Faz 1'de koda girmez.
3. Commit: `docs: P0.2 test values (battle table + later-phase values)` → **DURUM RAPORU**.

---

## Görev 2 — P1.1 Monorepo iskeleti

**Dosyalar (yeni):** `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `biome.json`, `packages/rules/{package.json,tsconfig.json,tsconfig.test.json,src/index.ts,src/index.test.ts}`
**Dosyalar (güncelle):** `.gitignore` (`node_modules/`, `.turbo/`, `dist/`, `coverage/`), `CLAUDE.md` (komutlar)

1. Kurulumdan önce `pnpm view <paket> version` ile turbo, vitest, typescript, @biomejs/biome, fast-check güncel sürümlerini doğrula. `packageManager` alanını yaz.
2. `tsconfig.base.json`: `target ES2022`, `module ESNext`, `moduleResolution Bundler`, `lib ["ES2022"]`, `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `isolatedModules`, `resolveJsonModule`, `skipLibCheck`, `noEmit`.
3. `packages/rules/tsconfig.json`: yalnız `src/**/*.ts` (testler hariç), `"types": []` — Node/DOM globalleri sızmaz. `tsconfig.test.json`: testler, `"types": ["node"]`. `typecheck` ikisini de çalıştırır.
4. `packages/rules/package.json`: `dependencies` **boş**; devDependencies `vitest`, `typescript`, `fast-check`, `@types/node`.
5. Root scriptler: `test`, `typecheck` (turbo), `lint` (`biome check .`), `format`, `dev`.
6. Kırmızı/yeşil: `RULES_VERSION` testi.
7. `pnpm install && pnpm test && pnpm typecheck && pnpm lint` temiz.
8. `CLAUDE.md`'ye komutlar ve "`packages/rules` saftır" kuralı.
9. Commit: `chore: monorepo skeleton (pnpm, turbo, strict ts, vitest, biome)`

---

## Görev 3 — Seed'li RNG, klonlama, determinizm bekçisi

**Dosyalar:** `packages/rules/src/{rng.ts,rng.test.ts,clone.ts,determinism.test.ts}`

**Testler (önce):**
- Aynı seed → aynı `nextUint32` dizisi (ilk 5 değer golden).
- `rollInt(h, n)` her zaman `0 ≤ x < n`; 10.000 çekimde her kova görülür.
- `shuffle` aynı seed ile aynı sırayı verir, girdiyi değiştirmez, elemanları korur.
- `clone` derin kopya.
- **Bekçi:** `src/**/*.ts` (testler hariç) içinde `Math.random`, `Date.now`, `new Date(`, `performance.`, `process.`, `window.`, `document.`, `require(`, `new Map(`, `new Set(`, `parseFloat`, `toFixed` geçmez. Float yok kuralını ayrıca Görev 8'deki "tüm sayılar tamsayı" invariantı yakalar.

**Kod:**
```ts
// rng.ts — mulberry32. Durum tek bir uint32; BattleState içinde saklanır.
export interface RngHolder { rng: number }

export function nextUint32(h: RngHolder): number {
  h.rng = (h.rng + 0x6d2b79f5) >>> 0;
  let t = h.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return (t ^ (t >>> 14)) >>> 0;
}

export const rollInt = (h: RngHolder, maxExclusive: number): number => nextUint32(h) % maxExclusive;

export function shuffle<T>(h: RngHolder, items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = rollInt(h, i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

// clone.ts — state saf JSON olmak zorunda; bu, serileştirilebilirliği de garanti eder.
export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
```
Commit: `feat(rules): seeded rng, shuffle, clone, determinism guard`

---

## Görev 4 — Tipler

**Dosya:** `packages/rules/src/types.ts`

```ts
export type PlayerIndex = 0 | 1;
export type Job = 'warrior';
export type CardType = 'attack' | 'skill' | 'defense' | 'heal' | 'buff' | 'debuff';
export type StatusId = 'strength' | 'weak';

export type Effect =
  | { kind: 'damage'; amount: number; ignoreShield?: boolean }
  | { kind: 'damageFromShield' }
  | { kind: 'shield'; amount: number }
  | { kind: 'heal'; amount: number }
  | { kind: 'draw'; count: number }
  | { kind: 'applyStatus'; target: 'self' | 'enemy'; status: StatusId; amount: number };

export interface CardDef { id: string; name: string; job: Job; type: CardType; cost: number; effects: Effect[]; text: string }

export interface BattleConfig {
  hero: { hp: number };
  mp: { start: number; perTurn: number; max: number };
  hand: { starting: number; limit: number; drawPerTurn: number; firstPlayerSkipsFirstDraw: boolean };
  deck: { size: number; reshuffles: number };
  fatigue: { start: number; step: number; ignoresShield: boolean };
  shield: { persistence: 'resetOnOwnTurnStart' | 'persistent' };
  arenaCollapse: { startRound: number; start: number; step: number; ignoresShield: boolean };
  statuses: {
    stacking: 'maxAmountRefreshOnGte';
    tickOn: 'ownerTurnEnd';
    strength: { duration: number };
    weak: { duration: number };
  };
  roundCap: number;
}

export interface CardInstance { iid: string; cardId: string }
export interface Status { id: StatusId; amount: number; turnsLeft: number }

export interface PlayerState {
  name: string; hp: number; maxHp: number; mp: number; maxMp: number; shield: number;
  statuses: Status[]; deck: CardInstance[]; hand: CardInstance[]; discard: CardInstance[];
  turnsTaken: number; reshufflesLeft: number; fatigueCount: number;
}

export interface BattleState {
  config: BattleConfig;
  cards: Record<string, CardDef>;
  rng: number;
  round: number;
  active: PlayerIndex;
  firstPlayer: PlayerIndex;
  players: [PlayerState, PlayerState];
  result: null | { winner: PlayerIndex | null }; // winner null = berabere
}

export type Action =
  | { type: 'PLAY_CARD'; player: PlayerIndex; iid: string }
  | { type: 'END_TURN'; player: PlayerIndex };

export type DamageSource = PlayerIndex | 'arena' | 'fatigue';

export type BattleEvent =
  | { type: 'BATTLE_STARTED'; firstPlayer: PlayerIndex; seed: number }
  | { type: 'TURN_STARTED'; player: PlayerIndex; round: number; maxMp: number }
  | { type: 'SHIELD_EXPIRED'; player: PlayerIndex; amount: number }
  | { type: 'CARD_DRAWN'; player: PlayerIndex; iid: string; cardId: string }
  | { type: 'CARD_BURNED'; player: PlayerIndex; iid: string; cardId: string }
  | { type: 'DECK_RESHUFFLED'; player: PlayerIndex; count: number; reshufflesLeft: number }
  | { type: 'CARD_PLAYED'; player: PlayerIndex; iid: string; cardId: string; cost: number }
  | { type: 'DAMAGE_DEALT'; source: DamageSource; target: PlayerIndex; amount: number; absorbed: number }
  | { type: 'SHIELD_GAINED'; player: PlayerIndex; amount: number }
  | { type: 'HEALED'; player: PlayerIndex; amount: number }
  | { type: 'STATUS_APPLIED'; player: PlayerIndex; status: StatusId; amount: number; duration: number }
  | { type: 'STATUS_IGNORED'; player: PlayerIndex; status: StatusId; amount: number } // K7: küçük değer
  | { type: 'STATUS_EXPIRED'; player: PlayerIndex; status: StatusId }
  | { type: 'TURN_ENDED'; player: PlayerIndex; unusedMp: number }
  | { type: 'BATTLE_ENDED'; winner: PlayerIndex | null; round: number };

export interface BattleSetup {
  config: BattleConfig; cards: CardDef[]; decks: [string[], string[]]; names: [string, string]; seed: number;
}
```
Commit: `feat(rules): battle types`

---

## Görev 5 — Savaşı başlatma (`createBattle`)

**Dosyalar:** `packages/rules/src/{draw.ts,battle.ts,battle.test.ts,test-fixtures.ts}`

**Testler:**
- Her oyuncu `hero.hp` HP, 0 Kalkan, el `hand.starting`, deste `deck.size − hand.starting`, `reshufflesLeft = deck.reshuffles`.
- İlk oyuncu seed'le seçilir; aynı seed → aynı ilk oyuncu ve eller; seed 0..99 içinde iki taraf da en az bir kez ilk olur.
- İlk oyuncunun turu başlamış: `round 1`, `maxMp = mp.start`, eli hâlâ 4 (K3).
- Olay sırası: `BATTLE_STARTED` → 8× `CARD_DRAWN` → `TURN_STARTED`.
- iid'ler benzersiz ve deterministik (`p0-0` … `p1-11`).
- Deste uzunluğu `deck.size`'a eşit değilse ya da bilinmeyen kart id'si varsa anlaşılır hata.

**Kod:** `drawCard(state, p, events)` K2 + N4'e göre: deste doluysa çek; boşsa ve `reshufflesLeft > 0` ve ıskarta doluysa karıştır (`DECK_RESHUFFLED`) ve çek; aksi halde `fatigueCount++` ve Yorgunluk hasarı. Çekilen kart el limitindeyse yanar (`CARD_BURNED`).
Commit: `feat(rules): createBattle with seeded shuffle and opening hands`

---

## Görev 6 — Tur akışı, Kalkan sıfırlama, statü süresi, Arena Çöküşü, Yorgunluk

**Dosyalar:** `packages/rules/src/{turn.ts,status.ts,engine.ts,turn.test.ts}`

**API:**
```ts
export class IllegalActionError extends Error { constructor(readonly reason: IllegalReason) { super(reason) } }
export type IllegalReason = 'BATTLE_OVER' | 'NOT_YOUR_TURN' | 'CARD_NOT_IN_HAND' | 'NOT_ENOUGH_MP';
export function validateAction(state: BattleState, action: Action): IllegalReason | null;
export function apply(state: BattleState, action: Action): { state: BattleState; events: BattleEvent[] };
// Geçersizse IllegalActionError; geçerliyse clone(state) üzerinde çalışır, girdi asla değişmez.
```

**Testler:**
- Sırası olmayan `END_TURN` → `NOT_YOUR_TURN`; girdi değişmez.
- `END_TURN` → `TURN_ENDED { unusedMp }`, sıra geçer, yeni aktif 1 kart çeker, maks MP formüle uyar ve `mp.max`'ta durur.
- Raunt yalnız ilk oyuncunun turu başlarken artar.
- **K1:** `resetOnOwnTurnStart` iken Kalkan rakibin turu boyunca durur, sahibinin tur başında 0 olur (`SHIELD_EXPIRED`); `persistent` iken kalır. Aynı turda 4 + 7 = 11.
- **K7:** Güç 2 aktifken Güç 1 → değişmez (`STATUS_IGNORED`); Güç 2 → süre yenilenir; Güç 3 → değer 3, süre yenilenir. Kendine verilen 2 turluk Güç: verildiği tur + bir sonraki kendi turu; ikinci tur sonunda `STATUS_EXPIRED`. Rakibe verilen 2 turluk Zayıflık: rakibin sonraki iki turu.
- **Arena:** `startRound − 1`'de hasar yok; `startRound`'da `start`, sonraki rauntta `start + step`; Kalkan 10 olsa da HP düşer.
- **K2/N4:** deste bitince bir kez karıştırma; ikinci bitişte Yorgunluk 1, sonra 2; ıskarta boşken hak harcanmaz.
- Arena ya da Yorgunluk HP'yi 0'a indirirse `BATTLE_ENDED` (kazanan rakip); sonraki her aksiyon `BATTLE_OVER`.
- `roundCap` aşılınca berabere.
- Oyuncu başına deste + el + ıskarta = `deck.size`.

Commit: `feat(rules): turn flow, shield reset, statuses, arena collapse, fatigue`

---

## Görev 7 — Kart oynama ve efektler

**Dosyalar:** `packages/rules/src/{effects.ts,effects.test.ts}`, `engine.ts` (`PLAY_CARD`)

Her efekt tek küçük fonksiyon. Efektler sırayla çözülür; biri savaşı bitirirse kalanlar çözülmez.

**Testler:**
- `NOT_ENOUGH_MP`, `CARD_NOT_IN_HAND`, `NOT_YOUR_TURN` reddedilir.
- Oynanan kart elden ıskartaya, MP düşer; `CARD_PLAYED` ilk olay.
- `damage 3`, rakip Kalkan 2 → `absorbed 2`, HP −1, Kalkan 0.
- Güç 2 → 5; Zayıflık 2 → 1; Zayıflık 5 + `damage 3` → 0.
- `ignoreShield` → Kalkan yerinde, HP tam düşer.
- `damageFromShield` → kendi Kalkanın kadar hasar (Güç/Zayıflık uygulanır), kendi Kalkan değişmez.
- `heal` maks HP'yi geçmez, olaydaki `amount` gerçek iyileşme; Kalkanı etkilemez.
- `draw` K2 kurallarıyla çeker; el doluysa yanar; boş destede Yorgunluk verir.
- `applyStatus` süreyi config'den alır, `target: 'enemy'` rakibe gider.
- Ölümcül hasar → `BATTLE_ENDED { winner: kaynak }`, kalan efektler çözülmez.

Commit: `feat(rules): play card and effect resolution`

---

## Görev 8 — Golden replay, property testleri, `legalActions`

**Dosyalar:** `packages/rules/src/{legal.ts,replay.test.ts,properties.test.ts,index.ts}`, `packages/rules/test/replays/{fixture-seed42.json, fatigue-and-arena.json}`

- **Replay dosyası (metin, repo'da):** `{ setup, actions, expected: { events, finalState } }`. Test, `setup` + `actions`'ı çalıştırır ve `expected` ile birebir karşılaştırır. Kural bilerek değişince `UPDATE_REPLAYS=1 pnpm test` dosyayı yeniden yazar ve diff commit'te görünür.
  - `fixture-seed42.json`: ~20 aksiyonluk normal maç.
  - `fatigue-and-arena.json`: tek karıştırma, Yorgunluk ve Arena Çöküşü'nün göründüğü uzun maç.
- **Determinizm:** aynı setup + aksiyonlar iki kez → `JSON.stringify(state)` ve olay listesi eşit.
- **fast-check:** rastgele seed + her adımda `legalActions`'tan rastgele seçim, oyun sonuna kadar. Her adımda invariantlar: `0 ≤ mp ≤ maxMp ≤ mp.max`, `0 ≤ hp ≤ maxHp`, `shield ≥ 0`, statü `turnsLeft > 0`, kart toplamı `deck.size`, iid'ler benzersiz, tüm sayılar tamsayı (`Number.isInteger`), girdi state değişmemiş, oyun `roundCap` içinde biter, bittikten sonra her aksiyon `BATTLE_OVER`.
- `legalActions(state)`: aktif oyuncunun oynayabileceği kartlar (el sırası) + `END_TURN`. AI, sim ve UI aynı listeyi kullanır.
- `index.ts` dışa açar: tipler, `createBattle`, `apply`, `validateAction`, `legalActions`, `IllegalActionError`.

Commit: `test(rules): golden replays and property-based invariants` → **DURUM RAPORU**

---

## Görev 9 — İçerik: Zod şeması, Warrior JSON, değer tablosu üretici

**Dosyalar:**
- `content/{package.json,battle-config.json,cards/warrior.json}`
- `packages/content-schema/src/{schema.ts,load.ts,values-table.ts,index.ts,content.test.ts}`, `packages/content-schema/scripts/values.ts`

1. JSON'lar `docs/savas-degerleri.md`'den yazılır.
2. `schema.ts`: `BattleConfigSchema`, `EffectSchema` (`kind` ile discriminated union), `CardSchema`; tamsayı ve pozitiflik sınırları. `satisfies z.ZodType<BattleConfig>` / `<CardDef>` ile `rules` tipleriyle senkron.
3. `load.ts`: `loadBattleConfig()`, `loadCards('warrior')`, `defaultDeck('warrior')`. Geçersiz içerikte `ContentError` fırlatır; mesaj dosya yolu + alan yolu + sorunu içerir: `content/cards/warrior.json → [3].effects[0].kind: beklenen 'damage' | 'shield' | …, gelen 'hasar'`.
4. `values-table.ts`: config + kartlardan `docs/savas-degerleri.md` metnini üreten saf fonksiyon. `pnpm values` dosyayı yazar.
5. **Testler:** tüm içerik geçerli · kart id'leri benzersiz, kebab-case · havuz 12 kart, deste `deck.size` · 6 kart türü de var · bozuk örnekler (negatif maliyet, bilinmeyen `kind`, ondalık sayı, eksik alan) okunur bir mesajla reddedilir · `docs/savas-degerleri.md` üreticinin çıktısıyla aynı (değilse: "pnpm values çalıştır") · tam içerikle `createBattle` çalışır.

Commit: `feat(content): zod schemas, warrior pool, generated values table`

---

## Görev 10 — P1.4 Skor tabanlı AI

**Dosyalar:** `packages/ai/src/{profiles.ts,redact.ts,evaluate.ts,choose.ts,index.ts,*.test.ts}`
**Bağımlılık:** yalnız `@koidle/rules`. AI ağırlıkları kural değeri değil, AI ayarıdır: `packages/ai/src/profiles.ts`'te tablo olarak durur ve `savas-degerleri.md`'ye ayrı bölüm olarak üretilir.

**Gizli bilgi kuralı:** AI karar vermeden önce `redactForAi(state, me)` çağrılır: rakibin elindeki kartlar ve **her iki destenin** içeriği, maliyeti 99 ve etkisi olmayan `__hidden__` kartlarla değiştirilir; sayılar korunur. AI simülasyonu bu kopya üzerinde çalışır. Kendi eli ve iki tarafın ıskartası açık bilgidir.

```ts
export type AiProfile = 'aggressive' | 'balanced' | 'defensive';
export interface Weights { enemyDamage: number; selfDamage: number; shield: number; enemyShield: number; status: number; hand: number }
export const PROFILES: Record<AiProfile, Weights>;
export function evaluate(state: BattleState, me: PlayerIndex, w: Weights): number;
// enemyDamage×(rakip eksik HP) − selfDamage×(kendi eksik HP) + shield×Kalkan − enemyShield×rakip Kalkan
// + status×(statü(ben) − statü(rakip)) + hand×el boyu; statü = Güç değer×süre − Zayıflık değer×süre
// bitti: kazandım +1e6, kaybettim −1e6
export function chooseAction(state: BattleState, me: PlayerIndex, profile: AiProfile): Action;
// Açgözlü tek adım: legalActions'taki her kartı redakte kopyada simüle et; en iyi skor mevcuttan yüksekse oyna, yoksa END_TURN.
```
Eşitlikte `legalActions` sırası kazanır (deterministik). AI skoru float olabilir: AI kural değil, karar verir; `rules` içine girmez.

**Testler:**
- Kazandıran hamle varsa seçer.
- MP yetmiyor ya da hiçbir kart skoru artırmıyorsa `END_TURN`.
- Aynı durumda 2 MP ile `aggressive` → Yarma, `defensive` → Siper.
- Dönen aksiyon her zaman `validateAction === null` (fast-check).
- **Gizli bilgi testi (fast-check):** rakibin elindeki kartları ve iki destenin sırasını/içeriğini değiştir → AI'ın seçimi değişmez.

Commit: `feat(ai): score-based ai, three profiles, hidden-info redaction`

---

## Görev 11 — `tools/sim`: 900 maçlık simülasyon raporu

**Dosyalar:** `tools/sim/src/{run.ts,stats.ts,report.ts,cli.ts,sim.test.ts}`, `reports/sim/{latest.md,latest.json,latest.csv}`

- `run.ts` (saf): profil eşleşmesi × seed listesi → maç kayıtları. 3×3 eşleşme × 100 seed = **900 maç**. Her maç `legalActions` + `chooseAction` + `apply` ile, gerçek içerikle.
- Maç kaydı (CSV satırı): `seed, p0Profile, p1Profile, firstPlayer, winner, rounds, arenaSeen, fatigueSeen, reshuffleSeen, unusedMpP0, unusedMpP1, turnsP0, turnsP1, cardsPlayedP0, cardsPlayedP1`.
- `report.ts` → `latest.md` (okunabilir tablolar) ve `latest.json` (tüm toplamlar + config/kart özeti):
  - raunt: ortalama / medyan / min / maks
  - ilk oyuncunun kazanma oranı, berabere oranı
  - Arena Çöküşü görülen maç oranı, Yorgunluk görülen maç oranı, karıştırma görülen maç oranı
  - 3×3 profil kazanma tablosu
  - kart başına: oynandığı maç oranı, maç başı ortalama oynanma, oynayan oyuncunun o maçlarda kazanma oranı (hiç oynanmayan / her maç oynanan kartlar işaretlenir)
  - tur başına ortalama kullanılmadan kalan MP (toplam ve profil başına)
- `pnpm sim` → üç dosyayı yazar. Rapor commit'lenir.
- **Test:** küçük koşu (3×3×10) — her maç `roundCap` öncesi biter, hiç `IllegalActionError` yok, aynı seed listesi aynı raporu üretir. Sim "eğlenceli mi?" kararı vermez, yalnız bariz hata ve anlamsız davranış yakalar.

Commit: `feat(sim): ai-vs-ai simulation with md/json/csv report` → **DURUM RAPORU** (ham `latest.md` + `latest.csv` başı eklenir)

---

## Görev 12 — P1.5 Savaş ekranı (React)

**Dosyalar:** `apps/client/{package.json,vite.config.ts,gate1-plugin.ts,index.html,src/main.tsx,src/App.tsx,src/useBattle.ts,src/format.ts,src/format.test.ts,src/components/*.tsx,src/styles.css}`
**Bağımlılık:** `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `@koidle/rules`, `@koidle/ai`, `@koidle/content-schema`. Pixi, animasyon, ses yok.

**Ekranda okunanlar (K4):**
- İki taraf için: HP / maks HP, MP / maks MP, Kalkan, Güç ve Zayıflık (değer + kalan tur), destede kalan, ıskarta sayısı, kalan karıştırma hakkı, Yorgunluk sayacı (sıradaki Yorgunluk hasarı). Rakibin eli yalnız **sayı** olarak.
- Raunt numarası, sıra kimde, Arena Çöküşü durumu: "Pasif — 8. rauntta başlar" / "Aktif — bu tur başında 2 hasar, sonraki 3".
- Savaş kaydı (Türkçe, tamamı kaydırılabilir; rakibin çektiği kart gizli).
- El: ad, MP, tür, metin; oynanamazsa soluk. Oynanabilirlik `validateAction` ile sorulur.
- Turu Bitir.
- Seed (kopyalanabilir) ve AI profili.

**Akış:** Kurulum (profil, seed — boşsa UI üretir; `Math.random` yalnız UI'da serbest) → Savaş (AI hamleleri 700 ms aralıkla) → Sonuç + **Gate 1 formu**.

**Gate 1 formu (her maç sonu):**
1. Eğlence 1–5
2. Karar vermek zorunda kaldım mı? 1–5
3. Maç gereğinden uzun hissettirdi mi? Evet/Hayır
4. Elimde işe yaramayan kart yüzünden sinirlendim mi? Evet/Hayır
5. Sonucu değiştiren bir kararımı hatırlıyor muyum? Evet/Hayır
6. Tek cümle not

Kayda otomatik eklenenler: zaman, seed, AI profili, ilk oyuncu, kazanan, raunt sayısı, süre, Arena/Yorgunluk görüldü mü, config özeti (hash). Kayıt N6'ya göre `docs/gate-1/oturumlar.jsonl`'a eklenir; yedek tarayıcıda, "JSON indir" düğmesi.

**İçerik hatası:** `ContentError` olursa ekran savaşı açmaz, hatayı dosya ve alan yoluyla gösterir.

**Testler:** `format.test.ts` (her olay türünün Türkçe metni; rakip `CARD_DRAWN` gizli; `DAMAGE_DEALT` emilen kısmı, Arena ve Yorgunluk kaynağını gösterir) · form kaydının şekli. Elle doğrulama: her profille baştan sona bir maç, Playwright ekran görüntüsü (`/opt/pw-browsers/chromium`) Yasin'e gösterilir.

Commit: `feat(client): battle sandbox ui with gate 1 form`

---

## Görev 13 — GATE 1 protokolü

**Dosyalar:** `docs/gate-1.md`, `docs/gate-1/oturumlar.jsonl` (boş), `docs/devam-notu.md`

**A. Simülasyon (Görev 11 raporundan)**
| Ölçüt | Hedef |
|---|---|
| Ortalama raunt | 7–11 |
| İlk oyuncu kazanma | %45–55 |
| Berabere | < %2 |
| Hiç oynanmayan kart | 0 |
| Her maç oynanan kart | dikkat: otomatik seçim olabilir |
| Ort. kullanılmayan MP / tur | izlenir |

**B. Yasin'in testi:** en az 10 maç, her profile karşı en az 3. Her maç Görev 12 formuyla kaydedilir.

**C. Değerlendirme:** Ortalama tek başına karar vermez. Evet/Hayır cevapları ve notlar sorunun yerini gösterir (ör. "uzun" çoğunluktaysa Arena/HP; "işe yaramayan kart" çoğunluktaysa maliyet eğrisi/deste). Sonuç Yasin üzerinden Copilot'a iletilir, ayar önerileri birlikte değerlendirilir.
- **Geçti:** eğlence medyanı ≥ 4 ve A tablosunda bariz sorun yok → Faz 2.
- **Kaldı:** yalnız savaş düzeltilir. Sırayla denenecek kollar (her biri tek değişiklik + yeniden test):
  1. Değerler (HP, kart sayıları, Arena/Yorgunluk eğrisi) — yalnız JSON.
  2. K1 `shield.persistence = "persistent"` varyantı.
  3. K6 job temel yeteneği (2 MP) — Yasin onayıyla.
  4. Deste 12 → 16 (açık soru 2).
  5. Minion'lı model (açık soru 1) — en son, spec güncellemesi gerektirir.

Commit: `docs: gate 1 protocol` → **DURUM RAPORU**. **Gate 1 geçilmeden Faz 2'ye geçilmez.**

---

## Kapanış kontrol listesi

- [ ] `pnpm test`, `pnpm typecheck`, `pnpm lint` temiz
- [ ] `rules` saf: bekçi testi yeşil, tüm sayılar tamsayı
- [ ] Golden replay dosyaları repo'da ve yeşil; property testleri yeşil
- [ ] Tüm kural değerleri `content/` içinde; `docs/savas-degerleri.md` üretilmiş ve güncel
- [ ] Bozuk içerik anlaşılır mesajla duruyor (test + ekran)
- [ ] AI üç profilde oynuyor, gizli bilgi testi yeşil
- [ ] `reports/sim/latest.{md,json,csv}` commit'li
- [ ] `pnpm dev` ile maç oynanıyor, Gate 1 formu `docs/gate-1/oturumlar.jsonl`'a yazıyor
