/* XA IA - Worker compact (Groq). Version 7.0. A coller en entier dans l'editeur Cloudflare, puis Deploy.
   Variables : GROQ_API_KEY (secret). Liaison KV : XA_KV (facultative, pour les mots proposes). */
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const ORIGINS = ["https://andu-xara.com", "https://www.andu-xara.com", "https://andu-xara.store", "https://www.andu-xara.store"];

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

function corsHeaders(req) {
  const o = req.headers.get("Origin") || "";
  const ok = ORIGINS.includes(o) || /^http:\/\/localhost(:\d+)?$/.test(o);
  return { "Access-Control-Allow-Origin": ok ? o : ORIGINS[0], "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Vary": "Origin" };
}
function json(obj, status, h) {
  return new Response(JSON.stringify(obj), { status: status, headers: Object.assign({ "Content-Type": "application/json; charset=utf-8" }, h) });
}
const txt = (v, n) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, n) : "");

async function approvedList(env) {
  if (!env.XA_KV) return [];
  try { const a = JSON.parse((await env.XA_KV.get("approved")) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; }
}

const hits = new Map();
function limited(ip, max) {
  const now = Date.now(), a = (hits.get(ip) || []).filter((t) => now - t < 600000);
  a.push(now); hits.set(ip, a); return a.length > max;
}

async function contribute(req, env, h) {
  if (!env.XA_KV) return json({ error: "kv" }, 503, h);
  let b; try { b = await req.json(); } catch (e) { return json({ error: "json" }, 400, h); }
  if (b.hp) return json({ ok: true, status: "received" }, 200, h);
  const ip = req.headers.get("CF-Connecting-IP") || "x";
  if (limited("c" + ip, 6)) return json({ error: "limit" }, 429, h);
  const son = txt(b.son, 300), fr = txt(b.fr, 300), note = txt(b.note, 300), by = txt(b.by, 40);
  if (son.length < 2 || fr.length < 2 || /https?:|www\.|@|<|>/i.test(son + fr + note + by)) return json({ error: "invalide" }, 400, h);
  const key = "p:" + son.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 60) + ":" + fr.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40);
  let cur = null; try { cur = JSON.parse((await env.XA_KV.get(key)) || "null"); } catch (e) {}
  const rec = { son: son, fr: fr, note: note || (cur && cur.note) || "", by: by || (cur && cur.by) || "", count: ((cur && cur.count) || 0) + 1, t: Date.now() };
  await env.XA_KV.put(key, JSON.stringify(rec));
  return json({ ok: true, status: "received" }, 200, h);
}

function clean(b) {
  const msgs = (Array.isArray(b.messages) ? b.messages : []).filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim()).slice(-12).map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (!msgs.length && typeof b.message === "string" && b.message.trim()) msgs.push({ role: "user", content: b.message.slice(0, 2000) });
  const ex = (Array.isArray(b.extracts) ? b.extracts : []).map((x) => txt(x, 200)).filter(Boolean).slice(0, 8);
  return { messages: msgs, extracts: ex, turn: Number.isInteger(b.turn) ? b.turn : 1 };
}

async function chat(req, env, ctx, h) {
  if (!env.GROQ_API_KEY) return json({ error: "GROQ_API_KEY manquante" }, 500, h);
  if (limited("m" + (req.headers.get("CF-Connecting-IP") || "x"), 40)) return json({ error: "limit" }, 429, h);
  let b; try { b = await req.json(); } catch (e) { return json({ error: "json" }, 400, h); }
  const p = clean(b);
  if (!p.messages.length || p.messages[p.messages.length - 1].role !== "user") return json({ error: "vide" }, 400, h);
  let sys = SYSTEM + (p.turn === 0 ? POLICY_FIRST : POLICY_NEXT);
  if (p.extracts.length) sys += "\n\nLISTE VERIFIEE POUR CETTE QUESTION (utilise ces formes exactes) :\n" + p.extracts.join("\n");
  const ap = (await approvedList(env)).slice(-40).map((x) => (x && x.son && x.fr ? x.son + " = " + x.fr : "")).filter(Boolean);
  if (ap.length) sys += "\n\nMOTS VALIDES PAR LA COMMUNAUTE :\n" + ap.join("\n");
  const up = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Authorization": "Bearer " + env.GROQ_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, stream: true, temperature: 0.4, max_tokens: 900, messages: [{ role: "system", content: sys }].concat(p.messages) })
  });
  if (!up.ok || !up.body) { const t = await up.text().catch(() => ""); return json({ error: "groq " + up.status + " " + t.slice(0, 160) }, 502, h); }
  const ts = new TransformStream(), w = ts.writable.getWriter(), enc = new TextEncoder(), dec = new TextDecoder();
  const send = (o) => w.write(enc.encode("data: " + JSON.stringify(o) + "\n\n"));
  ctx.waitUntil((async () => {
    try {
      const r = up.body.getReader(); let buf = "";
      for (;;) {
        const x = await r.read(); if (x.done) break;
        buf += dec.decode(x.value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
          if (line.indexOf("data:") !== 0) continue;
          const d = line.slice(5).trim(); if (d === "[DONE]") continue;
          try { const t = JSON.parse(d).choices[0].delta.content; if (t) await send({ type: "text", text: t }); } catch (e) {}
        }
      }
      await send({ type: "done" });
    } catch (e) { try { await send({ type: "error", text: String(e) }); } catch (e2) {} }
    finally { try { await w.close(); } catch (e) {} }
  })());
  return new Response(ts.readable, { headers: Object.assign({ "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store" }, h) });
}

export default {
  async fetch(req, env, ctx) {
    const h = corsHeaders(req), path = new URL(req.url).pathname.replace(/\/+$/, "") || "/";
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (req.method === "GET" && (path === "/" || path === "/chat")) return json({ ok: true, status: "ok", service: "XA IA", version: "7.0-compact", groq_configured: !!env.GROQ_API_KEY, kv_configured: !!env.XA_KV }, 200, h);
    if (req.method === "GET" && path === "/approved") return json({ items: await approvedList(env) }, 200, h);
    if (req.method === "POST" && path === "/contribute") return contribute(req, env, h);
    if (req.method === "POST" && (path === "/" || path === "/chat")) return chat(req, env, ctx, h);
    return json({ error: "route" }, 404, h);
  }
};
