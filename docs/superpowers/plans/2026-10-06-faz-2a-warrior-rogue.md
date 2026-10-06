# KOIdLe — Faz 2a Uygulama Planı: Ortak + Warrior + Rogue (Asas/Okçu), AI Planı, Deste Kurma, CSS Coşku

> **Tarih:** 2026-10-06 · **Dayanak:** `docs/superpowers/specs/2026-10-06-faz-2-dort-job-design.md` (ONAYLI) · Üst belge: `2026-10-05-koidle-prototype-v0.2.md`
> **Önceki plan:** `2026-10-06-faz-0-1-savas-sandbox.md` (rev. 2, tamam). Çalışma düzeni ve DURUM RAPORU şablonu aynen sürer.
> **Hedef:** Yasin'in oynayacağı Warrior + Rogue dilimi. Mage/Priest Faz 2b'dedir. Faz 2a sonu bir Gate değil, **yön kontrolü**dür (4–6 maç).

> **Claude için talimat:** Görevleri sırayla uygula. Her görev: önce test (kırmızı) → en küçük kod (yeşil) → kapı komutu → commit → push. Bir görev bitmeden sonrakine geçme. Kural değerleri yalnız `content/` JSON'larında durur; kodda sihirli sayı olmaz (UI efekt süreleri hariç, bkz. Görev 9). Spec'te olmayan şey ekleme; "Faz 2b'ye kalan" listesindekilere dokunma.

**Goal:** Dört job'ın ilk yarısını (Warrior, Rogue·Asas, Rogue·Okçu) oynanabilir kılmak: yeni statüler (Lanet, Zehir, Gizli), Zincir ve çoklu vuruş, açılış eli kuralı, 33 kartlık içerik, hazır desteler ve deste kurma ekranı, kombo kurabilen AI tur planı, job matrisi sim'i, CSS coşkusu.

**Architecture:** Kural motoru (`packages/rules`) saf ve deterministik kalır; yeni mekanikler `effects.ts`/`turn.ts`/`status.ts`/`draw.ts` içinde, kural değerleri `content/*.json` + Zod şemasında. `content-schema` kart havuzlarını (ortak/Warrior/Rogue ortak/Asas/Okçu), hazır desteleri, `validateDeck`'i ve `ArchetypeId` tanımını sağlar. `packages/ai` açgözlü seçimi ışın aramasıyla (beam search) genişletir; arama `redactForAi` görünümünde, `cloneState` ile hızlı klonla çalışır. `tools/sim` job ve profil matrisi koşar. `apps/client` akışı: kurulum → deste → savaş; efektler yalnız CSS.

**Tech Stack:** TypeScript (strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes), Zod 4, Vitest 5, fast-check, React 19, Vite 8, Biome, pnpm workspaces.

**Global Constraints:**
- `packages/rules` saf: DOM, Node API, `Math.random`, `Date.now`, `new Map(`/`new Set(` yasak (determinism testi tarar); bağımlılığı yok. Kural değerleri yalnız `content/` JSON'larında.
- Kart adı KO'daki İngilizce skill adı, kart metni Türkçe (F2-1, F2-2). Uluslar, şehirler, item'lar, bosslar, NPC'ler, para birimi ve kişi adı içeren skill adları yok.
- Stun, uyutma, MP kesme, taunt yok (F2-9). Kart başına tek anahtar kelime (F2-8).
- Faz 2b kalemleri (Donma, Ateş, `consumeStatus`, taşan iyileşmenin Kalkan olması, maks HP azaltma, debuff sayımı, Mage/Priest kartları) **bu planda yok**; bkz. "Faz 2b'ye kalan".
- Dil: Türkçe (düzyazı, kod yorumları, UI metni). Kod tanımlayıcıları İngilizce.

## Ortam notları (her görev için geçerli)

- `pnpm` PATH'te değil; `corepack pnpm ...` kullan. `turbo` pnpm'i bulamaz, bu yüzden:
  - test: `corepack pnpm -r test` · tip: `corepack pnpm -r typecheck` · lint: `corepack pnpm lint`
  - tek paket: `corepack pnpm --filter @koidle/rules test` · tek dosya: `corepack pnpm --filter @koidle/rules exec vitest run src/<dosya>.test.ts`
- **Kapı komutu** (her görevin commit öncesi adımı): `corepack pnpm format && corepack pnpm -r test && corepack pnpm -r typecheck && corepack pnpm lint`. Lint import sırası kızarsa: `corepack pnpm exec biome check --write .`.
- Başlangıç: **92 test yeşil.**
- Golden replay yenileme (PowerShell): `$env:UPDATE_REPLAYS='1'; corepack pnpm --filter @koidle/rules test; Remove-Item Env:UPDATE_REPLAYS`
- İçerik (`content/`) değişince: `corepack pnpm --filter @koidle/content-schema values` → `docs/savas-degerleri.md` üretilir (`content.test.ts` bunu zorlar).
- tsconfig: `exactOptionalPropertyTypes` (Zod'da `.exactOptional()`); `noImplicitReturns` yok ama `formatEvent` switch'i her `BattleEvent`'i kapsamak zorunda (aksi halde TS2366). **Yeni olay ekleyen her görev `apps/client/src/format.ts`'e case ekler.** `STATUS_TR: Record<StatusId,string>` yeni statüyle aynı görevde güncellenir. `!` (non-null assertion) kullanma (Biome).
- Commit mesajı İngilizce, conventional; sonuna `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Commit sonrası `git push`.
- Sim süresi ölçümü Görev 6'dadır. Eşik: 900 maç **120 sn** üstündeyse DUR, Yasin'e bildir (seçenek: `content/ai-planner.json`'da beam/depth azaltmak). Kod hilesi yapma.

## DURUM RAPORU şablonu

Şu noktalarda yazılır: **Görev 4 sonu** (rules bitti), **Görev 7 sonu** (sim temeli), **Görev 11 sonu**. Ham test/sim çıktıları raporun sonuna eklenir.

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
COPILOT'UN İNCELEMESİ GEREKEN DOSYALAR: Copilot devre dışı
SIRADAKİ GÖREV:
-----------------------------------------------------
```

## Görev haritası

| # | Görev | Paket | Bağımlı |
|---|---|---|---|
| 1 | Lanet + Zehir statüleri | rules, content, client | — |
| 2 | Gizli + çoklu vuruş | rules, client | 1 |
| 3 | Zincir + Valor koşulu | rules, client | 2 |
| 4 | Açılış eli kuralı + kart meta tipleri (DURUM RAPORU) | rules, content | 3 |
| 5 | İçerik: 33 kart, havuzlar, hazır desteler, `validateDeck` | content, content-schema, tüketiciler | 4 |
| 6 | AI tur planı + klon hızı | rules, ai, content, sim, client | 5 |
| 7 | Sim: job matrisi + yeni metrikler (DURUM RAPORU) | sim | 6 |
| 8 | Client: job/yol seçimi + deste kurma | client | 5, 6 |
| 9 | Coşku (CSS) + okunurluk | client | 8 |
| 10 | Maç formu alanları | client | 8 |
| 11 | Yayın + kapanış (DURUM RAPORU) | client, docs | 7, 9, 10 |

---

## Görev 1 — Lanet + Zehir statüleri (rules)

**Files**
- Modify: `packages/rules/src/types.ts`, `effects.ts`, `turn.ts`, `test-fixtures.ts`
- Modify: `content/battle-config.json`, `packages/content-schema/src/schema.ts`, `values-table.ts`
- Modify: `apps/client/src/format.ts`
- Create: `packages/rules/src/faz2-status.test.ts`
- Regenerate: `docs/savas-degerleri.md`

**Interfaces**
- Consumes: `applyStatus`, `dealDamage`, `statusAmount` (mevcut).
- Produces: `StatusId = 'strength' | 'weak' | 'curse' | 'poison' | 'stealth'` (Gizli'nin davranışı Görev 2'de); `DamageSource` + `'poison'`; `BattleConfig.statuses` her `StatusId` için `{ duration }`; `cardDamage` Lanet'i sayar; `startTurn` Zehir hasarı verir.

- [ ] **Adım 1: Başarısız test yaz** — `packages/rules/src/faz2-status.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { apply } from './engine';
import { addCard, newBattle, setHand, setStatus } from './test-fixtures';
import type { BattleState, PlayerIndex } from './types';

function setup(hand: string[], mp = 8) {
  const { state } = newBattle(1);
  const me = state.active;
  const foe: PlayerIndex = me === 0 ? 1 : 0;
  setHand(state, me, hand, mp);
  return { state, me, foe };
}

const play = (s: BattleState, me: PlayerIndex, i: number) =>
  apply(s, { type: 'PLAY_CARD', player: me, iid: `t${me}-${i}` });
const endTurn = (s: BattleState) => apply(s, { type: 'END_TURN', player: s.active });

describe('Lanet', () => {
  it('raises card damage taken by the curse amount', () => {
    const { state, me, foe } = setup(['hit']);
    setStatus(state, foe, 'curse', 2);
    expect(play(state, me, 0).state.players[foe].hp).toBe(25); // 3 + 2
  });

  it('does not add to poison damage', () => {
    const { state, foe } = setup([]);
    setStatus(state, foe, 'curse', 2);
    setStatus(state, foe, 'poison', 4);
    expect(endTurn(state).state.players[foe].hp).toBe(26);
  });
});

describe('Zehir', () => {
  it('hits at the owner turn start, after TURN_STARTED and before the draw', () => {
    const { state, foe } = setup([]);
    setStatus(state, foe, 'poison', 4);
    const { state: s, events } = endTurn(state);
    expect(s.players[foe].hp).toBe(26);
    const kinds = events.map((e) =>
      e.type === 'DAMAGE_DEALT' ? `DAMAGE_${String(e.source)}` : e.type,
    );
    const started = kinds.indexOf('TURN_STARTED');
    const poison = kinds.indexOf('DAMAGE_poison');
    const drawn = kinds.indexOf('CARD_DRAWN');
    expect(started).toBeGreaterThanOrEqual(0);
    expect(poison).toBeGreaterThan(started);
    expect(drawn).toBeGreaterThan(poison);
  });

  it('lethal poison ends the battle as normalDamage and skips the draw', () => {
    const { state, me, foe } = setup([]);
    state.players[foe].hp = 3;
    setStatus(state, foe, 'poison', 4);
    const { state: s, events } = endTurn(state);
    expect(s.result).toEqual({ winner: me, reason: 'normalDamage' });
    expect(events.some((e) => e.type === 'CARD_DRAWN')).toBe(false);
  });

  it('a card that applies poison 4 ticks exactly twice', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'venom', 1, [
      { kind: 'applyStatus', target: 'enemy', status: 'poison', amount: 4 },
    ]);
    setHand(state, me, ['venom']);
    let s = play(state, me, 0).state;
    expect(s.players[foe].statuses).toContainEqual({ id: 'poison', amount: 4, turnsLeft: 2 });
    const ticks: number[] = [];
    for (let i = 0; i < 6; i++) {
      const r = endTurn(s);
      s = r.state;
      for (const e of r.events) {
        if (e.type === 'DAMAGE_DEALT' && e.source === 'poison') ticks.push(e.amount);
      }
    }
    expect(ticks).toEqual([4, 4]);
  });
});
```

- [ ] **Adım 2: Çalıştır, KIRMIZI gör**

`corepack pnpm --filter @koidle/rules exec vitest run src/faz2-status.test.ts` → beklenen: **FAIL** (Lanet 27≠25, Zehir tik yok, `config.statuses.poison` tanımsız).

- [ ] **Adım 3: En küçük gerçekleme**

`packages/rules/src/types.ts` — üç değişiklik:

```ts
export type StatusId = 'strength' | 'weak' | 'curse' | 'poison' | 'stealth';
```

```ts
  statuses: {
    stacking: 'maxAmountRefreshOnGte';
    tickOn: 'ownerTurnEnd';
  } & Record<StatusId, { duration: number }>;
```

```ts
export type DamageSource = PlayerIndex | 'arena' | 'fatigue' | 'poison';
```

`packages/rules/src/effects.ts` — `cardDamage` değişir (Lanet hedefte okunur):

```ts
/** Kart hasarı = max(0, değer + Güç(kaynak) − Zayıflık(kaynak) + Lanet(hedef)). */
export function cardDamage(state: BattleState, source: PlayerIndex, base: number): number {
  const pl = state.players[source];
  const target = state.players[other(source)];
  return Math.max(
    0,
    base + statusAmount(pl, 'strength') - statusAmount(pl, 'weak') + statusAmount(target, 'curse'),
  );
}
```

`packages/rules/src/turn.ts` — `import { applyStatus...}` gerekmez; `statusAmount` import et ve `pl.mp = pl.maxMp;` satırından sonra, Arena'dan önce ekle:

```ts
import { statusAmount, tickStatuses } from './status';
```

```ts
  pl.mp = pl.maxMp;

  // Zehir: sahibinin tur başında, Arena'dan önce. Lanet Zehir'e eklenmez (yalnız kart hasarı).
  const poison = statusAmount(pl, 'poison');
  if (poison > 0) {
    dealDamage(state, 'poison', p, poison, false, events);
    if (state.result) return;
  }
```

Aynı dosyanın üst yorumu: `tur başlar → Kalkan sıfırlanır → MP → Zehir → Arena hasarı → kart çekme`.

`packages/rules/src/test-fixtures.ts` — `testConfig.statuses` ve `setStatus` tipi:

```ts
  statuses: {
    stacking: 'maxAmountRefreshOnGte',
    tickOn: 'ownerTurnEnd',
    strength: { duration: 2 },
    weak: { duration: 2 },
    curse: { duration: 2 },
    poison: { duration: 2 },
    stealth: { duration: 2 },
  },
```

```ts
import type { BattleConfig, BattleState, CardDef, PlayerIndex, StatusId } from './types';
// ...
export function setStatus(
  state: BattleState,
  p: PlayerIndex,
  id: StatusId,
  amount: number,
  turnsLeft = 2,
): void {
```

`content/battle-config.json` — `statuses` bloğu:

```json
  "statuses": {
    "stacking": "maxAmountRefreshOnGte",
    "tickOn": "ownerTurnEnd",
    "strength": { "duration": 2 },
    "weak": { "duration": 2 },
    "curse": { "duration": 2 },
    "poison": { "duration": 2 },
    "stealth": { "duration": 2 }
  },
```

`packages/content-schema/src/schema.ts` — şema ve statü enum'u:

```ts
  statuses: z.strictObject({
    stacking: z.literal('maxAmountRefreshOnGte'),
    tickOn: z.literal('ownerTurnEnd'),
    strength: z.strictObject({ duration: positive() }),
    weak: z.strictObject({ duration: positive() }),
    curse: z.strictObject({ duration: positive() }),
    poison: z.strictObject({ duration: positive() }),
    stealth: z.strictObject({ duration: positive() }),
  }),
```

```ts
const StatusIdSchema = z.enum(['strength', 'weak', 'curse', 'poison', 'stealth']);
```

`apps/client/src/format.ts`:

```ts
export const STATUS_TR: Record<StatusId, string> = {
  strength: 'Güç',
  weak: 'Zayıflık',
  curse: 'Lanet',
  poison: 'Zehir',
  stealth: 'Gizli',
};
```

`DAMAGE_DEALT` case'inde `fatigue` satırından sonra:

```ts
      if (e.source === 'poison') return `Zehir: ${whose(e.target)} ${e.amount} hasar.`;
```

`apps/client/src/format.test.ts` — `describe('formatEvent')` içine:

```ts
  it('names poison damage', () => {
    expect(
      formatEvent(
        { type: 'DAMAGE_DEALT', source: 'poison', target: 1, amount: 4, absorbed: 0 },
        cards,
      ),
    ).toBe('Zehir: Rakibe 4 hasar.');
  });
```

`packages/content-schema/src/values-table.ts` — `rows()` içinde `Zayıflık süresi` satırından sonra:

```ts
    [
      'Lanet süresi',
      'statuses.curse.duration',
      c.statuses.curse.duration,
      'Hedefin aldığı kart hasarına +değer. Rakibe ya da (Berserker bedeli) kendine verilir',
    ],
    [
      'Zehir süresi',
      'statuses.poison.duration',
      c.statuses.poison.duration,
      `Sahibinin tur başında değer kadar hasar; ${c.statuses.poison.duration} tur başı boyunca`,
    ],
    [
      'Gizli süresi',
      'statuses.stealth.duration',
      c.statuses.stealth.duration,
      'Sonraki hasar kartının ilk vuruşuna +değer ve Kalkanı yok sayma; kullanılınca düşer',
    ],
```

Tur başı sırası metnini değiştir:

```ts
  out.push(
    '**Tur başı sırası (N3, C1):** tur başlar → Kalkan sıfırlanır → maks MP ve MP → Zehir hasarı → Arena hasarı → kart çekme (gerekirse karıştırma veya Yorgunluk). Her sistem hasarından sonra savaş bitti mi bakılır; Zehir ya da Arena öldürürse çekme olmaz.',
  );
```

Kart hasarı formül satırını değiştir:

```ts
  out.push(
    "- Kart hasarı = `max(0, kart değeri + Güç(kaynak) − Zayıflık(kaynak) + Lanet(hedef))`. Önce Kalkan emer, kalanı HP'den düşer (Kalkanı yok sayan kartlar hariç). Zehir hasarı Lanet'ten etkilenmez.",
  );
```

- [ ] **Adım 4: Değer tablosunu yenile, YEŞİL gör**

`corepack pnpm --filter @koidle/content-schema values` sonra `corepack pnpm --filter @koidle/rules exec vitest run src/faz2-status.test.ts` → **PASS**.

- [ ] **Adım 5: Kapı komutu ve commit**

`corepack pnpm format && corepack pnpm -r test && corepack pnpm -r typecheck && corepack pnpm lint` → hepsi yeşil (golden replay'ler değişmez: Zehir yok, statü sırası aynı).

```
git add packages/rules content packages/content-schema apps/client docs/savas-degerleri.md
git commit -m "feat(rules): Curse and Poison statuses, poison tick at turn start" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

---

## Görev 2 — Gizli + çoklu vuruş (rules)

**Files**
- Modify: `packages/rules/src/types.ts`, `status.ts`, `effects.ts`, `preview.ts`
- Modify: `packages/content-schema/src/schema.ts` (yalnız `hits` — Görev 5'te kullanılır; burada eklenir ki `satisfies` bozulmasın)
- Modify: `apps/client/src/format.ts`, `format.test.ts`
- Create: `packages/rules/src/stealth.test.ts`

**Interfaces**
- Consumes: Görev 1'in `StatusId`, `cardDamage`.
- Produces: `Effect.damage.hits?: number`; olay `{ type: 'STEALTH_USED'; player; amount }`; `removeStatus(pl, id)`; `previewCard` çoklu vuruşu ve Gizli'yi hesaba katar.

- [ ] **Adım 1: Başarısız test yaz** — `packages/rules/src/stealth.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { apply } from './engine';
import { previewCard } from './preview';
import { addCard, newBattle, setHand, setStatus } from './test-fixtures';
import type { BattleState, Effect, PlayerIndex } from './types';

function setup(hand: string[], mp = 8) {
  const { state } = newBattle(1);
  const me = state.active;
  const foe: PlayerIndex = me === 0 ? 1 : 0;
  setHand(state, me, hand, mp);
  return { state, me, foe };
}

const play = (s: BattleState, me: PlayerIndex, i: number) =>
  apply(s, { type: 'PLAY_CARD', player: me, iid: `t${me}-${i}` });

// 3 vuruş × 2 hasar
const VOLLEY: Effect[] = [{ kind: 'damage', amount: 2, hits: 3 }];

describe('Gizli', () => {
  it('adds damage to the next hit, ignores shield, then falls off', () => {
    const { state, me, foe } = setup(['hit']);
    setStatus(state, me, 'stealth', 3);
    state.players[foe].shield = 5;
    const { state: s, events } = play(state, me, 0);
    expect(s.players[foe].hp).toBe(24);
    expect(s.players[foe].shield).toBe(5);
    expect(s.players[me].statuses.some((x) => x.id === 'stealth')).toBe(false);
    const kinds = events.map((e) => e.type);
    expect(kinds.indexOf('STEALTH_USED')).toBeGreaterThanOrEqual(0);
    expect(kinds.indexOf('STEALTH_USED')).toBeLessThan(kinds.indexOf('DAMAGE_DEALT'));
    expect(events).toContainEqual({ type: 'STEALTH_USED', player: me, amount: 3 });
    expect(events).toContainEqual({
      type: 'DAMAGE_DEALT',
      source: me,
      target: foe,
      amount: 6,
      absorbed: 0,
    });
  });

  it('applies to the first hit of a volley only; strength applies to every hit', () => {
    const { state, me, foe } = setup(['hit']);
    addCard(state, 'volley', 1, VOLLEY);
    setHand(state, me, ['volley']);
    setStatus(state, me, 'strength', 1);
    setStatus(state, me, 'stealth', 3);
    state.players[foe].shield = 4;
    const { state: s, events } = play(state, me, 0);
    const dmg = events.flatMap((e) => (e.type === 'DAMAGE_DEALT' ? [[e.amount, e.absorbed]] : []));
    expect(dmg).toEqual([
      [6, 0],
      [3, 3],
      [3, 1],
    ]);
    expect(s.players[foe].hp).toBe(22);
  });

  it('a volley stops at lethal damage', () => {
    const { state, me, foe } = setup(['hit']);
    addCard(state, 'volley', 1, VOLLEY);
    setHand(state, me, ['volley']);
    state.players[foe].hp = 3;
    const { events } = play(state, me, 0);
    expect(events.map((e) => e.type)).toEqual([
      'CARD_PLAYED',
      'DAMAGE_DEALT',
      'DAMAGE_DEALT',
      'BATTLE_ENDED',
    ]);
  });

  it('a non-damage card keeps stealth', () => {
    const { state, me } = setup(['guard']);
    setStatus(state, me, 'stealth', 3);
    const s = play(state, me, 0).state;
    expect(s.players[me].statuses).toContainEqual({ id: 'stealth', amount: 3, turnsLeft: 2 });
  });

  it('hit-then-vanish card consumes the old stealth, then grants the new one', () => {
    const { state, me, foe } = setup([]);
    addCard(state, 'vanish', 1, [
      { kind: 'damage', amount: 6 },
      { kind: 'applyStatus', target: 'self', status: 'stealth', amount: 3 },
    ]);
    setHand(state, me, ['vanish']);
    setStatus(state, me, 'stealth', 7);
    const s = play(state, me, 0).state;
    expect(s.players[foe].hp).toBe(17); // 6 + 7
    expect(s.players[me].statuses.find((x) => x.id === 'stealth')?.amount).toBe(3);
  });
});

describe('previewCard with stealth and hits', () => {
  it('shows stealth on a single hit', () => {
    const { state, me } = setup(['hit']);
    setStatus(state, me, 'stealth', 3);
    expect(previewCard(state, me, 'hit').damage).toBe(6);
  });

  it('sums a volley and adds strength to every hit', () => {
    const { state, me } = setup(['hit']);
    addCard(state, 'volley', 1, VOLLEY);
    setStatus(state, me, 'strength', 1);
    expect(previewCard(state, me, 'volley').damage).toBe(9);
    setStatus(state, me, 'stealth', 3);
    expect(previewCard(state, me, 'volley').damage).toBe(12);
  });
});
```

- [ ] **Adım 2: Çalıştır, KIRMIZI gör**

`corepack pnpm --filter @koidle/rules exec vitest run src/stealth.test.ts` → beklenen: **FAIL** (Gizli etkisiz, `hits` yok sayılır).

- [ ] **Adım 3: En küçük gerçekleme**

`types.ts`:

```ts
  | { kind: 'damage'; amount: number; ignoreShield?: boolean; hits?: number; bonus?: DamageBonus }
```

`BattleEvent` birliğine (`STATUS_EXPIRED` satırından sonra):

```ts
  | { type: 'STEALTH_USED'; player: PlayerIndex; amount: number }
```

`status.ts` sonuna:

```ts
/** Statüyü hemen kaldırır (Gizli kullanılınca düşer). */
export function removeStatus(pl: PlayerState, id: StatusId): void {
  pl.statuses = pl.statuses.filter((s) => s.id !== id);
}
```

`effects.ts` — import satırı ve `damage` case'i:

```ts
import { applyStatus, removeStatus, statusAmount } from './status';
```

```ts
    case 'damage': {
      const base = baseDamage(state, source, effect);
      // Çoklu vuruş: her vuruş ayrı hesaplanır. Gizli yalnız ilk vuruşa girer ve Kalkanı yok sayar.
      for (let i = 0; i < (effect.hits ?? 1); i++) {
        const stealth = statusAmount(me, 'stealth');
        if (stealth > 0) {
          removeStatus(me, 'stealth');
          events.push({ type: 'STEALTH_USED', player: source, amount: stealth });
        }
        dealDamage(
          state,
          source,
          enemy,
          cardDamage(state, source, base + stealth),
          stealth > 0 || (effect.ignoreShield ?? false),
          events,
        );
        if (state.result) return;
      }
      return;
    }
```

`preview.ts` — `previewCard` gövdesi:

```ts
  let damage: number | null = null;
  let bonusActive: boolean | null = null;
  // Efektler sırayla çözülür: kartın önce verdiği Kalkan, sonraki Kalkan hasarına sayılır.
  let shieldGained = state.players[p].shieldGainedThisTurn;
  // Gizli yalnız kartın ilk vuruşuna girer (motorla aynı sıra).
  let stealth = statusAmount(state.players[p], 'stealth');
  for (const e of def.effects) {
    if (e.kind === 'damage') {
      const base = baseDamage(state, p, e);
      for (let i = 0; i < (e.hits ?? 1); i++) {
        damage = (damage ?? 0) + cardDamage(state, p, base + stealth);
        stealth = 0;
      }
      if (e.bonus) bonusActive = conditionMet(state, p, e.bonus.if);
    } else if (e.kind === 'damageFromShieldGainedThisTurn') {
      damage = (damage ?? 0) + cardDamage(state, p, shieldGained);
    } else if (e.kind === 'shield') {
      shieldGained += e.amount;
    }
  }
  return { damage, bonusActive };
```

`preview.ts` import: `import { statusAmount } from './status';`

`schema.ts` — `damage` efektine `hits`:

```ts
    hits: z.int().min(2).exactOptional(),
```
(`ignoreShield` satırından sonra.)

`apps/client/src/format.ts` — `STATUS_EXPIRED` case'inden sonra:

```ts
    case 'STEALTH_USED':
      return `Gizli: +${e.amount} hasar, Kalkanı yok sayar.`;
```

`apps/client/src/format.test.ts` — `describe('formatEvent')` içine:

```ts
  it('describes stealth', () => {
    expect(formatEvent({ type: 'STEALTH_USED', player: 0, amount: 3 }, cards)).toBe(
      'Gizli: +3 hasar, Kalkanı yok sayar.',
    );
  });
```

- [ ] **Adım 4: YEŞİL gör** — `corepack pnpm --filter @koidle/rules exec vitest run src/stealth.test.ts` → **PASS**.

- [ ] **Adım 5: Kapı komutu ve commit**

```
git add packages/rules packages/content-schema apps/client
git commit -m "feat(rules): Stealth status and multi-hit damage" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

---

## Görev 3 — Zincir + Valor koşulu (rules)

**Files**
- Create: `packages/rules/src/assert-never.ts`, `packages/rules/src/chain.test.ts`
- Modify: `packages/rules/src/types.ts`, `effects.ts`, `preview.ts`, `battle.ts`, `turn.ts`, `engine.ts`, `index.ts`, `index.test.ts`, `properties.test.ts`
- Modify: `packages/rules/src/test-fixtures.ts` yok; golden replay dosyaları yenilenir (`packages/rules/test/replays/*.json`)
- Modify: `packages/content-schema/src/schema.ts`, `apps/client/src/format.ts`, `format.test.ts`

**Interfaces**
- Consumes: Görev 2'nin `damage` case'i.
- Produces: `PlayerState.cardsPlayedThisTurn`; `Condition` + `{ cardsPlayedAtLeast: number }` + `{ selfHpAtMost: number }`; `Bonus` (eski `DamageBonus`); `heal.bonus?: Bonus`; olay `{ type: 'CHAIN_TRIGGERED'; player; chain }`; `bonusValue`, `healAmount` (effects.ts); `assertNever`; `RULES_VERSION = '0.2.0'`.

- [ ] **Adım 1: Başarısız test yaz** — `packages/rules/src/chain.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { apply } from './engine';
import { previewCard } from './preview';
import { addCard, newBattle, setHand } from './test-fixtures';
import type { BattleState, PlayerIndex } from './types';

function setup(hand: string[], mp = 8) {
  const { state } = newBattle(1);
  const me = state.active;
  const foe: PlayerIndex = me === 0 ? 1 : 0;
  addCard(state, 'jab', 1, [
    { kind: 'damage', amount: 2, bonus: { if: { cardsPlayedAtLeast: 1 }, amount: 2 } },
  ]);
  addCard(state, 'valor-like', 2, [
    { kind: 'heal', amount: 4, bonus: { if: { selfHpAtMost: 15 }, amount: 4 } },
  ]);
  setHand(state, me, hand, mp);
  return { state, me, foe };
}

const play = (s: BattleState, me: PlayerIndex, i: number) =>
  apply(s, { type: 'PLAY_CARD', player: me, iid: `t${me}-${i}` });
const endTurn = (s: BattleState) => apply(s, { type: 'END_TURN', player: s.active });

describe('Zincir', () => {
  it('the first card of the turn gets no chain bonus', () => {
    const { state, me, foe } = setup(['jab']);
    const { state: s, events } = play(state, me, 0);
    expect(s.players[foe].hp).toBe(28);
    expect(events.some((e) => e.type === 'CHAIN_TRIGGERED')).toBe(false);
  });

  it('a second card gets the bonus and announces the chain before the damage', () => {
    const { state, me, foe } = setup(['hit', 'jab']);
    const s1 = play(state, me, 0).state;
    expect(s1.players[me].cardsPlayedThisTurn).toBe(1);
    const { state: s2, events } = play(s1, me, 1);
    expect(s2.players[foe].hp).toBe(23); // 3 + (2 + 2)
    expect(events).toContainEqual({ type: 'CHAIN_TRIGGERED', player: me, chain: 2 });
    const kinds = events.map((e) => e.type);
    expect(kinds.indexOf('CHAIN_TRIGGERED')).toBeLessThan(kinds.indexOf('DAMAGE_DEALT'));
  });

  it('the counter resets at the start of the own next turn', () => {
    const { state, me, foe } = setup(['hit']);
    let s = play(state, me, 0).state;
    expect(s.players[me].cardsPlayedThisTurn).toBe(1);
    s = endTurn(s).state;
    expect(s.active).toBe(foe);
    s = endTurn(s).state;
    expect(s.active).toBe(me);
    expect(s.players[me].cardsPlayedThisTurn).toBe(0);
  });

  it('preview bonusActive flips after one card', () => {
    const { state, me } = setup(['hit', 'jab']);
    expect(previewCard(state, me, 'jab')).toEqual({ damage: 2, bonusActive: false });
    const s = play(state, me, 0).state;
    expect(previewCard(s, me, 'jab')).toEqual({ damage: 4, bonusActive: true });
  });
});

describe('Valor: heal bonus at low HP', () => {
  it('heals 4 above the threshold', () => {
    const { state, me } = setup(['valor-like']);
    state.players[me].hp = 20;
    expect(play(state, me, 0).state.players[me].hp).toBe(24);
  });

  it('heals 8 at or below the threshold and previews it', () => {
    const { state, me } = setup(['valor-like']);
    state.players[me].hp = 10;
    expect(previewCard(state, me, 'valor-like').bonusActive).toBe(true);
    expect(play(state, me, 0).state.players[me].hp).toBe(18);
  });

  it('is still capped by max HP', () => {
    const { state, me } = setup(['valor-like']);
    state.players[me].hp = 15;
    state.players[me].maxHp = 20;
    expect(play(state, me, 0).state.players[me].hp).toBe(20);
  });
});
```

`packages/rules/src/properties.test.ts` — `checkInvariants` içindeki sayı listesine `p.cardsPlayedThisTurn` ekle:

```ts
    for (const n of [
      p.hp,
      p.mp,
      p.maxMp,
      p.shield,
      p.shieldGainedThisTurn,
      p.fatigueCount,
      p.cardsPlayedThisTurn,
    ]) {
      expect(Number.isInteger(n)).toBe(true);
    }
```

`packages/rules/src/index.test.ts`: `expect(RULES_VERSION).toBe('0.2.0');`

- [ ] **Adım 2: Çalıştır, KIRMIZI gör**

`corepack pnpm --filter @koidle/rules test` → beklenen: chain.test, properties.test, index.test **FAIL**.

- [ ] **Adım 3: En küçük gerçekleme**

`packages/rules/src/assert-never.ts`:

```ts
/** Birlik tipi genişleyip bir case unutulursa derleme hatası verir; çalışırken de fırlatır. */
export function assertNever(x: never): never {
  throw new Error(`Beklenmeyen değer: ${JSON.stringify(x)}`);
}
```

`types.ts`:

```ts
/** Combat v0.2: kartın koşullu bonusu. Koşul kart oynandığı an değerlendirilir. */
export type Condition =
  | { selfHas: StatusId }
  | { enemyHas: StatusId }
  | { enemyHpAtMost: number }
  | { selfHpAtMost: number }
  | { cardsPlayedAtLeast: number };

export interface Bonus {
  if: Condition;
  amount: number;
}

export type Effect =
  | { kind: 'damage'; amount: number; ignoreShield?: boolean; hits?: number; bonus?: Bonus }
  | { kind: 'damageFromShieldGainedThisTurn' }
  | { kind: 'shield'; amount: number }
  | { kind: 'heal'; amount: number; bonus?: Bonus }
  | { kind: 'draw'; count: number }
  | { kind: 'applyStatus'; target: 'self' | 'enemy'; status: StatusId; amount: number };
```

`PlayerState`'e (`shieldGainedThisTurn`'den sonra):

```ts
  /** Bu tur oynanan kart sayısı (Zincir). Sahibinin tur başında 0 olur; kart çözüldükten sonra artar. */
  cardsPlayedThisTurn: number;
```

`BattleEvent`'e: `| { type: 'CHAIN_TRIGGERED'; player: PlayerIndex; chain: number }`

`battle.ts` `newPlayer` içine `cardsPlayedThisTurn: 0,` (`shieldGainedThisTurn: 0,` sonrası). `turn.ts`: `pl.shieldGainedThisTurn = 0;` satırından sonra `pl.cardsPlayedThisTurn = 0;`. `engine.ts`: efekt döngüsünden sonra, `pl.discard.push(inst)`'ten önce `pl.cardsPlayedThisTurn += 1;`.

`index.ts`: `RULES_VERSION = '0.2.0'`.

`effects.ts` — tam dosya (Görev 1-2 değişiklikleri dahil):

```ts
import { assertNever } from './assert-never';
import { drawCard } from './draw';
import { dealDamage, other } from './outcome';
import { applyStatus, removeStatus, statusAmount } from './status';
import type { BattleEvent, BattleState, Bonus, Condition, Effect, PlayerIndex } from './types';

export function conditionMet(state: BattleState, source: PlayerIndex, cond: Condition): boolean {
  if ('selfHas' in cond) return statusAmount(state.players[source], cond.selfHas) > 0;
  if ('enemyHas' in cond) return statusAmount(state.players[other(source)], cond.enemyHas) > 0;
  if ('enemyHpAtMost' in cond) return state.players[other(source)].hp <= cond.enemyHpAtMost;
  if ('selfHpAtMost' in cond) return state.players[source].hp <= cond.selfHpAtMost;
  if ('cardsPlayedAtLeast' in cond) {
    return state.players[source].cardsPlayedThisTurn >= cond.cardsPlayedAtLeast;
  }
  return assertNever(cond);
}

/** Koşul sağlanıyorsa bonus tutarı, değilse 0. */
export function bonusValue(
  state: BattleState,
  source: PlayerIndex,
  bonus: Bonus | undefined,
): number {
  return bonus && conditionMet(state, source, bonus.if) ? bonus.amount : 0;
}

/** Kartın taban hasarı + koşul sağlanıyorsa bonusu (Güç/Zayıflık/Lanet hariç). */
export function baseDamage(
  state: BattleState,
  source: PlayerIndex,
  effect: Extract<Effect, { kind: 'damage' }>,
): number {
  return effect.amount + bonusValue(state, source, effect.bonus);
}

/** İyileşme tutarı (maks HP sınırından önce). */
export function healAmount(
  state: BattleState,
  source: PlayerIndex,
  effect: Extract<Effect, { kind: 'heal' }>,
): number {
  return effect.amount + bonusValue(state, source, effect.bonus);
}

/** Kart hasarı = max(0, değer + Güç(kaynak) − Zayıflık(kaynak) + Lanet(hedef)). */
export function cardDamage(state: BattleState, source: PlayerIndex, base: number): number {
  const pl = state.players[source];
  const target = state.players[other(source)];
  return Math.max(
    0,
    base + statusAmount(pl, 'strength') - statusAmount(pl, 'weak') + statusAmount(target, 'curse'),
  );
}

/** Zincir bonusu sağlanıyorsa "ZİNCİR ×N" olayı yazar (N = bu kartla birlikte oynanan sayısı). */
function noteChain(
  state: BattleState,
  source: PlayerIndex,
  bonus: Bonus | undefined,
  events: BattleEvent[],
): void {
  if (bonus && 'cardsPlayedAtLeast' in bonus.if && conditionMet(state, source, bonus.if)) {
    events.push({
      type: 'CHAIN_TRIGGERED',
      player: source,
      chain: state.players[source].cardsPlayedThisTurn + 1,
    });
  }
}

export function resolveEffect(
  state: BattleState,
  source: PlayerIndex,
  effect: Effect,
  events: BattleEvent[],
): void {
  const me = state.players[source];
  const enemy = other(source);
  switch (effect.kind) {
    case 'damage': {
      const base = baseDamage(state, source, effect);
      noteChain(state, source, effect.bonus, events);
      // Çoklu vuruş: her vuruş ayrı hesaplanır. Gizli yalnız ilk vuruşa girer ve Kalkanı yok sayar.
      for (let i = 0; i < (effect.hits ?? 1); i++) {
        const stealth = statusAmount(me, 'stealth');
        if (stealth > 0) {
          removeStatus(me, 'stealth');
          events.push({ type: 'STEALTH_USED', player: source, amount: stealth });
        }
        dealDamage(
          state,
          source,
          enemy,
          cardDamage(state, source, base + stealth),
          stealth > 0 || (effect.ignoreShield ?? false),
          events,
        );
        if (state.result) return;
      }
      return;
    }
    case 'damageFromShieldGainedThisTurn':
      dealDamage(
        state,
        source,
        enemy,
        cardDamage(state, source, me.shieldGainedThisTurn),
        false,
        events,
      );
      return;
    case 'shield':
      me.shield += effect.amount;
      me.shieldGainedThisTurn += effect.amount;
      events.push({ type: 'SHIELD_GAINED', player: source, amount: effect.amount });
      return;
    case 'heal': {
      noteChain(state, source, effect.bonus, events);
      const amount = Math.min(healAmount(state, source, effect), me.maxHp - me.hp);
      me.hp += amount;
      events.push({ type: 'HEALED', player: source, amount });
      return;
    }
    case 'draw':
      for (let i = 0; i < effect.count; i++) {
        drawCard(state, source, events);
        if (state.result) return;
      }
      return;
    case 'applyStatus':
      applyStatus(
        state,
        effect.target === 'self' ? source : enemy,
        effect.status,
        effect.amount,
        events,
      );
      return;
    default:
      return assertNever(effect);
  }
}
```

`preview.ts` — `bonusActive` heal bonusunu da kapsar (`damageFromShield...` dalından önce ekle):

```ts
    } else if (e.kind === 'heal') {
      if (e.bonus) bonusActive = conditionMet(state, p, e.bonus.if);
    } else if (e.kind === 'damageFromShieldGainedThisTurn') {
```
(`if (e.kind === 'damage') {...}` bloğunun hemen ardına `else if (e.kind === 'heal')` gelir; mevcut zincir `else if` ile sürer.)

`schema.ts` — şema yeni koşulları ve heal bonusunu tanısın:

```ts
export const ConditionSchema = z.union([
  z.strictObject({ selfHas: StatusIdSchema }),
  z.strictObject({ enemyHas: StatusIdSchema }),
  z.strictObject({ enemyHpAtMost: positive() }),
  z.strictObject({ selfHpAtMost: positive() }),
  z.strictObject({ cardsPlayedAtLeast: positive() }),
]);

const BonusSchema = z.strictObject({ if: ConditionSchema, amount: positive() });
```

`EffectSchema` içinde `damage`'ın `bonus` satırı `bonus: BonusSchema.exactOptional(),`; `heal`:

```ts
  z.strictObject({
    kind: z.literal('heal'),
    amount: positive(),
    bonus: BonusSchema.exactOptional(),
  }),
```

`apps/client/src/format.ts` — `STEALTH_USED` case'inden sonra:

```ts
    case 'CHAIN_TRIGGERED':
      return `Zincir ×${e.chain}!`;
```
`format.test.ts`:

```ts
  it('describes the chain', () => {
    expect(formatEvent({ type: 'CHAIN_TRIGGERED', player: 0, chain: 2 }, cards)).toBe(
      'Zincir ×2!',
    );
  });
```

- [ ] **Adım 4: Golden replay'leri yenile ve YEŞİL gör**

`PlayerState` değişti → replay'ler bilerek yenilenir (PowerShell):

```
$env:UPDATE_REPLAYS='1'; corepack pnpm --filter @koidle/rules test; Remove-Item Env:UPDATE_REPLAYS
corepack pnpm --filter @koidle/rules test
```
→ ikinci koşu **PASS**. `git diff packages/rules/test/replays` yalnız `cardsPlayedThisTurn` alanlarını eklemeli (olay listesi aynı); başka fark çıkarsa DUR ve nedenini bul.

- [ ] **Adım 5: Kapı komutu ve commit**

```
git add packages/rules packages/content-schema apps/client
git commit -m "feat(rules): Chain counter, HP-threshold heal bonus, exhaustive effect switch (rules 0.2.0)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

---

## Görev 4 — Açılış eli kuralı + kart meta tipleri (rules)

**Files**
- Create: `packages/rules/src/cards.ts`, `packages/rules/src/opening.test.ts`
- Modify: `packages/rules/src/types.ts`, `draw.ts`, `battle.ts`, `index.ts`, `test-fixtures.ts`
- Modify: `content/battle-config.json`, `packages/content-schema/src/schema.ts`, `load.ts`, `values-table.ts`
- Regenerate: golden replay'ler, `docs/savas-degerleri.md`

**Interfaces**
- Consumes: `shuffle` (rng), `drawCard`.
- Produces: `Job = 'warrior' | 'rogue'`; `Branch = 'assassin' | 'archer'`; `CardTag = 'heavy'`; `CardDef.job: Job | 'common'`, `branch?: Branch`, `tags?: CardTag[]`; `isHeavy(card)`, `isOpener(card, config)`; `BattleConfig.hand.openingGuarantee: boolean`; `drawOpeningHand(state, p, events)`.

- [ ] **Adım 1: Başarısız test yaz** — `packages/rules/src/opening.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { createBattle } from './battle';
import { isHeavy, isOpener } from './cards';
import { testCards, testConfig } from './test-fixtures';
import type { BattleConfig, CardDef, CardTag } from './types';

const heavyTag: CardTag[] = ['heavy'];
// 'heavy' ve 'pierce' Ağır sayılır; açılış adayı (MP ≤ 1) yalnız 'hit'.
const cards: CardDef[] = testCards.map((c) =>
  c.id === 'heavy' || c.id === 'pierce' ? { ...c, tags: heavyTag } : c,
);
const deck = [
  'hit',
  'heavy',
  'pierce',
  'bash',
  'rally',
  'wall',
  'mend',
  'surge',
  'ruin',
  'bash',
  'rally',
  'wall',
];
const withFlag = (openingGuarantee: boolean): BattleConfig => ({
  ...testConfig,
  hand: { ...testConfig.hand, openingGuarantee },
});

const battle = (seed: number, config: BattleConfig) =>
  createBattle({ config, cards, decks: [deck, deck], names: ['A', 'B'], seed }).state;

describe('card helpers', () => {
  it('isHeavy reads the tag, isOpener compares cost to the starting MP', () => {
    const byId = (id: string) => cards.find((c) => c.id === id) as CardDef;
    expect(isHeavy(byId('heavy'))).toBe(true);
    expect(isHeavy(byId('hit'))).toBe(false);
    expect(isOpener(byId('hit'), testConfig)).toBe(true);
    expect(isOpener(byId('mend'), testConfig)).toBe(false);
  });
});

describe('opening hand guarantee (F2-7)', () => {
  it('has no heavy card and at least one opener for 200 seeds', () => {
    const config = withFlag(true);
    for (let seed = 0; seed < 200; seed++) {
      const s = battle(seed, config);
      const iids: string[] = [];
      for (const pl of s.players) {
        const ids = pl.hand.map((c) => c.cardId);
        expect(ids, `seed ${seed}`).not.toContain('heavy');
        expect(ids, `seed ${seed}`).not.toContain('pierce');
        expect(ids, `seed ${seed}`).toContain('hit');
        expect(pl.deck.length + pl.hand.length + pl.discard.length).toBe(12);
        iids.push(...[...pl.deck, ...pl.hand, ...pl.discard].map((c) => c.iid));
      }
      expect(new Set(iids).size).toBe(iids.length);
    }
  });

  it('without the flag heavy cards do show up in the opening hand', () => {
    const config = withFlag(false);
    let seen = false;
    for (let seed = 0; seed < 200 && !seen; seed++) {
      seen = battle(seed, config).players.some((pl) =>
        pl.hand.some((c) => c.cardId === 'heavy' || c.cardId === 'pierce'),
      );
    }
    expect(seen).toBe(true);
  });
});
```

- [ ] **Adım 2: Çalıştır, KIRMIZI gör** — `corepack pnpm --filter @koidle/rules exec vitest run src/opening.test.ts` → **FAIL** (`./cards` yok).

- [ ] **Adım 3: En küçük gerçekleme**

`types.ts`:

```ts
export type Job = 'warrior' | 'rogue';
export type Branch = 'assassin' | 'archer';
export type CardTag = 'heavy';
```

```ts
export interface CardDef {
  id: string;
  name: string;
  job: Job | 'common';
  /** Yalnız Rogue kartlarında; Rogue ortak kartlarında yok. */
  branch?: Branch;
  /** 'heavy' = Ağır: destede en fazla `deckBuilding.maxHeavy`, açılış eline gelmez. */
  tags?: CardTag[];
  type: CardType;
  cost: number;
  effects: Effect[];
  text: string;
}
```
`BattleConfig.hand` içine `openingGuarantee: boolean;` ekle (`firstPlayerSkipsFirstDraw`'tan sonra).

`packages/rules/src/cards.ts`:

```ts
import type { BattleConfig, CardDef } from './types';

/** Ağır kart: açılış eline gelmez, destede sayısı sınırlıdır. */
export const isHeavy = (card: CardDef): boolean => card.tags?.includes('heavy') ?? false;

/** Açılış kartı: ilk turda oynanabilir (maliyet ≤ başlangıç MP'si). */
export const isOpener = (card: CardDef, config: BattleConfig): boolean =>
  card.cost <= config.mp.start;
```

`draw.ts` — import'lara `CardInstance` ve `isHeavy`/`isOpener`; sona ekle:

```ts
import { isHeavy, isOpener } from './cards';
import type { BattleEvent, BattleState, CardInstance, PlayerIndex } from './types';
```

```ts
/**
 * Açılış eli (F2-7): bayrak açıksa karışık destenin ilk `starting` Ağır olmayan kartı ele gider;
 * elde 1 MP'lik kart yoksa son seçilen, kalanlardan ilk Ağır olmayan açılış kartıyla değişir.
 * Kalan kartlar yeniden karıştırılır. Bayrak kapalıysa eski davranış (sırayla çek).
 */
export function drawOpeningHand(state: BattleState, p: PlayerIndex, events: BattleEvent[]): void {
  const pl = state.players[p];
  const { starting, openingGuarantee } = state.config.hand;
  if (openingGuarantee) {
    const defOf = (c: CardInstance) => state.cards[c.cardId];
    const picked: CardInstance[] = [];
    const rest: CardInstance[] = [];
    for (const c of pl.deck) {
      const def = defOf(c);
      if (picked.length < starting && def && !isHeavy(def)) picked.push(c);
      else rest.push(c);
    }
    const hasOpener = picked.some((c) => {
      const def = defOf(c);
      return def !== undefined && isOpener(def, state.config);
    });
    if (!hasOpener && picked.length > 0) {
      const at = rest.findIndex((c) => {
        const def = defOf(c);
        return def !== undefined && !isHeavy(def) && isOpener(def, state.config);
      });
      if (at >= 0) {
        const swapped = picked.pop();
        const [opener] = rest.splice(at, 1);
        if (swapped && opener) {
          picked.push(opener);
          rest.push(swapped);
        }
      }
    }
    pl.deck = [...picked, ...shuffle(state, rest)];
  }
  for (let i = 0; i < starting; i++) drawCard(state, p, events);
}
```

`battle.ts`: `import { drawOpeningHand } from './draw';` (drawCard import'unu kaldır) ve döngü:

```ts
  for (const p of [0, 1] as const) drawOpeningHand(state, p, events);
```

`index.ts`: `export { isHeavy, isOpener } from './cards';`

`test-fixtures.ts`: `hand: { starting: 4, limit: 8, drawPerTurn: 1, firstPlayerSkipsFirstDraw: true, openingGuarantee: false },`. Fixture `card()` yardımcısındaki `job: 'warrior'` kalır.

`content/battle-config.json`: `"hand": { "starting": 4, "limit": 8, "drawPerTurn": 1, "firstPlayerSkipsFirstDraw": true, "openingGuarantee": true },`

`schema.ts` `hand` nesnesine `openingGuarantee: z.boolean(),`.

`load.ts` — `Job` genişleyince tipler kırılmasın (kalıcı yeniden yazım Görev 5'te):

```ts
const CARD_FILES: { warrior: unknown } = { warrior: warriorJson };

export function loadCards(job: 'warrior'): CardDef[] {
  return parseCards(CARD_FILES[job], `content/cards/${job}.json`);
}

/** Faz 1: job havuzundaki her karttan birer tane (deste boyutu config'den doğrulanır). */
export function defaultDeck(job: 'warrior'): string[] {
  return loadCards(job).map((c) => c.id);
}
```
(`Job` import'unu `import type { BattleConfig, CardDef } from '@koidle/rules';` olarak düzelt.)

`values-table.ts` `rows()` — `firstPlayerSkipsFirstDraw` satırından sonra:

```ts
    [
      'Açılış eli garantisi',
      'hand.openingGuarantee',
      c.hand.openingGuarantee,
      `F2-7: başlangıç eline Ağır kart gelmez; elde en az bir ${c.mp.start} MP'lik kart olur`,
    ],
```

- [ ] **Adım 4: Replay'leri yenile, değer tablosunu yenile, YEŞİL gör**

```
$env:UPDATE_REPLAYS='1'; corepack pnpm --filter @koidle/rules test; Remove-Item Env:UPDATE_REPLAYS
corepack pnpm --filter @koidle/content-schema values
corepack pnpm -r test
```
→ **PASS**. Replay farkı yalnız config'e eklenen `openingGuarantee: false` olmalı (testConfig bayrağı kapalı: çekiş sırası aynı).

- [ ] **Adım 5: Kapı komutu ve commit**

```
git add packages content docs/savas-degerleri.md apps
git commit -m "feat(rules): opening hand guarantee, card job/branch/tags types" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

- [ ] **Adım 6: DURUM RAPORU (rules bitti)** — şablonu doldur; testler: `corepack pnpm -r test` toplam sayısı, `typecheck`, `lint` çıktıları. Raporu Yasin'e ilet. Spec'ten sapma notu: `Job` tipi Faz 2a'da `'warrior' | 'rogue'` (Mage/Priest 2b'de eklenir).

---

## Görev 5 — İçerik: 33 kart, havuzlar, hazır desteler, `validateDeck`

**Files**
- Create: `content/cards/common.json`, `content/cards/rogue.json`, `content/decks/{warrior,assassin,archer}.json`
- Replace: `content/cards/warrior.json` (eski 12 kart tümüyle gider)
- Modify: `content/battle-config.json`, `packages/rules/src/types.ts`, `test-fixtures.ts`
- Create: `packages/content-schema/src/archetypes.ts`, `deck.ts`
- Modify: `packages/content-schema/src/schema.ts`, `load.ts`, `index.ts`, `values-table.ts`, `values-doc.ts`
- Replace: `packages/content-schema/src/content.test.ts`
- Modify (tüketiciler): `packages/ai/src/ai.test.ts`, `tools/sim/src/load-input.ts`, `apps/client/src/content.ts`
- Regenerate: golden replay'ler, `docs/savas-degerleri.md`

**Interfaces**
- Consumes: `isHeavy`, `isOpener`, `CardDef.job/branch/tags` (Görev 4), Görev 1–3 efekt şekilleri.
- Produces:
  - `ArchetypeId = 'warrior' | 'assassin' | 'archer'`, `ARCHETYPES`, `ARCHETYPE_IDS`, `archetype(id)`, `inPool(card, a)`.
  - `parseCards(raw, file, job)`, `loadAllCards()`, `loadPool(id)`, `loadPresetDeck(id)`, `loadPresetDecks()` (eski `loadCards`/`defaultDeck` **kalkar**).
  - `validateDeck(deck, archetypeId, cards, config): string[]`, `deckStats(deck, cards, config): { size; heavy; openers }`.
  - `BattleConfig.deckBuilding: { maxHeavy; minOpeners }` (motor yok sayar).
  - `renderValuesTable(config, cards, ai, decks)`.

- [ ] **Adım 1: Başarısız testleri yaz** — `packages/content-schema/src/content.test.ts` tümüyle şu olur:

```ts
import { readFileSync } from 'node:fs';
import battleConfigJson from '@koidle/content/battle-config.json';
import commonJson from '@koidle/content/cards/common.json';
import rogueJson from '@koidle/content/cards/rogue.json';
import warriorJson from '@koidle/content/cards/warrior.json';
import { apply, createBattle, isHeavy } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import {
  ARCHETYPE_IDS,
  type ArchetypeId,
  ContentError,
  deckStats,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPool,
  loadPresetDeck,
  loadPresetDecks,
  parseBattleConfig,
  parseCards,
  validateDeck,
} from './index';
import { valuesDocPath, valuesDocText } from './values-doc';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const config = loadBattleConfig();
const cards = loadAllCards();
const issues = (deck: string[], id: ArchetypeId) => validateDeck(deck, id, cards, config);

describe('real content', () => {
  it('loads and validates', () => {
    expect(loadBattleConfig().hero.hp).toBeGreaterThan(0);
    expect(loadAiProfiles().balanced).toBeDefined();
  });

  it('33 cards, ids unique across files', () => {
    expect(cards).toHaveLength(33);
    expect(new Set(cards.map((c) => c.id)).size).toBe(33);
    const ids = [...commonJson, ...warriorJson, ...rogueJson].map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(ARCHETYPE_IDS)('%s pool: 16 cards, exactly 3 heavy', (id) => {
    const pool = loadPool(id);
    expect(pool).toHaveLength(16);
    expect(pool.filter(isHeavy)).toHaveLength(3);
  });

  it('a Rogue branch never leaks into the other branch pool', () => {
    expect(loadPool('assassin').some((c) => c.branch === 'archer')).toBe(false);
    expect(loadPool('archer').some((c) => c.branch === 'assassin')).toBe(false);
    expect(loadPool('warrior').some((c) => c.job === 'rogue')).toBe(false);
  });

  it.each(ARCHETYPE_IDS)('%s preset deck is valid and starts a battle', (id) => {
    const deck = loadPresetDeck(id);
    expect(deck).toHaveLength(config.deck.size);
    expect(issues(deck, id)).toEqual([]);
    const stats = deckStats(deck, cards, config);
    expect(stats.heavy).toBeLessThanOrEqual(config.deckBuilding.maxHeavy);
    expect(stats.openers).toBeGreaterThanOrEqual(config.deckBuilding.minOpeners);
    const { state } = createBattle({
      config,
      cards,
      decks: [deck, deck],
      names: ['A', 'B'],
      seed: 1,
    });
    expect(state.players[0].hp).toBe(config.hero.hp);
  });

  it('loadPresetDecks returns all three', () => {
    expect(Object.keys(loadPresetDecks()).sort()).toEqual(['archer', 'assassin', 'warrior']);
  });

  it('Stab → Thrust → Spike deals 19 in one turn (real content)', () => {
    const deck = loadPresetDeck('assassin');
    const { state } = createBattle({
      config,
      cards,
      decks: [deck, deck],
      names: ['A', 'B'],
      seed: 1,
    });
    const me = state.active;
    const foe = me === 0 ? 1 : 0;
    const pl = state.players[me];
    pl.hand = ['stab', 'thrust', 'spike'].map((cardId, i) => ({ iid: `c${i}`, cardId }));
    pl.mp = 6;
    pl.maxMp = 6;
    let s = state;
    for (let i = 0; i < 3; i++) s = apply(s, { type: 'PLAY_CARD', player: me, iid: `c${i}` }).state;
    expect(s.players[foe].hp).toBe(config.hero.hp - 19);
  });

  it('docs/savas-degerleri.md is generated from content (C2, N7)', () => {
    const onDisk = readFileSync(valuesDocPath, 'utf8');
    expect(onDisk, 'docs/savas-degerleri.md güncel değil: pnpm values çalıştır').toBe(
      valuesDocText(),
    );
  });
});

describe('validateDeck', () => {
  const warrior = loadPresetDeck('warrior');

  it('13 cards', () => {
    expect(issues([...warrior, 'valor'], 'warrior').join('\n')).toMatch(/12 kart/);
  });

  it('duplicate card', () => {
    const deck = [...warrior.slice(0, 11), warrior[0] ?? ''];
    expect(issues(deck, 'warrior').join('\n')).toMatch(/birden fazla/);
  });

  it('unknown card', () => {
    const deck = ['yok-boyle-kart', ...warrior.slice(1)];
    expect(issues(deck, 'warrior').join('\n')).toMatch(/bilinmeyen/);
  });

  it('an Assassin card in an Archer deck', () => {
    const deck = loadPresetDeck('archer').map((id) => (id === 'viper' ? 'stab' : id));
    expect(issues(deck, 'archer').join('\n')).toMatch(/Stab.*havuzunda değil/);
  });

  it('3 heavy cards', () => {
    const deck = warrior.map((id) => (id === 'sprint' ? 'wall-of-iron' : id));
    expect(issues(deck, 'warrior').join('\n')).toMatch(/Ağır kart en fazla 2/);
  });

  it('only 2 one-MP cards', () => {
    const deck = [
      'leg-cutting',
      'berserker',
      'iron-skin',
      'cleave',
      'howling-sword',
      'valor',
      'guclu-vurus',
      'wall-of-iron',
      'sword-dancing',
      'hell-blade',
      'gozdagi',
      'sprint',
    ];
    expect(deckStats(deck, cards, config)).toEqual({ size: 12, heavy: 3, openers: 2 });
    expect(issues(deck, 'warrior').join('\n')).toMatch(/MP'lik kart gerekli/);
  });
});

describe('invalid content stops with a readable message', () => {
  type RawCard = Record<string, unknown>;
  const cardsError = (mutate: (card: (i: number) => RawCard) => void): string => {
    const list = clone(warriorJson) as RawCard[];
    mutate((i) => {
      const c = list[i];
      if (!c) throw new Error(`kart ${i} yok`);
      return c;
    });
    try {
      parseCards(list, 'content/cards/warrior.json', 'warrior');
    } catch (e) {
      expect(e).toBeInstanceOf(ContentError);
      return (e as Error).message;
    }
    throw new Error('beklenen hata gelmedi');
  };

  it('negative cost', () => {
    expect(
      cardsError((c) => {
        c(0).cost = -1;
      }),
    ).toMatch(/content\/cards\/warrior\.json[\s\S]*\[0\]\.cost/);
  });

  it('unknown effect kind', () => {
    expect(
      cardsError((c) => {
        c(3).effects = [{ kind: 'hasar', amount: 3 }];
      }),
    ).toMatch(/\[3\]\.effects\[0\]\.kind/);
  });

  it('fractional number', () => {
    expect(
      cardsError((c) => {
        c(0).effects = [{ kind: 'damage', amount: 2.5 }];
      }),
    ).toMatch(/\[0\]\.effects\[0\]\.amount/);
  });

  it('unknown bonus condition', () => {
    expect(
      cardsError((c) => {
        c(0).effects = [
          { kind: 'damage', amount: 3, bonus: { if: { selfHas: 'rage' }, amount: 2 } },
        ];
      }),
    ).toMatch(/\[0\]\.effects\[0\]\.bonus\.if/);
  });

  it('single hit count is rejected (hits must be 2 or more)', () => {
    expect(
      cardsError((c) => {
        c(0).effects = [{ kind: 'damage', amount: 3, hits: 1 }];
      }),
    ).toMatch(/\[0\]\.effects\[0\]\.hits/);
  });

  it('missing field and duplicate id', () => {
    expect(
      cardsError((c) => {
        delete c(1).name;
      }),
    ).toMatch(/\[1\]\.name/);
    expect(
      cardsError((c) => {
        c(1).id = c(0).id;
      }),
    ).toMatch(/"slash" birden fazla/);
  });

  it('a card in the wrong job file', () => {
    expect(
      cardsError((c) => {
        c(0).job = 'rogue';
      }),
    ).toMatch(/\[0\]\.job/);
  });

  it('branch on a non-Rogue card', () => {
    expect(
      cardsError((c) => {
        c(0).branch = 'archer';
      }),
    ).toMatch(/\[0\]\.branch/);
  });

  it('bad config value', () => {
    const cfg = clone(battleConfigJson) as { shield: { persistence: string } };
    cfg.shield.persistence = 'forever';
    expect(() => parseBattleConfig(cfg)).toThrow(/battle-config\.json[\s\S]*shield\.persistence/);
  });
});
```

- [ ] **Adım 2: Çalıştır, KIRMIZI gör** — `corepack pnpm --filter @koidle/content-schema test` → **FAIL** (`loadAllCards` vb. yok, `common.json` yok).

- [ ] **Adım 3: İçerik JSON'ları**

`content/cards/common.json`:

```json
[
  {
    "id": "hizli-vurus",
    "name": "Hızlı Vuruş",
    "job": "common",
    "type": "attack",
    "cost": 1,
    "effects": [{ "kind": "damage", "amount": 3 }],
    "text": "3 hasar ver."
  },
  {
    "id": "sprint",
    "name": "Sprint",
    "job": "common",
    "type": "skill",
    "cost": 1,
    "effects": [{ "kind": "draw", "count": 1 }],
    "text": "1 kart çek."
  },
  {
    "id": "absoluteness",
    "name": "Absoluteness",
    "job": "common",
    "type": "defense",
    "cost": 1,
    "effects": [{ "kind": "shield", "amount": 4 }],
    "text": "4 Kalkan kazan."
  },
  {
    "id": "gozdagi",
    "name": "Gözdağı",
    "job": "common",
    "type": "debuff",
    "cost": 1,
    "effects": [{ "kind": "applyStatus", "target": "enemy", "status": "weak", "amount": 2 }],
    "text": "Rakibe Zayıflık 2 ver."
  },
  {
    "id": "valor",
    "name": "Valor",
    "job": "common",
    "type": "heal",
    "cost": 2,
    "effects": [
      { "kind": "heal", "amount": 4, "bonus": { "if": { "selfHpAtMost": 15 }, "amount": 4 } }
    ],
    "text": "4 HP iyileş. HP'n 15 veya altındaysa 8."
  },
  {
    "id": "guclu-vurus",
    "name": "Güçlü Vuruş",
    "job": "common",
    "type": "attack",
    "cost": 3,
    "effects": [{ "kind": "damage", "amount": 7 }],
    "text": "7 hasar ver."
  }
]
```

`content/cards/warrior.json`:

```json
[
  {
    "id": "slash",
    "name": "Slash",
    "job": "warrior",
    "type": "attack",
    "cost": 1,
    "effects": [
      { "kind": "damage", "amount": 3, "bonus": { "if": { "selfHas": "strength" }, "amount": 2 } }
    ],
    "text": "3 hasar ver. Güç'ün varsa +2."
  },
  {
    "id": "gain",
    "name": "Gain",
    "job": "warrior",
    "type": "buff",
    "cost": 1,
    "effects": [{ "kind": "applyStatus", "target": "self", "status": "strength", "amount": 2 }],
    "text": "Kendine Güç 2 ver."
  },
  {
    "id": "leg-cutting",
    "name": "Leg Cutting",
    "job": "warrior",
    "type": "debuff",
    "cost": 2,
    "effects": [
      { "kind": "damage", "amount": 2 },
      { "kind": "applyStatus", "target": "enemy", "status": "weak", "amount": 2 }
    ],
    "text": "2 hasar ver. Rakibe Zayıflık 2 ver."
  },
  {
    "id": "berserker",
    "name": "Berserker",
    "job": "warrior",
    "type": "buff",
    "cost": 2,
    "effects": [
      { "kind": "applyStatus", "target": "self", "status": "strength", "amount": 3 },
      { "kind": "applyStatus", "target": "self", "status": "curse", "amount": 2 }
    ],
    "text": "Kendine Güç 3 ve Lanet 2 ver."
  },
  {
    "id": "iron-skin",
    "name": "Iron Skin",
    "job": "warrior",
    "type": "defense",
    "cost": 2,
    "effects": [{ "kind": "shield", "amount": 6 }],
    "text": "6 Kalkan kazan."
  },
  {
    "id": "cleave",
    "name": "Cleave",
    "job": "warrior",
    "type": "attack",
    "cost": 3,
    "effects": [
      { "kind": "damage", "amount": 7, "bonus": { "if": { "selfHas": "strength" }, "amount": 3 } }
    ],
    "text": "7 hasar ver. Güç'ün varsa +3."
  },
  {
    "id": "howling-sword",
    "name": "Howling Sword",
    "job": "warrior",
    "type": "attack",
    "cost": 4,
    "effects": [
      {
        "kind": "damage",
        "amount": 6,
        "ignoreShield": true,
        "bonus": { "if": { "enemyHas": "weak" }, "amount": 3 }
      }
    ],
    "text": "Kalkanı yok sayarak 6 hasar ver. Rakip Zayıfsa +3."
  },
  {
    "id": "wall-of-iron",
    "name": "Wall of Iron",
    "job": "warrior",
    "tags": ["heavy"],
    "type": "defense",
    "cost": 3,
    "effects": [{ "kind": "shield", "amount": 12 }],
    "text": "12 Kalkan kazan."
  },
  {
    "id": "sword-dancing",
    "name": "Sword Dancing",
    "job": "warrior",
    "tags": ["heavy"],
    "type": "attack",
    "cost": 4,
    "effects": [
      { "kind": "damage", "amount": 6 },
      { "kind": "heal", "amount": 5 }
    ],
    "text": "6 hasar ver. 5 HP iyileş."
  },
  {
    "id": "hell-blade",
    "name": "Hell Blade",
    "job": "warrior",
    "tags": ["heavy"],
    "type": "attack",
    "cost": 5,
    "effects": [
      { "kind": "damage", "amount": 9, "bonus": { "if": { "selfHas": "strength" }, "amount": 4 } }
    ],
    "text": "9 hasar ver. Güç'ün varsa +4."
  }
]
```

`content/cards/rogue.json`:

```json
[
  {
    "id": "minor-healing",
    "name": "Minor Healing",
    "job": "rogue",
    "type": "heal",
    "cost": 1,
    "effects": [{ "kind": "heal", "amount": 3 }],
    "text": "3 HP iyileş."
  },
  {
    "id": "light-feet",
    "name": "Light Feet",
    "job": "rogue",
    "type": "skill",
    "cost": 1,
    "effects": [{ "kind": "draw", "count": 1 }],
    "text": "1 kart çek."
  },
  {
    "id": "scaled-skin",
    "name": "Scaled Skin",
    "job": "rogue",
    "tags": ["heavy"],
    "type": "defense",
    "cost": 3,
    "effects": [{ "kind": "shield", "amount": 10 }],
    "text": "10 Kalkan kazan."
  },
  {
    "id": "stab",
    "name": "Stab",
    "job": "rogue",
    "branch": "assassin",
    "type": "attack",
    "cost": 1,
    "effects": [
      {
        "kind": "damage",
        "amount": 2,
        "bonus": { "if": { "cardsPlayedAtLeast": 1 }, "amount": 2 }
      }
    ],
    "text": "2 hasar ver. Zincir 1: +2."
  },
  {
    "id": "stealth",
    "name": "Stealth",
    "job": "rogue",
    "branch": "assassin",
    "type": "skill",
    "cost": 1,
    "effects": [{ "kind": "applyStatus", "target": "self", "status": "stealth", "amount": 3 }],
    "text": "Kendine Gizli 3 ver."
  },
  {
    "id": "thrust",
    "name": "Thrust",
    "job": "rogue",
    "branch": "assassin",
    "type": "attack",
    "cost": 2,
    "effects": [
      {
        "kind": "damage",
        "amount": 4,
        "bonus": { "if": { "cardsPlayedAtLeast": 1 }, "amount": 3 }
      }
    ],
    "text": "4 hasar ver. Zincir 1: +3."
  },
  {
    "id": "blinding",
    "name": "Blinding",
    "job": "rogue",
    "branch": "assassin",
    "type": "debuff",
    "cost": 2,
    "effects": [
      { "kind": "damage", "amount": 3 },
      { "kind": "applyStatus", "target": "enemy", "status": "weak", "amount": 2 }
    ],
    "text": "3 hasar ver. Rakibe Zayıflık 2 ver."
  },
  {
    "id": "spike",
    "name": "Spike",
    "job": "rogue",
    "branch": "assassin",
    "type": "attack",
    "cost": 3,
    "effects": [
      {
        "kind": "damage",
        "amount": 6,
        "bonus": { "if": { "cardsPlayedAtLeast": 2 }, "amount": 4 }
      }
    ],
    "text": "6 hasar ver. Zincir 2: +4."
  },
  {
    "id": "critical-point",
    "name": "Critical Point",
    "job": "rogue",
    "branch": "assassin",
    "tags": ["heavy"],
    "type": "skill",
    "cost": 2,
    "effects": [{ "kind": "applyStatus", "target": "self", "status": "stealth", "amount": 7 }],
    "text": "Kendine Gizli 7 ver."
  },
  {
    "id": "beast-hiding",
    "name": "Beast Hiding",
    "job": "rogue",
    "branch": "assassin",
    "tags": ["heavy"],
    "type": "attack",
    "cost": 4,
    "effects": [
      { "kind": "damage", "amount": 6 },
      { "kind": "applyStatus", "target": "self", "status": "stealth", "amount": 3 }
    ],
    "text": "6 hasar ver. Sonra kendine Gizli 3 ver."
  },
  {
    "id": "poison-arrow",
    "name": "Poison Arrow",
    "job": "rogue",
    "branch": "archer",
    "type": "debuff",
    "cost": 1,
    "effects": [
      { "kind": "damage", "amount": 1 },
      { "kind": "applyStatus", "target": "enemy", "status": "poison", "amount": 2 }
    ],
    "text": "1 hasar ver. Rakibe Zehir 2 ver."
  },
  {
    "id": "perfect-arrow",
    "name": "Perfect Arrow",
    "job": "rogue",
    "branch": "archer",
    "type": "attack",
    "cost": 1,
    "effects": [{ "kind": "damage", "amount": 2, "ignoreShield": true }],
    "text": "Kalkanı yok sayarak 2 hasar ver."
  },
  {
    "id": "multiple-shot",
    "name": "Multiple Shot",
    "job": "rogue",
    "branch": "archer",
    "type": "attack",
    "cost": 2,
    "effects": [{ "kind": "damage", "amount": 2, "hits": 3 }],
    "text": "3 kez 2 hasar ver."
  },
  {
    "id": "viper",
    "name": "Viper",
    "job": "rogue",
    "branch": "archer",
    "type": "debuff",
    "cost": 2,
    "effects": [{ "kind": "applyStatus", "target": "enemy", "status": "poison", "amount": 4 }],
    "text": "Rakibe Zehir 4 ver."
  },
  {
    "id": "blinding-strafe",
    "name": "Blinding Strafe",
    "job": "rogue",
    "branch": "archer",
    "type": "debuff",
    "cost": 2,
    "effects": [
      { "kind": "damage", "amount": 3 },
      { "kind": "applyStatus", "target": "enemy", "status": "weak", "amount": 2 }
    ],
    "text": "3 hasar ver. Rakibe Zayıflık 2 ver."
  },
  {
    "id": "arrow-shower",
    "name": "Arrow Shower",
    "job": "rogue",
    "branch": "archer",
    "tags": ["heavy"],
    "type": "attack",
    "cost": 4,
    "effects": [{ "kind": "damage", "amount": 2, "hits": 5 }],
    "text": "5 kez 2 hasar ver."
  },
  {
    "id": "power-shot",
    "name": "Power Shot",
    "job": "rogue",
    "branch": "archer",
    "tags": ["heavy"],
    "type": "attack",
    "cost": 4,
    "effects": [
      {
        "kind": "damage",
        "amount": 7,
        "ignoreShield": true,
        "bonus": { "if": { "enemyHpAtMost": 12 }, "amount": 5 }
      }
    ],
    "text": "Kalkanı yok sayarak 7 hasar ver. Rakibin HP'si 12 veya altındaysa +5."
  }
]
```

`content/decks/warrior.json`:

```json
[
  "slash",
  "gain",
  "leg-cutting",
  "berserker",
  "iron-skin",
  "cleave",
  "howling-sword",
  "sword-dancing",
  "hell-blade",
  "hizli-vurus",
  "gozdagi",
  "sprint"
]
```

`content/decks/assassin.json`:

```json
[
  "stab",
  "stealth",
  "thrust",
  "blinding",
  "spike",
  "critical-point",
  "beast-hiding",
  "light-feet",
  "minor-healing",
  "hizli-vurus",
  "absoluteness",
  "guclu-vurus"
]
```

`content/decks/archer.json`:

```json
[
  "poison-arrow",
  "perfect-arrow",
  "multiple-shot",
  "viper",
  "blinding-strafe",
  "arrow-shower",
  "power-shot",
  "light-feet",
  "minor-healing",
  "absoluteness",
  "gozdagi",
  "guclu-vurus"
]
```

`content/battle-config.json` — kök nesneye (`roundCap`'ten önce) ekle: `"deckBuilding": { "maxHeavy": 2, "minOpeners": 3 },`

- [ ] **Adım 4: Tipler, şema, yükleyiciler**

`packages/rules/src/types.ts` — `BattleConfig`'e (`roundCap`'tan önce):

```ts
  /** Deste kurma sınırları. Motor yok sayar; deste kurma ekranı, hazır desteler ve sim doğrular. */
  deckBuilding: { maxHeavy: number; minOpeners: number };
```
`test-fixtures.ts` `testConfig`'e `deckBuilding: { maxHeavy: 2, minOpeners: 3 },`.

`schema.ts`: `BattleConfigSchema`'ya `deckBuilding: z.strictObject({ maxHeavy: int(), minOpeners: int() }),`; kart ve deste şemaları:

```ts
export const CardSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case olmalı (ör. leg-cutting)'),
  name: z.string().min(1),
  job: z.enum(['common', 'warrior', 'rogue']),
  branch: z.enum(['assassin', 'archer']).exactOptional(),
  tags: z.array(z.literal('heavy')).min(1).exactOptional(),
  type: z.enum(['attack', 'skill', 'defense', 'heal', 'buff', 'debuff']),
  cost: int().max(10),
  effects: z.array(EffectSchema).min(1),
  text: z.string().min(1),
}) satisfies z.ZodType<CardDef>;

export const CardListSchema = z.array(CardSchema).min(1);

/** Hazır deste: yalnız kart id'leri; kurallar `validateDeck`'te. */
export const DeckSchema = z.array(z.string().min(1)).min(1);
```

`packages/content-schema/src/archetypes.ts`:

```ts
import type { Branch, CardDef, Job } from '@koidle/rules';

/** Oynanabilir "arketip": Rogue iki yola ayrılır (F2-15). */
export type ArchetypeId = 'warrior' | 'assassin' | 'archer';

export interface Archetype {
  id: ArchetypeId;
  job: Job;
  branch?: Branch;
  name: string;
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  warrior: { id: 'warrior', job: 'warrior', name: 'Warrior' },
  assassin: { id: 'assassin', job: 'rogue', branch: 'assassin', name: 'Rogue · Asas' },
  archer: { id: 'archer', job: 'rogue', branch: 'archer', name: 'Rogue · Okçu' },
};

export const ARCHETYPE_IDS: readonly ArchetypeId[] = ['warrior', 'assassin', 'archer'];

export const archetype = (id: ArchetypeId): Archetype => ARCHETYPES[id];

/** Kart bu arketipin havuzunda mı: ortak + job + (varsa) yol. Rogue ortak kartlarında yol yok. */
export function inPool(card: CardDef, a: Archetype): boolean {
  if (card.job === 'common') return true;
  if (card.job !== a.job) return false;
  return card.branch === undefined || card.branch === a.branch;
}
```

`packages/content-schema/src/deck.ts`:

```ts
import { type BattleConfig, type CardDef, isHeavy, isOpener } from '@koidle/rules';
import { type ArchetypeId, archetype, inPool } from './archetypes';

export interface DeckStats {
  size: number;
  heavy: number;
  openers: number;
}

/** Bilinmeyen kimlikler sayılmaz. */
export function deckStats(
  deck: readonly string[],
  cards: readonly CardDef[],
  config: BattleConfig,
): DeckStats {
  let heavy = 0;
  let openers = 0;
  for (const id of deck) {
    const card = cards.find((c) => c.id === id);
    if (!card) continue;
    if (isHeavy(card)) heavy += 1;
    if (isOpener(card, config)) openers += 1;
  }
  return { size: deck.length, heavy, openers };
}

/** Boş liste = geçerli. Mesajlar oyuncuya gösterilir (Türkçe). */
export function validateDeck(
  deck: readonly string[],
  id: ArchetypeId,
  cards: readonly CardDef[],
  config: BattleConfig,
): string[] {
  const out: string[] = [];
  const a = archetype(id);
  const { maxHeavy, minOpeners } = config.deckBuilding;
  if (deck.length !== config.deck.size) {
    out.push(`Deste ${config.deck.size} kart olmalı (şu an ${deck.length}).`);
  }
  const unique = [...new Set(deck)];
  for (const cardId of unique) {
    if (deck.filter((x) => x === cardId).length > 1) {
      out.push(`"${cardId}" birden fazla kez seçilmiş.`);
    }
  }
  for (const cardId of unique) {
    const card = cards.find((c) => c.id === cardId);
    if (!card) out.push(`"${cardId}" bilinmeyen kart.`);
    else if (!inPool(card, a)) out.push(`${card.name}, ${a.name} havuzunda değil.`);
  }
  const stats = deckStats(deck, cards, config);
  if (stats.heavy > maxHeavy) {
    out.push(`Ağır kart en fazla ${maxHeavy} olabilir (şu an ${stats.heavy}).`);
  }
  if (stats.openers < minOpeners) {
    out.push(
      `En az ${minOpeners} adet ${config.mp.start} MP'lik kart gerekli (şu an ${stats.openers}).`,
    );
  }
  return out;
}
```

`packages/content-schema/src/load.ts` — dosyanın tamamı:

```ts
import aiProfilesJson from '@koidle/content/ai-profiles.json';
import battleConfigJson from '@koidle/content/battle-config.json';
import commonJson from '@koidle/content/cards/common.json';
import rogueJson from '@koidle/content/cards/rogue.json';
import warriorJson from '@koidle/content/cards/warrior.json';
import archerDeckJson from '@koidle/content/decks/archer.json';
import assassinDeckJson from '@koidle/content/decks/assassin.json';
import warriorDeckJson from '@koidle/content/decks/warrior.json';
import type { BattleConfig, CardDef, Job } from '@koidle/rules';
import type { z } from 'zod';
import { type ArchetypeId, archetype, inPool } from './archetypes';
import { validateDeck } from './deck';
import {
  type AiProfiles,
  AiProfilesSchema,
  BattleConfigSchema,
  CardListSchema,
  DeckSchema,
} from './schema';

/** Geçersiz içerik: mesaj dosya yolu + alan yolu + sorunu içerir. */
export class ContentError extends Error {
  constructor(
    readonly file: string,
    readonly issues: string[],
  ) {
    super(`${file} geçersiz:\n${issues.map((i) => `  - ${i}`).join('\n')}`);
    this.name = 'ContentError';
  }
}

function formatPath(path: readonly PropertyKey[]): string {
  if (path.length === 0) return '(kök)';
  return path
    .map((k, i) => (typeof k === 'number' ? `[${k}]` : `${i === 0 ? '' : '.'}${String(k)}`))
    .join('');
}

function parse<T>(schema: z.ZodType<T>, raw: unknown, file: string): T {
  const r = schema.safeParse(raw);
  if (!r.success) {
    throw new ContentError(
      file,
      r.error.issues.map((i) => `${formatPath(i.path)}: ${i.message}`),
    );
  }
  return r.data;
}

export function parseBattleConfig(raw: unknown, file = 'content/battle-config.json'): BattleConfig {
  return parse(BattleConfigSchema, raw, file) as BattleConfig;
}

/** Bir kart dosyasını doğrular: şema + dosyanın job'ı + yol yalnız Rogue'da + yinelenen id yok. */
export function parseCards(raw: unknown, file: string, job: Job | 'common'): CardDef[] {
  const cards = parse(CardListSchema, raw, file) as CardDef[];
  const issues: string[] = [];
  cards.forEach((c, i) => {
    if (c.job !== job) {
      issues.push(`[${i}].job: bu dosya "${job}" kartları içermeli, "${c.job}" bulundu`);
    }
    if (c.branch !== undefined && c.job !== 'rogue') {
      issues.push(`[${i}].branch: yol yalnız Rogue kartlarında olabilir`);
    }
  });
  const ids = cards.map((c) => c.id);
  for (const c of cards.filter((c, i) => ids.indexOf(c.id) !== i)) {
    issues.push(`id "${c.id}" birden fazla kez tanımlı`);
  }
  if (issues.length > 0) throw new ContentError(file, issues);
  return cards;
}

export function parseAiProfiles(raw: unknown, file = 'content/ai-profiles.json'): AiProfiles {
  return parse(AiProfilesSchema, raw, file);
}

export const loadBattleConfig = (): BattleConfig => parseBattleConfig(battleConfigJson);
export const loadAiProfiles = (): AiProfiles => parseAiProfiles(aiProfilesJson);

const CARD_FILES: { file: string; job: Job | 'common'; raw: unknown }[] = [
  { file: 'content/cards/common.json', job: 'common', raw: commonJson },
  { file: 'content/cards/warrior.json', job: 'warrior', raw: warriorJson },
  { file: 'content/cards/rogue.json', job: 'rogue', raw: rogueJson },
];

/** Tüm kartlar (33). Dosyalar arası yinelenen id de hatadır. */
export function loadAllCards(): CardDef[] {
  const all = CARD_FILES.flatMap((f) => parseCards(f.raw, f.file, f.job));
  const dupes = all.filter((c, i) => all.findIndex((x) => x.id === c.id) !== i);
  if (dupes.length > 0) {
    throw new ContentError(
      'content/cards/*.json',
      dupes.map((c) => `id "${c.id}" birden fazla dosyada tanımlı`),
    );
  }
  return all;
}

/** Bir arketipin deste kurma havuzu (ortak + job + yol). */
export function loadPool(id: ArchetypeId): CardDef[] {
  const a = archetype(id);
  return loadAllCards().filter((c) => inPool(c, a));
}

const DECK_FILES: Record<ArchetypeId, unknown> = {
  warrior: warriorDeckJson,
  assassin: assassinDeckJson,
  archer: archerDeckJson,
};

/** Önerilen deste. `validateDeck` sorun bulursa ContentError fırlatır. */
export function loadPresetDeck(id: ArchetypeId): string[] {
  const file = `content/decks/${id}.json`;
  const deck = parse(DeckSchema, DECK_FILES[id], file);
  const issues = validateDeck(deck, id, loadAllCards(), loadBattleConfig());
  if (issues.length > 0) throw new ContentError(file, issues);
  return deck;
}

export function loadPresetDecks(): Record<ArchetypeId, string[]> {
  return {
    warrior: loadPresetDeck('warrior'),
    assassin: loadPresetDeck('assassin'),
    archer: loadPresetDeck('archer'),
  };
}
```

`packages/content-schema/src/index.ts`:

```ts
export {
  ARCHETYPE_IDS,
  ARCHETYPES,
  type Archetype,
  type ArchetypeId,
  archetype,
  inPool,
} from './archetypes';
export { type DeckStats, deckStats, validateDeck } from './deck';
export {
  ContentError,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPool,
  loadPresetDeck,
  loadPresetDecks,
  parseAiProfiles,
  parseBattleConfig,
  parseCards,
} from './load';
export * from './schema';
export { renderValuesTable } from './values-table';
```

`packages/content-schema/src/values-doc.ts` (tam):

```ts
import { join } from 'node:path';
import { loadAiProfiles, loadAllCards, loadBattleConfig, loadPresetDecks } from './load';
import { renderValuesTable } from './values-table';

export const valuesDocPath = join(
  import.meta.dirname,
  '..',
  '..',
  '..',
  'docs',
  'savas-degerleri.md',
);

export const valuesDocText = (): string =>
  renderValuesTable(loadBattleConfig(), loadAllCards(), loadAiProfiles(), loadPresetDecks());
```

`values-table.ts` — import'lar:

```ts
import { type BattleConfig, type CardDef, type CardType, isHeavy } from '@koidle/rules';
import { ARCHETYPE_IDS, ARCHETYPES, type ArchetypeId } from './archetypes';
import { deckStats } from './deck';
import type { AiProfiles } from './schema';
```

`rows()`'da `Deste boyutu` satırı değişir ve `Karıştırma hakkı` satırından önce iki satır eklenir:

```ts
    [
      'Deste boyutu',
      'deck.size',
      c.deck.size,
      'Oyuncu tek kopyalık deste kurar (F2-4); havuz 16 karttır',
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
```

`renderValuesTable` fonksiyonu tümüyle şu olur (Görev 1'in sıra/formül metinleri dahil); `SECTIONS` ve `cardName` fonksiyonun üstüne gelir:

```ts
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
    '**Tur başı sırası (N3, C1):** tur başlar → Kalkan sıfırlanır → maks MP ve MP → Zehir hasarı → Arena hasarı → kart çekme (gerekirse karıştırma veya Yorgunluk). Her sistem hasarından sonra savaş bitti mi bakılır; Zehir ya da Arena öldürürse çekme olmaz.',
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
    "- Kart hasarı = `max(0, kart değeri + Güç(kaynak) − Zayıflık(kaynak) + Lanet(hedef))`. Önce Kalkan emer, kalanı HP'den düşer (Kalkanı yok sayan kartlar hariç). Zehir hasarı Lanet'ten etkilenmez.",
  );
  out.push(
    '- Gizli: bir sonraki hasar veren kartın **ilk vuruşuna** +değer ekler ve o vuruş Kalkanı yok sayar; sonra düşer. Çoklu vuruşta Güç/Zayıflık/Lanet her vuruşa uygulanır.',
  );
  out.push(
    '- Zincir N: bu tur, bu karttan **önce** en az N kart oynandıysa bonus. Sayaç kart çözüldükten sonra artar.',
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
    'Gözlem listesi: Stab → Thrust → Spike (19 hasar, 6 MP), Berserker → Hell Blade (16), Viper + Power Shot. Sim ve Yasin testinde izlenir; şimdilik değer değişikliği yok.',
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
```

Tüketiciler:

`packages/ai/src/ai.test.ts` — üstteki import ve sabitler:

```ts
import {
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDeck,
} from '@koidle/content-schema';
```
```ts
const cards = loadAllCards();
const deck = loadPresetDeck('warrior');
```
Sonra kart kimliklerini yeni karşılıklarıyla değiştir (Git Bash):

```
sed -i "s/'yarma'/'hizli-vurus'/g; s/'siper'/'absoluteness'/g; s/'yikim'/'hell-blade'/g; s/'ikinci-nefes'/'minor-healing'/g; s/'hazirlik'/'sprint'/g" packages/ai/src/ai.test.ts
```
(Karşılıklar: 1 MP saldırı → Hızlı Vuruş, Kalkan → Absoluteness, 5 MP pahalı kart → Hell Blade, tam HP'de işe yaramayan iyileşme → Minor Healing, kart çekme → Sprint. Test mantığı aynı kalır.)

`tools/sim/src/load-input.ts` (Görev 7'de yeniden yazılır; geçici):

```ts
import {
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDeck,
} from '@koidle/content-schema';
import type { SimInput } from './run';

export function loadSimInput(): SimInput {
  return {
    config: loadBattleConfig(),
    cards: loadAllCards(),
    deck: loadPresetDeck('warrior'),
    profiles: loadAiProfiles(),
  };
}
```

`apps/client/src/content.ts` (Görev 8'de yeniden yazılır; geçici): `loadCards`/`defaultDeck` yerine

```ts
import {
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDeck,
} from '@koidle/content-schema';
```
ve `loadContent()` içinde `const cards = loadAllCards();` ... `deck: loadPresetDeck('warrior'),`.

- [ ] **Adım 5: Replay + değer tablosu + YEŞİL**

```
$env:UPDATE_REPLAYS='1'; corepack pnpm --filter @koidle/rules test; Remove-Item Env:UPDATE_REPLAYS
corepack pnpm --filter @koidle/content-schema values
corepack pnpm -r test
```
→ **PASS** (replay farkı yalnız config'teki `deckBuilding`). `docs/savas-degerleri.md` beş kart bölümü ve hazır deste tablosuyla yenilenmiş olmalı.

- [ ] **Adım 6: Kapı komutu ve commit**

```
git add content packages tools apps docs/savas-degerleri.md
git commit -m "feat(content): 33-card pools, preset decks, validateDeck, archetypes" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

---

## Görev 6 — AI tur planı (ai) + klon hızı

**Files**
- Modify: `packages/rules/src/clone.ts`, `engine.ts`, `clone.test.ts`
- Create: `content/ai-planner.json`, `packages/ai/src/plan.ts`
- Modify: `packages/content-schema/src/schema.ts`, `load.ts`, `index.ts`, `values-table.ts`, `values-doc.ts`, `content.test.ts`
- Modify: `packages/ai/src/types.ts`, `choose.ts`, `evaluate.ts`, `index.ts`, `ai.test.ts`
- Modify: `tools/sim/src/run.ts`, `load-input.ts`, `sim.test.ts`
- Modify: `apps/client/src/content.ts`, `useBattle.ts`
- Regenerate: `docs/savas-degerleri.md`

**Interfaces**
- Consumes: `apply`, `legalActions`, `redactForAi`, `evaluate`.
- Produces:
  - `cloneState(state)`: `cards` paylaşılır, gerisi derin kopya.
  - `AiPlannerSchema` (`depth` 1..6, `beam` 1..20), `parseAiPlanner`, `loadAiPlanner()`.
  - `Planner { depth; beam }`, `GREEDY`, `Scorer` (types.ts'e taşınır), `planAction`.
  - `chooseAction(state, me, weights, options: { planner?: Planner; scorer?: Scorer } = {})`.

- [ ] **Adım 1: Başarısız testleri yaz**

`packages/rules/src/clone.test.ts` — import'ları dosyanın başına ekle (`import { apply } from './engine'; import { newBattle } from './test-fixtures';`), dosyanın sonuna:

```ts
describe('cloneState', () => {
  it('shares the immutable card table but copies everything else', () => {
    const { state } = newBattle(1);
    const before = JSON.stringify(state);
    const next = apply(state, { type: 'END_TURN', player: state.active }).state;
    expect(next.cards).toBe(state.cards);
    expect(next.players).not.toBe(state.players);
    expect(next.config).not.toBe(state.config);
    expect(JSON.stringify(state)).toBe(before);
  });
});
```

`packages/content-schema/src/content.test.ts` — import listesine `loadAiPlanner`, `parseAiPlanner` ekle; yeni `describe`:

```ts
describe('ai planner', () => {
  it('loads within bounds', () => {
    const p = loadAiPlanner();
    expect(p.depth).toBeGreaterThanOrEqual(1);
    expect(p.depth).toBeLessThanOrEqual(6);
    expect(p.beam).toBeGreaterThanOrEqual(1);
  });

  it('rejects out of range values with a readable message', () => {
    expect(() => parseAiPlanner({ depth: 0, beam: 5 })).toThrow(/ai-planner\.json[\s\S]*depth/);
    expect(() => parseAiPlanner({ depth: 4, beam: 99 })).toThrow(/beam/);
  });
});
```

`packages/ai/src/ai.test.ts` — import'ları şu hale getir:

```ts
import {
  type Action,
  apply,
  type BattleState,
  createBattle,
  legalActions,
  type PlayerIndex,
  type StatusId,
  validateAction,
} from '@koidle/rules';
import {
  chooseAction,
  evaluate,
  HIDDEN_CARD_ID,
  type Planner,
  redactForAi,
  type Scorer,
} from './index';
```
Cheater çağrılarını güncelle (iki yerde):

```ts
      return chooseAction(state, me, profiles.balanced, { scorer: cheater });
```
```ts
          expect(chooseAction(altered, me, profiles[profile], { scorer: cheater })).toEqual(
            chooseAction(s, me, profiles[profile], { scorer: cheater }),
          );
```
Dosyanın sonuna ekle:

```ts
describe('turn planner (F2-11)', () => {
  const PLANNER: Planner = { depth: 4, beam: 5 };
  const assassin = loadPresetDeck('assassin');

  function assassinFight(seed: number, hand: string[], mp: number, foeHp: number) {
    const state = createBattle({
      config,
      cards,
      decks: [assassin, assassin],
      names: ['A', 'B'],
      seed,
    }).state;
    const me = state.active;
    const foe: PlayerIndex = me === 0 ? 1 : 0;
    state.players[me].hand = hand.map((cardId, i) => ({ iid: `x-${i}`, cardId }));
    state.players[me].mp = mp;
    state.players[me].maxMp = mp;
    state.players[foe].hp = foeHp;
    return { state, me };
  }

  it('finds the Stab → Thrust → Spike kill that greedy misses', () => {
    const { state, me } = assassinFight(1, ['stab', 'thrust', 'spike'], 6, 19);
    expect(cardOf(state, me, chooseAction(state, me, profiles.balanced))).toBe('spike');
    expect(
      cardOf(state, me, chooseAction(state, me, profiles.balanced, { planner: PLANNER })),
    ).toBe('stab');
  });

  it('executing the plan action by action wins the battle', () => {
    const fight = assassinFight(1, ['stab', 'thrust', 'spike'], 6, 19);
    const me = fight.me;
    let state = fight.state;
    for (let i = 0; i < 3 && !state.result; i++) {
      const a = chooseAction(state, me, profiles.balanced, { planner: PLANNER });
      expect(a.type).toBe('PLAY_CARD');
      state = apply(state, a).state;
    }
    expect(state.result).toEqual({ winner: me, reason: 'normalDamage' });
  });

  it('evaluate likes my Stealth and the foe Poison/Curse, dislikes the reverse', () => {
    const tweak = (fn: (s: BattleState) => void) => {
      const s = JSON.parse(JSON.stringify(battle(1))) as BattleState;
      fn(s);
      return evaluate(s, 0, profiles.balanced);
    };
    const add = (s: BattleState, p: PlayerIndex, id: StatusId, amount: number) => {
      s.players[p].statuses.push({ id, amount, turnsLeft: 2 });
    };
    const base = tweak(() => {});
    expect(tweak((s) => add(s, 0, 'stealth', 3))).toBeGreaterThan(base);
    expect(tweak((s) => add(s, 1, 'poison', 4))).toBeGreaterThan(base);
    expect(tweak((s) => add(s, 1, 'curse', 2))).toBeGreaterThan(base);
    expect(tweak((s) => add(s, 0, 'poison', 4))).toBeLessThan(base);
    expect(tweak((s) => add(s, 1, 'stealth', 3))).toBeLessThan(base);
  });

  it('always returns a legal action', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.array(fc.nat(), { maxLength: 40 }),
        fc.constantFrom('aggressive', 'balanced', 'defensive' as const),
        (seed, steps, profile) => {
          const s = midBattle(seed, steps);
          if (s.result) return;
          const a = chooseAction(s, s.active, profiles[profile], { planner: PLANNER });
          expect(validateAction(s, a)).toBeNull();
        },
      ),
      { numRuns: 40 },
    );
  });

  it('decision does not change when hidden cards change (planner)', () => {
    fc.assert(
      fc.property(fc.nat(), fc.array(fc.nat(), { maxLength: 30 }), fc.nat(), (seed, steps, k0) => {
        const s = midBattle(seed, steps);
        if (s.result) return;
        const me = s.active;
        const foe: PlayerIndex = me === 0 ? 1 : 0;
        const altered = JSON.parse(JSON.stringify(s)) as BattleState;
        const ids = cards.map((c) => c.id);
        let k = k0;
        const pick = () => {
          k = (k * 1103515245 + 12345) >>> 0;
          return ids[k % ids.length] as string;
        };
        altered.players[foe].hand = altered.players[foe].hand.map((c) => ({
          ...c,
          cardId: pick(),
        }));
        for (const p of [0, 1] as const) {
          altered.players[p].deck = altered.players[p].deck
            .map((c) => ({ ...c, cardId: pick() }))
            .reverse();
        }
        expect(chooseAction(altered, me, profiles.balanced, { planner: PLANNER })).toEqual(
          chooseAction(s, me, profiles.balanced, { planner: PLANNER }),
        );
      }),
      { numRuns: 40 },
    );
  });
});
```

- [ ] **Adım 2: Çalıştır, KIRMIZI gör**

`corepack pnpm -r test` → `clone.test`, `content.test` (ai planner), `ai.test` **FAIL** (`cloneState`, `loadAiPlanner`, `planner` seçeneği yok).

- [ ] **Adım 3: En küçük gerçekleme**

`packages/rules/src/clone.ts` (tam):

```ts
import type { BattleState } from './types';

// State saf JSON olmak zorunda; JSON kopyası bunu aynı zamanda garanti eder.
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Savaş durumu kopyası. `cards` (kart tanımları) savaş boyunca değişmez, bu yüzden paylaşılır;
 * en büyük parça odur ve AI araması çok sayıda apply çağırır. Gerisi derin kopyadır.
 */
export function cloneState(state: BattleState): BattleState {
  const { cards, ...rest } = state;
  return { ...clone(rest), cards };
}
```

`engine.ts`: `import { cloneState } from './clone';` ve `const next = cloneState(state);` (`clone` import'u kalkar).

`content/ai-planner.json`:

```json
{ "depth": 4, "beam": 5 }
```

`schema.ts` sonuna:

```ts
/** AI tur planı: kaç kart derinliğe, kaç aday genişliğinde bakar. AI ayarı, kural değeri değil. */
export const AiPlannerSchema = z.strictObject({
  depth: z.int().min(1).max(6),
  beam: z.int().min(1).max(20),
});

export type AiPlanner = z.infer<typeof AiPlannerSchema>;
```

`load.ts`: import'a `import aiPlannerJson from '@koidle/content/ai-planner.json';`, şema import'una `type AiPlanner, AiPlannerSchema`; ekle:

```ts
export function parseAiPlanner(raw: unknown, file = 'content/ai-planner.json'): AiPlanner {
  return parse(AiPlannerSchema, raw, file);
}
export const loadAiPlanner = (): AiPlanner => parseAiPlanner(aiPlannerJson);
```
`index.ts` export listesine `loadAiPlanner`, `parseAiPlanner`.

`values-table.ts`: `import type { AiPlanner, AiProfiles } from './schema';`; imza `renderValuesTable(config, cards, ai, decks, planner: AiPlanner)`; fonksiyonun sonuna (`return` öncesi) ekle:

```ts
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
```
`values-doc.ts`: `loadAiPlanner` import et, `renderValuesTable(..., loadPresetDecks(), loadAiPlanner())`.

`packages/ai/src/types.ts` — dosyanın başına import, sonuna tipler:

```ts
import type { BattleState, PlayerIndex } from '@koidle/rules';
```
```ts
/** Skor fonksiyonu: yüksek = `me` için iyi. */
export type Scorer = (state: BattleState, me: PlayerIndex, weights: Weights) => number;

/** Tur planı parametreleri; değerler content/ai-planner.json'dan gelir. */
export interface Planner {
  depth: number;
  beam: number;
}
```

`packages/ai/src/plan.ts`:

```ts
import { type Action, apply, type BattleState, legalActions, type PlayerIndex } from '@koidle/rules';
import type { Planner, Scorer, Weights } from './types';

/** Tek adım, tek aday: Görev 6 öncesi açgözlü davranışın birebir karşılığı. */
export const GREEDY: Planner = { depth: 1, beam: 1 };

interface Node {
  state: BattleState;
  /** Bu düğüme götüren planın ilk aksiyonu. */
  first: Action | null;
  score: number;
}

/**
 * Işın araması: yalnız kendi turundaki kart dizilerine bakar. Kökün skorunu kesin aşan en iyi
 * yaprağın planının ilk aksiyonunu döndürür; hiçbiri aşmıyorsa turu bitirir. Eşitlikte
 * `legalActions` sırası kazanır (kararlı sıralama + kesin büyüklük).
 * `view` redactForAi çıktısı olmalıdır (gizli bilgi kuralı).
 */
export function planAction(
  view: BattleState,
  me: PlayerIndex,
  weights: Weights,
  planner: Planner,
  scorer: Scorer,
): Action {
  let best: Action = { type: 'END_TURN', player: me };
  let bestScore = scorer(view, me, weights);
  let frontier: Node[] = [{ state: view, first: null, score: bestScore }];
  for (let depth = 0; depth < planner.depth; depth++) {
    const children: Node[] = [];
    for (const node of frontier) {
      for (const action of legalActions(node.state)) {
        if (action.type === 'END_TURN') continue;
        const next = apply(node.state, action).state;
        const first = node.first ?? action;
        const score = scorer(next, me, weights);
        if (score > bestScore) {
          best = first;
          bestScore = score;
        }
        if (!next.result && next.active === me) children.push({ state: next, first, score });
      }
    }
    frontier = children.sort((a, b) => b.score - a.score).slice(0, planner.beam);
    if (frontier.length === 0) break;
  }
  return best;
}
```

`packages/ai/src/choose.ts` (tam):

```ts
import type { Action, BattleState, PlayerIndex } from '@koidle/rules';
import { evaluate } from './evaluate';
import { GREEDY, planAction } from './plan';
import { redactForAi } from './redact';
import type { Planner, Scorer, Weights } from './types';

export interface ChooseOptions {
  /** Varsayılan: GREEDY (1 kart derinlik). */
  planner?: Planner;
  /** Varsayılan: `evaluate`. Testlerde "hileci" skor vermek için. */
  scorer?: Scorer;
}

/**
 * AI'ın bir sonraki aksiyonu. Durum önce gizli bilgisi silinmiş görünüme çevrilir (C6), arama
 * orada yapılır. Eşitlikte legalActions sırası kazanır (deterministik).
 */
export function chooseAction(
  state: BattleState,
  me: PlayerIndex,
  weights: Weights,
  options: ChooseOptions = {},
): Action {
  if (state.result) throw new Error('battle is over');
  if (state.active !== me) throw new Error('not the AI turn');
  return planAction(
    redactForAi(state, me),
    me,
    weights,
    options.planner ?? GREEDY,
    options.scorer ?? evaluate,
  );
}
```

`evaluate.ts` — üst kısım:

```ts
import type { BattleState, PlayerIndex, PlayerState, StatusId } from '@koidle/rules';
import type { Weights } from './types';

export const WIN_SCORE = 1_000_000;

/** Sahibi için iyi statüler; diğerleri (Zayıflık, Lanet, Zehir) kötü. */
const GOOD: readonly StatusId[] = ['strength', 'stealth'];

function statusScore(p: PlayerState): number {
  let score = 0;
  for (const s of p.statuses) {
    const value = s.amount * s.turnsLeft;
    score += GOOD.includes(s.id) ? value : -value;
  }
  return score;
}
```
(`evaluate` fonksiyonu aynı kalır.)

`packages/ai/src/index.ts`:

```ts
export { type ChooseOptions, chooseAction } from './choose';
export { evaluate, WIN_SCORE } from './evaluate';
export { GREEDY, planAction } from './plan';
export { HIDDEN_CARD_ID, redactForAi } from './redact';
export { AI_PROFILES, type AiProfile, type Planner, type Scorer, type Weights } from './types';
```

`tools/sim/src/run.ts` (geçici; Görev 7'de yeniden yazılır): import'a `type Planner`, `SimInput`'a `planner: Planner;`, `playMatch` içinde `const { config, cards, deck, profiles, planner } = input;` ve karar satırı:

```ts
    ({ state, events } = apply(state, chooseAction(state, me, weights[me], { planner })));
```
`load-input.ts`: `loadAiPlanner` import et, `planner: loadAiPlanner(),` ekle. `sim.test.ts`: `seedRange(1, 10)` → `seedRange(1, 2)` (iki yerde), `toHaveLength(90)` → `18`, `toBe(90)` → `18`, `describe` başlığı `3×3 × 2`.

`apps/client/src/content.ts`: `LoadedContent`'e `planner: Planner;` (`import type { Planner } from '@koidle/ai';`), `loadContent` içinde `planner: loadAiPlanner(),`. `useBattle.ts`: AI kararı `chooseAction(state, state.active, content.profiles[profile], { planner: content.planner })`.

- [ ] **Adım 4: Değer tablosu + YEŞİL**

```
corepack pnpm --filter @koidle/content-schema values
corepack pnpm -r test
```
→ **PASS**. (Planlayıcı property testleri `numRuns: 40`. Çok yavaşsa DUR, nedeni araştır.)

- [ ] **Adım 5: Süre ölçümü (Yasin eşiği)**

```
Measure-Command { corepack pnpm --filter @koidle/sim sim } | Select-Object TotalSeconds
```
Eski `runMatrix` 900 maçı (Warrior aynası) planlayıcıyla koşar. Süreyi ve CLI'nin yazdığı "ms" satırını not et. **> 120 sn ise DUR**: kodda hile yapma, Yasin'e raporla; seçenek `content/ai-planner.json`'da `beam`/`depth` düşürmek. `reports/sim/latest.*` bu görevde commit edilmez: `git checkout -- reports/sim`.

- [ ] **Adım 6: Kapı komutu ve commit**

```
git add packages content tools apps docs/savas-degerleri.md
git commit -m "feat(ai): beam-search turn planner, faster state clone, status scoring for new statuses" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

---

## Görev 7 — Sim: job matrisi + yeni metrikler

**Files**
- Rewrite: `tools/sim/src/run.ts`, `report.ts`, `load-input.ts`, `cli.ts`, `sim.test.ts`, `index.ts`
- Regenerate: `reports/sim/latest.{md,json,csv}`

**Interfaces**
- Consumes: `chooseAction(..., { planner })`, `loadPresetDecks`, `ARCHETYPE_IDS`, `ARCHETYPES`, olaylar `CHAIN_TRIGGERED`/`STEALTH_USED`/`DAMAGE_DEALT{source:'poison'}`, `PlayerState.cardsPlayedThisTurn`.
- Produces:
  - `SimInput { config; cards; decks: Record<ArchetypeId,string[]>; profiles; planner }`.
  - `Side { archetype; profile }`, `playMatch(input, seed, p0, p1, pass)`, `runJobMatrix(input, seeds)`, `runProfileMatrix(input, seeds)`, `seedRange`.
  - `MatchRecord` + `pass`, `p0Archetype`, `p1Archetype`, `deadOpening`, `chains`, `stealthUses`, `poisonDamage`.
  - `seatMatrix(records, keys, keyOf)`, `summarize(records, { cards, decks })`, `renderMarkdown(summary, config, meta)`, `renderCsv`.
  - CLI: `pnpm sim -- <jobSeeds=100> <profileSeeds=10>`.

Ölçüm tasarımı: **job geçişi** (balanced vs balanced, hazır desteler, 3×3 job eşleşmesi) temel ölçümdür; Genel, Açılış, Kombo, Bitiş nedeni, Kartlar bölümleri yalnız buradan hesaplanır. **Profil geçişi** (3 profil × 3 profil, her biri 3 aynalı job'ta) yalnız Profil eşleşmeleri ve profile göre boşa giden MP için kullanılır.

- [ ] **Adım 1: Başarısız testi yaz** — `tools/sim/src/sim.test.ts` tümüyle:

```ts
import { describe, expect, it } from 'vitest';
import { loadSimInput } from './load-input';
import { renderCsv, summarize } from './report';
import { runJobMatrix, runProfileMatrix, seedRange } from './run';

const input = loadSimInput();

describe('simulation smoke (job matrix 3×3 × 1 seed, profile matrix 3×(3×3) × 1 seed)', () => {
  const job = runJobMatrix(input, seedRange(1, 1));
  const profile = runProfileMatrix(input, seedRange(1, 1));
  const records = [...job, ...profile];

  it('every match ends, no illegal action is thrown', () => {
    expect(job).toHaveLength(9);
    expect(profile).toHaveLength(27);
    for (const r of records) expect(r.rounds).toBeGreaterThan(0);
    expect(job.every((r) => r.pass === 'job')).toBe(true);
    expect(profile.every((r) => r.pass === 'profile')).toBe(true);
  });

  it('is deterministic', () => {
    const again = runJobMatrix(input, seedRange(1, 1));
    expect(renderCsv(again)).toBe(renderCsv(job));
  });

  it('summary covers every card that is in a preset deck and every end reason', () => {
    const s = summarize(records, input);
    const deckCards = new Set(Object.values(input.decks).flat());
    expect(s.cards).toHaveLength(deckCards.size);
    expect(s.cards.every((c) => deckCards.has(c.id))).toBe(true);
    const total = Object.values(s.endReason).reduce((a, b) => a + b, 0);
    expect(total).toBe(9);
    expect(s.matches).toBe(9);
    expect(s.profileMatches).toBe(27);
  });

  it('records the new per-seat metrics', () => {
    for (const r of job) {
      expect(r.deadOpening).toHaveLength(2);
      expect(r.chains.every((n) => n >= 0)).toBe(true);
      expect(r.stealthUses.every((n) => n >= 0)).toBe(true);
      expect(r.poisonDamage.every((n) => n >= 0)).toBe(true);
    }
  });
});
```

- [ ] **Adım 2: Çalıştır, KIRMIZI gör** — `corepack pnpm --filter @koidle/sim test` → **FAIL** (`runJobMatrix` yok).

- [ ] **Adım 3: Gerçekleme**

`tools/sim/src/load-input.ts`:

```ts
import {
  loadAiPlanner,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDecks,
} from '@koidle/content-schema';
import type { SimInput } from './run';

export function loadSimInput(): SimInput {
  return {
    config: loadBattleConfig(),
    cards: loadAllCards(),
    decks: loadPresetDecks(),
    profiles: loadAiProfiles(),
    planner: loadAiPlanner(),
  };
}
```

`tools/sim/src/run.ts` (tam):

```ts
import { AI_PROFILES, type AiProfile, chooseAction, type Planner, type Weights } from '@koidle/ai';
import { ARCHETYPE_IDS, type ArchetypeId } from '@koidle/content-schema';
import {
  apply,
  type BattleConfig,
  type CardDef,
  createBattle,
  type EndReason,
  legalActions,
  type PlayerIndex,
} from '@koidle/rules';

export interface SimInput {
  config: BattleConfig;
  cards: CardDef[];
  decks: Record<ArchetypeId, string[]>;
  profiles: Record<AiProfile, Weights>;
  planner: Planner;
}

export interface Side {
  archetype: ArchetypeId;
  profile: AiProfile;
}

/** job = job eşleşmeleri (temel ölçüm), profile = profil eşleşmeleri. */
export type Pass = 'job' | 'profile';

export interface MatchRecord {
  seed: number;
  pass: Pass;
  p0Archetype: ArchetypeId;
  p1Archetype: ArchetypeId;
  p0Profile: AiProfile;
  p1Profile: AiProfile;
  firstPlayer: PlayerIndex;
  winner: PlayerIndex | null;
  endReason: EndReason;
  rounds: number;
  arenaSeen: boolean;
  fatigueSeen: boolean;
  reshuffleSeen: boolean;
  unusedMp: [number, number];
  turns: [number, number];
  cardsPlayed: [number, number];
  /** Oyuncunun ilk 2 turunda, tur başında oynanabilir kart yoktu (yalnız END_TURN yasal). */
  deadOpening: [boolean, boolean];
  /** Zincir bonusu tetiklenme sayısı (koltuk başına). */
  chains: [number, number];
  /** Gizli'nin harcanma sayısı (koltuk başına). */
  stealthUses: [number, number];
  /** Koltuğun Zehir'inin rakibe verdiği toplam hasar. */
  poisonDamage: [number, number];
  /** kart id → [P0 kaç kez oynadı, P1 kaç kez oynadı]; yalnız oynanan kartlar yazılır. */
  plays: Record<string, [number, number]>;
}

/** Güvenlik sınırı: bir maçta bundan fazla aksiyon olursa AI döngüde demektir. */
const MAX_ACTIONS = 2000;

export function playMatch(
  input: SimInput,
  seed: number,
  p0: Side,
  p1: Side,
  pass: Pass,
): MatchRecord {
  const { config, cards, decks, profiles, planner } = input;
  const sides = [p0, p1] as const;
  let { state, events } = createBattle({
    config,
    cards,
    decks: [decks[p0.archetype], decks[p1.archetype]],
    names: [`${p0.archetype}/${p0.profile}`, `${p1.archetype}/${p1.profile}`],
    seed,
  });
  const rec: MatchRecord = {
    seed,
    pass,
    p0Archetype: p0.archetype,
    p1Archetype: p1.archetype,
    p0Profile: p0.profile,
    p1Profile: p1.profile,
    firstPlayer: state.firstPlayer,
    winner: null,
    endReason: 'roundCap',
    rounds: 0,
    arenaSeen: false,
    fatigueSeen: false,
    reshuffleSeen: false,
    unusedMp: [0, 0],
    turns: [0, 0],
    cardsPlayed: [0, 0],
    deadOpening: [false, false],
    chains: [0, 0],
    stealthUses: [0, 0],
    poisonDamage: [0, 0],
    plays: {},
  };

  let actions = 0;
  for (;;) {
    for (const e of events) {
      if (e.type === 'DAMAGE_DEALT' && e.source === 'arena') rec.arenaSeen = true;
      if (e.type === 'DAMAGE_DEALT' && e.source === 'fatigue') rec.fatigueSeen = true;
      if (e.type === 'DAMAGE_DEALT' && e.source === 'poison') {
        // Zehir hedefe verilir; hasarı veren koltuk rakiptir.
        rec.poisonDamage[e.target === 0 ? 1 : 0] += e.amount;
      }
      if (e.type === 'DECK_RESHUFFLED') rec.reshuffleSeen = true;
      if (e.type === 'CHAIN_TRIGGERED') rec.chains[e.player] += 1;
      if (e.type === 'STEALTH_USED') rec.stealthUses[e.player] += 1;
      if (e.type === 'TURN_ENDED') {
        rec.unusedMp[e.player] += e.unusedMp;
        rec.turns[e.player] += 1;
      }
      if (e.type === 'CARD_PLAYED') {
        rec.cardsPlayed[e.player] += 1;
        let slot = rec.plays[e.cardId];
        if (!slot) {
          slot = [0, 0];
          rec.plays[e.cardId] = slot;
        }
        slot[e.player] += 1;
      }
      if (e.type === 'BATTLE_ENDED') {
        rec.winner = e.winner;
        rec.endReason = e.reason;
        rec.rounds = e.round;
      }
    }
    if (state.result) return rec;
    if (++actions > MAX_ACTIONS) throw new Error(`seed ${seed}: ${MAX_ACTIONS} aksiyonu aştı`);
    const me = state.active;
    const pl = state.players[me];
    // Ölü açılış: ilk 2 turda, tur başında (henüz kart oynanmadan) yalnız END_TURN yasal.
    if (pl.turnsTaken <= 2 && pl.cardsPlayedThisTurn === 0 && legalActions(state).length === 1) {
      rec.deadOpening[me] = true;
    }
    const profile = profiles[sides[me].profile];
    ({ state, events } = apply(state, chooseAction(state, me, profile, { planner })));
  }
}

/** 3×3 job eşleşmesi (balanced vs balanced) × seed listesi. Varsayılan: 100 seed → 900 maç. */
export function runJobMatrix(input: SimInput, seeds: number[]): MatchRecord[] {
  const out: MatchRecord[] = [];
  for (const a0 of ARCHETYPE_IDS) {
    for (const a1 of ARCHETYPE_IDS) {
      for (const seed of seeds) {
        out.push(
          playMatch(
            input,
            seed,
            { archetype: a0, profile: 'balanced' },
            { archetype: a1, profile: 'balanced' },
            'job',
          ),
        );
      }
    }
  }
  return out;
}

/** 3×3 profil eşleşmesi × 3 aynalı job × seed listesi. Varsayılan: 10 seed → 270 maç. */
export function runProfileMatrix(input: SimInput, seeds: number[]): MatchRecord[] {
  const out: MatchRecord[] = [];
  for (const archetype of ARCHETYPE_IDS) {
    for (const p0 of AI_PROFILES) {
      for (const p1 of AI_PROFILES) {
        for (const seed of seeds) {
          out.push(
            playMatch(
              input,
              seed,
              { archetype, profile: p0 },
              { archetype, profile: p1 },
              'profile',
            ),
          );
        }
      }
    }
  }
  return out;
}

export const seedRange = (from: number, count: number): number[] =>
  Array.from({ length: count }, (_, i) => from + i);
```

`tools/sim/src/report.ts` (tam):

```ts
import { AI_PROFILES, type AiProfile, type Planner } from '@koidle/ai';
import { ARCHETYPE_IDS, ARCHETYPES, type ArchetypeId } from '@koidle/content-schema';
import {
  type BattleConfig,
  type CardDef,
  type EndReason,
  isHeavy,
  type PlayerIndex,
} from '@koidle/rules';
import type { MatchRecord } from './run';

// Simülasyon "eğlenceli mi?" kararı vermez (C5). Gate 2 sim ölçütleri (spec §9) yalnız işaretlenir:
// job eşleşmesi %40–60 dışı ⚠, kart oynanma oranı < %30 "DÜŞÜK".

/** Gate 2 ölçütü: her kart içinde olduğu destelerde kabaca > %30 oynanmalı. */
export const LOW_PLAYED_RATE = 0.3;

const SEATS = [0, 1] as const;
const rate = (n: number, d: number): number => (d === 0 ? 0 : n / d);
const seatArchetype = (r: MatchRecord, seat: PlayerIndex): ArchetypeId =>
  seat === 0 ? r.p0Archetype : r.p1Archetype;
const seatProfile = (r: MatchRecord, seat: PlayerIndex): AiProfile =>
  seat === 0 ? r.p0Profile : r.p1Profile;

function perArchetype<T>(init: () => T): Record<ArchetypeId, T> {
  return Object.fromEntries(ARCHETYPE_IDS.map((a) => [a, init()])) as Record<ArchetypeId, T>;
}

export interface CardStat {
  id: string;
  name: string;
  cost: number;
  heavy: boolean;
  /** Kartın destesinde olduğu oyuncu-maç sayısı (payda). */
  inDeck: number;
  /** Destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. */
  playedRate: number;
  avgPlaysWhenInDeck: number;
  /** Kartı oynayan oyuncunun o maçlardaki kazanma oranı. */
  winRateWhenPlayed: number | null;
  flag: 'never' | 'low' | 'always' | null;
}

export interface ComboStat {
  /** Oyuncu-maç başına ortalama. */
  chains: number;
  stealthUses: number;
  poisonDamage: number;
}

export interface SimSummary {
  /** Job geçişi (temel ölçüm) maç sayısı. */
  matches: number;
  profileMatches: number;
  rounds: { mean: number; median: number; min: number; max: number };
  firstPlayerWinRate: number;
  drawRate: number;
  arenaRate: number;
  fatigueRate: number;
  bothArenaAndFatigueReachedRate: number;
  reshuffleRate: number;
  endReason: Record<EndReason, number>;
  /** satır job'ının sütun job'ına karşı kazanma oranı (iki koltuk birleşik); ayna maçta null */
  jobMatrix: Record<ArchetypeId, Record<ArchetypeId, number | null>>;
  profileMatrix: Record<AiProfile, Record<AiProfile, number | null>>;
  unusedMpPerTurn: { overall: number; byProfile: Record<AiProfile, number> };
  /** İlk 2 turda oynanabilir kart olmayan oyuncu-maç oranı (hedef ~0). */
  deadOpening: { overall: number; byArchetype: Record<ArchetypeId, number> };
  combos: Record<ArchetypeId, ComboStat>;
  cards: CardStat[];
}

export interface SummaryInput {
  cards: CardDef[];
  decks: Record<ArchetypeId, string[]>;
}

/** Satır anahtarının sütun anahtarına karşı kazanma oranı; iki koltuk birleşik, ayna maç null. */
export function seatMatrix<K extends string>(
  records: MatchRecord[],
  keys: readonly K[],
  keyOf: (r: MatchRecord, seat: PlayerIndex) => K,
): Record<K, Record<K, number | null>> {
  const m = {} as Record<K, Record<K, number | null>>;
  for (const a of keys) {
    m[a] = {} as Record<K, number | null>;
    for (const b of keys) {
      if (a === b) {
        m[a][b] = null;
        continue;
      }
      let wins = 0;
      let games = 0;
      for (const r of records) {
        const s0 = keyOf(r, 0);
        const s1 = keyOf(r, 1);
        if (s0 === a && s1 === b) {
          games++;
          if (r.winner === 0) wins++;
        } else if (s0 === b && s1 === a) {
          games++;
          if (r.winner === 1) wins++;
        }
      }
      m[a][b] = rate(wins, games);
    }
  }
  return m;
}

function unusedMp(records: MatchRecord[], profile?: AiProfile): number {
  let unused = 0;
  let turns = 0;
  for (const r of records) {
    for (const seat of SEATS) {
      if (profile && seatProfile(r, seat) !== profile) continue;
      unused += r.unusedMp[seat];
      turns += r.turns[seat];
    }
  }
  return rate(unused, turns);
}

export function summarize(records: MatchRecord[], input: SummaryInput): SimSummary {
  const job = records.filter((r) => r.pass === 'job');
  const prof = records.filter((r) => r.pass === 'profile');
  const n = job.length;
  const rounds = job.map((r) => r.rounds).sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 ? (rounds[mid] ?? 0) : ((rounds[mid - 1] ?? 0) + (rounds[mid] ?? 0)) / 2;

  const endReason: Record<EndReason, number> = {
    normalDamage: 0,
    fatigue: 0,
    arenaCollapse: 0,
    roundCap: 0,
  };
  for (const r of job) endReason[r.endReason] += 1;

  const seatsBy = perArchetype(() => 0);
  const deadBy = perArchetype(() => 0);
  const chainsBy = perArchetype(() => 0);
  const stealthBy = perArchetype(() => 0);
  const poisonBy = perArchetype(() => 0);
  for (const r of job) {
    for (const seat of SEATS) {
      const a = seatArchetype(r, seat);
      seatsBy[a] += 1;
      if (r.deadOpening[seat]) deadBy[a] += 1;
      chainsBy[a] += r.chains[seat];
      stealthBy[a] += r.stealthUses[seat];
      poisonBy[a] += r.poisonDamage[seat];
    }
  }
  const combos = Object.fromEntries(
    ARCHETYPE_IDS.map((a) => [
      a,
      {
        chains: rate(chainsBy[a], seatsBy[a]),
        stealthUses: rate(stealthBy[a], seatsBy[a]),
        poisonDamage: rate(poisonBy[a], seatsBy[a]),
      },
    ]),
  ) as Record<ArchetypeId, ComboStat>;
  const deadByArchetype = Object.fromEntries(
    ARCHETYPE_IDS.map((a) => [a, rate(deadBy[a], seatsBy[a])]),
  ) as Record<ArchetypeId, number>;
  const deadTotal = ARCHETYPE_IDS.reduce((sum, a) => sum + deadBy[a], 0);

  // Kartlar: yalnız en az bir hazır destede olanlar; payda = kartın destede olduğu oyuncu-maçlar.
  const deckSets = Object.fromEntries(
    ARCHETYPE_IDS.map((a) => [a, new Set(input.decks[a])]),
  ) as Record<ArchetypeId, Set<string>>;
  const cardStats: CardStat[] = input.cards
    .filter((c) => ARCHETYPE_IDS.some((a) => deckSets[a].has(c.id)))
    .map((c) => {
      let inDeck = 0;
      let played = 0;
      let plays = 0;
      let wins = 0;
      for (const r of job) {
        for (const seat of SEATS) {
          if (!deckSets[seatArchetype(r, seat)].has(c.id)) continue;
          inDeck++;
          const k = r.plays[c.id]?.[seat] ?? 0;
          plays += k;
          if (k > 0) {
            played++;
            if (r.winner === seat) wins++;
          }
        }
      }
      const playedRate = rate(played, inDeck);
      let flag: CardStat['flag'] = null;
      if (played === 0) flag = 'never';
      else if (playedRate >= 0.99) flag = 'always';
      else if (playedRate < LOW_PLAYED_RATE) flag = 'low';
      return {
        id: c.id,
        name: c.name,
        cost: c.cost,
        heavy: isHeavy(c),
        inDeck,
        playedRate,
        avgPlaysWhenInDeck: rate(plays, inDeck),
        winRateWhenPlayed: played === 0 ? null : wins / played,
        flag,
      };
    });

  return {
    matches: n,
    profileMatches: prof.length,
    rounds: {
      mean: rate(
        rounds.reduce((a, b) => a + b, 0),
        n,
      ),
      median,
      min: rounds[0] ?? 0,
      max: rounds[n - 1] ?? 0,
    },
    firstPlayerWinRate: rate(job.filter((r) => r.winner === r.firstPlayer).length, n),
    drawRate: rate(job.filter((r) => r.winner === null).length, n),
    arenaRate: rate(job.filter((r) => r.arenaSeen).length, n),
    fatigueRate: rate(job.filter((r) => r.fatigueSeen).length, n),
    bothArenaAndFatigueReachedRate: rate(
      job.filter((r) => r.arenaSeen && r.fatigueSeen).length,
      n,
    ),
    reshuffleRate: rate(job.filter((r) => r.reshuffleSeen).length, n),
    endReason,
    jobMatrix: seatMatrix(job, ARCHETYPE_IDS, seatArchetype),
    profileMatrix: seatMatrix(prof, AI_PROFILES, seatProfile),
    unusedMpPerTurn: {
      overall: unusedMp(job),
      byProfile: Object.fromEntries(AI_PROFILES.map((p) => [p, unusedMp(prof, p)])) as Record<
        AiProfile,
        number
      >,
    },
    deadOpening: { overall: rate(deadTotal, n * 2), byArchetype: deadByArchetype },
    combos,
    cards: cardStats,
  };
}

const pct = (x: number | null): string => (x === null ? '—' : `%${(x * 100).toFixed(1)}`);
const num = (x: number): string => x.toFixed(2);
/** Job eşleşmesi hücresi: Gate 2 aralığı (%40–60) dışındaysa ⚠. */
const pctJob = (x: number | null): string =>
  x === null ? '—' : `${pct(x)}${x < 0.4 || x > 0.6 ? ' ⚠' : ''}`;
const range = (s: number[]): string => (s.length === 0 ? '—' : `${s[0]}–${s.at(-1)}`);

export interface ReportMeta {
  jobSeeds: number[];
  profileSeeds: number[];
  planner: Planner;
}

export function renderMarkdown(s: SimSummary, config: BattleConfig, meta: ReportMeta): string {
  const o: string[] = [];
  o.push('# Simülasyon Raporu (AI vs AI) — Faz 2a');
  o.push('');
  o.push(
    '> `pnpm sim` ile üretilir. Simülasyon "eğlenceli mi?" kararı vermez; bariz matematik hatası ve anlamsız davranış arar. Otomatik kabul/red eşiği yoktur (C5); ⚠ ve DÜŞÜK işaretleri Gate 2 ölçütlerini (spec §9) hatırlatır.',
  );
  o.push(
    '> **Faz 1 sim sonuçları artık karşılaştırılamaz:** yeni kartlar, açılış eli kuralı ve AI tur planı (F2-11) yeni bir temel ölçüm başlattı.',
  );
  o.push(
    `> Job geçişi: ${s.matches} maç = 3×3 job eşleşmesi × ${meta.jobSeeds.length} seed (${range(meta.jobSeeds)}), balanced vs balanced, hazır desteler. Genel, Açılış, Kombo, Bitiş nedeni ve Kartlar bölümleri yalnız bu geçişten.`,
  );
  o.push(
    `> Profil geçişi: ${s.profileMatches} maç = 3×3 profil eşleşmesi × 3 aynalı job × ${meta.profileSeeds.length} seed (${range(meta.profileSeeds)}).`,
  );
  o.push(`> AI tur planı: derinlik ${meta.planner.depth}, ışın ${meta.planner.beam}.`);
  o.push(
    `> Config özeti: HP ${config.hero.hp} · MP ${config.mp.start}→${config.mp.max} · el ${config.hand.starting}/${config.hand.limit} · Kalkan ${config.shield.persistence} · karıştırma ${config.deck.reshuffles} · Arena ${config.arenaCollapse.startRound}. raunt · Yorgunluk ${config.fatigue.start}+${config.fatigue.step}`,
  );
  o.push('');
  o.push('## Genel');
  o.push('');
  o.push('| Ölçüt | Değer |');
  o.push('|---|---|');
  o.push(
    `| Raunt ortalama / medyan / min / maks | ${num(s.rounds.mean)} / ${s.rounds.median} / ${s.rounds.min} / ${s.rounds.max} |`,
  );
  o.push(`| İlk oyuncunun kazanma oranı | ${pct(s.firstPlayerWinRate)} |`);
  o.push(`| Berabere | ${pct(s.drawRate)} |`);
  o.push(`| Arena Çöküşü görülen maç | ${pct(s.arenaRate)} |`);
  o.push(`| Yorgunluk görülen maç | ${pct(s.fatigueRate)} |`);
  o.push(
    `| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | ${pct(s.bothArenaAndFatigueReachedRate)} |`,
  );
  o.push(`| Karıştırma görülen maç | ${pct(s.reshuffleRate)} |`);
  o.push(`| Tur başına kullanılmayan MP (ortalama) | ${num(s.unusedMpPerTurn.overall)} |`);
  o.push('');
  o.push('## Açılış (ilk 2 turda oynanabilir kart yok)');
  o.push('');
  o.push('Hedef ~0 (spec §9). Oran: oyuncu-maçların kaçında ilk 2 turda bir kez bile oynanabilir kart yoktu.');
  o.push('');
  o.push('| Job | Ölü açılış oranı |');
  o.push('|---|---|');
  o.push(`| Tümü | ${pct(s.deadOpening.overall)} |`);
  for (const a of ARCHETYPE_IDS) {
    o.push(`| ${ARCHETYPES[a].name} | ${pct(s.deadOpening.byArchetype[a])} |`);
  }
  o.push('');
  o.push('## Job eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)');
  o.push('');
  o.push('Gate 2 aralığı %40–60; dışındakiler ⚠.');
  o.push('');
  o.push(`| | ${ARCHETYPE_IDS.map((a) => ARCHETYPES[a].name).join(' | ')} |`);
  o.push(`|---|${ARCHETYPE_IDS.map(() => '---').join('|')}|`);
  for (const a of ARCHETYPE_IDS) {
    o.push(
      `| ${ARCHETYPES[a].name} | ${ARCHETYPE_IDS.map((b) => pctJob(s.jobMatrix[a][b])).join(' | ')} |`,
    );
  }
  o.push('');
  o.push('## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)');
  o.push('');
  o.push('| Job | Zincir | Gizli kullanımı | Zehir hasarı |');
  o.push('|---|---|---|---|');
  for (const a of ARCHETYPE_IDS) {
    const c = s.combos[a];
    o.push(
      `| ${ARCHETYPES[a].name} | ${num(c.chains)} | ${num(c.stealthUses)} | ${num(c.poisonDamage)} |`,
    );
  }
  o.push('');
  o.push('## Bitiş nedeni (endReason)');
  o.push('');
  o.push('| Neden | Maç | Oran |');
  o.push('|---|---|---|');
  for (const [k, v] of Object.entries(s.endReason)) {
    o.push(`| ${k} | ${v} | ${pct(rate(v, s.matches))} |`);
  }
  o.push('');
  o.push('## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)');
  o.push('');
  o.push(`| | ${AI_PROFILES.join(' | ')} |`);
  o.push(`|---|${AI_PROFILES.map(() => '---').join('|')}|`);
  for (const a of AI_PROFILES) {
    o.push(`| ${a} | ${AI_PROFILES.map((b) => pct(s.profileMatrix[a][b])).join(' | ')} |`);
  }
  o.push('');
  o.push('## Kullanılmayan MP (tur başına, profile göre)');
  o.push('');
  o.push('| Profil | MP |');
  o.push('|---|---|');
  for (const p of AI_PROFILES) o.push(`| ${p} | ${num(s.unusedMpPerTurn.byProfile[p])} |`);
  o.push('');
  o.push('## Kartlar (yalnız en az bir hazır destede olanlar)');
  o.push('');
  o.push(
    `Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %${LOW_PLAYED_RATE * 100} (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.`,
  );
  o.push('');
  o.push(
    '| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |',
  );
  o.push('|---|---|---|---|---|---|---|');
  for (const c of s.cards) {
    const flag =
      c.flag === 'never'
        ? 'HİÇ OYNANMADI'
        : c.flag === 'low'
          ? 'DÜŞÜK'
          : c.flag === 'always'
            ? 'HER MAÇ'
            : '';
    o.push(
      `| ${c.heavy ? '★ ' : ''}${c.name} (\`${c.id}\`) | ${c.cost} | ${c.inDeck} | ${pct(c.playedRate)} | ${num(c.avgPlaysWhenInDeck)} | ${pct(c.winRateWhenPlayed)} | ${flag} |`,
    );
  }
  o.push('');
  return o.join('\n');
}

const CSV_HEADER = [
  'pass',
  'seed',
  'p0Archetype',
  'p1Archetype',
  'p0Profile',
  'p1Profile',
  'firstPlayer',
  'winner',
  'endReason',
  'rounds',
  'arenaSeen',
  'fatigueSeen',
  'reshuffleSeen',
  'unusedMpP0',
  'unusedMpP1',
  'turnsP0',
  'turnsP1',
  'cardsPlayedP0',
  'cardsPlayedP1',
  'deadOpeningP0',
  'deadOpeningP1',
  'chainsP0',
  'chainsP1',
  'stealthUsesP0',
  'stealthUsesP1',
  'poisonDamageP0',
  'poisonDamageP1',
];

export function renderCsv(records: MatchRecord[]): string {
  const rows = records.map((r) =>
    [
      r.pass,
      r.seed,
      r.p0Archetype,
      r.p1Archetype,
      r.p0Profile,
      r.p1Profile,
      r.firstPlayer,
      r.winner ?? 'draw',
      r.endReason,
      r.rounds,
      r.arenaSeen,
      r.fatigueSeen,
      r.reshuffleSeen,
      r.unusedMp[0],
      r.unusedMp[1],
      r.turns[0],
      r.turns[1],
      r.cardsPlayed[0],
      r.cardsPlayed[1],
      r.deadOpening[0],
      r.deadOpening[1],
      r.chains[0],
      r.chains[1],
      r.stealthUses[0],
      r.stealthUses[1],
      r.poisonDamage[0],
      r.poisonDamage[1],
    ].join(','),
  );
  return `${[CSV_HEADER.join(','), ...rows].join('\n')}\n`;
}
```

`tools/sim/src/cli.ts` (tam):

```ts
// pnpm sim → reports/sim/latest.{md,json,csv}. İsteğe bağlı: pnpm sim -- <jobSeedSayısı=100> <profilSeedSayısı=10>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSimInput } from './load-input';
import { renderCsv, renderMarkdown, summarize } from './report';
import { runJobMatrix, runProfileMatrix, seedRange } from './run';

const args = process.argv.slice(2).filter((a) => a !== '--');
const jobCount = Number(args[0] ?? 100);
const profileCount = Number(args[1] ?? 10);
const jobSeeds = seedRange(1, jobCount);
const profileSeeds = seedRange(1, profileCount);
const input = loadSimInput();
const started = performance.now();
const records = [...runJobMatrix(input, jobSeeds), ...runProfileMatrix(input, profileSeeds)];
const summary = summarize(records, input);

const dir = join(import.meta.dirname, '..', '..', '..', 'reports', 'sim');
mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, 'latest.md'),
  renderMarkdown(summary, input.config, { jobSeeds, profileSeeds, planner: input.planner }),
);
// Özet okunaklı, maç kayıtları satır başına bir kayıt (dosya küçük kalsın, diff okunur olsun).
const head = JSON.stringify(
  {
    seeds: { job: { from: jobSeeds[0], count: jobCount }, profile: { from: 1, count: profileCount } },
    config: input.config,
    planner: input.planner,
    decks: input.decks,
    summary,
  },
  null,
  2,
);
const lines = records.map((r) => `    ${JSON.stringify(r)}`).join(',\n');
writeFileSync(
  join(dir, 'latest.json'),
  `${head.slice(0, -2)},\n  "records": [\n${lines}\n  ]\n}\n`,
);
writeFileSync(join(dir, 'latest.csv'), renderCsv(records));
console.log(
  `${records.length} maç, ${Math.round(performance.now() - started)} ms → reports/sim/latest.{md,json,csv}`,
);
```

`tools/sim/src/index.ts`:

```ts
export {
  type CardStat,
  type ComboStat,
  renderCsv,
  renderMarkdown,
  type SimSummary,
  seatMatrix,
  summarize,
} from './report';
export {
  type MatchRecord,
  playMatch,
  runJobMatrix,
  runProfileMatrix,
  type Side,
  type SimInput,
  seedRange,
} from './run';
```

- [ ] **Adım 4: YEŞİL gör** — `corepack pnpm --filter @koidle/sim test` → **PASS**.

- [ ] **Adım 5: Gerçek sim'i koş ve süreyi kaydet**

```
Measure-Command { corepack pnpm --filter @koidle/sim sim } | Select-Object TotalSeconds
```
1170 maç (900 job + 270 profil). Süreyi not et; hedef: toplam < 3 dk. Aşarsa DUR ve Yasin'e bildir (Görev 6 eşiğiyle aynı seçenekler). Çıktıyı yorumla ama **kart değeri değiştirme** (denge ayarı Gate 2 sürecinde Yasin kararıdır; F2-14: ilk oyuncu dengesi Faz 2b'de). Raporu oku: ölü açılış oranı, job matrisi ⚠ hücreleri, DÜŞÜK kartlar, Zincir/Gizli/Zehir sayıları.

- [ ] **Adım 6: Kapı komutu ve commit**

```
git add tools reports/sim
git commit -m "feat(sim): job matrix, profile matrix, dead-opening and combo metrics (new baseline)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

- [ ] **Adım 7: DURUM RAPORU (sim temeli)** — şablonu doldur. "ÇALIŞTIRILAN TESTLER": test sayısı + sim süresi + raporun ana sayıları (ölü açılış, job matrisi, DÜŞÜK kartlar). "SPEC'TEN SAPMA": yok (Faz 1 sim karşılaştırması bilerek bırakıldı).

---

## Görev 8 — Client: job/yol seçimi + deste kurma

**Files**
- Rewrite: `apps/client/src/content.ts`, `useBattle.ts`, `App.tsx`, `components/SetupScreen.tsx`, `components/BattleScreen.tsx`
- Create: `apps/client/src/match.ts`, `match.test.ts`, `deck.ts`, `deck.test.ts`, `components/DeckBuilder.tsx`
- Modify: `apps/client/src/styles.css`

**Interfaces**
- Consumes: `ARCHETYPES`, `ARCHETYPE_IDS`, `inPool`, `validateDeck`, `deckStats`, `loadPresetDecks`, `loadAiPlanner`, `chooseAction({ planner })`.
- Produces: `LoadedContent { config; cards; presets; profiles; planner }`; `MatchSetup { seed; mine; ai; profile }`, `pickAi(seed)`; `readSavedDeck(id)`, `saveDeck(id, deck)`; akış kurulum → deste → savaş.

- [ ] **Adım 1: Başarısız testleri yaz**

`apps/client/src/match.test.ts`:

```ts
import { ARCHETYPE_IDS } from '@koidle/content-schema';
import { describe, expect, it } from 'vitest';
import { pickAi } from './match';

describe('pickAi', () => {
  it('is deterministic per seed (Tekrar keeps the same opponent)', () => {
    for (let seed = 0; seed < 20; seed++) expect(pickAi(seed)).toBe(pickAi(seed));
  });

  it('reaches every archetype', () => {
    const seen = new Set(Array.from({ length: 9 }, (_, seed) => pickAi(seed)));
    expect(seen).toEqual(new Set(ARCHETYPE_IDS));
  });
});
```

`apps/client/src/deck.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readSavedDeck, saveDeck } from './deck';

afterEach(() => vi.unstubAllGlobals());

describe('saved deck', () => {
  it('without localStorage: null and no throw', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(readSavedDeck('warrior')).toBeNull();
    expect(() => saveDeck('warrior', ['slash'])).not.toThrow();
  });

  it('round-trips through the per-archetype key', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    });
    saveDeck('archer', ['viper', 'power-shot']);
    expect(store.has('koidle.deck.archer')).toBe(true);
    expect(readSavedDeck('archer')).toEqual(['viper', 'power-shot']);
    expect(readSavedDeck('warrior')).toBeNull();
  });

  it('rejects garbage', () => {
    vi.stubGlobal('localStorage', { getItem: () => '{"a":1}' });
    expect(readSavedDeck('warrior')).toBeNull();
    vi.stubGlobal('localStorage', { getItem: () => '[1,2]' });
    expect(readSavedDeck('warrior')).toBeNull();
    vi.stubGlobal('localStorage', { getItem: () => 'not json' });
    expect(readSavedDeck('warrior')).toBeNull();
  });
});
```

- [ ] **Adım 2: Çalıştır, KIRMIZI gör** — `corepack pnpm --filter @koidle/client test` → **FAIL** (`./match`, `./deck` yok).

- [ ] **Adım 3: Gerçekleme**

`apps/client/src/match.ts`:

```ts
import type { AiProfile } from '@koidle/ai';
import { ARCHETYPE_IDS, type ArchetypeId } from '@koidle/content-schema';

export interface MatchSetup {
  seed: number;
  mine: ArchetypeId;
  ai: ArchetypeId;
  profile: AiProfile;
}

/** "Rastgele" rakip job'ı seed'den türer; "Tekrar (aynı seed)" aynı rakibi verir. */
export function pickAi(seed: number): ArchetypeId {
  return ARCHETYPE_IDS[seed % ARCHETYPE_IDS.length] ?? 'warrior';
}
```

`apps/client/src/deck.ts`:

```ts
import type { ArchetypeId } from '@koidle/content-schema';

const key = (id: ArchetypeId): string => `koidle.deck.${id}`;

/** Kurulan deste tarayıcıda hatırlanır. localStorage yoksa/bozuksa null (sessizce). */
export function readSavedDeck(id: ArchetypeId): string[] | null {
  try {
    const raw = localStorage.getItem(key(id));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(value) && value.every((x): x is string => typeof x === 'string')) {
      return value;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveDeck(id: ArchetypeId, deck: string[]): void {
  try {
    localStorage.setItem(key(id), JSON.stringify(deck));
  } catch {
    // kayıt olmadan da devam
  }
}
```

`apps/client/src/content.ts` (tam):

```ts
import type { Planner } from '@koidle/ai';
import {
  type ArchetypeId,
  loadAiPlanner,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDecks,
} from '@koidle/content-schema';
import type { BattleConfig, CardDef } from '@koidle/rules';

export interface LoadedContent {
  config: BattleConfig;
  /** Tüm kartlar; deste havuzu `inPool` ile süzülür. */
  cards: CardDef[];
  /** Önerilen desteler: AI'ın destesi ve "Önerilen deste" butonu. */
  presets: Record<ArchetypeId, string[]>;
  profiles: ReturnType<typeof loadAiProfiles>;
  planner: Planner;
}

export type ContentResult = { ok: true; content: LoadedContent } | { ok: false; message: string };

/** Geçersiz içerik ekranı kilitler ve dosya + alan yolunu gösterir. */
export function loadContent(): ContentResult {
  try {
    return {
      ok: true,
      content: {
        config: loadBattleConfig(),
        cards: loadAllCards(),
        presets: loadPresetDecks(),
        profiles: loadAiProfiles(),
        planner: loadAiPlanner(),
      },
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
```

`apps/client/src/useBattle.ts` (tam):

```ts
import { chooseAction } from '@koidle/ai';
import {
  type Action,
  apply,
  type BattleEvent,
  type BattleState,
  createBattle,
} from '@koidle/rules';
import { useCallback, useEffect, useState } from 'react';
import type { LoadedContent } from './content';
import { HUMAN } from './format';
import type { MatchSetup } from './match';

export const AI_DELAY_MS = 700;

export interface BattleSession {
  state: BattleState;
  log: BattleEvent[];
  startedAt: number;
  endedAt: number | null;
}

function start(content: LoadedContent, setup: MatchSetup, myDeck: string[]): BattleSession {
  const { state, events } = createBattle({
    config: content.config,
    cards: content.cards,
    decks: [myDeck, content.presets[setup.ai]],
    names: ['Sen', `AI (${setup.profile})`],
    seed: setup.seed,
  });
  return { state, log: events, startedAt: Date.now(), endedAt: null };
}

export function useBattle(content: LoadedContent, setup: MatchSetup, myDeck: string[]) {
  const [session, setSession] = useState(() => start(content, setup, myDeck));

  const dispatch = useCallback((action: Action) => {
    setSession((s) => {
      if (s.state.result) return s;
      const r = apply(s.state, action);
      return {
        ...s,
        state: r.state,
        log: [...s.log, ...r.events],
        endedAt: r.state.result ? Date.now() : null,
      };
    });
  }, []);

  // AI sırası: kararı rules + ai verir, UI yalnız zamanlar.
  useEffect(() => {
    const { state } = session;
    if (state.result || state.active === HUMAN) return;
    const timer = setTimeout(() => {
      dispatch(
        chooseAction(state, state.active, content.profiles[setup.profile], {
          planner: content.planner,
        }),
      );
    }, AI_DELAY_MS);
    return () => clearTimeout(timer);
  }, [session, content, setup.profile, dispatch]);

  const restart = useCallback(
    () => setSession(start(content, setup, myDeck)),
    [content, setup, myDeck],
  );

  return { ...session, dispatch, restart };
}
```

`apps/client/src/App.tsx` (tam):

```tsx
import { useState } from 'react';
import { BattleScreen } from './components/BattleScreen';
import { DeckBuilder } from './components/DeckBuilder';
import { SetupScreen } from './components/SetupScreen';
import { loadContent } from './content';
import type { MatchSetup } from './match';

const loaded = loadContent();

export function App() {
  const [setup, setSetup] = useState<MatchSetup | null>(null);
  const [battle, setBattle] = useState<{ deck: string[]; key: number } | null>(null);

  if (!loaded.ok) {
    return (
      <main className="content-error">
        <h1>İçerik hatası</h1>
        <p>Savaş açılmadı. content/ altındaki JSON düzeltilmeli:</p>
        <pre>{loaded.message}</pre>
      </main>
    );
  }
  if (!setup) return <SetupScreen onStart={setSetup} />;
  if (!battle) {
    return (
      <DeckBuilder
        content={loaded.content}
        archetypeId={setup.mine}
        onBack={() => setSetup(null)}
        onConfirm={(deck) => setBattle({ deck, key: Date.now() })}
      />
    );
  }
  return (
    <BattleScreen
      key={battle.key}
      content={loaded.content}
      setup={setup}
      deck={battle.deck}
      onNew={() => {
        setBattle(null);
        setSetup(null);
      }}
    />
  );
}
```

`apps/client/src/components/SetupScreen.tsx` (tam):

```tsx
import { AI_PROFILES, type AiProfile } from '@koidle/ai';
import { ARCHETYPE_IDS, ARCHETYPES, type ArchetypeId } from '@koidle/content-schema';
import { useState } from 'react';
import { type MatchSetup, pickAi } from '../match';

const PROFILE_TR: Record<AiProfile, string> = {
  aggressive: 'Saldırgan',
  balanced: 'Dengeli',
  defensive: 'Savunmacı',
};

export function SetupScreen(props: { onStart: (setup: MatchSetup) => void }) {
  const [mine, setMine] = useState<ArchetypeId>('warrior');
  const [ai, setAi] = useState<ArchetypeId | 'random'>('random');
  const [profile, setProfile] = useState<AiProfile>('balanced');
  const [seed, setSeed] = useState('');
  return (
    <form
      className="setup"
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = Number.parseInt(seed, 10);
        // Seed üretmek UI'ın işi; Math.random yalnız rules içinde yasak.
        const s = Number.isFinite(parsed) ? parsed >>> 0 : Math.floor(Math.random() * 1_000_000);
        props.onStart({ seed: s, mine, ai: ai === 'random' ? pickAi(s) : ai, profile });
      }}
    >
      <h1>KOIdLe · Savaş Sandbox</h1>
      <p>Faz 2a · Warrior ve Rogue</p>
      <fieldset>
        <legend>Sen</legend>
        {ARCHETYPE_IDS.map((id) => (
          <label key={id}>
            <input
              type="radio"
              name="mine"
              checked={mine === id}
              onChange={() => setMine(id)}
            />
            {ARCHETYPES[id].name}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Rakip job</legend>
        {ARCHETYPE_IDS.map((id) => (
          <label key={id}>
            <input type="radio" name="ai" checked={ai === id} onChange={() => setAi(id)} />
            {ARCHETYPES[id].name}
          </label>
        ))}
        <label>
          <input
            type="radio"
            name="ai"
            checked={ai === 'random'}
            onChange={() => setAi('random')}
          />
          Rastgele
        </label>
      </fieldset>
      <fieldset>
        <legend>Rakip AI</legend>
        {AI_PROFILES.map((p) => (
          <label key={p}>
            <input
              type="radio"
              name="profile"
              checked={profile === p}
              onChange={() => setProfile(p)}
            />
            {PROFILE_TR[p]}
          </label>
        ))}
      </fieldset>
      <label>
        Seed (boş bırakırsan rastgele)
        <input inputMode="numeric" value={seed} onChange={(e) => setSeed(e.target.value)} />
      </label>
      <button type="submit">Desteni Kur</button>
    </form>
  );
}
```

`apps/client/src/components/DeckBuilder.tsx`:

```tsx
import {
  ARCHETYPES,
  type ArchetypeId,
  deckStats,
  inPool,
  validateDeck,
} from '@koidle/content-schema';
import { isHeavy } from '@koidle/rules';
import { useMemo, useState } from 'react';
import type { LoadedContent } from '../content';
import { readSavedDeck, saveDeck } from '../deck';
import { CardText } from './CardText';

interface Props {
  content: LoadedContent;
  archetypeId: ArchetypeId;
  onBack: () => void;
  onConfirm: (deck: string[]) => void;
}

export function DeckBuilder({ content, archetypeId, onBack, onConfirm }: Props) {
  const { config, cards, presets } = content;
  const arch = ARCHETYPES[archetypeId];
  const pool = useMemo(
    () => cards.filter((c) => inPool(c, arch)).sort((a, b) => a.cost - b.cost),
    [cards, arch],
  );
  const [deck, setDeck] = useState<string[]>(() => {
    const saved = readSavedDeck(archetypeId);
    return saved && validateDeck(saved, archetypeId, cards, config).length === 0
      ? saved
      : presets[archetypeId];
  });

  const issues = validateDeck(deck, archetypeId, cards, config);
  const stats = deckStats(deck, cards, config);
  const { maxHeavy, minOpeners } = config.deckBuilding;
  const full = deck.length >= config.deck.size;
  const toggle = (id: string) =>
    setDeck((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const mark = (ok: boolean) => (ok ? '✓' : '✗');
  const cls = (ok: boolean) => `deck__stat deck__stat--${ok ? 'ok' : 'bad'}`;

  return (
    <main className="deck">
      <header className="deck__head">
        <h1>Deste kur · {arch.name}</h1>
        <button type="button" onClick={() => setDeck(presets[archetypeId])}>
          Önerilen deste
        </button>
      </header>
      <p className="deck__stats" aria-live="polite">
        <span className={cls(stats.size === config.deck.size)}>
          {stats.size}/{config.deck.size} {mark(stats.size === config.deck.size)}
        </span>
        <span className={cls(stats.heavy <= maxHeavy)}>
          Ağır {stats.heavy}/{maxHeavy} {mark(stats.heavy <= maxHeavy)}
        </span>
        <span className={cls(stats.openers >= minOpeners)}>
          {config.mp.start} MP'lik kart: {stats.openers} (en az {minOpeners}){' '}
          {mark(stats.openers >= minOpeners)}
        </span>
      </p>
      {issues.length > 0 && (
        <ul className="deck__issues">
          {issues.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
      <div className="deck__pool">
        {pool.map((c) => {
          const on = deck.includes(c.id);
          return (
            <button
              type="button"
              key={c.id}
              className="pick"
              aria-pressed={on}
              disabled={!on && full}
              onClick={() => toggle(c.id)}
            >
              <span className="pick__top">
                <span>
                  {c.name}
                  {isHeavy(c) ? ' ★' : ''}
                </span>
                <span>{c.cost} MP</span>
              </span>
              <span className="pick__text">
                <CardText text={c.text} />
              </span>
            </button>
          );
        })}
      </div>
      <div className="deck__actions">
        <button type="button" onClick={onBack}>
          Geri
        </button>
        <button
          type="button"
          disabled={issues.length > 0}
          onClick={() => {
            saveDeck(archetypeId, deck);
            onConfirm(deck);
          }}
        >
          Savaşa Başla
        </button>
      </div>
    </main>
  );
}
```

`apps/client/src/components/BattleScreen.tsx` (tam; coşku Görev 9'da eklenir):

```tsx
import { ARCHETYPES } from '@koidle/content-schema';
import type { LoadedContent } from '../content';
import { HUMAN } from '../format';
import type { MatchSetup } from '../match';
import { useBattle } from '../useBattle';
import { ArenaInfo } from './ArenaInfo';
import { BattleLog } from './BattleLog';
import { Hand } from './Hand';
import { HeroPanel } from './HeroPanel';
import { ResultPanel } from './ResultPanel';
import { RulesSummary } from './RulesSummary';

interface Props {
  content: LoadedContent;
  setup: MatchSetup;
  deck: string[];
  onNew: () => void;
}

export function BattleScreen({ content, setup, deck, onNew }: Props) {
  const { seed, profile, mine, ai } = setup;
  const { state, log, startedAt, endedAt, dispatch, restart } = useBattle(content, setup, deck);
  const myTurn = !state.result && state.active === HUMAN;
  const foe = HUMAN === 0 ? 1 : 0;
  return (
    <main className="battle">
      <HeroPanel
        player={state.players[foe]}
        config={state.config}
        title={`Rakip · ${ARCHETYPES[ai].name} · AI ${profile}`}
        active={!state.result && state.active === foe}
        showHandCount
      />
      <ArenaInfo state={state} seed={seed} />
      <RulesSummary config={state.config} />
      <BattleLog log={log} cards={state.cards} />
      <HeroPanel
        player={state.players[HUMAN]}
        config={state.config}
        title={`Sen · ${ARCHETYPES[mine].name}`}
        active={myTurn}
        showHandCount={false}
      />
      <Hand state={state} onPlay={(iid) => dispatch({ type: 'PLAY_CARD', player: HUMAN, iid })} />
      <div className="controls">
        <button
          type="button"
          className="end-turn"
          disabled={!myTurn}
          onClick={() => dispatch({ type: 'END_TURN', player: HUMAN })}
        >
          Turu Bitir
        </button>
      </div>
      {state.result && (
        <ResultPanel
          state={state}
          log={log}
          seed={seed}
          profile={profile}
          durationSec={Math.round(((endedAt ?? startedAt) - startedAt) / 1000)}
          onRestart={restart}
          onNew={onNew}
        />
      )}
    </main>
  );
}
```

`apps/client/src/styles.css` sonuna:

```css
/* Deste kurma ekranı (Faz 2a) */
.deck {
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 16px 32px;
  display: grid;
  gap: 12px;
}
.deck__head {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
  justify-content: space-between;
}
.deck__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin: 0;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.deck__stat--ok {
  color: var(--good);
}
.deck__stat--bad {
  color: var(--bad);
}
.deck__issues {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--bad);
}
.deck__pool {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 8px;
}
.pick {
  display: grid;
  gap: 2px;
  min-height: 44px;
  padding: 8px 10px;
  text-align: left;
  font: inherit;
  color: inherit;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  cursor: pointer;
}
.pick[aria-pressed="true"] {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}
.pick:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pick__top {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
}
.pick__text {
  font-size: 0.85rem;
  color: var(--muted);
}
.deck__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

- [ ] **Adım 4: YEŞİL gör ve elle bak**

`corepack pnpm --filter @koidle/client test` → **PASS**; `corepack pnpm --filter @koidle/client typecheck`. Sonra `corepack pnpm dev` ile aç: Kurulum → Deste → Savaş akışını Warrior ve Okçu için bir kez dene (deste kaydı: sayfayı yenile, aynı deste gelmeli). `format.test.ts`'deki `cards` fixture'ı etkilenmez.

- [ ] **Adım 5: Kapı komutu ve commit**

```
git add apps
git commit -m "feat(client): archetype pick, deck builder with live validation, saved decks" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

---

## Görev 9 — Coşku (CSS) + okunurluk

**Files**
- Create: `apps/client/src/fx.ts`, `fx.test.ts`, `components/useFx.ts`
- Modify: `apps/client/src/useBattle.ts`, `format.ts`, `format.test.ts`, `components/BattleScreen.tsx`, `HeroPanel.tsx`, `Hand.tsx`, `styles.css`

**Interfaces**
- Consumes: `BattleEvent` (`DAMAGE_DEALT`, `CHAIN_TRIGGERED`, `STEALTH_USED`), `isHeavy`, `PlayerState.cardsPlayedThisTurn`, `config.deckBuilding`, `config.statuses.*.duration`.
- Produces: `FX` sabitleri (UI değeri, kural değil), `fxFor(events)`, `useFx(lastEvents, seq)`, `useBattle` → `lastEvents`, `seq`; `keywordParts` yeni anahtar kelimeler; `rulesSummary` yeni satırlar.

- [ ] **Adım 1: Başarısız testleri yaz**

`apps/client/src/fx.test.ts`:

```ts
import type { BattleEvent } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import { FX, fxFor } from './fx';

const dmg = (
  amount: number,
  target: 0 | 1 = 1,
  source: 0 | 1 | 'arena' | 'poison' = 0,
  absorbed = 0,
): BattleEvent => ({ type: 'DAMAGE_DEALT', source, target, amount, absorbed });

describe('fxFor', () => {
  it('does nothing for an empty batch', () => {
    expect(fxFor([])).toEqual({
      hitstop: false,
      shakePx: 0,
      hitTargets: [],
      pops: [],
      callouts: [],
    });
  });

  it('a small hit pops a number and flashes the target, no hitstop, no shake', () => {
    const r = fxFor([dmg(3)]);
    expect(r.pops).toEqual([{ target: 1, amount: 3 }]);
    expect(r.hitTargets).toEqual([1]);
    expect(r.hitstop).toBe(false);
    expect(r.shakePx).toBe(0);
  });

  it('thresholds: hitstop at 6, shake at 10, big shake at 14', () => {
    expect(fxFor([dmg(FX.hitstopAt)]).hitstop).toBe(true);
    expect(fxFor([dmg(FX.hitstopAt)]).shakePx).toBe(0);
    expect(fxFor([dmg(FX.shakeAt)]).shakePx).toBe(FX.shakePx);
    expect(fxFor([dmg(FX.shakeBigAt)]).shakePx).toBe(FX.shakeBigPx);
  });

  it('sums card damage across a multi-hit batch, one pop per hit', () => {
    const r = fxFor([dmg(2), dmg(2), dmg(2), dmg(2), dmg(2)]);
    expect(r.pops).toHaveLength(5);
    expect(r.shakePx).toBe(FX.shakePx);
  });

  it('system damage pops but does not shake or hitstop', () => {
    const r = fxFor([dmg(20, 0, 'arena'), dmg(15, 1, 'poison')]);
    expect(r.pops).toHaveLength(2);
    expect(r.hitstop).toBe(false);
    expect(r.shakePx).toBe(0);
  });

  it('zero damage pops but flashes nobody', () => {
    const r = fxFor([dmg(0)]);
    expect(r.pops).toEqual([{ target: 1, amount: 0 }]);
    expect(r.hitTargets).toEqual([]);
  });

  it('callouts for chain and stealth, in event order', () => {
    const events: BattleEvent[] = [
      { type: 'CHAIN_TRIGGERED', player: 0, chain: 3 },
      { type: 'STEALTH_USED', player: 0, amount: 7 },
      dmg(13),
    ];
    expect(fxFor(events).callouts).toEqual(['ZİNCİR ×3!', 'CRITIC!']);
  });
});
```

`apps/client/src/format.test.ts` — `keywordParts` ve `rulesSummary` bloklarına ekle:

```ts
  it('marks Lanet, Zehir, Gizli and Zincir with their own colors', () => {
    const kws = (t: string) => keywordParts(t).flatMap((p) => (p.kw ? [p.kw] : []));
    expect(kws('Kendine Gizli 3 ver.')).toEqual(['stealth']);
    expect(kws('Rakibe Zehir 4 ver.')).toEqual(['poison']);
    expect(kws('Kendine Güç 3 ve Lanet 2 ver.')).toEqual(['strength', 'curse']);
    expect(kws('2 hasar ver. Zincir 1: +2.')).toEqual(['chain']);
  });
```
```ts
  it('explains Lanet, Zehir, Gizli, Zincir and Ağır from config values', () => {
    const text = rulesSummary(testConfigForSummary).join('\n');
    for (const word of ['Lanet', 'Zehir', 'Gizli', 'Zincir', 'Ağır']) expect(text).toContain(word);
    expect(text).toContain(`en fazla ${testConfigForSummary.deckBuilding.maxHeavy}`);
  });
```

- [ ] **Adım 2: Çalıştır, KIRMIZI gör** — `corepack pnpm --filter @koidle/client test` → **FAIL** (`./fx` yok, anahtar kelimeler yok).

- [ ] **Adım 3: Gerçekleme**

`apps/client/src/fx.ts`:

```ts
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
  shakeBigPx: 8,
  shakeMs: 180,
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
}

/** Bir aksiyonun olay yığınından görsel efektleri türetir. Saf; kural kararı vermez. */
export function fxFor(events: readonly BattleEvent[]): FxResult {
  let cardDamage = 0;
  const hitTargets: PlayerIndex[] = [];
  const pops: Pop[] = [];
  const callouts: string[] = [];
  for (const e of events) {
    if (e.type === 'DAMAGE_DEALT') {
      // Sarsıntı ve hitstop yalnız oyuncu kartlarının hasarına bağlı (Arena/Yorgunluk/Zehir hariç).
      if (typeof e.source === 'number') cardDamage += e.amount;
      pops.push({ target: e.target, amount: e.amount });
      if (e.amount > 0 && !hitTargets.includes(e.target)) hitTargets.push(e.target);
    } else if (e.type === 'CHAIN_TRIGGERED') {
      callouts.push(`ZİNCİR ×${e.chain}!`);
    } else if (e.type === 'STEALTH_USED') {
      callouts.push('CRITIC!');
    }
  }
  let shakePx = 0;
  if (cardDamage >= FX.shakeBigAt) shakePx = FX.shakeBigPx;
  else if (cardDamage >= FX.shakeAt) shakePx = FX.shakePx;
  return { hitstop: cardDamage >= FX.hitstopAt, shakePx, hitTargets, pops, callouts };
}
```

`apps/client/src/useBattle.ts` — `BattleSession`'a `lastEvents: BattleEvent[]; seq: number;`; `start` dönüşüne `lastEvents: [], seq: 0`; `dispatch` içinde dönüş nesnesine `lastEvents: r.events, seq: s.seq + 1,`.

`apps/client/src/components/useFx.ts`:

```ts
import type { BattleEvent } from '@koidle/rules';
import { useEffect, useState } from 'react';
import { FX, type FxResult, fxFor } from '../fx';

export interface ActiveFx {
  /** Her aksiyonda artar; CSS animasyonunu yeniden başlatmak için çift/tek sınıf seçer. */
  seq: number;
  result: FxResult;
}

/** Son aksiyonun efektini calloutMs boyunca tutar, sonra temizler. Girdiyi bloklamaz. */
export function useFx(lastEvents: BattleEvent[], seq: number): ActiveFx | null {
  const [active, setActive] = useState<ActiveFx | null>(null);
  useEffect(() => {
    if (seq === 0) return;
    setActive({ seq, result: fxFor(lastEvents) });
    const timer = setTimeout(() => setActive((cur) => (cur?.seq === seq ? null : cur)), FX.calloutMs);
    return () => clearTimeout(timer);
  }, [lastEvents, seq]);
  return active;
}
```

`apps/client/src/format.ts` — anahtar kelimeler ve özet:

```ts
export type Keyword = 'strength' | 'weak' | 'shield' | 'curse' | 'poison' | 'stealth' | 'chain';
```
```ts
const KEYWORDS: [RegExp, Keyword][] = [
  [/^Güç/, 'strength'],
  [/^Zayıf/, 'weak'],
  [/^Kalkan/, 'shield'],
  [/^Lanet/, 'curse'],
  [/^Zehir/, 'poison'],
  [/^Gizli/, 'stealth'],
  [/^Zincir/, 'chain'],
];
```
`rulesSummary` dönüş dizisine (Yorgunluk satırından sonra) eklenir; fonksiyonun başına `const s = c.statuses;`:

```ts
    `Lanet X: aldığın kart hasarı X artar (${s.curse.duration} tur). Zehir X: sahibinin her tur başında X hasar alır (${s.poison.duration} tur).`,
    `Gizli X: sonraki hasar veren kartının ilk vuruşu X fazla vurur ve Kalkanı yok sayar (${s.stealth.duration} tur).`,
    'Zincir N: bu tur, bu karttan önce en az N kart oynadıysan bonus. "Bu tur oynanan kart" sayacı Turu Bitir’in yanında.',
    `Ağır kartlar (★): destede en fazla ${c.deckBuilding.maxHeavy}.${
      c.hand.openingGuarantee
        ? ` Açılış elinde Ağır kart gelmez, en az bir ${c.mp.start} MP'lik kart gelir.`
        : ''
    }`,
```

`apps/client/src/components/Hand.tsx` — import `isHeavy` (`import { type BattleState, isHeavy, previewCard, validateAction } from '@koidle/rules';`), maliyet satırından sonra:

```tsx
            {isHeavy(def) && (
              <span className="card__heavy" title="Ağır kart: destede sayısı sınırlı">
                ★
              </span>
            )}
```

`apps/client/src/components/HeroPanel.tsx` (tam, nihai):

```tsx
import type { BattleConfig, PlayerState } from '@koidle/rules';
import type { CSSProperties, ReactNode } from 'react';
import { STATUS_TR } from '../format';

export interface PopView {
  key: string;
  amount: number;
}

interface Props {
  player: PlayerState;
  config: BattleConfig;
  title: string;
  active: boolean;
  showHandCount: boolean;
  /** Bu aksiyonda hasar aldıysa seq çift/tek (animasyon yeniden başlasın diye), yoksa null. */
  hit: 0 | 1 | null;
  pops: PopView[];
}

export function HeroPanel({ player: p, config, title, active, showHandCount, hit, pops }: Props) {
  const nextFatigue = config.fatigue.start + p.fatigueCount * config.fatigue.step;
  return (
    <section
      className={`hero ${active ? 'hero--active' : ''}${hit === null ? '' : ` hero--hit${hit}`}`}
    >
      <div className="pops" aria-hidden="true">
        {pops.map((pop, i) => (
          <span key={pop.key} className="pop" style={{ '--i': i } as CSSProperties}>
            −{pop.amount}
          </span>
        ))}
      </div>
      <header>
        <h2>{title}</h2>
        {active && <span className="badge">Sıra burada</span>}
      </header>
      <div className="bars">
        <Meter label="HP" value={p.hp} max={p.maxHp} kind="hp" />
        <Meter label="MP" value={p.mp} max={p.maxMp} kind="mp" />
      </div>
      <dl className="stats">
        <Stat label="Kalkan" value={<span className="kw kw--shield">{p.shield}</span>} />
        <Stat
          label="Statüler"
          value={
            p.statuses.length === 0
              ? '—'
              : p.statuses.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 && ', '}
                    <span className={`kw kw--${s.id}`}>
                      {STATUS_TR[s.id]} {s.amount}
                    </span>{' '}
                    · {s.turnsLeft} tur
                  </span>
                ))
          }
        />
        {showHandCount && <Stat label="Eldeki kart" value={p.hand.length} />}
        <Stat label="Deste" value={p.deck.length} />
        <Stat label="Iskarta" value={p.discard.length} />
        <Stat label="Karıştırma hakkı" value={p.reshufflesLeft} />
        <Stat label="Yorgunluk" value={`${p.fatigueCount} kez · sıradaki ${nextFatigue}`} />
      </dl>
    </section>
  );
}

function Meter(props: { label: string; value: number; max: number; kind: 'hp' | 'mp' }) {
  const pct = props.max === 0 ? 0 : Math.round((props.value / props.max) * 100);
  return (
    <div className="meter">
      <span className="meter__label">
        {props.label} {props.value}/{props.max}
      </span>
      <span className={`meter__track meter__track--${props.kind}`}>
        <span className="meter__fill" style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}

function Stat(props: { label: string; value: ReactNode }) {
  return (
    <div className="stat">
      <dt>{props.label}</dt>
      <dd>{props.value}</dd>
    </div>
  );
}
```

`apps/client/src/components/BattleScreen.tsx` (tam, nihai):

```tsx
import { ARCHETYPES } from '@koidle/content-schema';
import type { PlayerIndex } from '@koidle/rules';
import type { CSSProperties } from 'react';
import type { LoadedContent } from '../content';
import { HUMAN } from '../format';
import { FX } from '../fx';
import type { MatchSetup } from '../match';
import { useBattle } from '../useBattle';
import { ArenaInfo } from './ArenaInfo';
import { BattleLog } from './BattleLog';
import { Hand } from './Hand';
import { HeroPanel, type PopView } from './HeroPanel';
import { ResultPanel } from './ResultPanel';
import { RulesSummary } from './RulesSummary';
import { useFx } from './useFx';

interface Props {
  content: LoadedContent;
  setup: MatchSetup;
  deck: string[];
  onNew: () => void;
}

export function BattleScreen({ content, setup, deck, onNew }: Props) {
  const { seed, profile, mine, ai } = setup;
  const { state, log, startedAt, endedAt, lastEvents, seq, dispatch, restart } = useBattle(
    content,
    setup,
    deck,
  );
  const fx = useFx(lastEvents, seq);
  const myTurn = !state.result && state.active === HUMAN;
  const foe: PlayerIndex = HUMAN === 0 ? 1 : 0;

  const parity = fx && fx.seq % 2 === 1 ? 1 : 0;
  const hitFor = (p: PlayerIndex): 0 | 1 | null =>
    fx?.result.hitTargets.includes(p) ? parity : null;
  const popsFor = (p: PlayerIndex): PopView[] =>
    fx
      ? fx.result.pops
          .filter((x) => x.target === p)
          .map((x, i) => ({ key: `${fx.seq}-${p}-${i}`, amount: x.amount }))
      : [];

  // Süreler fx.ts'ten CSS değişkeni olarak gider; animasyonlar styles.css'te.
  const cssVars = {
    '--hitstop-ms': `${FX.hitstopMs}ms`,
    '--shake-ms': `${FX.shakeMs}ms`,
    '--pop-ms': `${FX.popMs}ms`,
    '--callout-ms': `${FX.calloutMs}ms`,
    '--flash-ms': `${FX.flashMs}ms`,
    '--shake-px': `${fx?.result.shakePx ?? 0}px`,
  } as CSSProperties;
  const shake = fx && fx.result.shakePx > 0 ? ` fx-shake-${parity}` : '';
  const hitstop = fx?.result.hitstop ? ' fx-hitstop' : '';
  const callout = fx?.result.callouts.join(' ') ?? '';

  return (
    <main className={`battle${shake}${hitstop}`} style={cssVars}>
      <HeroPanel
        player={state.players[foe]}
        config={state.config}
        title={`Rakip · ${ARCHETYPES[ai].name} · AI ${profile}`}
        active={!state.result && state.active === foe}
        showHandCount
        hit={hitFor(foe)}
        pops={popsFor(foe)}
      />
      <ArenaInfo state={state} seed={seed} />
      <RulesSummary config={state.config} />
      <BattleLog log={log} cards={state.cards} />
      <HeroPanel
        player={state.players[HUMAN]}
        config={state.config}
        title={`Sen · ${ARCHETYPES[mine].name}`}
        active={myTurn}
        showHandCount={false}
        hit={hitFor(HUMAN)}
        pops={popsFor(HUMAN)}
      />
      <Hand state={state} onPlay={(iid) => dispatch({ type: 'PLAY_CARD', player: HUMAN, iid })} />
      <div className="controls">
        {myTurn && (
          <span className="chain-count">
            Bu tur oynanan kart: <strong>{state.players[HUMAN].cardsPlayedThisTurn}</strong>
          </span>
        )}
        <button
          type="button"
          className="end-turn"
          disabled={!myTurn}
          onClick={() => dispatch({ type: 'END_TURN', player: HUMAN })}
        >
          Turu Bitir
        </button>
      </div>
      {callout && (
        <div key={fx?.seq} className="callout" aria-hidden="true">
          {callout}
        </div>
      )}
      {/* Kombo metni ekran okuyucuya da gider (F2-12); kayıttaki "Zincir ×N!" satırı zaten var. */}
      <div className="sr-only" aria-live="polite">
        {callout}
      </div>
      {state.result && (
        <ResultPanel
          state={state}
          log={log}
          seed={seed}
          profile={profile}
          durationSec={Math.round(((endedAt ?? startedAt) - startedAt) / 1000)}
          onRestart={restart}
          onNew={onNew}
        />
      )}
    </main>
  );
}
```

`apps/client/src/styles.css` — kw renk değişkenleri üç temada (mevcut `--kw-*` bloklarının içine ekle):

```css
:root {
  --kw-curse: #a3324f;
  --kw-poison: #3c7a2a;
  --kw-stealth: #2f7f7a;
  --kw-chain: #b03a8c;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --kw-curse: #f08aa6;
    --kw-poison: #8fd16f;
    --kw-stealth: #6fd0c8;
    --kw-chain: #e58bd0;
  }
}
:root[data-theme="dark"] {
  --kw-curse: #f08aa6;
  --kw-poison: #8fd16f;
  --kw-stealth: #6fd0c8;
  --kw-chain: #e58bd0;
}
.kw--curse {
  color: var(--kw-curse);
}
.kw--poison {
  color: var(--kw-poison);
}
.kw--stealth {
  color: var(--kw-stealth);
}
.kw--chain {
  color: var(--kw-chain);
}
```

Coşku bloğu (dosya sonuna):

```css
/* Coşku (F2-12): yalnız CSS. Süreler BattleScreen'den (fx.ts) CSS değişkeni olarak gelir. */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.card {
  position: relative;
}
.card__heavy {
  position: absolute;
  top: 4px;
  right: 6px;
  color: var(--accent);
  font-weight: 700;
}
.chain-count {
  align-self: center;
  margin-right: 12px;
  font-variant-numeric: tabular-nums;
}

/* Ekran sarsıntısı: çift/tek sınıf, ardışık aksiyonlarda animasyonu yeniden başlatır. */
.fx-shake-0 {
  animation: shake-a var(--shake-ms) ease-out;
}
.fx-shake-1 {
  animation: shake-b var(--shake-ms) ease-out;
}
@keyframes shake-a {
  0% { transform: translateX(0); }
  20% { transform: translateX(calc(var(--shake-px) * -1)); }
  40% { transform: translateX(var(--shake-px)); }
  60% { transform: translateX(calc(var(--shake-px) * -0.6)); }
  80% { transform: translateX(calc(var(--shake-px) * 0.3)); }
  100% { transform: translateX(0); }
}
@keyframes shake-b {
  0% { transform: translateX(0); }
  20% { transform: translateX(calc(var(--shake-px) * -1)); }
  40% { transform: translateX(var(--shake-px)); }
  60% { transform: translateX(calc(var(--shake-px) * -0.6)); }
  80% { transform: translateX(calc(var(--shake-px) * 0.3)); }
  100% { transform: translateX(0); }
}

/* Hitstop: HP çubuğu düşmeden önce kısa bir bekleme. */
.fx-hitstop .hero--hit0 .meter__fill,
.fx-hitstop .hero--hit1 .meter__fill {
  transition-delay: var(--hitstop-ms);
}
.meter__fill {
  transition: width 200ms ease-out;
}

/* Vuruş alan kahraman: renk flaşı. */
.hero {
  position: relative;
}
.hero--hit0 {
  animation: hit-a calc(var(--flash-ms) * 2) ease-out;
}
.hero--hit1 {
  animation: hit-b calc(var(--flash-ms) * 2) ease-out;
}
@keyframes hit-a {
  0% { background: color-mix(in srgb, var(--hp) 30%, var(--panel)); }
  100% { background: var(--panel); }
}
@keyframes hit-b {
  0% { background: color-mix(in srgb, var(--hp) 30%, var(--panel)); }
  100% { background: var(--panel); }
}

/* Hasar sayısı: 1 → 1,35 → 1 ölçek (200 ms), 24 px yukarı kayıp solar. */
.pops {
  position: absolute;
  top: 8px;
  right: 12px;
  pointer-events: none;
}
.pop {
  position: absolute;
  top: 0;
  right: calc(var(--i, 0) * 34px);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--hp);
  font-variant-numeric: tabular-nums;
  animation: pop var(--pop-ms) ease-out forwards;
  animation-delay: calc(var(--i, 0) * 60ms);
  opacity: 0;
}
@keyframes pop {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  20% { opacity: 1; transform: translateY(-5px) scale(1.35); }
  40% { opacity: 1; transform: translateY(-10px) scale(1); }
  100% { opacity: 0; transform: translateY(-24px) scale(1); }
}

/* Kombo çağrısı: girdiyi bloklamaz (pointer-events: none), toplam < 800 ms. */
.callout {
  position: fixed;
  top: 22%;
  left: 50%;
  z-index: 50;
  transform: translateX(-50%);
  font-size: clamp(1.6rem, 6vw, 2.8rem);
  font-weight: 900;
  letter-spacing: 0.04em;
  color: var(--accent);
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.35);
  pointer-events: none;
  animation: callout var(--callout-ms) ease-out forwards;
}
@keyframes callout {
  0% { opacity: 0; transform: translateX(-50%) scale(0.6); }
  15% { opacity: 1; transform: translateX(-50%) scale(1.15); }
  30% { opacity: 1; transform: translateX(-50%) scale(1); }
  80% { opacity: 1; transform: translateX(-50%) scale(1); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-12px) scale(1); }
}

/* Hareket azaltma: sarsıntı, kayma ve ölçek kapanır; yerine 120 ms renk flaşı kalır. */
@media (prefers-reduced-motion: reduce) {
  .fx-shake-0,
  .fx-shake-1 {
    animation: none;
  }
  .hero--hit0,
  .hero--hit1 {
    animation-duration: var(--flash-ms);
  }
  .meter__fill {
    transition: none;
  }
  .pop {
    animation-name: pop-fade;
  }
  .callout {
    animation-name: callout-fade;
  }
  @keyframes pop-fade {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes callout-fade {
    0%, 80% { opacity: 1; transform: translateX(-50%); }
    100% { opacity: 0; transform: translateX(-50%); }
  }
}
```

(Saniyede 3'ten fazla flaş olmaz: her aksiyon en çok bir hero flaşı üretir ve aksiyonlar arası en az 700 ms AI gecikmesi vardır; oyuncu aksiyonları bir tıklamadır.)

- [ ] **Adım 4: YEŞİL gör ve elle bak**

`corepack pnpm --filter @koidle/client test` → **PASS**. `corepack pnpm dev`: Asas ile Stab → Thrust → Spike oyna ("ZİNCİR ×2!", "ZİNCİR ×3!" çağrısı, sarsıntı, sayı pop'u, "Bu tur oynanan kart" sayacı); işletim sistemi "hareketi azalt" ayarını açıp sarsıntının kalktığını, flaşın kaldığını doğrula. Tarayıcıda karanlık ve açık temada yeni anahtar kelime renklerini kontrol et.

- [ ] **Adım 5: Kapı komutu ve commit**

```
git add apps
git commit -m "feat(client): CSS fx (shake, hitstop, pops, callouts), reduced-motion, new keywords, chain counter" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

---

## Görev 10 — Maç formu alanları

**Files**
- Modify: `apps/client/src/gate1.ts`, `components/Gate1Form.tsx`, `components/ResultPanel.tsx`, `components/BattleScreen.tsx`, `apps/client/gate1-plugin.ts`
- Create: `apps/client/src/gate1.test.ts`

**Interfaces**
- Consumes: `ArchetypeId`, `MatchSetup`.
- Produces: `Gate1Record` + `oyuncuJob`, `aiJob`, `deste`; `Gate1Answers` + `farkliHissettirdi`; kayıt hedefi: artifact db koleksiyonu `faz2`, yedek anahtarı `koidle.faz2`, dev uç noktası `/__faz2` → `docs/faz-2/oturumlar.jsonl`. Gate 1 kayıtları `gate1` koleksiyonunda ve `docs/gate-1/oturumlar.jsonl`'de **olduğu gibi kalır**.

- [ ] **Adım 1: Başarısız test yaz** — `apps/client/src/gate1.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FAZ2_BACKUP_KEY, readBackup } from './gate1';

afterEach(() => vi.unstubAllGlobals());

describe('match form backup', () => {
  it('uses the Faz 2 key, so Gate 1 records are never mixed in', () => {
    expect(FAZ2_BACKUP_KEY).toBe('koidle.faz2');
    const getItem = vi.fn(() => '[]');
    vi.stubGlobal('localStorage', { getItem });
    expect(readBackup()).toEqual([]);
    expect(getItem).toHaveBeenCalledWith('koidle.faz2');
  });

  it('is empty without localStorage', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(readBackup()).toEqual([]);
  });
});
```

- [ ] **Adım 2: Çalıştır, KIRMIZI gör** — `corepack pnpm --filter @koidle/client exec vitest run src/gate1.test.ts` → **FAIL** (`FAZ2_BACKUP_KEY` yok).

- [ ] **Adım 3: Gerçekleme**

`gate1.ts` değişiklikleri:

```ts
import type { AiProfile } from '@koidle/ai';
import type { ArchetypeId } from '@koidle/content-schema';
import type { BattleConfig, CardDef, EndReason } from '@koidle/rules';

export interface Gate1Answers {
  eglence: number; // 1–5
  kararVermekZorundaKaldim: number; // 1–5
  gerekendenUzun: boolean;
  iseYaramayanKartSinirlendirdi: boolean;
  /** Faz 2 sorusu: "Sonucu değiştiren bir kombomu/kararımı hatırlıyor muyum?" */
  sonucuDegistirenKarariHatirliyorum: boolean;
  /** Faz 2 sorusu: "Bu job farklı hissettirdi mi?" */
  farkliHissettirdi: boolean;
  not: string;
}

export interface Gate1Record {
  zaman: string;
  seed: number;
  aiProfili: AiProfile;
  oyuncuJob: ArchetypeId;
  aiJob: ArchetypeId;
  /** Oynanan destenin kart id'leri. */
  deste: string[];
  ilkOynayan: 'sen' | 'rakip';
  sonuc: 'kazandın' | 'kaybettin' | 'berabere';
  bitisNedeni: EndReason;
  raunt: number;
  sureSn: number;
  arenaGoruldu: boolean;
  yorgunlukGoruldu: boolean;
  configHash: string;
  cevaplar: Gate1Answers;
}
```
`contentHash` aynı kalır. Sabitler ve uç noktalar:

```ts
export const FAZ2_BACKUP_KEY = 'koidle.faz2';
```
`readBackup`/`saveRecord` içinde `BACKUP_KEY` yerine `FAZ2_BACKUP_KEY`; `db.collection('gate1')` → `db.collection('faz2')`; `fetch('/__gate1', ...)` → `fetch('/__faz2', ...)`; `a.download = 'faz-2-oturumlar.jsonl'`; yorum: `docs/faz-2/oturumlar.jsonl`.

`apps/client/gate1-plugin.ts`: `GATE1_LOG` → `FAZ2_LOG = join(import.meta.dirname, '..', '..', 'docs', 'faz-2', 'oturumlar.jsonl')`, `'/__gate1'` → `'/__faz2'`, `name: 'koidle-faz2'`, fonksiyon adı `gate1Plugin` aynı kalabilir (vite.config import'u değişmesin); üst yorum "Faz 2 maç formunu docs/faz-2/oturumlar.jsonl dosyasına ekler".

`components/Gate1Form.tsx`:

```tsx
const initial: Gate1Answers = {
  eglence: 0,
  kararVermekZorundaKaldim: 0,
  gerekendenUzun: false,
  iseYaramayanKartSinirlendirdi: false,
  sonucuDegistirenKarariHatirliyorum: false,
  farkliHissettirdi: false,
  not: '',
};
```
Başlık `<h3>Maç formu (Faz 2)</h3>`; beşinci soru etiketi `"5. Sonucu değiştiren bir kombomu/kararımı hatırlıyor muyum?"`; ondan sonra yeni soru, not numarası 7:

```tsx
      <YesNo
        label="6. Bu job farklı hissettirdi mi?"
        value={a.farkliHissettirdi}
        onChange={(v) => setA({ ...a, farkliHissettirdi: v })}
      />
      <label className="gate1__note">
        7. Tek cümle not
```

`components/ResultPanel.tsx`: `import type { ArchetypeId } from '@koidle/content-schema';`; `Props`'a `mine: ArchetypeId; ai: ArchetypeId; deck: string[];`; imza `({ state, log, seed, profile, mine, ai, deck, durationSec, onRestart, onNew }: Props)`; `saveRecord({...})` içine `aiProfili: profile,` satırından sonra:

```ts
      oyuncuJob: mine,
      aiJob: ai,
      deste: deck,
```
`components/BattleScreen.tsx`: `<ResultPanel ... profile={profile} mine={mine} ai={ai} deck={deck} .../>`.

- [ ] **Adım 4: YEŞİL gör** — `corepack pnpm --filter @koidle/client test` ve `typecheck` → **PASS**. `corepack pnpm dev` ile bir maç bitir; form 7 maddeyle açılmalı, kayıt `docs/faz-2/oturumlar.jsonl`'e düşmeli (`oyuncuJob`, `aiJob`, `deste`, `farkliHissettirdi` alanlarıyla). Bu dosyayı **commit etme** (Yasin'in oyun kaydı değil, deneme); `git checkout`/sil.

- [ ] **Adım 5: Kapı komutu ve commit**

```
git add apps
git commit -m "feat(client): Faz 2 match form fields (jobs, deck, felt-different), separate storage from Gate 1" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

---

## Görev 11 — Yayın + kapanış

**Files**
- Build: `apps/client/dist/koidle-savas.html` (commit edilmez)
- Modify: `docs/devam-notu.md`, `CLAUDE.md` (yalnız durum satırı)
- Create: vault ve kapanış çıktıları `docs/kapanis-protokolu.md`'ye göre

- [ ] **Adım 1: Tam doğrulama**

```
corepack pnpm -r test
corepack pnpm -r typecheck
corepack pnpm lint
corepack pnpm --filter @koidle/content-schema values
git status
```
Hepsi yeşil, `git status` temiz (değer tablosu zaten güncel olmalı). `corepack pnpm --filter @koidle/sim sim` son bir kez koşulur; `reports/sim/latest.*` Görev 7 çıktısıyla aynıysa fark çıkmaz (determinizm).

- [ ] **Adım 2: Artifact derle**

`corepack pnpm --filter @koidle/client artifact` → `apps/client/dist/koidle-savas.html`. Boyut 16 MB altında olmalı (`(Get-Item apps/client/dist/koidle-savas.html).Length`).

- [ ] **Adım 3: Yasin onayı (DURAK)**

Sayfa **yalnız Yasin onaylarsa** mevcut adrese yeniden yayınlanır: https://claude.ai/artifact/AtdFa2bS9SCTQgmCpCiBbT. Onay gelmeden Artifact aracını çağırma. Onaydan sonra: önce `action: "read"` ile mevcut sayfa okunur, sonra aynı `url` ile `file_path: apps/client/dist/koidle-savas.html` yayınlanır; `capabilities` alanı verilmez (mevcut `db` yetkisi korunur). Yayın sonrası telefonda bir maç aç: kurulum → deste → savaş çalışmalı; maç sonunda "Kaydedildi (...)" satırı `artifact kaydına yazıldı` demeli. `yalnız tarayıcıda` derse `faz2` koleksiyonu yazılamıyor demektir: Yasin'e bildir, eski adrese geri dönüş: Görev 10 öncesi commit'in derlemesi.

- [ ] **Adım 4: Devam notu ve kapanış**

`docs/devam-notu.md` güncellenir (başlık tarihi, MEVCUT DURUM: Faz 2a kod tamam; Tamamlanan listesine Faz 2a görevleri 1–11; sıradaki: Yasin'in yön kontrolü maçları, sonra Faz 2b planı; plan dosyası bağlantısı; sim temel ölçüm özeti; açık sorular). `CLAUDE.md` üst satırı "Faz 2a kodu var; sıradaki iş Yasin'in 4–6 maçlık yön kontrolü" olarak güncellenir. Sonra `docs/kapanis-protokolu.md` adımları: devam notu → vault → commit + push → kapanış raporu.

```
git add docs CLAUDE.md
git commit -m "docs: phase 2a done, handoff updated" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

- [ ] **Adım 5: DURUM RAPORU (Faz 2a bitti)** — şablonu doldur: tüm görevler, test/sim sayıları, sim süresi, yayın durumu, açık sorular.

- [ ] **Adım 6: Yasin'in yön kontrolü (kapı değil)**

Yasin Warrior ve Rogue (Asas ve Okçu) ile **4–6 maç** oynar. Sorular: kombo hissi var mı, deste kurma anlamlı mı, Zincir/Gizli/Zehir okunuyor mu, coşku yerinde mi. Sonuçlar maç formunda (`faz2`) ve devam notunda toplanır. Bu bir Gate değildir; sonuç Faz 2b planını (Mage/Priest) şekillendirir.

---

## Faz 2b'ye kalan

Bu planda **yapılmaz**; spec §2–4'te tanımlıdır:
- Statü: **Donma**. Kavram: **Ateş** (`consumeStatus` efekti, Donma'yı tüketir, "BUHARLAŞMA!" çağrısı).
- **Taşan iyileşme Kalkan olur** (yalnız Priest iyileşme kartları).
- **Maks HP azaltma** (Parasite) efekti, Kalkanı yok sayar.
- **Debuff sayımı** bonusu (Judgement): Zayıflık, Lanet, Zehir, Donma.
- **Mage (10) ve Priest (10) kartları**, hazır desteleri, `Job`'a `'mage' | 'priest'`, `ArchetypeId`'e iki yeni arketip (sim matrisi 5×5, client seçimi).
- `ARCHETYPES`/sim/client'ta üç→beş arketip genişletmesi; Gate 2 sim ölçütleri ve ilk oyuncu dengesinin yeniden ölçümü (F2-14).
- Gate 2 (spec §9).

## Bilinçli bırakılanlar

- `damageFromShieldGainedThisTurn` efekti ve `shieldGainedThisTurn` alanı motorda **kalıyor**, oysa Faz 2'deki hiçbir kart kullanmıyor (Kalkan Darbesi/Bash içerikten çıktı). Kaldırmak ayrı bir karardır (golden replay, `bash` fixture'ı ve testler etkilenir); bu plan dokunmaz.
- `redactForAi`'daki gizli kartın `job: 'warrior'` değeri olduğu gibi kalır (`CardDef.job` birliği genişledi, değer hâlâ geçerli).
- Gate 1 kayıtları (`gate1` koleksiyonu, `docs/gate-1/oturumlar.jsonl`) değiştirilmez; Faz 2 kayıtları ayrı yerde durur.

## Açık sorular (Yasin)

1. **Artifact yeniden yayını:** Faz 2a sürümü aynı adrese (https://claude.ai/artifact/AtdFa2bS9SCTQgmCpCiBbT) yeniden yayınlansın mı? (Eski Gate 1 sürümünün üzerine yazılır; Gate 1 kayıtları `gate1` koleksiyonunda durur.)
2. **Planlayıcı süre sınırı:** AI planı (derinlik 4, ışın 5) ile 900 maçlık sim için kabul edilen sınır 2 dk. Görev 6'da ölçülen süre bunu aşarsa seçenek `content/ai-planner.json`'da derinlik/ışın azaltmaktır. Bu sınır kabul edilebilir mi, yoksa (ör. 3–5 dk) gevşetilsin mi?
