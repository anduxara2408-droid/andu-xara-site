require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔧 TEST AVEC VOTRE DOMAINE\n');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function test() {
  console.log('📧 Compte d\'envoi:', process.env.EMAIL_USER);
  console.log('🏷️  Affiché comme:', process.env.DISPLAY_FROM);
  console.log('🌐 Site:', process.env.APP_URL);
  
  try {
    await transporter.verify();
    console.log('\n✅ CONNEXION SMTP RÉUSSIE');
    
    const info = await transporter.sendMail({
      from: process.env.DISPLAY_FROM,  // Affiché comme votre domaine
      replyTo: process.env.REPLY_TO,   // Pour les réponses
      to: process.env.EMAIL_USER,      // Envoyez à vous-même pour test
      subject: '✅ Test Andu Xara Domain - ' + new Date().toLocaleString('fr-FR'),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h1 style="color: #8B4513;">Test Configuration Email</h1>
          <p><strong>Expéditeur affiché:</strong> ${process.env.DISPLAY_FROM}</p>
          <p><strong>Site:</strong> ${process.env.APP_URL}</p>
          <p><strong>Support:</strong> ${process.env.SUPPORT_EMAIL}</p>
          <p><strong>Partenariat:</strong> ${process.env.PARTNERSHIP_EMAIL}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Email envoyé via ${process.env.EMAIL_USER} mais affiché comme votre domaine.
          </p>
        </div>
      `,
      text: `Test configuration\nExpéditeur: ${process.env.DISPLAY_FROM}\nSite: ${process.env.APP_URL}`
    });
    
    console.log('\n🎉 EMAIL ENVOYÉ AVEC SUCCÈS !');
    console.log('📨 Message ID:', info.messageId);
    console.log('📧 Expéditeur affiché:', info.envelope.from);
    
  } catch (error) {
    console.log('\n❌ ERREUR:', error.message);
    console.log('\n🔧 POUR GMAIL:');
    console.log('1. Activez 2FA: https://myaccount.google.com/security');
    console.log('2. Créez App Password: https://myaccount.google.com/apppasswords');
    console.log('3. Nom: "Andu Xara Server" → Mot de passe de 16 caractères');
    console.log('4. Dans .env: EMAIL_PASS=votre_mot_de_passe_sans_espaces');
  }
}

test();
