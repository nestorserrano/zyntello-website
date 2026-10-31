# El sitio habla ocho idiomas, pero no entero — diagnóstico

> **2026-10-10.** Medido a petición del director técnico, que vio texto en español con la
> página en chino. Lo escribe la sesión que lleva los idiomas de la **app** (`zyntello-app`);
> el sitio es otro repo y **no se tocó nada**.
>
> ⚠️ Esto está escrito en un documento, y no pasado por mensaje, porque la sesión que llevaba
> el sitio **ya había terminado cuando se encontró**. Lo que vive en una conversación muere
> con ella.

---

## Son DOS defectos distintos, y ninguno lo ve la guarda actual

La guarda del sitio cuenta **claves que el sitio pide y no están en el catálogo**. Da verde, y
el verde es cierto: **536 cadenas, 0 vacías** sobre lo que el catálogo cubre. El problema es
que el catálogo no sabe que existe lo de abajo — y un recuento sobre un universo incompleto da
100 % y no miente.

---

## 1. Texto literal en JSX que nunca pasa por `t()`

**Visto:** el botón **«Conversemos»** sale en español con la página en chino.

`src/components/PorQueZyntello.jsx`, línea 64:

```jsx
<p className="zy-subtitulo">{t('porque.subtitulo', '…')}</p>   ← traduce
<a href="#contacto" className="zy-btn zy-btn-coral zy-porque-cta">
  Conversemos                                                   ← escrito a pelo
  <Icono nombre="flecha" size={18} className="zy-flecha" />
</a>
```

El eyebrow, el título y el subtítulo del mismo componente **sí** pasan por `t()`. Solo el botón
se quedó fuera.

⚠️ **Es el hermano de los dos defectos que esa misma sesión ya había encontrado**: las 68
frases que vivían en `opciones: ['A','B']` —una sola línea, que su extractor leía línea a
línea— y la que vivía en `App.jsx`, fuera de `src/components/`. Tres veces el mismo patrón: el
instrumento reflejaba fielmente un modelo incompleto de dónde puede estar el texto.

**La dirección que le falta a la guarda:** texto literal en JSX que no pasa por `t()`. Un
barrido por `>([^<>{}]*[a-záéíóúñ]{4,}[^<>{}]*)<` sobre `src/` dice cuántos más hay. **No se
corrió entero**: no es el repo de quien escribe esto.

---

## 2. ⚠️⚠️ Las 14 landings de servicio no están traducidas, y no PUEDEN estarlo

Esto no es una corrección: es una decisión de arquitectura.

```
public/servicios/                        14 landings
  personal-ti-especializado/index.html
  consultoria-contable/index.html
  erp-y-crm/index.html
  …
```

Son **HTML estáticos sueltos**, fuera del React que traduce. Medido en una de ellas:

| | |
|---|---|
| `lang=` de la página | **`"es"` fijo** |
| Selector de idioma | **ninguno** |
| Frases de texto visible | **101** |

Por 14 landings, del orden de **1.400 frases**.

**El efecto para quien visita:** `zyntello.com` está en ocho idiomas, el visitante pincha en un
servicio y **aterriza en una página en español sin forma de cambiarla** — ni siquiera un
selector para volver. Y es la página que vende el servicio.

### La pregunta que hay que decidir antes de tocar nada

No es «cómo traduzco 14 HTML». Es **si esas landings deben seguir siendo estáticas**.

⚠️ Montarles un mecanismo propio de traducción crea **un segundo sistema para lo mismo**, y esa
trampa ya está escrita en este ecosistema: dos fuentes del mismo dato, y la que se queda atrás
falla sin avisar — es el motivo por el que los diccionarios de la app se fusionan en memoria en
vez de compilarse a un fichero único.

Migrarlas al React que ya traduce cuesta más una vez y deja **un solo mecanismo**.

---

## Lo que NO está mal

La verificación que se hizo del sitio era correcta sobre su alcance. El catálogo cubre lo que
cubre, y dentro de eso no falta nada. Quien lo retome no tiene que desconfiar de ese trabajo —
tiene que **ampliar el universo que se mide**, que es otra cosa.

---

## ✅ CERRADO el 2026-10-31 — los dos defectos están resueltos

Medido de nuevo hoy, sobre el repo del sitio, antes de dar nada por hecho.

### 1. El texto literal en JSX — resuelto, y con otra decisión encima

`Conversemos` ya pasa por `t('porque.cta', 'Conversemos')`.

El barrido que pedía este documento se corrió entero (`censo_jsx.py`, que ciega las llamadas
`t()` antes de buscar, para no contar como «sin traducir» el texto que ya va por el
traductor). **33 entradas**, y ninguna es un defecto:

| Qué | Cuántas |
|---|---|
| Ramas `idioma === 'es' ? <JSX con resalte> : t('clave')` | 24 |
| Nombres propios: `Zyntello`, `SAAS`, `zyntello.com`, `info@zyntello.com` | 8 |
| Falso positivo del propio regex (`return (`) | 1 |

Las 24 primeras son una **decisión explicada en el código, no un olvido**: el español conserva
su `<span>` de resalte y su `<br />` donde toca, y los demás idiomas reciben la frase entera
por `t()`. El motivo está escrito en cada sitio — en chino o en árabe «Datos» y «Tecnología»
no caen al principio, así que trocear la frase pondría el resaltado sobre otra palabra y el
salto en mitad de cualquier parte. Perder un efecto tipográfico es menos grave que publicar un
titular mal cortado en la portada.

### 2. Las 14 landings — ya están en los ocho idiomas

```
public/servicios/{14}/index.html          ← español
public/{en,fr,it,ar,ht,zh-Hans,zh-Hant}/servicios/{14}/index.html   ← 98 ficheros
```

Las 14 llevan sus `hreflang` a los ocho idiomas, con `x-default` al español. La pregunta de
arquitectura que planteaba este documento —si debían seguir siendo estáticas— **se decidió por
el camino de publicarlas traducidas**, no migrándolas a React.

⚠️ Eso deja dos mecanismos de traducción conviviendo (el catálogo de React y los HTML
estáticos), que es justo lo que este documento avisaba. **No es un defecto hoy, es un coste de
mantenimiento mañana**: cada texto que cambie en una landing hay que cambiarlo en ocho
ficheros, y el que se quede atrás no da ningún error — queda publicado diciendo otra cosa en
ese idioma. Si alguna vez se tocan a fondo, ahí sigue el argumento de migrarlas.
