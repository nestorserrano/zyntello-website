# Patrones de orquestación — Zyntello

> Lo cita `doubt-driven-development` para la regla «las personas no invocan a otras personas».

## La regla que cita la skill

**Anti-patrón B: una persona (subagente) que invoca a otra persona.** Un subagente no despacha
subagentes. Quien orquesta es **la sesión principal**, siempre. Por eso
`doubt-driven-development` **no se añade al frontmatter `skills:` de ninguna persona**: si lo
hiciera, al llegar a su Paso 3 intentaría generar otra.

Si te encuentras aplicando una skill de revisión **desde dentro de un subagente**, lo correcto es
**decírselo al usuario** y dejar que lo lance la sesión principal. El repliegue a auto-interrogarse
no es revisión con contexto fresco: te llevas tu propio contexto contigo, así que si lo usas,
decláralo como degradado.

## ⚠️ En este proyecto: los subagentes no se despachan por iniciativa propia

La instrucción vigente es explícita: **no se usan subagentes, workflows ni investigación profunda a
menos que lo pida el usuario, un `CLAUDE.md` o una skill.** Una skill que sugiera «lanza tres
agentes en paralelo» **no basta por sí sola** si el usuario no lo ha pedido: se propone en una
línea y se espera.

Motivo medido: un subagente de este proyecto moría con un prompt de **229.000 tokens**, y el peso
no venía del `CLAUDE.md` —quitarle 589k apenas restó 629 tokens del prompt del subagente— sino de
las **definiciones de herramientas** de los servidores MCP conectados. Se anota para que nadie
repita el diagnóstico.

## Sesiones en paralelo, que aquí son la norma

- ⚠️⚠️ **`git add` explícito de cada ruta, nunca `-A`.** Otra sesión puede tener cambios a medias
  en el mismo árbol, y `-A` se los lleva dentro de tu commit.
- ⚠️ Antes de commitear, **mira qué más está sucio** y decide si es tuyo. Un archivo modificado que
  no reconoces probablemente no lo es.
- ⚠️⚠️ **También se pisan desplegando.** Dos sesiones desplegando a la vez: la segunda `up` puede
  levantar la app mientras la primera aún copia. Coordinarlo, o desplegar de una en una.

## Cuándo sí conviene repartir el trabajo

Cuando hay **dos o más tareas de verdad independientes**, sin estado compartido ni orden entre
ellas, y el usuario lo ha autorizado. Si comparten archivos, se hacen en serie: el conflicto cuesta
más que la espera.
