# 🔍 GUÍA DE VERIFICACIÓN - RECEPCIÓN DE COMPRAS

## ✅ Estado Actual: Campos Ocultos

**CONFIRMADO:** Todos los campos requeridos están presentes en la forma:

```
CAMPOS VISIBLES:
- Fecha de recepción ✓
- Documento proveedor (Albarán) ✓  
- Transportista ✓
- Placa vehículo ✓
- Líneas a recibir (tabla) ✓
- Notas ✓

CAMPOS OCULTOS:
- purchase_order_id (ID de la OC) ✓
- lineas[].purchase_order_line_id (ID línea OC) ✓
- lineas[].cantidad_recibida (name del input visible) ✓
- lineas[].bodega_destino_id (select visible) ✓
- lineas[].producto_id (si existe artículo) ✓
- lineas[].lote (input visible) ✓
```

---

## 🚀 VALIDACIONES MEJORA (Commit [#1113])

Se agregaron validaciones mejoradas en **SweetAlert2** que ahora muestran:

```javascript
❌ Línea X: Cantidad a recibir debe ser > 0 (actual: 0)
❌ Línea Y: Recibe más de lo disponible (disponible: 50, intenta: 100)
❌ La fecha de recepción es obligatoria
❌ Debe agregar al menos una línea de recepción
```

**Además:** Logs en consola F12 para debugging.

---

## 🧪 PRUEBA PASO A PASO

### PRE-REQUISITOS
- [ ] Tener al menos 1 OC en estado `aprobada`
- [ ] Estar logueado como usuario con permisos Compras
- [ ] Tener empresa activa seleccionada

### FLUJO CORRECTO

**PASO 1: Crear Recepción**
```
1. Ir a: Compras → Recepciones → Nueva
2. Seleccionar OC aprobada
3. Click "Continuar"
```

**PASO 2: Llenar Formulario**
```
□ Fecha: [auto-llena con hoy]
□ Doc. proveedor: ALB-001 (ej: número albarán)
□ Transportista: Nombre empresa logística (opcional)
□ Placa: ABC-123 (opcional)

LÍNEAS A RECIBIR:
- Descripción: [muestra del OC] (no editable)
- Pedido: [cantidad OC]
- Ya rec.: [cantidad ya recibida] (si hay)
- Pendiente: [diferencia]
- ⚠️ RECIBIR AHORA: ← EDITAR AQUÍ (debe ser > 0)
- Código Art.: [buscar artículo]
- Bodega: [seleccionar destino]
- Lote: [número lote]
```

**PASO 3: Validar Antes de Guardar**

Si presionas "Crear recepción" y VES ERROR en SweetAlert2:

```
❌ Línea 1: La cantidad a recibir debe ser mayor a 0 (actual: 0)
```

**SOLUCIÓN:** Edita el campo "Recibir ahora" con una cantidad > 0

Ejemplo:
- OC: 100 unidades
- Ya recibidas: 30 unidades  
- Pendiente: 70 unidades
- ❌ Escribes en "Recibir ahora": 0 ← ERROR
- ✅ Escribes en "Recibir ahora": 50 ← OK

**PASO 4: Confirmar Guardado**

Si todo está correcto:
- ✅ La forma se envía
- ✅ Redirecciona a `/compras/receipts/{id}`
- ✅ Muestra: "Recepción RCV-2026-000001 creada en borrador"

---

## 🔧 DEBUGGING - VER ERRORES EN CONSOLA

**F12 → Console**

La validación muestra logs:

```javascript
📋 DEBUG: Validando recepción con OC
Lineas: [
  { id: "...", desc: "Cables", cant: 100, recibido: 30, recibir: 0, ... }
]
Línea 0: { recibir: 0, cant: 100, recibido: 30, ... }

❌ Errores encontrados: [
  "❌ Línea 1: Cantidad a recibir debe ser > 0 (actual: 0)"
]

📋 Valores en formulario:
Fecha: 2026-06-08
Líneas count: 1
  Línea 0: recibir=0, cant=100, recibido=30
```

---

## 🔴 ERRORES COMUNES

### Error 1: "Cantidad a recibir debe ser > 0"
```
CAUSA: Campo vacío o cero en "Recibir ahora"
SOLUCIÓN: Escribir un número > 0
```

### Error 2: "Recibe más de lo disponible"
```
CAUSA: Escribes 100 pero la OC tiene 50 pendientes
SOLUCIÓN: No puedes recibir más que el pendiente
```

### Error 3: "La fecha es obligatoria"
```
CAUSA: Campo Fecha vacío
SOLUCIÓN: La fecha se auto-llena con HOY, verifica que esté presente
```

### Error 4: "No hay líneas"
```
CAUSA: El OC no cargó sus líneas desde el servidor
SOLUCIÓN: Recargar la página o seleccionar otra OC
```

---

## 📋 VALIDACIÓN BACKEND (ReceiptController::store)

Si pasas la validación FRONTEND pero falla backend:

**Validaciones requeridas:**
```php
'purchase_order_id'   => 'required|uuid|exists:pur_purchase_orders,id',
'fecha'               => 'required|date',
'lineas'              => 'required|array|min:1',
'lineas.*.purchase_order_line_id' => 'required|uuid|exists:pur_purchase_order_lines,id',
'lineas.*.cantidad_recibida'      => 'required|numeric|min:0.0001',
```

Si falla en backend, verás error en la página.

---

## ✅ CHECKLIST GUARDAR RECEPCIÓN

- [ ] Seleccioné una OC aprobada
- [ ] Cargaron las líneas del OC (visible en la tabla)
- [ ] Editié "Recibir ahora" con cantidad > 0
- [ ] La fecha está llena (auto-llena)
- [ ] Presioné "Crear recepción"
- [ ] ✅ Abrió SweetAlert2 SIN ERRORES (verde)
- [ ] ✅ La forma se envió
- [ ] ✅ Redirige a show de la recepción
- [ ] ✅ Muestra: "Recepción RCV-XXXX creada"

---

## 📊 PRÓXIMOS PASOS

### [#1113] Validaciones Mejoradas
- ✅ Frontend: SweetAlert2 detallado con todos los errores
- ✅ Debug logs en consola F12
- ✅ Validar fecha, líneas, cantidades

### [#1114] (Pendiente)
- [ ] Testear recepción con OC real
- [ ] Verificar que migración cantidad_transito funcionó
- [ ] Postear recepción y validar inventario

### [#1115] (Pendiente)
- [ ] Recepción CON OC: testear flujo completo
- [ ] Recepción SIN OC: testear flujo libre

---

## 🎯 CAMPO CRÍTICO: "Recibir Ahora"

Este es el campo que DEBE editar el usuario.

**Valor inicial:** `Math.max(0, cantidad_oc - cantidad_ya_recibida)`

Ejemplo OC-001:
```
Línea 1: Cables HDMI
  - Cantidad OC: 100 unidades
  - Ya recibido: 30 unidades
  - Pendiente: 70 unidades
  - "Recibir ahora" inicial: 70
  - Usuario DEBE escribir > 0
```

Si `cantidad_ya_recibida === cantidad_oc`:
```
  - Recibido: 100
  - Pendiente: 0
  - "Recibir ahora" inicial: 0
  - ❌ NO PUEDES RECIBIR MÁS (error)
  - ✅ Solución: Esta línea ya está completamente recibida
```

---

## 🚀 DEPLOYMENT

Para aplicar [#1113]:

**Opción A: Auto (si está configurado)**
```
https://app.zyntello.com/zyn-maint/migrate-y-limpiar?key=XXX
```

**Opción B: Manual SSH**
```powershell
.\deploy-bluehost.ps1
```

**Opción C: cPanel Git**
1. cPanel → Git Repositories
2. Click "Update from Remote"
3. Pull origin/master

---

## 📞 SOPORTE

Si la recepción SIGUE sin guardar:

1. **Abre F12 → Console**
2. Copia el OUTPUT completo de la validación
3. Verifica qué campo dice "❌"
4. Edita ese campo según instrucciones arriba
