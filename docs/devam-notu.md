# KOIdLe — Devam Notu (oturum devri)

> Son güncelleme: 2026-10-06 akşam öncesi · Bir sonraki oturum buradan başlar.
> **Geçerli tasarım belgesi:** `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md` (v0.1 tarihçe olarak duruyor).
> **Geçerli uygulama planı:** `docs/superpowers/plans/2026-10-06-faz-0-1-savas-sandbox.md`. Araştırma raporlarıyla (01–05) çelişen her noktada spec geçerlidir.
> GitHub: https://github.com/yasinmantal-oss/KOIdLe

## Proje tek cümlede
KOIdLe, karakterini riskli farm slotlarına bıraktığın, item düşürüp yükselttiğin ve karşı ulusun oyuncularıyla kart tabanlı savaşlara girdiğin bir **idle PvPvE RPG**. Kartlar ürünün kendisi değil, savaş dili. MMORPG değil. Knight Online'dan esinlenir; onun isimleri kullanılmaz.

## Durum
- Sadeleştirme turu **tamamlandı** (Yasin ile, spec v0.1).
- Spec self-review edildi, Yasin'in kararlarıyla **v0.2** yazıldı: Faz 5'te hafif backend + bot oyuncular · saldıran da CZ'de olmalı, slot içi seçim + "Savaş Ara" · baskın kalkanı + saldıranın riski · tüm job kartları baştan açık · item desteye kart eklemez · taşıma kapasitesi · EXP risk dışı.
- **Yasin v0.2'yi onayladı (2026-10-06).**
- **Faz 0–1 planı rev. 2** (Yasin + Copilot kararları): K1 Kalkan tur başında sıfırlanır, K2 tek karıştırma + Yorgunluk, K3–K7 onaylı, tek config dosyası, AI gizli bilgi görmez, `tools/sim` raporu, Gate 1 maç formu. Claude'un küçük kararları N1–N7 onay bekliyor (plan §0.2).
- Copilot incelemesi: N1–N7 onaylı, ek kararlar C1–C8 plan §0.3'te. N8 (AI ağırlıkları `content/ai-profiles.json`) Claude ekledi, onay bekliyor.
- **Faz 1 kodu bitti (Görev 1–13).** `packages/rules` (saf motor, golden replay + property testleri), `content/` + `packages/content-schema` (Zod, üretilen değer tablosu), `packages/ai` (3 profil, gizli bilgi görmez), `tools/sim` (900 maç raporu), `apps/client` (React savaş ekranı + Gate 1 formu).
- Gate 1 için oyun claude.ai'de sayfa olarak da yayınlandı (bilgisayar gerekmez): https://claude.ai/artifact/AtdFa2bS9SCTQgmCpCiBbT · form kayıtları sayfanın `gate1` deposunda.
- **Sıradaki iş Yasin'de: GATE 1 testi** (`docs/gate-1.md`). Kayıt durumu (2026-10-06 akşam): **1 / en az 10 maç.** İlk maç: saldırgan AI, kaybetti, 6 raunt, eğlence 3, karar 5, işe yaramayan kart: evet, not: "Strateji kurma süreci yok." Sayfanın kayıt deposu çalışıyor.

## Kesinleşen kararlar (özet; ayrıntı spec'te)
| Konu | Karar |
|---|---|
| Sütunlar | Farm · Loot · Upgrade · Risk |
| Core loop | Karakter → CZ → slot → AFK farm → EXP/gold/item → equip/merchant → upgrade → daha güçlü slot → baskın/PvP → kart savaşı → ganimeti koru → kasaba |
| Dünya | 2 ulus (Ulus A / Ulus B, mekanik farkları yok), 4 job, kısa level süreci (level yeni slotları açar) |
| Statlar ve ekipman | HP + Power. Weapon + Armor + Accessory. Rarity: Common / Magic / Rare / Unique. ~15–20 item. Bazı item'lar kart davranışını değiştirir. |
| Upgrade | +0 → +8. Yanma yok, üst seviyelerde −1 düşme. Tek pity: Örs Isısı (item bazında). Maliyet altın. |
| CZ | Oyunun ana dünyası. 6 kapasiteli farm slotu, AFK farm, taşınan ganimet (Carried Loot). Kasabaya dönünce ganimet güvenceye alınır. |
| Baskın | Karşı ulusa saldırı. Savunan offline ise AI onun destesini oynar. Equipped item asla çalınmaz. |
| Savaş | Hero vs Hero, minion yok. Tek kaynak MP. 12 kartlık deste, başlangıç eli 4. Arena Çöküşü. Çıktı rastgeleliği yok. |
| PvP | CZ'de gear geçerli. Quick Duel normalize. Lig ve sezon yok. |
| PvE | Normal düşmanlar + elit + 1 boss |
| Ekonomi | Tek para: Altın. Merchant: listele, sat, ilan çevrimdışıyken de açık kalır. |
| Platform | Prototip PC/Web. Mobil, Steam ve IAP prototip sonrasına bırakıldı. |
| Görsel | Harman (`design/mockups/gorsel-yonler.html`) |
| Teknik | `packages/rules` saf ve deterministik: `apply(state, action) → {state, events}`. Seed'li PRNG, `Math.random` ve `Date.now` yasak. Tüm içerik `content/` altında JSON + Zod. Şanslar basis point cinsinden. |
| Kural | Prototip bitmeden spec'teki **ÇIKSIN** listesinden hiçbir sistem kodlanmaz, önerilmez, spec'e geri eklenmez. |

## Yeni oturum nasıl başlar (Claude için)
1. Bu dosyayı oku. Kod dalı: `claude/upbeat-pasteur-k7xt1j` (PR: https://github.com/yasinmantal-oss/KOIdLe/pull/1, `master`'a birleştirilmemiş olabilir; önce `git fetch` ile kontrol et, PR birleştiyse yeni işi güncel `master`'dan yeni dalda yap).
2. `pnpm install && pnpm test && pnpm typecheck && pnpm lint` ile ortamı doğrula.
3. Gate 1 kayıtları: Artifact verisini `ArtifactData` aracıyla oku (`action: list`, `collection: gate1`, `url: https://claude.ai/artifact/AtdFa2bS9SCTQgmCpCiBbT`). Yerelde oynandıysa kayıtlar `docs/gate-1/oturumlar.jsonl` içinde.
4. Oyun içeriği değişirse sayfayı güncelle: `pnpm --filter @koidle/client artifact` → `apps/client/dist/koidle-savas.html` dosyasını Artifact aracıyla `url` vererek aynı adrese yayınla (önce `action: read`).

## Sıradaki adımlar
1. Yasin: Gate 1 testi, en az 10 maç (her AI profiline ≥ 3), her maçtan sonra form. Sayfa linki yukarıda; yerelde `pnpm dev`.
2. Copilot: `reports/sim/latest.md` ve kod incelemesi; N8 onayı (AI ağırlıkları `content/ai-profiles.json`).
3. Yasin: PR'ı `master`'a birleştirmek (isteğe bağlı, işi engellemiyor).
4. Claude: kayıtları okuyup Gate 1 değerlendirmesi + DURUM RAPORU; kalırsa yalnız savaş düzeltilir (`docs/gate-1.md` §C). **Gate 1 geçilmeden Faz 2 yok.**

## Açık konular
- N8 onayı bekliyor.
- Sim gözlemleri (Gate 1'de yorumlanacak, değerlere dokunulmadı): Yorgunluk hiç görülmüyor (%0) · Yıkım %99 maçta oynanıyor · saldırgan AI zayıf (%40–41) · Arena maçların %19'unu bitiriyor.
- `design/mockups/ekranlar-v0.1.html` (Copilot üretti) repo'da yok; Harman/polish aşamasında Yasin iletecek.

## Çalışma düzeni
- **Claude:** tek uygulayıcı (kod, test, commit, push). **Copilot:** bağımsız inceleyici, repo'yu göremez, yalnız Yasin'in ilettiğini okur. **Yasin:** karar veren ve köprü.
- Copilot önerisi repo'daki gerçek durumla çelişirse Claude uygulamadan önce yazar ve Yasin'e sorar. Copilot önerisi emir değildir.
- Her önemli adımın sonunda **DURUM RAPORU** (şablon: plan §1). Önemli dosyalar ve ham test/sim çıktıları rapora eklenir.
- Kural değerleri tek yerde ve tablo halinde: `docs/savas-degerleri.md`.
- Vault (yalnız yerel makinede): `C:/Users/muham/.gemini/antigravity/scratch/100-Projeler/KOIdLe/KOIdLe_Proje_Karti.md`. Cloud oturumunda vault yok; kayıtlar bu dosyada tutulur, Yasin aşağıdaki özeti vault'a kopyalar.

## Dosyalar
- `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md`: geçerli spec (v0.1: tarihçe)
- `docs/superpowers/plans/2026-10-06-faz-0-1-savas-sandbox.md`: Faz 0–1 uygulama planı (rev. 2)
- `docs/savas-degerleri.md`: tek savaş değer tablosu (üretilir, `pnpm values`) · `docs/test-degerleri.md`: savaş dışı P0.2 değerleri
- `docs/gate-1.md`: Gate 1 protokolü · `reports/sim/latest.md`: simülasyon raporu (`pnpm sim`)
- `docs/research/01..05`: araştırma raporları (arka plan; spec ile çelişirse spec geçerli)
- `design/mockups/gorsel-yonler.html`: görsel yön mockup'ı (Harman seçildi)

## Vault'a kopyalanacak özet (2026-10-06)
```
### 2026-10-06 — Faz 0–1 tamam, Gate 1 bekliyor
- Spec v0.2 onaylandı. Faz 0–1 planı rev. 2 (K1–K7, N1–N8, C1–C8).
- Faz 1 kodu bitti: rules (saf motor), content (JSON + Zod), ai (3 profil, gizli bilgi görmez), tools/sim (900 maç), React savaş ekranı + Gate 1 formu. 81 test yeşil.
- Sim: ort. 7,7 raunt, ilk oyuncu %47,7, berabere %0, Arena %19 bitiriyor, Yorgunluk %0, Yıkım %99 oynanıyor.
- Oyun sayfası (telefondan oynanır): https://claude.ai/artifact/AtdFa2bS9SCTQgmCpCiBbT
- GitHub: dal claude/upbeat-pasteur-k7xt1j, PR #1 (master'a birleştirme Yasin'de).
- Sıradaki: Yasin Gate 1 testi (≥10 maç, her profile ≥3). Copilot: sim + kod incelemesi, N8 onayı.
- Yeni sohbette ilk mesaj: "KOIdLe'ya devam. docs/devam-notu.md ile başla."
```
