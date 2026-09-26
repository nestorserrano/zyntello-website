/**
 * La plantilla de las páginas estáticas del sitio.
 *
 * ⚠️ Vive aquí y no dentro de un generador porque la usan DOS:
 * `generar-funcionalidades.mjs` y `generar-servicios.mjs`. Duplicarla eran
 * ~350 líneas de HTML y CSS en dos sitios, y la segunda copia se queda vieja
 * sin que nada falle: las dos páginas siguen siendo válidas, solo que ya no
 * se parecen entre sí.
 *
 * Cada generador le pasa su `base` ('funcionalidades' o 'servicios'), su
 * etiqueta de vuelta y su distintivo de cabecera.
 */

const SITIO = 'https://zyntello.com'
const WHATSAPP = '18296399877'

/** Escapa lo que va dentro del HTML. El contenido lo escribimos nosotros, pero
 *  un apóstrofo tipográfico mal puesto no debería poder romper un atributo. */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

/**
 * ⚠️⚠️ La rejilla reparte en el MAYOR DIVISOR del número de elementos, nunca
 * con `auto-fill`. Con `auto-fill`, 4 elementos en un ancho que admite 3 dejan
 * uno solo en la última fila y dos huecos — y la página «se ve bien», así que
 * nadie lo reporta. Con el divisor, 6 van a 3+3 y 4 van a 2+2.
 */
const columnas = (n, max) => {
  for (let c = Math.min(n, max); c >= 1; c--) if (n % c === 0) return c
  return 1
}

const rejilla = (items, max, render) =>
  `<div class="rejilla" style="--cols:${columnas(items.length, max)}">`
  + items.map(render).join('') + '</div>'

/**
 * El CSS que comparten TODAS las paginas estaticas del sitio.
 *
 * Se saco del cuerpo de `pagina()` el 2026-09-25 para que la plantilla de
 * articulos del blog lo use tal cual. La alternativa era copiar 134 lineas de
 * CSS a un segundo archivo, y una copia de CSS no falla cuando diverge: las
 * dos paginas siguen viendose bien, solo que ya no se parecen entre si.
 *
 * Recibe el color de acento porque es lo unico que cambia entre paginas.
 */
export const estilos = (color) => `
:root{
  --color:${color};
  --fondo:#08080c; --alto:#0c0c12; --tarjeta:#101018; --elevado:#16161f;
  --borde:rgba(255,255,255,.08); --borde2:rgba(255,255,255,.14);
  --texto:#f5f5f7; --medio:#c4c4cf; --suave:#a1a1ae; --tenue:#8a8a99;
  --display:'Space Grotesk',system-ui,sans-serif; --cuerpo:'DM Sans',system-ui,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:90px}
body{background:var(--fondo);color:var(--texto);font-family:var(--cuerpo);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.contenedor{width:100%;max-width:1180px;margin:0 auto;padding:0 24px}
.contenedor-estrecho{max-width:780px}

/* ── Barra ─────────────────────────────────────────────────────────────── */
.barra{position:sticky;top:0;z-index:50;background:rgba(8,8,12,.86);backdrop-filter:blur(14px);border-bottom:1px solid var(--borde)}
.barra-caja{display:flex;align-items:center;justify-content:space-between;gap:20px;height:72px}
.barra-izq{display:flex;align-items:center;gap:14px;min-width:0}
.barra-volver{display:inline-flex;align-items:center;gap:6px;color:var(--tenue);font-size:.82rem;white-space:nowrap;transition:color .28s}
.barra-volver:hover{color:var(--texto)}
.barra-sep{width:1px;height:22px;background:var(--borde2);flex-shrink:0}
.barra-marca{display:flex;align-items:center;gap:9px;min-width:0}
.barra-marca img{height:30px;width:auto;flex-shrink:0}
.barra-marca strong{font-family:var(--display);font-weight:700;font-size:1.12rem;letter-spacing:-.03em;color:var(--color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.barra-menu{display:flex;align-items:center;gap:26px}
.barra-menu a{color:var(--suave);font-size:.88rem;transition:color .28s}
.barra-menu a:hover{color:var(--texto)}
.barra-acciones{display:flex;align-items:center;gap:12px;flex-shrink:0}

/* ── Botones ───────────────────────────────────────────────────────────── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;border-radius:10px;font-family:var(--display);font-weight:600;font-size:.92rem;transition:transform .2s,box-shadow .28s,background .28s;white-space:nowrap}
.btn-principal{background:var(--color);color:#08080c;box-shadow:0 8px 28px -12px var(--color)}
.btn-principal:hover{transform:translateY(-2px);box-shadow:0 14px 36px -12px var(--color)}
.btn-fantasma{border:1px solid var(--borde2);color:var(--texto)}
.btn-fantasma:hover{border-color:var(--color);color:var(--color)}
.btn-barra{padding:9px 18px;font-size:.86rem}

/* ── Secciones ─────────────────────────────────────────────────────────── */
.seccion{padding:88px 0;position:relative}
.seccion-alta{background:var(--alto)}
.rotulo{font-family:var(--display);font-weight:600;font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;color:var(--color);margin-bottom:14px}
.titulo-seccion{font-family:var(--display);font-weight:700;font-size:clamp(1.7rem,3.4vw,2.5rem);letter-spacing:-.03em;line-height:1.15;margin-bottom:18px}
.entradilla{color:var(--suave);font-size:1.03rem;max-width:62ch;margin-bottom:44px}

/* ── Hero ──────────────────────────────────────────────────────────────── */
.hero{padding:96px 0 84px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:-40% 30% auto -10%;height:620px;background:radial-gradient(60% 60% at 30% 40%,color-mix(in srgb,var(--color) 22%,transparent),transparent 70%);filter:blur(30px);pointer-events:none}
.hero-caja{position:relative;max-width:820px}
.hero-marca{display:inline-flex;align-items:center;gap:9px;padding:7px 15px;border-radius:999px;border:1px solid color-mix(in srgb,var(--color) 34%,transparent);background:color-mix(in srgb,var(--color) 11%,transparent);color:var(--color);font-family:var(--display);font-weight:600;font-size:.79rem;letter-spacing:.04em;margin-bottom:26px}
.hero h1{font-family:var(--display);font-weight:700;font-size:clamp(2.1rem,5.2vw,3.7rem);letter-spacing:-.04em;line-height:1.06;margin-bottom:22px}
.hero p{color:var(--medio);font-size:clamp(1.02rem,1.5vw,1.16rem);max-width:64ch;margin-bottom:34px}
.hero-acciones{display:flex;flex-wrap:wrap;gap:12px}

/* ── Cifras ────────────────────────────────────────────────────────────── */
.cifras{display:grid;gap:1px;background:var(--borde);border:1px solid var(--borde);border-radius:16px;overflow:hidden;margin-top:54px}
.cifra{background:var(--tarjeta);padding:26px 24px}
.cifra b{display:block;font-family:var(--display);font-weight:700;font-size:clamp(1.5rem,2.6vw,2rem);letter-spacing:-.03em;color:var(--color);line-height:1.1}
.cifra span{display:block;color:var(--tenue);font-size:.85rem;margin-top:7px}

/* ── Rejilla pareja ────────────────────────────────────────────────────── */
.rejilla{display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:18px}
.tarjeta{background:var(--tarjeta);border:1px solid var(--borde);border-radius:16px;padding:26px 24px;transition:border-color .3s,transform .3s}
.tarjeta:hover{border-color:color-mix(in srgb,var(--color) 40%,transparent);transform:translateY(-3px)}
.tarjeta h3{font-family:var(--display);font-weight:600;font-size:1.03rem;letter-spacing:-.02em;margin-bottom:9px}
.tarjeta p{color:var(--suave);font-size:.93rem}
.detalle{padding:20px 22px 20px 26px;border-left:2px solid color-mix(in srgb,var(--color) 45%,transparent)}
.detalle h3{font-family:var(--display);font-weight:600;font-size:.99rem;margin-bottom:8px}
.detalle p{color:var(--suave);font-size:.91rem}

/* ── Problema ──────────────────────────────────────────────────────────── */
.problema-caja{background:var(--tarjeta);border:1px solid var(--borde);border-radius:20px;padding:38px}
.problema-caja > p{color:var(--suave);margin-bottom:26px;max-width:72ch}
.puntos{list-style:none;display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:12px 26px}
.puntos li{display:flex;gap:11px;align-items:flex-start;color:var(--medio);font-size:.93rem}
.puntos li::before{content:'';flex-shrink:0;width:6px;height:6px;border-radius:2px;background:var(--color);margin-top:9px;transform:rotate(45deg)}

/* ── Pasos ─────────────────────────────────────────────────────────────── */
.pasos{list-style:none;counter-reset:p;display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:22px}
.pasos li{counter-increment:p;position:relative;padding-top:52px}
.pasos li::before{content:counter(p,decimal-leading-zero);position:absolute;top:0;left:0;font-family:var(--display);font-weight:700;font-size:1.7rem;color:color-mix(in srgb,var(--color) 55%,transparent)}
.pasos h3{font-family:var(--display);font-weight:600;font-size:1.02rem;margin-bottom:8px}
.pasos p{color:var(--suave);font-size:.93rem}

/* ── Preguntas ─────────────────────────────────────────────────────────── */
details{border-bottom:1px solid var(--borde);padding:19px 0}
details summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:18px;font-family:var(--display);font-weight:600;font-size:1rem}
details summary::-webkit-details-marker{display:none}
details summary::after{content:'+';color:var(--color);font-size:1.3rem;font-weight:400;flex-shrink:0;transition:transform .25s}
details[open] summary::after{transform:rotate(45deg)}
details p{color:var(--suave);font-size:.94rem;margin-top:13px;max-width:72ch}

/* ── Otras funcionalidades ─────────────────────────────────────────────── */
.otra{display:block;background:var(--tarjeta);border:1px solid var(--borde);border-radius:16px;padding:22px;transition:border-color .3s,transform .3s}
.otra:hover{transform:translateY(-3px)}
.otra b{display:block;font-family:var(--display);font-weight:600;font-size:1rem;margin-bottom:6px}
.otra span{color:var(--tenue);font-size:.88rem}

/* ── Cierre ────────────────────────────────────────────────────────────── */
.cierre{text-align:center;padding:96px 0}
.cierre h2{font-family:var(--display);font-weight:700;font-size:clamp(1.7rem,3.6vw,2.6rem);letter-spacing:-.03em;margin-bottom:16px}
.cierre p{color:var(--suave);max-width:58ch;margin:0 auto 32px}
.acciones{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}

/* ── Pie ───────────────────────────────────────────────────────────────── */
.pie{border-top:1px solid var(--borde);padding:34px 0;color:var(--tenue);font-size:.85rem}
.pie-caja{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center}
.pie a{color:var(--suave)}
.pie a:hover{color:var(--texto)}

/* ── Revelado al hacer scroll ──────────────────────────────────────────────
   ⚠️ Solo se oculta si la clase 'js' está puesta, y la pone el propio script.
   Sin esa guarda, un fallo de JS dejaría la página ENTERA invisible — con un
   200 y sin ningún error a la vista. */
.js .revelar{opacity:0;transform:translateY(16px)}
.js .revelar.visible{opacity:1;transform:none;transition:opacity .6s ease,transform .6s cubic-bezier(.22,1,.36,1)}
@media(prefers-reduced-motion:reduce){
  .js .revelar{opacity:1!important;transform:none!important}
  html{scroll-behavior:auto}
}

@media(max-width:1000px){ .barra-menu{display:none} }
@media(max-width:860px){
  .rejilla,.puntos,.pasos{--cols:1!important}
  .cifras{grid-template-columns:1fr!important}
  .seccion{padding:64px 0}
  .problema-caja{padding:26px}
}
@media(max-width:640px){
  .barra-volver span{display:none}
  .barra-marca strong{font-size:1rem}
  .acciones .btn,.hero-acciones .btn{width:100%}
}
@media(max-width:420px){ .barra-marca{display:none} }
`

export function pagina(f, otras, opciones) {
  const { base, volver, distintivo, tituloOtras, segundoBoton } = opciones

  /* ⚠️ `base` puede venir VACÍO desde el 2026-09-25: las páginas de primer
     nivel (/precios/, /nosotros/, /contacto/…) no cuelgan de ninguna familia.
     Con el `${SITIO}/${base}/${slug}/` de antes, un base vacío producía
     `https://zyntello.com//precios/` — doble barra. Y una doble barra no
     rompe nada: el servidor la sirve igual, pero para Google es OTRA URL, así
     que el canonical apuntaría a una dirección distinta de la que enlaza el
     sitio y las dos se repartirían la fuerza. */
  const rutaDe = (slug) => base ? `${SITIO}/${base}/${slug}/` : `${SITIO}/${slug}/`

  /* El enlace de «volver» de una familia va a su ancla de la portada; el de una
     página suelta lo dice ella, porque `#` a secas no lleva a ninguna parte. */
  const anclaVolver = opciones.anclaVolver || `${SITIO}/#${base}`

  /* ⚠️ El segundo botón del hero NO puede ser siempre «Probar el demo»:
     ofrecer un demo de una consultoría electoral o de una venta de equipos
     suena a que no se leyó lo que se está vendiendo. Cada familia —y cada
     página, si hace falta— dice cuál es el suyo. */
  const boton2 = f.segundoBoton || segundoBoton
  const waTexto = encodeURIComponent(
    `¡Hola Zyntello! Quiero saber más sobre ${f.nombre}. ¿Me ayudan?`)

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(f.nombre)} — ${esc(f.subtitulo)} | Zyntello</title>
<meta name="description" content="${esc(f.resumen)}">
<link rel="canonical" href="${rutaDe(f.slug)}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(f.nombre)} — ${esc(f.subtitulo)} | Zyntello">
<meta property="og:description" content="${esc(f.resumen)}">
<meta property="og:url" content="${rutaDe(f.slug)}">
<meta property="og:image" content="${SITIO}/logos/zyntello_isotipo_transparente.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${SITIO}/logos/zyntello_isotipo_transparente.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  /* ⚠️ `ContactPage`, `AboutPage`… le dicen a Google QUÉ clase de página es,
     no solo que es una página. Es lo que hace que «Zyntello contacto» pueda
     devolver la de contacto en vez de la portada. Por defecto, `WebPage`. */
  '@type': f.tipoSchema || 'WebPage',
  name: `${f.nombre} — ${f.subtitulo}`,
  description: f.resumen,
  url: rutaDe(f.slug),
  isPartOf: { '@type': 'WebSite', name: 'Zyntello', url: SITIO },
  publisher: { '@type': 'Organization', name: 'Zyntello, S.R.L.', url: SITIO },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: f.faq.map(p => ({
      '@type': 'Question', name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  },
}, null, 2)}
</script>
<style>
${estilos(f.color).trim()}
</style>
</head>
<body>

<nav class="barra">
  <div class="contenedor barra-caja">
    <div class="barra-izq">
      <a class="barra-volver" href="${anclaVolver}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
        <span>${volver}</span>
      </a>
      <span class="barra-sep" aria-hidden="true"></span>
      <span class="barra-marca">
        <img src="${SITIO}/logos/zyntello_isotipo_transparente.png" alt="" width="30" height="30">
        <strong>${esc(f.nombre)}</strong>
      </span>
    </div>

    <nav class="barra-menu" aria-label="Secciones de la página">
      <a href="#resuelve">Lo que resuelve</a>
      <a href="#como">Cómo funciona</a>
      <a href="#detalles">Detalles</a>
      <a href="#preguntas">Preguntas</a>
    </nav>

    <div class="barra-acciones">
      <a href="https://wa.me/${WHATSAPP}?text=${waTexto}" target="_blank" rel="noopener" class="btn btn-principal btn-barra">Hablar con Zyntello</a>
    </div>
  </div>
</nav>

<header class="hero">
  <div class="contenedor">
    <div class="hero-caja">
      <span class="hero-marca">${distintivo}</span>
      <h1>${esc(f.heroTitulo)}</h1>
      <p>${esc(f.heroBajada)}</p>
      <div class="hero-acciones">
        <a href="https://wa.me/${WHATSAPP}?text=${waTexto}" target="_blank" rel="noopener" class="btn btn-principal">Hablar con Zyntello</a>
        <a href="${boton2.href}" class="btn btn-fantasma">${esc(boton2.texto)}</a>
      </div>
    </div>

    <div class="cifras" style="grid-template-columns:repeat(${f.cifras.length},minmax(0,1fr))">
      ${f.cifras.map(c => `<div class="cifra"><b>${esc(c.valor)}</b><span>${esc(c.etiqueta)}</span></div>`).join('')}
    </div>
  </div>
</header>

<section class="seccion seccion-alta" id="resuelve">
  <div class="contenedor">
    <p class="rotulo revelar">Lo que resuelve</p>
    <h2 class="titulo-seccion revelar">${esc(f.problema.titulo)}</h2>
    <div class="problema-caja revelar">
      <p>${esc(f.problema.texto)}</p>
      <ul class="puntos" style="--cols:${columnas(f.problema.puntos.length, 2)}">
        ${f.problema.puntos.map(p => `<li>${esc(p)}</li>`).join('')}
      </ul>
    </div>
  </div>
</section>

<section class="seccion">
  <div class="contenedor">
    <p class="rotulo revelar">Lo que incluye</p>
    <h2 class="titulo-seccion revelar">Lo que trae, en concreto</h2>
    ${rejilla(f.beneficios, 3, (b, i) =>
      `<article class="tarjeta revelar" style="transition-delay:${i * 60}ms"><h3>${esc(b.titulo)}</h3><p>${esc(b.descripcion)}</p></article>`)}
  </div>
</section>

<section class="seccion seccion-alta" id="como">
  <div class="contenedor">
    <p class="rotulo revelar">Cómo funciona</p>
    <h2 class="titulo-seccion revelar">En tres pasos</h2>
    <ol class="pasos revelar" style="--cols:${columnas(f.pasos.length, 3)}">
      ${f.pasos.map(p => `<li><h3>${esc(p.titulo)}</h3><p>${esc(p.descripcion)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="seccion" id="detalles">
  <div class="contenedor">
    <p class="rotulo revelar">En el detalle</p>
    <h2 class="titulo-seccion revelar">Lo que se nota al usarlo cada día</h2>
    ${rejilla(f.detalles, 3, (d, i) =>
      `<article class="tarjeta detalle revelar" style="transition-delay:${i * 60}ms"><h3>${esc(d.titulo)}</h3><p>${esc(d.descripcion)}</p></article>`)}
  </div>
</section>

<section class="seccion seccion-alta">
  <div class="contenedor">
    <p class="rotulo revelar">Para quién</p>
    <h2 class="titulo-seccion revelar">Te va a servir si…</h2>
    ${rejilla(f.publico, 3, (p, i) =>
      `<article class="tarjeta revelar" style="transition-delay:${i * 60}ms"><h3>${esc(p.titulo)}</h3><p>${esc(p.descripcion)}</p></article>`)}
  </div>
</section>

<section class="seccion" id="preguntas">
  <div class="contenedor contenedor-estrecho">
    <p class="rotulo revelar">Dudas habituales</p>
    <h2 class="titulo-seccion revelar">Preguntas</h2>
    <div class="revelar">
      ${f.faq.map(p => `<details><summary>${esc(p.pregunta)}</summary><p>${esc(p.respuesta)}</p></details>`).join('')}
    </div>
  </div>
</section>

<section class="seccion seccion-alta">
  <div class="contenedor">
    <p class="rotulo revelar">Y además</p>
    <h2 class="titulo-seccion revelar">${tituloOtras}</h2>
    ${rejilla(otras, 3, (o) =>
      `<a class="otra revelar" href="${rutaDe(o.slug)}" style="border-left:2px solid ${o.color}"><b>${esc(o.nombre)}</b><span>${esc(o.subtitulo)}</span></a>`)}
  </div>
</section>

<section class="cierre">
  <div class="contenedor">
    <h2>¿Lo vemos con tus datos?</h2>
    <p>Te enseñamos ${esc(f.nombre)} funcionando sobre un caso parecido al tuyo, sin compromiso.</p>
    <div class="acciones">
      <a href="https://wa.me/${WHATSAPP}?text=${waTexto}" target="_blank" rel="noopener" class="btn btn-principal">Hablar con Zyntello</a>
      <a href="tel:+1${WHATSAPP.slice(1)}" class="btn btn-fantasma">Llamar al +1 829 639 9877</a>
    </div>
  </div>
</section>

<footer class="pie">
  <div class="contenedor pie-caja">
    <span>© ${new Date().getFullYear()} Zyntello, S.R.L. · República Dominicana</span>
    <span>
      <a href="${SITIO}/#soluciones">Módulos</a> ·
      <a href="${SITIO}/precios/">Precios</a> ·
      <a href="${SITIO}/blog/">Blog</a> ·
      <a href="${SITIO}/nosotros/">Nosotros</a> ·
      <a href="${SITIO}/contacto/">Contacto</a> ·
      <a href="mailto:soporte@zyntello.com">soporte@zyntello.com</a>
    </span>
  </div>
</footer>

<script>
/* ⚠️ La clase 'js' la pone el propio script: si esto no llega a ejecutarse,
   '.revelar' nunca se oculta y la página se ve entera. Al revés —ocultar por
   CSS y mostrar por JS— un fallo dejaría la página en blanco con un 200. */
document.documentElement.classList.add('js');
var obs = new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.revelar').forEach(function (el) { obs.observe(el); });
</script>
</body>
</html>
`
}
