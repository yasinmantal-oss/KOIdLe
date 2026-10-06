import { join } from 'node:path';
import { loadAiProfiles, loadBattleConfig, loadCards } from './load';
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
  renderValuesTable(loadBattleConfig(), loadCards('warrior'), loadAiProfiles());
