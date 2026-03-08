# 🏠 FamilyTasks — React Native App

App móvil multiplataforma para gestión de tareas del hogar, construida con **Expo SDK 55** + **React Native 0.79** + **React 19**.

---

## 🚀 Instalación paso a paso

### 1. Requisitos previos
- **Node.js 18+** → https://nodejs.org
- **Expo Go** en tu celular → App Store / Google Play

### 2. Abrir el proyecto
```bash
cd FamilyTasks
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Descargar fuentes
```bash
node setup-fonts.js
```
Esto descarga Nunito y Space Mono en `assets/fonts/` automáticamente.

### 5. Correr la app
```bash
npx expo start
```

Aparecerá un código QR en la terminal. Abrís Expo Go en tu celular y escaneás el QR.

---

## 📱 Cómo usar Expo Go

1. Instalá Expo Go desde la App Store (iOS) o Google Play (Android)
2. Asegurate que tu celular y PC estén en la misma red WiFi
3. En iOS: escaneá el QR con la cámara del sistema
4. En Android: abrí Expo Go y tocá "Scan QR code"

---

## 🐛 Solución de problemas

**"Cannot find module fonts":** Corré `node setup-fonts.js` primero.

**QR no conecta:** Verificá que celular y PC estén en la misma WiFi.

**Probar en navegador:** Presioná `w` en la terminal de Expo.
