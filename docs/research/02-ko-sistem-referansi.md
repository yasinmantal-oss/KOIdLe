# 02 — Knight Online Sistem Referansı (Kart Oyunu Uyarlaması İçin)

> Amaç: Knight Online'ın (KO) oyun sistemlerini, bulunabilen sayılarla birlikte tek yerde toplamak. Her sistemin altında iki ek alan var: **Kart oyununa uyarlama** (Hearthstone tarzı kart savaşında nasıl karşılık bulur) ve **IP durumu** (genel mekanik mi, yoksa yeniden adlandırılması gereken KO'ya özgü bir isim mi).
>
> Tarih: 2026-10-05. Kaynaklar en altta. Sayılar çoğunlukla topluluk tahminidir; resmi değildir. Kaynaklar arasında çelişki varsa aralık olarak verildi.
>
> **Hukuki not:** "IP durumu" sütunu tasarım içindir, hukuki görüş değildir. Genel kural olarak oyun mekanikleri telif koruması altında değildir; isimler, logolar, sanat, lore metinleri ve ayırt edici marka unsurları ise korunur. Ticari kullanımdan önce bir avukata danışılmalıdır.

---

## 0. Hızlı özet: KO'yu "KO" yapan şeyler

| KO'nun hissi | Neden önemli | Kart oyunundaki en yakın karşılığı |
|---|---|---|
| İki ulus arasında kalıcı savaş (insanlar ve orklar) | Her şeyin bir "biz/onlar" bağlamı var | Ulus seçimi = hesap düzeyinde taraf, ulus bazlı sıralama ve sezonlar |
| Anvil'de +7/+8 basmak (kumar heyecanı) | KO kültürünün kalbi, en çok konuşulan konu | Yükseltme ekranı, Trina benzeri şans artırıcı, sunucu duyurusu |
| Moradon'da merchant pazarı | Oyuncular arası ticaret ekonomisi | Oyuncu pazarı, %3 vergi |
| PK, NP ve sembol (rütbe ikonu) | Statü göstergesi | Sıralamalı PvP, NP puanı, isim yanında rütbe ikonu |
| Parti rolleri (warrior vurur, priest buff/heal verir, mage TP atar, rogue swift atar) | Sınıflar birbirine bağımlı | Destede sınıf kartları + "parti" mekaniği / destek kartları |
| Pot basma (HP/MP iksiri) ritmi | PvP'de beceri | Sınırlı sayıda iksir kartı veya her turun iksir hakkı |
| Boss kesme ve unique drop (Felankor, Isiloon) | Uzun vadeli farm hedefi | PvE boss karşılaşmaları, düşük şanslı unique düşüşleri |
| Lunar War, CSW, Bifrost gibi zamanlanmış etkinlikler | "Saat 20:00'da herkes oyunda" hissi | Zamanlanmış etkinlik pencereleri |

---

## 1. Meslekler (Job/Class)

### 1.1 Genel yapı
- **4 ana sınıf**, iki ulus için de aynı: Warrior, Rogue, Mage, Priest. Sonradan 5. sınıf eklendi: **Kurian (Karus) / Porutu (El Morad)**. Bu sınıf, mutasyona uğramış barbar savaşçı temalı, yakın dövüşçü.
- **1. meslek değişimi Lv10'da.** Moradon'daki bir NPC'ye yaklaşık 3.000 Noah ödenerek yapılır. Bu değişimle 3 ana skill ağacı açılır.
- **2. meslek değişimi (Master) Lv60'ta.** Malzeme toplama görevidir ve master skill ağacını açar.
- Her sınıfın yapısı aynıdır: **1 temel (Basic) set, 3 ana ağaç, 1 Master ağacı**.
- **Skill puanı:** Lv10'dan itibaren her seviyede **2 puan** verilir. Puanlar ağaçlara dağıtılır ve bir ağaçtaki puan sayısı, o ağaçta hangi skillerin açılacağını belirler (ör. bir ağaçta 45 puan varsa "45. skill" açılır). Bu yüzden oyuncu en fazla iki ağacı "tam" doldurabilir; 3. ağaç kısmen kalır. Bu kısıt, build kimliğinin temelidir.
- Master ağacı Lv60'tan sonra açılır ve yaklaşık **0–23 puan** alır. Kaynaklardaki örnek dağılımlar: Warrior Berserker 83 / Defense 55 / Master 10, Attacker 80 / 55 / 13.
- Lv70 ve Lv80 skilleri ek görev malzemesi ister. Ör. mage'in 70+ skilleri için 5–15 adet "Spell Stone Powder" gerekir.

### 1.2 Sınıf tablosu

| Sınıf | Rol | Ana stat | Ağaçlar | Master ünvanı (El Morad / Karus) | İkonik skiller |
|---|---|---|---|---|---|
| **Warrior** | Yakın dövüş DPS + tank; PvP'de takımın "çekici" | STR (ikincil HP) | Attack, Defense, Berserker (Passion) | Blade Master / Berserker Hero | Sprint, Defense, Gain (+15 STR), Leg Cut (yavaşlatma), Binding/Provoke (aggro), Shear (+50 sabit hasar), Sword Dancing (%250 + 150), Hell Blade (%300 + 350, ıskalamaz), Scream, Iron Skin (+%30 DEF), Iron Body (pasif +%40 DEF), Berserker (+%20 saldırı hızı, -300 DEF) |
| **Rogue (Assassin)** | Tek hedefi hızla öldüren burst | DEX (ikincil HP) | Archery, Assassin (Assassinate), Explore (Search) | Kasar Hood / Shadow Bane | Stealth (80 sn görünmezlik, saldırınca bozulur), Hide (40 sn), Spike (%600), Critical Point (savunması yüksek hedefe çift hasar), Blood Drain (hedef HP'sinin %5'i), Blinding (%400 + körleştirme) |
| **Rogue (Archer)** | Uzaktan sürekli hasar, yavaşlatma ve sersemletme | DEX | aynı | aynı | Multiple Shot (3 ok), Arc Shot (%250), Arrow Shower (5 ok), Blinding Strafe (%400 + kör), elementel oklar (Ace Arrow ile yavaşlatma, Lightning Arrow ile 3 sn stun) |
| **Rogue (ortak Explore)** | Parti faydası | — | — | — | **Swift** (partiye %150 koşu hızı), **Light Feet** (kısa süreli hız patlaması, kaçış), **Minor Healing** (kendini iyileştirme), **Lupine Eyes** (50 sn görünmezleri gösterir), Cure |
| **Mage** | AoE hasar, kitle kontrolü, ışınlanma | MP (ikincil INT) | Flame, Glacier, Lightning | Arch Mage / Elemental Lord | **Summon Friend** (parti üyesini yanına ışınlar), Gate (kasabaya), Escape (partiyi kasabaya), Flame: Ignition, Hell Fire, Meteor Fall (2.100 + DoT), Supernova; Glacier: Chill, Blizzard, Frost Nova (yavaşlatma), Freezing Distance (dondurma); Lightning: Static Nova (stun), Light Shock (körleştirme), **Blink** (20 m ileri ışınlanma); Master: Mana Shield, Instantly Magic (180 sn bekleme), Minor Resist (-%20–40 direnç) |
| **Priest** | Heal, buff, debuff; partinin olmazsa olmazı | INT + STR (ekipman için), HP | Heal, Buff (El Morad: Aura, Karus: Ecstasy), Debuff (El Morad: Holy Spirit, Karus: Talisman) | Paladin / Shadow Knight | Heal serisi (240 → 360 → 720 → 960 → **1.920 Superior Healing** → Complete/Group Complete Healing (10.000 / tam dolum)), Restore (zamanla iyileştirme), **Bless of God** (partideki tüm debuffları temizler), HP buff (480 → 960 → 1.200 → 1.500 → 2.500), AC buff (200 → 300 → 350), **Malice** (-%25 DEF), **Parasite** (max HP -%20–30), **Torment** (alanda -%30 DEF), Resurrection (kaybedilen EXP'nin %60–80'ini geri verir), Master: Judgment, Helis (%250–300, savunmayı yok sayar), Curse Refraction |
| **Kurian / Porutu** | Warrior benzeri yakın dövüşçü | STR | — | Daphne Hero / Burka Master | Rakibin saldırı gücünü düşürme veya kilitleme |

### 1.3 Priest "iki ağaç" kuralı ve build arketipleri
Priest üç ağaçtan ancak ikisinde uzmanlaşabilir. Topluluk bu yüzden şu arketipleri oluşturdu: Heal/Buff (leveling'in vazgeçilmezi), Heal/Debuff (PvP'nin vazgeçilmezi, rezzer), Buff/Debuff ve **Battle Priest** (STR ile vuran, solo farm yapan priest).

Priest'in silah cezası vardır: mızrak ve balta ile yaklaşık **-%50 hasar** alır. Master'dan sonra kılıç cezası kalkar.

### 1.4 Sınıfların PvP ve parti rolleri (topluluk görüşü)
- **Warrior:** Lv60 öncesinde zayıftır, 70+ sonrasında yakın dövüş partisinin çekirdeğidir. Buff'a çok bağımlıdır. Silah çeşitliliği ve zırh savunması en yüksek sınıftır, ekipmanı da en pahalısıdır.
- **Rogue:** En hızlı sınıftır. Assassin, oyunun en yüksek anlık hasarına sahiptir. Archer PvE'de yüksek DPS yapar ama PvP'de ikinci plandadır. Solo farm'da rahattır.
- **Mage:** En kırılgan sınıftır. Skilleri zırhı yok sayar, onun yerine elementel direnç devreye girer. Oyuncuya, canavara verdiği hasarın kabaca **1/3'ünü** verir. "Mage partisi" (7 mage + 1 priest) eskiden en hızlı exp yöntemiydi. TP ve Summon, parti için büyük fayda sağlar.
- **Priest:** Her partinin zorunlu üyesidir. Heal döküm süresi yaklaşık 2,5 sn'dir, bu da kesintiye açık olduğu anlamına gelir.

**Kart oyununa uyarlama**
- **Sınıf = kahraman (hero).** Hearthstone'daki gibi bir "hero power" verilebilir: Warrior'a Defense (zırh kazan), Rogue'a Swift/Light Feet (kart çek ya da kaçış), Mage'e Burn/Chill (1 hasar + yavaşlatma), Priest'e Minor Heal.
- **3 ağaç + Master = deste arketipi.** Kartlar ağaca etiketlenir (ör. "Glacier"). Destede en fazla 2 ana ağaç + Master kartı gibi bir kural, KO'daki "iki ağacı doldurabilirsin" kısıtını birebir yansıtır.
- **Skill puanı = koleksiyon/kilit sistemi.** Karakter seviyesi skill puanı verir, puan da ağaç derinliğine göre kartın kilidini açar (ör. "Glacier 45 → Blizzard kartı"). Bu, "level atınca yeni skill" hissini korur.
- **Meslek değişimi (Lv10 / Lv60) = iki büyük ilerleme anı.** İlki ağaç seçimini açar, ikincisi Master kartlarını ve ulusa özgü ünvan kozmetiğini açar.
- Sınıflar arası bağımlılık 1v1'de doğrudan kurulamaz. Bunun yerine her destede "destek" kartları (buff/heal/TP) bulunabilir ya da 2v2 / parti modu sonraya bırakılabilir.

**IP durumu**
- **Genel (serbest):** 4 arketip, 3 ağaç + master yapısı, skill puanı sistemi, iki aşamalı meslek değişimi, heal/buff/debuff mantığı. Ayrıca "Sprint", "Defense", "Stealth", "Heal", "Blizzard", "Teleport", "Malice" gibi sözlük kelimesi olan genel skill adları.
- **Yeniden adlandırılmalı:** Ünvanlar (Kasar Hood, Shadow Bane, Blade Master/Berserker Hero kombinasyonu, Elemental Lord, Arch Mage eşleşmesi, Paladin/Shadow Knight eşleşmesi), Kurian, Porutu, Daphne, Burka. KO'ya özgü skill adları da değiştirilmeli: Light Feet, Lupine Eyes, Bless of God, Hell Blade, Sword Dancing, Helis, Superior Parasite, Instantly Magic. Ağaç adları "Aura/Ecstasy" ve "Holy Spirit/Talisman" çiftleri için de aynı durum geçerli. Tek tek kelimeler genel olsa da kombinasyon halinde KO'yu çağrıştırırlar.

---

## 2. Statlar ve formüller

### 2.1 Stat puanları
- Karakter yaratılırken **10 serbest stat puanı** verilir.
- **Lv2–60 arası her seviyede 3 puan, Lv61+ her seviyede 5 puan.**
- Taban stat üst sınırı yaklaşık **255**tir (eski sürümlerde). Eşyalardan gelen bonus bunun üstüne eklenir.
- Stat ve skill sıfırlama PUS'ta (Power Up Store) satılır. Oyunda NPC üzerinden ücretli sıfırlama da vardır.

| Stat | Etkisi |
|---|---|
| **STR** | Warrior, Kurian ve 2 elli silah kullanan priest için saldırı gücü. Tüm sınıflarda taşıma ağırlığı. Zırh ve kalkan gereksinimi. |
| **HP (Health)** | Maksimum can. 100'ü geçince savunmaya katkı yapar. Warrior ve rogue'da mana da verir. |
| **DEX** | Rogue saldırı gücü, isabet ve kaçınma. |
| **INT** | Mana havuzu. Mage ve priest'te 100'ün üstünde her 2 INT için +1 tüm elementel direnç (topluluk: "20 stat puanı INT = her elementte +10 direnç"). Stun ve donma süresini ve şansını artırır. 1 elli silah kullanan priest'in saldırı gücü. |
| **MP (Magic Power)** | Mage büyü hasarı. Eski sürümlerde PvP hasarında yalnızca **taban** MP sayılıyordu, eşya bonusu sadece canavara işliyordu. Sonradan bu kural kaldırıldı. |

- **Ekipman gereksinimleri** stat dağıtımının asıl sebebidir. Örneğin her upgrade ile zırhın STR/INT şartı +2 artar. "Paper mage" (255 MP, düşük savunma) ile "battle mage" (yüksek INT, kalkan, Complete zırh) gibi build'ler bu şartlardan doğar.

### 2.2 Hasar ve savunma formülleri
- Topluluğun çıkardığı saldırı gücü (AP) formülü yaklaşık olarak şöyle (Steam rehberi ve KO Bugda):
  `AP ≈ floor((0,005 × SilahAP × (Stat + 40)) + (Katsayı × SilahAP × Seviye × Stat) + 3) × BonusÇarpanı + TabanAP`
  Burada "Katsayı" sınıfa ve silah tipine özgüdür. Formülü resmi olarak kabul etmemek gerekir.
- **Savunma (AC/DEF):** Zırh ve HP statından gelir. Buff'lar sabit AC (+200/300/350) veya yüzde savunma (Iron Skin +%30) verir. Debuff'lar yüzde düşürür (Malice -%25, Torment -%30).
- **Silah savunması:** KO'ya özgü bir mekaniktir. Zırh parçalarında belirli bir silah tipine karşı savunma bulunur, ör. "Defence Ability (Dagger) 25". Kalkanlarda +3/+4/+5/+6 seviyede 24/32/40/48 değerleri vardır. Bu, PvP'de rakibin silahına göre ekipman değiştirme ("dagger kaskı", "spear defans") kültürünü yarattı.
- **Elementel hasar ve direnç:** Silahlarda Flame / Glacier / Lightning / Poison ek hasarı bulunur. Ek hasar her upgrade seviyesinde normal silahta yaklaşık +10, asada +8 artar (+10'da 100 / 80). Varsayılan elementler: kılıç ateş, balta buz, topuz yıldırım, hançer/yay/mızrak zehir, asa üçü de olabilir.
- **Direnç türleri:** Fire (Flame), Ice (Glacier), Lightning, Magic, Curse (Dark), Poison. Kaynaklar: direnç iksirleri (+80), mage direnç buff'ları (topluluk kısaltmaları "FR / IR / LR"), priest buff'ı Fresh Mind (zehir, magic ve curse direnci), takılar, set bonusları.
- Lightning stun şansı dirence göre düşer (topluluk iddiası): 0 dirençte yaklaşık %90, 50 dirençte yaklaşık %80, 80 dirençte yaklaşık %50.

**Kart oyununa uyarlama**
- 5 stat çok fazla. Kartta **Saldırı / Can / Mana** üçlüsüne indirgenebilir. Karakterin stat puanı "kahraman can havuzu", "maksimum mana" ve "sınıf kartlarının gücü" gibi kalıcı pasiflere dönüşür.
- **Elementel direnç = kart anahtar kelimesi.** "Ateş Direnci 2" gibi bir değer, ateş hasarını 2 azaltır. Mage destesine karşı ekipmanla direnç kurmak, KO'daki "LR/FR buff istemek" hissini verir.
- **Silah savunması = karşı-meta ekipman.** PvP öncesi seçilen bir "kalkan/kask" kartı, belirli bir silah tipinden gelen hasarı azaltır. Bu, KO'daki ekipman değiştirme kültürünü çok iyi yansıtır.
- Formülü basit tutun: `hasar = kart_gücü × (1 + statBonus) − savunma`, sonra direnç düşülür.

**IP durumu:** STR/DEX/INT/HP/MP, AC, direnç ve silah tipine göre savunma genel RPG mekanikleridir. "Fresh Mind" ve iksir isimleri (Water of Favors, Potion of Soul) KO'ya özgüdür, yeniden adlandırılmalıdır.

---

## 3. Uluslar ve ırklar

| Ulus | Tema / başkent | Irklar ve sınıf kısıtları |
|---|---|---|
| **El Morad** (insanlar, Kral Manes'in imparatorluğu) | El Morad Kalesi | **Barbarian** (yalnızca warrior), **El Moradian Erkek / Kadın** (warrior, rogue, mage, priest), **Porutu** (Kurian sınıfı) |
| **Karus** (Tuarek denilen orklar; Luferson Kalesi, kuzeydeki buzul bölge) | Luferson Kalesi | **Arch Tuarek** (yalnızca warrior), **Tuarek** (rogue, priest), **Wrinkle Tuarek** (mage), **Puri Tuarek** (mage, priest; kadın ork), **Kurian** |

- Uluslar mekanik olarak eşdeğerdir, sadece görünüm ve isimler farklıdır.
- Ulus değiştirmek pahalı ve zordur. Güncel sürümde ücretli olarak mümkündür.
- Oyunun tarihinde ırka göre küçük farklar vardı: kadın insan warrior'ın STR'si daha düşük, kadın mage'in INT'si daha yüksekti. Sonradan eşitlendi.
- Hesap başına sunucuda **3–4 karakter** vardır, ortak bankayı paylaşırlar.

**Kart oyununa uyarlama:** Ulus = hesap düzeyinde taraf seçimi (kozmetik, sıralama, nation war). Irk tamamen kozmetik olmalı, denge riski yaratmasın. Asimetrik ırklar yerine aynı sınıfın iki ulus versiyonu (farklı kart sanatı, aynı istatistik) KO'ya en sadık yaklaşımdır.

**IP durumu:** "İnsan ve ork ulusu savaşı" genel bir mekaniktir. **El Morad, Karus, Tuarek (ve türevleri), Manes, Xigenon, Cypher, Pathos, Adonis kıtası, Luferson, Piana** ise tamamen KO'ya özgüdür ve mutlaka yeniden adlandırılmalıdır. Ork tasarımı da KO'nun ayırt edici görsel diline (ör. Arch Tuarek silueti) çok yaklaşmamalıdır.

---

## 4. Eşyalar

### 4.1 Eşya türleri ve sınıfları (grade)
KO'nun "nadirlik" sistemi Diablo tarzı renkli rarity'den çok **"yükseltilebilirlik sınıfı"** üzerine kuruludur:

| Tür | Açıklama |
|---|---|
| **Normal** | Düz eşya, NPC'den alınır. |
| **Magic / Rare** | Rastgele bonuslu düşen eşyalar. Bazı rare'ler yükseltilemez, ör. silah savunmalı zırhlar. |
| **Upgrade item: Low / Middle / High Class** | Anvil'de +1'den +10'a yükseltilebilen ana eşya grubu (ismi mor görünür). Low Class eşya +7'de Middle'a, Middle eşya +7'de High'a "terfi" eder. Bu yüzden kullanılacak kağıt da değişir. |
| **Unique** | Boss veya etkinlik düşüşü. Birçok bonusu bir arada taşır. Önce Blessed Elemental Scroll (BES) ile kilidi açılır (%100 başarı, yaklaşık 500 bin Noah ücret), sonra BUS ile yükseltilir (her adım yaklaşık 250 bin Noah). |
| **Craft / Manufacture** | Forgotten Frontiers ile geldi (Krowaz seti, "Cursed/Satanism" silahları). |
| **Reverse / Rebirth** | +7 ve üzeri High veya Unique eşyanın dönüştürülmüş hali (bkz. §5). |
| **Event / Cospre / Wing** | Zaman sınırlı kozmetik + stat eşyaları (ör. Dragon Wing: +50 DEF, +%3 hasar). |

### 4.2 Zırh kademeleri
Her sınıfın kendine özgü 5 parçası vardır: **kask, pauldron (göğüs), pad (bacak), eldiven, bot**.

Klasik kademeler sırasıyla: Paper (temel) → Half-plate → Plate → Full-plate / Crystal → **Chitin / Crimson** → **Shell / Complete** (mage isimleri slash'tan sonra). Ardından 7. kademe gelir (Dragon, Mithril, Ron's, Trial), sonra 8. kademe, **Krowaz** (Lv75+, üretimle), Holy Knight, Secret (Under the Castle malzemeleriyle), Rosetta.

Zırhların ek bonus değerleri upgrade seviyesine göre artar: +1 ve +2'de 2, +3'te 4, +4'te 6, +5'te 8, +6'da 10, +7'de 12, +8'de 15, +9'da 19, +10'da 25.

### 4.3 Set bonusları
2 veya daha fazla parça giyilince bonus verilir. Bonus, parça kombinasyonuna göre değişir. Örnek Krowaz tam set bonusları:
- **Warrior:** +600 HP, +600 MP, +15 STR, +10 HP stat, Glacier ve Lightning direnci +10, Magic direnci +20
- **Rogue:** +400 HP, +500 MP, +15 DEX, Magic direnci +40
- **Mage:** +800 MP, +15 MP stat, +40 Defense
- **Priest:** +500 HP, +15 INT

### 4.4 İkonik eşya aileleri

| Eşya | Tür / kademe | Neden ikonik |
|---|---|---|
| **Raptor** | Warrior uzun mızrağı, High Class. +1'de 137 AP'den +10'da 235 AP'ye çıkar, zehir hasarı 10–100, gereken STR 200–236. Reverse versiyonu +21'e kadar çıkar. | Topluluğun "en iyi warrior silahı" kabul ettiği silah; menzili ve hasarı yüksek. "+8 Raptor" statü sembolüdür. |
| **Shard** | High Class rogue hançeri | +8 Shard basma hikayeleri forumlarda klasiktir. |
| **Elixir Staff** | High Class mage asası (+8'de yaklaşık 120 AP) | Battle mage'in standart silahı. |
| **Lobo / Lupus / Lycaon** (Pendant, Staff, Hammer) | Colony Zone boss düşüşü unique'ler (boss seviyeleri 45/50/55) | Warrior master görevinin malzemeleri. Asalardaki "%30 MP recovery", mana yenilemek için kullanılır. |
| **Chitin / Shell (Complete)** | 5. ve 6. kademe zırh | "+8 Shell" endgame hedefi; "7/12" (+7 parça / 12 bonus) jargonu buradan gelir. |
| **Chitin Shield, Scorpion Shield** | Unique kalkan, çok sayıda silah savunması | "Oyunun en iyi kalkanı". |
| **Iron Necklace, Iron Belt, Glass Belt, Skeleton Belt** | Unique takılar | Isiloon, Felankor, Talos ve Snake Queen düşüşleri; PvP'de en çok aranan takılar. |
| **Ring of Life (RoL), Ring of Courage (RoC), Ring of Magic** | Unique yüzükler | Sınıf build'lerinin standart parçası. |
| **Warrior / Rogue / Mage / Cleric Earring** | Unique küpeler | Harpy Queen ve Talos düşüşleri. |
| **Dark Vane** | Unique hançer, Lightning hasarı 30–120, +5–20 DEX, -100–190 HP | Hazine sandıklarından çıkan geç dönem unique. |
| **Gigantic Axe** (tek / iki elli; buz veya yıldırım) | Boss unique'i (Javana, Samma) | HP ve direnç bonusu; "mızrak savunmasına karşı" yedek silah. |
| **Krowaz silahları** (Wirinom, Baal, Nebiros, Raum, Windforce, Gab vb.) | Üretilen "cursed" silahlar | +7'de %1–5 şansla tetiklenen lanet efektleri. Örnekler: "Sweet Kiss" (buff siler), "Weak Dwarf" (rakibi büyütür, DEF düşürür). |
| **Lv70/80 kişisel görev silahı** | Oyuncunun adını taşıyan silah | Oyunun en zor görevi. |
| *Iron Bound, Giant Wing* | **Doğrulanamadı.** | Bu isimlerle bir KO eşyası wiki ve forum aramalarında bulunamadı. Başka bir oyundan veya özel sunucudan karışmış olabilir. Benzer olarak KO'da "Wings" kozmetik sınıfı (Dragon Wing, Hellfire Dragon Wing) var. |

### 4.5 Takı (aksesuar) yükseltme
- Takılar anvil'de tek tek yükseltilmez. Bunun yerine **aynı türden 3 takı + Accessory Compound Scroll** birleştirilip bir üst seviye elde edilir. Başarısız olursa **4 eşyanın hepsi yanar**.
- Normal takı +5'ten itibaren birleştirilebilir. Unique takı +0'dan başlar, +3'e kadar %100 başarılıdır, en yüksek +5'tir (bazı sürümlerde +3 sınırı vardır). +N için 3^N adet +0 takı gerekir: +3 için 27, +5 için 243.
- +10 normal takıya ikinci bir stat eklenebilir. Topluluğun hesabına göre ikinci stat ile +10'a çıkmak için yaklaşık 4,8 milyon adet +6 takı gerekir, yani pratikte imkansızdır.

**Kart oyununa uyarlama**
- **Ekipman slotları:** silah, kalkan, 5 zırh, 2 küpe, 1 kolye, 1 kemer, 2 yüzük. Kart oyununda sadeleştirmek için silah, zırh (5 parça → 1 ya da 3 slot) ve 4 takı slotu önerilir.
- **Upgrade sınıfı (Low/Middle/High/Unique) = nadirlik.** Bu yapı hem tanıdık hem de KO'ya özgü bir his verir ("bu item +7'de High'a geçiyor").
- **Set bonusu:** 2/3/5 parça eşikleri kart oyunlarında kolay uygulanır, ör. "3 parça: Glacier kartları 1 ucuz".
- **Takı birleştirme (3'ü 1 yapma)** doğrudan bir "duplicate → upgrade" sistemi olarak kullanılabilir. F2P ekonomisinde fazla kartları eritmenin doğal yoludur.
- **Silaha element ekleme ve element değiştirme** = ekipman kartının ateş/buz/yıldırım/zehir türünü seçmek (sinerji kurma).

**IP durumu**
- **Genel:** yükseltilebilir eşya, set bonusu, 3'ü 1 yapma, elementel silah.
- **Yeniden adlandırılmalı:** Tüm özel eşya adları: Raptor (kelime genel olsa da KO silahı olarak tanınır, risk almaya değmez), Shard, Elixir Staff, Chitin Shield, Shell, Krowaz, Lobo/Lupus/Lycaon, Iron Necklace (genel ad ama KO'yu çağrıştırır), Dark Vane, Gigantic Axe, Wirinom, Baal ve diğerleri, Holy Knight, Rosetta seti. Görsel tasarımlar da özgün olmalı.

---

## 5. Upgrade (yükseltme) sistemi

### 5.1 Temel işleyiş
- **Magic Anvil** (Moradon'un merkezinde) + **Charon** (yanındaki kağıt satıcısı NPC). Eşya ve kağıt anvile konur, sonuç "geçti" ya da **"yandı"** olur.
- **Klasik KO'da başarısız upgrade eşyayı yok eder (burn).** Eşyaya önceden eklenmiş özellik kağıdı da onunla birlikte yanar. GM'ler bunu geri almaz.
  - *Çelişki notu:* Bazı yeni ve muhtemelen yapay zeka ile üretilmiş bloglar (KO Bugda, bazı "BUS rehberleri") "BUS başarısızlıkta düşürmez" veya "LUS bir seviye düşürür" diyor. Klasik wiki'ler, Steam forumu ve TR forumları ise yanmayı doğruluyor. **Referans olarak "yanma" kabul edilmeli.** Bizim tasarımımızdaki "başarısızlıkta seviye düşer" kuralı bilinçli bir yumuşatmadır.
- Anvilde başarıda sarı/beyaz, başarısızlıkta kırmızı ışık yanar. Bu görsel geri bildirim çok ikoniktir.
- Topluluk efsaneleri: "anvil kırmızıyken bas", "önce çöp eşya yak sonra değerliyi bas" (break taktiği), "kağıdı hangi kutuya koyduğun önemli". Paket analizi bunların hiçbirinin işe yaramadığını gösterdi. Yine de bu batıl inançlar KO kültürünün parçasıdır.

### 5.2 Kağıt (scroll) türleri

| Kağıt | Kısaltma | Kullanım | NPC fiyatı (Charon, yaklaşık) |
|---|---|---|---|
| Upgrade Scroll (Low Class) | LUS | Low Class eşya, +7'ye kadar | ~11.000 Noah |
| Upgrade Scroll (Middle Class) | MUS | Middle Class eşya (+7'ye kadar); Low eşya +7'den sonra | ~110.000 Noah |
| Upgrade Scroll (High Class) | HUS | High eşyada yalnızca ilk adım | — |
| **Blessed Upgrade Scroll** | **BUS** | High Class ve Unique eşya; +7'den sonraki her şey | ~2.640.000 Noah |
| **Blessed Elemental Scroll** | BES | Unique eşyanın kilidini açar (+0 → +1); High Class eşyaya element ekler | ~3.960.000 Noah |
| Elemental / Dispell / Immune Scroll | — | Element ekleme ve değiştirme (%100, ~500 bin Noah); kalkana Fire+Glacier direnci ekleme | — |
| Stat ekleme kağıtları (HP, STR vb.) | — | Zırhlara tek bir bonus ekler, ~%95 başarı | — |
| **Trina's Piece** | Trina | Başarı şansını artırır. PUS'ta satılır (~800 cash). | Cash |
| Rebirth (Reverse) Scroll | — | +7 ve üzeri High/Unique eşyayı Rebirth'e çevirir (%100) | ~2.640.000 Noah |
| Rebirth upgrade kağıtları + **Tears of Karivdis** | — | Rebirth eşya yükseltme; Karivdis rebirth için Trina karşılığıdır (~400 cash, +%30) | — |
| Accessory Compound Scroll | — | 3 takıyı birleştirir | ~55.000 Noah |

### 5.3 Başarı oranları (topluluk tahminleri, resmi değil)

| Adım | Low/Middle (LUS/MUS) [fandom, korehberi, sivri] | High Class (BUS) [fandom] | High Class (BUS) [gameranks] | High Class [Steam, Berjer] | Unique [Steam] | 2009 blog (genel) |
|---|---|---|---|---|---|---|
| +1→+2 | %100 | ~%99 (HUS) / %100 | %100 | — | — | ~%99 |
| +2→+3 | %100 | %100 | %100 | — | — | ~%94 |
| +3→+4 | ~%70 | ~%70 | %90 | ~%75 | ~%70 | ~%75 |
| +4→+5 | ~%70 | ~%70 | %85 | ~%60 | ~%55 | ~%60 |
| +5→+6 | ~%60–65 | ~%55 | %60 | ~%40 | ~%37 | ~%40 |
| +6→+7 | ~%35 | ~%25 | %30 | ~%18 | ~%15 | ~%25 |
| +7→+8 | ~%5 | ~%5 | %10 | ~%6 | ~%6 | ~%6 |
| +8→+9 | ~%1 | ~%1 | %5 | — | — | ~%1 |
| +9→+10 | — | — | %1 | — | — | — |

**Kabul edilebilir aralık:**
- +1 ile +3 arası güvenli (%95–100).
- +4 ve +5: %55–90.
- +6: %37–65.
- +7: %15–35.
- +8: %5–12.
- +9: %1–5.
- +10: yaklaşık %1.

**Trina'nın etkisi** konusunda iki yorum var:
- (a) Mevcut şansın %20'si kadar artış, yani ×1,2 (fandom ve korehberi: %50 olan şans %60 olur).
- (b) Düz +20 puan (gameranks tablosu: %10 olan şans %30 olur).

Sivri.org'un Trina tablosu (a)'ya yakın: +5→+6 %85, +6→+7 %45, +7→+8 %6,5, +8→+9 %1,3.

**Rebirth yükseltme:** Rebirth seviyelerinde sabit bir oran bildiriliyor, ancak değer **%20–30** arasında çelişiyor. Karivdis bunu +%30 artırır.

### 5.4 Reverse / Rebirth
- Reign of the Fire Drake (2006) ile geldi. Yalnızca +1'den itibaren High Class olan eşyalar ve Unique eşyalar dönüştürülebilir.
- Dönüşüm seviyeleri: **+7 → R+1, +8 → R+5, +9 → R+11, +10 → R+21**. Daha yüksek rebirth seviyeleri (+22–31 civarı), normal +10'un üstündedir.
- Geri dönüşü yoktur.
- Temel motivasyon: **parlama efekti** (glow). Normalde silahlar yalnızca +8/+9/+10'da parlar. Rebirth'te parlaklık seviyeyle artar: hafif, orta, net, sürekli.

### 5.5 KO upgrade kültürünün tasarım dersleri
1. **Görünür statü:** +8 parlaması ve "+8 Raptor" lafı, sayısal güçten daha değerlidir.
2. **Nadir başarının sosyal yankısı:** Herkes anvilin başında toplanır, başarıyı/yanmayı izler, forumda anlatır.
3. **Para batağı (sink):** BUS ~2,6 M Noah + yanan eşya. Bu, ekonominin ana Noah ve eşya yok edicisidir.
4. **Kumar ve batıl inanç:** Oyuncular kontrol hissi arar (kutu yeri, kırmızı anvil, önce çöp yakmak).

**Kart oyununa uyarlama**
- **Kart veya ekipman +1..+10.** +1 ile +3 arası güvenli olmalı. Bizim kuralımız: başarısızlıkta **eşya yanmaz, 1 seviye düşer** (KO'dan yumuşak).
- Eşiklerde (+3, +6) **"seviye kilidi"** konulabilir, yani bu seviyelerin altına düşmez. Bu, %1'lik +10 denemelerini oyuncu için tolere edilebilir kılar.
- Kağıt kademeleri (Low / Middle / High / Blessed), eşya sınıfına göre zorunlu tutulabilir. Blessed kağıt hem Noah batağı hem de premium kaynağıdır.
- **Trina benzeri şans artırıcı:** Çarpımsal model (×1,2) önerilir. Düz +20 puan, düşük oranlarda çok fazla güç verir.
- **Pity / garanti sayacı:** Eşya bazında ardışık başarısızlıkta kademeli şans artışı. KO'da yoktu ama modern F2P ve regülasyon (olasılık açıklama yükümlülükleri) açısından önerilir.
- **Oranlar mutlaka oyun içinde açıkça gösterilmeli.** KO'daki gizli oranlar efsaneler doğurdu, ama Çin, Kore ve AB gibi pazarlarda olasılık açıklaması zorunlu.
- **+7, +8 ve +10'da kozmetik parlama** ve sunucu genelinde duyuru ("X, Y'yi +10 yaptı").
- **Rebirth =** +7 ve üzeri eşyayı "prestij" kademesine taşıyan, kozmetik ağırlıklı ikinci bir yükseltme hattı.

**IP durumu**
- **Genel:** Şansa dayalı yükseltme, kağıt kademeleri, şans artırıcı tüketilebilir, parlayan eşya, 3'ü 1 birleştirme, rebirth/prestij. Lineage, MU, Silkroad gibi oyunlarda da benzer sistemler var.
- **KO'ya özgü (değiştirilmeli):** Magic Anvil ve Charon isimleri, Trina's Piece, Tears of Karivdis, BUS/BES/LUS/MUS kısaltmaları, "Reverse" teriminin bu anlamda kullanılması. Örnek yeni isimler: "Kutsal Örs", "Usta Demirci", "Talih Kırıntısı". Kısaltmaların kendi kodları olmalı.

---

## 6. Ekonomi

| Sistem | KO'daki işleyişi | Sayılar |
|---|---|---|
| **Noah** (para) | Canavar düşüşü, NPC satışı, görev ödülü. Karakter başına üst sınır 2.147.483.647 (int32 sınırı). Pahalı eşyalar bu yüzden takasla el değiştirir. | NPC upgrade kağıtları 11 bin – 3,96 M; klan kurma 100 M; CSW kaydı 100 M |
| **Merchant (pazar tezgâhı)** | Oyuncu Moradon'da (güvenli bölge) bir kiosk açar. Alıcı oyuncu çevrimdışıyken de alışveriş yapabilir. Forgotten Frontiers ile **alış (buying) merchant** de eklendi. Sonradan "offline merchant" geldi. | Satıştan **%3 vergi**. Kale sahibi klan veya kral Moradon/Delos vergisini %0–10 arasında ayarlayabilir. |
| **Trade (takas penceresi)** | İki oyuncu arasında çoklu eşya + Noah takası. | — |
| **NPC dükkânları** | Sundries (genel eşya), Potion, Arms/Armor Dealer, Charon (kağıt), Inn (banka) | — |
| **Dayanıklılık / tamir** | Eşyaların dayanıklılığı (durability) vardır, ör. Dark Vane 8.000–13.500. Ölünce ve vuruşla azalır, NPC'de Noah karşılığı tamir edilir. "Acid Potion" rakibin zırh dayanıklılığını düşürür. Krowaz master skilleri rakibin dayanıklılığını 1.000–1.500 düşürür. UTC'de ölünce ekipman tamamen "yanar", yani dayanıklılığı sıfırlanır. | Bronze Premium tamir maliyetinde %50 indirim verir. |
| **İksirler (pot)** | HP: Water of Life (90), Water of Favors (720), Water of Bless (1.440), 1.920'lik. MP: Potion of Spirit (120), Sagacity (480), Wisdom (960), Soul (1.920). Ayrıca direnç iksirleri (+80), Swift/hız iksiri, Sweeping Potion (+%30 büyü gücü). Priest (Heal 60+) HP iksiri üretebilir (~2,5 bin maliyet, NPC fiyatı ~7 bin). | Toplu alımda 5.000 HP iksiri ~27 M Noah, 5.000 MP iksiri ~58 M Noah |
| **Power Up Store (PUS) / Knight Cash** | Gerçek parayla satın alınan "cash" ile premium, Trina, Karivdis, stat/skill reset, isim değişimi, EXP geri kazanma kağıdı, geçici stat kağıtları (30 dk), kostüm, kanat, Genie (otomatik avlanma, 10 × 2 saatlik paket ~149 cash), Chaos Dungeon haritası gibi ürünler. | Trina ~800 cash, Karivdis ~400 cash |
| **Premium** | Bronze, Silver, Gold, Platinum; EXP, DC (drop), War türleri. Hepsi EXP/drop/Noah bonusu, ölüm EXP kaybında azalma ve öncelikli giriş verir. Eskiden prime time'da sunucuya girmek için premium neredeyse zorunluydu. | EXP Premium: ölümde %1 kayıp ve Lv1–50 arası %400'e varan EXP. DC Premium: ölümde %2,5 kayıp ve +%30 EXP. War Premium: ölümde %2,5 kayıp, +%30 Noah, PvP öldürme başına +15 NP. |
| **NP (National Points / Loyalty)** | PvP'de düşman öldürünce kazanılır, ölünce kaybedilir. Kalıcı sıralama (NP) ve aylık sıralama (Ladder/Leader Points) olarak ikiye ayrılır. Klan derecelendirmesi, madalya ve eşya alımında para birimi olarak kullanılır. Bazı sürümlerde arayüzde "Loyalty" olarak geçer. | Solo öldürmede +50 NP, ölümde -50 NP. Partide NP paylaşılır, ama toplam artar. Eski PvP bölgelerinde ölünce paranın %50'si de kaybediliyordu (bankadaki para güvende). |
| **Sembol (rütbe ikonu)** | Her ulusun ilk 200 oyuncusu isimlerinin yanında ikon taşır. Sembol günlük Noah maaşı da verir. | 1.: Gold Dragon, 1 M/gün · 2–4: 700 bin · 5–10: 500 bin · 11–40: 300 bin · 41–100: 200 bin · 101–200: ödülsüz. Çerçeveli ikon NP sıralaması, çerçevesiz ikon LP sıralamasıdır. |
| **Banka** | Karakterler arası ortak depo (Inn). | — |

**Kart oyununa uyarlama**
- **İkili para:** Noah (soft, farm ile kazanılır) + Cash (hard). Kart paketlerinin bir kısmı Noah ile de alınabilmeli (KO hissi: "her şey farm'la elde edilebilir, cash zaman kazandırır").
- **Oyuncu pazarı:** sabit fiyatlı kiosk modeli (KO'daki gibi), %3–5 vergi, kale veya kral vergisi ile sosyal katman. Teklif sistemi yerine önce yalnızca **satış ilanı**; alış ilanı (buying merchant) sonra eklenebilir.
- **Dayanıklılık:** Ekipmanın maç başına dayanıklılık kaybetmesi ve tamir için Noah ödenmesi. Önemli bir Noah batağı, ama mobilde can sıkıcı olmamalı.
- **İksir = sarf kartı / maç içi kaynak.** "Maç başına 3 HP iksiri hakkı" gibi bir kuralla KO'nun pot basma ritmi yansıtılabilir.
- **NP = sıralı PvP puanı.** Kalıcı (NP) ve sezonluk (LP) ayrımı korunabilir. Sembol ikonları ve günlük maaş birebir uyarlanabilir.
- **Premium:** EXP ve drop artışı, ölüm (veya maç kaybı) cezasında azalma. "Prime time'da giriş önceliği" pay-to-access olduğu için **kopyalanmamalı**.
- **Genie (otomatik avlanma) = mobil "idle/oto-savaş" farm.** Projenin adındaki "Idle" ile de uyumlu, mobil için doğal bir karşılık.

**IP durumu**
- **Genel:** oyuncu tezgâhı, pazar vergisi, takas penceresi, dayanıklılık, iksirler, premium abonelik, ulusal puan, sıralama ikonları.
- **KO'ya özgü (değiştirilmeli):** "Noah" para adı, "Knight Cash", "Power Up Store/PUS", "Genie", premium tier adlarının KO kombinasyonu, iksir adları (Water of Favors vb.), "National Points" kısaltması (NP genel bir kısaltma ama KO'da ikonik; farklı bir ad önerilir, ör. "Onur"). Sembol isimleri (Gold Dragon, Silver H, Mirage vb.) de değiştirilmeli.

---

## 7. PvE / farm

### 7.1 Bölgeler

| Bölge | Seviye | Tür | Notlar |
|---|---|---|---|
| **Moradon** | 1–35 (Resurrection'dan sonra Lv35'e kadar buradan çıkılamıyor) | Tarafsız kasaba + başlangıç avı | Ticaret merkezi, anvil, merchant'lar, arena. Uluslar burada birbirine saldıramaz. Kaynaklarda düşük seviye canavar örnekleri: Worm, Bandicoot, Kecoon, Gavolt, Bulcan, Werewolf. |
| **El Morad / Luferson (Karus) ulus bölgeleri** | ~35–60 | Ulusa özel PvE | En büyük haritalar. Savaş kazanılınca karşı ulus işgal edebilir. Boss: Atilla, Antares (Lv50), Hyde. |
| **Eslant** (her ulusa ayrı) | 60+ | PvE, boss bölgesi | Boss'lar: Talos (Lv140, kemerler), Snake Queen (kolyeler), Harpy Queen (küpeler), Troll King, Deruvish Founder, Shaula, Samma, Dragon Tooth. Respawn yaklaşık 6–9 saat. |
| **Ardream** | 30/35–59 | Açık PvP + PvE | Ronark'ın düşük seviyeli kopyası. Boss'lar her yerde çıkabilir, Dark Mare burada ve Eslant'ta var. |
| **Ronark Land Base (Exploration Zone)** | 60–69 | Açık PvP | Forgotten Frontiers ile geldi. |
| **Ronark Land (eski Colony Zone, "CZ")** | 55+ (resmi site); bazı kaynaklar 70+ diyor | Ana açık PvP + boss "kase" (bowl) | Bach, Barkirra, Bishop, Duke, Javana, Lesath, Lobo/Lupus/Lycaon, Orc Bandit Leader. Respawn yaklaşık 2–4 saat. Bifrost anıtı burada. |
| **Delos** | — | Kale kuşatması ve Abyss girişi | CSW sahası. |
| **Desperation Abyss / Hell Abyss** | yüksek | Kat kat zindan (yaklaşık 20 kat + Hell) | Kat anahtarları, Abyss Gem (NPC'ye satılır). Isiloon (Lv170, 1,3 M HP, Hell Abyss son katı). **Felankor** (Lv250, ~2 M HP, ejderha ve oyunun maskotu; Dragon Cave'de, yalnızca sunucu yeniden başlatıldığında doğar). |
| **Krowaz's Dominion** | 70+ | PvE + tuzaklar (PvP serbest ama ödülsüz) | Tuzakta ölünce -200 NP. Boss Krowaz. Krowaz üretim malzemeleri buradan düşer. Giriş saatleri sınırlı. |
| **Bifrost** | 70+ (yaklaşık) | Etkinlik bölgesi (bkz. §8) | 7 ölümcül günah temalı canavarlar ve "Fragment"ler. 7 farklı fragment ile **Ultima** boss odasına girilir. |
| **Monster Suppression Squad (MSS)** | 3 seviye aralığı | Parti başına instance zindan | Silah savunmalı zırhların düştüğü tek yer (bir dönem). |
| **Forgotten Temple** | 46–59 ve 60+ | Dalga savunması, ilk 32 oyuncu | 30 dakikada tüm dalgalar ve son boss. Sağ kalanlar hazine sandığı alır. Uluslar karışık parti kurabilir. |
| **Juraid Mountain** | 70–83 | Uluslar arası PvPvE yarış | 3 oda + merkez boss (Deva Bird). En fazla 50 dk. Her ulustan en fazla 400 oyuncu, sayılar eşitlenir. Partiler sınıf bazlı (2 warrior, 2 rogue, 2 mage, 2 priest). Düşen taşlar Chaotic Generator'da takas edilir. |
| **Under the Castle (UTC)** | 75+ | Zindan (haftalık, ör. Cuma 21:00) | 4 bölüm, 4 boss: Mammoth III, Crasher Gimmick, Furious, Fluwiton. Ölünce ekipman dayanıklılığı tamamen biter (Life Crystal ile önlenir). UTC silahları ve Secret zırh malzemesi düşer. |
| **Chaos Dungeon** | her seviye | Standart karakterli FFA (bkz. §8) | — |

### 7.2 Boss örnekleri (Kalais / JAPKO verisi)

| Boss | Lv | HP | DEF | Önemli düşüş |
|---|---|---|---|---|
| Kekurikekukaka (Moradon) | 30 | 6.930 | 408 | Kekuri Ring/Belt |
| Antares (ulus bölgesi) | 50 | 23.010 | 720 | Scorpion Scythe, Blast scrolls |
| Lobo / Lupus / Lycaon (CZ) | 45 / 50 / 55 | 17,8k / 23k / 29k | 972–1.188 | Pendant / Staff / Hammer |
| Shaula / Lesath | 75 | 64.485 | 1.080 | Chitin Bow, Scorpion Shield / Scorpion Bow |
| Atilla | 85 | 89.650 | 1.224 | Warrior / Elemental / Priest Pendant |
| Snake Queen | 100 | 150.000 | 1.350 | Kolyeler |
| Harpy Queen | 110 | ~180.000 | 720 | Sınıf küpeleri |
| Troll King | 110 | 233.025 | 633 | Küpeler |
| Talos | 140 | 120.000 | 2.016 | Kemerler |
| Isiloon | 170 | 1.300.000 | 3.500 | RoL, RoC, Iron Neck/Belt, Blessed scroll |
| Felankor | 250 | ~2.000.000 | — | Ring of Felankor, takılar, her zaman 2 Gold Bar + 1 Silver Bar + +6 exceptional silah |
| Ultima (Bifrost) | 250 | — | — | Unique takılar, BUS/BES |

*Zipher için doğrulanmış bir KO kaynağı bulunamadı. Mammoth (Mammoth III), UTC boss'udur. Bulcan ise bir boss değil, düşük seviye canavar türüdür.*

### 7.3 Düşüş (drop), parti ve EXP
- **Loot kutusu:** Canavara en çok hasarı veren oyuncu veya parti alır. Kill-steal durumunda EXP hasar oranına göre paylaşılır.
- **Parti:** 2–8 kişi, lidere göre seviye aralığı sınırı vardır (klan üyeleri hariç). **EXP seviyeye göre ağırlıklı paylaşılır**, yani yüksek seviyeli üye daha fazla alır. Noah eşit bölünür. Eşyalar sırayla dağıtılır, bu da "sıra bende mi" kültürünü ve ucuz eşya toplayarak sırayı çalma gibi kötüye kullanımları doğurdu.
- Canavara göre seviyesi çok yüksek olan oyuncu Noah düşüşü alamaz.
- **Drop oranları:** Resmi bir veri bulunamadı. Unique düşüşü boss başına "nadir" ve sandık/etkinlik ödüllerinde "genelde küçük şans" olarak anlatılıyor. Boss respawn süreleri: ulus/Eslant 6–12 saat, CZ 2–4 saat.
- **Görevler:** Topla/öldür görevleri. Seviye 60/62/70 görevleri boss malzemesi ister (ör. warrior master görevi: Lobo + Lupus + Lycaon Pendant, 10 Crystal, 10 Opal, 10 Crude Sapphire). Lv70 kişisel silah görevi de var.
- **Chaotic Generator:** Fragment, Juraid taşı gibi eşyaları rastgele ödüle çeviren NPC. Gacha benzeri bir yapı.

**Kart oyununa uyarlama**
- **Bölge = PvE harita düğümleri** (seviye bantlı). Moradon hub ekranıdır: pazar, anvil, NPC'ler.
- **Canavar = AI desteli rakip.** Boss'lar çok fazlı, büyük canlı karşılaşmalar. HP oranları tablodaki gibi dramatik ölçeklenebilir (Kekuri 7k, Felankor 2M → oyunda örneğin 30 HP'den 300 HP'ye ve çok fazlı yapıya).
- **Boss respawn = günlük/haftalık boss kilidi.** Felankor'un "sadece restart sonrası doğması" haftalık dünya boss'u olarak uyarlanabilir.
- **Loot kutusu + sıralı dağıtım** yerine her oyuncuya kişisel loot verilmeli. KO'daki loot kavgası modern oyunda istenmez.
- **Forgotten Temple = dalga hayatta kalma modu.** Juraid = 2v2 veya 4v4 PvPvE yarışı (sonra).
- **Chaotic Generator = malzeme/fragment ile rastgele ödül takası.** Gacha regülasyonuna dikkat edilmeli.

**IP durumu**
- **Genel:** zindan katları, dalga savunması, dünya boss'u, fragment toplama, 7 ölümcül günah teması (folklor).
- **Yeniden adlandırılmalı:** Tüm bölge adları (Moradon, Eslant, Ardream, Ronark, Colony Zone, Delos, Abyss/Desperation Abyss, Krowaz's Dominion, Bifrost, Juraid, Forgotten Temple, Under the Castle, Lunar Valley, Nereidth, Oreads, Alseides, Neids Triangle). Tüm boss ve canavar adları (Felankor, Isiloon, Ultima, Talos, Kekurikekukaka, Lobo/Lupus/Lycaon, Shaula/Lesath; bunlar gerçek yıldız adları olsa da KO bağlamında kullanılmamalı). Chaotic Generator, Deva Bird.

---

## 8. PvP

| Sistem | Kurallar | Ödüller ve sayılar |
|---|---|---|
| **Açık PvP bölgeleri** (Ardream, Ronark Land Base, Ronark Land) | Yalnızca karşı ulus saldırabilir. NP ve LP kazanılır ve kaybedilir. Ronark'ın merkezinde "bowl" adlı boss çukuru var. Atross/Riote NPC'leri öldürülünce NP verir. | Öldürmede +50 NP, ölümde -50 NP |
| **Arena** (Moradon) | Ödülsüz ve risksiz. FFA, parti ve klan modları. | — |
| **Lunar War** (ulus savaşı) | Haftada 2 gün, toplam 2 saat: 1 saat savaş haritası + 1 saat işgal. Kontenjan her ulustan **120–250 oyuncu** (kaynaklar çelişiyor: 120 / 200 / 250). En çok NP'si olan 5 klan lideri atlı **Commander** olur. Haritalar: Alseides Prairie (2 Warder + 1 Keeper öldür; yoksa öldürme sayısı; ölenler "hapise" girer), Nereidth Island (7 anıt; 7'sini birden tut ya da 1 saat sonunda 4/7 tut), Oreads (yalnızca öldürme sayısı; kuşatma aletleri ve tuzaklar), eski Napairs Canyon. | Kazanan ulus karşı ulusun kalesini işgal eder. Kasaba anıtları ve NPC'ler (30 dk respawn) büyük NP verir. Commander'lar kazanınca +300 NP alır. Savaş süresince Ronark kapalıdır. |
| **Dark Lunar War** | Lv59 üstü giremez. Harita Neids Triangle. Kontenjan ~120. | İşgal ve özel ödül yok. |
| **Castle Siege War (CSW, Delos)** | Tek klan-vs-klan etkinliği. Güncel format: kayıt 100 M Noah, Grade 5 Accredited ve üstü klanlar, ilk 30 klan. **Deathmatch** (30 dk, klan başına 16 kişi; "barrack" yalnızca normal vuruşla hasar alır, vuruş başına 1). İlk 3 klan **Castellan War**'a geçer (klan başına 50 kişi). Savaş sonunda merkezdeki Artifact'ı elinde tutan klan kazanır. Eski format: Artifact'ı en uzun tutan klan kazanır. | Kale sahibi klan Moradon/Delos vergisini toplar, bayrağı kalede dalgalanır, Abyss kapısını kontrol eder (Abyss eşya fiyatlarını şişirebilir). İlk 5 klana pelerin kuponu ve sandık. |
| **Bifrost** | Gün içinde birkaç kez açılır. Ronark'taki Bifrost anıtına son vuruşu yapan ulus bölgeye ilk girer, diğer ulus 30 dk sonra girer. Toplam süre 2 saat. | Fragment'ler, Ultima, unique eşyalar. |
| **Border Defense War (BDW)** | 8v8 instance. Sistem otomatik olarak her partiye 2 priest + diğer sınıflardan 2'şer koymaya çalışır. Seviye aralıkları 30–77 (yaklaşık 7 bant; bazı kaynaklar 3 bant diyor: 20–58 / 59–68 / 69–80). Stat'lar sabitlenir veya taban bonusu verilir. Güncel mod bayrak kapmaca: bayrak 3 vuruşta düşer, taşıyıcı yavaşlar, üsse ulaşan +10 puan, öldürme +1 puan, ilk 80 puana ulaşan kazanır (alt bantta 50). Eski modlar: anıt yıkma ve anıt tutma. | Kazanan: 7 M'ye kadar EXP + Red Treasure Chest + zafer sertifikası. Kaybeden: EXP kağıdı. |
| **Chaos Dungeon** | 18 kişilik FFA, 20 dk. **Herkes aynı standart karakterle** girer: 10.000 HP, aynı skill seti, gizli kimlik. Güçlendirmeler sıralamaya göre verilir (geride olana daha güçlüsü). 5.000 hasarlık tuzaklar var. Günde 1 harita bileti, fazlası PUS'ta satılır. | Sıralamanın %25'lik dilimlerine göre Blue/Green/Red sandık. 40 öldürmede 7 M EXP (premium ile 20 öldürme yeterli). |
| **Juraid Mountain** | Bkz. §7. | Taşlar → unique eşya. |
| **Sıralama ve sembol** | NP (kalıcı) ve LP (aylık sıfırlanır), her ulus için ilk 200. | Günlük Noah maaşı (bkz. §6). |
| **Krallık (King) sistemi** | Knight Empire (2005) ile geldi. Aylık seçim yapılır. Adaylar ilk 10 klandan gelir (aday Lv50+, seçmen Lv80+ bazı kaynaklara göre). Seçimi kaybeden adaylar **senatör** olur ve kralı azil girişiminde bulunabilir. | Kral Moradon/Delos vergisini %0–10 arasında ayarlar, günde bir kez EXP veya drop etkinliği açar, sunucu duyurusu yapar, hazineden ödül dağıtır, yakınındakilere HP/MP aurası verir. |
| **Klan sistemi** | Kurulum: Inn hostess NPC'si, 100 M Noah. Üye sınırı **36–50** (kaynaklar çelişiyor; eski sürüm 36). Dereceler Grade 5'ten başlar. Knight dereceleri (NP toplamı): Grade 4 72k, Grade 3 144k, Grade 2 360k, Grade 1 720k. Promosyon görevi bir boss öldürmektir. **Accredited** (CP bağışı: 7k–20k CP) ve **Royal** (Royal 5 → 1 için 900k–1,62 M NP / 25k–45k CP). 1 CP = 36 NP. Otomatik bağış modunda üyelerin kazandığı NP'nin %20'si klana gider. Klandan ayrılan üye katkısının yalnızca %30'unu geri alır. | Pelerin (cape) ve renk özelleştirme CP ile alınır. Kol bandı klan derecesini gösterir, ilk 5 klanın bandı alevlidir. İttifak (alliance) ortak sohbet kanalı ve ana klanın pelerin desenini alır (renk hariç). Klan üyeleri seviye farkı gözetmeden parti kurabilir. |

**Kart oyununa uyarlama**
- **Lansmanda 1v1 sıralı mod:** NP / LP benzeri iki skor (kalıcı + sezonluk), sembol ikonu ve günlük maaş.
- **Chaos Dungeon = "eşit koşullu" mod.** Herkese aynı hazır deste verilir. Pay-to-win eleştirisine karşı mükemmel bir mod ve 1v1'e çok kolay uyarlanır. **Lansmanda önerilir.**
- **BDW = 2v2 / 3v3 takım modu** (sonra), sınıf dengeli eşleştirme ile.
- **Lunar War = sonraki ulus savaşı.** Asenkron bir "ulus puanı" yarışı olabilir: o hafta oynanan PvP maçlarının toplam galibiyeti haritadaki anıtları ele geçirir, kazanan ulus 1 saatlik "işgal" bonusu alır (EXP/drop). Commander = en çok NP'li klan liderlerine özel kozmetik.
- **CSW =** klan turnuvası (eleme + final), kazanan klan pazar vergisini belirler. Bu, KO'nun en güçlü sosyal-ekonomik bağı.
- **King sistemi =** sezonluk oylamayla ulus lideri. Kısıtlı yetki vermek gerekir (günlük EXP etkinliği, vergi aralığı); kötüye kullanıma karşı sınırlar konmalı.
- **Klan:** derece = toplam NP, pelerin = kart sırtı (card back) / kahraman kozmetiği. Bu birebir uyarlanabilir.

**IP durumu**
- **Genel:** ulus savaşı, kale kuşatması, bayrak kapmaca, eşit karakterli FFA, sıralama, krallık/oylama, klan dereceleri ve pelerin, ittifak.
- **Yeniden adlandırılmalı:** Lunar War, Dark Lunar War, Castle Siege War/CSW ve Castellan, Bifrost (İskandinav mitolojisinden gelir ama KO etkinliği olarak ikonik), Border Defense War, Chaos Dungeon, Juraid, Warder ve Keeper NPC adları, Training/Accredited/Royal Knight derece adları, Commander.

---

## 9. Sosyal yapı ve ilerleme

| Konu | KO | Sayılar |
|---|---|---|
| **Seviye sınırı geçmişi** | Başlangıçta 60 (KR, erken dönem), USKO/MYKO'da 70 → Reign of the Fire Drake (Ağustos 2006) ile 80 → Forgotten Frontiers (Ekim 2008) ile **83**. Bugün hâlâ 83. | — |
| **EXP eğrisi** | Üstel bir eğri ve **her 5–10 seviyede bir "duvar" (EXP gereksinimi ikiye katlanır)**. Ör. Lv9 → 10: 2.535 → 5.070; Lv19 → 20: 26k → 52k; Lv29 → 30: 184k → 368k; Lv39 → 40: 1,18 M → 2,37 M; Lv49 → 50: 7,6 M → 15,2 M; Lv60: 73 M; Lv61: 132 M; Lv70: 311 M; Lv80: 2,14 milyar. Ara seviyelerde artış yaklaşık %10 (60–70 arası), 70 sonrasında yaklaşık %20–21. | Eski sürümde 61+ seviyede EXP cezası da vardı ("kill başına yarım EXP"). |
| **Ölüm cezası** | Canavara karşı ölümde EXP kaybı (seviyeye bağlı, seviye düşürebilir; düşük seviyede tamamlanmış görevi tekrar yapamazsın). Priest dirilttiğinde kayıp EXP'nin bir kısmı geri gelir: 4 Stone of Life ile %60, 10 taşla %70, 30 taşla %80. PvP ölümünde NP kaybı olur (eskiden paranın %50'si de). | Normal ölümde kayıp yaklaşık %5 (kesin değer kaynaklarda tutarsız). Premium ile %2,5 veya %1. |
| **Premium ve giriş önceliği** | Yoğun saatlerde premiumsuz oyuncunun sunucuya girmesi zordu, bu da sık eleştirilen bir F2P uygulaması. | Bkz. §6. |
| **Toplumsal kültür** | Kısaltmalar ("++++" buff iste, "FM" Fresh Mind, "LR/FR/IR" direnç buff'ı, "TP 666666" ışınla, "111111" swift, "555555" düşman geliyor). Sunucu nüfusunun ağırlıkla Türk olması (USKO). Bot ve hile sorunları. | — |
| **Yardımcı (Seed/Max)** | Başlangıçta solucanın elinden kurtarılan rehber karakter. | — |
| **Başarımlar ve ünvanlar** | Sonraki sürümlerde başarım ünvanları stat veriyor, ör. BDW "Impregnable" ünvanı +90 DEF. | — |

**Kart oyununa uyarlama**
- **Seviye sınırı:** Lansmanda 60 (ilk master), sonra 70 ve 80+ genişlemeleri. Bu, KO'nun genişleme ritmini taklit eder.
- **EXP eğrisi:** "Her 10 seviyede bir duvar" yapısını koruyun (ör. Lv10/20/30/40/50/60'ta 2 kat sıçrama). KO'daki "Lv60'a gelince ağır grind" hissi buradan gelir. Mobilde Genie/idle farm ile hafifletilebilir.
- **Ölüm cezası → maç kaybı cezası:** PvE'de küçük EXP kaybı (%1–5) veya ekipman dayanıklılığı kaybı. "Diriltme taşı" (Stone of Life benzeri) ve diriltme kartıyla kaybın bir kısmı geri alınabilir. PvP'de NP kaybı. Fazla cezalandırıcı tasarımdan kaçının; mobil oyuncu kaybı riski var.
- **Topluluk kısaltmaları ve emote'lar:** "++++" ve "TP" gibi KO jargonu, emote veya hızlı mesaj olarak **genel** biçimde kullanılabilir. Bu, nostalji için güçlü ama IP riski düşük bir unsur.
- **Başarım ünvanları:** Küçük stat bonusu veren ünvanlar (KO'da olduğu gibi) ya da yalnızca kozmetik ünvanlar (PvP dengesi için daha güvenli).

**IP durumu:** EXP eğrisi, ölüm cezası, diriltme taşı, premium ve ünvanlar genel mekaniklerdir. "Stone of Life", "Seed/Max" yardımcı karakteri ve genişleme adları (Knight Empire, Reign of the Fire Drake, Moradon: The Resurrection, Forgotten Frontiers, The Chaos) KO'ya özgüdür.

---

## 10. Sistem-sistem özet tablosu (uyarlama + IP)

| # | KO sistemi | Kart oyununa uyarlama | IP durumu |
|---|---|---|---|
| 1 | 4 sınıf + Kurian, 3 ağaç + Master | Kahraman = sınıf; ağaç = kart arketipi, en fazla 2 ağaç + Master | Mekanik serbest; ünvan ve skill adları değiştirilmeli |
| 2 | Lv10 / Lv60 meslek değişimi | İki büyük kilit açma anı (ağaçlar, Master kartları) | Serbest |
| 3 | Skill puanı (seviye başı 2) | Ağaç derinliği ile kart kilidi | Serbest |
| 4 | 5 stat (STR/HP/DEX/INT/MP), stat puanı (3/5) | Saldırı/Can/Mana pasiflerine indirgeme | Serbest |
| 5 | Elementel hasar ve direnç, silah savunması | Anahtar kelimeler: Ateş/Buz/Şimşek/Zehir, "X direnci", "Kılıç savunması" | Serbest |
| 6 | El Morad / Karus, ırklar | Ulus = hesap tarafı; ırk kozmetik | **İsimler, lore ve görsel dil KO'ya özgü; tamamen yeniden yazılmalı** |
| 7 | Low/Middle/High/Unique/Rebirth eşya sınıfları | Nadirlik + yükseltme yolu | Kavram serbest; "Reverse/Rebirth" terimi değiştirilmeli |
| 8 | İkonik eşyalar (Raptor, Shell, Iron Necklace…) | Özgün isimli eşdeğer "efsane" eşyalar | **Tüm eşya adları değiştirilmeli** |
| 9 | Anvil +1..+10, yanma, kağıtlar, Trina | +1..+10, başarısızlıkta düşme, kağıt kademeleri, şans artırıcı, açık oranlar, pity | Mekanik serbest; Anvil/Charon/Trina/BUS adları değiştirilmeli |
| 10 | Takı birleştirme (3 → 1) | Duplicate eritme ve birleştirme | Serbest |
| 11 | Noah, merchant (%3), takas, NPC, tamir, iksirler | Soft para, oyuncu pazarı, dayanıklılık, iksir hakkı | "Noah", iksir adları değiştirilmeli |
| 12 | PUS / Cash / premium / Genie | Hard para, premium (giriş önceliği hariç), idle oto-farm | Adlar değiştirilmeli |
| 13 | Zone'lar ve boss'lar | PvE harita düğümleri, dünya boss'u, haftalık kilit | **Tüm adlar değiştirilmeli** |
| 14 | Forgotten Temple, Juraid, UTC | Dalga modu, PvPvE yarış, haftalık zindan | Adlar değiştirilmeli |
| 15 | NP / LP, sembol, açık PvP | Kalıcı + sezonluk sıralama, rütbe ikonu, günlük maaş | Sembol adları değiştirilmeli |
| 16 | Chaos Dungeon | Eşit desteli FFA / 1v1 "draft" modu (lansmanda) | Ad değiştirilmeli |
| 17 | BDW | 2v2 / 3v3 bayrak modu (sonra) | Ad değiştirilmeli |
| 18 | Lunar War + işgal | Asenkron ulus savaşı + işgal bonusu (sonra) | Ad değiştirilmeli |
| 19 | CSW + vergi | Klan turnuvası, kazanan pazar vergisini belirler | Ad değiştirilmeli |
| 20 | King + senato | Sezonluk ulus lideri, sınırlı yetki | Serbest (ad genel) |
| 21 | Klan dereceleri, pelerin, ittifak | Klan seviyesi = toplam NP, pelerin = kart sırtı | Derece adları (Accredited/Royal Knight) değiştirilmeli |
| 22 | EXP eğrisi (10'arlı duvarlar), ölüm cezası, diriltme | Benzer eğri, hafif ceza, diriltme kartı | Serbest; "Stone of Life" adı değiştirilmeli |

---

## 11. Kaynaklar arası çelişkiler (özet)

| Konu | Değer aralığı | Not |
|---|---|---|
| Upgrade başarısızlığı | Yanma (klasik) vs. seviye düşürme (yeni bloglar) | Klasik wiki ve forumlar **yanmayı** doğruluyor. |
| +7 → +8 oranı (High Class, BUS) | %5–12 | fandom ve korehberi: ~%5; gameranks: %10; Steam: ~%6 |
| +6 → +7 oranı | %15–35 | Eşya sınıfına göre değişiyor |
| Trina etkisi | ×1,2 vs. +20 puan | Topluluk çoğunluğu ×1,2 diyor |
| Rebirth upgrade oranı | %20–30 sabit | — |
| Lunar War kontenjanı | 120 / 200 / 250 | Sürüme göre değişmiş |
| BDW seviye bantları | 3 bant (20–80) vs. 7 bant (30–77) | Sürüme göre |
| Klan üye sınırı | 36 vs. 50 | Eski sürüm 36 |
| Ronark Land giriş seviyesi | 55+ (resmi site) vs. 70+ (KO Bugda) | Resmi değer tercih edilmeli |
| Ölüm EXP kaybı (premiumsuz) | ~%2,5–5 | Net değer bulunamadı |
| Priest heal ve buff değerleri | Sürüme göre değişti (ör. Complete Heal "tam dolum" vs. 10.000) | — |

---

## Kaynaklar

1. Wikipedia — Knight Online: https://en.wikipedia.org/wiki/Knight_Online
2. Codex Gamicus (Fandom) — Knight Online (sistemler, PvP, eşyalar, genişlemeler; API üzerinden okundu): https://gamicus.fandom.com/wiki/Knight_Online
3. Knight Online Fandom — Upgrading: https://knight-online.fandom.com/wiki/Upgrading
4. Knight Online Fandom — 1st Job Change: https://knight-online.fandom.com/wiki/1st_Job_Change
5. Knight Online Fandom — Daily Events: https://knight-online.fandom.com/wiki/Daily_Events
6. Knight Online Fandom — Eslant Bosses Drop List: https://knight-online.fandom.com/wiki/Eslant_Bosses_Drop_List
7. Knight Online Fandom — Nations: https://knight-online.fandom.com/wiki/Nations
8. Knight Online World Fandom — Warrior / Mage / Rogue / Priest: https://knight-online-world.fandom.com/wiki/Warrior , https://knight-online-world.fandom.com/wiki/Mage , https://knight-online-world.fandom.com/wiki/Rogue , https://knight-online-world.fandom.com/wiki/Priest
9. Knight Online World Fandom — Border Defense War / Chaos Dungeon / Lunar War / Dark Lunar War / Character Creation: https://knight-online-world.fandom.com/wiki/Border_Defense_War , https://knight-online-world.fandom.com/wiki/Chaos_Dungeon , https://knight-online-world.fandom.com/wiki/Lunar_War , https://knight-online-world.fandom.com/wiki/Dark_Lunar_War , https://knight-online-world.fandom.com/wiki/Character_Creation
10. NTTGame resmi site — Characters / Zones / Wars (CSW kuralları): http://www.nttgameonline.com/knight/en/gameinfo/characters , http://www.nttgameonline.com/knight/en/gameinfo/zones , http://www.nttgameonline.com/knight/en/gameinfo/wars
11. Kalais' Library — Other info (EXP tablosu, takı birleştirme, klan NP, diriltme, kısaltmalar, 70+ skiller): http://ko.kalais.net/other.php
12. Kalais' Library — Bosses: http://ko.kalais.net/boss.php
13. Kalais' Library — Master quests: http://ko.kalais.net/master.php
14. Kalais' Library — Defence armors: http://ko.kalais.net/defence.php
15. Kalais' Library — Mage damage / Warrior guide / Priest guide: http://ko.kalais.net/mage70damage.php , http://ko.kalais.net/guide-warrior.php , http://ko.kalais.net/guide-priest.php
16. GameRanks — Upgrade Success Rates: https://www.gameranks.net/knight-online/guideline/knight-online-upgrade-success-rates/
17. GameRanks — Stone of Life: https://www.gameranks.net/knight-online/items/what-is-stone-of-life-in-knight-online/
18. KO Rehberi — Upgrade Sistemi: https://korehberi.com/knight-online/rehberler/upgrade-sistemi
19. KO Rehberi — Sınıflar (Warrior/Rogue/Mage/Priest): https://korehberi.com/knight-online/siniflar/warrior , https://korehberi.com/knight-online/siniflar/rogue , https://korehberi.com/knight-online/siniflar/mage , https://korehberi.com/knight-online/siniflar/priest
20. KO Rehberi — Set Bonusları: https://korehberi.com/knight-online/rehberler/set-bonuslari
21. KO Rehberi — Krowaz Item: https://korehberi.com/knight-online/rehberler/uretim/krowaz-item
22. KO Rehberi — Krallık Sistemi: https://korehberi.com/knight-online/rehberler/krallik-sistemi
23. KO Rehberi — Power Up Store: https://korehberi.com/knight-online/power-up-store
24. KO Rehberi — İksir Rehberi: https://korehberi.com/knight-online/rehberler/iksir-rehberi
25. KO Rehberi — Under the Castle: https://korehberi.com/knight-online/etkinlikler/under-the-castle
26. KO Rehberi Wiki — Krowaz Set / Raptor / Dark Vane: https://wiki.korehberi.com/Krowaz_Set , https://wiki.korehberi.com/index.php/Raptor , https://wiki.korehberi.com/index.php/Dark_Vane
27. Sivri.org — Upgrade Oranları (Takı, Rebirth, Unique, Trina): https://sivri.org/knight-online-upgrade-oranlari-taki-rebirth-unique-trina/
28. Turkmmo — Warrior / Mage Skilleri (1–80): https://forum.turkmmo.com/konu/1971405-knight-online-warrior-skilleri-1-80-aciklamali/ , https://forum.turkmmo.com/konu/1971402-knight-online-mage-skilleri-1-80-aciklamali/
29. Turkmmo — Reverse (Rebirth) item nedir: https://forum.turkmmo.com/konu/1634272-reverse-rebirt-item-nedir-bilmeyenler-icin/
30. DonanımHaber — Anvil Upgrade Formülü: https://forum.donanimhaber.com/anvil-upgrade-formulu--23302215
31. Turkgame — Boss'ların yerleri ve düşüşleri: https://www.turkgame.com/knight-onlinedaki-bosslarin-yerleri-ve-verdigi-esyalar-rehber/
32. Kopazar — Warrior / Rogue / Priest rehberleri: https://www.kopazar.com/en/blog/knight-online-warrior-guide , https://www.kopazar.com/en/blog/knight-online-rogue-guide , https://www.kopazar.com/en/blog/knight-online-priest-skills-guide
33. Steam Community — Anvil Rates BUS and Trina: https://steamcommunity.com/app/389430/discussions/0/458607699618989036/
34. Steam Community — Reverse vs normal upgrade item: https://steamcommunity.com/app/389430/discussions/0/135510393202708051/
35. Steam Community — Damage Formula and Mechanic Guide (arama özeti): https://steamcommunity.com/sharedfiles/filedetails/?l=english&id=3576142012
36. MMOGoldService blog (2009) — Upgrading Guide: http://mmogoldservice.blogspot.com/2009/08/ko-knight-onlineupgrading-guide.html
37. KO Bugda — Upgrade sistemi / Zone rehberi / Clan grades / PK Symbols (dikkat: içeriğin bir kısmı güvenilir değil): https://kobugda.com/blog/knight-online-upgrade-system-guide , https://kobugda.com/blog/knight-online-map-zone-guide-2026 , https://kobugda.com/grades , https://kobugda.com/symbols
38. KO4FUN — Clan Guide: https://www.ko4fun.net/ClanGuide
39. Knight Online HD — Events (özel sunucu, yalnızca takvim): https://knightonlinehd.com/events
40. Premium özellikleri (arama özetleri): https://www.foxngame.com/en/knight-online-premium-features , https://www.bynogame.com/en/games/knight-online/knight-online-premium-cash
