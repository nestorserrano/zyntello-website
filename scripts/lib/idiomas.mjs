/**
 * Los idiomas de las páginas estáticas y el catálogo que las traduce.
 *
 * ## De dónde salen las traducciones
 *
 * Del MISMO catálogo que traduce la portada: la tabla `textos_sitio` del panel
 * de administración, servida por `/api/textos-sitio`. No hay un segundo juego
 * de traducciones en este repositorio, y eso es deliberado — con dos fuentes,
 * nadie sabría en cuál corregir y la que se quedara atrás seguiría publicando
 * la versión vieja sin que nada lo dijera.
 *
 * ⚠️⚠️ PERO HAY UNA DIFERENCIA QUE HAY QUE TENER PRESENTE: la portada pide el
 * catálogo al cargar, así que una corrección en el panel se ve en el acto. Una
 * página estática lleva su texto COCIDO DENTRO, de modo que corregirla en el
 * panel no basta: hay que volver a generar y desplegar. El panel sigue siendo
 * el sitio donde se corrige; lo que no hace aquí es evitar el despliegue.
 *
 * ## La caché, y por qué está commiteada
 *
 * Generar no puede depender de que el API responda: si un día no contesta, lo
 * que saldría son 144 páginas en español con `lang="zh-Hans"` — válidas,
 * indexables y equivocadas, sin un solo error por pantalla. Así que el
 * catálogo se guarda en `scripts/lib/catalogo.json` y ese archivo va al
 * repositorio.
 *
 * El orden es: se intenta el API; si responde, se refresca la caché; si no, se
 * usa la caché. Y si tampoco hay caché, **se detiene la generación** en vez de
 * escribir páginas sin traducir.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const AQUI = dirname(fileURLToPath(import.meta.url))
const CACHE = join(AQUI, 'catalogo.json')
const API = 'https://admin.zyntello.com/api/textos-sitio'

/**
 * Los ocho idiomas, con el prefijo que llevan sus URLs.
 *
 * ⚠️ El español NO lleva prefijo: sus páginas siguen en `/servicios/{slug}/`,
 * donde ya están indexadas. Moverlas a `/es/servicios/...` habría roto todos
 * los enlaces publicados y toda la autoridad acumulada en Google, a cambio de
 * nada — un prefijo no hace la página más fácil de encontrar.
 */
export const IDIOMAS = [
  { codigo: 'es',      prefijo: '',         dir: 'ltr', nombre: 'Español' },
  { codigo: 'en',      prefijo: 'en/',      dir: 'ltr', nombre: 'English' },
  { codigo: 'fr',      prefijo: 'fr/',      dir: 'ltr', nombre: 'Français' },
  { codigo: 'it',      prefijo: 'it/',      dir: 'ltr', nombre: 'Italiano' },
  { codigo: 'zh-Hans', prefijo: 'zh-Hans/', dir: 'ltr', nombre: '简体中文' },
  { codigo: 'zh-Hant', prefijo: 'zh-Hant/', dir: 'ltr', nombre: '繁體中文' },
  // ⚠️ El árabe se escribe de derecha a izquierda: sin `dir="rtl"` el texto
  //    sale correcto y la página ilegible, con los elementos al lado contrario.
  { codigo: 'ar',      prefijo: 'ar/',      dir: 'rtl', nombre: 'العربية' },
  { codigo: 'ht',      prefijo: 'ht/',      dir: 'ltr', nombre: 'Kreyòl ayisyen' },
]

let catalogo = null

/** Trae el catálogo del API y refresca la caché; si no puede, usa la caché. */
export async function cargarCatalogo({ silencioso = false } = {}) {
  if (catalogo) return catalogo

  try {
    const r = await fetch(API, { signal: AbortSignal.timeout(20000) })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const d = await r.json()
    if (!d?.textos?.es) throw new Error('la respuesta no trae textos')
    catalogo = d.textos
    writeFileSync(CACHE, JSON.stringify(catalogo, null, 1), 'utf8')
    if (!silencioso) {
      console.log(`  catálogo: ${Object.keys(catalogo.es).length} claves del panel, caché refrescada`)
    }
    return catalogo
  } catch (e) {
    if (!existsSync(CACHE)) {
      /* ⚠️ Se PARA. Seguir escribiría páginas en español etiquetadas como
         chinas o árabes: válidas, indexables y equivocadas, sin que nada en
         pantalla lo delate. Más vale no generar que generar mal. */
      console.error(`\n✗ No se pudo leer el catálogo de traducciones (${e.message})`)
      console.error('  y no hay caché en scripts/lib/catalogo.json.')
      console.error('  Sin él, las páginas saldrían en español con el idioma equivocado declarado.\n')
      process.exit(1)
    }
    catalogo = JSON.parse(readFileSync(CACHE, 'utf8'))
    if (!silencioso) {
      console.log(`  ⚠ catálogo: el API no respondió (${e.message}), se usa la caché`)
    }
    return catalogo
  }
}

/**
 * El texto de una clave en un idioma.
 *
 * ⚠️ Cae al español y después al `respaldo`. Una clave que falte deja esa frase
 * en español en vez de un hueco — pero eso no se ve, así que la comprobación
 * que lo detecta es `scripts/verificar-traducciones.mjs`, no la vista.
 */
export function texto(idioma, clave, respaldo = '') {
  return catalogo?.[idioma]?.[clave] ?? catalogo?.es?.[clave] ?? respaldo
}

/** `texto()` ya atado a un idioma, para pasárselo a la plantilla. */
export const traductorDe = (idioma) => (clave, respaldo) => texto(idioma, clave, respaldo)

/**
 * Los campos que NO se traducen nunca, los mire quien los mire.
 *
 * `slug` es la URL —traducirla rompería los enlaces publicados y el canonical—,
 * `color` es un hex, `href` un enlace e `icono` el nombre de un icono. Pasarlos
 * por el catálogo no daría error: devolverían su propio valor y llenarían la
 * pantalla de traducción de filas que nadie debe tocar, escondiendo las que sí.
 */
const NO_TRADUCIR = new Set(['slug', 'color', 'href', 'icono', 'acento', 'tipoSchema'])

/**
 * Una copia del objeto con cada cadena buscada en el catálogo.
 *
 * La clave de cada una se arma con el prefijo y su RUTA dentro del objeto:
 * `serv.plataforma-saas.beneficios.0.titulo`. Es legible en el panel y, sobre
 * todo, es estable — mientras el dato no cambie de sitio, su traducción le
 * sigue.
 *
 * ⚠️⚠️ Y ahí está su límite, que conviene saber: si alguien REORDENA la lista
 * de beneficios en los datos, las traducciones se quedan donde estaban y cada
 * tarjeta sale con el texto de otra. No da ningún error —las ocho páginas se
 * generan y se ven bien—, simplemente dicen lo que no es. Reordenar obliga a
 * mover las claves del catálogo con la misma mano.
 */
export function traducir(obj, prefijo, idioma, ruta = []) {
  if (typeof obj === 'string') {
    const campo = ruta[ruta.length - 1]
    if (NO_TRADUCIR.has(campo) || !obj.trim() || obj.startsWith('http') || obj.startsWith('#')) return obj
    return texto(idioma, `${prefijo}.${ruta.join('.')}`, obj)
  }
  if (Array.isArray(obj)) return obj.map((v, i) => traducir(v, prefijo, idioma, [...ruta, String(i)]))
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) =>
      [k, NO_TRADUCIR.has(k) ? v : traducir(v, prefijo, idioma, [...ruta, k])]))
  }
  return obj
}

/**
 * La página traducida, con el nombre en español conservado aparte.
 *
 * ⚠️ `nombreEs` lo usa la plantilla para el mensaje de WhatsApp: ese texto va
 * siempre en español porque lo lee quien atiende el WhatsApp, y sin esto
 * llegaría «Quiero saber más sobre 企业资源计划», que no le dice nada a nadie
 * en Santo Domingo.
 */
export const paginaTraducida = (item, prefijo, idioma) => ({
  ...traducir(item, `${prefijo}.${item.slug}`, idioma),
  nombreEs: item.nombre,
})

/**
 * ¿Está esta página traducida a este idioma?
 *
 * ⚠️⚠️ Sin esta comprobación, un servicio todavía sin traducir se publicaría
 * igualmente en las ocho URLs: siete páginas en español declarando
 * `lang="zh-Hans"` o `lang="ar"`. Serían válidas, indexables y equivocadas, sin
 * un solo error por pantalla — y Google indexaría español bajo una etiqueta de
 * chino, que es peor que no tener esa página.
 *
 * Se mira el `nombre`, que es la primera clave que se siembra de cada página:
 * si falta, no hay nada traducido ahí. El español siempre pasa, porque es el
 * original y no necesita catálogo.
 */
export function estaTraducida(item, prefijo, idioma) {
  if (idioma === 'es') return true
  return Boolean(catalogo?.[idioma]?.[`${prefijo}.${item.slug}.nombre`])
}
