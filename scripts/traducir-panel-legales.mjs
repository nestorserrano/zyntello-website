/**
 * Añade a los diccionarios legales los textos del encabezado y del panel de lectura.
 *
 *     node scripts/traducir-panel-legales.mjs
 *
 * ## Por qué hace falta
 *
 * `generar-legales.mjs` traduce buscando cada texto español en `scripts/legales/{doc}.{idioma}.json`.
 * Lo que no encuentra lo deja en español — a propósito, porque un hueco en blanco en un contrato
 * no dice «falta traducir», dice que esa obligación no existe. Pero el encabezado y el panel son
 * textos NUEVOS: sin esta pasada, las 42 páginas traducidas saldrían con el menú y los botones de
 * accesibilidad en español, y `verificar-legales.mjs` las marca en rojo con razón.
 *
 * ⚠️ El lema NO se traduce aquí: se copia de `scripts/lib/catalogo.json` (`nav.lema`), que es el
 * que usa la portada. Traducirlo por separado daría dos lemas distintos para la misma empresa en
 * el mismo idioma, y el de la portada es el bueno.
 *
 * ⚠️ Los botones del panel son solo iconos y letras, así que su `aria-label` es lo ÚNICO que oye
 * quien usa un lector de pantalla: va traducido como cualquier texto visible, no como un atributo
 * técnico.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DICCIONARIOS = join(AQUI, 'legales')
const CATALOGO = JSON.parse(readFileSync(join(AQUI, 'lib', 'catalogo.json'), 'utf8'))

const DOCS = ['terminos', 'privacidad', 'cookies', 'sla', 'eliminacion-datos', 'avisos-terceros']
const IDIOMAS = ['en', 'fr', 'it', 'zh-Hans', 'zh-Hant', 'ar', 'ht']

/** Textos del panel de lectura. El lema se añade aparte, desde el catálogo de la portada. */
const PANEL = {
  'Opciones de lectura': {
    en: 'Reading options', fr: 'Options de lecture', it: 'Opzioni di lettura',
    'zh-Hans': '阅读选项', 'zh-Hant': '閱讀選項', ar: 'خيارات القراءة', ht: 'Opsyon lekti',
  },
  'Reducir el tamaño del texto': {
    en: 'Decrease text size', fr: 'Réduire la taille du texte', it: 'Riduci la dimensione del testo',
    'zh-Hans': '缩小文字', 'zh-Hant': '縮小文字', ar: 'تصغير حجم النص', ht: 'Diminye gwosè tèks la',
  },
  'Texto más pequeño': {
    en: 'Smaller text', fr: 'Texte plus petit', it: 'Testo più piccolo',
    'zh-Hans': '更小的文字', 'zh-Hant': '更小的文字', ar: 'نص أصغر', ht: 'Tèks pi piti',
  },
  'Tamaño de texto normal': {
    en: 'Normal text size', fr: 'Taille de texte normale', it: 'Dimensione del testo normale',
    'zh-Hans': '默认文字大小', 'zh-Hant': '預設文字大小', ar: 'حجم النص الافتراضي', ht: 'Gwosè tèks nòmal',
  },
  'Tamaño normal': {
    en: 'Normal size', fr: 'Taille normale', it: 'Dimensione normale',
    'zh-Hans': '默认大小', 'zh-Hant': '預設大小', ar: 'الحجم الافتراضي', ht: 'Gwosè nòmal',
  },
  'Aumentar el tamaño del texto': {
    en: 'Increase text size', fr: 'Augmenter la taille du texte', it: 'Aumenta la dimensione del testo',
    'zh-Hans': '放大文字', 'zh-Hant': '放大文字', ar: 'تكبير حجم النص', ht: 'Ogmante gwosè tèks la',
  },
  'Texto más grande': {
    en: 'Larger text', fr: 'Texte plus grand', it: 'Testo più grande',
    'zh-Hans': '更大的文字', 'zh-Hant': '更大的文字', ar: 'نص أكبر', ht: 'Tèks pi gwo',
  },
  'Cambiar entre tema claro y oscuro': {
    en: 'Switch between light and dark theme', fr: 'Basculer entre le thème clair et sombre',
    it: 'Alterna tra tema chiaro e scuro', 'zh-Hans': '切换浅色和深色主题', 'zh-Hant': '切換淺色和深色主題',
    ar: 'التبديل بين المظهر الفاتح والداكن', ht: 'Chanje ant tèm klè ak fonse',
  },
  'Tema claro u oscuro': {
    en: 'Light or dark theme', fr: 'Thème clair ou sombre', it: 'Tema chiaro o scuro',
    'zh-Hans': '浅色或深色主题', 'zh-Hant': '淺色或深色主題', ar: 'مظهر فاتح أو داكن', ht: 'Tèm klè oswa fonse',
  },
  // Del menú: los demás ya estaban en los diccionarios de antes.
  'Términos': {
    en: 'Terms', fr: 'Conditions', it: 'Termini',
    'zh-Hans': '服务条款', 'zh-Hant': '服務條款', ar: 'الشروط', ht: 'Kondisyon',
  },
}

const LEMA = 'Inteligencia Artificial · ERP · Tecnología Empresarial'

/**
 * Los nombres del menú ya están traducidos en algunos diccionarios y en otros no, porque cada
 * documento tiene el suyo y el menú antes no los nombraba a todos.
 *
 * ⚠️ Se PROPAGAN entre diccionarios del mismo idioma en vez de escribirlos a mano: inventar aquí
 * «Cookie Policy» cuando `cookies.en.json` ya dice otra cosa daría dos nombres para el mismo
 * documento según desde qué página se mire el menú.
 */
const DEL_MENU = [
  'Inicio', 'Términos', 'Política de Privacidad', 'Política de Cookies', 'SLA',
  'Eliminación de datos', 'Avisos de terceros', 'Contacto',
]

/** Para cada idioma, la traducción que ya exista en cualquiera de sus diccionarios. */
const conocidas = {}

for (const idi of IDIOMAS) {
  conocidas[idi] = {}

  for (const doc of DOCS) {
    const ruta = join(DICCIONARIOS, `${doc}.${idi}.json`)
    if (!existsSync(ruta)) continue

    const dic = JSON.parse(readFileSync(ruta, 'utf8'))

    for (const texto of DEL_MENU) {
      if (dic[texto] && !conocidas[idi][texto]) conocidas[idi][texto] = dic[texto]
    }
  }
}

let escritos = 0
let anadidas = 0

for (const doc of DOCS) {
  for (const idi of IDIOMAS) {
    const ruta = join(DICCIONARIOS, `${doc}.${idi}.json`)

    if (!existsSync(ruta)) {
      console.error(`  x falta ${doc}.${idi}.json`)
      continue
    }

    const dic = JSON.parse(readFileSync(ruta, 'utf8'))
    const antes = Object.keys(dic).length

    for (const [es, trads] of Object.entries(PANEL)) {
      if (!dic[es] && trads[idi]) dic[es] = trads[idi]
    }

    for (const texto of DEL_MENU) {
      if (!dic[texto] && conocidas[idi][texto]) dic[texto] = conocidas[idi][texto]
    }

    // El lema sale del catálogo de la portada, no de aquí.
    const lema = CATALOGO[idi] && CATALOGO[idi]['nav.lema']
    if (!dic[LEMA] && lema) dic[LEMA] = lema

    const nuevas = Object.keys(dic).length - antes

    if (nuevas > 0) {
      writeFileSync(ruta, JSON.stringify(dic, null, 2) + '\n', 'utf8')
      escritos++
      anadidas += nuevas
    }
  }
}

console.log(`${anadidas} traduccion(es) anadidas en ${escritos} diccionario(s).`)
