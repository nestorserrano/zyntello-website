/**
 * Clúster «Facturación y obligaciones fiscales» — un artículo por país.
 *
 * ⚠️⚠️ LA NORMATIVA FISCAL CAMBIA, Y CAMBIA POR RESOLUCIÓN. Estos artículos
 * explican el FUNCIONAMIENTO —qué comprueba el organismo y por qué se rechaza
 * un comprobante—, que es lo estable. Todos cierran avisando de confirmar el
 * caso concreto con el organismo o el contador, y llevan `actualizado` para
 * que se vea de cuándo son.
 *
 * ⚠️ No se citan números de resolución, plazos ni porcentajes que no estemos
 * seguros de que siguen vigentes: un dato fiscal desactualizado en una página
 * pública es peor que no tener la página.
 */

const HOY = '2026-09-26'

export const FISCAL = [
  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'que-comprueba-la-dgii-en-un-ncf',
    titulo: 'Qué comprueba de verdad la DGII en un NCF',
    tema: 'Comprobantes fiscales',
    cluster: 'fiscal',
    pais: 'DO',
    fecha: HOY,
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
          'Ninguna de estas comprobaciones es difícil. Lo difícil es acordarse de hacerlas a mano cada vez, con el cliente esperando en el mostrador. Si además ya estás en <a href="https://zyntello.com/blog/ecf-facturacion-electronica-dominicana/">facturación electrónica con e-CF</a>, el margen para improvisar es aún menor.',
          { aviso: 'La normativa fiscal cambia. Este artículo explica el funcionamiento general a fecha de septiembre de 2026; para un caso concreto, confirma siempre con la DGII o con tu contador.' },
        ],
      },
    ],

    cierre: {
      titulo: 'La facturación fiscal, resuelta',
      texto: 'El módulo de Facturación de Zyntello lleva los NCF, sus secuencias y sus vencimientos, y avisa antes de que se agoten. También está el equivalente de Venezuela, Colombia, Guatemala y Costa Rica.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'ecf-facturacion-electronica-dominicana',
    titulo: 'e-CF: qué cambia de verdad con la facturación electrónica en RD',
    tema: 'Facturación electrónica',
    cluster: 'fiscal',
    pais: 'DO',
    fecha: HOY,
    minutos: 8,
    resumen: 'El e-CF no es «el NCF en PDF». Cambia quién valida, cuándo, y qué pasa si la DGII no responde. Lo que hay que tener listo antes de la fecha.',

    secciones: [
      {
        id: 'no-es-un-pdf',
        titulo: 'El error de partida: creer que es el mismo papel en digital',
        bloques: [
          'La confusión más cara que vemos es esta: pensar que el Comprobante Fiscal Electrónico es la factura de siempre, pero enviada por correo. No lo es. <strong>Cambia quién decide si la factura existe.</strong>',
          'Con el NCF tradicional, tú emites y la DGII se entera después, en tus reportes. Con el e-CF, el documento es un XML firmado digitalmente que <strong>se envía a la DGII y espera su respuesta</strong>. Mientras no haya respuesta, no hay comprobante válido.',
          'Esa diferencia lo cambia todo en el mostrador: si antes un problema informático te dejaba sin imprimir, ahora puede dejarte sin poder facturar. Por eso la implantación no es «instalar un programa»: es revisar qué pasa en tu operación cuando el enlace con la DGII no responde.',
        ],
      },
      {
        id: 'las-piezas',
        titulo: 'Las piezas que hay que tener antes',
        bloques: [
          'No se puede empezar el día de la fecha límite. Lo que hace falta:',
          {
            lista: [
              '<strong>Certificado digital.</strong> Es lo que firma los documentos. Lo emite una entidad de certificación autorizada, tarda en tramitarse y caduca: hay que anotar su vencimiento como se anota el de un seguro.',
              '<strong>Los datos de tus clientes, completos y correctos.</strong> El XML lleva el RNC y la razón social. Lo que hoy pasa porque «el contador lo arregla», ahí lo rechaza una máquina.',
              '<strong>Tu catálogo bien tipificado.</strong> Cada línea lleva su clasificación de impuesto. Un artículo mal marcado como exento se convierte en un rechazo repetido.',
              '<strong>Una respuesta para el fallo.</strong> Qué hace el cajero si no hay internet o la DGII no contesta. Esto se decide antes, no en el momento.',
            ],
          },
        ],
      },
      {
        id: 'contingencia',
        titulo: 'La parte que nadie planifica: cuando falla',
        bloques: [
          'Esta es la conversación que más se pospone y la que más dinero cuesta. Un sistema de facturación electrónica tiene que responder tres preguntas:',
          {
            lista: [
              '<strong>¿Se puede seguir vendiendo?</strong> La respuesta operativa tiene que ser sí. Si no se puede, cada caída del enlace es una tienda cerrada.',
              '<strong>¿Qué se le entrega al cliente mientras tanto?</strong> Tiene que ser algo que después se pueda convertir en el comprobante definitivo, sin volver a teclear la venta.',
              '<strong>¿Quién reenvía lo pendiente y cómo se sabe que se reenvió?</strong> Si la cola de pendientes no está a la vista, se descubre a fin de mes que hay documentos que nunca llegaron.',
            ],
          },
          { aviso: 'La cola de documentos no enviados es la pantalla más importante de un sistema de facturación electrónica, y la que casi ninguna demo enseña. Un documento atascado no da ningún error al vender: la venta sale, el cliente se va, y el comprobante no existe para el fisco.' },
        ],
      },
      {
        id: 'lo-bueno',
        titulo: 'Lo que sí mejora',
        bloques: [
          'No todo es carga. Bien montado, el e-CF resuelve problemas que antes eran crónicos:',
          {
            lista: [
              '<strong>Se acaba el rango agotado.</strong> La numeración deja de depender de un talonario autorizado que se termina un viernes.',
              '<strong>El cliente recibe el comprobante en el momento</strong>, no cuando alguien pasa a buscarlo.',
              '<strong>Los reportes salen de lo mismo que se envió</strong>, no de una captura aparte. Cuadrar deja de ser un trabajo de cierre.',
              '<strong>Las notas de crédito quedan enlazadas</strong> al documento que corrigen, sin depender de que alguien escriba bien la referencia.',
            ],
          },
          'Si aún estás con NCF tradicional, merece la pena leer <a href="https://zyntello.com/blog/que-comprueba-la-dgii-en-un-ncf/">qué comprueba la DGII en un NCF</a>: casi todo lo que hoy te falla ahí, en electrónico te va a fallar más rápido.',
          { aviso: 'El calendario de obligatoriedad va por tamaño de contribuyente y se ha ido ajustando. Confirma en qué grupo estás y con qué fecha directamente con la DGII o con tu contador: es el dato que decide cuánta prisa tienes.' },
        ],
      },
    ],

    cierre: {
      titulo: '¿Te toca el e-CF y no sabes por dónde empezar?',
      texto: 'Te decimos qué te falta de verdad —datos, catálogo, certificado— antes de que la fecha te apriete.',
      ruta: '/fiscal/',
    },
    destino: { ruta: '/fiscal/', texto: 'Ver Fiscal' },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'factura-electronica-colombia-dian',
    titulo: 'Factura electrónica en Colombia: qué valida la DIAN antes de que exista la venta',
    tema: 'Facturación electrónica',
    cluster: 'fiscal',
    pais: 'CO',
    fecha: HOY,
    minutos: 7,
    resumen: 'En Colombia la DIAN valida ANTES: sin validación no hay factura. Qué es el CUFE, por qué se rechaza un documento y qué más hay que emitir.',

    secciones: [
      {
        id: 'validacion-previa',
        titulo: 'La diferencia que lo cambia todo: se valida antes',
        bloques: [
          'Colombia tiene uno de los modelos más estrictos de la región: <strong>validación previa</strong>. La factura electrónica de venta se transmite a la DIAN y <strong>solo es válida cuando la DIAN la valida</strong>. No es un envío informativo: es un permiso.',
          'En la práctica eso significa que la factura no la crea tu sistema: la crea la DIAN al aceptarla. Y por eso el documento lleva el <strong>CUFE</strong>, el código único que identifica esa factura concreta y permite a cualquiera comprobar que existe.',
          { aviso: 'Si vienes de un país donde se factura y se reporta después, este es el cambio de mentalidad: aquí un error de datos no es una corrección posterior, es una venta que no se puede documentar en el momento.' },
        ],
      },
      {
        id: 'por-que-rechaza',
        titulo: 'Por qué la DIAN rechaza un documento',
        bloques: [
          'Los rechazos casi nunca son por el importe. Son por el detalle que nadie revisa:',
          {
            lista: [
              '<strong>Datos del adquiriente incompletos o mal formados.</strong> El NIT con dígito de verificación equivocado, el tipo de persona mal puesto, la responsabilidad tributaria que no corresponde.',
              '<strong>Numeración fuera de la resolución vigente.</strong> El prefijo y el rango están autorizados por resolución, con vigencia. Fuera de eso, no hay factura.',
              '<strong>Impuestos que no cuadran con la base.</strong> Un IVA calculado sobre una base distinta de la declarada, o un artículo exento con impuesto.',
              '<strong>Unidades de medida no válidas.</strong> El estándar exige códigos concretos; «unidad» escrito a mano no es uno.',
            ],
          },
          'La consecuencia práctica: <strong>la calidad de tu maestro de clientes deja de ser un tema administrativo y pasa a ser operativo</strong>. Un cliente mal capturado es una factura que no sale.',
        ],
      },
      {
        id: 'no-solo-la-venta',
        titulo: 'No es solo la factura de venta',
        bloques: [
          'El error de alcance más común es preparar solo la factura de venta. El sistema colombiano abarca más:',
          {
            lista: [
              '<strong>Notas crédito y débito electrónicas</strong>, que referencian la factura que corrigen.',
              '<strong>Documento soporte</strong> para compras a quienes no están obligados a facturar electrónicamente. Si le compras a un no obligado, el documento lo emites tú.',
              '<strong>Nómina electrónica</strong>, que es un envío distinto, con su propia periodicidad, y que suele pillar por sorpresa a quien creía que esto era solo de facturación.',
              '<strong>Eventos del adquiriente</strong> —acuse de recibo, aceptación— que en ciertos casos son los que permiten que la factura circule como título valor.',
            ],
          },
          'Si vas a operar también con nómina, conviene mirar <a href="https://zyntello.com/blog/nomina-colombia-seguridad-social/">cómo se calcula la nómina en Colombia</a>, porque la electrónica se alimenta de ese cálculo: si el cálculo está mal, el envío también.',
        ],
      },
      {
        id: 'multipais',
        titulo: 'Si operas en varios países a la vez',
        bloques: [
          'Aquí está el problema que casi nadie anticipa: <strong>la fiscalidad no se configura, se implementa</strong>. Colombia valida antes, República Dominicana tiene su propio esquema, Guatemala trabaja con certificadores y Costa Rica con su formato y su aceptación del receptor. No son variantes de lo mismo.',
          'Un sistema que dice «soporta multipaís» puede significar dos cosas muy distintas: que tiene los cuatro regímenes implementados de verdad, o que tiene un campo donde escribes el nombre del impuesto. La pregunta que lo distingue: <em>enséñame una factura emitida y validada de cada país</em>.',
          { aviso: 'La normativa colombiana se actualiza por resolución con cierta frecuencia y hay plazos que dependen de tu actividad y tamaño. Confirma tu caso concreto con la DIAN o con tu contador antes de tomar decisiones de calendario.' },
        ],
      },
    ],

    cierre: {
      titulo: '¿Facturas en Colombia y en otro país a la vez?',
      texto: 'Zyntello lleva la fiscalidad de cada país dentro del mismo sistema, con los datos compartidos y los comprobantes separados como exige cada organismo.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'fel-guatemala-factura-electronica-en-linea',
    titulo: 'FEL en Guatemala: el certificador, el DTE y lo que se rompe al cambiar',
    tema: 'Facturación electrónica',
    cluster: 'fiscal',
    pais: 'GT',
    fecha: HOY,
    minutos: 6,
    resumen: 'En Guatemala hay una pieza intermedia que no existe en otros países: el certificador. Qué implica, qué datos exige el DTE y dónde falla la migración.',

    secciones: [
      {
        id: 'el-certificador',
        titulo: 'La pieza que no existe en otros países',
        bloques: [
          'El régimen de Factura Electrónica en Línea guatemalteco introduce un actor que sorprende a quien viene de fuera: <strong>el certificador</strong>. Tu sistema no habla directamente con la SAT; habla con un certificador autorizado, que certifica el documento y lo registra.',
          'Eso tiene una consecuencia práctica inmediata: <strong>eliges proveedor, y esa elección te ata</strong>. El formato del documento es el mismo, pero la integración no. Cambiar de certificador no es cambiar una clave: es rehacer la conexión.',
          { aviso: 'Antes de firmar con un certificador, pregunta qué pasa si te quieres ir: si te llevas el histórico, en qué formato, y cuánto tarda la baja. Es la conversación que nadie tiene al principio y que todos acaban teniendo.' },
        ],
      },
      {
        id: 'el-dte',
        titulo: 'El DTE y lo que exige',
        bloques: [
          'El Documento Tributario Electrónico es el documento en sí, y una vez certificado queda identificado de forma única. Lo que hay que tener en orden para que salga:',
          {
            lista: [
              '<strong>El NIT del receptor, válido.</strong> Para consumidor final hay una forma concreta de indicarlo; ponerlo mal convierte una venta normal en un documento cuestionable.',
              '<strong>El tipo de documento correcto.</strong> Factura, nota de crédito, nota de débito y los tipos especiales según la actividad. Cada uno con sus reglas.',
              '<strong>Los impuestos bien clasificados.</strong> Además del IVA, hay actividades con impuestos específicos que van marcados aparte.',
              '<strong>Las frases obligatorias según el régimen.</strong> Un documento al que le falta la leyenda que le corresponde puede quedar incompleto aunque los números estén perfectos.',
            ],
          },
        ],
      },
      {
        id: 'la-migracion',
        titulo: 'Dónde se rompe la migración',
        bloques: [
          'De lo que hemos visto acompañando migraciones, esto es lo que de verdad cuesta:',
          {
            lista: [
              '<strong>El maestro de clientes.</strong> Años de NIT capturados a ojo, con espacios, guiones y algún «CF» escrito de seis maneras distintas. Se limpia antes o se limpia con el cliente esperando.',
              '<strong>Las ventas de mostrador.</strong> Donde se facturaba rápido y se corregía después, ahora hay que acertar a la primera.',
              '<strong>La anulación.</strong> Anular un DTE tiene sus reglas y sus plazos; no es borrar una línea. Quien no lo interioriza acumula documentos que debió anular y ya no puede.',
              '<strong>El histórico.</strong> Lo emitido antes sigue existiendo y hay que poder consultarlo. Un sistema nuevo que no se lleva el pasado deja a la empresa con dos sitios donde mirar.',
            ],
          },
        ],
      },
      {
        id: 'que-pedirle',
        titulo: 'Qué pedirle a un sistema aquí',
        bloques: [
          'Con FEL ya obligatorio de forma general, la pregunta no es si emite: es cómo se comporta cuando algo va mal.',
          {
            lista: [
              'Que la cola de documentos pendientes de certificar esté a la vista, no escondida en un log.',
              'Que se pueda seguir vendiendo si el certificador no responde, y que lo pendiente se recupere solo.',
              'Que el NIT se valide al capturar el cliente, no al emitir.',
              'Que las anulaciones respeten el plazo y avisen antes de que se pase.',
            ],
          },
          { aviso: 'Este artículo describe el funcionamiento general a septiembre de 2026. Las obligaciones concretas dependen de tu régimen y actividad: confírmalas con la SAT o con tu contador.' },
        ],
      },
    ],

    cierre: {
      titulo: '¿Operas en Guatemala?',
      texto: 'Zyntello contempla la facturación guatemalteca junto con la del resto de países donde trabajamos, en un solo sistema y con los datos compartidos.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'factura-electronica-costa-rica-hacienda',
    titulo: 'Costa Rica: la clave numérica, el consecutivo y la respuesta del receptor',
    tema: 'Facturación electrónica',
    cluster: 'fiscal',
    pais: 'CR',
    fecha: HOY,
    minutos: 6,
    resumen: 'En Costa Rica el comprobante no acaba al enviarlo: el receptor responde. Qué es la clave numérica, por qué el consecutivo no se puede improvisar y qué pasa si no aceptas.',

    secciones: [
      {
        id: 'dos-numeros',
        titulo: 'Dos números que la gente confunde',
        bloques: [
          'El sistema costarricense trabaja con dos identificadores distintos, y mezclarlos es el origen de buena parte de los problemas:',
          {
            lista: [
              '<strong>La clave numérica</strong> identifica el comprobante de forma única a nivel nacional. Se compone siguiendo una estructura fija, y cualquier desviación la invalida.',
              '<strong>El consecutivo</strong> es tu numeración: lleva la sucursal, el terminal y el tipo de documento. Es tuyo, pero su formato está definido.',
            ],
          },
          'La consecuencia: <strong>ninguno de los dos se puede «inventar» ni reasignar</strong>. Si tu sistema permite editar a mano cualquiera de ellos, tarde o temprano vas a tener dos documentos peleándose por el mismo número.',
        ],
      },
      {
        id: 'el-receptor-responde',
        titulo: 'Lo que casi nadie tiene montado: la respuesta del receptor',
        bloques: [
          'Aquí está la particularidad que más se pasa por alto. En Costa Rica no basta con que tú emitas: <strong>cuando recibes un comprobante, se espera que respondas</strong> —aceptándolo, aceptándolo parcialmente o rechazándolo—.',
          'Y eso convierte una tarea que parecía de ventas en una tarea de compras. Si tu proveedor te factura algo que no pediste, o con un precio que no es, la respuesta no es una llamada: es un rechazo documentado.',
          { aviso: 'Las empresas que solo montan la parte de emisión descubren esto meses después, con una acumulación de comprobantes recibidos sin responder. No hay un error que avise: simplemente no se hizo.' },
        ],
      },
      {
        id: 'version',
        titulo: 'El formato cambia, y cambiarlo no es opcional',
        bloques: [
          'El esquema del comprobante ha ido evolucionando por versiones, y cada cambio de versión tiene una fecha a partir de la cual la anterior deja de aceptarse. Es un mantenimiento recurrente, no una instalación.',
          'Eso es algo a preguntar antes de elegir sistema: <strong>quién se encarga de actualizar el formato cuando Hacienda publica una versión nueva, y si eso viene en la suscripción o se factura aparte</strong>. En un sistema que no lo actualiza, la fecha del cambio es el día en que dejas de poder facturar.',
        ],
      },
      {
        id: 'lo-practico',
        titulo: 'Lo que conviene tener resuelto',
        bloques: [
          {
            lista: [
              '<strong>La identificación del receptor, validada al capturarla.</strong> Cédula física, jurídica, DIMEX o NITE tienen formatos distintos y no son intercambiables.',
              '<strong>Los consecutivos por sucursal y terminal</strong>, saliendo de un único sitio, aunque facturen varios puntos a la vez.',
              '<strong>La bandeja de comprobantes recibidos</strong>, con los que faltan por responder a la vista.',
              '<strong>La cola de envíos pendientes</strong>, para que una caída del enlace no se convierta en documentos que nunca llegaron.',
            ],
          },
          { aviso: 'Las versiones del formato y los plazos los publica Hacienda y se actualizan periódicamente. Confirma la versión vigente y tus obligaciones concretas con Hacienda o con tu contador.' },
        ],
      },
    ],

    cierre: {
      titulo: '¿Facturas en Costa Rica?',
      texto: 'La facturación costarricense está contemplada en Zyntello junto con la de los demás países donde operamos, dentro del mismo sistema.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'facturacion-venezuela-iva-igtf',
    titulo: 'Venezuela: facturar con dos monedas, IVA e IGTF sin perder el margen',
    tema: 'Facturación',
    cluster: 'fiscal',
    pais: 'VE',
    fecha: HOY,
    minutos: 7,
    resumen: 'Facturar en Venezuela no es un problema fiscal: es un problema de tasa. Qué tasa manda en cada documento y por qué el margen se pierde entre la venta y el cobro.',

    secciones: [
      {
        id: 'el-problema-real',
        titulo: 'El problema no es el impuesto: es la tasa',
        bloques: [
          'Quien nunca ha operado en Venezuela asume que lo difícil es el régimen fiscal. Quien opera allí sabe que lo difícil es otra cosa: <strong>entre que vendes y que cobras, el valor de lo que facturaste cambió</strong>.',
          'Eso convierte una decisión que en otros países es contable —qué tasa aplicar— en una decisión de negocio que se toma varias veces al día. Y si el sistema no la toma bien, el margen desaparece sin que ningún informe lo diga: la venta figura correcta, el cobro figura correcto, y la diferencia se la comió la tasa.',
          { aviso: 'El síntoma es una empresa que vende con margen en el papel y no tiene dinero en la cuenta. No hay un error en ninguna parte: hay una tasa aplicada en el momento equivocado.' },
        ],
      },
      {
        id: 'que-tasa',
        titulo: 'Qué tasa manda en cada momento',
        bloques: [
          'La regla que evita la mayoría de los descuadres es tener claro que <strong>un documento se valora con la tasa de SU fecha, no con la de hoy</strong>. Suena obvio y es justo lo que casi ningún sistema hace bien:',
          {
            lista: [
              '<strong>La factura</strong> lleva la tasa del día en que se emitió. Esa no se vuelve a tocar nunca.',
              '<strong>El cobro</strong> lleva la del día en que se cobró. Si es distinta, la diferencia es un resultado, no un error que corregir.',
              '<strong>El saldo pendiente</strong> se valora con la tasa del momento en que se consulta, y por eso cambia aunque el cliente no haya pagado nada.',
              '<strong>El inventario</strong> mantiene el costo al que entró. Revalorarlo con cada movimiento de tasa convierte el margen en ruido.',
            ],
          },
          'Un sistema que guarda solo el importe en una moneda y convierte al mostrarlo está condenado a mentir: reescribe el pasado cada vez que cambia la tasa. El importe y su tasa van juntos, en el documento, para siempre.',
        ],
      },
      {
        id: 'impuestos',
        titulo: 'El IVA y el impuesto a las transacciones',
        bloques: [
          'A lo anterior se suman las obligaciones propias. El IVA con su alícuota y sus retenciones según el tipo de contribuyente, y el <strong>impuesto a las grandes transacciones financieras</strong>, que grava ciertos pagos —señaladamente los hechos en divisas— y que en la práctica <strong>cambia el importe final del cobro según cómo te paguen</strong>.',
          'Eso último es lo que rompe más sistemas: el total de la factura y el total del cobro no coinciden, y no por un error. El sistema tiene que saber calcularlo y dejarlo registrado por separado, no metido dentro del precio.',
          { aviso: 'Las alícuotas, los porcentajes de retención y el alcance del IGTF se modifican por providencia y han cambiado varias veces. Confirma los vigentes con el SENIAT o con tu contador: aquí se explica el mecanismo, no los números.' },
        ],
      },
      {
        id: 'que-pedir',
        titulo: 'Qué pedirle a un sistema para Venezuela',
        bloques: [
          {
            lista: [
              'Que cada documento guarde <strong>su</strong> tasa, y que esa tasa no se pueda recalcular después.',
              'Que la diferencia entre la tasa de la factura y la del cobro salga como diferencia cambiaria, con su cuenta, y no diluida en el ingreso.',
              'Que el IGTF se calcule y se registre aparte, no sumado al precio.',
              'Que los reportes se puedan ver en las dos monedas sin rehacer los cálculos a mano.',
            ],
          },
          'Si operas en varios países, el mismo razonamiento aplica a cualquier moneda: lo explicamos con más detalle en <a href="https://zyntello.com/blog/diferencia-cambiaria-donde-se-pierde-el-margen/">dónde se pierde el margen con la diferencia cambiaria</a>.',
        ],
      },
    ],

    cierre: {
      titulo: '¿Operas en Venezuela?',
      texto: 'Zyntello es multimoneda de punta a punta: cada documento con su tasa, la diferencia cambiaria calculada al cobrar y los reportes en las dos monedas.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'formatos-606-607-dgii-que-los-descuadra',
    titulo: 'Los formatos 606 y 607: por qué nunca cuadran a la primera',
    tema: 'Reportes fiscales',
    cluster: 'fiscal',
    pais: 'DO',
    fecha: HOY,
    minutos: 6,
    resumen: 'El 606 y el 607 no fallan por el total: fallan por el detalle. Las seis causas que hacen perder un día entero cada mes, y cómo se evitan desde la captura.',

    secciones: [
      {
        id: 'el-ritual',
        titulo: 'El ritual mensual que no debería existir',
        bloques: [
          'En muchas empresas dominicanas hay un día al mes dedicado a cuadrar el 606 y el 607. Se exporta, no cuadra, se revisa línea por línea, se corrige a mano y se envía. Al mes siguiente, igual.',
          'Lo llamativo es que <strong>casi ninguna de las causas está en el reporte</strong>. Están en la captura, semanas antes. El reporte solo es donde se hacen visibles.',
        ],
      },
      {
        id: 'las-causas',
        titulo: 'Las seis causas, por orden de frecuencia',
        bloques: [
          {
            lista: [
              '<strong>El RNC del proveedor está mal o falta.</strong> Un dígito cambiado y la línea no cruza con lo que el proveedor reportó.',
              '<strong>El tipo de bien o servicio está mal clasificado.</strong> Es un campo que se rellena por costumbre al crear el proveedor y nadie revisa después.',
              '<strong>La retención no se aplicó donde tocaba.</strong> O se aplicó donde no tocaba. Las dos descuadran, y en direcciones distintas.',
              '<strong>El NCF de la compra no se capturó.</strong> Se pagó la factura, se contabilizó el gasto, y el número del comprobante quedó en el papel.',
              '<strong>La fecha del documento y la del período no coinciden.</strong> Una factura de fin de mes registrada el día 2 acaba en el período equivocado.',
              '<strong>Hay comprobantes anulados que siguen como válidos</strong>, o borrados que deberían figurar como anulados.',
            ],
          },
        ],
      },
      {
        id: 'donde-se-arregla',
        titulo: 'Se arregla en la captura, no en el reporte',
        bloques: [
          'La conclusión práctica: <strong>cada corrección que haces en el Excel del 606 es una validación que faltaba tres semanas antes</strong>. Mientras el arreglo viva en el reporte, el mes que viene vuelve.',
          'Lo que sí lo cierra:',
          {
            lista: [
              'El RNC se valida contra el padrón oficial al crear el proveedor, no al reportar.',
              'El tipo de bien o servicio es obligatorio en el proveedor, y el documento lo hereda.',
              'La retención se propone sola según el tipo de proveedor y de servicio, en vez de acordarse.',
              'No se puede registrar una compra con comprobante fiscal sin su NCF.',
              'El período se decide por la fecha del documento, no por la de captura.',
            ],
          },
          'Es el mismo principio que con <a href="https://zyntello.com/blog/que-comprueba-la-dgii-en-un-ncf/">los NCF de venta</a>: lo que no se valida al capturar, se paga al reportar.',
          { aviso: 'Los formatos y sus campos los define la DGII y se actualizan. Confirma la estructura vigente con la DGII o con tu contador antes de automatizar nada.' },
        ],
      },
    ],

    cierre: {
      titulo: 'Que el 606 cuadre sin el día de cada mes',
      texto: 'En Zyntello los reportes salen de lo que ya está capturado y validado, no de un Excel que alguien arma y corrige. El día del mes se recupera.',
      ruta: '/fiscal/',
    },
    destino: { ruta: '/fiscal/', texto: 'Ver Fiscal' },
  },
]
