#!/bin/bash
echo "🔧 Ajout de la méthode signUp() dans AuthManager"

# Créer une sauvegarde
cp auth.js auth.js.backup.signup

# Trouver la ligne après la méthode signIn et ajouter signUp
awk '
/signIn\(email, password\)/ {found=1; print; next}
found && /^    \}/ { 
    print "    }"
    print ""
    print "    async signUp(email, password, name) {"
    print "        try {"
    print "            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);"
    print "            const user = userCredential.user;"
    print "            console.log(\"✅ Compte Firebase créé:\", user.uid);"
    print ""
    print "            // Envoi de l'\''email de vérification"
    print "            await user.sendEmailVerification();"
    print ""
    print "            // Sauvegarde des infos utilisateur dans Firestore"
    print "            await db.collection(\"users\").doc(user.uid).set({"
    print "                email: email,"
    print "                name: name,"
    print "                createdAt: new Date(),"
    print "                lastLogin: new Date(),"
    print "                isAdmin: false"
    print "            });"
    print ""
    print "            // 🎯 GÉNÉRATION AUTOMATIQUE DU LIEN DE PARRAINAGE"
    print "            await this.genererLienParrainage(user.uid, email);"
    print "            "
    print "            // 🎯 DÉTECTION DE PARRAINAGE SI CODE PRÉSENT DANS L'\''URL"
    print "            const urlParams = new URLSearchParams(window.location.search);"
    print "            const codeParrain = urlParams.get(\"ref\");"
    print "            if (codeParrain) {"
    print "                console.log(\"🎯 Code parrainage détecté:\", codeParrain);"
    print "                await this.detecterParrainage(email, codeParrain);"
    print "            }"
    print ""
    print "            return { success: true, user: user };"
    print "        } catch (error) {"
    print "            console.error(\"❌ Erreur lors de l'\''inscription:\", error);"
    print "            return { success: false, error: this.getErrorMessage(error) };"
    print "        }"
    print "    }"
    found=0; 
    next
}
{print}
' auth.js > auth.js.tmp && mv auth.js.tmp auth.js

echo "✅ Méthode signUp() ajoutée à AuthManager"
