import { useEffect } from 'react'

/**
 * Revelado progresivo al hacer scroll — un solo observador para toda la página.
 *
 * Marca cualquier elemento con `className="zy-revelar"` y este hook le añade
 * `zy-visible` cuando entra en pantalla. Sin librerías de animación: el
 * IntersectionObserver es nativo y no cuesta un solo kilobyte de descarga.
 *
 * ⚠️ El elemento nace OCULTO por CSS, así que si este hook no corriera la
 * página quedaría en blanco. Por eso:
 *   1. El estado oculto solo se aplica cuando la clase la pone React (el HTML
 *      servido no la trae) — y aquí revelamos de golpe si no hay
 *      IntersectionObserver.
 *   2. `prefers-reduced-motion` deja todo visible desde el CSS.
 *
 * El `MutationObserver` existe porque «Soluciones» pinta sus tarjetas cuando
 * responde el API del admin: sin él, todo lo que llega después del primer
 * render se quedaría invisible para siempre y nadie vería un error.
 */
export function useRevelar() {
  useEffect(() => {
    const revelarTodo = () =>
      document.querySelectorAll('.zy-revelar').forEach(el => el.classList.add('zy-visible'))

    if (typeof IntersectionObserver === 'undefined') {
      revelarTodo()
      return
    }

    const observador = new IntersectionObserver(
      entradas => {
        entradas.forEach(entrada => {
          if (!entrada.isIntersecting) return
          entrada.target.classList.add('zy-visible')
          observador.unobserve(entrada.target)   // una sola vez: no re-anima al volver
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )

    const registrar = () => {
      document
        .querySelectorAll('.zy-revelar:not(.zy-visible)')
        .forEach(el => observador.observe(el))
    }

    registrar()

    const mutaciones = new MutationObserver(registrar)
    mutaciones.observe(document.body, { childList: true, subtree: true })

    return () => {
      observador.disconnect()
      mutaciones.disconnect()
    }
  }, [])
}
