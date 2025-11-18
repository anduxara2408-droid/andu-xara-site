import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Configuration
const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./service-account-key.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'andu-xara-promo-codes'
});

async function synchroniserNouveauxUtilisateurs() {
  try {
    console.log('🔄 Début de la synchronisation...');
    
    // 1. Récupérer les utilisateurs Firebase créés dans les dernières 24h
    const vingtQuatreHeures = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const listUsersResult = await admin.auth().listUsers();
    const nouveauxUsers = listUsersResult.users.filter(user => 
      user.email && new Date(user.metadata.creationTime) > vingtQuatreHeures
    );

    console.log(`📊 ${nouveauxUsers.length} nouveaux utilisateurs trouvés`);

    if (nouveauxUsers.length === 0) {
      console.log('✅ Aucun nouvel utilisateur à synchroniser');
      return;
    }

    // 2. Vérifier lesquels ne sont pas déjà dans Supabase
    const emailsFirebase = nouveauxUsers.map(user => user.email);
    
    const { data: existants } = await supabase
      .from('subscribers')
      .select('email')
      .in('email', emailsFirebase);

    const emailsExistants = existants?.map(e => e.email) || [];
    const aSynchroniser = nouveauxUsers.filter(user => 
      !emailsExistants.includes(user.email)
    );

    console.log(`🎯 ${aSynchroniser.length} nouveaux à ajouter`);

    // 3. Ajouter les nouveaux à Supabase
    if (aSynchroniser.length > 0) {
      const nouveauxAbonnes = aSynchroniser.map(user => ({
        email: user.email,
        created_at: new Date(user.metadata.creationTime),
        status: 'active',
        source: 'firebase_auto_sync'
      }));

      const { error } = await supabase
        .from('subscribers')
        .upsert(nouveauxAbonnes, { onConflict: 'email' });

      if (error) {
        console.log('❌ Erreur insertion:', error.message);
      } else {
        console.log(`✅ ${nouveauxAbonnes.length} nouveaux abonnés synchronisés`);
        
        // Afficher les nouveaux ajoutés
        nouveauxAbonnes.forEach(abonne => {
          console.log(`   📧 ${abonne.email}`);
        });
      }
    }

    console.log('🎉 Synchronisation terminée !');
    
  } catch (error) {
    console.log('💥 Erreur synchronisation:', error.message);
  } finally {
    admin.app().delete();
  }
}

// Exécuter la synchronisation
synchroniserNouveauxUtilisateurs();
