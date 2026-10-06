// Yalnız `pnpm dev` sırasında çalışır (N6): Gate 1 formunu docs/gate-1/oturumlar.jsonl dosyasına ekler.
// Backend değildir; production build'e girmez.
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';

export const GATE1_LOG = join(import.meta.dirname, '..', '..', 'docs', 'gate-1', 'oturumlar.jsonl');

export function gate1Plugin(): Plugin {
  return {
    name: 'koidle-gate1',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__gate1', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const record = JSON.parse(body) as unknown;
            mkdirSync(dirname(GATE1_LOG), { recursive: true });
            appendFileSync(GATE1_LOG, `${JSON.stringify(record)}\n`);
            res.statusCode = 204;
          } catch {
            res.statusCode = 400;
          }
          res.end();
        });
      });
    },
  };
}
