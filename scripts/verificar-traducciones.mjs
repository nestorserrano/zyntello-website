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
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const AQUI = dirname(fileURLToPath(import.meta.url))
const COMPONENTES = join(AQUI, '..', 'src', 'components')
const SEEDER = join(AQUI, '..', 'admin', 'database', 'seeders', 'TextosSitioSeeder.php')

if (!existsSync(SEEDER)) {
  console.log('· Traducciones: no se encuentra el catálogo del admin, se omite la comprobación.')
  console.log('  (Es lo normal fuera del equipo de desarrollo: el admin es otro repositorio.)')
  process.exit(0)
}

const sembradas = new Set(
  [...readFileSync(SEEDER, 'utf8').matchAll(/'clave' => '([^']+)'/g)].map(m => m[1]),
)

const leer = n => readFileSync(join(COMPONENTES, n), 'utf8')
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
const PREFIJOS = ['nav.', 'hero.', 'porque.', 'cookies.', 'idioma.', 'pie.', 'cont.', 'serv.', 'nos.', 'port.', 'func.', 'a11y.']

for (const n of readdirSync(COMPONENTES).filter(n => n.endsWith('.jsx'))) {
  const fuente = leer(n)
  for (const m of fuente.matchAll(/\bt\(\s*'([^']+)'/g)) pide(n, m[1])
  for (const m of fuente.matchAll(/'([a-z][a-z0-9.-]*\.[a-z0-9.-]+)'/g)) {
    if (PREFIJOS.some(p => m[1].startsWith(p))) sueltas.push({ fichero: n, clave: m[1] })
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

const unicas = new Set(esperadas.map(e => e.clave)).size
console.log(`· Traducciones: ${unicas} claves pedidas, todas en el catálogo (${sembradas.size} sembradas).`)
