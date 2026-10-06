# Savaş Değerleri (Faz 2a)

> **Bu dosya üretilir, elle düzenlenmez.** Tek kaynak: `content/battle-config.json`, `content/cards/*.json`, `content/decks/*.json`, `content/ai-profiles.json` (C2).
> Değer değiştirmek için JSON'u düzenle, sonra `pnpm values` çalıştır. JSON'la uyuşmazsa test kırılır.
> Doğru denge değil, başlangıç değerleri. Denge önerileri bu tablo üzerinden yapılır.

## 1. Kurallar

| Alan | Config anahtarı | Değer | Anlamı |
|---|---|---|---|
| Kahraman HP | `hero.hp` | 30 | Başlangıç ve maks HP |
| MP başlangıcı | `mp.start` | 1 | Kendi 1. turundaki maks MP |
| MP artışı | `mp.perTurn` | 1 | Her kendi turunda maks MP artışı |
| MP tavanı | `mp.max` | 6 | MP her tur başında dolar, devretmez |
| Başlangıç eli | `hand.starting` | 4 | İki oyuncu için |
| El sınırı | `hand.limit` | 8 | Dolu ele gelen kart yanar (ıskartaya gider) |
| Tur başı çekiş | `hand.drawPerTurn` | 1 |  |
| İlk oyuncu ilk çekişi atlar | `hand.firstPlayerSkipsFirstDraw` | evet | K3 |
| Açılış eli garantisi | `hand.openingGuarantee` | evet | F2-7: başlangıç eline Ağır kart gelmez; elde en az bir 1 MP'lik kart olur |
| Deste boyutu | `deck.size` | 12 | Oyuncu tek kopyalık deste kurar (F2-4); havuz 16 karttır |
| Maks Ağır kart | `deckBuilding.maxHeavy` | 2 | F2-5: destede en fazla. Motor yok sayar; deste kurma, hazır desteler ve sim doğrular |
| Asgari açılış kartı | `deckBuilding.minOpeners` | 3 | F2-6: destede en az 1 MP'lik kart sayısı |
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
| Güç süresi | `statuses.strength.duration` | 2 | Kendine verilince: verildiği tur dahil 2 kendi turu |
| Zayıflık süresi | `statuses.weak.duration` | 2 | Rakibe verilince: rakibin sonraki 2 turu |
| Lanet süresi | `statuses.curse.duration` | 2 | Hedefin aldığı kart hasarına +değer. Rakibe ya da (Berserker bedeli) kendine verilir |
| Zehir süresi | `statuses.poison.duration` | 2 | Sahibinin tur başında değer kadar hasar; 2 tur başı boyunca |
| Gizli süresi | `statuses.stealth.duration` | 2 | Sonraki hasar kartının ilk vuruşuna +değer ve Kalkanı yok sayma; kullanılınca düşer |
| Güvenlik tavanı | `roundCap` | 20 | Bu raunt biterse berabere. Normalde tetiklenmemeli |

**Raunt:** iki oyuncunun da birer tur oynaması. Raunt, ilk oyuncunun turu başlarken artar.

**Tur başı sırası (N3, C1):** tur başlar → Kalkan sıfırlanır → maks MP ve MP → Zehir hasarı → Arena hasarı → kart çekme (gerekirse karıştırma veya Yorgunluk). Her sistem hasarından sonra savaş bitti mi bakılır; Zehir ya da Arena öldürürse çekme olmaz.

### Formüller (hepsi tamsayı)

- Maks MP (kendi N. turu) = `min(mp.start + (N − 1) × mp.perTurn, mp.max)` → 1, 2, 3, 4, 5, 6, 6, 6, 6, 6
- Arena hasarı (raunt R ≥ startRound) = `start + (R − startRound) × step`
- Yorgunluk (oyuncunun k. yorgunluğu) = `start + (k − 1) × step`
- Kart hasarı = `max(0, kart değeri + Güç(kaynak) − Zayıflık(kaynak) + Lanet(hedef))`. Önce Kalkan emer, kalanı HP'den düşer (Kalkanı yok sayan kartlar hariç). Zehir hasarı Lanet'ten etkilenmez.
- Gizli: bir sonraki hasar veren kartın **ilk vuruşuna** +değer ekler ve o vuruş Kalkanı yok sayar; sonra düşer. Çoklu vuruşta Güç/Zayıflık/Lanet her vuruşa uygulanır.
- Zincir N: bu tur, bu karttan **önce** en az N kart oynandıysa bonus. Sayaç kart çözüldükten sonra artar.
- İyileşme maks HP'yi geçmez. Kalkan iyileşme sayılmaz.

## 2. Kartlar (33)

★ = Ağır kart (destede en fazla 2; açılış eline gelmez). Kart başına tek anahtar kelime (F2-8).

### Ortak (6)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `hizli-vurus` | Hızlı Vuruş | Attack | 1 | 3 hasar ver. |
| `sprint` | Sprint | Skill | 1 | 1 kart çek. |
| `absoluteness` | Absoluteness | Defense | 1 | 4 Kalkan kazan. |
| `gozdagi` | Gözdağı | Debuff | 1 | Rakibe Zayıflık 2 ver. |
| `valor` | Valor | Heal | 2 | 4 HP iyileş. HP'n 15 veya altındaysa 8. |
| `guclu-vurus` | Güçlü Vuruş | Attack | 3 | 7 hasar ver. |

### Warrior (10)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `slash` | Slash | Attack | 1 | 3 hasar ver. Güç'ün varsa +2. |
| `gain` | Gain | Buff | 1 | Kendine Güç 2 ver. |
| `leg-cutting` | Leg Cutting | Debuff | 2 | 2 hasar ver. Rakibe Zayıflık 2 ver. |
| `berserker` | Berserker | Buff | 2 | Kendine Güç 3 ve Lanet 2 ver. |
| `iron-skin` | Iron Skin | Defense | 2 | 6 Kalkan kazan. |
| `cleave` | Cleave | Attack | 3 | 7 hasar ver. Güç'ün varsa +3. |
| `howling-sword` | Howling Sword | Attack | 4 | Kalkanı yok sayarak 6 hasar ver. Rakip Zayıfsa +3. |
| `wall-of-iron` | ★ Wall of Iron | Defense | 3 | 12 Kalkan kazan. |
| `sword-dancing` | ★ Sword Dancing | Attack | 4 | 6 hasar ver. 5 HP iyileş. |
| `hell-blade` | ★ Hell Blade | Attack | 5 | 9 hasar ver. Güç'ün varsa +4. |

### Rogue ortak (3)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `minor-healing` | Minor Healing | Heal | 1 | 3 HP iyileş. |
| `light-feet` | Light Feet | Skill | 1 | 1 kart çek. |
| `scaled-skin` | ★ Scaled Skin | Defense | 3 | 10 Kalkan kazan. |

### Rogue · Asas (7)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `stab` | Stab | Attack | 1 | 2 hasar ver. Zincir 1: +2. |
| `stealth` | Stealth | Skill | 1 | Kendine Gizli 3 ver. |
| `thrust` | Thrust | Attack | 2 | 4 hasar ver. Zincir 1: +3. |
| `blinding` | Blinding | Debuff | 2 | 3 hasar ver. Rakibe Zayıflık 2 ver. |
| `spike` | Spike | Attack | 3 | 6 hasar ver. Zincir 2: +4. |
| `critical-point` | ★ Critical Point | Skill | 2 | Kendine Gizli 7 ver. |
| `beast-hiding` | ★ Beast Hiding | Attack | 4 | 6 hasar ver. Sonra kendine Gizli 3 ver. |

### Rogue · Okçu (7)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `poison-arrow` | Poison Arrow | Debuff | 1 | 1 hasar ver. Rakibe Zehir 2 ver. |
| `perfect-arrow` | Perfect Arrow | Attack | 1 | Kalkanı yok sayarak 2 hasar ver. |
| `multiple-shot` | Multiple Shot | Attack | 2 | 3 kez 2 hasar ver. |
| `viper` | Viper | Debuff | 2 | Rakibe Zehir 4 ver. |
| `blinding-strafe` | Blinding Strafe | Debuff | 2 | 3 hasar ver. Rakibe Zayıflık 2 ver. |
| `arrow-shower` | ★ Arrow Shower | Attack | 4 | 5 kez 2 hasar ver. |
| `power-shot` | ★ Power Shot | Attack | 4 | Kalkanı yok sayarak 7 hasar ver. Rakibin HP'si 12 veya altındaysa +5. |

Maliyet dağılımı: 1 MP ×12 · 2 MP ×10 · 3 MP ×5 · 4 MP ×5 · 5 MP ×1.
Kart türleri: Attack ×15 · Skill ×4 · Defense ×4 · Debuff ×6 · Heal ×2 · Buff ×2.

Gözlem listesi: Stab → Thrust → Spike (19 hasar, 6 MP), Berserker → Hell Blade (16), Viper + Power Shot. Sim ve Yasin testinde izlenir; şimdilik değer değişikliği yok.

## 3. Hazır desteler (önerilen deste = AI destesi)

| Deste | Kartlar | Ağır | 1 MP'lik |
|---|---|---|---|
| Warrior | Slash, Gain, Leg Cutting, Berserker, Iron Skin, Cleave, Howling Sword, Sword Dancing, Hell Blade, Hızlı Vuruş, Gözdağı, Sprint | 2/2 | 5 (en az 3) |
| Rogue · Asas | Stab, Stealth, Thrust, Blinding, Spike, Critical Point, Beast Hiding, Light Feet, Minor Healing, Hızlı Vuruş, Absoluteness, Güçlü Vuruş | 2/2 | 6 (en az 3) |
| Rogue · Okçu | Poison Arrow, Perfect Arrow, Multiple Shot, Viper, Blinding Strafe, Arrow Shower, Power Shot, Light Feet, Minor Healing, Absoluteness, Gözdağı, Güçlü Vuruş | 2/2 | 6 (en az 3) |

## 4. AI profilleri (AI ayarı, kural değeri değil)

Skor = ağırlık × ölçüt toplamı. AI gizli bilgiyi görmez (rakibin eli, deste sırası).

| Profil | Rakibe hasar | Kendi hasarı | Kalkan | Rakip Kalkanı | Statü | El |
|---|---|---|---|---|---|---|
| aggressive (saldırgan) | 3 | 1 | 0.5 | 1 | 1.5 | 0.5 |
| balanced (dengeli) | 2 | 2 | 1 | 1 | 1 | 0.5 |
| defensive (savunmacı) | 1.5 | 3 | 1.5 | 0.5 | 1 | 0.5 |
