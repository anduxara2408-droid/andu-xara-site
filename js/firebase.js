// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-OHtqpgOZI9AIb_WotYbiUS2L-Ac5vII",
    authDomain: "andu-xara-promo-codes-ff69e.firebaseapp.com",
    projectId: "andu-xara-promo-codes-ff69e",
    storageBucket: "andu-xara-promo-codes-ff69e.firebasestorage.app",
    messagingSenderId: "653516716143",
    appId: "1:653516716143:web:08ee1425191b4a1766359a"
    // On enlève databaseURL car on n'utilise pas Realtime Database
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Exporter les services
const auth = firebase.auth();
const db = firebase.firestore();

console.log('✅ Firebase initialisé (Firestore uniquement)');
