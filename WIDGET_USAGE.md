# 🚀 Chat Viviendea Widget

Widget de chat interactivo que puede ser integrado fácilmente en cualquier sitio web usando jsDelivr CDN.

## 📦 Instalación y Uso

### Opción 1: Uso directo con jsDelivr (Recomendado)

Agrega estos elementos a tu página HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi sitio web con Chat Viviendea</title>
    
    <!-- Incluir estilos CSS del widget -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/viviendea/chat-viviendea@latest/widget-dist/chat-viviendea.css">
</head>
<body>
    <!-- Tu contenido web aquí -->
    <h1>Mi sitio web</h1>
    <p>Contenido de la página...</p>

    <!-- El widget se creará automáticamente -->
    <!-- Incluir JavaScript del widget -->
    <script src="https://cdn.jsdelivr.net/gh/viviendea/chat-viviendea@latest/widget-dist/chat-widget.umd.js"></script>
    
    <!-- Configurar e inicializar el widget -->
    <script>
        // Configuración básica
        window.initChatWidget({
            containerId: 'chat-viviendea-widget',
            position: 'bottom-right',
            width: '400px',
            height: '600px'
        });
    </script>
</body>
</html>
```

### Opción 2: Configuración avanzada

```html
<script>
    // Configuración avanzada del widget
    const chatWidget = new window.ChatViviendea({
        containerId: 'mi-chat-personalizado',
        position: 'bottom-left',
        width: '450px',
        height: '700px',
        theme: 'light',
        initialMessages: [
            {
                content: '¡Hola! ¿En qué puedo ayudarte hoy?',
                role: 'assistant',
                timestamp: new Date()
            }
        ]
    });
    
    // Inicializar el widget
    chatWidget.init();
    
    // Métodos disponibles
    // chatWidget.toggle();     // Mostrar/ocultar widget
    // chatWidget.destroy();    // Eliminar widget completamente
</script>
```

### Opción 3: Con versión específica

Para mayor estabilidad, especifica una versión particular:

```html
<!-- Usar versión específica (reemplaza v1.0.0 con la versión deseada) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/viviendea/chat-viviendea@v1.0.0/widget-dist/chat-viviendea.css">
<script src="https://cdn.jsdelivr.net/gh/viviendea/chat-viviendea@v1.0.0/widget-dist/chat-widget.umd.js"></script>
```

## ⚙️ Opciones de configuración

| Opción | Tipo | Valor por defecto | Descripción |
|--------|------|-------------------|-------------|
| `containerId` | string | `'chat-viviendea-widget'` | ID del contenedor HTML |
| `position` | string | `'bottom-right'` | Posición del widget (`'bottom-right'`, `'bottom-left'`, `'custom'`) |
| `width` | string | `'400px'` | Ancho del widget |
| `height` | string | `'600px'` | Alto del widget |
| `theme` | string | `'light'` | Tema del widget (`'light'`, `'dark'`) |
| `initialMessages` | array | `[]` | Mensajes iniciales del chat |

## 🎨 Personalización CSS

Puedes personalizar la apariencia del widget sobrescribiendo las clases CSS:

```css
/* Personalizar el contenedor principal */
.chat-viviendea-container {
    border-radius: 16px !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
}

/* Personalizar para dispositivos móviles */
@media (max-width: 768px) {
    .chat-viviendea-container {
        border-radius: 0 !important;
    }
}
```

## 📱 Comportamiento responsivo

El widget se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop**: Se muestra como widget flotante en la posición especificada
- **Mobile**: Se expande a pantalla completa para mejor usabilidad

## 🔄 Métodos disponibles

### `initChatWidget(config)`
Función de conveniencia para inicializar rápidamente el widget.

```javascript
const widget = window.initChatWidget({
    position: 'bottom-left',
    theme: 'dark'
});
```

### `ChatViviendea` Class

#### Constructor
```javascript
const widget = new window.ChatViviendea(config);
```

#### Métodos

- **`init()`**: Inicializa y muestra el widget
- **`destroy()`**: Elimina completamente el widget del DOM
- **`toggle()`**: Alterna la visibilidad del widget
- **`updateConfig(newConfig)`**: Actualiza la configuración del widget

```javascript
// Ejemplo de uso de métodos
const widget = new window.ChatViviendea({
    position: 'bottom-right'
});

widget.init();

// Cambiar configuración
widget.updateConfig({
    width: '500px',
    theme: 'dark'
});

// Alternar visibilidad
widget.toggle();
```

## 🌐 Compatibilidad con navegadores

El widget es compatible con:

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🚀 Ejemplos de integración

### WordPress
Agrega el código en el archivo `footer.php` de tu tema o usa un plugin de inserción de código.

### Shopify
Agrega el código en el archivo `theme.liquid` antes del tag `</body>`.

### HTML estático
Incluye directamente en tus archivos HTML.

### React/Vue/Angular
```javascript
// En React
useEffect(() => {
    // Cargar dinámicamente el widget
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/viviendea/chat-viviendea@latest/widget-dist/chat-widget.umd.js';
    script.onload = () => {
        window.initChatWidget({
            position: 'bottom-right'
        });
    };
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
        if (window.ChatViviendea) {
            // Limpiar widget si es necesario
        }
    };
}, []);
```

## 🆘 Resolución de problemas

### El widget no aparece
1. Verifica que los archivos CSS y JS se están cargando correctamente
2. Revisa la consola del navegador en busca de errores
3. Asegúrate de que el `containerId` no esté en conflicto con otros elementos

### Conflictos de estilos
El widget usa CSS scoped con la clase `.chat-viviendea-container` para evitar conflictos. Si experimentas problemas de estilos, usa `!important` en tus reglas CSS personalizadas.

### Rendimiento
El widget está optimizado y minificado. El archivo UMD pesa aproximadamente 185KB (gzipped).

## 📝 Licencia

MIT License - consulta el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Este widget es desarrollado por el equipo de Viviendea. Para reportar problemas o sugerir mejoras, por favor usa los GitHub Issues del repositorio.

---

**Viviendea** - Innovando en soluciones inmobiliarias digitales