import os

# Code Google Analytics
ga_code = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-S9CBS21SVR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-S9CBS21SVR');
</script>
"""

# Dossier contenant vos fichiers HTML
folder_path = os.getcwd()  # ici le script doit être dans le dossier du site

for filename in os.listdir(folder_path):
    if filename.endswith(".html"):
        filepath = os.path.join(folder_path, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Vérifie si le code GA est déjà présent
        if "gtag('config', 'G-S9CBS21SVR')" in content:
            print(f"Code GA déjà présent dans {filename}")
            continue

        # Ajoute le code avant </head> si trouvé, sinon au début
        if "</head>" in content:
            content = content.replace("</head>", ga_code + "\n</head>")
        else:
            content = ga_code + "\n" + content
            print(f"Avertissement : </head> non trouvé dans {filename}, code ajouté au début.")

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        
        print(f"Code GA ajouté dans {filename}")
