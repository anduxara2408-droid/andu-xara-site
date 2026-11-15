export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Stockage simple en mémoire (pour le moment)
    let documents = [];
    
    // Route pour ajouter un document
    if (path === "/add" && request.method === "POST") {
      try {
        const { content, metadata } = await request.json();
        
        if (!content) {
          return new Response(JSON.stringify({ error: "Le champ 'content' est requis" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        // Stocker dans Vectorize avec un vecteur factice (on utilisera la recherche par mots-clés)
        const id = crypto.randomUUID();
        const dummyVector = new Array(1024).fill(0);
        
        await env.VECTORIZE_INDEX.upsert([
          { id, vector: dummyVector, metadata: { content, ...(metadata || {}) } }
        ]);
        
        return new Response(JSON.stringify({ 
          success: true, 
          id, 
          message: "Document ajouté (mode recherche par mots-clés)",
          content_preview: content.substring(0, 50) + "..."
        }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    // Route pour lister les documents (debug)
    if (path === "/list" && request.method === "GET") {
      try {
        // On ne peut pas lister directement avec Vectorize, donc on retourne un message
        return new Response(JSON.stringify({ 
          message: "Utilisez /chat pour interroger la base",
          note: "La recherche se fait par mots-clés pour le moment"
        }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    // Route pour chatter avec RAG (recherche par mots-clés)
    if (path === "/chat" && request.method === "POST") {
      try {
        const { question } = await request.json();
        
        if (!question) {
          return new Response(JSON.stringify({ error: "Le champ 'question' est requis" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        // Récupérer tous les documents de Vectorize (on ne peut pas, donc on utilise une approche différente)
        // Pour le moment, on va répondre sans RAG en attendant de pouvoir récupérer les documents
        
        const prompt = `Tu es XA IA, un assistant expert en langue et culture Soninké (Aja / Sarakolé).

⚠️ IMPORTANT : Pour le moment, je n'ai pas encore accès à ma base de connaissances.

RÈGLES :
- Si tu ne connais pas la réponse, dis : "Je ne trouve pas cette information dans ma base de connaissances pour le moment."
- Ne invente pas de mots soninkés.
- Sois honnête sur ce que tu sais et ne sais pas.

QUESTION : ${question}

RÉPONSE :`;
        
        // Génération avec Mistral
        const answer = await env.AI.run("@cf/mistral/mistral-7b-instruct-v0.1", {
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.7
        });
        
        return new Response(JSON.stringify({ 
          answer: answer.response,
          mode: "sans RAG (en attente de correction de l'embedding)"
        }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    // Health check
    if (path === "/health" && request.method === "GET") {
      return new Response(JSON.stringify({ 
        status: "OK", 
        service: "XA IA RAG",
        timestamp: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Route par défaut
    return new Response(JSON.stringify({
      service: "XA IA RAG",
      version: "1.0",
      endpoints: {
        "/add (POST)": "Ajouter un document",
        "/chat (POST)": "Discuter",
        "/health (GET)": "Vérifier l'état",
        "/list (GET)": "Lister les documents (debug)"
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
