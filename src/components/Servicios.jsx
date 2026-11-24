import Icono from './Icono'
import { useIdioma } from '../hooks/useIdioma'
import '../styles/Servicios.css'

/* ─────────────────────────────────────────────────────────────────────────────
   El objeto social de Zyntello, S.R.L., traducido a lo que el cliente compra.
   ⚠️ Cubre los once apartados del objeto social inscrito (RM 6053SPM): si se
   añade uno al registro, se añade aquí, en `scripts/servicios/datos.mjs`, en
   el desplegable de Contacto y en el catálogo del admin.
   El orden es deliberado: primero lo que la empresa vende como producto propio
   (plataforma, IA, ERP), después los servicios que la sostienen, y al final la
   consultoría de datos. Cambiar el orden cambia lo que el visitante cree que
   somos.

   ⚠️ `slug` manda sobre el título: es la clave de traducción (`serv.{slug}.*`),
   la URL de su página y la `key` de React. El título cambia con el idioma, así
   que usarlo de identificador remontaría la lista entera en cada cambio.
   ───────────────────────────────────────────────────────────────────────────── */
const SERVICIOS = [
  {
    slug: 'plataforma-saas',
    icono: 'cuadricula',
    grupo: 'Plataforma', grupoClave: 'serv.grupo.plataforma',
    titulo: 'Plataforma SaaS Zyntello',
    descripcion: 'Nuestro ERP modular en la nube. Contratas solo los módulos que usas y los tienes funcionando el mismo día, sin instalar nada.',
  },
  {
    slug: 'automatizacion-con-ia',
    icono: 'robot',
    grupo: 'Inteligencia Artificial', grupoClave: 'serv.grupo.ia',
    titulo: 'Automatización con IA',
    descripcion: 'Agentes y modelos que ejecutan las tareas repetitivas, generan los reportes y conectan entre sí los sistemas que ya tienes.',
  },
  {
    slug: 'erp-y-crm',
    icono: 'servidor',
    grupo: 'Sistemas de gestión', grupoClave: 'serv.grupo.gestion',
    titulo: 'ERP y CRM',
    descripcion: 'Desarrollo, personalización e implementación de Softland, Profit, ODOO y plataformas abiertas, adaptadas al flujo real de tu empresa.',
  },
  {
    slug: 'migracion-de-sistemas',
    icono: 'ciclo',
    grupo: 'Sistemas de gestión', grupoClave: 'serv.grupo.gestion',
    titulo: 'Migración de sistemas y datos',
    descripcion: 'De un ERP, una versión o un servidor a otro, sin parar la operación y sin perder el histórico.',
  },
  {
    slug: 'aplicaciones-a-la-medida',
    icono: 'codigo',
    grupo: 'Desarrollo', grupoClave: 'serv.grupo.desarrollo',
    titulo: 'Aplicaciones a la medida',
    descripcion: 'Construidas sobre las bases de datos que ya usas. No hay que empezar de cero para resolver un problema concreto.',
  },
  {
    slug: 'desarrollo-web-y-tiendas-en-linea',
    icono: 'carrito',
    grupo: 'Desarrollo', grupoClave: 'serv.grupo.desarrollo',
    titulo: 'Desarrollo web y tiendas en línea',
    descripcion: 'Sitios corporativos y tiendas en línea conectados a tu inventario y tu facturación: lo que se vende en la web no se escribe dos veces.',
  },
  {
    slug: 'inteligencia-de-negocios',
    icono: 'subida',
    grupo: 'Datos', grupoClave: 'serv.grupo.bi',
    titulo: 'Inteligencia de negocios',
    descripcion: 'Tableros y reportes gerenciales conectados a tu ERP, con la información al día y sin armarla a mano.',
  },
  {
    slug: 'soporte-tecnico-ti',
    icono: 'salvavidas',
    grupo: 'Operación', grupoClave: 'serv.grupo.operacion',
    titulo: 'Soporte técnico TI',
    descripcion: 'Infraestructura, redes, servidores y sistemas, con niveles de servicio acordados según cómo opera tu empresa.',
  },
  {
    slug: 'nube-y-ciberseguridad',
    icono: 'escudo',
    grupo: 'Operación', grupoClave: 'serv.grupo.operacion',
    titulo: 'Nube y ciberseguridad',
    descripcion: 'Servicios en la nube, protección de la información y gestión de infraestructura: que esté disponible, y que solo entre quien debe.',
  },
  {
    slug: 'personal-ti-especializado',
    icono: 'equipo',
    grupo: 'Talento', grupoClave: 'serv.grupo.talento',
    titulo: 'Colocación de personal TI',
    descripcion: 'Desde técnicos de soporte hasta arquitectos de sistemas y especialistas en Inteligencia Artificial.',
  },
  {
    slug: 'venta-de-equipos',
    icono: 'caja',
    grupo: 'Equipos', grupoClave: 'serv.grupo.equipos',
    titulo: 'Importación y venta de equipos',
    descripcion: 'Hardware, software y soluciones tecnológicas, con la asesoría técnica incluida en la compra.',
  },
  {
    slug: 'domotica',
    icono: 'casa',
    grupo: 'IoT y domótica', grupoClave: 'serv.grupo.iot',
    titulo: 'Domótica y edificios inteligentes',
    descripcion: 'Iluminación, clima, acceso, cámaras y consumo eléctrico del edificio, gestionados desde un solo lugar.',
  },
  {
    slug: 'internet-de-las-cosas',
    icono: 'chip',
    grupo: 'IoT y domótica', grupoClave: 'serv.grupo.iot',
    titulo: 'Internet de las cosas (IoT)',
    descripcion: 'Sensores, telemetría y alertas para medir temperatura, niveles, energía o flota sin que nadie tenga que ir a revisar.',
  },
  {
    slug: 'industria-4-0-y-5-0',
    icono: 'fabrica',
    grupo: 'Industria', grupoClave: 'serv.grupo.industria',
    titulo: 'Industria 4.0 y 5.0',
    descripcion: 'Máquinas, producción y ERP conectados: eficiencia por línea, paradas y trazabilidad en tiempo real, con el operario en el centro.',
  },
  {
    slug: 'automatizacion-industrial',
    icono: 'engranajes',
    grupo: 'Industria', grupoClave: 'serv.grupo.industria',
    titulo: 'Automatización y mantenimiento industrial',
    descripcion: 'Control de procesos y mantenimiento preventivo y predictivo, con el historial de cada equipo y los repuestos ligados al inventario.',
  },
  {
    slug: 'transformacion-digital',
    icono: 'brujula',
    grupo: 'Consultoría', grupoClave: 'serv.grupo.consultoria',
    titulo: 'Transformación digital',
    descripcion: 'Diagnóstico de lo que tienes, hoja de ruta tecnológica, arquitectura de sistemas y acompañamiento en la implementación.',
  },
  {
    slug: 'capacitacion-ti-e-ia',
    icono: 'birrete',
    grupo: 'Consultoría', grupoClave: 'serv.grupo.consultoria',
    titulo: 'Capacitación y formación',
    descripcion: 'En el ERP implantado y en herramientas de IA, para que el equipo use de verdad lo que la empresa compró.',
  },
  {
    slug: 'consultoria-contable',
    icono: 'libro',
    grupo: 'Consultoría', grupoClave: 'serv.grupo.consultoria',
    titulo: 'Consultoría contable',
    descripcion: 'Asesoría contable y financiera integrada con tus sistemas: procesos, reportes fiscales y análisis para decidir con números reales.',
  },
  {
    slug: 'marketing-digital',
    icono: 'megafono',
    grupo: 'Datos y mercado', grupoClave: 'serv.grupo.datos',
    titulo: 'Marketing digital',
    descripcion: 'Posicionamiento, campañas y analítica. Se mide el resultado, no las impresiones.',
  },
  {
    slug: 'consultoria-electoral',
    icono: 'urna',
    grupo: 'Datos y mercado', grupoClave: 'serv.grupo.datos',
    titulo: 'Consultoría electoral',
    descripcion: 'Estrategia de campaña basada en datos: percepción ciudadana, inteligencia de mercado y monitoreo de tendencias.',
  },
  {
    slug: 'encuestas-y-estudios-de-mercado',
    icono: 'grafico',
    grupo: 'Datos y mercado', grupoClave: 'serv.grupo.datos',
    titulo: 'Encuestas y estudios de mercado',
    descripcion: 'Investigación de opinión, censos, muestreos y procesamiento estadístico para el sector público y privado.',
  },
]

/* Fotos de las tres tarjetas de «áreas», en el orden de los tres primeros servicios. */
const FOTOS_AREAS = [
  '/logos/hero-zyntello-empresas-2026.jpg',
  '/logos/hero-zyntello-logistica-2026.jpg',
  '/logos/hero-zyntello-construccion-2026.jpg',
]

export default function Servicios() {
  const { idioma, t } = useIdioma()

  return (
    <section id="servicios" className="zy-serv">

      <div className="container-fluid px-4 px-lg-5 position-relative">

        <header className="zy-serv-cabecera zy-revelar">
          <p className="zy-eyebrow">{t('serv.eyebrow', 'Qué hacemos')}</p>
          <h2 className="zy-titulo">
            {/* ⚠️ Mismo criterio que la portada: el español conserva su salto y
                su resaltado, y los demás idiomas reciben la frase entera. El
                corte cae entre «tecnología» y «deje de ser», y en chino o árabe
                esas palabras ni van en ese orden ni se separan por ahí. */}
            {/* ⚠️ Sin número a propósito: decía «Veinte formas…», y al sumar un servicio el
                catálogo no puede corregir las traducciones ya hechas (el seeder solo rellena lo
                vacío), así que el inglés o el chino seguirían diciendo veinte. */}
            {idioma === 'es' ? (
              <>
                Todo lo que hace falta para que la tecnología<br className="d-none d-lg-block" />{' '}
                <span className="zy-degradado">deje de ser tu problema</span>
              </>
            ) : (
              t('serv.titulo.todo', 'Todo lo que hace falta para que la tecnología deje de ser tu problema')
            )}
          </h2>
          <p className="zy-subtitulo">
            {t('serv.subtitulo', 'No vendemos software enlatado. Cada implementación parte de entender cómo funciona tu empresa — y construimos o adaptamos la tecnología exacta que necesita.')}
          </p>
        </header>

        {/* Formato «Nuestras Áreas» de appicross.com: los tres primeros —lo que Zyntello vende
            como producto propio— van en tarjetas con foto; el resto, en la rejilla de abajo. */}
        <div className="zy-serv-areas">
          {SERVICIOS.slice(0, 3).map((s, i) => (
            <a
              key={s.slug}
              href={`/servicios/${s.slug}/`}
              className="zy-serv-area zy-revelar"
              style={{ backgroundImage: `url(${FOTOS_AREAS[i]})`, transitionDelay: `${i * 80}ms` }}
            >
              <span className="zy-serv-area-icono"><Icono nombre={s.icono} size={20} /></span>
              <h3 className="zy-serv-area-titulo">{t(`serv.${s.slug}.titulo`, s.titulo)}</h3>
              <p className="zy-serv-area-desc">{t(`serv.${s.slug}.desc`, s.descripcion)}</p>
            </a>
          ))}
        </div>

        <div className="zy-serv-rejilla">
          {SERVICIOS.slice(3).map((s, i) => (
            <a
              key={s.slug}
              href={`/servicios/${s.slug}/`}
              className="zy-tarjeta zy-serv-tarjeta zy-serv-enlazada zy-revelar"
              style={{ transitionDelay: `${Math.min(i, 9) * 50}ms` }}
            >
              <span className="zy-serv-icono">
                <Icono nombre={s.icono} size={22} />
              </span>

              <span className="zy-serv-grupo">{t(s.grupoClave, s.grupo)}</span>
              <h3 className="zy-serv-titulo">{t(`serv.${s.slug}.titulo`, s.titulo)}</h3>
              <p className="zy-serv-desc">{t(`serv.${s.slug}.desc`, s.descripcion)}</p>

              {/* ⚠️ Un <a> dentro de otro <a> es HTML invalido y el navegador
                  lo desanida solo, dejando la tarjeta a medias. Por eso esto
                  es un <span>: el enlace es la tarjeta entera. */}
              <span className="zy-enlace zy-serv-enlace">
                {t('serv.enlace', 'Conoce más')}
                <Icono nombre="flecha" size={16} className="zy-flecha" />
              </span>
            </a>
          ))}
        </div>

        <p className="zy-serv-nota zy-revelar">
          {t('serv.nota', '¿No aparece lo que buscas? Nuestro objeto social cubre cualquier actividad de tecnología y automatización empresarial.')}{' '}
          <a href="#contacto">{t('serv.nota.enlace', 'Pregúntanos')}</a>.
        </p>
      </div>
    </section>
  )
}
