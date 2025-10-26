import os

# Le code Google Analytics à insérer
ga_code = '''
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-S9CBS21SVR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-S9CBS21SVR');
</script>
'''

# Parcours tous les fichiers HTML dans le dossier actuel
for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Vérifie si la balise </head> existe
        if '</head>' in content:
            # Insère le code GA juste avant </head>
            content = content.replace('</head>', ga_code + '\n</head>')

            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"Code GA ajouté dans {filename}")
        else:
            print(f"Avertissement : </head> non trouvé dans {filename}, vérifie manuellement.")
