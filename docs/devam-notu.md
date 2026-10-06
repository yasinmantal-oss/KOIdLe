# KOIdLe — Devam Notu (oturum devri)

> Son güncelleme: 2026-10-06 (öğleden sonra oturumu) · Bir sonraki oturum buradan başlar.
> **Geçerli tasarım belgesi:** `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md` (v0.1 tarihçe olarak duruyor).
> **Geçerli uygulama planı:** `docs/superpowers/plans/2026-10-06-faz-0-1-savas-sandbox.md` (rev. 2). Araştırma raporlarıyla (01–05) ve mockup'larla çelişen her noktada spec geçerlidir.
> **Oturum kapanışı:** her oturum `docs/kapanis-protokolu.md`'ye göre kapanır.
> GitHub: https://github.com/yasinmantal-oss/KOIdLe · Kod dalı: `claude/upbeat-pasteur-k7xt1j` · PR: https://github.com/yasinmantal-oss/KOIdLe/pull/1

## Proje tek cümlede
KOIdLe, karakterini riskli farm slotlarına bıraktığın, item düşürüp yükselttiğin ve karşı ulusun oyuncularıyla kart tabanlı savaşlara girdiğin bir **idle PvPvE RPG**. Kartlar ürünün kendisi değil, savaş dili. MMORPG değil. Knight Online'dan esinlenir; onun isimleri kullanılmaz.

## MEVCUT DURUM
- **Faz:** Faz 0–1 (savaş sandbox'ı) kodu tamam. **Faz 2 başlamadı** ve Gate 1 PASS olmadan başlamış sayılmaz.
- **Gate:** Gate 1, "Savaş tek başına eğlenceli mi?" (`docs/gate-1.md`). Durum: **PENDING**. Test **tamamlandı**: 11 maç (aggressive 5 · balanced 3 · defensive 3). Final analiz: `reports/gate-1/2026-10-06-gate-1-final-raporu.md`. Claude'un **önerisi FAIL / ITERATE**; nihai karar Yasin + Copilot + Claude incelemesinde. Tasarım kararı yok, değer değişmedi.
- **Tamamlanan:**
  - Spec v0.2, Yasin onayıyla (2026-10-06).
  - Faz 0–1 planı rev. 2 (K1–K7, N1–N7, C1–C8).
  - Faz 1 kodu (Görev 1–13):
    - `packages/rules`: saf, deterministik motor; golden replay ve property testleri.
    - `content/` + `packages/content-schema`: JSON + Zod, üretilen değer tablosu.
    - `packages/ai`: 3 profil, gizli bilgiyi görmez.
    - `tools/sim`: 900 maçlık rapor.
    - `apps/client`: React savaş ekranı + Gate 1 formu.
  - Gate 1 sayfası claude.ai'de yayında, telefondan oynanabiliyor: https://claude.ai/artifact/AtdFa2bS9SCTQgmCpCiBbT. Form kayıtları sayfanın `gate1` deposuna düşüyor.
  - `design/mockups/ekranlar-v0.1.html` repo'ya eklendi (2026-10-06). Copilot'un 8 prototip ekranı, tasarım referansı; aşağıdaki "Mockup çelişkileri"ne bak.
- **Tamamlanmayan:** Gate 1 nihai kararı (üçlü inceleme), Copilot'un sim/kod incelemesi, Gate 1 değerlendirmesi ve DURUM RAPORU.

## KİLİTLİ KARARLAR (özet; ayrıntı spec ve planda)
| Konu | Karar |
|---|---|
| Sütunlar | Farm · Loot · Upgrade · Risk |
| Core loop | Karakter → CZ → slot → AFK farm → EXP/gold/item → equip/merchant → upgrade → daha güçlü slot → baskın/PvP → kart savaşı → ganimeti koru → kasaba |
| Dünya | 2 ulus (Ulus A / Ulus B, mekanik farkları yok), 4 job, kısa level süreci (level yeni slotları açar) |
| Statlar ve ekipman | HP + Power. Weapon + Armor + Accessory. Rarity: Common / Magic / Rare / Unique. ~15–20 item. Bazı item'lar kart davranışını değiştirir; item desteye kart eklemez. |
| Upgrade | +0 → +8. Yanma yok, üst seviyelerde −1 düşme. Tek pity: Örs Isısı (item bazında). **Maliyet yalnız altın.** |
| CZ | Oyunun ana dünyası. **6 kapasiteli** farm slotu, AFK farm, taşınan ganimet (Carried Loot, tavanlı). Kasabaya dönünce ganimet güvenceye alınır. EXP risk dışı. |
| Baskın | Karşı ulusa saldırı; saldıran da CZ'de olmalı. Savunan offline ise AI onun destesini oynar. Equipped item asla çalınmaz. Baskın kalkanı + saldıranın riski. |
| Savaş | Hero vs Hero, minion yok. Tek kaynak MP. 12 kartlık deste, başlangıç eli 4. Arena Çöküşü. **Çıktı rastgeleliği yok** (kritik/ıskalama yok). Tüm job kartları baştan açık. |
| Kalkan (K1) | Kullanılmayan Kalkan sahibinin bir sonraki tur başında sıfırlanır. Neden: savunma sınırsız stok değil, zamanlama kararı olsun. |
| Deste bitince (K2) | Savaş başına 1 karıştırma, sonra artan Yorgunluk hasarı. Neden: sonsuz uzayan maçları kesmek. |
| PvP | CZ'de gear geçerli. Quick Duel normalize (item kart-efektleri taşınır). Lig ve sezon yok. |
| PvE | Normal düşmanlar + elit + 1 boss |
| Ekonomi | Tek para: Altın. Merchant: listele, sat; ilan çevrimdışıyken de açık kalır. Vergi/bant gelişmiş pazarla birlikte sonraya. |
| Platform | Prototip PC/Web. Mobil, Steam ve IAP prototip sonrasına bırakıldı. |
| Görsel | Harman (`design/mockups/gorsel-yonler.html`) |
| Teknik | `packages/rules` saf ve deterministik: `apply(state, action) → {state, events}`. Seed'li PRNG, `Math.random` ve `Date.now` yasak. Tüm içerik `content/` altında JSON + Zod. Şanslar basis point cinsinden. Faz 5'te hafif backend + bot oyuncular. |
| Kural | Prototip bitmeden spec'teki **ÇIKSIN** listesinden hiçbir sistem kodlanmaz, önerilmez, spec'e geri eklenmez. |

## BUGÜN ALINAN KARARLAR (2026-10-06)
- Spec v0.2 Yasin tarafından onaylandı. Faz 0–1 planı rev. 2 (K1–K7 Yasin, N1–N7 Claude + Copilot + Yasin onayı, C1–C8 Copilot).
- **Oturum kapanış/senkronizasyon protokolü** benimsendi (`docs/kapanis-protokolu.md`). Neden: GitHub, repo dokümanı ve vault birbirinden kopmasın; hiçbir karar yalnız sohbet geçmişinde kalmasın.
- `ekranlar-v0.1.html` repo'ya **referans olarak** alındı, içeriği değiştirilmedi. Spec ile çeliştiği yerlerde spec geçerli.
- **N8 ONAYLANDI (Yasin):** AI tuning ağırlıkları `content/ai-profiles.json` içinde tutulur (Zod ile doğrulanır). Neden: AI'ı da kod yazmadan ayarlamak; değerler tek yerde.
- **Upgrade maliyeti (Yasin teyidi):** Prototipte upgrade maliyeti **yalnız Gold**. Mockup'taki upgrade parşömeni güncel kural değildir. Neden: tek para, sade ekonomi.
- **Rakip intent (Yasin):** PvP/CZ'de rakibin eli ve sıradaki kartı **gizlidir**; mockup'taki PvP intent göstergesi güncel karar değildir. Intent sistemi ileride yalnız PvE/Boss karşılaşmalarında kullanılabilir. Neden: PvP'de gizli bilgi kararın parçası; AI da gizli bilgiyi görmüyor.

## DEĞİŞTİRİLEN KARARLAR
- **Kalkan (K1, plan rev. 1 → rev. 2):** ÖNCE: kalıcı, Hearthstone zırhı gibi birikir. SONRA: sahibinin sonraki tur başında sıfırlanır. NEDEN: savunma sınırsız stok değil, zamanlama kararı olsun. Eski davranış config ile hâlâ seçilebilir (`shield.persistence`).
- **Deste bitince (K2, rev. 1 → rev. 2):** ÖNCE: ıskarta her bitişte karıştırılıp yeni deste olur, Yorgunluk yok, bitirici yalnız Arena Çöküşü. SONRA: savaş başına 1 karıştırma, sonra artan Yorgunluk hasarı (1, 2, 3…). NEDEN: deste bitince ikinci bir bitirici olsun. Not: sim'de Yorgunluk %0 görülüyor, Gate 1'de yorumlanacak.
- (Spec v0.1 → v0.2 farkları spec başlığında listeli.)

## TEST / SİMÜLASYON
- Testler: son doğrulanmış durum 81 test yeşil (Faz 1 kapanışı, 2026-10-06). Bu oturumda kod değişmedi, testler yeniden çalıştırılmadı.
- Sim (`reports/sim/latest.md`, 900 maç):
  - raunt ort. 7,72 (medyan 8, 6–11)
  - ilk oyuncu %47,7 · berabere %0
  - Arena Çöküşü maçların %59'unda görülüyor, %19'unu bitiriyor · Yorgunluk %0
  - Yıkım maçların %99,3'ünde oynanıyor · saldırgan AI %40–41 kazanıyor
- Gate 1 kaydı #1 (2026-10-06):
  - saldırgan AI, kaybettin, 6 raunt, 61 sn
  - eğlence 3, karar 5
  - işe yaramayan kart sınırlandırdı: evet
  - not: "Strateji kurma süreci yok."
- **Henüz sonuç çıkarılmamalı:** Tek maç ve AI-vs-AI sim, denge ya da eğlence kararı için yeterli değil. Değerlere Gate 1 değerlendirmesinden önce dokunulmaz.

## AÇIK KONULAR
- Sim gözlemleri Gate 1'de yorumlanacak: Yorgunluk hiç görülmüyor, Yıkım baskın, saldırgan AI zayıf, Arena %19 bitiriyor.
- Gate 1 bulguları (rapor §8, henüz karar değil):
  - P0: maç içi plan / kombo yok. Yasin teyit etti: kastı maç içi plan.
  - P1: MP fazlası, kartlar çabuk bitiyor.
  - P1: savunma kartı fazlası.
  - P1: kural okunurluğu.
  - P2: Yorgunluk ölü kural.
  - Önerilen ilk iterasyon: `mp.max` 8 → 6 (yalnız JSON). Onay yok, uygulanmadı.
- PR #1'in açık/kapalı durumu bu makineden doğrulanamadı (`gh` kurulu değil). Git'e göre dal `master`'a birleşmedi.
- **Mockup çelişkileri** (`design/mockups/ekranlar-v0.1.html`, spec v0.1'e göre çizildi; spec v0.2 ve `content/` geçerli, mockup polish aşamasında düzeltilecek):
  1. **Örs maliyeti — ÇÖZÜLDÜ:** Mockup "Kutsanmış Parşömen" + altın gösteriyor. Geçerli kural: prototipte upgrade maliyeti yalnız Gold (Yasin teyidi, 2026-10-06). Ayrıca bu isim KO'nun yasaklı "Blessed Upgrade Scroll" isminin çevirisi; kullanılmaz.
  2. **Slot kapasitesi:** Mockup 3/4, 4–5 nokta gösteriyor. Spec'te 6.
  3. **Kart değerleri:** Mockup'taki Yarma (3 MP, 6 hasar), Cehennem Darbe (5 MP) gibi değerler yer tutucu. Geçerli olan `docs/savas-degerleri.md` (ör. Yarma 1 MP, 3 hasar).
  4. **"Iskalamaz" metni:** Spec'te çıktı rastgeleliği yok, bu metin anlamsız.
  5. **Rakip "niyet" göstergesi — ÇÖZÜLDÜ:** Mockup'ta rakibin sıradaki kartı görünüyor. Geçerli karar (Yasin, 2026-10-06): PvP/CZ'de rakibin eli ve sıradaki kartı gizli; intent ileride yalnız PvE/Boss için düşünülebilir.
  6. **Tezgâh vergisi:** "vergi düşüldü" yazıyor. Spec'te vergi, gelişmiş pazarla birlikte sonraya bırakıldı.
  7. **Push bildirimi:** Telefon kilit ekranı gösteriyor. Prototip PC/Web; mobil sonraya.

## SCOPE DIŞI (şimdilik yapılmayacak)
- Faz 2 ve sonrası (CZ, farm, item, upgrade, pazar): **Gate 1 PASS olmadan başlamaz.**
- Spec'in ÇIKSIN listesi: Sefer, dayanıklılık, crafting, premium para/Mühür, klan, ulus savaşı, sezon/ranked, Filiz, söylenti drop'u, dünya boss'u, +9/+10, set bonusu, iksir, mobil/Steam.
- Pixi, Harman görünümü, animasyon (K4: Gate 1 ekranı sade React).
- Mockup'taki ekranları (CZ, Örs, Tezgâh vb.) kodlamak.
- Gate 1 değerlendirmesinden önce oyun değeri değiştirmek.

## SIRADAKİ ADIM
**Tek görev (Yasin):** Yasin final raporu Copilot'a iletir; Yasin + Copilot + Claude Gate 1 kararını verir (PASS / CONDITIONAL / FAIL-ITERATE) ve varsa ilk iterasyonu seçer. **Karar gelmeden Claude değer veya kod değiştirmez.**
Kayıtlar tamamlanınca **Claude'un ilk işi:**
1. Kayıtları okur (`ArtifactData`, `action: list`, `collection: gate1`, url yukarıda).
2. Gate 1 değerlendirmesini ve DURUM RAPORU'nu yazar.
3. Gate kalırsa yalnız savaşı düzeltir (`docs/gate-1.md` §C).

Paralel ve engellemeyen işler: Copilot incelemesi; PR #1'i `master`'a birleştirme kararı (Yasin).

## Yeni oturum nasıl başlar (Claude için)
1. Bu dosyayı ve `CLAUDE.md`'yi oku.
2. Dalı doğrula: `git fetch`, sonra `claude/upbeat-pasteur-k7xt1j`. PR birleştiyse yeni işi güncel `master`'dan yeni dalda yap.
3. Ortamı doğrula: `pnpm install && pnpm test && pnpm typecheck && pnpm lint`.
4. Gate 1 kayıtlarını oku: `ArtifactData` (`action: list`, `collection: gate1`, `url: https://claude.ai/artifact/AtdFa2bS9SCTQgmCpCiBbT`). Yerelde oynandıysa kayıtlar `docs/gate-1/oturumlar.jsonl` içinde.
5. Oyun içeriği değişirse sayfayı güncelle:
   - `pnpm --filter @koidle/client artifact` çalıştır.
   - `apps/client/dist/koidle-savas.html` dosyasını Artifact aracıyla aynı `url`'ye yayınla (önce `action: read`).
6. Oturum sonunda `docs/kapanis-protokolu.md`'yi uygula.

## Çalışma düzeni
- **Claude:** tek uygulayıcı (kod, test, commit, push).
- **Copilot:** bağımsız inceleyici; repo'yu göremez, yalnız Yasin'in ilettiğini okur.
- **Yasin:** karar veren ve köprü.
- Copilot önerisi repo'daki gerçek durumla çelişirse Claude uygulamadan önce yazar ve Yasin'e sorar. Copilot önerisi emir değildir.
- Her önemli adımın sonunda **DURUM RAPORU** (şablon: plan §1).
- Kural değerleri tek yerde ve tablo halinde: `docs/savas-degerleri.md`.
- **Vault:** `C:/Users/muham/.gemini/antigravity/scratch/100-Projeler/KOIdLe/KOIdLe_Proje_Karti.md`.
  - Yerel oturum doğrudan günceller.
  - Cloud oturumu erişemez; kapanışta copy/paste bloğu verir, Yasin kopyalar.

## Dosyalar
- `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md`: geçerli spec (v0.1: tarihçe)
- `docs/superpowers/plans/2026-10-06-faz-0-1-savas-sandbox.md`: Faz 0–1 uygulama planı (rev. 2)
- `docs/savas-degerleri.md`: tek savaş değer tablosu (`pnpm values` ile üretilir)
- `docs/test-degerleri.md`: savaş dışı P0.2 değerleri
- `docs/gate-1.md`: Gate 1 protokolü
- `reports/sim/latest.md`: simülasyon raporu (`pnpm sim`)
- `reports/gate-1/2026-10-06-gate-1-final-raporu.md`: Gate 1 final analizi ve öneri (11 maç)
- `docs/kapanis-protokolu.md`: oturum kapanış/senkronizasyon protokolü
- `docs/research/01..05`: araştırma raporları (arka plan; spec ile çelişirse spec geçerli)
- `design/mockups/gorsel-yonler.html`: görsel yön mockup'ı (Harman seçildi)
- `design/mockups/ekranlar-v0.1.html`: 8 prototip ekranı (Copilot, spec v0.1'e göre; çelişkiler yukarıda)
