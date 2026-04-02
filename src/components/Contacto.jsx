import { useState } from 'react'

// ── Reemplaza este valor con tu Access Key de web3forms.com ──────────────────
const WEB3FORMS_KEY = 'd27d70b8-3963-46b4-aac4-7086a3d20f05'

export default function Contacto() {
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
      datos.append('Empresa', form.empresa || '—')
      datos.append('Servicio', form.servicio)
      datos.append('message', form.mensaje)

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: datos
      })

      const json = await res.json()

      if (json.success) {
        setEstado('ok')
        setForm({ nombre: '', empresa: '', email: '', servicio: '', mensaje: '' })
        setTimeout(() => setEstado(null), 5000)
      } else {
        setEstado('error')
      }
    } catch {
      setEstado('error')
    }
  }

  const inputEstilo = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#f1f5f9',
    borderRadius: '10px'
  }

  return (
    <section id="contacto" style={{ background: '#0a0a14', padding: '5rem 0' }}>
      <div className="container-fluid px-4 px-lg-5 w-100">

        <div className="text-center mb-5">
          <p className="text-uppercase fw-semibold mb-2" style={{ color: '#60a5fa', letterSpacing: '2px', fontSize: '0.85rem' }}>
            Hablemos
          </p>
          <h2 className="fw-black mb-3" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#f1f5f9' }}>
            Agenda tu consulta gratuita
          </h2>
          <p className="mx-auto" style={{ color: '#94a3b8', maxWidth: '500px', fontSize: '1.05rem' }}>
            Cuéntanos tu proyecto y te respondemos en menos de 24 horas
          </p>
        </div>

        <div className="row g-5">

          {/* Información de contacto */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4">
              {[
                { icono: '📧', titulo: 'Correo electrónico', valor: 'info@zyntello.com', href: 'mailto:info@zyntello.com' },
                { icono: '📱', titulo: 'WhatsApp', valor: '+1 829 639 9877', href: 'https://wa.me/18296399877' },
                { icono: '🌎', titulo: 'Cobertura', valor: 'RD · Venezuela · Colombia · Guatemala · Costa Rica · Soporte remoto', href: null },
                { icono: '🕐', titulo: 'Horario de atención', valor: 'Lun - Vie: 8am - 6pm (AST)', href: null },
              ].map((item, i) => (
                <div key={i} className="d-flex align-items-start gap-3">
                  <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>{item.icono}</div>
                  <div>
                    <div className="fw-semibold mb-1" style={{ color: '#f1f5f9', fontSize: '0.9rem' }}>{item.titulo}</div>
                    {item.href
                      ? <a href={item.href} style={{ color: '#60a5fa', fontSize: '0.95rem', textDecoration: 'none' }}>{item.valor}</a>
                      : <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{item.valor}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div className="col-lg-8">
            <form onSubmit={enviar}>

              {/* Mensajes de estado */}
              {estado === 'ok' && (
                <div className="alert mb-4 rounded-3" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                  ✅ ¡Mensaje enviado correctamente! Te contactaremos en menos de 24 horas.
                </div>
              )}
              {estado === 'error' && (
                <div className="alert mb-4 rounded-3" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                  ❌ Error al enviar. Por favor escríbenos directamente a <a href="mailto:info@zyntello.com" style={{ color: '#f87171' }}>info@zyntello.com</a>
                </div>
              )}

              <div className="row g-3">
                <div className="col-sm-6">
                  <input className="form-control py-3" style={inputEstilo} name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={cambiar} required />
                </div>
                <div className="col-sm-6">
                  <input className="form-control py-3" style={inputEstilo} name="empresa" placeholder="Tu empresa" value={form.empresa} onChange={cambiar} />
                </div>
                <div className="col-12">
                  <input className="form-control py-3" style={inputEstilo} type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={cambiar} required />
                </div>
                <div className="col-12">
                  <select className="form-select py-3" style={{ ...inputEstilo }} name="servicio" value={form.servicio} onChange={cambiar} required>
                    <option value="" style={{ background: '#0f172a' }}>Selecciona un servicio</option>
                    <option value="Consultoría ERP" style={{ background: '#0f172a' }}>Consultoría ERP (Softland / Profit)</option>
                    <option value="Soluciones a la Medida" style={{ background: '#0f172a' }}>Soluciones a la Medida</option>
                    <option value="Inteligencia Artificial" style={{ background: '#0f172a' }}>Inteligencia Artificial</option>
                    <option value="Servicio Técnico" style={{ background: '#0f172a' }}>Servicio Técnico</option>
                    <option value="Venta de Equipos" style={{ background: '#0f172a' }}>Asesoría y Venta de Equipos</option>
                    <option value="Consultoría Contable" style={{ background: '#0f172a' }}>Consultoría Contable</option>
                    <option value="Marketing Digital" style={{ background: '#0f172a' }}>Marketing Digital</option>
                    <option value="Consultoría Electoral" style={{ background: '#0f172a' }}>Consultoría Electoral & Política</option>
                    <option value="Encuestas y Estudios" style={{ background: '#0f172a' }}>Encuestas & Estudios de Mercado</option>
                    <option value="Migración Cloud" style={{ background: '#0f172a' }}>Migración a la Nube / Cloud</option>
                    <option value="Transformación Digital" style={{ background: '#0f172a' }}>Consultoría y Transformación Digital</option>
                  </select>
                </div>
                <div className="col-12">
                  <textarea className="form-control py-3" style={inputEstilo} name="mensaje" placeholder="Cuéntanos tu proyecto..." rows="5" value={form.mensaje} onChange={cambiar} required></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" disabled={estado === 'enviando'}
                    className="btn btn-primary btn-lg w-100 fw-semibold rounded-3 py-3">
                    {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje →'}
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
