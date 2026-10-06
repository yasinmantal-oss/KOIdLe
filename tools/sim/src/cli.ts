// pnpm sim → reports/sim/latest.{md,json,csv}. İsteğe bağlı: pnpm sim -- <jobSeedSayısı=100> <profilSeedSayısı=10>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSimInput } from './load-input';
import { renderCsv, renderMarkdown, summarize } from './report';
import { runJobMatrix, runProfileMatrix, seedRange } from './run';

const args = process.argv.slice(2).filter((a) => a !== '--');
const jobCount = Number(args[0] ?? 100);
const profileCount = Number(args[1] ?? 10);
const jobSeeds = seedRange(1, jobCount);
const profileSeeds = seedRange(1, profileCount);
const input = loadSimInput();
const started = performance.now();
const records = [...runJobMatrix(input, jobSeeds), ...runProfileMatrix(input, profileSeeds)];
const summary = summarize(records, input);

const dir = join(import.meta.dirname, '..', '..', '..', 'reports', 'sim');
mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, 'latest.md'),
  renderMarkdown(summary, input.config, { jobSeeds, profileSeeds, planner: input.planner }),
);
// Özet okunaklı, maç kayıtları satır başına bir kayıt (dosya küçük kalsın, diff okunur olsun).
const head = JSON.stringify(
  {
    seeds: {
      job: { from: jobSeeds[0], count: jobCount },
      profile: { from: 1, count: profileCount },
    },
    config: input.config,
    planner: input.planner,
    decks: input.decks,
    summary,
  },
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
