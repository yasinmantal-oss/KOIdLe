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
| Raunt ortalama / medyan / min / maks | 7.34 / 7 / 5 / 20 |
| İlk oyuncunun kazanma oranı | %43.3 |
| Berabere | %0.1 |
| Arena Çöküşü görülen maç | %0.0 |
| Yorgunluk görülen maç | %0.1 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.0 |
| Karıştırma görülen maç | %27.2 |
| Tur başına kullanılmayan MP (ortalama) | 0.82 |

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
| Warrior | — | %46.0 | %58.0 |
| Rogue · Asas | %54.0 | — | %44.0 |
| Rogue · Okçu | %42.0 | %56.0 | — |

## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)

| Job | Kritik kullanımı | Kaçınma tetiklenmesi | Zehir hasarı |
|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 0.93 | 1.92 | 0.00 |
| Rogue · Okçu | 0.00 | 0.57 | 8.19 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 899 | %99.9 |
| fatigue | 0 | %0.0 |
| arenaCollapse | 0 | %0.0 |
| roundCap | 1 | %0.1 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %40.0 | %38.3 |
| balanced | %60.0 | — | %48.3 |
| defensive | %61.7 | %51.7 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 0.98 |
| balanced | 1.02 |
| defensive | 1.13 |

## Kartlar (yalnız en az bir hazır destede olanlar)

Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %30 (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|---|
| Quick Strike (`quick-strike`) | 1 | 1200 | %90.3 | 0.94 | %50.7 |  |
| Absoluteness (`absoluteness`) | 1 | 1800 | %84.8 | 0.89 | %48.6 |  |
| Intimidate (`intimidate`) | 1 | 1200 | %76.9 | 0.79 | %50.1 |  |
| Power Strike (`power-strike`) | 3 | 1200 | %94.5 | 1.00 | %50.3 |  |
| Slash (`slash`) | 1 | 600 | %91.5 | 0.93 | %52.1 |  |
| Gain (`gain`) | 1 | 600 | %86.0 | 0.87 | %53.3 |  |
| Leg Cutting (`leg-cutting`) | 2 | 600 | %78.0 | 0.79 | %54.1 |  |
| Berserker (`berserker`) | 2 | 600 | %42.5 | 0.43 | %52.2 |  |
| Iron Skin (`iron-skin`) | 2 | 600 | %66.8 | 0.69 | %51.1 |  |
| Cleave (`cleave`) | 3 | 600 | %88.3 | 0.89 | %53.0 |  |
| Howling Sword (`howling-sword`) | 4 | 600 | %81.8 | 0.83 | %56.6 |  |
| ★ Sword Dancing (`sword-dancing`) | 4 | 600 | %82.5 | 0.84 | %54.1 |  |
| ★ Hell Blade (`hell-blade`) | 5 | 600 | %80.0 | 0.81 | %60.4 |  |
| Minor Healing (`minor-healing`) | 1 | 1200 | %91.7 | 0.97 | %48.5 |  |
| Evade (`evade`) | 1 | 1200 | %82.9 | 0.88 | %48.7 |  |
| Stab (`stab`) | 1 | 600 | %94.5 | 1.04 | %49.0 |  |
| Stealth (`stealth`) | 1 | 600 | %84.2 | 0.92 | %48.3 |  |
| Thrust (`thrust`) | 2 | 600 | %97.7 | 1.06 | %49.8 |  |
| Blinding (`blinding`) | 2 | 600 | %93.0 | 1.01 | %50.7 |  |
| Spike (`spike`) | 3 | 600 | %97.8 | 1.09 | %49.6 |  |
| ★ Critical Point (`critical-point`) | 2 | 600 | %95.2 | 1.05 | %50.1 |  |
| ★ Beast Hiding (`beast-hiding`) | 4 | 600 | %83.3 | 0.93 | %54.0 |  |
| Poison Arrow (`poison-arrow`) | 1 | 600 | %92.5 | 0.94 | %49.2 |  |
| Perfect Arrow (`perfect-arrow`) | 1 | 600 | %78.8 | 0.80 | %49.0 |  |
| Multiple Shot (`multiple-shot`) | 2 | 600 | %87.5 | 0.88 | %52.2 |  |
| Viper (`viper`) | 2 | 600 | %90.7 | 0.92 | %51.3 |  |
| Blinding Strafe (`blinding-strafe`) | 2 | 600 | %79.2 | 0.80 | %49.5 |  |
| ★ Arrow Shower (`arrow-shower`) | 4 | 600 | %75.7 | 0.78 | %54.8 |  |
| ★ Power Shot (`power-shot`) | 4 | 600 | %80.8 | 0.82 | %55.3 |  |
