#!/bin/bash
echo "Création de panier-secure.js..."

cat > js/secure/panier-secure.js << 'PANIER_EOF'
// 🛒 PANIER SÉCURISÉ AVEC SYSTÈME PROMO INTÉGRÉ
class PanierSecurise {
    constructor() {
        this.items = [];
        this.codePromo = null;
        this.reduction = 0;
        this.loadPanier();
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
            alert('🔐 Connectez-vous pour utiliser un code promo');
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
                
                alert(validation.message);
                this.updatePanierDisplay();
                this.savePanier();
                return true;
            } else {
                alert(validation.message);
                return false;
            }
        } catch (error) {
            console.error('Erreur application code promo:', error);
            alert('❌ Erreur système');
            return false;
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.prix * item.quantite), 0);
    }

    getTotalAvecReduction() {
        return Math.max(0, this.getTotal() - this.reduction);
    }

    updatePanierDisplay() {
        console.log('🔄 Mise à jour affichage panier');
        console.log('Total:', this.getTotal());
        console.log('Réduction:', this.reduction);
        console.log('Total après réduction:', this.getTotalAvecReduction());
    }
}

const panierSecurise = new PanierSecurise();
PANIER_EOF

echo "✅ panier-secure.js créé avec succès"
