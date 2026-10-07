import type { BattleEvent, PlayerIndex } from '@koidle/rules';

export type SfxCue =
  | { kind: 'play' }
  | { kind: 'hit'; amount: number }
  | { kind: 'shield' }
  | { kind: 'crit' }
  | { kind: 'evade' }
  | { kind: 'poison' }
  | { kind: 'win' }
  | { kind: 'lose' };

/** Bir aksiyonun olaylarından ses işaretleri türetir. Saf; `me` bakış açısı. */
export function sfxFor(events: readonly BattleEvent[], me: PlayerIndex): SfxCue[] {
  const cues: SfxCue[] = [];
  for (const e of events) {
    switch (e.type) {
      case 'CARD_PLAYED':
        cues.push({ kind: 'play' });
        break;
      case 'DAMAGE_DEALT':
        if (e.amount <= 0) break;
        cues.push(e.source === 'poison' ? { kind: 'poison' } : { kind: 'hit', amount: e.amount });
        break;
      case 'SHIELD_GAINED':
        cues.push({ kind: 'shield' });
        break;
      case 'CRIT_USED':
        cues.push({ kind: 'crit' });
        break;
      case 'EVADED':
        cues.push({ kind: 'evade' });
        break;
      case 'BATTLE_ENDED':
        if (e.winner !== null) cues.push({ kind: e.winner === me ? 'win' : 'lose' });
        break;
      default:
        break;
    }
  }
  return cues;
}
