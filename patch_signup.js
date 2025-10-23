const fs = require('fs');
const authContent = fs.readFileSync('auth.js', 'utf8');

// Vérifier si signUp a déjà été modifié
if (authContent.includes('await this.genererLienParrainage')) {
    console.log('✅ Fonction signUp déjà modifiée');
    process.exit(0);
}

// Trouver la fonction signUp dans la classe AuthManager
if (!authContent.includes('async signUp(email, password, firstName, lastName)')) {
    console.log('❌ Fonction signUp non trouvée dans AuthManager');
    console.log('🔍 Recherche des fonctions disponibles...');
    const functionMatches = authContent.match(/async\\s+\\w+\\s*\\([^)]*\\)\\s*{/g);
    if (functionMatches) {
        console.log('Fonctions trouvées:');
        functionMatches.forEach(fn => console.log(' - ' + fn));
    }
    process.exit(1);
}

// Remplacer la fonction signUp existante
const signUpRegex = /async signUp\\(email, password, firstName, lastName\\)\\s*{([\\s\\S]*?)return\\s*{\\s*success:\\s*true,/;
const newSignUpCode = `async signUp(email, password, firstName, lastName) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Sauvegarder le profil utilisateur
            await db.collection('users').doc(user.uid).set({
                email: email,
                firstName: firstName,
                lastName: lastName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                isAdmin: false,
                emailVerified: false
            });
            
            // GÉNÉRER LE LIEN DE PARRAINAGE
            await this.genererLienParrainage(user.uid, email);
            
            // DÉTECTER LE PARRAINAGE (si code présent)
            await this.detecterParrainage(user.uid, email);
            
            // Envoyer l'email de vérification
            await user.sendEmailVerification();
            
            return { success: true,`;

let newContent = authContent.replace(signUpRegex, newSignUpCode);

if (newContent === authContent) {
    console.log('❌ Échec du remplacement de la fonction signUp');
    process.exit(1);
}

fs.writeFileSync('auth.js', newContent);
console.log('✅ Fonction signUp modifiée avec succès !');
