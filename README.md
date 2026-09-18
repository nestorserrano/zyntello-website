# zyntello.com — sitio web corporativo

Sitio institucional de **Zyntello, S.R.L.**, empresa dominicana de software empresarial. Presenta
la plataforma SaaS, sus módulos y las formas de contacto.

🌐 **[zyntello.com](https://zyntello.com)**

---

## Qué es Zyntello

Zyntello desarrolla y opera una plataforma de gestión empresarial por suscripción: contabilidad,
facturación con comprobantes fiscales, nómina, inventario, cuentas por cobrar y pagar, punto de
venta, CRM y varios verticales (restaurante, car wash, condominios, préstamos), entre otros.

Opera desde **República Dominicana**, con soporte en Venezuela, Colombia, Guatemala y Costa Rica.

- **Correo:** info@zyntello.com · **Soporte:** soporte@zyntello.com
- **Teléfono / WhatsApp:** +1 829 639 9877

---

## Este repositorio

Solo el sitio público. La plataforma SaaS vive en repositorios aparte y privados.

**Stack:** React 19 · Vite 8 · Tailwind CSS

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # genera dist/
```

### Estructura

```
src/
├── components/     Secciones de la página (Hero, Servicios, Soluciones, Portafolio, Contacto…)
├── hooks/          Hooks reutilizables
└── styles/         Estilos compartidos
dist/               Build de producción (se versiona: el hosting sirve estos archivos)
public/             Recursos estáticos y páginas complementarias
```

> `dist/` se commitea a propósito: el despliegue publica esa carpeta directamente.

---

## Documentos legales

Las políticas que rigen el uso de la plataforma se publican en el sitio y se mantienen al día con
los módulos que se ofrecen:

- [Política de privacidad](https://zyntello.com/privacidad/)
- [Términos y condiciones](https://zyntello.com/terminos/)
- [Acuerdo de Nivel de Servicio (SLA)](https://zyntello.com/sla/)
- [Eliminación de datos](https://zyntello.com/eliminacion-datos/)

---

© Zyntello, S.R.L. — República Dominicana. Todos los derechos reservados.
