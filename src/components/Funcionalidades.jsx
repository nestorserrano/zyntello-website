import FondoAnimado from './FondoAnimado'
import Icono from './Icono'

/* ─── Lo que un ERP corriente no trae ─────────────────────────────────────
 *
 * ⚠️ Estas CUATRO no son módulos que se contratan: vienen con la plataforma.
 * Por eso tienen sección propia y no una tarjeta más en el catálogo de
 * Soluciones — mezclarlas ahí las haría parecer un extra de pago, que es
 * justo lo contrario de lo que son.
 *
 * ⚠️⚠️ Las cifras están MEDIDAS sobre zyntello-app el 2026-09-21, no
 * estimadas: 1.145 pantallas con ayuda, 1.416 campos con tooltip, 593 tablas
 * y 5.612 columnas en el diccionario, 16 módulos con el motor de
 * aprobaciones. Si el producto crece se vuelven a medir — un número inventado
 * en una página de ventas se descubre en la primera demo.
 *
 * ⚠️ El detalle de cada una vive en su propia página estática, en
 * `public/funcionalidades/{slug}/`, generada por
 * `scripts/generar-funcionalidades.mjs`. Son páginas aparte y no una vista de
 * esta SPA porque tienen que ser indexables por sí solas.
 * ────────────────────────────────────────────────────────────────────────── */

const FUNCIONALIDADES = [
  {
    slug: 'aprobaciones',
    icono: 'check',
    acento: '#6366f1',
    nombre: 'Aprobaciones',
    gancho: 'Quién autoriza qué, escrito una vez',
    descripcion: 'Un motor único que atraviesa 16 módulos. Se define quién aprueba y desde qué importe, y el documento no avanza hasta que alguien lo firma.',
    dato: '16 módulos',
  },
  {
    slug: 'generador-de-reportes',
    icono: 'grafico',
    acento: '#22d3ee',
    nombre: 'Generador de Reportes',
    gancho: 'El reporte que falta, sin esperar a nadie',
    descripcion: 'Construye tus propios reportes sin escribir una consulta, sobre orígenes curados y siempre acotados a tu empresa.',
    dato: '4 formatos',
  },
  {
    slug: 'diccionario-de-datos',
    icono: 'libro',
    acento: '#34d399',
    nombre: 'Diccionario de Datos',
    gancho: 'Qué significa cada dato, escrito',
    descripcion: 'Tus tablas y tus columnas documentadas en español. Tus datos dejan de ser un secreto de quien programó el sistema.',
    dato: '5.612 columnas',
  },
  {
    slug: 'sistema-de-ayuda',
    icono: 'salvavidas',
    acento: '#fb7185',
    nombre: 'Sistema de Ayuda',
    gancho: 'Cada pantalla explica lo que hace',
    descripcion: 'Un panel de ayuda por pantalla y una explicación por campo, dentro de la propia pantalla. Sin manuales y sin cursos.',
    dato: '1.145 pantallas',
  },
]

export default function Funcionalidades() {
  return (
    <section id="funcionalidades" className="zy-func">
      {/* Fondo: malla — la estructura que sostiene todo lo demás */}
      <FondoAnimado escena="malla" tinte="indigo" />
      <span className="zy-filo zy-filo-arriba" aria-hidden="true" />
      <div className="zy-grano" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">

        <header className="zy-func-cabecera zy-revelar">
          <p className="zy-eyebrow">Funcionalidades</p>
          <h2 className="zy-titulo">
            Lo que <span className="zy-indigo">ningún ERP</span> te da.
          </h2>
          <p className="zy-subtitulo">
            Cuatro cosas que no se contratan aparte y que casi nadie incluye: el
            control de quién autoriza, los reportes que tú mismo construyes, el
            significado de cada dato y la ayuda dentro de cada pantalla. Vienen
            con la plataforma.
          </p>
        </header>

        {/* ⚠️ Cuatro columnas fijas, nunca `auto-fit`: con auto-fit, un ancho
            intermedio deja 3 arriba y 1 abajo con dos huecos — y la página
            «se ve bien», así que nadie lo reporta. */}
        <div className="zy-func-rejilla">
          {FUNCIONALIDADES.map((f, i) => (
            <a
              key={f.slug}
              className="zy-func-tarjeta zy-revelar"
              href={`/funcionalidades/${f.slug}/`}
              style={{ '--zy-color-acento': f.acento, transitionDelay: `${i * 80}ms` }}
            >
              <span className="zy-func-icono">
                <Icono nombre={f.icono} size={22} />
              </span>

              <span className="zy-func-dato">{f.dato}</span>

              <h3 className="zy-func-nombre">{f.nombre}</h3>
              <p className="zy-func-gancho">{f.gancho}</p>
              <p className="zy-func-desc">{f.descripcion}</p>

              <span className="zy-func-mas">
                Conoce más
                <Icono nombre="flecha" size={16} className="zy-flecha" />
              </span>
            </a>
          ))}
        </div>

        <p className="zy-func-pie zy-revelar">
          Incluidas en cualquier módulo que contrates. No son un extra.
        </p>

      </div>
    </section>
  )
}
