// SCRIPT DE GESTION DES ABONNÉS
// Pour ajouter, vérifier, exporter les abonnés

import { createClient } from '@supabase/supabase-js';

const CONFIG = {
  supabaseUrl: 'https://vxvrjeelertkdhfyuiue.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4MSwiZXhwIjoyMDc3MzA4OTgxfQ.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I'
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

async function statistiques() {
  const { count, error } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  console.log(`📊 ${count} abonnés dans la base`);
}

async function ajouterAbonne(email) {
  const { error } = await supabase
    .from('subscribers')
    .upsert({
      email: email,
      created_at: new Date(),
      status: 'active',
      source: 'manuel'
    }, { onConflict: 'email' });

  if (error) throw error;
  console.log(`✅ ${email} ajouté`);
}

async function exporterCSV() {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*');
  
  if (error) throw error;
  
  const csv = ['email,status,source,created_at']
    .concat(data.map(row => 
      `"${row.email}","${row.status}","${row.source}","${row.created_at}"`
    )).join('\n');
  
  require('fs').writeFileSync('abonnes-export.csv', csv);
  console.log('📥 Fichier abonnes-export.csv créé');
}

// Exécution
const commande = process.argv[2];
const argument = process.argv[3];

switch (commande) {
  case 'stats':
    statistiques();
    break;
  case 'add':
    ajouterAbonne(argument);
    break;
  case 'export':
    exporterCSV();
    break;
  default:
    console.log(`
Usage:
  node gestion-abonnes.js stats
  node gestion-abonnes.js add email@exemple.com
  node gestion-abonnes.js export
    `);
}
