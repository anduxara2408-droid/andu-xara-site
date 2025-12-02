require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// ============================================================================
// CONFIGURATION
// ============================================================================
console.log('🚀 SCRIPT D\'ENVOI D\'EMAILS EN MASSE');
console.log('===================================\n');

// Vérifier .env
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('❌ ERREUR: Variables Supabase manquantes dans .env');
  console.error('   Ajoutez:');
  console.error('   SUPABASE_URL=votre_url');
  console.error('   SUPABASE_KEY=votre_service_role_key');
  process.exit(1);
}

// Configuration Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Configuration SMTP (pour Amen.fr comme dans votre script)
const transporter = nodemailer.createTransport({
  host: 'smtp.amen.fr',
  port: 465, // Port SSL
  secure: true, // true pour le port 465
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

async function testConnection() {
  console.log('🔍 Test de connexion...');
  
  try {
    // Test Supabase
    const { data, error } = await supabase
      .from('subscribers')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error(`❌ Erreur Supabase: ${error.message}`);
      
      // Essayer d'autres noms de table
      const tables = ['abonnes', 'newsletter', 'emails', 'users'];
      for (const table of tables) {
        const { error: tableError } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        if (!tableError) {
          console.log(`✅ Table trouvée: ${table}`);
          return { success: true, tableName: table };
        }
      }
      return { success: false, message: 'Aucune table trouvée' };
    }
    
    console.log('✅ Connexion Supabase OK');
    return { success: true, tableName: 'subscribers' };
    
  } catch (error) {
    console.error(`💥 Erreur connexion: ${error.message}`);
    return { success: false, message: error.message };
  }
}

async function getSubscribers(tableName = 'subscribers') {
  console.log(`📋 Récupération des abonnés depuis "${tableName}"...`);
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('email, nom, prenom, name, status, is_active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`❌ Erreur: ${error.message}`);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('⚠️  Aucun abonné trouvé');
      return [];
    }

    console.log(`✅ ${data.length} abonnés trouvés`);
    
    // Filtrer les actifs si possible
    const activeSubscribers = data.filter(sub => {
      // Vérifier différents champs possibles
      if (sub.status === 'active') return true;
      if (sub.is_active === true) return true;
      if (sub.status === 'confirmed') return true;
      // Si pas de champ status/is_active, inclure tous
      if (!sub.status && !sub.is_active) return true;
      return false;
    });

    console.log(`📊 ${activeSubscribers.length} abonnés actifs après filtrage`);
    return activeSubscribers;

  } catch (error) {
    console.error(`💥 Erreur récupération: ${error.message}`);
    return [];
  }
}

function createEmailContent(subscriber) {
  const name = subscriber.nom || subscriber.prenom || subscriber.name || 'cher client';
  
  return {
    subject: '🌟 Découvrez les nouvelles collections Andu Xara !',
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Andu Xara - Nouveautés</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .product { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="header">
        <h1>ANDU XARA</h1>
        <p>Mode Africaine d'Excellence</p>
    </div>
    
    <div class="content">
        <h2>Bonjour ${name} 👋</h2>
        
        <p>Nous sommes ravis de vous présenter nos nouvelles collections printemps-été 2025 !</p>
        
        <div class="product">
            <h3>🆕 Nouveautés</h3>
            <p>Découvrez nos dernières créations inspirées des traditions africaines revisitées.</p>
        </div>
        
        <div class="product">
            <h3>🎉 Promotions exclusives</h3>
            <p>Profitez de -20% sur votre première commande avec le code: <strong>BIENVENUE20</strong></p>
        </div>
        
        <div style="text-align: center;">
            <a href="https://andu-xara.store" class="btn">🎁 Voir la collection</a>
        </div>
        
        <p>Nous restons à votre disposition pour toute question.</p>
        
        <p>Avec toute notre gratitude,<br>
        <strong>L'équipe Andu Xara</strong></p>
    </div>
    
    <div class="footer">
        <p>ANDU XARA STORE<br>
        contact@andu-xara.store<br>
        https://andu-xara.store</p>
        <p><small>Vous recevez cet email car vous êtes inscrit à notre newsletter.<br>
        <a href="https://andu-xara.store/unsubscribe" style="color: #ccc;">Se désabonner</a></small></p>
    </div>
</body>
</html>
    `
  };
}

async function sendEmails() {
  console.log('\n🎯 DÉBUT DE L\'ENVOI');
  console.log('===================\n');
  
  // 1. Tester la connexion
  const connection = await testConnection();
  if (!connection.success) {
    console.error('❌ Impossible de se connecter. Arrêt.');
    return;
  }
  
  // 2. Récupérer les abonnés
  const subscribers = await getSubscribers(connection.tableName);
  if (subscribers.length === 0) {
    console.log('⚠️  Aucun abonné à traiter');
    return;
  }
  
  // 3. Demander confirmation
  console.log(`\n⚠️  PRÊT À ENVOYER À ${subscribers.length} ABONNÉS`);
  console.log('-----------------------------------------');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const ask = (question) => new Promise(resolve => {
    readline.question(question, answer => resolve(answer));
  });
  
  const answer = await ask('Continuer ? (oui/non/test): ');
  
  if (answer.toLowerCase() === 'non') {
    console.log('❌ Annulé par l\'utilisateur');
    readline.close();
    return;
  }
  
  if (answer.toLowerCase() === 'test') {
    console.log('\n🧪 MODE TEST - Envoi à 2 emails seulement');
    // Envoyer seulement aux 2 premiers
    const testSubscribers = subscribers.slice(0, 2);
    await processBatch(testSubscribers, true);
    readline.close();
    return;
  }
  
  readline.close();
  
  // 4. Envoyer à tous
  console.log('\n📨 ENVOI EN COURS...');
  console.log('--------------------');
  await processBatch(subscribers, false);
}

async function processBatch(subscribers, isTest = false) {
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (let i = 0; i < subscribers.length; i++) {
    const subscriber = subscribers[i];
    const progress = Math.round(((i + 1) / subscribers.length) * 100);
    
    try {
      const emailContent = createEmailContent(subscriber);
      
      const mailOptions = {
        from: '"Andu Xara" <contact@andu-xara.store>',
        to: subscriber.email,
        subject: emailContent.subject,
        html: emailContent.html
      };
      
      await transporter.sendMail(mailOptions);
      
      successCount++;
      console.log(`✅ [${progress}%] Envoyé à: ${subscriber.email}`);
      
      // Pause pour éviter le spam (100ms entre chaque email)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // En mode test, s'arrêter après 2 emails
      if (isTest && successCount >= 2) {
        console.log('🧪 Mode test terminé (2 emails envoyés)');
        break;
      }
      
    } catch (error) {
      errorCount++;
      errors.push({
        email: subscriber.email,
        error: error.message
      });
      console.error(`❌ [${progress}%] Erreur pour ${subscriber.email}: ${error.message}`);
    }
  }
  
  // Afficher le rapport
  console.log('\n📈 RAPPORT FINAL');
  console.log('================');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Échecs: ${errorCount}`);
  console.log(`📊 Total: ${subscribers.length}`);
  
  if (errors.length > 0) {
    console.log('\n📋 DÉTAILS DES ERREURS:');
    errors.forEach(err => {
      console.log(`   • ${err.email}: ${err.error}`);
    });
  }
  
  if (isTest && successCount > 0) {
    console.log('\n💡 CONSEIL: Le test a réussi !');
    console.log('   Vous pouvez maintenant envoyer à tous avec:');
    console.log('   node send-bulk-emails.js --all');
  }
}

// ============================================================================
// EXÉCUTION PRINCIPALE
// ============================================================================

// Vérifier les arguments
const args = process.argv.slice(2);
const isTestMode = args.includes('--test') || args.includes('-t');
const isAllMode = args.includes('--all') || args.includes('-a');

async function main() {
  if (isTestMode) {
    console.log('🧪 MODE TEST ACTIVÉ');
    const connection = await testConnection();
    if (connection.success) {
      const subscribers = await getSubscribers(connection.tableName);
      if (subscribers.length > 0) {
        await processBatch(subscribers.slice(0, 2), true);
      }
    }
  } else if (isAllMode) {
    await sendEmails();
  } else {
    console.log('\n📖 MODE D\'EMPLOI:');
    console.log('----------------');
    console.log('Pour tester (envoyer 2 emails):');
    console.log('  node send-bulk-emails.js --test');
    console.log('\nPour envoyer à tous:');
    console.log('  node send-bulk-emails.js --all');
    console.log('\nOu simplement:');
    console.log('  node send-bulk-emails.js');
    console.log('  (vous pourrez choisir test/tous/annuler)');
    
    // Mode interactif par défaut
    await sendEmails();
  }
}

// Gérer les erreurs non catchées
process.on('unhandledRejection', (error) => {
  console.error('💥 ERREUR NON GÉRÉE:', error);
  process.exit(1);
});

// Lancer le script
main().catch(console.error);
