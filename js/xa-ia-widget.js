// XA IA - Widget avec mémoire conversationnelle soninké
(function(){
    const styleId = 'xa-ia-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .xa-ia-widget{position:fixed;bottom:20px;right:20px;z-index:10000;font-family:'Inter',sans-serif}
            .xa-ia-button{width:60px;height:60px;border-radius:50%;background:#e67e22;border:none;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.2);transition:transform 0.3s;display:flex;align-items:center;justify-content:center;overflow:hidden}
            .xa-ia-button img{width:100%;height:100%;object-fit:cover}
            .xa-ia-button:hover{transform:scale(1.05)}
            .xa-ia-chat{position:absolute;bottom:80px;right:0;width:350px;height:500px;background:white;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,0.2);display:flex;flex-direction:column;overflow:hidden}
            .xa-ia-chat.hidden{display:none}
            .xa-ia-header{background:#e67e22;color:white;padding:15px;display:flex;align-items:center;gap:10px}
            .xa-ia-avatar{width:40px;height:40px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;overflow:hidden}
            .xa-ia-avatar img{width:100%;height:100%;object-fit:cover}
            .xa-ia-title{flex:1}
            .xa-ia-title h3{margin:0;font-size:16px}
            .xa-ia-title p{margin:0;font-size:11px;opacity:0.9}
            .xa-ia-close{background:none;border:none;color:white;font-size:24px;cursor:pointer}
            .xa-ia-messages{flex:1;overflow-y:auto;padding:15px;display:flex;flex-direction:column;gap:10px;background:#f8f9fa}
            .xa-ia-message{max-width:85%;padding:10px 12px;border-radius:15px;font-size:14px;line-height:1.4}
            .xa-ia-message.user{background:#e67e22;color:white;align-self:flex-end;border-bottom-right-radius:5px}
            .xa-ia-message.bot{background:white;color:#333;align-self:flex-start;border-bottom-left-radius:5px;box-shadow:0 1px 2px rgba(0,0,0,0.1)}
            .xa-ia-typing{display:flex;gap:5px;padding:10px 12px;background:white;border-radius:15px;align-self:flex-start}
            .xa-ia-typing span{width:8px;height:8px;background:#ccc;border-radius:50%;animation:xaTyping 1.4s infinite}
            .xa-ia-typing span:nth-child(2){animation-delay:0.2s}
            .xa-ia-typing span:nth-child(3){animation-delay:0.4s}
            @keyframes xaTyping{0%,60%,100%{transform:translateY(0);opacity:0.5}30%{transform:translateY(-8px);opacity:1}}
            .xa-ia-input-area{display:flex;padding:15px;border-top:1px solid #eee;background:white;gap:10px}
            .xa-ia-input{flex:1;padding:10px 12px;border:1px solid #ddd;border-radius:25px;font-family:inherit;font-size:14px;outline:none}
            .xa-ia-input:focus{border-color:#e67e22}
            .xa-ia-send{background:#e67e22;border:none;color:white;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:18px}
            @media (max-width:480px){.xa-ia-chat{width:calc(100vw - 40px);height:70vh}}
        `;
        document.head.appendChild(style);
    }

    // DICTIONNAIRE LOCAL DE CONVERSATION SONINKÉ
    const localResponses = {
        "an moxo": "Ma jam. Nawaari! Et toi, comment ça va?",
        "ammoxo": "Ma jam. Nawaari! Et toi?",
        "ma jam": "Ma jam nawaari! C'est l'essentiel. Ta journée se passe bien?",
        "nawaari": "Bisimilla! (De rien) C'est un plaisir.",
        "bisimilla": "Je t'en prie! N'hésite pas si tu as besoin d'aide.",
        "beeta": "Beeta! Bonjour! Comment se passe ta matinée?",
        "lella": "Lella! Bon après-midi! Je te souhaite une excellente journée.",
        "sunka": "Sunka! Bonsoir! Comment s'est passée ta journée?",
        "salaamu aleykum": "Aleykum salaam! Paix et sérénité sur toi.",
        "xori an wa jam": "Jam baane. Paix seulement. Et toi, tu es en paix?",
        "ka-dunko n moxo": "I wa jam, bisimilla. Merci de demander pour la famille!",
        "j'aimerais acheter": "Avec plaisir! Nos ensembles sont à 600 MRU. Lequel te plaît?",
        "concert": "Pispa Le Roi le 10ème jour Tabaski 2026 à 19h au Titanic Couva.",
        "pispa": "Pispa Le Roi en concert exceptionnel! Billetterie sur notre site.",
        "prix": "Tous nos ensembles sont à 600 MRU.",
        "azawad": "Azawad Bleu, 600 MRU. Coton peigné. Excellent choix!",
        "sahel": "Sahel Beige, 600 MRU. Élégance et confort.",
        "tagant": "Tagant Gris, 600 MRU. Moderne et racé.",
        "tichitt": "Tichitt Noir, 600 MRU. Intemporel.",
        "whatsapp": "Notre WhatsApp: +222 34 19 63 04",
        "contact": "Contact: +222 34 19 63 04 / contact@andu-xara.store"
    };

    // Fonction pour trouver la meilleure réponse locale
    function getLocalResponse(userMessage) {
        const message = userMessage.toLowerCase();
        for (const [key, response] of Object.entries(localResponses)) {
            if (message.includes(key)) {
                return response;
            }
        }
        return null;
    }

    let isOpen = false, isLoading = false;
    const apiEndpoint = "https://xa-ia-worker.microsansfiltre2408.workers.dev";
    const avatarImg = '/images/xa-ia-avatar.jpeg';

    const widgetHTML = `
        <div class="xa-ia-widget">
            <button class="xa-ia-button" id="xaIaToggle">
                <img src="${avatarImg}" alt="XA IA" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'font-size:32px; color:white;\\'>🧡</span>';">
                <span style="font-size:32px; color:white; display:none;">🧡</span>
            </button>
            <div class="xa-ia-chat hidden" id="xaIaChat">
                <div class="xa-ia-header">
                    <div class="xa-ia-avatar">
                        <img src="${avatarImg}" alt="XA IA" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'font-size:24px;\\'>🧡</span>';">
                        <span style="font-size:24px; display:none;">🧡</span>
                    </div>
                    <div class="xa-ia-title"><h3>XA IA</h3><p>Assistante mode & culture soninké</p></div>
                    <button class="xa-ia-close" id="xaIaClose">×</button>
                </div>
                <div class="xa-ia-messages" id="xaIaMessages">
                    <div class="xa-ia-message bot"><strong>Beeta !</strong><br>Bienvenue chez Andu-Xara. Je parle le soninké. 🧡<br><em style="font-size:12px;">Dis "An moxo?" (ça va?) ou parle-moi des produits.</em></div>
                </div>
                <div class="xa-ia-input-area">
                    <input type="text" class="xa-ia-input" id="xaIaInput" placeholder="Écris ton message...">
                    <button class="xa-ia-send" id="xaIaSend">➤</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    const chat = document.getElementById('xaIaChat');
    const toggleBtn = document.getElementById('xaIaToggle');
    const closeBtn = document.getElementById('xaIaClose');
    const sendBtn = document.getElementById('xaIaSend');
    const inputField = document.getElementById('xaIaInput');
    const messagesDiv = document.getElementById('xaIaMessages');

    function addMessage(text, isUser) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `xa-ia-message ${isUser ? 'user' : 'bot'}`;
        msgDiv.innerHTML = isUser ? text : text.replace(/\n/g, '<br>');
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'xa-ia-typing';
        typing.id = 'xaIaTyping';
        typing.innerHTML = '<span></span><span></span><span></span>';
        messagesDiv.appendChild(typing);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function hideTyping() {
        const typing = document.getElementById('xaIaTyping');
        if (typing) typing.remove();
    }

    async function sendMessage() {
        const msg = inputField.value.trim();
        if (!msg || isLoading) return;
        addMessage(msg, true);
        inputField.value = '';
        isLoading = true;

        // 1. Priorité à la réponse locale
        const localReply = getLocalResponse(msg);
        if (localReply) {
            setTimeout(() => {
                addMessage(localReply, false);
                isLoading = false;
            }, 300);
            return;
        }

        // 2. Si aucune réponse locale, on ne fait rien pour éviter les erreurs.
        // On pourrait ici ajouter une réponse par défaut.
        setTimeout(() => {
            addMessage("Je n'ai pas encore appris cette expression. Essaie 'An moxo?', 'Beeta', ou parle des produits.", false);
            isLoading = false;
        }, 300);
    }

    toggleBtn.onclick = () => {
        isOpen = !isOpen;
        chat.classList.toggle('hidden', !isOpen);
        if (isOpen) inputField.focus();
    };
    closeBtn.onclick = () => {
        chat.classList.add('hidden');
        isOpen = false;
    };
    sendBtn.onclick = sendMessage;
    inputField.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
})();
