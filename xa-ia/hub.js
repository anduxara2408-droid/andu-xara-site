/* XA IA — page d'accueil : bandes qui défilent, parole du jour. */
(function () {
  'use strict';
  function h(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function fill(track, pills) {
    pills.concat(pills).forEach(function (p, i) { var n = p.cloneNode(true); if (i >= pills.length) n.setAttribute('aria-hidden', 'true'); if (n.tagName === 'A' && i >= pills.length) n.tabIndex = -1; track.appendChild(n); });
  }
  XAData.ready.then(function (d) {
    var eng = d.engine, day = Math.floor(Date.now() / 86400000);
    // Dictionnaires : un par thème
    var dict = eng.cats().map(function (c) {
      var a = h('a', 'pill'); a.href = 'xa-ia-savoir.html#dico=' + c.id;
      a.appendChild(h('b', '', c.label)); a.appendChild(h('span', '', c.count + (c.count > 1 ? ' entrées' : ' entrée')));
      return a;
    });
    fill(document.getElementById('t-dico'), dict);
    // Cours préparés et linguistique
    var cours = [
      ['L’alphabet soninké', 'a b c d e f g h i j k l m n ñ ŋ o p q r s t u w x y'],
      ['Voyelles longues et brèves', 'aa, ee, ii, oo, uu'],
      ['Les pronoms', 'n, an, a, o, xa, i'],
      ['Le pluriel', 'lemine → leminu'],
      ['Poser des questions', 'Mani ni ? Ko ni ?'],
      ['Saluer toute la journée', 'Beeta · Xa lella · Xa sunka'],
      ['Compter jusqu’à 10 000', 'baane … wujunu tanmi'],
      ['La famille', 'faabe, saaxe, renme'],
      ['Le corps humain', 'yaaxe, kitte, ta'],
      ['Les jours et les mois', 'alahadi … sibiti']
    ].map(function (c) {
      var a = h('a', 'pill'); a.href = 'xa-ia-savoir.html#apprendre';
      a.appendChild(h('b', '', c[0])); a.appendChild(h('span', '', c[1])); return a;
    });
    fill(document.getElementById('t-cours'), cours);
    // Mots et phrases : sélection du jour dans la base
    var pool = d.corpus.entries.filter(function (e) { return e.cat !== 'communaute'; });
    var picks = [], i, step = 37;
    for (i = 0; i < 24; i++) picks.push(pool[(day * 11 + i * step) % pool.length]);
    var mots = picks.map(function (e) { var s = h('span', 'pill'); s.appendChild(h('b', '', e.son)); s.appendChild(h('span', '', e.fr)); return s; });
    fill(document.getElementById('t-mots'), mots);

    // Parole et mot du jour
    var q = d.quotes;
    function showQuote(x) {
      var box = document.getElementById('quote'); box.textContent = '';
      box.appendChild(h('span', 't', x.theme));
      x.lines.forEach(function (l) { box.appendChild(h('span', 's', l.son)); box.appendChild(h('span', 'f', l.fr)); });
      var acts = h('div', 'acts');
      var next = h('button', 'btn gold', 'Une autre parole'); next.type = 'button';
      next.addEventListener('click', function () { var k; do { k = Math.floor(Math.random() * q.length); } while (q.length > 1 && q[k] === x); showQuote(q[k]); });
      var line = x.lines.map(function (l) { return l.son + '\n' + l.fr; }).join('\n') + '\n(XA IA · andu-xara.com)';
      var cp = h('button', 'btn ghost', 'Copier'); cp.type = 'button';
      cp.addEventListener('click', function () { if (navigator.clipboard) navigator.clipboard.writeText(line).then(function () { cp.textContent = 'Copié'; setTimeout(function () { cp.textContent = 'Copier'; }, 1600); }, function () {}); });
      var wa = h('a', 'btn ghost', 'Partager'); wa.href = 'https://wa.me/?text=' + encodeURIComponent(line); wa.target = '_blank'; wa.rel = 'noopener';
      acts.appendChild(next); acts.appendChild(cp); acts.appendChild(wa); box.appendChild(acts);
    }
    if (q.length) showQuote(q[day % q.length]);
    var words = ['famille', 'lieux', 'objets', 'nourriture', 'jours', 'corps'].reduce(function (a, c) { return a.concat(eng.byCat(c)); }, []);
    var w = words[(day * 7) % words.length], box = document.getElementById('word');
    if (w) { box.textContent = ''; box.appendChild(h('div', 't', 'Mot du jour')); box.appendChild(h('div', 's', w.son)); box.appendChild(h('div', 'f', w.fr)); }
  }).catch(function () {});
})();
