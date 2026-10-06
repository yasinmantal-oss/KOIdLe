# Simülasyon Raporu (AI vs AI)

> `pnpm sim` ile üretilir. Simülasyon "eğlenceli mi?" kararı vermez; bariz matematik hatası ve anlamsız davranış arar. Otomatik kabul/red eşiği yoktur (C5).
> 900 maç: 3×3 profil eşleşmesi × 100 seed (1–100). Warrior vs Warrior, varsayılan deste.
> Config özeti: HP 30 · MP 1→6 · el 4/8 · Kalkan resetOnOwnTurnStart · karıştırma 1 · Arena 8. raunt · Yorgunluk 1+1

## Genel

| Ölçüt | Değer |
|---|---|
| Raunt ortalama / medyan / min / maks | 8.38 / 8 / 6 / 12 |
| İlk oyuncunun kazanma oranı | %40.2 |
| Berabere | %0.0 |
| Arena Çöküşü görülen maç | %70.1 |
| Yorgunluk görülen maç | %0.1 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.1 |
| Karıştırma görülen maç | %84.9 |
| Tur başına kullanılmayan MP (ortalama) | 0.32 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 643 | %71.4 |
| fatigue | 0 | %0.0 |
| arenaCollapse | 257 | %28.6 |
| roundCap | 0 | %0.0 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %46.0 | %35.5 |
| balanced | %54.0 | — | %41.0 |
| defensive | %64.5 | %59.0 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 0.27 |
| balanced | 0.31 |
| defensive | 0.39 |

## Kartlar

Oynanma oranı: oyuncu-maçlarının (maç × 2) kaçında en az bir kez oynandı. Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|
| Yarma (`yarma`) | 1 | %91.3 | 1.07 | %51.0 |  |
| Kalkan Kaldır (`kalkan-kaldir`) | 1 | %89.2 | 1.07 | %50.0 |  |
| Gözdağı (`gozdagi`) | 1 | %90.0 | 1.07 | %51.8 |  |
| Hazırlık (`hazirlik`) | 1 | %78.6 | 0.89 | %51.0 |  |
| Kalkan Darbesi (`kalkan-darbesi`) | 2 | %93.9 | 1.15 | %50.4 |  |
| Savaş Narası (`savas-narasi`) | 2 | %84.4 | 0.97 | %51.0 |  |
| Siper (`siper`) | 2 | %81.2 | 0.97 | %50.4 |  |
| İkinci Nefes (`ikinci-nefes`) | 2 | %87.1 | 1.04 | %52.6 |  |
| Ağır Darbe (`agir-darbe`) | 3 | %98.4 | 1.20 | %50.4 |  |
| Savaş Ritmi (`savas-ritmi`) | 3 | %86.0 | 0.94 | %50.7 |  |
| Yarıp Geç (`yarip-gec`) | 4 | %97.5 | 1.15 | %50.1 |  |
| Yıkım (`yikim`) | 6 | %97.1 | 1.12 | %51.5 |  |
