# GATE 1 — Savaş tek başına eğlenceli mi?

> **Soru:** Warrior vs Warrior, Hero-vs-Hero kart savaşı tek başına eğlenceli mi?
> **Kural:** Gate 1 geçilmeden Faz 2'ye geçilmez. Kalırsa yalnız savaş düzeltilir.
> Değerler: `docs/savas-degerleri.md` (üretilir; tek kaynak `content/` JSON'ları).

## Nasıl oynanır (yerel makinede)

1. Node 22+ ve pnpm 10 kurulu olsun (`corepack enable` pnpm'i açar).
2. Repo kökünde: `pnpm install`
3. `pnpm dev` → terminalde yazan adresi aç (genelde http://localhost:5173).
4. Rakip AI'ı seç, seed'i boş bırak (rastgele) ya da bir seed yaz, **Savaşa Başla**.
5. Maç bitince formu doldur, **Kaydet**. Kayıt `docs/gate-1/oturumlar.jsonl` dosyasına eklenir. Dosyaya yazılamazsa tarayıcıda yedeklenir; **Kayıtları JSON indir** ile alınır.
6. Değer denemek için `content/` altındaki JSON'u değiştir, `pnpm values` çalıştır, yeni savaş başlat. Kod gerekmez.

## A. Simülasyon (AI vs AI)

Kaynak: `reports/sim/latest.md` (`pnpm sim`, 900 maç). Hiçbir ölçütün otomatik kabul/red eşiği yoktur (C5); aşağıdaki "beklenti" sütunu yalnız yorum içindir.

| Ölçüt | Beklenti | İlk koşu (2026-10-06) |
|---|---|---|
| Raunt ortalama / medyan / min / maks | 7–11 | 7,72 / 8 / 6 / 11 |
| İlk oyuncu kazanma | %45–55 civarı | %47,7 |
| Berabere | çok düşük | %0 |
| Arena Çöküşü görülen maç | yorumlanacak | %59,2 |
| Yorgunluk görülen maç | yorumlanacak | %0 |
| İkisi de görülen maç | yorumlanacak | %0 |
| Bitiş nedeni | yorumlanacak | kart hasarı %80,8 · Arena %19,2 · Yorgunluk %0 · tavan %0 |
| Hiç oynanmayan kart | yok | yok |
| Her maç oynanan kart | dikkat | Yıkım (%99,3) |
| Tur başına kullanılmayan MP | izlenir | 0,34 |

## B. Yasin'in testi

- En az **10 maç**, her profile karşı en az **3**.
- Her maçtan sonra form:
  1. Eğlence (1–5)
  2. Karar vermek zorunda kaldım mı? (1–5)
  3. Maç gereğinden uzun hissettirdi mi? (Evet/Hayır)
  4. Elimde işe yaramayan kart yüzünden sinirlendim mi? (Evet/Hayır)
  5. Sonucu değiştiren bir kararımı hatırlıyor muyum? (Evet/Hayır)
  6. Tek cümle not
- Kayda otomatik eklenenler: zaman, seed, AI profili, ilk oynayan, sonuç, bitiş nedeni, raunt, süre, Arena/Yorgunluk görüldü mü, config özeti (`configHash`; değerler değişince kayıtlar ayrışır).

## C. Değerlendirme

- Ortalama tek başına karar vermez. Evet/Hayır cevapları ve notlar sorunun yerini gösterir:
  - "Gereğinden uzun" çoğunluktaysa → HP, Arena başlangıcı/eğrisi.
  - "İşe yaramayan kart" çoğunluktaysa → maliyet eğrisi, deste, el.
  - "Karar" puanı düşükse → kartlar arası seçim gerilimi (ör. Kalkan zamanlaması, Güç/Zayıflık).
- Sonuç Yasin üzerinden Copilot'a iletilir; ayar önerileri birlikte değerlendirilir.
- **Geçti:** eğlence medyanı ≥ 4 ve A'da bariz sorun yok → Faz 2.
- **Kaldı:** yalnız savaş düzeltilir. Sırayla denenecek kollar (her biri tek değişiklik + yeniden test):
  1. Değerler (HP, kart sayıları, Arena/Yorgunluk eğrisi) — yalnız JSON.
  2. K1 `shield.persistence = "persistent"` varyantı.
  3. K6 job temel yeteneği (2 MP) — Yasin onayıyla.
  4. Deste 12 → 16 (açık soru 2).
  5. Minion'lı model (açık soru 1) — en son, spec güncellemesi gerektirir.

## D. Sonuç

_(Yasin'in testinden sonra doldurulacak.)_
