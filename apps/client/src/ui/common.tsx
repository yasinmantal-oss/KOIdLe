import type { CSSProperties, ReactNode } from 'react';
import { type GearSlot, itemDef, SLOT_TR } from '../world/protoData';
import type { Item } from '../world/world';

export const fmt = (n: number): string => Math.round(n).toLocaleString('tr-TR');
export const pct = (bp: number): string => `%${Math.round(bp / 100)}`;

export function Coin() {
  return <span className="coin" aria-hidden="true" />;
}

export function Gold({ amount, sign = false }: { amount: number; sign?: boolean }) {
  return (
    <span className="gold-amt">
      <Coin />
      {sign && amount > 0 ? '+' : ''}
      {fmt(amount)}
    </span>
  );
}

export function Plus({ n }: { n: number }) {
  if (n <= 0) return null;
  return <span className={`plus${n >= 7 ? ' plus--hot' : ''}`}>+{n}</span>;
}

/** Çerçeveli item karesi: rarity rengi, +seviye rozeti, isteğe bağlı boyut. */
export function ItemTile({
  item,
  size = 'md',
  empty,
  onClick,
  selected,
  label,
}: {
  item: Item | null;
  size?: 'sm' | 'md' | 'lg';
  empty?: GearSlot;
  onClick?: () => void;
  selected?: boolean;
  label?: string;
}) {
  const cls = `tile tile--${size}${selected ? ' tile--sel' : ''}`;
  if (!item) {
    const inner = (
      <>
        <span className="tile__ghost">
          {empty === 'weapon' ? '⚔' : empty === 'armor' ? '⛨' : '◈'}
        </span>
        {empty && <span className="tile__slot">{SLOT_TR[empty]}</span>}
      </>
    );
    return onClick ? (
      <button type="button" className={`${cls} tile--empty`} onClick={onClick} aria-label={label}>
        {inner}
      </button>
    ) : (
      <span className={`${cls} tile--empty`}>{inner}</span>
    );
  }
  const d = itemDef(item.baseId);
  const content = (
    <>
      <span className="tile__icon" aria-hidden="true">
        {d.icon}
      </span>
      {item.plus > 0 && <span className="tile__plus">+{item.plus}</span>}
    </>
  );
  const full = `${cls} r-${d.rarity}${item.plus >= 7 ? ' tile--glow' : ''}`;
  return onClick ? (
    <button
      type="button"
      className={full}
      onClick={onClick}
      aria-label={label ?? `${d.name}${item.plus ? ` +${item.plus}` : ''}`}
      aria-pressed={selected}
    >
      {content}
    </button>
  ) : (
    <span className={full} title={d.name}>
      {content}
    </span>
  );
}

export function ItemName({ item }: { item: Item }) {
  const d = itemDef(item.baseId);
  return (
    <span className={`iname r-${d.rarity}`}>
      <Plus n={item.plus} />
      {d.name}
    </span>
  );
}

export function Bar({
  kind,
  value,
  max,
  label,
}: {
  kind: 'hp' | 'mp' | 'xp' | 'heat' | 'loot';
  value: number;
  max: number;
  label?: ReactNode;
}) {
  const w = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`bar bar--${kind}`}>
      <i style={{ width: `${w}%` } as CSSProperties} />
      {label !== undefined && <b>{label}</b>}
    </div>
  );
}

export function Panel({
  children,
  className = '',
  as = 'section',
}: {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div';
}) {
  const Tag = as;
  return <Tag className={`panel ${className}`}>{children}</Tag>;
}

export function Embers({ count = 14 }: { count?: number }) {
  return (
    <div className="embers" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i
          // biome-ignore lint/suspicious/noArrayIndexKey: sabit dekor
          key={i}
          style={
            {
              left: `${(i * 37) % 100}%`,
              animationDuration: `${7 + ((i * 13) % 9)}s`,
              animationDelay: `${(i * 1.7) % 9}s`,
              '--drift': `${((i * 23) % 60) - 30}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function NationDots({ occ, mineIdx }: { occ: ('A' | 'B' | null)[]; mineIdx?: number }) {
  return (
    <span className="dots" role="img" aria-label={`${occ.filter((o) => o !== null).length}/6 dolu`}>
      {occ.map((o, i) => (
        <i
          // biome-ignore lint/suspicious/noArrayIndexKey: sabit 6 yer
          key={i}
          className={`${o === 'A' ? 'd-a' : o === 'B' ? 'd-b' : 'd-e'}${i === mineIdx ? ' d-me' : ''}`}
        />
      ))}
    </span>
  );
}
