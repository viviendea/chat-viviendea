# GitHub Actions Configuration

Este directorio contiene todos los workflows de GitHub Actions para el proyecto Chat Viviendea.

## Workflows Disponibles

### 1. `ci.yml` - Pipeline Principal CI/CD
**Disparadores:** Push a `main`/`develop`, Pull Requests a `main`

**Jobs:**
- **Test & Lint**: Ejecuta ESLint y tests con cobertura
- **Build Application**: Verifica tipo checking y construye el proyecto
- **Security Audit**: Ejecuta auditoría de seguridad npm

**Artifacts:** Build de producción (solo en main)

### 2. `pr-check.yml` - Verificaciones de Pull Request
**Disparadores:** Apertura, sincronización o reapertura de PR

**Jobs:**
- **PR Validation**: Verificación completa de tipo, lint, tests y build
- **PR Comments & Analysis**: Análisis de cobertura y comentarios

### 3. `deploy.yml` - Deployment
**Disparadores:** Push a `main`, ejecución manual

**Jobs:**
- **Pre-Deploy Tests**: Tests completos antes del deploy
- **Production Build**: Build optimizado para producción
- **Prepare Deployment**: Preparación para deployment (personalizable)

### 4. `code-quality.yml` - Calidad de Código Semanal
**Disparadores:** Programado (lunes 9:00 AM UTC), ejecución manual

**Jobs:**
- **Weekly Code Quality Check**: Análisis comprensivo semanal

## Scripts de Package.json Utilizados

Los workflows utilizan estos scripts definidos en `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest",
    "test:ci": "vitest run",
    "coverage": "vitest run --coverage",
    "build": "tsc -b && vite build",
    "type-check": "tsc --noEmit"
  }
}
```

## Variables de Entorno y Secretos

### Variables de Entorno Disponibles
- `NODE_VERSION`: '20' (Node.js 20 LTS definida en workflows)
- `NODE_ENV`: 'production' (en deploy)

### Secretos Recomendados (configurar en GitHub)
Para añadir secretos: `Settings → Secrets and variables → Actions`

- `VITE_API_BASE_URL`: URL base de la API para producción
- `VITE_APP_VERSION`: Versión de la aplicación (opcional)

## Estado de los Workflows

### Badges de Estado
Puedes agregar estos badges a tu README principal:

```markdown
[![CI/CD Pipeline](https://github.com/viviendea/chat-viviendea/actions/workflows/ci.yml/badge.svg)](https://github.com/viviendea/chat-viviendea/actions/workflows/ci.yml)
[![PR Checks](https://github.com/viviendea/chat-viviendea/actions/workflows/pr-check.yml/badge.svg)](https://github.com/viviendea/chat-viviendea/actions/workflows/pr-check.yml)
[![Deploy](https://github.com/viviendea/chat-viviendea/actions/workflows/deploy.yml/badge.svg)](https://github.com/viviendea/chat-viviendea/actions/workflows/deploy.yml)
```

## Configuración de Branch Protection

Se recomienda configurar las siguientes reglas de protección para la rama `main`:

1. Ir a `Settings → Branches`
2. Agregar regla para `main`
3. Habilitar:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Status checks requeridos:
     - `Test & Lint`
     - `Build Application`
     - `PR Validation`

## Personalización

### Agregar Deployment a Plataformas Específicas

#### Para Vercel:
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
    vercel-args: '--prod'
```

#### Para Netlify:
```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v3.0
  with:
    publish-dir: './dist'
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from GitHub Actions"
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

#### Para GitHub Pages:
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

## Troubleshooting

### Problemas Comunes

1. **Error en tests**: Verificar que todas las dependencias estén en `package.json`
2. **Error en build**: Verificar configuración de TypeScript y Vite
3. **Error de permisos**: Verificar que `GITHUB_TOKEN` tenga permisos necesarios

### Logs y Debugging

- Los logs están disponibles en la pestaña "Actions" del repositorio
- Cada job muestra su salida detallada
- Los artifacts se conservan según la configuración de retención

## Monitoreo

- **Coverage**: Se sube automáticamente a Codecov (si está configurado)
- **Artifacts**: Builds disponibles por 30-90 días
- **Notifications**: GitHub notifica automáticamente sobre fallos