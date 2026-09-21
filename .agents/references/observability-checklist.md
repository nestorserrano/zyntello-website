# Checklist de observabilidad — Zyntello

> Lo cita `observability-and-instrumentation` como «la versión de un vistazo, incluida la puerta
> de instrumentación previa al lanzamiento».

## Contexto mínimo de todo registro

- [ ] Todo log de una operación de negocio lleva **`company_id` y `empresa_id`**. Sin eso, ante un
      incidente no se puede saber **a qué suscriptor** le pasó, y con 50 clientes en la misma base
      el log no sirve para nada.
- [ ] Lleva también el `user_id` y el identificador del documento afectado.
- [ ] ⚠️ **Sin datos personales en el log**: ni cédulas, ni RNC completos, ni correos, ni importes
      de nómina individuales. El log lo lee soporte, no solo el que programó.

## Qué se instrumenta

- [ ] Todo proceso que **escribe dinero o inventario**: facturas, cobros, pagos, movimientos,
      nómina. Qué se escribió, con qué totales y quién lo pidió.
- [ ] Todo proceso **por lotes o programado**: cuántas filas entraron, cuántas salieron, cuántas
      se saltaron y **por qué**.
- [ ] ⚠️⚠️ **Un `catch (\Throwable)` que no registra nada es un fallo invisible.** Ya se tragó
      cuatro seeders rotos y un 1048 que reventaba en cada `demo:reset`: el módulo se veía **vacío
      como si estuviera pendiente**, cuando estaba **roto**. Si capturas, registra.
- [ ] Un proceso que «no hizo nada» lo dice. El silencio y el éxito no pueden parecerse.

## Lo que hay que poder responder sin pedir acceso al servidor

1. ¿Falló? ¿A qué suscriptor y a qué empresa?
2. ¿Cuándo empezó, y qué se desplegó justo antes?
3. ¿Se escribió algo a medias, o la transacción revirtió?

## Antes de lanzar

- [ ] ¿La pantalla nueva deja rastro de lo que escribe?
- [ ] ¿Los errores llegan a `storage/logs/laravel.log` con su traza, o se pierden?
- [ ] ¿Hay una forma de medir que la función **se usa**? Una pantalla que nadie abre es un aviso.

## ⚠️⚠️ El 500 que no se reproduce

Antes de buscar un defecto, **mira la hora contra la del último `git pull` del servidor**. El
deploy **no es atómico**: Apache puede servir una petición mientras los archivos se están
reemplazando, y el error dice que falta una variable **que sí existe**. Al ir a mirarlo la pantalla
va bien, y se pierde el rato buscando algo que no está. Con dos sesiones desplegando, la ventana se
multiplica.

Se evita envolviendo el deploy en `php artisan down --retry=15` … `php artisan up`, y el `up` va
**siempre**, incluso si un paso intermedio falla: un deploy que revienta a medias con la app en
`down` la deja caída para todos.
