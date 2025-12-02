// test-email.js - Test simple d'envoi d'email
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🧪 TEST D\'ENVOI D\'EMAIL');
console.log('='.repeat(50));

// Vérifier la configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ ERREUR: EMAIL_USER ou EMAIL_PASS non définis dans .env');
    console.log('📝 Vérifiez que votre fichier .env contient:');
    console.log('   EMAIL_USER="votre-email@gmail.com"');
    console.log('   EMAIL_PASS="votre-mot-de-passe-application"');
    process.exit(1);
}

console.log(`📧 Email expéditeur: ${process.env.EMAIL_USER}`);
console.log('🔑 Mot de passe: ' + (process.env.EMAIL_PASS ? '✓ Défini' : '❌ Manquant'));

// Créer le transporteur
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Tester la connexion
async function testEmail() {
    try {
        console.log('\n🔌 Test de connexion à Gmail...');
        
        // Vérifier la connexion
        await transporter.verify();
        console.log('✅ Connexion Gmail réussie !');
        
        // Envoyer un email de test
        console.log('\n📤 Envoi de l\'email de test...');
        
        const info = await transporter.sendMail({
            from: `"Andu Xara Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // S'envoyer à soi-même pour tester
            subject: '🧪 Test Email Andu Xara - ' + new Date().toLocaleString('fr-FR'),
            text: 'Ceci est un test d\'envoi d\'email depuis le système Andu Xara.',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #667eea;">🧪 Test réussi !</h2>
                    <p>Le système d\'envoi d\'email d\'Andu Xara fonctionne correctement.</p>
                    <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
                    <div style="background: #f0f5ff; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <p style="margin: 0;">✅ Prêt pour l\'envoi des emails de bienvenue automatiques !</p>
                    </div>
                </div>
            `
        });
        
        console.log('✅ Email de test envoyé avec succès !');
        console.log(`📨 Message ID: ${info.messageId}`);
        console.log(`📧 À: ${info.accepted}`);
        
    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n🔧 SOLUTIONS POSSIBLES:');
            console.log('1. Vérifiez votre mot de passe d\'application Gmail');
            console.log('2. Activez l\'accès aux applications moins sécurisées:');
            console.log('   https://myaccount.google.com/lesssecureapps');
            console.log('3. Créez un mot de passe d\'application:');
            console.log('   https://myaccount.google.com/apppasswords');
        }
    }
}

// Exécuter le test
testEmail();
