# Blueprint — Inteligencia de Clientes (`inteligencia`)

> Slug `inteligencia` · prefijo `intel_*` · **vive dentro del módulo CRM** ·
> requiere `crm` contratado · se vende solo en plan anual.
> Reglas comunes en `00_LEEME.md`.

---

## Objetivo

Que el vendedor sepa **a quién llamar hoy y por qué**, en vez de recorrer una lista por
fecha donde un cliente que compra todos los meses y otro que lleva medio año sin aparecer
se ven exactamente igual.

---

## ⚠️ Lo que este módulo NO hace

El CRM ya tiene pipeline de leads, contactos, estados de gestión, presupuesto por vendedor
y reportes. Y la **bitácora de clientes** (`[#986]`) ya registra automáticamente cada
factura, pedido, cobro, nota y tarea en `cliente_actividades`, actualizando
`cliente_gestion.ultima_interaccion` sin que nadie tenga que acordarse de pulsar nada.

Este módulo **no duplica nada de eso**: lo lee y lo convierte en una decisión.

| Ya existe | Este módulo aporta |
|---|---|
| `cliente_gestion` con categoría, prioridad y última interacción | Un **score** calculado, no asignado a mano |
| `cliente_actividades` (bitácora automática) | La **señal**: qué cambió y desde cuándo |
| Kanban de gestión comercial | El **orden**: a quién atender primero |
| Notas y tareas por cliente | Tareas **generadas solas** cuando el score cae |

---

## ANEXO B — Dependencias

⚠️ Reverificar con `git log` antes de implementar.

| Se necesita | Estado | Nota |
|---|---|---|
| `clientes` | ✅ | UUID. ⚠️ está en `App\Models\Cliente`, **no** en `App\Models\Tablas\` |
| `cliente_gestion` | ✅ `[#955]` | Categoría, prioridad, objetivo mensual, `ultima_interaccion` |
| `cliente_actividades` + `ClienteActividadService` | ✅ `[#986]` | ⚠️ **el registro ya es automático**: este módulo lee, no vuelve a registrar |
| `cliente_notas`, `cliente_tareas` | ✅ `[#988]` | Los workflows crean tareas **aquí**, no en una tabla propia |
| Historial de compras | ✅ `fact_facturas` + `fact_factura_lineas` | Base de las recomendaciones |
| Pagos tardíos | ✅ `cxc_documentos`, `cxc_cobros` | ⚠️ la fecha del cobro es `fecha_cobro`, **no** `created_at` (defecto de `[PRE-F4-2a]`) |
| Artículos | ✅ `inv_articulos` | **bigint** |
| WhatsApp | ✅ `WhatsAppService` | Transversal, por empresa (`[#1466]`) |
| Motor de aprobaciones | ✅ `ApprovalEngine` | Solo si una acción del workflow lo requiere |

---

## Modelo de datos (5 tablas, prefijo `intel_`)

### `intel_config`
Una fila por empresa. Pesos del score y umbrales.

`peso_frecuencia` · `peso_recencia` · `peso_pago` · `peso_ticket` · `peso_nps`
(decimal(5,2), suman 100) · `umbral_riesgo` smallint default 40 · `umbral_promotor`
smallint default 70 · `dias_sin_contacto_alerta` smallint **default 0 = apagado** ·
`ultima_ejecucion` timestamp null.

⚠️ **Los pesos son del negocio, no del sistema.** Para un mayorista la frecuencia manda;
para uno de proyectos, el ticket. Fijarlos en el código daría un score que no significa lo
mismo en dos empresas y nadie podría explicarlo.

### `intel_scores`
UNIQUE `(company_id, empresa_id, cliente_id, fecha_calculo)`.

`cliente_id` char(36) · `fecha_calculo` date · `score` tinyint (0-100) ·
`etiqueta` enum(`riesgo`,`neutro`,`promotor`) · `desglose` json ·
`reglas_snapshot` json.

⚠️ **`reglas_snapshot` no es opcional.** Guarda los pesos con los que se calculó. Sin él,
cambiar la configuración reescribiría el significado de todo el histórico: un cliente
marcado «en riesgo» en marzo pasaría a parecer sano sin que nada hubiera cambiado en su
comportamiento. Es la lección de `[PRE-F1-2]`.

⚠️ **`desglose` tampoco.** Un score de 38 sin decir qué componente lo hundió no es
accionable: el vendedor necesita saber si es que dejó de comprar o que paga tarde, porque
la llamada es distinta.

### `intel_recomendaciones`
`cliente_id` · `articulo_id` bigint · `motivo` varchar(255) · `confianza` decimal(5,2) ·
`estado` enum(`sugerida`,`aceptada`,`descartada`) · `fecha_calculo`.

⚠️ El motivo se guarda **en texto legible** («compró A y B, y quien compra A y B suele
llevar C»). Una recomendación sin motivo es un artículo al azar y el vendedor no la usa.

### `intel_nps`
`cliente_id` · `score` tinyint (0-10) · `comentario` text · `canal`
enum(`email`,`whatsapp`,`manual`) · `respondido_at` · `campana_id` nullable.

⚠️ NPS estándar: 0-6 detractor, 7-8 pasivo, 9-10 promotor. Se declara en el código porque
un rango distinto cambia el resultado sin que se note.

### `intel_workflows`
`evento` varchar(60) (`score_bajo`, `nps_detractor`, `sin_contacto`, `cliente_recuperado`) ·
`accion` varchar(60) (`crear_tarea`, `notificar_vendedor`, `whatsapp`, `cambiar_prioridad`) ·
`payload` json · `activo` boolean **default false**.

⚠️ **Nacen apagados.** Encender un workflow de WhatsApp empieza a escribirle a los clientes
desde el número de la empresa; eso no puede pasar por instalar el módulo. La pantalla trae
una **simulación** que muestra el mensaje exacto antes de activar nada (patrón de
`[PRE-F3-3]`).

---

## El score — fórmula declarada

```
score = Σ (componente_normalizado × peso) / 100

frecuencia  → compras del período / compras esperadas según su categoría
recencia    → días desde la última compra, invertido
pago        → % de facturas pagadas dentro del plazo
ticket      → ticket promedio contra su propio histórico
nps         → última respuesta NPS, si existe
```

⚠️ **Un componente sin dato NO cuenta como cero: se excluye y los pesos se renormalizan.**
Un cliente que nunca respondió una encuesta no es un cliente insatisfecho, y tratarlo como
0 lo empujaría a «riesgo» por no haber contestado un correo.

⚠️ **Sin historial suficiente no hay score: hay «sin datos».** Un cliente nuevo con una
compra no puede puntuarse; mostrarle un 50 sería inventar una medición.

---

## Fases

### F0 — Base y golden master
Suite propia. Congela que el CRM sigue funcionando igual sin este módulo, y que
`ClienteActividadService` **no se toca** (lo consume, no lo modifica).

### F1 — Scoring
`ScoringService` + comando `inteligencia:calcular-scores` (nocturno). ⚠️ **No es un bucle
por cliente**: con 2.000 clientes serían miles de consultas (N+1 de `[PRE-F4-1]`). Se agrega
una vez y se resuelve en memoria. Badge de color en la ficha del cliente y en el kanban de
gestión, con el desglose al pasar el ratón… **y también al tocar** — en una tablet no hay
hover (lección de `[REST-F0-4]`).

### F2 — Recomendaciones
`RecomendacionService`: asociación de productos comprados juntos sobre `fact_factura_lineas`.
Sección «Productos recomendados» en la ficha con botón «Agregar a oportunidad».
⚠️ **Se excluye lo que el cliente ya compra habitualmente**: recomendar lo que ya lleva
todos los meses hace que el vendedor deje de mirar el panel.

### F3 — Voz del Cliente (NPS)
Captura manual + envío por email/WhatsApp con enlace público firmado. Tendencia mensual y
desglose promotores/pasivos/detractores. ⚠️ **El envío nace apagado** y respeta el opt-out
que ya existe en la ficha del cliente (`recibe_recordatorios_*`).

### F4 — Motor de workflows
`WorkflowEngine` escucha eventos y ejecuta acciones. ⚠️ **Idempotente por día y por cliente**:
sin eso, un cliente en riesgo generaría una tarea nueva cada noche y el vendedor acabaría
ignorando la bandeja entera. Las tareas se crean en `cliente_tareas` (la tabla que ya existe),
no en una propia.

### Cierre
Aceptación end-to-end: cliente que deja de comprar → baja el score → cambia a «riesgo» →
el workflow crea la tarea → el vendedor la ve en el kanban → registra la visita → sube el
score. Un solo cliente recorrido de punta a punta: ahí aparecen los defectos que las fases
por separado no ven.

---

## TODOs de verificación humana

1. ⚠️ Definir los **pesos** con ventas y servicio: los defaults son una propuesta, no una norma.
2. Confirmar los umbrales 40/70 con datos reales antes de encender alertas.
3. ⚠️ Revisar la privacidad del NPS: el comentario puede traer datos personales, y decidir
   quién puede leerlo.
4. Decidir si el score se muestra al cliente en el portal — hoy **no** se muestra.
