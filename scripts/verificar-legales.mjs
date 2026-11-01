/**
 * Verifica las páginas legales traducidas antes de publicarlas.
 *
 *     node scripts/verificar-legales.mjs
 *
 * Sale con código 1 si algo falla. Lo ejecuta `npm run build`, porque el build se corre siempre
 * antes de desplegar y una guarda que depende de que alguien se acuerde no se ejecuta nunca.
 *
 * ## Qué comprueba, y por qué cada cosa
 *
 * ⚠️⚠️ **Que ninguna traducción esté a medias.** Un documento legal con la mitad de los párrafos
 * en español y la otra mitad en inglés no se lee como «falta traducir»: se lee como un documento
 * descuidado, y quien tiene que aceptarlo no sabe qué está aceptando. Peor aún, los párrafos que
 * quedan en español son invisibles para quien no lo lee — simplemente los salta.
 *
 * ⚠️⚠️ **Que esté el aviso de prevalencia.** Zyntello, S.R.L. es dominicana y sus documentos
 * obligan en español. Si una traducción no declara cuál manda, lo que hay publicado son dos
 * versiones del mismo contrato que dicen cosas ligeramente distintas y ninguna es claramente la
 * buena. Ese aviso no es cortesía: es lo que hace que la traducción se pueda publicar.
 *
 * ⚠️ **Que el `hreflang` solo nombre páginas que existen.** Declarar los ocho idiomas cuando hay
 * dos es el defecto ya medido en producción con `/en/precios/`: URLs que responden 404, que no se
 * ven en pantalla —la etiqueta vive en el `<head>`— y por las que Google deja de fiarse del
 * bloque entero, incluidas las que sí existen.
 *
 * ⚠️ **Que el árabe lleve `dir="rtl"`.** Sin él la página sale con el texto correcto y la
 * maquetación al revés: legible palabra a palabra e inusable.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { IDIOMAS } from './lib/idiomas.mjs'
import { LEGALES } from './lib/legales.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const PUBLICO = join(AQUI, '..', 'public')
const TRADUCCIONES = join(AQUI, 'legales')

/** Un bloque de prosa: la misma unidad que usa el generador. */
const BLOQUE = /<(p|li|h1|h2|h3|h4|th|td|dt|dd|caption|summary|figcaption|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi
const OPACO = /<(style|script)\b[\s\S]*?<\/\1>|<!--[\s\S]*?-->/gi
const TIENE_LETRAS = /[A-Za-zÁÉÍÓÚÑáéíóúñÜü]{2}/
const SIN_PROSA = /^(<code>[^<]*<\/code>|<a [^>]*>[^<]*<\/a>|[\w.@+-]+|Zyntello,? ?S\.R\.L\.)$/
const normalizar = (s) => s.replace(/\s+/g, ' ').trim()

/**
 * Lo que se escribe igual en todos los idiomas, así que coincidir con el español no significa
 * nada: marcas, nombres de producto, correos, teléfonos, dominios y cifras.
 *
 * ⚠️ Una guarda que acusa a «Firefox:» o a «WhatsApp» es ruido permanente, y una guarda con
 * ruido permanente deja de mirarse — que es la forma de que deje de proteger.
 */
const UNIVERSAL = new RegExp('^('
  + 'Zyntello|WhatsApp|Chrome|Firefox|Safari|Edge|Android|iOS|Excel|SLA|XSRF-TOKEN'
  + '|[A-Za-z][\\w /.-]*:'            // «Firefox:», «Android / iOS:»
  + '|[\\d\\s+()·-]+'                  // teléfonos, cifras, separadores
  + '|[^\\s@]+@[^\\s@]+'               // correos
  + '|[\\w.-]*zyntello\\.com[\\w./-]*' // dominios propios
  + '|©.*'                             // la línea de copyright
  + ')$', 'i')

/**
 * Textos que SÍ coinciden con el español en algún idioma, y es correcto que coincidan.
 *
 * ⚠️⚠️ Cada uno lleva su motivo, y el motivo es la mitad del valor: sin él, la próxima sesión no
 * puede distinguir una coincidencia legítima de una traducción que alguien olvidó y silenció
 * añadiéndola aquí. Si un texto está en esta lista sin explicar por qué, sobra.
 */
const COINCIDEN_A_PROPOSITO = {
  'Legal': 'se escribe igual en español, inglés, francés e italiano',
  'Ni de Meta, ni de LinkedIn, ni de TikTok.':
    'en francés la frase se construye igual que en español, palabra por palabra',
}

/**
 * Los nombres de los idiomas del selector se quedan en su propio idioma, a propósito.
 *
 * ⚠️ «Español» escrito en inglés sería «Spanish», y entonces un hispanohablante que aterriza en
 * la versión inglesa no reconocería su idioma en la lista — que es justo para lo que está el
 * selector. Cada idioma se nombra como lo nombran los suyos.
 */
const NOMBRES_DE_IDIOMA = new Set(IDIOMAS.map((i) => i.nombre))

const fallos = []
const avisos = []
let revisadas = 0

/**
 * Nada de lo que inserta el generador puede aparecer dos veces en la misma página.
 *
 * ⚠️⚠️ La página española es la FUENTE del generador y a la vez una de sus SALIDAS, así que cada
 * pasada relee lo que escribió la anterior. Sin cuidado, el archivo crece en cada
 * `npm run generar`: medido antes de arreglarlo, **20 `hreflang` y 10 copias del bloque de
 * estilos** tras tres ejecuciones. No da ningún error —el HTML sigue siendo válido y la página se
 * ve idéntica—, y el único síntoma es un diff enorme en un archivo que nadie tocó.
 */
function comprobarDuplicados (ruta, etiqueta) {
  const html = readFileSync(ruta, 'utf8')
  const vistos = new Map()

  for (const m of html.matchAll(/hreflang="([\w-]+)" href="https:\/\/zyntello\.com\//g)) {
    vistos.set(m[1], (vistos.get(m[1]) ?? 0) + 1)
  }

  const repetidos = [...vistos].filter(([, n]) => n > 1)
  if (repetidos.length) {
    fallos.push(`${etiqueta}: hreflang repetido (${repetidos.map(([c, n]) => `${c}×${n}`).join(', ')}). `
      + 'El generador está acumulando sobre su propia salida.')
  }

  const estilos = (html.match(/\.idiomas\{display/g) ?? []).length
  if (estilos > 1) {
    fallos.push(`${etiqueta}: el bloque de estilos del selector aparece ${estilos} veces.`)
  }
}

for (const slug of LEGALES) {
  const origen = join(PUBLICO, slug, 'index.html')
  if (!existsSync(origen)) {
    fallos.push(`${slug}: falta la página en español, que es la fuente de las demás`)
    continue
  }

  comprobarDuplicados(origen, `/${slug}/`)

  const base = readFileSync(origen, 'utf8').replace(OPACO, ' ')
  /* Todo el texto visible de la versión española, para comparar contra él. */
  const textosEspanoles = new Set(
    [...base.matchAll(/>([^<>]+)</g)].map((m) => normalizar(m[1])).filter(Boolean))

  const bloques = [...base.matchAll(BLOQUE)]
    .map((m) => normalizar(m[2]))
    .filter((b) => b && TIENE_LETRAS.test(b) && !SIN_PROSA.test(b))

  for (const { codigo, prefijo, dir } of IDIOMAS) {
    if (codigo === 'es') continue

    const jsonRuta = join(TRADUCCIONES, `${slug}.${codigo}.json`)
    const htmlRuta = join(PUBLICO, prefijo, slug, 'index.html')

    // Sin diccionario no debe haber página, y con diccionario tiene que haberla.
    if (!existsSync(jsonRuta)) {
      if (existsSync(htmlRuta)) {
        fallos.push(`/${prefijo}${slug}/ está publicada pero su diccionario ya no existe: `
          + 'esa página es una copia en español bajo una URL que dice estar en otro idioma')
      }
      continue
    }
    if (!existsSync(htmlRuta)) {
      fallos.push(`${slug}.${codigo}.json existe pero /${prefijo}${slug}/ no está generada `
        + '(falta correr `node scripts/generar-legales.mjs`)')
      continue
    }

    revisadas++
    comprobarDuplicados(htmlRuta, `/${prefijo}${slug}/`)
    const dicc = JSON.parse(readFileSync(jsonRuta, 'utf8'))
    const claves = new Set(Object.keys(dicc).map(normalizar))
    const faltan = bloques.filter((b) => !claves.has(b))

    if (faltan.length) {
      const pct = Math.round((bloques.length - faltan.length) * 100 / bloques.length)
      fallos.push(`${slug}.${codigo}: ${faltan.length} de ${bloques.length} bloques sin traducir `
        + `(${pct} %). El primero: «${faltan[0].slice(0, 70)}…»`)
    }

    // Un valor vacío es peor que una clave ausente: publica un párrafo en blanco, y un párrafo
    // en blanco en un contrato no dice «falta traducir», dice que esa obligación no existe.
    const vacios = Object.entries(dicc).filter(([, v]) => !v || !v.trim())
    if (vacios.length) {
      fallos.push(`${slug}.${codigo}: ${vacios.length} traducción(es) vacías`)
    }

    const html = readFileSync(htmlRuta, 'utf8')

    if (!html.includes('class="prevalece"')) {
      fallos.push(`/${prefijo}${slug}/ no lleva el aviso de prevalencia: sin él hay dos versiones `
        + 'del mismo documento y ninguna dice cuál obliga')
    }
    if (!new RegExp(`<html lang="${codigo}"`).test(html)) {
      fallos.push(`/${prefijo}${slug}/ no declara lang="${codigo}"`)
    }
    if (dir === 'rtl' && !/<html[^>]*\bdir="rtl"/.test(html)) {
      fallos.push(`/${prefijo}${slug}/ es de derecha a izquierda y no lo declara`)
    }

    /* ⚠️⚠️ Y la comprobación que de verdad importa: que en lo PUBLICADO no quede español a la
       vista. Las dos de arriba miran el diccionario —la forma—, y un diccionario completo
       convive sin problema con un menú, una cabecera y un pie en español: esos textos no viven
       dentro de un bloque de prosa, así que ninguna cuenta de bloques los ve. El resultado es
       una página con el contenido traducido y toda su navegación en español, que es justo lo que
       un porcentaje al 100 % te deja creer que no pasa.

       ⚠️ Se compara con la página ESPAÑOLA, texto a texto, en vez de adivinar el idioma. El
       primer intento buscaba acentos y palabras funcionales españolas, y acusó 24 textos de la
       versión en criollo: «Kondisyon Sèvis la» lleva «la», que en criollo es el artículo
       pospuesto. Una guarda con falsos positivos en un idioma entero no la mira nadie.

       Comparar es determinista: si un texto sale IGUAL que en español, no se tradujo. */
    const sinOpacos = html.replace(OPACO, ' ')
    const sueltos = new Set()

    for (const m of sinOpacos.matchAll(/>([^<>]+)</g)) {
      const t = normalizar(m[1])
      if (!t || !TIENE_LETRAS.test(t)) continue
      if (!textosEspanoles.has(t)) continue            // no está en el original: ya es otra cosa
      if (SIN_PROSA.test(t) || UNIVERSAL.test(t)) continue
      if (t in COINCIDEN_A_PROPOSITO) continue
      if (NOMBRES_DE_IDIOMA.has(t)) continue           // «Español» se queda en español a propósito
      sueltos.add(t)
    }

    if (sueltos.size) {
      fallos.push(`/${prefijo}${slug}/ tiene ${sueltos.size} texto(s) idénticos al español. `
        + `El primero: «${[...sueltos][0].slice(0, 60)}…»`)
    }

    // Cada hreflang declarado tiene que resolver a una página que existe.
    for (const m of html.matchAll(/hreflang="([\w-]+)" href="https:\/\/zyntello\.com\/([^"]*)"/g)) {
      const ruta = join(PUBLICO, m[2], 'index.html')
      if (!existsSync(ruta)) {
        fallos.push(`/${prefijo}${slug}/ declara hreflang="${m[1]}" hacia /${m[2]}, que no existe`)
      }
    }
  }
}

// Un diccionario cuyo slug ya no es una página legal es trabajo perdido que nadie va a mirar.
if (existsSync(TRADUCCIONES)) {
  for (const f of readdirSync(TRADUCCIONES)) {
    const slug = f.replace(/\.[\w-]+\.json$/, '')
    if (!LEGALES.includes(slug)) {
      avisos.push(`scripts/legales/${f}: «${slug}» no es una página legal conocida`)
    }
  }
}

/* ⚠️ Una excepción sin motivo no es una excepción: es un olvido silenciado. */
for (const [texto, motivo] of Object.entries(COINCIDEN_A_PROPOSITO)) {
  if (!motivo || motivo.length < 40) {
    fallos.push(`La excepción «${texto}» no explica por qué coincide con el español.`)
  }
}

for (const a of avisos) console.log(`  ⚠️  ${a}`)
for (const f of fallos) console.error(`  ✗ ${f}`)

if (fallos.length) {
  console.error(`\n${fallos.length} problema(s) en las páginas legales traducidas.`)
  console.error('Una página legal a medias se lee como un documento descuidado, y los párrafos')
  console.error('que quedan en español son invisibles para quien no lo lee.')
  process.exit(1)
}

console.log(`  ✓ ${revisadas} página(s) legal(es) traducida(s), completas y con su aviso de prevalencia`)
