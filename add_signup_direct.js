const fs = require('fs');
const authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier si signUp existe déjà dans AuthManager
if (authContent.includes('async signUp(email, password, firstName, lastName)')) {
    console.log('✅ Fonction signUp existe déjà dans AuthManager');
    process.exit(0);
}

// Trouver la ligne de fermeture de la classe AuthManager (la dernière accolade fermante avant les fonctions globales)
const lines = authContent.split('\n');
let classEndLine = -1;
let braceCount = 0;
let inClass = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('class AuthManager')) {
        inClass = true;
        braceCount = 1;
        continue;
    }
    
    if (inClass) {
        // Compter les accolades
        for (const char of line) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
        }
        
        // Si on arrive à 0, c'est la fin de la classe
        if (braceCount === 0) {
            classEndLine = i;
            break;
        }
    }
}

if (classEndLine === -1) {
    console.error('❌ Impossible de trouver la fin de la classe AuthManager');
    process.exit(1);
}

// Code de la fonction signUp à ajouter
const signUpCode = `\n    async signUp(email, password, firstName, lastName) {
        try {
            console.log("🚀 Début de l'inscription:", email);
            
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log("✅ Utilisateur Auth créé:", user.uid);
            
            // Sauvegarder le profil utilisateur dans Firestore
            await db.collection('users').doc(user.uid).set({
                email: email,
                firstName: firstName,
                lastName: lastName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                isAdmin: false,
                emailVerified: false
            });
            
            console.log("✅ Profil utilisateur sauvegardé");
            
            // GÉNÉRER LE LIEN DE PARRAINAGE
            await this.genererLienParrainage(user.uid, email);
            console.log("✅ Lien de parrainage généré");
            
            // DÉTECTER LE PARRAINAGE (si code présent dans l'URL)
            await this.detecterParrainage(user.uid, email);
            
            // Envoyer l'email de vérification
            await user.sendEmailVerification();
            console.log("✅ Email de vérification envoyé");
            
            return { success: true, user: user };
            
        } catch (error) {
            console.error("❌ Erreur inscription:", error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }`;

// Reconstruire le contenu en insérant avant la ligne de fermeture
const newLines = [];
for (let i = 0; i < lines.length; i++) {
    if (i === classEndLine) {
        newLines.push(signUpCode);
    }
    newLines.push(lines[i]);
}

fs.writeFileSync('auth.js', newLines.join('\n'));
console.log('✅ Fonction signUp ajoutée à AuthManager avec succès !');
