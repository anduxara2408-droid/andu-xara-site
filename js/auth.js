// ===== GESTION DE L'AUTHENTIFICATION =====

// Écouter les changements d'état de connexion
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log('✅ Utilisateur connecté:', user.email);
        
        // Récupérer les données utilisateur
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        // Sauvegarder en session
        sessionStorage.setItem('currentUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: userData?.displayName || user.email.split('@')[0],
            rewards: userData?.rewards || 0
        }));
        
        // Mettre à jour l'interface si les éléments existent
        updateUIForLoggedUser(user, userData);
        
        // Vérifier s'il y a une promo dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('promo')) {
            applyPromoFromUrl(user.uid, urlParams.get('promo'));
        }
        
        // Si on vient de s'inscrire, afficher un message
        if (window.location.search.includes('register=success')) {
            showNotification('✅ Bienvenue chez Andu-Xara ! Votre compte a été créé.');
            window.history.replaceState({}, document.title, '/');
        }
        
    } else {
        console.log('🔐 Utilisateur non connecté');
        sessionStorage.removeItem('currentUser');
        showGuestView();
    }
});

// Mettre à jour l'interface pour un utilisateur connecté
function updateUIForLoggedUser(user, userData) {
    const guestView = document.getElementById('guestView');
    const userView = document.getElementById('userView');
    const userNameEl = document.getElementById('userName');
    
    if (guestView) guestView.style.display = 'none';
    if (userView) userView.style.display = 'flex';
    
    if (userNameEl) {
        userNameEl.textContent = userData?.displayName || user.email.split('@')[0];
    }
}

// Afficher la vue invité
function showGuestView() {
    const guestView = document.getElementById('guestView');
    const userView = document.getElementById('userView');
    
    if (guestView) guestView.style.display = 'flex';
    if (userView) userView.style.display = 'none';
}

// ===== FONCTIONS DE CONNEXION =====

// Gestion de la connexion
window.handleLogin = async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    if (!email || !password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        
        // Récupérer les données utilisateur
        const userDoc = await db.collection('users').doc(result.user.uid).get();
        const userData = userDoc.data();
        
        // Sauvegarder en session
        sessionStorage.setItem('currentUser', JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            name: userData?.displayName || email.split('@')[0]
        }));
        
        // Fermer le modal
        hideLoginModal();
        
        // Notification
        showNotification(`✅ Bonjour ${userData?.displayName || ''} !`);
        
        // Redirection vers la page d'accueil
        window.location.href = '/?login=success';
        
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
};

// Gestion de l'inscription
window.handleRegister = async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('regName')?.value;
    const email = document.getElementById('regEmail')?.value;
    const password = document.getElementById('regPassword')?.value;
    const confirm = document.getElementById('regConfirm')?.value;
    
    if (!name || !email || !password || !confirm) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    if (password !== confirm) {
        alert('Les mots de passe ne correspondent pas');
        return;
    }
    
    try {
        // Créer l'utilisateur dans Firebase Auth
        const result = await auth.createUserWithEmailAndPassword(email, password);
        
        // Créer le profil dans Firestore
        await db.collection('users').doc(result.user.uid).set({
            displayName: name,
            email: email,
            createdAt: new Date(),
            rewards: 0,
            promoHistory: [],
            tickets: [],
            isActive: true
        });
        
        // Fermer le modal
        hideRegisterModal();
        
        // Redirection avec message de succès
        window.location.href = '/?register=success&name=' + encodeURIComponent(name);
        
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
};

// Déconnexion
window.logout = async () => {
    await auth.signOut();
    sessionStorage.removeItem('currentUser');
    window.location.href = '/';
};

// ===== GESTION DES MODALS =====

window.showLoginModal = () => {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'flex';
};

window.hideLoginModal = () => {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
};

window.showRegisterModal = () => {
    const modal = document.getElementById('registerModal');
    if (modal) modal.style.display = 'flex';
};

window.hideRegisterModal = () => {
    const modal = document.getElementById('registerModal');
    if (modal) modal.style.display = 'none';
};

// Fermer les modals en cliquant à l'extérieur
window.onclick = (event) => {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
};

// ===== NOTIFICATIONS =====

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary, #e67e22);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        z-index: 9999;
        animation: slideIn 0.3s;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Appliquer une promo depuis l'URL (exemple)
async function applyPromoFromUrl(userId, promoCode) {
    // Implémentez la logique d'application de promo
    console.log('Promo à appliquer:', promoCode);
}
