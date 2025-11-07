// firebase-unified-manager.js - VERSION CORRIGÉE
class FirebaseUnifiedManager {
    constructor() {
        this.db = null;
        this.auth = null;
        this.initialized = false;
        this.init();
    }

    init() {
        try {
            // Vérifier si Firebase est déjà initialisé
            if (typeof firebase === 'undefined') {
                console.error('❌ Firebase non chargé');
                this.retryInitialization();
                return;
            }

            // Configuration Firebase
            const firebaseConfig = {
                apiKey: "AIzaSyC-OHtqpgOZI9AIb_WotYbiUS2L-Ac5vII",
                authDomain: "andu-xara-promo-codes-ff69e.firebaseapp.com",
                projectId: "andu-xara-promo-codes-ff69e",
                storageBucket: "andu-xara-promo-codes-ff69e.firebasestorage.app",
                messagingSenderId: "653516716143",
                appId: "1:653516716143:web:08ee1425191b4a1766359a"
            };

            // Initialiser Firebase seulement si pas déjà fait
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.db = firebase.firestore();
            this.auth = firebase.auth();
            this.initialized = true;

            console.log('✅ Firebase initialisé avec succès');

            // Déclencher l'événement de chargement réussi
            window.dispatchEvent(new CustomEvent('firebaseReady'));

        } catch (error) {
            console.error('❌ Erreur initialisation Firebase:', error);
            this.retryInitialization();
        }
    }

    retryInitialization() {
        console.log('🔄 Nouvelle tentative d\'initialisation Firebase...');
        setTimeout(() => {
            this.init();
        }, 2000);
    }

    async waitForFirebase(maxAttempts = 10) {
        let attempts = 0;
        while (!this.initialized && attempts < maxAttempts) {
            console.log(`⏳ Attente Firebase... (${attempts + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        
        if (this.initialized) {
            console.log('✅ Firebase prêt après', attempts, 'tentatives');
            return true;
        } else {
            console.warn('⚠️ Firebase non initialisé après', maxAttempts, 'tentatives');
            return false;
        }
    }

    // Méthodes pour le panier
    async getPanier(userId) {
        if (!this.initialized) {
            await this.waitForFirebase();
        }

        try {
            const doc = await this.db.collection('paniers').doc(userId).get();
            if (doc.exists) {
                return doc.data();
            } else {
                // Créer un panier vide si inexistant
                const panierVide = { items: [], total: 0, lastUpdated: new Date() };
                await this.db.collection('paniers').doc(userId).set(panierVide);
                return panierVide;
            }
        } catch (error) {
            console.error('❌ Erreur récupération panier:', error);
            return { items: [], total: 0 };
        }
    }

    async savePanier(userId, panierData) {
        if (!this.initialized) {
            await this.waitForFirebase();
        }

        try {
            await this.db.collection('paniers').doc(userId).set({
                ...panierData,
                lastUpdated: new Date()
            });
            console.log('💾 Panier sauvegardé avec succès');
            return true;
        } catch (error) {
            console.error('❌ Erreur sauvegarde panier:', error);
            return false;
        }
    }

    // Méthodes pour les produits
    async getProducts() {
        if (!this.initialized) {
            await this.waitForFirebase();
        }

        try {
            const snapshot = await this.db.collection('products').get();
            const products = [];
            snapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
            return products;
        } catch (error) {
            console.error('❌ Erreur récupération produits:', error);
            return [];
        }
    }
}

// Initialiser globalement
window.firebaseManager = new FirebaseUnifiedManager();
