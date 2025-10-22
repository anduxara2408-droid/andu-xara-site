// firebase-parrainage-complet.js - Système de parrainage complet
console.log('🤝 Chargement système parrainage Firebase');

class FirebaseParrainageSystem {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.init();
    }

    async init() {
        console.log('🔄 Initialisation système parrainage');
        
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
                referrerReward: 15, // 15% pour le parrain
                referredReward: 10, // 10% pour le filleul
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Mettre à jour les stats du parrain
            await this.db.collection('userReferrals').doc(referrerUid).update({
                referredCount: firebase.firestore.FieldValue.increment(1),
                totalEarnings: firebase.firestore.FieldValue.increment(15),
                availableEarnings: firebase.firestore.FieldValue.increment(15),
                lastReferralAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Créer le code promo de bienvenue pour le filleul
            await this.creerCodeBienvenueFilleul(user.uid);

            // Créer ou mettre à jour le document de parrainage de l'utilisateur
            await this.db.collection('userReferrals').doc(user.uid).set({
                referredBy: referrerUid,
                referralCodeUsed: referralCode,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                hasUsedWelcomeCode: false
            }, { merge: true });

            console.log('✅ Parrainage traité avec succès');
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
            const userRefDoc = await this.db.collection('userReferrals').doc(uid).get();
            
            if (userRefDoc.exists) {
                const data = userRefDoc.data();
                
                // Afficher le code de parrainage
                const codeElement = document.getElementById('userReferralCode');
                if (codeElement && data.code) {
                    codeElement.textContent = data.code;
                }
                
                // Afficher les statistiques
                this.afficherStatistiquesParrainage(data);
                
                // Générer le lien de parrainage
                this.genererLienParrainage(data.code);
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
            '🎉 Parrainage réussi ! Vous avez gagné 10% de réduction et votre parrain 15% !', 
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
                background: ${type === 'error' ? '#ff4757' : '#25D366'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 10000;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 5000);
        }
    }
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation système parrainage');
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
