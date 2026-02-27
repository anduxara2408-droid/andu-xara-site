// Configuration du site
window.SITE_CONFIG = {
    name: 'Andu-Xara',
    currency: 'MRU',
    phone: '+222 34 19 63 04',
    email: 'contact@andu-xara.store',
    social: {
        instagram: 'https://instagram.com/andu_xara',
        tiktok: 'https://tiktok.com/@andu_xara',
        facebook: 'https://facebook.com/anduxara'
    }
};

// Fonction utilitaire pour copier le code promo
window.copyPromo = (code) => {
    navigator.clipboard.writeText(code);
    showNotification('✅ Code copié !');
};
