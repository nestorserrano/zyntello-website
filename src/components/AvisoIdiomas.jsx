import { useCallback, useEffect, useRef, useState } from 'react'
import { useIdioma } from '../hooks/useIdioma'

/**
 * Tira que avisa de que el sitio se lee en ocho idiomas, y que se añaden más si hacen falta.
 *
 * ## ⚠️⚠️ Por qué hace falta si el selector ya está arriba
 *
 * El selector es un código de dos letras en la esquina de la barra. Quien llega al sitio **no lo
 * está buscando**: está leyendo la portada, y si la portada no está en su idioma se va antes de
 * recorrer la barra con la vista. Un visitante que se marcha no informa de que se marchó, así
 * que el defecto no tiene síntoma — solo una tasa de rebote que nadie atribuye al idioma.
 *
 * La flecha curva existe por eso: el banner **no sustituye** al selector, lo SEÑALA. Quien lo
 * use una vez ya sabe dónde está para siempre.
 *
 * ⚠️⚠️ **El dibujo de la flecha NO está en este archivo**, está en `SelectorIdioma`: cuelga del
 * propio botón al que apunta. Dibujada aquí no podía asomar sobre la barra —fija, z-index 1030
 * contra el 1020 de la tira— y acababa saliendo por abajo, de cola, al revés de lo que una
 * flecha hace. Lo único que queda aquí es encenderla y apartarle el sitio.
 *
 * ## ⚠️ Y la segunda mitad del mensaje es la que no puede faltar
 *
 * «Si no está el tuyo, dínoslo y lo añadimos» convierte una limitación en una conversación.
 * Sin esa frase, quien hable un idioma que no ofrecemos concluye que el producto no es para él
 * — y tiene razón en concluirlo, porque nada le dice lo contrario.
 *
 * ⚠️ Se cierra y se recuerda cerrado. Un aviso que reaparece en cada visita deja de leerse y
 * pasa a ser un estorbo que la gente aprende a esquivar con la vista.
 */
const CLAVE = 'zyntello-aviso-idiomas'

/** Ancho del dibujo de la flecha; el mismo número que `SelectorIdioma.css`. */
const ANCHO_FLECHA = 42

/** Lo escucha `SelectorIdioma` para desplegarse sin que haya que compartir estado entre ellos. */
export const EVENTO_ABRIR_IDIOMAS = 'zy-abrir-idiomas'

export default function AvisoIdiomas() {
  const { t, idioma } = useIdioma()
  const [visible, setVisible] = useState(false)
  const caja = useRef(null)

  /*
   * Aparta el contenido de la tira de debajo de la flecha, que cuelga de la barra sobre su
   * franja superior.
   *
   * ⚠⚠ Se MIDE el selector y no se escribe un número. Lo que hay a su derecha —«Se
   *     connecter», «登录», «Iniciar sesión»— no mide lo mismo en los ocho idiomas, así que
   *     el botón se desplaza: un hueco fijo dejaría la flecha encima del botón coral en unos
   *     idiomas y con 100px de aire de más en otros. Y el defecto no avisa —se ve torcido,
   *     nada falla—.
   * ⚠️ Si no hay flecha (barra plegada en hamburguesa ≤1299px, o aún sin montar) no se reserva nada: el hueco
   *     estrecharía el texto a cambio de apartarse de algo que no está.
   */
  const apartarse = useCallback(() => {
    const c = caja.current
    if (!c) return

    const sel = document.querySelector('.zy-idioma')
    if (!sel || !window.matchMedia('(min-width: 1300px)').matches) {
      c.style.removeProperty('--zy-aviso-hueco')
      return
    }

    const b = sel.getBoundingClientRect()
    /* ⚠️ El rect es el de la CAJA interior, no el del `ref`, que ocupa la ventana entera: el
       padding se aplica desde el borde de la caja, así que medir desde el de la ventana
       reservaba de más —149px sobrantes en una pantalla de 1600—. */
    const r = (c.querySelector('.zy-aviso-idiomas-caja') ?? c).getBoundingClientRect()
    const centro = b.left + b.width / 2
    const rtl = getComputedStyle(document.documentElement).direction === 'rtl'
    /* Distancia del borde FINAL de la caja al centro del botón —derecho en LTR, izquierdo
       en árabe—, más el ancho de la flecha y un respiro. */
    const hasta = rtl ? centro - r.left : r.right - centro
    c.style.setProperty('--zy-aviso-hueco', `${Math.max(0, Math.round(hasta + ANCHO_FLECHA + 10))}px`)
  }, [])

  /*
   * Publica el alto real de la tira en `--zy-aviso-h`, que es lo que el hero, el
   * `scroll-padding` de los enlaces internos y el menú del móvil suman para apartarse.
   *
   * ⚠️⚠️ Se MIDE y no se escribe un número: la tira se pliega a dos líneas en pantallas
   *     estrechas y cambia de alto según la longitud del texto, que es distinta en cada uno de
   *     los ocho idiomas. Un 48px fijo cuadraría en español y taparía el hero en alemán o en
   *     criollo — y nada lo avisaría.
   * ⚠️ El `ResizeObserver` hace falta además del cálculo inicial: al girar el teléfono o
   *     estrechar la ventana la tira cambia de alto y el hueco se quedaría con el alto viejo.
   */
  useEffect(() => {
    const raiz = document.documentElement
    const aCero = () => raiz.style.setProperty('--zy-aviso-h', '0px')

    if (!visible) { aCero(); return }

    /*
     * ⚠⚠ El marcador es lo que ENCIENDE la flecha, que vive en la barra y no aquí
     *     (ver `SelectorIdioma.css`). Sin tira no hay nada que explique por qué hay una
     *     flecha señalando, y una flecha sin motivo se lee como un adorno.
     */
    raiz.dataset.avisoIdiomas = ''

    const medir = () => {
      raiz.style.setProperty('--zy-aviso-h', `${caja.current?.offsetHeight ?? 0}px`)
      apartarse()
    }
    medir()

    const observador = new ResizeObserver(medir)
    if (caja.current) observador.observe(caja.current)
    return () => {
      observador.disconnect()
      aCero()
      delete raiz.dataset.avisoIdiomas
      caja.current?.style.removeProperty('--zy-aviso-hueco')
    }
  }, [visible, idioma, apartarse])

  useEffect(() => {
    try {
      if (!localStorage.getItem(CLAVE)) setVisible(true)
    } catch {
      // Navegación privada o almacenamiento bloqueado: se enseña igual. Que no se pueda
      // recordar el cierre no es motivo para ocultar el aviso a quien aún no lo ha visto.
      setVisible(true)
    }
  }, [])

  const cerrar = () => {
    setVisible(false)
    try { localStorage.setItem(CLAVE, '1') } catch { /* ver arriba */ }
  }

  const abrirSelector = () => {
    window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_IDIOMAS))
  }

  if (!visible) return null

  return (
    <div ref={caja} className="zy-aviso-idiomas" role="region" aria-label={t('avisoIdiomas.region', 'Idiomas disponibles')}>
      <div className="zy-aviso-idiomas-caja">
        <p className="zy-aviso-idiomas-texto">
          <strong>{t('avisoIdiomas.titulo', 'Visítanos en tu idioma.')}</strong>{' '}
          {t('avisoIdiomas.cuerpo', 'Este sitio se lee en 8 idiomas. ¿No está el tuyo? Avísanos y lo agregamos.')}
        </p>

        <div className="zy-aviso-idiomas-acciones">
          <button type="button" className="zy-aviso-idiomas-boton" onClick={abrirSelector}>
            {t('avisoIdiomas.elegir', 'Elegir idioma')}
          </button>

          {/* ⚠️ El correo de contacto va en el propio aviso y no detrás de otro clic: quien
              necesita pedir un idioma es justo quien menos entiende la página donde buscarlo. */}
          <a className="zy-aviso-idiomas-enlace" href="mailto:info@zyntello.com?subject=Idioma">
            {t('avisoIdiomas.pedir', 'Pedir otro idioma')}
          </a>
        </div>

        <button
          type="button"
          className="zy-aviso-idiomas-cerrar"
          onClick={cerrar}
          aria-label={t('avisoIdiomas.cerrar', 'Cerrar aviso')}
        >
          ×
        </button>
      </div>
    </div>
  )
}
