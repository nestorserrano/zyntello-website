import Icono from './Icono'
import { useIdioma } from '../hooks/useIdioma'

/* ⚠️ Los países llevan clave: «República Dominicana» en chino es 多米尼加共和国,
   y dejarlos en español en una lista que ya está traducida se lee como un
   descuido, no como un nombre propio. */
const PAISES = [
  ['nos.pais.rd', 'República Dominicana'],
  ['nos.pais.ve', 'Venezuela'],
  ['nos.pais.co', 'Colombia'],
  ['nos.pais.gt', 'Guatemala'],
  ['nos.pais.cr', 'Costa Rica'],
]

/* ⚠️ `num` es la cifra grande y `label` su explicación. Solo «IA» lleva clave
   de las cuatro cifras: las otras tres son números y signos («20+», «5»,
   «24/7») que se escriben igual en los ocho idiomas, y «IA» no — en inglés y
   en chino es «AI». */
const CIFRAS = [
  { num: '20+',  numClave: null,            clave: 'nos.cifra.anos',    label: 'años de experiencia en TI y ERP',       icono: 'diana',      acento: '#6366f1' },
  { num: '5',    numClave: null,            clave: 'nos.cifra.paises',  label: 'países con presencia directa',          icono: 'globo',      acento: '#34d399' },
  { num: 'IA',   numClave: 'nos.cifra.ia',  clave: 'nos.cifra.iatexto', label: 'aplicada a procesos empresariales',     icono: 'robot',      acento: '#a78bfa' },
  { num: '24/7', numClave: null,            clave: 'nos.cifra.soporte', label: 'soporte posterior a la implementación', icono: 'salvavidas', acento: '#fb7185' },
]

export default function Nosotros() {
  const { idioma, t } = useIdioma()

  return (
    <section id="nosotros" className="zy-nos">
      <span className="zy-filo zy-filo-arriba" aria-hidden="true" />
      <div className="zy-malla" aria-hidden="true" />
      <div className="zy-halo zy-nos-halo" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">

        {/* El lema, a tamaño de manifiesto.
            ⚠️ Son tres líneas y cada una lleva su resaltado en una palabra
            distinta. En español se conserva exacto; en los demás idiomas va la
            línea entera, porque «Datos» y «Tecnología» no caen al principio en
            chino ni en árabe y el resaltado quedaría sobre otra palabra. */}
        <div className="zy-nos-lema zy-revelar">
          {idioma === 'es' ? (
            <>
              <p><span className="zy-hueco">Datos</span> que revelan.</p>
              <p><span className="zy-hueco">Tecnología</span> que transforma.</p>
              <p><span className="zy-degradado">Resultados que perduran.</span></p>
            </>
          ) : (
            <>
              <p>{t('nos.lema.1', 'Datos que revelan.')}</p>
              <p>{t('nos.lema.2', 'Tecnología que transforma.')}</p>
              <p><span className="zy-degradado">{t('nos.lema.3', 'Resultados que perduran.')}</span></p>
            </>
          )}
        </div>

        <div className="row g-5 align-items-start zy-nos-cuerpo">

          <div className="col-lg-6 zy-revelar">
            <p className="zy-eyebrow">{t('pie.emp.nosotros', 'Quiénes somos')}</p>
            {/* ⚠️ Las negritas del párrafo solo en español, por lo mismo: marcan
                «Zyntello, S.R.L.» e «Inteligencia Artificial», y en árabe el
                orden de la frase es otro. */}
            <p className="zy-nos-parrafo">
              {idioma === 'es' ? (
                <>
                  <strong>Zyntello, S.R.L.</strong> desarrolla, implementa y comercializa soluciones
                  tecnológicas empresariales basadas en <strong>Inteligencia Artificial</strong>,
                  automatización de procesos y consultoría especializada en tecnologías de la
                  información.
                </>
              ) : (
                t('nos.p1', 'Zyntello, S.R.L. desarrolla, implementa y comercializa soluciones tecnológicas empresariales basadas en Inteligencia Artificial, automatización de procesos y consultoría especializada en tecnologías de la información.')
              )}
            </p>
            <p className="zy-nos-parrafo">
              {t('nos.p2', 'Acompañamos a empresas, PyMEs y entidades del sector público en su transformación digital, con más de dos décadas de experiencia en infraestructura TI, sistemas ERP, desarrollo de software y automatización.')}
            </p>

            <div className="zy-nos-paises">
              <span className="zy-nos-paises-rotulo">
                <Icono nombre="ubicacion" size={15} />
                {t('nos.paises.rotulo', 'Presencia directa')}
              </span>
              <div className="zy-nos-paises-lista">
                {PAISES.map(([clave, nombre]) => (
                  <span key={clave} className="zy-nos-pais">{t(clave, nombre)}</span>
                ))}
                <span className="zy-nos-pais zy-nos-pais-remoto">
                  {t('nos.paises.remoto', '+ soporte remoto regional')}
                </span>
              </div>
            </div>

            <a href="#contacto" className="zy-btn zy-btn-primario zy-nos-cta">
              {t('nos.cta', 'Agenda una consulta')}
              <Icono nombre="flecha" size={18} className="zy-flecha" />
            </a>
          </div>

          <div className="col-lg-6 zy-revelar" style={{ transitionDelay: '120ms' }}>
            <div className="zy-nos-cifras">
              {CIFRAS.map(c => (
                <div
                  key={c.clave}
                  className="zy-tarjeta zy-nos-cifra"
                  style={{ '--zy-color-acento': c.acento }}
                >
                  <span className="zy-nos-cifra-icono" style={{ color: c.acento }}>
                    <Icono nombre={c.icono} size={19} />
                  </span>
                  <span className="zy-nos-cifra-num">{c.numClave ? t(c.numClave, c.num) : c.num}</span>
                  <span className="zy-nos-cifra-lbl">{t(c.clave, c.label)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
