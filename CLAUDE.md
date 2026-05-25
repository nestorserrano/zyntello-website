# Zyntello — Ecosistema SaaS

> Directorio raíz: `c:/wamp64/www/zyntello/`
> Dominio principal: zyntello.com
> Hosting: Bluehost (Shared Hosting, sin SSH)
> País de operación principal: República Dominicana
> Operación regional: RD, Venezuela, Colombia, Guatemala, Costa Rica, Soporte Remoto

> **Para detalles de arquitectura interna de la app SaaS, ver `app/zyntello-app/CLAUDE.md`.**
> **Memorias del proyecto:** `/memories/repo/zyntello-app-reglas-codigos.md` y otros archivos en `/memories/repo/`
> **Planes activos:** `C:\Users\Sistemas\.claude\plans\` (cada plan describe un sprint o refactor en curso)

---

## 🔑 INSTRUCCIÓN PARA INICIAR SESIÓN

> **SIEMPRE hacer esto al comenzar cualquier sesión de trabajo en Zyntello:**
>
> 1. Leer `/memories/zyntello-convenciones.md` — Reglas mandatorias del ecosistema
> 2. Leer `/memories/repo/zyntello-app-reglas-codigos.md` — Estado actual del código y reglas
> 3. Leer sección "Bitácora técnica reciente" en `app/zyntello-app/CLAUDE.md`
> 4. Verificar push pendiente: `git log --oneline -3` y `git status` en el repo activo
>
> **Regla de validación — NUNCA omitir:**
> En TODO controlador de zyntello-app, al inicio de cualquier acción:
> ```php
> $empresa = empresa_activa();
> $company = company();
> abort_unless($empresa && $company, 403);
> ```

---

## Empresa

**Zyntello, S.R.L.** vende suscripciones mensuales a módulos de software empresarial (SaaS B2B). Todos los módulos viven bajo `app.zyntello.com` dentro de una sola app Laravel multi-tenant.

- **Correo:** info@zyntello.com
- **Teléfono / WhatsApp:** +1 829 639 9877

---

## Estructura de carpetas

```
c:/wamp64/www/zyntello/         ← Esta carpeta (repo: zyntello-website)
├── src/                        ← Sitio web principal (React + Vite)
├── dist/                       ← Build para producción (commitear siempre)
├── admin/                      ← Panel interno Zyntello (repo: zyntello-admin)
├── app/                        ← App SaaS unificada (repo: zyntello-app)
│   └── zyntello-app/           ← Laravel multi-tenant con TODOS los módulos
└── CLAUDE.md                   ← Este archivo
```

> `admin/` y `app/zyntello-app/` son repositorios Git independientes y están ignorados en este repo del sitio web.

---

## Arquitectura — definitiva

**Una sola app Laravel** (`zyntello-app`) bajo `app.zyntello.com` aloja TODOS los módulos SaaS.
**Una sola base de datos** (`zyntello_app` local / `ukrmeumy_zyntello` producción). Aislamiento por **prefijo de tabla**, no por BD separada. Ningún modelo define `$connection`.

> ⚠️ Nunca crear:
> - Apps Laravel separadas por módulo
> - Subdominios nuevos por módulo
> - Bases de datos nuevas por módulo
> - Conexiones nuevas en `config/database.php`

---

## Estructura en Bluehost (servidor)

```
/home4/ukrmeumy/public_html/
  zyntello/
    index.html (+ assets/)      ← Sitio web (zyntello.com)
    admin/
      public/                   ← Document root de admin.zyntello.com
    app/                        ← Repo zyntello-app
      public/                   ← Document root de app.zyntello.com
```

| Subdominio | Document Root |
|---|---|
| zyntello.com | `public_html/zyntello/` |
| admin.zyntello.com | `public_html/zyntello/admin/public` |
| app.zyntello.com | `public_html/zyntello/app/public` |

---

## Repositorios GitHub

| Proyecto | Repo | Estado |
|---|---|---|
| Sitio web | `nestorserrano/zyntello-website` | Activo |
| Admin interno | `nestorserrano/zyntello-admin` | Activo |
| App unificada (todos los módulos) | `nestorserrano/zyntello-app` | Activo |
| App antigua ConstructFlow | `nestorserrano/zyntello-constructflow` | Archivado |

---

## Bases de datos (Bluehost)

> **Solo dos BDs en todo el ecosistema.** Cualquier módulo nuevo va a `ukrmeumy_zyntello` con prefijo de tabla.

| Aplicación | BD producción | BD local | Usuario | Contraseña |
|---|---|---|---|---|
| App SaaS unificada (todos los módulos) | `ukrmeumy_zyntello` | `zyntello_app` (puerto 3308) | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| Admin interno | `ukrmeumy_zyntello_admin` | `zyntello_admin` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |

### Prefijos de tabla en `ukrmeumy_zyntello`

| Prefijo | Módulo |
|---|---|
| *(sin prefijo)* | Core: `companies`, `users`, `proveedores`, `clientes`, `monedas`, `tasas_cambio` |
| `cxp_*` | Cuentas por Pagar |
| `cxc_*` | Cuentas por Cobrar |
| `ban_*` | Bancos |
| `cf_*` | ConstructFlow |
| `nom_*` | Nómina |
| `cont_*` | Contabilidad |
| `inv_*` | Inventario |
| `fact_*` | Facturación |
| `cch_*` | Caja Chica (bundle ERP) |
| `af_*` | Activos Fijos (bundle ERP) |
| `pg_*` | Presupuesto (bundle ERP) |
| `pur_*` | Compras (bundle ERP) |
| `loc_*` | Localización multi-país |
| `evt_*` | Events (gestión de eventos, QR, check-in) |
| `psa_*` | PSA (Professional Services Automation — timesheets, planilla, ponches) |
| `crm_*` | CRM (pipeline leads, contactos, reportes) |

> Histórico: hasta el commit `[#408]` existían 5 BDs separadas (`zyntello_constructflow`, `zyntello_nomina`, `zyntello_contabilidad`, `zyntello_inventario`, `zyntello_facturacion`). Fueron consolidadas en `zyntello_app`. No volver a crearlas.

---

## Despliegue en Bluehost

### Sitio web (este repo)
Deploy via **cPanel Git Version Control**. `.cpanel.yml` copia `dist/*` a `/home/ukrmeumy/public_html/zyntello/`.
Antes de push: ejecutar build con PowerShell:
```powershell
& 'C:\Program Files\nodejs\node.exe' 'C:\Users\Sistemas\AppData\Roaming\npm\node_modules\npm\bin\npm-cli.js' run build
```
Commitear `dist/` siempre antes del push.

### App SaaS unificada (zyntello-app)
Deploy via **cPanel Git Version Control** del repo `nestorserrano/zyntello-app` a `/home4/ukrmeumy/public_html/zyntello/app/`.
- `.cpanel.yml` copia archivos, corre migraciones y cachés
- En deploy queda auditoría en `storage/logs/deploy-migrate.log` y `storage/logs/deploy-migrate-status.log`
- `vendor/` y `public/build/` están en el repo (Bluehost no tiene Composer/Node)
- `.env` se mantiene manualmente en el servidor

**Setup inicial (una sola vez):**
1. cPanel → Subdomains → document root de `app.zyntello.com` = `public_html/zyntello/app/public`
2. cPanel → Git Version Control → clonar `nestorserrano/zyntello-app` → `public_html/zyntello/app`
3. Crear `.env` (basado en `.env.production`)
4. cPanel → MySQL → crear `ukrmeumy_zyntello` y `ukrmeumy_zyntello_admin` (no más)
5. Sin SSH: usar ruta `/zyn-maint/migrate-y-limpiar?key=XXX` y validar con `/zyn-maint/migrate-status?key=XXX`

### Bitácora reciente (estado actual — 2026-05-25)

> Último commit en **zyntello-app**: `[#840]` `af716903` | Último commit en **zyntello-admin**: `[#495]` `926afd3` | Último commit en **zyntello-website**: `edc1f62`

#### Sprints de website completados en la sesión 2026-05-22

**Admin `[#494]` (hoy):** `ModulosSeeder.php` actualizado con datos visuales de 13 módulos (color_primario, subtitulo, caracteristicas, estado, orden) + campos de precios (ya corregido en [#495]).

**Admin `[#495]` (hoy):** 
- `ApiModuloController.php`: ahora retorna `stripe_mensual` y `stripe_anual` (Stripe Price IDs) en la respuesta JSON del endpoint `/api/modulos`.
- `ModulosSeeder.php`: corregido para **solo actualizar campos visuales** (`subtitulo`, `descripcion`, `color_primario`, `estado`, `orden`, `caracteristicas`) en registros existentes — NUNCA sobreescribe precios ni Stripe IDs. Para nuevos módulos crea con todos los campos.

**Website (hoy):**
- `Soluciones.jsx`: `combinarModulo()` ahora extrae `stripeMensual` y `stripeAnual` del API.
- `irAlPago()`: si el método de pago es `stripe` y hay un Stripe Price ID disponible, agrega `price_id=...` en la URL del checkout (`app.zyntello.com/checkout`).
- `.env.production` creado con `VITE_ADMIN_URL=https://admin.zyntello.com`.
- API_URL configurable via variable de entorno.

**Sprint noble-shimmying-floyd (completado antes de la sesión de hoy):**
- Tarjetas de Soluciones con header nuevo: icono + nombre + subtítulo + categoría dentro del gradiente.
- Carga dinámica desde API admin (`/api/modulos`) con skeleton loading y manejo de error.
- `combinarModulo()` mapea datos API + datos visuales locales (`MODULO_META`).
- Backend admin completo: migración visual fields, `Modulo.php` fillable actualizado, `ApiModuloController.php` como endpoint público CORS-libre, `ModuloController.php` con validaciones, vistas create/edit con sección "Apariencia".

#### Resumen de sprints completados (commits relevantes)

| Rango | Sprint / Área | Descripción breve |
|---|---|---|
| `[#411]` | ERP Dashboard | Rediseño dashboard 12 módulos |
| `[#490–#500]` | Events | Módulo completo — CRUD, QR, check-in, live dashboard, sala fullscreen, reportes, APK, dark theme, hardening |
| `[#574–#580]` | Events APK + PSA fix | APK dark theme, fix QR modal Alpine scope, helper seguro PSA producción |
| `[#581–#595]` | Usuarios internos + Seguridad | CRUD usuarios internos, gates granulares, PSA timecheck gerencial, permisos árbol 13 módulos, `tn_permission_grants`, fix deploys Bluehost, fix ERR_TOO_MANY_REDIRECTS |
| `[#606–#607]` | PSA Sprints 6–7 | Módulo Ausencias + Módulo Gastos completos |
| `[#629–#630]` | PSA Sprint 29 | QuickBooks config + IA estadística (`PsaIaService`: sugerencias y anomalías) |
| `[#631]` | CRM Sprint 1 | Pipeline CRM completo — kanban drag & drop, leads, notas, tareas, fuentes, config |
| `[#637–#644]` | CRM Sprints 2–5 | Contactos, conversión lead→cliente, presupuestos vendedor, email SMTP, notificaciones, integración PSA + Facturación |
| `[#653–#656]` | CRM Sprints 7–10 | Permisos granulares CRM, conversión nativa in-CRM, revenue real facturas, asignación leads a usuarios |
| `[#697]` | Inventario Fase 8 | Dashboard enriquecido, Kardex por artículo, criterios en menú, seed inventario |
| `[#726–#732]` | PSA Mi Espacio | Panel ponche inteligente, timesheet rechazado editable, selector proyecto en ponche, 9 fixes producción |
| `[#733–#735]` | PSA Nómina RD | ISR DOM progresivo, conceptos CRUD, liquidaciones CT-RD, salario navideño, Gestión Humana documentos |
| `[#736–#740]` | Nómina Gestión Laboral | Documentos RRHH, cartas laborales/bancarias, entidades bancarias unificadas (`ban_entidades`) |
| `[#741–#743]` | Fix Deploy Bluehost | Migraciones PSA sin FK corregidas, CxC/CxP closure `use()` fix, color-scheme dark en assets |
| `[#744–#745]` | DemoSeeder + Seguridad | Fix CrmDemoSeeder, auditoría masiva `abort_unless` en 816 métodos de 149 controladores |
| `[#746–#750]` | Fixes ERP varios | Fix rutas nómina, cuentas contabilidad, relación proveedor CxP, Condiciones de Pago CRUD, fix onboarding |
| `[#751–#753]` | Fixes artículos + CxC | Código artículo obligatorio, fix edición empresa 403, fix `CxcService::registrarCobro` params |
| `[#754]` | Proveedores/Clientes | Columna Código visible + filtro búsqueda por nombre/código/RNC en index |
| `[#755–#778]` | **Contabilidad completa** | Plan cuentas, CC, tipos, diferidos, cierre anual, ajuste inflación, consolidación, integración contable, 7 reportes financieros |
| `[#779–#785]` | Contabilidad Bug Fixes | Seeds, fix parámetros de ruta, unique multi-tenant tipos diferido, eliminación duplicados monedas/paises/TC |
| `[#786]` | **DGII 606/607** | Reportes fiscales Compras y Ventas con exportación DGII; sidebar contabilidad completo |
| `[#796]` | **Contabilidad bug fixes** | Empresa nueva operativa al instante (seed 20 tipos asiento + período + clasificaciones), fix route binding override EmpresaController, fix ConsolidacionController 500, guards informativos AsientoDiario |
| `[#797]` | Empresa contable auto-creada | `ContabilidadEmpresaService`: empresa contable se crea automáticamente al crear empresa fiscal. Sincronización bidireccional nombre/RNC/dirección. Sin formulario manual. Accesos rápidos a config contable desde EmpresaController |
| `[#798]` | **Onboarding sincronizar empresa** | Onboarding sincroniza empresa principal con país y moneda elegidos. Elimina separación entre company y empresa fiscal — datos coherentes desde el primer login |
| `[#799]` | **Docs CLAUDE.md** | Bitácora técnica CLAUDE.md actualizada con detalle técnico commits [#796] contabilidad bug fixes |
| `[#801]` | **Inventario Fase 9** | Integración real con Facturación — `FacturacionStockService`, salida de stock al facturar, revertir al anular, asiento contable automático |
| `[#802]` | **Compras Sprint 8.1** | Recepciones generan entrada al inventario: `inv_movimiento` tipo COMPRA al recibir, ajuste costo promedio |
| `[#803]` | **Inventario Fase 10** | Stock visible en lista artículos (JOIN inv_stock), filtro bajo mínimo, badge rojo alerta |
| `[#804]` | **Inventario Fase 11** | Alertas reorden accionables: `ReordenService::getAlertas()`, botón "Crear RC" desde dashboard inventario |
| `[#805]` | **Facturación reserva stock** | `FacturacionStockService` reserva/libera `inv_stock.cantidad_reservada` en pedidos. Libera al facturar |
| `[#806]` | **Facturación devoluciones re-stock** | `aplicarDevolucion()` y `aplicarAnulacionVenta()`: crea movimiento DEV/ANV e invierte stock. `bodega_id` en `fact_devoluciones` |
| `[#807]` | **Facturación email facturas** | `FacturaMailable` + template HTML responsive. `FacturaController::enviarEmail()` con soft failure. Botón Nota de Crédito en show. `ventas-cliente` en sidebar |
| `[#808]` | **Cotización email + CRM sidebar** | `CotizacionMailable` + template con condiciones y vigencia. Auto-avance borrador→enviada al enviar. CRM sidebar: 4→10 ítems (contactos, presupuestos, reportes, fuentes, estados-gestión) |
| `[#818]` | **Compras: Liquidación de Importación** | 4 tablas (`pur_liquidaciones`, recepciones, gastos, artículos). `LiquidacionService`: calcular() distribuye gastos por método (valor_fob/cantidad/etc.), liquidar() actualiza inv_stock + CxP + asiento contable, anular() revierte. CRUD + vistas completas. |
| `[admin #494–#495]` | **Website Soluciones dinámicas** | Tarjetas carga desde API admin, Stripe Price IDs en checkout, seeder seguro para campos visuales |
| `[#824]` | **Fix layout + rutas integración contable** | 8 módulos tenían rutas integración contable fuera de su `Route::prefix`. mx-auto removido en 14 vistas. Filtro CC corregido a `doesntHave`. |
| `[#827–#828]` | **Buscador artículos Compras** | Fix Alpine x-data scope modal; buscador reescrito con `x-teleport`, 3 filtros, dblclick-select, window CustomEvents; CC por línea en requisiciones |
| `[#829–#830]` | **Departamento en Requisiciones + sidebar fix** | `departamento_id` en requisiciones + `_deptCcMap` JS; sidebar integración contable restaurado en 11 módulos |
| `[#831–#832]` | **Fix CC vacío + helpers empresa contable** | `DepartmentController` buscaba cont_* por UUID erróneo; helpers `empresa_contable()` / `empresa_contable_id()` en `app/helpers.php` |
| `[#833]` | **Unificación empresa_id (arquitectural)** | Migración 25 tablas `cont_*`: `empresa_id = empresas.id`. Modelo `Contabilidad\Empresa` PK=empresa_id + accessor. Cero cambios en 29 controllers. `empresa_activa()->id === empresa_activa_contable->id` |
| `[#834]` | **Facturación: buscador artículos directiva + fixes** | `facturacion/shared/buscador-articulo.blade.php` nuevo (CustomEvents abrir_art_fact/art_fact_seleccionado, x-teleport, 3 filtros, precio venta). Totales reordenados en cotizaciones/create (subtotal primero, inputs integrados, w-96). Fix vendedores/cobradores edit 404 (HasEmpresa + route binding). Fix ConfiguracionFiscal UNIQUE violation (sinScopeEmpresa updateOrCreate). |
| `[#835]` | **Nómina: ubicación cascade, datos bancarios, cumpleaños fix** | Pestaña Ubicación con cascade País→Estado→Ciudad (fetch→PsaGeoController). Nueva pestaña Datos Bancarios (entidad_bancaria_id/numero_cuenta/tipo_cuenta). Migración nom_employees sin FK. Calendario cumpleaños: grid único 7 cols, offset lunes-primero, indicador hoy, panel detalle. Totales facturas/pedidos/create reordenados igual que cotizaciones. |
| `[#837]` | **CRM Mejoras Hyplast: Quill + kanban búsqueda + top vendedores** | Quill WYSIWYG en notas (dark theme). Checkbox fijar, botón fijar/desfijar PATCH. Sort fijadas primero. Kanban: búsqueda por columna (Alpine), badge fuente en tarjetas. Dashboard: top vendedores del mes. Fix: relación 'notas'→'leadNotas' en show(). Blueprints CRM-Hyplast y Facturación-pendientes. |
| `[#839]` | **CRM-H2: Kanban Sortable.js para tareas** | Vista doble lista/kanban con toggle. 3 columnas (Nuevo/En Proceso/Finalizado). Drag & drop con Sortable.js 1.15.2. Endpoint PATCH actualizarEstadoTarea. SweetAlert2 en ambas vistas. |
| `[#840]` | **Facturación: Incoterms + Bonificaciones** | `fact_incoterms` catálogo global (11 incoterms, sin empresa_id). `incoterm_id` en cotizaciones/pedidos/facturas. `IncotermsController` global CRUD. `fact_bonificaciones` multi-tenant (cantidad_gratis/descuento_pct/articulo_gratis). `BonificacionService::calcularBonificaciones()`. CRUD + panel AJAX en documentos. Deploy: 3 migraciones. |

#### Detalle commits recientes [#779–#786]

- `[#779]` ContabilidadSeeder — tipos diferido LIN/ACD/SEG/DEP/OTR + fix clasificación en CRUD TipoDiferido.
- `[#780]` Fix migración `_000002` — índice único `cont_tipos_diferido` ahora multi-tenant `(empresa_id, codigo)`.
- `[#781]` Fix módulo diferidos — columnas reales en migration + model/service/controller/vistas alineados.
- `[#782]` Seed clasificaciones NIIF por empresa (8 clasificaciones) en ContabilidadSeeder.
- `[#783]` `6fdddc22` Fix ruta clasificaciones — `->parameters(['clasificaciones' => 'clasificacion'])`. Laravel auto-singulariza en inglés (clasificaciones → `{clasificacione}`). Requiere override explícito.
- `[#784]` `0acaff13` Fix producción tipos diferido — índice único simple de era pre-multi-tenant. Nueva migración `_000005` lo reemplaza con `(empresa_id, codigo)`. `insertOrIgnore` en seed.
- `[#785]` `0b5d4295` Eliminar monedas/paises/tipos-cambio duplicados de contabilidad. Arquitectura: `monedas` = catálogo global; `tasas_cambio` = historial por empresa. Tipos de cambio de contabilidad usaban columnas inexistentes.
- `[#786]` `ed79b6b2` **DGII 606/607** — `DgiiReportesController` + 3 vistas + rutas + sidebar. 606 usa `cxp_documentos` (NCF en `numero_documento_electronico`). 607 usa `fact_facturas` (NCF en `ncf`, ITBIS en `total_itbis`). Exportación `.txt` separado por pipes. RNC vía `nits.nit`. También agrega balanza-comprobacion y centros-costo al sidebar reportes.
- `[#796]` `f8734f9d` **Contabilidad fix empresa nueva** — (1) `EmpresaController::store()` siembra datos iniciales automáticamente: config contable, período abierto del mes, 20 tipos asiento, 5 tipos CC, 3 tipos diferido, 12 clasificaciones NIIF. (2) Fix route binding override en `edit/update/destroy/modulos`: el parámetro `Empresa $empresa` ya no se sobreescribe con `empresa_activa()` — se usa `$empresaERP`. (3) `ConsolidacionController::index()` corregido: `cont_grupos_consolidacion` sin `company_id` → filtrado via `whereHas('empresaControladora')`. (4) `AsientoDiarioController::create()` con guards informativos: si no hay tipos/períodos/cuentas → redirect con mensaje específico en lugar de error genérico.



#### Sprint pendiente — Sistema de Caja y Pago en Efectivo (Facturación)

#### Sprint pendiente — Prestamello (antes ZynCredi)
- Implementar módulo Prestamello: sistema para prestamistas y ventas a crédito, APK + PWA, inspirado en Préstamos Cloud/Easypres.
- Blueprint completo en `app/zyntello-app/zyntello-prestamello-blueprint.md`.
- Incluye: gestión de clientes, préstamos, ventas a crédito, cobros, caja, rutas, recibos digitales, pagos online (PayPal, Mercado Pago, Stripe), impresión Bluetooth, geolocalización, notificaciones push, roles, auditoría, offline sync.
- Instrucciones detalladas de integración de pagos y renombrado a Prestamello en blueprint.
- Toda la documentación y memorias actualizadas con el nuevo nombre.
  - Controlador: `ReporteFacturacionController` (`libroVentas()`, `rentabilidad()`).
  - Patrones técnicos: filtros GET por fecha y estado, tabla responsive, KPIs arriba, totales en footer. Rentabilidad calcula costo sumando `costo_unitario * cantidad` de cada línea de factura. Si artículos no tienen costo, muestra alerta en amarillo.
  - Se documentó la existencia, acceso y patrones técnicos en memorias y bitácora.

- `[#797]` **ContabilidadEmpresaService** — empresa contable se auto-crea desde empresa fiscal. Middleware `EnsureEmpresaContableAccess` ya no pide formulario. `edit()` sincroniza datos, `update()` solo permite `empresa_matriz_id`.
- `[#798]` **Onboarding sincroniza** — company + empresa fiscal comparten país y moneda desde el primer login.
- `[#799]` Docs: bitácora CLAUDE.md actualizada.
- `[#801]` `2656ed88` **Inventario Fase 9** — `FacturacionStockService::aplicarSalida()` al facturar y `revertirMovimientoDocumento()` al anular. Asiento contable automático al mover stock.
- `[#802]` `3f3e3782` **Compras Sprint 8.1** — `RecepcionController` genera `inv_movimiento` tipo COMPRA + ajusta `inv_costo_promedio` al recibir mercancía.
- `[#803]` `8e882fab` **Inventario Fase 10** — JOIN `inv_stock` en lista artículos, columna stock total, filtro `?bajo_minimo=1`, badge rojo.
- `[#804]` `3005c7a1` **Inventario Fase 11** — `ReordenService::getAlertas()` + botón "Crear RC" desde dashboard → pre-llena `RequisicionController::create()`.
- `[#805]` `7fb5b083` **Reserva stock pedidos** — `FacturacionStockService::reservarPedido()` / `liberarReserva()`. Reserva en `inv_stock.cantidad_reservada` al confirmar pedido; libera al facturar o anular.
- `[#806]` `89ed23de` **Devoluciones re-stock** — `aplicarDevolucion()` + `aplicarAnulacionVenta()` crean movimiento DEV/ANV e invierten `inv_stock`. Migración agrega `bodega_id` y `movimiento_inventario_id` a `fact_devoluciones`.
- `[#807]` `3d7ed432` **Factura email** — `FacturaMailable` + template HTML responsive. `FacturaController::enviarEmail()` valida email+mensaje, soft failure SMTP. Botón Nota de Crédito en show (si `emitida`). Botón Enviar email + modal Alpine con email pre-cargado del cliente. `ventas-cliente` en sidebar reportes.
- `[#808]` `dcdf6f92` **Cotización email + CRM sidebar** — `CotizacionMailable` + template con condiciones de la cotización y fecha de vigencia destacada. Auto-marca como `enviada` si estaba en `borrador` al enviar email. Modal Alpine en show cotizaciones. CRM sidebar: 4 → 10 ítems: Contactos, Presupuesto de ventas, Reportes CRM, Fuentes de leads, Estados de gestión.
- `[#818]` `c87972e4` **Compras: Liquidación de Importación** — Sprint completo para liquidar costos de importación/compra sobre múltiples recepciones. Tablas: `pur_liquidaciones` (header), `pur_liquidacion_recepciones` (M:M), `pur_liquidacion_gastos` (flete/seguro/arancel/etc. multimoneda con TC propio), `pur_liquidacion_articulos` (resultado distribución). `LiquidacionService::calcular()` distribuye total_gastos_local entre las líneas de recepción según método (valor_fob/cantidad/peso/volumen/manual). `liquidar()` ajusta `inv_stock.costo_promedio_local` sumando el costo adicional por unidad, crea CxP vía `CxpService` para gastos con `crear_cxp=true`, registra asiento DR Inventario / CR CxP via `MovimientoFinancieroService`. `anular()` revierte ajuste de costo con GREATEST(0, ...) y cancela CxPs. TC FOB configurable por liquidación (override global, o usa TC de la OC por línea). Vistas: index con filtros (status/tipo/búsqueda), create (tipo local/importacion, método distribución, TC FOB), show (flujo completo: recepciones → gastos → distribución por artículo → acciones calcular/liquidar/anular). Sidebar compras actualizado.

**Sesión 2026-05-24 (Compras buscador artículos + Unificación empresa_id, commits [#824] + [#827]–[#833]):**

- `[#824]` **Fix layout + rutas integración contable + filtro CC + mx-auto global** — 8 módulos tenían rutas de integración contable fuera de su `Route::prefix`; movidas adentro (CF/NOM/FACT/INV/AF/CCH/COM/PG). Filtro CC en `ParametrosContablesController::apiCuentas()` corregido de `where('requiere_centro_costo', false)` (siempre devolvía todo) a `doesntHave('centrosCosto')`. mx-auto eliminado en 14 vistas de módulos.
- `[#827]` **Fix modal buscador artículos** — scope Alpine.js incorrecto: `x-data` estaba en div interno; movido al wrapper externo de la vista. El modal abre correctamente.
- `[#828]` **Buscador artículos Compras completo** — `resources/views/compras/shared/buscador-articulo.blade.php`: Alpine self-contained con `x-teleport="body"`, 3 filtros client-side, doble clic para seleccionar, comunicación vía window CustomEvents (`abrir_art_compras` / `art_compras_seleccionado`). Migración `000003` agrega `centro_costo_id` a `pur_requisition_lines` y `departamento_id` a `pur_requisitions`.
- `[#829]` **Departamento + _deptCcMap en Requisiciones + limpieza sidebar** — selector departamento en create.blade.php; mapa JS `_deptCcMap` auto-asigna CC al elegir departamento. Error incluido: se removieron todas las entradas `integracion-contable.show` de módulos (no solo las del área general).
- `[#830]` **Restaurar Integración Contable en sidebar todos los módulos** — `config/modules.php`: restauradas secciones `configuracion` con `integracion-contable.show` en CxP, CxC, Bancos, Activos, CajaCh, Compras, Presupuesto, CF, Nómina, Inventario, Facturación. Departamentos agregado a Compras > Tablas.
- `[#831]` **Fix combo CC vacío en DepartmentController** — causa: `empresa_activa()->id` es `empresas.id` pero `cont_centros_costo.empresa_id` apuntaba a `cont_empresas.id` (UUID diferente). Fix temporal: lookup intermedio.
- `[#832]` **Helpers empresa contable** — `empresa_contable(): ?Contabilidad\Empresa` y `empresa_contable_id(): ?string` en `app/helpers.php`. Simplifican cualquier módulo que necesite queries `cont_*`. `DepartmentController` simplificado para usarlos.
- `[#833]` **Unificación arquitectural empresa_id** — **migración `2026_05_24_000004_unify_cont_empresa_id`**: 25 tablas `cont_*` actualizadas vía UPDATE JOIN (`empresa_id = cont_empresas.empresa_id`). **Modelo `Contabilidad\Empresa`**: `$primaryKey='empresa_id'`, `uniqueIds()=['id']`, accessor `getIdAttribute()` retorna `empresa_id`. 25 relaciones `belongsTo` corregidas a `\App\Models\Empresa::class`. Helper `empresa_contable_id()` simplificado a `empresa_activa()?->id`. **Resultado**: `empresa_activa()->id === empresa_activa_contable->id`. Cero cambios en los 29 controllers de Contabilidad. Ver **Directiva Global** en `app/zyntello-app/CLAUDE.md`.

**Sesión 2026-05-25 (Facturación fixes + Nómina mejoras, commits [#834]–[#835]):**

- `[#834]` `a7245a66` **Facturación — buscador artículos directiva + totales + fixes:**
  - `facturacion/shared/buscador-articulo.blade.php` (NUEVO): modal Alpine self-contained con `x-teleport="body"`, eventos `abrir_art_fact` / `art_fact_seleccionado`, 3 filtros (código/descripción/grupo), doble clic para seleccionar, retorna precio de venta. Reutilizado en cotizaciones, facturas y pedidos (create y edit).
  - Totales reordenados en `cotizaciones/create.blade.php`: subtotal primero, luego `(-) Descuento` con selector %/Monto + input integrado, `(+) Flete/Doc./Transporte` con inputs integrados, ITBIS, Total. Container `w-96`.
  - **Fix VendedorController / CobradorController edit 404**: trait `HasEmpresa` global scope filtraba por `empresa_id` en route model binding. Solución: cambiar firma a `string $id` + `sinScopeEmpresa()->findOrFail()`.
  - **Fix ConfiguracionFiscalController UNIQUE violation**: `HasEmpresa` scope sobre `updateOrCreate` creaba nuevo registro cuando el existente tenía `empresa_id` diferente. Solución: `sinScopeEmpresa()->updateOrCreate(...)`. Fix cuentas contables vacías: usar `empresa_activa()?->id` directo (post-[#833]).
  - **Regla permanente**: Si un controlador usa route model binding con un modelo que tiene `HasEmpresa`, el scope puede filtrar el registro → 404. Solución: recibir `string $id` y resolver manualmente. Si `updateOrCreate` falla con UNIQUE, usar `sinScopeEmpresa()`.

- `[#835]` `fe70cf5a` **Nómina — cascade ubicación, datos bancarios, cumpleaños fix:**
  - `routes/modules/nomina.php`: rutas `GET /nomina/api/geo/estados` y `/ciudades` → `PsaGeoController` (reutiliza controlador PSA). Respuesta: `{ data: [{codigo, nombre}] }`.
  - `employees/create.blade.php`: Alpine `onPaisChange` y `onEstadoChange` con `fetch` a las rutas geo. Selects habilitados dinámicamente. Nueva pestaña "Datos bancarios" con entidad financiera, número de cuenta y tipo.
  - `employees/edit.blade.php`: igual + `x-init="initGeo()"` que carga estados/ciudades previos al montar (para pre-seleccionar valores del empleado editado).
  - `employees/show.blade.php`: muestra Estado/Ciudad + bloque Datos bancarios si existen.
  - `Employee model`: `$fillable` con `entidad_bancaria_id`, `numero_cuenta`, `tipo_cuenta` + relación `entidadBancaria()`.
  - `EmployeeController`: pasa `$entidadesBancarias` en create/edit; valida 3 campos bancarios en store/update.
  - `migrations/2026_05_25_100001_add_datos_bancarios_to_nom_employees.php`: 3 columnas nuevas en `nom_employees`. Sin FK para evitar error 1215 Bluehost. Sentinel `hasColumn`.
  - `nomina/reportes/cumpleanos-calendario.blade.php`: grid único 7 columnas (no sub-grids), offset lunes-primero `($iniciaSemana + 6) % 7`, detección finde correcta, círculo hoy, contador por día, panel detalle al pie.
  - `facturas/create.blade.php` + `pedidos/create.blade.php`: totales reordenados (igual que cotizaciones en [#834]).
  - **Deploy requerido:** `https://app.zyntello.com/zyn-maint/migrate-y-limpiar?key=XXX` para crear columnas bancarias en `nom_employees`.

- `[#837]` `2b72206d` **CRM Mejoras Hyplast: Quill notas + kanban búsqueda + top vendedores:**
  - **CRM-H1 Notas Quill:** Editor Quill (snow/dark) reemplaza textarea en `leads/show.blade.php`. Checkbox Fijar nota. Botón 📌 fijar/desfijar en cada nota con PATCH vía nuevo endpoint. Notas fijadas primero (sort colección), borde amber. Contenido HTML renderizado con `{!! !!}`. SweetAlert2 para confirmación de eliminar.
  - **CRM-H3 Kanban búsqueda:** Input "Buscar..." por columna — Alpine `buscar` + `x-show` con filtro client-side. Badge fuente (sky-500) en tarjetas del kanban.
  - **CRM-H5 Top vendedores:** Query en `CrmDashboardController` agrupada por `asignado_a` donde `ganado_en` es del mes actual. Sección "🏆 Top Vendedores (mes)" en panel lateral del dashboard.
  - Fix: `CrmLeadController::show()` cargaba relación inexistente `'notas'`; corregido a `'leadNotas'`/`'leadNotas.user'`.
  - Blueprints creados: `zyntello-crm-mejoras-hyplast-blueprint.md` y `zyntello-facturacion-pendientes-blueprint.md`.

### Mini guía operativa post-deploy (sin SSH)

1. Ejecutar `https://app.zyntello.com/zyn-maint/migrate-y-limpiar?key=XXX`.
2. Validar estado en `https://app.zyntello.com/zyn-maint/migrate-status?key=XXX`.
3. Si hay error, revisar `https://app.zyntello.com/zyn-maint/logs?key=XXX&filter=ERROR`.
4. Confirmar auditoría de deploy en servidor: `storage/logs/deploy-migrate.log`.
5. Confirmar auditoría de estado en servidor: `storage/logs/deploy-migrate-status.log`.

---

## Tecnologías por proyecto

| Proyecto | Stack |
|---|---|
| Sitio web | React 19 + Vite + Bootstrap 5 (dark) |
| App SaaS unificada | Laravel 11 + Livewire 3 + Tailwind CSS + Alpine.js + MySQL (BD única) |

---

## Módulos del sitio web (src/components/)

| Componente | Sección |
|---|---|
| `Navbar.jsx` | — |
| `Hero.jsx` | `#inicio` (canvas animado + stats) |
| `Servicios.jsx` | `#servicios` (10 servicios) |
| `Soluciones.jsx` | `#soluciones` (módulos SaaS) |
| `PorQueZyntello.jsx` | `#porque` |
| `Portafolio.jsx` | `#portafolio` |
| `Nosotros.jsx` | `#nosotros` |
| `Contacto.jsx` | `#contacto` (Web3Forms) |
| `WhatsAppChat.jsx` | Chatbot |
| `NeuralBackground.jsx` | Canvas Hero |

**Formulario de contacto:** Web3Forms — Access Key `d27d70b8-3963-46b4-aac4-7086a3d20f05` → info@zyntello.com.

---

## Servicios de Zyntello (10)
1. Automatización con IA · 2. ERP y CRM (Softland, Profit) · 3. Soporte TI · 4. Colocación de Personal · 5. Venta de Equipos · 6. Transformación Digital · 7. Consultoría Contable · 8. Marketing Digital · 9. Consultoría Electoral · 10. Encuestas & Estudios

---

## ⚠️ Regla de arquitectura — LEER ANTES DE CREAR CUALQUIER MÓDULO

> **Definitiva, sin excepciones.**

Cuando se pida crear una nueva funcionalidad de negocio (CRM, RRHH, encuestas, lo que sea), **siempre** se agrega como módulo dentro de `app/zyntello-app/`. Detalles del checklist completo en `app/zyntello-app/CLAUDE.md`.

### Resumen del checklist (módulo nuevo)

1. **Rutas** — `routes/modules/{slug}.php` con `Route::prefix('{slug}')->name('{slug}.')` interno; `web.php` solo aplica `module:{slug}`
2. **Controladores** — `app/Http/Controllers/{Modulo}/`
3. **Modelos** — `app/Models/{Modulo}/` **sin** `$connection`
4. **Migraciones** — **sin** `$connection`. Prefijo de tabla obligatorio (`xxx_*`)
5. **BD** — usar `zyntello_app` con prefijo. Nunca crear BD nueva
6. **PricingService** — registrar el slug en `App\Services\PricingService::MODULES`
7. **Vistas** — `resources/views/{slug}/` (full-width Tailwind, sin max-width centrado)
8. **DemoSeeder** — agregar datos demo y el slug a la lista de módulos activos

### Lo que NUNCA se debe hacer
- ❌ Crear `app/{modulo}/` u otra carpeta hermana de `zyntello-app`
- ❌ Repo Laravel separado para el módulo
- ❌ Subdominio nuevo
- ❌ `$connection` en modelos o migraciones
- ❌ BD nueva o conexión nueva en `config/database.php`
- ❌ `Route::prefix` en `web.php` (va dentro del archivo de rutas del módulo)

---

## Convenciones de trabajo

- Todo el código, comentarios, mensajes de commit y documentación en **español**
- Mensajes de commit siempre `[#NNN]` (cada repo lleva su propia secuencia)
- Scroll snap entre secciones (`scroll-snap-type: y mandatory`); cada sección `min-height: 100vh; scroll-snap-align: start`
- No usar `.gitignore` para excluir `dist/` — debe commitearse para Bluehost
- **SweetAlert2** obligatorio para confirmaciones — nunca `confirm()` / `alert()`
- **Vistas:** full-width responsive, sin `max-width` centrado
- **Asociaciones funcionales entre módulos:** usar códigos de negocio (ej. código de empleado) y no nombres/apellidos
- **Migraciones ejecutadas:** nunca editarlas; siempre crear migración nueva
- **Sin SSH en Bluehost:** usar cPanel Terminal, phpMyAdmin o rutas `/zyn-maint/*?key=XXX`

---

## Planes activos

Los planes vigentes están en `C:\Users\Sistemas\.claude\plans\`:

- `linear-jumping-sprout.md` — Conectar módulos ERP + limpieza arquitectura BD única (ejecutado en commits `[#407]` y `[#408]` de zyntello-app)
- `noble-shimmying-floyd.md` — (ver archivo)

> Antes de iniciar trabajo grande, leer el plan correspondiente. Al terminar un plan, dejarlo marcado o moverlo según convenga.

---

## 🗺️ Guía para nuevas IAs y nuevos miembros del equipo

> Esta sección explica cómo funciona el ecosistema Zyntello desde el punto de vista de colaboración técnica. Léela completa antes de iniciar cualquier trabajo.

### Cómo se relacionan los 3 repositorios

```
┌─────────────────────────────────────────────────────────────────┐
│                    ECOSISTEMA ZYNTELLO                          │
│                                                                 │
│  zyntello-website (React + Vite)                                │
│  ─────────────────────────────────                              │
│  Sitio de marketing: zyntello.com                               │
│  • NO tiene lógica de negocio                                   │
│  • NO se conecta a la BD                                        │
│  • Muestra módulos SaaS disponibles, precios, contacto          │
│  • Deploy: build dist/ → cPanel Git → zyntello.com              │
│                           │                                     │
│              "Me interesa" / "Comprar"                          │
│                           ▼                                     │
│  zyntello-admin (Laravel 12 + Livewire 4)                       │
│  ────────────────────────────────────────                       │
│  Panel INTERNO: admin.zyntello.com                              │
│  • Solo accede el equipo de Zyntello S.R.L.                     │
│  • Crea Companies (tenants) en la BD admin                      │
│  • Activa módulos por Company en company_modules                │
│  • Gestiona suscripciones, pagos, Stripe webhooks               │
│  • BD: ukrmeumy_zyntello_admin (separada)                       │
│                           │                                     │
│           "Activa módulo X para Company Y"                      │
│           ──────────────────────────────►                       │
│                           │   (company_modules)                 │
│                           ▼                                     │
│  zyntello-app (Laravel 11 + Livewire 3)                         │
│  ──────────────────────────────────────                         │
│  App SaaS: app.zyntello.com                                     │
│  • Todos los módulos ERP en UN solo repo                        │
│  • Multi-tenant: cada Company ve solo sus datos                 │
│  • Multi-empresa: cada Company puede tener N empresas           │
│  • BD: ukrmeumy_zyntello (tablas con prefijos por módulo)       │
│  • Bluehost sin SSH: deploy por cPanel Git + /zyn-maint/*       │
└─────────────────────────────────────────────────────────────────┘
```

**Flujo completo de un cliente nuevo:**
1. Ve el sitio en `zyntello.com` (website)
2. Contacta por WhatsApp o formulario
3. El equipo crea una `Company` en `admin.zyntello.com` y activa módulos
4. El cliente accede a `app.zyntello.com`, hace onboarding y crea su empresa
5. Puede usar los módulos que tiene contratados

**¿El admin controla el app?**
Sí, indirectamente: `admin.zyntello.com` gestiona qué `company_modules` tiene activo cada tenant. El middleware `EnsureModuleAccess` en `zyntello-app` bloquea el acceso si el módulo no está en esa tabla.

---

### Cómo trabaja Nestor (el director técnico)

Entender el estilo de dirección evita malentendidos y re-trabajo.

#### Filosofía de desarrollo

1. **Incremental y funcional**: Cada commit entrega una funcionalidad completa que funciona end-to-end. No hay commits parciales. Si se empieza un módulo, se termina con CRUD + rutas + vistas + seed.

2. **Primero arreglar, luego agregar**: Cuando hay bugs en producción, se priorizan los fixes antes de nuevas features. Los errores se documentan en el CLAUDE.md junto con la causa y el fix.

3. **Todo en español**: Código, comentarios, commits, documentación, mensajes de error al usuario — TODO en español. Solo las palabras técnicas (variables, funciones de framework) quedan en inglés cuando es estándar del ecosistema.

4. **Un solo repositorio por producto**: Nunca crear repos separados por módulo ni separados por tema. Hay 3 repos y punto — website, admin, app. Si se pide "crear un módulo X", siempre va dentro de `zyntello-app`.

5. **Fix antes de commit**: Cada vez que se detecta un bug (en producción o en desarrollo), se crea un commit específico de fix antes de continuar. Los fixes no se acumulan.

6. **Sin SSH en producción**: Bluehost no tiene SSH. Todos los deploys son por cPanel Git y las migraciones se corren por rutas HTTP `/zyn-maint/*`. Esto es una restricción de negocio, no una preferencia.

#### Patrones de comunicación con Nestor

- **"Agrega X a Y"**: Implementar completamente — backend, frontend, validaciones, SweetAlert2 para destructivos. No proponer, implementar.
- **"Hay un error"**: Analizar el error real en el código. Mostrar la causa raíz y el fix, no hipótesis.
- **"Actualiza las memorias"**: Actualizar TODOS los archivos de documentación relevantes (CLAUDE.md raíz, app CLAUDE.md, memories repo). No solo uno.
- **"Commitea"**: Hacer `git add` específico de los archivos modificados + commit con formato `[#NNN] descripción` + push a origin/master. Nunca usar `git add .` sin verificar qué se está incluyendo.

#### Reglas de UX/UI que Nestor siempre aplica

- **SweetAlert2** para toda confirmación destructiva. Nunca `window.confirm()`.
- **Tailwind dark theme**: paleta `bg-surface`, `text-text`, `text-text-muted`, `border-border`, `bg-primary`.
- **Sin `max-width` centrado en vistas**: todas las vistas son full-width responsive.
- **Alpine.js para interactividad inline**: modales, toggles, formularios dinámicos. No Livewire para cosas pequeñas.
- **`font-mono`** para mostrar códigos (artículos, empleados, clientes). Diferencia claramente IDs de nombres.
- **Paginación con `withQueryString()`**: siempre preservar filtros al paginar.

#### Cómo interpretar las instrucciones implícitas

| Frase del usuario | Lo que realmente pide |
|---|---|
| "agrega un filtro de búsqueda" | Barra de búsqueda GET + filtro LIKE en el controller + limpiar filtro con ✕ |
| "agrega el código" | Columna visible en la tabla + campo en el formulario si no existe |
| "arregla el error 403" | Revisar si `empresa_activa()` está sobreescribiendo un parámetro de ruta |
| "actualiza el commit" | Hacer `git add` de los archivos cambiados + nuevo commit + push |
| "registra los cambios" | Actualizar CLAUDE.md + memories con la bitácora completa de la sesión |
| "no funciona en producción" | Primero verificar si falta deploy (cPanel pull) + migraciones pendientes |

---

### Guía de depuración rápida

**Error 403 inesperado en un controlador:**
→ Verificar si `empresa_activa()` se llama en un método que recibe `$empresa` por route model binding (ej: `edit(Empresa $empresa)`). Si es así, la llamada sobreescribe el parámetro. Solución: eliminar esa línea.

**`Undefined variable` en closure:**
→ Las variables externas usadas dentro de `function() { ... }` deben pasarse con `use ($var1, $var2)`. PHP no captura el scope exterior automáticamente como JS.

**`Unknown named parameter $xxx` en PHP 8:**
→ El método fue llamado con parámetros nombrados incorrectos. Verificar la firma real del método en el archivo del Service/Controller.

**Error 1215 en migración Bluehost (Foreign key constraint):**
→ Bluehost no puede crear FK de UUID referenciando una tabla que no existe aún. Solución: crear migración nueva sin FK + registrar la migración vieja en `autoRegistrarPendientes()` para saltarla.

**`Table 'xxx' doesn't exist` en producción:**
→ Las migraciones están pusheadas pero no se han ejecutado. Ir a: `https://app.zyntello.com/zyn-maint/migrate-y-limpiar?key=XXX`

**`BindingResolutionException: psa_empleado_activo`:**
→ Se usó `app('psa_empleado_activo')` directamente en lugar del helper seguro `psa_empleado_activo()`. El helper verifica `app()->bound()` antes de resolver.

---

### Blueprints disponibles

Los blueprints describen la arquitectura detallada de cada módulo complejo:

| Módulo | Blueprint local |
|---|---|
| Aprobaciones | `app/zyntello-app/zyntello-approvals-blueprint.md` |
| Contabilidad | `app/zyntello-app/zyntello-contabilidad-blueprint.md` |
| Inventario | `app/zyntello-app/zyntello-inventario-blueprint.md` |
| PSA | `app/zyntello-app/zyntello-psa-blueprint.md` |
| CRM | `app/zyntello-app/zyntello-crm-blueprint.md` (generado en [#631]) |

Los blueprints describen el diseño conceptual. La implementación real puede diferir — siempre verificar el código real antes de asumir que el blueprint es el estado actual.
