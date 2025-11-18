import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'anduxara2408@gmail.com', pass: 'leyv edym khzj ggva' }
});

async function envoyerPromo() {
  try {
    console.log('🔥 Préparation de l\'offre exclusive...');
    
    const { data: subscribers } = await supabase.from('subscribers').select('email');
    
    console.log(`🎯 Envoi à ${subscribers.length} abonnés...`);

    let successCount = 0;

    for (const subscriber of subscribers) {
      try {
        await transporter.sendMail({
          from: '"Andu Xara" <contact@andu-xara.store>',
          to: subscriber.email,
          subject: '🔥 OFFRE EXCLUSIVE - 20% DE RÉDUCTION !',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); color: white; padding: 40px; text-align: center; }
                    .promo-badge { background: #FFD700; color: #333; padding: 10px 20px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }
                    .content { padding: 40px; }
                    .code-promo { background: #2C3E50; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; font-size: 1.5em; font-weight: bold; }
                    .btn { background: #FF6B6B; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; }
                    .footer { text-align: center; padding: 30px; background: #f8f9fa; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 2.5em;">🎉 ANDU XARA</h1>
                        <p style="font-size: 1.2em;">Votre marque de mode africaine</p>
                        <div class="promo-badge">OFFRE ABONNÉS EXCLUSIVE</div>
                    </div>
                    
                    <div class="content">
                        <h2>Cher(e) abonné(e),</h2>
                        <p>Pour vous remercier de faire partie de notre communauté, nous vous offrons une réduction exceptionnelle :</p>
                        
                        <div class="code-promo">
                            ⭐ CODE : <strong>ANDU20</strong> ⭐<br>
                            <small>20% de réduction sur toute la collection</small>
                        </div>
                        
                        <p><strong>Cette offre exclusive vous donne droit à :</strong></p>
                        <ul>
                            <li>✅ 20% de réduction immédiate</li>
                            <li>✅ Valable sur tous les articles</li>
                            <li>✅ Livraison offerte dès 1000 MRU d'achat</li>
                            <li>✅ Valable 7 jours seulement</li>
                        </ul>
                        
                        <p>Découvrez notre nouvelle collection "Harmonie Africaine" et profitez de cette offre spéciale !</p>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="https://andu-xara.store" class="btn">
                                🛍️ PROFITER DE L'OFFRE
                            </a>
                        </div>
                        
                        <p style="text-align: center; font-size: 0.9em; color: #666;">
                            ⏰ Offre valable jusqu'au ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>Andu Xara</strong> - Mode Africaine Authentique</p>
                        <p>📧 contact@andu-xara.store | 🌐 https://andu-xara.store</p>
                        <p><a href="#" style="color: #FF6B6B;">Se désabonner</a></p>
                        <p style="font-size: 12px;">&copy; 2025 Andu Xara. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
          `,
          text: `OFFRE EXCLUSIVE ANDU XARA - 20% DE RÉDUCTION !

Cher abonné,

Pour vous remercier, nous vous offrons 20% de réduction sur toute notre collection avec le code : ANDU20

Cette offre exclusive vous donne droit à :
✅ 20% de réduction immédiate
✅ Valable sur tous les articles  
✅ Livraison offerte dès 50€ d'achat
✅ Valable 7 jours seulement

Profitez-en vite : https://andu-xara.store

Andu Xara - Mode Africaine Authentique
contact@andu-xara.store | https://andu-xara.store

Offre valable jusqu'au ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}`
        });

        console.log(`✅ ${subscriber.email}`);
        successCount++;
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.log(`❌ ${subscriber.email}: ${error.message}`);
      }
    }

    console.log(`\n🎉 PROMOTION ENVOYÉE ! ${successCount}/${subscribers.length} réussis`);
    
  } catch (error) {
    console.log('💥 Erreur:', error.message);
  }
}

envoyerPromo();
