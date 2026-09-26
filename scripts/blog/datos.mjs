/**
 * Todos los artículos del blog, reunidos de sus archivos por tema.
 *
 * ⚠️⚠️ QUÉ SE PUBLICA AQUÍ, Y QUÉ NO
 *
 * Solo lo que sabemos por haberlo operado. Un artículo genérico de «5 consejos
 * para elegir un ERP» no lo lee nadie, no lo posiciona Google —hay diez mil
 * iguales— y encima le dice al buscador que este sitio publica relleno.
 *
 * Cada uno sale de un problema real y medido que le ha costado dinero a
 * alguien: un comprobante rechazado, unas vacaciones pagadas dos veces, un
 * inventario que no cuadra, un margen que se lo comió la tasa. Son las
 * búsquedas que hace quien tiene el problema encima, que es exactamente el que
 * puede volverse cliente.
 *
 * ⚠️ No se inventan cifras, ni clientes, ni artículos de ley. Lo que depende
 * del país dice de qué país es, y los de materia fiscal o laboral avisan de
 * confirmar con el organismo: esa normativa cambia por resolución.
 *
 * ⚠️ Cada artículo pertenece a un `cluster` (ver `clusters.mjs`) y ese grupo
 * decide a qué landing empuja. El blog no está para tener contenido: está para
 * alimentar las páginas que se quieren posicionar.
 *
 * Formato de las secciones: cada `bloque` es un párrafo (string), o
 * `{ lista: [...] }`, o `{ aviso: '...' }`. Dentro del texto se admite HTML
 * simple —`<strong>`, `<a href>`, `<em>`— y el resto se escapa.
 */

import { FISCAL } from './fiscal.mjs'
import { NOMINA } from './nomina.mjs'
import { OPERACIONES } from './operaciones.mjs'
import { GESTION } from './gestion.mjs'

export const ARTICULOS = [...FISCAL, ...NOMINA, ...OPERACIONES, ...GESTION]
