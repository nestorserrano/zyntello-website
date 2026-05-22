# Zyntello Website — Blueprint Técnico Completo

> **Repo:** `nestorserrano/zyntello-website`
> **Directorio local:** `c:/wamp64/www/zyntello/`
> **URL producción:** `https://zyntello.com`
> **Hosting:** Bluehost Shared Hosting — `public_html/zyntello/` (solo archivos estáticos de `dist/`)
> **Versión del documento:** Mayo 2026

---

## ⚠️ LEER ANTES DE TOCAR CUALQUIER ARCHIVO

Este documento describe la arquitectura, convenciones y estado actual del sitio web de Zyntello.
El sitio es **100% marketing** — no tiene backend, no se conecta directamente a la BD, no tiene autenticación.
Es el punto de entrada para prospectos que luego van a `app.zyntello.com`.

---

## 1. Descripción del producto

Landing page pública de Zyntello, S.R.L. Muestra:
- **Servicios** que ofrece la empresa (implementaciones, soporte TI, marketing, etc.)
- **Soluciones SaaS** — módulos del ERP disponibles para suscripción, con precios en tiempo real
- **Portafolio** de proyectos realizados
- **Quiénes somos** (nosotros)
- **Contacto** (Web3Forms → email)

**Flujo del visitante:**
```
zyntello.com → ve los módulos y precios → "Contratar" → modal de contratación
→ elige plan (mensual/anual) y método de pago (Stripe/PayPal/transferencia)
→ redirige a app.zyntello.com/checkout?modulo=crm&plan=mensual&price_id=price_xxx...
```

---

## 2. Stack técnico

| Componente | Tecnología |
|---|---|
| Framework | React 19 + Vite 8 |
| CSS | Bootstrap 5 (dark) + CSS custom en `src/styles/` |
| Animaciones | CSS transitions, canvas animado (`NeuralBackground.jsx`) |
| Formulario contacto | Web3Forms (sin backend propio) |
| Íconos | Bootstrap Icons via CDN |
| Build | Vite → `dist/` committed al repo |
| Deploy | cPanel Git Version Control (`.cpanel.yml`) → copia `dist/` |
| Variables de entorno | `.env` (local) y `.env.production` (build) — no commitear `.env` |

---

## 3. Estructura de archivos

```
c:/wamp64/www/zyntello/
├── index.html                    ← Entry point HTML de Vite
├── vite.config.js                ← Config Vite
├── package.json                  ← Dependencias
├── .env                          ← Local (gitignored) — VITE_ADMIN_URL=http://...
├── .env.production               ← Build producción — VITE_ADMIN_URL=https://admin.zyntello.com
├── src/
│   ├── main.jsx                  ← Punto de entrada React
│   ├── App.jsx                   ← Componente raíz, scroll snap entre secciones
│   ├── App.css                   ← Estilos globales dark
│   ├── index.css                 ← Reset + variables CSS
│   ├── components/
│   │   ├── Navbar.jsx            ← Navegación fija con scroll spy
│   │   ├── Hero.jsx              ← Sección inicio (#inicio) — canvas + stats
│   │   ├── Servicios.jsx         ← Sección #servicios — 10 servicios de la empresa
│   │   ├── Soluciones.jsx        ← Sección #soluciones — módulos SaaS (608 líneas aprox)
│   │   ├── PorQueZyntello.jsx    ← Sección #porque — diferenciadores
│   │   ├── Portafolio.jsx        ← Sección #portafolio — proyectos realizados
│   │   ├── Nosotros.jsx          ← Sección #nosotros — equipo + valores
│   │   ├── Contacto.jsx          ← Sección #contacto — formulario Web3Forms
│   │   ├── Footer.jsx            ← Pie de página
│   │   ├── WhatsAppChat.jsx      ← Widget chatbot WhatsApp
│   │   └── NeuralBackground.jsx  ← Canvas animado del Hero (nodos + conexiones)
│   ├── styles/
│   │   └── Soluciones.css        ← Estilos específicos de la sección Soluciones
│   ├── hooks/
│   │   └── (hooks custom si existen)
│   └── assets/                   ← Imágenes, logos
├── public/
│   └── logos/                    ← SVGs de logos (también en dist/)
└── dist/                         ← Build de producción (commitear SIEMPRE antes del push)
    ├── index.html
    ├── assets/
    └── logos/
```

---

## 4. Arquitectura de la sección Soluciones (más compleja)

### Flujo de datos
```
admin.zyntello.com/api/modulos (JSON público)
        ↓  (fetch en useEffect)
Soluciones.jsx — setModulos(data)
        ↓
modulos.map(apiData => combinarModulo(apiData))
        ↓
apps[] — estado React con todos los datos enriquecidos
        ↓
Renderizado de tarjetas (grid con skeleton mientras carga)
```

### Funciones clave en Soluciones.jsx

| Función | Línea aprox. | Descripción |
|---|---|---|
| `combinarModulo(apiData)` | ~100 | Mezcla datos del API con metadatos visuales locales (`MODULO_META`) |
| `hexToGradiente(hex)` | ~65 | Genera gradiente CSS desde color hex |
| `irAlPago()` | ~270 | Redirige al checkout de `app.zyntello.com` con params incluyendo `price_id` |
| `Estrellas({rating})` | ~165 | Renders de estrellas (★) |
| `Previews({app})` | ~175 | Carrusel horizontal de screenshots |
| `CardModulo({app, onContratar})` | ~200 | Tarjeta individual de módulo |
| `ModalContratacion` | ~230 | Modal de contratación con formulario |

### Variables de entorno

```bash
# .env (local — gitignored)
VITE_ADMIN_URL=http://192.168.1.30/zyntello/admin/public

# .env.production (committed — usado en build)
VITE_ADMIN_URL=https://admin.zyntello.com
```

En `Soluciones.jsx`:
```js
const API_URL = `${(import.meta.env.VITE_ADMIN_URL || 'https://admin.zyntello.com').replace(/\/$/, '')}/api/modulos`
```

### Estructura de `combinarModulo(apiData)`

Qué extrae del API:
- `slug` → `id` del módulo
- `nombre`, `subtitulo`, `descripcion`
- `caracteristicas` (array)
- `precio_mensual` → `precio`
- `precio_mensual_anual` → `precioAnual`
- `ahorro_pct` → `ahorroAnual`
- `color_primario` → `color`
- `stripe_mensual` → `stripeMensual`
- `stripe_anual` → `stripeAnual`
- `estado`, `disponible`, `bundle`, `url`, `moneda`

Qué viene de `MODULO_META[slug]` (datos locales fijos):
- `icono` (emoji)
- `gradiente` CSS string
- `rating`, `reviews`
- `previews` (screenshots)
- `categoria`
- `etiqueta` (badge)

### Checkout URL — formato

```
https://app.zyntello.com/checkout?modulo=crm&plan=mensual&nombre=Juan&email=j@a.com
  &empresa=Mi+empresa&telefono=829xxxxxx&metodo=stripe&price_id=price_xxxxx
```

El parámetro `price_id` se agrega **solo si** `metodo === 'stripe'` y hay un Stripe Price ID para el plan elegido.

---

## 5. Servicios de la empresa (Servicios.jsx)

10 servicios fijos (hardcodeados — no vienen de API):
1. Automatización con IA
2. ERP y CRM (Softland, Profit)
3. Soporte TI
4. Colocación de Personal
5. Venta de Equipos
6. Transformación Digital
7. Consultoría Contable
8. Marketing Digital
9. Consultoría Electoral
10. Encuestas & Estudios

---

## 6. Formulario de contacto

**Proveedor:** Web3Forms (servicio externo, sin servidor propio)
**Access Key:** `d27d70b8-3963-46b4-aac4-7086a3d20f05`
**Destino:** `info@zyntello.com`
**Archivo:** `src/components/Contacto.jsx`

El formulario envía POST a `https://api.web3forms.com/submit`. No hay endpoint de backend.

---

## 7. Convenciones de desarrollo

| Regla | Valor |
|---|---|
| Scroll snap | `scroll-snap-type: y mandatory` en `App.jsx`; cada sección `min-height: 100vh; scroll-snap-align: start` |
| Idioma del código | Todo en español — comentarios, variables de negocio, textos UI |
| `dist/` | **SIEMPRE commitear** antes del push (Bluehost no tiene Node.js para hacer build) |
| `.env` | En `.gitignore`. Crear manualmente al clonar el repo |
| `.env.production` | Está en el repo (sin secrets) — solo contiene `VITE_ADMIN_URL` |
| Paleta | Dark Bootstrap: `#0d1117` fondo, `#7c3aed` primario, `#94a3b8` texto secundario |

---

## 8. Deploy — proceso completo

```powershell
# 1. Hacer cambios en src/
# 2. Hacer build de producción
& 'C:\Program Files\nodejs\node.exe' 'C:\Users\Sistemas\AppData\Roaming\npm\node_modules\npm\bin\npm-cli.js' run build

# 3. Verificar que dist/ tiene los nuevos assets
# 4. Commitear INCLUYENDO dist/
git add src/ dist/
git commit -m "Descripción del cambio"

# 5. Push a GitHub
git push origin master

# 6. En Bluehost cPanel → Git Version Control → zyntello-website
#    → Update from Remote → Deploy HEAD Commit
# (el .cpanel.yml copia dist/ a public_html/zyntello/)
```

**Configuración `.cpanel.yml`:**
```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home4/ukrmeumy/public_html/zyntello/
    - /bin/cp -R dist/* $DEPLOYPATH
```

---

## 9. Desarrollo local

```powershell
cd c:\wamp64\www\zyntello
npm install   # primera vez
npm run dev   # servidor en localhost:5173

# Con puerto específico:
npm run dev -- --port 4000
```

**URL local:** `http://localhost:5173`

---

## 10. Estado actual y próximos sprints

### Estado actual (2026-05-22)
- ✅ Sitio completamente funcional en producción
- ✅ Sección Soluciones carga módulos dinámicamente desde `admin.zyntello.com/api/modulos`
- ✅ Tarjetas con header rico: icono + nombre + subtítulo + categoría + badge
- ✅ Skeleton loading mientras carga la API
- ✅ Manejo de error si la API no responde (fallback a mensaje)
- ✅ Checkout pasa `price_id` de Stripe al hacer clic en "Contratar" con Stripe
- ✅ Alturas uniformes en las tarjetas (`flex-direction: column`)
- ⚠️ `app.zyntello.com/checkout` aún no implementado en `zyntello-app` (ve próximos sprints)

### Próximos sprints website
1. **Checkout en app**: implementar `app.zyntello.com/checkout` que recibe los params de la URL, crea la sesión de Stripe Checkout con el `price_id`, y redirige al payment link de Stripe.
2. **Página de precios dedicada**: separar la sección de precios del grid de módulos para mejor SEO.
3. **Blog / recursos**: sección de artículos para SEO.

---

## 11. Integración con el ecosistema

| Punto de integración | Detalle |
|---|---|
| `admin.zyntello.com/api/modulos` | API pública CORS-libre, retorna módulos activos con precios y Stripe IDs |
| `app.zyntello.com/checkout` | Destino del botón "Contratar" — recibe params en URL query string |
| `app.zyntello.com/{slug}` | URL base de cada módulo (demo/acceso) |
| `app.zyntello.com/demo/events` | URL específica para el módulo Events |

---

## 12. Archivos críticos — coordenadas para navegar

| Qué hacer | Archivo |
|---|---|
| Cambiar precios o añadir módulo | `admin.zyntello.com` → Módulos → Editar (no tocar el website) |
| Cambiar datos visuales de tarjeta | `src/components/Soluciones.jsx` → constante `MODULO_META[slug]` |
| Cambiar el flujo de contratación | `src/components/Soluciones.jsx` → función `irAlPago()` |
| Cambiar el formulario de contacto | `src/components/Contacto.jsx` |
| Cambiar la animación del Hero | `src/components/NeuralBackground.jsx` |
| Cambiar textos del Hero | `src/components/Hero.jsx` |
| Cambiar servicios | `src/components/Servicios.jsx` |
| Cambiar estilos de tarjetas | `src/styles/Soluciones.css` |
| Ver qué URL de admin usa el build | `.env.production` |
