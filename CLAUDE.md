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
| `caj_*` | Caja (POS) — integrado a Facturación, sesiones y movimientos de efectivo |

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
- Passphrase: `C3dul@13238162`
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

### Bitácora reciente (estado actual — 2026-07-27)

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

> Último commit en **zyntello-app**: `[CND-FIX]` `c7c115eb` (correcciones post-cierre Condominios: discrepancias + config del módulo + fix bucle del combo de módulos) | Último commit en **zyntello-admin**: `[#498]` `59f3ed8` | Último commit en **zyntello-website**: `735fcc0`

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
- **Salida:** `graphify-out/` en la raíz (**gitignored**) → `graph.json` (**18,502 nodos / 39,782 aristas / 2,190 comunidades** tras el refresh del 2026-07-24, 3 repos fusionados), `GRAPH_REPORT.md`, `GRAPH_TREE.html` (navegador jerárquico D3 — recomendado), `graph.html` (force-directed, pesado a >5000 nodos).
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

### ⚠️ DIRECTIVA TRANSVERSAL OBLIGATORIA — todo módulo nuevo debe contemplar

> **Sin excepción. Aplica al diseñar CUALQUIER módulo o funcionalidad nueva.**

1. **Multimoneda desde el diseño** — la empresa puede tener **1, 2 o más monedas**. Todo documento/movimiento con valor monetario guarda **`moneda_id` + `tipo_cambio` + equivalente funcional** (`monto_funcional`/`total_funcional` = monto × tasa). Los **agregados** usan `COALESCE(*_funcional, *)`; los **reportes** muestran filas en moneda original y **totales/asientos en moneda funcional**. El flujo **monomoneda debe seguir igual** (tasa = 1 ⇒ funcional == original; campos nullable/backfill). La tasa se guarda **siempre** en cada movimiento (referencia/auditoría).
2. **Mueve inventario ⇒ movimiento de inventario** — toda operación que afecte stock/productos genera su **movimiento de inventario** (`inv_movimientos` vía el servicio de Inventario). Nunca tocar stock por fuera.
3. **Es contabilizable ⇒ asiento contable** — toda operación contabilizable dispara su **asiento** vía `MovimientoFinancieroService::registrar` (evento → `IntegracionContableService`), **en moneda funcional**, respetando la config de integración del módulo (puede estar desactivada).
4. **Es venta ⇒ mueve Facturación** — si la operación es una venta, debe reflejarse en **Facturación** (y su cadena: stock, CxC, caja si aplica).
5. **Cuentas Contables por módulo** — cada módulo **crea/configura SUS cuentas contables en su propio menú de Configuración** (patrón `Configuracion\ParametrosContablesController`, tabla estándar `Operación | CC | Cuenta | Descripción` + modal cascada CC→cuenta). **Nunca hardcodear cuentas**; leerlas de la config del módulo.
6. **Integridad transversal** — respetar la integridad de **todos** los módulos interconectados: usar los servicios/eventos core (CxP/CxC, MovimientoFinancieroService, Inventario, Facturación, Presupuesto vía `GastoRegistrado`), no duplicar lógica ni registros (ej. un cobro/asiento se registra **una sola vez**, de fuente única).

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
