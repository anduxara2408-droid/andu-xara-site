import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Configuration Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./service-account-key.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'andu-xara-promo-codes'  // ← LIGNE AJOUTÉE
});

// Configuration Supabase
const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrerUtilisateurs() {
  try {
    console.log('🚀 Début de la migration directe depuis Firebase...');
    
    // Récupérer tous les utilisateurs Firebase
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.filter(user => user.email);
    
    console.log(`📊 ${users.length} utilisateurs avec email trouvés`);
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans Firebase Auth');
      return;
    }
    
    // Afficher les premiers utilisateurs
    console.log('📧 Exemples d\'utilisateurs:');
    users.slice(0, 5).forEach(user => {
      console.log(`   - ${user.email} (créé le: ${user.metadata.creationTime})`);
    });

    // Préparer les données pour la table subscribers
    const subscribers = users.map(user => ({
      email: user.email,
      created_at: new Date(user.metadata.creationTime),
      status: 'active',
      source: 'firebase_migration'
    }));

    console.log('🔄 Début de l\'insertion dans Supabase...');

    // Insérer par lots de 20
    const batchSize = 20;
    let totalInserted = 0;
    let errors = 0;
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      try {
        const { error } = await supabase
          .from('subscribers')
          .upsert(batch, { onConflict: 'email' });

        if (error) {
          console.error(`❌ Erreur lot ${i}:`, error.message);
          errors++;
        } else {
          totalInserted += batch.length;
          console.log(`✅ Lot ${i}-${i + batchSize}: ${batch.length} utilisateurs`);
        }
      } catch (batchError) {
        console.error(`💥 Erreur critique lot ${i}:`, batchError.message);
        errors++;
      }
      
      // Pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n🎉 MIGRATION TERMINÉE !');
    console.log(`📊 Statistiques:`);
    console.log(`   • Utilisateurs trouvés: ${users.length}`);
    console.log(`   • Migrés avec succès: ${totalInserted}`);
    console.log(`   • Erreurs: ${errors}`);
    console.log(`   • Taux de réussite: ${((totalInserted / users.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('💥 Erreur lors de la migration:', error);
  } finally {
    // Nettoyer
    admin.app().delete();
  }
}

migrerUtilisateurs();
