// Lista unificada de noticias: artículos editoriales (colección) + alertas
// publicadas (D1), normalizadas a una misma forma y ordenadas por fecha.
// Reutilizado por /noticias, la home y las "noticias relacionadas".
import { getCollection } from 'astro:content';

export interface NoticiaCard {
  slug: string;
  titulo: string;
  resumen: string;
  tag: string;
  emoji: string;
  fecha: Date;
  fuente?: string;
  image?: string;
  origen: 'Editorial' | 'Alerta';
}

// SQLite devuelve 'YYYY-MM-DD HH:MM:SS' (UTC); lo normalizamos a ISO.
export function parseFechaSqlite(s?: string | null): Date {
  return new Date(s ? s.replace(' ', 'T') + 'Z' : Date.now());
}

export async function getNoticias(db: D1Database): Promise<NoticiaCard[]> {
  const editoriales: NoticiaCard[] = (await getCollection('noticias')).map((n) => ({
    slug: n.id.replace(/\.md$/, ''),
    titulo: n.data.titulo,
    resumen: n.data.resumen,
    tag: n.data.tag,
    emoji: n.data.emoji,
    fecha: n.data.fecha,
    fuente: n.data.fuente,
    image: n.data.cardImage,
    origen: 'Editorial',
  }));

  const { results } = await db
    .prepare(
      `SELECT slug, titulo, resumen, tag, emoji, image_card, published_at
         FROM alert_news WHERE status='published' AND slug IS NOT NULL`,
    )
    .all();
  const alertas: NoticiaCard[] = (results as any[]).map((n) => ({
    slug: n.slug,
    titulo: n.titulo,
    resumen: n.resumen,
    tag: n.tag,
    emoji: n.emoji,
    fecha: parseFechaSqlite(n.published_at),
    image: n.image_card,
    origen: 'Alerta',
  }));

  return [...editoriales, ...alertas].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}
