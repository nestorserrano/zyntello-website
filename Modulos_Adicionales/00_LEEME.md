# Módulos Adicionales — Índice y reglas comunes

> Reescrito el **2026-08-11**. Los cinco archivos anteriores eran blueprints genéricos:
> usaban `companies(id)` BIGINT y tablas `customers` / `products` / `vendors` /
> `exchange_rates` que **no existen** en Zyntello, y **ninguno llevaba `empresa_id`**, que
> es la regla arquitectural fundamental del ecosistema. El `04` además venía **corrupto**
> (traía basura de una llamada a herramienta a medias y el contenido duplicado) y el `03`
> tenía texto en chino. Se reescribieron contra el esquema real.

---

## Los cinco módulos

| # | Módulo | Slug | Prefijo | Vive en | Requiere | Stripe (anual) |
|---|---|---|---|---|---|---|
| 01 | Inteligencia de Clientes | `inteligencia` | `intel_*` | dentro de **CRM** | `crm` | `price_1U3FIFHgpNgFNBaHy8KjAYxX` |
| 02 | Asistente de Cumplimiento Fiscal | `fiscal` | `fisc_*` | dentro de **Contabilidad** | `contabilidad` | `price_1U3FJ2HgpNgFNBaHROIlABto` |
| 03 | Gestor de Flujos de Caja | `flujocaja` | `flc_*` | dentro de **Bancos** | `bancos` | `price_1U3FJSHgpNgFNBaHHvWY8uSP` |
| 04 | Gestor Inteligente de Inventarios | `abastecimiento` | `abst_*` | dentro de **Inventario** | `inventario` | `price_1U3FJkHgpNgFNBaHHpzkfIkT` |
| 05 | Planificador de Rutas | `rutas` | `rut_*` | **módulo raíz** | — | `price_1U3FKLHgpNgFNBaHNFbjPZx7` |

**Los cinco se venden SOLO en plan anual.** `precio_mensual` y `stripe_price_id_mensual`
están en NULL a propósito — un `0` ahí **no se lee como «este plan no existe», se lee como
GRATIS**, y el sitio anunciaría «USD 0 /mes».

✅ **Precio capturado el 2026-08-12: USD 100/año los cinco** (`[#506]`), y los cinco pasaron
a estado `activo` (`[#508]`). El API público ya los sirve con su `precio_anual_final` y su
Price ID. ⚠️ **Verificar que los USD 100 coincidan con el importe de cada Price en Stripe**:
el que se cobra es el de Stripe, este solo es el que se anuncia.

---

## Reglas comunes — aplican a los cinco, sin excepción

### 1. Multi-tenant: `company_id` + `empresa_id`, siempre

Toda tabla operativa lleva **las dos** columnas y todo modelo usa el trait `HasEmpresa`.
Los blueprints originales solo tenían `company_id` — con eso, dos empresas del mismo
suscriptor verían los datos la una de la otra.

```php
$empresa = empresa_activa();
$company = company();
abort_unless($empresa && $company, 403);
```

### 2. Tipos reales del esquema

⚠️ El ecosistema **mezcla** bigint y UUID, y declararlo mal no falla al guardar: falla al
LEER, devolviendo vacío (lección de `[REST-F0-1]`). Verificar contra `information_schema`
antes de escribir la migración, nunca asumir.

| Es `char(36)` (UUID) | Es `bigint` |
|---|---|
| `companies`, `empresas`, `clientes`, `proveedores`, `fact_facturas`, `fact_despachos`, `crm_leads`, `cxc_documentos`, `cxp_documentos`, `ban_cuentas`, `cont_plan_cuentas` | `users`, `inv_articulos`, `inv_bodegas`, `monedas`, `tasas_cambio`, `impuestos` |

### 3. Estos módulos CONSUMEN, no duplican

Es lo que los separa de los blueprints originales. Ninguno crea una segunda copia de un
dato que ya existe:

- **No** se crea stock: se lee `inv_stock` / `inv_movimientos`.
- **No** se crea un catálogo de clientes: se lee `clientes`.
- **No** se reimplementa el 606/607/608, IR-17, NCF, e-CF ni Factura-E.
- **No** se recalcula la proyección de saldo: la da `TesoreriaAnaliticaService`.
- **No** se crea una tabla de entregas: existe `fact_despachos`.

> *«Un dato derivado no se guarda»* y *«centralizar no es crear el método, es borrar la
> copia»* — dos reglas que el ecosistema aprendió a golpes. Un segundo registro del mismo
> hecho siempre acaba divergiendo, y la copia vieja es la que alguien mira.

### 4. Multimoneda desde el diseño

Todo importe guarda `moneda_id` + `tipo_cambio` + su equivalente funcional. Los agregados
usan `COALESCE(*_funcional, *)`. Los combos de moneda salen de
`EmpresaMonedaService::monedasOperativas()` — **nunca** del catálogo completo de 143.

### 5. Contabilizable ⇒ asiento por el hub

Vía `MovimientoFinancieroService::registrar`, en moneda funcional, con las cuentas leídas
de la configuración del módulo. **Ninguna cuenta hardcodeada.**

### 6. Todo umbral nace apagado

`0 = desactivado`. Un módulo recién instalado que muestra diez alarmas enseña a ignorar
las alarmas. Y ⚠️ **un interruptor peligroso se verifica por el DEFAULT DE LA COLUMNA**,
no por el valor de una fila (lección de `[PRE-F4-1]` y `[REST-F8-2]`).

### 7. Una columna sin formulario es una función que no existe

Tercera vez en el ecosistema. Todo lo configurable recorre los **tres** sitios: migración,
`$fillable` + validación, **y la pantalla**.

### 8. Un cron nuevo va en un minuto MÚLTIPLO DE 15

✅ **Actualizado el 2026-08-12 (`[CRON-FIX-1]`).** El texto anterior decía que el crontab
estaba en `*/18` y que ningún cron nuevo correría. Las dos cosas cambiaron:

- **El crontab de producción es `*/15`**, verificado con `crontab -l`. Bluehost no permite
  bajarlo, así que **son los horarios los que se adaptan al servidor**, no al revés.
- **Los diez comandos parados ya se movieron** a minutos alcanzables. Cero huérfanos.

⚠️ **Al agregar un cron a estos módulos, su minuto tiene que ser 0, 15, 30 o 45** (o un
intervalo `*/N`, que siempre incluye el 0). `schedule:run` **no encola**: ejecuta lo que
está *due* en el minuto exacto en que se le invoca, así que un `dailyAt('06:40')` no se
ejecutaría jamás — y el síntoma es un panel de alertas vacío, que se lee como «no hay
problemas».

**No hace falta recordarlo**: `tests/Feature/CronAlcanzableTest.php` lee los eventos del
scheduler real y falla nombrando el comando y su minuto. La regla llevaba escrita en prosa
desde que se descubrió el defecto y aun así los horarios nuevos seguían cayendo fuera.

Y todo comando estampa su marca de ejecución **aunque no haya hecho nada**: es lo único que
distingue «corrió y estaba limpio» de «no corrió».

---

## Orden sugerido de implementación

Uno por sesión, con sus fases, como se hizo con Restaurante y Prestamello:

1. **`abastecimiento`** — el más contenido: es analítica sobre datos que ya existen y casi
   no escribe nada. Buen primero para validar el patrón del candado end-to-end.
2. **`flujocaja`** — parte de un servicio ya probado (`TesoreriaAnaliticaService`).
3. **`inteligencia`** — el scoring toca varios módulos; conviene tener el patrón rodado.
4. **`fiscal`** — el más delicado: fechas de vencimiento fiscal por país, verificación humana.
5. **`rutas`** — el más grande: es el único con app de campo, GPS y proveedores externos.

**Paso previo obligatorio en cada sesión:** regresión completa VERDE con el árbol quieto
antes de escribir una línea.
