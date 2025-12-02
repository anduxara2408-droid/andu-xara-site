// SIMPLE ET EFFICACE - En 1 commande
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

console.log('🚀 NEWSLETTER ANDU XARA - 1 COMMANDE\n');

// Configuration (remplacer avec vos vraies valeurs si besoin)
const CONFIG = {
  supabase: {
    url: 'https://vxvrjeelertkdhfyuiue.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I'
  },
  gmail: {
    user: 'cheikhdiabira2408@gmail.com',
    pass: 'bccu xlwg gsoh cdni' // Mot de passe d'application
  }
};

async function run() {
  console.log('1. 🔗 Connexion à Supabase...');
  const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.key);
  
  console.log('2. 📥 Récupération des abonnés...');
  const { data } = await supabase
    .from('subscribers')
    .select('email')
    .eq('status', 'active');
  
  if (!data || data.length === 0) {
    console.log('❌ Aucun abonné');
    return;
  }
  
  const emails = data.map(s => s.email?.trim()).filter(e => e && e.includes('@'));
  console.log(`✅ ${emails.length} emails prêts\n`);
  
  console.log('3. 📧 Configuration Gmail...');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: CONFIG.gmail
  });
  
  // Test rapide
  console.log('4. 🧪 Test rapide avec 2 emails...');
  
  const testEmails = emails.slice(0, 2);
  for (const email of testEmails) {
    try {
      await transporter.sendMail({
        from: '"Andu Xara" <cheikhdiabira2408@gmail.com>',
        to: email,
        subject: 'Test Newsletter',
        text: 'Test réussi!'
      });
      console.log(`   ✅ ${email}`);
    } catch (err) {
      console.log(`   ❌ ${email}: ${err.message}`);
    }
  }
  
  console.log('\n🎉 PRÊT POUR ENVOI COMPLET !');
  console.log('\n💡 Pour envoyer à tous:');
  console.log('   node send-complete-newsletter.js');
}

run().catch(console.error);
