import FondoAnimado from './FondoAnimado'
import Icono from './Icono'
import { useIdioma } from '../hooks/useIdioma'
import '../styles/Hero.css'

/* ⚠️ Solo el TEXTO lleva clave. El número se escribe igual en los ocho
   idiomas, así que traducirlo sería una fila de claves que nadie cambiaría. */
const CIFRAS = [
  { clave: 'hero.cifra.anos',      numero: '20+',  label: 'años en TI y ERP' },
  { clave: 'hero.cifra.proyectos', numero: '100+', label: 'proyectos entregados' },
  { clave: 'hero.cifra.modulos',   numero: '34',   label: 'módulos en producción' },
  { clave: 'hero.cifra.paises',    numero: '5',    label: 'países con presencia' },
]

/* El objeto social, en lenguaje de cliente.
   ⚠️ La `key` de React es la CLAVE y no el texto: el texto cambia con el
   idioma, y la cinta se duplica para el bucle — con el texto por key, cambiar
   de idioma remontaría las treinta y la animación daría un salto. */
const CAPACIDADES = [
  ['hero.cinta.erp-crm',          'ERP y CRM'],
  ['hero.cinta.agentes',          'Agentes de IA'],
  ['hero.cinta.automatizacion',   'Automatización de procesos'],
  ['hero.cinta.desarrollo',       'Desarrollo a medida'],
  ['hero.cinta.soporte',          'Soporte técnico TI'],
  ['hero.cinta.cloud',            'Cloud computing'],
  ['hero.cinta.ciberseguridad',   'Ciberseguridad'],
  ['hero.cinta.infraestructura',  'Infraestructura TI'],
  ['hero.cinta.personal',         'Personal TI especializado'],
  ['hero.cinta.hardware',         'Hardware y licencias'],
  ['hero.cinta.transformacion',   'Transformación digital'],
  ['hero.cinta.arquitectura',     'Arquitectura de sistemas'],
  ['hero.cinta.capacitacion',     'Capacitación en IA'],
  ['hero.cinta.contable',         'Consultoría contable'],
  ['hero.cinta.mercado',          'Estudios de mercado'],
]

export default function Hero() {
  const { t, idioma } = useIdioma()

  return (
    <section id="inicio" className="zy-hero">

      {/* Fondo: malla de datos — sistemas que se hablan entre sí */}
      <FondoAnimado escena="malla" tinte="indigo" />
      <div className="zy-malla" aria-hidden="true" />
      <div className="zy-halo zy-hero-halo-1" aria-hidden="true" />
      <div className="zy-halo zy-hero-halo-2" aria-hidden="true" />
      <div className="zy-grano" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 zy-hero-contenido">

        <p className="zy-hero-insignia zy-entrar" style={{ animationDelay: '40ms' }}>
          <span className="zy-hero-latido" aria-hidden="true" />
          {t('hero.insignia', 'Plataforma propia en producción · RD · VE · CO · GT · CR')}
        </p>

        <h1 className="zy-hero-titulo zy-entrar" style={{ animationDelay: '120ms' }}>
          {/* ⚠️⚠️ El titular está partido para DAR FORMATO —el salto y el efecto hueco sobre
              «el software»— y eso solo funciona con el orden de las palabras en español. En chino
              o en árabe la frase se ordena distinta, así que trocearla dejaría el efecto sobre
              palabras que no tocan y el salto en mitad de cualquier sitio.

              Por eso el español conserva su marcado exacto —no se rediseña lo que funciona— y los
              demás idiomas reciben la frase entera, sin el hueco. Perder un efecto tipográfico es
              mucho menos grave que publicar un titular mal cortado en la portada. */}
          {idioma === 'es' ? (
            <>
              Lo difícil nunca fue<br />
              <span className="zy-hueco">el software.</span>{' '}
            </>
          ) : (
            <>{t('hero.titulo.1')}{' '}</>
          )}
          <span className="zy-degradado">{t('hero.titulo.2', 'Es ponerlo a funcionar.')}</span>
        </h1>

        {/* ⚠️ Esta bajada carga las palabras que la gente teclea en Google
            —software ERP, CRM, gestión empresarial, digitalizar, automatizar—
            porque el H1 de arriba es el eslogan de marca y no las lleva.
            Decidido el 2026-09-25: el titular se queda como está; quien busca
            «software ERP» entra igual, porque Google lee los dos. */}
        <p className="zy-hero-bajada zy-entrar" style={{ animationDelay: '200ms' }}>
          {t('hero.bajada', 'Software ERP y CRM para digitalizar y automatizar la gestión de tu empresa. Lo implantamos, lo conectamos con agentes de Inteligencia Artificial y seguimos ahí cuando el proyecto termina. Veinte años haciendo exactamente eso.')}
        </p>

        <div className="zy-hero-botones zy-entrar" style={{ animationDelay: '280ms' }}>
          <a href="#soluciones" className="zy-btn zy-btn-primario">
            {t('hero.boton.plataforma', 'Ver la plataforma')}
            <Icono nombre="flecha" size={18} className="zy-flecha" />
          </a>
          <a href="#contacto" className="zy-btn zy-btn-fantasma">
            <Icono nombre="chat" size={18} />
            {t('hero.boton.contacto', 'Agendar una consulta')}
          </a>
        </div>

        <p className="zy-hero-nota zy-entrar" style={{ animationDelay: '340ms' }}>
          <Icono nombre="check" size={15} />
          {t('hero.nota', 'Sin instalaciones · Sin permanencia · Pruebas los módulos antes de contratar')}
        </p>

        <div className="zy-hero-cifras zy-entrar" style={{ animationDelay: '420ms' }}>
          {CIFRAS.map(c => (
            <div key={c.clave} className="zy-hero-cifra">
              <span className="zy-hero-cifra-num">{c.numero}</span>
              <span className="zy-hero-cifra-lbl">{t(c.clave, c.label)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="zy-hero-desfile">
        <div className="zy-marquesina">
          {[0, 1].map(copia => (
            <div className="zy-marquesina-pista" key={copia} aria-hidden={copia === 1 ? 'true' : undefined}>
              {CAPACIDADES.map(([clave, texto]) => (
                <span className="zy-hero-capacidad" key={clave}>{t(clave, texto)}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <a href="#servicios" className="zy-hero-bajar" aria-label={t('a11y.bajar', 'Ir a la sección de servicios')}>
        <Icono nombre="abajo" size={19} />
      </a>
    </section>
  )
}
