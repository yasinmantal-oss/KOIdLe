# Faz 2 — Dört Job: Tasarım (spec eki)

> Tarih: 2026-10-06 · Durum: **ONAYLANDI (Yasin, 2026-10-06; Rogue'un Asas/Okçu ayrımı eklenerek)** · Üst belge: `2026-10-05-koidle-prototype-v0.2.md` (§2, §7, §13 Faz 2)
> Girdiler:
> - `reports/gate-1/2026-10-06-dogrulama-raporu.md` §6: 6 bulgu, zorunlu girdi
> - `docs/research/06-ko-skilleri.md`: KO skilleri
> - araştırma ajanı raporu: kombo, deste, açılış eli, his
> - motor fizibilite analizi
>
> **Kaynak kuralı değişmez.** Bu belgedeki tüm sayılar başlangıç değeridir ve `content/` JSON'larına girer. Gerçek değerler sim ve test sonrasında `docs/savas-degerleri.md`'de yaşar.

## 0. Faz 2'nin amacı

Gate 1 sorusu "savaş eğlenceli mi?" idi. Gate 2'nin sorusu şu:

> **Dört job birbirinden farklı hissettiriyor mu, kendi kombolarıyla coşturuyor mu ve dengeli mi?**

Yasin'in hedefi (2026-10-06):
- deste kurma olacak
- job içi kombolar olacak
- KO'cunun tanıdığı skill hissi olacak
- güçlü kombo ekranı coşturacak

Kartlar çocukça olmayacak.

## 1. Kararlar ve gerekçeler

| # | Karar | Gerekçe | Kimin |
|---|---|---|---|
| F2-1 | **KO skill isimleri kullanılabilir.** Uluslar, şehirler, item, boss, NPC ve para birimi yasağı aynen sürer. Kişi adı içeren skill isimleri kullanılmaz (ör. Minak's Thorn). | Skill hissi; KO'cu kartı adından tanır. Berserk, Malice, Spike gibi isimler genel kelimeler, riski düşük. Ticari çıkıştan önce avukat kontrolü (araştırma 01'deki not) geçerli. | Yasin |
| F2-2 | Kart adı KO'daki İngilizce skill adıdır, kart metni Türkçedir. | TR sunucu oyuncuları skillere zaten İngilizce adıyla hitap ediyor ("spike", "malice", "CH"). | Claude (Yasin yetki verdi) |
| F2-3 | Havuz: **6 ortak + Warrior 10 + Rogue 17 (3 Rogue ortak + Asas 7 + Okçu 7) + Mage 10 + Priest 10 = 49 kart.** Spec'in ~40–50 aralığında; spec değişmez. | Ortak kartlar her job'a uyar, job kimliği job kartlarında kalır. | Claude (Yasin yetki verdi) |
| F2-4 | **Deste kurma:** her job'ın (Rogue'da her yolun) havuzu 16 kart. Oyuncu 12 kartlık tek kopyalık deste kurar. | Spec §7 "oyuncu destesini kurar". Snap dersi: kısa maçta 12 tekil kart yeterince derin. | Yasin ("deste kurmadan oyun mu olur") |
| F2-5 | **Ağır** etiketi: job'ın "80 skill"leri. Her job havuzunda 3 tane var, destede **en fazla 2** olabilir. | "Güçlü kartlar kolay geliyor" bulgusu. Havuzda yalnız 2 Ağır olsaydı herkes ikisini de alırdı ve seçim olmazdı. | Claude |
| F2-6 | Destede **en az 3 adet 1 MP'lik kart** olmalı. Başka deste kısıtı yok. | Açılış kuralının dayanağı. Maliyet bütçesi ve eğri kuralları ek sayaç demek, sadeliğe ters. | Claude |
| F2-7 | **Açılış eli kuralı:** başlangıç eline Ağır kart gelmez ve elde en az bir 1 MP'lik kart olur. | Doğrulamada eğlence 1 verilen iki maçın ikisi de kötü açılıştı. Yıkım ile açılma %33 → 0, 1 MP'siz açılış %14 → 0. Snap aynı sorunu benzer bir garantiyle çözdü. Yeni kavram öğretmek gerekmez. | Claude |
| F2-8 | **Kart başına tek anahtar kelime.** İki efekt olabilir, ama oyuncunun takip etmesi gereken kavram bir tane. İki istisna var: Ağır kartlarda en fazla iki anahtar kelime olabilir; risk kartlarında bedel olarak kendine verilen statü (Berserker'ın Laneti) ayrı sayılmaz. | "Kalkan Darbesi iki iş yapıyor, saçma" bulgusu. LoR dersi: anahtar kelimeler üst üste binince kimlik erir. | Claude |
| F2-9 | **Stun, uyutma, MP kesme, taunt ve ışınlanma yok.** | Rakibin turunu boşa çıkaran etkiler "oyun oynanmıyor" hissi verir; Hearthstone Freeze destelerini bu yüzden bilinçli zayıf tuttu. Taunt ve TP tek rakipli savaşta anlamsız. | Claude |
| F2-10 | **"Hasar verince iyileş" efekti** yalnız Warrior'ın Ağır Sword Dancing kartında var. Hiçbir kartta "iyileşince hasar ver" yok. | İyileşme-hasar döngüsü riski kapanır. | Claude |
| F2-11 | **AI tur planı:** AI turunu en fazla 4 hamle ileri bakarak planlar (klon + apply araması). | Açgözlü 1-ply AI kombo kuramaz. Kurmazsa Rogue ve Mage sim'de haksız zayıf görünür ve denge verisi çöp olur. | Claude |
| F2-12 | **CSS coşkusu** (bkz. §6): K4'e dar istisna. Pixi ve tam görsel paket yine Faz 9'da. | "Güçlü komboyla ekran titresin" (Yasin). Kombo görünmezse hissedilmez. | Yasin isteği, Claude kapsamı |
| F2-13 | **İki dilim:** Faz 2a = altyapı + ortak + Warrior + Rogue + AI planı + deste kurma + coşku → Yasin oynar. Faz 2b = Mage + Priest → Gate 2. | Tek seferde 40 kart, yeni AI ve yeni ekran "takıldık" hissini büyütür. Kombo dili önce iki job'la doğrulanır. | Claude |
| F2-14 | İlk oyuncu dengesi Faz 2b sim'inde yeniden ölçülür. | Yasin kararı (2026-10-06): Faz 2'ye ertelendi. | Yasin |
| F2-15 | **Rogue iki yola ayrılır: Asas ya da Okçu.** Bir destede ikisi birden olmaz. Rogue ortak kartları (Explore) iki yolda da kullanılır. Diğer job'lar dallara ayrılmaz. | "Rogue'da hem okçu hem asas aynı anda oynanmasın" (Yasin). KO'da da build ayrı. | Yasin |

## 2. Statüler (6)

Mevcut iki statü kalır, dört yenisi eklenir. Hepsi mevcut K7 yığılma kuralını kullanır: gelen değer ≥ mevcut ise güncellenir ve süre yenilenir, küçükse yok sayılır. Süre, etkilenen kahramanın kendi tur sonunda 1 düşer.

| Statü | Kime | Etki | Süre | Job |
|---|---|---|---|---|
| **Güç** (mevcut) | kendine | Kart hasarına +değer | 2 | Warrior, ortak |
| **Zayıflık** (mevcut) | rakibe | Kart hasarına −değer | 2 | Hepsi (Rogue'da "kör etme") |
| **Lanet** (yeni) | rakibe ya da Berserker ile kendine | **Aldığı** kart hasarına +değer | 2 | Priest; Warrior (Berserker riski) |
| **Zehir** (yeni) | rakibe | Sahibinin tur başında değer kadar hasar. Kalkan o anda zaten sıfırlandığı için Kalkan'a takılmaz. | 2 | Rogue (Okçu) |
| **Donma** (yeni) | rakibe | Tek başına etkisi yok. Ateş kartları tüketir. | 2 | Mage |
| **Gizli** (yeni) | kendine | Sonraki hasar veren kartının ilk vuruşu +değer hasar verir ve Kalkanı yok sayar. Sonra Gizli düşer. | 2 | Rogue (Asas) |

**Kart hasarı formülü (güncellenir):**
`max(0, kart değeri + Güç(kaynak) − Zayıflık(kaynak) + Lanet(hedef))` · Gizli, şartı sağlanırsa ilk vuruşa eklenir.

**Tur başı sırası (N3 genişler):**
1. tur başlar
2. Kalkan sıfırlanır
3. maks MP ve MP
4. **Zehir hasarı**
5. Arena hasarı
6. kart çekme

Her sistem hasarından sonra savaşın bitip bitmediğine bakılır (C1).

**Donma süresi neden 2:** Mage dondurduğu turda ateşle patlatabilir. Ya da rakibin turu geçtikten sonra, bir sonraki kendi turunda patlatabilir. İki kullanım da kurulum hissi verir.

## 3. Yeni kart kavramları

| Kavram | Tanım |
|---|---|
| **Zincir N:** | Bu tur, bu karttan **önce** en az N kart oynadıysan bonus. Sayaç kart çözüldükten sonra artar; kartın kendisi sayılmaz. Ekranda "bu tur oynanan kart: N" sayacı görünür. |
| **Ateş:** | Rakip Donmuşsa bonus uygulanır ve Donma kalkar. Bir Donma, tek bir Ateş bonusunu besler. |
| **Taşan iyileşme Kalkan olur** | Yalnız Priest'in iyileşme kartlarında. Maks HP'yi aşan iyileşme, Kalkan olarak eklenir. Tam HP'de ölü kart kalmaz. |
| **Maks HP azaltma** (Parasite) | Rakibin maks HP'sini kalıcı olarak düşürür; HP yeni maksı aşıyorsa maksa indirilir. Kalkanı yok sayar. |
| **Debuff sayımı** (Judgement) | Rakipteki olumsuz statü sayısı: Zayıflık, Lanet, Zehir, Donma. |
| **Çoklu vuruş** | "3 kez 2 hasar": her vuruş ayrı hesaplanır. Güç her vuruşa eklenir, Gizli yalnız ilkine. |

## 4. Kart havuzu (başlangıç değerleri)

Ölçü: 1 MP ≈ 3 hasar ya da 4 Kalkan. 8 turda toplam 33 MP. Tablolardaki ★ işareti Ağır kartı gösterir.

### 4.1 Ortak (6): her job'ın havuzunda

| Kart | MP | Tür | Etki | Kaynak |
|---|---|---|---|---|
| Hızlı Vuruş | 1 | Attack | 3 hasar ver. | Genel |
| Sprint | 1 | Skill | 1 kart çek. | KO Basic (tüm sınıflar) |
| Absoluteness | 1 | Defense | 4 Kalkan kazan. | KO Master (tüm sınıflar) |
| Gözdağı | 1 | Debuff | Rakibe Zayıflık 2 ver. | Mevcut kart |
| Valor | 2 | Heal | 4 HP iyileş. HP'n 15 veya altındaysa 8. | KO Master: düşük HP'de savunma |
| Güçlü Vuruş | 3 | Attack | 7 hasar ver. | Genel |

Ortak havuzda tek Kalkan kartı var (F2: "kalkan kalkan deck" bulgusu).

### 4.2 Warrior: kur ve patlat, risk buff'ı

| Kart | MP | Tür | Etki | KO karşılığı |
|---|---|---|---|---|
| Slash | 1 | Attack | 3 hasar ver. Güç'ün varsa +2. | Basic, Slash |
| Gain | 1 | Buff | Kendine Güç 2 ver. | Passion, Gain (+STR) |
| Leg Cutting | 2 | Debuff | 2 hasar ver. Rakibe Zayıflık 2 ver. | Attack, Leg Cutting (yavaşlatma) |
| Berserker | 2 | Buff | Kendine Güç 3 ve **Lanet 2** ver. | Passion, Berserker: hız ↑, defans −300 |
| Iron Skin | 2 | Defense | 6 Kalkan kazan. | Defense, Iron Skin |
| Cleave | 3 | Attack | 7 hasar ver. Güç'ün varsa +3. | Attack, Cleave |
| Howling Sword | 4 | Attack | Kalkanı yok sayarak 6 hasar ver. Rakip Zayıfsa +3. | Attack, Howling Sword |
| ★ Wall of Iron | 3 | Defense | 12 Kalkan kazan. | Defense, Wall of Iron: defans ×3 |
| ★ Sword Dancing | 4 | Attack | 6 hasar ver. 5 HP iyileş. | Attack, Sword Dancing (HP emme) |
| ★ Hell Blade | 5 | Attack | 9 hasar ver. Güç'ün varsa +4. | Attack 80, Hell Blade |

**Kombolar:**
- Gain → Slash (3 + 2 + Güç 2 = 7) → Cleave (7 + 3 + 2 = 12)
- Berserker → Hell Blade: 9 + 4 + Güç 3 = 16. Bedeli: rakibin bir sonraki turunda her kart hasarından +2 alırsın.
- Leg Cutting → Howling Sword (9, Kalkanı yok sayar)

Not: Yıkım havuzdan çıktı. Doğrulamada "çok güçlü" denmişti; bitirici rolünü artık kurulum isteyen Hell Blade üstleniyor.

### 4.3 Rogue: iki yol, asas ya da okçu (F2-15)

Destede **ya Asas ya Okçu** kartları olur, ikisi birden olmaz. Rogue ortak kartları (Explore dalı) iki yolda da kullanılır.

**Rogue ortak (3):**

| Kart | MP | Tür | Etki | KO karşılığı |
|---|---|---|---|---|
| Minor Healing | 1 | Heal | 3 HP iyileş. | Explore, Minor Healing ("minor") |
| Light Feet | 1 | Skill | 1 kart çek. | Explore, Light Feet ("LF") |
| ★ Scaled Skin | 3 | Defense | 10 Kalkan kazan. | Explore 60, Scaled Skin |

**Asas (7): zincir, gizlen ve vur**

| Kart | MP | Tür | Etki | KO karşılığı |
|---|---|---|---|---|
| Stab | 1 | Attack | 2 hasar ver. Zincir 1: +2. | Basic, Stab |
| Stealth | 1 | Skill | Kendine Gizli 3 ver. | Assassin, Stealth |
| Thrust | 2 | Attack | 4 hasar ver. Zincir 1: +3. | Assassin, Thrust |
| Blinding | 2 | Debuff | 3 hasar ver. Rakibe Zayıflık 2 ver. | Assassin 72, Blinding ("kör etme") |
| Spike | 3 | Attack | 6 hasar ver. Zincir 2: +4. | Assassin, Spike |
| ★ Critical Point | 2 | Skill | Kendine Gizli 7 ver. | Assassin 80, Critical Point ("critic") |
| ★ Beast Hiding | 4 | Attack | 6 hasar ver. Sonra kendine Gizli 3 ver. | Assassin 75, Beast Hiding (vur ve kaybol) |

**Asas kombolar:**
- Stab → Thrust → Spike: 2 + 7 + 10 = 19, 6 MP. Destede her karttan 1 tane olduğu için üç parçanın aynı turda elde olması gerekiyor. Sim'de en güçlü kombo adayı olarak izlenecek.
- Critical Point → Spike: 13 hasar, Kalkanı yok sayar. Asas'ın "critic + spike" anı.
- Beast Hiding bu tur, Spike sonraki tur: vur, kaybol, tekrar vur.

**Okçu (7): zehir, çoklu ok, bitirici**

| Kart | MP | Tür | Etki | KO karşılığı |
|---|---|---|---|---|
| Poison Arrow | 1 | Debuff | 1 hasar ver. Rakibe Zehir 2 ver. | Archery, Poison Arrow |
| Perfect Arrow | 1 | Attack | Kalkanı yok sayarak 2 hasar ver. | Archery, Perfect Arrow (ıskalamaz) |
| Multiple Shot | 2 | Attack | 3 kez 2 hasar ver. | Archery, Multiple Shot (3 ok) |
| Viper | 2 | Debuff | Rakibe Zehir 4 ver. | Archery, Viper |
| Blinding Strafe | 2 | Debuff | 3 hasar ver. Rakibe Zayıflık 2 ver. | Archery 75, Blinding Strafe ("kör etme") |
| ★ Arrow Shower | 4 | Attack | 5 kez 2 hasar ver. | Archery, Arrow Shower (5 ok) |
| ★ Power Shot | 4 | Attack | Kalkanı yok sayarak 7 hasar ver. Rakibin HP'si 12 veya altındaysa +5. | Archery 80, Power Shot (kaçanı bitirir) |

**Okçu kombolar:**
- Viper → iki tur boyunca 4'er hasar, sonra Power Shot ile bitirme.
- Gözdağı ya da Blinding Strafe ile rakibi zayıflat, Arrow Shower ile kalkanı tek tek söküp vur.
- Çoklu oklar Güç'ten her vuruşta faydalanır. Rogue Güç vermez; Güç ancak ortak kartlarla gelirse işe yarar.

### 4.4 Mage: dondur ve yak (Faz 2b)

| Kart | MP | Tür | Etki | KO karşılığı |
|---|---|---|---|---|
| Freeze | 1 | Debuff | 2 hasar ver. Rakibe Donma ver. | Glacier, Freeze |
| Burn | 1 | Attack | 2 hasar ver. Ateş: +3. | Flame, Burn |
| Chill | 1 | Skill | Rakibe Donma ver. 1 kart çek. | Glacier, Chill |
| Fire Ball | 2 | Attack | 4 hasar ver. Ateş: +4. | Flame, Fire Ball |
| Frozen Armor | 2 | Defense | 6 Kalkan kazan. | Glacier, Frozen Armor |
| Lightning | 2 | Attack | Kalkanı yok sayarak 4 hasar ver. | Lightning, Lightning |
| Ice Comet | 3 | Attack | 5 hasar ver. Rakibe Donma ver. | Glacier, Ice Comet |
| ★ Freezing Distance | 3 | Debuff | Rakibe Donma ve Zayıflık 3 ver. | Glacier 80 ("küp") |
| ★ Incineration | 4 | Attack | 7 hasar ver. Ateş: +4. | Flame 70, Incineration |
| ★ Meteor Fall | 6 | Attack | 9 hasar ver. Ateş: +5. | Flame 70, Meteor Fall |

**Kombolar:**
- Freeze → Fire Ball: 2 + 8
- Ice Comet bu tur, Meteor Fall sonraki tur: 5 + 14
- Küp ile hem dondurup hem saldırıyı zayıflatmak

### 4.5 Priest: lanetle, sonra patlat; iyileşmen kalkana döner (Faz 2b)

| Kart | MP | Tür | Etki | KO karşılığı |
|---|---|---|---|---|
| Healing | 1 | Heal | 4 HP iyileş (taşan Kalkan olur). | Healing |
| Malice | 1 | Debuff | Rakibe Lanet 2 ver. | Holy, Malice |
| Massive | 2 | Debuff | Rakibe Zayıflık 3 ver. | Holy, Massive (saldırı −%20) |
| Parasite | 2 | Debuff | Rakibin maks HP'si 4 azalır. | Holy, Parasite ("db") |
| Helis | 3 | Attack | Kalkanı yok sayarak 5 hasar ver. | Master, Helis |
| Judgement | 3 | Attack | 3 hasar ver. Rakipteki her olumsuz statü için +3. | Master, Judgement |
| Great Healing | 3 | Heal | 9 HP iyileş (taşan Kalkan olur). | Healing, Great Healing |
| ★ Torment | 3 | Debuff | Rakibe Lanet 3 ve Zayıflık 2 ver. | Holy, Torment |
| ★ Superior Parasite | 4 | Debuff | Rakibin maks HP'si 7 azalır. | Holy 75, Superior Parasite |
| ★ Complete Heal | 4 | Heal | 15 HP iyileş (taşan Kalkan olur). | Healing, Complete Healing ("CH") |

**Kombolar:**
- db → Malice → Judgement: rakip kalıcı olarak 4 maks HP kaybeder; Judgement 3 + 3 + Lanet 2 = 8. Forumdaki "önce db, sonra malice" sırası. Maks HP azaltma statü değildir, debuff sayımına girmez.
- Malice → Massive → Judgement: 3 + 6 + Lanet 2 = 11.
- Torment → Judgement: 3 + 6 + 3 Lanet = 12.
- Tam HP'de CH: 15 Kalkan, "son çare" bir duvar.

### 4.6 Hazır desteler

Her job için (Rogue'da her yol için) `content/decks/<job>.json` içinde 12'lik bir önerilen deste olur. Bu desteler hem AI'ın destesi hem oyuncunun "başlangıç destesi" olarak kullanılır, F2-5 ve F2-6'ya uyar.

## 5. AI tur planı (F2-11)

- AI, kendi turunda oynanabilir kart dizilerini klon + apply ile arar.
  - Derinlik en fazla 4 kart.
  - Işın genişliği (beam) 5.
  - Yaprakta mevcut `evaluate` çalışır.
- Planın ilk aksiyonu oynanır, sonraki aksiyonda yeniden planlanır. Determinist; eşitlikte `legalActions` sırası kazanır.
- Gizli bilgi kuralı aynen geçerli: arama `redactForAi` görünümünde yapılır.
- `evaluate.statusScore` genişler:
  - Lanet, Zehir ve Donma rakipteyse iyi, kendindeyse kötü sayılır.
  - Gizli ve Güç kendindeyse iyi sayılır.
- Kabul ölçütü: 900 maçlık sim makul sürede bitmeli (hedef < 2 dk). Aşarsa önce klon hızlandırılır.
- Bu değişiklikten sonra Faz 1 sim sonuçları karşılaştırma için geçersiz sayılır; yeni temel ölçüm alınır.

## 6. Coşku: yalnız CSS (F2-12)

| Efekt | Değer |
|---|---|
| Hitstop | 6 ve üstü hasarda 70 ms donma, sonra HP düşer |
| Ekran sarsıntısı | 10 ve üstü hasarda 5 px / 180 ms sönümlü; 14 ve üstünde 8 px |
| Sayı pop'u | 1 → 1,35 → 1 ölçek (200 ms), 24 px yukarı kayıp 500 ms'de solar |
| Kombo çağrısı | "ZİNCİR ×2!", "BUHARLAŞMA!" (Ateş + Donma), "CRITIC!" (Gizli). Toplam < 800 ms, girdiyi bloklamaz. |
| Koşul parlaması | Şartı o an sağlanan kartın kenarı parlar (mevcut önizleme sistemi) |
| Erişilebilirlik | `prefers-reduced-motion` açıkken sarsıntı, kayma ve ölçek kapanır, yerine 120 ms renk flaşı gelir. Saniyede 3'ten fazla flaş olmaz. Kombo metni `aria-live` log'a da yazılır. |

Tur başına toplam efekt süresi ~1 saniyeyi geçmez.

## 7. Deste kurma ekranı

- Akış: job seç (Rogue için yol da seçilir: Asas ya da Okçu) → 16 kartlık havuz → 12 kart seç → maç.
- Rakip AI'ın job'u seçilir ya da rastgele gelir.
- Canlı doğrulama mesajları:
  - "12/12"
  - "Ağır 2/2"
  - "1 MP'lik kart: 3+ ✓"
- Kurulan deste tarayıcıda hatırlanır (`localStorage`, try/catch ile).
- "Önerilen deste" butonu.
- Gate formu kaydına `job`, `aiJob` ve `deck` alanları eklenir. `configHash` içeriği kapsamaya devam eder.

## 8. Sim ve ölçüm

- Job × job matrisi (balanced profil, hazır desteler), artı profil matrisi.
- Yeni metrikler:
  - "ilk 2 turda oynanabilir kart yok" oranı (hedef ~0)
  - kart başına oynanma oranı (destede olduğu maçlarda)
  - Zincir, Ateş ve Gizli tetiklenme oranları
- Mevcut metrikler devam eder: ilk oyuncu, Arena, Yorgunluk.

## Revizyon 1 (Yasin, 2026-10-07)

> **Bu bölüm §2 (Statüler), §3 (Yeni kart kavramları), §4.2–4.3 (Warrior ve Rogue kartları) ve §4.6 (hazır desteler) ile çelişen her yerde geçerlidir.** Yasin ilk kart tasarımını reddetti. **Kural: kart mekaniği KO'daki skill etkisine karşılık gelir** (`docs/research/06-ko-skilleri.md`). Kart adları İngilizce, kart metni Türkçe ve kendi kendini açıklar; metindeki her anahtar kelime kartın altında tek satırlık sözlükle açıklanır.

**Kaldırıldı:** Lanet, Gizli, Zincir (`cardsPlayedAtLeast`, `CHAIN_TRIGGERED`), süreli Güç. `cardsPlayedThisTurn` yalnız UI sayacı olarak kaldı.

**Statüler (5):**
- **Güç X** (kendine): sonraki hasar veren kartın **ilk vuruşuna** X ekler, sonra tamamı harcanır. Toplanır, en fazla 5; süresi yok. Hell Blade (`strengthMultiplier: 2`) Güç'ü iki kat sayar; kullanılırsa "KOMBO!".
- **Kritik** (kendine, yalnız Critical Point): sonraki hasar veren kartın **her vuruşu** iki kat (Güç/Zayıflık sonrası, Kalkandan önce), sonra harcanır.
- **Kaçınma** (kendine): rakibin sonraki hasar veren kartının ilk vuruşu 0 hasar verir, sonra harcanır; kullanılmazsa sahibinin sonraki turunun başında düşer. Zehir/Arena/Yorgunluğu durdurmaz.
- **Zayıflık X** (rakibe): değişmedi (kart hasarı −X, 2 tur, K7).
- **Zehir X** (rakibe): sahibinin tur başında X hasar (Kalkanı yok sayar), sonra 2 azalır; toplanır, en fazla 6.

**Yeni efektler:** `gainMp` (bu tur MP, maks MP'yi aşabilir), `selfDamage` (Kalkanı yok sayar), `strengthMultiplier`. Değerler `content/battle-config.json` (`statuses.strength.max`, `poison.max/decay`, `weak.duration`); AI statü değerleri `content/ai-profiles.json` (`criticalValue`, `evadeValue`).

**Kart listesi (33):** güncel liste ve değerler `docs/savas-degerleri.md` §2 (üretilir; kaynak `content/cards/*.json`). Ortak 6, Warrior 10, Rogue ortak 3, Asas 7, Okçu 7; Ağır: Wall of Iron, Sword Dancing, Hell Blade, Scaled Skin, Critical Point, Beast Hiding, Arrow Shower, Power Shot. Hazır desteler `content/decks/*.json`. Bu liste §4.2–4.3 ve §4.6'nın yerini alır.

## 9. Gate 2 (Faz 2b sonunda)

**Sim:**
- hiçbir job eşleşmesi %40–60 dışında değil
- her kart içinde olduğu destelerde oynanıyor (kabaca > %30)
- açılışta oynanacak kart yokluğu ~0

**Yasin testi:**
- her job ile en az 2 maç (Rogue’un Asas ve Okçu yolları ayrı sayılır)
- eğlence medyanı ≥ 4
- maçların en az yarısında "sonucu değiştiren kombomu hatırlıyorum"
- her job için "farklı hissettirdi mi?" (yeni form sorusu)

**Ara kontrol, Faz 2a sonu:** Warrior ve Rogue ile 4–6 maç oynanır. Hedef: kombo hissi var mı, deste kurma anlamlı mı. Bu bir Gate değil, yön kontrolü.

## 10. Kapsam dışı

- Farklı job'ların kartlarını tek destede karıştırmak (çok-job'lu deste fikri Faz 3 sonrasına not)
- Kahraman gücü / imza skill (K6): Gate 2 sonrasında, gerekirse
- Stun, uyutma, MP kesme, taunt, debuff temizleme kartları
- Kart açma ve kart kilidi (spec: kartlar baştan açık)
- Pixi, animasyonlu kart çizimleri, ses
- Item → kart etkisi (Faz 3)

## 11. Teknik etki (özet; ayrıntı uygulama planında)

- `rules`: `Job` genişler. Yeni statüler, koşullar (`cardsPlayedAtLeast`) ve efektler (`consumeStatus`, `reduceMaxHp`, iyileşme taşması) eklenir. Debuff sayımı bonusu, açılış eli kuralı, `cardsPlayedThisTurn` ve tur başı Zehir adımı gelir. `resolveEffect` için exhaustive kontrol yapılır.
- `content-schema`: şemalar, `tags: ['heavy']`, kartta `branch` alanı (Rogue: `assassin` / `archer`; Rogue ortak kartlarda yok), `validateDeck` (tek yol kuralı dahil), `loadCards(job, branch?)` (job + yol + ortak), hazır desteler.
- `ai`: tur planı, `statusScore` genişlemesi.
- `sim`: job matrisi ve yeni metrikler.
- `client`: job seçimi, deste kurma, coşku, Gate formu alanları.
- Golden replay'ler yalnız bilinçli motor değişikliklerinde yenilenir (`UPDATE_REPLAYS=1`). `docs/savas-degerleri.md` her içerik değişikliğinde `pnpm values` ile üretilir.

### Denge turu 1 (2026-10-07)

Yalnız sayı değişti (mekanik, ad ve AI aynı). Başlangıç: Okçu, Warrior'a %70, Asas'a %68 kazanıyordu. Sonuç: tüm eşleşmeler %40–60 içinde.

- Multiple Shot: ÖNCE 2 MP → SONRA 3 MP
- Arrow Shower: ÖNCE 4 kez 2 hasar → SONRA 3 kez 2 hasar
- Power Shot: ÖNCE 6 hasar, HP ≤12 ise +4 → SONRA 5 hasar, HP ≤12 ise +3
- Viper: ÖNCE 4 Zehir → SONRA 3 Zehir
- Howling Sword: ÖNCE 6 hasar → SONRA 7 hasar

## Revizyon 2 (Yasin, 2026-10-07) — yön kontrolü sonrası

> **Bu bölüm Revizyon 1 ve Denge turu 1 ile çelişen her yerde geçerlidir.** Yasin 10 maç oynadı (`reports/faz-2a/2026-10-07-yon-kontrolu.md`) ve düzeltme paketini onayladı.

**Neden (10 maç bulguları):** hız kartları (Sprint, Light Feet) işe yaramadı; Okçu 0/3 kazandı; Warrior kolay (4/5); maçların yarısı (5/10) Arena Çöküşü ile bitti, yani kartlar yeterince hasar vermedi; ilk oyuncu %32 kazandı.

**Kaldırıldı / eklendi:**
- Sprint (ortak) ve Light Feet (Rogue ortak) kaldırıldı; `gainMp` efekti ve `MP_GAINED` olayı motordan, şemadan, client'tan silindi. Ortak havuz 5 kart, her job havuzu 15 kart (deste 12). Toplam 32 kart.
- **Evade** (Rogue ortak, `evade`, Skill, 1 MP): "Kaçınma kazan." Okçu ve Asas hazır destelerinde Light Feet'in yerine girdi.

**Config:**
- `mp.secondPlayerFirstTurnBonus`: ÖNCE yok → SONRA 4. İkinci oyuncunun kendi 1. turunda maks MP'ye eklenir (yalnız o tur). **2026-10-07 gece (Faz 2b Görev 1): 0'a çekildi**, alan config için duruyor.
- `hand.firstPlayerSkipsFirstDraw`: ÖNCE true → SONRA false. Sim'de K3 açıkken MP bonusu ilk oyuncu oranını oynatmadı (%33–38); kapatınca %57–59. Ayrıntı: devam notu, K3. **Faz 2b'de kapalı kaldı.**
- `hand.secondPlayerFirstTurnExtraDraw`: **YENİ (2026-10-07, Faz 2b Görev 1)** → 1. İkinci oyuncu kendi 1. turunda `hand.drawPerTurn` üstüne bu kadar kart çeker (yalnız o tur); el sınırı, karıştırma ve Yorgunluk `drawCard` üzerinden aynen geçerli. Sim: ilk oyuncu %61,3 → %43,3 (4500 maçta %42,8), ort. raunt 7,34. Hedef %45–55 hedefi bu iş kapsamında tutmadı; dört kombinasyon içinde en yakın ve en sade olan seçildi, kart değerlerine dokunulmadı. Ayrıntı: devam notu "DEĞİŞTİRİLEN KARARLAR" + `reports/sim/latest.md`.

**Kart sayıları (ÖNCE → SONRA):**
- Multiple Shot: 3 MP → 2 MP (Okçu kısmi geri alma)
- Viper: 3 Zehir → 4 Zehir
- Arrow Shower: 3 kez 2 hasar → 4 kez 2 hasar
- Power Shot: 5 hasar → 6 hasar (HP ≤12 bonusu +3 aynı)
- Quick Strike: 3 → 4 hasar
- Power Strike: 7 → 8 hasar
- Slash: 3 → 4 hasar
- Gain: 2 → 3 Güç
- Leg Cutting: 2 → 3 hasar (Zayıflık 2 aynı)
- Berserker: Kendine 2 hasar → Kendine 1 hasar (3 Güç aynı; sim'de oynanma oranı %58, önce %30 civarıydı)
- Cleave: 6 → 8 hasar
- Howling Sword: 7 → 8 hasar
- Sword Dancing: 5 → 6 hasar (4 iyileşme aynı)
- Hell Blade: 9 → 10 hasar
- Thrust: 5 → 6 hasar
- Blinding: 2 → 3 hasar (Zayıflık 3 aynı)
- Spike: 8 → 7 hasar (Asas'ın Warrior ve Okçu karşısında aşırı güçlenmesini dengeler)
- Değişmeyenler: Perfect Arrow 2, Poison Arrow 1+2 Zehir, Blinding Strafe, Beast Hiding, Stab, kalkan ve iyileşme kartları.

**Sim sonucu (900 maç, balanced, hazır desteler):** ortalama 7,09 raunt (önce 8,49), Arena ile biten %15,6 (önce %40,8), ilk oyuncu %58,6, job hücreleri %42,0–58,0 (hepsi %40–60 içinde), en düşük oynanma oranı Berserker %58. Bkz. `reports/sim/latest.md`. **Ulaşılamayan hedef:** ilk oyuncu %45–55; K3 kapalı ve bonus 4 ile 300 seed'de %57,0. MP bonusu 5'te de aynı. Kalan fark kart sayısı ve zamanlama farkından geliyor; Gate 2 öncesi yeniden bakılır.
