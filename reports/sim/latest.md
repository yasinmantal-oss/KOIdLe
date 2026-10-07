# Simülasyon Raporu (AI vs AI) — Faz 2 (dört job)

> `pnpm sim` ile üretilir. Simülasyon "eğlenceli mi?" kararı vermez; bariz matematik hatası ve anlamsız davranış arar. Otomatik kabul/red eşiği yoktur (C5); ⚠ ve DÜŞÜK işaretleri Gate 2 ölçütlerini (spec §9) hatırlatır.
> **Faz 1 sim sonuçları artık karşılaştırılamaz:** yeni kartlar, açılış eli kuralı ve AI tur planı (F2-11) yeni bir temel ölçüm başlattı.
> Job geçişi: 2500 maç = 5×5 job eşleşmesi × 100 seed (1–100), balanced vs balanced, hazır desteler. Genel, Açılış, Kombo, Faz 2b, Bitiş nedeni ve Kartlar bölümleri yalnız bu geçişten.
> Profil geçişi: 450 maç = 3×3 profil eşleşmesi × 5 aynalı job × 10 seed (1–10).
> AI tur planı: derinlik 4, ışın 5.
> Config özeti: HP 30 · MP 1→6 · el 4/8 · Kalkan resetOnOwnTurnStart · karıştırma 1 · Arena kapalı · Yorgunluk 1+1 · Donma 2 tur

## Genel

| Ölçüt | Değer |
|---|---|
| Raunt ortalama / medyan / min / maks | 11.67 / 8 / 4 / 20 |
| İlk oyuncunun kazanma oranı | %36.0 |
| Berabere | %26.3 |
| Arena Çöküşü görülen maç | %0.0 |
| Yorgunluk görülen maç | %31.7 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.0 |
| Karıştırma görülen maç | %59.2 |
| Tur başına kullanılmayan MP (ortalama) | 2.05 |

## Açılış (ilk 2 turda oynanabilir kart yok)

Hedef ~0 (spec §9). Oran: oyuncu-maçların kaçında ilk 2 turda bir kez bile oynanabilir kart yoktu.

| Job | Ölü açılış oranı |
|---|---|
| Tümü | %0.0 |
| Warrior | %0.0 |
| Rogue · Asas | %0.0 |
| Rogue · Okçu | %0.0 |
| Mage | %0.0 |
| Priest | %0.0 |

## Job eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

Gate 2 aralığı %40–60; dışındakiler ⚠.

| | Warrior | Rogue · Asas | Rogue · Okçu | Mage | Priest |
|---|---|---|---|---|---|
| Warrior | — | %54.5 | %60.0 | %65.5 ⚠ | %21.5 ⚠ |
| Rogue · Asas | %45.5 | — | %43.0 | %50.0 | %0.5 ⚠ |
| Rogue · Okçu | %40.0 | %57.0 | — | %50.0 | %22.5 ⚠ |
| Mage | %34.5 ⚠ | %50.0 | %50.0 | — | %4.5 ⚠ |
| Priest | %2.0 ⚠ | %2.5 ⚠ | %6.0 ⚠ | %61.5 ⚠ | — |

## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)

| Job | Kritik kullanımı | Kaçınma tetiklenmesi | Zehir hasarı |
|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 1.15 | 2.13 | 0.00 |
| Rogue · Okçu | 0.00 | 0.62 | 9.68 |
| Mage | 0.00 | 0.00 | 0.00 |
| Priest | 0.00 | 0.00 | 0.00 |

## Faz 2b mekanikleri (oyuncu-maç başına ortalama)

Donma/Ateş: Mage rakibe Donma uygular; Ateş kartı Donma'yı tüketip bonus hasar verir. Taşan iyileşme/maks HP: Priest'in taşan iyileşmesi Kalkana döner, Parasite rakip maks HP'sini kalıcı azaltır. Sayaçlar eylemi yapan koltuk adına yazılır (taşan iyileşme Kalkanı alan koltuk adına).

| Job | Donma uygulaması | Ateş bonusu | Maks HP azaltma | Taşan iyileşme Kalkanı |
|---|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 0.00 | 0.00 | 0.00 | 0.00 |
| Rogue · Okçu | 0.00 | 0.00 | 0.00 | 0.00 |
| Mage | 4.36 | 2.43 | 0.00 | 0.00 |
| Priest | 0.00 | 0.00 | 0.00 | 22.34 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 1733 | %69.3 |
| fatigue | 109 | %4.4 |
| arenaCollapse | 0 | %0.0 |
| roundCap | 658 | %26.3 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %38.0 | %35.0 |
| balanced | %42.0 | — | %36.0 |
| defensive | %45.0 | %44.0 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 1.71 |
| balanced | 1.75 |
| defensive | 1.79 |

## Kartlar (yalnız en az bir hazır destede olanlar)

Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %30 (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|---|
| Quick Strike (`quick-strike`) | 1 | 4000 | %94.8 | 1.36 | %34.4 |  |
| Absoluteness (`absoluteness`) | 1 | 5000 | %90.0 | 1.27 | %35.1 |  |
| Intimidate (`intimidate`) | 1 | 3000 | %80.7 | 1.00 | %42.0 |  |
| Power Strike (`power-strike`) | 3 | 2000 | %95.7 | 1.21 | %41.7 |  |
| Slash (`slash`) | 1 | 1000 | %94.7 | 1.16 | %50.4 |  |
| Gain (`gain`) | 1 | 1000 | %89.6 | 1.11 | %50.1 |  |
| Leg Cutting (`leg-cutting`) | 2 | 1000 | %83.5 | 1.04 | %51.4 |  |
| Berserker (`berserker`) | 2 | 1000 | %13.9 | 0.14 | %99.3 | DÜŞÜK |
| Iron Skin (`iron-skin`) | 2 | 1000 | %72.4 | 0.92 | %48.6 |  |
| Cleave (`cleave`) | 3 | 1000 | %93.9 | 1.15 | %50.4 |  |
| Howling Sword (`howling-sword`) | 4 | 1000 | %89.2 | 1.10 | %53.4 |  |
| ★ Sword Dancing (`sword-dancing`) | 4 | 1000 | %89.8 | 1.11 | %50.7 |  |
| ★ Hell Blade (`hell-blade`) | 5 | 1000 | %87.1 | 1.09 | %53.7 |  |
| Minor Healing (`minor-healing`) | 1 | 2000 | %95.0 | 1.17 | %39.8 |  |
| Evade (`evade`) | 1 | 2000 | %87.9 | 1.10 | %39.7 |  |
| Stab (`stab`) | 1 | 1000 | %97.2 | 1.23 | %37.7 |  |
| Stealth (`stealth`) | 1 | 1000 | %89.5 | 1.16 | %36.2 |  |
| Thrust (`thrust`) | 2 | 1000 | %98.5 | 1.28 | %37.9 |  |
| Blinding (`blinding`) | 2 | 1000 | %95.0 | 1.22 | %38.3 |  |
| Spike (`spike`) | 3 | 1000 | %98.6 | 1.27 | %38.1 |  |
| ★ Critical Point (`critical-point`) | 2 | 1000 | %98.3 | 1.25 | %38.1 |  |
| ★ Beast Hiding (`beast-hiding`) | 4 | 1000 | %89.6 | 1.19 | %39.3 |  |
| Poison Arrow (`poison-arrow`) | 1 | 1000 | %93.9 | 1.13 | %44.3 |  |
| Perfect Arrow (`perfect-arrow`) | 1 | 1000 | %79.1 | 0.91 | %44.2 |  |
| Multiple Shot (`multiple-shot`) | 2 | 1000 | %89.1 | 1.04 | %46.2 |  |
| Viper (`viper`) | 2 | 1000 | %91.8 | 1.12 | %45.3 |  |
| Blinding Strafe (`blinding-strafe`) | 2 | 1000 | %85.4 | 1.04 | %42.9 |  |
| ★ Arrow Shower (`arrow-shower`) | 4 | 1000 | %78.8 | 0.90 | %47.0 |  |
| ★ Power Shot (`power-shot`) | 4 | 1000 | %85.8 | 1.06 | %47.2 |  |
| Freeze (`freeze`) | 1 | 1000 | %94.5 | 1.17 | %37.8 |  |
| Burn (`burn`) | 1 | 1000 | %93.0 | 1.14 | %37.4 |  |
| Chill (`chill`) | 1 | 1000 | %84.1 | 1.01 | %38.6 |  |
| Fire Ball (`fire-ball`) | 2 | 1000 | %96.0 | 1.19 | %38.6 |  |
| Frozen Armor (`frozen-armor`) | 2 | 1000 | %88.8 | 1.11 | %37.5 |  |
| Lightning (`lightning`) | 2 | 1000 | %94.5 | 1.17 | %37.7 |  |
| Ice Comet (`ice-comet`) | 3 | 1000 | %95.2 | 1.18 | %37.6 |  |
| ★ Freezing Distance (`freezing-distance`) | 3 | 1000 | %82.0 | 1.02 | %37.7 |  |
| ★ Meteor Fall (`meteor-fall`) | 6 | 1000 | %84.8 | 1.07 | %43.8 |  |
| Healing (`healing`) | 1 | 1000 | %100.0 | 1.96 | %14.4 | HER MAÇ |
| Malice (`malice`) | 1 | 1000 | %100.0 | 1.80 | %14.4 | HER MAÇ |
| Light Strike (`light-strike`) | 1 | 1000 | %100.0 | 1.91 | %14.4 | HER MAÇ |
| Massive (`massive`) | 2 | 1000 | %100.0 | 1.95 | %14.4 | HER MAÇ |
| Parasite (`parasite`) | 2 | 1000 | %0.0 | 0.00 | — | HİÇ OYNANMADI |
| Helis (`helis`) | 3 | 1000 | %100.0 | 1.96 | %14.4 | HER MAÇ |
| Judgement (`judgement`) | 3 | 1000 | %100.0 | 1.96 | %14.4 | HER MAÇ |
| Great Healing (`great-healing`) | 4 | 1000 | %100.0 | 1.93 | %14.4 | HER MAÇ |
| ★ Torment (`torment`) | 3 | 1000 | %100.0 | 1.94 | %14.4 | HER MAÇ |
| ★ Complete Heal (`complete-heal`) | 4 | 1000 | %100.0 | 1.92 | %14.4 | HER MAÇ |
