// ===== SYSTÈME AUTOMATIQUE DE PARRAINAGE =====
class ParrainageAutomatique {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
    }

    // Détecter et traiter le parrainage à l'inscription
    async traiterParrainageInscription(user, displayName) {
        try {
            console.log('🔄 Début traitement parrainage pour:', user.email);
            
            // 1. Vérifier s'il y a un code parrain dans l'URL
            const urlParams = new URLSearchParams(window.location.search);
            const codeParrain = urlParams.get('parrain');
            
            if (!codeParrain) {
                console.log('ℹ️ Aucun code parrain détecté');
                return;
            }

            console.log('🎯 Code parrain détecté:', codeParrain);

            // 2. Trouver le parrain via son code
            const parrainQuery = await this.db.collection('users')
                .where('referralCode', '==', codeParrain)
                .get();

            if (parrainQuery.empty) {
                console.log('❌ Parrain non trouvé avec le code:', codeParrain);
                return;
            }

            const parrainDoc = parrainQuery.docs[0];
            const parrainData = parrainDoc.data();
            const parrainId = parrainDoc.id;

            console.log('✅ Parrain trouvé:', parrainData.email);

            // 3. Créer le document utilisateur AVEC les infos de parrainage
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                role: 'client',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                isActive: true,
                referralCode: this.genererCodeParrainage(),
                parrainage: {
                    parrainId: parrainId,
                    parrainCode: codeParrain,
                    dateParrainage: firebase.firestore.FieldValue.serverTimestamp(),
                    aRecuRecompense: false
                },
                preferences: {
                    newsletter: true,
                    promotions: true
                }
            };

            await this.db.collection('users').doc(user.uid).set(userData);
            console.log('📝 Document utilisateur créé avec infos parrainage');

            // 4. Appliquer les récompenses
            await this.appliquerRecompensesParrainage(parrainId, user.uid, user.email);

            console.log('🎉 Parrainage traité avec succès!');

        } catch (error) {
            console.error('❌ Erreur traitement parrainage:', error);
        }
    }

    // Appliquer les récompenses au parrain et au filleul
    async appliquerRecompensesParrainage(parrainId, filleulId, filleulEmail) {
        try {
            console.log('💰 Application des récompenses...');

            // Récompense pour le filleul (10% de réduction)
            const recompenseFilleul = {
                type: 'reduction_bienvenue',
                code: 'BIENVENUE10',
                valeur: 10, // 10%
                statut: 'actif',
                dateCreation: firebase.firestore.FieldValue.serverTimestamp(),
                dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
            };

            await this.db.collection('users').doc(filleulId).update({
                'parrainage.aRecuRecompense': true,
                recompenses: firebase.firestore.FieldValue.arrayUnion(recompenseFilleul)
            });

            console.log('✅ Récompense filleul appliquée: 10% de réduction');

            // Récompense pour le parrain (15% de commission)
            const gainParrain = 15; // 15% de commission
            const transactionParrain = {
                type: 'commission_parrainage',
                filleulId: filleulId,
                filleulEmail: filleulEmail,
                montant: gainParrain,
                statut: 'gagne',
                date: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Mettre à jour les stats du parrain
            await this.db.collection('users').doc(parrainId).update({
                'parrainage.referredCount': firebase.firestore.FieldValue.increment(1),
                'parrainage.totalEarnings': firebase.firestore.FieldValue.increment(gainParrain),
                'parrainage.availableEarnings': firebase.firestore.FieldValue.increment(gainParrain),
                transactions: firebase.firestore.FieldValue.arrayUnion(transactionParrain)
            });

            console.log('✅ Récompense parrain appliquée: +15 MRU');

            // 5. Envoyer une notification au parrain
            await this.creerNotificationParrain(parrainId, filleulEmail);

        } catch (error) {
            console.error('❌ Erreur application récompenses:', error);
        }
    }

    // Créer une notification pour le parrain
    async creerNotificationParrain(parrainId, filleulEmail) {
        try {
            const notification = {
                type: 'nouveau_filleul',
                titre: '🎉 Nouveau filleul parrainé !',
                message: `${filleulEmail} s'est inscrit avec votre lien de parrainage`,
                date: firebase.firestore.FieldValue.serverTimestamp(),
                lue: false
            };

            await this.db.collection('users').doc(parrainId).update({
                notifications: firebase.firestore.FieldValue.arrayUnion(notification)
            });

            console.log('📢 Notification créée pour le parrain');
        } catch (error) {
            console.error('❌ Erreur création notification:', error);
        }
    }

    // Générer un code de parrainage unique
    genererCodeParrainage() {
        return 'ANDU' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
}

// ===== INITIALISATION =====
let parrainageAuto = null;

function getParrainageAutomatique() {
    if (!parrainageAuto) {
        parrainageAuto = new ParrainageAutomatique();
    }
    return parrainageAuto;
}

// Détecter l'inscription et déclencher le parrainage
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        console.log('🔍 Vérification parrainage pour:', user.email);
        
        // Vérifier si c'est une nouvelle inscription
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            console.log('🆕 Nouvelle inscription détectée');
            const parrainageSystem = getParrainageAutomatique();
            await parrainageSystem.traiterParrainageInscription(user, user.displayName || 'Utilisateur');
        }
    }
});

console.log('🚀 Système de parrainage automatique initialisé');

