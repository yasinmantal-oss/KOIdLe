// Yalnız `pnpm dev` sırasında çalışır (N6): Faz 2 maç formunu docs/faz-2/oturumlar.jsonl dosyasına ekler.
// Backend değildir; production build'e girmez.
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';

export const FAZ2_LOG = join(import.meta.dirname, '..', '..', 'docs', 'faz-2', 'oturumlar.jsonl');

export function gate1Plugin(): Plugin {
  return {
    name: 'koidle-faz2',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__faz2', (req, res) => {
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
            mkdirSync(dirname(FAZ2_LOG), { recursive: true });
            appendFileSync(FAZ2_LOG, `${JSON.stringify(record)}\n`);
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
