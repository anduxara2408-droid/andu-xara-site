const fs = require('fs');
let content = fs.readFileSync('reductions.html', 'utf8');

// AJOUTER LES FONCTIONS SIMPLEMENT AU DÉBUT
const functions = `

// ===== FONCTIONS GLOBALES =====
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function showSignupModal() {
    document.getElementById('signupModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function copierLienParrainage() {
    alert("Fonction parrainage");
}

`;

// Insérer après <script>
const scriptPos = content.indexOf('<script>');
if (scriptPos !== -1) {
    const insertPos = scriptPos + 8;
    const newContent = content.slice(0, insertPos) + functions + content.slice(insertPos);
    fs.writeFileSync('reductions.html', newContent);
    console.log('✅ FONCTIONS AJOUTÉES AVEC SUCCÈS !');
} else {
    console.log('❌ Balise script non trouvée');
}
