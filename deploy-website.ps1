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
$ok = Invoke-SSHCommand -Command "cd $REPO_DIR && git pull origin master" -Description "[1/3] Pull GitHub en repositories/zyntello-website..."
if (-not $ok) { Write-Host "`nError en pull. Abortando." -ForegroundColor Red; exit 1 }

# PASO 2: copiar el build al document root del sitio
$ok = Invoke-SSHCommand `
    -Command "/bin/mkdir -p $WEB_ROOT && /bin/cp -rf $REPO_DIR/dist/. $WEB_ROOT/" `
    -Description "[2/3] Copiar dist/. -> $WEB_ROOT ..."
if (-not $ok) { Write-Host "`nError al copiar dist. Abortando." -ForegroundColor Red; exit 1 }

# PASO 3: podar los assets huerfanos
# ---------------------------------------------------------------------------
# `cp -rf` COPIA pero no BORRA, y Vite pone un hash nuevo en el nombre de cada
# build. Cada despliegue deja atras el JS y el CSS del anterior, y nadie los
# vuelve a mirar: el 2026-09-21 habia 27 huerfanos acumulados desde abril,
# 7,3 MB de archivos que no referencia ningun HTML.
#
# No da ningun error ni rompe el sitio - por eso crece sin que nadie lo note.
#
# La lista de conservacion se calcula LEYENDO los HTML publicados (y lo que
# esos propios archivos referencien, porque Vite puede partir el bundle), no
# de una lista escrita a mano que se quedaria vieja al primer cambio.
# Si la lista saliera vacia, se aborta sin borrar nada: una lista vacia
# significa que el grep fallo, no que no haga falta ningun asset.
# ---------------------------------------------------------------------------
$PODA = @'
cd WEB_ROOT_PLACEHOLDER || exit 1
[ -d assets ] || { echo "sin directorio assets, nada que podar"; exit 0; }

grep -rho "assets/[A-Za-z0-9_.-]*" --include="*.html" . | sed "s|assets/||" | sort -u > /tmp/zy_keep.txt
for f in $(cat /tmp/zy_keep.txt); do
  [ -f "assets/$f" ] && grep -oh "assets/[A-Za-z0-9_.-]*" "assets/$f" 2>/dev/null | sed "s|assets/||"
done | sort -u >> /tmp/zy_keep.txt
sort -u /tmp/zy_keep.txt -o /tmp/zy_keep.txt

if [ ! -s /tmp/zy_keep.txt ]; then echo "ABORTADO: lista de conservacion vacia, no se borra nada"; exit 1; fi

# Se conserva tambien la generacion ANTERIOR (los 4 archivos mas recientes:
# el JS y el CSS de este despliegue y los del anterior). Motivo: un visitante
# puede tener el index.html anterior todavia abierto y pedir su asset; si se
# borra en el acto ve una pantalla en blanco en vez de la version vieja. Con
# una generacion de margen, el peor caso vuelve a ser "ve lo de antes".
ls -1t assets/ 2>/dev/null | head -4 >> /tmp/zy_keep.txt
sort -u /tmp/zy_keep.txt -o /tmp/zy_keep.txt

ls -1 assets/ | sort > /tmp/zy_all.txt
comm -23 /tmp/zy_all.txt /tmp/zy_keep.txt > /tmp/zy_del.txt
N=$(wc -l < /tmp/zy_del.txt)
if [ "$N" -eq 0 ]; then echo "sin huerfanos"; else
  while read -r x; do [ -n "$x" ] && rm -f -- "assets/$x" && echo "podado: $x"; done < /tmp/zy_del.txt
fi
echo "conservados: $(wc -l < /tmp/zy_keep.txt) | peso: $(du -sh assets/ | cut -f1)"
rm -f /tmp/zy_keep.txt /tmp/zy_all.txt /tmp/zy_del.txt
'@
# El here-string se guarda con CRLF (es un archivo de Windows) y bash lo
# rechaza con un error de sintaxis por el retorno de carro. Hay que
# normalizar a LF antes de enviarlo por SSH.
$PODA = $PODA.Replace("WEB_ROOT_PLACEHOLDER", $WEB_ROOT).Replace("`r`n", "`n")
$ok = Invoke-SSHCommand -Command $PODA -Description "[3/3] Podar assets huerfanos..."
if (-not $ok) { Write-Host "`nAviso: la poda fallo. El sitio esta desplegado igualmente." -ForegroundColor Yellow }

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "        WEBSITE ACTUALIZADO -> https://zyntello.com                 " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "cd $REPO_DIR && git log --oneline -3"
Write-Host ""

# ── Graphify: NO se ejecuta en el deploy (es un artefacto local manual).
#    Refrescar a mano cuando se necesite:  pwsh ./graphify-refresh.ps1
