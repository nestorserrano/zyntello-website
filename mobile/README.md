# Zyntello Events — App Android nativa (Capacitor)

App Android para gestión de eventos Zyntello. Usa Capacitor para generar APK nativo.

## Requisitos

- Node.js 18+
- Android Studio con Android SDK (API 24+)
- Java JDK 17+

## Setup inicial (una sola vez)

```bash
cd c:/wamp64/www/zyntello/mobile

# 1. Instalar dependencias
npm install

# 2. Build de la web app
npm run build

# 3. Agregar plataforma Android
npx cap add android

# 4. Sincronizar archivos web → Android
npx cap sync

# 5. Abrir en Android Studio
npx cap open android
```

## Desarrollo

```bash
# Servidor de desarrollo (prueba en navegador)
npm run dev

# Después de cada cambio en src/
npm run build && npx cap sync
```

## Generar APK debug

```bash
# Opción A: desde PowerShell (requiere Android Studio instalado)
npm run build
npx cap sync
npm run apk:debug

# El APK queda en: android/app/build/outputs/apk/debug/app-debug.apk
```

## Generar APK desde Android Studio

1. `npm run build && npx cap sync`
2. `npx cap open android`
3. En Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**

## Instalar APK en teléfono

```bash
# Con ADB (teléfono conectado por USB con depuración USB activada)
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Características

- **Login** con usuario y contraseña de Zyntello
- **Eventos**: lista con contadores de inscritos
- **Detalle del evento**: estadísticas en tiempo real (inscritos, check-ins, género, top instituciones)
- **Check-in**: escaneo de QR con cámara trasera + búsqueda manual por cédula/pasaporte/nombre
- **Participantes**: lista paginada con foto, documento, empresa, estado de check-in

## API backend

Todos los endpoints están en `https://app.zyntello.com/api/mobile/*`
Autenticación: Bearer token (Sanctum)
