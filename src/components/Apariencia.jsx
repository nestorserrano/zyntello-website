import { useEffect, useState } from 'react'

export default function Apariencia() {
  const [tema, setTema] = useState(() => {
    try { return localStorage.getItem('zyntello-website-appearance') || 'dark' } catch { return 'dark' }
  })
  useEffect(() => {
    document.documentElement.dataset.appearance = tema
    try { localStorage.setItem('zyntello-website-appearance', tema) } catch { /* Se conserva en esta sesión. */ }
  }, [tema])
  return <button type="button" className="zy-appearance" onClick={() => setTema(tema === 'light' ? 'dark' : 'light')}
    aria-label={tema === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}>
    <i className={`fa-solid ${tema === 'light' ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true" />
  </button>
}
