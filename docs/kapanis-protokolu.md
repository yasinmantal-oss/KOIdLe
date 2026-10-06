# KOIdLe — Oturum Kapanış / Senkronizasyon Protokolü

> Yasin'in kararı, 2026-10-06. Her çalışma oturumunun sonunda uygulanır.
> **Amaç:** GitHub, proje dokümantasyonu ve kişisel KOIdLe Vault kaydı birbirinden kopmasın. Hiçbir karar yalnız sohbet geçmişinde kalmasın.

## 1. Durumu doğrula
Şunları kontrol et:
- aktif branch, son commit, `git status`
- bugün yapılanlar ve değişen dosyalar
- yeni ve değiştirilen kararlar
- test ve sim sonuçları
- Gate durumu
- açık ve ertelenen konular
- sıradaki kesin görev

Sohbette konuşulup repo'ya geçmemiş karar varsa tespit et.

## 2. GitHub proje hafızasını güncelle
Gerekliyse şunları gerçek duruma göre güncelle: `docs/devam-notu.md`, `CLAUDE.md`, ilgili spec, plan, Gate ve rapor dosyaları. Gereksiz yere dosya değiştirme.

`docs/devam-notu.md`, sohbet geçmişi olmadan yeni bir oturuma yetmeli. En az şu başlıkları içerir:
- MEVCUT DURUM (faz, Gate, tamamlanan/tamamlanmayan)
- KİLİTLİ KARARLAR
- BUGÜN ALINAN KARARLAR (gerekçeyle)
- DEĞİŞTİRİLEN KARARLAR (eski → yeni → neden)
- TEST / SİMÜLASYON (ve henüz çıkarılmaması gereken sonuçlar)
- AÇIK KONULAR
- SCOPE DIŞI
- SIRADAKİ ADIM

## 3. Source of truth sırası
Çelişkide şu sırayla geçerlidir:
1. Onaylı Prototype Spec ve açık Yasin kararları
2. Uygulama planı
3. `content/` ve config
4. Test, sim ve raporlar
5. `docs/devam-notu.md`
6. Vault özeti
7. Eski sohbet mesajları

Vault proje günlüğüdür, source of truth değildir. Çelişkiyi sessizce çözme, kapanış raporunda yaz.

## 4. Vault senkronizasyonu
Dosya: `C:/Users/muham/.gemini/antigravity/scratch/100-Projeler/KOIdLe/KOIdLe_Proje_Karti.md`

**Erişim varsa:**
- Önce oku.
- Körlemesine silme, tarihçeyi koru.
- Çelişen eski bilgiyi düzelt.
- Aynı bilgiyi tekrar tekrar ekleme.

**Erişim yoksa:**
- "Güncellendi" deme.
- `=== VAULT'A EKLENECEK / GÜNCELLENECEK BLOK ===` başlıklı, kendi başına anlaşılır bir blok ver. İçinde şunlar olsun:
  - tarih, faz, Gate, branch, son commit
  - tamamlananlar, teknik durum
  - kilitli kararlar, yeni kararlar, değişen kararlar
  - test ve sim sonuçları
  - riskler, doğrulanmamış hipotezler
  - yapılmayacaklar
  - sıradaki görev, yeni oturum talimatı

Kararların **nedenleri** de kısa yazılır. Örnek: "Kalkan sahibinin sonraki tur başında sıfırlanır; amaç savunmayı sınırsız stok yerine timing kararına dönüştürmek."

## 5. Karar geçmişini koru
Değişen kararda eskisini görünmez yapma, şu formatla yaz:
- ÖNCE: …
- SONRA: …
- NEDEN: …

Özellikle şu alanlarda: combat, progression, item/equipment, upgrade, CZ, economy, visual direction, architecture, scope.

## 6. Kapsam koruması
KALSIN / SADELEŞSİN / ÇIKSIN kararlarını gözet. Prototip dışı bir konu konuşulduysa bile backlog'a veya sıradaki göreve ekleme. Gate geçmeden sonraki faz başlamış sayılmaz: **Gate 1 PASS olmadan Faz 2 yok.**

## 7. Git kapanışı
- `git diff`'i gözden geçir, geçici dosya kalmasın.
- Kod değiştiyse testleri çalıştır. Docs-only değişikliği açıkça belirt.
- Commit at, aktif Claude dalına push et, working tree'nin temiz olduğunu doğrula.
- `master`'a kendiliğinden merge etme. PR durumunu bildir; merge kararı Yasin'de.

## 8. Kapanış raporu şablonu
```
========== KOIdLe OTURUM KAPANIŞI ==========
TARİH:
BRANCH:
SON COMMIT: hash + mesaj
GIT DURUMU: Clean / değilse neden?
BUGÜN TAMAMLANANLAR:
ALINAN YENİ KARARLAR:
DEĞİŞTİRİLEN ESKİ KARARLAR:
TESTLER:
SİMÜLASYON:
MEVCUT FAZ:
MEVCUT GATE:
GATE DURUMU: PASS / FAIL / PENDING
AÇIK RİSKLER:
ERTELENEN / SCOPE DIŞI:
GITHUB DOKÜMANTASYONU:
VAULT: Doğrudan güncellendi / erişilemedi, blok hazırlandı
PR DURUMU:
MASTER DURUMU:
SIRADAKİ TEK GÖREV:
YENİ OTURUM BAŞLANGIÇ MESAJI: "…"
=============================================
```
Vault'a erişilemediyse ardından `=== VAULT'A EKLENECEK / GÜNCELLENECEK BLOK === … === BLOK SONU ===` verilir.

## 9. Self-check
Kapanmadan önce kontrol et:
- Bir karar yalnız sohbette kaldı mı?
- Doküman gerçekle uyuşuyor mu?
- Devam notu yeni bir oturuma yetiyor mu?
- Vault GitHub ile çelişiyor mu?
- Geçersiz bir karar hâlâ aktif görünüyor mu?
- Gate durumu doğru mu?
- Sıradaki görev tek ve net mi?
- Scope dışı bir şey sıraya girdi mi?
- Working tree temiz mi?
- Push gerçekten gerçekleşti mi?

Eksik varsa kapanmadan önce düzelt.
