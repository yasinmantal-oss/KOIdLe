# KOIdLe — Devam Notu (oturum devri)

> Son güncelleme: 2026-10-07 (Faz 2a uygulandı, kartlar iki kez revize edildi, yön kontrolü oynandı, sayfa sürüm 5 yayında) · Bir sonraki oturum buradan başlar.
> **Faz 2a planı:** `docs/superpowers/plans/2026-10-06-faz-2a-warrior-rogue.md` (Görev 1–11 uygulandı; kart içeriği planın değil spec "Revizyon 1–2"nin dediği gibidir).
> **Geçerli tasarım belgesi:** `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md` (v0.1 tarihçe olarak duruyor).
> **Faz 2 tasarımı (onaylı spec eki):** `docs/superpowers/specs/2026-10-06-faz-2-dort-job-design.md`.
> **Geçerli uygulama planı:** `docs/superpowers/plans/2026-10-06-faz-0-1-savas-sandbox.md` (rev. 2). Araştırma raporlarıyla (01–05) ve mockup'larla çelişen her noktada spec geçerlidir.
> **Oturum kapanışı:** her oturum `docs/kapanis-protokolu.md`'ye göre kapanır.
> GitHub: https://github.com/yasinmantal-oss/KOIdLe · Kod dalı: `claude/upbeat-pasteur-k7xt1j` · PR: https://github.com/yasinmantal-oss/KOIdLe/pull/1

## Proje tek cümlede
KOIdLe, karakterini riskli farm slotlarına bıraktığın, item düşürüp yükselttiğin ve karşı ulusun oyuncularıyla kart tabanlı savaşlara girdiğin bir **idle PvPvE RPG**. Kartlar ürünün kendisi değil, savaş dili. MMORPG değil. Knight Online'dan esinlenir; onun isimleri kullanılmaz.

## MEVCUT DURUM
- **Faz:** Faz 0–1 tamam. Gate 1 PASS (Yasin, 2026-10-06). **Faz 2a (Warrior + Rogue Asas/Okçu) uygulandı ve yön kontrolü oynandı (10 maç, eğlence medyanı 5).** Sırada Faz 2b (Mage + Priest) → Gate 2.
- **Faz 2a özeti (2026-10-06/07):**
  - Kod: plan Görev 1–10 (statüler, açılış eli, 3 arketip, deste kurma ekranı, AI tur planı (beam 4×5), sim job matrisi, CSS coşkusu, Faz 2 maç formu). Kayıtlar sayfanın `faz2` deposunda.
  - Kartlar iki kez revize edildi: **Revizyon 1** (Yasin reddetti: mekanik KO skill etkisine uymalı, adlar İngilizce) ve **Revizyon 2** (yön kontrolü düzeltmeleri). Ayrıntı spec ekinde.
  - Son durum: 32 kart, her havuz 15, deste 12. Sim: job eşleşmeleri %42–58, ort. 7,1 raunt, Arena bitişi %15,6, ilk oyuncu %58,6.
  - Sayfa sürüm 5 yayında (aynı link). Son commit `4335f4d` + kapanış docs.
- **Gate:** Gate 1, "Savaş tek başına eğlenceli mi?" (`docs/gate-1.md`). Durum: **PASS** (Yasin, 2026-10-06, doğrulama sonrası). Tarihçe: ilk karar FAIL / ITERATE (11 maç, `reports/gate-1/2026-10-06-gate-1-final-raporu.md`) → Combat v0.2 → Gate 1B CONDITIONAL PASS → doğrulama → PASS. Sıradaki gate: **Gate 2** (Faz 2b sonu, ölçütler spec eki §9).
- **Gate 1B:** test tamam (8 maç, config `9473c565`). Eğlence medyanı 5 (Gate 1: 3), karar hatırlama 3/8 (0/11), kazanma 4/8 (1/11).
  - Rapor: `reports/gate-1/2026-10-06-gate-1b-raporu.md`.
  - **Claude önerisi: CONDITIONAL PASS.** Koşullar: (1) Kalkan Darbesi düzeltmesi, 2 notta "işe yaramıyor"; (2) ilk oyuncu dengesi, sim'de %39,3.
  - **Yasin kararı: CONDITIONAL PASS** (önerilen tüm düzeltmeler kabul).
  - Kalkan Darbesi düzeltildi (`c85cac2`).
  - İlk oyuncu: K3 sim'de denendi, kapatınca %59; K3 kaldı, açık konu.
  - **Doğrulama maçları oynandı** (6 maç, config `9b663b36`). Rapor: `reports/gate-1/2026-10-06-dogrulama-raporu.md`.
    - Eğlence medyanı 5 (ort. 3,7; iki maç 1), kazanma 3/6, karar hatırlama 1/6.
    - Kalkan Darbesi artık "işe yaramıyor" denmiyor; bir notta "hem kalkan hem hasar saçma".
    - Yeni bulgular (deste/içerik): kötü açılış eli (2 not, ikisi eğlence 1, ikisi de defensive AI), kalkan kartı fazlası (2 not), güçlü kartlara kolay erişim / Yıkım güçlü (2 not).
    - **Claude önerisi: Gate 1 PASS**, bulgular Faz 2'ye zorunlu girdi.
    - **KARAR (Yasin, 2026-10-06): GATE 1 PASS.** Faz 2 açıldı.
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
- **Combat v0.2 uygulandı** (commit `bee48ef`), test + sim + sayfa güncel.
- **Yön kontrolü sonrası düzeltme paketi (Yasin onayı, 2026-10-07):** Sprint ve Light Feet kaldırıldı (`gainMp` efekti ve MP_GAINED olayı silindi), Evade eklendi, Okçu kısmen geri alındı, ikinci oyuncu MP bonusu, kart hasarları artırıldı. Ayrıntı: spec "Revizyon 2", rapor `reports/faz-2a/2026-10-07-yon-kontrolu.md`.
- **Kart yeniden tasarımı (Yasin, 2026-10-07):** ilk Faz 2a kartları reddedildi. Lanet/Gizli/Zincir kaldırıldı; Güç tek seferlik, Kritik ve Kaçınma eklendi, Zehir azalır; kartlar KO skill etkisine göre, adlar İngilizce, metin Türkçe + kart altı sözlük. Ayrıntı: spec eki "Revizyon 1". Sim yeniden üretildi (`reports/sim/latest.md`).
- **Tamamlanmayan:** ikinci oyuncu telafisinin ekstra karta çevrilmesi; Faz 2b; Gate 2.

## KİLİTLİ KARARLAR (özet; ayrıntı spec ve planda)
| Konu | Karar |
|---|---|
| Sütunlar | Farm · Loot · Upgrade · Risk |
| Core loop | Karakter → CZ → slot → AFK farm → EXP/gold/item → equip/merchant → upgrade → daha güçlü slot → baskın/PvP → kart savaşı → ganimeti koru → kasaba |
| Dünya | 2 ulus (Ulus A / Ulus B, mekanik farkları yok), 4 job, kısa level süreci (level yeni slotları açar) |
| Statlar ve ekipman | HP + Power. Weapon + Armor + Accessory. Rarity: Common / Magic / Rare / Unique. ~15–20 item. Bazı item'lar kart davranışını değiştirir; item desteye kart eklemez. |
| Savaş değerleri (v0.2) | MP tavanı **6**. Ağır Darbe: Güç varsa +3. Yarıp Geç: rakip Zayıfsa +3. Yıkım: rakip HP ≤ 15 ise 14, değilse 7. Tek kaynak `docs/savas-degerleri.md`. |
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

## BUGÜN ALINAN KARARLAR (2026-10-07)
- **Tasarım vitrini öne alındı (Yasin, 2026-10-07).** 8 mockup ekranı (CZ haritası, slot, aktif farm, baskın, savaş, Örs, Kasaba, Tezgâh) + Karakter, Harman görünümüyle `apps/client` içinde oynanabilir hale getirilir. Savaş gerçek motorla; CZ/farm/Örs/Tezgâh **sahte prototip verisiyle** (`apps/client/src/world/`), `packages/rules` ve `content/` değişmez. Mockup çelişkileri (parşömen, slot 6, vergi, niyet, Iskalamaz, telefon kilidi) spec lehine düzeltilir. Neden: "tasarımı görüp motive olmam ve buna göre devam etmem gerek". Bu, Faz 3 sistemlerinin kurallarının kodlanması değildir; Gate 2 şartı Faz 3 kural/içerik işi için geçerli kalır. **Uygulandı:** commit `0069923`, `16f6316`; yayın: https://claude.ai/artifact/K1g4KKYhjHVmpaeGAyjCAP (ayrı sayfa; maç formu kayıtları eski sayfada kalır). "CZ" adı yasaklı listede olduğu için arayüzde "Sınır Bölgesi".
- **Kart mekaniği KO skill etkisine karşılık gelir (Yasin).** Neden: ilk Faz 2a kartlarında Stealth kritik atıyor, Sprint kart çekiyordu; "skiller gerçek oyundaki gibi duruyor ama değil". Lanet/Gizli/Zincir kalktı (Revizyon 1).
- **Tüm kart adları İngilizce, metin Türkçe, kart altında terim açıklaması (Yasin).** Neden: karışık dil; "okuyan herkes her şeyi anlasın".
- **Hız kartları (Sprint, Light Feet) oyundan çıktı (Yasin).** Neden: kart çekme de ekstra MP de "hiçbir şeye oturmadı". Okçu'ya savunma kartı Evade geldi (Revizyon 2).
- **İkinci oyuncu telafisi ekstra kart olacak (Yasin).** Neden: +4 MP bonusu oyuncu gözüyle garip; ekstra kart anlaşılır. Faz 2b'nin ilk işi.
- **Çalışma şekli (Yasin):** ağır işler ajanlara; ara onaylar ve uzun planlar yok, "yapıştır bitir". Neden: token ve süre.

## ÖNCEKİ GÜN ALINAN KARARLAR (2026-10-06)
- **Faz 2 tasarımı ONAYLANDI (Yasin).** Ayrıntı ve gerekçeler spec ekinde (F2-1…F2-15). Özet:
  - **KO skill isimleri kullanılabilir (Yasin).** Ulus/şehir/item/boss/NPC/para yasağı sürer; kişi adı içeren skill adı yok. Kart adı İngilizce KO skill adı, metin Türkçe. Neden: skill hissi, KO'cu kartı tanısın.
  - Havuz 49 kart: 6 ortak + Warrior 10 + Rogue 17 (3 ortak + Asas 7 + Okçu 7) + Mage 10 + Priest 10. Deste 12, tek kopya, havuz 16. Neden: deste kurma olsun (Yasin), spec ~40–50 içinde kalsın.
  - **Rogue iki yol: Asas ya da Okçu, aynı destede ikisi olmaz (Yasin).**
  - Ağır (= "80 skill") etiketi: havuzda 3, destede en fazla 2. Destede ≥3 adet 1 MP kart. Açılış eline Ağır gelmez, en az bir 1 MP kart garanti. Neden: doğrulamadaki kötü açılış ve "güçlü kart kolay" bulguları.
  - 6 statü: Güç, Zayıflık, Lanet (yeni), Zehir (yeni), Donma (yeni), Gizli (yeni). Kombo dilleri: Zincir (Asas), Ateş+Donma (Mage), debuff sayımı (Priest), Berserker risk buff'ı (Warrior). Kart başına tek anahtar kelime.
  - Stun, uyutma, MP kesme, taunt yok. Neden: rakibin turunu boşa çıkarıyor.
  - AI tur planı (≤4 hamle, beam 5). Neden: açgözlü AI kombo kuramıyor, denge verisi çöp olur.
  - CSS coşkusu (hitstop, sarsıntı, "ZİNCİR ×2!"): K4'e dar istisna; Pixi/tam görsel Faz 9.
  - İki dilim: **Faz 2a** = altyapı + ortak + Warrior + Rogue (iki yol) + AI planı + deste kurma + coşku → Yasin 4–6 maç (yön kontrolü). **Faz 2b** = Mage + Priest → **Gate 2**.
  - Yasin "olur dersen yapalım" ile tasarım ayrıntılarında Claude'a yetki verdi; Claude araştırma ve motor fizibilitesi için ajan kullandı (`docs/research/06-ko-skilleri.md`).
- **GATE 1 PASS (Yasin, akşam).** Neden: savaşın yapısı tuttu (eğlence medyanı 1B'de 5, doğrulamada 5); kalan sorunlar 12 kartlık geçici desteye ait, Faz 2'de değişiyor. "Takıldık kaldık, ilerleyelim." Doğrulama raporu §6'daki 6 bulgu Faz 2'nin zorunlu girdisi.
- **Gate 1 = FAIL / ITERATE (Yasin).** Neden: eğlence medyanı 3 < 4; P0 maç içi plan/kombo yok. Çekirdek ölü değil (düşünerek oynanan son 4 maçta medyan 5).
- **Combat v0.2 onaylandı ve uygulandı (Yasin).** Neden: kart saklama ve kurulum kararı doğsun, yeni kavram eklenmesin. Ayrıntı: `docs/combat-v0.2-oneri.md`.
- **Copilot geçici olarak devre dışı (Yasin, 2026-10-06).** Neden: süreç kafa karıştırıyordu. Copilot'un son katkısı: Gate önerisi FAIL / ITERATE ve Combat v0.2 hedefi ("oyuncuya birkaç hamlelik küçük planlar kurdurmak"; `mp.max` 8 → 6 destekleniyor ama P0'ın tek çözümü değil). Bundan sonra karar yalnız Yasin'de.
- Spec v0.2 Yasin tarafından onaylandı. Faz 0–1 planı rev. 2 (K1–K7 Yasin, N1–N7 Claude + Copilot + Yasin onayı, C1–C8 Copilot).
- **Oturum kapanış/senkronizasyon protokolü** benimsendi (`docs/kapanis-protokolu.md`). Neden: GitHub, repo dokümanı ve vault birbirinden kopmasın; hiçbir karar yalnız sohbet geçmişinde kalmasın.
- `ekranlar-v0.1.html` repo'ya **referans olarak** alındı, içeriği değiştirilmedi. Spec ile çeliştiği yerlerde spec geçerli.
- **N8 ONAYLANDI (Yasin):** AI tuning ağırlıkları `content/ai-profiles.json` içinde tutulur (Zod ile doğrulanır). Neden: AI'ı da kod yazmadan ayarlamak; değerler tek yerde.
- **Upgrade maliyeti (Yasin teyidi):** Prototipte upgrade maliyeti **yalnız Gold**. Mockup'taki upgrade parşömeni güncel kural değildir. Neden: tek para, sade ekonomi.
- **Rakip intent (Yasin):** PvP/CZ'de rakibin eli ve sıradaki kartı **gizlidir**; mockup'taki PvP intent göstergesi güncel karar değildir. Intent sistemi ileride yalnız PvE/Boss karşılaşmalarında kullanılabilir. Neden: PvP'de gizli bilgi kararın parçası; AI da gizli bilgiyi görmüyor.

## DEĞİŞTİRİLEN KARARLAR
- **KO isimleri yasağı (kapsam netleşti).** ÖNCE: KO'ya ait isimler kullanılmaz (liste skill içermiyordu, kapsam belirsizdi). SONRA: skill isimleri serbest; ulus/şehir/item/boss/NPC/para yasağı aynen. NEDEN: skill hissi (Yasin).
- **Warrior kart havuzu (Faz 2).** ÖNCE: Faz 1'in 12 kartı (Yarma, Yıkım, Kalkan Darbesi…). SONRA: KO skill'li 10 kart + 6 ortak; Yıkım ve Kalkan Darbesi havuzdan çıkıyor, bitirici rolü kurulum isteyen Hell Blade'de. NEDEN: "Yıkım çok güçlü", "Kalkan Darbesi iki iş, saçma", "kalkan kalkan deck" bulguları.
- **K4 (sade React ekranı).** ÖNCE: animasyon yok. SONRA: Faz 2'de yalnız CSS coşkusu serbest. NEDEN: kombo görünmezse hissedilmez (Yasin: "ekran titresin").
- **Kalkan (K1, plan rev. 1 → rev. 2):** ÖNCE: kalıcı, Hearthstone zırhı gibi birikir. SONRA: sahibinin sonraki tur başında sıfırlanır. NEDEN: savunma sınırsız stok değil, zamanlama kararı olsun. Eski davranış config ile hâlâ seçilebilir (`shield.persistence`).
- **Deste bitince (K2, rev. 1 → rev. 2):** ÖNCE: ıskarta her bitişte karıştırılıp yeni deste olur, Yorgunluk yok, bitirici yalnız Arena Çöküşü. SONRA: savaş başına 1 karıştırma, sonra artan Yorgunluk hasarı (1, 2, 3…). NEDEN: deste bitince ikinci bir bitirici olsun. Not: sim'de Yorgunluk %0 görülüyor, Gate 1'de yorumlanacak.
- **MP tavanı (Combat v0.2).** ÖNCE: 8. SONRA: 6. NEDEN: toplam MP (36) deste maliyetini (28) aşıyordu, her kart oynanıyordu; kart saklamanın anlamı yoktu.
- **Ağır Darbe.** ÖNCE: 7 hasar. SONRA: 7 hasar, Güç varsa +3. NEDEN: Savaş Narası → Ağır Darbe kurulum hattı.
- **Yarıp Geç.** ÖNCE: kalkanı yok sayarak 6. SONRA: aynı, rakip Zayıfsa +3. NEDEN: Gözdağı'nı savunmada mı yoksa kombo için mi harcayacağın ikilemi.
- **Kalkan Darbesi (Gate 1B koşulu).** ÖNCE: "Bu tur kazandığın Kalkan kadar hasar ver" (tek başına 0). SONRA: "4 Kalkan kazan. Sonra bu tur kazandığın Kalkan kadar hasar ver." NEDEN: Yasin 2 notta "işe yaramıyor" dedi; artık tek başına da çalışıyor, Siper ile kombo sürüyor. Claude'un v0.2'deki "değiştirme" önerisi veriyle çürüdü.
- **K3 ilk oyuncu kuralı (Faz 2a yön kontrolü, 2026-10-07).** ÖNCE: ilk oyuncu ilk turunda çekmez (`hand.firstPlayerSkipsFirstDraw: true`), ikinci oyuncuya ek MP yok. SONRA: ikinci oyuncu kendi 1. turunda +4 MP alır (`mp.secondPlayerFirstTurnBonus: 4`, yalnız o tur) ve ilk oyuncu da ilk turunda çeker (`firstPlayerSkipsFirstDraw: false`). NEDEN: 10 maçta ilk oyuncu %32 kazandı; sim'de K3 açıkken yalnız MP bonusu işe yaramadı (bonus 1 → 5 arası ilk oyuncu %33–38, çünkü MP zaten tam kullanılmıyor, sınır kart sayısı). K3 kapatılınca ve bonus 4 ile ilk oyuncu %57–59 (300 seed %57,0; hedef 45–55, ulaşılamadı). Bonus 5'te kazanım yok (%57,5). Kalan fark kartla çözülmeli; açık konu.
- **Yıkım.** ÖNCE: 6 MP, 14 hasar (sim'de %99 "otomatik"). SONRA: rakip HP ≤ 15 ise 14, değilse 7. NEDEN: zamanlama kararı, bitirici rolü.
- **Çalışma düzeni.** ÖNCE: Claude uygular, Copilot inceler, Yasin karar verir. SONRA: Copilot geçici olarak devre dışı. NEDEN: süreç Yasin'in kafasını karıştırıyordu.
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
- **Combat v0.2 sim** (900 maç, `reports/sim/latest.md`):
  - raunt 8,28 (6–12)
  - ilk oyuncu kazanma **%39,3** (v0.1: %47,7)
  - Arena görülen %71, Arena ile bitiş %21 · Yorgunluk %0,3
  - kullanılmayan MP 0,32/tur (v0.1: 0,34)
  - profiller %43–57 arası
  - Yıkım hâlâ %97,7 oynanıyor: açgözlü AI 7 hasarı da oynuyor, bu beklenen bir AI sınırı
- **Gate 1B insan testi:**
  - eğlence medyanı 5
  - kazanma 4/8
  - karar hatırlama 3/8
  - Kalkan Darbesi 2 notta "işe yaramıyor"
  - "görsellik yok" (beklenen)
  - **Uyarı:** öğrenme etkisi ayrıştırılamıyor.
- **Henüz sonuç çıkarılmamalı:** Tek maç ve AI-vs-AI sim, denge ya da eğlence kararı için yeterli değil. Değerlere Gate 1 değerlendirmesinden önce dokunulmaz.

## AÇIK KONULAR
- Sim gözlemleri Gate 1'de yorumlanacak: Yorgunluk hiç görülmüyor, Yıkım baskın, saldırgan AI zayıf, Arena %19 bitiriyor.
- **Yasin'in endişesi (2026-10-06):** "Kartlar çok basit ve temel, skill gibi değil. Item'lı/item'sız karakter gücüne nasıl çevrileceği meçhul."
  - Spec'teki yol: job havuzu 12'den büyük olacak ve oyuncu destesini kurar; item'lar Power/HP verir ve bazı kartların davranışını değiştirir (spec §3).
  - v0.2'deki koşullu bonus yapısı, item'ın kart davranışını değiştirmesi için de kullanılabilir.
  - Ama kart kimliği (skill hissi) ve item/güç bağlantısı henüz tasarlanmadı. **Kart kimliği Faz 2 tasarımında çözüldü** (KO skill'li havuz). Item/güç bağlantısı Faz 3'te.
- **İlk oyuncu dengesi (açık):**
  - v0.2.1 sim'de ilk oyuncu %40,2 kazanıyor; K3 kapatılınca %59,1. Config ile çözülmüyor.
  - **Karar (Yasin, 2026-10-06): (a) bilinen sorun olarak Faz 2'ye taşındı.** Neden: dört job gelince denge baştan değişecek; şimdi ayarlamak boşa iş olur.
  - Faz 2 dengesinde ilk iş olarak yeniden ölçülecek. Telafi seçeneği (ikinci oyuncuya +1 MP) o zaman tekrar değerlendirilir.
- **v0.2.1 sim izleme:**
  - Arena ile bitiş %28,6 (v0.2: %21)
  - defensive AI aggressive'e karşı %64,5
  - Kalkan Darbesi'nden sonra savunma güçlendi; doğrulama maçlarında izlenecek.
- **AI sınırı:** AI açgözlü ve tek hamlelik; kombo kurmaz, Yıkım'ı erken harcayabilir. AI kodu değişikliği ayrı karar gerektirir.
- Gate 1 bulguları (rapor §8):
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
- Faz 3 ve sonrası (karakter, item, upgrade, CZ, farm, pazar): **Gate 2 PASS olmadan başlamaz.**
- Farklı job kartlarını tek destede karıştırmak, kahraman gücü (K6), kart kilidi, stun/uyutma/MP kesme/taunt (Faz 2 spec eki §10).
- Spec'in ÇIKSIN listesi: Sefer, dayanıklılık, crafting, premium para/Mühür, klan, ulus savaşı, sezon/ranked, Filiz, söylenti drop'u, dünya boss'u, +9/+10, set bonusu, iksir, mobil/Steam.
- Pixi, kart çizimleri, ses (K4). ~~Harman görünümü~~ ve ~~mockup ekranlarını kodlamak~~: 2026-10-07'de Yasin kararıyla tasarım vitrini olarak açıldı (yalnız UI + sahte veri).
- Gate 1 değerlendirmesinden önce oyun değeri değiştirmek.

## SIRADAKİ ADIM
**Faz 2b (Claude, yeni oturum), sırayla:**
1. **İkinci oyuncu telafisi = ekstra kart (Yasin, 2026-10-07).** `mp.secondPlayerFirstTurnBonus: 4` kaldırılır; ikinci oyuncu ilk turunda +1 kart çeker. Sim ile ilk oyuncu %45–55 hedeflenir (K3 kapalı kalır mı, sim karar verir).
2. **Mage + Priest** kartları, Revizyon 1 kurallarıyla: mekanik KO skill etkisine karşılık gelir (`docs/research/06-ko-skilleri.md`), ad İngilizce, metin Türkçe, kart altı sözlük. Mage: Donma hazırlığı → ateş bitirici. Priest: iyileşme + Zayıflık. Her havuz 15.
3. Sim (5×5 job matrisi, %40–60), sayfa yayını, Yasin her job ile en az 2 maç → **Gate 2** (ölçütler spec eki §9).
- **Çalışma şekli (Yasin):** hızlı ilerle; ağır işleri ajanlara ver; ara onay için durma, sonucu getir. Uzun plan dokümanı yazma.
- Açık soru (Yasin): "Kartları güce göre sınıflandırıp elde etmeyi zorlaştırmak" fikri, kilitli "tüm job kartları baştan açık" kararıyla çelişiyor. İstenirse spec değişikliği olarak ayrıca karar verilir.

Paralel ve engellemeyen işler: PR #1'i `master`'a birleştirme kararı (Yasin).

## Yeni oturum nasıl başlar (Claude için)
1. Bu dosyayı ve `CLAUDE.md`'yi oku.
2. Dalı doğrula: `git fetch`, sonra `claude/upbeat-pasteur-k7xt1j`. PR birleştiyse yeni işi güncel `master`'dan yeni dalda yap.
3. Ortamı doğrula. Bu makinede `pnpm` PATH'te yok: `corepack pnpm -r test`, `corepack pnpm -r typecheck`, `corepack pnpm exec biome check apps packages content tools` (kök `pnpm lint` git-ignore'lu `.work/`'e takılır).
4. Maç kayıtlarını oku: `ArtifactData` (`action: list`, `collection: faz2`; Gate 1 kayıtları `gate1`), `url: https://claude.ai/artifact/AtdFa2bS9SCTQgmCpCiBbT`. Yerelde oynandıysa `docs/faz-2/oturumlar.jsonl`.
5. Oyun içeriği değişirse sayfayı güncelle:
   - `pnpm --filter @koidle/client artifact` çalıştır.
   - `apps/client/dist/koidle-savas.html` dosyasını Artifact aracıyla aynı `url`'ye yayınla (önce `action: read`).
6. Oturum sonunda `docs/kapanis-protokolu.md`'yi uygula.

## Çalışma düzeni
- **Claude:** tek uygulayıcı (kod, test, commit, push).
- **Copilot:** geçici olarak devre dışı (2026-10-06). Geri dönerse: bağımsız inceleyici; repo'yu göremez, yalnız Yasin'in ilettiğini okur.
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
- `reports/gate-1/2026-10-06-gate-1b-raporu.md`: Gate 1B raporu (öneri CONDITIONAL PASS)
- `reports/gate-1/2026-10-06-dogrulama-raporu.md`: doğrulama maçları raporu (Gate 1 PASS)
- `docs/superpowers/specs/2026-10-06-faz-2-dort-job-design.md`: Faz 2 tasarımı (onaylı)
- `docs/research/06-ko-skilleri.md`: KO sınıf skilleri, argo ve kombo kalıpları
- `docs/combat-v0.2-oneri.md`: Combat v0.2 tasarımı (onaylandı, uygulandı; alternatifler v0.3 adayı)
- `docs/kapanis-protokolu.md`: oturum kapanış/senkronizasyon protokolü
- `docs/research/01..05`: araştırma raporları (arka plan; spec ile çelişirse spec geçerli)
- `design/mockups/gorsel-yonler.html`: görsel yön mockup'ı (Harman seçildi)
- `design/mockups/ekranlar-v0.1.html`: 8 prototip ekranı (Copilot, spec v0.1'e göre; çelişkiler yukarıda)
