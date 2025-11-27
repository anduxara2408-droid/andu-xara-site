// js/promo-system.js - Système de codes promo externalisé
console.log('🎁 Chargement système promo...');

// Classe PromoSystem complète
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
        
        // Écouter les changements d'authentification
        if (window.firebaseAuth) {
            window.firebaseAuth.onAuthStateChanged(async (user) => {
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
    }

    async loadUserData() {
        if (!this.currentUser || !window.FIRESTORE_AVAILABLE) return;
        
        try {
            const userDoc = await window.firebaseDb.collection('users').doc(this.currentUser.uid).get();
            
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
            await window.firebaseDb.collection('users').doc(this.currentUser.uid).set(userData);
            this.userData = userData;
            console.log('✅ Nouvel utilisateur créé dans Firestore');
        } catch (error) {
            console.error('❌ Erreur création utilisateur Firestore:', error);
            
            // Fallback vers localStorage
            console.log('🔄 Utilisation du mode local suite à erreur Firestore');
            this.userData = userData;
            localStorage.setItem(`anduxara_user_${this.currentUser.uid}`, JSON.stringify(userData));
        }
    }

    generateUserCode() {
        return 'AX' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 3).toUpperCase();
    }

    async validateAndApplyPromo(code) {
        if (!this.currentUser) {
            this.showLoginPrompt();
            return { success: false, message: 'Veuillez vous connecter d\'abord' };
        }

        try {
            // Vérifier d'abord si le code est déjà utilisé
            const alreadyUsed = await this.checkIfPromoAlreadyUsed(code);
            if (alreadyUsed) {
                return { 
                    success: false, 
                    message: '❌ Vous avez déjà utilisé ce code promo.' 
                };
            }
            
            if (!window.FIRESTORE_AVAILABLE) {
                return this.applyPromoOffline(code);
            }
            
            const promoDoc = await window.firebaseDb.collection('promoCodes').doc(code.toUpperCase()).get();
            
            if (!promoDoc.exists) {
                return { success: false, message: 'Code promo invalide' };
            }

            const promoData = promoDoc.data();
            const validation = await this.validatePromoConditions(promoData, code);
            if (!validation.success) {
                return validation;
            }

            // Appliquer le code promo
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
    }

    async checkIfPromoAlreadyUsed(code) {
        const codeUpper = code.toUpperCase();
        
        // Vérifier si le code est actuellement actif
        if (this.activePromo && this.activePromo.code === codeUpper) {
            return true;
        }
        
        // Vérifier dans les données utilisateur
        if (this.userData && this.userData.usedPromoCodes) {
            const alreadyUsed = this.userData.usedPromoCodes.some(usedCode => 
                usedCode.code === codeUpper
            );
            if (alreadyUsed) return true;
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
            
            // Sauvegarder localement
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
            const alreadyUsed = this.userData.usedPromoCodes.some(usedCode => 
                usedCode.code === codeUpper
            );
            
            if (alreadyUsed) {
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
        
        const usageEntry = {
            code: codeUpper,
            usedAt: now.toISOString(),
            orderId: 'locked-' + Date.now(),
            discount: promoData.discount,
            status: 'used',
            permanent: true
        };
        
        if (window.FIRESTORE_AVAILABLE && window.firebaseDb) {
            try {
                await window.firebaseDb.collection('users').doc(this.currentUser.uid).update({
                    usedPromoCodes: firebase.firestore.FieldValue.arrayUnion(usageEntry),
                    activePromo: {
                        code: codeUpper,
                        discount: promoData.discount,
                        appliedAt: now,
                        locked: true
                    }
                });
                
                console.log('🔒 Code IMMÉDIATEMENT verrouillé dans Firestore');
            } catch (error) {
                console.error('❌ Erreur Firestore:', error);
            }
        }
        
        // Sauvegarder localement
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

    updateActivePromoDisplay(code, discount) {
        const display = document.getElementById('active-promo-display');
        const codeElement = document.getElementById('active-promo-code');
        
        if (display && codeElement) {
            display.style.display = 'block';
            codeElement.textContent = `${code} (-${discount}%)`;
        }
    }

    showLoginPrompt() {
        const message = `🔐 Connexion Requise\n\nPour utiliser les codes promo, veuillez vous connecter à votre compte.\n\nVoulez-vous vous connecter maintenant ?`;

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
};

// Initialiser le système promo
window.initPromoSystem = function() {
    if (!window.promoSystem) {
        window.promoSystem = new window.PromoSystem();
        console.log('✅ PromoSystem initialisé avec succès');
    }
    return window.promoSystem;
};

// Initialisation automatique
if (typeof window.PromoSystem !== 'undefined') {
    setTimeout(() => {
        window.initPromoSystem();
    }, 1000);
}
