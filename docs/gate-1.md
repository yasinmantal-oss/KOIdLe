# GATE 1 — Savaş tek başına eğlenceli mi?

> **Soru:** Warrior vs Warrior, Hero-vs-Hero kart savaşı tek başına eğlenceli mi?
> **Kural:** Gate 1 geçilmeden Faz 2'ye geçilmez. Kalırsa yalnız savaş düzeltilir.
> Değerler: `docs/savas-degerleri.md` (üretilir; tek kaynak `content/` JSON'ları).

## Nasıl oynanır

**Bilgisayar olmadan (telefon/tarayıcı):** https://claude.ai/artifact/AtdFa2bS9SCTQgmCpCiBbT
Maç sonu formu bu sayfanın kayıt deposuna (`gate1` koleksiyonu) yazılır; Claude oradan okur. İçerik değişirse sayfa `pnpm --filter @koidle/client artifact` ile yeniden üretilip aynı adrese yayınlanır.

**Yerel makinede:**

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

- 2026-10-06: Test tamamlandı (11 maç: aggressive 5, balanced 3, defensive 3). Claude analizi ve öneri: `reports/gate-1/2026-10-06-gate-1-final-raporu.md` (öneri: FAIL / ITERATE).
- **Karar (Yasin, 2026-10-06): FAIL / ITERATE.** Hero vs Hero başarısız sayılmadı; minion yok; Faz 2 yok. Copilot da aynı öneriyi verdi.
- Uygulanan iterasyon: **Combat v0.2** (`docs/combat-v0.2-oneri.md`, commit `bee48ef`). Sıradaki: **Gate 1B**.

## E. Gate 1B (Combat v0.2 testi)

- Aynı sayfa ve aynı form. Kayıtlar yeni `configHash` ile ayrışır.
- En az **6 maç**, her profile karşı en az **2**.
- Gate 1 ile karşılaştırılacaklar:
  - eğlence medyanı (Gate 1: 3; son 4 maç: 5)
  - sonucu değiştiren karar hatırlama (Gate 1: 0/11)
  - "kombo yok" ve "kartlar çabuk bitti" notları
- Ek gözlem: Yıkım elde ölü kart gibi hissettirdi mi? AI saçma oynadı mı?
- Geçme ölçütü değişmedi: eğlence medyanı ≥ 4 ve bariz sorun yok.
- **Sonuç (2026-10-06):** 8 maç (aggressive 2, balanced 4, defensive 2); protokol tamam.
  - Eğlence medyanı **5** (Gate 1: 3); karar hatırlama 3/8 (0/11); kazanma 4/8 (1/11).
  - Rapor: `reports/gate-1/2026-10-06-gate-1b-raporu.md`.
  - Claude önerisi: **CONDITIONAL PASS**. Koşullar: Kalkan Darbesi düzeltmesi ve ilk oyuncu dengesi.
  - **Karar (Yasin, 2026-10-06): CONDITIONAL PASS.** Önerilen tüm düzeltmeler kabul edildi.
  - Koşul 1, Kalkan Darbesi: **uygulandı** (`c85cac2`). Kart artık önce 4 Kalkan veriyor; sim'de oynanma %57 → %94.
  - Koşul 2, ilk oyuncu dengesi: **sim ile denendi.** K3 kapalıyken ilk oyuncu %59,1 kazanıyor (açıkken %40,2); dengesizlik ters yöne dönüyor. K3 aynen kaldı. Config ile çözülmedi. **Yasin: bilinen sorun olarak Faz 2'ye taşındı.**
  - Doğrulama (2026-10-06): 6 maç, config `9b663b36`. Eğlence medyanı 5, kazanma 3/6. Rapor: `reports/gate-1/2026-10-06-dogrulama-raporu.md`. Claude önerisi: PASS, deste/içerik bulguları Faz 2'ye girdi.
  - **KARAR (Yasin, 2026-10-06): GATE 1 PASS.** Neden: savaşın yapısı tuttu; kalan sorunlar (açılış eli, kalkan fazlası, güçlü karta kolay erişim, ilk oyuncu) 12 kartlık geçici desteye ait ve Faz 2'de zaten değişiyor. → **Faz 2 açıldı.**
