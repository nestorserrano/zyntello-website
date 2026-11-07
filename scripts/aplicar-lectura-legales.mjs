/**
 * Pone el encabezado estándar y el panel de lectura en los seis documentos legales españoles.
 *
 *     node scripts/aplicar-lectura-legales.mjs
 *     node scripts/aplicar-lectura-legales.mjs --verificar   (no escribe; dice qué falta)
 *
 * ⚠️⚠️ Toca SOLO el encabezado, el <style> y el <script>. **El articulado no se roza.** Estos
 * seis archivos son contratos: si una pasada se comiera una cláusula, la página seguiría viéndose
 * perfecta y lo publicado sería un contrato distinto del que la empresa firma. Por eso cada
 * sustitución va anclada a marcas del encabezado y el script compara el articulado antes y
 * después: si cambia aunque sea un carácter, aborta sin escribir.
 *
 * Es idempotente, y además REEMPLAZA lo que puso en pasadas anteriores: con un «si no está,
 * ponlo», una corrección del tema claro no llegaría nunca a los documentos que ya lo tenían y el
 * script informaría «ya estaba al día» sobre un CSS viejo.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  encabezado, PANEL_LECTURA, ESTILO_LECTURA, SCRIPT_TEMA_TEMPRANO, SCRIPT_LECTURA, MENU_LEGAL,
} from './lib/legales-lectura.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const PUBLICO = join(AQUI, '..', 'public')
const VERIFICAR = process.argv.includes('--verificar')

const MARCA_ESTILO = '<style>\n/* ── Tema claro'
const MARCA_SCRIPT = '<script>\n(function(){\n  var raiz'

/**
 * El articulado: de <main a </main>.
 *
 * ⚠️ Acotado por los DOS extremos a propósito. Tomándolo «desde <main hasta el final» incluiría
 * el </body>, y como el script del panel se inserta justo ahí, la comprobación saltaba en los
 * seis documentos por un cambio que sí era intencionado. Una guarda que grita siempre deja de
 * mirarse, y entonces no protege del caso que importa.
 */
function articulado(html) {
  const i = html.indexOf('<main')
  const f = html.lastIndexOf('</main>')

  if (i === -1 || f === -1) {
    throw new Error('El documento no tiene <main>: sin el no se puede comprobar que el articulado quede intacto.')
  }

  return html.slice(i, f)
}

/** Pone, o repone, el bloque de estilos + tema temprano en el <head>. */
function conEstilos(html) {
  const bloque = ESTILO_LECTURA + '\n' + SCRIPT_TEMA_TEMPRANO
  const desde = html.indexOf(MARCA_ESTILO)

  if (desde === -1) {
    return html.replace('</head>', bloque + '\n</head>')
  }

  const hasta = html.indexOf('</script>', html.indexOf('zyntello-legales-zoom', desde))

  return html.slice(0, desde) + bloque + html.slice(hasta + '</script>'.length)
}

/** Pone, o repone, el script del panel antes de </body>. */
function conScript(html) {
  const desde = html.indexOf(MARCA_SCRIPT)

  if (desde === -1) {
    return html.replace('</body>', SCRIPT_LECTURA + '\n</body>')
  }

  const hasta = html.indexOf('</script>', desde)

  return html.slice(0, desde) + SCRIPT_LECTURA + html.slice(hasta + '</script>'.length)
}

let fallos = 0
let tocados = 0

for (const { ruta } of MENU_LEGAL) {
  const carpeta = ruta.replace(/\//g, '')
  const archivo = join(PUBLICO, carpeta, 'index.html')

  let html

  try {
    html = readFileSync(archivo, 'utf8')
  } catch {
    console.error('  x ' + carpeta + ': no existe ' + archivo)
    fallos++
    continue
  }

  const original = html
  const cuerpoAntes = articulado(html)

  // 1 - Marca con el isotipo transparente + menu con los seis documentos.
  const reEncabezado = /<a class="brand"[\s\S]*?<\/nav>/

  if (!reEncabezado.test(html)) {
    console.error('  x ' + carpeta + ': no encuentro el bloque marca+menu')
    fallos++
    continue
  }

  html = html.replace(reEncabezado, encabezado(ruta))

  // 2 - Panel de lectura, dentro del .wrap para que herede sus margenes laterales.
  if (!html.includes('class="lectura"')) {
    const reHero = /(\n\s*)<div class="hero">/

    if (!reHero.test(html)) {
      console.error('  x ' + carpeta + ': no encuentro el bloque hero')
      fallos++
      continue
    }

    html = html.replace(reHero, '\n' + PANEL_LECTURA + '$1<div class="hero">')
  }

  html = conEstilos(html)
  html = conScript(html)

  // La guarda que de verdad importa: el articulado tiene que salir identico.
  if (articulado(html) !== cuerpoAntes) {
    console.error('  x ' + carpeta + ': el ARTICULADO cambio. Abortado, no se escribe.')
    fallos++
    continue
  }

  if (html === original) {
    console.log('  = ' + carpeta + ': ya estaba al dia')
    continue
  }

  if (VERIFICAR) {
    console.log('  -> ' + carpeta + ': le falta el encabezado, el panel o los estilos')
    fallos++
    continue
  }

  writeFileSync(archivo, html, 'utf8')
  tocados++
  console.log('  ok ' + carpeta)
}

if (fallos) {
  console.error('\n' + fallos + ' documento(s) sin resolver.')
  process.exit(1)
}

console.log('\n' + tocados + ' actualizado(s) de ' + MENU_LEGAL.length + ' revisados.')
