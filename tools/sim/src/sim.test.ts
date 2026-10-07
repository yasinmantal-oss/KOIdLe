import type { PlayerIndex } from '@koidle/rules';
import { describe, expect, it } from 'vitest';
import { loadSimInput } from './load-input';
import { renderCsv, summarize } from './report';
import { faz2bDeltas, type MatchRecord, runJobMatrix, runProfileMatrix, seedRange } from './run';

const input = loadSimInput();

describe('simulation smoke (job matrix 5×5 × 1 seed, profile matrix 5×(3×3) × 1 seed)', () => {
  const job = runJobMatrix(input, seedRange(1, 1));
  const profile = runProfileMatrix(input, seedRange(1, 1));
  const records = [...job, ...profile];

  it('every match ends, no illegal action is thrown', () => {
    expect(job).toHaveLength(25);
    expect(profile).toHaveLength(45);
    for (const r of records) expect(r.rounds).toBeGreaterThan(0);
    expect(job.every((r) => r.pass === 'job')).toBe(true);
    expect(profile.every((r) => r.pass === 'profile')).toBe(true);
  });

  it('is deterministic', () => {
    const again = runJobMatrix(input, seedRange(1, 1));
    expect(renderCsv(again)).toBe(renderCsv(job));
  });

  it('summary covers every card that is in a preset deck and every end reason', () => {
    const s = summarize(records, input);
    const deckCards = new Set(Object.values(input.decks).flat());
    expect(s.cards).toHaveLength(deckCards.size);
    expect(s.cards.every((c) => deckCards.has(c.id))).toBe(true);
    const total = Object.values(s.endReason).reduce((a, b) => a + b, 0);
    expect(total).toBe(25);
    expect(s.matches).toBe(25);
    expect(s.profileMatches).toBe(45);
  });

  it('records the new per-seat metrics', () => {
    for (const r of job) {
      expect(r.deadOpening).toHaveLength(2);
      expect(r.crits.every((n) => n >= 0)).toBe(true);
      expect(r.evades.every((n) => n >= 0)).toBe(true);
      expect(r.poisonDamage.every((n) => n >= 0)).toBe(true);
      expect(r.freezeApplied.every((n) => n >= 0)).toBe(true);
      expect(r.fireBonus.every((n) => n >= 0)).toBe(true);
      expect(r.maxHpReduced.every((n) => n >= 0)).toBe(true);
      expect(r.overhealShield.every((n) => n >= 0)).toBe(true);
    }
  });

  it('Faz 2b sayaçları içerikten türetilen beklentiyle uyuşur', () => {
    const s = summarize(records, input);
    // Kart başına koltuk katkısı: her oynanışta kaç Donma uygulanır, rakip maks HP ne kadar azalır.
    const freezePerPlay = new Map<string, number>();
    const maxHpPerPlay = new Map<string, number>();
    for (const c of input.cards) {
      let freeze = 0;
      let maxHp = 0;
      for (const e of c.effects) {
        // Donma içeren her kart rakibe uygular (faz2bDeltas bu varsayımla koltuk atar).
        if (e.kind === 'applyStatus' && e.status === 'freeze') expect(e.target).toBe('enemy');
        if (e.kind === 'applyStatus' && e.target === 'enemy' && e.status === 'freeze') freeze += 1;
        if (e.kind === 'reduceMaxHp') maxHp += e.amount;
      }
      freezePerPlay.set(c.id, freeze);
      maxHpPerPlay.set(c.id, maxHp);
    }
    const expected = (r: MatchRecord, seat: PlayerIndex, perPlay: Map<string, number>): number =>
      Object.entries(r.plays).reduce(
        (sum, [cardId, plays]) => sum + plays[seat] * (perPlay.get(cardId) ?? 0),
        0,
      );
    for (const r of job) {
      for (const seat of [0, 1] as const) {
        // Üst sınır: maç bitince kartın kalan efektleri çözülmez, bu yüzden sayaç beklentiyi aşamaz.
        expect(r.freezeApplied[seat]).toBeLessThanOrEqual(expected(r, seat, freezePerPlay));
        expect(r.maxHpReduced[seat]).toBeLessThanOrEqual(expected(r, seat, maxHpPerPlay));
      }
    }
    // Donma/Ateş yalnız Mage'in destesinde; taşan iyileşme yalnız Priest'te (overflowToShield).
    expect(s.combos.mage.freezeApplied).toBeGreaterThan(0);
    expect(s.combos.mage.fireBonus).toBeGreaterThan(0);
    expect(s.combos.priest.overhealShield).toBeGreaterThan(0);
    for (const a of ['warrior', 'assassin', 'archer', 'priest'] as const) {
      expect(s.combos[a].freezeApplied).toBe(0);
      expect(s.combos[a].fireBonus).toBe(0);
    }
    for (const a of ['warrior', 'assassin', 'archer', 'mage'] as const) {
      expect(s.combos[a].maxHpReduced).toBe(0);
      // Taşan iyileşme Kalkanı yalnız overflowToShield taşıyan Priest kartlarında oluşur.
      expect(s.combos[a].overhealShield).toBe(0);
    }
  });

  it('faz2bDeltas olayları doğru koltuğa yazar', () => {
    expect(
      faz2bDeltas([
        { type: 'STATUS_APPLIED', player: 1, status: 'freeze', amount: 1, duration: 2 },
        { type: 'STATUS_CONSUMED', player: 1, status: 'freeze' },
        { type: 'STATUS_CONSUMED', player: 0, status: 'weak' },
        { type: 'MAX_HP_REDUCED', player: 0, amount: 7, maxHp: 23 },
        // Taşan iyileşme: HEALED'ın hemen ardından gelen Kalkan taşmadır.
        { type: 'HEALED', player: 0, amount: 0 },
        { type: 'SHIELD_GAINED', player: 0, amount: 6 },
        // Taşma olmayan Kalkan: öncesinde HEALED yok.
        { type: 'SHIELD_GAINED', player: 1, amount: 5 },
        { type: 'HEALED', player: 1, amount: 2 },
        { type: 'DAMAGE_DEALT', source: 0, target: 1, amount: 1, absorbed: 0 },
        { type: 'SHIELD_GAINED', player: 1, amount: 4 },
      ]),
    ).toEqual({
      // 1. koltuk dondu: Donma'yı 0. koltuk uyguladı ve Ateş ile tüketti; maks HP'yi 0. koltuk kaybetti.
      freezeApplied: [1, 0],
      fireBonus: [1, 0],
      maxHpReduced: [0, 7],
      overhealShield: [6, 0],
    });
  });
});
