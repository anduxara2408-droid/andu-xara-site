    // ===== ANALYTICS SÉCURISÉ =====
    window.dataLayer = window.dataLayer || [];
    
    // Fonction gtag sécurisée
    window.gtag = function() {
        if (window.dataLayer) {
            window.dataLayer.push(arguments);
        }
        console.log('🔧 Analytics:', arguments);
    };

    // Mode développement - Toujours actif mais sécurisé
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Mode développement - Analytics en mode simulation');
    } else {
        // Mode production - Chargement conditionnel
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-HMHF43YF7N';
        script.onerror = function() {
            console.log('❌ Google Analytics non chargé - ID potentiellement invalide');
        };
        document.head.appendChild(script);
        
        // Configuration de base
        gtag('js', new Date());
        gtag('config', 'G-HMHF43YF7N', {
            debug_mode: false,
            page_title: document.title,
            page_location: window.location.href
        });
    }

    // ===== FONCTIONS DE TRACKING ANALYTICS SÉCURISÉES =====
    function trackGAEvent(eventName, parameters) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, parameters);
        }
    }

    function trackPageView(pageTitle, pageLocation) {
        if (typeof gtag === 'function') {
            gtag('event', 'page_view', {
                page_title: pageTitle,
                page_location: pageLocation,
                page_path: window.location.pathname
            });
        }
    }

    function trackAddToCart(productName, category, price) {
        trackGAEvent('add_to_cart', {
            'currency': 'MRU',
            'value': price,
            'items': [{
                'item_name': productName,
                'item_category': category,
                'price': price,
                'quantity': 1
            }]
        });
    }

    function trackProductView(productName, category, price) {
        trackGAEvent('view_item', {
            'currency': 'MRU',
            'value': price,
            'items': [{
                'item_name': productName,
                'item_category': category,
                'price': price
            }]
        });
    }

    function trackPurchase(totalAmount, products) {
        trackGAEvent('purchase', {
            'currency': 'MRU',
            'value': totalAmount,
            'items': products
        });
    }

    // ===== CORRECTION AFFICHAGE EN TEMPS RÉEL =====
    function updateRewardsDisplay() {
        if (!window.userManager) return;

        const stats = window.userManager.getUserStats();
        const display = document.getElementById('rewards-display');
        const amount = document.getElementById('rewards-amount');
        const code = document.getElementById('user-code');

        if (display && amount && code) {
            amount.textContent = stats.rewards + ' MRU';
            code.textContent = 'Code: ' + stats.userCode;
            display.style.display = 'block';

            // Afficher un message de bienvenue si c'est un nouveau parrainage
            if (stats.hasUsedParrainage && stats.rewards > 0) {
                setTimeout(() => {
                    alert(`🎉 BIENVENUE ! Vous avez reçu ${stats.rewards} MRU grâce au parrainage !\nCode parrain: ${stats.parrainCode}`);
                }, 1000);
            }
        }
    }

    // Surcharger la fonction existante
    if (window.userManager) {
        const originalInit = window.userManager.init;
        window.userManager.init = function() {
            originalInit.call(this);
            setTimeout(updateRewardsDisplay, 500);
        };
    }

    // Mettre à jour toutes les 2 secondes
    setInterval(updateRewardsDisplay, 2000);
