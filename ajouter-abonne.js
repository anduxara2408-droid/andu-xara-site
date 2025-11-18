import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

async function ajouterAbonne(email) {
  try {
    if (!email) {
      console.log('❌ Usage: node ajouter-abonne.js email@exemple.com');
      return;
    }

    console.log(`📧 Ajout de: ${email}`);
    
    const { error } = await supabase
      .from('subscribers')
      .upsert({
        email: email,
        created_at: new Date(),
        status: 'active',
        source: 'manuel'
      }, { onConflict: 'email' });

    if (error) {
      console.log('❌ Erreur:', error.message);
    } else {
      console.log('✅ Abonné ajouté avec succès!');
    }
    
  } catch (error) {
    console.log('💥 Erreur:', error.message);
  }
}

// Récupérer l'email depuis les arguments
const email = process.argv[2];
ajouterAbonne(email);
