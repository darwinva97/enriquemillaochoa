// Sincroniza cardImage/bannerImage/imageCredit/imageCreditUrl en los
// frontmatters de src/content/noticias/*.md desde scripts/images-manifest.json.
//
//   node scripts/patch-frontmatter.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const manifest = JSON.parse(readFileSync(join(__dirname, 'images-manifest.json'), 'utf8'));
const dir = join(ROOT, 'src', 'content', 'noticias');

for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  const m = manifest[slug];
  if (!m) {
    console.log('sin manifest:', slug);
    continue;
  }
  let raw = readFileSync(join(dir, f), 'utf8');
  raw = raw.replace(/^(cardImage|bannerImage|imageCredit|imageCreditUrl|imagen):.*\n/gm, '');
  const fields = [`cardImage: "${m.image}"`, `bannerImage: "${m.image}"`];
  if (m.credit) fields.push(`imageCredit: "${m.credit}"`);
  if (m.creditUrl) fields.push(`imageCreditUrl: "${m.creditUrl}"`);
  const parts = raw.split(/\n---\n/);
  parts[0] = parts[0] + '\n' + fields.join('\n');
  writeFileSync(join(dir, f), parts.join('\n---\n'));
  console.log('patched:', slug, '->', m.image.split('/').pop());
}
