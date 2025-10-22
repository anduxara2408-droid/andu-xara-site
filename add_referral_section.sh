#!/bin/bash
echo "🎯 AJOUT DE LA SECTION PARRAINAGE"
echo "================================"

FILE="reductions.html"

# Créer la section parrainage
cat > referral_section.html << 'REFERRAL_EOF'

<!-- ===== SECTION PARRAINAGE INTELLIGENT ===== -->
<section class="referral-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; border-radius: 20px; margin: 40px 0;">
    <div class="container">
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 2.5rem; margin-bottom: 15px;">👑 Programme de Parrainage</h2>
            <p style="font-size: 1.2rem; opacity: 0.9;">Parrainez vos amis et gagnez ensemble !</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; max-width: 1000px; margin: 0 auto;">
            
            <!-- Carte Votre Code -->
            <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; backdrop-filter: blur(10px);">
                <h3 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span>🎫</span> Votre Code de Parrainage
                </h3>
                <div style="background: white; color: #333; padding: 15px; border-radius: 10px; text-align: center; margin-bottom: 15px;">
                    <div id="userReferralCode" style="font-size: 1.5rem; font-weight: bold; font-family: monospace;">Chargement...</div>
                </div>
                <button onclick="copyReferralCode()" style="width: 100%; background: #25D366; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    📋 Copier le lien
                </button>
            </div>

            <!-- Carte Vos Gains -->
            <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; backdrop-filter: blur(10px);">
                <h3 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span>💰</span> Vos Gains
                </h3>
                <div id="userReferralStats" style="space-y-3">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>👥 Personnes parrainées:</span>
                        <span style="font-weight: bold;">0</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>🎁 Gains totaux:</span>
                        <span style="font-weight: bold;">0 MRU</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>💎 Disponible:</span>
                        <span style="font-weight: bold; color: #25D366;">0 MRU</span>
                    </div>
                </div>
            </div>

            <!-- Carte Comment ça marche -->
            <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; backdrop-filter: blur(10px);">
                <h3 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span>🎯</span> Comment ça marche ?
                </h3>
                <div style="space-y-3">
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <span>1️⃣</span>
                        <span>Partagez votre code</span>
                    </div>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <span>2️⃣</span>
                        <span>Votre ami s'inscrit</span>
                    </div>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <span>3️⃣</span>
                        <span>Vous gagnez <strong>15%</strong> de ses achats</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <span>4️⃣</span>
                        <span>Votre ami gagne <strong>10%</strong> de réduction</span>
                    </div>
                </div>
            </div>

        </div>

        <!-- Récompenses disponibles -->
        <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; margin-top: 25px; backdrop-filter: blur(10px);">
            <h3 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <span>🎁</span> Vos Récompenses
            </h3>
            <div id="userRewardsList" style="text-align: center; color: #ccc;">
                Connectez-vous pour voir vos récompenses
            </div>
        </div>
    </div>
</section>

<script>
// Fonction pour copier le code de parrainage
async function copyReferralCode() {
    if (!window.referralSystem) {
        alert("Système de parrainage non chargé");
        return;
    }

    const code = await referralSystem.getUserReferralCode();
    const link = referralSystem.generateReferralLink(code);
    
    navigator.clipboard.writeText(link).then(() => {
        alert("✅ Lien de parrainage copié !\n\n" + link);
    }).catch(() => {
        // Fallback pour les anciens navigateurs
        const tempInput = document.createElement('input');
        tempInput.value = link;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert("✅ Lien de parrainage copié !");
    });
}
</script>
REFERRAL_EOF

# Insérer la section après la section codes promo principale
awk '
/<!-- Section Informations -->/ {while(getline line < "referral_section.html") print line} {print}
' "$FILE" > "${FILE}.temp" && mv "${FILE}.temp" "$FILE"

# Ajouter l'import du système de parrainage
if ! grep -q "firebase-referral-system.js" "$FILE"; then
    sed -i '/panier-unified.js/a\    <script src="firebase-referral-system.js"></script>' "$FILE"
fi

rm -f referral_section.html

echo "✅ Section parrainage ajoutée !"
