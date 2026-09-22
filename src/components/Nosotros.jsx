import Icono from './Icono'

const PAISES = ['República Dominicana', 'Venezuela', 'Colombia', 'Guatemala', 'Costa Rica']

const CIFRAS = [
  { num: '20+',  label: 'años de experiencia en TI y ERP',        icono: 'diana',      acento: '#6366f1' },
  { num: '5',    label: 'países con presencia directa',           icono: 'globo',      acento: '#34d399' },
  { num: 'IA',   label: 'aplicada a procesos empresariales',      icono: 'robot',      acento: '#a78bfa' },
  { num: '24/7', label: 'soporte posterior a la implementación',  icono: 'salvavidas', acento: '#fb7185' },
]

export default function Nosotros() {
  return (
    <section id="nosotros" className="zy-nos">
      <span className="zy-filo zy-filo-arriba" aria-hidden="true" />
      <div className="zy-malla" aria-hidden="true" />
      <div className="zy-halo zy-nos-halo" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">

        {/* El lema, a tamaño de manifiesto */}
        <div className="zy-nos-lema zy-revelar">
          <p><span className="zy-hueco">Datos</span> que revelan.</p>
          <p><span className="zy-hueco">Tecnología</span> que transforma.</p>
          <p><span className="zy-degradado">Resultados que perduran.</span></p>
        </div>

        <div className="row g-5 align-items-start zy-nos-cuerpo">

          <div className="col-lg-6 zy-revelar">
            <p className="zy-eyebrow">Quiénes somos</p>
            <p className="zy-nos-parrafo">
              <strong>Zyntello, S.R.L.</strong> desarrolla, implementa y comercializa soluciones
              tecnológicas empresariales basadas en <strong>Inteligencia Artificial</strong>,
              automatización de procesos y consultoría especializada en tecnologías de la
              información.
            </p>
            <p className="zy-nos-parrafo">
              Acompañamos a empresas, PyMEs y entidades del sector público en su transformación
              digital, con más de dos décadas de experiencia en infraestructura TI, sistemas ERP,
              desarrollo de software y automatización.
            </p>

            <div className="zy-nos-paises">
              <span className="zy-nos-paises-rotulo">
                <Icono nombre="ubicacion" size={15} />
                Presencia directa
              </span>
              <div className="zy-nos-paises-lista">
                {PAISES.map(p => <span key={p} className="zy-nos-pais">{p}</span>)}
                <span className="zy-nos-pais zy-nos-pais-remoto">+ soporte remoto regional</span>
              </div>
            </div>

            <a href="#contacto" className="zy-btn zy-btn-primario zy-nos-cta">
              Agenda una consulta
              <Icono nombre="flecha" size={18} className="zy-flecha" />
            </a>
          </div>

          <div className="col-lg-6 zy-revelar" style={{ transitionDelay: '120ms' }}>
            <div className="zy-nos-cifras">
              {CIFRAS.map(c => (
                <div
                  key={c.label}
                  className="zy-tarjeta zy-nos-cifra"
                  style={{ '--zy-color-acento': c.acento }}
                >
                  <span className="zy-nos-cifra-icono" style={{ color: c.acento }}>
                    <Icono nombre={c.icono} size={19} />
                  </span>
                  <span className="zy-nos-cifra-num">{c.num}</span>
                  <span className="zy-nos-cifra-lbl">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
