/**
 * Los artículos del blog.
 *
 * ⚠️⚠️ QUÉ SE PUBLICA AQUÍ, Y QUÉ NO
 *
 * Solo lo que sabemos por haberlo operado. Un artículo genérico de «5 consejos
 * para elegir un ERP» no lo lee nadie, no lo posiciona Google —hay diez mil
 * iguales— y encima le dice al buscador que este sitio publica relleno.
 *
 * Estos tres salen de problemas reales, medidos, que le han costado dinero a
 * clientes concretos: un comprobante fiscal rechazado, unas vacaciones pagadas
 * dos veces, un inventario que no cuadra. Son las búsquedas que hace alguien
 * con el problema encima, que es exactamente el que puede volverse cliente.
 *
 * ⚠️ No se inventan cifras, ni clientes, ni sentencias legales. Lo que no está
 * medido se dice en cualitativo, y lo que depende del país se dice de qué país
 * es. La normativa fiscal cambia: por eso los artículos avisan de que hay que
 * confirmar con el organismo y llevan `actualizado`.
 *
 * Formato de las secciones: cada `bloque` es un párrafo (string), o
 * `{ lista: [...] }`, o `{ aviso: '...' }`. El HTML simple (<strong>) se
 * permite dentro del texto; lo demás se escapa.
 */

export const ARTICULOS = [
  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'que-comprueba-la-dgii-en-un-ncf',
    titulo: 'Qué comprueba de verdad la DGII en un NCF',
    tema: 'Facturación fiscal · RD',
    color: '#22c55e',
    fecha: '2026-09-25',
    minutos: 7,
    resumen: 'Un NCF se rechaza por lo que no se ve: la secuencia agotada, el tipo que no corresponde al cliente, la fecha fuera de vigencia. Cómo evitarlo.',

    secciones: [
      {
        id: 'el-problema',
        titulo: 'El comprobante se ve bien y aun así lo rechazan',
        bloques: [
          'El Número de Comprobante Fiscal es lo que convierte una factura en un documento con valor tributario en República Dominicana. Y la parte que sorprende a casi todo el que empieza es que <strong>una factura puede estar perfectamente bien emitida —importes correctos, cliente correcto, ITBIS calculado— y aun así no servir</strong>.',
          'El motivo es que el NCF no es un número que uno elige: es una secuencia autorizada por la DGII, con un tipo, un rango y una fecha de vencimiento. Cuando cualquiera de esas tres cosas no encaja, el comprobante deja de ser válido para que el cliente lo use, y eso se descubre tarde: cuando el cliente lo reporta en su 606 y no cuadra.',
          { aviso: 'El síntoma de un NCF mal emitido no es un error en pantalla. Es una llamada del cliente tres meses después diciendo que su contador no puede usar tu factura. Para entonces ya hay que anular y reemitir, con el período fiscal cerrado.' },
        ],
      },
      {
        id: 'las-tres-cosas',
        titulo: 'Las tres cosas que tienen que cuadrar',
        bloques: [
          'Un comprobante válido necesita que coincidan, a la vez, el tipo, la secuencia y la vigencia:',
          {
            lista: [
              '<strong>El tipo tiene que corresponder al cliente.</strong> Un crédito fiscal (tipo 01) es para un cliente con RNC que va a usarlo para deducir. Un consumidor final (02) es para quien no lo va a deducir. Emitir un 02 a una empresa no da error, pero le quita al cliente el derecho a deducir el ITBIS.',
              '<strong>La secuencia tiene que estar dentro del rango autorizado.</strong> Cada rango tiene un número inicial y uno final. Cuando se agota, no se puede seguir numerando: hay que pedir uno nuevo.',
              '<strong>La fecha tiene que estar dentro de la vigencia.</strong> Los rangos caducan. Un NCF emitido después de la fecha de vencimiento de su autorización no vale, aunque el número esté dentro del rango.',
            ],
          },
          'Y hay una cuarta que no es de la DGII pero rompe igual: <strong>la secuencia no puede repetirse ni saltarse</strong>. Un número usado dos veces es un problema serio, y un salto hay que poder justificarlo.',
        ],
      },
      {
        id: 'tipos',
        titulo: 'Los tipos que más se confunden',
        bloques: [
          'La mayoría de los rechazos que hemos visto vienen de elegir mal el tipo, no de un fallo de numeración:',
          {
            lista: [
              '<strong>01 · Crédito fiscal.</strong> Cliente con RNC que va a deducir el ITBIS. Exige el RNC del cliente, y que sea correcto.',
              '<strong>02 · Consumidor final.</strong> Persona física que no deduce. Si se lo emites a una empresa, esa empresa no puede usarlo.',
              '<strong>03 · Nota de débito</strong> y <strong>04 · Nota de crédito.</strong> Modifican un comprobante anterior, y tienen que referenciarlo. Una nota de crédito sin el NCF que corrige queda huérfana.',
              '<strong>11 · Compras.</strong> Lo emite el comprador cuando le compra a alguien que no puede emitir comprobante. Es el que más se olvida.',
              '<strong>14 · Régimen especial</strong> y <strong>15 · Gubernamental.</strong> Para clientes con un régimen particular; usar un 01 con ellos suele acabar en rechazo.',
            ],
          },
          'La regla práctica: <strong>el tipo lo decide quién es el cliente, no qué se le vende</strong>. Ese es el error más repetido.',
        ],
      },
      {
        id: 'lo-que-falla',
        titulo: 'Lo que falla en la práctica',
        bloques: [
          'Después de implantar facturación en bastantes empresas dominicanas, los problemas se repiten con una regularidad llamativa:',
          {
            lista: [
              '<strong>La secuencia se agota un viernes por la tarde.</strong> Nadie vigila cuántos quedan hasta que no queda ninguno, y entonces no se puede facturar. Un aviso al llegar al 80% resuelve el 90% de estos sustos.',
              '<strong>Dos puntos de venta comparten rango.</strong> Si dos cajas toman números del mismo rango sin coordinarse, tarde o temprano emiten el mismo. El número tiene que salir de un único sitio que sepa cuál fue el último.',
              '<strong>El RNC del cliente está mal escrito.</strong> Un dígito cambiado y el comprobante es inservible para deducir. Validar el RNC contra el padrón oficial al capturar el cliente evita el problema entero.',
              '<strong>Se anula mal.</strong> Un comprobante emitido no se borra: se anula y se reporta como anulado. Borrarlo de la base de datos deja un hueco en la secuencia que después hay que explicar.',
            ],
          },
        ],
      },
      {
        id: 'como-se-evita',
        titulo: 'Cómo se evita antes de emitir',
        bloques: [
          'Todo esto es comprobable <strong>antes</strong> de que la factura exista, y ahí es donde un sistema aporta de verdad. Lo que debería pasar al pulsar «Facturar»:',
          {
            lista: [
              'El tipo se propone solo, a partir de si el cliente tiene RNC y de su régimen.',
              'El número sale de la secuencia autorizada, de un único origen, sin posibilidad de repetirse aunque facturen tres cajas a la vez.',
              'Se comprueba la vigencia del rango contra la fecha del documento, no contra la de hoy.',
              'Se avisa cuando quedan pocos comprobantes, con tiempo para pedir la autorización nueva.',
              'La anulación deja el comprobante anulado y reportable, nunca lo borra.',
            ],
          },
          'Ninguna de estas comprobaciones es difícil. Lo difícil es acordarse de hacerlas a mano cada vez, con el cliente esperando en el mostrador.',
          { aviso: 'La normativa fiscal cambia. Este artículo se escribió el 25 de septiembre de 2026 y explica el funcionamiento general; para un caso concreto, confirma siempre con la DGII o con tu contador.' },
        ],
      },
    ],

    cierre: {
      titulo: 'La facturación fiscal, resuelta',
      texto: 'El módulo de Facturación de Zyntello lleva los NCF, sus secuencias y sus vencimientos, y avisa antes de que se agoten. También está el equivalente de Venezuela, Colombia, Guatemala y Costa Rica.',
      boton: 'Ver Facturación',
      href: 'https://zyntello.com/facturacion/',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'el-pago-de-vacaciones-es-un-adelanto',
    titulo: 'El pago de vacaciones es un adelanto',
    tema: 'Nómina · RD',
    color: '#f59e0b',
    fecha: '2026-09-25',
    minutos: 6,
    resumen: 'Se pagan antes del disfrute y se descuentan después. Cuando ese segundo paso falta, la empresa paga el mismo día dos veces y no se entera.',

    secciones: [
      {
        id: 'el-error',
        titulo: 'Un error que no produce ningún error',
        bloques: [
          'Este es probablemente el fallo de nómina más caro que hemos visto, y el que menos ruido hace. No lanza ninguna alerta, no descuadra ninguna cuenta de forma evidente y nadie lo reclama: al trabajador le han pagado de más.',
          'El mecanismo es sencillo. En República Dominicana, <strong>el pago de vacaciones se entrega antes de que el trabajador se vaya</strong>, para que disponga del dinero durante el descanso. Eso significa que en ese momento la empresa está pagando por unos días que <strong>todavía no han pasado</strong>.',
          'Cuando llega el período en que el trabajador efectivamente está de vacaciones, su nómina se calcula como siempre... y vuelve a incluir esos días. Si nadie los descuenta, se pagan dos veces.',
          { aviso: 'El síntoma no es un descuadre: es un coste de personal ligeramente más alto de lo que debería, repartido a lo largo del año. Nadie lo busca porque nadie sabe que está ahí.' },
        ],
      },
      {
        id: 'como-funciona',
        titulo: 'Cómo funciona de verdad el ciclo',
        bloques: [
          'El ciclo completo tiene tres momentos, y el segundo es el que se olvida:',
          {
            lista: [
              '<strong>Se genera el derecho.</strong> El trabajador acumula días según su antigüedad. Esto es un saldo, no un pago.',
              '<strong>Se paga el adelanto.</strong> Antes de salir, se le entrega el importe de los días que va a disfrutar. Contablemente <strong>no es un gasto todavía</strong>: es un anticipo.',
              '<strong>Se descuenta al disfrutar.</strong> En la nómina del período en que estuvo fuera, esos días se descuentan porque ya se le pagaron. Aquí es donde el adelanto se convierte en gasto.',
            ],
          },
          'Saltarse el tercer paso es lo que produce el doble pago. Y es fácil saltárselo, porque el segundo paso suele hacerlo Recursos Humanos y el tercero lo hace la nómina, que es otro proceso y a veces otra persona.',
        ],
      },
      {
        id: 'dos-saldos',
        titulo: 'Los dos saldos que no son el mismo',
        bloques: [
          'Hay una distinción que confunde a casi todo el mundo, y que conviene tener clara porque decide números distintos:',
          {
            lista: [
              '<strong>Días disponibles</strong> son los que el trabajador <strong>puede tomarse</strong> ahora mismo. Es lo que se mira al aprobar una solicitud de vacaciones.',
              '<strong>Días pendientes</strong> son los que <strong>habría que pagarle</strong> si se liquidara hoy. Es lo que se mira al calcular una salida o una provisión.',
            ],
          },
          'No coinciden. Un trabajador puede tener días pendientes que todavía no están disponibles porque no ha cumplido la antigüedad que los libera. Usar un saldo donde tocaba el otro da una cifra plausible y equivocada — y plausible es la parte peligrosa, porque nadie la cuestiona.',
        ],
      },
      {
        id: 'la-provision',
        titulo: 'La provisión que casi nadie lleva',
        bloques: [
          'Hay un tercer efecto, contable esta vez. Los días de vacaciones que los trabajadores han acumulado y no han disfrutado son <strong>una deuda de la empresa</strong>: si mañana se fueran todos, habría que pagarlos.',
          'Cuando esa provisión no se lleva, el resultado del mes se ve mejor de lo que es, y el golpe llega de una vez el mes en que varias personas se van o liquidan. No es una cuestión de purismo contable: es la diferencia entre saber cuánto debes y descubrirlo.',
        ],
      },
      {
        id: 'que-hacer',
        titulo: 'Qué comprobar en tu nómina',
        bloques: [
          'Si no estás seguro de si esto te está pasando, hay tres comprobaciones rápidas:',
          {
            lista: [
              'Coge a un trabajador que se fue de vacaciones hace unos meses. Mira la nómina del período en que estuvo fuera: ¿aparece el descuento de los días adelantados? Si no aparece, se pagó dos veces.',
              'Compara los días disponibles con los pendientes de un trabajador antiguo. Si el sistema te da el mismo número para los dos, es que solo lleva uno.',
              'Busca en el balance la provisión por vacaciones. Si no está, el pasivo real es mayor que el que figura.',
            ],
          },
          { aviso: 'Este artículo describe el funcionamiento habitual en República Dominicana. Las reglas de acumulación, antigüedad y liquidación varían por país; confirma con tu asesor laboral antes de cambiar nada.' },
        ],
      },
    ],

    cierre: {
      titulo: 'La nómina, con el ciclo completo',
      texto: 'El módulo de Nómina de Zyntello lleva el adelanto, el descuento al disfrutar y la provisión, con los dos saldos separados. Está preparado para la legislación dominicana y la de los demás países donde operamos.',
      boton: 'Ver Nómina',
      href: 'https://zyntello.com/nomina/',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'por-que-el-inventario-nunca-cuadra',
    titulo: 'Por qué el inventario nunca cuadra',
    tema: 'Inventario',
    color: '#06b6d4',
    fecha: '2026-09-25',
    minutos: 6,
    resumen: 'La diferencia entre el sistema y la estantería casi nunca es robo: son seis causas concretas, corregibles, y ninguna da un mensaje de error.',

    secciones: [
      {
        id: 'no-es-robo',
        titulo: 'Casi nunca es robo',
        bloques: [
          'Cuando el conteo físico no coincide con el sistema, la primera sospecha suele ser que falta mercancía. A veces es verdad. Pero en la mayoría de los casos que hemos visto, <strong>la mercancía está: lo que falla es el registro</strong>.',
          'Y el registro falla por causas concretas y repetidas, no por mala suerte. Lo que sigue son las seis que aparecen una y otra vez.',
        ],
      },
      {
        id: 'las-causas',
        titulo: 'Las seis causas',
        bloques: [
          {
            lista: [
              '<strong>La mercancía entró antes que el papel.</strong> Llegó el camión, se descargó y se puso en la estantería. La factura del proveedor se registró tres días después, o la semana siguiente. Entre medias, el sistema dice una cosa y el almacén otra — y las ventas de esos días salen de un stock que el sistema no sabe que existe.',
              '<strong>Se vendió sin descontar.</strong> Una venta que no genera movimiento de inventario. Pasa con las facturas hechas por fuera del sistema, con los cambios de última hora y con los módulos que no están conectados entre sí.',
              '<strong>La unidad de medida cambió por el camino.</strong> Se compra por cajas y se vende por unidades. Si la conversión no está bien puesta, el error se multiplica literalmente: una caja de 24 descontada como una unidad deja 23 fantasma.',
              '<strong>Las devoluciones no vuelven.</strong> El cliente devuelve, se le hace la nota de crédito, y la mercancía se queda en un rincón sin volver a entrar en el sistema. Contablemente está devuelta; físicamente está, pero el sistema no la ve.',
              '<strong>Las mermas no se registran.</strong> Lo que se rompe, lo que caduca, lo que se usa internamente. Si no se da de baja, el sistema lo sigue contando durante meses.',
              '<strong>Los traslados quedan a medias.</strong> Salió de un almacén y no llegó a registrarse la entrada en el otro. La mercancía está en la empresa, pero no está en ningún sitio para el sistema.',
            ],
          },
        ],
      },
      {
        id: 'el-costo',
        titulo: 'Y luego está el costo, que es el problema de verdad',
        bloques: [
          'Descuadrar en cantidades es molesto. Descuadrar en costo es lo que se lleva el margen por delante, y es mucho menos visible.',
          'Si el costo de un artículo está mal, <strong>cada venta de ese artículo reporta un margen equivocado</strong>. No hay error, no hay aviso: simplemente el informe de rentabilidad dice algo que no es. Se decide sobre él —qué promocionar, qué descatalogar, a quién comprarle— y se decide mal.',
          { aviso: 'Un ajuste de inventario corrige la CANTIDAD, no el costo. Si entras 10 unidades que faltaban, entran al costo que el sistema ya tenía. Cuando el costo es el que está mal, ajustar cantidades no lo arregla y además lo tapa.' },
        ],
      },
      {
        id: 'como-se-arregla',
        titulo: 'Cómo se arregla, en orden',
        bloques: [
          'El error habitual es empezar por el conteo. Contar un almacén cuyos procesos siguen rotos da un número exacto que vuelve a estar mal en dos semanas. El orden que funciona es:',
          {
            lista: [
              '<strong>Primero, cerrar las entradas y salidas sin registro.</strong> Que no se pueda sacar mercancía sin un documento y que la recepción se registre al recibir, no al facturar.',
              '<strong>Segundo, arreglar las conversiones de unidad.</strong> Es un rato de trabajo y elimina una clase entera de errores.',
              '<strong>Tercero, contar.</strong> Ahora sí, y con el conteo se ajusta.',
              '<strong>Cuarto, conteos cíclicos.</strong> No un inventario general al año, que además obliga a parar. Unos pocos artículos cada semana, empezando por los de más rotación y más valor. Un descuadre se detecta en días y no en meses.',
            ],
          },
          'Lo que no funciona es lo contrario: contar primero y prometer que a partir de ahora se registrará todo. Eso ya se prometió el año pasado.',
        ],
      },
    ],

    cierre: {
      titulo: 'Un inventario que sí cuadra',
      texto: 'El módulo de Inventario de Zyntello registra cada movimiento con su origen, lleva el costo y comparte la misma base de datos que Compras, Facturación y Contabilidad. No hay integración que se pueda quedar a medias.',
      boton: 'Ver Inventario',
      href: 'https://zyntello.com/inventario/',
    },
  },
]
