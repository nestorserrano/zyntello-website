/**
 * El encabezado, el tema y el panel de lectura de las páginas legales.
 *
 * ## Por qué vive aquí y no copiado en los seis documentos
 *
 * Los seis HTML legales están escritos a mano y son la FUENTE de la que se traducen los siete
 * idiomas. Copiar este bloque en cada uno daría 48 copias del mismo encabezado, y la primera que
 * se quedara atrás publicaría un menú legal distinto del resto — que es exactamente lo que pasó
 * con los enlaces del alta: tres copias, una sin «Avisos de terceros», y nadie lo vio.
 *
 * ## El tema se comparte con el sitio, a propósito
 *
 * ⚠️⚠️ Usa la MISMA clave de `localStorage` (`zyntello-website-appearance`) y el MISMO atributo
 * (`data-appearance`) que `src/components/Apariencia.jsx`. Con claves distintas, quien pusiera el
 * sitio en claro y abriera los Términos se encontraría la página en oscuro: no es un fallo que dé
 * error, es el sistema contradiciéndose a sí mismo delante del usuario.
 *
 * ## El tamaño del texto no se guarda en `--fs` y ya
 *
 * ⚠️ `--fs` ya existía en los documentos (15,5px) y de él cuelga todo el cuerpo. El control lo
 * multiplica por un factor, en vez de fijar píxeles, para que las proporciones del documento
 * —epígrafes, notas, tablas— se mantengan. Fijar un tamaño absoluto descuadra la jerarquía y deja
 * los títulos más pequeños que el cuerpo en el paso más grande.
 */

/** Dónde vive cada documento y cómo se llama en el menú. El orden es el del menú. */
export const MENU_LEGAL = [
  { ruta: '/terminos/',          titulo: 'Términos' },
  { ruta: '/privacidad/',        titulo: 'Política de Privacidad' },
  { ruta: '/cookies/',           titulo: 'Política de Cookies' },
  { ruta: '/sla/',               titulo: 'SLA' },
  { ruta: '/eliminacion-datos/', titulo: 'Eliminación de datos' },
  { ruta: '/avisos-terceros/',   titulo: 'Avisos de terceros' },
]

/**
 * El encabezado estándar: el mismo isotipo TRANSPARENTE y el mismo lema que la portada.
 *
 * ⚠️⚠️ El anterior era `zyntello_isotipo_blanco.svg`, que lleva el fondo blanco incrustado: sobre
 * la cabecera oscura se veía como un recuadro claro pegado al nombre, no como el logo del sitio.
 * El transparente es el que usa `Navbar.jsx`, y así las dos cabeceras son la misma.
 */
export function encabezado(rutaActual) {
  const enlaces = MENU_LEGAL
    .map(({ ruta, titulo }) => ruta === rutaActual
      ? `<a href="${ruta}" aria-current="page">${titulo}</a>`
      : `<a href="${ruta}">${titulo}</a>`)
    .join('\n        ')

  // Sin sangría en la primera línea: la regex del script sustituye desde «<a class=...»
  // y la sangría original ya está en el archivo. Incluirla aquí la duplica en cada pasada.
  return `<a class="brand" href="https://zyntello.com">
        <img src="/logos/zyntello_isotipo_transparente.png" alt="Zyntello" width="39" height="39">
        <span class="brand-txt">
          <b>Zyntello</b>
          <small>Inteligencia Artificial · ERP · Tecnología Empresarial</small>
        </span>
      </a>
      <nav>
        <a href="https://zyntello.com">Inicio</a>
        ${enlaces}
        <a href="https://zyntello.com/#contacto">Contacto</a>
      </nav>`
}

/** Los controles de lectura. Van en el propio encabezado, dentro del contenedor con márgenes. */
export const PANEL_LECTURA = `    <div class="lectura" role="group" aria-label="Opciones de lectura">
      <button type="button" class="lec-btn" data-lec="menos" aria-label="Reducir el tamaño del texto" title="Texto más pequeño">A<span>−</span></button>
      <button type="button" class="lec-btn" data-lec="reset" aria-label="Tamaño de texto normal" title="Tamaño normal">A</button>
      <button type="button" class="lec-btn" data-lec="mas" aria-label="Aumentar el tamaño del texto" title="Texto más grande">A<span>+</span></button>
      <span class="lec-sep" aria-hidden="true"></span>
      <button type="button" class="lec-btn lec-tema" data-lec="tema" aria-label="Cambiar entre tema claro y oscuro" title="Tema claro u oscuro"></button>
    </div>`

/**
 * CSS del tema claro, el panel y las correcciones de maqueta.
 *
 * ⚠️⚠️ La paleta clara NO está inventada: son las variables de `src/styles/financial-ui.css`, que
 * es la que usa el sitio en claro. Elegir aquí otros grises daría dos tonos de «claro» distintos
 * en el mismo dominio, y el salto se ve al pasar de la portada a los Términos.
 */
export const ESTILO_LECTURA = `<style>
/* ── Tema claro ───────────────────────────────────────────────────────────────
   Mismos valores que el sitio (financial-ui.css), para que no haya dos claros. */
html[data-appearance="light"]{
  color-scheme:light;
  --bg:#f4f5f7; --bg2:#f8f9fa; --card:#ffffff;
  --line:#e2e8f0; --line2:#cbd5e1;
  --tx:#202f40; --tx2:#435367; --tx3:#627185;
  --ac:#345775; --ac2:#2a4660; --warn:#8a5a00; --ok:#0f7a56;
}
html[data-appearance="light"] body{background:var(--bg);color:var(--tx2)}
html[data-appearance="light"] .brand-txt b{color:#202f40}
html[data-appearance="light"] .prevalece{background:#fff7e6;border-color:#e8c478;color:#5c4100}

/* ⚠️⚠️ Estas cuatro reglas NO son decoración: el documento traía los colores
   ESCRITOS A MANO en vez de en variables, así que al poner el tema claro el
   cuerpo se aclaraba y el encabezado y el pie se quedaban oscuros — con el
   texto, que sí había cambiado a oscuro, encima. El resultado no era feo: era
   ILEGIBLE, y solo en el tema que se acababa de añadir. Un tema claro a medias
   es peor que no tenerlo. */
html[data-appearance="light"] header{background:linear-gradient(180deg,#ffffff 0%,#f4f5f7 100%)}
html[data-appearance="light"] footer{background:#eef1f4}
html[data-appearance="light"] a:hover{color:var(--ac2)}
html[data-appearance="light"] .note b{color:#202f40}

/* ⚠️⚠️ Los SIETE textos que el documento pinta de blanco fijo. Se cazaron buscando
   «color:#fff» en la hoja, no a ojo: el título y los epígrafes quedaban en blanco
   sobre fondo claro —invisibles— y el primer vistazo solo delató dos de ellos.
   Las tablas, las notas y el control de cambios fallaban igual más abajo, donde
   no se ve sin bajar. Un tema que hay que ir corrigiendo a medida que alguien
   tropieza no está terminado. */
html[data-appearance="light"] h1,
html[data-appearance="light"] h2.sec,
html[data-appearance="light"] th,
html[data-appearance="light"] .chg td:first-child,
html[data-appearance="light"] .fgrid h4{color:#202f40}

/* ── Marca: el mismo isotipo y lema que la portada ───────────────────────────── */
.brand img{height:39px;width:auto;display:block}
.brand-txt{display:flex;flex-direction:column;line-height:1.15}
.brand-txt b{color:var(--tx);font-size:1.15rem;letter-spacing:-.3px}
.brand-txt small{color:var(--tx3);font-size:.63rem;letter-spacing:.01em}
@media (max-width:560px){ .brand-txt small{display:none} }

/* ── Panel de lectura ─────────────────────────────────────────────────────────
   En el encabezado y dentro del contenedor, no flotando: un panel fijo sobre el
   texto tapa justo lo que se está leyendo en una pantalla de teléfono. */
.lectura{display:flex;align-items:center;gap:.3rem;padding:.35rem 0 .9rem}
.lec-btn{display:inline-flex;align-items:center;justify-content:center;gap:1px;
  min-width:2.1rem;height:2.1rem;padding:0 .5rem;cursor:pointer;
  border:1px solid var(--line2);border-radius:.55rem;background:var(--card);
  color:var(--tx2);font:600 .85rem/1 inherit;font-family:inherit}
.lec-btn span{font-size:.72em;opacity:.85}
.lec-btn:hover{color:var(--ac);border-color:var(--ac)}
/* ⚠️ El foco visible NO se quita: sin él, quien navega con el teclado no sabe
   dónde está, y estos botones son justamente los de accesibilidad. */
.lec-btn:focus-visible{outline:2px solid var(--ac);outline-offset:2px}
.lec-sep{width:1px;height:1.3rem;background:var(--line2);margin:0 .25rem}

/* ── El selector de idioma, dentro de los márgenes ────────────────────────────
   ⚠️⚠️ Se inserta FUERA del «.wrap» —el marcador está detrás de su «</div>»—, así
   que no heredaba el padding lateral y quedaba pegado al borde izquierdo de la
   pantalla mientras el resto de la página sí respetaba el margen. Se le repone
   aquí el mismo «clamp» que usa «.wrap», en vez de mover el marcador, porque la
   estructura del HTML español es la fuente de las traducciones y no se toca. */
/* ⚠️⚠️ Doble clase a propósito. El generador inyecta su propio «<style>» DESPUÉS
   de este, con «.idiomas{padding:.75rem 0}»: a igual especificidad gana la última
   regla del documento, así que la de aquí se perdía y la fila seguía pegada al
   borde. Medido en producción: padding-left 0px mientras el contenedor tenía
   38,4px. «.idiomas.idiomas» pesa más sin depender de dónde cuelgue el bloque. */
.idiomas.idiomas{padding:.75rem clamp(1.25rem,3vw,2.75rem)}

/* ── Índice en el teléfono ────────────────────────────────────────────────────
   Debajo de 900px el índice deja de ser una columna y pasa a ser un bloque sobre
   el texto. Con cuarenta epígrafes eso son varias pantallas de lista antes de
   llegar al documento, así que se limita y se desplaza dentro de sí mismo. */
@media (max-width:900px){
  .toc{max-height:14rem;overflow:auto;-webkit-overflow-scrolling:touch}
  .lectura{padding-top:.1rem}
}

/* ⚠️ Respeta a quien pidió que nada se mueva: el salto suave al pulsar un
   epígrafe marea a quien tiene sensibilidad al movimiento. */
@media (prefers-reduced-motion:no-preference){ html{scroll-behavior:smooth} }
</style>`

/**
 * El script del panel. Pequeño y sin dependencias: estas páginas no cargan ningún JS.
 *
 * ⚠️⚠️ El tema se aplica ANTES de pintar (va en el «<head>», bloqueante). Puesto al final del
 * documento, la página aparecería primero en oscuro y saltaría a claro un instante después —el
 * destello blanco que delata que el tema se aplicó tarde.
 */
export const SCRIPT_TEMA_TEMPRANO = `<script>
/* Aplica el tema guardado antes del primer pintado. Misma clave que el sitio. */
try{
  var t = localStorage.getItem('zyntello-website-appearance');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.appearance = t;
  var z = parseFloat(localStorage.getItem('zyntello-legales-zoom'));
  if (z >= 0.8 && z <= 1.8) document.documentElement.style.setProperty('--fs', (15.5 * z) + 'px');
}catch(e){/* Sin almacenamiento la página se ve igual, en oscuro y a tamaño normal. */}
</script>`

export const SCRIPT_LECTURA = `<script>
(function(){
  var raiz = document.documentElement;
  var PASOS = [0.85, 1, 1.15, 1.3, 1.5];
  var BASE = 15.5;

  function leerZoom(){
    try{ var z = parseFloat(localStorage.getItem('zyntello-legales-zoom')); return isNaN(z) ? 1 : z; }
    catch(e){ return 1; }
  }
  function aplicarZoom(z){
    raiz.style.setProperty('--fs', (BASE * z) + 'px');
    try{ localStorage.setItem('zyntello-legales-zoom', z); }catch(e){}
  }
  function moverZoom(dir){
    var i = PASOS.indexOf(leerZoom());
    if (i === -1) i = 1;
    // Sin salirse del rango: por debajo no se lee y por encima el documento se desarma.
    aplicarZoom(PASOS[Math.min(Math.max(i + dir, 0), PASOS.length - 1)]);
  }
  function pintarTema(){
    var claro = raiz.dataset.appearance === 'light';
    var b = document.querySelector('.lec-tema');
    if (b) b.textContent = claro ? '\\u263E' : '\\u2600';
  }
  function cambiarTema(){
    var claro = raiz.dataset.appearance === 'light';
    raiz.dataset.appearance = claro ? 'dark' : 'light';
    try{ localStorage.setItem('zyntello-website-appearance', raiz.dataset.appearance); }catch(e){}
    pintarTema();
  }

  if (!raiz.dataset.appearance) raiz.dataset.appearance = 'dark';
  pintarTema();

  document.addEventListener('click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-lec]') : null;
    if (!b) return;
    var q = b.getAttribute('data-lec');
    if (q === 'mas') moverZoom(1);
    else if (q === 'menos') moverZoom(-1);
    else if (q === 'reset') aplicarZoom(1);
    else if (q === 'tema') cambiarTema();
  });
})();
</script>`
