/**
 * Vuelca las claves de catálogo que necesitaría el blog traducido.
 *
 *     node scripts/claves-blog.mjs             # resumen por clúster
 *     node scripts/claves-blog.mjs --tsv       # clave<TAB>texto español
 *     node scripts/claves-blog.mjs --tsv fiscal   # solo un clúster
 *
 * ⚠️ Misma regla que `traducir()` de `lib/idiomas.mjs`: prefijo + ruta dentro
 * del objeto, saltando la lista `NO_TRADUCIR`. No se escriben a mano: una clave
 * inventada se siembra, el panel la muestra traducida y el artículo sale
 * igualmente en español, sin un solo error por pantalla.
 *
 * ⚠️⚠️ El blog anida más que las otras familias: un `bloque` puede ser una
 * cadena suelta, un `{ aviso }`, un `{ lista: [...] }` o un `{ tabla }`. Por eso
 * se recorre con la función recursiva y no con una lista de campos conocidos —
 * una lista se queda corta en cuanto alguien añade un tipo de bloque nuevo, y
 * lo que se queda fuera no avisa: sale en español.
 */

import { ARTICULOS } from './blog/datos.mjs'

const PREFIJO = 'blog'
const NO_TRADUCIR = new Set([
  'slug', 'color', 'href', 'icono', 'acento', 'tipoSchema',
  // Propios del blog: `id` es el ancla de la URL, las fechas y los minutos no
  // son prosa, y `cluster`/`pais` son códigos que agrupan, no texto de pantalla.
  'id', 'fecha', 'actualizado', 'minutos', 'cluster', 'pais',
  // ⚠️ `ruta` es la URL del destino (`/bancos/`). Sin esta entrada se sembraba
  // como si fuera prosa: el panel la ofrecía traducida y quien la tradujera
  // rompería el enlace, sin que nada avisara — el botón seguiría pintándose.
  'ruta',
])

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

const args = process.argv.slice(2)
const tsv = args.includes('--tsv')
const soloCluster = args.find(a => !a.startsWith('--'))

const porCluster = new Map()
let total = 0

for (const a of ARTICULOS) {
  if (soloCluster && a.cluster !== soloCluster) continue
  const fuera = []
  recoger(a, `${PREFIJO}.${a.slug}`, [], fuera)
  total += fuera.length
  porCluster.set(a.cluster, (porCluster.get(a.cluster) ?? 0) + fuera.length)
  if (tsv) for (const [clave, texto] of fuera) console.log(`${clave}\t${texto.replace(/\t/g, ' ')}`)
}

if (!tsv) {
  for (const [c, n] of [...porCluster].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${c.padEnd(14)} ${String(n).padStart(5)} claves`)
  }
  const arts = ARTICULOS.filter(a => !soloCluster || a.cluster === soloCluster).length
  console.log(`\n${arts} artículos · ${total} claves por idioma · ${total * 7} traducciones para los siete`)
}
