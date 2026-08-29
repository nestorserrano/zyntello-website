# Blueprint — Gestor Inteligente de Inventarios (`abastecimiento`)

> Slug `abastecimiento` · prefijo `abst_*` · **vive dentro del módulo Inventario** ·
> requiere `inventario` contratado · se vende solo en plan anual.
> Reglas comunes en `00_LEEME.md`.

---

## Objetivo

Responder tres preguntas que hoy nadie contesta con datos: **¿cuánto se va a vender?**,
**¿cuánto conviene pedir?** y **¿para cuántos días alcanza?**

---

## ⚠️ Lo que este módulo NO hace — y por qué importa

El blueprint original pedía crear `items`, `warehouses`, `stock_levels`, `stock_movements`,
`lot_serials` y `purchase_suggestions`. **Todo eso ya existe** y está en producción:

| Ya existe | Dónde |
|---|---|
| Artículos y bodegas | `inv_articulos`, `inv_bodegas` |
| Stock por bodega, reservado, costo promedio | `inv_stock`, `inv_costo_promedio`, `inv_cost_layers` |
| Movimientos con costo sellado | `inv_movimientos`, `inv_movimientos_lineas` |
| Lotes y series con FEFO | `inv_lotes`, `inv_seriales`, `LoteService` |
| Punto de reorden y alertas | `ReordenService::getAlertas()`, `inventario:alertas` |
| Sugerido de compra | `SugeridoCompraService` (INV-F5) |
| Kardex, conteo físico, traslados, ensambles | módulo Inventario, F1–F11 |

Crear una segunda copia de esas tablas produciría **dos verdades del stock**: Facturación,
Compras, Restaurante y Car Wash seguirían moviendo `inv_*`, y este módulo mostraría cifras
que se van separando de la realidad sin que nada lo avise. El error se descubre en el
conteo físico, semanas después.

**Este módulo solo lee `inv_*` y escribe sus propios pronósticos y parámetros.**

---

## ANEXO B — Dependencias, RE-VERIFICADAS contra el esquema real (2026-08-12)

⚠️ Se reverificó antes de implementar, como el propio anexo pedía — y **la advertencia se
cumplió otra vez**: de siete dependencias, **dos estaban mal escritas y aparecieron tres
hallazgos que el anexo no contemplaba**. Uno de ellos habría dejado la función principal
del módulo sin disparar ninguna alerta.

| Se necesita | Estado real | Consecuencia |
|---|---|---|
| `inv_stock.cantidad_disponible` | ❌ **NO EXISTE** | La columna es **`cantidad`**. El disponible se **deriva**: `cantidad − cantidad_reservada`. La fórmula de cobertura del blueprint apuntaba a una columna inexistente |
| `inv_stock.cantidad_reservada`, `stock_minimo` | ✅ existen | pero ver el hallazgo 2: son **legacy** |
| `inv_movimientos_lineas.costo_unit_local` | ✅ existe | ⚠️ es `costo_unit_local`, **no** `costo_unitario_local` — confirmado |
| `inv_tipos_transaccion` naturaleza + flag | ✅ existe | ⚠️ el flag es `is_active` — confirmado. `naturaleza` es enum(`entrada`,`salida`,`traslado`,`ajuste`,`ensamble`,`devolucion`) |
| `SugeridoCompraService` (INV-F5) | ✅ existe | El pronóstico lo **alimenta**; no se crea un sugerido paralelo |
| `ReordenService::getAlertas()` | ✅ existe | ⚠️ **pero NO lee `inv_stock`** — ver hallazgo 1 |
| `inv_articulos.uom_base_id` | ✅ existe | ⚠️ es `uom_base_id`; `unidad_medida_id` **no existe** — confirmado |
| Conversión de unidades | ✅ `inv_conversiones_unidad` | Usar `RecetaService::conversor()`; **no** reimplementar |
| `articulo_id` / `bodega_id` | ✅ **bigint unsigned** | confirmado contra `information_schema` |

### ⚠️ Hallazgo 1 — el ROP iba a escribirse donde nadie lo lee

El blueprint decía «aplicar el ROP a `inv_stock.stock_minimo`» y cerrar comprobando que
`ReordenService` dispara con el valor nuevo. **No dispararía**: `ReordenService::getAlertas()`
consulta el modelo `CriterioAbastecimiento` → tabla **`inv_criterios_abastecimiento`**, y de
ahí lee `punto_reorden`, `stock_minimo`, `stock_maximo`, `lote_optimo` y `tiempo_entrega_dias`.
De `inv_stock` solo toma `cantidad`.

Es la forma de defecto de `[PRE-F1]` al revés — allí un control **leía** una columna que nadie
llenaba; aquí el módulo **escribiría** una columna que nadie lee. El resultado es idéntico: una
función que se ve implementada, tiene su botón, su pantalla y su prueba, **y no actúa nunca**.

> **Corregido: el ROP aplicado escribe en `inv_criterios_abastecimiento.punto_reorden`.**

### ⚠️ Hallazgo 2 — `inv_stock.stock_minimo` y `punto_reorden` son LEGACY

`inv_stock` tiene sus propias `stock_minimo`, `stock_maximo` y `punto_reorden`, y existe el
comando `inventario:migrar-min-max` (`MigrarMinMaxInventario`) que **mueve esos valores hacia
`inv_criterios_abastecimiento`**. O sea, el ecosistema ya está sacando ese dato de `inv_stock`.
Escribir ahí sería remar contra la migración en curso y crear **dos verdades del punto de
reorden** — justo lo que este blueprint advierte evitar en su propia introducción.

### ⚠️ Hallazgo 3 — `inv_criterios_abastecimiento` NO tiene `empresa_id`

Solo tiene `company_id`, y el modelo `CriterioAbastecimiento` **no usa `HasEmpresa`**. En un
tenant con dos empresas, `getAlertas($companyId)` trae los criterios de **ambas**; luego el
stock se busca con `Stock` (que sí filtra por empresa), no encuentra el artículo de la otra
empresa y devuelve **0** → `0 <= punto_reorden` → **alerta falsa de quiebre** para todos los
artículos de la empresa ajena.

**Medido en producción (2026-08-12): no está ocurriendo** — hay 5 criterios en 2 tenants y
cada uno tiene **una sola empresa**. Es riesgo latente, no daño activo. Pero este módulo
escribe **una fila por artículo/bodega**, así que multiplica la superficie.

> **Decisión del director técnico: se corrige en la F0**, con migración aditiva + backfill
> (el `empresa_id` se deduce del artículo) + `HasEmpresa` en el modelo. Con 5 filas es barato;
> después de generar miles, no.

### Otros dos, menores

- `inv_stock` tiene **dos** columnas de tránsito: `cantidad_en_transito` decimal(14,4) y
  `cantidad_transito` decimal(15,4). Es el duplicado que `[#1112]` documentó. **No usar
  ninguna de las dos sin verificar cuál llena Compras.**
- El **lead time ya existe**: `inv_criterios_abastecimiento.tiempo_entrega_dias`. El TODO #1
  («confirmar el lead time real por proveedor, hoy se toma de Compras si existe») parte de una
  premisa equivocada — el dato ya está en la tabla que el módulo va a usar.

---

## ⚠️ Directivas transversales — se cumplen las SIETE, sin excepción

Recordatorio explícito del director técnico (2026-08-12). Aplican a este módulo así:

| Directiva | Cómo aplica aquí |
|---|---|
| **1. `company_id` + `empresa_id` SIEMPRE, con `HasEmpresa`** | Las 4 tablas `abst_*` llevan las dos columnas y sus modelos el trait. Y **se arregla `inv_criterios_abastecimiento`, que hoy no las tiene** (hallazgo 3) — el módulo no puede escribir en una tabla que no aísla por empresa |
| **2. Multimoneda desde el diseño** | `costo_pedido` en **funcional**, declarado en el docblock y **mostrado en la pantalla**; el ABC agrega sobre `costo_promedio_local` (funcional), nunca `_dolar`. Combos de moneda —si alguno hiciera falta— salen de `EmpresaMonedaService::monedasOperativas()`, **jamás** del catálogo de 143 |
| **3. Mueve inventario ⇒ movimiento de inventario** | ⚠️ **Este módulo NO mueve stock**: solo lee `inv_stock` / `inv_movimientos` y escribe pronósticos y parámetros. Si alguna fase llegara a necesitar mover stock, va por el servicio de Inventario — nunca tocando `inv_stock` a mano |
| **4. Es contabilizable ⇒ asiento** | **No hay operación contabilizable**: calcular un pronóstico o aplicar un punto de reorden no mueve dinero ni existencias. Por eso este módulo **no** registra en `MovimientoFinancieroService` — y eso se declara, para que nadie lo añada «por simetría» |
| **5. Es venta ⇒ mueve Facturación** | No aplica: el módulo no vende |
| **6. Cuentas contables por módulo, nunca hardcodeadas** | No aplica por lo mismo que la 4. **Cero literales de cuenta en el código** — hay prueba de eso en otros módulos y aquí no debe existir ni uno |
| **7. Integridad transversal / fuente única** | El módulo **consume** `ReordenService`, `SugeridoCompraService`, `RecetaService::conversor()` y `EmpresaMonedaService`. No reimplementa ninguno: la sección «Lo que este módulo NO hace» es esta directiva escrita en concreto |

---

## Modelo de datos (4 tablas, prefijo `abst_`)

Todas con `id char(36)`, `company_id char(36)`, `empresa_id char(36)`, timestamps y trait
`HasEmpresa`. ⚠️ `articulo_id` y `bodega_id` son **bigint** (así están en `inv_*`).

### `abst_config`
Configuración por empresa. Una fila por `(company_id, empresa_id)`.

| Columna | Tipo | Default | Nota |
|---|---|---|---|
| `metodo_pronostico` | enum(`media_movil`,`suavizado_exp`) | `media_movil` | |
| `ventana_dias` | smallint | 90 | historial que mira el pronóstico |
| `alfa_suavizado` | decimal(4,3) | 0.300 | solo para suavizado exponencial |
| `nivel_servicio_pct` | decimal(5,2) | 95.00 | define el stock de seguridad |
| `costo_pedido` | decimal(15,2) | 0 | ⚠️ **0 = no calcular EOQ** |
| `costo_almacenaje_pct` | decimal(5,2) | 0 | ⚠️ **0 = no calcular EOQ** |
| `alerta_cobertura_dias` | smallint | 0 | ⚠️ **0 = alerta apagada** |
| `ultima_ejecucion` | timestamp null | null | marca del cron (ver regla 8) |

⚠️ `costo_pedido` y `costo_almacenaje_pct` nacen en **0 a propósito**: sin esos dos datos
el EOQ no se puede calcular, y un EOQ inventado con valores por defecto haría que el
comprador pidiera cantidades sin fundamento creyendo que el sistema las calculó. Con 0, la
pantalla **dice** que falta configurarlos en vez de mostrar un número.

⚠️ **`costo_pedido` se captura y se guarda en MONEDA FUNCIONAL de la empresa**, siguiendo el
patrón que ya usa `ban_config.monto_aprobacion_egresos`. No lleva `moneda_id` propio, y eso
es deliberado: el EOQ lo divide entre `inv_stock.costo_promedio_local`, que **ya está en
funcional**. Capturarlo en otra moneda sin convertir daría un EOQ silenciosamente erróneo —
el comprador pediría de más o de menos y nada lo avisaría.

**La pantalla tiene que DECIR en qué moneda se captura**, mostrando el ISO de la funcional
resuelto con `EmpresaMonedaService::monedasOperativas()` (que devuelve la funcional primero y
marcada). Un campo «Costo de pedido» sin moneda al lado es una cifra que cada usuario
interpreta en la suya.

### `abst_pronosticos`
Resultado del cálculo nocturno. UNIQUE `(company_id, empresa_id, articulo_id, bodega_id, fecha_calculo)`.

`articulo_id` bigint · `bodega_id` bigint · `fecha_calculo` date · `demanda_diaria`
decimal(15,4) · `desviacion` decimal(15,4) · `metodo` varchar(20) · `muestras` smallint
(cuántos días de historial se usaron) · `confianza` enum(`alta`,`media`,`baja`).

⚠️ **`muestras` y `confianza` no son adorno.** Un pronóstico con 6 días de historial y otro
con 90 no valen lo mismo, y el comprador tiene que poder distinguirlos antes de firmar una
orden. Sin ese dato, ambos se ven igual de seguros en pantalla.

### `abst_parametros`
Lo calculado por artículo/bodega, y lo que el usuario decida sobreescribir.
UNIQUE `(company_id, empresa_id, articulo_id, bodega_id)`.

`rop_calculado` · `rop_manual` (nullable) · `eoq_calculado` · `eoq_manual` (nullable) ·
`stock_seguridad` · `clase_abc` char(1) nullable · `lead_time_dias` smallint ·
`aplicado_a_inv_stock` boolean default false.

⚠️ **`rop_manual` NULL = usar el calculado** (patrón override de `[CW-FIX-1]`). Copiar el
valor calculado a cada fila haría que una mejora de la fórmula no llegara nunca a quienes
ya lo tienen; con NULL, la corrección llega sola a todo el que no lo ajustó a mano.

⚠️ **`aplicado_a_inv_stock` es una decisión del usuario, no automática.** El ROP calculado
NO pisa `inv_stock.stock_minimo` por su cuenta: ese valor lo puso alguien y de él dependen
las alertas que ya funcionan. Se propone, se muestra el antes/después, y se aplica con un
botón.

### `abst_alertas`
Patrón canónico del ecosistema. UNIQUE `(company_id, empresa_id, fecha, tipo, clave)` →
`insertOrIgnore`, idempotente por día.

---

## Fórmulas — escritas en el código y **mostradas en pantalla**

Un número que nadie sabe cómo se calculó no se usa para decidir (regla de `[BAN-F4-3]`).

```
demanda_diaria   = salidas del período / días del período       (media móvil)
                 = α·demanda_hoy + (1−α)·pronóstico_anterior     (suavizado exponencial)

stock_seguridad  = Z(nivel_servicio) × desviación × √lead_time
ROP              = demanda_diaria × lead_time + stock_seguridad
EOQ              = √( (2 × demanda_anual × costo_pedido) / (costo_unitario × costo_almacenaje_pct) )
cobertura_dias   = disponible / demanda_diaria

disponible       = inv_stock.cantidad − inv_stock.cantidad_reservada
lead_time        = inv_criterios_abastecimiento.tiempo_entrega_dias   (ya existe; ver ANEXO B)
```

⚠️ **`disponible` se DERIVA, no se lee**: `inv_stock.cantidad_disponible` **no existe** (el
blueprint la daba por buena). Y la resta importa: contar lo reservado como disponible haría
que un artículo con todo su stock comprometido en pedidos apareciera como abastecido, y el
ROP no dispararía hasta que el almacén ya estuviera vacío.

⚠️ **`demanda_diaria = 0` no da cobertura infinita: da «sin movimiento».** Dividir por cero
mostraría ∞ días de cobertura para un artículo muerto, que es justo el que hay que revisar.

⚠️ **Qué cuenta como demanda:** solo movimientos de naturaleza **salida** en tipos de
transacción de **venta o consumo**. Un traslado entre bodegas no es demanda — contarlo
inflaría el pronóstico de la bodega origen y dejaría en cero el de la destino.

---

## Fases

### F0 — Base, aislamiento y golden master
Suite propia. Congela el comportamiento actual de Inventario: **el ROP manual sigue
mandando mientras nadie aplique el calculado**. Declara los huecos de F1–F4 (que las rutas
de este módulo aún no existen), para que el trabajo posterior tenga que probar que los llenó.

⚠️ **Incluye el arreglo del hallazgo 3**: `empresa_id` en `inv_criterios_abastecimiento`
(migración aditiva + backfill desde el artículo + `HasEmpresa` en `CriterioAbastecimiento`),
y `ReordenService` pasa a filtrar por empresa. Va **antes** de que el módulo empiece a escribir
criterios, no después. La prueba que lo cierra es la que hoy no existe: **dos empresas del
mismo tenant, cada una con su criterio, y las alertas de una no incluyen los artículos de la
otra**.

### F1 — Pronóstico de demanda
`PronosticoService` + comando `abastecimiento:pronosticar` (nocturno). Pantalla por artículo
con la serie histórica y el pronóstico. ⚠️ El cálculo **no es un bucle de consultas**: con
5.000 artículos serían decenas de miles de queries (el N+1 de `[PRE-F4-1]`). Se resuelve con
una agregación por artículo/bodega y se procesa en memoria.

### F2 — ROP, EOQ y stock de seguridad
`ParametrosService`. Pantalla de propuesta con comparación contra el criterio actual y botón
«Aplicar a Inventario» (registra quién y cuándo). ⚠️ Sin `costo_pedido` y
`costo_almacenaje_pct` configurados, el EOQ **se omite y se dice por qué** — no se muestra 0.

⚠️ **Aplicar escribe en `inv_criterios_abastecimiento.punto_reorden`, no en `inv_stock`**
(hallazgo 1). Es la tabla que `ReordenService` lee, y por tanto la única donde el valor
aplicado produce una alerta de verdad. Si el criterio no existe todavía para ese
artículo/bodega, se crea; el `tiempo_entrega_dias` de esa misma fila es el lead time que
alimenta la fórmula, así que el módulo lee y escribe en el mismo sitio.

### F3 — Clasificación ABC y cobertura
ABC por **valor de consumo del período** (cantidad × costo), no por existencia: un artículo
caro que no rota no es clase A. Umbrales configurables (80/15/5 por defecto) **mostrados y
exportados** — sin ellos nadie puede saber por qué un artículo cayó en su clase.

⚠️ **El costo del valor de consumo sale de `inv_stock.costo_promedio_local`, no de
`costo_promedio_dolar`.** El sufijo `_local` es la moneda funcional de la empresa, y la
directiva del ecosistema exige que **los agregados vayan en funcional**. Mezclar artículos
costeados en dólares con otros en la funcional dentro del mismo ranking ABC pondría en clase A
a los importados por el tipo de cambio y no por su consumo — que es justo lo que el ABC
pretende medir.

### F4 — Alertas y tablero
Cuatro tipos: cobertura baja, riesgo de quiebre antes del lead time, sobre-stock (cobertura
> N días) y artículo sin movimiento. Comando `abastecimiento:alertas`, idempotente por día,
que **estampa su marca aunque no envíe nada**.

⚠️ Prueba obligatoria: *con los defaults, operar normal no dispara ni una alerta.*

### Cierre
Aceptación end-to-end: cargar historial → pronosticar → calcular ROP → aplicarlo a
**`inv_criterios_abastecimiento`** → comprobar que `ReordenService` (el que ya existía)
dispara con el valor nuevo. Ahí es donde se ve si los dos módulos encajan de verdad —
y es justo la comprobación que, con el destino que decía el blueprint, **habría fallado
o habría pasado por la razón equivocada**.

---

## TODOs de verificación humana

1. ~~Confirmar el lead time real por proveedor~~ → **resuelto en la reverificación**: el dato
   ya existe en `inv_criterios_abastecimiento.tiempo_entrega_dias`, en la misma fila que el
   módulo lee y escribe. Lo que queda es que el negocio **confirme sus valores**, no buscarlos.
2. Validar los umbrales ABC con el negocio (80/15/5 es una convención, no una norma).
3. ⚠️ Decidir si el ROP calculado debe aplicarse automáticamente cuando el usuario lo pida
   **en lote** — hoy es artículo por artículo a propósito.
4. ⚠️ **Aclarar cuál de las dos columnas de tránsito de `inv_stock` es la buena**
   (`cantidad_en_transito` vs `cantidad_transito`). El módulo no usa ninguna hasta saberlo:
   incluir tránsito en la cobertura con la columna equivocada daría siempre 0 y haría que el
   ROP disparara de más.
