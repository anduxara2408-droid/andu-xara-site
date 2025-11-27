// js/firebase-config.js - Configuration sécurisée
console.log('🔥 Chargement configuration Firebase...');

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBjzBW5ADllWk2292Xv1C3mlm4X08XyknM",
    authDomain: "andu-xara-promo-codes-ff69e.firebaseapp.com",
    databaseURL: "https://andu-xara-promo-codes-ff69e-default-rtdb.firebaseio.com",
    projectId: "andu-xara-promo-codes-ff69e",
    storageBucket: "andu-xara-promo-codes-ff69e.firebasestorage.app",
    messagingSenderId: "89485701999",
    appId: "1:89485701999:web:0884ea2f5d246570f1ee9a",
    measurementId: "G-0FN2XN1QGG"
};

// Variables globales
let auth, db;
window.FIRESTORE_AVAILABLE = true;

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    auth = firebase.auth();
    db = firebase.firestore();
    
    console.log('✅ Firebase initialisé avec succès');
    
    // Configuration Firestore
    db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });
    
    // Persistence des données
    firebase.firestore().enablePersistence({ synchronizeTabs: true })
        .then(() => console.log('✅ Firestore persistance activée'))
        .catch((err) => {
            console.warn('⚠️ Persistance non disponible:', err.code);
        });
        
} catch (error) {
    console.error('❌ Erreur initialisation Firebase:', error);
    window.FIRESTORE_AVAILABLE = false;
}

// Export pour utilisation globale
window.firebaseAuth = auth;
window.firebaseDb = db;
