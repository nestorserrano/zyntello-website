import Icono from './Icono'
import '../styles/Servicios.css'

/* ─────────────────────────────────────────────────────────────────────────────
   El objeto social de Zyntello, S.R.L., traducido a lo que el cliente compra.
   El orden es deliberado: primero lo que la empresa vende como producto propio
   (plataforma, IA, ERP), después los servicios que la sostienen, y al final la
   consultoría de datos. Cambiar el orden cambia lo que el visitante cree que
   somos.
   ───────────────────────────────────────────────────────────────────────────── */
const SERVICIOS = [
  {
    icono: 'cuadricula', acento: '#6366f1', acento2: '#fb7185', grupo: 'Plataforma',
    titulo: 'Plataforma SaaS Zyntello',
    descripcion: 'Nuestro ERP modular en la nube. Contratas solo los módulos que usas y los tienes funcionando el mismo día, sin instalar nada.',
    destacado: true,
    marcas: ['34 módulos', 'Multi-empresa', 'Multi-moneda', 'Fiscal por país'],
    enlace: { texto: 'Ver los módulos y precios', href: '#soluciones' },
  },
  {
    icono: 'robot', acento: '#a78bfa', grupo: 'Inteligencia Artificial',
    titulo: 'Automatización con IA',
    descripcion: 'Agentes y modelos que ejecutan las tareas repetitivas, generan los reportes y conectan entre sí los sistemas que ya tienes.',
  },
  {
    icono: 'servidor', acento: '#6366f1', grupo: 'Sistemas de gestión',
    titulo: 'ERP y CRM',
    descripcion: 'Desarrollo, personalización e implementación de Softland, Profit, ODOO y plataformas abiertas, adaptadas al flujo real de tu empresa.',
  },
  {
    icono: 'codigo', acento: '#22d3ee', grupo: 'Desarrollo',
    titulo: 'Aplicaciones a la medida',
    descripcion: 'Construidas sobre las bases de datos que ya usas. No hay que empezar de cero para resolver un problema concreto.',
  },
  {
    icono: 'salvavidas', acento: '#fb7185', grupo: 'Operación',
    titulo: 'Soporte técnico TI',
    descripcion: 'Infraestructura, redes, servidores y sistemas, con niveles de servicio acordados según cómo opera tu empresa.',
  },
  {
    icono: 'escudo', acento: '#34d399', grupo: 'Operación',
    titulo: 'Nube y ciberseguridad',
    descripcion: 'Servicios en la nube, protección de la información y gestión de infraestructura: que esté disponible, y que solo entre quien debe.',
  },
  {
    icono: 'equipo', acento: '#fbbf24', grupo: 'Talento',
    titulo: 'Colocación de personal TI',
    descripcion: 'Desde técnicos de soporte hasta arquitectos de sistemas y especialistas en Inteligencia Artificial.',
  },
  {
    icono: 'caja', acento: '#94a3b8', grupo: 'Equipos',
    titulo: 'Importación y venta de equipos',
    descripcion: 'Hardware, software y soluciones tecnológicas, con la asesoría técnica incluida en la compra.',
  },
  {
    icono: 'brujula', acento: '#818cf8', grupo: 'Consultoría',
    titulo: 'Transformación digital',
    descripcion: 'Diagnóstico de lo que tienes, hoja de ruta tecnológica, arquitectura de sistemas y acompañamiento en la implementación.',
  },
  {
    icono: 'birrete', acento: '#c084fc', grupo: 'Consultoría',
    titulo: 'Capacitación y formación',
    descripcion: 'En el ERP implantado y en herramientas de IA, para que el equipo use de verdad lo que la empresa compró.',
  },
  {
    icono: 'libro', acento: '#2dd4bf', grupo: 'Consultoría',
    titulo: 'Consultoría contable',
    descripcion: 'Asesoría contable y financiera integrada con tus sistemas: procesos, reportes fiscales y análisis para decidir con números reales.',
  },
  {
    icono: 'megafono', acento: '#f472b6', grupo: 'Datos y mercado',
    titulo: 'Marketing digital',
    descripcion: 'Posicionamiento, campañas y analítica. Se mide el resultado, no las impresiones.',
  },
  {
    icono: 'urna', acento: '#f87171', grupo: 'Datos y mercado',
    titulo: 'Consultoría electoral',
    descripcion: 'Estrategia de campaña basada en datos: percepción ciudadana, inteligencia de mercado y monitoreo de tendencias.',
  },
  {
    icono: 'grafico', acento: '#38bdf8', grupo: 'Datos y mercado',
    titulo: 'Encuestas y estudios de mercado',
    descripcion: 'Investigación de opinión, censos, muestreos y procesamiento estadístico para el sector público y privado.',
  },
]

export default function Servicios() {
  return (
    <section id="servicios" className="zy-serv">
      <span className="zy-filo zy-filo-arriba" aria-hidden="true" />
      <div className="zy-malla" aria-hidden="true" />
      <div className="zy-halo zy-serv-halo" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">

        <header className="zy-serv-cabecera zy-revelar">
          <p className="zy-eyebrow">Qué hacemos</p>
          <h2 className="zy-titulo">
            Catorce formas de que la tecnología<br className="d-none d-lg-block" />
            <span className="zy-degradado">deje de ser tu problema</span>
          </h2>
          <p className="zy-subtitulo">
            No vendemos software enlatado. Cada implementación parte de entender cómo funciona
            tu empresa — y construimos o adaptamos la tecnología exacta que necesita.
          </p>
        </header>

        <div className="zy-serv-rejilla">
          {SERVICIOS.map((s, i) => (
            <article
              key={s.titulo}
              className={`zy-tarjeta zy-serv-tarjeta zy-revelar ${s.destacado ? 'zy-serv-destacada' : ''}`}
              style={{
                '--zy-color-acento': s.acento,
                '--zy-color-acento2': s.acento2 || s.acento,
                transitionDelay: `${Math.min(i, 9) * 50}ms`,
              }}
            >
              <span className="zy-serv-icono" style={{ color: s.acento }}>
                <Icono nombre={s.icono} size={s.destacado ? 30 : 24} />
              </span>

              <span className="zy-serv-grupo">{s.grupo}</span>
              <h3 className="zy-serv-titulo">{s.titulo}</h3>
              <p className="zy-serv-desc">{s.descripcion}</p>

              {s.marcas && (
                <div className="zy-serv-marcas">
                  {s.marcas.map(m => <span key={m} className="zy-serv-marca">{m}</span>)}
                </div>
              )}

              {s.enlace && (
                <a href={s.enlace.href} className="zy-enlace zy-serv-enlace">
                  {s.enlace.texto}
                  <Icono nombre="flecha" size={16} className="zy-flecha" />
                </a>
              )}
            </article>
          ))}
        </div>

        <p className="zy-serv-nota zy-revelar">
          ¿No aparece lo que buscas? Nuestro objeto social cubre cualquier actividad de
          tecnología y automatización empresarial. <a href="#contacto">Pregúntanos</a>.
        </p>
      </div>
    </section>
  )
}
