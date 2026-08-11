# Blueprint — Asistente de Cumplimiento Fiscal (`fiscal`)

> Slug `fiscal` · prefijo `fisc_*` · **vive dentro del módulo Contabilidad** ·
> requiere `contabilidad` contratado · se vende solo en plan anual.
> Reglas comunes en `00_LEEME.md`.

---

## Objetivo

Que nadie se entere de un vencimiento fiscal **el día después**. El sistema ya sabe calcular
y generar los reportes; lo que no sabe es **cuándo hay que presentarlos** ni **si se
presentaron**.

---

## ⚠️ Lo que este módulo NO hace — y aquí es especialmente importante

Zyntello ya tiene implementada una cantidad considerable de lógica fiscal, probada y en
producción. **Reimplementar cualquiera de estas piezas crearía un segundo criterio fiscal**,
y dos cifras distintas de lo mismo frente a la administración tributaria no es un problema
de software: es una contingencia.

| Ya existe | Dónde |
|---|---|
| Reportes DGII 606 / 607 / 608 | `DgiiTxtService` (fuente canónica), módulo Contabilidad |
| IR-17 (ISR retenido mensual) | `Ir17Controller`, CxP F1-3 |
| Retenciones al pagar + comprobante | CxP F1 (`cxp_tipos_retencion`, `RetencionCxpService`) |
| Retenciones recibidas de clientes | CxC F3-3 + FACT F2-2 |
| NCF: consecutivos, secuencias, alertas | `NcfService`, módulo NCF |
| e-CF: emisión, recepción, aprobación comercial 30 días | CxP F3, `EcfRecepcionService` |
| Factura-E Venezuela (SENIAT) | `FacturaEService` |
| Documentos fiscales CO / MX / GT / CR | `DocumentoFiscalService` (`docfiscal_*`) |
| Validación de NCF/RNC y consulta DGII | `ValidacionFiscalService`, `ConsultaDgiiService` |
| Reporte «Cumplimiento fiscal (por país)» | `contabilidad.reportes.cumplimiento` |

⚠️ **Ojo con el último:** ese reporte ya existe y muestra el estado por país. Este módulo
**no lo reemplaza ni lo duplica** — aquel es una foto del estado; esto es el **calendario**
de vencimientos, los **recordatorios** y el **registro de lo que se presentó y cuándo**.

**Este módulo orquesta y avisa. No calcula impuestos.**

---

## ANEXO B — Dependencias

| Se necesita | Estado | Nota |
|---|---|---|
| `DgiiTxtService::generar606/607/608` | ✅ | Se **consume** para adjuntar el archivo a la presentación |
| `Ir17Controller` | ✅ CxP F1-3 | ⚠️ sus casillas son de **REFERENCIA**: verificación humana pendiente desde F1 |
| `loc_paises`, `loc_fiscal_document_types` | ✅ | Multi-país; ⚠️ no coinciden con `NcfConsecutivo::tiposNcfRD()` (discrepancia `D-REST-F3-2-1`) |
| `cont_periodos` | ✅ | Un período cerrado no admite presentación nueva |
| Sistema de alertas canónico | ✅ patrón `xxx_alertas` + `xxx_alertas_config` | Se reusa, no se inventa |
| Disco privado para archivos | ✅ | Los archivos fiscales **no** van al disco público |

---

## Modelo de datos (4 tablas, prefijo `fisc_`)

### `fisc_obligaciones`
Qué debe presentar esta empresa y cuándo. Configurable por empresa.

`codigo` varchar(30) (`IT1`, `IR17`, `606`, `607`, `608`, `IR2`, `MUNICIPAL`) ·
`nombre` varchar(150) · `pais_iso` char(2) · `frecuencia`
enum(`mensual`,`bimestral`,`trimestral`,`semestral`,`anual`) ·
`regla_vencimiento` varchar(60) (`DIA_20`, `ULTIMO_DIA_HABIL`, `DIA_15_MES_SIGUIENTE`) ·
`reporte_origen` varchar(60) nullable (qué servicio genera el archivo) ·
`dias_aviso_previo` smallint **default 0 = sin aviso** · `activa` boolean default false.

⚠️ **Nacen inactivas y sin aviso.** Las obligaciones dependen del régimen de cada empresa:
activarlas todas por defecto llenaría el calendario de vencimientos que no le aplican, y el
usuario aprendería a ignorarlo — el mismo ruido que las alertas que saltan todos los días.

⚠️ **Las reglas de vencimiento del catálogo semilla son de REFERENCIA**, con su norma
citada y `verificado = false`, igual que se hizo con `cxp_tipos_retencion` en CxP F1. Una
fecha fiscal afirmada sin la fuente cargada es peor que no tenerla: el usuario confía y
presenta tarde.

### `fisc_calendario`
Las ocurrencias concretas, generadas del catálogo. UNIQUE
`(company_id, empresa_id, obligacion_id, periodo_inicio)`.

`periodo_inicio` date · `periodo_fin` date · `fecha_vencimiento` date ·
`estado` enum(`pendiente`,`en_proceso`,`presentada`,`vencida`,`no_aplica`) ·
`monto_declarado` decimal(15,2) nullable · `moneda_id` bigint.

⚠️ **`no_aplica` existe a propósito.** Un mes sin operaciones no es un incumplimiento;
marcarlo «vencido» ensuciaría el % de cumplimiento y haría inútil el indicador.

⚠️ **La fecha de vencimiento se calcula respetando días hábiles y festivos.** `psa_festivos`
ya tiene el catálogo por país; se **consume**, no se reimplementa.

### `fisc_presentaciones`
El hecho de haber presentado. Inmutable salvo anulación.

`calendario_id` · `fecha_presentacion` date · `numero_acuse` varchar(100) nullable ·
`archivo_path` varchar(255) (**disco privado**) · `monto_pagado` decimal(15,2) nullable ·
`presentada_por` bigint (users) · `notas` text.

⚠️ **El sistema NO presenta ante la administración tributaria.** Genera el archivo, lo
guarda y registra que un humano lo presentó. Automatizar el envío exigiría credenciales,
firma digital y responsabilidad legal sobre el acto — decisión que no toma un módulo.

### `fisc_alertas` + `fisc_alertas_config`
Patrón canónico: idempotente por día, silenciable por tipo, con responsable y master-switch
de correo **apagado**.

---

## Reglas de negocio

⚠️ **El monto NO se recalcula aquí.** Se toma del reporte de origen en el momento de
generar la presentación y se **sella**. Si se recalculara al abrir la pantalla, el importe
mostrado hoy podría no coincidir con el del archivo entregado el mes pasado — y el que vale
es el entregado.

⚠️ **Una obligación vencida y no presentada sigue apareciendo.** No se archiva sola al pasar
la fecha: desaparecer es exactamente lo que hace que nadie regularice.

⚠️ **El % de cumplimiento se calcula sobre lo que ya venció**, no sobre el año completo. En
marzo, contar los doce meses daría 25 % de cumplimiento con todo al día — un número que
alarma sin motivo (misma regla que `[REST-F8-1]`: *un porcentaje se calcula sobre lo que ya
terminó*).

⚠️ **Período contable cerrado bloquea la presentación**, con el mensaje que dice qué hacer.

---

## Fases

### F0 — Base y catálogo semilla
Suite propia. Catálogo RD de referencia (IT-1, IR-17, 606, 607, 608, IR-2) con norma citada
y `verificado = false`. Pantalla de configuración de obligaciones. ⚠️ Prueba: *una empresa
recién instalada no tiene ninguna obligación activa ni ninguna alerta.*

### F1 — Calendario
`CalendarioFiscalService` genera las ocurrencias del año. Vista de calendario con color por
tipo de impuesto y lista de próximos vencimientos. ⚠️ El cálculo de días hábiles consume
`psa_festivos`; sin festivos cargados para el país, **se avisa** en vez de calcular sobre
días corridos en silencio.

### F2 — Presentaciones
Registro con adjunto en disco privado. Botón «Generar archivo» que llama al servicio de
origen (`DgiiTxtService` y compañía) — **sin reimplementar el formato**. Historial filtrable
con exportación.

### F3 — Panel de cumplimiento
% presentado a tiempo (sobre lo vencido), monto pendiente, próximas 30 días, obligaciones
vencidas sin presentar. Cada indicador **declara su cuadre y lo muestra al pie**: un cuadre
que solo vive en la prueba no avisa a nadie en producción (`[BAN-F4-3]`).

### F4 — Alertas y bitácora
Comando `fiscal:alertas` (aviso previo, día del vencimiento, vencida sin presentar), que
**estampa su marca aunque no envíe nada**. Bitácora de auditoría de cada acción, exportable.

⚠️ Recordatorio: el crontab de producción está en `*/18` y **este cron no correrá** hasta
que se corrija (ver regla 8 del `00_LEEME.md`).

---

## TODOs de verificación humana — ⚠️ los más críticos de los cinco módulos

1. ⚠️ **Verificar cada regla de vencimiento contra la norma vigente** de la DGII y de cada
   país antes de marcar `verificado = true`. El catálogo semilla es orientativo.
2. ⚠️ Confirmar las casillas del **IR-17** (siguen pendientes desde CxP F1-3).
3. ⚠️ Decidir si se automatiza el envío ante la DGII. Hoy **no** se hace, y no debería
   hacerse sin decisión explícita del director técnico: implica firma digital y
   responsabilidad legal.
4. Revisar la política de conservación de los archivos presentados (plazo legal por país).
5. ⚠️ Actualizar los **documentos legales públicos**: este módulo trata datos fiscales y se
   integra con administraciones tributarias — Términos §14/§15 y Privacidad §4/§5. *Un
   módulo no está terminado si los documentos legales no lo mencionan.*
