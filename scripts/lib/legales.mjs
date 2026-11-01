/**
 * Las páginas legales del sitio. Fuente única.
 *
 * ⚠️ Vive aparte del generador a propósito: el verificador también la necesita, y al importarla
 * de `generar-legales.mjs` se ejecutaba el generador entero como efecto secundario —verificar
 * escribía archivos, que es justo lo que un verificador no puede hacer—.
 *
 * ⚠️⚠️ Y copiarla en los dos sitios era la otra salida, peor: la copia que se quedara atrás
 * dejaría una página legal fuera de la comprobación **sin que nada lo dijera**, que es como esa
 * página acabaría publicada a medias en cinco idiomas.
 *
 * El orden es el del pie de página, para que una lista no contradiga a la otra.
 */
export const LEGALES = [
  'terminos',
  'privacidad',
  'cookies',
  'eliminacion-datos',
  'sla',
  'avisos-terceros',
]
