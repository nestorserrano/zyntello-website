import { useState, useEffect, useRef } from 'react'
import '../styles/Soluciones.css'

const NUMERO_WA = '18296399877'
const API_URL   = `${(import.meta.env.VITE_ADMIN_URL || 'https://admin.zyntello.com').replace(/\/$/, '')}/api/modulos`

// Cache "last-known-good" del catálogo del admin (precios SIEMPRE vienen del admin).
// Si el API tiene un hipo transitorio se reutiliza el último catálogo recibido.
// v2: la v1 pudo guardar un elemento React serializado (ver IconoModulo).
// Subir la version es lo que hace que el navegador que ya la tiene la deseche;
// sin eso, el visitante afectado sigue viendo la sección rota para siempre.
const CACHE_KEY = 'zyntello_modulos_v2'
const leerCacheModulos = () => {
  try { const c = JSON.parse(localStorage.getItem(CACHE_KEY)); return Array.isArray(c) && c.length ? c : null } catch { return null }
}

/**
 * Icono de un módulo: emoji, o el isotipo de Zyntello.
 *
 * ⚠️⚠️ `icono` es una CADENA, nunca un elemento React — y esto no es una
 * preferencia de estilo. El catálogo combinado se guarda en `localStorage` con
 * `JSON.stringify` para sobrevivir a un hipo del API; un elemento React pasa
 * por el `stringify` convertido en `{key, ref, props}`, y al releerlo en la
 * visita siguiente React revienta con el error #31 («Objects are not valid as
 * a React child») y la sección entera deja de pintarse.
 *
 * Lo traicionero es el retraso: la primera visita funciona —la caché aún está
 * vacía— y el fallo aparece en la SEGUNDA. Pasó en producción el 2026-09-21.
 *
 * Todo lo que entre en el objeto del módulo tiene que sobrevivir a un
 * `JSON.parse(JSON.stringify(x))`.
 *
 * El isotipo se mide en `em`, no en píxeles: el mismo icono se pinta en la
 * píldora del encabezado (0,79 rem), en la tarjeta (1,5 rem) y en los iconos
 * flotantes del fondo. Con un tamaño fijo se vería enorme en una y diminuto en
 * otra, y nada lo delataría.
 */
const ICONO_ZYNTELLO = 'zyntello:isotipo'

function IconoModulo({ valor, className }) {
  if (valor !== ICONO_ZYNTELLO) return <span className={className}>{valor}</span>
  return (
    <span className={className}>
      <img
        src="/logos/zyntello_isotipo_transparente.png"
        alt=""
        aria-hidden="true"
        style={{ width: '1.1em', height: '1.1em', objectFit: 'contain', display: 'inline-block', verticalAlign: '-0.18em' }}
      />
    </span>
  )
}

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
  constructflow:{ icono: ICONO_ZYNTELLO, rating: 4.9, reviews: 47,  etiqueta: 'Disponible', previews: [{ label: 'Obras', icon: '🏗️' }, { label: 'Presupuesto', icon: '💰' }, { label: 'Avance', icon: '📊' }],    categoria: 'Construcción' },
  events:       { icono: '🎟️', rating: 4.9, reviews: 39,  etiqueta: 'Lanzamiento', previews: [{ label: 'QR', icon: '📱' }, { label: 'Ponentes', icon: '🎤' }, { label: 'Dashboard', icon: '📊' }],      categoria: 'Eventos' },
  restaurante:  { icono: '🍽️', rating: 4.7, reviews: 31,  etiqueta: 'Nuevo',      previews: [{ label: 'Mesas', icon: '🪑' }, { label: 'Cocina', icon: '👨‍🍳' }, { label: 'Cierre', icon: '💵' }],         categoria: 'Hostelería' },
  doctores:     { icono: '🩺', rating: 4.8, reviews: 28,  etiqueta: 'Nuevo',      previews: [{ label: 'Agenda', icon: '📅' }, { label: 'Expedientes', icon: '📋' }, { label: 'Recetas', icon: '💊' }],    categoria: 'Salud' },
  // Módulos ERP (para cuando el API los devuelva como parte del grid)
  nomina:       { icono: '👥', rating: 4.8, reviews: 118, etiqueta: 'Disponible', previews: [{ label: 'Empleados', icon: '👤' }, { label: 'Nómina', icon: '💰' }, { label: 'Reportes', icon: '📊' }],    categoria: 'RRHH' },
  activos:      { icono: '🏭', rating: 4.7, reviews: 63,  etiqueta: 'Disponible', previews: [{ label: 'Activos', icon: '🏭' }, { label: 'Depreciación', icon: '📉' }, { label: 'Reportes', icon: '📋' }],   categoria: 'Finanzas' },
  cajachica:    { icono: '💵', rating: 4.6, reviews: 41,  etiqueta: 'Disponible', previews: [{ label: 'Fondos', icon: '💵' }, { label: 'Reembolsos', icon: '🔄' }, { label: 'Reportes', icon: '📋' }],    categoria: 'Finanzas' },
  compras:      { icono: '🛒', rating: 4.8, reviews: 57,  etiqueta: 'Disponible', previews: [{ label: 'Órdenes', icon: '📋' }, { label: 'Recepciones', icon: '📦' }, { label: 'Reportes', icon: '📊' }],  categoria: 'Compras' },
  presupuesto:  { icono: '📊', rating: 4.7, reviews: 34,  etiqueta: 'Disponible', previews: [{ label: 'Presupuesto', icon: '📊' }, { label: 'Ejecución', icon: '✅' }, { label: 'Variaciones', icon: '📈' }], categoria: 'Finanzas' },
  bancos:       { icono: '🏦', rating: 4.8, reviews: 82,  etiqueta: 'Disponible', previews: [{ label: 'Cuentas', icon: '🏦' }, { label: 'Cheques', icon: '📄' }, { label: 'Conciliación', icon: '⚖️' }],  categoria: 'Finanzas' },
  cxc:          { icono: '💳', rating: 4.8, reviews: 94,  etiqueta: 'Disponible', previews: [{ label: 'Cobros', icon: '💳' }, { label: 'Cartera', icon: '📊' }, { label: 'Reportes', icon: '📈' }],        categoria: 'Finanzas' },
  cxp:          { icono: '📑', rating: 4.7, reviews: 76,  etiqueta: 'Disponible', previews: [{ label: 'Pagos', icon: '💸' }, { label: 'Cheques', icon: '📄' }, { label: 'Reportes', icon: '📋' }],         categoria: 'Finanzas' },
  'zyntello-psa': { icono: '⏱️', rating: 4.9, reviews: 53,  etiqueta: 'Disponible', previews: [{ label: 'Timesheets', icon: '🕒' }, { label: 'GPS', icon: '📍' }, { label: 'Planilla', icon: '📄' }],       categoria: 'Servicios' },
  prestamello:  { icono: '💵', rating: 4.8, reviews: 22,  etiqueta: 'Nuevo',      previews: [{ label: 'Préstamos', icon: '💵' }, { label: 'Cobros GPS', icon: '📍' }, { label: 'Pagos online', icon: '💳' }], categoria: 'Finanzas' },
  // Módulos de mejora: se promocionan como producto propio, pero cada uno amplía a otro
  // módulo y no funciona sin él. El aviso «Requiere X» sale del campo `requiere` del API,
  // no de esta lista — aquí solo vive lo visual.
  inteligencia:   { icono: '🧠', rating: 4.8, reviews: 18, etiqueta: 'Nuevo', previews: [{ label: 'Salud', icon: '❤️' }, { label: 'Recomendaciones', icon: '🎯' }, { label: 'NPS', icon: '📊' }],            categoria: 'Inteligencia' },
  fiscal:         { icono: '🧾', rating: 4.9, reviews: 26, etiqueta: 'Nuevo', previews: [{ label: 'Calendario', icon: '📅' }, { label: 'Alertas', icon: '🔔' }, { label: 'Cumplimiento', icon: '✅' }],       categoria: 'Finanzas' },
  flujocaja:      { icono: '💧', rating: 4.8, reviews: 21, etiqueta: 'Nuevo', previews: [{ label: 'Proyección', icon: '📈' }, { label: 'Escenarios', icon: '🔀' }, { label: 'Liquidez', icon: '💧' }],        categoria: 'Finanzas' },
  abastecimiento: { icono: '📈', rating: 4.7, reviews: 19, etiqueta: 'Nuevo', previews: [{ label: 'Pronóstico', icon: '🔮' }, { label: 'EOQ', icon: '⚖️' }, { label: 'ABC', icon: '🔤' }],                     categoria: 'Logística' },
  rutas:          { icono: '🗺️', rating: 4.8, reviews: 24, etiqueta: 'Nuevo', previews: [{ label: 'Despachos', icon: '🚚' }, { label: 'Visitas', icon: '📍' }, { label: 'Mapa', icon: '🗺️' }],                categoria: 'Logística' },
}

const DISPLAY_DEFAULT = { icono: '⚡', rating: 4.5, reviews: 10, etiqueta: null, previews: [], categoria: 'Módulo' }

/**
 * Nombre legible del módulo padre a partir de su slug.
 *
 * Se busca primero en los módulos que ya llegaron del API — así el nombre es el que
 * el admin publica hoy, no una copia que se quedaría vieja al renombrarlo. Solo si no
 * está cargado se cae a un rótulo derivado del slug, que es mejor que no decir nada.
 */
function nombreModulo(slug, listaApps) {
  if (!slug) return ''
  const encontrado = (listaApps || []).find(a => a.id === slug)
  if (encontrado) return encontrado.nombre
  const meta = DISPLAY_ESTATICO[slug]
  if (meta && meta.nombre) return meta.nombre
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

/* Datos estáticos completos como fallback si el API falla */
const APPS_FALLBACK = [
  { id: 'crm',          nombre: 'CRM',           subtitulo: 'Gestión de Clientes y Ventas',          descripcion: 'Administra tu pipeline de ventas, historial de clientes y oportunidades comerciales desde un solo lugar.', precio: null,  precioAnual: null, color: '#3b82f6', gradiente: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #60a5fa 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/crm',          caracteristicas: ['Pipeline de ventas visual Kanban', 'Historial completo de interacciones', 'Gestión de contactos y empresas', 'Reportes y métricas de ventas', 'Integración con WhatsApp y email'] },
  { id: 'proyectos',    nombre: 'Proyectos',      subtitulo: 'Gestión de Proyectos',                  descripcion: 'Planifica y ejecuta proyectos con tu equipo. Vistas Kanban y Gantt, asignación de recursos y control de tiempos.', precio: null,  precioAnual: null, color: '#8b5cf6', gradiente: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 60%, #a78bfa 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/proyectos',    caracteristicas: ['Tablero Kanban y diagrama Gantt', 'Asignación de tareas y responsables', 'Control de tiempos y progreso', 'Alertas y notificaciones automáticas', 'Reportes de avance ejecutivo'] },
  { id: 'tareas',       nombre: 'Tareas',         subtitulo: 'Gestión de Tareas del Equipo',          descripcion: 'Organiza las tareas de tu equipo con prioridades, fechas límite y seguimiento de estado.', precio: null,  precioAnual: null,  color: '#f59e0b', gradiente: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #fcd34d 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/tareas',       caracteristicas: ['Listas y tableros personalizados', 'Prioridades y fechas límite', 'Asignación de responsables', 'Comentarios y archivos adjuntos', 'Recordatorios automáticos'] },
  { id: 'facturacion',  nombre: 'Facturación',    subtitulo: 'Facturación y Cobros',                  descripcion: 'Emite facturas profesionales, gestiona cobros y controla tus ingresos con soporte para RD, Venezuela, Colombia y LATAM.', precio: null,  precioAnual: null, color: '#10b981', gradiente: 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #34d399 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/facturacion',  caracteristicas: ['Emisión de facturas y recibos', 'Control de cuentas por cobrar', 'Reportes fiscales y contables', 'Múltiples monedas y tasas', 'Portal de pago para clientes'] },
  { id: 'inventario',   nombre: 'Inventario',     subtitulo: 'Control de Inventario y Stock',         descripcion: 'Controla tu stock en tiempo real, gestiona entradas y salidas, define puntos de reorden y genera reportes de movimiento.', precio: null,  precioAnual: null, color: '#ef4444', gradiente: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #f87171 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/inventario',   caracteristicas: ['Control de stock en tiempo real', 'Gestión de entradas y salidas', 'Alertas de reorden automáticas', 'Múltiples almacenes y bodegas', 'Reportes de rotación y valorización'] },
  { id: 'encuestas',    nombre: 'Encuestas',      subtitulo: 'Encuestas y Estadísticas',              descripcion: 'Crea encuestas personalizadas, recopila respuestas en tiempo real y obtén estadísticas automáticas para tomar decisiones.', precio: null,  precioAnual: null, color: '#0ea5e9', gradiente: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 60%, #38bdf8 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/encuestas',    caracteristicas: ['Constructor de encuestas drag & drop', 'Tipos: opción múltiple, escala, NPS', 'Enlace público y código embebido', 'Resultados en tiempo real con gráficas', 'Exportación a Excel y PDF'] },
  { id: 'contabilidad', nombre: 'Contabilidad',   subtitulo: 'Gestión Contable y Financiera',         descripcion: 'Lleva la contabilidad de tu empresa con plan de cuentas, asientos diarios, estados financieros y cumplimiento fiscal.', precio: null,  precioAnual: null, color: '#14b8a6', gradiente: 'linear-gradient(135deg, #134e4a 0%, #0f766e 60%, #2dd4bf 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/contabilidad',  caracteristicas: ['Plan de cuentas personalizable', 'Asientos contables y libro diario', 'Balance general y estado de resultados', 'Reportes fiscales por país (RD, CO, MX, VE)', 'Conciliación bancaria automatizada'] },
  { id: 'condominios',  nombre: 'Condominios',    subtitulo: 'Gestión de Condominios y Residencias',  descripcion: 'Administra residenciales, edificios y condominios con control de cuotas, propietarios, mantenimiento y comunicación.', precio: null,  precioAnual: null, color: '#f97316', gradiente: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 60%, #fb923c 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/condominios',  caracteristicas: ['Registro de propietarios e inquilinos', 'Cobro y control de cuotas de mantenimiento', 'Reserva y gestión de áreas comunes', 'Órdenes de trabajo y mantenimiento', 'Comunicados y avisos a residentes'] },
  { id: 'constructflow',nombre: 'ConstructFlow',  subtitulo: 'Gestión de Obras y Construcción',       descripcion: 'Planifica y ejecuta proyectos de construcción con control de presupuesto, avance de obra, materiales y subcontratistas.', precio: null,  precioAnual: null, color: '#d97706', gradiente: 'linear-gradient(135deg, #78350f 0%, #fbbf24 60%, #d97706 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/constructflow', caracteristicas: ['Gestión de proyectos y frentes de obra', 'Control presupuestario y costos reales', 'Inventario de materiales y equipos', 'Cronograma y avance por etapas', 'Informes de progreso para clientes'] },
  { id: 'events',       nombre: 'Zyntello Events',subtitulo: 'Registro de Eventos con QR y Ponentes', descripcion: 'Gestiona eventos con registro por QR, participantes por día, control de ponentes y dashboard en vivo para seguimiento en tiempo real.', precio: null,  precioAnual: null, color: '#ec4899', gradiente: 'linear-gradient(135deg, #831843 0%, #db2777 60%, #f472b6 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/events',  caracteristicas: ['Registro público por QR token', 'Check-in diario por participante', 'Dashboard live para ponentes', 'Gestión de agenda y días del evento', 'Reportes de inscritos en tiempo real'] },
  { id: 'restaurante',  nombre: 'Restaurante',    subtitulo: 'Sistema POS para Restaurantes',         descripcion: 'Sistema completo para restaurantes, cafeterías y bares. Mesas, comandas, cocina, delivery, inventario y cierre de caja.', precio: null,  precioAnual: null, color: '#e11d48', gradiente: 'linear-gradient(135deg, #881337 0%, #be123c 60%, #fb7185 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/restaurante',   caracteristicas: ['Gestión de mesas y comandas en tiempo real', 'Pantalla de cocina (KDS)', 'Control de inventario y recetas', 'Delivery y take-away integrado', 'Reportes de ventas y cierre de caja'] },
  { id: 'doctores',     nombre: 'Doctores',       subtitulo: 'Gestión de Consultorios y Clínicas',    descripcion: 'Agenda citas, gestiona expedientes clínicos, recetas, historial del paciente y factura consultas con seguridad y privacidad.', precio: null,  precioAnual: null, color: '#06b6d4', gradiente: 'linear-gradient(135deg, #164e63 0%, #0891b2 60%, #22d3ee 100%)', ahorroAnual: '2 MESES GRATIS', url: 'https://app.zyntello.com/demo/doctores',      caracteristicas: ['Agenda de citas y recordatorios automáticos', 'Expediente clínico electrónico', 'Recetas y órdenes de laboratorio', 'Control de historias clínicas', 'Facturación de consultas y seguros'] },
]

/* ─── Convierte color hex a gradiente CSS ──────────────────────── */
function hexToGradiente(hex) {
  try {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const dark  = `rgb(${Math.round(r * 0.42)},${Math.round(g * 0.42)},${Math.round(b * 0.42)})`
    const light = `rgb(${Math.min(255, Math.round(r * 1.55))},${Math.min(255, Math.round(g * 1.55))},${Math.min(255, Math.round(b * 1.55))})`
    return `linear-gradient(135deg, ${dark} 0%, ${hex} 60%, ${light} 100%)`
  } catch {
    return 'linear-gradient(135deg, #1e293b 0%, #7c3aed 60%, #a78bfa 100%)'
  }
}

/* ─── Badge por estado (desde admin) ─────────────────────────── */
const ESTADO_BADGE = {
  proximo:   { texto: 'Próximamente', bg: 'rgba(255,255,255,0.07)',  color: '#9c9caa' },
  nuevo:     { texto: 'Nuevo',        bg: 'rgba(52,211,153,0.16)',   color: '#6ee7b7' },
  destacado: { texto: 'Destacado',    bg: 'rgba(251,113,133,0.18)',  color: '#fda4af' },
}

/* ─── Combina datos del API con display estático ──────────────── */
function combinarModulo(apiData) {
  const display   = DISPLAY_ESTATICO[apiData.slug] || DISPLAY_DEFAULT
  const color     = apiData.color_primario || '#7c3aed'
  const gradiente = hexToGradiente(color)
  const ahorroPct = apiData.ahorro_pct > 0 ? `AHORRA ${apiData.ahorro_pct}%` : null

  // El estado del admin tiene prioridad sobre los datos estáticos
  const estado     = apiData.estado || 'activo'
  const disponible = apiData.disponible !== false  // si el API no lo envía, asumimos disponible
  const etiquetaEstado = ESTADO_BADGE[estado] ? ESTADO_BADGE[estado].texto : null
  // Para 'activo' usamos la etiqueta estática; para proximo/nuevo/destacado usamos el estado
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
    // Total anual (lo que de verdad se cobra). Los módulos sin plan mensual lo anuncian
    // directamente en vez de un "/mes" derivado que nadie puede pagar.
    precioAnualTotal: apiData.precio_anual_final || apiData.precio_anual_base || 0,
    ahorroAnual:    ahorroPct,
    color,
    gradiente,
    rating:         display.rating,
    reviews:        display.reviews,
    etiqueta,
    etiquetaBadge:  ESTADO_BADGE[estado] || null,
    disponible,
    bundle:         !!apiData.bundle,
    // ¿Se ofrece por separado? Es OTRA pregunta que «va dentro del ERP»: un módulo puede
    // hacer las dos cosas, y hasta que el admin las separó en `[#512]` el caso era
    // inexpresable. Inventario lo sufría: precio publicado y nadie podía comprarlo.
    //
    // ⚠️ El respaldo es `!bundle`, no `true`: reproduce lo que se sabía antes de la
    // separación —la misma regla del backfill del admin y del respaldo de su API— en vez de
    // inventar un valor. Con `true`, una base sin la columna ofrecería los módulos del
    // bundle por separado; con `false`, el grid se quedaría vacío.
    vendibleSuelto: apiData.vendible_suelto !== undefined
      ? !!apiData.vendible_suelto
      : !apiData.bundle,
    // Slug del módulo padre que hace falta contratar (null = se vende suelto). Lo declara
    // el admin en `modulos.requiere`; el sitio solo lo muestra. Sin esto, la tarjeta
    // vendería una mejora sin decir sobre qué mejora.
    requiere:       apiData.requiere || null,
    // Módulo sin plan mensual: no se ofrece el precio /mes ni el ahorro anual, porque no
    // hay con qué comparar. `precio_mensual` llega null a propósito desde el API.
    soloAnual:      !!apiData.solo_anual,
    // ⚠️ Sin inventar URLs ni casos especiales. Si el admin no declara una, NO
    // hay landing: antes el sitio se fabricaba `/demo/{slug}`, y esa ruta
    // inventada es la que acababa en un 404 sin que nada lo avisara.
    //
    // ⚠️ `zyntello-psa` tenía su propia excepción a `/zyntello-psa.html`, un
    // HTML suelto del sitio anterior a las landings generadas. Era el ÚNICO de
    // los 34 sin la barra estándar ni botón de demo, y nada lo delataba: la
    // página se veía bien, solo que distinta de las otras 33.
    url:            apiData.url || null,
    // ⚠️ No basta con que el admin declare una `url`: la declara para todos.
    // Solo los de LANDINGS_PUBLICAS llevan a una pagina que se pueda abrir.
    tieneLanding:   LANDINGS_PUBLICAS.has(apiData.slug),
    previews:       display.previews || [],
    categoria:      display.categoria,
    desarrollador:  'Zyntello',
  }
}

// Slugs que nunca van como tarjeta del grid, por un motivo de PRESENTACIÓN y no de venta.
//
// ⚠️ Antes esta lista era el respaldo de «qué esconder porque va en el bundle», y llevaba
// los ocho módulos del ERP. Ese trabajo pasó a `vendibleSuelto`, que lo declara el admin
// (`modulos.vendible_suelto`). Mantenerlos aquí volvería a esconder lo que el admin sí
// ofrece: `inventario` estaba en esta lista, así que aunque el API lo declare vendible el
// grid lo seguiría saltando — y ese es exactamente el defecto que se está corrigiendo.
//
// Queda solo `erp` porque tiene su propio banner arriba: no es que no se venda, es que ya
// está presentado en otro sitio y saldría dos veces en la misma pantalla.
const ERP_BUNDLE_SLUGS = new Set([
  'erp',
]);

/* ─── Contratar: WhatsApp ────────────────────────────────────────────────────
 *
 * ⚠️ El pago en línea se retiró el 2026-09-21 por decisión del director
 * técnico: se contrata llamando o escribiendo. El precio SIGUE publicándose —
 * quitarlo obligaría a preguntar «¿cuánto cuesta?» antes de poder decidir, que
 * es justo lo que ahuyenta a quien está comparando.
 *
 * El mensaje lleva el módulo y su precio ya escritos: quien recibe el WhatsApp
 * sabe de qué se habla sin preguntarlo, y el visitante no tiene que explicarse.
 * ─────────────────────────────────────────────────────────────────────────── */
const WHATSAPP = '18296399877'

function enlaceWhatsApp(app, simbolo, formatPrecio) {
  const precio = app.soloAnual
    ? (app.precioAnualTotal > 0 ? `${simbolo} ${formatPrecio(app.precioAnualTotal)}/año` : 'a consultar')
    : `${simbolo} ${formatPrecio(app.precio)}/mes`
  const texto = `¡Hola Zyntello! Quiero contratar *${app.nombre}* (${precio}). ¿Me ayudan?`
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`
}

/* ─── Monedas ───────────────────────────────────────────────────── */
/* ⚠️ Sin `bandera`: el emoji de bandera NO existe en Windows. El sistema lo
   sustituye por el par de letras del país («US», «DO»), que junto al código de
   la moneda se lee como una insignia rota. El código ISO ya dice el país. */
const MONEDAS_INFO = {
  USD: { nombre: 'Dólar',     simbolo: '$'   },
  DOP: { nombre: 'Peso Dom.', simbolo: 'RD$' },
  COP: { nombre: 'Peso Col.', simbolo: '$'   },
  MXN: { nombre: 'Peso Mex.', simbolo: '$'   },
  VES: { nombre: 'Bolívar',   simbolo: 'Bs.' },
}

/* ─── Módulos con landing pública ────────────────────────────────────────────
 *
 * Al 2026-09-21 los 34 módulos tienen landing pública. No siempre fue así: el
 * admin BORRABA la landing en cuanto el módulo se activaba, dando por hecho que
 * Laravel atendía /{slug}, y eso solo era cierto para seis. Catorce acababan en
 * /login y cinco en un 404. Corregido en zyntello-admin [#515].
 *
 * ⚠️ La lista sigue existiendo —en vez de dar por buenas todas— porque el admin
 * declara una `url` para todos los módulos SIEMPRE, la landing exista o no.
 * Desde el navegador no hay forma de comprobarlo antes de la pulsación: la
 * respuesta es de otro dominio y CORS lo impide. Un botón que lleva al inicio
 * de sesión se ve exactamente igual que uno que lleva a la landing.
 *
 * ⚠️ Y se queda vieja sola, sin avisar. Para eso está la guarda:
 *
 *     node scripts/verificar-landings.mjs
 *
 * que la compara con la realidad y sale con código 1 si sobra o falta alguna.
 * Ejecutarla al publicar un módulo nuevo.
 * ─────────────────────────────────────────────────────────────────────────── */
export const LANDINGS_PUBLICAS = new Set([
  'zyntello-psa', 'crm', 'proyectos', 'tareas', 'facturacion', 'inventario',
  'encuestas', 'contabilidad', 'condominios', 'constructflow', 'events',
  'restaurante', 'doctores', 'nomina', 'cajachica', 'activos', 'supermercado',
  'compras', 'ferreteria', 'presupuesto', 'dental', 'cxc', 'alquileres', 'cxp',
  'prestamello', 'erp', 'reportes', 'bancos', 'carwash', 'inteligencia',
  'fiscal', 'flujocaja', 'abastecimiento', 'rutas',
])

/* ─── Iconos flotantes animados ─────────────────────────────────── */
const FLOAT_POSITIONS = [
  { left: '4%',  top: '12%', delay: '0s',    dur: '5.2s', size: '56px', font: '1.6rem', dir: 'a' },
  { left: '14%', top: '72%', delay: '0.8s',  dur: '4.8s', size: '44px', font: '1.2rem', dir: 'b' },
  { left: '24%', top: '30%', delay: '1.4s',  dur: '6.0s', size: '48px', font: '1.3rem', dir: 'a' },
  { left: '38%', top: '80%', delay: '0.3s',  dur: '5.5s', size: '40px', font: '1.1rem', dir: 'c' },
  { left: '52%', top: '8%',  delay: '1.8s',  dur: '4.6s', size: '52px', font: '1.5rem', dir: 'b' },
  { left: '63%', top: '62%', delay: '0.6s',  dur: '5.8s', size: '46px', font: '1.25rem', dir: 'a' },
  { left: '75%', top: '22%', delay: '2.1s',  dur: '4.9s', size: '50px', font: '1.4rem', dir: 'c' },
  { left: '84%', top: '75%', delay: '1.1s',  dur: '5.3s', size: '42px', font: '1.15rem', dir: 'b' },
  { left: '91%', top: '40%', delay: '0.4s',  dur: '6.2s', size: '54px', font: '1.5rem', dir: 'a' },
  { left: '7%',  top: '50%', delay: '1.6s',  dur: '5.0s', size: '38px', font: '1.0rem', dir: 'c' },
  { left: '46%', top: '45%', delay: '2.5s',  dur: '4.7s', size: '44px', font: '1.2rem', dir: 'b' },
]

function FloatingIcons({ apps }) {
  const items = apps.slice(0, FLOAT_POSITIONS.length)
  return (
    <div className="sol-floating-bg" aria-hidden="true">
      {items.map((app, i) => {
        const pos = FLOAT_POSITIONS[i]
        return (
          <div key={app.id} className={`sol-float-wrap sol-float-${pos.dir}`} style={{
            left: pos.left, top: pos.top,
            animationDelay: pos.delay,
            animationDuration: pos.dur,
          }}>
            <div className="sol-float-icon" style={{
              width: pos.size, height: pos.size,
              fontSize: pos.font,
              background: `${app.color}14`,
              border: `1px solid ${app.color}28`,
              boxShadow: `0 0 28px ${app.color}20`,
            }}>
              <IconoModulo valor={app.icono} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Componente principal ──────────────────────────────────────── */
export default function Soluciones() {
  const [moneda, setMoneda]     = useState('USD')
  const [rates, setRates]       = useState(null)
  const [apps, setApps]         = useState(() => leerCacheModulos() || APPS_FALLBACK)
  const [apiCargada, setApiCargada] = useState(false)

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(data => setRates(data.rates))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(combinarModulo)
          setApps(mapped)
          setApiCargada(true)
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(mapped)) } catch {}
        }
      })
      .catch(() => {})
  }, [])

  const infoMoneda = MONEDAS_INFO[moneda]
  const simbolo    = infoMoneda.simbolo
  const erpApp     = apps.find(a => a.id === 'erp')  // precio del bundle ERP desde el admin

  const formatPrecio = (usd) => {
    if (usd == null || isNaN(usd)) return '—'
    if (!rates || !rates[moneda]) return usd.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return (usd * rates[moneda]).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <>
      <section id="soluciones" className="sol-section">

        {/* Fondo: gradientes + iconos flotantes */}
        <div className="sol-bg-glow sol-bg-glow-1" />
        <div className="sol-bg-glow sol-bg-glow-2" />
        <div className="sol-bg-glow sol-bg-glow-3" />
        <FloatingIcons apps={apps} />

        {/* Letras difusas de fondo */}
        <div className="sol-watermark" aria-hidden="true">ZYNTELLO</div>
        <div className="sol-watermark sol-watermark-2" aria-hidden="true">SAAS</div>

        <div className="container-fluid px-4 px-lg-5 sol-content">

          {/* Hero header */}
          <div className="sol-hero">
            <p className="sol-hero-eyebrow">Plataforma SaaS · {apps.length} módulos</p>
            <h2 className="sol-hero-title">
              Tu empresa,<br />
              <span className="sol-hero-accent">digitalizada.</span>
            </h2>
            <p className="sol-hero-subtitle">
              Microaplicaciones empresariales listas para usar. Sin instalaciones,<br className="d-none d-md-block" />
              acceso desde cualquier dispositivo y soporte incluido.
            </p>
          </div>

          {/* Callout personalización */}
          <div className="sol-callout">
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div className="sol-callout-title">¿Necesitas más? Las personalizamos e instalamos en tu empresa</div>
              <p className="sol-callout-text">
                Todas estas soluciones pueden ser adaptadas a tus procesos, integradas con tus sistemas actuales e instaladas directamente en la infraestructura de tu empresa.
              </p>
            </div>
            <a href="#contacto" className="sol-callout-btn">Hablar con un asesor →</a>
          </div>

          {/* Selector de moneda */}
          <div className="sol-moneda-selector">
            <span className="sol-moneda-label">Ver precios en</span>
            <div className="sol-moneda-pills">
              {Object.entries(MONEDAS_INFO).map(([code, m]) => (
                <button key={code} onClick={() => setMoneda(code)} className={`sol-moneda-pill${moneda === code ? ' active' : ''}`}>
                  <span className="sol-moneda-code">{code}</span>
                  <span className="sol-moneda-nombre">{m.nombre}</span>
                </button>
              ))}
            </div>
            {!rates && <span className="sol-moneda-loading">Cargando tasas…</span>}
          </div>

          {/* Banner ERP */}
          <div className="sol-bundle-banner" onClick={() => window.location.href = 'https://app.zyntello.com/erp'} style={{ cursor: 'pointer' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.5rem' }}>🏢</span>
                <span className="sol-bundle-name">Zyntello ERP</span>
                <span className="sol-bundle-badge">ERP Completo</span>
              </div>
              <p style={{ color: '#9c9caa', margin: 0, fontSize: '0.88rem' }}>
                Inventario · Facturación · Cuentas por Cobrar · Cuentas por Pagar · Nómina · Control de Acceso · Bancos · Compras · Presupuesto · Activos Fijos · Caja Chica
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#f5f5f7', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>
                  {simbolo} {formatPrecio(erpApp?.precio)}<span style={{ color: '#9c9caa', fontSize: '0.72rem', fontWeight: 400 }}>/mes</span>
                </div>
              </div>
              <a href="https://app.zyntello.com/erp" onClick={e => e.stopPropagation()} className="sol-bundle-btn" style={{ textDecoration: 'none' }}>
                Ver ERP →
              </a>
            </div>
          </div>

          {/* Grid de apps — se ofrece lo que el admin declara vendible por separado, NO lo
              que está fuera del bundle: un módulo puede ir dentro del ERP y venderse solo. */}
          <div className="sol-grid">
            {apps.filter(app => app.vendibleSuelto && !ERP_BUNDLE_SLUGS.has(app.id)).map(app => (
              <article key={app.id} className="sol-card" style={{ '--sol-acento': app.color }}>

                <header className="sol-card-cima">
                  <IconoModulo valor={app.icono} className="sol-card-icono" />
                  {app.etiqueta && (
                    <span className="sol-card-badge" style={app.etiquetaBadge ? { background: app.etiquetaBadge.bg, color: app.etiquetaBadge.color } : {}}>
                      {app.etiqueta}
                    </span>
                  )}
                </header>

                <h3 className="sol-card-nombre">{app.nombre}</h3>
                <p className="sol-card-sub">{app.subtitulo || app.descripcion}</p>

                {/* El aviso «amplía X» se queda aunque la tarjeta se haya
                    simplificado: sin él, el cliente contrata un módulo que no
                    puede abrir, y el fallo aparece DESPUÉS de pagar. */}
                {app.requiere && (
                  <p className="sol-card-requiere">
                    Amplía <strong>{nombreModulo(app.requiere, apps)}</strong> — necesita ese módulo contratado
                  </p>
                )}

                <footer className="sol-card-pie">
                  <div className="sol-card-precio">
                    {app.soloAnual ? (
                      /* Sin plan mensual se anuncia el anual. Mostrar «$0/mes» —lo
                         que saldría de un precio null— se leería como gratis. */
                      <>
                        <span className="sol-card-monto">
                          {app.precioAnualTotal > 0 ? `${simbolo} ${formatPrecio(app.precioAnualTotal)}` : 'Consultar'}
                        </span>
                        {app.precioAnualTotal > 0 && <span className="sol-card-periodo">/año</span>}
                      </>
                    ) : (
                      <>
                        <span className="sol-card-monto">{simbolo} {formatPrecio(app.precio)}</span>
                        <span className="sol-card-periodo">/mes</span>
                      </>
                    )}
                  </div>

                  {/* ⚠️ El orden importa: la landing va PRIMERO, aunque el modulo
                      este en «Proximamente». Ocho modulos que aun no se pueden
                      contratar tienen su landing publicada, y es justo ahi donde
                      mas sirve conocerlos. Con la condicion al reves esas ocho
                      tarjetas se quedaban sin ningun enlace. El rotulo
                      «Proximamente» sigue estando en la insignia de arriba. */}
                  {app.tieneLanding && app.url ? (
                    /* Con landing: el visitante primero conoce y prueba el
                       modulo; la contratacion vive dentro de esa pagina. */
                    <a href={app.url} className="sol-btn-conocer">
                      Conoce más
                    </a>
                  ) : app.disponible !== false ? (
                    /* Sin landing pública, mandarlo ahí sería mandarlo al
                       inicio de sesión o a un 404: se ofrece contratar por
                       WhatsApp, que es la única vía desde que se retiró el
                       pago en línea. */
                    <a href={enlaceWhatsApp(app, simbolo, formatPrecio)}
                       target="_blank" rel="noopener noreferrer"
                       className="sol-btn-obtener">
                      Contratar
                    </a>
                  ) : (
                    <span className="sol-card-proximo">Próximamente</span>
                  )}
                </footer>

              </article>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-5">
            <p style={{ color: '#8a8a99', fontSize: '0.83rem', lineHeight: 1.8 }}>
              Todas las aplicaciones incluyen actualizaciones continuas y soporte técnico.<br />
              <span style={{ color: '#8a8a99' }}>Sin contratos de permanencia · Cancela cuando quieras · Acceso inmediato tras el pago.</span>
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.32)', borderRadius: '10px', padding: '8px 18px', marginTop: '10px' }}>
              <span style={{ color: '#a5b4fc', fontSize: '1rem' }}>🎁</span>
              <span style={{ color: '#a5b4fc', fontSize: '0.83rem', fontWeight: 600 }}>Plan anual — 2 meses gratis en todos los paquetes</span>
            </div>
          </div>

        </div>
      </section>

    </>
  )
}
