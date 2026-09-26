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

import { estilos } from './plantilla.mjs'
import { CLUSTERS, PAISES } from '../blog/clusters.mjs'

const SITIO = 'https://zyntello.com'
const WHATSAPP = '18296399877'
const COLOR = '#6366f1'

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
const enLetra = (iso) => {
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${a}`
}

/* ⚠️ La rejilla reparte en el mayor divisor: 5 elementos no tienen divisor y
   caerían a UNA columna. Se topa a 3 y se acepta la última fila incompleta,
   que se ve mejor que una columna de cinco tarjetas anchas. */
const columnasPara = (n) => (n % 3 === 0 ? 3 : n % 2 === 0 ? 2 : Math.min(n, 3))

const cabecera = ({ titulo, descripcion, url, jsonLd, color = COLOR }) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="canonical" href="${url}">
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
      <a class="barra-volver" href="${SITIO}/blog/">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
        <span>Blog</span>
      </a>
      <span class="barra-sep" aria-hidden="true"></span>
      <a class="barra-marca" href="${SITIO}/">
        <img src="${SITIO}/logos/zyntello_isotipo_transparente.png" alt="" width="30" height="30">
        <strong>Zyntello</strong>
      </a>
    </div>
    <div class="barra-acciones">
      <a href="${SITIO}/#soluciones" class="btn btn-fantasma btn-barra">Ver los módulos</a>
    </div>
  </div>
</nav>`

const pie = () => `
<footer class="pie">
  <div class="contenedor pie-caja">
    <span>© ${new Date().getFullYear()} Zyntello, S.R.L. · República Dominicana</span>
    <span>
      <a href="${SITIO}/blog/">Blog</a> ·
      <a href="${SITIO}/precios/">Precios</a> ·
      <a href="${SITIO}/nosotros/">Nosotros</a> ·
      <a href="${SITIO}/contacto/">Contacto</a> ·
      <a href="mailto:soporte@zyntello.com">soporte@zyntello.com</a>
    </span>
  </div>
</footer>
</body>
</html>
`

const tarjeta = (a) => `<a class="entrada" href="${SITIO}/blog/${a.slug}/" style="border-left:2px solid ${CLUSTERS[a.cluster].color}">
        <time datetime="${a.fecha}">${enLetra(a.fecha)} · ${a.minutos} min${a.pais ? ` · ${PAISES[a.pais]}` : ''}</time>
        <h3>${esc(a.titulo)}</h3>
        <p>${esc(a.resumen)}</p>
      </a>`

/** Un artículo. */
export function articulo(a, hermanos = []) {
  const url = `${SITIO}/blog/${a.slug}/`
  const grupo = CLUSTERS[a.cluster]
  const destino = a.destino || grupo.destino

  const cuerpo = a.secciones.map((s) => {
    const partes = [`<h2 id="${s.id}">${esc(s.titulo)}</h2>`]
    for (const b of s.bloques) {
      if (typeof b === 'string') partes.push(`<p>${b}</p>`)
      else if (b.lista) partes.push(`<ul>${b.lista.map((li) => `<li><span>${li}</span></li>`).join('')}</ul>`)
      else if (b.aviso) partes.push(`<div class="aviso"><p>${b.aviso}</p></div>`)
    }
    return partes.join('\n')
  }).join('\n')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#articulo`,
        headline: a.titulo,
        description: a.resumen,
        url,
        inLanguage: 'es',
        datePublished: a.fecha,
        dateModified: a.actualizado || a.fecha,
        image: `${SITIO}/logos/zyntello_facebook_portada.png`,
        articleSection: grupo.nombre,
        /* ⚠️ El autor es la ORGANIZACIÓN, no una persona inventada. Un autor
           falso con nombre y apellido es lo primero que desmonta la confianza
           de una página, y Google valora la autoría real. */
        author: { '@type': 'Organization', name: 'Zyntello, S.R.L.', url: SITIO },
        publisher: { '@id': `${SITIO}/#organizacion` },
        isPartOf: { '@type': 'Blog', '@id': `${SITIO}/blog/#blog`, name: 'Blog de Zyntello' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITIO}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITIO}/blog/` },
          { '@type': 'ListItem', position: 3, name: a.titulo, item: url },
        ],
      },
    ],
  }

  const relacionados = hermanos.length ? `
<section class="seccion seccion-alta">
  <div class="contenedor">
    <p class="rotulo">${esc(grupo.nombre)}</p>
    <h2 class="titulo-seccion">Del mismo tema</h2>
    <div class="rejilla" style="--cols:${columnasPara(hermanos.length)}">
      ${hermanos.map(tarjeta).join('\n      ')}
    </div>
  </div>
</section>` : ''

  return cabecera({ titulo: `${a.titulo} | Zyntello`, descripcion: a.resumen, url, jsonLd, color: grupo.color })
    + `
<article>
  <header class="art">
    <div class="contenedor contenedor-estrecho">
      <div class="art-meta">
        ${a.pais ? `<span class="pais">${PAISES[a.pais]}</span>` : ''}
        <span><time datetime="${a.fecha}">${enLetra(a.fecha)}</time></span>
        <span aria-hidden="true">·</span>
        <span>${a.minutos} min de lectura</span>
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
      <a href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`¡Hola Zyntello! Leí «${a.titulo}» y quiero saber más.`)}" target="_blank" rel="noopener" class="btn btn-principal">Hablar con Zyntello</a>
      <a href="${SITIO}${destino.ruta}" class="btn btn-fantasma">${esc(destino.texto)}</a>
    </div>
  </div>
</section>
` + pie()
}

/** El índice del blog, agrupado por tema. */
export function indice(articulos) {
  const url = `${SITIO}/blog/`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        name: 'Blog de Zyntello',
        description: 'Lo que hemos aprendido implantando sistemas de gestión en República Dominicana, Venezuela, Colombia, Guatemala y Costa Rica.',
        url,
        inLanguage: 'es',
        publisher: { '@id': `${SITIO}/#organizacion` },
        blogPost: articulos.map((a) => ({
          '@type': 'BlogPosting',
          headline: a.titulo,
          description: a.resumen,
          url: `${SITIO}/blog/${a.slug}/`,
          datePublished: a.fecha,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITIO}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: url },
        ],
      },
    ],
  }

  const grupos = Object.entries(CLUSTERS)
    .map(([clave, g]) => [g, articulos.filter((a) => a.cluster === clave)])
    .filter(([, arts]) => arts.length)

  return cabecera({
    titulo: 'Blog | Zyntello',
    descripcion: 'Facturación fiscal, nómina, inventario y gestión en República Dominicana, Venezuela, Colombia, Guatemala y Costa Rica. Lo que se aprende operando.',
    url, jsonLd,
  }) + `
<header class="art">
  <div class="contenedor">
    <p class="rotulo">Blog</p>
    <h1>Lo que se aprende operando, no leyendo</h1>
    <p class="art-entradilla">Cosas que cuestan dinero y casi nadie explica: qué comprueba de verdad cada organismo en un comprobante, por qué el pago de vacaciones se descuenta después y por qué el inventario del sistema nunca es el del almacén. ${articulos.length} artículos, en ${grupos.length} temas y cinco países.</p>
  </div>
</header>

${grupos.map(([g, arts]) => `<section class="grupo">
  <div class="contenedor">
    <div class="grupo-cab">
      <h2>${esc(g.nombre)}</h2>
      <a class="grupo-ir" href="${SITIO}${g.destino.ruta}">${esc(g.destino.texto)} →</a>
    </div>
    <p class="grupo-txt">${esc(g.entradilla)}</p>
    <div class="rejilla" style="--cols:${columnasPara(arts.length)}">
      ${arts.map(tarjeta).join('\n      ')}
    </div>
  </div>
</section>`).join('\n')}

<section class="cierre">
  <div class="contenedor">
    <h2>¿Alguno de estos te está pasando?</h2>
    <p>Son problemas que hemos visto muchas veces. Cuéntanos el tuyo y te decimos si se arregla con un módulo o con otra cosa.</p>
    <div class="acciones">
      <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" class="btn btn-principal">Hablar con Zyntello</a>
      <a href="${SITIO}/#soluciones" class="btn btn-fantasma">Ver los módulos</a>
    </div>
  </div>
</section>
` + pie()
}
