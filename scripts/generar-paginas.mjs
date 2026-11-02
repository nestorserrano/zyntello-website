/**
 * Genera las páginas de primer nivel: /automatizacion/, /precios/, /nosotros/
 * y /contacto/, en los idiomas a los que estén traducidas.
 *
 *     node scripts/generar-paginas.mjs
 *
 * Usa la MISMA plantilla que los servicios y las funcionalidades
 * (`scripts/lib/plantilla.mjs`), con `base: ''` porque estas no cuelgan de
 * ninguna familia: viven en la raíz del sitio.
 *
 * ⚠️⚠️ `/erp/` NO se genera. Ya existe: es la landing del bundle ERP que escribe
 * el admin en el document root del sitio. Generar aquí un `erp` la sobrescribiría
 * y el síntoma sería una landing menos respondiendo 200 con otra cosa.
 *
 * ⚠️⚠️ UNA PÁGINA SOLO SE ESCRIBE EN LOS IDIOMAS A LOS QUE ESTÉ TRADUCIDA, igual
 * que los servicios. Sin esa condición, una página aún sin traducir se publicaría
 * en las ocho URLs: siete copias en español declarando `lang="ar"` o
 * `lang="zh-Hans"`. Serían válidas, indexables y equivocadas, sin un solo error
 * por pantalla — y Google indexaría español bajo una etiqueta de chino, que es
 * peor que no tener esa página.
 *
 * ⚠️ El prefijo del catálogo es `pri` (páginas de primer nivel). `pag` ya está
 * ocupado por los textos de la PLANTILLA —rótulos, menú, botones— que comparten
 * servicios, funcionalidades y estas: son cosas distintas y mezclarlas haría que
 * un cambio en el rótulo «Y además» pareciera un cambio de contenido.
 */

import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { PAGINAS } from './paginas/datos.mjs'
import { pagina } from './lib/plantilla.mjs'
import { IDIOMAS, cargarCatalogo, estaTraducida, paginaTraducida, traductorDe } from './lib/idiomas.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DESTINO = join(AQUI, '..', 'public')

await cargarCatalogo()

/* ⚠️ La rejilla de «Y además» reparte en el mayor divisor del número de
   elementos. Con CUATRO páginas, cada una enlaza a las otras TRES y la rejilla
   queda pareja en una fila. Si se añade una quinta, cada una pasaría a enlazar
   a cuatro y la rejilla las repartiría 2+2 — sigue pareja. La que da problema
   es una sexta: cinco elementos no tienen divisor y caen a UNA columna. Nada
   se rompe, la página se ve «bien», y por eso conviene mirarlo al añadir. */
let n = 0
let tocadas = 0
const pendientes = []

for (const idioma of IDIOMAS) {
  const t = traductorDe(idioma.codigo)
  let delIdioma = 0

  for (const [i, original] of PAGINAS.entries()) {
    if (!estaTraducida(original, 'pri', idioma.codigo)) {
      if (idioma.codigo === 'en') pendientes.push(original.slug)   // se cuenta una vez
      continue
    }

    const p = paginaTraducida(original, 'pri', idioma.codigo)

    /* Las otras tres EN ESTE IDIOMA, saltando las que aún no estén traducidas:
       el enlace de «Y además» apunta a `/{idioma}/{slug}/`, y ofrecer ahí una
       página que no existe manda al visitante a un 404 desde una página que se
       ve perfecta. Pasó con los servicios, medido en producción. */
    const otras = PAGINAS
      .filter((_, j) => j !== i)
      .filter(o => estaTraducida(o, 'pri', idioma.codigo))
      .map(o => paginaTraducida(o, 'pri', idioma.codigo))

    const carpeta = join(DESTINO, ...idioma.prefijo.split('/').filter(Boolean), original.slug)
    mkdirSync(carpeta, { recursive: true })

    const cambio = escribirSiCambia(join(carpeta, 'index.html'), pagina(p, otras, {
      base: '',
      idioma: idioma.codigo,
      /* ⚠️⚠️ Los idiomas en los que ESTA página existe, no los ocho. Hasta el
         2026-10-12 las cuatro existían solo en español y declaraban igualmente
         los ocho `hreflang`: `/en/precios/`, `/ar/contacto/`… siete URLs que
         respondían 404, medidas en producción. No se ve en pantalla —la
         etiqueta vive en el `<head>`—, pero Google las visita, se las encuentra
         vacías y deja de fiarse del bloque de idiomas también en las páginas
         que sí tienen sus ocho versiones. */
      idiomas: IDIOMAS.filter(l => estaTraducida(original, 'pri', l.codigo)),
      t,
      anclaVolver: `https://zyntello.com/${idioma.prefijo}`,
      volver: t('pag.pri.volver', 'Inicio'),
      distintivo: 'Zyntello',
      tituloOtras: t('pag.pri.otras', 'También te puede interesar'),
      segundoBoton: { texto: t('pag.boton.whatsapp', 'Hablar con Zyntello'), href: 'https://wa.me/18296399877' },
    }))
    n++
    delIdioma++
    if (cambio) tocadas++
  }

  if (delIdioma) {
    console.log(`  ${idioma.codigo.padEnd(8)} ${delIdioma} páginas en public/${idioma.prefijo}`)
  }
}

console.log(`\n${n} páginas de primer nivel en public/ · ${tocadas} reescritas`)
if (pendientes.length) {
  console.log(`\n⚠ ${pendientes.length} páginas solo en español, a la espera de traducción:`)
  console.log('  ' + pendientes.join(', '))
}
