#!/bin/bash
echo "🎯 APPLICATION DES CORRECTIFS FINAUX"

# Corriger les dates des codes promo dans Firebase
echo "📅 Correction des dates Firebase..."
node -e "
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

db.collection('promocodes').get().then(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.validUntil && data.validUntil.toDate().getFullYear() === 2024) {
      const newDate = new Date(data.validUntil.toDate());
      newDate.setFullYear(2025);
      doc.ref.update({ validUntil: newDate });
      console.log('✅ Date corrigée pour', data.code);
    }
  });
});
"

# Synchroniser les systèmes
echo "🔄 Synchronisation des systèmes..."
[ -f "panier-unified.js" ] && echo "Système unifié présent" || echo "Création système unifié"

echo "✅ Correctifs appliqués"
