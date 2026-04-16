# Zyntello — Ecosistema SaaS

> Directorio raíz: `c:/wamp64/www/zyntello/`
> Dominio principal: zyntello.com
> Hosting: Bluehost (Shared Hosting)
> País de operación principal: República Dominicana
> Operación regional: RD, Venezuela, Colombia, Guatemala, Costa Rica, Soporte Remoto

---

## Empresa

**Zyntello, S.R.L.** es una empresa de tecnología que vende suscripciones mensuales a módulos de software empresarial (SaaS B2B). Todos los módulos viven bajo el subdominio `app.zyntello.com` dentro de una sola app Laravel multi-tenant.

- **Correo:** info@zyntello.com
- **Teléfono:** +1 829 639 9877
- **WhatsApp:** 18296399877

---

## Estructura de carpetas

```
c:/wamp64/www/zyntello/         ← Esta carpeta (repo: zyntello-website)
├── src/                        ← Sitio web principal (React + Vite)
├── dist/                       ← Build para producción
├── admin/                      ← Panel interno Zyntello (repo: zyntello-admin)
├── app/                        ← App SaaS unificada (repo: zyntello-app)
│   └── zyntello-app/           ← Laravel multi-tenant con todos los módulos
└── CLAUDE.md                   ← Este archivo
```

> `admin/` y `app/zyntello-app/` son repositorios Git independientes en GitHub y están ignorados en este repo del sitio web.
>
> **Arquitectura:** Una sola app Laravel (`zyntello-app`) aloja TODOS los módulos SaaS bajo `app.zyntello.com`. Los módulos no son apps separadas; son rutas dentro de la misma app multi-tenant.

---

## Estructura en Bluehost (servidor)

```
/home4/ukrmeumy/public_html/
  zyntello/
    index.html (+ assets/)      ← Sitio web principal (zyntello.com)
    admin/
      public/                   ← Document root de admin.zyntello.com
    app/                        ← Contenido del repo zyntello-app (app unificada)
      public/                   ← Document root de app.zyntello.com ← MUY IMPORTANTE
        index.php
        build/
      app/
      routes/
      ...                       ← Resto de Laravel
```

### Subdominios (cPanel → Subdomains)
| Subdominio | Document Root |
|---|---|
| zyntello.com | `public_html/zyntello/` |
| admin.zyntello.com | `public_html/zyntello/admin/public` |
| app.zyntello.com | `public_html/zyntello/app/public` ← cambiar al old `app/` |

> La app Laravel unificada se despliega directamente en `zyntello/app/` (no en una subcarpeta).
> Todos los módulos (`/constructflow`, `/nomina`, etc.) son rutas de la misma app.
> El deploy via cPanel Git Version Control copia el repo `zyntello-app` a `zyntello/app/`.

---

## Repositorios GitHub

| Proyecto | Repo | Estado |
|---|---|---|
| Sitio web | `nestorserrano/zyntello-website` | Activo |
| Admin interno | `nestorserrano/zyntello-admin` | Activo |
| App unificada (todos los módulos) | `nestorserrano/zyntello-app` | Activo |
| App antigua ConstructFlow (deprecada) | `nestorserrano/zyntello-constructflow` | Archivado |

---

## Despliegue en Bluehost

### Sitio web (este repo)

Deploy via **cPanel Git Version Control**:
- `.cpanel.yml` copia `dist/*` a `/home/ukrmeumy/public_html/zyntello/`
- Pasos: Update from Remote → Deploy HEAD Commit
- Antes de hacer push: ejecutar build con PowerShell (ver abajo)

```powershell
# Comando de build en Windows (usar PowerShell, no bash)
& 'C:\Program Files\nodejs\node.exe' 'C:\Users\Sistemas\AppData\Roaming\npm\node_modules\npm\bin\npm-cli.js' run build
```

### App SaaS unificada (zyntello-app)

Deploy via **cPanel Git Version Control**:
- Repo: `nestorserrano/zyntello-app`
- Directorio destino en servidor: `/home4/ukrmeumy/public_html/zyntello/app/`
- Document root de `app.zyntello.com`: `public_html/zyntello/app/public`
- `.cpanel.yml` copia archivos, corre `php artisan migrate` y cachés automáticamente
- `vendor/` y `public/build/` están incluidos en el repo (Bluehost sin Composer/Node)
- `.env` debe existir manualmente en `/home4/ukrmeumy/public_html/zyntello/app/.env`

**Setup inicial en Bluehost (una sola vez):**
1. cPanel → Subdomains → cambiar document root de `app.zyntello.com` a `public_html/zyntello/app/public`
2. cPanel → Git Version Control → clonar `nestorserrano/zyntello-app` → directorio `public_html/zyntello/app`
3. Crear `.env` manualmente en `public_html/zyntello/app/.env` (ver `.env.production` como base)
4. Crear bases de datos en cPanel → MySQL: `ukrmeumy_zyntello_app`, `ukrmeumy_zyntello_constructflow`, `ukrmeumy_zyntello_nomina`
5. Via cPanel Terminal o phpMyAdmin: correr `php artisan migrate --force`

---

## Tecnologías por proyecto

| Proyecto | Stack |
|---|---|
| Sitio web | React 19 + Vite + Bootstrap 5 (dark) |
| App SaaS unificada | Laravel 11 + Livewire 3 + Tailwind CSS + Alpine.js + MySQL multi-BD |

---

## Módulos del sitio web (src/components/)

| Componente | Sección | Descripción |
|---|---|---|
| `Navbar.jsx` | — | Navegación fija, isotipo 52px + texto |
| `Hero.jsx` | `#inicio` | Animación neural canvas + stats |
| `Servicios.jsx` | `#servicios` | 10 servicios en grid |
| `Soluciones.jsx` | `#soluciones` | Módulos SaaS con suscripción |
| `PorQueZyntello.jsx` | `#porque` | Diferenciadores |
| `Portafolio.jsx` | `#portafolio` | Casos de éxito |
| `Nosotros.jsx` | `#nosotros` | Quiénes somos |
| `Contacto.jsx` | `#contacto` | Formulario Web3Forms |
| `WhatsAppChat.jsx` | — | Chatbot con árbol de conversación |
| `NeuralBackground.jsx` | — | Canvas animado (fondo Hero) |

### Formulario de contacto
- Proveedor: Web3Forms
- Access Key: `d27d70b8-3963-46b4-aac4-7086a3d20f05`
- Correo destino: info@zyntello.com

---

## Servicios de Zyntello (10)
1. Automatización con IA
2. ERP y CRM (Softland ERP, Profit 2K8/2K12)
3. Soporte TI
4. Colocación de Personal
5. Venta de Equipos Tecnológicos
6. Transformación Digital
7. Consultoría Contable
8. Marketing Digital
9. Consultoría Electoral
10. Encuestas & Estudios

---

## Bases de Datos (Bluehost)

**Estructura:** Cada aplicación tiene su propia BD para isolamiento de datos.

| Aplicación | Base de Datos | Usuario | Contraseña |
|---|---|---|---|
| Admin interno | `ukrmeumy_zyntello_admin` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| ConstructFlow | `ukrmeumy_zyntello_constructflow` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| Facturación | `ukrmeumy_zyntello_facturacion` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| CRM | `ukrmeumy_zyntello_crm` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| Nómina | `ukrmeumy_zyntello_nomina` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| Encuestas | `ukrmeumy_zyntello_encuestas` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |

**Ventajas de separar BDs:**
- Isolamiento: fallo en una app no afecta las demás
- Escalabilidad: cada app crece independientemente
- Backups granulares por aplicación
- Seguridad: credenciales compartidas pero datos separados

---

## ⚠️ Regla de arquitectura — LEER ANTES DE CREAR CUALQUIER MÓDULO NUEVO

> **Esta regla es definitiva y no tiene excepciones.**

Cuando el usuario pida crear una nueva aplicación SaaS, un nuevo módulo, o una nueva funcionalidad de negocio (contabilidad, CRM, facturación, encuestas, RRHH, etc.), la respuesta SIEMPRE es agregar un módulo dentro de `app/zyntello-app/`. **Nunca crear una carpeta nueva en `app/` ni un repositorio Laravel separado.**

### Por qué existe esta regla

- Ya existe una app Laravel multi-tenant en `app/zyntello-app/` con auth, billing, multi-BD, middleware de módulos y DemoSeeder.
- Crear una app separada duplicaría toda esa infraestructura sin beneficio.
- Cada empresa suscriptora accede a sus módulos contratados desde un solo login. Apps separadas romperían eso.

### Checklist para agregar un módulo nuevo (ej: `contabilidad`)

1. **Rutas** — crear `routes/modules/contabilidad.php` y registrarlo en `routes/web.php` bajo el middleware `module:contabilidad`
2. **Controladores** — crear en `app/Http/Controllers/Contabilidad/`
3. **Modelos** — crear en `app/Models/Contabilidad/` con `protected $connection = 'contabilidad';`
4. **Migraciones** — crear con `protected $connection = 'contabilidad';` en cada archivo
5. **Conexión BD** — agregar conexión `contabilidad` en `config/database.php` y variables `DB_CONTABILIDAD_*` en `.env`
6. **Base de datos local** — crear `zyntello_contabilidad` en MySQL local
7. **PricingService** — registrar el slug `contabilidad` en `App\Services\PricingService::MODULES`
8. **Vistas** — crear en `resources/views/contabilidad/`
9. **DemoSeeder** — agregar datos de ejemplo para el módulo nuevo

### Lo que NO se debe hacer

- ❌ Crear `app/contabilidad/` (carpeta en nivel de `app/`)
- ❌ Crear un nuevo repo Laravel separado para el módulo
- ❌ Agregar un nuevo subdominio para el módulo
- ❌ Crear una nueva entrada en cPanel Git Version Control

---

## Convenciones de trabajo

- Todo el código, comentarios, mensajes de commit y documentación en **español**
- Scroll snap entre secciones (CSS `scroll-snap-type: y mandatory`)
- Cada sección: `min-height: 100vh`, `scroll-snap-align: start`
- No usar `.gitignore` para excluir `dist/` — debe commitearse para Bluehost
- Commitear `dist/` siempre después del build antes del push
