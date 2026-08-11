# Blueprint — Planificador de Rutas (`rutas`)

> Slug `rutas` · prefijo `rut_*` · **módulo raíz con menú propio** ·
> no requiere módulo padre · se vende solo en plan anual.
> Reglas comunes en `00_LEEME.md`.

---

## Objetivo

Planificar, optimizar y ejecutar **dos tipos de ruta** con el mismo motor:

- **Despacho** — entregar mercancía o facturas.
- **Visita** — cartera comercial: ver clientes.

⚠️ **Van separadas para su análisis, y esa es la decisión que ordena todo el módulo.**
Comparten el optimizador, el mapa, el tracking GPS y la app de campo. **No comparten ni una
métrica.** Promediar «tiempo de entrega» con «tiempo de visita comercial» da un número que
no significa nada: son dos negocios distintos que casualmente van en el mismo vehículo.

---

## ⚠️ Lo que este módulo NO hace

**No crea una tabla de entregas.** `fact_despachos` ya existe y trae exactamente lo que hace
falta:

```
factura_id · transportista_id · vehiculo_id · direccion_id · numero_guia
fecha_despacho · fecha_entrega_estimada · fecha_entrega_real
estado · firma_receptor · notas_entrega · entregado_por · entregado_at
```

Una ruta de despacho **planifica sobre despachos que ya existen** y, al cerrar la parada,
escribe la entrega ahí. Si este módulo llevara su propio registro de entregas, Facturación
mostraría un estado y Rutas otro, y nadie sabría cuál es el bueno.

**No crea un registro de visitas comerciales.** `cliente_actividades` (`[#986]`) ya registra
la actividad y actualiza `cliente_gestion.ultima_interaccion` sola. Completar una visita
**registra actividad ahí** — y así el pipeline comercial se actualiza sin código extra.

**No crea catálogo de transportistas ni vehículos.** Ya existen (`[#1544]`, `[#1543]`).

---

## ANEXO B — Dependencias

⚠️ Reverificar con `git log`.

| Se necesita | Estado | Nota |
|---|---|---|
| `fact_despachos` | ✅ | Origen de las paradas de despacho. ⚠️ Solo si `facturacion` está contratado |
| `transportistas`, `vehiculos` | ✅ `[#1543]`/`[#1544]` | No se duplican |
| `clientes` con dirección | ✅ | ⚠️ **no tiene lat/lng**: hay que agregarlas (ver abajo) |
| `cliente_direcciones` | ✅ | Direcciones de cobro y despacho por cliente |
| `cliente_gestion` | ✅ `[#955]` | Origen de las paradas de visita y de la priorización |
| `cliente_actividades` + `ClienteActividadService` | ✅ `[#986]` | Donde se registra el resultado de la visita |
| `crm_leads` | ⚠️ condicional | Solo si `crm` está contratado |
| Componente de pantalla completa | ✅ `[CW-F2-1]` | Para el seguimiento en vivo |
| `WhatsAppService` | ✅ `[#1466]` | Aviso de llegada al cliente |
| Geolocalización de cobros | ✅ Prestamello | ⚠️ **Prestamello NO se toca**: su ruta de cobro es suya |

⚠️ **`clientes` no tiene coordenadas.** Migración aditiva: `lat` decimal(10,8) nullable,
`lng` decimal(11,8) nullable en `cliente_direcciones` (no en `clientes`: un cliente puede
tener varias direcciones y se despacha a una concreta). Sin coordenadas la parada se
geocodifica al planificar y **se guarda el resultado** — geocodificar en cada replanificación
gastaría cuota del proveedor y daría resultados distintos para la misma dirección.

---

## Modelo de datos (6 tablas, prefijo `rut_`)

### `rut_config`
Por empresa. `proveedor_mapas` enum(`google`,`osm`,`here`,`mapbox`) default `osm` ·
credenciales por proveedor **cifradas** (cast `encrypted`) · `costo_km` · `costo_hora` ·
`umbral_desviacion_m` smallint **default 0 = apagado** · `geocerca_llegada_m` smallint
default 100 · `intervalo_gps_seg` smallint default 30 · `ultima_ejecucion`.

⚠️ **OSM es el default porque no requiere credenciales.** Un módulo que solo funciona tras
conseguir una API key de Google se percibe como roto el primer día.

⚠️ **Las credenciales van cifradas y se verifica leyendo la fila cruda**, como se hizo con
los burós en `[PRE-F1-3]`. Confiar en que el cast funciona sin comprobarlo es como no
cifrarlas.

### `rut_planes`
La cabecera. **Aquí vive la separación.**

`tipo` enum(`despacho`,`visita`) **NOT NULL** · `nombre` · `fecha` date ·
`vehiculo_id` nullable · `conductor_user_id` nullable · `proveedor_mapas` ·
`algoritmo` enum(`clarke_wright`,`vecino_cercano`,`vrp_ventanas`) ·
`distancia_km` · `tiempo_estimado_min` · `distancia_real_km` nullable ·
`tiempo_real_min` nullable ·
`estado` enum(`borrador`,`planificada`,`en_curso`,`completada`,`cancelada`).

⚠️ **`tipo` es NOT NULL y no cambia después de creada.** Una ruta que empieza como despacho
y se convierte en visita dejaría paradas de dos naturalezas mezcladas, y ningún reporte
podría separarlas después.

### `rut_paradas`
UNIQUE `(plan_id, orden)`.

`plan_id` · `orden` smallint · `cliente_id` char(36) ·
`despacho_id` char(36) nullable (**solo en rutas de despacho**) ·
`direccion_id` char(36) nullable · `lat` · `lng` ·
`tiempo_servicio_min` smallint · `prioridad` enum(`alta`,`media`,`baja`) ·
`ventana_inicio` time nullable · `ventana_fin` time nullable ·
`estado` enum(`pendiente`,`en_camino`,`llegado`,`completada`,`fallida`) ·
`motivo_fallo` varchar(255) nullable.

⚠️ **`motivo_fallo` es tan importante como el éxito.** El repartidor que no entrega (nadie en
casa, dirección errónea, cliente rechazó) hace un trabajo que hay que registrar: si solo se
guardan las entregas logradas, la ruta del día siguiente sale idéntica y el problema se
repite. Es exactamente el defecto que `[PRE-FIX-1]` corrigió en la cobranza.

### `rut_eventos`
Bitácora inmutable: `inicio`, `llegada`, `salida`, `completada`, `fallida`, `desviacion`,
`fin`. Con `ocurrido_at`, `lat`, `lng` y `notas`.

### `rut_tracking`
Puntos GPS. `plan_id` · `lat` · `lng` · `registrado_at` · `velocidad_kmh`.

⚠️ **Tabla de alto volumen**: a 30 s por punto son ~1.000 filas por ruta de 8 horas. Índice
por `(plan_id, registrado_at)` y política de retención configurable. Sin retención, en un año
esta tabla es la más grande de la base.

### `rut_zonas`
Agrupación geográfica para filtrar y asignar. Opcional.

---

## Los dos tipos, en detalle

| | **Despacho** | **Visita** |
|---|---|---|
| Origen de paradas | `fact_despachos` pendientes | `cliente_gestion` (y `crm_leads` si hay CRM) |
| Requiere | `facturacion` contratado | nada (Clientes es core) |
| Al completar | escribe `fecha_entrega_real`, `firma_receptor`, `entregado_at` **en el despacho** | registra actividad vía `ClienteActividadService` → actualiza `ultima_interaccion` |
| Prioriza por | ventana de entrega y guía | días sin contacto y prioridad comercial |
| Reporte | Cumplimiento de despacho | Cobertura de visitas |
| Mide | % a tiempo · tiempo por entrega · costo por entrega · % fallidas · km por entrega | cobertura de cartera · clientes sin visitar hace N días · efectividad (visita → pedido) · tiempo de atención |

⚠️ **Sin Facturación contratada, la mitad de despacho se ve DESHABILITADA con su motivo, no
desaparece.** Quien compró Rutas para despachar y no encuentra la opción concluye que el
módulo está roto (regla de `[CW-F4-1]`: *lo que falta se nombra, no se filtra*).

---

## Fases

### F0 — Base, configuración y proveedores
Suite propia. `rut_config` con credenciales cifradas (verificadas en la fila cruda). Los
cuatro proveedores tras `RoutingProviderInterface`: `matrizDistancias()` y `direcciones()`.
⚠️ **Los adapters se prueban con `Http::fake`** y hay una prueba que **falla si aparece
cualquier llamada de red real** en la suite (patrón de `[PRE-F1-3]`).

### F1 — Coordenadas y geocodificación
Migración aditiva de `lat`/`lng` en `cliente_direcciones`. Geocodificación bajo demanda con
resultado **guardado**. Pantalla para corregir a mano una coordenada mal geocodificada — sin
ella, una dirección ambigua manda al conductor a otro barrio y nadie puede arreglarlo.

### F2 — Rutas de despacho
Planificación desde `fact_despachos` pendientes, con filtro por zona y fecha. Optimización.
Cierre de parada que **escribe en el despacho**. ⚠️ Prueba: *cerrar la parada deja el despacho
entregado, y ese estado es el que ve Facturación.*

### F3 — Rutas de visita
Planificación desde la cartera, priorizando por días sin contacto (el dato que
`cliente_gestion` ya mantiene). Cierre de parada que **registra actividad**. ⚠️ Prueba:
*completar la visita actualiza `ultima_interaccion` sin código propio* — es lo que compra
consumir la bitácora en vez de duplicarla.

### F4 — App de campo
PWA reusando `<x-pantalla-completa>`. Lista del día, indicaciones paso a paso, botón iniciar,
geocerca de llegada, cronómetro de atención, firma del receptor (despacho) o resultado de la
visita. ⚠️ **Funciona sin conexión**: los eventos se guardan en IndexedDB y se sincronizan al
volver la red. Un repartidor en un sótano sin señal no puede perder la entrega que acaba de
hacer.

⚠️ **Un fallo de red no cuenta como entrega no realizada**, ni al revés: el evento local se
marca pendiente de sincronizar y se ve como tal (regla de `[PRE-F3-3]`: *un fallo registrado
no es un envío hecho*).

### F5 — Seguimiento, alertas e informes
Mapa en vivo con throttle y select mínimo (requisitos del polling ya establecidos en
`[REST-F2-3]`). Alerta de desviación **solo si el umbral está encendido** (nace en 0). Informe
PDF por ruta con mapa recorrido, tiempos estimados vs reales y costo.

⚠️ **Dos reportes, no uno con filtro.** Un solo reporte «de rutas» con un desplegable de tipo
acabaría promediando las dos naturalezas en los totales, que es justo lo que hay que evitar.

### Cierre
Aceptación end-to-end de las dos: una ruta de despacho completa cuyo estado se ve en
Facturación, y una de visita cuya actividad aparece en la bitácora del cliente. Y la
comprobación de que **ningún reporte mezcla ambas**.

---

## TODOs de verificación humana

1. ⚠️ Obtener las **API keys** de Google, HERE y Mapbox si se van a usar. Con OSM hay que
   decidir si se usa el servidor público (con límite de uso) o uno propio (OSRM).
2. ⚠️ Definir la **política de retención** de `rut_tracking` antes de encender el GPS
   continuo: es la tabla que más crece de todo el ecosistema.
3. ⚠️ **Consentimiento de geolocalización del conductor.** Rastrear la posición de un
   empleado es tratamiento de dato personal: hay que informarlo y recogerlo. Actualizar
   Términos §14 y Privacidad §4 marcando la geolocalización como dato de alto impacto —
   *un módulo no está terminado si los documentos legales no lo mencionan.*
4. Validar el umbral de desviación y la geocerca con una ruta real antes de encenderlos.
5. Decidir si el cliente recibe aviso de llegada por WhatsApp — el servicio existe, pero
   **nace apagado**.
