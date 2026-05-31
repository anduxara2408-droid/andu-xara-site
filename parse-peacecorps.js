const fs = require('fs');

const text = fs.readFileSync('soninke.txt', 'utf8');
const lines = text.split('\n');

const dict = {};

// Fonction pour nettoyer une chaîne (enlève les caractères spéciaux, les numéros, etc.)
function clean(str) {
    return str.trim().replace(/[^\p{L}\p{M}\s-]/gu, '').toLowerCase();
}

for (let line of lines) {
    line = line.trim();
    if (line.length < 3) continue;
    // Ignorer les lignes d'en-tête, de numéros de page, etc.
    if (line.match(/^\d+$/) || line.startsWith('Hosted') || line.startsWith('Lesson') || line.startsWith('Soninke')) continue;

    // Chercher des motifs : "mot1 mot2" (séparés par 2 espaces ou plus)
    let parts = line.split(/\s{2,}/);
    if (parts.length === 2) {
        let soninke = clean(parts[0]);
        let french = clean(parts[1]);
        if (soninke && french && soninke.length > 1 && french.length > 1) {
            dict[soninke] = french;
            dict[french] = soninke;
        }
    } else {
        // Sinon, essayer avec un seul espace mais vérifier que le second mot n'est pas un verbe anglais etc.
        parts = line.split(/\s+/);
        if (parts.length === 2 && !parts[0].match(/[0-9]/) && !parts[1].match(/[0-9]/)) {
            let soninke = clean(parts[0]);
            let french = clean(parts[1]);
            if (soninke && french && soninke.length > 1 && french.length > 1 && french !== 'a' && french !== 'an') {
                dict[soninke] = french;
                dict[french] = soninke;
            }
        }
    }
}

// Ajout manuel des phrases de salutation les plus importantes (pour garantir)
const greetings = {
    "an moxo": "comment ça va ?",
    "ma jam": "je vais bien",
    "beeta": "bonjour",
    "sunka": "bonsoir",
    "nawaari": "merci",
    "bisimilla": "de rien",
    "hari na o koyi me": "au revoir"
};
Object.assign(dict, greetings);

fs.writeFileSync('peacecorps-dict.json', JSON.stringify(dict, null, 2));
console.log(`✅ ${Object.keys(dict).length} entrées extraites du Peace Corps.`);
