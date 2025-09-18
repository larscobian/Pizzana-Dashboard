# 🚀 Guía de Configuración Rápida - PIZZANA Dashboard

Esta guía te llevará paso a paso para configurar tu dashboard de PIZZANA en menos de 30 minutos.

## ✅ Checklist de Configuración

### Paso 1: Configuración de Google Cloud Console

**🎯 Objetivo**: Crear un Service Account para acceder a tu Google Sheet

1. **Accede a Google Cloud Console**
   - Ve a: https://console.cloud.google.com
   - Si no tienes un proyecto, créalo con el nombre "PIZZANA Dashboard"

2. **Habilita la Google Sheets API**
   - En el menú izquierdo: APIs & Services > Library
   - Busca "Google Sheets API"
   - Haz clic en "Enable"

3. **Crea un Service Account**
   - Ve a: IAM & Admin > Service Accounts
   - Clic en "CREATE SERVICE ACCOUNT"
   - Nombre: `pizzana-dashboard-service`
   - Descripción: `Acceso a Google Sheets para dashboard PIZZANA`
   - Rol: **Viewer** (solo lectura)

4. **Genera la clave JSON**
   - Selecciona el Service Account creado
   - Pestaña "KEYS" > "ADD KEY" > "Create new key"
   - Tipo: **JSON**
   - ¡Guarda este archivo! Lo necesitarás después

### Paso 2: Compartir tu Google Sheet

**🎯 Objetivo**: Dar acceso al Service Account a tu spreadsheet

1. **Abre tu Google Sheet "PIZZANA CRM - OG"**
   - URL: https://docs.google.com/spreadsheets/d/1fnYvf8uM8BcWYs2i1seaOTLoR5wTQh_fvta-4jK4vHY/edit

2. **Compartir con el Service Account**
   - Clic en "Compartir" (botón azul)
   - En "Agregar personas y grupos":
   - Pega el email del Service Account (está en el archivo JSON: `client_email`)
   - Permisos: **Lector**
   - ✅ **MUY IMPORTANTE**: Desactiva "Notificar a las personas"

### Paso 3: Configurar Variables de Entorno

**🎯 Objetivo**: Conectar tu dashboard con Google Sheets

1. **Crea el archivo `.env.local`**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Abre el archivo JSON descargado y copia los valores:**

   Desde el JSON, copia:
   - `private_key` → GOOGLE_SHEETS_PRIVATE_KEY
   - `client_email` → GOOGLE_SHEETS_CLIENT_EMAIL

3. **Edita `.env.local`:**
   ```env
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
   MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
   -----END PRIVATE KEY-----"
   GOOGLE_SHEETS_CLIENT_EMAIL="pizzana-dashboard-service@tu-proyecto.iam.gserviceaccount.com"
   PIZZANA_SPREADSHEET_ID="1fnYvf8uM8BcWYs2i1seaOTLoR5wTQh_fvta-4jK4vHY"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

   ⚠️ **IMPORTANTE**:
   - El `private_key` debe incluir las líneas `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
   - Los saltos de línea en el `private_key` deben estar como `\n`

### Paso 4: Instalar y Ejecutar

**🎯 Objetivo**: Poner en marcha tu dashboard

1. **Instala las dependencias**
   ```bash
   npm install
   ```

2. **Ejecuta en modo desarrollo**
   ```bash
   npm run dev
   ```

3. **Abre tu dashboard**
   - URL: http://localhost:3000
   - ¡Deberías ver tu dashboard de PIZZANA funcionando! 🎉

## 🔧 Solución de Problemas Comunes

### ❌ Error: "Authentication failed"

**Causa**: Problema con las credenciales
**Solución**:
1. Verifica que el Service Account tenga acceso al spreadsheet
2. Confirma que el email en `.env.local` coincida con el del JSON
3. Asegúrate de que el `private_key` esté correctamente formateado

### ❌ Error: "Spreadsheet not found"

**Causa**: El Service Account no puede acceder al sheet
**Solución**:
1. Ve a tu Google Sheet
2. Verifica que el Service Account esté en la lista de personas con acceso
3. Confirma que el SPREADSHEET_ID sea correcto

### ❌ Error: "Unable to parse private key"

**Causa**: El formato del private_key está mal
**Solución**:
1. Asegúrate de que el `private_key` tenga las líneas BEGIN/END
2. Verifica que no haya espacios extra
3. Los saltos de línea deben ser `\n` literalmente

### ❌ No aparecen datos

**Causa**: Problema con la estructura del sheet
**Solución**:
1. Confirma que las hojas se llamen exactamente: `PEDIDOS`, `CLIENTES`, `KPIs`, `PRODUCTOS`
2. Verifica que las columnas tengan los nombres esperados
3. Revisa la consola del navegador (F12) para ver errores específicos

## 📋 Verificación Final

Antes de continuar, verifica que:

- [ ] ✅ El Service Account está creado en Google Cloud
- [ ] ✅ Google Sheets API está habilitada
- [ ] ✅ El Service Account tiene acceso al spreadsheet PIZZANA CRM - OG
- [ ] ✅ El archivo `.env.local` existe y tiene las 4 variables configuradas
- [ ] ✅ `npm install` se ejecutó sin errores
- [ ] ✅ `npm run dev` inicia el servidor
- [ ] ✅ Al abrir http://localhost:3000 ves el dashboard funcionando

## 🎉 ¡Felicitaciones!

Si llegaste hasta aquí, tu dashboard de PIZZANA está funcionando correctamente.

### Próximos pasos:
1. **Personaliza** los colores y métricas según tus necesidades
2. **Deploy** en Vercel o Netlify para acceso desde cualquier lugar
3. **Comparte** el dashboard con tu equipo

### ¿Necesitas ayuda?

Si tienes problemas con algún paso, revisa:
1. La sección de Troubleshooting en el README.md
2. La consola del navegador (F12) para errores específicos
3. Los logs del terminal donde ejecutas `npm run dev`

---

**🍕 ¡Tu dashboard de PIZZANA está listo para ayudarte a hacer crecer tu negocio!**