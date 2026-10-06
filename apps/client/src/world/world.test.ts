import { describe, expect, it } from 'vitest';
import { BAG_ITEM_CAP, slotDef, UPGRADE_DROP_FROM } from './protoData';
import {
  addExp,
  applyRaidOutcome,
  attemptUpgrade,
  createWorld,
  expToNext,
  farmTick,
  goldCap,
  listItem,
  marketTick,
  returnToTown,
  startFarm,
  upgradeChance,
  type World,
} from './world';

const ticks = (w: World, n: number, allowRaid = true): World => {
  let x = w;
  for (let i = 0; i < n; i++) x = farmTick(x, allowRaid);
  return x;
};

describe('farm', () => {
  it('a tick adds gold and exp to carried loot, not to the player', () => {
    const w = startFarm(createWorld(7), 'kamp');
    const t = farmTick(w);
    expect(t.farm?.gold).toBeGreaterThan(0);
    expect(t.farm?.exp).toBeGreaterThan(0);
    expect(t.player.gold).toBe(w.player.gold);
    expect(w.farm?.gold).toBe(0); // saf: eski dünya değişmez
  });

  it('is deterministic for the same seed', () => {
    const a = ticks(startFarm(createWorld(42), 'kara-orman'), 30);
    const b = ticks(startFarm(createWorld(42), 'kara-orman'), 30);
    expect(a).toEqual(b);
  });

  it('respects the level requirement and the carried loot cap', () => {
    expect(startFarm(createWorld(1), 'olu-vadi').farm).toBeNull();
    const w = ticks(startFarm(createWorld(3), 'kamp'), 400, false);
    expect(w.farm?.gold).toBeLessThanOrEqual(goldCap('kamp'));
    expect(w.farm?.items.length).toBeLessThanOrEqual(BAG_ITEM_CAP);
  });

  it('returning to town secures loot and levels up', () => {
    let w = ticks(startFarm(createWorld(5), 'kul-cukuru'), 20, false);
    const carried = w.farm?.gold ?? 0;
    const before = w.player.gold;
    w = returnToTown(w);
    expect(w.farm).toBeNull();
    expect(w.player.gold).toBe(before + carried);
    expect(w.summary?.levelAfter).toBeGreaterThanOrEqual(w.summary?.levelBefore ?? 0);
  });

  it('a lost raid takes part of the carried loot and ends the trip; exp is kept', () => {
    let w = ticks(startFarm(createWorld(11), 'kul-cukuru'), 10, false);
    const gold = w.farm?.gold ?? 0;
    const exp = w.farm?.exp ?? 0;
    w = { ...w, raid: { raider: { name: 'X', archetype: 'warrior' }, level: 12, seed: 1 } };
    const lost = applyRaidOutcome(w, false);
    expect(lost.farm).toBeNull();
    expect(lost.summary?.defeated).toBe(true);
    expect(lost.summary?.lostGold).toBe(Math.floor(gold / 2));
    expect(lost.summary?.exp).toBe(exp);
    const won = applyRaidOutcome(w, true);
    expect(won.farm?.raidsWon).toBe(1);
    expect(won.farm?.gold).toBeGreaterThan(gold);
  });
});

describe('level', () => {
  it('carries leftover exp into the next level', () => {
    expect(addExp(1, 0, expToNext(1) + 5)).toEqual({ level: 2, exp: 5 });
    expect(addExp(3, 10, 5)).toEqual({ level: 3, exp: 15 });
  });
});

describe('örs', () => {
  it('Örs Isısı adds to the chance after failures', () => {
    const it0 = { uid: 'a', baseId: 'kartalpence', plus: 6, heat: 0 };
    const hot = { ...it0, heat: 2 };
    expect(upgradeChance(hot).total).toBe(upgradeChance(it0).total + 1000);
  });

  it('outcomes: success raises +1, high-level failure drops −1 and heats the item', () => {
    const base = createWorld(9);
    base.player.gold = 1_000_000;
    const weapon = base.equipped.weapon;
    if (!weapon) throw new Error('silah yok');
    weapon.plus = UPGRADE_DROP_FROM; // hedef +6
    const seen = new Set<string>();
    let w = base;
    for (let i = 0; i < 60; i++) {
      const before = w.equipped.weapon?.plus ?? 0;
      const r = attemptUpgrade(w, weapon.uid);
      const after = r.world.equipped.weapon?.plus ?? 0;
      seen.add(r.outcome);
      if (r.outcome === 'success') expect(after).toBe(before + 1);
      if (r.outcome === 'drop') {
        expect(after).toBe(before - 1);
        expect(r.world.equipped.weapon?.heat).toBeGreaterThan(0);
      }
      w = r.world;
    }
    expect(seen.has('success')).toBe(true);
    expect(seen.has('drop')).toBe(true);
    expect(w.player.gold).toBeLessThan(1_000_000);
  });

  it('cannot upgrade without enough gold', () => {
    const w = createWorld(2);
    w.player.gold = 0;
    const uid = w.equipped.weapon?.uid ?? '';
    expect(attemptUpgrade(w, uid).outcome).toBe('invalid');
  });
});

describe('tezgâh', () => {
  it('listed items eventually sell and pay gold', () => {
    let w = createWorld(4);
    const uid = w.inventory[0]?.uid ?? '';
    w = listItem(w, uid, 10);
    const gold = w.player.gold;
    for (let i = 0; i < 50; i++) w = marketTick(w);
    expect(w.stall.sales).toHaveLength(1);
    expect(w.player.gold).toBe(gold + 10);
  });
});

describe('protoData', () => {
  it('every slot has capacity 6', () => {
    for (const id of ['kamp', 'tas-sirti', 'kara-orman', 'kul-cukuru', 'demir-tepe', 'olu-vadi']) {
      expect(slotDef(id).occupancy).toHaveLength(6);
    }
  });
});
