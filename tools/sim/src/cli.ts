// pnpm sim → reports/sim/latest.{md,json,csv}. İsteğe bağlı: pnpm sim -- <seedSayısı>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSimInput } from './load-input';
import { renderCsv, renderMarkdown, summarize } from './report';
import { runMatrix, seedRange } from './run';

const count = Number(process.argv[2] ?? 100);
const seeds = seedRange(1, count);
const input = loadSimInput();
const started = performance.now();
const records = runMatrix(input, seeds);
const summary = summarize(records, input.cards);

const dir = join(import.meta.dirname, '..', '..', '..', 'reports', 'sim');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'latest.md'), renderMarkdown(summary, input.config, seeds));
// Özet okunaklı, maç kayıtları satır başına bir kayıt (dosya küçük kalsın, diff okunur olsun).
const head = JSON.stringify(
  { seeds: { from: seeds[0], count }, config: input.config, summary },
  null,
  2,
);
const lines = records.map((r) => `    ${JSON.stringify(r)}`).join(',\n');
writeFileSync(
  join(dir, 'latest.json'),
  `${head.slice(0, -2)},\n  "records": [\n${lines}\n  ]\n}\n`,
);
writeFileSync(join(dir, 'latest.csv'), renderCsv(records));
console.log(
  `${records.length} maç, ${Math.round(performance.now() - started)} ms → reports/sim/latest.{md,json,csv}`,
);
