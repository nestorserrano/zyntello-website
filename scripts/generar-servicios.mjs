/**
 * Genera las páginas de los servicios.
 *
 *     node scripts/generar-servicios.mjs
 *
 * Escribe `public/servicios/{slug}/index.html` con la MISMA plantilla que las
 * funcionalidades (`scripts/lib/plantilla.mjs`), para que las dos familias de
 * páginas se parezcan entre sí sin mantener dos diseños.
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
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { SERVICIOS } from './servicios/datos.mjs'
import { pagina } from './lib/plantilla.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DESTINO = join(AQUI, '..', 'public', 'servicios')

let n = 0
for (const [i, s] of SERVICIOS.entries()) {
  // Las tres siguientes en círculo: todos quedan enlazados desde otros tres.
  const otras = [1, 2, 3].map(d => SERVICIOS[(i + d) % SERVICIOS.length])

  const carpeta = join(DESTINO, s.slug)
  mkdirSync(carpeta, { recursive: true })
  writeFileSync(join(carpeta, 'index.html'), pagina(s, otras, {
    base: 'servicios',
    volver: 'Todos los servicios',
    distintivo: 'Servicio de Zyntello',
    tituloOtras: 'Otros servicios que solemos combinar con este',
    segundoBoton: { texto: 'Ver todos los servicios', href: 'https://zyntello.com/#servicios' },
  }), 'utf8')
  n++
  console.log(`  ${s.slug.padEnd(30)} ${s.beneficios.length}b · ${s.detalles.length}d · ${s.faq.length}p`)
}
console.log(`\n${n} páginas en public/servicios/`)
