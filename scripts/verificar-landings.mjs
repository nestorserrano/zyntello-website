/**
 * Verifica la lista LANDINGS_PUBLICAS de src/components/Soluciones.jsx.
 *
 * POR QUÉ EXISTE
 *
 * El admin declara una `url` para los 34 módulos, pero solo una parte lleva a
 * una landing que un visitante sin cuenta pueda abrir: el resto redirige a
 * /login o responde 404. Como la respuesta viene de otro dominio, el navegador
 * NO puede comprobarlo antes de la pulsación, así que el sitio se apoya en una
 * lista escrita a mano.
 *
 * ⚠️ Una lista escrita a mano se queda vieja sola y no avisa: el botón sigue
 * ahí, con el mismo aspecto, llevando a un 404. Este script es lo que lo
 * detecta. Se ejecuta a mano cuando se publica una landing nueva o antes de un
 * despliegue que toque la sección de Plataforma:
 *
 *     node scripts/verificar-landings.mjs
 *
 * Sale con código 1 si la lista y la realidad no coinciden.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const AQUI = dirname(fileURLToPath(import.meta.url))
const API = 'https://admin.zyntello.com/api/modulos'

/* La lista se LEE del código, no se copia aquí: una copia divergiría y la
   guarda pasaría en verde comparando consigo misma. */
function leerListaDelCodigo() {
  const fuente = readFileSync(join(AQUI, '..', 'src', 'components', 'Soluciones.jsx'), 'utf8')
  const m = fuente.match(/export const LANDINGS_PUBLICAS = new Set\(\[([\s\S]*?)\]\)/)
  if (!m) throw new Error('No se encontró LANDINGS_PUBLICAS en Soluciones.jsx')
  return new Set([...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]))
}

/* El sitio cambia la url de este módulo a mano; hay que comprobar la que de
   verdad se publica, no la que declara el admin. */
const URL_PROPIA = { 'zyntello-psa': 'https://zyntello.com/zyntello-psa.html' }

async function estadoDe(slug, url) {
  try {
    const r = await fetch(URL_PROPIA[slug] || url, { redirect: 'follow' })
    if (r.url.includes('/login')) return 'PIDE SESION'
    if (r.status === 404) return 'NO EXISTE'
    if (r.status === 200) return 'OK'
    return `HTTP ${r.status}`
  } catch (e) {
    return `ERROR ${e.message.slice(0, 40)}`
  }
}

const lista = leerListaDelCodigo()
const api = await (await fetch(API)).json()

const reales = new Set()
const detalle = []
for (const m of api) {
  const estado = await estadoDe(m.slug, m.url)
  if (estado === 'OK') reales.add(m.slug)
  detalle.push({ slug: m.slug, estado, enLista: lista.has(m.slug) })
}

const sobran = [...lista].filter(s => !reales.has(s))
const faltan = [...reales].filter(s => !lista.has(s))

console.log(`Módulos en el admin: ${api.length} · con landing viva: ${reales.size} · en la lista: ${lista.size}\n`)

if (sobran.length) {
  console.log('❌ EN LA LISTA PERO SIN LANDING VIVA (el botón «Conoce más» lleva a la nada):')
  for (const s of sobran) console.log(`   ${s.padEnd(20)} ${detalle.find(d => d.slug === s)?.estado ?? 'no está en el admin'}`)
  console.log()
}
if (faltan.length) {
  console.log('⚠️  CON LANDING VIVA PERO FUERA DE LA LISTA (se pierde el «Conoce más»):')
  for (const s of faltan) console.log(`   ${s}`)
  console.log()
}

if (!sobran.length && !faltan.length) {
  console.log('✅ La lista coincide con la realidad.')
  process.exit(0)
}
console.log('Corrige LANDINGS_PUBLICAS en src/components/Soluciones.jsx y actualiza la fecha del comentario.')
process.exit(1)
