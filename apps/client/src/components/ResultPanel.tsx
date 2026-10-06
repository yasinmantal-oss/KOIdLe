import type { AiProfile } from '@koidle/ai';
import type { ArchetypeId } from '@koidle/content-schema';
import type { BattleEvent, BattleState } from '@koidle/rules';
import { useState } from 'react';
import { HUMAN } from '../format';
import { contentHash, downloadBackup, type Gate1Answers, inArtifact, saveRecord } from '../gate1';
import { Gate1Form } from './Gate1Form';

interface Props {
  state: BattleState;
  log: BattleEvent[];
  seed: number;
  profile: AiProfile;
  mine: ArchetypeId;
  ai: ArchetypeId;
  deck: string[];
  durationSec: number;
  onRestart: () => void;
  onNew: () => void;
}

const END_TR = {
  normalDamage: 'kart hasarı',
  fatigue: 'Yorgunluk',
  arenaCollapse: 'Arena Çöküşü',
  roundCap: 'raunt tavanı',
} as const;

export function ResultPanel({
  state,
  log,
  seed,
  profile,
  mine,
  ai,
  deck,
  durationSec,
  onRestart,
  onNew,
}: Props) {
  const [saved, setSaved] = useState<string | null>(null);
  const result = state.result;
  if (!result) return null;
  const sonuc =
    result.winner === null ? 'berabere' : result.winner === HUMAN ? 'kazandın' : 'kaybettin';

  async function submit(cevaplar: Gate1Answers) {
    const where = await saveRecord({
      zaman: new Date().toISOString(),
      seed,
      aiProfili: profile,
      oyuncuJob: mine,
      aiJob: ai,
      deste: deck,
      ilkOynayan: state.firstPlayer === HUMAN ? 'sen' : 'rakip',
      sonuc,
      bitisNedeni: result?.reason ?? 'roundCap',
      raunt: state.round,
      sureSn: durationSec,
      arenaGoruldu: log.some((e) => e.type === 'DAMAGE_DEALT' && e.source === 'arena'),
      yorgunlukGoruldu: log.some((e) => e.type === 'DAMAGE_DEALT' && e.source === 'fatigue'),
      configHash: contentHash(state.config, Object.values(state.cards)),
      cevaplar,
    });
    setSaved(where);
  }

  return (
    <div className="result">
      <h2 className={`result__title result__title--${sonuc}`}>
        {sonuc === 'kazandın' ? 'Kazandın' : sonuc === 'kaybettin' ? 'Kaybettin' : 'Berabere'}
      </h2>
      <p>
        {END_TR[result.reason]} · {state.round}. raunt · {Math.floor(durationSec / 60)} dk{' '}
        {durationSec % 60} sn
      </p>
      {saved ? <p className="saved">Kaydedildi ({saved}).</p> : <Gate1Form onSubmit={submit} />}
      <div className="result__actions">
        <button type="button" onClick={onRestart}>
          Tekrar (aynı seed)
        </button>
        <button type="button" onClick={onNew}>
          Yeni savaş
        </button>
        {!inArtifact() && (
          <button type="button" className="link" onClick={downloadBackup}>
            Kayıtları JSON indir
          </button>
        )}
      </div>
    </div>
  );
}
