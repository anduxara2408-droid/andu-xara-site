#!/bin/bash

echo "🔧 Injection de tes vraies credentials Firebase..."

# Créer une sauvegarde
cp reductions.html reductions_avant_injection.html

# Créer le correctif Firebase avec TES données
cat > firebase_correction.html << 'FIREBASECORR'
<script>
// ===== CONFIGURATION FIREBASE AVEC TES VRAIES CLÉS =====
const firebaseConfig = {
    apiKey: "AIzaSyC-OHtqpgOZI9AIb_WotYbiUS2L-Ac5vII",
    authDomain: "andu-xara-promo-codes-ff69e.firebaseapp.com",
    projectId: "andu-xara-promo-codes-ff69e", 
    storageBucket: "andu-xara-promo-codes-ff69e.firebasestorage.app",
    messagingSenderId: "653516716143",
    appId: "1:653516716143:web:08ee1425191b4a1766359a"
};

// Initialiser Firebase
if (typeof firebase !== 'undefined') {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        console.log("✅ Firebase initialisé avec succès");
        
        // TES IDENTIFIANTS ADMIN
        const ADMIN_EMAIL = "cheikhdiabira2408@gmail.com";
        const ADMIN_PASSWORD = "ton_mot_de_passe"; // Remplace par ton vrai mot de passe
        
        window.ADMIN_CREDENTIALS = {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        };
        
    } catch (error) {
        console.error("❌ Erreur Firebase:", error);
    }
}
</script>
FIREBASECORR

# Injecter la correction après les scripts Firebase
sed -i '/firebase-app-compat.js"><\/script>/r firebase_correction.html' reductions.html

# Nettoyer
rm firebase_correction.html

echo "✅ Tes credentials admin ont été injectés"
echo "📧 Email: cheikhdiabira2408@gmail.com"
echo "🔑 Mot de passe: [ton mot de passe réel]"
echo "🎯 Maintenant utilise TES vraies credentials pour te connecter"
