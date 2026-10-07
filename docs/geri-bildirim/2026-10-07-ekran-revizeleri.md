# Ekran Revizeleri — Yasin geri bildirimi (2026-10-07)

> Kaynak: Yasin'in `design/mockups/ekranlar-v0.1.html` ve savaş sayfası üzerine notları.
> Mockup referanstır; bu notlar ilgili faz başladığında o fazın tasarımına **zorunlu girdi** olur.
> Faz 3+ ekranları Gate 2 PASS olmadan kodlanmaz (kapsam kuralı). Düello notları şimdiki fazda uygulanıyor.
> Tanoth araştırması (`docs/research/07-tanoth.md`) farm/CZ çekirdeğini değiştirebilir; aşağıdaki "Sınır" ve "Farm" maddeleri o raporla birlikte karara bağlanır.

## Şimdi uygulanan (Faz 2, savaş/düello ekranı)
| Not | Durum |
|---|---|
| Karakter ikonu görünmüyor | Arketip amblemi (özgün SVG) iki kahraman panelinde |
| Deste görünmüyor | "Destem" paneli: elde / destede (kalan) / ıskartada |
| Seçimden vazgeçme, geri çekme yok | Kart önce seçilir, "Oyna" ile onaylanır; "Vazgeç" var. Oynanabilir kart varken Turu Bitir onay ister |
| Efektler daha vurucu olmalı | Büyük hasar sayıları, kenar flaşı, kart uçuşu, güçlü sarsıntı |
| Ses efektleri | WebAudio ile sentezlenmiş kısa sesler, sessize alma düğmesi |
| El/deste/ıskarta/yorgunluk ne demek yazmalı (mobil dahil) | Masaüstünde üstüne gelince, mobilde dokununca açıklama |
| **Arena Çöküşü olmamalı** | Kaldırıldı (config ile kapalı). Bitirici Yorgunluk. Karar değişikliği devam notunda |

## Yasin kararı olarak kaydedilen (ilgili fazda uygulanır)
- **Örs → Anvil.** "Örse vur" yerine **"Yükselt"** (upgrade'in karşılığı).
- **Tezgah:** kuşanılı eşya tezgaha konamaz.
- **Item sınıf kısıtı:** her job her eşyayı giyemez (Rogue balta giyemez). Eşyalarda job kısıtı olacak.
- **Çanta:** otomatik düzenle + filtre (nadirlik, güç vb.).
- **Karakter:** sol üstte; bilgileri, seçilebilir profil resmi, job'a göre seçilebilir unvan.
- **Görsel:** arkada uçuşan noktacıklar kalkar ("çok yapay").
- **Kart ve item görselleri:** Knight Online ikonlarının KOIdLe dünyasına uyarlanmış, **özgün** çizimleri (KO varlığı kopyalanmaz). Görsel paket fazında (K4/Faz 9).

## Açık tasarım soruları (karar Yasin'de; Tanoth raporu öneri getirecek)
1. **Düelloda eşyanın önemi:** Spec'te CZ'de gear geçerli, Quick Duel normalize (item kart efektleri taşınır). Yasin'in sorusu: "Sadece farmda mı önemli? Baskında kuşandığımız şeylerin ne önemi var?" → eşya ↔ savaş bağlantısı Faz 3 tasarımında netleşmeli.
2. **Farm hızı ve günlük sınır:** "Farm bu kadar hızlı olmamalı", Tanoth gibi günlük farma çıkma sınırı.
3. **Sınır (CZ) haritası:** bölge başına kaç kişi farm atıyor, slot yoğunluğu, KS var mı / slot sınırının altında mı üstünde mi, düşmanların farm attığı yerler ve saldırılabilecek alanlar görünmeli; harita kaydırılarak bölgeler arasında geçilebilmeli.

## Ekran bazında notlar (mockup'a göre)
- **Kasaba:** çok boş. Başkalarının tezgahları görülebilmeli. NPC'ler ve ek içerik; "zenginleştirilmeli".
- **Sınır:** beğenildi; yukarıdaki yoğunluk/KS/düşman bilgileri eksik. Item adları üstüne gelince görünmüyor.
- **Farm başlangıcı:** tasarım hoş, içerik boş; çok hızlı ilerliyor.
- **Kazanma / kaybetme ekranları:** geliştirilmeli.
- **Anvil:** işlev yeterli; yalnız buton metni.
- **Karakter ekranı:** karakter tasarımı yok; sınıf kısıtı yok.
