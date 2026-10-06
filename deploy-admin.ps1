# ============================================================================
# DEPLOY ZYNTELLO-ADMIN A BLUEHOST VÍA SSH  (DESATENDIDO)
# ============================================================================
# admin.zyntello.com — Laravel 12. Mismo servidor/clave que zyntello-app.
#
# MECANISMO (replica el .cpanel.yml del repo admin):
#   1. git pull en ~/repositories/zyntello-admin (clon con token de GitHub)
#   2. cp -r . a public_html/zyntello/admin/  (vendor va en el repo; .env se preserva)
#   3. rm -rf destino/.git y node_modules
#   4. artisan optimize:clear + config/route/view cache
#   5. permisos 755/777
#
# El admin NO usa `php artisan migrate` (las tablas se crean por SQL). Para
# sembrar/actualizar el catálogo de módulos usar el flag -SeedModulos.
#
# USO:
#   .\deploy-admin.ps1                 # deploy desatendido
#   .\deploy-admin.ps1 -SeedModulos    # deploy + db:seed ModulosSeeder
#   .\deploy-admin.ps1 -Confirmar      # pide S/N antes
# ============================================================================

param([switch]$Confirmar, [switch]$SeedModulos)

$ErrorActionPreference = "Continue"

# ── Configuración ───────────────────────────────────────────────────────────
$KEY      = "C:\wamp64\www\zyntello\zyntello.ppk"
$HOSTKEY  = "SHA256:/J5knqfWDwYYC6DQvknQRMxco7GHIkAyPJQY8w2SFog"
$SSHHOST  = "ukrmeumy@ukr.meu.mybluehost.me"
$PORT     = "2222"
$REPO_DIR = "/home4/ukrmeumy/repositories/zyntello-admin"
$DEST_DIR = "/home4/ukrmeumy/public_html/zyntello/admin"

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
Write-Host "        DEPLOY ZYNTELLO-ADMIN -> PRODUCCION (BLUEHOST)              " -ForegroundColor Magenta
Write-Host "=====================================================================" -ForegroundColor Magenta

if ($Confirmar) {
    $resp = Read-Host "Desplegar admin a produccion? (S/N)"
    if ($resp -ne "S" -and $resp -ne "s") { Write-Host "Cancelado." -ForegroundColor Red; exit 0 }
}

# PASO 1: pull en el clon del repo
$ok = Invoke-SSHCommand -Command "cd $REPO_DIR && git pull origin master" -Description "[1/4] Pull GitHub en repositories/zyntello-admin..."
if (-not $ok) { Write-Host "`nError en pull. Abortando." -ForegroundColor Red; exit 1 }

# PASO 2: copiar al directorio publico (replica .cpanel.yml), preservando .env y vendor
#
# ⚠⚠ El 2026-10-06 este paso FALLO entero y el deploy salio con codigo 1 — pero los archivos
#    SI se habian copiado. El `cp -r` incluia `.git`, y los objetos de git del destino son de
#    SOLO LECTURA por diseno (444): al existir ya, `cp` daba "Permission denied" archivo por
#    archivo. Como la cadena va con `&&`, el fallo cortaba ANTES del `rm` — y como aqui se hace
#    `exit 1`, **el PASO 3 no llegaba a correr: produccion se quedaba con el codigo nuevo y la
#    cache vieja**. Eso no se ve: la pantalla responde 200 sirviendo vistas compiladas de antes.
#
# El arreglo es no copiar `.git` en vez de copiarlo y borrarlo despues. Se usa `rsync` (esta en
# el servidor) SIN `--delete`, para no tocar nada que viva solo en el destino: `.env`, `storage`
# y el `.git` propio del directorio publico — que es el que lee la verificacion por commit.
#
# ⚠ Y por eso YA NO se borra `$DEST_DIR/.git`: ese borrado es el patron que una vez se llevo
#    produccion por delante al expandirse mal una variable.
$ok = Invoke-SSHCommand `
    -Command "/bin/mkdir -p $DEST_DIR && /usr/bin/rsync -a --exclude='.git' --exclude='node_modules' --exclude='.env' $REPO_DIR/ $DEST_DIR/" `
    -Description "[2/4] Copiar repo -> $DEST_DIR (preserva .env, storage y el .git del destino)..."
if (-not $ok) { Write-Host "`nError al copiar. Abortando." -ForegroundColor Red; exit 1 }

# PASO 3: cache Laravel + permisos
$ok = Invoke-SSHCommand `
    -Command "cd $DEST_DIR && /usr/local/bin/php artisan optimize:clear && /usr/local/bin/php artisan config:cache && /usr/local/bin/php artisan route:cache && /usr/local/bin/php artisan view:cache; chmod 755 $DEST_DIR; chmod -R 755 $DEST_DIR/public $DEST_DIR/bootstrap; chmod -R 777 $DEST_DIR/storage $DEST_DIR/bootstrap/cache" `
    -Description "[3/4] Reconstruir cache + permisos..."
if (-not $ok) { Write-Host "`nAdvertencia: error en cache/permisos." -ForegroundColor Yellow }

# PASO 4 (opcional): sembrar catálogo de módulos
if ($SeedModulos) {
    $ok = Invoke-SSHCommand `
        -Command "cd $DEST_DIR && /usr/local/bin/php artisan db:seed --class=ModulosSeeder --force" `
        -Description "[4/4] Sembrar catalogo de modulos (ModulosSeeder)..."
    if (-not $ok) { Write-Host "`nError en seed de modulos." -ForegroundColor Yellow }
} else {
    Write-Host "`n[4/4] Seed de modulos OMITIDO (usa -SeedModulos para ejecutarlo)." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "        ADMIN ACTUALIZADO -> https://admin.zyntello.com             " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "cd $REPO_DIR && git log --oneline -3"
Write-Host ""

# ── Graphify: NO se ejecuta en el deploy (es un artefacto local manual).
#    Refrescar a mano cuando se necesite:  pwsh ./graphify-refresh.ps1
