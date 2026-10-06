import { useState } from 'react';
import { BattleScreen } from './components/BattleScreen';
import { DeckBuilder } from './components/DeckBuilder';
import { SetupScreen } from './components/SetupScreen';
import { loadContent } from './content';
import type { MatchSetup } from './match';

const loaded = loadContent();

export function App() {
  const [setup, setSetup] = useState<MatchSetup | null>(null);
  const [battle, setBattle] = useState<{ deck: string[]; key: number } | null>(null);

  if (!loaded.ok) {
    return (
      <main className="content-error">
        <h1>İçerik hatası</h1>
        <p>Savaş açılmadı. content/ altındaki JSON düzeltilmeli:</p>
        <pre>{loaded.message}</pre>
      </main>
    );
  }
  if (!setup) return <SetupScreen onStart={setSetup} />;
  if (!battle) {
    return (
      <DeckBuilder
        content={loaded.content}
        archetypeId={setup.mine}
        onBack={() => setSetup(null)}
        onConfirm={(deck) => setBattle({ deck, key: Date.now() })}
      />
    );
  }
  return (
    <BattleScreen
      key={battle.key}
      content={loaded.content}
      setup={setup}
      deck={battle.deck}
      onNew={() => {
        setBattle(null);
        setSetup(null);
      }}
    />
  );
}
