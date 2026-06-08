# FLUJO COMPLETO: RECEPCIÓN vs FACTURA DE PROVEEDOR

## 📋 PROCESOS SEPARADOS (No son lo mismo)

```
ORDEN DE COMPRA (OC)
    ↓
    ├─→ RECEPCIÓN (Compras → Recepciones)
    │   └─→ Mercancía que entra al almacén
    │   └─→ Actualiza inventario
    │   └─→ Actualiza cantidad_transito
    │   └─→ Campo: documento_proveedor (ej: número del albarán)
    │
    └─→ FACTURA DEL PROVEEDOR (Compras → Facturas Proveedor)
        └─→ Documento fiscal que llega
        └─→ Crea pasivo en CxP
        └─→ Campo OBLIGATORIO: fiscal_document_number (ej: NCF del proveedor)
        └─→ Puede haber ANTES, DURANTE o DESPUÉS de recibir
```

---

## 🔴 PROBLEMA IDENTIFICADO

**El campo "documento_proveedor" en la RECEPCIÓN NO es lo mismo que "fiscal_document_number" en FACTURA**

- **Recepción.documento_proveedor** = Número del albarán/guía de remisión del proveedor
  - Ejemplo: "ALBARÁN-0001"
  - Es INFORMATIVO (para tracking)
  - NO crea deuda contable

- **Factura.fiscal_document_number** = Número FISCAL del proveedor (NCF en RD)
  - Ejemplo: "F0123456789AB"
  - Es OBLIGATORIO para contabilidad
  - CREA DEUDA en CxP

---

## ✅ FLUJO CORRECTO

### 1️⃣ CREAR RECEPCIÓN
```
Compras → Recepciones → Nueva

Campos:
- Seleccionar OC
- Fecha de recepción
- Documento proveedor (Albarán)  ← Informativo
- Transportista
- Líneas recibidas

Validaciones (Frontend):
✓ Proveedor seleccionado
✓ Fecha completa
✓ Al menos 1 línea
✓ Cantidad > 0

Resultado:
→ Recepción creada en BORRADOR
→ Estado de recepción: borrador
```

### 2️⃣ POSTEAR RECEPCIÓN (Confirm Goods Receipt)
```
Recepción show → Botón "Postear"

Automáticamente:
✓ Crea movimiento ENTRADA_COMPRA en inventario
✓ Suma cantidad a inv_stock.cantidad
✓ Resta de inv_stock.cantidad_transito
✓ Recalcula costo promedio
✓ Registra asiento GR/IR contable
✓ Actualiza OC status: recibida/parcialmente_recibida

Resultado:
→ Recepción status: posteada
→ Inventario actualizado
→ Asiento GR/IR registrado
```

### 3️⃣ CREAR FACTURA DEL PROVEEDOR (Completamente Separado)
```
Compras → Facturas Proveedor → Nueva

Campos OBLIGATORIOS:
- Seleccionar OC ← La MISMA OC de la recepción
- Fecha de factura
- fiscal_document_number ← NCF DEL PROVEEDOR (OBLIGATORIO)
- Líneas de factura

Validaciones:
✓ OC seleccionada
✓ Fecha completa
✓ fiscal_document_number NO vacío (debe ser número fiscal)
✓ Al menos 1 línea
✓ Cantidad > 0

Resultado:
→ Factura creada en BORRADOR
→ NO afecta inventario (ya fue recibido)
→ Crea pasivo CxP
```

### 4️⃣ CONFIRMAR FACTURA (Match invoice to receipt)
```
Factura show → Botón "Match" o "Confirmar"

Automáticamente:
✓ Registra asiento contable:
  - DR Gasto/Inventario
  - CR Cuentas por Pagar (CxP)
✓ Actualiza OC status: facturada

Resultado:
→ Factura status: facturada
→ CxP creado
→ GR/IR cierre (Mercancía ya facturada)
```

---

## 🛑 ERRORES COMUNES QUE IMPIDEN GUARDAR

### RECEPCIÓN NO GUARDA - Validaciones Frontend:
```javascript
Errores que muestra:
- ✗ Debe agregar al menos una línea de recepción
- ✗ Línea N: La cantidad a recibir debe ser mayor a 0
- ✗ Debe seleccionar un proveedor (si es sin OC)
- ✗ La fecha es obligatoria
- ✗ Línea N: La descripción es obligatoria (si es sin OC)
```

### FACTURA NO GUARDA - Validaciones Backend:
```php
Errores que retorna:
- fiscal_document_number requerido (línea 55)
- fiscal_document_number debe ser string max 80 (línea 55)
- lineas.*.descripcion requerido (línea 61)
- lineas.*.precio_unitario requerido (línea 63)
```

---

## 🔍 FLUJO DE DATOS COMPLETO (Visualizado)

```
┌─────────────────────────────────────────────────────────────┐
│ ORDEN DE COMPRA (OC-2026-001234)                            │
│ Status: aprobada                                             │
│ Proveedor: Juan López Importaciones                          │
│ Líneas: Cables HDMI x 100 unidades @ $5.00 c/u             │
└─────────────────────────────────────────────────────────────┘
                    ↓ Se divide en 2 procesos
         ┌──────────────────────────────────┐
         │                                  │
    PROCESO 1:                         PROCESO 2:
    RECEPCIÓN                          FACTURA
    ──────────                         ──────────
         │                                  │
         ↓                                  ↓
    RCV-2026-000001                   FCP-2026-000001
    Documento: ALB-5001               Documento: F01234567890AB
    Fecha: 2026-06-08                 Fecha: 2026-06-10
    Cantidad: 100 unidades            (Puede ser antes o después)
    Status: posteada                  Status: facturada
         │                                  │
         ↓                                  ↓
    ✓ Inventario += 100              ✓ CxP += $500
    ✓ GR/IR asiento                  ✓ Gasto/CxP asiento
    ✓ cantidad_transito = 0          ✓ OC status = facturada
         │                                  │
         └──────────────────────────────────┘
                        ↓
                OC COMPLETADA
                (Recibida + Facturada)
```

---

## 💡 SOLUCIÓN: POR QUÉ NO GUARDA

### RECEPCIÓN No guarda → Ver errores en frontend
**Abre la consola del navegador (F12 → Console)**
- Busca "Validación" o "SweetAlert"
- El error debería mostrarse

### FACTURA No guarda → Revisar fiscally_document_number
**Error #1: No escribir el número fiscal**
```
Campo: fiscal_document_number
Valor vacío ❌
Solución: Escribir el NCF del proveedor (ej: F01234567890AB)
```

**Error #2: El campo de líneas incompleto**
```
Cada línea debe tener:
✓ Descripción
✓ Cantidad
✓ Precio unitario
✗ Si falta cualquiera → no guarda
```

---

## 📌 FLUJO RECOMENDADO

1. **Semana 1**: Reciben mercancía
   - Crear Recepción
   - Postear Recepción
   - Inventario se actualiza INMEDIATAMENTE

2. **Semana 2**: Llega la factura del proveedor
   - Crear Factura del Proveedor
   - Confirmar/Match
   - CxP se crea

3. **Semana 3-4**: Hacer el pago
   - Registrar pago en CxP
   - Asiento contable
   - OC cierra

---

## 🎯 CHECKLIST PARA GUARDAR

### ✅ RECEPCIÓN
- [ ] Seleccionar OC
- [ ] Escribir fecha
- [ ] Agregar al menos 1 línea
- [ ] Cantidad > 0 en cada línea
- [ ] Click "Crear recepción"
- [ ] Si error → Ver consola F12

### ✅ FACTURA
- [ ] Seleccionar OC (la misma)
- [ ] Escribir fecha de factura
- [ ] **ESCRIBIR fiscal_document_number** (NCF proveedor) ← KEY!
- [ ] Agregar líneas
- [ ] Cantidad y precio en cada línea
- [ ] Click "Crear factura"
- [ ] Si error → Ver respuesta servidor

---

## 🔗 RELACIÓN: ¿Por qué Recepción ≠ Factura?

| Aspecto | Recepción | Factura Proveedor |
|--------|-----------|-------------------|
| **Documento** | Albarán/Guía de remisión | NCF fiscal |
| **Tabla** | `pur_receipts` | `pur_invoices` |
| **Afecta** | Inventario | CxP (Deuda) |
| **Timing** | Llega primero | Llega después (a veces) |
| **Obligatorio** | Número de albarán | Número fiscal |
| **Contabilidad** | GR/IR (Pendiente) | GR/IR cierre (Pasivo) |

---

## ⚠️ PREGUNTA DEL USUARIO RESPONDIDA

**"¿Por qué hay número de factura en recepción pero no se toma de facturas existentes?"**

→ Porque son procesos COMPLETAMENTE DIFERENTES:
- **Recepción.documento_proveedor** = Albarán (Operativo)
- **Factura.fiscal_document_number** = NCF (Fiscal/Contable)

No están conectadas automáticamente porque:
- El proveedor puede enviar el albarán PRIMERO
- La factura llega DESPUÉS
- O pueden ser números diferentes

Si necesitas ligar automáticamente: requiere ruta /match que compare OCxRecepción con OCxFactura.
