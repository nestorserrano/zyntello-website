# Zyntello — Ecosistema SaaS

> Directorio raíz: `c:/wamp64/www/zyntello/`
> Dominio principal: zyntello.com
> Hosting: Bluehost (Shared Hosting)
> País de operación principal: República Dominicana
> Operación regional: RD, Venezuela, Colombia, Guatemala, Costa Rica, Soporte Remoto

---

## Empresa

**Zyntello, S.R.L.** es una empresa de tecnología que vende suscripciones mensuales a módulos de software empresarial (SaaS B2B). Cada módulo es una aplicación independiente disponible bajo el subdominio `app.zyntello.com/[nombre-app]`.

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
├── app/                        ← Apps SaaS (cada una es su propio repo)
│   ├── constructflow/          ← App SaaS #1 (repo: zyntello-constructflow)
│   ├── crm/                    ← App SaaS #2 (futuro)
│   ├── facturacion/            ← App SaaS #3 (futuro)
│   ├── nomina/                 ← App SaaS #4 (futuro)
│   └── encuestas/              ← App SaaS #5 (futuro)
└── CLAUDE.md                   ← Este archivo
```

> Tanto `admin/` como cada subcarpeta dentro de `app/` son repositorios Git independientes en GitHub (`nestorserrano/zyntello-*`) y están ignorados en este repo del sitio web.

---

## Estructura en Bluehost (servidor)

```
/home4/ukrmeumy/public_html/
  zyntello/
    index.html (+ assets/)      ← Sitio web principal (zyntello.com)
    admin/
      public/                   ← Document root de admin.zyntello.com
    app/                        ← Document root de app.zyntello.com
      constructflow/
        public/                 ← app.zyntello.com/constructflow
      crm/
        public/                 ← app.zyntello.com/crm (futuro)
      facturacion/
        public/                 ← app.zyntello.com/facturacion (futuro)
```

### Subdominios (cPanel → Subdomains)
| Subdominio | Document Root |
|---|---|
| zyntello.com | `public_html/zyntello/` |
| admin.zyntello.com | `public_html/zyntello/admin/public` |
| app.zyntello.com | `public_html/zyntello/app/` |

> Cada app Laravel vive en `app/[slug]/` y se accede como `app.zyntello.com/[slug]`.
> El `.htaccess` en `app/` redirige cada ruta a `[slug]/public/index.php`.

---

## Repositorios GitHub

| Proyecto | Repo | Estado |
|---|---|---|
| Sitio web | `nestorserrano/zyntello-website` | Activo |
| Admin interno | `nestorserrano/zyntello-admin` | Activo |
| ConstructFlow | `nestorserrano/zyntello-constructflow` | Activo |
| CRM | `nestorserrano/zyntello-crm` | Futuro |
| Facturación | `nestorserrano/zyntello-facturacion` | Futuro |
| Nómina | `nestorserrano/zyntello-nomina` | Futuro |
| Encuestas | `nestorserrano/zyntello-encuestas` | Futuro |

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

### Módulos Laravel (constructflow, crm, etc.)

Deploy via SSH o Git en cPanel. Cada módulo tiene su propia instrucción en su `claude.md`.

---

## Tecnologías por proyecto

| Proyecto | Stack |
|---|---|
| Sitio web | React 19 + Vite + Bootstrap 5 (dark) |
| ConstructFlow | Laravel 11 + Livewire 3 + Tailwind CSS + MySQL |
| CRM (futuro) | Laravel 11 + Livewire 3 + Tailwind CSS + MySQL |
| Facturación (futuro) | Laravel 11 + Livewire 3 + Tailwind CSS + MySQL |

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
| Admin interno | `ukrmeumi_zyntello_admin` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| ConstructFlow | `ukrmeumi_zyntello_constructflow` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| Facturación | `ukrmeumi_zyntello_facturacion` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| CRM | `ukrmeumi_zyntello_crm` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| Nómina | `ukrmeumi_zyntello_nomina` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |
| Encuestas | `ukrmeumi_zyntello_encuestas` | `ukrmeumy_zyntello_user` | `C3dul@13238162` |

**Ventajas de separar BDs:**
- Isolamiento: fallo en una app no afecta las demás
- Escalabilidad: cada app crece independientemente
- Backups granulares por aplicación
- Seguridad: credenciales compartidas pero datos separados

---

## Convenciones de trabajo

- Todo el código, comentarios, mensajes de commit y documentación en **español**
- Scroll snap entre secciones (CSS `scroll-snap-type: y mandatory`)
- Cada sección: `min-height: 100vh`, `scroll-snap-align: start`
- No usar `.gitignore` para excluir `dist/` — debe commitearse para Bluehost
- Commitear `dist/` siempre después del build antes del push
