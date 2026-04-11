import { useState, useEffect } from 'react'
import '../styles/Soluciones.css'

const NUMERO_WA = '18296399877'

const apps = [
  {
    id: 'crm',
    icono: '🤝',
    nombre: 'CRM',
    subtitulo: 'Gestión de Clientes y Ventas',
    desarrollador: 'Zyntello',
    categoria: 'Negocios',
    descripcion: 'Administra tu pipeline de ventas, historial de clientes y oportunidades comerciales desde un solo lugar. Ideal para equipos de ventas de cualquier tamaño.',
    caracteristicas: [
      'Pipeline de ventas visual Kanban',
      'Historial completo de interacciones',
      'Gestión de contactos y empresas',
      'Reportes y métricas de ventas',
      'Integración con WhatsApp y email'
    ],
    precio: 29,
    precioAnual: 24,
    color: '#3b82f6',
    gradiente: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #60a5fa 100%)',
    rating: 4.8,
    reviews: 124,
    etiqueta: 'Popular',
    url: 'https://app.zyntello.com/crm',
    previews: [
      { label: 'Pipeline', icon: '📊' },
      { label: 'Contactos', icon: '👥' },
      { label: 'Reportes', icon: '📈' }
    ]
  },
  {
    id: 'proyectos',
    icono: '📋',
    nombre: 'Proyectos',
    subtitulo: 'Gestión de Proyectos',
    desarrollador: 'Zyntello',
    categoria: 'Productividad',
    descripcion: 'Planifica y ejecuta proyectos con tu equipo. Vistas Kanban y Gantt, asignación de recursos, control de tiempos y alertas de vencimiento.',
    caracteristicas: [
      'Tablero Kanban y diagrama Gantt',
      'Asignación de tareas y responsables',
      'Control de tiempos y progreso',
      'Alertas y notificaciones automáticas',
      'Reportes de avance ejecutivo'
    ],
    precio: 19,
    precioAnual: 15,
    color: '#8b5cf6',
    gradiente: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 60%, #a78bfa 100%)',
    rating: 4.7,
    reviews: 89,
    etiqueta: 'Nuevo',
    url: 'https://app.zyntello.com/proyectos',
    previews: [
      { label: 'Kanban', icon: '🗂️' },
      { label: 'Gantt', icon: '📅' },
      { label: 'Equipo', icon: '👤' }
    ]
  },
  {
    id: 'tareas',
    icono: '✅',
    nombre: 'Tareas',
    subtitulo: 'Gestión de Tareas del Equipo',
    desarrollador: 'Zyntello',
    categoria: 'Productividad',
    descripcion: 'Organiza las tareas de tu equipo con prioridades, fechas límite y seguimiento de estado. Simple, rápido y efectivo para equipos de cualquier tamaño.',
    caracteristicas: [
      'Listas y tableros personalizados',
      'Prioridades y fechas límite',
      'Asignación de responsables',
      'Comentarios y archivos adjuntos',
      'Recordatorios automáticos'
    ],
    precio: 12,
    precioAnual: 9,
    color: '#f59e0b',
    gradiente: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #fcd34d 100%)',
    rating: 4.6,
    reviews: 67,
    etiqueta: null,
    url: 'https://app.zyntello.com/tareas',
    previews: [
      { label: 'Mis Tareas', icon: '📝' },
      { label: 'Calendario', icon: '🗓️' },
      { label: 'Progreso', icon: '📊' }
    ]
  },
  {
    id: 'facturacion',
    icono: '🧾',
    nombre: 'Facturación',
    subtitulo: 'Facturación y Cobros',
    desarrollador: 'Zyntello',
    categoria: 'Finanzas',
    descripcion: 'Emite facturas profesionales, gestiona cobros y controla tus ingresos. Compatible con requerimientos fiscales de RD, Venezuela, Colombia y LATAM.',
    caracteristicas: [
      'Emisión de facturas y recibos',
      'Control de cuentas por cobrar',
      'Reportes fiscales y contables',
      'Múltiples monedas y tasas',
      'Portal de pago para clientes'
    ],
    precio: 25,
    precioAnual: 20,
    color: '#10b981',
    gradiente: 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #34d399 100%)',
    rating: 4.9,
    reviews: 203,
    etiqueta: 'Destacado',
    url: 'https://app.zyntello.com/facturacion',
    previews: [
      { label: 'Facturas', icon: '🧾' },
      { label: 'Cobros', icon: '💰' },
      { label: 'Fiscal', icon: '📑' }
    ]
  },
  {
    id: 'inventario',
    icono: '📦',
    nombre: 'Inventario',
    subtitulo: 'Control de Inventario y Stock',
    desarrollador: 'Zyntello',
    categoria: 'Logística',
    descripcion: 'Controla tu stock en tiempo real, gestiona entradas y salidas, define puntos de reorden y genera reportes de movimiento de inventario.',
    caracteristicas: [
      'Control de stock en tiempo real',
      'Gestión de entradas y salidas',
      'Alertas de reorden automáticas',
      'Múltiples almacenes y bodegas',
      'Reportes de rotación y valorización'
    ],
    precio: 22,
    precioAnual: 18,
    color: '#ef4444',
    gradiente: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #f87171 100%)',
    rating: 4.7,
    reviews: 156,
    etiqueta: null,
    url: 'https://app.zyntello.com/inventario',
    previews: [
      { label: 'Stock', icon: '📦' },
      { label: 'Almacenes', icon: '🏭' },
      { label: 'Movimientos', icon: '🔄' }
    ]
  },
  {
    id: 'encuestas',
    icono: '📊',
    nombre: 'Encuestas',
    subtitulo: 'Encuestas y Estadísticas',
    desarrollador: 'Zyntello',
    categoria: 'Analítica',
    descripcion: 'Crea encuestas personalizadas, recopila respuestas en tiempo real y obtén estadísticas y gráficas automáticas para tomar decisiones basadas en datos.',
    caracteristicas: [
      'Constructor de encuestas drag & drop',
      'Tipos de pregunta: opción múltiple, escala, abierta, NPS',
      'Enlace público y código embebido',
      'Resultados en tiempo real con gráficas',
      'Exportación a Excel y PDF',
      'Segmentación y filtros de respuestas'
    ],
    precio: 18,
    precioAnual: 14,
    color: '#0ea5e9',
    gradiente: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 60%, #38bdf8 100%)',
    rating: 4.8,
    reviews: 91,
    etiqueta: 'Nuevo',
    url: 'https://app.zyntello.com/encuestas',
    previews: [
      { label: 'Constructor', icon: '🛠️' },
      { label: 'Resultados', icon: '📊' },
      { label: 'Reportes', icon: '📄' }
    ]
  },
  {
    id: 'contabilidad',
    icono: '📒',
    nombre: 'Contabilidad',
    subtitulo: 'Gestión Contable y Financiera',
    desarrollador: 'Zyntello',
    categoria: 'Finanzas',
    descripcion: 'Lleva la contabilidad de tu empresa con plan de cuentas, asientos diarios, estados financieros y cumplimiento fiscal para RD, Colombia, México y Venezuela.',
    caracteristicas: [
      'Plan de cuentas personalizable',
      'Asientos contables y libro diario',
      'Balance general y estado de resultados',
      'Reportes fiscales por país (RD, CO, MX, VE)',
      'Conciliación bancaria automatizada',
      'Integración con Facturación e Inventario'
    ],
    precio: 32,
    precioAnual: 26,
    color: '#14b8a6',
    gradiente: 'linear-gradient(135deg, #134e4a 0%, #0f766e 60%, #2dd4bf 100%)',
    rating: 4.8,
    reviews: 74,
    etiqueta: 'Nuevo',
    url: 'https://app.zyntello.com/contabilidad',
    previews: [
      { label: 'Asientos', icon: '📒' },
      { label: 'Balances', icon: '⚖️' },
      { label: 'Fiscal', icon: '🏛️' }
    ]
  },
  {
    id: 'condominios',
    icono: '🏢',
    nombre: 'Condominios',
    subtitulo: 'Gestión de Condominios y Residencias',
    desarrollador: 'Zyntello',
    categoria: 'Servicios',
    descripcion: 'Administra residenciales, edificios y condominios con control de cuotas, propietarios, mantenimiento, mayordomía y comunicación con residentes.',
    caracteristicas: [
      'Registro de propietarios e inquilinos',
      'Cobro y control de cuotas de mantenimiento',
      'Reserva y gestión de áreas comunes',
      'Órdenes de trabajo y mantenimiento',
      'Comunicados y avisos a residentes',
      'Estado de cuenta por unidad habitacional'
    ],
    precio: 35,
    precioAnual: 28,
    color: '#f97316',
    gradiente: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 60%, #fb923c 100%)',
    rating: 4.9,
    reviews: 52,
    etiqueta: 'Destacado',
    url: 'https://app.zyntello.com/condominios',
    previews: [
      { label: 'Propietarios', icon: '🏘️' },
      { label: 'Cuotas', icon: '💳' },
      { label: 'Reportes', icon: '📊' }
    ]
  },
  {
    id: 'constructflow',
    icono: '🏗️',
    nombre: 'ConstructFlow',
    subtitulo: 'Gestión de Obras y Construcción',
    desarrollador: 'Zyntello',
    categoria: 'Construcción',
    descripcion: 'Planifica y ejecuta proyectos de construcción con control de presupuesto, avance de obra, materiales y subcontratistas en tiempo real.',
    caracteristicas: [
      'Gestión de proyectos y frentes de obra',
      'Control presupuestario y costos reales',
      'Inventario de materiales y equipos',
      'Cronograma y avance por etapas',
      'Informes de progreso para clientes'
    ],
    precio: 49,
    precioAnual: 39,
    color: '#d97706',
    gradiente: 'linear-gradient(135deg, #78350f 0%, #b45309 60%, #d97706 100%)',
    rating: 4.9,
    reviews: 47,
    etiqueta: 'Disponible',
    url: 'https://app.zyntello.com/constructflow',
    previews: [
      { label: 'Obras', icon: '🏗️' },
      { label: 'Presupuesto', icon: '💰' },
      { label: 'Avance', icon: '📊' }
    ]
  },
  {
    id: 'restaurante',
    icono: '🍽️',
    nombre: 'Restaurante',
    subtitulo: 'Sistema POS para Restaurantes',
    desarrollador: 'Zyntello',
    categoria: 'Hostelería',
    descripcion: 'Sistema completo para restaurantes, cafeterías y bares. Mesas, comandas, cocina, delivery, inventario y cierre de caja integrado.',
    caracteristicas: [
      'Gestión de mesas y comandas en tiempo real',
      'Pantalla de cocina (KDS)',
      'Control de inventario y recetas',
      'Delivery y take-away integrado',
      'Reportes de ventas y cierre de caja'
    ],
    precio: 29,
    precioAnual: 23,
    color: '#e11d48',
    gradiente: 'linear-gradient(135deg, #881337 0%, #be123c 60%, #fb7185 100%)',
    rating: 4.7,
    reviews: 31,
    etiqueta: 'Nuevo',
    url: 'https://app.zyntello.com/restaurante',
    previews: [
      { label: 'Mesas', icon: '🪑' },
      { label: 'Cocina', icon: '👨‍🍳' },
      { label: 'Cierre', icon: '💵' }
    ]
  },
  {
    id: 'doctores',
    icono: '🩺',
    nombre: 'Doctores',
    subtitulo: 'Gestión de Consultorios y Clínicas',
    desarrollador: 'Zyntello',
    categoria: 'Salud',
    descripcion: 'Agenda citas, gestiona expedientes clínicos, recetas, historial del paciente y factura consultas con total seguridad y privacidad.',
    caracteristicas: [
      'Agenda de citas y recordatorios automáticos',
      'Expediente clínico electrónico',
      'Recetas y órdenes de laboratorio',
      'Control de historias clínicas',
      'Facturación de consultas y seguros'
    ],
    precio: 29,
    precioAnual: 23,
    color: '#06b6d4',
    gradiente: 'linear-gradient(135deg, #164e63 0%, #0891b2 60%, #22d3ee 100%)',
    rating: 4.8,
    reviews: 28,
    etiqueta: 'Nuevo',
    url: 'https://app.zyntello.com/doctores',
    previews: [
      { label: 'Agenda', icon: '📅' },
      { label: 'Expedientes', icon: '📋' },
      { label: 'Recetas', icon: '💊' }
    ]
  }
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
  color: '#8b5cf6',
  gradiente: 'linear-gradient(135deg, #1e3a8a 0%, #4c1d95 50%, #7c3aed 100%)',
  rating: 5.0,
  reviews: 38,
  etiqueta: 'Mejor valor',
  previews: []
}

/* ─── Stars ─────────────────────────────────────────────── */
function Estrellas({ rating }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : '#334155', fontSize: '0.85rem' }}>★</span>
      ))}
      <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginLeft: '5px' }}>{rating}</span>
    </span>
  )
}

/* ─── Preview Screenshots ────────────────────────────────── */
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

/* ─── Monedas disponibles ───────────────────────────────── */
const MONEDAS_INFO = {
  USD: { nombre: 'Dólar',      simbolo: '$',    bandera: '🇺🇸' },
  DOP: { nombre: 'Peso Dom.',  simbolo: 'RD$',  bandera: '🇩🇴' },
  COP: { nombre: 'Peso Col.',  simbolo: '$',    bandera: '🇨🇴' },
  MXN: { nombre: 'Peso Mex.', simbolo: '$',    bandera: '🇲🇽' },
  VES: { nombre: 'Bolívar',   simbolo: 'Bs.',  bandera: '🇻🇪' },
}

/* ─── Modal de Registro y Pago ───────────────────────────── */
function ModalApp({ app, onClose, formatPrecio, simbolo }) {
  const [plan, setPlan] = useState('mensual')
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', telefono: '' })
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState({})

  const precioUSD = plan === 'mensual' ? app.precio : app.precioAnual
  const precio = precioUSD

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
    setEnviando(true)
    setTimeout(() => {
      setEnviando(false)
      setPaso(3)
    }, 1200)
  }

  const mensajeWA = encodeURIComponent(
    `Hola Zyntello! Quiero acceder a la app *${app.nombre}* — Plan ${plan} ($${precio}/mes).\nNombre: ${form.nombre}\nEmpresa: ${form.empresa}\nEmail: ${form.email}`
  )

  return (
    <div className="sol-overlay" onClick={onClose}>
      <div className="sol-modal" onClick={e => e.stopPropagation()}>

        {/* Header con gradiente */}
        <div style={{ background: app.gradiente, borderRadius: '16px 16px 0 0', padding: '22px 24px', position: 'relative', flexShrink: 0 }}>
          <button onClick={onClose} className="sol-modal-close">✕</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '60px', height: '60px', background: 'rgba(255,255,255,0.18)',
              borderRadius: '14px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.8rem', backdropFilter: 'blur(6px)'
            }}>
              {app.icono}
            </div>
            <div>
              <h3 style={{ color: '#fff', margin: 0, fontWeight: 800, fontSize: '1.2rem' }}>{app.nombre}</h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', margin: '2px 0 4px', fontSize: '0.82rem' }}>{app.subtitulo}</p>
              <Estrellas rating={app.rating} />
            </div>
          </div>

          {/* Pasos */}
          {paso < 3 && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
              {['Plan', 'Datos'].map((label, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', fontSize: '0.7rem', fontWeight: 700,
                    background: paso > i + 1 ? '#fff' : paso === i + 1 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
                    color: paso > i + 1 ? app.color : paso === i + 1 ? '#1e293b' : 'rgba(255,255,255,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {paso > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ color: paso === i + 1 ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{label}</span>
                  {i < 1 && <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 2px' }}>›</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cuerpo del modal */}
        <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1 }}>

          {/* Paso 1: Selección de plan */}
          {paso === 1 && (
            <>
              <h5 className="sol-modal-title">Elige tu plan</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
                {[
                  { key: 'mensual', label: 'Mensual', monto: app.precio, nota: null },
                  { key: 'anual', label: 'Anual', monto: app.precioAnual, nota: 'AHORRA 20%' }
                ].map(p => (
                  <div key={p.key} onClick={() => setPlan(p.key)} className="sol-plan-card"
                    style={{
                      border: `2px solid ${plan === p.key ? app.color : 'rgba(255,255,255,0.09)'}`,
                      background: plan === p.key ? `${app.color}15` : 'rgba(255,255,255,0.02)'
                    }}>
                    {p.nota && (
                      <span className="sol-plan-badge" style={{ background: app.color }}>{p.nota}</span>
                    )}
                    <div style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '6px' }}>{p.label}</div>
                    <div style={{ color: app.color, fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>
                      {simbolo} {formatPrecio(p.monto)}
                      <span style={{ color: '#475569', fontSize: '0.72rem', fontWeight: 400 }}>/mes</span>
                    </div>
                    {p.key === 'anual' && (
                      <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '4px' }}>Facturado anualmente</div>
                    )}
                  </div>
                ))}
              </div>

              <h5 className="sol-modal-title">¿Qué incluye?</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px' }}>
                {app.caracteristicas.map((c, i) => (
                  <li key={i} style={{
                    color: '#94a3b8', fontSize: '0.88rem', padding: '7px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'flex-start', gap: '8px'
                  }}>
                    <span style={{ color: app.color, flexShrink: 0, marginTop: '1px' }}>✓</span>
                    {c}
                  </li>
                ))}
              </ul>

              <button onClick={() => setPaso(2)}
                style={{ width: '100%', padding: '13px', background: app.color, border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                Continuar → Mis datos
              </button>
            </>
          )}

          {/* Paso 2: Formulario */}
          {paso === 2 && (
            <form onSubmit={handleSubmit} noValidate>
              <h5 className="sol-modal-title">Datos de registro</h5>
              {[
                { key: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Tu nombre completo', required: true },
                { key: 'empresa', label: 'Empresa (opcional)', type: 'text', placeholder: 'Nombre de tu empresa', required: false },
                { key: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'correo@empresa.com', required: true },
                { key: 'telefono', label: 'Teléfono / WhatsApp', type: 'tel', placeholder: '+1 809 000 0000', required: true }
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>
                    {f.label} {f.required && <span style={{ color: app.color }}>*</span>}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setErrores({ ...errores, [f.key]: null }) }}
                    style={{
                      width: '100%', padding: '10px 14px', boxSizing: 'border-box',
                      background: errores[f.key] ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${errores[f.key] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '8px', color: '#f1f5f9', fontSize: '0.9rem',
                      outline: 'none', transition: 'border-color 0.2s'
                    }}
                  />
                  {errores[f.key] && <span style={{ color: '#ef4444', fontSize: '0.72rem' }}>{errores[f.key]}</span>}
                </div>
              ))}

              {/* Resumen */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '12px 14px', marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{app.nombre} · Plan {plan}</span>
                  <span style={{ color: app.color, fontWeight: 800, fontSize: '1.05rem' }}>
                    {simbolo} {formatPrecio(precio)}<span style={{ color: '#475569', fontSize: '0.72rem', fontWeight: 400 }}>/mes</span>
                  </span>
                </div>
                <div style={{ color: '#334155', fontSize: '0.72rem', marginTop: '4px' }}>Sin permanencia · Cancela cuando quieras</div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setPaso(1)}
                  style={{ flex: '0 0 auto', padding: '12px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>
                  ← Volver
                </button>
                <button type="submit" disabled={enviando}
                  style={{ flex: 1, padding: '12px', background: enviando ? `${app.color}80` : app.color, border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: enviando ? 'default' : 'pointer', fontSize: '0.95rem', transition: 'background 0.2s' }}>
                  {enviando ? '⏳ Procesando…' : '💳 Proceder al Pago'}
                </button>
              </div>
            </form>
          )}

          {/* Paso 3: Confirmación */}
          {paso === 3 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎉</div>
              <h4 style={{ color: '#f1f5f9', marginBottom: '8px', fontWeight: 800 }}>¡Solicitud recibida!</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '22px' }}>
                Un asesor de Zyntello se pondrá en contacto contigo en breve para completar tu acceso a{' '}
                <strong style={{ color: app.color }}>{app.nombre}</strong> y procesar el pago.
              </p>
              <a
                href={`https://wa.me/${NUMERO_WA}?text=${mensajeWA}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#25d366', color: '#fff', padding: '12px 24px',
                  borderRadius: '10px', textDecoration: 'none', fontWeight: 700,
                  fontSize: '0.95rem', marginBottom: '14px'
                }}>
                <span style={{ fontSize: '1.1rem' }}>📱</span> Contactar por WhatsApp
              </a>
              <br />
              <button onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.88rem' }}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Componente principal ───────────────────────────────── */
export default function Soluciones() {
  const [modalApp, setModalApp] = useState(null)
  const [moneda, setMoneda] = useState('USD')
  const [rates, setRates] = useState(null)

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(data => setRates(data.rates))
      .catch(() => {})
  }, [])

  const infoMoneda = MONEDAS_INFO[moneda]
  const simbolo = infoMoneda.simbolo

  const formatPrecio = (usd) => {
    if (!rates || !rates[moneda]) return usd.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return (usd * rates[moneda]).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <>
      <section id="soluciones" style={{ background: '#060612', padding: '5rem 0' }}>
        <div className="container-fluid px-4 px-lg-5">

          {/* Header */}
          <div className="text-center mb-5">
            <p className="text-uppercase fw-semibold mb-2"
              style={{ color: '#a78bfa', letterSpacing: '2px', fontSize: '0.85rem' }}>
              Plataforma SaaS
            </p>
            <h2 className="fw-black mb-3"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#f1f5f9' }}>
              Soluciones en la Nube
            </h2>
            <p className="mx-auto"
              style={{ color: '#94a3b8', maxWidth: '560px', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Microaplicaciones empresariales listas para usar. Sin instalaciones, acceso desde cualquier dispositivo y soporte incluido.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              {['CRM', 'Proyectos', 'Tareas', 'Facturación', 'Inventario', 'Encuestas', 'Contabilidad', 'Condominios', 'ConstructFlow', 'Restaurante', 'Doctores'].map(a => (
                <span key={a} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#64748b', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '20px' }}>{a}</span>
              ))}
            </div>
          </div>

          {/* Callout personalización */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(139,92,246,0.07) 100%)',
            border: '1px solid rgba(139,92,246,0.22)',
            borderRadius: '14px', padding: '18px 24px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>🏗️</span>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                ¿Necesitas más? Las personalizamos e instalamos en tu empresa
              </div>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.83rem', lineHeight: 1.65 }}>
                Todas estas soluciones pueden ser adaptadas a tus procesos, integradas con tus sistemas actuales e instaladas directamente en la infraestructura de tu empresa con módulos adicionales a la medida.
              </p>
            </div>
            <a href="#contacto" style={{
              background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.35)',
              color: '#a78bfa', padding: '9px 20px', borderRadius: '9px',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
              whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.2s'
            }}>
              Hablar con un asesor →
            </a>
          </div>

          {/* Selector de moneda */}
          <div className="sol-moneda-selector">
            <span className="sol-moneda-label">💱 Ver precios en:</span>
            <div className="sol-moneda-pills">
              {Object.entries(MONEDAS_INFO).map(([code, m]) => (
                <button
                  key={code}
                  onClick={() => setMoneda(code)}
                  className={`sol-moneda-pill${moneda === code ? ' active' : ''}`}
                >
                  <span>{m.bandera}</span>
                  <span className="sol-moneda-code">{code}</span>
                  <span className="sol-moneda-nombre">{m.nombre}</span>
                </button>
              ))}
            </div>
            {!rates && <span className="sol-moneda-loading">⏳ Cargando tasas…</span>}
          </div>

          {/* Banner Bundle */}
          <div className="sol-bundle-banner" onClick={() => setModalApp(APP_SUITE)}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.5rem' }}>🚀</span>
                <span style={{
                  background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  fontWeight: 800, fontSize: '1.1rem'
                }}>
                  Suite Completa Zyntello
                </span>
                <span className="sol-bundle-badge">Mejor precio</span>
              </div>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.88rem' }}>
                CRM · Proyectos · Tareas · Facturación · Inventario · Encuestas · Contabilidad · Condominios · ConstructFlow · Restaurante · Doctores — las 11 apps por un precio especial
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#475569', textDecoration: 'line-through', fontSize: '0.8rem' }}>{simbolo} {formatPrecio(192)}/mes</div>
                <div style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>
                  {simbolo} {formatPrecio(129)}<span style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 400 }}>/mes</span>
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setModalApp(APP_SUITE) }}
                className="sol-bundle-btn">
                Ver bundle →
              </button>
            </div>
          </div>

          {/* Grid de apps */}
          <div className="sol-grid">
            {apps.map(app => (
              <div
                key={app.id}
                className="sol-card"
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = `0 16px 48px ${app.color}28`
                  e.currentTarget.style.borderColor = `${app.color}40`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                }}
              >
                {/* Header con identidad completa */}
                <div style={{
                  height: '96px', background: app.gradiente, position: 'relative',
                  overflow: 'hidden', borderRadius: '12px 12px 0 0',
                  padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                  <div style={{ position: 'absolute', right: '-22px', bottom: '-32px', width: '110px', height: '110px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', right: '44px', bottom: '-44px', width: '88px', height: '88px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />

                  <div style={{
                    width: '48px', height: '48px', background: 'rgba(255,255,255,0.18)',
                    borderRadius: '12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.5rem',
                    backdropFilter: 'blur(8px)', flexShrink: 0, zIndex: 1
                  }}>
                    {app.icono}
                  </div>

                  <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                    <h4 style={{
                      color: '#fff', margin: 0, fontWeight: 800, fontSize: '1rem',
                      lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {app.nombre}
                    </h4>
                    <p style={{
                      color: 'rgba(255,255,255,0.72)', margin: '2px 0 6px', fontSize: '0.72rem',
                      lineHeight: 1.3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                    }}>
                      {app.subtitulo}
                    </p>
                    <span style={{
                      background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(4px)',
                      color: 'rgba(255,255,255,0.88)', fontSize: '0.6rem', fontWeight: 700,
                      padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.3px'
                    }}>
                      {app.categoria}
                    </span>
                  </div>

                  {app.etiqueta && <span className="sol-card-badge">{app.etiqueta}</span>}
                </div>

                {/* Info */}
                <div style={{ padding: '0 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                    <Estrellas rating={app.rating} />
                    <span style={{ color: '#334155', fontSize: '0.7rem' }}>({app.reviews})</span>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {app.descripcion}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 10px' }}>
                    {app.caracteristicas.slice(0, 3).map((c, ci) => (
                      <li key={ci} style={{
                        color: '#64748b', fontSize: '0.76rem', padding: '4px 0',
                        display: 'flex', alignItems: 'flex-start', gap: '6px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)'
                      }}>
                        <span style={{ color: app.color, flexShrink: 0, fontSize: '0.7rem', marginTop: '2px' }}>✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>

                  {/* Precio + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ color: app.color, fontWeight: 800, fontSize: '1.15rem', lineHeight: 1 }}>
                        {simbolo} {formatPrecio(app.precio)}
                        <span style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 400 }}>/mes</span>
                      </div>
                      <div style={{ color: '#334155', fontSize: '0.68rem', marginTop: '2px' }}>desde {simbolo} {formatPrecio(app.precioAnual)}/mes anual</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {app.url && (
                        <a href={app.url} target="_blank" rel="noopener noreferrer"
                          style={{ color: app.color, fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', opacity: 0.75 }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}>
                          Ver Demo →
                        </a>
                      )}
                      <button
                        onClick={() => setModalApp(app)}
                        className="sol-btn-obtener"
                        style={{ background: app.color }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >
                        Obtener
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer informativo */}
          <div className="text-center mt-5">
            <p style={{ color: '#334155', fontSize: '0.83rem', lineHeight: 1.8 }}>
              Todas las aplicaciones incluyen actualizaciones continuas y soporte técnico.<br />
              <span style={{ color: '#475569' }}>Sin contratos de permanencia · Cancela cuando quieras · Acceso inmediato tras el pago.</span>
            </p>
          </div>

        </div>
      </section>

      {modalApp && <ModalApp app={modalApp} onClose={() => setModalApp(null)} formatPrecio={formatPrecio} simbolo={simbolo} />}
    </>
  )
}
