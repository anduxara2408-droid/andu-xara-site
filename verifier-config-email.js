const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifierConfigEmail() {
  console.log('🔍 Vérification configuration email Supabase...');
  console.log('URL Supabase:', supabaseUrl);
  
  try {
    // 1. Vérifier si des emails ont déjà été envoyés
    const { data: emails, error } = await supabase
      .from('email_logs')  // Table possible pour les logs d'emails
      .select('*')
      .limit(5);
    
    if (!error && emails && emails.length > 0) {
      console.log('📧 Derniers emails envoyés:');
      emails.forEach(email => {
        console.log(`   - De: ${email.from_email} à: ${email.to_email}, Sujet: ${email.subject}`);
      });
    } else {
      console.log('📭 Aucun log d\'email trouvé');
    }
    
    // 2. Vérifier la table subscribers pour voir quel email est utilisé
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .select('email, created_at, source')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (!subError && subscribers && subscribers.length > 0) {
      console.log('\n👥 Derniers abonnés:');
      subscribers.forEach(sub => {
        console.log(`   - ${sub.email} (${sub.source || 'source inconnue'})`);
      });
      
      // Vérifier quel domaine d'email est le plus utilisé
      const domains = subscribers.map(s => s.email.split('@')[1]);
      const domainCount = domains.reduce((acc, domain) => {
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n🌍 Statistiques domaines:');
      Object.entries(domainCount).forEach(([domain, count]) => {
        console.log(`   - ${domain}: ${count} utilisateurs`);
      });
    }
    
    // 3. Vérifier si SendGrid est configuré
    console.log('\n🔄 Vérification SendGrid...');
    // Note: Supabase utilise souvent SendGrid pour les emails
    // Vérifiez dans l'interface Supabase : Settings → API → Configurations
    
    console.log('\n💡 Pour vérifier dans l\'interface Supabase:');
    console.log('1. Connectez-vous à https://app.supabase.com');
    console.log('2. Allez dans votre projet');
    console.log('3. Settings → API');
    console.log('4. Vérifiez les configurations d\'email/SendGrid');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

verifierConfigEmail();
