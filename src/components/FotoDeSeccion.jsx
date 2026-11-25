/**
 * La imagen que acompaña a la cabecera de una sección, a la derecha del texto y con su misma altura.
 *
 * Pedido por el director técnico el 2026-11-24: las cabeceras dejaban medio ancho en blanco.
 *
 * ⚠️ Pesa poco a propósito («que no se vea tan cargada la página»): JPG de 900 px a ~60 KB, carga
 * diferida, y en pantallas estrechas se OCULTA (ver `.zy-intro-foto` en appicross.css). Con
 * `loading="lazy"` una imagen oculta ni siquiera se descarga, así que el teléfono no paga nada.
 *
 * ⚠️ Las fotos son de Unsplash, con su licencia (uso comercial libre, sin atribución obligatoria);
 * el autor y la página de cada una están anotados donde se usan. Ninguna lleva el logo de otra
 * empresa: se descartaron dos que mostraban la marca de un tercero en la ropa.
 *
 * `posicion` es el `object-position`: una captura de pantalla se ancla arriba a la izquierda
 * para que el recorte no se coma el título de la pantalla.
 */
export default function FotoDeSeccion({ src, alt, posicion = 'center', className = '' }) {
  return (
    <figure className={`zy-intro-foto ${className}`}>
      <img src={src} alt={alt} width="900" height="600" loading="lazy" decoding="async" style={{ objectPosition: posicion }} />
    </figure>
  )
}
