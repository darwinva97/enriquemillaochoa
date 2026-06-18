// Genera scripts/seed-alertas.sql a partir de scripts/data.mjs + el manifest
// de imágenes (scripts/images-manifest.json).
//
//   node scripts/fetch-images.mjs   # primero, para tener las imágenes
//   node scripts/gen-seed.mjs
//
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { eventos } from './data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(__dirname, 'images-manifest.json');
const img = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

const q = (s) => (s === null || s === undefined || s === '' ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`);

const out = [];
out.push('-- AUTOGENERADO por scripts/gen-seed.mjs — NO editar a mano.');
out.push('-- Página Google Alerts "Enrique Milla Ochoa" (18 jun 2026): 31 fuentes -> 6 sucesos.');
out.push('-- Aplicar:  wrangler d1 execute enrique-milla-ochoa-forum --remote --file scripts/seed-alertas.sql');
out.push('');

for (const e of eventos) {
  const [pf, pu, pt] = e.sources[0];
  const principalTitulo = `${pt} (${pf})`;
  const m = img[e.slug] || {};
  const i2 = m.image2 || {};
  out.push(`-- ${e.slug}  (${e.sources.length} fuente(s))`);
  // INSERT para instalaciones nuevas...
  out.push(
    `INSERT OR IGNORE INTO alert_news (guid, slug, source_url, source_title, titulo, resumen, cuerpo, tag, emoji, image_card, image_banner, image_credit, image_credit_url, image2, image2_credit, image2_credit_url, status) VALUES (\n  ${q(
      e.guid,
    )}, ${q(e.slug)}, ${q(pu)}, ${q(principalTitulo)}, ${q(e.titulo)}, ${q(e.resumen)}, ${q(e.cuerpo)}, ${q(
      e.tag,
    )}, ${q(e.emoji)}, ${q(m.image)}, ${q(m.image)}, ${q(m.credit)}, ${q(m.creditUrl)}, ${q(i2.image)}, ${q(
      i2.credit,
    )}, ${q(i2.creditUrl)}, 'draft'\n);`,
  );
  // ...y UPDATE para filas ya existentes (añade slug/imágenes/cuerpo sin tocar el estado).
  out.push(
    `UPDATE alert_news SET titulo=${q(e.titulo)}, resumen=${q(e.resumen)}, cuerpo=${q(e.cuerpo)}, slug=${q(
      e.slug,
    )}, image_card=${q(m.image)}, image_banner=${q(m.image)}, image_credit=${q(m.credit)}, image_credit_url=${q(
      m.creditUrl,
    )}, image2=${q(i2.image)}, image2_credit=${q(i2.credit)}, image2_credit_url=${q(i2.creditUrl)} WHERE guid=${q(
      e.guid,
    )};`,
  );
  for (const [fuente, url, titulo] of e.sources) {
    out.push(
      `INSERT OR IGNORE INTO alert_sources (alert_id, fuente, url, titulo) SELECT id, ${q(fuente)}, ${q(
        url,
      )}, ${q(titulo)} FROM alert_news WHERE guid = ${q(e.guid)};`,
    );
  }
  out.push('');
}

const total = eventos.reduce((a, e) => a + e.sources.length, 0);
out.push(`-- Total: ${eventos.length} noticias, ${total} fuentes.`);

writeFileSync(join(__dirname, 'seed-alertas.sql'), out.join('\n') + '\n');
console.log(`Generado seed-alertas.sql: ${eventos.length} noticias, ${total} fuentes.`);
