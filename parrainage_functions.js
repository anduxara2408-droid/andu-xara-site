// Fonctions de traitement du parrainage
async function traiterParrainage(referralCode, newUserId, newUserEmail) {
    try {
        const parrainQuery = await db.collection("parrainage")
            .where('referralCode', '==', referralCode)
            .where('actif', '==', true)
            .get();
            
        if (parrainQuery.empty) {
            console.log('❌ Code parrainage invalide');
            return;
        }
        
        const parrainDoc = parrainQuery.docs[0];
        const parrainData = parrainDoc.data();
        const parrainId = parrainDoc.id;
        
        if (parrainData.utilisations >= parrainData.maxUtilisations) {
            console.log('❌ Code déjà utilisé');
            return;
        }
        
        // MARQUE COMME UTILISÉ
        await db.collection("parrainage").doc(parrainId).update({
            utilisations: parrainData.utilisations + 1,
            actif: false,
            dateUtilisation: new Date(),
            usedBy: newUserId,
            usedByEmail: newUserEmail
        });
        
        // ATTRIBUE RÉCOMPENSES
        await attribuerRecompenseParrain(parrainId, parrainData.userId);
        await attribuerRecompenseFilleul(newUserId);
        
        console.log('✅ Parrainage traité !');
        
    } catch (error) {
        console.error('Erreur parrainage:', error);
    }
}

async function attribuerRecompenseParrain(parrainageId, parrainUserId) {
    const recompense = {
        type: 'parrainage_reussi',
        montant: 1000,
        description: 'Récompense parrainage - Nouveau client',
        dateAttribution: new Date(),
        statut: 'actif',
        parrainageId: parrainageId,
        userId: parrainUserId
    };
    
    await db.collection("rewards").add(recompense);
    await db.collection("parrainage").doc(parrainageId).update({ recompenseAttribuee: true });
}

async function attribuerRecompenseFilleul(newUserId) {
    const recompense = {
        type: 'bienvenue_parrainage',
        montant: 500,
        description: 'Réduction bienvenue - Parrainage',
        dateAttribution: new Date(),
        statut: 'actif',
        userId: newUserId
    };
    
    await db.collection("rewards").add(recompense);
}

async function genererLienParrainageForNewUser(userId, email) {
    const referralCode = 'ANDU-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    await db.collection("parrainage").doc(userId).set({
        referralCode: referralCode,
        userId: userId,
        email: email,
        dateCreation: new Date(),
        utilisations: 0,
        maxUtilisations: 1,
        actif: true,
        recompenseAttribuee: false
    });
}
