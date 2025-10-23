#!/bin/bash
echo "🔧 APPLICATION DE LA CORRECTION PROPRE ET DÉFINITIVE"

# 1. Ajouter UNIQUEMENT la méthode signUp manquante à la fin de la classe AuthManager
sed -i '/^    getErrorMessage(error) {/,/^    }/{
    /^    }/a\
\
    async signUp(email, password, name) {\
        try {\
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);\
            const user = userCredential.user;\
            console.log("✅ Compte Firebase créé:", user.uid);\
\
            // Envoi de l'"'"'email de vérification\
            await user.sendEmailVerification();\
\
            // Sauvegarde des infos utilisateur dans Firestore\
            await db.collection("users").doc(user.uid).set({\
                email: email,\
                name: name,\
                createdAt: new Date(),\
                lastLogin: new Date(),\
                isAdmin: false\
            });\
\
            // 🎯 GÉNÉRATION AUTOMATIQUE DU LIEN DE PARRAINAGE\
            await this.genererLienParrainage(user.uid, email);\
            \
            // 🎯 DÉTECTION DE PARRAINAGE SI CODE PRÉSENT DANS L'"'"'URL\
            const urlParams = new URLSearchParams(window.location.search);\
            const codeParrain = urlParams.get("ref");\
            if (codeParrain) {\
                console.log("🎯 Code parrainage détecté:", codeParrain);\
                await this.detecterParrainage(email, codeParrain);\
            }\
\
            return { success: true, user: user };\
        } catch (error) {\
            console.error("❌ Erreur lors de l'"'"'inscription:", error);\
            return { success: false, error: this.getErrorMessage(error) };\
        }\
    }\
\
    // 🎯 FONCTIONS DE PARRAINAGE\
\
    async genererLienParrainage(userId, email) {\
        try {\
            const codeParrainage = "ANDU-" + Math.random().toString(36).substr(2, 8).toUpperCase();\
            \
            await db.collection("parrainage").doc(userId).set({\
                code: codeParrainage,\
                userId: userId,\
                email: email,\
                dateCreation: new Date(),\
                utilisations: 0,\
                maxUtilisations: 5,\
                actif: true,\
                filleuls: [],\
                recompensesTotal: 0\
            });\
            \
            console.log("✅ Code parrainage généré:", codeParrainage);\
            return codeParrainage;\
        } catch (error) {\
            console.error("❌ Erreur génération code parrainage:", error);\
            return null;\
        }\
    }\
\
    async detecterParrainage(email, codeParrainage) {\
        try {\
            console.log("🔍 Recherche parrain avec code:", codeParrainage);\
            \
            const parrainQuery = await db.collection("parrainage")\
                .where("code", "==", codeParrainage)\
                .where("actif", "==", true)\
                .get();\
\
            if (!parrainQuery.empty) {\
                const parrainDoc = parrainQuery.docs[0];\
                const parrainData = parrainDoc.data();\
                const parrainId = parrainDoc.id;\
                \
                console.log("✅ Parrain trouvé:", parrainData.email);\
                \
                if (parrainData.utilisations < parrainData.maxUtilisations) {\
                    console.log("🎯 Attribution du parrainage...");\
                    \
                    await db.collection("parrainage").doc(parrainId).update({\
                        utilisations: firebase.firestore.FieldValue.increment(1),\
                        filleuls: firebase.firestore.FieldValue.arrayUnion(email)\
                    });\
                    \
                    await this.attribuerRecompenses(parrainId, email);\
                    await this.regenererCode(parrainId);\
                    \
                    return true;\
                }\
            }\
            return false;\
        } catch (error) {\
            console.error("❌ Erreur détection parrainage:", error);\
            return false;\
        }\
    }\
\
    async attribuerRecompenses(parrainId, emailFilleul) {\
        try {\
            const montantParrain = 1000;\
            const montantFilleul = 500;\
            \
            // RÉCOMPENSE POUR LE PARRAIN\
            await db.collection("recompenses").add({\
                userId: parrainId,\
                type: "parrainage_reussi",\
                montant: montantParrain,\
                description: "Parrainage réussi - " + emailFilleul,\
                dateAttribution: new Date(),\
                statut: "actif",\
                dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)\
            });\
            \
            await db.collection("parrainage").doc(parrainId).update({\
                recompensesTotal: firebase.firestore.FieldValue.increment(montantParrain)\
            });\
            \
            // RÉCOMPENSE POUR LE FILLEUL\
            const filleulQuery = await db.collection("users")\
                .where("email", "==", emailFilleul)\
                .get();\
                \
            if (!filleulQuery.empty) {\
                const filleulId = filleulQuery.docs[0].id;\
                \
                await db.collection("recompenses").add({\
                    userId: filleulId,\
                    type: "bienvenue_parrainage",\
                    montant: montantFilleul,\
                    description: "Réduction bienvenue par parrainage",\
                    dateAttribution: new Date(),\
                    statut: "actif",\
                    dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)\
                });\
            }\
            \
            console.log("🎁 Récompenses attribuées avec succès");\
            return true;\
        } catch (error) {\
            console.error("❌ Erreur attribution récompenses:", error);\
            return false;\
        }\
    }\
\
    async regenererCode(userId) {\
        try {\
            const nouveauCode = "ANDU-" + Math.random().toString(36).substr(2, 8).toUpperCase();\
            \
            await db.collection("parrainage").doc(userId).update({\
                code: nouveauCode,\
                dateDerniereRegeneration: new Date()\
            });\
            \
            console.log("🔄 Code régénéré:", nouveauCode);\
            return nouveauCode;\
        } catch (error) {\
            console.error("❌ Erreur régénération code:", error);\
            return null;\
        }\
    }\
\
    mettreAJourInterfaceParrainage(userId) {\
        if (!userId) return;\
        \
        console.log("🔄 Mise à jour interface parrainage pour:", userId);\
        \
        db.collection("parrainage").doc(userId).onSnapshot((doc) => {\
            if (doc.exists) {\
                const data = doc.data();\
                \
                // Mettre à jour l'"'"'interface\
                if (document.getElementById("parrainsCount")) {\
                    document.getElementById("parrainsCount").textContent = data.utilisations || 0;\
                }\
                if (document.getElementById("gainsTotal")) {\
                    document.getElementById("gainsTotal").textContent = (data.recompensesTotal || 0) + " MRU";\
                }\
                if (document.getElementById("lienParrainage")) {\
                    const lienParrainage = window.location.origin + "/index.html?ref=" + data.code;\
                    document.getElementById("lienParrainage").value = lienParrainage;\
                }\
                if (document.getElementById("limiteParrainage")) {\
                    document.getElementById("limiteParrainage").textContent = \
                        `${data.utilisations || 0}/${data.maxUtilisations || 5} utilisations`;\
                }\
                \
                const sectionParrainage = document.getElementById("parrainageSection");\
                if (sectionParrainage) {\
                    sectionParrainage.style.display = "block";\
                }\
            }\
        });\
    }\
\
    async resetPassword(email) {\
        try {\
            await firebase.auth().sendPasswordResetEmail(email);\
            return { success: true };\
        } catch (error) {\
            return { success: false, error: this.getErrorMessage(error) };\
        }\
    }
}' auth.js

# 2. Mettre à jour onAuthStateChanged pour inclure le parrainage
sed -i 's/onAuthStateChanged(user) {/onAuthStateChanged(user) {\n        if (user) {\n            console.log("Utilisateur connecté:", user.email);\n            this.mettreAJourInterfaceParrainage(user.uid);\n        } else {\n            console.log("Utilisateur déconnecté");\n        }/' auth.js

echo "✅ CORRECTION APPLIQUÉE AVEC SUCCÈS"
