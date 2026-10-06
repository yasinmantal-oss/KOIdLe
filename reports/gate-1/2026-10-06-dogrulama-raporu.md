# Gate 1B Doğrulama Maçları — Rapor (Claude analizi)

> Tarih: 2026-10-06 · Dal: `claude/upbeat-pasteur-k7xt1j` · Config: `9b663b36` (Combat v0.2.1: Kalkan Darbesi düzeltmesi, commit `c85cac2`)
> Config hash'i güncel `content/` ile yeniden hesaplanıp doğrulandı.
> Karşılaştırma: Gate 1B (`9473c565`, 8 maç), `reports/gate-1/2026-10-06-gate-1b-raporu.md`
> **KARAR (Yasin, 2026-10-06): GATE 1 PASS.** Bu analiz sırasında kod ve değer değişmedi.

## 1. Kayıt bütünlüğü

- Depoda 25 kayıt: 11 Gate 1, 8 Gate 1B, **6 doğrulama** (`9b663b36`).
- Profil: aggressive 2, balanced 2, defensive 2. Seed'ler farklı, bozuk kayıt yok.
- Hedef 3–4 maçtı; 6 oynandı. ✅

## 2. Ham sonuçlar (saat sırasıyla)

| # | Saat (UTC) | Seed | AI | İlk | Sonuç | Raunt | Süre | Eğlence | Karar | Kart sinir | Hatırlıyor | Bitiş | Not |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 13:41 | 36270 | balanced | rakip | **kazandı** | 7 | 47 | 5 | 5 | H | H | hasar | "ÇAKTIM :d AMA KOLAY BİR KOMBO OLDU TABİ VE BAYA KISA SÜRDÜ :d" |
| 2 | 13:43 | 453235 | balanced | sen | kaybetti | 10 | 79 | 5 | 5 | H | H | Arena | "yıkım kartı çok güçlü kalkan darbesi de bir değişik olmuş hem kalkan kazan hem hasar ver biraz saçma yani" |
| 3 | 13:44 | 287965 | aggressive | sen | kaybetti | 6 | 26 | 5 | 5 | H | H | hasar | "çok kalkan kalkan oldu deck. kartları güçlerine göre sınıflandırsak ve elde etmesi ona göre zorlaşsa mı ya?" |
| 4 | 13:45 | 922400 | aggressive | rakip | **kazandı** | 6 | 28 | 5 | 1 | H | **E** | hasar | "NİYE BU KADAR KALKAN KARTI VAR VE GÜÇLÜ KARTLAR ELDE EDİLMESİ NEDEN KOLAY Kİ" |
| 5 | 13:47 | 693421 | defensive | rakip | **kazandı** | 7 | 68 | **1** | 1 | **E** | H | hasar | "ERKEN SAFHADA GELEN KARTLAR BİRAZ SAÇMA YA BUNUN DENGESİ OLMASI LAZIM" |
| 6 | 13:49 | 851319 | defensive | sen | kaybetti | 8 | 51 | **1** | 1 | H | H | hasar | "ERKEN SAFHA KARTLARI KÖTÜ." |

Süre saniye. "Gereğinden uzun" 0/6. Yorgunluk 0/6.

## 3. Karşılaştırma

| Ölçüt | Gate 1 (11) | Gate 1B (8) | Doğrulama (6) |
|---|---|---|---|
| Eğlence medyanı | 3 | 5 | **5** |
| Eğlence ortalaması | 3,0 | 4,4 | 3,7 |
| Eğlence 1 verilen maç | 5 | 1 | **2** |
| Karar hatırlama | 0/11 | 3/8 | 1/6 |
| Kazanma | 1/11 | 4/8 | 3/6 |
| İşe yaramayan kart | 3/11 | 3/8 | 1/6 |
| Raunt ortalaması | 7,7 | 9,0 | 7,3 |
| Süre ortalaması | 59 sn | 71 sn | 50 sn |
| Arena görüldü / bitirdi | 6 / 2 | 7 / 2 | 2 / 1 |

## 4. Koşulların durumu

1. **Kalkan Darbesi: mekanik olarak kapandı, his olarak yarım.** "İşe yaramıyor" notu artık yok. Yeni not (#2): "hem kalkan kazan hem hasar ver biraz saçma". Kart çalışıyor ama tek kartta iki iş okunurluğu bozuyor. Tek not, sorun sayılmaz; Faz 2 kart kimliği tasarımında ele alınmalı.
2. **İlk oyuncu: Faz 2'ye ertelendi (Yasin kararı).** İnsan verisi sim'i destekliyor: v0.2 ve sonrasında Yasin ilk oynadığı **4 maçın 4'ünü kaybetti**, ikinci oynadığı 10 maçın 7'sini kazandı. Küçük örnek, ama sim'deki %40 ile aynı yönde.

## 5. Yeni bulgular

### 5.1 Açılış eli (2 not, ikisi de eğlence 1)

Seed'den açılış elleri motorda yeniden üretildi (`createBattle`, güncel `content/`):

| # | İlk | Açılış eli (MP) | Gözlem |
|---|---|---|---|
| 5 | rakip | Kalkan Darbesi (2), Savaş Narası (2), Yarıp Geç (4), Ağır Darbe (3) | 1 MP'lik kart yok; 1. turda yalnız çekilen Hazırlık oynanabilir |
| 6 | sen | İkinci Nefes (2), Gözdağı (1), **Yıkım (6)**, Kalkan Kaldır (1) | İlk oyuncu, 1. turda çekmiyor. Tam HP'de İkinci Nefes ölü, Yıkım 6. tura kadar ölü; 1. tur seçenekleri yalnız savunma |

12 kartlık tek kopya deste, 4 kartlık başlangıç eli ve mulligan yokluğu birleşince:
- Açılış elinde Yıkım olma ihtimali **%33** (4/12).
- Hiç 1 MP'lik kart olmama ihtimali **%14** (C(8,4)/C(12,4)).
- Bu ellerde ilk 2–3 tur karar yoktur. Bu maçlarda "karar" puanı da 1.

### 5.2 Deste kompozisyonu (2 not)

- "Çok kalkan kalkan oldu deck" ve "niye bu kadar kalkan kartı var".
- Gerçekte 12 kartın 4'ü Kalkan veriyor (Kalkan Kaldır, Hazırlık, Kalkan Darbesi, Siper). İkinci Nefes ile birlikte 5/12 savunma ağırlıklı.
- Gate 1'deki P1 "savunma kartı fazlası" bulgusu hâlâ geçerli.

### 5.3 Güçlü kartlara kolay erişim / Yıkım (2 not)

- "Güçlü kartlar elde edilmesi neden kolay" ve "Yıkım çok güçlü".
- Herkes aynı 12 kartla oynuyor, her karttan bir tane var. Güçlü kartın "kazanılmış" hissi yok.
- **Yasin'in önerisi** ("kartları güce göre sınıflandırıp elde etmeyi zorlaştırmak") **kilitli bir kararla çelişiyor:** spec "Tüm job kartları baştan açık". Bu öneri ancak spec değişikliğiyle mümkün. Spec içinde kalan yol Faz 2'deki deste kurma: havuz 12'den büyük olur, güçlü kart desteye bir bedelle (ör. deste maliyet/slot sınırı) girer. Karar Yasin'de.

### 5.4 Defensive AI maçları

- v0.2'den bu yana 4 defensive maç oynandı; **3'ünde eğlence 1** (1B #5, doğrulama #5 ve #6).
- Aggressive ve balanced maçlarda eğlence 1 hiç yok (10 maç).
- Doğrulama #5 kazanılmasına rağmen eğlence 1.
- Notlar açılış elini suçluyor. Ama defensive AI'ın kalkanla oyunu uzatması kötü açılışı daha cezalandırıcı yapıyor olabilir. **Doğrulanmadı.**

### 5.5 Maçlar kısaldı

- Ortalama 7,3 raunt ve 50 sn (Gate 1B: 9,0 ve 71 sn).
- Aggressive maçları 26–28 sn sürdü.
- 2 notta "kısa sürdü". "Gereğinden uzun" hâlâ 0. Kısa bir hızlı savaş idle oyuna uygun, ama "baya kısa" + "kolay kombo" birlikte izlenmeli.

## 6. Öneri

**Gate 1: PASS öneriyorum. Bulgular Faz 2'ye zorunlu girdi olarak taşınmalı.** Nihai karar Yasin'de.

**Gerekçe:**
- `docs/gate-1.md` §C ölçütü: eğlence medyanı ≥ 4 → **5 ✅** (Gate 1B'de de 5).
- Kalkan Darbesi koşulu mekanik olarak kapandı.
- §5'teki bulguların hepsi **deste ve içerik** sorunu, savaşın yapısıyla ilgili değil:
  - açılış eli
  - kalkan fazlası
  - güçlü karta kolay erişim
- 12 kartlık tek job destesi Faz 1'in geçici aracı. Faz 2 tam olarak bunu değiştiriyor: dört job, ~40–50 kart, oyuncunun kurduğu deste.
- Bu desteyi Faz 1'de cilalamak, sonra atılacak içeriğe iş harcamak olur. Gerekçe, ilk oyuncu kararınla aynı.

**Dürüst uyarılar:**
- Ortalama eğlence 4,4 → 3,7'ye düştü; iki maç 1 aldı. Medyan tutuyor ama sinyal karışık.
- Karar hatırlama 3/8 → 1/6'ya düştü.
- 6 maç, tek oyuncu, tek oturum. Öğrenme ve yorgunluk etkisi ayrıştırılamıyor.

**Alternatif: ITERATE (bir tur daha).** En ucuz tek kol (yalnız JSON):
- açılış eli 4 → 3 ve tur başı 1 çekiş korunur, **ya da**
- bir kalkan kartını (ör. Hazırlık) saldırı kartıyla değiştirmek.

Mulligan yeni bir kavram, sadelik ilkesine ters. Önermiyorum.

**Faz 2 planına girdi olarak taşınacaklar (PASS seçilirse):**
1. Açılış eli kalitesi: deste kurma kuralları (maliyet eğrisi, en az N ucuz kart?) ya da açılış kuralı. Faz 2 sim'inde "ilk 2 turda oynanabilir kart yok" oranı ölçülür.
2. Job başına saldırı/savunma oranı. Warrior'da Kalkan veren kart oranı ≤ %25.
3. Güçlü kartların desteye girme bedeli (spec içinde: deste kurma). "Kart açma" fikri spec değişikliği gerektirir.
4. Yıkım ve tek kartta çift iş yapan kartlar (Kalkan Darbesi) kart kimliği tasarımında yeniden ele alınır.
5. İlk oyuncu dengesi (zaten ertelendi).
6. Defensive AI eşleşmesinin eğlencesi Faz 2 testlerinde ayrıca izlenir.
