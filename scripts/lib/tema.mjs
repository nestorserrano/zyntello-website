/**
 * El script que elige el tema (claro u oscuro) ANTES de pintar, para TODAS las páginas
 * estáticas: servicios, funcionalidades, páginas sueltas, blog y legales.
 *
 * ⚠⚠ Es el MISMO criterio que el `<head>` de `index.html` (la portada React), y tiene que
 *    seguir siéndolo: manda lo que el visitante eligió con el botón sol/luna (clave
 *    `zyntello-tema`); si no eligió nada, el tema del DISPOSITIVO, y si lo cambia con la
 *    página abierta, la página cambia con él. Si una de las dos copias diverge, el visitante
 *    pasa de la portada a un servicio y la página cambia de tema sin que él haya tocado nada.
 *    (La portada no puede importar este módulo: su `index.html` lo procesa Vite, no Node.)
 *
 * ⚠️ Va en el `<head>` y bloqueante. Puesto al final, la página saldría un instante en claro
 *    y saltaría a oscuro: el destello que delata que el tema se aplicó tarde.
 */
export const SCRIPT_TEMA = `<script>
(function () {
  var raiz = document.documentElement, elegido = null
  try { elegido = localStorage.getItem('zyntello-tema') } catch (e) {}
  var oscuro = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
  function aplicar() { raiz.dataset.appearance = elegido || (oscuro && oscuro.matches ? 'dark' : 'light') }
  aplicar()
  if (oscuro && oscuro.addEventListener) oscuro.addEventListener('change', function () {
    try { elegido = localStorage.getItem('zyntello-tema') } catch (e) {}
    aplicar()
  })
})()
</script>`
