import type { BattleState, PlayerIndex, PlayerState, StatusId } from '@koidle/rules';
import type { Weights } from './types';

export const WIN_SCORE = 1_000_000;

/** Sahibi için iyi statüler; diğerleri (Zayıflık, Lanet, Zehir) kötü. */
const GOOD: readonly StatusId[] = ['strength', 'stealth'];

function statusScore(p: PlayerState): number {
  let score = 0;
  for (const s of p.statuses) {
    const value = s.amount * s.turnsLeft;
    score += GOOD.includes(s.id) ? value : -value;
  }
  return score;
}

/** Durum skoru (yüksek = AI için iyi). AI skoru kural değildir; float olabilir. */
export function evaluate(state: BattleState, me: PlayerIndex, w: Weights): number {
  if (state.result) {
    if (state.result.winner === null) return 0;
    return state.result.winner === me ? WIN_SCORE : -WIN_SCORE;
  }
  const mine = state.players[me];
  const theirs = state.players[me === 0 ? 1 : 0];
  return (
    w.enemyDamage * (theirs.maxHp - theirs.hp) -
    w.selfDamage * (mine.maxHp - mine.hp) +
    w.shield * mine.shield -
    w.enemyShield * theirs.shield +
    w.status * (statusScore(mine) - statusScore(theirs)) +
    w.hand * mine.hand.length
  );
}
