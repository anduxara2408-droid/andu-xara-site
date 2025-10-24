import re

# Lire le fichier
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Trouver où le CSS s'arrête
css_end = content.find('.toast.show {')
if css_end != -1:
    # Trouver la fin du bloc CSS (recherche de </style>)
    style_end = content.find('</style>', css_end)
    
    if style_end == -1:
        print("❌ Balise </style> manquante - ajout...")
        # Ajouter la fin manquante du CSS
        css_completion = '''
    .toast.show {
        visibility: visible;
        opacity: 1;
    }
</style>
</head>
<body>
<script>
// Redirection HTTPS seulement en production (pas sur localhost)
if (window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1' && 
    window.location.protocol === 'http:') {
    window.location.href = 'https://' + window.location.host + window.location.pathname + window.location.search;
}
</script>
    <!-- Votre contenu existant continue ici -->
    <header>
        <!-- ... votre header ... -->
    </header>
'''
        # Insérer la completion après .toast.show
        insert_pos = content.find('.toast.show {') + len('.toast.show {')
        content = content[:insert_pos] + css_completion + content[insert_pos:]
        
        print("✅ CSS complété et structure HTML restaurée")
    else:
        print("✅ Structure CSS déjà complète")

# Sauvegarder
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("🎯 Fichier index.html corrigé avec succès!")
