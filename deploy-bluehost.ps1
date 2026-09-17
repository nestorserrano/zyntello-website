# ============================================================================
# DEPLOY ZYNTELLO-APP A BLUEHOST VÍA SSH  (DESATENDIDO)
# ============================================================================
# Despliega zyntello-app a producción sin pedir nada:
#   artisan down → git pull → optimize:clear → migrate → limpiar vistas+permisos
#   → artisan up → rebuild cache
#
# ⚠️⚠️ La cache va DESPUES de levantar la app, y no es un detalle de orden: cuando
#   iba antes, `view:cache` tumbaba el SSH de Bluehost, el `artisan up` ya no podia
#   correr y el sitio se quedaba en 503 POR RECONSTRUIR UNA CACHE. Paso el
#   2026-09-15. La app funciona sin cache optimizada; caida, no.
#
# ⚠️ EL MODO MANTENIMIENTO NO ES OPCIONAL: el deploy NO es atomico. `git pull`
#   reemplaza los archivos del directorio que Apache sirve, y una peticion que
#   caiga en esa ventana ve el codigo a medio actualizar -> 500 AL USUARIO.
#   Medido el 2026-09-08 en produccion. El `up` va en un `finally`, asi que la app
#   se levanta AUNQUE un paso falle.
#
# ACCESO SSH SIN PROMPTS:
#   - Usa la clave zyntello.ppk SIN passphrase (quitada con PuTTYgen).
#   - Fija la host key del servidor con -hostkey → no pide aceptar host key.
#   - plink -batch → cero prompts interactivos.
#
# SI LA CLAVE TIENE PASSPHRASE:
#   El script lo detecta y avisa. Para quitarla (una sola vez):
#     1. Abrir PuTTYgen
#     2. Load -> C:\wamp64\www\zyntello\zyntello.ppk  (passphrase: <tu-passphrase>)
#     3. Dejar "Key passphrase" y "Confirm passphrase" VACIOS
#     4. Save private key -> SOBRESCRIBIR C:\wamp64\www\zyntello\zyntello.ppk
#        (PuTTYgen pregunta "save without passphrase?" -> Yes)
#
# USO:
#   .\deploy-bluehost.ps1             # desatendido
#   .\deploy-bluehost.ps1 -Confirmar  # pide S/N antes de desplegar
# ============================================================================

param([switch]$Confirmar, [string]$Puerto)

$ErrorActionPreference = "Continue"

# ── Configuración ───────────────────────────────────────────────────────────
$KEY     = "C:\wamp64\www\zyntello\zyntello.ppk"
$HOSTKEY = "SHA256:/J5knqfWDwYYC6DQvknQRMxco7GHIkAyPJQY8w2SFog"   # ed25519 de ukr.meu.mybluehost.me
$SSHHOST = "ukrmeumy@162.241.225.12"   # el panel de Bluehost da la IP; antes: ukr.meu.mybluehost.me
# El panel SSH Management de Bluehost da el comando sin puerto
#   $ ssh ukrmeumy@162.241.225.12
# es decir el 22 por defecto. Antes se usaba el 2222 (legacy Bluehost).
# Se deja parametrizable: .\deploy-bluehost.ps1 -Puerto 2222 si vuelve a cambiar.
$PORT    = if ($Puerto) { $Puerto } else { "22" }
$APP_DIR = "public_html/zyntello/app"

# ── Verificar que la clave NO tenga passphrase ──────────────────────────────
if (-not (Test-Path $KEY)) {
    Write-Host "ERROR: no se encontro la clave $KEY" -ForegroundColor Red
    exit 1
}
if (Select-String -Path $KEY -Pattern 'Encryption: aes' -Quiet) {
    Write-Host "ERROR: la clave $KEY TODAVIA tiene passphrase (Encryption: aes...)." -ForegroundColor Red
    Write-Host "Quitala con PuTTYgen y SOBRESCRIBE el mismo archivo:" -ForegroundColor Yellow
    Write-Host "  Load -> $KEY (passphrase: <tu-passphrase>) -> Key passphrase VACIO -> Save private key" -ForegroundColor White
    exit 1
}

# ── Modo mantenimiento ──────────────────────────────────────────────────────
# ⚠️⚠️ POR QUE EXISTE: el deploy NO es atomico. `git pull` reemplaza los archivos
# del directorio que Apache esta sirviendo, asi que una peticion que caiga en esa
# ventana ve el codigo a medio actualizar y devuelve un 500 AL USUARIO.
#
# Medido el 2026-09-08: un "Undefined variable $stats" aparecio en produccion
# justo entre dos pulls. El codigo no tenia ningun defecto -- la pantalla funciona
# y no se reproduce despues -- pero el usuario vio un error. Con dos sesiones
# desplegando a la vez, la ventana se multiplica.
# Comprueba el estado REAL del sitio. 503 = en mantenimiento, 200 = arriba.
function Get-EstadoApp {
    try {
        return (Invoke-WebRequest -Uri "https://app.zyntello.com/login" -Method Head `
            -TimeoutSec 20 -UseBasicParsing -ErrorAction Stop).StatusCode
    } catch {
        return $_.Exception.Response.StatusCode.value__
    }
}

# ⚠️⚠️ Se llama SIEMPRE, tambien cuando un paso intermedio falla. Un deploy que
# revienta con la app en `down` la deja CAIDA PARA TODOS, que es mucho peor que el
# 500 puntual que se queria evitar.
#
# ⚠️ Y si `artisan up` no puede correr -- porque el codigo recien traido esta roto
# y la app no arranca -- se borran los archivos de mantenimiento A MANO. Sin esa
# segunda via, un despliegue con un error de sintaxis dejaria el sitio apagado y
# el propio comando para levantarlo tampoco funcionaria.
#
# ⚠️⚠️ SON DOS ARCHIVOS, y borrar solo uno NO levanta la app. Costo un rato el
# 2026-09-16, con el sitio caido y sin entender por que el rescate no hacia nada:
#
#   storage/framework/down            <- EL ESTADO. Es el unico que decide el 503:
#                                        FileBasedMaintenanceMode::active() lo lee.
#   storage/framework/maintenance.php <- solo el ATAJO precompilado que incluye
#                                        public/index.php para responder sin
#                                        arrancar Laravel.
#
# Borrando solo `maintenance.php` se quita el atajo pero queda el estado: Laravel
# arranca, ve `down` y SIGUE devolviendo 503 -- con su `retry-after: 15`, que es
# lo que despista, porque parece que el mantenimiento se quito y el 503 viene de
# otro sitio. Por eso `artisan up` si funcionaba: borra los dos.
#
# El imprescindible es `down`. Va PRIMERO en los `rm` de aqui abajo.
function Exit-Mantenimiento {
    Write-Host "`n[5/5] Levantando la app..." -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor DarkGray

    $r = plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "cd $APP_DIR && /usr/local/bin/php artisan up" 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host $r
    } else {
        Write-Host "artisan up fallo; borrando el archivo de mantenimiento a mano..." -ForegroundColor Yellow
        plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "rm -f $APP_DIR/storage/framework/down $APP_DIR/storage/framework/maintenance.php" 2>&1 | Out-Null
    }

    # No se da por buena la palabra del comando: se COMPRUEBA que el sitio responde, y si
    # no lo hace se REINTENTA. El SSH de Bluehost se cae a menudo justo al cerrar, asi que
    # un solo intento fallido no significa que la app siga caida... ni que este arriba.
    $codigo = Get-EstadoApp

    for ($i = 1; $i -le 3 -and $codigo -ne 200; $i++) {
        Write-Host "  Responde $codigo; reintento $i de 3..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "rm -f $APP_DIR/storage/framework/down $APP_DIR/storage/framework/maintenance.php" 2>&1 | Out-Null
        $codigo = Get-EstadoApp
    }

    if ($codigo -eq 200) {
        Write-Host "  La app responde 200: esta arriba" -ForegroundColor Green
    } else {
        Write-Host "  ATENCION: la app respondio $codigo. Puede seguir en mantenimiento." -ForegroundColor Red
        Write-Host "  Levantar a mano:" -ForegroundColor Yellow
        Write-Host "    plink -i $KEY -P $PORT -batch $SSHHOST `"rm -f $APP_DIR/storage/framework/down $APP_DIR/storage/framework/maintenance.php`"" -ForegroundColor White
    }
}

# ── Banner ──────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Magenta
Write-Host "         DEPLOY ZYNTELLO-APP -> PRODUCCION (BLUEHOST)               " -ForegroundColor Magenta
Write-Host "=====================================================================" -ForegroundColor Magenta
Write-Host ""

# Confirmación opcional (-Confirmar). Por defecto el deploy es desatendido.
if ($Confirmar) {
    Write-Host "Este script ejecutara deployment COMPLETO a produccion:" -ForegroundColor Yellow
    Write-Host "  - git pull origin master en $APP_DIR" -ForegroundColor White
    Write-Host "  - Ejecutar migraciones de base de datos" -ForegroundColor White
    Write-Host "  - Reconstruir cache de Laravel" -ForegroundColor White
    Write-Host ""
    $resp = Read-Host "Continuar? (S/N)"
    if ($resp -ne "S" -and $resp -ne "s") {
        Write-Host "Deployment cancelado." -ForegroundColor Red
        exit 0
    }
}

# ============================================================================
# ⚠️⚠️ EL DESPLIEGUE SE EJECUTA ENTERO EN EL SERVIDOR, NO DESDE AQUI.
#
# Medido el 2026-09-16: el SSH de Bluehost corta toda sesion que DURE unos
# segundos. `git rev-parse` pasa siempre; `php artisan` -- que tarda lo que tarda
# arrancar Laravel -- la tumba SIEMPRE. No es una racha ni el bloqueo temporal por
# conexiones repetidas: es reproducible. Ese dia el deploy no pudo ni empezar,
# porque moria en el `artisan down` del paso 0.
#
# Y no era Laravel: lanzado desacoplado, el mismo comando contestaba
# "Laravel Framework 12.58.0" sin una queja. Lo que no aguanta es la CONEXION.
#
# Asi que `deploy-remoto.sh` se sube con pscp, se lanza con `(nohup ... &)` --
# la sesion SSH se puede caer acto seguido sin llevarselo por delante -- y desde
# aqui se sigue su log. Las protecciones no se pierden: el mantenimiento, el `up`
# incondicional (ahora un `trap EXIT` del propio script) y el aborto si no se pudo
# entrar en mantenimiento viven dentro de el.
# ============================================================================
function Get-LogRemoto {
    param([string]$Archivo)

    # ⚠️⚠️ UN SOLO INTENTO, a proposito, y el motivo costo un deploy entero el
    # 2026-09-16: **Bluehost bloquea el SSH cuando se abren muchas conexiones
    # seguidas**, y consultar el log ES abrir una conexion. Con reintentos y una
    # vuelta cada 10 s, seguir un deploy de 15 minutos pedia ~270 conexiones: el
    # servidor empezo a responder "Connection refused" a TODO, asi que el script
    # se quedo ciego a su propio despliegue -- que mientras tanto iba bien -- y
    # acabo cantando que produccion se habia quedado con el codigo viejo.
    #
    # Vigilar algo no puede costar mas que hacerlo. Si una lectura falla, se
    # espera a la siguiente vuelta: el script remoto corre desacoplado y no
    # depende de que le miremos.
    $r = plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "tail -200 ~/$Archivo 2>/dev/null" 2>&1
    if ($LASTEXITCODE -eq 0) { return ($r | Out-String) }
    return $null
}

function Invoke-DeployRemoto {
    param(
        [string]$Modo,
        [string]$LogRemoto,
        [string]$Descripcion,
        [int]$EsperaMaximaSegundos = 900
    )

    Write-Host "`n$Descripcion" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor DarkGray

    $sh = Join-Path $PSScriptRoot "deploy-remoto.sh"
    if (-not (Test-Path $sh)) {
        Write-Host "  ERROR: no se encontro $sh" -ForegroundColor Red
        return $null
    }

    # ⚠️ pscp y no un `echo ... > archivo` por SSH: una linea de comando larga es
    # justo lo que corta esta conexion, y el contenido no necesita escaparse.
    pscp -i $KEY -P $PORT -hostkey $HOSTKEY -batch $sh "${SSHHOST}:zyn-deploy.sh" 2>&1 | Out-Null

    $lanzado = plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} `
        "chmod +x ~/zyn-deploy.sh && (nohup bash ~/zyn-deploy.sh $Modo > /dev/null 2>&1 &) ; echo LANZADO" 2>&1

    # ⚠️ El lanzamiento puede devolver error con el script YA corriendo: el corte
    # llega despues de ejecutar. No se decide por el codigo de salida -- se mira el
    # log, que es el efecto.
    if ("$lanzado" -notmatch 'LANZADO') {
        Write-Host "  (el lanzamiento no confirmo; se comprueba el log igualmente)" -ForegroundColor Yellow
    }

    # ⚠️ Una vuelta por minuto, no cada 10 s: cada vuelta es una conexion SSH y
    # Bluehost bloquea al que abre muchas seguidas (ver `Get-LogRemoto`). Un deploy
    # dura minutos, no segundos: mirarlo 15 veces basta para seguirlo y no gasta el
    # cupo que necesita el propio despliegue.
    $limite   = (Get-Date).AddSeconds($EsperaMaximaSegundos)
    $log      = $null
    $vueltas  = 0
    $ilegible = 0

    while ((Get-Date) -lt $limite) {
        Start-Sleep -Seconds 60
        $vueltas++
        $leido = Get-LogRemoto -Archivo $LogRemoto

        if ($leido) {
            $log = $leido
            if ($log -match '\[FIN\]') { break }
            $ultima = ($log -split "`n" | Where-Object { $_.Trim() } | Select-Object -Last 1)
            Write-Host "  ... $ultima" -ForegroundColor DarkGray
        } else {
            $ilegible++
            Write-Host "  (vuelta ${vueltas}: no se pudo leer el log; el deploy sigue por su cuenta)" -ForegroundColor DarkGray
        }
    }

    if (-not ($log -match '\[FIN\]')) {
        # ⚠️⚠️ Distinguir las dos cosas, porque llevan a decisiones opuestas: que no
        # podamos LEER el log no dice nada del despliegue -- corre desacoplado -- y
        # dar eso por un fallo fue exactamente lo que paso el 2026-09-16.
        if ($ilegible -eq $vueltas -and $vueltas -gt 0) {
            Write-Host "  NO SE PUDO LEER EL LOG en ninguna de las $vueltas vueltas." -ForegroundColor Yellow
            Write-Host "  Eso NO significa que el deploy fallara: el script remoto corre" -ForegroundColor Yellow
            Write-Host "  desacoplado. Se comprueba abajo por el COMMIT y por HTTP." -ForegroundColor Yellow
        } else {
            Write-Host "  El script remoto no termino dentro de $EsperaMaximaSegundos s." -ForegroundColor Red
        }
    }

    Write-Host ""
    Write-Host $log
    return $log
}

$log = Invoke-DeployRemoto -Modo "deploy" -LogRemoto "zyn-deploy.log" `
    -Descripcion "[1/2] Desplegando (mantenimiento -> merge -> migrate -> up)..."

# ⚠️ Red de seguridad: si el script remoto no llego a su `trap` -- porque lo mato
# el servidor, no porque fallara un paso -- la app se quedaria en mantenimiento.
# `Exit-Mantenimiento` comprueba por HTTP y borra los dos archivos si hace falta.
# ⚠️⚠️ Si el deploy se abstuvo porque OTRA sesion esta desplegando, aqui no se
# toca nada: el 503 es SUYO. Forzar el levantado le quitaria el mantenimiento en
# mitad de su copia de archivos -- el 500 al usuario que el mantenimiento existe
# para evitar, provocado justo por la red que venia a proteger.
#
# Paso el 2026-09-16: dos sesiones desplegaron a la vez, esta leyo el 503 de la
# otra como suyo, y ademas su polling bloqueo el SSH y dejo a la otra sin poder
# aplicar sus migraciones. Ninguna sabia de la otra.
# ⚠️⚠️ Los avisos del script remoto se REPITEN aparte, porque si no se pierden: el
# log se vuelca entero y un `[!!] QUEDAN 3 MIGRACIONES PENDIENTES` queda enterrado
# entre cuarenta lineas de salida normal. Ese aviso es el que separa un despliegue
# bueno de uno que dejo produccion con el codigo nuevo y el esquema viejo.
$avisos = ($log -split "`n") | Where-Object { $_ -match '\[!!\]' }
if ($avisos) {
    Write-Host ""
    Write-Host ("!" * 70) -ForegroundColor Red
    $avisos | ForEach-Object { Write-Host "  $($_.Trim())" -ForegroundColor Red }
    Write-Host ("!" * 70) -ForegroundColor Red
}

if ($log -match 'otro deploy en curso') {
    Write-Host "`n  OTRA SESION esta desplegando: no se toca el mantenimiento." -ForegroundColor Yellow
    Write-Host "  Espera a que termine y vuelve a desplegar." -ForegroundColor Yellow
    exit 1
}

if (-not ($log -match '\[FIN\]') -or (Get-EstadoApp) -ne 200) {
    Write-Host "`n  La app no responde 200: se fuerza el levantado." -ForegroundColor Yellow
    Exit-Mantenimiento
}

# ⚠️⚠️ Aqui NO se decide por el log, y el motivo es de 2026-09-16: el log no se
# pudo leer -- Bluehost habia bloqueado el SSH por las conexiones del propio
# polling -- y el script dio el deploy por fallido anunciando que produccion se
# habia quedado con el codigo viejo. Era falso: el despliegue habia corrido.
#
# La verdad es el COMMIT que tiene produccion. El log sirve para SEGUIR el deploy;
# para juzgarlo, se mira el efecto.
if ($log -notmatch '\[DEPLOY-OK\]') {
    Write-Host "`nEl log no confirma el despliegue. Se comprueba por el commit:" -ForegroundColor Yellow

    $esperado = (git -C "$PSScriptRoot\app\zyntello-app" rev-parse HEAD | Out-String).Trim()
    $puesto   = (plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "cd $APP_DIR && git rev-parse HEAD" | Out-String).Trim()

    Write-Host "  aqui      : $esperado"
    Write-Host "  produccion: $puesto"

    if ($esperado -and $puesto -and $esperado -eq $puesto) {
        Write-Host "  El codigo SI llego: el deploy corrio aunque no pudieramos verlo." -ForegroundColor Green
    } else {
        Write-Host "`n  Produccion NO tiene este codigo. La app esta arriba con el ANTERIOR." -ForegroundColor Red
        Write-Host "  Revisa ~/zyn-deploy.log en el servidor cuando el SSH responda." -ForegroundColor Yellow
        exit 1
    }
}

# ============================================================================
# PASO 4: RECONSTRUIR CACHE OPTIMIZADO -- DESPUES de levantar la app
# ----------------------------------------------------------------------------
# ⚠️⚠️ Medido el 2026-09-15, y costo el sitio caido: los tres `artisan` iban
# ENCADENADOS EN UNA SOLA CONEXION y dentro del `try`, o sea ANTES de levantar la
# app. `view:cache` compila mas de mil vistas y **tumba el SSH de Bluehost**
# ("Remote side unexpectedly closed network connection"). Al caerse esa conexion,
# el servidor deja de aceptar las siguientes, asi que el `artisan up` del
# `finally` tampoco pudo correr -- y la app se quedo en mantenimiento, con un 503
# para todos, POR RECONSTRUIR UNA CACHE.
#
# La cache es una optimizacion: la app funciona sin ella, compilando cada vista la
# primera vez que se pide. Cambiar el sitio caido por unos milisegundos de primera
# carga es el peor intercambio posible, asi que ahora va despues del `up`.
#
# ⚠️ Los tres corren ya DENTRO de `deploy-remoto.sh`, desacoplados de la sesion
# SSH, asi que `view:cache` -- el que compila mas de mil vistas y tumbaba la
# conexion -- ya no se lleva por delante a nadie: la conexion puede caerse sin
# que el proceso se entere. Antes hacia falta una conexion por paso; ahora no.
#
# ⚠️ Y ningun fallo suyo tumba el despliegue, por eso el resultado se ignora
# (`| Out-Null`): la app ya esta arriba y sirve igual sin cache optimizada.
# ============================================================================
Invoke-DeployRemoto -Modo "cache" -LogRemoto "zyn-cache.log" `
    -Descripcion "[2/2] Reconstruir cache optimizado (la app YA esta arriba)..." `
    -EsperaMaximaSegundos 600 | Out-Null

# ============================================================================
# RESUMEN FINAL
# ============================================================================
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "                  DEPLOYMENT COMPLETADO                             " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Aplicacion actualizada en: https://app.zyntello.com" -ForegroundColor Cyan
Write-Host ""

# El estado final se VERIFICA comparando el commit, no se da por bueno porque el
# script llego hasta aqui: si falto el push o el pull no trajo nada, produccion
# sigue con el codigo viejo y "COMPLETADO" seria falso.
Write-Host "Verificacion: produccion tiene que estar en el mismo commit que aqui" -ForegroundColor White
Write-Host ("=" * 70) -ForegroundColor DarkGray
$local  = (git -C "$PSScriptRoot\app\zyntello-app" rev-parse HEAD | Out-String).Trim()
$remoto = (plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "cd $APP_DIR && git rev-parse HEAD" | Out-String).Trim()
Write-Host "  aqui      : $local"
Write-Host "  produccion: $remoto"
# ⚠️⚠️ TRES desenlaces, no dos. Medido el 2026-09-16: el deploy funciono entero
# —merge, migrate, up y las tres caches OK— y esta comprobacion dijo
# "NO CUADRA -> produccion NO tiene este codigo" porque plink murio con
# "Remote side unexpectedly closed network connection" y $remoto llego VACIO.
# Produccion tenia el commit correcto: se comprobo a mano un minuto despues.
#
# Un falso negativo aqui cuesta mas que no comprobar: manda a repetir un deploy
# que ya salio bien —con su ventana de 500 y su modo mantenimiento— y la proxima
# vez que diga la verdad ya no se le creera. "No cuadra" y "no lo pude leer" se
# arreglan en sitios distintos, asi que no pueden decirse con la misma frase.
if (-not $remoto) {
    Write-Host "  NO SE PUDO COMPROBAR -> la conexion no devolvio el commit" -ForegroundColor Yellow
    Write-Host "  Esto NO dice que el deploy fallara: los pasos de arriba ya informaron." -ForegroundColor Yellow
    Write-Host "  Leelo a mano (es un comando corto, git nunca tumba la conexion):" -ForegroundColor Yellow
    Write-Host "    plink -i `$KEY -P `$PORT -batch `$SSHHOST `"cd $APP_DIR && git rev-parse HEAD`"" -ForegroundColor DarkGray
} elseif ($local -and $local -eq $remoto) {
    Write-Host "  CUADRA -> produccion recibio este codigo" -ForegroundColor Green
} else {
    Write-Host "  NO CUADRA -> produccion NO tiene este codigo" -ForegroundColor Red
    Write-Host "  Comprueba el push (git push origin master) y vuelve a desplegar." -ForegroundColor Yellow
}
Write-Host ""
Write-Host "Ultimos commits en produccion:" -ForegroundColor White
Write-Host ("=" * 70) -ForegroundColor DarkGray

# ⚠️⚠️ Esta lista es DECORATIVA y su fallo NO puede decidir el exito del deploy.
# Medido dos veces el 2026-09-16 y el 2026-09-17: el deploy salio perfecto —CUADRA,
# mismo commit, las tres caches con su `INFO ... successfully`— y el script termino
# en exit 1 porque este ultimo plink murio con «Remote side unexpectedly closed
# network connection». Quien solo mira el codigo de salida lee «fallo» y vuelve a
# desplegar algo que ya estaba bien, con su modo mantenimiento y su ventana de 500.
#
# Es la misma familia que [#1127]: el ULTIMO comando no es el resultado del trabajo.
try {
    plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "cd $APP_DIR && git log --oneline -5"
} catch {
    Write-Host "  (no se pudo leer la lista; es decorativa y no afecta al deploy)" -ForegroundColor DarkGray
}
Write-Host ""

# ⚠️ El codigo de salida lo decide la VERIFICACION, no lo que pasara el ultimo.
if ($local -and $remoto -and $local -eq $remoto) {
    exit 0
}

# ── Graphify: NO se ejecuta en el deploy (es un artefacto local manual).
#    Refrescar a mano cuando se necesite:  pwsh ./graphify-refresh.ps1
