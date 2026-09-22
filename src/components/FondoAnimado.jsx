import { useEffect, useRef } from 'react'

/**
 * Fondos animados de las secciones — dibujados por el propio sitio.
 *
 * Sustituyen a los vídeos de stock: pesan cero bytes de descarga, no dependen de
 * un archivo que puede faltar, se adaptan al ancho real de la pantalla y usan
 * los colores de la marca en vez de los de una grabación ajena.
 *
 * Tres escenas, cada una diciendo algo distinto de lo que vende Zyntello:
 *
 *   · `malla`  — nodos que se conectan y se envían paquetes. Sistemas que se
 *                hablan entre sí: ERP, CRM y lo que ya tenías, integrados.
 *   · `flujo`  — cintas que recorren la pantalla con tareas avanzando por
 *                ellas. Procesos automatizados de punta a punta.
 *   · `ondas`  — pulsos que salen de varios puntos y se expanden. Cobertura y
 *                comunicación: la sección de contacto.
 *
 * Tres frenos, todos medibles y ninguno decorativo:
 *  1. `prefers-reduced-motion` → se pinta UN fotograma y se para el bucle. Para
 *     quien tiene trastorno vestibular, un fondo en movimiento marea de verdad.
 *  2. Fuera de pantalla → se cancela el `requestAnimationFrame`. Un canvas
 *     animado que nadie ve sigue quemando batería y no lo dice nadie.
 *  3. La densidad se calcula por área: en un móvil no se dibujan 78 nodos con
 *     sus 3.003 comprobaciones de distancia por fotograma.
 *
 * ⚠️⚠️ El velo de encima NO es decorativo: es lo que sostiene el 4.5:1 del
 * texto mientras el fondo se mueve. Subirle la transparencia «para que se vea
 * mejor la animación» rompe el contraste sin que ninguna herramienta lo avise,
 * porque se mide sobre un fotograma cualquiera y el siguiente ya es otro.
 */

/* Velos. En oscuro el velo es OSCURO: sirve para lo mismo que en claro
   —sostener el contraste del texto— pero apagando el fondo, no aclarándolo. */
const VELOS = {
  indigo: 'radial-gradient(ellipse 75% 60% at 50% 42%, rgba(8,8,12,.62) 0%, rgba(8,8,12,.86) 62%, rgba(8,8,12,.96) 100%)',
  coral:  'radial-gradient(ellipse 80% 65% at 50% 45%, rgba(8,8,12,.6) 0%, rgba(8,8,12,.84) 60%, rgba(8,8,12,.96) 100%)',
  neutro: 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(8,8,12,.7) 0%, rgba(8,8,12,.9) 65%, rgba(8,8,12,.98) 100%)',
}

const INDIGO = '99, 102, 241'
const CORAL  = '251, 113, 133'
const MENTA  = '52, 211, 153'

export default function FondoAnimado({ escena = 'malla', tinte = 'indigo', velo = 1 }) {
  const refCanvas = useRef(null)

  useEffect(() => {
    const canvas = refCanvas.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let anim = null
    let visible = true
    let t = 0
    let estado = null

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return { width: width || 1, height: height || 1 }
    }

    /* ── Escena 1: malla de datos ──────────────────────────────────────── */
    const mallaSembrar = ({ width, height }) => {
      const total = Math.max(16, Math.min(70, Math.round((width * height) / 15000)))
      const nodos = Array.from({ length: total }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: 1.5 + Math.random() * 1.6,
        fase: Math.random() * Math.PI * 2,
      }))
      const paquetes = Array.from({ length: Math.max(3, Math.round(total / 7)) }, () => ({
        a: Math.floor(Math.random() * total),
        b: Math.floor(Math.random() * total),
        t: Math.random(),
        v: 0.004 + Math.random() * 0.006,
      }))
      return { nodos, paquetes }
    }

    const mallaPintar = ({ width, height }) => {
      const { nodos, paquetes } = estado
      const DIST = 165

      if (!reducido) {
        nodos.forEach(n => {
          n.x += n.vx; n.y += n.vy; n.fase += 0.02
          if (n.x < 0 || n.x > width) n.vx *= -1
          if (n.y < 0 || n.y > height) n.vy *= -1
        })
      }

      for (let i = 0; i < nodos.length; i++) {
        for (let j = i + 1; j < nodos.length; j++) {
          const a = nodos[i], b = nodos[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > DIST * DIST) continue
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(${INDIGO}, ${(1 - Math.sqrt(d2) / DIST) * 0.5})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      paquetes.forEach(p => {
        const a = nodos[p.a], b = nodos[p.b]
        if (!a || !b) return
        if (!reducido) {
          p.t += p.v
          if (p.t > 1) { p.t = 0; p.a = p.b; p.b = Math.floor(Math.random() * nodos.length) }
        }
        ctx.beginPath()
        ctx.arc(a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, 2.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${CORAL}, .95)`
        ctx.fill()
      })

      nodos.forEach(n => {
        const brillo = 0.55 + Math.sin(n.fase) * 0.3
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5)
        halo.addColorStop(0, `rgba(${INDIGO}, ${0.3 * brillo})`)
        halo.addColorStop(1, `rgba(${INDIGO}, 0)`)
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2)
        ctx.fillStyle = halo; ctx.fill()

        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${INDIGO}, ${0.55 + brillo * 0.45})`
        ctx.fill()
      })
    }

    /* ── Escena 2: cintas de proceso ───────────────────────────────────── */
    const flujoSembrar = ({ height }) => {
      const total = Math.max(4, Math.min(8, Math.round(height / 110)))
      return {
        cintas: Array.from({ length: total }, (_, i) => ({
          y: (i + 0.5) / total,
          amp: 18 + Math.random() * 34,
          periodo: 1.1 + Math.random() * 1.4,
          fase: Math.random() * Math.PI * 2,
          color: i % 3 === 0 ? MENTA : i % 2 === 0 ? CORAL : INDIGO,
          tareas: Array.from({ length: 3 }, () => ({ t: Math.random(), v: 0.0016 + Math.random() * 0.0028 })),
        })),
      }
    }

    const flujoPintar = ({ width, height }) => {
      // Cada cinta es una onda; las «tareas» son puntos que avanzan sobre ella,
      // que es lo que hace un proceso automatizado: no se mueve el tubo, se
      // mueve lo que va dentro.
      const alturaDe = (c, x) =>
        c.y * height + Math.sin(x / width * Math.PI * 2 * c.periodo + c.fase + t * 0.6) * c.amp

      estado.cintas.forEach(c => {
        ctx.beginPath()
        for (let x = 0; x <= width; x += 12) {
          const y = alturaDe(c, x)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${c.color}, .28)`
        ctx.lineWidth = 1.6
        ctx.stroke()

        c.tareas.forEach(tar => {
          if (!reducido) { tar.t += tar.v; if (tar.t > 1) tar.t = 0 }
          const x = tar.t * width
          const y = alturaDe(c, x)

          const halo = ctx.createRadialGradient(x, y, 0, x, y, 16)
          halo.addColorStop(0, `rgba(${c.color}, .45)`)
          halo.addColorStop(1, `rgba(${c.color}, 0)`)
          ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2)
          ctx.fillStyle = halo; ctx.fill()

          ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${c.color}, .95)`
          ctx.fill()
        })
      })
    }

    /* ── Escena 3: ondas de señal ──────────────────────────────────────── */
    const ondasSembrar = () => ({
      focos: [
        { x: .18, y: .28, color: INDIGO, desfase: 0 },
        { x: .74, y: .2,  color: CORAL,  desfase: 1.1 },
        { x: .52, y: .78, color: MENTA,  desfase: 2.2 },
      ],
    })

    const ondasPintar = ({ width, height }) => {
      const radioMax = Math.max(width, height) * 0.55
      const ANILLOS = 4

      estado.focos.forEach(f => {
        const cx = f.x * width
        const cy = f.y * height

        for (let i = 0; i < ANILLOS; i++) {
          // Cada anillo va un cuarto de ciclo por detrás del anterior: así el
          // pulso se lee como una señal que sale, no como un círculo que late.
          const avance = ((t * 0.16 + f.desfase + i / ANILLOS) % 1)
          ctx.beginPath()
          ctx.arc(cx, cy, avance * radioMax, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${f.color}, ${(1 - avance) * 0.42})`
          ctx.lineWidth = 1.4
          ctx.stroke()
        }

        const nucleo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26)
        nucleo.addColorStop(0, `rgba(${f.color}, .5)`)
        nucleo.addColorStop(1, `rgba(${f.color}, 0)`)
        ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2)
        ctx.fillStyle = nucleo; ctx.fill()

        ctx.beginPath(); ctx.arc(cx, cy, 3.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${f.color}, .9)`
        ctx.fill()
      })
    }

    const ESCENAS = {
      malla: { sembrar: mallaSembrar, pintar: mallaPintar },
      flujo: { sembrar: flujoSembrar, pintar: flujoPintar },
      ondas: { sembrar: ondasSembrar, pintar: ondasPintar },
    }
    const activa = ESCENAS[escena] || ESCENAS.malla

    const pintar = () => {
      const caja = canvas.getBoundingClientRect()
      const dim = { width: caja.width || 1, height: caja.height || 1 }
      ctx.clearRect(0, 0, dim.width, dim.height)
      if (!reducido) t += 0.016
      activa.pintar(dim)
      if (!reducido && visible) anim = requestAnimationFrame(pintar)
    }

    const arrancar = () => {
      if (anim) cancelAnimationFrame(anim)
      pintar()
    }

    const reiniciar = () => {
      const dim = medir()
      estado = activa.sembrar(dim)
      arrancar()
    }

    reiniciar()

    const obsTamano = new ResizeObserver(reiniciar)
    obsTamano.observe(canvas)

    const obsVista = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) arrancar()
      else if (anim) { cancelAnimationFrame(anim); anim = null }
    }, { threshold: 0 })
    obsVista.observe(canvas)

    return () => {
      if (anim) cancelAnimationFrame(anim)
      obsTamano.disconnect()
      obsVista.disconnect()
    }
  }, [escena])

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--zy-fondo)' }} />
      <canvas
        ref={refCanvas}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: VELOS[tinte] || VELOS.indigo, opacity: velo }} />
    </div>
  )
}
