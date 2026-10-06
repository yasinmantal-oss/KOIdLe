import type { AiProfile } from '@koidle/ai';
import { useState } from 'react';
import { BattleScreen } from './components/BattleScreen';
import { SetupScreen } from './components/SetupScreen';
import { loadContent } from './content';

const loaded = loadContent();

export function App() {
  const [match, setMatch] = useState<{ seed: number; profile: AiProfile; key: number } | null>(
    null,
  );

  if (!loaded.ok) {
    return (
      <main className="content-error">
        <h1>İçerik hatası</h1>
        <p>Savaş açılmadı. content/ altındaki JSON düzeltilmeli:</p>
        <pre>{loaded.message}</pre>
      </main>
    );
  }
  if (!match) {
    return (
      <SetupScreen onStart={(seed, profile) => setMatch({ seed, profile, key: Date.now() })} />
    );
  }
  return (
    <BattleScreen
      key={match.key}
      content={loaded.content}
      seed={match.seed}
      profile={match.profile}
      onNew={() => setMatch(null)}
    />
  );
}
