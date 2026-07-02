# =====================================================================
#  BACKUP OFFSITE ZYNTELLO — descarga el respaldo de BD desde Bluehost
# =====================================================================
#  - El servidor genera diariamente (02:30 AM) storage/app/backups/zyntello_*.sql.gz
#    (comando artisan zyntello:backup-db, rotación 14 en el servidor).
#  - Este script descarga el .gz MÁS RECIENTE a una carpeta local (offsite),
#    verifica la cabecera gzip y rota copias locales (retención 30).
#  - Programado en Windows Task Scheduler (tarea "Zyntello Backup Offsite",
#    diaria 6:30 AM). Log en $DESTINO\backup-offsite.log.
#
#  PRUEBA DE RESTAURACIÓN (hacer cada trimestre y anotar en el checklist):
#    1. Descomprimir:  tar -xzf zyntello_FECHA.sql.gz   (o 7-Zip)
#    2. Crear BD vacía local:  CREATE DATABASE zyntello_restore;
#    3. Importar:  mysql -u root -P 3308 zyntello_restore < zyntello_FECHA.sql
#    4. Verificar conteos: SELECT COUNT(*) FROM companies; FROM fact_facturas; etc.
# =====================================================================
param(
    [string]$Destino = "E:\ZyntelloBackups",
    [int]$Retencion  = 30
)

$KEY     = "C:\wamp64\www\zyntello\zyntello.ppk"
$HOSTKEY = "SHA256:/J5knqfWDwYYC6DQvknQRMxco7GHIkAyPJQY8w2SFog"
$SSHHOST = "ukrmeumy@ukr.meu.mybluehost.me"
$PORT    = "2222"
$REMOTO  = "public_html/zyntello/app/storage/app/backups"

if (-not (Test-Path $Destino)) { New-Item -ItemType Directory -Force $Destino | Out-Null }
$log = Join-Path $Destino "backup-offsite.log"
function Escribir($msg) {
    $linea = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg
    Add-Content -Path $log -Value $linea
    Write-Host $linea
}

try {
    # 1. Nombre del respaldo más reciente en el servidor
    $ultimo = (& plink -i $KEY -P $PORT -batch -hostkey $HOSTKEY $SSHHOST "ls -t $REMOTO/zyntello_*.sql.gz 2>/dev/null | head -1").Trim()
    if (-not $ultimo) { Escribir "ERROR: no hay respaldos en el servidor ($REMOTO)."; exit 1 }
    $nombre = Split-Path $ultimo -Leaf

    $localPath = Join-Path $Destino $nombre
    if (Test-Path $localPath) { Escribir "Ya descargado: $nombre — nada que hacer."; exit 0 }

    # 2. Descargar
    & pscp -i $KEY -P $PORT -batch -hostkey $HOSTKEY "${SSHHOST}:$ultimo" $localPath | Out-Null
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $localPath)) { Escribir "ERROR: pscp falló descargando $nombre."; exit 1 }

    # 3. Verificación: tamaño mínimo + cabecera gzip (1f 8b)
    $bytes = (Get-Item $localPath).Length
    $fs = [System.IO.File]::OpenRead($localPath)
    $b1 = $fs.ReadByte(); $b2 = $fs.ReadByte(); $fs.Close()
    if ($bytes -lt 1024 -or $b1 -ne 0x1f -or $b2 -ne 0x8b) {
        Remove-Item $localPath -Force
        Escribir "ERROR: $nombre inválido (bytes=$bytes, magic=$b1,$b2) — eliminado."
        exit 1
    }
    Escribir ("OK: {0} descargado ({1:N2} MB)." -f $nombre, ($bytes / 1MB))

    # 4. Rotación local
    $viejos = Get-ChildItem $Destino -Filter "zyntello_*.sql.gz" | Sort-Object LastWriteTime -Descending | Select-Object -Skip $Retencion
    foreach ($v in $viejos) { Remove-Item $v.FullName -Force; Escribir "Rotado local: $($v.Name)" }

    exit 0
}
catch {
    Escribir "ERROR: $($_.Exception.Message)"
    exit 1
}
