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

## 🔒 DIRECTIVA SUPERIOR — AISLAMIENTO `company_id` + `empresa_id` (MANDATORIA, SIN EXCEPCIÓN)

> **Está por encima de cualquier otra consideración técnica: rendimiento, elegancia, comodidad o
> plazo. Los datos de dos suscriptores NUNCA se mezclan, y los de dos empresas del mismo
> suscriptor TAMPOCO.**
>
> No es una convención del proyecto: es la promesa que Zyntello le vende a cada cliente y la que
> afirman los documentos legales publicados. Un cruce no produce un error que alguien vea — produce
> **una pantalla plausible con los datos de otro**, y eso se descubre cuando un cliente ve el nombre
> de un tercero en su propio sistema.

### La regla, en una línea

**Toda tabla, todo modelo, toda consulta, toda vista, todo combo, todo reporte, todo endpoint,
todo seeder y toda prueba se acota por `company_id` Y por `empresa_id`. Las dos, siempre.**

### Al crear una TABLA

1. Lleva **`company_id`** y **`empresa_id`**, salvo que esté en la lista cerrada de excepciones
   (más abajo). No hay una tercera opción.
2. Su UNIQUE **incluye las dos columnas**. ⚠️ Un UNIQUE que se olvida de `empresa_id` no falla al
   escribirlo: **revienta con un 1062 la primera vez que la segunda empresa lo use de verdad**, y
   el usuario solo ve «Duplicate entry» — un error del motor que no dice nada del negocio.
   (Pasó en `inv_config_inventario`, en `fact_configuracion_fiscal` y en `tn_permission_grants`.)
3. Si la tabla guarda un permiso, una configuración o una preferencia, la dimensión que la acota va
   **en la CLAVE del `updateOrCreate`, nunca en los valores**: si va en los valores, guardar en la
   empresa B **pisa la fila de la A** sin decir nada.

### Al crear un MODELO

1. Usa el trait **`HasEmpresa`**, cuyo global scope filtra `company_id` **y** `empresa_id`.
2. ⚠️ **El scope es LAXO con el NULL**: una fila **sin `empresa_id` se ve desde TODAS las empresas
   del tenant.** Por eso una fila huérfana de empresa no es un detalle cosmético — es una fuga.
   Hay que medir que no existan (`WHERE empresa_id IS NULL`), no suponerlo.

### ⚠️⚠️ `sinScopeEmpresa()` — la puerta por la que se cuelan los cruces

`sinScopeEmpresa()` **apaga el global scope entero**, o sea las DOS condiciones. Cada consulta que
lo use **tiene que reponerlas a mano**, y ahí es donde se cuela el defecto:

- Filtrar solo `company_id` → se ven **los datos de otras empresas del mismo suscriptor**.
- No filtrar nada → se ven **los de otros suscriptores**.

**Reglas de uso, obligatorias:**

1. `sinScopeEmpresa()` **solo** en seeders, procesos por CLI que reciben el tenant por parámetro,
   reportes cross-empresa explícitamente autorizados, y catálogos globales del tenant.
   **NUNCA en un endpoint operativo** para «que se vea todo».
2. Siempre que se use, la reposición del filtro va en un **scope con nombre y fuente única**
   (ej. `scopeDelTenant($companyId, $empresaId)` de `App\Models\Tablas\Agente`), **nunca escrita a
   mano en cada consulta**: con el criterio repetido en seis sitios, el primero que se olvide
   devuelve el dato a ser global **y nada lo dice**. (Medido: de seis copias, **dos ya habían
   divergido**.)
3. Ese scope reproduce **exactamente** lo que hace el global scope, incluido el
   `orWhereNull('empresa_id')` de los registros globales del tenant — sin esa rama, los registros
   globales **desaparecen de todas las pantallas** al desactivar el scope.
4. Un método que **recibe la empresa por parámetro NO puede resolver sus datos con modelos que
   leen la sesión**, y **sus relaciones tampoco**: con el usuario en la empresa A, un proceso de la
   B falla o —peor— escribe en la empresa equivocada. En CLI el scope está desactivado, así que
   **funciona por casualidad en la consola y falla en la web**, o al revés.

### Al escribir un CONTROLADOR

```php
$empresa = empresa_activa();
$company = company();
abort_unless($empresa && $company, 403);
```

⚠️ Y no basta con ponerlo: **un `abort_unless` que valida `company()` no protege si dos líneas
después se redefine `$company` con `currentCompany`**, que puede ser null. Ese anti-patrón ya
apareció en 10 métodos de un mismo archivo.

⚠️ **Un id que llega del REQUEST o de la URL se resuelve SIEMPRE acotado por las dos dimensiones.**
Sin eso, pegar el id de otra empresa en la URL abre —y deja EDITAR— su ficha, y la pantalla no
muestra nada raro.

### Al escribir una VISTA, un COMBO o un REPORTE

1. Un combo se llena con lo de la **empresa ACTIVA**. ⚠️ El síntoma de no hacerlo **no es una lista
   vacía: es una lista llena de otra empresa** — y el usuario elige de ahí sin sospechar nada.
2. Los ids que un documento ya trae (`$incluirIds`) también se resuelven acotados: vienen de un
   documento, pero el documento pudo capturarse mal.
3. Un reporte cross-empresa **declara en pantalla** que lo es. Si no lo declara, no lo es.

### Al escribir un SEEDER

Un seeder que corre una vez por empresa **crea una fila por empresa**. Si la entidad es del tenant
(una por suscriptor), se acota a la empresa principal **y la limpieza borra las anteriores**, o el
UNIQUE revienta en el siguiente reset.

### Al escribir una PRUEBA

**El aislamiento se prueba con DOS suscriptores y DOS empresas reales, no con uno.** Una prueba que
monta un solo tenant no puede ver un cruce ni aunque lo haya. Y toda consulta que use
`sinScopeEmpresa()` necesita **una guarda estructural** que falle si alguien vuelve a filtrar solo
por `company_id` — *lo que se detecta leyendo el código a mano se degrada; lo que se convierte en
prueba, no.*

### Las ÚNICAS excepciones (lista cerrada)

Catálogos compartidos a nivel tenant, sin `empresa_id`:

1. **Países** (`paises`)
2. **Estados y ciudades** (`estados`, `ciudades`)
3. **Monedas** (`monedas`)

**Todo lo demás lleva las dos columnas**: clientes, proveedores, artículos, agentes, facturas,
cobros, pagos, movimientos, planes de comisión, empleados, permisos, configuraciones, preferencias,
consecutivos y cualquier dato operativo o de configuración.

> Si crees haber encontrado una excepción nueva, **no la implementes**: se declara, se justifica por
> escrito con su motivo y se decide con el director técnico. Una excepción no declarada es una fuga
> que nadie va a volver a mirar.

### Checklist antes de dar por terminado cualquier trabajo

- [ ] ¿Las tablas nuevas tienen `company_id` **y** `empresa_id`?
- [ ] ¿El UNIQUE incluye las dos?
- [ ] ¿Cada `sinScopeEmpresa()` repone las dos condiciones, desde una fuente única?
- [ ] ¿Los ids que llegan del request se resuelven acotados por las dos?
- [ ] ¿Los combos y reportes muestran solo la empresa activa?
- [ ] ¿Hay filas con `empresa_id` NULL que deberían tenerlo? (medirlo, no suponerlo)
- [ ] ¿Hay una prueba con **dos tenants y dos empresas** que falle si el filtro se quita?

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
>
> ⚠️⚠️ **Y antes de escribir una sola línea, releer la
> [DIRECTIVA SUPERIOR de aislamiento `company_id` + `empresa_id`](#-directiva-superior--aislamiento-company_id--empresa_id-mandatoria-sin-excepción)
> que está al inicio de este archivo.** No se crea ninguna tabla, vista, combo, consulta ni prueba
> sin la doble protección. Es la directiva que más veces se ha incumplido teniéndola escrita, así
> que **se lee, no se recuerda.**

---

## Empresa

**Zyntello, S.R.L.** vende suscripciones mensuales a módulos de software empresarial (SaaS B2B). Todos los módulos viven bajo `app.zyntello.com` dentro de una sola app Laravel multi-tenant.

- **Correo:** info@zyntello.com
- **Correo de soporte:** soporte@zyntello.com — canal principal del
  [Acuerdo de Nivel de Servicio](https://zyntello.com/sla/) y el que citan los mensajes de cuota
  de licencias agotada. ⚠️ Está atendido: no sustituirlo por `info@` en textos de cara al cliente.
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

### ⚠️⚠️ El deploy NO es atómico: una petición durante el `git merge` puede dar 500

**Medido el 2026-09-08.** Un `Undefined variable $stats` apareció en producción a las 20:31, y las
horas lo explicaron: cayó **entre dos `git pull`** del servidor (20:28:49 y 20:37:11). El código no
tenía ningún defecto —el controlador pasaba la variable y la pantalla funciona— pero Apache sirvió
una petición **mientras los archivos se estaban reemplazando**.

El síntoma es desconcertante porque **no se reproduce después**: el error dice que falta una
variable que sí existe, y al ir a mirarlo la pantalla va bien. Se pierde el rato buscando un
defecto que no está.

⚠️ **Con DOS sesiones desplegando** —algo habitual en este proyecto— la ventana se multiplica.

**Recomendación**: envolver el deploy en modo mantenimiento.

```powershell
plink -i $KEY -P $PORT -batch $SSHHOST "cd public_html/zyntello/app && /usr/local/bin/php artisan down --retry=15"
# … fetch, merge, migrate, optimize:clear, config:cache, route:cache …
plink -i $KEY -P $PORT -batch $SSHHOST "cd public_html/zyntello/app && /usr/local/bin/php artisan up"
```

⚠️ **El `up` va SIEMPRE, incluso si un paso intermedio falla**: un deploy que revienta a medias con
la app en `down` la deja caída para todos, que es peor que el 500 puntual que se quería evitar. Y
si dos sesiones despliegan a la vez, la segunda `up` puede levantar la app mientras la primera aún
copia — coordinarlo o desplegar de una en una.

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

---

## 📚 Bitácora y reglas aprendidas — están FUERA de este archivo

> **Movidas el 2026-09-08. No se borró ni una línea.**
>
> La bitácora vivía aquí dentro y había crecido hasta **520 KB (~152k tokens)**. Sumada a la de
> `app/zyntello-app/CLAUDE.md` daba **~598k tokens** de instrucciones cargadas en cada sesión,
> que consumían contexto de trabajo sin que casi nada de eso se releyera. Ahora son **~9k**.
>
> ⚠️ **Lo que NO era**: no es lo que impide despachar subagentes. Medido — antes de mover nada
> un subagente moría con un prompt de 229.723 tokens; después de quitar 589k de aquí, murió con
> **229.094**. Una diferencia de 629 tokens: el `CLAUDE.md` apenas entraba en ese prompt. El peso
> viene de las **definiciones de herramientas** (los servidores MCP conectados). Se anota para
> que nadie repita el diagnóstico.
>
> | Dónde | Qué es |
> |---|---|
> | [`docs/REGLAS-APRENDIDAS.md`](docs/REGLAS-APRENDIDAS.md) | Reglas del ecosistema, destiladas de la bitácora |
> | [`docs/bitacora/ecosistema-historico.md`](docs/bitacora/ecosistema-historico.md) | El relato completo de cada sesión |
> | [`app/zyntello-app/docs/REGLAS-APRENDIDAS.md`](app/zyntello-app/docs/REGLAS-APRENDIDAS.md) | **502 reglas** de la app SaaS, por tema |
> | [`app/zyntello-app/docs/bitacora/app-historico.md`](app/zyntello-app/docs/bitacora/app-historico.md) | Bitácora técnica de la app |
>
> ⚠️ **Al cerrar un trabajo, la entrada nueva va en `docs/bitacora/`, no aquí.** Este archivo es
> para lo que hay que leer SIEMPRE; la bitácora es para consultar. Mezclarlas es lo que produjo
> el problema que este cambio resuelve.
