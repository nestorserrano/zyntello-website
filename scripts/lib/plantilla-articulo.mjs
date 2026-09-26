/**
 * Plantilla del blog: el índice y cada artículo.
 *
 * ⚠️ Reutiliza `estilos()` de `plantilla.mjs` en vez de traer su propio CSS.
 * Una segunda copia del CSS no falla cuando diverge —las dos páginas siguen
 * viéndose bien— simplemente dejan de parecerse, y nadie lo reporta porque
 * nadie las mira una al lado de la otra.
 *
 * ⚠️⚠️ UN BLOG VACÍO ES PEOR QUE NO TENER BLOG. Una sección con dos entradas
 * de relleno le dice a Google que el sitio se actualiza poco y le da páginas
 * flojas que compiten con las buenas. Si no hay nada que contar, no se publica.
 */

import { estilos } from './plantilla.mjs'

const SITIO = 'https://zyntello.com'
const WHATSAPP = '18296399877'
const COLOR = '#6366f1'

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

/* Estilos propios del blog. Son los cuatro que el CSS común no trae, porque
   ninguna otra página del sitio tiene texto largo que leer. */
const ESTILOS_BLOG = `
.art{padding:56px 0 24px}
.art-meta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;color:var(--tenue);font-size:.84rem;margin-bottom:18px}
.art-meta span{display:inline-flex;align-items:center;gap:6px}
.art h1{font-family:var(--display);font-weight:700;font-size:clamp(1.9rem,4.4vw,3rem);letter-spacing:-.035em;line-height:1.08;margin-bottom:18px}
.art-entradilla{color:var(--medio);font-size:clamp(1.02rem,1.5vw,1.14rem);max-width:66ch}
.cuerpo{padding:16px 0 72px}
.cuerpo h2{font-family:var(--display);font-weight:700;font-size:clamp(1.3rem,2.4vw,1.72rem);letter-spacing:-.025em;line-height:1.2;margin:46px 0 16px}
.cuerpo p{color:var(--medio);margin-bottom:17px;max-width:70ch}
.cuerpo ul{list-style:none;margin:0 0 20px;max-width:70ch}
.cuerpo li{display:flex;gap:11px;align-items:flex-start;color:var(--medio);margin-bottom:10px}
.cuerpo li::before{content:'';flex-shrink:0;width:6px;height:6px;border-radius:2px;background:var(--color);margin-top:10px;transform:rotate(45deg)}
.cuerpo strong{color:var(--texto);font-weight:600}
.aviso{background:var(--tarjeta);border:1px solid var(--borde);border-left:3px solid var(--color);border-radius:0 14px 14px 0;padding:20px 24px;margin:26px 0;max-width:70ch}
.aviso p{margin:0;color:var(--suave);font-size:.95rem}
.entrada{display:block;background:var(--tarjeta);border:1px solid var(--borde);border-radius:16px;padding:26px;transition:border-color .3s,transform .3s}
.entrada:hover{border-color:color-mix(in srgb,var(--color) 40%,transparent);transform:translateY(-3px)}
.entrada time{display:block;color:var(--tenue);font-size:.8rem;margin-bottom:10px}
.entrada h2{font-family:var(--display);font-weight:600;font-size:1.14rem;letter-spacing:-.02em;line-height:1.25;margin-bottom:9px}
.entrada p{color:var(--suave);font-size:.93rem}
`

/* ⚠️ La fecha legible es SOLO para el ojo. La que lee Google va en el atributo
   `datetime` y en el JSON-LD, en formato ISO: «25 de septiembre de 2026» no es
   una fecha para una máquina. */
const enLetra = (iso) => {
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${a}`
}

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
      <!-- ⚠️ El isotipo TRANSPARENTE, como en el resto de páginas. El logo
           "principal blanco" tiene fondo blanco sólido, así que sobre esta
           barra oscura se ve como una caja blanca recortada. El nombre va en
           texto, que además escala mejor que una imagen.
           ⚠️ Sin acentos graves en este comentario: va dentro de un template
           literal de JavaScript y uno solo cierra la cadena — el error que
           sale entonces señala una palabra del comentario, no la causa. -->
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
      <a href="${SITIO}/contacto/">Contacto</a> ·
      <a href="mailto:soporte@zyntello.com">soporte@zyntello.com</a>
    </span>
  </div>
</footer>
</body>
</html>
`

/** Un artículo. */
export function articulo(a) {
  const url = `${SITIO}/blog/${a.slug}/`

  const cuerpo = a.secciones.map((s) => {
    const partes = [`<h2 id="${s.id}">${esc(s.titulo)}</h2>`]
    for (const bloque of s.bloques) {
      if (typeof bloque === 'string') partes.push(`<p>${bloque}</p>`)
      else if (bloque.lista) partes.push(`<ul>${bloque.lista.map(li => `<li><span>${li}</span></li>`).join('')}</ul>`)
      else if (bloque.aviso) partes.push(`<div class="aviso"><p>${bloque.aviso}</p></div>`)
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
          { '@type': 'ListItem', position: 2, name: 'Blog',   item: `${SITIO}/blog/` },
          { '@type': 'ListItem', position: 3, name: a.titulo, item: url },
        ],
      },
    ],
  }

  return cabecera({ titulo: `${a.titulo} | Zyntello`, descripcion: a.resumen, url, jsonLd, color: a.color })
    + `
<article>
  <header class="art">
    <div class="contenedor contenedor-estrecho">
      <div class="art-meta">
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

<section class="cierre">
  <div class="contenedor">
    <h2>${esc(a.cierre.titulo)}</h2>
    <p>${esc(a.cierre.texto)}</p>
    <div class="acciones">
      <a href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`¡Hola Zyntello! Leí «${a.titulo}» y quiero saber más.`)}" target="_blank" rel="noopener" class="btn btn-principal">Hablar con Zyntello</a>
      <a href="${a.cierre.href}" class="btn btn-fantasma">${esc(a.cierre.boton)}</a>
    </div>
  </div>
</section>
` + pie()
}

/** El índice del blog. */
export function indice(articulos) {
  const url = `${SITIO}/blog/`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        name: 'Blog de Zyntello',
        description: 'Lo que hemos aprendido implantando sistemas de gestión en República Dominicana y la región.',
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
          { '@type': 'ListItem', position: 2, name: 'Blog',   item: url },
        ],
      },
    ],
  }

  /* ⚠️ La rejilla reparte en el mayor divisor: con 3 artículos son 3 columnas,
     con 4 son 2+2. Con 5 caería a UNA columna y la página se vería rara sin
     que nada fallara. Se topa a 3 y ya. */
  const columnas = (() => { for (let c = Math.min(articulos.length, 3); c >= 1; c--) if (articulos.length % c === 0) return c; return 1 })()

  return cabecera({
    titulo: 'Blog | Zyntello',
    descripcion: 'Lo que hemos aprendido implantando sistemas de gestión: facturación fiscal, nómina, inventario y automatización en República Dominicana y la región.',
    url, jsonLd,
  }) + `
<header class="art">
  <div class="contenedor">
    <p class="rotulo">Blog</p>
    <h1>Lo que se aprende operando, no leyendo</h1>
    <p class="art-entradilla">Cosas que cuestan dinero y casi nadie explica: qué comprueba de verdad la DGII en un comprobante, por qué el pago de vacaciones se descuenta después, y por qué el inventario del sistema nunca es el del almacén.</p>
  </div>
</header>

<section class="seccion">
  <div class="contenedor">
    <div class="rejilla" style="--cols:${columnas}">
      ${articulos.map((a) => `<a class="entrada" href="${SITIO}/blog/${a.slug}/" style="border-left:2px solid ${a.color}">
        <time datetime="${a.fecha}">${enLetra(a.fecha)} · ${a.minutos} min</time>
        <h2>${esc(a.titulo)}</h2>
        <p>${esc(a.resumen)}</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

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
