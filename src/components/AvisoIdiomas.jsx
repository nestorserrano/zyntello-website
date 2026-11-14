import { useEffect, useState } from 'react'
import { useIdioma } from '../hooks/useIdioma'

/**
 * Tira que avisa de que el sitio se lee en ocho idiomas, y que se añaden más si hacen falta.
 *
 * ## ⚠️⚠️ Por qué hace falta si el selector ya está arriba
 *
 * El selector es una bandera pequeña en la esquina de la barra. Quien llega al sitio **no lo
 * está buscando**: está leyendo la portada, y si la portada no está en su idioma se va antes de
 * recorrer la barra con la vista. Un visitante que se marcha no informa de que se marchó, así
 * que el defecto no tiene síntoma — solo una tasa de rebote que nadie atribuye al idioma.
 *
 * La flecha curva existe por eso: el banner **no sustituye** al selector, lo SEÑALA. Quien lo
 * use una vez ya sabe dónde está para siempre.
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

/** Lo escucha `SelectorIdioma` para desplegarse sin que haya que compartir estado entre ellos. */
export const EVENTO_ABRIR_IDIOMAS = 'zy-abrir-idiomas'

export default function AvisoIdiomas() {
  const { t, idiomas, idioma } = useIdioma()
  const [visible, setVisible] = useState(false)

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

  const actual = idiomas.find((i) => i.codigo === idioma) || idiomas[0]

  return (
    <div className="zy-aviso-idiomas" role="region" aria-label={t('avisoIdiomas.region', 'Idiomas disponibles')}>
      <div className="zy-aviso-idiomas-caja">
        {/* ⚠️ La flecha es decorativa y va con `aria-hidden`: a un lector de pantalla no le dice
            nada «curva hacia arriba», y el botón de al lado ya nombra la acción. */}
        <svg className="zy-aviso-idiomas-flecha" viewBox="0 0 48 40" aria-hidden="true" focusable="false">
          <path
            d="M4 36 C 4 18, 16 8, 40 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M32 4 L 41 6.8 L 34 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="zy-aviso-idiomas-texto">
          <strong>{t('avisoIdiomas.titulo', 'Visítanos en tu idioma.')}</strong>{' '}
          {t('avisoIdiomas.cuerpo', 'Este sitio se lee en 8 idiomas. ¿No está el tuyo? Avísanos y lo agregamos.')}
        </p>

        <div className="zy-aviso-idiomas-acciones">
          <button type="button" className="zy-aviso-idiomas-boton" onClick={abrirSelector}>
            <span className="zy-aviso-idiomas-bandera" aria-hidden="true">{actual.bandera}</span>
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
