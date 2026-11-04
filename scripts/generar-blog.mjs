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

import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { ARTICULOS } from './blog/datos.mjs'
import { CLUSTERS } from './blog/clusters.mjs'
import { articulo, indice } from './lib/plantilla-articulo.mjs'
import { IDIOMAS, cargarCatalogo, texto, traducir, traductorDe } from './lib/idiomas.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const PUBLICO = join(AQUI, '..', 'public')
const DESTINO = join(PUBLICO, 'blog')

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
await cargarCatalogo()

const ordenados = [...ARTICULOS].sort((a, b) =>
  b.fecha.localeCompare(a.fecha) || a.titulo.localeCompare(b.titulo))

/**
 * ¿Está este artículo traducido a este idioma?
 *
 * ⚠️⚠️ Se mira el TÍTULO, que es la primera clave que se siembra de cada
 * artículo. Sin esta comprobación, un artículo aún sin traducir se publicaría
 * igualmente en las ocho URLs: siete copias en español declarando `lang="ar"`.
 * Válidas, indexables y equivocadas, sin un solo error por pantalla — y Google
 * indexando español bajo etiqueta de árabe, que es peor que no tener la página.
 */
const traducido = (a, idioma) =>
  idioma === 'es' || Boolean(texto(idioma, `blog.${a.slug}.titulo`))

/**
 * La ruta del destino comercial de un clúster, en el idioma si esa página
 * existe y en español si no.
 *
 * ⚠️⚠️ Se MIDE contra el disco, no se supone. Las landings de módulo
 * (`/bancos/`, `/nomina/`…) las escribe el admin y **solo existen en español**:
 * poner el prefijo a ciegas mandaba el botón «Ver Bancos» del artículo árabe a
 * `/ar/bancos/`, que responde 404. Lo cazó el verificador de traducciones con
 * 21 enlaces rotos — si no, habría salido publicado, porque el botón se pinta
 * igual de bien apunte donde apunte.
 *
 * Un ancla de la portada (`/#soluciones`) sí lleva prefijo: la portada es React
 * y existe en los ocho.
 */
const rutaDestino = (ruta, idioma) => {
  const p = prefijoDe(idioma)
  if (!p) return ruta
  const conPrefijo = `/${p}${ruta.replace(/^\//, '')}`
  const [sinAncla] = conPrefijo.split('#')
  const existe = sinAncla.endsWith('/') && sinAncla !== `/${p}`
    ? existsSync(join(PUBLICO, sinAncla.slice(1), 'index.html'))
    : existsSync(join(PUBLICO, p, 'index.html'))
  return existe ? conPrefijo : ruta
}

const prefijoDe = (codigo) => IDIOMAS.find((i) => i.codigo === codigo)?.prefijo ?? ''

let tocadas = 0
let paginas = 0
const pendientes = []

for (const idioma of IDIOMAS) {
  const t = traductorDe(idioma.codigo)
  const delIdioma = ordenados.filter((a) => traducido(a, idioma.codigo))
  if (!delIdioma.length) continue

  /* Los idiomas en los que ESTE artículo existe, calculados una vez por
     artículo: es lo que alimenta el `hreflang` y el selector de la barra. */
  const idiomasDe = (a) => IDIOMAS.filter((l) => traducido(a, l.codigo))

  /* El índice de un idioma lista SOLO sus artículos, y se declara en los
     idiomas donde hay al menos uno. */
  const idiomasDelIndice = IDIOMAS.filter((l) => ordenados.some((a) => traducido(a, l.codigo)))

  const carpetaIdioma = join(PUBLICO, ...idioma.prefijo.split('/').filter(Boolean), 'blog')
  mkdirSync(carpetaIdioma, { recursive: true })

  const traducidos = delIdioma.map((a) => ({
    ...traducir(a, `blog.${a.slug}`, idioma.codigo),
    /* ⚠️ El título en español se conserva aparte: el mensaje de WhatsApp lo
       lleva SIEMPRE en español porque lo lee quien atiende el WhatsApp en
       Santo Domingo, y «Leí 《什么是NCF》 y quiero saber más» no le dice nada. */
    tituloEs: a.titulo,
  }))

  if (escribirSiCambia(join(carpetaIdioma, 'index.html'),
    indice(traducidos, { idioma: idioma.codigo, idiomas: idiomasDelIndice, t, rutaDestino }))) tocadas++
  paginas++

  /* Los slugs que existen EN ESTE IDIOMA. Lo usa la plantilla para decidir si
     un enlace del cuerpo lleva a la versión traducida o se queda en español:
     reescribirlo a ciegas daría 404 en los que aún no están. */
  const disponibles = new Set(delIdioma.map((a) => a.slug))

  for (const a of traducidos) {
    /* Los «del mismo tema»: hasta tres hermanos de su grupo QUE EXISTAN EN ESTE
       IDIOMA. Con menos de dos no se pinta la sección — una sola tarjeta suelta
       se ve peor que ninguna. */
    const hermanos = traducidos.filter((o) => o.cluster === a.cluster && o.slug !== a.slug).slice(0, 3)

    const carpeta = join(carpetaIdioma, a.slug)
    mkdirSync(carpeta, { recursive: true })
    const cambio = escribirSiCambia(join(carpeta, 'index.html'),
      articulo(a, hermanos.length >= 2 ? hermanos : [],
        { idioma: idioma.codigo, idiomas: idiomasDe(a), t, disponibles, rutaDestino }))
    if (cambio) tocadas++
    paginas++
  }

  console.log(`  ${idioma.codigo.padEnd(8)} ${delIdioma.length} artículos en public/${idioma.prefijo}blog/`)
}

for (const a of ordenados) {
  if (!traducido(a, 'en')) pendientes.push(a.slug)
}

const porGrupo = Object.keys(CLUSTERS)
  .map((c) => [CLUSTERS[c].nombre, ARTICULOS.filter((a) => a.cluster === c).length])
  .filter(([, n]) => n)
console.log('')
for (const [nombre, n] of porGrupo) console.log(`  ${String(n).padStart(2)} · ${nombre}`)
if (pendientes.length) {
  console.log(`\n⚠ ${pendientes.length} artículos solo en español, a la espera de traducción`)
}

const paises = new Set(ARTICULOS.map((a) => a.pais).filter(Boolean))
console.log(`\n${ordenados.length} artículos en ${porGrupo.length} temas · ${paises.size} países · ${tocadas} reescritos`)
