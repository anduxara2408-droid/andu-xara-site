// XA IA - Widget Chatbot intelligent pour Andu-Xara
// Utilise Groq API via Cloudflare Worker (sécurisé)

// Configuration
const XA_IA_CONFIG_WIDGET = {
    apiEndpoint: "https://xa-ia-worker.microsansfiltre2408.workers.dev",
    isOpen: false,
    isLoading: false
};

// Éléments DOM
let xaWidget = null;
let xaMessages = null;
let xaInput = null;

// Initialisation
function initXAIA() {
    // Injecter les styles
    const stylesLink = document.createElement('link');
    stylesLink.rel = 'stylesheet';
    stylesLink.href = '/css/xa-ia.css';
    document.head.appendChild(stylesLink);
    
    // Injecter la configuration
    const configScript = document.createElement('script');
    configScript.src = '/js/xa-ia-config.js';
    configScript.onload = () => {
        // Après chargement de la config, créer le widget
        createWidget();
    };
    document.head.appendChild(configScript);
}

// Créer le widget HTML
function createWidget() {
    const widgetHTML = `
        <div class="xa-ia-widget">
            <button class="xa-ia-button" id="xaIaToggle">
                <img src="/images/xa-ia-avatar.jpeg" alt="XA IA" onerror="this.style.display='none'; this.nextSibling.style.display='flex';">
                <span class="default-icon" style="display: none;">💬</span>
            </button>
            <div class="xa-ia-chat hidden" id="xaIaChat">
                <div class="xa-ia-header">
                    <div class="xa-ia-avatar">
                        <img src="/images/xa-ia-avatar.jpeg" alt="XA IA" onerror="this.style.display='none'; this.nextSibling.style.display='flex';">
                        <span class="default-avatar" style="display: none;">🧡</span>
                    </div>
                    <div class="xa-ia-title">
                        <h3>XA IA</h3>
                        <p>Assistante mode & culture</p>
                    </div>
                    <button class="xa-ia-close" id="xaIaClose">×</button>
                </div>
                <div class="xa-ia-messages" id="xaIaMessages">
                    <div class="xa-ia-message bot">
                        <strong>I ni ce !</strong><br>
                        Bienvenue chez Andu-Xara. Je suis XA IA, ton assistante fière et moderne. 💬<br>
                        <em style="font-size: 12px;">Pose-moi des questions sur nos produits, le concert, ou même apprends le soninké avec moi !</em>
                    </div>
                </div>
                <div class="xa-ia-input-area">
                    <input type="text" class="xa-ia-input" id="xaIaInput" placeholder="Écris ton message...">
                    <button class="xa-ia-send" id="xaIaSend">➤</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    
    // Attacher les événements
    document.getElementById('xaIaToggle').addEventListener('click', toggleChat);
    document.getElementById('xaIaClose').addEventListener('click', closeChat);
    document.getElementById('xaIaSend').addEventListener('click', sendMessage);
    xaInput = document.getElementById('xaIaInput');
    xaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    xaMessages = document.getElementById('xaIaMessages');
}

// Toggle chat
function toggleChat() {
    const chat = document.getElementById('xaIaChat');
    XA_IA_CONFIG_WIDGET.isOpen = !XA_IA_CONFIG_WIDGET.isOpen;
    chat.classList.toggle('hidden', !XA_IA_CONFIG_WIDGET.isOpen);
    if (XA_IA_CONFIG_WIDGET.isOpen) {
        xaInput.focus();
    }
}

function closeChat() {
    const chat = document.getElementById('xaIaChat');
    XA_IA_CONFIG_WIDGET.isOpen = false;
    chat.classList.add('hidden');
}

// Ajouter un message
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `xa-ia-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = isUser ? text : text.replace(/\n/g, '<br>');
    xaMessages.appendChild(messageDiv);
    xaMessages.scrollTop = xaMessages.scrollHeight;
    return messageDiv;
}

// Afficher l'indicateur de frappe
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'xa-ia-typing';
    typingDiv.id = 'xaIaTyping';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    xaMessages.appendChild(typingDiv);
    xaMessages.scrollTop = xaMessages.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('xaIaTyping');
    if (typing) typing.remove();
}

// Envoyer un message
async function sendMessage() {
    const message = xaInput.value.trim();
    if (!message || XA_IA_CONFIG_WIDGET.isLoading) return;
    
    // Afficher le message de l'utilisateur
    addMessage(message, true);
    xaInput.value = '';
    xaInput.style.height = 'auto';
    
    // Marquer comme chargement
    XA_IA_CONFIG_WIDGET.isLoading = true;
    
    // Vérifier les réponses rapides locales
    const quickResponse = typeof findQuickResponse !== 'undefined' ? findQuickResponse(message) : null;
    
    if (quickResponse) {
        // Réponse locale immédiate
        setTimeout(() => {
            addMessage(quickResponse, false);
            XA_IA_CONFIG_WIDGET.isLoading = false;
        }, 500);
        return;
    }
    
    // Vérifier si c'est une demande de traduction soninké
    const soninkeMatch = message.match(/traduis? (.*?) en (soninké|soninke|soninké)/i);
    if (soninkeMatch) {
        const word = soninkeMatch[1];
        const translation = typeof getSoninkeWord !== 'undefined' ? getSoninkeWord(word) : null;
        if (translation) {
            addMessage(`🔤 *${word}* en soninké se dit : **${translation}**\n\nI ni wali d'avoir appris ce mot ! 🧡`, false);
            XA_IA_CONFIG_WIDGET.isLoading = false;
            return;
        } else {
            addMessage("Je n'ai pas encore ce mot dans mon dictionnaire soninké, mais je peux le chercher ! Je vais m'améliorer avec toi. 🧡", false);
            XA_IA_CONFIG_WIDGET.isLoading = false;
            return;
        }
    }
    
    // Appeler l'API IA via Cloudflare Worker
    showTyping();
    
    try {
        const response = await fetch(XA_IA_CONFIG_WIDGET.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        
        if (!response.ok) throw new Error('Erreur API');
        
        const data = await response.json();
        hideTyping();
        addMessage(data.response || "Je n'ai pas pu traiter ta demande. Réessaie !", false);
    } catch (error) {
        console.error('Erreur XA IA:', error);
        hideTyping();
        addMessage("🔌 Désolé, je rencontre un problème technique. Réessaie dans quelques instants. En attendant, tu peux consulter notre site ! 🧡", false);
    }
    
    XA_IA_CONFIG_WIDGET.isLoading = false;
}

// Démarrer au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initXAIA);
} else {
    initXAIA();
}
