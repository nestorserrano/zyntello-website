import { useRef } from 'react'
import { useIdioma } from '../hooks/useIdioma'

/**
 * Una pantalla real de la plataforma, enmarcada como una ventana del navegador.
 *
 * ⚠️⚠️ Las imágenes salen del DEMO (app.zyntello.com/demo, «Constructora Demo SA»), nunca de la
 * cuenta de un suscriptor: lo que se publica aquí lo ve todo el mundo. Al rehacerlas, se quita la
 * franja «Modo demo» y se revisa que no quede un nombre, un correo o un RNC de alguien real.
 *
 * ⚠️ Cada imagen nueva lleva un NOMBRE nuevo (`…-2026.jpg`): el navegador y los buscadores la
 * cachean por la URL, y sustituirla con el mismo nombre deja la vieja a la vista durante días.
 *
 * Al pulsarla se AMPLÍA encima de la página, en un `<dialog>` nativo (decisión del director
 * técnico, 2026-11-24: antes abría otra pestaña y el visitante perdía el sitio). El navegador ya
 * cierra el diálogo con Esc y atrapa el foco dentro; aquí solo se añade cerrar al pulsar fuera de
 * la imagen —el clic en el fondo llega con el propio diálogo como `target`—.
 *
 * `width`/`height` son los de la captura (1440×900): reservan el hueco antes de que cargue la
 * imagen, así que la página no salta al llegar.
 */
export default function Captura({ src, alt, pie, className = '' }) {
  const { t } = useIdioma()
  const visor = useRef(null)
  const cerrar = () => visor.current?.close()

  return (
    <figure className={`zy-captura ${className}`}>
      <div className="zy-captura-ventana" dir="ltr">
        <div className="zy-captura-barra" aria-hidden="true"><span /><span /><span /></div>
        <button type="button" className="zy-captura-abrir" onClick={() => visor.current?.showModal()}>
          <img src={src} alt={alt} width="1440" height="900" loading="lazy" decoding="async" />
        </button>
      </div>
      {pie && <figcaption>{pie}</figcaption>}

      <dialog ref={visor} className="zy-visor" aria-label={alt} onClick={e => { if (e.target === visor.current) cerrar() }}>
        <img src={src} alt={alt} width="1440" height="900" />
        <button type="button" className="zy-visor-cerrar" onClick={cerrar} aria-label={t('a11y.cerrar', 'Cerrar')}>×</button>
      </dialog>
    </figure>
  )
}
