# KOIdLe — Devam Notu (oturum devri)

> Son güncelleme: 2026-10-05 · Bir sonraki oturum buradan başlar.
> **Geçerli tasarım belgesi:** `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.1.md`. Araştırma raporlarıyla (01–05) çelişen her noktada spec geçerlidir.
> GitHub: https://github.com/yasinmantal-oss/KOIdLe

## Proje tek cümlede
KOIdLe, karakterini riskli farm slotlarına bıraktığın, item düşürüp yükselttiğin ve karşı ulusun oyuncularıyla kart tabanlı savaşlara girdiğin bir **idle PvPvE RPG**. Kartlar ürünün kendisi değil, savaş dili. MMORPG değil. Knight Online'dan esinlenir; onun isimleri kullanılmaz.

## Durum
- Sadeleştirme turu **tamamlandı** (Yasin ile, spec v0.1).
- Spec self-review edildi. Açık sorular Yasin'e soruldu (aşağıda). **Onay gelince writing-plans skill'ine geçilecek.**
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
1. Self-review sorularına Yasin'in cevapları → spec v0.2 olarak güncelle.
2. writing-plans skill'i ile Faz 0–1 uygulama planı (P0.2 test değerleri tablosu, P1.1 monorepo, P1.2 rules, P1.3 Warrior, P1.4 AI, P1.5 savaş UI). İlk hedef **GATE 1**: Hero-vs-Hero savaşı tek başına eğlenceli mi?

## Çalışma düzeni
- Claude ana ajan. Mekanik işler yerel Qwen'e (qwen3:8b) ve Gemini'ye verilebilir. Yaratıcı isimlendirme ve kod devredilmez.
- Vault (yalnız yerel makinede): `C:/Users/muham/.gemini/antigravity/scratch/100-Projeler/KOIdLe/KOIdLe_Proje_Karti.md`. Cloud oturumunda vault yok, kayıtlar bu dosyada tutulur.

## Dosyalar
- `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.1.md`: geçerli spec
- `docs/research/01..05`: araştırma raporları (arka plan; spec ile çelişirse spec geçerli)
- `design/mockups/gorsel-yonler.html`: görsel yön mockup'ı (Harman seçildi)
