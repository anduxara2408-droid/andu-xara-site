// Configuration Firebase pour Andu Xara
const firebaseConfig = {
    apiKey: "AIzaSyBjzBW5ADllWk2292Xv1C3mlm4X08XyknM",
    authDomain: "andu-xara-online-counter.firebaseapp.com",
    databaseURL: "https://andu-xara-online-counter-default-rtdb.firebaseio.com",
    projectId: "andu-xara-online-counter",
    storageBucket: "andu-xara-online-counter.firebasestorage.app",
    messagingSenderId: "89485701999",
    appId: "1:89485701999:web:0884ea2f5d246570f1ee9a",
    measurementId: "G-0FN2XN1QGG"
};

// Initialiser Firebase
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialisé pour Andu Xara');
}
