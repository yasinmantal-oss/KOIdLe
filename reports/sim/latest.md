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
| Raunt ortalama / medyan / min / maks | 8.46 / 7 / 4 / 20 |
| İlk oyuncunun kazanma oranı | %42.3 |
| Berabere | %0.4 |
| Arena Çöküşü görülen maç | %0.0 |
| Yorgunluk görülen maç | %1.0 |
| İkisi de görülen maç (bothArenaAndFatigueReachedRate) | %0.0 |
| Karıştırma görülen maç | %47.6 |
| Tur başına kullanılmayan MP (ortalama) | 1.11 |

## Açılış (ilk 2 turda oynanabilir kart yok)

Hedef ~0 (spec §9). Oran: oyuncu-maçların kaçında ilk 2 turda bir kez bile oynanabilir kart yoktu.

| Job | Ölü açılış oranı |
|---|---|
| Tümü | %0.1 |
| Warrior | %0.0 |
| Rogue · Asas | %0.0 |
| Rogue · Okçu | %0.0 |
| Mage | %0.0 |
| Priest | %0.5 |

## Job eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

Gate 2 aralığı %40–60; dışındakiler ⚠.

| | Warrior | Rogue · Asas | Rogue · Okçu | Mage | Priest |
|---|---|---|---|---|---|
| Warrior | — | %46.0 | %58.0 | %56.5 | %59.0 |
| Rogue · Asas | %54.0 | — | %44.0 | %49.0 | %39.5 ⚠ |
| Rogue · Okçu | %42.0 | %56.0 | — | %52.5 | %45.5 |
| Mage | %43.5 | %51.0 | %47.5 | — | %55.0 |
| Priest | %41.0 | %59.0 | %54.5 | %45.0 | — |

## Kombo tetiklenmeleri (oyuncu-maç başına ortalama)

| Job | Kritik kullanımı | Kaçınma tetiklenmesi | Zehir hasarı |
|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 1.01 | 1.89 | 0.00 |
| Rogue · Okçu | 0.00 | 0.53 | 8.62 |
| Mage | 0.00 | 0.00 | 0.00 |
| Priest | 0.00 | 0.00 | 0.00 |

## Faz 2b mekanikleri (oyuncu-maç başına ortalama)

Donma/Ateş: Mage rakibe Donma uygular; Ateş kartı Donma'yı tüketip bonus hasar verir. Taşan iyileşme/maks HP: Priest'in taşan iyileşmesi Kalkana döner, Parasite rakip maks HP'sini kalıcı azaltır. Sayaçlar eylemi yapan koltuk adına yazılır (taşan iyileşme Kalkanı alan koltuk adına).

| Job | Donma uygulaması | Ateş bonusu | Maks HP azaltma | Taşan iyileşme Kalkanı |
|---|---|---|---|---|
| Warrior | 0.00 | 0.00 | 0.00 | 0.00 |
| Rogue · Asas | 0.00 | 0.00 | 0.00 | 0.00 |
| Rogue · Okçu | 0.00 | 0.00 | 0.00 | 0.00 |
| Mage | 3.67 | 2.16 | 0.00 | 0.00 |
| Priest | 0.00 | 0.00 | 13.90 | 3.54 |

## Bitiş nedeni (endReason)

| Neden | Maç | Oran |
|---|---|---|
| normalDamage | 2484 | %99.4 |
| fatigue | 7 | %0.3 |
| arenaCollapse | 0 | %0.0 |
| roundCap | 9 | %0.4 |

## Profil eşleşmeleri (satırın sütuna karşı kazanma oranı, iki koltuk birleşik)

| | aggressive | balanced | defensive |
|---|---|---|---|
| aggressive | — | %47.0 | %48.0 |
| balanced | %49.0 | — | %49.0 |
| defensive | %52.0 | %50.0 | — |

## Kullanılmayan MP (tur başına, profile göre)

| Profil | MP |
|---|---|
| aggressive | 1.28 |
| balanced | 1.24 |
| defensive | 1.25 |

## Kartlar (yalnız en az bir hazır destede olanlar)

Oynanma oranı: kartın destede olduğu oyuncu-maçların kaçında en az bir kez oynandı. DÜŞÜK = oran < %30 (Gate 2 ölçütü). Kazanma: kartı oynayan oyuncunun o maçlardaki kazanma oranı.

| Kart | MP | Destede (oyuncu-maç) | Oynanma oranı | Maç başı oynanma | Oynadığında kazanma | İşaret |
|---|---|---|---|---|---|---|
| Quick Strike (`quick-strike`) | 1 | 4000 | %92.2 | 1.06 | %50.1 |  |
| Absoluteness (`absoluteness`) | 1 | 5000 | %87.9 | 1.00 | %48.8 |  |
| Intimidate (`intimidate`) | 1 | 3000 | %78.3 | 0.83 | %50.7 |  |
| Power Strike (`power-strike`) | 3 | 3000 | %96.6 | 1.16 | %49.2 |  |
| Slash (`slash`) | 1 | 1000 | %92.0 | 0.97 | %54.3 |  |
| Gain (`gain`) | 1 | 1000 | %86.8 | 0.90 | %54.8 |  |
| Leg Cutting (`leg-cutting`) | 2 | 1000 | %79.0 | 0.83 | %57.1 |  |
| Berserker (`berserker`) | 2 | 1000 | %48.0 | 0.50 | %56.9 |  |
| Iron Skin (`iron-skin`) | 2 | 1000 | %69.4 | 0.74 | %54.0 |  |
| Cleave (`cleave`) | 3 | 1000 | %90.1 | 0.94 | %55.7 |  |
| Howling Sword (`howling-sword`) | 4 | 1000 | %84.3 | 0.88 | %59.0 |  |
| ★ Sword Dancing (`sword-dancing`) | 4 | 1000 | %84.4 | 0.89 | %56.5 |  |
| ★ Hell Blade (`hell-blade`) | 5 | 1000 | %82.8 | 0.88 | %60.9 |  |
| Minor Healing (`minor-healing`) | 1 | 2000 | %92.8 | 1.03 | %47.4 |  |
| Evade (`evade`) | 1 | 2000 | %85.9 | 0.96 | %46.8 |  |
| Stab (`stab`) | 1 | 1000 | %94.8 | 1.08 | %47.3 |  |
| Stealth (`stealth`) | 1 | 1000 | %87.2 | 1.02 | %46.0 |  |
| Thrust (`thrust`) | 2 | 1000 | %98.1 | 1.14 | %47.6 |  |
| Blinding (`blinding`) | 2 | 1000 | %94.3 | 1.07 | %48.0 |  |
| Spike (`spike`) | 3 | 1000 | %98.1 | 1.15 | %47.4 |  |
| ★ Critical Point (`critical-point`) | 2 | 1000 | %96.8 | 1.12 | %47.8 |  |
| ★ Beast Hiding (`beast-hiding`) | 4 | 1000 | %86.8 | 1.02 | %50.9 |  |
| Poison Arrow (`poison-arrow`) | 1 | 1000 | %93.4 | 0.99 | %48.9 |  |
| Perfect Arrow (`perfect-arrow`) | 1 | 1000 | %75.5 | 0.78 | %49.3 |  |
| Multiple Shot (`multiple-shot`) | 2 | 1000 | %85.9 | 0.89 | %52.7 |  |
| Viper (`viper`) | 2 | 1000 | %91.9 | 0.97 | %51.0 |  |
| Blinding Strafe (`blinding-strafe`) | 2 | 1000 | %81.3 | 0.86 | %47.7 |  |
| ★ Arrow Shower (`arrow-shower`) | 4 | 1000 | %71.0 | 0.74 | %55.5 |  |
| ★ Power Shot (`power-shot`) | 4 | 1000 | %83.5 | 0.89 | %53.5 |  |
| Freeze (`freeze`) | 1 | 1000 | %92.1 | 0.99 | %49.5 |  |
| Burn (`burn`) | 1 | 1000 | %87.2 | 0.93 | %50.3 |  |
| Chill (`chill`) | 1 | 1000 | %80.5 | 0.87 | %50.7 |  |
| Fire Ball (`fire-ball`) | 2 | 1000 | %94.4 | 1.04 | %50.5 |  |
| Frozen Armor (`frozen-armor`) | 2 | 1000 | %88.7 | 0.97 | %50.2 |  |
| Lightning (`lightning`) | 2 | 1000 | %92.7 | 1.00 | %50.6 |  |
| Ice Comet (`ice-comet`) | 3 | 1000 | %92.8 | 1.01 | %50.8 |  |
| ★ Freezing Distance (`freezing-distance`) | 3 | 1000 | %76.2 | 0.83 | %53.5 |  |
| ★ Meteor Fall (`meteor-fall`) | 6 | 1000 | %81.1 | 0.90 | %60.2 |  |
| Healing (`healing`) | 1 | 1000 | %97.4 | 1.25 | %48.8 |  |
| Malice (`malice`) | 1 | 1000 | %90.6 | 1.17 | %47.7 |  |
| Massive (`massive`) | 2 | 1000 | %93.9 | 1.22 | %47.5 |  |
| Parasite (`parasite`) | 2 | 1000 | %98.9 | 1.28 | %49.4 |  |
| Helis (`helis`) | 3 | 1000 | %97.6 | 1.30 | %49.6 |  |
| Judgement (`judgement`) | 3 | 1000 | %99.3 | 1.31 | %49.6 | HER MAÇ |
| Great Healing (`great-healing`) | 3 | 1000 | %96.6 | 1.23 | %50.2 |  |
| ★ Torment (`torment`) | 3 | 1000 | %95.9 | 1.27 | %49.7 |  |
| ★ Superior Parasite (`superior-parasite`) | 4 | 1000 | %95.4 | 1.25 | %48.5 |  |
