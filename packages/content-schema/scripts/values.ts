// pnpm values → docs/savas-degerleri.md dosyasını content/ JSON'larından üretir.
import { writeFileSync } from 'node:fs';
import { valuesDocPath, valuesDocText } from '../src/values-doc';

writeFileSync(valuesDocPath, valuesDocText());
console.log(`yazıldı: ${valuesDocPath}`);
