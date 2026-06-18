// Workaround para un bug de empaquetado de libsodium-wrappers 0.7.x:
// su build ESM (libsodium-wrappers.mjs) hace `import "./libsodium.mjs"`
// esperándolo como hermano, pero `libsodium` se instala como paquete
// separado, así que el import relativo no resuelve y Alchemy (que usa
// libsodium para cifrar los secret bindings) falla con ERR_MODULE_NOT_FOUND
// al desplegar con tsx/Node ESM.
//
// Copiamos libsodium.mjs junto a libsodium-wrappers.mjs. Funciona tanto con
// el layout plano de npm como con el de pnpm (node_modules/.pnpm/...).
// Se ejecuta en cada install (incluido el CI), de forma idempotente.
import { existsSync, copyFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const NM = 'node_modules';
const PNPM = join(NM, '.pnpm');
const REL = 'dist/modules-esm';

// Subcarpetas de .pnpm cuyo nombre empieza por <pkg>@ (p. ej. libsodium@0.7.16).
function pnpmPkgDirs(prefix) {
  if (!existsSync(PNPM)) return [];
  return readdirSync(PNPM)
    .filter((d) => d.startsWith(prefix + '@'))
    .map((d) => join(PNPM, d, 'node_modules', prefix));
}

// libsodium.mjs "real" (paquete libsodium), en npm o pnpm.
const src = [join(NM, 'libsodium'), ...pnpmPkgDirs('libsodium')]
  .map((base) => join(base, REL, 'libsodium.mjs'))
  .find(existsSync);

if (!src) {
  console.warn('[fix-libsodium] no se encontró libsodium.mjs fuente; omitido');
  process.exit(0);
}

// Destinos: junto a cada libsodium-wrappers.mjs que no tenga el hermano.
const destinos = [join(NM, 'libsodium-wrappers'), ...pnpmPkgDirs('libsodium-wrappers')]
  .map((base) => join(base, REL))
  .filter((dir) => existsSync(join(dir, 'libsodium-wrappers.mjs')) && !existsSync(join(dir, 'libsodium.mjs')))
  .map((dir) => join(dir, 'libsodium.mjs'));

let n = 0;
for (const dst of destinos) {
  try {
    copyFileSync(src, dst);
    n++;
  } catch (e) {
    console.warn('[fix-libsodium] omitido:', e?.message ?? e);
  }
}
if (n) console.log(`[fix-libsodium] copiado libsodium.mjs en ${n} ubicación(es)`);
