/* XA IA — chargement des données : base de soninké, citations et mots validés par la communauté. */
(function () {
  'use strict';
  var ENDPOINT = String(window.XA_IA_ENDPOINT || '').trim().replace(/\/+$/, '');
  function jget(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url); return r.json(); }); }
  function timeout(ms, p) {
    return new Promise(function (ok, ko) { var t = setTimeout(function () { ko(new Error('timeout')); }, ms); p.then(function (v) { clearTimeout(t); ok(v); }, function (e) { clearTimeout(t); ko(e); }); });
  }
  var ready = Promise.all([
    jget('xa-ia/corpus.json'),
    jget('xa-ia/citations.json').catch(function () { return { quotes: [] }; }),
    ENDPOINT ? timeout(4000, jget(ENDPOINT + '/approved')).catch(function () { return { items: [] }; }) : Promise.resolve({ items: [] })
  ]).then(function (r) {
    var corpus = r[0], extra = (r[2] && r[2].items) || [];
    extra.slice(0, 2000).forEach(function (it, i) {
      if (!it || !it.son || !it.fr) return;
      corpus.entries.push({ id: 'com-' + i, son: String(it.son), fr: String(it.fr), cat: 'communaute', kind: /\s/.test(String(it.son).trim()) ? 'phrase' : 'mot', src: 'com' });
    });
    if (extra.length) corpus.categories.communaute = 'Ajoutés par la communauté';
    return { corpus: corpus, quotes: r[1].quotes || [], engine: XAEngine.create(corpus), endpoint: ENDPOINT };
  });
  window.XAData = { ready: ready, endpoint: ENDPOINT };
})();
