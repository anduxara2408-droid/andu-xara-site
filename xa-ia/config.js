/* Configuration de XA IA.
 * XA_IA_ENDPOINT : adresse du serveur de XA IA (Cloudflare Worker).
 * Le serveur apporte les réponses complètes, la recherche web, la recherche approfondie,
 * l'import d'image et la réception des mots proposés. Mode d'emploi : worker/README.md
 * Tant que le serveur ne répond pas, XA IA continue avec sa base locale de soninké.
 */
window.XA_IA_ENDPOINT = "https://xa-ia.microsansfiltre2408.workers.dev";
/* Analyse d'image : true : le bouton image est visible. Le Worker envoie l'image à un modèle Groq qui lit les images (qwen/qwen3.8-27b). */
window.XA_IA_IMAGE = true;
window.XA_IA_WA = "22249037697";
window.XA_IA_WA_TXT = "+222 49037697";
