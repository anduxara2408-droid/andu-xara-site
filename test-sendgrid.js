// Script prêt pour SendGrid - gratuit 100 emails/jour
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxvrjeelertkdhfyuiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dnJqZWVsZXJ0a2RoZnl1aXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjk4ESIsImV4cCI6MjA3NzMwODk4MX0.0ksgc8JZF2N5J9FnW3CLoG_v_CAQxUtm3ISLRJPLE3I';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('📧 Pour utiliser SendGrid:');
console.log('1. Allez sur: https://signup.sendgrid.com');
console.log('2. Créez un compte gratuit');
console.log('3. Validez votre email');
console.log('4. Créez une clé API dans Settings > API Keys');
console.log('5. Nous l\'utiliserons pour envoyer des newsletters!');

console.log('\n✅ En attendant, vos 50 abonnés sont prêts dans Supabase!');
