import FondoAnimado from './FondoAnimado'
import Icono from './Icono'
import '../styles/Hero.css'

const CIFRAS = [
  { numero: '20+',  label: 'años en TI y ERP' },
  { numero: '100+', label: 'proyectos entregados' },
  { numero: '34',   label: 'módulos en producción' },
  { numero: '5',    label: 'países con presencia' },
]

/* El objeto social, en lenguaje de cliente */
const CAPACIDADES = [
  'ERP y CRM', 'Agentes de IA', 'Automatización de procesos', 'Desarrollo a medida',
  'Soporte técnico TI', 'Cloud computing', 'Ciberseguridad', 'Infraestructura TI',
  'Personal TI especializado', 'Hardware y licencias', 'Transformación digital',
  'Arquitectura de sistemas', 'Capacitación en IA', 'Consultoría contable',
  'Estudios de mercado',
]

export default function Hero() {
  return (
    <section id="inicio" className="zy-hero">

      {/* Fondo: malla de datos — sistemas que se hablan entre sí */}
      <FondoAnimado escena="malla" tinte="indigo" />
      <div className="zy-malla" aria-hidden="true" />
      <div className="zy-halo zy-hero-halo-1" aria-hidden="true" />
      <div className="zy-halo zy-hero-halo-2" aria-hidden="true" />
      <div className="zy-grano" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 zy-hero-contenido">

        <p className="zy-hero-insignia zy-entrar" style={{ animationDelay: '40ms' }}>
          <span className="zy-hero-latido" aria-hidden="true" />
          Plataforma propia en producción · RD · VE · CO · GT · CR
        </p>

        <h1 className="zy-hero-titulo zy-entrar" style={{ animationDelay: '120ms' }}>
          Lo difícil nunca fue<br />
          <span className="zy-hueco">el software.</span>{' '}
          <span className="zy-degradado">Es ponerlo a funcionar.</span>
        </h1>

        <p className="zy-hero-bajada zy-entrar" style={{ animationDelay: '200ms' }}>
          Implantamos tu ERP y tu CRM, automatizamos los procesos con agentes de
          Inteligencia Artificial y seguimos ahí cuando el proyecto termina.
          Veinte años haciendo exactamente eso.
        </p>

        <div className="zy-hero-botones zy-entrar" style={{ animationDelay: '280ms' }}>
          <a href="#soluciones" className="zy-btn zy-btn-primario">
            Ver la plataforma
            <Icono nombre="flecha" size={18} className="zy-flecha" />
          </a>
          <a href="#contacto" className="zy-btn zy-btn-fantasma">
            <Icono nombre="chat" size={18} />
            Agendar una consulta
          </a>
        </div>

        <p className="zy-hero-nota zy-entrar" style={{ animationDelay: '340ms' }}>
          <Icono nombre="check" size={15} />
          Sin instalaciones · Sin permanencia · Pruebas los módulos antes de contratar
        </p>

        <div className="zy-hero-cifras zy-entrar" style={{ animationDelay: '420ms' }}>
          {CIFRAS.map(c => (
            <div key={c.label} className="zy-hero-cifra">
              <span className="zy-hero-cifra-num">{c.numero}</span>
              <span className="zy-hero-cifra-lbl">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="zy-hero-desfile">
        <div className="zy-marquesina">
          {[0, 1].map(copia => (
            <div className="zy-marquesina-pista" key={copia} aria-hidden={copia === 1 ? 'true' : undefined}>
              {CAPACIDADES.map(c => (
                <span className="zy-hero-capacidad" key={c}>{c}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <a href="#servicios" className="zy-hero-bajar" aria-label="Ir a la sección de servicios">
        <Icono nombre="abajo" size={19} />
      </a>
    </section>
  )
}
