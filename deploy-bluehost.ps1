# ============================================================================
# DEPLOY ZYNTELLO-APP A BLUEHOST VÍA SSH
# ============================================================================
# Script automatizado para deployment completo de zyntello-app a producción
# Ejecuta: git pull en public_html → limpiar caché → migrar → rebuild
#
# REQUISITOS:
# - Plink (PuTTY) instalado y en PATH
# - Key SSH: C:\wamp64\www\zyntello\zyntello.ppk
#
# USO:
#   .\deploy-bluehost.ps1
# ============================================================================

$ErrorActionPreference = "Continue"

# Configuración
$KEY = "C:\wamp64\www\zyntello\zyntello.ppk"
$SSHHOST = "ukrmeumy@ukr.meu.mybluehost.me"
$PORT = "2222"
$APP_DIR = "public_html/zyntello/app"

# Función para ejecutar comando SSH
function Invoke-SSHCommand {
    param(
        [string]$Command,
        [string]$Description
    )

    Write-Host "`n$Description" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor DarkGray

    $result = plink -i $KEY -P $PORT -batch ${SSHHOST} "$Command" 2>&1

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

# Banner
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Magenta
Write-Host "         DEPLOY ZYNTELLO-APP -> PRODUCCION (BLUEHOST)               " -ForegroundColor Magenta
Write-Host "=====================================================================" -ForegroundColor Magenta
Write-Host ""

# Confirmacion
Write-Host "Este script ejecutara deployment COMPLETO a produccion:" -ForegroundColor Yellow
Write-Host "  - git pull origin master en public_html/zyntello/app" -ForegroundColor White
Write-Host "  - Ejecutar migraciones de base de datos" -ForegroundColor White
Write-Host "  - Reconstruir cache de Laravel" -ForegroundColor White
Write-Host ""
$confirm = Read-Host "Continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Deployment cancelado." -ForegroundColor Red
    exit 0
}

# ============================================================================
# PASO 1: PULL DESDE GITHUB EN EL DIRECTORIO ACTIVO
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $APP_DIR && git pull origin master" `
    -Description "[1/3] Pull desde GitHub en public_html/zyntello/app..."

if (-not $success) {
    Write-Host "`nError en pull de GitHub. Abortando deployment." -ForegroundColor Red
    exit 1
}

# ============================================================================
# PASO 2: LIMPIAR CACHE Y EJECUTAR MIGRACIONES
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $APP_DIR && /usr/local/bin/php artisan optimize:clear && /usr/local/bin/php artisan migrate --force" `
    -Description "[2/3] Limpiar cache de Laravel y ejecutar migraciones..."

if (-not $success) {
    Write-Host "`nError en migraciones. Revisa logs del servidor." -ForegroundColor Red
    Write-Host "   Log: storage/logs/deploy-migrate.log" -ForegroundColor Yellow
    exit 1
}

# ============================================================================
# PASO 3: RECONSTRUIR CACHE OPTIMIZADO
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $APP_DIR && /usr/local/bin/php artisan config:cache && /usr/local/bin/php artisan route:cache && /usr/local/bin/php artisan view:cache" `
    -Description "[3/3] Reconstruir cache optimizado (config/routes/views)..."

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

# Mostrar ultimos commits desplegados
Write-Host "Ultimos commits en produccion:" -ForegroundColor White
Write-Host ("=" * 70) -ForegroundColor DarkGray
plink -i $KEY -P $PORT -batch ${SSHHOST} "cd $APP_DIR && git log --oneline -5"
Write-Host ""
