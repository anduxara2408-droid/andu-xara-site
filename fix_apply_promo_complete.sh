#!/bin/bash
echo "🔧 CORRECTION COMPLÈTE DE applyPromoCode"
echo "========================================"

FILE="reductions.html"

# Créer un fichier temporaire avec la nouvelle fonction
cat > temp_fix.js << 'FUNCTION_EOF'

// ===== FONCTION CODES PROMO AVEC MODULE UNIFIÉ =====
async function applyPromoCode() {
    const input = document.getElementById('promoInput');
    const button = document.querySelector('.promo-btn');
    const loading = document.getElementById('loading');
    const message = document.getElementById('message');
    
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        showMessage('Veuillez saisir un code promo', 'error');
        input.focus();
        return;
    }
    
    button.disabled = true;
    loading.style.display = 'block';
    message.style.display = 'none';
    
    try {
        // Utiliser le module unifié
        const success = await appliquerCodePromo(code);
        
        if (success) {
            showMessage(`Code ${code} appliqué avec succès !`, 'success');
            input.value = '';
            
            // Mettre à jour l'affichage de la réduction
            const discountDisplay = document.getElementById('discountDisplay');
            const discountValue = document.getElementById('discountValue');
            if (discountDisplay && discountValue && window.panierUnifie) {
                discountValue.textContent = `${window.panierUnifie.codePromoActif.reduction}% de réduction`;
                discountDisplay.style.display = 'block';
            }
        } else {
            showMessage(`Code ${code} invalide ou expiré`, 'error');
        }
        
    } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
    } finally {
        button.disabled = false;
        loading.style.display = 'none';
    }
}

// Fonction resetPromo utilisant le module unifié
function resetPromo() {
    retirerCodePromo();
    const discountDisplay = document.getElementById('discountDisplay');
    if (discountDisplay) {
        discountDisplay.style.display = 'none';
    }
    showMessage('Réduction retirée', 'info');
}

// Fonction showMessage pour reductions.html
function showMessage(text, type) {
    const message = document.getElementById('message');
    if (!message) return;
    
    message.textContent = text;
    message.className = `promo-message promo-${type}`;
    message.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    }
}
FUNCTION_EOF

# Remplacer l'ancienne fonction applyPromoCode par la nouvelle
# Supprimer d'abord l'ancienne version
sed -i '/async function applyPromoCode()/,/^}$/d' "$FILE"

# Insérer la nouvelle fonction après la fonction applyPromoCode existante
# Trouver la ligne après la fermeture de simulateValidation et insérer avant
awk '
/function showMessage\(text, type\)/ {found=1}
found && /^}$/ {print; while(getline line < "temp_fix.js") print line; found=0; next}
{print}
' "$FILE" > "${FILE}.temp" && mv "${FILE}.temp" "$FILE"

rm -f temp_fix.js

echo "✅ Fonction applyPromoCode corrigée !"
