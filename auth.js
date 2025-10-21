// auth.js - Gestionnaire d'authentification
class AuthManager {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        firebase.auth().onAuthStateChanged((user) => {
            this.user = user;
            this.onAuthStateChanged(user);
        });
    }

    async signIn(email, password) {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            await this.updateLastLogin(userCredential.user.uid);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    async signOut() {
        try {
            await firebase.auth().signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    async updateLastLogin(uid) {
        try {
            await db.collection('users').doc(uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Erreur mise à jour lastLogin:', error);
        }
    }

    async isAdmin() {
        if (!this.user) return false;
        
        try {
            const userDoc = await db.collection('users').doc(this.user.uid).get();
            return userDoc.exists && userDoc.data().role === 'admin';
        } catch (error) {
            console.error('Erreur vérification admin:', error);
            return false;
        }
    }

    onAuthStateChanged(user) {
        if (user) {
            console.log('Utilisateur connecté:', user.email);
        } else {
            console.log('Utilisateur déconnecté');
        }
    }

    getErrorMessage(error) {
        const errorMessages = {
            'auth/invalid-email': 'Adresse email invalide',
            'auth/user-disabled': 'Ce compte a été désactivé',
            'auth/user-not-found': 'Aucun compte trouvé avec cet email',
            'auth/wrong-password': 'Mot de passe incorrect',
            'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
            'auth/weak-password': 'Le mot de passe est trop faible',
            'auth/network-request-failed': 'Erreur réseau. Veuillez réessayer.',
            'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.'
        };

        return errorMessages[error.code] || error.message;
    }
}

// Initialisation globale
let authManager;

// Attendre que Firebase soit chargé
if (typeof firebase !== 'undefined') {
    authManager = new AuthManager();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        authManager = new AuthManager();
    });
}


// 📁 auth.js - FONCTIONS MANQUANTES POUR reductions.html

// ===== FONCTIONS POUR LES MODALS =====

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        // Focus sur le premier champ
        setTimeout(() => {
            const emailInput = document.getElementById('loginEmail');
            if (emailInput) emailInput.focus();
        }, 100);
    }
}

function showSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'flex';
        // Focus sur le premier champ
        setTimeout(() => {
            const nameInput = document.getElementById('signupName');
            if (nameInput) nameInput.focus();
        }, 100);
    }
}

function showResetPassword() {
    closeModal('loginModal');
    const modal = document.getElementById('resetPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            const emailInput = document.getElementById('resetEmail');
            if (emailInput) emailInput.focus();
        }, 100);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== GESTION DES FORMULAIRES =====

// Initialiser les événements des formulaires
document.addEventListener('DOMContentLoaded', function() {
    // Formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await authManager.signIn(email, password);
            if (!result.success) {
                showMessage('Erreur: ' + result.error, 'error');
            }
        });
    }

    // Formulaire d'inscription
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const name = document.getElementById('signupName').value;
            
            const result = await authManager.signUp(email, password, name);
            if (!result.success) {
                showMessage('Erreur: ' + result.error, 'error');
            }
        });
    }

    // Formulaire de réinitialisation
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value;
            
            const result = await authManager.resetPassword(email);
            if (!result.success) {
                showMessage('Erreur: ' + result.error, 'error');
            }
        });
    }

    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Permettre la fermeture avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
        }
    });
});

// ===== FONCTIONS D'AFFICHAGE DES MESSAGES =====

function showMessage(text, type = 'success') {
    // Créer un élément de message temporaire
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#48bb78';
    } else if (type === 'error') {
        messageDiv.style.background = '#e53e3e';
    } else if (type === 'warning') {
        messageDiv.style.background = '#ed8936';
    }
    
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${text}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }
    }, 5000);
}

// ===== FONCTIONS ADMIN =====

function showAdminDashboard() {
    window.open('admin-dashboard.html', '_blank');
}

function showAnalytics() {
    // Ouvrir le dashboard sur la section analytics
    if (window.adminWindow && !window.adminWindow.closed) {
        window.adminWindow.showSection('analytics');
    } else {
        window.open('admin-dashboard.html#analytics', '_blank');
    }
}

function showCodeManager() {
    // Ouvrir le dashboard sur la section codes
    if (window.adminWindow && !window.adminWindow.closed) {
        window.adminWindow.showSection('codes');
        if (window.adminWindow.showCreateCodeModal) {
            window.adminWindow.showCreateCodeModal();
        }
    } else {
        window.open('admin-dashboard.html#codes', '_blank');
    }
}

function showUserHistory() {
    showMessage('Fonctionnalité historique utilisateur - À implémenter', 'warning');
}

// ===== ANIMATIONS CSS =====

// Ajouter les styles d'animation s'ils n'existent pas
if (!document.querySelector('#auth-animations')) {
    const style = document.createElement('style');
    style.id = 'auth-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        
        .modal {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ auth.js - Fonctions modals chargées avec succès');
