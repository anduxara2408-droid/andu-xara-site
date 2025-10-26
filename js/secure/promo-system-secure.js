// 🎯 SYSTÈME DE CODES PROMO SÉCURISÉ AVEC ANTI-TRICHE
class SecurePromoSystem {
    constructor() {
        this.db = firebase.firestore();
        this.usedCodes = new Set();
    }

    async validatePromoCode(code, montantPanier) {
        try {
            const codeUpper = code.toUpperCase().trim();
            
            if (!codeUpper || codeUpper.length < 4) {
                return { success: false, message: '❌ Code promo invalide' };
            }

            const promoDoc = await this.db.collection('promocodes').doc(codeUpper).get();
            if (!promoDoc.exists) {
                return { success: false, message: '❌ Code promo invalide' };
            }

            const promoData = promoDoc.data();
            const userId = userManager.getCurrentUserId();

            if (promoData.validUntil) {
                const validUntil = promoData.validUntil.toDate();
                if (validUntil < new Date()) {
                    return { success: false, message: '❌ Code promo expiré' };
                }
            }

            if (promoData.minAmount && montantPanier < promoData.minAmount) {
                return { 
                    success: false, 
                    message: '❌ Montant minimum requis: ' + promoData.minAmount + ' FCFA' 
                };
            }

            const alreadyUsed = await this.checkUserUsage(codeUpper, userId);
            if (alreadyUsed) {
                return { 
                    success: false, 
                    message: '❌ Vous avez déjà utilisé ce code promo' 
                };
            }

            if (promoData.usageLimit) {
                const usageCount = await this.getUsageCount(codeUpper);
                if (usageCount >= promoData.usageLimit) {
                    return { 
                        success: false, 
                        message: '❌ Code promo épuisé' 
                    };
                }
            }

            if (promoData.enabled === false) {
                return { 
                    success: false, 
                    message: '❌ Code promo désactivé' 
                };
            }

            const reduction = this.calculateReduction(promoData, montantPanier);
            if (reduction <= 0) {
                return { 
                    success: false, 
                    message: '❌ Aucune réduction applicable' 
                };
            }

            return {
                success: true,
                reduction: reduction,
                type: promoData.type,
                code: codeUpper,
                message: '✅ Code promo appliqué: -' + reduction + ' FCFA'
            };

        } catch (error) {
            console.error('❌ Erreur validation code promo:', error);
            return { success: false, message: '❌ Erreur système' };
        }
    }

    async checkUserUsage(code, userId) {
        try {
            const usageDoc = await this.db.collection('promoUsage')
                .where('userId', '==', userId)
                .where('code', '==', code)
                .limit(1)
                .get();
            return !usageDoc.empty;
        } catch (error) {
            console.error('Erreur vérification utilisation:', error);
            return true;
        }
    }

    async getUsageCount(code) {
        try {
            const usageDocs = await this.db.collection('promoUsage')
                .where('code', '==', code)
                .get();
            return usageDocs.size;
        } catch (error) {
            console.error('Erreur comptage utilisations:', error);
            return 999;
        }
    }

    calculateReduction(promoData, montantPanier) {
        if (promoData.type === 'percentage') {
            return Math.round(montantPanier * promoData.value / 100);
        } else if (promoData.type === 'fixed') {
            return Math.min(promoData.value, montantPanier);
        }
        return 0;
    }

    async recordPromoUsage(code, montantPanier, reduction) {
        try {
            const userId = userManager.getCurrentUserId();
            
            await this.db.collection('promoUsage').add({
                code: code.toUpperCase(),
                userId: userId,
                userEmail: userManager.userEmail,
                montantPanier: montantPanier,
                reduction: reduction,
                dateUsed: firebase.firestore.FieldValue.serverTimestamp(),
                ip: await this.getClientIP()
            });

            console.log('✅ Utilisation code promo enregistrée');
        } catch (error) {
            console.error('❌ Erreur enregistrement usage:', error);
        }
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
}

const securePromoSystem = new SecurePromoSystem();
