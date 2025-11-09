// Correcteur basique
console.log('🔧 Fix chargé');

window.sendAIMessage = function() { 
  alert('🤖 IA en développement'); 
};

window.toggleFloatingCart = function() {
  var cart = document.getElementById('floating-cart');
  if (cart) cart.classList.toggle('open');
};

window.ajouterAuPanier = function(nom, cat, prix) {
  console.log('Ajout:', nom, prix);
  if (typeof window.floatingCart == 'undefined') window.floatingCart = [];
  var existant = window.floatingCart.find(function(item) { 
    return item.name === nom; 
  });
  if (existant) {
    existant.quantity += 1;
  } else {
    window.floatingCart.push({
      name: nom, category: cat, price: prix, 
      promoPrice: prix, quantity: 1,
      addedAt: new Date().toISOString()
    });
  }
  localStorage.setItem('anduxara_cart', JSON.stringify(window.floatingCart));
  alert('✅ ' + nom + ' ajouté !');
};

window.validateAndApplyPromo = function() {
  var input = document.getElementById('promoInput');
  var msg = document.getElementById('promoMessage');
  if (!input || !msg) return;
  
  var code = input.value.trim().toUpperCase();
  var codes = {TEST15:15, WELCOME10:10, ANDU20:20, SOLDE30:30};
  var discount = codes[code];
  
  if (discount) {
    localStorage.setItem('anduxara_active_promo', JSON.stringify({
      code: code, discount: discount
    }));
    alert('🎉 Code ' + code + ' appliqué : ' + discount + '% de réduction');
    msg.innerHTML = '<span style="color: green;">✅ Code appliqué</span>';
  } else {
    msg.innerHTML = '<span style="color: red;">❌ Code invalide</span>';
  }
};

// Charger panier
if (typeof window.floatingCart == 'undefined') {
  window.floatingCart = JSON.parse(localStorage.getItem('anduxara_cart') || '[]');
}
