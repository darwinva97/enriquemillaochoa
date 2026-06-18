/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<{
  DB: D1Database;
  GEMINI_API_KEY: string;
  INGEST_SECRET: string;
  GOOGLE_ALERT_RSS_URL: string;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}
