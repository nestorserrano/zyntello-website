import { REDES_SOCIALES } from '../config/redesSociales'

export default function RedesSociales() {
  return (
    <nav className="zy-redes-sociales" aria-label="Redes sociales de Zyntello">
      {REDES_SOCIALES.map(({ nombre, href, icono }) => (
        <a key={nombre} href={href} target="_blank" rel="noopener noreferrer"
          aria-label={`Seguir a Zyntello en ${nombre}`} title={nombre}>
          <i className={`fa-brands ${icono}`} aria-hidden="true" />
        </a>
      ))}
    </nav>
  )
}
