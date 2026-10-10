/**
 * Verifica que cada clave de traducción que el sitio PIDE existe de verdad.
 *
 * POR QUÉ EXISTE
 *
 * `t('clave', 'respaldo')` cae al respaldo en español cuando la clave no está
 * en el diccionario. Eso es deliberado —así una clave recién añadida muestra su
 * texto en vez de un hueco o la clave cruda— pero convierte una errata en un
 * defecto SIN NINGÚN SÍNTOMA: la frase se queda en español en los ocho idiomas,
 * para siempre, sin error, sin log y sin nada en pantalla que lo distinga de
 * una traducción pendiente.
 *
 * ⚠️⚠️ Y no basta con comprobar por prefijo. Que `serv.*` tenga 47 claves
 * sembradas no dice NADA sobre si a la tarjeta número doce le falta la suya.
 * Por eso este script arma cada clave que los componentes van a construir al
 * vuelo —`serv.{slug}.titulo`, `pie.serv.{slug}`, `cont.op.{slug}`,
 * `porque.N.texto`— y las comprueba una a una.
 *
 * ⚠️ Las listas se LEEN del código, no se copian aquí: una copia divergiría y
 * la guarda pasaría en verde comparándose consigo misma.
 *
 *     node scripts/verificar-traducciones.mjs
 *
 * Sale con código 1 si falta alguna. Lo ejecuta `npm run build` antes de
 * compilar, porque el build se corre siempre antes de desplegar y una guarda
 * que depende de que alguien se acuerde no se ejecuta nunca.
 *
 * ⚠️ El catálogo vive en el repo del ADMIN, que es otro repositorio y no está
 * en el checkout del servidor. Si no lo encuentra, lo dice y sale en VERDE: en
 * Bluehost no hay nada que comprobar, y hacer fallar el build allí dejaría el
 * sitio sin desplegar por una guarda que ni siquiera puede medir.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { basename, dirname, join } from 'node:path'

const AQUI = dirname(fileURLToPath(import.meta.url))
const COMPONENTES = join(AQUI, '..', 'src', 'components')
const SEEDER = join(AQUI, '..', 'admin', 'database', 'seeders', 'TextosSitioSeeder.php')

/* ⚠️ `pathToFileURL` y no la ruta a secas: en Windows, `import('C:\\...')` falla
   con ERR_UNSUPPORTED_ESM_URL_SCHEME porque Node lee «C:» como un protocolo. */
const { claveChat } = await import(pathToFileURL(join(AQUI, '..', 'src', 'lib', 'claveChat.js')).href)

if (!existsSync(SEEDER)) {
  console.log('· Traducciones: no se encuentra el catálogo del admin, se omite la comprobación.')
  console.log('  (Es lo normal fuera del equipo de desarrollo: el admin es otro repositorio.)')
  process.exit(0)
}

const sembradas = new Set(
  [...readFileSync(SEEDER, 'utf8').matchAll(/'clave' => '([^']+)'/g)].map(m => m[1]),
)

const leer = n => readFileSync(join(COMPONENTES, n), 'utf8')

/** Todos los `.jsx` de `src/`, a cualquier profundidad. */
function fuentesJsx(dir = join(AQUI, '..', 'src')) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const ruta = join(dir, e.name)
    if (e.isDirectory()) return fuentesJsx(ruta)
    return e.name.endsWith('.jsx') ? [ruta] : []
  })
}
const esperadas = []   // claves exactas que el componente pide
const sueltas = []     // literales con pinta de clave, de la pasada amplia
const pide = (fichero, clave) => esperadas.push({ fichero, clave })

/* ── Las literales ───────────────────────────────────────────────────────────
 *
 * Dos pasadas, y la segunda no sobra: `t('pie.redes')` se ve a simple vista,
 * pero media docena de claves viven dentro de una lista —`clave: 'nos.pais.rd'`,
 * `['pie.legal.sla', '…']`— y llegan a `t()` como variable. Buscando solo la
 * llamada se escaparían justo las que nadie va a revisar a ojo.
 *
 * Por eso la segunda pasada reconoce cualquier literal que empiece por uno de
 * los prefijos de sección. Es amplio a propósito: un falso positivo se ve
 * enseguida —la guarda nombra la clave— y un falso negativo no se ve nunca. */
/* ⚠️ Una sección nueva se añade AQUÍ además de al catálogo. Si se olvida, sus
   claves de lista dejan de comprobarse y el aviso de huérfanas las delata —
   así fue como se descubrió que faltaba `sol.` el 2026-10-10. */
const PREFIJOS = ['nav.', 'hero.', 'porque.', 'cookies.', 'idioma.', 'pie.', 'cont.',
                  'serv.', 'nos.', 'port.', 'func.', 'a11y.', 'sol.']

/* ⚠️⚠️ `mod.*` es un prefijo ABIERTO y no se cuenta en ninguna de las dos
   direcciones. Sus claves se arman con el slug que manda el API del admin
   (`mod.${app.id}.nombre`), así que el conjunto lo decide el panel, no este
   repositorio:

   · Un módulo NUEVO en el panel no tiene traducción todavía, y eso no es un
     defecto: su tarjeta sale en español, que es el original, hasta que alguien
     la traduzca desde la pantalla de idiomas.
   · Un módulo RETIRADO del panel deja su traducción sin uso, y tampoco es un
     defecto: si vuelve, la encuentra hecha.

   Hacer fallar el build por cualquiera de los dos obligaría a desplegar este
   repositorio cada vez que el panel toca un módulo, que es justo lo que el
   catálogo en el admin existe para evitar. */
const PREFIJOS_ABIERTOS = ['mod.']

/* ⚠️ Se recorre TODO `src/`, no solo `components/`. El enlace «Saltar al
   contenido» vive en `App.jsx` y con la versión anterior —que miraba solo los
   componentes— su clave no se comprobaba. El límite de una guarda es dónde
   mira, y ése no se ve hasta que algo se queda fuera. */
for (const n of fuentesJsx()) {
  const fuente = readFileSync(n, 'utf8')
  for (const m of fuente.matchAll(/\bt\(\s*'([^']+)'/g)) pide(basename(n), m[1])
  for (const m of fuente.matchAll(/'([a-z][a-z0-9.-]*\.[a-z0-9.-]+)'/g)) {
    if (PREFIJOS.some(p => m[1].startsWith(p))) sueltas.push({ fichero: basename(n), clave: m[1] })
  }
}

// ── Las que se arman al vuelo, una a una ────────────────────────────────────

/* Servicios: cada tarjeta pide su título y su descripción, más su grupo. */
const servicios = leer('Servicios.jsx')
for (const m of servicios.matchAll(/slug: '([^']+)'/g)) {
  pide('Servicios.jsx', `serv.${m[1]}.titulo`)
  pide('Servicios.jsx', `serv.${m[1]}.desc`)
}
for (const g of new Set([...servicios.matchAll(/grupoClave: '([^']+)'/g)].map(m => m[1]))) {
  pide('Servicios.jsx', g)
}

/* Pie: los diez de la columna de servicios. Son nombres ABREVIADOS y por eso
   llevan clave propia, distinta del título de la tarjeta. */
for (const s of slugsDeLista(leer('Footer.jsx'))) pide('Footer.jsx', `pie.serv.${s}`)

/* Contacto: las catorce opciones del desplegable. */
for (const s of slugsDeLista(leer('Contacto.jsx'))) pide('Contacto.jsx', `cont.op.${s}`)

/* ⚠️⚠️ El chat: sus 148 claves NO se escriben en ninguna parte, se DERIVAN del
   texto en español con `claveChat()` — la misma función que usa el componente,
   importada, no copiada. Dos copias divergirían y esta guarda pasaría en verde
   comparándose consigo misma.

   Lo que esto detecta: alguien edita una frase del chat en español, su clave
   cambia, y la traducción vieja queda huérfana. La frase volvería a verse en
   español en los ocho idiomas sin ningún error. Aquí el build para y la nombra. */
const chat = leer('WhatsAppChat.jsx')
const arbol = chat.split('const NODOS = {')[1]?.split('\n}\n')[0]
if (!arbol) throw new Error('No se encontró el árbol NODOS en WhatsAppChat.jsx')

/* ⚠️⚠️ Se lee el ARRAY entero, no línea a línea, porque los dos formatos
   conviven en el mismo archivo:

       opciones: [          ←  una frase por línea
         'A',
         'B',
       ],
       opciones: ['A', 'B'],    ←  todas en una línea

   Una primera versión de esto miraba línea a línea y se saltó los de una sola
   línea — cuatro opciones de un nodo de ERP. La guarda pasó en VERDE y el
   defecto se descubrió recorriendo el chat a mano, con las opciones en español
   en mitad de una conversación en chino. Es el fallo que esta guarda existe
   para evitar, cometido por la guarda misma. */
for (const bloque of arbol.matchAll(/(?:mensajes|opciones):\s*\[([\s\S]*?)\]/g)) {
  for (const s of bloque[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)) {
    const texto = s[1].replace(/\\'/g, "'")
    if (texto.trim()) pide('WhatsAppChat.jsx', claveChat(texto))
  }
}

/* Y las frases sueltas, fuera del árbol: los mensajes que el flujo emite
   directamente y la opción «Otro». */
for (const m of chat.matchAll(/agregarMensaje\('bot', '([^']+)'\)/g)) {
  pide('WhatsAppChat.jsx', claveChat(m[1].replace(/\\'/g, "'")))
}
const otro = chat.match(/const OPCION_OTRO = '([^']+)'/)
if (otro) pide('WhatsAppChat.jsx', claveChat(otro[1]))

/* Por qué Zyntello: cada bloque pide su título y su texto. */
for (const m of leer('PorQueZyntello.jsx').matchAll(/clave: '([^']+)'/g)) {
  pide('PorQueZyntello.jsx', `${m[1]}.titulo`)
  pide('PorQueZyntello.jsx', `${m[1]}.texto`)
}

/* Portafolio: cada proyecto pide su categoría, su título y su resultado. */
for (const m of leer('Portafolio.jsx').matchAll(/clave: '([^']+)'/g)) {
  for (const parte of ['categoria', 'titulo', 'resultado']) {
    pide('Portafolio.jsx', `port.${m[1]}.${parte}`)
  }
}

/* Funcionalidades: cada una pide su nombre, su gancho, su descripción y su cifra. */
for (const m of leer('Funcionalidades.jsx').matchAll(/slug: '([^']+)'/g)) {
  for (const parte of ['nombre', 'gancho', 'desc', 'dato']) {
    pide('Funcionalidades.jsx', `func.${m[1]}.${parte}`)
  }
}

/** Los slugs de un `const SERVICIOS = [ ['slug', '…'], … ]`. */
function slugsDeLista(fuente) {
  const bloque = fuente.split('const SERVICIOS = [')[1]?.split('\n]')[0]
  if (!bloque) throw new Error('No se encontró la lista SERVICIOS en el componente')
  return [...bloque.matchAll(/\['([a-z0-9-]+)',/g)].map(m => m[1])
}

/* ⚠️ La pasada amplia también recoge los PREFIJOS que el componente guarda en
   una variable para construir la clave de verdad: `clave: 'porque.1'` nunca se
   pide tal cual, se pide `porque.1.titulo`. Se descartan comprobando si alguna
   clave exacta ya empieza por ellos — si no se hiciera, la guarda acusaría a
   seis claves que no existen ni tienen que existir, y una guarda que da
   falsas alarmas se desactiva. */
const exactas = new Set(esperadas.map(e => e.clave))
for (const s of sueltas) {
  const esPrefijo = [...exactas].some(k => k.startsWith(s.clave + '.'))
  if (!esPrefijo) esperadas.push(s)
}

// ── El veredicto ────────────────────────────────────────────────────────────
const faltan = esperadas.filter(e => !sembradas.has(e.clave))

if (faltan.length) {
  const n = faltan.length
  console.error(`\n✗ Falta${n === 1 ? '' : 'n'} ${n} clave${n === 1 ? '' : 's'} en el catálogo del admin.`)
  console.error('  Esas frases se verían en ESPAÑOL en los ocho idiomas, sin ningún aviso:\n')
  for (const { clave, fichero } of faltan) {
    console.error(`    ${clave.padEnd(38)} ${fichero}`)
  }
  console.error('\n  Añádelas a admin/database/seeders/TextosSitioSeeder.php y siembra:')
  console.error('    php artisan db:seed --class=TextosSitioSeeder\n')
  process.exit(1)
}

const unicas = new Set(esperadas.map(e => e.clave))

/* ⚠️⚠️ La cuenta al revés, que es la que se olvida: claves SEMBRADAS que
   ningún componente pide. Normalmente significa que alguien añadió la
   traducción al catálogo y olvidó aplicarla en la vista — y entonces la frase
   se sigue viendo en español aunque esté traducida, que es el mismo defecto
   mudo por el otro lado. Pasó tres veces el 2026-10-10 con `sol.pie.1`,
   `sol.pie.2` y `sol.regalo`.

   No para el build: una clave de más no rompe nada, y pararlo obligaría a
   borrar del catálogo antes de quitar su uso. Pero se dice, y por su nombre. */
const huerfanas = [...sembradas]
  .filter(k => !unicas.has(k))
  .filter(k => !PREFIJOS_ABIERTOS.some(p => k.startsWith(p)))
if (huerfanas.length) {
  console.log(`· Traducciones: ⚠ ${huerfanas.length} sembrada${huerfanas.length === 1 ? '' : 's'} que ninguna vista pide —`)
  console.log(`  está${huerfanas.length === 1 ? '' : 'n'} traducida${huerfanas.length === 1 ? '' : 's'} y se ve${huerfanas.length === 1 ? '' : 'n'} en español: ${huerfanas.join(', ')}`)
}

console.log(`· Traducciones: ${unicas.size} claves pedidas, todas en el catálogo (${sembradas.size} sembradas).`)
