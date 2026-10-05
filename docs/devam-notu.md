# KOIdLe — Devam Notu (oturum devri)

> Son güncelleme: 2026-10-05 · Bir sonraki oturum buradan başlar. Önce bu dosyayı, sonra `docs/research/` raporlarının özet bölümlerini oku.

## Proje tek cümlede
Knight Online'dan **esinlenen** (MMORPG değil), Hearthstone tarzı bir kart oyunu. Ticari F2P; mobil (iOS/Android) ve PC (Steam). Knight isimleri ve görselleri kullanılmaz. Sistemler ve his Knight'a benzer, dünya özgündür.

## Yöntem
Brainstorming skill'i ile tasarım yapılıyor (superpowers:brainstorming). Bölüm bölüm sunulup onay alınıyor. Spec yazılıp onaylanınca writing-plans skill'ine geçilecek. **Henüz kod yazılmadı.**

## Kesinleşen kararlar
| Konu | Karar |
|---|---|
| Amaç | Ticari yayın. IP nedeniyle özgün isimler ve görseller. |
| Geliştirme | Claude ana ajan + alt ajanlar. Mekanik işler yerel Qwen'e (qwen3:8b, Ollama) ve Gemini'ye. Yaratıcı isimlendirme Qwen'e verilmez (2026-10-05 testinde kullanılamaz çıktı verdi). |
| Çekirdek model | Hibrit: karakter (job + level + ekipman) ve skill kartlarından oluşan bir deste. |
| Çok oyunculu | PvE ve canlı 1v1. Ulus savaşı sonraya bırakıldı, mimari baştan buna hazır kurulacak. |
| PvP gücü | Üç katman. Ranked: statlar eşit, yalnız yatay seçimler ve kozmetik taşınır. Gear'ın geçerli olduğu PvP: CZ (aşağıya bak). PvE: tam güç. |
| Gelir | F2P. Yalnız kozmetik ve kolaylık satılır; güç, şans, upgrade malzemesi asla satılmaz. Premium paranın takas edilip edilmeyeceği **açık soru**: rapor 03 takası kapatmayı, rapor 04 sınırlı bir "Kraliyet Mührü" borsası öneriyor. |
| Upgrade | Yanma yok. Başarısız upgrade item'ı bir seviye düşürür. Örs Isısı ile şanssızlık telafisi var (oranlar `docs/research/04-ekonomi-tasarimi.md` §8.2). |
| Görsel dil | **Harman:** Modern Klasik'in metal çerçeveleri ve KO barları, Karanlık Resimsel'in ışık, vinyet ve kor efektleri, Stilize'nin okunaklı rakamları ve geniş dokunma alanları. Mockup: `design/mockups/gorsel-yonler.html` (Artifact: https://claude.ai/artifact/QTiuNpZ3kFKnQF6Hz2Hyzv) |
| Teknoloji | TypeScript monorepo, ortak kural motoru, PixiJS + React, Capacitor (mobil), Electron (PC/Steam), Node + Colyseus + PostgreSQL + Valkey. Ekonomi servisi ayrı; dupe'a karşı çift taraflı defter. Detay: `docs/research/05-teknoloji-dogrulama.md` |

## Yasin'in revizyonları (2026-10-05, en önemli girdi)
1. **Sadeleştir.** Bu bir MMORPG değil, kart oyunu. Knight'taki her şey oyuncuya verilmez. Bazı sistemler kalkacak, bazıları hiç olmayacak. Mekanikler kart oyununun kendi yapısına göre organize edilecek. Knight ilham kaynağı; birçok noktada ona benzer ama kopyası değil.
2. **CZ / farm slotları (ana PvE + PK döngüsü):**
   - CZ'de belirli farm slotları var. Oyuncu karakterini slota bırakır ve karakter "genie" gibi kendi kendine farm yapar.
   - Slotların kişi sınırı var. Belirli bir sayının üstünde slotun getirisi azalır.
   - Slottaki oyuncu karşı ulustan **baskın** yiyebilir. Baskın gelince otomatik savaş başlar. Oyuncu başında değilse karşı taraf, karakterin AI versiyonuyla savaşır (asenkron PvP).
   - Slotlarda party ve KS olabilir.
   - CZ bir PK alanı. Oyuncular otomatik eşleşmeyle savaş da arayabilir.
   - Farm yaptıkça item ve eşya kasılır, karakter bunlarla gelişir.
3. **Level:** Knight'taki gibi uzun EXP süreçleri yok. EXP var ama farm slotlarından ve PK'dan kazanılır. Eşleştirme level ve güce göre yapılır.
4. **Savaş sade:** Savaş sırasında upgrade gibi karmaşık işler yok. Oyuncu destesini hazırlar ve savaşa girer. Yasin bu alana hâkim olmadığını söyledi; savaş kurgusunu doğru tasarlamak bizim sorumluluğumuzda.

## Sıradaki adımlar
1. Revizyonlara göre **sadeleştirme turu**: raporlardaki önerileri "kalsın / sadeleşsin / çıksın" diye ayıkla. Adaylar: 5 stat yerine 3, job başına ikincil kaynak (Öfke/Odak vb.) yalnız birkaç job'da, dayanıklılık/tamir, Kraliyet Mührü borsası, Sefer, Kışkırtma, Söylenti drop'u, sezonluk lig.
2. CZ farm slotu ve baskın sistemini tasarla: slot kapasitesi ve azalan getiri, baskın akışı, AI vekil savaş, party ve KS, ganimet kaybı, eşleştirme.
3. Brainstorming'e kaldığı yerden devam et: **Bölüm 2: Dünya, uluslar, job'lar** (isimler dahil). Ardından savaş kuralları, item ve upgrade, CZ ve PvE, mimari.
4. Spec'i `docs/superpowers/specs/2026-10-05-koidle-cekirdek-design.md` olarak yaz → self-review → Yasin'in onayı → writing-plans.

## Dosyalar
- `docs/research/01..05`: araştırma raporları (topluluk, KO sistemleri, kart tasarımı, ekonomi, teknoloji)
- `design/mockups/gorsel-yonler.html`: dört görsel yön mockup'ı
- Vault (yalnız yerel makinede): `C:/Users/muham/.gemini/antigravity/scratch/100-Projeler/KOIdLe/KOIdLe_Proje_Karti.md`
