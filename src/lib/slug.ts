// Genera un slug legible y SEO-friendly a partir de un texto.
export function slugify(s: string): string {
  return String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes/diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

// Asegura unicidad consultando los slugs ya existentes en alert_news.
export async function slugUnico(db: D1Database, base: string): Promise<string> {
  const slug = slugify(base) || 'noticia';
  let candidato = slug;
  for (let i = 2; i < 50; i++) {
    const existe = await db.prepare('SELECT 1 FROM alert_news WHERE slug = ?').bind(candidato).first();
    if (!existe) return candidato;
    candidato = `${slug}-${i}`;
  }
  return `${slug}-${Date.now()}`;
}
