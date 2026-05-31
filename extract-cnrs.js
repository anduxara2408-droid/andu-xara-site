const fs = require('fs');
const text = fs.readFileSync('cnrs_raw.txt', 'utf8');
const lines = text.split('\n');
const dict = {};
for (let line of lines) {
    if (line.trim() === '' || line.startsWith('Français') || line.includes('Soutenu par')) continue;
    const parts = line.split('\t');
    if (parts.length >= 2) {
        let french = parts[0].trim();
        let soninke = parts[1].trim();
        if (french && soninke && french !== '—' && soninke !== '—') {
            soninke = soninke.replace(/[̀́̂]/g, '');
            dict[soninke] = french;
            dict[french.toLowerCase()] = soninke;
        }
    }
}
fs.writeFileSync('cnrs-dict.json', JSON.stringify(dict, null, 2));
console.log(`CNRS: ${Object.keys(dict).length} entrées.`);
