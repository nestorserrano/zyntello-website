# Checklist de rendimiento — Zyntello

> Lo citan `performance-optimization`, `code-review-and-quality` y `shipping-and-launch`.

## ⚠️⚠️ Antes de cachear nada: la clave lleva el tenant

Es el riesgo de rendimiento propio de este proyecto, y **no se manifiesta como lentitud sino como
una fuga**: una entrada de caché cuya clave no incluye `company_id` **y** `empresa_id` le sirve a
un suscriptor lo que calculó otro, con un 200 y la pantalla perfecta.

```php
// MAL — la segunda empresa lee el total de la primera
Cache::remember("dashboard_ventas", 600, fn () => $this->calcular());

// BIEN — la dimensión va en la CLAVE, igual que en un updateOrCreate
Cache::remember("dashboard_ventas:{$company->id}:{$empresa->id}", 600, fn () => $this->calcular());
```

- [ ] Toda clave de caché, de sesión y de archivo temporal incluye **las dos** dimensiones.
- [ ] **No se cachea** aquello cuya obsolescencia es un error de corrección: saldos, permisos,
      existencias en el momento de facturar, tasas de cambio del día.
- [ ] Invalidación: si un dato se escribe en dos sitios, los dos invalidan.

## Medir primero

Optimizar sin medida es adivinar. Primero el número, después el cambio, después el número otra vez.

- [ ] ¿Cuál es el tiempo **actual** y con qué volumen de datos? Con 20 filas sembradas todo va
      rápido; el problema aparece con los del cliente.
- [ ] ⚠️ Una medición mal planteada **inventa un defecto** que no existe y se pierde el día
      arreglándolo.

## N+1, que es el 90% de lo que va lento aquí

- [ ] `with()` en toda consulta que luego recorra relaciones en la vista o en un reporte.
- [ ] Los combos y los reportes son los reincidentes: una tabla de 500 líneas que resuelve el
      cliente, el artículo y la moneda fila a fila son 1.500 consultas.
- [ ] ⚠️⚠️ Un `select` parcial devuelve un **objeto incompleto**, y eso no da un error útil: da un
      **cero**. Si recortas columnas, comprueba qué usa el resto del flujo.

## Base de datos

- [ ] Índice en toda columna por la que se filtra u ordena de verdad — empezando por
      `(company_id, empresa_id)`, que entra en **todas** las consultas.
- [ ] Nada de traer una tabla entera a PHP para contarla o sumarla: `count()`, `sum()` en SQL.
- [ ] Paginar. Una pantalla sin paginar funciona hasta que el cliente lleva dos años de datos.
- [ ] ⚠️⚠️ El MySQL de **producción es más viejo que el local**: `REGEXP_REPLACE` no existe allí.
      Lo que se prueba en local puede reventar en Bluehost.

## Frontend

- [ ] `dist/` construido y commiteado antes del push del sitio web.
- [ ] TomSelect **solo** en combos grandes: con 10 opciones o menos, `select` nativo y sin
      `data-buscar`.
- [ ] ⚠️ Bluehost añade su propio `Cache-Control` y reproduce redirecciones viejas sin que nadie
      toque el servidor. Se cierra con `no-store` donde importe.
