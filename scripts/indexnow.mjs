/**
 * Avisa a los buscadores de que hay URLs nuevas o cambiadas (IndexNow).
 *
 *     node scripts/indexnow.mjs              avisa de TODO el sitemap
 *     node scripts/indexnow.mjs /precios/ /blog/   avisa solo de esas
 *
 * IndexNow es un protocolo abierto que usan Bing, Yandex, Seznam y Naver: en
 * vez de esperar a que el robot vuelva a pasar —que pueden ser semanas—, se le
 * dice que mire. Es gratis y no hay que registrarse.
 *
 * ⚠️ GOOGLE NO USA INDEXNOW. Lo dijo explícitamente. Para Google el camino es
 * Search Console → Inspección de URLs → Solicitar indexación, a mano. Esto no
 * lo sustituye: acelera al resto.
 *
 * ⚠️ La clave NO es un secreto. Se publica en `https://zyntello.com/{clave}.txt`
 * justamente para que el buscador compruebe que quien avisa manda en el
 * dominio. Por eso puede estar en este repositorio, que es público.
 *
 * ⚠️⚠️ No conviene lanzarlo en cada despliegue con las 67 URLs. Avisar de que
 * ha cambiado todo cuando no ha cambiado nada es la forma de que dejen de
 * hacerte caso. Se avisa de lo que de verdad cambió.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const AQUI = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(AQUI, '..', 'public')
const SITIO = 'https://zyntello.com'
const HOST = 'zyntello.com'

/* La clave se LEE del archivo publicado, no se copia aquí: si se copiara y
   alguien cambiara el archivo, este script seguiría enviando la vieja y el
   buscador rechazaría el aviso con un 403 que nadie está mirando. */
function leerClave() {
  const txt = readdirSync(PUBLIC).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f))
  if (txt.length === 0) throw new Error('No hay archivo de clave IndexNow en public/')
  if (txt.length > 1) throw new Error(`Hay ${txt.length} claves en public/; debe haber una sola: ${txt.join(', ')}`)
  const clave = readFileSync(join(PUBLIC, txt[0]), 'utf8').trim()
  if (`${clave}.txt` !== txt[0]) {
    throw new Error(`El contenido de ${txt[0]} no coincide con su nombre. El buscador comprueba las dos cosas.`)
  }
  return clave
}

function urlsDelSitemap() {
  const xml = readFileSync(join(PUBLIC, 'sitemap.xml'), 'utf8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

const argumentos = process.argv.slice(2)
const urls = argumentos.length
  ? argumentos.map((r) => (r.startsWith('http') ? r : `${SITIO}${r.startsWith('/') ? r : `/${r}`}`))
  : urlsDelSitemap()

const key = leerClave()

const respuesta = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `${SITIO}/${key}.txt`, urlList: urls }),
})

/* ⚠️ El 200 y el 202 son los dos correctos: 202 significa «recibido, la clave
   se comprobará luego». Un 403 es la clave mal publicada y un 422 son URLs de
   otro dominio — los dos silenciosos si nadie mira el código. */
const cuerpo = await respuesta.text()
if (respuesta.status === 200 || respuesta.status === 202) {
  console.log(`✓ Avisadas ${urls.length} URLs (HTTP ${respuesta.status})`)
} else {
  console.error(`✗ IndexNow respondió ${respuesta.status}: ${cuerpo || '(sin cuerpo)'}`)
  console.error(`  Comprueba que ${SITIO}/${key}.txt responde 200 y contiene exactamente la clave.`)
  process.exit(1)
}
