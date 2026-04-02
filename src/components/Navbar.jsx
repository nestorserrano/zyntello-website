import { useState } from 'react'

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ background: 'rgba(10,10,20,0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="container-fluid px-4">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#inicio">
          <img
            src="/logos/zyntello_isotipo_transparente.png"
            alt="Zyntello"
            style={{ height: '52px', width: 'auto' }}
          />
          <div className="d-flex flex-column">
            <span className="fw-bold text-white" style={{ fontSize: '1.3rem', lineHeight: 1.1 }}>Zyntello</span>
            <span style={{ fontSize: '0.65rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              <span style={{ color: '#60a5fa' }}>Inteligencia Artificial</span>
              <span style={{ color: '#475569' }}> · ERP · Tecnología Empresarial</span>
            </span>
          </div>
        </a>

        <button className="navbar-toggler border-0" onClick={() => setAbierto(!abierto)} style={{ color: '#fff' }}>
          <span style={{ fontSize: '1.4rem' }}>☰</span>
        </button>

        <div className={`collapse navbar-collapse ${abierto ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto gap-lg-3 align-items-lg-center">
            {['inicio','servicios','porque','portafolio','nosotros'].map(seccion => (
              <li key={seccion} className="nav-item">
                <a className="nav-link text-capitalize" href={`#${seccion}`} style={{ color: '#cbd5e1' }}
                  onClick={() => setAbierto(false)}>
                  {{ inicio: 'Inicio', servicios: 'Servicios', porque: 'Por qué Zyntello', portafolio: 'Portafolio', nosotros: 'Nosotros' }[seccion]}
                </a>
              </li>
            ))}
            <li className="nav-item">
              <a href="#contacto" onClick={() => setAbierto(false)}
                className="btn btn-primary px-4 rounded-3 fw-semibold">
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
