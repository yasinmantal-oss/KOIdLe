import { join } from 'node:path';
import {
  loadAiPlanner,
  loadAiProfiles,
  loadAllCards,
  loadBattleConfig,
  loadPresetDecks,
} from './load';
import { renderValuesTable } from './values-table';

export const valuesDocPath = join(
  import.meta.dirname,
  '..',
  '..',
  '..',
  'docs',
  'savas-degerleri.md',
);

export const valuesDocText = (): string =>
  renderValuesTable(
    loadBattleConfig(),
    loadAllCards(),
    loadAiProfiles(),
    loadPresetDecks(),
    loadAiPlanner(),
  );
