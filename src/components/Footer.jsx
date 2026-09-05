export default function Footer() {
  return (
    <footer className="w-100" style={{ background: '#060610', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '4rem 0 2rem' }}>
      <div className="container-fluid px-4 px-lg-5">
        <div className="row g-4 mb-4">

          {/* Marca y lema */}
          <div className="col-lg-4">
            <div className="fw-bold text-white mb-1" style={{ fontSize: '1.4rem' }}>Zyntello</div>
            <p className="mb-3" style={{ color: '#60a5fa', fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.6 }}>
              Datos que revelan. Tecnología que transforma. Resultados que perduran.
            </p>
            <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.7, maxWidth: '300px' }}>
              Empresa de tecnología empresarial especializada en IA y automatización. Presencia en RD, Venezuela, Colombia, Guatemala y Costa Rica. Soporte remoto a toda la región.
            </p>
          </div>

          {/* Servicios */}
          <div className="col-sm-4 col-lg-2 offset-lg-2">
            <div className="fw-semibold text-white mb-3" style={{ fontSize: '0.9rem' }}>Servicios</div>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {['Automatización con IA', 'ERP y CRM', 'Soporte Técnico TI', 'Consultoría Contable', 'Marketing Digital', 'Consultoría Electoral', 'Encuestas & Mercado', 'Transformación Digital'].map((s, i) => (
                <li key={i}>
                  <a href="#servicios" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.88rem' }}
                    onMouseEnter={e => e.target.style.color = '#60a5fa'}
                    onMouseLeave={e => e.target.style.color = '#475569'}>
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div className="col-sm-4 col-lg-2">
            <div className="fw-semibold text-white mb-3" style={{ fontSize: '0.9rem' }}>Empresa</div>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[['#nosotros','Quiénes Somos'], ['#porque','Por qué Zyntello'], ['#portafolio','Portafolio'], ['#contacto','Contacto']].map(([href, label], i) => (
                <li key={i}>
                  <a href={href} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.88rem' }}
                    onMouseEnter={e => e.target.style.color = '#60a5fa'}
                    onMouseLeave={e => e.target.style.color = '#475569'}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-sm-4 col-lg-2">
            <div className="fw-semibold text-white mb-3" style={{ fontSize: '0.9rem' }}>Contacto</div>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <a href="https://zyntello.com" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.88rem' }}
                  onMouseEnter={e => e.target.style.color = '#60a5fa'}
                  onMouseLeave={e => e.target.style.color = '#475569'}>
                  zyntello.com
                </a>
              </li>
              <li>
                <a href="mailto:info@zyntello.com" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.88rem' }}
                  onMouseEnter={e => e.target.style.color = '#60a5fa'}
                  onMouseLeave={e => e.target.style.color = '#475569'}>
                  info@zyntello.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/18296399877" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.88rem' }}
                  onMouseEnter={e => e.target.style.color = '#60a5fa'}
                  onMouseLeave={e => e.target.style.color = '#475569'}>
                  +1 829 639 9877
                </a>
              </li>
              <li style={{ color: '#475569', fontSize: '0.88rem' }}>República Dominicana</li>
            </ul>
          </div>

        </div>

        {/* Línea inferior */}
        <div className="pt-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="d-flex justify-content-center flex-wrap gap-3 mb-2">
            {[['/terminos/', 'Términos del Servicio'], ['/privacidad/', 'Política de Privacidad'], ['/sla/', 'Acuerdo de Nivel de Servicio'], ['/eliminacion-datos/', 'Eliminación de datos']].map(([href, label], i) => (
              <a key={i} href={href} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.83rem' }}
                onMouseEnter={e => e.target.style.color = '#60a5fa'}
                onMouseLeave={e => e.target.style.color = '#475569'}>
                {label}
              </a>
            ))}
          </div>
          <p style={{ color: '#334155', fontSize: '0.83rem', margin: 0 }}>
            © 2026 Zyntello S.R.L. Todos los derechos reservados. · RD · Venezuela · Colombia · Guatemala · Costa Rica · Soporte remoto global
          </p>
        </div>

      </div>
    </footer>
  )
}
