import { createContext, useContext, useEffect, useState } from 'react'
import { enAplicaciones, rutaAplicaciones } from '../lib/vista'

/**
 * El idioma del sitio público. Ver `[WEB-IDIOMA-1]`.
 *
 * ## ⚠️⚠️ Aquí el navegador SÍ decide, y en la app NO. No es una incoherencia
 *
 * `EstablecerIdioma` de la app descarta `Accept-Language` a propósito: allí el visitante tiene
 * cuenta, y un dominicano en Estados Unidos con el navegador en inglés habla español. El navegador
 * propone, el usuario decide.
 *
 * Aquí no hay cuenta ni elección previa que respetar, así que la alternativa a detectar no es
 * «preguntar»: es **asumir español**. Y un visitante que llega a la portada en un idioma que no
 * entiende se va antes de encontrar el selector.
 *
 * ⚠️ Pero el navegador decide solo la PRIMERA visita. En cuanto se toca el selector, esa elección
 * manda y se recuerda — lo guardado gana siempre sobre lo detectado.
 */

const CLAVE_IDIOMA = 'zyntello-sitio-idioma'
const CLAVE_CACHE = 'zyntello-sitio-textos-v1'
const API = `${(import.meta.env.VITE_ADMIN_URL || 'https://admin.zyntello.com').replace(/\/$/, '')}/api/textos-sitio`

/**
 * Los que habla la plataforma. El orden es el del selector.
 *
 * ⚠⚠ **NO se les añade `bandera`, y el motivo está medido.** En Windows el emoji de bandera
 * NO existe: el sistema lo sustituye por el par de letras del indicador regional. Junto al
 * código del idioma eso sale **«FR FR», «IT IT» y «HT HT»** —la etiqueta repetida dos
 * veces— y en los demás, dos pares de letras sin relación («DO ES», «US EN»). Así lo vio el
 * director técnico el 2026-11-16 en la página francesa.
 *
 * ⚠ Y una bandera no identifica un idioma: el árabe no tiene ninguna que lo represente entre
 * sus 22 países, el francés se habla en 29 y el español en 21. El **nombre en su propio
 * idioma** —«Français», «简体中文»— lo dice sin ambigüedad y se lee en todos los sistemas.
 *
 * Misma decisión y mismo motivo que `MONEDAS_INFO` en `Soluciones.jsx`.
 */
export const IDIOMAS = [
  { codigo: 'es', nativo: 'Español' },
  { codigo: 'en', nativo: 'English' },
  { codigo: 'fr', nativo: 'Français' },
  { codigo: 'it', nativo: 'Italiano' },
  { codigo: 'zh-Hans', nativo: '简体中文' },
  { codigo: 'zh-Hant', nativo: '繁體中文' },
  { codigo: 'ar', nativo: 'العربية' },
  { codigo: 'ht', nativo: 'Kreyòl ayisyen' },
]

const CODIGOS = IDIOMAS.map((i) => i.codigo)

/**
 * Qué idioma trae el navegador, traducido a uno de los nuestros.
 *
 * ⚠️⚠️ El chino NO se puede resolver por los dos primeros caracteres. `zh-CN`, `zh-SG` y `zh-Hans`
 * son simplificado; `zh-TW`, `zh-HK` y `zh-Hant`, tradicional. Cortar por `zh` daría siempre el
 * mismo, y a un lector de Taiwán le saldría el sitio en una escritura que no es la suya — un
 * error que se ve enseguida y queda fatal.
 */
function detectarDelNavegador() {
  let candidatos = []
  try {
    candidatos = navigator.languages?.length ? [...navigator.languages] : [navigator.language]
  } catch {
    return 'es'
  }

  for (const bruto of candidatos) {
    if (!bruto) continue
    const l = bruto.toLowerCase()

    if (l.startsWith('zh')) {
      if (l.includes('hant') || l.includes('tw') || l.includes('hk') || l.includes('mo')) return 'zh-Hant'
      return 'zh-Hans'
    }

    // El resto se resuelve por el código base: `en-GB` → `en`, `fr-CA` → `fr`.
    const base = l.split('-')[0]
    const encontrado = CODIGOS.find((c) => c.toLowerCase() === base)
    if (encontrado) return encontrado
  }

  // ⚠️ Español por defecto, no inglés: es el idioma del negocio y el de la mayoría de sus
  //    clientes. Quien no lo hable tiene el selector arriba, visible desde la primera pantalla.
  return 'es'
}

function leerGuardado() {
  try {
    const g = localStorage.getItem(CLAVE_IDIOMA)
    return CODIGOS.includes(g) ? g : null
  } catch {
    return null
  }
}

/**
 * El idioma que pide la URL: `/en/`, `/ar/blog/...` → `en`, `ar`. La portada española no lleva
 * prefijo, así que devuelve `null` y deciden el resto de reglas.
 *
 * ⚠️⚠️ Esto MANDA sobre lo guardado y sobre el navegador, y es la única precedencia que tiene
 * sentido: una URL con prefijo no es una preferencia que el visitante tenga configurada en algún
 * sitio — es la página concreta que ha pedido, o la que alguien le ha compartido. Si `localStorage`
 * ganara, quien reciba `zyntello.com/ar/` por WhatsApp y haya visitado el sitio antes en español
 * vería la portada EN ESPAÑOL bajo una URL árabe: contenido de un idioma bajo la etiqueta de otro,
 * que es justo lo que el resto del sitio evita generando una página por idioma.
 *
 * ⚠️ No se escribe en `localStorage`: llegar por un enlace en otro idioma no debe cambiar la
 * preferencia de quien ya eligió una. Vale para esta visita, como el `Accept-Language`.
 */
function detectarDeLaUrl() {
  try {
    const primero = window.location.pathname.split('/').filter(Boolean)[0]
    return CODIGOS.includes(primero) && primero !== 'es' ? primero : null
  } catch {
    return null
  }
}

const Contexto = createContext(null)

export function ProveedorIdioma({ children }) {
  // ⚠️ La URL manda sobre todo; después lo GUARDADO, y el navegador solo decide la primera visita.
  const [idioma, setIdiomaEstado] = useState(
    () => detectarDeLaUrl() || leerGuardado() || detectarDelNavegador(),
  )
  const [textos, setTextos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CLAVE_CACHE)) || {} } catch { return {} }
  })

  // El diccionario viene del panel. Caché last-known-good, como el catálogo de módulos: si el
  // API tiene un hipo, el sitio sigue traducido con lo último que recibió.
  useEffect(() => {
    let vivo = true
    fetch(API)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!vivo || !d?.textos) return
        setTextos(d.textos)
        try { localStorage.setItem(CLAVE_CACHE, JSON.stringify(d.textos)) } catch { /* sin caché, se pide cada visita */ }
      })
      .catch(() => { /* Sin diccionario se ve en español, que es el original: nunca una página vacía. */ })
    return () => { vivo = false }
  }, [])

  // ⚠️⚠️ El `lang` y el `dir` del documento se actualizan de verdad: no son decorativos. `lang`
  //    es lo que usan los lectores de pantalla para elegir voz y pronunciación, y `dir="rtl"` es
  //    lo que pone el árabe de derecha a izquierda. Sin esto, el árabe se lee al revés.
  useEffect(() => {
    document.documentElement.lang = idioma
    document.documentElement.dir = idioma === 'ar' ? 'rtl' : 'ltr'
  }, [idioma])

  const setIdioma = (nuevo) => {
    if (!CODIGOS.includes(nuevo)) return
    try { localStorage.setItem(CLAVE_IDIOMA, nuevo) } catch { /* vale para esta visita */ }

    /* ⚠️⚠️ Si la portada se está viendo bajo un prefijo, elegir idioma tiene que MOVER la URL.
       Cambiar solo el estado deja `/en/` mostrando español: se ve bien hasta que el visitante
       recarga o comparte el enlace, y entonces la elección se deshace sola porque la URL manda.
       Un selector que se deshace al recargar es peor que uno que no está, porque el visitante
       cree que eligió. */
    /* El catálogo de aplicaciones tiene una página por idioma, así que ahí elegir idioma
       SIEMPRE mueve la URL — también desde el español, que no lleva prefijo. */
    if (enAplicaciones()) {
      const destinoApps = rutaAplicaciones(nuevo)
      if (window.location.pathname !== destinoApps) { window.location.assign(destinoApps); return }
    }
    const destino = nuevo === 'es' ? '/' : `/${nuevo}/`
    const actual = `/${window.location.pathname.split('/').filter(Boolean)[0] ?? ''}`
    const enPortadaConPrefijo = detectarDeLaUrl() !== null
    if (enPortadaConPrefijo && actual !== destino.replace(/\/$/, '')) {
      window.location.assign(destino)
      return
    }
    setIdiomaEstado(nuevo)
  }

  /**
   * El texto de una clave.
   *
   * ⚠️ Cae al español y, si tampoco está, al `respaldo` que trae el componente. Así una clave
   * nueva que todavía no esté en el panel muestra su texto en vez de un hueco o la clave cruda:
   * el visitante nunca ve `hero.titulo.1` en mitad de la página.
   */
  const t = (clave, respaldo = '') => textos?.[idioma]?.[clave] ?? textos?.es?.[clave] ?? respaldo

  /**
   * Un texto de un MÓDULO (nombre, subtítulo) cuyo dueño es el ADMIN, no este panel de textos.
   *
   * ⚠️⚠️ El español sale SIEMPRE del valor que manda el admin: si se leyera de aquí, renombrar
   * un módulo o cambiar su subtítulo en el admin no cambiaría el sitio (pedido por el director
   * técnico el 2026-11-25: «todo lo de los módulos viene del admin»).
   * La traducción solo se usa si fue hecha sobre ESE mismo español; si el admin lo cambió, la
   * traducción vieja diría otra cosa, y se muestra el español nuevo hasta que se traduzca.
   */
  const tAdmin = (clave, valorAdmin) => {
    if (!valorAdmin) return t(clave, '')
    if (idioma === 'es' || textos?.es?.[clave] !== valorAdmin) return valorAdmin
    return textos?.[idioma]?.[clave] ?? valorAdmin
  }

  return <Contexto.Provider value={{ idioma, setIdioma, t, tAdmin, idiomas: IDIOMAS }}>{children}</Contexto.Provider>
}

export function useIdioma() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useIdioma() fuera de <ProveedorIdioma>')
  return ctx
}
