import Icono from './Icono'

const SERVICIOS = [
  'Plataforma SaaS Zyntello', 'ERP y CRM', 'Automatización con IA',
  'Aplicaciones a la medida', 'Soporte técnico TI', 'Nube y ciberseguridad',
  'Personal TI especializado', 'Venta de equipos', 'Transformación digital',
  'Capacitación en TI e IA',
]

const EMPRESA = [
  ['#nosotros',   'Quiénes somos'],
  ['#porque',     'Por qué Zyntello'],
  ['#portafolio', 'Portafolio'],
  ['#soluciones', 'Plataforma y precios'],
  ['#contacto',   'Contacto'],
]

const LEGALES = [
  ['/terminos/',          'Términos y condiciones'],
  ['/privacidad/',        'Política de privacidad'],
  ['/sla/',               'Acuerdo de nivel de servicio'],
  ['/eliminacion-datos/', 'Eliminación de datos'],
  ['/avisos-terceros/',   'Avisos de terceros'],
]

export default function Footer() {
  return (
    <footer className="zy-pie">
      <div className="zy-halo zy-pie-halo" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">

        {/* Llamada final */}
        <div className="zy-pie-llamada zy-revelar">
          <h2 className="zy-pie-llamada-titulo">
            ¿Empezamos por <span className="zy-degradado">lo que más te duele</span>?
          </h2>
          <div className="zy-pie-llamada-botones">
            <a href="#contacto" className="zy-btn zy-btn-primario">
              Agendar una consulta
              <Icono nombre="flecha" size={18} className="zy-flecha" />
            </a>
            <a href="https://wa.me/18296399877" className="zy-btn zy-btn-fantasma">
              <Icono nombre="chat" size={18} />
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        <div className="row g-5 zy-pie-cuerpo">

          <div className="col-lg-4">
            <div className="zy-pie-marca">
              <img src="/logos/zyntello_isotipo_transparente.png" alt="" width="56" height="56" />
              <strong>Zyntello</strong>
            </div>
            <p className="zy-pie-lema">
              Datos que revelan. Tecnología que transforma. Resultados que perduran.
            </p>
            <p className="zy-pie-texto">
              Zyntello, S.R.L. — desarrollo, implementación y comercialización de soluciones
              tecnológicas empresariales basadas en Inteligencia Artificial, automatización de
              procesos y consultoría en tecnologías de la información.
            </p>

            <div className="zy-pie-contactos">
              <a href="mailto:info@zyntello.com"><Icono nombre="correo" size={15} /> info@zyntello.com</a>
              <a href="https://wa.me/18296399877"><Icono nombre="chat" size={15} /> +1 829 639 9877</a>
              <a href="mailto:soporte@zyntello.com"><Icono nombre="salvavidas" size={15} /> soporte@zyntello.com</a>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <h3 className="zy-pie-titulo">Servicios</h3>
            <ul className="zy-pie-lista">
              {SERVICIOS.map(s => <li key={s}><a href="#servicios">{s}</a></li>)}
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h3 className="zy-pie-titulo">Empresa</h3>
            <ul className="zy-pie-lista">
              {EMPRESA.map(([href, texto]) => <li key={href}><a href={href}>{texto}</a></li>)}
            </ul>
          </div>

          <div className="col-12 col-lg-3">
            <h3 className="zy-pie-titulo">Legal</h3>
            <ul className="zy-pie-lista">
              {LEGALES.map(([href, texto]) => <li key={href}><a href={href}>{texto}</a></li>)}
            </ul>
            <a href="https://app.zyntello.com" className="zy-btn zy-btn-fantasma zy-pie-acceso">
              Acceder a la plataforma
              <Icono nombre="flecha" size={16} className="zy-flecha" />
            </a>
          </div>

        </div>

        <div className="zy-pie-final">
          <span>© {new Date().getFullYear()} Zyntello, S.R.L. — República Dominicana. Todos los derechos reservados.</span>
          <span className="zy-pie-dominio">zyntello.com</span>
        </div>

      </div>
    </footer>
  )
}
