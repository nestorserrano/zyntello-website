/**
 * Una pantalla real de la plataforma, enmarcada como una ventana del navegador.
 *
 * ⚠️⚠️ Las imágenes salen del DEMO (app.zyntello.com/demo, «Constructora Demo SA»), nunca de la
 * cuenta de un suscriptor: lo que se publica aquí lo ve todo el mundo. Al rehacerlas, se quita la
 * franja «Modo demo» y se revisa que no quede un nombre, un correo o un RNC de alguien real.
 *
 * ⚠️ Cada imagen nueva lleva un NOMBRE nuevo (`…-2026.jpg`): el navegador y los buscadores la
 * cachean por la URL, y sustituirla con el mismo nombre deja la vieja a la vista durante días.
 *
 * `ancho`/`alto` son los de la captura (1440×900): reservan el hueco antes de que cargue la
 * imagen, así que la página no salta al llegar.
 */
export default function Captura({ src, alt, pie, enlace = false, className = '' }) {
  const imagen = <img src={src} alt={alt} width="1440" height="900" loading="lazy" decoding="async" />
  return (
    <figure className={`zy-captura ${className}`}>
      <div className="zy-captura-ventana" dir="ltr">
        <div className="zy-captura-barra" aria-hidden="true"><span /><span /><span /></div>
        {enlace ? <a href={src} target="_blank" rel="noopener">{imagen}</a> : imagen}
      </div>
      {pie && <figcaption>{pie}</figcaption>}
    </figure>
  )
}
