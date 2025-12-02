// SCRIPT COMPLET POUR ENVOYER À TOUS
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise(resolve => {
  rl.question(question, answer => resolve(answer));
});

console.log('\n' + '='.repeat(60));
console.log('📧 ENVOI COMPLET NEWSLETTER ANDU XARA');
console.log('='.repeat(60));

const supabase = createClient(
  'https://vxvrjeelertkdhfyuiue.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I'
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cheikhdiabira2408@gmail.com',
    pass: 'bccu xlwg gsoh cdni'
  }
});

async function sendToAll() {
  try {
    // 1. Récupérer
    console.log('\n📥 Récupération des 55 abonnés...');
    const { data } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active');
    
    const emails = data.map(s => s.email?.trim()).filter(e => e && e.includes('@'));
    
    console.log(`✅ ${emails.length} emails valides`);
    console.log('\n📋 Exemple:', emails.slice(0, 3).join(', '));
    
    // 2. Confirmation
    console.log('\n' + '-'.repeat(60));
    const confirm = await ask(`Envoyer à ${emails.length} personnes ? (oui/non): `);
    
    if (confirm.toLowerCase() !== 'oui') {
      console.log('❌ Annulé');
      rl.close();
      return;
    }
    
    // 3. Contenu
    const htmlContent = `
<div style="font-family: Arial; max-width:600px; margin:auto; background:#f9f9f9; padding:20px;">
  <div style="background:#8B4513; color:white; padding:30px; text-align:center;">
    <h1>ANDU XARA</h1>
    <p>Mode Africaine d'Excellence</p>
  </div>
  <div style="padding:30px; background:white;">
    <h2>Bonjour !</h2>
    <p>Découvrez nos nouvelles collections 2025.</p>
    <div style="text-align:center; margin:30px 0;">
      <a href="https://andu-xara.store" style="background:#8B4513; color:white; padding:15px 30px; text-decoration:none; border-radius:5px;">
        Voir la collection
      </a>
    </div>
    <p>Code: <strong>ANDU25</strong> (-25%)</p>
    <p>Cordialement,<br>Équipe Andu Xara</p>
  </div>
</div>`;
    
    // 4. Envoi
    console.log('\n📨 Envoi en cours...\n');
    
    let success = 0;
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const percent = Math.round(((i + 1) / emails.length) * 100);
      
      try {
        await transporter.sendMail({
          from: '"Andu Xara" <cheikhdiabira2408@gmail.com>',
          to: email,
          subject: '🌟 Nouveautés Andu Xara 2025',
          html: htmlContent,
          text: 'Découvrez Andu Xara: https://andu-xara.store - Code: ANDU25'
        });
        
        success++;
        console.log(`✅ [${percent}%] ${email}`);
        
        // Pause
        if (i < emails.length - 1) {
          await new Promise(r => setTimeout(r, 100));
        }
        
      } catch (err) {
        console.log(`❌ [${percent}%] ${email}: ${err.message}`);
      }
    }
    
    // 5. Résultat
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSULTAT:');
    console.log(`✅ Succès: ${success}`);
    console.log(`❌ Échecs: ${emails.length - success}`);
    console.log(`🎉 Terminé !`);
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
  } finally {
    rl.close();
  }
}

sendToAll();
