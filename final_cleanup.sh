#!/bin/bash
echo "🧹 Nettoyage final des dernières occurrences..."

FILE="index.html"

# 1. Supprimer les appels restants de addToCartAndTrack dans les boutons quick-view
sed -i 's/trackProductView('\''T-shirt logo arabe'\'', '\''t-shirts'\'', 349)/console.log('\''Vue produit: T-shirt logo arabe'\'')/g' "$FILE"
sed -i 's/trackProductView('\''Ensemble capuche style arabe'\'', '\''ensembles'\'', 419)/console.log('\''Vue produit: Ensemble capuche style arabe'\'')/g' "$FILE"
sed -i 's/trackProductView('\''Combinaison T-shirt et Capuche'\'', '\''ensembles'\'', 419)/console.log('\''Vue produit: Combinaison T-shirt et Capuche'\'')/g' "$FILE"
sed -i 's/trackProductView('\''T-shirt Enfant'\'', '\''enfants'\'', 279)/console.log('\''Vue produit: T-shirt Enfant'\'')/g' "$FILE"
sed -i 's/trackProductView('\''Ensemble T-shirt et jogging'\'', '\''ensembles'\'', 559)/console.log('\''Vue produit: Ensemble T-shirt et jogging'\'')/g' "$FILE"
sed -i 's/trackProductView('\''Pull bleu'\'', '\''t-shirts'\'', 489)/console.log('\''Vue produit: Pull bleu'\'')/g' "$FILE"
sed -i 's/trackProductView('\''Capuchon blanc'\'', '\''accessoires'\'', 209)/console.log('\''Vue produit: Capuchon blanc'\'')/g' "$FILE"
sed -i 's/trackProductView('\''T-shirt et jogging Complet'\'', '\''ensembles'\'', 629)/console.log('\''Vue produit: T-shirt et jogging Complet'\'')/g' "$FILE"
sed -i 's/trackProductView('\''Babs Premium'\'', '\''ensembles'\'', 1049)/console.log('\''Vue produit: Babs Premium'\'')/g' "$FILE"
sed -i 's/trackProductView('\''T-shirt Fille Noir'\'', '\''t-shirts'\'', 279)/console.log('\''Vue produit: T-shirt Fille Noir'\'')/g' "$FILE"
sed -i 's/trackProductView('\''T-shirt Fille Blanc'\'', '\''t-shirts'\'', 419)/console.log('\''Vue produit: T-shirt Fille Blanc'\'')/g' "$FILE"
sed -i 's/trackProductView('\''Pull Blanc'\'', '\''pulls'\'', 419)/console.log('\''Vue produit: Pull Blanc'\'')/g' "$FILE"
sed -i 's/trackProductView('\''T-shirt Beige'\'', '\''t-shirts'\'', 279)/console.log('\''Vue produit: T-shirt Beige'\'')/g' "$FILE"
sed -i 's/trackProductView('\''T-shirt Blanc'\'', '\''t-shirts'\'', 279)/console.log('\''Vue produit: T-shirt Blanc'\'')/g' "$FILE"
sed -i 's/trackProductView('\''T-shirt ADX Noir'\'', '\''t-shirts'\'', 279)/console.log('\''Vue produit: T-shirt ADX Noir'\'')/g' "$FILE"

# 2. Supprimer les variables floatingCart restantes
# Chercher et supprimer les lignes spécifiques avec floatingCart
sed -i '/let floatingCart = JSON.parse(localStorage.getItem/d' "$FILE"
sed -i '/floatingCart = JSON.parse(localStorage.getItem/d' "$FILE"

# 3. Supprimer la fonction trackProductView si elle existe encore
sed -i '/function trackProductView(productName, category, price)/,/^}$/d' "$FILE"

echo "✅ Nettoyage final terminé !"
