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
        <span className="zy-idioma-bandera" aria-hidden="true">{actual.bandera}</span>
        <span className="zy-idioma-codigo">{actual.codigo.split('-')[0].toUpperCase()}</span>
      </button>

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
                <span className="zy-idioma-bandera" aria-hidden="true">{i.bandera}</span>
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
