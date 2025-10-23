#!/bin/bash
echo "🔧 Mise à jour de onAuthStateChanged pour le parrainage"

# Créer une sauvegarde
cp auth.js auth.js.backup.authstate

# Mettre à jour onAuthStateChanged
sed -i 's/onAuthStateChanged(user) {/onAuthStateChanged(user) {\n        if (user) {\n            console.log(\"Utilisateur connecté:\", user.email);\n            this.mettreAJourInterfaceParrainage(user.uid);\n        } else {\n            console.log(\"Utilisateur déconnecté\");\n        }/' auth.js

# Supprimer les doublons
sed -i '/if (user) {/,/} else {/,/} else {/d' auth.js
sed -i '/onAuthStateChanged(user) {/,/^    }/c\
    onAuthStateChanged(user) {\
        if (user) {\
            console.log(\"Utilisateur connecté:\", user.email);\
            this.mettreAJourInterfaceParrainage(user.uid);\
        } else {\
            console.log(\"Utilisateur déconnecté\");\
        }\
    }' auth.js

echo "✅ onAuthStateChanged mis à jour"
