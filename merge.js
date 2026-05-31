const fs = require('fs');
const peace = JSON.parse(fs.readFileSync('peacecorps-dict.json', 'utf8'));
const cnrs = fs.existsSync('cnrs-dict.json') ? JSON.parse(fs.readFileSync('cnrs-dict.json', 'utf8')) : {};
const final = { ...cnrs, ...peace };
fs.writeFileSync('final-dictionary.json', JSON.stringify(final, null, 2));
console.log(`✅ Fusion terminée : ${Object.keys(final).length} entrées.`);
