#!/bin/bash
echo "🗑️ Suppression du système codes promo redondant..."

FILE="index.html"

# Supprimer la section codes promo complète
sed -i '/\/\/ ===== SYSTÈME CODES PROMO INTÉGRÉ AU PANIER =====/,/\/\/ ===== FONCTION PRINCIPALE POUR AJOUTER AU PANIER =====/d' "$FILE"

# Supprimer les fonctions de validation redondantes
sed -i '/function validateAndApplyPromo()/,/^}$/d' "$FILE"
sed -i '/function simulatePromoValidation()/,/^}$/d' "$FILE"
sed -i '/function updateActivePromoDisplay()/,/^}$/d' "$FILE"

# Supprimer les appels de mise à jour redondants
sed -i '/updateActivePromoDisplay();/d' "$FILE"

echo "✅ Système codes promo redondant supprimé !"
