/**
 * Kart seçimi: dokun → seçime ekle, seçiliye tekrar dokun → çıkar; MP yettiği kadar kart seçilir.
 * Oynamak yalnız "Oyna" ile; seçilenler seçim sırasıyla motora gider.
 */
export interface Selection {
  selected: readonly string[];
}

export type SelectionAction =
  /** fits: kartın maliyeti, seçili kartlardan sonra kalan MP'ye sığıyor mu. */
  | { type: 'tap'; iid: string; playable: boolean; fits: boolean }
  | { type: 'confirm' }
  | { type: 'cancel' };

export interface SelectionStep {
  state: Selection;
  /** Doluysa bu kartlar şimdi, bu sırayla oynanmalı. */
  play: readonly string[];
}

export const NO_SELECTION: Selection = { selected: [] };

export function selectionStep(s: Selection, a: SelectionAction): SelectionStep {
  switch (a.type) {
    case 'tap':
      if (s.selected.includes(a.iid))
        return { state: { selected: s.selected.filter((x) => x !== a.iid) }, play: [] };
      if (!a.playable || !a.fits) return { state: s, play: [] };
      return { state: { selected: [...s.selected, a.iid] }, play: [] };
    case 'confirm':
      return s.selected.length > 0
        ? { state: NO_SELECTION, play: s.selected }
        : { state: s, play: [] };
    case 'cancel':
      return { state: NO_SELECTION, play: [] };
  }
}

/** Elde olmayan ya da oynanamayan kartlar düşer; MP'yi aşan sondakiler de. */
export function validSelection(
  s: Selection,
  playableIids: readonly string[],
  mp: number,
  costOf: (iid: string) => number,
): string[] {
  const out: string[] = [];
  let left = mp;
  for (const iid of s.selected) {
    if (!playableIids.includes(iid)) continue;
    const cost = costOf(iid);
    if (cost > left) continue;
    left -= cost;
    out.push(iid);
  }
  return out;
}
