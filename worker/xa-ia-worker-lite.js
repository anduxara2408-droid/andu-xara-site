/* XA IA — serveur (Cloudflare Worker).
 *
 * - Discussion : appelle le modèle (Claude par défaut, ou Groq si seule GROQ_API_KEY existe),
 *   avec recherche web, recherche approfondie et analyse d'image, et renvoie la réponse en flux.
 * - Contributions : les visiteurs proposent des mots soninké (POST /contribute). Ils attendent
 *   la validation de l'administrateur (/admin/*). Une fois validés, ils entrent dans les
 *   connaissances de XA IA (GET /approved et consigne du modèle).
 *
 * Secrets / variables (Cloudflare > Settings > Variables and secrets) :
 *   ANTHROPIC_API_KEY  (secret) clé du modèle principal
 *   GROQ_API_KEY       (secret, option) solution de secours, texte seulement
 *   ADMIN_TOKEN        (secret) mot de passe de la page de validation
 *   XA_KV              (liaison KV) stockage des contributions
 *   ALLOWED_ORIGINS, MODEL_FAST, MODEL_DEEP, GROQ_MODEL, ANTHROPIC_VERSION  (options)
 *
 * Ce fichier est un modèle : worker/build.py y insère la base de soninké vérifiée
 * (xa-ia/corpus.json) et produit worker/xa-ia-worker.js, prêt à coller dans Cloudflare.
 */

const VERIFIED = /*__CORPUS__*/ [];

const DEFAULT_ORIGINS = [
  'https://andu-xara.com', 'https://www.andu-xara.com', 'https://andu-xara.store', 'https://www.andu-xara.store',
];
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_B64 = 5_000_000;   // environ 3,7 Mo d'image
const MAX_MESSAGES = 12;
const MAX_CHARS = 2000;
const RATE = { windowMs: 10 * 60 * 1000, max: 40 };
const RATE_CONTRIB = { windowMs: 10 * 60 * 1000, max: 6 };
const hits = new Map();
const hitsC = new Map();
const LETTERS = /[\p{L}]/u;

/* ------------------------------------------------------------------ */
/* Texte normalisé et recherche des entrées proches                    */
/* ------------------------------------------------------------------ */
function norm(s) {
  return String(s == null ? '' : s).toLowerCase()
    .replace(/[’‘ʼ`´]/g, "'").replace(/œ/g, 'oe').replace(/[ŋɲ]/g, 'n')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}
const normS = (s) => norm(s).replace(/q/g, 'x'); // q (est) et x (ouest) : même son
const STOP = new Set(('comment dit dis on en soninke francais traduis traduire moi que qui quoi veut dire signifie ca c est quel quelle ' +
  'mot mots phrase pour le la les l un une des du de d s il te vous plait ce se t je tu me m ne pas ou et a au aux ' +
  'peux peut tu sais parle parler ecris ecrire').split(' '));

function rank(text, entries, limit) {
  const qf = norm(text).split(' ').filter((w) => w.length > 1 && !STOP.has(w));
  const qs = normS(text).split(' ').filter((w) => w.length > 1);
  if (!qf.length && !qs.length) return [];
  const scored = [];
  for (const e of entries) {
    const son = normS(e[0]).split(' ');
    const fr = norm(e[1]).split(' ');
    let sc = 0;
    for (const w of qs) if (son.includes(w)) sc += 3;
    for (const w of qf) if (fr.includes(w)) sc += 2;
    if (sc) scored.push([sc, e]);
  }
  scored.sort((a, b) => b[0] - a[0]);
  return scored.slice(0, limit).map((x) => x[1]);
}

function listBlock(rows) { return rows.map((e) => e[0] + ' = ' + e[1]).join('\n'); }

/* ------------------------------------------------------------------ */
/* Consignes du modèle                                                 */
/* ------------------------------------------------------------------ */
const SYSTEM = `Tu es XA IA, une intelligence artificielle conçue pour parler, écrire et enseigner le soninké (sooninkanxanne). Tu as été imaginée et développée par Cheikhou Diabira, fondateur d'Andu-Xara, une marque afro-urbaine née à Nouakchott (Mauritanie). Sur le plan technique, tu reposes sur les modèles de langage modernes (traitement automatique du langage et grands modèles de langage), adaptés au soninké avec des lexiques, des leçons, des phrases vérifiées, des règles d'écriture et les mots validés par la communauté, et complétés par de vastes connaissances générales (sciences, histoire, culture, vie pratique). Tu parles avec chaleur, calme et fierté, sans hésiter.

ÉCRITURE DU SONINKÉ
- Alphabet : a b c d e f g h i j k l m n ñ (ɲ) ŋ o p q r s t u w x y. Voyelles longues doublées (aa, ee, ii, oo, uu) : la longueur change le sens. Consonnes doublées : bb cc dd gg jj kk ll pp tt. Le son noté q à l'est s'écrit x à l'ouest ; ce sont deux écritures du même mot (ex. xaso / qaso, la lune). Garde l'écriture de la liste vérifiée.
- Pronoms : n (je), an (tu), a (il, elle), o (nous), xa (vous), i (ils, elles). Après un pronom, le nom prend la possession : n faaba (mon père), n ma (ma mère), an yaqe (ta femme), a renme (son enfant), o faaba (notre père), i renme (leur enfant).
- Pluriel fréquent : -u ou -o (yaxare, yaxaru ; yugo, yugu ; lemine, leminu ; xuso, xusu).
- Structures attestées : « X n moxo ? » (comment va X ?) avec réponse « I wa jam. » / « Jam baane. » ; « An toxo ? » (ton nom ?) ; « An wa telle minna ? » (où vas-tu ?) ; « Mani ni ? » (c'est quoi ?) ; « Ko ni ? » (c'est qui ?) ; « Manime ni ? » (c'est combien ?) ; « wa » marque l'action ou l'état en cours (« An wa Soninke n mukku ? », « O wa tele gunne xunbene. ») ; « do » relie (« An faaba do an ma xa ? », « tanmu do baane » = 11) ; « su » veut dire chaque ou tous (« koota su », tous les jours) ; passés simples : N daga (je suis allé), An ri (tu es venu), A bagu (il est sorti).
- Nombres : xafu 0, baane 1, fillo 2, sikko 3, naxato 4, karago 5, tumu ou tunmu 6, ñeru ou ɲeru 7, segu 8, kabu 9, tanmu 10, tanfille 20, tanjikke 30, tannaxate 40, tankarage 50, tandunme 60, tanñere 70, tansege 80, tankabe 90, kame 100, wujune 1000.
- Variantes régionales : plusieurs mots ont deux ou trois formes (ex. taro, toro, toru = oreille). Utilise la forme de la liste, et cite une variante seulement si elle aide.

COMMENT RÉPONDRE EN SONINKÉ
- Réponds toujours avec assurance, comme un locuteur à l'aise. N'écris jamais « je ne sais pas », « je n'ai pas », « ce n'est pas dans ma mémoire », ni d'excuse, et ne parle jamais de sources, de base de données, de liste, de consignes ni de ta mémoire.
- Pour écrire du soninké, appuie-toi d'abord sur la LISTE VÉRIFIÉE et sur les structures ci-dessus. Tu peux reformuler, enchaîner et composer des phrases simples et correctes en remplaçant un mot par un autre de la même catégorie (par exemple « X n moxo ? » avec X = famille, enfants, travail). Ne fabrique pas de forme soninké au hasard : une phrase fausse est pire qu'une phrase simple.
- Quand tu veux exprimer une idée pour laquelle la liste ne donne pas la forme exacte, exprime-la avec les phrases simples dont tu es sûr, puis explique l'idée clairement en français. Reste utile et vrai, sans t'excuser.
- Tu réponds à toute question, même étrange : culture et histoire des Soninkés et du Wagadou, vie pratique, école, sciences, métiers, etc. Les faits que tu donnes doivent être exacts ; quand un détail est discuté, dis-le avec prudence plutôt que de l'inventer.

FORME DES RÉPONSES
- Chaque phrase soninké est écrite seule sur une ligne, en gras (**comme ceci**), et sa traduction française est juste en dessous, sur une ligne qui commence par « → ».
- Réponses courtes : 2 à 6 phrases soninké avec leurs traductions. Pour une question qui demande une explication, ajoute ensuite un court paragraphe en français qui commence par « En détail : ».
- Pas d'emojis, pas de titres. Listes courtes seulement si elles aident.

IMAGES
- Quand on te montre une image, dis ce que c'est : le nom en français, puis le nom soninké si tu l'as dans la liste, puis une courte explication. Une image seule, sans texte, veut dire « qu'est-ce que c'est ? ».
`;

const POLICY_FIRST = `\nRÈGLE DE LANGUE POUR CETTE RÉPONSE : c'est la première réponse de la conversation.
- Si la personne écrit en français ou en anglais : réponds d'abord dans cette langue, brièvement, à sa question ; précise avec simplicité que tu es une IA conçue pour parler et enseigner le soninké et que tu peux faire des erreurs ; ajoute une ou deux phrases soninké (avec traduction) en rapport avec sa question ; invite-la à continuer en soninké.
- Si la personne écrit en soninké : réponds directement en soninké (phrases en gras, traduction française dessous) et précise en une ligne, en français, que tu peux faire des erreurs.
- Si la personne écrit en pular, wolof, hassaniya, arabe ou une autre langue : réponds un peu dans sa langue, puis dis, dans cette langue ou en français, que tu es conçue pour parler le soninké et enseigner le soninké, et continue avec une phrase soninké traduite.
`;
const POLICY_NEXT = `\nRÈGLE DE LANGUE POUR CETTE RÉPONSE : ce n'est plus la première réponse. Réponds maintenant en soninké (phrases en gras, traduction française dessous), même si la personne écrit en français ou en anglais. Ne répète pas que tu es une IA qui peut se tromper.
- Si la personne écrit en pular, wolof, hassaniya, arabe ou une autre langue autre que le français et l'anglais : réponds un peu dans sa langue, rappelle en une phrase que tu es conçue pour parler et enseigner le soninké, puis continue en soninké.
`;

const MODE_WEB = `\nRECHERCHE WEB : fais une recherche web pour les informations récentes ou précises. Réponds ensuite avec tes propres mots et ne cite pas de sites.`;
const MODE_DEEP = `\nRECHERCHE APPROFONDIE : fais plusieurs recherches, croise les informations, puis réponds de façon complète (environ 400 mots pour la partie « En détail : »), en commençant par l'essentiel en soninké. Ne cite pas de sites.`;

/* ------------------------------------------------------------------ */
/* Utilitaires HTTP                                                    */
/* ------------------------------------------------------------------ */
function corsHeaders(origin, allowed) {
  const ok = origin && allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(obj, status, extra) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...extra } });
}

function limiter(map, cfg, ip) {
  const now = Date.now();
  const arr = (map.get(ip) || []).filter((t) => now - t < cfg.windowMs);
  arr.push(now);
  map.set(ip, arr);
  if (map.size > 5000) for (const k of map.keys()) { map.delete(k); break; }
  return arr.length > cfg.max;
}

async function sha(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function clean(body) {
  if (!body || !Array.isArray(body.messages) || !body.messages.length) return null;
  const msgs = body.messages.slice(-MAX_MESSAGES).map((m) => ({
    role: m && m.role === 'assistant' ? 'assistant' : 'user',
    content: String((m && m.content) || '').slice(0, MAX_CHARS),
  })).filter((m) => m.content.trim());
  if (!msgs.length) return null;
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return null;
  // l'API exige l'alternance user / assistant
  const alt = [];
  for (const m of msgs) {
    if (alt.length && alt[alt.length - 1].role === m.role) alt[alt.length - 1].content += '\n' + m.content;
    else alt.push({ ...m });
  }
  let image = null;
  if (body.image && typeof body.image === 'object') {
    const t = String(body.image.media_type || '');
    const d = String(body.image.data || '');
    if (!IMAGE_TYPES.includes(t) || !/^[A-Za-z0-9+/=]+$/.test(d) || d.length > MAX_IMAGE_B64) return { error: 'image' };
    image = { media_type: t, data: d };
  }
  // nombre de réponses déjà données dans toute la session (le site le fournit)
  let turn = Number.isFinite(body.turn) ? Math.max(0, Math.floor(body.turn)) : null;
  if (turn === null) turn = alt.filter((m) => m.role === 'assistant').length;
  // extraits de la base locale trouvés par le site (facultatif) : lignes courtes « soninké = français »
  const extracts = Array.isArray(body.extracts)
    ? body.extracts.slice(0, 12).map((x) => cleanText(x, 200)).filter((x) => x.length > 2 && !spammy(x)) : [];
  return { messages: alt, web: !!body.web, deep: !!body.deep, image, turn, extracts };
}

/* ------------------------------------------------------------------ */
/* Contributions                                                       */
/* ------------------------------------------------------------------ */
let approvedCache = { at: 0, rows: [] };

async function loadApproved(env, force) {
  if (!env.XA_KV) return [];
  if (!force && Date.now() - approvedCache.at < 30000) return approvedCache.rows;
  let rows = [];
  try {
    const raw = await env.XA_KV.get('approved');
    const arr = raw ? JSON.parse(raw) : [];
    if (Array.isArray(arr)) rows = arr.filter((r) => r && r.son && r.fr);
  } catch (e) { console.error('approved read failed', e && e.message); }
  approvedCache = { at: Date.now(), rows };
  return rows;
}

function cleanText(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}
function spammy(t) { return /https?:|www\.|@|<|>|\bhref\b/i.test(t); }

async function contribute(request, env, cors) {
  if (!env.XA_KV) return json({ error: 'kv' }, 503, cors);
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  if (limiter(hitsC, RATE_CONTRIB, ip)) return json({ error: 'rate' }, 429, cors);
  let b; try { b = await request.json(); } catch { return json({ error: 'json' }, 400, cors); }
  if (b && b.hp) return json({ ok: true, status: 'received' }, 200, cors); // champ piège pour les robots
  const son = cleanText(b && b.son, 300), fr = cleanText(b && b.fr, 300);
  const note = cleanText(b && b.note, 300), by = cleanText(b && b.by, 40);
  if (son.length < 2 || fr.length < 2) return json({ error: 'fields' }, 400, cors);
  if (!LETTERS.test(son) || !LETTERS.test(fr)) return json({ error: 'fields' }, 400, cors);
  if (spammy(son) || spammy(fr) || spammy(note)) return json({ error: 'spam' }, 400, cors);

  const id = (await sha(normS(son) + '|' + norm(fr))).slice(0, 16);
  const known = VERIFIED.some((e) => normS(e[0]) === normS(son) && norm(e[1]) === norm(fr));
  const approved = await loadApproved(env, true);
  if (known || approved.some((r) => r.id === id || (normS(r.son) === normS(son) && norm(r.fr) === norm(fr)))) return json({ ok: true, status: 'known' }, 200, cors);
  if (await env.XA_KV.get('x:' + id)) return json({ ok: true, status: 'received' }, 200, cors);

  const voter = (await sha(ip + '|xa')).slice(0, 12);
  const key = 'p:' + id;
  let rec = null;
  try { rec = JSON.parse((await env.XA_KV.get(key)) || 'null'); } catch { rec = null; }
  if (rec) {
    if (!rec.voters.includes(voter)) { rec.voters.push(voter); rec.voters = rec.voters.slice(-20); rec.count = rec.voters.length; }
    if (note && !rec.note) rec.note = note;
  } else {
    rec = { id, son, fr, note, by, count: 1, voters: [voter], at: new Date().toISOString() };
  }
  await env.XA_KV.put(key, JSON.stringify(rec));
  return json({ ok: true, status: 'received' }, 200, cors);
}

function adminOk(request, env) {
  const t = env.ADMIN_TOKEN;
  if (!t) return 'config';
  const h = request.headers.get('Authorization') || '';
  const got = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (got.length !== t.length) return 'auth';
  let diff = 0;
  for (let i = 0; i < t.length; i++) diff |= got.charCodeAt(i) ^ t.charCodeAt(i);
  return diff === 0 ? 'ok' : 'auth';
}

async function admin(request, env, cors, path) {
  if (!env.XA_KV) return json({ error: 'kv' }, 503, cors);
  const ok = adminOk(request, env);
  if (ok === 'config') return json({ error: 'config' }, 503, cors);
  if (ok !== 'ok') return json({ error: 'auth' }, 401, cors);

  if (path === '/admin/pending' && request.method === 'GET') {
    const list = await env.XA_KV.list({ prefix: 'p:', limit: 200 });
    const items = [];
    for (const k of list.keys) {
      try { const r = JSON.parse((await env.XA_KV.get(k.name)) || 'null'); if (r) { delete r.voters; items.push(r); } } catch {}
    }
    items.sort((a, b) => (b.count - a.count) || String(a.at).localeCompare(String(b.at)));
    const approved = await loadApproved(env, true);
    return json({ items, approvedCount: approved.length }, 200, cors);
  }
  if (path === '/admin/approved' && request.method === 'GET') {
    return json({ items: await loadApproved(env, true) }, 200, cors);
  }
  if (path === '/admin/decide' && request.method === 'POST') {
    let b; try { b = await request.json(); } catch { return json({ error: 'json' }, 400, cors); }
    const id = cleanText(b && b.id, 32);
    if (!/^[a-f0-9]{16}$/.test(id)) return json({ error: 'id' }, 400, cors);
    const raw = await env.XA_KV.get('p:' + id);
    if (b.action === 'remove') { // retirer un mot déjà validé
      const rows = (await loadApproved(env, true)).filter((r) => r.id !== id);
      await env.XA_KV.put('approved', JSON.stringify(rows));
      approvedCache = { at: 0, rows: [] };
      return json({ ok: true }, 200, cors);
    }
    if (!raw) return json({ error: 'missing' }, 404, cors);
    const rec = JSON.parse(raw);
    if (b.action === 'reject') {
      await env.XA_KV.delete('p:' + id);
      await env.XA_KV.put('x:' + id, '1', { expirationTtl: 60 * 60 * 24 * 90 });
      return json({ ok: true }, 200, cors);
    }
    if (b.action === 'approve') {
      const son = cleanText(b.son || rec.son, 300), fr = cleanText(b.fr || rec.fr, 300);
      if (son.length < 2 || fr.length < 2) return json({ error: 'fields' }, 400, cors);
      const rows = (await loadApproved(env, true)).filter((r) => r.id !== id);
      rows.push({ id, son, fr, note: rec.note || '', at: new Date().toISOString() });
      await env.XA_KV.put('approved', JSON.stringify(rows.slice(-2000)));
      await env.XA_KV.delete('p:' + id);
      approvedCache = { at: 0, rows: [] };
      return json({ ok: true, count: rows.length }, 200, cors);
    }
    return json({ error: 'action' }, 400, cors);
  }
  return json({ error: 'route' }, 404, cors);
}

/* ------------------------------------------------------------------ */
/* Requêtes vers le modèle                                             */
/* ------------------------------------------------------------------ */
function lastUserText(p) { return p.messages[p.messages.length - 1].content; }

async function systemParts(p, env) {
  const approved = await loadApproved(env);
  const extra = approved.map((r) => [r.son, r.fr]);
  const parts = [
    { type: 'text', text: SYSTEM + '\nLISTE VÉRIFIÉE (soninké = français)\n' + listBlock(VERIFIED), cache_control: { type: 'ephemeral' } },
  ];
  const q = p.messages.slice(-2).map((m) => m.content).join(' ');
  const near = rank(q, VERIFIED.concat(extra), 24);
  let dyn = '';
  if (extra.length) dyn += '\nMOTS ET PHRASES VALIDÉS PAR LA COMMUNAUTÉ (à utiliser comme la liste vérifiée)\n' + listBlock(extra.slice(-300)) + '\n';
  if (near.length) dyn += '\nENTRÉES LES PLUS PROCHES DE LA QUESTION\n' + listBlock(near) + '\n';
  if (p.extracts && p.extracts.length) dyn += '\nEXTRAITS TROUVÉS PAR LE SITE (même statut que la liste vérifiée)\n' + p.extracts.join('\n') + '\n';
  dyn += p.turn === 0 ? POLICY_FIRST : POLICY_NEXT;
  dyn += p.deep ? MODE_DEEP : p.web ? MODE_WEB : '';
  parts.push({ type: 'text', text: dyn });
  return parts;
}

async function buildRequest(p, env) {
  const messages = p.messages.map((m) => ({ role: m.role, content: m.content }));
  if (p.image) {
    const last = messages[messages.length - 1];
    last.content = [
      { type: 'image', source: { type: 'base64', media_type: p.image.media_type, data: p.image.data } },
      { type: 'text', text: last.content },
    ];
  }
  const body = {
    model: p.deep ? (env.MODEL_DEEP || 'claude-opus-5-5') : (env.MODEL_FAST || 'claude-sonnet-5-5'),
    max_tokens: p.deep ? 3000 : 1400,
    stream: true,
    system: await systemParts(p, env),
    messages,
  };
  if (p.web || p.deep) body.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: p.deep ? 6 : 3 }];
  return body;
}

async function buildGroqRequest(p, env) {
  const sys = (await systemParts(p, env)).map((x) => x.text).join('\n');
  return {
    model: env.GROQ_MODEL || 'openai/gpt-oss-120b',
    stream: true, max_completion_tokens: 1800, temperature: 0.4, reasoning_effort: 'low', include_reasoning: false,
    messages: [{ role: 'system', content: sys }].concat(p.messages.map((m) => ({ role: m.role, content: m.content }))),
  };
}

function sseWriter(writer) {
  const enc = new TextEncoder();
  return (o) => writer.write(enc.encode('data: ' + JSON.stringify(o) + '\n\n'));
}

// Flux Claude -> {type:'text'|'status'|'source'|'error'|'done'}
async function relay(upstream, writer) {
  const send = sseWriter(writer);
  const reader = upstream.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  const blocks = {};
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let cut;
      while ((cut = buf.indexOf('\n\n')) >= 0) {
        const chunk = buf.slice(0, cut); buf = buf.slice(cut + 2);
        const line = chunk.split('\n').find((l) => l.startsWith('data:'));
        if (!line) continue;
        let ev; try { ev = JSON.parse(line.slice(5).trim()); } catch { continue; }
        if (ev.type === 'content_block_start' && ev.content_block) {
          const b = ev.content_block; blocks[ev.index] = b.type;
          if (b.type === 'server_tool_use') await send({ type: 'status', text: 'Recherche sur le web…' });
          if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) {
            for (const r of b.content.slice(0, 6)) if (r && r.url) await send({ type: 'source', url: r.url, title: r.title || r.url });
          }
        } else if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta' && blocks[ev.index] === 'text') {
          await send({ type: 'text', text: ev.delta.text });
        } else if (ev.type === 'error') {
          console.error('upstream error', JSON.stringify(ev.error || ev));
          await send({ type: 'error' });
        }
      }
    }
    await send({ type: 'done' });
  } catch (e) {
    console.error('relay failed', e && e.message);
    try { await send({ type: 'error' }); } catch {}
  } finally {
    try { await writer.close(); } catch {}
  }
}

// Flux compatible OpenAI (Groq) -> même format
async function relayOpenAI(upstream, writer) {
  const send = sseWriter(writer);
  const reader = upstream.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let cut;
      while ((cut = buf.indexOf('\n\n')) >= 0) {
        const chunk = buf.slice(0, cut); buf = buf.slice(cut + 2);
        const line = chunk.split('\n').find((l) => l.startsWith('data:'));
        if (!line) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') continue;
        let ev; try { ev = JSON.parse(data); } catch { continue; }
        const t = ev.choices && ev.choices[0] && ev.choices[0].delta && ev.choices[0].delta.content;
        if (t) await send({ type: 'text', text: t });
      }
    }
    await send({ type: 'done' });
  } catch (e) {
    console.error('relay failed', e && e.message);
    try { await send({ type: 'error' }); } catch {}
  } finally {
    try { await writer.close(); } catch {}
  }
}

async function chat(request, env, ctx, cors) {
  if (!env.ANTHROPIC_API_KEY && !env.GROQ_API_KEY) return json({ error: 'config' }, 500, cors);
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  if (limiter(hits, RATE, ip)) return json({ error: 'rate' }, 429, cors);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'json' }, 400, cors); }
  const p = clean(body);
  if (!p) return json({ error: 'messages' }, 400, cors);
  if (p.error) return json({ error: p.error }, 400, cors);

  const useClaude = !!env.ANTHROPIC_API_KEY;
  // Une adresse mal saisie dans les variables est ignorée : on retombe sur l'adresse officielle.
  const okUrl = (u, def) => { try { const x = new URL(String(u || '')); return x.protocol === 'https:' && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(x.hostname) ? x.href : def; } catch (e) { return def; } };
  const url = useClaude ? okUrl(env.UPSTREAM_URL, 'https://api.anthropic.com/v1/messages')
                        : okUrl(env.GROQ_URL, 'https://api.groq.com/openai/v1/chat/completions');
  if (!useClaude && p.image) { // le modèle de secours ne lit pas les images
    const { readable, writable } = new TransformStream();
    const w = writable.getWriter(); const send = sseWriter(w);
    (async () => {
      await send({ type: 'text', text: "Je ne peux pas regarder cette image avec le modèle actuel.\n\nDécris-la-moi en quelques mots et je te donne son nom en soninké.\n" });
      await send({ type: 'done' }); await w.close();
    })();
    return new Response(readable, { headers: { ...cors, 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  let upstream;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: useClaude
        ? { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': env.ANTHROPIC_VERSION || '2023-06-01', 'content-type': 'application/json' }
        : { 'Authorization': 'Bearer ' + env.GROQ_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify(useClaude ? await buildRequest(p, env) : await buildGroqRequest(p, env)),
    });
  } catch (e) {
    console.error('fetch failed', e && e.message);
    return json({ error: 'upstream' }, 502, cors);
  }
  if (!upstream.ok || !upstream.body) {
    console.error('upstream status', upstream.status, (await upstream.text().catch(() => '')).slice(0, 500));
    return json({ error: 'upstream' }, 502, cors);
  }

  const { readable, writable } = new TransformStream();
  const done = useClaude ? relay(upstream, writable.getWriter()) : relayOpenAI(upstream, writable.getWriter());
  if (ctx && ctx.waitUntil) ctx.waitUntil(done);
  return new Response(readable, {
    headers: { ...cors, 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' },
  });
}

export default {
  async fetch(request, env, ctx) {
    const allowed = (env.ALLOWED_ORIGINS ? String(env.ALLOWED_ORIGINS).split(',').map((s) => s.trim()).filter(Boolean) : DEFAULT_ORIGINS);
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, allowed);
    const path = new URL(request.url).pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (origin && !allowed.includes(origin)) return json({ error: 'origin' }, 403, cors);

    if ((path === '/' || path === '/chat') && request.method === 'GET') {
      return json({ ok: true, service: 'xa-ia', model: env.ANTHROPIC_API_KEY ? 'claude' : (env.GROQ_API_KEY ? 'groq' : 'none'), contributions: !!env.XA_KV }, 200, cors);
    }
    if (path === '/approved' && request.method === 'GET') {
      const rows = await loadApproved(env);
      return json({ items: rows.map((r) => ({ son: r.son, fr: r.fr })) }, 200, { ...cors, 'Cache-Control': 'public, max-age=60' });
    }
    if (path === '/contribute' && request.method === 'POST') return contribute(request, env, cors);
    if (path.startsWith('/admin/')) return admin(request, env, cors, path);
    if ((path === '/' || path === '/chat') && request.method === 'POST') return chat(request, env, ctx, cors);
    return json({ error: 'route' }, path === '/' || path === '/chat' ? 405 : 404, cors);
  },
};
