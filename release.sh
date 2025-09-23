#!/bin/bash

# Script para crear nueva versión con changelog
# Uso: ./release.sh 1.0.3 "Descripción de cambios"

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Uso: $0 <version> <descripción>"
    echo "Ejemplo: $0 1.0.3 'Corregido bug en Message component'"
    exit 1
fi

VERSION=$1
DESCRIPTION=$2
DATE=$(date +%Y-%m-%d)

echo "Creando release v$VERSION..."

# Actualizar package.json
npm version $VERSION --no-git-tag-version

# Actualizar CHANGELOG.md (si existe)
if [ -f "CHANGELOG.md" ]; then
    # Crear backup
    cp CHANGELOG.md CHANGELOG.md.bak
    
    # Insertar nueva versión en CHANGELOG
    sed -i '' "/## \[Sin publicar\]/a\\
\\
## [$VERSION] - $DATE\\
\\
### Cambiado\\
- $DESCRIPTION\\
" CHANGELOG.md
fi

# Commit de cambios
git add .
git commit -m "chore: bump version to v$VERSION

$DESCRIPTION"

# Crear tag con mensaje
git tag -a "v$VERSION" -m "v$VERSION - $DATE

$DESCRIPTION"

echo "✅ Versión v$VERSION creada"
echo "Para publicar ejecuta: git push origin main --tags"