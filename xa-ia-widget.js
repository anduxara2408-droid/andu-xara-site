// XA IA - Widget Chatbot intelligent pour Andu-Xara

const XA_IA_CONFIG_WIDGET = {
    apiEndpoint: "https://xa-ia-worker.microsansfiltre2408.workers.dev",
    isOpen: false,
    isLoading: false
};

let xaWidget = null;
let xaMessages = null;
let xaInput = null;

function initXAIA() {
    const stylesLink = document.createElement('link');
    stylesLink.rel = 'stylesheet';
    stylesLink.href = '/css/xa-ia.css';
    document.head.appendChild(stylesLink);
    
    const configScript = document.createElement('script');
    configScript.src = '/js/xa-ia-config.js';
    configScript.onload = () => {
        createWidget();
    };
    document.head.appendChild(configScript);
}

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
    
    document.getElementById('xaIaToggle').addEventListener('click', toggleChat);
    document.getElementById('xaIaClose').addEventListener('click', closeChat);
    document.getElementById('xaIaSend').addEventListener('click', sendMessage);
    xaInput = document.getElementById('xaIaInput');
    xaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    xaMessages = document.getElementById('xaIaMessages');
}

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

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `xa-ia-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = isUser ? text : text.replace(/\n/g, '<br>');
    xaMessages.appendChild(messageDiv);
    xaMessages.scrollTop = xaMessages.scrollHeight;
    return messageDiv;
}

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

async function sendMessage() {
    const message = xaInput.value.trim();
    if (!message || XA_IA_CONFIG_WIDGET.isLoading) return;
    
    addMessage(message, true);
    xaInput.value = '';
    
    XA_IA_CONFIG_WIDGET.isLoading = true;
    
    const quickResponse = typeof findQuickResponse !== 'undefined' ? findQuickResponse(message) : null;
    
    if (quickResponse) {
        setTimeout(() => {
            addMessage(quickResponse, false);
            XA_IA_CONFIG_WIDGET.isLoading = false;
        }, 500);
        return;
    }
    
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
        addMessage(data.response || "Je n'ai pas pu traiter ta demande.", false);
    } catch (error) {
        console.error('Erreur XA IA:', error);
        hideTyping();
        addMessage("🔌 Désolé, je rencontre un problème technique. Réessaie dans quelques instants. 🧡", false);
    }
    
    XA_IA_CONFIG_WIDGET.isLoading = false;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initXAIA);
} else {
    initXAIA();
}
