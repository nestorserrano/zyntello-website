import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../hooks/useIdioma'

/**
 * Selector de idioma de la barra superior. Ver `[WEB-IDIOMA-1]`.
 *
 * ⚠️⚠️ Va VISIBLE y no escondido en un menú: el sitio se adapta al idioma del navegador, y quien
 * lo tenga configurado en uno que no habla —un dominicano con Windows en inglés— necesita poder
 * corregirlo sin buscarlo. Es el mismo motivo por el que el selector de la app está en la
 * pantalla de acceso: no se puede pedir a alguien que navegue en un idioma que no entiende para
 * llegar al sitio donde se cambia el idioma.
 */
export default function SelectorIdioma() {
  const { idioma, setIdioma, idiomas, t } = useIdioma()
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)

  const actual = idiomas.find((i) => i.codigo === idioma) || idiomas[0]

  /* La tira de «léenos en tu idioma» pide abrir esta lista. Va por un evento del DOM y no por
     estado compartido: son dos componentes en ramas distintas del árbol, y levantar el estado a
     un contexto solo para esto sería más piezas de las que el problema necesita.
     ⚠️ El foco se mueve al botón: quien llegó aquí con el teclado tiene que poder recorrer la
     lista que acaba de abrir, y sin esto el foco se queda en el banner. */
  useEffect(() => {
    const abrir = () => {
      setAbierto(true)
      caja.current?.querySelector('.zy-idioma-boton')?.focus()
    }
    window.addEventListener('zy-abrir-idiomas', abrir)
    return () => window.removeEventListener('zy-abrir-idiomas', abrir)
  }, [])

  // Cerrar al hacer clic fuera y con Escape: las dos, porque con teclado no hay clic fuera.
  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => { if (caja.current && !caja.current.contains(e.target)) setAbierto(false) }
    const escape = (e) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', escape)
    }
  }, [abierto])

  return (
    <div className="zy-idioma" ref={caja}>
      <button
        type="button"
        className="zy-idioma-boton"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        /* ⚠️ La etiqueta accesible va traducida: quien usa lector de pantalla y no lee español
           necesita oír qué hace este botón en SU idioma — si no, es el único control que no
           puede usar, y justo el que arregla todo lo demás. */
        aria-label={t('idioma.etiqueta', 'Cambiar idioma')}
      >
        {/* ⚠️⚠️ SIN bandera, y el motivo no es estético: en Windows el emoji de bandera NO
            existe, y el sistema lo sustituye por el par de letras del país. Junto al código
            del idioma eso sale «FR FR», «IT IT» y «HT HT» —la etiqueta repetida dos veces—,
            que es como el director técnico lo vio el 2026-11-16. El código ISO ya dice el
            idioma. Mismo motivo que `MONEDAS_INFO` en Soluciones.jsx. */}
        <span className="zy-idioma-codigo">{actual.codigo.split('-')[0].toUpperCase()}</span>
      </button>

      {/* ⚠⚠ La flecha vive AQUÍ, dentro de la barra, y no en la tira que la motiva.
          El motivo es de capas: la barra es `position: fixed` con z-index 1030 y la tira 1020,
          así que una flecha dibujada en la tira **no puede asomar sobre la barra** —queda
          detrás de ella, presente en el DOM e invisible en pantalla—. Colgada desde aquí
          sube hasta el botón y baja sobre la tira, que es el gesto que se quería.
          ⚠⚠ Y además apunta sola: al ser hermana del botón, no hay ninguna medida que
          mantener. Puesta en la tira quedó a 267px del selector —señalando el borde de la
          pantalla— porque la posición del botón cambia con el idioma: lo que hay a su
          derecha es «Se connecter», «登录» o «Iniciar sesión», y no miden lo mismo.
          ⚠️ Decorativa, con `aria-hidden`: a un lector de pantalla no le dice nada una
          curva, y el botón de al lado ya se nombra solo. */}
      <svg className="zy-nav-flecha" viewBox="0 0 42 64" aria-hidden="true" focusable="false">
        <defs>
          {/* `userSpaceOnUse` y no la caja de cada trazo: con el degradado relativo a cada
              forma, la punta recorrería ella sola los tres colores y no empalmaría con el
              final de la curva —se verían dos piezas de distinto color pegadas. */}
          <linearGradient id="zyFlechaIdioma" gradientUnits="userSpaceOnUse" x1="5" y1="58" x2="39" y2="4">
            <stop offset="0%"   stopColor="#22d3ee" />
            <stop offset="55%"  stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {/* Nace PLANA abajo a la izquierda, sobre la tira, y sube cerrada hasta la punta.
            Es un trazo con punta aparte y no una silueta maciza: la silueta anterior tenía
            que dibujar su propio contorno de vuelta, y esa vuelta se leía como una segunda
            curva —una banana, no una flecha—. */}
        <path d="M5 58 C 17 59, 20.6 35.9, 31 17.9" fill="none" stroke="url(#zyFlechaIdioma)" strokeWidth="6.5" strokeLinecap="round" />
        {/* La punta, a 60 grados: dirección (cos60, -sen60). El ángulo va en las coordenadas
            y no en un `rotate` del CSS, que inclinaría también la cola. */}
        <path d="M39 4 L38.7 24.6 L21.3 14.6 Z" fill="url(#zyFlechaIdioma)" />
      </svg>

      {abierto && (
        <ul className="zy-idioma-lista" role="listbox" aria-label={t('idioma.etiqueta', 'Cambiar idioma')}>
          {idiomas.map((i) => (
            <li key={i.codigo} role="none">
              <button
                type="button"
                role="option"
                aria-selected={i.codigo === idioma}
                className={`zy-idioma-opcion${i.codigo === idioma ? ' zy-idioma-activa' : ''}`}
                onClick={() => { setIdioma(i.codigo); setAbierto(false) }}
              >
                {/* ⚠️ El nombre va en SU PROPIO idioma —「简体中文」y no「Chino simplificado」—:
                    quien lo busca no lee el idioma en el que estaría escrito si no. */}
                <span dir={i.codigo === 'ar' ? 'rtl' : 'ltr'}>{i.nativo}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
