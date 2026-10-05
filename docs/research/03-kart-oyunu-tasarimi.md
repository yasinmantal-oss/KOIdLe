# 03 — Kart Oyunu Tasarımı Araştırması

> Kapsam: Hearthstone tarzı, Knight Online esintili (özgün IP) karanlık-fantezi MMORPG dünyasında geçen, kalıcı RPG karakterli (Warrior/Rogue/Mage/Priest), ekipman tabanlı, F2P mobil + Steam kart savaş oyunu.
> Tarih: Ekim 2026. Kaynaklar dosyanın sonunda. Metindeki rakamlar kaynaklardan alınmış ve kendi cümlelerimle özetlenmiştir. Kesin doğrulanamayan veriler "(tahmini / zayıf kaynak)" diye işaretlenmiştir.

---

## Özet

1. **Hearthstone formülü hâlâ referans**: 30 kartlık deste, 1→10 mana kristali, 2 manalık sabit kahraman gücü, dayanıklılıklı silahlar, 7 yaratık alanı, 10 kartlık el, 75 sn tur süresi + "fitil" (rope), boş desteden çekişte artan yorgunluk hasarı. Başarısının özü "derinlik yüksek, karmaşıklık düşük" ilkesi ve ekranda ~8–9 kelimeyi geçmeyen kart metinleri. Ortalama maç ~6 dk (zayıf kaynak), mobil oturumla uyumlu.
2. **Ekipmanın kart verdiği oyunlar var ve dersleri net**: Card Hunter'da destenin tamamı ekipmandan gelir; mana yoktur, güçlü eşyalar zorunlu "kusur kartları" (drawback) ile dengelenir; PvP'de karakter seviyesi 18'e sabitlenir ama eşya farkı yine de avantaj yaratır. Gordian Quest / Deep Sky Derelicts'te her eşya desteye kart ekler ve "istemediğim kart desteyi kirletiyor" gerilimi oluşur. Duelyst artefaktları kahramana takılır ve hasar aldıkça dayanıklılık kaybeder — bizim ekipman fikrine en yakın PvP örneği.
3. **Kalıcı güç + adil PvP**: Başarılı örneklerin tamamı (Guild Wars 2 sPvP, Lost Ark Arena, Black Desert Arena of Solare, Clash Royale Turnuva Standardı) dereceli/rekabetçi PvP'de **istatistikleri normalize eder**. Başarısız/tartışmalı örnekler (Diablo Immortal, Raid: Shadow Legends, Hearthstone Mercenaries PvP) ham gücü PvP'ye taşır. WoW Legion şablonları ise "eşyam hiç önemsiz" hissi yüzünden sevilmedi. **Önerimiz: üç katmanlı model** — (a) Dereceli Arena tam normalize (sayılar eşit, sadece yatay/sidegrade seçimler ve kozmetikler taşınır), (b) Açık Arena yumuşak tavanlı (Albion tarzı, tavan üstü gücün %20'si sayılır) + gear-score braketi, (c) PvE tam güç.
4. **PvE**: Naxxramas tarzı "boss'a özel kahraman gücü", Path of Champions tarzı aylık özel kurallar, Slay the Spire tarzı "niyet" (intent) göstergesi; farm için 3-yıldız sonrası "Hızlı Av" (sweep) ve temizlenmiş içerikte otomatik savaş. LoR'da oyuncuların %70–80'i PvE'deydi ve PvE, PvP'den daha kârlı çıktı — PvE'yi yan mod değil ana sütun olarak tasarlayın.
5. **Gerçek zamanlı 1v1**: 60 sn yeniden bağlanma penceresi (Hearthstone), oyun duraklamaz; LoR tarzı zaman bankası; HS 2020 lig yapısı (5 lig × 10 rütbe, taban rütbeler, aylık sıfırlama + yıldız bonusu, gizli MMR) veya Snap tarzı 100 rütbe/küp sistemi.
6. **Para kazanma**: Sadece kozmetik riskli — Riot, LoR'da kozmetiklerin çoğu zaman üretim maliyetini bile çıkarmadığını açıkça söyledi. Snap kozmetik (variant) + aylık ~10$ sezon bileti ile ayda yaklaşık 8–9 M$ seviyesine çıktı (2023, tahmini) ama "harcama derinliği yetersiz" eleştirisi aldı. Bizim avantajımız: MMO kozmetiği (zırh görünümü, kanat, aura, +10 parıltısı, binek/evcil hayvan) kart oyunu kozmetiğinden çok daha değerli algılanır.
7. **Onboarding**: Önceden hazır deste, kademeli mekanik/mod açılışı, yıldız kaybedilmeyen "Çırak Ligi", atlanabilir öğretici, kısa metinler, kaybı yumuşatan sunum ("Kaçtın!").
8. **Önerilen savaş modeli** (detay son bölümde): 20 kartlık deste (16 meslek kartı + 4 ekipman kartı), 1→8 MP, 30 HP (Dereceli), 5 alanlı tahta, 3/4 kartlık başlangıç eli + mulligan, 8 kart el sınırı, 40+15 sn tur süresi + 30 sn zaman bankası, 10. turdan sonra "Arena Çöküşü", hedef maç süresi 6–8 dk.

---

## 1. Hearthstone'un çekirdek döngüsü ve mekanikleri

### Bulgular

| Mekanik | Hearthstone'daki karşılığı | Neden önemli |
|---|---|---|
| Deste | 30 kart; her karttan en fazla 2, efsaneviden 1 | Tutarlılık ile çeşitlilik arasında denge |
| Kaynak | Tur başına +1 mana kristali, 1'den 10'a; harcanmayan mana devretmez | "Mana eğrisi" kavramı: her turda maliyetini tam kullanmak = tempo |
| Kahraman gücü | Sınıfa özel, 2 mana, her tur kullanılabilir | Kartları karmaşıklaştırmadan sınıf kimliği ve "ölü el" kurtarıcısı. Eric Dodds: kartlara özellik yığmak yerine tek sabit güç eklemek derinliği korudu. |
| Silah | Kahramana saldırı + dayanıklılık (her saldırıda -1) | Kahramanın kendisinin savaşması; bizim "silah ekipmanı" fikrinin doğrudan karşılığı |
| Tahta | Taraf başına 7 yaratık | Mobil ekranda okunabilirliğin üst sınırı |
| El | En fazla 10 kart; fazlası yanar | Kart çekme gücünü sınırlar |
| Başlangıç | İlk oyuncu 3, ikinci oyuncu 4 kart görür; tek seferlik mulligan; ikinci oyuncuya "The Coin" (+1 mana bir kez) | İlk el şansını azaltır, ilk oynama avantajını telafi eder |
| Yorgunluk | Boş desteden her çekişte 1, 2, 3… artan hasar | Sonsuz maçı engeller |
| Tur süresi | 75 sn + animasyon payı; son ~20 sn'de "fitil" yanar; boşta kalan oyuncunun sonraki turu kısalır | Bekleme süresini sınırlar |
| Maç sonu güvencesi | 90. turda (≈ her oyuncu 45 tur) otomatik beraberlik | Sonsuz döngü güvencesi |
| Nadirlik | Common/Rare/Epic/Legendary; üretim maliyeti 40/100/400/1600 toz; altın versiyonlar 400/800/1600/3200 | Koleksiyon hedefi + kozmetik premium katmanı |

**Neden işe yarıyor (tasarım ilkeleri):**
- **Düşük karmaşıklık, yüksek derinlik.** Ekip geleneksel TCG'lerdeki "tap", anlık müdahale gibi unsurları attı. Ama "summoning sickness"ı (yeni çıkan yaratığın o tur saldıramaması) kaldırmayı denediklerinde derinliğin kaybolduğunu gördüler ve geri koydular — sadeleştirme her zaman iyi değil.
- **Kelime sınırı.** Ben Brode'a göre oyuncular ekranda ~8 kelimeyi geçen metni okumuyor; Hearthstone kart ortalaması ~9, Marvel Snap ~11 kelime.
- **Duygu odaklı tasarım.** Karşı-büyü (counterspell) gibi "oynaması keyifli, maruz kalması sinir bozucu" mekanikler bilinçli olarak çıkarıldı.
- **Rakibin turunda etkileşim yok** → mobilde dikkat dağılsa da oyun bozulmaz.
- **Maç süresi.** Ortalama ~6 dk (zayıf kaynak); turları sonuna kadar kullanan rakiplerle 15–20 dk'ya çıkabiliyor — Snap'in çözmeye çalıştığı sorun bu.

### Bizim oyun için öneri
- Hearthstone'un "mana eğrisi + kahraman gücü + silah dayanıklılığı" üçlüsünü **iskelet** olarak alın; bunlar KO'daki "MP harcayarak skill basma", "meslek temel skilli" ve "silah"a doğal olarak eşleşir.
- Kart metinlerinde **8–10 kelime** sınırı koyun; anahtar kelimeler (Kalkan, Zehir, Sersemlet, Kanama) ile metni kısaltın.
- İkinci oyuncu telafisi şart (Coin benzeri "Hız İksiri").
- Tahta sınırını mobil için **5'e** düşürün (aşağıda gerekçe): bizim oyunda odak "kahraman + ekipman", yaratık sürüsü değil.
- Sonsuz maç güvencesi olarak yorgunluk yetmez; daha kısa deste ve tur bazlı "çöküş" mekaniği önerilir (Bölüm 8).

---

## 2. Diğer dijital kart oyunları ve yenilikleri — özellikle ekipman → kart sistemleri

### 2.1 Genel tablo

| Oyun | Ana yenilik | Bizim için dersi |
|---|---|---|
| **Legends of Runeterra** | Saldırı jetonu turdan tura el değiştirir; rakip turunda tepki büyüleri; 3'e kadar harcanmamış mana "büyü manası" olarak saklanır; 20 HP; kart paketi yerine haftalık ödül + joker kart | Cömert ekonomi oyuncuyu sevindirdi ama gelir getirmedi (Bölüm 6). Path of Champions PvE modu oyuncuların %70–80'ini çekti. |
| **Marvel Snap** | 12 kartlık deste, 6 tur, 3 lokasyon, **eşzamanlı turlar**, tavla katlama küpünden esinli "Snap" bahsi; ortalama maç ~3 dk | Mobilde bekleme süresini öldüren en güçlü fikir eşzamanlı tur. Kaybı "Kaçtın!" diye sunmak. 9 farklı Snap varyantı prototiplendi. |
| **Gwent** | Mana yok; 3 raunt, 2'sini kazanan alır; el tüm raunda taşınır; "pas geçme" zihin oyunu | Kaynak yönetimini kart avantajına taşımak; "kuru pas" sorunu ve denge sıkıntıları; 2023'te aktif geliştirme bitti, oyun topluluğa devredildi. |
| **Shadowverse** | "Evrim" puanları: ilk oyuncu 2, ikinci 3 puan alır ve bir tur erken evrimleştirir (+2/+2, anında saldırı) | İkinci oyuncu telafisini mekaniğe gömmek; yine de ikinci oyuncu bazen %50'yi aşıyor — telafi kalibrasyonu zor. |
| **Elder Scrolls: Legends** | 2 şerit (biri "gölge şerit": bir tur saldırılamaz); 25/20/15/10/5 HP'de kırılan "rünler" kart çektirir; "Kehanet" kartı bedavaya oynanır | Geri dönüş (comeback) mekaniği — **boss faz geçişlerine** birebir uyarlanabilir. |
| **Magic: The Gathering Arena** | Kağıt oyunun dijitali; tek maçlık (Bo1) modda başlangıç eli "yumuşatma" algoritması (genel bilgi) | Kaynak kartı (land) içeren sistemlerde şans sorununu algoritmayla azaltma. |
| **Eternal** | Güç (power) kartları destenin 1/3–2/3'ü; çekiliş algoritması iyileştirmeleri | Kaynak kartlı modelin "kaynak kıtlığı/fazlası" riskini gösterir. |
| **Shadow Era** | Her kart, kurban edilerek kalıcı kaynağa çevrilebilir | Ölü kartı kaynağa çevirmek kötü eli azaltır — **eşya kartlarının ölü kalmaması** için iyi fikir. |
| **Faeria** | Altıgen tahta; her tur "güç çarkından" arazi yerleştir/kart çek/kaynak al seçimi | Kaynak kazanımını bir karar haline getirmek; ama mobilde karmaşık. |
| **KARDS** | Ön hat (frontline) + destek hattı; "Kredit" hem kart oynamaya hem birlik hareketine harcanır; 12'ye kadar doğal artış | Kaynağı "hareket/saldırı"ya da harcatmak → MMO'daki "skill MP'si" hissine yakın. Tüm kartlar oynayarak kazanılabilir. |
| **Duelyst** | Kahramana en fazla 3 artefakt; her artefakt 3 dayanıklılık, kahraman hasar aldıkça -1 | **Ekipman fikrine en yakın PvP örneği**: eşya etkisi kalıcı ama yıpranır, rakip onu "kırmak" için oynar. |
| **Slay the Spire / Monster Train** | Roguelite deste kurma; StS'de düşman "niyet" (intent) göstergesi; Monster Train'de 3 katlı dikey savaş | PvE düşman tasarımı: niyeti göstermek kararı anlamlı kılar. StS ekibi prototipten itibaren her oyuncu kararını ölçen metrik sunucusu kurdu. |
| **Hearthstone Battlegrounds** | 8 oyunculu auto-battler; HS'in en popüler yan modlarından | "Kısa karar + otomatik savaş" mobilde güçlü; Tavern Pass ile kozmetik + (tartışmalı) ek kahraman seçeneği satılıyor. |
| **Hearthstone Mercenaries** | Seviye/yetenek/ekipman kademeli kalıcı birlikler, otomatik çözülen savaş fazı, PvP | **Bizim için en önemli uyarı** (2.2'de). |
| **Hearthstone Duels** | PvP'de roguelite "hazine"ler (pasif etkiler) | Pasif eşyaların sürekli yeni kartlarla etkileşmesi bakım yükü yarattı; 2024'te kaldırıldı. |
| **Hand of Fate** | Ekipman da bir kart; kafa/gövde/yan/silah/yan el slotları; zar/sarkaç/çark "gambit"leri | Eşya = kart görselleştirmesi ve RPG slot hissi. |
| **Thronebreaker** | Gwent motoruyla el yapımı bulmaca savaşları ve hikâye | PvE'de "özel kurallı el yapımı karşılaşma" değeri. |
| **Inscryption** | Türün kendisiyle oynayan meta-anlatı; kurban ile kaynak | Atmosfer ve gizem; karanlık fantezi tonu için ilham. |

> Not: "Legends of Kingdom" ve brief'teki "Cardfight" (muhtemelen Cardfight!! Vanguard) hakkında tasarım açısından güvenilir kaynak bulamadım; rapora dahil edilmedi.

### 2.2 Ekipmanın kart verdiği / desteyi değiştirdiği oyunlar

**Card Hunter (en yakın örnek):**
- Destenin tamamı ekipmandan gelir. Her eşya önceden tanımlı bir kart paketi getirir (ör. bir zıpkın: 1 güçlü atış + 3 sıradan saldırı + 2 kusur kartı).
- Karakter başına ~12 slot; sınıfa göre slot türleri farklı (savaşçıda 3 silah slotu, büyücüde cüppe/arkan/asa, rahipte kutsal eşya). 3 karakter × 12 slot ≈ 36 kartlık deste kararı.
- **Mana yok** → güç dengesi iki yolla: (1) **kusur kartları** (siyah başlıklı; çekilince zorunlu oynanır, ör. "kalkanı düşür"), (2) **güç jetonları** — yüksek kaliteli eşyalar jeton tüketir, toplam jeton sayısı seviyeyle sınırlı (en fazla 8). Böylece "en güçlü 12 eşyayı tak" yapılamaz.
- Daha düşük seviyeli bir eşya stratejiye daha iyi uyabilir — eşya seçimi saf güç değil, **sinerji** kararıdır. İyi oyuncuyu ortalamadan ayıran şey kusur kartlarını desteye uyumlu hâle getirmek.
- PvP'de karakterler 18. seviyeye sabitlenir ama eşyalar taşınır; tek/çok oyunculu eşya ayrımı yok → "hafif pay-to-win" algısı ve "aslında tek oyunculu oyun" eleştirisi.

**Gordian Quest / Deep Sky Derelicts:**
- Her eşya desteye 1 kart ekler (ör. asa → 1 Büyülü Füze). Soketli eşyaların "doğal" kartı zorunlu eklenir.
- Gerilim: istatistik için takmak istediğin eşya, istemediğin kartla desteyi "kirletebilir". Bu bir özellik de olabilir (seçim), sinir bozucu da (zorunluluk).

**Duelyst artefaktları:** Ekipman kahramana takılı kalıcı etki; dayanıklılık hasar alınca düşer, bazı kartlar onarır. Rakibin "zırhını kırmak" hedefi yaratır.

**LoR Path of Champions:** Kalıcı ilerleme (şampiyon seviyesi, yıldız güçleri, nadirlik kademeli **relic slotları** — sıradan slota nadir relic takılamaz, en fazla 3 relic) **sadece PvE'de** geçerli. Riot kalıcı gücü PvP'ye hiç taşımadı.

**Hearthstone Mercenaries:** Her paralı askerin yetenek seviyeleri ve ekipman kademeleri var; PvP'de "maxlanmış takım maxlanmamışı yener". Eşleştirme seviye/ekipmana göre yapılsa da mod "grind'ı para ile atla" sistemine göre tasarlanmış algılandı; 18 aydan kısa sürede içerik güncellemesi durdu.

### Bizim oyun için öneri
1. **Ekipman kartı sayısını sınırlayın.** Card Hunter gibi tüm desteyi ekipmandan kurmak, oyunu "eşya listesi optimizasyonuna" çevirir ve PvP adaletini imkânsızlaştırır. Bunun yerine: desteye ekipmandan en fazla **4 kart** girsin (silahtan 2, zırh setinden 1, takıdan 1). Geri kalan 16 kart meslek kart havuzundan seçilsin.
2. **Ekipman kartları güç değil, kimlik versin (yatay güç).** Farklı silahlar farklı *oyun tarzı* kartı versin (hızlı çift vuruş vs. ağır yarma), ama aynı "güç bütçesinden". +1..+10 yükseltme PvE'de kartın sayılarını büyütsün; Dereceli'de normalize edilsin.
3. **Kusur kartı fikrini "efsanevi/lanetli" eşyalarda kullanın.** Çok güçlü bir eşya (ör. "Lanetli Kılıç") bir "Lanet" kartını da desteye eklesin. KO'nun karanlık-fantezi tonuna da uyar.
4. **Ölü eşya kartını önleyin.** Shadow Era'dan esinle: elindeki bir ekipman kartını "Parçala" ile 1 MP'ye/1 Zırha çevirebilme.
5. **Silah = kahraman saldırısı + dayanıklılık (HS) ve zırh = Duelyst artefaktı gibi yıpranan kalkan.** Rakibin "zırh kırıcı" kartları anlamlı olur.
6. **Mercenaries hatasını tekrarlamayın**: PvP'de kalıcı sayısal güç taşımayın; grind'ı "satmak için" tasarlamayın.

---

## 3. Kalıcı RPG ilerlemesi + adil PvP nasıl birleşir?

### Bulgular

| Oyun | Model | Sonuç |
|---|---|---|
| **Guild Wars 2 (sPvP)** | Tüm karakterler ve eşya istatistikleri eşitlenir; PvE eşyasının rün/sigil/istatistiği yok sayılır; ayrı PvP build paneli (rün seti, sigil, PvP muska) | Uzun ömürlü, "beceri belirler" algısı yerleşik |
| **Lost Ark (Arena)** | Tüm arena modları eşitlenmiş: eşya, gravür, mücevher, kart setleri, rünler önemsiz; maksimum yetenek puanı ve sabit ikincil istatistik dağıtımı | Gear grind'lı bir oyunda bile rekabetçi PvP adil sayılıyor. Açık dünya PvP adalarında ise eşya geçerli. |
| **Black Desert (Arena of Solare)** | 3v3, eşitlenmiş eşya; iksir/yemek yasak; AP/DP/isabet/kaçınma sabit oranla uygulanır | "En çok pay-to-win" algılanan MMO'lardan birinde adil mod ihtiyacı |
| **Clash Royale (Turnuva Standardı)** | Kral ve kart seviyeleri bir tavana (önce 9, 2021'den beri 11) indirilir | Seviye sistemi olan mobil oyunda normalize mod; özel turnuvada tavan 11–14 seçilebilir |
| **Albion Online (Arena / Kristal Arena / 1v1)** | **Yumuşak tavan**: Ör. 800 IP üstü gücün sadece %20'si sayılır (1168 IP → 874); giriş için ortalama 700 IP şartı | Eşya hâlâ "biraz" önemli ama uçurum yok — orta yol |
| **ESO (Battlegrounds)** | Champion Point'ler etkisiz, eşya ve beceri geçerli | Kısmi normalize; yeni oyuncular için tam eşitleme talepleri var |
| **WoW Legion (şablonlar)** | Eşya istatistikleri yok sayıldı, uzmanlığa göre sabit şablon; ortalama ilvl 800 üstü her puan PvP statlarına +%0,1 | Denge kolaylaştı ama "mücevher/büyü/trinket PvP'de işe yaramıyor" hissi RPG oyuncusunu kızdırdı; kaldırıldı |
| **Card Hunter** | Seviye 18'e sabit, eşya taşınır, eşleştirme beceri/eşyaya göre | Hafif pay-to-win algısı |
| **Diablo Immortal** | Battleground'da "Resonance" (ödeme ile büyüyen güç) geçerli; eşleştirme harcamaya göre ayırmıyor | ~100 bin $ harcayan oyuncu 48–72 saat eşleşme bulamadı; ücretsiz oyuncuların ezildiği şikâyetleri; büyük tepki |
| **Raid: Shadow Legends** | Arena tamamen hesap gücüne dayalı | P2W algısı çok yüksek; arena eşleştirmesi en çok şikâyet edilen konu; en iyi eşya setlerinin arenadan çıkması kısır döngü |
| **Hearthstone Mercenaries** | Seviye/ekipman taşınır, eşleştirme güce göre | PvP tekrarlı ve "maxlanmışın oyunu" algısı |

**Çıkarımlar:**
1. Rekabetçi (dereceli, ödüllü, liderlik tablolu) PvP'de **sayısal gücü normalize etmeyen hiçbir oyun "adil" algısı yakalayamamış.**
2. Tam normalize, RPG oyuncusuna "farm boşa" hissi verebilir (WoW Legion). Çözüm: **yatay seçimler** (hangi silah tipi, hangi set bonusu, hangi kartlar) taşınsın; **dikey sayılar** (+10, item level, stat) taşınmasın. GW2 bunu "PvP build paneli" ile, Lost Ark "sabit puanı istediğin ikincil statlara dağıt" ile çözüyor.
3. Güce göre eşleştirme (gear score braketi) tek başına çözüm değil: Diablo Immortal'da üst uçta oyuncu havuzu boşaldı; alt uçta yeni oyuncular hep dezavantajlı.
4. Gücün geçerli olduğu bir PvP alanı **ayrı ve isteğe bağlı** olursa sorun değil (Lost Ark PvP adaları, Albion açık dünya).

### Bizim oyun için öneri — "Üç Katmanlı Arena" modeli

**A) Dereceli Arena (rekabetçi, sezonluk, liderlik tablosu)** — **Tam normalize**
- Herkes "Arena Şablonu" ile girer: sabit seviye (ör. 60), sabit HP (30), sabit MP eğrisi.
- Ekipmanın **sayısal** katkısı (+N, stat, HP) sıfırlanır.
- Taşınan şeyler: (1) meslek kartları — hepsi Dereceli'de açık (Lost Ark'ın "maksimum yetenek puanı" yaklaşımı; koleksiyon kilidi yok), (2) **ekipman kartları** — ekipman *tipi* (kılıç/balta/hançer/asa…) ve *set bonusu* seçimi yatay sidegrade olarak; sayılar şablondan gelir, (3) **tüm kozmetik**: +7/+8/+9/+10 parıltıları, set görünümleri, unvanlar. Böylece +10 silahın Dereceli'de "gösterişi" var, gücü yok.
- Ekipman kartlarına erişim: *her tipin bir "standart" versiyonu herkese açık*; nadir/efsanevi eşyaların kartları **aynı güç bütçesinde alternatif efektler** sunar ve sahip olunca açılır (HS'te efsanevi kart sahibi olmak gibi, ama sayısal üstünlük olmadan). Denge ekibi bunları ayrı bir "Arena kart listesi" olarak dengeler (PvE'den bağımsız — Duels'in "pasif eşya + yeni kart" bakım yükünü azaltır).

**B) Açık Arena / "Kan Arenası" (ödülsüz veya düşük ödüllü, eğlence)** — **Yumuşak tavan + braket**
- Gear Score'a göre braketler (ör. 5 braket) + braket içinde MMR.
- Albion tarzı yumuşak tavan: braket tavanını aşan gücün %20'si sayılır.
- Bu mod "farmın PvP'de hissedilmesi" ihtiyacını karşılar; liderlik tablosu yok, Dereceli ödülleri yok.

**C) PvE ve etkinlikler** — **Tam güç**. Farm, ticaret, +10 yükseltmenin asıl sahnesi.

**Ek koruma kuralları:**
- Dereceli ödülleri kozmetik + Dereceli'ye özgü unvan/çerçeve; PvE gücü veren ödül Dereceli'den çıkmasın (Raid'in "en iyi set arenadan çıkar" kısır döngüsünü önler).
- Pazar (market) yalnızca PvE ve Açık Arena gücünü etkiler; bu yüzden pazarı Dereceli'ye bağlamayın.
- **Kritik uyarı (para → güç sızıntısı):** Gerçek parayla alınan premium para birimi veya kozmetikler oyuncular arasında oyun altınıyla takas edilebilirse, para → altın → +10 eşya zinciri oluşur ve "güç satmıyoruz" iddiası PvE/Açık Arena'da çöker. Öneri: premium para birimi **takas edilemez**, satın alınan kozmetikler hesaba bağlı; pazar sadece oyun içi kazanılan eşya/altınla çalışsın.

---

## 4. Yapay zekâya karşı PvE kart savaşları

### Bulgular
- **Boss'a özel kahraman gücü (Hearthstone Naxxramas):** 15 boss, 28 boss'a özel kahraman gücü. Örnek: her tur tahtadaki tüm yaratıkların saldırı/canını değiştiren ya da rastgele iki yaratığı ele geri yollayan güçler. "Kahramanlık" (Heroic) zorlukta güçler daha sert, boss canı 45. Eleştiri: 30 kart + kahraman gücü formatında varyasyon sınırlı; geç boss'lar daha az özenli bulundu.
- **Özel kurallı aşamalar (LoR Path of Champions Aylık Mücadele):** Aşamanın özel kuralı ile boss gücünün sinerjisini çözmek asıl bulmaca; oyuncu kalıcı yıldız güçleri ve relic'lerle "kuralı oyuna karşı çevirir".
- **Niyet (Slay the Spire):** Düşmanın bir sonraki turda saldırı/savunma/buff/debuff yapacağı ve saldırı miktarı gösterilir; boss'lar çoğunlukla iki niyet birden gösterir. Sıralı tur yapısı sayesinde oyuncu "bu tur hasar almadan nasıl kurtulurum" planlayabilir.
- **Faz geçişi (ESL rünleri):** Belirli HP eşiklerinde tetiklenen olaylar dramatik geri dönüş yaratır — boss fazlarına doğrudan uyarlanabilir.
- **El yapımı karşılaşma (Thronebreaker):** Kart savaşlarını "bulmaca" gibi tasarlamak, rutin farm hissini kırar.
- **Farm verimliliği (mobil RPG pratikleri):** Tamamlanmış (genelde kusursuz/3 yıldızlı) aşamalar enerji veya bilet harcanarak "sweep" ile anında çözülebilir; hedef kitle tüm gün oynayamayan yetişkinler. Enerji sistemi aşırı oynamayı sınırlar ama "enerji doluyken girmeliyim" baskısı yaratır; enerji kullanmayan alternatif modlar (kule vb.) önerilir. Epic Seven gibi oyunlarda yoğun eşya sistemi otomatik savaşı zorunlu kılıyor; oyuncu emeğini zor manuel savaşlara ayırıyor.
- **Mercenaries uyarısı:** Bir paralı askeri maxlamak için ~600 savaş, en verimli farm için aynı ilk seviyeyi tekrar tekrar oynamak → "RPG grind'ının eğlencesiz yarısı". Grind'ın sıkıcı kısmını otomatize etmek yerine para ile atlatmaya yönelik tasarım algısı.
- **LoR verisi:** Oyuncuların %70–80'i PvE'deydi; Riot, PvE'nin PvP'den "belirgin şekilde daha kârlı" olduğunu açıkladı. PvP üretimi kaynakların %90'ını yiyordu.

### Bizim oyun için öneri
**Karşılaşma türleri ve süreleri (mobil 2–5 dk oturum hedefi):**

| Tür | Süre | Yapı |
|---|---|---|
| **Av (sıradan mob)** | 60–120 sn | Rakip AI küçük deste (10–12 kart), 15–25 HP, tahta 3 alan, mulligan yok. 3 yıldız = "X turda bitir / Y'den az hasar al / ekipman kartı ile bitir". |
| **Elit mob** | 2–4 dk | 1 özel kural (ör. "Her tur ilk oynanan kart 1 MP pahalı") + 1 pasif. |
| **Boss (zindan sonu)** | 4–7 dk | 2–3 faz (HP %66 ve %33 eşikleri; ESL rünü gibi faz geçişinde boss kart çeker/form değiştirir), boss'a özel güç, büyük saldırılar için **niyet göstergesi** (bir tur önceden "Kıyamet Darbesi: 12 hasar" gibi). Normal/Kahramanlık zorluk. |
| **Dünya/Klan Boss'u** | 2–3 dk deneme | Asenkron: herkes hasar puanı kasar, ortak HP havuzu düşer; günlük deneme hakkı. |
| **Haftalık Kule / Mücadele** | değişken | Path of Champions tarzı aylık özel kurallar + sıralama; enerji harcamaz. |

**Farm döngüsü (MMO hissi + mobil oturum):**
1. **Hızlı Av (sweep):** Bir aşamayı 3 yıldızla bir kez geçince, aynı enerji ile anında çözülebilir. 1–10 tekrar seçeneği. Sweep "bileti" ayrı bir satış ürünü olmasın — enerji yeterli (bilet satmak, takas edilebilir eşya ekonomisinde dolaylı güç satışı olur).
2. **Oto-savaş:** Temizlenmiş içerikte AI senin desteni oynar (hızlandırılmış animasyon); ilk kez geçişte kapalı.
3. **Kamp / boşta ganimet:** Çevrimdışıyken küçük ganimet birikir (8–12 saat tavan) — KO'daki "AFK kasma" kültürünün meşru, sınırlı karşılığı.
4. **Enerji:** Cömert (günde 3–4 oturumu karşılar); enerji kullanmayan modlar (Kule, Arena, Klan Boss'u) bol.
5. **Drop tasarımı:** MMO hissi için "nadir drop anı" önemli — boss sonunda sandık açılışı, düşük ihtimalli efsanevi; ama pity (kötü şans koruması) ekleyin.
6. **PvE'yi ana sütun yapın**, PvP'yi değil — LoR verisi ve maliyet yapısı bunu destekliyor. Ama PvE içeriği pahalı; bu yüzden **sistemik varyasyon** (özel kurallar, afiksler, rastgele modlar) el yapımı içeriği çoğaltmalı.

---

## 5. Mobilde gerçek zamanlı 1v1

### Bulgular
- **Tur süresi:** Hearthstone 75 sn (+ son ~20 sn fitil). Marvel Snap eşzamanlı turlarda ~30–40 sn (ilk turlar kısa, son turlar uzun), 6 tur sabit → maç 3–4 dk tavanlı. Sıralı turlu oyunlarda maç süresi iki oyuncunun toplam düşünme süresiyle çarpılır; HS maçları rakip ipe kadar oynarsa 15–20 dk'ya çıkabilir.
- **LoR zaman yönetimi:** "Zaman bankası" (turu erken bitirene ek süre birikir) ve "zaman azalması" (aynı turda tekrarlayan aynı tip aksiyonlarda bir sonraki aksiyon için süre kısalır; raunt başında sıfırlanır) — oyalamaya karşı.
- **Bağlantı kopması (Hearthstone):** 60 sn yeniden bağlanma penceresi, oyun duraklamaz (tur süresi işlemeye devam eder); süre dolarsa kalan oyuncu kazanır; ikisi de koparsa beraberlik; animasyon 25 sn'yi aşarsa istemci otomatik yeniden bağlanmayı dener.
- **Snap'te geri çekilme:** Masadaki küp kadar kayıp; geri çekilen yine de görev ilerlemesi ve oynanan tur başına ödül alır — "kaybetme cezası" yumuşatılır.
- **Ladder tasarımı:**
  - *Hearthstone (2020 sonrası):* 5 lig (Bronz–Gümüş–Altın–Platin–Elmas) × 10 rütbe, sonra Efsane. Rütbe başına 3 yıldız; galibiyet serisi bonusu; her ligin 10. ve 5. rütbesi taban (düşülmez). Her ay Bronz 10'a sıfırlanır ama önceki ay rütbesine göre **yıldız bonusu** verilir (iyi oyuncu hızla yerine döner). Hedef: daha fazla MMR tabanlı eşleştirme ve rütbenin beceriyi daha iyi yansıtması. Yeni oyuncular için 40 rütbelik, yıldız kaybedilmeyen Çırak Ligi (sonra "Apprentice Track").
  - *Marvel Snap:* 1–100 rütbe (100 = Sonsuz); rütbe başına 7 net küp; sadece 2 taban (10 ve 100); Snap ile risk/ödül katlanır. Aylık sezon.

### Bizim oyun için öneri
- **Tur süresi:** 40 sn temel + son 15 sn fitil uyarısı + maç başına 30 sn **zaman bankası** (turu erken bitirmek +5 sn biriktirir, tavan 30 sn). İki kez üst üste zaman aşımına uğrayan oyuncunun sonraki turu 20 sn.
- **Eşzamanlı tur mu, sıralı mı?** Hearthstone hissi istendiği için **sıralı tur** önerilir (silah saldırısı, rakibin tahtasına tepki, KO'daki "skill kombinasyonu" hissi sıralı turda daha iyi oturur). Bekleme süresini düşürmek için: kısa tur süresi, rakip turunda **"hazırlık" etkileşimleri** (el düzenleme, bir sonraki tur için kart işaretleme, emote) ve rakip animasyonlarının hızlı oynatımı.
- **Bağlantı:** Sunucu-otoriter durum; 60 sn yeniden bağlanma; oyun duraklamaz, kopan oyuncunun turu süresi dolunca otomatik geçer (oto-oynatma YOK — kötüye kullanım riski ve "botla kazandı" algısı). Uygulama arka plana atılırsa da aynı kural. Mobil ağ geçişlerinde (Wi-Fi → 4G) oturum token'ı ile sessiz yeniden bağlanma.
- **Ceza/telafi:** Tekrarlı terk eden hesaplara kademeli kuyruk cezası; terk edilen oyuncuya tam galibiyet. Kopma kaynaklı kayıplarda ayda sınırlı sayıda "yıldız koruması" (tartışmaya açık; kötüye kullanılabilir — sunucu tarafı ağ verisi ile doğrulanmalı).
- **Ladder:** HS modeli (lig + yıldız + taban + gizli MMR + aylık sıfırlama ve bonus). Lig isimleri KO tonunda: ör. "Çırak, Muhafız, Şövalye, Komutan, Lord, Kral". Meslek başına ayrı rütbe gösterimi (motivasyon) ama tek MMR.
- **Sezon:** Aylık rütbe sezonu + 2–3 aylık "Büyük Sezon" (kozmetik ödüller, sezon sonu unvan/çerçeve, ilk 100 için özel aura).
- **Hile/bot:** Kart oyununda maç içi bot riski düşük ama çok hesap + pazar varsa farm botları yüksek risk; PvE farmına davranışsal tespit ekleyin.

---

## 6. Güç satmadan F2P kart oyunu gelir modeli

### Bulgular
- **Legends of Runeterra (en önemli ders):** Tez "kartları oynayarak kazan, kozmetiğe para ver" idi. Riot, kozmetik satışlarının "derinden yetersiz" kaldığını ve kozmetik üretiminin çoğu zaman kazandırdığından pahalıya geldiğini açıkça söyledi. Cömertliği geri almanın bile maliyeti kapatmaya yetmeyeceğini, klasik CCG modeline dönmeden mümkün olmadığını belirtti. Sonuç: 2024 başında ekip küçültüldü, PvP yeni kart üretimi ve dereceli ödüller/turnuva/Gauntlet durduruldu; odak daha kârlı olan PvE'ye kaydı ve PvE monetizasyonu sertleşti. Çin pazarına girememek de gelir kaybıydı.
- **Marvel Snap:** Kart *gücünü* değil kozmetik **yükseltmeleri** ilerlemeye bağladı (kart yükseltme sadece görsel; ama Koleksiyon Seviyesini artırıp yeni kart açtırır). Ana gelir: aylık ~10$ Sezon Bileti (genelde yeni bir kart içerir — yani tamamen kozmetik değil), 15$ Premium+ ve variant/çerçeve/paketler (≈10–20$+). Sensor Tower bazlı tahminlerle 2023'te aylık ~8–9 M$; ABD'de 2024 başında haftalık ~0,7–1,2 M$ bandı. İndirme başına gelir ~6,8$ (tahmini). Deconstructor of Fun eleştirisi: ilk saatlerde harcama fırsatı çok sınırlı, sezon bileti ile paketler arasında harcama basamağı yok, para birimi ekonomisi şişkin, sezon bileti performansı düşüş eğiliminde. Ders: "sıkı ekonomi ile başla, sonra gevşet".
- **Hearthstone:** Paket satışı tek başına geliri tutamadığı için Battlegrounds'ta Tavern Pass (~15–20$; kozmetik + ek kahraman seçeneği) ve kahraman yeniden seçme gibi sınırda güç satışları, 60$'a varan "signature/diamond" kart kozmetikleri, kahraman kostümleri. Topluluk bunu "agresifleşme" olarak eleştirdi.
- **Gwent:** Yeterli oyuncu tabanı oluşmadı, denge sorunları; 2023'te aktif geliştirme bitti.
- **KARDS:** Tüm kartlar oynayarak kazanılabilir; kozmetik + paketler; niş ama sürdürülebilir bir ölçek.

**Çıkarım:** Saf kozmetik model, yüksek kozmetik değer algısı (lisanslı karakter, güçlü IP, sosyal görünürlük) yoksa ve içerik üretim maliyeti yüksekse sürdürülemez. PvP kart oyunlarında yeni kart seti üretimi en büyük maliyet.

### Bizim oyun için öneri
**Avantajımız:** MMO kozmetiği kart kozmetiğinden çok daha "görünür" — karakter avatar olarak hem PvE'de, hem arena girişinde, hem şehir/lobi ekranında sergilenir. KO oyuncu kültüründe zırh görünümü, kanat, pelerin, +10 parıltısı ve binek statü göstergesidir.

**Ürün katmanları (güç yok):**
1. **Sezon Bileti** (~8–10$/ay): ücretsiz + premium şerit; premium'da kozmetik ağırlıklı + kolaylık (ek sandık yuvası, ek desteler). Yeni kart/eşya kesinlikle premium şeritte olmasın (Snap'in "bilette kart" modeli bizim prensibimizi bozar).
2. **Görünüm (transmog) setleri**: zırh/silah görünümleri, set başına 10–25$. Dereceli'de de görünür.
3. **Kart kozmetikleri**: altın/animasyonlu kart, kart arkası, meslek "ultimate" animasyonu, öldürücü vuruş animasyonu (finisher), emote.
4. **Arena tahtası/arka plan kozmetikleri**, giriş efekti, unvan çerçevesi.
5. **Kolaylık (güç dışı)**: ek karakter slotu, ek deste slotu, depo genişletme, isim değiştirme. Pazar ilan slotu satılacaksa ticaret avantajı yaratmamalı (ücretsiz limit yüksek tutulmalı).
6. **Abonelik ("Premium üyelik", KO'daki premium'a benzer)**: kozmetik aylık ödül + kolaylık; **drop/XP oranı artışı YOK** (takas edilebilir eşya ekonomisinde drop artışı = güç satışı).

**Kaçınılacaklar:** gacha ile kart/eşya satmak, yükseltme taşı/koruma kâğıdı satmak (KO'daki "upgrade scroll" satışı doğrudan güç satışıdır), enerji/sweep bileti satmak, premium para birimini takas edilebilir yapmak.

**Gelir gerçekçiliği:** Güç satmayan bir oyunun geliri, aynı DAU'daki P2W rakiplerin belki 1/3–1/5'i kadar olacaktır (tahmin, genel sektör deneyimi — doğrulanmış veri değil). Bu yüzden: (a) içerik üretimini ucuzlatın (sistemik PvE varyasyonu, kozmetiklerin modüler üretimi), (b) PvP kart seti yenilemesini yavaş tutun (yılda 2 güncelleme), (c) LoR dersini unutmayın — oyuncuların çoğu muhtemelen PvE'de olacak; monetizasyonu PvE'de de görünen karakter kozmetiğine bağlayın.

---

## 7. Onboarding / öğretici en iyi uygulamaları

### Bulgular
- **Hearthstone:** Yeni hesap önce zorunlu öğreticiyi bitirir, sonra temel zorlukta AI'ya karşı pratik maçlarla sınıf ve kart açar. 2020'de 40 rütbelik, yıldız kaybedilmeyen Çırak Ligi; 2021'den beri öğreticiyi bitiren herkese ücretsiz, yıllık dönen Core seti (235 kart). Daha sonra "Apprentice Track": modlar ve sınıflar ödül olarak açılır, "Tavern Guide" görev dizisi çekirdek sistemleri ve stratejileri öğretir.
- **Marvel Snap:** Herkese aynı önceden hazırlanmış deste; öğretici sırasında bir kartı desteye ekleyerek deste kurma ekranı öğretilir; kart havuzu "Koleksiyon Seviyesi" ile kademeli açılır (seriler hâlinde); ilk saatler özenle kürate edilmiş. Kaybı "Kaçtın" diye sunmak; az kelime.
- **Genel CCG pratikleri:** Atlanabilir etkileşimli öğretici; mekanik ve modların kademeli açılması; rekabet öncesi baskısız solo/PvE kampanya; başlangıç desteleri; basit başla.

### Bizim oyun için öneri
1. **İlk 10 dakika senaryosu**: Karakter yaratma (meslek seçimi) → KO tarzı bir giriş zindanında 3 kısa Av savaşı (her biri tek kavram: MP, temel yetenek, silah saldırısı) → ilk ganimet: bir silah düşer, takarsın, desteye 2 yeni kart girer ("Ekipman = kart" anı, ~5. dakikada) → mini boss (niyet göstergesi öğretilir).
2. **Kademeli açılış**: Deste düzenleme 5. seviye, pazar ve Açık Arena 10. seviye, Dereceli 15. seviye + 10 PvP maçı. +N yükseltme ilk boss'tan sonra.
3. **Çırak Ligi**: İlk 20 PvP maçında yıldız kaybı yok; benzer yeni oyuncularla (gerekirse açıkça işaretlenmiş eğitim botlarıyla) eşleşme.
4. **Hazır meslek desteleri**: Her meslek için 2 hazır deste ("Agresif", "Kontrol") + "Desteyi Otomatik Tamamla" düğmesi.
5. **Kısa metin**: Kart metni ≤ 10 kelime, anahtar kelimelere uzun basınca açıklama.
6. **Atlanabilirlik**: Deneyimli kart oyuncuları için öğreticiyi atla (ödülleri yine ver).
7. **Kaybı yumuşat**: PvP kaybında bile ilerleme (görev puanı, küçük ödül); "Teslim ol" yerine "Geri çekil" dili.
8. **Meslek değiştirme maliyeti düşük**: Oyuncu ilk seçtiği meslekte sıkışmasın; ikinci karakter slotu ücretsiz.

---

## 8. Önerilen savaş modeli taslağı

> Amaç: Hearthstone tanıdıklığı + KO/MMO hissi (HP/MP, silah, zırh, iksir, +10) + mobilde 6–8 dk PvP, 1–7 dk PvE. Tüm rakamlar ilk prototip için başlangıç değerleridir; metrik sunucusuyla (Slay the Spire yaklaşımı) ilk günden ölçülüp ayarlanmalıdır.

### 8.1 Temel kurallar

| Parametre | Dereceli PvP | PvE | Gerekçe |
|---|---|---|---|
| Deste | **20 kart** = 16 meslek kartı + 4 ekipman kartı | aynı | 30 kart mobil için uzun; Snap'in 12'si fazla sığ. 20 kart ile ~10 turda destenin yarısından fazlası görülür → tutarlılık. |
| Kopya sınırı | Normal 2, Efsanevi 1 | aynı | HS standardı |
| Başlangıç eli | İlk oyuncu 3, ikinci 4 + "Hız İksiri" (bir kez +1 MP) | 3 (mulligan yok, sadece boss'ta var) | HS Coin mantığı |
| Mulligan | Tek seferlik, istediğin kartları değiştir | Boss'ta var | — |
| Tur başı çekiş | 1 kart | 1 kart | — |
| El sınırı | **8** | 8 | Mobil ekran; 10 kart dar ekranda okunmaz |
| Tahta (çağrı/tuzak/totem alanı) | **5** | 5 (boss tarafı 7'ye kadar) | Odak kahraman + ekipman; mobilde okunabilirlik |
| Kahraman HP | **30** sabit | 30 + ekipman (ör. 30–70) | Dereceli normalize |
| Zırh (Kalkan) | Başlangıç 0; kartlar ve zırh kartı verir | Ekipmandan başlangıç kalkanı (ör. 0–15) | HS "Armor" mantığı |
| Tur süresi | 40 sn + 15 sn fitil uyarısı (son 15 sn) + 30 sn zaman bankası | Sınırsız (PvE), oto-savaş opsiyonel | Bölüm 5 |
| Hedef maç süresi | **6–8 dk** (tavan ~12 dk) | Av 1–2, Elit 2–4, Boss 4–7 dk | Mobil oturum |
| Maç bitirici | 10. turdan sonra "Arena Çöküşü": her oyuncu kendi tur başında 1, 2, 3… artan hasar alır; ayrıca deste biterse yorgunluk | Boss'ta "öfke sayacı" (enrage) | Sonsuz kontrol maçlarını keser |

### 8.2 Kaynak sistemi: MP + HP (MMO hissi, HS sadeliği)

**Öneri: Tek ana kaynak "MP", HS mana kristali gibi davranır; HP hem can hem bazı kartlarda ikincil maliyettir.**

- **MP:** Tur başına maksimum MP +1 artar; **1 → 8** (8. turda tavan). Her tur tamamen dolar, harcanmayan MP devretmez (sadelik). 10 yerine 8 tavanı maç süresini kısaltır ve kart maliyet aralığını 0–8'e sıkıştırır.
- **HP maliyeti (meslek kimliği):** Bazı kartlar MP yerine/yanında HP öder — özellikle Warrior ("Kan Öfkesi: 3 HP öde, +4 saldırı") ve karanlık Priest/Mage kartları. Hearthstone Warlock'unun "can öde, kart çek" kimliğine benzer ve KO'nun HP/MP dengesini hissettirir.
- **Meslek ikincil kaynağı (tek, basit gösterge):**
  - **Warrior – Öfke (0–5):** Hasar aldığında veya silahla vurduğunda +1; bazı kartlar Öfke harcar.
  - **Rogue – Kombo:** Aynı turda oynanan 2. karttan itibaren "Kombo" bonusu (ayrı sayaç yok, sadece kural).
  - **Mage – Odak:** Turu en az 2 MP harcamadan bitirirsen 1 Odak birikir (maks. 3); büyüler Odak ile güçlenir — LoR'un "büyü manası"na benzer, ama sadece Mage'de.
  - **Priest – İnanç:** İyileştirdiğin her 5 HP için +1 İnanç; İnanç ile kutsal kartlar ucuzlar.
  > Mobil sadelik için ilk sürüm sadece Warrior Öfke ve Mage Odak ile başlayabilir; diğerleri kural tabanlı kalabilir.
- **Temel Yetenek (kahraman gücü):** Her meslek için 2 MP'lik bir temel yetenek (Warrior: "Kalkan Duruşu +2 Zırh", Rogue: "Zehirli Hançer 1 hasar + Zehir", Mage: "Ateş Kıvılcımı 1 hasar", Priest: "İyileştir 2 HP"). PvE'de beceri ağacıyla temel yetenek varyantı seçilebilir; Dereceli'de varyantlar yatay (eşit bütçe) olarak açık.

**Neden saf MMO tarzı "MP havuzu" (ör. 100 MP, her tur +20 yenilenir) değil?** Havuz modeli istatistik (INT/MP) ile doğrudan büyür ve normalize etmek zorlaşır; ayrıca "biriktirip tek turda patlat" stratejisi dengeyi bozar ve mana eğrisinin sağladığı ritmi kaybettirir. Havuz hissini sadece PvE'de iksirlerle verebiliriz (aşağıda).

### 8.3 Ekipmanın savaşa etkisi

| Ekipman | Savaşa etkisi (PvE) | Dereceli PvP'de |
|---|---|---|
| **Silah** | Kahraman saldırısı + dayanıklılık (ör. 2/3); desteye **2 adet** silah kartı (silah tipine özgü: kılıç → "Yarma", hançer → "Çift Vuruş", asa → "Arkan Patlama", gürz → "Kutsal Darbe"). +1..+10: saldırı/kart sayıları büyür (ör. her +2'de +1). | Saldırı/dayanıklılık şablondan (ör. 2/3); silah **tipi** ve kartın **varyant efekti** taşınır; sayılar eşit. |
| **Zırh parçaları** (kafa, gövde, bacak, eldiven, bot) | Toplam HP bonusu ve başlangıç Kalkanı; **set bonusu** (2/3/5 parça) pasif + 5 parçada desteye **1 set kartı**. | HP şablondan (30); set kartı ve set **pasifi** yatay seçenek olarak (ör. "Gölge seti: ilk tur gizlilik" vs. "Ejder seti: ateş direnci"), eşit güç bütçesi. |
| **Takılar** (kolye, 2 küpe, 2 yüzük, kemer) | Pasifler (kritik, yaşam çalma, MP iadesi), **iksir hakkı** (kemer), 1 takı kartı (efsanevi takılarda). | Sabit 1 iksir; takı pasiflerinden **en fazla 1** seçilebilir ("Arena Mührü"), eşit bütçeli liste. |
| **İstatistikler (STR/DEX/INT/HP/MP)** | STR: fiziksel kart hasarına sabit bonus; DEX: kaçınma/ilk saldırı gibi *deterministik* bonuslar (rastgele kritik yerine "her 3. saldırı kritik"); INT: büyü hasarı; HP: maks. HP; MP: iksir etkinliği/başlangıç Odak. | Tamamen şablon. |
| **İksirler (MMO hissi)** | Savaş başına N kullanım (kemer + seviye): HP iksiri (+8 HP), MP iksiri (bu tur +2 MP); kullanmak 0 MP ama tur başına 1. | Her oyuncuya 1 standart iksir (HP veya MP, maç başında seçilir). |
| **Kusur kartı** | Lanetli/efsanevi eşyalar desteye 1 "Lanet" kartı ekler (çekilince zorunlu etki). | Aynı (yatay denge aracı). |
| **Ekipman kartı ölü kalırsa** | "Parçala": elden at → +1 Kalkan veya sonraki tur +1 MP. | Aynı. |

**Rastgelelik notu:** Ben Brode'un "girdi rastgeleliği (kararı etkileyen) iyidir, çıktı rastgeleliği (sonucu yazı-tura yapan) sinir bozar" ayrımına göre: Dereceli'de kritik vuruş/ıskalama gibi çıktı rastgeleliği kullanmayın; PvE'de sınırlı tutun.

### 8.4 PvP adalet koruması (özet)
1. **Dereceli = tam normalize** (HP 30, MP 1→8, silah şablonu, statlar yok, +N yok, iksir 1).
2. **Taşınan = yatay seçimler** (silah tipi, set pasifi, 1 takı mührü, temel yetenek varyantı) + **tüm kozmetik** (+10 parıltısı dahil). Bu, WoW Legion'daki "eşyam hiç önemsiz" hissini azaltır.
3. **Tüm meslek kartları Dereceli'de açık**; koleksiyon kilidi yok (Lost Ark'ın "maksimum yetenek puanı" yaklaşımı).
4. **Ayrı denge listesi**: Dereceli için kart/eşya değerleri PvE'den bağımsız ayarlanabilir (her kartta "PvP değeri" alanı).
5. **Açık Arena = güç geçerli ama yumuşak tavan + braket**; liderlik tablosu yok.
6. **Para → güç sızıntısı yok**: premium para takas edilemez, satın alınan kozmetik hesaba bağlı, drop/XP artışı satılmaz, yükseltme kâğıdı satılmaz.
7. **Dereceli ödülleri PvE gücü vermez** (kozmetik, unvan, çerçeve, aura).

### 8.5 Örnek bir Dereceli maç akışı (hedef ~7 dk)
- **Tur 1–3 (≈1,5 dk):** 1–3 MP; ucuz çağrılar/zehir/kalkan; Warrior silah saldırısıyla Öfke biriktirir.
- **Tur 4–6 (≈2,5 dk):** Temel yetenek + orta maliyetli kartlar; ekipman kartları (silah tipi kartı) devreye girer; iksir kararı.
- **Tur 7–9 (≈2 dk):** 7–8 MP; meslek "ultimate" kartları (Efsanevi, 1 kopya); set kartı.
- **Tur 10+ (≈1 dk):** Arena Çöküşü başlar; maç kapanır.

### 8.6 Açık sorular (sonraki tasarım adımları)
- Sıralı tur mu, Snap tarzı eşzamanlı tur mu? (Öneri sıralı; prototipte eşzamanlı bir "Hızlı Düello" modu A/B test edilebilir.)
- Tahta 5 alan + çağrı ağırlığı mı, yoksa "çağrısız, sadece kahraman + 2 şerit" (ESL'den esinli) mi? Meslek kimliği (KO'da meslekler çoğunlukla çağrı yapmaz) bunu etkiler.
- Kart elde etme: Meslek kartları seviye/beceri kitabı drop'u ile mi açılır (KO skill puanı hissi), yoksa koleksiyon/craft ile mi? Öneri: PvE'de seviye + beceri kitabı; Dereceli'de hepsi açık.
- Takas edilebilir eşyanın PvE ekonomisine etkisi (enflasyon, bot farmı) — ayrı ekonomi araştırması gerektirir.

---

## Kaynaklar

**Hearthstone**
- https://www.gamedeveloper.com/design/-iterate-fast-and-other-design-lessons-learned-from-i-hearthstone-i-
- https://hearthstone.wiki.gg/wiki/Gameplay
- https://hearthstone.fandom.com/wiki/Gameplay
- https://en.wikipedia.org/wiki/Hearthstone
- https://liquipedia.net/hearthstone/Rarity
- https://www.thegamer.com/hearthstone-crafting-tips-tricks-guide/
- https://theglobalgaming.com/gaming/average-match-time-length-hearthstone (zayıf kaynak)
- https://www.hearthstonetopdecks.com/ranked-system-rework-everyting-you-need-to-know/
- https://www.pcgamer.com/new-hearthstone-ranking-system/
- https://hearthstone.wiki.gg/wiki/New_player_experience
- https://outof.games/news/6856-hearthstone-to-introduce-a-fresh-new-player-experience-through-apprentice-track-replacing-apprentice-ranks/
- https://hearthstone.fandom.com/wiki/Curse_of_Naxxramas
- https://www.icy-veins.com/hearthstone/introduction-to-the-curse-of-naxxramas
- https://blizzardwatch.com/2023/02/07/hearthstone-mercenaries-mode-ends/
- https://esports.gg/news/hearthstone/hearthstone-mercenaries-will-no-longer-receive-content-updates/
- https://www.byteside.com/2021/11/hearthstone-mercenaries-review-great-ideas-locked-behind-a-grind/
- https://us.forums.blizzard.com/en/hearthstone/t/mercenaries-mode-too-grindy-to-be-enjoyed/100794
- https://hearthstone.blizzard.com/en-us/news/24033780/duels-runs-coming-to-an-end
- https://www.hearthstonetopdecks.com/hearthstone-duels-game-mode-will-be-removed-in-april-2024/
- https://www.gamedeveloper.com/design/why-the-i-hearthstone-i-devs-wanted-to-make-an-auto-battler
- https://inanage.com/2024/03/29/hearthstone-evolving-monetization/
- https://www.hearthstonetopdecks.com/how-pay-to-win-is-hearthstone-battlegrounds-now-the-past-and-future-of-bg-monetization/

**Marvel Snap**
- https://gdcvault.com/play/1029024/Designing-MARVEL-SNAP
- https://mobilegamer.biz/second-dinners-ben-brode-reveals-marvel-snaps-recipe-for-success-literally/
- https://developer.apple.com/news/?id=sosm2p7q
- https://www.gamedeveloper.com/blogs/designers-don-t-sleep-on-marvel-snap-s-simultaneous-turns
- https://en.wikipedia.org/wiki/Marvel_Snap
- https://marvelsnap.helpshift.com/hc/en/3-marvel-snap/faq/30-how-do-ranks-work/
- https://snapcomplete.com/faq/ranked-climb
- https://marvelsnap.helpshift.com/hc/en/3-marvel-snap/faq/29-what-does-retreating-do/
- https://www.deconstructoroffun.com/blog/2023/5/23/marvel-snap-the-definitive-deconstruction
- https://www.blog.udonis.co/statistics/marvel-snap (tahmini veriler)
- https://sensortower.com/blog/2024-q1-unified-top-5-card%20battler-revenue-us-6041466a241bc16eb8e60969
- https://marvelsnapzone.com/marvel-snap-progression-guide/

**Legends of Runeterra**
- https://en.wikipedia.org/wiki/Legends_of_Runeterra
- https://www.thegamer.com/legends-of-runeterra-eric-shen-penelope-aretos-interview/
- https://mein-mmo.de/en/legends-of-runeterra-the-lol-card-game-was-too-generous-never-made-money,1086801/
- https://www.avclub.com/legends-of-runeterra-2025-freedom-dead-game
- https://outof.games/news/4872-legends-of-runeterra-is-refocusing-on-pvp-path-of-champions-put-on-backburner-riot-developers-joining-other-teams/
- https://leagueoflegends.fandom.com/wiki/Relics_(The_Path_of_Champions)
- https://support.riotgames.com/en-us/legends-of-runeterra/gameplay/champion-levels-and-stars-the-path-of-champions
- https://masteringruneterra.com/tips-and-strategies-for-the-path-of-champions-monthly-challenge/
- https://x.com/PlayRuneterra/status/1332730979920785408

**Diğer kart oyunları**
- https://www.cardhunter.com/2011/08/dev-diary-6-exploring-deck-building/
- https://www.quartertothree.com/fp/2013/09/18/card-hunter-deck-building-mechanics/
- https://en.wikipedia.org/wiki/Card_Hunter
- https://steamcommunity.com/app/293260/discussions/0/541906348034275719
- http://tobolds.blogspot.com/2013/07/card-hunter-is-probably-not-multiplayer.html
- https://www.mmorpg.com/columns/gordian-quest-its-a-good-time-to-be-a-roguelite-deckbuilder-fan-2000118286
- https://gordian-quest.fandom.com/wiki/Equipment
- https://en.wikipedia.org/wiki/Hand_of_Fate_(video_game)
- https://duelyst.fandom.com/wiki/Artifact
- https://www.gamedeveloper.com/design/how-gwent-distinguishes-itself-from-other-ccgs
- https://www.gamedeveloper.com/business/cd-projekt-ending-active-development-on-gwent-after-2023
- https://en.wikipedia.org/wiki/Shadowverse
- https://shadowverse.com/gameguide/playguide.php
- https://en.wikipedia.org/wiki/The_Elder_Scrolls:_Legends
- https://faeria.fandom.com/wiki/The_power_wheel
- https://en.wikipedia.org/wiki/Shadow_Era
- https://en.wikipedia.org/wiki/Eternal_(video_game)
- https://en.wikipedia.org/wiki/Kards
- https://www.kards.com/what-is-kards
- https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics
- https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder
- https://slaythespire.wiki.gg/wiki/Intent
- https://en.wikipedia.org/wiki/Monster_Train

**Kalıcı güç ve PvP adaleti**
- https://wiki.guildwars2.com/wiki/Structured_PvP
- https://lost-ark.test.maxroll.gg/resources/general-pvp-guide
- https://www.mmorpg.com/news/black-desert-online-adds-first-3v3-gear-equalized-pvp-mode-arena-of-solare-2000125219
- https://www.naeu.playblackdesert.com/en-US/Wiki?wikiNo=255
- https://clashroyale.fandom.com/wiki/Tournament
- https://wiki.albiononline.com/wiki/Crystal_Arena
- https://www.albioncodex.com/guides/albion-online-arena
- https://eso-hub.com/en/guides/battleground-beginner-guide
- https://xpoff.com/threads/overview-of-legion-gearing-and-pvp-stat-templates.69460/
- https://us.forums.blizzard.com/en/wow/t/now-looking-back-on-the-legion-template-system/1376379
- https://www.gamespot.com/articles/diablo-immortal-player-paid-to-win-too-much-can-no-longer-find-pvp-matches/1100-6506060/
- https://isitp2w.com/games/raid-shadow-legends

**Mobil farm / onboarding**
- https://www.gamedeveloper.com/design/entering-the-era-of-auto-mode
- https://medium.com/@kapxapot/the-recipe-of-the-ideal-mobile-game-a5e363ed2aaf
- https://games.themindstudios.com/post/how-to-make-a-collectible-card-game-like-hearthstone/
