/**
 * Clúster «Nómina y obligaciones laborales» — uno por país + los de fondo.
 *
 * ⚠️⚠️ LOS PORCENTAJES Y TOPES CAMBIAN TODOS LOS AÑOS, y algunos por decreto a
 * mitad de año. Por eso estos artículos explican QUÉ se paga y POR QUÉ, no
 * cuánto: un número desactualizado en una página pública hace más daño que no
 * tener la página. Cada uno cierra avisando de confirmar las cifras vigentes.
 *
 * ⚠️ Lo que sí es estable —y es donde está el valor— son los mecanismos: que
 * el pago de vacaciones es un adelanto, que la cesantía hay que provisionarla,
 * que un aguinaldo sin provisión convierte diciembre en un agujero.
 */

const HOY = '2026-09-26'

export const NOMINA = [
  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'el-pago-de-vacaciones-es-un-adelanto',
    titulo: 'El pago de vacaciones es un adelanto',
    tema: 'Vacaciones',
    cluster: 'nomina',
    pais: 'DO',
    fecha: HOY,
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
          'Cuando esa provisión no se lleva, el resultado del mes se ve mejor de lo que es, y el golpe llega de una vez el mes en que varias personas se van o liquidan. Es el mismo problema que con <a href="https://zyntello.com/blog/prestaciones-laborales-rd-cesantia-preaviso/">la cesantía y el preaviso</a>, solo que con cifras más pequeñas y por eso menos visible.',
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
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'tss-republica-dominicana-que-se-descuenta',
    titulo: 'La TSS: qué se descuenta, qué aporta la empresa y dónde se equivoca todo el mundo',
    tema: 'Seguridad social',
    cluster: 'nomina',
    pais: 'DO',
    fecha: HOY,
    minutos: 6,
    resumen: 'El error de la TSS casi nunca es el porcentaje: es el salario sobre el que se aplica. Qué entra en la base cotizable y por qué el tope cambia el cálculo.',

    secciones: [
      {
        id: 'dos-lados',
        titulo: 'Son dos costes, no uno',
        bloques: [
          'La primera confusión es de concepto, y la tiene mucha gente que lleva años haciendo nóminas: <strong>la seguridad social dominicana la pagan los dos</strong>. Una parte se le descuenta al trabajador de su salario; otra la aporta la empresa encima de ese salario.',
          'Eso significa que <strong>el coste real de un empleado no es su salario</strong>. Es su salario más el aporte patronal, y la diferencia no es menor. Presupuestar una contratación por el salario bruto es quedarse corto de forma sistemática.',
          'Los conceptos son tres: el seguro familiar de salud, el de pensiones y el de riesgos laborales. A ellos se suma el aporte de formación técnica, que es solo del empleador.',
        ],
      },
      {
        id: 'la-base',
        titulo: 'El error real: la base, no el porcentaje',
        bloques: [
          'Los porcentajes están publicados y casi nadie se equivoca en ellos. Donde se equivoca casi todo el mundo es en <strong>sobre qué se aplican</strong>:',
          {
            lista: [
              '<strong>No todo lo que se le paga a un trabajador cotiza.</strong> Hay conceptos que forman parte del salario cotizable y otros que no. Meter un concepto en el grupo equivocado desvía el aporte todos los meses.',
              '<strong>Hay topes.</strong> Por encima de cierto salario, la cotización deja de subir. Un sistema que no aplica el tope cobra de más al empleado y paga de más la empresa, mes tras mes.',
              '<strong>Los topes no son iguales para los tres conceptos.</strong> Aplicar el mismo a todos es un error que da cifras casi correctas, que es la peor clase de error.',
              '<strong>El trabajador que entra o sale a mitad de mes</strong> cotiza por lo que corresponde a esos días, no por el mes entero.',
            ],
          },
          { aviso: 'Un aporte mal calculado no rebota: la TSS lo acepta. El problema aparece cuando el trabajador va a usar su seguro o a pedir su pensión y las semanas no cuadran, y entonces la corrección es retroactiva.' },
        ],
      },
      {
        id: 'novedades',
        titulo: 'Las novedades son la mitad del trabajo',
        bloques: [
          'Lo que de verdad consume tiempo cada mes no es calcular: es reportar los cambios. Ingresos, salidas, cambios de salario, licencias, subsidios. Si eso se hace a mano en el portal, se hace dos veces: una en el sistema de nómina y otra en la TSS.',
          'Y cuando se hace dos veces, tarde o temprano una de las dos se olvida. El síntoma clásico: un trabajador que salió hace tres meses y por el que se sigue cotizando, o uno que entró y no aparece.',
        ],
      },
      {
        id: 'que-pedir',
        titulo: 'Qué debería hacer el sistema',
        bloques: [
          {
            lista: [
              'Clasificar cada concepto de pago como cotizable o no, <strong>una vez</strong>, al definirlo, y no en cada nómina.',
              'Aplicar los topes que correspondan a cada concepto, con sus valores del año en curso.',
              'Prorratear ingresos y salidas de mitad de mes sin que nadie calcule días a mano.',
              'Generar el archivo de novedades desde los mismos datos con los que se pagó, no desde una captura aparte.',
            ],
          },
          'Si además llevas prestaciones, conviene leer <a href="https://zyntello.com/blog/prestaciones-laborales-rd-cesantia-preaviso/">cómo se calculan la cesantía y el preaviso</a>: comparten la misma base salarial y los mismos errores de clasificación.',
          { aviso: 'Los porcentajes, los topes y los conceptos cotizables se actualizan por resolución, normalmente cada año. Confirma los vigentes con la TSS o con tu asesor laboral: aquí se explica el mecanismo, no las cifras.' },
        ],
      },
    ],

    cierre: {
      titulo: 'La TSS, calculada y reportada desde lo mismo',
      texto: 'En Zyntello el aporte sale de la nómina que ya calculaste, con los conceptos clasificados una sola vez y los topes aplicados solos.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'prestaciones-laborales-rd-cesantia-preaviso',
    titulo: 'Cesantía y preaviso: la deuda que crece cada mes y no está en el balance',
    tema: 'Prestaciones laborales',
    cluster: 'nomina',
    pais: 'DO',
    fecha: HOY,
    minutos: 7,
    resumen: 'Las prestaciones no se generan al despedir: se generan cada mes que el trabajador sigue ahí. Sin provisión, una salida normal se convierte en un problema de caja.',

    secciones: [
      {
        id: 'la-deuda-invisible',
        titulo: 'La deuda que crece sin que nadie la vea',
        bloques: [
          'Hay una idea equivocada muy extendida: que las prestaciones laborales son un gasto del mes en que alguien se va. No lo son. <strong>Se van generando cada mes que el trabajador sigue en la empresa</strong>, aunque nadie las anote.',
          'La consecuencia es una deuda real que crece sola y que, si no se provisiona, <strong>no aparece en ningún estado financiero hasta que alguien renuncia</strong>. Ese mes el resultado se hunde, y no porque el negocio fuera mal: porque llevaba meses reportando un resultado mejor del que tenía.',
          { aviso: 'Este es el cálculo que más sorpresas da en una empresa con antigüedad. Diez personas con cinco, ocho y doce años no son una contingencia menor: son varios meses de nómina esperando a ser reclamados.' },
        ],
      },
      {
        id: 'los-conceptos',
        titulo: 'Qué compone la liquidación',
        bloques: [
          'La liquidación de una salida en República Dominicana combina varios conceptos, y cada uno tiene su propia regla:',
          {
            lista: [
              '<strong>Preaviso.</strong> Depende de la antigüedad y de quién termina el contrato. Se puede dar el aviso o pagarlo.',
              '<strong>Cesantía.</strong> Escala con la antigüedad, y la escala no es lineal: los tramos cambian el número de días por año.',
              '<strong>Vacaciones no disfrutadas.</strong> Aquí es donde importa distinguir días pendientes de días disponibles, como explicamos en <a href="https://zyntello.com/blog/el-pago-de-vacaciones-es-un-adelanto/">el artículo sobre el pago de vacaciones</a>.',
              '<strong>La parte proporcional del salario de navidad</strong> correspondiente al tiempo trabajado en el año.',
              '<strong>La bonificación o participación en beneficios</strong>, cuando corresponda.',
            ],
          },
          'Y sobre todo: <strong>el motivo de la salida cambia qué se paga</strong>. Un desahucio, una dimisión y una terminación por causa justificada no liquidan lo mismo. Un sistema que calcula siempre igual está mal en dos de los tres casos.',
        ],
      },
      {
        id: 'el-salario',
        titulo: 'El salario que se usa no es el del último mes',
        bloques: [
          'Otro punto donde se falla mucho: la base de cálculo no es «el sueldo». Se construye con el promedio de un período y <strong>con los conceptos que forman parte del salario ordinario</strong>, que no son todos los que aparecen en el recibo.',
          'Las comisiones, las horas extras y ciertos bonos pueden entrar o no según su naturaleza y su regularidad. Clasificarlos mal cambia la liquidación entera, y es un error que solo se descubre cuando el trabajador reclama.',
        ],
      },
      {
        id: 'la-provision',
        titulo: 'Provisionar no es opcional (aunque nadie te obligue)',
        bloques: [
          'La forma de que esto deje de ser un sobresalto es calcular cada mes cuánto se debería si todos se fueran, y llevarlo como provisión. Eso convierte un golpe puntual en un gasto repartido, que es lo que de verdad es.',
          'Y tiene un segundo efecto que se valora cuando llega: <strong>saber cuánto cuesta una reestructuración antes de decidirla</strong>. Sin la provisión, esa cifra se calcula a mano y tarde.',
          {
            lista: [
              'La provisión se recalcula cada mes, con la antigüedad actualizada.',
              'Se separa por concepto, porque no todos se pagan en todos los casos.',
              'Se puede simular una salida concreta sin tener que ejecutarla.',
            ],
          },
          { aviso: 'Las escalas, los tramos de antigüedad y los conceptos que entran en la base están en el Código de Trabajo y su interpretación puede variar. Confirma cada caso con tu asesor laboral antes de liquidar.' },
        ],
      },
    ],

    cierre: {
      titulo: 'Saber cuánto debes antes de que te lo pidan',
      texto: 'Zyntello calcula la provisión de prestaciones cada mes y permite simular una liquidación con el motivo de salida que corresponda, sin hojas aparte.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'nomina-colombia-seguridad-social',
    titulo: 'Nómina en Colombia: por qué el coste real es mucho más que el salario',
    tema: 'Nómina',
    cluster: 'nomina',
    pais: 'CO',
    fecha: HOY,
    minutos: 7,
    resumen: 'Seguridad social, parafiscales y prestaciones. Qué se paga encima del sueldo, qué provisionar y por qué el salario integral no siempre conviene.',

    secciones: [
      {
        id: 'tres-capas',
        titulo: 'El coste de un empleado tiene tres capas',
        bloques: [
          'Colombia es, probablemente, el país de la región donde más se separa el salario del coste real. Quien presupuesta por el sueldo se queda corto de forma sistemática, porque encima hay tres capas distintas:',
          {
            lista: [
              '<strong>Seguridad social.</strong> Salud, pensión y riesgos laborales. Una parte la descuenta el empleado de su sueldo y otra la aporta la empresa. El riesgo laboral depende de la actividad: no es el mismo para una oficina que para una obra.',
              '<strong>Parafiscales.</strong> Aportes a formación, bienestar familiar y caja de compensación. Van enteros a cargo de la empresa y hay casos de exoneración según el nivel salarial.',
              '<strong>Prestaciones sociales.</strong> Prima, cesantías con sus intereses y vacaciones. No se pagan con la nómina del mes: se acumulan y se pagan en fechas concretas.',
            ],
          },
          { aviso: 'Las prestaciones son el motivo por el que una empresa colombiana puede tener el año cuadrado y aun así quedarse sin caja en junio y en diciembre: esos meses concentran pagos que se generaron durante todo el año.' },
        ],
      },
      {
        id: 'cesantias',
        titulo: 'Las cesantías: el mecanismo que más se entiende mal',
        bloques: [
          'Las cesantías no se le pagan al trabajador cada mes ni se quedan en la empresa. <strong>Se acumulan durante el año y se consignan en un fondo</strong> en la fecha que corresponde. Además generan un interés anual a favor del trabajador, que sí se le paga directamente.',
          'Los errores que vemos:',
          {
            lista: [
              'No provisionarlas mes a mes, y descubrir el importe completo justo antes de la fecha de consignación.',
              'Calcular el interés sobre el saldo equivocado, o sobre un período que no corresponde.',
              'No contemplar los retiros parciales autorizados, que cambian el saldo.',
              'Olvidar que un trabajador que entró a mitad de año tiene una base proporcional, no completa.',
            ],
          },
        ],
      },
      {
        id: 'auxilio',
        titulo: 'El auxilio de transporte y la base de cada cosa',
        bloques: [
          'Un detalle pequeño que descuadra muchas nóminas: el auxilio de transporte se paga por debajo de cierto nivel salarial, y <strong>entra en la base de unas cosas y no de otras</strong>. Meterlo donde no va o dejarlo fuera donde sí va cambia prestaciones y aportes a la vez.',
          'El principio general sirve para todo: cada concepto de pago tiene que estar clasificado una sola vez —si cotiza, si es base de prestaciones, si es salarial o no— y que el cálculo lo herede. Clasificarlo en cada nómina es garantizar que un mes se hará distinto.',
        ],
      },
      {
        id: 'integral',
        titulo: 'El salario integral no es automáticamente mejor',
        bloques: [
          'Por encima de cierto nivel salarial se puede pactar un salario integral, que incorpora las prestaciones dentro del propio salario. Simplifica mucho la nómina, y por eso se propone a menudo como solución.',
          'Pero no siempre conviene, y la decisión no es de nómina: es de costes y de negociación. Lo que sí es seguro es que <strong>tiene un mínimo legal y unas reglas propias</strong>, y aplicarlo mal deja a la empresa expuesta.',
          'A esto se suma la nómina electrónica, que hay que transmitir con su periodicidad. Se alimenta del cálculo: si el cálculo está mal clasificado, el envío también. Lo tratamos junto con <a href="https://zyntello.com/blog/factura-electronica-colombia-dian/">la factura electrónica y la DIAN</a>.',
          { aviso: 'Porcentajes, topes, niveles de exoneración y el mínimo del salario integral se actualizan cada año. Confirma las cifras vigentes con tu asesor laboral: aquí se explica el mecanismo.' },
        ],
      },
    ],

    cierre: {
      titulo: '¿Nómina en Colombia?',
      texto: 'Zyntello calcula seguridad social, parafiscales y prestaciones con los conceptos clasificados una sola vez, y provisiona lo que se paga en junio y diciembre.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'nomina-costa-rica-ccss-aguinaldo',
    titulo: 'Nómina en Costa Rica: la CCSS, el aguinaldo y la provisión que salva diciembre',
    tema: 'Nómina',
    cluster: 'nomina',
    pais: 'CR',
    fecha: HOY,
    minutos: 6,
    resumen: 'El aguinaldo no es un gasto de diciembre: es un gasto de todo el año que se paga en diciembre. Y las cargas sociales costarricenses son de las más altas de la región.',

    secciones: [
      {
        id: 'las-cargas',
        titulo: 'Las cargas sociales pesan, y conviene saberlo antes de contratar',
        bloques: [
          'Costa Rica tiene una de las cargas sociales más altas de Centroamérica, repartida entre lo que se le descuenta al trabajador y lo que aporta la empresa. Quien viene de otro país de la región y presupuesta con las cifras de allá se lleva una sorpresa de dos dígitos.',
          'El aporte cubre el seguro de enfermedad y maternidad, el régimen de invalidez, vejez y muerte, y varios fondos adicionales. A eso se suma la póliza de riesgos del trabajo, que es obligatoria y va aparte.',
          { aviso: 'La planilla se reporta y se paga con una periodicidad fija. Un trabajador no reportado no es un ahorro: es una contingencia que aparece en la primera inspección, con los períodos atrasados recalculados.' },
        ],
      },
      {
        id: 'aguinaldo',
        titulo: 'El aguinaldo: el mes trece que hay que ir guardando',
        bloques: [
          'El aguinaldo es un salario adicional que se paga en diciembre, calculado sobre lo devengado durante el período que corresponde. Y aquí está el problema de caja más repetido:',
          '<strong>Se genera durante todo el año y se paga de una vez.</strong> La empresa que no lo provisiona mes a mes llega a diciembre con un mes entero de nómina extra que no estaba en el presupuesto, justo cuando además hay cierre y vacaciones.',
          'La solución es contable y es sencilla: apartar una doceava parte cada mes. Lo difícil no es el cálculo, es acordarse — y por eso conviene que lo haga el sistema y no una hoja.',
          {
            lista: [
              'Se calcula sobre el promedio de lo devengado en el período correspondiente, no sobre el sueldo de diciembre.',
              'Entran los conceptos que forman parte del salario, y ahí es donde se cometen los errores: comisiones, horas extras, bonos regulares.',
              'Un trabajador que entró a mitad de período cobra la parte proporcional.',
            ],
          },
        ],
      },
      {
        id: 'vacaciones',
        titulo: 'Vacaciones y liquidación',
        bloques: [
          'Las vacaciones se generan según el tiempo trabajado y, igual que en el resto de la región, <strong>los días acumulados y no disfrutados son una deuda de la empresa</strong> que conviene provisionar.',
          'En la liquidación entran además el preaviso y la cesantía, con sus propias escalas según la antigüedad y el motivo de la salida. El mecanismo de fondo es el mismo que describimos para <a href="https://zyntello.com/blog/prestaciones-laborales-rd-cesantia-preaviso/">la cesantía dominicana</a>, aunque las escalas y los topes cambian.',
        ],
      },
      {
        id: 'que-pedir',
        titulo: 'Qué debería resolver el sistema',
        bloques: [
          {
            lista: [
              'Calcular la planilla con las cargas de empleado y empresa separadas, para que el coste real esté a la vista.',
              'Provisionar aguinaldo y vacaciones cada mes, sin que nadie se acuerde.',
              'Generar el reporte de planilla desde el mismo cálculo con el que se pagó.',
              'Simular una liquidación antes de ejecutarla, con el motivo de salida correspondiente.',
            ],
          },
          { aviso: 'Los porcentajes de las cargas sociales y los topes se actualizan periódicamente. Confirma las cifras vigentes con la CCSS o con tu asesor laboral antes de presupuestar.' },
        ],
      },
    ],

    cierre: {
      titulo: '¿Nómina en Costa Rica?',
      texto: 'Zyntello lleva las cargas sociales, la provisión de aguinaldo y la de vacaciones, y calcula la liquidación según el motivo de salida.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'nomina-guatemala-igss-bono14-aguinaldo',
    titulo: 'Nómina en Guatemala: dos pagos extra al año y una bonificación que no cotiza',
    tema: 'Nómina',
    cluster: 'nomina',
    pais: 'GT',
    fecha: HOY,
    minutos: 6,
    resumen: 'Bono 14 en julio, aguinaldo en diciembre y una bonificación incentivo que no entra en la base. Tres particularidades que descuadran cualquier nómina importada de otro país.',

    secciones: [
      {
        id: 'dos-pagos',
        titulo: 'Dos pagos extra, en dos momentos del año',
        bloques: [
          'Guatemala tiene una particularidad que sorprende a quien viene de fuera: <strong>hay dos pagos anuales adicionales, no uno</strong>. El bono 14 a mitad de año y el aguinaldo a final de año.',
          'Para la caja de la empresa eso significa dos picos, no uno. Y para la contabilidad, que hay que provisionar dos cosas a la vez durante todo el año. Una empresa que solo provisiona el aguinaldo llega a julio con medio problema resuelto.',
          { aviso: 'Cada uno tiene su propio período de cómputo, y no coinciden con el año natural. Calcular los dos sobre el mismo período es uno de los errores más frecuentes al configurar una nómina guatemalteca en un sistema pensado para otro país.' },
        ],
      },
      {
        id: 'bonificacion',
        titulo: 'La bonificación incentivo: el concepto que rompe los cálculos',
        bloques: [
          'Existe una bonificación de carácter incentivo que se paga junto con el salario y que <strong>tiene un tratamiento distinto al del salario ordinario</strong>: no forma parte de la base para ciertos cálculos.',
          'Ese detalle, que parece menor, es el que hace que una nómina configurada «como en el país de al lado» dé cifras equivocadas de forma sistemática:',
          {
            lista: [
              'Si se mete en la base de todo, se cotiza de más y se provisiona de más.',
              'Si se deja fuera de todo, se paga de menos donde sí debía entrar.',
              'Y como la diferencia es pequeña por trabajador, el total parece razonable y nadie lo revisa.',
            ],
          },
          'Es el argumento más claro a favor de clasificar cada concepto una sola vez, al definirlo, en lugar de decidirlo en cada cálculo.',
        ],
      },
      {
        id: 'igss',
        titulo: 'El IGSS y la planilla',
        bloques: [
          'La seguridad social guatemalteca la aportan el trabajador y la empresa, con porcentajes distintos, y se reporta en planilla con su periodicidad. Los errores habituales son los mismos de siempre: altas y bajas que se reportan tarde, y conceptos mal clasificados como cotizables.',
          'La recomendación práctica es la de siempre: <strong>que la planilla salga del mismo cálculo con el que se pagó</strong>. En cuanto hay una captura aparte, aparecen las diferencias.',
        ],
      },
      {
        id: 'liquidacion',
        titulo: 'La indemnización al terminar',
        bloques: [
          'Al terminar la relación laboral entran la indemnización y las partes proporcionales de los pagos anuales y las vacaciones. El motivo de la terminación cambia lo que corresponde, así que un sistema que liquida siempre igual acierta solo en algunos casos.',
          'Y como en el resto de la región, <strong>esa indemnización se va generando cada mes</strong>. No provisionarla es reportar un resultado mejor del real hasta que alguien se va.',
          { aviso: 'Los porcentajes del IGSS, el importe de la bonificación incentivo y los períodos de cómputo se fijan por ley y pueden actualizarse. Confirma lo vigente con el IGSS, el Ministerio de Trabajo o tu asesor laboral.' },
        ],
      },
    ],

    cierre: {
      titulo: '¿Nómina en Guatemala?',
      texto: 'Zyntello contempla el bono 14, el aguinaldo y el tratamiento particular de la bonificación incentivo, con cada concepto clasificado una sola vez.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'nomina-venezuela-salario-que-cambia',
    titulo: 'Nómina en Venezuela: cuando el salario del mes pasado ya no significa lo mismo',
    tema: 'Nómina',
    cluster: 'nomina',
    pais: 'VE',
    fecha: HOY,
    minutos: 6,
    resumen: 'El problema de la nómina venezolana no es el cálculo: es que la unidad de medida se mueve. Qué guardar, con qué tasa y por qué el histórico no se puede reconvertir.',

    secciones: [
      {
        id: 'la-unidad-se-mueve',
        titulo: 'El problema no es calcular: es con qué se mide',
        bloques: [
          'Una nómina normal se calcula una vez y queda. En Venezuela hay un factor añadido que lo cambia todo: <strong>entre que se calcula y que se paga, el valor de la cifra puede haber cambiado</strong>.',
          'Eso convierte decisiones que en otros países son administrativas —en qué moneda se expresa el salario, con qué tasa se convierte, cuándo se fija— en decisiones de negocio que se toman de continuo. Y si el sistema no las registra bien, el histórico deja de ser comparable consigo mismo.',
          { aviso: 'El error que más daño hace es guardar solo el importe y convertirlo al mostrarlo. Eso reescribe el pasado: el recibo de hace seis meses cambia de cifra cada vez que se abre, y deja de coincidir con lo que el trabajador cobró.' },
        ],
      },
      {
        id: 'que-guardar',
        titulo: 'Qué hay que guardar, y por qué',
        bloques: [
          'La regla que evita casi todos los problemas es la misma que en <a href="https://zyntello.com/blog/facturacion-venezuela-iva-igtf/">la facturación</a>: <strong>el importe y su tasa van juntos, y no se recalculan nunca</strong>.',
          {
            lista: [
              'Cada recibo guarda el importe, la moneda y la tasa de su fecha. Es lo que el trabajador cobró, y no puede cambiar después.',
              'Los acumulados del año se calculan sumando lo que se pagó de verdad, no reconvirtiendo el histórico.',
              'Las prestaciones que se van generando se registran con el criterio que se haya pactado, y ese criterio queda escrito.',
              'Los reportes pueden verse en cualquier moneda, pero <strong>mostrando de dónde sale cada conversión</strong>.',
            ],
          },
        ],
      },
      {
        id: 'los-conceptos',
        titulo: 'La estructura del recibo importa más que en otros sitios',
        bloques: [
          'Cuando una parte importante de lo que percibe el trabajador viene por conceptos distintos del salario base, la clasificación de cada uno deja de ser un detalle: <strong>decide qué entra en la base de las prestaciones y qué no</strong>.',
          'Y como esos conceptos suelen ser los que más se ajustan, un concepto mal clasificado se equivoca en cada revisión. Igual que en el resto de países, la solución es clasificar una vez al definir el concepto, no en cada nómina.',
        ],
      },
      {
        id: 'lo-que-si',
        titulo: 'Lo que sí se puede resolver con un sistema',
        bloques: [
          'Hay cosas que un sistema no arregla —ninguna herramienta estabiliza una economía— pero hay bastantes que sí:',
          {
            lista: [
              'Que el recibo de cada mes sea reproducible tal como se emitió, para siempre.',
              'Que el coste de personal se pueda ver en las dos monedas sin rehacer cálculos.',
              'Que un ajuste general se aplique sin tocar trabajador por trabajador.',
              'Que las prestaciones acumuladas estén calculadas y no en una hoja aparte.',
            ],
          },
          { aviso: 'El marco laboral venezolano y los criterios de cálculo tienen particularidades y han cambiado con frecuencia. Confirma la aplicación concreta a tu caso con tu asesor laboral: aquí se explica cómo tratar el problema de la unidad de medida, no la normativa.' },
        ],
      },
    ],

    cierre: {
      titulo: '¿Nómina en Venezuela?',
      texto: 'Zyntello es multimoneda de punta a punta: cada recibo guarda su tasa, el histórico no se reconvierte y los reportes salen en las dos monedas.',
    },
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'feriados-el-calendario-es-por-pais',
    titulo: 'Un calendario de feriados equivocado regala días sin que nadie lo note',
    tema: 'Cálculo de nómina',
    cluster: 'nomina',
    pais: null,
    fecha: HOY,
    minutos: 5,
    resumen: 'Si el sistema usa un calendario que no es el del país de la empresa, las vacaciones salen más largas y las horas extra se pagan mal. Y el error no avisa.',

    secciones: [
      {
        id: 'el-caso',
        titulo: 'Un defecto que solo se ve contando días',
        bloques: [
          'Este es un error real, medido, y es de los que mejor ilustran por qué la nómina es difícil: <strong>una empresa con el calendario de feriados de otro país reparte días de vacaciones de más</strong>, y nada en el sistema lo dice.',
          'El mecanismo es simple. Al contar los días de un permiso o unas vacaciones, los feriados no cuentan como días disfrutados. Si el calendario tiene feriados que en ese país no existen, cada solicitud que los cruce devuelve días al trabajador. Nadie reclama: el trabajador sale ganando y el sistema no marca nada.',
          { aviso: 'Al revés es igual de malo y sí genera quejas: un feriado que falta hace que el trabajador gaste un día de vacaciones en una fecha en la que no trabajaba nadie.' },
        ],
      },
      {
        id: 'donde-mas-pega',
        titulo: 'Dónde pega, además de en las vacaciones',
        bloques: [
          'El calendario no decide solo las vacaciones. Entra en varios cálculos a la vez:',
          {
            lista: [
              '<strong>Horas extra y recargos.</strong> Trabajar un feriado se paga distinto. Si la fecha no está marcada, se paga como un día normal.',
              '<strong>Días hábiles para vencimientos.</strong> Un plazo que vence «en tres días hábiles» depende de qué días lo son.',
              '<strong>Turnos y planificación.</strong> Cubrir un feriado no cuesta lo mismo que cubrir un martes.',
              '<strong>Asistencia.</strong> Una ausencia en un día no laborable no es una ausencia.',
            ],
          },
        ],
      },
      {
        id: 'la-regla',
        titulo: 'La regla: el calendario lo decide el país de la empresa',
        bloques: [
          'La conclusión operativa es corta: <strong>el calendario tiene que venir del país de la empresa, y de un solo sitio</strong>. No de una lista que alguien copió, no de una configuración por usuario, y desde luego no de la fecha del servidor.',
          'Y si la empresa opera en varios países, cada una de sus sociedades usa el suyo. Compartir calendario entre países es exactamente cómo se regalan días sin enterarse.',
          {
            lista: [
              'Los feriados nacionales del país, actualizados cada año.',
              'Los que se trasladan a lunes, que no siempre caen en su fecha.',
              'Los locales o regionales, si aplican a una sede concreta.',
              'Un único sitio que responda «¿es laborable este día?», usado por todos los cálculos.',
            ],
          },
          'Es el mismo principio que con <a href="https://zyntello.com/blog/el-pago-de-vacaciones-es-un-adelanto/">el pago de vacaciones</a>: lo que se calcula en dos sitios distintos acaba dando dos números distintos.',
        ],
      },
    ],

    cierre: {
      titulo: 'El calendario correcto, por país',
      texto: 'En Zyntello el país de la empresa decide su calendario de feriados, y todos los cálculos —vacaciones, recargos, plazos— preguntan al mismo sitio.',
    },
  },
]
