# 🎯 SETUP PROFESSIONNEL - TÉLÉPHONE VIRTUEL DANS VS CODE

## Configuration idéale : Éditeur + Téléphone intégré

### Disposition recommandée :

```
┌────────────────────────────┬────────────────────────────┐
│    VS CODE EDITOR          │  TÉLÉPHONE VIRTUEL (PANEL) │
│                            │                            │
│ • Éditeur de code HTML     │ • Aperçu iOS/Android       │
│ • CSS/JavaScript           │ • Écran 9:16 responsive    │
│ • Live Edit avec Ctrl+S    │ • Reload automatique       │
│ • Sauvegarde = Mise à jour │ • Bouton recharger         │
│                            │ • Barre d'état iPhone      │
└────────────────────────────┴────────────────────────────┘
```

**L'avantage :** Vous codez avec le téléphone attaché à votre vue ! 📱

## 📋 Démarrage rapide (2 étapes)

### **Étape 1 : Lancer le serveur local**

Dans VS Code, appuyez sur **Ctrl+Shift+P** et tapez :
```
Tasks: Run Task > 🌐 Serveur Web Local
```

Ou manuellement dans le terminal :
```bash
python3 -m http.server 8000
```

### **Étape 2 : Ouvrir l'aperçu mobile**

Dans VS Code, appuyez sur **Ctrl+Shift+M** (raccourci intégré)

Ou allez à **Commandes > Mobile Preview: Open Preview**

---

**Maintenant :**
- ✅ Votre code est à gauche
- ✅ Le téléphone virtuel est à droite (dans VS Code)
- ✅ Modifiez votre HTML/CSS
- ✅ Appuyez sur **Ctrl+S** pour sauvegarder
- ✅ Le téléphone se met à jour automatiquement
- ✅ Clic "🔄 Recharger" pour forcer le rafraîchissement

---

## ⚡ Alternative : Aperçu dans une onglet moderne

Si vous préférez un aperçu dans un vrai navigateur côte à côte :

1. Ouvrez Chrome/Firefox : `http://localhost:8000`
2. Appuyez sur **F12** pour ouvrir DevTools
3. Appuyez sur **Ctrl+Shift+M** pour mode responsive
4. Sélectionnez un téléphone (iPhone 12 Pro, Pixel 7, etc.)
5. Arrangez : **Code à gauche** + **Navigateur à droite**

---

## 🎮 Contrôles du Téléphone Virtuel

| Action | Résultat |
|--------|----------|
| Modifier `index.html` | Changement visible immédiatement |
| **Ctrl+S** (Sauvegarder) | Reload automatique du téléphone |
| Clic **🔄 Recharger** | Force le rafraîchissement |
| Clic **🔗 Ouvrir** | Ouvre le lien dans le navigateur |
| Changer l'URL dans le champ | Charge une autre page |

---

## ✅ Checklist de configuration

- [ ] Serveur local lancé (`python3 -m http.server 8000`)
- [ ] VS Code ouvert sur le projet
- [ ] Aperçu mobile ouvert (Ctrl+Shift+M)
- [ ] Testez en modifiant `index.html` et en sauvegardant
- [ ] Vérifiez que le téléphone se met à jour

**Vous êtes prêt ! 🚀**
