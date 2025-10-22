#!/bin/bash
echo "🧹 Nettoyage des fonctions panier redondantes..."

# Fichier à modifier
FILE="index.html"

# Supprimer la section des déclarations globales du panier
sed -i '/\/\/ ===== SYSTÈME DE PANIER - DÉCLARATIONS GLOBALES =====/,/\/\/ ===== FONCTIONS DU PANIER - DÉFINIES EN PREMIER =====/d' "$FILE"

# Supprimer les fonctions spécifiques
sed -i '/function updateFloatingCart()/,/^}$/d' "$FILE"
sed -i '/function removeFromFloatingCart()/,/^}$/d' "$FILE"
sed -i '/function openFloatingCart()/,/^}$/d' "$FILE"
sed -i '/function closeFloatingCart()/,/^}$/d' "$FILE"
sed -i '/function toggleFloatingCart()/,/^}$/d' "$FILE"
sed -i '/function calculateCartTotal()/,/^}$/d' "$FILE"
sed -i '/function applyPromoToCart()/,/^}$/d' "$FILE"
sed -i '/function removePromoFromCart()/,/^}$/d' "$FILE"
sed -i '/function validateAndApplyPromo()/,/^}$/d' "$FILE"
sed -i '/function simulatePromoValidation()/,/^}$/d' "$FILE"

# Supprimer les variables globales redondantes
sed -i '/let floatingCart = JSON.parse/d' "$FILE"
sed -i '/let activePromoCode = null/d' "$FILE"
sed -i '/let promoDiscount = 0/d' "$FILE"

echo "✅ Nettoyage terminé !"
