/**
 * Genera las páginas de primer nivel: /automatizacion/, /precios/, /nosotros/.
 *
 *     node scripts/generar-paginas.mjs
 *
 * Usa la MISMA plantilla que los servicios y las funcionalidades
 * (`scripts/lib/plantilla.mjs`), con `base: ''` porque estas no cuelgan de
 * ninguna familia: viven en la raíz del sitio.
 *
 * ⚠️ `/contacto/` NO se genera aquí. No encaja en esta plantilla —no tiene
 * «problema», ni «beneficios», ni «pasos»— y forzarla produciría una página de
 * contacto con secciones de venta que nadie ha pedido. Se escribe aparte, en
 * `scripts/generar-contacto.mjs`.
 *
 * ⚠️⚠️ `/erp/` tampoco. Ya existe: es la landing del bundle ERP que escribe el
 * admin en el document root del sitio. Generar aquí un `erp` la sobrescribiría
 * y el síntoma sería una landing menos respondiendo 200 con otra cosa.
 */

import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { escribirSiCambia } from './lib/escribir.mjs'
import { PAGINAS } from './paginas/datos.mjs'
import { pagina } from './lib/plantilla.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DESTINO = join(AQUI, '..', 'public')

/* ⚠️ La rejilla de «Y además» reparte en el mayor divisor del número de
   elementos. Con CUATRO páginas, cada una enlaza a las otras TRES y la rejilla
   queda pareja en una fila. Si se añade una quinta, cada una pasaría a enlazar
   a cuatro y la rejilla las repartiría 2+2 — sigue pareja. La que da problema
   es una sexta: cinco elementos no tienen divisor y caen a UNA columna. Nada
   se rompe, la página se ve «bien», y por eso conviene mirarlo al añadir. */
let n = 0
let tocadas = 0
for (const [i, p] of PAGINAS.entries()) {
  const otras = PAGINAS.filter((_, j) => j !== i)

  const carpeta = join(DESTINO, p.slug)
  mkdirSync(carpeta, { recursive: true })
  const cambio = escribirSiCambia(join(carpeta, 'index.html'), pagina(p, otras, {
    base: '',
    anclaVolver: 'https://zyntello.com/',
    volver: 'Inicio',
    distintivo: 'Zyntello',
    tituloOtras: 'También te puede interesar',
    segundoBoton: { texto: 'Hablar con Zyntello', href: 'https://wa.me/18296399877' },
  }))
  n++
  if (cambio) tocadas++
  console.log(`  ${cambio ? '~' : ' '} /${p.slug.padEnd(20)} ${p.beneficios.length}b · ${p.detalles.length}d · ${p.faq.length}p`)
}
console.log(`\n${n} páginas de primer nivel en public/ · ${tocadas} reescritas`)
