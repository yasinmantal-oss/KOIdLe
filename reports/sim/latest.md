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
| Raunt ortalama / medyan / min / maks | 8.39 / 8 / 5 / 12 |
| İlk oyuncunun kazanma oranı | %31.6 |
| Berabere | %0.0 |
| Arena Çöküşü görülen maç | %80.0 |
| Yorgunluk görülen maç | %0.0 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.0 |
| Karıştırma görülen maç | %22.3 |
| Tur başına kullanılmayan MP (ortalama) | 1.42 |

## Açılış (ilk 2 turda oynanabilir kart yok)

Hedef ~0 (spec §9). Oran: oyuncu-maçların kaçında ilk 2 turda bir kez bile oynanabilir kart yoktu.

| Job | Ölü açılış oranı |
|---|---|
| Tümü | %0.9 |
| Warrior | %0.0 |
| Rogue · Asas | %1.2 |
| Rogue · Okçu | %1.5 |

## Job eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

Gate 2 aralığı %40–60; dışındakiler ⚠.

| | Warrior | Rogue · Asas | Rogue · Okçu |
|---|---|---|---|
| Warrior | — | %45.5 | %59.0 |
| Rogue · Asas | %54.5 | — | %57.5 |
| Rogue · Okçu | %41.0 | %42.5 | — |

## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)

| Job | Kritik kullanımı | Kaçınma tetiklenmesi | Zehir hasarı |
|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 0.81 | 1.26 | 0.00 |
| Rogue · Okçu | 0.00 | 0.00 | 6.08 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 530 | %58.9 |
| fatigue | 0 | %0.0 |
| arenaCollapse | 370 | %41.1 |
| roundCap | 0 | %0.0 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %45.0 | %53.3 |
| balanced | %55.0 | — | %58.3 |
| defensive | %46.7 | %41.7 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 1.50 |
| balanced | 1.55 |
| defensive | 1.57 |

## Kartlar (yalnız en az bir hazır destede olanlar)

Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %30 (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|---|
| Quick Strike (`quick-strike`) | 1 | 1200 | %92.7 | 0.94 | %53.7 |  |
| Absoluteness (`absoluteness`) | 1 | 1800 | %90.6 | 0.92 | %50.1 |  |
| Intimidate (`intimidate`) | 1 | 1200 | %89.2 | 0.90 | %47.9 |  |
| Power Strike (`power-strike`) | 3 | 1200 | %95.5 | 0.96 | %51.2 |  |
| Slash (`slash`) | 1 | 600 | %96.0 | 0.97 | %51.0 |  |
| Gain (`gain`) | 1 | 600 | %93.3 | 0.94 | %52.7 |  |
| Leg Cutting (`leg-cutting`) | 2 | 600 | %92.3 | 0.93 | %52.3 |  |
| Berserker (`berserker`) | 2 | 600 | %64.5 | 0.65 | %57.4 |  |
| Iron Skin (`iron-skin`) | 2 | 600 | %91.5 | 0.93 | %51.0 |  |
| Cleave (`cleave`) | 3 | 600 | %95.7 | 0.96 | %53.7 |  |
| Howling Sword (`howling-sword`) | 4 | 600 | %94.8 | 0.95 | %54.3 |  |
| ★ Sword Dancing (`sword-dancing`) | 4 | 600 | %92.8 | 0.94 | %54.4 |  |
| ★ Hell Blade (`hell-blade`) | 5 | 600 | %93.8 | 0.95 | %54.9 |  |
| Minor Healing (`minor-healing`) | 1 | 1200 | %94.4 | 0.97 | %49.4 |  |
| Light Feet (`light-feet`) | 0 | 1200 | %63.3 | 0.63 | %52.1 |  |
| Stab (`stab`) | 1 | 600 | %98.0 | 1.00 | %54.3 |  |
| Stealth (`stealth`) | 1 | 600 | %91.3 | 0.94 | %54.4 |  |
| Thrust (`thrust`) | 2 | 600 | %97.3 | 0.99 | %54.6 |  |
| Blinding (`blinding`) | 2 | 600 | %93.5 | 0.95 | %54.5 |  |
| Spike (`spike`) | 3 | 600 | %97.7 | 1.00 | %54.9 |  |
| ★ Critical Point (`critical-point`) | 2 | 600 | %96.5 | 0.98 | %55.4 |  |
| ★ Beast Hiding (`beast-hiding`) | 4 | 600 | %91.3 | 0.94 | %58.2 |  |
| Poison Arrow (`poison-arrow`) | 1 | 600 | %95.5 | 0.96 | %44.5 |  |
| Perfect Arrow (`perfect-arrow`) | 1 | 600 | %87.8 | 0.89 | %45.2 |  |
| Multiple Shot (`multiple-shot`) | 3 | 600 | %90.5 | 0.91 | %48.4 |  |
| Viper (`viper`) | 2 | 600 | %94.7 | 0.95 | %45.8 |  |
| Blinding Strafe (`blinding-strafe`) | 2 | 600 | %89.5 | 0.90 | %46.4 |  |
| ★ Arrow Shower (`arrow-shower`) | 4 | 600 | %81.5 | 0.82 | %49.7 |  |
| ★ Power Shot (`power-shot`) | 4 | 600 | %89.8 | 0.91 | %49.0 |  |
