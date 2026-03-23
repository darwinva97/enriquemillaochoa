import alchemy from "alchemy";
import { Astro, D1Database, CustomDomain } from "alchemy/cloudflare";

const app = await alchemy("enrique-milla-ochoa", {
  stage: "prod",
});

const database = await D1Database("forum-db", {
  name: "enrique-milla-ochoa-forum",
  migrationsDir: "migrations",
  adopt: true,
});

export const website = await Astro("website", {
  name: "enrique-milla-ochoa",
  command: "npx astro build",
  bindings: {
    DB: database,
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
