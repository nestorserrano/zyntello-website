import { createContext, useContext, useEffect, useState } from 'react'

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

/** Los que habla la plataforma. El orden es el del selector. */
export const IDIOMAS = [
  { codigo: 'es', nativo: 'Español', bandera: '🇩🇴' },
  { codigo: 'en', nativo: 'English', bandera: '🇺🇸' },
  { codigo: 'fr', nativo: 'Français', bandera: '🇫🇷' },
  { codigo: 'it', nativo: 'Italiano', bandera: '🇮🇹' },
  { codigo: 'zh-Hans', nativo: '简体中文', bandera: '🇨🇳' },
  { codigo: 'zh-Hant', nativo: '繁體中文', bandera: '🇹🇼' },
  // ⚠️ El árabe no lleva bandera: ninguna de sus 22 lo representa, y elegir una sería tomar
  //    partido por un país frente a los demás. Lleva la letra ع, como en la app.
  { codigo: 'ar', nativo: 'العربية', bandera: 'ع' },
  { codigo: 'ht', nativo: 'Kreyòl ayisyen', bandera: '🇭🇹' },
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

const Contexto = createContext(null)

export function ProveedorIdioma({ children }) {
  // ⚠️ Lo GUARDADO gana sobre lo detectado: el navegador solo decide la primera visita.
  const [idioma, setIdiomaEstado] = useState(() => leerGuardado() || detectarDelNavegador())
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
    setIdiomaEstado(nuevo)
    try { localStorage.setItem(CLAVE_IDIOMA, nuevo) } catch { /* vale para esta visita */ }
  }

  /**
   * El texto de una clave.
   *
   * ⚠️ Cae al español y, si tampoco está, al `respaldo` que trae el componente. Así una clave
   * nueva que todavía no esté en el panel muestra su texto en vez de un hueco o la clave cruda:
   * el visitante nunca ve `hero.titulo.1` en mitad de la página.
   */
  const t = (clave, respaldo = '') => textos?.[idioma]?.[clave] ?? textos?.es?.[clave] ?? respaldo

  return <Contexto.Provider value={{ idioma, setIdioma, t, idiomas: IDIOMAS }}>{children}</Contexto.Provider>
}

export function useIdioma() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useIdioma() fuera de <ProveedorIdioma>')
  return ctx
}
