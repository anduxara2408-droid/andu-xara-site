// XA IA - Configuration Soninké authentique (sans bambara)
const XA_IA_CONFIG = {
    name: "XA IA",
    personality: "Fière, moderne, inspirante, chaleureuse, authentique",
    brand: {
        name: "Andu-Xara",
        founded: 2020,
        founder: "Cheikhou Diabira",
        cofounder: "Bocar Ba",
        mission: "Célébrer l'identité africaine à travers une mode moderne et authentique",
        slogan: "Racines Africaines, Style Moderne",
        values: ["Authenticité", "Héritage", "Communauté", "Modernité", "Fierté"]
    },
    products: [
        { id: "azawad-bleu", name: "Azawad Bleu", price: "600 MRU", description: "Ensemble premium en coton peigné", color: "Bleu profond" },
        { id: "sahel-beige", name: "Sahel Beige", price: "600 MRU", description: "Élégance et confort", color: "Beige sable" },
        { id: "tagant-gris", name: "Tagant Gris", price: "600 MRU", description: "Inspiration désertique", color: "Gris pierre" },
        { id: "tichitt-noir", name: "Tichitt Noir", price: "600 MRU", description: "Noir intemporel", color: "Noir profond" }
    ],
    concert: {
        artist: "Pispa Le Roi",
        date: "10ème jour Tabaski 2026",
        location: "Titanic Couva, Nouakchott",
        time: "19h00",
        tickets: "https://andu-xara.store/billetterie.html"
    },
    contact: {
        phone: "+222 34 19 63 04",
        phoneSN: "+221 76 28 21 163",
        email: "contact@andu-xara.store",
        website: "https://andu-xara.store"
    },
    // Dictionnaire Soninké authentique (pas de bambara)
    soninke: {
        "an wuyi jam": "As-tu passé la nuit en paix ?",
        "ma jam": "Je vais bien",
        "beeta": "Bonjour (matin/journée)",
        "kira": "Bonjour (midi)",
        "lella": "Bon après-midi",
        "sunka": "Bonsoir",
        "an moxo": "Comment ça va ?",
        "ma jam nawaari": "Je vais bien, merci",
        "ka-dunko n moxo": "Et la famille ?",
        "nawaari": "Merci",
        "bisimilla": "De rien / Je vous en prie",
        "hari na o koyi me": "Au revoir",
        "o wa katti kaane": "À plus tard",
        "iyo": "Oui",
        "ayi": "Non",
        "yugo": "Homme",
        "yaxare": "Femme",
        "lemine": "Enfant",
        "xiricé": "Grand(e)",
        "leminé": "Petit(e)",
        "aaxi": "Cher / coûteux",
        "ka": "Maison",
        "ka ndi": "Ma maison",
        "menjanne": "Ami",
        "sahato": "Maintenant",
        "n nta a tu": "Je ne sais pas"
    },
    quickResponses: [
        { keywords: ["beeta"], response: "Beeta ! Bonjour. Comment puis-je t'aider ? 🧡" },
        { keywords: ["kira"], response: "Kira ! Bonjour (midi). En quoi puis-je t'être utile ?" },
        { keywords: ["lella"], response: "Lella ! Bon après-midi. Quelle belle journée !" },
        { keywords: ["sunka"], response: "Sunka ! Bonsoir. Comment s'est passée ta journée ?" },
        { keywords: ["an wuyi jam"], response: "Ma jam ! (Je vais bien) Merci de demander. 🌞" },
        { keywords: ["an moxo", "ammoxo"], response: "Ma jam. Nawaari ! (Je vais bien, merci) Et toi ?" },
        { keywords: ["nawaari"], response: "Bisimilla ! (De rien) À ton service." },
        { keywords: ["hari na o koyi me"], response: "Hari na o koyi me ! Reviens vite nous voir." },
        { keywords: ["xiricé"], response: "Xiricé signifie 'grand(e)'. Chez Andu-Xara, nous avons une grande famille. 🧡" },
        { keywords: ["leminé"], response: "Leminé = 'petit(e)'. Chaque détail compte dans nos créations." },
        { keywords: ["aaxi"], response: "Aaxi = 'cher / coûteux'. Mais nos ensembles valent chaque ouguiya." },
        { keywords: ["ka ndi"], response: "Ka ndi = 'ma maison'. Andu-Xara, c'est ta maison de la mode afro-urbaine." },
        { keywords: ["bonjour", "salut", "hello"], response: "Beeta ! (Bonjour) Bienvenue chez Andu-Xara. 🧡" },
        { keywords: ["produits", "collection"], response: "Notre collection 2026 : Azawad Bleu, Sahel Beige, Tagant Gris, Tichitt Noir (600 MRU chacun)." },
        { keywords: ["azawad"], response: "Azawad Bleu, 600 MRU. Ensemble premium en coton peigné." },
        { keywords: ["sahel"], response: "Sahel Beige, 600 MRU. Élégance et confort." },
        { keywords: ["tagant"], response: "Tagant Gris, 600 MRU. Moderne et racé." },
        { keywords: ["tichitt"], response: "Tichitt Noir, 600 MRU. Intemporel." },
        { keywords: ["concert", "pispa"], response: "Pispa Le Roi en concert le 10ème jour Tabaski 2026 à 19h au Titanic Couva, Nouakchott. 🎤" },
        { keywords: ["contact", "whatsapp"], response: "WhatsApp : +222 34 19 63 04 / Email : contact@andu-xara.store" }
    ]
};

function findQuickResponse(message) {
    const lower = message.toLowerCase();
    for (let qr of XA_IA_CONFIG.quickResponses) {
        for (let kw of qr.keywords) {
            if (lower.includes(kw)) return qr.response;
        }
    }
    return null;
}

function getSoninkeWord(frenchWord) {
    return XA_IA_CONFIG.soninke[frenchWord.toLowerCase()] || null;
}
