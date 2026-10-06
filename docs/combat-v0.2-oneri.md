# Combat v0.2 — Tasarım Önerisi (Claude)

> Tarih: 2026-10-06 · **Durum: ÖNERİ.** Yasin onaylamadan uygulanmaz. Kod, JSON ve sim değişmedi.
> Girdi: `reports/gate-1/2026-10-06-gate-1-final-raporu.md` + Copilot'un son notu (Gate önerisi FAIL / ITERATE).
> Hedef: "Her tur yalnızca daha zor seçimler yaptırmak değil, oyuncuya birkaç hamlelik küçük planlar kurdurmak."

**Bu turda dokunulmayanlar:**
- Kurallar: HP 30, deste 12, Hero vs Hero, Warrior mirror, Arena 8. raunt, Kalkan sıfırlanması, 1 karıştırma, Yorgunluk.
- AI: ağırlıklar ve profiller.
- Kartlar: savunma kartı sayısı.
- Eklenmeyenler: yeni kart, Hero Power, minion.

## Ön bilgi: motor bugün ne yapabiliyor?

Kart efektleri: `damage` (isteğe bağlı `ignoreShield`), `shield`, `applyStatus`, `draw`, `heal`, `damageFromShieldGainedThisTurn`.

**Koşullu efekt yok.** Kombo isteyen her tasarım kod ister. En ucuz yol tek bir genel yapı eklemek: efekte isteğe bağlı bir **"koşul sağlanırsa bonus"** alanı.

```
{ "kind": "damage", "amount": 7, "bonus": { "if": "selfHas:strength", "amount": 3 } }
```

Koşul listesi küçük ve kapalı:
- `selfHas:strength`: sende Güç var
- `enemyHas:weak`: rakip Zayıf
- `enemyHpAtMost:N`: rakibin HP'si N veya altında

Kart metinleri yine JSON'da kalır, yalnız yeni alanı okuyan kod eklenir.

**Mevcut AI hakkında:** AI açgözlü ve tek hamle ileriyi düşünüyor (`packages/ai/src/choose.ts`). Koşul o anda sağlanmışsa bonusu görür ve kullanır. Ama koşulu **önceden kurmayı** (ör. Narası'yı bir tur önce oynamayı) ve **kart saklamayı** planlamaz. Bu yüzden aşağıdaki "AI test edebilir mi?" cevapları çoğunlukla "kısmen". Planlama değerini yalnız insan testi ölçer.

---

## A. Savaş Narası → Ağır Darbe

Bugün: Narası "Kendine Güç 2 ver" (2 tur). Güç her saldırıya +2 ekliyor, ama bu genel bir bonus, plan hissi vermiyor.

### A1 · Ağır Darbe: "7 hasar ver. Güç'ün varsa +3 hasar."
- **MP:** 3 (değişmez)
- **Etki:** Narası ile 7 + 2 (Güç) + 3 = **12**. Narası yoksa 7, bugünkü gibi.
- **Beklenen karar:** Narası'yı bir tur önce mi oynayayım (o tur tempo kaybı), aynı turda mı (5 MP)? Ağır Darbe'yi Güç gelene kadar elde tutayım mı?
- **Çözdüğü:** P0 kombo; P1 kart saklama.
- **Abuse riski:** Orta. Narası + Ağır Darbe + Yarma aynı turda (6 MP) = 12 + 5 = 17. Güç 2 tur sürdüğü için sonraki turda da +2 var.
- **Öğrenme yükü:** Düşük. Güç zaten bilinen kavram.
- **AI test edebilir mi?** Kısmen. Güç varken bonusu kullanır, ama Narası'yı bunun için önceden kurmaz.

### A2 · Ağır Darbe: "7 hasar ver. Güç'ün varsa Kalkanı yok sayar."
- **MP:** 3
- **Etki:** Hasar artmaz, kalkanı deler.
- **Beklenen karar:** Rakip kalkan dizdiyse önce Narası'yı kur.
- **Çözdüğü:** P0 kısmen; "çok kalkan" hissine bir cevap.
- **Abuse riski:** Düşük.
- **Öğrenme yükü:** Orta. İki kavram birleşiyor.
- **AI test edebilir mi?** Kısmen.
- **Sorun:** Yarıp Geç'in "kalkan delen kart" kimliğini sulandırır.

### A3 · Ağır Darbe: "7 hasar ver. Güç'ün varsa onu tüket ve +6 hasar ver."
- **MP:** 3
- **Etki:** Narası ile 7 + 2 + 6 = **15**, sonra Güç biter.
- **Beklenen karar:** Güç'ü burada mı harcayayım, yoksa Yıkım'a mı saklayayım? İki kart aynı kaynağa talip, yani gerçek bir plan.
- **Çözdüğü:** P0, en güçlü hâli.
- **Abuse riski:** Orta. Tüketme kendini sınırlıyor.
- **Öğrenme yükü:** Orta. "Tüketme" yeni bir kavram.
- **AI test edebilir mi?** Zayıf. AI her seferinde hemen tüketir, saklamanın değerini göremez.
- **Not:** "Statüyü tüket" ayrı bir kod ister.

## B. Gözdağı → Yarıp Geç

Bugün: Gözdağı "Rakibe Zayıflık 2 ver", yani rakibin hasarını azaltan savunma amaçlı bir statü. Yarıp Geç 4 MP'ye 6 hasar, kalkanı yok sayıyor. İkisi arasında bugün hiçbir bağ yok.

### B1 · Yarıp Geç: "Kalkanı yok sayarak 6 hasar ver. Rakip Zayıfsa +3 hasar."
- **MP:** 4
- **Etki:** Gözdağı + Yarıp Geç = 5 MP → kalkansız **9** hasar. Rakip ayrıca −2 hasarla vuruyor.
- **Beklenen karar:** Gözdağı'nı rakip vurmadan hemen savunma için mi oynayayım, yoksa Yarıp Geç'in yanına mı saklayayım?
- **Çözdüğü:** P0; "çok kalkan" hissine ödüllü bir cevap.
- **Abuse riski:** Düşük–orta. Zayıflık rakibin bir sonraki turunu da kapsıyor, ama bonus tek kartta.
- **Öğrenme yükü:** Düşük.
- **AI test edebilir mi?** Kısmen.

### B2 · Yarıp Geç: "Kalkanı yok sayarak 6 hasar ver. Rakip Zayıfsa maliyeti 2 azalır."
- **MP:** 4 → koşul sağlanınca 2
- **Etki:** Gözdağı + Yarıp Geç = 3 MP. Kalan MP'yle aynı turda başka kart oynanabilir.
- **Beklenen karar:** Ucuzlayan turda neyi sığdırayım? Tempo kombosu.
- **Çözdüğü:** P0; MP baskısı altında esneklik.
- **Abuse riski:** Orta. Tavan 6 MP iken Gözdağı + Yarıp Geç + Ağır Darbe tek turda sığıyor.
- **Öğrenme yükü:** Orta. Maliyeti değişen kart, ekranda da güncellenmeli.
- **AI test edebilir mi?** Kısmen. Dinamik maliyeti yasal hamlelerde görür.
- **Not:** "Dinamik maliyet" ayrı bir kod ister (kural motoru + ekran).

### B3 · Yarıp Geç: "Kalkanı yok sayarak 6 hasar ver. Rakip Zayıfsa 1 kart çek."
- **MP:** 4
- **Etki:** Hasar aynı, kombonun ödülü el yakıtı.
- **Beklenen karar:** B1 ile aynı.
- **Çözdüğü:** P0 hafif; P1 "kartlar çabuk bitiyor".
- **Abuse riski:** Düşük.
- **Öğrenme yükü:** Düşük.
- **AI test edebilir mi?** Kısmen. El ağırlığı 0,5 olduğu için bonusu küçük görür.

## C. Yıkım: koşullu bitirici

Bugün: 6 MP'ye 14 hasar. Sim'de %99,3 oynanıyor, yani "6 MP varsa otomatik Yıkım".

### C1 · Yıkım: "Rakibin HP'si 15 veya altındaysa 14 hasar ver; değilse 7."
- **MP:** 6
- **Etki:** Erken oynanırsa 6 MP'ye 7 hasar, yani kötü bir takas. Rakip yarı canın altındayken bitirici.
- **Beklenen karar:** Şimdi mi, sakla mı? Önce rakibi 15'in altına nasıl indiririm?
- **Çözdüğü:** "Otomatik Yıkım" doğrudan; P1 kart saklama.
- **Abuse riski:** Düşük. Güç ile 16 hasar, 15 HP'deki rakibi öldürür; bu amaçlanan bitirici rolü.
- **Öğrenme yükü:** Düşük, ekranda canlı hasar gösterilirse.
- **Risk:** Rakip HP'si yüksekken elde "ölü kart" gibi durur. "İşe yaramayan kart" şikâyetini artırabilir; Gate 1B'de izlenmeli.
- **AI test edebilir mi?** Zayıf. AI 7 hasarı da skor artışı görüp erken oynayabilir. Yıkım'ı israf eden bir AI daha zayıf bir rakip olur. AI ağırlıkları bu turda değişmediği için bu bilinçli kabul edilir.

### C2 · Yıkım: "14 hasar ver. Bu tur oynadığın her başka Attack kartı için maliyeti 1 azalır."
- **MP:** 6 → azalabilir
- **Etki:** Büyük tur kurma; sıralama planı.
- **Beklenen karar:** Önce hangi saldırıları, hangi sırayla oynayayım?
- **Çözdüğü:** P0.
- **Abuse riski:** Yüksek. Bugünkü 8 MP tavanında Yarma + Ağır Darbe + Yıkım (4 MP'ye düşer) tek turda 3 + 7 + 14 = 24 hasar, HP 30'a karşı. 6 MP tavanında en fazla Yarma + Yıkım = 17.
- **Öğrenme yükü:** Orta–yüksek.
- **AI test edebilir mi?** Kısmen. Tesadüfen sıralayabilir.
- **Not:** Dinamik maliyet kodu ister.

### C3 · Yıkım: "Güç'ün varsa 14 hasar ver; yoksa 8."
- **MP:** 6
- **Etki:** Narası Yıkım'ın kurulumu olur. A ile aynı hatta birleşir.
- **Beklenen karar:** Narası'yı Yıkım turu için zamanla.
- **Çözdüğü:** P0.
- **Abuse riski:** Düşük.
- **Öğrenme yükü:** Düşük.
- **Risk:** Tek bir karta (Narası) bağımlılık. Narası gelmezse Yıkım zayıf kalır, yani kart çekme şansı belirleyici olur.
- **AI test edebilir mi?** Kısmen.

## D. Siper → Kalkan Darbesi

Bugün: Siper (2) + Kalkan Darbesi (2) = 4 MP → 7 Kalkan + 7 hasar. Kalkan Kaldır da eklenirse 5 MP → 11 Kalkan + 11 hasar. Hazırlık da besliyor.

**Değerlendirme: Mekanik olarak yeterli, değiştirilmemeli.** Bu zaten gerçek, aynı turda kurulan bir kombo; değeri de yüksek. Hissedilmemesinin iki nedeni var:
1. Ekranda ilişki görünmüyor. Kartta "Bu tur kazandığın Kalkan kadar" yazıyor, ama o an kaç hasar vereceği yazmıyor.
2. MP fazlası yüzünden oyuncu kartları zaten sırayla döküyor; kombo "kendiliğinden" oluyor, planlanmıyor.

İkisi de E (ekran) ve MP tavanı ile ele alınır. Kart metnine dokunulmaz.

## E. Minimal kombo okuryazarlığı (ekran)

Final görsel değil, prototip için en küçük çözüm:

1. **Kart üstünde canlı hasar.** Elde her saldırı kartı, o anki durumda vereceği hasarı gösterir: "7" ya da bonus aktifken "7 → 12". Kalkan Darbesi için o turda kazanılan Kalkan'a göre güncel sayı.
   - Hesap kural motorunda saf bir "önizleme" fonksiyonuyla yapılır, ekran yalnız gösterir.
2. **Koşul satırı ve ✓ işareti.** Kart metninde koşul ayrı satırda durur ("Güç'ün varsa: +3"). Koşul sağlanınca kartın kenarı vurgulanır ve ✓ çıkar.
3. **Anahtar kelime renkleri.** Güç, Zayıf ve Kalkan kart metninde, kahramanın üstündeki statü rozetleriyle aynı renkte. Oyuncu "bu kart şu rozetle ilgili" bağını ezberlemeden kurar.
4. **"?" kural özeti.** Ekranın köşesinde 5 satır: Güç, Zayıf, Kalkan (tur başında sıfırlanır), Arena, Yorgunluk. Bu, #7'deki "neyin ne olduğunu unuttum" notuna yönelik.

## Önerilen TEK paket: Combat v0.2

| # | Değişiklik | Tür |
|---|---|---|
| 1 | `mp.max` 8 → 6 | JSON |
| 2 | Koşullu bonus yapısı (`bonus.if`: `selfHas`, `enemyHas`, `enemyHpAtMost`) | Kod (kural motoru + Zod şeması + test) |
| 3 | **A1** Ağır Darbe: "7 hasar ver. Güç'ün varsa +3 hasar." | JSON |
| 4 | **B1** Yarıp Geç: "Kalkanı yok sayarak 6 hasar ver. Rakip Zayıfsa +3 hasar." | JSON |
| 5 | **C1** Yıkım: "Rakibin HP'si 15 veya altındaysa 14 hasar ver; değilse 7." | JSON |
| 6 | D: Siper → Kalkan Darbesi değişmez | — |
| 7 | E: canlı hasar + koşul ✓ + renkler + "?" kural özeti | Kod (ekran + önizleme fonksiyonu) |

**Neden bu seçimler:**
- **Tek yeni yapı, üç kart.** A1, B1 ve C1 aynı "koşul sağlanırsa bonus" mekanizmasını kullanıyor. "Tüketme" ve "dinamik maliyet" gerekmiyor; kod küçük kalıyor.
- **Yeni kavram yok.** Koşulların hepsi oyuncunun zaten gördüğü şeyler: Güç, Zayıf, rakibin HP'si.
- **Üç farklı plan hattı:**
  - Narası → Ağır Darbe: kurulum
  - Gözdağı → Yarıp Geç: savunma ve saldırı arasında ikilem
  - Yıkım: zamanlama
- **MP tavanı 6 bunları anlamlı kılıyor.** Kart elde kalınca, kurulumu bekleyip beklememek gerçek bir karar olur.
- **A3, B2 ve C2 daha güçlü plan yaratabilir, ama ek kod ve abuse riski getiriyor.** v0.2 yeterli olmazsa v0.3'e aday.

**Bilinen riskler:**
1. **C1 elde ölü kart yaratabilir** ("işe yaramayan kart" şikâyeti artabilir).
2. **Açgözlü AI kombo kurmaz ve Yıkım'ı israf edebilir.** Rakip zayıflarsa testin anlamı değişir. Gate 1B'de "rakip mantıklı oynadı mı" gözlemi önemli. AI'a basit bir kural eklemek (ör. "Yıkım'ı yalnız tam hasar verecekse oyna") AI kodu değişikliği olur; bu turda yapılmaz, ayrı karar gerekir.
3. **Burst riski.** Narası + Ağır Darbe + Yarma tek turda 17 hasar. Sim abuse kontrolü için koşulmalı, ama sim "eğlence" kanıtı değil.

**Ölçüm (Gate 1B, mevcut form):**
- eğlence medyanı
- sonucu değiştiren karar hatırlama oranı (bugün 0/11)
- "kombo yok" ve "kartlar çabuk bitti" notlarının azalıp azalmadığı
