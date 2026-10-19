import { readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
// Fresh Figma export URLs belong in a temporary input file, not in source control.
const manifest = process.argv[2];
if (!manifest) throw new Error('Pass a fresh export manifest: node scripts/download-figma-assets.mjs /tmp/asset-urls.json');
const assets = JSON.parse(readFileSync(manifest, 'utf8'));
if (!assets.every(asset => typeof asset.url === 'string' && /^https:\/\/www\.figma\.com\//.test(asset.url) && /^[a-zA-Z0-9._-]+$/.test(asset.file))) throw new Error('Invalid Figma asset manifest');
mkdirSync('public/assets', { recursive: true });
for (const { file, url } of assets) execFileSync('curl', ['--connect-timeout', '10', '--max-time', '30', '--silent', '--show-error', '--fail', '--location', url, '--output', `public/assets/${file}`]);
console.log(`Downloaded ${assets.length} Figma assets.`);
