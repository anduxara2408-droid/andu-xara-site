import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Configuration Supabase
const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration Gmail - ANDU XARA
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anduxara2408@gmail.com',
    pass: 'leyv edym khzj ggva'
  }
});

async function envoyerNewsletterGmail() {
  try {
    console.log('📧 Préparation newsletter Gmail...');
    
    // Récupérer 3 abonnés pour test
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active')
      .limit(3);

    console.log(`🎯 Envoi test à ${subscribers.length} abonnés:`);

    for (const subscriber of subscribers) {
      const mailOptions = {
        from: '"Andu Xara" <anduxara2408@gmail.com>',
        to: subscriber.email,
        subject: '🎉 Bienvenue - Newsletter Andu Xara',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #4F46E5; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">🎉 Andu Xara</h1>
              <p>Mode Africaine Authentique</p>
            </div>
            <div style="padding: 30px;">
              <h2>Bienvenue dans notre communauté !</h2>
              <p>Merci de vous être abonné à notre newsletter.</p>
              <p><strong>Avantages exclusifs :</strong></p>
              <ul>
                <li>📱 Nouveautés en avant-première</li>
                <li>🎁 Offres réservées aux abonnés</li>
                <li>✨ Conseils mode personnalisés</li>
                <li>🏆 Accès prioritaire aux ventes</li>
              </ul>
              <p>Restez connecté pour découvrir les dernières tendances de la mode africaine moderne.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://anduxara.com" style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Découvrir notre collection
                </a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; background: #f5f5f5; color: #666;">
              <p><strong>Andu Xara</strong> - Votre marque de mode africaine</p>
              <p>Email: anduxara2408@gmail.com | Site: https://anduxara.com</p>
              <p><a href="#" style="color: #4F46E5;">Se désabonner</a></p>
              <p>&copy; 2025 Andu Xara. Tous droits réservés.</p>
            </div>
          </div>
        `,
        text: `Bienvenue dans la newsletter Andu Xara ! Merci de vous être abonné. Vous serez parmi les premiers à découvrir nos nouvelles collections, bénéficier d'offres exclusives et recevoir des conseils mode. Restez connecté pour ne rien manquer ! Visitez notre site : https://anduxara.com`
      };

      console.log(`📨 Envoi à: ${subscriber.email}`);
      
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Envoyé: ${info.messageId}`);
      
      // Pause de 2 secondes entre les envois
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('🎉 Newsletter test envoyée avec succès !');
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

envoyerNewsletterGmail();
