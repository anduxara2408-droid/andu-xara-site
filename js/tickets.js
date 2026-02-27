// tickets.js - Gestion complète des billets pour le concert Pispa Le Roi
console.log('🎫 Chargement de tickets.js...');

// ===== CONFIGURATION DES ÉVÉNEMENTS =====
const EVENTS = {
    'pispa-tabaski-2026': {
        id: 'pispa-tabaski-2026',
        name: 'Pispa Le Roi - Concert Tabaski',
        artist: 'Pispa Le Roi',
        date: '2026-04-15',
        time: '21:00',
        location: 'Titanic Couva, Nouakchott',
        city: 'nouakchott',
        artists: ['Pispa Le Roi', 'Invités surprises'],
        prices: {
            prevente: 100,
            jourj: 150,
            vip: 200
        },
        description: 'Le roi du rap mauritanien en concert exceptionnel pour la Tabaski'
    }
};

// ===== FONCTION PRINCIPALE D'ACHAT DE BILLET =====
async function buyTicket(concertId, ticketType, quantity = 1, active = false) {
    console.log('🎫 buyTicket appelé avec:', { concertId, ticketType, quantity, active });
    
    // Vérifier si l'utilisateur est connecté
    const user = auth.currentUser;
    if (!user) {
        console.log('❌ Utilisateur non connecté');
        return { 
            success: false, 
            message: 'Veuillez vous connecter pour acheter des billets',
            code: 'NOT_LOGGED_IN'
        };
    }

    try {
        // Récupérer les informations du concert
        const concert = EVENTS[concertId];
        if (!concert) {
            console.error('Concert non trouvé:', concertId);
            return { 
                success: false, 
                message: '❌ Concert invalide',
                code: 'INVALID_CONCERT'
            };
        }

        // Vérifier le type de billet
        if (!concert.prices[ticketType]) {
            return { 
                success: false, 
                message: 'Type de billet invalide',
                code: 'INVALID_TICKET_TYPE'
            };
        }

        const ticketPrice = concert.prices[ticketType];
        const totalAmount = ticketPrice * quantity;

        // Limiter la quantité à 5 billets par achat
        if (quantity > 5) {
            return { 
                success: false, 
                message: 'Maximum 5 billets par achat',
                code: 'MAX_QUANTITY_EXCEEDED'
            };
        }

        // Générer les billets
        const tickets = [];
        const ticketPromises = [];

        for (let i = 0; i < quantity; i++) {
            // Générer un ID unique pour chaque billet
            const ticketId = generateTicketId();
            
            // Préparer les données du billet
            const ticketData = {
                ticketId: ticketId,
                concertId: concertId,
                concertName: concert.name,
                concertDate: concert.date,
                concertTime: concert.time,
                concertLocation: concert.location,
                ticketType: ticketType,
                ticketTypeName: getTicketTypeName(ticketType),
                price: ticketPrice,
                userId: user.uid,
                userEmail: user.email,
                userName: await getUserName(user.uid) || user.email.split('@')[0],
                purchasedAt: new Date(),
                active: active,
                used: false,
                usedAt: null,
                validatedBy: null,
                qrCode: null
            };

            // Générer le QR code
            const qrCodeUrl = await generateQRCode(ticketData);
            ticketData.qrCode = qrCodeUrl;

            // Sauvegarder dans Firestore
            const savePromise = db.collection('tickets').doc(ticketId).set(ticketData);
            ticketPromises.push(savePromise);
            tickets.push(ticketData);
        }

        // Attendre que tous les billets soient sauvegardés
        await Promise.all(ticketPromises);

        // Mettre à jour l'utilisateur
        const userRef = db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data() || {};

        // Ajouter les billets à l'historique de l'utilisateur
        const existingTickets = userData.tickets || [];
        const newTickets = tickets.map(t => ({
            ticketId: t.ticketId,
            concertName: t.concertName,
            concertDate: t.concertDate,
            qrCode: t.qrCode,
            price: t.price,
            purchasedAt: new Date().toISOString()
        }));

        // Ajouter des points de fidélité (1 point par 100 MRU)
        const pointsEarned = Math.floor(totalAmount / 100);
        const currentRewards = userData.rewards || 0;

        await userRef.update({
            tickets: [...existingTickets, ...newTickets],
            rewards: currentRewards + pointsEarned,
            lastPurchase: new Date()
        });

        // Ajouter à l'historique des achats
        await db.collection('purchases').add({
            userId: user.uid,
            userEmail: user.email,
            tickets: tickets.map(t => t.ticketId),
            totalAmount: totalAmount,
            pointsEarned: pointsEarned,
            purchasedAt: new Date()
        });

        console.log('✅ Achat réussi:', { totalAmount, pointsEarned, tickets });
        return { 
            success: true, 
            tickets: tickets,
            totalAmount: totalAmount,
            pointsEarned: pointsEarned,
            message: `✅ ${quantity} billet(s) acheté(s) avec succès !`,
            code: 'SUCCESS'
        };

    } catch (error) {
        console.error('❌ Erreur détaillée lors de l\'achat:', error);
        return { 
            success: false, 
            message: 'Erreur lors de l\'achat. Veuillez réessayer.',
            error: error.message,
            code: 'UNKNOWN_ERROR'
        };
    }
}

// ===== GÉNÉRER UN ID UNIQUE DE BILLET =====
function generateTicketId() {
    const prefix = 'PISPA';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const checksum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${timestamp}-${random}-${checksum}`;
}

// ===== GÉNÉRER QR CODE =====
async function generateQRCode(ticketData) {
    try {
        // Créer les données à encoder dans le QR code
        const qrData = {
            tid: ticketData.ticketId,
            cid: ticketData.concertId,
            uid: ticketData.userId,
            type: ticketData.ticketType,
            price: ticketData.price,
            event: ticketData.concertName.substring(0, 10)
        };

        // Convertir en string JSON
        const dataString = JSON.stringify(qrData);
        
        // Encoder pour URL
        const encodedData = encodeURIComponent(dataString);
        
        // Utiliser l'API de QR code
        const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
        
        return qrApi;
    } catch (error) {
        console.error('Erreur génération QR:', error);
        return `https://via.placeholder.com/300x300/667eea/ffffff?text=${ticketData.ticketId.substring(0,8)}`;
    }
}

// ===== RÉCUPÉRER LE NOM DU TYPE DE BILLET =====
function getTicketTypeName(type) {
    const names = {
        'prevente': 'Prévente',
        'jourj': 'Jour J',
        'vip': 'VIP',
        'standard': 'Standard'
    };
    return names[type] || type;
}

// ===== RÉCUPÉRER LE NOM DE L'UTILISATEUR =====
async function getUserName(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        return userDoc.data()?.displayName || null;
    } catch {
        return null;
    }
}

// ===== VALIDER UN BILLET (POUR LE SCANNER) =====
async function validateTicket(ticketId, agentPhone, eventId = null) {
    try {
        const ticketRef = db.collection('tickets').doc(ticketId);
        const ticketDoc = await ticketRef.get();

        if (!ticketDoc.exists) {
            return { 
                valid: false, 
                message: '❌ Billet inexistant',
                code: 'NOT_FOUND'
            };
        }

        const ticket = ticketDoc.data();

        if (!ticket.active) {
            return { 
                valid: false, 
                message: '❌ Billet non activé',
                code: 'NOT_ACTIVE'
            };
        }

        if (ticket.used) {
            return { 
                valid: false, 
                message: '❌ Billet déjà utilisé',
                code: 'ALREADY_USED'
            };
        }

        if (eventId && ticket.concertId !== eventId) {
            return { 
                valid: false, 
                message: '❌ Billet pour un autre événement',
                code: 'WRONG_EVENT'
            };
        }

        await ticketRef.update({
            used: true,
            usedAt: new Date(),
            validatedBy: agentPhone
        });

        return { 
            valid: true, 
            message: '✅ Entrée validée !',
            ticket: {
                concertName: ticket.concertName,
                ticketType: ticket.ticketTypeName,
                userName: ticket.userName,
                userEmail: ticket.userEmail
            },
            code: 'SUCCESS'
        };

    } catch (error) {
        console.error('Erreur validation:', error);
        return { 
            valid: false, 
            message: '❌ Erreur technique',
            code: 'ERROR'
        };
    }
}

// ===== ACTIVER UN BILLET (ADMIN) =====
async function activateTicket(ticketId, activatedBy) {
    try {
        await db.collection('tickets').doc(ticketId).update({
            active: true,
            activatedAt: new Date(),
            activatedBy: activatedBy
        });
        return { success: true, message: 'Billet activé avec succès' };
    } catch (error) {
        console.error('Erreur activation:', error);
        return { success: false, message: error.message };
    }
}

// ===== ACTIVER PLUSIEURS BILLETS (ADMIN) =====
async function activateMultipleTickets(ticketIds, activatedBy) {
    try {
        const batch = db.batch();
        ticketIds.forEach(id => {
            const ref = db.collection('tickets').doc(id);
            batch.update(ref, { 
                active: true, 
                activatedAt: new Date(), 
                activatedBy: activatedBy 
            });
        });
        await batch.commit();
        return { success: true, count: ticketIds.length };
    } catch (error) {
        console.error('Erreur activation multiple:', error);
        return { success: false, error: error.message };
    }
}

// ===== STATISTIQUES DES VENTES =====
async function getSalesStats(eventId) {
    try {
        const snapshot = await db.collection('tickets')
            .where('concertId', '==', eventId)
            .get();
        
        let total = 0;
        let revenue = 0;
        let active = 0;
        let used = 0;

        snapshot.forEach(doc => {
            const t = doc.data();
            const qty = t.quantity || 1;
            total += qty;
            revenue += (t.price || 0) * qty;
            if (t.active) active += qty;
            if (t.used) used += qty;
        });

        return { 
            total, 
            revenue, 
            active, 
            pending: total - active - used, 
            used 
        };
    } catch (error) {
        console.error('Erreur stats:', error);
        return { total: 0, revenue: 0, active: 0, pending: 0, used: 0 };
    }
}

// ===== RECHERCHER DES BILLETS (ADMIN) =====
async function searchTickets(searchTerm) {
    try {
        const snapshot = await db.collection('tickets').get();
        const results = [];
        
        snapshot.forEach(doc => {
            const ticket = doc.data();
            if (ticket.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.userPhone?.includes(searchTerm)) {
                results.push({ id: doc.id, ...ticket });
            }
        });
        
        return results;
    } catch (error) {
        console.error('Erreur recherche:', error);
        return [];
    }
}

// ===== EXPORTER LES DONNÉES (ADMIN) =====
async function exportTicketsData(eventId = null) {
    try {
        let query = db.collection('tickets');
        if (eventId) {
            query = query.where('concertId', '==', eventId);
        }
        
        const snapshot = await query.get();
        const tickets = [];
        
        snapshot.forEach(doc => {
            tickets.push({ id: doc.id, ...doc.data() });
        });
        
        return tickets;
    } catch (error) {
        console.error('Erreur export:', error);
        return [];
    }
}

// ===== EXPOSER LES FONCTIONS GLOBALEMENT =====
window.buyTicket = buyTicket;
window.validateTicket = validateTicket;
window.activateTicket = activateTicket;
window.activateMultipleTickets = activateMultipleTickets;
window.getSalesStats = getSalesStats;
window.searchTickets = searchTickets;
window.exportTicketsData = exportTicketsData;
window.EVENTS = EVENTS;
window.getTicketTypeName = getTicketTypeName;

console.log('✅ tickets.js chargé avec succès');
console.log('📊 Concerts disponibles:', Object.keys(EVENTS));
console.log('🎫 buyTicket disponible:', typeof window.buyTicket);
