// TEST DES POPUPS - Collez dans la console
console.log('🧪 TEST DES FONCTIONNALITÉS ADMIN');

function testAdminFunctions() {
    console.log('🔍 Test des fonctions admin:');
    
    const functions = [
        'ouvrirDashboardAdmin',
        'showAnalytics', 
        'showCodeManager',
        'openAdminDirect',
        'showPopupBlockedMessage'
    ];
    
    let available = 0;
    functions.forEach(func => {
        if (typeof window[func] === 'function') {
            console.log(`   ✅ ${func}: DISPONIBLE`);
            available++;
        } else {
            console.log(`   ❌ ${func}: MANQUANTE`);
        }
    });
    
    console.log(`📊 ${available}/${functions.length} fonctions disponibles`);
    
    // Test d'ouverture (sans vraiment ouvrir)
    console.log('🚀 Test simulé d\\'ouverture:');
    try {
        // Simuler un clic sur tableau de bord
        console.log('   🖱️ Clic sur "Tableau de bord" simulé');
        if (typeof ouvrirDashboardAdmin === 'function') {
            console.log('   ✅ Fonction ouvrirDashboardAdmin prête');
        }
    } catch (error) {
        console.log('   ❌ Erreur simulation:', error);
    }
    
    // Instructions pour l'utilisateur
    console.log('🎯 INSTRUCTIONS:');
    console.log('   1. Cliquez sur "Tableau de bord"');
    console.log('   2. Si popup bloquée → message d\\'aide s\\'affiche');
    console.log('   3. Sinon → dashboard s\\'ouvre normalement');
}

testAdminFunctions();
