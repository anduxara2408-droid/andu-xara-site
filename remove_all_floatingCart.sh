#!/bin/bash
echo "🧹 Suppression de toutes les références à floatingCart..."

FILE="index.html"

# Supprimer toutes les lignes contenant floatingCart (sauf commentaires)
sed -i '/floatingCart\./d' "$FILE"

# Supprimer les déclarations de variables
sed -i '/let floatingCart/d' "$FILE"
sed -i '/floatingCart =/d' "$FILE"

# Supprimer les console.log avec floatingCart
sed -i '/console.log.*floatingCart/d' "$FILE"

echo "✅ Toutes les références floatingCart supprimées !"
