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
      <svg className="zy-nav-flecha" viewBox="0 0 48 72" aria-hidden="true" focusable="false">
        <defs>
          {/* `userSpaceOnUse`: el degradado recorre la flecha ENTERA de la cola a la punta, y
              no cada forma por su cuenta. De azul acero (la cola, que acompaña) a salmón —el
              mismo coral del botón «Elegir idioma»— en la punta, que es lo que debe mirarse. */}
          <linearGradient id="zyFlechaIdioma" gradientUnits="userSpaceOnUse" x1="38" y1="66" x2="9" y2="4">
            <stop offset="0%"   stopColor="#4f6f9c" />
            <stop offset="45%"  stopColor="#8fb0dc" />
            <stop offset="100%" stopColor="#e89b84" />
          </linearGradient>
        </defs>
        {/* Trazo CALIGRÁFICO: no es una línea con grosor fijo sino una forma rellena cuyos
            dos bordes se separan a lo largo de la curva —0,3 en la cola, 3,6 en el cuello—, así
            que nace fina y llega con fuerza a una cabeza ancha y maciza que forma una sola
            pieza con el cuerpo.
            Nace abajo a la DERECHA del botón y termina casi vertical (dirección ≈ −117°):
            apunta HACIA ARRIBA, al selector, no en diagonal.
            ⚠️ Colores OPACOS: con transparencia en la cola, el borde y el relleno se suman donde
            se solapan y dibujan una costura más oscura. El `stroke` del mismo degradado con `strokeLinejoin="round"` redondea la cola y
            las tres esquinas de la cabeza sin cambiar su forma. */}
        <path
          d="M37.7 66 C 38.8 41.9, 17.3 27.3, 10.8 15.6 L 6.8 17.6 L 9.1 4.2 L 21.2 10.4 L 17.2 12.4 C 22.7 24.7, 41.2 42.1, 38.3 66 Z"
          fill="url(#zyFlechaIdioma)"
          stroke="url(#zyFlechaIdioma)"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
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
