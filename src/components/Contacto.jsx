import { useState } from 'react'
import FondoAnimado from './FondoAnimado'
import Icono from './Icono'
import { useIdioma } from '../hooks/useIdioma'

// ── Access Key de web3forms.com ─────────────────────────────────────────────
const WEB3FORMS_KEY = 'd27d70b8-3963-46b4-aac4-7086a3d20f05'

/* ⚠️⚠️ Cada opción lleva su slug —para la clave de traducción— y su texto en
   ESPAÑOL, que es el que viaja en el correo. Lo que se traduce es solo lo que
   el visitante LEE: el `value` se queda en español a propósito, porque quien
   recibe la consulta en Zyntello no lee chino ni árabe, y un asunto que nadie
   entiende es una consulta que nadie atiende. */
const SERVICIOS = [
  ['plataforma-saas',                 'Plataforma SaaS Zyntello (módulos en la nube)'],
  ['erp-y-crm',                       'ERP y CRM (Softland / Profit / ODOO)'],
  ['automatizacion-con-ia',           'Automatización con Inteligencia Artificial'],
  ['aplicaciones-a-la-medida',        'Aplicaciones a la medida'],
  ['soporte-tecnico-ti',              'Soporte técnico TI'],
  ['nube-y-ciberseguridad',           'Nube, ciberseguridad e infraestructura'],
  ['personal-ti-especializado',       'Colocación de personal TI'],
  ['venta-de-equipos',                'Importación y venta de equipos'],
  ['transformacion-digital',          'Transformación digital y arquitectura'],
  ['capacitacion-ti-e-ia',            'Capacitación y formación en TI e IA'],
  ['consultoria-contable',            'Consultoría contable'],
  ['marketing-digital',               'Marketing digital'],
  ['consultoria-electoral',           'Consultoría electoral y política'],
  ['encuestas-y-estudios-de-mercado', 'Encuestas y estudios de mercado'],
]

const CANALES = [
  { icono: 'correo',     clave: 'cont.canal.escribenos', titulo: 'Escríbenos',      valor: 'info@zyntello.com',    href: 'mailto:info@zyntello.com' },
  // ⚠️ «WhatsApp» y el número NO se traducen: son una marca y una dirección.
  { icono: 'chat',       clave: null,                    titulo: 'WhatsApp',        valor: '+1 829 639 9877',      href: 'https://wa.me/18296399877' },
  { icono: 'salvavidas', clave: 'cont.canal.cliente',    titulo: 'Ya eres cliente', valor: 'soporte@zyntello.com', href: 'mailto:soporte@zyntello.com' },
  { icono: 'reloj',      clave: 'cont.canal.horario',    titulo: 'Horario',         valor: 'Lunes a viernes, 8:00 a 18:00 (AST)', claveValor: 'cont.canal.horario.valor', href: null },
]

export default function Contacto() {
  const { idioma, t } = useIdioma()
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', servicio: '', mensaje: '' })
  const [estado, setEstado] = useState(null) // null | 'enviando' | 'ok' | 'error'

  const cambiar = e => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async e => {
    e.preventDefault()
    setEstado('enviando')

    try {
      const datos = new FormData()
      datos.append('access_key', WEB3FORMS_KEY)
      datos.append('subject', `Nueva consulta desde zyntello.com — ${form.servicio}`)
      datos.append('from_name', form.nombre)
      datos.append('name', form.nombre)
      datos.append('email', form.email)
      datos.append('message',
        `Nombre: ${form.nombre}\n` +
        `Empresa: ${form.empresa || '—'}\n` +
        `Correo: ${form.email}\n` +
        `Servicio: ${form.servicio}\n` +
        // ⚠️ El idioma del visitante VIAJA en el correo: si escribió en chino,
        //    quien responda tiene que saberlo antes de contestar en español.
        `Idioma del visitante: ${idioma}\n\n` +
        `Mensaje:\n${form.mensaje}`
      )

      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: datos })
      const json = await res.json()

      if (json.success) {
        setEstado('ok')
        setForm({ nombre: '', empresa: '', email: '', servicio: '', mensaje: '' })
        setTimeout(() => setEstado(null), 6000)
      } else {
        setEstado('error')
      }
    } catch {
      setEstado('error')
    }
  }

  return (
    <section id="contacto" className="zy-cont">
      {/* Fondo: ondas de señal — cobertura y comunicación */}
      <FondoAnimado escena="ondas" tinte="neutro" />
      <span className="zy-filo zy-filo-arriba" aria-hidden="true" />
      <div className="zy-grano" aria-hidden="true" />

      <div className="container-fluid px-4 px-lg-5 position-relative">
        <div className="row g-5">

          <div className="col-lg-5 zy-revelar">
            <p className="zy-eyebrow">{t('cont.eyebrow', 'Hablemos')}</p>
            <h2 className="zy-titulo">
              {/* ⚠️ Mismo criterio que el Hero y el pie: el español conserva su
                  salto y su resaltado; los demás idiomas reciben la frase
                  entera, porque el corte no cae en el mismo sitio. */}
              {idioma === 'es' ? (
                <>Cuéntanos qué<br /><span className="zy-degradado">te está costando</span></>
              ) : (
                t('cont.titulo', 'Cuéntanos qué te está costando')
              )}
            </h2>
            <p className="zy-subtitulo zy-cont-intro">
              {t('cont.intro', 'Respondemos en menos de 24 horas laborables. La primera conversación no cuesta nada y sale de ella una recomendación concreta, no un presupuesto.')}
            </p>

            <div className="zy-cont-canales">
              {CANALES.map(c => (
                <div key={c.titulo} className="zy-cont-canal">
                  <span className="zy-cont-canal-icono">
                    <Icono nombre={c.icono} size={18} />
                  </span>
                  <div>
                    <div className="zy-cont-canal-titulo">{c.clave ? t(c.clave, c.titulo) : c.titulo}</div>
                    {c.href
                      ? <a className="zy-cont-canal-valor zy-cont-canal-enlace" href={c.href}>{c.valor}</a>
                      : <span className="zy-cont-canal-valor">{c.claveValor ? t(c.claveValor, c.valor) : c.valor}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-7 zy-revelar" style={{ transitionDelay: '100ms' }}>
            <form onSubmit={enviar} className="zy-cont-form">

              {/* El aviso va ANTES del formulario y con `role`: quien navega con
                  lector de pantalla no ve un color, necesita que se le anuncie. */}
              <div aria-live="polite">
                {estado === 'ok' && (
                  <div className="zy-cont-aviso zy-cont-aviso-ok" role="status">
                    <Icono nombre="check" size={18} />
                    {t('cont.ok', 'Mensaje enviado. Te contactamos en menos de 24 horas laborables.')}
                  </div>
                )}
                {estado === 'error' && (
                  <div className="zy-cont-aviso zy-cont-aviso-error" role="alert">
                    <Icono nombre="cerrar" size={18} />
                    <span>
                      {t('cont.error', 'No se pudo enviar. Escríbenos directamente a')}{' '}
                      <a href="mailto:info@zyntello.com">info@zyntello.com</a>.
                    </span>
                  </div>
                )}
              </div>

              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="zy-cont-label" htmlFor="zy-nombre">{t('cont.label.nombre', 'Tu nombre')} *</label>
                  <input id="zy-nombre" className="form-control py-3" name="nombre"
                    autoComplete="name" value={form.nombre} onChange={cambiar} required />
                </div>

                <div className="col-sm-6">
                  <label className="zy-cont-label" htmlFor="zy-empresa">{t('cont.label.empresa', 'Tu empresa')}</label>
                  <input id="zy-empresa" className="form-control py-3" name="empresa"
                    autoComplete="organization" value={form.empresa} onChange={cambiar} />
                </div>

                <div className="col-12">
                  <label className="zy-cont-label" htmlFor="zy-email">{t('cont.label.email', 'Correo electrónico')} *</label>
                  <input id="zy-email" className="form-control py-3" type="email" name="email"
                    autoComplete="email" value={form.email} onChange={cambiar} required />
                </div>

                <div className="col-12">
                  <label className="zy-cont-label" htmlFor="zy-servicio">{t('cont.label.servicio', '¿Qué necesitas?')} *</label>
                  <select id="zy-servicio" className="form-select py-3" name="servicio"
                    value={form.servicio} onChange={cambiar} required>
                    <option value="">{t('cont.servicio.vacio', 'Selecciona un servicio')}</option>
                    {/* ⚠️ El `value` es el texto en ESPAÑOL y no el slug: es lo que
                        se lee en el correo, y «plataforma-saas» no se lee. */}
                    {SERVICIOS.map(([slug, texto]) => (
                      <option key={slug} value={texto}>{t(`cont.op.${slug}`, texto)}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  {/* ⚠️ Etiqueta VISIBLE, no solo `placeholder`: el placeholder
                      desaparece al escribir, y al repasar el formulario antes de
                      enviarlo el usuario ya no sabe qué campo es cuál. */}
                  <label className="zy-cont-label" htmlFor="zy-mensaje">{t('cont.label.mensaje', 'Cuéntanos tu proyecto')} *</label>
                  <textarea id="zy-mensaje" className="form-control py-3" name="mensaje" rows="5"
                    value={form.mensaje} onChange={cambiar} required
                    placeholder={t('cont.mensaje.pista', 'Cuántos usuarios, qué sistema usan hoy, qué les duele…')} />
                  <p className="zy-cont-ayuda">
                    {t('cont.ayuda', 'Mientras más contexto nos des, más concreta será la primera respuesta.')}
                  </p>
                </div>

                <div className="col-12">
                  <button type="submit" disabled={estado === 'enviando'}
                    className="zy-btn zy-btn-primario w-100">
                    {estado === 'enviando' ? t('cont.enviando', 'Enviando…') : t('cont.enviar', 'Enviar mensaje')}
                    {estado !== 'enviando' && <Icono nombre="flecha" size={18} className="zy-flecha" />}
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
