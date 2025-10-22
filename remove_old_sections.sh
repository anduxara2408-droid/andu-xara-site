#!/bin/bash

FILE="reductions.html"

# Crée un fichier temporaire sans l'ancienne section
grep -v 'parrainage-section' "$FILE" | grep -v 'DEBUT SECTION PARRAINAGE UNIQUE' | grep -v 'FIN SECTION PARRAINAGE UNIQUE' > "${FILE}.temp"

# Réajoute UNIQUEMENT la section propre à la fin
cat >> "${FILE}.temp" << 'HTML'
<!-- DEBUT SECTION PARRAINAGE UNIQUE -->
<div class="parrainage-section" id="section-parrainage-unique">
    <h2>🎁 Programme de Parrainage</h2>
    <div class="rewards-info">
        <div class="reward-card"><h3>👤 Vous</h3><p>+1000 MRU</p></div>
        <div class="reward-card"><h3>👥 Votre ami</h3><p>+500 MRU</p></div>
    </div>
    <div id="lienParrainageContainer">
        <button onclick="genererLienParrainageFinal()" class="btn-generer-lien">🎯 Générer mon lien</button>
    </div>
    <div id="mesRecompensesContainer"></div>
</div>

<style>
.parrainage-section{background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:25px;border-radius:16px;margin:25px 0}
.rewards-info{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:25px 0}
.reward-card{background:rgba(255,255,255,0.15);padding:20px;border-radius:12px;text-align:center}
.btn-generer-lien{background:#ff6b6b;color:white;border:none;padding:14px 24px;border-radius:10px;cursor:pointer;font-size:16px;margin:15px 0;width:100%}
.referral-link{background:white;color:#333;padding:20px;border-radius:12px;margin:20px 0;border-left:5px solid #667eea}
</style>

<script>
async function genererLienParrainageFinal(){
    try{
        const user=await getCurrentUser();if(!user){alert("❌ Connectez-vous");return}
        const ref=db.collection("parrainage").doc(user.uid);const doc=await ref.get();
        let code=doc.exists?doc.data().referralCode:"ANDU-"+Math.random().toString(36).substr(2,8).toUpperCase();
        if(!doc.exists)await ref.set({referralCode:code,userId:user.uid,email:user.email,dateCreation:new Date(),utilisations:0,maxUtilisations:1,actif:true});
        const lien=window.location.origin+"/andu-xara-site/index.html?ref="+code;
        await navigator.clipboard.writeText(lien);
        document.getElementById("lienParrainageContainer").innerHTML='<div class="referral-link"><h3>🎉 Lien généré</h3><p><strong>Lien:</strong> '+lien+'</p><button onclick="partagerLienParrainageFinal(\\''+lien+'\\')" class="btn-generer-lien" style="background:#667eea">📤 Partager</button></div>';
        alert("✅ Lien généré et copié !")
    }catch(e){console.error("Erreur:",e),alert("❌ Erreur")}
}
function partagerLienParrainageFinal(lien){
    navigator.share?navigator.share({title:"Rejoins Andu Xara!",text:"Crée ton compte avec mon lien 🎁",url:lien}):alert("Lien copié ! Partagez: "+lien)
}
async function chargerRecompensesFinal(){
    try{
        const user=await getCurrentUser();if(!user)return;
        const snap=await db.collection("rewards").where("userId","==",user.uid).where("statut","==","actif").get();
        const recs=snap.docs.map(d=>({id:d.id,...d.data()}));
        const c=document.getElementById("mesRecompensesContainer");
        c.innerHTML=recs.length?'<h3>🎁 Mes Récompenses</h3>'+recs.map(r=>'<div class="reward-card" style="text-align:left;display:flex;justify-content:space-between"><div><strong>'+r.description+'</strong></div><span style="color:#4cd964;font-weight:bold">'+r.montant+' MRU</span></div>').join(''):'<p style="text-align:center;opacity:0.7">Aucune récompense</p>'
    }catch(e){console.error("Erreur:",e)}
}
document.addEventListener("DOMContentLoaded",chargerRecompensesFinal);
</script>
<!-- FIN SECTION PARRAINAGE UNIQUE -->
HTML

# Remplace le fichier original
mv "${FILE}.temp" "$FILE"
echo "✅ Fichier complètement nettoyé avec UNE SEULE section !"
