/**
 * Los grupos temáticos del blog y la landing que alimenta cada uno.
 *
 * ⚠️⚠️ EL BLOG NO EXISTE PARA «TENER CONTENIDO». Cada artículo entra en un
 * grupo, y cada grupo empuja a una página comercial concreta. Un artículo que
 * no lleva a ninguna parte es tráfico que se va, y encima le dice a Google que
 * este sitio publica por publicar.
 *
 * ⚠️ El `destino` es la landing que el artículo alimenta. Sale en el cierre y
 * en los enlaces del cuerpo. Si un artículo no tiene a dónde llevar, el que
 * sobra es el artículo.
 *
 * ⚠️ Los países usan el código de dos letras. `null` = vale para todos: no se
 * le pone bandera de ninguno para no dar a entender que solo aplica allí.
 */

export const PAISES = {
  DO: 'República Dominicana',
  VE: 'Venezuela',
  CO: 'Colombia',
  GT: 'Guatemala',
  CR: 'Costa Rica',
}

export const CLUSTERS = {
  fiscal: {
    nombre: 'Facturación y obligaciones fiscales',
    entradilla: 'Lo que cada organismo comprueba de verdad en un comprobante, país por país. Un documento rechazado no es papeleo: es una venta que no se puede cobrar y un cliente que no puede deducir.',
    destino: { ruta: '/facturacion/', texto: 'Ver Facturación' },
    color: '#22c55e',
  },
  nomina: {
    nombre: 'Nómina y obligaciones laborales',
    entradilla: 'Cálculos que se pagan dos veces, prestaciones que nadie provisiona y aportes que cambian según el país. La nómina es el gasto más grande de casi toda empresa y el que menos se revisa.',
    destino: { ruta: '/nomina/', texto: 'Ver Nómina' },
    color: '#f59e0b',
  },
  inventario: {
    nombre: 'Inventario y abastecimiento',
    entradilla: 'Por qué el sistema y la estantería nunca dicen lo mismo, qué costo usar y cuándo volver a pedir. Descuadrar en cantidades molesta; descuadrar en costo se lleva el margen.',
    destino: { ruta: '/inventario/', texto: 'Ver Inventario' },
    color: '#06b6d4',
  },
  cobros: {
    nombre: 'Cobros y crédito a clientes',
    entradilla: 'Vender no es cobrar. Lo que decide si una venta a crédito acaba en el banco o en una incobrable se hace antes de facturar, no cuando el cliente deja de contestar.',
    destino: { ruta: '/cxc/', texto: 'Ver Cuentas por Cobrar' },
    color: '#ec4899',
  },
  compras: {
    nombre: 'Compras y pagos a proveedores',
    entradilla: 'Lo que se paga de más casi nunca es un robo: es una factura que nadie comparó con lo que llegó, una retención mal aplicada o un costo de importación que se quedó fuera.',
    destino: { ruta: '/compras/', texto: 'Ver Compras' },
    color: '#a78bfa',
  },
  contabilidad: {
    nombre: 'Contabilidad y cierre',
    entradilla: 'El cierre que tarda tres semanas, los centros de costo que nadie usa y la diferencia cambiaria que aparece sola. Contabilidad no es teneduría: es de dónde salen las decisiones.',
    destino: { ruta: '/contabilidad/', texto: 'Ver Contabilidad' },
    color: '#3b82f6',
  },
  tesoreria: {
    nombre: 'Bancos y flujo de caja',
    entradilla: 'Saber cuánto hay es fácil. Saber cuánto habrá dentro de tres semanas es lo que decide si se compra, se contrata o se aguanta.',
    destino: { ruta: '/bancos/', texto: 'Ver Bancos' },
    color: '#14b8a6',
  },
  erp: {
    nombre: 'Elegir y sacarle partido a un ERP',
    entradilla: 'Casi nadie abandona un ERP porque le falte una función. Lo abandonan por cosas que se deciden antes de firmar, y que casi ningún vendedor menciona.',
    destino: { ruta: '/erp/', texto: 'Ver el ERP completo' },
    color: '#6366f1',
  },
  verticales: {
    nombre: 'Por tipo de negocio',
    entradilla: 'Un restaurante, un condominio, un lavadero y una financiera no tienen el mismo problema. Lo que en uno es un detalle, en otro es el negocio entero.',
    destino: { ruta: '/#soluciones', texto: 'Ver los 34 módulos' },
    color: '#fb7185',
  },
}
