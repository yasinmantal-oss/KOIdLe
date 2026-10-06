# 06 — Knight Online sınıf skilleri (kart oyunu için araştırma)

> Amaç: KOIdLe'nin job/kart tasarımına ilham olacak KO skillerini, Türk oyuncu argosunu ve in-job combo kalıplarını tek yerde toplamak.
> Kapsam: yalnız **skill adları** (sahibi izin verdi). Ulus, şehir, item, boss, NPC ve para birimi adları bilerek yazılmadı.
> Tarih: 2026-10-06. Hazırlayan: Claude (web araştırması). Karar içermez; Yasin'in değerlendirmesine girdi.

## 0. Okuma notları ve güven etiketleri

- **[kaynaklı]**: en az bir rehber/forum açıkça yazıyor. **[tahmini]**: kaynaklar çelişiyor, sayı uydurmayayım diye yaklaşık verdim ya da çıkarım yaptım.
- KO'da skiller **seviye** ile değil, o daldaki **skill puanı (SP)** ile açılır. Bir dalın "80 skill"i = o dala 80 puan verince açılan skill (karakter ~80+ seviye). Aşağıdaki "Sv." sütunu bu SP eşiğidir.
- 70/72/75/80 skilleri ayrıca bir görev/malzeme ile açılır; Master dalı 2. job değişimi (~60) sonrası, en fazla ~20–23 puandır.
- MP maliyetleri rehberlerin hiçbirinde tutarlı listelenmemiş; o yüzden yalnız biliniyorsa yazdım. Sayısal değerler (yüzde, süre) sunucu/sürüme göre değişmiş; kart tasarımı için **oran ve rol** önemli, birebir sayı değil.
- Bazı otomatik özetleyici sonuçları (ör. bir terim sözlüğünde "DB = Damage Boost", "CH = Critical Hit") birbirini tutmadığı için **kullanmadım**; aşağıdaki açıklamalar birden çok bağımsız kaynakla örtüşenlerdir.

### Dal isimleri (doğrulanmış)

| Sınıf | Dallar (oyundaki adlar) | Not |
|---|---|---|
| Warrior | Basic · **Attack** · **Defense** · **Passion** (Türk kaynaklarda "Berserk" sekmesi; bir rehberde "Fervor") · Master | "Berserker / Guardian" diye resmi dal **yok**. Topluluk build adları: *Atak warrior*, *Defans warrior*, *Berserker warrior*. |
| Rogue | Basic · **Archery** · **Assassin** (Assassinate) · **Explore** (bazı kaynaklarda "Search") · Master | Build adları: *Archer (okçu)* ve *Asas*. Explore iki build'in ortak savunma/hareket dalı. |
| Mage | Basic · **Flame** · **Glacier** · **Lightning** · Master | Build adları: *Ateş mage*, *Buz/Ice mage* ("buzcu"), *Lightning/elektro mage*. |
| Priest | Basic · **Healing** · **Aura** (buff) · **Holy** (debuff; bazı TR rehberlerde "Spirit") · Master | Build adları: *Heal/buff priest*, *DB (debuff) priest*, *BP (battle priest, STR)*. |

Kaynaklar: https://forum.turkmmo.com/konu/1971405-knight-online-warrior-skilleri-1-80-aciklamali/ · https://forum.turkmmo.com/konu/1109-rogue-skilleri-1-80-aciklamali/ · https://forum.turkmmo.com/konu/1971402-knight-online-mage-skilleri-1-80-aciklamali/ · https://forum.turkmmo.com/konu/1971409-knight-online-priest-skilleri-1-80-aciklamali/ · https://sivri.org/str-battle-priest-stat-skill-dagilimi-knight-bp-priest-rehberi/ · https://volbiex.com/oyun/berserker-warrior-nedir.html · https://www.kopazar.com/en/blog/knight-online-warrior-guide

---

## 1. Kullanıcının terimleri — çözüm tablosu

| Terim (Yasin) | Karşılığı | Açıklama | Güven |
|---|---|---|---|
| Warrior **"berserk"** | Passion dalının adı ve oradaki saldırı hızı buff'ları: **Berserker** (~SP 70–80: 20 sn %20 saldırı hızı, karşılığında −300 defans) ve **Berserk Echo / Blood of Gain** (~SP 75: %40 saldırı hızı, yine −300 defans). | Türk oyuncu "berserk" deyince hem dalı/build'i (berserker warrior) hem de "defansı feda edip hızlı vurma" buff'ını kastediyor. Kart için net tema: **risk buff'ı** (hasar ↑, savunma ↓). | kaynaklı (sayılar kaynaklar arasında ±5 SP oynuyor) |
| Priest **"complete heal"** (CH) | **Complete Healing** (tek hedef, ~10.000 HP = pratikte tam can) ve **Group Complete Healing** (tüm parti). | Heal dalının tepe skilleri; uzun bekleme süreli "son çare" iyileştirme. Ayrıca zamana yayılan **Superior/Critical/Past Restore** ailesi var. | kaynaklı (SP eşiği ~60–70, tahmini) |
| Priest **"db"** | **"debuff"**un kısaltması. "DB atmak" = rakibe debuff basmak; "DB priest" = puanını Holy/debuff dalına basan priest. Dar anlamda en çok **Parasite / Superior Parasite**'i (rakibin max HP'sini %20 / %30 düşürür) anlatır. | Forumlarda "önce db, sonra malice" sırası ve "HP'si zaten %20 inmiş moba db atmak boşa" tartışması geçiyor; özel efekt paketleri "db, malice, torment, massive"ı ayrı ayrı sayıyor, yani "db" Parasite ailesine yapışmış. | kaynaklı (genel anlam) / tahmini (Parasite eşleşmesi güçlü çıkarım) |
| Priest **"malice"** | **Malice**: rakibin defansını ~%20–25 düşüren tek hedef debuff. Holy dalına **3 puan** verince açılır. | "Her priest mutlaka açmalı" deniyor; buff priest bile 3 puan basıp alıyor. Alan versiyonu **Torment** (~%30, alan). | kaynaklı |
| Assassin **"spike"** | **Spike** (Assassin ~SP 55): hançerle %600 hasar. | Asas'ın ana vuruşu; Thrust (%400) ile birlikte bar'ın merkezinde. | kaynaklı |
| Assassin **"critic"** | **Critical Point** (Assassin SP 80): kritik vuruş yaptırır; rehberlerde "skilleri çift hasara çıkarır, oyundaki en yüksek ani patlama", **mob/boss'a etkisiz** (yalnız PvP). | Asas'ın "80 skill"i. Kesin mekaniği (süreli buff mı, tek vuruş mu) kaynaklarda net değil. | kaynaklı (etki) / tahmini (süre/mekanik) |
| Archer **"80 skill"** | **Power Shot** (Archery SP 80): %500 hasar, %100 isabet. | İlginç: İngilizce rehber "hasar için kullanma; kaçan (town'a basan) rakibi durdurmak ya da son vuruş için sakla" diyor. | kaynaklı |
| Archer **"kör etme"** | **Blinding Strafe** (Archery SP 75): %400 hasar + körlük (moblara işlemez, uzun bekleme). Asas tarafında karşılığı **Blinding** (Assassin SP 72: %200–500 hasar + 2–3 sn körlük). | Körlük = rakip kısa süre hedef alamaz/vuramaz. Rehberler Blinding Strafe'i "panik düğmesi" olarak tarif ediyor; görünmez düşmana da işlediği yazıyor. | kaynaklı |
| Mage **"küp"** | Büyük olasılıkla **Freezing Distance** (Glacier SP 80): hedefi buz içine hapseder; ~15 sn hareketi %1'e düşürür, donma şansı hedefin mevcut HP'sine bağlı. | Doğrudan "küp = Freezing Distance" diyen bir sözlük bulamadım. Ama ilanlar "80 lvl **ice küp** mage (ice 80 / lightning 47 / master 15)" ve "80 küp full skill mage (80/45/15)" diye geçiyor: "küp" buz dalı 80 skilliyle birlikte anılıyor ve görsel olarak hedef buz bloğuna gömülüyor. Dikkat: Türkçede "küp" aksesuar (küpe) için de kullanılabiliyor; Yasin'in kastı "rakibi buz küpüne sokan skill" ise eşleşme doğru. | tahmini (güçlü çıkarım) |

Kaynaklar: https://volbiex.com/oyun/berserker-warrior-nedir.html · https://forum.turkmmo.com/konu/1971405-knight-online-warrior-skilleri-1-80-aciklamali/ · https://www.kopazar.com/en/blog/knight-online-priest-skills-guide · https://korehberi.com/knight-online/siniflar/priest · https://www.frmtr.com/knight-online/4912326-duffer-db-priest-hakkinda-tavsiyeler-alinir.html · https://www.frmtr.com/knight-online/3121234-battle-priest-db-atamaz-heal-atamaz-diyorlar-siz-nediyorsunuz.html · https://www.oyunfor.com/ilanlar/knight-pvp/item/pathoswar/pathoswar-clanlar-icin-ozel-fx-db-malice-torment-massive-853905 · https://sivri.org/str-battle-priest-stat-skill-dagilimi-knight-bp-priest-rehberi/ · https://www.kopazar.com/en/blog/knight-online-rogue-guide · https://forum.turkmmo.com/konu/1109-rogue-skilleri-1-80-aciklamali/ · https://www.pvpserverler.pro/konu/ko-rogue-archery-assassin-skiller-statlar-ve-puf-noktalar.814/ · https://www.oyunfor.com/ilanlar/knight-online/account/agartha/80-lvl-ice-kup-mage-full-skill-1009286 · https://www.oyunfor.com/ilanlar/knight-online/account/zero/80-kup-full-skill-mage-1017445 · https://www.pvpserverler.pro/konu/mage-skilleri-statlar-ve-puf-noktalar-ko.812/

### Diğer sık argo (kaynaklı ya da topluluktan yaygın bilinen)

| Argo | Anlamı |
|---|---|
| **+++++** / **RB** | Buff isteği / rebuff (priest buff'larını yenile). |
| **>>>>>** / **SW** / **RS** | Swift (rogue'un hız buff'ı) isteği / reswift. |
| **WF / wolf** | Strength of Wolf (rogue parti saldırı buff'ı) isteği. |
| **LF** | Light Feet (rogue, kısa süre koşu hızı ×2). *[tahmini: sözlükler bunu yazmıyor ama asas bar'larında "Light Feet" sürekli geçiyor]* |
| **minor** | Minor Healing — rogue'un beklemesiz küçük kendini iyileştirmesi (60 HP); "minorlamak" = sürekli basarak ayakta kalmak. |
| **voker** | Provoke (Defense SP 45) açmış, alan aggro'su çeken warrior. |
| **TP** | Mage'in parti üyesini yanına çekmesi (Summon Friend). |
| **AC** | Priest'in defans buff'ları (Insensibility ailesi). |
| **cure / res(s)** | Cure Curse/Cure Disease ile debuff temizleme / diriltme. |
| **paper** | Tüm puanı saldırıya basmış, cam top karakter. |

Kaynaklar: https://korehberi.com/knight-online/rehberler/terimler-ve-kisaltmalar-sozlugu · http://ko-rehber.blogspot.com/2007/02/terimler.html · https://forum.turkmmo.com/konu/104363-knight-online-terimleri-sozlugu/

---

## 2. Warrior

Rol: ön saf, yüksek HP/defans, yakın dövüş. Topluluk build'leri: **Atak** (Attack ana + Defense yan, en yaygın), **Defans** (tank/aggro), **Berserker** (Passion 80+, saldırı hızı).

### 2.1 Basic
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Sprint | 1 | Kısa süre koşu hızı ↑ | kaynaklı |
| Slash | 3 | %120 hasar | kaynaklı |
| Crash | 5 | İsabet ×1.5 | kaynaklı |
| Defense | 7 | Kısa süre +50 defans | kaynaklı |
| Piercing | 9 | %120 hasar +50 | kaynaklı |

### 2.2 Attack
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Hash / Shear | 5–10 | Defansı yok sayan küçük ek hasar | kaynaklı |
| Hoodwink | 5 | %150 hasar | kaynaklı |
| Pierce | 15 | Iskalamayan vuruş | kaynaklı |
| **Leg Cutting** | 20 | Rakibin hareket hızını düşürür (slow) | kaynaklı |
| Carving | 25 | %200 hasar | kaynaklı |
| Multiple Shock | 40 | %150 + ek hasar | kaynaklı |
| Cleave | 45 | %250 hasar | kaynaklı |
| Thrust | 55 | %200, ıskalamaz | kaynaklı |
| Sword Aura / Sword Dancing | 57–60 | %200–250, HP emme, ıskalamaz | kaynaklı |
| Howling Sword | 70 | %300 + 200 | kaynaklı |
| **Bleeding (Blooding)** | 75 | %200 + 150, ayrıca 20 sn boyunca ~1000 DoT | kaynaklı |
| **Hell Blade** | 80 | %300 + 350, ıskalamaz — Attack dalının "80 skill"i | kaynaklı |

### 2.3 Defense
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Hinder / Arrest / Bulwark / Evading / Iron Skin / Iron Body | 5–80 (pasif) | Defans %10→%40–50 (kalkansız yarıya iner) | kaynaklı |
| Resist / Endure / Immunity | 10–40 (pasif) | Tüm dirençler +30/+60/+90 | kaynaklı |
| **Binding** | 30 | Tek düşmanı kendine kilitler (taunt) | kaynaklı |
| **Provoke** | 45 | Alandaki düşmanları kendine çeker (alan taunt) — "voker" | kaynaklı |
| Sacrifice | 60 | Kendi HP'siyle parti üyesini iyileştirir | kaynaklı |
| **Wall of Iron** | 75 | 10 sn defans ×3, karşılığında koşu −%50 | kaynaklı |

### 2.4 Passion / "Berserk"
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Gain | 5 | +15 STR | kaynaklı |
| Pain Killer / Blaze Killer / Return to Life | 10–50 | HP↔MP dönüşümü | kaynaklı (yön kaynaklar arası karışık) |
| Outrage / Frenzy | 20–60 | Gelen hasarı MP'den karşılar ya da saldırı hızı ↑ (kaynaklar çelişiyor) | tahmini |
| Restoration / Regeneration | 35–55 | 15 sn HP yenilenmesi | kaynaklı |
| **Berserker** | 70–80 | 20 sn saldırı hızı +%20, defans −300 | kaynaklı |
| **Berserk Echo / Blood of Gain** | 75 | 30 sn saldırı hızı +%40, defans −300 | kaynaklı |
| HP Booster | 80 | Ayaktayken oturur gibi HP yenilenir | kaynaklı |
| Battle Cry | 83 | 30 m içindeki partiye tüm statlar +15 (sonraki sürüm) | kaynaklı |

### 2.5 Master
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Boldness | 0 (pasif) | HP ≤%30 iken defans +%20 | kaynaklı |
| Scream | 2 | Alan yavaşlatma + HP emme | tahmini |
| Absoluteness / Matchless | 5 / 10 (pasif) | Alınan hasar −%10 / −%15 (tüm sınıflarda ortak) | kaynaklı |
| **Exceed Break** | 15 | Rakip defansını kırar | tahmini |
| **Break Counter / Shock Stun** | 20 | %200 hasar + 3 sn **stun** | kaynaklı |

Kaynaklar: https://forum.turkmmo.com/konu/1971405-knight-online-warrior-skilleri-1-80-aciklamali/ · https://korehberi.com/knight-online/siniflar/warrior · https://www.kopazar.com/en/blog/knight-online-warrior-guide · https://volbiex.com/oyun/berserker-warrior-nedir.html · https://www.pvpserverler.pro/konu/ko-warrior-skiller-statlar-ve-puf-noktalar.813/ · https://forum.donanimhaber.com/warrior-skilleri-neye-vermeli--6774724

---

## 3. Rogue

Rol: DEX'li, hızlı; iki yol. **Archer** uzaktan çoklu ok + kontrol; **Asas** görünmezlik + ani patlama. Explore dalı ikisinin ortak hayatta kalma dalı.

### 3.1 Basic (ortak)
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Sprint | 1 | Koşu ↑ | kaynaklı |
| Stab / Stab2 | 5–7 | Hançer %150 / %250 | kaynaklı |
| Archery / Archery2 | 3–9 | Ok saldırısı, %120 | kaynaklı |
| **Swift** | 10 | Hedef/parti koşu hızı ↑ ("SW") | kaynaklı |
| **Strength of Wolf** | 30 | Parti saldırı gücü ↑ ("wolf") | kaynaklı |

### 3.2 Archery (Archer)
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Fire Arrow / Poison Arrow | 5–10 | Ateş / zehir hasarlı ok | kaynaklı |
| **Multiple Shot** | 15 | Aynı anda 3 ok | kaynaklı |
| Guided / Perfect Arrow | 20–25 | Iskalamaz / %200 | kaynaklı |
| Arc Shot | 40 | %250 | kaynaklı |
| Explosive Shot / Viper | 45–50 | Güçlü ateş / zehir oku | kaynaklı |
| Counter Strike | 52 | Kritik hasarlı ok | kaynaklı |
| **Arrow Shower** | 55 | Aynı anda 5 ok — archer'ın ikonik seri atışı | kaynaklı |
| Shadow Shot / Shadow Hunter | 57–60 | %200–300, ıskalamaz | kaynaklı |
| **Ice Shot** | 62 | %300 + yavaşlatma şansı | kaynaklı |
| **Lightning Shot** | 66 | %300 + 3 sn stun | kaynaklı |
| Dark Pursuer | 70 | %350, ıskalamaz | kaynaklı |
| Blow Arrow | 72 | %200, koşarken atılabilir | kaynaklı |
| **Blinding Strafe** | 75 | %400 + körlük; uzun bekleme, "panik düğmesi" — **kör etme** | kaynaklı |
| **Power Shot** | 80 | %500, %100 isabet — archer'ın **80 skill**i | kaynaklı |

### 3.3 Assassin (Asas)
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Jab / Shock / Cut | 0–40 | Defansı yok sayan hançer vuruşları | kaynaklı |
| **Blood Drain** | 10 | Rakip HP'sinin %5'ini çalar (dakikada 1) | kaynaklı |
| Pierce | 15 | %200 | kaynaklı |
| Illusion | 30 | 15 sn rakip isabeti ↓ | kaynaklı |
| Thrust | 35 | %400 | kaynaklı |
| **Stealth** | 45 | 80 sn hareket ederken görünmezlik; saldırınca bozulur | kaynaklı |
| **Vampiric Touch** | 50 | Rakip HP'sinin %10'unu çalar (dakikada 1) | kaynaklı |
| **Spike** | 55 | %600 — asas'ın ana vuruşu | kaynaklı |
| Bloody Beast | 70 | Defansı yok sayan bıçaklama | kaynaklı |
| **Blinding** | 72 | Hasar + 2–3 sn körlük (kaynaklar %200/%500 diye ayrışıyor) | kaynaklı (sayı tahmini) |
| **Beast Hiding** | 75 | Hasar + 3 sn görünmezlik (vur-kaybol) | kaynaklı |
| **Critical Point** | 80 | Kritik vuruş; skilleri ~çift hasara çıkarır, PvP'ye özel — **"critic"** | kaynaklı / mekanik tahmini |

### 3.4 Explore (ortak savunma/hareket)
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| **Hide** | 0 | 40 sn görünmezlik, hareket edince bozulur | kaynaklı |
| **Minor Healing** | 5 | 60 HP, beklemesiz — "minor" | kaynaklı |
| **Evade** | 10 | 10–15 sn +200 AC | kaynaklı |
| Cat's Eyes / **Lupine Eyes** | 15 / 35 | Görünmezleri görme (kendin / parti) | kaynaklı |
| **Light Feet** | 25 | 10–15 sn koşu ×2 — "LF" | kaynaklı |
| **Safety** | 30 | 15 sn +400 AC | kaynaklı |
| Cure Curse / Cure Disease | 36 / 48 | Kendi debuff'larını temizler | kaynaklı |
| **Scaled Skin** | 60 | 15 sn +800 AC | kaynaklı |
| Wild Advent | 70 | Seçili düşmanın yanına ışınlanır | kaynaklı |
| Smoke Screen | 80 | Görüş kesen duman | kaynaklı |

### 3.5 Master
Valor (HP ≤%30 iken direnç ↑), Magic Shield, Absoluteness/Matchless, **Source Marking** (rakibi işaretler, görünmez olamaz), Disarm / Eskrima (silah düşürme ya da kanama + dagger/bow defansı −%10; sürüme göre). *[kaynaklı, sürüm farkları var]*

Kaynaklar: https://forum.turkmmo.com/konu/1109-rogue-skilleri-1-80-aciklamali/ · https://www.kopazar.com/en/blog/knight-online-rogue-guide · https://korehberi.com/knight-online/siniflar/rogue · https://www.pvpserverler.pro/konu/ko-rogue-archery-assassin-skiller-statlar-ve-puf-noktalar.814/ · https://forum.donanimhaber.com/asas-archer-rehberi--56516795 · https://ercany.net/knight-online-rogue-skill-rehberi/

---

## 4. Mage

Rol: uzaktan büyü, alan hasarı, kontrol. KO'da mage'in kimliği: **ateş = ham hasar + DoT**, **buz = yavaşlatma/dondurma**, **elektrik = stun/büyü kesme**. Her dalda aynı iskelet tekrar eder: tek hedef → alan (Burst) → asa vuruşu (Blade/Staff) → direnç pasifi → 54 "Sun" (can çalma) → 57 "Impact" → 60 "Nova" → 70 iki skill (tek + alan) → 75 "Armor" (yansıtma) → 80 tepe.

### 4.1 Basic
Flash, Shiver (buz + yavaş), Flame, Cold Wave (buz + %65 yavaş), Spark (elektrik + kısa büyü kesme), **Summon Friend (TP)**, Gate, Escape (partiyi geri döndürür). *[kaynaklı]*

### 4.2 Flame (ateş)
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Burn | 3 | Iskalamaz küçük ateş | kaynaklı |
| Blaze | 9 | Vuruş + 20 sn yanma (DoT) | kaynaklı |
| Fire Ball | 15 | Ateş topu | kaynaklı |
| Ignition | 18 | Hedefi saran ateş | kaynaklı |
| Fire Spear/Sphere | 27 | Mızrak ateş | kaynaklı |
| Fire Burst | 33 | Alan ateş | kaynaklı |
| Fire Blast | 35 | Uzak ateş | kaynaklı |
| **Hell Fire** | 39 | Vuruş + uzun yanma DoT | kaynaklı |
| Fire Blade | 42 | Asa + ateş | kaynaklı |
| **Inferno** | 45 | Geniş alan (≈15 m) ateş — savaş alanı klasiği | kaynaklı |
| Pillar of Fire | 51 | Hedefi ateş sütunuyla sarar | kaynaklı |
| Fire Sun | 54 | Ateş + can çalma | kaynaklı |
| Fire Impact | 57 | Sürekli ateş hasarı | kaynaklı |
| **Super Nova** | 60 | Alan ateş patlaması + DoT | kaynaklı |
| **Incineration** | 70 | Tek hedef en yüksek ateş (~2500) | kaynaklı |
| **Meteor Fall** | 70 | Alan "ateş yağmuru" (~2100) — görsel olarak en ikonik | kaynaklı |
| Fire Staff | 72 | Asa vuruşu + ateş | kaynaklı |
| Armor of Fire | 75 | Vurana ateş hasarı yansıtır | kaynaklı |
| Vampiric Fire | 80 | Ateş + can/mana emme | kaynaklı |

### 4.3 Glacier (buz)
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Freeze | 3 | Buz + 10 sn %50 yavaş | kaynaklı |
| Chill | 9 | Buz büyüsü | kaynaklı |
| Frozen Armor / Shell | 12 / 30 | Kendine defans | kaynaklı |
| Ice Arrow | 15 | Buz mızrağı + yavaş | kaynaklı |
| **Solid** | 18 | Beklemesiz buz vuruşu | kaynaklı |
| Ice Orb | 27 | Buz küresi | kaynaklı |
| Ice Burst | 33 | Alan buz | kaynaklı |
| Ice Blast | 35 | Buz patlaması + yavaş | kaynaklı |
| Frostbite | 39 | "Soğuk ısırığı" | kaynaklı |
| Frozen Blade | 42 | Asa + buz | kaynaklı |
| **Blizzard** | 45 | Alan kar fırtınası + ~18 sn yavaş | kaynaklı |
| **Ice Comet** | 51 | Buz kuyruklu yıldızı + yavaş | kaynaklı |
| Ice Barrier | 54 | Defans ↑ | kaynaklı |
| Ice Impact | 57 | Şoklayan buz patlaması | kaynaklı |
| **Frost Nova** | 60 | Geniş alan + 20 sn yavaş | kaynaklı |
| **Prismatic** | 70 | Tek hedef ~1750 buz + yavaş | kaynaklı |
| **Ice Storm** | 70 | Alan buz bulutları | kaynaklı |
| Ice Staff | 72 | Asa vuruşu | kaynaklı |
| Armor of Ice | 75 | Yansıtma + vuranı yavaşlatma | kaynaklı |
| **Freezing Distance** | 80 | ~15 sn hareket %1 (donma); şans hedef HP'sine bağlı — **muhtemelen "küp"** | kaynaklı / argo tahmini |

### 4.4 Lightning (elektrik)
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Charge | 3 | Iskalamaz elektrik | kaynaklı |
| Counter Spell | 9 | 3 sn büyü kesme + DoT | kaynaklı |
| Lightning | 15 | Elektrik + rakip büyüsünü keser | kaynaklı |
| Static Hemisphere | 18 | Hedefin etrafına elektrik küresi | kaynaklı |
| Thunder | 27 | Yıldırım | kaynaklı |
| Thunder Burst | 33 | Alan elektrik | kaynaklı |
| Thunder Blast | 35 | Uzak şimşek + büyü kesme | kaynaklı |
| **Discharge** | 39 | Hedefi kilitler, aralıklı hasar | kaynaklı |
| Charged Blade | 42 | Asa + elektrik | kaynaklı |
| **Thunder Cloud** | 45 | Alana yıldırım bulutu | kaynaklı |
| Static Orb | 51 | Elektrik küresi | kaynaklı |
| Static Sun | 54 | Elektrik + can çalma | kaynaklı |
| Thunder Impact | 57 | Sürekli elektrik | kaynaklı |
| **Static Nova** | 60 | 15 m alan patlaması | kaynaklı |
| Stun Cloud | 70 | Tek hedef + stun | kaynaklı |
| **Chain Lightning** | 70 | Zincirleme alan elektrik | kaynaklı |
| Light Staff | 72 | Asa + stun şansı | kaynaklı |
| Armor of Lightning | 75 | Yansıtma + stun şansı | kaynaklı |
| **Blink** | 80 | 20 m ileri ışınlanma | kaynaklı |

"Static Thorn" adını doğrulayamadım; muhtemelen Static Orb/Static Nova ile karışıyor. *[tahmini]*

### 4.5 Master
Valor, **Absolute Power** (süreli büyü gücü +%30), Absoluteness/Matchless, **Mana Shield** (hasarın %15'i manadan), **Instantly Magic** (bekleme süresi olmadan iki büyüyü art arda atma), **Minor Resist** (alandaki düşmanın dirençleri −%20). *[kaynaklı]*

Kaynaklar: https://forum.turkmmo.com/konu/1971402-knight-online-mage-skilleri-1-80-aciklamali/ · https://korehberi.com/knight-online/siniflar/mage · https://www.pvpserverler.pro/konu/mage-skilleri-statlar-ve-puf-noktalar-ko.812/ · https://forum.donanimhaber.com/mage-skill-dizlimi--16601302

---

## 5. Priest

Rol: iyileştirme, buff, debuff; STR'li "battle priest" ayrıca vurur. Türk topluluğunda priest'in kimliği üçlüdür: **heal** (CH), **buff** (+++ / AC / HP buff), **debuff** (malice / db / torment).

### 5.1 Basic
Tiny Healing, Light Strike, Strength (+15 STR), Light Healing, Resist Poison, Brightness, Tiny Restore. *[kaynaklı]*

### 5.2 Healing
| Skill | Sv. | Etki | Güven |
|---|---|---|---|
| Minor → Healing → Major → Great → Massive → Superior Healing | 0–60+ | 60 → 1920 HP anlık iyileştirme | kaynaklı |
| Light/Restore/Major/Great/Massive/Superior Restore | — | 20 sn'ye yayılan iyileştirme (100 → 2500) | kaynaklı |
| Cure Curse / Cure Disease | — | Debuff/zehir temizleme ("cure") | kaynaklı |
| Group Massive Healing | — | Tüm partiye 960 HP | kaynaklı |
| **Complete Healing** | ~60–70 | Tek hedefe ~10.000 HP ("CH") | kaynaklı / Sv. tahmini |
| **Group Complete Healing** | ~70+ | Tüm partiye ~10.000 HP | kaynaklı / Sv. tahmini |
| Critical Restore / Past Recovery / Past Restore | 70–80 | Partiye büyük zamana yayılı iyileştirme | kaynaklı |
| Resurrection | Holy'de | Ölüyü diriltme ("res") | kaynaklı |

### 5.3 Aura (buff)
| Skill | Etki | Güven |
|---|---|---|
| **Insensibility** ailesi (Skin → Shell → Armor → Shield → Barrier → Protector → Peel → Guard) | +20 → +350 defans ("AC") | kaynaklı |
| HP ailesi (Grace → Brave → Strong → Hardness → **Mightness** → Heapness → Massiveness → Imposingness → Superioris) | +60 → +2500 max HP | kaynaklı |
| **Undying** | Max HP'nin %60'ı kadar HP | kaynaklı |
| Resist All / Bright / Calm / Fresh Mind | Tüm dirençler +40→+80 | kaynaklı |
| Greatness / Massive Binder / Pound Insensibility | Parti çapında HP / defans | kaynaklı |
| **Bless of God** | Tüm partiden debuff kaldırır | kaynaklı |
| **Counter Curse** | 10 sn debuff bağışıklığı | kaynaklı |
| Wrath / Wield / Harsh / Corrupts | Saldırı (battle priest) | tahmini |

### 5.4 Holy (debuff — "DB")
| Skill | Etki | Güven |
|---|---|---|
| **Malice** | Tek hedef defans −%20–25; 3 puanla açılır | kaynaklı |
| Clear Mana / Sweep Mana | Rakip MP −480 / −960 | kaynaklı |
| Confusion | Büyü gücü −%30 | kaynaklı |
| Slow | Saldırı hızı −%20 | kaynaklı |
| Reverse Life | Rakibin HP buff'ını siler | kaynaklı |
| **Sleep Wing / Sleep Carpet** | Tek / alan uyutma (moblara, ~20 sn) | kaynaklı |
| **Parasite** | Rakip max HP −%20 (dar anlamda "db") | kaynaklı |
| **Torment** | Alan defans −%30 | kaynaklı |
| **Massive** | Tek hedef saldırı −%20 | kaynaklı |
| Subside | Alan saldırı −%20 | kaynaklı |
| **Superior Parasite** | Max HP −%30, yalnız oyunculara (~Sv. 75) | kaynaklı |
| Discountis | Alan MP düşürme | kaynaklı |

Not: Bütün debuff'lar temizlenebilir (cure / Bless of God). Bu kart oyununa doğrudan taşınabilir bir kural: "lanet" etiketi + "temizle" karşı kartı.

### 5.5 Master
Daring/Valor (HP ≤%30 iken defans +%20), **Judgement** (hasar), Absoluteness/Matchless, **Helis** (~%250, defansı yok sayar; ~72), **Curse Refraction** (10 sn debuff'ları engeller ve geri yansıtır), Elysian Web (büyü defansı), Minak's Thorn (hasar yansıtma, sonraki sürüm — adı kişi adı içerdiği için KOIdLe'de kullanılmamalı). *[kaynaklı]*

Kaynaklar: https://www.kopazar.com/en/blog/knight-online-priest-skills-guide · https://korehberi.com/knight-online/siniflar/priest · https://forum.turkmmo.com/konu/1971409-knight-online-priest-skilleri-1-80-aciklamali/ · https://ercany.net/priest-skilleri-ve-ozellikleri/ · https://sivri.org/str-battle-priest-stat-skill-dagilimi-knight-bp-priest-rehberi/ · https://www.frmtr.com/knight-online/3589764-priestin-vs-de-heal-ve-malice-atmasi.html

---

## 6. En ikonik skiller (job başına 4–6)

Sıralama: rehberlerde "olmazsa olmaz" diye geçme sıklığı + Türkçe forumlarda adıyla/argosuyla anılma + build adını belirleme. Kesin anket verisi değil; topluluk taraması.

**Warrior**
1. **Berserker / Berserk Echo** — "berserk"; defansı feda edip hız. Build'e adını veriyor.
2. **Hell Blade** — Attack dalının 80'i, warrior'ın en büyük tek vuruşu.
3. **Provoke / Binding** — tank kimliği ("voker").
4. **Leg Cutting** — kaçanı yavaşlatan PvP klasiği.
5. **Wall of Iron** — 10 sn ×3 defans, "kale ol" anı.
6. **Break Counter (Shock Stun)** — warrior'ın tek gerçek stun'ı.

**Rogue — Archer**
1. **Arrow Shower** (5 ok) / **Multiple Shot** (3 ok) — archer'ın görsel imzası.
2. **Blinding Strafe** — "kör"; panik düğmesi.
3. **Power Shot** — "80 skill"; kaçanı/son vuruşu bitirir.
4. **Lightning Shot / Ice Shot** — oktan stun/yavaş.
5. **Swift + Strength of Wolf** — partinin istediği iki rogue buff'ı (SW, WF).

**Rogue — Asas**
1. **Spike** — ana vuruş.
2. **Critical Point** — "critic", ani patlama.
3. **Stealth / Hide** — görünmezlik, asas kimliği.
4. **Blinding** — yakın körlük.
5. **Light Feet + Evade/Safety/Scaled Skin** — kaç-dön hayatta kalma ("LF", "minor").
6. **Beast Hiding** — vur-kaybol.

**Mage**
1. **Meteor Fall** — görsel olarak en çok hatırlanan.
2. **Freezing Distance** ("küp", muhtemelen) — buz mage'in imzası.
3. **Super Nova / Inferno** — alan ateş, savaş klasiği.
4. **Ice Storm / Blizzard / Frost Nova** — alan yavaşlatma.
5. **Chain Lightning / Thunder Cloud / Static Nova** — elektrik alanı + stun.
6. **TP (Summon Friend)** ve **Instantly Magic** — hasar değil ama en çok konuşulan fayda skilleri.

**Priest**
1. **Complete Healing / Group Complete Healing** — "CH".
2. **Malice** — her priest'in açtığı defans kırıcı.
3. **Parasite / Superior Parasite** — "db".
4. **Torment** — alan defans kırıcı, savaş açılışı.
5. **Undying / Mightness + Insensibility (AC)** — "+++" ile istenen buff paketi.
6. **Bless of God / Cure** — temizleme; **Resurrection** ("res").

---

## 7. Combo ve sinerji kalıpları (in-job ve parti)

Kaynaklardan ve topluluk tartışmalarından çıkan, kart oyununa "zincir/kombo" olarak taşınabilecek kalıplar:

### Sınıf içi (in-job) kombolar
- **Mage — Dondur, sonra yak/çarp:** Buz skilleriyle (Freeze/Ice Comet/Frost Nova, tepe noktada Freezing Distance) hedefi yavaşlat/dondur, ardından ateş veya elektrikle ağır hasar. Rehber açıkça "önce yavaşlat, sonra yüksek hasar" sırasını öneriyor. → Kart karşılığı: "Donmuş hedefe +X hasar".
- **Mage — Instantly Magic:** Master skilliyle iki büyüyü bekleme süresi olmadan art arda atmak (ör. Freezing Distance + Incineration). → "Bu tur bir sonraki büyün bedelsiz/beklemesiz".
- **Mage — Hell Fire / Blaze DoT üstüne patlama:** Önce yanma DoT'u bas, sonra tek hedef nükleer. → "Yanan hedefe ek etki".
- **Asas — Stealth → yaklaş → Critical Point → Spike/Thrust:** Görünmez yaklaş, ilk vuruşu kritikle aç, ani patlama; iş bitmezse **Beast Hiding** ile tekrar kaybol ya da **Light Feet** ile kaç, **Minor Healing** ile toparlan. → "Gizli" durumu + "gizliden çıkınca ilk vuruş ×2".
- **Asas — Blinding ile karşı hamleyi kes:** Körlük süresinde rakip vuramaz; o pencerede Spike. → "Kör: 1 tur saldıramaz".
- **Archer — Kör et ve uzaklaş:** Blinding Strafe panik anında; ardından Light Feet ile mesafe aç, Arrow Shower/Multiple Shot ile uzaktan baskı; kaçan/town'a basan rakibi **Power Shot** ile bitir. → "Finisher: HP'si düşük hedefe garantili vuruş".
- **Warrior — Leg Cutting → takip:** Yavaşlat, yetiş, büyük vuruş (Hell Blade/Bleeding DoT). → "Yavaş hedefe bonus".
- **Warrior — Berserk penceresi:** Berserker'ı aç (defans ↓, hız ↑), kısa sürede hasarı boşalt; tehlikedeyse Wall of Iron ile ters kutup. → "Risk buff'ı" ve "kale" iki uç kart.
- **Priest — Debuff zinciri:** Önce **db** (Parasite: max HP ↓), sonra **Malice** (defans ↓), alan savaşında **Torment**; battle priest bunun üstüne Judgement/Helis ile vurur. Forumlarda tam olarak "önce db, sonra malice" sırası geçiyor. → "Lanet yığma": her debuff bir sonrakini güçlendirir.
- **Priest — Heal ritmi:** Restore (zamana yayılı) önden, Healing anlık, CH son çare. → Kart: "HoT + anlık heal + uzun bekleme süreli tam heal".

### Sınıflar arası (parti) sinerjileri
- **Priest buff + Warrior ön saf:** Warrior'a AC + HP buff (Undying/Mightness) basılır, warrior Provoke ile aggro çeker, priest arkadan CH ile tutar. Klasik "tank + healer".
- **Priest Malice/Torment → Mage/Asas patlaması:** Defans kırıcı debuff'tan sonra hasarcı vurur; savaşlarda "önce torment, sonra AoE" ritmi.
- **Rogue Swift + Wolf:** Partiye hız ve saldırı buff'ı; "SW / WF" istekleri sohbetin parçası.
- **Mage TP + parti:** Mage parti üyesini yanına çeker; toplanma/baskın.
- **Lupine Eyes / Source Marking → görünmezleri aç:** Asas'ın Stealth'ine karşı sayaç; görünmez/gör karşıtlığı kart oyununda "gizli / ifşa" mekaniği olarak çalışır.
- **Cure / Bless of God / Counter Curse ↔ DB priest:** Debuff'a karşı temizleme ve bağışıklık; doğal bir "taş-kağıt-makas" katmanı.

### KOIdLe tasarımı için çıkarımlar (öneri, karar değil)
- Her job'a 1 **imza durum etkisi** önerisi: Warrior = *Yavaş/Taunt*, Archer = *Kör*, Asas = *Gizli*, Mage = *Don/Yanık*, Priest = *Lanet (defans ↓, max HP ↓)*.
- Topluluk hafızasında en güçlü kalan şeyler "ham hasar" değil **durum + ödeme** ikilileri: dondur→yak, kör et→vur, lanetle→patlat, gizlen→kritikle. In-job combo tasarımı bu "hazırla → ödüllendir" iskeletiyle kurulabilir.
- "Risk buff'ı" (Berserker: hasar ↑ savunma ↓) ve "son çare" (CH, Wall of Iron, Blinding Strafe) kartları oyuncunun tanıdığı duygusal anlar.

Kaynaklar: https://www.pvpserverler.pro/konu/mage-skilleri-statlar-ve-puf-noktalar-ko.812/ · https://www.pvpserverler.pro/konu/ko-rogue-archery-assassin-skiller-statlar-ve-puf-noktalar.814/ · https://www.kopazar.com/en/blog/knight-online-rogue-guide · https://forum.turkmmo.com/konu/1971402-knight-online-mage-skilleri-1-80-aciklamali/ · https://www.frmtr.com/knight-online/3121234-battle-priest-db-atamaz-heal-atamaz-diyorlar-siz-nediyorsunuz.html · https://korehberi.com/knight-online/rehberler/terimler-ve-kisaltmalar-sozlugu · https://www.kopazar.com/en/blog/knight-online-warrior-guide

---

## 8. Açık kalanlar (Yasin'e soru)

1. **"Küp"** gerçekten Freezing Distance mı (hedefi buz bloğuna sokan 80 buz skilli)? Yoksa başka bir buz skilli mi (ör. Prismatic)? Ekşi Sözlük sayfalarına erişim engelliydi; doğrudan tanım bulunamadı.
2. **"Critic"**: Yasin'in hatırladığı mekanik — süreli kritik buff mı, tek seferlik ×2 vuruş mu? Kaynaklar yalnız "kritik vuruş yaptırır, PvP'ye özel" diyor.
3. **"Berserk"**: Yasin dal adı mı (Passion), yoksa belirli buff mı (Berserker / Berserk Echo) kastediyor? Kart için ikisi de "hasar ↑ savunma ↓" temasına çıkıyor.
4. SP eşikleri sürüme göre ±5 oynuyor (eski 1–80 dönemi ile sonraki 83 dönemi). Kart oyunu için birebir sayı gerekmiyorsa sorun değil.
