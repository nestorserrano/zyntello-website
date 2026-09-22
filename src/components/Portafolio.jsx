import Icono from './Icono'

const PROYECTOS = [
  {
    categoria: 'ERP', acento: '#6366f1', icono: 'servidor',
    titulo: 'Softland ERP en una distribuidora',
    resultado: 'Inventario, ventas, cobros y contabilidad en un solo sistema',
    tecnologias: ['Softland ERP', 'SQL Server', 'Crystal Reports'],
  },
  {
    categoria: 'Migración', acento: '#a78bfa', icono: 'ciclo',
    titulo: 'De Profit 2K8 a Profit 2K12',
    resultado: 'Cero pérdida de histórico y cero parada de la operación',
    tecnologias: ['Profit 2K12', 'SQL Server', 'Migración de datos'],
  },
  {
    categoria: 'Desarrollo', acento: '#22d3ee', icono: 'codigo',
    titulo: 'Portal de inventarios a la medida',
    resultado: 'Stock en tiempo real y alertas de reorden automáticas',
    tecnologias: ['React', 'Node.js', 'MySQL', 'REST API'],
  },
  {
    categoria: 'IA y analítica', acento: '#34d399', icono: 'grafico',
    titulo: 'Tablero de inteligencia de negocios',
    resultado: 'Modelos predictivos sobre la venta de una distribuidora',
    tecnologias: ['Power BI', 'Python', 'Machine Learning'],
  },
  {
    categoria: 'Infraestructura', acento: '#fbbf24', icono: 'escudo',
    titulo: 'Red empresarial y servidores',
    resultado: 'LAN/WiFi, servidor de archivos y respaldo verificado',
    tecnologias: ['Windows Server', 'Cisco', 'Veeam Backup'],
  },
  {
    categoria: 'Nube', acento: '#fb7185', icono: 'nube',
    titulo: 'Del servidor propio a AWS',
    resultado: '40 % menos de costo operativo y alta disponibilidad',
    tecnologias: ['AWS EC2', 'RDS', 'S3', 'CloudFormation'],
  },
]

export default function Portafolio() {
  return (
    <section id="portafolio" className="zy-port zy-seccion-alta">
      <span className="zy-filo zy-filo-arriba" aria-hidden="true" />
      <div className="zy-halo zy-port-halo" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">

        <header className="zy-port-cabecera zy-revelar">
          <p className="zy-eyebrow">Nuestro trabajo</p>
          <h2 className="zy-titulo">
            Entregado y <span className="zy-degradado">en producción</span>
          </h2>
          <p className="zy-subtitulo">
            Proyectos funcionando en empresas reales, no maquetas. Estos son los que
            podemos contar.
          </p>
        </header>

        <div className="zy-port-rejilla">
          {PROYECTOS.map((p, i) => (
            <article
              key={p.titulo}
              className="zy-tarjeta zy-port-tarjeta zy-revelar"
              style={{ '--zy-color-acento': p.acento, transitionDelay: `${i * 60}ms` }}
            >
              <div className="zy-port-cima">
                <span className="zy-port-icono" style={{ color: p.acento }}>
                  <Icono nombre={p.icono} size={20} />
                </span>
                <span className="zy-port-categoria" style={{ color: p.acento }}>
                  {p.categoria}
                </span>
              </div>

              <h3 className="zy-port-titulo">{p.titulo}</h3>
              <p className="zy-port-resultado">
                <Icono nombre="check" size={15} style={{ color: p.acento }} />
                {p.resultado}
              </p>

              <div className="zy-port-tecnologias">
                {p.tecnologias.map(t => (
                  <span key={t} className="zy-port-tec">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
