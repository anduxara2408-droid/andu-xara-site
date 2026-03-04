// ===== GESTION DES PAIEMENTS =====

// Configuration des moyens de paiement
export const PAYMENT_METHODS = {
    BANKILY: {
        id: 'bankily',
        name: 'Bankily',
        icon: '🏦',
        phone: '22234196304',
        description: 'Paiement instantané par Bankily'
    },
    WAVE: {
        id: 'wave',
        name: 'Wave',
        icon: '🌊',
        phone: '221762821163',
        description: 'Paiement mobile Wave (Sénégal)'
    },
    LIVRAISON: {
        id: 'livraison',
        name: 'Paiement à la livraison',
        icon: '🚚',
        description: 'Payez à la réception'
    }
};

// Générer une référence unique
export function generateReference(prefix = 'CMD') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// Créer un message WhatsApp pour le paiement
export function createWhatsAppMessage(items, total, paymentMethod, clientInfo = {}) {
    const date = new Date().toLocaleDateString('fr-FR');
    
    let message = `🛍️ *NOUVELLE COMMANDE ANDU-XARA*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📅 Date: ${date}\n`;
    message += `👤 Client: ${clientInfo.name || 'Non renseigné'}\n`;
    message += `📱 Tél: ${clientInfo.phone || 'Non renseigné'}\n\n`;
    message += `📦 *ARTICLES:*\n`;
    
    items.forEach(item => {
        message += `• ${item.nom} (${item.taille}) x${item.quantite} - ${item.prix * item.quantite} MRU\n`;
    });
    
    message += `\n💰 *TOTAL: ${total} MRU*\n`;
    message += `💳 Paiement: ${paymentMethod.name}\n`;
    message += `📱 Tél paiement: ${paymentMethod.phone || 'Non applicable'}\n`;
    message += `🆔 Réf: ${clientInfo.reference || generateReference()}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Merci de votre confiance ! 🙏\n`;
    message += `L'équipe Andu-Xara`;
    
    return message;
}

// Ouvrir WhatsApp pour confirmation
export function openWhatsApp(phone, message) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Traiter un paiement
export async function processPayment(cart, method, clientInfo) {
    const total = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    const reference = generateReference();
    
    const message = createWhatsAppMessage(cart, total, method, {
        ...clientInfo,
        reference
    });
    
    // Ouvrir WhatsApp
    if (method.phone) {
        openWhatsApp(method.phone, message);
    }
    
    // Sauvegarder la commande dans Firebase si connecté
    const user = auth?.currentUser;
    if (user) {
        try {
            await db.collection('commandes').add({
                userId: user.uid,
                items: cart,
                total: total,
                paymentMethod: method.id,
                clientInfo: clientInfo,
                reference: reference,
                status: 'en_attente',
                createdAt: new Date()
            });
        } catch (error) {
            console.error('Erreur sauvegarde commande:', error);
        }
    }
    
    return {
        success: true,
        reference,
        message
    };
}

// Exporter
window.processPayment = processPayment;
window.PAYMENT_METHODS = PAYMENT_METHODS;
