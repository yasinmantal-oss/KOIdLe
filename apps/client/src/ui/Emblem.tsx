import type { ArchetypeId } from '@koidle/content-schema';

/** Her arketip için sade, özgün SVG amblem (ikon kütüphanesi ya da oyun varlığı yok). */
export function Emblem({ id, size = 48 }: { id: ArchetypeId; size?: number }) {
  return (
    <svg
      className={`emblem emblem--${id}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={EMBLEM_NAME[id]}
    >
      {id === 'warrior' && (
        <g>
          <path
            d="M24 4 L40 10 V24 C40 34 33 41 24 45 C15 41 8 34 8 24 V10 Z"
            fill="#6b7c93"
            stroke="#e8d7a8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M24 9 L35 13 V24 C35 31 30 37 24 40 Z" fill="#8fa3bd" />
          <path d="M24 14 V34 M16 22 H32" stroke="#1d2430" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {id === 'assassin' && (
        <g>
          <path
            d="M24 3 L29 27 L24 31 L19 27 Z"
            fill="#c9d1da"
            stroke="#1b1f26"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M24 3 L24 31" stroke="#8a95a3" strokeWidth="1.5" />
          <rect x="13" y="30" width="22" height="4.5" rx="2" fill="#d9a441" stroke="#1b1f26" />
          <rect x="21.5" y="34" width="5" height="9" rx="1.5" fill="#5a3a2a" stroke="#1b1f26" />
          <circle cx="24" cy="45" r="2.4" fill="#d9a441" stroke="#1b1f26" />
          <path
            d="M9 12 L15 18 M39 12 L33 18"
            stroke="#b83a3a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}
      {id === 'archer' && (
        <g>
          <path
            d="M14 5 C34 12 34 36 14 43"
            fill="none"
            stroke="#a8743a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M14 5 L14 43" stroke="#e8d7a8" strokeWidth="1.5" />
          <path d="M10 24 H42" stroke="#c9d1da" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 24 L35 19 V29 Z" fill="#c9d1da" stroke="#1b1f26" strokeLinejoin="round" />
          <path
            d="M10 24 L6 20 M10 24 L6 28"
            stroke="#3f9a52"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}

export const EMBLEM_NAME: Record<ArchetypeId, string> = {
  warrior: 'Kalkan ve haç amblemi',
  assassin: 'Hançer amblemi',
  archer: 'Yay ve ok amblemi',
};
