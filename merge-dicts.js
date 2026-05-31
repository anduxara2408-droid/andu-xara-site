const fs = require('fs');

// Charger les deux dictionnaires
const peace = JSON.parse(fs.readFileSync('peacecorps-dict.json', 'utf8'));
const cnrs = JSON.parse(fs.readFileSync('cnrs-dict.json', 'utf8'));

// Fusionner (les entrées CNRS écrasent les éventuelles doublons du Peace Corps)
const finalDict = { ...peace, ...cnrs };

// Sauvegarder
fs.writeFileSync('final-dictionary.json', JSON.stringify(finalDict, null, 2));
console.log(`✅ Fusion réussie : ${Object.keys(finalDict).length} entrées au total.`);
console.log(`   - Peace Corps : ${Object.keys(peace).length}`);
console.log(`   - CNRS : ${Object.keys(cnrs).length}`);
