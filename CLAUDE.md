# Zyntello — Ecosistema SaaS

> Directorio raíz: `c:/wamp64/www/zyntello/`
> Dominio principal: zyntello.com
> Hosting: Bluehost (Shared Hosting, sin SSH)
> País de operación principal: República Dominicana
> Operación regional: RD, Venezuela, Colombia, Guatemala, Costa Rica, Soporte Remoto

> **Para detalles de arquitectura interna de la app SaaS, ver `app/zyntello-app/CLAUDE.md`.**
> **Memorias del proyecto:** `C:\Users\Sistemas\.claude\projects\c--wamp64-www-zyntello\memory\MEMORY.md`
> **Planes activos:** `C:\Users\Sistemas\.claude\plans\` (cada plan describe un sprint o refactor en curso)

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

### Bitácora reciente (estado actual)

- Commit `[#411]`: rediseño completo de dashboard ERP (`erp/resumen`) para 12 módulos.
- Commit `[#412]`: fix de ruta `inventario.maestros.articulos.index` y limpieza de contenido duplicado en vista.
- Commit `[#413]`: fix relación `moneda()` faltante en `CuentaPorCobrar`.
- Commit `[#414]`: fix `montoPendiente()` en `CuentaPorCobrar`, `SoftDeletes` en `Company`, y migración de `ban_cuentas.entidad_bancaria_id`.
- Mantenimiento sin SSH reforzado: endpoint `/zyn-maint/migrate-status` y logs de migraciones en deploy cPanel.

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
