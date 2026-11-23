/* XA IA — page Soutenir : WhatsApp, Bankily, Masrivi, partenaires, proposition de mots. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function h(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  var WA = String(window.XA_IA_WA || '22249037697'), NUM = String(window.XA_IA_WA_TXT || '+222 49037697');
  var EP = String(window.XA_IA_ENDPOINT || '').trim().replace(/\/+$/, '');
  function wa(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }

  $('wa-geste').href = wa('Salaamu aleykum, je voudrais faire un geste pour aider XA IA et la langue soninké. Pouvons-nous en discuter ?');
  $('wa-done').href = wa('Salaamu aleykum, j’ai envoyé mon geste pour XA IA. Merci à vous.');
  $('wa-dev').href = wa('Salaamu aleykum, je suis développeur ou développeuse et je voudrais contribuer à XA IA.');
  $('wa-bail').href = wa('Salaamu aleykum, je représente une organisation (bailleur ou partenaire) et je voudrais parler de XA IA.');
  $('wa-autre').href = wa('Salaamu aleykum, j’ai une proposition pour XA IA.');

  /* Applications de paiement : un panneau par application */
  Array.prototype.forEach.call(document.querySelectorAll('[data-pay]'), function (b) {
    b.addEventListener('click', function () {
      var d = $('d-' + b.dataset.pay), open = d.hidden;
      Array.prototype.forEach.call(document.querySelectorAll('.pay-detail'), function (x) { x.hidden = true; });
      Array.prototype.forEach.call(document.querySelectorAll('[data-pay]'), function (x) { x.setAttribute('aria-expanded', 'false'); });
      d.hidden = !open; b.setAttribute('aria-expanded', String(open));
      if (open) d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (b) {
    b.addEventListener('click', function () {
      var done = function () { var o = b.textContent; b.textContent = 'Numéro copié'; setTimeout(function () { b.textContent = o; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(NUM).then(done, function () {});
      else done();
    });
  });

  /* Proposition de mots */
  var form = $('contrib'), msg = $('f-msg'), sent = $('f-sent'), sendBtn = $('f-send');
  function receipt(son, fr, lead, fallbackLink) {
    sent.hidden = false; sent.textContent = '';
    sent.appendChild(h('p', '', lead));
    var q = h('p', ''); var b1 = h('b', '', son); q.appendChild(b1); q.appendChild(document.createTextNode(' = ' + fr)); sent.appendChild(q);
    if (fallbackLink) sent.appendChild(fallbackLink);
    sent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var son = $('f-son').value.trim(), fr = $('f-fr').value.trim(), note = $('f-note').value.trim(), by = $('f-by').value.trim();
    msg.textContent = '';
    if (son.length < 2 || fr.length < 2) { msg.textContent = 'Écris le mot en soninké et sa traduction en français.'; return; }
    if ($('f-hp').value) return;
    sendBtn.disabled = true; sendBtn.textContent = 'Envoi…';
    function viaWhatsApp() {
      var a = h('a', 'btn wa', 'Envoyer sur WhatsApp'); a.target = '_blank'; a.rel = 'noopener';
      a.href = wa('Salaamu aleykum, je propose un mot pour XA IA :\nSoninké : ' + son + '\nFrançais : ' + fr + (note ? '\nPrécision : ' + note : '') + (by ? '\nPrénom : ' + by : ''));
      receipt(son, fr, 'Ta proposition est prête. Touche le bouton pour nous l’envoyer sur WhatsApp, nous la validerons.', a);
    }
    function reset() { sendBtn.disabled = false; sendBtn.textContent = 'Envoyer ma proposition'; }
    if (!EP) { viaWhatsApp(); reset(); return; }
    fetch(EP + '/contribute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ son: son, fr: fr, note: note, by: by, hp: '' }) })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (x) {
        if (x.j && x.j.ok) {
          receipt(son, fr, x.j.status === 'known'
            ? 'Merci. XA IA connaît déjà ce mot, tu l’as bien écrit.'
            : 'Merci. Ta proposition est bien reçue. Elle sera relue puis validée avant que XA IA l’utilise.');
          form.reset();
        } else if (x.status === 400) { msg.textContent = 'Vérifie ta proposition : écris des lettres, sans lien ni adresse.'; }
        else if (x.status === 429) { msg.textContent = 'Tu as envoyé beaucoup de propositions. Réessaie dans quelques minutes.'; }
        else viaWhatsApp();
        reset();
      })
      .catch(function () { viaWhatsApp(); reset(); });
  });
})();
