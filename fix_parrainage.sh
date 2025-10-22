#!/bin/bash

# Fichier source et backup
FILE="reductions.html"
BACKUP="${FILE}.backup2"

# Crée un backup
cp "$FILE" "$BACKUP"

# Supprime toutes les anciennes sections parrainage
sed -i '/<div class="parrainage-section">/,/<\/style>/d' "$FILE"
sed -i '/genererLienParrainage/d' "$FILE"
sed -i '/partagerLienParrainage/d' "$FILE"

# Ajoute la section parrainage propre à la fin (avant </body>)
sed -i '/<\/body>/i \
<!-- Section Parrainage -->\
<div class="parrainage-section">\
    <h2>🎁 Programme de Parrainage</h2>\
    <div class="rewards-info">\
        <div class="reward-card"><h3>👤 Vous parrainez</h3><p>+1000 MRU</p></div>\
        <div class="reward-card"><h3>👥 Votre ami</h3><p>+500 MRU</p></div>\
    </div>\
    <div id="lienParrainageContainer">\
        <button onclick="genererLienParrainage()" class="btn-generer-lien">🎯 Générer mon lien</button>\
    </div>\
    <div id="mesRecompensesContainer"></div>\
</div>\
\
<style>\
.parrainage-section{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px;border-radius:15px;margin:20px 0}\
.rewards-info{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:20px 0}\
.reward-card{background:rgba(255,255,255,0.2);padding:15px;border-radius:10px;text-align:center}\
.btn-generer-lien{background:#ff6b6b;color:white;border:none;padding:12px 20px;border-radius:8px;cursor:pointer;font-size:16px;margin:10px 0}\
.referral-link{background:white;color:#333;padding:15px;border-radius:10px;margin:15px 0}\
</style>' "$FILE"

# Ajoute les fonctions JavaScript avant </body>
sed -i '/<\/body>/i \
<script>\
async function genererLienParrainage(){\
    const user=await getCurrentUser();if(!user){alert("❌ Connectez-vous");return}\
    const ref=db.collection("parrainage").doc(user.uid);const doc=await ref.get();\
    let code=doc.exists?doc.data().referralCode:"ANDU-"+Math.random().toString(36).substr(2,8).toUpperCase();\
    if(!doc.exists)await ref.set({referralCode:code,userId:user.uid,email:user.email,dateCreation:new Date(),utilisations:0,maxUtilisations:1,actif:true});\
    const lien=window.location.origin+"/andu-xara-site/index.html?ref="+code;\
    await navigator.clipboard.writeText(lien);\
    document.getElementById("lienParrainageContainer").innerHTML=`<div class="referral-link"><h3>🎁 Lien de parrainage</h3><p><strong>Lien:</strong> ${lien}</p><button onclick="partagerLienParrainage(\\'${lien}\\')" class="btn-generer-lien" style="background:#667eea">📤 Partager</button></div>`;\
    alert("✅ Lien généré et copié !")\
}\
function partagerLienParrainage(lien){\
    navigator.share?navigator.share({title:"Rejoins Andu Xara!",text:"Crée ton compte avec mon lien 🎁",url:lien}):alert("Lien copié ! Partagez: "+lien)\
}\
</script>' "$FILE"

echo "✅ Fichier réparé avec succès!"
