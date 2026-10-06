# Simülasyon Raporu (AI vs AI) — Faz 2a

> `pnpm sim` ile üretilir. Simülasyon "eğlenceli mi?" kararı vermez; bariz matematik hatası ve anlamsız davranış arar. Otomatik kabul/red eşiği yoktur (C5); ⚠ ve DÜŞÜK işaretleri Gate 2 ölçütlerini (spec §9) hatırlatır.
> **Faz 1 sim sonuçları artık karşılaştırılamaz:** yeni kartlar, açılış eli kuralı ve AI tur planı (F2-11) yeni bir temel ölçüm başlattı.
> Job geçişi: 900 maç = 3×3 job eşleşmesi × 100 seed (1–100), balanced vs balanced, hazır desteler. Genel, Açılış, Kombo, Bitiş nedeni ve Kartlar bölümleri yalnız bu geçişten.
> Profil geçişi: 270 maç = 3×3 profil eşleşmesi × 3 aynalı job × 10 seed (1–10).
> AI tur planı: derinlik 4, ışın 5.
> Config özeti: HP 30 · MP 1→6 · el 4/8 · Kalkan resetOnOwnTurnStart · karıştırma 1 · Arena 8. raunt · Yorgunluk 1+1

## Genel

| Ölçüt | Değer |
|---|---|
| Raunt ortalama / medyan / min / maks | 6.15 / 6 / 4 / 8 |
| İlk oyuncunun kazanma oranı | %41.9 |
| Berabere | %0.0 |
| Arena Çöküşü görülen maç | %8.4 |
| Yorgunluk görülen maç | %0.0 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.0 |
| Karıştırma görülen maç | %0.7 |
| Tur başına kullanılmayan MP (ortalama) | 0.61 |

## Açılış (ilk 2 turda oynanabilir kart yok)

Hedef ~0 (spec §9). Oran: oyuncu-maçların kaçında ilk 2 turda bir kez bile oynanabilir kart yoktu.

| Job | Ölü açılış oranı |
|---|---|
| Tümü | %0.0 |
| Warrior | %0.0 |
| Rogue · Asas | %0.0 |
| Rogue · Okçu | %0.0 |

## Job eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

Gate 2 aralığı %40–60; dışındakiler ⚠.

| | Warrior | Rogue · Asas | Rogue · Okçu |
|---|---|---|---|
| Warrior | — | %43.5 | %34.5 ⚠ |
| Rogue · Asas | %56.5 | — | %32.5 ⚠ |
| Rogue · Okçu | %65.5 ⚠ | %67.5 ⚠ | — |

## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)

| Job | Zincir | Gizli kullanımı | Zehir hasarı |
|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 1.39 | 1.68 | 0.00 |
| Rogue · Okçu | 0.00 | 0.00 | 8.11 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 876 | %97.3 |
| fatigue | 0 | %0.0 |
| arenaCollapse | 24 | %2.7 |
| roundCap | 0 | %0.0 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %41.7 | %48.3 |
| balanced | %58.3 | — | %51.7 |
| defensive | %51.7 | %48.3 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 0.73 |
| balanced | 0.70 |
| defensive | 0.69 |

## Kartlar (yalnız en az bir hazır destede olanlar)

Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %30 (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|---|
| Hızlı Vuruş (`hizli-vurus`) | 1 | 1200 | %72.7 | 0.73 | %43.8 |  |
| Sprint (`sprint`) | 1 | 600 | %0.5 | 0.01 | %100.0 | DÜŞÜK |
| Absoluteness (`absoluteness`) | 1 | 1200 | %68.7 | 0.69 | %49.2 |  |
| Gözdağı (`gozdagi`) | 1 | 1200 | %67.4 | 0.67 | %50.8 |  |
| Güçlü Vuruş (`guclu-vurus`) | 3 | 1200 | %78.8 | 0.79 | %55.6 |  |
| Slash (`slash`) | 1 | 600 | %82.5 | 0.83 | %44.2 |  |
| Gain (`gain`) | 1 | 600 | %74.8 | 0.75 | %44.8 |  |
| Leg Cutting (`leg-cutting`) | 2 | 600 | %72.8 | 0.73 | %44.6 |  |
| Berserker (`berserker`) | 2 | 600 | %64.7 | 0.65 | %41.8 |  |
| Iron Skin (`iron-skin`) | 2 | 600 | %64.0 | 0.64 | %44.3 |  |
| Cleave (`cleave`) | 3 | 600 | %85.0 | 0.85 | %46.3 |  |
| Howling Sword (`howling-sword`) | 4 | 600 | %63.3 | 0.63 | %53.4 |  |
| ★ Sword Dancing (`sword-dancing`) | 4 | 600 | %61.0 | 0.61 | %52.2 |  |
| ★ Hell Blade (`hell-blade`) | 5 | 600 | %66.2 | 0.67 | %53.4 |  |
| Minor Healing (`minor-healing`) | 1 | 1200 | %75.7 | 0.76 | %51.1 |  |
| Light Feet (`light-feet`) | 1 | 1200 | %11.8 | 0.12 | %58.2 | DÜŞÜK |
| Stab (`stab`) | 1 | 600 | %83.2 | 0.83 | %45.5 |  |
| Stealth (`stealth`) | 1 | 600 | %76.0 | 0.76 | %46.1 |  |
| Thrust (`thrust`) | 2 | 600 | %81.7 | 0.82 | %50.8 |  |
| Blinding (`blinding`) | 2 | 600 | %73.3 | 0.73 | %49.3 |  |
| Spike (`spike`) | 3 | 600 | %70.8 | 0.71 | %52.0 |  |
| ★ Critical Point (`critical-point`) | 2 | 600 | %70.7 | 0.71 | %53.5 |  |
| ★ Beast Hiding (`beast-hiding`) | 4 | 600 | %66.0 | 0.66 | %53.5 |  |
| Poison Arrow (`poison-arrow`) | 1 | 600 | %80.2 | 0.80 | %58.6 |  |
| Perfect Arrow (`perfect-arrow`) | 1 | 600 | %63.5 | 0.64 | %59.1 |  |
| Multiple Shot (`multiple-shot`) | 2 | 600 | %72.8 | 0.73 | %64.8 |  |
| Viper (`viper`) | 2 | 600 | %75.8 | 0.76 | %62.9 |  |
| Blinding Strafe (`blinding-strafe`) | 2 | 600 | %69.0 | 0.69 | %61.6 |  |
| ★ Arrow Shower (`arrow-shower`) | 4 | 600 | %63.3 | 0.63 | %71.1 |  |
| ★ Power Shot (`power-shot`) | 4 | 600 | %61.8 | 0.62 | %70.9 |  |
