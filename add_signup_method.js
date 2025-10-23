const fs = require('fs');
const authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier si signUp existe déjà dans AuthManager
if (authContent.includes('async signUp(email, password, firstName, lastName)')) {
    console.log('✅ Fonction signUp existe déjà dans AuthManager');
    process.exit(0);
}

// Trouver la position avant la fermeture de la classe (avant le "}" de la classe)
const classEndMatch = authContent.match(/(class AuthManager\\s*{([\\s\\S]*?)\\n})/);
if (!classEndMatch) {
    console.error('❌ Impossible de trouver la classe AuthManager');
    process.exit(1);
}

const classEndIndex = classEndMatch.index + classEndMatch[0].length - 1;

// Code de la fonction signUp à ajouter
const signUpCode = `

    async signUp(email, password, firstName, lastName) {
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

// Insérer la fonction avant la fermeture de la classe
const newContent = authContent.slice(0, classEndIndex) + signUpCode + authContent.slice(classEndIndex);

fs.writeFileSync('auth.js', newContent);
console.log('✅ Fonction signUp ajoutée à AuthManager avec succès !');
