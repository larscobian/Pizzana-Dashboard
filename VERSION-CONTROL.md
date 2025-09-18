# 🔄 Control de Versiones - PIZZANA Dashboard

## 📍 Checkpoint Actual: v1.0.0-stable

Este repositorio tiene configurado un sistema de checkpoints usando Git para poder volver fácilmente a versiones estables.

## 🎯 Versión Estable Actual

**Tag:** `v1.0.0-stable`
**Commit:** `c34f2ee`
**Fecha:** 18 de Septiembre, 2025

### ✅ Características de esta versión:
- ✅ Dashboard completamente funcional
- ✅ API conectada a Google Sheets (1000+ pedidos)
- ✅ Gráficos interactivos (CandlestickChart, DailyRevenueChart)
- ✅ Tres secciones principales: General, Local, Eventos
- ✅ Filtros de fecha operativos
- ✅ Diseño responsive con Tailwind CSS
- ✅ Formato de moneda chilena (CLP)
- ✅ TypeScript con Next.js 15

## 🔄 Cómo usar los checkpoints

### Para volver a la versión estable:
```bash
# Opción 1: Crear una nueva rama desde el checkpoint
git checkout -b restore-stable v1.0.0-stable

# Opción 2: Resetear la rama actual al checkpoint (⚠️ CUIDADO: pierde cambios)
git reset --hard v1.0.0-stable

# Opción 3: Solo ver el estado del checkpoint sin cambiar
git checkout v1.0.0-stable
```

### Para crear un nuevo checkpoint:
```bash
# 1. Hacer commit de los cambios actuales
git add .
git commit -m "Descripción de los cambios"

# 2. Crear un nuevo tag
git tag -a v1.1.0 -m "Descripción de la nueva versión"

# 3. Ver todos los checkpoints
git tag -l
```

### Para comparar versiones:
```bash
# Ver diferencias entre versiones
git diff v1.0.0-stable..HEAD

# Ver log entre versiones
git log v1.0.0-stable..HEAD --oneline
```

## 📋 Historial de Versiones

| Versión | Fecha | Descripción | Estado |
|---------|-------|-------------|---------|
| v1.0.0-stable | 2025-09-18 | Dashboard inicial funcional | ✅ Estable |

## 🚨 Recomendaciones

1. **Antes de hacer cambios grandes:** Siempre crear un nuevo checkpoint
2. **Después de cambios exitosos:** Crear un nuevo tag de versión
3. **Si algo se rompe:** Usar `git checkout v1.0.0-stable` para volver al estado funcional
4. **Para experimentar:** Crear ramas desde el checkpoint estable

## 📝 Comandos útiles

```bash
# Ver estado actual
git status

# Ver historial
git log --oneline --graph

# Ver archivos ignorados
cat .gitignore

# Crear backup rápido
git stash push -m "Backup antes de cambios"

# Restaurar backup
git stash pop
```

## 🤖 Generado con Claude Code

Este sistema de control de versiones fue configurado automáticamente para facilitar el desarrollo y mantenimiento del dashboard PIZZANA.