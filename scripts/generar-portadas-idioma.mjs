/**
 * Genera la portada de cada idioma: `dist/{prefijo}/index.html`.
 *
 *     node scripts/generar-portadas-idioma.mjs       (DESPUÉS de `vite build`)
 *
 * ## ⚠️⚠️ Trabaja sobre `dist/`, NO sobre `public/`, y la diferencia rompe la página
 *
 * La plantilla `index.html` de la raíz carga `/src/main.jsx`, que es el fuente: existe en
 * desarrollo y **no existe en producción**. El `dist/index.html` que sale de `vite build` carga
 * `/assets/index-HASH.js`, que es el empaquetado.
 *
 * ⚠️ Copiar la plantilla daría siete portadas con `<script src="/src/main.jsx">`: HTML válido,
 * build sin una sola advertencia, y **página en blanco** al abrirla, porque el navegador pide un
 * fichero que no está. Eso es peor que el 403 que esto viene a arreglar — el 403 al menos se ve.
 * Por eso este script lee `dist/index.html` y se ejecuta después del build, no antes.
 *
 * ## ⚠️⚠️ Por qué hacen falta estos ficheros
 *
 * La portada es React y se traduce en cliente, así que durante mucho tiempo existió solo en `/`.
 * El resto del sitio —blog, servicios, funcionalidades, legales— sí tiene una página por idioma,
 * y eso dejaba `/en/`, `/ar/` y las otras cinco como **directorios sin índice**: Apache no puede
 * listarlos y devuelve **403**.
 *
 * ⚠️ Un 403 no es un 404. El 404 dice «esto no existe» y Google lo retira; el 403 dice «existe y
 * no te dejo», que para un rastreador es una señal de un sitio mal configurado. Y lo encuentra
 * cualquiera que **recorte una URL compartida** —de `/ar/blog/algo/` a `/ar/`—, que es un gesto
 * natural.
 *
 * ## ⚠️⚠️ Por qué NO basta con copiar el index.html
 *
 * Copiarlo tal cual produciría siete portadas **en español** con `lang` y URL de otro idioma: el
 * mismo defecto que el generador del blog evita a propósito saltándose los artículos sin traducir.
 * Por eso cada copia lleva su `lang`, su `dir`, su `<title>` y su descripción del catálogo, su
 * `canonical` propio y los `hreflang` de los ocho.
 *
 * ⚠️ Los `hreflang` no son adorno: sin ellos Google ve ocho URLs con el mismo contenido y elige
 * una, descartando las demás como duplicadas. Con ellos entiende que son traducciones y sirve cada
 * una a su público.
 *
 * ⚠️ Esto va de la mano de `detectarDeLaUrl()` en `src/hooks/useIdioma.jsx`: el HTML declara el
 * idioma y el hook lo respeta al arrancar. Si se quita uno de los dos, la página dice una cosa y
 * muestra otra.
 */

import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { IDIOMAS, cargarCatalogo, texto } from './lib/idiomas.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DIST = join(AQUI, '..', 'dist')
const SITIO = 'https://zyntello.com'

/* El `og:locale` que le corresponde a cada idioma. El español es el de República Dominicana,
   que es donde está el negocio, no el de España. */
const LOCALES = {
  es: 'es_DO', en: 'en_US', fr: 'fr_FR', it: 'it_IT',
  'zh-Hans': 'zh_CN', 'zh-Hant': 'zh_TW', ar: 'ar_AR', ht: 'ht_HT',
}

await cargarCatalogo()

/* ⚠️ Guarda: sin el build hecho no hay de dónde partir, y seguir adelante escribiría portadas
   apuntando a un bundle que no existe. */
const construida = join(DIST, 'index.html')
if (!existsSync(construida)) {
  console.error('✗ no hay dist/index.html. Esto corre DESPUÉS de `vite build`.')
  process.exit(1)
}
const plantilla = readFileSync(construida, 'utf8')

/* ⚠️⚠️ Y se comprueba el efecto, no la forma: que lo leído sea de verdad el construido. Si el
   fichero llegara a tener el fuente —por un build a medias o un copiado manual—, las ocho
   portadas quedarían en blanco sin que nada lo dijera. */
if (plantilla.includes('/src/main.jsx')) {
  console.error('✗ dist/index.html carga /src/main.jsx: eso es la plantilla, no el build.')
  console.error('  Las portadas saldrían en blanco en producción. No se ha escrito nada.')
  process.exit(1)
}

/** Los `hreflang` de los ocho, más el `x-default` que apunta al español. */
const alternativas = IDIOMAS.map((i) =>
  `    <link rel="alternate" hreflang="${i.codigo}" href="${SITIO}/${i.prefijo}" />`,
).join('\n') + `\n    <link rel="alternate" hreflang="x-default" href="${SITIO}/" />`

const tituloDe = (c) => texto(c, 'pag.portada.titulo')
  || 'Zyntello | Software ERP, CRM y Automatización con IA'
const descripcionDe = (c) => texto(c, 'pag.portada.descripcion')
  || 'Software ERP y CRM en la nube para digitalizar y automatizar los procesos de tu empresa.'

/* Guarda: sin las dos claves en el catálogo, las siete portadas saldrían en español con su
   `lang` diciendo otra cosa. Mejor no escribir nada que publicar eso. */
const sinTraducir = IDIOMAS.filter((i) => i.codigo !== 'es' && !texto(i.codigo, 'pag.portada.titulo'))
if (sinTraducir.length) {
  console.error(`✗ falta 'pag.portada.titulo' en: ${sinTraducir.map((i) => i.codigo).join(', ')}`)
  console.error('  Siémbralas en el panel antes de generar; no se ha escrito nada.')
  process.exit(1)
}

let escritas = 0
for (const idioma of IDIOMAS) {
  const { codigo, prefijo, dir = codigo === 'ar' ? 'rtl' : 'ltr' } = idioma
  const url = `${SITIO}/${prefijo}`

  const html = plantilla
    .replace(/<html lang="[^"]*"[^>]*>/, `<html lang="${codigo}" dir="${dir}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${tituloDe(codigo)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${descripcionDe(codigo)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${tituloDe(codigo)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${descripcionDe(codigo)}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${LOCALES[codigo] ?? 'es_DO'}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="canonical"[^>]*>)/, `$1\n${alternativas}`)

  const destino = prefijo
    ? join(DIST, ...prefijo.split('/').filter(Boolean), 'index.html')
    : join(DIST, 'index.html')

  mkdirSync(dirname(destino), { recursive: true })
  if (escribirSiCambia(destino, html)) escritas++
  console.log(`  ${codigo.padEnd(8)} ${url}`)
}

/* El sitemap se genera recorriendo `public/`, donde estas portadas no están: viven solo en el
   build. Se añaden aquí para que no queden fuera — una página que existe y no está en el
   sitemap es una página que Google tarda meses en encontrar, si la encuentra. */
const mapa = join(DIST, 'sitemap.xml')
if (existsSync(mapa)) {
  let xml = readFileSync(mapa, 'utf8')
  const nuevas = IDIOMAS.filter((i) => i.prefijo)
    .map((i) => `${SITIO}/${i.prefijo}`)
    .filter((u) => !xml.includes(`<loc>${u}</loc>`))
  if (nuevas.length) {
    const hoy = new Date().toISOString().slice(0, 10)
    const bloque = nuevas.map((u) =>
      `  <url>\n    <loc>${u}</loc>\n    <lastmod>${hoy}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ).join('\n')
    xml = xml.replace('</urlset>', `${bloque}\n</urlset>`)
    escribirSiCambia(mapa, xml)
  }
  console.log(`  sitemap  ${nuevas.length} portadas añadidas`)
}

console.log(`\n${IDIOMAS.length} portadas · ${escritas} reescritas`)
