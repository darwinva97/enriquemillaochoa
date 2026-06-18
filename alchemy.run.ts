import alchemy from "alchemy";
import { Astro, D1Database, CustomDomain, Worker, DOStateStore } from "alchemy/cloudflare";

const app = await alchemy("enrique-milla-ochoa", {
  stage: "prod",
  // Estado remoto en un Worker de Cloudflare (Durable Objects) para que persista
  // entre ejecuciones de CI/CD. Toma ALCHEMY_STATE_TOKEN y las credenciales de
  // Cloudflare (CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID) del entorno.
  stateStore: (scope) => new DOStateStore(scope),
});

const database = await D1Database("forum-db", {
  name: "enrique-milla-ochoa-forum",
  migrationsDir: "migrations",
  adopt: true,
});

export const website = await Astro("website", {
  name: "enrique-milla-ochoa",
  command: "npx astro build",
  adopt: true,
  bindings: {
    DB: database,
    GEMINI_API_KEY: alchemy.secret(process.env.GEMINI_API_KEY),
    INGEST_SECRET: alchemy.secret(process.env.INGEST_SECRET),
    GOOGLE_ALERT_RSS_URL: process.env.GOOGLE_ALERT_RSS_URL ?? "",
  },
});

// Worker con Cron Trigger que dispara la ingesta de Google Alerts.
// Por defecto: todos los días a las 13:00 UTC (08:00 hora de Perú).
export const alertCron = await Worker("alert-cron", {
  name: "enrique-milla-ochoa-alert-cron",
  entrypoint: "src/cron.ts",
  crons: ["0 13 * * *"],
  adopt: true,
  bindings: {
    INGEST_SECRET: alchemy.secret(process.env.INGEST_SECRET),
    SITE_URL: "https://enriquemillaochoa.page",
  },
});

await CustomDomain("custom-domain", {
  name: "enriquemillaochoa.page",
  zoneId: "446926cb438361535f589e7c02699e85",
  workerName: website.name,
});

await CustomDomain("www-domain", {
  name: "www.enriquemillaochoa.page",
  zoneId: "446926cb438361535f589e7c02699e85",
  workerName: website.name,
});

console.log({ url: website.url });

await app.finalize();
