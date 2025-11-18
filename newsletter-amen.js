import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Configuration Supabase
const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration SMTP Amen.fr - REMPLACEZ LE MOT DE PASSE
const transporter = nodemailer.createTransport({
  host: 'smtp.amen.fr',
  port: 587,
  secure: false,
  auth: {
    user: 'contact@andu-xara.store',
    pass: 'Adx.store@ContactCLIENT'
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function envoyerNewsletterAmen() {
  try {
    console.log('📧 Lancement de la newsletter via Amen.fr...');
    
    // Récupérer TOUS les abonnés actifs
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active');

    console.log(`🎯 Envoi à ${subscribers.length} abonnés...`);

    let successCount = 0;
    let errorCount = 0;

    for (const subscriber of subscribers) {
      try {
        const mailOptions = {
          from: '"Andu Xara" <contact@andu-xara.store>',
          to: subscriber.email,
          subject: '🎉 Bienvenue dans la famille Andu Xara !',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center;">
                <h1 style="margin: 0; font-size: 2.5em;">🎉 Andu Xara</h1>
                <p style="font-size: 1.2em; opacity: 0.9;">Votre marque de mode africaine authentique</p>
              </div>
              <div style="padding: 40px;">
                <h2>Bienvenue dans notre communauté exclusive !</h2>
                <p>Cher(e) abonné(e),</p>
                <p>Nous sommes ravis de vous compter parmi nous. Votre abonnement vous donne accès à des avantages exclusifs :</p>
                
                <div style="margin: 30px 0;">
                  <div style="display: flex; align-items: center; margin: 15px 0;">
                    <span style="font-size: 24px; margin-right: 15px;">📱</span>
                    <span><strong>Première main</strong> sur nos nouvelles collections</span>
                  </div>
                  <div style="display: flex; align-items: center; margin: 15px 0;">
                    <span style="font-size: 24px; margin-right: 15px;">🎁</span>
                    <span><strong>Offres spéciales</strong> réservées aux abonnés</span>
                  </div>
                  <div style="display: flex; align-items: center; margin: 15px 0;">
                    <span style="font-size: 24px; margin-right: 15px;">✨</span>
                    <span><strong>Conseils mode</strong> personnalisés chaque semaine</span>
                  </div>
                  <div style="display: flex; align-items: center; margin: 15px 0;">
                    <span style="font-size: 24px; margin-right: 15px;">🏆</span>
                    <span><strong>Accès prioritaire</strong> aux soldes et événements</span>
                  </div>
                </div>

                <p>Notre prochaine collection "Harmonie Africaine" arrive bientôt. Restez connecté pour être parmi les premiers à la découvrir !</p>
                
                <div style="text-align: center; margin: 40px 0;">
                  <a href="https://andu-xara.store" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                    🌟 Découvrir notre collection
                  </a>
                </div>
              </div>
              <div style="text-align: center; padding: 30px; background: #f8f9fa; color: #666;">
                <p><strong>Andu Xara</strong> - Excellence en mode africaine</p>
                <p>📧 <strong>Contact:</strong> contact@andu-xara.store</p>
                <p>🤝 <strong>Partenariats:</strong> partenariat@andu-xara.store</p>
                <p>🛟 <strong>Support:</strong> support@andu-xara.store</p>
                <p>🌐 <strong>Site:</strong> https://andu-xara.store</p>
                <p style="margin-top: 20px;">
                  <a href="#" style="color: #667eea; margin-right: 15px;">Se désabonner</a>
                  <a href="#" style="color: #667eea;">Gérer mes préférences</a>
                </p>
                <p style="font-size: 12px; margin-top: 20px;">&copy; 2025 Andu Xara. Tous droits réservés.</p>
              </div>
            </div>
          `,
          text: `Bienvenue dans la newsletter Andu Xara !

Merci de vous être abonné. Vous serez parmi les premiers à découvrir nos nouvelles collections et offres exclusives.

Contact: contact@andu-xara.store
Partenariats: partenariat@andu-xara.store
Support: support@andu-xara.store
Site: https://andu-xara.store

Restez connecté !`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ ${subscriber.email}`);
        successCount++;
        
      } catch (error) {
        console.log(`❌ ${subscriber.email}: ${error.message}`);
        errorCount++;
      }
      
      // Pause de 3 secondes entre les envois
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('\n🎉 NEWSLETTER AMEN.FR TERMINÉE !');
    console.log(`📊 Résultat: ${successCount} réussis, ${errorCount} erreurs`);
    console.log(`📈 Taux de réussite: ${((successCount / subscribers.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.log('💥 Erreur SMTP:', error.message);
  }
}

envoyerNewsletterAmen();
