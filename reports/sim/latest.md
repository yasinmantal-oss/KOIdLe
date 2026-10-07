# Simülasyon Raporu (AI vs AI) — Faz 2a

> `pnpm sim` ile üretilir. Simülasyon "eğlenceli mi?" kararı vermez; bariz matematik hatası ve anlamsız davranış arar. Otomatik kabul/red eşiği yoktur (C5); ⚠ ve DÜŞÜK işaretleri Gate 2 ölçütlerini (spec §9) hatırlatır.
> **Faz 1 sim sonuçları artık karşılaştırılamaz:** yeni kartlar, açılış eli kuralı ve AI tur planı (F2-11) yeni bir temel ölçüm başlattı.
> Job geçişi: 900 maç = 3×3 job eşleşmesi × 100 seed (1–100), balanced vs balanced, hazır desteler. Genel, Açılış, Kombo, Bitiş nedeni ve Kartlar bölümleri yalnız bu geçişten.
> Profil geçişi: 270 maç = 3×3 profil eşleşmesi × 3 aynalı job × 10 seed (1–10).
> AI tur planı: derinlik 4, ışın 5.
> Config özeti: HP 30 · MP 1→6 · el 4/8 · Kalkan resetOnOwnTurnStart · karıştırma 1 · Arena kapalı · Yorgunluk 1+1

## Genel

| Ölçüt | Değer |
|---|---|
| Raunt ortalama / medyan / min / maks | 7.30 / 7 / 3 / 15 |
| İlk oyuncunun kazanma oranı | %61.3 |
| Berabere | %0.0 |
| Arena Çöküşü görülen maç | %0.0 |
| Yorgunluk görülen maç | %0.0 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.0 |
| Karıştırma görülen maç | %18.3 |
| Tur başına kullanılmayan MP (ortalama) | 1.10 |

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
| Warrior | — | %50.5 | %51.0 |
| Rogue · Asas | %49.5 | — | %41.0 |
| Rogue · Okçu | %49.0 | %59.0 | — |

## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)

| Job | Kritik kullanımı | Kaçınma tetiklenmesi | Zehir hasarı |
|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 0.85 | 1.80 | 0.00 |
| Rogue · Okçu | 0.00 | 0.54 | 7.65 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 900 | %100.0 |
| fatigue | 0 | %0.0 |
| arenaCollapse | 0 | %0.0 |
| roundCap | 0 | %0.0 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %50.0 | %53.3 |
| balanced | %50.0 | — | %50.0 |
| defensive | %46.7 | %50.0 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 1.20 |
| balanced | 1.17 |
| defensive | 1.27 |

## Kartlar (yalnız en az bir hazır destede olanlar)

Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %30 (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|---|
| Quick Strike (`quick-strike`) | 1 | 1200 | %87.3 | 0.91 | %48.8 |  |
| Absoluteness (`absoluteness`) | 1 | 1800 | %84.0 | 0.86 | %48.1 |  |
| Intimidate (`intimidate`) | 1 | 1200 | %77.9 | 0.79 | %50.4 |  |
| Power Strike (`power-strike`) | 3 | 1200 | %91.4 | 0.95 | %52.6 |  |
| Slash (`slash`) | 1 | 600 | %88.7 | 0.90 | %50.2 |  |
| Gain (`gain`) | 1 | 600 | %83.5 | 0.85 | %50.9 |  |
| Leg Cutting (`leg-cutting`) | 2 | 600 | %81.8 | 0.83 | %52.1 |  |
| Berserker (`berserker`) | 2 | 600 | %58.5 | 0.59 | %50.4 |  |
| Iron Skin (`iron-skin`) | 2 | 600 | %74.8 | 0.76 | %50.1 |  |
| Cleave (`cleave`) | 3 | 600 | %86.0 | 0.87 | %53.9 |  |
| Howling Sword (`howling-sword`) | 4 | 600 | %85.0 | 0.86 | %55.1 |  |
| ★ Sword Dancing (`sword-dancing`) | 4 | 600 | %74.7 | 0.76 | %56.5 |  |
| ★ Hell Blade (`hell-blade`) | 5 | 600 | %81.0 | 0.82 | %57.2 |  |
| Minor Healing (`minor-healing`) | 1 | 1200 | %88.9 | 0.91 | %49.7 |  |
| Evade (`evade`) | 1 | 1200 | %84.7 | 0.88 | %48.5 |  |
| Stab (`stab`) | 1 | 600 | %95.2 | 1.01 | %46.4 |  |
| Stealth (`stealth`) | 1 | 600 | %86.5 | 0.92 | %45.5 |  |
| Thrust (`thrust`) | 2 | 600 | %95.7 | 1.02 | %47.4 |  |
| Blinding (`blinding`) | 2 | 600 | %89.8 | 0.96 | %48.1 |  |
| Spike (`spike`) | 3 | 600 | %94.2 | 1.00 | %48.7 |  |
| ★ Critical Point (`critical-point`) | 2 | 600 | %91.8 | 0.97 | %49.9 |  |
| ★ Beast Hiding (`beast-hiding`) | 4 | 600 | %83.5 | 0.89 | %51.5 |  |
| Poison Arrow (`poison-arrow`) | 1 | 600 | %91.3 | 0.93 | %53.1 |  |
| Perfect Arrow (`perfect-arrow`) | 1 | 600 | %77.3 | 0.79 | %54.7 |  |
| Multiple Shot (`multiple-shot`) | 2 | 600 | %87.8 | 0.89 | %56.5 |  |
| Viper (`viper`) | 2 | 600 | %87.0 | 0.88 | %54.8 |  |
| Blinding Strafe (`blinding-strafe`) | 2 | 600 | %78.3 | 0.79 | %52.6 |  |
| ★ Arrow Shower (`arrow-shower`) | 4 | 600 | %77.3 | 0.78 | %61.0 |  |
| ★ Power Shot (`power-shot`) | 4 | 600 | %78.5 | 0.79 | %57.7 |  |
