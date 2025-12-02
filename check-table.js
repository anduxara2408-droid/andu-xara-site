require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkTableStructure() {
  console.log('🔍 Vérification structure table subscribers...\n');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  try {
    // 1. Vérifiez les colonnes existantes
    const { data: columns, error } = await supabase
      .from('subscribers')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Erreur accès table:', error.message);
      return;
    }

    if (columns && columns.length > 0) {
      const sample = columns[0];
      console.log('📊 COLONNES DÉTECTÉES:');
      console.log('='.repeat(40));
      
      Object.keys(sample).forEach(key => {
        const value = sample[key];
        const type = typeof value;
        console.log(`• ${key}: ${type} (ex: ${value})`);
      });
      
      console.log('\n🔍 COLONNES DE TRACKING REQUISES:');
      console.log('='.repeat(40));
      
      const requiredColumns = [
        'welcome_email_sent',
        'welcome_email_sent_at',
        'email_attempts',
        'promo_code_sent'
      ];
      
      requiredColumns.forEach(col => {
        const hasColumn = col in sample;
        console.log(`${hasColumn ? '✅' : '❌'} ${col}`);
      });
    } else {
      console.log('ℹ️ Table vide ou sans données');
    }

    // 2. Comptez les abonnés
    const { count, error: countError } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`\n👥 NOMBRE D'ABONNÉS: ${count}`);
    }

    // 3. Vérifiez ceux qui n'ont pas reçu d'email
    const { data: pending, error: pendingError } = await supabase
      .from('subscribers')
      .select('email, created_at')
      .eq('welcome_email_sent', false)
      .or('welcome_email_sent.is.null')
      .limit(5);

    if (!pendingError && pending && pending.length > 0) {
      console.log(`\n📧 EMAILS EN ATTENTE (${pending.length} au total):`);
      pending.forEach(sub => {
        console.log(`• ${sub.email} (inscrit: ${new Date(sub.created_at).toLocaleDateString('fr-FR')})`);
      });
    }

  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

checkTableStructure();
