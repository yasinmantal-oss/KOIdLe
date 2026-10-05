# 04 — Ekonomi Tasarımı Araştırması

**Proje:** Knight Online esintili, Hearthstone tarzı F2P kart savaş oyunu (mobil + PC)
**Kapsam:** Item/altın yutakları (sink), düşürmeli (downgrade) upgrade sistemi, oyuncu pazarı, takas edilebilir premium para, anti-RMT/bot/dupe, enflasyon izleme, mağaza ve hukuk
**Tarih:** Ekim 2026
**Kesinleşmiş kararlar:** Başarısız upgrade item'ı yakmaz, seviyesini düşürür. Güç satılmaz; premium para oyun içinde altına çevrilebilir.

> Not: Rakamlar ve oranlar bir başlangıç noktasıdır. Kapalı beta telemetrisiyle ayarlanmalıdır. Simülasyon sonuçları 20.000–30.000 koşuluk Monte Carlo ile elde edildi (Python, ekip içinde yeniden üretilebilir).

---

## Özet

1. **Yakılma (burn) kalktığı için ekonominin ana item yutağı da kalktı.** KO'da +7 ve üstü denemelerde item'ın yanması hem item arzını hem de piyasadaki "parlak" item sayısını sınırlıyordu. Bunun yerine birden fazla küçük yutak kurmak gerekiyor: **(a)** her denemede yok olan parşömen/malzeme ve altın ücreti, **(b)** item'ı malzemeye çeviren parçalama (salvage), **(c)** item tüketen üretim (crafting), **(d)** dayanıklılık ve tamir, **(e)** pazar vergisi ve ilan ücreti, **(f)** üst kademe item'larda sınırlı ticaret hakkı (birkaç el değiştirdikten sonra hesaba bağlanma). Old School RuneScape'in vergiyle beslenen otomatik item yutağı (vergiyle toplanan altınla değerli item'ları satın alıp oyundan silen sistem) da ileride kullanılabilecek bir seçenek.
2. **Upgrade:** +1 ile +5 arası başarısızlıkta düşmez. +6 ile +10 arası başarısızlıkta 1 seviye düşer. Acıma (pity) mekanizması üç katmandan oluşur: Lost Ark'taki Artisan's Energy benzeri bir **Örs Enerjisi**, art arda başarısızlıkta oranı artıran **Isınma** ve MapleStory'deki Chance Time'a benzeyen, iki ardışık düşüşten sonra garanti başarı veren **Şans Anı**. Önerilen tabloyla +0'dan +10'a ortalama yaklaşık 70 deneme gerekiyor (p99 ≈ 164). "Örs gerilimi" hissedilir ama sonsuz sürmez.
3. **Hukuk:** Upgrade malzemeleri dolaylı olarak bile parayla alınabiliyorsa, Güney Kore'nin Mart 2024'te yürürlüğe giren yasası bunu açıkça kapsıyor ("güçlendirme tipi olasılıklı item"). Oranlar oyun içinde ve sitede yayınlanmalı, pity kuralları dahil eksiksiz açıklanmalı. Nexon'un MapleStory küp oranlarını gizlice değiştirdiği için 11,6 milyar won ceza alması bunun ne kadar ciddi olduğunu gösteriyor. **Mağazada rastgele hiçbir şey satılmamalı.**
4. **Pazar:** Hibrit model öneriyoruz. Moradon tarzı **tezgâhlar** (çevrimdışıyken de açık kalır) ve tüm tezgâhları tarayan küresel bir **arama/fiyat defteri** olacak. Tezgâha giderek alım yapmak ucuz, uzaktan alım ise ek ücretli. Bu yapı hem sosyal kültürü hem fiyat keşfini korur.
5. **Premium para:** WoW Token / EVE PLEX / OSRS Bond modeline benzer, tek kullanımlık bir **"Kraliyet Mührü"** öneriyoruz. Fiyatı resmi borsada algoritmayla belirlenir, işlemde %10 altın yakılır, tek yönlüdür (gerçek paraya geri dönmez). Türkiye'deki KO topluluğunda GB satışı (Kopazar, ByNoGame vb.) zaten normalleşmiş. Resmi kanal bu talebin bir bölümünü güvenli hale getirir. WoW deneyimi gri pazarın tamamen bitmediğini de gösteriyor.
6. **Dupe, bot ve RMT:** Sunucu otoriter envanter, her item için benzersiz ID ve köken kaydı, iki tarafı tek bir DB transaction'ında işleyen atomik takas, yeni hesaplara "güvenilir hesap" eşiği (Lost Ark modeli) ve davranışsal bot tespiti (NCSoft'un NDSS 2016 çalışması) gerekiyor. KO'nun en büyük yarası aylarca açık kalan dupe'lar ve masum oyuncuları da vuran toplu "dupe wipe"lardı.
7. **İzleme:** EVE'nin Aylık Ekonomi Raporu'nu model alan bir faucet/sink panosu öneriyoruz. Panoda aktif para arzı, kaynağa göre giriş/çıkış, fiyat endeksleri, mühür kuru, servet dağılımı (Gini) ve upgrade seviyesi dağılımı izlenmeli.

---

## 1. Altın ve item yutakları (item yok etmeden)

### Bulgular

**Temel kavram:** Ultima Online'ın 2000 tarihli GDC sunumu, kapalı döngülü bir ekonominin (kaynakların sabit miktarda dolaştığı model) istifçilik yüzünden çöktüğünü anlatır. Bundan çıkan ders, girişlerin (faucet) ve çıkışların (sink/drain) birbirinden bağımsız ayarlanabilmesi gerektiğidir. Lehdonvirta ve Castronova'nın *Virtual Economies* kitabı da bu "boru tesisatı" yaklaşımını sistemleştirir. Sabit tutarlı yutaklar oyuncular zenginleştikçe etkisizleşir. Yüzdesel yutaklar (vergi, değere bağlı tamir) ise oyunun tüm ömrü boyunca işe yarar.

| Oyun | Ana yutaklar | Bizim için ders |
|---|---|---|
| **WoW** | Tamir (slot ve item seviyesine göre ölçeklenir), transmog ücreti, NPC alımları, binekler. Oyuncular tamir ve transmog ücretlerinin arttığından şikâyet ediyor, ama bu ücretler enflasyonu frenleyen ana araçlar. | Tamir, "herkesin ödediği" en güvenilir yutak. Ama oyuncu bunu ceza gibi hissetmemeli. |
| **EVE Online** | Satış vergisi ve broker ücreti (2021'deki ayarlamadan sonra NPC istasyonlarında satış vergisi %8, broker ücreti %3), gemi kaybı (oyunun asıl item yutağı), üretim. Vergi oranları ekonomiyi yönetmek için doğrudan kaldıraç olarak kullanılıyor. | Vergi oranı bir "faiz oranı" gibi kullanılabilir ve gerektiğinde değiştirilir. |
| **Black Desert** | Pazar vergisi %35, Value Pack ile kesinti yaklaşık %15,5'e iner. Upgrade başarısızlığında maksimum dayanıklılık düşer, düşen dayanıklılık tamir maliyeti doğurur. Fiyat bantları var. Oyuncular arası doğrudan takas yok. | Yüksek vergi ve oyuncular arası takasın olmaması RMT'yi zorlaştırır, ama sosyal ticaret ölür. Bizim için fazla katı. |
| **Albion Online** | Tam yağma (full loot) ile ölünce item el değiştirir veya kaybolur. Tamir maliyeti item değerine bağlıdır (sıfır dayanıklılıktan tam tamir yaklaşık item değerinin 15 katı). İlan kurulum ücreti %2,5 alım ve satış emrinde ayrı ayrı alınır. Satış vergisi %8, premium ile %4. Pazarlar şehre özgüdür. | Kurulum ücreti ile satış vergisinin ayrılması, ilan spamini ve sürekli fiyat düşürme savaşlarını caydırır. |
| **Path of Exile** | Ayrı bir altın yok. Craft orb'ları hem para hem tüketilen malzeme, her craft denemesi para yakar. Lig sıfırlamaları da var. | **Para ile malzemenin aynı şey olması** zarif bir yaklaşım. Bizde upgrade parşömenleri "ikinci para" gibi işleyebilir. |
| **OSRS / RuneScape** | Grand Exchange vergisi 2021'de %1 olarak başladı, Mayıs 2025'te %2'ye çıktı, tavanı 5M. 100 altın altındaki satışlar ve acemi aletleri vergiden muaf. Vergi gelirinin küçük bir kısmıyla pahalı item'lar piyasadan alınıp siliniyor. Bond'ları takas edilebilir yapmanın %10'luk ücreti var. | Akademik analiz (Hogan-Hennessy 2022): vergi, sınır fiyatlarda işlem hacmini anlamlı biçimde düşürmedi. Item yutağı ise lüks item fiyatlarını beklenmedik şekilde artırdı ve yasadışı altın ticaretini pek etkilemedi. Yani **vergi davranışı çok bozmadan altın yakar**. Item yutağının yan etkileri dikkatle izlenmeli. |
| **MapleStory** | Star Force meso maliyeti seviyeyle sert biçimde artıyor, Safeguard (koruma) ücreti 2025'te ikiye katlandı. Küp ve potansiyel sistemleri sürekli meso ve item yakıyor. | Ölçeklenen deneme ücreti yüksek seviyede çok güçlü bir yutak. |
| **Lineage 2** | Güvenli seviye +3 (tam gövde zırhta +4). Üstünde başarısızlıkta item kristale dönüşür. Blessed parşömen item'ı yakmaz ama +0'a sıfırlar. | "Yakılma" yerine "kristale dönüşme" bir tür parçalama (salvage). Blessed modeli ağır bir düşürme örneği. |
| **Lost Ark** | Honing (upgrade) başarısızlıkta item'ı **ne kırar ne düşürür**. Tüm yutak tüketilen malzeme ve altın ücretinden gelir. | Düşürmesiz modelde bile malzeme tüketimi ekonomiyi taşıyabiliyor. Bizim düşürmemiz bu yutağa ek bir derinlik katıyor. |
| **Hearthstone** | Kart parçalama (disenchant) ile toz elde ediliyor. Parçalama değeri üretim maliyetinin yaklaşık 1/4 ila 1/8'i. | Parçalama oranı için hazır ve oyuncuların alışık olduğu bir referans. |
| **Guild Wars 2** | Trading Post'ta %5 ilan ücreti ve %10 işlem ücreti, toplam %15. | Ana gelir vergiden gelir. Yüksek gibi görünse de kabul gördü. |

**Diğer araçlar:**
- **Bağlanma (soulbound / bind-on-equip):** Item'ın arzını yok etmez ama **piyasadan çeker**. Lost Ark ve BDO hesaba bağlı katmanları yoğun kullanır.
- **Sezon sıfırlamaları:** PoE ligleri ve Diablo sezonları ekonomiyi tamamen sıfırlar. Takaslı bir MMO'da güç item'larını sıfırlamak oyuncu güvenini sarsar. Sezonluk ödüller ise hesaba bağlı kozmetikler olarak verilebilir.
- **Kozmetik ve transmog:** WoW'da transmog ücreti altınla ödeniyor. Bizde premium kozmetik satışından ayrı olarak "görünüm uygulama" ücreti altınla alınabilir.

### Bizim oyun için öneri

- **Her upgrade denemesi** iki şey yakar: kademeli parşömen ve altın ücreti. Ücret seviyeyle hızla ölçeklenir (bkz. Bölüm 8 tablosu).
- **Parçalama:** Her item "Öz" (malzeme) ve az miktarda altına dönüştürülebilir. Değer, item değerinin %20–25'i civarında olmalı. Upgrade seviyesi yüksek item'lar seviyeye göre ek Öz verir, ama yatırımın en fazla %30'unu geri öder. Böylece "düşen item'ı parçala, yeniden dene" döngüsü kârlı hale gelmez.
- **Üretim item tüketir:** Örneğin 3 adet aynı kademe item + Öz → 1 üst kademe item (veya set parçası). Sonuç rastgeleyse ve girdiler dolaylı yoldan parayla alınabiliyorsa Kore'de "birleştirme tipi" sayılır ve oranlar açıklanmalıdır.
- **Dayanıklılık ve tamir:** Item yok olmaz, sıfır dayanıklılıkta istatistik bonusu kapanır. Tamir altınla yapılır ve item değeri ile upgrade seviyesine göre ölçeklenir (bkz. Bölüm 8).
- **Pazar vergisi ve ilan ücreti:** Yüzdesel olacak. Detaylar Bölüm 3'te.
- **Sınırlı ticaret hakkı:** Nadir ve üstü item'lar ile +7 ve üstü her item 3 kez el değiştirebilir, sonra hesaba bağlanır. Bu, RMT aklamasını ve sonsuz el değiştirmeyi sınırlar. Merchant kültürü için normal item'lar sınırsız kalır.
- **Diğer küçük yutaklar:** Klan kurma ve geliştirme, isim ve görünüm uygulama, depo genişletme (altınla), yetenek ve kart destesi sıfırlama, ileride ulus savaşı kale bakımı.
- **İleride değerlendirilebilir:** OSRS tarzı "vergiyle beslenen geri alım": toplanan verginin küçük bir kısmıyla en çok enflasyona uğrayan item'lar piyasadan alınıp silinir. Lansmanda gerekmez, enflasyon görülürse devreye alınır.

---

## 2. Düşürmeli upgrade sistemleri, pity ve hukuki boyut

### Bulgular

**Black Desert:** +7'ye kadar silah ve +5'e kadar zırh garantili. Sonrası rastgele. PRI (+16) ile PEN (+20) arası oranlar çok düşük (TET yaklaşık %2, PEN yaklaşık %0,3). DUO ve üstünde başarısızlık bir kademe düşürür. Her başarısızlık "failstack" kazandırır ve sonraki deneme şansını artırır (PRI'da +2, DUO'da +3, TRI'da +4 ...). Failstack'ler başka item'lar üzerinde biriktirilip saklanabiliyor, bu da başlı başına bir mini oyun yaratıyor. Cron taşı düşmeyi engelliyor. Nisan 2024'te "Ancient Anvil" adlı açık bir pity eklendi: 35 başarısızlıktan sonra garanti başarı.

**MapleStory Star Force:** Oranlar yüzde 95'ten başlayıp aşağı iniyor, 15–21 yıldız arasında yaklaşık %30'da sabitleniyor. 12 yıldızdan itibaren patlama (item yok olma) riski var. Eski sistemde 15 yıldız üstünde başarısızlık yıldız düşürüyordu. Aynı item art arda iki kez düşünce "Chance Time" ile sonraki deneme %100 başarılı oluyordu. 2025'te (KMST 1.2.185 / GMS v264) **başarısızlıkta düşme tamamen kaldırıldı**. Gerekçe, oyuncuların iki yıldız arasında gidip gelmesinin süreci fazla uzatmasıydı. Bu bizim için önemli bir uyarı: düşme kuralı fazla cezalandırıcı olursa sonsuz bir "ping-pong" yaratır.

**Lost Ark honing:** İki katmanlı pity var. (1) Her başarısızlık başarı oranını taban oranın %10'u kadar artırır, en fazla taban oranın iki katına çıkar. (2) Artisan's Energy her başarısızlıkta toplam oranın yaklaşık 0,465 katı kadar dolar, %100'e ulaşınca sonraki deneme garantidir. Başarıda sıfırlanır. Item ne kırılır ne düşer.

**Lineage 2:** Güvenli seviyeye (+3/+4) kadar risksiz. Üstünde normal parşömenle başarısızlık item'ı kristale çevirir, blessed parşömenle +0'a sıfırlar.

**Knight Online:** Resmi oranlar hiç açıklanmadı. Topluluk tahminleri birbirinden çok farklı; örneğin bir kaynak +7→+8 için düşük sınıf item'da %15, Trina parçasıyla %35 diyor. Trina parçası düz +%20 ekliyor. Bu belirsizlik bugünkü hukuki ortamda kabul edilemez (aşağıya bakın).

### Hukuki ve düzenleyici çerçeve

- **Güney Kore (22 Mart 2024'ten beri):** Oyun Endüstrisi Teşvik Yasası'nın 33. maddesi değişti. Olasılıklı item'lar üç türe ayrılıyor: kapsül, **güçlendirme (enhancement)** ve birleştirme. Doğrudan **veya dolaylı** olarak parayla alınan item'lar kapsamda. Tamamen ücretsiz kazanılan item'lar kapsam dışı. Uygulamayı GRAC denetliyor: ilk birkaç ayda 1.255 vaka incelendi, 266 ihlal bulundu ve bunların %60'ı yabancı oyunlardı. Bir sonraki adımda dağıtım yasağı ve cezalar geliyor. Sonraki düzenlemelerde yanlış beyan için 3 kata kadar tazminat gündeme geldi.
  - **Bize etkisi:** Premium para mühür üzerinden altına, altın da parşömene dönüştüğü için parşömenlerin "dolaylı olarak parayla alınabilir" sayılma riski yüksek. **Kore'de yayın planı varsa tüm upgrade oranları, pity kuralları ve Isınma formülü açıklanmalı.** Kore'de yayın olmasa bile bu en iyi uygulama.
- **Nexon / MapleStory (Ocak 2024):** Kore Adil Ticaret Komisyonu (KFTC) 11,6 milyar won (yaklaşık 8,9 milyon $) ceza verdi. Sebep, küp seçenek olasılıklarının yıllarca habersiz değiştirilmesi ve "değişiklik yok" diye yanlış açıklama yapılmasıydı. **Ders:** Oranlar değişirse yama notunda açıkça duyurulmalı, eski oran tabloları arşivlenmeli.
- **Çin:** 2017'den beri rastgele çekiliş ve "forge" olasılıklarının açıklanması zorunlu. 2023 taslağı reşit olmayanlara olasılıklı çekilişleri yasaklamayı öneriyor. Çin'de yayın zaten ayrı bir ruhsat süreci gerektiriyor.
- **Belçika:** 2018'den beri parayla alınan loot box'lar kumar sayılıyor. Akademik inceleme, yasağın uygulamada pek etkili olmadığını gösteriyor. Yine de risk gerçek. Mağazada rastgele ürün satmamak bu riskin çoğunu ortadan kaldırır. Mühür-altın borsası ve upgrade için Belçika özelinde hukuki görüş alınmalı.
- **Hollanda:** Danıştay Mart 2022'de FIFA paketlerinin kumar olmadığına hükmetti. Siyasi düzeyde ise yasak talepleri sürüyor.
- **AB:** CPC Ağı Mart 2025'te sanal para ilkelerini yayınladı. Fiyatlar gerçek para karşılığıyla da gösterilmeli. Uyumsuz paket boyutlarıyla oyuncuyu fazla para almaya zorlamak yasak. Cayma hakkı ve çocukların korunması ilkeleri de var.
- **Türkiye:** Loot box'a özgü bir yasa yok. 6502 sayılı Tüketicinin Korunması Kanunu ve KVKK uygulanıyor. Dijital oyun kanun teklifi 3 Nisan 2026'da TBMM komisyonundan geçti: Türkiye temsilcisi, ebeveyn denetimi, sınıflandırılmamış oyunlara otomatik 18+ gibi maddeler içeriyor. BTK'nın loot box konusunda yeni yükümlülük getirme yetkisi daraltıldı. Genel Kurul süreci takip edilmeli. Oran açıklaması fiilen sektör standardı haline geldi.

### Bizim oyun için öneri

- Upgrade bir **oyun mekaniği**, satılan bir ürün değil. Parşömen, Isınma veya koruma **premium mağazada satılmamalı**. Bunlar oyunla kazanılmalı ve oyuncular arasında altınla alınıp satılmalı.
- **Oran şeffaflığı:** Örs ekranında her denemede şu bilgiler görünmeli: taban oran, Isınma bonusu, efektif oran, Örs Enerjisi yüzdesi ve başarısızlık sonucu ("+6'ya düşer"). Aynı tablo sitede de yayınlanmalı, değişiklikler yama notunda belirtilmeli.
- **Pity yapısı (3 katman):**
  1. **Isınma:** Bir seviyedeki her başarısızlık o seviyenin oranına taban oranın +%10'unu ekler, en fazla taban oranın 2 katına kadar (Lost Ark modeli).
  2. **Örs Enerjisi:** Her başarısızlık, taban oran × 1,0 kadar enerji ekler. %100'e ulaşınca o seviye için sonraki deneme garantidir. Enerji **item ve hedef seviye bazında saklanır, item düşse bile kaybolmaz**, başarıda sıfırlanır. Böylece düşme ping-pong'u sınırlanır.
  3. **Şans Anı:** Aynı item art arda iki kez düşerse sonraki deneme garantidir (MapleStory'deki Chance Time'ın uyarlaması). Animasyonla "ateşlenmiş örs" olarak sunulabilir.
- **Gerilim nereden gelecek:** +6 ve üstünde her başarısızlık görünür bir düşüş yaratır, Örs Enerjisi barı yavaşça dolar, Şans Anı ise dramatik bir kurtuluş anı sunar. Ayrıca BDO'daki failstack'e benzer bir sosyal kültür de oluşabilir: oyuncular düşük değerli item'larla Isınma biriktirmeye çalışabilir. Bunu önlemek için Isınma'yı item bazında tutuyoruz ve başka item'a aktarılmasına izin vermiyoruz.
- **Koruma Tılsımı:** Bir denemede düşmeyi engeller (Cron taşının karşılığı). **Sadece haftalık görev ve sıralı (ranked) ödülüyle kazanılır, hesaba bağlıdır, satılmaz.** Haftada 1–2 adet verilir. Böylece P2W algısı oluşmaz ve RMT edilemez.

---

## 3. Oyuncu pazarı modeli

### Bulgular

- **Kişisel tezgâh (KO Moradon, Ragnarok):** KO'da "/merchant" komutuyla en fazla 12 çeşit item satılabiliyor ve satış oyuncu bilgisayar başında değilken de otomatik gerçekleşiyor. Alış merchant'ı da var. Moradon tarafsız bölge olduğu için ticaretin merkezi oldu. Ragnarok'un mobil sürümlerinde tezgâh çevrimdışıyken de çalışıyor. Bu, mobil için doğal bir "offline merchant" modu.
- **Küresel müzayede evi (WoW, GW2, BDO):** Fiyat keşfi hızlı ve kolay. Eleştirisi, oyuncular arası sosyal etkileşimi (pazarlık, tanışma) öldürmesi. Diablo 3'ün gerçek paralı müzayede evi en uç örnek: "canavar kes, ganimet topla" döngüsünü kısa devre yaptığı için 2014'te kapatıldı.
- **Bilinçli sürtünme (PoE "Trade Manifesto"):** GGG, frictionless (sürtünmesiz) bir müzayede evinin ganimeti değersizleştireceğini ve oyuncuları oyun yerine ticarete yönlendireceğini savunuyor. Bu yüzden ticareti kasıtlı olarak bir miktar zahmetli tutuyor.
- **Hibrit:** Oyuncu forumlarında da öne çıkan bir model var. Arama tüm tezgâhları gösteriyor ve tezgâhın konumunu bildiriyor. Yürüme süresi, fiyatın bir parçası haline geliyor (yakın tezgâh biraz pahalı olabilir).
- **Manipülasyona karşı:** BDO taban fiyatın ±%7,5'i gibi bantlarla çalışıyor ve ön sipariş kuyruğunda fiyat artırmayı engelliyor. Çok katı olduğu için gerçek fiyat keşfini öldürüyor ama RMT'yi zorlaştırıyor. Albion yerel pazarlar ve alım emirleriyle (buy order) çalışıyor. EVE, PLEX için bölgesel spekülasyonu azaltmak amacıyla 2025'te küresel bir PLEX pazarına geçti.

### Bizim oyun için öneri: "Moradon Çarşısı" hibrit modeli

- **Tezgâh (ana kanal):** Hub haritada (Moradon benzeri bir pazar meydanı) tezgâh kurulur. **Çevrimdışı modda** oyuncunun karakteri tezgâhın başında durmaya devam eder. Temel olarak 8 slot var, oyunda ilerledikçe 12'ye çıkar. Günlük "Pazar İzni" altınla alınır ve 24 saat geçerlidir. Alış tezgâhı (alım emri) da kurulabilir.
- **Pazar Defteri (küresel arama):** Tüm tezgâhlardaki ilanlar ve alım emirleri burada aranır. Fiyat geçmişi grafiği (7, 30 ve 90 gün), medyan fiyat ve işlem hacmi görünür.
  - **Tezgâha yürüyerek alım:** Ek ücret yok. Bu, sosyal hub'ı yaşatır.
  - **Uzaktan alım (Kâtip):** Alıcı %3 ek ücret öder (yutak). Mobilde kolaylık sağlar.
- **Vergi:** Satış vergisi %5 (premium üyelikle %4; bu küçük bir kolaylık, güç değil). İlan ücreti %1'dir ve iade edilmez. İlan güncelleme de %1'dir, bu fiyat kırma savaşlarını caydırır. Asgari ücret 10 altın.
- **Manipülasyona karşı önlemler:**
  - **Yumuşak fiyat bantları:** 7 günlük medyanın 5 katından pahalı veya %20'sinden ucuz ilanlarda uyarı ve onay istenir. Bu sınırların dışındaki işlemler RMT incelemesi için işaretlenir.
  - Hesap başına aktif ilan limiti var. İlan iptalinden sonra 5 dakika yeniden ilan bekleme süresi uygulanır.
  - Medyan fiyatlar, aykırı değerler kırpılarak (trimmed) hesaplanır. Böylece kendi kendine satış yaparak fiyat şişirme işe yaramaz.
  - Aynı IP veya cihaz arasındaki tezgâh işlemleri ile yeni hesaplara yapılan "hediye fiyatlı" satışlar işaretlenir.
- **Neden saf müzayede evi değil?** Hem KO kimliğini (Moradon'un merchant kültürü) korumak hem de PoE'nin gösterdiği gibi bir miktar sürtünmeyle item değerini korumak için.

---

## 4. Takas edilebilir premium para

### Bulgular

- **WoW Token (2015):** Blizzard bunu üçüncü taraf altın satıcılarına karşı çıkardı ve bu satıcıları hesap çalınmalarının başlıca kaynaklarından biri olarak gösterdi. Fiyat arz-talebe göre algoritmayla belirleniyor ve birkaç dakikada bir güncelleniyor. Token kullanılınca yok oluyor. Sonuç karışık: gri pazar yok olmadı ve token fiyatının çok üstünde altın/dolar oranları sunmaya devam ediyor. Eleştirmenler token'ın RMT'yi meşrulaştırdığını söylüyor. Öte yandan **token fiyatı, oyun içi enflasyonun en iyi tek göstergesi** haline geldi.
- **EVE PLEX (2008/2009):** CCP'nin uzun süre mücadele ettiği yasadışı ISK satışına resmi bir alternatif olarak çıktı. 2017'de 1 PLEX 500 birime bölündü ve mağaza parası haline getirildi. 2025'te spekülasyonu azaltmak için küresel PLEX pazarına geçildi. CCP'nin ekonomisti Dr. Eyjo, PLEX ile RMT mücadelesi arasındaki bağlantıyı açıkça tartıştı.
- **Black Desert:** Pearl (mağaza) item'ları Central Market'te gümüşe satılabiliyor, ama fiyatları sabit ve üst sınırlı. Yoğun talep için bekleme kuyruğu var. Doğrudan pearl-gümüş takası yok. Kozmetik üzerinden kontrollü bir köprü kurulmuş.
- **ArcheAge APEX ve Albion Gold:** Premium para oyun içi item olarak altına satılabiliyor. Yaygın bir model.
- **Lost Ark:** Royal Crystal ↔ altın borsası var. Altın honing'in ana girdisi olduğu için borsa doğrudan güce dönüşüyor ve bu nedenle güçlü bir P2W algısı oluştu.
- **OSRS Bond:** Takas edilebilir hale getirmek %10 ücret gerektiriyor. Kullanıldıktan sonra takas edilemiyor. Bu ücret aynı zamanda bir altın yutağı.
- **Knight Online:** KC (Knight Cash) ile PUS (Power-up Store) alışverişi yapılıyor. Türkiye'de üçüncü taraf GB (1 GB = 100M coin) pazarı büyük ve sunucuya göre GB başına yaklaşık 150–220 TL fiyatla açıkça işliyor. Yani topluluk için RMT normal bir şey.

### Bizim oyun için öneri: "Kraliyet Mührü"

- Mühür, X Elmas değerinde bir oyun item'ıdır. Örneğin 500 Elmas ≈ bir aylık premium üyelik.
- **Resmi Mühür Borsası:** WoW tarzı algoritmik fiyat. Satıcı (parayı ödeyen oyuncu) mührü sistemin belirlediği fiyattan altına anında satar. Alıcı altınla alır. **İşlemde %10 altın yakılır** (OSRS bond benzeri yutak).
- **Tek kullanımlık:** Satın alınan mühür bir kez takas edilir, kullanıldığında Elmas'a veya premium üyeliğe dönüşür. Tekrar takas edilemez. Bu, aklama zincirlerini engeller.
- **Tek yönlü:** Elmas veya altın hiçbir şekilde gerçek paraya dönüşmez (Apple 5.3 ve kumar riskine karşı).
- **P2W algısını yönetmek:** Altınla alınabilen güç, piyasadaki item'lar ve parşömenler. Bu dolaylı güç kanalı kaçınılmaz. Etkisini sınırlamak için:
  1. En değerli güç girdileri hesaba bağlı olmalı: Koruma Tılsımı ve sezonluk/ranked malzemeler.
  2. Üst kademe item'larda ticaret hakkı 3 ile sınırlı olmalı.
  3. Mühürle alınan altın hesap başına haftalık bir sınıra tabi olmalı (örneğin haftada 4 mühür).
  4. Kozmetik ve kolaylık her zaman doğrudan Elmas ile satılmalı.
- **Mağaza kozmetikleri:** Elmasla alınan kozmetik **bir kez** pazara konabilir (BDO benzeri) ve fiyat bandı uygulanır. Sonra hesaba bağlanır.

---

## 5. Anti-RMT, anti-bot, anti-dupe

### Bulgular

- **KO'da yaşananlar:** Blessed upgrade parşömeni dupe'u üç aydan uzun süre açık kaldı. Dupe'lanan parşömenler NPC'ye satılarak oyuna o kadar çok coin girdi ki coin değersizleşti. Firedrake genişlemesinden sonra "dupe sorunu çözüldü" denmesine rağmen 5 ay sonra yapılan dupe wipe'ta oyuncuların çoğu ekipmanlarının yarısını kaybetti. Chaotic generator parçaları dupe'landığında meşru yollarla elde edilmiş unique'ler de silindi. Topluluk güveni ciddi şekilde zarar gördü; yayıncının bu işten pay aldığına dair komplo teorileri bile çıktı. **Ders:** Dupe'u sonradan temizlemek, baştan önlemekten çok daha pahalıya patlar. Masum oyuncuyu vuran toplu wipe'lar güveni yok eder.
- **Diablo 2 ve 3:** D2'deki dupe ve altın satıcısı sorunu D3'ün müzayede evini doğurdu, o da başka sorunlar yarattı.
- **Lost Ark:** 1 milyondan fazla bot hesabı banlandı. "Trusted Status" (güvenilir hesap) olmadan müzayede evi, pazar, takas ve posta kullanılamıyor. Limitli Steam hesapları takas başlatamıyor, kristal ↔ altın borsasını kullanamıyor. Bir dönem 1375 item seviyesi altındaki hesapların zanaat malzemesi satması da yasaklanmıştı. RMT altını hesaplar arasında takip ediliyor, ikinci hesaplardan aklanması engelleniyor.
- **Bot tespiti:** NCSoft ve Kore Üniversitesi'nin NDSS 2016 çalışması, Lineage, Aion ve Blade & Soul verisiyle tekrarlanan davranışın "öz-benzerlik" ölçümünü kullanarak bot tespit etti. Sonraki çalışmalar aksiyon arası süre dağılımlarına, finansal akış ağlarına ve insan-AI ortak incelemesine (NCSoft 2025) odaklanıyor.
- **Mimari:** Dupe, iki taraflı takasın tek bir DB transaction'ında olmamasından, istemciye güvenilmesinden ve yarış koşullarından (race condition) doğar. Çözüm: sunucu otoriter envanter, benzersiz item seri numarası, atomik transfer, kilitler ve bekleme süreleri, köken doğrulama ve tespit/alarm.

### Bizim oyun için öneri

**Mimari (dupe'a karşı):**
- Envanter, altın ve upgrade sonucu **sadece sunucuda** belirlenir. RNG sunucu tarafında üretilir ve her denemenin tohumu (seed) ile sonucu loglanır.
- Her item'ın bir **GUID**'i vardır. Köken (drop, craft veya mağaza; zaman; kaynak) ve sahiplik geçmişi tutulur.
- Takas, satış ve posta işlemleri **tek bir ACID transaction** içinde yapılır. İstemci istekleri idempotency key ile gelir, böylece aynı istek iki kez işlenmez.
- **Çift kayıtlı defter (double-entry ledger):** Her altın hareketi bir kaynağa ve bir hedefe yazılır. Gece mutabakatı yapılır: toplam para arzı = önceki gün + girişler − çıkışlar olmalı. Fark varsa alarm çalar.
- Aynı GUID'in iki yerde görünmesi anında alarm üretir.
- Sunucu bakımı ve yeniden başlatma öncesinde ticaret kilitlenir. Bağlantı kopması anındaki davranış test edilir (kaos testleri).
- Takas, upgrade ve ilan isteklerine hız sınırı (rate limit) uygulanır.

**Hesap ve takas kısıtları (RMT'ye karşı):**
- **Güvenilir Hesap:** Hesap en az 7 günlük olmalı, en az bir karakter seviye X'e ulaşmış olmalı ve telefon doğrulaması veya 2FA yapılmış olmalı (ya da herhangi bir gerçek para alımı yapılmış olmalı).
  - Güvenilir olmayan hesaplar pazardan **alabilir** ama satamaz, P2P takas yapamaz, posta ile altın gönderemez, mühür borsasında satış yapamaz.
- P2P doğrudan takasta günlük altın transfer limiti var. Değer dengesizliği büyük "hediye" takasları işaretlenir.
- Hesap paylaşımı ve satışı kullanım koşullarında açıkça yasaklanır. Hesap ele geçirme belirtileri (yeni cihaz, yeni ülke, hemen ardından toplu takas) görülürse 24 saatlik takas kilidi uygulanır.

**Bot tespiti:**
- **Davranışsal sinyaller:** Aksiyon arası süre dağılımının varyansı (insanlar dağınık, botlar düzenli), oturum uzunluğu, gece-gündüz örüntüsü, aynı kart dizilimiyle tekrarlanan PvE.
- **Ekonomik sinyaller:** Altın akış grafiği. Çok sayıda hesap bir toplayıcı hesaba altın akıtıyorsa bu "huni" yapısı işaretlenir.
- **Ban stratejisi:** Gecikmeli dalga banları uygulanır, böylece bot yazarları hangi sinyalin yakalandığını öğrenemez. RMT altınına el konur ve zincir boyunca geri alınır. Alıcılara da yaptırım uygulanır.
- **İşlenmemiş dupe item'ları:** Toplu wipe yapılmaz. Hedefli geri alım yapılır: sadece dupe'lanan GUID'ler ve onlarla bağlantılı kazançlar silinir. Etkilenen masum alıcılara tazminat verilir. KO'nun hatasından ders alınmalı.

---

## 6. Enflasyon kontrolü ve izleme

### Bulgular

- **EVE Aylık Ekonomi Raporu (MER):** Üretim, yok edilen değer, madencilik, para arzı ve dolaşım hızı, fiyat endeksleri (CPI, Mineral Price Index), kaynak bazında sink/faucet ve ham veri indirme bölümlerini içeriyor. "Aktif para arzı", son 90 gün içinde oturum açmamış hesapları sayım dışı bırakıyor. Faucet'lerin hangi aktiviteden geldiği (örneğin ödül avı, NPC'ye satılan emtia) ay ay izleniyor.
- **Albion (GDC 2017, Matt Woodward):** Piyasa odaklı bir ekonomide dengenin nasıl ayarlandığı anlatılıyor. Sink'lerin servetle birlikte ölçeklenmesi gerekiyor.
- **OSRS:** Ekonomi müdahaleleri (vergi oranı değişimi, item yutağı) beklenmedik yan etkiler doğurabiliyor. Müdahaleler ölçülerek yapılmalı.

### Bizim oyun için öneri: Ekonomi panosu (KPI'lar)

| KPI | Tanım | Alarm / hedef |
|---|---|---|
| Aktif para arzı (M) | Son 30 ve 90 günde aktif hesaplardaki toplam altın | Haftalık büyüme, DAU büyümesinin 1,5 katını geçmemeli |
| Faucet / Sink oranı | Kaynak bazında günlük giriş ve çıkış (PvE drop, NPC satışı, görev, vergi, tamir, upgrade, Kâtip ücreti, mühür yakımı ...) | Lansmandan sonraki ilk 3 ay için 1,1–1,3 kabul edilebilir. Sonrasında 0,95–1,05 hedeflenmeli. |
| Kişi başı net altın | Seviye bandına göre günlük net kazanç (medyan ve p90) | Bot ve suistimal tespiti için kullanılır |
| Mühür kuru | 1 mühür = kaç altın | Enflasyonun ana göstergesi. 30 günde %20'den fazla artış varsa inceleme |
| Fiyat endeksi (sepet) | Parşömen, tamir malzemesi, +0 ortak item, +7 item, Öz | Aylık değişim |
| Dolaşım hızı | Pazar ve P2P hacmi / M | Düşüşe geçmesi istifçilik demektir |
| Servet dağılımı | Gini katsayısı, en zengin %1'in payı | En zengin %1'in payı artıyorsa RMT veya bot şüphesi |
| Upgrade dağılımı | Her +N seviyesinde 1.000 DAU başına item sayısı, +10 sayısı | Güç tavanının ne hızla yükseldiğini gösterir |
| Pazar sağlığı | İlan/satış oranı, satışa kadar geçen medyan süre, fiyat bandı ihlalleri | |
| Güvenlik | Bot banları, el konulan altın, GUID çakışması, ledger farkı | Ledger farkı = 0 olmalı, fark varsa P0 alarm |

- Aylık iç rapor hazırlanmalı. EVE gibi topluluğa yönelik özet bir aylık ekonomi raporu yayınlamak güven oluşturur ve hukuki şeffaflığı destekler.
- **Kaldıraçlar:** Vergi oranı, Kâtip ücreti, NPC satış fiyatları, drop oranları, mühür yakım oranı, upgrade ücret çarpanı. Her değişiklik yama notunda duyurulmalı.

---

## 7. Mağaza ve hukuk (Apple, Google, Steam, yaş derecelendirme)

### Bulgular

- **Apple App Store 3.1.1:** Rastgele item satan mekanizmalarda olasılıklar satın alımdan önce gösterilmeli. IAP ile alınan para birimlerinin süresi dolamaz. Hediye edilebilen item'lar sadece IAP'ye uygun olanlar olmalı ve hediyeler takas edilemez. **5.3:** Gerçek paralı kumar ruhsat gerektiriyor ve IAP ile kumar kredisi satılamaz. Oyuncular arası takas yönergelerde açıkça yasaklanmıyor. Kritik olan, değerin gerçek paraya geri dönememesi.
- **Google Play:** 2019'dan beri loot box olasılıkları satın alımdan önce açıklanmalı. Gerçek paralı kumar sadece lisanslı ve onaylı uygulamalarda serbest. Değeri olan sanal item'larla kumar ayrı bir kategoride değerlendiriliyor.
- **Yaş derecelendirme:** ESRB ve PEGI 2020'de "In-Game Purchases (Includes Random Items)" etiketini getirdi. IARC (Google Play gibi dijital mağazalar) bu etiketi kullanıyor. PEGI tanımına göre "ücretli rastgele item", parayla doğrudan alınabilen **ya da** parayla alınabilen bir oyun içi para birimiyle alınabilen item demek. Akademik çalışmalar, şirketlerin bu etiketlere uyumunun zayıf olduğunu gösteriyor.
- **Steam:** Valve 2016'da skin kumar sitelerine ihtar gönderdi. Hesapların ve API'nin ticari kumar amacıyla kullanılması Steam Abonelik Sözleşmesi'ni ihlal ediyor. Steam'de oyun içi satın alımlar için Steamworks mikro ödeme kuralları kontrol edilmeli.

### Bizim oyun için öneri

- **Mağazada rastgele ürün yok:** Sandık, kutu veya gacha satılmayacak. Kozmetikler doğrudan satılacak. Bu, Belçika, Hollanda ve Kore risklerinin büyük kısmını ortadan kaldırır.
- **Upgrade oranları açıklanacak:** Kore'deki "dolaylı ücretli güçlendirme" tanımı nedeniyle bu zorunlu kabul edilmeli. Aynı şeffaflık Apple ve Google tarafında da artı puan olur.
- **Yaş etiketi:** Mühür borsası nedeniyle muhafazakâr davranılmalı ve IARC anketinde "Includes Random Items" işaretlenmeli. Hukuk danışmanıyla kesinleştirilmeli. Sohbet ve takas olduğu için "Users Interact" da işaretlenmeli. Hedef PEGI 12 / ESRB T civarı olmalı.
- **Gerçek paraya çıkış yok:** Kullanım koşullarında hesap ve item satışı açıkça yasaklanmalı. Elmas'ın süresi dolmamalı.
- **Çoklu platform:** PC'de alınan Elmas'ın iOS'ta kullanılabilmesi için aynı ürünler iOS'ta da IAP ile sunulmalı (Apple'ın çoklu platform kuralı). Steam sürümündeki satın alımlar Steam Wallet üzerinden yapılmalı.
- **AB CPC ilkeleri:** Elmas fiyatlarının yanında gerçek para karşılığı gösterilmeli. Paket boyutları ürün fiyatlarıyla uyumlu olmalı ki oyuncunun elinde zorla artık para kalmasın. Reşit olmayanlar için harcama limiti ve ebeveyn kontrolü olmalı (Türkiye kanun teklifi de bu yönde).
- **Bölgesel karar:** Belçika'da mühür borsası ve upgrade için hukuki görüş alınmalı. Gerekirse mühür borsası Belçika'da kapatılmalı (geo-gate).

---

## 8. Önerilen ekonomi modeli taslağı

### 8.1 Para birimleri

| Para birimi | Kaynak | Kullanım | Takas |
|---|---|---|---|
| **Altın (Noah benzeri)** | PvE, görev, NPC satışı, ranked | Upgrade ücreti, tamir, pazar, klan | Serbest (kısıtlarla) |
| **Elmas (premium)** | Sadece gerçek para (+ çok küçük etkinlik ödülleri) | Kozmetik, premium üyelik, kolaylık | Takas edilemez. Mühür aracılığıyla altına çevrilir |
| **Kraliyet Mührü** | 500 Elmas ile alınır | Borsada altına satılır veya 30 gün premium/Elmas olarak kullanılır | Bir kez takas edilir, %10 altın yakımı |
| **Öz (malzeme)** | Parçalama, drop | Üretim, yüksek kademe parşömen | Serbest |

### 8.2 Upgrade tablosu (+1..+10)

Başarısızlık kuralı: **+1–+5 hedef denemelerinde başarısızlık = seviye korunur. +6–+10 hedef denemelerinde başarısızlık = 1 seviye düşüş.** Item asla yok olmaz.
Parşömen kademeleri: Normal (+1–+5), Kutsanmış (+6–+8), Kadim (+9–+10).
G = seviye sınırındaki aktif bir oyuncunun medyan günlük altın geliri (ayar birimi).

| Hedef | Taban başarı | Başarısızlıkta | Parşömen / deneme | Altın ücreti / deneme | Örs Enerjisi / başarısızlık | Bu seviyeye garanti* | Ort. deneme (sim.) | p99 deneme |
|---|---|---|---|---|---|---|---|---|
| +1 | %100 | — | 1 Normal | 0,05 G | — | — | 1,0 | 1 |
| +2 | %100 | — | 1 Normal | 0,05 G | — | — | 1,0 | 1 |
| +3 | %95 | Kalır | 1 Normal | 0,05 G | %95 | 3. deneme | 1,05 | 2 |
| +4 | %85 | Kalır | 1 Normal | 0,1 G | %85 | 3. deneme | 1,16 | 2 |
| +5 | %75 | Kalır | 2 Normal | 0,1 G | %75 | 3. deneme | 1,30 | 3 |
| +6 | %60 | −1 (+4) | 2 Kutsanmış | 0,2 G | %60 | 3. deneme | 2,25 | 7 |
| +7 | %45 | −1 (+5) | 3 Kutsanmış | 0,35 G | %45 | 4. deneme | 3,96 | 15 |
| +8 | %35 | −1 (+6) | 4 Kutsanmış | 0,5 G | %35 | 4. deneme | 6,57 | 25 |
| +9 | %25 | −1 (+7) | 5 Kadim | 0,75 G | %25 | 5. deneme | 12,5 | 45 |
| +10 | %15 | −1 (+8) | 6 Kadim | 1,0 G | %15 | 8. deneme | 38,2 | 123 |

\* "Garanti" sütunu, o hedef seviyede kaç deneme sonra Örs Enerjisi'nin %100'e ulaşacağını gösterir. Enerji item düşse bile korunur. Isınma ve Şans Anı bu süreyi daha da kısaltır. "Ort./p99 deneme" sütunu, bir önceki seviyeden bu seviyeye çıkmak için gereken toplam denemeyi gösterir; aradaki düşüşler ve yeniden tırmanma buna dahildir.

**Pity kuralları (özet):**
- **Isınma:** Başarısızlık başına o seviyedeki orana taban oranın +%10'u eklenir. Tavan, taban oranın 2 katıdır. Başarıda sıfırlanır.
- **Örs Enerjisi:** Başarısızlık başına taban oran × 1,0 eklenir. %100'de garanti başarı sağlanır. Enerji item ve seviye bazında saklanır, düşüşte kaybolmaz. Gear transfer veya parçalama durumunda enerji kaybolur.
- **Şans Anı:** Aynı item 2 kez art arda düşerse sonraki deneme %100 başarılı olur.
- **Koruma Tılsımı:** Bir denemede düşüşü engeller. Hesaba bağlıdır ve haftalık 1–2 adet verilir. Premium mağazada satılmaz.

**Simülasyon sonuçları (bir item için +0 → +10, 30.000 koşu):**
- Deneme sayısı: ortalama **69,5**, medyan 64, p90 119, p99 164
- Parşömen birimi: ortalama 246, p90 434, p99 583
- Altın ücreti: ortalama **≈32 G** (yani yaklaşık bir aylık medyan gelir), p99 ≈ 75 G
- Ortalama düşüş sayısı: yaklaşık 29. Gerilim var ama sonu belli.
- **Karşılaştırma:** Pity olmadan ve aynı düşme kuralıyla, daha sert oranlarla (+9 %18, +10 %10) ortalama 1.338 deneme gerekiyor, p99 6.341. Yani pity olmazsa sistem "ping-pong cehennemine" döner. MapleStory'nin 2025'te düşmeyi kaldırma gerekçesi de tam olarak buydu.

### 8.3 Dayanıklılık ve tamir

- Her item'ın maksimum dayanıklılığı 100.
  - PvE maçı: −2
  - PvP maçı: kazanırsan −1, kaybedersen −3
  - Boss: −4
  - Ortalama bir oyuncu 1–2 günde bir tamir yapar.
- **0 dayanıklılıkta** item'ın istatistik ve upgrade bonusu kapanır. Item yok olmaz.
- **Tamir maliyeti** = ItemDeğeri × eksik% × 0,15 × (1 + 0,2 × upgradeSeviyesi). Örneğin +10 bir item'ın tamiri, +0 bir item'ınkinin 3 katıdır. Böylece zenginlik arttıkça sink de ölçeklenir.
- **Hedef:** Tamir, toplam altın yutağının yaklaşık %20–25'ini oluşturmalı. Bu oran WoW'daki gibi yutağın "her zaman çalışan" tabanıdır.
- PvP ranked'da (1v1) dayanıklılık kaybı küçük tutulmalı. Rekabeti cezalandırmamak için kayıp başına −3 ile sınırlı.

### 8.4 Pazar ve vergiler

| Kalem | Oran |
|---|---|
| Satış vergisi (tezgâh ve Defter) | %5 (premium üyelikle %4) |
| İlan / güncelleme ücreti | %1, iade edilmez (asgari 10 altın) |
| Uzaktan alım (Kâtip) ek ücreti | Alıcıdan %3 |
| Pazar İzni (24 saat tezgâh, çevrimdışı mod dahil) | Sabit ücret ≈ 0,05 G |
| P2P doğrudan takas | Vergisiz ama günlük altın limiti var, sadece güvenilir hesaplar arasında |
| Mühür borsası | İşlem başına %10 altın yakımı |
| Yumuşak fiyat bandı | 7 günlük medyanın 5 katı / %20'si (uyarı + RMT işareti) |

### 8.5 Faucet listesi (giriş)

- **Altın:** PvE görev/maç ödülleri, boss ganimeti, NPC'ye çöp item satışı, günlük ve haftalık görevler, ranked sezon ödülü (az), başarımlar, etkinlikler.
- **Item:** PvE drop'ları (ana kaynak), boss sandıkları, üretim çıktısı.
- **Malzeme:** Drop'lar, parçalama, günlük görevler, ranked.
- **Premium:** Sadece gerçek para (çok küçük etkinlik Elmas'ı istisna).

### 8.6 Sink listesi (çıkış) ve hedef payları

| Sink | Hedef pay (altın yutağı içinde) |
|---|---|
| Upgrade altın ücreti | %30–35 |
| Tamir | %20–25 |
| Pazar vergisi + ilan ücreti + Kâtip ücreti | %15–20 |
| Mühür borsası yakımı (%10) | %5–10 |
| Üretim ücretleri | %5–10 |
| Pazar İzni, klan, depo, sıfırlama, görünüm uygulama | %5–10 |
| (İleride) Ulus savaşı kale bakımı, OSRS tarzı geri alım | Gerekirse |

**Item yutakları (yakma olmadan):**
- Parçalama: item yok olur ve Öz'e dönüşür.
- Üretim: 3 item → 1 item.
- Upgrade parşömeni ve Öz tüketimi.
- Ticaret hakkı bitince hesaba bağlanma: piyasadan çekilir.
- Koruma Tılsımı ve ranked malzemelerinin hesaba bağlı olması: arz piyasaya hiç girmez.

### 8.7 Lansman fazları

1. **Kapalı beta:** Pazar ve takas açık, mühür borsası kapalı. Ekonomi panosu canlı olmalı. Bot ve dupe kaos testleri yapılmalı.
2. **Lansman (PvE + 1v1 PvP):** Mühür borsası haftalık limitle açılır. İlk 3 ayda faucet/sink oranı 1,1–1,3 bandında tutulur, çünkü yeni oyuncular para biriktiriyor olacak.
3. **Ulus savaşı:** Kale bakımı, savaş giriş ücretleri ve kuşatma malzemeleri yeni sink'ler olarak eklenir. Savaş ödülleri ağırlıklı olarak hesaba bağlı verilir.

---

## Kaynaklar

**Upgrade sistemleri**
- https://grumpygreen.cricket/bdo-enhancement/
- https://grumpygreen.cricket/bdo-failstack-chart/
- https://altarofgaming.com/black-desert-online-ultimate-guide-enhancing-failstacks/
- https://maplestorywiki.net/w/Star_Force_Enhancement
- https://orangemushroom.net/2025/03/13/kmst-ver-1-2-185-destiny-weapons-huge-star-force-changes/
- https://www.whackybeanz.com/guides/star-force
- https://maxroll.gg/lost-ark/resources/gear-honing-system
- https://lostark.fandom.com/wiki/Honing
- https://l2wiki.com/main/articles/913.html
- https://legacy-lineage2.com/Knowledge/enhancements.html
- https://www.gameranks.net/knight-online/guideline/knight-online-upgrade-success-rates/
- https://kobugda.com/blog/knight-online-upgrade-system-guide

**Sink'ler, pazarlar, ekonomi tasarımı**
- https://dergigi.com/assets/files/UO-Economics.pdf (Simpson, The In-game Economics of Ultima Online, GDC 2000)
- https://www.raphkoster.com/gaming/uoeconevolution.shtml
- https://edwardcastronova.com/portfolio/virtual-economies-design-and-analysis/ (Lehdonvirta & Castronova, MIT Press 2014)
- https://secure.runescape.com/m=news/grand-exchange-tax--item-sink?oldschool=1
- https://oldschool.runescape.wiki/w/Grand_Exchange
- https://arxiv.org/abs/2210.07970 (Hogan-Hennessy, Market Interventions in a Large-Scale Virtual Economy)
- https://arxiv.org/pdf/1603.07610 (Going Out of Business: Auction House Behavior in MMOGs)
- https://www.gdcvault.com/play/1024070/Balancing-the-Economy-for-Albion
- https://albionfreemarket.com/articles/view/how-albion-online-repair-costs-are-calculated
- https://wiki.albiononline.com/wiki/Marketplace
- https://bdonexus.info/wiki/central-market
- https://grumpygreen.cricket/bdo-central-market/
- https://blackdesert.pearlabyss.com/Console/en-us/News/Notice/Detail?_boardNo=9426
- https://www.gamedeveloper.com/design/guild-wars-2-economy-review
- https://en-forum.guildwars2.com/topic/25595-an-economist-looks-at-tyria-gw2-prices-and-deflation/
- https://en.wikipedia.org/wiki/Gold_sink
- https://scrolldroll.com/the-economy-of-path-of-exile/
- https://www.pathofexile.com/forum/view-thread/3275759
- https://forums.mmorpg.com/discussion/467841/players-vendor-vs-auction-house-will-you-still-open-your-own-vendor-eventhough-there-is-ah
- https://www.ragnarok-the-new-world.wiki/zeny-farming/stall-trading-guide/
- https://piuljkopiio.wordpress.com/2009/03/18/become-a-successful-merchant-guide-in-knight-online/
- https://time.com/28519/the-reaper-finally-comes-for-diablo-3s-auction-house/
- https://www.forbes.com/sites/paultassi/2023/04/16/remembering-diablos-biggest-mistake-the-auction-house/

**EVE ve izleme**
- https://www.eveonline.com/news/view/monthly-economic-report-april-2026
- https://tagn.wordpress.com/2026/06/17/the-may-2026-eve-online-monthly-economic-report-and-how-much-isk-is-too-much-isk/
- https://nosygamer.blogspot.com/2025/12/eve-onlines-november-2025-monthly.html
- https://www.eveonline.com/news/view/global-plex-market-and-friction-free-trade
- https://www.eveonline.com/news/view/restructuring-taxes-after-relief
- https://tagn.wordpress.com/2021/12/27/what-came-before-plex/
- https://www.gamedeveloper.com/design/eve-s-self-uncontained-economy
- https://www.youtube.com/watch?v=6bD-7bhaR0E (GDC 2009, Dr. Eyjo Gudmundsson)

**Premium para ve RMT**
- https://www.pcgamer.com/world-of-warcraft-tokens-will-let-players-exchange-gold-for-game-time/
- https://blizzardwatch.com/2015/09/23/wow-token-killed-off-illegitimate-gold-sellers/
- https://meminsf.silverstringmedia.com/labour/a-history-of-world-of-warcrafts-gold-economy/
- https://archeage.fandom.com/wiki/APEX
- https://www.keengamer.com/articles/guides/lost-ark-currency-guide/
- https://www.kopazar.com/en/knight-online-gold-bar
- https://www.oyunfor.com/knight-online/gb-gold-bar

**Anti-bot, anti-dupe, anti-RMT**
- https://forums.mmorpg.com/discussion/115391/dont-bother-with-k2-or-knight-online-just-a-waste-of-time
- https://en.wikipedia.org/wiki/Duping_(video_games)
- https://www.gamespot.com/articles/over-1-million-lost-ark-bot-accounts-have-been-banned/1100-6501306/
- https://mmos.com/news/lost-ark-feb-2024-ban-wave
- https://mmos.com/news/lost-ark-anti-bot-trading-restrictions-feb-2022
- https://help.playlostark.com/hc/en-us/articles/37754330044827-Account-Restrictions
- https://www.pcgamesn.com/lost-ark/steam-account
- https://www.semanticscholar.org/paper/You-are-a-Game-Bot!:-Uncovering-Game-Bots-in-via-in-Lee-Woo/444f0ceb312e98609914faf886f2ff0dcfebd58c (NDSS 2016)
- https://arxiv.org/html/2508.20578v1 (NCSoft, Human-AI Collaborative Bot Detection)
- https://onlinelibrary.wiley.com/doi/10.4218/etrij.2022-0089
- https://crux.supercraft.host/blog/server-authoritative-anti-cheat-backend/
- https://github.com/fatal10110/acis_golang/issues/920

**Hukuk ve mağazalar**
- https://gameworldobserver.com/2024/07/08/266-games-violated-loot-box-rules-south-korea
- https://www.lexology.com/library/detail.aspx?g=614e2a6c-5904-4c7e-b2b7-6385926c29df
- https://www.sciencedirect.com/science/article/pii/S0001691825008030
- https://www.invenglobal.com/articles/20011/korea-moves-to-fine-game-companies-up-to-krw-1-billion-for-false-probability-based-item-disclosures
- https://www.theinvestor.co.kr/article/3345869
- https://www.techradar.com/gaming/nexon-fined-almost-dollar9-million-for-allegedly-changing-probability-structure-of-certain-items-in-maplestory-without-informing-players
- https://www.gamedeveloper.com/game-platforms/online-games-will-be-required-to-disclose-random-loot-box-odds-in-china
- https://online.ucpress.edu/collabra/article/9/1/57641/195100/Breaking-Ban-Belgium-s-Ineffective-Gambling-Law
- https://www.twobirds.com/en/insights/2022/netherlands/fifa-22-loot-boxes-no-longer-regarded-as-gambling-in-the-netherlands-as-ban-overturned
- https://commission.europa.eu/document/download/8af13e88-6540-436c-b137-9853e7fe866a_en?filename=Key+principles+on+in-game+virtual+currencies.pdf
- https://www.reedsmith.com/articles/qas-on-the-eu-consumer-protection-authorities-joint-guidance-paper/
- https://www.politikam.com/oyun-yasasi-komisyondan-gecti-hangi-maddeler-degisti
- https://hukukbulteni.khas.edu.tr/bulten/54
- https://www.tevetoglu.av.tr/en/our-publications/an-old-but-timeless-debate-loot-box-2022-05-22-105824
- https://developer.apple.com/app-store/review/guidelines/
- https://www.fenwick.com/insights/publications/google-play-now-requires-disclosure-of-loot-box-odds
- https://support.google.com/googleplay/android-developer/answer/9877032?hl=en
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10049760/ (ESRB/PEGI/IARC label compliance)
- https://www.fieldfisher.com/en/services/technology-and-data/technology-law-blog/european-ratings-board-introduces-paid-random-item
- https://www.dexerto.com/csgo/steam-bans-high-value-csgo-traders-for-dealing-with-gambling-sites-its-just-getting-started-2149006/
- https://en.wikipedia.org/wiki/Skin_gambling
