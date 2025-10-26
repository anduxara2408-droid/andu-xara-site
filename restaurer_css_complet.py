import re

print("🎯 RESTAURATION DU CSS COMPLET...")

# Lire le backup COMPLET (941 lignes)
with open('index_backup_20251024_111541.html', 'r', encoding='utf-8') as f:
    backup_content = f.read()

print(f"📊 Backup: {len(backup_content)} caractères")

# Extraire TOUT le CSS du backup
css_match = re.search(r'<style>(.*?)</style>', backup_content, re.DOTALL)
if css_match:
    css_complet = css_match.group(1)
    print(f"✅ CSS complet trouvé: {len(css_complet)} caractères")
    
    # Lire le fichier actuel
    with open('index.html', 'r', encoding='utf-8') as f:
        current_content = f.read()
    
    # Remplacer TOUT le contenu par le backup COMPLET
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(backup_content)
    
    print("✅ Fichier COMPLÈTEMENT restauré depuis le backup!")
else:
    print("❌ CSS non trouvé dans le backup")
    # Solution alternative - créer un CSS basique
    css_basique = '''
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #f5f7fa; color: #333; }
    header { background: linear-gradient(135deg, #6a11cb, #2575fc); color: white; padding: 20px; text-align: center; }
    .container { max-width: 1200px; margin: 0 auto; padding: 15px; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
    .product-card { background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .product-card img { width: 100%; height: 200px; object-fit: cover; border-radius: 5px; }
    '''
    
    # Injecter le CSS basique
    current_content = current_content.replace('visibility: visible; opacity: 1; }', css_basique + '\\n    .toast.show {\\n        visibility: visible;\\n        opacity: 1;\\n    }\\n</style>')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(current_content)
    
    print("✅ CSS basique injecté!")

print("🎉 Restauration terminée!")
