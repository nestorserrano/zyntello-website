/**
 * Genera public/sitemap.xml.
 *
 * POR QUÉ SE GENERA Y NO SE ESCRIBE A MANO
 *
 * El sitemap anterior tenía 23 URLs escritas a mano y le faltaban las 35
 * landings de módulo —justo las páginas que responden a «software de
 * inventario» o «software de nómina», que es por lo que busca quien todavía no
 * conoce la marca—. No fallaba nada: un sitemap incompleto es un archivo válido
 * que Google acepta sin una queja, y las páginas que no están sencillamente no
 * se rastrean.
 *
 * ⚠️ Una lista escrita a mano se queda vieja sola y no avisa. Este script lee
 * la realidad en vez de una copia:
 *
 *   · Las páginas del sitio      → recorriendo public/ en busca de index.html
 *   · Las landings de módulo     → de LANDINGS_PUBLICAS (Soluciones.jsx), que
 *                                  es la fuente única del sitio y ya la vigila
 *                                  `verificar-landings.mjs`
 *
 * Así, una página nueva entra en el sitemap por el hecho de existir.
 *
 * Uso:
 *     node scripts/generar-sitemap.mjs            genera
 *     node scripts/generar-sitemap.mjs --verificar  falla si está desactualizado
 *
 * ⚠️ `--verificar` es lo que hay que ejecutar antes de desplegar: si alguien
 * añade una página y no regenera, el sitemap se queda corto en silencio.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'

const AQUI   = dirname(fileURLToPath(import.meta.url))
const RAIZ   = join(AQUI, '..')
const PUBLIC = join(RAIZ, 'public')
const SITIO  = 'https://zyntello.com'
const SALIDA = join(PUBLIC, 'sitemap.xml')

/* ⚠️⚠️ TODA URL DE DIRECTORIO LLEVA BARRA FINAL.
   Medido el 2026-09-25 contra producción: `/inventario` responde 301 a
   `/inventario/`. Declarar en el sitemap la versión sin barra manda a Google a
   rastrear 35 redirecciones en vez de 35 páginas — gasta el presupuesto de
   rastreo y no indexa nada de más. La que responde 200 es la que va aquí. */
const conBarra = (ruta) => ruta.endsWith('/') ? ruta : `${ruta}/`

/* La lista se LEE del código, no se copia: una copia divergiría y este script
   generaría un sitemap coherente consigo mismo y falso respecto al sitio. */
function landingsDeModulo() {
  const fuente = readFileSync(join(RAIZ, 'src', 'components', 'Soluciones.jsx'), 'utf8')
  const m = fuente.match(/export const LANDINGS_PUBLICAS = new Set\(\[([\s\S]*?)\]\)/)
  if (!m) throw new Error('No se encontró LANDINGS_PUBLICAS en Soluciones.jsx')
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
}

/* Recorre public/ y devuelve la ruta de cada carpeta que tiene un index.html.
   Es lo que de verdad publica el sitio: si hay index.html, hay página. */
function paginasDelSitio(dir = PUBLIC, encontradas = []) {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    if (entrada.name.startsWith('.')) continue
    const ruta = join(dir, entrada.name)
    if (!entrada.isDirectory()) continue

    // `logos` y demás carpetas de recursos no son páginas.
    const indice = join(ruta, 'index.html')
    if (existsSync(indice)) {
      encontradas.push({
        ruta: conBarra('/' + relative(PUBLIC, ruta).split('\\').join('/')),
        lastmod: statSync(indice).mtime.toISOString().slice(0, 10),
      })
    }
    paginasDelSitio(ruta, encontradas)
  }
  return encontradas
}

/* La fecha de modificación más reciente de una lista de archivos o carpetas,
   mirando dentro de las carpetas. Devuelve `undefined` si no hay ninguno: sin
   fecha es mejor que con una inventada. */
function masReciente(rutas) {
  let max = 0
  const mirar = (r) => {
    if (!existsSync(r)) return
    const e = statSync(r)
    if (e.isDirectory()) {
      for (const h of readdirSync(r)) mirar(join(r, h))
    } else if (e.mtimeMs > max) {
      max = e.mtimeMs
    }
  }
  rutas.forEach(mirar)
  return max ? new Date(max).toISOString().slice(0, 10) : undefined
}

/* La prioridad no la inventa el script: la decide de qué tipo es la página.
   ⚠️ `priority` es una pista entre las páginas del PROPIO sitio, no una nota
   frente a otros dominios. Ponerlo todo a 1.0 equivale a no ponerlo. */
function prioridadDe(ruta) {
  if (ruta === '/')                            return { prioridad: '1.0', frecuencia: 'weekly'  }
  if (ruta.startsWith('/servicios/'))          return { prioridad: '0.8', frecuencia: 'monthly' }
  if (ruta.startsWith('/funcionalidades/'))    return { prioridad: '0.8', frecuencia: 'monthly' }
  // ⚠️ El índice del blog va ANTES que los artículos: `/blog/` también empieza
  // por `/blog/`, así que con el orden al revés el índice nunca llegaba a su
  // propia regla y se publicaba con la prioridad de un artículo.
  if (ruta === '/blog/')                       return { prioridad: '0.7', frecuencia: 'weekly'  }
  if (ruta.startsWith('/blog/'))               return { prioridad: '0.6', frecuencia: 'monthly' }
  if (LEGALES.has(ruta))                       return { prioridad: '0.3', frecuencia: 'yearly'  }
  return { prioridad: '0.7', frecuencia: 'monthly' }
}

/* Las legales se indexan —un comprador de software mira los términos y el SLA
   antes de firmar— pero no compiten por ninguna búsqueda. */
const LEGALES = new Set([
  '/privacidad/', '/terminos/', '/sla/', '/eliminacion-datos/', '/avisos-terceros/',
])

function construir() {
  const urls = []

  // 1 · La portada.
  //
  // ⚠️ Su `lastmod` NO sale de `dist/index.html`: ese lo reescribe Vite en cada
  // build, así que diría que la portada cambió cada vez que se compila el sitio.
  // Sale de sus FUENTES —`index.html` de la raíz y los componentes de `src/`—,
  // que solo cambian cuando alguien los edita de verdad. Se toma la más
  // reciente porque cualquiera de las dos cambia lo que el visitante ve.
  urls.push({
    loc: `${SITIO}/`,
    lastmod: masReciente([join(AQUI, '..', 'index.html'), join(AQUI, '..', 'src')]),
    prioridad: '1.0',
    frecuencia: 'weekly',
  })

  // 2 · Todo lo que el sitio publica como página (servicios, funcionalidades,
  //     legales y las páginas nuevas, en cuanto existan).
  for (const p of paginasDelSitio().sort((a, b) => a.ruta.localeCompare(b.ruta))) {
    const { prioridad, frecuencia } = prioridadDe(p.ruta)
    urls.push({ loc: `${SITIO}${p.ruta}`, lastmod: p.lastmod, prioridad, frecuencia })
  }

  // 3 · Las 35 landings de módulo. No están en este repo: las escribe el admin
  //     directamente en el document root del sitio, así que aquí no hay archivo
  //     que mirar y NO se les pone `lastmod`.
  //
  //     ⚠️ Un `lastmod` inventado es peor que ninguno: Google compara la fecha
  //     con lo que ve al rastrear y, cuando no cuadra, deja de hacer caso al
  //     campo en TODO el sitemap. `lastmod` es opcional; mentir, no.
  for (const slug of landingsDeModulo().sort()) {
    urls.push({ loc: `${SITIO}/${slug}/`, prioridad: '0.9', frecuencia: 'monthly' })
  }

  const cuerpo = urls.map((u) => [
    '  <url>',
    `    <loc>${u.loc}</loc>`,
    u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
    `    <changefreq>${u.frecuencia}</changefreq>`,
    `    <priority>${u.prioridad}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n')).join('\n')

  const cabecera = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<!-- Generado por scripts/generar-sitemap.mjs. No editar a mano: la\n'
    + '     siguiente generacion lo sobrescribe entero. -->\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  return { xml: `${cabecera}${cuerpo}\n</urlset>\n`, total: urls.length }
}

const { xml, total } = construir()
const verificar = process.argv.includes('--verificar')

if (verificar) {
  const actual = existsSync(SALIDA) ? readFileSync(SALIDA, 'utf8') : ''
  if (actual !== xml) {
    console.error('✗ sitemap.xml está desactualizado. Ejecuta: node scripts/generar-sitemap.mjs')
    process.exit(1)
  }
  console.log(`✓ sitemap.xml al día — ${total} URLs`)
} else {
  const cambio = escribirSiCambia(SALIDA, xml)
  console.log(cambio
    ? `✓ public/sitemap.xml generado — ${total} URLs`
    : `· public/sitemap.xml ya estaba al día — ${total} URLs`)
}
