import { drawCard } from './draw';
import { dealDamage, endBattle, other } from './outcome';
import { removeStatus, statusAmount, tickStatuses } from './status';
import type { BattleEvent, BattleState, PlayerIndex } from './types';

/**
 * Tur başı (N3): tur başlar → Kaçınma düşer → Kalkan sıfırlanır → MP → Zehir → Arena hasarı → kart çekme.
 * Her sistem hasarından sonra savaş bitti mi bakılır (C1).
 */
export function startTurn(state: BattleState, p: PlayerIndex, events: BattleEvent[]): void {
  const { mp, shield, arenaCollapse, hand } = state.config;
  const pl = state.players[p];

  pl.turnsTaken += 1;
  pl.maxMp = Math.min(mp.start + (pl.turnsTaken - 1) * mp.perTurn, mp.max);
  events.push({ type: 'TURN_STARTED', player: p, round: state.round, maxMp: pl.maxMp });

  // Kaçınma: kullanılmadıysa sahibinin sonraki turunun başında düşer.
  if (statusAmount(pl, 'evade') > 0) {
    removeStatus(pl, 'evade');
    events.push({ type: 'STATUS_EXPIRED', player: p, status: 'evade' });
  }

  if (shield.persistence === 'resetOnOwnTurnStart' && pl.shield > 0) {
    events.push({ type: 'SHIELD_EXPIRED', player: p, amount: pl.shield });
    pl.shield = 0;
  }
  pl.shieldGainedThisTurn = 0;
  pl.cardsPlayedThisTurn = 0;
  pl.mp = pl.maxMp;

  // Zehir: sahibinin tur başında, Arena'dan önce; Kalkanı yok sayar. Sonra `decay` kadar azalır.
  const poison = statusAmount(pl, 'poison');
  if (poison > 0) {
    dealDamage(state, 'poison', p, poison, true, events);
    if (state.result) return;
    const left = poison - state.config.statuses.poison.decay;
    if (left > 0) {
      const st = pl.statuses.find((x) => x.id === 'poison');
      if (st) st.amount = left;
    } else {
      removeStatus(pl, 'poison');
      events.push({ type: 'STATUS_EXPIRED', player: p, status: 'poison' });
    }
  }

  if (state.round >= arenaCollapse.startRound) {
    const amount =
      arenaCollapse.start + (state.round - arenaCollapse.startRound) * arenaCollapse.step;
    dealDamage(state, 'arena', p, amount, arenaCollapse.ignoresShield, events);
    if (state.result) return;
  }

  const skipDraw = hand.firstPlayerSkipsFirstDraw && p === state.firstPlayer && pl.turnsTaken === 1;
  if (skipDraw) return;
  for (let i = 0; i < hand.drawPerTurn; i++) {
    drawCard(state, p, events);
    if (state.result) return;
  }
}

/** Tur sonu: statü süreleri düşer, sıra geçer; raunt ilk oyuncunun turu başlarken artar. */
export function endTurn(state: BattleState, events: BattleEvent[]): void {
  const p = state.active;
  tickStatuses(state, p, events);
  events.push({ type: 'TURN_ENDED', player: p, unusedMp: state.players[p].mp });

  const next = other(p);
  state.active = next;
  if (next === state.firstPlayer) {
    state.round += 1;
    if (state.round > state.config.roundCap) {
      state.round = state.config.roundCap;
      endBattle(state, null, 'roundCap', events);
      return;
    }
  }
  startTurn(state, next, events);
}
