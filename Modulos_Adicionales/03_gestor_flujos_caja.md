# Blueprint — Gestor de Flujos de Caja (`flujocaja`)

> Slug `flujocaja` · prefijo `flc_*` · **vive dentro del módulo Bancos** ·
> requiere `bancos` contratado · se vende solo en plan anual.
> Reglas comunes en `00_LEEME.md`.

---

## Objetivo

Que el tesorero pueda contestar **«¿qué pasa si…?»** antes de decidir: si aplaza pagos a
proveedores, si ofrece descuento por pronto pago, si usa la línea de crédito o si el dólar
se mueve.

---

## ⚠️ Lo que este módulo NO hace

Bancos F4 ya entregó `TesoreriaAnaliticaService` con la **proyección de saldo**, la posición
consolidada multi-empresa, los cheques flotantes con aging y los depósitos en tránsito. Y su
fórmula ya está corregida: la discrepancia `D-BAN-F4-3-1` demostró que la versión ingenua
(«saldo + corridas − flotantes + tránsito») hace **doble conteo**, porque un cheque emitido
ya descontó el saldo del libro desde F0-2.

Hoy el módulo entrega dos columnas, cada una con su fórmula escrita en el código **y en la
pantalla**:

```
disponible          = saldo − compromisos
estimado en el banco = saldo − tránsito + flotantes
```

⚠️ **Este módulo NO recalcula la proyección.** La consume como escenario **Base** y aplica
variaciones encima. Si la recalculara por su cuenta habría dos cifras de liquidez para el
mismo día, el tesorero no sabría cuál mirar, y el día que Bancos corrija su fórmula esta se
quedaría con la vieja sin que nada lo avise.

---

## ANEXO B — Dependencias

| Se necesita | Estado | Nota |
|---|---|---|
| `TesoreriaAnaliticaService` con proyección de saldo | ✅ Bancos F4-3 | Fuente del escenario Base |
| `ban_cuentas`, `ban_movimientos` | ✅ | ⚠️ `ban_movimientos.tipo` es `credito`/`debito`, **no** `ingreso`/`egreso` |
| Vencimientos de CxC y CxP | ✅ `cxc_documentos`, `cxp_documentos` | Entradas y salidas futuras |
| Corridas de pago aprobadas | ✅ `cxp_corridas` | Ya contempladas en la proyección |
| Descuento por pronto pago | ✅ `condiciones_pago` | ⚠️ vive en `condiciones_pago.descuento_pronto_pago_pct` / `dias_descuento`, **no** en `pur_payment_terms` (discrepancia ya documentada en CxP F4-1) |
| Tipos de cambio | ✅ `tasas_cambio` | ⚠️ `tasas_cambio.id` es **bigint**, no UUID |
| Nómina como salida futura | ⚠️ condicional | Solo si `nomina` está contratado; si no, **se nombra la ausencia** en pantalla |

---

## Modelo de datos (3 tablas, prefijo `flc_`)

### `flc_escenarios`
`nombre` varchar(100) · `tipo` enum(`base`,`optimista`,`pesimista`,`personalizado`) ·
`horizonte_dias` smallint (30/60/90) · `fecha_corte` date · `moneda_id` bigint ·
`es_predeterminado` boolean · `created_by`.

⚠️ **Todo el escenario se resuelve a UNA fecha de corte.** Si cada bloque usara `now()`, un
cobro registrado mientras se genera el análisis haría que el KPI de arriba no cuadre con la
tabla de abajo, y el descuadre sería **irreproducible** (lección de `[PRE-F4-3]`).

### `flc_variables`
Las palancas del escenario. UNIQUE `(escenario_id, variable)`.

| `variable` | Qué ajusta | Unidad |
|---|---|---|
| `descuento_pronto_pago_pct` | adelanta cobros de CxC a cambio de cobrar menos | % |
| `dias_aplazamiento_pago` | retrasa salidas de CxP | días |
| `linea_credito_monto` | entrada disponible desde una fecha | importe |
| `linea_credito_fecha` | cuándo estaría disponible | fecha |
| `variacion_tc_pct` | mueve las tasas futuras | % |

`valor_base` y `valor_ajustado` decimal(15,4) — guardar **ambos** permite mostrar el «de X a
Y» que hace entendible el impacto; con solo el ajustado, el usuario ve un número sin
referencia.

### `flc_proyecciones`
Resultado por día. UNIQUE `(escenario_id, fecha)`.

`entrada` · `salida` · `neto` · `saldo_acumulado` · `moneda_id` · `tipo_cambio` ·
`entrada_funcional` · `salida_funcional`.

⚠️ **El detalle de qué compone cada día NO se guarda: se deriva.** Guardarlo sería un
segundo registro de facturas y cobros que ya existen y quedaría viejo en cuanto alguien
anule un documento.

---

## Reglas de negocio

⚠️ **Un escenario es una simulación: no mueve ni un peso.** No genera asientos, no crea
movimientos bancarios, no toca CxC ni CxP. Es de solo lectura sobre los datos reales.

⚠️ **El descuento por pronto pago tiene dos efectos, y hay que mostrar los dos.** Adelanta
la entrada *y* la reduce. Un escenario que solo adelante la fecha diría que la liquidez
mejora sin coste, y el tesorero tomaría la decisión con la mitad de la información.

⚠️ **Aplazar pagos no es gratis, y el módulo no puede saber cuánto cuesta.** Puede haber
mora, pérdida de descuento o daño a la relación con el proveedor. La pantalla lo **advierte
explícitamente**; el número solo, sin ese aviso, hace que aplazar parezca siempre la mejor
opción.

⚠️ **Saldo proyectado negativo se pinta en rojo y se nombra el día.** «Déficit máximo:
-45.000 el 14 de marzo» es accionable; «déficit: -45.000» no dice cuándo actuar.

⚠️ **Si falta una fuente, se dice.** Sin Nómina contratada las salidas de sueldos no
entran: el reporte **nombra la ausencia** en vez de proyectar una liquidez optimista que
nadie puede explicar (regla de `[CW-F4-1]`: *lo que falta se nombra, no se filtra*).

---

## Fases

### F0 — Base y golden master
Congela la proyección actual de Bancos: **el escenario Base debe reproducir exactamente lo
que hoy muestra `bancos.reportes.proyeccion-saldo`**, fila por fila. Si diverge, hay dos
verdades y esta es la nueva.

### F1 — Escenario Base
`FlujoCajaService::construirBase()` compone desde `TesoreriaAnaliticaService`. Pantalla con
gráfica diaria, saldo acumulado y las tres tarjetas: flujo neto del período, **día de menor
liquidez** y déficit máximo.

### F2 — Escenarios y variables
`EscenarioService`: crear, clonar y comparar. Panel de variables con el impacto recalculado
en vivo. Comparación de hasta 3 escenarios en la misma gráfica. ⚠️ Clonar el Base **congela
sus valores**: si el clon siguiera leyendo el Base en vivo, dos escenarios «comparados» se
moverían juntos y la comparación no significaría nada.

### F3 — Alertas de liquidez
Umbral configurable, **nace en 0 = apagado**. Comando `flujocaja:alertas` idempotente por
día que estampa su marca aunque no envíe nada. Tipos: saldo proyectado bajo el umbral,
déficit en los próximos N días, escenario pesimista en negativo.

### F4 — Exportación
Excel y PDF con **la fecha de corte y la moneda en la portada**, y con las variables del
escenario impresas. Un PDF de liquidez sin decir de qué moneda y a qué fecha no se puede
llevar a un comité (lección de `[PRE-F4-3]`).

---

## TODOs de verificación humana

1. ⚠️ Confirmar el **coste real de aplazar** con cada proveedor: el módulo advierte pero no
   puede calcularlo.
2. Validar el horizonte por defecto (30/60/90) con el tesorero.
3. Decidir si el escenario pesimista debe incluir un % de morosidad esperada sobre CxC —
   hoy no lo hace, y por eso puede ser optimista de más.
