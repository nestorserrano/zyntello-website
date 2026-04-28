import { useState, useEffect, useRef } from 'react'
import '../styles/Soluciones.css'

const NUMERO_WA = '18296399877'
const API_URL   = 'https://admin.zyntello.com/api/modulos'

/* ─── Datos de display estáticos por slug ──────────────────────
   El admin controla precios, contenido y orden.
   Estos datos enriquecen la presentación visual de módulos conocidos.
   Los módulos nuevos usan la plantilla genérica.
────────────────────────────────────────────────────────────────── */
const DISPLAY_ESTATICO = {
  crm:          { icono: '🤝', rating: 4.8, reviews: 124, etiqueta: 'Popular',    previews: [{ label: 'Pipeline', icon: '📊' }, { label: 'Contactos', icon: '👥' }, { label: 'Reportes', icon: '📈' }], categoria: 'Negocios' },
  proyectos:    { icono: '📋', rating: 4.7, reviews: 89,  etiqueta: 'Nuevo',      previews: [{ label: 'Kanban', icon: '🗂️' }, { label: 'Gantt', icon: '📅' }, { label: 'Equipo', icon: '👤' }],      categoria: 'Productividad' },
  tareas:       { icono: '✅', rating: 4.6, reviews: 67,  etiqueta: null,          previews: [{ label: 'Mis Tareas', icon: '📝' }, { label: 'Calendario', icon: '🗓️' }, { label: 'Progreso', icon: '📊' }], categoria: 'Productividad' },
  facturacion:  { icono: '🧾', rating: 4.9, reviews: 203, etiqueta: 'Destacado',  previews: [{ label: 'Facturas', icon: '🧾' }, { label: 'Cobros', icon: '💰' }, { label: 'Fiscal', icon: '📑' }],     categoria: 'Finanzas' },
  inventario:   { icono: '📦', rating: 4.7, reviews: 156, etiqueta: null,          previews: [{ label: 'Stock', icon: '📦' }, { label: 'Almacenes', icon: '🏭' }, { label: 'Movimientos', icon: '🔄' }], categoria: 'Logística' },
  encuestas:    { icono: '📊', rating: 4.8, reviews: 91,  etiqueta: 'Nuevo',      previews: [{ label: 'Constructor', icon: '🛠️' }, { label: 'Resultados', icon: '📊' }, { label: 'Reportes', icon: '📄' }], categoria: 'Analítica' },
  contabilidad: { icono: '📒', rating: 4.8, reviews: 74,  etiqueta: 'Nuevo',      previews: [{ label: 'Asientos', icon: '📒' }, { label: 'Balances', icon: '⚖️' }, { label: 'Fiscal', icon: '🏛️' }],    categoria: 'Finanzas' },
  condominios:  { icono: '🏢', rating: 4.9, reviews: 52,  etiqueta: 'Destacado',  previews: [{ label: 'Propietarios', icon: '🏘️' }, { label: 'Cuotas', icon: '💳' }, { label: 'Reportes', icon: '📊' }], categoria: 'Servicios' },
  constructflow:{ icono: '🏗️', rating: 4.9, reviews: 47,  etiqueta: 'Disponible', previews: [{ label: 'Obras', icon: '🏗️' }, { label: 'Presupuesto', icon: '💰' }, { label: 'Avance', icon: '📊' }],    categoria: 'Construcción' },
  restaurante:  { icono: '🍽️', rating: 4.7, reviews: 31,  etiqueta: 'Nuevo',      previews: [{ label: 'Mesas', icon: '🪑' }, { label: 'Cocina', icon: '👨‍🍳' }, { label: 'Cierre', icon: '💵' }],         categoria: 'Hostelería' },
  doctores:     { icono: '🩺', rating: 4.8, reviews: 28,  etiqueta: 'Nuevo',      previews: [{ label: 'Agenda', icon: '📅' }, { label: 'Expedientes', icon: '📋' }, { label: 'Recetas', icon: '💊' }],    categoria: 'Salud' },
}

const DISPLAY_DEFAULT = { icono: '⚡', rating: 4.5, reviews: 10, etiqueta: null, previews: [], categoria: 'Módulo' }

/* Datos estáticos completos como fallback si el API falla */
const APPS_FALLBACK = [
  { id: 'crm',          nombre: 'CRM',           subtitulo: 'Gestión de Clientes y Ventas',          descripcion: 'Administra tu pipeline de ventas, historial de clientes y oportunidades comerciales desde un solo lugar.', precio: 29,  precioAnual: 24, color: '#3b82f6', gradiente: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #60a5fa 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/crm',          caracteristicas: ['Pipeline de ventas visual Kanban', 'Historial completo de interacciones', 'Gestión de contactos y empresas', 'Reportes y métricas de ventas', 'Integración con WhatsApp y email'] },
  { id: 'proyectos',    nombre: 'Proyectos',      subtitulo: 'Gestión de Proyectos',                  descripcion: 'Planifica y ejecuta proyectos con tu equipo. Vistas Kanban y Gantt, asignación de recursos y control de tiempos.', precio: 19,  precioAnual: 15, color: '#8b5cf6', gradiente: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 60%, #a78bfa 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/proyectos',    caracteristicas: ['Tablero Kanban y diagrama Gantt', 'Asignación de tareas y responsables', 'Control de tiempos y progreso', 'Alertas y notificaciones automáticas', 'Reportes de avance ejecutivo'] },
  { id: 'tareas',       nombre: 'Tareas',         subtitulo: 'Gestión de Tareas del Equipo',          descripcion: 'Organiza las tareas de tu equipo con prioridades, fechas límite y seguimiento de estado.', precio: 12,  precioAnual: 9,  color: '#f59e0b', gradiente: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #fcd34d 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/tareas',       caracteristicas: ['Listas y tableros personalizados', 'Prioridades y fechas límite', 'Asignación de responsables', 'Comentarios y archivos adjuntos', 'Recordatorios automáticos'] },
  { id: 'facturacion',  nombre: 'Facturación',    subtitulo: 'Facturación y Cobros',                  descripcion: 'Emite facturas profesionales, gestiona cobros y controla tus ingresos con soporte para RD, Venezuela, Colombia y LATAM.', precio: 25,  precioAnual: 20, color: '#10b981', gradiente: 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #34d399 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/facturacion',  caracteristicas: ['Emisión de facturas y recibos', 'Control de cuentas por cobrar', 'Reportes fiscales y contables', 'Múltiples monedas y tasas', 'Portal de pago para clientes'] },
  { id: 'inventario',   nombre: 'Inventario',     subtitulo: 'Control de Inventario y Stock',         descripcion: 'Controla tu stock en tiempo real, gestiona entradas y salidas, define puntos de reorden y genera reportes de movimiento.', precio: 22,  precioAnual: 18, color: '#ef4444', gradiente: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #f87171 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/inventario',   caracteristicas: ['Control de stock en tiempo real', 'Gestión de entradas y salidas', 'Alertas de reorden automáticas', 'Múltiples almacenes y bodegas', 'Reportes de rotación y valorización'] },
  { id: 'encuestas',    nombre: 'Encuestas',      subtitulo: 'Encuestas y Estadísticas',              descripcion: 'Crea encuestas personalizadas, recopila respuestas en tiempo real y obtén estadísticas automáticas para tomar decisiones.', precio: 18,  precioAnual: 14, color: '#0ea5e9', gradiente: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 60%, #38bdf8 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/encuestas',    caracteristicas: ['Constructor de encuestas drag & drop', 'Tipos: opción múltiple, escala, NPS', 'Enlace público y código embebido', 'Resultados en tiempo real con gráficas', 'Exportación a Excel y PDF'] },
  { id: 'contabilidad', nombre: 'Contabilidad',   subtitulo: 'Gestión Contable y Financiera',         descripcion: 'Lleva la contabilidad de tu empresa con plan de cuentas, asientos diarios, estados financieros y cumplimiento fiscal.', precio: 32,  precioAnual: 26, color: '#14b8a6', gradiente: 'linear-gradient(135deg, #134e4a 0%, #0f766e 60%, #2dd4bf 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/contabilidad',  caracteristicas: ['Plan de cuentas personalizable', 'Asientos contables y libro diario', 'Balance general y estado de resultados', 'Reportes fiscales por país (RD, CO, MX, VE)', 'Conciliación bancaria automatizada'] },
  { id: 'condominios',  nombre: 'Condominios',    subtitulo: 'Gestión de Condominios y Residencias',  descripcion: 'Administra residenciales, edificios y condominios con control de cuotas, propietarios, mantenimiento y comunicación.', precio: 35,  precioAnual: 28, color: '#f97316', gradiente: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 60%, #fb923c 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/condominios',  caracteristicas: ['Registro de propietarios e inquilinos', 'Cobro y control de cuotas de mantenimiento', 'Reserva y gestión de áreas comunes', 'Órdenes de trabajo y mantenimiento', 'Comunicados y avisos a residentes'] },
  { id: 'constructflow',nombre: 'ConstructFlow',  subtitulo: 'Gestión de Obras y Construcción',       descripcion: 'Planifica y ejecuta proyectos de construcción con control de presupuesto, avance de obra, materiales y subcontratistas.', precio: 49,  precioAnual: 39, color: '#d97706', gradiente: 'linear-gradient(135deg, #78350f 0%, #b45309 60%, #d97706 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/constructflow', caracteristicas: ['Gestión de proyectos y frentes de obra', 'Control presupuestario y costos reales', 'Inventario de materiales y equipos', 'Cronograma y avance por etapas', 'Informes de progreso para clientes'] },
  { id: 'restaurante',  nombre: 'Restaurante',    subtitulo: 'Sistema POS para Restaurantes',         descripcion: 'Sistema completo para restaurantes, cafeterías y bares. Mesas, comandas, cocina, delivery, inventario y cierre de caja.', precio: 29,  precioAnual: 23, color: '#e11d48', gradiente: 'linear-gradient(135deg, #881337 0%, #be123c 60%, #fb7185 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/restaurante',   caracteristicas: ['Gestión de mesas y comandas en tiempo real', 'Pantalla de cocina (KDS)', 'Control de inventario y recetas', 'Delivery y take-away integrado', 'Reportes de ventas y cierre de caja'] },
  { id: 'doctores',     nombre: 'Doctores',       subtitulo: 'Gestión de Consultorios y Clínicas',    descripcion: 'Agenda citas, gestiona expedientes clínicos, recetas, historial del paciente y factura consultas con seguridad y privacidad.', precio: 29,  precioAnual: 23, color: '#06b6d4', gradiente: 'linear-gradient(135deg, #164e63 0%, #0891b2 60%, #22d3ee 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/doctores',      caracteristicas: ['Agenda de citas y recordatorios automáticos', 'Expediente clínico electrónico', 'Recetas y órdenes de laboratorio', 'Control de historias clínicas', 'Facturación de consultas y seguros'] },
]

const APP_SUITE = {
  id: 'suite',
  icono: '🚀',
  nombre: 'Suite Completa',
  subtitulo: 'Las 8 apps en un solo plan',
  desarrollador: 'Zyntello',
  categoria: 'Bundle',
  descripcion: 'Accede a todas las microaplicaciones Zyntello en un solo plan con descuento especial y soporte prioritario.',
  caracteristicas: [
    'CRM – Gestión de clientes y ventas',
    'Proyectos – Kanban y Gantt',
    'Tareas – Gestión de equipo',
    'Facturación – Facturas y cobros',
    'Inventario – Control de stock',
    'Encuestas – Estadísticas y reportes',
    'Contabilidad – Estados financieros y fiscal',
    'Condominios – Administración residencial',
    'ConstructFlow – Gestión de obras y construcción',
    'Restaurante – POS para restaurantes',
    'Doctores – Consultorios y expedientes clínicos',
    'Soporte prioritario incluido',
    '1 usuario incluido · +$5 por usuario adicional'
  ],
  precio: 129,
  precioAnual: 105,
  ahorroAnual: '2 MESES GRATIS',
  color: '#8b5cf6',
  gradiente: 'linear-gradient(135deg, #1e3a8a 0%, #4c1d95 50%, #7c3aed 100%)',
  rating: 5.0,
  reviews: 38,
  etiqueta: 'Mejor valor',
  previews: []
}

/* ─── Convierte color hex a gradiente CSS ──────────────────────── */
function hexToGradiente(hex) {
  try {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const dark  = `rgb(${Math.round(r * 0.28)},${Math.round(g * 0.28)},${Math.round(b * 0.28)})`
    const light = `rgb(${Math.min(255, Math.round(r * 1.55))},${Math.min(255, Math.round(g * 1.55))},${Math.min(255, Math.round(b * 1.55))})`
    return `linear-gradient(135deg, ${dark} 0%, ${hex} 60%, ${light} 100%)`
  } catch {
    return 'linear-gradient(135deg, #1e293b 0%, #7c3aed 60%, #a78bfa 100%)'
  }
}

/* ─── Badge por estado (desde admin) ─────────────────────────── */
const ESTADO_BADGE = {
  proximo:   { texto: 'Próximamente', bg: 'rgba(63,63,70,0.92)',   color: '#a1a1aa' },
  nuevo:     { texto: 'Nuevo',        bg: 'rgba(20,83,45,0.92)',   color: '#86efac' },
  destacado: { texto: 'Destacado',    bg: 'rgba(120,53,15,0.92)',  color: '#fcd34d' },
}

/* ─── Combina datos del API con display estático ──────────────── */
function combinarModulo(apiData) {
  const display   = DISPLAY_ESTATICO[apiData.slug] || DISPLAY_DEFAULT
  const color     = apiData.color_primario || '#7c3aed'
  const gradiente = hexToGradiente(color)
  const ahorroPct = apiData.ahorro_pct > 0 ? `AHORRA ${apiData.ahorro_pct}%` : null

  const estado     = apiData.estado || 'activo'
  const disponible = apiData.disponible !== false
  const etiquetaEstado = ESTADO_BADGE[estado] ? ESTADO_BADGE[estado].texto : null
  const etiqueta = estado === 'activo' ? display.etiqueta : etiquetaEstado

  return {
    id:             apiData.slug,
    icono:          display.icono,
    nombre:         apiData.nombre,
    subtitulo:      apiData.subtitulo || '',
    descripcion:    apiData.descripcion || '',
    caracteristicas:Array.isArray(apiData.caracteristicas) ? apiData.caracteristicas : [],
    precio:         apiData.precio_mensual,
    precioAnual:    apiData.precio_mensual_anual,
    ahorroAnual:    ahorroPct,
    color,
    gradiente,
    rating:         display.rating,
    reviews:        display.reviews,
    etiqueta,
    etiquetaBadge:  ESTADO_BADGE[estado] || null,
    disponible,
    url:            apiData.url || `https://app.zyntello.com/demo/${apiData.slug}`,
    previews:       display.previews || [],
    categoria:      display.categoria,
    desarrollador:  'Zyntello',
  }
}

/* ─── Stars ─────────────────────────────────────────────────────── */
function Estrellas({ rating }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : '#1e293b', fontSize: '0.78rem' }}>★</span>
      ))}
      <span style={{ color: '#475569', fontSize: '0.68rem', marginLeft: '4px' }}>{rating}</span>
    </span>
  )
}

/* ─── Previews ──────────────────────────────────────────────────── */
function Previews({ app }) {
  if (!app.previews || app.previews.length === 0) return null
  return (
    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
      {app.previews.map((p, i) => (
        <div key={i} style={{
          minWidth: '110px', height: '72px', borderRadius: '8px', flexShrink: 0,
          background: `linear-gradient(135deg, ${app.color}18 0%, ${app.color}33 100%)`,
          border: `1px solid ${app.color}30`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '5px'
        }}>
          <span style={{ fontSize: '1.3rem' }}>{p.icon}</span>
          <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 500 }}>{p.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Monedas ───────────────────────────────────────────────────── */
const MONEDAS_INFO = {
  USD: { nombre: 'Dólar',      simbolo: '$',    bandera: '🇺🇸' },
  DOP: { nombre: 'Peso Dom.',  simbolo: 'RD$',  bandera: '🇩🇴' },
  COP: { nombre: 'Peso Col.',  simbolo: '$',    bandera: '🇨🇴' },
  MXN: { nombre: 'Peso Mex.', simbolo: '$',    bandera: '🇲🇽' },
  VES: { nombre: 'Bolívar',   simbolo: 'Bs.',  bandera: '🇻🇪' },
}

const APP_CHECKOUT_URL = 'https://app.zyntello.com/checkout'

/* ─── Modal de Registro + Pago ──────────────────────────────────── */
function ModalApp({ app, onClose, formatPrecio, simbolo }) {
  const [plan, setPlan]     = useState('mensual')
  const [paso, setPaso]     = useState(1)
  const [form, setForm]     = useState({ nombre: '', empresa: '', email: '', telefono: '' })
  const [metodo, setMetodo] = useState('stripe')
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores]   = useState({})

  const precioUSD = plan === 'mensual' ? app.precio : app.precioAnual
  const precio    = precioUSD

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.telefono.trim()) e.telefono = 'Requerido'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validar()) return
    setPaso(3)
  }

  const irAlPago = () => {
    const params = new URLSearchParams({
      modulo:   app.id,
      plan,
      nombre:   form.nombre,
      email:    form.email,
      empresa:  form.empresa || '',
      telefono: form.telefono,
      metodo,
    })
    window.location.href = `${APP_CHECKOUT_URL}?${params.toString()}`
  }

  return (
    <div className="sol-overlay" onClick={onClose}>
      <div className="sol-modal" onClick={e => e.stopPropagation()}>
        <div style={{ background: app.gradiente, borderRadius: '12px 12px 0 0', padding: '22px 24px', position: 'relative', flexShrink: 0 }}>
          <button onClick={onClose} className="sol-modal-close">✕</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.18)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', backdropFilter: 'blur(6px)' }}>
              {app.icono}
            </div>
            <div>
              <h3 style={{ color: '#fff', margin: 0, fontWeight: 800, fontSize: '1.15rem' }}>{app.nombre}</h3>
              <p style={{ color: 'rgba(255,255,255,0.72)', margin: '2px 0 4px', fontSize: '0.8rem' }}>{app.subtitulo}</p>
              <Estrellas rating={app.rating} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            {['Plan', 'Datos', 'Pago'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', fontSize: '0.7rem', fontWeight: 700, background: paso > i + 1 ? '#fff' : paso === i + 1 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)', color: paso > i + 1 ? app.color : paso === i + 1 ? '#1e293b' : 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {paso > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ color: paso === i + 1 ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>{label}</span>
                {i < 2 && <span style={{ color: 'rgba(255,255,255,0.28)', margin: '0 2px' }}>›</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1 }}>
          {paso === 1 && (
            <>
              <h5 className="sol-modal-title">Elige tu plan</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
                {[
                  { key: 'mensual', label: 'Mensual', monto: app.precio,      nota: null },
                  { key: 'anual',   label: 'Anual',   monto: app.precioAnual, nota: app.ahorroAnual }
                ].map(p => (
                  <div key={p.key} onClick={() => setPlan(p.key)} className="sol-plan-card"
                    style={{ border: `2px solid ${plan === p.key ? app.color : 'rgba(255,255,255,0.08)'}`, background: plan === p.key ? `${app.color}15` : 'rgba(255,255,255,0.02)' }}>
                    {p.nota && <span className="sol-plan-badge" style={{ background: app.color }}>{p.nota}</span>}
                    <div style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '6px' }}>{p.label}</div>
                    <div style={{ color: app.color, fontSize: '1.45rem', fontWeight: 800, lineHeight: 1 }}>
                      {simbolo} {formatPrecio(p.monto)}
                      <span style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 400 }}>/mes</span>
                    </div>
                    {p.key === 'anual' && <div style={{ color: '#475569', fontSize: '0.68rem', marginTop: '4px' }}>Facturado anualmente</div>}
                  </div>
                ))}
              </div>
              <h5 className="sol-modal-title">¿Qué incluye?</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px' }}>
                {app.caracteristicas.map((c, i) => (
                  <li key={i} style={{ color: '#94a3b8', fontSize: '0.86rem', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: app.color, flexShrink: 0, marginTop: '1px' }}>✓</span>
                    {c}
                  </li>
                ))}
              </ul>
              <button onClick={() => setPaso(2)}
                style={{ width: '100%', padding: '13px', background: app.color, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                Continuar → Mis datos
              </button>
            </>
          )}

          {paso === 2 && (
            <form onSubmit={handleSubmit} noValidate>
              <h5 className="sol-modal-title">Datos de registro</h5>
              {[
                { key: 'nombre',   label: 'Nombre completo',      type: 'text',  placeholder: 'Tu nombre completo',  required: true },
                { key: 'empresa',  label: 'Empresa (opcional)',    type: 'text',  placeholder: 'Nombre de tu empresa', required: false },
                { key: 'email',    label: 'Correo electrónico',    type: 'email', placeholder: 'correo@empresa.com',   required: true },
                { key: 'telefono', label: 'Teléfono / WhatsApp',   type: 'tel',   placeholder: '+1 809 000 0000',      required: true }
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ color: '#64748b', fontSize: '0.78rem', display: 'block', marginBottom: '5px' }}>
                    {f.label} {f.required && <span style={{ color: app.color }}>*</span>}
                  </label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setErrores({ ...errores, [f.key]: null }) }}
                    style={{ width: '100%', padding: '10px 14px', boxSizing: 'border-box', background: errores[f.key] ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${errores[f.key] ? '#ef4444' : 'rgba(255,255,255,0.09)'}`, borderRadius: '6px', color: '#f1f5f9', fontSize: '0.88rem', outline: 'none' }}
                  />
                  {errores[f.key] && <span style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errores[f.key]}</span>}
                </div>
              ))}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '12px 14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '0.83rem' }}>{app.nombre} · Plan {plan}</span>
                  <span style={{ color: app.color, fontWeight: 800, fontSize: '1rem' }}>
                    {simbolo} {formatPrecio(precio)}<span style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 400 }}>/mes</span>
                  </span>
                </div>
                <div style={{ color: '#334155', fontSize: '0.7rem', marginTop: '4px' }}>Sin permanencia · Cancela cuando quieras</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setPaso(1)}
                  style={{ flex: '0 0 auto', padding: '11px 15px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}>
                  ← Volver
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '11px', background: app.color, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                  Elegir método de pago →
                </button>
              </div>
            </form>
          )}

          {paso === 3 && (
            <>
              <h5 className="sol-modal-title">Método de pago</h5>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '0.83rem' }}>{app.nombre} · Plan {plan}</span>
                  <span style={{ color: app.color, fontWeight: 800, fontSize: '1rem' }}>
                    {simbolo} {formatPrecio(precio)}<span style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 400 }}>/mes</span>
                  </span>
                </div>
                <div style={{ color: '#334155', fontSize: '0.7rem', marginTop: '4px' }}>Sin permanencia · Cancela cuando quieras</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
                {[
                  { key: 'stripe',  icono: '💳', label: 'Tarjeta de crédito / débito',  sub: 'Visa, Mastercard, Amex — powered by Stripe' },
                  { key: 'paypal',  icono: '🅿️', label: 'PayPal',                        sub: 'Paga con tu cuenta PayPal o tarjeta' },
                  { key: 'cripto',  icono: '₿',  label: 'Criptomonedas',                 sub: 'USDT (TRC-20 / ERC-20) · USDC · BTC' },
                ].map(m => (
                  <div key={m.key} onClick={() => setMetodo(m.key)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 15px', borderRadius: '8px', cursor: 'pointer', border: `2px solid ${metodo === m.key ? app.color : 'rgba(255,255,255,0.08)'}`, background: metodo === m.key ? `${app.color}15` : 'rgba(255,255,255,0.02)', transition: 'all 0.15s' }}>
                    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{m.icono}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.9rem' }}>{m.label}</div>
                      <div style={{ color: '#475569', fontSize: '0.7rem', marginTop: '2px' }}>{m.sub}</div>
                    </div>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${metodo === m.key ? app.color : 'rgba(255,255,255,0.18)'}`, background: metodo === m.key ? app.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {metodo === m.key && <span style={{ color: '#fff', fontSize: '0.58rem', fontWeight: 900 }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setPaso(2)}
                  style={{ flex: '0 0 auto', padding: '11px 15px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}>
                  ← Volver
                </button>
                <button type="button" onClick={irAlPago}
                  style={{ flex: 1, padding: '11px', background: app.color, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                  {metodo === 'stripe'  && '💳 Ir al pago con tarjeta →'}
                  {metodo === 'paypal'  && '🅿️ Ir al pago con PayPal →'}
                  {metodo === 'cripto'  && '₿ Ver instrucciones cripto →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── ParticleBackground (scroll-reactive) ──────────────────────── */
function ParticleBackground({ sectionRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animId
    let particles = []
    let scrollProgress = 0

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const initParticles = () => {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 7000)
      for (let i = 0; i < Math.min(count, 80); i++) {
        particles.push({
          x:       Math.random() * canvas.width,
          y:       Math.random() * canvas.height,
          vx:      (Math.random() - 0.5) * 0.35,
          vy:      (Math.random() - 0.5) * 0.35,
          r:       Math.random() * 1.8 + 0.4,
          opacity: Math.random() * 0.5 + 0.15,
        })
      }
    }

    const onScroll = () => {
      const section = sectionRef?.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      scrollProgress = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const speed = 1 + scrollProgress * 1.8

      particles.forEach(p => {
        p.x += p.vx * speed
        p.y += p.vy * speed
        if (p.x < 0)            p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0)            p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,92,246,${p.opacity})`
        ctx.fill()
      })

      /* conexiones */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 130) * 0.12})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    initParticles()
    draw()

    const handleResize = () => { resize(); initParticles() }
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [sectionRef])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  )
}

/* ─── Componente principal ──────────────────────────────────────── */
export default function Soluciones() {
  const sectionRef = useRef(null)
  const [modalApp, setModalApp] = useState(null)
  const [moneda, setMoneda]     = useState('USD')
  const [rates, setRates]       = useState(null)
  const [apps, setApps]         = useState(APPS_FALLBACK)
  const [apiCargada, setApiCargada] = useState(false)

  /* Tasas de cambio */
  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(data => setRates(data.rates))
      .catch(() => {})
  }, [])

  /* Módulos dinámicos desde admin */
  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setApps(data.map(combinarModulo))
          setApiCargada(true)
        }
      })
      .catch(() => {})
  }, [])

  const infoMoneda = MONEDAS_INFO[moneda]
  const simbolo    = infoMoneda.simbolo

  const formatPrecio = (usd) => {
    if (!rates || !rates[moneda]) return usd.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return (usd * rates[moneda]).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <>
      <section id="soluciones" className="sol-section" ref={sectionRef}>
        <ParticleBackground sectionRef={sectionRef} />

        <div className="container-fluid px-4 px-lg-5 sol-content">

          {/* Terminal Header */}
          <div className="sol-terminal-header">
            <div className="sol-terminal-bar">
              <div className="sol-terminal-dots">
                <span className="sol-dot sol-dot-red" />
                <span className="sol-dot sol-dot-yellow" />
                <span className="sol-dot sol-dot-green" />
              </div>
              <span className="sol-terminal-title">zyntello — módulos SaaS</span>
              <span className="sol-terminal-status">{apps.length} módulos · v2.0</span>
            </div>
            <div className="sol-terminal-body">
              <p className="sol-terminal-line">
                <span className="sol-prompt">$</span>
                <span className="sol-cmd"> zyntello</span>
                <span className="sol-arg"> --list-modules</span>
                <span className="sol-arg2"> --show-pricing</span>
              </p>
              <p className="sol-terminal-subtitle">
                Microaplicaciones empresariales listas para usar. Sin instalaciones, acceso desde cualquier dispositivo y soporte incluido.
              </p>
              <div className="sol-module-tags">
                {apps.map(a => (
                  <span key={a.id} className="sol-module-tag">
                    <span style={{ color: a.color }}>{a.icono}</span> {a.nombre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Callout personalización */}
          <div className="sol-callout">
            <span className="sol-callout-icon">🏗️</span>
            <div className="sol-callout-body">
              <div className="sol-callout-title">¿Necesitas más? Las personalizamos e instalamos en tu empresa</div>
              <p className="sol-callout-text">
                Todas estas soluciones pueden ser adaptadas a tus procesos, integradas con tus sistemas actuales e instaladas directamente en la infraestructura de tu empresa con módulos adicionales a la medida.
              </p>
            </div>
            <a href="#contacto" className="sol-callout-btn">Hablar con un asesor →</a>
          </div>

          {/* Selector de moneda */}
          <div className="sol-moneda-selector">
            <span className="sol-moneda-label"><span className="sol-prompt">$</span> moneda</span>
            <div className="sol-moneda-pills">
              {Object.entries(MONEDAS_INFO).map(([code, m]) => (
                <button key={code} onClick={() => setMoneda(code)} className={`sol-moneda-pill${moneda === code ? ' active' : ''}`}>
                  <span>{m.bandera}</span>
                  <span className="sol-moneda-code">{code}</span>
                  <span className="sol-moneda-nombre">{m.nombre}</span>
                </button>
              ))}
            </div>
            {!rates && <span className="sol-moneda-loading">⏳ cargando tasas…</span>}
          </div>

          {/* Banner Bundle */}
          <div className="sol-bundle-banner" onClick={() => setModalApp(APP_SUITE)}>
            <div className="sol-bundle-inner">
              <div className="sol-bundle-left">
                <div className="sol-bundle-title">
                  <span>🚀</span>
                  <span className="sol-bundle-name">Suite Completa Zyntello</span>
                  <span className="sol-bundle-badge">Mejor precio</span>
                </div>
                <p className="sol-bundle-desc">
                  {apps.map(a => a.nombre).join(' · ')} — todas las apps por un precio especial
                </p>
              </div>
              <div className="sol-bundle-right">
                <div className="sol-bundle-pricing">
                  <div className="sol-bundle-was">{simbolo} {formatPrecio(192)}/mes</div>
                  <div className="sol-bundle-price">
                    {simbolo} {formatPrecio(129)}<span className="sol-bundle-period">/mes</span>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); setModalApp(APP_SUITE) }} className="sol-bundle-btn">
                  Ver bundle →
                </button>
              </div>
            </div>
          </div>

          {/* Grid de apps */}
          <div className="sol-grid">
            {apps.map(app => (
              <div key={app.id} className="sol-card"
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${app.color}50`; e.currentTarget.style.boxShadow = `0 8px 32px ${app.color}18` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Terminal window bar */}
                <div className="sol-card-bar" style={{ borderBottomColor: `${app.color}30` }}>
                  <div className="sol-card-dots">
                    <span className="sol-dot" style={{ background: '#ff5f57' }} />
                    <span className="sol-dot" style={{ background: '#ffbd2e' }} />
                    <span className="sol-dot" style={{ background: '#28c840' }} />
                  </div>
                  <span className="sol-card-slug" style={{ color: app.color }}>{app.id}</span>
                  {app.etiqueta && (
                    <span className="sol-card-badge"
                      style={app.etiquetaBadge
                        ? { background: app.etiquetaBadge.bg, color: app.etiquetaBadge.color }
                        : { background: `${app.color}20`, color: app.color }}>
                      {app.etiqueta}
                    </span>
                  )}
                </div>

                {/* Horizontal content layout */}
                <div className="sol-card-content">
                  {/* Panel izquierdo */}
                  <div className="sol-card-left">
                    <div className="sol-card-icon" style={{ background: `${app.color}15`, border: `1px solid ${app.color}28` }}>
                      <span>{app.icono}</span>
                    </div>
                    <div className="sol-card-meta">
                      <h4 className="sol-card-name" style={{ color: app.color }}>{app.nombre}</h4>
                      <span className="sol-card-cat">{app.categoria}</span>
                      <Estrellas rating={app.rating} />
                      <span className="sol-card-reviews">({app.reviews})</span>
                    </div>
                  </div>

                  {/* Panel derecho */}
                  <div className="sol-card-right">
                    <p className="sol-card-desc">{app.descripcion}</p>
                    <ul className="sol-card-features">
                      {app.caracteristicas.slice(0, 3).map((c, ci) => (
                        <li key={ci}>
                          <span style={{ color: app.color }}>›</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer de la tarjeta */}
                <div className="sol-card-footer" style={{ borderTopColor: `${app.color}18` }}>
                  <div className="sol-card-price">
                    <span className="sol-price-main" style={{ color: app.color }}>
                      {simbolo} {formatPrecio(app.precio)}<span className="sol-price-period">/mes</span>
                    </span>
                    <span className="sol-price-annual">desde {simbolo} {formatPrecio(app.precioAnual)}/mes anual</span>
                  </div>
                  <div className="sol-card-actions">
                    {app.url && app.disponible !== false && (
                      <a href={app.url} target="_blank" rel="noopener noreferrer"
                        className="sol-btn-demo"
                        style={{ color: app.color, borderColor: `${app.color}40` }}>
                        Demo
                      </a>
                    )}
                    {app.disponible !== false ? (
                      <button onClick={() => setModalApp(app)} className="sol-btn-obtener"
                        style={{ background: app.color }}>
                        Obtener
                      </button>
                    ) : (
                      <span className="sol-btn-pronto">Próximamente</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="sol-footer-note">
            <p>
              Todas las aplicaciones incluyen actualizaciones continuas y soporte técnico.<br />
              <span>Sin contratos de permanencia · Cancela cuando quieras · Acceso inmediato tras el pago.</span>
            </p>
            <div className="sol-footer-badge">
              <span>🎁</span>
              <span>Plan anual — 2 meses gratis en todos los paquetes</span>
            </div>
          </div>

        </div>
      </section>

      {modalApp && <ModalApp app={modalApp} onClose={() => setModalApp(null)} formatPrecio={formatPrecio} simbolo={simbolo} />}
    </>
  )
}
