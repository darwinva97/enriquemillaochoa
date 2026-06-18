// Descarga una imagen (og:image) de una fuente por noticia, con crédito.
// - Eventos (BD): scripts/data.mjs
// - Artículos editoriales (markdown): src/content/noticias/*.md (usa fuenteUrl)
// Guarda en public/img/noticias/<slug>.<ext> y escribe scripts/images-manifest.json.
// Si ninguna fuente da imagen, genera un placeholder SVG con el emoji (sin crédito).
//
//   node scripts/fetch-images.mjs           # no re-descarga si ya existe
//   node scripts/fetch-images.mjs --force   # vuelve a descargar todo
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { eventos, slugify } from './data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'img', 'noticias');
const FORCE = process.argv.includes('--force');
mkdirSync(OUT_DIR, { recursive: true });

const UA = 'Mozilla/5.0 (compatible; EnriqueMillaBot/1.0; +https://enriquemillaochoa.page)';

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/gi, '/')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function ogImage(pageUrl) {
  const res = await fetch(pageUrl, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  for (const re of [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
  ]) {
    const m = html.match(re);
    if (m) return decode(m[1].trim());
  }
  throw new Error('sin og:image');
}

async function download(imgUrl, slug) {
  const res = await fetch(imgUrl, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`img HTTP ${res.status}`);
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (!ct.startsWith('image/')) throw new Error(`no es imagen (${ct})`);
  const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('gif') ? 'gif' : 'jpg';
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error('imagen demasiado pequeña');
  const file = `${slug}.${ext}`;
  writeFileSync(join(OUT_DIR, file), buf);
  return { file, bytes: buf.length };
}

function placeholderSVG(slug, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#86c98b"/><stop offset="1" stop-color="#f5d76e"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="360" font-size="240" text-anchor="middle">${emoji}</text>
  <text x="600" y="470" font-size="34" fill="#1b5e20" text-anchor="middle" font-family="sans-serif">Enrique Milla Ochoa</text>
</svg>`;
  const file = `${slug}.svg`;
  writeFileSync(join(OUT_DIR, file), svg);
  return file;
}

// Devuelve true si ya hay una imagen para el slug (cualquier extensión).
function existing(slug) {
  return ['jpg', 'png', 'webp', 'gif', 'svg'].map((e) => `${slug}.${e}`).find((f) => existsSync(join(OUT_DIR, f)));
}

async function resolverImagen({ slug, emoji, sources }) {
  const have = existing(slug);
  if (have && !FORCE) return null; // ya resuelto; el manifest existente se conserva

  for (const [fuente, pageUrl, titulo] of sources) {
    try {
      const img = await ogImage(pageUrl);
      const { file, bytes } = await download(img, slug);
      console.log(`  ✓ ${slug}  <- ${fuente}  (${Math.round(bytes / 1024)} KB)`);
      return {
        image: `/img/noticias/${file}`,
        credit: `Foto: ${fuente}`,
        creditUrl: pageUrl,
        creditTitulo: titulo,
      };
    } catch (e) {
      console.log(`  · ${fuente}: ${e.message}`);
    }
  }
  const file = placeholderSVG(slug, emoji);
  console.log(`  ⚠ ${slug}: sin imagen de fuente, placeholder`);
  return { image: `/img/noticias/${file}`, credit: '', creditUrl: '', creditTitulo: '' };
}

// --- Artículos editoriales (markdown) ---
function leerEditoriales() {
  const dir = join(ROOT, 'src', 'content', 'noticias');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(dir, f), 'utf8');
      const fm = raw.match(/^---\n([\s\S]*?)\n---/);
      const get = (k) => (fm?.[1].match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1] || '').trim();
      return {
        slug: f.replace(/\.md$/, ''),
        emoji: get('emoji') || '📰',
        fuente: get('fuente'),
        fuenteUrl: get('fuenteUrl'),
        titulo: get('titulo'),
      };
    });
}

const manifestPath = join(__dirname, 'images-manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

console.log('Eventos (BD):');
for (const e of eventos) {
  const r = await resolverImagen(e);
  if (r) manifest[e.slug] = r;
}

console.log('Editoriales (markdown):');
for (const a of leerEditoriales()) {
  const sources = a.fuenteUrl ? [[a.fuente || 'Fuente', a.fuenteUrl, a.titulo]] : [];
  const r = await resolverImagen({ slug: a.slug, emoji: a.emoji, sources });
  if (r) manifest[a.slug] = r;
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nManifest -> ${manifestPath} (${Object.keys(manifest).length} entradas)`);
