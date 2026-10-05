# KOIdLe — Prototype Design Spec v0.2

> **v0.2 değişiklikleri (2026-10-05, self-review + Yasin'in kararları):** Faz 5'te hafif backend + bot oyuncular · baskın hedefi: saldıran da CZ'de olmalı, slot içi seçim + otomatik "Savaş Ara" · baskın kalkanı + saldıranın riski · tüm job kartları baştan açık · item desteye kart eklemez · Quick Duel'de item kart-efektleri taşınır · taşıma kapasitesi · EXP risk dışı · party = otomatik slot bonusu · Inspect Faz 3'e eklendi · Leaderboard v0.2 sonrasına kaydı.

> **Claude için talimat:** Bu dosya, Yasin ile yapılan sadeleştirme turunun sonucudur ve `docs/devam-notu.md` içindeki "Sıradaki adımlar → sadeleştirme turu" maddesini kapatır.
> 1. Bu dosyayı `docs/superpowers/specs/2026-10-05-koidle-prototype-v0.1.md` olarak kaydet.
> 2. `docs/devam-notu.md` dosyasını bu kararlara göre güncelle (Kesinleşen kararlar + Sıradaki adımlar).
> 3. Araştırma raporlarındaki (01–05) önerilerle çelişen yerlerde **bu dosya geçerlidir.**
> 4. Henüz kod yazma. Önce bu spec'i self-review et, belirsiz/çelişkili noktaları Yasin'e soru olarak listele, onay gelince writing-plans skill'ine geç.
> 5. Kural: Prototip bitmeden "ÇIKSIN" listesindeki hiçbir sistemi kodlama, önerme veya spec'e geri ekleme.

---

## 0. Ürün tanımı

**Tek cümle:** KOIdLe, karakterini riskli farm slotlarına bıraktığın, item düşürüp yükselttiğin ve karşı ulusun oyuncularıyla kart tabanlı savaşlara girdiğin **idle PvPvE RPG**'dir.

- Kartlar ürünün kendisi değil, **savaş dilidir**.
- Ana fantezi: *"Karakterim güçleniyor, değerli item buluyorum, risk alıyorum ve diğer oyuncular bunu görüyor."*
- MMORPG yapmıyoruz. KO hissini kart tabanlı bir RPG döngüsüne yoğunlaştırıyoruz.
- KO'ya ait hiçbir isim kullanılmaz (liste: `docs/research/01` başı).

### Tasarım sütunları
1. **Farm** — karakter slota bırakılır.
2. **Loot** — EXP, altın, item.
3. **Upgrade** — değerli item yükseltilir.
4. **Risk** — değerli bölgede karşı ulus baskını.

### Core loop
```
KARAKTER → CZ → FARM SLOTU SEÇ → AFK FARM → EXP + GOLD + ITEM
   → EQUIP / MERCHANT → UPGRADE → DAHA GÜÇLÜ SLOT
   → BASKIN / PvP → KART SAVAŞI → GANİMETİ KORU → KASABAYA DÖN → TEKRAR
```

---

## 1. KAPSAM KARARLARI

### 🟢 KALSIN (oyunun kimliği)

| Sistem | Prototipteki hali |
|---|---|
| 2 ulus | Geçici isim: Ulus A / Ulus B. Mekanik fark yok; CZ'de "biz/onlar" ve leaderboard için. |
| 4 job | Warrior, Rogue, Mage, Priest. KO skill/ünvan adları yok. |
| Level + EXP | Kısa progression. EXP farm, PvE ve PvP'den gelir. Uzun KO grind'ı yok. Level slot açar. |
| Item drop | Ana haz kaynağı. |
| Equipment | Var (sadeleşmiş hali aşağıda). |
| Upgrade | Var. Yanma yok, yüksek seviyede düşme var. |
| Örs Isısı | Tek pity sistemi. |
| CZ | Oyunun ana dünyası. Ayrı bir mod değil. |
| Farm slotları | 6 slot, kapasiteli. |
| AFK farm | CZ slotunda bulunmanın kendisi. |
| Baskın | Karşı ulusa saldırı. |
| AI savunma | Offline oyuncunun destesini AI oynar (asenkron PvP). |
| Kart savaşı | Hero vs Hero. |
| PvE | Birkaç düşman + elit + 1 boss. |
| Canlı 1v1 | Quick Duel (normalize). |
| CZ PvP | Gear geçerli. |
| Altın | Tek para birimi. |
| Offline merchant | Basit tezgâh. |
| Inspect | Başka oyuncunun karakterini/item'ını görme. |
| Görsel yön | **Harman** (`design/mockups/gorsel-yonler.html`). Asset'ler placeholder olabilir, UI okunaklı olmalı. |
| İlke: güç satılmaz | Final ürün için korunur. |

### 🟡 SADELEŞSİN

| Sistem | Araştırmadaki hali | Prototipteki hali |
|---|---|---|
| Statlar | STR/DEX/INT/HP/MP | **HP + Power** |
| Equipment | 5 zırh + takılar (≈11 slot) | **Weapon + Armor + Accessory** |
| Deste | 20 kart (16+4) | **12 kart** (final sayı değil, test değeri) |
| Savaş tahtası | 5 alanlı minion board | **Minion yok, Hero vs Hero** (minion modeli alternatif olarak saklanır) |
| Sınıf kaynakları | Öfke / Kombo / Odak / İnanç | **Sadece MP**. Sınıf kimliği kartlardan gelir. |
| Pity | Isınma + Örs Enerjisi + Şans Anı | **Sadece Örs Isısı** |
| Upgrade tavanı | +10 | **+8** |
| Party | Co-op destek kartları | **Davet sistemi yok. Aynı slotta farm yapan dost ulus oyuncuları otomatik küçük verim bonusu alır** (oran config). |
| KS | Son vuruş/hasar oranı | **Slot doluluğu rekabeti** |
| Ganimet riski | Taşınan ganimetin %30'u vb. | **Yalnız güvenceye alınmamış CZ ganimeti risklidir. Equipped item asla çalınmaz.** Oran playtest ile belirlenir. |
| Pazar | Hibrit tezgâh + küresel defter + vergi + bant + Kâtip | **Item seç → fiyat yaz → listele. Offline satış.** |
| Ekonomi | Altın + Elmas + Mühür + Öz | **Sadece Altın** |
| PvP | Lig, sezon, rütbe, ödül | **Quick Duel** (normalize) + CZ (gear) |
| PvE | Çok sayıda karşılaşma türü | **Normal + elit + 1 boss** |
| Boss | Dünya boss'u, pencereler, fazlar | **1 boss**, minimum faz/intent |
| Rarity | Çok katmanlı | **Common / Magic / Rare / Unique** |
| Town | Fiziksel şehir | **Menü hub'ı** (Character, CZ, Anvil, Market, Duel) |
| AI | — | **Basit skor tabanlı:** geçerli hamleleri bul, puanla, en iyisini oyna, turu bitir. |

### 🔴 ÇIKSIN (prototip dışı — silinmedi, sonraya kaldı)

- **Sefer** (ayrı AFK sistemi) → CZ farm slotu bunun yerini aldı. *Kalıcı olarak çıktı.*
- 5 stat sistemi
- Dayanıklılık / tamir
- Crafting / üretim / parçalama (Öz)
- Premium para (Elmas), premium üyelik, battle pass, gerçek para
- **Kraliyet Mührü / premium borsası** (açık soru prototip sonrasına ertelendi)
- Gelişmiş pazar: fiyat geçmişi, alış emri, uzaktan alım, vergi/bant sistemi
- 2v2 / 3v3, co-op parti savaşları
- Klan, pelerin, ittifak
- Kral, senato, kale savaşı, ulus savaşı, şehir baskını, kral parası
- Sezonluk lig, ranked ladder, sezon ödülleri
- Eşit karakterli kaos modu, Kaos Gecesi
- Filiz / Usta (mentor) sistemi
- Söylenti drop'ları
- Dünya boss'u, boss pencereleri, avcı defteri
- Kışkırtma (troll çekme)
- Sunucu Kayıtları Duvarı, bağırma kanalı
- Karmaşık skill ağaçları, meslek değişimi
- +9 / +10, rebirth
- Takı birleştirme, set bonusları
- İksir sistemi
- Mobil (Capacitor), Steam (Electron), IAP, RevenueCat, Steamworks → prototip PC/Web

---

## 2. Dünya ve karakter

- **Uluslar:** Görsel kimlik, CZ'deki düşman ve leaderboard tarafı. Stat/drop/ekonomi avantajı yok.
- **Job kimlikleri:**
  - **Warrior:** dayanıklılık + silah vuruşu, güçlü ama pahalı saldırılar.
  - **Rogue:** tempo + combo, ucuz saldırı zinciri, tek hedef burst.
  - **Mage:** büyü hasarı + kontrol, rakibin sonraki hamlesini bozma.
  - **Priest:** heal + buff/debuff, saldırı azaltma.
- **Level:** progression hissi verir, yeni slotları açar. Grind değildir.

## 3. Item ve equipment

- Slotlar: **Weapon, Armor, Accessory.**
- Item verisi: `id, name, type, rarity, basePower, upgradeLevel, effect, sellValue`
- **İlke:** Item sadece büyük rakam değildir; bazıları savaş davranışını değiştirir.
  - Örn. A silahı: Yarma +1 hasar · B silahı: Yarma −1 MP · C silahı: Yarma kullanınca +1 kalkan.
- İçerik bütçesi: ~15–20 item.

## 4. Upgrade

- Aralık **+0 → +8**. Item asla yok olmaz.
- Düşük seviyelerde başarısızlık seviyeyi korur; üst seviyelerde **−1** düşürür. (Eşik ve oranlar `content/upgrade-rates/` içinde config; başlangıç için `docs/research/04 §8.2` tablosunun +0..+8 kısmı kullanılabilir.)
- **Örs Isısı:** başarısızlıkta artar → efektif şansı yükseltir → başarıda sıfırlanır. Item bazında tutulur, başka item'a aktarılamaz.
- UI her zaman şunu gösterir: taban şans, ısı bonusu, efektif şans, maliyet, başarısızlık sonucu.
- Maliyet: altın (gold sink).

## 5. CZ (ana dünya)

- **6 farm slotu.** Her slot: `levelRequirement, capacity, baseGold, baseExp, dropTable, risk, currentPopulation`.
- Kapasite aşılınca verim düşer (eğri playtest ile belirlenir; kesin yüzde tanımlama).
- **AFK farm:** "Farm'a başla" → karakter slotta kalır, uygulama kapalıyken de farm ilerler.
- Ödüller yalnızca: **EXP, Gold, Item.**
- **EXP anında kazanılır ve risk dışıdır.** Risk altında olan yalnızca altın ve item'dır.
- **Taşınan ganimet (Carried Loot):** Farm'dan gelen altın ve item önce buraya gider. Oyuncu ya devam eder (daha fazla loot + risk) ya da kasabaya döner (loot güvenli envantere geçer).
- **Taşıma kapasitesi:** Taşınan ganimetin bir tavanı vardır (config). Tavan dolunca farm durur; oyuncu dönüp güvenceye almalıdır. Sınırsız çevrimdışı birikimi ve ekonomik patlamayı önler.
- **Party bonusu:** Aynı slottaki dost ulus oyuncu sayısına göre küçük verim bonusu (config). Kapasite aşımı kuralı ayrıca geçerlidir.
- **Zaman:** Geçen süre sunucuda ölçülür; `rules` paketine girdi olarak verilir (`Date.now` kuralı korunur).

## 6. Baskın ve asenkron PvP

```
Sen farmdasın → karşı ulustan oyuncu saldırır → BASKIN
   Online mısın?  EVET → sen oynarsın
                  HAYIR → AI senin karakter/ekipman/destenle oynar
   → KART SAVAŞI → SONUÇ
```
- **Kim saldırabilir:** Saldıranın kendisi de CZ'de bir slotta olmalıdır (kendi taşınan ganimetini de riske atar). İki yol: (1) aynı slottaki karşı ulus oyuncularını görüp hedef seçmek, (2) "Savaş Ara" ile CZ'deki karşı ulus oyuncularından seviye aralığına göre otomatik eşleşmek.
- **Online savunan:** canlı savaşa davet edilir; belirli süre (config) içinde katılmazsa AI savunur.
- Saldıran kazanırsa: savunanın taşınan ganimetinden bir kısmı gider.
- **Saldıran kaybederse: kendi taşınan ganimetinden bir kısmını kaybeder.** Baskın iki taraf için de kumardır.
- Savunan kazanırsa: farm devam eder.
- **Baskın kalkanı:** Baskın yiyen oyuncu (sonuç ne olursa olsun) belirli süre (config, başlangıç 30 dk) yeniden baskın yiyemez.
- Equipped item asla çalınmaz. EXP asla kaybedilmez.

## 7. Savaş (Hero vs Hero)

- Minion/summon yok. Ekran: rakip kahraman (HP, buff/debuff), oyuncu kahraman (HP, MP), el, Turu Bitir.
- **Tek kaynak: MP** (tur başına artar/yenilenir; değerler config).
- **Kart türleri:** Attack, Skill, Defense, Heal, Buff, Debuff.
- **Deste 12 kart**, başlangıç eli 4, tur başına 1 kart çekilir. Kopya kuralları ilk playtest sonrası.
- **Kart edinimi:** Job'un tüm kartları baştan açıktır. Oyuncu 12'lik destesini bu havuzdan kurar. İlerleme item ve level gücünden gelir, kart kilidinden değil.
- **Item'lar desteye kart eklemez.** Yalnızca Power/HP verir ve bazı kartların davranışını değiştirir (bkz. §3).
- **Maç bitirici:** belirli turdan sonra iki kahraman da artan hasar alır ("Arena Çöküşü" sade hali). Değerler config.
- **Equipment → savaş:** CZ ve PvE'de item gücü ve efektleri geçerli. Quick Duel'de sayılar normalize.
- Rastgelelik: çıktı rastgeleliği (kritik/ıskalama) yok; girdi rastgeleliği (kart çekimi) var.

## 8. PvP modları
- **CZ:** level + equipment + upgrade geçerli.
- **Quick Duel:** sayılar normalize (HP, Power, upgrade etkisizdir). Item'ın **kart davranışı efektleri** (ör. "Yarma −1 MP") taşınır; bunlar güç değil yatay seçimdir. Lig/sezon/ödül yok.

## 9. PvE
- Normal düşmanlar, elit, 1 boss. Boss, savaş sisteminin uzun karşılaşmayı kaldırıp kaldırmadığını test etmek içindir.

## 10. Merchant
- Item seç → fiyat yaz → listele → başka oyuncu satın alır → satıcı altın alır.
- İlan, oyuncu çevrimdışıyken aktif kalır. Başka özellik yok.

## 11. Ekranlar
01 Karakter yaratma · 02 Town · 03 Karakter/Equipment · 04 Inventory · 05 CZ haritası · 06 Slot detayı · 07 Aktif farm · 08 Savaş · 09 Savaş sonucu · 10 Örs · 11 Merchant · 12 Ganimet/dönüş özeti

---

## 12. Teknik ilkeler (prototip)

- `docs/research/05` mimarisi korunur ama **ihtiyaç oldukça** açılır.
- `packages/rules`: saf, deterministik TS. DOM/Node/Pixi/Colyseus yok. `apply(state, action) → { state, events }`.
- Seed'li PRNG; `Math.random` / `Date.now` yasak.
- UI karar vermez, yalnızca `BattleEvent` gösterir.
- Tüm içerik data-driven: `content/cards`, `content/items`, `content/drop-tables`, `content/upgrade-rates`, `content/farm-slots` (JSON + Zod).
- Şans değerleri basis point (10000 = %100).
- Başlangıçta **yok:** Electron, Capacitor, IAP, Steamworks, ölçek altyapısı.
- **Backend zamanlaması:** Faz 1–4 tamamen istemci tarafında (sunucu yok). **Faz 5'te hafif backend** gelir: Fastify + PostgreSQL; hesap, karakter, envanter, farm durumu, baskın, merchant. Boş CZ'yi dolduran **bot oyuncular** (sunucu tarafı, AI deste ile) Faz 5'te eklenir. Faz 8 bu backend'e yalnızca canlı savaş için Colyseus ekler.

---

## 13. Görev planı

> Her faz bir **Gate** ile biter. Gate geçilmeden sonraki faza geçilmez.

### Faz 0 — Kilitle
- P0.1 Bu spec'i kaydet, devam-notu'nu güncelle.
- P0.2 Test değerleri tablosu: Hero HP, MP eğrisi, kart maliyet/hasar, tur limiti, EXP, drop şansı, upgrade şansı, farm geliri, ganimet riski, AI zorluğu. (Doğru denge değil, başlangıç değerleri.)

### Faz 1 — Savaş sandbox'ı
- P1.1 Monorepo iskeleti (pnpm + Turborepo + strict TS + Vitest).
- P1.2 `packages/rules`: BattleState, PlayerState, Card, Action, Effect, Turn, Win/Lose, seeded RNG + testler.
- P1.3 Sadece **Warrior**, ~12 kart.
- P1.4 Basit AI (aggressive / balanced / defensive).
- P1.5 Placeholder savaş UI (rakip, log, oyuncu HP/MP, el, Turu Bitir).
- **GATE 1:** Hero-vs-Hero kart savaşı tek başına eğlenceli mi? Hayırsa sadece savaşı düzelt.

### Faz 2 — Dört job
- P2.1 Rogue, Mage, Priest kartları (toplam havuz ~40–50).
- P2.2 `tools/sim`: AI-vs-AI eşleşme simülasyonu, bariz kırıkları bul.

### Faz 3 — Karakter + equipment
- P3.1 Karakter: ulus, job, level, EXP, gold.
- P3.2 Inventory, 3 slot, ~15–20 item, equip → savaşa etki.
- P3.3 Inspect: başka bir karakterin ekipmanını ve item detayını görme (Faz 5'e kadar bot/örnek karakterlerle).

### Faz 4 — Upgrade
- P4.1 Örs ekranı, +0→+8, config oranlar, düşme, Örs Isısı.
- **GATE 2:** "Bu item'ı istiyorum → yükseltmek istiyorum" hissi oluşuyor mu?

### Faz 5 — PvE farm
- P5.0 Hafif backend: Fastify + PostgreSQL, basit hesap, karakter/envanter kalıcılığı, sunucu zamanıyla farm hesabı. Bot oyuncular.
- P5.1 CZ haritası, 6 slot, slot verisi, party bonusu.
- P5.2 AFK farm (zamana bağlı), taşıma kapasitesi, dönüş özeti, taşınan ganimet, kasabaya dönüş.
- P5.3 PvE düşmanlar + 1 boss.

### Faz 6 — CZ riski
- P6.1 İki ulus slotlarda görünür.
- P6.2 Baskın: slot içi hedef seçimi + "Savaş Ara". Online → canlı savaş daveti, offline/yanıtsız → AI savunma.
- P6.3 Sonuç, iki yönlü ganimet kaybı, baskın kalkanı.
- **GATE 3:** "Biraz daha mı kalayım, ganimeti güvene mi alayım?" kararı oluşuyor mu? Telefonu kapatınca dünyada kalma hissi heyecan veriyor mu?

### Faz 7 — Merchant
- P7.1 Listele / satın al / offline ilan. Grafik, alış emri, uzaktan alım yok.
- **GATE 4:** "İstemediğim item'ı sattım, başkası aldı" anlamlı mı?

### Faz 8 — Canlı PvP
- P8.1 Faz 5 backend'ine Colyseus eklenir. Oda yalnızca `rules` çağırır, sunucu otoriter (RNG, çekim, sonuç). Faz 6'daki online baskın savaşı da buraya taşınır.
- P8.2 Quick Duel eşleştirme, yeniden bağlanma.

### Faz 9 — Vertical slice UI
- Login → Karakter → Town → CZ → Farm → Savaş → Inventory → Örs → Market akışı, Harman token'larıyla.

### Faz 10 — Ölçüm
- Telemetri: savaş süresi, tur sayısı, ilk oyuncu kazanma oranı, job eşleşmeleri; farm süresi/kazanç; drop/equip/satış; upgrade deneme/başarı/düşme/ısı; baskın sayısı, saldırı/savunma galibiyeti, AI savunma, güvenceye alınan/kaybedilen ganimet; ilan/satış/fiyat/satış süresi.
- KPI hedefi önceden uydurulmaz, önce baseline çıkarılır.

---

## 14. Definition of Done

Yeni bir oyuncu:
- [ ] Ulus ve job seçip karakter yaratabiliyor
- [ ] CZ'de slot seçip AFK farm başlatabiliyor
- [ ] EXP, altın ve item kazanabiliyor
- [ ] Item inspect ve equip edebiliyor, güç değişimini görüyor
- [ ] Örs'te şansı ve maliyeti görüp +8'e kadar yükseltebiliyor, düşme ve Örs Isısı yaşıyor
- [ ] Taşınan ganimeti görüp devam edebiliyor ya da kasabaya dönüp güvenceye alabiliyor
- [ ] Karşı ulustan bir hedefe baskın yapabiliyor
- [ ] Kart çekip MP harcayarak savaşabiliyor, buff/debuff görebiliyor, kazanıp kaybedebiliyor
- [ ] Offline hedefe karşı AI savunmasıyla savaşabiliyor
- [ ] Item'ı merchant'a koyup satabiliyor, başkasının item'ını alabiliyor
- [ ] Quick Duel oynayabiliyor

**Asıl başarı ölçütü:** *"Farmdan çıkan item beni sevindirdi, yükseltmek istedim, daha iyi slota gitmek istedim, ganimetimi kaybetmekten çekindim ve karşı ulustan birini görünce savaşmak istedim."*

---

## 15. Prototip sonrası yol (kilitli sıra)
- **v0.2 Sosyal:** klan, pelerin, zengin pazar, leaderboard (prototipten buraya taşındı).
- **v0.3 Dünya:** ulus etkinlikleri, bosslar, PvPvE etkinlikleri.
- **v0.4+ Canlı oyun:** sezonlar, monetizasyon (kozmetik), mobil, Steam, premium para kararı.

## 16. Açık sorular (prototip sırasında cevaplanacak)
1. Hero vs Hero mu, minion'lı model mi? (Prototip Hero vs Hero ile başlar; Gate 1 sonrası yeniden değerlendirilir.)
2. Deste boyutu (12 / 16 / 20).
3. Kapasite aşımında verim eğrisi.
4. Baskında ganimet kayıp oranı.
5. Upgrade'de "düşme" hangi seviyeden başlar.
6. Premium paranın takası (v0.4'e ertelendi).
7. Baskın kalkanı süresi (başlangıç 30 dk).
8. Taşıma kapasitesi tavanı.
9. Saldıranın kaybettiğinde kaybettiği ganimet oranı.
10. Online savunanın canlı savaşa katılma süresi.
