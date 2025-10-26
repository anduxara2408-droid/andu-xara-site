// js/secure/panier-integration-stable.js
class PanierIntegrationStable {
    constructor() {
        this.credits = 0;
        this.isApplying = false;
        this.init();
    }

    init() {
        console.log("🎯 Panier Integration Stable - Démarrage");
        
        // Initialisation simple
        this.loadCredits();
        
        // Écouter les crédits - SEULEMENT quand ils changent vraiment
        window.addEventListener('referralCreditsUpdated', (e) => {
            if (e.detail.credits !== this.credits) {
                this.credits = e.detail.credits;
                this.safeApplyDiscount();
            }
        });

        // Configurer l'écouteur d'ouverture panier
        this.setupCartOpenListener();

        // Appliquer une seule fois après chargement
        setTimeout(() => {
            this.safeApplyDiscount();
        }, 3000);

        console.log("🎯 Panier Integration Stable - Prêt");
    }

    setupCartOpenListener() {
        console.log("👂 Configuration écouteur ouverture panier");
        
        // Écouter l'ouverture du panier flottant
        const originalToggle = window.toggleFloatingCart;
        if (typeof originalToggle === 'function') {
            window.toggleFloatingCart = function() {
                const result = originalToggle.apply(this, arguments);
                
                // Vérifier si le panier est maintenant ouvert
                setTimeout(() => {
                    const cart = document.querySelector('.cart-total-floating');
                    if (cart && cart.style.display !== 'none') {
                        console.log("🎯 Panier ouvert détecté - application réduction");
                        this.safeApplyDiscount();
                    }
                }, 500);
                
                return result;
            }.bind(this);
            
            console.log("✅ Écouteur panier configuré");
        } else {
            console.log("❌ toggleFloatingCart non trouvé");
        }
    }

    loadCredits() {
        const stored = localStorage.getItem('anduxara_referral_credits');
        this.credits = stored ? parseInt(stored) : 0;
        console.log("💰 Crédits chargés:", this.credits, "MRU");
    }

    safeApplyDiscount() {
        if (this.isApplying) return;
        this.isApplying = true;
        
        console.log("🔄 Application sécurisée de la réduction");
        
        setTimeout(() => {
            try {
                this.applyDiscountToCart();
            } catch (error) {
                console.warn("⚠️ Erreur application réduction:", error);
            } finally {
                this.isApplying = false;
            }
        }, 1000);
    }

    async applyDiscountToCart() {
        if (this.credits <= 0) {
            console.log("❌ Aucun crédit disponible");
            this.removeDiscountDisplay();
            return;
        }

        const cartTotal = await this.getCartTotal();
        console.log("💰 Total panier final:", cartTotal, "MRU");

        if (cartTotal > 0) {
            this.calculateAndApplyDiscount(cartTotal);
        } else {
            console.log("🛒 Panier vide ou non chargé");
            this.removeDiscountDisplay();
        }
    }

    getCartTotal() {
        console.log("🔍 Recherche du panier...");
        
        // Attendre que le panier soit visible et chargé
        const waitForCart = () => {
            return new Promise((resolve) => {
                let attempts = 0;
                const checkCart = () => {
                    attempts++;
                    
                    // Méthode 1: Chercher .cart-total-floating
                    const floatingTotal = document.querySelector('.cart-total-floating');
                    if (floatingTotal && floatingTotal.style.display !== 'none') {
                        const text = floatingTotal.textContent || floatingTotal.innerText || '';
                        console.log("📄 Contenu panier:", text);
                        
                        // Extraire le nombre (supporte "XXX MRU" ou juste "XXX")
                        const match = text.match(/(\d+)[\s\u202F]*(?:MRU)?/);
                        if (match && match[1]) {
                            const total = parseInt(match[1]);
                            if (total > 0) {
                                console.log("✅ Total panier trouvé:", total, "MRU");
                                resolve(total);
                                return;
                            }
                        }
                    }
                    
                    // Méthode 2: Chercher d'autres sélecteurs
                    const selectors = ['.cart-total', '.total-price', '.panier-total', '[class*="total"]'];
                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element && element.style.display !== 'none') {
                            const text = element.textContent || '';
                            const numbers = text.match(/\d+/g);
                            if (numbers) {
                                for (const numStr of numbers) {
                                    const num = parseInt(numStr);
                                    if (num > 0 && num < 100000) {
                                        console.log("✅ Total trouvé via", selector + ":", num, "MRU");
                                        resolve(num);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    
                    // Réessayer si pas trouvé
                    if (attempts < 10) {
                        setTimeout(checkCart, 500);
                    } else {
                        console.log("❌ Panier non trouvé après", attempts, "tentatives");
                        resolve(0);
                    }
                };
                
                checkCart();
            });
        };
        
        return waitForCart();
    }

    calculateAndApplyDiscount(cartTotal) {
        const maxDiscount = cartTotal * 0.5;
        const discount = Math.min(this.credits, maxDiscount);
        const finalTotal = Math.max(0, cartTotal - discount);

        console.log("🛒 Réduction calculée:", {
            panier: cartTotal,
            credits: this.credits,
            reduction: discount,
            final: finalTotal
        });

        this.showDiscountInCart(discount, finalTotal, cartTotal);
    }

    showDiscountInCart(discount, finalTotal, originalTotal) {
        this.removeDiscountDisplay();

        const container = document.createElement('div');
        container.id = 'referral-discount-stable';
        container.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 12px 15px;
                margin: 10px 0;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
                border-left: 4px solid #2E7D32;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.1em;">🎁</span>
                        <strong>Réduction parrainage</strong>
                    </div>
                    <strong>-${discount} MRU</strong>
                </div>
                <div style="font-size: 11px; opacity: 0.9; margin-top: 5px;">
                    Appliquée automatiquement - Économisez ${discount} MRU!
                </div>
            </div>
            
            <!-- Nouveau total -->
            <div style="
                background: #f8f9fa;
                padding: 10px 15px;
                border-radius: 6px;
                margin-top: 5px;
                border: 1px solid #4CAF50;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #2E7D32; font-weight: bold;">Total après réduction</span>
                    <span style="color: #2E7D32; font-weight: bold; font-size: 16px;">${finalTotal} MRU</span>
                </div>
            </div>
        `;

        // Insertion SIMPLE et STABLE
        const cartElement = document.querySelector('.cart-total-floating');
        if (cartElement && cartElement.parentNode) {
            cartElement.parentNode.insertBefore(container, cartElement.nextSibling);
            console.log("✅ Réduction affichée dans le panier");
        } else {
            console.log("❌ Impossible d'afficher la réduction - panier non trouvé");
        }
    }

    removeDiscountDisplay() {
        const existing = document.getElementById('referral-discount-stable');
        if (existing) {
            existing.remove();
            console.log("🗑️ Ancienne réduction supprimée");
        }
    }
}

// Initialisation DELAYÉE et STABLE
setTimeout(() => {
    window.panierIntegrationStable = new PanierIntegrationStable();
    console.log("🚀 Panier Integration Stable - Initialisé");
}, 4000);
