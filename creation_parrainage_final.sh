#!/bin/bash

echo "🔄 Création du système parrainage Andu Xara..."

# Fichiers
BACKUP="reductions.html.backup"
FINAL="reductions.html"

# Vérifie le backup
if [ ! -f "$BACKUP" ]; then
    echo "❌ Backup non trouvé, création depuis reductions.html actuel"
    cp reductions.html "$BACKUP"
fi

# Crée le fichier final depuis le backup
cp "$BACKUP" "$FINAL"

# Supprime TOUTES les anciennes références
echo "🧹 Nettoyage des anciennes sections..."
sed -i '/parrainage-section/d' "$FINAL"
sed -i '/genererLienParrainage/d' "$FINAL"
sed -i '/rewards-info/d' "$FINAL"
sed -i '/reward-card/d' "$FINAL"
sed -i '/lienParrainageContainer/d' "$FINAL"
sed -i '/mesRecompensesContainer/d' "$FINAL"
sed -i '/partagerLienParrainage/d' "$FINAL"
sed -i '/chargerRecompenses/d' "$FINAL"

# Crée le contenu COMPLET du parrainage
PARRAINAGE_CONTENT='<!-- DEBUT SYSTEME PARRAINAGE ANDU XARA -->
<section id="systeme-parrainage-andu-xara" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;border-radius:20px;margin:30px 0;border:3px solid rgba(255,255,255,0.3);box-shadow:0 10px 30px rgba(0,0,0,0.2);">
    <h2 style="text-align:center;margin-bottom:30px;font-size:28px;">🎁 Programme de Parrainage Andu Xara</h2>
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:25px;margin:30px 0;">
        <div style="background:rgba(255,255,255,0.15);padding:25px;border-radius:15px;text-align:center;backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.2);">
            <h3 style="margin:0 0 15px 0;font-size:20px;">👤 Vous parrainez</h3>
            <p style="margin:0;font-size:24px;font-weight:bold;color:#4cd964;">+1000 MRU</p>
            <p style="margin:10px 0 0 0;font-size:14px;opacity:0.9;">de réduction</p>
        </div>
        <div style="background:rgba(255,255,255,0.15);padding:25px;border-radius:15px;text-align:center;backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.2);">
            <h3 style="margin:0 0 15px 0;font-size:20px;">👥 Votre ami</h3>
            <p style="margin:0;font-size:24px;font-weight:bold;color:#4cd964;">+500 MRU</p>
            <p style="margin:10px 0 0 0;font-size:14px;opacity:0.9;">de réduction</p>
        </div>
    </div>
    
    <div id="andu-xara-lien-container" style="text-align:center;">
        <button onclick="anduXaraGenererLien()" style="background:#ff6b6b;color:white;border:none;padding:18px 30px;border-radius:12px;cursor:pointer;font-size:18px;font-weight:bold;width:100%;max-width:400px;transition:all 0.3s ease;box-shadow:0 5px 15px rgba(255,107,107,0.3);">
            🎯 Générer mon lien de parrainage
        </button>
    </div>
    
    <div id="andu-xara-recompenses-container" style="margin-top:30px;"></div>
</section>

<script>
// FONCTION UNIQUE ANDU XARA
async function anduXaraGenererLien() {
    console.log("🚀 ANDU XARA - Génération lien...");
    
    try {
        const user = await getCurrentUser();
        if (!user) {
            alert("🔐 Veuillez vous connecter pour générer votre lien de parrainage");
            return;
        }

        const refParrainage = db.collection("parrainage").doc(user.uid);
        const doc = await refParrainage.get();
        
        let codeParrainage;
        
        if (doc.exists) {
            codeParrainage = doc.data().referralCode;
        } else {
            codeParrainage = "ANDU-" + Math.random().toString(36).substr(2, 8).toUpperCase();
            await refParrainage.set({
                referralCode: codeParrainage,
                userId: user.uid,
                email: user.email,
                dateCreation: new Date(),
                utilisations: 0,
                maxUtilisations: 1,
                actif: true,
                recompenseAttribuee: false
            });
        }

        const lienParrainage = window.location.origin + "/andu-xara-site/index.html?ref=" + codeParrainage;
        await navigator.clipboard.writeText(lienParrainage);
        
        document.getElementById("andu-xara-lien-container").innerHTML = `
            <div style="background:white;color:#333;padding:25px;border-radius:15px;margin:20px 0;border-left:6px solid #667eea;box-shadow:0 5px 20px rgba(0,0,0,0.1);">
                <h3 style="color:#667eea;margin-top:0;font-size:22px;">🎉 Votre lien de parrainage</h3>
                <p style="font-weight:bold;margin-bottom:10px;">Partagez ce lien avec vos amis :</p>
                <div style="background:#f8f9fa;padding:15px;border-radius:10px;word-break:break-all;font-family:monospace;font-size:14px;border:1px solid #e9ecef;">
                    ${lienParrainage}
                </div>
                <div style="background:#e8f4fd;padding:12px;border-radius:8px;margin:15px 0;border-left:4px solid #667eea;">
                    ✅ <strong>Lien copié dans le presse-papier !</strong>
                </div>
                <button onclick="anduXaraPartagerLien('\''${lienParrainage}'\'')" 
                        style="background:#667eea;color:white;border:none;padding:14px 25px;border-radius:10px;cursor:pointer;font-size:16px;width:100%;transition:all 0.3s;box-shadow:0 3px 10px rgba(102,126,234,0.3);">
                    📤 Partager le lien
                </button>
            </div>
        `;
        
        alert("✅ Super ! Votre lien de parrainage a été généré et copié.");
        
    } catch (error) {
        console.error("❌ Erreur:", error);
        alert("❌ Une erreur est survenue lors de la génération du lien");
    }
}

function anduXaraPartagerLien(lien) {
    if (navigator.share) {
        navigator.share({
            title: "Rejoins Andu Xara ! 🎁",
            text: "Crée ton compte avec mon lien de parrainage et obtiens 500 MRU de réduction immédiate !",
            url: lien
        });
    } else {
        alert("📋 Lien de parrainage copié !\\n\\nPartagez-le avec vos amis :\\n" + lien);
    }
}

async function anduXaraChargerRecompenses() {
    try {
        const user = await getCurrentUser();
        if (!user) return;

        const snapshot = await db.collection("rewards")
            .where("userId", "==", user.uid)
            .where("statut", "==", "actif")
            .get();
            
        const recompenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const container = document.getElementById("andu-xara-recompenses-container");
        
        if (recompenses.length === 0) {
            container.innerHTML = "<p style=\"text-align:center;opacity:0.7;font-style:italic;font-size:16px;\">Aucune récompense pour le moment</p>";
            return;
        }
        
        container.innerHTML = `
            <h4 style="border-bottom:2px solid rgba(255,255,255,0.3);padding-bottom:15px;font-size:20px;">🎁 Mes Récompenses</h4>
            ${recompenses.map(rec => `
                <div style="background:rgba(255,255,255,0.1);padding:20px;border-radius:12px;margin:15px 0;display:flex;justify-content:space-between;align-items:center;border:1px solid rgba(255,255,255,0.1);">
                    <div style="flex:1;">
                        <strong style="display:block;margin-bottom:8px;font-size:16px;">${rec.description}</strong>
                        <small style="opacity:0.8;font-size:14px;">${rec.dateAttribution?.toDate ? new Date(rec.dateAttribution.toDate()).toLocaleDateString("fr-FR") : "Date inconnue"}</small>
                    </div>
                    <span style="color:#4cd964;font-weight:bold;font-size:22px;">${rec.montant} MRU</span>
                </div>
            `).join("")}
        `;
    } catch (error) {
        console.error("❌ Erreur chargement récompenses:", error);
    }
}

document.addEventListener("DOMContentLoaded", anduXaraChargerRecompenses);
console.log("✅ Système parrainage Andu Xara chargé !");
</script>
<!-- FIN SYSTEME PARRAINAGE ANDU XARA -->'

# Ajoute le contenu à la fin du fichier (avant </body>)
echo "$PARRAINAGE_CONTENT" >> temp_content.html

# Insère le contenu avant </body>
sed -i '/<\/body>/e cat temp_content.html' "$FINAL"

# Nettoie les fichiers temporaires
rm -f temp_content.html

echo "✅ ✅ ✅ SYSTÈME PARRAINAGE CRÉÉ AVEC SUCCÈS !"
