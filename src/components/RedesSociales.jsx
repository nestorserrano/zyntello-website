import { REDES_SOCIALES } from '../config/redesSociales'
import { useIdioma } from '../hooks/useIdioma'

export default function RedesSociales() {
  const { t } = useIdioma()

  return (
    // ⚠️ Son iconos sin texto: el `aria-label` es lo único que oye quien usa
    //    lector de pantalla, así que va traducido. El nombre de cada red
    //    (Facebook, LinkedIn…) NO: son marcas y se dicen igual en todas partes.
    <nav className="zy-redes-sociales" aria-label={t('a11y.redes', 'Redes sociales de Zyntello')}>
      {REDES_SOCIALES.map(({ nombre, href, icono }) => (
        <a key={nombre} href={href} target="_blank" rel="noopener noreferrer"
          aria-label={`Zyntello · ${nombre}`} title={nombre}>
          <i className={`fa-brands ${icono}`} aria-hidden="true" />
        </a>
      ))}
    </nav>
  )
}
