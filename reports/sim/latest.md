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
| Raunt ortalama / medyan / min / maks | 7.09 / 7 / 3 / 11 |
| İlk oyuncunun kazanma oranı | %58.6 |
| Berabere | %0.0 |
| Arena Çöküşü görülen maç | %38.6 |
| Yorgunluk görülen maç | %0.0 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.0 |
| Karıştırma görülen maç | %9.8 |
| Tur başına kullanılmayan MP (ortalama) | 0.99 |

## Açılış (ilk 2 turda oynanabilir kart yok)

Hedef ~0 (spec §9). Oran: oyuncu-maçların kaçında ilk 2 turda bir kez bile oynanabilir kart yoktu.

| Job | Ölü açılış oranı |
|---|---|
| Tümü | %0.5 |
| Warrior | %0.5 |
| Rogue · Asas | %0.0 |
| Rogue · Okçu | %1.0 |

## Job eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

Gate 2 aralığı %40–60; dışındakiler ⚠.

| | Warrior | Rogue · Asas | Rogue · Okçu |
|---|---|---|---|
| Warrior | — | %48.0 | %51.0 |
| Rogue · Asas | %52.0 | — | %42.0 |
| Rogue · Okçu | %49.0 | %58.0 | — |

## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)

| Job | Kritik kullanımı | Kaçınma tetiklenmesi | Zehir hasarı |
|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 0.78 | 1.72 | 0.00 |
| Rogue · Okçu | 0.00 | 0.53 | 7.57 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 760 | %84.4 |
| fatigue | 0 | %0.0 |
| arenaCollapse | 140 | %15.6 |
| roundCap | 0 | %0.0 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %45.0 | %50.0 |
| balanced | %55.0 | — | %56.7 |
| defensive | %50.0 | %43.3 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 1.12 |
| balanced | 1.07 |
| defensive | 1.20 |

## Kartlar (yalnız en az bir hazır destede olanlar)

Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %30 (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|---|
| Quick Strike (`quick-strike`) | 1 | 1200 | %86.8 | 0.88 | %49.1 |  |
| Absoluteness (`absoluteness`) | 1 | 1800 | %83.8 | 0.84 | %48.3 |  |
| Intimidate (`intimidate`) | 1 | 1200 | %77.8 | 0.78 | %49.7 |  |
| Power Strike (`power-strike`) | 3 | 1200 | %90.9 | 0.92 | %53.3 |  |
| Slash (`slash`) | 1 | 600 | %88.3 | 0.88 | %49.4 |  |
| Gain (`gain`) | 1 | 600 | %82.8 | 0.83 | %50.3 |  |
| Leg Cutting (`leg-cutting`) | 2 | 600 | %81.5 | 0.82 | %51.3 |  |
| Berserker (`berserker`) | 2 | 600 | %58.0 | 0.58 | %50.6 |  |
| Iron Skin (`iron-skin`) | 2 | 600 | %74.7 | 0.75 | %48.7 |  |
| Cleave (`cleave`) | 3 | 600 | %85.7 | 0.86 | %53.1 |  |
| Howling Sword (`howling-sword`) | 4 | 600 | %84.0 | 0.84 | %54.2 |  |
| ★ Sword Dancing (`sword-dancing`) | 4 | 600 | %74.0 | 0.74 | %55.6 |  |
| ★ Hell Blade (`hell-blade`) | 5 | 600 | %80.3 | 0.80 | %56.6 |  |
| Minor Healing (`minor-healing`) | 1 | 1200 | %88.8 | 0.89 | %50.1 |  |
| Evade (`evade`) | 1 | 1200 | %84.1 | 0.85 | %49.2 |  |
| Stab (`stab`) | 1 | 600 | %94.7 | 0.96 | %47.5 |  |
| Stealth (`stealth`) | 1 | 600 | %86.5 | 0.88 | %46.8 |  |
| Thrust (`thrust`) | 2 | 600 | %95.3 | 0.97 | %48.8 |  |
| Blinding (`blinding`) | 2 | 600 | %89.7 | 0.92 | %49.4 |  |
| Spike (`spike`) | 3 | 600 | %94.0 | 0.97 | %49.8 |  |
| ★ Critical Point (`critical-point`) | 2 | 600 | %91.7 | 0.93 | %51.1 |  |
| ★ Beast Hiding (`beast-hiding`) | 4 | 600 | %82.2 | 0.84 | %53.3 |  |
| Poison Arrow (`poison-arrow`) | 1 | 600 | %91.0 | 0.92 | %52.6 |  |
| Perfect Arrow (`perfect-arrow`) | 1 | 600 | %77.0 | 0.77 | %54.8 |  |
| Multiple Shot (`multiple-shot`) | 2 | 600 | %87.7 | 0.88 | %56.1 |  |
| Viper (`viper`) | 2 | 600 | %86.3 | 0.86 | %54.8 |  |
| Blinding Strafe (`blinding-strafe`) | 2 | 600 | %78.3 | 0.79 | %52.1 |  |
| ★ Arrow Shower (`arrow-shower`) | 4 | 600 | %76.0 | 0.76 | %61.0 |  |
| ★ Power Shot (`power-shot`) | 4 | 600 | %77.7 | 0.78 | %57.1 |  |
