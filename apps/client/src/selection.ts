/** Kart seçimi: dokun → seç, tekrar dokun ya da "Oyna" → oyna. Motora yalnız onayda gider. */
export interface Selection {
  selected: string | null;
}

export type SelectionAction =
  | { type: 'tap'; iid: string; playable: boolean }
  | { type: 'confirm' }
  | { type: 'cancel' };

export interface SelectionStep {
  state: Selection;
  /** Doluysa bu kart şimdi oynanmalı. */
  play: string | null;
}

export const NO_SELECTION: Selection = { selected: null };

export function selectionStep(s: Selection, a: SelectionAction): SelectionStep {
  switch (a.type) {
    case 'tap':
      if (!a.playable) return { state: s, play: null };
      if (s.selected === a.iid) return { state: NO_SELECTION, play: a.iid };
      return { state: { selected: a.iid }, play: null };
    case 'confirm':
      return s.selected ? { state: NO_SELECTION, play: s.selected } : { state: s, play: null };
    case 'cancel':
      return { state: NO_SELECTION, play: null };
  }
}

/** Seçili kart artık elde değilse ya da oynanamazsa seçim düşer. */
export function validSelection(s: Selection, playableIids: readonly string[]): string | null {
  return s.selected && playableIids.includes(s.selected) ? s.selected : null;
}
