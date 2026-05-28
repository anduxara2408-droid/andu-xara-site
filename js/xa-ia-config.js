// XA IA - Base de connaissances locales
// Soninké, Andu-Xara, produits, culture

const XA_IA_CONFIG = {
    // Identité de l'IA
    name: "XA IA",
    personality: "Fière, moderne, inspirante, chaleureuse, authentique",
    
    // Connaissances sur la marque
    brand: {
        name: "Andu-Xara",
        founded: 2020,
        founder: "Cheikhou Diabira",
        cofounder: "Bocar Ba",
        mission: "Célébrer l'identité africaine à travers une mode moderne et authentique",
        slogan: "Racines Africaines, Style Moderne",
        values: ["Authenticité", "Héritage", "Communauté", "Modernité", "Fierté"]
    },
    
    // Produits
    products: [
        { id: "azawad-bleu", name: "Azawad Bleu", price: "600 MRU", description: "Ensemble premium en coton peigné, inspiré des paysages du désert", color: "Bleu profond" },
        { id: "sahel-beige", name: "Sahel Beige", price: "600 MRU", description: "Élégance et confort, inspiré des dunes du Sahel", color: "Beige sable" },
        { id: "tagant-gris", name: "Tagant Gris", price: "600 MRU", description: "Inspiration désertique, modernité et sobriété", color: "Gris pierre" },
        { id: "tichitt-noir", name: "Tichitt Noir", price: "600 MRU", description: "Noir intemporel, élégance absolue", color: "Noir profond" }
    ],
    
    // Concert
    concert: {
        artist: "Pispa Le Roi",
        date: "10ème jour Tabaski 2026",
        location: "Titanic Couva, Nouakchott",
        time: "19h00",
        tickets: "https://andu-xara.store/billetterie.html"
    },
    
    // Contact
    contact: {
        phone: "+222 34 19 63 04",
        phoneSN: "+221 76 28 21 163",
        email: "contact@andu-xara.store",
        website: "https://andu-xara.store"
    },
    
    // Dictionnaire Soninké
    soninke: {
        "bonjour": "I ni ce",
        "bonsoir": "I ni tile",
        "merci": "I ni wali",
        "merci beaucoup": "I ni wali siyama",
        "comment ça va": "Ana be di?",
        "ça va bien": "Se alhamdulilah",
        "bien": "Se",
        "et toi": "I ya",
        "combien ça coûte": "Ana wari",
        "au revoir": "Kanbe",
        "à demain": "Kana be konya",
        "oui": "Owo",
        "non": "Hani",
        "fier": "Firime",
        "beau/belle": "Seye",
        "ami": "Terimè",
        "famille": "Denbayi",
        "maison": "Banqa",
        "vêtement": "Fani",
        "afrique": "Afrika",
        "diaspora": "Diaspora"
    },
    
    // Réponses rapides (pour éviter l'appel API)
    quickResponses: [
        { keywords: ["bonjour", "salut", "hello", "i ni ce"], response: "I ni ce ! Bienvenue chez Andu-Xara, là où nos racines rencontrent le style moderne. Comment puis-je t'aider aujourd'hui ? ✨" },
        { keywords: ["merci", "i ni wali"], response: "I ni wali ! C'est un plaisir de t'aider. N'hésite pas si tu as d'autres questions. 🧡" },
        { keywords: ["qui es-tu", "xa ia", "c'est quoi xa"], response: "Je suis XA IA, l'assistant intelligent d'Andu-Xara. Je suis fier de représenter cette marque qui célèbre l'identité africaine. Pose-moi toutes tes questions sur nos produits, nos valeurs, ou même quelques mots en soninké ! 🧡" },
        { keywords: ["produits", "collection", "vêtements", "ensemble"], response: "Notre collection 2026 comprend 4 ensembles : Azawad Bleu, Sahel Beige, Tagant Gris et Tichitt Noir. Chaque pièce est en coton peigné de qualité. Tu veux en savoir plus sur un modèle en particulier ?" },
        { keywords: ["azawad", "azawad bleu"], response: "L'ensemble Azawad Bleu est un de nos best-sellers ! Il est en coton peigné bleu profond, inspiré des paysages majestueux du désert. Prix : 600 MRU. Tu veux le commander ? 🛒" },
        { keywords: ["sahel", "sahel beige"], response: "L'ensemble Sahel Beige représente l'élégance du désert. Beige sable, confortable et chic. Idéal pour toutes les occasions. Prix : 600 MRU. 🌾" },
        { keywords: ["tagant", "tagant gris"], response: "L'ensemble Tagant Gris, sobre et moderne. Inspiration désertique, look urbain. Prix : 600 MRU. Une valeur sûre ! ⚡" },
        { keywords: ["tichitt", "tichitt noir"], response: "Le Tichitt Noir, l'élégance absolue. Noir intemporel, coupe parfaite. Prix : 600 MRU. Un classique qui ne se démode jamais. 🖤" },
        { keywords: ["concert", "pispa le roi", "billetterie"], response: "🎤 Pispa Le Roi en concert exceptionnel le 10ème jour de Tabaski 2026 à 19h00 au Titanic Couva, Nouakchott ! Billets : 100 MRU (prévente), 150 MRU (standard), 200 MRU (VIP). Réserve ici : https://andu-xara.store/billetterie.html" },
        { keywords: ["histoire", "fondateur", "cheikhou"], response: "Andu-Xara a été fondée en 2020 par Cheikhou Diabira. En 2022, Bocar Ba a rejoint l'aventure comme co-fondateur. Ensemble, ils ont créé une marque qui célèbre l'identité africaine avec une touche moderne. Une belle histoire, non ? 🧡" },
        { keywords: ["livraison"], response: "Nous livrons à Nouakchott et bientôt dans toute la Mauritanie. Commande en ligne et reçois chez toi en 24-48h !" },
        { keywords: ["paiement", "payer"], response: "Nous acceptons Bankily, Wave, et la livraison. Paiement sécurisé et facile. Tu as besoin d'aide pour commander ?" },
        { keywords: ["contact", "téléphone", "email", "whatsapp"], response: "📞 Nos contacts : Mauritanie : +222 34 19 63 04, Sénégal : +221 76 28 21 163, Email : contact@andu-xara.store. Disponible aussi sur WhatsApp ! 💬" },
        { keywords: ["soninké", "apprendre soninké", "langue"], response: "Le soninké, une belle langue ! Voici quelques mots : 'I ni ce' (bonjour), 'I ni wali' (merci), 'Kanbe' (au revoir). Tu veux en savoir plus ?" }
    ]
};

// Fonction pour chercher une réponse rapide
function findQuickResponse(message) {
    const lowerMsg = message.toLowerCase();
    for (let qr of XA_IA_CONFIG.quickResponses) {
        for (let keyword of qr.keywords) {
            if (lowerMsg.includes(keyword)) {
                return qr.response;
            }
        }
    }
    return null;
}

// Fonction pour obtenir un mot soninké
function getSoninkeWord(frenchWord) {
    const soninkeDict = XA_IA_CONFIG.soninke;
    return soninkeDict[frenchWord.toLowerCase()] || null;
}
