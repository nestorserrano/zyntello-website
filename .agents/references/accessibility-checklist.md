# Checklist de accesibilidad y de UI — Zyntello

> Lo citan `frontend-ui-engineering` y `shipping-and-launch`.

## Accesibilidad (WCAG 2.1 AA, lo que de verdad se comprueba)

- [ ] Todo `input` tiene su `<label>` asociado. El `placeholder` **no es** una etiqueta.
- [ ] Se puede recorrer y enviar el formulario **solo con el teclado**, y el foco se ve.
- [ ] Contraste de texto ≥ 4.5:1. Se comprueba en **los ocho temas**, no solo en el claro.
- [ ] El color no es el único portador de información: un estado «vencido» lleva texto o icono.
- [ ] Los iconos que son el único contenido de un botón llevan `aria-label` en español.
- [ ] Los mensajes de error se asocian al campo, no solo se pintan arriba en rojo.
- [ ] Imágenes con `alt`; las decorativas, `alt=""`.

## Trampas de UI medidas en este proyecto

- ⚠️⚠️ **Un `required` en un campo OCULTO cancela el envío y el `submit` ni se dispara.** No hay
  error, no hay log: el botón simplemente no hace nada. Si escondes un campo, quítale el
  `required`.
- ⚠️⚠️ **Un `await` sin `async` descarta el `<script>` COMPLETO** y ninguna prueba falla: la
  pantalla se pinta y la mitad de su comportamiento no existe.
- ⚠️⚠️ **Un `integrity` que no cuadra bloquea el recurso en silencio.** Solo lo dice la consola del
  navegador; el síntoma es una pantalla a medio pintar.
- ⚠️⚠️ **`@method('PUT')` contra una ruta POST da un 405 mudo**: el botón no guarda nada y la
  prueba contra el controlador pasa. Pasó en 17 módulos.
- ⚠️ **Doble atributo `class`** en un elemento: el navegador se queda con el primero. En los
  modales esto provoca que **nunca cierren con clic fuera**.
- ⚠️ Blade: comentarios anidados, un `<x-...>` dentro de un `<script>` o una directiva pegada a una
  letra rompen la compilación — y en el layout rompen **toda** la app. El error señala una línea
  del **compilado**, no de tu archivo. `@php(...)` con paréntesis anidados deja el `<?php` sin
  cerrar.

## Convenciones de esta app

- [ ] Vistas a **ancho completo**; filtros en **una sola línea**.
- [ ] Confirmaciones con **SweetAlert2**, nunca `confirm()`.
- [ ] Botón de envío con su estado de carga, o el usuario pulsa dos veces.
- [ ] **Nunca un UUID a la vista del usuario.**
- [ ] Todo texto de pantalla, en español.
- [ ] ⚠️ Y la pantalla no está terminada sin su **ayuda conectada** (`@section('ayudaClave')`),
      sus **tooltips** (`<x-help.campo>`) y su **diccionario**. Escribir la ayuda y conectarla son
      dos actos, y al segundo le falta síntoma: 115+ pantallas tenían el texto commiteado y el
      suscriptor nunca lo vio.
