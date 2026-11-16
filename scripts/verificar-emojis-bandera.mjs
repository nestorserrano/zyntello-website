/**
 * Prohíbe los emojis de bandera en el código del sitio.
 *
 *     node scripts/verificar-emojis-bandera.mjs
 *
 * Sale con código 1 si encuentra alguno. Lo ejecuta `npm run build`, porque el build se corre
 * siempre antes de desplegar y una guarda que depende de que alguien se acuerde no se ejecuta
 * nunca.
 *
 * ## Por qué existe
 *
 * ⚠️⚠️ **En Windows el emoji de bandera NO existe.** No hay ninguna bandera en Segoe UI Emoji, así
 * que el navegador no pinta un cuadro vacío ni un interrogante: cae al glifo de cada indicador
 * regional por separado y muestra **el par de letras del país**. 🇫🇷 se lee «FR», 🇩🇴 se lee «DO».
 *
 * ⚠️⚠️ **Y por eso no se nota al escribirlo.** Quien revisa desde un Mac, un iPhone o Android ve
 * la bandera perfecta — el defecto solo existe en la máquina de quien mira, no en el código. El
 * 2026-11-16 el director técnico lo vio en la página francesa: el selector de idioma ponía la
 * bandera 🇫🇷 junto al código «FR», y en su Windows eso salía **«FR FR»**, la misma etiqueta dos
 * veces. En italiano «IT IT» y en criollo «HT HT», por la misma coincidencia.
 *
 * ⚠️⚠️ **Ya había pasado antes, y el aviso escrito no lo impidió.** `Soluciones.jsx` lleva desde
 * hace meses el comentario que explica exactamente esto, y por eso `MONEDAS_INFO` no usa
 * banderas. Pero un comentario solo protege al archivo donde está: el selector de idioma, el
 * aviso de idiomas y el chat de WhatsApp las seguían usando. Lo que se detecta leyendo el código
 * a mano se degrada; lo que se convierte en guarda, no.
 *
 * ## Qué hacer en vez de una bandera
 *
 * - Para un IDIOMA: su nombre en su propio idioma («Français», «简体中文»). Una bandera tampoco lo
 *   identificaría — el árabe no tiene ninguna entre sus 22 países, el francés se habla en 29.
 * - Para un PAÍS en una lista con iconos: un icono de lugar (📍, 🗺️), que sí se renderiza en todo
 *   sistema y mantiene el patrón visual de la lista.
 * - Para un país a secas: su nombre, o su código ISO si el espacio manda.
 */

import { readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { glob } from 'node:fs/promises'

const RAIZ = process.cwd()

/* Los indicadores regionales U+1F1E6..U+1F1FF. Una bandera son DOS seguidos; se buscan de uno en
   uno porque uno suelto también es un defecto: no pinta nada reconocible en ningún sistema. */
const INDICADOR = /[\u{1F1E6}-\u{1F1FF}]/gu

/* ⚠️ Se miran las fuentes, no `dist/`: en el bundle ya compilado el hallazgo no dice qué archivo
   corregir, que es justo lo que hace falta para arreglarlo. */
const PATRONES = ['src/**/*.{js,jsx,css}', 'scripts/**/*.mjs', 'public/**/*.html']

/* ⚠⚠ Este archivo se excluye A PROPÓSITO. Su documentación NOMBRA las banderas para explicar
   el defecto —«🇫🇷 se lee FR»— y sin esta excepción la guarda se acusaría a sí misma:
   castigaría documentar el problema, que es justo lo que hace falta para que no vuelva. Es la
   misma trampa que ya mordió a una guarda de la app, donde el comentario que explicaba el
   anti-patrón contenía el anti-patrón en texto. */
const EXCEPTO = 'verificar-emojis-bandera.mjs'

/* Convierte 🇫🇷 en «FR»: es LITERALMENTE lo que ve quien abre el sitio en Windows, y verlo escrito
   explica el fallo mejor que cualquier descripción. */
const comoSeVeEnWindows = (s) =>
  [...s].map((c) => String.fromCharCode(c.codePointAt(0) - 0x1f1e6 + 65)).join('')

const fallos = []
let revisados = 0

for (const patron of PATRONES) {
  for await (const ruta of glob(patron)) {
    if (ruta.endsWith(EXCEPTO)) continue
    const texto = readFileSync(join(RAIZ, ruta), 'utf8')
    revisados++

    /* Las banderas son pares; se agrupan para poder decir «FR» y no «F» y «R» por separado. */
    const pares = texto.match(/[\u{1F1E6}-\u{1F1FF}]{2}/gu) || []
    const sueltos = (texto.match(INDICADOR) || []).length - pares.length * 2

    for (const par of new Set(pares)) {
      const linea = texto.slice(0, texto.indexOf(par)).split('\n').length
      fallos.push(`${relative(RAIZ, ruta)}:${linea} — bandera que en Windows se lee «${comoSeVeEnWindows(par)}»`)
    }
    if (sueltos > 0) {
      fallos.push(`${relative(RAIZ, ruta)} — ${sueltos} indicador(es) regional(es) suelto(s), que no pintan nada en ningún sistema`)
    }
  }
}

for (const f of fallos) console.error(`  ✗ ${f}`)

if (fallos.length) {
  console.error(`\n${fallos.length} emoji(s) de bandera en el código.`)
  console.error('En Windows no se pintan: el sistema los sustituye por el par de letras del país,')
  console.error('así que la bandera se convierte en texto y aparece junto a lo que ya decía lo')
  console.error('mismo. Usa el nombre del idioma, un icono de lugar (📍) o el código ISO.')
  console.error('El porqué completo está en la cabecera de este archivo.')
  process.exit(1)
}

console.log(`  ✓ ${revisados} archivo(s) sin emojis de bandera`)
