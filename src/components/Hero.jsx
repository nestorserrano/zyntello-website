import NeuralBackground from './NeuralBackground'
import '../styles/Hero.css'

/* Elementos flotantes animados — los "robots" de Zyntello */
const TECH_FLOATS = [
  { icon: '🤖', size: '70px', font: '2rem',   left: '66%', top: '8%',  delay: '0s',   dur: '5.5s', dir: 'a' },
  { icon: '🧠', size: '58px', font: '1.65rem', left: '78%', top: '52%', delay: '1.3s', dur: '4.8s', dir: 'b' },
  { icon: '⚡', size: '50px', font: '1.4rem',  left: '87%', top: '25%', delay: '0.6s', dur: '6.2s', dir: 'c' },
  { icon: '💡', size: '46px', font: '1.25rem', left: '72%', top: '76%', delay: '1.9s', dur: '5.0s', dir: 'a' },
  { icon: '⚙️', size: '62px', font: '1.8rem',  left: '92%', top: '60%', delay: '0.3s', dur: '4.6s', dir: 'b' },
  { icon: '📊', size: '44px', font: '1.2rem',  left: '60%', top: '40%', delay: '2.4s', dur: '5.8s', dir: 'c' },
  { icon: '🔮', size: '54px', font: '1.55rem', left: '83%', top: '88%', delay: '1.0s', dur: '5.3s', dir: 'a' },
]

export default function Hero() {
  return (
    <section id="inicio" className="min-vh-100 d-flex align-items-center"
      style={{
        background: 'linear-gradient(135deg, #0a0a14 0%, #0f172a 55%, #1e1b4b 100%)',
        paddingTop: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}>

      {/* Red neuronal animada de fondo */}
      <NeuralBackground />

      {/* Capa de oscurecimiento */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(10,10,20,0.6) 0%, rgba(15,23,42,0.4) 60%, rgba(30,27,75,0.5) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Letras difusas gigantes detrás del título */}
      <div className="hero-watermark" aria-hidden="true">ZYNTELLO</div>
      <div className="hero-watermark hero-watermark-2" aria-hidden="true">DIGITAL</div>

      {/* Elementos flotantes animados */}
      <div className="hero-floats" aria-hidden="true">
        {TECH_FLOATS.map((t, i) => (
          <div key={i} className={`hero-float hero-float-${t.dir}`}
            style={{ left: t.left, top: t.top, animationDelay: t.delay, animationDuration: t.dur }}>
            <div className="hero-float-icon" style={{ width: t.size, height: t.size, fontSize: t.font }}>
              {t.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Contenido */}
      <div className="container-fluid px-4 px-lg-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row align-items-center g-5">

          {/* Texto principal */}
          <div className="col-lg-7">
            <p className="text-uppercase fw-semibold mb-3" style={{ color: '#60a5fa', letterSpacing: '2px', fontSize: '0.85rem' }}>
              Tecnología Empresarial · IA · Automatización
            </p>
            <h1 className="fw-black mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.15, color: '#f1f5f9' }}>
              Datos que revelan.{' '}
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Tecnología que transforma.
              </span>{' '}
              Resultados que perduran.
            </h1>
            <p className="mb-5" style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '580px' }}>
              Acompañamos a empresas, PyMEs y entidades públicas en su transformación digital
              con presencia en <strong style={{ color: '#f1f5f9' }}>RD, Venezuela, Colombia, Guatemala y Costa Rica</strong> —
              con <strong style={{ color: '#f1f5f9' }}>IA aplicada</strong>, automatización y más de dos décadas de experiencia.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <a href="#servicios" className="btn btn-primary btn-lg px-5 fw-semibold rounded-3">
                Ver Servicios
              </a>
              <a href="#contacto" className="btn btn-outline-light btn-lg px-5 fw-semibold rounded-3">
                Agenda una consulta
              </a>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="col-lg-5">
            <div className="row g-3">
              {[
                { numero: '20+', label: 'Años de experiencia', color: '#3b82f6' },
                { numero: '100+', label: 'Proyectos exitosos', color: '#8b5cf6' },
                { numero: '5+', label: 'Países con presencia', color: '#10b981' },
                { numero: '24/7', label: 'Soporte disponible', color: '#f59e0b' },
              ].map((stat, i) => (
                <div key={i} className="col-6">
                  <div className="p-4 rounded-4 text-center h-100"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(8px)',
                    }}>
                    <div className="fw-black mb-1" style={{ fontSize: '2.2rem', color: stat.color }}>{stat.numero}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
