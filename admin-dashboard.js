// admin-dashboard.js - Version compatible avec votre code existant

// Configuration Firebase (identique à votre auth.js)
const firebaseConfig = {
    apiKey: "AIzaSyB4h6QADPX6c6hDk9vqR4j8B9j6zQwq9x0",
    authDomain: "andu-xara-parrainage.firebaseapp.com",
    projectId: "andu-xara-parrainage",
    storageBucket: "andu-xara-parrainage.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialisation Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();

class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Vérifier l'authentification
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.verifierAdmin();
                this.chargerDonnees();
            } else {
                window.location.href = 'reductions.html';
            }
        });
    }

    async verifierAdmin() {
        try {
            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
            if (!userDoc.exists || userDoc.data().role !== 'admin') {
                alert('Accès refusé. Droits administrateur requis.');
                window.location.href = 'reductions.html';
                return;
            }
            
            document.getElementById('adminEmail').textContent = this.currentUser.email;
        } catch (error) {
            console.error('Erreur vérification admin:', error);
            window.location.href = 'reductions.html';
        }
    }

    async chargerDonnees() {
        await this.chargerStatistiques();
        await this.chargerCodesPromo();
        await this.chargerUtilisateurs();
        await this.chargerParrainages();
        await this.chargerActiviteRecente();
        await this.chargerTopParrains();
    }

    async chargerStatistiques() {
        try {
            // Utilisateurs totaux
            const usersSnapshot = await db.collection('users').get();
            document.getElementById('totalUsers').textContent = usersSnapshot.size;

            // Parrainages actifs
            const parrainagesSnapshot = await db.collection('parrainage').get();
            document.getElementById('totalParrainages').textContent = parrainagesSnapshot.size;

            // Codes promo
            const codesSnapshot = await db.collection('codesPromo').get();
            document.getElementById('totalCodes').textContent = codesSnapshot.size;

            // Gains totaux
            let totalGains = 0;
            parrainagesSnapshot.forEach(doc => {
                const data = doc.data();
                totalGains += data.recompensesTotal || 0;
            });
            document.getElementById('totalGains').textContent = totalGains + ' MRU';

        } catch (error) {
            console.error('Erreur chargement statistiques:', error);
        }
    }

    async chargerCodesPromo() {
        try {
            const codesSnapshot = await db.collection('codesPromo').get();
            const tbody = document.getElementById('listeCodes');
            tbody.innerHTML = '';

            if (codesSnapshot.empty) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                            Aucun code promo créé pour le moment
                        </td>
                    </tr>
                `;
                return;
            }

            codesSnapshot.forEach(doc => {
                const data = doc.data();
                const row = `
                    <tr>
                        <td class="px-4 py-3">
                            <span class="font-mono bg-gray-100 px-2 py-1 rounded">${data.code}</span>
                        </td>
                        <td class="px-4 py-3">${data.description || 'Aucune description'}</td>
                        <td class="px-4 py-3 font-semibold">${data.reduction || 10}%</td>
                        <td class="px-4 py-3">${data.utilisations || 0} utilisations</td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${data.actif !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${data.actif !== false ? 'Actif' : 'Inactif'}
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            <button onclick="modifierCode('${doc.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="Modifier">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="supprimerCode('${doc.id}')" class="text-red-600 hover:text-red-800" title="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

        } catch (error) {
            console.error('Erreur chargement codes:', error);
            document.getElementById('listeCodes').innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-red-500">
                        Erreur lors du chargement des codes
                    </td>
                </tr>
            `;
        }
    }

    async chargerUtilisateurs() {
        try {
            const usersSnapshot = await db.collection('users').orderBy('dateCreation', 'desc').get();
            const tbody = document.getElementById('listeUtilisateurs');
            tbody.innerHTML = '';

            if (usersSnapshot.empty) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                            Aucun utilisateur inscrit
                        </td>
                    </tr>
                `;
                return;
            }

            usersSnapshot.forEach(doc => {
                const data = doc.data();
                const dateCreation = data.dateCreation?.toDate?.() || new Date();
                const dernierLogin = data.dernierLogin?.toDate?.() || new Date();
                
                const row = `
                    <tr>
                        <td class="px-4 py-3">${data.email}</td>
                        <td class="px-4 py-3">${dateCreation.toLocaleDateString('fr-FR')}</td>
                        <td class="px-4 py-3">${dernierLogin.toLocaleDateString('fr-FR')}</td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${data.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                                ${data.role || 'user'}
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            ${data.role !== 'admin' ? `
                                <button onclick="promouvoirAdmin('${doc.id}')" class="text-green-600 hover:text-green-800 text-sm" title="Promouvoir admin">
                                    <i class="fas fa-crown mr-1"></i> Admin
                                </button>
                            ` : '<span class="text-gray-400 text-sm">Déjà admin</span>'}
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

        } catch (error) {
            console.error('Erreur chargement utilisateurs:', error);
        }
    }

    async chargerParrainages() {
        try {
            const parrainagesSnapshot = await db.collection('parrainage').get();
            const tbody = document.getElementById('listeParrainages');
            tbody.innerHTML = '';

            if (parrainagesSnapshot.empty) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                            Aucun parrainage actif
                        </td>
                    </tr>
                `;
                return;
            }

            parrainagesSnapshot.forEach(doc => {
                const data = doc.data();
                const row = `
                    <tr>
                        <td class="px-4 py-3">${data.email}</td>
                        <td class="px-4 py-3">
                            <span class="font-mono bg-gray-100 px-2 py-1 rounded">${data.code}</span>
                        </td>
                        <td class="px-4 py-3">
                            <span class="font-semibold">${data.utilisations || 0}</span> / ${data.maxUtilisations || 5}
                        </td>
                        <td class="px-4 py-3 font-semibold">${data.recompensesTotal || 0} MRU</td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${data.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${data.actif ? 'Actif' : 'Inactif'}
                            </span>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

        } catch (error) {
            console.error('Erreur chargement parrainages:', error);
        }
    }

    async chargerActiviteRecente() {
        try {
            const activiteContainer = document.getElementById('activiteRecente');
            
            // Récupérer les derniers utilisateurs inscrits
            const usersSnapshot = await db.collection('users')
                .orderBy('dateCreation', 'desc')
                .limit(5)
                .get();

            let activiteHTML = '';
            
            usersSnapshot.forEach(doc => {
                const data = doc.data();
                const date = data.dateCreation?.toDate?.() || new Date();
                const timeAgo = this.getTimeAgo(date);
                
                activiteHTML += `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span class="text-sm">Nouvel utilisateur: ${data.email}</span>
                        </div>
                        <span class="text-xs text-gray-500">${timeAgo}</span>
                    </div>
                `;
            });

            activiteContainer.innerHTML = activiteHTML || '<div class="text-gray-500 text-center">Aucune activité récente</div>';

        } catch (error) {
            console.error('Erreur chargement activité:', error);
        }
    }

    async chargerTopParrains() {
        try {
            const topParrainsContainer = document.getElementById('topParrains');
            const parrainagesSnapshot = await db.collection('parrainage')
                .orderBy('recompensesTotal', 'desc')
                .limit(5)
                .get();

            let topParrainsHTML = '';
            
            parrainagesSnapshot.forEach(doc => {
                const data = doc.data();
                topParrainsHTML += `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="text-sm truncate">${data.email}</span>
                        <span class="text-sm font-semibold text-green-600">${data.recompensesTotal || 0} MRU</span>
                    </div>
                `;
            });

            topParrainsContainer.innerHTML = topParrainsHTML || '<div class="text-gray-500 text-center">Aucun parrain actif</div>';

        } catch (error) {
            console.error('Erreur chargement top parrains:', error);
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours} h`;
        if (diffDays === 1) return 'Hier';
        return `Il y a ${diffDays} jours`;
    }
}

// Fonctions globales
function afficherSection(sectionId) {
    // Masquer toutes les sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('section-active');
        section.classList.add('section-hidden');
    });
    
    // Mettre à jour la navigation
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('border-b-2', 'border-blue-500', 'text-blue-500');
        btn.classList.add('text-gray-500', 'hover:text-blue-500');
    });
    
    // Afficher la section demandée
    document.getElementById(sectionId).classList.remove('section-hidden');
    document.getElementById(sectionId).classList.add('section-active');
    
    // Mettre à jour le bouton actif
    event.target.classList.add('border-b-2', 'border-blue-500', 'text-blue-500');
    event.target.classList.remove('text-gray-500', 'hover:text-blue-500');
}

function afficherModalCreationCode() {
    document.getElementById('modalCreationCode').classList.remove('hidden');
    document.getElementById('modalCreationCode').classList.add('flex');
}

function fermerModalCreationCode() {
    document.getElementById('modalCreationCode').classList.add('hidden');
    document.getElementById('modalCreationCode').classList.remove('flex');
    document.getElementById('formCreationCode').reset();
}

async function deconnexionAdmin() {
    try {
        await auth.signOut();
        window.location.href = 'reductions.html';
    } catch (error) {
        console.error('Erreur déconnexion:', error);
        alert('Erreur lors de la déconnexion');
    }
}

// Gestion du formulaire de création de code
document.getElementById('formCreationCode').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const code = document.getElementById('nouveauCode').value.trim().toUpperCase();
    const description = document.getElementById('descriptionCode').value.trim();
    const reduction = document.getElementById('reductionCode').value;
    
    if (!code || !description) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    try {
        // Vérifier si le code existe déjà
        const codeExist = await db.collection('codesPromo').where('code', '==', code).get();
        if (!codeExist.empty) {
            alert('Ce code existe déjà!');
            return;
        }
        
        await db.collection('codesPromo').add({
            code: code,
            description: description,
            reduction: parseInt(reduction),
            actif: true,
            utilisations: 0,
            dateCreation: new Date()
        });
        
        fermerModalCreationCode();
        adminDashboard.chargerCodesPromo();
        adminDashboard.chargerStatistiques();
        
        alert('✅ Code promo créé avec succès!');
        
    } catch (error) {
        console.error('Erreur création code:', error);
        alert('❌ Erreur lors de la création du code promo');
    }
});

// Fonctions pour modifier/supprimer les codes (à implémenter)
function modifierCode(codeId) {
    alert('Fonction de modification à implémenter pour le code: ' + codeId);
}

function supprimerCode(codeId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce code promo?')) {
        db.collection('codesPromo').doc(codeId).delete()
            .then(() => {
                alert('Code promo supprimé avec succès!');
                adminDashboard.chargerCodesPromo();
                adminDashboard.chargerStatistiques();
            })
            .catch(error => {
                console.error('Erreur suppression:', error);
                alert('Erreur lors de la suppression du code');
            });
    }
}

// Fonction pour promouvoir un utilisateur admin
function promouvoirAdmin(userId) {
    if (confirm('Promouvoir cet utilisateur en administrateur?')) {
        db.collection('users').doc(userId).update({
            role: 'admin'
        })
        .then(() => {
            alert('Utilisateur promu admin avec succès!');
            adminDashboard.chargerUtilisateurs();
        })
        .catch(error => {
            console.error('Erreur promotion admin:', error);
            alert('Erreur lors de la promotion');
        });
    }
}

// Initialisation
const adminDashboard = new AdminDashboard();

// CSS pour les sections
const style = document.createElement('style');
style.textContent = `
    .section-active { display: block; }
    .section-hidden { display: none; }
`;
document.head.appendChild(style);
