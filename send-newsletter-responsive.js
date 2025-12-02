import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

console.log('\n' + '='.repeat(60));
console.log('📧 NEWSLETTER ANDU XARA - VERSION RESPONSIVE FINALE');
console.log('='.repeat(60) + '\n');

// Configuration
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

// ========================================================
// TEMPLATE RESPONSIVE AVEC BONNES URLs
// ========================================================

const RESPONSIVE_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Andu Xara - Votre offre de bienvenue</title>
    <style type="text/css">
        /* RESET POUR EMAIL */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        body {
            width: 100% !important;
            height: 100%;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f8f4f0;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.4;
            color: #333333;
        }
        
        /* CONTAINER PRINCIPAL RESPONSIVE */
        .email-wrapper {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        /* POUR MOBILE */
        @media only screen and (max-width: 620px) {
            .email-wrapper {
                width: 100% !important;
                max-width: 100% !important;
            }
            
            .content-cell {
                padding: 20px 15px !important;
            }
            
            .header-cell {
                padding: 30px 15px !important;
            }
            
            .footer-cell {
                padding: 25px 15px !important;
            }
            
            h1 {
                font-size: 28px !important;
                line-height: 1.2 !important;
            }
            
            h2 {
                font-size: 22px !important;
                line-height: 1.3 !important;
            }
            
            h3 {
                font-size: 18px !important;
                line-height: 1.3 !important;
            }
            
            .promo-code {
                font-size: 24px !important;
                padding: 15px !important;
            }
            
            .cta-button {
                padding: 14px 25px !important;
                font-size: 16px !important;
            }
            
            .contact-grid {
                display: block !important;
            }
            
            .contact-item {
                margin-bottom: 15px !important;
            }
            
            .phone-container {
                display: block !important;
                text-align: center !important;
            }
            
            .phone-item {
                margin-bottom: 15px !important;
                display: inline-block !important;
                width: 100% !important;
                max-width: 250px !important;
            }
        }
        
        /* POUR PETITS ÉCRANS */
        @media only screen and (max-width: 480px) {
            .email-wrapper {
                border-radius: 0 !important;
            }
            
            .promo-code {
                font-size: 20px !important;
                letter-spacing: 1px !important;
            }
            
            .cta-button {
                width: 90% !important;
                text-align: center !important;
            }
        }
        
        /* HEADER RESPONSIVE */
        .email-header {
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
        }
        
        .email-header h1 {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 10px;
            line-height: 1.2;
        }
        
        .email-header p {
            font-size: 18px;
            opacity: 0.95;
            font-weight: 300;
        }
        
        .welcome-badge {
            background-color: #FFD700;
            color: #8B4513;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin-top: 15px;
            font-size: 16px;
            border: 2px solid #ffffff;
        }
        
        /* CONTENU PRINCIPAL */
        .email-content {
            padding: 30px;
        }
        
        .greeting {
            color: #8B4513;
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        .welcome-text {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            color: #555555;
        }
        
        /* SECTION PROMO */
        .promo-section {
            background-color: #FFF8F0;
            border: 2px solid #D2691E;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        
        .promo-title {
            color: #8B4513;
            font-size: 24px;
            margin-bottom: 15px;
        }
        
        .promo-code {
            background-color: #8B4513;
            color: #FFD700;
            padding: 18px;
            border-radius: 8px;
            font-size: 28px;
            font-weight: 900;
            letter-spacing: 2px;
            margin: 15px 0;
            display: inline-block;
            border: 2px dashed #FFD700;
            font-family: 'Courier New', monospace;
        }
        
        .promo-details {
            font-size: 16px;
            color: #8B4513;
            font-weight: 600;
            line-height: 1.5;
        }
        
        /* BOUTON CTA RESPONSIVE */
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
            color: #ffffff;
            padding: 16px 35px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 700;
            font-size: 18px;
            margin: 20px 0;
            text-align: center;
            border: none;
        }
        
        /* SECTION CONTACT RESPONSIVE */
        .contact-section {
            background-color: #2C1810;
            color: #ffffff;
            padding: 25px;
            margin-top: 30px;
            border-radius: 12px;
        }
        
        .contact-title {
            color: #FFD700;
            text-align: center;
            font-size: 22px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .contact-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
        }
        
        .contact-item {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            flex: 1;
            min-width: 200px;
            text-align: center;
            border: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .contact-role {
            color: #FFD700;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        .contact-email {
            color: #D2691E;
            font-weight: bold;
            font-size: 14px;
            word-break: break-all;
        }
        
        /* SECTION TÉLÉPHONE RESPONSIVE */
        .phone-section {
            background-color: rgba(255, 215, 0, 0.1);
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .phone-title {
            color: #FFD700;
            text-align: center;
            font-size: 18px;
            margin-bottom: 15px;
        }
        
        .phone-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
        }
        
        .phone-item {
            text-align: center;
            padding: 15px;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            flex: 1;
            min-width: 180px;
        }
        
        .phone-country {
            color: #D2691E;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .phone-number {
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
        }
        
        /* FOOTER RESPONSIVE */
        .email-footer {
            background-color: #1a0f0a;
            color: #cccccc;
            padding: 25px;
            text-align: center;
        }
        
        .website-link {
            color: #FFD700;
            font-size: 20px;
            font-weight: bold;
            text-decoration: none;
            margin: 15px 0;
            display: inline-block;
            padding: 10px 15px;
            background-color: rgba(255, 215, 0, 0.1);
            border-radius: 6px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .store-info {
            margin: 15px 0;
            font-size: 14px;
            color: #aaaaaa;
        }
        
        .footer-links {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 13px;
        }
        
        .footer-links a {
            color: #D2691E;
            text-decoration: none;
            margin: 0 8px;
        }
        
        .copyright {
            font-size: 11px;
            color: #999999;
            margin-top: 15px;
        }
        
        /* POUR LES CLIENTS EMAIL */
        .ExternalClass {
            width: 100%;
        }
        
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
            line-height: 100%;
        }
        
        /* SUPPORT OUTLOOK */
        table {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        
        img {
            -ms-interpolation-mode: bicubic;
        }
        
        /* SUPPORT APPLE */
        .apple-links a {
            color: inherit !important;
            text-decoration: none !important;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f4f0;">
    <!--[if mso]>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
    <td style="background-color: #f8f4f0; padding: 20px;">
    <![endif]-->
    
    <div class="email-wrapper">
        <!-- HEADER -->
        <div class="email-header">
            <h1>ANDU XARA</h1>
            <p>Mode Africaine d'Excellence</p>
            <div class="welcome-badge">OFFRE DE BIENVENUE</div>
        </div>
        
        <!-- CONTENU PRINCIPAL -->
        <div class="email-content">
            <h2 class="greeting">Bonjour cher(e) client(e) 👋,</h2>
            
            <div class="welcome-text">
                <p>Nous sommes ravis de vous accueillir dans la communauté Andu Xara !</p>
                <p>Pour célébrer votre arrivée, nous vous offrons une <strong>offre exclusive de bienvenue</strong> valable sur toute notre collection.</p>
            </div>
            
            <!-- SECTION PROMO -->
            <div class="promo-section">
                <h3 class="promo-title">🎁 VOTRE CADEAU DE BIENVENUE</h3>
                
                <div class="promo-code">BIENVENU10</div>
                
                <div class="promo-details">
                    ✅ 10% DE RÉDUCTION sur votre première commande<br>
                    ✅ Valable sur toute la collection<br>
                    ✅ Sans minimum d'achat<br>
                    ✅ Offre réservée aux nouveaux membres
                </div>
                
                <p style="color: #8B4513; font-weight: 600; margin-top: 15px; font-size: 14px;">
                    ⏰ Offre valable 30 jours
                </p>
            </div>
            
            <!-- BOUTON PRINCIPAL -->
            <div style="text-align: center;">
                <a href="https://andu-xara.store?promo=BIENVENU10" class="cta-button">
                    🛍️ DÉCOUVRIR NOS COLLECTIONS
                </a>
            </div>
            
            <!-- SECTION CONTACT -->
            <div class="contact-section">
                <h3 class="contact-title">📞 CONTACTEZ-NOUS FACILEMENT</h3>
                
                <p style="text-align: center; margin-bottom: 20px; color: #cccccc; font-size: 15px;">
                    Notre équipe est à votre disposition pour toute question :
                </p>
                
                <div class="contact-grid">
                    <!-- EMAIL 1 -->
                    <div class="contact-item">
                        <div class="contact-role">📧 Contact Principal & Support</div>
                        <div class="contact-email">contact@andu-xara.store</div>
                    </div>
                    
                    <!-- EMAIL 2 -->
                    <div class="contact-item">
                        <div class="contact-role">📧 Assistance Technique</div>
                        <div class="contact-email">support@andu-xara.store</div>
                    </div>
                    
                    <!-- EMAIL 3 -->
                    <div class="contact-item">
                        <div class="contact-role">📧 Partenariats</div>
                        <div class="contact-email">partenariat@andu-xara.store</div>
                    </div>
                </div>
                
                <!-- SECTION TÉLÉPHONE -->
                <div class="phone-section">
                    <div class="phone-title">📱 APPELEZ-NOUS DIRECTEMENT</div>
                    
                    <div class="phone-container">
                        <!-- MAURITANIE -->
                        <div class="phone-item">
                            <div class="phone-country">🇲🇷 MAURITANIE</div>
                            <div class="phone-number">+222 34 19 63 04</div>
                        </div>
                        
                        <!-- SÉNÉGAL -->
                        <div class="phone-item">
                            <div class="phone-country">🇸🇳 SÉNÉGAL</div>
                            <div class="phone-number">+221 76 28 21 163</div>
                        </div>
                    </div>
                    
                    <p style="text-align: center; margin-top: 15px; color: #FFD700; font-size: 13px;">
                        Disponible du Lundi au Vendredi : 9h - 18h
                    </p>
                </div>
            </div>
            
            <!-- SIGNATURE -->
            <div style="text-align: right; margin-top: 30px; padding-top: 20px; border-top: 2px solid #F0E6DC;">
                <p style="color: #8B4513; font-weight: bold; font-size: 16px;">
                    Cheikhou Diabira<br>
                    <span style="font-weight: normal; font-style: italic; font-size: 14px;">
                        Fondateur - Andu Xara
                    </span>
                </p>
            </div>
        </div>
        
        <!-- FOOTER -->
        <div class="email-footer">
            <!-- LIEN DU SITE -->
            <div style="margin-bottom: 20px;">
                <a href="https://andu-xara.store" class="website-link">
                    🌐 VISITER NOTRE BOUTIQUE EN LIGNE
                </a>
            </div>
            
            <!-- INFORMATIONS -->
            <div class="store-info">
                <strong>ANDU XARA STORE</strong><br>
                Mode Africaine - Livraison Internationale<br>
                Mauritanie & Sénégal
            </div>
            
            <!-- LIENS IMPORTANTS -->
            <div class="footer-links">
                <!-- LIEN VERS CONDITIONS GÉNÉRALES -->
                <a href="https://andu-xara.store/conditions-generales.html">Conditions générales</a>
                <span style="color: #666666;">|</span>
                <a href="https://andu-xara.store/politique-confidentialite.html">Politique de confidentialité</a>
                <span style="color: #666666;">|</span>
                <a href="https://andu-xara.store/mentions-legales.html">Mentions légales</a>
                <span style="color: #666666;">|</span>
                <a href="https://andu-xara.store/unsubscribe">Se désabonner</a>
            </div>
            
            <!-- COPYRIGHT -->
            <div class="copyright">
                © 2025 Andu Xara. Tous droits réservés.<br>
                Cet email a été envoyé à votre demande d'inscription à notre newsletter.
            </div>
        </div>
    </div>
    
    <!--[if mso]>
    </td>
    </tr>
    </table>
    <![endif]-->
</body>
</html>`;

// ========================================================
// FONCTION D'ENVOI
// ========================================================

async function sendResponsiveNewsletter() {
  try {
    console.log('1. 📥 Récupération des abonnés...');
    
    const { data } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active');
    
    if (!data || data.length === 0) {
      console.log('❌ Aucun abonné trouvé');
      return;
    }
    
    const emails = data.map(s => s.email?.trim()).filter(e => e && e.includes('@'));
    
    console.log(`✅ ${emails.length} abonnés trouvés\n`);
    
    // Afficher les améliorations
    console.log('✨ AMÉLIORATIONS APPLIQUÉES :');
    console.log('-------------------------------');
    console.log('✅ Design RESPONSIVE pour téléphones');
    console.log('✅ Liens vers pages légales :');
    console.log('   • https://andu-xara.store/conditions-generales.html');
    console.log('   • https://andu-xara.store/politique-confidentialite.html');
    console.log('   • https://andu-xara.store/mentions-legales.html');
    console.log('✅ Compatibilité Outlook/Apple Mail');
    console.log('✅ Code promo : BIENVENU10');
    console.log('✅ 3 emails professionnels');
    console.log('✅ Numéros Mauritanie/Sénégal');
    console.log('');
    
    // Demander confirmation
    console.log('='.repeat(60));
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question(`\n📨 Envoyer la newsletter RESPONSIVE à ${emails.length} abonnés ? (oui/non/test): `, resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() === 'non') {
      console.log('❌ Annulé');
      return;
    }
    
    const isTest = answer.toLowerCase() === 'test';
    const emailsToSend = isTest ? emails.slice(0, 3) : emails;
    
    console.log(`\n🎯 ${isTest ? 'MODE TEST - 3 emails' : 'MODE COMPLET - ' + emailsToSend.length + ' emails'}`);
    console.log('='.repeat(60) + '\n');
    
    // Tester la connexion
    console.log('🔍 Test connexion Gmail...');
    await transporter.verify();
    console.log('✅ Connexion OK\n');
    
    // Envoyer
    let success = 0;
    const errors = [];
    
    console.log('📨 ENVOI EN COURS...\n');
    
    for (let i = 0; i < emailsToSend.length; i++) {
      try {
        await transporter.sendMail({
          from: '"Andu Xara" <anduxara2408@gmail.com>',
          to: emailsToSend[i],
          subject: '🎁 BIENVENUE CHEZ ANDU XARA - Votre offre exclusive BIENVENU10',
          html: RESPONSIVE_TEMPLATE,
          text: `BIENVENUE CHEZ ANDU XARA !

Bonjour !

Nous sommes ravis de vous accueillir dans notre communauté.

VOTRE CADEAU DE BIENVENUE :
Code promo : BIENVENU10
10% de réduction sur votre première commande

Visitez notre boutique :
https://andu-xara.store?promo=BIENVENU10

📞 NOS COORDONNÉES :

📧 Emails professionnels :
• Contact & Support : contact@andu-xara.store
• Assistance technique : support@andu-xara.store
• Partenariats : partenariat@andu-xara.store

📱 Téléphones :
🇲🇷 Mauritanie : +222 34 19 63 04
🇸🇳 Sénégal : +221 76 28 21 163

📄 Informations légales :
• Conditions générales : https://andu-xara.store/conditions-generales.html
• Politique de confidentialité : https://andu-xara.store/politique-confidentialite.html
• Mentions légales : https://andu-xara.store/mentions-legales.html
• Se désabonner : https://andu-xara.store/unsubscribe

Merci pour votre confiance,

Cheikhou Diabira
Fondateur - Andu Xara

🌐 Site : https://andu-xara.store`
        });
        
        success++;
        const progress = Math.round(((i + 1) / emailsToSend.length) * 100);
        console.log(`✅ [${progress}%] ${emailsToSend[i]}`);
        
        if (!isTest && i < emailsToSend.length - 1) {
          await new Promise(r => setTimeout(r, 200));
        }
        
      } catch (error) {
        errors.push({ email: emailsToSend[i], error: error.message });
        console.log(`❌ ${emailsToSend[i]} : ${error.message}`);
      }
    }
    
    // Résultat
    console.log(`\n🎉 TERMINÉ ! ${success}/${emailsToSend.length} envoyés.`);
    
    if (errors.length > 0) {
      console.log('\n🔍 ERREURS :');
      errors.forEach(err => {
        console.log(`   • ${err.email} : ${err.error}`);
      });
    }
    
    if (isTest && success > 0) {
      console.log('\n💡 TEST RÉUSSI ! Pour envoyer à tous :');
      console.log('   Répondez "oui" au lieu de "test"');
      
      console.log('\n📱 CONSEIL :');
      console.log('   Ouvrez l\'email sur votre téléphone pour vérifier');
      console.log('   que le design s\'adapte correctement.');
    }
    
    // Sauvegarder un rapport
    const fs = await import('fs');
    const report = {
      date: new Date().toISOString(),
      version: "Responsive Finale",
      total_emails: emailsToSend.length,
      success: success,
      failed: errors.length,
      responsive: true,
      legal_links: [
        "https://andu-xara.store/conditions-generales.html",
        "https://andu-xara.store/politique-confidentialite.html", 
        "https://andu-xara.store/mentions-legales.html"
      ],
      promo_code: "BIENVENU10"
    };
    
    fs.writeFileSync(
      `newsletter-responsive-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
    
    console.log(`\n📝 Rapport sauvegardé : newsletter-responsive-${Date.now()}.json`);
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

sendResponsiveNewsletter();
