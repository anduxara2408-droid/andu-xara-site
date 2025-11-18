// js/secure/credits-badge-no-icons.js
console.log("🎯 Credits Badge No Icons - CHARGEMENT...");

// Fonction globale accessible
window.createSimpleBadge = function() {
    console.log("🔄 createSimpleBadge appelée");
    
    const creditsStr = localStorage.getItem('anduxara_referral_credits');
    const credits = creditsStr ? parseInt(creditsStr) : 0;
    
    console.log("💰 Crédits pour badge:", credits, "MRU");
    
    if (credits > 0) {
        // Supprimer ancien badge
        const oldBadge = document.getElementById('credits-badge-no-icons');
        if (oldBadge) oldBadge.remove();
        
        // Créer nouveau badge AVEC BOUTON FERMER
        const badge = document.createElement('div');
        badge.id = 'credits-badge-no-icons';
        
        badge.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 99999;
        `;
        
        badge.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
                color: white;
                padding: 15px 20px;
                border-radius: 25px;
                font-weight: bold;
                box-shadow: 0 4px 20px rgba(76, 175, 80, 0.5);
                border: 3px solid white;
                cursor: pointer;
                text-align: center;
                font-family: Arial, sans-serif;
                min-width: 180px;
                position: relative;
            " onclick="window.open('reductions.html', '_blank')">
                <!-- Bouton fermer -->
                <button onclick="event.stopPropagation(); this.parentElement.parentElement.style.display='none';" 
                        style="
                            position: absolute;
                            top: -8px;
                            right: -8px;
                            background: #ff4444;
                            color: white;
                            border: none;
                            border-radius: 50%;
                            width: 20px;
                            height: 20px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 14px;
                            line-height: 1;
                            z-index: 100001;
                        ">×</button>
                
                <div style="font-size: 16px; font-weight: 800;">🎁 ${credits} MRU</div>
                <div style="font-size: 11px; opacity: 0.9;">Réduction parrainage</div>
                <div style="font-size: 9px; opacity: 0.7; margin-top: 5px;">Cliquer pour voir</div>
            </div>
        `;
        
        document.body.appendChild(badge);
        console.log("✅ Badge crédits créé avec bouton fermer!");
        
    } else {
        console.log("ℹ️ Aucun crédit à afficher");
    }
}
// Auto-exécution au chargement
console.log("🎯 Credits Badge - Initialisation automatique");
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log("📄 DOM chargé - création badge");
        window.createSimpleBadge();
    });
} else {
    console.log("📄 DOM déjà prêt - création badge immédiate");
    window.createSimpleBadge();
}

// Écouter les changements de localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'anduxara_referral_credits') {
        console.log("🔄 Changement de crédits détecté");
        window.createSimpleBadge();
    }
});

console.log("🎯 Credits Badge No Icons - PRÊT");
