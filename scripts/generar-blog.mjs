/**
 * Genera el blog: el índice y cada artículo.
 *
 *     node scripts/generar-blog.mjs
 *
 * Escribe `public/blog/index.html` y `public/blog/{slug}/index.html`.
 *
 * ⚠️ El sitemap NO hay que tocarlo después: `generar-sitemap.mjs` recorre
 * public/ buscando index.html, así que un artículo nuevo entra solo. Lo que sí
 * hay que hacer es volver a ejecutarlo (o el `--verificar` del despliegue falla,
 * que es justo para lo que está).
 */

import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { ARTICULOS } from './blog/datos.mjs'
import { articulo, indice } from './lib/plantilla-articulo.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DESTINO = join(AQUI, '..', 'public', 'blog')

/* Los más recientes primero, y con la fecha en ISO se ordena como texto. */
const ordenados = [...ARTICULOS].sort((a, b) => b.fecha.localeCompare(a.fecha))

mkdirSync(DESTINO, { recursive: true })
let tocadas = escribirSiCambia(join(DESTINO, 'index.html'), indice(ordenados)) ? 1 : 0
console.log('  /blog/')

for (const a of ordenados) {
  const carpeta = join(DESTINO, a.slug)
  mkdirSync(carpeta, { recursive: true })
  const cambio = escribirSiCambia(join(carpeta, 'index.html'), articulo(a))
  console.log(`  /blog/${a.slug.padEnd(38)} ${a.secciones.length} secciones · ${a.minutos} min`)
}

console.log(`\n${ordenados.length} artículos + índice en public/blog/`)
