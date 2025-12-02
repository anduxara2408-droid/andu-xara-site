#!/usr/bin/env node
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const readline = require('readline');

console.log('\n🎪 ANDU XARA - SYSTÈME DE COMMANDES');
console.log('🌐 Domaine: andu-xara.store');
console.log('📅 Lancement: 03 Décembre 2025 - 11h00');
console.log('='.repeat(60));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showHelp() {
  console.log('\n📋 COMMANDES:');
  console.log('  stats          📊 Statistiques');
  console.log('  list [N]       📋 Lister abonnés');
  console.log('  email N        📧 Envoyer à un abonné');
  console.log('  preview        👀 Voir aperçu email');
  console.log('  test           🧪 Tester configuration');
  console.log('  config         ⚙️  Voir configuration');
  console.log('  help           ❓ Aide');
  console.log('  exit           🚪 Quitter');
}

async function showStats() {
  console.log('\n📊 STATISTIQUES ANDU XARA');
  console.log('🌐 Domain: andu-xara.store');
  console.log('='.repeat(50));
  
  const { count } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true });
  
  console.log(`👥 Total abonnés: ${count}`);
  
  const { data: recent } = await supabase
    .from('subscribers')
    .select('email, created_at, source')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (recent) {
    console.log('\n🆕 5 DERNIERS:');
    recent.forEach((sub, i) => {
      const date = new Date(sub.created_at).toLocaleDateString('fr-FR');
      console.log(`${i+1}. ${sub.email}`);
      console.log(`   📅 ${date} | ${sub.source || 'direct'}`);
    });
  }
}

async function listSubscribers(limit = 10) {
  console.log(`\n📋 ${limit} DERNIERS ABONNÉS:`);
  console.log('='.repeat(60));
  
  const { data } = await supabase
    .from('subscribers')
    .select('email, created_at, source')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (data) {
    data.forEach((sub, i) => {
      const date = new Date(sub.created_at).toLocaleDateString('fr-FR');
      console.log(`${(i+1).toString().padStart(2)}. ${sub.email}`);
      console.log(`   📅 ${date} | ${sub.source || 'direct'}`);
    });
  }
}

function showEmailPreview() {
  console.log('\n👀 APERÇU EMAIL DE BIENVENUE');
  console.log('='.repeat(50));
  console.log('\n📧 DE:', process.env.DISPLAY_FROM || 'Andu Xara <contact@andu-xara.store>');
  console.log('🌐 SITE:', process.env.APP_URL || 'https://andu-xara.store');
  console.log('🎁 CODE PROMO:', process.env.PROMO_CODE || 'BIENVENUE10');
  console.log('\n📋 ADRESSES AFFICHÉES:');
  console.log('  • Contact:', process.env.REPLY_TO || 'contact@andu-xara.store');
  console.log('  • Support:', process.env.SUPPORT_EMAIL || 'support@andu-xara.store');
  console.log('  • Partenariat:', process.env.PARTNERSHIP_EMAIL || 'partenariat@andu-xara.store');
}

async function sendEmailToSubscriber(index) {
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('email')
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (!subscribers || index < 1 || index > subscribers.length) {
    console.log('❌ Numéro invalide');
    return;
  }
  
  const email = subscribers[index - 1].email;
  console.log(`\n📤 ENVOI À: ${email}`);
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000000; color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 32px;">ANDU XARA</h1>
        <p style="opacity: 0.9;">Mode Africaine Authentique</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #8B4513;">🎉 Bienvenue chez Andu Xara !</h2>
        
        <p>Cher(e) Client(e),</p>
        
        <p>Nous sommes ravis de vous accueillir dans notre communauté !</p>
        
        <div style="background: #FFF8DC; border: 2px dashed #D2691E; padding: 20px; margin: 25px 0; text-align: center;">
          <h3 style="color: #000; margin-top: 0;">🎁 VOTRE CADEAU DE BIENVENUE</h3>
          <div style="font-size: 32px; font-weight: bold; color: #8B4513; margin: 15px 0;">BIENVENUE10</div>
          <p><strong>-10% sur votre première commande</strong></p>
        </div>
        
        <p><strong>📅 LANCEMENT OFFICIEL:</strong></p>
        <p>03 Décembre 2025 - 11h00</p>
        
        <p><strong>🌐 SITE:</strong></p>
        <p><a href="https://andu-xara.store">https://andu-xara.store</a></p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p><strong>📞 CONTACT:</strong></p>
          <p>• ${process.env.SUPPORT_EMAIL || 'support@andu-xara.store'}</p>
          <p>• ${process.env.PARTNERSHIP_EMAIL || 'partenariat@andu-xara.store'}</p>
        </div>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p>Andu Xara • andu-xara.store • Paris, France</p>
      </div>
    </div>
  `;
  
  try {
    const info = await transporter.sendMail({
      from: process.env.DISPLAY_FROM || 'Andu Xara <contact@andu-xara.store>',
      replyTo: process.env.REPLY_TO || 'contact@andu-xara.store',
      to: email,
      subject: '🎉 Bienvenue chez Andu Xara !',
      html: html
    });
    
    console.log('✅ Email envoyé !');
    console.log('📨 ID:', info.messageId);
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

function showConfig() {
  console.log('\n⚙️  CONFIGURATION:');
  console.log('='.repeat(40));
  console.log('📧 Compte SMTP:', process.env.EMAIL_USER);
  console.log('🏷️  Affiché comme:', process.env.DISPLAY_FROM);
  console.log('🌐 Site:', process.env.APP_URL);
  console.log('🔑 SMTP:', process.env.SMTP_HOST + ':' + process.env.SMTP_PORT);
}

async function startCLI() {
  console.log('\n💡 Tapez "help" pour les commandes');
  
  rl.on('line', async (input) => {
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts[1];
    
    switch (command) {
      case 'stats':
        await showStats();
        break;
      
      case 'list':
        const limit = arg ? parseInt(arg) : 10;
        await listSubscribers(limit);
        break;
      
      case 'email':
        if (arg) {
          await sendEmailToSubscriber(parseInt(arg));
        } else {
          console.log('❌ Usage: email NUMERO (voir avec "list")');
        }
        break;
      
      case 'preview':
        showEmailPreview();
        break;
      
      case 'test':
        console.log('🧪 Test en cours...');
        try {
          await transporter.verify();
          console.log('✅ SMTP fonctionne');
        } catch (e) {
          console.log('❌ Erreur SMTP:', e.message);
        }
        break;
      
      case 'config':
        showConfig();
        break;
      
      case 'help':
        showHelp();
        break;
      
      case 'exit':
        console.log('\n👋 À bientôt !');
        rl.close();
        break;
      
      default:
        console.log('❌ Commande inconnue. Tapez "help"');
    }
    
    console.log('\n> ');
  });
  
  console.log('> ');
}

showStats();
startCLI();
