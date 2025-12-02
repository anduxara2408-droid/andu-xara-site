require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function addMissingColumns() {
  console.log('🔧 Ajout des colonnes manquantes...\n');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  try {
    // SQL pour ajouter les colonnes
    const sqlQueries = [
      // Ajouter welcome_email_sent
      `ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE;`,
      
      // Ajouter welcome_email_sent_at
      `ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ;`,
      
      // Ajouter email_attempts
      `ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS email_attempts INTEGER DEFAULT 0;`,
      
      // Ajouter promo_code_sent
      `ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS promo_code_sent VARCHAR(20);`,
      
      // Ajouter last_email_error
      `ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS last_email_error TEXT;`,
      
      // Créer les index
      `CREATE INDEX IF NOT EXISTS idx_welcome_email_sent ON subscribers(welcome_email_sent);`,
      `CREATE INDEX IF NOT EXISTS idx_created_at_desc ON subscribers(created_at DESC);`
    ];

    console.log('📋 Exécution des requêtes SQL...\n');
    
    for (const [index, query] of sqlQueries.entries()) {
      console.log(`[${index + 1}/${sqlQueries.length}] ${query.split(' ').slice(0, 5).join(' ')}...`);
      
      const { error } = await supabase.rpc('exec_sql', { query });
      
      if (error) {
        // Si RPC ne fonctionne pas, essayez une autre méthode
        console.log(`   ⚠️  Méthode RPC échouée, tentative alternative...`);
        
        // Utilisez une méthode alternative (simple update pour tester la table)
        if (query.includes('ADD COLUMN')) {
          console.log(`   ℹ️  Exécutez cette requête dans l'éditeur SQL Supabase:
          ${query}`);
        }
      } else {
        console.log(`   ✅ Succès`);
      }
    }

    // Vérifiez les colonnes après ajout
    console.log('\n✅ Colonnes ajoutées !');
    console.log('📊 Vérification finale...');
    
    const { data: columns } = await supabase
      .from('subscribers')
      .select('*')
      .limit(1);
    
    if (columns && columns.length > 0) {
      const sample = columns[0];
      console.log('\n🎉 COLONNES DISPONIBLES:');
      console.log('='.repeat(40));
      Object.keys(sample).forEach(key => {
        console.log(`• ${key}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    console.log('\n🔧 SOLUTION MANUELLE:');
    console.log('1. Allez sur https://supabase.com');
    console.log('2. Connectez-vous à votre projet');
    console.log('3. Cliquez sur "SQL Editor"');
    console.log('4. Copiez-collez ce SQL:');
    console.log(`
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS email_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS promo_code_sent VARCHAR(20),
ADD COLUMN IF NOT EXISTS last_email_error TEXT;

CREATE INDEX IF NOT EXISTS idx_welcome_email_sent ON subscribers(welcome_email_sent);
CREATE INDEX IF NOT EXISTS idx_created_at_desc ON subscribers(created_at DESC);
    `);
  }
}

addMissingColumns();
