// 🔐 SYSTÈME DE GESTION UTILISATEURS AVEC COOKIES ET FIREBASE
class UserManager {
    constructor() {
        this.userId = this.getOrCreateUserId();
        this.userEmail = null;
        this.isLoggedIn = false;
        this.userData = null;
        this.initAuthListener();
    }

    generateUserId() {
        return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        const secureFlag = window.location.protocol === 'https:' ? ';secure' : '';
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;samesite=strict' + secureFlag;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    getOrCreateUserId() {
        let userId = this.getCookie('anduxara_user_id');
        if (!userId) {
            userId = this.generateUserId();
            this.setCookie('anduxara_user_id', userId, 365);
        }
        return userId;
    }

    initAuthListener() {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    this.userEmail = user.email;
                    this.userId = user.uid;
                    this.isLoggedIn = true;
                    this.userData = user;
                    console.log('✅ Utilisateur connecté:', user.email);
                    this.updateUI();
                } else {
                    this.isLoggedIn = false;
                    this.userEmail = null;
                    this.userData = null;
                    console.log('🔐 Utilisateur non connecté');
                    this.updateUI();
                }
            });
        }
    }

    updateUI() {
        const authElements = document.querySelectorAll('[data-auth-status]');
        authElements.forEach(el => {
            if (this.isLoggedIn) {
                el.textContent = this.userEmail;
                el.style.color = '#4CAF50';
            } else {
                el.textContent = 'Non connecté';
                el.style.color = '#ff9800';
            }
        });
    }

    getCurrentUserId() {
        return this.isLoggedIn ? this.userEmail : this.userId;
    }

    async canUsePromoCode(code) {
        const userId = this.getCurrentUserId();
        try {
            const db = firebase.firestore();
            const userUsage = await db.collection('promoUsage')
                .where('userId', '==', userId)
                .where('code', '==', code.toUpperCase())
                .limit(1)
                .get();
            return userUsage.empty;
        } catch (error) {
            console.error('❌ Erreur vérification code promo:', error);
            return false;
        }
    }

    requireAuthForPromo() {
        if (!this.isLoggedIn) {
            this.showAuthModal();
            return false;
        }
        return true;
    }

    showAuthModal() {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';
        
        modal.innerHTML = '<div style="background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px;"><h3>🔐 Connexion Requise</h3><p>Vous devez créer un compte ou vous connecter pour utiliser les codes promo.</p><button onclick="window.location.href=\'index.html\'" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 10px;">Créer un compte</button><button onclick="this.parentElement.parentElement.remove()" style="background: #ccc; color: #333; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 10px;">Plus tard</button></div>';
        
        document.body.appendChild(modal);
    }
}

const userManager = new UserManager();
