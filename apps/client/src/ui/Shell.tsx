import type { ReactNode } from 'react';
import { Coin, fmt } from './common';

export type Tab = 'kasaba' | 'sinir' | 'ors' | 'tezgah' | 'karakter';

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: 'kasaba',
    label: 'Kasaba',
    icon: <path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" />,
  },
  {
    id: 'sinir',
    label: 'Sınır',
    icon: <path d="M3 6 9 3l6 3 6-3v15l-6 3-6-3-6 3z" />,
  },
  {
    id: 'ors',
    label: 'Örs',
    icon: <path d="M3 7h18l-3 5h-4v3l3 4H7l3-4v-3H6z" />,
  },
  {
    id: 'tezgah',
    label: 'Tezgâh',
    icon: <path d="M3 4h18l-1 5H4zm2 7h14v9H5zm4 3v4h6v-4z" />,
  },
  {
    id: 'karakter',
    label: 'Karakter',
    icon: <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm-8 20c0-5 4-8 8-8s8 3 8 8z" />,
  },
];

export function TopBar({
  title,
  gold,
  level,
  right,
}: {
  title: string;
  gold: number;
  level: number;
  right?: ReactNode;
}) {
  return (
    <header className="topbar">
      <span className="chip chip--gold" title="Altın">
        <Coin />
        {fmt(gold)}
      </span>
      <h1>{title}</h1>
      {right ?? <span className="chip">Lv {level}</span>}
    </header>
  );
}

export function TabBar({
  tab,
  onTab,
  badges,
}: {
  tab: Tab;
  onTab: (t: Tab) => void;
  badges: Partial<Record<Tab, 'live' | 'alert' | number>>;
}) {
  return (
    <nav className="tabbar" aria-label="Ana menü">
      {TABS.map((t) => {
        const b = badges[t.id];
        return (
          <button
            type="button"
            key={t.id}
            className={t.id === tab ? 'on' : ''}
            aria-current={t.id === tab ? 'page' : undefined}
            onClick={() => onTab(t.id)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {t.icon}
            </svg>
            {t.label}
            {b !== undefined && (
              <span className={`tabbadge tabbadge--${typeof b === 'number' ? 'n' : b}`}>
                {typeof b === 'number' ? b : ''}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
