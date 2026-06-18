// Workaround para un bug de empaquetado de libsodium-wrappers 0.7.x:
// su build ESM (libsodium-wrappers.mjs) hace `import "./libsodium.mjs"`
// esperándolo como hermano, pero npm instala `libsodium` como paquete
// separado (hoisted), así que el import relativo no resuelve y Alchemy
// (que usa libsodium para cifrar los secret bindings) falla con
// ERR_MODULE_NOT_FOUND al desplegar con tsx/Node ESM.
// Copiamos libsodium.mjs junto a libsodium-wrappers.mjs. Se ejecuta en
// cada `npm install` / `npm ci` (incluido el CI), de forma idempotente.
import { existsSync, copyFileSync } from 'node:fs';

const src = 'node_modules/libsodium/dist/modules-esm/libsodium.mjs';
const dst = 'node_modules/libsodium-wrappers/dist/modules-esm/libsodium.mjs';

try {
  if (existsSync(src) && !existsSync(dst)) {
    copyFileSync(src, dst);
    console.log('[fix-libsodium] copiado libsodium.mjs -> libsodium-wrappers');
  }
} catch (e) {
  console.warn('[fix-libsodium] omitido:', e?.message ?? e);
}
