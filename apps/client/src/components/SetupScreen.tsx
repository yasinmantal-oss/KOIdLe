import { AI_PROFILES, type AiProfile } from '@koidle/ai';
import { ARCHETYPE_IDS, ARCHETYPES, type ArchetypeId } from '@koidle/content-schema';
import { useState } from 'react';
import { type MatchSetup, pickAi } from '../match';

const PROFILE_TR: Record<AiProfile, string> = {
  aggressive: 'Saldırgan',
  balanced: 'Dengeli',
  defensive: 'Savunmacı',
};

export function SetupScreen(props: {
  onStart: (setup: MatchSetup) => void;
  onBack?: () => void;
  initialMine?: ArchetypeId;
}) {
  const [mine, setMine] = useState<ArchetypeId>(props.initialMine ?? 'warrior');
  const [ai, setAi] = useState<ArchetypeId | 'random'>('random');
  const [profile, setProfile] = useState<AiProfile>('balanced');
  const [seed, setSeed] = useState('');
  return (
    <form
      className="setup"
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = Number.parseInt(seed, 10);
        // Seed üretmek UI'ın işi; Math.random yalnız rules içinde yasak.
        const s = Number.isFinite(parsed) ? parsed >>> 0 : Math.floor(Math.random() * 1_000_000);
        props.onStart({ seed: s, mine, ai: ai === 'random' ? pickAi(s) : ai, profile });
      }}
    >
      <h1>Düello</h1>
      <p className="setup__sub">Kart savaşı sandbox'ı · Faz 2a · Warrior ve Rogue</p>
      <fieldset>
        <legend>Sen</legend>
        {ARCHETYPE_IDS.map((id) => (
          <label key={id}>
            <input type="radio" name="mine" checked={mine === id} onChange={() => setMine(id)} />
            {ARCHETYPES[id].name}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Rakip job</legend>
        {ARCHETYPE_IDS.map((id) => (
          <label key={id}>
            <input type="radio" name="ai" checked={ai === id} onChange={() => setAi(id)} />
            {ARCHETYPES[id].name}
          </label>
        ))}
        <label>
          <input
            type="radio"
            name="ai"
            checked={ai === 'random'}
            onChange={() => setAi('random')}
          />
          Rastgele
        </label>
      </fieldset>
      <fieldset>
        <legend>Rakip AI</legend>
        {AI_PROFILES.map((p) => (
          <label key={p}>
            <input
              type="radio"
              name="profile"
              checked={profile === p}
              onChange={() => setProfile(p)}
            />
            {PROFILE_TR[p]}
          </label>
        ))}
      </fieldset>
      <label>
        Seed (boş bırakırsan rastgele)
        <input inputMode="numeric" value={seed} onChange={(e) => setSeed(e.target.value)} />
      </label>
      <div className="setup__actions">
        {props.onBack && (
          <button type="button" className="btn btn--ghost" onClick={props.onBack}>
            KASABA
          </button>
        )}
        <button type="submit" className="btn btn--gold">
          DESTENİ KUR
        </button>
      </div>
    </form>
  );
}
