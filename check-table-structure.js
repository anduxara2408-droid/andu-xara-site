require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkTable() {
  console.log('🔍 Vérification de la table subscribers...\n');
  
  try {
    // 1. Voir les premières lignes pour comprendre la structure
    const { data: sample, error: sampleError } = await supabase
      .from('subscribers')
      .select('*')
      .limit(5);
    
    if (sampleError) {
      console.error('❌ Erreur:', sampleError.message);
      
      // Essayer d'autres noms de table
      const tables = ['newsletter', 'abonnes', 'emails', 'users', 'contacts'];
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(2);
        if (!error && data) {
          console.log(`\n✅ Table trouvée: ${table}`);
          console.log('Structure:', Object.keys(data[0]));
          console.log('Exemple:', data[0]);
          return;
        }
      }
      return;
    }
    
    if (!sample || sample.length === 0) {
      console.log('⚠️  Table vide');
      return;
    }
    
    console.log('✅ Table subscribers trouvée');
    console.log('\n📊 STRUCTURE:');
    console.log('Colonnes:', Object.keys(sample[0]));
    
    console.log('\n📋 PREMIERS ENREGISTREMENTS:');
    sample.forEach((row, i) => {
      console.log(`\n[${i+1}] ${JSON.stringify(row, null, 2)}`);
    });
    
    // Compter le total
    const { count, error: countError } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`\n🧮 TOTAL: ${count} enregistrements`);
    }
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

checkTable();
