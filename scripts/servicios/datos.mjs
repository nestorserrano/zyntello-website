/**
 * Los servicios que vende Zyntello, S.R.L. — uno por página.
 *
 * ⚠️⚠️ SON CATORCE, no diez. El pie del sitio listaba 10 y la sección
 * «Qué hacemos» tiene 14: consultoría contable, marketing digital, consultoría
 * electoral y encuestas estaban en la sección y **no en el pie**. Y los diez
 * del pie apuntaban TODOS a la misma ancla `#servicios`, así que daba igual
 * cuál pulsaras. Se generan las 14 para que ninguna quede huérfana.
 *
 * ⚠️ El contenido nace del que ya había en `src/components/Servicios.jsx` y
 * de los casos reales de `Portafolio.jsx` (Softland, Profit 2K8→2K12, AWS,
 * Power BI, Windows Server/Cisco/Veeam). No se inventan clientes ni cifras:
 * lo que no está medido se dice en cualitativo.
 *
 * ⚠️ Los `slug` son los que quedan publicados en `/servicios/{slug}/`. Cambiar
 * uno rompe su enlace desde el pie y su entrada del sitemap, así que se decide
 * una vez.
 */

export const SERVICIOS = [
  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'plataforma-saas',
    nombre: 'Plataforma SaaS Zyntello',
    subtitulo: 'Nuestro ERP modular en la nube',
    color: '#6366f1',
    resumen: 'Un ERP de 34 módulos donde contratas solo lo que usas y lo tienes funcionando el mismo día, sin instalar nada y sin proyecto de implantación.',

    heroTitulo: 'El ERP que empieza por el módulo que te duele hoy',
    segundoBoton: { texto: 'Ver los módulos y precios', href: 'https://zyntello.com/#soluciones' },
    heroBajada: '34 módulos que comparten una sola base de datos: contratas el que necesitas ahora y añades los demás cuando toque, sin migrar nada. Multi-empresa, multi-moneda y con la fiscalidad de tu país.',

    problema: {
      titulo: 'Un ERP entero es un proyecto de un año que casi nadie termina',
      texto: 'La forma clásica de comprar un ERP es firmar todo de golpe, pagar una implantación larga y empezar a usarlo cuando ya cambió el negocio. Por eso tantas empresas siguen con hojas de cálculo: no es que no quieran un sistema, es que el sistema que les ofrecen no se puede empezar por un trozo.',
      puntos: [
        'Implantar un ERP completo es un proyecto de meses',
        'Se paga por módulos que no se van a usar',
        'Crecer significa comprar otro programa que no se habla con el primero',
        'El mismo dato se teclea en tres sitios',
        'Cada empresa del grupo acaba con su propio sistema',
        'Cambiar de país obliga a rehacer la fiscalidad entera',
      ],
    },

    beneficios: [
      { titulo: 'Empiezas por un módulo', descripcion: 'Facturación, Inventario, Nómina o el que te apriete. Los demás entran después sobre los mismos datos, sin migración ni segundo proyecto.' },
      { titulo: 'Una sola base, no integraciones', descripcion: 'Los módulos no se sincronizan: leen el mismo dato. Esa es la diferencia con un paquete de programas conectados con puentes.' },
      { titulo: 'Multi-empresa de verdad', descripcion: 'Varias empresas del mismo grupo, cada una con su contabilidad, su numeración y sus datos completamente separados de las demás.' },
      { titulo: 'La fiscalidad de tu país', descripcion: 'RD, Venezuela, Colombia, Guatemala y Costa Rica, cada uno con su impuesto, su comprobante y sus reportes al organismo que toca.' },
      { titulo: 'Multi-moneda de punta a punta', descripcion: 'Cada documento en su moneda, con su tasa y su diferencia cambiaria calculada al cobrar o al pagar. No es un campo: es todo el recorrido.' },
      { titulo: 'Sin instalar nada', descripcion: 'Se usa desde el navegador, con copias de seguridad y actualizaciones incluidas. No hay servidor que mantener ni versión que actualizar.' },
    ],

    cifras: [
      { valor: '34', etiqueta: 'módulos, y contratas los que usas' },
      { valor: '5', etiqueta: 'países con su legislación' },
      { valor: 'El mismo día', etiqueta: 'operando, sin implantación' },
    ],

    detalles: [
      { titulo: 'La contabilidad se puede sumar después', descripcion: 'Los módulos funcionan sin ella y empiezan a generar asiento cuando se activa. No hay que tenerlo todo el primer día para empezar a usar algo.' },
      { titulo: 'Los datos de dos empresas nunca se mezclan', descripcion: 'Ni los de dos suscriptores. Cada consulta, combo y reporte se acota por las dos dimensiones, siempre. Es la promesa que sostiene todo lo demás.' },
      { titulo: 'Los catálogos oficiales los mantenemos nosotros', descripcion: 'El padrón fiscal, los puertos del UN/LOCODE y las posiciones del Ministerio. Para ti son consulta: no los tienes que cargar ni actualizar.' },
      { titulo: 'Cada módulo trae su ayuda y su diccionario', descripcion: 'Panel por pantalla, explicación por campo y la documentación de tus datos. No hace falta un curso para usar una pantalla nueva.' },
      { titulo: 'Hay verticales, no solo módulos', descripcion: 'Restaurante, Car Wash, Condominios, Prestamello. Si tu negocio tiene su propia forma de operar, hay un vertical o se construye uno.' },
      { titulo: 'El precio está publicado', descripcion: 'Por módulo y por plan, en la propia web. No hay que pedir una cotización para saber cuánto cuesta lo que estás mirando.' },
    ],

    pasos: [
      { titulo: 'Elige por dónde empezar', descripcion: 'El módulo que resuelve lo que hoy te consume más tiempo.' },
      { titulo: 'Configuramos tu empresa', descripcion: 'País, moneda, impuestos y plan de cuentas de tu legislación.' },
      { titulo: 'Operas', descripcion: 'Y añades módulos cuando los necesites, sobre los mismos datos.' },
    ],

    publico: [
      { titulo: 'Te quedaste corto con Excel', descripcion: 'Y un ERP completo te parece desproporcionado.' },
      { titulo: 'Tienes programas sueltos', descripcion: 'Y el cierre del mes se va en cuadrarlos entre sí.' },
      { titulo: 'Operas en varios países', descripcion: 'Y cada uno exige su propia fiscalidad.' },
    ],

    faq: [
      { pregunta: '¿Tengo que contratar todos los módulos?', respuesta: 'No. Contratas los que uses y añades los demás cuando quieras, sin migración: entran sobre los mismos datos.' },
      { pregunta: '¿Cuánto tarda en estar funcionando?', respuesta: 'El mismo día para empezar a operar. Lo que lleva tiempo es cargar tus maestros, y en eso acompañamos.' },
      { pregunta: '¿Sirve para varias empresas?', respuesta: 'Sí, cada una con su contabilidad, su numeración fiscal y sus datos completamente separados.' },
      { pregunta: '¿En qué países funciona?', respuesta: 'RD, Venezuela, Colombia, Guatemala y Costa Rica, cada uno con su impuesto, sus comprobantes y sus reportes oficiales.' },
      { pregunta: '¿Y si mi negocio es muy particular?', respuesta: 'Hay verticales para restaurante, lavadero, condominios y préstamos; y si el tuyo no está, lo construimos sobre la misma plataforma.' },
      { pregunta: '¿Dónde veo los precios?', respuesta: 'Publicados en la sección de Plataforma de esta misma web, módulo por módulo.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'erp-y-crm',
    nombre: 'ERP y CRM',
    subtitulo: 'Softland, Profit, ODOO y plataformas abiertas',
    color: '#818cf8',
    resumen: 'Implementamos, personalizamos y migramos los ERP que ya usa el mercado dominicano. Si tu sistema es bueno y está mal implantado, no hace falta cambiarlo.',

    heroTitulo: 'Tu ERP no siempre es el problema: a veces lo es cómo se implantó',
    heroBajada: 'Trabajamos Softland, Profit, ODOO y plataformas abiertas: implantación, personalización, migración de versión y rescate de proyectos que se quedaron a medias.',

    problema: {
      titulo: 'El sistema está comprado y la empresa sigue trabajando en Excel',
      texto: 'Es el caso más común que nos llega: la licencia está pagada, el ERP instalado, y la operación real vive fuera de él. Casi nunca es culpa del software — es que se configuró sin entender cómo funciona la empresa, nadie se formó, y los reportes que hacían falta nunca se hicieron.',
      puntos: [
        'El ERP está instalado y la gente sigue en hojas de cálculo',
        'La versión es tan vieja que ya no tiene soporte',
        'Migrar da miedo por si se pierde el histórico',
        'Faltan los reportes que de verdad se necesitan',
        'Nadie en la empresa sabe configurarlo',
        'El proveedor original ya no contesta',
      ],
    },

    beneficios: [
      { titulo: 'Migración sin parar la operación', descripcion: 'Lo hemos hecho: de Profit 2K8 a 2K12, con cero pérdida de histórico y sin detener la empresa. La migración se ensaya antes de ejecutarse.' },
      { titulo: 'Implantación que parte de tu flujo', descripcion: 'Primero se entiende cómo trabaja la empresa; después se configura. Al revés es como se acaba con un ERP que nadie usa.' },
      { titulo: 'Los reportes que faltaban', descripcion: 'Crystal Reports, SQL, tableros. El ERP tiene el dato; muchas veces lo que falta es la pregunta hecha bien.' },
      { titulo: 'Rescate de proyectos parados', descripcion: 'Si el proveedor anterior desapareció, tomamos el sistema como está y lo ponemos a funcionar, sin empezar de cero.' },
      { titulo: 'Formación al equipo', descripcion: 'Un ERP que solo sabe usar una persona es un riesgo. La capacitación va incluida en la implantación, no como un extra.' },
      { titulo: 'Integración con lo que ya tienes', descripcion: 'Tu ERP hablando con tu facturación, tu banco o tu tienda en línea, en vez de con un archivo que alguien exporta a mano.' },
    ],

    cifras: [
      { valor: '4', etiqueta: 'plataformas: Softland, Profit, ODOO y abiertas' },
      { valor: '0', etiqueta: 'histórico perdido en nuestras migraciones' },
      { valor: 'SQL', etiqueta: 'los reportes que el ERP no trae' },
    ],

    detalles: [
      { titulo: 'La migración se ensaya en una copia', descripcion: 'Antes de tocar producción se corre entera sobre un duplicado y se cuadran los saldos. Migrar «en vivo» es cómo se pierde un histórico.' },
      { titulo: 'Se cuadra antes y después', descripcion: 'Los mismos números medidos en el sistema viejo y en el nuevo. Sin esa comparación no hay forma de afirmar que la migración salió bien.' },
      { titulo: 'La versión vieja sin soporte es un riesgo', descripcion: 'No por las funciones que faltan, sino porque el día que falle no hay a quién llamar y no hay parche que aplicar.' },
      { titulo: 'Personalizar tiene un costo futuro', descripcion: 'Cada modificación al estándar complica la siguiente actualización. Se hace cuando el negocio lo exige, y se documenta.' },
      { titulo: 'El dato está, la pregunta no', descripcion: 'La mayoría de las veces el reporte que falta se puede sacar de lo que el ERP ya guarda. Antes de desarrollar, se mira.' },
      { titulo: 'También implantamos el nuestro', descripcion: 'Si lo que tienes no da más de sí, la plataforma SaaS de Zyntello es una salida sin licencias ni servidor propio.' },
    ],

    pasos: [
      { titulo: 'Diagnóstico', descripcion: 'Qué tienes, cómo está configurado y qué se usa de verdad.' },
      { titulo: 'Plan', descripcion: 'Qué se arregla, qué se migra y qué se deja. Con fechas.' },
      { titulo: 'Ejecución y formación', descripcion: 'Se implanta, se cuadra y se forma al equipo que lo va a usar.' },
    ],

    publico: [
      { titulo: 'Tienes Softland o Profit', descripcion: 'Y no le sacas ni la mitad de lo que pagaste.' },
      { titulo: 'Tu versión ya no tiene soporte', descripcion: 'Y migrar da miedo por el histórico.' },
      { titulo: 'Tu proveedor desapareció', descripcion: 'Y el sistema se quedó como estaba.' },
    ],

    faq: [
      { pregunta: '¿Con qué ERP trabajan?', respuesta: 'Softland, Profit, ODOO y plataformas abiertas, además de nuestra propia plataforma SaaS.' },
      { pregunta: '¿Se puede migrar sin parar la empresa?', respuesta: 'Sí. Lo hemos hecho de Profit 2K8 a 2K12 sin parada y sin pérdida de histórico: la migración se ensaya en una copia y se cuadra antes de ejecutarla.' },
      { pregunta: '¿Y si mi proveedor anterior ya no está?', respuesta: 'Tomamos el sistema como esté. El diagnóstico dice qué se puede aprovechar y qué conviene rehacer.' },
      { pregunta: '¿Hacen los reportes que faltan?', respuesta: 'Sí, con Crystal Reports, SQL o tableros. Muchas veces el dato ya está y lo que falta es la consulta.' },
      { pregunta: '¿Incluye formación?', respuesta: 'Sí, y no como extra: un ERP que solo sabe usar una persona es un riesgo para la empresa.' },
      { pregunta: '¿Conviene personalizar mucho?', respuesta: 'Lo justo. Cada modificación al estándar complica la siguiente actualización, así que se hace donde el negocio lo exige y se deja documentada.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'automatizacion-con-ia',
    nombre: 'Automatización con IA',
    subtitulo: 'IA aplicada, no IA contada',
    color: '#a78bfa',
    resumen: 'Agentes y modelos que ejecutan tareas repetitivas, leen documentos, generan reportes y conectan sistemas. Si no ahorra horas de alguien, no lo llamamos IA.',

    heroTitulo: 'Si no ahorra horas de alguien, no lo llamamos IA',
    heroBajada: 'Agentes que ejecutan lo repetitivo, lectura automática de documentos, modelos predictivos sobre tus propias ventas y conexiones entre los sistemas que ya tienes. Dentro de tus procesos, no en una demo.',

    problema: {
      titulo: 'Casi todo lo que se vende como IA no llega a tocar el trabajo real',
      texto: 'La conversación sobre inteligencia artificial suele quedarse en el piloto que impresiona y no se despliega. El trabajo repetitivo que de verdad cuesta dinero —teclear facturas de proveedor, cuadrar dos sistemas, armar el mismo informe cada lunes— sigue haciéndolo una persona.',
      puntos: [
        'Alguien teclea a mano lo que llega en PDF',
        'El mismo informe se arma cada semana desde cero',
        'Dos sistemas no se hablan y alguien hace de puente',
        'Se responde a los clientes lo mismo veinte veces al día',
        'Los datos están, pero nadie los mira hasta que hay un problema',
        'El piloto de IA impresionó y nunca se desplegó',
      ],
    },

    beneficios: [
      { titulo: 'Lectura automática de documentos', descripcion: 'Facturas de proveedor y comprobantes que llegan en PDF se convierten en registros, con una pantalla para revisar lo que la lectura entendió antes de aceptarlo.' },
      { titulo: 'Agentes que ejecutan, no que sugieren', descripcion: 'Conectados a tus sistemas con permisos acotados, hacen la tarea completa: leen, deciden según tus reglas y dejan el resultado registrado.' },
      { titulo: 'Modelos sobre tus propios datos', descripcion: 'Predicción de demanda, riesgo de fuga de clientes, detección de anomalías. Con tu historial, no con un ejemplo de otro sector.' },
      { titulo: 'Conexión entre sistemas', descripcion: 'Lo que hoy pasa de un programa a otro porque alguien lo copia, pasa solo. Es el ahorro más aburrido y el que más horas devuelve.' },
      { titulo: 'Se mide lo que ahorra', descripcion: 'Antes de construir se cuenta cuántas horas cuesta hoy esa tarea. Si el número no compensa, lo decimos.' },
      { titulo: 'Con el humano donde hace falta', descripcion: 'Lo que tiene consecuencia —un pago, un precio, un compromiso con un cliente— pasa por una aprobación. La automatización no es ausencia de control.' },
    ],

    cifras: [
      { valor: 'Horas', etiqueta: 'la unidad en la que se mide el resultado' },
      { valor: 'Tus datos', etiqueta: 'los modelos se entrenan con tu historial' },
      { valor: 'Con revisión', etiqueta: 'lo que tiene consecuencia se aprueba' },
    ],

    detalles: [
      { titulo: 'La lectura automática necesita revisión', descripcion: 'Un documento mal leído que entra sin mirar es peor que teclearlo: nadie vuelve a comprobarlo. Por eso el paso de revisión no es opcional.' },
      { titulo: 'Sin historial no hay modelo', descripcion: 'Un predictor sobre tres meses de datos da un número con cara de cierto. Cuando no hay base, lo decimos en vez de entregar ruido.' },
      { titulo: 'El acceso del agente se acota', descripcion: 'Un agente con permisos de todo es un riesgo de seguridad con otro nombre. Cada uno recibe exactamente lo que necesita.' },
      { titulo: 'Se empieza por la tarea más aburrida', descripcion: 'La que nadie quiere hacer y todos hacen. Es donde la automatización se paga sola y donde el equipo la recibe bien.' },
      { titulo: 'La IA que decide, deja rastro', descripcion: 'Qué datos usó y por qué propuso eso. Sin eso, cuando se equivoca no hay forma de corregirla ni de defenderla.' },
      { titulo: 'Ya está dentro de la plataforma', descripcion: 'Score de salud de clientes, anomalías de asistencia, pronóstico de demanda y sugerido de compra vienen con los módulos, no como proyecto aparte.' },
    ],

    pasos: [
      { titulo: 'Medimos lo que cuesta hoy', descripcion: 'Cuántas horas y de quién se va en esa tarea.' },
      { titulo: 'Construimos lo mínimo que funcione', descripcion: 'Sobre tus sistemas reales, no sobre una maqueta.' },
      { titulo: 'Se despliega y se mide', descripcion: 'Si no ahorró lo previsto, se ajusta o se retira.' },
    ],

    publico: [
      { titulo: 'Tienes trabajo repetitivo', descripcion: 'Que ocupa horas de gente cara todos los días.' },
      { titulo: 'Manejas muchos documentos', descripcion: 'Que llegan en PDF y alguien teclea.' },
      { titulo: 'Tienes datos y no los usas', descripcion: 'Porque mirarlos cuesta más que decidir a ojo.' },
    ],

    faq: [
      { pregunta: '¿Necesito tener muchos datos?', respuesta: 'Para automatizar tareas, no. Para modelos predictivos sí hace falta historial, y si no lo hay lo decimos antes de empezar.' },
      { pregunta: '¿Se integra con mis sistemas actuales?', respuesta: 'Sí: trabajamos sobre las bases de datos y los sistemas que ya usas, sin exigir cambiarlos.' },
      { pregunta: '¿Y si la IA se equivoca?', respuesta: 'Lo que tiene consecuencia pasa por aprobación humana, y cada decisión deja rastro de qué datos usó. Sin eso no se puede ni corregir ni defender.' },
      { pregunta: '¿Cómo sé que vale la pena?', respuesta: 'Se mide antes: cuántas horas cuesta hoy esa tarea. Si el número no compensa, lo decimos en vez de venderlo.' },
      { pregunta: '¿Viene algo de esto en la plataforma?', respuesta: 'Sí: score de salud de clientes, anomalías de asistencia, pronóstico de demanda y sugerido de compra ya vienen con sus módulos.' },
      { pregunta: '¿Mis datos se usan para entrenar modelos de terceros?', respuesta: 'No. Los modelos se aplican sobre tus datos para tu operación; lo que se comparte con un proveedor externo, si lo hay, se declara antes.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'aplicaciones-a-la-medida',
    nombre: 'Aplicaciones a la medida',
    subtitulo: 'Sobre las bases de datos que ya usas',
    color: '#22d3ee',
    resumen: 'Software construido para un problema concreto, encima de tus sistemas actuales. No hay que empezar de cero para resolver lo que ningún producto estándar cubre.',

    heroTitulo: 'No hace falta cambiar todo para resolver una cosa',
    heroBajada: 'Aplicaciones web y móviles construidas sobre las bases de datos que ya tienes: un portal de inventarios, una app de campo, un tablero para dirección. Resuelven el problema concreto sin tocar lo que funciona.',

    problema: {
      titulo: 'Ningún producto estándar cubre exactamente tu caso raro',
      texto: 'Toda empresa tiene un proceso que no encaja: el que le da ventaja, o el que arrastra desde siempre. Forzarlo dentro de un producto estándar lo empeora, y cambiar todo el sistema por ese trozo es desproporcionado. Lo que hace falta es una pieza construida para eso.',
      puntos: [
        'El proceso que te diferencia no cabe en ningún producto',
        'Se paga un sistema entero para usar un 20 %',
        'Los datos están, pero nadie puede consultarlos como hace falta',
        'El equipo de campo no tiene forma de registrar en el sitio',
        'Cada cliente pide su informe y alguien lo arma a mano',
        'Cambiar el ERP por una funcionalidad es desproporcionado',
      ],
    },

    beneficios: [
      { titulo: 'Sobre lo que ya tienes', descripcion: 'La aplicación lee y escribe en tus bases de datos actuales. No hay migración ni un segundo sitio donde el dato se duplica.' },
      { titulo: 'Web y móvil', descripcion: 'Aplicaciones instalables en el teléfono para quien trabaja fuera: ruta, ponche, inventario, entrega. Funcionan donde está el trabajo.' },
      { titulo: 'Portales para tus clientes', descripcion: 'Que consulten su estado de cuenta, su pedido o su expediente sin llamar. Cada consulta que se resuelve sola es una llamada menos.' },
      { titulo: 'Tableros para decidir', descripcion: 'Con los números que de verdad se miran, actualizados solos. Incluida la analítica predictiva cuando el historial da para ello.' },
      { titulo: 'Integraciones y APIs', descripcion: 'Para que tus sistemas se hablen entre ellos y con los de tus clientes o proveedores, en vez de con un archivo que alguien envía.' },
      { titulo: 'Te entregamos el código y el dato', descripcion: 'Con su documentación. Lo que construimos es tuyo, y eso incluye poder llevártelo a otro proveedor.' },
    ],

    cifras: [
      { valor: 'Sin migrar', etiqueta: 'trabaja sobre tus bases actuales' },
      { valor: 'Web y móvil', etiqueta: 'donde está el trabajo' },
      { valor: 'Tuyo', etiqueta: 'el código y su documentación' },
    ],

    detalles: [
      { titulo: 'Se empieza por lo mínimo que resuelve', descripcion: 'Una primera versión corta que ya sirve enseña más que seis meses de especificación. Lo que sobra se descubre usándolo.' },
      { titulo: 'Escribir en la base de otro sistema tiene reglas', descripcion: 'Hay que respetar sus validaciones o el ERP acabará con datos que él mismo considera imposibles. Por eso se analiza antes.' },
      { titulo: 'Una app de campo necesita funcionar sin señal', descripcion: 'Si exige conexión permanente, el técnico anota en papel y transcribe después — que es exactamente lo que se quería evitar.' },
      { titulo: 'El portal del cliente es cara al público', descripcion: 'Lo ve gente de fuera, así que el control de qué puede ver cada uno se diseña primero, no se añade al final.' },
      { titulo: 'Sin documentación no es tuyo del todo', descripcion: 'Un código entregado que nadie más entiende te ata igual. Por eso va con su documentación y su estructura de datos escrita.' },
      { titulo: 'A veces la respuesta es no construir', descripcion: 'Si un módulo de la plataforma o una configuración del ERP lo resuelve, lo decimos. Sale más barato para los dos.' },
    ],

    pasos: [
      { titulo: 'Entendemos el proceso', descripcion: 'Cómo se hace hoy, quién lo hace y qué falla.' },
      { titulo: 'Primera versión corta', descripcion: 'Lo mínimo que ya sirve, para usarlo y ajustarlo.' },
      { titulo: 'Se amplía con el uso', descripcion: 'Lo que se pide de verdad, no lo que se imaginó al principio.' },
    ],

    publico: [
      { titulo: 'Tienes un proceso propio', descripcion: 'Que ningún producto estándar cubre.' },
      { titulo: 'Tu equipo trabaja fuera', descripcion: 'Y registra en papel para transcribir después.' },
      { titulo: 'Tus clientes te llaman por lo mismo', descripcion: 'Y un portal lo resolvería solo.' },
    ],

    faq: [
      { pregunta: '¿Tengo que cambiar mi sistema actual?', respuesta: 'No. Construimos sobre las bases de datos que ya usas, respetando sus reglas.' },
      { pregunta: '¿Hacen aplicaciones móviles?', respuesta: 'Sí, instalables en el teléfono y pensadas para funcionar aunque la señal falle: si exigen conexión, el técnico vuelve al papel.' },
      { pregunta: '¿El código es mío?', respuesta: 'Sí, con su documentación y su estructura de datos. Un código entregado que nadie más entiende te ata igual.' },
      { pregunta: '¿Cuánto tarda?', respuesta: 'La primera versión corta sale rápido a propósito: se usa, se ajusta y se amplía con lo que se pide de verdad.' },
      { pregunta: '¿Y si lo que necesito ya existe?', respuesta: 'Lo decimos. Si un módulo de la plataforma o una configuración de tu ERP lo resuelve, sale más barato para los dos.' },
      { pregunta: '¿Con qué tecnologías trabajan?', respuesta: 'React, Node, PHP/Laravel, Python, SQL Server y MySQL, entre otras. La elección la manda el sistema con el que hay que convivir.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'soporte-tecnico-ti',
    nombre: 'Soporte técnico TI',
    subtitulo: 'Infraestructura, redes y servidores',
    color: '#fb7185',
    resumen: 'Soporte de infraestructura, redes, servidores y sistemas, con niveles de servicio acordados según cómo opera tu empresa — no según una tabla genérica.',

    heroTitulo: 'Que alguien conteste cuando se cae algo',
    heroBajada: 'Soporte de infraestructura, redes, servidores y puestos de trabajo, con tiempos de respuesta acordados según lo que cada cosa le cuesta a tu operación cuando se detiene.',

    problema: {
      titulo: 'La informática solo se nota cuando falla, y entonces ya es tarde',
      texto: 'Mientras todo funciona, nadie piensa en el servidor ni en el respaldo. El problema es que la mayoría de las caídas se podían haber visto venir: un disco que llevaba meses avisando, un respaldo que nunca se probó, una red montada para diez personas que ahora usan cuarenta.',
      puntos: [
        'Cuando algo se cae, no hay a quién llamar',
        'El respaldo existe pero nadie ha probado restaurarlo',
        'La red se montó para la mitad de la gente que hay hoy',
        'Nadie sabe qué equipos hay ni en qué estado',
        'Se paga por parar la operación, no por arreglar el equipo',
        'Cada incidencia se resuelve y no queda registrada',
      ],
    },

    beneficios: [
      { titulo: 'Niveles de servicio acordados', descripcion: 'El tiempo de respuesta se pacta según lo que cada sistema le cuesta a tu operación parado. Un servidor de producción no es una impresora.' },
      { titulo: 'Respaldos que se prueban', descripcion: 'Un respaldo que nunca se restauró no es un respaldo: es una suposición. Se verifica que se puede recuperar, con qué antigüedad y en cuánto tiempo.' },
      { titulo: 'Redes y servidores dimensionados', descripcion: 'LAN, WiFi, servidores de archivos y de aplicaciones, montados para la gente que hay hoy y la que va a haber.' },
      { titulo: 'Mantenimiento antes del fallo', descripcion: 'Revisión periódica de lo que avisa antes de romperse: discos, temperatura, espacio, actualizaciones. Es lo más barato que se puede hacer.' },
      { titulo: 'Inventario de lo que tienes', descripcion: 'Qué equipos hay, dónde, con qué licencia y en qué estado. Sin eso, cada decisión de compra se toma a ciegas.' },
      { titulo: 'Cada incidencia queda registrada', descripcion: 'Qué falló, qué se hizo y cuánto tardó. Es lo que permite ver el patrón: lo que se repite tres veces tiene una causa de fondo.' },
    ],

    cifras: [
      { valor: 'SLA', etiqueta: 'tiempos acordados, no genéricos' },
      { valor: 'Probado', etiqueta: 'el respaldo se restaura para verificarlo' },
      { valor: 'Registrado', etiqueta: 'cada incidencia, para ver el patrón' },
    ],

    detalles: [
      { titulo: 'El respaldo se mide en tiempo de recuperación', descripcion: 'No en si existe. Cuánto se tarda en volver a operar y cuánto trabajo se pierde son las dos preguntas, y casi nadie las tiene contestadas.' },
      { titulo: 'Lo que se repite tres veces tiene causa', descripcion: 'Por eso las incidencias se registran: el mismo fallo resuelto diez veces cuesta más que arreglar el origen una.' },
      { titulo: 'La WiFi de oficina no es la de casa', descripcion: 'Cuarenta dispositivos sobre un equipo doméstico funcionan hasta que dejan de hacerlo, y el síntoma parece «internet va lento».' },
      { titulo: 'Un equipo sin licencia es un riesgo legal', descripcion: 'El inventario incluye las licencias por eso: la auditoría de software no avisa antes de llegar.' },
      { titulo: 'El usuario con permisos de administrador', descripcion: 'Es la vía de entrada más común de un ransomware. Quitarlo cuesta una conversación incómoda y evita un mes muy malo.' },
      { titulo: 'Soporte remoto y presencial', descripcion: 'La mayoría se resuelve en remoto y más rápido. Lo que exige manos va en sitio, con el tiempo que se haya pactado.' },
    ],

    pasos: [
      { titulo: 'Levantamiento', descripcion: 'Qué hay, en qué estado y qué es crítico para operar.' },
      { titulo: 'Acuerdo de servicio', descripcion: 'Qué se cubre, con qué tiempos y por qué canal.' },
      { titulo: 'Operación y prevención', descripcion: 'Soporte del día a día, más el mantenimiento que evita la caída.' },
    ],

    publico: [
      { titulo: 'No tienes departamento de TI', descripcion: 'Y cuando algo falla, se improvisa.' },
      { titulo: 'Tienes uno pequeño', descripcion: 'Y necesita respaldo para lo que no llega.' },
      { titulo: 'Has tenido una caída larga', descripcion: 'Y no quieres repetirla.' },
    ],

    faq: [
      { pregunta: '¿Qué tiempos de respuesta manejan?', respuesta: 'Los que se pacten según lo que cada sistema le cuesta a tu operación parado. Una tabla genérica no sirve: un servidor de producción no es una impresora.' },
      { pregunta: '¿El soporte es remoto o presencial?', respuesta: 'Los dos. La mayoría se resuelve en remoto y más rápido; lo que exige manos va en sitio.' },
      { pregunta: '¿Revisan los respaldos?', respuesta: 'Sí, y restaurándolos: un respaldo que nunca se probó es una suposición, no un respaldo.' },
      { pregunta: '¿Incluye los equipos de los usuarios?', respuesta: 'Sí, puestos de trabajo además de servidores y red, con su inventario y sus licencias.' },
      { pregunta: '¿Trabajan fuera de República Dominicana?', respuesta: 'Sí: presencia directa en RD, Venezuela, Colombia, Guatemala y Costa Rica, y soporte remoto al resto de la región.' },
      { pregunta: '¿Qué pasa con las incidencias repetidas?', respuesta: 'Se registran todas precisamente para verlo: lo que se repite tres veces tiene una causa de fondo que sale más barato arreglar.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'nube-y-ciberseguridad',
    nombre: 'Nube y ciberseguridad',
    subtitulo: 'Que esté disponible, y que solo entre quien debe',
    color: '#34d399',
    resumen: 'Migración a la nube, gestión de infraestructura y protección de la información. Hemos bajado un 40 % el costo operativo pasando de servidor propio a AWS.',

    heroTitulo: 'Disponible siempre, y solo para quien debe',
    heroBajada: 'Migración y gestión de infraestructura en la nube, más la protección de la información: control de accesos, respaldo verificado y la respuesta preparada para el día que algo pase.',

    problema: {
      titulo: 'El servidor bajo el escritorio es una decisión de riesgo que nadie tomó',
      texto: 'Muchas empresas sostienen su operación sobre un equipo en la oficina que nadie eligió poner ahí: se fue quedando. No tiene redundancia, su respaldo va a un disco en el mismo cuarto, y el día que falle —o que entre alguien— no hay plan. Y mientras tanto cuesta más que la alternativa.',
      puntos: [
        'El servidor está en la oficina, sin redundancia',
        'El respaldo va a un disco en el mismo cuarto',
        'Todo el mundo tiene acceso a todo',
        'No hay plan para el día que entre un ransomware',
        'Se paga por capacidad que no se usa',
        'Nadie sabe quién accedió a qué',
      ],
    },

    beneficios: [
      { titulo: 'Migración a la nube, medida', descripcion: 'De servidor propio a AWS con 40 % menos de costo operativo y alta disponibilidad. El número sale de un caso real, no de un folleto.' },
      { titulo: 'Se paga por lo que se usa', descripcion: 'Sin comprar capacidad para el pico de diciembre y tenerla parada en febrero. El dimensionamiento se revisa, no se fija una vez.' },
      { titulo: 'Control de accesos por rol', descripcion: 'Cada quien entra a lo suyo. «Todos tienen acceso a todo» no es comodidad: es la forma más común de que un incidente sea grave.' },
      { titulo: 'Respaldo fuera del sitio y probado', descripcion: 'En otra ubicación y restaurándolo para verificarlo. Un respaldo en el mismo cuarto no protege del incendio ni del ransomware.' },
      { titulo: 'Registro de quién accede a qué', descripcion: 'Es lo que permite responder después de un incidente. Sin registro, la investigación empieza y termina en suposiciones.' },
      { titulo: 'Plan de respuesta escrito', descripcion: 'Qué se hace, en qué orden y a quién se llama. Improvisarlo el día del incidente es cuando se toman las peores decisiones.' },
    ],

    cifras: [
      { valor: '40 %', etiqueta: 'menos costo operativo al migrar a AWS' },
      { valor: 'Fuera', etiqueta: 'el respaldo, en otra ubicación' },
      { valor: 'Por rol', etiqueta: 'el acceso, no todos a todo' },
    ],

    detalles: [
      { titulo: 'La nube mal dimensionada sale más cara', descripcion: 'Levantar en la nube la misma capacidad ociosa del servidor propio no ahorra nada. El ahorro viene de ajustar, y eso se revisa periódicamente.' },
      { titulo: 'El ransomware cifra también los respaldos', descripcion: 'Si están conectados. Por eso una copia tiene que estar fuera de alcance de la red que se quiere proteger.' },
      { titulo: 'La contraseña no es la defensa', descripcion: 'El segundo factor sí. Casi todas las entradas empiezan por una credencial robada que funcionaba perfectamente.' },
      { titulo: 'Migrar es también una oportunidad de limpiar', descripcion: 'Se descubre lo que nadie usa desde hace años. Llevárselo tal cual es pagar por mudar basura.' },
      { titulo: 'La disponibilidad se define en números', descripcion: 'Cuánto puede estar caído y cuánto trabajo se puede perder. De esas dos respuestas sale la arquitectura, no al revés.' },
      { titulo: 'El eslabón es la gente', descripcion: 'Por eso la formación básica en seguridad va con el servicio: reconocer un correo de phishing evita más incidentes que cualquier equipo.' },
    ],

    pasos: [
      { titulo: 'Evaluación', descripcion: 'Qué tienes, qué es crítico y cuánto puedes estar sin ello.' },
      { titulo: 'Diseño y migración', descripcion: 'Arquitectura, accesos y respaldo, con la migración ensayada.' },
      { titulo: 'Gestión continua', descripcion: 'Monitoreo, ajuste de costo y revisión de accesos.' },
    ],

    publico: [
      { titulo: 'Tu servidor está en la oficina', descripcion: 'Y sostiene la operación entera.' },
      { titulo: 'Tu respaldo nunca se ha probado', descripcion: 'Y no sabes en cuánto volverías a operar.' },
      { titulo: 'Manejas datos sensibles', descripcion: 'De clientes, de pacientes o de nómina.' },
    ],

    faq: [
      { pregunta: '¿La nube sale más barata?', respuesta: 'Bien dimensionada, sí: en un caso real, 40 % menos de costo operativo. Mal dimensionada sale más cara, porque se paga capacidad ociosa.' },
      { pregunta: '¿Con qué nubes trabajan?', respuesta: 'AWS principalmente, y las que ya uses. La elección la manda tu caso, no una preferencia nuestra.' },
      { pregunta: '¿Y si tengo un ransomware?', respuesta: 'Ahí el plan importa más que la herramienta: una copia fuera del alcance de la red y un procedimiento escrito de a quién llamar y en qué orden.' },
      { pregunta: '¿Hace falta segundo factor?', respuesta: 'Sí. Casi todas las entradas empiezan por una credencial robada que funcionaba perfectamente: la contraseña sola ya no es una defensa.' },
      { pregunta: '¿Incluye formación al equipo?', respuesta: 'Sí, la básica de seguridad: reconocer un correo de phishing evita más incidentes que cualquier equipo que se compre.' },
      { pregunta: '¿Puedo migrar por partes?', respuesta: 'Sí, y suele ser lo sensato: se empieza por lo menos crítico para validar el diseño antes de mover lo que sostiene la operación.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'personal-ti-especializado',
    nombre: 'Personal TI especializado',
    subtitulo: 'Del técnico de soporte al arquitecto de sistemas',
    color: '#fbbf24',
    resumen: 'Colocación de perfiles de tecnología: soporte, desarrollo, bases de datos, infraestructura y especialistas en Inteligencia Artificial. Evaluados técnicamente, no solo por currículo.',

    heroTitulo: 'Contratar tecnología sin saber evaluarla es una apuesta cara',
    heroBajada: 'Buscamos, evaluamos técnicamente y colocamos perfiles de TI: soporte, desarrollo, bases de datos, infraestructura y especialistas en IA. Nosotros sí sabemos preguntar lo que hay que preguntar.',

    problema: {
      titulo: 'Un error de contratación técnica cuesta meses, no semanas',
      texto: 'Quien contrata rara vez puede evaluar lo que contrata: el currículo dice lo que el candidato quiso escribir y la entrevista mide simpatía. Cuando el perfil no da, se descubre a los tres meses, con un proyecto ya comprometido y el mercado vuelto a empezar.',
      puntos: [
        'El currículo no dice si sabe hacerlo',
        'Quien entrevista no domina la materia',
        'El perfil no encaja y se descubre a los tres meses',
        'Los buenos no están buscando trabajo',
        'Hace falta alguien seis meses, no para siempre',
        'La rotación deja el conocimiento en cero',
      ],
    },

    beneficios: [
      { titulo: 'Evaluación técnica de verdad', descripcion: 'Quien evalúa hace el mismo trabajo. Una entrevista técnica hecha por alguien que no lo es mide confianza del candidato, no capacidad.' },
      { titulo: 'Todo el rango de perfiles', descripcion: 'Soporte, desarrollo, bases de datos, redes, infraestructura, arquitectura de sistemas y especialistas en Inteligencia Artificial.' },
      { titulo: 'Por proyecto o permanente', descripcion: 'Si lo necesitas seis meses, no tiene sentido contratar para siempre. Y al revés: lo que sostiene la operación conviene que sea tuyo.' },
      { titulo: 'Conocemos el mercado de la región', descripcion: 'RD, Venezuela, Colombia, Guatemala y Costa Rica. Los mejores perfiles casi nunca están buscando: hay que ir por ellos.' },
      { titulo: 'Encaje con tu entorno real', descripcion: 'No basta que sepa: tiene que saber de lo que tú usas. Un buen perfil en otra pila tarda meses en ser productivo en la tuya.' },
      { titulo: 'Acompañamiento en la incorporación', descripcion: 'Las primeras semanas deciden si funciona. Seguimos el encaje en vez de desaparecer el día que firma.' },
    ],

    cifras: [
      { valor: 'Técnica', etiqueta: 'la evaluación la hace quien sabe' },
      { valor: '5 países', etiqueta: 'de mercado donde buscamos' },
      { valor: 'Proyecto', etiqueta: 'o permanente, según lo que necesites' },
    ],

    detalles: [
      { titulo: 'El encaje técnico no es el único', descripcion: 'Un perfil excelente en una empresa de cien personas puede ahogarse en una de diez, donde hay que hacer de todo. Se mira el contexto.' },
      { titulo: 'La pila importa tanto como el nivel', descripcion: 'Alguien muy bueno en otra tecnología tarda meses en rendir en la tuya. Si el plazo es corto, eso decide.' },
      { titulo: 'Un solo especialista es un riesgo', descripcion: 'Si una persona es la única que entiende un sistema, su salida es una crisis. Conviene planear el relevo desde el primer día.' },
      { titulo: 'Los buenos no están buscando', descripcion: 'Publicar una oferta filtra a quien está disponible, no a quien es mejor. Los perfiles fuertes se buscan activamente.' },
      { titulo: 'El sueldo del mercado es un dato', descripcion: 'Una oferta por debajo no atrae; muy por encima desajusta al equipo que ya está. Lo decimos antes de empezar la búsqueda.' },
      { titulo: 'Las primeras semanas deciden', descripcion: 'La mayoría de las contrataciones que fallan lo hacen por una incorporación mal llevada, no por el perfil. Por eso se acompaña.' },
    ],

    pasos: [
      { titulo: 'Definimos el perfil real', descripcion: 'Qué va a hacer de verdad, con qué tecnologías y en qué equipo.' },
      { titulo: 'Búsqueda y evaluación técnica', descripcion: 'Con prueba práctica, no solo entrevista.' },
      { titulo: 'Incorporación acompañada', descripcion: 'Las primeras semanas se siguen, que es cuando se decide.' },
    ],

    publico: [
      { titulo: 'Necesitas un perfil técnico', descripcion: 'Y no tienes cómo evaluarlo.' },
      { titulo: 'Tienes un proyecto con plazo', descripcion: 'Y te falta gente solo para eso.' },
      { titulo: 'Ya te equivocaste una vez', descripcion: 'Y el error costó meses.' },
    ],

    faq: [
      { pregunta: '¿Qué perfiles cubren?', respuesta: 'Desde técnicos de soporte hasta arquitectos de sistemas, pasando por desarrollo, bases de datos, redes e Inteligencia Artificial.' },
      { pregunta: '¿La evaluación es técnica?', respuesta: 'Sí, con prueba práctica y hecha por quien hace ese mismo trabajo. Una entrevista técnica por alguien que no lo es mide confianza, no capacidad.' },
      { pregunta: '¿Puede ser por proyecto?', respuesta: 'Sí. Si lo necesitas seis meses no tiene sentido contratar para siempre, y lo contrario también aplica.' },
      { pregunta: '¿En qué países buscan?', respuesta: 'RD, Venezuela, Colombia, Guatemala y Costa Rica, con posibilidad de trabajo remoto según el perfil.' },
      { pregunta: '¿Qué pasa si no funciona?', respuesta: 'Acompañamos la incorporación precisamente por eso: la mayoría de los fallos son de encaje inicial, no de perfil, y se corrigen si se ven a tiempo.' },
      { pregunta: '¿Me dicen cuánto debería pagar?', respuesta: 'Sí, antes de empezar la búsqueda. Una oferta por debajo del mercado no atrae, y muy por encima desajusta al equipo que ya tienes.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'venta-de-equipos',
    nombre: 'Venta de equipos',
    subtitulo: 'Hardware y software con la asesoría incluida',
    color: '#94a3b8',
    resumen: 'Importación y venta de equipos, software y soluciones tecnológicas. La asesoría técnica va en la compra: te decimos qué necesitas de verdad, aunque sea menos.',

    heroTitulo: 'Comprar el equipo correcto sale más barato que comprar el caro',
    heroBajada: 'Importación y venta de hardware, software y soluciones, con la asesoría técnica incluida. Lo que se compra tiene que encajar con lo que ya tienes y durar lo que va a durar el uso.',

    problema: {
      titulo: 'Se compra por precio o por catálogo, y se paga dos veces',
      texto: 'Comprar tecnología sin criterio técnico produce dos errores caros y opuestos: el equipo barato que se queda corto en un año, y el sobredimensionado que se paga entero para usar la mitad. Los dos se descubren tarde, cuando ya no hay devolución.',
      puntos: [
        'El equipo se queda corto en un año',
        'Se paga por capacidad que nunca se usa',
        'No es compatible con lo que ya hay',
        'Llega sin instalar y se queda en una caja',
        'La garantía no cubre lo que se creía',
        'Se compró software que ya se tenía',
      ],
    },

    beneficios: [
      { titulo: 'Asesoría antes de la compra', descripcion: 'Qué hace falta de verdad para el uso que le vas a dar. A veces la respuesta es un equipo más barato, y lo decimos igual.' },
      { titulo: 'Compatible con lo que tienes', descripcion: 'Se mira tu entorno antes de cotizar. Un equipo excelente que no encaja con tu red o tu sistema no sirve de nada.' },
      { titulo: 'Importación directa', descripcion: 'Hardware, software y soluciones traídas a tu operación, con el costo puesto en destino claro desde el principio.' },
      { titulo: 'Instalado y funcionando', descripcion: 'Un equipo entregado en su caja no es un equipo en servicio. Se configura, se integra y se deja operando.' },
      { titulo: 'Licencias en regla', descripcion: 'Con lo que cubren y lo que no, por escrito. Una auditoría de software no avisa antes de llegar.' },
      { titulo: 'Dimensionado para su vida útil', descripcion: 'No para hoy: para los años que va a estar. La diferencia de precio entre quedarse corto y no hacerlo suele ser pequeña.' },
    ],

    cifras: [
      { valor: 'Incluida', etiqueta: 'la asesoría técnica, en la compra' },
      { valor: 'Operando', etiqueta: 'instalado, no entregado en su caja' },
      { valor: 'En regla', etiqueta: 'las licencias, con lo que cubren' },
    ],

    detalles: [
      { titulo: 'El equipo barato se paga dos veces', descripcion: 'Una al comprarlo y otra al sustituirlo antes de tiempo, con la parada de operación incluida. Casi siempre sale más caro.' },
      { titulo: 'Sobredimensionar también cuesta', descripcion: 'Capacidad que nunca se usa es dinero inmovilizado. El punto está en la vida útil prevista, no en el máximo posible.' },
      { titulo: 'La garantía tiene letra pequeña', descripcion: 'Cuánto dura, si es en sitio y si incluye reemplazo. Descubrirlo el día que falla es tarde, y suele ser lo que más molesta.' },
      { titulo: 'Un servidor necesita dónde vivir', descripcion: 'Energía, temperatura y red. Comprarlo sin resolver eso es comprar un problema con mejores especificaciones.' },
      { titulo: 'El software que ya tienes cuenta', descripcion: 'Antes de comprar se revisa lo contratado: es frecuente descubrir licencias sin usar que cubren lo que se iba a pedir.' },
      { titulo: 'La compra a crédito se financia', descripcion: 'Si la renovación no cabe en el presupuesto de golpe, se estructura. Aplazarla suele costar más que financiarla.' },
    ],

    pasos: [
      { titulo: 'Qué necesitas y para qué', descripcion: 'El uso real y los años que tiene que durar.' },
      { titulo: 'Propuesta con alternativas', descripcion: 'Con su diferencia de precio y qué se gana con cada una.' },
      { titulo: 'Entrega instalada', descripcion: 'Configurado, integrado y funcionando.' },
    ],

    publico: [
      { titulo: 'Vas a renovar equipos', descripcion: 'Y no quieres equivocarte en la compra.' },
      { titulo: 'Necesitas un servidor', descripcion: 'Y no sabes qué capacidad hace falta.' },
      { titulo: 'Tienes licencias desordenadas', descripcion: 'Y no sabes qué estás pagando.' },
    ],

    faq: [
      { pregunta: '¿Qué venden exactamente?', respuesta: 'Hardware, software y soluciones tecnológicas: equipos de usuario, servidores, redes, almacenamiento y licencias.' },
      { pregunta: '¿La asesoría se cobra aparte?', respuesta: 'No, va incluida en la compra. Y a veces la recomendación es un equipo más barato del que ibas a comprar.' },
      { pregunta: '¿Lo instalan?', respuesta: 'Sí: configurado, integrado con lo que ya tienes y funcionando. Un equipo entregado en su caja no está en servicio.' },
      { pregunta: '¿Importan equipos?', respuesta: 'Sí, con el costo puesto en destino claro desde el principio, para que no aparezcan gastos después.' },
      { pregunta: '¿Y las licencias?', respuesta: 'En regla y por escrito, con lo que cubren y lo que no. Antes de comprar revisamos lo que ya tienes: es frecuente encontrar licencias sin usar.' },
      { pregunta: '¿Se puede financiar?', respuesta: 'Sí. Si la renovación no cabe de golpe en el presupuesto, se estructura: aplazarla suele costar más.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'transformacion-digital',
    nombre: 'Transformación digital',
    subtitulo: 'Diagnóstico, hoja de ruta y acompañamiento',
    color: '#818cf8',
    resumen: 'Diagnóstico de lo que tienes, hoja de ruta tecnológica con prioridades y acompañamiento en la implementación. Consultoría que se queda hasta que funciona.',

    heroTitulo: 'Una hoja de ruta que alguien ejecuta, no un informe que se archiva',
    heroBajada: 'Diagnóstico de tus sistemas y procesos, prioridades ordenadas por lo que cada una devuelve, y acompañamiento hasta que está funcionando. Sin la parte de ejecución, esto sería solo un documento.',

    problema: {
      titulo: 'La consultoría que entrega un informe y se va',
      texto: 'El patrón se repite: llega una firma, entrevista a todo el mundo, entrega un documento con veinte recomendaciones y factura. Seis meses después el documento sigue en un cajón porque nadie tenía tiempo ni criterio para ejecutarlo, y la empresa está igual con menos presupuesto.',
      puntos: [
        'El informe se entrega y nadie lo ejecuta',
        'Se digitaliza un proceso malo y queda malo pero digital',
        'Cada área compra su herramienta por su cuenta',
        'No hay forma de priorizar entre veinte propuestas',
        'Se invierte y nadie mide si sirvió',
        'La gente vuelve a su forma de siempre en dos meses',
      ],
    },

    beneficios: [
      { titulo: 'Diagnóstico de lo que hay', descripcion: 'Sistemas, procesos, datos y quién hace qué. Sin ese mapa, cualquier recomendación es una intuición bien presentada.' },
      { titulo: 'Prioridades por lo que devuelven', descripcion: 'Ordenadas por impacto y por esfuerzo, no por lo que suena más moderno. Lo primero tiene que dar resultado pronto o nadie sigue.' },
      { titulo: 'Se arregla el proceso antes de digitalizarlo', descripcion: 'Automatizar un proceso malo lo hace más rápido, no mejor. Ese es el error más caro de la transformación digital.' },
      { titulo: 'Arquitectura que aguanta el crecimiento', descripcion: 'Decidida una vez y con criterio, en vez de cada área comprando su herramienta y alguien haciendo de puente después.' },
      { titulo: 'Acompañamiento en la ejecución', descripcion: 'Nos quedamos hasta que funciona. Un informe sin ejecución es la forma más cara de no cambiar nada.' },
      { titulo: 'Se mide el resultado', descripcion: 'Lo que se iba a mejorar, medido antes y después. Sin eso no hay forma de saber si la inversión sirvió.' },
    ],

    cifras: [
      { valor: 'Priorizado', etiqueta: 'por impacto y esfuerzo, no por moda' },
      { valor: 'Ejecución', etiqueta: 'acompañada, no solo el informe' },
      { valor: 'Medido', etiqueta: 'antes y después de cada cambio' },
    ],

    detalles: [
      { titulo: 'Digitalizar un proceso malo lo empeora', descripcion: 'Le da velocidad y apariencia de rigor. Primero se arregla el proceso, después se automatiza: al revés se institucionaliza el error.' },
      { titulo: 'Lo primero tiene que dar resultado pronto', descripcion: 'Si el primer paso tarda un año en verse, la organización deja de creer y el resto no se hace. Por eso el orden importa tanto.' },
      { titulo: 'El cambio lo bloquea la gente, no la tecnología', descripcion: 'Quien lleva quince años haciéndolo de una forma tiene motivos. Si no se escuchan, vuelve a su método en dos meses.' },
      { titulo: 'Cada área con su herramienta es el problema', descripcion: 'Once herramientas que no se hablan cuestan más que una que sirva, y el costo no está en las licencias sino en el puente humano.' },
      { titulo: 'No todo hay que cambiarlo', descripcion: 'Lo que funciona y nadie discute se deja. Una hoja de ruta que lo toca todo es una que no se va a ejecutar.' },
      { titulo: 'Sin medición no hubo transformación', descripcion: 'Hubo gasto. Definir qué número tiene que moverse antes de empezar es lo que separa una inversión de una compra.' },
    ],

    pasos: [
      { titulo: 'Diagnóstico', descripcion: 'Sistemas, procesos, datos y personas. Qué funciona y qué no.' },
      { titulo: 'Hoja de ruta priorizada', descripcion: 'Qué primero, qué después y qué se descarta, con su porqué.' },
      { titulo: 'Ejecución acompañada', descripcion: 'Se implanta, se forma y se mide lo que se dijo que iba a mejorar.' },
    ],

    publico: [
      { titulo: 'Sabes que hay que cambiar', descripcion: 'Y no sabes por dónde empezar.' },
      { titulo: 'Ya pagaste una consultoría', descripcion: 'Y el informe sigue en un cajón.' },
      { titulo: 'Creciste sin orden', descripcion: 'Y cada área tiene su herramienta.' },
    ],

    faq: [
      { pregunta: '¿Entregan solo un informe?', respuesta: 'No, y esa es la diferencia: el diagnóstico y la hoja de ruta vienen con el acompañamiento en la ejecución. Un informe sin ejecución es la forma más cara de no cambiar nada.' },
      { pregunta: '¿Por dónde se empieza?', respuesta: 'Por lo que devuelve resultado pronto. Si el primer paso tarda un año en verse, la organización deja de creer y el resto no se hace.' },
      { pregunta: '¿Hay que cambiarlo todo?', respuesta: 'No. Lo que funciona y nadie discute se deja: una hoja de ruta que lo toca todo es una que no se va a ejecutar.' },
      { pregunta: '¿Cómo sé si sirvió?', respuesta: 'Porque se define antes qué número tiene que moverse, y se mide antes y después. Sin eso hubo gasto, no transformación.' },
      { pregunta: '¿Y la resistencia del equipo?', respuesta: 'Es el bloqueo real, no la tecnología. Quien lleva quince años haciéndolo de una forma tiene motivos, y si no se escuchan vuelve a su método en dos meses.' },
      { pregunta: '¿Tienen que implantar su plataforma?', respuesta: 'No. Si lo que tienes sirve, se arregla; nuestra plataforma es una opción, no la conclusión del diagnóstico.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'capacitacion-ti-e-ia',
    nombre: 'Capacitación en TI e IA',
    subtitulo: 'Para que el equipo use lo que la empresa compró',
    color: '#c084fc',
    resumen: 'Formación en el ERP implantado y en herramientas de Inteligencia Artificial, con los datos y los procesos de tu propia empresa. No un curso genérico.',

    heroTitulo: 'El software que nadie sabe usar es dinero parado',
    heroBajada: 'Formación en el sistema que tienes y en las herramientas de IA que puedes empezar a usar mañana — con tus propios datos y tus propios casos, no con los ejemplos del fabricante.',

    problema: {
      titulo: 'Se compra la herramienta y no se compra saber usarla',
      texto: 'La partida de formación es la primera que se recorta y la que más caro sale. El sistema se implanta, se da una charla de dos horas, y a los seis meses la empresa usa el 20 % de lo que pagó — mientras el otro 80 % sigue haciéndose a mano al lado.',
      puntos: [
        'Se usa el 20 % de lo que se pagó',
        'La formación fue una charla de dos horas',
        'Solo una persona sabe usarlo de verdad',
        'Los cursos genéricos no hablan de tu caso',
        'Quien se forma se va y el conocimiento con él',
        'Se pide soporte por cosas que el sistema ya resuelve',
      ],
    },

    beneficios: [
      { titulo: 'Con tus datos y tus casos', descripcion: 'Se practica sobre tu propia operación, no sobre el ejemplo del fabricante. Lo que se aprende así se usa al día siguiente.' },
      { titulo: 'Por puesto, no por temario', descripcion: 'Quien factura no necesita lo mismo que quien contabiliza. Un curso igual para todos aburre a la mitad y pierde a la otra.' },
      { titulo: 'IA que se puede usar mañana', descripcion: 'Herramientas concretas aplicadas al trabajo real de cada área, con sus límites explicados: qué hacen bien y dónde no hay que confiarse.' },
      { titulo: 'Más de una persona formada', descripcion: 'Que solo uno sepa usar el sistema es un riesgo operativo. La formación cubre al suplente desde el principio.' },
      { titulo: 'Material que queda', descripcion: 'Para quien entre después. Sin eso, cada incorporación repite la formación entera o aprende por imitación.' },
      { titulo: 'Se mide con el soporte', descripcion: 'Si después de formar bajan las consultas básicas, funcionó. Es la medida menos discutible que hay.' },
    ],

    cifras: [
      { valor: 'Tus datos', etiqueta: 'se practica sobre tu operación' },
      { valor: 'Por puesto', etiqueta: 'no el mismo curso para todos' },
      { valor: '+1', etiqueta: 'siempre hay un suplente formado' },
    ],

    detalles: [
      { titulo: 'La formación antes de usarlo no se retiene', descripcion: 'Lo que se enseña sin un problema real delante se olvida en días. Conviene formar cuando ya hay algo que resolver.' },
      { titulo: 'Explicar los límites de la IA es parte del curso', descripcion: 'Un equipo que confía de más en una herramienta que se equivoca a veces produce errores con aspecto de certeza.' },
      { titulo: 'El que ya lo sabe todo es el que más enseña', descripcion: 'Formar a quien ya domina el sistema para que forme a los demás es lo que hace que el conocimiento se quede en la empresa.' },
      { titulo: 'La ayuda del sistema también se enseña', descripcion: 'Saber que cada pantalla explica lo que hace evita la mitad de las consultas: mucha gente no sabe que ese panel existe.' },
      { titulo: 'Sesiones cortas y repetidas', descripcion: 'Una jornada entera satura. Varias sesiones cortas con trabajo real entre medias retienen mucho más.' },
      { titulo: 'Se forma también a quien no quiere', descripcion: 'La resistencia casi siempre es miedo a quedar mal delante del equipo. Un grupo pequeño y sin público lo resuelve.' },
    ],

    pasos: [
      { titulo: 'Qué usa cada puesto', descripcion: 'Se define el temario por rol, no uno para todos.' },
      { titulo: 'Sesiones sobre tu operación', descripcion: 'Con tus datos, tus casos y trabajo real entre sesiones.' },
      { titulo: 'Material y medición', descripcion: 'Queda el material, y se mira si bajan las consultas básicas.' },
    ],

    publico: [
      { titulo: 'Implantaste un sistema', descripcion: 'Y el equipo usa una parte pequeña.' },
      { titulo: 'Quieres empezar con IA', descripcion: 'Y no sabes por dónde ni con qué límites.' },
      { titulo: 'Tienes rotación', descripcion: 'Y cada salida se lleva el conocimiento.' },
    ],

    faq: [
      { pregunta: '¿Es un curso genérico?', respuesta: 'No: se hace con tus datos, tus procesos y tus casos. Lo que se aprende sobre el ejemplo del fabricante se olvida en días.' },
      { pregunta: '¿Forman en el ERP que ya tengo?', respuesta: 'Sí, sea el nuestro, Softland, Profit u ODOO.' },
      { pregunta: '¿Qué enseñan de IA?', respuesta: 'Herramientas aplicables al trabajo real de cada área, y sobre todo sus límites: dónde ayudan y dónde no hay que confiarse.' },
      { pregunta: '¿Cuánto dura?', respuesta: 'Preferimos sesiones cortas repetidas, con trabajo real entre medias: una jornada entera satura y se retiene poco.' },
      { pregunta: '¿Queda material?', respuesta: 'Sí, para quien entre después. Sin eso, cada incorporación repite la formación o aprende por imitación.' },
      { pregunta: '¿Cómo se mide que sirvió?', respuesta: 'Con el soporte: si bajan las consultas básicas después de formar, funcionó. Es la medida menos discutible.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'consultoria-contable',
    nombre: 'Consultoría contable',
    subtitulo: 'Contabilidad integrada con tus sistemas',
    color: '#2dd4bf',
    resumen: 'Asesoría contable y financiera conectada con tu operación: procesos, reportes fiscales y análisis para decidir con números reales y a tiempo.',

    heroTitulo: 'Números que llegan a tiempo para decidir con ellos',
    heroBajada: 'Asesoría contable y financiera integrada con tus sistemas: que el cierre no tarde dos meses, que los reportes fiscales salgan de la operación y que los estados sirvan para decidir, no solo para presentar.',

    problema: {
      titulo: 'La contabilidad que solo sirve para declarar',
      texto: 'En muchas empresas la contabilidad va dos meses por detrás y existe únicamente para cumplir con el fisco. Cuando el estado de resultados llega, la decisión que dependía de él ya se tomó a ojo — y nadie puede explicar por qué el margen bajó, porque el dato llega agregado y tarde.',
      puntos: [
        'El cierre llega dos meses tarde',
        'Los estados solo sirven para declarar',
        'No se sabe qué producto o área deja margen',
        'Los reportes fiscales se arman a mano contra el plazo',
        'La contabilidad y la operación no cuadran',
        'Nadie puede explicar por qué bajó el resultado',
      ],
    },

    beneficios: [
      { titulo: 'El cierre deja de ser recapturar', descripcion: 'Si la contabilidad se alimenta de la operación, cerrar el mes es revisar y no volver a teclear. Ahí es donde se ganan las semanas.' },
      { titulo: 'Reportes fiscales desde el dato', descripcion: '606, 607, 608, 609 y el IT-1 generados desde lo registrado y cuadrados contra los estados, en vez de armados aparte contra reloj.' },
      { titulo: 'Resultado por área y por producto', descripcion: 'Con centros de costo bien definidos se sabe qué gana dinero y qué no. Un resultado global solo dice que algo pasa.' },
      { titulo: 'Los auxiliares cuadrados', descripcion: 'La cartera contra su cuenta, el inventario contra la suya. Es la comprobación que dice si la contabilidad describe la realidad.' },
      { titulo: 'Análisis para decidir', descripcion: 'Margen, punto de equilibrio, flujo y estructura de costos, explicados en términos del negocio y no de la partida contable.' },
      { titulo: 'Preparación para auditoría', descripcion: 'Con los papeles ordenados y el respaldo de cada número localizable. Una auditoría con la casa en orden cuesta la mitad.' },
    ],

    cifras: [
      { valor: 'Del dato', etiqueta: 'los reportes fiscales, no a mano' },
      { valor: 'Por área', etiqueta: 'el resultado, no solo el global' },
      { valor: 'Cuadrado', etiqueta: 'cada auxiliar contra su cuenta' },
    ],

    detalles: [
      { titulo: 'Un cierre tardío no es un problema contable', descripcion: 'Es un problema de decisión: los números llegan cuando ya se decidió sin ellos. Por eso se ataca el recapture, no la velocidad de teclear.' },
      { titulo: 'El centro de costo solo mide lo que se imputa', descripcion: 'Si la mitad de los gastos van sin asignar, el resultado por área es una ficción. Lo primero es medir cuánto queda fuera.' },
      { titulo: 'El 607 tiene que cuadrar con el resultado', descripcion: 'Si la venta declarada y la contabilizada no coinciden, una de las dos está mal — y las dos se presentaron.' },
      { titulo: 'La provisión sin reversa cuenta dos veces', descripcion: 'Se reconoce el gasto estimado y después llega la factura. Si la provisión no se revierte, el resultado del mes miente.' },
      { titulo: 'La contabilidad fiscal y la de gestión difieren', descripcion: 'Y es normal. El problema es cuando nadie sabe en cuánto ni por qué: esa diferencia hay que poder explicarla.' },
      { titulo: 'Conviene decidir qué se externaliza', descripcion: 'Llevar la contabilidad completa fuera es cómodo hasta que hace falta un número rápido. La frontera se define al principio.' },
    ],

    pasos: [
      { titulo: 'Revisión de lo que hay', descripcion: 'Procesos, plan de cuentas, cierres y lo que cuadra y lo que no.' },
      { titulo: 'Conectar con la operación', descripcion: 'Que los asientos salgan de las ventas, compras y nómina.' },
      { titulo: 'Cerrar rápido y analizar', descripcion: 'Cierre en días, reportes fiscales desde el dato y análisis útil.' },
    ],

    publico: [
      { titulo: 'Tu cierre tarda meses', descripcion: 'Y decides sin los números.' },
      { titulo: 'Declaras cada mes', descripcion: 'Y los formatos se arman a mano.' },
      { titulo: 'No sabes qué te deja margen', descripcion: 'Porque solo ves el resultado global.' },
    ],

    faq: [
      { pregunta: '¿Llevan la contabilidad o asesoran?', respuesta: 'Las dos cosas, y conviene decidir la frontera al principio: externalizarla del todo es cómodo hasta que hace falta un número rápido.' },
      { pregunta: '¿Trabajan con mi sistema actual?', respuesta: 'Sí. Y si el problema es que la contabilidad recaptura todo a mano, ahí es donde se ganan las semanas.' },
      { pregunta: '¿Generan los reportes de la DGII?', respuesta: 'Sí: 606, 607, 608, 609 y el IT-1, desde lo registrado y cuadrados contra los estados del mismo período.' },
      { pregunta: '¿Pueden decirme qué producto deja margen?', respuesta: 'Sí, con centros de costo bien definidos. Lo primero es medir cuánto gasto queda sin imputar, porque eso decide si el reporte sirve.' },
      { pregunta: '¿Ayudan en una auditoría?', respuesta: 'Sí, con la preparación previa: una auditoría con los papeles ordenados y cada número localizable cuesta la mitad.' },
      { pregunta: '¿Y si mi contabilidad no cuadra con la operación?', respuesta: 'Es lo primero que se mira: la cartera contra su cuenta, el inventario contra la suya. Esa comparación dice si los estados describen la realidad.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'marketing-digital',
    nombre: 'Marketing digital',
    subtitulo: 'Se mide el resultado, no las impresiones',
    color: '#f472b6',
    resumen: 'Posicionamiento, campañas y analítica con una regla: lo que se reporta es lo que te entra, no cuánta gente vio un anuncio.',

    heroTitulo: 'Las impresiones no pagan la nómina',
    heroBajada: 'Posicionamiento, campañas y analítica conectada con tu operación, para saber qué canal trae los clientes que compran — no cuántos vieron el anuncio.',

    problema: {
      titulo: 'El informe está lleno de números que no significan nada',
      texto: 'Alcance, impresiones, interacciones: métricas que suben cuando se gasta más y que no dicen si entró un cliente. Sin conectar la campaña con la venta real, la decisión de dónde invertir se toma con lo que se puede medir fácil, no con lo que importa.',
      puntos: [
        'El informe habla de alcance y no de ventas',
        'No se sabe qué canal trae clientes que compran',
        'La web recibe visitas y no genera contactos',
        'Se invierte en el canal que más ruido hace',
        'El contacto llega y nadie le da seguimiento',
        'No aparecemos cuando alguien busca lo que vendemos',
      ],
    },

    beneficios: [
      { titulo: 'Se mide hasta la venta', descripcion: 'La campaña se conecta con tu CRM: qué fuente trajo el contacto y cuál acabó comprando. Esa es la única cifra que decide dónde invertir.' },
      { titulo: 'Posicionamiento en buscadores', descripcion: 'Que aparezcas cuando alguien busca lo que vendes. Es tráfico que no se paga por clic y que no se apaga al parar la campaña.' },
      { titulo: 'Campañas con presupuesto controlado', descripcion: 'Se empieza pequeño, se mide, y se amplía solo lo que devuelve. No al revés.' },
      { titulo: 'La web convierte, no solo se ve', descripcion: 'Una web bonita que no genera contactos es un folleto caro. Se trabaja sobre lo que hace que alguien escriba.' },
      { titulo: 'Contenido que responde lo que preguntan', descripcion: 'Lo que tus clientes buscan antes de comprar. Contestarlo bien atrae mejor que cualquier anuncio.' },
      { titulo: 'Conectado con el seguimiento', descripcion: 'Un contacto que llega y nadie atiende es dinero tirado dos veces. La campaña entra al CRM con su fuente.' },
    ],

    cifras: [
      { valor: 'Hasta la venta', etiqueta: 'la medición, no hasta el clic' },
      { valor: 'Por fuente', etiqueta: 'qué canal trae quien compra' },
      { valor: 'Controlado', etiqueta: 'se amplía lo que devuelve' },
    ],

    detalles: [
      { titulo: 'El alcance sube con el gasto, siempre', descripcion: 'Por eso es la métrica favorita de los informes que no quieren que mires el resultado. Sirve para comparar creatividades, no para justificar inversión.' },
      { titulo: 'Sin CRM no se puede atribuir la venta', descripcion: 'Hay que poder seguir el contacto hasta que compra. Si el seguimiento vive en la cabeza del vendedor, la medición se corta en el clic.' },
      { titulo: 'El posicionamiento tarda y dura', descripcion: 'La campaña de pago da tráfico mañana y se apaga al parar; el posicionamiento tarda meses y se queda. Conviene hacer los dos, sabiéndolo.' },
      { titulo: 'La velocidad de respuesta decide la venta', descripcion: 'Un contacto atendido en minutos convierte mucho más que uno atendido al día siguiente. Suele ser el mayor margen de mejora, y es gratis.' },
      { titulo: 'Un contacto malo cuesta igual que uno bueno', descripcion: 'Por eso se mide la calidad y no solo la cantidad: una campaña que trae cien contactos que no compran es peor que una que trae diez.' },
      { titulo: 'No todos los canales sirven a todos', descripcion: 'En B2B, una red social puede no traer un solo cliente. Se prueba con presupuesto pequeño antes de creerse la regla general.' },
    ],

    pasos: [
      { titulo: 'Qué vendes y a quién', descripcion: 'Y cómo te busca hoy quien te compra.' },
      { titulo: 'Medición antes de invertir', descripcion: 'Conectar la campaña con el CRM: sin eso, no hay atribución.' },
      { titulo: 'Probar, medir, ampliar', descripcion: 'Presupuesto pequeño primero; se amplía lo que devuelve.' },
    ],

    publico: [
      { titulo: 'Inviertes y no sabes si sirve', descripcion: 'Porque el informe habla de alcance.' },
      { titulo: 'Nadie te encuentra buscando', descripcion: 'Lo que vendes, en tu ciudad.' },
      { titulo: 'Recibes contactos', descripcion: 'Y se pierden sin seguimiento.' },
    ],

    faq: [
      { pregunta: '¿Qué métricas reportan?', respuesta: 'Las que llegan hasta la venta: contactos por fuente y cuáles compraron. El alcance sube siempre que se gasta más, así que no justifica nada.' },
      { pregunta: '¿Hace falta tener CRM?', respuesta: 'Para atribuir la venta, sí: hay que poder seguir el contacto hasta que compra. Si no lo tienes, se monta — el módulo está en la plataforma.' },
      { pregunta: '¿Cuánto tarda el posicionamiento?', respuesta: 'Meses, y por eso se combina con campañas de pago, que dan tráfico mañana pero se apagan al parar.' },
      { pregunta: '¿Con qué presupuesto se empieza?', respuesta: 'Con uno pequeño y medido. Se amplía lo que devuelve, no al revés.' },
      { pregunta: '¿Trabajan la web también?', respuesta: 'Sí: una web que recibe visitas y no genera contactos es un folleto caro.' },
      { pregunta: '¿Sirve para B2B?', respuesta: 'Depende del canal, y se prueba antes de asumirlo: en B2B una red social puede no traer un solo cliente mientras el posicionamiento sí.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'consultoria-electoral',
    nombre: 'Consultoría electoral',
    subtitulo: 'Estrategia de campaña basada en datos',
    color: '#f87171',
    resumen: 'Percepción ciudadana, inteligencia de mercado electoral y monitoreo de tendencias, con metodología declarada y márgenes de error publicados.',

    heroTitulo: 'Decidir la campaña con datos, no con la sensación del entorno',
    heroBajada: 'Medición de percepción ciudadana, inteligencia de mercado electoral y monitoreo de tendencias, con la metodología y el margen de error siempre declarados.',

    problema: {
      titulo: 'La campaña que se decide en la reunión del comando',
      texto: 'Sin medición, la estrategia sale de lo que oyó el equipo en la calle y de lo que dice la gente que ya vota por ti. Es el sesgo más caro que existe en una campaña: se invierte donde ya se gana y se descuida donde se pierde, y se descubre el día de la elección.',
      puntos: [
        'La estrategia sale de lo que oyó el comando',
        'Se mide solo entre quienes ya te apoyan',
        'No se sabe qué mueve al indeciso',
        'El recurso se invierte donde ya se gana',
        'Se reacciona tarde a un cambio de tendencia',
        'Se contratan encuestas sin saber si el muestreo es serio',
      ],
    },

    beneficios: [
      { titulo: 'Metodología declarada', descripcion: 'Muestra, método, fechas y margen de error, siempre. Una encuesta sin ficha técnica no es un dato: es una opinión con números.' },
      { titulo: 'Percepción por segmento', descripcion: 'El promedio esconde lo que importa. Qué piensa cada grupo y qué lo mueve es lo que permite decidir dónde invertir.' },
      { titulo: 'Seguimiento de tendencia', descripcion: 'Una medición es una foto; varias son una película. El cambio entre mediciones dice más que el número de cualquiera de ellas.' },
      { titulo: 'Qué mueve al indeciso', descripcion: 'La elección se decide ahí, no entre quienes ya decidieron. Medirlo aparte es lo que cambia la estrategia.' },
      { titulo: 'Monitoreo de la conversación', descripcion: 'Qué se dice y dónde, para reaccionar a tiempo. Una tendencia detectada tarde ya no se corrige, se gestiona.' },
      { titulo: 'Confidencialidad', descripcion: 'El dato de campaña es sensible por definición. El manejo de la información es parte del servicio, no un anexo.' },
    ],

    cifras: [
      { valor: 'Ficha técnica', etiqueta: 'en cada medición, sin excepción' },
      { valor: 'Por segmento', etiqueta: 'no el promedio, que esconde' },
      { valor: 'Tendencia', etiqueta: 'varias mediciones, no una foto' },
    ],

    detalles: [
      { titulo: 'Sin ficha técnica no es una encuesta', descripcion: 'Muestra, método, fechas y margen. Un número sin eso no se puede comparar con otro ni defender ante nadie.' },
      { titulo: 'El margen de error decide si hay diferencia', descripcion: 'Dos candidatos separados por menos del margen están empatados, aunque el titular diga otra cosa. Interpretarlo mal cambia la estrategia.' },
      { titulo: 'Medir solo entre los tuyos confirma lo que crees', descripcion: 'Es el sesgo más caro de una campaña, y el más fácil de cometer sin darse cuenta: la muestra tiene que representar al electorado.' },
      { titulo: 'La pregunta mal formulada inclina la respuesta', descripcion: 'Se puede obtener el resultado que se quiera cambiando cómo se pregunta. Por eso el cuestionario se revisa y se publica.' },
      { titulo: 'Una medición no es una tendencia', descripcion: 'Comparar con la anterior, con la misma metodología, es lo único que permite decir que algo se mueve.' },
      { titulo: 'El dato incómodo es el más valioso', descripcion: 'Una consultora que solo entrega buenas noticias no está midiendo, está acompañando. Se informa lo que sale.' },
    ],

    pasos: [
      { titulo: 'Diseño del estudio', descripcion: 'Qué se quiere saber, a quién se pregunta y con qué método.' },
      { titulo: 'Campo y procesamiento', descripcion: 'Levantamiento, control de calidad y análisis estadístico.' },
      { titulo: 'Lectura estratégica', descripcion: 'Qué significa para la campaña y qué conviene hacer con ello.' },
    ],

    publico: [
      { titulo: 'Preparas una campaña', descripcion: 'Y decides con la sensación del entorno.' },
      { titulo: 'Contratas encuestas', descripcion: 'Y no sabes si el muestreo es serio.' },
      { titulo: 'Necesitas medir percepción', descripcion: 'De una gestión o de una propuesta.' },
    ],

    faq: [
      { pregunta: '¿Publican la metodología?', respuesta: 'Siempre: muestra, método, fechas y margen de error. Una encuesta sin ficha técnica no es un dato.' },
      { pregunta: '¿Cómo sé si una diferencia es real?', respuesta: 'Comparándola con el margen de error: dos candidatos separados por menos que el margen están empatados, aunque el titular diga otra cosa.' },
      { pregunta: '¿Miden también percepción de gestión?', respuesta: 'Sí, no solo intención de voto: percepción de gestión, de propuestas y de imagen, por segmento.' },
      { pregunta: '¿Hacen seguimiento en el tiempo?', respuesta: 'Sí, y es lo más útil: una medición es una foto, y lo que decide la estrategia es el cambio entre mediciones con la misma metodología.' },
      { pregunta: '¿Y si el resultado no me gusta?', respuesta: 'Se informa igual. Una consultora que solo entrega buenas noticias no está midiendo.' },
      { pregunta: '¿Cómo manejan la confidencialidad?', respuesta: 'Como parte del servicio y no como anexo: el dato de campaña es sensible por definición.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'encuestas-y-estudios-de-mercado',
    nombre: 'Encuestas y estudios de mercado',
    subtitulo: 'Investigación, censos y procesamiento estadístico',
    color: '#38bdf8',
    resumen: 'Investigación de opinión, censos, muestreos y procesamiento estadístico para el sector público y privado, con metodología declarada y datos entregados en crudo.',

    heroTitulo: 'Preguntar bien es más difícil —y más barato— que decidir mal',
    heroBajada: 'Investigación de opinión, estudios de mercado, censos y procesamiento estadístico. Con la metodología declarada, el margen publicado y los datos en crudo entregados.',

    problema: {
      titulo: 'Se decide con lo que dicen los clientes que ya tienes',
      texto: 'Es la muestra más accesible y la más sesgada: quienes ya te compran te dirán por qué les gusta lo que haces. Los que no te eligieron —que son los que explican por qué no creces— no están en esa conversación, y una decisión de producto o de precio tomada así sale cara.',
      puntos: [
        'Se pregunta solo a quien ya te compra',
        'La encuesta la arma quien quiere un resultado',
        'No se sabe si la muestra representa algo',
        'Los datos llegan procesados y no se pueden revisar',
        'El estudio llega cuando la decisión ya se tomó',
        'Nadie sabe leer un margen de error',
      ],
    },

    beneficios: [
      { titulo: 'Diseño muestral que representa', descripcion: 'A quién hay que preguntar para que el resultado signifique algo. Es la decisión que más determina si el estudio sirve.' },
      { titulo: 'Cuestionario neutral', descripcion: 'Se puede obtener casi cualquier resultado cambiando cómo se pregunta. Por eso el cuestionario se revisa y se entrega con el informe.' },
      { titulo: 'Campo con control de calidad', descripcion: 'Verificación de entrevistas y supervisión. Sin eso, un levantamiento puede estar inventado en parte y el análisis no lo detecta.' },
      { titulo: 'Procesamiento estadístico', descripcion: 'Cruces, significancia y segmentación, no solo porcentajes. Lo que importa suele estar en el cruce, no en el total.' },
      { titulo: 'Te entregamos los datos en crudo', descripcion: 'Además del informe. Quien solo entrega conclusiones te pide que confíes; con los datos, cualquiera puede comprobarlas.' },
      { titulo: 'Público y privado', descripcion: 'Estudios de mercado, satisfacción, clima laboral, censos y evaluación de programas, con el rigor que cada uno exige.' },
    ],

    cifras: [
      { valor: 'Representativa', etiqueta: 'la muestra, diseñada para serlo' },
      { valor: 'En crudo', etiqueta: 'los datos, además del informe' },
      { valor: 'Verificado', etiqueta: 'el campo, con supervisión' },
    ],

    detalles: [
      { titulo: 'La muestra decide si el estudio sirve', descripcion: 'Mil respuestas mal repartidas valen menos que trescientas bien diseñadas. El tamaño impresiona; lo que importa es a quién representa.' },
      { titulo: 'El orden de las preguntas influye', descripcion: 'Lo que se pregunta antes condiciona lo que se responde después. Es un efecto medible y por eso el cuestionario se ordena con criterio.' },
      { titulo: 'La no respuesta también es un dato', descripcion: 'Si un grupo responde mucho menos, el resultado se inclina sin que nadie lo vea. Se mide y se corrige, o se declara.' },
      { titulo: 'El cruce dice más que el total', descripcion: 'Un 60 % global puede esconder un 90 % en un segmento y un 20 % en otro. La decisión suele estar ahí.' },
      { titulo: 'Un estudio tardío no sirve', descripcion: 'El plazo es parte del diseño: si llega después de la decisión, el rigor da igual. Conviene acotar el alcance para llegar a tiempo.' },
      { titulo: 'Quien no entrega los datos, pide fe', descripcion: 'Con el crudo, sus conclusiones se pueden comprobar. Sin él, hay que creerlas.' },
    ],

    pasos: [
      { titulo: 'Qué se quiere saber', descripcion: 'La pregunta de negocio primero; el instrumento después.' },
      { titulo: 'Diseño y campo', descripcion: 'Muestra, cuestionario, levantamiento y control de calidad.' },
      { titulo: 'Análisis y entrega', descripcion: 'Informe con lectura, más los datos en crudo.' },
    ],

    publico: [
      { titulo: 'Vas a lanzar algo', descripcion: 'Y necesitas saber si hay mercado.' },
      { titulo: 'Quieres medir satisfacción', descripcion: 'De clientes o del propio equipo.' },
      { titulo: 'Eres sector público', descripcion: 'Y necesitas evaluar un programa con rigor.' },
    ],

    faq: [
      { pregunta: '¿Cuántas encuestas hacen falta?', respuesta: 'Depende de a quién representan, no del número: mil mal repartidas valen menos que trescientas bien diseñadas.' },
      { pregunta: '¿Entregan los datos en crudo?', respuesta: 'Sí, además del informe. Quien solo entrega conclusiones te pide que confíes; con el crudo se pueden comprobar.' },
      { pregunta: '¿Cómo garantizan que el campo es real?', respuesta: 'Con verificación de entrevistas y supervisión. Sin control de calidad, un levantamiento puede estar inventado en parte y el análisis no lo detecta.' },
      { pregunta: '¿Trabajan con el sector público?', respuesta: 'Sí: censos, evaluación de programas y estudios de opinión, con el rigor y la trazabilidad que exige.' },
      { pregunta: '¿Cuánto tardan?', respuesta: 'El plazo se define al principio, porque es parte del diseño: un estudio que llega después de la decisión no sirve por muy riguroso que sea.' },
      { pregunta: '¿Ayudan a interpretarlo?', respuesta: 'Sí, y es donde está el valor: el total suele esconder lo importante, que aparece al cruzar por segmento.' },
    ],
  },
]
