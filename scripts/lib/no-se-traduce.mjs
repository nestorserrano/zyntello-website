/**
 * Lo que no se traduce en ningún idioma: nombres de software, licencias y marcas.
 *
 * ## ⚠️⚠️ Por qué es una lista y no un patrón
 *
 * Se intentó reconocerlos por su forma —«sin acentos, con mayúsculas internas, puntos o
 * guiones»— y el patrón se tragó **67 bloques de la Política de Cookies**, entre ellos párrafos
 * enteros: «No hay publicidad, ni perfilado, ni analítica de terceros.» y «Guardar la lista de
 * módulos y sus precios que ya se descargó…». No hay forma de distinguir «Laravel Framework» de
 * «Caché del catálogo» mirando la forma: las dos son dos palabras sin punto ni guion.
 *
 * Y el daño no se ve: esos bloques dejaban de contarse, así que la cobertura marcaba **100 %**
 * con párrafos sin traducir dentro. Una lista que hay que ampliar a mano molesta una vez; un
 * patrón que acierta casi siempre falla en silencio para siempre.
 *
 * ⚠️ Traducir el nombre de un componente no es solo inútil: en un documento de atribución es lo
 * que la licencia prohíbe. Quien busque «php-svg-lib» traducido no encontrará nada.
 */

/** Licencias de software, tal como las nombran sus propios textos. */
export const LICENCIAS = [
  'MIT', 'ISC', 'Apache-2.0', 'Apache-2.0 / MIT',
  'BSD-2-Clause', 'BSD-3-Clause',
  'LGPL-2.1', 'LGPL-3.0', 'LGPL-2.1 / comercial',
  'SIL Open Font License 1.1', 'SIL OFL 1.1', 'CC BY 4.0',
  'Creative Commons Attribution 4.0 International',
]

/** Nombres de paquetes, bibliotecas y herramientas. */
export const COMPONENTES = [
  // Servidor (PHP)
  'Laravel Framework', 'Livewire', 'Laravel Cashier', 'Laravel Tinker', 'laravel-dompdf',
  'Laravel Excel', 'Laravel Excel (maatwebsite)', 'League CSV', 'BaconQrCode',
  'Pusher PHP Server', 'Sentry para Laravel', 'Spatie Activitylog', 'Flux', 'Flux (Livewire)',
  'dompdf', 'php-font-lib', 'php-svg-lib', 'HTML Purifier', 'nette/utils, nette/schema',
  // Navegador
  'Alpine.js', 'Bootstrap', 'Tailwind CSS', 'Tom Select', 'SweetAlert2', 'Chart.js',
  'SortableJS', 'ZXing Browser', 'Cropper.js', 'Quill', 'vis-network', 'Axios', 'QZ Tray',
  'Laravel Echo · pusher-js', 'React · React DOM', 'Vite',
  // Tipografías
  'Font Awesome Free', 'fontawesome.com',
  // Trozos que aparecen sueltos en la tabla, separados de su nombre por una etiqueta
  'Laravel', 'Laravel Echo', 'pusher-js', 'React', 'React DOM',
  'nette/*', 'nette/utils', 'nette/schema', '(maatwebsite)', '(Livewire)',
  // Modulos de Zyntello y proveedores citados en los Terminos
  'Zyntello ERP', 'Zyntello PSA', 'Zyntello Events', 'CRM', 'Prestamello', 'Car Wash',
  'ConstructFlow', 'Stripe', 'PayPal', 'Mercado Pago', 'Stripe · PayPal · Mercado Pago',
  'WhatsApp / Meta Platforms', 'WhatsApp LLC', 'Meta Platforms, Inc.',
  'OpenStreetMap', 'Google Maps', 'HERE', 'Mapbox',
]

/**
 * ⚠️ Las etiquetas de énfasis se quitan antes de comparar: en la tabla, cada nombre va envuelto
 * en `<strong>`, y la lista guarda el nombre, no su maquetación.
 */
const sinEnfasis = (s) => s.replace(/<\/?(strong|b|em|code|span)[^>]*>/gi, '').replace(/\s+/g, ' ').trim()

const CONJUNTO = new Set([...LICENCIAS, ...COMPONENTES])

export const esNombreTecnico = (texto) => CONJUNTO.has(sinEnfasis(texto))
