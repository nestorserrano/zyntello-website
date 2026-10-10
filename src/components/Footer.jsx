import Icono from './Icono'
import RedesSociales from './RedesSociales'
import { useIdioma } from '../hooks/useIdioma'

/* ⚠️⚠️ Cada servicio a SU página. Hasta el 2026-09-21 los diez apuntaban a
   `#servicios`, la MISMA ancla: daba igual cuál pulsaras, y eso no se ve como
   un error — se ve como una web donde el pie «no hace nada».

   ⚠️ Son catorce en la sección «Qué hacemos» y aquí caben diez sin que la
   columna se alargue de más. Los cuatro que faltan —contable, marketing,
   electoral y encuestas— se alcanzan desde sus tarjetas y desde el enlace de
   abajo, para que ninguno quede sin camino.

   ⚠️ El tercer elemento es la CLAVE de traducción, y es `pie.serv.*` y no
   `serv.*`: estos nombres están abreviados a propósito para que quepan en la
   columna, así que son textos distintos de los títulos de las tarjetas. Una
   sola clave para los dos obligaría a elegir, y el nombre largo rompe el pie. */
const SERVICIOS = [
  ['plataforma-saas',            'Plataforma SaaS Zyntello'],
  ['erp-y-crm',                  'ERP y CRM'],
  ['automatizacion-con-ia',      'Automatización con IA'],
  ['aplicaciones-a-la-medida',   'Aplicaciones a la medida'],
  ['soporte-tecnico-ti',         'Soporte técnico TI'],
  ['nube-y-ciberseguridad',      'Nube y ciberseguridad'],
  ['personal-ti-especializado',  'Personal TI especializado'],
  ['venta-de-equipos',           'Venta de equipos'],
  ['transformacion-digital',     'Transformación digital'],
  ['capacitacion-ti-e-ia',       'Capacitación en TI e IA'],
]

/* ⚠️⚠️ Las entradas con `/` son PÁGINAS, no anclas, y por eso están aquí: una
   página a la que no apunta ningún enlace del sitio es huérfana. Google la
   encuentra por el sitemap, pero le da poca importancia precisamente porque
   nadie la enlaza — y el síntoma es que no posiciona, no que falle. El pie es
   el sitio donde se enlaza todo desde todas partes.

   ⚠️ Las que siguen siendo ancla (#porque, #portafolio, #soluciones) lo siguen
   siendo a propósito: son secciones de la portada y convertirlas en enlace
   recargaría la página en vez de desplazarse, que es peor de usar. */
const EMPRESA = [
  ['/nosotros/',       'pie.emp.nosotros',      'Quiénes somos'],
  ['#porque',          'pie.emp.porque',        'Por qué Zyntello'],
  ['#portafolio',      'nav.portafolio',        'Portafolio'],
  ['#soluciones',      'pie.emp.modulos',       'Módulos'],
  ['/precios/',        'pie.emp.precios',       'Precios'],
  ['/automatizacion/', 'pie.emp.automatizacion', 'Automatización'],
  ['/blog/',           'pie.emp.blog',          'Blog'],
  ['/contacto/',       'nav.contacto',          'Contacto'],
]

const LEGALES = [
  ['/terminos/',          'pie.legal.terminos',   'Términos y condiciones'],
  ['/privacidad/',        'pie.legal.privacidad', 'Política de privacidad'],
  ['/cookies/',           'pie.legal.cookies',    'Política de cookies'],
  ['/sla/',               'pie.legal.sla',        'Acuerdo de nivel de servicio'],
  ['/eliminacion-datos/', 'pie.legal.datos',      'Eliminación de datos'],
  ['/avisos-terceros/',   'pie.legal.terceros',   'Avisos de terceros'],
]

export default function Footer() {
  const { idioma, t } = useIdioma()

  return (
    <footer className="zy-pie">
      <div className="zy-halo zy-pie-halo" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">

        {/* Llamada final */}
        <div className="zy-pie-llamada zy-revelar">
          <h2 className="zy-pie-llamada-titulo">
            {/* ⚠️ Mismo criterio que el Hero: el español conserva su resaltado
                exacto y los demás idiomas reciben la frase entera. El énfasis
                cae sobre «lo que más te duele», y en chino y árabe esas
                palabras ni están en ese orden ni son separables igual. */}
            {idioma === 'es' ? (
              <>¿Empezamos por <span className="zy-degradado">lo que más te duele</span>?</>
            ) : (
              t('pie.llamada.titulo', '¿Empezamos por lo que más te duele?')
            )}
          </h2>
          <div className="zy-pie-llamada-botones">
            <a href="#contacto" className="zy-btn zy-btn-primario">
              {t('pie.boton.consulta', 'Agendar una consulta')}
              <Icono nombre="flecha" size={18} className="zy-flecha" />
            </a>
            <a href="https://wa.me/18296399877" className="zy-btn zy-btn-fantasma">
              <Icono nombre="chat" size={18} />
              {t('pie.boton.whatsapp', 'Escribir por WhatsApp')}
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
              {t('pie.lema', 'Datos que revelan. Tecnología que transforma. Resultados que perduran.')}
            </p>
            <p className="zy-pie-texto">
              {t('pie.descripcion', 'Zyntello, S.R.L. — desarrollo, implementación y comercialización de soluciones tecnológicas empresariales basadas en Inteligencia Artificial, automatización de procesos y consultoría en tecnologías de la información.')}
            </p>

            {/* ⚠️ Los correos y el teléfono NO se traducen ni se localizan: son
                la dirección literal a la que hay que escribir. */}
            <div className="zy-pie-contactos">
              <a href="mailto:info@zyntello.com"><Icono nombre="correo" size={15} /> info@zyntello.com</a>
              <a href="https://wa.me/18296399877"><Icono nombre="chat" size={15} /> +1 829 639 9877</a>
              <a href="mailto:soporte@zyntello.com"><Icono nombre="salvavidas" size={15} /> soporte@zyntello.com</a>
            </div>
            <p className="zy-pie-redes-titulo">{t('pie.redes', 'Síguenos')}</p>
            <RedesSociales />
          </div>

          <div className="col-6 col-lg-3">
            <h3 className="zy-pie-titulo">{t('nav.servicios', 'Servicios')}</h3>
            <ul className="zy-pie-lista">
              {SERVICIOS.map(([slug, texto]) => (
                <li key={slug}><a href={`/servicios/${slug}/`}>{t(`pie.serv.${slug}`, texto)}</a></li>
              ))}
              <li><a href="/#servicios" className="zy-pie-todos">{t('pie.todos', 'Ver los 14 servicios')} →</a></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h3 className="zy-pie-titulo">{t('pie.titulo.empresa', 'Empresa')}</h3>
            <ul className="zy-pie-lista">
              {EMPRESA.map(([href, clave, texto]) => (
                <li key={href}><a href={href}>{t(clave, texto)}</a></li>
              ))}
            </ul>
          </div>

          <div className="col-12 col-lg-3">
            <h3 className="zy-pie-titulo">{t('pie.titulo.legal', 'Legal')}</h3>
            <ul className="zy-pie-lista">
              {LEGALES.map(([href, clave, texto]) => (
                <li key={href}><a href={href}>{t(clave, texto)}</a></li>
              ))}
            </ul>
            <a href="https://app.zyntello.com" className="zy-btn zy-btn-fantasma zy-pie-acceso">
              {t('pie.acceso', 'Acceder a la plataforma')}
              <Icono nombre="flecha" size={16} className="zy-flecha" />
            </a>
          </div>

        </div>

        <div className="zy-pie-final">
          {/* ⚠️ El año lo pone JavaScript y va FUERA de la cadena traducida: si
              entrara en ella, el año quedaría congelado en las ocho versiones y
              habría que corregirlo a mano cada enero, en ocho idiomas. */}
          <span>© {new Date().getFullYear()} {t('pie.derechos', 'Zyntello, S.R.L. — República Dominicana. Todos los derechos reservados.')}</span>
          <span className="zy-pie-dominio">zyntello.com</span>
        </div>

      </div>
    </footer>
  )
}
