/**
 * Genera el blog: el índice agrupado por tema y cada artículo.
 *
 *     node scripts/generar-blog.mjs
 *
 * Escribe `public/blog/index.html` y `public/blog/{slug}/index.html`.
 *
 * ⚠️ El sitemap NO hay que tocarlo después: `generar-sitemap.mjs` recorre
 * public/ buscando index.html, así que un artículo nuevo entra solo. Lo que sí
 * hay que hacer es volver a ejecutarlo (o el `--verificar` del despliegue
 * falla, que es justo para lo que está).
 *
 * ⚠️⚠️ ANTES DE ESCRIBIR NADA se comprueban los enlaces entre artículos. Un
 * `<a href="/blog/lo-que-sea/">` a un slug que no existe **no falla al
 * generar**: produce una página perfecta con un enlace que da 404. Y un 404
 * interno enlazado desde varias páginas es de lo peor que le puedes dar a
 * Google, porque se lo encuentra rastreando tu propio sitio.
 */

import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { ARTICULOS } from './blog/datos.mjs'
import { CLUSTERS } from './blog/clusters.mjs'
import { articulo, indice } from './lib/plantilla-articulo.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DESTINO = join(AQUI, '..', 'public', 'blog')

/* ─── Guardas ─────────────────────────────────────────────────────────────
   Todas miran el EFECTO —un enlace que no lleva a ninguna parte, dos artículos
   con el mismo slug— y no la forma. Si algo falla, no se escribe nada: es
   preferible no regenerar a publicar enlaces rotos.
   ───────────────────────────────────────────────────────────────────────── */
const slugs = new Set(ARTICULOS.map((a) => a.slug))
const fallos = []

// 1 · Slugs repetidos. Dos artículos con el mismo slug se pisan el archivo y
//     el segundo gana, en silencio: uno de los dos desaparece del sitio.
const vistos = new Set()
for (const a of ARTICULOS) {
  if (vistos.has(a.slug)) fallos.push(`Slug repetido: ${a.slug}`)
  vistos.add(a.slug)
}

// 2 · Cada artículo pertenece a un grupo que existe.
for (const a of ARTICULOS) {
  if (!CLUSTERS[a.cluster]) fallos.push(`${a.slug}: cluster desconocido «${a.cluster}»`)
}

// 3 · Los enlaces a otros artículos apuntan a artículos que existen.
const ENLACE = /href="https:\/\/zyntello\.com\/blog\/([a-z0-9-]+)\/"/g
for (const a of ARTICULOS) {
  const texto = JSON.stringify(a)
  for (const m of texto.matchAll(ENLACE)) {
    if (!slugs.has(m[1])) fallos.push(`${a.slug}: enlaza a /blog/${m[1]}/ que NO existe`)
  }
  if (texto.includes(`/blog/${a.slug}/`)) fallos.push(`${a.slug}: se enlaza a sí mismo`)
}

if (fallos.length) {
  console.error(`✗ ${fallos.length} problema(s); no se ha escrito nada:`)
  for (const f of fallos) console.error(`  · ${f}`)
  process.exit(1)
}

/* ─── Generación ──────────────────────────────────────────────────────── */
const ordenados = [...ARTICULOS].sort((a, b) =>
  b.fecha.localeCompare(a.fecha) || a.titulo.localeCompare(b.titulo))

mkdirSync(DESTINO, { recursive: true })
let tocadas = escribirSiCambia(join(DESTINO, 'index.html'), indice(ordenados)) ? 1 : 0

for (const a of ordenados) {
  /* Los «del mismo tema»: hasta tres hermanos de su grupo. Con menos de dos no
     se pinta la sección — una sola tarjeta suelta se ve peor que ninguna. */
  const hermanos = ordenados.filter((o) => o.cluster === a.cluster && o.slug !== a.slug).slice(0, 3)

  const carpeta = join(DESTINO, a.slug)
  mkdirSync(carpeta, { recursive: true })
  const cambio = escribirSiCambia(join(carpeta, 'index.html'),
    articulo(a, hermanos.length >= 2 ? hermanos : []))
  if (cambio) tocadas++
}

const porGrupo = Object.keys(CLUSTERS)
  .map((c) => [CLUSTERS[c].nombre, ARTICULOS.filter((a) => a.cluster === c).length])
  .filter(([, n]) => n)
for (const [nombre, n] of porGrupo) console.log(`  ${String(n).padStart(2)} · ${nombre}`)

const paises = new Set(ARTICULOS.map((a) => a.pais).filter(Boolean))
console.log(`\n${ordenados.length} artículos en ${porGrupo.length} temas · ${paises.size} países · ${tocadas} reescritos`)
