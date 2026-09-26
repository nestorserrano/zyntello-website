/**
 * Escribe un archivo SOLO si su contenido cambia.
 *
 * ⚠️⚠️ POR QUÉ NO VALE UN `writeFileSync` A SECAS
 *
 * `writeFileSync` toca la fecha de modificación SIEMPRE, aunque escriba byte
 * por byte lo mismo. Como el `lastmod` del sitemap sale de esa fecha, un
 * `npm run generar` de rutina subía la fecha de las 32 páginas del repo sin
 * que ninguna hubiera cambiado.
 *
 * Eso convierte el `lastmod` en ruido, y el ruido tiene un coste concreto:
 * Google compara la fecha declarada con lo que encuentra al rastrear y, cuando
 * no cuadra repetidamente, **deja de hacer caso al campo en TODO el sitemap** —
 * incluidas las páginas que sí cambiaron. Es justo lo que advierte el comentario
 * de `generar-sitemap.mjs` sobre no inventarse fechas.
 *
 * De paso deja de ensuciar el `git status` con 32 archivos «modificados» que
 * no tienen ni una línea de diferencia.
 *
 * ⚠️ La comparación NORMALIZA los saltos de línea. En Windows, `core.autocrlf`
 * puede dejar el archivo del disco con CRLF mientras el generador produce LF:
 * sin normalizar, las dos versiones nunca coincidirían y esto no serviría de
 * nada — reescribiría siempre, en silencio y pareciendo que funciona.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const normalizar = (s) => s.replace(/\r\n/g, '\n')

/** Devuelve true si escribió (hubo cambio), false si lo dejó como estaba. */
export function escribirSiCambia(ruta, contenido) {
  if (existsSync(ruta)) {
    try {
      if (normalizar(readFileSync(ruta, 'utf8')) === normalizar(contenido)) return false
    } catch {
      // Si no se puede leer (permisos, archivo a medias), se reescribe.
    }
  }
  writeFileSync(ruta, contenido, 'utf8')
  return true
}
