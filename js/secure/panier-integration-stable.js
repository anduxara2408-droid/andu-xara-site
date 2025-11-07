// js/secure/panier-integration-stable.js - VERSION AVEC SYSTÈME DE PARRAINAGE
console.log("🎯 Panier Integration Stable - Chargé (SYSTÈME PARRAINAGE ACTIVÉ)");

class PanierIntegrationStable {
    constructor() {
        console.log("🔧 Panier Integration Stable - Initialisé avec système de parrainage");
        this.init();
    }

    init() {
        this.setupFirebase();
        this.setupPromoIntegration();
        this.observerPanierChanges();
        console.log("✅ Système de parrainage intégré au panier");
    }

    setupFirebase() {
        // Configuration Firebase (identique à reductions.html)
        const firebaseConfig = {
            apiKey: "AIzaSyC-OHtqpgOZI9AIb_WotYbiUS2L-Ac5vII",
            authDomain: "andu-xara-promo-codes-ff69e.firebaseapp.com",
            projectId: "andu-xara-promo-codes-ff69e",
            storageBucket: "andu-xara-promo-codes-ff69e.firebasestorage.app",
            messagingSenderId: "653516716143",
            appId: "1:653516716143:web:08ee1425191b4a1766359a"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    setupPromoIntegration() {
        // Codes promo prédéfinis
        this.CODES_PROMO_VALIDES = {
            'TEST15': { discount: 15, description: 'Code test 15% de réduction' },
            'BIENVENUE10': { discount: 10, description: 'Bienvenue 10% de réduction' },
            'ANDU20': { discount: 20, description: 'Code spécial Andu Xara 20%' },
            'SOLDE25': { discount: 25, description: 'Soldes 25% de réduction' },
            'NEW2024': { discount: 15, description: 'Nouveau client 15%' },
            'FIDELITE': { discount: 10, description: 'Code fidélité 10%' }
        };

        // Vérifier si un code promo est actif au chargement
        this.verifierPromoActif();
        
        // Créer l'interface promo dans le panier
        this.creerInterfacePromo();
    }

    creerInterfacePromo() {
        // Attendre que le panier soit chargé
        setTimeout(() => {
            const panierContainer = document.querySelector('.cart-summary, .cart-totals, .summary, [class*="cart"], [class*="summary"]');
            
            if (panierContainer && !document.getElementById('panierPromoSection')) {
                this.injecterSectionPromo(panierContainer);
            }
        }, 1000);
    }

    injecterSectionPromo(container) {
        const promoHTML = `
            <div id="panierPromoSection" style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h4 style="color: #495057; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-tag" style="color: #6c757d;"></i>
                    Code Promo / Parrainage
                </h4>
                
                <div id="promoPanierContent">
                    <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                        <input type="text" 
                               id="promoCodePanier" 
                               placeholder="Entrez votre code promo" 
                               style="flex: 1; padding: 10px 12px; border: 2px solid #ced4da; border-radius: 6px; font-size: 14px;">
                        <button id="appliquerPromoPanier" 
                                style="background: #28a745; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-check"></i> Appliquer
                        </button>
                    </div>
                    
                    <div id="promoPanierMessage" style="font-size: 13px; font-weight: 500;"></div>
                    
                    <div id="promoActiveDisplay" style="display: none; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 10px; margin-top: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #155724;">🎉 Réduction active :</strong>
                                <span id="promoActiveDetails" style="margin-left: 8px;"></span>
                            </div>
                            <button id="supprimerPromo" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                <i class="fas fa-times"></i> Supprimer
                            </button>
                        </div>
                    </div>
                    
                    <div style="margin-top: 8px; font-size: 12px; color: #6c757d;">
                        <i class="fas fa-info-circle"></i>
                        Codes disponibles : TEST15, BIENVENUE10, ANDU20, SOLDE25
                    </div>
                </div>
            </div>
        `;

        // Insérer au début du container du panier
        container.insertAdjacentHTML('afterbegin', promoHTML);
        
        // Ajouter les événements
        this.ajouterEvenementsPromo();
        
        console.log("✅ Interface promo injectée dans le panier");
    }

    ajouterEvenementsPromo() {
        const promoBtn = document.getElementById('appliquerPromoPanier');
        const promoInput = document.getElementById('promoCodePanier');
        const supprimerBtn = document.getElementById('supprimerPromo');

        if (promoBtn) {
            promoBtn.addEventListener('click', () => this.appliquerPromoPanier());
        }

        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.appliquerPromoPanier();
                }
            });
        }

        if (supprimerBtn) {
            supprimerBtn.addEventListener('click', () => this.supprimerPromo());
        }
    }

    async appliquerPromoPanier() {
        const codeInput = document.getElementById('promoCodePanier');
        const messageDiv = document.getElementById('promoPanierMessage');
        const promoBtn = document.getElementById('appliquerPromoPanier');
        
        if (!codeInput || !messageDiv) return;

        const code = codeInput.value.trim().toUpperCase();
        
        if (!code) {
            messageDiv.innerHTML = '<span style="color: #dc3545;">❌ Veuillez entrer un code promo</span>';
            return;
        }

        try {
            // Désactiver le bouton pendant le traitement
            if (promoBtn) {
                promoBtn.disabled = true;
                promoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }

            // Vérifier si un code a déjà été utilisé
            const promoUtilise = localStorage.getItem('anduxara_promo_utilise');
            if (promoUtilise === 'true') {
                messageDiv.innerHTML = '<span style="color: #dc3545;">❌ Vous avez déjà utilisé un code promo</span>';
                this.afficherSectionReinitialisation();
                return;
            }

            // Vérifier le code promo
            let codeValide = false;
            let promoData = null;

            // Vérifier d'abord dans Firebase
            try {
                const promoQuery = await firebase.firestore()
                    .collection('promoCodes')
                    .where('code', '==', code)
                    .where('isActive', '==', true)
                    .get();

                if (!promoQuery.empty) {
                    const promoDoc = promoQuery.docs[0];
                    promoData = promoDoc.data();
                    
                    // Vérifier la date d'expiration
                    if (promoData.expiration && new Date(promoData.expiration) < new Date()) {
                        throw new Error('Code expiré');
                    }

                    // Vérifier les limites d'utilisation
                    if (promoData.usedCount >= promoData.maxUses) {
                        throw new Error('Code épuisé');
                    }

                    codeValide = true;
                }
            } catch (firebaseError) {
                console.log('Firebase non disponible, utilisation des codes locaux');
            }

            // Si Firebase échoue ou code non trouvé, utiliser les codes locaux
            if (!codeValide) {
                if (this.CODES_PROMO_VALIDES[code]) {
                    promoData = this.CODES_PROMO_VALIDES[code];
                    codeValide = true;
                }
            }

            if (codeValide && promoData) {
                // Enregistrer l'utilisation
                await this.enregistrerUtilisationPromo(code, promoData);
                
                // Afficher le succès
                messageDiv.innerHTML = `<span style="color: #28a745;">
                    ✅ Code "${code}" appliqué ! ${promoData.discount}% de réduction
                </span>`;
                
                // Désactiver les champs
                codeInput.disabled = true;
                if (promoBtn) {
                    promoBtn.disabled = true;
                    promoBtn.innerHTML = '<i class="fas fa-check"></i> Appliqué';
                }
                
                // Afficher la section promo active
                this.afficherPromoActive(code, promoData);
                
                // Mettre à jour le panier
                this.mettreAJourPanierAvecPromo(promoData.discount);
                
                this.showNotification(`🎉 Code ${code} appliqué ! ${promoData.discount}% de réduction`, 'success');
                
            } else {
                messageDiv.innerHTML = '<span style="color: #dc3545;">❌ Code promo invalide ou expiré</span>';
                if (promoBtn) {
                    promoBtn.disabled = false;
                    promoBtn.innerHTML = '<i class="fas fa-check"></i> Appliquer';
                }
            }

        } catch (error) {
            console.error('Erreur application code promo:', error);
            messageDiv.innerHTML = '<span style="color: #dc3545;">❌ Erreur lors de l\'application du code</span>';
            if (promoBtn) {
                promoBtn.disabled = false;
                promoBtn.innerHTML = '<i class="fas fa-check"></i> Appliquer';
            }
        }
    }

    async enregistrerUtilisationPromo(code, promoData) {
        const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'anonymous';
        const userEmail = firebase.auth().currentUser ? firebase.auth().currentUser.email : 'anonymous@anduxara.com';
        
        try {
            // Essayer d'enregistrer dans Firebase si l'utilisateur est connecté
            if (firebase.auth().currentUser) {
                await firebase.firestore().collection('promoUsage').add({
                    userId: userId,
                    userEmail: userEmail,
                    promoCode: code,
                    discount: promoData.discount,
                    usedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'applied',
                    source: 'panier'
                });

                // Mettre à jour le compteur si c'est un code Firebase
                const promoQuery = await firebase.firestore()
                    .collection('promoCodes')
                    .where('code', '==', code)
                    .get();

                if (!promoQuery.empty) {
                    const promoId = promoQuery.docs[0].id;
                    await firebase.firestore().collection('promoCodes').doc(promoId).update({
                        usedCount: firebase.firestore.FieldValue.increment(1),
                        lastUsed: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
        } catch (error) {
            console.log('Enregistrement Firebase échoué, utilisation du stockage local');
        }

        // SAUVEGARDER DANS LE SYSTÈME UNIFIÉ
        const promoInfo = {
            code: code,
            discount: promoData.discount,
            description: promoData.description,
            appliedAt: new Date().toISOString(),
            userId: userId,
            source: 'panier'
        };

        // Sauvegarder dans localStorage
        localStorage.setItem('anduxara_active_promo', JSON.stringify(promoInfo));
        localStorage.setItem('anduxara_promo_utilise', 'true');
        localStorage.setItem('anduxara_cart_promo', JSON.stringify({
            code: code,
            discount: promoData.discount,
            applied: true,
            timestamp: new Date().getTime()
        }));

        console.log('💾 Code promo sauvegardé depuis le panier:', promoInfo);
    }

    afficherPromoActive(code, promoData) {
        const activeSection = document.getElementById('promoActiveDisplay');
        const activeDetails = document.getElementById('promoActiveDetails');
        
        if (activeSection && activeDetails) {
            activeDetails.textContent = `${code} - ${promoData.discount}% de réduction`;
            activeSection.style.display = 'block';
        }
    }

    afficherSectionReinitialisation() {
        // Option pour réinitialiser les codes
        const messageDiv = document.getElementById('promoPanierMessage');
        if (messageDiv) {
            messageDiv.innerHTML += `
                <div style="margin-top: 8px;">
                    <button onclick="panierIntegrationStable.reinitialiserCodesPromo()" 
                            style="background: #ffc107; color: #856404; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-redo"></i> Réinitialiser les codes
                    </button>
                </div>
            `;
        }
    }

    supprimerPromo() {
        this.reinitialiserCodesPromo();
        this.mettreAJourPanierSansPromo();
    }

    reinitialiserCodesPromo() {
        console.log('🔄 Réinitialisation des codes promo depuis le panier...');
        
        // Supprimer tous les flags d'utilisation
        localStorage.removeItem('anduxara_promo_utilise');
        localStorage.removeItem('anduxara_active_promo');
        localStorage.removeItem('anduxara_cart_promo');
        
        // Réactiver les champs
        const codeInput = document.getElementById('promoCodePanier');
        const promoBtn = document.getElementById('appliquerPromoPanier');
        const messageDiv = document.getElementById('promoPanierMessage');
        const activeSection = document.getElementById('promoActiveDisplay');
        
        if (codeInput) {
            codeInput.disabled = false;
            codeInput.value = '';
            codeInput.placeholder = 'Entrez votre code promo';
        }
        
        if (promoBtn) {
            promoBtn.disabled = false;
            promoBtn.innerHTML = '<i class="fas fa-check"></i> Appliquer';
        }
        
        if (messageDiv) {
            messageDiv.innerHTML = '';
        }
        
        if (activeSection) {
            activeSection.style.display = 'none';
        }
        
        this.mettreAJourPanierSansPromo();
        this.showNotification('🔄 Codes promo réinitialisés !', 'success');
    }

    verifierPromoActif() {
        const promoUtilise = localStorage.getItem('anduxara_promo_utilise');
        const promoData = localStorage.getItem('anduxara_active_promo');
        
        if (promoUtilise === 'true' && promoData) {
            try {
                const promo = JSON.parse(promoData);
                console.log(`✅ Code promo actif détecté: ${promo.code} - ${promo.discount}%`);
                
                // Mettre à jour l'interface si elle existe
                setTimeout(() => {
                    this.afficherPromoActive(promo.code, promo);
                    this.mettreAJourPanierAvecPromo(promo.discount);
                }, 1000);
                
            } catch (error) {
                console.error('Erreur lecture promo actif:', error);
            }
        }
    }

    mettreAJourPanierAvecPromo(discount) {
        console.log(`🔄 Application réduction ${discount}% au panier`);
        
        // Cette fonction doit s'intégrer avec votre logique de panier existante
        // Vous devrez peut-être l'adapter selon votre structure HTML
        
        setTimeout(() => {
            // Exemple d'intégration avec un panier typique
            const totalElement = document.querySelector('[class*="total"], [class*="prix"], [class*="amount"]');
            const reductionElement = document.querySelector('[class*="reduction"], [class*="discount"], [class*="promo"]');
            
            if (totalElement) {
                const currentTotal = this.extractPrice(totalElement.textContent);
                if (currentTotal) {
                    const reduction = (currentTotal * discount) / 100;
                    const nouveauTotal = currentTotal - reduction;
                    
                    // Afficher la réduction
                    if (reductionElement) {
                        reductionElement.textContent = `-${reduction.toFixed(2)}€ (${discount}%)`;
                    }
                    
                    // Mettre à jour le total
                    totalElement.textContent = this.formatPrice(nouveauTotal);
                    
                    // Sauvegarder la réduction pour la commande
                    localStorage.setItem('anduxara_current_discount', discount.toString());
                }
            }
        }, 500);
    }

    mettreAJourPanierSansPromo() {
        console.log('🔄 Suppression réduction du panier');
        
        // Réinitialiser les totaux
        const reductionElement = document.querySelector('[class*="reduction"], [class*="discount"], [class*="promo"]');
        if (reductionElement) {
            reductionElement.textContent = '0,00€';
        }
        
        localStorage.removeItem('anduxara_current_discount');
        
        // Recalculer le panier sans réduction
        // Cette partie dépend de votre logique de panier existante
    }

    extractPrice(priceText) {
        // Extraire le prix du texte
        const match = priceText.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(match) || 0;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
    }

    observerPanierChanges() {
        // Observer les changements dans le panier pour réappliquer les réductions
        const observer = new MutationObserver(() => {
            this.verifierPromoActif();
        });

        const panierContainer = document.querySelector('.cart-summary, .cart-totals, .summary');
        if (panierContainer) {
            observer.observe(panierContainer, { childList: true, subtree: true });
        }
    }

    showNotification(message, type = 'success') {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px;
            text-align: center;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialisation
setTimeout(() => {
    window.panierIntegrationStable = new PanierIntegrationStable();
}, 1000);

// Exposer les fonctions globalement
window.reinitialiserCodesPromo = () => {
    if (window.panierIntegrationStable) {
        window.panierIntegrationStable.reinitialiserCodesPromo();
    }
};

console.log("🎯 Système de parrainage intégré - Prêt à l'emploi");
