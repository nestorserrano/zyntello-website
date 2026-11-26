import { useEffect, useRef, useState } from 'react'
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
 * Por eso el botón «Elegir idioma» del propio aviso abre el selector: el aviso **no
 * sustituye** al selector, lleva a él. Quien lo use una vez ya sabe dónde está.
 *
 * ## ⚠️ Y la segunda mitad del mensaje es la que no puede faltar
 *
 * «Si no está el tuyo, dínoslo y lo añadimos» convierte una limitación en una conversación.
 * Sin esa frase, quien hable un idioma que no ofrecemos concluye que el producto no es para él
 * — y tiene razón en concluirlo, porque nada le dice lo contrario.
 *
 * ⚠️ Se cierra y se recuerda cerrado. Un aviso que reaparece en cada visita deja de leerse y
 * pasa a ser un estorbo que la gente aprende a esquivar con la vista.
 *
 * ⚠️ Y desde el 2026-11-24 (decisión del director técnico) se retira SOLO a los 20 segundos. Desde
 * el 2026-11-26 se recuerda como visto EN CUANTO APARECE: sale una sola vez, en la primera página,
 * y no vuelve ni al navegar, ni al regresar, ni al actualizar.
 * ⚠️ Si al cumplirse el plazo el puntero o el foco están dentro, espera a que salgan: quitarle
 * la tira a quien está a punto de pulsar «Elegir idioma» es peor que dejarla unos segundos más.
 */
const CLAVE = 'zyntello-aviso-idiomas'
const SEGUNDOS_A_LA_VISTA = 20

/** Lo escucha `SelectorIdioma` para desplegarse sin que haya que compartir estado entre ellos. */
export const EVENTO_ABRIR_IDIOMAS = 'zy-abrir-idiomas'

export default function AvisoIdiomas() {
  const { t, idioma } = useIdioma()
  const [visible, setVisible] = useState(false)
  const caja = useRef(null)
  const dentro = useRef(false)   // puntero o foco sobre la tira
  const vencido = useRef(false)  // ya pasaron los 20 segundos

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

    const medir = () => {
      raiz.style.setProperty('--zy-aviso-h', `${caja.current?.offsetHeight ?? 0}px`)
    }
    medir()

    const observador = new ResizeObserver(medir)
    if (caja.current) observador.observe(caja.current)
    return () => {
      observador.disconnect()
      aCero()
    }
  }, [visible, idioma])

  useEffect(() => {
    try {
      if (!localStorage.getItem(CLAVE)) {
        setVisible(true)
        // ⚠️ Se da por visto AL APARECER, no al cumplirse el plazo: si solo se anotaba a los 20
        // segundos, quien cambiaba de página o actualizaba antes se la volvía a encontrar en cada
        // carga — el reloj muere con la página y nunca llegaba a anotarse.
        localStorage.setItem(CLAVE, '1')
      }
    } catch {
      // Navegación privada o almacenamiento bloqueado: se enseña igual. Que no se pueda
      // recordar el cierre no es motivo para ocultar el aviso a quien aún no lo ha visto.
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const reloj = setTimeout(() => {
      vencido.current = true
      if (!dentro.current) setVisible(false)
    }, SEGUNDOS_A_LA_VISTA * 1000)
    return () => clearTimeout(reloj)
  }, [visible])

  const entrar = () => { dentro.current = true }
  const salir = (e) => {
    // `focusout` hacia un hijo de la propia tira no es salir de ella.
    if (e?.relatedTarget && caja.current?.contains(e.relatedTarget)) return
    dentro.current = false
    if (vencido.current) setVisible(false)
  }

  const cerrar = () => {
    setVisible(false)
    try { localStorage.setItem(CLAVE, '1') } catch { /* ver arriba */ }
  }

  const abrirSelector = () => {
    window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_IDIOMAS))
  }

  if (!visible) return null

  return (
    <div ref={caja} className="zy-aviso-idiomas" role="region" aria-label={t('avisoIdiomas.region', 'Idiomas disponibles')}
      onMouseEnter={entrar} onMouseLeave={salir} onFocus={entrar} onBlur={salir}>
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
