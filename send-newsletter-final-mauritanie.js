import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

console.log('\n' + '='.repeat(60));
console.log('📧 NEWSLETTER ANDU XARA - VERSION MAURITANIE/SÉNÉGAL');
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
// TEMPLATE FINAL AVEC VOS VRAIES INFORMATIONS
// ========================================================

const FINAL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Andu Xara - Mode Africaine Excellence</title>
    <style>
        /* RESET ET BASE */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #f8f4f0; 
            font-family: 'Arial', 'Helvetica Neue', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            padding: 20px; 
        }
        
        /* CONTAINER PRINCIPAL */
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(139, 69, 19, 0.15);
        }
        
        /* HEADER */
        .email-header {
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            position: relative;
        }
        
        .email-header h1 {
            font-size: 42px;
            font-weight: 800;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        
        .email-header .slogan {
            font-size: 20px;
            opacity: 0.95;
            font-weight: 300;
        }
        
        .badge-promo {
            background: #FFD700;
            color: #8B4513;
            padding: 8px 25px;
            border-radius: 25px;
            font-weight: bold;
            display: inline-block;
            margin-top: 20px;
            font-size: 18px;
            border: 2px solid white;
        }
        
        /* CONTENU PRINCIPAL */
        .email-content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            color: #8B4513;
            margin-bottom: 25px;
            font-weight: 600;
        }
        
        .intro-text {
            font-size: 18px;
            margin-bottom: 30px;
            color: #555;
        }
        
        /* SECTION PROMO */
        .promo-section {
            background: linear-gradient(135deg, #FFF8F0 0%, #FFEBCD 100%);
            border: 3px solid #D2691E;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        
        .promo-title {
            color: #8B4513;
            font-size: 28px;
            margin-bottom: 15px;
        }
        
        .code-promo {
            background: #8B4513;
            color: #FFD700;
            padding: 20px;
            border-radius: 10px;
            font-size: 36px;
            font-weight: 900;
            letter-spacing: 3px;
            margin: 20px 0;
            display: inline-block;
            border: 3px dashed #FFD700;
            font-family: 'Courier New', monospace;
        }
        
        .promo-details {
            font-size: 18px;
            color: #8B4513;
            font-weight: 600;
            margin: 15px 0;
        }
        
        /* BOUTON */
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
            color: white;
            padding: 18px 45px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 700;
            font-size: 20px;
            margin: 25px 0;
            transition: all 0.3s;
            box-shadow: 0 6px 20px rgba(139, 69, 19, 0.3);
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(139, 69, 19, 0.4);
        }
        
        /* SECTION CONTACT AVEC VOS VRAIES INFOS */
        .contact-section {
            background: #2C1810;
            color: white;
            padding: 35px;
            margin-top: 40px;
            border-radius: 15px;
        }
        
        .contact-title {
            color: #FFD700;
            text-align: center;
            margin-bottom: 25px;
            font-size: 24px;
            font-weight: 600;
        }
        
        /* VOS 3 EMAILS PROFESSIONNELS */
        .emails-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        
        .email-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .email-item .role {
            color: #FFD700;
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .email-item .address {
            color: #D2691E;
            font-weight: bold;
            font-size: 16px;
            word-break: break-all;
        }
        
        /* VOS NUMÉROS DE TÉLÉPHONE */
        .phones-section {
            background: rgba(255, 215, 0, 0.1);
            padding: 25px;
            border-radius: 10px;
            margin-top: 25px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .phones-title {
            color: #FFD700;
            text-align: center;
            margin-bottom: 20px;
            font-size: 20px;
        }
        
        .phone-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            text-align: center;
        }
        
        .phone-item {
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
        }
        
        .country {
            color: #D2691E;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 5px;
        }
        
        .number {
            color: white;
            font-size: 20px;
            font-weight: 600;
        }
        
        /* FOOTER */
        .email-footer {
            text-align: center;
            padding: 30px;
            background: #1a0f0a;
            color: #ccc;
        }
        
        .site-link {
            color: #FFD700;
            font-size: 22px;
            font-weight: bold;
            text-decoration: none;
            margin: 20px 0;
            display: inline-block;
            padding: 10px 20px;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .location {
            margin: 20px 0;
            font-size: 16px;
            color: #aaa;
        }
        
        .unsubscribe {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 14px;
        }
        
        .unsubscribe a {
            color: #D2691E;
            text-decoration: none;
            margin: 0 10px;
        }
        
        .copyright {
            font-size: 12px;
            color: #999;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- HEADER -->
        <div class="email-header">
            <h1>ANDU XARA</h1>
            <p class="slogan">Mode Africaine d'Excellence</p>
            <div class="badge-promo">OFFRE DE BIENVENUE</div>
        </div>
        
        <!-- CONTENU -->
        <div class="email-content">
            <div class="greeting">Bonjour cher(e) client(e) 👋,</div>
            
            <div class="intro-text">
                <p>Nous sommes ravis de vous accueillir dans la communauté Andu Xara !</p>
                <p>Pour célébrer votre arrivée, nous vous offrons une <strong>offre exclusive de bienvenue</strong> valable sur toute notre collection.</p>
            </div>
            
            <!-- SECTION PROMO BIENVENU10 -->
            <div class="promo-section">
                <h2 class="promo-title">🎁 VOTRE CADEAU DE BIENVENUE</h2>
                
                <div class="code-promo">BIENVENU10</div>
                
                <div class="promo-details">
                    ✅ 10% DE RÉDUCTION sur votre première commande<br>
                    ✅ Valable sur toute la collection<br>
                    ✅ Sans minimum d'achat<br>
                    ✅ Offre réservée aux nouveaux membres
                </div>
                
                <p style="color: #8B4513; font-weight: 600; margin-top: 15px;">
                    ⏰ Offre valable 30 jours
                </p>
            </div>
            
            <!-- BOUTON PRINCIPAL -->
            <div style="text-align: center;">
                <a href="https://andu-xara.store?promo=BIENVENU10" class="cta-button">
                    🛍️ DÉCOUVRIR NOS COLLECTIONS
                </a>
            </div>
            
            <!-- VOS 3 EMAILS PROFESSIONNELS -->
            <div class="contact-section">
                <div class="contact-title">📞 CONTACTEZ-NOUS FACILEMENT</div>
                
                <p style="text-align: center; margin-bottom: 25px; color: #ccc;">
                    Notre équipe est à votre disposition pour toute question :
                </p>
                
                <div class="emails-list">
                    <!-- EMAIL 1 : Contact Principal -->
                    <div class="email-item">
                        <div class="role">📧 Contact Principal & Support</div>
                        <div class="address">contact@andu-xara.store</div>
                    </div>
                    
                    <!-- EMAIL 2 : Support -->
                    <div class="email-item">
                        <div class="role">📧 Support Client & Assistance</div>
                        <div class="address">support@andu-xara.store</div>
                    </div>
                    
                    <!-- EMAIL 3 : Partenariat -->
                    <div class="email-item">
                        <div class="role">📧 Partenariats & Collaborations</div>
                        <div class="address">partenariat@andu-xara.store</div>
                    </div>
                </div>
                
                <!-- VOS NUMÉROS DE TÉLÉPHONE -->
                <div class="phones-section">
                    <div class="phones-title">📱 APPELEZ-NOUS DIRECTEMENT</div>
                    
                    <div class="phone-grid">
                        <!-- MAURITANIE -->
                        <div class="phone-item">
                            <div class="country">🇲🇷 MAURITANIE</div>
                            <div class="number">+222 34 19 63 04</div>
                        </div>
                        
                        <!-- SÉNÉGAL -->
                        <div class="phone-item">
                            <div class="country">🇸🇳 SÉNÉGAL</div>
                            <div class="number">+221 76 28 21 163</div>
                        </div>
                    </div>
                    
                    <p style="text-align: center; margin-top: 15px; color: #FFD700; font-size: 14px;">
                        Disponible du Lundi au Vendredi : 9h - 18h
                    </p>
                </div>
                
                <p style="text-align: center; margin-top: 25px; color: #aaa; font-size: 16px;">
                    <strong>⚠️ IMPORTANT :</strong> Pour les commandes et questions techniques,<br>
                    utilisez nos adresses email professionnelles ci-dessus.
                </p>
            </div>
            
            <!-- SIGNATURE -->
            <div style="text-align: right; margin-top: 40px; padding-top: 20px; border-top: 2px solid #F0E6DC;">
                <p style="color: #8B4513; font-weight: bold; font-size: 18px;">
                    Cheikhou Diabira<br>
                    <span style="font-weight: normal; font-style: italic; font-size: 16px;">
                        Fondateur - Andu Xara
                    </span>
                </p>
            </div>
        </div>
        
        <!-- FOOTER -->
        <div class="email-footer">
            <!-- LIEN DU SITE -->
            <div style="margin-bottom: 25px;">
                <a href="https://andu-xara.store" class="site-link">
                    🌐 VISITER NOTRE BOUTIQUE EN LIGNE
                </a>
            </div>
            
            <!-- LOCALISATION -->
            <div class="location">
                <strong>ANDU XARA STORE</strong><br>
                Mode Africaine - Livraison Internationale<br>
                Mauritanie & Sénégal
            </div>
            
            <!-- LIENS UTILES -->
            <div class="unsubscribe">
                <a href="https://andu-xara.store/unsubscribe">Se désabonner</a> | 
                <a href="https://andu-xara.store/conditions">Conditions</a> | 
                <a href="https://andu-xara.store/contact">Contact</a>
            </div>
            
            <!-- COPYRIGHT -->
            <div class="copyright">
                © 2025 Andu Xara. Tous droits réservés.<br>
                Cet email a été envoyé à votre demande d'inscription à notre newsletter.
            </div>
        </div>
    </div>
</body>
</html>`;

// ========================================================
// FONCTION D'ENVOI
// ========================================================

async function sendFinalNewsletter() {
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
    
    // Afficher les corrections
    console.log('📋 CORRECTIONS APPLIQUÉES :');
    console.log('----------------------------');
    console.log('✅ Code promo : BIENVENU10 (10% de réduction)');
    console.log('✅ Vos 3 emails professionnels :');
    console.log('   • contact@andu-xara.store');
    console.log('   • support@andu-xara.store');
    console.log('   • partenariat@andu-xara.store');
    console.log('✅ Vos numéros de téléphone :');
    console.log('   🇲🇷 Mauritanie : +222 34 19 63 04');
    console.log('   🇸🇳 Sénégal : +221 76 28 21 163');
    console.log('✅ Localisation : Mauritanie & Sénégal');
    console.log('');
    
    // Demander confirmation
    console.log('='.repeat(60));
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question(`\n📨 Envoyer la newsletter CORRIGÉE à ${emails.length} abonnés ? (oui/non/test): `, resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() === 'non') {
      console.log('❌ Annulé');
      return;
    }
    
    const isTest = answer.toLowerCase() === 'test';
    const emailsToSend = isTest ? emails.slice(0, 2) : emails;
    
    console.log(`\n🎯 ${isTest ? 'MODE TEST - 2 emails' : 'MODE COMPLET - ' + emailsToSend.length + ' emails'}`);
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
          subject: '🎁 BIENVENUE CHEZ ANDU XARA - Votre offre BIENVENU10',
          html: FINAL_TEMPLATE,
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
    }
    
    // Sauvegarder un rapport
    const fs = await import('fs');
    const report = {
      date: new Date().toISOString(),
      version: "Finale Mauritanie/Sénégal",
      emails_total: emailsToSend.length,
      emails_success: success,
      emails_failed: errors.length,
      promo_code: "BIENVENU10",
      professional_emails: [
        "contact@andu-xara.store",
        "support@andu-xara.store", 
        "partenariat@andu-xara.store"
      ],
      phone_numbers: {
        mauritanie: "+222 34 19 63 04",
        senegal: "+221 76 28 21 163"
      }
    };
    
    fs.writeFileSync(
      `newsletter-final-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
    
    console.log(`\n📝 Rapport sauvegardé : newsletter-final-${Date.now()}.json`);
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

sendFinalNewsletter();
