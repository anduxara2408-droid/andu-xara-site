// ===== MODULE PANIER UNIFIÉ - ANDU XARA =====
// Ce module centralise la gestion du panier et codes promo pour toutes les pages

class PanierUnifie {
    constructor() {
        this.panier = this.chargerPanier();
        this.codePromoActif = this.chargerCodePromo();
        this.reductionActive = null;
        this.initSynchronisation();
        console.log('🔄 Module panier unifié initialisé');
    }

    // ===== GESTION PANIER =====
    chargerPanier() {
        return JSON.parse(localStorage.getItem('anduxara_cart')) || [];
    }

    sauvegarderPanier() {
        localStorage.setItem('anduxara_cart', JSON.stringify(this.panier));
        this.dispatchStorageEvent();
    }

    ajouterProduit(nom, categorie, prix, quantite = 1) {
        const produitExistant = this.panier.find(item => item.name === nom);

        if (produitExistant) {
            if (produitExistant.quantity < 20) {
                produitExistant.quantity += quantite;
            } else {
                this.afficherNotification('❌ Maximum 20 produits par article atteint !', 'error');
                return false;
            }
        } else {
            this.panier.push({
                name: nom,
                price: prix,
                promoPrice: prix,
                quantity: quantite,
                category: categorie,
                addedAt: new Date().toISOString()
            });
        }

        this.sauvegarderPanier();
        this.afficherNotification(`✅ ${nom} ajouté au panier !`);
        this.mettreAJourAffichagePanier();
        return true;
    }

    retirerProduit(index) {
        if (index >= 0 && index < this.panier.length) {
            const produit = this.panier[index];
            this.panier.splice(index, 1);
            this.sauvegarderPanier();
            this.afficherNotification(`🗑️ ${produit.name} retiré du panier`);
            this.mettreAJourAffichagePanier();
        }
    }

    viderPanier() {
        this.panier = [];
        this.sauvegarderPanier();
        this.mettreAJourAffichagePanier();
    }

    // ===== GESTION CODES PROMO =====
    chargerCodePromo() {
        const saved = localStorage.getItem('anduxara_active_promo');
        return saved ? JSON.parse(saved) : null;
    }

    async appliquerCodePromo(code) {
        const codeUpper = code.trim().toUpperCase();
        
        // Validation du code
        const validation = await this.validerCodePromo(codeUpper);
        
        if (validation.valide) {
            this.codePromoActif = {
                code: codeUpper,
                reduction: validation.reduction,
                appliqueLe: new Date().toISOString()
            };
            
            // Appliquer la réduction aux produits du panier
            this.panier.forEach(item => {
                item.promoPrice = Math.round(item.price * (1 - validation.reduction / 100));
            });
            
            localStorage.setItem('anduxara_active_promo', JSON.stringify(this.codePromoActif));
            this.sauvegarderPanier();
            this.dispatchStorageEvent();
            
            this.afficherNotification(`✅ Code "${codeUpper}" appliqué : ${validation.reduction}% de réduction !`);
            return true;
        } else {
            this.afficherNotification(`❌ Code "${codeUpper}" invalide ou expiré`, 'error');
            return false;
        }
    }

    retirerCodePromo() {
        // Rétablir les prix originaux
        this.panier.forEach(item => {
            item.promoPrice = item.price;
        });
        
        this.codePromoActif = null;
        localStorage.removeItem('anduxara_active_promo');
        this.sauvegarderPanier();
        this.dispatchStorageEvent();
        
        this.afficherNotification('🗑️ Code promo retiré');
    }

    async validerCodePromo(code) {
        // Simulation - À REMPLACER par votre logique Firebase
        const codesValides = {
            'BIENVENUE15': 15,
            'ANDU2025': 20,
            'SOLDE30': 30,
            'PREMIUM25': 25,
            'TEST10': 10
        };

        await new Promise(resolve => setTimeout(resolve, 800));

        if (codesValides[code]) {
            return {
                valide: true,
                reduction: codesValides[code],
                message: `Réduction de ${codesValides[code]}% appliquée`
            };
        }

        return {
            valide: false,
            message: 'Code invalide'
        };
    }

    // ===== CALCULS =====
    calculerTotal() {
        const sousTotal = this.panier.reduce((total, item) => {
            return total + (item.promoPrice * item.quantity);
        }, 0);

        const reduction = this.codePromoActif 
            ? sousTotal * (this.codePromoActif.reduction / 100)
            : 0;

        return {
            sousTotal: sousTotal,
            reduction: reduction,
            total: sousTotal - reduction,
            nombreArticles: this.panier.reduce((sum, item) => sum + item.quantity, 0)
        };
    }

    // ===== SYNCHRONISATION =====
    initSynchronisation() {
        // Écouter les changements depuis d'autres pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'anduxara_cart') {
                this.panier = JSON.parse(e.newValue) || [];
                this.mettreAJourAffichagePanier();
            }
            if (e.key === 'anduxara_active_promo') {
                this.codePromoActif = e.newValue ? JSON.parse(e.newValue) : null;
                this.mettreAJourAffichagePanier();
            }
        });
    }

    dispatchStorageEvent() {
        // Déclencher des événements pour synchroniser les autres pages
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'anduxara_cart',
            newValue: JSON.stringify(this.panier)
        }));
    }

    // ===== AFFICHAGE =====
    mettreAJourAffichagePanier() {
        // Mettre à jour le panier flottant
        this.mettreAJourPanierFlottant();
        
        // Mettre à jour les badges
        this.mettreAJourBadges();
        
        // Mettre à jour l'affichage des codes promo
        this.mettreAJourAffichagePromo();
    }

    mettreAJourPanierFlottant() {
        const badge = document.getElementById('cart-badge-floating');
        const itemsContainer = document.getElementById('cart-items-floating');
        const totalElement = document.getElementById('cart-total-floating');

        if (badge) {
            const totalItems = this.panier.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
        }

        if (itemsContainer && totalElement) {
            const totals = this.calculerTotal();
            
            if (this.panier.length === 0) {
                itemsContainer.innerHTML = '<div class="empty-cart-floating">Panier vide</div>';
            } else {
                itemsContainer.innerHTML = this.panier.map((item, index) => `
                    <div class="cart-item-floating">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>Quantité: ${item.quantity}</p>
                            ${this.codePromoActif ? `<p style="color: #27ae60; font-size: 0.7rem;">🎯 Promo: -${this.codePromoActif.reduction}%</p>` : ''}
                            <button class="remove-item" onclick="panierUnifie.retirerProduit(${index})">Retirer</button>
                        </div>
                        <div class="cart-item-price">
                            ${this.codePromoActif ? `
                                <div style="text-decoration: line-through; color: #888; font-size: 0.7rem;">
                                    ${(item.price * item.quantity).toFixed(0)} MRU
                                </div>
                            ` : ''}
                            <div style="color: #e60023; font-weight: bold;">
                                ${(item.promoPrice * item.quantity).toFixed(0)} MRU
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            let totalHTML = '';
            if (this.codePromoActif && this.panier.length > 0) {
                totalHTML = `
                    <div style="background: #e8f5e8; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                        <div style="font-size: 0.8rem; color: #27ae60; font-weight: bold; margin-bottom: 5px;">
                            🎉 Code "${this.codePromoActif.code}" actif (-${this.codePromoActif.reduction}%)
                        </div>
                        <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">
                            Sous-total: ${totals.sousTotal.toFixed(0)} MRU
                        </div>
                        <div style="font-size: 0.8rem; color: #27ae60; margin-bottom: 3px;">
                            Réduction: -${totals.reduction.toFixed(0)} MRU
                        </div>
                    </div>
                    <div class="cart-total-floating" style="font-size: 1.1rem; color: #2c3e50;">
                        Total: ${totals.total.toFixed(0)} MRU
                    </div>
                `;
            } else {
                totalHTML = `
                    <div class="cart-total-floating" style="font-size: 1.1rem; color: #2c3e50;">
                        Total: ${totals.total.toFixed(0)} MRU
                    </div>
                `;
            }
            
            totalElement.innerHTML = totalHTML;
        }
    }

    mettreAJourBadges() {
        const totalItems = this.panier.reduce((sum, item) => sum + item.quantity, 0);
        
        // Mettre à jour tous les badges de panier
        document.querySelectorAll('#cart-badge-floating, .cart-counter').forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    mettreAJourAffichagePromo() {
        const activePromoDisplay = document.getElementById('active-promo-display');
        const activePromoCodeElement = document.getElementById('active-promo-code');
        const currentPromoDisplay = document.getElementById('currentPromoDisplay');
        const appliedCodeSpan = document.getElementById('appliedCode');
        const appliedDiscountSpan = document.getElementById('appliedDiscount');

        if (this.codePromoActif) {
            // Pour index.html
            if (activePromoDisplay && activePromoCodeElement) {
                activePromoDisplay.style.display = 'block';
                activePromoCodeElement.textContent = `${this.codePromoActif.code} (-${this.codePromoActif.reduction}%)`;
            }
            
            // Pour reductions.html
            if (currentPromoDisplay && appliedCodeSpan && appliedDiscountSpan) {
                currentPromoDisplay.style.display = 'block';
                appliedCodeSpan.textContent = this.codePromoActif.code;
                appliedDiscountSpan.textContent = `Réduction: ${this.codePromoActif.reduction}%`;
            }
        } else {
            if (activePromoDisplay) activePromoDisplay.style.display = 'none';
            if (currentPromoDisplay) currentPromoDisplay.style.display = 'none';
        }
    }

    // ===== NOTIFICATIONS =====
    afficherNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4757' : '#25D366'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 350px;
        `;
        notification.innerHTML = `
            <span>${type === 'error' ? '❌' : '✅'}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ===== PAIEMENT =====
    processerPaiement() {
        if (this.panier.length === 0) {
            this.afficherNotification('Panier vide !', 'error');
            return;
        }
        
        const totals = this.calculerTotal();
        const totalMRU = totals.total;
        const totalFCFA = Math.round(totalMRU * 2.5);
        
        const productList = this.panier.map(item => 
            `${item.name} (x${item.quantity}) - ${item.promoPrice * item.quantity} MRU`
        ).join('\n');
        
        const message = `Bonjour ! Je souhaite commander :\n\n${productList}\n\n💰 Total : ${totalMRU} MRU`;
        
        // Menu de paiement (identique à l'ancien système)
        const paymentChoice = prompt(
            `💳 CHOISISSEZ VOTRE MÉTHODE DE PAIEMENT\n\n` +
            `💰 Montant : ${totalMRU} MRU (${totalFCFA} FCFA)\n\n` +
            `Tapez 1, 2 ou 3 :\n\n` +
            `1️⃣ → Wave Sénégal (${totalFCFA} FCFA)\n` +
            `2️⃣ → Bankily Mauritanie (${totalMRU} MRU)\n` +
            `3️⃣ → WhatsApp (Discuter)\n\n` +
            `Votre choix (1/2/3) :`
        );

        if (paymentChoice === '1') {
            this.processerPaiementWave(totalFCFA, totalMRU, message);
        } else if (paymentChoice === '2') {
            this.processerPaiementBankily(totalMRU, message);
        } else if (paymentChoice === '3') {
            this.processerPaiementWhatsApp(message);
        } else {
            this.afficherNotification('Choix annulé', 'warning');
        }
    }

    processerPaiementWave(totalFCFA, totalMRU, message) {
        // Logique Wave identique à l'ancien système
        if (confirm(`🌊 WAVE SÉNÉGAL\n\n💸 Montant : ${totalFCFA} FCFA\n📱 Votre Wave : +221 76 282 11 33\n\n⚠️ L'application Wave va s'ouvrir automatiquement...\n\n✅ OK → Ouvrir Wave maintenant`)) {
            const waveDeepLink = `wave://send?phone=762821133&amount=${totalFCFA}&message=Commande Andu-Xara`;
            window.location.href = waveDeepLink;
            
            setTimeout(() => {
                if (confirm("Wave ne s'est pas ouvert ?\n\nSouhaitez-vous :\n✅ Installer Wave (Play Store)\n❌ Voir les instructions manuelles")) {
                    window.open('https://play.google.com/store/apps/details?id=com.wave.money', '_blank');
                } else {
                    this.afficherInstructionsWaveManuelles(totalFCFA, totalMRU, message);
                }
            }, 2000);
        }
    }

    processerPaiementBankily(totalMRU, message) {
        // Logique Bankily identique
        if (confirm(`🏦 BANKILY MAURITANIE\n\n💸 Montant : ${totalMRU} MRU\n📱 Votre Bankily : +222 49 03 76 97\n\n⚠️ L'application Bankily va s'ouvrir...\n\n✅ OK → Ouvrir Bankily maintenant`)) {
            const bankilyDeepLink = `bankily://transfer?phone=49037697&amount=${totalMRU}`;
            window.location.href = bankilyDeepLink;
            
            setTimeout(() => {
                this.afficherInstructionsBankilyManuelles(totalMRU, message);
            }, 2000);
        }
    }

    processerPaiementWhatsApp(message) {
        if (confirm(`💬 WHATSAPP\n\n📱 Nous allons ouvrir WhatsApp pour discuter de votre commande...\n\n✅ OK → Ouvrir WhatsApp maintenant`)) {
            const whatsappMessage = `Bonjour Andu-Xara ! 👋\n\nJe souhaite commander :\n\n${message}\n\nPouvez-vous m'aider pour la suite ?`;
            window.open(`https://wa.me/22249037697?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
            this.afficherNotification('✅ WhatsApp ouvert ! Notre équipe vous contactera.', 'success');
        }
    }

    afficherInstructionsWaveManuelles(totalFCFA, totalMRU, message) {
        const instructions = 
            `📋 INSTRUCTIONS WAVE MANUELLES :\n\n` +
            `1. 📱 OUVREZ WAVE sur votre téléphone\n` +
            `2. 👆 TAPPEZ sur "Envoyer de l'argent"\n` +
            `3. 🔢 ENTRER le numéro : 762821133\n` +
            `4. 💰 MONTANT : ${totalFCFA} FCFA\n` +
            `5. 📝 MESSAGE : "Commande Andu-Xara"\n` +
            `6. ✅ CONFIRMER le transfert\n\n` +
            `⚠️ VÉRIFIEZ BIEN :\n` +
            `• Numéro : 76 282 11 33\n` +
            `• Montant : ${totalFCFA} FCFA`;
        
        if (confirm(instructions + `\n\n✅ OK → J'ai payé\n❌ Annuler → Support WhatsApp`)) {
            this.finaliserCommande(totalMRU, message);
        } else {
            const assistanceMessage = `🆘 J'ai besoin d'aide pour le paiement Wave\n\nMontant : ${totalFCFA} FCFA\n\nDétails de ma commande :\n${message}`;
            window.open(`https://wa.me/221762821133?text=${encodeURIComponent(assistanceMessage)}`, '_blank');
        }
    }

    afficherInstructionsBankilyManuelles(totalMRU, message) {
        const instructions = 
            `📋 INSTRUCTIONS BANKILY MANUELLES :\n\n` +
            `1. 📱 OUVREZ BANKILY sur votre téléphone\n` +
            `2. 👆 TAPPEZ sur "Transférer"\n` +
            `3. 🔢 ENTRER le numéro : 49037697\n` +
            `4. 💰 MONTANT : ${totalMRU} MRU\n` +
            `5. 📝 MESSAGE : "Commande Andu-Xara"\n` +
            `6. ✅ CONFIRMER la transaction\n\n` +
            `⚠️ VÉRIFIEZ BIEN :\n` +
            `• Numéro : 49 03 76 97\n` +
            `• Montant : ${totalMRU} MRU`;
        
        if (confirm(instructions + `\n\n✅ OK → J'ai payé\n❌ Annuler → Support WhatsApp`)) {
            this.finaliserCommande(totalMRU, message);
        } else {
            const assistanceMessage = `🆘 J'ai besoin d'aide pour le paiement Bankily\n\nMontant : ${totalMRU} MRU\n\nDétails de ma commande :\n${message}`;
            window.open(`https://wa.me/22249037697?text=${encodeURIComponent(assistanceMessage)}`, '_blank');
        }
    }

    finaliserCommande(totalMRU, message) {
        this.afficherNotification('✅ Commande finalisée ! Nous vous contacterons pour la livraison.', 'success');
        // Ici vous pouvez ajouter l'intégration avec votre système de fidélité
        this.viderPanier();
    }
}

// ===== INITIALISATION GLOBALE =====
let panierUnifie;

document.addEventListener('DOMContentLoaded', function() {
    panierUnifie = new PanierUnifie();
    console.log('🚀 Panier unifié initialisé avec succès !');
});

// ===== FONCTIONS GLOBALES POUR HTML =====
function ajouterAuPanier(nom, categorie, prix) {
    if (panierUnifie) {
        panierUnifie.ajouterProduit(nom, categorie, prix);
    }
}

function appliquerCodePromo(code) {
    if (panierUnifie) {
        return panierUnifie.appliquerCodePromo(code);
    }
    return false;
}

function retirerCodePromo() {
    if (panierUnifie) {
        panierUnifie.retirerCodePromo();
    }
}

function togglePanierFlottant() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.toggle('open');
        if (cart.classList.contains('open') && panierUnifie) {
            panierUnifie.mettreAJourAffichagePanier();
        }
    }
}

function fermerPanierFlottant() {
    const cart = document.getElementById('floating-cart');
    if (cart) {
        cart.classList.remove('open');
    }
}

function processerPaiement() {
    if (panierUnifie) {
        panierUnifie.processerPaiement();
    }
}
