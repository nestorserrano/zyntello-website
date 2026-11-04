/**
 * Plantilla del blog: el índice y cada artículo.
 *
 * ⚠️ Reutiliza `estilos()` de `plantilla.mjs` en vez de traer su propio CSS.
 * Una segunda copia del CSS no falla cuando diverge —las dos páginas siguen
 * viéndose bien— simplemente dejan de parecerse, y nadie lo mira una al lado
 * de la otra para notarlo.
 *
 * ⚠️⚠️ CADA ARTÍCULO LLEVA A UNA LANDING. El blog no está para «tener
 * contenido»: está para alimentar las páginas que se quieren posicionar. El
 * destino sale del grupo temático (`clusters.mjs`) y aparece en el cierre y en
 * los relacionados. Un artículo que no lleva a ninguna parte es tráfico que se
 * va por donde vino.
 */

import { estilos, redesSociales, rotuloIdioma } from './plantilla.mjs'
import { CLUSTERS, PAISES } from '../blog/clusters.mjs'
import { IDIOMAS } from './idiomas.mjs'

const SITIO = 'https://zyntello.com'
const WHATSAPP = '18296399877'
const COLOR = '#6366f1'

/** La URL de una ruta del blog en un idioma. El español no lleva prefijo. */
const rutaEn = (prefijo, resto = '') => `${SITIO}/${prefijo}blog/${resto}`

/** Traductor de respaldo: devuelve el texto español tal cual. */
const sinTraducir = (clave, respaldo) => respaldo

/**
 * Reescribe los enlaces a otros artículos para que lleven al MISMO idioma,
 * pero solo cuando ese artículo existe traducido.
 *
 * ⚠️⚠️ Las dos mitades importan. Sin reescribir, el lector árabe que pulsa un
 * enlace del texto cae en el artículo español y el sitio deja de hablarle en su
 * idioma a mitad de lectura. Reescribiendo a ciegas es peor: el enlace iría a
 * `/ar/blog/{slug}/` y, si ese artículo aún no está traducido, da un 404 — un
 * 404 interno enlazado desde el cuerpo, que Google encuentra él solo rastreando
 * el sitio. Por eso hace falta saber cuáles existen, y por eso `disponibles`
 * llega desde el generador y no se adivina aquí.
 */
const enlazarEnIdioma = (html, idioma, disponibles) => {
  if (idioma === 'es') return html
  const p = prefijoDe(idioma)
  return html.replace(/(href="https:\/\/zyntello\.com)\/blog\/([a-z0-9-]+)\/"/g,
    (todo, inicio, slug) => disponibles.has(slug) ? `${inicio}/${p}blog/${slug}/"` : todo)
}

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

/* Estilos propios del blog: los que el CSS común no trae, porque ninguna otra
   página del sitio tiene texto largo que leer. */
const ESTILOS_BLOG = `
.art{padding:56px 0 24px}
.art-meta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;color:var(--tenue);font-size:.84rem;margin-bottom:18px}
.art h1{font-family:var(--display);font-weight:700;font-size:clamp(1.9rem,4.4vw,3rem);letter-spacing:-.035em;line-height:1.08;margin-bottom:18px}
.art-entradilla{color:var(--medio);font-size:clamp(1.02rem,1.5vw,1.14rem);max-width:66ch}
.pais{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;border:1px solid color-mix(in srgb,var(--color) 34%,transparent);background:color-mix(in srgb,var(--color) 11%,transparent);color:var(--color);font-family:var(--display);font-weight:600;font-size:.74rem;letter-spacing:.03em}
.cuerpo{padding:16px 0 72px}
.cuerpo h2{font-family:var(--display);font-weight:700;font-size:clamp(1.3rem,2.4vw,1.72rem);letter-spacing:-.025em;line-height:1.2;margin:46px 0 16px}
.cuerpo p{color:var(--medio);margin-bottom:17px;max-width:70ch}
.cuerpo ul{list-style:none;margin:0 0 20px;max-width:70ch}
.cuerpo li{display:flex;gap:11px;align-items:flex-start;color:var(--medio);margin-bottom:10px}
.cuerpo li::before{content:'';flex-shrink:0;width:6px;height:6px;border-radius:2px;background:var(--color);margin-top:10px;transform:rotate(45deg)}
.cuerpo strong{color:var(--texto);font-weight:600}
.cuerpo a{color:var(--color);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.aviso{background:var(--tarjeta);border:1px solid var(--borde);border-left:3px solid var(--color);border-radius:0 14px 14px 0;padding:20px 24px;margin:26px 0;max-width:70ch}
.aviso p{margin:0;color:var(--suave);font-size:.95rem}
.entrada{display:block;background:var(--tarjeta);border:1px solid var(--borde);border-radius:16px;padding:24px;transition:border-color .3s,transform .3s}
.entrada:hover{border-color:color-mix(in srgb,var(--color) 40%,transparent);transform:translateY(-3px)}
.entrada time{display:block;color:var(--tenue);font-size:.79rem;margin-bottom:9px}
.entrada h3{font-family:var(--display);font-weight:600;font-size:1.08rem;letter-spacing:-.02em;line-height:1.28;margin-bottom:8px}
.entrada p{color:var(--suave);font-size:.91rem}
.grupo{padding:58px 0;border-top:1px solid var(--borde)}
.grupo-cab{display:flex;flex-wrap:wrap;gap:14px;align-items:baseline;justify-content:space-between;margin-bottom:10px}
.grupo h2{font-family:var(--display);font-weight:700;font-size:clamp(1.35rem,2.6vw,1.85rem);letter-spacing:-.03em}
.grupo-ir{color:var(--color);font-size:.88rem;font-family:var(--display);font-weight:600;white-space:nowrap}
.grupo-ir:hover{text-decoration:underline}
.grupo-txt{color:var(--suave);font-size:.97rem;max-width:68ch;margin-bottom:30px}
`

/* ⚠️ La fecha legible es SOLO para el ojo. La que lee Google va en `datetime`
   y en el JSON-LD, en ISO: «26 de septiembre de 2026» no es una fecha para
   una máquina. */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

/* ⚠️⚠️ `Intl` NO conoce el criollo haitiano y NO falla al pedírselo: devuelve
   la fecha en ESPAÑOL. Medido — `Intl.DateTimeFormat('ht')` da «26 de
   septiembre de 2026», exactamente igual que `'es'`. Dentro de un artículo en
   criollo eso es una línea en otro idioma que nadie va a ver revisando el
   resto del texto, porque el resto está bien.

   Por eso `ht` lleva su tabla y los demás no: escribir ocho tablas sería
   reimplementar lo que el motor ya hace para siete. */
const MESES_HT = ['janvye', 'fevriye', 'mas', 'avril', 'me', 'jen',
  'jiyè', 'out', 'septanm', 'oktòb', 'novanm', 'desanm']

const enLetra = (iso, idioma = 'es') => {
  const [a, m, d] = iso.split('-').map(Number)
  if (idioma === 'es') return `${d} de ${MESES[m - 1]} de ${a}`
  if (idioma === 'ht') return `${d} ${MESES_HT[m - 1]} ${a}`
  return new Intl.DateTimeFormat(idioma, { dateStyle: 'long', timeZone: 'UTC' })
    .format(new Date(`${iso}T00:00:00Z`))
}

/* ⚠️ La rejilla reparte en el mayor divisor: 5 elementos no tienen divisor y
   caerían a UNA columna. Se topa a 3 y se acepta la última fila incompleta,
   que se ve mejor que una columna de cinco tarjetas anchas. */
const columnasPara = (n) => (n % 3 === 0 ? 3 : n % 2 === 0 ? 2 : Math.min(n, 3))

/**
 * ⚠️⚠️ `idiomas` son aquellos en los que ESTA página existe, no los ocho. Una
 * página que declara `hreflang` hacia una URL que responde 404 le dice a Google
 * que tiene versiones que no tiene, y Google deja de fiarse del bloque entero
 * —también en las páginas que sí las tienen—. No se ve en pantalla: la etiqueta
 * vive en el `<head>`. Ya pasó con las cuatro páginas de primer nivel, medido en
 * producción.
 *
 * ⚠️ `resto` es lo que va después de `/blog/` en la URL: el slug del artículo o
 * nada para el índice. Hace falta para que el selector de idioma lleve al MISMO
 * artículo en el otro idioma y no a la portada del blog.
 */
const cabecera = ({ titulo, descripcion, url, jsonLd, color = COLOR,
                    idioma = 'es', idiomas = [], resto = '', t = sinTraducir }) => {
  const dir = IDIOMAS.find(i => i.codigo === idioma)?.dir ?? 'ltr'
  return `<!DOCTYPE html>
<html lang="${idioma}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="canonical" href="${url}">
${idiomas.map(i => `<link rel="alternate" hreflang="${i.codigo}" href="${rutaEn(i.prefijo, resto)}">`).join('\n')}
${idiomas.length ? `<link rel="alternate" hreflang="x-default" href="${rutaEn('', resto)}">` : ''}
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Zyntello">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITIO}/logos/zyntello_facebook_portada.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="628">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(descripcion)}">
<meta name="twitter:image" content="${SITIO}/logos/zyntello_facebook_portada.png">
<link rel="icon" href="${SITIO}/logos/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${SITIO}/vendor/fontawesome/css/all.min.css">
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
<style>
${estilos(color).trim()}
${ESTILOS_BLOG.trim()}
</style>
</head>
<body>
<nav class="barra">
  <div class="contenedor barra-caja">
    <div class="barra-izq">
      <a class="barra-volver" href="${rutaEn(prefijoDe(idioma))}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
        <span>${esc(t('blogp.blog', 'Blog'))}</span>
      </a>
      <span class="barra-sep" aria-hidden="true"></span>
      <a class="barra-marca" href="${SITIO}/${prefijoDe(idioma)}">
        <img src="${SITIO}/logos/zyntello_isotipo_transparente.png" alt="" width="30" height="30">
        <strong>Zyntello</strong>
      </a>
    </div>
    <div class="barra-acciones">
${idiomas.length > 1 ? `      <div class="barra-idiomas" role="navigation" aria-label="${esc(t('a11y.idiomas', 'Idioma'))}">
${idiomas.map(i => i.codigo === idioma
    ? `        <span class="idioma-activo" aria-current="true">${rotuloIdioma(i.codigo)}</span>`
    : `        <a href="${rutaEn(i.prefijo, resto)}" hreflang="${i.codigo}" lang="${i.codigo}" title="${esc(i.nombre)}">${rotuloIdioma(i.codigo)}</a>`).join('\n')}
      </div>` : ''}
      <a href="${SITIO}/${prefijoDe(idioma)}#soluciones" class="btn btn-fantasma btn-barra">${esc(t('pag.boton.modulos', 'Ver los módulos'))}</a>
    </div>
  </div>
</nav>`
}

/** El prefijo de URL de un idioma: `''` para el español, `'ar/'` para el árabe. */
const prefijoDe = (codigo) => IDIOMAS.find(i => i.codigo === codigo)?.prefijo ?? ''

/* ⚠️ Los enlaces del pie llevan el prefijo del idioma. Sin él, un lector del
   artículo en árabe que pulsa «Precios» cae en la página española — y lo que
   ve es un sitio que le ha dejado de hablar en su idioma a mitad de camino. */
const pie = (idioma = 'es', t = sinTraducir) => {
  const p = prefijoDe(idioma)
  return `
<footer class="pie">
  <div class="contenedor pie-caja">
    <span>© ${new Date().getFullYear()} Zyntello, S.R.L. · ${esc(t('nos.pais.rd', 'República Dominicana'))}</span>
    <span>
      <a href="${rutaEn(p)}">${esc(t('blogp.blog', 'Blog'))}</a> ·
      <a href="${SITIO}/${p}precios/">${esc(t('pri.precios.nombre', 'Precios'))}</a> ·
      <a href="${SITIO}/${p}nosotros/">${esc(t('pri.nosotros.nombre', 'Nosotros'))}</a> ·
      <a href="${SITIO}/${p}contacto/">${esc(t('pri.contacto.nombre', 'Contacto'))}</a> ·
      <a href="mailto:soporte@zyntello.com">soporte@zyntello.com</a>
    </span>
    <div class="pie-redes">
      <span>${esc(t('pag.redes.seguir', 'Síguenos'))}</span>
      ${redesSociales(t)}
    </div>
  </div>
</footer>
</body>
</html>
`
}

/* ⚠️ La tarjeta enlaza al artículo EN EL MISMO IDIOMA. Con el enlace en
   español, el lector chino que pulsa un relacionado sale del chino sin saber
   por qué — y si ese artículo aún no está traducido, a un 404. */
const tarjeta = (a, idioma = 'es', t = sinTraducir) => `<a class="entrada" href="${rutaEn(prefijoDe(idioma), `${a.slug}/`)}" style="border-left:2px solid ${CLUSTERS[a.cluster].color}">
        <time datetime="${a.fecha}">${enLetra(a.fecha, idioma)} · ${a.minutos} ${esc(t('blogp.min', 'min'))}${a.pais ? ` · ${esc(t(`pais.${a.pais}`, PAISES[a.pais]))}` : ''}</time>
        <h3>${esc(t(`blog.${a.slug}.titulo`, a.titulo))}</h3>
        <p>${esc(t(`blog.${a.slug}.resumen`, a.resumen))}</p>
      </a>`

/**
 * Un artículo.
 *
 * ⚠️ `a` llega YA TRADUCIDO (lo traduce el generador con `traducir()`), así que
 * `a.titulo` es el titular en el idioma que toca. `t` se usa solo para el
 * chrome —rótulos, botones, nombres de clúster y de país—, que no viaja dentro
 * del artículo sino en `clusters.mjs`.
 */
export function articulo(a, hermanos = [], opciones = {}) {
  const { idioma = 'es', idiomas = [], t = sinTraducir, disponibles = new Set(),
          rutaDestino = (r) => r } = opciones
  const p = prefijoDe(idioma)
  const url = rutaEn(p, `${a.slug}/`)
  const grupo = CLUSTERS[a.cluster]
  const destino = a.destino || grupo.destino
  const nombreGrupo = t(`clus.${a.cluster}.nombre`, grupo.nombre)

  const cuerpo = enlazarEnIdioma(a.secciones.map((s) => {
    const partes = [`<h2 id="${s.id}">${esc(s.titulo)}</h2>`]
    for (const b of s.bloques) {
      if (typeof b === 'string') partes.push(`<p>${b}</p>`)
      else if (b.lista) partes.push(`<ul>${b.lista.map((li) => `<li><span>${li}</span></li>`).join('')}</ul>`)
      else if (b.aviso) partes.push(`<div class="aviso"><p>${b.aviso}</p></div>`)
    }
    return partes.join('\n')
  }).join('\n'), idioma, disponibles)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#articulo`,
        headline: a.titulo,
        description: a.resumen,
        url,
        inLanguage: idioma,
        datePublished: a.fecha,
        dateModified: a.actualizado || a.fecha,
        image: `${SITIO}/logos/zyntello_facebook_portada.png`,
        articleSection: nombreGrupo,
        /* ⚠️ El autor es la ORGANIZACIÓN, no una persona inventada. Un autor
           falso con nombre y apellido es lo primero que desmonta la confianza
           de una página, y Google valora la autoría real. */
        author: { '@type': 'Organization', name: 'Zyntello, S.R.L.', url: SITIO },
        publisher: { '@id': `${SITIO}/#organizacion` },
        isPartOf: { '@type': 'Blog', '@id': `${rutaEn(p)}#blog`, name: t('blogp.nombre', 'Blog de Zyntello') },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('pag.pri.volver', 'Inicio'), item: `${SITIO}/${p}` },
          { '@type': 'ListItem', position: 2, name: t('blogp.blog', 'Blog'), item: rutaEn(p) },
          { '@type': 'ListItem', position: 3, name: a.titulo, item: url },
        ],
      },
    ],
  }

  const relacionados = hermanos.length ? `
<section class="seccion seccion-alta">
  <div class="contenedor">
    <p class="rotulo">${esc(nombreGrupo)}</p>
    <h2 class="titulo-seccion">${esc(t('blogp.mismotema', 'Del mismo tema'))}</h2>
    <div class="rejilla" style="--cols:${columnasPara(hermanos.length)}">
      ${hermanos.map(h => tarjeta(h, idioma, t)).join('\n      ')}
    </div>
  </div>
</section>` : ''

  return cabecera({
    titulo: `${a.titulo} | Zyntello`, descripcion: a.resumen, url, jsonLd,
    color: grupo.color, idioma, idiomas, resto: `${a.slug}/`, t,
  })
    + `
<article>
  <header class="art">
    <div class="contenedor contenedor-estrecho">
      <div class="art-meta">
        ${a.pais ? `<span class="pais">${esc(t(`pais.${a.pais}`, PAISES[a.pais]))}</span>` : ''}
        <span><time datetime="${a.fecha}">${enLetra(a.fecha, idioma)}</time></span>
        <span aria-hidden="true">·</span>
        <span>${a.minutos} ${esc(t('blogp.lectura', 'min de lectura'))}</span>
        <span aria-hidden="true">·</span>
        <span>${esc(a.tema)}</span>
      </div>
      <h1>${esc(a.titulo)}</h1>
      <p class="art-entradilla">${esc(a.resumen)}</p>
    </div>
  </header>

  <div class="cuerpo">
    <div class="contenedor contenedor-estrecho">
${cuerpo}
    </div>
  </div>
</article>
${relacionados}
<section class="cierre">
  <div class="contenedor">
    <h2>${esc(a.cierre.titulo)}</h2>
    <p>${esc(a.cierre.texto)}</p>
    <div class="acciones">
      <a href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`¡Hola Zyntello! Leí «${a.tituloEs ?? a.titulo}» y quiero saber más.`)}" target="_blank" rel="noopener" class="btn btn-principal">${esc(t('pag.boton.whatsapp', 'Hablar con Zyntello'))}</a>
      <a href="${SITIO}${rutaDestino(destino.ruta, idioma)}" class="btn btn-fantasma">${esc(a.destino ? destino.texto : t(`clus.${a.cluster}.destino`, destino.texto))}</a>
    </div>
  </div>
</section>
` + pie(idioma, t)
}

/**
 * El índice del blog, agrupado por tema.
 *
 * ⚠️ `articulos` llega YA TRADUCIDO y YA FILTRADO: solo los que existen en este
 * idioma. Listar aquí los que faltan pondría tarjetas cuyo enlace da 404, que
 * es lo peor que se le puede dar a Google — un 404 interno que encuentra él
 * solo rastreando el sitio.
 */
export function indice(articulos, opciones = {}) {
  const { idioma = 'es', idiomas = [], t = sinTraducir, rutaDestino = (r) => r } = opciones
  const p = prefijoDe(idioma)
  const url = rutaEn(p)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        name: t('blogp.nombre', 'Blog de Zyntello'),
        description: t('blogp.descripcion', 'Lo que hemos aprendido implantando sistemas de gestión en República Dominicana, Venezuela, Colombia, Guatemala y Costa Rica.'),
        url,
        inLanguage: idioma,
        publisher: { '@id': `${SITIO}/#organizacion` },
        blogPost: articulos.map((a) => ({
          '@type': 'BlogPosting',
          headline: a.titulo,
          description: a.resumen,
          url: rutaEn(p, `${a.slug}/`),
          datePublished: a.fecha,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('pag.pri.volver', 'Inicio'), item: `${SITIO}/${p}` },
          { '@type': 'ListItem', position: 2, name: t('blogp.blog', 'Blog'), item: url },
        ],
      },
    ],
  }

  const grupos = Object.entries(CLUSTERS)
    .map(([clave, g]) => [g, articulos.filter((a) => a.cluster === clave), clave])
    .filter(([, arts]) => arts.length)

  return cabecera({
    titulo: `${t('blogp.blog', 'Blog')} | Zyntello`,
    descripcion: t('blogp.meta', 'Facturación fiscal, nómina, inventario y gestión en República Dominicana, Venezuela, Colombia, Guatemala y Costa Rica. Lo que se aprende operando.'),
    url, jsonLd, idioma, idiomas, resto: '', t,
  }) + `
<header class="art">
  <div class="contenedor">
    <p class="rotulo">${esc(t('blogp.blog', 'Blog'))}</p>
    <h1>${esc(t('blogp.titular', 'Lo que se aprende operando, no leyendo'))}</h1>
    <p class="art-entradilla">${esc(t('blogp.entradilla', 'Cosas que cuestan dinero y casi nadie explica: qué comprueba de verdad cada organismo en un comprobante, por qué el pago de vacaciones se descuenta después y por qué el inventario del sistema nunca es el del almacén.'))} ${articulos.length} ${esc(t('blogp.articulos', 'artículos'))}, ${esc(t('blogp.en', 'en'))} ${grupos.length} ${esc(t('blogp.temas', 'temas'))}.</p>
  </div>
</header>

${grupos.map(([g, arts, clave]) => `<section class="grupo">
  <div class="contenedor">
    <div class="grupo-cab">
      <h2>${esc(t(`clus.${clave}.nombre`, g.nombre))}</h2>
      <a class="grupo-ir" href="${SITIO}${rutaDestino(g.destino.ruta, idioma)}">${esc(t(`clus.${clave}.destino`, g.destino.texto))} →</a>
    </div>
    <p class="grupo-txt">${esc(t(`clus.${clave}.entradilla`, g.entradilla))}</p>
    <div class="rejilla" style="--cols:${columnasPara(arts.length)}">
      ${arts.map(a => tarjeta(a, idioma, t)).join('\n      ')}
    </div>
  </div>
</section>`).join('\n')}

<section class="cierre">
  <div class="contenedor">
    <h2>${esc(t('blogp.cierre.titulo', '¿Alguno de estos te está pasando?'))}</h2>
    <p>${esc(t('blogp.cierre.texto', 'Son problemas que hemos visto muchas veces. Cuéntanos el tuyo y te decimos si se arregla con un módulo o con otra cosa.'))}</p>
    <div class="acciones">
      <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" class="btn btn-principal">${esc(t('pag.boton.whatsapp', 'Hablar con Zyntello'))}</a>
      <a href="${SITIO}/${p}#soluciones" class="btn btn-fantasma">${esc(t('pag.boton.modulos', 'Ver los módulos'))}</a>
    </div>
  </div>
</section>
` + pie(idioma, t)
}
