import { useEffect, useState } from 'react'
import { useIdioma } from '../hooks/useIdioma'

/**
 * Botón sol/luna. El tema por defecto lo decide el DISPOSITIVO (lo aplica el script
 * del `<head>` de `index.html` antes de pintar); este botón solo lo fija a mano.
 *
 * ⚠⚠ Solo se guarda cuando el visitante PULSA. La versión anterior guardaba el tema
 *    en cada visita —también el de por defecto—, y eso congelaba a todo el mundo en
 *    el valor de su primera visita: ya nunca seguía a su teléfono.
 */
const CLAVE = 'zyntello-tema'

const temaActual = () => document.documentElement.dataset.appearance === 'dark' ? 'dark' : 'light'

export default function Apariencia() {
  const { t } = useIdioma()
  const [tema, setTema] = useState(temaActual)

  // Si el visitante no eligió nada y cambia el modo del dispositivo, el script del
  // `<head>` cambia el atributo; aquí solo se mantiene el icono al día.
  useEffect(() => {
    const observador = new MutationObserver(() => setTema(temaActual()))
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['data-appearance'] })
    return () => observador.disconnect()
  }, [])

  const alternar = () => {
    const nuevo = tema === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.appearance = nuevo
    try { localStorage.setItem(CLAVE, nuevo) } catch { /* Se conserva en esta visita. */ }
  }

  // ⚠️ El botón es solo un icono, así que su `aria-label` es lo ÚNICO que oye
  //    quien usa lector de pantalla: va traducido como cualquier texto visible.
  return <button type="button" className="zy-appearance" onClick={alternar}
    aria-label={tema === 'light' ? t('a11y.tema.oscuro', 'Activar modo oscuro') : t('a11y.tema.claro', 'Activar modo claro')}>
    <i className={`fa-solid ${tema === 'light' ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true" />
  </button>
}
