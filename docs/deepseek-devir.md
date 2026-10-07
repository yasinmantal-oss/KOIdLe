# KOIdLe — DeepSeek Harness Devir Dokümanı

> Hazırlayan: Claude, 2026-10-07 gece. Yedek etiketi: `yedek/2026-10-07-claude-devir`.
> **Bu dosyayı baştan sona oku, sonra `docs/devam-notu.md`'yi oku.** İkisi birlikte sohbet geçmişi olmadan işe başlamaya yeter.

## 0. Sen kimsin, Yasin kim
- **Yasin:** projenin sahibi ve **tek karar verici**. Kod yazmaz; oynar, karar verir, onaylar.
- **Sen (DeepSeek Harness):** 2026-10-07'den itibaren uygulayıcısın (kod, test, sim, doküman, commit, push). Claude şimdilik projeden çekildi; Copilot da devre dışı.
- **Dil:** Yasin'le her zaman **Türkçe** konuş. Ton samimi ve net, "Yasin" diye hitap et. Kod yorumları ve dokümanlar Türkçe; commit mesajları İngilizce (conventional commits: `feat(rules): …`, `fix(client): …`, `docs: …`).
- **Çalışma şekli (Yasin'in isteği):** hızlı ilerle, ara onay için durma, uzun plan dokümanı yazma, sonucu getir. Yalnız **tasarım/oyun kararı** gerektiren yerde dur ve sor (aşağıdaki "Karar sınırı").

## 1. Proje tek paragrafta
KOIdLe, Knight Online'dan esinlenen, **Hearthstone tarzı kart savaşlı bir idle PvPvE RPG**. Oyuncu karakterini riskli farm slotlarına bırakır, item düşürür ve yükseltir, karşı ulusun oyuncularıyla **kart tabanlı Hero-vs-Hero savaşlara** girer. Kartlar ürünün kendisi değil, savaş dili. MMORPG değil. Sadelik önceliklidir; Knight Online'daki her sistem buraya taşınmaz.

## 2. Mutlak kurallar (ihlal etme)
1. **Knight Online'a ait isimler kullanılmaz:** uluslar, şehirler, item'lar, bosslar, NPC'ler, para birimi. Liste: `docs/research/01-ko-topluluk-ve-bagimlilik.md` başı. Arayüzde "CZ" yerine "Sınır Bölgesi", uluslar "Ulus A / Ulus B". **İstisna:** KO skill isimleri serbest (ör. "Power Strike", "Evade"); kişi adı içeren skill adı hariç.
2. **`packages/rules` saftır ve deterministiktir:** DOM, Node API, `Math.random`, `Date.now` **yasak**; dış bağımlılığı yok. Rastgelelik yalnız seed'li PRNG'den (`packages/rules/src/rng.ts`). Arayüz `apply(state, action) → { state, events }`; girdi state asla değişmez.
3. **Kural değerleri yalnız `content/` JSON'larında** (Zod ile doğrulanır: `packages/content-schema`). Koda sayı gömme. Değer değişince `docs/savas-degerleri.md` yeniden üretilir (`pnpm values`).
4. **Kart kuralları:** mekanik, KO skill'inin etkisine karşılık gelir (`docs/research/06-ko-skilleri.md`); kart adı İngilizce, metin Türkçe, kart altında terim açıklaması. Çıktı rastgeleliği yok (kritik/ıskalama zarı yok). Stun, uyutma, MP kesme, taunt yok.
5. **Kapsam:** spec'teki **ÇIKSIN** listesindeki hiçbir sistem kodlanmaz, önerilmez (Sefer, dayanıklılık, crafting, premium para, klan, ulus savaşı, sezon/ranked, dünya boss'u, +9/+10, set bonusu, iksir, mobil/Steam…). **Gate geçmeden sonraki faz başlamaz:** Faz 3 kural/içerik işi (item, upgrade, CZ, farm, pazar) Gate 2 PASS olmadan yapılmaz. İstisna: `apps/client/src/world/` altındaki **tasarım vitrini** (yalnız UI + sahte veri).
6. **Karar sınırı:** oyun değeri, kart tasarımı, kapsam, denge hedefi değişikliği → Yasin'e sor. Teknik uygulama ayrıntısı → kendin karar ver, raporda yaz.
7. **Hiçbir karar yalnız sohbette kalmaz.** Yasin'in her kararı `docs/devam-notu.md`'ye yazılır; değişen kararlar **ÖNCE / SONRA / NEDEN** formatıyla.
8. `master`'a kendiliğinden merge etme; merge kararı Yasin'de.
9. Mockup'lar (`design/mockups/`) referanstır; spec ve `content/` ile çelişirse spec geçerli.

## 3. Source of truth sırası (çelişkide)
1. Onaylı spec ve açık Yasin kararları — `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md` + `docs/superpowers/specs/2026-10-06-faz-2-dort-job-design.md` (Revizyon 1–2 dahil)
2. Uygulama planları — `docs/superpowers/plans/`
3. `content/` ve config
4. Test, sim ve raporlar (`reports/`)
5. `docs/devam-notu.md`
6. Vault özeti
7. Eski sohbet mesajları

## 4. Repo haritası
```
apps/client/            React 19 + Vite istemci (savaş ekranı, deste kurma, tasarım vitrini, maç formu)
  src/components/       BattleScreen, Hand (kart seç/geri çek/Oyna, çoklu seçim), HeroPanel, DeckPanel…
  src/selection.ts      Kart seçim mantığı (saf, test edilir)
  src/world/            Tasarım vitrini sahte verisi (Kasaba, Sınır, Örs/Anvil, Tezgâh, Karakter) — kural değil
  gate1-plugin.ts       `pnpm dev` sırasında maç formunu docs/faz-2/oturumlar.jsonl'e yazar
  scripts/build-artifact.mjs  Tek dosya HTML üretir (dist/koidle-savas.html)
packages/rules/         Saf savaş motoru: engine.ts (apply/validateAction), turn.ts, effects.ts, status.ts, draw.ts, rng.ts
  test/replays/         Golden replay'ler (davranış değişirse bilinçli güncellenir)
packages/content-schema/ Zod şemaları + değer tablosu üretici (values-table.ts)
packages/ai/            AI: 3 profil (aggressive/balanced/defensive), tur planı (beam), gizli bilgiyi görmez
tools/sim/              AI-vs-AI simülasyon; rapor reports/sim/latest.md + latest.json
content/                battle-config.json, cards/{common,warrior,rogue}.json, decks/*.json, ai-profiles.json, ai-planner.json
docs/                   devam-notu (ANA HAFIZA), kapanis-protokolu, savas-degerleri, spec/plan, research, geri-bildirim
reports/                gate-1, faz-2a, sim raporları; gate-1/artifact-gate1-kayitlari.jsonl (claude.ai sayfasından yedek, 28 maç)
design/mockups/         Görsel referanslar (Harman yönü seçildi)
```
Monorepo: pnpm workspaces + Turborepo. Node ≥ 22, pnpm 10.28 (`packageManager` alanı).

## 5. Komutlar (bu makinede)
`pnpm` PATH'te yok; **`corepack pnpm`** kullan. Kökteki `pnpm test/typecheck/values/sim/dev` kısayolları içeride `pnpm`/`turbo` çağırdığı için bu makinede **çalışmaz**; aşağıdaki doğrudan biçimleri kullan (2026-10-07'de doğrulandı).
```
corepack pnpm install
corepack pnpm -r test                 # tüm paketlerin vitest'i (2026-10-07: 187 test, hepsi yeşil)
corepack pnpm -r typecheck
corepack pnpm exec biome check apps packages content tools   # kök `pnpm lint` git-ignore'lu .work/'e takılır
corepack pnpm exec biome format --write apps packages content tools
corepack pnpm --filter @koidle/sim sim                  # AI-vs-AI sim → reports/sim/latest.md
corepack pnpm --filter @koidle/content-schema values    # docs/savas-degerleri.md'yi content/'ten üretir
corepack pnpm --filter @koidle/client dev               # istemci: http://localhost:5173
```
Windows + Git: satır sonu uyarıları (LF/CRLF) zararsız; yalnız satır sonu farkı olan dosyaları commit'leme.

## 6. Mevcut durum (2026-10-07 gece)
- **Faz 0–1:** bitti. **Gate 1: PASS** (Yasin, 2026-10-06).
- **Faz 2a (Warrior + Rogue Asas/Okçu):** bitti. 32 kart (her havuz 15), deste 12. Düello revizesi yayında: Arena Çöküşü kapalı (`arenaCollapse.enabled: false`), amblemler, Destem paneli, efektler, sesler, kart seç → geri çek → **Oyna** akışı, **çoklu kart seçimi** (MP yettiği kadar, seçim sırasıyla oynanır).
- **Sim (Arena kapalı, 1170 maç):** ort. 7,3 raunt, beraberlik %0, job eşleşmeleri %41–59, **ilk oyuncu %61,3** (açık sorun; hedef %45–55).
- **Sıradaki gate:** **Gate 2** (Faz 2b sonu; ölçütler Faz 2 spec eki §9).
- **Bekleyen iki iş:** (B) Faz 2b — **sana verilen iş, aşağıda**; (A) eşya tasarımının sıfırdan ele alınması (Yasin: "OLDUKÇA ÖNEMLİ") — bu bir tasarım sohbeti, Yasin'le birlikte yapılır, kod yok.
- **PR:** https://github.com/yasinmantal-oss/KOIdLe/pull/1 açık, `master`'a birleşmedi. Çalışma dalı: `claude/upbeat-pasteur-k7xt1j`.

## 7. SANA VERİLEN İŞ: Faz 2b, Görev 1 — İkinci oyuncu telafisi = ekstra kart
**Neden:** Yasin'in kararı (2026-10-07): ikinci oyuncuya ilk turunda verilen +4 MP "oyuncu gözüyle garip"; ekstra kart anlaşılır. Ayrıca sim'de ilk oyuncu %61,3 kazanıyor, hedef %45–55.

**Şu anki kod:**
- `content/battle-config.json` → `mp.secondPlayerFirstTurnBonus: 4`, `hand.firstPlayerSkipsFirstDraw: false`.
- `packages/rules/src/turn.ts:17` → ikinci oyuncunun 1. turunda `maxMp += secondPlayerFirstTurnBonus`.
- `packages/rules/src/turn.ts:56-61` → tur başı çekiş.

**Yapılacak:**
1. Yeni config alanı: `hand.secondPlayerFirstTurnExtraDraw` (tam sayı; ikinci oyuncu **kendi 1. turunda** `drawPerTurn` üstüne bu kadar ek kart çeker). Zod şemasına (`packages/content-schema/src/schema.ts`), tipe (`packages/rules/src/types.ts`), değer tablosuna (`values-table.ts`), test fixture'ına (`test-fixtures.ts`, değer 0) ekle.
2. `mp.secondPlayerFirstTurnBonus` → **0** yap (alanı silme; eski davranış config ile seçilebilir kalsın, projedeki gelenek bu). `turn.ts`'te ek çekişi uygula; el limiti (`hand.limit`) ve deste bitince karıştırma/Yorgunluk kuralları `drawCard` üzerinden aynen geçerli.
3. Testler: `turn.test.ts`'e (a) ikinci oyuncu 1. turunda `drawPerTurn + extra` kart çeker, (b) 2. turunda normal çeker, (c) ilk oyuncu etkilenmez. Golden replay'ler fixture'da extra=0 olduğu için değişmemeli; değişirse nedenini yaz.
4. **Sim ile değer seç:** `extra` = 1 ve 2 ile, `firstPlayerSkipsFirstDraw` = false ve true kombinasyonlarıyla sim koş (4 kombinasyon). Hedef: **ilk oyuncu kazanma %45–55**, ort. raunt 6,5–8,5, job eşleşmeleri %40–60. Hedefe en yakın, **en sade** kombinasyonu `content/battle-config.json`'a yaz. Hiçbiri hedefe girmezse en iyisini yaz ve Yasin'e "kartla çözülmeli" notuyla raporla — kart değerlerine kendin dokunma.
5. `corepack pnpm --filter @koidle/content-schema values` ile `docs/savas-degerleri.md`'yi, `corepack pnpm --filter @koidle/sim sim` ile `reports/sim/latest.md`'yi güncelle.
6. İstemci: ikinci oyuncu ekstra kart aldığında ekranda kısa bir bilgi göster (ör. HeroPanel altında "İkinci oynayan: +1 kart"), `TURN_STARTED`/`CARD_DRAWN` olaylarından türet; motora UI mantığı koyma.
7. Doğrula: `corepack pnpm -r test`, `-r typecheck`, biome check — hepsi temiz.
8. `docs/devam-notu.md`: K3/ikinci oyuncu kararını **ÖNCE / SONRA / NEDEN** ile "DEĞİŞTİRİLEN KARARLAR"a yaz, sim sonuçlarını "TEST / SİMÜLASYON"a, SIRADAKİ ADIM'ı güncelle. Faz 2 spec ekindeki ilgili satıra (`2026-10-06-faz-2-dort-job-design.md` ~satır 334) kısa not düş.
9. Commit + push (`claude/upbeat-pasteur-k7xt1j` dalına ya da Yasin yeni dal isterse ona). Sonra aşağıdaki DURUM RAPORU'nu Yasin'e yaz.

**Kabul ölçütü:** testler yeşil; sim raporunda ilk oyuncu oranı ve seçilen config yazılı; Yasin `corepack pnpm --filter @koidle/client dev` ile oynadığında ikinci oyuncu olarak ilk turda ekstra kartı görüyor.

**Bu iş bitince sıradaki (Faz 2b Görev 2–3, Yasin onayıyla başla):** Mage + Priest kart havuzları (her biri 15; Revizyon 1 kuralları; Mage: Donma hazırlığı → ateş bitirici, Priest: iyileşme + Zayıflık), AI/sim desteği, 5×5 job matrisi sim'i (%40–60), sonra Yasin her job ile en az 2 maç → **Gate 2**. Kart listesini kodlamadan önce Yasin'e tablo olarak göster (ad, MP, etki, KO karşılığı); kart tasarımı Yasin'in kararıdır.

## 8. Maç kayıtları
- Yasin `corepack pnpm --filter @koidle/client dev` ile oynayıp maç formunu doldurunca kayıt `docs/faz-2/oturumlar.jsonl`'e eklenir. Denge/eğlence yorumunu bu dosyadan yap.
- Eski claude.ai sayfası kayıtları: Gate 1 → `reports/gate-1/artifact-gate1-kayitlari.jsonl` (28 maç, yedek). Faz 2a sayfa kayıtları (`faz2`) bu yedeğe alınamadı; özetleri zaten `reports/faz-2a/2026-10-07-yon-kontrolu.md`'de.
- claude.ai Artifact sayfaları (devam notunda linkleri var) Claude'a özeldir; sen yayınlayamazsın. Yasin'e oynanabilir sürüm gerekirse `corepack pnpm --filter @koidle/client artifact` ile `apps/client/dist/koidle-savas.html` üret; tek dosya HTML, tarayıcıda açılır.

## 9. DURUM RAPORU şablonu (her önemli adım sonunda)
```
DURUM RAPORU
- Ne yapıldı:
- Değişen dosyalar:
- Testler / typecheck / lint:
- Sim (varsa): ilk oyuncu %, ort. raunt, job eşleşmeleri
- Yasin'den beklenen karar (varsa):
- Sıradaki adım:
```

## 10. Oturum kapanışı
Her oturumu `docs/kapanis-protokolu.md`'ye göre kapat: devam notunu güncelle, vault'u güncelle (`C:/Users/muham/.gemini/antigravity/scratch/100-Projeler/KOIdLe/KOIdLe_Proje_Karti.md` — önce oku, tarihçeyi koru), commit + push, working tree temiz mi kontrol et, sonra protokoldeki **KAPANIŞ RAPORU** şablonunu doldur. Protokoldeki "Claude" ifadelerini kendin için oku.

## 11. Önce okunacaklar (sırayla)
1. Bu dosya
2. `docs/devam-notu.md`
3. `docs/superpowers/specs/2026-10-06-faz-2-dort-job-design.md` (özellikle Revizyon 1–2 ve §9 Gate 2 ölçütleri)
4. `docs/savas-degerleri.md`
5. `packages/rules/src/turn.ts`, `engine.ts`, `types.ts`, `content/battle-config.json`
6. Gerekirse: spec v0.2, `docs/research/06-ko-skilleri.md`, `docs/kapanis-protokolu.md`
