import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Kural motoru saf ve deterministik kalmalı (plan Görev 3).
const FORBIDDEN = [
  'Math.random',
  'Date.now',
  'new Date(',
  'performance.',
  'process.',
  'window.',
  'document.',
  'require(',
  'new Map(',
  'new Set(',
  'parseFloat',
  'toFixed',
];

const srcDir = import.meta.dirname;
const sources = readdirSync(srcDir, { recursive: true, encoding: 'utf8' }).filter(
  (f) => f.endsWith('.ts') && !f.endsWith('.test.ts') && !f.endsWith('test-fixtures.ts'),
);

describe('determinism guard', () => {
  it('finds source files', () => {
    expect(sources.length).toBeGreaterThan(0);
  });

  it.each(sources)('%s uses no forbidden API', (file) => {
    const text = readFileSync(join(srcDir, file), 'utf8');
    for (const token of FORBIDDEN) expect(text, `${file}: ${token}`).not.toContain(token);
  });
});
