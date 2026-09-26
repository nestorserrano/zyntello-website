/**
 * Clústeres de gestión: contabilidad, tesorería, elección de ERP y verticales.
 *
 * ⚠️ Estos no dependen de normativa, así que no llevan aviso de confirmar con
 * el organismo. Lo que sí llevan es la advertencia de que las cifras concretas
 * —plazos, porcentajes— son ejemplos del mecanismo, no recomendaciones.
 */

const HOY = '2026-09-26'

export const GESTION = [
  /* ═══════════════════ CONTABILIDAD ════════════════════════════════════ */
  {
    slug: 'diferencia-cambiaria-donde-se-pierde-el-margen',
    titulo: 'Diferencia cambiaria: dónde se pierde el margen sin que nadie lo vea',
    tema: 'Multimoneda',
    cluster: 'contabilidad',
    pais: null,
    fecha: HOY,
    minutos: 6,
    resumen: 'Facturas a una tasa y cobras a otra. Esa diferencia es un resultado, no un error de cuadre — y si se diluye en el ingreso, el margen que ves no es el real.',

    secciones: [
      {
        id: 'el-mecanismo',
        titulo: 'El mecanismo, en una frase',
        bloques: [
          'Si facturas en una moneda y cobras en otra, <strong>entre la factura y el cobro la tasa cambió</strong>. Esa diferencia es dinero: ganado o perdido, según la dirección.',
          'No es un error, no es un descuadre y no se corrige. Es un resultado del negocio, igual que un descuento o un gasto financiero, y tiene que verse como tal.',
          { aviso: 'El problema no es que exista: es cuando se mete dentro del ingreso. Entonces el margen comercial de tus ventas sube y baja con el tipo de cambio, y deja de decirte si vendes bien.' },
        ],
      },
      {
        id: 'la-regla',
        titulo: 'La regla que lo resuelve todo',
        bloques: [
          '<strong>Cada documento guarda su importe Y su tasa, y esa tasa no se recalcula jamás.</strong> De ahí sale todo lo demás:',
          {
            lista: [
              'La factura vale lo que valía el día que se emitió. Para siempre.',
              'El cobro vale lo que valía el día que se cobró.',
              'La diferencia entre los dos va a su propia cuenta de resultado.',
              'El saldo pendiente se valora a la tasa de hoy, y por eso cambia aunque el cliente no pague nada.',
            ],
          },
          'Un sistema que guarda solo un importe y convierte al mostrarlo <strong>reescribe el pasado</strong>: la factura de hace seis meses cambia de cifra cada vez que la abres, y deja de coincidir con lo que el cliente pagó.',
        ],
      },
      {
        id: 'los-cuatro-sitios',
        titulo: 'Los cuatro sitios donde aparece',
        bloques: [
          {
            lista: [
              '<strong>Al cobrar a un cliente</strong> en moneda distinta de la de la factura.',
              '<strong>Al pagar a un proveedor</strong>, igual pero al revés: aquí la diferencia suele doler más porque no se presupuestó.',
              '<strong>Al valorar los saldos abiertos</strong> al cierre. Lo que te deben y lo que debes cambian de valor sin que nadie haga nada.',
              '<strong>En las cuentas bancarias en moneda extranjera.</strong> El saldo vale distinto cada día.',
            ],
          },
          'Los dos últimos son los que más se olvidan, y son los que hacen que el balance esté mal sin que ninguna operación esté mal.',
        ],
      },
      {
        id: 'el-inventario',
        titulo: 'El inventario es el caso especial',
        bloques: [
          'Con el inventario la regla cambia, y confundirlo es un error caro: <strong>la mercancía mantiene el costo al que entró</strong>. No se revaloriza porque cambie la tasa.',
          'Si se revaloriza con cada movimiento, el margen de cada venta se convierte en ruido: dos ventas idénticas del mismo artículo dan márgenes distintos según el día. Eso hace imposible saber qué producto es rentable.',
          'El razonamiento completo está en <a href="https://zyntello.com/blog/costo-promedio-o-peps-cual-usar/">costo promedio o PEPS</a>, y el caso extremo en <a href="https://zyntello.com/blog/facturacion-venezuela-iva-igtf/">facturar en Venezuela</a>.',
        ],
      },
    ],

    cierre: {
      titulo: 'Multimoneda de punta a punta',
      texto: 'En Zyntello cada documento lleva su tasa, la diferencia cambiaria va a su cuenta y los reportes salen en cualquier moneda sin reescribir el pasado.',
    },
  },

  {
    slug: 'cierre-mensual-por-que-tarda-tres-semanas',
    titulo: 'Por qué el cierre mensual tarda tres semanas',
    tema: 'Cierre contable',
    cluster: 'contabilidad',
    pais: null,
    fecha: HOY,
    minutos: 6,
    resumen: 'El cierre no tarda por el volumen: tarda por lo que hay que reconstruir cada mes. Cuando los números llegan el día 20, ya no sirven para decidir.',

    secciones: [
      {
        id: 'el-coste',
        titulo: 'El coste real de un cierre lento',
        bloques: [
          'Un cierre que termina el día 20 no es un problema de contabilidad: es un problema de dirección. <strong>Significa que durante veinte días se decide a ciegas</strong>, con la sensación de cómo fue el mes en lugar de con el dato.',
          'Y significa también que cuando aparece un problema —un margen que se cayó, un gasto que se disparó— se descubre con siete semanas de retraso respecto a cuando empezó.',
        ],
      },
      {
        id: 'donde-se-va',
        titulo: 'Dónde se va el tiempo, de verdad',
        bloques: [
          'De lo que hemos visto, el tiempo no se va contabilizando. Se va en esto:',
          {
            lista: [
              '<strong>Reconstruir lo que no se registró en su momento.</strong> Facturas de proveedor que llegaron tarde, gastos pagados con la tarjeta de alguien, una caja que nadie cuadró.',
              '<strong>Conciliar los bancos a mano.</strong> Línea por línea, buscando a qué corresponde cada movimiento.',
              '<strong>Cuadrar el inventario con la contabilidad.</strong> Dos cifras que deberían salir de lo mismo y salen de sitios distintos.',
              '<strong>Perseguir a quien tiene que aprobar algo.</strong> Provisiones, ajustes, reclasificaciones que esperan una respuesta.',
              '<strong>Rehacer los mismos asientos de todos los meses</strong>: depreciación, devengos, amortizaciones, provisiones.',
            ],
          },
          { aviso: 'El patrón: casi todo el tiempo del cierre se va en tareas que no son del cierre. Son tareas del mes que no se hicieron cuando tocaba, y el cierre es donde se acumulan.' },
        ],
      },
      {
        id: 'como-se-acorta',
        titulo: 'Cómo se acorta, por orden de impacto',
        bloques: [
          {
            lista: [
              '<strong>Que cada operación genere su asiento al ocurrir.</strong> Una venta, una compra, un pago y un movimiento de inventario contabilizan solos. Si hay que contabilizar el mes al final, el cierre es el mes entero.',
              '<strong>Conciliación asistida.</strong> Que el sistema proponga el cruce y la persona confirme. Es la tarea que más horas se come y la que más fácil se automatiza.',
              '<strong>Asientos recurrentes programados.</strong> Depreciación y devengos no deberían escribirse a mano nunca.',
              '<strong>Fecha de corte de verdad.</strong> Un día a partir del cual no se registra nada más en el período. Sin corte, el cierre es un blanco móvil.',
              '<strong>Aprobaciones con plazo.</strong> Que lo pendiente esté a la vista, con quién lo tiene, en vez de en una cadena de correos.',
            ],
          },
        ],
      },
      {
        id: 'la-senal',
        titulo: 'La señal de que vas bien',
        bloques: [
          'Hay una comprobación sencilla: <strong>¿podrías sacar un estado de resultados razonable el día 2?</strong> No definitivo — razonable, con las provisiones estimadas.',
          'Si la respuesta es que no porque faltan datos, el problema está en el registro diario. Si es que no porque falta contabilizar, el problema es que la contabilidad va por detrás en lugar de salir de la operación.',
        ],
      },
    ],

    cierre: {
      titulo: 'Cerrar en días, no en semanas',
      texto: 'En Zyntello cada operación genera su asiento al ocurrir, la conciliación es asistida y los recurrentes van programados. El cierre deja de ser una reconstrucción.',
    },
  },

  {
    slug: 'centros-de-costo-que-nadie-usa',
    titulo: 'Centros de costo: por qué se configuran y luego nadie los usa',
    tema: 'Análisis de costes',
    cluster: 'contabilidad',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'Se montan con ilusión en la implantación y a los tres meses la mitad de los gastos van a «general». Por qué pasa y cómo hacer que sobrevivan.',

    secciones: [
      {
        id: 'el-patron',
        titulo: 'El patrón que se repite siempre',
        bloques: [
          'Es una de las historias más repetidas de cualquier implantación: se definen centros de costo por sucursal, por departamento o por proyecto, se configuran con cuidado… y a los tres meses la mayoría de los gastos van a uno genérico.',
          'Cuando eso pasa, el informe por centro de costo no solo deja de servir: <strong>engaña</strong>. Muestra un departamento barato porque sus gastos acabaron en otro sitio.',
        ],
      },
      {
        id: 'por-que-mueren',
        titulo: 'Por qué mueren',
        bloques: [
          {
            lista: [
              '<strong>Son demasiados.</strong> Quien captura una factura tiene que elegir entre cuarenta opciones. Elige la primera o la genérica.',
              '<strong>Nadie sabe cuál toca.</strong> Un gasto de mantenimiento en una sucursal, ¿va a la sucursal o a mantenimiento? Si no está escrito, cada persona decide distinto y el informe mezcla criterios.',
              '<strong>No son obligatorios.</strong> El campo se puede dejar vacío, así que se deja.',
              '<strong>Nadie mira el informe.</strong> Y lo que no se mira, se deja de rellenar. Es la causa de fondo de casi todas las demás.',
              '<strong>Hay gastos que son de varios a la vez</strong> —el alquiler, la luz— y no hay una regla de reparto, así que van completos a uno o a ninguno.',
            ],
          },
        ],
      },
      {
        id: 'como-sobreviven',
        titulo: 'Cómo hacer que sobrevivan',
        bloques: [
          {
            lista: [
              '<strong>Empezar con pocos.</strong> Cinco que se usen valen más que cuarenta que se rellenen al azar. Se pueden abrir más cuando los cinco funcionen.',
              '<strong>Que se propongan solos.</strong> El centro de costo se deduce del proveedor, del tipo de gasto o de quién lo pide. La persona confirma, no elige.',
              '<strong>Obligatorio donde importa.</strong> No en todo: en las cuentas de gasto donde el análisis vale algo.',
              '<strong>Reparto automático para los compartidos.</strong> El alquiler se reparte por una regla fija —metros, personas, ingresos— definida una vez.',
              '<strong>Que alguien mire el informe cada mes, y se note.</strong> Si el responsable de un centro recibe su gasto y responde por él, los datos se limpian solos.',
            ],
          },
          { aviso: 'La comprobación que dice si están vivos: qué porcentaje del gasto del último trimestre fue al centro genérico. Por encima de un tercio, el análisis por centro de costo no se puede usar para decidir nada.' },
        ],
      },
    ],

    cierre: {
      titulo: 'Saber qué cuesta cada cosa',
      texto: 'En Zyntello el centro de costo se propone desde el documento y se puede exigir donde importa, con reparto automático para los gastos compartidos.',
    },
  },

  /* ═══════════════════ TESORERÍA ═══════════════════════════════════════ */
  {
    slug: 'conciliacion-bancaria-lo-que-nunca-cuadra',
    titulo: 'Conciliación bancaria: las seis cosas que nunca cuadran',
    tema: 'Bancos',
    cluster: 'tesoreria',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'El saldo del banco y el de tu contabilidad no tienen por qué ser iguales. Lo que importa es poder explicar la diferencia en cinco minutos, no en dos días.',

    secciones: [
      {
        id: 'no-tienen-que-coincidir',
        titulo: 'No tienen que coincidir, tienen que explicarse',
        bloques: [
          'El primer malentendido: el saldo del extracto y el de tu contabilidad <strong>no deberían ser iguales</strong>, y que lo sean por casualidad no significa nada.',
          'La diferencia es legítima mientras esté explicada partida por partida. El trabajo de la conciliación no es igualar dos números: es dejar por escrito de qué está hecha la diferencia.',
        ],
      },
      {
        id: 'las-seis',
        titulo: 'Las seis partidas de siempre',
        bloques: [
          {
            lista: [
              '<strong>Cheques emitidos y no cobrados.</strong> Los tienes descontados; el banco todavía no. La partida más grande casi siempre.',
              '<strong>Depósitos en tránsito.</strong> Los registraste, el banco los acredita al día siguiente.',
              '<strong>Comisiones y cargos.</strong> El banco los aplicó y tú te enteras al ver el extracto.',
              '<strong>Intereses y rendimientos</strong> abonados que nadie registró.',
              '<strong>Cobros directos de clientes</strong> que entraron sin avisar. Aparecen como no identificados hasta que alguien averigua de quién son.',
              '<strong>Errores</strong>, tuyos o del banco. Son los menos, pero existen.',
            ],
          },
          { aviso: 'Un cheque emitido hace ocho meses y nunca cobrado no es una partida conciliatoria: es un problema. O se perdió, o el proveedor ya cobró de otra forma, o no debía existir. Los cheques que envejecen en la conciliación hay que investigarlos, no arrastrarlos.' },
        ],
      },
      {
        id: 'como-se-acelera',
        titulo: 'Cómo pasar de dos días a media hora',
        bloques: [
          'La conciliación es la tarea del cierre que más se beneficia de la automatización, porque el 90% de las líneas son cruces evidentes:',
          {
            lista: [
              '<strong>Importar el extracto</strong> en lugar de teclearlo.',
              '<strong>Que el sistema proponga los cruces</strong> por importe, fecha y referencia, y la persona solo revise lo que no cuadró.',
              '<strong>Conciliar seguido, no al cierre.</strong> Una vez por semana son quince minutos; una vez al mes son dos días.',
              '<strong>Que las partidas pendientes envejezcan a la vista</strong>, con su antigüedad, para que lo viejo salte.',
            ],
          },
          'Y lo más importante: <strong>que los cobros y pagos nazcan en el sistema</strong>. Si la mitad de los movimientos no están registrados, la conciliación no es conciliar: es capturar. Lo vemos en <a href="https://zyntello.com/blog/recibo-de-cobro-por-que-no-cuadra-con-el-banco/">por qué lo cobrado no cuadra con el banco</a>.',
        ],
      },
    ],

    cierre: {
      titulo: 'Conciliar en minutos',
      texto: 'Bancos de Zyntello importa el extracto, propone los cruces y deja las partidas pendientes con su antigüedad a la vista.',
    },
  },

  {
    slug: 'flujo-de-caja-proyectado-no-es-el-saldo',
    titulo: 'Flujo de caja proyectado: saber cuánto habrá, no cuánto hay',
    tema: 'Tesorería',
    cluster: 'tesoreria',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'El saldo de hoy no decide nada. Lo que decide es cuánto habrá el día 25, cuando toca la nómina y vence el pago del proveedor grande.',

    secciones: [
      {
        id: 'la-diferencia',
        titulo: 'Tener dinero y poder gastarlo no es lo mismo',
        bloques: [
          'Mirar el saldo del banco responde a una pregunta poco útil: cuánto hay ahora. La pregunta que decide es otra: <strong>¿cuánto va a haber el día que tenga que pagar?</strong>',
          'Empresas rentables se quedan sin caja constantemente, y casi nunca por falta de margen: por desajuste de fechas. Cobras a 60 y pagas a 30, y entre medias hay una nómina.',
        ],
      },
      {
        id: 'de-donde-sale',
        titulo: 'De dónde sale la proyección',
        bloques: [
          'Lo bueno es que casi todo el dato ya existe, repartido:',
          {
            lista: [
              '<strong>Lo que vas a cobrar:</strong> facturas pendientes con su vencimiento. Ajustado por lo que ese cliente suele tardar de verdad, no por lo pactado.',
              '<strong>Lo que vas a pagar:</strong> facturas de proveedor pendientes, con su vencimiento.',
              '<strong>Lo comprometido y no facturado:</strong> órdenes de compra aprobadas que llegarán.',
              '<strong>Lo recurrente:</strong> nómina, alquiler, servicios, impuestos. Es lo más fácil de proyectar y lo que más pesa.',
            ],
          },
          'Si todo eso está en el mismo sistema, la proyección es una consulta. Si está en cuatro sitios, es un Excel que alguien rehace cada semana y que está desactualizado el mismo día.',
        ],
      },
      {
        id: 'el-realismo',
        titulo: 'La parte que la hace útil: el realismo',
        bloques: [
          'Una proyección que asume que todos pagan el día del vencimiento no sirve. Es optimista por diseño y por eso nadie confía en ella.',
          {
            lista: [
              '<strong>Ajustar por el comportamiento real de cada cliente.</strong> Si uno paga siempre a 75 cuando pactó 60, proyéctalo a 75.',
              '<strong>Separar lo seguro de lo probable.</strong> Una factura vencida de un cliente que no contesta no es un cobro: es una esperanza.',
              '<strong>Ver escenarios.</strong> Qué pasa si el cliente grande se retrasa dos semanas. Eso es lo que convierte la proyección en una herramienta de decisión.',
            ],
          },
          { aviso: 'El valor no está en acertar la cifra: está en ver el hueco con tres semanas de antelación. Con tres semanas se negocia un plazo o se adelanta un cobro. Con tres días, se pide un préstamo caro.' },
        ],
      },
    ],

    cierre: {
      titulo: 'Ver el hueco antes de caer en él',
      texto: 'Zyntello proyecta el flujo con los vencimientos reales de cobros y pagos, ajustado por cómo paga de verdad cada cliente.',
      ruta: '/flujocaja/',
    },
    destino: { ruta: '/flujocaja/', texto: 'Ver Flujo de Caja' },
  },

  /* ═══════════════════ ERP ═════════════════════════════════════════════ */
  {
    slug: 'por-que-fracasan-las-implantaciones-de-erp',
    titulo: 'Por qué fracasan las implantaciones de ERP (y casi nunca es el software)',
    tema: 'Implantación',
    cluster: 'erp',
    pais: null,
    fecha: HOY,
    minutos: 7,
    resumen: 'Las seis causas reales de un ERP abandonado. Ninguna aparece en una comparativa de funcionalidades, y todas se pueden prevenir.',

    secciones: [
      {
        id: 'no-es-el-software',
        titulo: 'Casi nunca falta una función',
        bloques: [
          'Cuando una empresa abandona su ERP, la explicación que se da suele ser «no servía». Pero al preguntar en detalle, casi nunca falta una función: <strong>falta que alguien lo usara bien</strong>.',
          'Veinte años viendo esto de cerca dan un patrón bastante claro, y son seis causas.',
        ],
      },
      {
        id: 'las-causas',
        titulo: 'Las seis causas',
        bloques: [
          {
            lista: [
              '<strong>El proyecto duró más que la paciencia.</strong> Dieciocho meses de implantación es tiempo suficiente para que cambie el negocio, el equipo y el patrocinador. Lo que se entrega al final ya no es lo que se pidió.',
              '<strong>Nadie enseñó para qué servía cada pantalla.</strong> Se dio formación de cómo pulsar botones, no de qué decisión soporta cada dato. El resultado: campos rellenados por salir del paso.',
              '<strong>Se migraron los datos sucios.</strong> Clientes duplicados, artículos con costo cero, saldos que no cuadraban. El sistema nuevo hereda el problema y se lleva la culpa.',
              '<strong>Se replicó el proceso viejo.</strong> Se configuró el ERP para hacer exactamente lo que se hacía antes, incluidos los apaños. Entonces no aporta nada, solo añade pasos.',
              '<strong>Nadie era dueño.</strong> El proyecto era de Sistemas, y Sistemas no puede decidir cómo se aprueba una compra.',
              '<strong>El proveedor desapareció al terminar.</strong> Los problemas de verdad aparecen a los tres meses, cuando llega el primer cierre y el primer caso raro.',
            ],
          },
          { aviso: 'La causa que más se subestima es la segunda. Una pantalla que el usuario no entiende se rellena mal desde el primer día, y a partir de ahí todos los informes que la usan están mal — sin que nada falle.' },
        ],
      },
      {
        id: 'lo-que-funciona',
        titulo: 'Lo que sí funciona',
        bloques: [
          {
            lista: [
              '<strong>Empezar por un módulo, no por todo.</strong> El que más duela. Funcionando en semanas, no en trimestres.',
              '<strong>Limpiar los datos antes, no durante.</strong> Es trabajo aburrido y es el que decide si el sistema nuevo nace fiable.',
              '<strong>Revisar el proceso antes de configurarlo.</strong> Si hoy se aprueba por WhatsApp, automatizar eso es automatizar el desorden.',
              '<strong>Un dueño del negocio, no de Sistemas.</strong> Alguien que pueda decidir cómo se hacen las cosas.',
              '<strong>Ayuda dentro de la pantalla.</strong> Que quien duda encuentre la respuesta donde está el campo, no en un manual que nadie abre.',
            ],
          },
          'Si estás en la fase de elegir, conviene leer <a href="https://zyntello.com/blog/como-elegir-un-erp-preguntas-incomodas/">las preguntas incómodas que conviene hacer</a> antes de firmar.',
        ],
      },
    ],

    cierre: {
      titulo: 'Un ERP que se empieza por una pieza',
      texto: 'Zyntello se contrata por módulos: empiezas por el que te duele hoy y añades los demás sobre los mismos datos, sin un proyecto de un año.',
    },
  },

  {
    slug: 'como-elegir-un-erp-preguntas-incomodas',
    titulo: 'Las preguntas incómodas que conviene hacer antes de firmar un ERP',
    tema: 'Elección de sistema',
    cluster: 'erp',
    pais: null,
    fecha: HOY,
    minutos: 6,
    resumen: 'Diez preguntas que ningún vendedor propone y que separan un sistema que te va a servir de uno que vas a abandonar en dos años.',

    secciones: [
      {
        id: 'la-demo',
        titulo: 'La demo siempre sale bien',
        bloques: [
          'Toda demo funciona. Está preparada, con datos limpios y siguiendo el camino feliz. Por eso comparar demos no distingue casi nada.',
          'Lo que distingue es preguntar por lo que la demo no enseña: los datos, el fallo, la salida y el después.',
        ],
      },
      {
        id: 'sobre-tus-datos',
        titulo: 'Sobre tus datos',
        bloques: [
          {
            lista: [
              '<strong>¿Puedo exportarlo todo, cuándo quiera, sin pedir permiso?</strong> Y en qué formato. La respuesta a esto dice mucho sobre la relación entera.',
              '<strong>Si dejo de ser cliente, ¿qué pasa con mi información?</strong> Debería haber un procedimiento escrito, no una promesa.',
              '<strong>¿Quién puede ver mis datos por dentro?</strong> Y si operas con varias empresas: <strong>¿cómo garantizas que los datos de una no se ven desde otra?</strong>',
              '<strong>¿Cada cuánto hay copia de seguridad y cómo se restaura?</strong> Pide que te cuenten la última vez que restauraron una de verdad.',
            ],
          },
        ],
      },
      {
        id: 'sobre-el-fallo',
        titulo: 'Sobre cuando algo va mal',
        bloques: [
          {
            lista: [
              '<strong>¿Qué pasa si se cae internet en plena facturación?</strong> Especialmente con facturación electrónica: ¿puedo seguir vendiendo?',
              '<strong>Enséñame la pantalla de documentos pendientes de enviar.</strong> La petición que más revela: si no existe, los atascos serán invisibles.',
              '<strong>¿Qué compromiso de respuesta tengo por escrito?</strong> Un acuerdo de nivel de servicio publicado, no una intención.',
              '<strong>¿Con quién hablo cuando algo falla?</strong> ¿Alguien que conoce mi caso o una cola genérica?',
            ],
          },
        ],
      },
      {
        id: 'sobre-el-dinero',
        titulo: 'Sobre el dinero y el futuro',
        bloques: [
          {
            lista: [
              '<strong>¿Qué NO está incluido en el precio?</strong> Es mejor pregunta que qué sí está. Implantación, migración, formación, soporte, actualizaciones.',
              '<strong>¿Qué pasa cuando cambie la ley fiscal?</strong> ¿Entra en la suscripción o llega una factura de adaptación?',
              '<strong>Si crezco a tres empresas o a otro país, ¿qué cambia?</strong> En precio y en trabajo.',
              '<strong>¿Hay permanencia?</strong> Y si la hay, por qué. Un producto que retiene con cláusulas no retiene con producto.',
            ],
          },
          { aviso: 'Una petición que vale por diez preguntas: «enséñame un cliente parecido a mí, operando, no una demo». Si no hay forma de ver el sistema haciendo tu caso con volumen real, eso ya es una respuesta.' },
        ],
      },
    ],

    cierre: {
      titulo: 'Haznos estas preguntas',
      texto: 'Todas. Las respuestas están publicadas: el SLA, la política de datos, el procedimiento de eliminación y los precios por módulo.',
      ruta: '/precios/',
    },
    destino: { ruta: '/precios/', texto: 'Ver precios' },
  },

  {
    slug: 'multiempresa-de-verdad-o-de-mentira',
    titulo: 'Multi-empresa de verdad: qué preguntar si tienes más de una sociedad',
    tema: 'Arquitectura',
    cluster: 'erp',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'Casi todos los sistemas dicen que soportan varias empresas. La diferencia entre decirlo y hacerlo se ve en cuatro preguntas concretas.',

    secciones: [
      {
        id: 'dos-cosas',
        titulo: 'Dos cosas muy distintas con el mismo nombre',
        bloques: [
          '«Multi-empresa» significa dos cosas completamente distintas según quién lo diga:',
          {
            lista: [
              '<strong>Varias instalaciones separadas.</strong> Cada empresa su base de datos, su acceso, su configuración. Funciona, pero cada cambio se hace tantas veces como empresas tengas, y consolidar es un Excel.',
              '<strong>Un sistema que entiende que hay varias empresas.</strong> Datos separados donde deben estarlo, compartidos donde tiene sentido, y un solo sitio donde trabajar.',
            ],
          },
          'Lo segundo es bastante más difícil de construir, y por eso lo primero se vende con el mismo nombre.',
        ],
      },
      {
        id: 'las-preguntas',
        titulo: 'Las cuatro preguntas que lo distinguen',
        bloques: [
          {
            lista: [
              '<strong>¿Un cliente que compra en dos de mis empresas está dos veces?</strong> Si hay que darlo de alta en cada una, cualquier corrección hay que hacerla dos veces, y basta con que una copia tenga el número fiscal mal para que esas facturas salgan mal.',
              '<strong>¿Puedo cambiar de empresa sin volver a entrar?</strong> Parece cómodo y es más que eso: indica si el sistema entiende el concepto o si son instalaciones disfrazadas.',
              '<strong>¿Los permisos son por empresa?</strong> Alguien puede necesitar ver todo de una y nada de otra. Si los permisos son globales, o ve todo o no ve nada.',
              '<strong>¿Puedo consolidar sin exportar?</strong> Ver el conjunto sin armar una hoja aparte cada mes.',
            ],
          },
          { aviso: 'Y una quinta, la que de verdad importa: pide ver una pantalla cualquiera —un listado de clientes, un informe de ventas— con dos empresas cargadas. Si aparece algo de la otra empresa, aunque sea un nombre en un desplegable, eso es una fuga. En un sistema bien hecho no pasa nunca.' },
        ],
      },
      {
        id: 'lo-que-se-comparte',
        titulo: 'Qué se comparte y qué no',
        bloques: [
          'La línea correcta no es «todo separado». Hay cosas que compartir es lo sensato:',
          {
            lista: [
              '<strong>Se comparte:</strong> el catálogo de clientes y proveedores con su identificación fiscal —un RNC no cambia según con cuál de tus empresas facture—, los países, las monedas.',
              '<strong>NO se comparte nunca:</strong> la contabilidad, la numeración de comprobantes, los saldos, el inventario, la nómina, los permisos y cualquier dato de operación.',
            ],
          },
          'Confundir esa línea en cualquiera de las dos direcciones da problemas: compartir de más es una fuga; separar de más obliga a mantener el mismo dato en varios sitios, y entonces divergen.',
        ],
      },
    ],

    cierre: {
      titulo: 'Varias empresas, un solo sistema',
      texto: 'Zyntello separa por empresa la contabilidad, la numeración, los saldos y los permisos, y comparte lo que debe compartirse. Sin coste adicional por empresa.',
    },
  },

  {
    slug: 'multimoneda-no-es-un-campo',
    titulo: 'Multi-moneda no es un campo: es todo el recorrido',
    tema: 'Arquitectura',
    cluster: 'erp',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'Tener un desplegable de monedas no es ser multi-moneda. La prueba está en el cobro, en el cierre y en el informe de hace seis meses.',

    secciones: [
      {
        id: 'el-campo',
        titulo: 'El campo es lo fácil',
        bloques: [
          'Añadir un desplegable de moneda a una factura es media hora de trabajo. Por eso casi todos los sistemas dicen ser multi-moneda.',
          'Lo difícil es todo lo demás: que ese dato sobreviva al cobro, al cierre, al informe y al paso del tiempo sin contradecirse.',
        ],
      },
      {
        id: 'las-pruebas',
        titulo: 'Las cuatro pruebas',
        bloques: [
          {
            lista: [
              '<strong>Factura en una moneda, cobra en otra.</strong> ¿El sistema calcula la diferencia cambiaria y la manda a su cuenta, o te deja un saldo descuadrado que alguien ajusta a mano?',
              '<strong>Abre un documento de hace seis meses.</strong> ¿Muestra la cifra que se facturó entonces, o la convierte a la tasa de hoy? Si la convierte, está reescribiendo el pasado.',
              '<strong>Mira el inventario.</strong> ¿Mantiene el costo al que entró la mercancía, o lo revaloriza? Revalorizarlo convierte el margen en ruido.',
              '<strong>Pide un balance en la otra moneda.</strong> ¿Sale, y se puede explicar de dónde sale cada conversión?',
            ],
          },
          'Un sistema que falla en la segunda es el más peligroso, porque <strong>no da ningún error</strong>: simplemente los informes históricos cambian de cifra según el día en que los mires, y nadie sabe cuál era el bueno.',
        ],
      },
      {
        id: 'donde-mas-importa',
        titulo: 'Dónde importa más de lo que parece',
        bloques: [
          'Mucha gente cree que esto solo aplica si facturas en el extranjero. No es así:',
          {
            lista: [
              'Si compras importado y vendes en local, tu costo es multi-moneda aunque tus facturas no lo sean.',
              'Si tienes una cuenta bancaria en divisa, su saldo cambia de valor cada día.',
              'Si pagas a un proveedor extranjero a plazo, la deuda cambia de valor mientras no la pagues.',
            ],
          },
          'El mecanismo completo está en <a href="https://zyntello.com/blog/diferencia-cambiaria-donde-se-pierde-el-margen/">diferencia cambiaria</a>, y el caso más exigente en <a href="https://zyntello.com/blog/facturacion-venezuela-iva-igtf/">facturar en Venezuela</a>.',
        ],
      },
    ],

    cierre: {
      titulo: 'Multi-moneda de punta a punta',
      texto: 'En Zyntello cada documento guarda su tasa, la diferencia cambiaria va a su cuenta, el inventario mantiene su costo y los informes salen en cualquier moneda.',
    },
  },

  /* ═══════════════════ VERTICALES ══════════════════════════════════════ */
  {
    slug: 'restaurante-cuadre-de-turno',
    titulo: 'Restaurante: por qué el cuadre de turno nunca sale y cómo se arregla',
    tema: 'Restaurante',
    cluster: 'verticales',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'La caja de un restaurante descuadra por cosas concretas: cortesías, cancelaciones después de imprimir, propinas y el consumo del personal.',

    secciones: [
      {
        id: 'el-cierre',
        titulo: 'El momento más tenso del día',
        bloques: [
          'El cierre de turno en un restaurante junta a la persona más cansada del día con la tarea que menos margen de error admite. Y descuadra casi siempre.',
          'Lo interesante es que las causas son pocas y se repiten, así que se pueden cerrar una por una.',
        ],
      },
      {
        id: 'las-causas',
        titulo: 'De dónde sale la diferencia',
        bloques: [
          {
            lista: [
              '<strong>Cortesías y atenciones.</strong> El postre invitado, la ronda de la casa. Si no se registran como cortesía, salen como mercancía desaparecida.',
              '<strong>Cancelaciones después de enviar a cocina.</strong> El plato se hizo y se tiró. El producto salió del inventario y no hay venta que lo respalde.',
              '<strong>Propinas.</strong> Entran con el cobro y no son ingreso del negocio. Mezcladas con la venta, la caja sobra y el informe de ventas miente.',
              '<strong>Consumo del personal.</strong> La comida del turno sale del mismo inventario. Sin registrar, es merma sin explicación.',
              '<strong>Cambios de mesa y cuentas divididas.</strong> Donde más se pierden líneas: una cuenta que se parte en tres y una de las partes no se cobra.',
              '<strong>Anulaciones sin motivo.</strong> Si se puede anular sin decir por qué y sin que quede quién, el descuadre no tiene dueño.',
            ],
          },
          { aviso: 'La cortesía y la cancelación después de comanda son las dos que más se subestiman, y son las que conectan la caja con el inventario. Un restaurante que no las registra no puede saber su costo de materia prima, por mucho que cuadre el efectivo.' },
        ],
      },
      {
        id: 'como-se-cierra',
        titulo: 'Cómo se cierra',
        bloques: [
          {
            lista: [
              'Cada turno con su apertura, su responsable y su fondo. El descuadre tiene un nombre, no es «de la caja».',
              'Cortesías, cancelaciones y consumo de personal con su propio tipo de registro y su motivo.',
              'Propinas separadas del ingreso desde el cobro.',
              'Anulación con motivo obligatorio y con quién la hizo.',
              'El arqueo compara lo contado con lo esperado y deja escrito el resultado, sin permitir cuadrarlo a mano.',
            ],
          },
          'Y lo que ata todo: <strong>que cada plato vendido descuente sus ingredientes</strong>. Sin eso, el inventario del restaurante es un inventario de compras, no de consumo.',
        ],
      },
    ],

    cierre: {
      titulo: 'Turnos que cuadran',
      texto: 'El módulo de Restaurante de Zyntello lleva el turno con su responsable, las cortesías y cancelaciones con motivo, y descuenta la receta de cada plato.',
      ruta: '/restaurante/',
    },
    destino: { ruta: '/restaurante/', texto: 'Ver Restaurante' },
  },

  {
    slug: 'condominios-cobrar-la-cuota-a-tiempo',
    titulo: 'Condominios: por qué la cuota no se cobra y el fondo nunca alcanza',
    tema: 'Condominios',
    cluster: 'verticales',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'La morosidad en un condominio no es un problema de cobranza: es de transparencia. Quien no ve en qué se gasta, deja de pagar.',

    secciones: [
      {
        id: 'el-circulo',
        titulo: 'El círculo que se retroalimenta',
        bloques: [
          'La administración de un condominio tiene un problema que se realimenta solo: <strong>quien no entiende en qué se gasta su cuota, deja de pagarla</strong>. Y cuantos menos pagan, peor se mantiene el edificio, lo que da más motivos para no pagar.',
          'Romper ese círculo es menos cuestión de perseguir y más de que cada propietario vea, sin pedirlo, qué debe y en qué se fue lo que pagó.',
        ],
      },
      {
        id: 'lo-que-falla',
        titulo: 'Lo que falla en la práctica',
        bloques: [
          {
            lista: [
              '<strong>El estado de cuenta llega tarde o no llega.</strong> El propietario se entera de que debe cuando ya debe tres meses.',
              '<strong>El recargo por mora se aplica a ojo.</strong> Unas veces sí, otras no, según quién reclame. En cuanto se sabe que es negociable, deja de disuadir.',
              '<strong>Los pagos no se identifican.</strong> Transferencias sin referencia que nadie sabe de qué apartamento son.',
              '<strong>Las cuotas extraordinarias se mezclan con las ordinarias</strong>, y el propietario no distingue qué es el mantenimiento y qué la derrama del ascensor.',
              '<strong>Nadie ve en qué se gasta.</strong> El informe se presenta en la asamblea, una vez al año, en papel.',
            ],
          },
        ],
      },
      {
        id: 'que-cambia',
        titulo: 'Qué cambia cuando se resuelve',
        bloques: [
          {
            lista: [
              '<strong>Estado de cuenta accesible en cualquier momento</strong>, no cuando alguien lo pide. Lo que se ve, se paga.',
              '<strong>Mora calculada por regla</strong>, igual para todos y automática. Deja de ser una negociación.',
              '<strong>Recibo automático al recibir el pago</strong>, con la referencia que identifica la unidad.',
              '<strong>Ordinarias y extraordinarias separadas</strong>, cada una con su destino.',
              '<strong>Gastos a la vista</strong>: en qué se fue el dinero, por partida y por mes.',
              '<strong>Fondo de reserva con su saldo</strong>, para que la derrama no sea siempre la única salida.',
            ],
          },
          { aviso: 'La medida más efectiva suele ser la más simple: que cada propietario pueda ver su saldo y el gasto común cuando quiera. La morosidad baja sin que nadie persiga a nadie, porque deja de haber la sospecha de que el dinero se pierde.' },
        ],
      },
    ],

    cierre: {
      titulo: 'Que la cuota se cobre sola',
      texto: 'Condominios de Zyntello lleva las cuotas, la mora por regla, el portal del propietario y el fondo de reserva con su saldo a la vista.',
      ruta: '/condominios/',
    },
    destino: { ruta: '/condominios/', texto: 'Ver Condominios' },
  },

  {
    slug: 'prestamos-mora-e-intereses-como-se-calculan',
    titulo: 'Préstamos y venta a crédito: dónde se equivocan los cálculos de mora',
    tema: 'Financiero',
    cluster: 'verticales',
    pais: null,
    fecha: HOY,
    minutos: 6,
    resumen: 'Un interés mal calculado no da error: da un número plausible. Y en una cartera de préstamos, un error pequeño repetido mil veces es mucho dinero.',

    secciones: [
      {
        id: 'plausible',
        titulo: 'El peor error es el que parece correcto',
        bloques: [
          'En una cartera de préstamos, los errores de cálculo <strong>no producen mensajes de error: producen cuotas ligeramente distintas de las que deberían ser</strong>. Y como parecen razonables, nadie las revisa.',
          'Multiplicado por cientos de clientes y decenas de cuotas, un error pequeño y sistemático es mucho dinero — y, según el caso, un problema con el cliente o con el regulador.',
        ],
      },
      {
        id: 'los-errores',
        titulo: 'Dónde se equivocan los cálculos',
        bloques: [
          {
            lista: [
              '<strong>La base de días.</strong> Calcular sobre 360 o sobre 365 días da resultados distintos. Ninguna es incorrecta; mezclarlas sí.',
              '<strong>Sobre qué saldo se calcula la mora.</strong> ¿Sobre la cuota vencida, sobre el capital de esa cuota, sobre el total del préstamo? Son tres cifras muy distintas y hay que elegir una, escribirla y respetarla.',
              '<strong>El orden de aplicación del pago.</strong> Un abono que no cubre todo, ¿a qué se aplica primero: mora, interés o capital? El orden cambia el saldo final y el plazo.',
              '<strong>Los días de gracia.</strong> Si existen, ¿la mora se calcula desde el vencimiento o desde el fin de la gracia? Las dos se implementan y dan números distintos.',
              '<strong>El redondeo.</strong> Redondear cada cuota o redondear al final cambia el total. Es céntimos por cuota, y miles en la cartera.',
            ],
          },
          { aviso: 'La comprobación que lo revela: coge un préstamo real, calcula la tabla a mano en una hoja y compárala con la del sistema, cuota a cuota. Si hay diferencia en la cuota 18, la habrá en todos los préstamos.' },
        ],
      },
      {
        id: 'los-casos-raros',
        titulo: 'Los casos que rompen los sistemas',
        bloques: [
          'El cálculo normal lo hace cualquiera. Lo que separa un sistema de préstamos serio es cómo maneja lo que no es normal:',
          {
            lista: [
              '<strong>El abono extraordinario a capital.</strong> ¿Reduce la cuota o el plazo? El cliente debe poder elegir, y la tabla se rehace.',
              '<strong>La refinanciación.</strong> Un préstamo que se reestructura no es uno nuevo: hay que conservar la historia.',
              '<strong>El pago parcial repetido.</strong> Alguien que siempre paga un poco menos genera un arrastre que hay que seguir con precisión.',
              '<strong>La condonación.</strong> Perdonar mora es una decisión con nombre y motivo, no un ajuste.',
            ],
          },
        ],
      },
      {
        id: 'la-cartera',
        titulo: 'Y lo que hay que ver de la cartera',
        bloques: [
          'Más allá del cálculo individual, la pregunta de gestión es cuánto de lo prestado vas a recuperar. Eso exige ver la cartera por tramos de mora, su evolución, y qué parte está en manos de pocos clientes — el mismo razonamiento que en <a href="https://zyntello.com/blog/antiguedad-de-saldos-lo-que-no-dice/">la antigüedad de saldos</a>, con más consecuencias.',
          { aviso: 'La actividad de préstamo está regulada de forma distinta en cada país, y hay límites y requisitos que cumplir. Confirma tu marco con un asesor antes de definir tasas y recargos.' },
        ],
      },
    ],

    cierre: {
      titulo: 'Cálculos que resisten una revisión',
      texto: 'Prestamello lleva la tabla de amortización, la mora por la regla que definas, el orden de aplicación del pago y los abonos extraordinarios.',
      ruta: '/prestamello/',
    },
    destino: { ruta: '/prestamello/', texto: 'Ver Prestamello' },
  },

  {
    slug: 'servicios-recurrentes-lo-que-se-escapa',
    titulo: 'Negocios de servicio: lo que se escapa entre la orden y el cobro',
    tema: 'Servicios',
    cluster: 'verticales',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'En un lavadero, un taller o una clínica el producto es tiempo, y el tiempo no deja rastro si nadie lo registra. Dónde se pierde el dinero.',

    secciones: [
      {
        id: 'el-producto-invisible',
        titulo: 'Cuando el producto no se puede contar',
        bloques: [
          'En un negocio de servicio no hay estantería que contar. Si un lavado, una reparación o una consulta no se registraron, <strong>no hay forma de descubrirlo después</strong>: no falta ninguna mercancía.',
          'Eso hace que los mismos descuidos que en un comercio se detectan en el inventario, aquí se queden para siempre.',
        ],
      },
      {
        id: 'donde-se-escapa',
        titulo: 'Dónde se escapa el dinero',
        bloques: [
          {
            lista: [
              '<strong>El servicio prestado y no cobrado.</strong> Se atendió al cliente, se le hizo el trabajo y nadie emitió la cuenta. En un mostrador con cola, pasa más de lo que se cree.',
              '<strong>El extra que no se facturó.</strong> Se añadió un tratamiento, un repuesto o una prueba, y quedó fuera de la cuenta.',
              '<strong>El descuento que se da de palabra</strong>, distinto según quién atiende y sin que quede quién lo autorizó.',
              '<strong>El insumo consumido que no se descuenta.</strong> El producto de limpieza, el material del taller. El servicio se cobró, pero el costo nunca entró.',
              '<strong>La cita que no llega.</strong> No es solo el ingreso perdido: es el hueco que se pudo llenar con otro.',
              '<strong>La comisión del técnico</strong> calculada sobre una hoja que no coincide con lo facturado.',
            ],
          },
          { aviso: 'El más caro es el cuarto y casi nadie lo mira: si no se descuenta el insumo, el servicio parece más rentable de lo que es. Se siguen dando precios sobre un costo que no existe.' },
        ],
      },
      {
        id: 'que-cambia',
        titulo: 'Qué lo cierra',
        bloques: [
          {
            lista: [
              '<strong>Que el servicio se abra al empezar, no al cobrar.</strong> Una orden abierta es una cuenta pendiente que se ve; un servicio sin orden no existe.',
              '<strong>Que los extras se añadan a la orden en el momento</strong>, no de memoria al final.',
              '<strong>Que el descuento tenga tope y quede con quién lo dio.</strong>',
              '<strong>Que cada servicio tenga su consumo definido</strong> y lo descuente al completarse.',
              '<strong>Que la agenda y la facturación sean lo mismo</strong>, para que una cita atendida no pueda quedarse sin cuenta.',
            ],
          },
          'Y lo que convierte esto en negocio recurrente: <strong>saber cuándo toca volver</strong>. El mantenimiento a los seis meses, la revisión al año. Un cliente que vuelve porque se le avisó cuesta mucho menos que uno nuevo.',
        ],
      },
    ],

    cierre: {
      titulo: 'Que no se escape ningún servicio',
      texto: 'Zyntello tiene módulos para lavaderos, talleres y consultas: la orden se abre al empezar, los extras se añaden en el momento y el insumo se descuenta solo.',
      ruta: '/carwash/',
    },
    destino: { ruta: '/carwash/', texto: 'Ver Car Wash' },
  },
]
