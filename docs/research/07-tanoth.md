# 07 — Tanoth araştırması ve KOIdLe'ye uyarlama

> Hazırlayan: Claude (araştırma ajanı), 2026-10-07. Bu belge **arka plan araştırmasıdır**; spec (`docs/superpowers/specs/2026-10-05-koidle-prototype-v0.2.md`) ve `docs/devam-notu.md` KİLİTLİ KARARLAR ile çelişirse onlar geçerlidir.
> Etiketler: **[K]** = kaynaklı (aşağıdaki URL'lerden), **[T]** = tahmini / çıkarım / doğrulanamadı.

## 0. Kaynak durumu ve dürüst uyarı

- Tanoth Wiki (Fandom) sayfalarının hiçbiri doğrudan açılamadı (HTTP 402). Wiki bilgileri **arama motoru özetlerinden** geldi; sayı ve kuralların bir kısmı bu yüzden ikinci elden. Her kritik sayı oyunda doğrulanmadan koda girmemeli.
- Erişilebilen birincil/ikincil kaynaklar:
  - Resmî sayfa: https://gameforge.com/en-GB/play/tanoth (geliştirici/yayıncı: Gameforge, tür "Strategy") **[K]**
  - Resmî oyun içi öğretici: https://s1-en.tanoth.gameforge.com/tut/adventures **[K]**
  - Topluluk wiki (özet): https://privategameservers.com/game/tanoth/wiki ve https://privategameservers.com/game/tanoth/wiki/faq **[K]**
  - Fandom wiki (yalnız arama özeti): Adventures, Arena, Dungeon, Arcane_Circle, Arcane_Jewels, Bloodstones, Guild, Companions, Unique_Items, Merchant, Work, Alchemist sayfaları, kök: https://tanoth.fandom.com/wiki/
  - Tanıtım: https://newrpg.com/browser-games/tanoth/ (oyun şu an "OFFLINE" etiketli; 2024 yorumunda "rebirth" geçiyor) **[K]**
  - İnceleme (eleştirel): https://supermouse.livejournal.com/107030.html **[K]**
- **Geliştirici/yayıncı:** Gameforge **[K]**. "Fantasy Ventures" bağlantısı doğrulanamadı **[T: yanlış olabilir, kullanma]**. Çıkış yılı kaynaklarda çelişkili (2008 / 2010) **[K, çelişkili]**.
- **Sınırlama:** Düello hesabı (hasar formülü, tur sayısı, blok/kritik oranları), seviye eğrisi, seviye tavanı, sohbet ve sıralama ayrıntıları kaynaklardan çıkarılamadı. Aşağıda **[T]** ile işaretlendi.

## 1. Çekirdek döngü: Maceralar

- Oyun, "günde 5 macera" etrafında kurulu; ana hedef bu **[K]** (resmî öğretici, newrpg, wiki giriş).
- Her macera yaklaşık **10–20 dakika** sürer, **XP + altın** verir **[K]** (privategameservers wiki).
- Oyuncu her seferinde **3 macera arasından** seçer; her biri altın, XP ve süre gösterir. Öğretici: "en kısa sürede en çok altın ve şöhreti nerede kazanırsın?" **[K]** (öğretici, LiveJournal incelemesi).
- Her macerada **savaş olasılığı (%)** ve **zorluk** vardır; savaş çıkarsa kazanmak zorundasın, **kazanmazsan ödül yok** **[K]** (Fandom Adventures özeti). Yani risk = "ödülü kaybetme"; ceza (altın kaybı) macera için belirtilmemiş **[T]**.
- Item düşme şansı **savaş olasılığına bağlı**, zorluğa değil: riskli macera = daha iyi drop **[K]** (Fandom özeti).
- Topluluk tavsiyesi: "en yüksek XP'li macerayı seç; çok zor olanı yalnız savaş şansı %50'ye düşüyorsa seç" **[K]** (FAQ).
- **Günlük sınır:** 5 ücretsiz macera; fazlası premium para (Bloodstone) ile **sınırsız** satın alınabilir **[K]** (öğretici). Fandom özeti "10 ücretsiz, Arcane Circle'da +5/seviye" diyor; bu muhtemelen güncel/özel sunucu sürümü **[K, çelişkili]**.
- **Bekleme sırasında oyuncu ne yapar?** Hiçbir şey: macera veya iş sürerken **savaş gibi diğer aktiviteler kilitli** (iptal edilebilir) **[K]** (öğretici). Ekranda ilerleme çubuğu bekler, sonuç sonra açılır **[K]** (LiveJournal).
- Diğer XP kaynakları (sonradan eklenmiş): düello, **iş (Work)**, zindan (Dungeon), Illusion Mağarası **[K]** (newrpg, FAQ). İş ödülü iş **tamamlanınca** verilir; seviye yükseldikçe altın artar **[K]** (Fandom Work özeti).
- Günlük rutin: "Illusion Dungeon ve normal Dungeon her gün yapılmalı" **[K]** (FAQ). newrpg: "çok vakit istemez, girip günlük işleri bitirirsin" **[K]**.

## 2. Savaş

- **Çözüm:** Oyuncu girdisi yok. Savaş başlatılır, bekleme çubuğu dolar, sonuç gösterilir **[K]** (LiveJournal). Yani statlara göre otomatik.
- **Statlar:** 4 öznitelik **[K]**:
  - Strength = fiziksel hasar; Dexterity = ardışık vuruş sayısı ve kritik hasar alt sınırı; Constitution = can; Intelligence = kimin önce vurduğunu belirler (rakip daha yüksek seviyedeyse INT'ten bağımsız önce vurur) **[K]** (Fandom özeti, arama).
  - Dungeon'da INT, canavar seviyesine göre gelen hasarı da azaltır; DEX blok şansını artırmaz **[K]** (FAQ).
- Blok ve kritik yüzde olarak toplanır (ör. %28 blok + %2 çember = %30) **[K]** (FAQ). Çıktı rastgeleliği var **[T: blok/kritik şansı nedeniyle]**.
- "PvP'de genelde en iyi toplam statlı kazanır" **[K]**. Hesaplama oyuncu kararından çok **hazırlık** (stat/ekipman) meselesi.
- **PvP (Arena/düello):** diğer oyunculara saldırılır; kazanan altın, XP ve **şöhret (fame)** alır, kaybeden fame ve altın kaybeder **[K]** (Fandom Arena özeti, LiveJournal).
  - Her PvP sonrası **15 dk bekleme**; 1 Bloodstone ile atlanabilir **[K]**.
  - **Üzerinde taşıdığın altın çalınabilir:** büyük miktar taşımak risk **[K]**. Lonca hazinesi (Treasury) altının bir kısmını korur: rank başına +200 altın, azami 10.000; ilk yükseltme 500 altın, sonrakiler +500 **[K]**.
  - Kendi seviyenden rakiplerle (even level) dövüşmek fame için teşvik edilir **[K]** (Guild araması). Koruma/yeni oyuncu kalkanı **[T: belirtilmemiş]**.
- **Dungeon:** kat kat ilerlenir; her katta %50 altın, %50 bir Epic item. Kat 15–52: T1, 51–77: T2, 78–100: T3 Epic (her biri ~%25); Kat 100'den sonra **Shadow Dungeon** günlük denenebilir, orada T4 Epic ve Arcane Jewel şansı **[K]** (Fandom Dungeon özeti). Drop **zindan seviyesine** bağlı, karakter seviyesine değil **[K]** (FAQ).
- **Companion (yoldaş):** seviye 15/30/50'de ek slot; yalnız Dungeon ve Illusion'da savaşır, macera ve PvP'de yok **[K]** (FAQ).
- **Circle'lar** savaş alanı değil, **kalıcı güçlenme ağacı** (bkz. §4).

## 3. Karakter

- Oyuncu bir **kahraman seçer** (portre/ırk-sınıf ayrımı ayrıntısı bulunamadı) **[K: "choose a hero" wiki girişi]**, ayrıntı **[T]**.
- **Sınıf sistemi yok gibi:** 4 stat (STR, DEX, CON, INT) tek havuzda; "dengeli 1:1:1:1 yükselt" önerisi sınıf farkının zayıf olduğunu gösteriyor **[K, çıkarım T]**.
- Statlar **altın + kalıcı stat iksiri (Alchemist)** ile yükseltilir **[K]** (Fandom Character özeti). Seviye eğrisi ve tavan **[T: bulunamadı]**.
- Unvan sistemi bulunamadı **[T]**; Hall of Fame sıralaması fame'e göre **[K]** (Guild araması).

## 4. Eşyalar

- Normal item'lar affix'li (tek stat veya stat kombinasyonu), Merchant'tan **altınla**; özel item'lar **Bloodstone** ile **[K]** (Fandom Normal Items, Merchant). Seviye arttıkça tüccar daha iyi eşya sunar **[K]** (wiki giriş).
- **Rarity:** Normal → Unique → **Epic (T1–T4)**; Epic'ler müzayede ile, başlangıç teklifi ~15–40 Bloodstone (tier'a göre), FAQ'da 25 altınlık başlangıç da geçiyor **[K, çelişkili]**.
- **Slotlar:** silah, gövde zırhı vb. **[K: Unique Items "weapons and chest armor"]**; tam slot listesi **[T]**.
- **Yükseltme:**
  - **Arcane Jewels:** 7 mücevher (6'sı özel haritalar/Shadow Dungeon'dan, 1'i Alchemist'ten); her eşyaya **4'e kadar** yerleştirilir; kombo bonusları: Monochrome (4 aynı renk, +%25), Yin-Yang (2 siyah + 2 beyaz, +%50), İki Renkli (+%25) **[K]**.
  - **Arcane Circle:** Outer Circle taşları (rafine derece başına maliyet 15 altın veya 1 Bloodstone, her derece +5 / +1) ve Inner Circle rünleri (150 altın veya 10 Bloodstone, her derece +50 / +5). Rün yükseltmek için bitişik 2 dış taşın 10'un katı olması gerekir **[K]**. Rünler: +%0,5/derece, 100. derecede +%50 (STR/DEX/CON/INT) ve "Glory" ile macera drop yüzdesi +%1/derece **[K]**.
  - Demon Skull (macera sınırını artıran dal): seviye 10'a toplam ~26.625.000 altın **[K]** (arama özeti). Bu bir **uzun vadeli altın çukuru**.
- **Envanter yönetimi:** Alchemist'te "beğenmediysen 1 Bloodstone ile yeni set" **[K]**; ayrıntılı envanter/çanta kuralı **[T]**.
- Hesaplar arası item transferi yok **[K]** (newrpg).

## 5. Ekonomi

- **Altın:** ana para; macera, iş, düello, zindan; harcama: tüccar, rün/taş yükseltme, stat, lonca. Çalınabilir (PvP) **[K]**.
- **Bloodstone:** premium; gerçek parayla alınır, yeni oyuncuya 15 hediye **[K]** (LiveJournal). Kullanımı: **ekstra macera, ekstra düello, bekleme atlama, binek (Fire Horse: 10.000 altın + 120 Bloodstone), özel item, Alchemist yenileme, lonca yükseltmesi bağışı** **[K]**.
- **Sinks:** rün/taş maliyetleri (doğrusal artan), Demon Skull, lonca yapıları, tüccar **[K]**.
- **Ticaret:** oyuncudan oyuncuya serbest takas yok gibi (hesap arası transfer yok); Epic müzayedesi var **[K]**, oyuncu pazarı ayrıntısı **[T]**.

## 6. Sosyal

- **Lonca:** lider, üyelerin bağışladığı altın/Bloodstone ile yapıları yükseltir (Treasury dahil); lonca seviyesi toplam fame'e göre; Hall of Fame'de lonca aranır **[K]**.
- **Sıralama:** Hall of Fame (fame) **[K]**.
- **Sohbet:** forum ve IRC ayrı kayıt (LiveJournal eleştirisi), oyun içi sohbet ayrıntısı **[T]**.

## 7. Neden bağımlılık yaptı / şikâyetler

- **Ritim [K+T]:** Sabah 5 macerayı sıraya diz, arada 15 dk düello, akşam zindan. "Çıkıp kapanma" döngüsü; sınırlı günlük bütçe **eksiklik hissi değil tamamlama hissi** verir. Bekleme dolarken oyunda yapacak şey yok, oyuncu dışarı çıkar ve **geri dönmek için sebebi olur** (süre dolması).
- **Seçim gerilimi [K]:** 3 maceradan hangisi (süre / XP / savaş riski), risk ile drop'un bağlanması.
- **Ücretsiz-ücretli dengesi [K]:** Sınırın premium para ile aşılması, **aşırı oynamayı** ücretli kılıyor; ücretsiz oyuncu sınırlandırılmış ama yetişebiliyor.
- **Şikâyetler [K]:** "Oyunu yürüten her şey metin" ve "para kazanma makinesi" (LiveJournal); premium binekler macera süresini anlamlı kısaltmıyor; sertifika/kayıt sorunları. Oyuncu yorumu: güncellemeler seyrek ama mekanikler dengeli (newrpg) **[K]**.
- **Çıkarım [T]:** Uzun vadede rün/Demon Skull gibi milyonluk altın çukurları, aktif oyuncuyu bile "bitmeyen ızgara" ile yoruyor; PvP'de en iyi statlı kazandığı için yeni oyuncu için düello cazibesi düşük.

## 8. KOIdLe'ye uyarlama

### 8.1 Tablo

| Tanoth sistemi | KOIdLe karşılığı | Karar | Neden / çatışma |
|---|---|---|---|
| Günde 5 macera, ücretsiz | Günlük **farm hakkı** (bkz. 8.2) | **Uyarla** | Yasin'in isteği. **ÇAKIŞMA:** spec ÇIKSIN listesinde "dayanıklılık/Sefer" var ve "prototip bitmeden ÇIKSIN sistemleri önerilmez" kuralı geçerli. Yalnız Yasin açıkça onaylarsa, mevcut farm slotunun parametresi olarak (yeni sistem değil) |
| Macera süresi 10–20 dk, bekleme çubuğu | Slot süresi (farm 2–8 saat vb.) AFK | **Al** | Zaten AFK farm var; fark: Tanoth'ta oyuncu bekleme sırasında hiçbir şey yapamıyor, KOIdLe'de slot kapasitesi 6 ve oyuncu başka slota/kasabaya gidebiliyor |
| 3 macera arasından seçim (XP/süre/risk) | Slot seçimi (süre × risk × drop) | **Uyarla** | Zaten "slot" kavramı var; ek: her slotta sabit süre/risk/drop profili |
| Savaş olasılığı = drop kalitesi | Slot riski = ganimet kalitesi | **Al** | CZ'de risk ile ganimet bağlı; zaten Farm·Loot·Risk sütunları ile örtüşüyor |
| Savaş olursa kazanmazsan ödül yok | Farm sırasında baskın kaybı = taşınan ganimet kaybı | **Uyarla** | Tanoth'ta ceza=ödül yok; KOIdLe'de ceza=taşınan ganimet (Carried Loot) kaybı, **EXP risk dışı** (kilitli). Kendi kural setine sadık kal |
| Otomatik stat savaşı (INT, STR, DEX, CON) | **Kart savaşı** (HP+Power, 12 kart) | **Alma** | **ÇAKIŞMA:** KOIdLe kart savaşı, "stat otomatik" değil. Tanoth savaşı bekle-ve-gör; bizde oyuncu karar veriyor |
| 4 statlı karakter | HP + Power (iki stat) | **Alma** | Sadelik; kilitli karar |
| Blok/kritik/ıskalama yüzdeleri | Yok | **Alma** | **ÇAKIŞMA:** "Çıktı rastgeleliği yok" kilitli |
| PvP'de altın çalınır, 15 dk cooldown | Baskın: karşı ulus, taşınan ganimet çalınır, equipped asla | **Uyarla** | Cooldown fikri iyi (spam'i keser). **ÇAKIŞMA:** KOIdLe'de PvP karşı ulusa, saldıran da CZ'de olmalı; ek olarak "baskın kalkanı" var. Tanoth'taki "çalınan altın" ≈ bizim Carried Loot |
| Fame (şöhret) kazan/kaybet | Lig/sezon yok | **Alma** | **ÇAKIŞMA:** "Lig ve sezon yok" kilitli; ilk prototipte sıralama yok |
| Lonca hazinesi (altın koruması) | Yok | **Alma** | **ÇAKIŞMA:** klan ÇIKSIN listesinde. Yerine Kasaba'ya dönüş = güvenceye alma (zaten var) |
| Dungeon katları, günlük sıfırlama | PvE: normal + elit + 1 boss | **Uyarla** | Günlük "boss denemesi" fikri düşünülebilir; kat-kat zindan **Alma** (kapsam) |
| Companion | Yok | **Alma** | Kapsam |
| İş (Work): bekle, bittiğinde para | Farm slotu (zaten aynısı) | **Al** (zaten var) | Ayrı "iş" gerekmez |
| Epic tier'ları T1–T4 | Common/Magic/Rare/Unique | **Alma** | Mevcut rarity yeterli |
| Mücevher (4 yuva, kombo) | Yok; upgrade +0→+8 | **Alma** | Yeni sistem; kilitli upgrade kuralı (yalnız altın, Örs Isısı pity) |
| Arcane Circle (kalıcı rün ağacı) | Yok | **Alma** | Milyonluk altın çukuru, sade kalma ilkesine ters; "+9/+10, set bonusu" ÇIKSIN'da |
| Bloodstone (premium para) | Yok | **Alma** | **ÇAKIŞMA:** "tek para Altın, premium yok" kilitli; premium/Mühür ÇIKSIN |
| Limiti para ile aşmak | Yok | **Alma** | Aynı çakışma. Farm limiti yalnız altın/oyun içi yolla esner (bkz. 8.2) |
| Lonca bağışı | Yok | **Alma** | Klan ÇIKSIN |
| Hall of Fame | Yok | **Alma (şimdilik)** | Sezon/lig yok; Faz 5+ düşünülür |
| Tüccar: altınla normal, Bloodstone'la özel | Merchant: listele/sat, ilan offline açık | **Uyarla** | Yalnız altın; mevcut Merchant korunur |
| Alchemist yenileme (1 Bloodstone) | Yok | **Alma** | Premium yok |
| Hesaplar arası transfer yok | Tek hesap | **Al (zaten)** | — |

### 8.2 Günlük farm limiti: somut öneri (başlangıç değerleri)

> **ÖNEMLİ ÇAKIŞMA:** spec ÇIKSIN listesinde "dayanıklılık" ve "Sefer" var; "prototip bitmeden ÇIKSIN sistemi önerilmez, spec'e geri eklenmez" kuralı geçerli. Aşağıdaki öneri **Yasin'in açık onayı** ile (spec değişikliği olarak) ele alınır; mevcut sistemlerin yalnız **bir parametresi** olacak şekilde tasarlandı (yeni para yok, yeni ekran yok).

**Tanoth'tan alınan ders:** sınır "oyundan kovma" değil **ritim** kurar: sabit bütçe + seçim + dönüş sebebi. KOIdLe zaten AFK olduğu için sınırın amacı farklı: "farm çok hızlı olmasın", yani **ödül akışını zamanla sınırlamak**. İki uygulanabilir şekil:

**Seçenek A (önerilen, en hafif): "Günlük Sefer Hakkı" = slot başlatma sayısı**
- Günde **5** farm başlatma hakkı (Tanoth'taki 5 ile aynı his). Her başlatma bir slotu doldurur; bitince ganimet taşınır.
- Slot süresi: **kısa 30 dk / orta 2 sa / uzun 6 sa**; uzun slot daha iyi drop + daha yüksek baskın riski.
- Haklar gece **04:00**'te yenilenir; biriken hak **yok** (en fazla 5; bu, "sabah/akşam" ritmi yaratır).
- Hak, **kasabaya dönmeden** başlatılan slotta da harcanır; baskınla ganimet kaybı hak iade etmez (risk).
- Esneme (premium yok): **altınla hak satın alma** yok; bunun yerine "seviye atlayınca +1 hak" (level yeni slotları açar kuralıyla uyumlu), üst sınır 8.

**Seçenek B: "Günlük Süre Bütçesi"** (AFK'ye daha uygun)
- Günde toplam **12 saat** farm süresi (6 slotun toplamı değil, oyuncunun toplamı). Bütçe bitince yeni slot başlamaz; çalışan slot bitebilir.
- Avantaj: oyuncu 5 değil 1 uzun slotu da seçebilir; dezavantaj: AFK oyuncu için "bütçeyi nasıl harcarım" sayı matematiği.

**Başlangıç sayıları (A):** hak 5/gün; seviye başına +1 (üst 8); süreler 30 dk / 2 sa / 6 sa; ödül çarpanı 1× / 1,3× / 1,8× (artan risk); baskın riski yalnız **taşınırken** (yükselen ganimet = yükselen risk). Hepsi `content/` JSON'unda olmalı, kodda sabit değil.

**Alternatif ve en az sistemli yol (limitsiz):** sınır koymadan **azalan verim**: aynı slotta aynı gün 3. farmdan sonra ödül %50, 5.'den sonra %25. "Hak" sayacı gerektirmez; sayfaya tek sayı eklenir. Tanoth'tan farkı: sert tavan yok.

### 8.3 Yasin'in sorusu: "Düelloda kuşandığımız eşyaların önemi olacak mı, yoksa sadece farmda mı?"

**Tanoth gerçeği [K]:** Düello otomatik stat karşılaştırması olduğu için ekipman **her şeydir**: "en iyi toplam statlı kazanır". Sonuç: yeni oyuncu veteranla düello edemez; çözüm olarak "aynı seviye rakip" ve cooldown. Ekipman = tek belirleyici.

**KOIdLe'deki durum (kilitli kararlar):** CZ'de gear geçerli; **Quick Duel normalize edilir ama item kart-efektleri taşınır**; item desteye kart **eklemez**, mevcut kartın davranışını değiştirir; "equipped item asla çalınmaz".

**Öneri (kısa cevap): Evet önemli olsun, ama iki katmanda, ve sayısal güç değil "kart davranışı" olarak:**
1. **CZ baskınında/PvP'de (gerçek risk bölgesi):** gear tam geçerli: HP+Power (stat) **ve** kart davranış değişiklikleri. Gear = ödül, riskin karşılığı. Tanoth dersi: gear tek belirleyici olursa denge çöker, o yüzden **stat bonusunu tavanla** (ör. HP+Power toplam bonus ≤ taban değerin %30'u) ve asıl gücü kart davranışına ver.
2. **Quick Duel (risksiz, sosyal/pratik):** normalize: HP ve Power herkeste eşit, **ama itemin kart davranışı taşınır** (spec kararı). Böylece eşya "yalnız farmda faydalı" olmaz, duelloda da **oyun tarzını** değiştirir, ama güç farkı yaratmaz. Yeni oyuncu ile veteran adil dövüşür.
3. **Neden böyle:** (a) Tanoth gibi tek-stat belirleyici olursa kart savaşının "karar" değeri ölür (Gate 1'de aranan şey bu); (b) item kart davranışı değiştirdiği için oyuncu **ekipmanı seçerken deste planını** düşünür, bu hem item'ı anlamlı hem savaşı eğlenceli kılar; (c) normalizasyon, Quick Duel'in "hemen oyna" cazibesini korur.
4. **Risk [T]:** Item davranış değişiklikleri kombo patlaması yaratabilir (Faz 2 sim matrisi 5×5 %40–60 sağlıyor; item'larla ayrı sim gerekir). Faz 3'te item başına en fazla 1 davranış değişikliği, ve sim'de item'lı/item'sız fark ≤ %5 hedef.

## 9. Yasin'e sorular (en çok 5)

1. **Günlük sınır** ÇIKSIN listesindeki "dayanıklılık/Sefer" ile çakışıyor: prototipte **yalnız parametre olarak (Seçenek A: 5 hak/gün)** mi eklenecek, yoksa sade "azalan verim" (sayaçsız) mi, yoksa **tamamen Faz 3 sonrasına** mı bırakalım?
2. Farm sınırı **hak sayısı** mı (5 başlatma/gün, Tanoth hissi) yoksa **toplam süre bütçesi** mi (12 saat/gün) olsun?
3. **Düello item kuralı:** önerilen model (CZ'de gear tam + tavanlı stat, Quick Duel normalize + item kart efekti taşınır) uygun mu, yoksa Quick Duel'de de item hiç etkisiz mi olsun?
4. Tanoth'taki **15 dk düello bekleme** fikri baskına uyarlanabilir (aynı oyuncuya X dakika tekrar saldıramazsın); ekleyelim mi (spec'te baskın kalkanı var, ayrı bir "saldırı bekleme" ister mi)?
5. Seviye başına +1 günlük hak (üst 8) gibi **ilerlemeye bağlı genişleme** istiyor musun, yoksa herkes için sabit mi olsun?

## 10. Notlar

- Tanoth'a özgü isimler (Bloodstone, Arcane Circle, Demon Skull, Tarabat, Aris vb.) yalnız bu araştırmada geçer; oyunda kullanılmaz. KO isimleri de kullanılmaz.
- Doğrulama önerisi: Tanoth hâlâ erişilebilirse (rebirth) 5 macera + 1 düello oynanıp süre/oran sayıları teyit edilmeli.
