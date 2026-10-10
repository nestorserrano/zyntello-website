/**
 * La clave de traducción de una frase del chat, derivada de su texto en español.
 *
 * ## Por qué se deriva en vez de escribirla a mano
 *
 * El chat son 36 nodos y ~145 frases, y el texto de cada opción **es la clave
 * del mapa `siguiente`**: cambiarlo rompe la navegación. Así que el español se
 * queda donde está, mandando, y esto solo calcula dónde buscar su traducción.
 * Un mapa paralelo de 145 entradas escrito a mano divergiría al primer retoque.
 *
 * ⚠️⚠️ Si alguien EDITA una frase en español, su clave cambia y la traducción
 * vieja queda huérfana — la frase volvería a verse en español en los ocho
 * idiomas, sin ningún error. Eso no se queda sin detectar: la guarda
 * `scripts/verificar-traducciones.mjs` importa esta misma función, recalcula
 * las 145 claves y **para el build** si alguna no está en el catálogo. Por eso
 * vive aquí y no copiada en los dos sitios: dos copias divergen, y la guarda
 * pasaría en verde comparándose consigo misma.
 *
 * Qué hace, en orden: quita los emojis y los signos, pasa los acentos a su
 * letra base, deja minúsculas y une con guiones. Se recorta a 60 caracteres
 * para que la clave siga siendo legible en el panel de traducción — quien
 * traduce tiene el texto completo en el campo de español, no en la clave.
 */
export function claveChat(texto) {
  const base = String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')          // acentos fuera: «ó» → «o»
    .replace(/[^\w\s-]/g, ' ')                // emojis y signos fuera
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
    .replace(/-$/, '')                        // el recorte pudo dejar un guión

  // ⚠️ Una frase que se quede en nada tras limpiar —solo emojis, por ejemplo—
  //    daría la clave `chat.`, que colisionaría con cualquier otra igual. Se
  //    marca para que la guarda la nombre en vez de dejarla pasar.
  return 'chat.' + (base || 'SIN-TEXTO')
}
