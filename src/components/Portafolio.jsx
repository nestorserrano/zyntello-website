import Icono from './Icono'
import { useIdioma } from '../hooks/useIdioma'

/* ⚠️ `clave` es el identificador del proyecto: su prefijo de traducción
   (`port.{clave}.*`) y la `key` de React. Antes la `key` era el título, que
   ahora cambia con el idioma — y entonces React vería seis tarjetas nuevas en
   cada cambio y las remontaría todas, perdiendo la animación de entrada.

   ⚠️⚠️ `tecnologias` NO se traduce, y es deliberado: son nombres de producto
   —Softland ERP, SQL Server, React, AWS EC2— que quien los conoce los conoce
   así. Traducir las dos descriptivas de la lista («Migración de datos»,
   «Machine Learning») dejaría una mezcla de etiquetas traducidas y marcas sin
   traducir dentro de la misma fila, que se lee peor que dejarlas todas igual. */
const PROYECTOS = [
  {
    clave: 'erp-softland',
    categoria: 'ERP', acento: '#6366f1', icono: 'servidor',
    titulo: 'Softland ERP en una distribuidora',
    resultado: 'Inventario, ventas, cobros y contabilidad en un solo sistema',
    tecnologias: ['Softland ERP', 'SQL Server', 'Crystal Reports'],
  },
  {
    clave: 'migracion-profit',
    categoria: 'Migración', acento: '#a78bfa', icono: 'ciclo',
    titulo: 'De Profit 2K8 a Profit 2K12',
    resultado: 'Cero pérdida de histórico y cero parada de la operación',
    tecnologias: ['Profit 2K12', 'SQL Server', 'Migración de datos'],
  },
  {
    clave: 'portal-inventarios',
    categoria: 'Desarrollo', acento: '#22d3ee', icono: 'codigo',
    titulo: 'Portal de inventarios a la medida',
    resultado: 'Stock en tiempo real y alertas de reorden automáticas',
    tecnologias: ['React', 'Node.js', 'MySQL', 'REST API'],
  },
  {
    clave: 'tablero-bi',
    categoria: 'IA y analítica', acento: '#34d399', icono: 'grafico',
    titulo: 'Tablero de inteligencia de negocios',
    resultado: 'Modelos predictivos sobre la venta de una distribuidora',
    tecnologias: ['Power BI', 'Python', 'Machine Learning'],
  },
  {
    clave: 'red-empresarial',
    categoria: 'Infraestructura', acento: '#fbbf24', icono: 'escudo',
    titulo: 'Red empresarial y servidores',
    resultado: 'LAN/WiFi, servidor de archivos y respaldo verificado',
    tecnologias: ['Windows Server', 'Cisco', 'Veeam Backup'],
  },
  {
    clave: 'nube-aws',
    categoria: 'Nube', acento: '#fb7185', icono: 'nube',
    titulo: 'Del servidor propio a AWS',
    resultado: '40 % menos de costo operativo y alta disponibilidad',
    tecnologias: ['AWS EC2', 'RDS', 'S3', 'CloudFormation'],
  },
]

export default function Portafolio() {
  const { idioma, t } = useIdioma()

  return (
    <section id="portafolio" className="zy-port zy-seccion-alta">
      <span className="zy-filo zy-filo-arriba" aria-hidden="true" />
      <div className="zy-halo zy-port-halo" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">

        <header className="zy-port-cabecera zy-revelar">
          <p className="zy-eyebrow">{t('port.eyebrow', 'Nuestro trabajo')}</p>
          <h2 className="zy-titulo">
            {/* ⚠️ Mismo criterio que el resto del sitio: el resaltado del
                español se conserva, los demás idiomas reciben la frase entera. */}
            {idioma === 'es' ? (
              <>Entregado y <span className="zy-degradado">en producción</span></>
            ) : (
              t('port.titulo', 'Entregado y en producción')
            )}
          </h2>
          <p className="zy-subtitulo">
            {t('port.subtitulo', 'Proyectos funcionando en empresas reales, no maquetas. Estos son los que podemos contar.')}
          </p>
        </header>

        <div className="zy-port-rejilla">
          {PROYECTOS.map((p, i) => (
            <article
              key={p.clave}
              className="zy-tarjeta zy-port-tarjeta zy-revelar"
              style={{ '--zy-color-acento': p.acento, transitionDelay: `${i * 60}ms` }}
            >
              <div className="zy-port-cima">
                <span className="zy-port-icono" style={{ color: p.acento }}>
                  <Icono nombre={p.icono} size={20} />
                </span>
                <span className="zy-port-categoria" style={{ color: p.acento }}>
                  {t(`port.${p.clave}.categoria`, p.categoria)}
                </span>
              </div>

              <h3 className="zy-port-titulo">{t(`port.${p.clave}.titulo`, p.titulo)}</h3>
              <p className="zy-port-resultado">
                <Icono nombre="check" size={15} style={{ color: p.acento }} />
                {t(`port.${p.clave}.resultado`, p.resultado)}
              </p>

              <div className="zy-port-tecnologias">
                {p.tecnologias.map(tec => (
                  <span key={tec} className="zy-port-tec">{tec}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
