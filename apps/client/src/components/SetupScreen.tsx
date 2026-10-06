import { AI_PROFILES, type AiProfile } from '@koidle/ai';
import { useState } from 'react';

const PROFILE_TR: Record<AiProfile, string> = {
  aggressive: 'Saldırgan',
  balanced: 'Dengeli',
  defensive: 'Savunmacı',
};

export function SetupScreen(props: { onStart: (seed: number, profile: AiProfile) => void }) {
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
        props.onStart(s, profile);
      }}
    >
      <h1>KOIdLe · Savaş Sandbox</h1>
      <p>Warrior vs Warrior · Gate 1</p>
      <fieldset>
        <legend>Rakip AI</legend>
        {AI_PROFILES.map((p) => (
          <label key={p}>
            <input type="radio" checked={profile === p} onChange={() => setProfile(p)} />
            {PROFILE_TR[p]}
          </label>
        ))}
      </fieldset>
      <label>
        Seed (boş bırakırsan rastgele)
        <input inputMode="numeric" value={seed} onChange={(e) => setSeed(e.target.value)} />
      </label>
      <button type="submit">Savaşa Başla</button>
    </form>
  );
}
