// SCRIPT PRINCIPAL NEWSLETTER ANDU XARA
// À exécuter pour envoyer des newsletters

import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// CONFIGURATION - À MODIFIER AVANT LANCEMENT
const CONFIG = {
  supabaseUrl: 'https://vxvrjeelertkdhfyuiue.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I',
  email: {
    service: 'gmail',
    auth: {
      user: 'anduxara2408@gmail.com', // À changer si besoin
      pass: 'leyv edym khzj ggva'     // À changer si besoin
    }
  },
  siteUrl: 'https://andu-xara.store',
  emails: {
    contact: 'contact@andu-xara.store',
    partenariat: 'partenariat@andu-xara.store',
    support: 'support@andu-xara.store'
  }
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
const transporter = nodemailer.createTransport(CONFIG.email);

async function envoyerNewsletter(template = 'bienvenue') {
  try {
    console.log(`📧 Préparation newsletter: ${template}`);
    
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active');

    console.log(`🎯 Envoi à ${subscribers.length} abonnés...`);

    let successCount = 0;

    for (const subscriber of subscribers) {
      try {
        const sujet = template === 'promotion' 
          ? '🔥 OFFRE EXCLUSIVE - 20% DE RÉDUCTION !' 
          : '🎉 Bienvenue dans la famille Andu Xara !';

        await transporter.sendMail({
          from: `"Andu Xara" <${CONFIG.emails.contact}>`,
          to: subscriber.email,
          subject: sujet,
          html: getTemplateHTML(template),
          text: getTemplateText(template)
        });

        successCount++;
        console.log(`✅ ${subscriber.email}`);
        
        // Pause anti-spam
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.log(`❌ ${subscriber.email}: ${error.message}`);
      }
    }

    console.log(`\n🎉 NEWSLETTER ENVOYÉE !`);
    console.log(`📊 ${successCount}/${subscribers.length} emails distribués`);
    
  } catch (error) {
    console.log('💥 Erreur:', error.message);
  }
}

function getTemplateHTML(template) {
  if (template === 'promotion') {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); color: white; padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2.5em;">🎉 Andu Xara</h1>
          <p style="font-size: 1.2em;">Offre exclusive réservée aux abonnés</p>
        </div>
        <div style="padding: 40px;">
          <h2>20% DE RÉDUCTION !</h2>
          <p>Code: <strong>ANDU20</strong></p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${CONFIG.siteUrl}" style="background: #FF6B6B; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Profiter de l'offre
            </a>
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2.5em;">🎉 Andu Xara</h1>
          <p style="font-size: 1.2em;">Votre marque de mode africaine authentique</p>
        </div>
        <div style="padding: 40px;">
          <h2>Bienvenue dans notre communauté !</h2>
          <p>Merci de vous être abonné à notre newsletter.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${CONFIG.siteUrl}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Découvrir notre collection
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

function getTemplateText(template) {
  if (template === 'promotion') {
    return 'Offre exclusive Andu Xara - 20% de réduction avec le code ANDU20';
  } else {
    return 'Bienvenue dans la newsletter Andu Xara !';
  }
}

// USAGE:
// node newsletter-principal.js bienvenue
// node newsletter-principal.js promotion

const action = process.argv[2] || 'bienvenue';
envoyerNewsletter(action);
