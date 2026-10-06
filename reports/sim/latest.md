# Simülasyon Raporu (AI vs AI)

> `pnpm sim` ile üretilir. Simülasyon "eğlenceli mi?" kararı vermez; bariz matematik hatası ve anlamsız davranış arar. Otomatik kabul/red eşiği yoktur (C5).
> 900 maç: 3×3 profil eşleşmesi × 100 seed (1–100). Warrior vs Warrior, varsayılan deste.
> Config özeti: HP 30 · MP 1→6 · el 4/8 · Kalkan resetOnOwnTurnStart · karıştırma 1 · Arena 8. raunt · Yorgunluk 1+1

## Genel

| Ölçüt | Değer |
|---|---|
| Raunt ortalama / medyan / min / maks | 8.28 / 8 / 6 / 12 |
| İlk oyuncunun kazanma oranı | %39.3 |
| Berabere | %0.0 |
| Arena Çöküşü görülen maç | %71.2 |
| Yorgunluk görülen maç | %0.3 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.3 |
| Karıştırma görülen maç | %86.9 |
| Tur başına kullanılmayan MP (ortalama) | 0.32 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 711 | %79.0 |
| fatigue | 0 | %0.0 |
| arenaCollapse | 189 | %21.0 |
| roundCap | 0 | %0.0 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %48.5 | %43.0 |
| balanced | %51.5 | — | %46.5 |
| defensive | %57.0 | %53.5 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 0.27 |
| balanced | 0.30 |
| defensive | 0.40 |

## Kartlar

Oynanma oranı: oyuncu-maçlarının (maç × 2) kaçında en az bir kez oynandı. Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|
| Yarma (`yarma`) | 1 | %93.8 | 1.09 | %50.4 |  |
| Kalkan Kaldır (`kalkan-kaldir`) | 1 | %89.7 | 1.08 | %50.0 |  |
| Gözdağı (`gozdagi`) | 1 | %93.1 | 1.11 | %49.8 |  |
| Hazırlık (`hazirlik`) | 1 | %82.9 | 0.93 | %49.0 |  |
| Kalkan Darbesi (`kalkan-darbesi`) | 2 | %57.1 | 0.60 | %51.8 |  |
| Savaş Narası (`savas-narasi`) | 2 | %88.2 | 1.02 | %51.8 |  |
| Siper (`siper`) | 2 | %86.2 | 1.04 | %50.3 |  |
| İkinci Nefes (`ikinci-nefes`) | 2 | %87.8 | 1.08 | %51.7 |  |
| Ağır Darbe (`agir-darbe`) | 3 | %98.3 | 1.19 | %50.6 |  |
| Savaş Ritmi (`savas-ritmi`) | 3 | %88.6 | 0.99 | %51.3 |  |
| Yarıp Geç (`yarip-gec`) | 4 | %98.1 | 1.19 | %50.0 |  |
| Yıkım (`yikim`) | 6 | %97.7 | 1.14 | %51.0 |  |
