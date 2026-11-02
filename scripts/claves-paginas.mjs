/**
 * Vuelca las claves de catálogo que necesitan las páginas de primer nivel.
 *
 *     node scripts/claves-paginas.mjs            # resumen
 *     node scripts/claves-paginas.mjs --tsv      # clave<TAB>texto español
 *
 * ⚠️ Las claves NO se escriben a mano: se recorre el objeto con la MISMA regla
 * que `traducir()` de `lib/idiomas.mjs` (prefijo + ruta dentro del objeto, y la
 * lista `NO_TRADUCIR` para slug, color, href e icono). Escribirlas a mano
 * produciría claves que el generador nunca pide: se sembrarían, el panel las
 * mostraría traducidas y la página saldría igualmente en español, sin un solo
 * error por pantalla.
 */

import { PAGINAS } from './paginas/datos.mjs'

const PREFIJO = 'pri'
const NO_TRADUCIR = new Set(['slug', 'color', 'href', 'icono', 'acento', 'tipoSchema'])

/** Misma regla que `traducir()`, pero recogiendo en vez de sustituyendo. */
function recoger(obj, prefijo, ruta, fuera) {
  if (typeof obj === 'string') {
    const campo = ruta[ruta.length - 1]
    if (NO_TRADUCIR.has(campo) || !obj.trim() || obj.startsWith('http') || obj.startsWith('#')) return
    fuera.push([`${prefijo}.${ruta.join('.')}`, obj])
    return
  }
  if (Array.isArray(obj)) return obj.forEach((v, i) => recoger(v, prefijo, [...ruta, String(i)], fuera))
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (!NO_TRADUCIR.has(k)) recoger(v, prefijo, [...ruta, k], fuera)
    }
  }
}

const tsv = process.argv.includes('--tsv')
let total = 0

for (const p of PAGINAS) {
  const fuera = []
  recoger(p, `${PREFIJO}.${p.slug}`, [], fuera)
  total += fuera.length
  if (tsv) {
    for (const [clave, texto] of fuera) console.log(`${clave}\t${texto.replace(/\t/g, ' ')}`)
  } else {
    console.log(`  ${p.slug.padEnd(18)} ${String(fuera.length).padStart(4)} claves`)
  }
}

if (!tsv) console.log(`\n${PAGINAS.length} páginas · ${total} claves por idioma`)
