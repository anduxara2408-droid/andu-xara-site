// ===== DONNÉES DES PRODUITS =====

export const PRODUCTS = [
    {
        id: 'azawad-bleu',
        nom: 'Azawad Bleu',
        nomComplet: 'Ensemble Premium Azawad',
        description: 'L\'élégance du désert réinventée. Cet ensemble en coton peigné de première qualité offre un confort absolu tout en préservant une silhouette moderne et structurée. Parfait pour toutes vos occasions.',
        prix: 600,
        categorie: 'ensembles',
        photos: [
            'images/produits/pull-bleu-01.jpg',
            'images/produits/pull-bleu-02.jpg',
            'images/produits/pull-bleu-03.jpg',
            'images/produits/pull-bleu-detail.jpg'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'sahel-beige',
        nom: 'Sahel Beige',
        nomComplet: 'Ensemble Signature Sahel',
        description: 'Inspiré des dunes du Sahel, cet ensemble beige incarne la douceur et l\'élégance. Tissu haut de gamme, coupe contemporaine, finitions artisanales.',
        prix: 600,
        categorie: 'ensembles',
        photos: [
            'images/produits/pull-beige-01.jpg',
            'images/produits/pull-beige-02.jpg'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'tagant-gris',
        nom: 'Tagant Gris',
        nomComplet: 'Ensemble Urbain Tagant',
        description: 'Le gris Tagant, sobre et élégant. Un ensemble polyvalent qui se porte aussi bien en ville qu\'en voyage. Respirable, infroissable, intemporel.',
        prix: 600,
        categorie: 'ensembles',
        photos: [
            'images/produits/pull-gris-01.jpg',
            'images/produits/pull-gris-02.jpg',
            'images/produits/pull-gris-detail.jpg'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'tichitt-noir',
        nom: 'Tichitt Noir',
        nomComplet: 'Ensemble Noir Tichitt',
        description: 'Le noir absolu, la sobriété suprême. Cet ensemble est un incontournable pour ceux qui recherchent l\'élégance minimaliste. Qualité premium.',
        prix: 600,
        categorie: 'ensembles',
        photos: [
            'images/produits/pull-noir-01.jpg',
            'images/produits/pull-noir-02.jpg',
            'images/produits/pull-noir-03.jpg'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'ouadane-noir',
        nom: 'Ouadane Noir',
        nomComplet: 'T-shirt Noir Ouadane',
        description: 'Le basique ultime. T-shirt 100% coton, coupe parfaite, broderie fine. Un indispensable pour votre garde-robe.',
        prix: 400,
        categorie: 'tshirts',
        photos: [
            'images/produits/tshirt-noir-01.png',
            'images/produits/tshirt-noir-02.png',
            'images/produits/tshirt-noir-03.png'
        ],
        tailles: ['S', 'M', 'L', 'XL']
    }
];

// Version simplifiée pour l'accueil
export const FEATURED_PRODUCTS = PRODUCTS.map(p => ({
    id: p.id,
    nom: p.nom,
    prix: p.prix,
    image: p.photos[0]
}));

// Récupérer un produit par son ID
export function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

// Filtrer par catégorie
export function getProductsByCategory(categorie) {
    if (categorie === 'tous') return PRODUCTS;
    return PRODUCTS.filter(p => p.categorie === categorie);
}
