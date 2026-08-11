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

## ANEXO B — Dependencias, verificadas con `git log` y contra el esquema

⚠️ Reverificar antes de implementar: en Restaurante, **tres de cinco** dependencias del
anexo resultaron distintas de lo escrito, y las tres porque ya existían.

| Se necesita | Estado | Consecuencia |
|---|---|---|
| `inv_stock` con `cantidad_disponible`, `cantidad_reservada`, `stock_minimo` | ✅ existe | `stock_minimo` está en `inv_stock` (por bodega), **no** en `inv_articulos` |
| `inv_movimientos` + `inv_movimientos_lineas` con `costo_unit_local` | ✅ existe | ⚠️ la columna es `costo_unit_local`, **no** `costo_unitario_local` |
| `inv_tipos_transaccion` con naturaleza | ✅ existe | ⚠️ el flag es `is_active`, **no** `es_activo` |
| `SugeridoCompraService` (INV-F5) | ✅ existe | El pronóstico lo **alimenta**; no se crea un sugerido paralelo |
| `ReordenService::getAlertas()` | ✅ existe | El ROP calculado sustituye al `stock_minimo` manual **solo si el usuario lo aplica** |
| `inv_articulos.uom_base_id` | ✅ existe | ⚠️ es `uom_base_id`, **no** `unidad_medida_id` |
| Conversión de unidades | ✅ `inv_conversiones_unidad` | Usar `RecetaService::conversor()`; **no** reimplementar |

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
cobertura_dias   = cantidad_disponible / demanda_diaria
```

⚠️ **`demanda_diaria = 0` no da cobertura infinita: da «sin movimiento».** Dividir por cero
mostraría ∞ días de cobertura para un artículo muerto, que es justo el que hay que revisar.

⚠️ **Qué cuenta como demanda:** solo movimientos de naturaleza **salida** en tipos de
transacción de **venta o consumo**. Un traslado entre bodegas no es demanda — contarlo
inflaría el pronóstico de la bodega origen y dejaría en cero el de la destino.

---

## Fases

### F0 — Base y golden master
Suite propia. Congela el comportamiento actual de Inventario: **el ROP manual sigue
mandando mientras nadie aplique el calculado**. Declara los huecos de F1–F4 (que las rutas
de este módulo aún no existen), para que el trabajo posterior tenga que probar que los llenó.

### F1 — Pronóstico de demanda
`PronosticoService` + comando `abastecimiento:pronosticar` (nocturno). Pantalla por artículo
con la serie histórica y el pronóstico. ⚠️ El cálculo **no es un bucle de consultas**: con
5.000 artículos serían decenas de miles de queries (el N+1 de `[PRE-F4-1]`). Se resuelve con
una agregación por artículo/bodega y se procesa en memoria.

### F2 — ROP, EOQ y stock de seguridad
`ParametrosService`. Pantalla de propuesta con comparación contra el `stock_minimo` actual y
botón «Aplicar a Inventario» (registra quién y cuándo). ⚠️ Sin `costo_pedido` y
`costo_almacenaje_pct` configurados, el EOQ **se omite y se dice por qué** — no se muestra 0.

### F3 — Clasificación ABC y cobertura
ABC por **valor de consumo del período** (cantidad × costo), no por existencia: un artículo
caro que no rota no es clase A. Umbrales configurables (80/15/5 por defecto) **mostrados y
exportados** — sin ellos nadie puede saber por qué un artículo cayó en su clase.

### F4 — Alertas y tablero
Cuatro tipos: cobertura baja, riesgo de quiebre antes del lead time, sobre-stock (cobertura
> N días) y artículo sin movimiento. Comando `abastecimiento:alertas`, idempotente por día,
que **estampa su marca aunque no envíe nada**.

⚠️ Prueba obligatoria: *con los defaults, operar normal no dispara ni una alerta.*

### Cierre
Aceptación end-to-end: cargar historial → pronosticar → calcular ROP → aplicarlo a
`inv_stock` → comprobar que `ReordenService` (el que ya existía) dispara con el valor nuevo.
Ahí es donde se ve si los dos módulos encajan de verdad.

---

## TODOs de verificación humana

1. Confirmar el **lead time real** por proveedor: hoy se toma de Compras si existe; si no,
   el ROP usa un default que hay que revisar antes de comprar con él.
2. Validar los umbrales ABC con el negocio (80/15/5 es una convención, no una norma).
3. ⚠️ Decidir si el ROP calculado debe aplicarse automáticamente cuando el usuario lo pida
   **en lote** — hoy es artículo por artículo a propósito.
