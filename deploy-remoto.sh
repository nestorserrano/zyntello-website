#!/bin/bash
# ============================================================================
# DEPLOY ZYNTELLO-APP -- LADO DEL SERVIDOR
# ============================================================================
# Lo sube y lo lanza `deploy-bluehost.ps1`. Se ejecuta DESACOPLADO de la sesion
# SSH -- `(nohup bash zyn-deploy.sh &)` -- y deja su rastro en ~/zyn-deploy.log,
# que el script de Windows va leyendo.
#
# !! POR QUE EXISTE, medido el 2026-09-16: el SSH de Bluehost corta toda sesion
# que DURE unos segundos. `git rev-parse` pasa siempre y `php artisan` -- que
# tarda lo que tarda arrancar Laravel -- la tumba SIEMPRE, con
# "Remote side unexpectedly closed network connection".
#
# ! Ese "siempre" hay que cogerlo con pinzas: la medida se tomo con el SSH ya
# degradado por un bloqueo que la propia sesion habia provocado. Mas tarde el
# mismo patron fallo cinco veces seguidas y despues funciono a la primera. Puede
# ser la duracion, el bloqueo, o las dos. Lo que NO depende de cual sea es el
# diseno de aqui: lanzar desacoplado y verificar por el efecto aguanta las dos.
#
# Ese dia el deploy no pudo ni empezar: moria en el `artisan down` del paso 0.
# Y no era Laravel -- lanzado desacoplado, el mismo comando respondia
# "Laravel Framework 12.58.0" sin una queja. Lo que no aguanta es la CONEXION,
# asi que lo que dura se lanza desacoplado y se verifica por su log.
#
# Uso:  bash zyn-deploy.sh deploy   (mantenimiento -> merge -> migrate -> up)
#       bash zyn-deploy.sh cache    (cache optimizada, con la app YA arriba)
# ============================================================================
APP=/home4/ukrmeumy/public_html/zyntello/app
PHP=/usr/local/bin/php
MODO=${1:-deploy}

if [ "$MODO" = "cache" ]; then
    LOG=$HOME/zyn-cache.log
    : > $LOG
    cd $APP || { echo "[ERROR] no existe $APP" >> $LOG; echo "[FIN]" >> $LOG; exit 1; }
    # ! La cache es una OPTIMIZACION: sin ella Laravel compila cada vista la primera
    # vez que se pide. Por eso va aqui, con la app ya arriba, y ningun fallo suyo
    # tumba el despliegue.
    for paso in config:cache route:cache view:cache; do
        echo "[cache] $paso" >> $LOG
        $PHP artisan $paso >> $LOG 2>&1 && echo "[cache] $paso OK" >> $LOG \
                                        || echo "[cache] $paso fallo (la app funciona sin el)" >> $LOG
    done
    echo "[FIN]" >> $LOG
    exit 0
fi

LOG=$HOME/zyn-deploy.log

# !! CANDADO: se comprueba ANTES de instalar el trap y ANTES de tocar nada.
#
# Medido el 2026-09-16, y explica un rato entero perdido: DOS sesiones desplegaron
# a la vez. La otra tenia la app en mantenimiento mientras esta creia que el 503
# era suyo; su merge entro 25 minutos despues del intento de aqui, y sus
# migraciones se quedaron sin aplicar. Ninguna de las dos tenia forma de saber de
# la otra.
#
# !! El `exit` de aqui NO pasa por el trap, a proposito: levantar la app seria
# quitarle el mantenimiento a la sesion que SI esta desplegando, justo mientras
# copia archivos -- el 500 al usuario que el mantenimiento existe para evitar.
LOCK=$HOME/zyn-deploy.lock
if [ -f "$LOCK" ]; then
    EDAD=$(( $(date +%s) - $(stat -c %Y "$LOCK" 2>/dev/null || echo 0) ))
    # Media hora: un deploy tarda minutos. Pasada esa edad el candado es basura de
    # un deploy que murio, y retenerlo mas seria bloquear los despliegues para
    # siempre por un archivo que nadie borro.
    if [ "$EDAD" -lt 1800 ]; then
        : > $LOG
        echo "[ERROR] otro deploy en curso (candado de ${EDAD}s). No se toca nada." >> $LOG
        echo "[FIN]" >> $LOG
        exit 1
    fi
    # !! Se guarda para escribirlo DESPUES: el `: > $LOG` de abajo trunca el archivo
    # y un aviso escrito aqui se perderia -- justo el que explica por que se ignoro
    # un candado.
    AVISO_CANDADO="candado viejo (${EDAD}s): se descarta"
fi
echo "$$ $(date)" > "$LOCK"

: > $LOG
[ -n "$AVISO_CANDADO" ] && echo "$AVISO_CANDADO" >> $LOG

# !! El `up` va en un trap EXIT, no al final: un deploy que revienta a mitad con
# la app en `down` la deja CAIDA PARA TODOS, que es mucho peor que el 500 puntual
# que el mantenimiento venia a evitar.
levantar() {
    # !! ANTES de levantar: si el merge entro y las migraciones NO, la app arranca
    # con CODIGO NUEVO y ESQUEMA VIEJO -- y eso no da ningun error visible. Arranca
    # bien y solo revienta la pantalla que usa la columna que falta, el dia que
    # alguien la abra. Es el peor de los dos estados, porque no se parece a un
    # fallo.
    #
    # Paso el 2026-09-16: un deploy se corto entre el merge y el migrate, la app
    # quedo levantada y tres migraciones pendientes pasaron horas sin que nada lo
    # dijera. Se descubrio preguntando, no porque el deploy avisara.
    #
    # Por eso se MIDE y se grita en el log. No se aborta el levantado: la app
    # caida es peor, y con el esquema viejo la mayoria de pantallas funciona.
    # !! Se distingue "cero pendientes" de "no se pudo medir", y no es sutileza: si
    # `migrate:status` falla, `grep -c` devuelve 0 igual que si todo estuviera al
    # dia -- y la guarda cantaria OK sin haber comprobado nada. Es el patron de la
    # guarda cuyo sujeto se agota, que pasa en verde sin mirar.
    cd $APP || echo "[!!] no se pudo entrar en $APP para medir migraciones" >> $LOG
    ESTADO_MIG=$($PHP artisan migrate:status 2>&1)
    if [ -z "$ESTADO_MIG" ] || ! echo "$ESTADO_MIG" | grep -q "Migration name\|Ran\|Pending"; then
        echo "[!!] NO SE PUDO MEDIR si quedan migraciones pendientes." >> $LOG
        echo "[!!] Comprobar a mano: /zyn-maint/migrate-status?key=<MAINTENANCE_KEY>" >> $LOG
        PENDIENTES=-1
    else
        PENDIENTES=$(echo "$ESTADO_MIG" | grep -c "Pending")
    fi
    # !! El -1 es "no se sabe", y NO puede caer en la rama del "[ok]": un `ok`
    # escrito justo debajo de "no se pudo medir" se lee como que todo esta bien, y
    # ese es el mensaje que hace que nadie vaya a comprobarlo. Medido al probar
    # esta misma guarda, que escribia las dos cosas a la vez.
    if [ "$PENDIENTES" -lt 0 ]; then
        :
    elif [ "$PENDIENTES" -gt 0 ]; then
        echo "[!!] QUEDAN $PENDIENTES MIGRACIONES PENDIENTES" >> $LOG
        echo "[!!] Produccion tiene el CODIGO NUEVO con el ESQUEMA VIEJO." >> $LOG
        echo "[!!] Las pantallas que usen lo nuevo van a fallar SIN AVISO previo." >> $LOG
        echo "[!!] Aplicarlas: /zyn-maint/migrate-y-limpiar?key=<MAINTENANCE_KEY>" >> $LOG
    else
        echo "[ok] sin migraciones pendientes" >> $LOG
    fi

    echo "[5] levantando la app" >> $LOG
    cd $APP && $PHP artisan up >> $LOG 2>&1
    # !! SON DOS ARCHIVOS y solo uno decide el 503:
    #   storage/framework/down            -> EL ESTADO. FileBasedMaintenanceMode::active() lo lee.
    #   storage/framework/maintenance.php -> solo el ATAJO precompilado de public/index.php.
    # Borrar el segundo deja el estado puesto: Laravel arranca, ve `down` y sigue en
    # 503. Costo un rato el 2026-09-16, con el sitio caido.
    rm -f $APP/storage/framework/down $APP/storage/framework/maintenance.php
    if [ -f $APP/storage/framework/down ]; then
        echo "[5] ATENCION: sigue en mantenimiento" >> $LOG
    else
        echo "[5] mantenimiento retirado" >> $LOG
    fi
    rm -f $LOCK
    echo "[FIN]" >> $LOG
}
trap levantar EXIT

cd $APP || { echo "[ERROR] no existe $APP" >> $LOG; exit 1; }

echo "[0] commit antes: $(git rev-parse --short HEAD)" >> $LOG

echo "[1] poniendo en mantenimiento" >> $LOG
$PHP artisan down --retry=15 >> $LOG 2>&1
if [ -f storage/framework/down ]; then
    echo "[1] en mantenimiento" >> $LOG
else
    # Sin la proteccion se aborta ANTES de tocar nada: desplegar sin ella es lo que
    # provoca los 500 durante la copia (el deploy NO es atomico).
    echo "[ERROR] no se pudo poner en mantenimiento; no se toca nada" >> $LOG
    exit 1
fi

# ! `fetch` + `merge --ff-only`, no `pull`: deja ver por separado que fallo, y un
# merge que no sea avance rapido se rechaza en vez de inventar un commit.
echo "[2] fetch + merge" >> $LOG
git fetch origin master >> $LOG 2>&1 || { echo "[ERROR] fetch fallo" >> $LOG; exit 1; }
git merge --ff-only origin/master >> $LOG 2>&1 || { echo "[ERROR] merge fallo" >> $LOG; exit 1; }
echo "[2] commit despues: $(git rev-parse --short HEAD)" >> $LOG

echo "[3] optimize:clear" >> $LOG
$PHP artisan optimize:clear >> $LOG 2>&1

echo "[4] migrate --force" >> $LOG
$PHP artisan migrate --force >> $LOG 2>&1

# ! En Bluehost el merge deja storage/framework/views con permisos restrictivos y
# el view:cache posterior NO puede sobrescribir las vistas viejas: el runtime sigue
# sirviendo una vista obsoleta. Por eso se borran y se reponen los permisos SIEMPRE.
echo "[4] vistas compiladas y permisos" >> $LOG
mkdir -p $APP/storage/framework/views $APP/storage/framework/cache $APP/storage/framework/sessions
rm -rf $APP/storage/framework/views/*
chmod 755 $APP
chmod -R 755 $APP/public $APP/bootstrap
chmod -R 777 $APP/storage $APP/bootstrap/cache
echo "[4] hecho" >> $LOG

echo "[DEPLOY-OK]" >> $LOG
