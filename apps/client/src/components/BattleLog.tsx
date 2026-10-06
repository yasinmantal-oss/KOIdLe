import type { BattleEvent, CardDef } from '@koidle/rules';
import { useEffect, useRef } from 'react';
import { formatEvent } from '../format';

export function BattleLog({ log, cards }: { log: BattleEvent[]; cards: Record<string, CardDef> }) {
  const end = useRef<HTMLLIElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  });
  const lines = log.map((e) => formatEvent(e, cards)).filter((l): l is string => l !== null);
  return (
    <ol className="log" aria-label="Savaş kaydı">
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: kayıt yalnız sona eklenir
        <li key={i} className={line.startsWith('—') ? 'log__turn' : ''}>
          {line}
        </li>
      ))}
      <li ref={end} aria-hidden />
    </ol>
  );
}
