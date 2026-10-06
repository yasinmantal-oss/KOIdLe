/**
 * İstemci tarafı "dünya" prototipi: saf fonksiyonlar, seed'li PRNG. Kural motoru (packages/rules)
 * değildir; yalnız tasarım ekranlarını canlı göstermek için. Tüm sayılar protoData.ts'ten gelir.
 */
import type { ArchetypeId } from '@koidle/content-schema';
import {
  BAG_ITEM_CAP,
  BUYERS,
  type GearSlot,
  GOLD_CAP_TICKS,
  HEAT_MAX,
  HEAT_STEP_BP,
  ITEMS,
  itemDef,
  RAID_LOSS_PCT,
  RAID_SHIELD_TICKS,
  RAIDERS,
  RARITY_UPGRADE_COST,
  RARITY_VALUE,
  RARITY_WEIGHT,
  type RaiderDef,
  SLOTS,
  slotDef,
  TEZGAH_SLOTS,
  THREAT_LEAD_TICKS,
  UPGRADE_BASE_BP,
  UPGRADE_DROP_FROM,
  UPGRADE_MAX,
} from './protoData';

export interface Item {
  uid: string;
  baseId: string;
  plus: number;
  /** Örs Isısı: art arda başarısızlık sayısı (item bazında). */
  heat: number;
}

export interface Threat {
  raider: RaiderDef;
  level: number;
  ticksLeft: number;
  acknowledged: boolean;
}

export interface Raid {
  raider: RaiderDef;
  level: number;
  seed: number;
}

export interface Farm {
  slotId: string;
  ticks: number;
  gold: number;
  exp: number;
  items: Item[];
  threat: Threat | null;
  shieldTicks: number;
  raidsWon: number;
  /** Bu seferde kaybedilen (baskın). */
  lostGold: number;
  lostItems: Item[];
  /** Son tikte olan şeyler (UI yüzen yazılar için). */
  last: TickEvent[];
  bagFullWarned: boolean;
}

export type TickEvent =
  | { kind: 'gold'; amount: number }
  | { kind: 'exp'; amount: number }
  | { kind: 'item'; item: Item }
  | { kind: 'bagFull' }
  | { kind: 'threat'; raider: RaiderDef; level: number }
  | { kind: 'raid' };

export interface Listing {
  item: Item;
  price: number;
}

export interface Sale {
  id: string;
  item: Item;
  price: number;
  buyer: string;
  seen: boolean;
}

export interface Summary {
  slotId: string;
  ticks: number;
  gold: number;
  exp: number;
  items: Item[];
  raidsWon: number;
  lostGold: number;
  lostItems: Item[];
  levelBefore: number;
  expBefore: number;
  levelAfter: number;
  expAfter: number;
  defeated: boolean;
  /** Bu özetteki item'lardan hangileri kuşanıldı/satıldı (UI). */
  handled: string[];
}

export interface World {
  version: 1;
  rng: number;
  nextUid: number;
  player: {
    name: string;
    nation: 'A' | 'B';
    archetype: ArchetypeId;
    level: number;
    exp: number;
    gold: number;
  };
  equipped: Record<GearSlot, Item | null>;
  inventory: Item[];
  farm: Farm | null;
  raid: Raid | null;
  summary: Summary | null;
  stall: { motto: number; listings: (Listing | null)[]; sales: Sale[] };
  /** Son örs vuruşu (UI sonucu buradan okur). */
  lastUpgrade: { uid: string; outcome: UpgradeOutcome; n: number } | null;
  /** Slot doluluğu (6 kapasite), 'A' = senin ulusun. */
  occupancy: Record<string, ('A' | 'B' | null)[]>;
}

// ---------- PRNG (mulberry32): saf, state'te tutulan seed ----------

export function nextRandom(seed: number): [number, number] {
  const s = (seed + 0x6d2b79f5) >>> 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return [value, s];
}

/** Dünya içinde tek sayı çeker; dünyayı değiştirir (yalnız kopyalar üstünde kullanılır). */
function roll(w: World): number {
  const [v, s] = nextRandom(w.rng);
  w.rng = s;
  return v;
}
const chance = (w: World, bp: number): boolean => roll(w) * 10000 < bp;
const pick = <T>(w: World, arr: readonly T[]): T => arr[Math.floor(roll(w) * arr.length)] as T;

// ---------- Level ----------

export function expToNext(level: number): number {
  return 60 + level * 40;
}

export function addExp(level: number, exp: number, gain: number): { level: number; exp: number } {
  let l = level;
  let e = exp + gain;
  while (e >= expToNext(l)) {
    e -= expToNext(l);
    l += 1;
  }
  return { level: l, exp: e };
}

// ---------- Item ----------

export function itemPower(i: Item): number {
  const d = itemDef(i.baseId);
  return Math.round(d.power * (1 + 0.15 * i.plus));
}
export function itemHp(i: Item): number {
  const d = itemDef(i.baseId);
  return Math.round(d.hp * (1 + 0.15 * i.plus));
}
export function itemValue(i: Item): number {
  return Math.round(RARITY_VALUE[itemDef(i.baseId).rarity] * (1 + 0.6 * i.plus));
}
/** Bir item'ın "puanı": en iyi drop'u seçmek için. */
export function itemScore(i: Item): number {
  return itemPower(i) * 2 + itemHp(i);
}

export function playerStats(w: World): { power: number; hp: number } {
  let power = 10 + w.player.level * 2;
  let hp = 100 + w.player.level * 8;
  for (const it of Object.values(w.equipped)) {
    if (!it) continue;
    power += itemPower(it);
    hp += itemHp(it);
  }
  return { power, hp };
}

function makeItem(w: World, baseId: string, plus = 0): Item {
  const uid = `i${w.nextUid}`;
  w.nextUid += 1;
  return { uid, baseId, plus, heat: 0 };
}

// ---------- Oluşturma ----------

export function createWorld(seed: number): World {
  const w: World = {
    version: 1,
    rng: seed >>> 0,
    nextUid: 1,
    player: { name: 'Yasin', nation: 'A', archetype: 'warrior', level: 9, exp: 120, gold: 4800 },
    equipped: { weapon: null, armor: null, accessory: null },
    inventory: [],
    farm: null,
    raid: null,
    summary: null,
    lastUpgrade: null,
    stall: { motto: 1, listings: Array.from({ length: TEZGAH_SLOTS }, () => null), sales: [] },
    occupancy: Object.fromEntries(SLOTS.map((s) => [s.id, [...s.occupancy]])),
  };
  w.equipped.weapon = makeItem(w, 'pasli-kilic', 3);
  w.equipped.armor = makeItem(w, 'deri-yelek', 2);
  w.equipped.accessory = makeItem(w, 'bakir-kolye', 0);
  w.inventory.push(makeItem(w, 'cirak-yuzugu', 0), makeItem(w, 'cift-balta', 1));
  return w;
}

const clone = (w: World): World => structuredClone(w);

// ---------- Farm ----------

export function canFarm(w: World, slotId: string): boolean {
  const s = slotDef(slotId);
  const occ = w.occupancy[slotId] ?? [];
  return w.player.level >= s.levelReq && occ.some((o) => o === null) && !w.farm;
}

export function startFarm(w0: World, slotId: string): World {
  if (!canFarm(w0, slotId)) return w0;
  const w = clone(w0);
  const occ = w.occupancy[slotId] ?? [];
  const free = occ.indexOf(null);
  if (free >= 0) occ[free] = 'A';
  w.summary = null;
  w.farm = {
    slotId,
    ticks: 0,
    gold: 0,
    exp: 0,
    items: [],
    threat: null,
    shieldTicks: 4,
    raidsWon: 0,
    lostGold: 0,
    lostItems: [],
    last: [],
    bagFullWarned: false,
  };
  return w;
}

export function goldCap(slotId: string): number {
  return slotDef(slotId).goldPerTick * GOLD_CAP_TICKS;
}

function rollDrop(w: World, slotId: string): string {
  const s = slotDef(slotId);
  const defs = s.drops.map(itemDef);
  const total = defs.reduce((a, d) => a + RARITY_WEIGHT[d.rarity], 0);
  let r = roll(w) * total;
  for (const d of defs) {
    r -= RARITY_WEIGHT[d.rarity];
    if (r < 0) return d.id;
  }
  return defs[0]?.id ?? ITEMS[0]?.id ?? 'pasli-kilic';
}

/**
 * Bir farm tiki: altın, EXP, olası drop, düşman belirmesi/yaklaşması. `allowRaid` false ise
 * (çevrimdışı telafi) düşman belirmez. Baskın başlarsa `w.raid` dolar ve tik durur.
 */
export function farmTick(w0: World, allowRaid = true): World {
  if (!w0.farm || w0.raid) return w0;
  const w = clone(w0);
  const f = w.farm as Farm;
  const s = slotDef(f.slotId);
  const events: TickEvent[] = [];
  f.ticks += 1;

  const cap = goldCap(f.slotId);
  const g = Math.round(s.goldPerTick * (0.8 + roll(w) * 0.4));
  const gain = Math.max(0, Math.min(g, cap - f.gold));
  if (gain > 0) {
    f.gold += gain;
    events.push({ kind: 'gold', amount: gain });
  }
  const e = Math.round(s.expPerTick * (0.85 + roll(w) * 0.3));
  f.exp += e;
  events.push({ kind: 'exp', amount: e });

  if (chance(w, s.dropBp)) {
    if (f.items.length < BAG_ITEM_CAP) {
      const it = makeItem(w, rollDrop(w, f.slotId), chance(w, 1500) ? 1 : 0);
      f.items.push(it);
      events.push({ kind: 'item', item: it });
    } else {
      events.push({ kind: 'bagFull' });
    }
  }

  if (f.shieldTicks > 0) f.shieldTicks -= 1;
  if (f.threat) {
    f.threat.ticksLeft -= 1;
    if (f.threat.ticksLeft <= 0 && allowRaid) {
      w.raid = {
        raider: f.threat.raider,
        level: f.threat.level,
        seed: Math.floor(roll(w) * 1_000_000),
      };
      f.threat = null;
      events.push({ kind: 'raid' });
    }
  } else if (allowRaid && f.shieldTicks === 0 && chance(w, s.threatBp)) {
    const raider = pick(w, RAIDERS);
    const level = Math.max(1, s.levelReq + Math.floor(roll(w) * 4));
    f.threat = { raider, level, ticksLeft: THREAT_LEAD_TICKS, acknowledged: false };
    events.push({ kind: 'threat', raider, level });
  }
  f.last = events;
  return w;
}

export function acknowledgeThreat(w0: World): World {
  if (!w0.farm?.threat) return w0;
  const w = clone(w0);
  if (w.farm?.threat) w.farm.threat.acknowledged = true;
  return w;
}

export function isBagFull(f: Farm): boolean {
  return f.items.length >= BAG_ITEM_CAP || f.gold >= goldCap(f.slotId);
}

// ---------- Baskın ----------

/** AI'ya bırakınca kazanma şansı (bp): güç ve seviye farkı. */
export function autoWinBp(w: World, raid: Raid): number {
  const mine = playerStats(w).power;
  // Saldıranın tahmini gücü: seviye tabanı + seviyesine uygun ekipman.
  const foe = 10 + Math.round(raid.level * 3.5);
  const bp = 5500 + (mine - foe) * 120 + (w.player.level - raid.level) * 300;
  return Math.max(1500, Math.min(8500, bp));
}

/** AI'ya bırakılan baskının sonucu: baskın seed'inden türer (önceden belli, tekrar edilebilir). */
export function autoRaidWon(w: World): boolean {
  if (!w.raid) return false;
  return nextRandom(w.raid.seed)[0] * 10000 < autoWinBp(w, w.raid);
}

/** Kazanırsan ganimet kalır ve baskın kalkanı açılır; kaybedersen bir kısmı gider ve kasabaya düşersin. */
export function applyRaidOutcome(w0: World, won: boolean): World {
  if (!w0.raid || !w0.farm) return { ...w0, raid: null };
  const w = clone(w0);
  const f = w.farm as Farm;
  w.raid = null;
  f.threat = null;
  if (won) {
    f.raidsWon += 1;
    f.shieldTicks = RAID_SHIELD_TICKS;
    const bonus = slotDef(f.slotId).goldPerTick * 3;
    f.gold += bonus;
    f.last = [{ kind: 'gold', amount: bonus }];
    return w;
  }
  const lostGold = Math.floor((f.gold * RAID_LOSS_PCT) / 100);
  f.gold -= lostGold;
  f.lostGold += lostGold;
  const loseCount = Math.ceil((f.items.length * RAID_LOSS_PCT) / 100);
  for (let i = 0; i < loseCount; i++) {
    const idx = Math.floor(roll(w) * f.items.length);
    const [lost] = f.items.splice(idx, 1);
    if (lost) f.lostItems.push(lost);
  }
  return returnToTown(w, true);
}

// ---------- Kasabaya dönüş ----------

export function returnToTown(w0: World, defeated = false): World {
  if (!w0.farm) return w0;
  const w = clone(w0);
  const f = w.farm as Farm;
  const before = { level: w.player.level, exp: w.player.exp };
  const after = addExp(before.level, before.exp, f.exp);
  w.player.level = after.level;
  w.player.exp = after.exp;
  w.player.gold += f.gold;
  w.inventory.push(...f.items);
  const occ = w.occupancy[f.slotId];
  if (occ) {
    const mine = occ.indexOf('A');
    if (mine >= 0) occ[mine] = null;
  }
  w.summary = {
    slotId: f.slotId,
    ticks: f.ticks,
    gold: f.gold,
    exp: f.exp,
    items: f.items,
    raidsWon: f.raidsWon,
    lostGold: f.lostGold,
    lostItems: f.lostItems,
    levelBefore: before.level,
    expBefore: before.exp,
    levelAfter: after.level,
    expAfter: after.exp,
    defeated,
    handled: [],
  };
  w.farm = null;
  w.raid = null;
  return w;
}

export function bestItem(items: Item[]): Item | null {
  let best: Item | null = null;
  for (const i of items) if (!best || itemScore(i) > itemScore(best)) best = i;
  return best;
}

// ---------- Envanter ----------

function takeFromInventory(w: World, uid: string): Item | null {
  const idx = w.inventory.findIndex((i) => i.uid === uid);
  if (idx < 0) return null;
  const [it] = w.inventory.splice(idx, 1);
  return it ?? null;
}

export function equip(w0: World, uid: string): World {
  const w = clone(w0);
  const it = takeFromInventory(w, uid);
  if (!it) return w0;
  const slot = itemDef(it.baseId).slot;
  const old = w.equipped[slot];
  if (old) w.inventory.push(old);
  w.equipped[slot] = it;
  if (w.summary) w.summary.handled.push(uid);
  return w;
}

export function unequip(w0: World, slot: GearSlot): World {
  const it = w0.equipped[slot];
  if (!it) return w0;
  const w = clone(w0);
  w.equipped[slot] = null;
  w.inventory.push(it);
  return w;
}

export function sell(w0: World, uid: string): World {
  const w = clone(w0);
  const it = takeFromInventory(w, uid);
  if (!it) return w0;
  w.player.gold += itemValue(it);
  if (w.summary) w.summary.handled.push(uid);
  return w;
}

export function findItem(w: World, uid: string): Item | null {
  for (const it of Object.values(w.equipped)) if (it?.uid === uid) return it;
  return w.inventory.find((i) => i.uid === uid) ?? null;
}

// ---------- Örs ----------

export function upgradeCost(i: Item): number {
  return RARITY_UPGRADE_COST[itemDef(i.baseId).rarity] * (i.plus + 1) * (i.plus + 1);
}

export function upgradeChance(i: Item): { base: number; heat: number; total: number } {
  const target = i.plus + 1;
  const base = UPGRADE_BASE_BP[target] ?? 0;
  const heat = base >= 10000 ? 0 : Math.min(i.heat, HEAT_MAX) * HEAT_STEP_BP;
  return { base, heat, total: Math.min(10000, base + heat) };
}

export const dropsOnFail = (i: Item): boolean => i.plus + 1 >= UPGRADE_DROP_FROM;

export type UpgradeOutcome = 'success' | 'fail' | 'drop' | 'invalid';

export function attemptUpgrade(w0: World, uid: string): { world: World; outcome: UpgradeOutcome } {
  const target0 = findItem(w0, uid);
  if (!target0 || target0.plus >= UPGRADE_MAX || w0.player.gold < upgradeCost(target0)) {
    return { world: w0, outcome: 'invalid' };
  }
  const w = clone(w0);
  const it = findItem(w, uid) as Item;
  w.player.gold -= upgradeCost(it);
  const { total } = upgradeChance(it);
  let outcome: UpgradeOutcome;
  if (chance(w, total)) {
    it.plus += 1;
    it.heat = 0;
    outcome = 'success';
  } else {
    it.heat = Math.min(HEAT_MAX, it.heat + 1);
    const drop = dropsOnFail(it);
    if (drop) it.plus = Math.max(0, it.plus - 1);
    outcome = drop ? 'drop' : 'fail';
  }
  w.lastUpgrade = { uid, outcome, n: (w0.lastUpgrade?.n ?? 0) + 1 };
  return { world: w, outcome };
}

// ---------- Tezgâh ----------

export function listItem(w0: World, uid: string, price: number): World {
  const free = w0.stall.listings.indexOf(null);
  if (free < 0 || price <= 0) return w0;
  const w = clone(w0);
  const it = takeFromInventory(w, uid);
  if (!it) return w0;
  w.stall.listings[free] = { item: it, price: Math.round(price) };
  return w;
}

export function unlist(w0: World, index: number): World {
  const l = w0.stall.listings[index];
  if (!l) return w0;
  const w = clone(w0);
  w.stall.listings[index] = null;
  w.inventory.push(l.item);
  return w;
}

/** Fiyat değere ne kadar yakınsa o kadar çabuk satılır (bp / pazar tiki). */
export function saleBp(l: Listing): number {
  const ratio = itemValue(l.item) / l.price;
  return Math.max(250, Math.min(6000, Math.round(3200 * ratio * ratio)));
}

export function marketTick(w0: World): World {
  if (w0.stall.listings.every((l) => l === null)) return w0;
  const w = clone(w0);
  w.stall.listings.forEach((l, idx) => {
    if (!l) return;
    if (chance(w, saleBp(l))) {
      w.stall.listings[idx] = null;
      w.player.gold += l.price;
      w.stall.sales.unshift({
        id: `s${w.nextUid++}`,
        item: l.item,
        price: l.price,
        buyer: pick(w, BUYERS),
        seen: false,
      });
    }
  });
  w.stall.sales = w.stall.sales.slice(0, 12);
  return w;
}

export function markSalesSeen(w0: World): World {
  if (w0.stall.sales.every((s) => s.seen)) return w0;
  const w = clone(w0);
  for (const s of w.stall.sales) s.seen = true;
  return w;
}

export function setMotto(w0: World, motto: number): World {
  return { ...w0, stall: { ...w0.stall, motto } };
}

export function setArchetype(w0: World, archetype: ArchetypeId): World {
  return { ...w0, player: { ...w0.player, archetype } };
}

export function clearSummary(w0: World): World {
  return w0.summary ? { ...w0, summary: null } : w0;
}

/** Diğer oyuncuların slotlara girip çıkması: harita canlı dursun diye (yalnız görsel). */
export function driftOccupancy(w0: World): World {
  const w = clone(w0);
  const s = pick(w, SLOTS);
  const occ = w.occupancy[s.id];
  if (!occ) return w0;
  const idx = Math.floor(roll(w) * occ.length);
  const cur = occ[idx];
  if (cur === 'A' && w.farm?.slotId === s.id && occ.filter((o) => o === 'A').length <= 1) return w;
  // Boş yer hep kalsın ki oyuncu girebilsin.
  if (cur === null && occ.filter((o) => o === null).length <= 1) return w;
  occ[idx] = cur === null ? (roll(w) < 0.5 ? 'A' : 'B') : null;
  return w;
}
