// js/pwa-install.js - Gestion installation PWA
class PWAInstall {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        console.log('📱 PWA Install - Initialisation');
        
        // Écouter l'événement d'installation
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
            console.log('📲 Installation PWA disponible');
        });

        // Vérifier si déjà installé
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ Application déjà installée');
            this.hideInstallPrompt();
        }

        // Écouter l'installation
        window.addEventListener('appinstalled', () => {
            console.log('🎉 Application installée avec succès!');
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        });

        this.registerServiceWorker();
        this.checkConnection();
    }

    showInstallPrompt() {
        // Créer une bannière d'installation discrète
        const installBanner = document.createElement('div');
        installBanner.id = 'pwa-install-banner';
        installBanner.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #8B4513, #A0522D);
                color: white;
                padding: 12px 16px;
                border-radius: 25px;
                box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
            ">
                <i class="fas fa-mobile-alt"></i>
                <span>Installer l'app</span>
                <button onclick="pwaInstall.hideInstallPrompt()" style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    margin-left: 5px;
                ">×</button>
            </div>
        `;

        installBanner.addEventListener('click', () => {
            this.installPWA();
        });

        document.body.appendChild(installBanner);
    }

    hideInstallPrompt() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.remove();
        }
    }

    async installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ Utilisateur a accepté l installation');
            } else {
                console.log('❌ Utilisateur a refusé l installation');
            }
            
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker enregistré:', registration);
                
            } catch (error) {
                console.error('❌ Erreur Service Worker:', error);
            }
        }
    }

    // Méthode pour vérifier la connexion
    checkConnection() {
        if (!navigator.onLine) {
            this.showOfflineMessage();
        }
        
        window.addEventListener('online', () => {
            this.hideOfflineMessage();
            console.log('🌐 Connexion rétablie');
        });
        
        window.addEventListener('offline', () => {
            this.showOfflineMessage();
            console.log('📴 Mode hors ligne');
        });
    }

    showOfflineMessage() {
        if (!document.getElementById('offline-message')) {
            const message = document.createElement('div');
            message.id = 'offline-message';
            message.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #ff6b6b;
                    color: white;
                    text-align: center;
                    padding: 10px;
                    z-index: 10001;
                    font-size: 14px;
                ">
                    <i class="fas fa-wifi"></i> Mode hors ligne - Fonctionnalités limitées
                </div>
            `;
            document.body.appendChild(message);
        }
    }

    hideOfflineMessage() {
        const message = document.getElementById('offline-message');
        if (message) {
            message.remove();
        }
    }
}

// Initialisation
const pwaInstall = new PWAInstall();
