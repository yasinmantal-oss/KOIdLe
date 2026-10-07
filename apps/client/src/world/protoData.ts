/**
 * TASARIM PROTOTİPİ YER TUTUCU VERİSİ — OYUN İÇERİĞİ DEĞİLDİR.
 *
 * Bu dosyadaki item, slot, drop, isim ve sayılar yalnız "dünya" ekranlarını (Sınır haritası, farm,
 * baskın, Örs, Tezgâh, Karakter) canlı göstermek için uydurulmuş çalışma değerleridir. Denge
 * çalışması yapılmadı; spec'e ve `content/` JSON'larına geçmez. Savaş kuralı değerleri yalnız
 * `content/` altındadır ve buradaki hiçbir sayı savaşın sonucunu değiştirmez.
 * İsimler çalışma ismidir (Knight Online adı kullanılmaz).
 */
import type { ArchetypeId } from '@koidle/content-schema';

export type Rarity = 'common' | 'magic' | 'rare' | 'unique';
export type GearSlot = 'weapon' | 'armor' | 'accessory';
export type Risk = 'low' | 'mid' | 'high' | 'deadly';

export interface ItemDef {
  id: string;
  name: string;
  slot: GearSlot;
  rarity: Rarity;
  icon: string;
  /** Dünya statları (yalnız gösterim): Güç ve HP. */
  power: number;
  hp: number;
  /** Kısa tat metni; mekanik değildir. */
  flavor: string;
}

export const RARITY_TR: Record<Rarity, string> = {
  common: 'Sıradan',
  magic: 'Büyülü',
  rare: 'Nadir',
  unique: 'Eşsiz',
};

export const SLOT_TR: Record<GearSlot, string> = {
  weapon: 'Silah',
  armor: 'Zırh',
  accessory: 'Aksesuar',
};

export const ITEMS: ItemDef[] = [
  {
    id: 'pasli-kilic',
    name: 'Paslı Kılıç',
    slot: 'weapon',
    rarity: 'common',
    icon: '🗡️',
    power: 8,
    hp: 0,
    flavor: 'Kasabanın demircisinden, ikinci el.',
  },
  {
    id: 'cift-balta',
    name: 'Çift Ağızlı Balta',
    slot: 'weapon',
    rarity: 'common',
    icon: '🪓',
    power: 10,
    hp: 0,
    flavor: 'Ağır ama dürüst.',
  },
  {
    id: 'avci-yayi',
    name: 'Avcı Yayı',
    slot: 'weapon',
    rarity: 'magic',
    icon: '🏹',
    power: 14,
    hp: 0,
    flavor: 'Kirişi hiç gevşemez.',
  },
  {
    id: 'golge-hanceri',
    name: 'Gölge Hançeri',
    slot: 'weapon',
    rarity: 'rare',
    icon: '🔪',
    power: 20,
    hp: 0,
    flavor: 'Işıkta görünmez gibi.',
  },
  {
    id: 'kartalpence',
    name: 'Kartalpençe',
    slot: 'weapon',
    rarity: 'rare',
    icon: '⚔️',
    power: 22,
    hp: 0,
    flavor: 'Demir Tepe ustalarının işi.',
  },
  {
    id: 'kor-disi',
    name: 'Kor Dişi',
    slot: 'weapon',
    rarity: 'unique',
    icon: '🔥',
    power: 30,
    hp: 0,
    flavor: 'Kınından çıkınca hava ısınır.',
  },
  {
    id: 'deri-yelek',
    name: 'Deri Yelek',
    slot: 'armor',
    rarity: 'common',
    icon: '🦺',
    power: 0,
    hp: 20,
    flavor: 'Çizik tutar, kılıç tutmaz.',
  },
  {
    id: 'kurt-postu',
    name: 'Kurt Postu',
    slot: 'armor',
    rarity: 'magic',
    icon: '🐺',
    power: 0,
    hp: 30,
    flavor: 'Kara Orman kurtlarından.',
  },
  {
    id: 'demir-orgu',
    name: 'Halka Örgü',
    slot: 'armor',
    rarity: 'magic',
    icon: '🥋',
    power: 0,
    hp: 35,
    flavor: 'Bin halka, bin gece.',
  },
  {
    id: 'kor-zirhi',
    name: 'Kor Zırhı',
    slot: 'armor',
    rarity: 'rare',
    icon: '🛡️',
    power: 2,
    hp: 55,
    flavor: 'Kül Çukuru ateşinde dövülmüş.',
  },
  {
    id: 'tepe-muhafizi',
    name: 'Tepe Muhafızı',
    slot: 'armor',
    rarity: 'unique',
    icon: '🏰',
    power: 4,
    hp: 75,
    flavor: 'Sahibi hiç geri çekilmemiş.',
  },
  {
    id: 'bakir-kolye',
    name: 'Bakır Kolye',
    slot: 'accessory',
    rarity: 'common',
    icon: '📿',
    power: 0,
    hp: 8,
    flavor: 'Yeşillenmiş, ama şanslı.',
  },
  {
    id: 'cirak-yuzugu',
    name: 'Çırak Yüzüğü',
    slot: 'accessory',
    rarity: 'magic',
    icon: '💍',
    power: 3,
    hp: 10,
    flavor: 'İlk büyünün hatırası.',
  },
  {
    id: 'kemik-muska',
    name: 'Kemik Muska',
    slot: 'accessory',
    rarity: 'rare',
    icon: '🦴',
    power: 6,
    hp: 15,
    flavor: 'Tıkırdar, uyarır.',
  },
  {
    id: 'kor-tilsimi',
    name: 'Kor Tılsımı',
    slot: 'accessory',
    rarity: 'unique',
    icon: '🧿',
    power: 10,
    hp: 20,
    flavor: 'Avucunda hâlâ sıcak.',
  },
];

export const itemDef = (id: string): ItemDef => {
  const d = ITEMS.find((i) => i.id === id);
  if (!d) throw new Error(`Bilinmeyen item: ${id}`);
  return d;
};

export interface SlotDef {
  id: string;
  name: string;
  icon: string;
  levelReq: number;
  risk: Risk;
  /** Tik başına (1 tik = TICK_GAME_MIN oyun dakikası). */
  goldPerTick: number;
  expPerTick: number;
  /** Tik başına item düşme şansı (basis point). */
  dropBp: number;
  /** Tik başına düşman belirme şansı (basis point). */
  threatBp: number;
  drops: string[];
  /** Haritadaki konum, yüzde. */
  x: number;
  y: number;
  /** Başlangıç doluluğu: 'A' (senin ulusun), 'B' (düşman), null (boş). */
  occupancy: ('A' | 'B' | null)[];
  blurb: string;
}

export const RISK_TR: Record<Risk, string> = {
  low: 'DÜŞÜK',
  mid: 'ORTA',
  high: 'YÜKSEK',
  deadly: 'ÖLÜMCÜL',
};

export const SLOTS: SlotDef[] = [
  {
    id: 'kamp',
    name: 'Unutulmuş Kamp',
    icon: '🏕️',
    levelReq: 1,
    risk: 'low',
    goldPerTick: 18,
    expPerTick: 6,
    dropBp: 900,
    threatBp: 120,
    drops: ['pasli-kilic', 'deri-yelek', 'bakir-kolye', 'cift-balta'],
    x: 50,
    y: 89,
    occupancy: ['A', 'A', null, null, null, null],
    blurb: 'Güvenli bölgenin kıyısı',
  },
  {
    id: 'tas-sirti',
    name: 'Taş Sırtı',
    icon: '🪨',
    levelReq: 4,
    risk: 'low',
    goldPerTick: 28,
    expPerTick: 9,
    dropBp: 1000,
    threatBp: 250,
    drops: ['cift-balta', 'kurt-postu', 'cirak-yuzugu', 'deri-yelek'],
    x: 27,
    y: 73,
    occupancy: ['A', 'A', 'A', 'B', null, null],
    blurb: 'Kayalıklar, dar geçitler',
  },
  {
    id: 'kara-orman',
    name: 'Kara Orman',
    icon: '🌲',
    levelReq: 7,
    risk: 'mid',
    goldPerTick: 42,
    expPerTick: 13,
    dropBp: 1100,
    threatBp: 450,
    drops: ['avci-yayi', 'kurt-postu', 'demir-orgu', 'cirak-yuzugu'],
    x: 70,
    y: 58,
    occupancy: ['A', 'A', 'B', 'B', null, null],
    blurb: 'Kurtlar ve pusucular',
  },
  {
    id: 'kul-cukuru',
    name: 'Kül Çukuru',
    icon: '🌋',
    levelReq: 9,
    risk: 'mid',
    goldPerTick: 60,
    expPerTick: 17,
    dropBp: 1200,
    threatBp: 650,
    drops: ['golge-hanceri', 'kor-zirhi', 'kemik-muska', 'demir-orgu'],
    x: 31,
    y: 41,
    occupancy: ['B', 'B', 'B', 'A', null, null],
    blurb: 'Sıcak, kalabalık, tartışmalı',
  },
  {
    id: 'demir-tepe',
    name: 'Demir Tepe',
    icon: '⛰️',
    levelReq: 11,
    risk: 'high',
    goldPerTick: 88,
    expPerTick: 23,
    dropBp: 1300,
    threatBp: 900,
    drops: ['kor-disi', 'kartalpence', 'kor-zirhi', 'kemik-muska'],
    x: 69,
    y: 26,
    occupancy: ['B', 'B', 'A', null, null, null],
    blurb: 'Düşman toprağına komşu',
  },
  {
    id: 'olu-vadi',
    name: 'Ölü Vadi',
    icon: '💀',
    levelReq: 14,
    risk: 'deadly',
    goldPerTick: 130,
    expPerTick: 32,
    dropBp: 1400,
    threatBp: 1300,
    drops: ['kor-disi', 'tepe-muhafizi', 'kor-tilsimi', 'golge-hanceri'],
    x: 50,
    y: 13,
    occupancy: ['B', 'B', 'B', 'B', null, null],
    blurb: 'Düşman toprağının kapısı',
  },
];

export const slotDef = (id: string): SlotDef => {
  const d = SLOTS.find((s) => s.id === id);
  if (!d) throw new Error(`Bilinmeyen slot: ${id}`);
  return d;
};

/** Drop ağırlıkları (rarity). */
export const RARITY_WEIGHT: Record<Rarity, number> = { common: 60, magic: 28, rare: 10, unique: 3 };

/** Satış değeri tabanı (altın). */
export const RARITY_VALUE: Record<Rarity, number> = {
  common: 40,
  magic: 140,
  rare: 450,
  unique: 1400,
};

/** Örs maliyeti tabanı (altın); hedef seviye ile çarpılır. Maliyet yalnız altın. */
export const RARITY_UPGRADE_COST: Record<Rarity, number> = {
  common: 60,
  magic: 120,
  rare: 240,
  unique: 480,
};

/** Hedef seviyeye göre taban başarı şansı (basis point): index = hedef +seviye. */
export const UPGRADE_BASE_BP = [10000, 10000, 9000, 8000, 6500, 5000, 3500, 2500, 1500];
/** Bu hedef seviyeden itibaren başarısızlık −1 düşürür. */
export const UPGRADE_DROP_FROM = 5;
export const UPGRADE_MAX = 8;
/** Örs Isısı: her başarısızlık +bp, en fazla HEAT_MAX başarısızlık sayılır. */
export const HEAT_STEP_BP = 500;
export const HEAT_MAX = 5;

/** Akış hızı. 1 tik = gerçek TICK_MS ms = TICK_GAME_MIN oyun dakikası. */
export const TICK_MS = 1500;
export const TICK_GAME_MIN = 3;
export const BAG_ITEM_CAP = 8;
/** Taşınan altın tavanı = slot.goldPerTick × bu. */
export const GOLD_CAP_TICKS = 70;
/** Düşman belirince baskına kaç tik kalır. */
export const THREAT_LEAD_TICKS = 3;
/** Baskından sonra kaç tik baskın kalkanı. */
export const RAID_SHIELD_TICKS = 12;
/** Baskın kararı için gerçek saniye (sonra AI devralır). */
export const RAID_COUNTDOWN_S = 30;
/** Kaybedilen baskında taşınan altın ve item oranı (%). */
export const RAID_LOSS_PCT = 50;
export const TEZGAH_SLOTS = 6;
export const MARKET_TICK_MS = 5000;

export interface RaiderDef {
  name: string;
  archetype: ArchetypeId;
}

export const RAIDERS: RaiderDef[] = [
  { name: 'Zalimhan', archetype: 'assassin' },
  { name: 'Kılıçkıran', archetype: 'warrior' },
  { name: 'Sessiz Ok', archetype: 'archer' },
  { name: 'Karabey', archetype: 'warrior' },
  { name: 'Gecekuşu', archetype: 'assassin' },
  { name: 'Demirkol', archetype: 'warrior' },
  { name: 'Uzak Atış', archetype: 'archer' },
];

export const BUYERS = [
  'Kılıçkıran',
  'Demirkol',
  'Tüccar Ferhat',
  'Pazarcı Nil',
  'Yaşlı Avcı',
  'Kırçiçeği',
  'Bozkurt',
  'Sarı Ayşe',
];

export const STALL_MOTTOS = [
  'Temiz item, dürüst fiyat.',
  '+ yükseltmeliler burada, pazarlık yok aga.',
  'Gece de açık, sabah da.',
];

export const ARCHETYPE_ICON: Record<ArchetypeId, string> = {
  warrior: '🛡️',
  assassin: '🗡️',
  archer: '🏹',
  mage: '🔮',
  priest: '✨',
};
