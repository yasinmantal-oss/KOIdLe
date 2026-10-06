# Test Değerleri (P0.2)

> Doğru denge değil, **başlangıç değerleri**. Her değer playtest ve simülasyonla değişecek.
> **Savaş değerleri burada değil:** tek okunabilir kaynak `docs/savas-degerleri.md`.
> Aşağıdaki değerler Faz 1'de koda girmez. Her biri kendi fazında `content/` altına JSON olarak taşınır; o zaman bu bölüm de o fazın üretilen tablosuna bağlantıya dönüşür.
> Şanslar basis point cinsindendir (10000 = %100).

## 1. Level ve EXP (Faz 3 / Faz 5)

- Level 1–10.
- Sonraki level için gereken EXP = `100 × mevcut level` (1→2: 100 … 9→10: 900; toplam 4.500).
- EXP kaynakları: farm (slot tablosu), PvE galibiyeti 40 · elit 100 · boss 300, PvP galibiyeti 60.
- EXP anında kazanılır, risk dışıdır (spec §5).

## 2. Farm slotları (Faz 5)

| Slot | Level şartı | Kapasite | EXP / saat | Altın / saat | Item şansı / 10 dk | Risk |
|---|---|---|---|---|---|---|
| 1 | 1 | 8 | 120 | 40 | 800 | Düşük |
| 2 | 2 | 8 | 180 | 60 | 900 | Düşük |
| 3 | 4 | 6 | 260 | 90 | 1000 | Orta |
| 4 | 6 | 6 | 360 | 130 | 1100 | Orta |
| 5 | 8 | 4 | 480 | 180 | 1300 | Yüksek |
| 6 | 10 | 4 | 620 | 240 | 1500 | Yüksek |

- Kapasite aşımı: fazla oyuncu başına verim −%10, taban %50. (Açık soru 3)
- Party bonusu: aynı slottaki dost oyuncu başına +%5, en fazla +%15.
- Taşıma kapasitesi: 10 item **veya** slotun 8 saatlik altın geliri; hangisi önce dolarsa farm durur. (Açık soru 8)

## 3. Drop (Faz 5)

| Rarity | Normal düşman | Elit | Boss |
|---|---|---|---|
| Common | 7000 | 6300 | 6600 |
| Magic | 2200 | 2200 | 2200 |
| Rare | 700 | 1400 | 700 |
| Unique | 100 | 100 | 500 |

Elit: Rare ×2, boss: Unique ×5; fark Common'dan düşülür.

## 4. Upgrade (Faz 4)

Kaynak: `docs/research/04 §8.2` tablosunun +1..+8 kısmı; tek pity Örs Isısı.

| Hedef | Taban şans | Başarısızlıkta | Altın / deneme |
|---|---|---|---|
| +1 | 10000 | — | 20 |
| +2 | 10000 | — | 20 |
| +3 | 9500 | Seviye korunur | 20 |
| +4 | 8500 | Seviye korunur | 40 |
| +5 | 7500 | Seviye korunur | 40 |
| +6 | 6000 | −1 | 80 |
| +7 | 4500 | −1 | 140 |
| +8 | 3500 | −1 | 200 |

- **Örs Isısı:** her başarısızlıkta efektif şansa `taban × 5000 / 10000` eklenir, tavan 10000; başarıda sıfırlanır; item bazında tutulur.
- Örnek +8: 3500 → 5250 → 7000 → 8750 → 10000 (en geç 5. denemede başarı).
- Düşmenin başladığı seviye açık soru 5.

## 5. Baskın (Faz 6)

| Parametre | Değer | Açık soru |
|---|---|---|
| Savunan kaybederse | Taşınan altının %30'u + taşınan item'lardan 1 tanesi (seed'li seçim) | 4 |
| Saldıran kaybederse | Taşınan altının %20'si | 9 |
| Baskın kalkanı | 30 dk | 7 |
| Online savunana davet süresi | 30 sn | 10 |

Equipped item asla çalınmaz, EXP asla kaybedilmez (spec §6).
