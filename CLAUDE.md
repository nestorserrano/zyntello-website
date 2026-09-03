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

## 🇩🇴 DIRECTIVA DE IDIOMA — MANDATORIA, SIN EXCEPCIÓN

> **TODO en español. Absolutamente todo.**
>
> El director técnico (Nestor) **no lee inglés**. Cualquier salida en inglés es trabajo no entregado.
>
> Aplica a:
> - **Respuestas al usuario** — mensajes, resúmenes, explicaciones, preguntas.
> - **Razonamiento visible / pensamientos** — el bloque de análisis que el usuario ve también va en español.
> - **Análisis, auditorías, diagnósticos, reportes de discrepancias.**
> - **Código**: nombres de métodos y variables de negocio, comentarios, docblocks, mensajes de excepción, mensajes de validación, flash messages, textos de vista.
> - **Commits**: `[#NNN] descripción en español`.
> - **Documentación**: CLAUDE.md, blueprints, DISCREPANCIAS, memorias.
> - **Tests**: nombres descriptivos y mensajes de aserción en español.
>
> Única excepción: palabras clave del framework/lenguaje que son estándar técnico
> (`public function`, `Schema::create`, `belongsTo`, nombres de columnas ya existentes, etc.).
>
> Si una herramienta o subagente devuelve algo en inglés, **se traduce antes de mostrarlo**.

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

| Aplicación | BD producción | BD local | Usuario |
|---|---|---|---|
| App SaaS unificada (todos los módulos) | `ukrmeumy_zyntello` | `zyntello_app` (puerto 3308) | `ukrmeumy_zyntello_user` |
| Admin interno | `ukrmeumy_zyntello_admin` | `zyntello_admin` | `ukrmeumy_zyntello_user` |

> 🔐 **Las contraseñas NO se documentan aquí.** Viven en el `.env` de cada entorno —
> el del servidor para producción, el local para desarrollo— y ese archivo está en
> `.gitignore`. Para leer la local: `grep DB_PASSWORD app/zyntello-app/.env`.
> ⚠️ Este repositorio (`zyntello-website`) es **PÚBLICO**: cualquier credencial escrita
> en él queda expuesta en internet y sigue expuesta en el historial de Git aunque
> después se borre del archivo.

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
| `caj_*` | Caja (POS) — integrado a Facturación, sesiones y movimientos de efectivo |
| `cw_*` | Car Wash (vertical) |
| `pre_*` | Prestamello (vertical de préstamos y venta a crédito) |
| `cnd_*` | Condominios (vertical) |
| `rest_*` | Restaurante (vertical de gastronomía) |

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
Deploy via **SSH + plink (PuTTY)** del repo `nestorserrano/zyntello-app` a `/home4/ukrmeumy/public_html/zyntello/app/`.

**Configuración SSH:**
- Key: `C:\wamp64\www\zyntello\zyntello.ppk`
- Host: `ukrmeumy@ukr.meu.mybluehost.me`
- Puerto: `2222`
- Passphrase: **no se documenta** (repo público — pedírsela al director técnico)
- Script automatizado: `.\deploy-bluehost.ps1`

**Deploy manual (PowerShell):**
```powershell
$KEY = "C:\wamp64\www\zyntello\zyntello.ppk"
$SSHHOST = "ukrmeumy@ukr.meu.mybluehost.me"
$PORT = "2222"

# Método 1: Git pull directo (RECOMENDADO - preserva .env)
plink -i $KEY -P $PORT -batch $SSHHOST "cd public_html/zyntello/app && git pull origin master"

# Método 2: Rsync desde repositories (si necesario - CUIDADO con .env)
# plink -i $KEY -P $PORT -batch $SSHHOST "cd repositories/zyntello-app && git pull origin master"
# plink -i $KEY -P $PORT -batch $SSHHOST "rsync -av --delete --exclude='.git' --exclude='storage' --exclude='bootstrap/cache' --exclude='.env' repositories/zyntello-app/ public_html/zyntello/app/"

# Paso 2: Limpiar caché y ejecutar migraciones
plink -i $KEY -P $PORT -batch $SSHHOST "cd public_html/zyntello/app && /usr/local/bin/php artisan optimize:clear && /usr/local/bin/php artisan migrate --force"

# Paso 3: Reconstruir caché optimizado
plink -i $KEY -P $PORT -batch $SSHHOST "cd public_html/zyntello/app && /usr/local/bin/php artisan config:cache && /usr/local/bin/php artisan route:cache && /usr/local/bin/php artisan view:cache"
```

**O ejecutar script completo:**
```powershell
.\deploy-bluehost.ps1
```

**Requisitos:**
- Plink (PuTTY) instalado y en PATH
- `vendor/` y `public/build/` están en el repo (Bluehost no tiene Composer/Node)
- `.env` se mantiene manualmente en el servidor

⚠️ **CRÍTICO — Nunca eliminar .env en producción:**

El archivo `.env` de producción NO está en Git (está en `.gitignore`). Contiene configuración crítica:
- `APP_URL=https://app.zyntello.com` (si falta o dice localhost → app inaccesible)
- Credenciales de base de datos
- MAIL_PASSWORD, APP_KEY

**Si el .env fue eliminado accidentalmente:**
1. Crear nuevo con configuración correcta (ver sección "Bases de datos")
2. `chmod 644 .env`
3. `php artisan config:clear && php artisan config:cache`

**Regla:** Usar `git pull` directo en `public_html/zyntello/app/`. Si usas `rsync`, SIEMPRE `--exclude='.env'`.

⚠️ **IMPORTANTE — Permisos de directorio después de cada deploy:**

**El problema:** Después de cada `rsync` o `git pull`, los directorios pierden permisos de lectura. Apache (usuario `nobody`) no puede acceder → Error 403/500.

**Solución — Ejecutar SIEMPRE después de deploy:**
```powershell
$KEY = "C:\wamp64\www\zyntello\zyntello.ppk"
$SSHHOST = "ukrmeumy@ukr.meu.mybluehost.me"
$PORT = "2222"

# Paso 1: Crear directorios de caché si no existen
plink -i $KEY -P $PORT -batch $SSHHOST "mkdir -p /home4/ukrmeumy/public_html/zyntello/app/storage/framework/{views,cache,sessions}"

# Paso 2: Arreglar permisos (CRÍTICO)
plink -i $KEY -P $PORT -batch $SSHHOST "
  chmod 755 /home4/ukrmeumy/public_html/zyntello/app
  chmod -R 755 /home4/ukrmeumy/public_html/zyntello/app/public
  chmod -R 755 /home4/ukrmeumy/public_html/zyntello/app/bootstrap
  chmod -R 777 /home4/ukrmeumy/public_html/zyntello/app/storage
  chmod -R 777 /home4/ukrmeumy/public_html/zyntello/app/bootstrap/cache
"

# Paso 3: Limpiar caché de vistas compiladas
plink -i $KEY -P $PORT -batch $SSHHOST "rm -rf /home4/ukrmeumy/public_html/zyntello/app/storage/framework/views/*"
```

**Por qué ocurre:** El repositorio local o la sincronización preservan umask restrictivo. Apache necesita:
- **755** en directorios para traverse/list
- **777** en `storage/` para escribir logs/caché

**Regla:** Si ves error 403/500 después de deploy → ejecuta esto primero.

### Bitácora reciente (estado actual — 2026-08-29)

> ⚠️ **AVISO DE DOCUMENTACIÓN**: entre el 2026-08-12 y el 2026-08-27 se trabajaron cinco sesiones
> que **este archivo no registró** (`[ABST-F0-1]`, `[ABST-F1]`, `[ABST-F2]`/`[VISTAS-SOT]`,
> `[DEMO-FIX-1]`, `[CONT-CTA-4/5]`). Su detalle sí está en `app/zyntello-app/CLAUDE.md`, que es
> la bitácora técnica. Se anota aquí para que el hueco no se lea como «no pasó nada».

> **CERRAR SESIÓN EN TODOS LOS DISPOSITIVOS + BLUEPRINT DE 2FA CON APP (2026-09-03) —
> `[SESION-DISPOS-1]`, `[SESION-DISPOS-2]`**: pedido del director técnico tras `[SESION-LOOP-1]` —
> *«sí, que Recordarme mantenga la sesión, pero que me dé una opción de cerrar sesión en todos los
> dispositivos cuando tenga una sospecha y me permita ingresar de nuevo. Podemos agregar
> autenticación de dos pasos… con un sistema como Google Authenticator»*.
> **10 pruebas nuevas, 3 guardas verificadas VIOLÁNDOLAS: las 3 se detectan** · Auth **37 passed** ·
> rutas no sombreadas y ayuda en verde. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`baa3779e`).
> **Sin migración.**
>
> **Son las dos mitades de la misma decisión**: una sesión que ya no caduca sola necesita una forma
> explícita de terminarla a distancia. Pantalla nueva **«Dispositivos conectados»** en el perfil:
> dispositivo, IP y última actividad de cada sesión, con la actual marcada; **cerrar las demás**
> (deja conectado aquí) y **cerrar todas incluida esta** (devuelve al login).
>
> ⚠️⚠️ **NO se usa `Auth::logoutOtherDevices()`, y ese es el hallazgo.** Ese método **no cierra nada
> por sí mismo**: marca la sesión actual y CONFÍA en que el middleware `AuthenticateSession` expulse
> a las demás — y ese middleware **NO está registrado en el grupo `web`** de esta aplicación
> (verificado). Llamarlo habría dejado una función que se ve implementada y **no expulsa a nadie**,
> con el agravante de que se usa justo cuando el usuario cree que alguien entró a su cuenta. Se
> borran las filas de `sessions`, que con el driver `database` es el corte real e inmediato.
>
> ⚠️⚠️ **Y borrar las filas TAMPOCO basta sola, que es el punto de todo esto**: quien marcó
> «Recordarme» —el caso del director técnico— **vuelve a entrar en su siguiente petición**, porque
> Laravel lo re-autentica con el `remember_token` de su cookie y le abre una sesión nueva. Por eso
> se **RECICLA el token**; sin eso *la expulsión duraba hasta el próximo clic del intruso*. W Como el
> token es **uno solo**, eso invalida también la cookie de este dispositivo: el controlador **la
> reemite** para no autoexpulsarse.
>
> ⚠️ **La contraseña se pide aunque ya estés autenticado**: sin ella, cualquiera sentado ante un
> equipo con la sesión abierta podría expulsar al dueño de todos sus dispositivos. Es lo único que
> el intruso no tiene. ⚠️ **Y la pantalla queda FUERA del middleware de suscripción**: cerrar la
> sesión de un dispositivo sospechoso no puede depender de tener el plan al día — con prueba que
> mira los middlewares REALES de la ruta.
>
> ⚠️ **Lo que no se reconoce se NOMBRA**: un `User-Agent` desconocido sale como «Dispositivo
> desconocido» en vez de caer al más común — *es el dato con el que el usuario decide si una sesión
> es suya o de un intruso, y decirle «Chrome en Windows» a quien entró desde otra cosa lo lleva a
> dar por buena la sesión del intruso.*
>
> ⚠️⚠️ **`[SESION-DISPOS-2]` — un defecto propio que encontró VERIFICAR, no las pruebas**: la vista
> asumía `$errors`, que inyecta el middleware `web`. Las pruebas pasaban porque hacen peticiones
> HTTP reales; **el script de verificación en producción reventó**. Es la forma que
> `[INV-CFG-EMP-2]` documentó para un partial del layout. No llegaba a afectar a producción —la
> vista solo la sirve su controlador— pero se corrige igual.
>
> ⚠️ **Y dos trampas de método**: mi prueba de aislamiento contaba filas **por IP** y arrastraba las
> de corridas anteriores (la suite **no usa `RefreshDatabase`**) — corregida para identificar por
> id; y las pruebas HTTP daban **404** hasta poner `URL::forceRootUrl` en el `setUp`, por el subpath
> de `APP_URL` local.
>
> **Verificado en producción renderizando el controlador real**: **881,2 KB**, la sesión del demo
> sale como «Chrome en Windows | 179.61.18.240», las tres rutas resuelven y `/profile/sesiones` sin
> sesión redirige a `/login`. Script de verificación **retirado** (`[#1250]`).
>
> **Y el BLUEPRINT de 2FA con app (TOTP)**: `app/zyntello-app/zyntello-2fa-totp-blueprint.md`,
> **SIN EJECUTAR**. ⚠️ **Lo primero fue medir, y casi todo estaba**: el **2FA por correo YA EXISTE y
> funciona** (código hasheado, vigencia, reenvío, throttle) — **no se toca: es el rescate del
> teléfono perdido** —, **`bacon/bacon-qr-code` YA está instalado** (se usa en Activos, Car Wash y
> e-CF, con `SvgImageBackEnd`, sin depender de GD) y producción corre **PHP 8.3.33** con
> `gd`/`imagick`/`bcmath`/`openssl`/`sodium`. **La única dependencia nueva posible es la librería
> TOTP.** Cinco fases; ⚠️ **F3 (anti-reuso del código y ventana de reloj) no se debe posponer**: sin
> ella el TOTP da una sensación de seguridad que no corresponde a lo que protege.
> ⚠️ **Dos decisiones PENDIENTES del director técnico**: librería TOTP vs. implementación propia
> auditada, y si el 2FA se pide en cada login o se recuerda el dispositivo.
>
> **Reglas nuevas: `Auth::logoutOtherDevices()` no cierra nada por sí mismo — depende de un
> middleware que este proyecto no registra, así que la función se vería hecha sin expulsar a nadie ·
> borrar las filas de `sessions` no expulsa a quien tiene cookie de «Recordarme»: hay que reciclar
> el `remember_token`, y como es uno solo, hay que reemitir la cookie del dispositivo propio · una
> acción de seguridad pide la contraseña aunque el usuario ya esté dentro, porque es lo único que el
> intruso no tiene · lo que no se reconoce se NOMBRA: un dispositivo mal descrito hace que el usuario
> dé por buena la sesión del intruso · una pantalla de seguridad no puede quedar detrás del
> middleware de suscripción · una vista no puede asumir `$errors`, y las pruebas HTTP no lo detectan
> porque el middleware ya lo inyectó · una prueba que cuenta filas por un valor repetible arrastra
> las de corridas anteriores cuando la suite no usa `RefreshDatabase`.**

> **EL BUCLE DE REDIRECCIONES Y LA SESIÓN QUE EXPIRABA SOLA (2026-09-03) — `[SESION-LOOP-1]`**:
> reporte del director técnico con captura — *«cuando tarda en usar el sistema o se hacen
> modificaciones o se actualiza la página da este error y debo borrar la dirección y abrir desde
> `https://app.zyntello.com/` para que pueda volver a entrar; debe el sistema automáticamente
> mantener la sesión sin expirar hasta que cierre el navegador y si se desconecta por cualquier
> razón del servidor ir al login automáticamente»* (`ERR_TOO_MANY_REDIRECTS` en `/settings`).
> **14 pruebas nuevas, 2 guardas verificadas VIOLÁNDOLAS: las 2 se detectan** · Auth **26 passed** ·
> vistas **4 (2 182 aserciones)** · acceso/menú/rutas **335 passed**.
> **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`557f8b55`). **Sin migración.**
>
> ⚠️⚠️ **El manejador genérico de excepciones se estaba tragando la sesión caída.**
> `AuthenticationException` **NO es `HttpException`**, así que la lista de exclusiones de
> `bootstrap/app.php` no la alcanzaba y caía en el bloque de producción, que redirige a
> **`url()->previous()` — o sea, a la pantalla de la que se venía**. Como esa también está
> protegida y la sesión ya no existe, respondía con OTRO redirect a la anterior. **Medido
> reproduciéndolo**: `/settings → /` · `/dashboard → /settings` · `/ayuda → /dashboard` ·
> `/empresas → /ayuda`: un **ping-pong entre las dos últimas páginas visitadas**. Con eso
> `redirectGuestsTo` quedaba **anulado**: el usuario nunca llegaba al login, ni recibía el aviso de
> expiración, ni se reanudaba donde quedó — toda la máquinaria de `[#1485]` estaba muerta.
>
> ⚠️⚠️ **Y el bucle lo cerraba el NAVEGADOR, no el servidor**: el caché de páginas de Bluehost
> (`X-Endurance-Cache-Level: 2`) **añade un segundo `Cache-Control: max-age=300`** encima del
> `no-cache, private` de Laravel. Medido en producción sobre `/settings`, con las **dos** cabeceras
> presentes. Así que el navegador guardaba esas 302 cinco minutos y **reproducía la cadena sin
> volver a preguntarle al servidor**. *Por eso recargar no servía y borrar la barra de direcciones
> sí: no arreglaba nada, se saltaba el caché* — y por eso el síntoma aparecía «tras un rato» o
> «tras una modificación», que son los dos momentos en que la sesión deja de valer.
>
> ⚠️ **El middleware anti-caché va en `prepend`, no en `append`**: la respuesta que Laravel
> construye al renderizar una excepción sube por los middlewares **exteriores**, no por los
> interiores. En `append` quedaba el más interno y **salían sin cabeceras justo las respuestas del
> bucle**. Lo encontró **medir** el `Cache-Control` en las dos posiciones, no leer el código.
>
> ⚠️ **La guarda anti-bucle es para CUALQUIER excepción, no solo la de sesión**: se redirige por
> error **una sola vez**; si la pantalla de destino falla igual, se muestra el error en vez de
> encadenar otro salto. **La marca va en FLASH a propósito** — vive exactamente una petición, así
> que se limpia sola cuando algo carga bien; con una clave normal de sesión habría que borrarla
> desde otro sitio y el primer error del día siguiente ya no redirigiría.
>
> **La sesión pasa a durar hasta que se CIERRE EL NAVEGADOR** (decisión del director técnico:
> eliminarlo para todos): `expire_on_close` en true y el tope del servidor en **7 días**.
> ⚠️ **Los defaults van en `config/session.php`, no solo en el `.env`**, que no está en git: un
> servidor nuevo volvería a los 120 minutos sin que nada lo avisara. ⚠️ **Y el `lifetime` ya no
> significa «lo que el usuario puede estar quieto» sino el tope del servidor** — no se pone
> infinito porque con el driver `database` la limpieza de la tabla `sessions` se hace contra ese
> valor. Se **retira el temporizador de inactividad** del layout; ⚠️ **se conserva el interceptor de
> `fetch`, que es otra cosa**: no decide cerrar, **reacciona** a que el servidor ya cerró — sin él
> la pantalla se queda en pie con los botones mudos.
>
> ⚠️ **Un defecto propio de método**: mi script de violación de la segunda guarda **abortó por un
> escape y no escribió nada**, y el «9 passed» se leyó como «la guarda no detecta su violación»
> cuando **no se había violado nada**. Es la trampa ya documentada; repetido con `assert` sobre el
> ancla, la guarda **sí** se detecta.
>
> **En producción**: las 5 pantallas protegidas resuelven a **`/login` en UN salto** (antes las 5
> iban a `/`), el **`max-age=300` de Bluehost desapareció** de la respuesta —queda solo
> `no-store`— y la cookie `zyntello-session` **ya no lleva `expires` ni `Max-Age`**: es cookie de
> sesión de navegador. ⚠️ **HALLAZGO FUERA DE ALCANCE**: queda `test-proveedor.php` (2026-06-02) en
> la raíz de la app en el servidor; está fuera del document root, así que no es alcanzable por web.
> **No se borró**: es decisión del director técnico.
>
> **Reglas nuevas: `AuthenticationException` no es `HttpException`, así que una lista de
> exclusiones por tipo HTTP no la alcanza — y capturarla anula `redirectGuestsTo` sin que nada lo
> avise · redirigir tras un error solo sirve UNA vez: el segundo salto es el bucle, y la marca que
> lo impide va en FLASH para que se limpie sola · un redirect a `url()->previous()` entre pantallas
> protegidas es un ping-pong, porque el destino falla por la misma causa que el origen · la
> respuesta de una excepción sube por los middlewares EXTERIORES: un middleware de cabeceras en
> `append` no la alcanza · un intermediario puede AÑADIR un `Cache-Control` encima del de Laravel,
> y entonces el bucle lo ejecuta el navegador sin tocar el servidor — se cierra con `no-store`, que
> es imperativo, no con `no-cache` · el default de una política de sesión vive en `config/`, no
> solo en el `.env`, que no está en git · con `expire_on_close` el `lifetime` deja de ser el
> timeout de inactividad y pasa a ser el tope del servidor, y no puede ser infinito porque de él
> depende la limpieza de la tabla `sessions`.**

> **CUATRO SÍNTOMAS, UNA RAÍZ: LA CONFIGURACIÓN ERA POR SUSCRIPTOR (2026-09-03) —
> `[FORM-TABS-1]`, `[INV-CFG-EMP-1/2]`, `[INV-COSTO-1]`, `[INV-TT-1]`**: cuatro reportes del
> director técnico en el mismo hilo — *«en los articulos del demo no estás agregando el impuesto
> cuando se editan no guarda… y el error no se muestra porque es de la primera pestaña y estas en
> la 4 pestaña y no se ve donde esta el error y el usuario se queda esperando. Analiza para
> corregir en toda la suite»* · *«en el movimiento del ajuste de inventario no está trayendo el
> ultimo costo y el costo promedio… creo que debe mantener su costo si es un ajuste»* · *«estoy
> leyendo los codigos de barras que les configure a los articulos ARE-001 y BLO-001 y no los lee»*
> · *«agregalas por migracion y corrige lo que has encontrado»*.
> **12 reglas verificadas VIOLÁNDOLAS: las 12 se detectan** · Inventario **150 passed** ·
> Facturación **141** · Compras **69** · Car Wash **417** · vistas **4 (2 182 aserciones)**.
> **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`8c58fa92`). ⚠️ Migraciones `2026_09_03_760001` y
> `760002`.
>
> ⚠️⚠️ **El síntoma del formulario no era del módulo, era del navegador.** Un control `required`
> dentro de una pestaña inactiva queda con `display:none` —lo que aplica `x-show`— y **un control
> que no se ve NO ES FOCUSABLE**: el navegador **cancela el envío** y lo único que escribe es «An
> invalid form control is not focusable» **en la consola**. El usuario pulsa Guardar y no pasa
> nada. **Medido: 51 campos `required` dentro de pestañas en 19 vistas** — es un patrón del
> ecosistema, no una pantalla.
>
> ⚠️⚠️ **Y el mecanismo obvio no sirve: cuando la validación nativa falla, el evento `submit` NO SE
> DISPARA.** Mi primera versión lo escuchaba y **la verificación con navegador real la encontró
> muerta**. El que sí llega es **`invalid`**, uno por control y **solo en fase de CAPTURA**.
> ⚠️ Solo se interviene si hay un inválido **OCULTO**: con los campos a la vista el navegador ya
> avisa bien, y sustituirlo cambiaría formularios que hoy funcionan. ⚠️ La pestaña se **DERIVA del
> DOM**, nunca de una lista a mano — con una lista, el campo que alguien agregue mañana vuelve a
> quedar sin salto.
>
> ⚠️⚠️ **Los otros tres síntomas salían de la MISMA raíz, y es el defecto que `[FACT-SIMPLE-1]`
> cerró para la configuración fiscal**: `inv_config_inventario` tenía el UNIQUE en **`(company_id)`
> a secas**. Comprobado EJECUTÁNDOLO: **abrir Inventario → Configuración del módulo desde la
> segunda empresa revienta con «Duplicate entry»**; y el controlador buscaba solo por company, así
> que la empresa 2 **veía la config de la 1 y al guardar la PISABA**.
>
> ⚠️⚠️ **Lo que no revienta es lo que explicaba el «no lee los códigos»**: sin fila, `$config` es
> null → `usa_codigos_barra` se evalúa apagado → el alta **descartaba los códigos de barra en
> silencio**. **Medido: 0 códigos de barra en toda la base** — nunca se guardó ninguno, para ningún
> cliente. ⚠️ **Y el `update` los BORRABA siempre** y solo los reescribía con el flag encendido:
> editar un artículo con los códigos desactivados **destruía los que ya tenía**.
>
> ⚠️⚠️ **El impuesto general no se configuraba por un código que ya no se genera**: dos seeders
> pedían `codigo = 'IT01'`, que **solo existe en el fallback legacy**; con la localización cargada
> el código lo deriva el catálogo del país, la consulta daba **NULL**, la columna es nullable y
> **nada lanzaba**. Fuente única nueva que resuelve por **ATRIBUTO** con orden **TOTAL**.
> ⚠️ **Y compras resolvía MAL en mi primera versión** —«Retención ITBIS 30%», porque una retención
> también aplica a compras y el 30 % gana al 18 %—: **lo encontró MEDIR**. Se **excluyen** las
> retenciones en vez de exigir `tipo = 'itbis'`, o en otro país el `iva` quedaría fuera.
>
> ⚠️ **El escaneo desde Facturación estaba bloqueado por `[PERM-BUNDLE-1]`**: sus pantallas
> llamaban a la ruta de Inventario, detrás de `module:inventario`, y un usuario de Facturación sin
> ese permiso recibía un **403** que el `catch` devolvía como «artículo no encontrado». Facturación
> declara **su propia ruta al mismo controlador** (`[VTA-MES-2]`).
>
> ⚠️⚠️ **`[INV-COSTO-1]` — un ajuste MANTIENE el costo del stock.** El alta ponía **cero** si no se
> capturaba, y en una **entrada** el posteo usaba ese número en **tres sitios**: la capa de costo
> —**PEPS/UEPS sacarían la mercancía gratis**—, el promedio de la bodega —que se **diluye**— y el
> último costo. **El descuadre no aparece en el ajuste: aparece en el costo de ventas de todo lo que
> se venda después.** ⚠️ Y el costo sale del **STOCK de la bodega**, no del estándar de la ficha:
> medido, **VAR-001 estaba a 550,00 en su bodega y su ficha decía 850,00** — al estándar habría
> **revaluado la existencia** sin que nadie lo pidiera. Fuente única con la cascada declarada,
> **de solo lectura** (la llama un GET), el cero **NOMBRADO**, y **cambiar la bodega refresca las
> líneas** — sin eso el ajuste se registra al costo de otro almacén. Los **tres** caminos de la
> pantalla asignaban el costo por su cuenta: ahora lo decide uno y las copias se borraron.
>
> ⚠️⚠️ **`[INV-TT-1]` — MEDIR cambió la corrección que se pidió**: las dos columnas
> `requiere_bodega_*` **no las lee nadie** y el requisito **ya lo expresa `naturaleza`**, así que
> agregarlas habría duplicado el dato (`[INV-TRANSITO-1]`). **No se agregan: se quitan.** Lo que sí
> apareció: **la pantalla de alta de tipos de transacción no funcionaba** —validaba
> `prefijo_consecutivo`, que no existe, y el `$fillable` la mandaba al INSERT: **1054**; el listado
> pintaba el mismo atributo y **la columna «Prefijo» salía vacía**, con la vista de EDICIÓN ya
> parcheada y el alta roto (`[PRE-COB-1]`)— y **el consumo de insumos de Car Wash nunca pudo
> correr**, porque `naturaleza = 'consumo'` **no estaba en el ENUM** y revienta con **1265**;
> `MovimientoService` ya lo trataba: **el código esperaba el valor y el esquema nunca lo tuvo**.
>
> **En producción**: UNIQUE ampliado · el ENUM con `consumo` y su `NOT NULL`/`DEFAULT` preservados ·
> la empresa 2 **ya crea su configuración** · config de inventario **3 → 5 filas** ·
> las 3 demo **con impuesto general** (antes ninguna) · **códigos de barra 0 → 57**, todos con
> dígito verificador válido y 0 huérfanos · **`ARE-001` y `BLO-001` resuelven por código Y por
> código de barra** · las pantallas reales renderizan **852,4 KB** y **786,8 KB** con el avisador
> presente. ⚠️ **Agua Yamel —el único cliente real— tampoco tenía configuración de inventario**,
> así que estaba afectada; **no se le tocó nada**: su config la crea la pantalla al abrirse, que es
> lo que dejó de reventar.
>
> ⚠️ **Cuatro defectos propios**, y los tres que más enseñan: mi primer avisador **escuchaba el
> evento equivocado** · el partial **asumía `$errors`**, que lo inyecta un middleware, y al vivir en
> el layout **reventaba la vista completa** (lo encontró la regresión) · y **dos pruebas pasaban por
> la razón equivocada**: una guarda de código que busca una cadena **no ve que el camino se
> desactive**, y una prueba de orden que compara dos corridas seguidas **pasa con el orden parcial
> puesto** (reincidente de `[VTA-MES-1]`).
>
> ⚠️ **HALLAZGOS FUERA DE ALCANCE**: **las 45 capas de `inv_cost_layers` son TODAS huérfanas** —su
> `movimiento_linea_id` no resuelve— y **9 están en cero con existencia viva**, todas de TAPIA
> (empresa de prueba) · el impuesto de TAPIA está **sin `empresa_id`** · y **el escáner solo está en
> las pantallas de ALTA de Facturación, no en las de EDICIÓN**.
>
> **Reglas nuevas: un control `required` que no se ve NO ES FOCUSABLE y el navegador cancela el
> envío sin avisar — y el evento `submit` no se dispara, así que el aviso se engancha a `invalid` en
> CAPTURA · solo se interviene cuando el campo está oculto · la pestaña de un campo se DERIVA del
> DOM · un partial en el layout no puede asumir `$errors` · un `firstOrCreate` con la clave vieja no
> falla: ENCUENTRA la fila de otra empresa y no crea nada · un `insertOrIgnore` que silencia un
> choque de clave esconde el defecto · un flag apagado que descarta lo capturado se NOMBRA, y el
> borrado va DENTRO del flag o editar destruye lo que había · un código de catálogo buscado a mano
> deja de existir cuando cambia la convención, y `first()` da NULL sin lanzar nada · una retención
> también «aplica a compras»: el impuesto del documento se resuelve EXCLUYENDO lo que no lo es · un
> método que recibe la empresa por parámetro necesita `sinScopeEmpresa()` · un ajuste MANTIENE el
> costo del stock, y sale de la BODEGA, no del estándar de la ficha · una guarda de código que busca
> una cadena no ve que el camino se desactive: hay que ejercer el comportamiento · antes de agregar
> una columna hay que medir si alguien la lee y si el dato ya está expresado · un `MODIFY COLUMN`
> copia la definición completa: se lee del esquema · una clave fuera del `$fillable` se descarta EN
> SILENCIO, así que quien la escribe cree haber configurado algo.**

> **CAMBIAR LA LISTA DE PRECIOS NO REFRESCABA LAS LÍNEAS (2026-09-02) — `[FACT-SIMPLE-2]`**:
> reporte del director técnico — *«cuando se cambia la lista de precios, el precio de las líneas
> existentes no cambia»*, y en el mismo hilo la simplificación: *«no debe aparecer Flete, Doc ni
> Transporte en los totales · la lectura del código de barras debe ser invisible, solo debe buscar
> el artículo cuando lea · el incoterm, moneda y tipo de cambio ya vienen predeterminados · un
> control para ocultar la línea de escanear que al pedir factura simple se colapse · igual con las
> Notas · lo mismo en pedido y cotización»*.
> **7 pruebas nuevas, 6 reglas verificadas VIOLÁNDOLAS: las 6 se detectan** · Facturación + las
> 1 286 vistas **141 passed**. **Sin migración.**
>
> ⚠️⚠️ **El defecto eran DOS, y ninguno lanza nada.** (1) **Las vistas de EDICIÓN tenían el
> selector y NO el manejador** —sin `x-model` ni `@change`, así que cambiar la lista no hacía
> absolutamente nada— y son justo las pantallas que **SIEMPRE** llegan con líneas ya capturadas.
> (2) **El endpoint solo consultaba la lista ELEGIDA**: un artículo ausente de la lista nueva se
> quedaba con el precio de la anterior, así que **el documento se emitía a un precio que la
> pantalla ya no mostraba**. *Un precio que no se refresca no da error: da un importe plausible que
> ya no corresponde a la lista que el documento declara.*
>
> ⚠️ **Y el criterio estaba en TRES copias, una con su propio defecto**: el buscador inline pedía la
> columna **`precio`** cuando la real es `precio_unitario`, así que **reventaba con un 1054 en
> cuanto había lista de precios** y su `catch` lo devolvía como «sin resultados». Ahora la cascada
> vive en `PrecioBaseService::resolverCascada()` —lista elegida → lista base → artículo— y las tres
> la consumen; **las copias se borraron**. Verificado contra datos reales: **890 con la lista y 650
> sin ella**, que es lo que prueba que el refresco hace algo. ⚠️ **Es de SOLO LECTURA a propósito**:
> no usa `obtenerListaBase()`, que **CREA** la lista si falta, y estos endpoints son GET — *abrir
> una pantalla no puede escribir una fila*. Y el **`descuento_pct` viaja con el precio**, o una
> línea con rebaja se facturaría al precio sin descuento.
>
> ⚠️⚠️ **Escaneo INVISIBLE, que es lo pedido**: un lector USB teclea el código y manda Enter, así
> que no hace falta campo a la vista — se reconoce la ráfaga por su **VELOCIDAD** (menos de 40 ms
> entre teclas) con mínimo de 4 caracteres, y **no intercepta si el foco está en un campo de
> captura** (robarle el Enter impediría salir de una celda). El campo visible queda **colapsado**
> como respaldo y **resuelve contra el mismo endpoint** que el lector.
>
> ⚠️ **Flete, documentación y transporte se colapsan pero SIGUEN en el DOM** (`x-show` solo aplica
> `display:none`) y el bloque **nace ABIERTO si ya traen valor**: con un `@if`, un documento que los
> tiene **los perdería al editarse** y el total cambiaría sin que nadie tocara esos campos. El botón
> muestra la suma cuando está cerrado. **Notas colapsables**, abiertas si el documento ya trae
> texto. Y **Lista de precios y Lugar de entrega quedan en la misma fila**.
>
> ⚠️⚠️ **Moneda, tipo de cambio e incoterm salen de la captura simple, pero si la funcional no tiene
> tasa activa la sección se pinta COMPLETA** — *una tasa asumida que no existe emitiría el documento
> a un valor inventado*. Medido en la empresa demo: `camposSinDefault = [moneda, lista_precio]`, así
> que ahí la moneda **sí** se muestra. Es la salvaguarda de `[FACT-SIMPLE-1]` funcionando.
>
> ⚠️⚠️ **Dos defectos propios de la MISMA familia, y ya documentada**: escribí **la etiqueta de un
> componente Blade dentro de un comentario JS** y la vista dejó de compilar con un `unexpected EOF`
> que **apunta a una línea del compilado** — es `[CW-FIX-3]`, localizado **compilando prefijos**. Y
> ⚠️ **reincidí DENTRO del propio comentario que advertía del error**.
>
> ⚠️ **Dos defectos de método en mis guardas**: mi extractor del cuerpo del manejador buscaba el
> nombre **a secas** y su primera aparición es el atributo `@change` del `<select>`, que va antes en
> el archivo — **afirmaba sobre HTML**; y una guarda **NO detectaba su violación** porque el regex
> usaba `[^}]*` entre la llave y el `return` y en medio hay llaves anidadas. ⚠️ **Y una prueba que se
> omitía no protegía nada**: la BD de pruebas tiene **720 artículos y 0 ítems de lista** (mi
> verificación a mano había usado la de desarrollo), así que ahora **monta su propio escenario** con
> tres precios deliberadamente distintos.
>
> **Verificado renderizando el CONTROLADOR real en los dos modos**: escáner y cargos cerrados en
> simple, abiertos en completo, con los inputs de flete SIEMPRE en el DOM; **859–900 KB** por
> pantalla. `x-cloak` confirmado en el CSS del manifest, sin rebuild.
>
> **Reglas nuevas: un selector que existe pero no está cableado no da error, no hace nada — y la
> guarda recorre las CINCO pantallas, porque una prueba sobre una no ve que a las otras les falte el
> manejador · un precio que no se refresca da un importe plausible que ya no corresponde a la lista
> que el documento declara · una cascada que corre desde un GET no puede usar el helper que CREA ·
> un lector de código se reconoce por la VELOCIDAD de la ráfaga, y no se intercepta el Enter cuando
> el foco está en un campo de captura · lo que se colapsa se esconde con `x-show`, nunca con `@if`:
> el input tiene que seguir en el DOM o el documento pierde el dato al editarse · un bloque colapsado
> que oculta un valor muestra su total en el botón · la etiqueta de un componente Blade no se escribe
> en un comentario JS, ni siquiera para advertir de eso (reincidente) · un extractor que busca un
> nombre a secas apunta al atributo del select · un regex con una clase negada de llaves no cruza
> llaves anidadas · una prueba que se omite no protege nada, y monta su propio escenario con valores
> DISTINTOS por nivel · la BD de pruebas no tiene los datos de la de desarrollo.**

> **CAJA CHICA NO ABRÍA: EL PERMISO SE PEDÍA POR EL SLUG DE LA SUSCRIPCIÓN (2026-09-02) —
> `[PERM-BUNDLE-1]`**: reporte del director técnico — *«hay un usuario facturación en Agua Yamel que
> se le dio permisos de facturación y cajachica pero en el módulo de caja chica no abre e informa
> que no está suscrito ese módulo, pero pertenece al ERP y no debe pedir suscripción»*.
> **8 pruebas nuevas, 3 reglas verificadas VIOLÁNDOLAS: las 3 se detectan** · bundle ERP (CxP, CxC,
> Bancos, Activos, Compras, Presupuesto) **824 passed, 4 skipped, 0 failed** · menú + vistas + ayuda
> **35 passed**. **Sin migración.**
>
> ⚠️⚠️ **El síntoma culpaba a la suscripción, y la suscripción estaba bien.** Medido en producción
> antes de tocar nada: el suscriptor tiene **`erp` Y `cajachica` activos**, y el usuario interno
> tiene **`cajachica.can_view = 1`** … y **`erp.can_view = 0`**. Las pantallas de Caja Chica viven
> detrás de `module:erp`, así que el middleware pedía el permiso con el slug de la **SUSCRIPCIÓN**
> en vez del de la **PANTALLA**, que es el que el owner marca en la matriz.
>
> ⚠️ **Y el mensaje mentía**: decía «El módulo ERP no está incluido en tu suscripción actual» y
> llevaba a la pantalla de pago. *Un mensaje que acusa al plan cuando el plan está bien manda al
> owner a buscar un problema que no existe* — es lo que llevó a reportarlo como error de facturación.
>
> ⚠️ **El menú YA usaba la regla correcta**, así que **el ítem se veía y no se abría**. Y al
> revisarlo apareció una **TERCERA copia** del criterio en la vista Blade del menú, con su propia
> lista a mano: **tres sitios decidiendo lo mismo, con dos respuestas distintas.**
>
> **La fuente única se DERIVA, no se escribe a mano**: `User::puedeVerModulo()` pide el permiso por
> el módulo de la **PANTALLA** cuando este declara su propia sección en `config/permission_tree.php`
> —`cajachica`, `activos`, `compras`, `presupuesto`— y por el de la **suscripción** cuando no la
> tiene —`cxp`, `cxc`, `bancos`—. Con una lista escrita a mano, el siguiente módulo del bundle nace
> con el defecto. **Las tres copias se borraron.**
>
> ⚠️ **El módulo de la pantalla se DECLARA en la ruta** (`module:erp,cajachica`): se descartó
> derivarlo del nombre, porque `cxp.php` declara rutas como `config.tipos-doc-cxp.*` y el primer
> segmento no identifica el módulo. Y **el mensaje distingue las dos causas** porque se arreglan en
> sitios distintos: sin suscripción → pantalla de pago; suscrito sin permiso → *«tu empresa sí lo
> tiene contratado: pídele al propietario que te lo habilite en Configuración → Usuarios →
> Permisos»*, nombrando **la pantalla**, no «ERP».
>
> ⚠️⚠️ **Mi propia guarda de coherencia NO detectaba su violación**: calculaba el lado del menú
> **replicando su lógica en la prueba**, así que con el defecto inyectado pasó — demostraba que la
> regla funciona, no que el menú la use. Corregida montando el **componente Livewire real** más una
> guarda de código sobre el componente y su vista.
>
> ⚠️ **Dos trampas del entorno de pruebas**: el subpath de `APP_URL` hacía que **TODA petición diera
> 404** sin llegar al middleware (se resuelve con `URL::forceRootUrl`), y el fixture nacía con
> `plan = 'pro'`, que redirige a la pantalla de pago **antes** del middleware de módulos — con eso,
> **dos pruebas que esperaban un redirect pasaban por la razón equivocada**.
>
> **Impacto medido: nadie pierde acceso que hoy funcione.** El único usuario interno con `erp.view`
> es el auditor de la cuenta demo, y esa company **no tiene contratados** los cuatro módulos con
> sección propia. **Agua Yamel gana el acceso que faltaba.**
>
> ⚠️ **PENDIENTE — el deploy no se pudo hacer**: el SSH de Bluehost lleva la sesión entera
> rechazando conexiones (`Network error: Connection refused`), así que la verificación en producción
> queda sin ejecutar. **No se da por buena una verificación que no se corrió.**
>
> **Reglas nuevas: la suscripción y el permiso son dos preguntas distintas y pueden usar slugs
> distintos — un módulo que se vende dentro de un bundle pero tiene su propia sección de permisos
> necesita los dos · un mensaje que acusa al plan cuando el plan está bien manda al usuario a buscar
> un problema que no existe, y nombra la PANTALLA, no el bundle · cuando tres sitios deciden lo
> mismo, dos ya divergieron: la regla se DERIVA de su catálogo y las copias se borran · el módulo de
> una pantalla se DECLARA en la ruta, no se deriva del nombre · una guarda de coherencia que replica
> la lógica del consumidor no detecta que el consumidor deje de usarla: hay que montar el componente
> REAL · un fixture con plan de pago sin suscripción de Stripe redirige antes del middleware que se
> quiere ejercer.**

> **CAPTURA SIMPLE, ITBIS OPCIONAL Y EL TEXTO QUE NO SE VEÍA EN CLARO (2026-09-02) —
> `[FACT-SIMPLE-1]`, `[A11Y-1]`**: dos pedidos del director técnico con capturas — *«en la
> accesibilidad mejora el color claro con mejores tonos, del texto de las imágenes hay texto que no
> se ve, de los botones»* y *«necesito una opción de factura simple… que los valores obligatorios
> sean por defecto… también la opción cuando no se cobra ITBIS, no por exento sino que el usuario
> no requiere impuesto»*, más la aclaración que fijó la arquitectura: *«puede tener pantalla
> simplificada y cobrar itbis en otra empresa manteniendo la pantalla simple, la bodega debe ser la
> predeterminada»*. **9 reglas verificadas VIOLÁNDOLAS: las 9 se detectan** · Facturación
> **130 passed** · guardas transversales **16 passed**. ⚠️ Migraciones `2026_09_02_750001` y
> `750002`.
>
> ⚠️⚠️ **El texto invisible en claro no era de tono, era de OPACIDAD.** Medido antes de tocar nada:
> **41 variantes de alfa** sobre clases de texto (~11 800 apariciones) y el tema claro parchaba
> **5**. ⚠️ **Y corrige un número mío**: afirmé que `#475569` al 60 % daría 4.6:1 y **da 2.88:1** —
> negro puro al 60 % sobre blanco da 5.74:1, así que lo que había que quitar era el alfa, no subir
> el tono. Los colores pasan a **variables CSS** (12 tokens por tema) en vez de parchearse clase
> por clase: con parches, cada componente nuevo nace con el defecto. **825 reemplazos en 296
> vistas, 0 restantes.** La tarjeta de módulo no contratado sube de **1.73:1 a 6.72:1** y el chip
> «No disponible en demo» de **2.73 a 5.50**. ⚠️ **El modo oscuro quedó IDÉNTICO**, comprobado
> canal por canal contra los hex originales.
>
> ⚠️ **Mi propia guarda destapó un hueco de mi trabajo**: dejé `--c-primary` sin definir en claro —
> `text-primary` daba **2.41:1 sobre la píldora del ítem activo**, que es justo el «Configuración
> Gen…» de la captura. Elegido `#9A3412`; se descartó `#C2410C`, más fiel a la marca, porque ahí da
> 4.16 y no llega a AA.
>
> ⚠️ **La captura simple y el ITBIS son DOS EJES INDEPENDIENTES, no un modo.** Con un solo
> interruptor, activar la vista simple habría apagado el impuesto de quien sí lo cobra — y eso no
> sale en la pantalla, sale en el 607. `CapturaSimpleService` es fuente única de los dos criterios
> y lo consumen los tres controladores por un trait. ⚠️ Los defaults reproducen el comportamiento
> vigente y **se verifican por el DEFAULT DE LA COLUMNA**, no por la constante del modelo. ⚠️ Y la
> preferencia del usuario es **NULLABLE a propósito**: con un boolean NOT NULL, el default de la
> empresa no aplicaría a nadie.
>
> ⚠️⚠️ **La bodega venía de una columna que NO EXISTE**: el código leía
> `inv_config_inventario.bodega_ventas_id` y esa columna no está en esa tabla — Eloquent devuelve
> NULL sin lanzar nada, así que la cascada caía **siempre** a «la primera bodega por orden
> alfabético». Con dos bodegas de ventas eso descarga el stock del almacén equivocado y el
> descuadre aparece en el conteo físico semanas después.
>
> ⚠️ **Lo que la vista simple no puede esconder lo NOMBRA con su motivo** —esconder un campo cuyo
> default no existe obliga a inventar el valor— y **la lista de precios nunca se esconde cuando
> existe**, o se facturaría al precio de la cascada base. ⚠️ **El impuesto lo apaga el SERVIDOR, no
> un `x-show`**: un campo oculto en el cliente sigue enviándose. La guarda va en **store Y en
> update** (forma de `[IMP-JERARQ-1]`), y **un documento que ya lleva impuesto no lo pierde al
> editarse**.
>
> ⚠️⚠️ **El límite que apareció al verificar: la configuración era por SUSCRIPTOR, no por empresa.**
> El controlador ya guardaba con `company_id + empresa_id` —su propio comentario lo dice— pero el
> **UNIQUE era `(company_id)` a secas**, así que la segunda empresa no podía guardar la suya: MySQL
> la rechazaba con «Duplicate entry», un error del motor que no dice nada del negocio. **Medido: 3
> empresas demo y UNA sola fila de configuración**, así que *«cobrar ITBIS en una empresa y no en la
> otra»* —lo que se pidió— **era imposible**. La migración amplía la clave; es **aditiva** y corre
> sin ventana. Verificado: la empresa 2 ya cobra distinto que la 1 en el mismo suscriptor.
>
> ⚠️ **Tres defectos propios de método**: un script de edición **abortó y no escribió nada** (lo
> delató que la salida no cambiara) · mi verificador de renderizado **medía mal dos veces** —
> buscaba «Vista simple», que es el texto del botón solo en modo COMPLETO, y `display:none` suelto,
> que aparece en cualquier modal oculto (`[INV-LOTE-1]`) · y otro script **asumió una columna
> inexistente** y acusó al controlador, que estaba bien.
>
> **Verificado renderizando el CONTROLADOR real**: 3 pantallas × 4 escenarios, 874–917 KB cada una.
> La columna de ITBIS se oculta según el impuesto y el rótulo de la barra cambia según el modo —
> los dos ejes son independientes.
>
> **Reglas nuevas: dos decisiones que no se implican no son un modo, son dos interruptores · un
> default que apaga un impuesto se verifica por el DEFAULT DE LA COLUMNA · un boolean NOT NULL no
> distingue «no ha elegido» de «eligió que no»: el tercer estado necesita NULL · leer una columna
> que no existe devuelve NULL sin lanzar nada y la cascada cae al primer registro por orden
> alfabético · un campo escondido con `x-show` sigue enviándose · lo que no se puede esconder se
> NOMBRA con su motivo · un controlador puede estar escrito para una clave que el UNIQUE de la base
> no admite, y el usuario solo ve un «Duplicate entry» · el color de un texto no se arregla con el
> tono si lleva opacidad · el texto de un botón que cambia con el estado no sirve como marcador de
> que el botón existe.**
>
> ⚠️⚠️ **AL DESPLEGAR, un cuarto defecto propio — y del tipo que este trabajo existe para evitar.**
> Mi script de renderizado en producción guardaba el estado previo de la configuración y al final lo
> devolvía con `$cfg->fill($previo)->save()`. **Imprimió «configuración restaurada (impuesto=1)» y la
> base quedó en 0**: Constructora Demo SA se quedó con el **ITBIS apagado**, y también dejó un
> usuario con la preferencia de vista puesta. **No lanza nada.** Lo encontró **leer la base**, no el
> mensaje del propio script. Corregido con `DB::table()->update()` —sin depender de casts ni del
> dirty-checking del modelo, que es justo donde falló— y comprobado antes y después: **las 4 empresas
> con el impuesto en 1 y 0 usuarios con preferencia**. ⚠️ Los escenarios en producción se acotaron a
> la **cuenta demo**: ninguna empresa de un cliente real se tocó.
>
> ⚠️ **Y un quinto, en el build**: la verificación en producción dio **17 OK / 1 FALLO** —quedaban
> clases de texto con alfa en el CSS compilado—. **Investigado en vez de descartado**: el `content`
> de Tailwind incluye `storage/framework/views/*.php`, y ese caché tenía las vistas **VIEJAS** en el
> momento del build. Resuelto con `view:clear` + rebuild (`[A11Y-2]`): **18 OK / 0 fallos**.
>
> **Reglas nuevas del despliegue: un script que dice «restaurado» no prueba que restauró — el estado
> final se verifica LEYENDO la base · un escenario que se prueba en producción se acota a la cuenta
> demo · Tailwind escanea el caché de vistas compiladas, así que un build con el caché sucio hornea
> clases que ya no existen en las fuentes.**

> **LAS CREDENCIALES DE CORREO SALÍAN DEL `.env` (2026-08-31) — `[CRM-EMAIL-1]`**: reporte del
> director técnico — *«me indicas que realice modificaciones al `.env` y que limpie caché, pero yo
> no soy quien configura el sistema, es el mismo usuario… es un SaaS, quizá no siempre estaré para
> todos los usuarios»*. **6 reglas verificadas VIOLÁNDOLAS: las 6 se detectan** · CRM + ayuda +
> rutas + las 1286 vistas **26 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`6d451171`).
> ⚠️ Migración `2026_08_31_700001`.
>
> ⚠️⚠️ **Tenía razón, y la función no servía para nadie.** «Mis cuentas de correo» le pedía al
> USUARIO FINAL editar el `.env` y correr `php artisan config:clear` — imposible en un SaaS.
> **Medido antes de tocar nada: 0 cuentas conectadas y las credenciales VACÍAS**: no estaba mal
> configurada, **nunca funcionó para nadie, ni para el propio director técnico**. Forma de
> `[BAN-F4-FIX]`. Ventaja: cambiarla no rompía nada. ⚠️ Los tokens **ya se cifraban** bien; el
> defecto era solo el origen de las credenciales.
>
> **El ecosistema ya tenía el patrón resuelto en CUATRO módulos** —WhatsApp (`cloud_token`), IA de
> Compras (3 API keys), burós de Prestamello, QuickBooks de PSA—: credenciales cifradas por empresa
> desde pantalla. El correo del CRM era el único desviado.
>
> ⚠️⚠️ **El dato que decidió la arquitectura**: `gmail.send` y `gmail.readonly` son scopes
> **RESTRINGIDOS**. Una app OAuth única de la plataforma —lo ideal en un SaaS— exige **auditoría de
> seguridad anual de terceros (USD 15 000–75 000/año)**. ⚠️ La excepción que rescata la
> alternativa: la app creada **dentro del Workspace del propio cliente, en modo «Internal», NO
> requiere verificación**. Decisión del director técnico: **los dos caminos, por EMPRESA,
> configurables por owner o `can_configure`** — OAuth (enviar y leer) y **SMTP con contraseña de
> aplicación** (solo enviar, sin trámites).
>
> ⚠️ **Tres decisiones contra el fallo silencioso**: el SMTP **se prueba antes de guardar** (si no,
> el vendedor cree que quedó conectado y lo descubre al mandar una cotización) · la empresa viaja
> en el **`state` del OAuth, no en la sesión** (entre el redirect y el callback puede cambiar de
> empresa y el token quedaría en la equivocada) · y ⚠️⚠️ **`enviarEmail()` habría reventado con
> SMTP** —descifra un `access_token` que es NULL— y su `catch` lo devolvía como `false`: la cuenta
> se conectaría bien y los correos **no saldrían**.
>
> **Lo que se ofrece sale de lo configurado**: sin credenciales no hay botones sino un aviso que
> dice por qué y enlaza solo si tienes permiso (`[AGENTES-4]`). ⚠️ **Un secreto vacío al guardar NO
> borra el guardado** —la pantalla nunca lo muestra, así que guardar tras cambiar otra cosa lo
> habría borrado en silencio— y la **URI de redirección se DERIVA** con botón de copiar, porque
> Google exige que coincida carácter por carácter.
>
> ⚠️ **Un defecto propio de método**: el primer script de edición **abortó en un `re.sub` y no
> escribió nada**; lo delató que el conteo de referencias al `.env` siguiera en 10 tras informar
> «migrado» (`[CRM-VEND-1]`).
>
> **En producción: tabla creada, 3 rutas resuelven, y el cifrado verificado LEYENDO LA FILA CRUDA**
> —con `DB::table()`, porque el modelo descifra al leer y consultarlo por Eloquent haría pasar la
> prueba aunque quitaran el cast—. Fila de prueba borrada, scripts retirados (`[#1250]`).
>
> **Reglas nuevas: en un SaaS, unas instrucciones que piden editar el `.env` o correr `artisan` no
> son documentación: son una función que su audiencia no puede activar · antes de elegir
> arquitectura OAuth hay que mirar la CLASE de scope — los restringidos exigen auditoría anual y
> descartan la app única de plataforma · una credencial cifrada se verifica leyendo la fila CRUDA ·
> un secreto que la pantalla no muestra no puede borrarse al guardar vacío · el método que solo
> puede enviar tiene que decirlo antes de que el usuario se comprometa · un dato que viaja en un
> redirect OAuth va en el `state`, no en la sesión · al agregar un método de conexión hay que
> recorrer a sus CONSUMIDORES: el envío descifraba un token que SMTP no tiene y fallaba en
> silencio.**

> **EL DASHBOARD MOSTRABA 300 LOTES SIN ARTÍCULO (2026-08-31) — `[INV-LOTE-1]`**: reporte del
> director técnico — *«en el dashboard de inventario aparece un resumen lotes por vencer pero no
> trae los códigos de los artículos… verifica el módulo de lotes, verifica los tooltips de ayuda y
> la ayuda de los módulos y vistas a ver cuáles faltan»*. **4 reglas verificadas VIOLÁNDOLAS: las 4
> se detectan** · Inventario **93 passed** · ayuda **8 passed**. **DESPLEGADO Y VERIFICADO EN
> PRODUCCIÓN** (`068afc8f`). **Sin migración.**
>
> ⚠️⚠️ **La consulta y la vista estaban bien: lo que fallaba eran los DATOS.** Medido en producción:
> **300 de 312 lotes colgaban de artículos borrados**, con **74 750 unidades** presentadas como
> stock próximo a vencer sin poder decir de qué artículo; `inv_seriales` estaba **al 100 %, 8 de 8**.
> ⚠️ **El síntoma no es un error sino una celda vacía** —el `?->` de la vista no lanza nada—, así que
> el defecto podía vivir meses.
>
> **La causa**: `InventarioSeeder::limpiar()` borra `inv_articulos` y **nunca** `inv_lotes` ni
> `inv_seriales`, y esas tablas **no tienen FK** (Bluehost las rechaza), así que el huérfano nace en
> el acto — la forma de `[NOM-DEMO-1]`. Crecía **~12 por reset** desde el 2026-08-11. ⚠️ El borrado
> va **por `company_id` DIRECTO**: una subconsulta de artículos no alcanza a los que ya perdieron su
> padre y quedarían inmunes para siempre.
>
> ⚠️ **Un segundo defecto al revisar el módulo**: la ficha del lote listaba los despachos con
> `sinScopeEmpresa()` y `where('company_id')` a secas — alcanza a **todas las empresas del
> suscriptor** y mostraría despachos ajenos (forma de `[AGENTES-6]`). La tabla **sí tiene
> `empresa_id`**: faltaba el filtro, no la columna. Los otros 8 puntos del módulo ya filtraban bien.
>
> **La ayuda**: `lotes.show`, `seriales.index` y `seriales.show` existían **sin una línea**. Quedan
> documentadas con **7 tooltips que LEEN el catálogo**, verificados uno a uno: cero mudos.
>
> ⚠️ **Un defecto propio**: mi aserción buscaba `inv_lotes` **a secas** y pasaba por
> `inv_lotes_auditorias`, que está en la misma lista — **NO detectaba su violación**. Solo lo
> encontró violarla.
>
> ⚠️⚠️ **La cobertura de ayuda del ecosistema, medida**: la guarda existente verifica que cada
> **módulo** tenga archivo, **no que cada PANTALLA lo tenga**. Comparando rutas contra claves
> documentadas: **~1 000 pantallas sin ayuda** —Inventario **1 %**, PSA 2 %, Nómina 2 %, Compras 3 %,
> Contabilidad 4 %, frente a ncf/facturae/docfiscal al **100 %** y Restaurante al 70 %—. El número
> real es menor (la cuenta incluye callbacks y export que no son pantallas), pero el orden de
> magnitud se sostiene. ⚠️ **PENDIENTE del director técnico**: documentarlo son varias sesiones y el
> orden es decisión de alcance. ⚠️ Mi primera medición dio **0 % en TODOS** y era mi criterio, no el
> sistema: las claves van **sin el prefijo del módulo**.
>
> **En producción: lotes 312 → 12, huérfanos 300 → 0, stock fantasma 74 750 → 0, seriales huérfanos
> 8 → 0, y las 10 filas del widget traen su código.** ⚠️ **Los 300 eran TODOS de la cuenta demo**,
> medido antes de tocar nada: **Agua Yamel —el único cliente real—, Comercial Aranza y TAPIA tenían
> cero**.
>
> **Reglas nuevas: una relación que rinde una celda vacía con `?->` esconde un huérfano y no lanza
> nada — cuando una columna sale en blanco se miden los DATOS antes de revisar la consulta · sin FK
> en cascada el hijo sobrevive a su padre en el acto · una limpieza por company_id directo alcanza a
> los ya huérfanos, una por subconsulta del padre no · una aserción sobre una subcadena pasa por el
> nombre más largo que la contiene · una auditoría que da 0 % en todo mide mal, no encontró un
> sistema roto · una guarda que exige archivo por MÓDULO no dice nada sobre las pantallas de dentro.**

> **LAS CUENTAS CONTABLES NO SE ADIVINAN (2026-09-01) — `[INV-PARAM-1]`, `[INV-PARAM-2]`,
> `[CTAS-PADRE-2]`**: dos pedidos del director técnico —*«aplica lo de Agua Yamel»* y *«corrige lo
> de los parámetros del inventario»*— y, a mitad del trabajo, una **corrección de rumbo**: *«no
> debe existir una búsqueda de cuenta contable con código like, mis cuentas contables deben vivir
> o venir de la configuración de cada módulo en la opción Cuentas Contables, no debe existir
> ninguna cuenta hardcodeada ni a la mitad ni una parte»*. **5 reglas verificadas VIOLÁNDOLAS: las
> 5 se detectan** · Inventario + Contabilidad **300 passed**. **DESPLEGADO Y VERIFICADO EN
> PRODUCCIÓN**. **Sin migración.**
>
> **`[CTAS-PADRE-2]` — Agua Yamel, aplicada**: de **0 a 29 cuentas con padre**, de 35 en nivel 1 a
> **6 raíces y 5 niveles poblados**, **0 conflictos**. Con respaldo del estado previo antes de
> tocar nada: es la estructura completa del plan de un cliente real. ⚠️⚠️ **El dato que valida la
> regla del prefijo más largo**: las **20 cuentas que reciben hijas YA estaban marcadas** como
> agrupación por el contador, y **coinciden exactamente** con las 20 que la derivación identificó
> — *la jerarquía que el código dedujo de los números es la misma que el contador tenía en la
> cabeza.*
>
> ⚠️⚠️ **`[INV-PARAM-1]` — la herramienta nunca pudo ejecutarse, por TRES defectos encadenados**:
> el filtro `where('estado','activa')` devolvía **siempre cero** —`empresas.estado` guarda la
> PROVINCIA— así que la rama «todas las empresas» no procesaba ninguna · el upsert escribía en
> **tres columnas que no existen** (`tipo_referencia`/`referencia_id`/`campo` en vez de
> `entidad_tipo`/`entidad_id`/`operacion`), y el `catch` se tragaba la excepción devolviéndola como
> «fallido» · y omitía `empresa_id` —parte del UNIQUE— recorriendo los grupos por tenant, así que
> a un grupo de una empresa se le habrían asignado las cuentas del plan de otra. **Es la forma de
> `[CONT-CONS-1]`.** El fix DELEGA en `ParametroContable::upsertGrupo()`, que ya existía, y **se
> borró la copia**.
>
> ⚠️⚠️ **`[INV-PARAM-2]` — la corrección de rumbo, y el director técnico tenía razón.** Verificando
> qué resolvería para Agua Yamel salió que `buscarCuentasInventario()` elegía la cuenta por
> **rangos de código** (`113%`, `511%`, `611%`): en ese plan el 611 es **«Planilla»**, así que la
> herramienta habría registrado **el costo de ventas y las compras contra la nómina** — y encima
> reportaba «3 obligatorias resueltas: SI». **No lanza nada**: la cuenta existe y el importe cuadra.
>
> ⚠️ **Mi primer arreglo fue afinar la heurística acotándola por tipo de cuenta.** Era la dirección
> equivocada: **un prefijo de código es una cuenta hardcodeada aunque sea solo la mitad**. Y **la
> pantalla correcta YA existía** —Inventario → Cuentas Contables, que pinta las 12 operaciones del
> catálogo por grupo—: la adivinanza era **redundante además de peligrosa**.
>
> **Se RETIRA el servicio que adivinaba** —no se deja desconectado: uno así sigue siendo peligroso
> aunque hoy no lo llame nadie— y lo sustituye un verificador que **SOLO LEE**: informa qué
> cuentas obligatorias faltan y remite a la pantalla. ⚠️ **Lo que exige sale del MISMO catálogo que
> pinta la pantalla**, o reclamaría algo que el usuario no puede configurar. **Medido: quedan CERO
> búsquedas de cuenta por código en todo `app/`** — era el **único sitio del ecosistema** desviado
> de la directiva.
>
> **Verificado en producción leyendo LOS DOS LADOS** (regla de `[CTAS-STD]`): el diagnóstico
> reporta 0 grupos configurados, y se comprobó que la pantalla guarda con la misma clave que él lee
> y que `parametros_contables` no tiene ninguna fila de ese tipo — las 218 existentes son de otros
> módulos. ⚠️ **Impacto real hoy: ninguno** — el buffer contable no tiene ni un movimiento del
> módulo INV, y **Agua Yamel, Comercial Aranza y TAPIA tienen cero movimientos de inventario**.
> Pero el día que Comercial Aranza —que ya tiene 4 grupos— empiece a moverlo, sus asientos no
> encontrarían cuenta: ahora la pantalla lo dice antes.
>
> **Reglas nuevas: un prefijo de código de cuenta es una cuenta hardcodeada aunque sea solo la
> mitad — las cuentas se configuran en el menú de Cuentas Contables del módulo, no se adivinan ·
> mejorar la puntería de una heurística que no debería existir es ir en la dirección equivocada:
> antes de afinarla hay que preguntarse si debe existir · una herramienta que adivina y ESCRIBE es
> peor que una rota — la rota no hacía nada, la afinada habría registrado el costo de ventas contra
> la nómina · un servicio peligroso se RETIRA, no se deja desconectado · lo que un diagnóstico
> exige sale del MISMO catálogo que pinta la pantalla · verificar es de solo lectura: elegir la
> cuenta es del contador · una prueba que se cumple por vacío no ejerce nada · cuando un defecto
> contamina al vecino, la prueba tiene que mirar al vecino, no al propio.**

> **LA DIVISIÓN GEOGRÁFICA SE LLAMA `estado` EN TODO EL ECOSISTEMA (2026-09-01) —
> `[GEO-EST-1]`**: pedido del director técnico — *«verifica que provincia = a estado, en algunos
> países es provincia como RD y otros estado como Venezuela. Debe ser el mismo campo estado,
> verifica todos los módulos y define»*. **3 reglas verificadas VIOLÁNDOLAS: las 3 se detectan** ·
> geo + vistas + Inventario + Nómina **271 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN**
> (`187b24ea`). ⚠️ Migración `2026_09_01_730001`.
>
> **Medido primero, y el desorden era mucho menor de lo que parecía**: de las **133 columnas
> llamadas `estado`** del esquema solo **8 son geográficas** —las demás son estados de documento—,
> y **6 ya usaban el estándar**. `inv_bodegas` era **la única desviada** (`estado_provincia`).
> ⚠️ **El costo no es cosmético**: un reporte o un importador que cruce bodegas con clientes por su
> división geográfica **falla en silencio**, porque la columna se llama distinto en un lado. Y el
> nombre compuesto no resuelve la ambigüedad: **la reparte**.
>
> ⚠️ **Los datos se PRESERVAN**: medido antes de escribir la migración, `estado_provincia` tenía
> **7 de 14 filas con valor**, así que se **renombra la columna** en vez de borrarla y crearla. Y
> lleva una rama defensiva: si por un despliegue a medias existieran las dos, **copia el contenido
> antes de soltar la vieja**.
>
> ⚠️⚠️ **Lo que cambia entre países es el RÓTULO, no la columna.** Nuevo helper
> `etiqueta_estado_geografico()` —mismo patrón que `etiqueta_id_fiscal()`— que lo resuelve por el
> país de la empresa: **Provincia** en RD/CR/PA, **Estado** en VE/MX/BR, **Departamento** en
> CO/GT/PE, **State** en US. Aplicado en las **30 etiquetas** de las 15 vistas que lo mostraban
> fijo como «Estado / Provincia» — *enumerar las dos obliga al usuario a elegir cuál es la suya en
> un formulario donde el país ya se eligió.*
>
> ⚠️ **`nom_employees.provincia` NO se toca, y no es un olvido**: es el campo del formulario
> **DGT-9 del Ministerio de Trabajo RD**, con su propio consumidor. Nómina guarda la división
> geográfica en `estado_codigo`, que sí sigue el estándar. Queda **declarado como excepción** con su
> motivo, o alguien lo unifica creyendo que sobra.
>
> ⚠️⚠️ **Y un defecto de PRODUCCIÓN que apareció al revisarlo**: `DgtExportService` exportaba la
> columna **Provincia del DGT-9 en blanco** — leía `nom_employees.provincia`, **vacía en las 19
> filas**, mientras `estado_codigo` **sí tiene el dato**. El reporte oficial al Ministerio de
> Trabajo salía incompleto y **no lanza nada**: es una columna vacía en un TXT. Verificado tras el
> fix: `provincia=NULL` + `estado_codigo=SP` → **«San Pedro de Macorís»**.
>
> ⚠️ **La guarda encontró 8 vistas que mi barrido a mano se saltó** y falló en su primera corrida
> nombrándolas. Es para lo que se escribió.
>
> **Verificado en producción**: columna renombrada, **7 de 7 valores preservados**, **0 columnas
> desviadas** en todo el esquema, la etiqueta sale distinta por país, y las pantallas reales
> renderizan **1 023 KB** (clientes) y **852 KB** (bodegas) con «Provincia». ⚠️ **Se renderizaron
> llamando al CONTROLADOR REAL**: mis dos primeros intentos inventaron las variables de la vista y
> fallaron — es el defecto de `[MOD-ADIC-2]`, y además el controlador exige `company()`, que sale de
> `auth()`, así que en CLI hay que autenticar un usuario del tenant.
>
> ⚠️ **HALLAZGO FUERA DE ALCANCE**: `MaintenanceController::fixParametrosInventario()` filtra
> `Empresa::where('estado','activa')` en su rama «todas las empresas», pero `empresas.estado` guarda
> **la PROVINCIA** — esa consulta **siempre devuelve vacío** y esa opción de
> `/zyn-maint/fix-parametros-inventario` **no procesa ninguna empresa**, con el resumen en 0 que se
> lee como «no había nada que hacer». **NO se corrigió**: es un proceso masivo sobre datos de
> clientes y ponerlo a correr sin medir su impacto es lo que `[CRON-FIX-1]` estableció que no se
> hace.
>
> **Reglas nuevas: la misma división administrativa se llama distinto en cada país pero es UN solo
> dato — la columna se llama igual y lo que cambia es el RÓTULO, resuelto por el país de la empresa
> · una columna con nombre compuesto no resuelve la ambigüedad, la reparte · un campo homónimo con
> un consumidor propio NO es una desviación: se declara como excepción con su motivo · un dato que
> existe en dos columnas se lee de la que TENGA valor, o el reporte oficial sale en blanco sin
> lanzar nada · una migración que renombra preserva el contenido; una que borra y crea lo pierde ·
> un barrido a mano sobre 1 286 vistas se salta archivos · renderizar una vista con variables
> inventadas prueba la suposición, no el código: hay que llamar al CONTROLADOR, y en CLI eso exige
> autenticar un usuario porque `company()` sale de `auth()`.**

> **EL TRÁNSITO EN LA COBERTURA LO DECIDE QUIEN MIRA EL REPORTE (2026-09-01) —
> `[INV-COBERT-1]`, `[INV-COBERT-2]`**: pedido del director técnico tras `[INV-TRANSITO-1]` —
> *«el negocio puede configurarlo en el mismo reporte, si se activa un switch que agregue la
> cobertura de días y ajuste los disponibles… ¿ese reporte debe ir en el Módulo Adicional o ya
> existe en inventario?»*. **5 reglas verificadas VIOLÁNDOLAS: las 5 se detectan** · Inventario
> **130 passed** · guardas **13 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN**
> (`b8048f71` + `5275ec9b`). **Sin migración.**
>
> **La respuesta a la pregunta: el reporte YA EXISTE, y son DOS** —
> `inventario.reportes.cobertura` (base, mide con el consumo REAL) y la clasificación ABC de
> Abastecimiento (módulo de mejora, mide con la demanda del PRONÓSTICO)—. No hacía falta crear
> nada en el módulo adicional.
>
> ⚠️⚠️ **La decisión que `[INV-TRANSITO-1]` dejó abierta NO tenía una sola respuesta**: depende
> de la pregunta. **Sin tránsito** contesta *«¿para cuántos días alcanza lo que puedo despachar
> HOY?»*; **con tránsito**, *«¿para cuántos días alcanza contando lo que ya compré?»*. Por eso
> es un **interruptor del propio reporte** y no un default. ⚠️ **Nace APAGADO**: reproduce el
> comportamiento vigente, y encenderlo alarga la cobertura contando mercancía que todavía no
> llegó.
>
> ⚠️ **FUENTE ÚNICA del criterio**: la fórmula del disponible vive en
> `CoberturaInventarioService::disponible()` y el ABC de Abastecimiento la **DELEGA** en vez de
> copiarla — con una copia, el mismo artículo saldría con una cobertura en Inventario y otra en
> Abastecimiento. **Se borró la copia**, con prueba que lo custodia. ⚠️ La dirección importa:
> **Abastecimiento consume de Inventario, nunca al revés** — un módulo base no puede depender de
> uno de mejora vendible. ⚠️ **Lo reservado se descuenta SIEMPRE**: ya tiene dueño.
>
> **El reporte DECLARA qué criterio está usando** en las dos posiciones del interruptor, y expone
> **Existencia / Reservado / En tránsito / Disponible** en columnas propias: un disponible que
> cambió sin decir de dónde salió la diferencia no se puede comprobar contra el almacén.
>
> ⚠️⚠️ **`[INV-COBERT-2]` — el defecto lo encontró MEDIR producción, ya con el switch
> desplegado**: las **9 filas con tránsito tienen existencia CERO**, y el reporte filtraba
> `cantidad > 0`, así que **ninguna salía** — justo el caso que motiva encenderlo: *«no tengo
> nada, pero viene en camino»*, que es cuando el comprador necesita saber que **no debe emitir
> otra orden**. Es la forma de `[INV-MATRIZ-1]`: *un filtro que apaga justo lo que se quiere
> ver*. Apagado el interruptor, el filtro no cambia.
>
> **Verificado en producción**: **+3 filas por empresa** en las tres demo (25→28, 13→16, 13→16),
> con `ARE-001` y `BLO-001` pasando de «no salía» a aparecer; la pantalla real renderiza
> **773 KB apagado / 775 KB encendido**. Las filas nuevas salen con **«sin consumo»**, que es
> correcto: sin salidas en la ventana la cobertura no se puede medir y el reporte lo dice en vez
> de inventar un número. ⚠️ **Agua Yamel —el único cliente real— tiene 0 bodegas y 0
> existencias.**
>
> ⚠️ **Una prueba OMITIDA nombrando el motivo**: depende de `abst_config.abc_a_pct`, columna que
> **otra sesión está migrando ahora mismo**. Los **52 fallos** de `ClasificacionAbcTest` en la
> regresión son de esa migración a medias, no de este trabajo — confirmado corriendo Inventario
> solo. ⚠️ Y tres nombres que eran suposiciones mías: `inv_stock` **no tiene `created_at`**, y
> los ids de `inv_movimientos` son **bigint, no UUID**.
>
> ⚠️ **HALLAZGO FUERA DE ALCANCE**: **`empresas.estado` guarda la PROVINCIA**, no un estado de
> activación (el `$fillable` la declara junto a `pais_iso` y `ciudad`; los datos son cadena vacía
> y «San Pedro de Macorís»). `MaintenanceController::fixParametrosInventario()` filtra
> `Empresa::where('estado','activa')` en su rama «todas las empresas»: **siempre devuelve vacío**,
> así que esa opción de `/zyn-maint/fix-parametros-inventario` **no procesa ninguna** y el
> resumen sale en 0. **NO se corrigió**: es un proceso masivo sobre datos de clientes y ponerlo a
> correr sin medir su impacto es lo que `[CRON-FIX-1]` estableció que no se hace.
>
> **Reglas nuevas: una decisión de negocio que depende de la pregunta no es un default, es un
> interruptor del propio reporte · un criterio compartido entre un módulo base y uno de mejora
> vive en el BASE y el otro lo delega — nunca al revés ni copiado · un reporte con interruptor
> DECLARA cuál está usando y expone las columnas de las que sale la diferencia · un filtro que
> excluye el cero apaga justo el caso que motiva encender el interruptor · una prueba que depende
> de trabajo ajeno en curso se OMITE nombrando el motivo, no se deja roja.**

> **LA JERARQUÍA DEL PLAN DE CUENTAS SE DERIVA DEL CÓDIGO (2026-09-01) — `[CTAS-PADRE-1]`**:
> pedido del director técnico tras `[IMP-JERARQ-1]`, sobre las 35 cuentas de **Agua Yamel** que
> quedaron todas sin padre — *«derívalas del padre según el tercer camino»*. **7 pruebas nuevas,
> 3 reglas verificadas VIOLÁNDOLAS: las 3 se detectan** · Contabilidad + vistas + rutas
> **138 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`34a9f1e9`). **Sin migración.**
>
> **La jerarquía ya estaba escrita en los números**: `100000` → `110000` → `111000` → `111100` →
> `111110`. La regla es que el padre es la cuenta cuyo código **significativo** —sin los ceros de
> relleno— es el prefijo **MÁS LARGO** del de la hija. ⚠️ **El más largo, no el primero**: con
> `100000`, `110000`, `111000` y `111100` todos son prefijos válidos de `111110`, y colgarla del
> primero la dejaría **tres niveles** por encima de donde le toca.
>
> ⚠️ **Previsualiza SIEMPRE antes de aplicar** —toca la estructura completa del plan de un
> cliente, y verlo antes es lo que permite detectar un código mal tecleado que colgaría una cuenta
> de la rama equivocada— · **un padre puesto a mano NO se pisa**: se NOMBRA como conflicto y se
> deja intacto, porque quien lo asignó sabía algo que el código no dice · **la cuenta que recibe
> hijas deja de aceptar movimientos** · y **un plan cuyos códigos no expresan jerarquía no propone
> nada**: mejor no proponer que inventar una jerarquía que el plan no tiene.
>
> **Verificado en producción con las cuentas reales**: de las 35, **29 recibirían padre**, **6 son
> raíz** (Activos, Pasivos, Patrimonio, Ingresos, Costos, Gastos) y **0 conflictos**;
> `111110 → 111100` sube de nivel 1 a 5. ⚠️ **No se aplicó nada: la previsualización queda a la
> espera del director técnico.**
>
> **Reglas nuevas: cuando el código de un catálogo EXPRESA la jerarquía, esta se DERIVA en vez de
> capturarse a mano · se toma el prefijo MÁS LARGO, no el primero que coincida · un valor puesto a
> mano no se pisa: se nombra como conflicto · una operación que toca la estructura completa se
> previsualiza antes de aplicar.**

> **LA CUENTA PADRE: NI SE PODÍA IMPORTAR NI SE GUARDABA AL EDITAR (2026-09-01) —
> `[IMP-JERARQ-1]`**: dos reportes del director técnico cargando el plan de cuentas de **Agua
> Yamel** (el único cliente real) — *«en la importación no me permite guardar los padres, dice que
> no existen»* y *«le quité al archivo las cuentas padres y me dejó guardar, pero cuando edito las
> cuentas hijas no lo guarda, pero no da error»*. **7 pruebas nuevas, 4 reglas verificadas
> VIOLÁNDOLAS: las 4 se detectan** · Contabilidad **125 passed** · Inventario + Compras
> **188 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`de5c5b43`). **Sin migración.**
>
> ⚠️⚠️ **Son DOS defectos distintos, y ninguno lanza nada.**
>
> **Importar**: el padre se validaba **solo contra la base de datos**. Un plan de cuentas se
> importa completo, con los padres unas líneas más arriba del **mismo archivo**, así que en la
> **vista previa** —donde todavía no se ha guardado nada— cada cuenta hija salía con «el código
> padre no existe» y no se podía aplicar. ⚠️ **El motor SÍ guarda línea por línea al insertar**, así
> que el padre habría estado ahí: el error vivía **solo en la validación previa** y bloqueaba todo.
> Y el síntoma **culpa al archivo**, que es lo que llevó al usuario a quitar la columna.
>
> **Editar**: el formulario **ofrece** la cuenta padre y `store()` **sí la valida**, pero
> `update()` no la incluía en sus reglas — `update($validated)` la **descartaba en silencio**. El
> usuario elegía el padre, guardaba, **no veía ningún error** y la cuenta seguía igual. *Uno acusa
> al archivo; el otro dice que salió bien y no guardó nada.*
>
> **Lo que se hizo**: el motor avisa al importador de cada fila que queda lista —en la vista previa
> y al aplicar—, y el importador acepta un padre que venga **antes en el archivo**; su código viaja
> aparte y se resuelve **al guardar**, que es cuando existe de verdad. Un padre que no está ni en la
> base ni en el archivo **sigue siendo error**. Y `update()` valida el padre, recalcula el nivel y
> **rechaza el ciclo** — colgar una cuenta de su propia descendiente no lanza nada pero deja una
> rama cerrada sobre sí misma que ningún reporte jerárquico puede recorrer.
>
> ⚠️ **En AMBOS caminos, la cuenta que RECIBE hijas deja de aceptar movimientos**: sin eso, importar
> el plan completo dejaba a los padres pudiendo recibir asientos, y un asiento contra una cuenta de
> agrupación descuadra el reporte sin avisar. ⚠️ Una prueba propia lo destapó: el bloque solo corría
> cuando el padre venía del archivo, no cuando ya estaba en la base —el caso normal—.
>
> **Verificado en producción con las cuentas reales**: la vista previa con tres niveles del propio
> archivo da **3 válidas y 0 errores**; un padre inexistente sigue dando error; y editar `111110`
> asignándole `111100` **guarda** y sube el nivel de 1 a 2 (revertido tras comprobar).
>
> ⚠️ **Estado medido de Agua Yamel: 35 cuentas, TODAS sin padre y TODAS en nivel 1** — el resultado
> de haber quitado la columna para poder importar. **La importación no las va a arreglar**: el
> importador omite por duplicado lo que ya existe. Los caminos son editarlas una por una (ahora sí
> guarda) o borrarlas y reimportar con la columna padre.
>
> **Reglas nuevas: un importador con jerarquía valida contra la base Y contra las líneas anteriores
> del propio archivo — validar solo la base da al padre por inexistente durante toda la vista previa,
> y el síntoma culpa al archivo · una referencia que puede no existir al PREPARAR se resuelve al
> GUARDAR, cuando el motor ya insertó la fila anterior · un formulario que ofrece un campo y una
> validación que no lo incluye producen un guardado que dice que salió bien y no guardó nada · un
> ciclo en una jerarquía no lanza nada: deja una rama que ningún reporte puede recorrer.**

> **EL TRÁNSITO ERAN DOS COLUMNAS Y UNA NO LA ESCRIBÍA NADIE (2026-09-01) —
> `[INV-TRANSITO-1]`, `[UI-COL-1]`**: cuatro pedidos del director técnico — *«en tránsito son solo
> las órdenes de compras aprobadas y debe ser universal, `cantidad_en_transito` y
> `cantidad_transito` debe ser un mismo campo, deja solo uno»* · *«llena el demoseeder con esa
> información para hacer las pruebas»* · *«el reporte alertas de reorden aparece sin los códigos y
> descripciones»* · *«evita colocar 2 valores en las columnas de las tablas»*.
> **3 reglas verificadas VIOLÁNDOLAS: las 3 se detectan** · Compras + Inventario + Facturación +
> vistas **302 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`0f8909fa`).
> ⚠️ Migración `2026_09_01_720001`.
>
> ⚠️⚠️ **`inv_stock` tenía DOS columnas para lo mismo, y el síntoma no era un error.**
> `cantidad_transito` es la VIVA —la escribe la aprobación de la OC y la descuenta la recepción—;
> `cantidad_en_transito` era **huérfana: no la escribía nadie**, y su único lector era el sugerido
> de reabastecimiento, que por eso **sumaba siempre 0 y proponía reponer mercancía que ya venía en
> camino**. *Un número plausible que cuenta otra cosa.* **Medido antes de eliminar: ambas en 0.00**
> — la migración lo vuelve a comprobar en el instante del DROP, porque la medición de hace días no
> prueba nada. ⚠️ El docblock de `ClasificacionService` **ya declaraba el problema** y esperaba que
> el negocio confirmara cuál era la buena; lo que queda abierto ahora es de negocio y no de
> esquema: **si el tránsito debe entrar en la cobertura**.
>
> **El demo pasa por el PROCESO REAL, no marcando estados a mano**: la OC nace en borrador y la
> aprueba `PurchaseOrderService::aprobar()` —que es quien registra el tránsito—, sus líneas
> declaran `bodega_destino_id` (sin él la aprobación no sabe a qué almacén entra la mercancía), y
> la recepción nace en borrador y la postea `ReceiptService::postear()`. ⚠️ **Marcar la recepción
> posteada a mano dejaba el tránsito contando las 100 unidades de la OC aunque ya hubieran llegado
> 80**: el demo enseñaba un número inflado. Se agrega además una **segunda OC aprobada SIN
> recibir**, para que exista el escenario limpio.
>
> ⚠️⚠️ **Un defecto de PRODUCCIÓN que encontró cablear el proceso real**: `aprobar()` **reventaba
> con TypeError** si la línea no traía cuenta de gasto y la empresa no tenía configurado el
> `gasto_default` de Compras — `comprometerPresupuesto()` pasaba `null` a una firma que exige
> `string`. **El docblock ya prometía el no-op y el cuerpo no lo aplicaba**, y como `aprobar()` va
> en transacción se perdía **también el registro del tránsito**. Ahora se omite NOMBRANDO la línea
> y diciendo qué configurar.
>
> **Las alertas de reorden salían sin código ni descripción, y el defecto era de DATOS**:
> `InventarioSeeder::limpiar()` borra artículos y bodegas y **nunca los criterios**, así que sin FK
> el huérfano nace en el acto (`[INV-LOTE-1]`, `[PICK-UBI-1]`). **Medido: 8 de 13 colgaban de
> artículos borrados** — exactamente las 8 filas de la captura. ⚠️ **Los 8 eran de la cuenta demo**,
> creados a las 03:00 del reset: **cero clientes reales**.
>
> **`[UI-COL-1]` — un dato por columna**: una celda con dos datos apilados no se lee en diagonal, no
> se puede ordenar por ninguno y ensancha la columna de más. Corregidas las **5 celdas** de las tres
> pantallas de este flujo, con los `colspan` corridos y verificando que cada tabla cuadra.
> ⚠️ **MEDIDO Y DECLARADO: el patrón está en 122 celdas de 112 vistas** del ecosistema —
> Contabilidad, PSA, Activos, Compras, Car Wash, Abastecimiento—. Corregirlas todas son varias
> sesiones y **el orden es decisión de alcance**.
>
> **Verificado en producción tras el `demo:reset`**: columna huérfana **eliminada**, 3 OC aprobadas,
> **tránsito 1 680,00 en 9 filas** con CEM-001 en **20** (100 aprobadas − 80 recibidas) y VAR-001
> desaparecido por recibirse completo, **criterios huérfanos 8 → 0**, y la pantalla de Alertas
> renderizando **748 KB** con Código y Descripción en columnas propias.
>
> **Reglas nuevas: dos columnas para el mismo dato no producen un error sino un número plausible que
> cuenta otra cosa — la que no escribe nadie hace que su lector sume siempre cero · un seeder que
> marca un estado a mano miente en el eslabón siguiente · una línea de documento sin bodega destino
> no puede registrar en qué almacén entra la mercancía · un no-op prometido en el docblock hay que
> aplicarlo en el cuerpo: pasar null a una firma que exige string revienta la transacción entera ·
> un criterio que cuelga del artículo Y de la bodega se borra cuando se borra cualquiera de los dos
> · un dato por columna: dos apilados no se leen en diagonal ni se pueden ordenar.**

> **EXISTENCIAS POR BODEGA Y EL SALDO QUE NO DESCONTABA LO COBRADO (2026-09-01) —
> `[INV-MATRIZ-1]`, `[VTA-CLI-1]`, `[KPI-VEND-1]`**: tres pedidos del director técnico — las
> capturas del reporte de inventario de Hyplast (*«es uno nuevo que va en el módulo de inventario
> en reportes, verifica si no existe y créalo o mejora el que existe»*) y dos reportes de
> producción: *«el KPI de los vendedores está dando error al abrir»* y *«en ventas por clientes la
> barra indicadora no parece estar correcta. Mira la primera línea 330.400 no se ha cobrado pero
> indica 50%»*. **9 reglas verificadas VIOLÁNDOLAS: las 9 se detectan** · Inventario **122 passed**
> · Facturación **110 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`5edf1bc8`).
> **Sin migración.**
>
> ⚠️ **El KPI de vendedores no se podía abrir por un desajuste de nombres**: el controlador producía
> `total_ventas` y la tabla leía `ventas_brutas`. **No falla al calcular: falla al RENDERIZAR**, así
> que la pantalla queda caída entera y **compilar la vista no lo ve** — hay que renderizarla.
> Corregidas **las tres** claves: arreglar solo la que reventaba habría movido el error a la línea
> siguiente. ⚠️ Y un defecto propio: mi aserción contaba `10,000.00` esperando 2 y salían **3** —el
> mismo importe aparece en brutas, netas y total—; reescrita con un segundo vendedor.
>
> ⚠️⚠️ **En ventas por cliente la barra estaba BIEN y el defecto era la columna de al lado.** El %
> mide participación y suma 100 %; lo que fallaba es que **«Saldo pendiente» no descontaba lo
> cobrado**. Una factura pagada al 100 % salía con todo su importe pendiente y el KPI del encabezado
> era **igual al total facturado**. **La causa: un alias de SELECT que se llama igual que un accessor
> del modelo** — el `selectRaw` aliasaba la resta como `saldo` y `Factura::getSaldoAttribute()`
> **gana sobre la columna del select**, calculando `total - monto_cobrado` sobre un `monto_cobrado`
> que el agregado no trae. **No lanza nada y el número es plausible.** Se agrega además la columna
> **% Cobrado** —lo que un reporte de cuentas por cobrar debe responder— y la anterior pasa a
> **Participación** sin barra: junto a «Cobrado» y «Saldo» se leía como avance de cobro. **Medido en
> producción: el pendiente baja de 660 387 a 489 287** y el cuadre da exacto en las 3 empresas que
> facturan. ⚠️ **Una prueba propia pasaba con el defecto puesto**: sin el alias, `saldo_pendiente`
> no venía, salía `null` y `assertEquals(0.0, null)` **pasa**.
>
> **El reporte de inventario se MEJORA, no se duplica**: `matriz-bodega` existía como versión
> mínima y crear otro daría dos respuestas a la misma pregunta. **Cinco decisiones no se copiaron
> del sistema de referencia, y cada una sale de MEDIR producción**: las etiquetas de clasificación
> **las nombra la empresa** (las tres las llaman distinto: «Categoría», «Línea», «Clasificación
> 1») · agrupa por **grupo** porque **107 artículos lo tienen y solo 12 tienen clasificación** · el
> filtro de tipo nace **apagado** porque el del sistema de referencia escondería **39 de 51** · el
> reorden sale de `inv_criterios_abastecimiento` (**13 filas**) y no de las columnas homónimas de
> `inv_stock` (**0**) · y **«con existencia» incluye lo reservado y lo que viene en tránsito**.
>
> ⚠️⚠️ **Un defecto propio que encontró la REGRESIÓN: el cuadre se apagaba en la pantalla por
> defecto.** Los dos filtros que nacen encendidos lo desactivaban, así que **no se calculaba nunca**
> sin que el usuario tocara nada — *un cuadre que no se muestra no avisa de nada*. La distinción que
> lo resuelve: **`solo_existencia` excluye filas en CERO y no cambia la suma**, pero **`solo_activos`
> sí dejaría fuera el stock de un artículo inactivo**, así que la fuente aplica el MISMO filtro en
> vez de rendirse. ⚠️ Y otro de método: **mi script de verificación asumió una columna `valor` que el
> servicio nunca calculó** y acusó a las 6 empresas; el servicio estaba bien.
>
> **Verificado en producción: el cuadre APLICA y cuadra exacto en las 6 empresas** (antes se apagaba
> siempre), las etiquetas salen distintas por empresa y la pantalla real renderiza **811,9 KB**.
> ⚠️ **Solo la cuenta demo tiene stock: Agua Yamel —el único cliente real— tiene 0 bodegas y 0
> existencias.** ⚠️ **Declarado**: la matriz mide **cantidades, no valor** — el valorizado vive en su
> propio reporte y duplicarlo daría dos números que pueden divergir.
>
> **Reglas nuevas: un alias de SELECT no puede llamarse igual que un accessor del modelo — el
> accessor gana y lee columnas que el agregado no trae, sin lanzar nada · un controlador que produce
> unas claves y una vista que lee otras no falla al calcular, falla al RENDERIZAR: compilar no basta
> · una prueba que compara contra `null` porque la clave no existe pasa por la razón equivocada ·
> un cuadre que se apaga con los filtros que nacen encendidos no se calcula nunca: solo lo apagan
> los que la fuente NO puede reproducir · antes de replicar un reporte de otro sistema hay que MEDIR
> los datos propios · un script de verificación que asume una clave inexistente acusa al código
> sano.**

> **UN SOLO LINK: LA MATRIZ PASA A SER PESTAÑA (2026-09-01) — `[VTA-MES-4]`**: reporte del
> director técnico — *«vi que no lo dejaste en un solo link como hyplast sino que los separaste por
> opciones del menú»*. **4 reglas verificadas VIOLÁNDOLAS: las 4 se detectan** (19 con las de
> `[VTA-MES-3]`) · Facturación + Inventario + guardas **225 passed**. **DESPLEGADO Y VERIFICADO EN
> PRODUCCIÓN** (`94cdf013`). **Sin migración.**
>
> ⚠️ **Tenía razón, y el origen del error es mío**: cuando llegó la primera captura
> (`[VTA-MES-1]`) yo no sabía que era una **pestaña** de la pantalla de análisis de Hyplast, así que
> la construí como reporte independiente. Medido antes de tocar nada, el menú de Facturación tenía
> **dos entradas para lo mismo**: «Análisis de Ventas» en Gestión Comercial y «Ventas mensuales
> (matriz)» en Reportes. Ahora es **un solo link con nueve pestañas** — *un segundo ítem para la
> misma matriz obliga al usuario a saber en cuál de los dos sitios buscar.*
>
> **Decisión del director técnico**: dos pestañas separadas, no una con toggle. La matriz se extrajo
> a un partial que sirven **las dos superficies** —la pestaña y la pantalla propia que usa
> Inventario— y **se borró la copia**; lo mismo con `isoFuncional()`, que al montar la pestaña se me
> duplicó en los dos controladores y se **subió** al servicio.
>
> ⚠️ **Un defecto evitado al montarla**: los dos filtros de la pantalla compartían el id
> `formFiltros`, así que **Aplicar habría enviado siempre el primero del DOM** y el usuario vería
> que su filtro no hace nada. ⚠️⚠️ **Y un defecto propio de método**: la prueba de eso **NO detectaba
> su violación** — buscaba la cadena `'formMensuales'` suelta, que aparece también en el `onchange`
> del selector de año. Corregida para mirar la **llamada** a `filtroMultiple()`; repetida, se detecta.
>
> ⚠️ **Inventario NO se tocó**: conserva su pantalla enfocada. El reporte de inventario tipo
> Softland que pidió el director técnico es **otro** y queda **pendiente** — su URL en Hyplast pide
> login, así que hacen falta las capturas.
>
> **Reglas nuevas: si en el sistema de referencia algo es una PESTAÑA, replicarlo como pantalla
> suelta obliga al usuario a saber dónde buscar — y una captura sola no dice si lo que muestra es
> una pantalla o una pestaña · dos formularios de filtro en la misma pantalla no pueden compartir el
> id · una aserción sobre una cadena suelta pasa por cualquier otro sitio que la contenga.**

> **VENTAS POR ARTÍCULOS Y PRE-VENTA EN EL ANÁLISIS DE VENTAS (2026-09-01) — `[VTA-MES-3]`**:
> pedido del director técnico con las capturas de las ocho pestañas de Hyplast — *«será
> ventas-analisis cambialo ya que zyntello no son solo cajas, son diferentes clientes diferentes
> medidas, la idea es adaptarlo, no se si ya exista, si existe agrega las pestañas nuevas que
> faltan»*. **15 reglas verificadas VIOLÁNDOLAS: las 15 se detectan** · Facturación + Inventario +
> guardas **217 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`21a2827f` + `c5b543af`).
> **Sin migración.**
>
> **Lo primero fue inventariar, y de las ocho pestañas SEIS ya existían**: faltaban «Ventas por
> Artículos» y «Pre-Venta». *Antes de construir una pantalla que «falta» hay que medir qué existe.*
>
> ⚠️ **La adaptación que el director técnico pidió**: Zyntello **no factura solo cajas**. Cada
> artículo trae **su** unidad de medida, así que midiendo en cantidad la pantalla **declara las
> unidades presentes y avisa cuando hay más de una** — sumar 3 unidades con 5 kilos da 8 de nada.
> Medido en producción: el catálogo mezcla **UND y SAC**, el aviso no es teórico.
>
> ⚠️ **Sale del MISMO servicio que el reporte independiente**, así que cuadra por construcción:
> jerarquía y matriz plana dan **325 857,00 exacto** en las tres empresas. El servicio se extrajo
> del controlador y **se borró la copia**, igual que la función Alpine del desplegable de filtros —
> con una copia por vista, corregir el botón **Cerrar** en una dejaría la otra desviada.
> ⚠️ **Especiales/Regulares SÍ aplica en la jerarquía** —el nivel de arriba es el cliente— al revés
> que en la matriz por artículo; esa regla vivía en el controlador y **se movió al servicio**, y lo
> delató una prueba existente que se puso roja al refactorizar.
>
> **Pre-Venta responde si el agente va a llegar a la meta.** ⚠️ **Mide PEDIDOS, no facturas**: es lo
> que cerró con el cliente, se haya facturado o no — medirla por facturas lo castigaría por la
> demora de despacho, que no depende de él. Y **«Facturado» se deriva de `cantidad_facturada` POR
> LÍNEA**, porque un pedido se factura a medias y en varias facturas: contarlo por documento daría
> el pedido completo la primera vez, o nada hasta la última. ⚠️ **La meta sale de
> `fact_analisis_proyecciones`**, la misma que alimenta «Configurar Proyección» — y solo la
> granularidad **mensual**, porque con la semanal la columna `mes` guarda el número de semana y una
> semana ISO puede pertenecer a dos meses. ⚠️ **Las dos pestañas cargan SOLO al abrirse**: sus
> consultas recorren líneas de documento y cargarlas siempre penalizaría a las otras seis.
>
> ⚠️⚠️ **Tres defectos que solo aparecieron midiendo los festivos REALES de producción** — no los
> encontró escribir el código ni correr las pruebas. **(1) El día de la semana se leía del año del
> ALTA**: el catálogo guarda los festivos anuales con el año base 2000, y el 19 de septiembre fue
> **martes en 2000** y cae **sábado en 2026** → restaba días hábiles que sí se trabajan. **(2) El
> mismo feriado contaba dos veces**: el 15 de septiembre está **duplicado** en el catálogo real.
> **(3) La proyección se apagaba la primera semana de cada mes**: restaba los feriados del mes
> COMPLETO a los transcurridos, así que el día 1 con 5 feriados por delante daba `max(0, 1−5) = 0`
> y decía «sin días transcurridos» con el mes ya empezado — **medido: las 6 empresas de producción
> la tenían apagada**, y tras el fix **DT pasó de 0 a 1**.
>
> **Verificado en producción renderizando la pantalla real**: 866 KB en la pestaña de artículos y
> 849 KB en Pre-Venta, ambas con el importe real de marzo (145 000,00), app 200, scripts borrados
> (`[#1250]`). ⚠️ **Alcance: solo la cuenta demo tiene pedidos** (8 entre sus 3 empresas) — **Agua
> Yamel, el único cliente real, tiene 0 pedidos y 0 facturas**.
>
> ⚠️ **Hallazgos fuera de alcance**: dos pedidos del demo tienen total en la **cabecera** y **cero
> líneas**, así que la Pre-Venta —que suma por líneas, como todo el reporte— los muestra en 0 · y
> quedaba un **temporal olvidado en el servidor** (`verif_final.php`, de la sesión de `[CONT-CTA-1]`
> del 26/08, cuyo propio comentario decía «se elimina al terminar»), ya retirado.
>
> **Reglas nuevas: antes de construir una pantalla que «falta» hay que inventariar qué existe — seis
> de las ocho pestañas pedidas ya estaban hechas · la pre-venta se mide por PEDIDOS, no por facturas
> · lo facturado se deriva de la cantidad facturada POR LÍNEA · un día de la semana leído de una
> fecha de otro año es el día equivocado: un festivo anual se PROYECTA al año consultado · un
> catálogo puede tener el mismo feriado duplicado, así que se cuentan fechas ÚNICAS · de los días
> transcurridos solo salen los feriados que YA ocurrieron · un feriado sin fecha se asume futuro ·
> una meta que existe en dos granularidades se lee de UNA · una pestaña cuya consulta recorre líneas
> se carga al abrirse, no al abrir la pantalla · compilar una vista no prueba que se pueda abrir:
> hay que RENDERIZARLA.**

> **EL MISMO REPORTE TAMBIÉN DESDE INVENTARIO (2026-09-01) — `[VTA-MES-2]`**: pedido del
> director técnico — *«el de inventario agrégalo también en los reportes de inventario como
> adicional»*. **3 reglas nuevas verificadas VIOLÁNDOLAS: las 3 se detectan** (10 con las de
> `[VTA-MES-1]`) · guardas + Facturación + Inventario **192 passed**.
> **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`ff7e2217`). **Sin migración.**
>
> ⚠️ **Cada módulo declara SU PROPIA ruta apuntando al MISMO controlador** —ni una línea
> duplicada—: si el menú de Inventario listara la ruta de Facturación, `ModuleMenu` la reclamaría y
> **Facturación dejaría de abrirse** desde su selector. Es el defecto de `[CND-FIX]`, `[CW-F0-5]` y
> `[REST-F0-4]`: **tres veces** en el ecosistema, siempre con la regla escrita en prosa. Ahora hay
> una **prueba** que recorre el menú de Inventario y falla si aparece una ruta ajena.
>
> **El default de agrupación depende de quién pregunta**: Inventario abre **Por Artículo** —quiere
> saber qué se mueve— y Facturación **Por Cliente**; lo que el usuario pida manda sobre el default.
> ⚠️ Y **los enlaces se arman con la ruta del módulo desde el que se abrió**: con enlaces fijos,
> abrirlo desde Inventario sacaría al usuario de su módulo al primer clic en una pestaña.
>
> ⚠️ **Un defecto propio**: la prueba del menú buscaba Inventario como módulo raíz y está **ANIDADO
> bajo el bundle ERP** desde `[BUNDLE-FIX-2]`. Lo encontró correrla.
>
> **Verificado en producción**: desde Facturación agrupa por cliente (3 filas) y desde Inventario
> por artículo (6 filas), **ambas con el mismo total 325 857,00** y con los enlaces de su módulo.
>
> **Reglas nuevas: un reporte compartido entre dos módulos declara UNA ruta por módulo apuntando al
> mismo controlador — el menú de un módulo nunca lista la ruta dueña de otro, y eso se comprueba con
> una prueba en vez de escribirlo en prosa (cuarta vez) · sus enlaces internos se arman con la ruta
> del módulo desde el que se abrió · el default de una opción depende de quién abre la pantalla.**

> **LOS FILTROS SOLO SE PODÍAN CERRAR HACIENDO CLIC FUERA (2026-09-01) — `[VTA-MES-1]`**:
> reporte del director técnico con captura — *«no hay botón aceptar en los filtros solo limpiar,
> hay que hacer clic fuera, es mejor colocar un botón que cierre el filtro y no hay manera de ver
> regulares resumen y especiales como aparece al inicio»*.
> **7 reglas verificadas VIOLÁNDOLAS: las 7 se detectan** · vistas + ayuda + rutas + Facturación
> **81 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`8fef656c`). **Sin migración.**
>
> ⚠️⚠️ **Lo primero fue buscar la pantalla, y NO EXISTÍA en el ecosistema.** Ninguno de los tres
> repositorios tenía las pestañas `Todos ⏐ ⭐ Especiales ⏐ Regulares`, ni los desplegables de
> clientes y artículos, ni el «(Seleccionar todo)» —**cero coincidencias en las 1 286 vistas**—, ni
> los meses en columnas. **La captura era de otro sistema** —Hyplast, la referencia que ya se usó en
> CRM y Gestión de Clientes—, no un defecto de Zyntello. Con eso medido, la decisión del director
> técnico fue **construirla**. *Un reporte con captura no siempre describe la pantalla propia.*
>
> **Los tres defectos, resueltos**: cada desplegable trae **Aplicar** (envía la consulta) además del
> botón global · trae **Cerrar**, y ⚠️ **cerrar DEVUELVE la selección a lo último aplicado** —si
> dejara las marcas puestas, el botón diría «5 seleccionados» mientras la tabla muestra los 178, un
> filtro que el reporte no está usando (`[PRE-FIX-1]`)— · y las **tres pestañas están siempre
> visibles** arrastrando el resto de los filtros. ⚠️ **«Seleccionar todo» actúa solo sobre lo que la
> búsqueda deja a la vista**: marcar en silencio lo que no se ve haría que el filtro no coincida con
> la lista que el usuario acaba de leer.
>
> ⚠️ **Por cliente y por artículo salen de la MISMA consulta**, así que cuadran por construcción —
> con consultas separadas «lo que vendí» tendría dos respuestas (quinta vez que el ecosistema evita
> esta forma). Verificado en producción: las dos dan **325 857,00** exacto. ⚠️ **Por eso el total es
> la SUMA DE LAS LÍNEAS y no el total facturado**: ITBIS, flete, documentación, transporte y
> descuento general viven en la cabecera. La diferencia se pinta **siempre** al pie, y ⚠️ **con
> filtro de artículos el cuadre se APAGA diciéndolo** — esas facturas traen su importe completo y
> una diferencia ahí no significaría nada.
>
> **Especiales y Regulares reusan `fact_clientes_especiales`**, el catálogo que ya alimenta Análisis
> de Ventas: un cliente no puede ser especial en una pantalla y regular en la otra. Verificado:
> **272 757 + 53 100 = 325 857**, la partición cuadra exacta. ⚠️ **Sin especiales configurados la
> vista sale VACÍA y explica por qué** —mostrar la cartera completa haría creer que todos son
> especiales— y **agrupando por artículo se ignora**, porque clasifica clientes. ⚠️ **Los catálogos
> de los filtros salen de lo que TIENE VENTAS**, no del catálogo completo: eso explica el
> «178 opciones» de la captura.
>
> ⚠️ **Dos defectos propios, los dos cazados verificando**: **V6 salió NO SE DETECTA** porque
> `usort` es **ESTABLE en PHP 8** y mi fixture llegaba ya en orden alfabético —la lección de
> `[PICK-UBI-1]` repetida—; corregido fijando los ids para que el orden de llegada sea el CONTRARIO
> y poniéndole `ORDER BY` a la consulta para que ese orden deje de decidirlo MySQL. Y ⚠️ **la ayuda
> nació con los campos como string** cuando `Ayuda::campo()` declara `?array`: **habría reventado
> con un TypeError al renderizar el primer tooltip**.
>
> **Verificado en producción renderizando la pantalla real**: 819 KB de HTML con Aplicar, Cerrar,
> «(Seleccionar todo)», las tres pestañas, los meses y el cuadre; 2 rutas resuelven y la app
> responde 200. ⚠️ **Alcance medido antes de cerrar: solo la cuenta demo factura** (13 documentos).
> **Agua Yamel —el único cliente real— tiene 0 facturas**, igual que Comercial Aranza y TAPIA.
>
> **Reglas nuevas: un reporte con captura no siempre describe la pantalla propia — localizarla en el
> código antes de «corregirla» · un desplegable de filtro necesita Aplicar y Cerrar, y cerrar
> DEVUELVE la selección o el botón miente sobre lo que el reporte usa · «seleccionar todo» actúa
> sobre lo visible, no sobre lo que la búsqueda esconde · dos agrupaciones del mismo reporte salen de
> la MISMA consulta o su total tendrá dos respuestas · un cuadre que no se puede calcular se APAGA
> diciéndolo · un catálogo de filtro se arma con lo que tiene movimiento · `usort` es estable en
> PHP 8: para ejercer un desempate hay que fijar el orden de llegada CONTRARIO al esperado
> (reincidente) · un campo de ayuda es un array label/texto, no un string.**

> **EL PICKING SE PREPARA SIGUIENDO EL RECORRIDO DEL ALMACÉN (2026-09-01) — `[PICK-UBI-1]`**:
> tras preguntar el director técnico por el orden del picking —*«¿el despacho va antes o después?
> ¿y el orden no va por la ruta de despacho, primero entra el que se entrega de último?»*— eligió
> el alcance: **«primero Orden por ubicación de bodega y luego el planificador de Rutas»**.
> **7 reglas verificadas VIOLÁNDOLAS: las 7 se detectan** · Inventario + vistas + ayuda + rutas
> **121 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`a2aed911`).
> ⚠️ Migración `2026_09_01_710001`.
>
> **Las respuestas a las tres preguntas, verificadas en el código**: el **despacho va DESPUÉS** del
> picking y copia `cantidad_preparada` —no la de la factura—, así que la guía dice lo que de verdad
> se cargó; el **orden no iba por ruta**; y el **LIFO de carga es del módulo `rutas`**, declarado
> en el menú y vendible desde `[MOD-ADIC-2]` pero **sin implementar** — exige consolidar varios
> documentos en un camión, que el picking por documento no hace.
>
> ⚠️⚠️ **Toda la cadena de ubicaciones estaba MUERTA, medido antes de tocar nada**:
> `inv_ubicaciones` tenía **12 filas y las 12 huérfanas** (bodegas 412 y 413 inexistentes),
> `inv_stock.ubicacion_id` estaba en **0 de 51**, `inv_lotes_ubicacion` en 0, y **no había
> pantalla** desde la que asignar una ubicación.
>
> ⚠️ **La causa del huérfano**: `InventarioSeeder::limpiar()` borra `inv_bodegas` y nunca las
> ubicaciones, y sin FK el huérfano nace en el acto. Es la forma de `[INV-LOTE-1]`, que corrigió
> lotes y seriales **pero no esto**: las ubicaciones cuelgan de la BODEGA, no del artículo, así que
> aquel barrido no las alcanzaba. ⚠️ Y **sin pantalla la tabla era una función que no existe**
> (`[CW-FIX-2]`): por eso la columna llevaba en cero desde el diseño de Inventario.
>
> ⚠️ **El código NO sirve como orden**: si el pasillo B está pegado a la puerta y el A al fondo, el
> recorrido es B → A, y ordenar por código mandaría al bodeguero al fondo y de vuelta. Se declara.
> Y **se guarda completo de una vez**: un recorrido a medias manda de un extremo al otro sin que
> nada lo avise.
>
> ⚠️ **Lo que no tiene ubicación va AL FINAL**, nunca al principio · **sin bodega elegida no se
> resuelve ninguna** —la misma pieza puede estar en el pasillo A de un almacén y en el D de otro—,
> protegido por DOS guardas que se declaran y se violan juntas (`[REST-F7]`) · **la línea guarda el
> CÓDIGO, no el id**, para que la orden ya impresa siga diciendo dónde se buscó.
>
> ⚠️⚠️ **Un defecto de fondo apareció al verificar: el «orden del documento» no existía.**
> `Pedido::lineas()` y `Factura::lineas()` **no llevan `ORDER BY`**, así que ese orden lo decidía
> MySQL y podía cambiar entre generaciones **incluso sin ubicaciones**. El desempate final usa la
> columna `orden` que el documento sí declara — séptima vez que esta forma aparece (`[PRE-FIX-1]`).
>
> ⚠️ **Dos defectos propios, los dos cazados verificando por violación**: la prueba de estabilidad
> pasaba porque **`usort` es ESTABLE en PHP 8** y mi fixture tenía el orden alfabético igual al del
> documento —quitar el desempate daba lo mismo—; y la vista nueva **no compilaba** por `@json` con
> más de tres comas, lo cazó `VistasCompilanTest`, escrita justo para eso.
>
> **Verificado en producción tras el `demo:reset`**: ubicaciones huérfanas **12 → 0**, **12 con
> orden declarado**, **25 filas de stock ubicadas** y el picking saliendo en orden de recorrido.
> ⚠️ **Agua Yamel —el único cliente real— no tenía ninguna ubicación**: las 12 eran de la cuenta
> demo, así que el impacto de la limpieza fue **cero**.
>
> **Reglas nuevas: un huérfano se busca también hacia arriba — las ubicaciones cuelgan de la
> bodega, no del artículo, y el barrido que corrigió lotes no las alcanzaba · el orden de recorrido
> de un almacén se DECLARA, no se deriva del código · lo que no está ubicado va al final, nunca al
> principio · un recorrido se guarda completo, porque a medias manda de un extremo al otro · una
> relación sin `ORDER BY` no define ningún orden · `usort` es estable en PHP 8, así que un fixture
> cuyo orden natural coincide con el esperado no ejerce el desempate.**

> **EL ALTA DE PICKING MOSTRABA LOS DOS COMBOS Y GENERABA A CIEGAS (2026-08-31) —
> `[PICK-UX-1]`**: reporte del director técnico — *«no me gusta la interfaz de la generación del
> picking… muestra 2 combos pero a la vez dos opciones factura y pedido, puede aparecer uno o el
> otro… que las filas sean con el código del artículo, la descripción, cuántos son y cuántos van
> en varias columnas, además debe tomar en cuenta seriales y lotes»*.
> **6 reglas verificadas VIOLÁNDOLAS: las 6 se detectan** · Inventario + vistas + rutas
> **105 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`7653878e`). **Sin migración.**
>
> ⚠️ **Los dos combos: el `x-show` iba sobre el `<select>`**, pero `data-buscar` lo reemplaza con el
> wrapper de TomSelect — Alpine ocultaba el original y **el wrapper quedaba a la vista**. Es la
> familia de `[AGENTES-7]`: *TomSelect crea DOM que Alpine no controla*. El `x-show` pasa al DIV
> contenedor, que envuelve a los dos. El tipo se elige con botones, no con radios.
>
> ⚠️⚠️ **Y el defecto de fondo: el picking se generaba A CIEGAS** — no se veía qué artículos
> entraban, cuánto faltaba por despachar, si había stock ni qué lote tocaba. El bodeguero lo
> descubría en el almacén, con la orden ya impresa. Ahora previsualiza al elegir el documento, a
> ancho completo, con **once columnas**: código, descripción, solicitado, despachado, a preparar,
> disponible, lote sugerido, vencimiento, seriales y el aviso por línea.
>
> ⚠️ **«A preparar» es solicitado − despachado, no la cantidad del documento**: con la del
> documento, un pedido despachado a medias mandaría a buscar el doble. En el pedido sale de
> `cantidad_entregada`; en la factura hay que **sumar los despachos**, porque una factura no lleva
> esa cuenta. ⚠️ **El disponible DESCUENTA lo reservado y se acota a la bodega elegida**: el total
> de la empresa haría creer que hay mercancía que en ese almacén no está.
>
> ⚠️ **La previsualización sale del MISMO servicio que el alta** (reusa `cargarOrigen` y
> `sugerirLote`): con una consulta propia podría prometer un lote y el picking generar otro, y el
> bodeguero buscaría algo que la orden no dice. ⚠️ **Lotes y seriales solo donde el artículo los
> maneja** —marcar «sin lote» en uno que no los usa se lee como un problema que no existe— y **el
> aviso NO bloquea**: preparar parcialmente es legítimo; lo que no puede es descubrirse en el
> almacén.
>
> ⚠️ **Un defecto propio: una prueba pasaba por la razón equivocada.** «El lote se sugiere solo
> donde se maneja» no detectaba su violación porque el artículo sin lotes **tampoco tenía lotes en
> la tabla**, así que quitar el guard daba `null` igual. Se le montó un lote viejo —el caso real de
> un artículo al que se le quitó el control— y entonces sí falla.
>
> **Verificado en producción**: la previsualización de `FAC2-000002` devuelve sus 2 líneas con
> código, solicitado, despachado, disponible y el aviso **«Stock insuficiente: faltan 35»** — el
> caso exacto que había que ver antes de bajar al almacén. ⚠️ **Hallazgo fuera de alcance**: las
> líneas de servicios de Facturación no llevan artículo, la misma forma que `[COM-ART-1]` cerró en
> Compras y aquí sigue abierta.
>
> **Reglas nuevas: un `x-show` sobre un `<select>` con TomSelect oculta el original y deja el
> wrapper a la vista — va en el contenedor · «a preparar» es lo solicitado menos lo despachado, no
> la cantidad del documento · un disponible que no descuenta lo reservado ni se acota a la bodega
> promete mercancía que no está · una previsualización sale del MISMO servicio que ejecuta · un
> aviso de lote en un artículo que no los maneja se lee como un problema inexistente · un aviso de
> stock no bloquea: lo que no puede es descubrirse en el almacén · una prueba sobre un caso que
> tampoco tiene datos pasa por la razón equivocada.**

> **LAS 11 PANTALLAS DE CUENTAS CONTABLES AL FORMATO DEL MODELO (2026-08-31) — `[CTAS-STD]`**:
> pedido del director técnico — *«todos los módulos tienen su enlace en Cuentas Contables, quiero
> que todos tengan este formato: `parametros-contables/cxp?categoria=otros`»*. **1 guarda nueva
> verificada VIOLÁNDOLA** · Contabilidad + vistas + rutas **126 passed**. **DESPLEGADO Y VERIFICADO
> EN PRODUCCIÓN** (`5e2f1b40`). **Sin migración.**
>
> ⚠️ **Medido primero: había TRES familias y 17 enlaces distintos**, y solo cxp y cxc usaban el
> formato pedido. Las otras **11 arrastraban el patrón viejo de DOS modales sueltos** —uno para la
> cuenta y otro para el centro— en vez del modal en cascada CC→Cuenta que `[#1392]` fijó como
> estándar. Con dos modales sueltos **la cuenta se elige SIN filtrar por centro de costo**, así que
> se puede guardar una combinación que el plan no admite; y cada copia divergió («Centro» vs
> «Centro de Costo»). Las 5 vistas de los verticales eran **copias literales**.
>
> ⚠️⚠️ **Antes de mover nada hubo que descartar un defecto que NO existía**: el hub resuelve con
> `entidad_tipo='modulo'` y los verticales guardan en `'carwash'`, `'prestamello'`… — parecía que
> **escribían donde nadie lee**. Leyendo los DOS lados resultó que no: el vertical resuelve la
> cuenta él mismo y pasa la línea ya resuelta. *Casi reporto un defecto grave inexistente.* Y eso
> es lo que hace segura la unificación: el catálogo declara cada vertical con **su mismo
> `entidad_tipo`** → migración transparente (4 verticales con **0 filas**, Restaurante con 1).
>
> **Dos huecos que aparecieron al medir**: ⚠️ **Condominios no estaba en el catálogo contable**
> (0 conceptos; vivía de una constante local) → declarado con sus 8; y ⚠️⚠️ **Prestamello mostraba
> 6 conceptos cuando el catálogo declara 10** — los 4 de venta a crédito y provisión de incobrables
> de `[PRE-F2-2]`/`[PRE-F4-2]` **no se podían configurar desde ninguna pantalla** (verificado: 0
> empresas). Restaurante gana su ruta genérica, que nunca tuvo.
>
> **Quedan fuera con motivo**: Facturación guarda en columnas propias de `fact_configuracion_fiscal`
> y ya tiene su flag de transición; Inventario es por instancia y la genérica **remite a él**.
>
> ⚠️ **La guarda encontró dos vistas más de las que yo había tocado** (activos e inventario), y la
> guarda que ya existía —`CatalogoConceptosTest`— **frenó el cambio** hasta declarar `'condominios'`
> en su lista blanca. En producción: los **16 ítems** del menú resuelven y los **17 módulos**
> declaran conceptos.
>
> **Reglas nuevas: cuando el mismo modal existe en tres implementaciones, las copias divergen y el
> usuario ve tres pantallas distintas para la misma tarea · antes de declarar que una pantalla
> «escribe donde nadie lee» hay que leer LOS DOS lados · una pantalla que muestra menos conceptos
> que los declarados esconde configuración que nadie puede completar · un módulo del catálogo sin
> conceptos abre su pantalla vacía, y eso se comprueba con una prueba.**

> **SIETE PANTALLAS DEL MENÚ NO SE PODÍAN ABRIR (2026-08-31) — `[RUTAS-1]`**: reporte del
> director técnico — *«en cxp no existe `/cxp/config`, da error»*. **1 guarda nueva, verificada
> VIOLÁNDOLA en dos archivos distintos: las dos se detectan** · CxP + CxC + Compras + CRM
> **332 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`318cd91b`). **Sin migración.**
>
> ⚠️⚠️ **No era una: eran SIETE.** Laravel resuelve las rutas **en orden de DECLARACIÓN**, no por
> especificidad, y `GET /cxp/{cxp}` estaba en la línea 77 mientras el grupo `cxp/config` iba en la
> 131 — así que `/cxp/config` la atendía el `show` con el literal `'config'` como id. Medido con
> el router: `/cxp/config`, `/cxc/config`, `/cxc/dunning`, `/cxc/provisiones`, `/cxc/castigos`,
> `/crm/leads/exportar` y `/compras/importaciones/reportes`.
>
> ⚠️ **Seis de las siete están enlazadas desde el menú**, entre ellas las tres pantallas que
> `[CXC-F4]` entregó completas —provisión de incobrables, castigos y dunning—, con sus pruebas y
> desplegadas: **ninguna se podía abrir**. Es la forma de `[BAN-F4-FIX]`. **Y el fallo es
> silencioso**: la ruta sale en `route:list`, el controlador y la vista existen y las pruebas del
> módulo pasan — solo se nota pulsando el ítem del menú.
>
> En cxp y cxc el grupo del comodín se mueve **al final del archivo** (en cxc quedaban 4 grupos
> detrás: moverlos uno a uno solo aplaza el problema al siguiente que alguien agregue); en crm y
> compras la ruta estática sube por delante. Verificado que ningún módulo perdió rutas.
>
> **La guarda le pregunta al ROUTER, no parsea los archivos**: recorre todas las rutas estáticas y
> comprueba que cada una se resuelva a sí misma, así mide lo que Laravel va a ejecutar y cubre los
> módulos que se escriban mañana. Nombra la ruta, quién la enlaza y quién la intercepta.
>
> **Reglas nuevas: Laravel resuelve por ORDEN DE DECLARACIÓN, no por especificidad — una ruta
> estática declarada tras un comodín del mismo prefijo no se puede abrir · cuando quedan varios
> grupos estáticos detrás de un comodín, mover el COMODÍN al final resuelve también los que se
> agreguen después · una guarda sobre rutas le pregunta al router, no parsea los archivos.**

> **EL COMBO OFRECÍA EL PLAN DE CUENTAS DE OTRA EMPRESA (2026-08-31) — `[CONT-CTA-6]`**:
> reporte del director técnico — *«en `parametros-contables/modulo-facturacion` no está cargando
> las cuentas contables de la empresa activa»*. **3 pruebas nuevas, las 3 verificadas VIOLÁNDOLAS:
> las 3 se detectan** · Contabilidad **118 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN**
> (`0c574cdc`). **Sin migración.**
>
> ⚠️⚠️ **Los dos endpoints que alimentan ese modal resolvían la empresa con `->first()` sobre las
> activas del tenant**, ignorando por completo la empresa de la sesión. Es la misma forma de
> `[CONT-EMP-1]`. **Medido en producción**: la cuenta demo tiene 3 empresas con 48 cuentas cada una
> y devolvía **siempre «Distribuidora Mayoreo»**, incluso trabajando en «Constructora Demo».
>
> ⚠️ **Y no falla de forma visible**: el combo **sí trae cuentas**, solo que las de otra empresa —
> con planes distintos, el código guardado no existe en la empresa del documento y el asiento sale
> en `pendiente_configuracion` semanas después. Se resuelve con `empresa_activa()`: desde `[#833]`
> `cont_*.empresa_id` **es** `empresas.id`, sin lookup intermedio.
>
> ⚠️ **El anti-patrón de `[#1149]` seguía en 10 métodos del mismo archivo**: validaban con
> `abort_unless` y **dos líneas después redefinían `$company` con `currentCompany`**, que puede ser
> null y anula la validación. Eliminadas. **Los demás sitios del ecosistema ya acotaban por
> `empresa_id`** —`IntegracionContableService`, `ContabilidadEmpresaService`,
> `IntegracionContableConfigController`—: este era el último.
>
> **Verificado con datos reales: cero cuentas ajenas en las 6 empresas de los 4 suscriptores**
> (demo 48/48/48, Agua Yamel 40, Comercial Aranza 61). ⚠️ TAPIA sigue con **0 cuentas**, que es el
> pendiente ya declarado en `[CONT-CTA-2]`, no un efecto de este cambio.
>
> **Reglas nuevas: un combo de configuración contable ofrece lo de la empresa ACTIVA, y el síntoma
> de no hacerlo no es una lista vacía sino una lista llena de otra empresa · un `abort_unless` que
> valida `company()` no protege si dos líneas después se redefine con `currentCompany` · cuando un
> defecto reincide, la guarda mira el CÓDIGO además del comportamiento.**

> **LA CONSOLIDACIÓN NUNCA PUDO EJECUTARSE, Y NINGUNA LÍNEA DE COMPRAS SIN ARTÍCULO
> (2026-08-31) — `[CONT-CONS-1]`, `[COM-ART-1]`, `[AGENTES-2]`**: cinco pedidos del director
> técnico — *«cont_homologaciones_cuenta cómo se llena y cuándo la consultan?»* · *«cada empresa
> es independiente, no se mezcla nada entre ellas salvo al consolidar, verifica»* · *«en compras
> borra todo, que no quede nada huérfano en ningún módulo»* · *«que no llegue a recepción ni orden
> de compra ni facturas de compras documentos sin código de artículo»* · *«en la creación del
> usuario interno no aparece la opción de hacerlo Cobrador»*.
> Compras + Inventario **186 passed** · las 1285 vistas compilan · `demo:reset` idempotente.
> **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`fdabae39`). **Sin migración nueva** — se aplicaron
> las tres pendientes (`660001`, `670001`, `680001`).
>
> ⚠️⚠️ **Preguntar por una tabla destapó que TODO el módulo de consolidación estaba roto.**
> `cont_homologaciones_cuenta` **no la llena nadie** —no existe pantalla— y su único lector,
> `ConsolidacionService::ejecutar()`, **no podía correr**: consultaba **SIETE columnas que no
> existen** (`cuenta_origen_id` por `cuenta_empresa_origen_id`, débito/crédito por `monto_local`,
> `revertido_por` por `ejecutado_por`…). Misma familia de `[TENANT-A15]`, y pasa inadvertida por
> lo mismo: **sin datos con los que ejercitarla, la pantalla se ve bien.**
>
> ⚠️⚠️ **Y debajo había algo peor: todo el módulo quedó en el espacio de ids VIEJO tras `[#833]`.**
> `cont_grupos_consolidacion.empresa_controladora_id` y `cont_empresas_consolidadas.empresa_id`
> apuntan a **`cont_empresas.id`** —el UUID interno— mientras el mayor usa **`empresas.id`**.
> Aunque las columnas hubieran existido, el `whereHas` no habría encontrado **ni una línea** y la
> consolidación habría salido **en cero sin decir por qué**. Se traduce con un mapa cargado una
> vez. **Verificado EJECUTÁNDOLO**: 2 transacciones, activos 450 000,00, y la reversión las borra.
> ⚠️ **PENDIENTE declarado**: esa tabla sigue sin pantalla.
>
> **El aislamiento entre empresas, medido y no supuesto**: el artículo de la empresa 2 **no se ve**
> desde la 1, cada una tiene su catálogo (37/25/25), el **mismo código existe en las tres** como
> registros independientes, y **cero artículos o códigos de barra sin `empresa_id`** — que es lo que
> importa, porque el scope es LAXO con el NULL y una fila sin empresa se vería desde todas.
>
> ⚠️ **Cinco puntos de captura de Compras aceptaban líneas sin artículo** (requisición, OC, las tres
> rutas de recepción, factura de proveedor y factura por IA). **El síntoma no aparece al capturar**:
> el documento se ve normal, se aprueba y se paga. Aparece después, en tres sitios y sin poder
> atribuirse a nada — la liquidación no encuentra el stock que recostear, la línea no entra al
> Kardex, y la trazabilidad del costo por artículo no la ve. En producción son **261 de 286** líneas
> de recepción: el caso normal, no el raro. Ahora es `required` en los seis sitios, sabiendo que
> **rompe a los llamadores existentes** — **dos pruebas lo detectaron** y se corrigieron pasando un
> artículo real. ⚠️ **El servicio también es un artículo**: la requisición de licencias era la única
> línea sin código posible. **Medido: 15 líneas sin artículo → 0, cero huérfanos, volumen estable en
> 6/3/3/3 sin acumular.**
>
> **El usuario interno ya se puede hacer cobrador.** ⚠️ El sistema siempre lo permitió pero la
> pantalla no lo ofrecía — *una capacidad que el sistema permite y la pantalla no ofrece se lee como
> una capacidad que no existe*. ⚠️⚠️ **El vínculo es INVERSO al del vendedor**: el vendedor guarda su
> código en `users.vendedor_codigo`, el cobrador se apunta desde **su propia ficha**, así que el
> formulario actualiza el catálogo y hay que **liberar el registro anterior** al cambiar.
>
> ⚠️ **Un defecto propio, encontrado midiendo en producción tras el deploy**: la ficha demo nacía
> **tres veces, una por empresa, apuntando al mismo usuario** — justo lo que la pantalla impide.
> Corregido con dos tiempos: se acota a la empresa principal y la limpieza borra las anteriores.
>
> **En producción: app 200, 0 migraciones pendientes, las 4 tablas contables obsoletas eliminadas,
> Compras del demo 258 requisiciones acumuladas → 6, líneas del demo sin artículo 0.**
> ⚠️ **Agua Yamel —el único cliente real— NO usa Compras: impacto CERO.** Quedan 41 líneas
> históricas sin artículo, **todas de Comercial Aranza (34) y TAPIA (7), que son de prueba**: el
> `required` solo alcanza a las capturas nuevas.
>
> **Reglas nuevas: cuando un módulo entero se queda sin datos, su código puede llevar años sin poder
> ejecutarse — lo único que lo demuestra es EJECUTARLO · una línea de documento sin artículo no falla
> al capturarla, falla tres veces después y en módulos distintos · un servicio que se compra también
> es un artículo · una prueba que envía lo que la aplicación ya rechaza no protege nada · un helper
> heredado no puede reducir la visibilidad del método homónimo de una subclase: la suite no falla, no
> arranca · cuando el vínculo vive en la tabla del OTRO lado, el formulario actualiza el catálogo y
> hay que liberar el registro anterior · un seeder que corre una vez por empresa crea una fila por
> empresa.**

> **EL USUARIO DEL SISTEMA PASA A OBLIGATORIO EN VENDEDORES Y COBRADORES (2026-08-30) —
> `[AGENTES-1]`**: decisión del director técnico — *«que cada usuario asigne sus vendedores y
> cobradores, sino hay asignados en los procesos donde se requieran debe indicar que primero
> debe crearlo y asociarle el usuario del sistema… que el combo de empleado de nómina sea
> opcional pero que se pueda asociar a nómina para pagar las comisiones»*. **9 pruebas en las
> dos guardas** · CRM + vendedores + cobradores + comisiones + Prestamello **497 passed** ·
> las 1285 vistas compilan. **DESPLEGADO Y VERIFICADO** (`3af67b63`). **Sin migración.**
>
> ⚠️ **Invierte lo decidido en `[CRM-VEND-1]`**, donde dejé el usuario opcional en vendedores
> por el comisionista externo. La regla del negocio es otra: los usuarios no ven leads, los
> ven los vendedores.
>
> **Usuario obligatorio** en `store()` **y** `update()`, con mensaje propio que dice **por
> qué** hace falta —el genérico de Laravel no explica nada— y `paraCombo()` deja de ofrecer
> las fichas sin usuario. ⚠️ **Las históricas NO se borran**: siguen en la base y editarlas
> exige completarlas, que es la corrección guiada que se buscaba. Sigue siendo posible que la
> misma persona sea vendedor Y cobrador.
>
> **Empleado de nómina opcional, y ahora la pantalla dice qué se pierde**: el texto anterior
> contaba lo secundario («se crean los conceptos») y callaba lo que importa —
> `ComisionNominaService::enviarANomina()` **retorna temprano si no hay `empleado_id`**, así
> que sin él **la comisión se calcula y se liquida pero NO llega a la nómina**.
>
> ⚠️ **El aviso `<x-catalogo-agentes-vacio>` dice las DOS cosas** —crear la ficha Y asociarle
> el usuario— porque no basta con que el catálogo esté vacío: una ficha sin usuario tampoco se
> ofrece, y decirle «no hay vendedores» a quien tiene cuatro registrados lo manda a buscar un
> problema que no existe. En las 5 pantallas que lo necesitan, con el enlace **dentro** de la
> pantalla y protegido. El aviso a mano de Prestamello se sustituye por el componente.
>
> **El demo tenía que cumplir la regla que el sistema exige**: sus 9 agentes pasan a tener
> usuario propio (creado con el email que la ficha ya traía), o quien explorara la cuenta
> vería el aviso en vez del módulo funcionando.
>
> ⚠️ **Un defecto propio que atrapó `VistasCompilanTest`**: al sustituir el aviso de
> Prestamello, mi corte dejó un `@endif` huérfano. Lo señaló con su archivo y su línea.
>
> **En producción: Agua Yamel no tiene ni vendedores ni cobradores; Comercial Aranza verá el
> aviso hasta que asigne usuario a sus 8 fichas; las demo se corrigen solas a las 3:00.**
>
> **Reglas nuevas: un campo obligatorio nuevo se valida en store Y en update, y su mensaje
> dice POR QUÉ hace falta · un texto de ayuda cuenta lo que se PIERDE sin el dato, no lo que
> se crea con él · un aviso de catálogo vacío distingue «no hay ninguno» de «los que hay no
> sirven todavía» · un seeder de demo tiene que cumplir las reglas que el sistema exige, o la
> demo enseña los avisos en vez del módulo.**

> **`vendedor_id` SIGNIFICABA DOS COSAS DISTINTAS SEGÚN LA TABLA (2026-08-30) —
> `[CRM-VEND-1]`**: pedido del director técnico tras `[PRE-COB-1]` — *«vendedores revísalo
> también»* y, al ver la medición, *«debe ser del catálogo no a un usuario, los usuarios no
> ven leads, son los vendedores que también pueden ser cobradores»*. **5 pruebas nuevas, 3
> verificadas VIOLÁNDOLAS: las 3 se detectan** · CRM + vendedores + cobradores **25 passed**
> · Facturación + las 1285 vistas **73 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN**
> (`32519456`). ⚠️ Migración `2026_08_29_640001`.
>
> ⚠️⚠️ **La misma columna, con el mismo nombre, apuntaba a dos tablas distintas**:
> `char(36)` → `vendedores.id` en Facturación (clientes, facturas, pedidos, cotizaciones,
> metas, zonas) y **`bigint` → `users.id`** en CRM (`crm_leads`, `crm_contactos`). Un JOIN
> escrito asumiendo consistencia devuelve vacío. Es peor que el caso de cobradores, donde al
> menos el nombre de la columna era el único indicio equivocado.
>
> **Y en CRM había un campo duplicado y otro muerto**, medido: `asignado_a` y `vendedor_id`
> poblados **32/32 con cero diferencias** —el mismo dato dos veces— y `vendedor_codigo` en
> **0 de 33**. ⚠️ `CrmPresupuestoController` traía el comentario *«Usuarios activos de la
> company (reemplaza vendedores de facturación)»*: esa sustitución dejaba la **meta**
> midiéndose por `user_id` mientras la **venta** se agrupaba por vendedor, así que el
> cumplimiento salía en **0 % para todos** sin que nada lo dijera.
>
> ⚠️ **`asignado_a` NO se fusiona**, y lo que lo impidió fue el lead 33: los 32 primeros eran
> idénticos, pero el productivo de Comercial Aranza tiene `vendedor_id=192` y
> `asignado_a=237` — **personas distintas**. Además `asignado_a` es la **guarda de acceso**
> (`$lead->asignado_a !== auth()->id()` impide abrir el lead de otro).
>
> ⚠️⚠️ **No hay backfill automático, y es deliberado.** Mapear por email **parece** posible
> —da 3 coincidencias— pero es un falso positivo: **los cuatro vendedores de Comercial Aranza
> comparten el email de la usuaria que los registró**, así que daría tres candidatos
> empatados y asignaría la venta al vendedor equivocado. *Una asignación falsa es peor que
> ninguna: nadie la revisa porque el campo se ve lleno.* Lo no resuelto se vuelca a
> `storage/app/private/crm-vendedor-map/` antes de tocar la columna, y **`asignado_a` queda
> intacto (33/33)**: no se pierde quién atendía cada lead.
>
> **Diferencia deliberada con cobradores**: un cobrador sin usuario **no** se ofrece (la app
> móvil resuelve su cartera con `auth()->id()`), pero un vendedor sin usuario **sí** — un
> comisionista externo es dueño de la venta para metas y comisiones aunque no entre al
> sistema; lo único que no puede es ver sus leads. ⚠️ **Y una misma persona puede tener ficha
> de vendedor Y de cobrador con el mismo `user_id`**: son dos roles del mismo empleado, con
> prueba que lo verifica.
>
> ⚠️ **Un defecto propio, encontrado midiendo y no leyendo**: tras el primer `demo:reset` el
> conteo decía «14 de 14 con vendedor» mientras la pantalla mostraba «sin asignar» — el
> seeder seguía guardando `$adminUser->id` porque mi script de edición **abortó en un assert
> antes de escribir**. Lo delató comparar el id guardado contra los ids reales del catálogo.
>
> **En producción: 4/4 tipos convertidos, `asignado_a` conservado 33/33, volcado de respaldo
> generado, 33 leads a reasignar** — 32 demo (se regeneran cada madrugada) y 1 de Comercial
> Aranza, que es empresa de prueba. **Agua Yamel no usa CRM: 0 leads, 0 contactos.**
>
> **Reglas nuevas: la misma columna con el mismo nombre no puede apuntar a dos tablas
> distintas según el módulo · dos campos poblados al 100 % con cero diferencias son el mismo
> dato guardado dos veces, pero antes de fusionarlos hay que buscar el caso donde SÍ difieren
> · un mapeo por email que da varias coincidencias no es un mapeo, es un empate · una meta y
> su cumplimiento se agrupan por la misma clave o el reporte sale en cero sin decir por qué ·
> un comentario que dice «reemplaza X» es el rastro de una sustitución que hay que revisar ·
> un script de edición que aborta en un assert no escribió nada.**

> **EL COBRADOR DE PRESTAMELLO ERAN LOS 40 USUARIOS DEL TENANT (2026-08-29) —
> `[PRE-COB-1]`**: pedido del director técnico — *«facturación también tiene cobradores y
> vendedores, ¿por qué no usamos la misma tabla? debería ser cobradores una única tabla con
> acceso»*. **3 pruebas nuevas, las 3 verificadas VIOLÁNDOLAS: las 3 se detectan** ·
> Prestamello **454 passed** · cobradores + comisiones **69 passed** · las 1285 vistas
> compilan. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`a68bd05f`). ⚠️ Migración
> `2026_08_29_630002`.
>
> **`cobradores` YA era la tabla única** —del core, sin prefijo, como `clientes` o
> `proveedores`— y Facturación y CxC ya la compartían. **Prestamello nunca la consultó**:
> resolvía la lista con `User::where('company_id')`, o sea todos los usuarios de la empresa.
> En el combo «Cobrador» aparecían el contador, la secretaria y el gerente. ⚠️ **Y el reporte
> de comisiones llamaba al servicio de cálculo UNA VEZ POR USUARIO** para mostrar decenas de
> filas en 0.00. ⚠️⚠️ **Alguien ya lo había notado**: `PreReporteController` tiene escrito
> *«ofrecer los 40 usuarios del tenant haría que el gerente busque entre nombres que no
> devuelven ninguna fila»* — pero eso parcheó **los reportes**; el combo donde se ASIGNA siguió
> igual.
>
> ⚠️ **La migración `600009` de la sesión anterior partía de una premisa falsa y se revierte**:
> convirtió `cobrador_id` a CHAR(36) mirando el NOMBRE de la columna y no a sus CONSUMIDORES —
> siete controladores validan `exists:users,id` y la **app móvil** resuelve la cartera con
> `auth()->id()`. El BIGINT era correcto. **Su guarda («si ya tiene datos, no se toca») es lo
> que salvó las filas**: solo alcanzó `pre_metas_cobrador`, con 0 filas.
>
> **La pieza que une catálogo y operación ya existía**: `cobradores.user_id` estaba en el
> esquema y nadie la llenaba **porque el formulario no la pedía** (`[CW-FIX-2]`: una columna
> sin formulario es una función que no existe). Ahora está en el CRUD, **excluyendo a quien ya
> es otro cobrador** —dos con el mismo `user_id` sumarían sus comisiones sobre la misma
> persona—. ⚠️ **Un cobrador sin usuario no se ofrece**: sirve en Facturación/CxC pero no puede
> salir a la ruta con la PWA. ⚠️ **Y se conserva el cobrador que la operación YA tiene** aunque
> no esté en el catálogo, marcado «(fuera del catálogo)»: sin eso, editar esa operación
> **borraría su cobrador en silencio**.
>
> ⚠️ **El enlace al catálogo va dentro de la pantalla, no en el sidebar** — declarar la ruta de
> otro módulo en el menú hace que ese módulo deje de abrirse (**tercera vez**: `[CND-FIX]`,
> `[CW-F0-5]`, `[REST-F0-4]`).
>
> **Impacto medido antes de desplegar: CERO.** Agua Yamel —el único cliente real— no tiene
> cobradores ni usa Prestamello; Comercial Aranza tiene 4 sin usuario (verán el aviso); las 2
> operaciones de TAPIA siguen resolviendo a `kelobel`.
>
> ⚠️⚠️ **HALLAZGO FUERA DE ALCANCE: `vendedor_id` significa cosas distintas según la tabla.**
> Es **char(36) → `vendedores.id`** en Facturación (clientes, facturas, pedidos, cotizaciones,
> metas, zonas) y **bigint → `users.id`** en CRM (`crm_leads`, `crm_contactos`). La misma
> columna, dos tipos y dos destinos: un JOIN escrito asumiendo consistencia devuelve vacío. Y
> medido: `crm_leads.asignado_a` y `crm_leads.vendedor_id` están poblados **32/32 con cero
> diferencias** —el mismo dato guardado dos veces— mientras `vendedor_codigo` está en **0 de
> 32**: la integración del catálogo de `[#642]` se escribió y nunca se llenó. **NO se corrigió
> porque la decisión es de negocio**: en cobradores el rol es inequívoco, pero un lead puede
> asignarse a un gerente que no es vendedor formal. Hay que decidirlo antes de tocar 15
> referencias y migrar 32 leads.
>
> **Reglas nuevas: un catálogo del core lo consumen TODOS los módulos que hablan de esa
> entidad, no solo el que tiene el CRUD · un tipo de columna se verifica contra sus
> CONSUMIDORES antes de cambiarlo, igual que un ENUM · una lista que ofrece todos los usuarios
> del tenant no es un combo, es un buscador sin filtro · un parche que arregla solo el reporte
> deja intacto el sitio donde se captura el dato · una lista filtrada conserva el valor que el
> registro YA tiene, o editarlo lo borra en silencio · la misma columna con el mismo nombre no
> puede apuntar a dos tablas distintas según el módulo.**


> **EL ASIENTO NACÍA EN LA EMPRESA EQUIVOCADA, Y EL PERÍODO VUELVE A NÓMINA (2026-08-30) —
> `[CONT-EMP-1]`, `[DEMO-3]`**: tres pedidos del director técnico — *«los asientos en el demoseeder…
> mayorizar la mitad y la otra mitad para que quede por mayorizar… revisa que en vendedores y
> cobradores el mismo usuario puede tener las 2 características, corrige… nada de nómina debe
> hacerse desde psa, solo cargar datos o actualizar tablas, pero el período debe vivir en nómina»*.
> **9 pruebas nuevas, 8 reglas verificadas VIOLÁNDOLAS: las 8 se detectan** · Contabilidad + Nómina
> + PSA + demo **226 passed** · vistas y ayuda **18 passed**.
> **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`f3205fbb`). **Sin migración.**
>
> ⚠️⚠️ **Revisando por qué los asientos del demo estaban mal repartidos apareció un defecto de
> producción**: las tres empresas demo tienen 13 activos fijos y 6 depreciaciones **cada una**, pero
> los **18 asientos caían todos en una sola**. `IntegracionContableService` resolvía la empresa
> contable con **`->first()` sobre las activas de la company**, ignorando a qué empresa pertenecía
> el movimiento — así que un suscriptor con varias empresas manda **todos** sus asientos a una, la
> que MySQL devuelva primero, y **ni siquiera de forma estable: en local cayeron en una empresa y en
> producción en otra**. Las demás se quedan con el mayor vacío, y un mayor vacío sale 0.00 en
> Balance, Estado de Resultados y Balanza: el síntoma se lee como un dato.
>
> ⚠️ **El buffer YA guardaba `empresa_id` y el evento YA lo traía**: el dato llegaba hasta la puerta
> del servicio y ahí se descartaba. ⚠️ **Sin la empresa correcta NO se cae a «la primera que haya»**
> —eso reintroduce el defecto en silencio y el asiento aparece en la contabilidad de otra empresa—:
> el buffer queda en `error` y el Monitor lo nombra.
>
> ⚠️⚠️ **Y había dos defectos más de la misma familia debajo.** El servicio recibe la empresa por
> parámetro pero resolvía período, tipo, cuentas y config con modelos que usan `HasEmpresa`, cuyo
> scope filtra por la empresa de la **SESIÓN** —con el usuario en la empresa A, un asiento de la B
> fallaba con «no hay período contable», y **en CLI funcionaba por casualidad** porque ahí el scope
> se desactiva—; y **la relación `SecuenciaAsiento::tipoAsiento()` también lo heredaba**, reventando
> con «Attempt to read property "codigo" on null», un mensaje que no apunta a la causa. Es la regla
> de `[REST-FIX-2]` en tres niveles: *un service que recibe el tenant por parámetro no lee la
> sesión, y sus relaciones tampoco.*
>
> **Impacto medido ANTES de tocar**: solo la cuenta demo es multi-empresa. TAPIA, Comercial Aranza y
> Agua Yamel tienen **una empresa cada uno** → ningún cliente afectado hoy, pero el día que
> cualquiera cree su segunda, todos sus asientos irían a una sola. Tras el fix: **6/6/6 y cero
> discrepancias**.
>
> **El período vuelve a Nómina**: ⚠️ el código de aplicación **YA cumplía la regla** —`psa_periodos`
> es una **VISTA** de solo lectura y su controlador solo tiene `index`/`show`—, **el seeder era el
> único que la rompía**, y no en un sitio sino en **TRES** (el base y las fases 2 y 3), cada uno con
> su propio tipo de nómina y sus propios uuid v4: tres definiciones del mismo eje de tiempo que nadie
> podía cuadrar. De esa inversión salió `[NOM-DEMO-1]` —*quien crea el período se siente con derecho
> a borrarlo*—. Ahora el calendario vive en `NominaSeeder::calendarioPsa()` (16 quincenas) y PSA solo
> lo **lee**, con **ids UUID v5 deterministas** para poder encontrarlo; ⚠️ **si falta NO se fabrica
> uno**, se nombra y se omiten los datos que dependen de él.
>
> **La mayorización queda a medias**: postear todos los aprobados dejaba **cero** en `APROBADO`, que
> es justo el estado con el que trabaja la pantalla de Mayorización — quedaban solo borradores, que
> aún no se pueden postear. Ahora se mayoriza la mitad (hacia arriba) y el resto espera el botón, con
> orden **total** para que dos corridas no elijan asientos distintos.
>
> **El doble rol**: ⚠️ **el sistema siempre lo permitió** —la unicidad de cada CRUD mira solo su
> propia tabla—, pero **el demo no lo mostraba** y por eso parecía que no se podía. Ana López pasa a
> ser vendedora V002 **y** cobradora C002 con el mismo usuario: **no hizo falta cambiar código, solo
> un caso a la vista.**
>
> **Verificado en producción tras el reset**: mayorización **2 posteados + 1 aprobado + 8 borrador**
> en las tres demo · doble rol presente · **16 períodos QUINCENAL-PSA** por empresa creados por
> Nómina · **0 huérfanos** · asientos de Activos Fijos **6/6/6** · **0 movimientos con asiento en
> otra empresa**. **Comercial Aranza intacta** (28 asientos, 7 resultados) y **Agua Yamel y TAPIA sin
> tocar**. ⚠️ **PENDIENTE sin cambios**: los asientos de producción siguen sin mayorizar — el botón
> funciona, postear es decisión contable.
>
> **Reglas nuevas: un asiento pertenece a la empresa DEL MOVIMIENTO, no a «la primera activa del
> tenant» — y un `->first()` sin orden ni siquiera elige lo mismo en dos servidores · un service que
> recibe la empresa por parámetro no puede resolver sus datos con modelos que leen la sesión, y sus
> RELACIONES tampoco · cuando falta la empresa correcta no se cae a otra: mejor sin asiento que en la
> contabilidad ajena · el dueño de una entidad es quien la crea, y quien la crea se siente con
> derecho a borrarla · un id que debe encontrarse desde otro seeder es determinista (UUID v5), no
> aleatorio · un demo que postea todo lo pendiente deja su propia pantalla sin nada que hacer · una
> capacidad que el sistema permite pero el demo no muestra se lee como una capacidad que no existe.**

> **EL COLUMNAR DE NÓMINA, Y LOS RECIBOS QUE NUNCA SE CREARON (2026-08-30) — `[NOM-DEMO-1]`,
> `[NOM-COL-1]`**: pedido del director técnico — *«tengo nóminas demo calculadas pero en recibo no
> veo los recibos… necesito un reporte de resumen de pagos por conceptos como un columnar de
> nómina, agrupados por departamento… cada columna de cada concepto de asignación… total de
> asignaciones, luego las deducciones, total de deducciones, y el neto; en otra hoja un resumen por
> departamento; luego otra página con las variaciones contra el período anterior»*.
> **10 pruebas nuevas, 6 reglas verificadas VIOLÁNDOLAS: las 6 se detectan** · Nómina + guardas de
> vistas y ayuda **120 passed** · las 1285 vistas compilan.
> **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`67d0e861`). **Sin migración.**
>
> ⚠️⚠️ **Los recibos no faltaban por falta de datos: 90 resultados de nómina colgaban de períodos
> borrados.** Los crea solo `VolantePdfService::crearRecibos()` y ningún seeder lo llamaba —pero al
> medirlo apareció lo grave: **`PsaDemoSeeder` borraba TODOS los períodos de la empresa** antes de
> sembrar los suyos, incluidos los **semanales que `NominaSeeder` acababa de crear unas líneas
> antes en el mismo `DemoSeeder`**. Como `nom_payroll_results` no cuelga de una FK con cascada, sus
> resultados quedaban **huérfanos en el acto**: 90 filas sin período, **creciendo ~18 por reset**, y
> la pantalla las seguía contando como nómina calculada. Es la forma de `[TENANT-A16]`: *un seeder
> no borra el trabajo de otro.* ⚠️ **Y el tipo de nómina se buscaba por frecuencia** («el primer
> biweekly de la empresa»), así que PSA adoptaba la quincena de Nómina — la misma raíz del borrado;
> ahora se busca por CÓDIGO. ⚠️ El fix tiene **dos tiempos** (`[TENANT-A11]`): uno impide crear
> nuevos y el otro borra por `company_id` directo en vez de por una subconsulta de períodos, que
> **no alcanzaba a los ya huérfanos** y los hacía inmunes para siempre.
>
> **El columnar**: tres hojas sobre **UNA sola matriz**. Si cada hoja armara su consulta, el total
> del resumen podría no cuadrar con la suma del detalle, y esa discusión no se gana explicando la
> fórmula. ⚠️ **Las columnas salen de los conceptos que APARECEN en el período, no del catálogo**:
> uno configurado que nadie cobró solo agregaría una columna de ceros; y **el que un empleado no
> recibió sale en 0, no ausente**, o su fila no se podría comparar con la de al lado. ⚠️ **El
> salario base se DERIVA** (bruto − asignaciones), así cuadra por construcción, y **el cuadre se
> pinta SIEMPRE al pie** —uno que solo aparece al fallar no permite comprobar que el período cerró
> bien—. ⚠️ **Los importes salen del JSON sellado al calcular, NO del catálogo de conceptos**: el
> catálogo dice lo que PUEDE pagarse hoy y el resultado lo que SE PAGÓ — recalcular haría que
> reimprimir una quincena vieja diera cifras distintas al recibo que el empleado ya tiene en la mano.
>
> **Variaciones**: el período anterior se resuelve **por FECHA y no por `period_number`**, que se
> reinicia cada año — por número enfrentaría enero contra diciembre del siguiente. Las dos matrices
> se leen con **las MISMAS columnas**: con las suyas, un concepto que solo está en uno saldría como
> si hubiera nacido de la nada. ⚠️ **Un porcentaje sobre cero es `null`, no 100 %** (el importe
> absoluto sí se muestra) · **un departamento nuevo no tiene variación 0 %**, porque eso afirmaría
> que se mantuvo igual · **y el que desaparece se muestra como BAJA**, no se omite: escondería una
> baja completa de plantilla.
>
> ⚠️⚠️ **El verificador informó «ninguna se detecta» y era MENTIRA**: no fallaban las pruebas,
> **reventaba el verificador** al imprimir la salida de PHPUnit (encoding de la consola de Windows),
> así que el conteo de fallos quedaba en cero. Es la trampa de `[REST-F2]` por una puerta nueva —
> reescrito para decidir por el **código de salida** y comprobar antes que la línea base esté verde
> **y ejecute pruebas de verdad** (`artisan test` sale 0 también cuando no encuentra ninguna).
> Repetido: las 6 se detectan. ⚠️ Y `nom_payroll_results` exige `effective_rate`, `total_hours` y
> `breakdown` **NOT NULL sin default**: comprobado con `SHOW COLUMNS` antes de insertar.
>
> **Medido en producción**: huérfanos **6 → 0** · recibos **0 → 24** · empresas demo con nómina
> **0 → 3 de 3**. ⚠️ **Los 6 huérfanos eran de la cuenta demo** (creados a las 03:00:05 de hoy por
> el reset con el código viejo), no de un cliente: se limpiaron solos al ejecutar `demo:reset` con
> el fix. **Comercial Aranza** —la única con nómina real— queda intacta y su columnar cuadra exacto
> (207 500.00 − 12 263.25 = 195 236.75, total == suma de subtotales). **Agua Yamel, el único cliente
> real, no tiene nómina calculada**: no se tocó nada suyo.
>
> **Reglas nuevas: un seeder no borra el trabajo de otro, y sin FK en cascada el hijo queda huérfano
> en el acto · una limpieza por subconsulta no alcanza lo que ya perdió su padre — el fix tiene dos
> tiempos · las columnas de un reporte salen de lo que APARECE, no del catálogo · un concepto que un
> empleado no recibió sale en 0, no ausente · los importes de un período salen del JSON sellado al
> calcular · el período anterior se resuelve por FECHA, no por número · dos períodos que se comparan
> se leen con la MISMA cabecera · un porcentaje sobre cero es null y el importe absoluto sí se
> muestra · un departamento nuevo no tiene variación 0 % y el que desaparece se NOMBRA · un
> verificador que revienta imprimiendo informa lo mismo que uno que no corre.**

> **LA MAYORIZACIÓN LLEVABA ROTA DESDE SIEMPRE, Y DATOS DEMO PARA 4 MÓDULOS (2026-08-28/29) —
> `[TENANT-A14]`–`[TENANT-A16]` + `[REST-FIX-2]`**: pedido del director técnico — *«debes corregir
> el demo reset, crear nuevos seeders para cargar todos los módulos nuevos con datos de demo, así
> corregir todos los errores… De esta manera nos sirve de test con todas las tablas poblándolas con
> información de demo»*. **REGRESIÓN COMPLETA VERDE: 2989 passed, 4 skipped (26 423 aserciones)** ·
> Restaurante 642 passed. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`0199d2c7`). ⚠️ Migraciones
> `2026_08_28_600009`, `610001`, `620001`.
>
> ⚠️⚠️ **Buscando por qué el mayor salía vacío en el demo apareció que no era un hueco de datos:
> era código de producción que NUNCA pudo correr.** Las tablas, los modelos y sus relaciones usan
> `periodo_id`; **cinco servicios consultaban `periodo_contable_id`**, que no existe en ninguna —
> `SaldoService` (5 usos), `AjusteInflacionService` (3), `ConsolidacionService` (2),
> `DifCambiariaService` (4) y `DiferidoService` (2). ⚠️ **Los otros llamadores del mismo servicio SÍ
> usaban `periodo_id`** (`AlquilerService`, `ProvisionService`, `generarDesdeRecurrente`,
> `AsientoDiarioController`): había una convención y cinco servicios se desviaron. Y **falla en
> silencio**: el controlador atrapa la excepción y muestra «N con error (ver log)».
>
> ⚠️ **`SaldoService` es el que llama `postearAsiento()`, así que la MAYORIZACIÓN COMPLETA estaba
> rota** — ningún asiento podía llegar al mayor desde ninguna pantalla ni módulo. **De ahí sale el
> pendiente que `[CONT-CTA-5]` anotó en producción**: 61 asientos de diario y cero en el mayor. No
> era que nadie hubiera mayorizado, **es que no se podía**; y con el mayor vacío el Balance General,
> el Estado de Resultados, la Balanza y la ficha de cada cuenta salen en **0.00 para todos los
> clientes**. Verificado en producción con una prueba **en seco** (postear en transacción +
> rollback): crea el mayor con sus líneas, actualiza los saldos y la base queda idéntica.
>
> ⚠️ **Un asiento del demo no cuadraba**: «Cierre nómina semana» tenía 47 901.00 de débito contra
> 45 901.00 de crédito porque **faltaban las retenciones AL EMPLEADO**. Ahora se DERIVAN de las
> tasas de ley RD (Ley 87-01), las mismas de `NominaContribService`, y cuadra en 48 379.80. ⚠️ **La
> retención del empleado NO se acumula en las cuentas «Empleador por Pagar»** —el nombre de una
> cuenta tiene que decir lo que contiene—: cuentas nuevas 2107 y 2108.
>
> ⚠️ **El seeder de mayorización usa el proceso REAL** (`AsientoService::postearAsiento()`), no
> inserts: con inserts propios habría dos formas de llegar al mayor y la segunda produciría un mayor
> que los reportes no saben leer. Solo mayoriza los APROBADOS y **deja los 24 borrador**, porque la
> pantalla de Mayorización existe para postear lo pendiente y si el seeder posteara todo nacería
> vacía. Y **se salta el asiento que no cuadra NOMBRÁNDOLO**: postear un descuadre deja el Balance
> descuadrado y eso aparece semanas después sin poder atribuirse a nada.
>
> **Datos demo**: Prestamello (núcleo vacío: cero operaciones, cuotas y pagos), Caja POS (sus cuatro
> tablas en cero) e Inventario (**39 de 49 tablas vacías** → 27: motivos de ajuste, clasificaciones,
> ubicaciones, conversiones de unidad, criterios de reorden, seriales, traslados y conteo físico).
> ⚠️ **Los procesos que MUEVEN STOCK usan su servicio real**: marcar un traslado «recibido» a mano
> dejaría el documento diciendo que la mercancía llegó y el stock diciendo que sigue en origen.
> Verificado: cero filas de stock en negativo. ⚠️ **Y el conteo físico es el que más importa**: sin
> toma física aplicada la variancia sale 0 POR CONSTRUCCIÓN y esa tabla de ceros se lee como «todo
> cuadra» (`[REST-F4-4]`).
>
> ⚠️ **Defecto de esquema**: `cobrador_id` era **BIGINT** en tres tablas de Prestamello y
> `cobradores.id` es **CHAR(36)** — asignar un cobrador era imposible. Migración con **guarda que
> aborta si la columna ya tiene datos**, y en producción eso salvó a TAPIA (ver pendientes).
>
> ⚠️ **Tres defectos más que solo se ven ejecutando**: (1) **ningún traslado se podía aplicar fuera
> de una petición web** (`auth()->id()` sobre una columna NOT NULL); (2) **el `demo:reset` no
> limpiaba el mayor** —lo destapó arreglarlo: cada reset dejaba 9 mayores huérfanos, misma forma de
> `[TENANT-A11]`—; y (3) **tres seeders peleando por `psa_planillas`**: las fases 2 y 3 de PSA
> **abortaban enteras** perdiendo ponches, timesheets y recibos, y la fase 3 **borraba las planillas
> de los otros seeders**. ⚠️ El arreglo no es `insertOrIgnore` —la planilla se saltaría en silencio
> pero sus hijos se insertarían igual, colgando de nada—: se descarta el **PERÍODO completo**.
>
> **Medido: tablas vacías del suscriptor demo 334 → 301 · filas demo 6 938 → 30 217 · `demo:reset`
> sin un solo error** (antes: 634 filas sin tenant por reset y dos seeders abortando).
>
> ⚠️ **PENDIENTES del director técnico**: (1) los **61 asientos de producción siguen sin
> mayorizar** — el fix habilita el botón, postear es decisión contable; (2) **en TAPIA
> `pre_operaciones.cobrador_id` guarda un `users.id`** (191) y TAPIA no tiene cobradores: hay que
> decidir qué significa ese campo antes de convertir la columna; (3) **el cron
> `contabilidad:cuadre-auxiliares` falla todos los lunes** porque `cont_modulos` está **vacía en
> producción** y su FK no resuelve.
>
> **Reglas nuevas: un servicio que consulta una columna inexistente falla en silencio si su llamador
> atrapa la excepción, y el síntoma es un reporte en cero que se lee como un dato · cuando la mitad
> de los llamadores usa una clave y la otra mitad otra, la TABLA decide · un asiento que no cuadra
> no se mayoriza, se nombra · un seeder que llena una tabla usa el proceso real que la llena · el
> nombre de una cuenta contable tiene que decir lo que contiene · un service que lee `auth()` para
> una columna NOT NULL no se puede usar fuera de una petición web · arreglar un proceso roto puede
> destapar que la limpieza nunca lo contempló · cuando varios seeders escriben la misma tabla con
> UNIQUE se descarta la CLAVE completa, no la fila al insertar · un seeder no borra el trabajo de
> otro · dos suites en paralelo contra la misma base sin `RefreshDatabase` se contaminan: un rojo se
> confirma corriendo la suite SOLA.**


> **ABASTECIMIENTO FASE 3 — CLASIFICACIÓN ABC Y COBERTURA (2026-08-27) — `[ABST-F3]`,
> `[ABST-F3-4]`, `[ABST-AYUDA-1]`**: tercera fase del módulo de mejora `abastecimiento` (el `04`
> de `Modulos_Adicionales`, que vive DENTRO de Inventario). Contesta *en qué artículos está el
> dinero que rota* y *para cuántos días alcanza lo que hay*. **32 pruebas** (28 que estaban en el
> árbol + 4 nuevas) · **Abastecimiento + Inventario + guardas de ayuda y vistas: 154 passed,
> 4 174 aserciones** · **4 reglas nuevas verificadas VIOLÁNDOLAS: las 4 se detectan** · las
> **1 285 vistas** del repositorio compilan. ⚠️ Migración `2026_08_26_610001`.
>
> ⚠️ **La regla ABC no se reimplementa: se DELEGA** en `ConteoCiclicoService::claseParaAcumulado()`,
> de donde ya salían el reporte ABC-XYZ de Inventario y el plan de conteo cíclico. Con una copia, el
> mismo artículo podía ser clase A en una pantalla y B en la otra, y el plan de conteo —que decide
> cada cuántos días se cuenta un artículo POR SU CLASE— habría usado una frecuencia que la otra
> pantalla contradice. ⚠️ **Y los umbrales nacen en 70/20, NO en el 80/15 del blueprint**: el
> ecosistema ya clasificaba a 70/90, así que con 80/15 contratar el módulo habría movido de clase
> artículos que nadie tocó (*el default de una opción nueva reproduce lo vigente*). ⚠️ **La clase C
> se DERIVA** (100 − A − B): con tres umbrales capturados podrían sumar 97 o 104 y habría artículos
> sin clase o en dos a la vez.
>
> ⚠️ **El defecto de la fase: los importes no decían en qué MONEDA estaban.** «Valor de consumo» y
> «Costo unitario» salen del costo promedio **funcional**, y ni la pantalla, ni el resumen, ni el
> CSV lo declaraban — en un tenant multimoneda cada usuario los interpretaba en la suya, y con ese
> número se decide si un artículo se compra. Corregido en los tres sitios; **la F2 sí lo hacía
> bien** en el costo de pedido, el defecto era de esta fase. ⚠️ Al corregirlo, el ISO iba a quedar
> resuelto en **dos** sitios (el método nació privado en el controlador de configuración): se sube a
> `AbstConfig::isoFuncional()` y **se borra la copia**, con una prueba que recorre los 8 archivos
> del módulo. ⚠️ **Sin moneda resoluble devuelve vacío, no `DOP`**: un default de país afirmaría una
> divisa que nadie configuró, y eso es peor que no decir nada porque no hay forma de notarlo.
>
> ⚠️⚠️ **Una forma de vista rota que el ecosistema no tenía escrita**: `<th>Valor consumo@if(...)`
> **no compila la directiva** —Blade exige `\B` antes de la arroba y una letra rompe esa
> condición— **pero su `@endif` sí**, así que queda un `endif` huérfano y el error apunta a una
> línea del COMPILADO que no existe en el fuente. La línea de al lado (`Costo unit.@if`) funcionaba
> **por casualidad**, porque el punto no es letra. Lo detectó **compilar** las vistas, no un grep:
> es justo el motivo por el que la guarda de `[VISTAS-SOT]` compila en vez de buscar patrones.
>
> ⚠️ **Mi propia prueba nueva miraba el COMENTARIO y no el código**: contaba la mención del service
> de monedas dentro del docblock y acusaba de una copia inexistente (el defecto de `[REST-F0]`).
> Lo encontró **correr** la prueba, no escribirla.
>
> **La ayuda de las 4 pantallas del módulo** (deuda que arrastraban F1, F2 y F3: no tenían ni una
> línea) queda documentada con sus 20 campos ⚠️ **en `resources/help/inventario.php`, no en un
> archivo propio**: el módulo no está en el sidebar, así que un `abastecimiento.php` nacería
> huérfano y el Centro de Ayuda no lo mostraría. Los tooltips **leen el catálogo, no repiten el
> texto**.
>
> ⚠️ **PENDIENTE del director técnico**: los umbrales son configurables, pero el reporte ABC-XYZ de
> Inventario y el plan de conteo cíclico siguen fijos en 70/90 — al cambiarlos, el mismo artículo
> puede salir en clases distintas según la pantalla. La pantalla lo AVISA; unificarlo obligaría a
> que Inventario dependa de un módulo de mejora, y eso es decisión de alcance.
>
> ⚠️⚠️ **ENTORNO — la regresión COMPLETA no se pudo correr, y hay dos trampas nuevas**: (1)
> `phpunit.xml` declara `DB_PASSWORD=""` y el **MySQL local ya pide contraseña**, así que la suite
> falla con `1045 Access denied` — que parece un desastre y es solo la contraseña; es la misma
> trampa que `[BAN-F3-FIX]` cerró para el PUERTO y **la causa real de que `[CRON-FIX-1]` anotara que
> «el MySQL local dejó de aceptar conexiones»**. Se corre con `DB_PASSWORD='...' php artisan test`.
> (2) **La máquina se queda sin memoria**: el SO responde «el archivo de paginación es demasiado
> pequeño», PHP muere pidiendo **27 MB** y hasta `taskkill` y `PowerShell` agotan su tiempo de
> espera. Partir la corrida en tandas no bastó (los `fork` empezaron a fallar). **Se declara en vez
> de dar por buena una corrida a medias: una suite que no terminó no es una suite verde.**
>
> **Reglas nuevas: una directiva Blade pegada a una LETRA no se compila y su `@endif` sí · un
> importe de un reporte declara su moneda en la pantalla Y en el archivo exportado · cuando la
> moneda no se puede resolver no se pone la del país · un método privado que hace falta en una
> segunda pantalla se SUBE, no se copia · una prueba sobre el código dice en QUÉ archivo encontró
> lo que cuenta · la ayuda de un módulo que vive dentro de otro va en el archivo del padre · una
> suite que no terminó no es una suite verde.**

> **TIPOS DE EMPLEADO DE VERTICALES + LA PROPINA QUE SE LE PAGABA AL EQUIVOCADO (2026-08-12) —
> `[REST-FIX-3]`**: pedido del director técnico — *«puedes agregar al Enum los tipos de empleados
> faltantes: Mesero, Delivery, Mostrador, analiza lo de la propina y define la mejor solución»*.
> **12 pruebas nuevas, 8 reglas verificadas VIOLÁNDOLAS: las 8 se detectan. Suite Restaurante VERDE
> con el árbol quieto: 613 passed, 2322 aserciones, 0 failed** (601 en HEAD + 12 = 613, cuadra
> exacto; ⚠️ el «617» de la bitácora de F7 estaba **sobrecontado**) · Nómina + la guarda que compila
> las 1285 vistas: **85 passed**. **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`fd7339f4`).
> ⚠️ Migraciones `2026_08_12_570001` (ENUM) y `570002` (config).
>
> **El ENUM** venía de ConstructFlow y **un mesero no encajaba en ninguno** de los cuatro: se le
> ponía `administrativo`, que es falso. ⚠️ **Ampliarlo se verificó contra sus CONSUMIDORES, no solo
> contra los datos**: los dos únicos que derivan del campo comparan contra `subcontratista`
> —`DgtExportService` (temporeros del Ministerio de Trabajo) y `ReportePaisService`
> (`permanente`)—, no contra una lista blanca, así que los tres tipos nuevos caen del lado
> permanente y **ningún reporte oficial cambia**. ⚠️ **Un defecto propio evitado por leer el
> esquema**: la migración escribía `NOT NULL DEFAULT 'obrero'` y `SHOW COLUMNS` dice **NOT NULL sin
> default** — un `MODIFY COLUMN` copia la definición completa, así que habría añadido un default
> que no existía: hoy un insert sin tipo **falla** (correcto, es obligatorio) y con default pasaría
> a crear el empleado mal clasificado sin avisar. ⚠️ **La lista estaba COPIADA en SEIS sitios** sin
> constante en el modelo; fuente única `Employee::TIPOS` y **se borraron las seis copias**.
>
> ⚠️⚠️ **LA PROPINA: LA BITÁCORA DECÍA UNA COSA Y EL CÓDIGO HACÍA OTRA, y ese fue el hallazgo.**
> `[REST-F8-3]` dejó escrito que una orden de mostrador «no tiene mesero», pero leyendo **quién
> llena** `mesero_id` resulta que **el mostrador Y el delivery lo llenan con `auth()->id()`** — las
> 126 órdenes sin mesero de producción son **del seed**. Así que la propina no estaba huérfana:
> estaba **asignada, y en delivery a la persona equivocada** (mesa → quien atendió ✅ · mostrador →
> quien atendió ✅ · **delivery → quien TOMÓ el pedido ❌**, cuando le corresponde a quien lo
> ENTREGÓ). ⚠️ **Y eso es PEOR que una propina huérfana**: el cliente se la da en la mano al
> repartidor y el sistema se la liquidaba por nómina al que contestó el teléfono — una huérfana se
> ve en un cuadre, **una mal asignada se liquida y se paga** y el repartidor no puede saber que le
> faltó. Ahora la atribución se decide por **TIPO DE ORDEN** (delivery primero) y **no cae al
> `mesero_id` cuando falta el repartidor**: caerse ahí es el defecto que se corrige. La
> infraestructura del repartidor **ya estaba completa** desde F0-1/F6/F7 esperando esto.
>
> ⚠️ **El default de mostrador es `atendio`, NO `sin_asignar`**, y esa autocorrección importa: la
> primera versión lo puso en `sin_asignar` por prudencia con dinero de terceros, pero `atendio` **es
> el comportamiento vigente** — `sin_asignar` de fábrica habría hecho que esa propina **dejara de
> liquidarse en todos los locales que ya operan**, introduciendo el defecto que el trabajo cierra.
> *Los defaults reproducen el comportamiento actual.* Verificado por el **DEFAULT DE LA COLUMNA**.
> `fondo_comun` queda **fuera de alcance declarado** (exige el emparejamiento de ponches de PSA).
>
> **El cuadre es lo que impide que el pasivo crezca sin que nadie lo note**: `cobrada = asignada +
> sin asignar`, visible SIEMPRE en el cierre del personal y calculado **por diferencia** —así cuadra
> por construcción y **es auto-corrector**: detecta el dinero huérfano cualquiera sea la causa,
> incluida una que nadie previó—. Antes, el aviso solo lo veía el cajero en el instante del cobro y
> se perdía.
>
> ⚠️ **El último tramo destapó un defecto propio que habría pagado la propina DOS VECES**: al cerrar
> el hueco del **pago adelantado** (se cobra antes de asignar repartidor, que es lo habitual),
> corregir una asignación exige recalcular al repartidor nuevo **y al anterior** — pero
> `recalcularPara()` hacía `return` temprano cuando los totales bajaban a cero, así que al primero
> le quedaba el importe viejo **además** de dárselo al segundo. No se **crea** una fila en cero,
> pero si ya existe el cero **se escribe**.
>
> **Verificado en producción**: `company()` sigue siendo NULL en CLI y el cuadre **funciona igual**
> (recibe el tenant por parámetro, no repite el defecto de `[REST-FIX-2]`); cierra en las dos
> empresas (1 252.50 y 1 329.50 asignadas, 0.00 sin asignar) sin falsos positivos. **Impacto de
> datos: CERO**, medido antes de desplegar (90 turnos con 8 950.50 acumulados pero **0 liquidados**).
> ⚠️ **PENDIENTE del director técnico**: 12 empleados marcados `administrativo` podrían ser meseros
> o repartidores mal clasificados — reclasificarlos es criterio de Nómina, no de una migración.
> **Reglas nuevas: un ENUM que se amplía se verifica contra sus CONSUMIDORES · un `MODIFY COLUMN`
> copia la definición completa (leer `SHOW COLUMNS` antes) · la propina la recibe quien la RECIBE en
> la mano · una propina mal asignada es peor que una huérfana · un fallback «al menos a alguien»
> reintroduce el defecto que se corrige · el default de una opción nueva reproduce el comportamiento
> vigente aunque el otro parezca más prudente · un cuadre se calcula por diferencia, no enumerando
> los casos que fallan · «no crear una fila en cero» y «no escribir el cero» son reglas distintas y
> confundirlas paga dos veces · la bitácora de un defecto no es el estado actual: verificar quién
> llena la columna.**

> **RESTAURANTE FASE 7 — PROPINAS Y COMISIONES A NÓMINA (2026-08-11) — `[REST-F7-1]`–`[REST-F7-3]` ·
> CIERRA EL BLUEPRINT v3 (F0→F8)**: era la fase que quedó pendiente al ejecutar F8. F3-3 dejaba las
> propinas acumulándose y F8-1 las mostraba en el reporte, pero **ese dinero no salía del sistema**:
> la columna «Comisiones» estaba siempre en cero, `nom_novedad_id` no lo escribía nadie y no había
> pantalla desde la que pagar — el restaurante sabía cuánto le debía a su personal y no tenía forma
> de pagárselo. **PASO PREVIO**: regresión completa VERDE con el árbol quieto (2804 passed).
> **18 pruebas de la fase** (3 de configuración, 13 del cierre, aceptación con **27 aserciones**);
> **8 reglas verificadas VIOLÁNDOLAS: las 8 se detectan**; **regresión completa VERDE: 2822 passed,
> 4 skipped, 0 failed (24 615 aserciones)** — de 2804 a 2822, exactamente las 18 de la fase.
> **Lo primero fue verificar el ANEXO B contra el esquema real, y casi todo YA existía** escrito por
> fases anteriores para este momento: `nom_novedades` (NOM F1-4), `rest_turnos_propina.nom_novedad_id`
> **desde F0-1 esperando exactamente a esta fase**, `comision_total` como columna que **nadie
> escribía**, `totalALiquidar()`/`liquidado()` ya escritos, y los dos puentes de identidad
> (`nom_employees.user_id` para el mesero, `rest_repartidores.nom_employee_id` desde F6). Lo único
> que faltaba era la configuración de comisiones.
> ⚠️ **El tratamiento fiscal NO lo decide el vertical**: `cotizable_tss`/`gravable_isr` deciden
> cuánto se le descuenta al empleado, y fijarlos en el código sería afirmar un criterio fiscal sobre
> las propinas que **varía por país** y es materia del contador (mismo motivo que el
> `verificado=false` de `[CXP-F1-1]`). **Decisión del director técnico: configurable por empresa**,
> con la pantalla diciendo que se consulte al contador, y naciendo en el criterio **conservador** —
> retener de más se corrige, quedarse corto le deja al empleado una deuda que descubre a fin de año.
> ⚠️ **Los tres porcentajes nacen en 0 y se verifica por el DEFAULT DE LA COLUMNA**: cada uno paga
> dinero real por nómina. La comisión del repartidor son **monto por entrega Y porcentaje, que se
> suman** (decisión del director técnico). ⚠️ **Se calculan al CIERRE y no en cada cobro** (la del
> mesero es un % de su venta del día) y **RECALCULAN, no incrementan**: con `increment`, cerrar dos
> veces pagaría dos veces y el error se descubre en la nómina, cuando el dinero ya se transfirió.
> ⚠️ **Las ventas no se recalculan**: salen de `RestauranteVentasService` y del reporte de delivery —
> con una consulta propia, «lo que vendió Pedro» tendría **dos respuestas**, la del reporte y la que
> se le pagó (**quinta vez** que el vertical evita esa forma; dos aserciones del golden master lo
> impiden). Y **se paga por lo ENTREGADO, no por lo asignado**: pagar un pedido devuelto premiaría la
> devolución.
> ⚠️ **El pago va SIEMPRE por nómina, nunca por caja**, y no es preferencia administrativa: la
> propina es dinero de terceros que el restaurante retiene y debe (F3-3 la asienta contra un PASIVO),
> así que por la gaveta el pasivo queda abierto para siempre, el arqueo descuadra y la nómina no ve
> un ingreso que puede tener retenciones. **La aceptación comprueba que no hay ni un movimiento de
> caja.** Los candados con su motivo: **sin Nómina no se marca el turno** (marcarlo contra una
> novedad inexistente dejaría esa fila sin poder liquidarse el día que se contrate el módulo — el
> dinero se perdería); **quien no tiene ficha se NOMBRA, no se filtra** (si se ocultara, su dinero
> desaparecería del consolidado sin que nadie lo note); **solo períodos abiertos** (en uno cerrado la
> nómina ya se pagó); y **el export existe siempre**, porque es el papel con el que se entrega el
> dinero y se firma. La pantalla es un **PROCESO, no un reporte** (lección de `[PRE-FIX-1]`).
> ⚠️ **Dos hallazgos de verificar por violación**: (1) **una prueba propia pasaba por la razón
> equivocada** —«sin Nómina» usaba `sinFicha`, así que no liquidaba por falta de ficha y no por el
> candado—; y (2) **dos guardas redundantes** (el `whereNull` y el `lock+recheck`) que protegen del
> mismo pago doble, así que quitar solo una deja la prueba verde **con razón**: se declaran y se
> violan **juntas**, porque **el lock es el único que protege de la CONCURRENCIA** y eso no se puede
> probar sin dos procesos reales.
> ⚠️ **Tres nombres de columna que eran suposiciones mías** (`full_name`, `nom_employees` sin
> `estado`, `created_by` NOT NULL) **y un ENUM**: `nom_employees.employee_type` viene de ConstructFlow
> (`obrero`/`capataz`/`subcontratista`/`administrativo`) y **un mesero no encaja en ninguno** — queda
> como TODO del módulo Nómina, no del vertical.
> ⚠️ **El golden master NO avisó: QUINTA fase seguida sin hueco declarado** (F4, F5, F6, F8 y F7).
> Con F7 el blueprint v3 queda completo, así que no hay siguiente hueco que escribir. ⚠️ Migración
> `2026_08_11_560001`; sin tablas nuevas.
> **Reglas nuevas: el pago del personal va SIEMPRE por nómina, nunca por caja · un criterio fiscal no
> lo decide el módulo que lo consume, se configura con el default conservador · un importe que va a
> nómina se calcula al cierre, y la pantalla que lo muestra consolida al abrirse · se paga por lo
> entregado, no por lo asignado · marcar como pagado sin generar el pago pierde el dinero · cuando
> dos guardas protegen de lo mismo, se violan juntas y se declara qué aporta cada una.**

> ✅ **LOS DIEZ COMANDOS QUE NO CORRÍAN — RESUELTO SIN TOCAR EL SERVIDOR (2026-08-11) —
> `[CRON-FIX-1]`**: pedido del director técnico — *«bluehost no me deja cambiar el cron»*. El
> hallazgo del deploy de la FASE 8 de Restaurante quedaba en manos del hosting; la solución es
> **mover los horarios a minutos que el cron alcanza**, no cambiar el cron.
> ⚠️ **Y el crontab de producción ya NO es `*/18` como decía aquella entrada: hoy es `*/15`**,
> comprobado con `crontab -l` (`MAILTO=""` + `*/15 * * * * … schedule:run`). Con ese intervalo
> **32 comandos sí corren** —incluidos `zyntello:backup-db` (02:30) y `activos:depreciar`
> (04:30)— y eran **estos diez** los que no: `cxp:alertas` 06:20→**06:15** · `bancos:alertas`
> 06:25→**06:30** · `carwash:alertas` 06:35→**06:30** · `cxc:bloqueo-automatico` 06:50→**06:00**
> · `compras:alertas` 06:40→**06:45** · `prestamello:expirar-preaprobaciones` 06:50→**06:45** ·
> `prestamello:alertas` 06:55→**07:00** · `prestamello:paquete-ejecutivo` 07:10→**07:15** ·
> `carwash:recordatorios-mantenimiento` 07:20→**07:15** · `restaurante:alertas` 06:40→**07:30**.
> ⚠️ **Lo único que el movimiento podía romper era el orden de los dependientes de Prestamello,
> y se respetó**: `expirar-preaprobaciones` (06:45) vence las caducadas → `alertas` (07:00) avisa
> de las «por vencer» **sin incluir las que acaban de caducar** → `paquete-ejecutivo` (07:15) lee
> la cartera que las alertas ya evaluaron. Verificado: **cero comandos huérfanos**.
> ⚠️ **La guarda es lo que impide que vuelva a pasar.** La regla («`schedule:run` se invoca CADA
> MINUTO») llevaba escrita en este archivo desde que se descubrió el defecto **y aun así los
> horarios nuevos seguían cayendo fuera** — escrita en prosa, se degrada. `CronAlcanzableTest`
> lee los eventos del **scheduler REAL** (`app(Schedule::class)->events()`), **no parsea
> `routes/console.php`**: parsear probaría lo que dice el texto, no lo que Laravel va a ejecutar.
> El intervalo vive en una constante, así que el día que el crontab cambie la prueba dice
> **exactamente qué comandos dejarían de correr** (bajarlo solo relaja; **subirlo** invalida
> horarios que hoy funcionan).
> **Verificada VIOLÁNDOLA**: devolviendo `restaurante:alertas` a las 06:40 falla y **nombra ese
> comando con su minuto**. ⚠️ Y al hacerlo salió **un defecto propio**: `nombreLegible()`
> documentaba que recortaba la ruta del binario y **no lo hacía** —su patrón aceptaba comilla
> simple y Laravel usa **dobles** en Windows—, así que el mensaje salía con la ruta completa del
> PHP local. Es la familia «una firma que documenta lo que el cuerpo no aplica», encontrada solo
> porque se verificó violando. **Sin migración.**
> ⚠️ **Antes de poner a correr diez comandos parados se midió su impacto CONTRA LOS DATOS REALES
> de producción, no contra los defaults recordados — y es CERO**: `cxc_config` **no tiene ni una
> fila**, así que el bloqueo automático de clientes aplica su default `false` y **no bloquea a
> nadie**; Prestamello tiene **0 preaprobaciones por vencer**; Car Wash **0 reglas de
> mantenimiento**, así que no escribe a ningún cliente; y los master-switch de correo están en
> **0** (Car Wash, Restaurante, Prestamello) o **sin fila** con el default en `false` (Bancos,
> CxP, Compras). ⚠️ **El único master-switch de correo ENCENDIDO del ecosistema es Activos Fijos**
> (`af_config`, las 3 empresas) — y **no lo activa este cambio**: `activos:alertas` está en el
> minuto 30, que `*/15` ya alcanzaba, o sea que ya venía enviando.
> ⚠️ **La regresión completa NO se pudo correr: el MySQL local dejó de aceptar conexiones** (1045
> en 3306 y 3308, con las tres credenciales conocidas). Es entorno, no código — las suites sin BD
> pasan y todas las que la tocan fallan con el mismo error. Lo que **sí** se verificó:
> `CronAlcanzableTest` en verde y violándola, y `schedule:list` sobre el scheduler real con **los
> 42 comandos en minutos 0/15/30/45, cero fuera**.
> **Regla nueva: cuando el servidor no se puede cambiar, el horario se adapta al servidor — y lo
> que se detecta comparando a mano se convierte en prueba, incluida la regla que ya estaba
> escrita y se siguió incumpliendo.**

> **CINCO MÓDULOS DE MEJORA REGISTRADOS EN LOS TRES REPOS (2026-08-11) — `[#505]`, `[#506]`,
> `[MOD-ADIC-1]`, `[MOD-ADIC-2]`**: pedido del director técnico — *«crear 5 módulos adicionales
> en admin, website y app, activos y con el costo de stripe, el pago es anual»* y *«luego ejecuta
> la creación de Módulos_Adicionales»*. Se entrega el **registro completo y vendible** de los
> cinco, más los **blueprints reescritos**; la implementación va después, uno por sesión.
> **Regresión completa del ecosistema VERDE: 2802 passed, 4 skipped, 0 failed (24 510
> aserciones)** — de 2795, exactamente las 7 pruebas nuevas.
> ⚠️ Migraciones **en el admin**: `2026_08_11_000001` (columna `requiere`) y `000002` (precios
> nullable). En zyntello-app **no hay migración**.
>
> ⚠️ **Los cinco blueprints originales no correspondían a este código.** Usaban `companies(id)`
> BIGINT y tablas `customers`/`products`/`vendors`/`exchange_rates` que **no existen** aquí, y
> **ninguno llevaba `empresa_id`** —la regla arquitectural fundamental—. El `04` venía además
> **corrupto** (basura de una llamada a herramienta a medias y el contenido duplicado) y el `03`
> tenía texto en chino. Eran genéricos, escritos sin mirar el repositorio.
>
> ⚠️⚠️ **Y el `04` pedía construir de cero un Inventario que YA EXISTE completo**: `items`,
> `warehouses`, `stock_levels`, `stock_movements`, `lot_serials`, `purchase_suggestions` —
> cuando `inv_*` ya tiene stock multi-bodega, lotes FEFO, costeo promedio/PEPS/UEPS, ROP con
> alertas, `SugeridoCompraService`, Kardex y conteo físico. Crearlo habría dado **dos verdades
> del stock**: Facturación, Compras, Restaurante y Car Wash seguirían moviendo `inv_*` y la
> divergencia solo se vería en el conteo físico, semanas después. **Reenfocado a lo que de
> verdad falta** (pronóstico de demanda, EOQ, ABC, cobertura) **leyendo `inv_*`, sin crear ni
> una tabla de stock.** Lo mismo con los otros tres: el `02` no reimplementa 606/607/608, IR-17,
> NCF ni e-CF —los orquesta y avisa cuándo vencen—; el `03` no recalcula la proyección de saldo
> —la consume de `TesoreriaAnaliticaService`, cuya fórmula ya se corrigió por doble conteo en
> `D-BAN-F4-3-1`—; y el `05` no crea tabla de entregas porque **`fact_despachos` ya existe** con
> guía, firma del receptor y `entregado_at`.
>
> **Arquitectura decidida con el director técnico**: cuatro son **extensiones** que viven DENTRO
> de su módulo padre (`inteligencia`→CRM, `fiscal`→Contabilidad, `flujocaja`→Bancos,
> `abastecimiento`→Inventario) y **no se venden sueltos**; `rutas` es el único **módulo raíz**.
> En el website se promocionan como producto propio con badge «Mejora tu módulo X»; en la app
> aparecen en Plan y Suscripción **validando el padre**.
>
> ⚠️ **La dependencia la declara QUIEN VENDE**: columna nueva `modulos.requiere` en el admin, no
> una lista escrita a mano en el consumidor. Es la lección de `[BUNDLE-FIX-1]`, donde la
> composición del bundle ERP estaba copiada en la app, se desincronizó, y **dos clientes
> recibieron 4 de los 8 módulos que pagaban** sin que nada lo avisara. `AdminModulosService::dependencias()`
> la lee con snapshot *last-known-good*; ⚠️ y su fallback **no es `[]`** como el del bundle —
> allí un array vacío es el estado seguro, aquí dejaría comprar un hijo sin su padre.
>
> ⚠️ **La guarda real está en el SERVIDOR**: `BillingController::checkout()` rechaza la compra
> sin el padre y fuerza `period=anual`. El botón deshabilitado de la vista es una sugerencia —
> basta reenviar el formulario para saltarlo (lección de `[PRE-F1]`: *un control que nunca se
> dispara es peor que no tenerlo*). Y sin forzar el período, el checkout —que usa `'mensual'` por
> defecto— llegaba a Stripe buscando un `stripe_price_id_mensual` vacío **a propósito** y
> devolvía «este módulo no tiene precio configurado», un mensaje que suena a avería del sistema
> cuando la venta mensual sencillamente no existe.
>
> ⚠️ **Dos defectos de «cero que se lee como gratis»**, uno encontrado leyendo y otro ejecutando:
> (1) el API del admin casteaba `(float) $m->precio_mensual` y convertía el NULL en **`0.0`** —
> el sitio habría anunciado **«USD 0 /mes»** en los cinco; y (2) al sembrar, `precio_mensual` y
> `precio_anual` resultaron **NOT NULL** en la tabla, y la salida fácil (guardar `0`) era el
> mismo defecto por la puerta de atrás. Migración `000002` los pasa a nullable — ampliar a NULL
> no invalida datos existentes, por eso corre en producción sin ventana.
>
> ⚠️ **El candado del sidebar NO reintroduce el defecto reincidente.** `<x-menu-link-modulo>`
> gana la variante `menu` (aditiva), pero la ruta de cada ítem con candado **pertenece al mismo
> módulo que lo lista** (`inventario.abastecimiento.*` es de Inventario), así que `ModuleMenu` no
> reclama nada ajeno. Declarar en el menú de un módulo la ruta DUEÑA de otro dejaba al dueño sin
> poder abrirse y **pasó tres veces** (`[CND-FIX]`, `[CW-F0-5]`, `[REST-F0-4]`): ahora hay una
> prueba que recorre todo el menú y lo detecta, en vez de una regla escrita en prosa que ya se
> ignoró tres veces.
>
> ⚠️ **Se venden antes de existir, y eso se cubrió**: quien contrate hoy vería «Módulo no
> contratado» justo después de pagar — un texto que convierte una espera en sospecha de cobro
> indebido. Ahora ese caso dice **«en preparación»**, no ofrece «Ver planes» y usa otro icono.
> **Y la regresión destapó lo que faltaba**: `AyudaIntegridadTest` vio `rutas` en el sidebar sin
> ayuda (justo para lo que se escribió en `[AYUDA-2]`, cuando Condominios llevaba semanas con 13
> pantallas invisibles). Se declara como **deuda**, no se documenta: escribir la ayuda de
> pantallas que no existen describiría una interfaz imaginaria. Al investigarlo salió lo de
> verdad valioso — **qué ve quien contrate uno hoy**: el menú ya estaba protegido con
> `Route::has()` en sus tres puntos, pero **nadie lo custodiaba**, y ese error no aparecería en
> desarrollo (donde nadie los tiene contratados) sino **en la cuenta del primer cliente que
> pague**. Ahora hay prueba.
>
> **Precio: USD 100/año los cinco.** ⚠️ Verificar que coincida con el importe de cada Price de
> Stripe: el que se cobra es el de Stripe, este solo es el que se anuncia.
> **7 pruebas nuevas (`ModulosMejoraTest`), 2 guardas verificadas VIOLÁNDOLAS: las dos se
> detectan.** ⚠️ La primera versión de la prueba del menú renderizaba la vista con variables a
> mano y falló con «Undefined variable `$activeSlug`» — habría probado mi suposición de cómo
> funciona el menú, no cómo funciona; ahora monta el componente Livewire real.
> **Reglas nuevas: la dependencia entre módulos la declara quien los vende · un `0` en un precio
> no se lee como «este plan no existe» sino como GRATIS · un módulo que se vende antes de
> existir necesita decir «en preparación», no «no contratado» · lo que se detecta comparando a
> mano se convierte en prueba (el defecto del menú se ignoró tres veces escrito en prosa) · una
> prueba que renderiza una vista con variables inventadas prueba la suposición, no el código.**
>
> ⚠️ **PENDIENTE — decisión del director técnico**: los cinco quedan **activos y cobrables sin
> estar implementados**. Está cubierto que no rompa nada, pero un cliente puede pagar por algo
> que aún no puede usar. Pasarlos a `proximo` es una línea por módulo en el seeder.

### Bitácora anterior (2026-08-10)

> **RESTAURANTE post-cierre — LAS OPCIONES QUE NO SE PODÍAN SELECCIONAR (2026-08-10) —
> `[REST-FIX-1]`**: pedido del director técnico — *«revisa todas las discrepancias encontradas y
> resuelve para seleccionar las opciones requeridas desde la opción de configuración del módulo,
> recuerda crear la sección de Cuentas Contables si no existe y verificar la relación con los otros
> módulos»*. Revisadas las **~40 discrepancias y los TODOs de las ocho fases**, y lo que apareció es
> la misma familia de defecto que `[BAN-F4-FIX]` y `[CW-FIX-2]`: **funcionalidad implementada,
> probada y DESPLEGADA que el usuario no puede alcanzar desde ninguna pantalla.**
> ⚠️ **`rest_config` tenía CINCO columnas en el `$fillable` ausentes del formulario y de la
> validación**: `redondeo_precio` (F4-2) y las cuatro de alertas de F8-2. **Lo grave son las de
> alerta**: los umbrales nacen en **0 = desactivado** a propósito, y sin formulario **no había forma
> de encenderlos** — la alerta de insumo por agotarse y la de lote por vencer, con 26 pruebas y nueve
> reglas verificadas violándolas, **no podían dispararse NUNCA en producción**. Es idéntico a
> `saldo_minimo` en Bancos (`D-BAN-F4-6`). Y `redondeo_precio` hacía que el **TODO #2 de la FASE 4
> fuera imposible de cumplir**: pedía configurar algo que no tenía pantalla. Corregido con una
> **sección nueva «Alertas del módulo»** que explica por qué nacen apagadas y que la mesa abierta de
> ayer no tiene umbral (no es preferencia, es un hecho). ⚠️ Tres detalles que no son cosméticos: el
> master-switch del correo entra en el bloque hidden+checkbox (un checkbox ausente no puede
> encenderlo por accidente); el responsable vacío se guarda **NULL y no `''`** (con cadena vacía,
> `whereNotNull()` creería que hay responsable y se notificaría a un usuario inexistente); y
> `redondeo_precio` vacío es «sin redondeo», no cero.
> **La guarda que impide la reincidencia**: el defecto se encontró comparando a mano el `$fillable`
> contra la validación, y **eso se degrada** — ahora una prueba recorre el `$fillable`, descuenta lo
> que legítimamente no es configurable y exige que todo lo demás esté en la validación **y** en la
> vista.
> ⚠️ **El checklist ahora avisa de que el barrido no corre, y es su aviso más importante**: sale
> directo del hallazgo del deploy de F8. Antes ese fallo era **invisible** —el panel vacío se lee
> como «no hay problemas»—; ahora dice «no se ha ejecutado nunca» o «lleva **N** días sin correr»
> (con el número, porque «hace tiempo» no es accionable) y **calla si corrió hoy**.
> **Cuatro TODOs de markdown pasan a verificación automática**: tipo de transacción de salida (F3 #5),
> conversiones de unidad (F3 #4 / F4 #6), **toma física** (F4 #5, *el más importante de esa fase*:
> sin conteo la variancia sale 0 por construcción y una tabla de ceros se lee como «todo cuadra») y
> umbrales apagados. ⚠️ **La verificación de conversiones NO reimplementa el criterio**: consume el
> mismo `RecetaService::conversor()` del consumo real — con una copia, el checklist diría «todo bien»
> mientras el consumo descarta líneas (**cuarta vez** que se evita esta forma en el vertical).
> ⚠️ **Tres nombres de columna que eran suposiciones mías y estaban mal**, descubiertos comprobando
> contra el esquema real antes de dar nada por bueno: `inv_tipos_transaccion.es_activo` → **`is_active`**,
> `inv_inventario_fisico.estado`/`.fecha` → **`status`**/**`aplicado_at`**, y
> `inv_articulos.unidad_medida_id` → **`uom_base_id`**. Cualquiera de las tres habría reventado el
> checklist con un 1054 **en la propia pantalla de Configuración**.
> ✅ **Cuentas Contables: la sección YA existía** y está bien — se comprobó antes de crear nada.
> Existe desde `[REST-F0-2]`, está en el menú y lee las operaciones del **catálogo del hub**, no de
> una lista propia; y el vertical **no tiene ni una sola cuenta hardcodeada**.
> ✅ **Relación con los otros módulos verificada**: Inventario (5 candados), Facturación (3), Caja (1),
> PSA (1), Contabilidad (vía `ParametroContable`). Prueba nueva: **sin Inventario contratado el
> checklist no reclama nada de Inventario** (⚠️ hay que desactivarlo explícitamente: `HubTestCase`
> arranca con el módulo ACTIVO). ⚠️ **Nómina sigue sin relación: es la FASE 7, no implementada.**
> ⚠️ **Una violación mal diseñada, que era mi error y no de la prueba** (reincidente de F4): quitar el
> flag del `foreach` **no cambia el comportamiento** porque `validate()` tampoco incluye las claves
> ausentes, así que la prueba pasaba con razón. **10 pruebas nuevas, 10 reglas verificadas
> violándolas, las 10 se detectan. Sin migración**: las columnas ya existían, el defecto era que no
> tenían pantalla.
> ⚠️⚠️ **`[REST-FIX-2]` — y el defecto que más enseña lo encontró VERIFICAR EL DEPLOY, no las
> pruebas**: al correr el checklist contra los datos **reales de producción**, las tres verificaciones
> de Inventario **no aparecían** pese a estar el módulo contratado en las dos empresas y no tener
> ninguna toma física. La causa era mía: el candado usaba el helper **`company()`, que lee la
> SESIÓN**, y en CLI devuelve `NULL` → `! null?->hasModule()` es `true` → **retornaba temprano y se
> saltaba las tres verificaciones en silencio** desde cualquier comando, job o script. **Las pruebas
> no lo veían porque el TestCase sí provee sesión** (la forma «una prueba que pasa por la razón
> equivocada»). Corregido resolviendo la Company del `$companyId` que el método **ya recibe por
> parámetro**. **Verificado tras el redeploy**: `company()` sigue siendo NULL en CLI y el checklist ya
> evalúa Inventario, sin falsos positivos. **Regla nueva: un service que recibe el tenant por
> parámetro NO lee la sesión para decidir una guarda — si lo hace, la guarda cambia según quién lo
> llame.**
> **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`3e2ddb98`): los 5 campos en el formulario, el checklist
> corriendo contra datos reales sin errores y el aviso de barrido no ejecutado apareciendo donde
> corresponde. **Sin migración.**
> **Reglas nuevas: una columna sin formulario es una función que no existe (tercera vez en el
> ecosistema, y aquí dejaba dos alertas incapaces de dispararse) · lo que se detecta comparando a mano
> se convierte en prueba, o se degrada · un proceso programado que no deja rastro es indistinguible de
> un día tranquilo, y el checklist es donde eso se mira · un TODO que el sistema puede comprobar solo
> no se escribe en un markdown · antes de consultar la tabla de otro módulo se comprueban los nombres
> contra el esquema real.**

> **RESTAURANTE FASE 8 — REPORTES, ALERTAS Y SEED DEMO (2026-08-10) — `[REST-F8-1]`–`[REST-F8-3]`
> + cierre `[REST-F8]`**: F1–F6 dejaron el vertical operando de punta a punta —toma la comanda, la
> cocina, la cobra con su comprobante fiscal, descuenta insumos, la costea, vende combos con
> promociones, la despacha a domicilio y acepta reservas—. Lo que no tenía era **con qué mirar el
> negocio**: un gerente con 500 órdenes al mes no podía responder «¿a qué hora se llena?», «¿qué
> plato me está costando dinero?», «¿cuánto tarda la parrilla?», «¿para cuántos días me queda el
> queso?» ni «¿cuánta propina le debo a cada mesero?». **PASO PREVIO**: regresión completa VERDE con
> el árbol quieto (2705 passed, la del cierre de F6). **78 pruebas de la fase** (42 de los cinco
> bloques de reportes, 26 del tablero y las alertas, 10 del seed, aceptación con **97 aserciones**);
> **15 reglas verificadas VIOLÁNDOLAS: las 15 se detectan**; **regresión completa del ecosistema
> VERDE: 2783 passed, 4 skipped, 0 failed (24 424 aserciones)** — de 2705 a 2783, exactamente las 78
> de la fase.
> ⚠️ **El reporte de cocina NO usa el criterio de ventas, y no es un descuido**: el dinero se ubica
> por el **cobro** (`cerrada_en`) y el trabajo por el **envío** (`enviada_en`). Una mesa que pide a
> las 23:40 del lunes y paga a las 00:20 del martes es venta del martes y cocina del lunes, y las
> dos son correctas — **está explicado en la pantalla antes de la tabla**, para que nadie «unifique»
> los criterios creyendo que la diferencia es un error. ⚠️ **La prueba anti-copia encontró una copia
> real** (`descuentos()` reimplementaba el período porque la fuente única devolvía un builder sobre
> LÍNEAS y los descuentos viven en las CUENTAS): corregido añadiendo `ordenesCerradas()` — **tercera
> vez** en el vertical, *centralizar no es crear el método, es borrar la copia*. ⚠️ **Los combos van
> como grupo propio** en el desglose por categoría: filtrarlos dejaría el total sin sumar y el
> descuadre sería **tanto mayor cuanto mejor venda el combo**. El promedio de preparación se calcula
> solo sobre lo que tiene `lista_en` y **lo que no lo tiene se cuenta aparte y se nombra** (si no, el
> día que la cocina deja veinte platos sin marcar saldría con el mejor promedio del mes); el % de
> devolución va sobre los pedidos **CERRADOS** (si no, baja sola durante el servicio); y la cobertura
> de insumos **documenta su fórmula en la pantalla** — un «te queda para ~2 días» sin el stock, el
> consumo diario y la ventana no se puede comprobar y no se usa para comprar. ⚠️ **El cruce PSA
> «ventas por hora trabajada» NO se implementa**: las horas se calculan emparejando ponches y ese
> emparejamiento es lógica de PSA — reimplementarlo crearía un **segundo criterio de horas
> trabajadas** que divergiría de la nómina; se entrega el **puente de identidad** (el código PSA del
> mesero sale junto al nombre) y queda como TODO.
> ⚠️ **El hallazgo que más enseña: una prueba propia pasaba con el defecto puesto.** Al verificar por
> violación se cambió el default de `alerta_cobertura_dias` de 0 a 7 y «con los defaults no dispara
> ni una alerta» **siguió verde** — porque con fila en `rest_config` el valor sale de la **COLUMNA**,
> no de la constante del modelo. Es la lección de `[PRE-F4-1]`: **un interruptor peligroso se
> verifica por el DEFAULT DE LA COLUMNA**. La prueba nueva lee `information_schema`, exige que la
> constante coincida con la migración y **se verifica con un ALTER TABLE**, porque un default de
> columna no vive en un archivo. ⚠️ **La mesa abierta de ayer avisa sin umbral y se compara contra el
> DÍA**: un local que cierra a las 3 a.m. tiene mesas legítimamente abiertas a las 2, y un umbral
> horario las marcaría todas cada noche (la trampa de medianoche que F2-1 resolvió en el KDS).
> ⚠️ **El tablero NO es la portada**: `restaurante.dashboard` sigue llevando al mapa de salón — un
> mesero con una tablet en la mano necesita ver **las mesas**, no un gráfico de ventas; el golden
> master lo custodia.
> **El seed** deja ~500 órdenes en 30 días con **urna ponderada** de popularidad para que la
> ingeniería de menú nazca con sus cuatro cuadrantes (*un seed con distribución plana hace inútil el
> reporte que llena*). ⚠️ **No consume numeración fiscal**: pasar 30 días por `CobroService` gastaría
> **~500 NCF de la secuencia autorizada por la DGII** —el defecto que F3-2 corrigió para el ticket
> interno— así que las órdenes se insertan con `DB::table` y los reportes de Facturación no las
> muestran, que es lo correcto. ⚠️ **Y el cuadre del reporte de personal detectó un fenómeno REAL de
> producción**: `rest_turnos_propina` acumula POR MESERO, y una orden de **mostrador o delivery no
> tiene mesero** — la propina se cobra, entra a la caja, se asienta como pasivo y **no se le asigna a
> nadie**. El seed la evita para no abrir descuadrado, pero a quién se le asigna es una decisión de
> negocio pendiente. Que el cuadre lo detectara es para lo que se escribió: es dinero de terceros.
> ⚠️ **Tres defectos propios**, y el que más enseña: **el mesero que vendió SIN recibir propina salía
> como «Usuario 42»** (los nombres se resolvían solo para los que tenían fila de propina, no para
> todas las claves del ranking) — y el mesero sin propina es justo el que hay que mirar. Más
> `rest_mesas` que identifica por `numero` y no por `nombre`, y **Carbon 3 devolviendo FLOAT en
> `diffInDays()`** (28.0 y 2.0, mismo defecto de tipo que `[PRE-F4-1]`).
> ⚠️ **Y el cuarto lo encontró la regresión COMPLETA, no la suite del vertical**: la guarda
> transversal `AnclaFechaTest` detectó un `now()->addMonth()` usado solo para construir «un día
> futuro» — **el mes era decoración, no dato**, y desde un día 31 Carbon desborda. Corregido a
> `addDays(35)`, **sin anclar la suite entera** porque otras pruebas del archivo sí dependen del
> reloj real (la mesa abierta de ayer, el happy hour vigente). **Segunda vez que esta guarda encuentra
> un defecto de este vertical** (la primera fue `[REST-FIX-2]` al cerrar F5): la regla operativa que
> deja el reincidente es **si la prueba solo necesita «futuro» o «pasado», usar DÍAS.**
> ⚠️ **El golden master NO avisó: cuarta fase seguida sin hueco declarado** (F4, F5, F6 y F8) — el
> mecanismo se está usando como registro *a posteriori* en vez de guarda *a priori*. Se le añadieron
> sus aserciones al cerrar. ⚠️ Migración `2026_08_10_550001`; cron nuevo `restaurante:alertas`
> (06:40) — **sin `schedule:run` el panel de alertas estará siempre vacío**.
> ⚠️ **La FASE 7 del blueprint NO está implementada** (`git log` va de `[REST-F6]` a `[REST-F8-1]`):
> F8 no depende de ella, pero la columna «Comisiones» sale en cero con su aviso. **El blueprint v3 no
> está completo hasta que F7 se ejecute.** Detalle, las 10 discrepancias y los 10 TODOs consolidados
> en `app/zyntello-app/DISCREPANCIAS-restaurante.md` → «FASE 8».
> **DESPLEGADO Y VERIFICADO EN PRODUCCIÓN** (`3d0e9953`): migración aplicada, las 2 tablas creadas,
> el default de columna de los umbrales en **0** comprobado contra `information_schema`, 15 rutas
> cacheadas sin roturas y el cron programado.
> **Reglas nuevas: dos reportes del mismo módulo pueden medir períodos distintos y hay que DECIRLO en
> pantalla · un desglose que no suma su total esconde justo lo que crece · un promedio se calcula
> sobre lo que tiene el dato, y lo que no lo tiene se cuenta aparte y se NOMBRA · un porcentaje se
> calcula sobre lo que ya terminó · un aviso automático lleva su propia cuenta · un interruptor
> peligroso se verifica por el DEFAULT DE LA COLUMNA · un seed no simula la operación fiscal · un seed
> con distribución plana hace inútil el reporte que llena · `schedule:run` se invoca CADA MINUTO.**

> ✅ **RESUELTO en `[CRON-FIX-1]` (2026-08-11)** — ver la entrada de esa fecha al inicio de la
> bitácora. ⚠️ **Dos datos de abajo quedaron obsoletos y se corrigen aquí**: el crontab **ya no es
> `*/18`, es `*/15`** (verificado con `crontab -l`), así que **no son «todas» las alertas las que
> no corrían sino DIEZ comandos** — los demás sí se ejecutan. Y **no se cambió el crontab**: se
> movieron los horarios a minutos que el intervalo alcanza, porque el hosting no permite bajarlo.
> Se conserva el texto original porque el método con que se detectó (la marca de ejecución) es lo
> que resolvió la pregunta y vale para la próxima vez.
>
> ⚠️⚠️ **HALLAZGO DEL DEPLOY, FUERA DE ALCANCE Y PARA DECISIÓN DEL DIRECTOR TÉCNICO (2026-08-10) —
> EL CRON DEL SERVIDOR CORRE CADA 18 MINUTOS Y NINGUNA ALERTA PROGRAMADA DEL ECOSISTEMA SE EJECUTA**:
> el crontab de Bluehost es `*/18 * * * * … schedule:run`. **`schedule:run` no encola nada**: ejecuta
> lo que está *due* **en el minuto exacto** en que se le invoca, y Laravel lo documenta para correr
> **cada minuto**. Con `*/18` solo dispara en los minutos **0, 18, 36 y 54** — así que un
> `dailyAt('06:40')` **no se ejecuta NUNCA**.
> **La evidencia, medida en producción, no deducida**: las cinco tablas de alertas del ecosistema
> (`cw_`, `ban_`, `cxp_`, `af_`, `pre_`) están **en cero** — pero cero por sí solo no prueba nada,
> podrían ser datos limpios. **Lo que lo prueba es la marca**: `cw_config.ultima_ejecucion_alertas`,
> que `[CW-FIX-2]` estampa **aunque no envíe nada** *precisamente* para distinguir «corrió y no había
> nada» de «no corrió», dice **2026-07-27 12:47** — el día de su propio deploy, **a las 12:47 y no a
> las 06:35**, o sea una corrida manual. **14 días sin volver a correr.** La herramienta que aquel
> commit construyó para responder esta pregunta la respondió.
> **Diez comandos de siete módulos nunca corren**: `cxp:alertas` 06:20 · `bancos:alertas` 06:25 ·
> `activos:alertas` 06:30 · `carwash:alertas` 06:35 · `restaurante:alertas` 06:40 · `compras:alertas`
> 06:40 · `prestamello:expirar-preaprobaciones` 06:50 · `prestamello:alertas` 06:55 ·
> `prestamello:paquete-ejecutivo` 07:10 · `carwash:recordatorios-mantenimiento` 07:20. **Solo
> sobreviven los de minuto 0**: `demo:reset` (03:00) y `prestamello:recordatorios` (08:00).
> ⚠️ **Y explica un síntoma anotado hace meses**: `[PRE-F3]` registró un «preaprobación vence en **-9
> días**» y dejó escrito que *revelaba que el cron no estaba corriendo*. Era esto, y seguía así — con
> la consecuencia de que las preaprobaciones **no se vencen solas**, que es justo el defecto que
> `[PRE-F1-4]` creó la vigencia para evitar.
> **El fallo es SILENCIOSO**: el módulo se ve perfecto y el panel de alertas se ve vacío, y «vacío» se
> lee como «no hay problemas». Es literalmente lo que `[CW-FIX-2]` llamó *«el TODO más peligroso»*.
> **Verificado que el comando de esta fase SÍ funciona**: ejecutado a mano tras el deploy, estampó su
> marca y encontró **una alerta REAL el primer día** — la orden `ORD-000001` de la mesa 9 de
> *Comercial Aranza*, **abierta desde el 31/07**, diez días sin cobrar. Es exactamente el caso para el
> que se diseñó y valida que avise **sin umbral configurable**. Sin correo: `notificar_responsable=0`
> y los dos umbrales en `0`, leído de la fila real.
> ⚠️ **NO se corrigió, a propósito.** Cambiar el crontab a `* * * * *` es **una línea**, pero pone a
> correr **diez comandos que llevan meses parados**, todos a la vez y por primera vez, sobre datos
> reales de clientes. Es infraestructura del servidor con radio en siete módulos. **Antes de cambiarlo
> conviene revisar**: el volumen de alertas atrasadas del primer barrido, qué preaprobaciones de
> Prestamello se vencerán de golpe, y si algún master-switch de correo quedó encendido en otro módulo
> (el de Restaurante está apagado y verificado; **los otros seis no se revisaron**).
> **Regla nueva: `schedule:run` se invoca CADA MINUTO — con cualquier otro intervalo, todo comando
> cuyo minuto no coincida no se ejecuta jamás, y el síntoma es un panel vacío que se lee como “no hay
> problemas”. Y una marca de ejecución que se estampa aunque no haya nada que hacer es lo único que
> distingue “corrió y estaba limpio” de “no corrió”.**

> **RESTAURANTE FASE 5 — COMBOS, PROMOCIONES Y MENÚ QR PÚBLICO (2026-08-05) — `[REST-F5-1]`–`[REST-F5-3]`
> + cierre `[REST-F5]`**: F4 dejó el vertical costeando y decidiendo precios plato por plato, pero la
> carta seguía siendo una lista plana — no había forma de vender «Pizza + bebida» a precio fijo, de
> anunciar un descuento por franja horaria, ni de que alguien viera la carta sin loguearse como
> mesero. **PASO PREVIO**: regresión completa VERDE (2607 passed, la del cierre de F4). **59 pruebas
> de la fase** (16 de combos, 28 del motor de promociones, 14 del menú público, aceptación con
> **23 aserciones**); **suite Restaurante 454**; **regresión completa del ecosistema VERDE: 2666
> passed, 4 skipped, 0 failed (23 757 aserciones)** — de 2607 a 2666, exactamente las 59 de la fase.
> **El combo** (F5-1): una línea ÚNICA con su propio precio, nunca la suma de sus componentes —
> venderlo a 600 cuando la pizza sola vale 500 no es un descuento del 8,3 %, es un precio propio.
> `ComandaService::agregarCombo()` exige EXACTAMENTE una opción por grupo de elección y congela el
> snapshot en la línea. ⚠️ **El consumo (F3-4) tuvo que aprender a leer el snapshot**: un componente
> FIJO consume siempre, uno de GRUPO DE ELECCIÓN solo si está en lo elegido — sin la distinción, un
> «elige tu bebida» habría descontado las DOS alternativas del almacén.
> **El motor de promociones** (F5-2): el happy hour ES una promoción con franja horaria, no una
> pantalla aparte. ⚠️ **Lo que encontró leer `CuentaService` completo antes de tocarlo**:
> `recalcular()` lee el descuento POR CUENTA y no por orden — sin propagarlo, la promoción habría
> desaparecido en el caso MÁS COMÚN, pedir la cuenta única. Se propaga en `pedirCuenta()`/`unificar()`
> (copia directa) y en `dividirPorItems()` (reparto proporcional, resto a la última cuenta). ⚠️ **Dos
> límites declarados**: el reparto por ítems no es exacto al plato que ganó la promoción si el
> alcance era parcial, y una promoción de alcance ítem/categoría **no alcanza a un combo** (tiene
> `combo_id`, no `menu_item_id`) — alcance «total» sí funciona, y es el que usa el happy hour.
> **El menú QR** (F5-3, de solo lectura): mismo patrón «hablador» que `ConsultaPublicaController` —
> sin login, `sinScopeEmpresa()` + filtro explícito por `company_id` Y `empresa_id`, solo lo marcado
> `visible_qr` (columna de F0-1 sin consumidor hasta ahora), cache de 60s **por token** (nunca se
> filtra ni se pisa entre empresas) y `throttle:60,1`. Las promociones vigentes se anuncian con la
> MISMA `Promocion::vigenteEn()` de F5-2 — si el menú calculara su propia vigencia, el cliente podría
> ver un happy hour en el QR que la comanda no aplicara. ⚠️ **QR-2 (ordenar desde la mesa) queda
> DIFERIDA por decisión explícita**: es la primera superficie de ESCRITURA pública del vertical
> (disponibilidad en tiempo real, anti-spam por mesa/token, confirmación humana antes de cocina) y
> amerita su propia fase, no una tarea de última hora de una fase de lectura.
> ⚠️ **El único fallo real de la fase lo encontró la guarda transversal `AnclaFechaTest`, no una
> revisión de negocio**: un test nuevo (`RestauranteMenuPublicoTest`) usaba `now()->subMonth()` sin
> anclar para simular un combo vencido — sin ningún motivo semántico para que fuera «hace exactamente
> un mes» en vez de 35 días atrás. Corregido a `subDays(35)` en `[REST-FIX-2]`, sin anclar toda la
> suite de Restaurante (que sí depende del reloj real en otras pruebas, como el propio happy hour).
> Detalle, las 6 discrepancias y los 2 TODOs en `app/zyntello-app/DISCREPANCIAS-restaurante.md` →
> «FASE 5». **Reglas nuevas: el precio de un combo es el que se configuró, nunca la suma de sus
> componentes · un fijo consume siempre, uno de elección solo si está en lo elegido · cuando dos
> servicios comparten un total hay que leer el código de AMBOS antes de asumir dónde vive el número ·
> dividir y volver a unir una cuenta no puede borrar un descuento ya aplicado · un descuento de
> alcance parcial se reparte por PESO, no se pierde · el menú público y el motor de promociones
> evalúan la MISMA vigencia · una superficie de ESCRITURA pública nueva no es una tarea de última
> hora de una fase de lectura.**

> **RESTAURANTE FASE 4 — RECETAS, COSTEO E INGENIERÍA DE MENÚ (2026-08-04) — `[REST-F4-1]`–`[REST-F4-4]`
> + cierre `[REST-F4]`**: F3 dejó el vertical cobrando y descontando insumos, pero **no había dónde
> escribir la receta** — `MenuItemController` decía «una receta» en su docblock y su código no guardaba
> ni una línea, así que el escandallo solo se podía cargar por SQL y el costo del plato (la mitad de la
> decisión del precio) no existía en pantalla. **88 pruebas de la fase** (23 del escandallo, 26 de
> costos y márgenes, 20 de la ingeniería de menú, 17 de la variancia, aceptación con **47 aserciones**);
> **suite Restaurante 398**; **regresión completa VERDE: 2607 passed, 4 skipped, 0 failed (23 592
> aserciones)**; **57 reglas verificadas VIOLÁNDOLAS: las 57 se detectan.**
> ⚠️ **La discrepancia que ordenó la fase: F3-4 había PROHIBIDO en el código el costo teórico que F4
> pide en tres de sus cuatro tareas.** `RecetaService` decía que sería «un segundo número que responde
> la misma pregunta que `costo_real`». **No es la misma pregunta**: el real contesta «¿cuánto costó ESTA
> venta?» y se sella; el teórico, «¿cuánto DEBERÍA costar según la receta y los costos de hoy?» — la
> única que se puede contestar ANTES de vender y por tanto la única con la que se fija un precio. Un
> plato nuevo no tiene costo real y aun así hay que ponerle precio; y que el teórico cambie cuando sube
> la harina **es la señal** de erosión del margen, no su defecto. El teórico se DERIVA y el historial
> se GUARDA, porque el costo de una fecha pasada no se puede volver a calcular.
> **El escandallo** (F4-1): ⚠️ la conversión de unidades **no se reimplementa** —el conversor de F3-4
> pasa a público—, o la variancia de F4-4 mediría la diferencia entre dos conversiones en vez de la
> merma. Cascada del costo declarada: promedio de la bodega **del módulo** → costo estándar del catálogo
> → nada, y entonces 0 con el insumo **nombrado**. ⚠️ **`articulo_id` era una columna sin formulario**
> desde F0-1 (el ítem retail no se podía configurar aunque el controlador lo validara) y su validación
> **aceptaba artículos de otro suscriptor**. ⚠️ Y dos defectos evitados de la familia «un campo ausente
> no es un campo vacío»: sin Inventario el editor no se renderiza, y sin un marcador explícito guardar
> el ítem habría **borrado el escandallo completo en silencio**.
> **Los márgenes** (F4-2): la sugerencia es **margen sobre venta y no markup** (con objetivo 70 %, el
> markup daría 170 en vez de 333.33 y dejaría un margen real del 41 %), y ⚠️ **el redondeo va HACIA
> ARRIBA** porque abajo incumpliría en silencio el objetivo que la sugerencia garantiza. ⚠️ **Sin margen
> mínimo nada está bajo mínimo y el mensaje lo DICE** —un default pondría media carta en rojo, pero
> callarse se leería como «tu carta está bien»—. ⚠️ **El ítem retail costaba CERO** y aparecía con margen
> 100 %, la ilusión de `[CW-F4-1]`. ⚠️ Y el costeo de la carta **no es `costoTeorico()` en un bucle**:
> con 200 platos serían más de mil consultas (el N+1 de `[PRE-F4-1]`).
> **La ingeniería de menú** (F4-3): la **metodología de Kasavana & Smith está escrita EN EL CÓDIGO** y
> sus umbrales se muestran y se exportan — sin ellos nadie puede saber por qué un plato cayó en un
> cuadrante. Popularidad al **70 % de la cuota esperada** (la media pelada dejaría a media carta como
> impopular por definición) y rentabilidad **EN DINERO** (una bebida con 80 % de margen aporta 80; un
> plato con 40 %, 240 — lo que paga la nómina son pesos), con el promedio **ponderado** por unidades.
> Cada cuadrante trae su acción y son distintas: al caballo se le baja el COSTO, al puzzle se le
> PROMUEVE, y solo el perro sale de la carta. Se excluyen las **cortesías**: un plato regalado veinte
> veces parecería popular y ruinoso a la vez.
> **La variancia** (F4-4): ⚠️ **las tres columnas miden cosas distintas** y la pantalla lo explica antes
> de la tabla — teórico, registrado y **conteo físico**, que es la única que encuentra la merma no
> registrada. ⚠️ **Y de ahí el aviso más importante: sin toma física la merma NO se puede medir**,
> porque el consumo automático descuenta exactamente el teórico y la variancia sale 0 por construcción;
> una tabla de ceros se leería como «todo cuadra». ⚠️ El teórico **no reimplementa la explosión** (si no
> contara los modificadores, el reporte acusaría de robo a quien vende hamburguesas con queso de más) y
> ⚠️ **el criterio de «qué es una venta» dejó de estar duplicado**: F4-3 tenía su copia y **se borró**.
> ⚠️ **Lo que encontró la ACEPTACIÓN es el hallazgo más fino: dos redondeos correctos dejan un residuo.**
> El costo del plato redondea **una unidad** y el consumo del período redondea el **total** — 0.0011 lb
> de diferencia que **habría aparecido en el reporte de variancia como si fuera merma**. No entra, pero
> queda **medido y fijado** con una aserción.
> ⚠️ **TRES pruebas propias pasaban por la razón equivocada**: el orden de la ingeniería (`usort` es
> **estable** en PHP 8 y el `GROUP BY` no tenía `ORDER BY` — **cuarta vez** en el vertical), el orden de
> la variancia (fixture cuyo orden **alfabético** coincidía con el esperado) y el criterio de ventas
> (filtro de estado **redundante** con el de fecha, la trampa que F3 documentó). Más una violación mal
> diseñada que era mi error y no de la prueba.
> ⚠️ **El golden master NO avisó esta vez**: F4 no tenía hueco declarado (F1, F2 y F3-4 sí, y avisó las
> tres veces). Se le añadieron sus aserciones al cerrar, incluidas **tres que exigen que las funciones
> compartidas sigan siéndolo**.
> Ayuda de las 4 pantallas nuevas documentada. Detalle, las 6 discrepancias y los 7 TODOs en
> `app/zyntello-app/DISCREPANCIAS-restaurante.md` → «FASE 4». ⚠️ Migración `2026_08_04_520001`.
> **Reglas nuevas: «cuánto costó» y «cuánto debería costar» son dos preguntas distintas · un margen se
> mide EN DINERO cuando hay que decidir entre platos · el promedio de un umbral va ponderado · un precio
> sugerido se redondea hacia ARRIBA · `usort` es estable en PHP 8 (cuarta vez) · un fixture cuyo
> resultado correcto se alcanza por dos caminos no verifica ninguno · un reporte que no puede medir lo
> que promete tiene que DECIRLO · los umbrales de un reporte se muestran y se exportan · dos redondeos
> correctos en sitios distintos dejan un residuo que hay que medir, o aparecerá en un reporte de merma
> como si fuera una pérdida.**

> **RESTAURANTE FASE 3 — EL COBRO (2026-08-04) — `[REST-F3-1]`–`[REST-F3-4]` + cierre `[REST-F3]`**:
> F2 dejó la cocina cantando turnos y **no había forma de cobrar la mesa**: el vertical tomaba
> comandas, las preparaba, y ahí terminaba. Ahora se cobra, el comensal recibe su comprobante, el
> mesero cobra su propina y el almacén se descarga. **112 pruebas de la fase** (41 del cobro, 32 del
> comprobante, 15 de propinas, 22 del consumo, aceptación con **51 aserciones**); **suite Restaurante
> 307 pruebas**; **55 reglas verificadas VIOLÁNDOLAS: las 55 se detectan.**
> **El ANEXO B otra vez distinto de lo escrito, y dos hallazgos decisivos**: `FacturacionEmisionService`
> **ya acepta y contabiliza la propina legal** (`[FACT-F2-3]`), así que Restaurante no implementa una
> sola línea de lógica fiscal de propina; y `LoteService::lotesDisponibles()` **ya ordena FEFO**, así
> que el consumo no reimplementa el criterio. Lo único que existía sin usarse era
> `inv_conversiones_unidad`: la tabla y su modelo estaban desde Inventario y **nadie convertía nada**
> — F3-4 es su primer consumidor del ecosistema.
> **El cobro** (F3-1): división por personas, ítems o montos, con el **resto de centavos a la última
> cuenta y no repartido** —repartirlo haría que la suma de las cuentas no diera el total de la mesa y
> el arqueo cerraría con un descuadre que nadie sabe explicar—. ⚠️ Limpiar una división usa
> `forceDelete`: `rest_cuentas` tiene SoftDeletes y su UNIQUE **no incluye `deleted_at`**, así que
> re-dividir chocaba con «Duplicate entry». Y `rest_pagos.monto` guarda lo **ENTREGADO**, no lo
> aplicado: es lo que el cajero recibió en la mano, y el cuadre real es «entregado − vuelto».
> **El comprobante** (F3-2): ⚠️ **los dos catálogos fiscales del core no coinciden** —
> `tiposNcfRD()` no tiene «Consumidor Final» y `loc_fiscal_document_types` sí—, así que las opciones
> salen de los **consecutivos NCF reales de la empresa** con la descripción que escribió su contador:
> cero lógica fiscal propia y multi-país gratis (en VE no hay consecutivos, no se pregunta). La
> validación es del **SERVIDOR**: un crédito fiscal sin RNC se emite igual si nadie lo comprueba, y
> el error aparece meses después cuando la DGII rechaza la línea del 607 y el cliente descubre que no
> puede deducir una factura que ya pagó. ⚠️ **El defecto más caro de la fase: el ticket interno
> consumía un NCF de CRÉDITO FISCAL** — la cascada del core cae a `'FAC'` sin tipo, así que una venta
> declarada no fiscal gastaba un número de la secuencia autorizada por la DGII, un recurso limitado y
> auditado, **sin avisar**: la secuencia se agota antes de lo previsto y nadie puede decir en qué se
> fue. Y el **alta rápida de cliente** existe porque el comensal pide el crédito fiscal EN LA MESA:
> mandar al cajero al módulo de Clientes a mitad del cobro termina con la factura saliendo a
> consumidor final «para no hacer esperar», y el cliente pierde su deducción.
> **Las propinas** (F3-3): ⚠️ **la legal la asienta Facturación y el vertical solo la voluntaria** —
> asentar las dos registraría el pasivo dos veces y **nunca llegaría a cero**—, y la voluntaria va
> contra **PASIVO, nunca contra ingresos**: ahí se convertiría en venta del restaurante, con ventas
> infladas, impuesto sobre dinero ajeno y un gasto que al repartirla no cuadra con nada. El acumulado
> del mesero **se DERIVA mientras está pendiente y se CONGELA al liquidarse** (recalcular una
> liquidación pagada reescribiría lo que el mesero ya recibió en la mano), se lee de las CUENTAS y no
> de la cabecera, y la fecha es la del **COBRO**: una mesa que se sienta a las 23:40 y paga a las
> 00:15 es del turno siguiente, y es a ESE mesero a quien se le entrega el dinero.
> **El consumo** (F3-4): ⚠️ **se consume al COBRAR, no al enviar a cocina** —si el stock saliera al
> mandar la comanda, una comanda anulada dejaría el almacén descontado por un plato que nadie preparó
> y el descuadre solo saldría en el conteo físico— y ⚠️ **cuando la ORDEN se CIERRA, no por cuenta**:
> en una mesa dividida en tres, los insumos son de la mesa entera. ⚠️ **Va FUERA de la transacción del
> cobro**: si fallara dentro, el rollback se llevaría el COBRO y el dinero ya está en la gaveta. El
> costo se **SELLA** con lo que salió, no con el promedio de hoy —que cambia con la siguiente compra y
> con él cambiaría el margen de una venta ya cerrada—; una línea sin insumos sella **0** y no null (un
> servicio cuesta cero de verdad); y **una cortesía también consume**: regalar el plato no devuelve el
> queso a la nevera. ⚠️ **Sin conversión declarada NO se adivina el factor**: la receta dice «250 g» y
> el artículo está en kg, así que descontar 250 sacaría 250 KILOS de harina — se deja sin descontar y
> **se NOMBRA el insumo**. ⚠️ **Sin Inventario contratado la venta fluye igual**, y sin bodega no se
> inventa una.
> ⚠️ **El defecto que encontró la ACEPTACIÓN es el que más lejos llegaba: `cobrar()` DOCUMENTABA
> `tipo_ncf` y `sin_comprobante` como opciones y el cuerpo las IGNORABA.** Solo funcionaba porque el
> controlador las escribía en la cuenta antes de llamar; el siguiente llamador —el reparto de F6, un
> seed, el POS— las habría pasado creyendo que servían y **la factura habría salido con el comprobante
> equivocado sin avisar**. Es la forma de `CajaService::sesionAbiertaParaEmpresa` que `[PRE-FIX-1]`
> documentó: una firma que promete lo que el cuerpo no aplica.
> ⚠️ **CINCO pruebas propias pasaban por la razón equivocada, y las cinco por lo mismo — el mismo
> resultado observable llegaba por otro camino**: una inyección que cambiaba el `concepto_clave` sin
> tocar la cuenta dejaba **el asiento idéntico** (la violación no era una violación); la de la fila en
> cero salía antes por otra guarda; la de las cuentas cobradas cobraba las DOS, así que no quedaba
> ninguna abierta; la de «sin bodega» daba el mismo resultado porque la base rechazaba el movimiento y
> el rollback dejaba cero movimientos con un aviso que también decía «bodega»; y la idempotencia la
> protegía **el UNIQUE de MySQL**, no la guarda de código (`[CW-FIX-3]`). Más **tres defectos de
> método**: la prueba del orden comparaba ejecuciones seguidas y sin empate montado; la de la línea
> anulada ordenaba por `created_at` con dos filas del mismo segundo y anulaba la equivocada, **dando
> 90 en vez de 98 y pareciendo un defecto del consumo**; y **el helper `cliente()` del TestCase pone
> un RNC por defecto**, así que el «Consumidor Final» de la aceptación tenía identificador fiscal y la
> guarda del crédito fiscal **no se ejercía**.
> **Y una guarda declarada y NO verificada, con su motivo en el código**: el filtro `estado =
> 'cobrada'` es hoy redundante con el de fecha —el ENUM solo admite `abierta`/`cobrada`, así que no
> existe fila con `cobrada_en` puesto y otro estado— y quitar solo uno deja la prueba verde (forma de
> `[PRE-F1]`). Se conserva para el día que se agregue anular una cuenta ya cobrada.
> **El golden master de F0-0 volvió a avisar, TERCERA vez** (tras F1-1 y F2-1): exigía que
> `RecetaService` no existiera y falló en cuanto se creó.
> Ayuda de las 2 pantallas de impresión documentada. Detalle, las 5 discrepancias y los 6 TODOs en
> `app/zyntello-app/DISCREPANCIAS-restaurante.md` → «FASE 3». ⚠️ Migración `2026_08_03_510001` (F3-1).
> **Reglas nuevas: una firma que documenta un parámetro y lo ignora es peor que no tenerlo · una
> violación tiene que cambiar el COMPORTAMIENTO, no solo el código · cuando dos guardas excluyen las
> mismas filas, quitar una deja la prueba verde (se declara, no se finge) · una guarda que evita el
> INTENTO se prueba por su mensaje · el costo de una venta cerrada se SELLA · se consume al cobrar y
> al cerrar la orden · un fallo de inventario no puede deshacer una venta · sin factor de conversión
> NO se convierte · una fábrica de pruebas que rellena datos por comodidad puede desactivar la regla
> que se quiere verificar.**

> **RESTAURANTE FASE 2 — LA COCINA (2026-08-03) — `[REST-F2-1]`–`[REST-F2-3]` + cierre
> `[REST-F2]`**: F1 dejó al mesero mandando la comanda a cocina, pero **la cocina no tenía dónde
> verla** — el turno se asignaba y no lo cantaba nadie. **47 pruebas de la fase** (44 del KDS, la
> aceptación con **53 aserciones**); **regresión completa VERDE: 2407 passed, 4 skipped, 0 failed
> (22 925 aserciones)**, corrida con el árbol quieto. **Sin migraciones**: las 20 tablas de F0-1 ya
> traían `estado_kds`, `lista_en`, `servida_en`, `anulada_motivo`, `es_adicion` y el índice
> `idx_rest_lineas_kds`, escrito para exactamente esta consulta.
> **El ANEXO B otra vez distinto de lo escrito**: cuatro de seis dependencias YA existían (el
> componente de pantalla completa de `[CW-F2-1]`, los dos campos de `rest_config` de F0-1 y los
> cuatro permisos exactos de la sección `cocina` de F0-2). Lo único que no existía en TODO el
> ecosistema era **cualquier uso de audio**: cero `new Audio`, cero `AudioContext`.
> **La pantalla** (F2-1): el TURNO es lo más grande porque es lo que se grita al pase, la tarjeta
> entera avanza la comanda y los controles de dentro llevan `.stop` (`D-CW-F2-3-2`). ⚠️ **El v2
> pide dos cosas que no encajan solas** —«tarjeta = orden» y «columnas por estado»—: una comanda
> con la sopa lista y el filete sin empezar no está en ninguna columna. Se resuelve como
> `[CW-F3-1]` resolvió el taller: **el estado fino se DERIVA al grueso y manda la línea MENOS
> avanzada**; tomar la más avanzada la pintaría «lista» y el mesero iría a recoger un plato que no
> existe. ⚠️ **Aquí la lista SÍ se reconstruye, al revés que el mapa de salón**: las mesas son
> fijas, las comandas ENTRAN y SALEN — lo que evita el parpadeo es que Alpine reconcilie por
> `:key`, no dejar de renderizar; avisar «pulse actualizar» obligaría al cocinero a tocar la
> pantalla para ver la comanda que acaba de entrar. ⚠️ Y **la cola no se filtra por fecha sino por
> orden ABIERTA**: con «turno de hoy», en un local que cierra a las 2 a.m. la comanda que está en
> la plancha a las 23:59 **desaparecería al dar las 00:00**, con el plato a medio hacer. El
> cronómetro cuenta desde `enviada_en` (a la cocina no le importa hace cuánto se sentó la mesa) y
> el ámbar salta al **70 % del umbral**, porque un ámbar que apareciera en el mismo minuto que el
> rojo no avisaría de nada. Cierra el hueco que F1 dejó escrito: **anular con motivo** una línea ya
> enviada — no se borra, sale en la banda roja, o el cocinero seguiría preparando un plato que
> desapareció de la comanda. Y los platos **sin estación se NOMBRAN**: no salen en ningún KDS, y
> sin el aviso el síntoma es «el plato no llega» y nadie da con la causa.
> **SERVIDA** (F2-2): ⚠️ marca **solo los platos LISTOS**, nunca los que siguen en la plancha —
> marcar la comanda entera daría por servido un filete que el cocinero está haciendo, el plato
> desaparecería del KDS y la mesa esperaría algo que el sistema da por entregado. ⚠️ **La política
> se valida en el SERVIDOR y no escondiendo el botón**, y el costo no es solo de control:
> `servida_en` significa «salió por la ventana» o «llegó a la mesa» según la política, así que si
> los dos actores pudieran escribirla el reporte de F8 mediría dos cosas mezcladas sin que nadie lo
> notara. Reabrir devuelve a `listo` y no a `pendiente` (está hecho, no vuelve a la plancha).
> **Los contadores de la tarjeta de mesa se actualizan solos en las dos políticas, y no hay una
> línea de código para eso**: se derivan de `estado_kds` desde F1-1.
> **Expeditor y sonido** (F2-3): la cola general marca **cada plato con su estación** —sin eso el
> que coordina no sabe a quién reclamarle el que falta— y va aparte, porque un cocinero que entrara
> vería trabajo que no es suyo. ⚠️ **Primer audio del ecosistema**: tono **generado**, no un
> archivo (un 404 dejaría la pantalla muda sin avisar); el botón **es** el gesto que desbloquea el
> audio, y la preferencia se lee pero no lo activa sola porque un botón encendido y mudo miente
> sobre su estado; las comandas del primer render se marcan vistas (o abrir la pantalla soltaría
> seis pitidos); y el aviso **compara ids, no cantidades** —si entra una y sale otra servida el
> total no cambia y el pitido se perdería—. Los dos requisitos del director técnico para el polling
> quedan con prueba: **throttle** y **select mínimo**.
> ⚠️ **3 defectos propios, y los dos que más enseñan son de MÉTODO**: (1) **el verificador no
> verificaba nada** — `--filter` con la etiqueta que imprime Pest no matchea ningún método y
> `artisan test` **sale con código 0 cuando no encuentra pruebas**, así que las 9 violaciones se
> leyeron como «la prueba pasa con el defecto puesto» (verificación imaginaria de `[PRE-FIX-1]`,
> esta vez dentro del propio verificador); y (2) al corregirlo salió que **la prueba del orden
> pasaba con el desempate quitado**, por partida doble: comparaba tres ejecuciones seguidas (MySQL
> da el mismo plan) y encima `usort` es **estable** en PHP 8, así que dependía de los UUID y salía
> bien **la mitad de las veces** — intermitente además de inútil. **24 reglas verificadas
> violándolas: las 24 se detectan.**
> **El golden master de F0-0 volvió a avisar** (segunda vez, tras F1-1): exigía que
> `restaurante.kds` NO existiera y falló en cuanto se creó la ruta.
> Ayuda de las 2 pantallas nuevas documentada. Detalle, las 7 discrepancias y los 6 TODOs en
> `app/zyntello-app/DISCREPANCIAS-restaurante.md` → «FASE 2».
> **Reglas nuevas: un verificador que corre la prueba equivocada informa lo mismo que uno que no la
> corre · una prueba de orden que compara ejecuciones seguidas puede pasar además por el orden de
> los UUID (intermitente, no solo inútil) · el estado grueso se DERIVA del fino y manda el MENOS
> avanzado · una lista que cambia se re-renderiza: lo que evita el parpadeo es la clave · un filtro
> por fecha en una pantalla de operación falla a medianoche · una política que cambia el SIGNIFICADO
> del dato se valida en el servidor · una acción masiva actúa solo sobre los estados que
> corresponden · un aviso sonoro compara identidades, no cantidades.**

> **RESTAURANTE FASE 1 — SALÓN Y COMANDAS (2026-07-31) — `[REST-F1-1]`, `[REST-F1-3]`, `[REST-F1-4]`
> + cierre `[REST-F1]`**: F0 dejó el vertical instalable pero **no se podía tomar una comanda**.
> Ahora sí: mapa de salón con tarjetas vivas, comanda táctil y orden de mostrador. **94 pruebas de
> la fase** (31 del mapa, 46 de la comanda, aceptación con **76 aserciones**); **regresión completa
> del ecosistema VERDE: 2351 passed, 4 skipped, 0 failed (22 651 aserciones)**. **Sin migraciones**:
> las 20 tablas de F0-1 ya traían `turno`, `turno_fecha`, `es_adicion`, `enviada_en`, `servida_en` y
> `mesa_id` nullable.
> **El mapa** (F1-1): la tarjeta ENTERA es el botón —mesa libre abre y lleva DIRECTO a comandar, mesa
> ocupada entra a su cuenta— y los controles de dentro llevan `.stop` (sin él, tocar «⋯» abriría
> además la comanda, el defecto de `D-CW-F2-3-2`). ⚠️ **El refresco actualiza NÚMEROS, no HTML**, y
> **la firma es de la ESTRUCTURA, no de los datos**: si cambiara con cada plato, la grilla se
> reconstruiría cada 10 segundos, la pantalla saltaría y perdería el foco de quien escribe — hay una
> prueba de que agregar platos NO la cambia. Los minutos NO viajan en el JSON: los lleva el navegador
> desde `abierta_en`, porque incluirlos haría que la respuesta cambiara cada segundo. Los contadores
> se **DERIVAN** (una prueba anula una línea y el contador baja solo, regla de `[CW-F4-2]`), y
> `SalonService` es fuente única del mapa, del endpoint y de los KPIs — pedirlos aparte haría que la
> cabecera dijera «5 ocupadas» con 6 tarjetas naranjas (`[BAN-F4-4]` en una sola pantalla).
> **La comanda** (F1-3): ⚠️ **es AJAX porque con un POST por plato cada toque recarga la página** —
> la carta vuelve al principio y el mesero pierde el scroll; en una mesa de seis son 15 recargas y el
> pedido acaba en papel. Un ítem sin modificadores se agrega DIRECTO (v2 §5.2). El histórico es
> inmutable (snapshot de nombre, precio y modificadores), los modificadores **se validan en el
> SERVIDOR** —solo viajan ids, o bastaría manipular el formulario para cobrar el extra a cero— y un
> modificador de un grupo que no aplica al ítem **se descarta**. El **turno se asigna en el PRIMER
> envío** y no cambia después: tres números para una mesa harían que el cliente no supiera cuál es el
> suyo. **Enviar manda solo lo nuevo** (`enviada_en IS NULL`, no el estado). Lo ya enviado no se
> borra: se anula con motivo en F2.
> **Mostrador** (F1-4): `mesa_id` nullable, misma pantalla, y ⚠️ **la MISMA cola de turnos que las
> mesas** — la cocina tiene una lista, y numerar aparte haría que dos comandas se cantaran como
> «turno 3» el mismo día. Sin turno todavía se muestra un guion, no un cero.
> **F1-2 no tiene commit propio, y eso es lo correcto**: `<x-pantalla-completa>` existe desde
> `[CW-F2-1]`, donde Car Wash lo creó «para que Restaurante lo herede». Se reusa en las tres
> pantallas con su clave; dos pruebas impiden la copia.
> ⚠️ **7 defectos propios, y el que más enseña lo encontró la ACEPTACIÓN**: la tarjeta decía
> **«3 pendientes» con la cocina VACÍA** —una línea nace en `pendiente` pero sin `enviada_en`—, así
> que el mesero habría creído que su comanda salió, el plato no llega y nadie relaciona el reclamo con
> un contador (forma de `[PRE-FIX-1]`). Separado en `pendientes` (lo que debe la cocina) y
> `sin_enviar` (lo que debe el mesero). También: ⚠️ **`abrirMesa` no comprobaba que la comanda viva
> fuera DE ESA MESA** (tocar la mesa 4 abría la cuenta de la 7 y los platos se cobraban a otra gente)
> y ⚠️ **`Orden::delivery()` estaba invertida** desde F0-1 —`belongsTo` con las claves cruzadas—: al
> leer funcionaba por casualidad y `associate()` habría escrito el `orden_id` del delivery **dentro de
> la clave primaria de la orden**; corregido a `hasOne` aunque el reparto sea F6.
> ⚠️ **Defecto de F0-3 corregido aquí**: `gruposModificadores` **no era usable con `attach()`** — el
> pivote tiene `id`/`company_id`/`empresa_id` NOT NULL y F0-3 los llenaba a mano dentro del
> controlador, así que el siguiente llamador chocaba con un error de MySQL que no apunta a la causa.
> Ahora hay una puerta única (`MenuItem::vincularGrupos()`) y **se borró la copia**.
> ⚠️ **Dos notas de método, declaradas**: (1) **la regresión del paso previo se corrió mientras se
> tocaba el código** —vale para saber que nada ajeno estaba roto, pero no cumple lo que el blueprint
> pide; se repitió al cerrar con el árbol quieto—; y (2) **otra sesión trabajaba en el mismo módulo**
> (`[REST-F0-5]`), lo que produjo un **deadlock de MySQL** en `rest_ordenes` (dos suites con
> `lockForUpdate()` sobre la misma BD de testing) y rojos de pruebas ajenas a medias que **no se
> tocaron**; `git add` fue archivo por archivo.
> Ayuda de las 3 pantallas nuevas documentada (el archivo de ayuda dejaba escrito que las de
> operación se documentan al entregar cada fase). Detalle, las 6 discrepancias y los 4 TODOs en
> `app/zyntello-app/DISCREPANCIAS-restaurante.md` → «FASE 1».
> **Reglas nuevas: un contador de trabajo pendiente tiene que decir DE QUIÉN es el pendiente · la
> firma de un refresco diferencial es de la ESTRUCTURA, no de los datos · lo volátil se pinta en el
> cliente y lo que no cambia, en el servidor · un pivote con columnas NOT NULL propias no es usable
> con `attach()` · `sortByDesc` es estable en PHP 8 (el desempate va en la consulta) · una relación
> invertida funciona al leer y corrompe al escribir · la regresión del paso previo se corre con el
> árbol quieto · con sesiones paralelas, un rojo se confirma corriendo el archivo solo.**

> **AYUDA DE TODO EL ECOSISTEMA + 7 PANTALLAS QUE NO COMPILABAN + LOS 14 ROJOS DE PRESTAMELLO
> (2026-07-31) — `[REST-AYUDA-1]`, `[REST-FIX-1]`, `[FIX-VISTAS]`, `[PRE-FIX-2]`, `[AYUDA-2]`**:
> pedido del director técnico — *«agregar la ayuda para todo el módulo con tooltips de todo y
> actualización de la ayuda en todos los módulos»* y, al ver los rojos, *«corrige lo que está en
> rojo aunque no sea de esta sesión, toca los otros módulos… resuelve compras»*.
> **80 pantallas documentadas** (11 del vertical + 69 de los 6 módulos que no tenían nada) y
> **41 tooltips**, verificando que **resuelven a un texto real** y no solo que la etiqueta está
> puesta: cero mudos. ⚠️ **Condominios estaba HUÉRFANO** —13 pantallas escritas y sin registrar,
> así que el Centro de Ayuda no lo mostraba: trabajo hecho e invisible—. **La causa de raíz era
> que la ayuda no tenía ni una sola prueba**; ahora `AyudaIntegridadTest` cubre los 25 módulos y
> `DEUDA_DE_DOCUMENTACION` queda en **cero**. ⚠️ Dos trampas del reparto por prefijo:
> **ConstructFlow no usa el prefijo `constructflow.`** (es la app original: sus rutas son
> `projects.*`, `board.*`, `cards.*`) y **`reportes.` lo COMPARTEN todos los módulos** —de las
> ~300 rutas `reportes.*` solo **21** son del generador; documentar las 300 ahí habría enterrado
> el generador y puesto la ayuda de cada módulo lejos de donde se busca.
> ⚠️ **7 PANTALLAS DE 3 MÓDULOS NO COMPILABAN, con la suite en VERDE** porque ninguna prueba las
> renderizaba. **La directiva `@json` hace `explode(',')` y descarta a partir de la 3ª coma**: con
> dos comas reconstruye por casualidad, con tres o más deja un corchete sin cerrar — invisible
> hasta que alguien agrega el cuarto campo. Afectaba a 5 pantallas del vertical y a
> **`compras/carga-ia/revisar`**, la pantalla de **revisión humana obligatoria de las facturas
> leídas por IA**: con la única pantalla de aprobación caída, la función completa de `[COM-F1]`
> quedaba inutilizable. Y en la APK de Events, **`@error` de Alpine** (atajo de `x-on:error`) se
> interpretaba como la directiva Blade `@error` y abría un `if` que nunca cerraba — la trampa de
> `[CW-FIX-3]` en un sitio nuevo. **La guarda compila las 1285 vistas del repositorio** (con
> `nikic/php-parser` en proceso, no `php -l`) y detecta además la **pérdida silenciosa de datos**;
> ⚠️ tuvo un falso positivo antes de quedar: acusaba a cinco partials que documentan su firma en
> un comentario Blade — el error de `[REST-F0]` **al revés**, allí el comentario dejaba pasar la
> prueba y aquí la hacía fallar.
> ⚠️ **LOS 14 ROJOS DE PRESTAMELLO ERAN DE FECHA: la suite era roja 7 días al año.** La regresión
> del **30** dio 2 rojos; la del **31**, catorce, sin un solo archivo del módulo modificado.
> **Carbon no trunca al restar meses: DESBORDA hacia adelante** — desde el 31 de julio,
> `subMonths(1)` cae el **1 de julio (el mes en curso)**, y `subMonths(2)`/`subMonths(3)` caen
> **ambos en mayo**, igual que `(4)` y `(5)` en marzo: dos escenarios que la prueba cree de meses
> distintos se agrupan juntos, y eso es lo que rompía las cosechas. Anclado el «ahora» al **día
> 15** en el `TestCase` (desde ahí `subMonths` nunca desborda) y limpiado en `tearDown` porque es
> global al proceso → **454 passed, 0 failed**. La guarda simula los **31 días posibles** en meses
> de 31, 30 y 28 días más un febrero bisiesto. ⚠️ **Deuda declarada, no corregida**: **Activos**
> (5 archivos) y **Bancos** (2) usaban `subMonths` sin anclar. **CERRADA el mismo dia en
> `[FECHA-FIX]` `c7d2588b`**, y al abrirla resulto peor de lo estimado: ⚠️ **mi propio barrido
> tenia un hueco** —busco `subMonths` en PLURAL y se perdio tres archivos con el SINGULAR
> `addMonth()`, dos de ellos los peores del lote porque ahi el mes **es el dato**:
> `ReactivarBajaTest` lo usa para el **periodo contable** y `BancosConceptoExtractoTest` para el
> **periodo de la conciliacion** (desde un 31 de enero, `addMonth()->month` da **marzo** en vez
> de febrero). Total **10 archivos en 3 suites**. Y ⚠️ **las pruebas pasaban por la HOLGURA de
> sus umbrales, no por estar bien**: el comentario de la de Bancos dice «una cuenta con 8 meses
> sin conciliar» y desde el dia 31 eran 7. Lo que costo no fue anclar sino **poder** anclar:
> se verifico **por violacion** que las dos pruebas cuyo veredicto depende de un umbral siguen
> ejerciendo su regla (conciliacion 8→1 mes y poliza 10→400 dias: **las dos fallan**, o sea
> siguen protegiendo). Fuente unica en `AnclaFechaTestCase`, ⚠️ **NO en `HubTestCase`** —lo
> heredan decenas de suites y anclarlas en bloque es justo lo que puede dejarlas pasando sin
> probar—, y se **borro la copia** que `[PRE-FIX-2]` habia dejado en Prestamello. **848 passed.**
> **Sin migraciones en toda la sesion.**
> **Reglas nuevas: `@json` no acepta un array literal de más de tres elementos (usar `Js::from`)
> · el atajo de Alpine para un evento colisiona con toda directiva Blade que se llame igual (usar
> `x-on:evento`) · una vista que ninguna prueba renderiza puede estar rota con la suite en verde ·
> una guarda sobre vistas se hace COMPILANDO, no con un grep · Carbon DESBORDA al restar meses y
> dos restas distintas pueden colapsar en el mismo mes · el prefijo de ruta de un módulo no
> siempre es su slug · una prueba sin aserciones no protege de nada · un catálogo de ayuda sin
> prueba se degrada igual que un criterio verificado con grep.**

### Bitácora anterior (2026-07-30)

> **RESTAURANTE FASE 0 (2026-07-30) — `[REST-F0-1]`, `[REST-F0-0]`, `[REST-F0-2]`–`[REST-F0-4]` +
> cierre `[REST-F0]`**: arranca el vertical de gastronomía desde CERO. Estado previo verificado,
> no supuesto: **cero tablas `rest_*`, cero controladores, y `[REST-*]` nunca en el historial** —
> los dos blueprints de Restaurante llevaban escritos desde julio sin ejecutarse. Entrega la
> fundación: **20 tablas** con sus modelos, configuración por empresa con **checklist de tres
> severidades**, 7 conceptos contables en el hub, permisos por rol real (mesero/cocina/cajero/
> gerente), **asistente de 4 pasos**, 6 CRUD del catálogo, el componente compartido
> `<x-modal-persistente>`, **carta de ejemplo de 25 ítems** y el menú con accesos cross-module
> con candado. **Suite Restaurante: 56 pruebas** (no tenía ninguna).
> ⚠️ **Lo primero fue verificar el ANEXO B con `git log`, y TRES de cinco dependencias resultaron
> distintas — las tres porque YA EXISTÍAN**: `<x-menu-link-modulo>` lo creó Compras `[COM-F0-4]`,
> el componente de pantalla completa lo creó Car Wash `[CW-F2-1]` diciendo literalmente «para que
> Restaurante lo herede», y `[FACT-F2-3]` **sí está hecha**, así que `FacturacionEmisionService`
> ya acepta y contabiliza la propina legal → **Restaurante no implementa lógica fiscal de
> propina**, solo pasa el monto.
> **Cuatro discrepancias con el blueprint**: ⚠️ **su propio orden es imposible** (F0-0 exige
> probar tablas que crea F0-1); ⚠️ **las dos cuentas de propina legal TIENEN que ser la misma**
> que la de Facturación, o el pasivo se acumula en una y se cancela en otra y **ninguna llega
> nunca a cero**; ⚠️ **los accesos cross-module NO van en el sidebar** — no es organización:
> `ModuleMenu` reclamaría la ruta ajena y **el módulo dueño dejaría de abrirse**, que es lo que
> pasó en `[CND-FIX]` y volvió a pasar en `[CW-F0-5]`; y el candado **existía pero era un cartel
> mudo** (`<span>` con `title`, y **en una tablet del mostrador no hay hover**) — ahora abre un
> modal que dice qué hace el módulo que falta y lleva a Plan y Suscripción.
> **⚠️ 8 defectos propios, todos antes de commitear**, y los tres que más enseñan: (1) **una
> prueba mía pasaba con el defecto puesto** y al abrirla resultó que **la implementación
> equivocada era la mía** — los checkbox ausentes se apagaban, así que partir el formulario en
> secciones habría apagado el delivery en silencio (`D-BAN-F4-4-3`); (2) **clases dinámicas de
> Tailwind** (`bg-{{ $color }}-500/10`), que no se compilan y dejan el badge **gris sin avisar**
> (`[#992]`); y (3) ⚠️ **la prueba del modal fallaba por el comentario que documentaba su propia
> regla** — el reverso exacto de `[CW-F0-5]`, y el filtro se escribió con `/m` y NUNCA `/s`
> porque con `/s` se come el archivo y la aserción pasa siempre (`D-PRE-F1-5-2`).
> Detalle en `app/zyntello-app/DISCREPANCIAS-restaurante.md` (4 discrepancias, 13 decisiones de
> diseño y **6 TODOs de verificación humana**). ⚠️ Migraciones `2026_07_30_500001`–`500006`.
> **Reglas nuevas: un blueprint que dice «crear X» hay que verificarlo con `git log` · una prueba
> que analiza código fuente tiene que mirar CÓDIGO (el comentario que documenta la regla la rompe
> o la deja pasar) · un checkbox ausente no es un checkbox apagado · las clases de Tailwind no se
> construyen por concatenación · el menú de un módulo lista solo rutas de ese módulo (tercera vez)
> · un candado tiene que explicar.**

> **CAR WASH post-cierre (2026-07-29) — `[CW-FIX-3]`**: pedido del director técnico — *«al crear un
> turno no aparecen las marcas y modelos de vehículos… si el vehículo no está en la lista permitir
> escribirlo y que se guarde en las tablas correspondientes. Adicionalmente, mira el turno del
> cliente que tiene texto y el vehículo no se dibuja bien»* (con captura del turno CW-000007).
> ⚠️ **El texto de la captura era un comentario Blade ANIDADO**: Blade no soporta anidarlos —busca el
> primer `--}}` y cierra ahí—, así que el cierre del interno cerraba también el externo y **la
> documentación del componente se imprimía como TEXTO en las 10 pantallas** donde se muestra un
> vehículo, **incluido el ticket que el cliente se lleva**. Llegó hasta producción porque **no lanza
> excepción**: el HTML sigue siendo válido, solo tiene párrafos de más, y las pruebas afirmaban que la
> imagen aparecía — que era cierto. ⚠️ **Y la misma clase de trampa dos veces más**: Blade procesa la
> sintaxis `<x-...>` **también dentro de un `<script>` y dentro de un comentario JS**, así que
> documentar un método nombrando el componente hizo que intentara renderizarlo a mitad del
> JavaScript; la vista falló con «unexpected end of file, expecting endif» —un mensaje que no apunta
> a la causa— y la segunda vez, ya movido al layout, **rompía TODAS las vistas de la aplicación**.
> Localizado compilando prefijos de 1..N líneas hasta dar con la primera inválida.
> **El catálogo** (`cw_marcas` + `cw_modelos`): el modelo guarda su **tipo de vehículo sugerido**, y
> eso corrige la silueta —«Corolla» propone AUTOMÓVIL y el turno deja de mostrar una guagua
> amarilla—; lo que **no está se escribe y se crea al guardar**, porque atender un vehículo no puede
> depender de que alguien complete un catálogo primero con el carro esperando en la puerta; y el
> vehículo **conserva marca y modelo como TEXTO** además de los ids, ya que los que existen no tienen
> id y la imagen se resuelve por texto — sin esa columna **todos los carros del cliente habrían
> perdido su miniatura al desplegar**. **Un componente para los cuatro formularios**, no cuatro
> copias (regla de `D-CW-F1-3-1`, con prueba: en este vertical ya divergieron tres veces), y la
> pantalla del catálogo por la regla de `[CW-FIX-2]` —*una tabla sin pantalla es una función que no
> existe*— con 27 marcas y 162 modelos RD cuya siembra cruza el tipo **por silueta y no por nombre**,
> porque los tipos los nombra cada lavadero («jepeta», «SUV», «camioneta»).
> **⚠️ Cuatro defectos propios, todos encontrados verificando**: la normalización llevaba un **mapa
> de tildes escrito a mano** y dejaba fuera todo lo demás («Citroën» → `citro n`, «Škoda» → `koda`),
> corregido con `Str::ascii()`; un mensaje que decía «créalos y vuelve a sembrar» **no funcionaba**
> porque sembrar saltaba los existentes; ⚠️ **una prueba mía pasaba por la razón equivocada**
> (**tercera vez** en el proyecto) — la unicidad la protegía el **UNIQUE de MySQL**, cuyo collation es
> case-insensitive, así que «TOYOTA» y «Toyota» chocaban en la base **aunque mi normalizador no
> hiciera nada**; y ⚠️ **mi propio script de verificación dejó el defecto REINYECTADO** al morir con
> `UnicodeDecodeError` después de escribir la violación y antes de restaurar.
> **Suite Car Wash: 403** (de 376). ⚠️ Migración `2026_07_28_360001`.
> **Reglas nuevas: un comentario Blade no se anida · la etiqueta de un componente no se escribe
> dentro de un `<script>` ni en un comentario JS · lo que el usuario puede teclear se crea al vuelo,
> no se exige del catálogo · una normalización de texto se hace con `Str::ascii()`, no con un mapa de
> tildes a mano · un mensaje que dice qué hacer tiene que funcionar cuando se hace · una unicidad que
> la protege el motor de la base no prueba la del código · un script que modifica archivos para
> verificar algo restaura en `finally`.**

> **PRESTAMELLO post-cierre F4 (2026-07-29) — `[PRE-FIX-1]`**: pedido del director técnico —
> *«verifica cobros del día y gestión de cobranza, ya que no hay opciones para gestionar; parecen más
> reportes que procesos»*. Tenía razón en los dos casos, y al abrirlos aparecieron **siete defectos**
> que ninguna prueba cubría. ⚠️ **«Gestión de cobranza» tenía CERO botones de acción**, y su propio
> texto vacío lo admitía: *«Regístralas desde el detalle de cada operación»* — la pantalla llamada
> «Gestión» mandaba a gestionar a otro sitio. El POST **ya existía y estaba probado**; solo estaba
> expuesto en el detalle de la operación, a **cinco pasos** de ahí (forma de defecto de
> `[BAN-F4-FIX]`: funcionalidad alcanzable, pero no desde donde se necesita). ⚠️ **«Cobros del día»
> mostraba 87 cuotas todas vencidas hacía 211 días**, mezcladas sin distinción —una que vence hoy y
> una de hace siete meses se veían igual— y su única acción era «Cobrar»: el cobrador que visita y
> **no** cobra (el cliente no estaba, prometió el viernes, discutió el monto) no tenía dónde registrar
> el resultado, así que el trabajo hecho **desaparecía**, nadie sabía si a ese cliente ya se le había
> visitado tres veces, y la ruta del día siguiente salía idéntica a la del anterior.
> **Los siete defectos**: ⚠️ (1) **el «Cobrado hoy» contaba por `created_at`** —la fecha de captura—,
> que es el defecto de `[PRE-F4-2a]` corregido en los siete reportes y **sin corregir en la pantalla
> que el cobrador usa todos los días**: cobra el lunes en la ruta, la oficina teclea el miércoles, y
> el cobrado del lunes salía en **0** mientras el del miércoles contaba dos días — con eso no se
> cuadra el día contra la gaveta (cuarta copia del criterio); (2) el KPI usaba `now()` y la tabla
> `$fecha`, o sea **dos fechas en la misma pantalla**; (3) ⚠️ **el orden era PARCIAL** y con muchas
> cuotas del mismo día **cambia entre ejecuciones** —el cobrador que imprime su ruta dos veces obtiene
> dos rutas distintas y no puede tacharlas contra la primera (**sexta vez** en el ecosistema)—;
> (4) los días de atraso se medían contra «hoy» y no contra la fecha consultada; (5) ⚠️ **tres KPIs se
> contaban sobre listas con `limit`**: con 55 promesas vigentes el KPI decía **50**, un número
> plausible y menor que el real que nadie relacionaría con el límite de una lista; (6) las acciones
> vencidas y las próximas venían juntas, cuando la vencida es la que hay que atender primero; y
> (7) ⚠️ **no se podía reprogramar una promesa** —el caso real más frecuente— así que había dos
> salidas malas: marcarla «incumplida» y perder el compromiso nuevo, o dejarla «vigente» con una fecha
> que ya pasó, **que es justo lo que hace que el tablero muestre promesas vencidas como vivas**.
> **Lo que se hizo**: la agenda se parte en «Vencen hoy» y «Atrasadas» (lo más viejo primero: es lo que
> más se enfría), botón **«Gestionar»** en cada fila —el resultado de la visita se registra donde
> ocurre la visita—, **«+ Registrar gestión»** con selector de operación, **«Atender»** en cada acción
> de la cola (*una cola de trabajo que no se puede trabajar es un recordatorio*) y **«Reprogramar»**
> con **rastro en el historial**: si solo cambiara la fecha, el historial diría que el cliente prometió
> una vez cuando ya lleva tres — y ese es el dato con el que se decide si se sigue negociando o se
> demanda.
> ✅ **Discrepancia `D-PRE-F4-1-1` CERRADA**: la fórmula del capital vivo estaba copiada en dos sitios
> y se había declarado como deuda porque unificar parecía obligar a que el KPI pasara por una
> subconsulta agregada. **No hacía falta: lo que se repetía era la fórmula, no la agregación.**
> ⚠️ **Y dos pruebas propias que no protegían lo que decían**: la del orden se escribió comparando
> tres ejecuciones seguidas y **pasó con el orden parcial puesto** (MySQL devuelve el mismo plan para
> tres llamadas consecutivas) — reescrita para verificar el `ORDER BY` con `DB::listen`; y una
> **violación mal inyectada** dejó el archivo con un `\$` literal, así que la prueba falló por error
> de **sintaxis** y no por la aserción.
> **Suite Prestamello: 454** (de 441 al cerrar F4). Sin migración: los siete defectos eran de
> consulta, de orden y de exposición en pantalla.
> **Reglas nuevas: una pantalla que se llama «Gestión» tiene que permitir gestionar —si su estado
> vacío dice «hazlo en otro sitio», es un reporte con nombre de proceso· una agenda separa el día del
> atraso · una cola de trabajo trae la acción con la que se trabaja · un KPI no se cuenta sobre una
> lista con `limit` · reprogramar es un caso de primera clase y deja rastro · un criterio unificado
> hay que buscarlo en TODAS las pantallas, no solo en los reportes · una prueba de orden no se
> verifica comparando ejecuciones seguidas · una violación que rompe la sintaxis no verifica nada.**
> ⚠️ **Nota de otro módulo**: `CajaService::sesionAbiertaParaEmpresa($empresaId, …)` **ignora su
> primer parámetro** — los 9 llamadores del ecosistema (Prestamello ×4, Car Wash ×5) le pasan `0`
> porque no significa nada, y el aislamiento lo hace el global scope de `HasEmpresa`. Funciona, pero
> la firma promete un filtro que no aplica. **No se cambió**: toca tres módulos y es decisión de
> alcance del director técnico.

> ✅ **CORREGIDO en `[CW-FIX-4]` (2026-07-30)** — el fallo que quedó pendiente al cerrar
> `[PRE-FIX-1]`. `CarwashReportesTest > el no show solo cuenta las citas cuya hora ya pasó` crea su
> cita «futura» con `now()->addDays(2)` y consulta el reporte entre `startOfMonth` y `endOfMonth`:
> corrido el **30 de julio** esa cita cae el 1 de agosto, fuera del rango, y el total da 3 en vez
> de 4. ⚠️ **Y la ventana era más ancha de lo estimado**: no son «los últimos 2 días» — los días
> **1, 2 y 3** se salen las citas del PASADO (el día 1, `subDays(2)` cae en el mes anterior).
> Calculado sobre 2026: **5 días por mes, 60 al año, el 16 % del tiempo**.
> **Se corrigió anclando el «ahora» a mitad de mes EN ESA PRUEBA**, no en el TestCase: ahí se fija
> la HORA a propósito y **no** la fecha, porque `[CW-F4-3]` compara contra el mismo día de la
> semana anterior y mover el día globalmente rompería ese comparativo. ⚠️ **Y no bastaba con anclar
> las citas al mes** dejando el «ahora» real: la cita futura tiene que seguir siendo futura
> *respecto al ahora*, o el día 20 ya habría pasado y la prueba pasaría **sin ejercer la regla que
> dice ejercer**. La guarda verifica la fórmula simulando los 31 días posibles de ejecución en meses
> de 31, 30 y 28 días más un febrero bisiesto (600 aserciones); las dos violaciones se detectan.
> ⚠️ **Y delató un problema de método propio**: la regresión reportada como «2170 passed, 0 failed»
> corrió el 29 antes de medianoche, cuando +2 días daba 31 de julio — **verde por la hora, no por
> estar bien**. Es exactamente lo que el `CarwashTestCase` ya advertía: *un fallo que depende de
> CUÁNDO se corre hace que la suite verde deje de significar algo.*
> **Barrido del ecosistema**: 6 suites combinan fechas futuras con filtros por mes; las 5 de
> Activos y Prestamello pasan el día 30 (74 pruebas) — sus fechas futuras son intencionales o el
> rango las cubre. **Suite Car Wash: 404.**
> **Regla nueva: el «ahora» de una prueba que filtra por PERÍODO se ancla al período, no solo a la
> hora — y el dato relativo tiene que conservar su relación con ese «ahora», o la prueba pasa sin
> probar.**


> **PRESTAMELLO FASE 4 (2026-07-29) — `[PRE-F4-1]`–`[PRE-F4-3]` + cierre `[PRE-F4]` · CIERRA EL
> BLUEPRINT DE PRESTAMELLO (F0→F4)**: la cartera que se puede dirigir. El módulo ya prestaba con
> criterio (F1), vendía a crédito de verdad (F2) y dirigía la cobranza (F3); lo que no tenía era **con
> qué mirar la cartera completa** — un gerente con 300 operaciones vivas no podía responder «¿cuánto
> está en riesgo?», «¿los créditos de marzo se comportan peor que los de enero?» ni «¿cuánta reserva
> necesito para el cierre?». **F4-1** dashboard gerencial con **una sola fuente** (`kpisGerenciales()`
> compone los métodos de los reportes, no consulta por su cuenta — prevención del defecto de Bancos
> F4-4), el PAR **acumulativo** porque tramos sueltos obligarían a sumar mentalmente, los filtros **en
> el servicio** (en la vista dejarían los KPIs contando la cartera completa mientras la tabla muestra
> una parte) y un porcentaje sobre cartera cero en **`null`**, no 0 % (ese mes no había nada que medir,
> y 0 % dice «no hay riesgo»). **F4-2a** apareció al escribir los reportes y es de las que llegan más
> lejos: ⚠️ **`pre_pagos.fecha_pago` era una columna HUÉRFANA** —existía y el servicio nunca la
> llenaba, así que todo el módulo contaba por `created_at`, **el instante de captura**: el cliente
> abona el lunes en la ruta, el cobrador entrega el miércoles, y si el lunes cerraba el mes el
> recuperado **y el asiento** quedaban en el período equivocado— más el criterio de fecha **escrito
> tres veces, dos en el mismo servicio y las dos saliendo en el mismo dashboard**. **F4-2** siete
> reportes que **declaran su cuadre y lo pintan al pie**, con la provisión A–E clasificando por la
> **cuota más vieja** (el promedio suavizaría justo el dato que importa), contabilizando **solo el
> DELTA** (asentar el total cada mes multiplicaría el gasto por los meses transcurridos) y con el
> último tramo **sin techo** porque las operaciones que lo superaran desaparecerían del reporte — justo
> las más viejas. **F4-3** el informe del comité: los siete reportes en un PDF de nueve secciones con
> **los cuadres EN EL PAPEL** (un número sin su cuadre se discute como si fuera un hecho verificado) y
> la **moneda en la portada**; el servicio **no calcula, compone**, y **todo se resuelve a UNA fecha de
> corte** — si cada bloque usara «ahora», un cobro registrado mientras se genera el PDF haría que el
> KPI de la primera página no cuadre con la tabla de la cuarta y el descuadre sería **irreproducible**.
> El envío nace **apagado**: encenderlo manda la cartera completa —capital, mora, provisiones y **los
> nombres de los clientes morosos**— a una lista de correos, y el **detalle va en el adjunto**, porque
> un correo se reenvía con un clic. El cron corre **a diario y decide dentro**: un `monthlyOn(3)` que
> falle se salta el mes completo y el comité no recibe nada.
> **⚠️ Dos columnas de F4-2 no tenían pantalla** (regla de `[CW-FIX-2]`): el interruptor del asiento de
> la provisión —que el reporte leía, con el agravante de mostrar el botón de contabilizar sin que el
> usuario pudiera habilitarlo— y **la escala A–E completa**, cuyos porcentajes son **de REFERENCIA** y
> sin pantalla habrían quedado como si fueran la norma del país. La escala se guarda **completa**:
> validar fila por fila permitiría dejar un hueco y un crédito de 65 días caería en ninguna
> clasificación, quedando sin provisionar.
> **11 defectos reales, y los tres que más lejos llegaban**: ⚠️ **el acumulado de provisión daba 0**
> con 369,586 emitidos (solo contaba `procesado`, y el asiento estaba en `pendiente_configuracion`) →
> **el siguiente cierre habría duplicado el gasto completo**; ⚠️ **el PAR histórico no coincidía con el
> del dashboard** (67.25 % vs 68.91 %) porque la serie reconstruía cada mes a su cierre y el mes en
> curso no ha cerrado; y ⚠️ **la proyección salía en 0.00 con 470,130 por vencer** porque el factor
> histórico era 0 y multiplicaba — ahora lo dice en vez de mostrar un cero que parece un dato. Más un
> N+1 de 100 consultas, `meses_madurez` en float (Carbon 3), una ruta inexistente que reventaba la
> vista y el wrapper de TomSelect de 64 px al lado de un botón de 32.
> **Y cinco pruebas propias que pasaban por la razón equivocada**, las cinco cazadas antes de
> commitear — entre ellas una con `now()->subMonths(5)` **corrida un día 29** (Carbon desborda febrero
> al 1 de marzo: habría pasado los días 1-28 y fallado los 29-31) y la de las metas del informe, que
> tenía todas las operaciones vivas, así que **quitar el filtro de estado no la rompía**.
> ⚠️ **Y una lección reaprendida**: al leer una captura «vi» un descuadre de 80,000 que no existía —
> confundí un `0` con un `8` en fuente monoespaciada. **Los números de una captura se leen del DOM.**
> **Suite Prestamello: 441 pruebas** (de 350 al cerrar F3, de 53 al cerrar F0); **regresión completa
> del ecosistema VERDE: 2130 passed, 4 skipped, 0 failed (19215 aserciones)**; aceptación de la fase
> con **50 aserciones** que terminan donde importa: **el KPI del dashboard, la celda del reporte y la
> línea del PDF son el mismo número**. Detalle, las **10 discrepancias**, los **41 TODOs consolidados**
> y las **11 cuentas contables** en `app/zyntello-app/zyntello-prestamello-mejoras-blueprint.md`
> («CIERRE DE LA FASE 4» + «LISTA CONSOLIDADA»).
> ⚠️ Migraciones `2026_07_29_470001` y `480001`; cron `prestamello:paquete-ejecutivo --confirmar`
> (07:10). **Reglas nuevas: un dato que todo reporte usa no puede ser una columna huérfana · un
> acumulado que decide un asiento no puede filtrar por el estado del asiento anterior · una serie
> histórica y un KPI de hoy usan el mismo método para el mes en curso · un factor histórico que
> multiplica a cero no da un pronóstico · un informe compuesto no calcula: compone, se resuelve a UNA
> fecha de corte, declara su moneda y sus cuadres van en el papel · un interruptor peligroso se
> verifica por el DEFAULT DE LA COLUMNA · una escala de tramos se guarda completa · un porcentaje de
> referencia sin pantalla se convierte en la norma · los números de una captura se leen del DOM.**
>
> ⚠️ **Dos hallazgos FUERA del alcance, para decisión del director técnico**: (1) **los TXT de la DGII
> (606/607/608) tienen orden PARCIAL** — ordenan solo por fecha, y con dos facturas del mismo día el
> orden lo decide MySQL: **dos generaciones del mismo TXT no son idénticas**, así que el contador que
> lo regenere para verificar verá diferencias que no existen (**quinta vez** que esta forma aparece;
> arreglo de una línea por reporte, no se toca sin autorización porque son reportes fiscales que se
> entregan a la DGII); y (2) **los snapshots de `tests/Feature/*/snapshots/` no comparan nada**: se
> escriben con `file_put_contents` y nunca se afirman — son muestras para inspección, no protegen
> contra ningún cambio de salida.

> **PRESTAMELLO FASE 3 (2026-07-28/29) — `[PRE-F3-1]`–`[PRE-F3-4]` + cierre `[PRE-F3]`**: la
> cobranza con criterio. El módulo **registraba** la cobranza y no la **dirigía**: con 300
> operaciones vivas, una atrasada 5 días y otra 200 se veían igual en una lista por fecha; la cartera
> no tenía dueño ni medida; al cliente solo se le hablaba cuando ya debía. **F3-1** tramos de mora
> configurables —el criterio es del negocio: un prestamista diario considera grave un atraso de 3
> días y uno hipotecario no se alarma hasta los 60— con los días medidos por **la cuota más vieja** y
> no por el promedio (el promedio suavizaría justo el dato que importa), el **último tramo sin techo**
> porque con un número grande las operaciones que lo superen **desaparecerían del tablero** —justo las
> más viejas— y ⚠️ la promesa incumplida que **ya se marcaba, pero solo si alguien miraba**: se
> evaluaba al abrir la pantalla, así que si nadie la abría en una semana el dashboard mostraba
> promesas «vigentes» vencidas hacía días. **F3-2** la comisión se mide por el tramo en que estaba la
> operación **AL COBRAR** y no por el de hoy: medirla hoy pagaría al revés, porque rescatar una
> cuenta de 120 días la deja al día y el trabajo pasaría a valer el 1% del tramo «al día» en vez del
> 8% del que de verdad se trabajó — se penalizaría exactamente lo que se quiere premiar. Los % nacen
> en **0%** para que encender las comisiones no pague nada por accidente; la cartera **se
> previsualiza antes de moverse** (y entrar a la pantalla no previsualiza) con rastro de cada
> traspaso; y las **dos metas van separadas** porque «monto recuperado» es un flujo del mes y «% al
> día» una foto de hoy — promediarlas daría un número que no significa nada. ⚠️ **NO se crea
> liquidación propia**: `[FACT-F3-5]` ya la tenía y ya distingue cobradores de vendedores; el único
> hueco era el puente de identidad. **F3-3** recordatorios al cliente, lo más barato que hace el
> módulo: un cliente que olvidó la fecha entraba a mora igual que uno que no puede pagar. **Todo nace
> apagado** —encender los avisos empieza a escribirle a los clientes desde el número de la empresa— y
> la pantalla trae una **simulación** que muestra el mensaje exacto antes de encender nada. ⚠️ **La
> clave de idempotencia del blueprint habría mandado el aviso de mora UNA sola vez en la vida de la
> cuota**; y un **fallo no cuenta como enviado**: el modo «enlace» de WhatsApp se marca FALLIDO a
> propósito, porque en un cron no hay humano que abra `wa.me`. **F3-4** seis alertas internas que **no
> reimplementan ninguna detección** —las seis preguntas ya tenían respuesta en el módulo— y que ⚠️
> **no vencen las preaprobaciones** aunque el blueprint lo pida aquí, porque ya lo hace F1-4 y dos
> comandos venciendo lo mismo divergirían. La meta se compara contra el **proporcional del mes**: contra
> el total habría alertado a todos los cobradores los primeros 25 días de cada mes.
> **11 defectos reales, y la mitad los encontró USAR el módulo, no leer el código**: ⚠️ el orden de la
> consulta de la ruta era **PARCIAL** y con `limit(100)` no cambiaba el orden sino **qué cuotas
> entran** (la 100 y la 101 se turnarían entre recargas y una visita del día desaparecería); ⚠️ campos
> nuevos **`required` rompieron a los llamadores existentes**; **enviando un aviso de verdad** salió
> que el importe **iba sin moneda** y que el hueco se veía en un doble espacio; **corriendo el
> comando** salió «vence en **-9 días**», que además revela que el cron no está corriendo; **mirando
> la captura** salieron el escape de Blade a medio resolver en la lista de variables —el texto que el
> usuario copia— y un «capital pendiente 20,000» con un saldo de 120,000 (etiqueta plausible, número
> correcto, contando otra cosa, y es el dato con el que se decide si se demanda); y un seed que corrió
> dos veces delató que ⚠️ **`pre_operaciones` aceptaba números duplicados** — dos préstamos
> «OP-000042» y un pago puede quedar aplicado al crédito equivocado, corregido con el UNIQUE que es la
> segunda guarda de `[CW-F0-6]`, más el generador del número que estaba **duplicado** en dos sitios.
> **Y tres pruebas propias que pasaban por la razón equivocada**, las tres cazadas antes de commitear.
> **Suite Prestamello: 350 pruebas** (de 268 al cerrar F2); aceptación de la fase con **180
> aserciones** sobre UNA sola cartera. Detalle y los **10 TODOs de verificación humana** en
> `app/zyntello-app/zyntello-prestamello-mejoras-blueprint.md` («CIERRE DE LA FASE 3»).
> ⚠️ Migraciones `2026_07_28_420001`, `430001`, `440001`, `450001`, `460001`; crones
> `prestamello:alertas` (06:55) y `prestamello:recordatorios --confirmar` (08:00 — no de madrugada:
> un WhatsApp de cobranza a las 3 a.m. molesta más de lo que cobra).
> **Reglas nuevas: el esfuerzo se paga por la dificultad que tenía el trabajo cuando se hizo · un
> orden parcial con LIMIT no cambia el orden, cambia el contenido · la clave de idempotencia de un
> aviso recurrente lleva fecha · un fallo registrado no es un envío hecho · un importe en un aviso de
> cobranza nunca va sin su moneda · un campo nuevo `required` rompe a todos los llamadores que ya
> existían · una alerta que salta todos los días enseña a ignorar las alertas · un avance se compara
> contra el proporcional del período · una violación que no se confirma en el código es una
> verificación imaginaria · una captura también sirve para leer los textos, no solo para ver que la
> pantalla existe.**

> **PRESTAMELLO FASE 2 (2026-07-28) — `[PRE-F2-1]`–`[PRE-F2-3]` + cierre `[PRE-F2]`**: la venta a
> crédito de verdad. `venta_credito` era **solo una etiqueta en un ENUM**: el módulo generaba el mismo
> cuadro que un préstamo, no sabía QUÉ se había vendido, y ⚠️ **el mismo hecho se contaba DOS VECES
> como salida de dinero** — vender un solar de 500,000 dejaba un egreso en la gaveta de Caja POS Y un
> crédito a caja en el mayor; ninguno era cierto, y los dos descuadres se descubren en momentos
> distintos (el arqueo y la conciliación), así que nadie los relacionaba entre sí ni con la venta de un
> terreno. **F2-1** catálogo de bienes con estados de **transiciones declaradas** (un ENUM libre
> permitiría saltar de `disponible` a `entregado` sin que nadie pagara nada) y el precio **derivado**,
> nunca guardado; el candado de stock distingue TRES resultados —hay, no hay, y **no se pudo
> consultar**— porque tratar el «no sé» como «hay» dejaría pasar la reserva con Inventario apagado y el
> error se descubriría el día de la entrega con la inicial ya cobrada. **F2-2** el asiento correcto (DR
> cartera + DR anticipo / CR ingreso) con el precio tomado de **la suma de los débitos** y no del
> precio de lista, y la **inicial en varios abonos cada uno EN SU FECHA**: usaban `created_at` —el
> instante de captura— y el cliente abona el lunes mientras el cobrador entrega el miércoles, así que
> el asiento caía en el período equivocado. **F2-3** estado de cuenta con **fuente única** para el PDF,
> el portal y el WhatsApp: si cada canal calculara su avance, el papel diría 40% y el teléfono 38%, y
> esa discusión no se gana explicando la fórmula. **Suite Prestamello: 232 pruebas**; regresión 1920.
> **Reglas nuevas: un dato derivado no se guarda · «no sé» no es «no hay» · un ENUM de estados sin
> transiciones permite lo imposible · la fecha de un pago no es la fecha de su captura · un asiento se
> arma con lo que de verdad lo respalda · si falta una cuenta, mejor sin líneas que descuadrado · un
> número que el cliente ve en dos sitios se calcula en uno · un porcentaje de avance declara su base ·
> una prueba de que algo NO ocurre necesita montadas las condiciones para que ocurra.**

> **PRESTAMELLO FASE 1 (2026-07-27/28) — `[PRE-F1-1]`–`[PRE-F1-5]` + cierre `[PRE-F1]`**: el
> crédito con criterio. El módulo prestaba dinero **sin ningún criterio de riesgo** —sin
> evaluación, sin garantías, sin buró, sin forma de decir «sí, pero…»— y el control de límite que
> sí existía era el peor de los dos mundos: **se veía implementado y no actuaba nunca**.
> **F1-1** garantías con documentos en disco privado, cobertura **derivada** (nunca guardada: una
> columna quedaría vieja al retasar el bien) y **liberación automática** al extinguirse la deuda,
> porque si dependiera de que alguien lo recuerde el cliente que terminó de pagar su carro
> seguiría con la matrícula retenida. **F1-2** evaluación 4C que solo pide **lo que el sistema no
> puede saber** —el historial, el DTI y la cobertura se calculan; pedírselos al analista sería
> pedirle que copie a mano algo que la base sabe mejor— con **snapshot de las reglas**: sin él,
> cambiar los pesos reescribiría el score de todas las evaluaciones pasadas y un crédito aprobado
> con 78 pasaría a parecer aprobado con 62 sin que nadie hubiera hecho nada. **F1-3** burós por
> país: catálogo del TENANT, credenciales por EMPRESA **cifradas** (verificado leyendo la fila
> cruda), 10 burós de 7 países todos **inactivos y sin verificar** —activar uno sin comprobar su
> URL mandaría al analista a una página equivocada— y ⚠️ **NUNCA scraping**, con una prueba que
> falla si aparece cualquier llamada de red: un scraper falla **en silencio** y la evaluación
> tomaría «sin dato» por «sin deudas» → el crédito se aprobaría por un dato que nunca llegó. El
> resultado se **COPIA** a la evaluación, porque en la bitácora sola no serviría de nada. **F1-4**
> preaprobación con **vigencia** (una capacidad de pago medida en enero no dice nada de octubre; no
> se ofrece «0 = sin vencimiento» porque sería ofrecer volver al defecto) y la **bandeja del
> oficial**, que no es un listado sino una cola de trabajo: la EDAD de cada fila es el dato, porque
> en un listado por fecha una solicitud de dos días y una de tres semanas se ven igual. **F1-5** la
> exposición del cliente son sus CxC **más** el capital de sus préstamos vivos — el dinero que debe
> no cambia de naturaleza según el módulo que lo registró.
> **9 defectos reales, ninguno en el blueprint. Los cuatro graves:** (1) ⚠️ **el control de límite
> NO SE DISPARABA NUNCA** — leía una columna que ningún formulario llena, así que su valor era
> siempre NULL y el bloque completo se saltaba **en silencio**; (2) ⚠️ **el orden de preferencia de
> los workflows era PARCIAL en el MOTOR**: con la matriz «50k → 2 firmas / 500k → 3 firmas», un
> crédito de 600k firmaba su nivel 2 con el aprobador del tramo de 50k y **el comité de los montos
> altos nunca llegaba a firmar**, sin que nada lo avisara porque la cadena se veía completa
> (afectaba a revaluación de activos, corridas de CxP y presupuesto — **cuarta vez** que esta forma
> de defecto aparece); (3) ⚠️ **el handler dejaba las preaprobaciones colgadas para siempre** aunque
> todos los niveles firmaran; (4) ⚠️ **una prueba de CAR WASH pasaba por la razón equivocada**, con
> dos defectos: su filtro de comentarios llevaba `/s` sobre `//.*` y **se comía el archivo completo**
> (haystack vacío = la aserción pasaba siempre), y al corregirlo resultó que además prohibía **leer**
> el stock y no solo escribirlo. **Y dos pruebas propias que pasaban por la razón equivocada.**
> **Suite Prestamello: 148 pruebas** (de 53); aceptación de la fase con **171 aserciones** sobre UNA
> sola solicitud, porque los defectos que las tareas por separado no ven aparecen en las costuras.
> Detalle y los **13 TODOs de verificación humana** en `app/zyntello-app/zyntello-prestamello-mejoras-blueprint.md`
> («CIERRE DE LA FASE 1»). ⚠️ Migraciones `2026_07_27_360001`–`360002`, `370001`–`370003`, `380001`,
> `390001`; cron `prestamello:expirar-preaprobaciones` (06:50).
> **Reglas nuevas: un control que lee una columna que nadie llena es peor que no tener control ·
> extender no es alterar (componer en un método nuevo, no cambiar la fórmula común) · un filtro que
> puede vaciar su entrada necesita una guarda · una aserción sobre el código nombra la ACCIÓN, no la
> tabla · un dato derivado no se guarda.**

> **CAR WASH post-cierre (2026-07-27) — `[CW-FIX-1]`, `[CW-FIX-2]`**: pedido del director técnico —
> *«corrige las discrepancias, agrega a la configuración del módulo las opciones donde se requiera
> intervención humana… los intervalos de mantenimiento se pueden agregar a la ficha del cliente por
> su vehículo porque un cliente puede tener dos o más vehículos»*.
> **`[CW-FIX-1]` el mantenimiento era global cuando el problema es por vehículo**: una camioneta de
> trabajo cambia el aceite cada 5,000 km y el carro familiar lo necesita por tiempo — con una sola
> regla por empresa **uno de los dos avisos siempre está mal**. La decisión fue **override, no reglas
> por vehículo**: el catálogo es la plantilla y solo se guarda lo que ese vehículo tiene distinto
> (`NULL` = usa el catálogo), porque copiar todas las reglas a cada carro dejaría a los ya
> registrados sin recibir una corrección del estándar — hay una prueba de que la corrección **sí
> llega** a quien no lo ajustó. `activo = false` cubre el **eléctrico que no lleva aceite**: sin esa
> columna la única forma de no avisarle sería apagar la regla para todos. Y los vehículos ya se
> **registran y se asignan a su dueño** (antes solo nacían al recibir un turno, con el carro
> esperando en la puerta), con pestaña *Vehículos* en la ficha del cliente y un contador de los que
> **no tienen dueño** — sin cliente no hay a quién avisarle.
> **`[CW-FIX-2]` cuatro correcciones y un checklist**: (1) ⚠️ **la fidelidad ignoraba la cobertura
> que el módulo ya declaraba** (`cobertura_membresia`): configurado por placa, el cliente con tres
> carros llegaba al premio con la suma de los tres — un premio que ninguno se había ganado; es la
> forma de defecto más difícil de ver, porque el número en pantalla es plausible y solo está contando
> otra cosa. (2) ⚠️ **el catálogo de trabajos del taller no tenía NINGUNA pantalla**: F3 entregó
> presupuesto, comisión del mecánico y vinculación al mantenimiento, y la tabla solo se podía llenar
> por SQL — un taller recién instalado **no podía presupuestar**, y el TODO de «vincular cada regla a
> su trabajo» era **imposible de cumplir** porque el combo siempre estaba vacío. (3) ⚠️ **sin el cron
> nada lo decía** (el TODO más peligroso): ahora cada comando estampa su ejecución **aunque no envíe
> nada**, porque «corrió y no había nada» y «no corrió» son cosas distintas. (4) la jornada de la
> productividad estaba **fija en 8 h**: un lavadero que abre de 7 a 19 tenía el indicador mal por
> diseño. **El checklist convierte 11 de los 18 TODOs** en algo que la pantalla dice sola, con tres
> severidades — si todo lo apagado saliera en rojo, un módulo recién instalado mostraría diez alarmas
> y el usuario aprendería a ignorarlas. **12 reglas verificadas violándolas, 12 detectadas**; y ⚠️
> **una prueba pasaba por la razón equivocada** (segunda vez en el módulo): el global scope de
> `HasEmpresa` la salvaba, así que se separó en dos, una por guarda. **Suite Car Wash: 376** (de 333).
> ⚠️ Migraciones `2026_07_27_350001`–`350003`.
> **Reglas nuevas: un dato que el negocio ajusta por caso no puede ser global · una decisión ya
> declarada en la configuración manda en todo lo que dependa de ella · un proceso programado tiene
> que dejar rastro de que corrió, incluso cuando no hizo nada · un checklist sin severidades es ruido
> · una TABLA sin pantalla es una función que no existe.**

> **CAR WASH FASE 4 (2026-07-27) — `[CW-F4-1]`–`[CW-F4-3]` + cierre `[CW-F4]` · CIERRA EL
> BLUEPRINT DE CAR WASH (F0→F4)**: reportes, diferenciación y alertas. Lo primero fue **verificar
> el ANEXO B con `git log`**, y las tres dependencias condicionales resultaron distintas de lo que
> el blueprint daba por hecho: `crm_fidelidad` **no existe**, `[REST-*]` **nunca se ejecutó** y
> `public_token` **no estaba** en `cw_ordenes`. **F4-1**: `CarwashAnaliticaService` es fuente única
> de los 7 reportes **y** del dashboard —prevención directa del defecto de Bancos F4-4: el KPI y el
> reporte salen del MISMO método— y cada reporte declara su **cuadre contra la fuente y lo pinta al
> pie**, porque un cuadre que solo vive en la prueba no avisa a nadie en producción. Un turno
> **anulado** no cuenta como venta (si contara, la venta no cuadraría con la caja y nadie sabría por
> qué); los importes salen de las **líneas** y no de la cabecera, que es lo que permite que el
> reporte por servicio y el total cuadren entre sí; y **lo que falta se nombra en vez de filtrarse**
> (un servicio sin insumos declarados aparece marcado: «margen 100%» es una ilusión, el jabón
> cuesta). **F4-2**: el contador de fidelidad **NO se guarda, se DERIVA** de los turnos entregados
> desde el último canje —una columna sería un segundo registro del mismo hecho y al anular un turno
> quedaría vieja; hay una prueba que **anula un turno y el contador baja solo**—; lo que sí se
> guarda es el **canje**, que es un hecho nuevo. El `public_token` del QR va en la **ORDEN** y no en
> el vehículo (un token por vehículo dejaría ver todas sus visitas a quien conserve un ticket viejo)
> y la página pública muestra **solo lo que ya está impreso en el ticket** del cliente: ni su
> nombre, ni su teléfono, ni los importes. Y el recordatorio de lavado **NO es automático**: un
> mantenimiento vencido es un hecho y se manda solo, pero «hace tiempo que no viene» es una decisión
> comercial — automatizarlo convertiría el módulo en un emisor de publicidad. **F4-3**: comparativo
> contra el **mismo día de la semana anterior** (un lunes contra un lunes: contra «ayer» un lunes
> siempre parecería un desastre al lado del sábado) desde el MISMO servicio que los KPIs, con la
> variación en `null` cuando la referencia es 0; y 4 alertas sobre el patrón canónico del ecosistema
> con la regla **«una alerta que salta todos los días enseña a ignorar las alertas»**: el umbral del
> turno estancado nace en **0 = desactivado**, el de insumos exige mínimo declarado + candado de
> Inventario, y el de mantenimiento solo cuenta los **vencidos** diciendo el **motivo** por el que
> el recordatorio no salió. Hay una prueba que impide que el módulo nazca ruidoso: *con los defaults,
> operar normal no dispara ni una alerta.* **⚠️ Los DOS mecanismos de control de la Fase 0 avisaron
> al entregar F4-2** (el golden master del hueco F4 y la cuenta de los tres huecos): estaban escritos
> para eso. Los **tres huecos** que F0-0 marcó quedan cerrados. **Suite Car Wash: 333 pruebas** — el
> módulo **no tenía NINGUNA** antes de F0-0; **regresión completa VERDE: 1640 passed, 4 skipped,
> 0 failed** (de 1307 antes de arrancar el blueprint). ⚠️ Migraciones `2026_07_27_340001`–`340003`; cron
> `carwash:alertas` (06:35).
> **Reglas nuevas: un cuadre que no se muestra no avisa de nada · lo que falta se nombra, no se
> filtra · un contador que se puede derivar no se guarda · un porcentaje sobre cero es null, no
> 100% · una alerta que no se puede apagar se ignora entera.**
> **⚠️ Trampa del ecosistema: `HubTestCase` arranca con el módulo `inventario` ACTIVO** — para
> probar un candado de Inventario hay que desactivarlo en la prueba, o el candado nunca se ejerce.

> **CAR WASH FASE 3 (2026-07-27) — `[CW-F3-1]`–`[CW-F3-3]` + cierre `[CW-F3]`**: taller y
> mantenimiento, la primera área **nueva** del vertical (F0–F2 endurecieron lo que ya existía).
> El taller es un negocio distinto en el mismo local: el lavado dura 30 minutos y se cobra al
> salir; una orden de taller dura días, necesita que el cliente **apruebe un presupuesto** y
> consume piezas del almacén. La decisión de arquitectura salió de **leer el modelo `Orden`**, no
> de elegir a priori: ni tabla propia (partiría el historial del vehículo en dos, y F3-3 pide
> justamente una ficha unificada) ni aditivo puro (10 columnas en NULL para todos los lavados y 12
> valores mezclados en el ENUM `estado`). Así que **la orden sigue siendo UNA** (`tipo_orden`) con
> la extensión 1:1 `cw_taller_detalles`, y la pieza que lo sostiene es que **el estado fino del
> taller se DERIVA al grueso**: el kanban, los KPIs, el semáforo, el historial y la facturación
> siguen funcionando sin saber que el taller existe. **F3-2**: presupuestar **no consume** —el
> stock se mueve con un botón cuando el mecánico usa la pieza, porque en un taller las piezas se
> usan por tandas—, sin bodega configurada **no se inventa una** (descontar del almacén equivocado
> es peor que no descontar: el error se descubre en el conteo físico semanas después), el consumo
> es idempotente y **sella el costo real**, y la comisión del mecánico se **calcula** de lo
> ejecutado en vez de registrarse aparte (dos registros de lo mismo = dos verdades, y una queda
> vieja al corregir el trabajo). **F3-3**: el historial es UNO porque la orden es una —eso es lo
> que compra la decisión de F3-1—; las reglas de mantenimiento admiten solo km (rotación de gomas),
> solo tiempo (revisión anual) o las dos, y con las dos **la que se cumpla primero manda**; el
> odómetro actual es la **lectura más alta, no la última** (un odómetro solo sube: 1200 en vez de
> 12000 es un error de tecleo, y usarlo haría que el aviso no saltara nunca); el recordatorio
> (cron 07:20) es idempotente por día, **solo simula** sin `--confirmar` y respeta el opt-out.
> **⚠️ El defecto lo encontró la aceptación, no las tareas: una orden de taller NO SE PODÍA
> FACTURAR** — el facturador arma las líneas desde los servicios de lavado y los productos de
> tienda, y una orden de taller no tiene ninguno de los dos (sus líneas son trabajos y repuestos);
> las pruebas de F3-2 verificaban que el total llegara a la **cabecera**, y eso era cierto, pero el
> facturador **construye** las líneas desde las tablas de detalle. **⚠️ Y una prueba pasaba por la
> razón equivocada**: al violar el filtro de «solo cuenta una orden entregada» siguió pasando
> porque la salvaba el otro filtro (`ejecutado`) — separada en dos, una por filtro. **Suite Car
> Wash: 243 pruebas** (de 172); **regresión completa VERDE: 1550 passed, 4 skipped, 0 failed**.
> ⚠️ Migraciones `2026_07_27_330001`–`330003`.
> **Reglas nuevas: un total en la cabecera no es una factura · una prueba que verifica UNA regla
> tiene que aislarla, o pasa por la razón equivocada · presupuestar no consume · una columna sin
> formulario es una función que no existe** (el opt-out de los recordatorios solo se podía cambiar
> en la BD; ahora está en la ficha del cliente, junto con el de cobranza de `[CXC-F2-3]`, que
> **también** estaba sin pantalla).

> **BANCOS post-cierre F4 (2026-07-26) — `[BAN-F4-FIX]` · DESPLEGADO EN PRODUCCIÓN**: el hilo común
> de lo que apareció al auditar fue **funcionalidad implementada y probada que el usuario no podía
> alcanzar desde la pantalla**. (1) Los **conceptos contables del módulo** (comisiones, cargos,
> intereses, ITBIS, dif. cambiaria y las dos cuentas por depositar) se configuran en
> `parametros.modulo-banc`, que existía pero **no estaba enlazada en el menú** — y el checklist
> mandaba a *Cuentas Contables*, que solo lista los de cada cuenta: el usuario habría dado vueltas
> buscando algo que no estaba ahí. Ahora hay un ítem *Conceptos Contables del Módulo* y el otro se
> llama *Cuentas Contables (por cuenta)*. (2) **`saldo_minimo` era una columna sin formulario**: la
> alerta de saldo bajo no podía dispararse nunca en producción. (3) La ventana de «pendientes de
> depositar» era una constante del código y pasa a `dias_pendientes_deposito` (cada cuánto deposita
> la empresa no es un detalle técnico). (4) Anti-patrón `currentCompany` en los parámetros contables
> de Bancos, que anulaba la validación de tenant, más una cuenta sin verificar que fuera de la
> empresa. **Verificado con prueba, no por inspección**: cero cuentas hardcodeadas (la prueba falla
> si aparece un literal de 4 dígitos), `company_id`+`empresa_id` en cabecera/líneas/movimiento con
> aislamiento entre empresas probado, guardas de tesorería reusadas, evento catalogado y los 6 KPIs
> del dashboard atados al servicio de analítica. **Checklist +3** (caja de cobros de CxC, cuenta
> transitoria solo si el interruptor está encendido, vigilancia de saldo mínimo). Suite Bancos
> **282**; regresión completa **1307 passed, 4 skipped, 0 failed**. ⚠️ Migración `2026_07_26_200004`.
> **Desplegado**: pull + 4 migraciones + caché + permisos; verificado en producción que las tablas
> nuevas son InnoDB (no-InnoDB en toda la BD: **0**), los 11 conceptos BANC están disponibles, el
> evento está catalogado y las 7 rutas de depósitos responden.
> **Reglas nuevas: una columna sin formulario es una función que no existe · un enlace del checklist
> es parte del checklist · dos pantallas parecidas necesitan nombres que se distingan · una
> constante que responde a «cada cuánto lo hace la empresa» es configuración.**

> **BANCOS FASE 4 (2026-07-26) — `[BAN-F4-1]`–`[BAN-F4-4]` + cierre `[BAN-F4]` · CIERRA EL
> BLUEPRINT DE BANCOS (F0→F4)**: relación con módulos, reportes y alertas de tesorería. Lo primero
> fue **verificar el ANEXO B con `git log` en vez de suponerlo**, y las dos dependencias resultaron
> distintas de lo que el blueprint daba por hecho: el concepto «cheques/efectivo por depositar»
> de CXC-F0-1 **no existía** (el commit sí, el concepto no), y CXC-F2-4 **ya tenía** el cheque
> devuelto funcionando con `revertirCobrada` — así que se extiende en vez de duplicarlo.
> **F4-1**: un cobro en efectivo o en cheque no está en el banco cuando se registra, está en la
> gaveta; y el banco lo verá como UN depósito por el total, no como N cobros. La boleta de depósito
> agrupa los pendientes y al confirmarla crea **UN** movimiento con su asiento — que es lo que
> **convierte el 1-a-N de la conciliación en un 1-a-1 exacto** (probado: un solo candidato por ese
> importe). Regla contable: el depósito acredita **la misma cuenta que el cobro debitó**
> (`caja_cobros` de CXC para el efectivo, `cheques_por_depositar` de BANC para los cheques);
> cualquier otra elección dejaría un saldo permanente en la cuenta de origen. Detrás de
> `usar_cheques_por_depositar` **apagado de fábrica**, pero la elegibilidad NO depende del
> interruptor (un cobro se puede depositar si no tiene movimiento bancario propio y no está ya en
> un depósito: un hecho, no una configuración) más un UNIQUE como segunda guarda.
> **F4-2**: ⚠️ **el saldo del banco NO bajaba al devolverse un cheque** —`recalcularSaldo()` solo
> excluye `anulado`, así que marcar el movimiento como `devuelto` no quitaba el dinero: el
> contra-asiento acreditaba el mayor mientras `saldo_actual` seguía contando un dinero que el banco
> ya se había llevado. Ahora se registra el **débito que el banco aplica de verdad** (que además es
> la línea del extracto a conciliar), sin asiento propio para no contar la devolución dos veces. Y
> un cheque **dentro de un depósito agrupado** ya se puede devolver: F4-1 había creado un caso que
> F4-2 no sabía atender, y es el caso normal. **F4-3**: `TesoreriaAnaliticaService` como fuente
> única de 6 reportes (flotantes con aging, posición consolidada multi-empresa, depósitos en
> tránsito, comisiones y cargos por banco, proyección de saldo, transferencias del período); cada
> uno declara su **cuadre contra la fuente y lo muestra en pantalla**, no solo en una prueba.
> **F4-4**: el dashboard tenía sus propias consultas y podía decir un flotante distinto al del
> reporte — reescrito para consumir el mismo servicio (**KPI == reporte por construcción**, con una
> prueba por KPI); y 3 alertas nuevas (saldo bajo mínimo, conciliación atrasada, cheque flotante
> antiguo) idempotentes, silenciables y con responsable sobre la infraestructura canónica de F1-3.
> **7 defectos reales** además de los dos del blueprint: la clave de la alerta de cheque devuelto
> hacía que **dos cheques del mismo depósito generaran una sola alerta**; la guarda de «conciliado»
> dejaba al tesorero sin salida en el caso normal; y las **pruebas de F4-1 pasaban con el asiento en
> estado `error`** porque `assertAsientoCuadrado` solo mira si las líneas cuadran entre sí, no si
> llegaron al mayor. **Suite Bancos: 266 pruebas** (de 218). Detalle en `app/zyntello-app/CLAUDE.md`
> y `app/zyntello-app/DISCREPANCIAS-bancos.md` (`D-BAN-F4-*` y la **LISTA CONSOLIDADA de 35 TODOs
> de verificación humana de TODO el blueprint**). ⚠️ Migraciones `2026_07_26_200001`–`200003`.
> **Reglas nuevas: un cambio que crea un caso nuevo debe revisar quién lo va a recibir · una guarda
> se pone sobre la ACCIÓN, no sobre el estado · un asiento que cuadra pero no se posteó no es un
> asiento · una alerta que salta todos los días enseña a ignorar las alertas · el software avisa,
> las decisiones con terceros son del humano (un cheque vencido NO se anula solo).**
>
> ⚠️ **Discrepancia corregida del blueprint (D-BAN-F4-3-1)**: la fórmula de la proyección de saldo
> («saldo + corridas − flotantes + tránsito») hace **doble conteo** — el cheque emitido YA descontó
> el saldo del libro desde F0-2, y un compromiso aprobado va a salir, así que se resta. Se
> implementan dos columnas correctas, cada una con su fórmula escrita en el código **y en la
> pantalla**: *disponible = saldo − compromisos* y *estimado en el banco = saldo − tránsito +
> flotantes*.

> **BANCOS FASE 3 (2026-07-26) — `[BAN-F3-1]`–`[BAN-F3-4]` + cierre `[BAN-F3]`**: importación de
> estados de cuenta flexible, del blueprint `zyntello-bancos-mejoras-blueprint.md`. El importador
> existía y funcionaba, pero el mapeo era **ad-hoc**: se autodetectaba en cada importación o vivía
> como un JSON suelto en `ban_entidades.formato_importacion`. Sin XLSX, sin encoding, sin forma de
> ver **por qué** una línea no entró, con reglas de cruce fijas y sin flujo para los cargos que el
> banco aplica solo. **F3-1**: un **perfil** (`ban_perfiles_importacion`) convierte el mapeo en una
> entidad con nombre — se configura UNA vez contra la descarga real y se reutiliza cada mes.
> **La compatibilidad es el diseño**: el importador actual ES el «perfil automático», y hay una
> prueba que compara **fila por fila** la cascada sin perfil contra el importador histórico (cascada:
> elegido a mano → cuenta → banco → legacy → automático; la cuenta manda porque dos cuentas del
> mismo banco pueden descargar en formatos distintos). Se construye **SOBRE** el importador:
> `aConfig()` devuelve el MISMO array que `parsearConConfig()` ya consumía, y solo se añadieron
> claves **opcionales** — `col_tipo` (columna D/C, que solo tenía la autodetección: un banco con
> «monto + tipo» era imposible de mapear a mano), `fila_inicio` (el preámbulo de titular/período/
> saldos) y palabras clave propias. Semillas RD (Popular, BHD, Banreservas) **inactivas** y
> `verificado=false`. **F3-2**: asistente de 4 pasos que muestra las **filas crudas del archivo del
> usuario** con un combo encima de cada columna; **XLSX con PhpSpreadsheet** —la librería que ya usan
> los exports del Ministerio de Trabajo— leído a filas y de ahí a TSV, así que desde ese punto hay
> **una sola ruta de parseo**; Latin-1 detectado y convertido; y **nada se descarta en silencio**:
> cada línea no leída se reporta con su número, su contenido y el motivo nombrando el dato concreto,
> separando los descartes esperados (encabezado, preámbulo) de las filas con datos que quedaron
> fuera. **F3-3**: reglas por cuenta (`ban_reglas_matching`) cuyos **defaults son el matching
> histórico** —hay una prueba que reproduce el fixture del golden master F0-0— y la regla que
> sostiene la tarea: **solo los cruces EXACTOS se auto-concilian**. Un probable (número de cheque
> leído del texto, importe aceptado por tolerancia, o suma de varios movimientos 1-a-N) se propone y
> espera, porque cuadrar una conciliación con un par equivocado es peor que dejarla pendiente: nadie
> vuelve a mirar lo que ya aparece cuadrado. **F3-4**: la partida no reconocida se convierte en
> movimiento + asiento + conciliado **en un clic** (la contabilidad ya vivía en `CargoBancarioService`
> desde F0-2, que decía «es lo que consumirá F3-4»), con **aprendizaje por cuenta**: el patrón se
> normaliza sin dígitos —los bancos meten el número de cuenta o el mes en la glosa— así que
> «Comisión manejo cta 4471» y «COMISION MANEJO CTA 9982 FEB» son el mismo patrón, y el mes siguiente
> se sugiere solo. **5 bugs reales**: (1) ⚠️ **`parsearFecha()` no validaba el calendario** —
> `31/13/2026` volvía como `'2026-13-31'` y reventaba lejos de la causa, al guardar; (2) ⚠️ **el signo
> DELANTE del importe se perdía** — con UNA sola columna de importe un cargo de `-1,500.00` se leía
> como **depósito**, y el extracto no descuadra por poco sino por el doble (la ruta con mapeo sí lo
> respetaba: las dos rutas del mismo servicio no coincidían); (3) `createFromFormat()` rueda el mes
> sin avisar, así que un formato equivocado **guardaba fechas inventadas** en vez de fallar;
> (4) el orden de preferencia de los patrones era **parcial** (pasaba aislada, fallaba en la suite) y
> estaba **duplicado** entre servicio y pantalla: podía **sugerir un tipo y guardar otro**;
> (5) **`saldo_libros` quedaba obsoleto** al crear el movimiento desde el extracto — la diferencia
> mentía y **el mes no se podía cerrar aunque estuviera cuadrado**; las pruebas de F3-4 pasaban
> todas, solo apareció al escribir la aceptación end-to-end. **Suite Bancos: 203 pruebas.**
> Detalle en `app/zyntello-app/CLAUDE.md` y `app/zyntello-app/DISCREPANCIAS-bancos.md`
> (`D-BAN-F3-*` y "CIERRE DE LA FASE 3" con 9 TODOs de verificación humana). ⚠️ Migraciones
> `2026_07_26_100001`, `110001`, `110002`, `120001`. **Regla nueva: todo orden de preferencia tiene
> que ser TOTAL** (desempate final por `id`) — segunda vez que este defecto aparece en Bancos.
> ⚠️ **Trampa de entorno**: `phpunit.xml` declara `DB_PORT=3306` pero la BD de pruebas vive en el
> **3308**; sin el puerto la suite falla en 1062 pruebas con «Table company_modules doesn't exist»,
> que parece un desastre de código y es solo el puerto. **Correr `DB_PORT=3308 php artisan test`.**

> **BANCOS FASE 2 (2026-07-26) — `[BAN-F2-1]`–`[BAN-F2-3]` + cierre `[BAN-F2]`**: formatos de
> impresión de cheques del blueprint `zyntello-bancos-mejoras-blueprint.md`. El talonario del
> banco viene pre-impreso y cada banco pone la fecha, el beneficiario y el importe en otro sitio
> del papel; la impresión era **una vista fija**, que servía para papel blanco pero no para
> acertarle a la casilla. Ahora un **formato** (`ban_formatos_cheque`) guarda esas posiciones en
> **milímetros** —la unidad con la que se mide contra el cheque físico— y el motor
> (`ChequeFormatoService`, fuente única) las convierte en PDF con posicionamiento absoluto.
> **Compatibilidad total**: la cascada es cuenta → entidad bancaria → *ninguna* = vista CLÁSICA,
> así que mientras nadie asigne un formato ningún cheque imprime distinto. **F2-2**: editor donde
> **los inputs en mm son el camino exacto y siempre disponible** (son los campos reales del
> formulario) y el **arrastre es solo un acelerador** que redondea a 0.1 mm; **página de
> calibración** con regla milimetrada, marco, cuadrícula y un **control de escala de 100 mm** que
> hay que verificar con una regla real ANTES de medir nada (si la impresora escala, calibrar es
> adivinar); preview en vivo, cheque de prueba con guías, duplicar (copia **inactiva**) y dos
> formatos base sembrables, también inactivos porque son una aproximación y no una medida.
> **F2-3**: **voucher** que contesta las tres preguntas que el cheque solo no contesta — qué se
> pagó (facturas de CxP con NCF/e-NCF), qué se retuvo (**CXP F1**, verificado con `git log` antes
> de integrar: sin esta sección el comprobante *parece* descuadrado) y cómo quedó registrado (el
> asiento del egreso, consolidado por cuenta y con su cuadre; si no llegó al mayor lo dice en el
> papel) + firmas configurables; y el **lote agrupa por formato** porque un PDF no puede mezclar
> tamaños de página. **4 bugs reales**: (1) ⚠️ **el monto en letras tenía 4 defectos que se
> imprimían HOY en cheques de producción** — 21,000 salía como «VEINTIUNO MIL PESOS» y 1.00 como
> «UN PESOS»; una letra que no concuerda con la cifra es motivo de rechazo en ventanilla. El
> helper existía y no tenía **una sola prueba**; ahora tiene 70; (2) el voucher **no era
> determinista** (dos copias del mismo comprobante listaban las facturas en distinto orden); (3)
> las coordenadas perdían el tipo al pasar por JSON; (4) `ban_cuentas.layout_cheque` y
> `firma_imagen_path` eran columnas huérfanas preexistentes. **Suite Bancos: 155 pruebas.
> Regresión completa del ecosistema VERDE: 1181 passed, 4 skipped, 0 failed** — de 1061 a 1181
> (+120), sin regresiones. Detalle en `app/zyntello-app/CLAUDE.md` y
> `app/zyntello-app/DISCREPANCIAS-bancos.md` (`D-BAN-F2-*` y "CIERRE DE LA FASE 2" con 9 TODOs de
> verificación humana). ⚠️ Migraciones `2026_07_25_210001`–`210002`. **Regla: imprimir ≠ emitir**
> — el motor solo lee y dibuja, y en el lote la impresión se cuenta cuando el documento se genera,
> no al elegir el grupo.

> **BANCOS post-cierre F3 (2026-07-26) — `[BAN-F3-FIX]`**: corrección de las 2 discrepancias
> abiertas + las decisiones humanas de la fase llevadas a pantalla. **(1) D-BAN-F3-5**: el XLSX
> **truncaba en silencio** a 5,000 filas — devolvía lo leído como si el archivo terminara ahí, y un
> extracto de un mes movido pasa de 5,000 líneas sin esfuerzo. Es la peor forma de fallar: la
> conciliación se importa "bien", cuadra *casi*, y la diferencia son los movimientos que nadie sabe
> que faltan (nadie revisa lo que ya aparece importado). Ahora el tope es 20,000 y **se detiene con
> un mensaje que dice qué hacer**. **(2) D-BAN-F3-6**: el agrupado manual tenía la tolerancia
> **hardcodeada en 1 centavo** mientras el matching automático de la misma cuenta leía
> `ReglaMatching::tolerancia_monto` — una cuenta con tolerancia de 5.00 aceptaba sola una diferencia
> de 2.50 pero **rechazaba el mismo grupo armado a mano**, sin explicación. **(3)** Un criterio
> duplicado en 2 vistas (clasificación de descartes esperados) unificado en el servicio: **tercera
> vez** que aparece esta forma de defecto en Bancos (F2-3, F3-4). **3 opciones nuevas en
> Configuración del módulo** con defaults = comportamiento de cierre y prueba dedicada a eso:
> `exigir_perfil_verificado` (OFF), `bloquear_import_con_descartes` (OFF, distingue el encabezado
> de las filas con datos: sin esa distinción ningún CSV importaría) y
> `aprender_conceptos_extracto` (ON). **Pantalla nueva «Conceptos del Extracto»** que cierra el
> TODO #7 de la fase: el catálogo que sugiere el tipo de cargo solo vivía en la tabla, sin ningún
> sitio donde revisarlo, y un patrón demasiado corto sugiere el tipo equivocado el mes siguiente
> hasta que el asiento sale contra la cuenta incorrecta. **Checklist ampliado** (cuentas sin perfil
> —las nombra—, perfiles activos sin verificar, conceptos aprendidos). **`phpunit.xml` ya declara
> `DB_PORT=3308`**: la trampa de los 1062 fallos por olvidar el override no puede repetirse.
> **`CLAUDE.md` de la app ahora se versiona**, tras quitarle la clave real de `/zyn-maint` que
> estaba en 2 URLs en texto plano. **Suite Bancos: 218 pruebas** (de 204). ⚠️ Migración
> `2026_07_26_130001`. **Reglas: un tope que no avisa es peor que no tener tope · la misma
> pregunta, un solo número · no fijar el conteo de una lista que va a crecer.**

### Bitácora anterior (2026-07-25)

> **TODO EL ESQUEMA A InnoDB — migraciones portables (2026-07-25)**: pedido del usuario para
> poder **mudar de servidor sin errores**. El motor se colaba por dos vías y las dos están
> cerradas: (1) `config/database.php` tenía `'engine' => null` en las 3 conexiones MySQL, así
> que cada `Schema::create()` heredaba el `default_storage_engine` del host (MyISAM en el MySQL
> de WampServer) → ahora es **`'engine' => 'InnoDB'` explícito**, la corrección de raíz;
> (2) el squashed schema `database/schema/mysql-schema.sql` traía **36 `ENGINE=MyISAM`** que un
> servidor nuevo heredaba aunque su default fuera InnoDB → parcheado a **468/468 InnoDB**
> (diff confirma que el motor es el único cambio). Para las BDs ya desplegadas, migración
> `2026_07_25_200001_convertir_todas_las_tablas_a_innodb`: idempotente, no altera datos ni
> columnas, y si una tabla no se puede convertir lo registra en el log sin abortar el deploy.
> **Verificación de la mudanza hecha, no supuesta**: BD vacía + `migrate` completo → **948
> migraciones, 0 errores, InnoDB 516 / no-InnoDB 0** (antes 437/79). Desarrollo y testing
> también en 516/0. Blindado con `tests/Feature/EsquemaInnoDbTest.php` (3 pruebas: esquema,
> conexiones y dump) — revertir cualquiera de las tres vías rompe la suite. ⚠️ **No volver
> `'engine'` a `null`**. En MyISAM `DB::transaction()` no revierte y `lockForUpdate()` es un
> no-op: afectaba a `users`, `companies`, `nom_employees`, `nom_payroll_results`,
> `cxc_provisiones`, `cxp_corridas`, los 15 `af_*`, `pg_*` y más.

> **BANCOS FASE 1 (2026-07-25) — `[BAN-F1-1]`–`[BAN-F1-3]` + cierre `[BAN-F1]`**: chequeras
> (talonarios) del blueprint `zyntello-bancos-mejoras-blueprint.md`. Antes la numeración de
> cheques era un correlativo suelto sin rangos comprados al banco, sin activación/agotamiento y
> sin control del talonario. **F1-1**: el control vive detrás de **DOS interruptores apagados de
> fábrica** — `ban_config.gestion_chequeras` ("Manejo de chequeras" en Configuración del módulo,
> pedido explícito del usuario) + `ban_cuentas.usa_chequeras` (por cuenta, como pide el
> blueprint); con cualquiera apagado la numeración es la histórica y el golden master no se mueve.
> `ChequeraService` es fuente única: toma el número de la chequera **activa** con
> `lockForUpdate()`, agota el talonario y exige activar el siguiente, rechaza solapes de rango y
> garantiza una sola chequera activa por cuenta. Pantalla de **Chequeras** + selector de chequera
> al emitir + comando `bancos:migrar-chequeras` que **por defecto solo simula**. **F1-2**: las
> hojas dañadas/robadas/perdidas se anulan **en blanco** — el número queda consumido con motivo y
> el próximo cheque salta —, y el reporte **Secuencia de Chequera** explica cada hoja del rango
> (5 estados) con el cuadre "total explicado == hojas del talonario". **F1-3**: alertas
> idempotentes por día (`bancos:alertas`, 06:25) con 3 tipos de chequera, silenciables, con
> responsable y master-switch de correo apagado; tarjeta de chequeras en la cuenta bancaria.
> **3 bugs reales**: (1) ⚠️ **el servidor usaba `default_storage_engine = MyISAM`** → `lockForUpdate()`
> era un no-op y `DB::transaction()` no revertía (dos emisiones simultáneas habrían repetido el
> número); afectaba a **79 tablas del ecosistema** y quedó **resuelto por completo** (ver la
> entrada siguiente); (2) el
> dry-run repetía cuentas homónimas de distintas empresas; (3) la migración inventaba talonarios
> históricos de hojas fantasma; (4) `conUso()` adjuntaba el uso como atributos dinámicos de
> Eloquent (un `save()` posterior habría dado *Unknown column*); (5) la emisión de cheques de
> nómina no atrapaba la excepción → 500 en vez del mensaje accionable.
> **Suite Bancos: 106 pruebas. Regresión completa del ecosistema VERDE: 1058 passed,
> 4 skipped, 0 failed (6198 asserts)** — de 1004 a 1058, sin regresiones. Detalle en
> `app/zyntello-app/CLAUDE.md` y `app/zyntello-app/DISCREPANCIAS-bancos.md` (`D-BAN-F1-*` y
> "CIERRE DE LA FASE 1" con los 8 TODOs de verificación humana). ⚠️ Migraciones obligatorias
> `2026_07_25_170001`–`170004`, `180001`, `190001`–`190002`.

### Bitácora anterior (2026-07-24)

> **BANCOS FASE 0 (2026-07-24) — `[BAN-F0-0]`–`[BAN-F0-3]`**: arranca `zyntello-bancos-mejoras-blueprint.md`
> (tesorería). **F0-0** golden master de 10 pruebas que congela las 6 letras del blueprint, incluida
> una **conciliación completa** (abrir → extracto CSV demo → match automático → conciliación manual →
> cerrar). **F0-1** las 5 guardas con `GuardasBancariasService` como fuente única — la clave: **un
> cheque que pagó CxP o nómina ya NO se anula suelto desde Bancos**, el mensaje dirige a reversar el
> pago en su módulo origen (la cascada inversa sigue intacta). **F0-2** asientos de tesorería: la
> transferencia multimoneda ahora registra **comisión y diferencia cambiaria** (antes ambas piernas
> usaban el mismo importe y se perdían 300 funcional en el caso demo), el **cheque directo** deja su
> asiento, y nuevo `CargoBancarioService` (comisión/cargo/interés/ITBIS) que consumirá F3-4; incluye
> la **auditoría del proceso "Generar asientos"** que pedía el blueprint. **F0-3** aprobación de
> egresos sobre umbral: `ban_config` por empresa (0 = desactivado) + pantalla "Configuración del
> módulo"; un cheque sobre el umbral queda pendiente **sin tocar el saldo**, y los egresos ya
> aprobados (corrida CxP, nómina) pasan directo. **F0-4** cierra las 2 discrepancias abiertas: el
> cheque de nómina ya registra su asiento (`NOM_PAGO_CHEQUE`, del lado de Nómina que es su dueño) y
> la pantalla de Procesos aclara que "Generar asientos" reprocesa todos los módulos; además las
> decisiones humanas pasan a la Configuración del módulo (`permitir_anular_cheque_de_pago` OFF,
> `dias_vigencia_cheque` 180) con un **checklist que evalúa solo** qué conceptos y cuentas faltan y
> si el umbral está activo sin flujo. **4 bugs reales corregidos** que no estaban en el
> blueprint: los updates masivos de movimientos no disparaban el observer y dejaban el saldo
> desfasado; el cheque directo no asentaba; los contra-asientos salían sin líneas (el mayor nunca
> volvía a cero); `ban_cheques` tenía las columnas de aprobación fuera del `$fillable`. Suite Bancos:
> **47 pruebas, 255 aserciones**. **Regresión completa del ecosistema VERDE: 999 passed, 4 skipped,
> 0 failed (5962 asserts)** — de 952 a 999, sin regresiones. Detalle en `app/zyntello-app/CLAUDE.md` y
> `app/zyntello-app/DISCREPANCIAS-bancos.md` (secciones `D-BAN-F0-*` y "CIERRE DE LA FASE 0" con la
> **LISTA CONSOLIDADA de TODOs de verificación humana**). ⚠️ Migración `2026_07_24_170001` obligatoria
> en producción; configurar los 6 conceptos contables nuevos de BANC por empresa.

> Ultimo commit en **zyntello-app**: `[SESION-DISPOS-2]` `baa3779e` (**cerrar sesion en todos los
> dispositivos** + **blueprint de 2FA con app (TOTP), sin ejecutar**. ⚠️ `Auth::logoutOtherDevices()`
> **no cierra nada por si mismo** —depende de `AuthenticateSession`, que este proyecto no registra—
> y borrar las filas de `sessions` **tampoco basta** con «Recordarme»: hay que reciclar el
> `remember_token`. ⚠️ El 2FA por correo YA EXISTE y `bacon/bacon-qr-code` YA esta instalado).
> Anterior: `[SESION-LOOP-1]` `557f8b55` (**el bucle de redirecciones y la
> sesion que expiraba sola**: el manejador generico se tragaba la `AuthenticationException` —no es
> `HttpException`— y redirigia a `url()->previous()`, o sea a la pantalla de la que se venia, que
> tambien esta protegida: **ping-pong entre las dos ultimas paginas**. Y el cache de Bluehost le
> añadia un `max-age=300` encima del `no-cache` de Laravel, asi que **el bucle lo ejecutaba el
> navegador sin tocar el servidor**. La sesion pasa a durar **hasta que se cierre el navegador**.
> DESPLEGADO: las 5 pantallas protegidas van a `/login` en UN salto y la cookie ya no lleva
> `Max-Age`).
> Anterior: `[INV-CFG-EMP-2]` `8c58fa92` (**cuatro sintomas, una raiz: la
> configuracion era por SUSCRIPTOR**. Un `required` en una pestaña inactiva no es focusable y el
> navegador **cancela el envio sin avisar** —y el evento `submit` NO se dispara, asi que el aviso
> va en `invalid`—; `inv_config_inventario` tenia el UNIQUE en `(company_id)`, asi que la 2ª empresa
> reventaba con «Duplicate entry» y las que no tenian fila **descartaban los codigos de barra en
> silencio** (medido: **0 en toda la base**); dos seeders pedian un codigo de impuesto que ya no se
> genera; **un ajuste sin costo entraba a CERO** y diluia el promedio de la bodega; y la pantalla de
> alta de tipos de transaccion **reventaba con un 1054** mientras el consumo de Car Wash **nunca
> pudo correr** por un valor que el ENUM no admitia. DESPLEGADO: codigos de barra **0 → 57**,
> ARE-001 y BLO-001 ya se leen).
> Anterior: `[FACT-SIMPLE-2]` `11497999` (**cambiar la lista de precios no refrescaba las lineas**:
> las vistas de EDICION tenian el selector y NO el manejador, y el endpoint solo consultaba la lista
> ELEGIDA. La cascada pasa a fuente unica y se borran las 3 copias).
> Anterior: `[PERM-BUNDLE-1]` (**Caja Chica no abria: el permiso se pedia
> por el slug de la SUSCRIPCION** (`erp`) y no por el de la PANTALLA (`cajachica`), que es el que el
> owner marca. El menu SI usaba la regla correcta, asi que el item se veia y no se abria).
> Anterior: `[FACT-SIMPLE-1]` (**captura simple + ITBIS opcional +
> accesibilidad del tema claro**: el texto invisible en claro era OPACIDAD, no tono — 825
> reemplazos en 296 vistas y los colores pasan a variables CSS. La pantalla simple y el cobro de
> ITBIS son dos ejes INDEPENDIENTES. ⚠️ De paso: la bodega salia de una columna que NO EXISTE, y
> la configuracion fiscal era por SUSCRIPTOR — la segunda empresa no podia guardar la suya).
> Anterior: `[INV-PARAM-2]` (**las cuentas contables no se
> adivinan**: se retiro la busqueda por rango de codigo —en el plan de Agua Yamel resolvia el
> costo de ventas contra «Planilla»— y la sustituye un verificador de solo lectura. Cero
> cuentas hardcodeadas en `app/`. ⚠️ Agua Yamel: jerarquia aplicada, 29 cuentas con padre).
> Anterior: `[GEO-EST-1]` `187b24ea` (**la division geografica se
> llama `estado` en todo el ecosistema**: de las 133 columnas `estado` solo 8 son geograficas y
> `inv_bodegas` era la unica desviada; el ROTULO lo resuelve el pais. ⚠️ De paso: el DGT-9
> exportaba la Provincia en blanco).
> Anterior: `[VTA-MES-4]` `94cdf013` (**un solo link**: la matriz
> mensual pasa a ser pestana del Analisis de Ventas — el menu tenia dos entradas para lo
> mismo. ⚠️ Los dos filtros compartian el id del formulario: Aplicar habria enviado siempre
> el primero del DOM).
> Anterior: `[VTA-MES-3]` `c5b543af` (**Ventas por Articulos y
> Pre-Venta en el Analisis de Ventas**: de las ocho pestanas de Hyplast, seis ya existian.
> La cantidad declara la unidad de medida de cada articulo — Zyntello no factura solo cajas.
> ⚠️ Tres defectos que solo aparecieron midiendo los festivos REALES: el dia de la semana se
> leia del anio del ALTA, el mismo feriado contaba dos veces, y la proyeccion se apagaba la
> primera semana de cada mes).
> Anterior: `[VTA-MES-2]` `ff7e2217` (**el reporte de ventas
> mensuales tambien desde Inventario**: cada modulo declara SU PROPIA ruta al mismo
> controlador — el menu de un modulo nunca lista la ruta dueña de otro).
> Anterior: `[VTA-MES-1]` `8fef656c` (**los filtros solo se podian
> cerrar haciendo clic fuera**: la pantalla de la captura no existia en el ecosistema —era de
> Hyplast— y se construyo; cada desplegable trae Aplicar y Cerrar, y cerrar DEVUELVE la
> seleccion a lo aplicado).
> Anterior: `[PICK-UBI-1]` `a2aed911` (**el picking sigue el
> recorrido del almacen**: toda la cadena de ubicaciones estaba MUERTA —12 huerfanas, 0 de 51
> stock ubicado, sin pantalla—; ahora hay CRUD con orden de recorrido y el picking se prepara
> de arriba abajo sin devolverse).
> Anterior: `[PICK-UX-1]` `7653878e` (**el alta de picking
> mostraba los dos combos y generaba a ciegas**: el `x-show` iba sobre el `<select>` y TomSelect
> lo reemplaza con su wrapper; ahora previsualiza en once columnas con lotes y seriales).
> Anterior: `[CRM-EMAIL-1]` `6d451171` (**las credenciales de
> correo salian del .env**: en un SaaS el suscriptor no puede tocarlo — medido, la funcion
> nunca sirvio para nadie. Ahora por empresa, cifradas, con OAuth y SMTP).
> Anterior: `[INV-LOTE-1]` `068afc8f` (**el dashboard mostraba
> 300 lotes sin articulo**: el seeder borraba los articulos y nunca los lotes, y sin FK el
> huerfano nace en el acto — 74 750 unidades de stock fantasma, TODAS de la cuenta demo).
> ⚠️ **PENDIENTE declarado: ~1 000 pantallas del ecosistema sin ayuda** (Inventario al 1 %,
> PSA y Nomina al 2 %); documentarlo son varias sesiones y el orden es decision de alcance.
> Anterior: `[CTAS-STD]` `5e2f1b40` (**las 11 pantallas de
> Cuentas Contables al formato del modelo**; de paso: Condominios no estaba en el catalogo
> contable y Prestamello escondia 4 conceptos que nadie podia configurar). Anterior: `[RUTAS-1]` `318cd91b` (**siete pantallas del menu
> no se podian abrir**: un comodin declarado antes las interceptaba — entre ellas provision de
> incobrables, castigos y dunning, que `[CXC-F4]` entrego completas). Anterior: `[CONT-CTA-6]` `0c574cdc` (**el combo de cuentas
> contables ofrecia el plan de OTRA empresa del mismo suscriptor** — `->first()` sobre las
> activas del tenant en vez de la empresa ACTIVA; verificado en produccion: cero cuentas
> ajenas en las 6 empresas). Anterior: `[AGENTES-2b]` `fdabae39` (**la consolidacion
> multiempresa nunca pudo ejecutarse** —siete columnas inexistentes y todo el modulo en el
> espacio de ids viejo tras `[#833]`—, **ninguna linea de Compras vuelve a nacer sin
> articulo** en los cinco puntos de captura, y **el usuario interno ya se puede hacer
> cobrador**. Medido antes de desplegar: **Agua Yamel no usa Compras, impacto CERO**; las 41
> lineas historicas sin articulo son de las dos empresas de PRUEBA. ATENCION: siguen los
> asientos de produccion **sin mayorizar** —postear es decision contable— y
> `cont_homologaciones_cuenta` sigue **sin pantalla**)
| Ultimo commit en **zyntello-admin**: `[#506]` `2283952`
> | Ultimo commit en **zyntello-website**: `ad072f43`

> **CONDOMINIOS correcciones post-cierre (2026-07-24) — `[CND-FIX]`/`[CND-CONFIG]`**: (1) discrepancia D-CND-F3-2 resuelta (incidencias con `area_id`, reporte por área); (2) export de reportes a **Excel real** (.xlsx Maatwebsite) en vez de CSV; (3) **decisiones seleccionables llevadas a "Configuración del módulo"** (`cnd_config`, por empresa: privacidad del informe, voto remoto por defecto, portal reservas/incidencias ON/OFF); (4) **fix del bucle del combo de módulos** — el menú de Condominios enlazaba dashboards de OTROS módulos (CxC/CxP/Presupuesto/Bancos/Caja/Nómina) y eso rompía la detección de módulo activo (esas rutas quedaban "compartidas" y al abrir CxC desde el combo se quedaba en Condominios). Se quitaron; los módulos se abren desde el combo. Migraciones aditivas `160001`/`160002`. **Regla nueva: nunca listar en el menú de un módulo el dashboard/ruta dueña de otro módulo.** Regresión completa VERDE: 952 passed, 4 skipped, 0 failed.

> **CONDOMINIOS — blueprint de mejoras COMPLETO (2026-07-24) — `zyntello-condominios-mejoras-blueprint.md` ejecutado íntegro F0→F4** (`[CND-F3-1]`…`[CND-F4]`), un commit por tarea. Endurecimiento QA sobre el módulo Condominios ya existente (F1..F7 + fiscal). **F3 informes**: `CondominioReporteService` como FUENTE ÚNICA — reportes financieros (ingresos vs gastos, cobranza mensual, antigüedad de saldos, fondo histórico) + operativos (uso de áreas/hora pico, incidencias, comunicaciones/tasa de fallo) con export CSV+PDF, e **informe compuesto de asamblea** (PDF con portada + 6 secciones + flag de privacidad) que se **adjunta a la convocatoria**. **F4 portal + voto + limpieza**: portal del residente ampliado bajo el MISMO token `/p/condominio/{token}` (estado de cuenta PDF, historial de pagos con comprobante, solicitar reserva que respeta el traslape, reportar incidencia con foto); **voto remoto** por asamblea (flag `permite_voto_remoto` default OFF → sin él 404; ponderado por alícuota reusando `Voto::updateOrCreate`; unidad sin alícuota bloqueada); comando `condominios:limpiar-demo` (dry-run + `--confirmar`) que **PROTEGE** todo condominio con CxC cobrada/facturada. Verificación mostrada sin confirmar borrado: `condominios:verificar-integridad` = "Integridad OK"; `limpiar-demo --prefijo="QA" --dry-run` = sin QA en el entorno. **Regresión completa del ecosistema VERDE: 950 passed, 4 skipped, 0 failed (5658 asserts).** Detalle en `app/zyntello-app/CLAUDE.md` (Sesión 2026-07-24 CONDOMINIOS) y **LISTA CONSOLIDADA de TODOs de verificación humana** al final de `app/zyntello-app/zyntello-condominios-mejoras-blueprint.md`. ⚠️ Migraciones aditivas `130001`/`140001`/`150001` (guardas `hasColumn`); cron `schedule:run` obligatorio para los automatismos F1; flags de comportamiento nuevo (voto remoto) **default OFF**.

> **COMPRAS blueprint COMPLETO (2026-07-24) — `zyntello-compras-mejoras-blueprint.md` ejecutado íntegro F0→F4** (`[COM-F0-0]`…`[COM-F4-3]`), un commit por tarea. **F0**: golden master + recosteo proporcional al stock real en la liquidación (defecto #4) + blindaje fiscal del documento del proveedor. **F1**: IA para leer facturas (multi-proveedor Anthropic/OpenAI/Google, **API key cifrada por tenant**, `Http::fake` en tests) con **revisión humana obligatoria** — la factura nace por `InvoiceService`, sin ruta paralela. **F2**: notificaciones al comprador por evento de embarque (idempotente, soft-fail) + motor `compras:alertas` (5 tipos default OFF) + abastecimiento que CONSUME `SugeridoCompraService` de INV-F5 (requisición 1-clic). **F3**: **defecto #5** corregido (asiento de liquidación acreditaba el control CxP por gastos sin documento CxP y `anular()` no reversaba → crédito coherente CxP-real/puente `gastos_liquidacion_por_pagar` + contra-asiento GL neto 0, `asiento_json` persistido) + **defecto #6** (provisión de landed cost estimado al recibir, flag OFF, la liquidación ajusta la diferencia y salda a 0) + hoja de costos (CSV) + trazabilidad del costo por artículo. **F4**: cycle time por etapa (dónde se atora) + PPV/ahorro negociado/maverick spend + Proveedor 360 (una consulta agregada por bloque, sin N+1). **Reglas nuevas**: la reversa del hub (`revertirEvento`) ahora **propaga `empresa_id`** (contra-asiento en la empresa correcta); `{MOD}_ANULACION` se construye dinámico (nunca hardcodear el evento); 3 conceptos COM nuevos (`ajuste_costo_liquidacion`/`gastos_liquidacion_por_pagar`/`provision_landed_cost`) → `pendiente_configuracion` si no se mapean, NUNCA caen en CxP. **Regresión completa del ecosistema VERDE: 867 passed, 4 skipped, 0 failed (5365 asserts).** Detalle en `app/zyntello-app/CLAUDE.md` (Sesión 2026-07-24 COMPRAS) y `app/zyntello-app/zyntello-compras-mejoras-blueprint.md` (secciones `D-COM-*`, "CIERRE DEL BLUEPRINT DE COMPRAS" con **LISTA CONSOLIDADA de TODOs de verificación humana**). ⚠️ Cron `schedule:run` obligatorio para `compras:alertas` (06:40); migraciones aditivas `130003`/`130004`/`140001`/`140002`/`150001`; flags de comportamiento nuevo (landed estimado, alertas) **default OFF**.

> **CxP FASE 4 (2026-07-24) — CIERRA el blueprint CxP (F0–F4)** — reportes, KPIs y conciliación. **F4-1**: `CxpAnaliticaService` (espejo de `CxcAnaliticaService`) como FUENTE ÚNICA de 8 reportes nuevos + el dashboard — DPO (mensual+tendencia), aging con buckets y drill-down, proyección de pagos (vencimientos libres + corridas, sin doble conteo), pronto pago aprovechado/perdido, retenciones efectuadas, pagos por método/banco/día, anticipos vigentes, compras vs pagos; cada reporte **cuadra vs su fuente** (test reproduce el número a mano). ⚠️ **Discrepancia blueprint↔código corregida**: el pronto pago vive en `condiciones_pago` (`descuento_pronto_pago_pct`/`dias_descuento`), NO en `pur_payment_terms` (que no existe como tabla de descuentos). **F4-2**: conciliación del estado de cuenta del proveedor (`ConciliacionProveedorService`) — CSV pegado/subido, parser flexible, match por `numero_documento_externo` (fallback e-CF/interno) + monto con **tolerancia configurable** (`cxp_config.tolerancia_conciliacion_monto`), **3 clases de diferencia** (solo ellos / solo nosotros / pagos no aplicados), c/test. **F4-3**: dashboard reescrito con **KPIs == reportes** (todos de `CxpAnaliticaService`, no ad-hoc) + alertas patrón canónico del ecosistema (`cxp_alertas` + `cxp_alertas_config` silenciable + responsable) — `AlertasCxpService::evaluar` (5 tipos) + comando `cxp:alertas` idempotente por día (06:20), master-switch `notificar_responsable` + `AlertasCxpMail` soft-fail. **Config del módulo** (`cxp.config.edit`): consolida flags F0/F3 + tolerancia F4-2 + alertas F4-3. Un commit por tarea `[CXP-F4-1]`–`[CXP-F4-3]` + `[CXP-F4]` (config+discrepancias) + cierre `[CXP-F4]` `dc00e676`. `AceptacionFase4Test` (4 entregables end-to-end, 25 asserts) + `CxpAnaliticaTest`(9)/`CxpConciliacionTest`(8)/`CxpAlertasTest`(6)/`CxpConfigTest`(2). **Regresión completa del ecosistema VERDE: 812 passed, 4 skipped, 0 failed.** Detalle en `app/zyntello-app/CLAUDE.md` (Sesión 2026-07-24 CxP FASE 4) y `app/zyntello-app/DISCREPANCIAS-cxp.md` (secciones D-CXP-F4-*, CIERRE FASE 4 y **LISTA CONSOLIDADA de TODOs de verificación humana de todo CxP**). ⚠️ Cron `schedule:run` obligatorio para `cxp:alertas`; migraciones aditivas `100010`–`100012`.

> **CxP FASE 3 (2026-07-23)** — interacción plena con documentos electrónicos recibidos. **F3-1**: `ValidacionFiscalService` (formato NCF/e-NCF + dígito verificador RNC/cédula, SIEMPRE local) + consulta DGII **online opcional** (`cxp_config.validar_ncf_dgii_online`, cacheada/tolerante: si no responde → `sin_validar` + `RevalidarEcfCxpJob` + comando `cxp:revalidar-ecf`; **nunca bloquea el registro**); badge en CxP y `ecf_registros`. **F3-2**: buzón `pur_ecf_recibidos` (dominio Compras por diseño F1-7) — import XML del e-CF del proveedor, parser contra estructura DGII, dedup por RNC+e-NCF, pre-carga la factura de proveedor reusando `InvoiceService::capturarSinOC` (o `EcfRegistro` directo para gastos sin OC); FUENTE ÚNICA, no duplica. **F3-3**: aprobación comercial 30 días (`aprobacion_comercial`), estructura ACECF (`EcfAcuseService`) + **transmisión DGII = TODO** (reusa certificado del emisor), aprobado tácito al vencer + alerta por vencer (`cxp:ecf-aprobacion`). **F3-4**: `CxpService::estadoEcfPago` como guarda de pago (NCF inválido o e-CF rechazado comercial → advertencia, o bloqueo con `cxp_config.bloquear_pago_ecf_invalido`), reporte `ecf-ncf` enriquecido con validación + **conciliación contra el 606** (`DgiiTxtService::generar606`, fuente canónica CONT). Un commit por tarea `[CXP-F3-1]`–`[CXP-F3-4]` + cierre `[CXP-F3]`. `AceptacionFase3Test` (5 entregables end-to-end, 21 asserts) + `CxpValidacionFiscalTest`/`CxpEcfRecepcionTest`/`CxpEcfAprobacionComercialTest`/`CxpEcfEstadoPagoTest`. Regresión completa del ecosistema VERDE. Detalle en `app/zyntello-app/CLAUDE.md` (Sesión 2026-07-23 CxP FASE 3) y `app/zyntello-app/DISCREPANCIAS-cxp.md` (secciones D-CXP-F3-* y CIERRE FASE 3). ⚠️ Buzón e-CF = prefijo `pur_` (Compras), no `cxp_`; ejes separados `estado` (recepción) vs `aprobacion_comercial`; catálogos DGII/endpoint online/XSD/transmisión ACECF son de REFERENCIA (verificación humana + cron `schedule:run` obligatorio).

> **CxP FASE 1 (2026-07-22)** — el hueco fiscal RD: retenciones al PAGAR al proveedor (opuestas a las RECIBIDAS de CxC-F3-3 → aquí la retención es un PASIVO que la empresa retiene y liquida con la DGII, y SÍ genera asiento). Catálogo `cxp_tipos_retencion` sembrado RD de **referencia** con norma/fuente + vigencia + **`verificado=false` ⚠** (verificación humana obligatoria: ITBIS 100% Norma 08-04, ITBIS 75%/30%, ISR 10% honorarios/alquileres Art. 309 CT, 5% Estado Ley 253-12 — editables); config de qué retenciones aplican **en el proveedor** (`cxp_proveedor_retenciones`). Al pagar: **Convención A** (`cxp_pagos.monto`=BRUTO, salda la CxP; saldos/aging intactos), del banco sale el NETO, y el asiento suma **DR CxP total / CR banco neto / CR retenciones por pagar por tipo** (cuenta del catálogo, fallback concepto módulo). Comprobante de retención PDF numerado (`RET-`, ConsecutivoService) + email encolado; sus datos **alimentan el 606** (`DgiiTxtService::generar606` consume `RetencionCxpService::resumen606`, aditivo/guardado — no reimplementa el TXT). **IR-17** mensual (`Ir17Controller`): ISR retenido por tipo de renta con casillas de **referencia** (⚠ TODO layout oficial DGII) + detalle por proveedor, cuadra contra los comprobantes emitidos; ITBIS va al IT-1. Un commit por tarea `[CXP-F1-1]`–`[CXP-F1-3]` + cierre `[CXP-F1]`. `AceptacionFase1Test` (proveedor informal ITBIS 100% + ISR 10% end-to-end vía el controlador) + `CxpRetencionTest`/`CxpRetencionComprobanteTest`/`CxpIr17Test`. Regresión completa del ecosistema VERDE. Detalle en `app/zyntello-app/CLAUDE.md` (Sesión 2026-07-22 CxP FASE 1) y `app/zyntello-app/DISCREPANCIAS-cxp.md` (secciones D-CXP-F1-* y CIERRE FASE 1). ⚠️ Blade PDF Bluehost-safe: ternario ASCII, NUNCA `@if` inline ni em dash; nunca afirmar formato oficial DGII sin la fuente cargada.

> **CxP FASE 0 (2026-07-22)** — arranca `zyntello-cxp-mejoras-blueprint.md` como ESPEJO del blueprint de CxC (ya ejecutado F0–F4). Fuente única `CxpService`: asiento contable en CADA pago (parcial o total, no solo al saldar — cierra el hallazgo #1; detrás del flag `cxp_config.asiento_por_pago` default ON) con ruta por método (transferencia/cheque→banco, efectivo→caja, otro→concepto, tarjeta→banco+comisión) + pronto pago; `sincronizarFacturaCOM` refleja el estado en `pur_invoices` (aprobada↔pagada) + backfill `cxp:sincronizar-compras --dry-run`; diferencia cambiaria en el pago (signo opuesto a CxC: pagar más caro = pérdida); anticipos a proveedor de primera clase (ACTIVO: entregar/aplicar/recuperar, saldo en la ficha); comprobante de egreso PDF numerado (`CE-`) + email encolado; y las 5 guardas de integridad (sobrepago→anticipo, no anular pagos conciliados/cheque cobrado, CxP de Compras solo desde Compras, período abierto, matching en discrepancia). Un commit por tarea `[CXP-F0-0]`–`[CXP-F0-6]` + cierre. `AceptacionFase0Test` (4) + suite CxP (39 tests en 8 archivos). Regresión completa del ecosistema VERDE. Detalle en `app/zyntello-app/CLAUDE.md` (Sesión 2026-07-22 CxP FASE 0) y `app/zyntello-app/DISCREPANCIAS-cxp.md` (reporte antes/después). ⚠️ CxP NO tiene `monto_cobrado` (saldo = suma de pagos); `SaldoProveedorService` firma el pago por naturaleza del documento; `ban_movimientos.origen` es varchar(20).

> **CxC FASE 4 (2026-07-22)** — cierra `zyntello-cxc-mejoras-blueprint.md` (F0–F4): provisión de incobrables NIIF 9 simplificada (matriz por bucket configurable, documento mensual que contabiliza SOLO el delta), castigo (write-off) con aprobación obligatoria que consume el pool de provisión disponible + recuperación posterior sin reactivar el documento, 7 reportes nuevos (DSO, proyección de cobros, efectividad de cobranza, comportamiento de pago, cobros por método, provisión del período, intereses por mora) + aging con comparativo vs mes anterior, dashboard con 6 KPIs nuevos calculados con la MISMA fuente que sus reportes. **Bug real crítico encontrado y corregido**: doble registro de TODOS los event listeners de aprobación del sistema (Laravel auto-discovery duplicaba el registro manual en `AppServiceProvider`) — cada aprobación de CUALQUIER módulo ejecutaba su handler dos veces; fix de una línea en `bootstrap/app.php` (`withEvents(discover: false)`), verificado con la suite completa (0 regresiones). Detalle en `app/zyntello-app/CLAUDE.md` (Sesión 2026-07-22 continuación) y `app/zyntello-app/DISCREPANCIAS-cxc.md`. Suite CxC: 153 passed. Suite completa del ecosistema: 690+ passed, 0 failed.

> **Activos Fijos FASE 4 (2026-07-21)** — operación física completa: inventario físico con QR (reusa escáner INV-F1-2 + patrón conteo INV-F2, resuelve por `public_token` sin cambiar el contrato público), mantenimientos (gasto vs capitalización al cerrar por umbral), seguros (extiende el catálogo `cont_polizas_seguro` de Contabilidad, no duplica), obras en curso CIP (asiento cuadrado DR activo/CR obra_en_curso + imputación Compras→CIP inline vía `pur_invoices.obra_curso_id`). 26 tests verdes + demo en las 3 empresas. Detalle en `app/zyntello-app/CLAUDE.md` (Sesión 2026-07-21) y memoria `project_activos_fase4`. ⚠️ La suite de testing NO usa RefreshDatabase (BD `zyntello_app_testing` puerto 3308); nunca `migrate:fresh` en testing (rompe el dump).

#### Resumen de sesiones 2026-06-20 → 2026-06-22 (zyntello-app `[#1388]`–`[#1457]`)

> Detalle técnico completo en `app/zyntello-app/CLAUDE.md` (bitácora). Resumen ejecutivo:

- **Cuentas Contables descentralizadas por módulo** (`[#1388]`–`[#1401]`): cada módulo (CxP, CxC, Bancos, Presupuesto, ConstructFlow, Inventario, Facturación, Contabilidad/Dif. Cambiaria) configura SUS cuentas en su propio menú, con tabla estándar `Operación | CC | Cuenta | Descripción` + modal cascada CC→cuenta. Facturación con pestañas Local/Exterior y moneda local por empresa (fix DOP hardcodeado).
- **Framework de Importadores reutilizables** (`[#1402]`–`[#1443]`): `app/Services/Import/` con 7 importadores (CentroCosto, PlanCuenta, Cliente, Proveedor, Articulo, Empleado, ActivoFijo). Plantilla Excel con listas desplegables, preview editable con combos para FK, validación estricta. **Conector local descargable** (ZIP+.bat) para leer la BD en la LAN del cliente (SQL Server nativo + MySQL/PostgreSQL/ODBC → CSV) porque el importador en la nube no alcanza la red interna.
- **Patrón Contable por niveles + Centros de Costo jerárquicos** (`[#1406]`–`[#1437]`): máscara configurable de cuentas y CC, autocódigo jerárquico que deriva del padre, vista organigrama (toggle Lista/Organigrama), naturaleza financiera del CC, reportes con roll-up por nivel.
- **Bancos multimoneda** (`[#1446]`–`[#1450]`): fix dashboard (`ban_movimientos.tipo` es `credito`/`debito`, no `ingreso`/`egreso`), transferencias y reportes multimoneda por `tasas_cambio`, conciliación mensual con saldo inicial/continuidad, importación de estado de cuenta con mapeo configurable por entidad bancaria.
- **Caja Chica por aprobación** (`[#1445]`, `[#1451]`): reembolso pasa por el motor de aprobaciones (retrocompatible) + comprobante con línea cuenta+CC estándar.
- **Factura de proveedor (Compras)** (`[#1453]`–`[#1456]`): proveedor obligatorio heredado de la OC/recepción; fixes `moneda_id`/`proveedor_id` vacíos.
- **Facturación Fase A** (`[#1457]`): validación `exists` en cliente/moneda/serie/lista antes de emitir.
- **admin `[#498]`**: alta del módulo vertical **Prestamello** (prestamistas / ventas a crédito) en `ModulosSeeder`.

### Bitácora histórica (2026-06-09)

> Último commit en **zyntello-app**: `[#1104]` `87e37518` (histórico)

#### Sesión 2026-06-05 — Fix Modal Buscador Artículos Facturación

- `[#1104]` `87e37518` **Fix buscador artículos modal: corregir nombre tabla fact_lista_precio_items** — Problema: modal de búsqueda de artículos en cotización/pedido/factura daba error al buscar. Causa raíz: métodos `buscarArticulosModal()` (línea 858) y `preciosLista()` (línea 969) en `CotizacionController` usaban tabla inexistente `fact_lista_precio_lineas` cuando la tabla real es `fact_lista_precio_items`. Fixes: 2 cambios en `CotizacionController.php`. Modal buscador ahora funciona correctamente con cascada de precios (lista → base → artículo). Deploy: cPanel pull inmediato. Regla aprendida: NUNCA asumir nombres de tabla — verificar con queries existentes en el mismo controlador.

#### Sesión 2026-06-02 — UX Fixes + Sistema Roles + Dashboards ERP

- `[#941]` **Fix combo país empresas** — Reemplazar Alpine dropdown custom por `<select>` nativo (evita z-index issues). Preservada cascada `setPais()` → `cargarEstados()` vía `fetch /api/geo/estados`. Auto-cierra, sin overflow, width auto.
- `[#942]` **banco_central_link configurable** — Nueva columna `banco_central_link` varchar(500) en `empresas`. Sidebar y modal tasas usan `empresa->banco_central_link ?? 'https://bancentral.gov.do/...'` como fallback. Permite configurar link del banco central por país.
- `[#943]` **Billing fields en company** — 4 campos nuevos en `companies`: `billing_language`, `billing_document`, `billing_address`, `requires_electronic_invoice`. Vista `settings/members.blade.php` rediseñada: sección "Cuenta Zyntello" con grid 2 columnas, descripciones por campo, separación visual clara de "Miembros del equipo".
- `[#944]` **Sistema de roles completo para Company Members** — `config/member_roles.php` con 4 roles (Administrador, Transacciones, Consulta, Reportes) y 8 capacidades. Métodos `hasCapability($cap)` y `canAccessRoute($routeName)` en `CompanyMember`. Middleware `EnsureMemberCapability` registrado como `member.can:capability`. Documentación en `docs/ROLES_Y_PERMISOS.md`. Separación clara: Company Members (roles predefinidos) vs Internal Users (permisos granulares `tn_permissions`).
- `[#945]` **Dashboards ERP — 7 controladores** — Creados `DashboardCxpController`, `DashboardCxcController`, `DashboardBancosController`, `DashboardActivosController`, `DashboardCajaChicaController`, `DashboardComprasController`, `DashboardPresupuestoController`. Patrón uniforme: 5-6 KPIs, queries con eager loading, top 5 entidades, últimos 10 registros, datos de gráficas (6 meses). Commit incluye vistas CxP y CxC.
- `[#946]` **Vistas dashboard restantes** — 5 vistas blade (Bancos, Activos, CajaChica, Compras, Presupuesto) + actualización ruta CxC. Grid KPIs responsive, tablas top entities, listas últimas transacciones, alerts para sobreejecutados (Presupuesto) y bajo saldo (CajaChica). Dark theme consistente, `font-mono` en montos.
- `[#947]` **Rutas dashboard raíz** — Actualizadas rutas en 5 módulos (Bancos, Activos, CajaChica, Compras, Presupuesto). Dashboard como `Route::get('/', [Dashboard...Controller::class, 'index'])->name('dashboard')`. CxP ya estaba actualizado en [#945]. Todos los módulos ERP ahora tienen dashboard como entry point.
- `[#948]` **Middleware + protección UI roles** — Aplicado middleware `member.can:capability` en 5 rutas sensibles de settings: `settings.update` (can_configure), `billing-config.update` (can_manage_billing), `approval-workflows.store/destroy` (can_configure), `members.remove` (can_invite). Vista `settings/members.blade.php`: botones "Guardar cambios", "Quitar miembro" e "Invitar" protegidos con `$currentMember->hasCapability()`. Método `User::companyMember($company)` agregado para obtener CompanyMember del usuario en una compañía específica.
- `[#949]` `06951573` **Fix ruta usuarios internos** — Link "Ver usuarios internos" en `settings/members.blade.php` usaba ruta inexistente `usuarios-internos.index`. Corregido a `settings.tenant-users.index` (ruta real definida en web.php línea 267). Error en producción causaba ViewException.
- `[#950]` `3cd496db` **Fix acceso usuarios internos** — Migración marca primer usuario de cada company como `owner`. Problema: todos los usuarios eran `collaborator` pero el sistema requiere al menos un `owner` para gestionar usuarios internos. Migración ejecutada manualmente marca `demo@zyntello.com` como owner.
- `[#951]` `f7a32eef` **Sistema reseteo cuenta demo completo** — Comando `demo:reset` (programado diario 3:00 AM via routes/console.php). Franja advertencia en dashboard.blade.php informa sobre borrado automático. Usuario demo marcado como `owner` (acceso completo para pruebas). DemoSeeder ampliado: limpieza módulo Caja (POS) agregada (caj_cajas/caj_sesiones/caj_movimientos), usuario demo creado como owner desde inicio. Solo afecta company demo (slug: constructora-demo-sa), protege datos de otros suscriptores.
- `[#952]` `d9a9b74a` **UX Settings: eliminar campo idioma nivel company** — Campo `billing_language` removido de Cuenta Zyntello. Idioma debe configurarse por usuario individual, no a nivel de suscriptor. Grid settings: País principal + Documento Fiscal. Validación removida de SettingsController.
- `[#953]` `dd484909` **UX Settings: renombrar Usuarios a Suscriptor + pestañas** — Vista settings/members renombrada a "Suscriptor". Pestañas Alpine.js: "Suscripción" (datos facturación) y "Miembros" (lista + invitaciones). Campos reducidos: nombre w-96, dirección max-w-2xl. Sidebar config: "Usuarios" → "Suscriptor".
- `[#954]` `f417e642` **DemoSeeder CxC/CxP completo + fix ENUMs aprobaciones + arquitectura tipos_documento** — **CxcSeeder + CxpSeeder**: implementación completa con 6 + 8 documentos demo respectivamente, usando `CxcService::seedTiposDocumento()` / `CxpService::seedTiposDocumento()`. **Fix estados ENUM**: BancosSeeder (4 cambios: completada→ejecutada 2x, cerrada→aprobada, abierta→borrador), DepreciacionService (5 cambios: calculada→borrador 3x, contabilizada→aplicada 2x), FacturacionSeeder (procesada→aplicada), CxcSeeder (parcial→pendiente 2x, cobrado→cobrada, vencido→pendiente), CxpSeeder (parcial→pendiente, pagado→pagada, vencido→pendiente, aprobado→aprobada). **Arquitectura tipos_documento multi-empresa**: `CxcService::seedTiposDocumento()` y `CxpService::seedTiposDocumento()` aceptan parámetro opcional `$empresaId` — si se pasa, crea tipos a nivel Empresa; si es null, a nivel Company. Query filtra por `empresa_id` cuando se especifica. **DemoSeeder**: limpieza de `cxc_tipos_documento` y `cxp_tipos_documento` antes de `Company::forceDelete()` para evitar tipos huérfanos. **CxpService**: eliminada línea `self::seedTiposDocumento($companyId)` en `resolverTipoDocumentoId()` — tipos deben crearse en onboarding/seeding explícito, no durante operaciones normales (evita conflictos con índice único). **Resultado**: `demo:reset` funciona completamente sin errores ENUM.

#### Sesión 2026-06-08 — Análisis y Fix Recepciones de Compras (Checkout Recepciones)

- `[#1109]` **Fix ruta proveedor buscar** — Cambio `route('proveedores.buscar')` → `route('tablas.proveedores.buscar')` en supplier-extensions create/edit. Soluciona RouteNotFoundException.
- `[#1110]` **Fix ClienteActividad::registrar()** — Reemplazar `ClienteActividad::registrar()` con `ClienteActividadService::registrar()`. Eliminar parámetro `company_id`. Soluciona Call to undefined method.
- `[#1111]` **Fix RFQ scoring sin respuestas** — Agregar try/catch en `QuotationController::evaluar()` para capturar RuntimeException. Mostrar mensaje amigable en SweetAlert2. Deshabilitar botón "Calcular scoring" si no hay respuestas de proveedores. Soluciona "RFQ sin respuestas para puntuar".
- `[#1112]` **Frontend validation recepciones** — Agregar `validarYEnviar()` en Alpine.js antes de form.submit(). Mostrar TODOS los errores en SweetAlert2. Agregar backend logging con full error trace en try/catch(Throwable). Soluciona recepciones guardándose silenciosamente.
- **Análisis cantidad_transito** — Creada migración `2026_06_08_100001_add_cantidad_transito_to_inv_stock.php` pero con error en nombre de columna: migración usaba `cantidad_en_transito` pero tabla debe usar `cantidad_transito`. Luego corregido en `PurchaseOrderService::registrarCantidadEnTransito()` y `ReceiptService::actualizarCantidadEnTransito()`. Sistema funciona: OC aprobada incrementa cantidad_transito, recepción posteada la decrementa.
- `[#1113]` `bfc2f89` **Mejorar validaciones recepciones: SweetAlert2 detallado** — Reescribir `receiptForm()` validarYEnviar() con:
  1. **Logs console**: DEBUG messages mostrando lineas, valores, fecha
  2. **Validaciones detalladas**: cantidad > 0, no exceder disponible, fecha obligatoria
  3. **SweetAlert2 visual**: cada error con ❌ emoji, lista HTML, didOpen() muestra logs
  4. **Eliminación ambigüedad**: usuario ahora ve EXACTAMENTE qué campo está incompleto
  
  **Confirmación de investigación:** NO faltan campos ocultos. Todos presentes:
  - `purchase_order_id` hidden ✓
  - `lineas[].purchase_order_line_id` hidden ✓
  - `lineas[].cantidad_recibida` en nombre HTML (x-model: l.recibir) ✓
  - `lineas[].bodega_destino_id` select ✓
  - `lineas[].lote` input ✓
  
  **Causa real de no guardar:** Usuario NO edita campo "Recibir ahora" antes de presionar Crear. El frontend valida `cantidad_recibida > 0` silenciosamente (sin error visible). Ahora muestra error claro en SweetAlert2.

- **Documentación created** — `GUIA_VERIFICACION_RECEPCIONES.md` con paso a paso, flujo correcto, debugging F12, checklist guardar. `FLUJO_RECEPCION_FACTURA.md` con diagrama visual separación Recepción vs Factura Proveedor.

#### Sesión 2026-06-01 — Fixes Sidebar, Tasas de Cambio, Settings UX

- `[#919]` `f72adb2d` **Diagnóstico monedas** — ruta `/zyn-maint/diag-monedas` verifica USD/EUR en catálogo global `monedas`, tabla `empresa_monedas` y tasas por empresa. Utilidad de auditoría para producción.
- `[#920]` `6ac47bd4` **Fix monedas: insertar USD y EUR** — migración idempotente que inserta USD y EUR en `monedas` (si no existen) y en `empresa_monedas` de cada empresa activa como monedas secundarias. Bluehost safe.
- `[#921]` `40188cd5` **Fix serial: `numero_serial` → `numero_serie`** — `SerialController` y vista `seriales/index.blade.php` usaban el nombre de columna incorrecto. Corregido a la columna real de la tabla.
- `[#922]` `621bc5c9` **Fix tasa de cambio en sidebar** — dos bugs: (1) View composer de `$tasaCambioHoy` solo estaba en `components.topbar`, pero el sidebar se renderiza ANTES en `app.blade.php` → nunca recibía la variable. Fix: nuevo View composer para `components.sidebar` con `with('moneda')` eager load. (2) Vista usaba `moneda->codigo` (columna inexistente); corregido a `moneda->iso`.
- `[#923]` `51c31521` **Tasas históricas protegidas** — `TasasCambioController::destroy()` bloquea eliminación si `fecha < today()` con mensaje de error. Vista reemplaza botón eliminar por ícono candado 🔒 con `title` tooltip para tasas históricas. Solo se pueden eliminar tasas del día actual.
- `[#924]` `27c75bf6` **Settings: eliminar vista empresa redundante** — `/settings` (índice) redirige a `settings.members`. Campos del suscriptor (`company.name`, `company.country`) movidos a vista Usuarios como sección "Cuenta Zyntello" al inicio (solo admin). Item "Configuración de la empresa" eliminado del sidebar (ya existía "Empresas" debajo). Elimina ambigüedad entre datos de suscriptor y datos operativos.
- `[#925]` `e3ba0889` **Helper `empresa_activa()` con fallback a sesión** — el helper ahora tiene fallback a `session('empresa_activa_id')` cuando el binding del container no existe (rutas sin middleware `empresa`). Esto garantiza que el widget de tasa de cambio aparezca en el sidebar en TODAS las vistas autenticadas, no solo en las que pasan por `EnsureEmpresaActiva`.
- `[#926]` `3dad2ae1` **Tasas de cambio: integración BCRD** — Scraping en tiempo real de la página del BCRD para obtener USD compra/venta. Modal "Registrar tasa" ahora muestra referencias BCRD con botones clicables que copian el valor al portapapeles y lo pegan automáticamente en el campo. Alpine.js carga las tasas al abrir el modal. Estados de carga, error y éxito implementados.
- `[#927]` `5b3f1704` **Fix BCRD scraping** — Scraping mejorado con 3 patrones de extracción + fallback inteligente a valores de referencia con advertencia. Nunca falla completamente.
- `[#928]` `3077038a` **Sistema de aprobaciones completo** — 7 handlers nuevos (Bancos, Compras, CajaChica, ActivosFijos, Caja, Presupuesto, CRM) + 1 expandido (Facturación: NotaCredito, Devolucion). Cobertura 100% de módulos críticos.
- `[#929]` `9c6c380a` **Migraciones aprobaciones** — 8 migraciones que agregan `approval_request_id` y estados de aprobación a ~35 tablas. Guards `hasColumn` para Bluehost. ENUMs seguros.
- `[#930]` `dcd86a91` **Documentación aprobaciones** — ANALISIS_APROBACIONES.md completo con 14 handlers, 8 migraciones, 27 tipos de transacciones documentadas.
- `[#931]` `4c1da1b2` **Tasas BCRD: Google primario** — Scraping de Google Search como fuente primaria (más confiable), BCRD como respaldo. Layout modal rediseñado para que warning no se desborde.
- `[#932]` `7b9c3aec` **Documentación** — Actualizar bitácora con [#931].
- `[#933]` `ba0be2c0` **Fix migraciones aprobaciones** — Mapeo de valores existentes antes de modificar ENUMs en 8 migraciones de aprobaciones.
- `[#934]` `0c81c43c` **Fix nombres tabla y modelos Compras** — Tabla real es `pur_receipts` no `pur_recepciones`. Modelos correctos: `PurRequisition`, `PurPurchaseOrder`, `PurReceipt`, `PurLiquidacion`. Corregido en migración `100002_add_approval_to_compras.php` y en `ComprasApprovalHandler.php`.
- `[#935]` `37b18341` **Fix migraciones aprobaciones Compras/CajaChica/ActivosFijos** — Guards `hasColumn` individuales (no solo approval_request_id). Guards `hasTable` para tablas inexistentes (cch_arqueos, af_bajas, af_revaluaciones, af_ajustes_vida_util). Mapeo ENUM 3-pasos seguro en af_depreciaciones: expandir ENUM + UPDATE + contraer.
- `[#936]` `6cac4e0c` **Fix migraciones aprobaciones Presupuesto/CRM/Caja/Facturación** — Guards `hasTable` para pg_ajustes/pg_transferencias_partidas/pg_modificaciones/crm_condonaciones. Guards individuales por columna en todas las tablas. Las 8 migraciones de aprobaciones (100001-100008) ahora funcionan correctamente localmente.
- `[#937]` `c0125716` **Fix modal tasas cambio** — Etiqueta simplificada: "Ref:" (elimina variable fuente dinámica). Valores de referencia con 4 decimales: `parseFloat(valor).toFixed(4)`.
- `[#938]` `9e9e391e` **Modal tasas: layout optimizado** — Input tasa reducido de `flex-1` a `w-48` (evita desbordamiento). Referencias organizadas en columna. Link "Fuente: Google/BCRD" debajo de botones con ícono de enlace externo.
- `[#939]` `f9fdaae2` **Modal tasas: dos fuentes siempre visibles** — Links Google y BCRD siempre disponibles (no condicional). Formato: "Fuentes: Google | BCRD" con iconos externos.
- `[#940]` `ca4ff9b6` **Modal tasas: link BCRD directo** — Link BCRD actualizado a `bancentral.gov.do/SectorExterno/HistoricoTasas` (página específica de tasas, no homepage genérica).

#### Reglas nuevas aprendidas (sesión 2026-06-01)

- **Sidebar vs topbar render order**: `app.blade.php` renderiza `components.sidebar` en línea 59, ANTES que `components.topbar` (línea 61). Cualquier variable inyectada via View composer de topbar NO estará disponible en sidebar — necesita su propio composer.
- **Tasas históricas**: proteger con `$fecha->lt(today())` en destroy(). Las tasas pasadas son auditables y no deben desaparecer aunque no haya FK directa.
- **Route model binding + HasEmpresa**: si un controlador recibe `Model $model` por ruta Y el modelo tiene `HasEmpresa`, el global scope puede filtrar el registro → 404. Solución: `string $id` + `sinScopeEmpresa()->findOrFail($id)`.
- **`empresa_activa()` helper**: desde [#925] tiene fallback a sesión. Usar siempre el helper, nunca `app('empresa_activa')` directo.
- **Migraciones Bluehost-safe** (patrón completo de [#933]–[#936]):
  1. **hasTable() wrapper**: si tabla puede no existir localmente, envolver toda la sección en `if (Schema::hasTable('table'))`.
  2. **Guards individuales por columna**: dentro de `Schema::table()`, cada columna necesita su propio `if (!Schema::hasColumn('table', 'col'))` — evita errores por migraciones parcialmente fallidas.
  3. **Modificación ENUM segura**: si ENUM puede tener valores fuera de la nueva definición:
     - Paso 1: `UPDATE table SET estado = 'default' WHERE estado NOT IN ('new1', 'new2', ...)`
     - Paso 2: `ALTER TABLE table MODIFY COLUMN estado ENUM('new1', 'new2', ...) DEFAULT 'default'`
  4. **Modificación ENUM con mapeo** (cuando valores antiguos deben migrar a nuevos):
     - Paso 1: Expandir ENUM con valores antiguos + nuevos: `ALTER TABLE ... MODIFY ... ENUM('old1','old2','new1','new2')`
     - Paso 2: Mapear datos: `UPDATE table SET estado = 'new1' WHERE estado = 'old1'`
     - Paso 3: Contraer ENUM a solo valores nuevos: `ALTER TABLE ... MODIFY ... ENUM('new1','new2')`
  5. **Verificar antes de modificar**: `$enum = DB::select("SHOW COLUMNS FROM table WHERE Field = 'estado'"); if ($enum && !str_contains($enum[0]->Type, 'target_value')) { ... }` — evita modificar si ya está correcto.

#### Reglas nuevas aprendidas (sesión 2026-06-02)

- **PowerShell mkdir múltiples paths**: `mkdir` no soporta múltiples paths simultáneos. Usar `New-Item -ItemType Directory` o crear archivos directos (auto-crea directorios padres).
- **Select nativo vs Alpine custom**: Para combos en formularios complejos, `<select>` nativo evita problemas de z-index, overflow y auto-cierre. Alpine cascade logic funciona igual con selects nativos.
- **Roles vs Permisos granulares**: Company Members (colegas del tenant) → sistema de roles predefinidos (4 roles, simple). Internal Users (staff temporal/externo) → permisos granulares por módulo (`tn_permissions`). No mezclar ambos sistemas.
- **Dashboard pattern**: 5-6 KPIs grid → 2-column layout (top entities tabla + recent records list) → eager loading en queries → `withQueryString()` en paginación. Emoji en título, descripción debajo, dark theme (`bg-surface-elevated`, `border-border/40`).
- **Route dashboard raíz**: En módulos con múltiples secciones, dashboard debe ser `Route::get('/', ...)` DENTRO del grupo `Route::prefix('module')->name('module.')`. Listados CRUD van a `/module/entidades`.
- **Auto-seed en services causa conflictos UNIQUE**: Si un método operativo del service (ej. `crear()`) llama internamente a `seedTiposDocumento()` con parámetros diferentes a los del seeder explícito, puede causar violaciones de UNIQUE constraint. Solución: eliminar auto-seed; los tipos deben crearse SOLO en onboarding o seeders.
- **ENUM estados de aprobaciones**: Tablas modificadas por sistema de aprobaciones ([#928]–[#936]) usan ENUM `('borrador','pendiente_aprobacion','aprobada','rechazada','ejecutada'/'aplicada')`. Mapeo: completada→ejecutada, cerrada→aprobada, abierta→borrador, calculada→borrador, contabilizada→aplicada, procesada→aplicada, parcial→pendiente, cobrado→cobrada, pagado→pagada, vencido→pendiente.
- **CxC/CxP estados válidos**: `cxc_documentos.estado` = `('borrador','pendiente','aprobada','cobrada','anulada')`. `cxp_documentos` probablemente igual. Métodos de cobro/pago también tienen ENUMs específicos: `cxc_cobros.metodo_cobro` = `('efectivo','transferencia','cheque','tarjeta','nota_credito','otro')`.
- **tipos_documento multi-empresa**: CxC y CxP soportan tipos a nivel Company (global para el tenant, `empresa_id=NULL`) O a nivel Empresa específica (`empresa_id` SET). seedTiposDocumento() debe recibir parámetro empresaId explícito cuando se llama desde seeders de módulos.

#### Sesión 2026-06-03 — Gestión de Clientes Kanban + Fixes Producción

- `[#955]` **ClienteGestion completo** — Módulo kanban 4 columnas (VIP Premium, Constantes, Locales, Nuevos) para seguimiento comercial de clientes. **Migración 100001**: tabla `cliente_gestion` con company_id, empresa_id, cliente_id, categoria (ENUM 4 valores), estado (ENUM activo/seguimiento/inactivo), vendedor_codigo, objetivo_mensual, facturado_mes_actual, ultima_interaccion, notas_comerciales, prioridad, orden_columna, timestamps, softDeletes, indexes. **Modelo `App\Models\Gestion\ClienteGestion`**: HasEmpresa + SoftDeletes + relaciones (company, empresa, cliente, vendedor), scopes (categoria, estado, vendedor, sinContactoReciente), accessors (nombreCliente, nombreVendedor, porcentajeCumplimiento, diasSinContacto). **Controller**: index() con queries por categoría + filtros vendedor/estado/búsqueda, KPIs (totalClientes, sinContacto15Dias, facturadoMes, objetivoMes), eager loading. agregar() para añadir clientes existentes al seguimiento con validación empresa_id. **Rutas** en routes/modules/gestion.php con middleware EnsureModuleAccess. **Vistas**: index.blade.php con 4 columnas kanban, KPIs, filtros, búsqueda por columna (Alpine.js), modal agregar cliente. Config sidebar actualizado.
- `[#956]` **Documentación [#955]** — CLAUDE.md y /memories/repo/ actualizados con bitácora detallada.
- `[#957]` **Fix 5 errores producción** — (1) ClienteController: faltaba `use App\Models\ClienteActividad;` (línea 231 lo usaba). (2) TransferenciaController::create() return type: declaraba `View` pero podía retornar `RedirectResponse` — cambiado a `View|RedirectResponse`. (3) integracion-modulo.blade.php: `route('contabilidad.plan-cuentas.index')` fallaba cross-module — agregado `@if(Route::has())` guard. (4) ComprobanteCajaChicaController línea 52: SELECT columnas inexistentes `documento_numero` en proveedores — corregido a `rnc_cedula` (columna real). (5) GestionClientesController línea 32: asumía tabla `cliente_gestion` completa pero migración 100001 falló parcialmente en producción — siguiente commit repara.
- `[#958]` **Repair migración cliente_gestion** — Nueva migración 100003 con 13 guards individuales `hasColumn` para reparar tabla corrupta (100001 falló creando solo estructura sin columnas). Agrega: company_id, empresa_id, cliente_id, categoria, estado, vendedor_codigo, objetivo_mensual, facturado_mes_actual, ultima_interaccion, notas_comerciales, prioridad, orden_columna. Indexes con try-catch (Bluehost-safe).
- `[#959]` **Fix Laravel 11 compatibility** — Migración 100003 usaba `getDoctrineSchemaManager()` (removido en Laravel 11). Reemplazado con try-catch directo para idempotencia de índices. Producción seguía mostrando error porque cPanel no auto-pull → servidor tenía código viejo.
- `[#960]` **Agregar deleted_at a migración** — Modelo `ClienteGestion` usa `SoftDeletes` pero migración 100003 no tenía `$table->softDeletes()` — agregado. También `$table->timestamps()` para created_at/updated_at.
- `[#961]` **Fix migración duplicada** — Laravel encontró DOS archivos con timestamp 100003: (1) `100003_create_cliente_gestion_table.php` (OLD diseño incorrecto, asignado_a/notas_rapidas/sin empresa_id). (2) `100003_repair_cliente_gestion_complete.php` (fix real con todas las columnas). Laravel ejecutó el (1) alfabéticamente → falló de nuevo. Solución: eliminar (1), renombrar (2) a `100004_repair_cliente_gestion_complete.php`. Server logs 10:36:04 confirmaron ejecución del archivo incorrecto.
- `[#962]` **Documentación [#961]** — Bitácora commit.
- `[#963]` **Fix columna vendedores** — `GestionClientesController::index()` línea 77: `where('estado', 'activo')` fallaba porque tabla `vendedores` NO tiene columna `estado`. Columna correcta: `is_active` (boolean). Corregido a `where('is_active', true)`.
- `[#964]` **Documentación [#961]–[#963]** — CLAUDE.md + /memories/repo/ actualizados. Nueva regla agregada: "Verificar Schema Antes de Filtrar" — siempre revisar tabla real antes de `where()`, convenciones varían (vendedores: is_active, users: status, empresas: estado).
- `[#965]` `d037351b` **Fix variables vista + métodos modelo + prioridad ENUM** — **GestionClientesController**: renombradas variables KPI (totalClientes→totalPipeline, sinContacto15Dias→sinContacto), agregado cálculo altaPrioridad (count prioridad='alta'), agregados arrays kanbanConfig (configuración visual 4 columnas con gradientes/bordes/acentos) y porEstado (agrupación colecciones), actualizado compact() con 15 variables. **ClienteGestion modelo**: agregado 'prioridad' al fillable, agregados métodos públicos diasSinContacto() y textoUltimaInteraccion() requeridos por vista líneas 111 y 138. **Migración 100005**: cambia prioridad de INTEGER (error diseño migración 100004) a ENUM('alta','media','baja') con mapeo automático (0/NULL→baja, 1→media, 2+→alta), rollback incluido, try-catch Bluehost-safe. Fixes error "Undefined variable $totalPipeline" en index.blade.php línea 28.
- `[#966]` `a48e50a4` **Fix vendedores estado en agregar()** — `GestionClientesController::agregar()` línea 157: `where('estado', 'activo')` → `where('is_active', true)`. Mismo error que [#963] pero en método diferente. Error producción al intentar agregar cliente a gestión comercial: SQLSTATE[42S22] Unknown column 'estado' in 'where clause'.
- `[#967]` `a505b783` **Fix import Cliente + gradientes kanban inline** — **GestionClientesController**: import corregido de `use App\Models\Tablas\Cliente` a `use App\Models\Cliente` (Cliente.php está en namespace App\Models directamente, NO en Tablas). Agregados valores CSS `gradiente` a kanbanConfig con linear-gradient RGB. **index.blade.php**: reemplazado `bg-gradient-to-r {{ $config['encabezado'] }}` por `style="background: {{ $config['gradiente'] }}"` — soluciona problema de clases Tailwind dinámicas no compiladas en build. Error producción: Class 'App\Models\Tablas\Cliente' not found. Fix visual: encabezados kanban ahora muestran gradientes correctamente.
- `[#968]` `8267717d` **DemoSeeder: vendedores para 3 empresas + regla arquitectural** — **Problema**: combo vendedores vacío al cambiar de empresa activa. **Causa**: vendedores solo se creaban para empresa 1 (Constructora Demo SA), pero `HasEmpresa` filtra automáticamente por `empresa_id = empresa_activa()->id` → empresas 2 y 3 sin vendedores. **Fix**: planes de comisión + vendedores/cobradores/metas creados para las 3 empresas demo. Empresa2 (Servicios Profesionales): V101 Carlos, V102 María, C101 Roberto. Empresa3 (Distribuidora Mayoreo): V201 Jorge, V202 Sofía, C201 Fernando. **Regla arquitectural confirmada y documentada**: Tenant + Empresa activa → SEPARACIÓN TOTAL de datos operativos. Solo compartidos a nivel tenant (sin empresa_id): países, estados, monedas. TODO lo demás (vendedores, clientes, proveedores, artículos, facturas, cobros, planes comisión, nómina, empleados) SE SEPARA POR empresa_id. DemoSeeder debe crear data completa para las 3 empresas demo.

#### Reglas nuevas aprendidas (sesión 2026-06-03)

- **cPanel pull NO automático**: cPanel Git Version Control NO ejecuta pull automático al hacer deploy. Hay que ir a cPanel → Git → "Update from Remote" manualmente después de cada push GitHub. Esto causó error en producción donde servidor ejecutaba código viejo post-#958 (aún tenía getDoctrineSchemaManager).
- **Migraciones fallidas dejan schema corrupto**: si migración crea tabla pero falla a mitad (ej: error en columna #5), la tabla queda con solo las primeras 4 columnas. NO asumir que "tabla existe" = "tiene todas las columnas". Guards `hasColumn` individuales obligatorios.
- **Duplicate migrations timestamp**: Laravel ejecuta UNA migración por timestamp. Si hay 2 archivos con mismo timestamp (ej: 100003), ejecuta el primero alfabéticamente. Solución: eliminar duplicado + renombrar el correcto al siguiente timestamp libre.
- **Verify column before where()**: convenciones varían por módulo — vendedores usa `is_active` (boolean), users usa `status` (enum), empresas usa `estado` (enum). Siempre verificar schema real antes de asumir nombre de columna.
- **Blade view variables debugging**: si error dice "Undefined variable $x en línea Y", LEER la vista completa para ver TODAS las variables que usa, no solo la del error. Vista puede usar $a, $b, $c y controller solo pasa $a. Fix completo requiere agregar todas.
- **Modelo accessor vs método**: si vista llama `$model->property()` con paréntesis, necesita método público. Si llama `$model->property` sin paréntesis, necesita accessor `getPropertyAttribute()`. No son intercambiables.
- **Integer vs ENUM inconsistency**: si migración define campo como INTEGER pero vista lo usa como string ('alta'/'media'/'baja'), crear migración de repair que cambie tipo + mapee valores. No confiar solo en casting PHP.
- **Namespaces reales vs asumidos** (desde [#967]): `Cliente.php` está en `App\Models\` NO en `App\Models\Tablas\`. Vendedor SÍ está en `App\Models\Tablas\`. Siempre verificar la ubicación real del modelo antes de asumir el import. Error común: copiar-pegar imports sin verificar estructura.
- **Tailwind clases dinámicas no compilan** (desde [#967]): `bg-gradient-to-r {{ $config['clase'] }}` NO funciona si la clase no está completa en tiempo de compilación. Solución: usar `style="background: {{ $config['css'] }}"` con valores CSS inline (linear-gradient, rgba, etc.). Blade puede interpolar CSS sin problema.
- **DemoSeeder multi-empresa** (desde [#968]): si el DemoSeeder crea múltiples empresas demo (empresa1, empresa2, empresa3), DEBE crear datos operativos completos para CADA empresa. No es suficiente crear solo para empresa1 — cuando el usuario cambia de empresa activa, los combos aparecen vacíos porque `HasEmpresa` filtra por `empresa_id` automáticamente. Planes de comisión, vendedores, cobradores, metas, clientes, artículos — TODO debe existir por empresa.

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
| `[#859]` | **Sistema Geo Cascada completo** | `ciudades` mejorado con tipo/parent_id/company_id. Estados seeded 13 países extra. `GeoApiController` API /api/geo/{paises,estados,ciudades,parroquias}. `GeoCatalogoController` CRUD localidades por empresa. CiudadesSeeder ~130 municipios DO + VE/CO/GT/CR. Cascada País→Estado→Ciudad en proveedores y clientes (create+edit Alpine AJAX). Enlace "Catálogo Geográfico" en Facturación y Nómina. Deploy: migrate + /zyn-maint/seed-ciudades. |
| `[#869]`–`[#881]` | **Módulo Caja (POS) completo + fixes producción** | Tablas `caj_cajas/sesiones/movimientos` (sin FK en Bluehost). `CajaService`: abrirSesion, cerrarSesion, registrarMovimiento. CRUD cajas, arqueo PDF. Selector caja Alpine en cobro (efectivo obligatorio, tarjeta opcional). `depositarBanco()`: egreso caja + crédito banco en una sola transacción. **Fixes:** bracket duplicado modules.php bloqueaba app; `caj_sesiones/movimientos` no creadas (FK UUID Bluehost); `Empresa::sinScopeEmpresa()` en CRM commands. Migraciones: `400001_create_caj_sesiones_no_fk`. Deploy: `/zyn-maint/migrate-y-limpiar`. |
| `[#919–#920]` | **Fix monedas: diagnóstico + migración USD/EUR** | `/zyn-maint/diag-monedas` para auditoría. Migración idempotente inserta USD/EUR en catálogo y empresa_monedas. |
| `[#921]` | **Fix serial** | `SerialController` y vista: `numero_serial` → `numero_serie` (columna real de la tabla). |
| `[#922]` | **Fix sidebar tasa de cambio** | View composer propio para `components.sidebar` (se renderiza antes que topbar). Corrige `moneda->codigo` → `moneda->iso`. |
| `[#923]` | **Tasas históricas protegidas** | `destroy()` bloquea si `fecha < today()`. Vista muestra candado 🔒 en lugar de botón eliminar. |
| `[#924]` | **Settings: eliminar vista redundante** | `SettingsController::index()` redirige a `settings.members`. Campos Cuenta Zyntello en Usuarios. |
| `[#925]` | **Helper `empresa_activa()` con fallback** | Fallback a `session('empresa_activa_id')` cuando no hay binding de container. Tasa visible en todas las vistas. |
| `[#926–#927]` | **Tasas de cambio BCRD integración** | Scraping BCRD tiempo real USD compra/venta. Modal con botones clicables (copia + pega). 3 patrones extracción + fallback inteligente. |
| `[#928–#930]` | **Sistema aprobaciones completo** | 7 handlers nuevos + 1 expandido. 8 migraciones (~35 tablas). ANALISIS_APROBACIONES.md. 100% cobertura módulos críticos. |
| `[#931–#932]` | **BCRD: Google primario + docs** | Google Search como fuente primaria (más confiable). Modal layout fix (sin overflow). Bitácora actualizada. |
| `[#933]` | **Fix migraciones aprobaciones** | Mapeo valores existentes antes de modificar ENUMs. Soluciona SQLSTATE[01000] Data truncated. || `[#934]` | **Fix nombres tabla Compras** | Corrige `pur_recepciones` → `pur_receipts` en migración + handler. Modelos corregidos: PurRequisition, PurPurchaseOrder, PurReceipt, PurLiquidacion. |
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

### Mudanza a otro servidor (BD desde cero) — probado 2026-07-25

> El esquema completo es **InnoDB** y las migraciones corren de punta a punta sin errores. Dos
> rutas, según si el host destino tiene el cliente `mysql` en el PATH:

```bash
# Ruta A — el servidor TIENE el cliente mysql (caso Bluehost)
php artisan migrate --force        # restaura database/schema/mysql-schema.sql + aplica el resto

# Ruta B — el servidor NO tiene el cliente mysql
php artisan zyntello:cargar-schema # carga el dump con PDO puro (solo sobre BD vacía)
php artisan migrate --force        # aplica las migraciones posteriores al dump
```

**Verificación de que la BD quedó bien** (debe devolver 0 filas):

```sql
SELECT TABLE_NAME, ENGINE FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE() AND ENGINE <> 'InnoDB';
```

Resultado de la prueba real: **948 migraciones, 0 errores, 517 tablas, no-InnoDB 0** por ambas
rutas. ⚠️ En MyISAM las transacciones no revierten y `lockForUpdate()` es un no-op — por eso
`config/database.php` fuerza `'engine' => 'InnoDB'` y hay 3 pruebas que impiden revertirlo.

### Mini guía operativa post-deploy (sin SSH)

1. Ejecutar `https://app.zyntello.com/zyn-maint/migrate-y-limpiar?key=XXX`.
2. Validar estado en `https://app.zyntello.com/zyn-maint/migrate-status?key=XXX`.
3. Si hay error, revisar `https://app.zyntello.com/zyn-maint/logs?key=XXX&filter=ERROR`.
4. Confirmar auditoría de deploy en servidor: `storage/logs/deploy-migrate.log`.
5. Confirmar auditoría de estado en servidor: `storage/logs/deploy-migrate-status.log`.

---

## Graphify — grafo de conocimiento del código (local)

> Herramienta de análisis local que mapea el ecosistema (website + `app/zyntello-app` + `admin`) en un grafo consultable. **100% local, sin LLM** (tree-sitter AST, `--code-only`) — ningún código sale de la máquina.

- **Instalación (aislada):** `uv tool install graphifyy --with mcp`. Paquete oficial `graphifyy` (doble "y"); expone `graphify` y `graphify-mcp`. El paquete `mcp` NO viene por defecto y es necesario para el servidor MCP.
- **Salida:** `graphify-out/` en la raíz (**gitignored**) → `graph.json` (**19,071 nodos / 45,934 aristas / 1,530 comunidades** tras el refresh del 2026-07-30, 3 repos fusionados: app 18,303 · admin 664 · website 104), `GRAPH_REPORT.md`, `GRAPH_TREE.html` (navegador jerárquico D3 — recomendado), `graph.html` (force-directed, pesado a >5000 nodos).
- ⚠️ **Al leer el `graph.json` a mano: las aristas están en `links`, NO en `edges`** (formato node-link de NetworkX). Y `source_file` de cada nodo guarda **solo el nombre del archivo**, no la ruta — buscar por carpeta no encuentra nada.
- **Alcance = 3 repos.** El `.gitignore` raíz excluye `admin/` y `app/*`, así que hay que extraer cada repo por separado y fusionar (`graphify merge-graphs`). `admin/` y `app/zyntello-app/` llevan su propio `.graphifyignore` que excluye `vendor/`, `storage/`, `public/build/`, `bootstrap/cache/` — **Graphify NO salta `vendor` por defecto** y esos repos lo versionan para Bluehost.
- **Consulta (terminal):** `graphify query "..."`, `graphify explain "X"`, `graphify path "A" "B"`, `graphify affected "X"`.
- **Consulta (MCP):** servidor `graphify` registrado en Claude Code (scope local, en `~/.claude.json`), apunta a `graphify-out/graph.json`. Sus herramientas se cargan al **reiniciar** la sesión.
- **Refresco: SOLO MANUAL** → `pwsh ./graphify-refresh.ps1` (re-extrae los 3 repos + fusiona + regenera reporte/HTML, sin LLM). Ejecutarlo cuando quieras actualizar el grafo.
- **Sin automatización (desde 2026-07-19):** el grafo NO se refresca en cada commit ni en el deploy.
  - **Post-commit:** los hooks `post-commit` de los 3 repos fueron **eliminados** (`.git/hooks/`). Ya no se lanza nada tras commitear.
  - **Deploy:** los 3 scripts (`deploy-website.ps1`, `deploy-admin.ps1`, `deploy-bluehost.ps1`) **ya no** llaman a `graphify-refresh.ps1`.
  - Motivo: el refresh en cada commit/deploy consumía tiempo y una corrupción del `graph.json` intermedio (en `%TEMP%\graphify-zyntello`) rompía el paso. Si el rebuild vuelve a fallar con "Extra data"/JSONDecodeError, borrar `%TEMP%\graphify-zyntello` y re-ejecutar `graphify-refresh.ps1` (full rebuild limpio).
- **NO instalado (requiere OK explícito del usuario):** `graphify claude install` (hooks PreToolUse + sección en CLAUDE.md; costo de rendimiento: cargan `graph.json` de 23 MB en cada Read/Grep), `graphify hook install` (hooks git propios de graphify), `graphify watch`.
- **Frescura:** el grafo es una foto del working tree en el último refresh. Si el código cambió y no corrió el refresh, el grafo (y las respuestas basadas en él) pueden estar desactualizados.

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

### Arquitectura de aislamiento: Tenant + Empresa

**Regla fundamental:** TODO se separa por `company_id` (tenant) + `empresa_id` (empresa activa).

**EXCEPCIONES (catálogos compartidos a nivel tenant, sin empresa_id):**
1. **Países** (`paises`)
2. **Estados/ciudades** (`estados`, `ciudades`)  
3. **Monedas** (`monedas`)

**TODO LO DEMÁS requiere separación por empresa_id:**
- Clientes, proveedores, artículos
- Vendedores, cobradores, metas
- Facturas, cobros, pagos, movimientos
- Planes de comisión
- Nómina, empleados, proyectos
- Cualquier dato operativo

**Implementación:**
- Trait `HasEmpresa` filtra automáticamente por `empresa_id = empresa_activa()->id`
- **NUNCA** usar `sinScopeEmpresa()` en endpoints operativos
- Solo usar `sinScopeEmpresa()` en: seeders, reportes cross-empresa con autorización, APIs de config global del tenant

**Patrón defensivo en controladores:**
```php
$empresa = empresa_activa();
$company = company();
abort_unless($empresa && $company, 403);
```

**Ejemplo:**
- TENANT (company_id) = "Grupo Empresarial XYZ"
  - EMPRESA1 (empresa_id) = "Constructora XYZ SA"
  - EMPRESA2 (empresa_id) = "Servicios XYZ SRL"
  
Los vendedores de Constructora NO aparecen en Servicios, las facturas NO se mezclan, los clientes son completamente independientes.

### Resumen del checklist (módulo nuevo)

1. **Rutas** — `routes/modules/{slug}.php` con `Route::prefix('{slug}')->name('{slug}.')` interno; `web.php` solo aplica `module:{slug}`
2. **Controladores** — `app/Http/Controllers/{Modulo}/`
3. **Modelos** — `app/Models/{Modulo}/` **sin** `$connection`
4. **Migraciones** — **sin** `$connection`. Prefijo de tabla obligatorio (`xxx_*`)
5. **BD** — usar `zyntello_app` con prefijo. Nunca crear BD nueva
6. **PricingService** — registrar el slug en `App\Services\PricingService::MODULES`
7. **Vistas** — `resources/views/{slug}/` (full-width Tailwind, sin max-width centrado)
8. **DemoSeeder** — agregar datos demo y el slug a la lista de módulos activos
9. **📜 DOCUMENTOS LEGALES** — actualizar Términos y Privacidad con el módulo nuevo, subir la
   versión, la fecha y el control de cambios, y **desplegar**. Ver la directiva de documentos
   legales más abajo. **Un módulo no está terminado si los documentos legales no lo mencionan.**

### ⚠️ DIRECTIVA TRANSVERSAL OBLIGATORIA — todo módulo nuevo debe contemplar

> **Sin excepción. Aplica al diseñar CUALQUIER módulo o funcionalidad nueva.**

1. **Multimoneda desde el diseño** — la empresa puede tener **1, 2 o más monedas**. Todo documento/movimiento con valor monetario guarda **`moneda_id` + `tipo_cambio` + equivalente funcional** (`monto_funcional`/`total_funcional` = monto × tasa). Los **agregados** usan `COALESCE(*_funcional, *)`; los **reportes** muestran filas en moneda original y **totales/asientos en moneda funcional**. El flujo **monomoneda debe seguir igual** (tasa = 1 ⇒ funcional == original; campos nullable/backfill). La tasa se guarda **siempre** en cada movimiento (referencia/auditoría).
2. **Mueve inventario ⇒ movimiento de inventario** — toda operación que afecte stock/productos genera su **movimiento de inventario** (`inv_movimientos` vía el servicio de Inventario). Nunca tocar stock por fuera.
3. **Es contabilizable ⇒ asiento contable** — toda operación contabilizable dispara su **asiento** vía `MovimientoFinancieroService::registrar` (evento → `IntegracionContableService`), **en moneda funcional**, respetando la config de integración del módulo (puede estar desactivada).
4. **Es venta ⇒ mueve Facturación** — si la operación es una venta, debe reflejarse en **Facturación** (y su cadena: stock, CxC, caja si aplica).
5. **Cuentas Contables por módulo** — cada módulo **crea/configura SUS cuentas contables en su propio menú de Configuración** (patrón `Configuracion\ParametrosContablesController`, tabla estándar `Operación | CC | Cuenta | Descripción` + modal cascada CC→cuenta). **Nunca hardcodear cuentas**; leerlas de la config del módulo.
6. **Integridad transversal** — respetar la integridad de **todos** los módulos interconectados: usar los servicios/eventos core (CxP/CxC, MovimientoFinancieroService, Inventario, Facturación, Presupuesto vía `GastoRegistrado`), no duplicar lógica ni registros (ej. un cobro/asiento se registra **una sola vez**, de fuente única).
7. **Documentos legales al día** — todo módulo nuevo o cambio de alcance de un módulo existente
   obliga a revisar y adaptar los documentos legales públicos. Ver la directiva completa en la
   sección siguiente.

---

## 📜 DIRECTIVA — DOCUMENTOS LEGALES SIEMPRE VIGENTES (MANDATORIA)

> **Los documentos legales NUNCA pueden quedar obsoletos.** Describen lo que el sistema hace de
> verdad; si el sistema cambia y el documento no, el documento pasa a ser falso. Un documento legal
> desactualizado es un riesgo regulatorio y puede costar la aprobación de la API de WhatsApp
> Business, la de una pasarela de pago o la defensa ante un reclamo.

### Documentos cubiertos por esta política

**Todos**, sin excepción. Hoy son:

| Documento | Fuente (editar aquí) | URL pública |
|---|---|---|
| Términos y Condiciones del Servicio | `public/terminos/index.html` | `https://zyntello.com/terminos/` |
| Política de Privacidad | `public/privacidad/index.html` | `https://zyntello.com/privacidad/` |
| Eliminación de datos de usuario | `public/eliminacion-datos/index.html` | `https://zyntello.com/eliminacion-datos/` |

> **Las tres URLs son las que se configuran en Meta** (WhatsApp Business): Términos, Privacidad y
> «URL de instrucciones para la eliminación de datos». Si una de las tres deja de responder 200 o
> deja de ser cierta, el canal de WhatsApp queda en riesgo.

> Cualquier documento legal que se cree en el futuro (acuerdo de encargo de tratamiento, política
> de cookies separada, aviso de subencargados, condiciones de un módulo específico, acuerdo de
> nivel de servicio) **entra automáticamente en esta política** y se agrega a esta tabla.

### Cuándo hay que revisarlos y actualizarlos — disparadores

Al ocurrir cualquiera de estos hechos, la actualización de los documentos legales es **parte de la
tarea**, no un trabajo posterior:

1. **Se crea un módulo nuevo** → agregarlo a la tabla de módulos de los Términos (§4.1) y a la
   tabla de datos por módulo (Términos §14 y Privacidad §4).
2. **Se amplía o cambia el alcance de un módulo existente** → corregir su descripción. Ejemplo
   real: cuando Car Wash ganó el taller, o Prestamello el catálogo de bienes financiables, su
   descripción dejó de ser cierta.
3. **Se empieza a tratar una categoría de dato personal nueva** (documento de identidad,
   biometría, geolocalización, salud, historial crediticio, fotografía de personas) → Términos §14
   y Privacidad §4, marcándola como dato de alto impacto si lo es.
4. **Se integra un tercero nuevo** (pasarela de pago, proveedor de IA, buró de crédito, canal de
   mensajería, servicio de correo, hosting, administración tributaria) → Términos §15 y
   Privacidad §5, con el enlace a la política de privacidad de ese tercero.
5. **Se agrega un canal de comunicación** o cambia cómo se usa WhatsApp → Términos §12 y
   Privacidad §6.
6. **Cambian planes, precios, forma de cobro o política de reembolso** → Términos §7 y §8.
7. **Se opera en un país nuevo** → Privacidad §10 (normativa aplicable) y Términos §17 si trae
   requisitos fiscales propios.
8. **Cambian los plazos de conservación, la seguridad o los respaldos** → Privacidad §8 y §11.
9. **Se publica un portal público nuevo** (enlace o QR sin login) → Términos §14 y Privacidad §4.
10. **Cambia la razón social, el domicilio, el RNC o el contacto** → §1 de ambos documentos.

### Qué hacer en cada actualización — los cinco pasos, siempre los cinco

1. **Revisar el documento completo**, no solo la sección obvia. Un módulo nuevo suele tocar cuatro
   secciones a la vez (módulos, datos por módulo, terceros y conservación).
2. **Subir la versión** en el encabezado, con criterio:
   - `1.0 → 1.1` — se agrega un módulo, un tercero o una categoría de dato; se corrige una
     descripción. **No cambia lo que el suscriptor acepta.**
   - `1.x → 2.0` — cambian obligaciones, plazos, precios, jurisdicción, límites de
     responsabilidad o el tratamiento de datos. **Cambia lo que el suscriptor acepta** ⇒ además
     hay que **avisar con 30 días de antelación** (Términos §21 / Privacidad §17).
3. **Actualizar la fecha** de «Última actualización» en el encabezado.
4. **Agregar la entrada al Control de cambios** al final del documento: versión, fecha y qué
   cambió, en lenguaje que se entienda sin abrir el diff. **Las entradas nunca se borran ni se
   editan** — el historial es acumulativo desde la v1.0 y es la prueba de la evolución del
   documento.
5. **Compilar y desplegar.** Editar `public/` no publica nada: hay que correr el build para que
   pase a `dist/`, commitear `dist/` y desplegar. Verificar la URL pública en producción antes de
   dar la tarea por cerrada.

```powershell
# Build + verificación + deploy del sitio (repo zyntello-website)
& 'C:\Program Files\nodejs\node.exe' 'C:\Users\Sistemas\AppData\Roaming\npm\node_modules\npm\bin\npm-cli.js' run build
# commitear public/ + dist/ y luego:
.\deploy-website.ps1
# verificar en producción (debe responder 200 y traer la versión nueva):
curl -s https://zyntello.com/terminos/ | Select-String "Versión|Última actualización"
```

### Reglas de forma que no se negocian

- **Los dos documentos se revisan juntos.** Un cambio casi nunca toca solo uno. Si de verdad solo
  aplica a uno, dejarlo dicho en el commit.
- **Coherencia entre ambos.** Términos §14 y Privacidad §4 describen los mismos datos: si
  divergen, uno de los dos es falso.
- **Sin dependencias externas** en las páginas: fuentes del sistema, cero CDN, cero scripts de
  terceros. Deben cargar aunque el rastreador de Meta bloquee todo lo externo.
- **Accesibles sin login y sin `robots: noindex`.** Meta y las pasarelas las rastrean.
- **Nada de `[CORCHETES]` ni placeholders en la versión publicada.** Si falta un dato, se redacta
  sin él o se pregunta; no se publica un hueco.
- ⚠️ Las plantillas de `app/zyntello-app/docs/legal/*.md` son **borradores históricos** y **NO son
  la versión vigente**. La fuente de verdad es `public/`.
- Las páginas declaran que las versiones anteriores están disponibles a solicitud: conservar los
  commits (nunca reescribir el historial de estos archivos).

### Lo que NUNCA se debe hacer

- ❌ Cerrar un módulo nuevo sin haber tocado los documentos legales.
- ❌ Actualizar el texto sin subir la versión, la fecha y el control de cambios.
- ❌ Borrar o reescribir entradas del control de cambios.
- ❌ Editar `public/` y no desplegar: el documento vigente es el que está en producción.
- ❌ Afirmar en el documento algo que el sistema no hace (o dejar de mencionar algo que sí hace).

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
- **UX Combos:** TODOS los combos/selects de datos (clientes, proveedores, artículos, empleados, etc.) DEBEN tener búsqueda. Excepciones: solo combos con 2-3 opciones fijas (Activo/Inactivo). Usar TomSelect (preferido), Alpine.js búsqueda client-side, o modal buscador según tamaño del dataset. Ver detalle en `app/zyntello-app/CLAUDE.md`.
- **Consecutivos propios:** sistema de 8 fases (`[#1379]`–`[#1387]`) que permite al suscriptor crear consecutivos y elegir cuál usar por documento (Ventas/CxC/Compras/CxP/Bancos/Caja Chica/Contabilidad). Activación por módulo en Configuración → Consecutivos. Al integrar un módulo nuevo que numere documentos: (1) columna `consecutivo_id` nullable + fillable, (2) `@include('shared.selector-consecutivo')` en el form si `$usaConsecutivosPropios`, (3) numerar con `ConsecutivoService::numeroParaDocumento()` con fallback a la numeración predeterminada, (4) SIEMPRE filtrar por `company_id + empresa_id` (modelo `Consecutivo` usa `HasEmpresa`). Detalle en `app/zyntello-app/CLAUDE.md` (Sesión 2026-06-20) y memoria `project_consecutivos`.

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
