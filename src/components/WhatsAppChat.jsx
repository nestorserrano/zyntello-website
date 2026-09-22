import { useState, useEffect, useRef } from 'react'

const NUMERO = '18296399877'

// ─── Árbol de conversación ────────────────────────────────────────────────────
const NODOS = {

  inicio: {
    mensajes: [
      '¡Hola! 👋 Bienvenido a **Zyntello**.',
      '¿En qué área podemos ayudarte hoy?'
    ],
    opciones: [
      '⚙️ Implementar un ERP / CRM',
      '🤖 Automatización con IA',
      '📣 Marketing Digital',
      '🗳️ Consultoría Electoral & Política',
      '📊 Encuestas y Estudios de Mercado',
      '🔧 Soporte Técnico TI',
      '📒 Consultoría Contable',
      '👥 Colocación de Personal TI',
      '🖥️ Venta de Equipos y Software',
      '🏗️ Transformación Digital',
      '💬 Hablar con un asesor ahora',
    ],
    siguiente: {
      '⚙️ Implementar un ERP / CRM': 'erp_1',
      '🤖 Automatización con IA': 'ia_1',
      '📣 Marketing Digital': 'mkt_1',
      '🗳️ Consultoría Electoral & Política': 'electoral_1',
      '📊 Encuestas y Estudios de Mercado': 'encuestas_1',
      '🔧 Soporte Técnico TI': 'soporte_1',
      '📒 Consultoría Contable': 'contable_1',
      '👥 Colocación de Personal TI': 'personal_1',
      '🖥️ Venta de Equipos y Software': 'equipos_1',
      '🏗️ Transformación Digital': 'transformacion_1',
      '💬 Hablar con un asesor ahora': 'convertir',
    }
  },

  // ── ERP ────────────────────────────────────────────────────────────────────
  erp_1: {
    mensajes: [
      '¡Excelente elección! Implementamos **Softland ERP**, **Profit 2K8/2K12** y **ODOO** — sistemas que centralizan contabilidad, inventario, ventas y operaciones en una sola plataforma.',
      '¿Cuál de estas situaciones describe mejor a tu empresa?'
    ],
    opciones: [
      '🔄 Tenemos un sistema desactualizado y queremos migrar',
      '🆕 No tenemos ERP, queremos implementar uno desde cero',
      '🔗 Queremos integrar el ERP con otras herramientas',
      '🤔 No sé cuál ERP nos conviene, necesito orientación',
    ],
    siguiente: {
      '🔄 Tenemos un sistema desactualizado y queremos migrar': 'erp_migracion',
      '🆕 No tenemos ERP, queremos implementar uno desde cero': 'erp_nuevo',
      '🔗 Queremos integrar el ERP con otras herramientas': 'erp_integracion',
      '🤔 No sé cuál ERP nos conviene, necesito orientación': 'erp_orientacion',
    }
  },
  erp_migracion: {
    mensajes: [
      'La migración de ERP es un proceso delicado pero completamente manejable con la metodología correcta.',
      'Trabajamos en **4 fases**: auditoría del sistema actual → parametrización → migración de datos históricos → capacitación y go-live. Garantizamos **cero pérdida de información**.',
      '¿Con qué sistema trabajan actualmente?'
    ],
    opciones: ['📄 Excel y procesos manuales', '💾 Software contable básico', '🖥️ Otro ERP u otro sistema', '📞 Prefiero explicarlo con un asesor'],
    siguiente: { default: 'erp_cierre' }
  },
  erp_nuevo: {
    mensajes: [
      'Perfecto. Para una implementación nueva, el primer paso es entender los módulos que tu empresa necesita: **contabilidad, inventario, compras, ventas, nómina, producción**, entre otros.',
      '¿Cuántos usuarios aproximadamente utilizarían el sistema?'
    ],
    opciones: ['👤 1 a 5 usuarios', '👥 6 a 20 usuarios', '🏢 Más de 20 usuarios'],
    siguiente: { default: 'erp_cierre' }
  },
  erp_integracion: {
    mensajes: [
      'La integración entre sistemas elimina la doble digitación y mantiene toda tu información sincronizada en tiempo real.',
      'Conectamos ERP con **e-commerce, POS, CRM, bancos, plataformas de facturación electrónica** y más.',
      '¿Qué sistema necesitas conectar con tu ERP?'
    ],
    opciones: ['🛒 Tienda online / e-commerce', '💳 Punto de venta (POS)', '🏦 Sistema bancario', '📧 CRM o plataforma de clientes', '🧾 Facturación electrónica'],
    siguiente: { default: 'erp_cierre' }
  },
  erp_orientacion: {
    mensajes: [
      'Con gusto te orientamos. La elección del ERP depende del tamaño de tu empresa, el sector y tu presupuesto.',
      '**Softland** es ideal para empresas medianas/grandes con operaciones complejas. **Profit** es perfecto para PyMEs en Venezuela y RD. **ODOO** es una excelente opción open-source altamente personalizable.',
      '¿En qué país opera tu empresa?'
    ],
    opciones: ['🇩🇴 República Dominicana', '🇻🇪 Venezuela', '🇨🇴 Colombia', '🇬🇹 Guatemala', '🇨🇷 Costa Rica', '🌎 Otro país'],
    siguiente: { default: 'erp_cierre' }
  },
  erp_cierre: {
    mensajes: [
      'Perfecto, con esa información podemos prepararte una **propuesta personalizada sin costo**.',
      '¿Te gustaría que uno de nuestros consultores ERP te contacte por WhatsApp para coordinar una demo o reunión de evaluación?'
    ],
    opciones: ['✅ Sí, quiero que me contacten', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, quiero que me contacten': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── IA ─────────────────────────────────────────────────────────────────────
  ia_1: {
    mensajes: [
      '¡La automatización con IA puede transformar completamente tu operación!',
      'Implementamos agentes que trabajan 24/7 automatizando tareas como **generación de reportes, atención al cliente, procesamiento de documentos, aprobaciones y análisis de datos**.',
      '¿Qué proceso te gustaría automatizar primero?'
    ],
    opciones: [
      '📈 Reportes y análisis de datos automáticos',
      '💬 Atención al cliente con chatbot',
      '📄 Procesamiento de documentos y facturas',
      '🔄 Flujos de aprobación internos',
      '🔌 Conectar IA con mi sistema actual',
      '🧪 Quiero una evaluación / demo',
    ],
    siguiente: {
      '📈 Reportes y análisis de datos automáticos': 'ia_reportes',
      '💬 Atención al cliente con chatbot': 'ia_chatbot',
      '📄 Procesamiento de documentos y facturas': 'ia_documentos',
      default: 'ia_cierre'
    }
  },
  ia_reportes: {
    mensajes: [
      'Con IA conectamos tus fuentes de datos — ERP, hojas de cálculo, bases de datos — y generamos reportes automáticos con análisis inteligente.',
      '**Sin trabajo manual. Sin errores humanos. Con alertas automáticas cuando algo está fuera de rango.**',
      '¿Con qué frecuencia necesitas estos reportes?'
    ],
    opciones: ['⏰ Diariamente', '📅 Semanalmente', '📊 En tiempo real', '📩 Bajo demanda / cuando lo necesito'],
    siguiente: { default: 'ia_cierre' }
  },
  ia_chatbot: {
    mensajes: [
      'Los chatbots con IA pueden atender a tus clientes **24/7**, responder preguntas frecuentes, calificar prospectos y transferir casos complejos a tu equipo.',
      'Los integramos en tu **sitio web, WhatsApp Business, Instagram y Facebook**.',
      '¿En qué canal lo necesitas principalmente?'
    ],
    opciones: ['💬 WhatsApp Business', '🌐 Sitio web', '📸 Instagram / Facebook', '📱 Todos los canales'],
    siguiente: { default: 'ia_cierre' }
  },
  ia_documentos: {
    mensajes: [
      'Nuestros agentes de IA pueden **leer, clasificar y procesar** facturas, contratos, formularios y otros documentos automáticamente.',
      'Se integran con tu ERP o sistema de archivos para registrar la información sin intervención humana.',
      '¿Qué tipo de documentos necesitas procesar?'
    ],
    opciones: ['🧾 Facturas de proveedores', '📋 Contratos y documentos legales', '📝 Formularios de clientes', '📦 Órdenes de compra / despacho'],
    siguiente: { default: 'ia_cierre' }
  },
  ia_cierre: {
    mensajes: [
      'Excelente. Lo que describes tiene una solución concreta que podemos implementar.',
      '¿Te gustaría que un especialista en IA de Zyntello te contacte por WhatsApp para mostrarte una demo personalizada?'
    ],
    opciones: ['✅ Sí, quiero la demo', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, quiero la demo': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── Marketing Digital ──────────────────────────────────────────────────────
  mkt_1: {
    mensajes: [
      'El marketing digital bien ejecutado puede multiplicar tus ventas y posicionar tu marca de forma sostenible.',
      'Trabajamos en **redes sociales, SEO, publicidad pagada (Google Ads, Meta Ads) y analítica de audiencias**.',
      '¿Cuál es tu principal objetivo en este momento?'
    ],
    opciones: [
      '📱 Mejorar presencia en redes sociales',
      '🔍 Aparecer en Google (SEO / SEM)',
      '💰 Lanzar publicidad pagada',
      '📊 Entender mejor a mi audiencia',
      '🚀 Estrategia digital completa desde cero',
    ],
    siguiente: {
      '📱 Mejorar presencia en redes sociales': 'mkt_redes',
      '🔍 Aparecer en Google (SEO / SEM)': 'mkt_seo',
      default: 'mkt_cierre'
    }
  },
  mkt_redes: {
    mensajes: [
      'Una presencia sólida en redes sociales construye confianza y genera leads de forma orgánica.',
      'Nos encargamos de la **creación de contenido, diseño gráfico, publicación, gestión de comentarios y reportes mensuales** de resultados.',
      '¿En qué redes sociales quieres enfocarte?'
    ],
    opciones: ['📸 Instagram', '👍 Facebook', '💼 LinkedIn', '🎵 TikTok', '📱 Varias / todas'],
    siguiente: { default: 'mkt_cierre' }
  },
  mkt_seo: {
    mensajes: [
      'El SEO es una de las inversiones con mejor retorno a mediano plazo — una vez posicionado, el tráfico es **gratuito y constante**.',
      'Para resultados más inmediatos, combinamos SEO con **Google Ads y Meta Ads**.',
      '¿Tu empresa tiene sitio web actualmente?'
    ],
    opciones: ['✅ Sí, tenemos sitio web', '🆕 No, necesitamos uno también', '🔧 Tenemos uno pero necesita mejoras'],
    siguiente: { default: 'mkt_cierre' }
  },
  mkt_cierre: {
    mensajes: [
      'Perfecto. Con esa información podemos diseñar una estrategia digital enfocada en resultados reales para tu empresa.',
      '¿Te gustaría que un especialista en marketing de Zyntello te contacte por WhatsApp para prepararte una propuesta?'
    ],
    opciones: ['✅ Sí, quiero la propuesta', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, quiero la propuesta': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── Electoral ──────────────────────────────────────────────────────────────
  electoral_1: {
    mensajes: [
      'Nuestra consultoría electoral combina **análisis de datos, encuestas de percepción, diseño de estrategia y monitoreo de tendencias** para maximizar resultados en procesos electorales.',
      '¿Para qué tipo de proceso necesitas apoyo?'
    ],
    opciones: [
      '🏛️ Campaña política / candidatura',
      '📋 Medición de percepción ciudadana',
      '🗳️ Encuestas y sondeos electorales',
      '📊 Análisis de datos demográficos y electorales',
    ],
    siguiente: {
      '🏛️ Campaña política / candidatura': 'electoral_campana',
      default: 'electoral_cierre'
    }
  },
  electoral_campana: {
    mensajes: [
      'Para una campaña política efectiva, el primer paso es entender el **perfil del electorado, los temas prioritarios y el posicionamiento actual del candidato**.',
      'Diseñamos estrategias basadas en datos — no en suposiciones.',
      '¿En qué etapa se encuentra la campaña actualmente?'
    ],
    opciones: ['📌 Etapa inicial / exploratoria', '📣 Ya en campaña activa', '📅 Próximas elecciones en menos de 6 meses', '🔄 Post-electoral / análisis de resultados'],
    siguiente: { default: 'electoral_cierre' }
  },
  electoral_cierre: {
    mensajes: [
      'Este tipo de servicio requiere una conversación confidencial para entender el contexto completo.',
      '¿Te gustaría hablar directamente con nuestro equipo de consultoría estratégica por WhatsApp?'
    ],
    opciones: ['✅ Sí, quiero conversar', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, quiero conversar': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── Encuestas ──────────────────────────────────────────────────────────────
  encuestas_1: {
    mensajes: [
      'Realizamos estudios de mercado, encuestas de opinión, sondeos y análisis estadísticos con metodología rigurosa para organismos públicos y privados.',
      '¿Qué tipo de estudio necesitas?'
    ],
    opciones: [
      '📢 Encuesta de opinión pública',
      '🏢 Estudio de mercado para mi empresa',
      '🗂️ Censo o levantamiento de datos',
      '📈 Análisis de datos ya recopilados',
    ],
    siguiente: {
      '📢 Encuesta de opinión pública': 'encuestas_opinion',
      '🏢 Estudio de mercado para mi empresa': 'encuestas_mercado',
      default: 'encuestas_cierre'
    }
  },
  encuestas_opinion: {
    mensajes: [
      'Las encuestas de opinión pública requieren un diseño metodológico riguroso para garantizar resultados representativos y confiables.',
      'Diseñamos el cuestionario, definimos la muestra, realizamos el trabajo de campo y entregamos un **informe con visualizaciones y análisis profundo**.',
      '¿Cuál es el ámbito geográfico de la encuesta?'
    ],
    opciones: ['🏙️ Local / municipal', '🌆 Regional / provincial', '🇩🇴 Nacional', '🌎 Multi-país'],
    siguiente: { default: 'encuestas_cierre' }
  },
  encuestas_mercado: {
    mensajes: [
      'Un estudio de mercado bien hecho puede darte una ventaja competitiva real — entendiendo las necesidades de tus clientes, el comportamiento de la competencia y las oportunidades del mercado.',
      '¿Cuál es el objetivo principal del estudio?'
    ],
    opciones: ['🚀 Lanzar un nuevo producto o servicio', '📊 Entender mejor a mis clientes actuales', '🆚 Analizar la competencia', '💡 Identificar nuevas oportunidades de negocio'],
    siguiente: { default: 'encuestas_cierre' }
  },
  encuestas_cierre: {
    mensajes: [
      'Entendido. Para prepararte una propuesta con metodología y presupuesto necesitamos conocer un poco más el alcance del proyecto.',
      '¿Te gustaría hablar con nuestro equipo de investigación por WhatsApp?'
    ],
    opciones: ['✅ Sí, quiero la propuesta', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, quiero la propuesta': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── Soporte TI ─────────────────────────────────────────────────────────────
  soporte_1: {
    mensajes: [
      'Ofrecemos soporte técnico presencial y remoto con **SLA adaptados a tu operación**. Cubrimos infraestructura, redes, servidores y sistemas.',
      'Tenemos presencia directa en RD, Venezuela, Colombia, Guatemala y Costa Rica.',
      '¿Cuál es tu necesidad principal?'
    ],
    opciones: [
      '🔴 Tengo un problema urgente ahora',
      '📅 Quiero un contrato de soporte mensual',
      '🌐 Necesito configurar red o servidores',
      '🔧 Mantenimiento preventivo de equipos',
    ],
    siguiente: {
      '🔴 Tengo un problema urgente ahora': 'soporte_urgente',
      default: 'soporte_cierre'
    }
  },
  soporte_urgente: {
    mensajes: [
      'Entendemos que es urgente. Nuestro equipo puede atenderte de inmediato de forma remota.',
      'Cuéntanos brevemente: **¿qué sistema o equipo está fallando y cómo afecta tu operación?**'
    ],
    opciones: ['💻 Computadoras / estaciones de trabajo', '🌐 Red / internet de la empresa', '🖥️ Servidor caído', '📊 Sistema o software específico'],
    siguiente: { default: 'convertir' }
  },
  soporte_cierre: {
    mensajes: [
      'Perfecto. Nuestros planes de soporte se adaptan al tamaño y necesidades de tu empresa.',
      '¿Te gustaría que un técnico de Zyntello te contacte por WhatsApp para evaluar tu caso?'
    ],
    opciones: ['✅ Sí, que me contacten', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, que me contacten': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── Contable ───────────────────────────────────────────────────────────────
  contable_1: {
    mensajes: [
      'Nuestra consultoría contable está integrada con los sistemas ERP que implementamos, lo que garantiza que la contabilidad esté siempre actualizada y los reportes fiscales listos.',
      '¿Qué necesitas específicamente?'
    ],
    opciones: [
      '📒 Asesoría contable general',
      '⚙️ Configuración contable dentro de mi ERP',
      '📑 Reportes financieros y fiscales',
      '✅ Cumplimiento normativo y regulatorio',
    ],
    siguiente: {
      '⚙️ Configuración contable dentro de mi ERP': 'contable_erp',
      default: 'contable_cierre'
    }
  },
  contable_erp: {
    mensajes: [
      'La configuración contable en el ERP es clave para que los reportes sean confiables desde el primer día.',
      'Configuramos **plan de cuentas, centros de costo, impuestos, retenciones y conciliaciones** según las normas contables de tu país.',
      '¿Con qué ERP trabajas actualmente?'
    ],
    opciones: ['⚙️ Softland', '💾 Profit 2K8 / 2K12', '🔄 ODOO', '🖥️ Otro sistema'],
    siguiente: { default: 'contable_cierre' }
  },
  contable_cierre: {
    mensajes: [
      'Entendido. Nuestros consultores contables pueden darte orientación específica para tu caso.',
      '¿Te gustaría que te contacten por WhatsApp para coordinar una consulta?'
    ],
    opciones: ['✅ Sí, quiero la consulta', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, quiero la consulta': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── Personal TI ────────────────────────────────────────────────────────────
  personal_1: {
    mensajes: [
      'Conectamos empresas con talento TI calificado en la región. Nuestros perfiles van desde técnicos de soporte hasta arquitectos de sistemas y especialistas en IA.',
      '¿Qué perfil necesitas?'
    ],
    opciones: [
      '🔧 Técnico de soporte TI',
      '💻 Desarrollador de software',
      '🌐 Administrador de redes / sistemas',
      '⚙️ Especialista en ERP',
      '🤖 Especialista en IA / datos',
    ],
    siguiente: { default: 'personal_cierre' }
  },
  personal_cierre: {
    mensajes: [
      'Perfecto. Para ese perfil necesitamos conocer más detalles: modalidad (presencial / remoto), experiencia requerida y ubicación.',
      '¿Te gustaría hablar con nuestro equipo de recursos tecnológicos por WhatsApp?'
    ],
    opciones: ['✅ Sí, quiero información', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, quiero información': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── Equipos ────────────────────────────────────────────────────────────────
  equipos_1: {
    mensajes: [
      'Suministramos equipos tecnológicos empresariales con **asesoría técnica incluida, garantía y soporte local**. Trabajamos con las marcas líderes del mercado.',
      '¿Qué tipo de equipo necesitas?'
    ],
    opciones: [
      '💻 Computadoras / laptops',
      '🖥️ Servidor para la empresa',
      '🌐 Equipos de red (router, switches, AP)',
      '🖨️ Impresoras y periféricos',
      '📦 Licencias de software',
    ],
    siguiente: { default: 'equipos_cierre' }
  },
  equipos_cierre: {
    mensajes: [
      'Podemos prepararte una **cotización técnica personalizada** con especificaciones y precios según tu presupuesto.',
      '¿Te gustaría que te enviemos la cotización por WhatsApp?'
    ],
    opciones: ['✅ Sí, quiero la cotización', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, quiero la cotización': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── Transformación Digital ─────────────────────────────────────────────────
  transformacion_1: {
    mensajes: [
      'La transformación digital va más allá de comprar tecnología — se trata de **rediseñar cómo opera tu empresa** con las herramientas correctas.',
      'Iniciamos con un **diagnóstico gratuito** de tu infraestructura y procesos actuales.',
      '¿Cuál es el mayor desafío tecnológico de tu empresa hoy?'
    ],
    opciones: [
      '⏱️ Procesos manuales que consumen demasiado tiempo',
      '🔌 Sistemas desconectados que no se comunican',
      '📉 Sin visibilidad en tiempo real de la operación',
      '🤖 Queremos adoptar IA pero no sabemos por dónde empezar',
      '🏗️ Infraestructura obsoleta o poco confiable',
    ],
    siguiente: { default: 'transformacion_cierre' }
  },
  transformacion_cierre: {
    mensajes: [
      'Es un desafío muy común — y completamente solucionable con la estrategia correcta.',
      'El primer paso es una sesión de diagnóstico sin costo para mapear tu situación actual y definir la hoja de ruta.',
      '¿Te gustaría agendar esa sesión por WhatsApp?'
    ],
    opciones: ['✅ Sí, quiero el diagnóstico gratuito', '❓ Tengo más preguntas'],
    siguiente: { '✅ Sí, quiero el diagnóstico gratuito': 'convertir', '❓ Tengo más preguntas': 'inicio' }
  },

  // ── Conversión a WhatsApp ──────────────────────────────────────────────────
  convertir: {
    mensajes: [
      '¡Perfecto! 🎉 Un asesor de Zyntello estará contigo en breve.',
      'Te redirigimos ahora a WhatsApp con el resumen de tu consulta. Nos vemos allá 👋'
    ],
    opciones: [],
    siguiente: {}
  }
}

// ─── Utilidades ───────────────────────────────────────────────────────────────
const bold = (texto) =>
  texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

const NUMERO_WA = NUMERO
const OPCION_OTRO = '✏️ Otro, prefiero escribirlo...'

// Nodos que solo tienen opciones Sí/No — no agregar "Otro"
const NODOS_BINARIOS = new Set([
  'erp_cierre','ia_cierre','mkt_cierre','electoral_cierre',
  'encuestas_cierre','soporte_cierre','contable_cierre',
  'personal_cierre','equipos_cierre','transformacion_cierre','convertir'
])

export default function WhatsAppChat() {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([])
  const [nodoActual, setNodoActual] = useState('inicio')
  const [opciones, setOpciones] = useState([])
  const [input, setInput] = useState('')
  const [esperando, setEsperando] = useState(false)
  const [pulso, setPulso] = useState(true)
  const [historial, setHistorial] = useState([])
  const [modoOtro, setModoOtro] = useState(false)       // esperando texto libre del "Otro"
  const [destinoOtro, setDestinoOtro] = useState(null)  // nodo al que ir tras escribir
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setPulso(false), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (abierto && mensajes.length === 0) {
      cargarNodo('inicio')
    }
  }, [abierto])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, opciones, esperando])

  const agregarMensaje = (tipo, texto) =>
    new Promise(resolve => {
      setMensajes(prev => [...prev, { tipo, texto, id: Date.now() + Math.random() }])
      setTimeout(resolve, 80)
    })

  const cargarNodo = async (nodoId, msgHistorial = historial) => {
    const nodo = NODOS[nodoId]
    if (!nodo) return

    setOpciones([])
    setEsperando(true)

    for (let i = 0; i < nodo.mensajes.length; i++) {
      await new Promise(r => setTimeout(r, i === 0 ? 400 : 800))
      await agregarMensaje('bot', nodo.mensajes[i])
    }

    setEsperando(false)

    if (nodoId === 'convertir') {
      await new Promise(r => setTimeout(r, 900))
      const resumen = msgHistorial.length > 0
        ? `Hola, vengo del sitio web de Zyntello. Estoy interesado en:\n\n${msgHistorial.map(m => `• ${m}`).join('\n')}\n\nMe gustaría más información.`
        : 'Hola, vengo del sitio web de Zyntello y me gustaría información sobre sus servicios.'
      window.open(`https://wa.me/${NUMERO_WA}?text=${encodeURIComponent(resumen)}`, '_blank')
      setTimeout(() => {
        setMensajes([])
        setHistorial([])
        setNodoActual('inicio')
        cargarNodo('inicio', [])
      }, 3000)
      return
    }

    setNodoActual(nodoId)
    if (nodo.opciones?.length > 0) {
      // Agregar "Otro" automáticamente a listas no binarias
      const lista = NODOS_BINARIOS.has(nodoId)
        ? nodo.opciones
        : [...nodo.opciones, OPCION_OTRO]
      setOpciones(lista)
    }
  }

  const seleccionarOpcion = async (opcion) => {
    setOpciones([])

    // ── Opción "Otro": pedir que escriban ─────────────────────────────────────
    if (opcion === OPCION_OTRO) {
      await agregarMensaje('user', opcion)
      const nodo = NODOS[nodoActual]
      // Destino: nodo cierre del servicio actual o convertir
      const destino = nodo?.siguiente?.default || 'convertir'
      setDestinoOtro(destino)
      setModoOtro(true)
      setEsperando(true)
      await new Promise(r => setTimeout(r, 600))
      setEsperando(false)
      await agregarMensaje('bot', '¡Claro! Escribe tu respuesta a continuación y la incluiremos en tu consulta 👇')
      setTimeout(() => inputRef.current?.focus(), 100)
      return
    }

    // ── Opción normal ─────────────────────────────────────────────────────────
    await agregarMensaje('user', opcion)
    const nodo = NODOS[nodoActual]
    const nuevoHistorial = [...historial, opcion]
    setHistorial(nuevoHistorial)

    const siguiente = nodo?.siguiente?.[opcion] || nodo?.siguiente?.default
    if (siguiente) {
      await new Promise(r => setTimeout(r, 400))
      await cargarNodo(siguiente, nuevoHistorial)
    }
  }

  const enviarLibre = async () => {
    const msg = input.trim()
    if (!msg || esperando) return
    setInput('')
    setOpciones([])
    await agregarMensaje('user', msg)

    const nuevoHistorial = [...historial, msg]
    setHistorial(nuevoHistorial)

    // ── Si estamos en modo "Otro": continuar al nodo destino ──────────────────
    if (modoOtro && destinoOtro) {
      setModoOtro(false)
      setDestinoOtro(null)
      await new Promise(r => setTimeout(r, 400))
      await cargarNodo(destinoOtro, nuevoHistorial)
      return
    }

    // ── Texto libre fuera de flujo: ir directo a WhatsApp ─────────────────────
    setEsperando(true)
    await new Promise(r => setTimeout(r, 800))
    setEsperando(false)
    await agregarMensaje('bot', 'Recibido. 👍 Para darte la mejor atención, un asesor de Zyntello te responderá directamente por WhatsApp.')
    await new Promise(r => setTimeout(r, 900))
    await cargarNodo('convertir', nuevoHistorial)
  }

  return (
    <>
      <div data-chat style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999 }}>

        {/* Panel del chat */}
        {abierto && (
          <div className="rounded-4 overflow-hidden mb-3 shadow-lg"
            style={{ width: 'min(360px, calc(100vw - 2rem))', background: 'var(--zy-tarjeta)', border: '1px solid var(--zy-borde-medio)', display: 'flex', flexDirection: 'column' }}>

            {/* Cabecera */}
            <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ background: '#075e54' }}>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle fw-black text-white d-flex align-items-center justify-content-center"
                  style={{ width: 42, height: 42, background: '#128c7e', fontSize: '1.1rem', flexShrink: 0 }}>Z</div>
                <div>
                  <div className="fw-bold text-white" style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>Zyntello</div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>● En línea · Responde rápido</div>
                </div>
              </div>
              <button onClick={() => setAbierto(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
            </div>

            {/* Mensajes */}
            <div className="px-3 py-3 d-flex flex-column gap-2"
              style={{ overflowY: 'auto', maxHeight: 320, background: 'var(--zy-fondo)', scrollbarWidth: 'thin' }}>
              {mensajes.map(m => (
                <div key={m.id} className={`d-flex ${m.tipo === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className="px-3 py-2"
                    style={{
                      maxWidth: '85%', color: 'var(--zy-texto)', fontSize: '0.875rem', lineHeight: 1.55,
                      background: m.tipo === 'user' ? 'rgba(52,211,153,0.16)' : 'rgba(255,255,255,0.06)',
                      borderRadius: m.tipo === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px'
                    }}
                    dangerouslySetInnerHTML={{ __html: bold(m.texto) }}
                  />
                </div>
              ))}

              {/* Indicador de escritura */}
              {esperando && (
                <div className="d-flex justify-content-start">
                  <div className="px-3 py-2 d-flex gap-1 align-items-center"
                    style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{
                        width: 7, height: 7, borderRadius: '50%', background: 'var(--zy-indigo-claro)', display: 'block',
                        animation: `typing 1.2s ease-in-out ${i * 0.2}s infinite`
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Opciones de respuesta rápida */}
              {!esperando && opciones.length > 0 && (
                <div className="d-flex flex-column gap-2 mt-1">
                  {opciones.map((op, i) => (
                    <button key={i} onClick={() => seleccionarOpcion(op)}
                      className="text-start px-3 py-2 rounded-3 fw-medium"
                      style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(52,211,153,0.32)',
                        color: '#6ee7b7', fontSize: '0.83rem', cursor: 'pointer', transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(52,211,153,0.14)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                      {op}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input libre */}
            <div className="d-flex gap-2 px-3 py-3" style={{ borderTop: '1px solid var(--zy-borde)', background: 'var(--zy-tarjeta)' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && enviarLibre()}
                placeholder={modoOtro ? 'Escribe tu respuesta aquí...' : 'Escribe tu mensaje...'}
                className="form-control rounded-3"
                style={{
                  background: 'var(--zy-fondo-alto)',
                  border: `1px solid ${modoOtro ? 'rgba(52,211,153,0.6)' : 'var(--zy-borde-medio)'}`,
                  color: 'var(--zy-texto)',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s'
                }}
              />
              <button onClick={enviarLibre}
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ background: '#25d366', border: 'none', width: 44, height: 44, flexShrink: 0, cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Botón flotante */}
        <div className="d-flex justify-content-end">
          <button onClick={() => setAbierto(!abierto)}
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 62, height: 62, background: '#25d366', border: 'none', boxShadow: '0 4px 20px rgba(37,211,102,0.45)', cursor: 'pointer', position: 'relative', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            {pulso && (
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#25d366', opacity: 0.45, animation: 'pulso 1.6s ease-out infinite' }} />
            )}
            {abierto
              ? <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              : <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            }
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulso {
          0% { transform: scale(1); opacity: 0.45; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  )
}
