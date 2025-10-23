// firebase-parrainage-complet.js - Système de parrainage complet CORRIGÉ
console.log('🤝 Chargement système parrainage Firebase');

class FirebaseParrainageSystem {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.init();
    }

    async init() {
        console.log('🔄 Initialisation système parrainage - Version 5 MRU + 10% commissions');

        // Écouter les changements d'authentification
        this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                await this.verifierEtTraiterParrainage();
                await this.mettreAJourAffichageParrainage(user.uid);
            }
        });
    }

    // Vérifier et traiter le parrainage au chargement
    async verifierEtTraiterParrainage() {
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');

        if (referralCode) {
            console.log('🎯 Code parrainage détecté:', referralCode);
            await this.traiterParrainage(referralCode);

            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Traiter un parrainage
    async traiterParrainage(referralCode) {
        try {
            const user = this.auth.currentUser;
            if (!user) {
                console.log('⚠️ Utilisateur non connecté, parrainage en attente');
                localStorage.setItem('pending_referral', referralCode);
                return false;
            }

            // Vérifier si le parrainage a déjà été traité
            const alreadyProcessed = await this.verifierParrainageExistant(user.uid);
            if (alreadyProcessed) {
                console.log('⚠️ Parrainage déjà traité pour cet utilisateur');
                return false;
            }

            // Trouver le parrain
            const referrerQuery = await this.db.collection('userReferrals')
                .where('code', '==', referralCode)
                .get();

            if (referrerQuery.empty) {
                throw new Error('Code de parrainage invalide');
            }

            const referrerDoc = referrerQuery.docs[0];
            const referrerUid = referrerDoc.id;
            const referrerData = referrerDoc.data();

            // Vérifier que l'utilisateur ne se parraine pas lui-même
            if (referrerUid === user.uid) {
                throw new Error('Auto-parrainage non autorisé');
            }

            // Enregistrer le parrainage
            await this.db.collection('referralHistory').add({
                referrerUid: referrerUid,
                referredUid: user.uid,
                referralCode: referralCode,
                referredEmail: user.email,
                status: 'completed',
                referrerReward: 5, // ⭐ CORRIGÉ : 5 MRU pour le parrain
                referredReward: 10, // 10% pour le filleul
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Mettre à jour les stats du parrain dans userReferrals
            await this.db.collection('userReferrals').doc(referrerUid).update({
                referredCount: firebase.firestore.FieldValue.increment(1),
                totalEarnings: firebase.firestore.FieldValue.increment(5), // ⭐ CORRIGÉ : 5 MRU
                availableEarnings: firebase.firestore.FieldValue.increment(5), // ⭐ CORRIGÉ : 5 MRU
                lastReferralAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // ⭐ CORRECTION : Synchroniser avec la collection users pour l'affichage
            await this.db.collection('users').doc(referrerUid).update({
                'parrainage.referredCount': firebase.firestore.FieldValue.increment(1),
                'parrainage.totalEarnings': firebase.firestore.FieldValue.increment(5), // ⭐ 5 MRU
                'parrainage.availableEarnings': firebase.firestore.FieldValue.increment(5), // ⭐ 5 MRU
                'parrainage.lastReferralAt': firebase.firestore.FieldValue.serverTimestamp()
            });

            // Créer le code promo de bienvenue pour le filleul
            await this.creerCodeBienvenueFilleul(user.uid);

            // ⭐ AJOUT : ENREGISTRER POUR COMMISSIONS FUTURES 10%
            await this.db.collection('userReferrals').doc(user.uid).set({
                referrerUid: referrerUid, // Référence vers le parrain
                canEarnCommissions: true,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            // Créer ou mettre à jour le document de parrainage de l'utilisateur
            await this.db.collection('userReferrals').doc(user.uid).set({
                referredBy: referrerUid,
                referralCodeUsed: referralCode,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                hasUsedWelcomeCode: false
            }, { merge: true });

            console.log('✅ Parrainage traité avec succès - 5 MRU attribués + 10% commissions futures');
            this.afficherNotificationParrainage();

            // Nettoyer le parrainage en attente
            localStorage.removeItem('pending_referral');

            return true;

        } catch (error) {
            console.error('❌ Erreur traitement parrainage:', error);
            this.afficherNotification('Erreur parrainage: ' + error.message, 'error');
            return false;
        }
    }

    // Vérifier si le parrainage existe déjà
    async verifierParrainageExistant(userUid) {
        const referralHistory = await this.db.collection('referralHistory')
            .where('referredUid', '==', userUid)
            .get();

        return !referralHistory.empty;
    }

    // Créer code de bienvenue pour le filleul
    async creerCodeBienvenueFilleul(userUid) {
        const user = this.auth.currentUser;
        const code = 'BIENVENUE' + Math.random().toString(36).substr(2, 4).toUpperCase();

        await this.db.collection('promocodes').add({
            code: code,
            type: 'percentage',
            value: 10,
            isActive: true,
            maxUses: 1,
            usedCount: 0,
            createdFor: userUid,
            createdForEmail: user.email,
            isWelcomeCode: true,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('🎁 Code bienvenue créé:', code);
        return code;
    }

    // ⭐ NOUVEAU : Commission 10% sur achats filleuls
    async calculerCommissionAchat(parrainId, filleulId, montantAchat, produit) {
        try {
            console.log('💰 Calcul commission 10%...');
            
            const POURCENTAGE_COMMISSION = 10; // 10% du montant d'achat
            const commission = Math.round(montantAchat * (POURCENTAGE_COMMISSION / 100));
            
            console.log(`📊 Commission: ${commission} MRU (${POURCENTAGE_COMMISSION}% de ${montantAchat} MRU)`);

const transaction = {
    type: 'commission_pourcentage',
    filleulId: filleulId,
    montantAchat: montantAchat,
    produit: produit,
    pourcentage: POURCENTAGE_COMMISSION,
    commission: commission,
    date: new Date(), // ⭐ CORRIGÉ : Utiliser new Date() au lieu de serverTimestamp()
    message: `${POURCENTAGE_COMMISSION}% de commission sur achat ${produit}`
};

            // Mettre à jour dans userReferrals
            await this.db.collection('userReferrals').doc(parrainId).update({
                totalEarnings: firebase.firestore.FieldValue.increment(commission),
                availableEarnings: firebase.firestore.FieldValue.increment(commission),
                transactions: firebase.firestore.FieldValue.arrayUnion(transaction)
            });

            // Mettre à jour dans users (pour l'affichage)
            await this.db.collection('users').doc(parrainId).update({
                'parrainage.totalEarnings': firebase.firestore.FieldValue.increment(commission),
                'parrainage.availableEarnings': firebase.firestore.FieldValue.increment(commission),
                transactions: firebase.firestore.FieldValue.arrayUnion(transaction)
            });

            console.log('✅ Commission 10% appliquée:', commission, 'MRU');
            return commission;
            
        } catch (error) {
            console.error('❌ Erreur calcul commission:', error);
            return 0;
        }
    }

    // Générer un code de parrainage pour l'utilisateur
    async genererCodeParrainage(uid) {
        try {
            const code = 'ANDU' + Math.random().toString(36).substr(2, 6).toUpperCase();

            await this.db.collection('userReferrals').doc(uid).set({
                code: code,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                referredCount: 0,
                totalEarnings: 0,
                availableEarnings: 0,
                isActive: true
            }, { merge: true });

            console.log('🎫 Code parrainage généré:', code);
            return code;

        } catch (error) {
            console.error('❌ Erreur génération code parrainage:', error);
            throw error;
        }
    }

    // Mettre à jour l'affichage du parrainage
    async mettreAJourAffichageParrainage(uid) {
        try {
            // ⭐ CORRIGÉ : Utiliser la collection 'users' pour l'affichage
            const userDoc = await this.db.collection('users').doc(uid).get();

            if (userDoc.exists) {
                const data = userDoc.data();
                const parrainage = data.parrainage || {};

                // Afficher le code de parrainage (récupérer de userReferrals)
                const userRefDoc = await this.db.collection('userReferrals').doc(uid).get();
                const referralData = userRefDoc.exists ? userRefDoc.data() : {};

                const codeElement = document.getElementById('userReferralCode');
                if (codeElement && referralData.code) {
                    codeElement.textContent = referralData.code;
                }

                // Afficher les statistiques depuis 'users'
                this.afficherStatistiquesParrainage(parrainage);

                // Générer le lien de parrainage
                if (referralData.code) {
                    this.genererLienParrainage(referralData.code);
                }
            } else {
                // Générer un code si l'utilisateur n'en a pas
                const newCode = await this.genererCodeParrainage(uid);
                this.mettreAJourAffichageParrainage(uid); // Rappeler pour afficher
            }

        } catch (error) {
            console.error('❌ Erreur mise à jour affichage parrainage:', error);
        }
    }

    // Afficher les statistiques de parrainage
    afficherStatistiquesParrainage(data) {
        const statsElement = document.getElementById('userReferralStats');
        if (!statsElement) return;
        
        statsElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>👥 Personnes parrainées:</span>
                <span style="font-weight: bold;">${data.referredCount || 0}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>🎁 Gains totaux:</span>
                <span style="font-weight: bold;">${data.totalEarnings || 0} MRU</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>💎 Disponible:</span>
                <span style="font-weight: bold; color: #25D366;">${data.availableEarnings || 0} MRU</span>
            </div>
        `;
    }

    // Générer le lien de parrainage
    genererLienParrainage(code) {
        const link = `${window.location.origin}${window.location.pathname}?ref=${code}`;

        // Stocker le lien pour la fonction de copie
        window.referralLink = link;

        console.log('🔗 Lien parrainage généré:', link);
        return link;
    }

    // Afficher notification de succès
    afficherNotificationParrainage() {
        this.afficherNotification(
            '🎉 Parrainage réussi ! Vous avez gagné 10% de réduction et votre parrain 5 MRU + 10% sur vos achats !', 
            'success'
        );
    }

    afficherNotification(message, type = 'success') {
        // Utiliser le système de notification existant ou créer un fallback
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else if (typeof showMessage === 'function') {
            showMessage(message, type);
        } else {
            // Fallback basique
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : '#e53e3e'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 10000;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                max-width: 300px;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 5000);
        }
    }
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation système parrainage - Version 5 MRU + 10% commissions');
    window.parrainageSystem = new FirebaseParrainageSystem();
});

// Fonction pour copier le lien de parrainage
async function copierLienParrainage() {
    if (!window.referralLink) {
        const user = firebase.auth().currentUser;
        if (user && window.parrainageSystem) {
            await window.parrainageSystem.mettreAJourAffichageParrainage(user.uid);
        }
    }
    
    if (window.referralLink) {
        navigator.clipboard.writeText(window.referralLink).then(() => {
            if (window.parrainageSystem) {
                window.parrainageSystem.afficherNotification('✅ Lien copié ! Partagez-le avec vos amis.', 'success');
            }
        }).catch(() => {
            // Fallback
            const tempInput = document.createElement('input');
            tempInput.value = window.referralLink;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            if (window.parrainageSystem) {
                window.parrainageSystem.afficherNotification('✅ Lien copié !', 'success');
            }
        });
    } else {
        alert('Lien de parrainage non disponible');
    }
}

// ⭐ NOUVEAU : Fonction pour simuler un achat (TEST)
async function simulerAchatFilleul(produit, prix) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Connectez-vous d\'abord');
        return;
    }

    // Trouver le parrain du user connecté
    const userRefDoc = await firebase.firestore().collection('userReferrals').doc(user.uid).get();
    if (userRefDoc.exists && userRefDoc.data().referrerUid) {
        const parrainId = userRefDoc.data().referrerUid;
        const commission = await window.parrainageSystem.calculerCommissionAchat(parrainId, user.uid, prix, produit);
        
        alert(`🎉 Achat simulé : ${produit} - ${prix} MRU\n💎 Commission parrain : ${commission} MRU`);
    } else {
        alert('❌ Aucun parrain trouvé pour cet utilisateur');
    }
}
