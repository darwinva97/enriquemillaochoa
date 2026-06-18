// Descarga una imagen por noticia (og:image de una fuente, o un override
// curado de Wikimedia Commons), la OPTIMIZA a WebP (máx 1200px, q80) con sharp,
// y da crédito. Guarda en public/img/noticias/<slug>.webp y escribe
// scripts/images-manifest.json. Si no hay imagen, genera un placeholder SVG.
//
//   node scripts/fetch-images.mjs           # no re-descarga si ya existe
//   node scripts/fetch-images.mjs --force   # regenera todo
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { eventos } from './data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'img', 'noticias');
const FORCE = process.argv.includes('--force');
mkdirSync(OUT_DIR, { recursive: true });

const UA = 'Mozilla/5.0 (compatible; EnriqueMillaBot/1.0; +https://enriquemillaochoa.page)';
const MAX_W = 1200;
const EXTS = ['webp', 'jpg', 'jpeg', 'png', 'gif', 'svg'];

// Imágenes curadas (Wikimedia Commons, licencia CC con atribución) para
// noticias editoriales cuya fuente no expone og:image utilizable.
const OVERRIDES = {
  'estudio-quechua-2021': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Peru_-_Quechua_1.jpg/1280px-Peru_-_Quechua_1.jpg',
    credit: 'Foto: Julian hne / Wikimedia Commons (CC BY-SA 4.0)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Peru_-_Quechua_1.jpg',
  },
  'tesis-unmsm-pobreza-2024': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Taller_-_Facultad_de_Psicolog%C3%ADa_de_la_Universidad_Nacional_Mayor_de_San_Marcos.jpg',
    credit: 'Foto: Kanon6996 / Wikimedia Commons (CC BY-SA 4.0)',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Taller_-_Facultad_de_Psicolog%C3%ADa_de_la_Universidad_Nacional_Mayor_de_San_Marcos.jpg',
  },
  'caminata-seguridad-2016': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simulacro_Nacional%2C_Los_Olivos%2C_Lima%2C_Per%C3%BA.jpg/1280px-Simulacro_Nacional%2C_Los_Olivos%2C_Lima%2C_Per%C3%BA.jpg',
    credit: 'Foto: Dalma Amaro Vasquez / Wikimedia Commons (CC BY-SA 4.0)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Simulacro_Nacional,_Los_Olivos,_Lima,_Per%C3%BA.jpg',
  },
  'mega-polvos-construccion': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Plaza_de_armas_de_los_olivos_%2CLima_%2CPer%C3%BA.jpg',
    credit: 'Foto: Anzenarturo / Wikimedia Commons (CC BY-SA 3.0)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Plaza_de_armas_de_los_olivos_,Lima_,Per%C3%BA.jpg',
  },
  // Las 4 noticias municipales comparten un og:image institucional genérico;
  // las sustituimos por imágenes temáticas y distintas de Wikimedia Commons.
  'alcalde-premio-internacional-2024': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Los_Olivos.jpg/1280px-Los_Olivos.jpg',
    credit: 'Foto: Jonathan Marco Corredor Obispo / Wikimedia Commons (CC BY-SA 4.0)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Los_Olivos.jpg',
  },
  'clinica-veterinaria-patitas-2025': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Hospital_Veterinario_Oasis_en_Lima_Per%C3%BA_%288%29.jpg',
    credit: 'Foto: Bella Atenea Arias Vasquez / Wikimedia Commons (CC BY-SA 4.0)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Hospital_Veterinario_Oasis_en_Lima_Per%C3%BA_(8).jpg',
  },
  'convenio-diprove-2025': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Polic%C3%ADa_Nacional_del_Per%C3%BA%2C_Divisi%C3%B3n_de_protecci%C3%B3n_de_carreteras.jpg/1280px-Polic%C3%ADa_Nacional_del_Per%C3%BA%2C_Divisi%C3%B3n_de_protecci%C3%B3n_de_carreteras.jpg',
    credit: 'Foto: Juan Daniel Chumbe Zapata / Wikimedia Commons (CC BY-SA 4.0)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Polic%C3%ADa_Nacional_del_Per%C3%BA,_Divisi%C3%B3n_de_protecci%C3%B3n_de_carreteras.jpg',
  },
  'parque-leon-dormido-2025': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Laguna_parque_expo_lima.jpg',
    credit: 'Foto: Parque de la Exposición, Lima / Wikimedia Commons (dominio público)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Laguna_parque_expo_lima.jpg',
  },
};

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&#x2F;/gi, '/').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

// fetch con reintentos: evita que un timeout transitorio degrade a placeholder.
async function fetchRetry(url, opts = {}, intentos = 3) {
  let err;
  for (let i = 0; i < intentos; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': UA },
        signal: AbortSignal.timeout(opts.timeout ?? 25000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      err = e;
    }
  }
  throw err;
}

async function ogImage(pageUrl) {
  const res = await fetchRetry(pageUrl, { timeout: 20000 });
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

// Descarga + optimiza a WebP. Devuelve el nombre de archivo.
async function descargarOptimizar(imgUrl, slug, opts = {}) {
  const res = await fetchRetry(imgUrl, { timeout: 25000 });
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (ct && !ct.startsWith('image/')) throw new Error(`no es imagen (${ct})`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error('imagen demasiado pequeña');
  const webp = await sharp(buf)
    .rotate() // respeta orientación EXIF
    .resize({ width: opts.width ?? MAX_W, withoutEnlargement: true })
    .webp({ quality: opts.quality ?? 80 })
    .toBuffer();
  limpiar(slug);
  const file = `${slug}.webp`;
  writeFileSync(join(OUT_DIR, file), webp);
  return { file, bytes: webp.length };
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
  limpiar(slug);
  const file = `${slug}.svg`;
  writeFileSync(join(OUT_DIR, file), svg);
  return file;
}

// Borra cualquier imagen previa del slug (cualquier extensión).
function limpiar(slug) {
  for (const e of EXTS) {
    const f = join(OUT_DIR, `${slug}.${e}`);
    if (existsSync(f)) unlinkSync(f);
  }
}
function existing(slug) {
  return EXTS.map((e) => `${slug}.${e}`).find((f) => existsSync(join(OUT_DIR, f)));
}

async function resolverImagen({ slug, emoji, sources }) {
  if (existing(slug) && !FORCE) return null;

  // 1) Override curado (Wikimedia)
  const ov = OVERRIDES[slug];
  if (ov) {
    try {
      const { file, bytes } = await descargarOptimizar(ov.url, slug);
      console.log(`  ✓ ${slug}  <- ${ov.credit}  (${Math.round(bytes / 1024)} KB webp)`);
      return { image: `/img/noticias/${file}`, credit: ov.credit, creditUrl: ov.creditUrl, creditTitulo: '' };
    } catch (e) {
      console.log(`  · override ${slug}: ${e.message}`);
    }
  }

  // 2) og:image de las fuentes
  for (const [fuente, pageUrl, titulo] of sources) {
    try {
      const img = await ogImage(pageUrl);
      const { file, bytes } = await descargarOptimizar(img, slug);
      console.log(`  ✓ ${slug}  <- ${fuente}  (${Math.round(bytes / 1024)} KB webp)`);
      return { image: `/img/noticias/${file}`, credit: `Foto: ${fuente}`, creditUrl: pageUrl, creditTitulo: titulo };
    } catch (e) {
      console.log(`  · ${fuente}: ${e.message}`);
    }
  }

  // 3) Placeholder
  const file = placeholderSVG(slug, emoji);
  console.log(`  ⚠ ${slug}: sin imagen, placeholder`);
  return { image: `/img/noticias/${file}`, credit: '', creditUrl: '', creditTitulo: '' };
}

function leerEditoriales() {
  const dir = join(ROOT, 'src', 'content', 'noticias');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(dir, f), 'utf8');
      const fm = raw.match(/^---\n([\s\S]*?)\n---/);
      const get = (k) => (fm?.[1].match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1] || '').trim();
      return { slug: f.replace(/\.md$/, ''), emoji: get('emoji') || '📰', fuente: get('fuente'), fuenteUrl: get('fuenteUrl'), titulo: get('titulo') };
    });
}

const manifestPath = join(__dirname, 'images-manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

// Resuelve la 2.ª imagen (inline) de un evento: og:image de una fuente o URL directa.
async function resolverImagen2(e) {
  if (!e.image2) return null;
  const dest = `${e.slug}-2`;
  const op = { width: 1000, quality: 75 }; // las inline se muestran más pequeñas
  if (existing(dest) && !FORCE) return null;
  try {
    if (e.image2.og) {
      const [fuente, pageUrl] = e.image2.og;
      const img = await ogImage(pageUrl);
      const { file, bytes } = await descargarOptimizar(img, dest, op);
      console.log(`  ✓ ${dest}  <- ${fuente}  (${Math.round(bytes / 1024)} KB webp)`);
      return { image: `/img/noticias/${file}`, credit: `Foto: ${fuente}`, creditUrl: pageUrl };
    }
    const { file, bytes } = await descargarOptimizar(e.image2.url, dest, op);
    console.log(`  ✓ ${dest}  <- ${e.image2.credit}  (${Math.round(bytes / 1024)} KB webp)`);
    return { image: `/img/noticias/${file}`, credit: e.image2.credit, creditUrl: e.image2.creditUrl };
  } catch (err) {
    console.log(`  · ${dest}: ${err.message}`);
    return null;
  }
}

console.log('Eventos (BD):');
for (const e of eventos) {
  const r = await resolverImagen(e);
  if (r) manifest[e.slug] = r;
  const r2 = await resolverImagen2(e);
  if (r2) manifest[e.slug] = { ...(manifest[e.slug] || {}), image2: r2 };
}
console.log('Editoriales (markdown):');
for (const a of leerEditoriales()) {
  const sources = a.fuenteUrl ? [[a.fuente || 'Fuente', a.fuenteUrl, a.titulo]] : [];
  const r = await resolverImagen({ slug: a.slug, emoji: a.emoji, sources });
  if (r) manifest[a.slug] = r;
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nManifest -> ${manifestPath} (${Object.keys(manifest).length} entradas)`);
