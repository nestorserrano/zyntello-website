/**
 * Genera las páginas de los servicios, en los idiomas a los que estén traducidas.
 *
 *     node scripts/generar-servicios.mjs
 *
 * Escribe `public/{prefijo}servicios/{slug}/index.html` con la MISMA plantilla
 * que las funcionalidades (`scripts/lib/plantilla.mjs`), para que las dos
 * familias se parezcan entre sí sin mantener dos diseños.
 *
 * ⚠️⚠️ Son CATORCE, no diez. El pie del sitio listaba 10 y la sección «Qué
 * hacemos» tiene 14 — y los diez del pie apuntaban TODOS a la misma ancla
 * `#servicios`, así que daba igual cuál pulsaras. Se generan las 14 para que
 * ninguna quede huérfana.
 *
 * ⚠️ La sección «Y además» de cada página muestra SOLO TRES de las otras, no
 * las trece: una rejilla de 13 no reparte pareja y además nadie lee trece
 * enlaces. Se eligen las tres siguientes en orden, de forma circular, para que
 * cada servicio aparezca enlazado desde otros tres y ninguno quede aislado.
 *
 * ⚠️⚠️ UN IDIOMA SOLO SE ESCRIBE SI ESE SERVICIO ESTÁ TRADUCIDO A ÉL. Los
 * servicios se traducen de uno en uno, y sin esta condición los que aún no lo
 * están se publicarían igual en las ocho URLs: siete páginas en español
 * declarando `lang="ar"` o `lang="zh-Hans"`. Serían válidas, indexables y
 * equivocadas, sin un solo error por pantalla.
 */

import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { SERVICIOS } from './servicios/datos.mjs'
import { pagina } from './lib/plantilla.mjs'
import { IDIOMAS, cargarCatalogo, estaTraducida, paginaTraducida, traductorDe } from './lib/idiomas.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const PUBLICO = join(AQUI, '..', 'public')

await cargarCatalogo()

let n = 0
let tocadas = 0
const pendientes = []

for (const idioma of IDIOMAS) {
  const t = traductorDe(idioma.codigo)
  let delIdioma = 0

  for (const [i, original] of SERVICIOS.entries()) {
    if (!estaTraducida(original, 'serv', idioma.codigo)) {
      if (idioma.codigo === 'en') pendientes.push(original.slug)   // se cuenta una vez
      continue
    }

    const s = paginaTraducida(original, 'serv', idioma.codigo)

    /* Las tres siguientes en círculo: todos quedan enlazados desde otros tres.
       ⚠️ Van traducidas también — en español dentro de una página en chino se
       leen como enlaces rotos. Si alguna de las tres no está traducida, su
       texto cae al español, que es mejor que dejar el hueco. */
    const otras = [1, 2, 3]
      .map(d => SERVICIOS[(i + d) % SERVICIOS.length])
      .map(o => paginaTraducida(o, 'serv', idioma.codigo))

    const carpeta = join(PUBLICO, ...idioma.prefijo.split('/').filter(Boolean), 'servicios', original.slug)
    mkdirSync(carpeta, { recursive: true })

    const cambio = escribirSiCambia(join(carpeta, 'index.html'), pagina(s, otras, {
      base: 'servicios',
      idioma: idioma.codigo,
      t,
      volver: t('pag.serv.volver', 'Todos los servicios'),
      distintivo: t('pag.serv.distintivo', 'Servicio de Zyntello'),
      tituloOtras: t('pag.serv.otras', 'Otros servicios que solemos combinar con este'),
      segundoBoton: { texto: t('pag.serv.boton2', 'Ver todos los servicios'), href: 'https://zyntello.com/#servicios' },
    }))
    n++
    delIdioma++
    if (cambio) tocadas++
  }

  if (delIdioma) {
    console.log(`  ${idioma.codigo.padEnd(8)} ${delIdioma} páginas en public/${idioma.prefijo}servicios/`)
  }
}

console.log(`\n${n} páginas · ${tocadas} reescritas`)
if (pendientes.length) {
  console.log(`\n⚠ ${pendientes.length} servicios solo en español, a la espera de traducción:`)
  console.log('  ' + pendientes.join(', '))
}
