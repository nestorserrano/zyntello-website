import { useEffect, useState } from 'react'
import { useIdioma } from '../hooks/useIdioma'

export default function Apariencia() {
  const { t } = useIdioma()
  const [tema, setTema] = useState(() => {
    try { return localStorage.getItem('zyntello-website-appearance') || 'dark' } catch { return 'dark' }
  })
  useEffect(() => {
    document.documentElement.dataset.appearance = tema
    try { localStorage.setItem('zyntello-website-appearance', tema) } catch { /* Se conserva en esta sesión. */ }
  }, [tema])
  // ⚠️ El botón es solo un icono, así que su `aria-label` es lo ÚNICO que oye
  //    quien usa lector de pantalla: va traducido como cualquier texto visible.
  return <button type="button" className="zy-appearance" onClick={() => setTema(tema === 'light' ? 'dark' : 'light')}
    aria-label={tema === 'light' ? t('a11y.tema.oscuro', 'Activar modo oscuro') : t('a11y.tema.claro', 'Activar modo claro')}>
    <i className={`fa-solid ${tema === 'light' ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true" />
  </button>
}
