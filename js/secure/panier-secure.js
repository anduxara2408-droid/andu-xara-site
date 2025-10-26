// 🛒 PANIER SÉCURISÉ AVEC SYSTÈME PROMO INTÉGRÉ
class PanierSecurise {
    constructor() {
        this.items = [];
        this.codePromo = null;
        this.reduction = 0;
        this.loadPanier();
        this.initInterface();
    }

    loadPanier() {
        try {
            const saved = localStorage.getItem('anduxara_panier');
            if (saved) {
                const data = JSON.parse(saved);
                this.items = data.items || [];
                this.codePromo = data.codePromo || null;
                this.reduction = data.reduction || 0;
            }
        } catch (error) {
            console.error('❌ Erreur chargement panier:', error);
            this.items = [];
        }
    }

    savePanier() {
        try {
            localStorage.setItem('anduxara_panier', JSON.stringify({
                items: this.items,
                codePromo: this.codePromo,
                reduction: this.reduction
            }));
        } catch (error) {
            console.error('❌ Erreur sauvegarde panier:', error);
        }
    }

    async appliquerCodePromo(code) {
        if (!userManager.isLoggedIn) {
            this.showMessage('🔐 Connectez-vous pour utiliser un code promo', 'error');
            userManager.showAuthModal();
            return false;
        }

        const montantAvantReduction = this.getTotal();
        
        try {
            const validation = await securePromoSystem.validatePromoCode(code, montantAvantReduction);
            
            if (validation.success) {
                this.codePromo = code.toUpperCase();
                this.reduction = validation.reduction;
                
                await securePromoSystem.recordPromoUsage(code, montantAvantReduction, this.reduction);
                
                this.showMessage(validation.message, 'success');
                this.updatePanierDisplay();
                this.savePanier();
                return true;
            } else {
                this.showMessage(validation.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Erreur application code promo:', error);
            this.showMessage('❌ Erreur système', 'error');
            return false;
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.prix * item.quantite), 0);
    }

    getTotalAvecReduction() {
        return Math.max(0, this.getTotal() - this.reduction);
    }

    showMessage(message, type) {
        // Utiliser la fonction globale showMessage
        if (typeof window.showMessage === 'function') {
            window.showMessage(message, type);
        } else {
            alert(message);
        }
    }

    updatePanierDisplay() {
        console.log('🔄 Mise à jour affichage panier');
        console.log('Total:', this.getTotal());
        console.log('Réduction:', this.reduction);
        console.log('Total après réduction:', this.getTotalAvecReduction());
        
        // Mettre à jour l'interface
        this.updatePromoDisplay();
    }

    updatePromoDisplay() {
        const codeActifEl = document.getElementById('code-actif');
        const montantReductionEl = document.getElementById('montant-reduction');
        
        if (codeActifEl) {
            codeActifEl.textContent = this.codePromo || 'Aucun';
            codeActifEl.style.color = this.codePromo ? '#4CAF50' : '#666';
        }
        
        if (montantReductionEl) {
            montantReductionEl.textContent = this.reduction + ' FCFA';
            montantReductionEl.style.color = this.reduction > 0 ? '#4CAF50' : '#666';
        }
    }

    initInterface() {
        console.log('✅ Panier sécurisé initialisé');
    }
}

// 🎯 FONCTIONS GLOBALES POUR L'INTERFACE HTML

// Fonction appelée par le bouton "Appliquer"
function validateAndApplyPromo() {
    const codeInput = document.getElementById('code-promo-input');
    const applyButton = document.getElementById('appliquer-promo-btn');
    
    if (!codeInput || !applyButton) {
        console.error('❌ Éléments HTML manquants');
        alert('Erreur: Éléments manquants dans la page');
        return;
    }
    
    const code = codeInput.value.trim();
    
    if (!code) {
        showMessage('❌ Veuillez entrer un code promo', 'error');
        return;
    }
    
    // Désactiver le bouton pendant la validation
    applyButton.disabled = true;
    applyButton.textContent = 'Validation...';
    
    // Appliquer le code promo
    panierSecurise.appliquerCodePromo(code)
        .then(success => {
            if (success) {
                codeInput.value = ''; // Vider le champ si succès
            }
        })
        .finally(() => {
            // Réactiver le bouton
            applyButton.disabled = false;
            applyButton.textContent = 'Appliquer';
        });
}

// Afficher les messages dans l'interface
function showMessage(message, type) {
    let messageEl = document.getElementById('promo-message');
    
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'promo-message';
        messageEl.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px; 
            border-radius: 8px; z-index: 10000; font-weight: 600;
            max-width: 350px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(messageEl);
        
        // Ajouter les styles d'animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .promo-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .promo-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        `;
        document.head.appendChild(style);
    }
    
    messageEl.textContent = message;
    messageEl.className = `promo-message promo-\${type}`;
    messageEl.style.display = 'block';
    
    // Styles selon le type
    if (type === 'success') {
        messageEl.style.background = '#d4edda';
        messageEl.style.color = '#155724';
        messageEl.style.border = '1px solid #c3e6cb';
    } else {
        messageEl.style.background = '#f8d7da';
        messageEl.style.color = '#721c24';
        messageEl.style.border = '1px solid #f5c6cb';
    }
    
    // Masquer après 5 secondes
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.display = 'none';
        }
    }, 5000);
}

// Initialiser l'interface au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Initialisation interface codes promo...');
    
    // Mettre à jour l'affichage initial
    if (typeof panierSecurise !== 'undefined') {
        panierSecurise.updatePromoDisplay();
    }
    
    // Ajouter l'événement Enter sur le champ de saisie
    const codeInput = document.getElementById('code-promo-input');
    if (codeInput) {
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validateAndApplyPromo();
            }
        });
    }
    
    console.log('✅ Interface codes promo initialisée');
});

// Initialiser le panier sécurisé
const panierSecurise = new PanierSecurise();
