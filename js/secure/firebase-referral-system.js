// ===== SYSTÈME DE PARRAINAGE INTELLIGENT ANDU-XARA =====
class ReferralSystem {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.currentUser = null;
        this.init();
    }

    async init() {
        this.auth.onAuthStateChanged(async (user) => {
            this.currentUser = user;
            if (user) {
                await this.initializeUserReferral(user);
                this.updateUI();
            }
        });
    }

    // 🎯 INITIALISATION UTILISATEUR
    async initializeUserReferral(user) {
        const userRef = this.db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            // Nouvel utilisateur - créer son profil parrainage
            const referralCode = this.generateReferralCode(user.displayName || user.email);
            
            await userRef.set({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                referralCode: referralCode,
                referralStats: {
                    totalReferred: 0,
                    totalEarned: 0,
                    pendingRewards: 0
                },
                availableRewards: 0,
                referredBy: null, // Sera rempli si parrainé
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastActive: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Créer le code de parrainage personnel
            await this.createPersonalReferralCode(user.uid, referralCode);
        }
    }

    // 🔗 GÉNÉRER UN CODE DE PARRAINAGE UNIQUE
    generateReferralCode(baseName) {
        const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6);
        const randomNum = Math.floor(100 + Math.random() * 900);
        return `REF-${cleanName}-${randomNum}`;
    }

    // 🎫 CRÉER LE CODE DE PARRAINAGE PERSONNEL
    async createPersonalReferralCode(userId, referralCode) {
        await this.db.collection('referralCodes').doc(referralCode).set({
            code: referralCode,
            referrerId: userId,
            referredUsers: [],
            rewards: {
                referrer: 15, // 15% pour le parrain
                referred: 10  // 10% pour le filleul
            },
            stats: {
                totalReferrals: 0,
                active: true,
                totalEarned: 0
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            expiresAt: null // N'expire jamais
        });
    }

    // 👥 TRAITEMENT DU PARRAINAGE (quand un nouvel utilisateur s'inscrit)
    async processReferralSignup(newUserId, referralCodeUsed) {
        if (!referralCodeUsed) return;

        try {
            const referralDoc = await this.db.collection('referralCodes').doc(referralCodeUsed).get();
            
            if (!referralDoc.exists) {
                console.log("Code de parrainage invalide");
                return;
            }

            const referralData = referralDoc.data();
            
            // Vérifier si le code est actif
            if (!referralData.stats.active) {
                console.log("Code de parrainage inactif");
                return;
            }

            // Vérifier que l'utilisateur ne se parraine pas lui-même
            if (referralData.referrerId === newUserId) {
                console.log("Impossible de se parrainer soi-même");
                return;
            }

            // Mettre à jour l'utilisateur avec son parrain
            await this.db.collection('users').doc(newUserId).update({
                referredBy: referralData.referrerId,
                referralUsed: referralCodeUsed
            });

            // Ajouter aux utilisateurs référés
            await this.db.collection('referralCodes').doc(referralCodeUsed).update({
                referredUsers: firebase.firestore.FieldValue.arrayUnion(newUserId),
                'stats.totalReferrals': firebase.firestore.FieldValue.increment(1)
            });

            // Attribuer les récompenses initiales
            await this.awardReferralRewards(referralData.referrerId, newUserId, referralCodeUsed);

            console.log("🎉 Parrainage réussi ! Récompenses attribuées");

        } catch (error) {
            console.error("Erreur traitement parrainage:", error);
        }
    }

    // 🏆 ATTRIBUER LES RÉCOMPENSES
    async awardReferralRewards(referrerId, referredUserId, referralCode) {
        const referralDoc = await this.db.collection('referralCodes').doc(referralCode).get();
        const referralData = referralDoc.data();

        // Récompense pour le parrain (15%)
        const referrerReward = {
            rewardId: this.generateRewardId(),
            userId: referrerId,
            type: 'referrer',
            amount: referralData.rewards.referrer,
            referralCode: referralCode,
            referredUserId: referredUserId,
            status: 'pending', // Devient 'active' après premier achat du filleul
            awardedAt: firebase.firestore.FieldValue.serverTimestamp(),
            activatedAt: null
        };

        // Récompense pour le filleul (10%)
        const referredReward = {
            rewardId: this.generateRewardId(),
            userId: referredUserId,
            type: 'referred',
            amount: referralData.rewards.referred,
            referralCode: referralCode,
            status: 'active', // Immédiatement actif pour le filleul
            awardedAt: firebase.firestore.FieldValue.serverTimestamp(),
            activatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Sauvegarder les récompenses
        await this.db.collection('referralRewards').doc(referrerReward.rewardId).set(referrerReward);
        await this.db.collection('referralRewards').doc(referredReward.rewardId).set(referredReward);

        // Mettre à jour les stats utilisateurs
        await this.updateUserRewards(referredUserId, referredReward.amount, 'referred');
    }

    // 🔄 ACTIVER LA RÉCOMPENSE DU PARRAIN (après premier achat du filleul)
    async activateReferrerReward(referredUserId) {
        const rewardQuery = await this.db.collection('referralRewards')
            .where('referredUserId', '==', referredUserId)
            .where('type', '==', 'referrer')
            .where('status', '==', 'pending')
            .get();

        if (!rewardQuery.empty) {
            const rewardDoc = rewardQuery.docs[0];
            await rewardDoc.ref.update({
                status: 'active',
                activatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Attribuer la récompense au parrain
            const rewardData = rewardDoc.data();
            await this.updateUserRewards(rewardData.userId, rewardData.amount, 'referrer');
        }
    }

    // 📊 METTRE À JOUR LES RÉCOMPENSES UTILISATEUR
    async updateUserRewards(userId, amount, type) {
        const userRef = this.db.collection('users').doc(userId);
        
        const updateData = {
            'referralStats.totalEarned': firebase.firestore.FieldValue.increment(amount),
            'availableRewards': firebase.firestore.FieldValue.increment(amount),
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (type === 'referrer') {
            updateData['referralStats.totalReferred'] = firebase.firestore.FieldValue.increment(1);
        }

        await userRef.update(updateData);
    }

    // 🎁 APPLIQUER UNE RÉCOMPENSE AU PANIER
    async applyRewardToCart(userId, rewardId) {
        const rewardDoc = await this.db.collection('referralRewards').doc(rewardId).get();
        
        if (!rewardDoc.exists) {
            throw new Error("Récompense non trouvée");
        }

        const reward = rewardDoc.data();
        
        if (reward.userId !== userId) {
            throw new Error("Cette récompense ne vous appartient pas");
        }

        if (reward.status !== 'active') {
            throw new Error("Récompense non active");
        }

        // Utiliser le système de codes promo existant
        if (window.panierUnifie) {
            const success = await window.panierUnifie.appliquerCodePromo(`REWARD-${rewardId.substring(0, 8)}`);
            
            if (success) {
                // Marquer la récompense comme utilisée
                await rewardDoc.ref.update({
                    status: 'used',
                    usedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Retirer des récompenses disponibles
                await this.db.collection('users').doc(userId).update({
                    availableRewards: firebase.firestore.FieldValue.increment(-reward.amount)
                });
            }
            
            return success;
        }
        
        return false;
    }

    // 📈 RÉCUPÉRER LES STATS POUR LE DASHBOARD ADMIN
    async getAdminStats() {
        const [
            usersCount,
            referralCodesCount,
            activeReferrals,
            totalRewards
        ] = await Promise.all([
            this.db.collection('users').count().get(),
            this.db.collection('referralCodes').count().get(),
            this.db.collection('referralCodes').where('stats.active', '==', true).count().get(),
            this.db.collection('referralRewards').count().get()
        ]);

        return {
            totalUsers: usersCount.data().count,
            totalReferralCodes: referralCodesCount.data().count,
            activeReferralCodes: activeReferrals.data().count,
            totalRewardsDistributed: totalRewards.data().count
        };
    }

    // 🔧 GÉNÉRER UN ID DE RÉCOMPENSE
    generateRewardId() {
        return 'reward_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 🎨 METTRE À JOUR L'INTERFACE
    updateUI() {
        if (!this.currentUser) return;

        // Mettre à jour l'affichage du code de parrainage
        const referralDisplay = document.getElementById('userReferralCode');
        if (referralDisplay) {
            this.getUserReferralCode().then(code => {
                referralDisplay.textContent = code;
            });
        }

        // Mettre à jour les statistiques
        this.updateUserStatsDisplay();
    }

    async getUserReferralCode() {
        if (!this.currentUser) return '';
        
        const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
        return userDoc.exists ? userDoc.data().referralCode : '';
    }

    async updateUserStatsDisplay() {
        if (!this.currentUser) return;

        const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Mettre à jour l'interface
            const statsElement = document.getElementById('userReferralStats');
            if (statsElement) {
                statsElement.innerHTML = `
                    <div>👥 Personnes parrainées: ${userData.referralStats?.totalReferred || 0}</div>
                    <div>💰 Gains totaux: ${userData.referralStats?.totalEarned || 0} MRU</div>
                    <div>🎁 Récompenses disponibles: ${userData.availableRewards || 0} MRU</div>
                `;
            }
        }
    }

    // 🔗 GÉNÉRER LE LIEN DE PARRAINAGE
    generateReferralLink(referralCode) {
        const baseUrl = window.location.origin;
        return `${baseUrl}/register.html?ref=${referralCode}`;
    }

    // 📋 RÉCUPÉRER L'HISTORIQUE DES RÉCOMPENSES
    async getUserRewardHistory(userId) {
        const rewardsQuery = await this.db.collection('referralRewards')
            .where('userId', '==', userId)
            .orderBy('awardedAt', 'desc')
            .limit(20)
            .get();

        return rewardsQuery.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }
}

// ===== INITIALISATION GLOBALE =====
let referralSystem;

document.addEventListener('DOMContentLoaded', function() {
    referralSystem = new ReferralSystem();
    console.log('🚀 Système de parrainage initialisé');
});
