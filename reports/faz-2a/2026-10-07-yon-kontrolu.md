# Faz 2a yön kontrolü (Yasin, 2026-10-07)

Warrior ve Rogue ile 10 maç oynandı. Bu bir Gate değil, yön kontrolüdür (spec §9). Sonuç: yön doğru, ama hız kartları ve hasar seviyesi düzeltilmeli. Yasin düzeltme paketini onayladı.

## 10 maç sayıları

| Ölçüt | Sonuç |
|---|---|
| Eğlence medyanı | 5 |
| Karar medyanı | 3 |
| Sonucu değiştiren kararı hatırlama | 2/10 |
| "Farklı hissettirdi" | 5/10 |
| Kazanma (Yasin) | Warrior 4/5, Asas 1/2, Okçu 0/3 |
| Arena Çöküşü ile biten maç | 5/10 |
| İlk oyuncunun kazanma oranı | %32 |

## Not özeti

- Hız kartları (Sprint, Light Feet) işe yaramadı; MP zaten tam harcanmıyordu, ek MP bir şey değiştirmedi.
- Okçu 0/3: zayıf, savunma kartı yok, Zehir tek başına yetmedi.
- Warrior kolay: 4/5 kazanma.
- Maçların yarısı Arena Çöküşü ile bitti; kart hasarı yetmiyor, oyun saate bağlanıyor.
- İlk oyuncu %32; ikinci oyuncu avantajlı.

## Düzeltmeler (ayrıntı: spec "Revizyon 2")

1. Sprint ve Light Feet kaldırıldı; `gainMp` / `MP_GAINED` silindi. Havuz 15 kart/job, toplam 32 kart.
2. Evade (Rogue ortak, 1 MP, Kaçınma kazan) eklendi; Okçu ve Asas destelerinde.
3. Okçu kısmi geri alma: Multiple Shot 3 → 2 MP, Viper 3 → 4 Zehir; Arrow Shower 4 kez 2, Power Shot 6.
4. İkinci oyuncu 1. turunda +MP (`mp.secondPlayerFirstTurnBonus: 4`) ve ilk oyuncu artık ilk turunda çekiyor (K3 kapalı).
5. Kart hasarları orta ölçüde artırıldı (Quick Strike 4, Power Strike 8, Slash 4, Cleave 8, Howling Sword 8, Hell Blade 10, Thrust 6 ve diğerleri); Gain 3 Güç, Berserker kendine 1 hasar.

## Sim sonucu (900 maç, balanced, hazır desteler)

| Ölçüt | Önce (düzeltme öncesi, Evade'siz taban) | Sonra | Hedef |
|---|---|---|---|
| Ortalama raunt | 8,49 | 7,09 | 6,5–7,5 |
| Arena ile biten | %40,8 | %15,6 | < %20 |
| İlk oyuncu kazanma | %33,1 | %58,6 (300 seed: %57,0) | %45–55 (ulaşılamadı) |
| Job hücreleri (satır karşı sütun) | %27–73 | %42,0–58,0 | %40–60 |
| En düşük kart oynanma oranı | Berserker %61,8 | Berserker %58,0 | ≥ %30 |

Warrior–Asas %48,0, Warrior–Okçu %51,0, Asas–Okçu %42,0. "Önce" sütunu, Sprint/Light Feet kaldırılıp Evade eklendikten ve MP bonusu açıldıktan sonraki ilk sim koşusudur (Faz 2a taban, `7c2bb24` içeriğiyle).

**Ulaşılamayan hedef: ilk oyuncu.** K3 açıkken MP bonusu 1–5 arasında ilk oyuncuyu %33–38'de bıraktı (sınır MP değil, kart sayısı). K3 kapatılınca bonus 1 → %63, bonus 3 → %60, bonus 4 → %57, bonus 5 → %57,5. Bu yüzden bonus 4 ve K3 kapalı seçildi; kalan 2–3 puan fark Gate 2 öncesi yeniden ele alınmalı (ör. ilk oyuncuya MP yerine kart avantajı verilmeyen bir denge mekaniği; bu tur yeni mekanik eklenmedi).
