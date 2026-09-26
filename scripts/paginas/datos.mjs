/**
 * Las páginas de primer nivel del sitio: /automatizacion/, /precios/,
 * /nosotros/ y /contacto/.
 *
 * ⚠️⚠️ QUÉ NO ESTÁ AQUÍ, Y POR QUÉ
 *
 * `/erp` NO se genera. Ya existe: es la landing del bundle ERP que escribe el
 * admin en el document root del sitio (`admin/database/seeders/landings/erp.php`).
 * Crear una página aquí con ese slug la SOBRESCRIBIRÍA, y el síntoma sería una
 * landing comercial menos sin que nada fallara: el archivo se publica, responde
 * 200 y contiene otra cosa. Quien busque «ERP» sigue llegando a la que ya hay.
 *
 * ⚠️ `/automatizacion` NO repite lo que dice `/servicios/automatizacion-con-ia/`.
 * Dos páginas propias compitiendo por la misma búsqueda no suman: Google reparte
 * la autoridad entre las dos y posiciona peor que con una sola. Esta es la página
 * PILAR —qué se puede automatizar en una empresa y por dónde se empieza— y desde
 * ella se enlaza al servicio, que es donde se cuenta cómo se contrata. Cada una
 * responde a una pregunta distinta.
 *
 * ⚠️ Las cifras son las que ya publica la portada (20+ años, 100+ proyectos,
 * 34 módulos, 5 países). No se inventa ninguna: lo que no está medido se dice
 * en cualitativo.
 *
 * ⚠️ Los conteos importan. La rejilla reparte en el MAYOR DIVISOR, así que
 * 6 beneficios caen a 3+3 y 5 caerían a una sola columna. El contrato vigente
 * es: 6 beneficios, 6 puntos de problema, 6 detalles, 3 públicos, 3 pasos,
 * 3 cifras.
 */

export const PAGINAS = [
  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'automatizacion',
    nombre: 'Automatización de procesos',
    subtitulo: 'Por dónde empezar',
    color: '#8b5cf6',
    resumen: 'Qué se automatiza de verdad en una empresa —aprobaciones, conciliación, cobros, reportes— y por dónde empezar para que se note en semanas.',

    heroTitulo: 'La mitad del trabajo de oficina es mover datos de un sitio a otro',
    heroBajada: 'Aprobar una compra por WhatsApp, teclear la factura del proveedor, cuadrar el banco línea por línea, armar el mismo reporte cada lunes. Nada de eso es el negocio: es el peaje por no tenerlo automatizado. Esto explica qué se puede quitar de en medio y en qué orden.',
    segundoBoton: { texto: 'Ver el servicio de automatización con IA', href: 'https://zyntello.com/servicios/automatizacion-con-ia/' },

    problema: {
      titulo: 'El trabajo manual no se ve en ninguna cuenta de resultados',
      texto: 'Nadie factura «tres horas cuadrando el banco». Por eso el coste del trabajo repetitivo es invisible: no aparece en ningún informe, no tiene un responsable y nunca es lo urgente. Se nota en otra parte —en los cierres que se retrasan, en el cobro que se olvidó, en la persona que no puede tomar vacaciones porque solo ella sabe hacer ese proceso—.',
      puntos: [
        'El mismo dato se teclea en tres sistemas distintos',
        'Una aprobación se pide por WhatsApp y no queda registrada en ninguna parte',
        'El cierre del mes depende de que una persona concreta esté disponible',
        'Los cobros vencidos se descubren cuando el cliente ya no contesta',
        'Cada reporte se arma a mano y nunca dos veces igual',
        'Cuando alguien se va, su proceso se va con él',
      ],
    },

    beneficios: [
      { titulo: 'Aprobaciones con rastro', descripcion: 'Quién aprobó, cuándo y sobre qué importe queda escrito. Se acabó el «yo te lo dije por mensaje»: si no está aprobado, el documento no avanza.' },
      { titulo: 'Documentos que se leen solos', descripcion: 'La factura del proveedor entra como datos, no como un PDF que alguien teclea. Lo que no cuadra se marca para revisar, en vez de colarse.' },
      { titulo: 'Conciliación asistida', descripcion: 'El sistema propone el cruce entre el movimiento del banco y el documento, y la persona confirma. Lo que cambia no es la exactitud: es el tiempo.' },
      { titulo: 'Avisos antes, no después', descripcion: 'El cobro que vence, el inventario que se va a acabar, el contrato que caduca. Avisar a tiempo vale más que el mejor informe de lo que ya pasó.' },
      { titulo: 'Reportes que se generan solos', descripcion: 'El mismo informe, el mismo día, con los datos del sistema y no de una hoja que alguien mantiene aparte. Y si nadie lo abre, también se sabe.' },
      { titulo: 'Agentes de IA donde hay criterio', descripcion: 'Clasificar un gasto, redactar la respuesta a un cliente, resumir qué pasó esta semana. Donde hace falta juicio y no una regla fija.' },
    ],

    detalles: [
      { titulo: 'Automatizar un proceso roto lo rompe más rápido', descripcion: 'Si la forma de aprobar compras hoy no está clara, automatizarla multiplica el desorden. Primero se define quién decide qué; después se automatiza. Ese orden no es opcional.' },
      { titulo: 'La excepción es donde se cae todo', descripcion: 'El 80% de los casos es fácil. El valor está en qué hace el sistema con el 20% que no encaja: si lo bloquea en silencio, alguien acabará saltándoselo por fuera y volverás al punto de partida.' },
      { titulo: 'Un aviso que llega siempre deja de leerse', descripcion: 'La alerta que salta todos los días se convierte en ruido en dos semanas. Se afina el umbral hasta que saltar signifique algo, o el aviso no sirve para nada.' },
      { titulo: 'Sin registro, no hay auditoría', descripcion: 'Un proceso automático que no deja rastro de qué hizo y por qué es imposible de auditar y de corregir. Cada paso queda registrado, incluido el que decidió una IA.' },
      { titulo: 'La persona sigue decidiendo lo que importa', descripcion: 'Aprobar un pago, perdonar una deuda, despedir a alguien. La automatización prepara la decisión y la ejecuta; no la toma.' },
      { titulo: 'Se empieza por lo aburrido, no por lo vistoso', descripcion: 'El primer proceso a automatizar es el más repetitivo y el menos discutible. Lo llamativo —el agente que habla con el cliente— va después, cuando los datos de abajo ya son fiables.' },
    ],

    cifras: [
      { valor: '34', etiqueta: 'módulos que comparten los mismos datos' },
      { valor: '20+', etiqueta: 'años automatizando procesos reales' },
      { valor: '5', etiqueta: 'países, cada uno con sus reglas' },
    ],

    pasos: [
      { titulo: 'Se mira qué se hace hoy', descripcion: 'No lo que dice el manual: lo que de verdad hace la gente, con sus hojas de cálculo y sus mensajes. Ahí está el proceso real.' },
      { titulo: 'Se elige uno y se hace entero', descripcion: 'Un proceso completo funcionando vale más que seis a medias. El primero es el que demuestra si esto sirve, así que se elige por dolor, no por facilidad.' },
      { titulo: 'Se mide y se pasa al siguiente', descripcion: 'Cuánto tardaba antes y cuánto ahora. Si no se puede medir, no se sabe si funcionó, y el segundo proceso se decide a ciegas.' },
    ],

    publico: [
      { titulo: 'La empresa que ya tiene sistema', descripcion: 'Tienes un ERP o varios programas, pero entre ellos hay personas moviendo datos a mano. Ahí es donde más rápido se nota.' },
      { titulo: 'La que crece más rápido que su equipo', descripcion: 'El volumen sube y la respuesta hasta ahora ha sido contratar. Automatizar primero decide cuánta plantilla hace falta de verdad.' },
      { titulo: 'La que depende de una persona', descripcion: 'Hay un proceso que solo sabe hacer alguien concreto. Eso no es un problema de productividad: es un riesgo.' },
    ],

    faq: [
      { pregunta: '¿Hay que cambiar de sistema para automatizar?', respuesta: 'No necesariamente. Parte de lo que se automatiza son enlaces entre lo que ya tienes. Ahora bien, si el dato de origen está en tres sitios y ninguno cuadra, lo primero no es automatizar: es decidir cuál manda.' },
      { pregunta: '¿Cuánto tarda en verse el resultado?', respuesta: 'Un proceso concreto —una aprobación, un aviso de cobro, un reporte recurrente— se pone en marcha en semanas. Lo que lleva meses es automatizar una empresa entera, y por eso no se empieza así.' },
      { pregunta: '¿Esto sustituye personas?', respuesta: 'En nuestra experiencia, lo que sustituye son las horas que nadie quería hacer. La gente sigue ahí, decidiendo y atendiendo clientes, en vez de tecleando lo que ya está escrito en un PDF.' },
      { pregunta: '¿Qué pasa si la IA se equivoca?', respuesta: 'Por eso lo que decide una IA queda registrado y lo que no está claro se marca para revisión humana en vez de ejecutarse. Un automatismo que no puede equivocarse a la vista es un automatismo en el que no se puede confiar.' },
      { pregunta: '¿Sirve para una empresa pequeña?', respuesta: 'Sí, y a veces más: en una empresa pequeña el proceso manual se lo come el dueño, que es justo la persona cuyo tiempo más cuesta. Se empieza por un módulo y se crece desde ahí.' },
      { pregunta: '¿Se puede automatizar la parte fiscal?', respuesta: 'Sí. Los comprobantes fiscales, las retenciones y los reportes al organismo de cada país están dentro de la plataforma —NCF en República Dominicana, y el equivalente en Venezuela, Colombia, Guatemala y Costa Rica—.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'precios',
    nombre: 'Precios',
    subtitulo: 'Qué cuesta y qué incluye',
    color: '#22c55e',
    resumen: 'Suscripción mensual por módulo, sin licencia inicial, sin proyecto de implantación y sin permanencia. Contratas lo que usas y añades el resto después.',

    heroTitulo: 'Pagas los módulos que usas, y ninguno más',
    heroBajada: 'No hay licencia inicial, ni proyecto de implantación que cobrar antes de empezar, ni un paquete de veinte módulos del que vas a usar tres. Se contrata mensualmente lo que necesitas hoy y se añade lo demás cuando el negocio lo pida.',
    segundoBoton: { texto: 'Ver los módulos y sus precios', href: 'https://zyntello.com/#soluciones' },

    problema: {
      titulo: 'El precio de un ERP casi nunca es el precio de un ERP',
      texto: 'La cifra del presupuesto es la parte pequeña. Debajo suele haber una implantación que se cobra aparte, unos módulos mínimos que hay que contratar aunque no se usen, una permanencia de años y un coste por usuario que crece cada vez que entra alguien. Cuando se suma todo, el número real aparece con el contrato ya firmado.',
      puntos: [
        'Una licencia inicial que se paga antes de usar nada',
        'Una implantación de meses facturada aparte',
        'Un paquete mínimo con módulos que no hacen falta',
        'Permanencia de varios años para conseguir el precio anunciado',
        'Coste por usuario que sube con cada incorporación',
        'Actualizaciones y soporte como partidas separadas',
      ],
    },

    beneficios: [
      { titulo: 'Suscripción mensual', descripcion: 'Se paga por mes. Si un módulo deja de hacer falta, se da de baja y deja de cobrarse: no hay licencia amortizándose en el balance.' },
      { titulo: 'Sin implantación que pagar', descripcion: 'Los módulos vienen configurados y con la fiscalidad de tu país puesta. Se entra el mismo día. Si tu caso necesita algo a medida, eso sí se presupuesta, y se dice antes.' },
      { titulo: 'Módulo a módulo', descripcion: 'Empiezas por Facturación, o por Nómina, o por el que te esté doliendo. Los demás se añaden sobre los mismos datos, sin migrar nada ni volver a empezar.' },
      { titulo: 'Actualizaciones incluidas', descripcion: 'Las mejoras y los cambios de ley entran en la suscripción. Cuando la DGII cambia algo, no llega una factura de adaptación.' },
      { titulo: 'Soporte incluido', descripcion: 'Con un Acuerdo de Nivel de Servicio publicado, no de palabra. El canal es soporte@zyntello.com y los plazos están escritos.' },
      { titulo: 'Sin permanencia', descripcion: 'No hay contrato de años para conseguir el precio. Si el producto no te sirve, el mejor argumento para que te quedes no debería ser una cláusula.' },
    ],

    detalles: [
      { titulo: 'El precio de cada módulo está publicado', descripcion: 'Está en la propia portada, en la sección de módulos: cada uno con su cifra. No hay una tarifa distinta según quién pregunte.' },
      { titulo: 'El bundle ERP sale mejor que la suma', descripcion: 'Si vas a usar el conjunto —facturación, inventario, compras, contabilidad y los demás— el paquete ERP cuesta menos que contratarlos sueltos.' },
      { titulo: 'Multi-empresa no se cobra aparte', descripcion: 'Varias empresas del mismo grupo, cada una con su contabilidad y sus datos separados de las demás, entran en la misma suscripción.' },
      { titulo: 'Lo que sí se presupuesta', descripcion: 'El desarrollo a medida, la migración de datos de un sistema anterior y la formación presencial. Son trabajo con horas detrás, y se cotizan antes de empezar.' },
      { titulo: 'El demo es real, no una grabación', descripcion: 'Se entra con una cuenta de prueba a la plataforma de verdad, con datos de ejemplo. Lo que ves ahí es lo que hay.' },
      { titulo: 'La contratación es por WhatsApp o correo', descripcion: 'No hay un carrito donde meter el número de tarjeta. Se habla, se ve qué módulos hacen falta y se activa. Suele ser más rápido que rellenar un formulario.' },
    ],

    cifras: [
      { valor: '34', etiqueta: 'módulos, y contratas los que usas' },
      { valor: 'Mensual', etiqueta: 'sin permanencia ni licencia inicial' },
      { valor: 'El mismo día', etiqueta: 'operando, sin implantación' },
    ],

    pasos: [
      { titulo: 'Miras los módulos y sus precios', descripcion: 'Están publicados en la portada, cada uno con su cifra y con la página que explica qué hace.' },
      { titulo: 'Lo pruebas con datos de ejemplo', descripcion: 'El demo entra a la plataforma real. Es la forma de ver si encaja con tu operación antes de pagar nada.' },
      { titulo: 'Se activa lo que hace falta', descripcion: 'Por WhatsApp o por correo. Se configuran tus datos fiscales y tu empresa, y se empieza a trabajar.' },
    ],

    publico: [
      { titulo: 'La empresa que nunca tuvo sistema', descripcion: 'Vienes de hojas de cálculo y te han presupuestado un ERP que cuesta más que el problema que resuelve.' },
      { titulo: 'La que tiene uno y no lo usa', descripcion: 'Pagaste una licencia grande y la empresa sigue trabajando en Excel por fuera. Eso no se arregla con más formación.' },
      { titulo: 'La que solo necesita una pieza', descripcion: 'Tu contabilidad funciona, pero la nómina o el inventario no. No hace falta cambiarlo todo para arreglar una parte.' },
    ],

    faq: [
      { pregunta: '¿Dónde veo el precio de cada módulo?', respuesta: 'En la sección de módulos de zyntello.com. Cada módulo muestra su precio mensual y enlaza a la página donde se explica qué hace y para quién.' },
      { pregunta: '¿Se cobra por usuario?', respuesta: 'La suscripción es por módulo. Si tu caso tiene un número de usuarios fuera de lo habitual lo hablamos, pero el precio publicado no es un precio por cabeza.' },
      { pregunta: '¿Hay coste de implantación?', respuesta: 'No para arrancar: los módulos vienen configurados con la fiscalidad de tu país. Lo que sí se presupuesta aparte es la migración de datos de un sistema anterior, el desarrollo a medida y la formación presencial.' },
      { pregunta: '¿Qué pasa si quiero darme de baja?', respuesta: 'No hay permanencia. Se da de baja el módulo y deja de cobrarse. Tus datos son tuyos y se te entregan; hay una página de eliminación de datos con el procedimiento.' },
      { pregunta: '¿Los cambios de ley se cobran aparte?', respuesta: 'No. Las adaptaciones a la normativa de los países donde operamos entran en la suscripción, igual que el resto de actualizaciones.' },
      { pregunta: '¿Puedo empezar por un módulo y añadir después?', respuesta: 'Es la forma recomendada. Los 34 módulos comparten la misma base de datos, así que añadir uno nuevo no es una migración: el dato que ya está, ya está.' },
      { pregunta: '¿Cómo se paga?', respuesta: 'Se acuerda al contratar. La contratación se hace por WhatsApp o por correo, no hay un pago con tarjeta en la web.' },
      { pregunta: '¿Hay descuento por pagar el año?', respuesta: 'Se habla caso por caso. Escríbenos y te decimos qué podemos hacer con tu combinación de módulos.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'nosotros',
    nombre: 'Nosotros',
    subtitulo: 'Quién está detrás de Zyntello',
    color: '#6366f1',
    resumen: 'Zyntello, S.R.L. es una empresa dominicana de tecnología con más de 20 años implantando sistemas de gestión. Desarrollamos nuestra propia plataforma.',

    heroTitulo: 'Veinte años implantando sistemas antes de escribir el nuestro',
    heroBajada: 'Zyntello, S.R.L. no empezó siendo un producto. Empezó implantando los sistemas de otros —Softland, Profit, infraestructura, nube— y viendo de cerca por qué tantos proyectos de ERP acaban abandonados. La plataforma que vendemos hoy es la consecuencia de eso.',
    segundoBoton: { texto: 'Ver la plataforma', href: 'https://zyntello.com/#soluciones' },

    problema: {
      titulo: 'Casi nadie abandona un ERP porque le falte una función',
      texto: 'Lo abandonan porque nadie explicó para qué servía esa pantalla, porque el proyecto duró tanto que el negocio ya había cambiado, o porque cuando se rompió algo no había a quién llamar. El software casi nunca es la parte difícil. Lo difícil es todo lo que pasa alrededor, y eso solo se aprende habiéndolo hecho muchas veces.',
      puntos: [
        'Proyectos de implantación que duran más que la paciencia de la empresa',
        'Sistemas que nadie enseñó a usar y se rellenan mal desde el primer día',
        'Un proveedor que desaparece cuando termina la instalación',
        'Programas que no se hablan entre sí y obligan a teclear dos veces',
        'Soluciones pensadas para otro país y su fiscalidad',
        'Empresas grandes que no devuelven la llamada de un cliente pequeño',
      ],
    },

    beneficios: [
      { titulo: 'Somos los que lo desarrollan', descripcion: 'La plataforma es nuestra. Cuando algo hay que cambiarlo, no hay que abrir un ticket a un fabricante en otro continente y esperar a la siguiente versión.' },
      { titulo: 'Conocemos la fiscalidad de la región', descripcion: 'República Dominicana, Venezuela, Colombia, Guatemala y Costa Rica. Cada uno con su comprobante, sus retenciones y sus reportes al organismo que corresponde.' },
      { titulo: 'Venimos de implantar, no de vender', descripcion: 'Más de cien proyectos entregados antes de tener producto propio. Eso decide cosas del diseño que no se ven en una demo pero se notan a los seis meses.' },
      { titulo: 'Seguimos después de la entrega', descripcion: 'El soporte tiene un Acuerdo de Nivel de Servicio publicado y un canal propio. El momento en que un proveedor desaparece es justo cuando empieza a hacer falta.' },
      { titulo: 'Trabajamos con empresas de cualquier tamaño', descripcion: 'El mismo sistema sirve para una ferretería y para un grupo con varias empresas. Lo que cambia es qué módulos se activan.' },
      { titulo: 'También hacemos lo que no es nuestro producto', descripcion: 'Infraestructura, nube, ciberseguridad, desarrollo a medida y personal TI. A veces la respuesta correcta a un problema no es vender otro módulo.' },
    ],

    detalles: [
      { titulo: 'La ayuda se escribe al mismo tiempo que la pantalla', descripcion: 'Cada pantalla se entrega con su ayuda, sus explicaciones campo por campo y su diccionario de datos. Una pantalla sin explicar es una pantalla que se rellena mal.' },
      { titulo: 'Los datos de un cliente no tocan los de otro', descripcion: 'El aislamiento entre suscriptores, y entre las empresas de un mismo suscriptor, es la regla que está por encima de cualquier otra consideración técnica del proyecto.' },
      { titulo: 'Una sola base de datos, no integraciones', descripcion: 'Los módulos no se sincronizan entre sí: leen el mismo dato. Esa diferencia es la que hace que el inventario y la contabilidad no puedan discrepar.' },
      { titulo: 'El producto crece con lo que se aprende operando', descripcion: 'Buena parte de lo que hoy hace la plataforma salió de un problema real de un cliente real, no de una lista de funcionalidades de la competencia.' },
      { titulo: 'Operamos en remoto y sobre el terreno', descripcion: 'La plataforma se usa desde el navegador, pero cuando hace falta ir, se va. Hay clientes en cinco países y no todos los problemas se resuelven por videollamada.' },
      { titulo: 'Lo que no sabemos hacer, lo decimos', descripcion: 'Hay encargos que no encajan con lo que hacemos bien. Decirlo antes cuesta una venta; no decirlo cuesta un cliente y su recomendación.' },
    ],

    cifras: [
      { valor: '20+', etiqueta: 'años en TI y sistemas de gestión' },
      { valor: '100+', etiqueta: 'proyectos entregados' },
      { valor: '5', etiqueta: 'países con presencia' },
    ],

    pasos: [
      { titulo: 'Escuchamos qué falla hoy', descripcion: 'Antes de proponer nada. La mayoría de las veces el problema que se cuenta no es el que más cuesta dinero.' },
      { titulo: 'Proponemos lo mínimo que lo resuelve', descripcion: 'Un módulo, no un proyecto. Si con menos se arregla, con menos se arregla.' },
      { titulo: 'Nos quedamos', descripcion: 'La implantación es el principio. Lo que decide si el sistema se usa dentro de un año es lo que pasa después.' },
    ],

    publico: [
      { titulo: 'Si vas a cambiar de sistema', descripcion: 'Merece la pena hablar con alguien que ha implantado los de otros y sabe dónde suelen romperse los proyectos.' },
      { titulo: 'Si ya tienes uno y no funciona', descripcion: 'A veces no hay que cambiarlo todo. Hay que arreglar la pieza concreta que está fallando.' },
      { titulo: 'Si operas en varios países', descripcion: 'Cada país tiene su fiscalidad y su forma de hacer las cosas. Tener cinco en el mismo sistema evita cinco sistemas.' },
    ],

    faq: [
      { pregunta: '¿Dónde está Zyntello?', respuesta: 'Zyntello, S.R.L. es una empresa dominicana. Operamos en República Dominicana, Venezuela, Colombia, Guatemala y Costa Rica, y damos soporte remoto a clientes fuera de esos países.' },
      { pregunta: '¿La plataforma es vuestra o revendéis un producto?', respuesta: 'Es nuestra. La desarrollamos y la mantenemos nosotros, que es lo que permite que un cambio necesario se haga en vez de pedirse a un fabricante.' },
      { pregunta: '¿Trabajáis solo con la plataforma propia?', respuesta: 'No. También hacemos infraestructura, nube, ciberseguridad, desarrollo a medida, soporte técnico y personal TI especializado. Están en la sección de servicios.' },
      { pregunta: '¿Qué pasa con mis datos si dejo de ser cliente?', respuesta: 'Son tuyos y se te entregan. Hay una página publicada con el procedimiento de eliminación de datos y una política de privacidad que explica qué se guarda y por qué.' },
      { pregunta: '¿Atendéis a empresas pequeñas?', respuesta: 'Sí. De hecho el modelo por módulos existe justo para eso: para que una empresa pequeña pueda empezar por una pieza sin comprar un sistema entero.' },
      { pregunta: '¿Cómo os contacto?', respuesta: 'Por WhatsApp al +1 829 639 9877 o escribiendo a info@zyntello.com. Si ya eres cliente, el canal de soporte es soporte@zyntello.com.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'contacto',
    nombre: 'Contacto',
    subtitulo: 'Cómo hablar con nosotros',
    color: '#fb7185',
    /* ⚠️ `ContactPage` en vez del `WebPage` por defecto: es lo que permite que
       una búsqueda de «Zyntello contacto» devuelva ESTA página y no la
       portada. */
    tipoSchema: 'ContactPage',
    resumen: 'Habla con Zyntello: WhatsApp al +1 829 639 9877, info@zyntello.com para ventas y soporte@zyntello.com si ya eres cliente. RD y toda la región.',

    heroTitulo: 'Escríbenos y te contesta alguien que sabe del tema',
    heroBajada: 'No hay un formulario que cae en un buzón que nadie mira. El WhatsApp es el canal más rápido y lo atiende el equipo, no un robot. Si ya eres cliente, tienes un canal aparte con plazos de respuesta escritos.',
    segundoBoton: { texto: 'Escribir a info@zyntello.com', href: 'mailto:info@zyntello.com' },

    problema: {
      titulo: 'Preguntar por un software suele costar más de lo que debería',
      texto: 'Rellenas un formulario de doce campos, te llama un comercial que no sabe responder qué hace el producto, y a la tercera llamada sigues sin saber si te sirve. Preferimos el camino corto: preguntas lo que quieras por WhatsApp y te contesta alguien que ha implantado esto.',
      puntos: [
        'Formularios largos para una pregunta corta',
        'Respuestas genéricas de alguien que no conoce el producto',
        'Demos enlatadas que no responden a tu caso',
        'Presupuestos que tardan una semana en llegar',
        'No saber a quién escribir cuando ya eres cliente',
        'Canales que nadie atiende fuera de la capital',
      ],
    },

    beneficios: [
      { titulo: 'WhatsApp · +1 829 639 9877', descripcion: 'El canal más rápido, y el que más usamos. Escribe con tu caso concreto: cuántas empresas, qué país y qué te está fallando hoy.' },
      { titulo: 'Ventas · info@zyntello.com', descripcion: 'Para presupuestos, dudas sobre módulos y todo lo que necesite quedar por escrito antes de decidir.' },
      { titulo: 'Soporte · soporte@zyntello.com', descripcion: 'Si ya eres cliente, este es tu canal. Tiene un Acuerdo de Nivel de Servicio publicado con los plazos de respuesta escritos.' },
      { titulo: 'Teléfono · +1 829 639 9877', descripcion: 'El mismo número. Hay conversaciones que se resuelven en dos minutos hablando y no en veinte escribiendo.' },
      { titulo: 'El formulario de la portada', descripcion: 'Si prefieres dejarlo escrito con calma, el formulario está en la página de inicio, en la sección de contacto.' },
      { titulo: 'Cinco países', descripcion: 'República Dominicana, Venezuela, Colombia, Guatemala y Costa Rica. Fuera de ahí, atendemos en remoto.' },
    ],

    detalles: [
      { titulo: 'Di tu país en el primer mensaje', descripcion: 'Cambia la respuesta entera: la fiscalidad, los comprobantes y los reportes obligatorios no son los mismos en RD que en Colombia o Guatemala.' },
      { titulo: 'Di cuántas empresas son', descripcion: 'Una empresa o un grupo con varias no es el mismo sistema ni el mismo precio. Saberlo de entrada ahorra dos correos.' },
      { titulo: 'Cuenta qué falla hoy, no qué módulo quieres', descripcion: 'Muchas veces el módulo que se pide no es el que resuelve el problema que se cuenta. Es mejor empezar por el problema.' },
      { titulo: 'Puedes probar antes de escribir', descripcion: 'El demo entra a la plataforma real con datos de ejemplo. Llegar con las preguntas ya hechas acorta mucho la conversación.' },
      { titulo: 'Si eres cliente, usa soporte@', descripcion: 'Escribir a info@ para una incidencia la mete en la cola de ventas y tarda más. El canal de soporte es el que tiene los plazos comprometidos.' },
      { titulo: 'No vendemos tus datos', descripcion: 'Lo que nos escribas se usa para responderte. Está en la política de privacidad, junto con qué se guarda y durante cuánto.' },
    ],

    cifras: [
      { valor: 'WhatsApp', etiqueta: 'el canal más rápido, +1 829 639 9877' },
      { valor: '5', etiqueta: 'países atendidos' },
      { valor: 'SLA', etiqueta: 'plazos publicados para clientes' },
    ],

    pasos: [
      { titulo: 'Escribes tu caso', descripcion: 'Por WhatsApp o por correo. Con el país, el tamaño y qué te está fallando ya se puede decir algo útil.' },
      { titulo: 'Lo vemos juntos', descripcion: 'Una llamada o una videollamada corta con el sistema delante, sobre un caso parecido al tuyo.' },
      { titulo: 'Decides tú', descripcion: 'Con el precio de los módulos que te hacen falta y sin permanencia. Si no encaja, te lo decimos nosotros primero.' },
    ],

    publico: [
      { titulo: 'Quieres un presupuesto', descripcion: 'Escribe a info@zyntello.com o por WhatsApp con tu país y los módulos que te interesan.' },
      { titulo: 'Ya eres cliente', descripcion: 'soporte@zyntello.com es tu canal, con los plazos del Acuerdo de Nivel de Servicio.' },
      { titulo: 'Solo quieres verlo', descripcion: 'Pide el demo. Se entra a la plataforma real con datos de ejemplo, sin compromiso.' },
    ],

    faq: [
      { pregunta: '¿Cuál es el número de WhatsApp de Zyntello?', respuesta: 'El +1 829 639 9877. Es el mismo número para WhatsApp y para llamar.' },
      { pregunta: '¿A qué correo escribo?', respuesta: 'A info@zyntello.com si aún no eres cliente —presupuestos, dudas, demos— y a soporte@zyntello.com si ya lo eres. El segundo tiene plazos de respuesta comprometidos por escrito.' },
      { pregunta: '¿Atendéis fuera de República Dominicana?', respuesta: 'Sí. Operamos en República Dominicana, Venezuela, Colombia, Guatemala y Costa Rica, y damos soporte remoto fuera de esos países.' },
      { pregunta: '¿Puedo ver el producto antes de hablar con nadie?', respuesta: 'Sí. Hay un demo que entra a la plataforma real con datos de ejemplo, y cada módulo tiene su página explicando qué hace.' },
      { pregunta: '¿Cuánto tardáis en contestar?', respuesta: 'Por WhatsApp, normalmente el mismo día laborable. Para clientes, los plazos están en el Acuerdo de Nivel de Servicio publicado, que es un compromiso y no una estimación.' },
      { pregunta: '¿Qué hacéis con mis datos si os escribo?', respuesta: 'Usarlos para responderte. No se venden ni se ceden; la política de privacidad publicada explica qué se guarda y durante cuánto tiempo.' },
    ],
  },
]
