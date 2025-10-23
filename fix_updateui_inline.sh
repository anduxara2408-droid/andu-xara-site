#!/bin/bash
echo "🔧 Correction de la fonction updateUI inline..."

# Trouver la ligne de updateUI
UPDATEUI_LINE=$(grep -n "function updateUI(isLoggedIn)" reductions.html | head -1 | cut -d: -f1)

if [ -n "$UPDATEUI_LINE" ]; then
    echo "📍 updateUI trouvée à la ligne: $UPDATEUI_LINE"
    
    # Trouver la fin de la fonction (recherche de l'accolade fermante)
    END_LINE=$(sed -n "$UPDATEUI_LINE,\$p" reductions.html | grep -n -m 1 "^    }" | head -1 | cut -d: -f1)
    
    if [ -n "$END_LINE" ]; then
        END_LINE=$((UPDATEUI_LINE + END_LINE - 1))
        echo "📍 Fin de updateUI à la ligne: $END_LINE"
        
        # Remplacer par une version sécurisée
        {
            head -n $((UPDATEUI_LINE - 1)) reductions.html
            cat << 'UPDATEUI_FIX'
function updateUI(isLoggedIn) {
    console.log('🔄 updateUI appelée, statut:', isLoggedIn);
    
    try {
        // Vérifier que les éléments existent avant manipulation
        const safeToggle = (id, className, shouldAdd) => {
            const element = document.getElementById(id);
            if (element) {
                element.classList[shouldAdd ? 'add' : 'remove'](className);
                return true;
            }
            return false;
        };
        
        // Mise à jour sécurisée
        safeToggle('loginBtn', 'hidden', isLoggedIn);
        safeToggle('logoutBtn', 'hidden', !isLoggedIn);
        safeToggle('userInfo', 'hidden', !isLoggedIn);
        safeToggle('codesPromoSection', 'hidden', !isLoggedIn);
        safeToggle('parrainageSection', 'hidden', !isLoggedIn);
        safeToggle('adminSection', 'hidden', !isLoggedIn);
        
        // Mettre à jour le texte userInfo
        const userInfo = document.getElementById('userInfo');
        if (userInfo && isLoggedIn && window.authManager && window.authManager.user) {
            userInfo.textContent = window.authManager.user.email;
        }
        
        // Charger les stats admin si connecté
        if (isLoggedIn) {
            setTimeout(() => {
                if (typeof loadAdminStats === 'function') {
                    loadAdminStats();
                }
            }, 1000);
        }
        
        console.log('✅ updateUI terminée sans erreur');
        
    } catch (error) {
        console.error('❌ Erreur dans updateUI:', error);
    }
}
UPDATEUI_FIX
            tail -n +$((END_LINE + 1)) reductions.html
        } > reductions.html.new
        
        mv reductions.html.new reductions.html
        echo "✅ updateUI corrigée dans reductions.html"
    else
        echo "❌ Impossible de trouver la fin de updateUI"
    fi
else
    echo "⚠️ updateUI non trouvée dans reductions.html"
fi
