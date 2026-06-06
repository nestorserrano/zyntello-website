# ============================================================================
# DEPLOY ZYNTELLO-APP A BLUEHOST VÍA SSH
# ============================================================================
# Script automatizado para deployment completo de zyntello-app a producción
# Ejecuta: pull GitHub → copiar archivos → limpiar caché → migrar → rebuild
#
# REQUISITOS:
# - Plink (PuTTY) instalado y en PATH
# - Key SSH: C:\wamp64\www\zyntello\zyntello.ppk
# - Passphrase: C3dul@13238162 (se pedirá varias veces)
#
# USO:
#   .\deploy-bluehost.ps1
# ============================================================================

$ErrorActionPreference = "Continue"

# Configuración
$KEY = "C:\wamp64\www\zyntello\zyntello.ppk"
$HOST = "ukrmeumy@ukr.meu.mybluehost.me"
$PORT = "2222"
$REPO_DIR = "repositories/zyntello-app"
$APP_DIR = "public_html/zyntello/app"

# Función para ejecutar comando SSH
function Invoke-SSHCommand {
    param(
        [string]$Command,
        [string]$Description
    )
    
    Write-Host "`n$Description" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor DarkGray
    
    $result = plink -i $KEY -P $PORT -batch ${HOST} "$Command" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host $result
        Write-Host "✓ Completado" -ForegroundColor Green
        return $true
    } else {
        Write-Host $result -ForegroundColor Red
        Write-Host "✗ Error (código: $LASTEXITCODE)" -ForegroundColor Red
        return $false
    }
}

# Banner
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║         DEPLOY ZYNTELLO-APP → PRODUCCIÓN (BLUEHOST)               ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# Verificar que estamos en el directorio correcto
$currentDir = Get-Location
if ($currentDir.Path -notlike "*zyntello*") {
    Write-Host "⚠️  ADVERTENCIA: No estás en el directorio zyntello" -ForegroundColor Yellow
    Write-Host "   Directorio actual: $currentDir" -ForegroundColor Yellow
}

# Confirmación
Write-Host "Este script ejecutará deployment COMPLETO a producción:" -ForegroundColor Yellow
Write-Host "  • Pull desde GitHub (origin/master)" -ForegroundColor White
Write-Host "  • Copiar todos los archivos al servidor" -ForegroundColor White
Write-Host "  • Ejecutar migraciones de base de datos" -ForegroundColor White
Write-Host "  • Reconstruir caché de Laravel" -ForegroundColor White
Write-Host ""
$confirm = Read-Host "¿Continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Deployment cancelado." -ForegroundColor Red
    exit 0
}

# ============================================================================
# PASO 1: PULL DESDE GITHUB
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $REPO_DIR && git pull origin master" `
    -Description "[1/4] Pull desde GitHub al repositorio..."

if (-not $success) {
    Write-Host "`n❌ Error en pull de GitHub. Abortando deployment." -ForegroundColor Red
    exit 1
}

# ============================================================================
# PASO 2: COPIAR ARCHIVOS AL DIRECTORIO PÚBLICO
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $REPO_DIR && /bin/cp -r . /home/ukrmeumy/$APP_DIR/ && echo 'Archivos copiados correctamente'" `
    -Description "[2/4] Copiar archivos del repositorio a public_html..."

if (-not $success) {
    Write-Host "`n❌ Error al copiar archivos. Abortando deployment." -ForegroundColor Red
    exit 1
}

# ============================================================================
# PASO 3: LIMPIAR CACHÉ Y EJECUTAR MIGRACIONES
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $APP_DIR && /usr/local/bin/php artisan optimize:clear && /usr/local/bin/php artisan migrate --force" `
    -Description "[3/4] Limpiar caché de Laravel y ejecutar migraciones..."

if (-not $success) {
    Write-Host "`n❌ Error en migraciones. Revisa logs del servidor." -ForegroundColor Red
    Write-Host "   Log: storage/logs/deploy-migrate.log" -ForegroundColor Yellow
    exit 1
}

# ============================================================================
# PASO 4: RECONSTRUIR CACHÉ OPTIMIZADO
# ============================================================================
$success = Invoke-SSHCommand `
    -Command "cd $APP_DIR && /usr/local/bin/php artisan config:cache && /usr/local/bin/php artisan route:cache && /usr/local/bin/php artisan view:cache" `
    -Description "[4/4] Reconstruir caché optimizado (config/routes/views)..."

if (-not $success) {
    Write-Host "`n⚠️  Error al reconstruir caché. La app debería funcionar, pero sin optimización." -ForegroundColor Yellow
}

# ============================================================================
# RESUMEN FINAL
# ============================================================================
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  ✓ DEPLOYMENT COMPLETADO                           ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Aplicación actualizada en: https://app.zyntello.com" -ForegroundColor Cyan
Write-Host ""

# Mostrar estado de migraciones
Write-Host "Estado de migraciones (últimas 5):" -ForegroundColor White
Write-Host ("=" * 70) -ForegroundColor DarkGray
plink -i $KEY -P $PORT -batch ${HOST} "cd $APP_DIR && /usr/local/bin/php artisan migrate:status | tail -6"
Write-Host ""
