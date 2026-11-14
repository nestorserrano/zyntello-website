# ============================================================================
# CAMBIAR LOS REMOTES DEL SERVIDOR DE «TOKEN EN LA URL» A DEPLOY KEYS SSH
# ============================================================================
# Los tres clones de Bluehost llevaban el Personal Access Token de GitHub
# incrustado EN CLARO en la URL del remote (`.git/config`):
#
#     https://ghp_************@github.com/nestorserrano/{repo}.git
#
# Un `ghp_` clasico con acceso a repos privados lleva normalmente el scope
# `repo` ENTERO: lectura Y ESCRITURA en todos los repos de la cuenta, no solo
# en el clonado. El servidor solo necesita LEER — nunca pushea.
#
# Este script lo cambia por una deploy key SSH por repositorio: de solo
# lectura, acotada a UN repo, sin fecha de caducidad y fuera de la URL.
#
# ⚠️⚠️ VERIFICA ANTES DE TOCAR NADA, Y REVIERTE SI FALLA.
#   Cambiar el remote a ciegas deja el `git pull` del servidor roto, y ese pull
#   ES la via de deploy: el sitio y la app se quedarian sin poder actualizarse,
#   y el sintoma aparece en el PROXIMO despliegue, no ahora. Por eso cada repo
#   se prueba con un `git ls-remote` real por SSH y, si no responde, se le
#   devuelve su URL anterior.
#
# ⚠️ La URL anterior se guarda en memoria para poder restaurarla, y NO se
#   imprime nunca: lleva el token dentro y este repositorio es PUBLICO.
#
# ANTES DE CORRER ESTO hay que registrar las tres claves publicas como deploy
# keys de solo lectura en GitHub (Settings -> Deploy keys -> Add deploy key,
# con «Allow write access» DESMARCADO). Las publicas se leen con:
#
#   plink -i $KEY -P 2222 -batch $SSHHOST "cat ~/.ssh/deploy_zyntello_website.pub"
#
# DESPUES de que este script termine en verde, revocar el token viejo en
#   https://github.com/settings/tokens
#
# USO:
#   .\migrar-remotes-a-deploy-keys.ps1 -Comprobar   # solo diagnostica, no cambia
#   .\migrar-remotes-a-deploy-keys.ps1              # cambia los que funcionen
# ============================================================================

param([switch]$Comprobar)

$ErrorActionPreference = "Continue"

$KEY     = "C:\wamp64\www\zyntello\zyntello.ppk"
$HOSTKEY = "SHA256:/J5knqfWDwYYC6DQvknQRMxco7GHIkAyPJQY8w2SFog"
$SSHHOST = "ukrmeumy@ukr.meu.mybluehost.me"
$PORT    = "2222"
$REPOS   = @("website", "app", "admin")

if (-not (Test-Path $KEY)) { Write-Host "ERROR: no se encontro la clave $KEY" -ForegroundColor Red; exit 1 }

function Remoto([string]$cmd) {
    return (plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} $cmd 2>&1 | Out-String).Trim()
}

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Magenta
Write-Host "   REMOTES DEL SERVIDOR: token en la URL  ->  deploy key SSH        " -ForegroundColor Magenta
Write-Host "=====================================================================" -ForegroundColor Magenta

$ok = 0; $pendientes = @()

foreach ($r in $REPOS) {
    $nombre = "zyntello-$r"
    $dir    = "/home4/ukrmeumy/repositories/$nombre"
    Write-Host "`n--- $nombre" -ForegroundColor Cyan

    # 1. La clave existe en el servidor?
    $hayClave = Remoto "test -f ~/.ssh/deploy_zyntello_$r && echo si || echo no"
    if ($hayClave -ne "si") {
        Write-Host "  falta ~/.ssh/deploy_zyntello_$r — generala primero" -ForegroundColor Red
        $pendientes += $nombre; continue
    }

    # 2. La deploy key YA esta registrada en GitHub? Esto es lo que decide todo:
    #    `git ls-remote` por SSH contra el repo real. Si responde, la clave vale.
    $prueba = Remoto "cd $dir && GIT_SSH_COMMAND='ssh -i ~/.ssh/deploy_zyntello_$r -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=15' git ls-remote git@github.com:nestorserrano/$nombre.git HEAD 2>&1 | head -3"

    if ($prueba -notmatch "HEAD") {
        Write-Host "  la deploy key AUN no esta registrada en GitHub." -ForegroundColor Yellow
        Write-Host "  GitHub respondio: $($prueba -replace '\s+', ' ')" -ForegroundColor DarkGray
        Write-Host "  -> registrala en https://github.com/nestorserrano/$nombre/settings/keys" -ForegroundColor Yellow
        $pendientes += $nombre; continue
    }
    Write-Host "  deploy key VERIFICADA contra GitHub (ls-remote responde)" -ForegroundColor Green

    if ($Comprobar) { Write-Host "  (modo -Comprobar: no se cambia el remote)" -ForegroundColor DarkGray; $ok++; continue }

    # 3. Cambiar el remote, guardando el anterior POR SI HAY QUE VOLVER.
    #    No se imprime: lleva el token dentro y este repo es publico.
    $anterior = Remoto "cd $dir && git config --get remote.origin.url"
    Remoto "cd $dir && git remote set-url origin git@github.com:nestorserrano/$nombre.git" | Out-Null

    # 4. Probar el fetch DE VERDAD, que es lo que hace el deploy.
    $fetch = Remoto "cd $dir && git fetch origin 2>&1 | tail -3; echo EXIT=`$?"

    if ($fetch -match "EXIT=0") {
        Write-Host "  remote cambiado a SSH y `git fetch` funciona" -ForegroundColor Green
        $ok++
    } else {
        Remoto "cd $dir && git remote set-url origin '$anterior'" | Out-Null
        Write-Host "  el fetch FALLO -> remote REVERTIDO al anterior, nada roto" -ForegroundColor Red
        Write-Host "  salida: $($fetch -replace '\s+', ' ')" -ForegroundColor DarkGray
        $pendientes += $nombre
    }
}

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Magenta
Write-Host "  $ok de $($REPOS.Count) repositorios en SSH" -ForegroundColor $(if ($ok -eq $REPOS.Count) { "Green" } else { "Yellow" })

if ($pendientes.Count -gt 0) {
    Write-Host "  pendientes: $($pendientes -join ', ')" -ForegroundColor Yellow
    Write-Host "  siguen con el token en la URL — el deploy NO esta roto." -ForegroundColor DarkGray
} else {
    Write-Host ""
    Write-Host "  AHORA SI: revoca el token viejo en" -ForegroundColor Green
    Write-Host "  https://github.com/settings/tokens" -ForegroundColor Green
    Write-Host "  y comprueba que ningun remote lo lleve ya:" -ForegroundColor Green
}
Write-Host "=====================================================================" -ForegroundColor Magenta

# ============================================================================
# AUDITORIA FINAL — ANTES DE REVOCAR EL TOKEN, MIRARLO TODO
# ============================================================================
# ⚠️⚠️ Los pasos de arriba solo tocan ~/repositories/. Pero el deploy de la APP
#   corre `git pull` en public_html/zyntello/app/, que es OTRO clon con su
#   propio .git/config. Si ese sigue con el token en la URL, revocarlo rompe
#   el deploy de la app — y el fallo no aparece ahora, aparece en el PROXIMO
#   despliegue. Por eso se recorre la cuenta ENTERA, no una carpeta.
#
# Se miran ademas los ficheros donde git guarda credenciales por su cuenta:
# un credential.helper activo vuelve a escribir el token la proxima vez que
# alguien teclee una contrasena, y entonces todo esto habria sido en balde.
#
# Nada de esto imprime el token: solo dice si la URL lo lleva.
# ============================================================================
Write-Host "`nAuditoria de la cuenta ENTERA (enmascarada):" -ForegroundColor Cyan

$auditoria = @'
echo "-- clones y la URL de su remote --"
find /home4/ukrmeumy -maxdepth 5 -name config -path '*/.git/*' 2>/dev/null | while read f; do
  d=$(dirname $(dirname "$f"))
  u=$(git -C "$d" config --get remote.origin.url 2>/dev/null)
  [ -z "$u" ] && continue
  case "$u" in
    *ghp_*|*github_pat_*) echo "  TOKEN EN CLARO  -> $d" ;;
    git@*)                echo "  ssh deploy key  -> $d" ;;
    *)                    echo "  https sin token -> $d" ;;
  esac
done
echo "-- ficheros de credenciales --"
for f in ~/.git-credentials ~/.netrc ~/.gitconfig; do
  if [ -f "$f" ]; then
    grep -qE 'ghp_|github_pat_' "$f" 2>/dev/null && echo "  TOKEN EN $f" || echo "  limpio: $f"
  else
    echo "  no existe: $f"
  fi
done
echo "-- credential.helper (volveria a guardar el token) --"
git config --global --get credential.helper || echo "  ninguno, bien"
'@

$tmp = Join-Path $env:TEMP "auditar_tokens_$PID.sh"
# ASCII puro: plink por stdin no traga UTF-8 multibyte y cierra la conexion.
[IO.File]::WriteAllText($tmp, ($auditoria -replace "`r`n", "`n"), [Text.Encoding]::ASCII)
$salida = (Get-Content $tmp -Raw | plink -i $KEY -P $PORT -hostkey $HOSTKEY -batch ${SSHHOST} "sh -s" 2>&1 | Out-String)
Remove-Item $tmp -ErrorAction SilentlyContinue

if ($salida -match "clones y la URL") {
    Write-Host $salida.Trim()
    if ($salida -match "TOKEN EN") {
        Write-Host "`n  ⚠️ NO REVOQUES TODAVIA: queda al menos un sitio con el token." -ForegroundColor Red
    } else {
        Write-Host "`n  Ni un token en toda la cuenta. Ya se puede revocar." -ForegroundColor Green
    }
} else {
    Write-Host "  no se pudo auditar — el SSH no respondio:" -ForegroundColor Yellow
    Write-Host "  $($salida -replace '\s+', ' ')" -ForegroundColor DarkGray
    Write-Host "  ⚠️ Sin esta auditoria NO se revoca el token." -ForegroundColor Red
}
Write-Host ""
