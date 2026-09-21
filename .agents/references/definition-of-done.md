# Definition of Done — el listón fijo de Zyntello

> Lo citan `using-agent-skills`, `incremental-implementation`, `planning-and-task-breakdown` y
> `shipping-and-launch` como «la barra que toda tarea cruza, sea cual sea la skill activa».
>
> ⚠️ Este archivo lo mantiene Zyntello, **no** `addyosmani/agent-skills`. Las skills de ese paquete
> son genéricas y no conocen las directivas de este proyecto. Cuando una de ellas proponga algo que
> choque con lo de abajo, **gana lo de abajo**.

## Precedencia — dónde encaja el paquete de skills

El orden es: **`CLAUDE.md` → este archivo → la skill activa.** Nunca al revés.

`using-agent-skills` declara seis «core operating behaviors» como no negociables. Cinco encajan bien
con este proyecto. Una choca: **«Enforce Simplicity — si escribes 1000 líneas y bastaban 100, has
fallado.»** Es buen criterio casi siempre y **peligroso exactamente donde este proyecto se juega el
negocio**, por el mismo motivo que ya está escrito para `ponytail` en `CLAUDE.md`: el segundo
filtro, el segundo UNIQUE y el segundo tenant de la prueba **parecen** trabajo de más, porque la
versión recortada **funciona**. No lanza excepción y la pantalla se ve bien.

⚠️⚠️ Recortar el aislamiento no produce un error que alguien vea: produce **una pantalla plausible
con los datos de otro**. «Lo más simple que funciona» no lo detecta, porque funciona.

Hay además **dos meta-skills** que dicen cómo elegir skill: `using-agent-skills` (este paquete) y
`superpowers:using-superpowers`. Si discrepan, decide `CLAUDE.md`; y si `CLAUDE.md` calla, ninguna
de las dos autoriza a saltarse esta lista.

## La lista cerrada — no es recortable

1. **`company_id` + `empresa_id`** en toda tabla, consulta, combo, reporte, seeder y endpoint, **y
   dentro del UNIQUE**. Las dos columnas, siempre.
2. La **reposición del filtro** tras cada `sinScopeEmpresa()`, desde un scope con nombre y fuente
   única, incluido su `orWhereNull('empresa_id')`.
3. `abort_unless($empresa && $company, 403)` al inicio de cada acción, y **resolución acotada** de
   todo id que llegue del request o de la URL.
4. `DelTenant::existe()` en vez de `Rule::exists` para cualquier tabla con `company_id`.
5. La prueba con **dos suscriptores y dos empresas**. Una de un solo tenant es más corta y **no
   mide nada**: no puede ver un cruce ni aunque lo haya.
6. **Entrega completa** de la pantalla: ayuda + `@section('ayudaClave')` + tooltips + diccionario
   + reporte, en el mismo trabajo que la crea.
7. **Español** en respuestas, código, comentarios, commits, mensajes de error y pruebas.

## Lo que sí hay que recortar

Capas con una sola implementación, interfaces sin segundo implementador, dependencias que Laravel
o PHP ya traen, helpers que reinventan `Collection` o `Str`, parámetros «por si acaso» y
boilerplate copiado de otra pantalla que aquí no hace nada.

## Antes de decir «terminado»

- [ ] Las pruebas pasan **ejecutadas**, y se pega la salida. Nunca «deberían pasar».
- [ ] El aislamiento se **midió**, no se supuso (`WHERE empresa_id IS NULL` devuelve 0 donde toca).
- [ ] La pantalla nueva **pinta su panel de ayuda** — escribir la ayuda y conectarla son dos actos,
      y al segundo le falta síntoma.
- [ ] Nada quedó en inglés de cara al usuario.
- [ ] Commit `[#NNNN] descripción en español`, con `git add` **explícito de cada ruta, nunca `-A`**:
      puede haber otra sesión con cambios a medias en el árbol.
- [ ] Si toca producción: desplegado y **verificado por el CONTENIDO** de la pantalla, no por el
      commit ni por un 200.
