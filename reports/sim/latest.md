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
| Raunt ortalama / medyan / min / maks | 8.07 / 8 / 5 / 12 |
| İlk oyuncunun kazanma oranı | %33.9 |
| Berabere | %0.0 |
| Arena Çöküşü görülen maç | %69.1 |
| Yorgunluk görülen maç | %0.0 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.0 |
| Karıştırma görülen maç | %18.7 |
| Tur başına kullanılmayan MP (ortalama) | 1.36 |

## Açılış (ilk 2 turda oynanabilir kart yok)

Hedef ~0 (spec §9). Oran: oyuncu-maçların kaçında ilk 2 turda bir kez bile oynanabilir kart yoktu.

| Job | Ölü açılış oranı |
|---|---|
| Tümü | %0.6 |
| Warrior | %0.0 |
| Rogue · Asas | %1.2 |
| Rogue · Okçu | %0.5 |

## Job eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

Gate 2 aralığı %40–60; dışındakiler ⚠.

| | Warrior | Rogue · Asas | Rogue · Okçu |
|---|---|---|---|
| Warrior | — | %41.5 | %30.0 ⚠ |
| Rogue · Asas | %58.5 | — | %32.0 ⚠ |
| Rogue · Okçu | %70.0 ⚠ | %68.0 ⚠ | — |

## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)

| Job | Kritik kullanımı | Kaçınma tetiklenmesi | Zehir hasarı |
|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 0.80 | 1.23 | 0.00 |
| Rogue · Okçu | 0.00 | 0.00 | 7.64 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 600 | %66.7 |
| fatigue | 0 | %0.0 |
| arenaCollapse | 300 | %33.3 |
| roundCap | 0 | %0.0 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %50.0 | %55.0 |
| balanced | %50.0 | — | %56.7 |
| defensive | %45.0 | %43.3 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 1.42 |
| balanced | 1.46 |
| defensive | 1.52 |

## Kartlar (yalnız en az bir hazır destede olanlar)

Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %30 (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|---|
| Quick Strike (`quick-strike`) | 1 | 1200 | %91.5 | 0.93 | %44.8 |  |
| Absoluteness (`absoluteness`) | 1 | 1800 | %87.4 | 0.89 | %49.2 |  |
| Intimidate (`intimidate`) | 1 | 1200 | %84.4 | 0.85 | %50.1 |  |
| Power Strike (`power-strike`) | 3 | 1200 | %92.5 | 0.93 | %57.0 |  |
| Slash (`slash`) | 1 | 600 | %95.3 | 0.96 | %41.6 |  |
| Gain (`gain`) | 1 | 600 | %92.0 | 0.93 | %42.9 |  |
| Leg Cutting (`leg-cutting`) | 2 | 600 | %92.5 | 0.94 | %42.0 |  |
| Berserker (`berserker`) | 2 | 600 | %62.0 | 0.62 | %49.7 |  |
| Iron Skin (`iron-skin`) | 2 | 600 | %90.3 | 0.92 | %41.3 |  |
| Cleave (`cleave`) | 3 | 600 | %95.0 | 0.96 | %42.6 |  |
| Howling Sword (`howling-sword`) | 4 | 600 | %92.2 | 0.93 | %43.9 |  |
| ★ Sword Dancing (`sword-dancing`) | 4 | 600 | %91.0 | 0.92 | %44.1 |  |
| ★ Hell Blade (`hell-blade`) | 5 | 600 | %91.3 | 0.93 | %44.3 |  |
| Minor Healing (`minor-healing`) | 1 | 1200 | %90.7 | 0.93 | %54.3 |  |
| Light Feet (`light-feet`) | 0 | 1200 | %60.6 | 0.61 | %57.6 |  |
| Stab (`stab`) | 1 | 600 | %96.7 | 0.98 | %47.4 |  |
| Stealth (`stealth`) | 1 | 600 | %91.0 | 0.93 | %47.8 |  |
| Thrust (`thrust`) | 2 | 600 | %95.8 | 0.97 | %48.0 |  |
| Blinding (`blinding`) | 2 | 600 | %92.7 | 0.94 | %47.5 |  |
| Spike (`spike`) | 3 | 600 | %95.5 | 0.98 | %48.9 |  |
| ★ Critical Point (`critical-point`) | 2 | 600 | %94.0 | 0.95 | %49.1 |  |
| ★ Beast Hiding (`beast-hiding`) | 4 | 600 | %88.3 | 0.91 | %52.5 |  |
| Poison Arrow (`poison-arrow`) | 1 | 600 | %91.2 | 0.91 | %62.7 |  |
| Perfect Arrow (`perfect-arrow`) | 1 | 600 | %78.2 | 0.78 | %63.3 |  |
| Multiple Shot (`multiple-shot`) | 2 | 600 | %85.7 | 0.86 | %66.3 |  |
| Viper (`viper`) | 2 | 600 | %91.8 | 0.92 | %65.0 |  |
| Blinding Strafe (`blinding-strafe`) | 2 | 600 | %81.7 | 0.82 | %63.9 |  |
| ★ Arrow Shower (`arrow-shower`) | 4 | 600 | %78.3 | 0.79 | %71.1 |  |
| ★ Power Shot (`power-shot`) | 4 | 600 | %82.8 | 0.83 | %68.6 |  |
