/**
 * Genera las páginas de las funcionalidades transversales, en los 8 idiomas.
 *
 *     node scripts/generar-funcionalidades.mjs
 *
 * Escribe `public/{prefijo}funcionalidades/{slug}/index.html` — el español sin
 * prefijo y los demás bajo el suyo (`en/`, `ar/`, `zh-Hans/`…). Vite copia
 * `public/` a `dist/` en cada build, así que se publican con el resto.
 *
 * ⚠️ Son páginas ESTÁTICAS a propósito. El sitio es una SPA de una sola página
 * sin router: montar uno para estas páginas sería más código del que ahorra, y
 * además tienen que ser indexables por sí solas — que es justo lo que se pidió.
 *
 * ⚠️⚠️ Las cifras salen de `scripts/funcionalidades/datos.mjs` y están MEDIDAS
 * sobre zyntello-app, no estimadas. Si el producto crece, se vuelven a medir
 * antes de tocar el texto: un número inventado se descubre en la primera demo.
 *
 * ⚠️⚠️ Y las traducciones salen del PANEL, no de este repositorio. Eso tiene
 * una consecuencia que hay que tener presente: corregir una frase en el panel
 * NO basta para que cambie una página estática — hay que volver a generar y
 * desplegar. El panel es donde se corrige; lo que no hace aquí es ahorrarse el
 * despliegue.
 */

import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { FUNCIONALIDADES } from './funcionalidades/datos.mjs'
import { pagina } from './lib/plantilla.mjs'
import { IDIOMAS, cargarCatalogo, paginaTraducida, traductorDe } from './lib/idiomas.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const PUBLICO = join(AQUI, '..', 'public')

await cargarCatalogo()

let n = 0
let tocadas = 0

for (const idioma of IDIOMAS) {
  const t = traductorDe(idioma.codigo)
  let delIdioma = 0

  for (const original of FUNCIONALIDADES) {
    const f = paginaTraducida(original, 'fun', idioma.codigo)
    /* ⚠️ Las «otras» van traducidas también: son las tarjetas del final, y en
       español dentro de una página en chino se leen como enlaces rotos. */
    const otras = FUNCIONALIDADES
      .filter(o => o.slug !== original.slug)
      .map(o => paginaTraducida(o, 'fun', idioma.codigo))

    const carpeta = join(PUBLICO, ...idioma.prefijo.split('/').filter(Boolean), 'funcionalidades', original.slug)
    mkdirSync(carpeta, { recursive: true })

    const cambio = escribirSiCambia(join(carpeta, 'index.html'), pagina(f, otras, {
      base: 'funcionalidades',
      idioma: idioma.codigo,
      t,
      volver: t('pag.func.volver', 'Todas las funcionalidades'),
      distintivo: t('pag.func.distintivo', 'Incluido en la plataforma'),
      tituloOtras: t('pag.func.otras', 'Las otras tres que tampoco se pagan aparte'),
      segundoBoton: { texto: t('pag.func.boton2', 'Probar el demo'), href: 'https://app.zyntello.com/demo' },
    }))
    n++
    delIdioma++
    if (cambio) tocadas++
  }
  console.log(`  ${idioma.codigo.padEnd(8)} ${delIdioma} páginas en public/${idioma.prefijo}funcionalidades/`)
}

console.log(`\n${n} páginas (${FUNCIONALIDADES.length} × ${IDIOMAS.length} idiomas) · ${tocadas} reescritas`)

/* ─── El sitemap y el robots.txt NO SE ESCRIBEN AQUÍ ────────────────────────
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
