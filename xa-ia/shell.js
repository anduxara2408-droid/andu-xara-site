/* XA IA — en-tête, pied de page et bouton WhatsApp communs à toutes les pages de l'espace. */
(function () {
  'use strict';
  var WA = window.XA_IA_WA || '22249037697', WAT = window.XA_IA_WA_TXT || '+222 49037697';
  var page = document.body.getAttribute('data-page') || '';
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  var ic = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200Zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.100-.7.300-.2.300-.9.900-.9 2.200s.9 2.500 1.100 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.7 3.100.6.500-.1 1.500-.6 1.700-1.200.2-.6.2-1.100.2-1.200-.1-.1-.2-.2-.5-.3Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.600 3c.3 2.200 1.600 3.700 3.900 3.900v3a7 7 0 0 1-3.800-1.200v6.100a5.800 5.800 0 1 1-5-5.800v3.100a2.800 2.800 0 1 0 2 2.700V3h2.900Z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.500 21v-7.500h2.600l.4-3h-3V8.600c0-.9.300-1.500 1.500-1.500h1.600V4.400c-.3 0-1.200-.1-2.300-.1-2.300 0-3.800 1.400-3.800 3.900v2.300H8v3h2.500V21h3Z"/></svg>'
  };
  var links = [
    ['hub', 'xa-ia-hub.html', 'Mon espace'],
    ['chat', 'xa-ia-chat.html', 'Assistant'],
    ['dico', 'xa-ia-savoir.html#dico', 'Dictionnaire'],
    ['apprendre', 'xa-ia-savoir.html#apprendre', 'Apprentissage'],
    ['traduire', 'xa-ia-savoir.html#traduire', 'Traduction']
  ];
  var top = el('header', 'top');
  var nav = '<nav id="xa-nav" aria-label="Navigation">' + links.map(function (l) {
    return '<a href="' + l[1] + '"' + (page === l[0] ? ' aria-current="page"' : '') + '>' + l[2] + '</a>';
  }).join('') + '<a class="give" href="xa-ia-soutenir.html"' + (page === 'soutenir' ? ' aria-current="page"' : '') + '>Soutenir</a><a class="home" href="index.html">Andu-Xara</a></nav>';
  top.innerHTML = '<div class="wrap"><a class="brand" href="xa-ia-hub.html" aria-label="XA IA, accueil"><img src="xa-ia/img/xa-ia-visage.jpg" width="34" height="34" alt=""><b>XA<i>·</i>IA</b></a>' + nav +
    '<button type="button" class="menu-btn" id="xa-menu" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="xa-nav">' + ic.menu + '</button></div>';
  var slot = document.getElementById('xa-top');
  if (slot) slot.replaceWith(top); else document.body.insertBefore(top, document.body.firstChild);
  var btn = top.querySelector('#xa-menu'), nv = top.querySelector('#xa-nav');
  btn.addEventListener('click', function () { var o = !nv.classList.contains('open'); nv.classList.toggle('open', o); btn.setAttribute('aria-expanded', String(o)); });
  nv.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nv.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });

  var fslot = document.getElementById('xa-foot');
  if (fslot) {
    var f = el('footer', 'deep pattern');
    f.innerHTML = '<div class="wrap">' +
      '<div><div class="fb"><img src="xa-ia/img/xa-ia-visage.jpg" width="48" height="48" alt=""><b>XA·IA</b></div>' +
      '<p>L’intelligence artificielle d’Andu-Xara pour parler, écrire et enseigner le soninké.</p>' +
      '<p class="quote">Salaamu aleykum.<i>Que la paix soit sur toi.</i></p>' +
      '<div class="soc"><a href="https://wa.me/' + WA + '" aria-label="WhatsApp" target="_blank" rel="noopener">' + ic.wa + '</a>' +
      '<a href="https://instagram.com/andu_xara" aria-label="Instagram" target="_blank" rel="noopener">' + ic.ig + '</a>' +
      '<a href="https://tiktok.com/@andu_xara" aria-label="TikTok" target="_blank" rel="noopener">' + ic.tt + '</a>' +
      '<a href="https://facebook.com/anduxara" aria-label="Facebook" target="_blank" rel="noopener">' + ic.fb + '</a></div></div>' +
      '<div><h4>Explorer</h4><ul><li><a href="xa-ia-chat.html">Parler à XA IA</a></li><li><a href="xa-ia-savoir.html#dico">Dictionnaire</a></li><li><a href="xa-ia-savoir.html#apprendre">Apprentissage</a></li><li><a href="xa-ia-savoir.html#traduire">Traduction</a></li><li><a href="xa-ia-soutenir.html#mots">Proposer un mot</a></li><li><a class="give-link" href="xa-ia-soutenir.html">Soutenir XA IA</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul><li>Cheikhou Diabira, fondateur</li><li>Andu-Xara · Nouakchott, Mauritanie</li><li><a href="https://wa.me/' + WA + '" target="_blank" rel="noopener">WhatsApp ' + WAT + '</a></li><li><a href="index.html">andu-xara.com</a></li></ul></div>' +
      '<div class="legal">© 2026 Andu-Xara. XA IA peut faire des erreurs : pour une phrase importante, vérifie-la avec un locuteur.</div></div>';
    fslot.replaceWith(f);
  }
  if (page !== 'chat' && page !== 'admin') {
    var w = el('a', 'wa-float', ic.wa); w.href = 'https://wa.me/' + WA; w.target = '_blank'; w.rel = 'noopener'; w.setAttribute('aria-label', 'Écrire sur WhatsApp');
    document.body.appendChild(w);
  }
})();
