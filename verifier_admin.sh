#!/bin/bash

echo "🔍 Vérification de la version admin fonctionnelle..."

# Vérifier si le fichier contient la section admin
if grep -q "admin-section" reductions.html; then
    echo "✅ Section admin trouvée dans le HTML"
else
    echo "❌ Section admin NON trouvée"
fi

# Vérifier les fonctions admin
if grep -q "showAdminDashboard" reductions.html; then
    echo "✅ Fonction showAdminDashboard trouvée"
else
    echo "❌ Fonction showAdminDashboard manquante"
fi

# Vérifier l'authentification
if grep -q "AuthManager" reductions.html; then
    echo "✅ AuthManager trouvé"
else
    echo "❌ AuthManager manquant"
fi

# Vérifier la détection admin
if grep -q "checkAdminStatus" reductions.html; then
    echo "✅ checkAdminStatus trouvé"
else
    echo "❌ checkAdminStatus manquant"
fi

echo ""
echo "📊 RÉSUMÉ:"
echo "Si toutes les vérifications sont ✅, la version devrait être fonctionnelle"
echo "Ouvre reductions.html et teste la connexion admin"
