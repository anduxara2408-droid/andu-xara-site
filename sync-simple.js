import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifierStatut() {
  try {
    console.log('📊 Vérification du statut...');
    
    // Compter les abonnés
    const { count, error } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    console.log(`✅ ${count} abonnés dans la base de données`);
    console.log('💡 Pour ajouter manuellement un nouvel abonné:');
    console.log('   node ajouter-abonne.js email@exemple.com');
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}


verifierStatut();
