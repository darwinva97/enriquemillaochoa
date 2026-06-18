// Worker independiente con Cron Trigger. En cada disparo llama al endpoint de ingesta
// del sitio. Se mantiene separado del worker de Astro para no envolver su handler.
interface Env {
  INGEST_SECRET: string;
  SITE_URL: string;
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      fetch(`${env.SITE_URL}/api/ingest-alerts`, {
        method: 'POST',
        // Content-Type JSON evita la protección CSRF de Astro (checkOrigin),
        // que bloquearía este POST server-to-server sin cabecera Origin.
        headers: {
          Authorization: `Bearer ${env.INGEST_SECRET}`,
          'Content-Type': 'application/json',
        },
      })
        .then((r) => r.text())
        .then((t) => console.log('ingest-alerts:', t))
        .catch((e) => console.error('ingest-alerts error:', e)),
    );
  },
};
