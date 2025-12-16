// ===== CONFIGURATION FIREBASE CORRECTE =====
console.log('🔥 Initialisation Firebase...');

let auth, db;
window.FIRESTORE_AVAILABLE = false;

// Configuration Firebase CORRECTE depuis la console
const firebaseConfig = {
    apiKey: "AIzaSyC-OHtqpgOZI9AIb_WotYbiUS2L-Ac5vII",
    authDomain: "andu-xara-promo-codes-ff69e.firebaseapp.com",
    projectId: "andu-xara-promo-codes-ff69e",
    storageBucket: "andu-xara-promo-codes-ff69e.firebasestorage.app",
    messagingSenderId: "653516716143",
    appId: "1:653516716143:web:08ee1425191b4a1766359a",
    databaseURL: "https://andu-xara-promo-codes-ff69e-default-rtdb.europe-west1.firebasedatabase.app/" // AJOUTEZ CETTE LIGNE
};
// Initialiser Firebase
// Remplacer l'initialisation Firebase actuelle par :
function initializeFirebase() {
    return new Promise((resolve, reject) => {
        try {
            if (typeof firebase === 'undefined') {
                console.error('❌ Firebase non chargé');
                window.FIRESTORE_AVAILABLE = false;
                resolve();
                return;
            }
            
            // Vérifier si déjà initialisé
            if (firebase.apps.length > 0) {
                console.log('✅ Firebase déjà initialisé');
                auth = firebase.auth();
                db = firebase.firestore();
                window.FIRESTORE_AVAILABLE = true;
                resolve();
                return;
            }
            
            // Initialiser avec la configuration
            firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            db = firebase.firestore();
            window.FIRESTORE_AVAILABLE = true;
            
            console.log('✅ Firebase initialisé avec succès');
            resolve();
            
        } catch (error) {
            console.error('❌ Erreur initialisation Firebase:', error);
            window.FIRESTORE_AVAILABLE = false;
            resolve();
        }
    });
}

// Initialiser Firebase
setTimeout(() => {
    initializeFirebase().then(() => {
        console.log('✅ Firebase prêt');
    }).catch(error => {
        console.log('🔄 Mode dégradé activé');
    });
}, 1000);

// ===== DÉTECTION CONNEXION DEPUIS REDUCTIONS.HTML =====
function checkAuthFromReductions() {
    console.log('🔄 Vérification connexion depuis reductions.html...');
    
    if (!window.FIRESTORE_AVAILABLE) {
        console.log('⚠️ Firestore indisponible - Mode local uniquement');
    }
    
    // Méthode 1: Vérifier Firebase Auth
    const firebaseUser = auth ? auth.currentUser : null;
    if (firebaseUser) {
        console.log('✅ Utilisateur Firebase connecté:', firebaseUser.email);
        synchroniserUtilisateurFirebase(firebaseUser);
        return true;
    }
    
    // Méthode 2: Vérifier le localStorage de reductions.html
    const lastUser = localStorage.getItem('anduxara_last_user');
    const activePromo = localStorage.getItem('anduxara_active_promo');
    
    if (lastUser) {
        console.log('📱 Utilisateur trouvé dans localStorage:', lastUser);
        
        const waitForPromoSystem = setInterval(() => {
            if (window.promoSystem && !window.promoSystem.currentUser) {
                clearInterval(waitForPromoSystem);
                
                window.promoSystem.currentUser = {
                    uid: 'local-' + Date.now(),
                    email: lastUser
                };
                
                if (!window.promoSystem.userData) {
                    window.promoSystem.createUserData();
                }
                
                updateAuthStatus();
                console.log('✅ Utilisateur synchronisé depuis reductions.html');
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(waitForPromoSystem);
        }, 5000);
        
        if (activePromo) {
            try {
                const promoData = JSON.parse(activePromo);
                if (promoData.userEmail === lastUser) {
                    console.log('🎁 Code promo actif détecté:', promoData.code);
                    setTimeout(() => {
                        applyPromoToCart(promoData.code, promoData.discount);
                    }, 1000);
                }
            } catch (error) {
                console.error('❌ Erreur parsing promo:', error);
            }
        }
        
        return true;
    }
    
    // Méthode 3: Vérifier les paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth');
    const userEmail = urlParams.get('email');
    
    if (authToken && userEmail) {
        console.log('🔗 Connexion depuis URL détectée:', userEmail);
        
        const waitForPromoSystem = setInterval(() => {
            if (window.promoSystem && !window.promoSystem.currentUser) {
                clearInterval(waitForPromoSystem);
                
                window.promoSystem.currentUser = {
                    uid: 'url-' + Date.now(),
                    email: userEmail
                };
                
                if (!window.promoSystem.userData) {
                    window.promoSystem.createUserData();
                }
                
                updateAuthStatus();
                
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
                
                console.log('✅ Utilisateur synchronisé depuis URL');
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(waitForPromoSystem);
        }, 5000);
        
        return true;
    }
    
    console.log('❌ Aucun utilisateur connecté détecté');
    return false;
}

// Fonction pour synchroniser l'utilisateur Firebase
function synchroniserUtilisateurFirebase(user) {
    if (window.promoSystem) {
        if (!window.promoSystem.currentUser || window.promoSystem.currentUser.uid !== user.uid) {
            window.promoSystem.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            };
            
            setTimeout(() => {
                if (window.promoSystem && !window.promoSystem.userData) {
                    window.promoSystem.loadUserData();
                }
            }, 500);
            
            updateAuthStatus();
            console.log('✅ Utilisateur Firebase synchronisé avec système promo');
        }
    }
    
    localStorage.setItem('anduxara_last_user', user.email);
}


// ===== MISE À JOUR STATUT AUTH =====
function updateAuthStatus() {
    const statusElement = document.getElementById('auth-status-text');
    const statusSection = document.getElementById('auth-status-section');
    
    if (!statusElement || !statusSection) return;
    
    // Vérifier d'abord Firebase Auth
    const firebaseUser = auth ? auth.currentUser : null;
    
    // Vérifier le système promo
    const promoUser = window.promoSystem ? window.promoSystem.currentUser : null;
    
    // Vérifier localStorage
    const lastUser = localStorage.getItem('anduxara_last_user');
    
    console.log('🔍 État auth - Firebase:', !!firebaseUser, 'PromoSystem:', !!promoUser, 'LocalStorage:', lastUser);
    
    if (firebaseUser) {
        // ✅ Utilisateur Firebase connecté
        statusElement.textContent = `Connecté (${firebaseUser.email})`;
        statusElement.style.color = '#27ae60';
        statusSection.style.background = '#e8f5e8';
        console.log('✅ Statut: Connecté Firebase');
        
    } else if (promoUser && promoUser.email) {
        // ✅ Utilisateur système promo connecté
        statusElement.textContent = `Connecté (${promoUser.email})`;
        statusElement.style.color = '#27ae60';
        statusSection.style.background = '#e8f5e8';
        console.log('✅ Statut: Connecté PromoSystem');
        
    } else if (lastUser) {
        // ⚠️ Mode local uniquement
        statusElement.textContent = `Connecté (${lastUser})`;
        statusElement.style.color = '#27ae60'; // Même couleur verte
        statusSection.style.background = '#e8f5e8'; // Même fond vert
        console.log('✅ Statut: Connecté LocalStorage');
        
    } else {
        // ❌ Non connecté
        statusElement.textContent = 'Non connecté - Codes promo désactivés';
        statusElement.style.color = '#e74c3c';
        statusSection.style.background = '#ffe8e8';
        console.log('❌ Statut: Non connecté');
    }
    
    updateActivePromoDisplay();
}

// ===== INITIALISATION AU CHARGEMENT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation DOMContentLoaded');
   
    const waitForPromoClass = setInterval(() => {
        if (typeof PromoSystem !== 'undefined') {
            clearInterval(waitForPromoClass);
            console.log('✅ Classe PromoSystem disponible');
            
            if (!window.promoSystem) {
                window.promoSystem = initPromoSystem();
                console.log('✅ window.promoSystem initialisé');
            }
            
            setTimeout(() => {
                checkAuthFromReductions();
                setInterval(updateAuthStatus, 3000);
                
                document.addEventListener('visibilitychange', function() {
                    if (!document.hidden) {
                        setTimeout(checkAuthFromReductions, 1000);
                    }
                });
                
            }, 1500);
        }
    }, 100);
    
    setTimeout(() => {
        clearInterval(waitForPromoClass);
        if (!window.promoSystem) {
            console.warn('⚠️ PromoSystem non chargé après 10 secondes');
        }
    }, 10000);
});

// ===== SURCHARGE FONCTION AUTH SYSTÈME PROMO =====
if (window.promoSystem && window.promoSystem.showLoginPrompt) {
    window.promoSystem.showLoginPrompt = function() {
        const message = `🔐 Connexion Requise
    
Pour utiliser les codes promo, veuillez vous connecter à votre compte.

Cela permet de :
- Sauvegarder vos réductions
- Éviter les abus  
- Personnaliser votre expérience

Voulez-vous vous connecter maintenant ?`;

        if (confirm(message)) {
            const promoInput = document.getElementById('promoInput');
            if (promoInput && promoInput.value.trim()) {
                localStorage.setItem('pending_promo_code', promoInput.value.trim());
            }
            
            window.location.href = 'reductions.html?action=login&source=homepage&pending_promo=' + encodeURIComponent(promoInput.value.trim());
        }
    };
}

// ==== INITIALISATION RAPIDE UTILISATEUR ====
setTimeout(() => {
    const lastUser = localStorage.getItem('anduxara_last_user');
    if (lastUser && window.promoSystem) {
        console.log('🚀 Initialisation rapide avec utilisateur:', lastUser);
        
        window.promoSystem.currentUser = {
            uid: 'quick-' + Date.now(),
            email: lastUser
        };
        
        if (!window.promoSystem.userData) {
            window.promoSystem.createUserData();
        }
        
        updateAuthStatus();
        console.log('✅ Utilisateur initialisé rapidement');
    } else if (lastUser && !window.promoSystem) {
        console.log('⚠️ Utilisateur trouvé mais promoSystem pas encore chargé');
    }
}, 500);

// ===== SYNCHRONISATION AUTH ENTRE PAGES =====
function checkAuthFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth');
    const userEmail = urlParams.get('email');
    
    if (authToken && userEmail) {
        console.log('🔄 Récupération auth depuis URL:', userEmail);
        
        const waitForPromoSystem = setInterval(() => {
            if (window.promoSystem && !window.promoSystem.currentUser) {
                clearInterval(waitForPromoSystem);
                
                window.promoSystem.currentUser = {
                    uid: 'from-url-' + Date.now(),
                    email: userEmail
                };
                
                if (!window.promoSystem.userData) {
                    window.promoSystem.createUserData();
                }
                
                updateAuthStatus();
                localStorage.setItem('anduxara_last_user', userEmail);
                
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
                
                showNotification(`🔄 Reconnexion automatique pour ${userEmail}`, 'success');
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(waitForPromoSystem);
        }, 5000);
    }
}

setTimeout(checkAuthFromURL, 1500);

// ===== VÉRIFICATION CODES PROMO AU CHARGEMENT =====
function verifyPromoOnLoad() {
    console.log('🔍 Vérification des codes promo au chargement...');
    
    const savedPromoCode = localStorage.getItem('anduxara_active_promo_code');
    
    if (savedPromoCode && window.promoSystem && window.promoSystem.currentUser) {
        const checkUsed = setInterval(async () => {
            if (window.promoSystem.userData && window.promoSystem.userData.usedPromoCodes) {
                clearInterval(checkUsed);
                
                const codeUpper = savedPromoCode.toUpperCase();
                const alreadyUsed = window.promoSystem.userData.usedPromoCodes.some(function(usedCode) {
                    return usedCode.code === codeUpper;
                });
                
                if (alreadyUsed) {
                    console.log('🔒 Code déjà utilisé détecté au chargement - Nettoyage');
                    
                    localStorage.removeItem('anduxara_active_promo');
                    localStorage.removeItem('anduxara_active_promo_code');
                    localStorage.removeItem('anduxara_promo_discount');
                    
                    if (window.activePromoCode) window.activePromoCode = null;
                    if (window.promoDiscount) window.promoDiscount = 0;
                    
                    if (window.promoSystem.activePromo) {
                        window.promoSystem.activePromo = null;
                    }
                    
                    updateActivePromoDisplay();
                    showNotification('ℹ️ Le code promo a déjà été utilisé', 'info');
                }
            }
        }, 500);
        
        setTimeout(() => clearInterval(checkUsed), 5000);
    }
}

// Appeler au chargement
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(verifyPromoOnLoad, 2000);
});

// ===== PERSISTANCE AUTH =====
function initAuthPersistence() {
    const lastUser = localStorage.getItem('anduxara_last_user');
    if (lastUser) {
        console.log('🔄 Restauration utilisateur depuis localStorage:', lastUser);
        
        const waitForPromoSystem = setInterval(() => {
            if (window.promoSystem && !window.promoSystem.currentUser) {
                clearInterval(waitForPromoSystem);
                
                window.promoSystem.currentUser = {
                    uid: 'persisted-' + Date.now(),
                    email: lastUser
                };
                
                setTimeout(() => {
                    if (window.promoSystem && !window.promoSystem.userData) {
                        window.promoSystem.createUserData();
                    }
                    updateAuthStatus();
                }, 500);
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(waitForPromoSystem);
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAuthPersistence, 2000);
    setTimeout(verifyPromoOnLoad, 2000);
    setInterval(updateAuthStatus, 3000);
});
