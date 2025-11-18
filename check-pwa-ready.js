// check-pwa-ready.js - Vérificateur PWA
console.log('🔍 VÉRIFICATION PWA ANDU-XARA');

// Vérifier le manifeste
fetch('/manifest.json')
  .then(response => response.json())
  .then(manifest => {
    console.log('✅ Manifeste chargé:', manifest.name);
    console.log('📱 Display:', manifest.display);
    console.log('🎨 Theme color:', manifest.theme_color);
  })
  .catch(error => {
    console.error('❌ Manifeste non accessible:', error);
  });

// Vérifier le service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration()
    .then(registration => {
      if (registration) {
        console.log('✅ Service Worker enregistré');
        console.log('🔧 Scope:', registration.scope);
      } else {
        console.log('❌ Service Worker non enregistré');
      }
    });
} else {
  console.log('❌ Service Worker non supporté');
}

// Vérifier l'installation PWA
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📲 Installation PWA disponible');
});

// Vérifier le mode standalone
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('📱 Application installée (standalone)');
}


console.log('🌐 URL actuelle:', window.location.href);
