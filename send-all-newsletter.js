import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Configuration Supabase
const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration Gmail (qui fonctionne déjà)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cheikhdiabira2408@gmail.com', // Votre email Gmail
    pass: 'bccu xlwg gsoh cdni' // Votre mot de passe d'application Gmail
  }
});

async function sendNewsletterToAll() {
  console.log('='.repeat(60));
  console.log('📧 ENVOI NEWSLETTER À TOUS LES ABONNÉS');
  console.log('='.repeat(60));
  console.log('\n🚀 Démarrage...\n');
  
  try {
    // 1. Récupérer TOUS les abonnés actifs
    console.log('📥 Récupération des abonnés...');
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Erreur Supabase:', error.message);
      return;
    }
    
    if (!subscribers || subscribers.length === 0) {
      console.log('❌ Aucun abonné trouvé');
      return;
    }
    
    console.log(`✅ ${subscribers.length} abonnés trouvés\n`);
    
    // 2. Nettoyer les emails
    const cleanSubscribers = subscribers.map(sub => ({
      ...sub,
      email: sub.email ? sub.email.trim().replace(/\s+/g, ' ') : ''
    })).filter(sub => sub.email && sub.email.includes('@'));
    
    console.log(`📊 ${cleanSubscribers.length} emails valides après nettoyage\n`);
    
    // 3. Afficher un aperçu
    console.log('📋 APERÇU DES 5 PREMIERS EMAILS:');
    cleanSubscribers.slice(0, 5).forEach((sub, i) => {
      console.log(`   ${i + 1}. ${sub.email}`);
    });
    if (cleanSubscribers.length > 5) {
      console.log(`   ... et ${cleanSubscribers.length - 5} autres`);
    }
    
    // 4. Demander confirmation
    console.log('\n' + '='.repeat(60));
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question(`\n⚠️  Envoyer à ${cleanSubscribers.length} abonnés ? (oui/non/test): `, resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() === 'non') {
      console.log('❌ Opération annulée');
      return;
    }
    
    const isTestMode = answer.toLowerCase() === 'test';
    const emailsToSend = isTestMode ? cleanSubscribers.slice(0, 2) : cleanSubscribers;
    
    console.log(`\n🎯 ${isTestMode ? 'MODE TEST - 2 emails' : 'MODE COMPLET - ' + emailsToSend.length + ' emails'}`);
    console.log('='.repeat(60) + '\n');
    
    // 5. Préparer le contenu de la newsletter
    const newsletterHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #8B4513; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; }
        .btn { display: inline-block; background: #8B4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
        .promo { background: #FFEBCD; padding: 15px; border-left: 4px solid #D2691E; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ANDU XARA</h1>
        <p>Mode Africaine d'Excellence</p>
    </div>
    
    <div class="content">
        <h2>Bonjour cher client ! 👋</h2>
        
        <p>Nous sommes ravis de vous présenter nos nouvelles collections 2025, inspirées des traditions africaines modernisées.</p>
        
        <div class="promo">
            <h3>🎁 OFFRE EXCLUSIVE</h3>
            <p>Profitez de <strong>25% de réduction</strong> avec le code :</p>
            <h2 style="color: #8B4513;">ANDU25</h2>
            <p>Valable sur toute la collection</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://andu-xara.store" class="btn">🛍️ Découvrir la collection</a>
        </div>
        
        <p><strong>Nos spécialités :</strong></p>
        <ul>
            <li>👗 Robes traditionnelles modernes</li>
            <li>👔 Boubous et tenues élégantes</li>
            <li>👜 Accessoires artisanaux</li>
            <li>👟 Chaussures confortables</li>
        </ul>
        
        <p>Livraison rapide en France et Europe.</p>
        
        <p>Avec toute notre gratitude,<br>
        <strong>L'équipe Andu Xara</strong></p>
    </div>
    
    <div class="footer">
        <p>ANDU XARA STORE<br>
        contact@andu-xara.store<br>
        https://andu-xara.store</p>
        <p style="font-size: 12px; color: #ccc;">
            Vous recevez cet email car vous êtes abonné à notre newsletter.<br>
            <a href="https://andu-xara.store/unsubscribe" style="color: #ccc;">Se désabonner</a>
        </p>
    </div>
</body>
</html>
    `;
    
    const newsletterText = `Bonjour !

Découvrez les nouvelles collections Andu Xara 2025.
Profitez de 25% avec le code ANDU25.

Site : https://andu-xara.store

Cordialement,
L'équipe Andu Xara`;
    
    // 6. Envoyer les emails
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    console.log('📨 ENVOI EN COURS...\n');
    
    for (let i = 0; i < emailsToSend.length; i++) {
      const subscriber = emailsToSend[i];
      const progress = Math.round(((i + 1) / emailsToSend.length) * 100);
      
      try {
        const mailOptions = {
          from: '"Andu Xara" <cheikhdiabira2408@gmail.com>',
          to: subscriber.email,
          subject: '🌟 Nouveautés Andu Xara - Collection 2025',
          html: newsletterHTML,
          text: newsletterText
        };
        
        const info = await transporter.sendMail(mailOptions);
        
        successCount++;
        console.log(`✅ [${progress}%] ${subscriber.email}`);
        
        // Pause pour éviter le spam (100ms entre chaque email)
        if (!isTestMode && i < emailsToSend.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        errorCount++;
        errors.push({
          email: subscriber.email,
          error: error.message
        });
        console.error(`❌ [${progress}%] ${subscriber.email}: ${error.message}`);
      }
    }
    
    // 7. Afficher le rapport
    console.log('\n' + '='.repeat(60));
    console.log('📈 RAPPORT FINAL');
    console.log('='.repeat(60));
    console.log(`\n✅ Succès: ${successCount}`);
    console.log(`❌ Échecs: ${errorCount}`);
    console.log(`📊 Total: ${emailsToSend.length}`);
    
    if (isTestMode && successCount > 0) {
      console.log('\n💡 TEST RÉUSSI ! Pour envoyer à tous :');
      console.log('   node send-all-newsletter.js --all');
    }
    
    if (errors.length > 0) {
      console.log('\n🔍 ERREURS DÉTAILLÉES :');
      errors.forEach(err => {
        console.log(`   • ${err.email}: ${err.error}`);
      });
    }
    
    // 8. Sauvegarder un log
    const log = {
      date: new Date().toISOString(),
      mode: isTestMode ? 'test' : 'complete',
      total: emailsToSend.length,
      success: successCount,
      errors: errorCount,
      errorDetails: errors
    };
    
    const fs = await import('fs');
    fs.writeFileSync(
      `newsletter-log-${Date.now()}.json`,
      JSON.stringify(log, null, 2)
    );
    
    console.log(`\n📝 Log sauvegardé : newsletter-log-${Date.now()}.json`);
    console.log('\n🎉 OPÉRATION TERMINÉE !\n');
    
  } catch (error) {
    console.error('\n💥 ERREUR CRITIQUE :', error.message);
    console.error(error.stack);
  }
}

// Import dynamique de readline pour ES module
import('readline').then(async (readlineModule) => {
  const readline = readlineModule.default;
  await sendNewsletterToAll();
}).catch(console.error);
