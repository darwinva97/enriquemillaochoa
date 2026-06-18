// Endpoint que ejecuta la ingesta. Lo dispara el cron (o tú manualmente con el secreto).
// POST /api/ingest-alerts   Authorization: Bearer <INGEST_SECRET>
import type { APIRoute } from 'astro';
import { ingestAlerts } from '../../lib/ingest';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env as {
    DB: D1Database;
    GEMINI_API_KEY: string;
    INGEST_SECRET: string;
    GOOGLE_ALERT_RSS_URL: string;
  };

  const auth = request.headers.get('authorization') ?? '';
  if (!env.INGEST_SECRET || auth !== `Bearer ${env.INGEST_SECRET}`) {
    return new Response('No autorizado', { status: 401 });
  }
  if (!env.GEMINI_API_KEY || !env.GOOGLE_ALERT_RSS_URL) {
    return new Response('Faltan GEMINI_API_KEY o GOOGLE_ALERT_RSS_URL', { status: 500 });
  }

  try {
    const result = await ingestAlerts(env.DB, env.GOOGLE_ALERT_RSS_URL, env.GEMINI_API_KEY);
    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(`Error: ${e?.message ?? e}`, { status: 500 });
  }
};
