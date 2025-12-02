import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

console.log('\n' + '='.repeat(60));
console.log('📧 NEWSLETTER CORRIGÉE - BIENVENU10 POUR NOUVEAUX');
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
// TEMPLATE CORRIGÉ AVEC BIENVENU10 ET CONTENU EXACT
// ========================================================

const CORRECT_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez Andu Xara</title>
    <style>
        /* RESET */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* CONTAINER PRINCIPAL */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #ffffff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(139, 69, 19, 0.1);
        }
        
        /* HEADER BIENVENUE */
        .welcome-header {
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
            color: white;
            padding: 50px 20px;
            text-align: center;
            position: relative;
        }
        
        .welcome-header h1 {
            font-size: 42px;
            font-weight: 800;
            margin-bottom: 15px;
            letter-spacing: 1px;
        }
        
        .welcome-header .subtitle {
            font-size: 20px;
            opacity: 0.95;
            font-weight: 300;
        }
        
        .welcome-badge {
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
            line-height: 1.7;
            color: #333333;
        }
        
        .greeting {
            font-size: 24px;
            color: #8B4513;
            margin-bottom: 25px;
            font-weight: 600;
        }
        
        .welcome-message {
            font-size: 18px;
            margin-bottom: 30px;
            color: #555;
        }
        
        /* SECTION OFFRE BIENVENUE */
        .welcome-offer {
            background: linear-gradient(135deg, #FFF8F0 0%, #FFEBCD 100%);
            border: 3px solid #D2691E;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
        }
        
        .welcome-offer:before {
            content: "🎁";
            font-size: 80px;
            position: absolute;
            top: -20px;
            right: -20px;
            opacity: 0.2;
        }
        
        .welcome-offer h3 {
            color: #8B4513;
            font-size: 28px;
            margin-bottom: 15px;
        }
        
        .promo-code {
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
        
        .offer-details {
            font-size: 18px;
            color: #8B4513;
            font-weight: 600;
            margin: 15px 0;
        }
        
        /* BOUTON PRINCIPAL */
        .main-button {
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
        
        .main-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(139, 69, 19, 0.4);
        }
        
        /* AVANTAGES */
        .advantages {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .advantages h4 {
            color: #8B4513;
            margin-bottom: 15px;
            font-size: 22px;
        }
        
        .advantage-item {
            display: flex;
            align-items: center;
            margin: 12px 0;
            font-size: 16px;
        }
        
        .advantage-item .icon {
            color: #D2691E;
            font-size: 20px;
            margin-right: 15px;
            min-width: 30px;
        }
        
        /* SECTION CONTACT CORRIGÉE */
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
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        
        .contact-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .contact-card .role {
            color: #FFD700;
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .contact-card .email {
            color: #D2691E;
            font-weight: bold;
            font-size: 16px;
            word-break: break-all;
        }
        
        /* FOOTER */
        .email-footer {
            text-align: center;
            padding: 30px;
            background: #1a0f0a;
            color: #ccc;
        }
        
        .website-link {
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
        
        .store-info {
            margin: 20px 0;
            font-size: 16px;
        }
        
        .unsubscribe-links {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 14px;
        }
        
        .unsubscribe-links a {
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
    <div class="email-container">
        <!-- HEADER BIENVENUE -->
        <div class="welcome-header">
            <h1>ANDU XARA</h1>
            <p class="subtitle">Votre Excellence Vestimentaire Africaine</p>
            <div class="welcome-badge">OFFRE DE BIENVENUE</div>
        </div>
        
        <!-- CONTENU PRINCIPAL -->
        <div class="email-content">
            <div class="greeting">Bonjour cher(e) client(e) 👋,</div>
            
            <div class="welcome-message">
                <p>Bienvenue dans la communauté Andu Xara ! Nous sommes ravis de vous accueillir parmi nos clients privilégiés.</p>
                <p>Pour célébrer votre arrivée, nous vous offrons une <strong>offre exclusive de bienvenue</strong>.</p>
            </div>
            
            <!-- OFFRE BIENVENU10 -->
            <div class="welcome-offer">
                <h3>🎁 VOTRE CADEAU DE BIENVENUE</h3>
                <p>Profitez immédiatement de :</p>
                
                <div class="promo-code">BIENVENU10</div>
                
                <div class="offer-details">
                    ✅ 10% DE RÉDUCTION sur votre première commande<br>
                    ✅ Valable sur toute la collection<br>
                    ✅ Sans minimum d'achat<br>
                    ✅ Offre réservée aux nouveaux membres
                </div>
                
                <p style="color: #8B4513; font-weight: 600; margin-top: 15px;">
                    ⏰ Offre valable 30 jours à partir de réception de cet email
                </p>
            </div>
            
            <!-- BOUTON PRINCIPAL -->
            <div style="text-align: center;">
                <a href="https://andu-xara.store?promo=BIENVENU10" class="main-button">
                    🛍️ DÉCOUVRIR NOS COLLECTIONS
                </a>
            </div>
            
            <!-- AVANTAGES -->
            <div class="advantages">
                <h4>🌟 POURQUOI CHOISIR ANDU XARA ?</h4>
                
                <div class="advantage-item">
                    <span class="icon">✓</span>
                    <span><strong>Tissus Wax Authentiques</strong> - Qualité premium garantie</span>
                </div>
                
                <div class="advantage-item">
                    <span class="icon">✓</span>
                    <span><strong>Confection Artisanale</strong> - Savoir-faire traditionnel</span>
                </div>
                
                <div class="advantage-item">
                    <span class="icon">✓</span>
                    <span><strong>Livraison Rapide</strong> - 2-5 jours en France</span>
                </div>
                
                <div class="advantage-item">
                    <span class="icon">✓</span>
                    <span><strong>Service Client Premium</strong> - Disponible 7j/7</span>
                </div>
                
                <div class="advantage-item">
                    <span class="icon">✓</span>
                    <span><strong>Retours Faciles</strong> - 30 jours satisfait ou remboursé</span>
                </div>
            </div>
            
            <p style="text-align: center; font-style: italic; color: #666; margin: 30px 0;">
                "Chaque pièce Andu Xara raconte une histoire, célèbre une tradition,<br>
                et honore l'artisanat africain d'excellence."
            </p>
            
            <!-- SECTION CONTACT CORRIGÉE -->
            <div class="contact-section">
                <div class="contact-title">📞 CONTACTEZ-NOUS FACILEMENT</div>
                
                <p style="text-align: center; margin-bottom: 25px; color: #ccc;">
                    Notre équipe est à votre disposition pour toute question :
                </p>
                
                <div class="contact-grid">
                    <div class="contact-card">
                        <div class="role">🛒 Commandes & Paiements</div>
                        <div class="email">commandes@andu-xara.store</div>
                    </div>
                    
                    <div class="contact-card">
                        <div class="role">📦 Livraison & Suivi</div>
                        <div class="email">livraison@andu-xara.store</div>
                    </div>
                    
                    <div class="contact-card">
                        <div class="role">🤝 Partenariats</div>
                        <div class="email">partenariats@andu-xara.store</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="color: #FFD700; font-weight: bold; margin-bottom: 10px;">
                        Contact Principal & Support Client
                    </div>
                    <div class="email" style="font-size: 18px;">contact@andu-xara.store</div>
                </div>
            </div>
            
            <p style="text-align: right; font-weight: bold; margin-top: 30px; color: #8B4513;">
                Cheikhou Diabira<br>
                <span style="font-weight: normal; font-style: italic;">Fondateur & Directeur Artistique</span>
            </p>
        </div>
        
        <!-- FOOTER -->
        <div class="email-footer">
            <div style="margin-bottom: 20px;">
                <a href="https://andu-xara.store" class="website-link">
                    🌐 VISITER NOTRE BOUTIQUE EN LIGNE
                </a>
            </div>
            
            <div class="store-info">
                <strong>ANDU XARA STORE</strong><br>
                Paris, France | Livraison Internationale<br>
                Tél: +33 1 23 45 67 89
            </div>
            
            <div class="unsubscribe-links">
                <a href="https://andu-xara.store/unsubscribe">Se désabonner</a> | 
                <a href="https://andu-xara.store/preferences">Gérer mes préférences</a> | 
                <a href="https://andu-xara.store/contact">Nous contacter</a>
            </div>
            
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

async function sendCorrectedNewsletter() {
  try {
    console.log('1. 📥 Récupération des abonnés...');
    
    const { data } = await supabase
      .from('subscribers')
      .select('email, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (!data || data.length === 0) {
      console.log('❌ Aucun abonné trouvé');
      return;
    }
    
    const emails = data.map(s => s.email?.trim()).filter(e => e && e.includes('@'));
    
    console.log(`✅ ${emails.length} abonnés trouvés\n`);
    
    // Demander confirmation
    console.log('='.repeat(60));
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question(`\n📨 Envoyer l'email CORRIGÉ (BIENVENU10) à ${emails.length} abonnés ? (oui/non/test): `, resolve);
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
    for (let i = 0; i < emailsToSend.length; i++) {
      try {
        await transporter.sendMail({
          from: '"Andu Xara" <anduxara2408@gmail.com>',
          to: emailsToSend[i],
          subject: '🎁 BIENVENUE CHEZ ANDU XARA - Offre Exclusive BIENVENU10',
          html: CORRECT_TEMPLATE,
          text: `BIENVENUE CHEZ ANDU XARA !

Bonjour !

Nous sommes ravis de vous accueillir dans notre communauté.

VOTRE CADEAU DE BIENVENUE :
Code promo : BIENVENU10
10% de réduction sur votre première commande

Visitez notre boutique : https://andu-xara.store?promo=BIENVENU10

Nos contacts :
• Commandes : commandes@andu-xara.store
• Livraison : livraison@andu-xara.store  
• Partenariats : partenariats@andu-xara.store
• Contact principal : contact@andu-xara.store

Merci pour votre confiance,
L'équipe Andu Xara`
        });
        
        success++;
        const progress = Math.round(((i + 1) / emailsToSend.length) * 100);
        console.log(`✅ [${progress}%] ${emailsToSend[i]}`);
        
        if (!isTest && i < emailsToSend.length - 1) {
          await new Promise(r => setTimeout(r, 200));
        }
        
      } catch (error) {
        console.log(`❌ ${emailsToSend[i]} : ${error.message}`);
      }
    }
    
    console.log(`\n🎉 TERMINÉ ! ${success}/${emailsToSend.length} envoyés.`);
    
    if (isTest && success > 0) {
      console.log('\n💡 TEST RÉUSSI ! Pour envoyer à tous :');
      console.log('   Répondez "oui" au lieu de "test"');
    }
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

sendCorrectedNewsletter();
