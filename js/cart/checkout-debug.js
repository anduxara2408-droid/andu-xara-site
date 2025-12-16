// 🐛 DEBUG TEMPORAIRE - Processus de commande
console.log('🐛 Debug commande activé');

// Surcharger processFloatingCheckout pour voir ce qui se passe
const originalProcessCheckout = window.processFloatingCheckout;
window.processFloatingCheckout = async function() {
    console.log('🔍 processFloatingCheckout DÉBUT');
    
    try {
        // Vérifier le panier avant calcul
        console.log('📦 Panier avant calcul:', JSON.parse(JSON.stringify(floatingCart)));
        
        // Calcul manuel de vérification
        const manualTotal = floatingCart.reduce((sum, item) => {
            const itemPrice = item.promoPrice || item.price;
            const itemTotal = itemPrice * item.quantity;
            console.log(`🧮 ${item.name}: ${itemPrice} × ${item.quantity} = ${itemTotal}`);
            return sum + itemTotal;
        }, 0);
        
        console.log('💰 Total manuel:', manualTotal);
        
        // Appeler la fonction originale
        const result = await originalProcessCheckout.apply(this, arguments);
        console.log('✅ processFloatingCheckout FIN - Succès');
        return result;
        
    } catch (error) {
        console.error('❌ processFloatingCheckout ERREUR:', error);
        throw error;
    }
};

// Test manuel de la commande
window.testCommande = function() {
    console.log('🧪 Test manuel de commande');
    
    // Simuler un panier
    floatingCart = [{
        name: 'TEST PRODUIT',
        category: 'test',
        price: 1000,
        promoPrice: 1000,
        quantity: 2,
        addedAt: new Date().toISOString()
    }];
    
    console.log('📦 Panier de test:', floatingCart);
    
    // Lancer le processus de commande
    processFloatingCheckout();
};

console.log('🐛 Tapez testCommande() dans la console pour tester');

// ===== SYSTÈME AUTHENTIFICATION VISIBLE =====
function showAuthBenefits() {
    const benefits = document.getElementById('auth-benefits');
    if (benefits) {
        benefits.style.display = benefits.style.display === 'none' ? 'block' : 'none';
    }
}

function updateAuthStatus() {
    const statusElement = document.getElementById('auth-status-text');
    const statusSection = document.getElementById('auth-status-section');
    
    if (!statusElement || !statusSection) return;
    
    // Vérifier d'abord Firebase, puis le système promo, puis le localStorage
    const firebaseUser = firebase.auth().currentUser;
    
    // ✅ CORRECTION : Vérifier si promoSystem existe
    const promoUser = (typeof window.promoSystem !== 'undefined' && window.promoSystem) ? window.promoSystem.currentUser : null;
    const lastUser = localStorage.getItem('anduxara_last_user');
    
    if (firebaseUser) {
        statusElement.textContent = `Connecté (${firebaseUser.email})`;
        statusElement.style.color = '#27ae60';
        statusSection.style.background = '#e8f5e8';
        
        // Synchroniser avec le système promo si disponible
        if (window.promoSystem && (!window.promoSystem.currentUser || window.promoSystem.currentUser.uid !== firebaseUser.uid)) {
            window.promoSystem.currentUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email
            };
            if (!window.promoSystem.userData) {
                window.promoSystem.createUserData();
            }
        }
        
    } else if (promoUser && promoUser.email) {
        statusElement.textContent = `Connecté (${promoUser.email})`;
        statusElement.style.color = '#27ae60';
        statusSection.style.background = '#e8f5e8';
        
    } else if (lastUser) {
        statusElement.textContent = `Connecté (${lastUser}) - Mode local`;
        statusElement.style.color = '#f39c12';
        statusSection.style.background = '#fef9e7';
        
        // Initialiser le système promo avec l'utilisateur localStorage
        if (window.promoSystem && !window.promoSystem.currentUser) {
            window.promoSystem.currentUser = {
                uid: 'local-' + Date.now(),
                email: lastUser
            };

            if (!window.promoSystem.userData) {
                window.promoSystem.createUserData();
            }
        }
        
    } else {
        statusElement.textContent = 'Non connecté - Codes promo désactivés';
        statusElement.style.color = '#e74c3c';
        statusSection.style.background = '#ffe8e8';
    }
    
    // Cacher les avantages si connecté
    const benefits = document.getElementById('auth-benefits');
    if (benefits) {
        benefits.style.display = (firebaseUser || (promoUser && promoUser.email) || lastUser) ? 'none' : 'block';
    }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation bouton texte en bas...');
    initBackToTopButton();
});

