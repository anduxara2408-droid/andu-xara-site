// Animation des textes qui changent toutes les 3 secondes
const dynamicText = document.getElementById('dynamic-text');
const phrases = [
    'Mode Afro-Urbaine',
    'Héritage Africain',
    'Style Moderne',
    'Culture & Traditions',
    'Qualité Premium',
    'Créations Uniques'
];

let index = 0;

function changeText() {
    index = (index + 1) % phrases.length;
    dynamicText.style.opacity = '0';
    
    setTimeout(() => {
        dynamicText.textContent = phrases[index];
        dynamicText.style.opacity = '1';
    }, 500);
}

// Changement toutes les 3 secondes
setInterval(changeText, 3000);

// Animation d'entrée
dynamicText.style.transition = 'opacity 0.5s';
