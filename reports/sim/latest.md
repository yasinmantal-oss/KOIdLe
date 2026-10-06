# Simülasyon Raporu (AI vs AI)

> `pnpm sim` ile üretilir. Simülasyon "eğlenceli mi?" kararı vermez; bariz matematik hatası ve anlamsız davranış arar. Otomatik kabul/red eşiği yoktur (C5).
> 900 maç: 3×3 profil eşleşmesi × 100 seed (1–100). Warrior vs Warrior, varsayılan deste.
> Config özeti: HP 30 · MP 1→8 · el 4/8 · Kalkan resetOnOwnTurnStart · karıştırma 1 · Arena 8. raunt · Yorgunluk 1+1

## Genel

| Ölçüt | Değer |
|---|---|
| Raunt ortalama / medyan / min / maks | 7.72 / 8 / 6 / 11 |
| İlk oyuncunun kazanma oranı | %47.7 |
| Berabere | %0.0 |
| Arena Çöküşü görülen maç | %59.2 |
| Yorgunluk görülen maç | %0.0 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.0 |
| Karıştırma görülen maç | %88.3 |
| Tur başına kullanılmayan MP (ortalama) | 0.34 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 727 | %80.8 |
| fatigue | 0 | %0.0 |
| arenaCollapse | 173 | %19.2 |
| roundCap | 0 | %0.0 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %40.0 | %41.0 |
| balanced | %60.0 | — | %53.0 |
| defensive | %59.0 | %47.0 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 0.29 |
| balanced | 0.31 |
| defensive | 0.40 |

## Kartlar

Oynanma oranı: oyuncu-maçlarının (maç × 2) kaçında en az bir kez oynandı. Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|
| Yarma (`yarma`) | 1 | %92.5 | 1.04 | %51.1 |  |
| Kalkan Kaldır (`kalkan-kaldir`) | 1 | %87.2 | 0.99 | %49.2 |  |
| Gözdağı (`gozdagi`) | 1 | %89.2 | 1.03 | %50.4 |  |
| Hazırlık (`hazirlik`) | 1 | %79.7 | 0.86 | %50.1 |  |
| Kalkan Darbesi (`kalkan-darbesi`) | 2 | %55.0 | 0.57 | %54.9 |  |
| Savaş Narası (`savas-narasi`) | 2 | %83.9 | 0.92 | %48.4 |  |
| Siper (`siper`) | 2 | %84.3 | 0.96 | %51.2 |  |
| İkinci Nefes (`ikinci-nefes`) | 2 | %85.9 | 0.98 | %53.0 |  |
| Ağır Darbe (`agir-darbe`) | 3 | %97.3 | 1.11 | %50.9 |  |
| Savaş Ritmi (`savas-ritmi`) | 3 | %87.1 | 0.95 | %52.5 |  |
| Yarıp Geç (`yarip-gec`) | 4 | %96.6 | 1.11 | %50.7 |  |
| Yıkım (`yikim`) | 6 | %99.3 | 1.08 | %50.4 | HER MAÇ |
