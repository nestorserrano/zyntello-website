/**
 * Comprueba que el SEO del sitio no se ha roto en silencio.
 *
 *     node scripts/verificar-seo.mjs
 *
 * Sale con código 1 si algo falla. Se ejecuta ANTES de desplegar.
 *
 * ⚠️⚠️ POR QUÉ HACE FALTA UNA GUARDA Y NO BASTA CON MIRARLO
 *
 * Todos los defectos que esta comprobación busca tienen la misma propiedad:
 * **la página sigue respondiendo 200 y viéndose perfecta**. Un canonical que
 * apunta a una URL que redirige, una doble barra, una página que está en el
 * sitemap y no existe, dos páginas declarando la misma canónica — nada de eso
 * produce un error que alguien vea. Solo aparece semanas después en Search
 * Console, cuando ya llevas un mes sin posicionar.
 *
 * Lo que se detecta leyendo el código a mano se degrada; lo que se convierte
 * en comprobación, no.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const AQUI = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(AQUI, '..', 'public')
const SITIO = 'https://zyntello.com'

const fallos = []
const avisos = []

/* Todas las páginas del sitio (las carpetas con index.html), más la portada,
   que es `index.html` en la raíz del proyecto y no en public/. */
function paginas(dir = PUBLIC, encontradas = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || !e.isDirectory()) continue
    const ruta = join(dir, e.name)
    const indice = join(ruta, 'index.html')
    if (existsSync(indice)) {
      encontradas.push({
        url: `${SITIO}/${relative(PUBLIC, ruta).split('\\').join('/')}/`,
        archivo: indice,
      })
    }
    paginas(ruta, encontradas)
  }
  return encontradas
}

const todas = [
  { url: `${SITIO}/`, archivo: join(AQUI, '..', 'index.html') },
  ...paginas(),
]

// ─── 1 · Cada página declara un canonical, y es el suyo ──────────────────────
//
// ⚠️ Este es el defecto que había el 2026-09-25 en las 35 landings de módulo:
// declaraban `/{slug}` cuando la URL que responde 200 es `/{slug}/`. Google
// recibía una señal contradictoria y la descartaba, sin un solo error visible.
const canonicos = new Map()
for (const p of todas) {
  const html = readFileSync(p.archivo, 'utf8')
  const m = html.match(/<link rel="canonical" href="([^"]+)"/)

  if (!m) { fallos.push(`Sin canonical: ${p.url}`); continue }
  const canonico = m[1]

  if (canonico !== p.url) {
    fallos.push(`Canonical que no es el suyo: ${p.url}\n    declara → ${canonico}`)
  }
  if (canonico.includes('//', 'https://'.length)) {
    fallos.push(`Canonical con doble barra: ${canonico}`)
  }
  if (!canonico.endsWith('/')) {
    fallos.push(`Canonical sin barra final (esa URL responde 301): ${canonico}`)
  }

  // Dos páginas con el mismo canonical se canibalizan: Google indexa una sola.
  if (canonicos.has(canonico)) {
    fallos.push(`Canonical duplicado en dos páginas: ${canonico}\n    ${canonicos.get(canonico)}\n    ${p.url}`)
  }
  canonicos.set(canonico, p.url)

  // ─── 2 · Título y descripción, dentro de lo que Google muestra ────────────
  const t = html.match(/<title>([^<]*)<\/title>/)
  if (!t || !t[1].trim()) fallos.push(`Sin <title>: ${p.url}`)
  else if (t[1].length > 65) avisos.push(`Título de ${t[1].length} caracteres (Google corta ~60): ${p.url}`)

  const d = html.match(/<meta name="description" content="([^"]*)"/)
  if (!d || !d[1].trim()) fallos.push(`Sin descripción: ${p.url}`)
  else if (d[1].length > 165) avisos.push(`Descripción de ${d[1].length} caracteres (se corta ~160): ${p.url}`)

  // ─── 3 · El JSON-LD tiene que ser JSON válido ─────────────────────────────
  //
  // ⚠️ Un JSON-LD roto no rompe la página: el navegador ignora el bloque. Lo
  // ignora Google también, así que los datos estructurados dejan de existir sin
  // que nada lo diga.
  for (const b of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(b[1]) } catch (e) { fallos.push(`JSON-LD inválido en ${p.url}: ${e.message}`) }
  }
}

// ─── 4 · El sitemap y la realidad dicen lo mismo ─────────────────────────────
const sitemap = join(PUBLIC, 'sitemap.xml')
if (!existsSync(sitemap)) {
  fallos.push('No existe public/sitemap.xml — ejecuta: node scripts/generar-sitemap.mjs')
} else {
  const xml = readFileSync(sitemap, 'utf8')
  const enSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

  for (const url of enSitemap) {
    if (url.includes('//', 'https://'.length)) fallos.push(`URL del sitemap con doble barra: ${url}`)
    if (!url.endsWith('/')) fallos.push(`URL del sitemap sin barra final: ${url}`)
  }

  const duplicadas = enSitemap.filter((u, i) => enSitemap.indexOf(u) !== i)
  if (duplicadas.length) fallos.push(`URLs repetidas en el sitemap: ${[...new Set(duplicadas)].join(', ')}`)

  /* ⚠️ Las landings de módulo NO se comprueban contra el disco: no están en
     este repo, las escribe el admin en el document root del sitio. Que falte
     una aquí es lo normal, no un fallo. Su guarda es `verificar-landings.mjs`,
     que las mide contra producción. */
  const delRepo = new Set(todas.map((p) => p.url))
  const enRepo = enSitemap.filter((u) => delRepo.has(u))
  for (const p of todas) {
    if (!enSitemap.includes(p.url)) {
      fallos.push(`Página que existe y NO está en el sitemap: ${p.url}\n    → node scripts/generar-sitemap.mjs`)
    }
  }
  console.log(`  sitemap: ${enSitemap.length} URLs (${enRepo.length} de este repo + ${enSitemap.length - enRepo.length} landings de módulo)`)
}

// ─── 5 · La clave de IndexNow coincide con su archivo ────────────────────────
const claves = readdirSync(PUBLIC).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f))
if (claves.length === 0) avisos.push('No hay clave de IndexNow en public/ (opcional)')
else if (claves.length > 1) fallos.push(`Hay ${claves.length} claves de IndexNow; debe haber una sola`)
else {
  const contenido = readFileSync(join(PUBLIC, claves[0]), 'utf8').trim()
  // ⚠️ El buscador compara el NOMBRE del archivo con su CONTENIDO. Si no
  // coinciden responde 403 y el aviso se pierde sin que nadie lo vea.
  if (`${contenido}.txt` !== claves[0]) {
    fallos.push(`La clave IndexNow ${claves[0]} no contiene su propio nombre`)
  }
}

// ─── Resultado ───────────────────────────────────────────────────────────────
console.log(`  páginas comprobadas: ${todas.length}`)

if (avisos.length) {
  console.log(`\n⚠ ${avisos.length} aviso(s):`)
  for (const a of avisos) console.log(`  · ${a}`)
}

if (fallos.length) {
  console.error(`\n✗ ${fallos.length} fallo(s):`)
  for (const f of fallos) console.error(`  · ${f}`)
  process.exit(1)
}

console.log('\n✓ SEO correcto')
