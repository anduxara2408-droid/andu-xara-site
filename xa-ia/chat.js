/* XA IA — page de discussion : menu +, recherche web, recherche approfondie, image, réponses en flux. */
(function () {
  'use strict';

  var WA = String(window.XA_IA_WA || '22249037697');
  var ENDPOINT = String(window.XA_IA_ENDPOINT || '').trim().replace(/\/+$/, '');
  var turn = 0, failures = 0, deadUntil = 0;
  var FACE = 'xa-ia/img/xa-ia-visage.jpg';
  var engine = null;
  var busy = false;
  var modes = { web: false, deep: false };
  var image = null; // { dataUrl, media_type, data }
  var history = [];  // { role, content } pour le serveur

  function $(id) { return document.getElementById(id); }
  function h(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function waLink(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }

  var scroller = $('scroll'), log = $('log'), chipsBox = $('chips'), input = $('input'), sendBtn = $('send');

  /* ---------- Texte riche minimal (gras, listes), sans HTML injecté ---------- */
  function inline(el, text) {
    var parts = String(text).split(/(\*\*[^*]+\*\*)/g);
    parts.forEach(function (p) {
      if (/^\*\*[^*]+\*\*$/.test(p)) { var b = h('strong'); b.textContent = p.slice(2, -2); el.appendChild(b); }
      else if (p) el.appendChild(document.createTextNode(p));
    });
  }
  function renderRich(el, text) {
    el.textContent = '';
    var lines = String(text).replace(/\r/g, '').split('\n'), list = null, para = null;
    function flush() { para = null; list = null; }
    lines.forEach(function (ln) {
      var m;
      if (!ln.trim()) { flush(); return; }
      if ((m = ln.match(/^\s*[-*•]\s+(.*)$/))) {
        if (!list || list.tagName !== 'UL') { list = h('ul'); el.appendChild(list); para = null; }
        var li = h('li'); inline(li, m[1]); list.appendChild(li);
      } else if ((m = ln.match(/^\s*\d+[.)]\s+(.*)$/))) {
        if (!list || list.tagName !== 'OL') { list = h('ol'); el.appendChild(list); para = null; }
        var li2 = h('li'); inline(li2, m[1]); list.appendChild(li2);
      } else if ((m = ln.match(/^\s*\*\*([^*]+)\*\*\s*$/))) {
        flush(); var so = h('p', 'so'); so.textContent = m[1]; el.appendChild(so);
      } else if ((m = ln.match(/^\s*(?:→|->|=>)\s*(.*)$/))) {
        flush(); var tr = h('p', 'tr'); inline(tr, m[1]); el.appendChild(tr);
      } else {
        list = null;
        ln = ln.replace(/^#{1,4}\s+/, '');
        if (!para) { para = h('p'); el.appendChild(para); } else para.appendChild(document.createElement('br'));
        inline(para, ln);
      }
    });
  }

  /* ---------- Fiches de mots (sans mention de source) ---------- */
  function entryNode(it) {
    var d = h('div', 'entry');
    d.appendChild(h('div', 'son', it.son));
    if (it.ton && it.ton !== it.son) d.appendChild(h('div', 'ton', it.ton));
    d.appendChild(h('div', 'fr', it.fr));
    if (it.audio) { var au = h('audio'); au.controls = true; au.preload = 'none'; au.src = it.audio; au.setAttribute('aria-label', 'Écouter ' + it.son); d.appendChild(au); }
    return d;
  }

  /* ---------- Fil de discussion ---------- */
  function hideWelcome() { $('welcome').hidden = true; }
  function addMsg(role, nodes) {
    hideWelcome();
    var m = h('div', 'msg ' + role);
    if (role === 'bot') { var f = h('img', 'face'); f.src = FACE; f.alt = ''; f.width = 32; f.height = 32; m.appendChild(f); }
    var b = h('div', 'bubble');
    (Array.isArray(nodes) ? nodes : [nodes]).forEach(function (n) { b.appendChild(typeof n === 'string' ? h('p', '', n) : n); });
    m.appendChild(b);
    log.appendChild(m);
    scroller.scrollTop = scroller.scrollHeight;
    return { row: m, bubble: b };
  }
  function setChips(list) {
    chipsBox.textContent = '';
    (list || []).forEach(function (label) {
      var c = h('button', 'chip', label); c.type = 'button';
      c.addEventListener('click', function () { send(label); });
      chipsBox.appendChild(c);
    });
  }
  function quizNode(q) {
    var box = h('div'); box.appendChild(h('p', '', q.prompt));
    var opts = h('div', 'opts'), done = false, btns = [];
    q.options.forEach(function (o) {
      var b = h('button', 'opt', o.label); b.type = 'button';
      b.addEventListener('click', function () {
        if (done) return; done = true;
        btns.forEach(function (x) { x.btn.disabled = true; if (x.o.correct) x.btn.classList.add('ok'); });
        if (!o.correct) b.classList.add('no');
        box.appendChild(h('p', '', o.correct ? 'Bravo, c’est ça.' : 'Pas tout à fait. La bonne réponse :'));
        if (q.answer) box.appendChild(entryNode(q.answer));
        setChips(['Encore un quiz', 'Salutations', 'Les nombres']);
        scroller.scrollTop = scroller.scrollHeight;
      });
      btns.push({ btn: b, o: o }); opts.appendChild(b);
    });
    box.appendChild(opts);
    return box;
  }
  var lastUser = '';
  function renderLocal(r) {
    var nodes = [r.text], MAX = 8, items = r.items || [];
    items.slice(0, MAX).forEach(function (it) { nodes.push(entryNode(it)); });
    if (items.length > MAX) {
      var more = h('div', 'entry more');
      var btn = h('button', 'chip', 'Voir les ' + items.length + ' entrées du thème'); btn.type = 'button';
      btn.addEventListener('click', function () { location.href = 'xa-ia-savoir.html#dico=' + r.cat; });
      more.appendChild(btn); nodes.push(more);
    }
    if (r.quiz) nodes.push(quizNode(r.quiz));
    if (turn === 0 && r.type !== 'converse') { var dn = h('p', 'disc', 'XA IA est une IA conçue pour parler et enseigner le soninké. Elle peut faire des erreurs.'); nodes.push(dn); }
    addMsg('bot', nodes);
    remember(lastUser, summary(r));
    setChips(r.chips && r.chips.length ? r.chips : (r.quiz ? [] : ['Salutations', 'Faire un quiz']));
  }

  /* ---------- Serveur (flux) ---------- */
  function readStream(res, on) {
    var reader = res.body.getReader(), dec = new TextDecoder(), buf = '';
    function pump() {
      return reader.read().then(function (x) {
        if (x.done) return;
        buf += dec.decode(x.value, { stream: true });
        var cut;
        while ((cut = buf.indexOf('\n\n')) >= 0) {
          var chunk = buf.slice(0, cut); buf = buf.slice(cut + 2);
          chunk.split('\n').forEach(function (line) {
            if (line.indexOf('data: ') !== 0) return;
            try { on(JSON.parse(line.slice(6))); } catch (e) {}
          });
        }
        return pump();
      });
    }
    return pump();
  }
  function askServer(payload, handlers) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, payload.deep ? 120000 : 60000);
    return fetch(ENDPOINT + (/\/chat$/.test(ENDPOINT) ? '' : '/chat'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: ctl ? ctl.signal : undefined
    }).then(function (res) {
      if (!res.ok || !res.body) throw new Error('http ' + res.status);
      return readStream(res, function (ev) { clearTimeout(timer); timer = setTimeout(function () { if (ctl) ctl.abort(); }, 60000); handlers(ev); });
    }).then(function () { clearTimeout(timer); }, function (e) { clearTimeout(timer); throw e; });
  }

  function serverUsable() { return !!ENDPOINT && Date.now() > deadUntil; }
  function wantsServer(r) { return serverUsable() && r.type !== 'quiz' && r.type !== 'category'; }
  function noteFail() { if (++failures >= 2) { deadUntil = Date.now() + 60000; failures = 0; } }

  function summary(r) {
    var t = r.text || '';
    (r.items || []).slice(0, 4).forEach(function (it) { t += '\n' + it.son + ' = ' + it.fr; });
    return t;
  }
  function remember(user, assistant) {
    history.push({ role: 'user', content: user }, { role: 'assistant', content: assistant });
    if (history.length > 16) history = history.slice(-16);
    turn++;
  }
  function done() { busy = false; sendBtn.disabled = !input.value.trim() && !image; }

  function extractsFor(text) {
    var out = [], seen = {};
    function add(list) {
      list.forEach(function (r) {
        if (r.fuzzy || out.length >= 6) return;
        var k = r.son + '|' + r.fr; if (seen[k]) return; seen[k] = 1; out.push(r.son + ' = ' + r.fr);
      });
    }
    try {
      add(engine.search(text));
      if (out.length < 6) {
        String(text).split(/[\s,;:.!?'’"«»()]+/).filter(function (w) { return w.length > 2; }).forEach(function (w) { add(engine.search(w)); });
      }
    } catch (e) {}
    return out;
  }

  function streamReply(text, shot, fallback) {
    var mode = { web: modes.web || modes.deep, deep: modes.deep };
    var msgs = history.slice(-10).concat([{ role: 'user', content: text }]);
    var out = addMsg('bot', typingNode());
    var bubble = out.bubble, acc = '', sources = [], statusEl = null, raf = 0, got = false;
    function paint() {
      raf = 0;
      var keep = statusEl;
      renderRich(bubble, acc);
      if (keep && !got) bubble.insertBefore(keep, bubble.firstChild);
      scroller.scrollTop = scroller.scrollHeight;
    }
    askServer({ messages: msgs, message: text, extracts: extractsFor(text), turn: turn, web: mode.web, deep: mode.deep, image: shot ? { media_type: shot.media_type, data: shot.data } : null }, function (ev) {
      if (ev.type === 'text') { got = true; acc += ev.text; if (!raf) raf = requestAnimationFrame(paint); }
      else if (ev.type === 'status') {
        if (!got) { bubble.textContent = ''; statusEl = h('div', 'status', ev.text); bubble.appendChild(statusEl); }
      } else if (ev.type === 'source') { sources.push(ev); }
    }).then(function () {
      if (raf) cancelAnimationFrame(raf);
      if (!acc.trim()) throw new Error('empty');
      failures = 0;
      renderRich(bubble, acc);
      if (sources.length) {
        var d = h('details', 'web'); d.appendChild(h('summary', '', 'Pages consultées sur le web'));
        var seen = {};
        sources.forEach(function (s) {
          if (!/^https?:\/\//.test(s.url) || seen[s.url]) return; seen[s.url] = 1;
          var a = h('a', '', s.title || s.url); a.href = s.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; d.appendChild(a);
        });
        if (d.children.length > 1) bubble.appendChild(d);
      }
      remember(text, acc);
      setChips(['Comment dit-on « merci » ?', 'Apprends-moi à compter', 'Faire un quiz']);
      done();
    }).catch(function () {
      if (raf) cancelAnimationFrame(raf);
      if (acc.trim()) { renderRich(bubble, acc); remember(text, acc); done(); return; }
      noteFail();
      out.row.remove();
      if (shot) {
        addMsg('bot', 'Je n’arrive pas à regarder cette image pour le moment. Réessaie dans un instant, ou écris-moi ce que tu vois et je te donne le nom en soninké.');
        setChips(['Comment dit-on « eau » ?', 'Les salutations']);
        turn++;
      } else renderLocal(fallback);
      done();
    });
  }
  function typingNode() {
    var t = h('span', 'typing'); t.setAttribute('aria-label', 'XA IA écrit');
    t.appendChild(h('i')); t.appendChild(h('i')); t.appendChild(h('i')); return t;
  }

  function send(text) {
    text = (text || '').trim();
    var shot = image;
    if ((!text && !shot) || busy || !engine) return;
    if (!text && shot) text = 'Qu’est-ce que c’est ? Donne-moi son nom.';
    busy = true; sendBtn.disabled = true;
    var userNodes = [];
    if (shot) { var fig = h('div', 'photo'); var im = h('img'); im.src = shot.dataUrl; im.alt = 'Image envoyée'; fig.appendChild(im); userNodes.push(fig); }
    userNodes.push(text);
    addMsg('user', userNodes);
    clearImage();

    lastUser = text;
    var r = engine.reply(text, { hour: new Date().getHours(), first: turn === 0, n: turn });
    if (shot || wantsServer(r)) { setChips([]); streamReply(text, shot, r); return; }
    var wait = addMsg('bot', typingNode());
    setTimeout(function () { wait.row.remove(); renderLocal(r); done(); }, 300);
  }

  /* ---------- Menu + : modes et image ---------- */
  var menu = $('menu'), plus = $('plus'), toast = $('toast');
  function showToast(t) { toast.textContent = t; toast.hidden = false; clearTimeout(showToast.t); showToast.t = setTimeout(function () { toast.hidden = true; }, 3200); }
  function toggleMenu(open) {
    var o = typeof open === 'boolean' ? open : menu.hidden;
    menu.hidden = !o; plus.setAttribute('aria-expanded', String(o));
    if (o) { var f = menu.querySelector('button'); if (f) f.focus(); }
  }
  function paintModes() {
    var box = $('modes'); box.textContent = '';
    [['deep', 'Recherche approfondie'], ['web', 'Recherche sur le web']].forEach(function (m) {
      if (!modes[m[0]]) return;
      var c = h('span', 'mode', m[1]);
      var x = h('button', '', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Retirer ' + m[1]);
      x.addEventListener('click', function () { modes[m[0]] = false; paintModes(); });
      c.appendChild(x); box.appendChild(c);
    });
    Array.prototype.forEach.call(menu.querySelectorAll('[data-act="web"],[data-act="deep"]'), function (b) {
      var on = !!modes[b.dataset.act]; b.setAttribute('aria-checked', String(on)); b.classList.toggle('on', on);
    });
  }
  function clearImage() { image = null; $('attach').textContent = ''; $('file').value = ''; }
  function setImage(file) {
    if (!file || !/^image\//.test(file.type)) { showToast('Choisis une photo (JPEG, PNG ou WebP).'); return; }
    var url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      var max = 1568, w = img.naturalWidth, hgt = img.naturalHeight, k = Math.min(1, max / Math.max(w, hgt));
      var c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(hgt * k);
      var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
      var data = c.toDataURL('image/jpeg', 0.85); URL.revokeObjectURL(url);
      image = { dataUrl: data, media_type: 'image/jpeg', data: data.split(',')[1] };
      var box = $('attach'); box.textContent = '';
      var t = h('div', 'thumb'); var im = h('img'); im.src = data; im.alt = 'Image à envoyer';
      var x = h('button', '', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Retirer l’image'); x.addEventListener('click', function () { clearImage(); sendBtn.disabled = !input.value.trim(); });
      t.appendChild(im); t.appendChild(x); box.appendChild(t);
      sendBtn.disabled = false; input.focus();
    };
    img.onerror = function () { URL.revokeObjectURL(url); showToast('Cette image ne peut pas être lue. Essaie une photo JPEG ou PNG.'); };
    img.src = url;
  }
  plus.addEventListener('click', function (e) { e.stopPropagation(); toggleMenu(); });
  document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target)) toggleMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { toggleMenu(false); plus.focus(); } });
  Array.prototype.forEach.call(menu.querySelectorAll('button'), function (b) {
    b.addEventListener('click', function () {
      var act = b.dataset.act;
      toggleMenu(false);
      if (act === 'image') $('file').click();
      else { modes[act] = !modes[act]; if (act === 'deep' && modes.deep) modes.web = false; if (act === 'web' && modes.web) modes.deep = false; paintModes(); input.focus(); }
    });
  });
  $('file').addEventListener('change', function (e) { setImage(e.target.files && e.target.files[0]); });

  /* ---------- Micro : dictée gratuite du navigateur (Web Speech API, français) ---------- */
  (function () {
    var mic = $('mic'), SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!mic) return;
    if (!SR) { mic.hidden = true; return; }
    var rec = null, on = false, base = '';
    function stop() { on = false; mic.classList.remove('rec'); mic.setAttribute('aria-pressed', 'false'); mic.setAttribute('aria-label', 'Dicter ton message'); }
    mic.addEventListener('click', function () {
      if (on && rec) { try { rec.stop(); } catch (e) {} return; }
      try {
        rec = new SR(); rec.lang = 'fr-FR'; rec.interimResults = true; rec.continuous = false;
        base = input.value ? input.value.replace(/\s+$/, '') + ' ' : '';
        rec.onresult = function (e) {
          var t = ''; for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
          input.value = base + t; grow();
        };
        rec.onerror = function (e) {
          stop();
          if (e && (e.error === 'not-allowed' || e.error === 'service-not-allowed')) showToast('Autorise le micro dans ton navigateur pour dicter.');
          else if (e && e.error === 'no-speech') showToast('Je n’ai rien entendu. Réessaie.');
        };
        rec.onend = function () { stop(); input.focus(); };
        rec.start(); on = true; mic.classList.add('rec'); mic.setAttribute('aria-pressed', 'true'); mic.setAttribute('aria-label', 'Arrêter la dictée');
      } catch (e) { stop(); showToast('La dictée n’est pas disponible sur ce navigateur.'); }
    });
  })();

  /* ---------- Saisie ---------- */
  function grow() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 160) + 'px'; sendBtn.disabled = busy || (!input.value.trim() && !image); }
  input.addEventListener('input', grow);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); $('form').requestSubmit(); }
  });
  $('form').addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; grow(); send(v); });
  Array.prototype.forEach.call(document.querySelectorAll('.starter'), function (b) { b.addEventListener('click', function () { send(b.dataset.q); }); });

  /* ---------- Démarrage ---------- */
  paintModes();
  XAData.ready.then(function (d) {
    engine = d.engine;
    sendBtn.disabled = !input.value.trim();
    var q = (location.search.match(/[?&]q=([^&]+)/) || [])[1];
    if (q) { try { send(decodeURIComponent(q.replace(/\+/g, ' '))); } catch (e) {} }
  }).catch(function () {
    addMsg('bot', 'Je n’arrive pas à me charger pour le moment. Vérifie ta connexion puis recharge la page.');
  });
})();
