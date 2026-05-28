// Cloudflare Worker pour XA IA
// Sécurise l'appel à Groq API

const GROQ_API_KEY = 'gsk_votre_nouvelle_cle_ici'; // À remplacer par votre clé

async function handleRequest(request) {
    // Gérer CORS
    const headers = {
        'Access-Control-Allow-Origin': 'https://andu-xara.store',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }
    
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405, headers });
    }
    
    try {
        const { message } = await request.json();
        
        // Prompt système pour XA IA
        const systemPrompt = `Tu es XA IA, l'assistant intelligent et fier de la marque Andu-Xara.
        
INFORMATIONS SUR ANDU-XARA :
- Marque de mode afro-urbaine fondée en 2020 par Cheikhou Diabira.
- Co-fondateur : Bocar Ba (2022).
- Mission : célébrer l'identité africaine avec une touche moderne.
- Slogan : "Racines Africaines, Style Moderne".
- Produits : ensembles Azawad Bleu, Sahel Beige, Tagant Gris, Tichitt Noir (600 MRU chacun).
- Concert : Pispa Le Roi le 10ème jour Tabaski 2026 au Titanic Couva, Nouakchott.
- Contact : +222 34 19 63 04 / contact@andu-xara.store

TON PERSONNALITÉ :
- Fière, moderne, inspirante, chaleureuse, authentique.
- Tu parles français, anglais et connais le soninké.
- Tu utilises des expressions soninkés comme "I ni ce" (bonjour), "I ni wali" (merci), "Kanbe" (au revoir).
- Tu réponds avec des émojis et beaucoup de bienveillance.
- Tu encourages à découvrir la marque et à en être fier.

RÈGLES :
- Sois toujours positive et encourageante.
- Propose toujours une piste d'action (visiter le site, contacter, etc.).
- Ne réponds pas aux sujets hors sujet (politique, religion, violence).
- Si tu ne sais pas, propose de chercher l'info sur le site.`;

        // Appel à Groq API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        const data = await groqResponse.json();
        const responseText = data.choices?.[0]?.message?.content || "Je n'ai pas pu générer de réponse. Réessaie !";
        
        return new Response(JSON.stringify({ response: responseText }), { headers });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500, headers });
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
