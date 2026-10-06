// pnpm --filter @koidle/client artifact
// Vite build çıktısını claude.ai Artifact olarak yayınlanabilecek tek bir HTML parçasına çevirir
// (JS ve CSS gömülü). Çıktı: dist/koidle-savas.html
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
execSync('npx vite build', { cwd: root, stdio: 'inherit' });

const assets = join(root, 'dist', 'assets');
const files = readdirSync(assets);
const read = (ext) =>
  files
    .filter((f) => f.endsWith(ext))
    .map((f) => readFileSync(join(assets, f), 'utf8'))
    .join('\n');

const js = read('.js').replaceAll('</script', '<\\/script');
const css = read('.css');

const html = `<title>KOIdLe Savaş Sandbox</title>
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;
writeFileSync(join(root, 'dist', 'koidle-savas.html'), html);
console.log(`dist/koidle-savas.html (${Math.round(html.length / 1024)} KB)`);
