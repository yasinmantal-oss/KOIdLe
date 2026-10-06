# Savaş Değerleri (Faz 1 · Gate 1)

> **Bu dosya üretilir, elle düzenlenmez.** Tek kaynak: `content/battle-config.json`, `content/cards/warrior.json`, `content/ai-profiles.json` (C2).
> Değer değiştirmek için JSON'u düzenle, sonra `pnpm values` çalıştır. JSON'la uyuşmazsa test kırılır.
> Doğru denge değil, başlangıç değerleri. Denge önerileri bu tablo üzerinden yapılır.

## 1. Kurallar

| Alan | Config anahtarı | Değer | Anlamı |
|---|---|---|---|
| Kahraman HP | `hero.hp` | 30 | Başlangıç ve maks HP |
| MP başlangıcı | `mp.start` | 1 | Kendi 1. turundaki maks MP |
| MP artışı | `mp.perTurn` | 1 | Her kendi turunda maks MP artışı |
| MP tavanı | `mp.max` | 8 | MP her tur başında dolar, devretmez |
| Başlangıç eli | `hand.starting` | 4 | İki oyuncu için |
| El sınırı | `hand.limit` | 8 | Dolu ele gelen kart yanar (ıskartaya gider) |
| Tur başı çekiş | `hand.drawPerTurn` | 1 |  |
| İlk oyuncu ilk çekişi atlar | `hand.firstPlayerSkipsFirstDraw` | evet | K3 |
| Deste boyutu | `deck.size` | 12 | Faz 1: Warrior havuzundaki her karttan birer tane |
| Karıştırma hakkı | `deck.reshuffles` | 1 | Deste bitince ıskarta karıştırılır. Iskarta boşsa hak harcanmaz (N4) |
| Yorgunluk başlangıcı | `fatigue.start` | 1 | Hak bittikten sonra boş desteden çekiş |
| Yorgunluk artışı | `fatigue.step` | 1 | Hasar dizisi: 1, 2, 3, 4… |
| Yorgunluk Kalkanı yok sayar | `fatigue.ignoresShield` | evet | N1 |
| Kalkan davranışı | `shield.persistence` | resetOnOwnTurnStart | K1. resetOnOwnTurnStart: kullanılmayan Kalkan sahibinin sonraki tur başında 0 olur. Alternatif: persistent |
| Arena Çöküşü başlangıcı | `arenaCollapse.startRound` | 8 | Bu rauntan itibaren her oyuncu kendi tur başında hasar alır |
| Arena ilk hasar | `arenaCollapse.start` | 1 |  |
| Arena artışı | `arenaCollapse.step` | 1 | 8. rauntan itibaren: 1, 2, 3, 4… |
| Arena Kalkanı yok sayar | `arenaCollapse.ignoresShield` | evet |  |
| Statü yığılması | `statuses.stacking` | maxAmountRefreshOnGte | K7. Gelen değer ≥ mevcut: değer güncellenir, süre yenilenir. Küçükse yok sayılır |
| Statü sayacı | `statuses.tickOn` | ownerTurnEnd | Süre, etkilenen kahramanın kendi tur sonunda 1 düşer |
| Güç süresi | `statuses.strength.duration` | 2 | Kendine verilince: o tur dahil |
| Zayıflık süresi | `statuses.weak.duration` | 2 | Rakibe verilince: rakibin sonraki turları |
| Güvenlik tavanı | `roundCap` | 20 | Bu raunt biterse berabere. Normalde tetiklenmemeli |

**Raunt:** iki oyuncunun da birer tur oynaması. Raunt, ilk oyuncunun turu başlarken artar.

**Tur başı sırası (N3, C1):** tur başlar → Kalkan sıfırlanır → maks MP ve MP → Arena hasarı → kart çekme (gerekirse karıştırma veya Yorgunluk). Her sistem hasarından sonra savaş bitti mi bakılır; Arena öldürürse çekme olmaz.

### Formüller (hepsi tamsayı)

- Maks MP (kendi N. turu) = `min(mp.start + (N − 1) × mp.perTurn, mp.max)` → 1, 2, 3, 4, 5, 6, 7, 8, 8, 8
- Arena hasarı (raunt R ≥ startRound) = `start + (R − startRound) × step`
- Yorgunluk (oyuncunun k. yorgunluğu) = `start + (k − 1) × step`
- Kart hasarı = `max(0, kart değeri + Güç − Zayıflık)`. Önce Kalkan emer, kalanı HP'den düşer (Kalkanı yok sayan kartlar hariç).
- İyileşme maks HP'yi geçmez. Kalkan iyileşme sayılmaz.

## 2. Warrior kartları (12)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `yarma` | Yarma | Attack | 1 | 3 hasar ver. |
| `kalkan-kaldir` | Kalkan Kaldır | Defense | 1 | 4 Kalkan kazan. |
| `gozdagi` | Gözdağı | Debuff | 1 | Rakibe Zayıflık 2 ver. |
| `hazirlik` | Hazırlık | Skill | 1 | 1 kart çek. 2 Kalkan kazan. |
| `kalkan-darbesi` | Kalkan Darbesi | Attack | 2 | Bu tur kazandığın Kalkan kadar hasar ver. |
| `savas-narasi` | Savaş Narası | Buff | 2 | Kendine Güç 2 ver. |
| `siper` | Siper | Defense | 2 | 7 Kalkan kazan. |
| `ikinci-nefes` | İkinci Nefes | Heal | 2 | 6 HP iyileş. |
| `agir-darbe` | Ağır Darbe | Attack | 3 | 7 hasar ver. |
| `savas-ritmi` | Savaş Ritmi | Skill | 3 | 2 kart çek. 3 hasar ver. |
| `yarip-gec` | Yarıp Geç | Attack | 4 | Kalkanı yok sayarak 6 hasar ver. |
| `yikim` | Yıkım | Attack | 6 | 14 hasar ver. |

Maliyet dağılımı: 1 MP ×4 · 2 MP ×4 · 3 MP ×2 · 4 MP ×1 · 6 MP ×1.
Kart türleri: Attack ×5 · Defense ×2 · Debuff ×1 · Skill ×2 · Buff ×1 · Heal ×1.

Gözlem listesi (C3, C4): Siper + Kalkan Darbesi, Yarıp Geç ve Yıkım. Gate 1 ve simülasyonda izlenir; şimdilik değer değişikliği yok.

## 3. AI profilleri (AI ayarı, kural değeri değil)

Skor = ağırlık × ölçüt toplamı. AI gizli bilgiyi görmez (rakibin eli, deste sırası).

| Profil | Rakibe hasar | Kendi hasarı | Kalkan | Rakip Kalkanı | Statü | El |
|---|---|---|---|---|---|---|
| aggressive (saldırgan) | 3 | 1 | 0.5 | 1 | 1.5 | 0.5 |
| balanced (dengeli) | 2 | 2 | 1 | 1 | 1 | 0.5 |
| defensive (savunmacı) | 1.5 | 3 | 1.5 | 0.5 | 1 | 0.5 |
