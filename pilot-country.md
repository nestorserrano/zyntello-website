# País Piloto: República Dominicana

## Razón de la elección
- Mercado objetivo principal de Zyntello (República Dominicana, Venezuela, Colombia, Guatemala, Costa Rica).
- Existencia de requisitos de facturación electrónica bien definidos (DGII - NCF).
- Comunidad de PYMES activa y cámaras de comercio que pueden facilitar el acceso a usuarios beta.
- Infraestructura de internet y adopción de servicios en la nube en crecimiento.

## Requisitos de facturación electrónica (DGII - NCF)
1. **Tipo de documento**: Factura de crédito, factura de débito, nota de crédito, nota de débito, comprobante de retención, etc.
2. **Formato**: XML conforme al estándar de la DGII (versión 2.0 o superior).
3. **Requisitos de datos**:
   - Información del emisor (RNC, nombre, dirección, teléfono, actividad económica).
   - Información del receptor (RNC o cédula, nombre, dirección).
   - Detalle de artículos/servicios (código, descripción, cantidad, unidad, precio unitario, ITBIS, total).
   - Totales (subtotal, ITBIS, otros impuestos, monto total).
   - Fecha y hora de emisión.
   - Número de autorización (NCF) proporcionado por la DGII.
4. **Proceso de autorización**:
   - Generar XML según especificación.
   - Enviar a la DGII mediante su servicio web (HTTPS, SOAP o REST según la versión).
   - Recibir respuesta de autorización con NCF y número de autorización.
   - En caso de rechazo, recibir motivos y permitir corrección.
5. **Almacenamiento**:
   - Guardar XML firmado y respuesta de autorización por mínimo 10 años.
   - Disponibilidad para consulta por parte de la DGII y del contribuyente.
6. **Envío al receptor**:
   - Enviar copia del XML autorizado y representación impresa (PDF) por correo electrónico o vía web service del receptor.
   - Opcional: envío mediante WhatsApp o SMS con enlace seguro de descarga.
7. **Integración con sistemas de pago**:
   - Permitir asociar pagos (transferencia, tarjeta, efectivo) a la factura.
   - Generar automáticamente comprobante de pago cuando se registre el ingreso bancario.

## Requisitos legales adicionales
- **Registro de usuarios**: Cada empresa debe estar registrada en la DGII y tener su RNC activo.
- **Retenciones**: Soporte para retenciones de ITBIS y ISR cuando corresponda.
- **Envío de resúmenes**: Capacidad para generar y enviar resúmenes de retenciones y percepciones mensuales.
- **Consulta de NCF**: Consulta al webservice de la DGII para validar un NCF antes de usarlo (evita duplicados).

## Consideraciones técnicas para la implementación
- **Servicio web de la DGII**: Utilizar el endpoint de pruebas (sandbox) para desarrollo y el de producción para clientes activos.
- **Manejo de certificados**: Necesario tener el certificado digital del cliente (o usar un certificado propio bajo esquema de intermediario autorizado). Evaluar opción de usar un Proveedor Autorizado de Certificación (PAC) local.
- **Manejo de errores**: Registrar códigos de error de la DGII y presentar mensajes amigables al usuario.
- **Escalabilidad**: Diseñar el servicio de timbrado como un servicio separado (cola de trabajos) para evitar bloqueos en la solicitud HTTP.
- **Seguridad**: Transmitir datos mediante HTTPS, firmar XML con certificado X.509, almacenar claves privadas en vault o servicio de gestión de claves (AWS KMS, HashiCorp Vault, o equivalente local).

## Próximos pasos inmediatos
1. Obtener acceso al entorno de pruebas (sandbox) de la DGII.
2. Estudiar el WSDL/XSD de la versión vigente del servicio de facturación electrónica.
3. Diseñar el modelo de datos para almacenar facturas, XML firmado y respuestas de autorización.
4. Crear un servicio de timbrado (Laravel job o worker) que reciba los datos de la factura, genere XML, lo firme, lo envíe a la DGII y guarde la respuesta.
5. Desarrollar la UI para captura de factura y visualización del estado (pendiente, autorizado, rechazado).
6. Implementar pruebas automatizadas contra el sandbox.
7. Preparar documentación de alto nivel para los usuarios beta (manual de facturación electrónica).

---
*Este documento servirá como base para el sprint de definición y el inicio del desarrollo del módulo de facturación electrónica para el piloto en República Dominicana.*