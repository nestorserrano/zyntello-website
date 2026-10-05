# Interfaz financiera

## Website

`src/styles/financial-ui.css` define las superficies y la paleta en ambos modos.
`src/components/Apariencia.jsx` guarda la preferencia de apariencia del website.
`src/components/Icono.jsx` conserva los nombres semánticos existentes y los traduce
a Font Awesome, servido desde `public/vendor/fontawesome`.

## Admin

`admin/public/css/financial-ui.css` define los tokens de superficies, texto y tarjetas.
Las vistas usan esos tokens en lugar de colores oscuros fijos. El selector del menú
ofrece Sistema, Claro y Oscuro, con persistencia local. `appearance.js` aplica el tema
antes de pintar la página. Font Awesome y Chart.js se sirven localmente.

## App

`app/zyntello-app/public/css/financial-ui.css` se carga después del CSS compilado.
El lienzo claro es `#F4F5F7`, las superficies son blancas y las tarjetas tienen borde
`#E2E8F0`. El catálogo generado de temas no se edita; se mantienen sus preferencias
de contraste y color de texto. La tarjeta financiera y el aviso demo tienen clases
semánticas: `metric-card` y `demo-notice`.

Los componentes de iconos, tarjetas financieras y navegación usan Font Awesome.

## Gráficos

Ambas aplicaciones sirven `public/js/financial-charts.js` después de Chart.js.
El plugin establece líneas de 2 px, relleno de 4.7 %, rejillas discretas y colores
adaptados al tema. Conserva datos, huecos, apilado, callbacks de formato y barras
transparentes de las cascadas. Las preferencias de movimiento reducido se respetan.
La integración utiliza la API de plugins de Chart.js:
https://github.com/chartjs/Chart.js/blob/master/docs/developers/plugins.md

Validación automatizada: `node scripts/financial-charts.test.mjs`.
Compilación website: `npm run build`.
Validación Blade en cada Laravel: `php artisan view:cache`.

Los archivos del plugin en app y admin deben mantenerse iguales; la prueba comprueba
esa condición. Los directorios `admin` y `app/zyntello-app` son repositorios Git
independientes, ignorados por el Git raíz. Cada uno requiere su commit, push y despliegue.

La revisión visual autenticada, responsive y de contraste final sigue pendiente:
la conexión al navegador Chrome no respondió durante esta sesión.
