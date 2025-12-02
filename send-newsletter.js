require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// ============================================================================
// CONFIGURATION
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('📧 ENVOI NEWSLETTER ANDU XARA - 55 ABONNÉS');
console.log('='.repeat(60) + '\n');

// Configuration Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Configuration SMTP Amen.fr
const transporter = nodemailer.createTransport({
  host: 'smtp.amen.fr',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@andu-xara.store',
    pass: 'Adx.store@ContactCLIENT'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

// Nettoyer un email (enlever espaces, retours à la ligne)
function cleanEmail(email) {
  if (!email) return '';
  return email.toString()
    .replace(/\s+/g, ' ')  // Remplacer tous les espaces multiples par un seul
    .replace(/\n/g, '')    // Enlever les retours à la ligne
    .replace(/\r/g, '')    // Enlever les retours chariot
    .trim()                // Enlever les espaces au début/fin
    .toLowerCase();        // Mettre en minuscule
}

// Vérifier si un email est valide
function isValidEmail(email) {
  const clean = cleanEmail(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(clean);
}

async function getAllSubscribers() {
  console.log('📥 Récupération des 55 abonnés depuis Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('id, email, created_at, status, source')
      .eq('status', 'active')  // Seulement les actifs
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Supabase: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️  Aucun abonné actif trouvé');
      return [];
    }
    
    console.log(`📊 ${data.length} abonnés actifs trouvés`);
    
    // Nettoyer et valider les emails
    const validSubscribers = data.map(sub => {
      const clean = cleanEmail(sub.email);
      const valid = isValidEmail(clean);
      
      return {
        id: sub.id,
        originalEmail: sub.email,
        cleanEmail: clean,
        isValid: valid,
        created_at: sub.created_at,
        source: sub.source
      };
    }).filter(sub => sub.isValid);
    
    console.log(`✅ ${validSubscribers.length} emails valides après nettoyage`);
    
    // Afficher les emails invalides
    const invalidCount = data.length - validSubscribers.length;
    if (invalidCount > 0) {
      console.log(`⚠️  ${invalidCount} emails invalides ignorés:`);
      data.filter(sub => !isValidEmail(cleanEmail(sub.email)))
        .forEach(sub => console.log(`   - "${sub.email}"`));
    }
    
    return validSubscribers;
    
  } catch (error) {
    console.error(`💥 Erreur: ${error.message}`);
    return [];
  }
}

function createNewsletterContent(email) {
  // Extraire le nom à partir de l'email (avant le @)
  const username = email.split('@')[0] || 'client';
  const name = username.charAt(0).toUpperCase() + username.slice(1);
  
  return {
    subject: '🌟 Nouveautés Andu Xara - Collection Exclusive Printemps 2025',
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Andu Xara - Votre Style Africain</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8f4f0; padding: 20px; }
        .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(139, 69, 19, 0.1); }
        .header { background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { font-size: 36px; margin-bottom: 10px; font-weight: 700; letter-spacing: 1px; }
        .header .tagline { font-size: 18px; opacity: 0.9; font-weight: 300; }
        .logo { font-size: 48px; margin-bottom: 20px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #8B4513; margin-bottom: 25px; font-weight: 600; }
        .section { margin-bottom: 30px; }
        .section-title { color: #8B4513; border-bottom: 2px solid #F0E6DC; padding-bottom: 10px; margin-bottom: 15px; font-size: 22px; }
        .product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
        .product-card { background: #FFF8F0; border-radius: 10px; padding: 15px; text-align: center; border: 1px solid #F0E6DC; }
        .product-emoji { font-size: 32px; margin-bottom: 10px; }
        .product-name { font-weight: 600; color: #8B4513; margin-bottom: 5px; }
        .promo-box { background: linear-gradient(135deg, #FFEBCD 0%, #FFF8DC 100%); border: 2px dashed #D2691E; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0; }
        .promo-code { font-size: 28px; font-weight: 700; color: #8B4513; letter-spacing: 2px; margin: 10px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px; margin: 25px 0; transition: transform 0.3s; }
        .cta-button:hover { transform: translateY(-2px); }
        .footer { background: #2C1810; color: white; padding: 30px; text-align: center; }
        .contact-info { margin: 20px 0; }
        .social-links a { color: #D2691E; margin: 0 15px; text-decoration: none; font-weight: 600; }
        .unsubscribe { font-size: 12px; color: #999; margin-top: 25px; }
        .highlight { color: #D2691E; font-weight: 700; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">👑</div>
            <h1>ANDU XARA</h1>
            <p class="tagline">L'Excellence de la Mode Africaine</p>
        </div>
        
        <div class="content">
            <div class="greeting">Bonjour ${name},</div>
            
            <p>Nous avons le plaisir de vous dévoiler en avant-première notre <span class="highlight">nouvelle collection Printemps-Été 2025</span>, une fusion parfaite entre tradition africaine et design contemporain.</p>
            
            <div class="section">
                <h2 class="section-title">✨ Nos Nouveautés</h2>
                <div class="product-grid">
                    <div class="product-card">
                        <div class="product-emoji">👗</div>
                        <div class="product-name">Robes Wax</div>
                        <p>Élégantes & modernes</p>
                    </div>
                    <div class="product-card">
                        <div class="product-emoji">👔</div>
                        <div class="product-name">Boubous</div>
                        <p>Confort & prestige</p>
                    </div>
                    <div class="product-card">
                        <div class="product-emoji">👜</div>
                        <div class="product-name">Sacs</div>
                        <p>Artisanaux & uniques</p>
                    </div>
                    <div class="product-card">
                        <div class="product-emoji">👟</div>
                        <div class="product-name">Chaussures</div>
                        <p>Style & confort</p>
                    </div>
                </div>
            </div>
            
            <div class="promo-box">
                <h3>🎁 OFFRE SPÉCIALE ABONNÉ</h3>
                <p>Pour vous remercier de votre fidélité, profitez de :</p>
                <div class="promo-code">ANDU25</div>
                <p><strong>25% DE RÉDUCTION</strong> sur votre première commande de la nouvelle collection</p>
                <p><em>Valable jusqu'au 15 décembre 2025</em></p>
            </div>
            
            <div style="text-align: center;">
                <a href="https://andu-xara.store?promo=ANDU25" class="cta-button">
                    🛍️ DÉCOUVRIR LA COLLECTION
                </a>
            </div>
            
            <div class="section">
                <h2 class="section-title">⭐ Pourquoi choisir Andu Xara ?</h2>
                <ul style="margin-left: 20px; margin-top: 15px;">
                    <li>✅ <strong>Qualité premium</strong> - Tissus authentiques wax</li>
                    <li>✅ <strong>Confection artisanale</strong> - Sur mesure possible</li>
                    <li>✅ <strong>Livraison rapide</strong> - 2-5 jours en France</li>
                    <li>✅ <strong>Retours faciles</strong> - 30 jours pour changer d'avis</li>
                    <li>✅ <strong>Service client</strong> - Disponible 7j/7</li>
                </ul>
            </div>
            
            <p style="margin-top: 25px;">Nous sommes impatients de vous voir arborer nos créations avec élégance et fierté.</p>
            
            <p style="margin-top: 20px;">
                Avec toute notre considération,<br>
                <strong>Cheikhou Diabira</strong><br>
                <em>Fondateur & Créateur - Andu Xara</em>
            </p>
        </div>
        
        <div class="footer">
            <div class="contact-info">
                <p><strong>ANDU XARA STORE</strong></p>
                <p>📍 Paris, France</p>
                <p>✉️ contact@andu-xara.store</p>
                <p>🌐 <a href="https://andu-xara.store" style="color: #D2691E;">andu-xara.store</a></p>
            </div>
            
            <div class="social-links">
                <a href="https://andu-xara.store">Site Web</a> •
                <a href="mailto:contact@andu-xara.store">Email</a> •
                <a href="tel:+33123456789">Téléphone</a>
            </div>
            
            <div class="unsubscribe">
                <p>Vous recevez cet email car vous êtes abonné à la newsletter Andu Xara.</p>
                <p><a href="https://andu-xara.store/unsubscribe?email=${encodeURIComponent(email)}" style="color: #999;">Se désabonner</a></p>
                <p style="font-size: 10px; margin-top: 10px;">© 2025 Andu Xara. Tous droits réservés.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `
  };
}

async function sendEmails() {
  try {
    // 1. Récupérer tous les abonnés
    const subscribers = await getAllSubscribers();
    
    if (subscribers.length === 0) {
      console.log('\n❌ Aucun email valide à envoyer');
      return;
    }
    
    console.log(`\n🎯 PRÊT À ENVOYER À ${subscribers.length} ABONNÉS`);
    console.log('-'.repeat(40));
    
    // 2. Demander confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = (query) => new Promise(resolve => {
      readline.question(query, answer => resolve(answer));
    });
    
    const response = await question(`\nVoulez-vous envoyer les emails maintenant ? (oui/non/test): `);
    
    if (response.toLowerCase() === 'non') {
      console.log('❌ Opération annulée');
      readline.close();
      return;
    }
    
    const isTestMode = response.toLowerCase() === 'test';
    
    if (isTestMode) {
      console.log('\n🧪 MODE TEST - Envoi à 2 emails seulement\n');
    } else {
      console.log('\n🚀 LANCEMENT DE L\'ENVOI EN MASSE\n');
    }
    
    readline.close();
    
    // 3. Tester la connexion SMTP
    console.log('🔍 Test connexion SMTP...');
    try {
      await transporter.verify();
      console.log('✅ Connexion SMTP OK\n');
    } catch (error) {
      console.error(`❌ Erreur SMTP: ${error.message}`);
      return;
    }
    
    // 4. Envoyer les emails
    const emailsToSend = isTestMode ? subscribers.slice(0, 2) : subscribers;
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    console.log('📨 ENVOI EN COURS...');
    console.log('='.repeat(60));
    
    for (let i = 0; i < emailsToSend.length; i++) {
      const subscriber = emailsToSend[i];
      const progress = Math.round(((i + 1) / emailsToSend.length) * 100);
      
      try {
        const content = createNewsletterContent(subscriber.cleanEmail);
        
        const mailOptions = {
          from: '"Andu Xara" <contact@andu-xara.store>',
          to: subscriber.cleanEmail,
          subject: content.subject,
          html: content.html,
          text: `Bonjour,\n\nDécouvrez notre nouvelle collection Andu Xara !\nProfitez de 25% avec le code ANDU25\nSite: https://andu-xara.store\n\nMerci,\nL'équipe Andu Xara`
        };
        
        await transporter.sendMail(mailOptions);
        
        successCount++;
        console.log(`✅ [${progress}%] ${subscriber.cleanEmail}`);
        
        // Pause de 200ms entre chaque email pour éviter le spam
        if (!isTestMode && i < emailsToSend.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
      } catch (error) {
        errorCount++;
        errors.push({
          email: subscriber.cleanEmail,
          error: error.message
        });
        console.error(`❌ [${progress}%] ${subscriber.cleanEmail}: ${error.message}`);
      }
    }
    
    // 5. Afficher le rapport
    console.log('\n' + '='.repeat(60));
    console.log('📈 RAPPORT FINAL');
    console.log('='.repeat(60));
    console.log(`\n✅ Emails envoyés avec succès: ${successCount}`);
    console.log(`❌ Échecs d'envoi: ${errorCount}`);
    console.log(`📊 Total traité: ${emailsToSend.length}`);
    
    if (isTestMode && successCount > 0) {
      console.log('\n💡 CONSEIL: Test réussi ! Pour envoyer à tous les abonnés:');
      console.log('   node send-newsletter.js --all');
    }
    
    if (errors.length > 0) {
      console.log('\n🔍 DÉTAILS DES ERREURS:');
      errors.forEach((err, index) => {
        console.log(`   ${index + 1}. ${err.email}`);
        console.log(`      → ${err.error}\n`);
      });
    }
    
    console.log('\n🎉 Opération terminée !\n');
    
  } catch (error) {
    console.error(`\n💥 ERREUR CRITIQUE: ${error.message}`);
    console.error(error.stack);
  }
}

// ============================================================================
// EXÉCUTION
// ============================================================================

// Gérer les arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes('--test') || args.includes('-t')) {
  process.argv.push('test');
  sendEmails();
} else if (args.includes('--all') || args.includes('-a')) {
  process.argv.push('all');
  sendEmails();
} else {
  console.log('📖 MODE D\'EMPLOI:');
  console.log('----------------');
  console.log('  --test ou -t   : Envoyer à 2 emails (test)');
  console.log('  --all ou -a    : Envoyer à tous les abonnés');
  console.log('\n  Sans argument  : Mode interactif');
  console.log('\nExemples:');
  console.log('  node send-newsletter.js --test');
  console.log('  node send-newsletter.js --all');
  console.log('');
  
  // Lancer le mode interactif
  sendEmails();
}
