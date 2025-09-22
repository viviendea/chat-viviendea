# Chat Viviendea 💬

Widget de chat interactivo desarrollado con React y TypeScript, diseñado para ser integrado fácilmente en cualquier sitio web a través de jsDelivr CDN.

## 🚀 Uso rápido del widget

```html
<!-- Incluir CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/viviendea/chat-viviendea@latest/widget-dist/chat-viviendea.css">

<!-- Incluir JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/viviendea/chat-viviendea@latest/widget-dist/chat-widget.umd.js"></script>

<!-- Inicializar -->
<script>
  window.initChatWidget({
    position: 'bottom-right'
  });
</script>
```

📖 **[Ver documentación completa del widget →](./WIDGET_USAGE.md)**

## 🛠️ Desarrollo local

### Prerrequisitos
- Node.js 18+
- npm

### Instalación
```bash
git clone https://github.com/viviendea/chat-viviendea.git
cd chat-viviendea
npm install
```

### Scripts disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run preview          # Preview del build

# Build
npm run build            # Build de la aplicación principal
npm run build:widget     # Build del widget para CDN

# Testing
npm run test             # Ejecutar tests
npm run test:ci          # Tests en modo CI
npm run test:watch       # Tests en modo watch
npm run coverage         # Reporte de cobertura

# Linting
npm run lint             # Verificar código
npm run lint:fix         # Corregir problemas automáticamente
npm run type-check       # Verificar tipos TypeScript
```

## 🏗️ Arquitectura del proyecto

```
src/
├── components/          # Componentes React
│   ├── Chat/           # Componente principal del chat
│   ├── InputArea/      # Área de input de mensajes
│   ├── Message/        # Componente de mensaje individual
│   └── ...
├── hooks/              # Custom hooks
├── services/           # Servicios (API, etc.)
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Utilidades y helpers
├── widget.ts           # Punto de entrada del widget
└── app.css            # Estilos principales
```

## 📦 Build del widget

El widget se construye en dos formatos:

- **UMD** (`chat-widget.umd.js`): Para uso directo en navegadores
- **ES Modules** (`chat-widget.es.js`): Para bundlers modernos

Los archivos se generan en `widget-dist/` y están listos para ser distribuidos via CDN.

## 🔄 Releases y distribución

El proyecto está configurado para crear releases automáticos cuando se crean tags:

```bash
# Crear un nuevo release
git tag v1.0.0
git push origin v1.0.0
```

Esto disparará automáticamente:
1. Build del widget
2. Creación del release en GitHub
3. Los archivos estarán disponibles en jsDelivr en minutos

## 🧪 Testing

El proyecto incluye tests unitarios con Vitest y Testing Library:

```bash
npm run test           # Ejecutar todos los tests
npm run coverage       # Ver reporte de cobertura
```

## 🎨 Tecnologías utilizadas

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **Vitest** - Framework de testing
- **ESLint + Prettier** - Linting y formateo

## 📝 Licencia

MIT License - ver [LICENSE](./LICENSE) para detalles.

---

Desarrollado por **Viviendea** 🏠