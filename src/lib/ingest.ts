// Ingesta de Google Alerts (feed RSS/Atom): descarga, deduplica contra D1,
// genera el artículo con Gemini y lo guarda como borrador.
import { generarArticulo } from './gemini';

interface FeedEntry {
  guid: string;
  title: string;
  link: string;
  summaryHtml: string;
}

export interface IngestResult {
  total: number;
  nuevos: number;
  errores: number;
  detalles: string[];
}

// --- Utilidades de parseo (Workers no tiene DOMParser) ---

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return m ? m[1].trim() : '';
}

// Google Alerts envuelve el enlace real en un redirect: .../url?...&url=REAL&...
function unwrapGoogleUrl(href: string): string {
  try {
    const u = new URL(decodeEntities(href));
    const real = u.searchParams.get('url');
    return real ?? href;
  } catch {
    return href;
  }
}

// Parser para el formato Atom de Google Alerts (<entry>...). También tolera RSS (<item>).
export function parseFeed(xml: string): FeedEntry[] {
  const entries: FeedEntry[] = [];
  const blockRegex = /<(entry|item)[\s\S]*?<\/\1>/gi;
  const blocks = xml.match(blockRegex) ?? [];

  for (const block of blocks) {
    const guid = tag(block, 'id') || tag(block, 'guid');
    const title = stripHtml(tag(block, 'title'));

    // Atom: <link href="..."/>   RSS: <link>...</link>
    let link = '';
    const linkAttr = block.match(/<link[^>]*href=["']([^"']+)["']/i);
    if (linkAttr) link = linkAttr[1];
    else link = tag(block, 'link');
    link = unwrapGoogleUrl(link);

    const summaryHtml = tag(block, 'content') || tag(block, 'summary') || tag(block, 'description');

    if (guid && title) {
      entries.push({ guid, title, link, summaryHtml });
    }
  }
  return entries;
}

// Intenta obtener el texto completo del artículo enlazado; si falla, usa el snippet.
async function obtenerTexto(entry: FeedEntry): Promise<string> {
  const snippet = stripHtml(entry.summaryHtml);
  if (!entry.link) return snippet;
  try {
    const res = await fetch(entry.link, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; EnriqueMillaBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return snippet;
    const html = await res.text();
    const body = html.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? html;
    const texto = stripHtml(body).slice(0, 6000);
    return texto.length > snippet.length ? texto : snippet;
  } catch {
    return snippet;
  }
}

export async function ingestAlerts(
  db: D1Database,
  rssUrl: string,
  geminiApiKey: string,
): Promise<IngestResult> {
  const result: IngestResult = { total: 0, nuevos: 0, errores: 0, detalles: [] };

  const feedRes = await fetch(rssUrl, { signal: AbortSignal.timeout(15000) });
  if (!feedRes.ok) {
    throw new Error(`No se pudo leer el feed (${feedRes.status})`);
  }
  const xml = await feedRes.text();
  const entries = parseFeed(xml);
  result.total = entries.length;

  for (const entry of entries) {
    // Dedup por guid
    const existe = await db
      .prepare('SELECT 1 FROM alert_news WHERE guid = ?')
      .bind(entry.guid)
      .first();
    if (existe) continue;

    try {
      const texto = await obtenerTexto(entry);
      const art = await generarArticulo(geminiApiKey, {
        titulo: entry.title,
        texto,
        url: entry.link,
      });

      await db
        .prepare(
          `INSERT INTO alert_news (guid, source_url, source_title, titulo, resumen, cuerpo, tag, emoji, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
        )
        .bind(
          entry.guid,
          entry.link,
          entry.title,
          art.titulo,
          art.resumen,
          art.cuerpo,
          art.tag,
          art.emoji,
        )
        .run();

      result.nuevos++;
      result.detalles.push(`OK: ${art.titulo}`);
    } catch (e: any) {
      result.errores++;
      result.detalles.push(`ERROR (${entry.title}): ${e?.message ?? e}`);
    }
  }

  return result;
}
