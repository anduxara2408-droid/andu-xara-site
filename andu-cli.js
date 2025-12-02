#!/usr/bin/env node
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const readline = require('readline');
const { exec } = require('child_process');
const fs = require('fs').promises;

console.log('\n🎪 ANDU XARA - SYSTÈME DE COMMANDES');
console.log('📅 Lancement officiel: 03 Décembre 2025 - 11h00');
console.log('='.repeat(60));

// Initialisation
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

// Fonction pour afficher l'aide
function showHelp() {
  console.log('\n📋 COMMANDES DISPONIBLES:');
  console.log('='.repeat(40));
  console.log('  stats          📊 Afficher les statistiques');
  console.log('  list [N]       📋 Lister N abonnés (défaut: 10)');
  console.log('  welcome EMAIL  📧 Envoyer email de bienvenue');
  console.log('  test-email     🧪 Tester configuration email');
  console.log('  sync           🔄 Lancer la synchronisation');
  console.log('  run-auto       🤖 Lancer bienvenue-automatique.js');
  console.log('  check-env      🔍 Vérifier configuration');
  console.log('  help           ❓ Afficher cette aide');
  console.log('  exit           🚪 Quitter');
  console.log('\n💡 Exemples:');
  console.log('  > stats');
  console.log('  > list 20');
  console.log('  > welcome exemple@email.com');
  console.log('  > sync');
}

// Statistiques
async function showStats() {
  console.log('\n📊 STATISTIQUES ANDU XARA');
  console.log('🎯 Lancement: 03 Décembre 2025 - 11h00');
  console.log('='.repeat(50));
  
  try {
    const { count } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });
    
    console.log(`👥 Total abonnés: ${count}`);
    
    // Dernières 24h
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { count: new24h } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString());
    
    console.log(`🆕 Nouveaux (24h): ${new24h}`);
    
    // Par source
    const { data: sources } = await supabase
      .from('subscribers')
      .select('source');
    
    if (sources) {
      const sourceMap = {};
      sources.forEach(s => {
        const src = s.source || 'direct';
        sourceMap[src] = (sourceMap[src] || 0) + 1;
      });
      
      console.log('\n📈 RÉPARTITION PAR SOURCE:');
      Object.entries(sourceMap).forEach(([source, num]) => {
        const percent = Math.round(num * 100 / sources.length);
        console.log(`  ${source.padEnd(20)} ${num.toString().padEnd(4)} (${percent}%)`);
      });
    }
    
    // Temps restant avant lancement
    const launchDate = new Date('2025-12-03T11:00:00');
    const now = new Date();
    const diff = launchDate - now;
    
    if (diff <= 0) {
      console.log('\n🎉 LANCEMENT MAINTENANT !');
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      console.log(`\n⏰ TEMPS RESTANT: ${days}j ${hours}h ${minutes}m`);
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

// Lister les abonnés
async function listSubscribers(limit = 10) {
  console.log(`\n📋 ${limit} DERNIERS ABONNÉS:`);
  console.log('='.repeat(60));
  
  try {
    const { data } = await supabase
      .from('subscribers')
      .select('email, created_at, status, source')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (data && data.length > 0) {
      data.forEach((sub, index) => {
        const date = new Date(sub.created_at).toLocaleString('fr-FR');
        const source = sub.source || 'direct';
        console.log(`${(index + 1).toString().padStart(2)}. ${sub.email}`);
        console.log(`   📅 ${date}`);
        console.log(`   📍 ${source} | ${sub.status}`);
        console.log();
      });
      console.log(`✅ ${data.length} abonnés affichés`);
    } else {
      console.log('ℹ️ Aucun abonné trouvé');
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

// Envoyer un email de bienvenue
async function sendWelcomeEmail(email) {
  console.log(`\n📤 ENVOI EMAIL À: ${email}`);
  console.log('='.repeat(50));
  
  try {
    // Email HTML simple
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">ANDU XARA</h1>
          <p>Mode Africaine Authentique</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #8B4513;">Bienvenue chez Andu Xara !</h2>
          
          <p>Cher(e) Client(e),</p>
          
          <p>Nous sommes ravis de vous accueillir ! Le site officiel ouvre le :</p>
          
          <div style="background: #f8f9fa; border-left: 4px solid #8B4513; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0; color: #000;">📅 03 Décembre 2025 - 11h00</h3>
            <p style="margin: 5px 0 0;">🌐 https://anduxara.com</p>
          </div>
          
          <p><strong>🎁 Votre code promo de bienvenue :</strong></p>
          <div style="background: #FFF8DC; border: 2px dashed #D2691E; padding: 20px; text-align: center; margin: 20px 0;">
            <div style="font-size: 28px; font-weight: bold; color: #8B4513; margin: 10px 0;">BIENVENUE10</div>
            <p>-10% sur votre première commande</p>
          </div>
          
          <p>À très bientôt,<br>L'équipe Andu Xara</p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>Andu Xara • contact@anduxara.com</p>
        </div>
      </div>
    `;
    
    const info = await transporter.sendMail({
      from: `"Andu Xara" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Bienvenue chez Andu Xara !',
      html: html,
      text: `Bienvenue chez Andu Xara !\n\nLe site ouvre le 03 Décembre 2025 à 11h00.\n\nVotre code promo: BIENVENUE10 (-10% première commande)\n\nÀ bientôt sur https://anduxara.com`
    });
    
    console.log('✅ Email envoyé avec succès !');
    console.log(`📨 Message ID: ${info.messageId}`);
    
    // Marquer comme envoyé dans Supabase (si colonne existe)
    try {
      await supabase
        .from('subscribers')
        .update({ 
          welcome_email_sent: true,
          welcome_email_sent_at: new Date().toISOString(),
          promo_code_sent: 'BIENVENUE10'
        })
        .eq('email', email);
      console.log('✅ Mis à jour dans la base de données');
    } catch (dbError) {
      console.log('⚠️  Note: Colonnes de tracking non disponibles');
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

// Tester la configuration email
async function testEmailConfig() {
  console.log('\n🧪 TEST CONFIGURATION EMAIL');
  console.log('='.repeat(40));
  
  try {
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie');
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Andu Xara - ' + new Date().toLocaleString('fr-FR'),
      text: 'Configuration email fonctionnelle !'
    });
    
    console.log('✅ Email test envoyé');
    console.log(`📨 ID: ${info.messageId}`);
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

// Lancer la synchronisation
function runSync() {
  console.log('\n🔄 LANCEMENT SYNCHRONISATION');
  console.log('='.repeat(40));
  
  exec('node sync-automatique.js', (error, stdout, stderr) => {
    if (error) {
      console.log(`❌ Erreur: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`⚠️  Stderr: ${stderr}`);
    }
    console.log(`✅ Sortie:\n${stdout}`);
  });
}

// Lancer le script automatique
function runAutoWelcome() {
  console.log('\n🤖 LANCEMENT BIENVENUE AUTOMATIQUE');
  console.log('='.repeat(40));
  
  exec('node bienvenue-automatique.js', (error, stdout, stderr) => {
    if (error) {
      console.log(`❌ Erreur: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`⚠️  Stderr: ${stderr}`);
    }
    console.log(`✅ Sortie:\n${stdout}`);
  });
}

// Vérifier l'environnement
function checkEnv() {
  console.log('\n🔍 VÉRIFICATION CONFIGURATION');
  console.log('='.repeat(40));
  
  const required = ['EMAIL_USER', 'EMAIL_PASS', 'SUPABASE_URL', 'SUPABASE_KEY'];
  required.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const display = varName.includes('PASS') || varName.includes('KEY') 
        ? '••••••••' 
        : value;
      console.log(`✅ ${varName}: ${display}`);
    } else {
      console.log(`❌ ${varName}: MANQUANT`);
    }
  });
}

// Interface principale
function startCLI() {
  console.log('\n💡 Tapez "help" pour la liste des commandes');
  
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
      
      case 'welcome':
        if (arg) {
          await sendWelcomeEmail(arg);
        } else {
          console.log('❌ Usage: welcome EMAIL');
        }
        break;
      
      case 'test-email':
        await testEmailConfig();
        break;
      
      case 'sync':
        runSync();
        break;
      
      case 'run-auto':
        runAutoWelcome();
        break;
      
      case 'check-env':
        checkEnv();
        break;
      
      case 'help':
        showHelp();
        break;
      
      case 'exit':
      case 'quit':
        console.log('\n👋 À bientôt !');
        rl.close();
        process.exit(0);
        break;
      
      case '':
        // Ignorer ligne vide
        break;
      
      default:
        console.log(`❌ Commande inconnue: "${command}"`);
        console.log('💡 Tapez "help" pour la liste des commandes');
    }
    
    console.log('\n> Attente commande...');
  });
  
  console.log('> Attente commande...');
}

// Démarrer
showStats();
startCLI();
