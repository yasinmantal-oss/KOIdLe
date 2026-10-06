import { type ArchetypeId, validateDeck } from '@koidle/content-schema';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BattleScreen } from './components/BattleScreen';
import { DeckBuilder } from './components/DeckBuilder';
import { SetupScreen } from './components/SetupScreen';
import { type LoadedContent, loadContent } from './content';
import { readSavedDeck } from './deck';
import type { MatchSetup } from './match';
import { KarakterScreen } from './screens/Karakter';
import { KasabaScreen } from './screens/Kasaba';
import { OrsScreen } from './screens/Ors';
import { RaidOverlay } from './screens/RaidOverlay';
import { SinirScreen } from './screens/Sinir';
import { TezgahScreen } from './screens/Tezgah';
import type { ScreenProps } from './screens/types';
import { Embers } from './ui/common';
import { type Tab, TabBar, TopBar } from './ui/Shell';
import { slotDef } from './world/protoData';
import { useWorld } from './world/useWorld';
import { applyRaidOutcome, autoRaidWon, type Raid } from './world/world';

const loaded = loadContent();

type Mode =
  | { kind: 'world' }
  | { kind: 'duel'; setup: MatchSetup | null; battle: { deck: string[]; key: number } | null }
  | { kind: 'deck'; archetype: ArchetypeId }
  | { kind: 'raid'; setup: MatchSetup; deck: string[]; raid: Raid };

interface Toast {
  id: number;
  text: string;
  tone: 'ok' | 'bad' | 'info';
}

const TITLES: Record<Tab, string> = {
  kasaba: 'KASABA',
  sinir: 'SINIR BÖLGESİ',
  ors: 'ÖRS',
  tezgah: 'TEZGÂHIM',
  karakter: 'KARAKTER',
};

function deckFor(content: LoadedContent, id: ArchetypeId): string[] {
  const saved = readSavedDeck(id);
  return saved && validateDeck(saved, id, content.cards, content.config).length === 0
    ? saved
    : content.presets[id];
}

export function App() {
  if (!loaded.ok) {
    return (
      <main className="content-error">
        <h1>İçerik hatası</h1>
        <p>Savaş açılmadı. content/ altındaki JSON düzeltilmeli:</p>
        <pre>{loaded.message}</pre>
      </main>
    );
  }
  return <Game content={loaded.content} />;
}

function Game({ content }: { content: LoadedContent }) {
  const [mode, setMode] = useState<Mode>({ kind: 'world' });
  const [tab, setTab] = useState<Tab>('kasaba');
  const [anvilFocus, setAnvilFocus] = useState<string | null>(null);
  const { world, update, reset, offlineNote, dismissNote } = useWorld(mode.kind !== 'world');
  const [toastState, setToast] = useState<Toast | null>(null);
  const toastId = useRef(0);

  const toast = useCallback((text: string, tone: Toast['tone'] = 'info') => {
    toastId.current += 1;
    setToast({ id: toastId.current, text, tone });
  }, []);
  useEffect(() => {
    if (!toastState) return;
    const t = setTimeout(() => setToast((c) => (c?.id === toastState.id ? null : c)), 2600);
    return () => clearTimeout(t);
  }, [toastState]);

  const go = useCallback((t: Tab) => {
    setTab(t);
    window.scrollTo?.({ top: 0 });
  }, []);

  const raidAuto = useCallback(() => {
    if (!world.raid) return;
    const won = autoRaidWon(world);
    update((w) => applyRaidOutcome(w, won));
    if (won) toast('AI senin destenle savaştı: baskın püskürtüldü!', 'ok');
    else {
      toast('AI kaybetti: ganimetin bir kısmı gitti.', 'bad');
      go('kasaba');
    }
  }, [world, update, toast, go]);

  // ---- Savaş ekranları (tam ekran, sekme çubuğu yok) ----
  if (mode.kind === 'raid') {
    return (
      <div className="app app--battle">
        <BattleScreen
          key={mode.raid.seed}
          content={content}
          setup={mode.setup}
          deck={mode.deck}
          gear={world.equipped}
          onNew={() => undefined}
          raid={{
            foeName: mode.raid.raider.name,
            foeLevel: mode.raid.level,
            myName: world.player.name,
            myLevel: world.player.level,
            onFinish: (won) => {
              update((w) => applyRaidOutcome(w, won));
              setMode({ kind: 'world' });
              go(won ? 'sinir' : 'kasaba');
              toast(
                won ? 'Baskın püskürtüldü. Ganimet sende.' : 'Düştün. Kalan ganimet kasabada.',
                won ? 'ok' : 'bad',
              );
            },
          }}
        />
      </div>
    );
  }

  if (mode.kind === 'duel') {
    const exit = () => setMode({ kind: 'world' });
    if (!mode.setup) {
      return (
        <div className="app app--plain">
          <SetupScreen
            initialMine={world.player.archetype}
            onBack={exit}
            onStart={(setup) => setMode({ kind: 'duel', setup, battle: null })}
          />
        </div>
      );
    }
    if (!mode.battle) {
      const setup = mode.setup;
      return (
        <div className="app app--plain">
          <DeckBuilder
            content={content}
            archetypeId={setup.mine}
            onBack={() => setMode({ kind: 'duel', setup: null, battle: null })}
            onConfirm={(deck) =>
              setMode({ kind: 'duel', setup, battle: { deck, key: Date.now() } })
            }
          />
        </div>
      );
    }
    return (
      <div className="app app--battle">
        <BattleScreen
          key={mode.battle.key}
          content={content}
          setup={mode.setup}
          deck={mode.battle.deck}
          gear={mode.setup.mine === world.player.archetype ? world.equipped : null}
          onNew={() => setMode({ kind: 'duel', setup: null, battle: null })}
          onExit={exit}
        />
      </div>
    );
  }

  if (mode.kind === 'deck') {
    return (
      <div className="app app--plain">
        <DeckBuilder
          content={content}
          archetypeId={mode.archetype}
          confirmLabel="Desteyi kaydet"
          onBack={() => setMode({ kind: 'world' })}
          onConfirm={() => {
            setMode({ kind: 'world' });
            toast('Deste kaydedildi. Baskınlarda bu deste oynar.', 'ok');
          }}
        />
      </div>
    );
  }

  // ---- Dünya ----
  const props: ScreenProps = { world, update, go, toast };
  const onDuel = () => setMode({ kind: 'duel', setup: null, battle: null });
  const unseen = world.stall.sales.filter((s) => !s.seen).length;
  const farmTitle =
    tab === 'sinir' && world.farm
      ? 'FARMDASIN'
      : tab === 'kasaba' && world.summary
        ? 'DÖNÜŞ'
        : TITLES[tab];

  return (
    <div className="app">
      <Embers />
      <TopBar title={farmTitle} gold={world.player.gold} level={world.player.level} />
      <main className="app__main" key={tab}>
        {offlineNote && tab === 'kasaba' && !world.summary && (
          <button type="button" className="offline" onClick={dismissNote}>
            <b>Sen yokken</b>
            {offlineNote.farmTicks > 0 &&
              ` · farm ${world.farm ? slotDef(world.farm.slotId).name : ''} sürdü`}
            {offlineNote.sales > 0 && ` · tezgâhta ${offlineNote.sales} satış`}
            <span aria-hidden="true"> ✕</span>
          </button>
        )}
        {tab === 'kasaba' && <KasabaScreen {...props} onDuel={onDuel} />}
        {tab === 'sinir' && <SinirScreen {...props} />}
        {tab === 'ors' && <OrsScreen {...props} focus={anvilFocus} />}
        {tab === 'tezgah' && <TezgahScreen {...props} />}
        {tab === 'karakter' && (
          <KarakterScreen
            {...props}
            onDeck={() => setMode({ kind: 'deck', archetype: world.player.archetype })}
            onDuel={onDuel}
            onAnvil={(uid) => {
              setAnvilFocus(uid);
              go('ors');
            }}
            onReset={() => {
              reset();
              toast('Dünya sıfırlandı.', 'info');
            }}
          />
        )}
      </main>
      <TabBar
        tab={tab}
        onTab={go}
        badges={{
          ...(world.farm ? { sinir: world.farm.threat ? 'alert' : 'live' } : {}),
          ...(unseen > 0 ? { tezgah: unseen } : {}),
          ...(world.summary ? { kasaba: 'live' } : {}),
        }}
      />
      {world.raid && (
        <RaidOverlay
          key={world.raid.seed}
          world={world}
          onAuto={raidAuto}
          onFight={() => {
            const raid = world.raid;
            if (!raid) return;
            const mine = world.player.archetype;
            setMode({
              kind: 'raid',
              raid,
              deck: deckFor(content, mine),
              setup: { seed: raid.seed, mine, ai: raid.raider.archetype, profile: 'balanced' },
            });
          }}
        />
      )}
      {toastState && (
        <div key={toastState.id} className={`toast toast--${toastState.tone}`} role="status">
          {toastState.text}
        </div>
      )}
    </div>
  );
}
