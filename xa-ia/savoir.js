/* XA IA — dictionnaire, apprentissage et traduction (base locale vérifiée). */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function h(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  var eng, all = [], PAGE = 60, shown = PAGE, current = [];

  function entryNode(it) {
    var d = h('div', 'entry');
    d.appendChild(h('div', 'son', it.son));
    if (it.ton && it.ton !== it.son) d.appendChild(h('div', 'ton', it.ton));
    d.appendChild(h('div', 'fr', it.fr));
    if (it.audio) { var au = h('audio'); au.controls = true; au.preload = 'none'; au.src = it.audio; au.setAttribute('aria-label', 'Écouter ' + it.son); d.appendChild(au); }
    return d;
  }
  function nS(s) { return eng.norm(s).replace(/q/g, 'x'); }
  function askLink(text) {
    var a = h('a', 'btn gold', 'Demander à XA IA'); a.href = 'xa-ia-chat.html?q=' + encodeURIComponent(text); return a;
  }

  /* ----- Onglets ----- */
  var TABS = ['dico', 'apprendre', 'traduire'], tab = 'dico';
  function parseHash() {
    var m = (location.hash || '').replace('#', '').split('=');
    return { tab: TABS.indexOf(m[0]) >= 0 ? m[0] : 'dico', arg: m[1] || '' };
  }
  function showTab(t) {
    tab = t;
    TABS.forEach(function (x) {
      var on = x === t; $('tab-' + x).setAttribute('aria-selected', String(on)); $('p-' + x).hidden = !on;
    });
    Array.prototype.forEach.call(document.querySelectorAll('#xa-nav a'), function (a) {
      var m = (a.getAttribute('href') || '').match(/xa-ia-savoir\.html#(\w+)/);
      if (m) { if (m[1] === t) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }
    });
  }
  TABS.forEach(function (x) { $('tab-' + x).addEventListener('click', function () { history.replaceState(null, '', '#' + x); showTab(x); }); });

  /* ----- Dictionnaire ----- */
  function filter() {
    var q = $('q').value.trim(), cat = $('cat').value, nq = eng.norm(q), nqs = nS(q);
    var rows = all.filter(function (it) { return cat === 'all' || it.cat === cat; });
    if (nq) {
      rows = rows.filter(function (it) {
        return it._s.indexOf(nqs) >= 0 || it._f.indexOf(nq) >= 0;
      });
      rows.sort(function (a, b) {
        function sc(it) { return (it._sn === nqs || it._fn === nq) ? 0 : (it._sn.indexOf(nqs) === 0 || it._fn.indexOf(nq) === 0) ? 1 : 2; }
        return sc(a) - sc(b);
      });
    }
    current = rows; shown = PAGE; paint();
    var ask = $('ask');
    if (q && !rows.length) {
      ask.hidden = false; ask.textContent = 'Ce mot n’est pas encore dans le dictionnaire, mais XA IA peut te répondre. ';
      ask.appendChild(askLink('Comment dit-on « ' + q + ' » en soninké ?'));
    } else ask.hidden = true;
  }
  function paint() {
    var box = $('dict'); box.textContent = '';
    current.slice(0, shown).forEach(function (it) { box.appendChild(entryNode(it)); });
    $('count').textContent = current.length + (current.length > 1 ? ' entrées' : ' entrée');
    $('more').hidden = shown >= current.length;
  }
  $('more').addEventListener('click', function () { shown += PAGE; paint(); });
  $('q').addEventListener('input', filter);
  $('cat').addEventListener('change', filter);

  /* ----- Apprentissage ----- */
  var cardItem = null, flipped = false;
  function newCard() {
    var pool = all.filter(function (it) { return it.cat !== 'communaute' && it.cat !== 'phrases_cnrs'; });
    var it = pool[Math.floor(Math.random() * pool.length)];
    cardItem = it; flipped = false; drawCard();
  }
  function drawCard() {
    var c = $('card'); c.textContent = '';
    c.appendChild(h('div', 's', flipped ? cardItem.fr : cardItem.son));
    if (flipped) c.appendChild(h('div', 'f', cardItem.son));
    $('flip').textContent = flipped ? 'Masquer la réponse' : 'Voir la réponse';
  }
  $('flip').addEventListener('click', function () { flipped = !flipped; drawCard(); });
  $('nextc').addEventListener('click', newCard);

  function newQuiz() {
    var q = eng.quiz(), box = $('quizbox'); box.textContent = '';
    var c = h('div', 'cardf'); c.appendChild(h('div', 'f', q.prompt));
    var opts = h('div', 'opts'), locked = false, btns = [];
    q.options.forEach(function (o) {
      var b = h('button', 'opt', o.label); b.type = 'button';
      b.addEventListener('click', function () {
        if (locked) return; locked = true;
        btns.forEach(function (x) { x.b.disabled = true; if (x.o.correct) x.b.classList.add('ok'); });
        if (!o.correct) b.classList.add('no');
        var msg = h('p', '', o.correct ? 'Bravo, c’est ça.' : 'Pas tout à fait. La bonne réponse :'); c.appendChild(msg);
        if (q.answer) c.appendChild(entryNode(q.answer));
      });
      btns.push({ b: b, o: o }); opts.appendChild(b);
    });
    c.appendChild(opts); box.appendChild(c);
    var row = h('div', 'row'); var nx = h('button', 'btn line', 'Autre question'); nx.type = 'button'; nx.addEventListener('click', newQuiz); row.appendChild(nx); box.appendChild(row);
  }

  function listCourse(items) {
    var ul = h('ul');
    items.forEach(function (it) { var li = h('li'); li.appendChild(h('span', 's', it.son)); li.appendChild(h('span', 'f', it.fr)); ul.appendChild(li); });
    return ul;
  }
  function course(title, count, buildBody, open) {
    var d = h('details'); if (open) d.open = true;
    var s = h('summary'); s.appendChild(h('b', '', title)); if (count) s.appendChild(h('span', '', count)); d.appendChild(s);
    var b = h('div', 'lesson-body'); buildBody(b); d.appendChild(b); return d;
  }
  function find(cat, sons) {
    var set = sons.map(nS);
    return eng.byCat(cat).filter(function (it) { return set.indexOf(nS(it.son)) >= 0; });
  }
  function buildLing() {
    var box = $('ling');
    box.appendChild(course('L’alphabet soninké', '27 lettres', function (b) {
      var a = h('div', 'alpha'); 'a b c d e f g h i j k l m n ñ ŋ o p q r s t u w x y'.split(' ').forEach(function (l) { a.appendChild(h('span', '', l)); }); b.appendChild(a);
      [['Voyelles longues', 'Une voyelle longue s’écrit doublée : aa, ee, ii, oo, uu. La longueur change le sens du mot. Exemples : faabe (père), saaxe (mère), maaro (riz).'],
       ['Consonnes doublées', 'Certaines consonnes se doublent : bb, cc, dd, gg, jj, kk, ll, pp, tt. Exemples : kitte (main), fillo (deux), sikko (trois).'],
       ['q et x', 'Le même son s’écrit q dans l’est et x dans l’ouest : xaso et qaso (la lune) sont le même mot. XA IA les reconnaît tous les deux.']].forEach(function (r) {
        var n = h('div', 'note-box'); var t = h('b', '', r[0] + ' : '); n.appendChild(t); n.appendChild(document.createTextNode(r[1])); b.appendChild(n);
      });
    }, true));
    box.appendChild(course('Les pronoms et « mon, ton, son »', '6 pronoms', function (b) {
      b.appendChild(listCourse(eng.byCat('pronoms').filter(function (it) { return it.kind === 'mot' || it.fr.length < 40; }).slice(0, 14)));
    }));
    box.appendChild(course('Le pluriel', 'exemples', function (b) {
      b.appendChild(h('p', 'lead-in', 'Le pluriel se marque souvent en changeant la voyelle finale.'));
      var pairs = find('famille', ['Yaxare', 'Yaxaru', 'Yugo', 'Yugu', 'Xuso', 'Xusu', 'Murunte', 'Murunto', 'Lemine', 'Leminu']);
      b.appendChild(listCourse(pairs));
    }));
    box.appendChild(course('Poser des questions', 'questions', function (b) { b.appendChild(listCourse(eng.byCat('questions'))); }));
    box.appendChild(course('Compter jusqu’à 10 000', 'nombres', function (b) { b.appendChild(listCourse(eng.byCat('nombres'))); }));
  }
  function buildThemes() {
    var box = $('themes');
    eng.cats().forEach(function (c) {
      box.appendChild(course(c.label, c.count + (c.count > 1 ? ' entrées' : ' entrée'), function (b) {
        b.appendChild(listCourse(eng.byCat(c.id).slice(0, 40)));
        if (c.count > 40) { var a = h('a', 'btn line', 'Tout voir dans le dictionnaire'); a.href = 'xa-ia-savoir.html#dico=' + c.id; a.addEventListener('click', function () { setTimeout(route, 0); }); b.appendChild(a); }
      }));
    });
  }

  /* ----- Traduction ----- */
  $('go').addEventListener('click', function () {
    var out = $('tout'); out.textContent = '';
    var lines = $('tin').value.split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean).slice(0, 12);
    if (!lines.length) { out.appendChild(h('p', 'count', 'Écris un mot ou une phrase, puis touche Traduire.')); return; }
    lines.forEach(function (ln) {
      var res = eng.search(ln.replace(/\s*\?+$/, '')).filter(function (r) { return !r.fuzzy; });
      var box = h('div'); box.appendChild(h('p', 'count', ln));
      if (res.length) res.slice(0, 3).forEach(function (it) { box.appendChild(entryNode(it)); });
      else { box.appendChild(h('p', '', 'XA IA peut traduire cette phrase pour toi.')); box.appendChild(askLink('Traduis en soninké ou en français : ' + ln)); }
      out.appendChild(box);
    });
  });

  /* ----- Démarrage ----- */
  function route() {
    var r = parseHash(); showTab(r.tab);
    if (r.tab === 'dico' && r.arg && Array.prototype.some.call($('cat').options, function (o) { return o.value === r.arg; })) { $('cat').value = r.arg; filter(); }
  }
  window.addEventListener('hashchange', route);
  XAData.ready.then(function (d) {
    eng = d.engine;
    eng.cats().forEach(function () {});
    var sel = $('cat'); var o = h('option', '', 'Tous les thèmes'); o.value = 'all'; sel.appendChild(o);
    eng.cats().forEach(function (c) { var op = h('option', '', c.label + ' (' + c.count + ')'); op.value = c.id; sel.appendChild(op); });
    all = [];
    eng.cats().forEach(function (c) { eng.byCat(c.id).forEach(function (it) { all.push(it); }); });
    all.forEach(function (it) { it._s = nS(it.son); it._sn = it._s; it._f = eng.norm(it.fr); it._fn = it._f; });
    filter(); newCard(); newQuiz(); buildLing(); buildThemes(); route();
  }).catch(function () { $('count').textContent = 'Le dictionnaire ne se charge pas. Vérifie ta connexion puis recharge la page.'; });
  showTab(parseHash().tab);
})();
