# Zyntello — Ecosistema SaaS

> Directorio raíz: `c:/wamp64/www/zyntello/`
> Dominio principal: zyntello.com
> Hosting: Bluehost (Shared Hosting)
> País de operación principal: República Dominicana
> Operación regional: RD, Venezuela, Colombia, Guatemala, Costa Rica, Soporte Remoto

---

## Empresa

**Zyntello, S.R.L.** es una empresa de tecnología que vende suscripciones mensuales a módulos de software empresarial (SaaS B2B). Cada módulo es una aplicación independiente disponible bajo un subdominio de `zyntello.com`.

- **Correo:** info@zyntello.com
- **Teléfono:** +1 829 639 9877
- **WhatsApp:** 18296399877

---

## Estructura de carpetas

```
c:/wamp64/www/zyntello/         ← Esta carpeta (repo: zyntello-website)
├── src/                        ← Sitio web principal (React + Vite)
├── dist/                       ← Build para producción
├── constructflow/              ← App SaaS #1 (repo: zyntello-constructflow)
├── crm/                        ← App SaaS #2 (futuro)
├── facturacion/                ← App SaaS #3 (futuro)
├── nomina/                     ← App SaaS #4 (futuro)
├── encuestas/                  ← App SaaS #5 (futuro)
└── CLAUDE.md                   ← Este archivo
```

> Cada subcarpeta de módulo es su propio repositorio Git en GitHub (`nestorserrano/zyntello-*`) y se ignora en este repo del sitio web.

---

## Estructura en Bluehost (servidor)

```
/home/ukrmeumy/public_html/
  zyntello/
    index.html (+ assets/)      ← Sitio web principal (zyntello.com)
    constructflow/
      public/                   ← Document root de constructflow.zyntello.com
    crm/
      public/                   ← Document root de crm.zyntello.com (futuro)
    facturacion/
      public/                   ← Document root de facturacion.zyntello.com (futuro)
```

### Subdominio por módulo (cPanel → Subdomains)
| Subdominio | Document Root |
|---|---|
| zyntello.com | `public_html/zyntello/` |
| constructflow.zyntello.com | `public_html/zyntello/constructflow/public` |
| crm.zyntello.com | `public_html/zyntello/crm/public` |
| facturacion.zyntello.com | `public_html/zyntello/facturacion/public` |
| nomina.zyntello.com | `public_html/zyntello/nomina/public` |

---

## Repositorios GitHub

| Proyecto | Repo | Estado |
|---|---|---|
| Sitio web | `nestorserrano/zyntello-website` | Activo |
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

## Convenciones de trabajo

- Todo el código, comentarios, mensajes de commit y documentación en **español**
- Scroll snap entre secciones (CSS `scroll-snap-type: y mandatory`)
- Cada sección: `min-height: 100vh`, `scroll-snap-align: start`
- No usar `.gitignore` para excluir `dist/` — debe commitearse para Bluehost
- Commitear `dist/` siempre después del build antes del push
