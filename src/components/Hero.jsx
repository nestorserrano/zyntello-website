import { useCallback, useEffect, useState } from 'react'
import Icono from './Icono'
import { useIdioma } from '../hooks/useIdioma'
import '../styles/Hero.css'

/* Formato tomado de appicross.com (pedido del director técnico, 2026-11-24): foto a pantalla
   completa bajo el menú, varias escenas que rotan, titular grande alineado a la izquierda,
   flechas a los lados y puntos abajo. Las fotos son propias de Zyntello: no se reutiliza nada de
   aquel sitio.

   ⚠️ La escena 1 conserva las claves del titular de siempre (`hero.titulo.*`, `hero.bajada`):
   ya están traducidas a los ocho idiomas y la bajada lleva las palabras que la gente busca en
   Google. Cambiarlas por textos nuevos habría perdido las dos cosas. */
const ESCENAS = [
  {
    imagen: '/logos/hero-zyntello-empresas-2026.jpg',
    kicker: ['hero.insignia', 'Plataforma propia en producción · RD · VE · CO · GT · CR'],
    /* Son dos frases completas, así que el salto entre ellas vale en cualquier idioma. */
    titulo: ['hero.titulo.1', 'Lo difícil nunca fue el software.'],
    acento: ['hero.titulo.2', 'Es ponerlo a funcionar.'],
    bajada: ['hero.bajada', 'Software ERP y CRM para digitalizar y automatizar la gestión de tu empresa. Lo implantamos, lo conectamos con agentes de Inteligencia Artificial y seguimos ahí cuando el proyecto termina. Veinte años haciendo exactamente eso.'],
  },
  {
    imagen: '/logos/hero-zyntello-logistica-2026.jpg',
    kicker: ['hero.s2.kicker', 'Inventario · Compras · Distribución'],
    titulo: ['hero.s2.titulo', 'Inventario conectado.'],
    acento: ['hero.s2.acento', 'Despachos bajo control.'],
    bajada: ['hero.s2.bajada', 'Existencias, compras, almacenes y entregas en un mismo sistema, con la información de cada equipo a mano en el momento en que la necesita.'],
  },
  {
    imagen: '/logos/hero-zyntello-construccion-2026.jpg',
    kicker: ['hero.s3.kicker', 'Construcción · Presupuestos · Compras'],
    titulo: ['hero.s3.titulo', 'Cada obra a la vista.'],
    acento: ['hero.s3.acento', 'Costos y avances al día.'],
    bajada: ['hero.s3.bajada', 'Presupuestos, contratos, materiales y avance de obra conectados, para corregir una desviación antes de que se convierta en pérdida.'],
  },
]

const INTERVALO_MS = 7000

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
  const { t } = useIdioma()
  const [actual, setActual] = useState(0)
  /* Pausa explícita (botón) y pausa mientras el ratón o el foco están dentro: se leen por
     separado para que soltar el ratón no reanude un carrusel que el usuario pausó a propósito. */
  const [pausado, setPausado] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const [encima, setEncima] = useState(false)

  const total = ESCENAS.length
  const ir = useCallback(i => setActual((i + total) % total), [total])

  useEffect(() => {
    if (pausado || encima) return undefined
    const id = setTimeout(() => setActual(a => (a + 1) % total), INTERVALO_MS)
    return () => clearTimeout(id)
  }, [actual, pausado, encima, total])

  return (
    <section
      id="inicio"
      className="zy-hero"
      aria-roledescription="carousel"
      aria-label={t('a11y.carrusel', 'Escenas de la portada')}
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setEncima(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setEncima(false) }}
    >
      {ESCENAS.map((e, i) => (
        <div
          key={e.imagen}
          className={`zy-hero-foto ${i === actual ? 'zy-activa' : ''}`}
          style={{ backgroundImage: `url(${e.imagen})` }}
          aria-hidden="true"
        />
      ))}
      <div className="zy-hero-velo" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 zy-hero-contenido">
        <div className="zy-hero-escenas">
          {ESCENAS.map((e, i) => {
            const activa = i === actual
            const Titulo = i === 0 ? 'h1' : 'h2'
            return (
              <div
                key={e.imagen}
                className={`zy-hero-escena ${activa ? 'zy-activa' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${total}`}
                aria-hidden={!activa}
                inert={!activa}
              >
                <p className="zy-hero-insignia">{t(e.kicker[0], e.kicker[1])}</p>
                <Titulo className="zy-hero-titulo">
                  {t(e.titulo[0], e.titulo[1])}<br />
                  <span className="zy-hero-acento">{t(e.acento[0], e.acento[1])}</span>
                </Titulo>
                <p className="zy-hero-bajada">{t(e.bajada[0], e.bajada[1])}</p>
                <div className="zy-hero-botones">
                  <a href="#soluciones" className="zy-btn zy-hero-btn-blanco">
                    {t('hero.boton.plataforma', 'Ver la plataforma')}
                    <Icono nombre="flecha" size={18} className="zy-flecha" />
                  </a>
                  <a href="#contacto" className="zy-btn zy-hero-btn-borde">
                    <Icono nombre="chat" size={18} />
                    {t('hero.boton.contacto', 'Agendar una consulta')}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button type="button" className="zy-hero-flecha zy-hero-flecha-ant" onClick={() => ir(actual - 1)}
        aria-label={t('a11y.carrusel.anterior', 'Imagen anterior')}>
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>
      <button type="button" className="zy-hero-flecha zy-hero-flecha-sig" onClick={() => ir(actual + 1)}
        aria-label={t('a11y.carrusel.siguiente', 'Imagen siguiente')}>
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>

      <div className="zy-hero-controles">
        <button type="button" className="zy-hero-pausa" onClick={() => setPausado(p => !p)}
          aria-label={pausado ? t('a11y.carrusel.reanudar', 'Reanudar el carrusel') : t('a11y.carrusel.pausar', 'Pausar el carrusel')}>
          <i className={`fa-solid ${pausado ? 'fa-play' : 'fa-pause'}`} aria-hidden="true" />
        </button>
        {ESCENAS.map((e, i) => (
          <button key={e.imagen} type="button"
            className={`zy-hero-punto ${i === actual ? 'zy-activa' : ''}`}
            onClick={() => ir(i)}
            aria-label={`${t('a11y.carrusel.ir', 'Mostrar imagen')} ${i + 1}`}
            aria-current={i === actual ? 'true' : undefined} />
        ))}
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
    </section>
  )
}
