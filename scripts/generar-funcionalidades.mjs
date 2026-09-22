/**
 * Genera las páginas de las funcionalidades transversales.
 *
 *     node scripts/generar-funcionalidades.mjs
 *
 * Escribe `public/funcionalidades/{slug}/index.html`. Vite copia `public/` a
 * `dist/` en cada build, así que se publican con el resto del sitio.
 *
 * ⚠️ Son páginas ESTÁTICAS a propósito. El sitio es una SPA de una sola página
 * sin router: montar uno para cuatro páginas que no cambian sería más código
 * del que ahorra, y además estas tienen que ser indexables por sí solas — que
 * es justo lo que el usuario pidió.
 *
 * ⚠️⚠️ Las cifras salen de `scripts/funcionalidades/datos.mjs` y están MEDIDAS
 * sobre zyntello-app, no estimadas. Si el producto crece, se vuelven a medir
 * antes de tocar el texto: un número inventado se descubre en la primera demo.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { FUNCIONALIDADES } from './funcionalidades/datos.mjs'
import { SERVICIOS } from './servicios/datos.mjs'
import { pagina } from './lib/plantilla.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DESTINO = join(AQUI, '..', 'public', 'funcionalidades')
const SITIO = 'https://zyntello.com'
const WHATSAPP = '18296399877'

let n = 0
for (const f of FUNCIONALIDADES) {
  const otras = FUNCIONALIDADES.filter(o => o.slug !== f.slug)
  const carpeta = join(DESTINO, f.slug)
  mkdirSync(carpeta, { recursive: true })
  writeFileSync(join(carpeta, 'index.html'), pagina(f, otras, {
    base: 'funcionalidades',
    volver: 'Todas las funcionalidades',
    distintivo: 'Incluido en la plataforma',
    tituloOtras: 'Las otras tres que tampoco se pagan aparte',
    segundoBoton: { texto: 'Probar el demo', href: 'https://app.zyntello.com/demo' },
  }), 'utf8')
  n++
  console.log(`  ${f.slug.padEnd(24)} ${f.beneficios.length} beneficios · ${f.detalles.length} detalles · ${f.faq.length} preguntas`)
}
console.log(`\n${n} páginas en public/funcionalidades/`)

/* ─── Sitemap y robots ──────────────────────────────────────────────────────
 * ⚠️ Se generan AQUÍ, con las páginas, y no a mano: un sitemap escrito aparte
 * se queda viejo en cuanto se añade una página y nadie lo nota — sigue siendo
 * un XML válido, solo que incompleto.
 *
 * ⚠️ Solo van URLs de ESTE host. Las 34 landings de módulo viven en
 * app.zyntello.com, que es otro host: un sitemap que las liste se rechaza
 * entero, no solo esas líneas.
 * ────────────────────────────────────────────────────────────────────────── */
const LEGALES = ['privacidad', 'terminos', 'sla', 'eliminacion-datos', 'avisos-terceros']
const hoy = new Date().toISOString().slice(0, 10)

const urls = [
  { loc: `${SITIO}/`, pri: '1.0', freq: 'weekly' },
  ...SERVICIOS.map(s => ({ loc: `${SITIO}/servicios/${s.slug}/`, pri: '0.8', freq: 'monthly' })),
  ...FUNCIONALIDADES.map(f => ({ loc: `${SITIO}/funcionalidades/${f.slug}/`, pri: '0.8', freq: 'monthly' })),
  ...LEGALES.map(l => ({ loc: `${SITIO}/${l}/`, pri: '0.3', freq: 'yearly' })),
]

writeFileSync(join(AQUI, '..', 'public', 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
  </url>`).join('\n')}
</urlset>
`, 'utf8')

writeFileSync(join(AQUI, '..', 'public', 'robots.txt'),
`# zyntello.com
User-agent: *
Allow: /

Sitemap: ${SITIO}/sitemap.xml
`, 'utf8')

console.log(`sitemap.xml con ${urls.length} urls · robots.txt`)
