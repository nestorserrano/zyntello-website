import { useEffect, useState } from 'react'
import Icono from './Icono'
import '../styles/Navbar.css'

const SECCIONES = [
  ['inicio',     'Inicio'],
  ['servicios',  'Servicios'],
  ['soluciones', 'Plataforma'],
  ['porque',     'Por qué'],
  ['portafolio', 'Portafolio'],
  ['nosotros',   'Nosotros'],
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const [compacto, setCompacto] = useState(false)
  const [activa, setActiva] = useState('inicio')

  /* Navbar sólido en cuanto se despega del hero: sobre el vídeo claro, un
     navbar transparente deja los enlaces sin contraste garantizado. */
  useEffect(() => {
    const alScroll = () => setCompacto(window.scrollY > 24)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  /* Marca en el menú la sección que se está viendo */
  useEffect(() => {
    const observador = new IntersectionObserver(
      entradas => {
        const visible = entradas
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiva(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, .25, .5] }
    )
    SECCIONES.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) observador.observe(el)
    })
    return () => observador.disconnect()
  }, [])

  return (
    <nav className={`zy-nav ${compacto ? 'zy-nav-compacto' : ''}`}>
      <div className="zy-nav-caja container-fluid px-4 px-lg-5">

        <a className="zy-nav-marca" href="#inicio" onClick={() => setAbierto(false)}>
          <img src="/logos/zyntello_isotipo_transparente.png" alt="" width="58" height="58" />
          <span className="zy-nav-marca-texto">
            <strong>Zyntello</strong>
            <small>Inteligencia Artificial · ERP · Tecnología Empresarial</small>
          </span>
        </a>

        <button
          type="button"
          className="zy-nav-hamburguesa"
          aria-expanded={abierto}
          aria-controls="zy-menu"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setAbierto(a => !a)}
        >
          <Icono nombre={abierto ? 'cerrar' : 'menu'} size={24} />
        </button>

        <div id="zy-menu" className={`zy-nav-menu ${abierto ? 'zy-nav-menu-abierto' : ''}`}>
          <ul className="zy-nav-lista">
            {SECCIONES.map(([id, etiqueta]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`zy-nav-enlace ${activa === id ? 'zy-nav-enlace-activo' : ''}`}
                  aria-current={activa === id ? 'true' : undefined}
                  onClick={() => setAbierto(false)}
                >
                  {etiqueta}
                </a>
              </li>
            ))}
          </ul>

          <div className="zy-nav-acciones">
            <a
              href="https://app.zyntello.com"
              className="zy-nav-acceso"
              onClick={() => setAbierto(false)}
            >
              Acceder
            </a>
            <a
              href="#contacto"
              className="zy-btn zy-btn-primario zy-nav-cta"
              onClick={() => setAbierto(false)}
            >
              Contacto
              <Icono nombre="flecha" size={17} className="zy-flecha" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
