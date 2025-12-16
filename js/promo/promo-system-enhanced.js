// ===== SYSTÈME AUTHENTIFICATION ET RÉDUCTIONS AVEC FIRESTORE =====
window.PromoSystem = class PromoSystem {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.activePromo = null;
        this.init();
    }

    async init() {
        if (!window.FIRESTORE_AVAILABLE) {
            console.log('⚠️ Mode dégradé - Système promo local uniquement');
            return;
        }
        
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.loadUserData();
                console.log('✅ Utilisateur connecté:', user.email);
                this.updateUIWithUserInfo();
            } else {
                console.log('🔐 Utilisateur non connecté');
            }
        });
    }

    async loadUserData() {
        if (!this.currentUser || !window.FIRESTORE_AVAILABLE) return;
        
        try {
            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
            
            if (userDoc.exists) {
                this.userData = userDoc.data();
                console.log('📊 Données utilisateur chargées:', this.userData);
                
                if (this.userData.activePromo) {
                    this.activePromo = this.userData.activePromo;
                    this.applyPromoToCart(this.activePromo.code, this.activePromo.discount);
                }
            } else {
                await this.createUserData();
            }
        } catch (error) {
            console.error('❌ Erreur chargement données:', error);
        }
    }

    async createUserData() {
        if (!window.FIRESTORE_AVAILABLE) {
            console.log('⚠️ Création données en mode local');
            this.userData = {
                email: this.currentUser.email,
                usedPromoCodes: [],
                orders: [],
                rewards: 0,
                userCode: this.generateUserCode()
            };
            return;
        }

        const now = new Date();
        const timestamp = firebase.firestore.Timestamp.fromDate(now);

        const userData = {
            email: this.currentUser.email,
            createdAt: timestamp,
            usedPromoCodes: [],
            orders: [],
            rewards: 0,
            userCode: this.generateUserCode()
        };

        try {
            await db.collection('users').doc(this.currentUser.uid).set(userData);
            this.userData = userData;
            console.log('👤 Nouvel utilisateur créé');
        } catch (error) {
            console.error('❌ Erreur création utilisateur:', error);
            this.userData = userData;
        }
    }

    generateUserCode() {
        return 'AX' + Date.now().toString(36).toUpperCase();
    }

    async validateAndApplyPromo(code) {
        if (!this.currentUser) {
            this.showLoginPrompt();
            return { success: false, message: 'Veuillez vous connecter d\\'abord' };
        }

        try {
            // ✅ CORRECTION : VÉRIFIER EN PREMIER
            const alreadyUsed = await this.checkIfPromoAlreadyUsed(code);
            if (alreadyUsed) {
                console.log('❌ Code déjà utilisé détecté AVANT application');
                return {
                    success: false,
                    message: '❌ Vous avez déjà utilisé ce code promo.'
                };
            }

            if (!window.FIRESTORE_AVAILABLE) {
                return this.applyPromoOffline(code);
            }

            const promoDoc = await db.collection('promoCodes').doc(code.toUpperCase()).get();

            if (!promoDoc.exists) {
                return { success: false, message: 'Code promo invalide' };
            }

            const promoData = promoDoc.data();

            const validation = await this.validatePromoConditions(promoData, code);
            if (!validation.success) {
                return validation;
            }

            // ✅ MARQUER IMMÉDIATEMENT COMME UTILISÉ
            await this.applyPromoToUser(promoData, code);

            return {
                success: true,
                message: `✅ Code ${code} appliqué ! Réduction de ${promoData.discount}%`,
                discount: promoData.discount
            };

        } catch (error) {
            console.error('❌ Erreur validation promo:', error);
            return this.applyPromoOffline(code);
        }
    } // ✅ CORRECTION : ACCOLADE FERMANTE AJOUTÉE

    async checkIfPromoAlreadyUsed(code) {
        const codeUpper = code.toUpperCase();

        // ✅ VÉRIFICATION 1 : Code actuellement actif
        if (this.activePromo && this.activePromo.code === codeUpper) {
            console.log('❌ Code déjà actif actuellement');
            return true;
        }

        // ✅ VÉRIFICATION 2 : Firestore
        if (window.FIRESTORE_AVAILABLE && this.userData && this.userData.usedPromoCodes) {
            const firestoreUsed = this.userData.usedPromoCodes.some(function(usedCode) {
                // Accepter TOUT orderId (même "locked-", "order-", "pending-")
                return usedCode.code === codeUpper;
            });

            if (firestoreUsed) {
                console.log('❌ Code déjà utilisé (Firestore):', codeUpper);
                return true;
            }
        }

        // ✅ VÉRIFICATION 3 : Stockage local
        try {
            const localUsedPromos = JSON.parse(localStorage.getItem('local_used_promos') || '[]');
            const localUsed = localUsedPromos.some(function(promo) {
                return promo.code === codeUpper &&
                       promo.userEmail === (this.currentUser ? this.currentUser.email : 'guest');
            }.bind(this));

            if (localUsed) {
                console.log('❌ Code déjà utilisé (Local):', codeUpper);
                return true;
            }
        } catch (error) {
            console.error('Erreur vérification locale:', error);
        }

        // ✅ VÉRIFICATION 4 : Variable globale activePromoCode
        if (window.activePromoCode === codeUpper) {
            console.log('❌ Code déjà dans variable globale');
            return true;
        }

        return false;
    }

    applyPromoOffline(code) {
        console.log('🔄 Application promo en mode hors ligne...');
        
        const offlineCodes = {
            'BIENVENUE15': { discount: 15, description: 'Bienvenue' },
            'ANDU2025': { discount: 20, description: 'Promo 2025' },
            'SOLDE30': { discount: 30, description: 'Soldes' },
            'PREMIUM25': { discount: 25, description: 'Premium' }
        };
        
        const codeUpper = code.toUpperCase();
        
        if (offlineCodes[codeUpper]) {
            const promo = offlineCodes[codeUpper];
            
            const localUsedPromos = JSON.parse(localStorage.getItem('local_used_promos') || '[]');
            localUsedPromos.push({
                code: codeUpper,
                usedAt: new Date().toISOString(),
                userEmail: this.currentUser ? this.currentUser.email : 'guest',
                offline: true
            });
            localStorage.setItem('local_used_promos', JSON.stringify(localUsedPromos));
            
            this.applyPromoToCart(codeUpper, promo.discount);
            
            return {
                success: true,
                message: `✅ Code ${codeUpper} appliqué (mode hors ligne) ! -${promo.discount}%`,
                discount: promo.discount,
                offline: true
            };
        }
        
        return {
            success: false,
            message: '❌ Code invalide ou connexion requise'
        };
    }

    async validatePromoConditions(promoData, code) {
        if (promoData.expiresAt && promoData.expiresAt.toDate() < new Date()) {
            return { success: false, message: 'Code promo expiré' };
        }

        if (promoData.usageLimit && promoData.usedCount >= promoData.usageLimit) {
            return { success: false, message: 'Code promo épuisé' };
        }

        if (this.userData && this.userData.usedPromoCodes) {
            const codeUpper = code.toUpperCase();

            const alreadyUsed = this.userData.usedPromoCodes.some(function(usedCode) {
                return usedCode.code === codeUpper;
            });

            if (alreadyUsed) {
                console.log('❌ Code déjà utilisé:', codeUpper);
                return {
                    success: false,
                    message: '❌ Vous avez déjà utilisé ce code promo.'
                };
            }
        }

        if (promoData.startsAt && promoData.startsAt.toDate() > new Date()) {
            return { success: false, message: 'Code pas encore valide' };
        }

        return { success: true };
    }

    async applyPromoToUser(promoData, code) {
        const codeUpper = code.toUpperCase();
        const now = new Date();
        const timestamp = firebase.firestore.Timestamp.fromDate(now);
        
        // ✅ MARQUAGE IMMÉDIAT ET PERMANENT
        const usageEntry = {
            code: codeUpper,
            usedAt: timestamp,
            orderId: 'locked-' + Date.now(), // ← Ne commence PAS par "pending"
            discount: promoData.discount,
            status: 'used', // ← Statut définitif
            permanent: true // ← Marqueur permanent
        };
        
        if (window.FIRESTORE_AVAILABLE) {
            try {
                // ✅ ÉCRITURE ATOMIQUE FIRESTORE
                await db.collection('users').doc(this.currentUser.uid).update({
                    usedPromoCodes: firebase.firestore.FieldValue.arrayUnion(usageEntry),
                    activePromo: {
                        code: codeUpper,
                        discount: promoData.discount,
                        appliedAt: now,
                        locked: true // ← Code verrouillé
                    }
                });
                
                await db.collection('promoCodes').doc(codeUpper).update({
                    usedCount: firebase.firestore.FieldValue.increment(1)
                });
                
                console.log('🔒 Code IMMÉDIATEMENT verrouillé dans Firestore');
            } catch (error) {
                console.error('❌ Erreur Firestore:', error);
            }
        }
        
        // ✅ MARQUER AUSSI EN LOCAL (double sécurité)
        const localUsedPromos = JSON.parse(localStorage.getItem('local_used_promos') || '[]');
        localUsedPromos.push({
            code: codeUpper,
            usedAt: now.toISOString(),
            userEmail: this.currentUser.email,
            permanent: true
        });
        localStorage.setItem('local_used_promos', JSON.stringify(localUsedPromos));
        
        this.activePromo = {
            code: codeUpper,
            discount: promoData.discount,
            appliedAt: now,
            locked: true
        };
        
        this.applyPromoToCart(codeUpper, promoData.discount);
        
        console.log('🔒 Code promo DÉFINITIVEMENT BLOQUÉ:', codeUpper);
    }

    applyPromoToCart(code, discount) {
        if (window.floatingCart && Array.isArray(window.floatingCart)) {
            window.floatingCart.forEach(item => {
                item.promoPrice = Math.round(item.price * (1 - discount / 100));
                item.appliedPromo = code;
            });
            
            localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
            
            if (typeof window.updateFloatingCart === 'function') {
                window.updateFloatingCart();
            }
        }
        
        this.updateActivePromoDisplay(code, discount);
    }

    // ===== FONCTION CORRIGÉE COMPLÈTE =====
    async markPromoAsUsedDefinitively(orderData) {
        console.log('🔒 Début markPromoAsUsedDefinitively');

        if (!window.FIRESTORE_AVAILABLE) {
            console.log('⚠️ Firestore indisponible - Marquage local uniquement');
            markPromoUsedLocally(orderData);
            return;
        }

        if (!this.currentUser) {
            console.log('❌ Pas d\\'utilisateur connecté');
            return;
        }

        const promoCode = this.activePromo ? this.activePromo.code :
                         (orderData.promoStatusBeforeCheckout ? orderData.promoStatusBeforeCheckout.promoCode : null);

        if (!promoCode) {
            console.log('❌ Pas de code promo à finaliser');
            return;
        }

        console.log('🔒 Finalisation du code:', promoCode);

        try {
            const userRef = db.collection('users').doc(this.currentUser.uid);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                const now = new Date();
                const timestamp = firebase.firestore.Timestamp.fromDate(now);

                let codeFound = false;
                const updatedCodes = userData.usedPromoCodes.map(function(entry) {
                    if (entry.code === promoCode && entry.orderId && entry.orderId.startsWith('pending-')) {
                        codeFound = true;
                        return {
                            code: entry.code,
                            usedAt: entry.usedAt,
                            orderId: orderData.cartId || 'order-' + Date.now(),
                            orderAmount: orderData.total,
                            finalizedAt: timestamp,
                            discount: entry.discount
                        };
                    }
                    return entry;
                });

                if (!codeFound) {
                    console.log('⚠️ Code pas trouvé en pending, ajout maintenant');
                    updatedCodes.push({
                        code: promoCode,
                        usedAt: timestamp,
                        orderId: orderData.cartId || 'order-' + Date.now(),
                        orderAmount: orderData.total,
                        finalizedAt: timestamp,
                        discount: orderData.promoStatusBeforeCheckout ? orderData.promoStatusBeforeCheckout.promoDiscount : 0
                    });
                }

                await userRef.update({
                    usedPromoCodes: updatedCodes,
                    activePromo: firebase.firestore.FieldValue.delete()
                });

                console.log('✅ Firestore mis à jour avec code définitif');
            }

            this.cleanupPromoStorage();
            console.log('🔒 Code promo définitivement marqué comme utilisé');

        } catch (error) {
            console.error('❌ Erreur marquage définitif:', error);
            markPromoUsedLocally(orderData);
        }
    }

    cleanupPromoStorage() {
        localStorage.removeItem('anduxara_active_promo');
        localStorage.removeItem('anduxara_active_promo_code');
        localStorage.removeItem('anduxara_promo_discount');

        if (window.activePromoCode) window.activePromoCode = null;
        if (window.promoDiscount) window.promoDiscount = 0;

        this.activePromo = null;

        if (typeof updateActivePromoDisplay === 'function') {
            updateActivePromoDisplay();
        }
    }

    updateActivePromoDisplay(code, discount) {
        const display = document.getElementById('active-promo-display');
        const codeElement = document.getElementById('active-promo-code');

        if (display && codeElement) {
            display.style.display = 'block';
            codeElement.textContent = `${code} (-${discount}%)`;
        }
    }

    async removePromo() {
        if (!this.currentUser || !this.activePromo) return;
        
        try {
            if (window.FIRESTORE_AVAILABLE) {
                await db.collection('users').doc(this.currentUser.uid).update({
                    activePromo: firebase.firestore.FieldValue.delete()
                });
            }
            
            this.activePromo = null;
            
            if (window.floatingCart && Array.isArray(window.floatingCart)) {
                window.floatingCart.forEach(item => {
                    item.promoPrice = item.price;
                    delete item.appliedPromo;
                });
                
                localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
                
                if (typeof window.updateFloatingCart === 'function') {
                    window.updateFloatingCart();
                }
            }
            
            this.updateActivePromoDisplay();
            showNotification('🗑️ Code promo retiré');
            
        } catch (error) {
            console.error('❌ Erreur retrait promo:', error);
        }
    }

    showLoginPrompt() {
        const message = `🔐 Connexion Requise
    
Pour utiliser les codes promo, veuillez vous connecter à votre compte.

Voulez-vous vous connecter maintenant ?`;

        if (confirm(message)) {
            const promoInput = document.getElementById('promoInput');
            if (promoInput && promoInput.value.trim()) {
                localStorage.setItem('pending_promo_code', promoInput.value.trim());
            }
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        window.location.href = 'reductions.html?action=login&source=homepage';
    }

    updateUIWithUserInfo() {
        const userInfoElement = document.getElementById('user-info-display');
        if (userInfoElement && this.currentUser) {
            userInfoElement.innerHTML = `
                <div style="background: #e8f5e8; padding: 10px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
                    <span style="color: #27ae60; font-weight: bold;">👤 Connecté: ${this.currentUser.email}</span>
                    ${this.userData ? `<br><small>Code: ${this.userData.userCode}</small>` : ''}
                </div>
            `;
        }
    }
} // ✅ CORRECTION : FERMETURE CORRECTE DE LA CLASSE

// Fonction séparée - doit être en dehors de la classe PromoSystem
function markPromoUsedLocally(orderData) {
    console.log('🔄 Marquage local du code promo...');

    try {
        const localUsedPromos = JSON.parse(localStorage.getItem('local_used_promos') || '[]');

        const promoCode = window.promoSystem && window.promoSystem.activePromo ? 
                         window.promoSystem.activePromo.code :
                         (orderData.promoStatusBeforeCheckout ? orderData.promoStatusBeforeCheckout.promoCode : null);

        if (promoCode) {
            localUsedPromos.push({
                code: promoCode,
                usedAt: new Date().toISOString(),
                orderId: orderData.cartId || 'order-' + Date.now(),
                orderAmount: orderData.total,
                userEmail: window.promoSystem && window.promoSystem.currentUser ? 
                          window.promoSystem.currentUser.email : 'guest'
            });

            localStorage.setItem('local_used_promos', JSON.stringify(localUsedPromos));
            console.log('✅ Code promo marqué localement');
        }

        if (window.promoSystem && window.promoSystem.cleanupPromoStorage) {
            window.promoSystem.cleanupPromoStorage();
        }

    } catch (error) {
        console.error('❌ Erreur marquage local:', error);
    }
}

// Initialiser le système promo
window.promoSystem = null;

window.initPromoSystem = function initPromoSystem() {
    if (!window.promoSystem && typeof window.PromoSystem !== 'undefined') {
        window.promoSystem = new window.PromoSystem();
        console.log('✅ PromoSystem initialisé avec succès');
    }
    return window.promoSystem;
}

// ✅ AJOUT NÉCESSAIRE : Fonction de sécurité pour appeler promoSystem
function safePromoSystemCall(method, ...args) {
    if (!window.promoSystem) {
        console.warn('⚠️ promoSystem non initialisé');
        return null;
    }
    
    if (typeof window.promoSystem[method] !== 'function') {
        console.error(`❌ Méthode ${method} non trouvée dans promoSystem`);
        return null;
    }
    
    return window.promoSystem[method](...args);
}

// Initialiser le système promo IMMÉDIATEMENT
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation DOMContentLoaded - Recherche PromoSystem...');
    
    // Attendre que la classe soit disponible
    const waitForPromoSystem = setInterval(() => {
        if (typeof window.PromoSystem !== 'undefined') {
            clearInterval(waitForPromoSystem);
            console.log('✅ Classe PromoSystem trouvée, initialisation...');
            
            // Initialiser IMMÉDIATEMENT
            window.promoSystem = new window.PromoSystem();
            console.log('✅ PromoSystem initialisé avec succès');
            
            // Vérifier l'authentification
            setTimeout(() => {
                checkAuthFromReductions();
                setInterval(updateAuthStatus, 3000);
            }, 1000);
            
        }
    }, 100);
    
    // Timeout de sécurité
    setTimeout(() => {
        clearInterval(waitForPromoSystem);
        if (typeof window.PromoSystem === 'undefined') {
            console.error('❌ Classe PromoSystem NON TROUVÉE après 5s');
            // Créer une classe de secours
            window.PromoSystem = class PromoSystemFallback {
                constructor() {
                    console.log('🔄 PromoSystem de secours activé');
                    this.currentUser = null;
                    this.userData = null;
                    this.activePromo = null;
                }
            };
            window.promoSystem = new window.PromoSystem();
        }
    }, 5000);
});

</script>
 <!-- DÉSACTIVATION SYSTÈMES PROBLÉMATIQUES -->
    <script src="js/secure/disable-problematic.js"></script>
   <meta name="google-site-verification" content="EN_ATTENTE_DU_CODE">
   <meta name="robots" content="index, follow">
   <meta name="description" content="Andu-Xara - Marque de vêtements alliant culture africaine et style urbain. Exprimez votre héritage avec nos créations uniques qui célèbrent nos racines.">
<!-- 🎯 SCHEMA MARKUP PERFECTIONNÉ -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Andu-Xara",
  "alternateName": "Andu",
  "url": "https://andu-xara.store",
  "description": "Marque de vêtements afro-urbains célébrant la culture africaine et le style contemporain",
  "image": "https://andu-xara.store/images/logo.png",
  
  // ✅ CORRECTION : Un seul email avec le principal
  "email": "contact@andu-xara.store",
  
  "telephone": "+222-34-19-63-04",
  
  // ✅ CORRECTION : Address complet et valide
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Nouakchott, Mauritanie",
    "addressLocality": "Nouakchott",
    "addressRegion": "Nouakchott",
    "addressCountry": "MR",
    "postalCode": "5118"
  },
  
  // ✅ AJOUTER : ContactPoint pour multiples emails
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@andu-xara.store",
      "telephone": "+222-34-19-63-04"
    },
    {
      "@type": "ContactPoint", 
      "contactType": "sales",
      "email": "partenariat@andu-xara.store"
    },
    {
      "@type": "ContactPoint",
      "contactType": "technical support",
      "email": "support@andu-xara.store"
    }
  ],
  
  "brand": {
    "@type": "Brand",
    "name": "Andu-Xara",
    "description": "Vêtements culturels africains et urbains",
    "slogan": "Racines Africaines, Style Moderne"
  },
  
  "openingHours": "Mo-Su 08:00-22:00",
  "priceRange": "€€",
  
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://andu-xara.store/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
    <link rel="icon" href="images/logo.png" type="image/png">
    <link rel="manifest" href="./manifest.json">
    <link rel="stylesheet" href="style-min.css">
    <!-- URL canonique -->
<link rel="canonical" href="https://andu-xara.store/">
    <meta name="theme-color" content="#6a11cb">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="format-detection" content="telephone=no">
 
<style>
/* ===== RESET ET STYLES GLOBAUX ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


body {
    background-color: #f5f7fa;
    color: #333;
    line-height: 1.6;
    overflow-x: hidden;
}

.main-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
}

section, .promo-countdown, .faq-container, #timeline {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
}

.products-grid {
    box-sizing: border-box;
}

img, .product-img, .logo-img {
    max-width: 100% !important;
    height: auto !important;
    display: block;
    object-fit: cover;
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 15px;
    box-sizing: border-box;
}

/* ===== TEXTES RESPONSIVES ===== */
h1, h2, h3, p, span {
    word-wrap: break-word;
    overflow-wrap: break-word;
}

h1 { font-size: clamp(1.4rem, 5vw, 2rem); }
h2 { font-size: clamp(1.2rem, 4vw, 1.6rem); }
p { font-size: clamp(0.9rem, 3vw, 1rem); }

/* ===== ANIMATIONS ===== */
@keyframes popupAnimation {
    0% { transform: scale(0.5); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes popupLeft {
    0% { opacity: 0; transform: scale(0.5) translateX(-50px); }
    100% { opacity: 1; transform: scale(1) translateX(0); }
}

@keyframes bounceLeft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

@keyframes marquee-scroll {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

@keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; visibility: hidden; }
}

/* ===== BANDEAU DÉFILANT ===== */
.marquee-container {
    background: linear-gradient(90deg, #2c3e50, #34495e);
    color: white;
    padding: 12px 0;
    overflow: hidden;
    position: relative;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    width: 100%;
    z-index: 1000;
}

.marquee-content {
    display: flex;
    animation: marquee-scroll 40s linear infinite;
    white-space: nowrap;
}

.marquee-section {
    padding: 0 30px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 100%;
}

.welcome {
    background: linear-gradient(90deg, #6a11cb, #2575fc);
    padding: 6px 20px;
    border-radius: 18px;
    font-size: 14px;
}

.promotion {
    background: linear-gradient(90deg, #ff0066, #ff6600);
    padding: 6px 20px;
    border-radius: 18px;
    font-size: 14px;
}

.original {
    background: linear-gradient(90deg, #00b09b, #96c93d);
    padding: 6px 20px;
    border-radius: 18px;
    font-size: 14px;
}

/* ===== HEADER RÉDUIT ===== */
header {
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    padding: 1rem 0;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    position: relative;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
    padding: 10px 0;
}

.logo {
    flex-shrink: 0;
}

.logo-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    border: 2px solid white;
    transition: transform 0.3s ease;
}

.logo-img:hover {
    transform: scale(1.05);
}

.header-text {
    text-align: center;
    flex: 1;
    position: relative;
    z-index: 2;
}

h1 {
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
    font-weight: 700;
}

.subtitle {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    opacity: 0.9;
}

/* ===== MENU MOBILE CORRIGÉ ===== */
.menu-toggle {
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1001;
    color: white;
    width: 30px;
    height: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
}

.menu-toggle span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: white;
    border-radius: 2px;
    transition: all 0.3s ease;
}

.menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.active span:nth-child(2) {
    opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
}

.menu-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
}

.mobile-menu {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100%;
    background: white;
    box-shadow: 2px 0 8px rgba(0,0,0,0.3);
    transition: left 0.3s ease;
    z-index: 1002;
    padding-top: 70px;
    overflow-y: auto;
}

.mobile-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.mobile-menu li {
    margin: 0;
    border-bottom: 1px solid #eee;
}

.mobile-menu a {
    display: block;
    text-decoration: none;
    color: #333;
    font-weight: 600;
    padding: 15px 20px;
    transition: all 0.3s ease;
}

.mobile-menu a:hover {
    background: #f8f9fa;
    color: #6a11cb;
}

.mobile-menu.active {
    left: 0;
}

.menu-overlay.active {
    display: block;
}

/* ===== RECHERCHE ET CATÉGORIES ===== */
.search-bar {
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

.search-bar input {
    padding: 12px 20px;
    width: 100%;
    max-width: 500px;
    border: none;
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    outline: none;
    transition: box-shadow 0.3s ease;
}

.search-bar input:focus {
    box-shadow: 0 4px 15px rgba(106, 17, 203, 0.2);
}

.categories {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 20px 0;
}

.category-btn {
    padding: 8px 18px;
    background-color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 500;
}

.category-btn:hover, .category-btn.active {
    background-color: #6a11cb;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(106, 17, 203, 0.3);
}

/* ===== BANNIÈRES CATÉGORIES ===== */
.category-banners {
    margin: 30px 0;
}

.category-banner {
    position: relative;
    height: 200px;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 20px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.category-banner:hover {
    transform: scale(1.02);
}

.category-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.banner-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(106, 17, 203, 0.8), rgba(37, 117, 252, 0.8));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    padding: 20px;
}

.banner-content h2 {
    font-size: 2rem;
    margin-bottom: 10px;
    font-weight: bold;
}

.banner-content p {
    font-size: 1.1rem;
    opacity: 0.9;
}

/* ===== GRILLE PRODUITS COMPACTE ===== */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 25px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.product-card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    width: 100%;
}

.product-image-container {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-info {
    padding: 15px;
}

.product-title {
    font-size: 1rem;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 600;
    line-height: 1.3;
    height: 2.6em;
    overflow: hidden;
}

.product-description {
    color: #7f8c8d;
    font-size: 0.85rem;
    margin-bottom: 12px;
    line-height: 1.4;
    height: 2.8em;
    overflow: hidden;
}

.product-price {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.old-price {
    text-decoration: line-through;
    color: #888;
    font-size: 0.85rem;
}

.promo-price {
    font-weight: bold;
    color: #e60023;
    font-size: 1.1rem;
}

.product-variations {
    margin-bottom: 15px;
}

.variation-selector {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    flex-wrap: wrap;
    align-items: center;
}

.variation-selector span {
    font-weight: 500;
    color: #5a67d8;
    font-size: 0.9rem;
}

.variation-btn {
    padding: 6px 12px;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
}

.variation-btn:hover, .variation-btn.active {
    border-color: #6a11cb;
    background: #6a11cb;
    color: white;
}

.product-actions {
    display: flex;
    gap: 10px;
}

.add-to-cart {
    flex: 1;
    padding: 12px;
    background-color: #6a11cb;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1rem;
    font-weight: 600;
}

.add-to-cart:hover {
    background-color: #2575fc;
}

.quick-view {
    padding: 12px;
    background-color: #f1f3f5;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.quick-view:hover {
    background-color: #e9ecef;
}

/* ===== LIGHTBOX ===== */
#lightbox {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

#lightbox-close {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 40px;
    color: white;
    cursor: pointer;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.5);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
}

#lightbox-close:hover {
    background: rgba(255, 0, 0, 0.7);
}

#lightbox-img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

/* Bloquer le scroll quand la lightbox est ouverte */
body.lightbox-open {
    overflow: hidden;
}

/* ===== TÉMOIGNAGES ===== */
.temoignages-section h2 {
    font-size: 2em;
    margin-bottom: 30px;
    color: #333;
    text-align: center;
}

.temoignages-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

.temoignage {
    background: white;
    border-radius: 10px;
    padding: 20px;
    max-width: 300px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.temoignage p {
    font-style: italic;
    color: #555;
    margin-bottom: 10px;
}

.temoignage h4 {
    color: #222;
    font-weight: bold;
}

/* ===== FAQ ===== */
.faq-section {
    padding: 40px;
    background-color: #fff;
    margin-top: 40px;
}

.faq-section h2 {
    text-align: center;
    font-size: 2em;
    margin-bottom: 20px;
}

.faq-item {
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}

.faq-item h3 {
    font-size: 1.2em;
    color: #333;
    margin-bottom: 5px;
}

.faq-item p {
    font-size: 1em;
    color: #555;
}

/* ===== À PROPOS ===== */
.about-section {
    padding: 60px 20px;
    background: #f9f9f9;
    text-align: center;
}

.about-container {
    max-width: 900px;
    margin: 0 auto;
}

.about-section h2 {
    font-size: 2em;
    margin-bottom: 20px;
    color: #333;
}

.about-section p {
    font-size: 1.1em;
    line-height: 1.6;
    color: #555;
    margin-bottom: 15px;
}

.about-team {
    list-style: none;
    padding: 0;
    margin: 20px 0;
    text-align: left;
    display: inline-block;
}

.about-team li {
    font-size: 1.05em;
    margin-bottom: 8px;
    color: #444;
}

/* ===== PARTENAIRES ===== */
.partenaires {
    text-align: center;
    padding: 40px 20px;
    background-color: #f5f5f5;
}

.partenaires h2 {
    margin-bottom: 20px;
    font-size: 28px;
    color: #333;
}

.partenaires-logos {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
}

.partenaires-logos img {
    width: 150px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.depliant-images,
.partenaires-logos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

/* ===== SYSTÈME LIVRAISON ===== */
.delivery-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 60px 20px;
    margin: 40px 0;
}

.delivery-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    max-width: 1000px;
    margin: 0 auto;
}

.delivery-card {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.location-input {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.location-input input {
    flex: 1;
    padding: 12px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.location-input input:focus {
    border-color: #6a11cb;
    box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
    outline: none;
}

.location-input input::placeholder {
    color: #a0aec0;
}

.location-input button {
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    min-width: 120px;
}

.location-input button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(106, 17, 203, 0.3);
}

.location-input button:active {
    transform: translateY(0);
}

.delivery-options-list {
    margin-top: 20px;
}

.option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
}

.option:hover {
    border-color: #6a11cb;
    background: #f8f9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(106, 17, 203, 0.1);
}

.option.selected {
    border-color: #25D366;
    background: #f0fff4;
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
    transform: translateY(-2px);
}

.option .price {
    color: #25D366;
    font-weight: bold;
    font-size: 1.1rem;
}

/* ===== BADGE SONINKÉ ===== */
#soninke-badge-left {
    position: fixed;
    bottom: 40px;
    left: 20px;
    background: linear-gradient(135deg, #ff9966, #ff5e62);
    color: #fff;
    font-weight: bold;
    padding: 15px 20px;
    border-radius: 30px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    cursor: default;
    z-index: 5000;
    transform: scale(0.8);
    animation: popupLeft 0.6s forwards, bounceLeft 2s infinite 0.6s;
    font-size: 1rem;
    max-width: 200px;
    text-align: center;
    line-height: 1.4;
}

#soninke-text-left {
    display: inline-block;
    transition: opacity 0.5s ease-in-out;
}

/* ===== NOTIFICATIONS ===== */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #25D366;
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 350px;
}

.notification.error {
    background: #ff4757;
}

.notification.warning {
    background: #ffa502;
}

/* ===== TOAST ===== */
.toast {
    visibility: hidden;
    min-width: 250px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 16px;
    position: fixed;
    z-index: 10000;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.toast.show {
    visibility: visible;
    opacity: 1;
}

/* ===== PANIER FLOTTANT - OUVERTURE À GAUCHE ===== */
.floating-cart {
    position: fixed;
    bottom: 20px;
    right: 15px;
    z-index: 1000;
}

.cart-toggle {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    color: white;
    padding: 15px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    font-size: 1.5rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
}

.cart-toggle:hover {
    transform: scale(1.1);
}

#cart-badge-floating {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #e74c3c;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

/* Panneau du panier */
.cart-panel {
    position: absolute;
    bottom: 70px;
    right: 0;
    width: 350px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 25px rgba(0,0,0,0.2);
    display: none;
    max-height: 70vh;
    overflow: hidden;
    flex-direction: column;
    z-index: 1001;
}

.floating-cart.open .cart-panel {
    display: flex;
}

/* Overlay */
.cart-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 999;
}

.floating-cart.open .cart-overlay {
    display: block;
}

/* En-tête mobile */
.cart-header-mobile {
    display: none;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
    background: white;
}

.cart-header-mobile h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.1rem;
}

.close-mobile-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 5px;
}

/* Contenu du panier */
.cart-items-container {
    flex: 1;
    overflow-y: auto;
    max-height: calc(70vh - 150px);
    padding: 12px;
}

.cart-summary {
    padding: 12px;
    border-top: 2px solid #6a11cb;
    background: #f8f9fa;
    flex-shrink: 0;
}

.cart-total-floating {
    font-weight: bold;
    margin-bottom: 8px;
    text-align: center;
    font-size: 0.9rem;
    color: #2c3e50;
}

.buy-btn, .close-cart-btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 6px;
    font-weight: bold;
    font-size: 0.85rem;
    transition: all 0.3s ease;
}

.buy-btn {
    background: #25D366;
    color: white;
}

.buy-btn:hover {
    background: #1da851;
    transform: translateY(-2px);
}

.close-cart-btn {
    background: #6a11cb;
    color: white;
}

.close-cart-btn:hover {
    background: #2575fc;
}

.empty-cart-floating {
    text-align: center;
    color: #888;
    padding: 20px;
    font-style: italic;
    font-size: 0.9rem;
}

/* ===== VERSION MOBILE - OUVERTURE À GAUCHE ===== */
@media (max-width: 768px) {
    .floating-cart {
        bottom: 20px;
        right: 15px;
    }
    
    .cart-toggle {
        width: 55px;
        height: 55px;
        font-size: 1.3rem;
    }
    
    /* PANEAU MOBILE - OUVERTURE VERS LA GAUCHE */
    .cart-panel {
        position: fixed;
        bottom: 0;
        left: 0;
        right: auto;
        width: 85vw;
        height: 70vh;
        max-height: none;
        border-radius: 0 20px 0 0;
        margin: 0;
        animation: slideInLeft 0.3s ease;
        z-index: 1001;
    }
    
    .cart-header-mobile {
        display: flex;
    }
    
    .cart-items-container {
        max-height: calc(70vh - 180px);
    }
    
    .cart-summary {
        margin-top: auto;
    }
    
    /* Bloquer le scroll du body quand le panier est ouvert */
    body.cart-open {
        overflow: hidden;
    }
}

/* Très petits écrans */
@media (max-width: 480px) {
    .floating-cart {
        bottom: 15px;
        right: 10px;
    }
    
    .cart-toggle {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
    }
    
    .cart-panel {
        width: 90vw;
        height: 65vh;
    }
    
    .cart-items-container {
        max-height: calc(65vh - 180px);
    }
}

/* Animation d'entrée depuis la gauche */
@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Désactiver l'overlay sur desktop */
@media (min-width: 769px) {
    .cart-overlay {
        display: none !important;
    }
    
    .cart-header-mobile {
        display: none !important;
    }
    
    .cart-panel {
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 350px;
        border-radius: 15px;
        animation: none;
    }
}

/* ===== FOOTER ===== */
footer {
    background-color: #2c3e50;
    color: white;
    text-align: center;
    padding: 2rem 0;
    margin-top: 50px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
}

.footer-section h3 {
    color: #fff;
    margin-bottom: 15px;
    font-size: 1.2rem;
}

.footer-section p {
    color: #ccc;
    margin-bottom: 8px;
    line-height: 1.5;
    font-size: 0.95rem;
}

.social-links {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 15px;
}

.social-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s ease;
    padding: 10px;
    border-radius: 8px;
    font-size: 0.9rem;
}

.social-link:hover {
    color: #6a11cb;
    background-color: rgba(255, 255, 255, 0.1);
}

.footer-bottom {
    border-top: 1px solid #4a5568;
    padding-top: 20px;
    text-align: center;
}

.footer-bottom p {
    font-size: 0.9rem;
    color: #ccc;
    margin-bottom: 5px;
}

.legal-links ul {
    list-style: none;
    padding: 0;
    margin-top: 15px;
}

.legal-links ul li {
    margin: 5px 0;
}

.legal-links ul li a {
    text-decoration: none;
    color: #ccc;
    transition: color 0.3s;
}

.legal-links ul li a:hover {
    color: #667eea;
}

/* ===== RÉDUCTIONS ===== */
.reduction-section {
    text-align: center;
    margin: 25px auto;
    padding: 25px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 15px;
    max-width: 500px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid rgba(106, 17, 203, 0.1);
}

.reduction-section input {
    padding: 14px 20px;
    width: 200px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    text-align: center;
    margin-right: 10px;
    background: white;
    transition: all 0.3s ease;
}

.reduction-section input:focus {
    outline: none;
    border-color: #6a11cb;
    box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
    transform: translateY(-1px);
}

.reduction-section button {
    padding: 14px 25px;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.reduction-section button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(106, 17, 203, 0.3);
}

#promoMessage {
    font-weight: 600;
    margin-top: 15px;
    padding: 10px;
    border-radius: 8px;
    background: white;
    border: 1px solid #e2e8f0;
}

/* ===== BOUTON CHAT ===== */
.chat-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #667eea;
    color: white;
    font-size: 22px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 2000;
}

/* ===== COMPTE À REBOURS ===== */
.promo-countdown {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 25px;
    border-radius: 50px;
    text-align: center;
    margin: 20px auto;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    max-width: 400px;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.promo-countdown h2 {
    margin-bottom: 12px;
    font-size: 1.1em;
    font-weight: 600;
}

#countdown {
    font-size: 1.1em;
    font-weight: bold;
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;
}

#countdown span {
    background: rgba(255, 255, 255, 0.2);
    padding: 6px 10px;
    border-radius: 10px;
    min-width: 45px;
    display: inline-block;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Tablettes */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 15px;
    }

    .logo-img {
        width: 70px;
        height: 70px;
    }

    h1 {
        font-size: 1.7rem;
    }

    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }

    .product-image-container {
        height: 200px;
    }

    .category-banner {
        height: 150px;
    }

    .banner-content h2 {
        font-size: 1.5rem;
    }

    .footer-content {
        grid-template-columns: 1fr;
    }

    .social-links {
        grid-template-columns: 1fr;
    }
    
    /* Menu mobile corrections */
    .menu-toggle {
        top: 10px;
        left: 10px;
    }
    
    .mobile-menu {
        width: 100%;
        left: -100%;
    }
    
    .mobile-menu.active {
        left: 0;
    }
    
    /* Panier mobile */
    .floating-cart {
        bottom: 20px;
        right: 15px;
    }
    
    .cart-panel {
        width: 320px;
        right: -50px;
        bottom: 70px;
    }
}

/* Mobiles */
@media (max-width: 480px) {
    .products-grid {
        grid-template-columns: 1fr;
        gap: 15px;
        padding: 0 8px;
    }

    .category-banner {
        height: 120px;
    }

    .banner-content h2 {
        font-size: 1.2rem;
    }

    .banner-content p {
        font-size: 0.9rem;
    }

    .container {
        width: 95%;
    }

    .depliant-images img,
    .partenaires-logos img {
        max-width: 150px;
    }
    
    /* Header mobile */
    .header-content {
        flex-direction: column;
        gap: 10px;
    }
    
    .logo-img {
        width: 50px;
        height: 50px;
    }
    
    h1 {
        font-size: 1.3rem;
    }
    
    .subtitle {
        font-size: 0.75rem;
    }
    
    /* Panier très petits écrans */
    .floating-cart {
        right: 10px;
        bottom: 15px;
    }
    
    .cart-panel {
        width: 300px;
        right: -80px;
        bottom: 65px;
        max-height: 60vh;
    }
    
    .cart-toggle {
        width: 55px;
        height: 55px;
        font-size: 1.3rem;
    }
    
    /* Produits très petits écrans */
    .product-image-container {
        height: 140px;
    }
    
    .product-info {
        padding: 12px;
    }
    
    .product-title {
        font-size: 0.85rem;
    }
    
    .product-description {
        font-size: 0.75rem;
    }
    
    .product-actions {
        flex-direction: column;
        gap: 8px;
    }
    
    .add-to-cart, .quick-view {
        font-size: 0.8rem;
        padding: 8px;
    }
}

/* Mode paysage mobile */
@media (max-width: 768px) and (orientation: landscape) {
    .mobile-menu {
        padding-top: 50px;
    }
    
    .mobile-menu a {
        padding: 12px 20px;
    }
    
    .header-content {
        padding: 5px 0;
    }
    
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
/* ===== CORRECTION URGENTE MENU VISIBLE ===== */
.mobile-menu {
    transform: translateX(0) !important;
    left: 0 !important;
    position: relative !important;
    background: transparent !important;
    width: 100% !important;
    height: auto !important;
    padding: 20px 0 !important;
    box-shadow: none !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.menu-toggle {
    display: none !important;
}

.menu-overlay {
    display: none !important;
}

/* Navigation desktop */
@media (min-width: 768px) {
    .mobile-menu {
        display: flex !important;
        justify-content: center !important;
        gap: 40px !important;
        background: rgba(0,0,0,0.9) !important;
        padding: 15px !important;
        border-radius: 10px !important;
        margin: 10px auto !important;
        max-width: 90% !important;
    }
    
    .mobile-menu ul {
        display: flex !important;
        gap: 30px !important;
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    .mobile-menu li {
        margin: 0 !important;
        border: none !important;
    }
    
    .mobile-menu a {
        color: white !important;
        text-decoration: none !important;
        font-weight: 500 !important;
        padding: 8px 16px !important;
        border-radius: 5px !important;
        transition: background 0.3s !important;
        display: block !important;
    }
    
    .mobile-menu a:hover {
        background: rgba(255,255,255,0.2) !important;
    }
}

/* Navigation mobile */
@media (max-width: 767px) {
    .mobile-menu {
        display: block !important;
        text-align: center !important;
        background: #f8f9fa !important;
        padding: 15px !important;
        border-radius: 10px !important;
        margin: 10px !important;
    }
    
    .mobile-menu ul {
        list-style: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    
    .mobile-menu li {
        margin: 0 !important;
        border-bottom: 1px solid #ddd !important;
    }
    
    .mobile-menu li:last-child {
        border-bottom: none !important;
    }
    
    .mobile-menu a {
        display: block !important;
        padding: 12px !important;
        color: #333 !important;
        text-decoration: none !important;
        font-weight: 500 !important;
    }
    
    .mobile-menu a:hover {
        background: #667eea !important;
        color: white !important;
    }
}
/* Safe area pour iPhone avec encoche */
@supports (padding: max(0px)) {
    .floating-cart {
        bottom: max(15px, env(safe-area-inset-bottom));
    }
    
    .container {
        padding-left: max(15px, env(safe-area-inset-left));
        padding-right: max(15px, env(safe-area-inset-right));
    }
}

/* Correction iPhone/Safari */
@supports (-webkit-touch-callout: none) {
    .product-image-container {
        height: 220px;
    }
    
    .floating-cart {
        bottom: 25px;
    }
}

/* ===== BADGES RECOMMANDATIONS ===== */
.recommendation-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: bold;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.recommendations-section {
    margin: 40px 0;
    padding: 20px;
}

.recommendations-section h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #2c3e50;
    font-size: 2rem;
}

.recommendations-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
}
/* ===== ASSISTANT IA ===== */
@keyframes messageSlideIn {
    from { 
        opacity: 0; 
        transform: translateY(20px) scale(0.95); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
    }
}

.typing-animation {
    display: inline-flex;
    gap: 4px;
}

.typing-animation span {
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-animation span:nth-child(1) { animation-delay: -0.32s; }
.typing-animation span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typingBounce {
    0%, 80%, 100% { 
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% { 
        transform: scale(1);
        opacity: 1;
    }
}

#ai-messages::-webkit-scrollbar {
    width: 8px;
}

#ai-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

#ai-messages::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
}

#ai-messages::-webkit-scrollbar-thumb:hover {
    background: #5a6fd8;
}
/* ===== ANIMATIONS VUE RAPIDE ===== */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes scaleIn {
    from { 
        opacity: 0;
        transform: scale(0.8);
    }
    to { 
        opacity: 1;
        transform: scale(1);
    }
}

/* ===== STYLES VUE RAPIDE ===== */
.quick-view-modal {
    backdrop-filter: blur(5px);
}

.quick-view-modal::-webkit-scrollbar {
    width: 8px;
}

.quick-view-modal::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.quick-view-modal::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
}

.quick-view-modal::-webkit-scrollbar-thumb:hover {
    background: #5a6fd8;
}

/* Responsive pour mobile */
@media (max-width: 768px) {
    .quick-view-modal > div > div {
        grid-template-columns: 1fr !important;
        max-height: 95vh !important;
    }
    
    .quick-view-modal > div > div > div:first-child {
        border-radius: 20px 20px 0 0 !important;
        padding: 20px !important;
    }
    
    .quick-view-modal > div > div > div:last-child {
        border-radius: 0 0 20px 20px !important;
        padding: 20px !important;
    }
    
    .quick-view-modal h2 {
        font-size: 1.4rem !important;
    }
}
/* ===== CORRECTIONS MOBILE PORTRAIT ===== */
@media (max-width: 768px) and (orientation: portrait) {
    /* Assistant IA */
    #ai-input-group {
        flex-direction: column !important;
    }
    
    #ai-send-button {
        width: 100% !important;
        margin-top: 10px;
    }
    
    /* Essayage Virtuel */
    .fitting-container {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
    }
    
    #camera-controls-container {
        order: 3;
    }
    
    /* Livraison */
    .location-input {
        flex-direction: column !important;
    }
    
    .location-input button {
        width: 100% !important;
        margin-top: 10px;
    }
    
    /* Options de livraison */
    .delivery-options {
        grid-template-columns: 1fr !important;
    }
    
    .option {
        flex-direction: column !important;
        text-align: center;
        padding: 20px !important;
    }
}

/* Correction spécifique très petits écrans */
@media (max-width: 480px) {
    #ai-input {
        font-size: 16px !important; /* Empêche le zoom sur iOS */
    }
    
    .location-input input {
        font-size: 16px !important;
    }
}

/* Safe areas pour iPhone avec encoche */
@supports (padding: max(0px)) {
    #ai-input-container,
    #camera-controls-container,
    .location-input {
        padding-left: max(15px, env(safe-area-inset-left));
        padding-right: max(15px, env(safe-area-inset-right));
    }
}
/* ===== STYLES MODAL INFORMATIONS CLIENT ===== */
.delivery-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
    padding: 15px;
    overflow-y: auto;
}

.delivery-modal {
    background: white;
    border-radius: 20px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.3s ease;
}

.modal-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 25px;
    border-radius: 20px 20px 0 0;
    text-align: center;
}

.modal-header h2 {
    margin: 0 0 10px 0;
    font-size: 1.8rem;
}

.modal-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 1rem;
}

.modal-body {
    padding: 30px;
}

.warning-box {
    background: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 25px;
}

.warning-box strong {
    display: block;
    margin-bottom: 8px;
    color: #856404;
    font-size: 1rem;
}

.warning-box ul {
    margin: 0;
    padding-left: 20px;
    color: #856404;
    font-size: 0.9rem;
    line-height: 1.6;
}

.info-field {
    margin-bottom: 20px;
}

.info-field label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
}

.info-field input,
.info-field select {
    width: 100%;
    padding: 15px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.info-field input:focus,
.info-field select:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.phone-container {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 12px;
}

.country-select {
    background: white;
}

.field-hint {
    display: block;
    color: #666;
    font-size: 0.85rem;
    margin-top: 6px;
    font-style: italic;
}

.delivery-warning {
    background: #e3f2fd;
    border: 2px solid #2196f3;
    border-radius: 12px;
    padding: 15px;
    margin-top: 20px;
}

.delivery-warning strong {
    display: block;
    color: #1976d2;
    margin-bottom: 8px;
    font-size: 1rem;
}

.modal-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 25px;
}

.modal-buttons button {
    padding: 15px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-confirm {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.btn-confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-cancel {
    background: #e0e0e0;
    color: #666;
}

.btn-cancel:hover {
    background: #d0d0d0;
}

/* ===== RESPONSIVE MOBILE ===== */
@media (max-width: 768px) {
    .delivery-modal {
        max-width: 100%;
        margin: 10px;
        max-height: 95vh;
    }
    
    .modal-header {
        padding: 20px 15px;
    }
    
    .modal-header h2 {
        font-size: 1.4rem;
    }
    
    .modal-body {
        padding: 20px 15px;
    }
    
    .phone-container {
        grid-template-columns: 1fr;
    }
    
    .country-select {
        width: 100%;
    }
    
    .modal-buttons {
        grid-template-columns: 1fr;
    }
    
    .info-field input,
    .info-field select {
        font-size: 16px; /* Empêche le zoom iOS */
    }
}

@media (max-width: 480px) {
    .delivery-modal-overlay {
        padding: 5px;
    }
    
    .modal-header h2 {
        font-size: 1.2rem;
    }
    
    .warning-box,
    .delivery-warning {
        padding: 12px;
        font-size: 0.85rem;
    }
    
    .info-field label {
        font-size: 0.9rem;
    }
    
    .field-hint {
        font-size: 0.8rem;
    }
}

/* ===== COMPTE À REBOURS PROMO DÉCEMBRE ===== */
.promo-countdown {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 25px;
    border-radius: 20px;
    text-align: center;
    margin: 20px auto;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    max-width: 450px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    transition: all 0.5s ease;
}

.promo-countdown.promo-active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

.promo-countdown.ended {
    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
    box-shadow: 0 8px 25px rgba(149, 165, 166, 0.3);
}

.promo-countdown h2 {
    margin-bottom: 10px;
    font-size: 1.3em;
    font-weight: 700;
    line-height: 1.4;
}

.promo-countdown h2 small {
    font-size: 0.7em;
    opacity: 0.9;
    font-weight: 400;
    display: block;
    margin-top: 5px;
}

#countdown {
    font-size: 1.2em;
    font-weight: bold;
    display: flex;
    justify-content: center;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
}

#countdown span {
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 12px;
    border-radius: 12px;
    min-width: 50px;
    display: inline-block;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

/* ===== COMPTEUR EN LIGNE ANIMÉ ===== */
/* Pour desktop */
.mini-counter {
    position: sticky;
    top: 10px; /* Reste à 10px du haut quand on défile */
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 9px;
    font-weight: 600;
    z-index: 1000;
    box-shadow: 0 1px 6px rgba(39, 174, 96, 0.4);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    animation: pulse-online 2s infinite;
    white-space: nowrap;
    max-width: 90px;
    line-height: 1.2;
    margin: 0 auto; /* Centrage supplémentaire */
}

/* Pour mobile */
@media (max-width: 768px) {
    .mini-counter {
        top: 60px; /* Plus proche sur mobile */
        padding: 2px 8px;
        font-size: 8px;
        max-width: 75px;
    }
}
.counter-number {
    font-weight: bold;
    color: #fff;
    margin: 0 5px;
    font-size: 15px;
    transition: all 0.3s ease;
}

@keyframes pulse-online {
    0%, 100% { 
        box-shadow: 0 1px 5px rgba(39, 174, 96, 0.3);
    }
    50% { 
        box-shadow: 0 1px 8px rgba(39, 174, 96, 0.5);
    }
}

@keyframes fadeIn {
    from { 
        opacity: 0; 
        transform: translateX(-50%) translateY(-10px); 
    }
    to { 
        opacity: 1; 
        transform: translateX(-50%) translateY(0); 
    }
}
/* Pour mobile - encore plus petit */
@media (max-width: 768px) {
    .mini-counter {
        top: 5px;
        padding: 2px 6px;
        font-size: 8px;
        border-radius: 10px;
        max-width: 80px;
    }
    
    .counter-number {
        font-size: 9px !important;
    }
}

/* ===== TEXTE RETOUR EN HAUT COLLÉ EN BAS ===== */
#backToTopBtn {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 999;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 15px 0;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

#backToTopBtn:hover {
    background: linear-gradient(135deg, #764ba2, #667eea);
    padding: 18px 0;
}

/* Version mobile */
@media (max-width: 768px) {
    #backToTopBtn {
        padding: 12px 0;
        font-size: 15px;
    }
}

@media (max-width: 480px) {
    #backToTopBtn {
        padding: 10px 0;
        font-size: 14px;
    }
}

/* === BADGE COMPTEUR FONCTIONNEL === */
.mini-counter {
    position: sticky;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    padding: 8px 15px;
    border-radius: 25px;
    font-size: 12px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.3);
    text-align: center;
    backdrop-filter: blur(10px);
    min-width: 140px;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#visitorCount {
    font-weight: bold;
    font-size: 14px;
    margin: 0 4px;
    display: inline-block;
    min-width: 25px;
}

/* Mobile */
@media (max-width: 768px) {
    .mini-counter {
        top: 5px;
        padding: 6px 12px;
        font-size: 11px;
        min-width: 120px;
        max-width: 160px;
    }
    
    #visitorCount {
        font-size: 13px;
    }
}

/* ===== CORRECTION SCROLL ANDROID ===== */
html, body {
    overflow-x: hidden;
    overflow-y: auto; /* ✅ Scroll vertical autorisé */
    -webkit-overflow-scrolling: touch; /* ✅ Scroll fluide iOS/Android */
    touch-action: pan-y; /* ✅ Scroll vertical autorisé */
    overscroll-behavior-y: contain; /* ✅ Évite les effets de rebond excessifs */
    height: 100%;
    position: relative;
}

/* ✅ Correction spécifique Android */
.android-device body,
.android-device html {
    overflow-y: scroll !important;
    -webkit-overflow-scrolling: touch !important;
}

/* ✅ Assurer que le contenu peut défiler */
.main-container {
    min-height: 100vh;
    overflow-y: visible;
}

/* ✅ Correction pour les modales qui bloquent le scroll */
.quick-view-modal,
.delivery-modal-overlay,
#lightbox {
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
}

/* ✅ Autoriser le scroll dans les conteneurs */
.cart-items-container,
#ai-messages,
#view-history,
#saved-products,
#personal-recommendations {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
/* ===== CORRECTIONS PERMANENTES SCROLL ANDROID ===== */

/* CORRECTION GLOBALE */
html, body {
    overflow-x: hidden !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    touch-action: pan-y !important;
    min-height: 100vh !important;
}

/* EMPÊCHER LES overflow: hidden PROBLÉMATIQUES */
.main-container, .container, main, 
.produits-container, .products-grid,
section, .product-card {
    overflow: visible !important;
    min-height: auto !important;
}

/* SPÉCIFIQUE ANDROID */
.android-device body {
    overflow-y: scroll !important;
    touch-action: pan-y !important;
}

/* S'ASSURER QUE LE CONTENU PEUT DÉPASSER */
.product-title, .product-description, 
h1, h2, h3, p, span {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
}

/* SCROLL FLUIDE */
* {
    -webkit-tap-highlight-color: transparent;
}

@media (max-width: 768px) {
    /* FORCER LE SCROLL SUR MOBILE */
    html {
        overflow-y: scroll !important;
    }
}
/* ===== BOUTON FLÈCHE RETOUR EN HAUT ===== */
#backToTopArrow {
    display: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    opacity: 0.9;
}

#backToTopArrow:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    opacity: 1;
}

/* Version mobile */
@media (max-width: 768px) {
    #backToTopArrow {
        bottom: 80px; /* Au-dessus du panier */
        right: 20px;
        width: 45px;
        height: 45px;
        font-size: 22px;
    }
}

@media (max-width: 480px) {
    #backToTopArrow {
        bottom: 70px;
        width: 40px;
        height: 40px;
        font-size: 20px;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 0.9;
        transform: translateY(0);
    }
}

#backToTopArrow.show {
    animation: fadeInUp 0.3s ease forwards;
}
</style>
