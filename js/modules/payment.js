// ===== GESTION DES PAIEMENTS =====
window.PAYMENT_METHODS = {
    BANKILY: { id: "bankily", name: "Bankily", icon: "🏦", phone: "22234196304", description: "Paiement instantané par Bankily" },
    WAVE: { id: "wave", name: "Wave", icon: "🌊", phone: "221762821163", description: "Paiement mobile Wave" },
    LIVRAISON: { id: "livraison", name: "Paiement à la livraison", icon: "🚚", description: "Payez à la réception" }
};
window.generateReference = function(prefix) {
    prefix = prefix || "CMD";
    var timestamp = Date.now().toString(36).toUpperCase();
    var random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return prefix + "-" + timestamp + "-" + random;
};
function getTailleOuOption(item) {
    return item.taille || item.option || "N/A";
}
window.createWhatsAppMessage = function(items, total, paymentMethod, clientInfo) {
    clientInfo = clientInfo || {};
    var date = new Date().toLocaleDateString("fr-FR");
    var message = "🛍️ *NOUVELLE COMMANDE ANDU-XARA*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    message += "📅 Date : " + date + "\n";
    message += "👤 Client : " + (clientInfo.name || "Non renseigné") + "\n";
    message += "📱 Tél : " + (clientInfo.phone || "Non renseigné") + "\n\n";
    message += "📦 *ARTICLES :*\n";
    items.forEach(function(item) {
        message += "• " + item.nom + " (" + getTailleOuOption(item) + ") x" + item.quantite + " — " + (item.prix * item.quantite) + " MRU\n";
    });
    message += "\n💰 *TOTAL : " + total + " MRU*\n";
    message += "💳 Paiement : " + paymentMethod.name + "\n";
    if (paymentMethod.phone) message += "📱 Tél paiement : " + paymentMethod.phone + "\n";
    var ref = clientInfo.reference || window.generateReference();
    message += "🆔 Réf : " + ref + "\n\n";
    message += "━━━━━━━━━━━━━━━━━━━━━━━\nMerci de votre confiance ! 🙏\nL équipe Andu-Xara";
    return message;
};
window.openWhatsApp = function(phone, message) {
    var cleanPhone = phone.replace(/[^0-9]/g, "");
    window.open("https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(message), "_blank");
};
window.processPayment = async function(cart, method, clientInfo) {
    var total = cart.reduce(function(sum, item) { return sum + (item.prix * item.quantite); }, 0);
    var reference = window.generateReference();
    var info = Object.assign({}, clientInfo, { reference: reference });
    var message = window.createWhatsAppMessage(cart, total, method, info);
    if (method.phone) window.openWhatsApp(method.phone, message);
    var user = (typeof auth !== "undefined" && auth.currentUser) ? auth.currentUser : null;
    if (user) {
        try {
            await db.collection("commandes").add({ userId: user.uid, items: cart, total: total, paymentMethod: method.id, clientInfo: clientInfo, reference: reference, status: "en_attente", createdAt: new Date() });
            console.log("✅ Commande sauvegardée");
        } catch(e) { console.error("Erreur Firebase:", e); }
    }
    return { success: true, reference: reference, message: message };
};
window.processFloatingCheckout = function() {
    var cart = JSON.parse(localStorage.getItem("panier")) || [];
    if (cart.length === 0) { alert("Votre panier est vide"); return; }
    window.processPayment(cart, window.PAYMENT_METHODS.BANKILY, { name: "", phone: "" });
};
console.log("✅ Module paiement chargé");
