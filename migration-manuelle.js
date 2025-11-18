import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

// Liste complète des 60 emails depuis Firebase
const emails = [
  "adx@gmail.com",
  "ajarfoot2408@gmail.com",
  "ama@gmail.com",
  "anduxara.newsletter@gmail.com",
  "anduxara.newslettre@gmail.com",
  "anduxara2408@gmail.com",
  "arr@gmail.com",
  "assa@gmail.com",
  "azerty@gmail.com",
  "cheikh2408@gmail.com",
  "cheikh@gmail.com",
  "cheikhdiabira2408@gmail.com",
  "cheikhou@gmail.com",
  "compte1224@gmail.com",
  "compte1@gmail.com",
  "compte24@gmail.com",
  "compte2@gmail.com",
  "coumba24@gmail.com",
  "dde@gmail.com",
  "diabira@gmail.com",
  "filleul@gmail.com",
  "inco@gmail.com",
  "incognito2408@gmail.com",
  "issa@gmail.com",
  "isssa@gmail.com",
  "microsansfiltre2408@gmail.com",
  "mocrfned2408@gmail.com",
  "moi@gmail.com",
  "new@gmail.com",
  "nfd@gmail.com",
  "pas@gmail.com",
  "pendaabou345@gmail.com",
  "pr@gmail.com",
  "qsdf@gmail.com",
  "qsdfg@gmail.com",
  "qsdfgh@gmail.com",
  "saka2408@gmail.com",
  "sassa@gmail.com",
  "sdd@gmail.com",
  "sdfg@gmail.com",
  "serviceclient2408@gmail.com",
  "sidy@gmail.com",
  "sikhoudiabira2408@gmail.com",
  "siko2408@gmail.com",
  "sisi@gmail.com",
  "sissi@gmail.com",
  "snas@gmail.com",
  "sokhou2408@gmail.com",
  "sou@gmail.com",
  "ssigafatima@gmail.com"
];

async function migrerManuellement() {
  console.log(`🚀 Début de la migration manuelle de ${emails.length} emails...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const email of emails) {
    try {
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          email: email,
          created_at: new Date(),
          status: 'active',
          source: 'firebase_migration'
        }, { onConflict: 'email' });

      if (error) {
        console.log(`❌ ${email}: ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ ${email}`);
        successCount++;
      }
    } catch (err) {
      console.log(`💥 ${email}: ${err.message}`);
      errorCount++;
    }
    
    // Petite pause
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n🎉 MIGRATION TERMINÉE !`);
  console.log(`📊 Résultat: ${successCount} réussis, ${errorCount} erreurs`);
  console.log(`📈 Taux de réussite: ${((successCount / emails.length) * 100).toFixed(1)}%`);
}

migrerManuellement();
