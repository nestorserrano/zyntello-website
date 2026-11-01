/**
 * Publica las páginas legales en los ocho idiomas, con su selector.
 *
 *     node scripts/generar-legales.mjs
 *     node scripts/generar-legales.mjs --verificar   (no escribe; dice qué falta)
 *
 * ## Por qué estas páginas se generan distinto a las demás
 *
 * El resto del sitio se arma desde datos (`scripts/paginas/datos.mjs`) y una plantilla. Las
 * legales no: son HTML escrito a mano, entre 10 y 59 KB de texto jurídico cada una, y pasarlas a
 * datos exigiría trocear seis contratos en campos.
 *
 * ⚠️⚠️ Y ese troceo es justo lo que no se puede arriesgar aquí: si al reestructurar se pierde una
 * cláusula, la página sigue viéndose perfecta y lo que se ha publicado es un contrato distinto
 * del que la empresa firma. Así que **el HTML español no se toca**: es la fuente, y de él se
 * traducen solo los NODOS DE TEXTO. La estructura se conserva intacta.
 *
 * ## ⚠️⚠️ La versión vinculante es la española, y la traducción tiene que decirlo
 *
 * Zyntello, S.R.L. es dominicana y sus documentos legales obligan en español. Una traducción es
 * de cortesía, para que un cliente francés o árabe entienda qué acepta — pero si no declara cuál
 * manda, dos versiones del mismo contrato dicen cosas ligeramente distintas y **ninguna de las
 * dos es claramente la buena**. Por eso cada página traducida lleva el aviso de prevalencia con
 * enlace a la española, y una comprobación exige que esté.
 *
 * ## Lo que NO se traduce
 *
 * `<style>`, `<script>`, los `href`, las clases y el `<html lang>` fuera de su sitio. Traducir un
 * atributo técnico deja la página validando y rota por dentro, que es el fallo sin síntoma de
 * siempre.
 *
 * ## Una frase sin traducir sale en español
 *
 * A propósito. La alternativa —dejar el hueco vacío, o no publicar la página— es peor: un
 * documento legal con un párrafo en blanco no dice «falta traducir», dice que esa obligación no
 * existe. Mezclado se ve raro y se corrige; vacío, no se ve.
 */

import { mkdirSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { IDIOMAS } from './lib/idiomas.mjs'
import { esNombreTecnico } from './lib/no-se-traduce.mjs'
import { LEGALES } from './lib/legales.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const PUBLICO = join(AQUI, '..', 'public')
const TRADUCCIONES = join(AQUI, 'legales')

/* ── Lo que no se traduce nunca ─────────────────────────────────────────────── */
const OPACO = /<(style|script)\b[\s\S]*?<\/\1>|<!--[\s\S]*?-->/gi

/**
 * La unidad de traducción es el BLOQUE con su HTML dentro, no el nodo de texto.
 *
 * ⚠️⚠️ Un párrafo como `<p>Esta Política explica <strong>qué guardamos</strong> cuando usa
 * <a>zyntello.com</a>.</p>` tiene seis nodos sueltos. Traducidos uno a uno salen las palabras de
 * otro idioma en el orden del español: en árabe, que se lee al revés, y en chino, cuyo verbo no
 * va donde el español lo pone, el resultado no es mejorable — es ininteligible. Y la página se ve
 * perfecta, así que nadie lo detecta salvo quien lo lee en ese idioma.
 *
 * Con el bloque entero, quien traduce mueve el `<strong>` adonde corresponde en su idioma.
 */
const BLOQUE = /<(p|li|h1|h2|h3|h4|th|td|dt|dd|caption|summary|figcaption|blockquote)\b([^>]*)>([\s\S]*?)<\/\1>/gi

/**
 * Los recuadros de aviso (`<div class="note">`) también llevan prosa.
 *
 * ⚠️⚠️ No son decoración: en el SLA, «No hace falta pedírnoslo. El propietario de la cuenta
 * consulta el historial completo…» —que es lo que le dice al cliente cómo auditarnos— vive
 * suelto dentro de uno de ellos, sin un `<p>` que lo envuelva. Sin esta pasada, el párrafo se
 * publicaba en español dentro de una página por lo demás traducida, y la cuenta de bloques
 * marcaba 100 % porque ni siquiera lo contaba.
 *
 * ⚠️ Solo los de clase `note`, y con el cierre más cercano: un `div` genérico anida otros y una
 * expresión regular no sabe emparejarlos — se llevaría media página por delante.
 */
const AVISO = /<div class="(note[^"]*)">((?:(?!<\/?div)[\s\S])*?)<\/div>/gi
const TIENE_LETRAS = /[A-Za-zÁÉÍÓÚÑáéíóúñÜü]{2}/

/** El aviso de prevalencia, en cada idioma. Sin él, la traducción no se publica. */
const PREVALECE = {
  en: 'This is a courtesy translation. The binding version of this document is the Spanish one.',
  fr: 'Ceci est une traduction de courtoisie. La version qui fait foi est la version espagnole.',
  it: 'Questa è una traduzione di cortesia. La versione vincolante è quella spagnola.',
  ht: 'Sa a se yon tradiksyon pou fasilite lekti. Se vèsyon an panyòl la ki gen fòs legal.',
  ar: 'هذه ترجمة للتيسير فقط. النسخة المُلزِمة لهذا المستند هي النسخة الإسبانية.',
  'zh-Hans': '本文为便于理解提供的译文。具有法律约束力的版本为西班牙语版本。',
  'zh-Hant': '本文為便於理解提供的譯文。具有法律拘束力的版本為西班牙語版本。',
}

/** «Ver la versión en español», para el enlace del aviso. */
const VER_ORIGINAL = {
  en: 'Read the Spanish version',
  fr: 'Voir la version espagnole',
  it: 'Vedi la versione spagnola',
  ht: 'Gade vèsyon an panyòl la',
  ar: 'عرض النسخة الإسبانية',
  'zh-Hans': '查看西班牙语版本',
  'zh-Hant': '檢視西班牙語版本',
}

/** «Idioma», rótulo del selector. */
const IDIOMA = {
  es: 'Idioma', en: 'Language', fr: 'Langue', it: 'Lingua',
  ht: 'Lang', ar: 'اللغة', 'zh-Hans': '语言', 'zh-Hant': '語言',
}

/**
 * Traducciones de una página en un idioma: { "frase en español": "traducción" }.
 *
 * Que falte el archivo no es un error: significa que esa página todavía no está traducida a ese
 * idioma, y entonces no se publica. Publicar una copia íntegra en español bajo `/ar/privacidad/`
 * sería peor que no tenerla: el selector llevaría a una página que dice estar en árabe y no lo
 * está, y los buscadores la indexarían como contenido duplicado.
 */
function traduccionesDe (slug, codigo) {
  const ruta = join(TRADUCCIONES, `${slug}.${codigo}.json`)
  return existsSync(ruta) ? JSON.parse(readFileSync(ruta, 'utf8')) : null
}

/**
 * Colapsa los espacios para comparar.
 *
 * ⚠️⚠️ Sin esto, la clave del diccionario tiene que reproducir la sangría del HTML **carácter
 * por carácter**: un bloque indentado con ocho espacios y otro con diez son claves distintas
 * aunque digan lo mismo. Medido: con comparación literal, 43 de 113 bloques quedaron sin traducir
 * teniendo su traducción escrita al lado. Y el síntoma es el peor posible — la página se publica,
 * se ve bien, y solo está a medias en un idioma.
 *
 * Además hace el diccionario inmune a que alguien reformatee el HTML español: el texto es el
 * mismo, así que la traducción sigue encontrándose.
 */
const normalizar = (s) => s.replace(/\s+/g, ' ').trim()

/**
 * Un bloque que no contiene prosa: solo código, una URL, un correo o el nombre de la empresa.
 *
 * ⚠️ No es que «no haga falta traducirlo»: es que **no se debe**. `zyntello-session` es el nombre
 * literal de una cookie y `app.zyntello.com` un dominio; traducirlos haría que el lector buscara
 * en su navegador algo que no existe. Se descuentan del porcentaje para que el 100 % signifique
 * «traducido del todo» y no quede un resto perpetuo que nadie puede cerrar.
 */
/**
 * Lo que no es prosa: una URL, un correo, un bloque de código o el nombre de la empresa.
 *
 * ⚠️⚠️ Los NOMBRES de componentes y licencias se declaran en `lib/no-se-traduce.mjs`, no se
 * reconocen aquí por su forma. Se intentó y el patrón se tragó 67 bloques de la Política de
 * Cookies, párrafos enteros incluidos: no hay manera de distinguir «Laravel Framework» de
 * «Caché del catálogo» mirando la forma, y el daño no se ve — esos bloques dejan de contarse y
 * la cobertura marca 100 % con texto sin traducir dentro.
 */
const SIN_PROSA = /^(<code>[^<]*<\/code>|<a [^>]*>[^<]*<\/a>|[\w.@+-]+|Zyntello,? ?S\.R\.L\.)$/

/** Aplica el diccionario a los bloques de prosa, dejando intactas las zonas opacas. */
function traducirHtml (html, dicc) {
  // El diccionario se indexa por su clave normalizada, una sola vez.
  const porTexto = new Map(Object.entries(dicc).map(([k, v]) => [normalizar(k), v]))
  const trozos = []
  const limpio = html.replace(OPACO, (m) => {
    trozos.push(m)
    return `\u0000${trozos.length - 1}\u0000`
  })

  let traducidas = 0
  let total = 0

  let salida = limpio.replace(BLOQUE, (m, etiqueta, attrs, interno) => {
    const clave = normalizar(interno)
    if (!clave || !TIENE_LETRAS.test(clave)) return m
    const t = porTexto.get(clave)
    if (!(SIN_PROSA.test(clave) || esNombreTecnico(clave))) {
      total++
      if (t) traducidas++
    }
    return t ? `<${etiqueta}${attrs}>${t}</${etiqueta}>` : m
  })

  /* Los recuadros de aviso que llevan el texto SUELTO, sin un bloque dentro.
     ⚠️ Si el recuadro contiene un `<p>`, ese párrafo ya se tradujo arriba: tratar además el
     `div` entero crearía una segunda clave con el mismo texto, y entonces la misma frase
     tendría dos traducciones que pueden divergir — la que alguien corrija no será la que se
     publique, y nada lo dirá. */
  salida = salida.replace(AVISO, (m, clase, interno) => {
    const clave = normalizar(interno)
    if (!clave || !TIENE_LETRAS.test(clave)) return m
    if (/<(p|li|h[1-4]|table|ul|ol)\b/i.test(interno)) return m
    const t = porTexto.get(clave)
    if (!(SIN_PROSA.test(clave) || esNombreTecnico(clave))) {
      total++
      if (t) traducidas++
    }
    return t ? `<div class="${clase}">${t}</div>` : m
  })

  // Los atributos que una persona LEE. `href`, `class` y compañía no se tocan.
  for (const attr of ['content', 'alt', 'aria-label', 'title', 'placeholder']) {
    salida = salida.replace(new RegExp(`\\b${attr}="([^"]{4,})"`, 'g'), (m, v) => {
      const t = porTexto.get(normalizar(v))
      return t ? m.replace(v, t) : m
    })
  }

  salida = salida.replace(/<title>([^<]+)<\/title>/i, (m, v) => {
    const t = porTexto.get(normalizar(v))
    return t ? `<title>${t}</title>` : m
  })

  /* ⚠️ Segunda pasada: los textos que NO viven dentro de un bloque de prosa. Los enlaces de la
     barra de navegación y los rótulos de la cabecera son `<a>` y `<span>` sueltos dentro de un
     `<nav>` o un `<div>`, así que la pasada de bloques no los ve — y la página salía con su
     contenido traducido y su menú en español, que es exactamente la mezcla que delata un sitio
     a medio traducir.

     Solo sustituye lo que el diccionario DECLARA. Un texto no declarado se queda como está, así
     que esta pasada no puede tocar nada por accidente. */
  salida = salida.replace(/>([^<>]+)</g, (m, texto) => {
    const t = porTexto.get(normalizar(texto))
    return t ? m.replace(texto, texto.replace(texto.trim(), t)) : m
  })

  return { html: salida.replace(/\u0000(\d+)\u0000/g, (_, i) => trozos[Number(i)]), traducidas, total }
}

/**
 * El bloque de `hreflang` de una página.
 *
 * ⚠️⚠️ Solo se declaran los idiomas que de verdad EXISTEN. Declarar los ocho cuando hay tres es
 * el defecto que ya se midió en producción con `/en/precios/`: siete URLs que responden 404, que
 * no se ven en pantalla —la etiqueta vive en el `<head>`— pero que Google visita, encuentra
 * vacías y por las que deja de fiarse del bloque entero.
 */
function hreflang (slug, publicados) {
  const l = publicados.map((c) => {
    const { prefijo } = IDIOMAS.find((i) => i.codigo === c)
    return `<link rel="alternate" hreflang="${c}" href="https://zyntello.com/${prefijo}${slug}/">`
  })
  l.push(`<link rel="alternate" hreflang="x-default" href="https://zyntello.com/${slug}/">`)
  return l.join('\n')
}

/**
 * El selector, con los idiomas que esta página tiene de verdad.
 *
 * ⚠️ Con un solo idioma no se pinta nada. Un «Idioma: Español» sin nada que elegir no informa
 * —ya se está leyendo en español— y además promete una opción que no existe: quien lo ve busca
 * el desplegable y no lo hay.
 */
function selector (slug, actual, publicados) {
  if (publicados.length < 2) return ''

  const opciones = publicados.map((c) => {
    const { prefijo, nombre } = IDIOMAS.find((i) => i.codigo === c)
    const activo = c === actual
    return `<a href="/${prefijo}${slug}/" hreflang="${c}" lang="${c}"${activo ? ' aria-current="true"' : ''}>${nombre}</a>`
  }).join('')

  return `<div class="idiomas" role="navigation" aria-label="${IDIOMA[actual] ?? 'Idioma'}">`
    + `<span>${IDIOMA[actual] ?? 'Idioma'}:</span>${opciones}</div>`
}

/**
 * Lleva los enlaces entre páginas legales a la versión del idioma que se está leyendo.
 *
 * ⚠️⚠️ Sin esto, quien abre `/en/cookies/` y pulsa «Privacy Policy» en el pie **aterriza en
 * español** y pierde el idioma sin haber hecho nada raro. Es la forma más silenciosa de que un
 * sitio traducido se sienta a medias: cada enlace es una puerta de vuelta al original.
 *
 * ⚠️ Solo se reescribe si esa página EXISTE en ese idioma. Apuntar a `/ar/terminos/` cuando no
 * está traducida da un 404 — peor que el español, que al menos se puede leer con un traductor.
 *
 * ⚠️ El enlace del aviso de prevalencia queda fuera a propósito: ése TIENE que ir al español,
 * porque es el que manda. Por eso lleva `hreflang="es"` y se reconoce por él.
 */
function enlazarEnSuIdioma (html, prefijo) {
  const codigo = prefijo.replace('/', '')

  return html.replace(/href="\/([\w-]+)\/((?:#[\w-]+)?)"/g, (m, destino, ancla) => {
    if (!LEGALES.includes(destino)) return m
    if (!existsSync(join(TRADUCCIONES, `${destino}.${codigo}.json`))) return m
    return `href="/${prefijo}${destino}/${ancla}"`
  })
}

/** El aviso de prevalencia que abre cada traducción. */
function avisoPrevalencia (slug, codigo) {
  return `<div class="prevalece" role="note">${PREVALECE[codigo]} `
    + `<a href="/${slug}/" hreflang="es" lang="es">${VER_ORIGINAL[codigo]}</a>.</div>`
}

/**
 * Marcas que delimitan TODO lo que este generador inserta.
 *
 * ## ⚠️⚠️ Por qué hacen falta: la página española es la fuente Y la salida
 *
 * El original en español es de donde se leen los bloques y, a la vez, el archivo donde se escribe
 * su propia versión con el selector. Sin marcas, cada pasada vuelve a añadir lo que la anterior
 * ya había puesto: medido tras tres ejecuciones, **20 etiquetas `hreflang` y 10 copias del mismo
 * bloque de estilos** en una sola página.
 *
 * Y no da ningún error. El HTML sigue siendo válido, la página se ve idéntica y el archivo crece
 * en cada `npm run generar` — el único síntoma es un diff enorme en un archivo que nadie tocó.
 *
 * Con las marcas, lo primero que hace cada pasada es BORRAR lo que insertó la anterior. El
 * generador se vuelve idempotente, que es lo que se espera de un generador: correrlo dos veces
 * tiene que dar exactamente lo mismo que correrlo una.
 */
const MARCA_INICIO = '<!--zyntello:legales-->'
const MARCA_FIN = '<!--/zyntello:legales-->'
/**
 * ⚠️ La limpieza se lleva también los saltos de línea que rodean lo insertado.
 *
 * Sin eso, el salto que separa el bloque de la etiqueta siguiente queda FUERA de la marca, así
 * que la limpieza no lo borra y la pasada siguiente añade el suyo: el archivo gana **una línea
 * en blanco por ejecución**. Medido: de 5 a 7 líneas tras dos pasadas de `npm run generar`.
 *
 * Es la versión leve del mismo defecto que las marcas existen para evitar, y la más fácil de
 * pasar por alto — nadie revisa un diff de líneas vacías.
 */
const INSERTADO = /\n*<!--zyntello:legales-->[\s\S]*?<!--\/zyntello:legales-->\n*/g

/** Envuelve lo insertado para poder quitarlo en la pasada siguiente. */
const marcar = (html) => (html ? `${MARCA_INICIO}${html}${MARCA_FIN}` : '')

/**
 * Deja el HTML con saltos LF, que es como el repositorio guarda estos archivos.
 *
 * ⚠️⚠️ En Windows el checkout los pone en el disco con CRLF, pero lo que el generador inserta
 * lleva `\n` —es una cadena de JavaScript—, así que el archivo escrito quedaba **mezclado**: 360
 * saltos CRLF y 109 LF en el mismo fichero. Y un archivo mezclado no coincide con su versión
 * guardada por ningún lado: un cambio de 74 líneas producía un diff de **7.000**, con el cambio
 * real enterrado dentro. Nadie revisa un diff así; se acepta entero, y ahí es donde se cuelan
 * las cosas.
 *
 * Se normaliza a LF y no al revés porque LF es lo que hay en el repositorio; de la conversión
 * para Windows ya se encarga git al hacer checkout.
 */
const conSaltosDelRepo = (html) => html.replace(/\r\n/g, '\n')

const ESTILO = `<style>
.idiomas{display:flex;flex-wrap:wrap;gap:.35rem .75rem;align-items:center;padding:.75rem 0;font-size:.82rem}
.idiomas span{color:var(--tx3,#64748b);text-transform:uppercase;letter-spacing:.08em;font-size:.72rem}
.idiomas a{color:var(--tx3,#64748b);text-decoration:none;padding:.15rem .5rem;border-radius:99px;border:1px solid transparent}
.idiomas a:hover{color:var(--ac,#60a5fa);border-color:var(--line2,rgba(255,255,255,.14))}
.idiomas a[aria-current]{color:var(--ac,#60a5fa);border-color:var(--ac,#60a5fa)}
.prevalece{margin:1rem 0;padding:.75rem 1rem;border-radius:.5rem;font-size:.86rem;
  color:var(--tx2,#94a3b8);background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.28)}
.prevalece a{color:var(--ac,#60a5fa)}
</style>`

/* ── Generación ─────────────────────────────────────────────────────────────── */

const verificar = process.argv.includes('--verificar')
let escritas = 0
const resumen = []

for (const slug of LEGALES) {
  const origen = join(PUBLICO, slug, 'index.html')
  if (!existsSync(origen)) {
    console.error(`  ⚠️  falta ${slug}/index.html — se omite`)
    continue
  }
  // ⚠️ Lo primero: quitar lo que insertó la pasada anterior. Sin esto el archivo crece en cada
  // ejecución, porque la página española es la fuente y la salida a la vez.
  const crudo = readFileSync(origen, 'utf8')
  const base = crudo.replace(INSERTADO, '')

  // Qué idiomas tienen traducción de ESTA página. El español siempre.
  const publicados = ['es', ...IDIOMAS
    .filter((i) => i.codigo !== 'es')
    .filter((i) => traduccionesDe(slug, i.codigo))
    .map((i) => i.codigo)]

  for (const { codigo, prefijo, dir } of IDIOMAS) {
    if (!publicados.includes(codigo)) continue

    const dicc = codigo === 'es' ? {} : traduccionesDe(slug, codigo)
    let { html, traducidas, total } = codigo === 'es'
      ? { html: base, traducidas: 0, total: 0 }
      : traducirHtml(base, dicc)

    // `lang` y `dir` en la etiqueta raíz: sin `dir="rtl"` el árabe sale legible y la página no.
    html = html.replace(/<html[^>]*>/i, `<html lang="${codigo}"${dir === 'rtl' ? ' dir="rtl"' : ''}>`)

    // La canónica apunta a ESTA versión, no a la española: si no, Google indexa solo una.
    html = html.replace(/<link rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="https://zyntello.com/${prefijo}${slug}/">`)

    // hreflang + estilo del selector, justo antes de cerrar el <head>.
    html = html.replace(/<\/head>/i, `${marcar(`\n${hreflang(slug, publicados)}\n${ESTILO}\n`)}</head>`)

    // ⚠️ El orden importa: los enlaces del CONTENIDO se llevan al idioma que se está leyendo,
    // pero los del selector y los del aviso de prevalencia tienen que seguir apuntando al
    // español —son precisamente los que devuelven al original—, así que se insertan DESPUÉS.
    if (codigo !== 'es') html = enlazarEnSuIdioma(html, prefijo)

    html = html.replace(/<\/header>/i, `${marcar(selector(slug, codigo, publicados))}</header>`)
    if (codigo !== 'es') {
      html = html.replace(/<main[^>]*>/i, (m) => `${m}${marcar(`\n${avisoPrevalencia(slug, codigo)}`)}`)
    }

    const carpeta = join(PUBLICO, prefijo, slug)
    if (!verificar) {
      mkdirSync(carpeta, { recursive: true })
      if (escribirSiCambia(join(carpeta, 'index.html'), conSaltosDelRepo(html))) escritas++
    }

    if (codigo !== 'es') {
      resumen.push({ slug, codigo, traducidas, total, pct: total ? Math.round(traducidas * 100 / total) : 0 })
    }
  }
}

for (const r of resumen) {
  console.log(`  ${r.slug.padEnd(18)} ${r.codigo.padEnd(8)} ${String(r.pct).padStart(3)}%  (${r.traducidas}/${r.total})`)
}
console.log(verificar
  ? `\n${resumen.length} traducción(es) publicables`
  : `\n${escritas} archivo(s) escritos · ${resumen.length} traducción(es) publicadas`)
