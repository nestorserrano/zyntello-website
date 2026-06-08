# 🔧 GUÍA COMPLETA DE DEBUGGING - RECEPCIÓN NO GUARDA

## PASO 1: Preparar Navegador para Capturar Errores

### Abrir DevTools
1. Presiona **F12** (o Ctrl+Shift+I)
2. Ve a la pestaña **Network**
3. **LIMPIA** el historial de network (botón de basura)
4. Deja DevTools ABIERTO

---

## PASO 2: Completar el Formulario

1. Ve a: `https://app.zyntello.com/compras/receipts/create`
2. Selecciona una OC `aprobada`
3. Haz clic "Continuar"
4. Completa el formulario:
   - [ ] Fecha: **HOY** (auto-llena)
   - [ ] Documento proveedor: `ALB-001` (cualquier valor)
   - [ ] Transportista: (opcional)
   - [ ] Líneas: **Edita "Recibir ahora" con un número > 0**
   - [ ] Bodega: **SELECCIONA BODEGA** (crítico)

---

## PASO 3: Presionar "Crear Recepción"

**IMPORTANTE:** Antes de presionar, verifica en DevTools que esté marcada la opción **"XHR/Fetch"** para ver solo peticiones AJAX.

1. Presiona **"Crear recepción"**
2. **En DevTools → Network**, busca una petición **POST** con:
   - Nombre: `receipts` (o similar)
   - Método: `POST`
   - URL: `.../compras/receipts`

---

## PASO 4: Inspeccionar la Respuesta

Haz clic en esa petición POST y abre la pestaña **"Response"**:

### Si ves JSON con error:
```json
{
  "message": "...",
  "errors": { ... }
}
```
**COPIA TODO ESTO** y envíalo al equipo de desarrollo.

### Si ves HTML (error 500):
Ve a la pestaña **"Preview"** y busca:
- `Exception:`
- `at line XXX in file ...`
- **Copia TODO el error**

### Si ves error 403:
```
{
  "message": "SQLSTATE[HY000]: General error: ...",
  "error": "..."
}
```
Es un error de base de datos o permisos.

---

## PASO 5: Ver Logs del Navegador (Console)

1. Abre la pestaña **"Console"** (F12)
2. Presiona "Crear recepción" de nuevo
3. Deberías ver mensajes:
```
📋 DEBUG: Validando recepción con OC
Lineas: [...]
```

Si ves **ERRORES en rojo**:
- JavaScript error
- Missing function
- **Copia la línea roja**

---

## PASO 6: Inspeccionar Headers HTTP

En la petición POST de Network:

### Pestaña "Request Headers":
Verifica:
- [x] `X-CSRF-TOKEN` presente
- [x] `Content-Type: application/x-www-form-urlencoded`

### Pestaña "Request Payload":
Deberías ver campos como:
```
purchase_order_id: "xxx"
fecha: "2026-06-08"
lineas[0][purchase_order_line_id]: "xxx"
lineas[0][cantidad_recibida]: "50"
lineas[0][bodega_destino_id]: "xxx"
```

Si falta algún campo → **ese es el problema**.

---

## CHECKLIST CRÍTICO ANTES DE GUARDAR

### CAMPOS VISIBLES:
- [ ] Fecha: **LLena** (debe tener una fecha válida)
- [ ] OC: **Seleccionada** (debe estar aprobada)
- [ ] Línea "Recibir ahora": **EDITABLE** (debe tener un número > 0)
- [ ] Bodega: **SELECCIONADA** (dropdown no puede estar vacío)

### CAMPOS OCULTOS (verificar en Payload):
- [ ] `purchase_order_id` (nunca debe estar vacío)
- [ ] `lineas[0][purchase_order_line_id]` (debe tener UUID de línea OC)
- [ ] `lineas[0][cantidad_recibida]` (debe ser > 0)
- [ ] `lineas[0][bodega_destino_id]` (debe tener UUID de bodega)

Si alguno está vacío → **NO GUARDA**.

---

## ERRORES ESPERADOS Y SOLUCIONES

### Error 1: "Bodega no es compatible con purchase_type"
```
Error: Bodega 'BDG-01' (tipo: inventory_sale) 
no es compatible con purchase_type 'fixed_asset'
```

**Solución:**
- La categoría del producto requiere una bodega específica
- Cambiar bodega a una del tipo correcto
- O cambiar categoría del producto en la OC

### Error 2: "Sobre-recepción no permitida"
```
Error: Sobre-recepción no permitida en línea 'Cables': 
pedido 100, ya recibido 30, nueva 80 (máx 105)
```

**Solución:**
- Puedes recibir máximo 105 unidades (100 + 5% tolerancia)
- Reduce la cantidad en "Recibir ahora"

### Error 3: "La OC no está en estado válido"
```
Error: La OC OC-2026-000001 no está en estado válido para recibir.
```

**Solución:**
- OC debe estar en: `aprobada`, `enviada`, o `parcialmente_recibida`
- No se puede recibir OC en borrador o rechazada

### Error 4: "cantidad_recibida REQUERIDO"
```
Error: {
  "lineas.0.cantidad_recibida": ["The cantidad recibida field is required."]
}
```

**Solución:**
- Edita el campo "Recibir ahora" con un número > 0
- El campo NO puede estar vacío ni ser 0

---

## VALIDACIONES EN CASCADA

```
┌─ Frontend (SweetAlert2) ──────────────────┐
│ 1. Cantidad > 0                           │
│ 2. Cantidad no excede disponible          │
│ 3. Fecha presente                         │
│ 4. Al menos 1 línea                       │
└──────────────────┬──────────────────────┘
                   │
                   ↓ (si pasa)
┌─ Backend (ReceiptController) ─────────────┐
│ 1. empresa_activa() & company() presente  │
│ 2. Validación Laravel Rules               │
│ 3. PurPurchaseOrder existe                │
│ 4. Status OC válido                       │
└──────────────────┬──────────────────────┘
                   │
                   ↓ (si pasa)
┌─ Service (ReceiptService) ────────────────┐
│ 1. validarSobreRecepcion()                │
│ 2. validarBodegaCompatible()              │
│ 3. DB transaction                         │
│ 4. Create receipt + lines                 │
└──────────────────┬──────────────────────┘
                   │
                   ↓ (éxito)
      ✓ Redirige a show de recepción
```

---

## PASO FINAL: CAPTURAR TODO

Si el error persiste, copia TODA esta información:

```
PETICIÓN NETWORK:
- Status HTTP: ___
- URL: ___
- Response: [copia todo]
- Headers: [copia CSRF-TOKEN y Content-Type]
- Payload: [copia todos los campos]

CONSOLA F12:
- Mensajes DEBUG: [copia logs]
- Errores: [copia líneas rojas]

OC DATOS:
- Número OC: ___
- Status OC: ___
- Proveedor: ___
- Línea 1 cantidad: ___
- Línea 1 bodega: ___
- Línea 1 categoría: ___
```

---

## 🚨 RESUMEN CRÍTICO

**SI NO GUARDA:**

1. **Abre F12 → Network**
2. **Presiona Crear recepción**
3. **Ve la petición POST en Network**
4. **Lee el campo "Response"**
5. **Copia el error completo**

**El error estará en uno de estos lugares:**
- Response JSON (error 422/500)
- Console (línea roja)
- Preview HTML (error stack trace)

Sin capturar el error real, es imposible saber por qué no guarda.
