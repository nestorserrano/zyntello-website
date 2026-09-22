/**
 * Las cuatro funcionalidades transversales que un ERP corriente no trae.
 *
 * ⚠️ No son módulos que se contratan: vienen con la plataforma. Por eso tienen
 * sección propia y no una tarjeta más en el catálogo — mezclarlas ahí las haría
 * parecer un extra de pago, que es justo lo contrario de lo que son.
 *
 * ⚠️⚠️ TODAS LAS CIFRAS ESTÁN MEDIDAS sobre el repositorio de zyntello-app el
 * 2026-09-21, no estimadas. Los comandos que las producen están anotados en
 * cada una. Si el producto crece, se vuelven a medir — un número inventado en
 * una página de ventas se descubre en la primera demo.
 */

export const FUNCIONALIDADES = [
  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'aprobaciones',
    nombre: 'Aprobaciones',
    subtitulo: 'Quién autoriza qué, escrito una vez',
    color: '#6366f1',
    icono: 'check',
    resumen: 'Un motor único de autorizaciones que atraviesa 16 módulos. Se define quién aprueba qué y desde qué importe, y el documento no avanza hasta que alguien lo firma.',

    heroTitulo: 'La autorización deja de ser una conversación',
    heroBajada: 'Un solo motor de aprobaciones para los 16 módulos: compras, pagos, facturas, nómina, ajustes de inventario, asientos, presupuesto. Se define una vez quién autoriza qué y desde cuánto — y queda constancia de cada firma.',

    problema: {
      titulo: 'Cuando autorizar es preguntar, nadie sabe quién dijo que sí',
      texto: 'En la mayoría de las empresas la autorización vive en un WhatsApp, un correo o una conversación de pasillo. Funciona hasta el día que hay que explicar quién aprobó una compra de doscientos mil, y entonces no hay documento, solo memorias que no coinciden. Y mientras tanto, lo que espera aprobación no lo ve nadie.',
      puntos: [
        'Una compra grande se aprueba de palabra y no queda registro',
        'Nadie sabe qué está esperando su firma ahora mismo',
        'El que aprueba se va de viaje y todo se detiene',
        'Cada módulo tiene su propia forma de autorizar, o ninguna',
        'Se descubre que algo no se aprobó cuando ya se ejecutó',
        'No hay forma de demostrar quién autorizó qué, ni cuándo',
      ],
    },

    beneficios: [
      { titulo: 'Un motor, 16 módulos', descripcion: 'Compras, CxP, CxC, Facturación, Inventario, Nómina, Bancos, Caja, Caja Chica, Contabilidad, Activos, Presupuesto, CRM, ConstructFlow, Prestamello y Soporte usan el mismo. La regla se define una vez, no dieciséis.' },
      { titulo: 'Umbrales por importe', descripcion: 'Hasta X lo aprueba el jefe de área; por encima, la gerencia. La frontera se escribe una vez y deja de discutirse en cada documento.' },
      { titulo: 'El documento no avanza sin firma', descripcion: 'No es un aviso que se puede ignorar: el motor bloquea la ejecución. Lo que espera aprobación no se paga, no se despacha y no se contabiliza.' },
      { titulo: 'Bandeja de lo pendiente', descripcion: 'Cada aprobador ve lo suyo en una lista, con su antigüedad. Lo que lleva tres días parado se ve, en vez de descubrirse cuando alguien reclama.' },
      { titulo: 'Rastro completo de cada decisión', descripcion: 'Quién solicitó, quién aprobó o rechazó, cuándo y con qué nota. Es lo que convierte «creo que lo autorizó Juan» en un documento.' },
      { titulo: 'El rechazo también hace algo', descripcion: 'No se queda en un estado: revierte el documento a donde debe estar, para que quien lo pidió pueda corregirlo en vez de empezar de nuevo.' },
    ],

    cifras: [
      { valor: '16', etiqueta: 'módulos con el mismo motor' },
      { valor: '1', etiqueta: 'regla, no una por módulo' },
      { valor: 'Bloquea', etiqueta: 'no avisa: impide ejecutar' },
    ],

    detalles: [
      { titulo: 'Aprobar y ejecutar son el mismo acto', descripcion: 'Al aprobar, el documento se aplica solo: la orden se emite, el pago entra en la corrida, el asiento se contabiliza. Separarlos es lo que hace que algo quede aprobado y sin hacer.' },
      { titulo: 'Un aprobador solo es un punto único de fallo', descripcion: 'Por eso cada nivel admite varios. Con uno, sus vacaciones detienen las compras de la empresa y nadie lo previó al configurarlo.' },
      { titulo: 'La nota del rechazo es obligatoria', descripcion: 'Rechazar sin decir por qué obliga a una conversación para averiguarlo, y esa conversación es justo lo que el flujo debía evitar.' },
      { titulo: 'Cada módulo aporta su propio criterio', descripcion: 'El motor es común, pero qué significa aprobar una factura no es lo mismo que aprobar un ajuste de inventario. Cada módulo define su efecto sin reescribir el flujo.' },
      { titulo: 'Se puede cancelar lo solicitado', descripcion: 'Si el documento ya no procede, la solicitud se retira en vez de quedarse esperando para siempre en la bandeja de alguien.' },
      { titulo: 'El aviso llega al aprobador', descripcion: 'Y al solicitante cuando se resuelve. Un flujo que depende de que alguien entre a mirar la bandeja es un flujo que se para los viernes.' },
    ],

    pasos: [
      { titulo: 'Define los niveles', descripcion: 'Quién aprueba, desde qué importe y con cuántos aprobadores por tramo.' },
      { titulo: 'Elige qué se aprueba', descripcion: 'Por módulo y por tipo de documento: no todo necesita firma.' },
      { titulo: 'Trabaja la bandeja', descripcion: 'Lo pendiente se ve, se aprueba o se rechaza, y el documento sigue solo.' },
    ],

    publico: [
      { titulo: 'Tienes más de un nivel de decisión', descripcion: 'Y hoy la autorización se pide por mensaje.' },
      { titulo: 'Te auditan', descripcion: 'Y hay que demostrar quién autorizó cada cosa.' },
      { titulo: 'Se te paran los procesos', descripcion: 'Porque nadie sabe qué está esperando su firma.' },
    ],

    faq: [
      { pregunta: '¿Hay que contratarlo aparte?', respuesta: 'No. Viene con la plataforma y atraviesa todos los módulos que tengas contratados. No es un módulo de pago.' },
      { pregunta: '¿Puedo exigir aprobación solo por encima de cierto monto?', respuesta: 'Sí, ese es el uso normal: se definen tramos de importe y cada uno tiene sus aprobadores.' },
      { pregunta: '¿Qué pasa si el aprobador está de vacaciones?', respuesta: 'Por eso cada nivel admite varios aprobadores. Con uno solo, su ausencia detiene el proceso — y conviene preverlo al configurarlo.' },
      { pregunta: '¿Se puede aprobar desde el teléfono?', respuesta: 'Sí: la bandeja es una pantalla más de la plataforma y funciona en el navegador del móvil.' },
      { pregunta: '¿Queda constancia para una auditoría?', respuesta: 'Sí: quién solicitó, quién resolvió, cuándo y con qué nota, ligado al documento que originó la solicitud.' },
      { pregunta: '¿Y si apruebo algo por error?', respuesta: 'La aprobación ejecuta el documento, así que se corrige por el camino que ese documento tenga —una nota de crédito, un asiento de reversión— y ese camino también queda registrado.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'generador-de-reportes',
    nombre: 'Generador de Reportes',
    subtitulo: 'El reporte que falta, sin esperar a nadie',
    color: '#22d3ee',
    icono: 'grafico',
    resumen: 'Construye tus propios reportes sobre tus datos sin escribir una consulta, con orígenes curados y siempre acotados a tu empresa. Exporta a PDF, Excel, CSV y TXT.',

    heroTitulo: 'La pregunta que ningún reporte contesta, contestada por ti',
    heroBajada: 'Se elige el origen, las columnas, los filtros y los totales — y sale el reporte. Sin escribir SQL, sin abrir un ticket y sin dar acceso a la base de datos a nadie.',

    problema: {
      titulo: 'Cada empresa tiene preguntas que ningún reporte estándar contesta',
      texto: 'Un ERP trae cientos de reportes y aun así siempre falta el tuyo: el cruce concreto que tu negocio necesita mirar cada lunes. Cuando hay que pedirlo, la respuesta llega semanas después o llega mal; y mientras tanto se decide con lo que hay, o se exporta a Excel para rehacer el mismo cruce a mano todos los meses.',
      puntos: [
        'La pregunta concreta de tu negocio no tiene reporte',
        'Pedir uno nuevo tarda semanas y cuesta dinero',
        'Se exporta a Excel y se rehace el mismo cruce cada mes',
        'Nadie puede reproducir de dónde salió un número',
        'Dar acceso a la base para «sacarlo rápido» es un riesgo',
        'El informe del lunes hay que acordarse de mandarlo',
      ],
    },

    beneficios: [
      { titulo: 'Sin escribir una sola consulta', descripcion: 'Se elige el origen y de ahí sus columnas, sus filtros, su orden y sus totales. Lo usa quien conoce el negocio, no quien conoce la base de datos.' },
      { titulo: 'Encabezado y detalle, no solo listados', descripcion: 'Un documento con sus líneas: facturas con sus artículos, pagos con sus documentos. Es la forma de la mayoría de las preguntas reales.' },
      { titulo: 'Orígenes curados y aislados', descripcion: 'Cada origen expone campos elegidos y siempre acotados a tu empresa. No hay forma de pedir un dato que no sea tuyo, ni de cruzar lo que no debe cruzarse.' },
      { titulo: 'Exporta a donde haga falta', descripcion: 'PDF para presentar, Excel y CSV para seguir trabajando, TXT para cargarlo en otro sistema. Cuatro formatos desde el mismo reporte.' },
      { titulo: 'Historial de ejecuciones', descripcion: 'Quién corrió qué, cuándo y con qué filtros. Es lo que permite reproducir un número que alguien discute tres meses después.' },
      { titulo: 'Programado por correo', descripcion: 'Se genera solo y llega con la frecuencia que definas. Recordar el informe del lunes deja de ser trabajo de alguien.' },
    ],

    cifras: [
      { valor: 'Sin código', etiqueta: 'lo arma quien conoce el negocio' },
      { valor: '4', etiqueta: 'formatos: PDF, Excel, CSV y TXT' },
      { valor: 'Acotado', etiqueta: 'a tu empresa, siempre' },
    ],

    detalles: [
      { titulo: 'El filtro se elige al ejecutar, no al definir', descripcion: 'El mismo reporte sirve para cada mes y cada sucursal. Definir uno por período es cómo se acaba con cuarenta reportes que son el mismo.' },
      { titulo: 'Cambiar el origen vacía las columnas', descripcion: 'Los campos del origen nuevo son otros, así que no pueden conservarse. Conviene saberlo antes de tocarlo en un reporte terminado.' },
      { titulo: 'Antes de programar, mira qué devuelve', descripcion: 'Un reporte pesado que llega cada mañana a veinte personas es una carga que nadie pidió. Se ejecuta primero y se programa después.' },
      { titulo: 'Los totales son lo que lo hace un reporte', descripcion: 'Qué columna suma, cuál promedia y dónde corta el subtotal. Sin eso es un listado largo, no un reporte.' },
      { titulo: 'El reporte es de la empresa, no de quien lo hizo', descripcion: 'Lo que uno arma queda para los demás. La pregunta se resuelve una vez, en vez de cada quien a su manera.' },
      { titulo: 'Los orígenes son deliberadamente limitados', descripcion: 'Exponer la base entera permitiría consultas que cruzan lo que no debe cruzarse. Es una decisión de seguridad, no una limitación pendiente.' },
    ],

    pasos: [
      { titulo: 'Elige el origen', descripcion: 'Determina qué campos hay disponibles y qué se puede filtrar.' },
      { titulo: 'Arma el reporte', descripcion: 'Columnas, filtros, orden y totales, viendo el resultado al momento.' },
      { titulo: 'Ejecútalo o prográmalo', descripcion: 'Con los filtros del momento, o que llegue solo por correo.' },
    ],

    publico: [
      { titulo: 'Siempre te falta un reporte', descripcion: 'Y esperar a que alguien lo programe no es opción.' },
      { titulo: 'Exportas a Excel cada mes', descripcion: 'Para rehacer a mano el mismo cruce de siempre.' },
      { titulo: 'Mandas informes recurrentes', descripcion: 'Y acordarse es parte del trabajo de alguien.' },
    ],

    faq: [
      { pregunta: '¿Hace falta saber SQL?', respuesta: 'No. Se elige el origen y desde ahí las columnas, los filtros, el orden y los totales.' },
      { pregunta: '¿Puedo sacar cualquier dato?', respuesta: 'Los de los orígenes curados, siempre acotados a tu empresa. Es una decisión de seguridad: no hay forma de pedir datos de otro suscriptor.' },
      { pregunta: '¿Sirve para reportes con detalle?', respuesta: 'Sí: encabezado más líneas, que es la forma de la mayoría de las preguntas reales de un negocio.' },
      { pregunta: '¿En qué formatos exporta?', respuesta: 'PDF, Excel, CSV y TXT, y se puede imprimir directamente desde la pantalla.' },
      { pregunta: '¿Puedo programar el envío?', respuesta: 'Sí, con la frecuencia que definas. Conviene ejecutarlo antes para ver qué devuelve y a quién conviene mandarlo.' },
      { pregunta: '¿Puedo reproducir un número viejo?', respuesta: 'Sí, con el historial de ejecuciones: quién lo corrió, cuándo y con qué filtros exactos.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'diccionario-de-datos',
    nombre: 'Diccionario de Datos',
    subtitulo: 'Qué significa cada dato, escrito',
    color: '#34d399',
    icono: 'libro',
    resumen: '593 tablas y 5.612 columnas documentadas en español, con lo que significa cada una y qué la cambia. Tus datos dejan de ser un secreto de quien los programó.',

    heroTitulo: 'Tus datos, explicados uno por uno',
    heroBajada: '593 tablas y 5.612 columnas documentadas en español: qué guarda cada una, quién la escribe y qué pasa si cambia. Es lo que hace que tu información siga siendo tuya aunque cambie tu proveedor.',

    problema: {
      titulo: 'Los datos son tuyos, pero solo si sabes qué significan',
      texto: 'Cualquier ERP guarda tus datos. Muy pocos te dicen qué significan. Cuando llega una auditoría, una integración o simplemente alguien nuevo, la pregunta «¿qué es exactamente esta columna?» solo la puede contestar quien programó el sistema — y eso te ata a él mucho más que cualquier contrato.',
      puntos: [
        'Nadie sabe qué significa exactamente un campo',
        'Integrar otro sistema exige adivinar la estructura',
        'Una auditoría pregunta de dónde sale un número y no hay respuesta',
        'Quien conoce la base de datos es una sola persona',
        'Migrar de sistema significa empezar de cero',
        'Dos áreas llaman igual a cosas distintas',
      ],
    },

    beneficios: [
      { titulo: '5.612 columnas explicadas', descripcion: 'No los nombres técnicos: qué significa el dato en tu negocio, en español y escrito para quien no programó el sistema.' },
      { titulo: '593 tablas documentadas', descripcion: 'Cada una con qué guarda, qué módulo la escribe y con qué se relaciona. La estructura de tu información deja de ser un mapa que solo alguien tiene.' },
      { titulo: 'Alimenta el generador de reportes', descripcion: 'Lo que está documentado es lo que se puede consultar. El diccionario no es un anexo: es lo que hace que armar un reporte no sea adivinar.' },
      { titulo: 'La respuesta para una auditoría', descripcion: 'De dónde sale cada número, campo por campo. Contestar eso con un documento en vez de con una explicación acorta una auditoría entera.' },
      { titulo: 'Integrar deja de ser ingeniería inversa', descripcion: 'Cuando hay que conectar otro sistema, la estructura está escrita. No hay que deducirla mirando datos de ejemplo.' },
      { titulo: 'Se mantiene con el producto', descripcion: 'Una tabla nueva sin su documentación pone la suite de pruebas en rojo. No es una promesa de mantenerlo: es un trinquete.' },
    ],

    cifras: [
      { valor: '593', etiqueta: 'tablas documentadas' },
      { valor: '5.612', etiqueta: 'columnas explicadas en español' },
      { valor: '28', etiqueta: 'módulos cubiertos' },
    ],

    detalles: [
      { titulo: 'Explica el DATO, no la columna', descripcion: 'Decir que `monto_neto` es «el monto neto» no explica nada. La entrada dice qué incluye, qué deja fuera y quién lo calcula.' },
      { titulo: 'Dice quién ESCRIBE cada tabla', descripcion: 'Es la pregunta que más cuesta cuando algo no cuadra: saber qué módulo pone ese valor evita buscarlo por todo el sistema.' },
      { titulo: 'Una columna con dos dueños no falla: calla', descripcion: 'Cuando dos módulos escriben el mismo campo, el resultado es plausible y equivocado. Documentarlo es lo que lo hace visible.' },
      { titulo: 'Sacar una tabla del diccionario tiene consecuencia', descripcion: 'Lo documentado alimenta el generador de reportes. Quitarla o añadirla cambia qué se puede consultar, y por eso no es un cambio cosmético.' },
      { titulo: 'Las tablas de plataforma van aparte', descripcion: 'Los catálogos que mantiene Zyntello —países, monedas, padrón fiscal, puertos— se distinguen de tus datos operativos, que son los que te pertenecen.' },
      { titulo: 'Es tu seguro contra el encierro', descripcion: 'Un proveedor que no documenta tus datos te ata sin decirlo. Con el diccionario, cambiar de sistema es un proyecto; sin él, es empezar de cero.' },
    ],

    pasos: [
      { titulo: 'Entra al diccionario', descripcion: 'Está dentro de la plataforma, sin pedir nada ni pagar aparte.' },
      { titulo: 'Busca la tabla o el campo', descripcion: 'Por módulo, por nombre o por lo que describe.' },
      { titulo: 'Úsalo', descripcion: 'Para un reporte, para una integración o para contestar una auditoría.' },
    ],

    publico: [
      { titulo: 'Te auditan', descripcion: 'Y hay que explicar de dónde sale cada cifra.' },
      { titulo: 'Vas a integrar otro sistema', descripcion: 'Y necesitas saber qué hay dentro sin adivinarlo.' },
      { titulo: 'No quieres depender de un proveedor', descripcion: 'Y tus datos deben seguir siendo legibles sin él.' },
    ],

    faq: [
      { pregunta: '¿Hay que contratarlo aparte?', respuesta: 'No. Viene con la plataforma y cubre los módulos que tengas contratados.' },
      { pregunta: '¿Está en español?', respuesta: 'Sí, entero. Y no describe la columna técnica: describe qué significa ese dato en tu negocio.' },
      { pregunta: '¿Sirve para integrar con otro sistema?', respuesta: 'Sí: es la estructura escrita, así que conectar algo deja de exigir ingeniería inversa sobre datos de ejemplo.' },
      { pregunta: '¿Se mantiene al día?', respuesta: 'Sí, y no por buena voluntad: una tabla nueva sin su documentación pone la suite de pruebas en rojo.' },
      { pregunta: '¿Qué relación tiene con los reportes?', respuesta: 'Lo documentado es lo que el generador de reportes puede consultar. El diccionario es lo que hace que armar un reporte no sea adivinar.' },
      { pregunta: '¿Puedo exportarlo?', respuesta: 'Sí, para llevártelo a una auditoría o a la conversación con quien vaya a integrar contigo.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'sistema-de-ayuda',
    nombre: 'Sistema de Ayuda',
    subtitulo: 'Cada pantalla explica lo que hace',
    color: '#fb7185',
    icono: 'salvavidas',
    resumen: '1.145 pantallas con su panel de ayuda y 1.416 campos con su explicación, dentro de la propia pantalla. Sin manuales, sin cursos y sin llamar a soporte.',

    heroTitulo: 'La ayuda está donde surge la duda',
    heroBajada: '1.145 pantallas con su propio panel de ayuda y 1.416 campos con su explicación al lado. No es un manual que nadie abre: es el texto que aparece justo donde la duda aparece.',

    problema: {
      titulo: 'Un ERP que nadie sabe usar es un ERP que no se usa',
      texto: 'El costo real de un sistema empresarial no es la licencia: es el tiempo que la gente tarda en saber usarlo. Cuando la ayuda es un PDF de trescientas páginas, nadie lo abre; se pregunta al compañero, se llena el campo a ojo y el dato entra mal. Y ese dato mal metido sale después en un reporte que alguien usa para decidir.',
      puntos: [
        'El manual es un PDF que nadie abre',
        'Cada duda es una llamada a soporte o al compañero',
        'Un campo se llena a ojo y el dato entra mal',
        'Formar a alguien nuevo cuesta semanas',
        'La persona que sabe usarlo se va y se lleva el conocimiento',
        'Hay pantallas que el suscriptor pagó y no usa nunca',
      ],
    },

    beneficios: [
      { titulo: 'Un panel por pantalla', descripcion: '1.145 pantallas explican qué resuelven y en qué orden se usan, desde la propia pantalla. No hay que salir a buscar nada.' },
      { titulo: 'Cada campo con su explicación', descripcion: '1.416 campos con qué va ahí y un ejemplo real. Es lo que evita el dato metido a ojo, que es el que después descuadra un reporte.' },
      { titulo: 'Escrita en términos de tu negocio', descripcion: 'La ayuda dice qué te cuesta en dinero, en tiempo o en acceso — nunca cómo funciona el software por dentro. Eso es lo que la hace útil.' },
      { titulo: 'Avisa de lo que no da error', descripcion: 'Las trampas sin síntoma están señaladas: lo que cambia más de lo que parece, lo que no se puede deshacer, lo que se calcula distinto de lo que uno supone.' },
      { titulo: 'Se adapta a tu país', descripcion: 'El impuesto, el comprobante, el organismo y el formato de fecha del ejemplo son los de donde operas, no los de otro mercado.' },
      { titulo: 'Entra con la pantalla, no después', descripcion: 'Una pantalla nueva sin su ayuda pone la suite de pruebas en rojo el mismo día. No se entrega a medias.' },
    ],

    cifras: [
      { valor: '1.145', etiqueta: 'pantallas con su panel de ayuda' },
      { valor: '1.416', etiqueta: 'campos con su explicación' },
      { valor: '34', etiqueta: 'módulos cubiertos' },
    ],

    detalles: [
      { titulo: 'Escribir la ayuda y conectarla son dos actos', descripcion: 'Y al segundo le falta síntoma: sin conectar, el panel no se pinta y no hay ningún error. Por eso una prueba lo comprueba, en vez de confiar en que alguien lo mire.' },
      { titulo: 'El ejemplo importa más que la definición', descripcion: '«Mantenimiento de octubre, contrato 42» enseña más que «concepto de la deuda». Por eso cada campo trae un ejemplo escrito, no una etiqueta repetida.' },
      { titulo: 'Los avisos señalan lo irreversible', descripcion: 'Qué no se puede deshacer, qué cambia más de lo que parece y qué decisión arrastra a las siguientes. Es lo que un manual genérico nunca dice.' },
      { titulo: 'Habla de tu operación, no del código', descripcion: 'Una ayuda que describe la interfaz no ayuda: el usuario ya la está viendo. La útil dice qué le cuesta equivocarse ahí.' },
      { titulo: 'Los tokens de país se resuelven solos', descripcion: 'ITBIS o IVA, DGII o SENIAT, NCF o factura electrónica: el texto se escribe una vez y se lee correcto en cada país.' },
      { titulo: 'Reduce el soporte, que es dinero', descripcion: 'Cada duda resuelta en la pantalla es una llamada que no se hace. Con más de mil pantallas, eso es la diferencia entre usar el sistema y pelearse con él.' },
    ],

    pasos: [
      { titulo: 'Abre cualquier pantalla', descripcion: 'El panel de ayuda está ahí, en el mismo sitio, siempre.' },
      { titulo: 'Pasa sobre un campo', descripcion: 'Su explicación y su ejemplo aparecen al lado, sin salir.' },
      { titulo: 'Sigue trabajando', descripcion: 'Sin manual, sin curso y sin llamar a nadie.' },
    ],

    publico: [
      { titulo: 'Tu equipo rota', descripcion: 'Y formar a cada persona nueva cuesta semanas.' },
      { titulo: 'Pagas soporte por dudas de uso', descripcion: 'Que una buena explicación resolvería sola.' },
      { titulo: 'Hay pantallas que nadie usa', descripcion: 'Porque nadie llegó a entender para qué servían.' },
    ],

    faq: [
      { pregunta: '¿Hay que contratarlo aparte?', respuesta: 'No. Está en la plataforma, en todos los módulos, sin coste adicional.' },
      { pregunta: '¿Es un manual en PDF?', respuesta: 'No, y esa es la diferencia: es un panel dentro de cada pantalla y una explicación junto a cada campo, donde surge la duda.' },
      { pregunta: '¿Está en español?', respuesta: 'Sí, entero, y con los términos de tu país: tu impuesto, tu comprobante y tu organismo.' },
      { pregunta: '¿Cubre todos los módulos?', respuesta: 'Los 34. Y una pantalla nueva sin su ayuda pone la suite de pruebas en rojo, así que no se queda atrás.' },
      { pregunta: '¿Sirve para formar gente nueva?', respuesta: 'Es su mejor uso: cada pantalla explica qué resuelve y en qué orden se usa, así que se aprende trabajando.' },
      { pregunta: '¿Se puede imprimir?', respuesta: 'La ayuda está pensada para leerse en la pantalla, donde surge la duda. Para la estructura de los datos está el Diccionario de Datos, que sí se exporta.' },
    ],
  },
]
