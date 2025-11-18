# 📱 SETUP PARFAIT : Flutter + Émulateur Android

## ✅ Vous avez :
- ✓ Flutter 3.38.1 installé
- ✓ Dart 3.10.0 installé
- ✓ 2 émulateurs Android disponibles :
  - **Phone_Stable** (Google Pixel)
  - **Pixel_2** (Google Pixel 2)

---

## 🚀 DÉMARRAGE EN 4 ÉTAPES

### Étape 1️⃣ : Lancer l'émulateur Android

**Dans un terminal :**
```bash
flutter emulators --launch Phone_Stable
```

⏳ Attendez ~30 secondes que l'émulateur démarre...

**Vous verrez :**
```
Opening Android Virtual Device 'Phone_Stable' for target id 'Phone_Stable'...
...
Emulator launched.
```

---

### Étape 2️⃣ : Créer votre projet Flutter

**Dans un nouveau terminal :**
```bash
cd ~/Documents
flutter create my_app
cd my_app
```

---

### Étape 3️⃣ : Lancer l'app sur l'émulateur

**Depuis le dossier `my_app` :**
```bash
flutter run
```

**Résultat :** L'app Flutter démarre sur l'émulateur ! 🎉

---

### Étape 4️⃣ : Disposition finale de votre écran

```
┌──────────────────────────────┬──────────────────────────┐
│                              │                          │
│     VS CODE                  │   ÉMULATEUR ANDROID      │
│                              │                          │
│  • lib/main.dart             │  📱 Votre app Flutter    │
│  • Éditeur de code           │  • Affichage Android     │
│  • Dart syntax highlighting  │  • Boutons, UI réelle    │
│  • Hot Reload                │  • Hot Reload en direct  │
│                              │                          │
└──────────────────────────────┴──────────────────────────┘
```

---

## 🔥 HOT RELOAD : La Magie de Flutter

### Quand vous modifiez votre code :

1. **Modifiez** `lib/main.dart` dans VS Code
2. **Appuyez sur `R`** dans le terminal où `flutter run` est actif
3. **L'app se met à jour instantanément** ! ⚡

**C'est 10x plus rapide qu'un reload complet.**

### Les raccourcis du terminal flutter :

| Touche | Action |
|--------|--------|
| **R** | Hot Reload (mise à jour rapide) |
| **R** (2x) | Hot Restart (redémarrage complet) |
| **Q** | Quitter flutter run |
| **H** | Afficher l'aide |

---

## 💡 Workflow Optimal

```
┌─ VS Code ──────────────────────────────────────────────────┐
│                                                            │
│  void main() {                    runApp(const MyApp());  │
│    // 🔥 Je modifie quelque chose ici                     │
│  }                                                        │
│                                                            │
│  ✓ Ctrl+S (sauvegarde)                                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
                            ↓
┌─ Terminal ─────────────────────────────────────────────────┐
│                                                            │
│  $ flutter run                                            │
│  ...                                                      │
│  flutter: ═══════════════════════════════════             │
│  flutter: Reloading changes...                           │
│  flutter: ✓ Changed 1 file: lib/main.dart                │
│  flutter: ═══════════════════════════════════             │
│                          ↓ Appuyez sur R                  │
│  Performing hot reload...                                 │
│  Done (250ms)                                             │
│                                                            │
└────────────────────────────────────────────────────────────┘
                            ↓
┌─ Émulateur ────────────────────────────────────────────────┐
│                                                            │
│  📱 L'app se met à jour INSTANTANÉMENT ! ✨               │
│                                                            │
│  Vous voyez vos changements en temps réel !              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📋 Checklist de démarrage

- [ ] Émulateur lancé (`flutter emulators --launch Phone_Stable`)
- [ ] Projet créé (`flutter create my_app`)
- [ ] `flutter run` actif dans le terminal
- [ ] L'app apparaît sur l'émulateur
- [ ] VS Code ouvert sur le projet
- [ ] Écran arrangé : VS Code à gauche, émulateur à droite
- [ ] Test : Modifiez `main.dart`, appuyez sur **R** → ça marche ? ✅

---

## 🎯 Votre écran Linux final

**Disposition recommandée :**

1. **Réduisez la fenêtre VS Code** (~1000px de large)
2. **Placez l'émulateur Android** à côté (~450px de large)
3. **Redimensionnez le terminal** en bas de VS Code
4. **Arrangez pour voir :** Code à gauche + App à droite

---

## 🆘 Dépannage

### ❌ L'émulateur ne démarre pas ?
```bash
# Vérifiez l'émulateur
flutter emulators

# Lancez-le manuellement
emulator -avd Phone_Stable
```

### ❌ `flutter run` dit "No devices found" ?
```bash
# Vérifiez que l'émulateur est bien lancé
flutter devices

# Si ce n'est pas là, lancez l'émulateur d'abord
flutter emulators --launch Phone_Stable
```

### ❌ Hot Reload ne marche pas ?
```bash
# Arrêtez flutter run (Ctrl+C)
# Relancez
flutter run
```

### ❌ L'app plante sur l'émulateur ?
```bash
# Faites un hot restart
# Appuyez deux fois sur R dans le terminal (RR)
```

---

## 📚 Ressources

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Flutter Hot Reload](https://flutter.dev/docs/development/tools/hot-reload)

---

## 🎉 Vous êtes prêt !

C'est tout ce qu'il faut pour un **setup professionnel de développement mobile** :

✅ **Code à gauche** (VS Code)  
✅ **App en temps réel à droite** (Émulateur Android)  
✅ **Hot Reload instantané** (R dans le terminal)  
✅ **Pas d'allers-retours** entre les fenêtres

**Commencez à développer ! 🚀**
