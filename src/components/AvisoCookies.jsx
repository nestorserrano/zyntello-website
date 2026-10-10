import { useEffect, useState } from 'react'
import { useIdioma } from '../hooks/useIdioma'

/**
 * Aviso de cookies — INFORMATIVO, no de consentimiento. Y la diferencia es deliberada.
 *
 * Zyntello no usa cookies de publicidad, de perfilado ni de analítica de terceros: solo las
 * estrictamente necesarias para iniciar sesión y las preferencias que el propio visitante pide
 * (el tema claro u oscuro). Medido el 2026-10-10 en los tres repositorios — no hay Google
 * Analytics, ni píxel de Meta, ni Hotjar, ni nada equivalente.
 *
 * ⚠️⚠️ Por eso NO se pide consentimiento, y no es un atajo: la Política de Privacidad publicada
 * lo dice por escrito en su sección 14 —«no se requiere un banner de consentimiento de cookies»—
 * y poner aquí un «aceptar / rechazar» contradiría un documento legal vigente. Peor aún: daría a
 * entender que hay algo que rastrear, y acostumbrar a la gente a pulsar «aceptar» sin leer es
 * justo lo que vacía de sentido al consentimiento.
 *
 * Lo que sí se hace es informar y enlazar la política completa, que es lo que el visitante
 * necesita para entender qué se guarda y para qué.
 *
 * ⚠️ El día que Zyntello incorpore analítica o cualquier herramienta que requiera permiso, este
 * componente tiene que pasar a ser de consentimiento real —con rechazo efectivo y bloqueo previo
 * de la herramienta— y la política actualizarse ANTES de activarla.
 */
const CLAVE = 'zyntello-aviso-cookies'

export default function AvisoCookies() {
  const { t } = useIdioma()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // ⚠️ En try/catch: en modo privado algunos navegadores lanzan al tocar localStorage, y una
    //    excepción aquí dejaría la página entera sin montar por un aviso.
    try {
      if (!localStorage.getItem(CLAVE)) setVisible(true)
    } catch {
      // Sin almacenamiento no se puede recordar la decisión, así que no se muestra:
      // un aviso que reaparece en cada visita molesta más de lo que informa.
    }
  }, [])

  const cerrar = () => {
    setVisible(false)
    try { localStorage.setItem(CLAVE, '1') } catch { /* Se cierra solo por esta visita. */ }
  }

  if (!visible) return null

  return (
    <div className="zy-cookies" role="region" aria-label="Aviso sobre cookies">
      {/* ⚠️ Es un texto LEGAL: va traducido entero y de una pieza, no troceado en negritas.
          Partirlo para resaltar obligaría a que el énfasis cayera en las mismas palabras en los
          ocho idiomas, y no caen — en chino y en árabe el orden es otro. */}
      <div className="zy-cookies-texto">
        {t('cookies.texto', 'Usamos solo lo imprescindible. Cookies para mantener su sesión iniciada y recordar si prefiere el tema claro u oscuro. Sin publicidad, sin perfilado y sin rastreadores de terceros.')}
      </div>
      <div className="zy-cookies-acciones">
        <a href="/cookies/" className="zy-cookies-enlace">{t('cookies.ver', 'Ver qué guardamos')}</a>
        <button type="button" onClick={cerrar} className="zy-cookies-boton">{t('cookies.entendido', 'Entendido')}</button>
      </div>
    </div>
  )
}
