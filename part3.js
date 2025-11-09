function appliquerCodePromo() {
    const codeInput = document.getElementById('promoInput');
    const messageElement = document.getElementById('promoMessage');
    
    if (!codeInput || !messageElement) {
        console.error('Éléments promo non trouvés');
        return;
    }
    
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        messageElement.innerHTML = '<span style="color: #e74c3c;">Veuillez entrer un code</span>';
        messageElement.style.display = 'block';
        return;
    }
    
    const validCodes = {
        'TEST15': 15, 'WELCOME10': 10, 'ANDU20': 20, 'SONINKE25': 25,
        'AFRICA15': 15, 'MODE10': 10, 'BIENVENUE15': 15, 'ANDU2025': 20,
        'SOLDE30': 30, 'PREMIUM25': 25
    };
    
    if (validCodes[code]) {
        const discount = validCodes[code];
        activePromoCode = code;
        promoDiscount = discount;
        
        localStorage.setItem('anduxara_active_promo', JSON.stringify({
            code: code,
            discount: discount,
            appliedAt: new Date().toISOString()
        }));
        
        appliquerReductionPanier();
        afficherBadgeReduction();
        updateActivePromoDisplay();
        
        messageElement.innerHTML = '<span style="color: #27ae60;">Code "' + code + '" appliqué ! ' + discount + '% de réduction</span>';
        messageElement.style.display = 'block';
        codeInput.value = '';
        
        console.log("Réduction de " + discount + "% appliquée avec le code " + code);
        
    } else {
        messageElement.innerHTML = '<span style="color: #e74c3c;">Code invalide</span>';
        messageElement.style.display = 'block';
    }
}

function updateActivePromoDisplay() {
    const display = document.getElementById('active-promo-display');
    const codeElement = document.getElementById('active-promo-code');
    
    if (!display || !codeElement) return;
    
    if (activePromoCode && promoDiscount) {
        display.style.display = 'block';
        codeElement.textContent = activePromoCode + ' (-' + promoDiscount + '%)';
    } else {
        display.style.display = 'none';
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    console.log('Démarrage système réductions...');
    setTimeout(() => initialiserReductionsPanier(), 1000);
});

// Export global
window.initialiserReductionsPanier = initialiserReductionsPanier;
window.appliquerReductionPanier = appliquerReductionPanier;
window.afficherBadgeReduction = afficherBadgeReduction;
window.retirerReduction = retirerReduction;
window.appliquerCodePromo = appliquerCodePromo;
window.updateActivePromoDisplay = updateActivePromoDisplay;

console.log('Système réductions chargé');
