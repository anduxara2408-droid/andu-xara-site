// Tableau de 50 codes ADX
const promoCodes = [];
for(let i=1; i<=50; i++){
    promoCodes.push(`ADX${i}`);
}

// Codes déjà utilisés stockés dans localStorage
let usedCodes = JSON.parse(localStorage.getItem('usedCodes')) || [];

document.getElementById('apply-promo-btn').addEventListener('click', () => {
    const input = document.getElementById('promo-code-input');
    const code = input.value.trim().toUpperCase();
    const messageEl = document.getElementById('promo-message');

    if (!code) {
        messageEl.style.color = 'red';
        messageEl.textContent = "Veuillez entrer un code.";
        return;
    }

    if (!promoCodes.includes(code)) {
        messageEl.style.color = 'red';
        messageEl.textContent = "Code invalide.";
        return;
    }

    if (usedCodes.includes(code)) {
        messageEl.style.color = 'red';
        messageEl.textContent = "Ce code a déjà été utilisé.";
        return;
    }

    // Code valide et non utilisé
    usedCodes.push(code);
    localStorage.setItem('usedCodes', JSON.stringify(usedCodes));

    messageEl.style.color = 'green';
    messageEl.textContent = `Félicitations ! Le code ${code} a été appliqué. Vous avez votre réduction !`;

    // Applique la réduction sur le panier
    applyDiscount();
});

// Exemple : réduction 10% sur le panier
function applyDiscount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.forEach(item => {
        item.price = Math.round(item.price * 0.9);
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCounter();
    updateCartModalContent();
}
