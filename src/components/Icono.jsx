const ICONOS = {"flecha": "arrow-right", "check": "check", "menu": "bars", "cerrar": "xmark", "abajo": "chevron-down", "estrella": "star", "chispa": "wand-magic-sparkles", "rayo": "bolt", "nube": "cloud", "robot": "robot", "cuadricula": "table-cells-large", "codigo": "code", "salvavidas": "life-ring", "escudo": "shield-halved", "equipo": "users", "caja": "box", "brujula": "compass", "birrete": "graduation-cap", "libro": "book", "megafono": "bullhorn", "urna": "check-to-slot", "grafico": "chart-column", "servidor": "server", "ruta": "route", "diana": "bullseye", "globo": "globe", "ciclo": "rotate", "enlace": "link", "llave": "key", "subida": "chart-line", "edificio": "building", "correo": "envelope", "chat": "comment", "reloj": "clock", "telefono": "phone", "ubicacion": "location-dot"}

export default function Icono({ nombre, size = 22, titulo, className = '', style }) {
  if (!ICONOS[nombre]) return null
  return <i className={`financial-icon fa-solid fa-${ICONOS[nombre]} ${className}`}
    style={{ fontSize: size, width: size, flexShrink: 0, ...style }}
    role={titulo ? 'img' : undefined} aria-label={titulo || undefined}
    aria-hidden={titulo ? undefined : true} />
}
