# ============================================================================
# DEPLOY ZYNTELLO-WEBSITE A BLUEHOST VÍA SSH  (DESATENDIDO)
# ============================================================================
# zyntello.com — React + Vite. Mismo servidor/clave que zyntello-app.
#
# MECANISMO (replica el .cpanel.yml del repo website):
#   1. git pull en ~/repositories/zyntello-website (clon con token de GitHub)
#   2. cp -rf dist/. a public_html/zyntello/   (sirve el build estático)
#
# IMPORTANTE: el website se sirve desde dist/. Antes de desplegar hay que:
#   1. Compilar local:  npm run build   (genera dist/)
#   2. Commitear dist/  y  git push
#   Este script -Build lo hace por ti (build + commit dist + push) si se pasa el flag.
#
# USO:
#   .\deploy-website.ps1            # solo pull + copiar dist (asume dist ya pusheado)
#   .\deploy-website.ps1 -Build     # npm run build + commit dist + push + deploy
#   .\deploy-website.ps1 -Confirmar # pide S/N antes
# ============================================================================

param([switch]$Confirmar, [switch]$Build)

$ErrorActionPreference = "Continue"

# ── Configuración ───────────────────────────────────────────────────────────
$KEY      = "C:\wamp64\www\zyntello\zyntello.ppk"
$HOSTKEY  = "SHA256:/J5knqfWDwYYC6DQvknQRMxco7GHIkAyPJQY8w2SFog"
$SSHHOST  = "ukrmeumy@ukr.meu.mybluehost.me"
$PORT     = "2222"
$REPO_DIR = "/home4/ukrmeumy/repositories/zyntello-website"
$WEB_ROOT = "/home4/ukrmeumy/public_html/zyntello"
$LOCAL    = "C:\wamp64\www\zyntello"

if (-not (Test-Path $KEY)) { Write-Host "ERROR: no se encontro la clave $KEY" -ForegroundColor Red; exit 1 }
if (Select-String -Path $KEY -Pattern 'Encryption: aes' -Quiet) {
    Write-Host "ERROR: la clave $KEY tiene passphrase. Quitala con PuTTYgen." -ForegroundColor Red; exit 1
}

function Invoke-SSHCommand {
    param([string]$Command, [string]$Description)
    Write-Host "`n$Description" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor DarkGray
    $result = plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "$Command" 2>&1
    if ($LASTEXITCODE -eq 0) { Write-Host $result; Write-Host "Completado" -ForegroundColor Green; return $true }
    else { Write-Host $result -ForegroundColor Red; Write-Host "Error (codigo: $LASTEXITCODE)" -ForegroundColor Red; return $false }
}

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Magenta
Write-Host "       DEPLOY ZYNTELLO-WEBSITE -> PRODUCCION (BLUEHOST)             " -ForegroundColor Magenta
Write-Host "=====================================================================" -ForegroundColor Magenta

if ($Confirmar) {
    $resp = Read-Host "Desplegar website a produccion? (S/N)"
    if ($resp -ne "S" -and $resp -ne "s") { Write-Host "Cancelado." -ForegroundColor Red; exit 0 }
}

# PASO 0 (opcional): build local + commit dist + push
if ($Build) {
    Write-Host "`n[0] Compilando website (npm run build)..." -ForegroundColor Cyan
    & 'C:\Program Files\nodejs\node.exe' 'C:\Users\Sistemas\AppData\Roaming\npm\node_modules\npm\bin\npm-cli.js' --prefix $LOCAL run build
    if ($LASTEXITCODE -ne 0) { Write-Host "Error en build. Abortando." -ForegroundColor Red; exit 1 }
    Push-Location $LOCAL
    git add dist
    git commit -m "build: dist para deploy website" | Out-Null
    git push origin master
    Pop-Location
}

# PASO 1: pull en el clon del repo
$ok = Invoke-SSHCommand -Command "cd $REPO_DIR && git pull origin master" -Description "[1/2] Pull GitHub en repositories/zyntello-website..."
if (-not $ok) { Write-Host "`nError en pull. Abortando." -ForegroundColor Red; exit 1 }

# PASO 2: copiar el build al document root del sitio
$ok = Invoke-SSHCommand `
    -Command "/bin/mkdir -p $WEB_ROOT && /bin/cp -rf $REPO_DIR/dist/. $WEB_ROOT/" `
    -Description "[2/2] Copiar dist/. -> $WEB_ROOT ..."
if (-not $ok) { Write-Host "`nError al copiar dist. Abortando." -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "        WEBSITE ACTUALIZADO -> https://zyntello.com                 " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "cd $REPO_DIR && git log --oneline -3"
Write-Host ""

# ── Graphify: NO se ejecuta en el deploy (es un artefacto local manual).
#    Refrescar a mano cuando se necesite:  pwsh ./graphify-refresh.ps1
