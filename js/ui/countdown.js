// ===== MENU MOBILE CORRIGÉ =====
function initMenuMobile() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.menu-overlay');

    // ✅ CORRECTION : Vérifier si les éléments existent AVANT d'ajouter les events
    if (toggleBtn && menu && overlay) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
            toggleBtn.setAttribute('aria-expanded', menu.classList.contains('active'));
        });

        overlay.addEventListener('click', () => {
            menu.classList.remove('active');
            overlay.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });

        // Fermer le menu au clic sur un lien
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                overlay.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
    // ✅ Si les éléments n'existent pas, pas d'erreur - silence is golden
}

// ✅ APPEL SÉCURISÉ - Menu mobile seulement si éléments existent
document.addEventListener('DOMContentLoaded', function() {
    initMenuMobile();
});

        // ===== WISHLIST =====
        function toggleWishlist(productId) {
            const index = wishlistItems.indexOf(productId);
            const button = event.currentTarget;
            
            if (index > -1) {
                wishlistItems.splice(index, 1);
                button.classList.remove('active');
                showNotification('Retiré des favoris', 'warning');
            } else {
                wishlistItems.push(productId);
                button.classList.add('active');
                showNotification('Ajouté aux favoris ❤️');
            }
            
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
            updateWishlistCounter();
        }

        function updateWishlistCounter() {
            const counter = document.getElementById('wishlist-counter');
            if (counter) {
                counter.textContent = wishlistItems.length;
            }
        }


        // ===== BADGE SONINKÉ =====
        function initSoninkeBadge() {
            const messagesLeft = [
                "Xa kéé biré waaga Soninko",
                "Bonne fête de la langue Soninké !",
                "Profitez de votre journée !"
            ];

            let indexLeft = 0;
            const textElLeft = document.getElementById('soninke-text-left');

            setInterval(() => {
                textElLeft.style.opacity = 0;
                setTimeout(() => {
                    indexLeft = (indexLeft + 1) % messagesLeft.length;
                    textElLeft.textContent = messagesLeft[indexLeft];
                    textElLeft.style.opacity = 1;
                }, 500);
            }, 3000);
              } 


        // ===== VARIATIONS PRODUITS =====
        function initVariationButtons() {
            document.querySelectorAll('.variation-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const parent = this.closest('.variation-selector');
                    parent.querySelectorAll('.variation-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });
        }

        function getSelectedSize() {
            const activeSize = document.querySelector('.variation-btn.active[data-size]');
            return activeSize ? activeSize.dataset.size : 'M';
        }

        // ===== RECHERCHE =====
        document.getElementById('search-input').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const title = product.querySelector('.product-title').textContent.toLowerCase();
                const description = product.querySelector('.product-description').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });

        // ===== CATÉGORIES =====
        document.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });

                this.classList.add('active');
                const category = this.getAttribute('data-category');
                const products = document.querySelectorAll('.product-card');
                
                products.forEach(product => {
                    if (category === 'tous') {
                        product.style.display = 'block';
                    } else {
                        const productCategory = product.getAttribute('data-category');
                        product.style.display = (productCategory === category) ? 'block' : 'none';
                    }
                });
            });
        });

        // ===== BANNIÈRES CATÉGORIES =====
        document.querySelectorAll('.category-banner').forEach(banner => {
            banner.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                document.querySelector(`.category-btn[data-category="${category}"]`).click();
                window.scrollTo({ top: document.querySelector('.products-grid').offsetTop - 100, behavior: 'smooth' });
            });
        });


        // ===== NOTIFICATIONS =====
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = 'notification ' + type;
            notification.innerHTML = `
                <span class="notification-icon">${type === 'success' ? '✅' : '⚠️'}</span>
                <span>${message}</span>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // ===== TOAST =====
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // ===== FILTRES PRODUITS =====
        function filtrerProduits() {
            const categorie = document.getElementById('categorie').value;
            const prixMax = parseInt(document.getElementById('prix').value);
            const produits = document.querySelectorAll('.produit');

            produits.forEach(produit => {
                const produitCategorie = produit.getAttribute('data-categorie');
                const produitPrix = parseInt(produit.getAttribute('data-prix'));

                const matchCategorie = categorie === 'all' || produitCategorie === categorie;
                const matchPrix = produitPrix <= prixMax;

                produit.style.display = (matchCategorie && matchPrix) ? 'block' : 'none';
            });
        }
// ===== SERVICE WORKER PWA =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Chemin relatif pour fonctionner partout
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('✅ SW enregistré:', registration.scope))
            .catch(error => console.log('❌ SW échec:', error));
    });
}
