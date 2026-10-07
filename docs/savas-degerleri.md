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
| İkinci oyuncu 1. tur MP bonusu | `mp.secondPlayerFirstTurnBonus` | 0 | Yalnız ikinci oyuncunun kendi 1. turunda maks MP’ye eklenir. 2026-10-07: 0 (telafi artık ekstra kart) |
| Başlangıç eli | `hand.starting` | 4 | İki oyuncu için |
| El sınırı | `hand.limit` | 8 | Dolu ele gelen kart yanar (ıskartaya gider) |
| Tur başı çekiş | `hand.drawPerTurn` | 1 |  |
| İlk oyuncu ilk çekişi atlar | `hand.firstPlayerSkipsFirstDraw` | hayır | K3 |
| İkinci oyuncu 1. tur ekstra çekişi | `hand.secondPlayerFirstTurnExtraDraw` | 1 | İkinci oyuncu kendi 1. turunda 1 + bu kadar kart çeker (yalnız o tur); el sınırı ve Yorgunluk aynen geçerli |
| Açılış eli garantisi | `hand.openingGuarantee` | evet | F2-7: başlangıç eline Ağır kart gelmez; elde en az bir 1 MP'lik kart olur |
| Deste boyutu | `deck.size` | 12 | Oyuncu tek kopyalık deste kurar (F2-4); havuz 15 karttır |
| Maks Ağır kart | `deckBuilding.maxHeavy` | 2 | F2-5: destede en fazla. Motor yok sayar; deste kurma, hazır desteler ve sim doğrular |
| Asgari açılış kartı | `deckBuilding.minOpeners` | 3 | F2-6: destede en az 1 MP'lik kart sayısı |
| Karıştırma hakkı | `deck.reshuffles` | 1 | Deste bitince ıskarta karıştırılır. Iskarta boşsa hak harcanmaz (N4) |
| Yorgunluk başlangıcı | `fatigue.start` | 1 | Hak bittikten sonra boş desteden çekiş |
| Yorgunluk artışı | `fatigue.step` | 1 | Hasar dizisi: 1, 2, 3, 4… |
| Yorgunluk Kalkanı yok sayar | `fatigue.ignoresShield` | evet | N1 |
| Kalkan davranışı | `shield.persistence` | resetOnOwnTurnStart | K1. resetOnOwnTurnStart: kullanılmayan Kalkan sahibinin sonraki tur başında 0 olur. Alternatif: persistent |
| Arena Çöküşü açık | `arenaCollapse.enabled` | hayır | Yasin kararı: kapalı. Maç Yorgunluk ve raunt sınırıyla biter. Kod yolu config için durur |
| Arena Çöküşü başlangıcı | `arenaCollapse.startRound` | 8 | Bu rauntan itibaren her oyuncu kendi tur başında hasar alır |
| Arena ilk hasar | `arenaCollapse.start` | 1 |  |
| Arena artışı | `arenaCollapse.step` | 1 | 8. rauntan itibaren: 1, 2, 3, 4… |
| Arena Kalkanı yok sayar | `arenaCollapse.ignoresShield` | evet |  |
| Zayıflık süresi | `statuses.weak.duration` | 2 | Rakibe verilince: rakibin sonraki 2 turu. K7: gelen değer ≥ mevcut ise yenilenir, küçükse yok sayılır; süre sahibinin tur sonunda 1 düşer |
| Güç üst sınırı | `statuses.strength.max` | 5 | Toplanır, bu değerde kesilir. Süresi yok; ilk hasar veren kartın ilk vuruşunda tamamı harcanır |
| Zehir üst sınırı | `statuses.poison.max` | 6 | Toplanır, bu değerde kesilir |
| Zehir azalması | `statuses.poison.decay` | 2 | Sahibinin tur başında değer kadar hasar (Kalkanı yok sayar), sonra değer bu kadar azalır; ≤ 0 olunca kalkar |
| Donma süresi | `statuses.freeze.duration` | 2 | Rakibe verilince: rakibin sonraki 2 turu. Tek başına etkisi yok; Ateş kartı bonus alır ve Donma'yı tüketir. K7: gelen değer ≥ mevcut ise yenilenir |
| Güvenlik tavanı | `roundCap` | 20 | Bu raunt biterse berabere. Normalde tetiklenmemeli |

**Raunt:** iki oyuncunun da birer tur oynaması. Raunt, ilk oyuncunun turu başlarken artar.

**Tur başı sırası (N3, C1):** tur başlar → Kaçınma düşer → Kalkan sıfırlanır → maks MP ve MP → Zehir hasarı → Arena hasarı → kart çekme (gerekirse karıştırma veya Yorgunluk). Her sistem hasarından sonra savaş bitti mi bakılır; Zehir ya da Arena öldürürse çekme olmaz.

### Formüller (hepsi tamsayı)

- Maks MP (kendi N. turu) = `min(mp.start + (N − 1) × mp.perTurn, mp.max)` → 1, 2, 3, 4, 5, 6, 6, 6, 6, 6
- Arena hasarı (raunt R ≥ startRound) = `start + (R − startRound) × step`
- Yorgunluk (oyuncunun k. yorgunluğu) = `start + (k − 1) × step`
- Vuruş hasarı = `max(0, kart değeri + Güç × çarpan (yalnız kartın ilk vuruşunda) − Zayıflık) × (Kritik ? 2 : 1)`. Önce Kalkan emer, kalanı HP'den düşer (Kalkanı yok sayan kartlar hariç). Zayıflık her vuruşa uygulanır.
- Güç: sonraki hasar veren kartın **ilk vuruşuna** eklenir, sonra tamamı harcanır. Hell Blade Güç'ü iki kat sayar.
- Kritik: sonraki hasar veren kartın **her vuruşu** iki katı (Güç/Zayıflık sonrası, Kalkandan önce); sonra harcanır. Yalnız Critical Point verir.
- Kaçınma: rakibin sonraki hasar veren kartının **ilk vuruşu** 0 hasar verir ve harcanır; kullanılmazsa sahibinin sonraki turunun başında düşer. Zehir, Arena ve Yorgunluğu durdurmaz.
- MP kazanma: bu tur MP'yi (gerekirse maks MP'nin üstüne) artırır. Kendine hasar Kalkanı yok sayar.
- **Ateş** (Mage): kart metnindeki bonus, rakip **Donmuşsa** taban hasara eklenir ve Donma **tüketilir** (bir Donma tek bir Ateş bonusunu besler). Güç/Zayıflık/Kritik sonrası, Kalkandan önce uygulanır.
- **Taşan iyileşme** (Priest): maks HP'yi aşan iyileşme Kalkan olur ve o tur kazanılan Kalkan sayılır.
- **Maks HP azaltma** (Parasite): kalıcıdır, iyileşmeyle geri gelmez; HP yeni maksı aşıyorsa maksa iner. Statü değildir, debuff sayımına girmez.
- **Judgement**: hasar bonusu = rakipteki olumsuz statü sayısı (Zayıflık, Zehir, Donma) × `per`.
- İyileşme (taşma kapalıysa) maks HP'yi geçmez. Kalkan iyileşme sayılmaz.

## 2. Kartlar (54)

★ = Ağır kart (destede en fazla 2; açılış eline gelmez). Kart başına tek anahtar kelime (F2-8).

### Ortak (5)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `quick-strike` | Quick Strike | Attack | 1 | 4 hasar ver. |
| `absoluteness` | Absoluteness | Defense | 1 | 4 Kalkan kazan. |
| `intimidate` | Intimidate | Debuff | 1 | Rakibe Zayıflık 2 ver. |
| `valor` | Valor | Heal | 2 | 4 HP iyileş. HP'n 15 veya altındaysa 8 HP iyileş. |
| `power-strike` | Power Strike | Attack | 3 | 8 hasar ver. |

### Warrior (10)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `slash` | Slash | Attack | 1 | 4 hasar ver. |
| `gain` | Gain | Buff | 1 | 3 Güç kazan. |
| `leg-cutting` | Leg Cutting | Debuff | 2 | 3 hasar ver. Rakibe Zayıflık 2 ver. |
| `berserker` | Berserker | Buff | 2 | 3 Güç kazan. Kendine 1 hasar ver (Kalkanını yok sayar). |
| `iron-skin` | Iron Skin | Defense | 2 | 5 Kalkan kazan. |
| `cleave` | Cleave | Attack | 3 | 8 hasar ver. |
| `howling-sword` | Howling Sword | Attack | 4 | 8 hasar ver. Kalkanı deler. |
| `wall-of-iron` | ★ Wall of Iron | Defense | 3 | 10 Kalkan kazan. |
| `sword-dancing` | ★ Sword Dancing | Attack | 4 | 6 hasar ver. 4 HP iyileş. |
| `hell-blade` | ★ Hell Blade | Attack | 5 | 10 hasar ver. Güç'ün iki kat sayılır. |

### Rogue ortak (3)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `minor-healing` | Minor Healing | Heal | 1 | 3 HP iyileş. |
| `evade` | Evade | Skill | 1 | Kaçınma kazan. |
| `scaled-skin` | ★ Scaled Skin | Defense | 3 | 10 Kalkan kazan. |

### Rogue · Asas (7)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `stab` | Stab | Attack | 1 | 3 hasar ver. |
| `stealth` | Stealth | Skill | 1 | Kaçınma kazan. |
| `thrust` | Thrust | Attack | 2 | 6 hasar ver. |
| `blinding` | Blinding | Debuff | 2 | 3 hasar ver. Rakibe Zayıflık 3 ver. |
| `spike` | Spike | Attack | 3 | 7 hasar ver. |
| `critical-point` | ★ Critical Point | Skill | 2 | Kritik kazan. |
| `beast-hiding` | ★ Beast Hiding | Attack | 4 | 6 hasar ver, sonra Kaçınma kazan. |

### Rogue · Okçu (7)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `poison-arrow` | Poison Arrow | Debuff | 1 | 1 hasar ver. Rakibe 2 Zehir ver. |
| `perfect-arrow` | Perfect Arrow | Attack | 1 | 2 hasar ver. Kalkanı deler. |
| `multiple-shot` | Multiple Shot | Attack | 2 | 3 kez 2 hasar ver. |
| `viper` | Viper | Debuff | 2 | Rakibe 4 Zehir ver. |
| `blinding-strafe` | Blinding Strafe | Debuff | 2 | 2 hasar ver. Rakibe Zayıflık 2 ver. |
| `arrow-shower` | ★ Arrow Shower | Attack | 4 | 4 kez 2 hasar ver. |
| `power-shot` | ★ Power Shot | Attack | 4 | 6 hasar ver, Kalkanı deler. Rakibin HP'si 12 veya altındaysa +3. |

### Mage (10)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `freeze` | Freeze | Debuff | 1 | 2 hasar ver. Rakibe Donma ver. |
| `burn` | Burn | Attack | 1 | 2 hasar ver. Ateş: rakip Donmuşsa +3 hasar ve Donma biter. |
| `chill` | Chill | Skill | 1 | Rakibe Donma ver. 1 kart çek. |
| `fire-ball` | Fire Ball | Attack | 2 | 5 hasar ver. Ateş: rakip Donmuşsa +4 hasar ve Donma biter. |
| `frozen-armor` | Frozen Armor | Defense | 2 | 7 Kalkan kazan. |
| `lightning` | Lightning | Attack | 2 | Kalkanı yok sayarak 5 hasar ver. |
| `ice-comet` | Ice Comet | Attack | 3 | 5 hasar ver. Rakibe Donma ver. |
| `freezing-distance` | ★ Freezing Distance | Debuff | 3 | Rakibe Donma ver ve Zayıflık 3 ver. |
| `incineration` | ★ Incineration | Attack | 4 | 8 hasar ver. Ateş: rakip Donmuşsa +4 hasar ve Donma biter. |
| `meteor-fall` | ★ Meteor Fall | Attack | 6 | 10 hasar ver. Ateş: rakip Donmuşsa +5 hasar ve Donma biter. |

### Priest (12)

| id | Ad | Tür | MP | Etki |
|---|---|---|---|---|
| `healing` | Healing | Heal | 1 | 4 HP iyileş. Taşan iyileşme Kalkan olur. |
| `malice` | Malice | Debuff | 1 | Rakibe Zayıflık 2 ver. |
| `light-strike` | Light Strike | Attack | 1 | 3 hasar ver. |
| `massive` | Massive | Debuff | 2 | Rakibe Zayıflık 3 ver. |
| `parasite` | Parasite | Debuff | 2 | Rakibin maks HP'si kalıcı 4 azalır. İyileşmeyle geri gelmez. |
| `helis` | Helis | Attack | 3 | Kalkanı yok sayarak 5 hasar ver. |
| `restore` | Restore | Heal | 3 | 6 HP iyileş, sonra 3 HP daha iyileş. Taşan iyileşme Kalkan olur. |
| `judgement` | Judgement | Attack | 3 | 3 hasar ver. Rakipteki her olumsuz statü (Zayıflık, Zehir, Donma) için +3 hasar. |
| `great-healing` | Great Healing | Heal | 4 | 10 HP iyileş. Taşan iyileşme Kalkan olur. |
| `torment` | ★ Torment | Debuff | 3 | Rakibe Zayıflık 3 ver. 2 hasar ver. |
| `superior-parasite` | ★ Superior Parasite | Debuff | 4 | Rakibin maks HP'si kalıcı 7 azalır. İyileşmeyle geri gelmez. |
| `complete-heal` | ★ Complete Heal | Heal | 4 | 15 HP iyileş. Taşan iyileşme Kalkan olur. |

Maliyet dağılımı: 1 MP ×17 · 2 MP ×15 · 3 MP ×11 · 4 MP ×9 · 5 MP ×1 · 6 MP ×1.
Kart türleri: Attack ×24 · Defense ×5 · Debuff ×13 · Heal ×6 · Buff ×2 · Skill ×4.

Kart mekaniği KO'daki skill etkisine karşılık gelir (Revizyon 1, Yasin 2026-10-07). Gözlem listesi: Gain/Berserker → Hell Blade, Critical Point + büyük kart, Viper + Poison Arrow. Sim ve Yasin testinde izlenir.

## 3. Hazır desteler (önerilen deste = AI destesi)

| Deste | Kartlar | Ağır | 1 MP'lik |
|---|---|---|---|
| Warrior | Slash, Gain, Leg Cutting, Berserker, Iron Skin, Cleave, Howling Sword, Hell Blade, Sword Dancing, Quick Strike, Intimidate, Absoluteness | 2/2 | 5 (en az 3) |
| Rogue · Asas | Stab, Stealth, Thrust, Blinding, Spike, Critical Point, Beast Hiding, Evade, Minor Healing, Quick Strike, Absoluteness, Power Strike | 2/2 | 6 (en az 3) |
| Rogue · Okçu | Poison Arrow, Perfect Arrow, Multiple Shot, Viper, Blinding Strafe, Arrow Shower, Power Shot, Evade, Minor Healing, Absoluteness, Intimidate, Power Strike | 2/2 | 6 (en az 3) |
| Mage | Freeze, Chill, Burn, Fire Ball, Frozen Armor, Lightning, Ice Comet, Freezing Distance, Meteor Fall, Quick Strike, Absoluteness, Intimidate | 2/2 | 6 (en az 3) |
| Priest | Healing, Malice, Light Strike, Massive, Parasite, Judgement, Helis, Great Healing, Torment, Complete Heal, Quick Strike, Absoluteness | 2/2 | 5 (en az 3) |

## 4. AI profilleri (AI ayarı, kural değeri değil)

Skor = ağırlık × ölçüt toplamı. AI gizli bilgiyi görmez (rakibin eli, deste sırası).

| Profil | Rakibe hasar | Kendi hasarı | Kalkan | Rakip Kalkanı | Statü | El | Kritik değeri | Kaçınma değeri | Donma değeri | Boşa iyileşme cezası |
|---|---|---|---|---|---|---|---|---|---|---|
| aggressive (saldırgan) | 3 | 1 | 0.5 | 1 | 1.5 | 0.5 | 6 | 3 | 5 | 10 |
| balanced (dengeli) | 2 | 2 | 1 | 1 | 1 | 0.5 | 5 | 3 | 5 | 10 |
| defensive (savunmacı) | 1.5 | 3 | 1.5 | 0.5 | 1 | 0.5 | 4 | 4 | 4 | 10 |

## 5. AI tur planı (AI ayarı, kural değeri değil)

AI kendi turunda en fazla 4 kart derinliğe, her seviyede en iyi 5 adayı tutarak bakar (ışın araması); planın ilk aksiyonunu oynar, sonra yeniden planlar. Arama gizli bilgisi silinmiş görünümde yapılır.

| Parametre | Dosya | Değer |
|---|---|---|
| Derinlik | `content/ai-planner.json` `depth` | 4 |
| Işın genişliği | `content/ai-planner.json` `beam` | 5 |
