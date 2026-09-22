import FondoAnimado from './FondoAnimado'
import Icono from './Icono'

const RAZONES = [
  {
    icono: 'diana', acento: '#6366f1',
    titulo: 'Veinte años, no veinte diapositivas',
    descripcion: 'Dos décadas de infraestructura TI y sistemas ERP en República Dominicana y Latinoamérica. Lo hemos roto y lo hemos arreglado antes.',
  },
  {
    icono: 'robot', acento: '#a78bfa',
    titulo: 'IA aplicada, no IA contada',
    descripcion: 'Implementamos Inteligencia Artificial dentro de tus procesos reales. Si no ahorra horas de alguien, no lo llamamos IA.',
  },
  {
    icono: 'globo', acento: '#34d399',
    titulo: 'Estamos donde tú operas',
    descripcion: 'Presencia directa en RD, Venezuela, Colombia, Guatemala y Costa Rica, con soporte remoto al resto de la región.',
  },
  {
    icono: 'ciclo', acento: '#fb7185',
    titulo: 'No desaparecemos al entregar',
    descripcion: 'El acompañamiento posterior está escrito en el acuerdo de servicio, no prometido en una reunión.',
  },
  {
    icono: 'enlace', acento: '#22d3ee',
    titulo: 'Compatible con lo que ya tienes',
    descripcion: 'Nos integramos con tus bases de datos y tus sistemas actuales. Nadie empieza de cero por gusto.',
  },
  {
    icono: 'llave', acento: '#fbbf24',
    titulo: 'Nada genérico',
    descripcion: 'Cada implementación arranca entendiendo cómo funciona tu empresa. Después, y solo después, se elige la herramienta.',
  },
]

export default function PorQueZyntello() {
  return (
    <section id="porque" className="zy-porque">
      {/* Fondo: cintas de proceso — tareas que avanzan solas */}
      <FondoAnimado escena="flujo" tinte="coral" />
      <span className="zy-filo zy-filo-arriba" aria-hidden="true" />
      <div className="zy-grano" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">

        <header className="zy-porque-cabecera zy-revelar">
          <p className="zy-eyebrow zy-eyebrow-coral">Por qué Zyntello</p>
          <h2 className="zy-titulo">
            Trabajamos <span className="zy-coral">distinto</span>.
          </h2>
          <p className="zy-subtitulo">
            La diferencia no está en la lista de tecnologías — esa la tiene cualquiera.
            Está en que alguien siga contestando el teléfono seis meses después de la
            puesta en marcha.
          </p>
          <a href="#contacto" className="zy-btn zy-btn-coral zy-porque-cta">
            Conversemos
            <Icono nombre="flecha" size={18} className="zy-flecha" />
          </a>
        </header>

        <ol className="zy-porque-lista">
          {RAZONES.map((r, i) => (
            <li
              key={r.titulo}
              className="zy-porque-item zy-revelar"
              style={{ '--zy-color-acento': r.acento, transitionDelay: `${i * 70}ms` }}
            >
              <span className="zy-porque-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="zy-porque-icono" style={{ color: r.acento }}>
                <Icono nombre={r.icono} size={20} />
              </span>
              <div className="zy-porque-texto">
                <h3 className="zy-porque-titulo">{r.titulo}</h3>
                <p className="zy-porque-desc">{r.descripcion}</p>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  )
}
