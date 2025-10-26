// js/secure/firebase-unified-manager.js
class FirebaseUnifiedManager {
    constructor() {
        this.config = {
            apiKey: "AIzaSyC-OHtqpgOZI9AIb_WotYbiUS2L-Ac5vII",
            authDomain: "andu-xara-promo-codes-ff69e.firebaseapp.com",
            projectId: "andu-xara-promo-codes-ff69e",
            storageBucket: "andu-xara-promo-codes-ff69e.appspot.com",
            messagingSenderId: "890174371566",
            appId: "1:890174371566:web:2c8d6d1a0e1d5f5f7689e2"
        };
        
        this.init();
    }

    init() {
        try {
            // Attendre que Firebase soit chargé
            if (typeof firebase === 'undefined') {
                console.log("⏳ En attente de Firebase...");
                setTimeout(() => this.init(), 500);
                return;
            }

            // Vérifier si déjà initialisé
            if (!firebase.apps.length) {
                console.log("🔄 Initialisation de Firebase...");
                firebase.initializeApp(this.config);
            } else {
                console.log("✅ Firebase déjà initialisé");
            }

            this.db = firebase.firestore();
            this.auth = firebase.auth();
            
            this.setupCreditsSync();
            console.log("🎯 Firebase Unified Manager prêt");
            
        } catch (error) {
            console.error("❌ Erreur initialisation Firebase:", error);
        }
    }

    setupCreditsSync() {
        // Synchronisation initiale
        this.loadCreditsFromStorage();
        
        // Écouter les changements de localStorage (entre pages/onglets)
        window.addEventListener('storage', (e) => {
            if (e.key === 'anduxara_referral_credits') {
                const credits = parseInt(e.newValue || '0');
                this.notifyCreditsUpdate(credits);
            }
        });

        console.log("🔄 Synchronisation crédits activée");
    }

    loadCreditsFromStorage() {
        const stored = localStorage.getItem('anduxara_referral_credits');
        const credits = stored ? parseInt(stored) : 0;
        console.log("💰 Crédits chargés:", credits, "MRU");
        return credits;
    }

    saveCreditsToStorage(credits) {
        localStorage.setItem('anduxara_referral_credits', credits.toString());
        localStorage.setItem('anduxara_credits_last_update', new Date().toISOString());
    }

    notifyCreditsUpdate(credits) {
        window.dispatchEvent(new CustomEvent('referralCreditsUpdated', {
            detail: { 
                credits: credits,
                timestamp: new Date().toISOString()
            }
        }));
    }

    // Méthodes publiques
    getCurrentCredits() {
        return this.loadCreditsFromStorage();
    }

    setCredits(credits) {
        this.saveCreditsToStorage(credits);
        this.notifyCreditsUpdate(credits);
        console.log("💰 Crédits définis:", credits, "MRU");
    }

    calculateDiscount(cartTotal) {
        const credits = this.getCurrentCredits();
        if (credits <= 0) {
            return {
                discount: 0,
                final: cartTotal,
                creditsUsed: 0
            };
        }
        
        const maxDiscount = cartTotal * 0.5;
        const actualDiscount = Math.min(credits, maxDiscount);
        const finalAmount = cartTotal - actualDiscount;
        
        return {
            discount: actualDiscount,
            final: finalAmount,
            creditsUsed: actualDiscount
        };
    }

    // Synchroniser depuis reductions.html
    syncFromReductions(credits) {
        this.setCredits(credits);
    }
}

// Initialisation différée
setTimeout(() => {
    window.firebaseManager = new FirebaseUnifiedManager();
}, 1000);
