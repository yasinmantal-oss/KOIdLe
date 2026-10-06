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
- **Faz 0–1 uygulama planı yazıldı** (12 görev, hedef GATE 1). Planın §0'ında Yasin onayı bekleyen 7 küçük karar var (K1–K7: Kalkan kalıcı mı, deste bitince ne olur, ilk oyuncu telafisi, Faz 1 UI'ı DOM, Warrior aynası, kahraman gücü yok, iki statü).
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
1. Yasin plan §0'daki K1–K7 kararlarını onaylasın ya da değiştirsin.
2. Planı Görev 1'den başlayarak uygula (Görev 1: `docs/test-degerleri.md`, Görev 2: monorepo iskeleti …).
3. Görev 12 sonunda GATE 1: Yasin `docs/gate-1.md` protokolüyle en az 10 maç oynar.

## Çalışma düzeni
- Claude ana ajan. Mekanik işler yerel Qwen'e (qwen3:8b) ve Gemini'ye verilebilir. Yaratıcı isimlendirme ve kod devredilmez.
- Vault (yalnız yerel makinede): `C:/Users/muham/.gemini/antigravity/scratch/100-Projeler/KOIdLe/KOIdLe_Proje_Karti.md`. Cloud oturumunda vault yok, kayıtlar bu dosyada tutulur.

## Dosyalar
- `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md`: geçerli spec (v0.1: tarihçe)
- `docs/superpowers/plans/2026-10-06-faz-0-1-savas-sandbox.md`: Faz 0–1 uygulama planı
- `docs/research/01..05`: araştırma raporları (arka plan; spec ile çelişirse spec geçerli)
- `design/mockups/gorsel-yonler.html`: görsel yön mockup'ı (Harman seçildi)
