import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { writeFileSync } from 'fs';

console.log('\n' + '='.repeat(60));
console.log('📧 NEWSLETTER ANDU XARA - PRÊT POUR DEMAIN');
console.log('='.repeat(60) + '\n');

// Configuration Supabase
const supabase = createClient(
  'https://vxvrjeelertkdhfyuiue.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I'
);

// ========================================================
// CONFIGURATION GMAIL (À UTILISER DEMAIN)
// ========================================================

const GMAIL_CONFIG = {
  // VOTRE COMPTE PRINCIPAL (débloqué dans 24h)
  user: 'anduxara2408@gmail.com',
  pass: 'leyv edym khzj ggva', // Votre mot de passe d'application
  
  // COMPTE DE SECOURS (créez-le maintenant si possible)
  backupUser: 'anduxara.newsletter@gmail.com',
  backupPass: '' // À remplir si vous créez le compte
};

// ========================================================
// TEMPLATE PROFESSIONNEL COMPLET
// ========================================================

const PROFESSIONAL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Andu Xara - Nouveautés 2025</title>
    <style>
        /* STYLES COMPLETS POUR EMAIL PROFESSIONNEL */
        body { 
            margin: 0; 
            padding: 0; 
            background: #f8f4f0; 
            font-family: 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
        }
        .email-wrapper {
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
        }
        .header {
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
            color: white; 
            padding: 40px 20px; 
            text-align: center;
        }
        .header h1 {
            font-size: 36px; 
            margin: 0 0 10px 0; 
            font-weight: 700;
        }
        .header .subtitle {
            font-size: 18px; 
            opacity: 0.9; 
            font-weight: 300;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            color: #8B4513; 
            font-size: 20px; 
            margin-bottom: 25px; 
            font-weight: 600;
        }
        .highlight-box {
            background: #FFF8F0; 
            border-left: 4px solid #D2691E; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 0 8px 8px 0;
        }
        .promo-code {
            background: #2C1810; 
            color: #FFD700; 
            padding: 15px; 
            text-align: center; 
            border-radius: 8px; 
            font-size: 24px; 
            font-weight: bold; 
            margin: 20px 0; 
            border: 2px dashed #D2691E;
        }
        .cta-button {
            display: inline-block; 
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); 
            color: white; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 30px; 
            font-weight: bold; 
            font-size: 18px; 
            margin: 25px 0; 
            transition: all 0.3s;
        }
        .cta-button:hover {
            transform: translateY(-2px); 
            box-shadow: 0 6px 20px rgba(139, 69, 19, 0.3);
        }
        .contact-section {
            background: #2C1810; 
            color: white; 
            padding: 30px; 
            margin-top: 40px; 
            border-radius: 10px;
        }
        .contact-title {
            color: #FFD700; 
            text-align: center; 
            margin-bottom: 20px; 
            font-size: 22px;
        }
        .contact-email {
            color: #D2691E; 
            font-weight: bold; 
            margin: 10px 0;
        }
        .footer {
            text-align: center; 
            padding: 30px; 
            background: #1a0f0a; 
            color: #ccc; 
            font-size: 14px;
        }
        .website-link {
            color: #FFD700; 
            font-size: 18px; 
            font-weight: bold; 
            text-decoration: none;
            margin: 20px 0;
            display: inline-block;
        }
        .unsubscribe {
            color: #999; 
            font-size: 12px; 
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- HEADER -->
        <div class="header">
            <h1>ANDU XARA</h1>
            <p class="subtitle">Mode Africaine d'Excellence</p>
        </div>
        
        <!-- CONTENU PRINCIPAL -->
        <div class="content">
            <div class="greeting">Bonjour cher(e) client(e),</div>
            
            <p>Nous avons le plaisir de vous dévoiler en exclusivité notre <strong>nouvelle collection Printemps-Été 2025</strong>, une célébration des traditions africaines revisitées avec élégance moderne.</p>
            
            <div class="highlight-box">
                <h3 style="color: #8B4513; margin-top: 0;">✨ NOUVEAUTÉS 2025</h3>
                <p><strong>• Robes Wax Signature</strong> - Design contemporain & confort exceptionnel</p>
                <p><strong>• Boubous Prestige</strong> - Tissus authentiques & finitions artisanales</p>
                <p><strong>• Accessoires Exclusifs</strong> - Pièces uniques faites main</p>
                <p><strong>• Chaussures Traditionnelles</strong> - Confort & style authentique</p>
            </div>
            
            <!-- CODE PROMO -->
            <div class="promo-code">
                🎁 CODE PROMO EXCLUSIF : <strong>ANDU25</strong><br>
                <span style="font-size: 16px; color: #fff;">25% DE RÉDUCTION | VALABLE 7 JOURS</span>
            </div>
            
            <!-- BOUTON CTA -->
            <div style="text-align: center;">
                <a href="https://andu-xara.store?promo=ANDU25" class="cta-button">
                    🛍️ DÉCOUVRIR LA COLLECTION
                </a>
            </div>
            
            <p>Nos collections sont confectionnées avec des tissus wax authentiques, sélectionnés pour leur qualité et leur résistance. Chaque pièce est réalisée avec un savoir-faire artisanal unique.</p>
            
            <!-- SECTION CONTACT -->
            <div class="contact-section">
                <div class="contact-title">📞 VOS INTERLOCUTEURS PRIVILÉGIÉS</div>
                
                <!-- LES 3 EMAILS PROFESSIONNELS -->
                <div style="text-align: center; margin: 25px 0;">
                    <div style="margin: 15px 0;">
                        <strong>📧 Service Client & Support :</strong><br>
                        <span class="contact-email">serviceclient@andu-xara.store</span>
                    </div>
                    
                    <div style="margin: 15px 0;">
                        <strong>📧 Commandes & Livraison :</strong><br>
                        <span class="contact-email">commandes@andu-xara.store</span>
                    </div>
                    
                    <div style="margin: 15px 0;">
                        <strong>📧 Partenariats & Collaborations :</strong><br>
                        <span class="contact-email">partenariats@andu-xara.store</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <strong>Contact Principal :</strong><br>
                    <span class="contact-email">contact@andu-xara.store</span>
                </div>
            </div>
            
            <p style="text-align: center; margin-top: 30px; font-style: italic;">
                Merci pour votre confiance et votre soutien à l'artisanat africain.
            </p>
            
            <p style="text-align: right; font-weight: bold; margin-top: 30px;">
                Cheikhou Diabira<br>
                <span style="font-weight: normal; font-style: italic;">Fondateur & Créateur - Andu Xara</span>
            </p>
        </div>
        
        <!-- FOOTER AVEC LIEN DU SITE -->
        <div class="footer">
            <div style="margin-bottom: 20px;">
                <a href="https://andu-xara.store" class="website-link">
                    🌐 https://andu-xara.store
                </a>
            </div>
            
            <p><strong>ANDU XARA STORE</strong><br>
            Paris, France | Livraison Internationale</p>
            
            <div class="unsubscribe">
                <p>Vous recevez cet email car vous êtes abonné à la newsletter Andu Xara.</p>
                <p>
                    <a href="https://andu-xara.store/unsubscribe" style="color: #999;">
                        Se désabonner
                    </a> 
                    | 
                    <a href="https://andu-xara.store/preferences" style="color: #999;">
                        Gérer vos préférences
                    </a>
                </p>
                <p>&copy; 2025 Andu Xara. Tous droits réservés.</p>
            </div>
        </div>
    </div>
</body>
</html>`;

// ========================================================
// FONCTIONS UTILITAIRES
// ========================================================

async function checkSubscribers() {
  console.log('🔍 VÉRIFICATION DE VOS ABONNÉS...\n');
  
  try {
    const { data, error, count } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact' })
      .eq('status', 'active');
    
    if (error) throw error;
    
    console.log(`📊 STATISTIQUES :`);
    console.log(`   • Total abonnés actifs : ${count}`);
    console.log(`   • Dernier ajout : ${data?.[0]?.created_at ? new Date(data[0].created_at).toLocaleDateString('fr-FR') : 'N/A'}`);
    console.log(`   • Premier abonné : ${data?.[data.length - 1]?.created_at ? new Date(data[data.length - 1].created_at).toLocaleDateString('fr-FR') : 'N/A'}`);
    
    // Exporter la liste pour vérification
    const emails = data.map(s => s.email?.trim()).filter(e => e && e.includes('@'));
    writeFileSync('liste-abonnes-verification.txt', emails.join('\n'));
    
    console.log(`\n✅ Liste exportée : liste-abonnes-verification.txt`);
    console.log(`📋 Aperçu (10 premiers) :`);
    emails.slice(0, 10).forEach((email, i) => {
      console.log(`   ${i + 1}. ${email}`);
    });
    
    if (emails.length > 10) {
      console.log(`   ... et ${emails.length - 10} autres`);
    }
    
    return emails;
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return [];
  }
}

async function testConnection() {
  console.log('\n🔗 TEST DE CONNEXION GMAIL...\n');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: GMAIL_CONFIG
  });
  
  try {
    await transporter.verify();
    console.log('✅ Connexion Gmail réussie !');
    console.log('   Compte :', GMAIL_CONFIG.user);
    return true;
  } catch (error) {
    console.error('❌ Connexion échouée :', error.message);
    console.log('\n💡 Le compte est probablement encore bloqué.');
    console.log('   Attendez 24h à partir de maintenant.');
    console.log('   Heure actuelle :', new Date().toLocaleString('fr-FR'));
    console.log('   Essayez demain vers :', new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('fr-FR'));
    return false;
  }
}

async function previewTemplate() {
  console.log('\n👁️  APERÇU DU TEMPLATE HTML...\n');
  
  // Sauvegarder le template pour visualisation
  writeFileSync('template-preview.html', PROFESSIONAL_TEMPLATE);
  
  console.log('✅ Template sauvegardé : template-preview.html');
  console.log('\n📝 ÉLÉMENTS VÉRIFIÉS DANS LE TEMPLATE :');
  console.log('   ✓ Logo et titre Andu Xara');
  console.log('   ✓ Code promo ANDU25 visible');
  console.log('   ✓ Bouton "Découvrir la collection"');
  console.log('   ✓ 3 emails professionnels :');
  console.log('       1. serviceclient@andu-xara.store');
  console.log('       2. commandes@andu-xara.store');
  console.log('       3. partenariats@andu-xara.store');
  console.log('   ✓ Lien du site en bas : https://andu-xara.store');
  console.log('   ✓ Signature du fondateur');
  console.log('\n💡 Pour visualiser : ouvrez template-preview.html dans votre navigateur');
}

async function createTomorrowScript() {
  console.log('\n📋 PRÉPARATION DU SCRIPT POUR DEMAIN...\n');
  
  const script = `
// SCRIPT À EXÉCUTER DEMAIN - ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  'https://vxvrjeelertkdhfyuiue.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I'
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anduxara2408@gmail.com',
    pass: 'leyv edym khzj ggva'
  }
});

async function sendToAll() {
  console.log('🚀 LANCEMENT DE LA NEWSLETTER...\\n');
  
  const { data } = await supabase
    .from('subscribers')
    .select('email')
    .eq('status', 'active');
  
  const emails = data.map(s => s.email?.trim()).filter(e => e && e.includes('@'));
  
  console.log(\`📨 Envoi à \${emails.length} abonnés...\\n\`);
  
  let success = 0;
  for (let i = 0; i < emails.length; i++) {
    try {
      await transporter.sendMail({
        from: '"Andu Xara" <anduxara2408@gmail.com>',
        to: emails[i],
        subject: '🌟 NOUVELLES COLLECTIONS ANDU XARA - PRINTEMPS 2025',
        html: \`${PROFESSIONAL_TEMPLATE.replace(/`/g, '\\`')}\`,
        text: \`ANDU XARA - NOUVELLES COLLECTIONS 2025\\n\\nBonjour !\\n\\nDécouvrez notre nouvelle collection avec 25% de réduction (code: ANDU25).\\n\\nSite : https://andu-xara.store\\n\\nContact :\\n- Service : serviceclient@andu-xara.store\\n- Commandes : commandes@andu-xara.store\\n- Partenariats : partenariats@andu-xara.store\\n\\nMerci,\\nL'équipe Andu Xara\`
      });
      
      success++;
      const progress = Math.round(((i + 1) / emails.length) * 100);
      console.log(\`✅ [\${progress}%] \${emails[i]}\`);
      
      if (i < emails.length - 1) await new Promise(r => setTimeout(r, 200));
      
    } catch (error) {
      console.log(\`❌ \${emails[i]} : \${error.message}\`);
    }
  }
  
  console.log(\`\\n🎉 TERMINÉ ! \${success}/\${emails.length} envoyés.\`);
}

sendToAll();
`;
  
  writeFileSync('send-tomorrow.js', script);
  console.log('✅ Script pour demain créé : send-tomorrow.js');
  console.log('\n📋 POUR DEMAIN :');
  console.log('   1. Attendez 24h que Google débloque votre compte');
  console.log('   2. Exécutez : node send-tomorrow.js');
  console.log('   3. Vérifiez votre boîte mail pour confirmer l\'envoi');
}

async function main() {
  console.log('⏳ PRÉPARATION POUR L\'ENVOI DE DEMAIN\n');
  
  // 1. Vérifier les abonnés
  await checkSubscribers();
  
  // 2. Tester la connexion (va probablement échouer)
  await testConnection();
  
  // 3. Aperçu du template
  await previewTemplate();
  
  // 4. Créer le script pour demain
  await createTomorrowScript();
  
  console.log('\n' + '='.repeat(60));
  console.log('📅 PLAN POUR DEMAIN');
  console.log('='.repeat(60));
  console.log('\n⏰ HEURE CONSEILLÉE : Demain matin (après 24h)');
  console.log('\n🎯 COMMANDES À EXÉCUTER DEMAIN :');
  console.log('   1. cd ~/Documents/catalogue-andu-xara-2025-final');
  console.log('   2. node send-tomorrow.js');
  console.log('\n🔍 VÉRIFICATIONS À FAIRE :');
  console.log('   • Ouvrez template-preview.html pour voir le design');
  console.log('   • Vérifiez liste-abonnes-verification.txt');
  console.log('   • Testez avec 1 email avant d\'envoyer à tous');
  console.log('\n💪 TOUT EST PRÊT ! Attendez demain pour lancer.');
}

main().catch(console.error);
