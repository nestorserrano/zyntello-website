/**
 * Clústeres de operación diaria: inventario, cobros y compras.
 *
 * ⚠️ Van en un solo archivo porque comparten el mismo origen: lo que la ayuda
 * del producto avisa y ninguna ficha comercial dice. Separarlos en tres
 * archivos de 300 líneas no añadiría nada — el `cluster` de cada artículo ya
 * los reparte en el índice.
 *
 * ⚠️ Aquí NO hay normativa que caduque, así que no llevan el aviso de
 * confirmar con el organismo: salvo las retenciones, que sí lo llevan.
 */

const HOY = '2026-09-26'

export const OPERACIONES = [
  /* ═══════════════════ INVENTARIO ══════════════════════════════════════ */
  {
    slug: 'por-que-el-inventario-nunca-cuadra',
    titulo: 'Por qué el inventario nunca cuadra',
    tema: 'Control de inventario',
    cluster: 'inventario',
    pais: null,
    fecha: HOY,
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
              '<strong>La mercancía entró antes que el papel.</strong> Llegó el camión, se descargó y se puso en la estantería. La factura del proveedor se registró tres días después. Entre medias, el sistema dice una cosa y el almacén otra — y las ventas de esos días salen de un stock que el sistema no sabe que existe.',
              '<strong>Se vendió sin descontar.</strong> Una venta que no genera movimiento de inventario. Pasa con las facturas hechas por fuera del sistema y con los módulos que no están conectados entre sí.',
              '<strong>La unidad de medida cambió por el camino.</strong> Se compra por cajas y se vende por unidades. Si la conversión no está bien puesta, el error se multiplica literalmente: una caja de 24 descontada como una unidad deja 23 fantasma.',
              '<strong>Las devoluciones no vuelven.</strong> El cliente devuelve, se le hace la nota de crédito, y la mercancía se queda en un rincón sin volver a entrar en el sistema.',
              '<strong>Las mermas no se registran.</strong> Lo que se rompe, lo que caduca, lo que se usa internamente. Si no se da de baja, el sistema lo sigue contando durante meses.',
              '<strong>Los traslados quedan a medias.</strong> Salió de un almacén y no llegó a registrarse la entrada en el otro. Está en la empresa, pero no está en ningún sitio para el sistema.',
            ],
          },
        ],
      },
      {
        id: 'el-costo',
        titulo: 'Y luego está el costo, que es el problema de verdad',
        bloques: [
          'Descuadrar en cantidades es molesto. Descuadrar en costo es lo que se lleva el margen por delante, y es mucho menos visible.',
          'Si el costo de un artículo está mal, <strong>cada venta de ese artículo reporta un margen equivocado</strong>. No hay error, no hay aviso: el informe de rentabilidad dice algo que no es. Se decide sobre él —qué promocionar, qué descatalogar, a quién comprarle— y se decide mal. Lo desarrollamos en <a href="https://zyntello.com/blog/costo-promedio-o-peps-cual-usar/">costo promedio o PEPS</a>.',
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
              '<strong>Cuarto, conteos cíclicos.</strong> No un inventario general al año, que además obliga a parar. Unos pocos artículos cada semana, empezando por los de más rotación y más valor.',
            ],
          },
          'Lo que no funciona es lo contrario: contar primero y prometer que a partir de ahora se registrará todo. Eso ya se prometió el año pasado.',
        ],
      },
    ],

    cierre: {
      titulo: 'Un inventario que sí cuadra',
      texto: 'El módulo de Inventario de Zyntello registra cada movimiento con su origen, lleva el costo y comparte la misma base de datos que Compras, Facturación y Contabilidad. No hay integración que se pueda quedar a medias.',
    },
  },

  {
    slug: 'costo-promedio-o-peps-cual-usar',
    titulo: 'Costo promedio o PEPS: cuál usar y por qué casi nadie puede cambiar después',
    tema: 'Costeo',
    cluster: 'inventario',
    pais: null,
    fecha: HOY,
    minutos: 6,
    resumen: 'La decisión parece contable y es de negocio: cambia el margen que ves, el valor del inventario y lo que declaras. Y cambiarla más tarde reescribe la historia.',

    secciones: [
      {
        id: 'la-pregunta',
        titulo: 'La pregunta que casi nadie hace al empezar',
        bloques: [
          'Compras el mismo artículo tres veces a tres precios distintos. Vendes una unidad. <strong>¿Cuánto te costó esa unidad?</strong>',
          'No hay una respuesta única, y por eso existen los métodos de costeo. Los dos que más se usan en la región:',
          {
            lista: [
              '<strong>Costo promedio.</strong> Cada entrada recalcula un promedio ponderado, y las salidas van a ese promedio. Suaviza las subidas y bajadas.',
              '<strong>PEPS (primero en entrar, primero en salir).</strong> Lo que sale es lo más antiguo, a su costo original. El inventario que queda está valorado a los precios más recientes.',
            ],
          },
          'Con precios estables da casi igual. Con precios que se mueven —que es lo normal en importación o con tipo de cambio— la diferencia en el margen declarado es grande.',
        ],
      },
      {
        id: 'que-cambia',
        titulo: 'Qué cambia de verdad al elegir uno',
        bloques: [
          {
            lista: [
              '<strong>El margen que ves en cada venta.</strong> Con precios subiendo, el promedio da un costo más bajo que el último precio de compra, así que el margen se ve mejor de lo que será reponer.',
              '<strong>El valor del inventario en el balance.</strong> PEPS deja el stock valorado a precios recientes; el promedio, a una mezcla.',
              '<strong>Lo que declaras.</strong> El costo de ventas cambia, y con él el resultado.',
              '<strong>Las decisiones de precio.</strong> Fijar el precio de venta sobre un costo promedio viejo en un entorno de precios al alza es como vender al precio del año pasado.',
            ],
          },
          { aviso: 'El riesgo más práctico del promedio en época de subidas: vendes con margen contable positivo y no te alcanza para reponer la misma unidad. El informe dice que ganaste; la caja dice que no.' },
        ],
      },
      {
        id: 'cambiar-despues',
        titulo: 'Por qué cambiar después es tan caro',
        bloques: [
          'Aquí está la parte que sorprende: <strong>el método de costeo no es un interruptor</strong>. Cambiarlo obliga a recalcular el histórico o a cortar por una fecha, y cualquiera de las dos cosas rompe la comparabilidad de los informes.',
          'Además, en muchos marcos contables el criterio debe mantenerse en el tiempo y su cambio se justifica. No es algo que se decida un martes porque los números salen más bonitos.',
          'La recomendación práctica: decidirlo al implantar, por escrito, con el contador delante — no el día que alguien nota que el margen no cuadra.',
        ],
      },
      {
        id: 'lo-que-rompe',
        titulo: 'Lo que rompe cualquiera de los dos',
        bloques: [
          'Da igual el método si el dato de entrada está mal. Lo que invalida el costeo, sea cual sea:',
          {
            lista: [
              '<strong>Recibir sin costo.</strong> Una entrada a cero envenena el promedio para siempre y no da error.',
              '<strong>Dejar fuera los costos de importación.</strong> Flete, seguro y aranceles son parte del costo, no gasto aparte. Lo vemos en <a href="https://zyntello.com/blog/costo-real-de-una-importacion/">el costo real de una importación</a>.',
              '<strong>Ajustar cantidades para tapar un problema de costo.</strong> Un ajuste mantiene el costo: no arregla nada y esconde la causa.',
              '<strong>Registrar la factura del proveedor a un precio distinto del de la recepción</strong> sin que el sistema reconozca la diferencia.',
            ],
          },
        ],
      },
    ],

    cierre: {
      titulo: 'El costo, bien llevado desde la entrada',
      texto: 'En Zyntello el costo se forma en la recepción, con los gastos de importación repartidos, y las ventas salen a ese costo. El margen del informe es el margen real.',
      ruta: '/inventario/',
    },
  },

  {
    slug: 'lotes-y-vencimientos-cuando-hacen-falta',
    titulo: 'Lotes y vencimientos: cuándo hacen falta de verdad y qué cuesta no tenerlos',
    tema: 'Trazabilidad',
    cluster: 'inventario',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'Llevar lotes da trabajo y no todo el mundo lo necesita. Pero cuando hace falta y no está, el coste no es operativo: es una retirada de producto que no se puede acotar.',

    secciones: [
      {
        id: 'cuando',
        titulo: 'Cuándo hace falta y cuándo es sobrecarga',
        bloques: [
          'Llevar lotes obliga a identificar cada entrada y a elegir de qué lote sale cada salida. Es trabajo real en el almacén, y no siempre compensa.',
          'Hace falta cuando se cumple alguna de estas:',
          {
            lista: [
              'El producto caduca — alimentación, farmacia, química, cosmética.',
              'Hay que poder retirar del mercado un grupo concreto sin retirarlo todo.',
              'La normativa del sector exige trazabilidad hacia el cliente final.',
              'El proveedor factura garantías por lote, o los defectos vienen agrupados.',
            ],
          },
          'Si no se cumple ninguna, llevarlos por si acaso solo añade pasos al almacén.',
        ],
      },
      {
        id: 'el-coste-de-no',
        titulo: 'Lo que cuesta no tenerlos, cuando hacían falta',
        bloques: [
          'El coste no aparece hasta el día del problema, y entonces aparece entero:',
          {
            lista: [
              '<strong>Una retirada que no se puede acotar.</strong> Si no sabes qué unidades venían de ese lote, retiras todo el producto y avisas a todos los clientes.',
              '<strong>Caducados que se descubren en la estantería.</strong> Sin fecha en el sistema, nadie avisa antes; lo detecta el cliente o el conteo.',
              '<strong>No se puede vender por orden de caducidad.</strong> Sale lo que está delante, y lo que está detrás caduca.',
              '<strong>La reclamación al proveedor es imposible de sostener</strong> sin poder demostrar de qué entrega venía la mercancía defectuosa.',
            ],
          },
          { aviso: 'El caso que convence a todo el mundo: un cliente llama por un producto en mal estado. Con lote, sabes qué otras unidades de esa entrega salieron y a quién. Sin lote, la respuesta honesta es «no lo sé».' },
        ],
      },
      {
        id: 'lo-practico',
        titulo: 'Lo que hay que resolver para que se use',
        bloques: [
          'La trazabilidad se abandona cuando estorba. Lo que decide que siga viva:',
          {
            lista: [
              'Que el lote se capture al recibir, con lectura de código si se puede, y no tecleando.',
              'Que al vender, el sistema <strong>proponga</strong> el lote que toca —el más próximo a caducar— en vez de preguntar.',
              'Que avise de lo que va a caducar con margen para moverlo, no cuando ya caducó.',
              'Que desde un lote se pueda ver a qué clientes fue, y desde una venta, de qué lote salió. En los dos sentidos.',
            ],
          },
          'Y un detalle que se pasa por alto: <strong>los lotes también entran en el conteo</strong>. Contar 40 unidades sin saber de qué lotes deja el inventario cuadrado en total y descuadrado en detalle.',
        ],
      },
    ],

    cierre: {
      titulo: 'Trazabilidad que no estorba',
      texto: 'Inventario de Zyntello lleva lotes y fechas de vencimiento, propone el lote al vender y avisa de lo que va a caducar con tiempo.',
      ruta: '/inventario/',
    },
  },

  {
    slug: 'punto-de-reorden-cuando-volver-a-pedir',
    titulo: 'Cuándo volver a pedir: el cálculo que evita quedarse sin y comprar de más',
    tema: 'Abastecimiento',
    cluster: 'inventario',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'Comprar cuando se acaba llega tarde. El punto de reorden no es una cifra fija: depende de cuánto vendes, cuánto tarda el proveedor y cuánto varían los dos.',

    secciones: [
      {
        id: 'los-dos-errores',
        titulo: 'Los dos errores cuestan lo mismo',
        bloques: [
          'Quedarse sin producto y comprar de más parecen problemas opuestos, y los dos salen de lo mismo: no saber cuándo pedir.',
          {
            lista: [
              '<strong>Quedarse sin</strong> es una venta perdida y, a veces, un cliente que descubre que el competidor sí tenía.',
              '<strong>Comprar de más</strong> es dinero parado en una estantería, con riesgo de caducar o quedarse obsoleto.',
            ],
          },
          'La empresa que compra «cuando se ve poco» suele tener las dos cosas a la vez: exceso de lo que rota lento y faltantes de lo que rota rápido.',
        ],
      },
      {
        id: 'el-calculo',
        titulo: 'El cálculo, sin misterio',
        bloques: [
          'El punto de reorden es la cantidad a la que hay que lanzar el pedido para que llegue antes de acabarse. Se construye con tres cosas:',
          {
            lista: [
              '<strong>Cuánto vendes al día</strong> de ese artículo, medido sobre un período representativo.',
              '<strong>Cuánto tarda el proveedor</strong> desde que pides hasta que la mercancía está disponible para vender. No desde que la despacha: desde que la puedes vender.',
              '<strong>Cuánto varían los dos.</strong> Ese margen es el stock de seguridad, y es lo que absorbe la semana en que se vendió el doble o el proveedor se retrasó.',
            ],
          },
          'Lo importante es el tercer punto: <strong>sin margen de seguridad, el punto de reorden acierta la mitad de las veces</strong>, que es justo lo que pasa cuando se calcula con promedios limpios.',
        ],
      },
      {
        id: 'los-detalles',
        titulo: 'Los detalles que lo estropean',
        bloques: [
          {
            lista: [
              '<strong>El plazo del proveedor no es el que dice el proveedor.</strong> Es el que se mide: fecha de pedido contra fecha de disponibilidad, sobre los últimos pedidos reales.',
              '<strong>Los artículos estacionales no se pueden calcular con el promedio anual.</strong> El promedio de un producto de temporada no describe ningún mes del año.',
              '<strong>La promoción rompe el cálculo.</strong> Una campaña multiplica la demanda; si el punto de reorden no lo sabe, se agota a los dos días.',
              '<strong>El mínimo del proveedor manda.</strong> De poco sirve calcular que necesitas 7 si el proveedor vende cajas de 24.',
            ],
          },
          { aviso: 'Un sistema de reposición que nace con todos los umbrales en cero no avisa de nada, y parece que funciona: no da errores, simplemente nunca sugiere comprar. Los umbrales hay que ponerlos artículo por artículo, o al menos por familia.' },
        ],
      },
      {
        id: 'antes',
        titulo: 'Antes del cálculo, el dato',
        bloques: [
          'Nada de esto sirve si el inventario no cuadra. Un punto de reorden calculado sobre existencias equivocadas propone comprar lo que sobra y no propone lo que falta.',
          'Por eso el orden es: primero <a href="https://zyntello.com/blog/por-que-el-inventario-nunca-cuadra/">que el inventario cuadre</a>, después automatizar la reposición. Al revés se automatiza el error.',
        ],
      },
    ],

    cierre: {
      titulo: 'Comprar a tiempo, sin comprar de más',
      texto: 'El módulo de Abastecimiento de Zyntello calcula el punto de reorden con el consumo real y el plazo medido de cada proveedor, y propone el pedido.',
      ruta: '/abastecimiento/',
    },
    destino: { ruta: '/abastecimiento/', texto: 'Ver Abastecimiento' },
  },

  /* ═══════════════════ COBROS ══════════════════════════════════════════ */
  {
    slug: 'antiguedad-de-saldos-lo-que-no-dice',
    titulo: 'La antigüedad de saldos: lo que ese informe no te está diciendo',
    tema: 'Cobros',
    cluster: 'cobros',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'El informe más usado de cuentas por cobrar también es el que más engaña. Tres cosas que oculta y que deciden si cobras o no.',

    secciones: [
      {
        id: 'el-informe',
        titulo: 'El informe que todo el mundo mira',
        bloques: [
          'La antigüedad de saldos reparte lo que te deben en tramos: corriente, 30, 60, 90, más de 90. Es el informe de cobros más usado del mundo y, bien leído, es útil.',
          'El problema es que <strong>se lee como si dijera quién te va a pagar</strong>, y no dice eso. Dice cuánto tiempo lleva cada factura sin pagarse, que no es lo mismo.',
        ],
      },
      {
        id: 'lo-que-oculta',
        titulo: 'Las tres cosas que oculta',
        bloques: [
          {
            lista: [
              '<strong>Un cliente al día con un problema gordo.</strong> Si paga religiosamente cada mes pero su saldo total ha crecido un 40% en un trimestre, la antigüedad no lo marca: está todo «corriente». La exposición creció y el informe no lo dice.',
              '<strong>La diferencia entre no pagar y estar en disputa.</strong> Una factura en el tramo de 90 días puede ser un cliente que no paga o una factura que el cliente rechaza por un problema de entrega. Se gestionan de forma completamente distinta, y el informe las pone juntas.',
              '<strong>El plazo pactado.</strong> Si a un cliente le diste 60 días, su factura a 45 no está vencida aunque aparezca en un tramo alarmante. Una antigüedad calculada sobre la fecha de factura y no sobre la de vencimiento asusta sin motivo — y peor: tranquiliza cuando no debe.',
            ],
          },
          { aviso: 'La antigüedad se calcula sobre el VENCIMIENTO, no sobre la emisión. Es el error más común, y produce un informe que parece bien y está mal para todo cliente que tenga condiciones de pago distintas del contado.' },
        ],
      },
      {
        id: 'que-mirar',
        titulo: 'Qué mirar además',
        bloques: [
          {
            lista: [
              '<strong>La tendencia del saldo por cliente</strong>, no solo el saldo. Crecer es la señal temprana; vencer es la tardía.',
              '<strong>Los días promedio de cobro reales</strong> frente a los pactados. Si pactaste 30 y cobras a 52, tu financiación al cliente es de 22 días que nadie decidió.',
              '<strong>Cuánto de tu saldo está en pocos clientes.</strong> Un informe sano en total puede esconder que el 60% te lo debe uno solo.',
              '<strong>Qué facturas están en disputa</strong>, marcadas como tal, con el motivo. Perseguir por teléfono una factura que el cliente rechazó hace tres semanas es perder el tiempo dos veces.',
            ],
          },
        ],
      },
      {
        id: 'antes-de-facturar',
        titulo: 'Lo que de verdad decide si cobras se hizo antes',
        bloques: [
          'La conclusión incómoda: <strong>para cuando una factura aparece en el tramo de 90 días, las decisiones que importaban ya se tomaron</strong>. A quién le diste crédito, cuánto, con qué plazo y si comprobaste algo antes.',
          'Eso se gestiona con <a href="https://zyntello.com/blog/limite-de-credito-que-hace-y-que-no/">el límite de crédito</a>, que es donde se para el problema. La antigüedad de saldos es el termómetro; el límite es el tratamiento.',
        ],
      },
    ],

    cierre: {
      titulo: 'Cobrar antes, no perseguir después',
      texto: 'Cuentas por Cobrar de Zyntello calcula la antigüedad sobre el vencimiento real, marca las facturas en disputa y avisa antes de que venzan.',
    },
  },

  {
    slug: 'limite-de-credito-que-hace-y-que-no',
    titulo: 'El límite de crédito: qué hace, qué no, y por qué casi siempre se salta',
    tema: 'Crédito a clientes',
    cluster: 'cobros',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'Un límite que se puede saltar sin dejar rastro no es un límite. Cómo ponerlo para que sirva sin frenar la venta legítima.',

    secciones: [
      {
        id: 'para-que-sirve',
        titulo: 'Para qué sirve de verdad',
        bloques: [
          'El límite de crédito no está para decir que no. Está para <strong>obligar a que alguien decida</strong> cuando se pasa de una cifra, en vez de que la exposición crezca sin que nadie se dé cuenta.',
          'Esa es la diferencia entre un límite útil y uno decorativo: el útil <strong>interrumpe</strong>. Si el sistema avisa pero deja seguir, y nadie revisa esos avisos, el límite no existe.',
        ],
      },
      {
        id: 'como-se-salta',
        titulo: 'Cómo se salta en la práctica',
        bloques: [
          'De lo que hemos visto implantando esto, las formas de saltárselo son siempre las mismas:',
          {
            lista: [
              '<strong>Se factura por otra vía.</strong> Una factura manual, otro punto de venta, otra empresa del grupo.',
              '<strong>Se sube el límite «temporalmente»</strong> y nadie lo baja. A los seis meses el límite es el histórico de excesos.',
              '<strong>El límite no cuenta los pedidos pendientes.</strong> El cliente está al 90% del límite y tiene tres pedidos por entregar que lo van a superar. El sistema los deja pasar porque aún no son facturas.',
              '<strong>Se compara contra el saldo de hoy, no contra el vencido.</strong> Un cliente puede estar dentro del límite y tener todo vencido: el número dice que sí y la realidad dice que no.',
            ],
          },
          { aviso: 'La comprobación que revela si tu límite sirve: busca cuántas ventas se aprobaron por encima del límite el último trimestre y quién las aprobó. Si no puedes responder, no tienes un límite: tienes un campo.' },
        ],
      },
      {
        id: 'como-ponerlo',
        titulo: 'Cómo ponerlo para que no frene la venta',
        bloques: [
          'El riesgo del otro lado es real: un control demasiado rígido convierte cada venta en un trámite y acaba desactivado. Lo que funciona:',
          {
            lista: [
              '<strong>Que la aprobación sea rápida y quede registrada.</strong> Un responsable, desde el móvil, en un minuto — y con rastro de quién aprobó qué.',
              '<strong>Que el bloqueo distinga motivos.</strong> No es lo mismo superar el límite que tener facturas vencidas. El segundo caso es más grave y debería frenar antes.',
              '<strong>Que cuente el compromiso total</strong>: facturado más pedidos pendientes de entregar.',
              '<strong>Que el límite se revise con datos.</strong> Un cliente que lleva dos años pagando puntual merece más límite; uno que empezó a alargar, menos.',
            ],
          },
          'Y un detalle de implementación que importa más de lo que parece: <strong>el límite tiene que vivir en un solo campo</strong>. Hemos visto sistemas con dos campos de límite de crédito heredados de distintas épocas, donde uno se mostraba y el otro se validaba. El resultado es un control que parece activo y no lo está.',
        ],
      },
    ],

    cierre: {
      titulo: 'Un límite que sí frena',
      texto: 'En Zyntello el límite cuenta facturado y pedidos, distingue exceso de vencido, y la aprobación deja rastro de quién la dio.',
    },
  },

  {
    slug: 'recibo-de-cobro-por-que-no-cuadra-con-el-banco',
    titulo: 'Por qué lo cobrado nunca coincide con lo que entró al banco',
    tema: 'Cobros',
    cluster: 'cobros',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'Cinco causas por las que el total de recibos del mes y el depósito del banco no cuadran. Ninguna es un error de suma.',

    secciones: [
      {
        id: 'la-diferencia',
        titulo: 'La diferencia siempre tiene explicación',
        bloques: [
          'Cierras el mes, sumas lo cobrado y lo comparas con lo que entró en las cuentas. No cuadra. Y como no cuadra por poco, la tentación es ajustar y seguir.',
          'La diferencia casi nunca es un error de cálculo. Son cinco causas concretas, y cada una se trata distinto.',
        ],
      },
      {
        id: 'las-causas',
        titulo: 'Las cinco causas',
        bloques: [
          {
            lista: [
              '<strong>El cheque está cobrado pero no depositado, o depositado y no acreditado.</strong> El recibo existe, el dinero todavía no. Hasta que el banco lo acredita, ese importe está en tránsito y tiene que verse como tal.',
              '<strong>La comisión bancaria.</strong> El cliente pagó 10.000 y entraron 9.970. La diferencia no es un cobro parcial: es un gasto, y va a su cuenta.',
              '<strong>La retención del cliente.</strong> En varios países el cliente retiene un porcentaje y te entrega un comprobante. Si no se registra como retención, parece que te pagó de menos y la factura queda con un saldo que nadie va a cobrar nunca.',
              '<strong>La diferencia cambiaria.</strong> Facturaste a una tasa y cobraste a otra. La diferencia es un resultado, no un descuadre. Lo tratamos en <a href="https://zyntello.com/blog/diferencia-cambiaria-donde-se-pierde-el-margen/">dónde se pierde el margen</a>.',
              '<strong>Un cobro que entró al banco sin recibo.</strong> Transferencia de un cliente que no avisó. El dinero está y nadie sabe de qué factura es: acaba como un no identificado que envejece.',
            ],
          },
        ],
      },
      {
        id: 'el-patron',
        titulo: 'El patrón común',
        bloques: [
          'Mirando las cinco juntas, se ve el patrón: <strong>en todas hay un importe que existe y no está registrado como lo que es</strong>. Una comisión anotada como cobro parcial, una retención tratada como impago, una diferencia cambiaria metida en el ingreso.',
          'Y todas producen el mismo síntoma final: facturas con saldos pequeños que nunca se cierran, y un cliente que cree haber pagado todo mientras tu sistema dice que debe 30.',
          { aviso: 'Esos saldos minúsculos son más caros de lo que parecen: ensucian la antigüedad de saldos, hacen que el cobrador persiga importes que no existen y acaban castigados como incobrables sin haber sido nunca una deuda.' },
        ],
      },
      {
        id: 'que-pedir',
        titulo: 'Qué debería hacer el sistema',
        bloques: [
          {
            lista: [
              'Distinguir el cobro del depósito, con el dinero en tránsito a la vista.',
              'Registrar comisión, retención y diferencia cambiaria como conceptos propios, cada uno a su cuenta.',
              'Cerrar la factura cuando la suma de todos esos conceptos cubre el importe, no solo el efectivo recibido.',
              'Tener una bandeja de cobros no identificados, para que un ingreso sin dueño se vea en vez de diluirse.',
            ],
          },
        ],
      },
    ],

    cierre: {
      titulo: 'Que lo cobrado y lo depositado cuadren solos',
      texto: 'Zyntello separa cobro y depósito, registra comisiones y retenciones como lo que son, y calcula la diferencia cambiaria al cobrar.',
    },
  },

  /* ═══════════════════ COMPRAS ═════════════════════════════════════════ */
  {
    slug: 'orden-recepcion-factura-los-tres-documentos',
    titulo: 'Orden, recepción y factura: los tres documentos que casi nadie compara',
    tema: 'Control de compras',
    cluster: 'compras',
    pais: null,
    fecha: HOY,
    minutos: 6,
    resumen: 'Se paga de más porque nadie compara lo que se pidió con lo que llegó y con lo que facturan. El control es de los tres, y falla siempre en el mismo punto.',

    secciones: [
      {
        id: 'tres-momentos',
        titulo: 'Tres momentos, tres documentos, tres cifras',
        bloques: [
          'Una compra pasa por tres momentos, y cada uno genera su documento con su cifra:',
          {
            lista: [
              '<strong>Lo que pediste</strong> — la orden de compra: cantidad y precio acordados.',
              '<strong>Lo que llegó</strong> — la recepción: lo que de verdad entró al almacén.',
              '<strong>Lo que te cobran</strong> — la factura del proveedor.',
            ],
          },
          'Cuando las tres coinciden, se paga sin pensar. El control consiste en <strong>no pagar nada donde no coincidan las tres</strong>. Suena obvio; casi nadie lo hace.',
        ],
      },
      {
        id: 'donde-falla',
        titulo: 'Dónde falla siempre',
        bloques: [
          'Lo interesante es que el fallo casi nunca está en la factura. Está en el medio:',
          {
            lista: [
              '<strong>Se recibe sin comparar con la orden.</strong> El almacén anota lo que llegó, sin mirar si es lo que se pidió. Si llegaron 95 de 100, la diferencia aparece semanas después.',
              '<strong>Se factura lo pedido, no lo recibido.</strong> El proveedor factura la orden completa y nadie cruza con la recepción parcial.',
              '<strong>El precio de la factura no es el de la orden.</strong> Una subida que nadie autorizó, y que se paga porque la factura ya está aprobada.',
              '<strong>Se recibe mercancía sin orden.</strong> El caso más difícil: llegó algo que nadie pidió formalmente, y ahora hay que decidir si se paga.',
            ],
          },
          { aviso: 'La devolución al proveedor es el punto más descuidado: se devuelve la mercancía, y si no se enlaza con su nota de crédito, se acaba pagando la factura completa de algo que ya no se tiene.' },
        ],
      },
      {
        id: 'tolerancias',
        titulo: 'Las tolerancias, que son lo que hace usable el control',
        bloques: [
          'Un control que bloquea por un céntimo se desactiva en una semana. Por eso hacen falta tolerancias, y decidirlas es parte del trabajo:',
          {
            lista: [
              'Una diferencia de cantidad pequeña en productos a granel es normal; en equipos, no.',
              'Una diferencia de precio dentro de un margen pactado puede pasar; por encima, va a aprobación.',
              'Y sobre todo: <strong>lo que se salta la tolerancia no se bloquea en silencio</strong>. Va a alguien que decide, con su nombre.',
            ],
          },
        ],
      },
      {
        id: 'lo-que-se-gana',
        titulo: 'Lo que se gana, más allá de no pagar de más',
        bloques: [
          {
            lista: [
              '<strong>Se sabe qué se debe antes de recibir la factura.</strong> La mercancía recibida y no facturada es una deuda real, y si no está registrada, el pasivo está incompleto.',
              '<strong>El costo del inventario se forma al recibir</strong>, no al facturar, que es cuando debe formarse.',
              '<strong>Se mide al proveedor con datos</strong>: cuánto tarda de verdad, cuántas veces entrega incompleto. Eso alimenta <a href="https://zyntello.com/blog/punto-de-reorden-cuando-volver-a-pedir/">el punto de reorden</a>.',
            ],
          },
        ],
      },
    ],

    cierre: {
      titulo: 'Pagar lo que se pidió y llegó',
      texto: 'Compras de Zyntello cruza orden, recepción y factura con las tolerancias que definas, y lo que se sale va a aprobación con nombre.',
    },
  },

  {
    slug: 'retenciones-a-proveedores-que-descuadran',
    titulo: 'Retenciones a proveedores: el descuento que descuadra la cuenta del proveedor',
    tema: 'Pagos',
    cluster: 'compras',
    pais: 'DO',
    fecha: HOY,
    minutos: 5,
    resumen: 'Retener mal no da error: deja al proveedor reclamando un saldo que tú crees pagado. Por qué pasa y cómo se cierra desde la ficha del proveedor.',

    secciones: [
      {
        id: 'el-mecanismo',
        titulo: 'Qué es y por qué descuadra',
        bloques: [
          'Al pagarle a ciertos proveedores no se le entrega el importe completo: una parte se retiene y se entera al fisco en su nombre. Al proveedor se le da un comprobante de esa retención.',
          'El descuadre aparece cuando <strong>la retención se registra como si fuera un pago menor</strong>. Entonces la factura queda con un saldo pendiente que no se debe, el proveedor reclama, y alguien acaba pagando dos veces o dejando el saldo ahí para siempre.',
          { aviso: 'La retención no reduce la deuda con el proveedor: la traslada al fisco. La factura se salda completa, con una parte en efectivo y otra en retención. Si el sistema no tiene ese concepto, no hay forma de registrarlo bien.' },
        ],
      },
      {
        id: 'donde-se-equivoca',
        titulo: 'Dónde se equivoca todo el mundo',
        bloques: [
          {
            lista: [
              '<strong>Se retiene a quien no corresponde.</strong> El porcentaje y la obligación dependen del tipo de proveedor y del tipo de servicio. Aplicarlo por costumbre falla en los casos nuevos.',
              '<strong>Se aplica el porcentaje equivocado.</strong> No hay uno solo: cambian según el concepto.',
              '<strong>Se calcula sobre la base equivocada.</strong> Sobre el total con impuesto, cuando iba sobre otra base, o al revés.',
              '<strong>No se emite el comprobante.</strong> El proveedor necesita ese documento para acreditar lo retenido. Sin él, el problema es suyo y tuyo.',
              '<strong>No llega al reporte.</strong> Lo retenido hay que declararlo. Si vive solo en la factura y no en el reporte, falta al declarar.',
            ],
          },
        ],
      },
      {
        id: 'donde-se-arregla',
        titulo: 'Se arregla en el proveedor, no en el pago',
        bloques: [
          'Como con <a href="https://zyntello.com/blog/formatos-606-607-dgii-que-los-descuadra/">los formatos 606 y 607</a>, el arreglo no está donde aparece el problema:',
          {
            lista: [
              'El tipo de proveedor y su régimen se definen al darlo de alta, una vez.',
              'El tipo de servicio va en el documento, y de ahí sale qué retener.',
              'El sistema propone la retención; la persona confirma, no calcula.',
              'El comprobante se emite con el pago, no como un trámite aparte que alguien recuerde.',
              'El reporte sale de las retenciones registradas, no de una hoja paralela.',
            ],
          },
          { aviso: 'Los porcentajes, las bases y los tipos de proveedor obligados a retención los define la normativa de cada país y se actualizan. Confirma los vigentes con tu contador o el organismo correspondiente.' },
        ],
      },
    ],

    cierre: {
      titulo: 'Retener bien, sin saldos fantasma',
      texto: 'Cuentas por Pagar de Zyntello propone la retención según el proveedor y el servicio, emite el comprobante y alimenta el reporte.',
      ruta: '/cxp/',
    },
    destino: { ruta: '/cxp/', texto: 'Ver Cuentas por Pagar' },
  },

  {
    slug: 'costo-real-de-una-importacion',
    titulo: 'El costo real de una importación: todo lo que no está en la factura del proveedor',
    tema: 'Importaciones',
    cluster: 'compras',
    pais: null,
    fecha: HOY,
    minutos: 6,
    resumen: 'Flete, seguro, aranceles, almacenaje, transporte interno. Si no se reparten sobre la mercancía, vendes creyendo que ganas y el margen real es otro.',

    secciones: [
      {
        id: 'el-error',
        titulo: 'El error que se paga vendiendo',
        bloques: [
          'La factura del proveedor extranjero dice un número. Ese número <strong>no es lo que te costó la mercancía</strong>, y tratarlo como si lo fuera es uno de los errores de margen más caros que existen.',
          'Entre el proveedor y tu estantería hay una lista de costes que, según el producto y el origen, puede añadir un porcentaje muy considerable al precio de compra:',
          {
            lista: [
              'Flete internacional y seguro.',
              'Aranceles y demás cargas de importación.',
              'Gastos de agente aduanal y documentación.',
              'Almacenaje, demoras y manipulación en puerto.',
              'Transporte interno hasta el almacén.',
            ],
          },
          'Cuando todo eso se contabiliza como gasto del mes en lugar de repartirse sobre la mercancía, <strong>el inventario queda subvalorado y cada venta reporta un margen que no existe</strong>.',
        ],
      },
      {
        id: 'como-repartir',
        titulo: 'Cómo se reparte, y por qué el criterio importa',
        bloques: [
          'El reparto no es trivial cuando el embarque trae artículos distintos. Los criterios habituales:',
          {
            lista: [
              '<strong>Por valor.</strong> Lo caro absorbe más. Es lo razonable para el seguro y para cargas calculadas sobre el valor.',
              '<strong>Por peso o volumen.</strong> Es lo razonable para el flete: lo que ocupa más, cuesta más de traer.',
              '<strong>Por unidades.</strong> Simple, y casi siempre incorrecto cuando los artículos son heterogéneos.',
            ],
          },
          'Un contenedor con electrónica ligera y con herramienta pesada repartido por valor le carga el flete a la electrónica, que casi no pesa. El resultado: un producto artificialmente caro y otro artificialmente barato, y decisiones de precio equivocadas en los dos.',
          { aviso: 'Lo más práctico es repartir cada concepto por el criterio que le corresponde: el flete por peso o volumen, el seguro y los aranceles por valor. Un solo criterio para todo es más fácil y da un costo peor.' },
        ],
      },
      {
        id: 'el-tiempo',
        titulo: 'El problema del tiempo: los costes llegan después',
        bloques: [
          'La complicación práctica: <strong>la mercancía llega y se empieza a vender antes de que estén todas las facturas de gastos</strong>. La del agente aduanal llega a las dos semanas; la demora del puerto, al mes.',
          'Si se espera a tenerlo todo, no se puede vender. Si se recibe sin costos, el costo nace mal. La salida es trabajar con un costo estimado al recibir y ajustarlo cuando llegue cada gasto real, <strong>con el sistema recalculando lo que ya salió</strong>.',
          'Y ahí es donde importa <a href="https://zyntello.com/blog/costo-promedio-o-peps-cual-usar/">el método de costeo</a>: el ajuste posterior se comporta de forma distinta con promedio que con PEPS.',
        ],
      },
      {
        id: 'que-pedir',
        titulo: 'Qué debería resolver el sistema',
        bloques: [
          {
            lista: [
              'Un expediente de importación que agrupe la compra y todos sus gastos, con lo pendiente a la vista.',
              'Reparto por el criterio que corresponda a cada concepto, no uno solo para todo.',
              'Recepción con costo estimado y ajuste posterior sin rehacer nada a mano.',
              'El costo final visible por artículo y por embarque, para poder comparar orígenes.',
            ],
          },
        ],
      },
    ],

    cierre: {
      titulo: 'Saber lo que de verdad te costó',
      texto: 'Compras de Zyntello lleva el expediente de importación con todos sus gastos, los reparte por el criterio de cada concepto y ajusta el costo cuando llegan las facturas.',
    },
  },
]
