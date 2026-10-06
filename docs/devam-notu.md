# KOIdLe — Devam Notu (oturum devri)

> Son güncelleme: 2026-10-06 · Bir sonraki oturum buradan başlar.
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
- **Görev 1 (P0.2) bitti:** `docs/savas-degerleri.md` (tek savaş değer tablosu), `docs/test-degerleri.md` (savaş dışı değerler).
- **Henüz kod yazılmadı.**

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

## Sıradaki adımlar
1. Copilot incelemesi: plan §0, `docs/savas-degerleri.md`. N1–N7 için Yasin onayı.
2. Görev 2: monorepo iskeleti. Sonra Görev 3–13 sırayla. Gate 1 geçilmeden Faz 2 yok.

## Çalışma düzeni
- **Claude:** tek uygulayıcı (kod, test, commit, push). **Copilot:** bağımsız inceleyici, repo'yu göremez, yalnız Yasin'in ilettiğini okur. **Yasin:** karar veren ve köprü.
- Copilot önerisi repo'daki gerçek durumla çelişirse Claude uygulamadan önce yazar ve Yasin'e sorar. Copilot önerisi emir değildir.
- Her önemli adımın sonunda **DURUM RAPORU** (şablon: plan §1). Önemli dosyalar ve ham test/sim çıktıları rapora eklenir.
- Kural değerleri tek yerde ve tablo halinde: `docs/savas-degerleri.md`.
- Vault (yalnız yerel makinede): `C:/Users/muham/.gemini/antigravity/scratch/100-Projeler/KOIdLe/KOIdLe_Proje_Karti.md`. Cloud oturumunda vault yok, kayıtlar bu dosyada tutulur.

## Dosyalar
- `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md`: geçerli spec (v0.1: tarihçe)
- `docs/superpowers/plans/2026-10-06-faz-0-1-savas-sandbox.md`: Faz 0–1 uygulama planı (rev. 2)
- `docs/savas-degerleri.md`: tek savaş değer tablosu · `docs/test-degerleri.md`: savaş dışı P0.2 değerleri
- `docs/research/01..05`: araştırma raporları (arka plan; spec ile çelişirse spec geçerli)
- `design/mockups/gorsel-yonler.html`: görsel yön mockup'ı (Harman seçildi)
