# KOIdLe — Faz 0–1 Uygulama Planı: Savaş Sandbox'ı

> **Tarih:** 2026-10-06 · **Dayanak:** `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md` (onaylandı)
> **Hedef:** GATE 1 — *Hero-vs-Hero kart savaşı tek başına eğlenceli mi?*
> **Kapsam:** P0.2 (test değerleri) + P1.1–P1.5. Karakter, item, farm, upgrade, backend **yok**.

> **Claude için talimat:** Görevleri sırayla uygula. Her görev: önce test (kırmızı) → en küçük kod (yeşil) → `pnpm test && pnpm typecheck && pnpm lint` → commit. Bir görev bitmeden sonrakine geçme. Spec'teki ÇIKSIN listesinden hiçbir şey ekleme. Değerler `content/` altındaki JSON'dan okunur, koda gömülmez.

---

## 0. Bu planda alınan kararlar (Yasin onayı istenir)

Spec'in açık bıraktığı, Faz 1'i başlatmak için seçmek zorunda olduğum noktalar. Hepsi config ya da tek dosyalık değişiklik; GATE 1'de değiştirilebilir.

| # | Konu | Seçim | Alternatif |
|---|---|---|---|
| K1 | Kalkan | **Kalıcı** (Hearthstone zırhı gibi birikir). Arena Çöküşü Kalkanı yok sayar. | Kendi tur başında sıfırlanır (Slay the Spire bloku) |
| K2 | Deste bitince | Atılan kartlar karıştırılıp yeni deste olur. Ayrı yorgunluk sistemi yok, bitirici Arena Çöküşü. | Yorgunluk hasarı |
| K3 | İlk oyuncu avantajı | İkisi de 4 kartla başlar; **ilk oyuncu 1. turunda kart çekmez.** | İkinci oyuncuya +1 MP'lik tek seferlik kart |
| K4 | Faz 1 UI | **React + DOM**, Pixi yok. Harman görünümü ve Pixi Faz 9'da. | Pixi ile başlamak (Gate 1 için gereksiz yük) |
| K5 | Faz 1 maçı | Warrior vs Warrior (ayna), rakip AI üç profilden biri. | — (diğer job'lar Faz 2) |
| K6 | Kahraman gücü (temel yetenek) | **Yok.** Spec'te yok; Gate 1 sıkıcı çıkarsa ilk denenecek kollardan biri. | 2 MP'lik job yeteneği |
| K7 | Statüler | Yalnız **Güç** (+hasar) ve **Zayıflık** (−hasar). Aynı statü tekrar gelirse büyük değer ve uzun süre geçerli, üst üste binmez. | Daha fazla statü (Faz 2'de Mage/Priest ile) |

---

## 1. Hedef dosya yapısı (Faz 1 sonu)

```
KOIdLe/
├─ package.json               # root scriptler: test, typecheck, lint, dev
├─ pnpm-workspace.yaml        # packages/*, apps/*, content
├─ turbo.json
├─ tsconfig.base.json         # strict ayarlar
├─ biome.json
├─ content/                   # @koidle/content — yalnız JSON
│  ├─ package.json
│  ├─ battle-config.json
│  └─ cards/warrior.json
├─ packages/
│  ├─ rules/                  # @koidle/rules — saf, deterministik, bağımlılıksız
│  │  └─ src/{rng,clone,types,draw,status,effects,turn,battle,engine,index}.ts (+ *.test.ts)
│  ├─ content-schema/         # @koidle/content-schema — Zod + content yükleyici
│  └─ ai/                     # @koidle/ai — skor tabanlı AI (yalnız rules'a bağlı)
├─ apps/
│  └─ client/                 # Vite + React savaş sandbox'ı
└─ docs/
   ├─ test-degerleri.md       # P0.2
   └─ gate-1.md               # Gate 1 protokolü ve sonuç kaydı
```

**Bağımlılık yönü:** `rules` ← `content-schema` (yalnız tip) ← `ai` (yalnız `rules`) ← `apps/client`. `rules` hiçbir pakete bağımlı değildir.

**Paketler build edilmez.** İç paketler `exports: "./src/index.ts"` ile TS kaynağı olarak tüketilir (Turborepo "just-in-time package" deseni). Vite ve Vitest TS'i doğrudan çözer; `typecheck` her pakette `tsc --noEmit`.

---

## Görev 1 — P0.2 Test değerleri tablosu

**Dosya:** `docs/test-degerleri.md` (yeni)

Doğru denge değil, başlangıç değerleri. Faz 1'de yalnızca **Savaş** bölümü koda (`content/battle-config.json`, `content/cards/warrior.json`) girer; diğer bölümler kendi fazında `content/` altına taşınır ve bu tablo kaynak olarak kalır.

**Adımlar**
1. Dosyayı aşağıdaki içerikle oluştur.
2. Commit: `docs: add P0.2 starting test values`

**İçerik**

### 1.1 Savaş (Faz 1)
| Parametre | Değer | Not |
|---|---|---|
| Kahraman HP | 30 | Kalkan başlangıcı 0 |
| MP eğrisi | Kendi N. turunda maks MP = min(N, 8); tur başında dolar; devretmez | |
| Deste | 12 kart (Faz 1: 12 Warrior kartından birer tane) | Kopya kuralı Gate 1 sonrası |
| Başlangıç eli | 4 (iki oyuncu); ilk oyuncu 1. turunda çekmez | K3 |
| Tur başı çekiş | 1 kart | |
| El sınırı | 8; fazlası doğrudan atılır ("yandı") | |
| Deste bitince | Atılanlar karıştırılır | K2 |
| Arena Çöküşü | 8. raunttan itibaren, her oyuncu kendi tur başında `raunt − 7` hasar alır (1, 2, 3…), Kalkanı yok sayar | Raunt = iki oyuncunun da bir tur oynaması |
| Güvenlik tavanı | 20. raunt biterse berabere | Normalde hiç tetiklenmemeli |
| Hedef maç | 7–11 raunt, 4–7 dk | Gate 1'de ölçülür |

### 1.2 Warrior kartları (Faz 1)
| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `yarma` | Yarma | Attack | 1 | 3 hasar |
| `kalkan-kaldir` | Kalkan Kaldır | Defense | 1 | 4 Kalkan |
| `gozdagi` | Gözdağı | Debuff | 1 | Rakibe Zayıflık 2 (2 tur) |
| `hazirlik` | Hazırlık | Skill | 1 | 1 kart çek, 2 Kalkan |
| `kalkan-darbesi` | Kalkan Darbesi | Attack | 2 | Kalkanın kadar hasar (Kalkan harcanmaz) |
| `savas-narasi` | Savaş Narası | Buff | 2 | Güç 2 (2 tur) |
| `siper` | Siper | Defense | 2 | 7 Kalkan |
| `ikinci-nefes` | İkinci Nefes | Heal | 2 | 6 HP iyileş |
| `agir-darbe` | Ağır Darbe | Attack | 3 | 7 hasar |
| `savas-ritmi` | Savaş Ritmi | Skill | 3 | 2 kart çek, 3 hasar |
| `yarip-gec` | Yarıp Geç | Attack | 4 | 6 hasar, Kalkanı yok sayar |
| `yikim` | Yıkım | Attack | 6 | 14 hasar |

Kurallar: hasar = kart değeri + Güç − Zayıflık (en az 0). "2 tur" = etkilenen kahramanın kendi 2 turu boyunca; süre o kahramanın tur sonunda azalır. İyileşme maks HP'yi geçmez.

### 1.3 AI zorluğu
| Profil | Rakibe hasar | Kendi hasarı | Kalkan | Rakip Kalkanı | Statü | El |
|---|---|---|---|---|---|---|
| aggressive | 3 | 1 | 0.5 | 1 | 1.5 | 0.5 |
| balanced | 2 | 2 | 1 | 1 | 1 | 0.5 |
| defensive | 1.5 | 3 | 1.5 | 0.5 | 1 | 0.5 |

### 1.4 Level ve EXP (Faz 3/5)
- Level 1–10. Sonraki level için gereken EXP = `100 × mevcut level` (toplam 4.500).
- EXP kaynakları: farm (slot tablosu), PvE galibiyeti 40 / elit 100 / boss 300, PvP galibiyeti 60.

### 1.5 Farm slotları (Faz 5)
| Slot | Level şartı | Kapasite | EXP/saat | Altın/saat | Item şansı / 10 dk | Risk |
|---|---|---|---|---|---|---|
| 1 | 1 | 8 | 120 | 40 | 800 bps | Düşük |
| 2 | 2 | 8 | 180 | 60 | 900 bps | Düşük |
| 3 | 4 | 6 | 260 | 90 | 1000 bps | Orta |
| 4 | 6 | 6 | 360 | 130 | 1100 bps | Orta |
| 5 | 8 | 4 | 480 | 180 | 1300 bps | Yüksek |
| 6 | 10 | 4 | 620 | 240 | 1500 bps | Yüksek |

- Kapasite aşımı: fazla oyuncu başına verim −%10, taban %50. (Açık soru 3)
- Party bonusu: aynı slottaki dost oyuncu başına +%5, en fazla +%15.
- Taşıma kapasitesi: 10 item **veya** slotun 8 saatlik altın geliri; hangisi önce dolarsa farm durur. (Açık soru 8)

### 1.6 Drop (Faz 5)
- Rarity dağılımı (bps): Common 7000 · Magic 2200 · Rare 700 · Unique 100. Elit: Rare ×2, boss: Unique ×5 (kalan Common'dan düşülür).

### 1.7 Upgrade (Faz 4) — `docs/research/04 §8.2`'nin +1..+8 kısmı, tek pity Örs Isısı
| Hedef | Taban | Başarısızlıkta | Altın |
|---|---|---|---|
| +1 | 10000 | — | 20 |
| +2 | 10000 | — | 20 |
| +3 | 9500 | Kalır | 20 |
| +4 | 8500 | Kalır | 40 |
| +5 | 7500 | Kalır | 40 |
| +6 | 6000 | −1 | 80 |
| +7 | 4500 | −1 | 140 |
| +8 | 3500 | −1 | 200 |
- **Örs Isısı:** her başarısızlıkta efektif şansa `taban × 0,5` eklenir, tavan 10000; başarıda sıfırlanır; item bazında. (+8 için: 3500 → 5250 → 7000 → 8750 → 10000, en geç 5. deneme.)

### 1.8 Baskın (Faz 6)
| Parametre | Değer | Açık soru |
|---|---|---|
| Savunan kaybederse | Taşınan altının %30'u + taşınan item'lardan 1 tanesi (seed'li seçim) | 4 |
| Saldıran kaybederse | Taşınan altının %20'si | 9 |
| Baskın kalkanı | 30 dk | 7 |
| Online savunana davet süresi | 30 sn | 10 |

---

## Görev 2 — P1.1 Monorepo iskeleti

**Dosyalar (yeni):** `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `biome.json`, `packages/rules/{package.json,tsconfig.json,vitest.config.ts,src/index.ts,src/index.test.ts}`
**Dosyalar (güncelle):** `.gitignore` (`node_modules/`, `.turbo/`, `dist/`, `coverage/`), `CLAUDE.md` (komutlar bölümü)

**Adımlar**
1. Ortam: Node 22, pnpm 10 (oturumda kurulu olanlar). Kurulumdan önce `pnpm view turbo version`, `pnpm view vitest version`, `pnpm view @biomejs/biome version`, `pnpm view typescript version` ile güncel sürümleri doğrula; `package.json`'a `packageManager` alanını yaz.
2. `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - packages/*
     - apps/*
     - content
   ```
3. `tsconfig.base.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "moduleResolution": "Bundler",
       "lib": ["ES2022"],
       "strict": true,
       "noUncheckedIndexedAccess": true,
       "exactOptionalPropertyTypes": true,
       "verbatimModuleSyntax": true,
       "isolatedModules": true,
       "resolveJsonModule": true,
       "skipLibCheck": true,
       "noEmit": true
     }
   }
   ```
4. `turbo.json`: `test`, `typecheck`, `lint` görevleri (`dependsOn: ["^typecheck"]` gerekmez, paketler build edilmiyor); `dev` için `cache: false, persistent: true`.
5. Root `package.json` scriptleri: `"test": "turbo test"`, `"typecheck": "turbo typecheck"`, `"lint": "biome check ."`, `"format": "biome format --write ."`, `"dev": "pnpm --filter @koidle/client dev"`.
6. `biome.json`: formatter (2 boşluk, tek tırnak), linter `recommended` + `noExplicitAny: error`.
7. `packages/rules/package.json`: `"name": "@koidle/rules"`, `"type": "module"`, `"exports": "./src/index.ts"`, scriptler `test: vitest run`, `typecheck: tsc --noEmit`. **dependencies boş.** devDependencies: `vitest`, `typescript`, `fast-check`.
8. `packages/rules/tsconfig.json`: base'i extend eder, `"types": []` (Node/DOM globalleri sızmasın).
9. Kırmızı test `src/index.test.ts`: `expect(RULES_VERSION).toBe('0.1.0')` → `src/index.ts`: `export const RULES_VERSION = '0.1.0';` → yeşil.
10. `pnpm install && pnpm test && pnpm typecheck && pnpm lint` → hepsi temiz.
11. `CLAUDE.md`'ye ekle: "Komutlar: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm dev`. `packages/rules` saftır: DOM/Node/`Math.random`/`Date.now` yasak."
12. Commit: `chore: monorepo skeleton (pnpm, turbo, strict ts, vitest, biome)`

---

## Görev 3 — Seed'li RNG, klonlama ve determinizm bekçisi

**Dosyalar:** `packages/rules/src/rng.ts`, `rng.test.ts`, `clone.ts`, `determinism.test.ts`

**Testler (önce yaz)**
- Aynı seed → aynı `nextUint32` dizisi (ilk 5 değeri sabitle: golden).
- `rollInt(holder, n)` her zaman `0 ≤ x < n`; 10.000 çekimde her kova görülür.
- `shuffle` aynı seed ile aynı sırayı verir, girdiyi değiştirmez, eleman kümesini korur.
- `clone` derin kopya üretir, sonuç orijinale `toEqual` ama `not.toBe`.
- **Determinizm bekçisi:** `src/**/*.ts` (test dosyaları hariç) içinde `Math.random`, `Date.now`, `new Date(`, `performance.`, `process.`, `window.`, `document.`, `new Map(`, `new Set(` geçmez. Test dosyaları `node:fs` ile okur. Bu yüzden `tsconfig.json` yalnız `src/**/*.ts` (testler hariç) için `types: []` kullanır; `tsconfig.test.json` testleri `types: ["node"]` ile kontrol eder ve `typecheck` scripti ikisini de çalıştırır.

**Kod**
```ts
// rng.ts — mulberry32. Durum tek bir uint32; BattleState içinde saklanır.
export interface RngHolder { rng: number }

export function nextUint32(holder: RngHolder): number {
  holder.rng = (holder.rng + 0x6d2b79f5) >>> 0;
  let t = holder.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return (t ^ (t >>> 14)) >>> 0;
}

export function rollInt(holder: RngHolder, maxExclusive: number): number {
  return nextUint32(holder) % maxExclusive;
}

export function shuffle<T>(holder: RngHolder, items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = rollInt(holder, i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

// clone.ts — state saf JSON olmak zorunda; bu aynı zamanda serileştirilebilirliği garanti eder.
export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
```

Commit: `feat(rules): seeded rng, shuffle, clone, determinism guard`

---

## Görev 4 — Tipler

**Dosya:** `packages/rules/src/types.ts` (test yok; Görev 5–7 testleri kullanır)

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
  | { kind: 'applyStatus'; target: 'self' | 'enemy'; status: StatusId; amount: number; duration: number };

export interface CardDef {
  id: string; name: string; job: Job; type: CardType; cost: number; effects: Effect[]; text: string;
}

export interface BattleConfig {
  heroHp: number; startingHand: number; handLimit: number; maxMp: number;
  arenaCollapseRound: number; roundCap: number; firstPlayerSkipsDraw: boolean;
}

export interface CardInstance { iid: string; cardId: string }
export interface Status { id: StatusId; amount: number; turnsLeft: number }

export interface PlayerState {
  name: string; hp: number; maxHp: number; mp: number; maxMp: number; shield: number;
  statuses: Status[]; deck: CardInstance[]; hand: CardInstance[]; discard: CardInstance[];
  turnsTaken: number;
}

export interface BattleState {
  config: BattleConfig;
  cards: Record<string, CardDef>;
  rng: number;
  round: number;
  active: PlayerIndex;
  firstPlayer: PlayerIndex;
  players: [PlayerState, PlayerState];
  result: null | { winner: PlayerIndex | null }; // null winner = berabere
}

export type Action =
  | { type: 'PLAY_CARD'; player: PlayerIndex; iid: string }
  | { type: 'END_TURN'; player: PlayerIndex };

export type BattleEvent =
  | { type: 'BATTLE_STARTED'; firstPlayer: PlayerIndex }
  | { type: 'TURN_STARTED'; player: PlayerIndex; round: number; maxMp: number }
  | { type: 'CARD_DRAWN'; player: PlayerIndex; iid: string; cardId: string }
  | { type: 'CARD_BURNED'; player: PlayerIndex; iid: string; cardId: string }
  | { type: 'DECK_RESHUFFLED'; player: PlayerIndex; count: number }
  | { type: 'CARD_PLAYED'; player: PlayerIndex; iid: string; cardId: string; cost: number }
  | { type: 'DAMAGE_DEALT'; source: PlayerIndex | 'arena'; target: PlayerIndex; amount: number; absorbed: number }
  | { type: 'SHIELD_GAINED'; player: PlayerIndex; amount: number }
  | { type: 'HEALED'; player: PlayerIndex; amount: number }
  | { type: 'STATUS_APPLIED'; player: PlayerIndex; status: StatusId; amount: number; duration: number }
  | { type: 'STATUS_EXPIRED'; player: PlayerIndex; status: StatusId }
  | { type: 'TURN_ENDED'; player: PlayerIndex }
  | { type: 'BATTLE_ENDED'; winner: PlayerIndex | null };

export interface BattleSetup {
  config: BattleConfig;
  cards: CardDef[];
  decks: [string[], string[]]; // kart id listeleri
  names: [string, string];
  seed: number;
}
```

Not: `CARD_DRAWN` rakibin kart kimliğini de taşır. Faz 1'de UI bunu rakip için gizler; sunucu filtrelemesi Faz 8'de.

Commit: `feat(rules): battle types`

---

## Görev 5 — Savaşı başlatma (`createBattle`)

**Dosyalar:** `packages/rules/src/draw.ts`, `battle.ts`, `battle.test.ts`, `test-fixtures.ts` (testler için küçük kart seti ve config)

**Testler**
- Her oyuncu 30 HP, 0 Kalkan, el 4 kart, deste 8 kart.
- İlk oyuncu seed'le seçilir; aynı seed → aynı ilk oyuncu ve aynı eller; farklı seed'lerden (0..99) iki oyuncu da en az bir kez ilk olur.
- İlk oyuncunun turu başlamış: `active === firstPlayer`, `round === 1`, `maxMp === 1`, `mp === 1`, `turnsTaken === 1`; K3 nedeniyle eli hâlâ 4.
- Olaylar sırası: `BATTLE_STARTED` → 8× `CARD_DRAWN` → `TURN_STARTED`.
- iid'ler benzersiz ve deterministik (`p0-0` … `p1-11`).
- Bilinmeyen kart id'si → `Error('Unknown card: x')`.

**Kod ana hatları**
- `draw.ts → drawCard(state, p, events)`: deste boşsa ve atılanlar doluysa `shuffle` ile desteye çevir (`DECK_RESHUFFLED`); ikisi de boşsa hiçbir şey yapma. Kartı al; el `handLimit`'teyse atılanlara koy (`CARD_BURNED`), değilse ele ekle (`CARD_DRAWN`).
- `battle.ts → createBattle(setup): { state, events }`: `rng = seed >>> 0` → `firstPlayer = rollInt(2)` → instance'lar → desteleri karıştır → `startingHand` kadar çek → `startTurn(state, firstPlayer, events)` (Görev 6'da yazılır; bu görevde MP ayarı + `TURN_STARTED` yapan minimal sürüm yeterli, Görev 6 genişletir).

Commit: `feat(rules): createBattle with seeded shuffle and opening hands`

---

## Görev 6 — Tur akışı, statü süresi, Arena Çöküşü

**Dosyalar:** `packages/rules/src/turn.ts`, `status.ts`, `engine.ts`, `turn.test.ts`

**API**
```ts
// engine.ts
export class IllegalActionError extends Error {}
export type IllegalReason = 'BATTLE_OVER' | 'NOT_YOUR_TURN' | 'CARD_NOT_IN_HAND' | 'NOT_ENOUGH_MP';
export function validateAction(state: BattleState, action: Action): IllegalReason | null;
export function apply(state: BattleState, action: Action): { state: BattleState; events: BattleEvent[] };
// apply: geçersizse IllegalActionError fırlatır; geçerliyse clone(state) üzerinde çalışır, girdi asla değişmez.
```

**Testler (`END_TURN`)**
- Sırası olmayan oyuncu `END_TURN` → `IllegalActionError('NOT_YOUR_TURN')`; girdi state değişmez.
- `END_TURN` → `TURN_ENDED`, `active` değişir, yeni aktif oyuncu 1 kart çeker, `maxMp` kendi tur sayısına göre (ikinci oyuncunun ilk turu: 1).
- Raunt yalnızca ilk oyuncunun turu başlarken artar.
- MP her tur dolar, 8'de durur (16 tur ilerletip kontrol et).
- Statü süresi: Güç 2 (2 tur) alan oyuncu → kendi 1. tur sonunda `turnsLeft 1`, 2. tur sonunda kalkar ve `STATUS_EXPIRED`.
- Arena Çöküşü: `arenaCollapseRound` = 8 iken 7. rauntta hasar yok; 8. raunt tur başında 1, 9.'da 2; Kalkan 10 olsa bile HP düşer (`absorbed: 0`).
- Arena Çöküşü HP'yi 0'a indirirse `BATTLE_ENDED` (kazanan rakip), o oyuncu kart çekmez; sonraki her aksiyon `BATTLE_OVER`.
- `roundCap` aşılınca `BATTLE_ENDED { winner: null }`.
- Deste + el + atılanlar toplamı her zaman 12.

**Kod ana hatları**
- `startTurn(state, p, events)`: `turnsTaken++` → `maxMp = min(turnsTaken, config.maxMp)`, `mp = maxMp` → `round ≥ arenaCollapseRound` ise `round − arenaCollapseRound + 1` hasar (Kalkansız) ve ölüm kontrolü → K3 istisnası değilse `drawCard` → `TURN_STARTED`.
- `endTurn(state, events)`: aktif oyuncunun statülerini `tickStatuses` ile azalt → `TURN_ENDED` → `active` değiş → yeni aktif `firstPlayer` ise `round++` → `round > roundCap` ise berabere → değilse `startTurn`.
- `status.ts`: `applyStatus` (K7: büyük amount, büyük süre), `tickStatuses`, `statusAmount(p, id)`.

Commit: `feat(rules): turn flow, status duration, arena collapse`

---

## Görev 7 — Kart oynama ve efektler

**Dosyalar:** `packages/rules/src/effects.ts`, `effects.test.ts`, `engine.ts` (PLAY_CARD dalı)

Her efekt tek bir küçük fonksiyon: `resolveEffect(state, source, effect, events)`. Efektler sırayla çözülür; biri savaşı bitirirse kalanlar çözülmez.

**Testler** (her biri `test-fixtures.ts` ile kurulmuş elle hazırlanmış state üzerinde)
- `NOT_ENOUGH_MP`, `CARD_NOT_IN_HAND`, `NOT_YOUR_TURN` reddedilir.
- Oynanan kart elden çıkar, atılanlara gider, MP düşer; `CARD_PLAYED` ilk olaydır.
- `damage 3`, rakip Kalkan 2 → `absorbed 2`, HP −1, Kalkan 0.
- `damage` + Güç 2 → 5; + Zayıflık 2 → 1; Zayıflık 5 ile `damage 3` → 0 (negatif değil).
- `ignoreShield` → Kalkan yerinde, HP tam düşer.
- `damageFromShield` → kendi Kalkanın kadar hasar (Güç/Zayıflık uygulanır), kendi Kalkanın değişmez; Kalkan 0 ise hasar 0.
- `shield` birikir (4 + 7 = 11) — K1.
- `heal` maks HP'yi geçmez, olaydaki `amount` gerçek iyileşmedir.
- `draw` deste boşken atılanları karıştırır; el 8'de ise kart yanar.
- `applyStatus` `target: 'enemy'` rakibe gider.
- Ölümcül hasar → `BATTLE_ENDED { winner: kaynak }`, kartın kalan efektleri çözülmez.

Commit: `feat(rules): play card and effect resolution`

---

## Görev 8 — Replay ve özellik (property) testleri

**Dosyalar:** `packages/rules/src/replay.test.ts`, `properties.test.ts`, `index.ts` (genel API dışa aktarımı)

- **Golden replay:** seed 42 + sabit desteler + elle yazılmış ~20 aksiyon → `expect(events).toMatchSnapshot()`. Kural değişince snapshot bilerek güncellenir; kazara değişim yakalanır.
- **Determinizm:** aynı `createBattle` + aynı aksiyon listesi iki kez çalıştırılır → `JSON.stringify` eşit.
- **fast-check:** rastgele seed + rastgele yasal aksiyon seçimi (her adımda yasal aksiyonlar listelenir, `fc.nat()` ile biri seçilir) ile oyun sonuna kadar oyna. Her adımda invariantlar:
  - `0 ≤ mp ≤ maxMp ≤ config.maxMp`, `hp ≤ maxHp`, `shield ≥ 0`, statü `turnsLeft > 0`
  - oyuncu başına toplam kart 12, iid'ler benzersiz
  - girdi state `apply` sonrası değişmemiş (önce/sonra `JSON.stringify` karşılaştırması)
  - oyun `roundCap` içinde biter; bittikten sonra her aksiyon `BATTLE_OVER`
- `index.ts` yalnız şunları dışa açar: tipler, `createBattle`, `apply`, `validateAction`, `IllegalActionError`, `legalActions(state)` (yasal aksiyon listesi; AI ve property testi ortak kullanır, sıra deterministik: el sırası, sonra `END_TURN`).

Commit: `test(rules): golden replay and property-based invariants`

---

## Görev 9 — İçerik: Zod şeması + Warrior JSON

**Dosyalar:**
- `content/package.json` (`@koidle/content`, `exports: { "./*": "./*" }`), `content/battle-config.json`, `content/cards/warrior.json`
- `packages/content-schema/{package.json,tsconfig.json,src/schema.ts,src/load.ts,src/index.ts,src/content.test.ts}`

**Adımlar**
1. JSON'ları Görev 1 tablolarından yaz (`battle-config.json`: `heroHp 30, startingHand 4, handLimit 8, maxMp 8, arenaCollapseRound 8, roundCap 20, firstPlayerSkipsDraw true`).
2. `schema.ts`: `EffectSchema` (discriminated union, `kind`), `CardSchema`, `BattleConfigSchema` (tam sayı, pozitif, `maxMp ≤ 10` gibi sınırlar). Tipler `@koidle/rules`'tan gelir; `satisfies z.ZodType<CardDef>` ile şema ve tip senkron tutulur.
3. `load.ts`: `loadBattleConfig()`, `loadCards(job)`, `defaultDeck(job)` (Faz 1: her karttan bir tane).
4. **Testler:** tüm JSON şemadan geçer · kart id'leri benzersiz ve kebab-case · Warrior havuzu tam 12 kart · `defaultDeck` 12 kart · tüm 6 kart türü en az bir kez var · bozuk örnek (negatif maliyet, bilinmeyen `kind`) reddedilir · tam içerikle `createBattle` çalışır.
5. Commit: `feat(content): zod schemas and warrior card pool`

---

## Görev 10 — P1.4 Skor tabanlı AI

**Dosyalar:** `packages/ai/{package.json,tsconfig.json,src/profiles.ts,src/evaluate.ts,src/choose.ts,src/index.ts,src/*.test.ts,src/sim.test.ts}`
**Bağımlılık:** yalnız `@koidle/rules` (+ testlerde `@koidle/content-schema`).

**Kod**
```ts
export type AiProfile = 'aggressive' | 'balanced' | 'defensive';
export interface Weights { enemyDamage: number; selfDamage: number; shield: number; enemyShield: number; status: number; hand: number }
export const PROFILES: Record<AiProfile, Weights>; // Görev 1 §1.3

// Statü değeri: Güç amount × turnsLeft, Zayıflık −amount × turnsLeft
export function evaluate(state: BattleState, me: PlayerIndex, w: Weights): number {
  // w.enemyDamage × (rakip maxHp − hp) − w.selfDamage × (benim maxHp − hp)
  // + w.shield × benim Kalkan − w.enemyShield × rakip Kalkan
  // + w.status × (statü(ben) − statü(rakip)) + w.hand × el boyum
  // savaş bittiyse: kazandım +1e6, kaybettim −1e6
}

// Açgözlü tek adım: her yasal kartı simüle et, en iyi skor mevcut skordan yüksekse onu oyna, yoksa END_TURN.
export function chooseAction(state: BattleState, me: PlayerIndex, profile: AiProfile): Action;
```
Eşitlikte `legalActions` sırası kazanır (deterministik). AI çekilecek kartı simülasyonda "görür" ama değerlendirme yalnız el **sayısına** baktığı için bu bilgiyi kullanmaz; Faz 1 için kabul.

**Testler**
- Kazandıran hamle varsa onu seçer (rakip 3 HP, elde Yarma).
- MP yetmiyorsa ya da hiçbir kart skoru artırmıyorsa `END_TURN`.
- Aynı state için iki MP'de: `aggressive` → Yarma, `defensive` → Siper.
- Dönen aksiyon her zaman `validateAction === null` (fast-check, rastgele savaş anları).
- **Duman simülasyonu (`sim.test.ts`):** 3×3 profil eşleşmesi × 100 seed = 900 maç, hepsi `roundCap` öncesi biter, hiçbir aksiyon reddedilmez. Konsola özet basar (test bunları **doğrulamaz**, Gate 1 için rapor eder): ortalama raunt, ilk oyuncu kazanma oranı, berabere oranı, profil eşleşmesi kazanma tablosu, kart başına oynanma sayısı. 1 sn'den uzun sürerse seed sayısını düşür.

Commit: `feat(ai): score-based ai with three profiles and smoke sim`

---

## Görev 11 — P1.5 Placeholder savaş UI

**Dosyalar:** `apps/client/{package.json,tsconfig.json,vite.config.ts,index.html,src/main.tsx,src/App.tsx,src/useBattle.ts,src/format.ts,src/format.test.ts,src/components/{SetupScreen,HeroPanel,Hand,CardView,BattleLog,ResultOverlay}.tsx,src/styles.css}`
**Bağımlılık:** `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `@koidle/rules`, `@koidle/ai`, `@koidle/content-schema`. Pixi yok (K4).

**Ekran (tek sayfa, yukarıdan aşağı)**
1. **Rakip paneli:** ad, HP çubuğu, Kalkan, statü rozetleri (Güç 2 · 1 tur), elindeki kart **sayısı**, deste sayısı.
2. **Savaş kaydı:** son 12 olay Türkçe cümle olarak; rakibin çektiği kartın adı gizli ("Rakip bir kart çekti").
3. **Oyuncu paneli:** HP, MP (`3/5` + noktalar), Kalkan, statüler, deste/atılan sayısı, raunt, Arena Çöküşü uyarısı (raunt ≥ 7 ise "Gelecek raunt arena çöker").
4. **El:** kart = ad, MP, tür, metin. Sıra değilse ya da MP yetmiyorsa soluk ve tıklanamaz. Tıkla → oyna.
5. **Turu Bitir** düğmesi.
6. **Kurulum ekranı:** AI profili seçimi, seed alanı (boşsa UI rastgele üretir — `Math.random` yalnız UI'da serbest), "Savaşa Başla". Seed savaş ekranında görünür ve "seed'i kopyala" var (hata raporu için).
7. **Sonuç katmanı:** Kazandın / Kaybettin / Berabere, raunt sayısı, süre, "Tekrar (aynı seed)" ve "Yeni savaş".

**Davranış**
- `useBattle`: `{ state, log }` tutar; `dispatch(action)` → `apply` → olaylar log'a eklenir. UI hiçbir kural kararı vermez; kartın oynanabilirliği bile `validateAction` ile sorulur.
- Sıra AI'daysa `useEffect` 700 ms aralıkla `chooseAction` → `apply`; AI `END_TURN` diyene kadar devam.
- İçerik JSON'u Vite HMR ile yüklenir: `content/` altındaki bir değeri değiştirip kaydetmek, yeni savaşta hemen etkili olur (Gate 1 ayarı kod gerektirmez).

**Testler**
- `format.test.ts`: her `BattleEvent` türü için Türkçe metin; rakip `CARD_DRAWN` gizlenir; `DAMAGE_DEALT` emilen kısmı gösterir ("5 hasar (2'si Kalkan'a)"); `source: 'arena'` → "Arena çöküyor: 2 hasar".
- Elle doğrulama: `pnpm dev` → her AI profiliyle bir maç baştan sona oynanır; konsolda hata yok. Ekran görüntüsü alınır (Playwright, `/opt/pw-browsers/chromium`) ve Yasin'e gösterilir.

Commit: `feat(client): placeholder battle sandbox ui`

---

## Görev 12 — GATE 1 protokolü

**Dosyalar:** `docs/gate-1.md` (yeni), `docs/devam-notu.md` (güncelle)

`docs/gate-1.md` içeriği:

**A. Otomatik ölçüm (Görev 10 sim çıktısından kopyalanır)**
| Ölçüt | Hedef | Sonuç |
|---|---|---|
| Ortalama raunt | 7–11 | |
| İlk oyuncu kazanma | %45–55 | |
| Berabere | < %2 | |
| Hiç oynanmayan kart (AI istatistiği) | 0 | |

**B. Yasin'in oyun testi:** en az 10 maç (her profile en az 3). Her maçtan sonra 1–5 puan:
1. Turlarımda gerçek bir karar verdim.
2. Maç uzunluğu iyiydi (ne çabuk ne uzun).
3. Bir maç daha oynamak istedim.
4. Not: en sıkıcı an / en iyi an.

**C. Karar**
- **Geçti:** 3. sorunun medyanı ≥ 4 ve A tablosu hedeflerde → Faz 2.
- **Kaldı:** yalnızca savaş düzeltilir (spec kuralı). Sırayla denenecek kollar, her biri tek değişiklik + yeniden test:
  1. Değerler (HP, kart sayıları, Arena Çöküşü raundu) — yalnız JSON.
  2. K1 Kalkan sıfırlanır modeli.
  3. K6 job temel yeteneği (2 MP).
  4. Deste 12 → 16 (açık soru 2).
  5. Minion'lı model (açık soru 1) — en son, spec güncellemesi gerektirir.

Devam notu güncellemesi: "Faz 0–1 planı yazıldı, uygulama Görev N'de" + Gate 1 sonucu.

Commit: `docs: gate 1 protocol`

---

## Kapanış kontrol listesi (Faz 1 bitti sayılması için)

- [ ] `pnpm test`, `pnpm typecheck`, `pnpm lint` temiz
- [ ] `rules` içinde DOM/Node/`Math.random`/`Date.now` yok (bekçi testi yeşil)
- [ ] Golden replay ve property testleri yeşil
- [ ] 12 Warrior kartı JSON'da, şemadan geçiyor
- [ ] AI üç profille oynuyor; 900 maçlık duman simülasyonu temiz
- [ ] `pnpm dev` ile tarayıcıda baştan sona maç oynanıyor
- [ ] `docs/gate-1.md` A tablosu dolu, B için Yasin'e teslim edildi
