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

import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { FUNCIONALIDADES } from './funcionalidades/datos.mjs'
import { SERVICIOS } from './servicios/datos.mjs'
import { pagina } from './lib/plantilla.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DESTINO = join(AQUI, '..', 'public', 'funcionalidades')
const SITIO = 'https://zyntello.com'
const WHATSAPP = '18296399877'

let n = 0
let tocadas = 0
for (const f of FUNCIONALIDADES) {
  const otras = FUNCIONALIDADES.filter(o => o.slug !== f.slug)
  const carpeta = join(DESTINO, f.slug)
  mkdirSync(carpeta, { recursive: true })
  const cambio = escribirSiCambia(join(carpeta, 'index.html'), pagina(f, otras, {
    base: 'funcionalidades',
    volver: 'Todas las funcionalidades',
    distintivo: 'Incluido en la plataforma',
    tituloOtras: 'Las otras tres que tampoco se pagan aparte',
    segundoBoton: { texto: 'Probar el demo', href: 'https://app.zyntello.com/demo' },
  }))
  n++
  if (cambio) tocadas++
  console.log(`  ${cambio ? '~' : ' '} ${f.slug.padEnd(24)} ${f.beneficios.length} beneficios · ${f.detalles.length} detalles · ${f.faq.length} preguntas`)
}
console.log(`\n${n} páginas en public/funcionalidades/ · ${tocadas} reescritas`)

/* ─── El sitemap y el robots.txt YA NO SE ESCRIBEN AQUÍ ─────────────────────
 *
 * ⚠️⚠️ Hasta el 2026-09-26 este script escribía los dos. Eran una SEGUNDA
 * fuente, y con dos fuentes gana la que corra la última: ejecutar solo
 * `generar-funcionalidades.mjs` dejaba el sitemap en 24 URLs —sin las 35
 * landings de módulo, sin el blog y sin las páginas nuevas— y sustituía el
 * robots.txt por uno genérico. No fallaba nada: el XML seguía siendo válido,
 * solo que le faltaba la mitad del sitio. Se salvaba por el ORDEN de
 * `npm run generar`, que llama a `generar-sitemap.mjs` al final.
 *
 * ⚠️ Además, el comentario que había aquí decía que «las 34 landings viven en
 * app.zyntello.com, que es otro host». Dejó de ser cierto en [#1185]-[#1188]:
 * viven en `zyntello.com/{slug}`, el MISMO host, y por eso ahora sí entran en
 * el sitemap. El código se quedó atrás de la mudanza y nadie lo notó.
 *
 * La fuente única es `scripts/generar-sitemap.mjs`, que recorre public/ y lee
 * LANDINGS_PUBLICAS. El robots.txt es un archivo escrito a mano en
 * `public/robots.txt`: no lo genera nadie.
 * ────────────────────────────────────────────────────────────────────────── */
