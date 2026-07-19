# ============================================================================
# DEPLOY ZYNTELLO-APP A BLUEHOST VÍA SSH  (DESATENDIDO)
# ============================================================================
# Despliega zyntello-app a producción sin pedir nada:
#   git pull en public_html → optimize:clear → migrate → limpiar vistas+permisos → rebuild cache
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

param([switch]$Confirmar)

$ErrorActionPreference = "Continue"

# ── Configuración ───────────────────────────────────────────────────────────
$KEY     = "C:\wamp64\www\zyntello\zyntello.ppk"
$HOSTKEY = "SHA256:/J5knqfWDwYYC6DQvknQRMxco7GHIkAyPJQY8w2SFog"   # ed25519 de ukr.meu.mybluehost.me
$SSHHOST = "ukrmeumy@ukr.meu.mybluehost.me"
$PORT    = "2222"
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

# ── Ejecutar comando SSH (batch + hostkey, sin prompts) ─────────────────────
function Invoke-SSHCommand {
    param([string]$Command, [string]$Description)

    Write-Host "`n$Description" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor DarkGray

    $result = plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "$Command" 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host $result
        Write-Host "Completado" -ForegroundColor Green
        return $true
    } else {
        Write-Host $result -ForegroundColor Red
        Write-Host "Error (codigo: $LASTEXITCODE)" -ForegroundColor Red
        return $false
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
# PASO 1: PULL DESDE GITHUB EN EL DIRECTORIO ACTIVO
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $APP_DIR && git pull origin master" `
    -Description "[1/4] Pull desde GitHub en $APP_DIR..."

if (-not $success) {
    Write-Host "`nError en pull de GitHub. Abortando deployment." -ForegroundColor Red
    exit 1
}

# ============================================================================
# PASO 2: LIMPIAR CACHE Y EJECUTAR MIGRACIONES
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $APP_DIR && /usr/local/bin/php artisan optimize:clear && /usr/local/bin/php artisan migrate --force" `
    -Description "[2/4] Limpiar cache de Laravel y ejecutar migraciones..."

if (-not $success) {
    Write-Host "`nError en migraciones. Revisa logs del servidor." -ForegroundColor Red
    Write-Host "   Log: storage/logs/deploy-migrate.log" -ForegroundColor Yellow
    exit 1
}

# ============================================================================
# PASO 3: LIMPIAR VISTAS COMPILADAS + PERMISOS DE STORAGE
# ----------------------------------------------------------------------------
# En Bluehost el git pull deja storage/framework/views con permisos restrictivos,
# y el view:cache del paso siguiente NO puede sobrescribir las vistas compiladas
# viejas -> el runtime sigue sirviendo una vista obsoleta/corrupta (error Blade).
# Por eso, SIEMPRE: borrar vistas compiladas + recrear carpetas + chmod 777.
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $APP_DIR && rm -rf storage/framework/views/* && mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions && chmod -R 777 storage bootstrap/cache" `
    -Description "[3/4] Limpiar vistas compiladas + arreglar permisos de storage..."

if (-not $success) {
    Write-Host "`nAdvertencia: no se pudieron ajustar permisos/limpiar vistas. Puede haber vistas obsoletas." -ForegroundColor Yellow
}

# ============================================================================
# PASO 4: RECONSTRUIR CACHE OPTIMIZADO
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $APP_DIR && /usr/local/bin/php artisan config:cache && /usr/local/bin/php artisan route:cache && /usr/local/bin/php artisan view:cache" `
    -Description "[4/4] Reconstruir cache optimizado (config/routes/views)..."

if (-not $success) {
    Write-Host "`nError al reconstruir cache. La app deberia funcionar, pero sin optimizacion." -ForegroundColor Yellow
}

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

Write-Host "Ultimos commits en produccion:" -ForegroundColor White
Write-Host ("=" * 70) -ForegroundColor DarkGray
plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "cd $APP_DIR && git log --oneline -5"
Write-Host ""

# ── Graphify: NO se ejecuta en el deploy (es un artefacto local manual).
#    Refrescar a mano cuando se necesite:  pwsh ./graphify-refresh.ps1
