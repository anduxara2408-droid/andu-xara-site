const nodemailer = require('nodemailer');

console.log('🧪 TEST CONNEXION SMTP AMEN.FR\n');

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
  },
  debug: true, // Activer le debug
  logger: true  // Afficher les logs
});

async function test() {
  try {
    console.log('🔍 Test de connexion au serveur SMTP...');
    
    // Test 1: Vérifier la connexion
    const isConnected = await transporter.verify();
    console.log('✅ Connexion SMTP OK:', isConnected);
    
    // Test 2: Essayer d'envoyer un email de test
    console.log('\n📨 Test d\'envoi d\'email...');
    
    const testEmail = {
      from: '"Andu Xara Test" <contact@andu-xara.store>',
      to: 'cheikhdiabira2408@gmail.com', // Votre email pour test
      subject: 'Test SMTP Amen.fr - ' + new Date().toISOString(),
      text: 'Ceci est un test de connexion SMTP.',
      html: '<p>Ceci est un <b>test</b> de connexion SMTP.</p>'
    };
    
    const info = await transporter.sendMail(testEmail);
    console.log('✅ Email de test envoyé !');
    console.log('Message ID:', info.messageId);
    console.log('Réponse:', info.response);
    
  } catch (error) {
    console.error('❌ ERREUR SMTP:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Command:', error.command);
    
    if (error.responseCode) {
      console.error('Code réponse:', error.responseCode);
    }
    if (error.response) {
      console.error('Réponse serveur:', error.response);
    }
  }
}

test();
