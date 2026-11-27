# zyntello.com — sitio web corporativo

Sitio institucional de **Zyntello, S.R.L.**, empresa dominicana de software empresarial. Presenta
la plataforma SaaS, sus módulos, las aplicaciones independientes y las formas de contacto.

🌐 **[zyntello.com](https://zyntello.com)**

---

## Qué es Zyntello

Zyntello desarrolla y opera software de gestión empresarial por suscripción. La oferta tiene tres
productos:

| Producto | Para quién | Dónde |
|---|---|---|
| **Zyntello ERP** | Empresas: contabilidad, facturación con comprobantes fiscales, nómina, inventario, cuentas por cobrar y pagar, bancos, compras, presupuesto, activos fijos, caja (POS), CRM, PSA, eventos, rutas y verticales (restaurante, car wash, condominios, préstamos) | [app.zyntello.com](https://app.zyntello.com) |
| **Zyntello Salud** | Consultorios médicos: agenda, sala de espera, consulta, receta, expediente y portal del paciente | [medicos.zyntello.com](https://medicos.zyntello.com) |
| **Zyntello Encuestas** | Firmas encuestadoras, campañas y empresas: del cuestionario y el trabajo de campo al informe | [encuestas.zyntello.com](https://encuestas.zyntello.com) |

Opera desde **República Dominicana**, con soporte en Venezuela, Colombia, Guatemala y Costa Rica.

- **Correo:** info@zyntello.com · **Soporte:** soporte@zyntello.com
- **Teléfono / WhatsApp:** +1 829 639 9877

---

## Este repositorio

Solo el sitio público. Las aplicaciones viven en repositorios aparte y privados.

**Stack:** React 19 · Vite 8 · Tailwind CSS

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # genera dist/
```

### Estructura

```
src/
├── components/     Secciones de la página (Hero, Servicios, Soluciones, Portafolio, Funcionalidades,
│                   Contacto, selector y aviso de idioma, aviso de cookies, chat de WhatsApp…)
├── hooks/          Hooks reutilizables
└── styles/         Estilos compartidos
public/             Páginas complementarias (precios, servicios, blog, legales…), capturas y logos
├── en/ fr/ it/ ht/ ar/ zh-Hans/ zh-Hant/    El sitio traducido, una carpeta por idioma
dist/               Build de producción (se versiona: el hosting sirve estos archivos)
```

> `dist/` se commitea a propósito: el despliegue publica esa carpeta directamente.

### Idiomas

El sitio se publica en **8 idiomas**: español, inglés, francés, italiano, criollo haitiano, árabe,
chino simplificado y chino tradicional. El texto va **traducido en cada página**, no se traduce al
vuelo, para que los buscadores lo indexen en cada idioma. Las páginas legales también están en los
ocho.

### Catálogo de módulos

Las páginas de cada módulo (landings) y la vitrina del sitio salen del **panel interno de
Zyntello**, que es la fuente del catálogo. El sitio guarda una copia de respaldo para cuando ese
catálogo no responde. Salud y Encuestas llevan a sus propias aplicaciones, no al ERP.

---

## Despliegue

El sitio **no se despliega solo**: un `git pull` en el servidor no publica nada. Se despliega con
el script del repositorio, que hace el build, sube `dist/`, copia los archivos al hosting y borra
los recursos viejos que ya no usa ningún build:

```powershell
.\deploy-website.ps1 -Build     # build + commit de dist + push + publicación
.\deploy-website.ps1            # solo publicación, si dist ya está subido
```

Después de desplegar, se comprueba **el archivo que se sirve**, no el commit del servidor.

---

## Documentos legales

Las políticas que rigen el uso de la plataforma se publican en el sitio y se mantienen al día con
los productos que se ofrecen:

- [Política de privacidad](https://zyntello.com/privacidad/)
- [Términos y condiciones](https://zyntello.com/terminos/)
- [Acuerdo de Nivel de Servicio (SLA)](https://zyntello.com/sla/)
- [Política de cookies](https://zyntello.com/cookies/)
- [Eliminación de datos](https://zyntello.com/eliminacion-datos/)
- [Avisos de terceros](https://zyntello.com/avisos-terceros/)

---

© Zyntello, S.R.L. — República Dominicana. Todos los derechos reservados.
