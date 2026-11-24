/* XA IA — moteur de conversation soninké (sans serveur).
 *
 * Règle d'or : ce moteur n'écrit du soninké que s'il vient du corpus (corpus.json).
 * Si un mot ou une phrase n'y est pas, il le dit au lieu de l'inventer.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.XAEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STOP = new Set(('comment dit dis on en soninke soninkes francais traduis traduire traduction moi que qui quoi ' +
    'veut dire signifie signifier ca c est quel quelle mot mots phrase pour le la les l un une des du de d s il te ' +
    'vous plait ce se t je tu me m ne pas ou et a au aux').split(' '));

  // Mots-clés de thèmes → identifiant de catégorie
  var CAT_KEYS = {
    'nombres': 'nombres', 'chiffres': 'nombres', 'compter': 'nombres',
    'jours': 'jours', 'semaine': 'jours',
    'salutations': 'salutations', 'saluer': 'salutations',
    'lieux': 'lieux', 'objets': 'objets', 'pronoms': 'pronoms',
    'nourriture': 'nourriture', 'boissons': 'nourriture',
    'corps': 'corps', 'nature': 'nature', 'animaux': 'nature',
    'au revoir': 'adieux', 'adieux': 'adieux',
    'se presenter': 'presentation', 'presentation': 'presentation',
    'expressions': 'expressions', 'phrases utiles': 'expressions',
    'famille': 'famille', 'moments': 'moments', 'mois': 'mois', 'questions': 'questions', 'poser des questions': 'questions'
  };

  function norm(s) {
    s = String(s == null ? '' : s).toLowerCase()
      .replace(/[’‘ʼ`´]/g, "'")
      .replace(/œ/g, 'oe').replace(/[ŋɲ]/g, 'n');
    s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return s.replace(/[^a-z0-9]+/g, ' ').trim();
  }
  // Soninké : q (est) et x (ouest) sont deux écritures du même son
  function normS(s) { return norm(s).replace(/q/g, 'x'); }
  function tokens(s) { var n = norm(s); return n ? n.split(' ') : []; }
  function coreTokens(s) {
    var t = tokens(s), k = t.filter(function (w) { return !STOP.has(w); });
    return k.length ? k : t;
  }
  function stripParens(s) { return String(s).replace(/\([^)]*\)/g, ' '); }

  // vrai si la distance d'édition est ≤ 1
  function lev1(a, b) {
    if (a === b) return true;
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    var i = 0, j = 0, edits = 0;
    while (i < la && j < lb) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
    }
    return edits + (la - i) + (lb - j) <= 1;
  }

  function subset(a, b) { // tous les éléments de a sont dans b
    for (var i = 0; i < a.length; i++) if (b.indexOf(a[i]) < 0) return false;
    return a.length > 0;
  }

  function create(corpus) {
    var srcInfo = corpus.sources || {};
    var catLabels = corpus.categories || {};
    var idx = corpus.entries.map(function (e) {
      var alts = stripParens(e.fr).split(/\s\/\s|,/).map(function (a) {
        var b = a.replace(/^\s*(un|une|des|le|la|les|l'|du|de la)\s+/i, '');
        return b.trim() ? b : a;
      });
      return {
        e: e,
        sonN: normS(e.son),
        sonT: normS(e.son) ? normS(e.son).split(' ') : [],
        alts: alts.map(function (a) { return coreTokens(a); }).filter(function (t) { return t.length; }),
        frKey: norm((function (f) { var b = f.replace(/^\s*(un|une|des|le|la|les|l'|du|de la)\s+/i, ''); return b.trim() ? b : f; })(stripParens(e.fr)))
      };
    });

    function mergeItems(list) { // fusionne les entrées identiques de sources différentes
      var map = {}, out = [];
      list.forEach(function (r) {
        var key = r.x.sonN + '|' + r.x.frKey;
        var m = map[key];
        if (!m) {
          m = map[key] = { son: r.x.e.son, fr: r.x.e.fr, cat: r.x.e.cat, kind: r.x.e.kind,
                           srcs: [], ton: null, ids: [], score: r.score, dir: r.dir, fuzzy: !!r.fuzzy };
          out.push(m);
        }
        if (m.srcs.indexOf(r.x.e.src) < 0) m.srcs.push(r.x.e.src);
        if (r.x.e.ton && !m.ton) m.ton = r.x.e.ton;
        if (r.x.e.src === 'pdot') { m.son = r.x.e.son; m.fr = r.x.e.fr; } // forme de référence
        m.ids.push(r.x.e.id);
        if (!r.fuzzy) m.fuzzy = false;
        if (r.score > m.score) m.score = r.score;
      });
      return out;
    }

    function findSon(q) { // soninké → français
      var qn = normS(q), qt = qn ? qn.split(' ') : [], res = [];
      if (!qn || qn.length < 2) return res;
      idx.forEach(function (x) {
        var s = 0, fz = false;
        if (x.sonN === qn) s = 100;
        else if (qt.length && qt.every(function (w) { return w.length >= 2; }) && subset(qt, x.sonT) && x.sonT.length <= qt.length + 2) s = 72 - 4 * (x.sonT.length - qt.length);
        else if (qt.length === 1 && qn.length >= 5 && x.sonT.length === 1 && lev1(qn, x.sonN)) { s = 62; fz = true; }
        else if (qn.length >= 9 && lev1(qn.replace(/ /g, ''), x.sonN.replace(/ /g, ''))) { s = 60; fz = true; }
        if (s >= 60) res.push({ x: x, score: s, dir: 'son2fr', fuzzy: fz });
      });
      return res;
    }

    function findFr(q) { // français → soninké
      var qt = coreTokens(q), res = [];
      if (!qt.length) return res;
      var qKey = qt.join(' ');
      idx.forEach(function (x) {
        var best = 0;
        x.alts.forEach(function (a) {
          var s = 0;
          if (a.join(' ') === qKey) s = 100;
          else if (subset(qt, a) && qt.join('').length >= 3) s = 85 - 5 * (a.length - qt.length);
          else if (a.length >= 2 && subset(a, qt)) s = 66;
          else {
            var common = a.filter(function (w) { return qt.indexOf(w) >= 0; }).length;
            var jac = common / (a.length + qt.length - common);
            if (common >= 2 && jac >= 0.6) s = 55 + 20 * jac;
          }
          if (s > best) best = s;
        });
        if (best >= 60) res.push({ x: x, score: best, dir: 'fr2son' });
      });
      return res;
    }

    function search(q) {
      var all = findSon(q).concat(findFr(q));
      all.sort(function (a, b) { return b.score - a.score || a.x.sonT.length - b.x.sonT.length; });
      var items = mergeItems(all);
      items.sort(function (a, b) { return b.score - a.score; });
      if (items.length && items[0].score >= 100) { // correspondance exacte : on écarte le bruit
        items = items.filter(function (it) { return it.score >= 85; });
      }
      return items.slice(0, 6);
    }

    function byCat(cat) {
      var rows = idx.filter(function (x) { return x.e.cat === cat; }).map(function (x) { return { x: x, score: 100, dir: 'browse' }; });
      return mergeItems(rows);
    }

    function pick(sonNorm) { // entrée fusionnée par son soninké exact
      var rows = idx.filter(function (x) { return x.sonN === normS(sonNorm); }).map(function (x) { return { x: x, score: 100, dir: 'reply' }; });
      var m = mergeItems(rows);
      return m.length ? m[0] : null;
    }

    function byIds(ids) {
      var set = {}; (ids || []).forEach(function (i) { set[i] = 1; });
      var rows = idx.filter(function (x) { return set[x.e.id]; }).map(function (x) { return { x: x, score: 100, dir: 'reply' }; });
      return mergeItems(rows);
    }

    function cats() {
      var counts = {};
      corpus.entries.forEach(function (e) { counts[e.cat] = (counts[e.cat] || 0) + 1; });
      return Object.keys(catLabels).map(function (id) { return { id: id, label: catLabels[id], count: counts[id] || 0 }; })
        .filter(function (c) { return c.count > 0; });
    }

    function daily(date, rnd) {
      date = date || new Date();
      var day = Math.floor(date.getTime() / 86400000);
      var phrases = corpus.entries.filter(function (e) { return e.src === 'pdot' && e.kind === 'phrase' && (e.cat === 'salutations' || e.cat === 'adieux'); });
      var words = corpus.entries.filter(function (e) { return e.src === 'pdot' && e.kind === 'mot' && e.cat !== 'nombres' && e.cat !== 'pronoms'; });
      function get(list, off) { var e = list[(day + off) % list.length]; return pick(e.son) || null; }
      return { phrase: get(phrases, 0), word: get(words, 3) };
    }

    function quiz(rnd) {
      rnd = rnd || Math.random;
      var pool = corpus.entries.filter(function (e) { return e.src === 'pdot' && e.kind === 'mot' && ['nombres', 'pronoms', 'moments'].indexOf(e.cat) < 0; });
      var q = pool[Math.floor(rnd() * pool.length)];
      var same = pool.filter(function (e) { return e.cat === q.cat && norm(e.son) !== norm(q.son) && norm(e.fr) !== norm(q.fr); });
      var others = same.length >= 3 ? same : pool.filter(function (e) { return norm(e.son) !== norm(q.son) && norm(e.fr) !== norm(q.fr); });
      var d = [];
      while (d.length < 3 && others.length) {
        var i = Math.floor(rnd() * others.length), c = others.splice(i, 1)[0];
        if (!d.some(function (z) { return norm(z.son) === norm(c.son) || norm(z.fr) === norm(c.fr); })) d.push(c);
      }
      var toSon = rnd() < 0.5;
      var opts = d.concat([q]).map(function (e) { return { label: toSon ? e.son : e.fr, correct: e === q }; });
      for (var k = opts.length - 1; k > 0; k--) { var j = Math.floor(rnd() * (k + 1)); var t = opts[k]; opts[k] = opts[j]; opts[j] = t; }
      return {
        prompt: toSon ? 'Comment dit-on « ' + q.fr + ' » en soninké ?' : 'Que veut dire « ' + q.son + ' » en français ?',
        options: opts,
        answer: pick(q.son)
      };
    }

    var DIALOGUES = { // échanges documentés dans les leçons P.DOT
      'salaamu aleykum': ['Aleykum salaam'],
      'an moxo': ['Ma jam', 'Ka-dunko n moxo?'],
      'ka dunko n moxo': ['I wa jam'],
      'golle n moxo': ['Jam duuro'],
      'leminu n moxo': ['I wa jam'],
      'xori an wa jam': ['Jam baane']
    };

    function reply(text, ctx) {
      ctx = ctx || {};
      var raw = String(text || '').trim();
      var qn = norm(raw), qt = tokens(raw);
      var hour = typeof ctx.hour === 'number' ? ctx.hour : 9;

      if (!qn) return { type: 'help', text: helpText(), items: [], chips: defaultChips() };

      // Merci
      if (/^(merci|merci beaucoup|un grand merci|je te remercie)$/.test(qn)) {
        var its = [pick('Nawaari'), pick('Anba'), pick('Yawuri')].filter(Boolean);
        return { type: 'thanks', text: 'Avec plaisir. En soninké, on dit :', items: its, chips: defaultChips() };
      }
      // Salutations en français
      if (/^(bonjour|bonsoir|salut|salam|coucou|hello|hey|bonne journee)( .*)?$/.test(qn) && qt.length <= 4) {
        var g = hour < 12 ? 'An wuyi jam' : hour < 18 ? 'Lella' : 'Sunka';
        var a = pick('Salaamu aleykum'), b = pick(g), c = pick('An moxo?');
        return { type: 'greeting', text: 'Salaamu aleykum ! Voici comment saluer, selon l’heure de la journée :',
                 items: [a, b, c].filter(Boolean), chips: ['Ma jam', 'Apprendre les salutations', 'Faire un quiz'] };
      }
      // Qui es-tu / aide
      if (/^(qui es tu|tu es qui|que sais tu faire|que peux tu faire|aide|aide moi|help|comment ca marche|a quoi tu sers)$/.test(qn)) {
        return { type: 'help', text: helpText(), items: [], chips: defaultChips() };
      }
      // Quiz
      if (/(^| )(quiz|quizz|jouer|teste moi|tester|questionne moi)( |$)/.test(qn)) {
        return { type: 'quiz', text: 'Voyons ce que tu retiens. Choisis la bonne réponse :', quiz: quiz(ctx.rnd), items: [], chips: [] };
      }
      // Chiffres
      var dm = qn.match(/^(?:(?:comment dit on|en soninke|traduis)\s*)?(\d{1,2})(?:\s*en soninke)?$/);
      if (dm) {
        var n = parseInt(dm[1], 10), found = null;
        corpus.entries.forEach(function (e) { if (e.cat === 'nombres' && e.fr.indexOf('(' + n + ')') > 0) found = e; });
        if (found) return { type: 'number', text: n + ' se dit :', items: [pick(found.son)], chips: ['Apprendre les nombres'] };
        return converse(raw, ctx);
      }
      // Thèmes
      var wantsList = /(apprendre|apprends|lecon|liste|vocabulaire|montre|affiche|theme|categorie|voir)/.test(qn);
      var catKey = null;
      Object.keys(CAT_KEYS).forEach(function (k) {
        var kn = norm(k), padded = ' ' + qn + ' ';
        var hit = qn === kn
          || (wantsList && padded.indexOf(' ' + kn + ' ') >= 0)
          || (kn.length > 4 && padded.indexOf(' les ' + kn + ' ') >= 0);
        if (hit) catKey = CAT_KEYS[k];
      });
      if (catKey && qn !== 'famille') {
        var items = byCat(catKey);
        return { type: 'category', cat: catKey, text: 'Thème « ' + (catLabels[catKey] || catKey) + ' » (' + items.length + ') :', items: items, chips: otherChips(catKey) };
      }
      // Réponses à des salutations en soninké (échanges documentés)
      if (DIALOGUES[qn]) {
        var rs = DIALOGUES[qn].map(pick).filter(Boolean);
        var me = pick(raw);
        return { type: 'dialogue', text: 'Voici la suite de l’échange, comme dans les leçons :',
                 items: (me ? [me] : []).concat(rs), chips: ['Salutations', 'Faire un quiz'] };
      }

      // Recherche (dans les deux sens)
      var q = raw;
      var rawN = raw.replace(/-/g, ' ');
      var m = rawN.match(/^(?:comment (?:dit|dis|se dit)(?: on| t on)?|comment on dit|traduis(?: moi)?|traduire|traduction (?:de|du|d['’]\s*)?|que (?:veut|signifie)(?: dire)?|que signifie|c['’]est quoi|quel est le mot pour|dis moi)\s+(.+?)(?:\s+en soninke)?\s*\??$/i);
      if (m) q = m[1];
      else {
        var m2 = rawN.match(/^(.+?)\s+en\s+soninke\s*\??$/i);
        if (m2) q = m2[1];
      }
      q = q.replace(/^[«"']+|[»"']+$/g, '');
      var res = search(q);
      if (res.length && res.every(function (r) { return r.fuzzy; })) {
        var shown0 = q.trim().replace(/\s*\?+$/, '');
        return { type: 'suggest', query: shown0,
                 text: 'Voici des mots soninké proches de ce que tu écris :',
                 items: res, chips: defaultChips() };
      }
      if (res.length) {
        res = res.filter(function (r) { return !r.fuzzy; });
        var lead = res[0].dir === 'son2fr' ? '« ' + q.trim() + ' » en soninké signifie :' : 'En soninké :';
        if (res.some(function (r) { return r.dir === 'son2fr'; }) && res.some(function (r) { return r.dir === 'fr2son'; })) lead = 'Voici ce que j’ai trouvé :';
        var ch = [];
        if (res[0].cat && res[0].cat !== 'phrases_cnrs') ch.push('Apprendre : ' + (catLabels[res[0].cat] || res[0].cat));
        ch.push('Faire un quiz');
        return { type: 'result', text: lead, items: res, chips: ch };
      }
      return converse(q.trim(), ctx);
    }

    // Aucune correspondance : XA IA continue la conversation en soninké (phrases vérifiées).
    var STARTERS = ['Xori an wa jam', 'An moxo', 'Leminu n moxo', 'Ka-dunko n moxo', 'Golle n moxo', 'An wa Soninke n mukku', 'An toxo', 'An wa telle minna', 'Saxan na minna', 'Mani ni', 'Kaadunkon moxo', 'An faaba do an ma xa', 'An faten moxo', 'Xori toora ma wuyi'];
    function converse(q, ctx) {
      var h = 0, k = norm(q);
      for (var i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) % 9973;
      var n = (ctx && typeof ctx.n === 'number') ? ctx.n : 0, it = null, tries = 0;
      while (!it && tries < STARTERS.length) { it = pick(STARTERS[(h + n + tries) % STARTERS.length]); tries++; }
      if (!it) it = pick('An moxo');
      var intro = ctx && ctx.first === false ? 'Continuons en soninké :' :
        'Je suis XA IA, une IA conçue pour parler et enseigner le soninké. Je peux faire des erreurs. Continuons en soninké :';
      return { type: 'converse', query: q, text: intro, items: it ? [it] : [], chips: defaultChips() };
    }

    function otherChips(not) {
      var all = ['salutations', 'nombres', 'famille', 'jours', 'lieux', 'adieux'].filter(function (c) { return c !== not; });
      return all.slice(0, 3).map(function (c) { return 'Apprendre : ' + (catLabels[c] || c); }).concat(['Faire un quiz']);
    }
    function defaultChips() { return ['Salutations', 'Les nombres', 'Comment dit-on « eau » ?', 'Faire un quiz']; }
    function helpText() {
      return 'Je suis XA IA, l’assistant d’Andu-Xara pour le soninké. Je traduis des mots et des phrases dans les deux sens, je te fais apprendre par thèmes (salutations, nombres, famille, jours…) et je te pose des quiz.';
    }

    return { reply: reply, search: search, byIds: byIds, byCat: byCat, cats: cats, daily: daily, quiz: quiz, pick: pick, norm: norm, srcInfo: srcInfo, catLabels: catLabels };
  }

  return { create: create, norm: norm };
});
