// bienvenue-automatique.js
// Script complet de synchronisation Firebase -> Supabase + Email de bienvenue

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const fs = require('fs');

console.log('🚀 DÉMARRAGE DU SYSTÈME DE BIENVENUE AUTOMATIQUE');
console.log('📅 Date:', new Date().toLocaleString('fr-FR'));
console.log('=' .repeat(60));

// ================= VÉRIFICATION CONFIGURATION =================
console.log('\n🔍 VÉRIFICATION DE LA CONFIGURATION...');

const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'SUPABASE_URL', 'SUPABASE_KEY'];
const missingVars = [];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        missingVars.push(envVar);
        console.log(`   ❌ ${envVar}: NON DÉFINI`);
    } else {
        // Masquer les valeurs sensibles
        const value = process.env[envVar];
        const displayValue = envVar.includes('PASS') || envVar.includes('KEY') 
            ? '••••••••' 
            : value.substring(0, 20) + (value.length > 20 ? '...' : '');
        console.log(`   ✅ ${envVar}: ${displayValue}`);
    }
}

if (missingVars.length > 0) {
    console.log(`\n❌ VARIABLES MANQUANTES: ${missingVars.join(', ')}`);
    console.log('⚠️  Vérifiez votre fichier .env');
    process.exit(1);
}

// ================= INITIALISATION SUPABASE =================
console.log('\n🔗 CONNEXION À SUPABASE...');
try {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
    );
    console.log('✅ Connexion Supabase établie');
} catch (error) {
    console.log('❌ Erreur connexion Supabase:', error.message);
    process.exit(1);
}

// ================= VÉRIFICATION FICHIER FIREBASE =================
console.log('\n🔥 VÉRIFICATION FICHIER FIREBASE...');
if (!fs.existsSync('./service-account-key.json')) {
    console.log('❌ Fichier service-account-key.json introuvable');
    process.exit(1);
}

try {
    const serviceAccount = JSON.parse(fs.readFileSync('./service-account-key.json', 'utf8'));
    console.log('✅ Fichier Firebase valide');
    console.log(`   Projet: ${serviceAccount.project_id}`);
} catch (error) {
    console.log('❌ Erreur lecture fichier Firebase:', error.message);
    process.exit(1);
}

// ================= CONFIGURATION TRANSPORT EMAIL =================
console.log('\n📧 CONFIGURATION EMAIL...');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Tester la connexion email
transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ Erreur connexion email:', error.message);
        console.log('💡 Vérifiez:');
        console.log('   1. Email et mot de passe dans .env');
        console.log('   2. Mot de passe d\'application Gmail activé');
        console.log('   3. Accès "applications moins sécurisées" activé si nécessaire');
    } else {
        console.log('✅ Serveur email prêt');
    }
});

console.log('\n' + '=' .repeat(60));
console.log('✅ CONFIGURATION TERMINÉE - PRÊT POUR L\'EXÉCUTION');
console.log('=' .repeat(60));

// ================= FONCTION ENVOI EMAIL =================
function createEmailTemplate(nom, codePromo) {
    const nomAffichage = nom || 'Cher Client';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez Andu Xara</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .promo-box { background: #fff3cd; border-left: 4px solid #f39c12; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
        .promo-code { font-size: 32px; font-weight: bold; color: #d35400; margin: 10px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; }
        .social-links { margin: 15px 0; }
        .social-links a { color: #667eea; margin: 0 10px; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Bienvenue ${nomAffichage} !</h1>
            <p>Merci de rejoindre la communauté Andu Xara</p>
        </div>
        
        <div class="content">
            <p>Bonjour ${nomAffichage},</p>
            
            <p>Nous sommes ravis de vous accueillir dans notre communauté dédiée à la mode africaine authentique.</p>
            
            <div class="promo-box">
                <h3 style="margin-top: 0; color: #7d6608;">VOTRE CADEAU DE BIENVENUE 🎁</h3>
                <div class="promo-code">${codePromo}</div>
                <p style="color: #7d6608;">10% de réduction sur votre première commande</p>
            </div>
            
            <h3>🎯 Comment utiliser votre code :</h3>
            <ol>
                <li>Connectez-vous à votre compte sur <a href="https://anduxara.com">anduxara.com</a></li>
                <li>Allez sur la page <strong>Codes Promo</strong></li>
                <li>Entrez le code <strong>${codePromo}</strong></li>
                <li>Profitez de votre réduction !</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://anduxara.com/reductions.html" class="button">Activer mon code promo</a>
                <br>
                <a href="https://anduxara.com" style="color: #667eea; text-decoration: none; margin-top: 10px; display: inline-block;">Visiter la boutique →</a>
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #0c5460;">📅 IMPORTANT - Dates clés :</h4>
                <p>• <strong>Activation codes</strong> : 3 décembre 2025 à 23h59<br>
                • <strong>Période promo</strong> : 3 au 13 décembre 2025<br>
                • <strong>Fuseau</strong> : Mauritanie (UTC+0)</p>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="https://facebook.com/anduxara">Facebook</a> | 
                <a href="https://instagram.com/andu_xara">Instagram</a> | 
                <a href="https://tiktok.com/@andu_xara">TikTok</a>
            </div>
            <p>Andu Xara • Mode Africaine Authentique<br>
            📧 contact@anduxara.com | 🌐 anduxara.com</p>
            <p style="font-size: 10px; color: #999;">
                Vous recevez cet email car vous avez créé un compte sur Andu Xara.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

async function envoyerEmailBienvenue(email, nom) {
    const nomAffichage = nom || email.split('@')[0];
    const codePromo = 'BIENVENUE10';
    
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Andu Xara <contact@anduxara.com>',
            to: email,
            subject: '🎉 Bienvenue chez Andu Xara ! Votre code promo vous attend',
            html: createEmailTemplate(nomAffichage, codePromo),
            text: `Bonjour ${nomAffichage},

Bienvenue chez Andu Xara ! Nous sommes ravis de vous accueillir.

Votre code promo de bienvenue : ${codePromo}
10% de réduction sur votre première commande.

Comment l'utiliser :
1. Connectez-vous sur https://anduxara.com
2. Allez sur la page Codes Promo
3. Entrez le code ${codePromo}
4. Profitez de votre réduction !

Dates importantes :
• Activation codes : 3 décembre 2025 à 23h59
• Période promo : 3 au 13 décembre 2025
• Fuseau : Mauritanie (UTC+0)

Merci de faire partie de notre communauté !

Andu Xara
Mode Africaine Authentique
contact@anduxara.com
https://anduxara.com`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`   ✅ Email envoyé à: ${email}`);
        return { success: true, email, messageId: info.messageId };
        
    } catch (error) {
        console.log(`   ❌ Erreur pour ${email}: ${error.message}`);
        return { success: false, email, error: error.message };
    }
}

// ================= FONCTION PRINCIPALE =================
async function main() {
    console.log('\n' + '=' .repeat(60));
    console.log('🔄 DÉBUT DE LA SYNCHRONISATION ET ENVOI DES EMAILS');
    console.log('=' .repeat(60));
    
    try {
        // 1. Initialiser Firebase
        console.log('\n🔥 INITIALISATION FIREBASE...');
        const serviceAccount = JSON.parse(fs.readFileSync('./service-account-key.json', 'utf8'));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase initialisé');
        
        // 2. Initialiser Supabase
        console.log('\n🔗 INITIALISATION SUPABASE...');
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY
        );
        
        // 3. Récupérer les nouveaux utilisateurs (24 dernières heures)
        console.log('\n📊 RECHERCHE NOUVEAUX UTILISATEURS...');
        const vingtQuatreHeures = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const listUsersResult = await admin.auth().listUsers();
        const nouveauxUsers = listUsersResult.users.filter(user => 
            user.email && new Date(user.metadata.creationTime) > vingtQuatreHeures
        );
        
        console.log(`   Trouvés: ${nouveauxUsers.length} nouveaux utilisateurs`);
        
        if (nouveauxUsers.length === 0) {
            console.log('\n✅ AUCUN NOUVEL UTILISATEUR - FIN DU SCRIPT');
            admin.app().delete();
            return;
        }
        
        // 4. Vérifier lesquels sont déjà dans Supabase
        console.log('\n🔍 VÉRIFICATION SUPABASE...');
        const emailsFirebase = nouveauxUsers.map(user => user.email);
        
        const { data: existants, error: errorSupabase } = await supabase
            .from('subscribers')
            .select('email')
            .in('email', emailsFirebase);
        
        if (errorSupabase) {
            console.log(`   ❌ Erreur Supabase: ${errorSupabase.message}`);
        } else {
            const emailsExistants = existants?.map(e => e.email) || [];
            const aSynchroniser = nouveauxUsers.filter(user => 
                !emailsExistants.includes(user.email)
            );
            
            console.log(`   À synchroniser: ${aSynchroniser.length} nouveaux`);
            
            // 5. Synchroniser vers Supabase
            if (aSynchroniser.length > 0) {
                console.log('\n💾 SYNCHRONISATION VERS SUPABASE...');
                const nouveauxAbonnes = aSynchroniser.map(user => ({
                    email: user.email,
                    created_at: new Date(user.metadata.creationTime),
                    status: 'active',
                    source: 'firebase_auto_sync',
                    welcome_email_sent: false,
                    display_name: user.displayName || null
                }));
                
                const { error: insertError } = await supabase
                    .from('subscribers')
                    .upsert(nouveauxAbonnes, { onConflict: 'email' });
                
                if (insertError) {
                    console.log(`   ❌ Erreur insertion: ${insertError.message}`);
                } else {
                    console.log(`   ✅ ${nouveauxAbonnes.length} synchronisés`);
                }
            }
            
            // 6. Envoyer les emails de bienvenue
            console.log('\n📧 ENVOI DES EMAILS DE BIENVENUE...');
            let emailsEnvoyes = 0;
            let emailsErreur = 0;
            
            for (const user of aSynchroniser) {
                const result = await envoyerEmailBienvenue(user.email, user.displayName);
                
                if (result.success) {
                    emailsEnvoyes++;
                    
                    // Marquer comme envoyé dans Supabase
                    await supabase
                        .from('subscribers')
                        .update({ 
                            welcome_email_sent: true,
                            welcome_sent_at: new Date()
                        })
                        .eq('email', user.email);
                } else {
                    emailsErreur++;
                }
                
                // Pause pour éviter le spam (2 secondes entre chaque email)
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            // 7. Résumé final
            console.log('\n' + '=' .repeat(60));
            console.log('🎉 SYNCHRONISATION TERMINÉE !');
            console.log('=' .repeat(60));
            console.log(`📊 RÉSULTATS:`);
            console.log(`   • Nouveaux utilisateurs: ${nouveauxUsers.length}`);
            console.log(`   • À synchroniser: ${aSynchroniser.length}`);
            console.log(`   • Emails envoyés: ${emailsEnvoyes}`);
            console.log(`   • Erreurs email: ${emailsErreur}`);
            console.log(`\n⏰ Durée: ${(Date.now() - startTime) / 1000} secondes`);
            
            if (aSynchroniser.length > 0) {
                console.log('\n📧 LISTE DES NOUVEAUX CLIENTS:');
                aSynchroniser.forEach((user, index) => {
                    console.log(`   ${index + 1}. ${user.email} (${user.displayName || 'sans nom'})`);
                });
            }
        }
        
    } catch (error) {
        console.log('\n💥 ERREUR CRITIQUE:', error.message);
        console.log(error.stack);
    } finally {
        // Nettoyer Firebase
        try {
            admin.app().delete();
            console.log('\n🧹 Firebase nettoyé');
        } catch (error) {
            // Ignorer les erreurs de nettoyage
        }
    }
}

// ================= EXÉCUTION =================
const startTime = Date.now();

// Attendre que la vérification email soit terminée
setTimeout(() => {
    main().then(() => {
        console.log('\n' + '=' .repeat(60));
        console.log('✅ SCRIPT TERMINÉ AVEC SUCCÈS');
        console.log('=' .repeat(60));
        process.exit(0);
    }).catch(error => {
        console.log('\n💥 ERREUR EXÉCUTION:', error.message);
        process.exit(1);
    });
}, 3000); // Attendre 3 secondes pour la vérification email
