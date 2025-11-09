// ===== CORRECTION FIREBASE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 Correction Firebase appliquée');
    
    // Replacer le script Firebase correctement
    const firebaseScript = document.createElement('script');
    firebaseScript.type = 'module';
    firebaseScript.innerHTML = `
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
        import { getDatabase, ref, set, onDisconnect, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

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

        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        
        console.log('🚀 Firebase initialisé avec succès');
        
        // Votre code compteur ici...
        const userId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const userRef = ref(db, 'onlineUsers/' + userId);

        function updateCounterDisplay(count) {
            const counter = document.getElementById('visitorCount');
            if (counter) {
                counter.textContent = count;
            }
        }

        set(userRef, {
            joinedAt: serverTimestamp(),
            lastSeen: Date.now(),
            userAgent: navigator.userAgent.substring(0, 80)
        });

        onDisconnect(userRef).remove();

        const onlineUsersRef = ref(db, 'onlineUsers');
        onValue(onlineUsersRef, (snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                const realTimeCount = Object.keys(users).length;
                updateCounterDisplay(realTimeCount);
            } else {
                updateCounterDisplay(0);
            }
        });
    `;
    
    document.head.appendChild(firebaseScript);
});
