// ===== DONNÉES DES ÉVÉNEMENTS =====

export const EVENTS = {
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
        available: {
            prevente: 5,
            jourj: 5,
            vip: 3
        },
        description: 'Le roi du rap mauritanien en concert exceptionnel pour la Tabaski'
    }
};

// Récupérer un événement par son ID
export function getEventById(id) {
    return EVENTS[id];
}

// Vérifier la disponibilité
export function checkAvailability(eventId, ticketType, quantity) {
    const event = EVENTS[eventId];
    if (!event) return false;
    return event.available[ticketType] >= quantity;
}

