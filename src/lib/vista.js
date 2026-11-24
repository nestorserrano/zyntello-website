/**
 * Qué página de la app React se está viendo: la portada o el catálogo de aplicaciones.
 *
 * El catálogo completo salió de la portada el 2026-11-24 (decisión del director técnico): eran
 * 35 tarjetas, unas nueve filas, y seguirá creciendo. La portada conserva un resumen y el
 * catálogo vive en `/{prefijo}aplicaciones/`.
 *
 * ⚠️⚠️ Es el MISMO bundle que la portada, a propósito. Los precios se leen en vivo del admin;
 * una página estática los grabaría al compilar y se quedarían viejos al cambiar uno en el panel,
 * y una segunda copia del catálogo en otro sitio divergiría de esta. Los HTML de cada idioma los
 * escribe `scripts/generar-portadas-idioma.mjs` después de `vite build`.
 */
export const RUTA_APLICACIONES = 'aplicaciones'

export const enAplicaciones = () =>
  typeof window !== 'undefined' &&
  window.location.pathname.split('/').filter(Boolean).includes(RUTA_APLICACIONES)

/** La portada en un idioma: `/` para el español, `/en/` para el inglés… */
export const rutaPortada = (idioma) => (idioma === 'es' ? '/' : `/${idioma}/`)

export const rutaAplicaciones = (idioma) => `${rutaPortada(idioma)}${RUTA_APLICACIONES}/`
