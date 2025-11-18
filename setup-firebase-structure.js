// Script à exécuter dans la console Firebase
const db = firebase.firestore();

// Créer un code promo de test
async function setupTestData() {
    // Code promo de test
    await db.collection('promocodes').doc('TEST2025').set({
        code: 'TEST2025',
        type: 'percentage',
        value: 15,
        minAmount: 5000,
        usageLimit: 100,
        validUntil: new Date('2025-12-31'),
        enabled: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Structure Firebase configurée');
}

setupTestData();
