#!/bin/bash
echo "🔄 Modification des boutons Ajouter au panier..."

FILE="index.html"

# Sauvegarder une copie de sécurité
cp "$FILE" "${FILE}.backup"

# Remplacer tous les onclick addToCartAndTrack par ajouterAuPanier
sed -i 's/onclick="addToCartAndTrack(/onclick="ajouterAuPanier(/g' "$FILE"

# Remplacer les fonctions spécifiques pour les produits
sed -i 's/addToCartAndTrack('\''T-shirt logo arabe'\'', '\''t-shirts'\'', 349)/ajouterAuPanier('\''T-shirt logo arabe'\'', '\''t-shirts'\'', 349)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''Ensemble capuche style arabe'\'', '\''ensembles'\'', 419)/ajouterAuPanier('\''Ensemble capuche style arabe'\'', '\''ensembles'\'', 419)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''Combinaison T-shirt et Capuche'\'', '\''ensembles'\'', 419)/ajouterAuPanier('\''Combinaison T-shirt et Capuche'\'', '\''ensembles'\'', 419)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''T-shirt Enfant'\'', '\''enfants'\'', 279)/ajouterAuPanier('\''T-shirt Enfant'\'', '\''enfants'\'', 279)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''Ensemble T-shirt et jogging'\'', '\''ensembles'\'', 559)/ajouterAuPanier('\''Ensemble T-shirt et jogging'\'', '\''ensembles'\'', 559)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''Pull bleu'\'', '\''t-shirts'\'', 489)/ajouterAuPanier('\''Pull bleu'\'', '\''t-shirts'\'', 489)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''Capuchon blanc'\'', '\''accessoires'\'', 209)/ajouterAuPanier('\''Capuchon blanc'\'', '\''accessoires'\'', 209)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''T-shirt et jogging Complet'\'', '\''ensembles'\'', 629)/ajouterAuPanier('\''T-shirt et jogging Complet'\'', '\''ensembles'\'', 629)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''Babs Premium'\'', '\''ensembles'\'', 1049)/ajouterAuPanier('\''Babs Premium'\'', '\''ensembles'\'', 1049)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''T-shirt Fille Noir'\'', '\''t-shirts'\'', 279)/ajouterAuPanier('\''T-shirt Fille Noir'\'', '\''t-shirts'\'', 279)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''T-shirt Fille Blanc'\'', '\''t-shirts'\'', 419)/ajouterAuPanier('\''T-shirt Fille Blanc'\'', '\''t-shirts'\'', 419)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''Pull Blanc'\'', '\''pulls'\'', 419)/ajouterAuPanier('\''Pull Blanc'\'', '\''pulls'\'', 419)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''T-shirt Beige'\'', '\''t-shirts'\'', 279)/ajouterAuPanier('\''T-shirt Beige'\'', '\''t-shirts'\'', 279)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''T-shirt Blanc'\'', '\''t-shirts'\'', 279)/ajouterAuPanier('\''T-shirt Blanc'\'', '\''t-shirts'\'', 279)/g' "$FILE"
sed -i 's/addToCartAndTrack('\''T-shirt ADX Noir'\'', '\''t-shirts'\'', 279)/ajouterAuPanier('\''T-shirt ADX Noir'\'', '\''t-shirts'\'', 279)/g' "$FILE"

echo "✅ Boutons modifiés avec succès !"
echo "📋 Vérification des modifications :"
grep -n "ajouterAuPanier" "$FILE" | head -10
