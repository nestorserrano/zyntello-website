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
  { num: '20+',  numClave: null,            clave: 'nos.cifra.anos',    label: 'años de experiencia en TI y ERP',       icono: 'diana' },
  { num: '5',    numClave: null,            clave: 'nos.cifra.paises',  label: 'países con presencia directa',          icono: 'globo' },
  { num: 'IA',   numClave: 'nos.cifra.ia',  clave: 'nos.cifra.iatexto', label: 'aplicada a procesos empresariales',     icono: 'robot' },
  { num: '24/7', numClave: null,            clave: 'nos.cifra.soporte', label: 'soporte posterior a la implementación', icono: 'salvavidas' },
]

export default function Nosotros() {
  const { idioma, t } = useIdioma()

  /* Formato «Sobre nosotros» de appicross.com: foto a todo el ancho bajo un velo azul, tarjeta
     blanca a un lado con el texto, y —propio de Zyntello— las cifras en blanco sobre la foto. */
  return (
    <section id="nosotros" className="zy-nos">
      <div className="zy-nos-foto" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">
        <div className="zy-nos-caja">

          <div className="zy-nos-cifras zy-revelar">
            {CIFRAS.map(c => (
              <div key={c.clave} className="zy-nos-cifra">
                <span className="zy-nos-cifra-icono"><Icono nombre={c.icono} size={19} /></span>
                <span className="zy-nos-cifra-num">{c.numClave ? t(c.numClave, c.num) : c.num}</span>
                <span className="zy-nos-cifra-lbl">{t(c.clave, c.label)}</span>
              </div>
            ))}
          </div>

          <div className="zy-nos-tarjeta zy-revelar" style={{ transitionDelay: '120ms' }}>
            <p className="zy-eyebrow">{t('pie.emp.nosotros', 'Quiénes somos')}</p>
            <h2 className="zy-nos-lema">
              {t('nos.lema.1', 'Datos que revelan.')}{' '}
              {t('nos.lema.2', 'Tecnología que transforma.')}{' '}
              <span className="zy-degradado">{t('nos.lema.3', 'Resultados que perduran.')}</span>
            </h2>
            {/* ⚠️ Las negritas del párrafo solo en español: marcan «Zyntello, S.R.L.» e
                «Inteligencia Artificial», y en árabe el orden de la frase es otro. */}
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

        </div>
      </div>
    </section>
  )
}
