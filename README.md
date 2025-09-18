# 🍕 PIZZANA Dashboard

Dashboard en tiempo real para el CRM de PIZZANA, conectado directamente con Google Sheets mediante la API de Google.

## 🚀 Características

### 📊 Datos Generales
- **Gráfico de velas** de ingresos totales con porcentaje de variación vs mes anterior
- **División visual** de ganancias entre "Local" y "Eventos" con porcentajes
- **Tooltips interactivos** con información adicional al hacer hover

### 🏪 Datos del Área Local (B2C)
- **Gráfico de ingresos** por días trabajados
- **Métricas principales**:
  - Ingresos totales del mes
  - Número de ventas
  - Clientes únicos
- **Top 3 clientes** del período con gasto total y número de pedidos
- **Top 3 pizzas** del período con número de pedidos y facturación

### 🎪 Datos del Área Eventos (B2B)
- **Gráfico de ingresos** por días trabajados
- **Métricas principales**:
  - Ingresos totales del mes
  - Número de eventos
  - Clientes B2B únicos
  - Ticket promedio por evento

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Recharts** para gráficos interactivos
- **Google Sheets API** para datos en tiempo real
- **Lucide React** para iconos

## 📦 Instalación

### 1. Dependencias del proyecto

```bash
npm install
```

### 2. Configuración de Google Sheets API

#### a) Crear Service Account en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**
4. Ve a **IAM & Admin > Service Accounts**
5. Haz clic en **+ CREATE SERVICE ACCOUNT**
6. Completa los campos:
   - **Service account name**: `pizzana-dashboard`
   - **Description**: `Service account para PIZZANA Dashboard`
7. Haz clic en **CREATE AND CONTINUE**
8. En **Role**, selecciona **Editor** (o solo lectura si prefieres)
9. Haz clic en **CONTINUE** y luego **DONE**

#### b) Generar y descargar la clave JSON

1. En la lista de Service Accounts, haz clic en el que acabas de crear
2. Ve a la pestaña **KEYS**
3. Haz clic en **ADD KEY > Create new key**
4. Selecciona **JSON** y haz clic en **CREATE**
5. Se descargará un archivo JSON con las credenciales

#### c) Compartir el Google Sheet

1. Abre tu Google Sheet "PIZZANA CRM - OG"
2. Haz clic en **Compartir**
3. Añade el email del Service Account (formato: `nombre@proyecto.iam.gserviceaccount.com`)
4. Dale permisos de **Lector** (o Editor si necesitas escribir)

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
# Google Sheets API Configuration
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_DESDE_EL_JSON\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="tu-service-account@tu-proyecto.iam.gserviceaccount.com"
PIZZANA_SPREADSHEET_ID="1fnYvf8uM8BcWYs2i1seaOTLoR5wTQh_fvta-4jK4vHY"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 📝 Cómo obtener cada valor:

- **GOOGLE_SHEETS_PRIVATE_KEY**: Copia el valor de `private_key` del archivo JSON descargado
- **GOOGLE_SHEETS_CLIENT_EMAIL**: Copia el valor de `client_email` del archivo JSON
- **PIZZANA_SPREADSHEET_ID**: Es el ID que ya tienes: `1fnYvf8uM8BcWYs2i1seaOTLoR5wTQh_fvta-4jK4vHY`

## 🚀 Ejecutar el proyecto

### Desarrollo
```bash
npm run dev
```

El dashboard estará disponible en: `http://localhost:3000`

### Producción
```bash
npm run build
npm start
```

## 📊 Estructura de Datos

El dashboard espera que tu Google Sheet tenga estas hojas con las siguientes estructuras:

### PEDIDOS
- **Columnas**: ID, Fecha, Nombre_Cliente, WhatsApp, Dirección, [Pizzas con emojis], Metodo, Entrega, Comuna, Pre_Total, Deliv., Com., Total, Tipo

### CLIENTES
- **Columnas**: Nombre_Cliente, WhatsApp, Direccion, Primera_Compra, Ultima_Compra, N Pedidos, Total_Gastado, Dias_Sin_Comprar, Estado_Cliente, Notas_Cliente

### KPIs
- **Columnas**: FECHA (Año, Mes), TOTAL (Clientes, Ingresos, Ventas), LOCAL (Ingresos, Ventas), EVENTOS (Ingresos, Ventas), FERIA (Ingresos, Ventas), OTROS

### PRODUCTOS
- **Columnas**: NOMBRE PIZZA, EMOJI, PRECIO, ACTIVO, INGREDIENTES

## 🎨 Personalización

### Cambiar colores
Edita los colores en los componentes o modifica `tailwind.config.js`:

```typescript
// En los componentes de gráficos
<Line stroke="#3b82f6" /> // Azul para Local
<Line stroke="#f97316" /> // Naranja para Eventos
```

### Añadir nuevas métricas
1. Modifica la API en `src/app/api/dashboard/route.ts`
2. Actualiza los tipos en `src/lib/googleSheets.ts`
3. Añade el componente visual correspondiente

## 📱 Responsive Design

El dashboard está optimizado para:
- **Desktop**: 3 secciones en layout completo
- **Tablet**: 2 columnas con General arriba
- **Mobile**: Una columna vertical

## 🔄 Actualización de Datos

- **Automática**: Cada vez que se carga la página
- **Manual**: Botón "Actualizar" en el header
- **Tiempo real**: Los datos se sincronizan directamente desde Google Sheets

## 🚨 Troubleshooting

### Error: "Authentication failed"
- Verifica que las credenciales en `.env.local` sean correctas
- Asegúrate de que el Service Account tenga acceso al spreadsheet

### Error: "Spreadsheet not found"
- Confirma que el `PIZZANA_SPREADSHEET_ID` sea correcto
- Verifica que el Service Account tenga permisos de lectura

### Error: "Unable to parse private key"
- Asegúrate de que el `GOOGLE_SHEETS_PRIVATE_KEY` incluya los `\\n` correctos
- Verifica que no haya espacios adicionales en el archivo `.env.local`

### Datos no aparecen
- Confirma que las hojas tengan los nombres exactos: `PEDIDOS`, `CLIENTES`, `KPIs`, `PRODUCTOS`
- Verifica que la estructura de columnas coincida con la esperada

## 📈 Próximas Mejoras

- [ ] Filtros por fecha personalizados
- [ ] Exportación de reportes en PDF
- [ ] Notificaciones de metas alcanzadas
- [ ] Integración con WhatsApp Business API
- [ ] Dashboard móvil nativo
- [ ] Predicciones con IA

## 📞 Soporte

Si tienes problemas con la configuración, asegúrate de:

1. ✅ Tener Node.js 18+ instalado
2. ✅ Haber completado la configuración de Google Cloud
3. ✅ El Service Account tiene acceso al spreadsheet
4. ✅ Las variables de entorno están correctamente configuradas
5. ✅ El spreadsheet tiene la estructura esperada

---

**Desarrollado con ❤️ para optimizar el negocio de PIZZANA** 🍕