# 05 — Teknoloji Yığını Doğrulaması (Ekim 2026)

> Tarih: 2026-10-05 · Kapsam: F2P Hearthstone tarzı kart savaş oyunu + MMO sistemleri (karakter, ekipman, yükseltme, farm, oyuncu pazarı, takas edilebilir premium para). Platformlar: iOS, Android, PC (Steam), tek kod tabanı. Geliştirme ağırlıklı olarak AI kodlama ajanlarıyla.
>
> Not: Sürüm numaraları Ekim 2026 itibarıyla web aramalarından ve resmi sayfalardan derlendi. Bazı ara sürüm (patch) numaraları üçüncü taraf özet sitelerinden geldi. Kurulumdan önce `pnpm view <paket> version` ile doğrulayın.

---

## 0. Özet: karar tablosu

| Seçim | Karar | Kısa gerekçe |
|---|---|---|
| TypeScript monorepo + paylaşılan deterministik kural motoru | **KORU** | AI ajanları için en uygun model: tek dil, uçtan uca tipler, saf fonksiyonlar test edilebilir. |
| PixiJS (savaş tahtası) | **KORU** (v8.2x) | Phaser'dan hafif. Resmi Spine runtime'ı var, DOM'dan çok daha öngörülebilir. Oyun motoru değil, render katmanı; bu durumda avantaj. |
| React (menüler) | **KORU** (19.x) | Pazar, envanter ve form ağırlıklı UI için doğru araç. Pixi ile **iç içe değil, yan yana** kullanılmalı (aşağıya bakın). |
| @pixi/react | **DEĞİŞTİR → kullanma** | Savaş sahnesini imperatif Pixi + kendi küçük sahne katmanınızla yazın. React yalnızca DOM overlay için. |
| Capacitor (iOS/Android) | **KORU** (8.x) | Olgun eklenti ekosistemi (IAP, push, sosyal giriş). Tauri mobile'a göre çok daha az risk. |
| Tauri (PC/Steam) | **DEĞİŞTİR → Electron** | Steam Overlay Tauri'de hâlâ resmi olarak çözülmüş değil. Linux/Steam Deck'te WebKitGTK'nın WebGL performansı zayıf. Electron + steamworks-ffi-node daha güvenli. |
| Node.js + Colyseus | **KORU** (Colyseus 0.18, Node 24 LTS → 26 LTS) | 0.17/0.18 ile otomatik yeniden bağlanma, uçtan uca tip, QueueRoom, StateView, uWS transport geldi. Ekonomi Colyseus'tan **ayrı** kalmalı. |
| Ayrı ekonomi API (REST veya tRPC) | **KORU, netleştir** → Fastify 5 + tRPC 11 (iç istemci) + Zod | Steam, Apple ve Google webhook'ları için düz REST uçları gerekir. Oyun istemcisi için tRPC. |
| PostgreSQL | **KORU** (18.x; 19 GA'yı birkaç ay bekleyin) | Ledger, escrow ve idempotency için doğru araç. |
| Redis | **DEĞİŞTİR → Valkey** (9.x, BSD-3) | Wire-uyumlu, lisans riski yok. Colyseus RedisPresence/Driver ile çalışır. |
| ORM | **Drizzle** (0.45 stable; 1.0 RC'yi izleyin) | SQL'e yakın, şema TS'de; ajanlar için okunabilir. Ledger sorgularında ham SQL kontrolü kolay. Alternatif: Prisma 7. |
| pnpm + Turborepo | **KORU** (pnpm 11, Turbo 2.11) | pnpm 11'in 24 saatlik "minimum release age" varsayılanı tedarik zinciri güvenliği sağlar. |
| Vitest + Playwright | **KORU** (Vitest 4, Playwright 1.6x) | Vitest 4 Browser Mode stabil. Playwright MCP ile ajanlar UI test edebilir. |
| Auth | **YENİ: Better Auth (self-host) + özel Steam ticket doğrulama** | Clerk ve Supabase Steam session ticket'ı desteklemiyor. Hesap ekonomiyle aynı PG'de olmalı. |
| Nakama | **Seçme** | TS runtime'ı Goja/ES5 ve npm desteği yok. Paylaşılan kural motorunu doğrudan çalıştıramaz. |

**Genel hüküm:** Yön doğru. İki kritik değişiklik var: **Tauri yerine Electron (Steam)** ve **Redis yerine Valkey**. İki mimari netleştirme gerekiyor: **@pixi/react kullanılmayacak** ve **ekonomi servisinin ayrı, tek yazar (single writer) olması**.

---

## 1. Sürüm ve bakım durumu (Ekim 2026)

| Teknoloji | Güncel sürüm | Durum / not |
|---|---|---|
| PixiJS | **8.21.x** (Eyl/Eki 2026) | Çok aktif. 8.16'da deneysel Canvas renderer ve tagged text geldi. 8.19'da HTML-in-Canvas texture eklendi. WebGL/WebGPU desteği var. |
| Phaser | **4.2.1** (Tem 2026) | 4.0 stabil sürümü 10 Nisan 2026'da çıktı. Renderer sıfırdan yazıldı. Aktif. |
| React | **19.2.x / 19.3.0** (Eyl 2026) | React 20 duyurulmadı. Stabil. |
| @pixi/react | 8.0.x | React 19 gerektirir. Bakım hızı düşük. |
| Capacitor | **8.x** (8.5.x civarı) | Aralık 2025'te çıktı. iOS'ta SPM varsayılan, Android'de edge-to-edge SystemBars geldi. Haftada yaklaşık 1M indirme. |
| Tauri | **2.x** (2.10–2.12 serisi) | Masaüstü olgun. Mobil 2.0'dan beri stabil sayılıyor ama eklenti ekosistemi ince. |
| Electron | **44.x** stabil, **45.0** 20 Eki 2026'da | Son 3 major destekleniyor. 8 haftalık döngü. |
| Colyseus | **0.18** (20 Ağu 2026) | 0.17 Şub 2026'da otomatik reconnect, `defineServer()` ve uçtan uca tip getirdi. 0.18'de Schema 5 (yaklaşık 2,4 kat hızlı encoder), request/response mesajlaşma, client-side prediction, `@colyseus/database` (Drizzle tabanlı) ve `@colyseus/admin` (beta) eklendi. Hâlâ 0.x, yani her major'da breaking change bekleyin. |
| Nakama | **3.41** (Eyl 2026) | Aktif, Apache-2. TS runtime'ı Goja ve ES5. |
| tRPC | **11.19.x** | Aktif. 11.16'da type-depth limiti kaldırıldı. |
| Fastify | **5.12.x**; 6.0 alpha'da | Stabil. Node 20+ gerektirir. |
| Hono | **4.13.x** | Aktif. Edge ve çoklu runtime odaklı. |
| Drizzle ORM | **0.45.2** (latest), **1.0.0-rc.x** | 1.0 Nisan'dan beri RC'de. Tip örnekleme sayısında yaklaşık 21 kat azalma var. 1.0 GA bekleniyor. |
| Prisma | **7.x** | Kasım 2025'te Rust'sız TS query compiler'a geçti. |
| PostgreSQL | **18.6** (Ağu 2026); 19 Beta 4 | 19 GA Ekim 2026'da bekleniyor. Prod için 18 kullanın, 19'a ilk minor sürümden sonra geçin. |
| Redis / Valkey | Redis 8.x (AGPLv3/SSPL/RSAL), **Valkey 9.1** (BSD-3) | Valkey Linux Foundation altında, AWS ElastiCache varsayılanı. |
| Node.js | **24 LTS** (20 Eki'de maintenance'a geçiyor), **26** 28 Eki 2026'da Active LTS | Yeni proje için Node 26 LTS hedefleyin. Geçiş döneminde 24 de yeterli. |
| pnpm | **11.x** (Nis 2026) | ESM. Node 22+ gerektirir. Varsayılan 24 saatlik minimum release age, SQLite store ve `pnpm ci` geldi. |
| Turborepo | **2.11.x** | Aktif (Vercel). |
| Vitest | **4.x** | Browser Mode ve görsel regresyon testleri stabil. |
| Playwright | **1.62–1.63** | Test Agents ve Playwright MCP sayesinde AI ajanlarıyla iyi uyum. |
| Spine runtime | spine-pixi-v8 (resmi, Pixi ≥ 8.16), spine-phaser-v4 | Her ikisi de Esoteric tarafından resmi olarak destekleniyor. |

**Bakım uyarıları**
- **Colyseus**: yaklaşık 6 ayda bir major (0.x) sürüm çıkıyor ve migration gerektiriyor. Çözüm: Colyseus'u `apps/realtime` içine hapsedin. Oyun mantığı `packages/rules` içinde Colyseus'tan bağımsız kalsın.
- **Drizzle 1.0**: API değişiklikleri (relational query v2, casing) geliyor. Yeni projeye doğrudan 1.0 RC ile başlamak makul. Alternatif olarak 0.45'te kalıp GA çıkınca geçilebilir.
- **@pixi/react**: düşük commit hızı var, kritik yolda olmamalı.
- **steamworks.js (ceifa)**: bakım yavaş, overlay sorunları açık. Yerine **steamworks-ffi-node** kullanın.
- **Hetzner**: 2026'da iki zam oldu (Nisan ve 15 Haziran; CPX/CCX ailelerinde %100'ün üzerinde). Maliyet tablosunu buna göre güncelleyin.

---

## 2. Savaş tahtası render: PixiJS+React vs Phaser vs saf DOM/CSS

**Bulgular**
- **Saf DOM/CSS**: Az sayıda kart için yeterli. Ancak Hearthstone tarzı efektlerde (saldırı yayları, parçacıklar, ekran sarsıntısı, Spine ile animasyonlu kahramanlar, 30+ eşzamanlı tween) düşük seviye Android WebView'da layout/paint maliyeti öngörülemez hale gelir. Spine'ın resmi bir DOM runtime'ı yok. Pikselden piksele determinizm ve parçacık kontrolü zor.
- **PixiJS v8**: Yalnızca bir renderer. Bundle Phaser'ın yaklaşık 1/3'ü. WebGL2/WebGPU desteği var, 8.16'dan beri Canvas fallback da var. **Resmi `@esotericsoftware/spine-pixi-v8`** runtime'ı (Pixi ≥ 8.16) tüm Spine özelliklerini destekliyor. Parçacıklar için resmi `@pixi/particle-emitter` v8'de çalışmıyor. Topluluk portları var: `@spd789562/particle-emitter` ve `pixi-particle-system`. Not: v8 ParticleContainer'da tüm dokular aynı atlas/TextureSource'tan gelmeli. Metin tarafında bitmap font, tagged text (8.16) ve 8.17'de iyileşmiş text renderer var. HTML-in-Canvas texture (8.19) ise DOM tooltip'lerini sahneye gömmek için ilginç ama deneysel.
- **Phaser 4**: Sahne, tween, input, ses ve kamera hazır geliyor. 4.2'de Mesh2D ve resmi spine-phaser-v4 batching geldi. Dezavantajları: daha büyük bundle, kendi sahne/döngü modeli ve React ile entegrasyonun daha "framework içinde framework" olması. Phaser 3 döneminde düşük seviye Android cihazlarda (ör. Galaxy M04) WebView takılma raporları var. Phaser 4 renderer'ı yeni olduğu için mobil saha verisi henüz az.
- **Bellek**: Her iki motorda da en büyük risk dokulardır. Atlas kullanın, düşük seviye cihazlarda 1x/0.5x çözünürlük seçin, sahne değişiminde `destroy({texture:true})` ile disiplinli temizlik yapın. Spine atlaslarını cihaz sınıfına göre ölçekleyin.

**Mimari öneri (önemli)**
- Pixi savaş sahnesi **imperatif** ve **olay güdümlü** olmalı. `packages/rules` bir `BattleEvent[]` akışı üretir (ör. `CardPlayed`, `DamageDealt`, `MinionDied`). `packages/battle-view` bunları animasyon kuyruğuna (timeline) çevirir. Bu model, AI ajanlarının "olay → animasyon" eşlemelerini küçük dosyalarda test etmesini sağlar.
- React, Pixi canvas'ın **üstünde** bir DOM katmanı olarak çalışır (menü, envanter, pazar, kart detay modalları). @pixi/react kullanmayın. React re-render döngüsünün 60 fps'lik sahneye karışması gereksiz karmaşıklık getirir.
- Animasyon tooling: Spine (karakter ve kahramanlar), GSAP veya Pixi'nin kendi ticker'ı ile tween (GSAP artık ücretsiz lisanslı), parçacık efektleri için JSON konfigürasyonlu emitter (metin tabanlı, ajan dostu).

**Öneri:** **PixiJS v8 + React 19 (DOM overlay) — KORU.** Phaser yalnızca ekip "hazır sahne/tween/input sistemi" isterse alternatiftir. Kart oyununda fizik gerekmediği için Pixi'nin hafifliği kazandırır. Saf DOM'u yalnızca menülerde kullanın.

---

## 3. PC/Steam: Tauri vs Electron

**Bulgular**
- **Steam Overlay**: Steam, overlay'i oyunun kendi süreçteki grafik swapchain'ine hook ederek çizer. Tarayıcı tabanlı kabuklar GPU'yu ayrı bir süreçte kullanır, bu yüzden overlay kendiliğinden çalışmaz.
  - **Tauri**: Resmi issue (#6196) "not planned" olarak kapatıldı. Ekim 2026'da `tauri-plugin-steamworks` **v0.1.0 (4 Ekim 2026)** ve `tauri-plugin-steam-overlay-surface` çıktı. Bunlar overlay için şeffaf, tıklama geçiren bir wgpu penceresi hilesi kullanıyor. Çok yeni ve belgelendirmesi yaklaşık %1. Prod için riskli.
  - **Electron**: `steamworks.js`'in `electronEnableSteamOverlay()` desteği var ama bakımı yavaş ve Linux overlay sorunları açık. **`steamworks-ffi-node`** (Koffi FFI, derleme gerektirmez, Steamworks SDK 1.64) offscreen render + native pencere tekniğiyle Windows, macOS ve Linux/Steam Deck'te (X11) overlay'i test etmiş durumda. Yaklaşık 1 frame gecikme ekliyor. Achievements, stats, leaderboards, cloud, auth ve input API'lerini kapsıyor ve Steam'de yayınlanmış oyunlarda kullanılıyor.
- **Steam Deck/Linux**: Tauri, Linux'ta WebKitGTK kullanır. WebGL/canvas performansı Chromium'un belirgin şekilde gerisinde ve sessizce yazılım rasterizer'a düşebiliyor. Steam Deck en önemli Linux hedefi olduğu için bu ciddi bir risk. Electron her platformda aynı Chromium'u gömer, yani **tek render motoru** (Android WebView ile de aynı Blink ailesi) ve tutarlı test sağlar.
- **Boyut**: Electron yaklaşık 100–150 MB, Tauri yaklaşık 10 MB. Steam oyunu için bu fark önemsiz.
- **Steam mikro-ödemeleri**: Steam sürümünde oyun içi satın alımlar **zorunlu olarak** ISteamMicroTxn (InitTxn/FinalizeTxn) üzerinden Steam Wallet ile yapılmalı. Bu sunucu tarafı bir Web API'dir, kabuk seçiminden bağımsızdır. İstemci yalnızca overlay onay ekranını gösterir (overlay çalışmalı, Electron tercihinin bir nedeni daha).
- **Kimlik**: İstemci `GetAuthTicketForWebApi("sizin-servis-id")` ile ticket alır, sunucu `ISteamUserAuth/AuthenticateUserTicket` (publisher key ile, yalnızca sunucudan) çağırarak SteamID64'ü doğrular.

**Öneri:** **PC için Electron (45.x) + steamworks-ffi-node — DEĞİŞTİR.** Tauri'yi 2027'de yeniden değerlendirin (overlay eklentisi olgunlaşırsa ve WebKitGTK sorunu çözülürse). Electron güvenliği için `contextIsolation`, `sandbox`, kapalı `nodeIntegration`, dar bir `preload` köprüsü ve sabit CSP kullanın. Steam API'si yalnızca main süreçte çalışsın, renderer'a tipli IPC ile açılsın.

---

## 4. Capacitor ile iOS/Android

**Bulgular**
- **IAP**:
  - **RevenueCat** (`@revenuecat/purchases-capacitor` 13.x): Makbuz doğrulama, webhook ve analitik hazır gelir. Gelirin belli bir eşiği aşan kısmından %1 ücret alır. Tüketilebilir premium para için uygundur.
  - **cordova-plugin-purchase v13.15+**: Capacitor için kendi native köprüsü var (StoreKit 2 + Play Billing). Aktif bakımda (2026 sürümleri ve issue'ları mevcut). Ücretsizdir ama sunucu doğrulamasını kendiniz (App Store Server API ve Play Developer API/RTDN) yazarsınız.
  - Oyunun ekonomisi zaten kendi sunucunuzda yaşadığı için **asıl kaynak (source of truth) sizin ledger'ınız** olmalı. RevenueCat yalnızca "satın alma doğrulandı" sinyali ve webhook sağlar. Öneri: Lansmanda **RevenueCat** (hız, daha az hata). Ölçek büyüyünce kendi doğrulamanıza geçiş yolu açık kalsın (ödeme adaptörü arayüzü `packages/payments` içinde).
- **Push**: `@capacitor/push-notifications` (APNs/FCM) veya `@capacitor-firebase/messaging`. Sunucuda FCM HTTP v1 kullanın.
- **Sosyal giriş**: `@capgo/capacitor-social-login` (Apple, Google) + Better Auth `signIn.social` ile idToken akışı belgelenmiş durumda.
- **WebView performansı**: Android System WebView, Play Store üzerinden güncellenen Chromium'dur. Modern cihazlarda iyi, eski GPU'larda ise WebGL zorlanır ve WebView'i değiştirme imkânı yoktur. Önlemler: 30 fps "düşük mod", `resolution` ölçekleme, atlas boyutu sınırı, `antialias:false`. iOS'ta WKWebView kullanılır ve WebGL2 iyi durumdadır.
- **App Store incelemesi**:
  - **4.2 (minimum işlevsellik)**: Uzaktan site yükleyen (`server.url`) sarmalayıcılar reddediliyor. Oyun varlıklarını **bundle içinde** gönderin, yalnızca veri/API uzaktan gelsin. Native IAP, push ve Game Center gibi özellikler de yardımcı olur.
  - **3.1.1**: Dijital içerik ve oyun içi para mutlaka IAP ile satılmalı. IAP ile alınan para **süresi dolmamalı**. Oyun içi para gerçek paraya **çevrilemez (cash-out yok)**.
  - **Takas edilebilir premium para**: Oyuncular arası pazar Apple ve Google'a göre kabul edilebilir, **ancak** oyun dışı gerçek para karşılığı satışa (RMT) imkân veren bir akış veya çekim (withdrawal) olursa 5.3 (kumar) ve Play Payments politikalarıyla çatışır. Google Play: "Sanal para yalnızca satın alındığı oyunda kullanılmalı", P2P ödeme için Play Billing kullanılamaz. Ayrıca loot box'lar için olasılık açıklaması zorunludur (Apple 3.1.1, Google Play).
  - Hukuki not: Takas edilebilir premium para, bazı ülkelerde (ör. Güney Kore, Çin, AB tüketici kuralları) ek düzenlemelere tabi olabilir. Ayrı bir hukuki inceleme önerilir.
- **Tauri mobile** alternatifi: IAP eklentileri (tauri-plugin-iap vb.) topluluk projeleri ve genç. Capacitor çok daha olgun.

**Öneri:** **Capacitor 8 — KORU.** Varlıkları bundle'layın, live-update için Capgo/Appflow kullanmayı yalnızca JS/varlık güncellemesi kurallarına uyarak değerlendirin. RevenueCat ile başlayın.

---

## 5. Realtime: Colyseus vs Nakama vs özel uWebSockets.js

**Bulgular**
- **Colyseus 0.18 (MIT)**:
  - Otoriter oda modeli, TS. Paylaşılan `packages/rules` doğrudan oda içinde çalışır (en büyük artı).
  - 0.17 ile `onDrop`/`onReconnect`/`onLeave` yaşam döngüsü ve istemcide otomatik reconnect geldi. Callback'ler ve state listener'lar korunuyor.
  - `QueueRoom` ile kuyruk tabanlı eşleştirme, `maxMessagesPerSecond` ile hız sınırı ve `room.ping()` var.
  - Ölçekleme: Her oda tek bir sürece aittir. `RedisPresence` + `RedisDriver` (Valkey ile uyumlu) ile çok süreç/çok makine çalışır. Her süreç kendi `publicAddress`'iyle doğrudan bağlantı alır (PM2 cluster modu **kullanılmaz**). Önde NGINX veya Traefik bulunur.
  - Transport: `@colyseus/uwebsockets-transport` prod için önerilir.
  - Büyük odalar (nation-war): `StateView` ile ilgi alanı yönetimi (her oyuncu yalnızca görmesi gerekeni alır). 0.18'de `view.subscribe` ve deneysel streaming koleksiyonlar var.
  - Riskler: 0.x sürümleme. Tek oda tek çekirdeğe bağlı (Node tek iş parçacığı), bu yüzden yüzlerce oyunculu tek oda sınırlıdır.
- **Nakama (Apache-2, Go)**: Eşleştirme, parti, sohbet, lider tablosu, IAP doğrulama ve kimlik hazır gelir. **Ancak** TS runtime'ı Goja ile **yalnızca ES5** destekler: npm/Node kütüphanesi yok, global state yok. Paylaşılan modern TS kural motorunu derlemek mümkün olsa da kısıtlı ve test döngüsü ayrı. Ekonomi, ledger ve pazar mantığı Nakama'nın storage modeline zorlanır. Tercih edilmez.
- **Özel uWebSockets.js**: Maksimum performans ve kontrol sağlar, ama reconnect, seat reservation, oda dağıtımı, state delta ve eşleştirmeyi yeniden yazmak gerekir. AI ajanlarıyla bile bakım yükü yüksek. Colyseus zaten uWS transport'u kullanabildiği için ilk aşamada gereksiz.

**Nation-war için mimari**
- Tek dev oda yerine **parçalı (sharded) savaş**: bir "Savaş Koordinatörü" odası (skor, cephe durumu) ve birçok "Cephe/Çatışma" odası (her biri 1v1, 3v3 veya 10v10 gibi küçük kart savaşları). Koordinatör ile cephe odaları arasında Valkey pub/sub (Colyseus presence) veya ekonomi API üzerinden olay kullanılır.
- Kart oyunu sıra tabanlı olduğu için tick hızı düşüktür (yalnızca olay güdümlü). Tek süreç binlerce eşzamanlı 1v1 odası taşıyabilir. Kesin CCU'yu yük testiyle (k6 veya Artillery + Colyseus loadtest) ölçün.

**Öneri:** **Colyseus 0.18 + uWS transport + Valkey presence/driver — KORU.** Kural motoru Colyseus'a bağımlı olmasın: oda yalnızca `rules.apply(state, action) → {state, events}` çağırsın. Böylece ileride Colyseus'tan çıkış maliyeti düşük kalır. Colyseus'un kendi auth ve `@colyseus/database` modüllerini **ekonomi için kullanmayın**. Ekonomi ayrı servis olsun.

---

## 6. Ekonomi bütünlüğü ve auth

### 6.1 PostgreSQL desenleri (pazar, escrow, çift harcama önleme)

1. **Çift kayıtlı (double-entry) ledger**
   - `ledger_entries(id, tx_id, account_id, currency, amount bigint, created_at)`: Her işlemde girdilerin toplamı 0'dır. Tablo **append-only**: UPDATE/DELETE yasak, düzeltme ters kayıtla yapılır.
   - `accounts(id, owner_type, owner_id, currency)`: Sistem hesapları (`mint:iap`, `sink:fees`, `escrow:market`) dahil.
   - Bakiye ya `ledger_entries` toplamından türetilir ya da `account_balances(account_id, balance, version)` önbelleği aynı transaction'da güncellenir ve gece mutabakat (reconciliation) işiyle doğrulanır.
   - DB kısıtı `CHECK (balance >= 0)` negatif bakiyeyi engeller.
   - Para birimleri tamsayıdır (bigint, en küçük birim). Float asla kullanılmaz.
2. **Eşya sahipliği**
   - `items(id uuid, owner_account_id, template_id, state ['owned','escrowed','consumed'], version)`. Her benzersiz eşyanın tek satırı vardır, sahiplik değişimi bir UPDATE işlemidir.
   - Ayrıca `item_events` olay günlüğü (append-only) tutulur.
   - Stacklenebilir eşyalar (malzeme) ledger gibi davranır.
3. **Escrow akışı (ilan → satın alma)**
   - **İlan**: Tek transaction'da `items.state='escrowed'` olur (`WHERE owner=seller AND state='owned' AND version=$v`). Etkilenen satır sayısı 1 değilse işlem reddedilir. Ardından `listings` satırı eklenir.
   - **Satın alma**: Tek transaction'da `SELECT ... FROM listings WHERE id=$1 AND status='active' FOR UPDATE` çalışır. Ardından alıcı bakiyesi düşülür, satıcıya bakiye (eksi komisyon) eklenir ve komisyon `sink:fees`'e gider (ledger). Sonra `items.owner = buyer, state='owned'` ve `listings.status='sold'` yapılır. Hepsi ya birlikte commit olur ya hiçbiri.
   - Kilit sırası deterministik olmalı (ör. account_id artan sırada). Böylece deadlock önlenir. `40001`/`40P01` hatalarında sınırlı sayıda yeniden deneme yapılır.
   - İzolasyon: `READ COMMITTED` + açık `FOR UPDATE` + koşullu UPDATE (optimistic `version`) yeterli ve öngörülebilirdir. Karmaşık çok tablolu kurallar için `SERIALIZABLE` + retry kullanılabilir.
4. **Idempotency**
   - Her mutasyon isteği istemci tarafından üretilmiş bir `Idempotency-Key` (UUIDv7) taşır.
   - `idempotency_keys(user_id, key, request_hash, response jsonb, created_at)` tablosuna `INSERT ... ON CONFLICT DO NOTHING` ile anahtar talep edilir. Anahtar talebi, para hareketi ve saklanan yanıt **aynı transaction'da** commit olur. Tekrarlanan istek kayıtlı yanıtı döner.
   - Aynı yaklaşım IAP makbuzları için de geçerli: `UNIQUE(store, store_transaction_id)`. Böylece aynı makbuzla iki kez para basılamaz. Steam `orderid` ve Apple `originalTransactionId`/`transactionId` için de aynısı uygulanır.
5. **Transactional outbox**
   - Ekonomi olayları (ör. "eşya satıldı" bildirimi, analitik) aynı transaction'da `outbox` tablosuna yazılır. Bir worker bunları `FOR UPDATE SKIP LOCKED` ile okuyup Valkey, push veya Colyseus'a iletir. Böylece dual-write sorunu oluşmaz.
6. **Savaş ödülleri**
   - Colyseus odası maç sonunda ekonomi API'sine **imzalı ve idempotent** bir `MatchResult` gönderir (`match_id` benzersizdir). Ödülleri yalnızca ekonomi servisi yazar (**tek yazar ilkesi**). Colyseus asla doğrudan bakiye değiştirmez.
7. **Denetim ve hile tespiti**
   - Takas edilebilir premium para RMT ve kara para aklama vektörüdür. Önlemler:
     - Pazarda fiyat bantları
     - Yeni hesaplara takas bekleme süresi
     - Günlük transfer limiti
     - `ledger` üzerinde anomali sorguları (dairesel transfer, tek yönlü akış)
     - Para iadesi (refund/chargeback) webhook'u gelince ledger'da ters kayıt + hesap borcu (negatif bakiyeye izin veren `debt` hesabı)

### 6.2 Auth

- **Clerk**: Steam ticket doğrulamasını desteklemiyor, kullanıcı başına maliyeti var ve kimlik verisi dışarıda tutuluyor. Oyun için uygun değil.
- **Supabase Auth**: Apple/Google için iyi, ama Steam desteği yok. Ayrıca DB/ekonomi ile tek Postgres'e bağlanmak cazip olsa da Supabase platformuna kilitlenme getirir.
- **Önerilen**: **Better Auth 1.x (self-host, TS, aynı PostgreSQL)**. Auth.js 2026'da Better Auth bünyesine katıldı ve aktif geliştirme Better Auth'ta.
  - Apple/Google: Native plugin ile alınan idToken `signIn.social` ile doğrulanır.
  - Steam: Özel bir Better Auth eklentisi veya ayrı bir uç yazılır. İstemci `GetAuthTicketForWebApi` ticket'ını gönderir, sunucu `AuthenticateUserTicket` ile SteamID64'ü doğrular ve oturum açar. Ek olarak `ISteamUser/CheckAppOwnership` kontrolü yapılabilir.
  - Hesap bağlama (aynı oyuncu mobil ve Steam'de): `identities(user_id, provider, provider_user_id)` tablosu. Apple zorunluluğu: Üçüncü taraf girişi sunan iOS uygulaması "Sign in with Apple" da sunmalı.
  - Colyseus'a giriş: Ekonomi/auth servisi kısa ömürlü (ör. 60 sn) bir **oda bileti (JWT)** üretir. Colyseus `onAuth` içinde bunu doğrular.
- Güvenlik notu: Better Auth Haziran 2026'da bir güvenlik güncellemesi yayımladı. Sürümleri sabitleyip güncel tutun.

**Öneri:** Ekonomi = ayrı Fastify servisi, tek yazar, double-entry ledger, idempotency + outbox. Auth = Better Auth + özel Steam doğrulama.

---

## 7. Barındırma, maliyet ve anti-cheat

### 7.1 Barındırma (küçük lansman: yaklaşık 1–5k DAU, birkaç yüz CCU)

| Seçenek | Yaklaşık aylık | Artı | Eksi |
|---|---|---|---|
| **Hetzner (Cloud/dedicated) + kendi yönetimi** | 2026 zamlarından sonra 4–8 vCPU için yaklaşık €20–60 (CX/CAX hâlâ ucuz; CPX/CCX ciddi zamlandı) | En ucuz ham güç, AB veri merkezleri (Türkiye'ye yakın, Falkenstein/Helsinki). | Yönetilen PG yok. Yedekleme, güncelleme ve izleme sizde. Fiyatlar değişken. |
| **Fly.io** | Makineler yaklaşık $2–18 (shared), yönetilen PG $38–72 (Basic/Starter) | Bölgesel dağıtım, kolay deploy, WebSocket desteği iyi. | Yönetilen PG pahalı. Colyseus `publicAddress` modeli için makine başına adres ayarı gerekir. |
| Railway | Kullanıma göre, düşük | Çok kolay, AI ajan dostu (config-as-code). | Büyük ölçekte maliyet ve kontrol sınırlı. |
| AWS | Yüksek | Her şey var (ElastiCache Valkey, RDS). | Karmaşık ve pahalı. Lansman için fazla. |
| Colyseus Cloud | Yaklaşık $15'tan başlıyor | Colyseus ölçekleme ve dağıtım hazır. | Yalnızca realtime katmanı. Kilitlenme riski. |

**Öneri (lansman)**
- Realtime + API: **Hetzner** üzerinde 2–3 CAX/CX makinesi (Docker Compose veya k3s/Coolify/Kamal ile).
- PostgreSQL: Yönetilen bir servis (ör. Neon/Crunchy/Aiven veya Hetzner'da CloudNativePG + offsite WAL yedeği, pgBackRest ile S3'e).
- Valkey: Tek düğüm, AOF açık.
- CDN: Cloudflare (statik varlıklar ve DDoS koruması). WebSocket'ler Cloudflare proxy'den geçebilir.
- Toplam maliyet hedefi: yaklaşık **€100–250/ay**.
- Her şey IaC/metin olmalı (Docker Compose/Kamal + `infra/` klasörü), ajanların okuyup değiştirebileceği şekilde.

### 7.2 Anti-cheat (web teknolojisi istemci)

İstemci tamamen açık kabul edilmeli (JS ve WebView kolayca incelenir).

1. **Sunucu otoritesi**:
   - Deste, el, çekme sırası ve RNG **yalnızca sunucuda** yaşar.
   - İstemciye rakibin eli ve deste sırası **asla** gönderilmez. Colyseus `StateView` ve `@view()` ile oyuncu başına filtreleme yapılır.
   - RNG: Sunucu tohumu (seed) ile deterministik PRNG (ör. xoshiro128) kullanılır. Seed maç sonuna kadar gizli kalır, maç sonunda replay/denetim için loglanır.
2. **İstemci yalnızca niyet (intent) gönderir**, ör. `PlayCard{cardInstanceId, target}`. Sunucu `rules.validate` ile doğrular.
3. **Ekonomi**: Tüm hesaplamalar (yükseltme şansı, drop, craft) sunucuda yapılır. İstemcideki formüller yalnızca gösterim içindir.
4. Hız sınırı (Colyseus `maxMessagesPerSecond`, API rate limit) ve bot/farm tespiti (aksiyon zamanlaması istatistikleri, sunucu loglarında anomali).
5. **Platform kanıtı**: iOS App Attest / DeviceCheck, Android Play Integrity API, Steam ticket + ownership. Bunlar "değiştirilmiş istemci" riskini azaltır, sıfırlamaz.
6. Replay: `BattleEvent` günlüğü + seed ile her maç sunucuda yeniden oynatılıp doğrulanabilir. Şüpheli maç ödülleri bekletilebilir.
7. Kod gizleme (obfuscation) yalnızca caydırıcıdır, güvenliğe dahil edilmemeli.

---

## 8. Monorepo düzeni (AI ajanları için optimize)

**İlkeler**
- **Katı katmanlar**: `rules` hiçbir şeye bağımlı değildir (DOM, Node, Pixi, Colyseus yok; saf TS). Bağımlılık yönü dependency-cruiser veya Turborepo `boundaries` ile CI'da zorlanır.
- **Küçük dosyalar**: Bir kart efekti veya bir formül tek dosyada (yaklaşık 150 satırın altında) olur ve yanında `*.test.ts` bulunur.
- **Veri metin olarak**: Kart, eşya ve drop tabloları `content/` altında JSON/YAML + Zod şeması şeklinde tutulur. Ajanlar oyun içeriğini kod gibi düzenler ve CI şema doğrulaması yapar.
- **Strict TS**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`. `any` lint ile yasaklanır.
- **Test önce**: `rules` için property-based testler (fast-check) ve altın replay testleri (`seed + actions → beklenen events` snapshot). Determinizm testi aynı girdinin hem Node'da hem tarayıcıda (Vitest browser) aynı hash'i üretmesini kontrol eder.
- **Kurallarda determinizm**: `Math.random`, `Date.now` ve `Map` sırasına bağımlılık yasaktır (lint kuralı). Formüllerde float yerine tamsayı/sabit nokta kullanılır (`(base * pct) / 100` gibi). Yükseltme şansları "basis point" (10000 = %100) cinsindendir.
- Her pakette `AGENTS.md`/`CLAUDE.md`: amaç, açık API, yasaklar ve test komutu.

```
repo/
├─ AGENTS.md                    # global ajan kuralları (komutlar, sınırlar, kod stili)
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.base.json           # strict ayarlar
├─ biome.json | eslint.config.js
├─ .dependency-cruiser.cjs      # katman sınırları
├─ content/                     # oyun verisi (JSON/YAML), ajanlarca düzenlenir
│  ├─ cards/                    # kart başına bir dosya: fireball.json
│  ├─ items/
│  ├─ drop-tables/
│  └─ upgrade-rates/
├─ packages/
│  ├─ rules/                    # SAF deterministik motor (bağımlılık yok)
│  │  ├─ src/state/             # BattleState tipleri
│  │  ├─ src/actions/           # intent tipleri + validate
│  │  ├─ src/effects/           # kart efektleri, dosya başına bir efekt
│  │  ├─ src/rng/               # seed'li PRNG
│  │  ├─ src/formulas/          # hasar, yükseltme şansı (bps)
│  │  └─ src/engine.ts          # apply(state, action) -> {state, events}
│  ├─ content-schema/           # Zod şemaları + content derleyici/doğrulayıcı
│  ├─ protocol/                 # Colyseus mesaj tipleri, BattleEvent, API DTO'ları (Zod)
│  ├─ economy-core/             # saf ekonomi kuralları (komisyon, limitler), DB'siz
│  ├─ db/                       # Drizzle şema + migration'lar + ledger yardımcıları
│  ├─ battle-view/              # Pixi sahnesi: events -> animasyon timeline
│  ├─ ui/                       # React bileşenleri (menü, envanter, pazar)
│  ├─ client-core/              # API/Colyseus istemcileri, state store (Zustand), servisler
│  ├─ payments/                 # ödeme adaptörü arayüzü (RevenueCat, Steam MicroTxn, store doğrulama)
│  ├─ platform/                 # Platform arayüzü + adaptörler
│  │  ├─ src/types.ts           # IPlatform: purchases, auth, push, achievements
│  │  ├─ capacitor/
│  │  ├─ electron/              # preload köprüsü tipleri
│  │  └─ web/                   # dev/test için sahte (mock) platform
│  └─ test-kit/                 # fixture'lar, replay araçları, fast-check generator'ları
├─ apps/
│  ├─ client/                   # Vite + React + Pixi giriş noktası (tüm platformlar için tek build)
│  ├─ mobile/                   # Capacitor projesi (ios/, android/), apps/client build'ini paketler
│  ├─ desktop/                  # Electron main + preload + steamworks-ffi-node
│  ├─ realtime/                 # Colyseus 0.18 sunucusu (rooms/, matchmaking/)
│  ├─ economy-api/              # Fastify 5 + tRPC 11 + REST webhook'lar (IAP, Steam MicroTxn)
│  ├─ workers/                  # outbox işleyici, mutabakat, zamanlanmış işler
│  └─ admin/                    # (sonra) iç yönetim paneli
├─ tools/
│  ├─ loadtest/                 # Colyseus loadtest / k6 senaryoları
│  ├─ sim/                      # AI-vs-AI toplu simülasyon (denge testleri, rules üzerinde)
│  └─ codegen/                  # content -> TS tipleri
├─ infra/                       # docker-compose, Kamal/k8s manifestleri, IaC
└─ e2e/                         # Playwright (UI akışları), Vitest browser (render smoke)
```

**Bağımlılık kuralları (özet)**
- `rules`, `content-schema` ve `economy-core` hiçbir şeye bağımlı değildir (yalnızca birbirlerine ve `zod`'a).
- `protocol`, `rules` tiplerini kullanabilir.
- `battle-view`, `rules` ve `protocol`'ü kullanır. React'e bağımlı **değildir**.
- `ui` React kullanır. `battle-view`'i yalnızca mount noktası üzerinden kullanır.
- `apps/*` her şeyi kullanabilir. `packages/*` asla `apps/*`'ı import etmez.
- `db` yalnızca `economy-api` ve `workers` tarafından import edilir (`realtime` DB'ye **doğrudan yazmaz**).

---

## 9. Önerilen teknoloji yığını

| Katman | Seçim | Sürüm (Eki 2026) | Neden | Alternatif |
|---|---|---|---|---|
| Dil | TypeScript (strict) | 5.9 / 6.x | Tek dil, uçtan uca tip, ajan dostu | — |
| Runtime (sunucu) | Node.js | 24 LTS → **26 LTS** (28 Eki 2026) | Colyseus ve uWS uyumu, uzun destek | Bun (Colyseus'ta resmi destek sınırlı) |
| Paket yöneticisi | pnpm | 11.x | Hızlı, workspace, tedarik zinciri korumaları | npm/Bun |
| Monorepo | Turborepo | 2.11.x | Basit, önbellekli görev grafiği | Nx (daha ağır) |
| Kural motoru | Kendi `packages/rules` (saf TS) | — | Sunucu otoritesi + istemci tahmini için aynı kod | — |
| Şema/doğrulama | Zod | 4.x | Content, protokol ve API için tek kaynak | Valibot, ArkType |
| Savaş render | PixiJS | 8.21.x | Hafif, WebGL2/WebGPU, resmi Spine | Phaser 4.2 |
| İskelet animasyon | Spine + `@esotericsoftware/spine-pixi-v8` | 4.2/4.3 | Resmi runtime, endüstri standardı | DragonBones (bakımı zayıf) |
| Parçacık | `@spd789562/particle-emitter` veya `pixi-particle-system` | v8 uyumlu | JSON config, ParticleContainer | Kendi basit emitter'ınız |
| Tween | GSAP | 3.x | Ücretsiz, olgun, timeline | Pixi ticker + kendi easing |
| UI | React | 19.2/19.3 | Menü, envanter, pazar | Solid, Preact |
| İstemci state | Zustand + TanStack Query (tRPC ile) | 5.x | Basit, test edilebilir | Redux Toolkit |
| Bundler | Vite | 7.x | Hızlı, Vitest ile ortak config | Rsbuild |
| Mobil kabuk | Capacitor | 8.x | Olgun eklentiler, IAP/push/sosyal giriş | Tauri 2 mobile (genç) |
| IAP | RevenueCat (`@revenuecat/purchases-capacitor`) | 13.x | Hızlı doğrulama, webhook | cordova-plugin-purchase 13.15+ (ücretsiz) |
| Push | `@capacitor/push-notifications` + FCM v1 | 8.x | Resmi | OneSignal |
| PC kabuk | **Electron** | 44.x / 45.x | Tutarlı Chromium (Steam Deck), overlay çözümü | Tauri 2 + tauri-plugin-steamworks (2027'de tekrar bakın) |
| Steamworks | steamworks-ffi-node | SDK 1.64 | Aktif bakım, overlay (Win/mac/Linux X11), FFI | steamworks.js |
| Realtime | Colyseus + uWS transport | 0.18.x | TS, otoriter odalar, reconnect, StateView | Nakama (ES5 runtime), kendi uWS sunucunuz |
| Ekonomi API | Fastify + tRPC (+ REST webhook) | 5.12 / 11.19 | Olgun, hızlı, eklenti ekosistemi | Hono 4.13 |
| ORM | Drizzle | 0.45 → 1.0 (RC) | SQL'e yakın, TS şema, ledger için ham SQL kolay | Prisma 7, Kysely |
| Veritabanı | PostgreSQL | 18.x | ACID, ledger/escrow, JSONB | — |
| Önbellek/pubsub | **Valkey** | 9.1 | BSD-3, Redis wire uyumu | Redis 8 (AGPL/SSPL) |
| Auth | Better Auth + özel Steam ticket doğrulama | 1.7.x | Self-host, aynı PG, Apple/Google native idToken | Supabase Auth, kendi yazdığınız |
| Birim/entegrasyon test | Vitest (+ fast-check) | 4.x | Hızlı, browser mode | — |
| E2E | Playwright | 1.63 | MCP ve Test Agents ile AI dostu | — |
| Lint/format | Biome (veya ESLint 9 + typescript-eslint) | 2.x | Hızlı, tek araç | — |
| Barındırma | Hetzner + yönetilen PG + Cloudflare | — | Maliyet/performans | Fly.io, Railway |
| Gözlemlenebilirlik | OpenTelemetry + Grafana/Loki + Sentry | — | Standart, metin config | Datadog |

---

## 10. İlk adımlar (öncelik sırası)

1. `packages/rules` + `packages/content-schema` + replay testleri (oyunun kalbi).
2. `apps/realtime` (Colyseus odası, yalnızca `rules` çağırır) + `apps/client` (Pixi savaş görünümü) ile PvE dikey dilim.
3. `apps/economy-api` + `packages/db` (ledger, idempotency, outbox) ve buna karşı eşzamanlılık testleri (aynı ilanı 50 paralel alıcı → yalnızca 1 başarılı).
4. Platform adaptörleri: önce web/mock, sonra Capacitor (IAP sandbox), sonra Electron + Steam (overlay + MicroTxn sandbox).
5. Düşük seviye Android cihaz (ör. 3–4 GB RAM, Mali GPU) üzerinde erken performans bütçesi testi.

---

## Kaynaklar

- PixiJS sürümleri: https://github.com/pixijs/pixijs/releases · https://pixijs.com/blog · https://pixijs.com/blog/8.16.0 · https://pixijs.com/8.x/guides/concepts/performance-tips
- PixiJS React v8: https://pixijs.com/blog/pixi-react-v8-live
- Spine Pixi v8: https://esotericsoftware.com/blog/spine-pixi-v8-runtime-released · https://en.esotericsoftware.com/spine-pixi
- Pixi v8 parçacık: https://github.com/spd789562/pixi-v8-particle-emitter · https://github.com/danielpokladek/pixi-particle-system · https://pixijs.com/blog/particlecontainer-v8
- Phaser 4: https://phaser.io/download/stable · https://phaser.io/news/2026/06/phaser-v4-2-0-released · https://phaser.io/news/2026/07/phaser-4-2-spine-renderer-mesh2d-stencil · https://github.com/phaserjs/phaser/issues/6989
- Phaser vs Pixi: https://generalistprogrammer.com/comparisons/phaser-vs-pixijs
- React: https://github.com/react/react/releases/tag/v19.2.8 · https://blog.codercops.com/blog/react-19-2-vs-react-20-explained
- Capacitor 8: https://ionic.io/blog/announcing-capacitor-8 · https://capacitorjs.com/docs/guides/games · https://abratabia.com/native-wrappers/
- Tauri: https://v2.tauri.app/release/tauri/ · https://github.com/tauri-apps/tauri/issues/6196 · https://v2.tauri.app/develop/debug/linux-graphics/ · https://github.com/tauri-apps/wry/issues/1315 · https://docs.rs/tauri-plugin-steamworks/latest/tauri_plugin_steamworks/ · https://crates.io/crates/tauri-plugin-steam-overlay-surface · https://github.com/Choochmeque/tauri-plugin-iap
- Electron: https://releases.electronjs.org/schedule · https://endoflife.date/electron
- Steamworks (JS): https://github.com/ceifa/steamworks.js/ · https://github.com/ceifa/steamworks.js/issues/195 · https://github.com/ArtyProf/steamworks-ffi-node · https://github.com/ArtyProf/steamworks-ffi-node/blob/main/docs/STEAM_OVERLAY_INTEGRATION.md
- Steamworks resmi: https://partner.steamgames.com/doc/features/auth · https://partner.steamgames.com/doc/webapi/isteamuserauth · https://partner.steamgames.com/doc/features/microtransactions · https://partner.steamgames.com/doc/webapi/ISteamMicroTxn
- IAP: https://www.npmjs.com/package/@revenuecat/purchases-capacitor · https://github.com/RevenueCat/purchases-capacitor/releases · https://github.com/j3k0/cordova-plugin-purchase/releases · https://purchase.cordova.fovea.cc/setup/setup-capacitor
- App Store/Play politikaları: https://developer.apple.com/app-store/review/guidelines/ · https://www.mobiloud.com/blog/app-store-review-guidelines-webview-wrapper/ · https://support.google.com/googleplay/android-developer/answer/9858738 · https://support.google.com/googleplay/android-developer/answer/10281818
- Auth: https://better-auth.com/blog/authjs-joins-better-auth · https://better-auth.com/blog/security-update-june-2026 · https://capgo.app/docs/plugins/social-login/better-auth/ · https://capawesome.io/blog/how-to-use-better-auth-in-capacitor-apps/
- Colyseus: https://colyseus.io/blog/ · https://colyseus.io/blog/colyseus-017-is-here/ · https://colyseus.io/blog/colyseus-018-is-here/ · https://docs.colyseus.io/scalability · https://docs.colyseus.io/server/transport/uwebsockets
- Nakama: https://heroiclabs.com/docs/nakama/getting-started/release-notes/ · https://heroiclabs.com/docs/nakama/server-framework/typescript-runtime/
- tRPC: https://github.com/trpc/trpc/releases · Fastify: https://www.npmjs.com/package/fastify · Hono: https://github.com/honojs/hono/releases
- Drizzle: https://github.com/drizzle-team/drizzle-orm/releases · https://orm.drizzle.team/ · Prisma 7: https://www.prisma.io/blog/announcing-prisma-orm-7-0-0
- PostgreSQL: https://endoflife.date/postgresql · https://www.postgresql.org/about/news/postgresql-19-beta-4-released-3386/
- Valkey/Redis: https://redisvsmemcached.com/redis-license-timeline/ · https://www.cloudmagazin.com/en/2026/04/10/valkey-9-redis-fork-cloud-cache-landscape/
- Node.js: https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule · https://bex.co/blog/2026/09/26/node-26-active-lts-builder-default-bump-git-push-paas
- pnpm 11: https://www.infoq.com/news/2026/04/pnpm-11-rc-release/ · https://socket.dev/blog/pnpm-11-adds-new-supply-chain-protection-defaults
- Turborepo: https://github.com/vercel/turborepo/releases · Vitest 4: https://voidzero.dev/posts/announcing-vitest-4 · Playwright: https://github.com/microsoft/playwright
- Ledger desenleri: https://github.com/Arjun-B-J/payments-ledger · https://github.com/MickaelGeronimo/omniflow · https://www.martinrichards.me/post/ledger_p1_optimistic_locking_real_time_ledger/
- Barındırma: https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/ · https://northflank.com/blog/hetzner-cloud-server-price-increases · https://fly.io/pricing/ · https://northflank.com/blog/railway-vs-flyio
