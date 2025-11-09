// ===== SYSTÈME REDUCTIONS SIMPLIFIÉ - SANS INDEX FIREBASE =====
console.log('🎯 Système reductions simplifié chargé');

// Codes disponibles avec leurs réductions
const CODES_DISPONIBLES = {
    'TEST15': { discount: 15, nom: 'Code Test' },
    'WELCOME10': { discount: 10, nom: 'Bienvenue' },
    'ANDU20': { discount: 20, nom: 'Andu Spécial' },
    'SONINKE25': { discount: 25, nom: 'Soninké' },
    'AFRICA15': { discount: 15, nom: 'Afrique' },
    'MODE10': { discount: 10, nom: 'Mode' },
    'BIENVENUE15': { discount: 15, nom: 'Bienvenue FR' },
    'ANDU2025': { discount: 20, nom: 'Andu 2025' },
    'SOLDE30': { discount: 30, nom: 'Soldes' },
    'PREMIUM25': { discount: 25, nom: 'Premium' }
};

// Vérifier les codes actifs au chargement
function verifierCodeActifSimple() {
    console.log('🔄 Vérification codes actifs...');
    
    // Vérifier localStorage
    const promoData = localStorage.getItem('anduxara_active_promo');
    if (promoData) {
        try {
            const promo = JSON.parse(promoData);
            console.log('📥 Code actif trouvé:', promo.code);
            afficherCodeActif(promo.code, promo.discount);
            return promo.code;
        } catch (error) {
            console.error('❌ Erreur lecture promo:', error);
        }
    }
    
    console.log('ℹ️ Aucun code actif trouvé');
    return null;
}

// Afficher le code actif dans l'interface
function afficherCodeActif(code, discount) {
    console.log('🎁 Affichage code actif:', code);
    
    // Mettre à jour le badge
    const badge = document.querySelector('.active-promo-badge');
    if (badge) {
        badge.style.display = 'block';
        badge.innerHTML = `
            <div style="background: #27ae60; color: white; padding: 10px; border-radius: 8px; margin: 10px 0;">
                🎁 CODE ACTIF : <strong>${code}</strong> (-${discount}%)
                <button onclick="retirerCodeActif()" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin-left: 10px; cursor: pointer;">
                    ❌ Retirer
                </button>
            </div>
        `;
    }
}

// Retirer le code actif
function retirerCodeActif() {
    console.log('🗑️ Retrait du code actif');
    localStorage.removeItem('anduxara_active_promo');
    
    const badge = document.querySelector('.active-promo-badge');
    if (badge) {
        badge.style.display = 'none';
    }
    
    alert('🔓 Code promo retiré');
    location.reload();
}

// Charger l'historique simplifié
function chargerHistoriqueSimple() {
    console.log('📊 Chargement historique simplifié');
    
    const historiqueData = localStorage.getItem('anduxara_promo_history');
    const container = document.getElementById('historique-utilisations');
    
    if (!container) {
        console.log('⏳ Conteneur historique non trouvé');
        return;
    }
    
    if (!historiqueData) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #666;">
                📝 Aucun code utilisé récemment
                <br><small>Les codes utilisés apparaîtront ici</small>
            </div>
        `;
        return;
    }
    
    try {
        const historique = JSON.parse(historiqueData);
        console.log('📜 Historique chargé:', historique.length, 'codes');
        
        if (historique.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Aucun code utilisé</p>';
            return;
        }
        
        let html = '<div style="max-height: 300px; overflow-y: auto;">';
        
        historique.slice(0, 10).forEach((usage, index) => {
            const date = new Date(usage.timestamp).toLocaleDateString('fr-FR');
            html += `
                <div style="border-left: 4px solid #667eea; padding: 10px; margin: 8px 0; background: #f8f9fa; border-radius: 0 8px 8px 0;">
                    <div style="display: flex; justify-content: between; align-items: center;">
                        <strong style="color: #2c3e50;">${usage.code}</strong>
                        <span style="background: #27ae60; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                            -${usage.discount}%
                        </span>
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        📅 ${date} • 🎁 ${usage.nom || 'Réduction'}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch (error) {
        console.error('❌ Erreur historique:', error);
        container.innerHTML = '<p style="color: #e74c3c;">Erreur chargement historique</p>';
    }
}

// Ajouter un code à l'historique
function ajouterAHistorique(code, discount, nom) {
    console.log('📝 Ajout à l\'historique:', code);
    
    let historique = [];
    const historiqueData = localStorage.getItem('anduxara_promo_history');
    
    if (historiqueData) {
        try {
            historique = JSON.parse(historiqueData);
        } catch (error) {
            console.error('❌ Erreur parsing historique:', error);
        }
    }
    
    // Ajouter le nouvel usage
    historique.unshift({
        code: code,
        discount: discount,
        nom: nom,
        timestamp: new Date().toISOString()
    });
    
    // Garder seulement les 20 derniers
    historique = historique.slice(0, 20);
    
    localStorage.setItem('anduxara_promo_history', JSON.stringify(historique));
}

// Activer un code promo
function activerCodeSimple(code) {
    console.log('🎯 Activation code:', code);
    
    const codeInfo = CODES_DISPONIBLES[code.toUpperCase()];
    
    if (!codeInfo) {
        alert('❌ Code invalide ou expiré');
        return false;
    }
    
    // Sauvegarder le code actif
    const promoData = {
        code: code.toUpperCase(),
        discount: codeInfo.discount,
        nom: codeInfo.nom,
        appliedAt: new Date().toISOString(),
        source: 'reductions-simple'
    };
    
    localStorage.setItem('anduxara_active_promo', JSON.stringify(promoData));
    
    // Ajouter à l'historique
    ajouterAHistorique(code.toUpperCase(), codeInfo.discount, codeInfo.nom);
    
    // Préparer le transfert vers index.html
    sessionStorage.setItem('anduxara_promo_code', code.toUpperCase());
    
    console.log('✅ Code activé:', code, '- Réduction:', codeInfo.discount + '%');
    
    // Afficher confirmation
    alert(`🎉 CODE ACTIVÉ !\n\n${code.toUpperCase()} - ${codeInfo.nom}\nRéduction: ${codeInfo.discount}%\n\nRedirection vers la boutique...`);
    
    // Rediriger vers index.html
    setTimeout(() => {
        window.location.href = `index.html?codePromo=${code.toUpperCase()}`;
    }, 1500);
    
    return true;
}

// Interface utilisateur pour activer un code
function creerInterfaceCodes() {
    console.log('🎨 Création interface codes...');
    
    const container = document.querySelector('.codes-container') || document.body;
    
    const interfaceHTML = `
        <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">🎁 Codes Promo Disponibles</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 20px;">
                ${Object.entries(CODES_DISPONIBLES).map(([code, info]) => `
                    <div style="border: 2px solid #667eea; border-radius: 8px; padding: 12px; text-align: center; cursor: pointer; transition: all 0.3s;"
                         onclick="activerCodeSimple('${code}')"
                         onmouseover="this.style.background='#f0f4ff'; this.style.transform='translateY(-2px)'"
                         onmouseout="this.style.background='white'; this.style.transform='translateY(0)'">
                        <div style="font-weight: bold; color: #2c3e50;">${code}</div>
                        <div style="font-size: 14px; color: #666;">${info.nom}</div>
                        <div style="color: #27ae60; font-weight: bold; margin-top: 5px;">-${info.discount}%</div>
                    </div>
                `).join('')}
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">💡 Comment utiliser</h4>
                <ol style="margin: 0; padding-left: 20px; color: #555;">
                    <li>Cliquez sur un code pour l'activer</li>
                    <li>Vous serez redirigé vers la boutique</li>
                    <li>La réduction s'appliquera automatiquement</li>
                    <li>Ajoutez des produits au panier pour voir les prix réduits</li>
                </ol>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('afterbegin', interfaceHTML);
}

// Initialisation complète
function initReductionsSimple() {
    console.log('🚀 Initialisation système reductions simplifié');
    
    // Attendre que le DOM soit prêt
    setTimeout(() => {
        verifierCodeActifSimple();
        chargerHistoriqueSimple();
        creerInterfaceCodes();
        
        console.log('✅ Système reductions simplifié prêt');
    }, 500);
}

// Démarrer le système
document.addEventListener('DOMContentLoaded', initReductionsSimple);

// Exposer les fonctions globalement
window.activerCodeSimple = activerCodeSimple;
window.retirerCodeActif = retirerCodeActif;

console.log('✅ reductions-simple.js chargé avec succès');
