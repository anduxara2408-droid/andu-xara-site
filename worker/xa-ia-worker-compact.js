/* XA IA - Worker compact (Groq). Version 8.0. A coller en entier dans l'editeur Cloudflare, puis Deploy.
   Variables : GROQ_API_KEY (secret). Liaison KV : XA_KV (facultative, pour les mots proposes). */
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const VISION_MODEL = "qwen/qwen3.8-27b"; // lit les images
const MODEL = "openai/gpt-oss-120b"; // llama-3.3-70b-versatile est arrete chez Groq depuis aout 2026
const ORIGINS = ["https://andu-xara.com", "https://www.andu-xara.com", "https://andu-xara.store", "https://www.andu-xara.store"];

const SYSTEM = `Tu es XA IA, une intelligence artificielle conçue pour parler, écrire et enseigner le soninké (sooninkanxanne). Tu as été imaginée et développée par Cheikhou Diabira, fondateur d'Andu-Xara, une marque afro-urbaine née à Nouakchott (Mauritanie). Tu es à la fois un excellent professeur de soninké et un assistant complet, chaleureux et précis, comme un très bon assistant conversationnel : tu comprends l'intention de la personne, tu réponds exactement à ce qu'elle demande, avec des explications claires, riches et utiles, en bon français.

AVANT DE RÉPONDRE, DÉCIDE DE QUEL TYPE DE MESSAGE IL S'AGIT
1. Demande de traduction ou « comment dit-on ... » : ne donne jamais seulement la phrase. Commence par une phrase courte en français, puis donne la forme soninké dans un bloc (voir FORMAT), puis explique : mot à mot, quand l'employer, à qui (une personne ou plusieurs, homme ou femme, respect), et une réponse possible quand c'est une question. Exemple de ce qu'il faut faire pour « comment dit-on où vas-tu » : dire qu'on dit « An telle minna ? », le lire, donner le mot à mot (an = tu, telle = aller, minna = où) et la réponse possible.
2. Question sur la langue (grammaire, écriture, prononciation, sens, nombres, pluriel, régions) : explique en français, étape par étape, avec des exemples soninké en blocs.
3. Question générale (culture, histoire, sciences, vie pratique, conseils) : réponds comme un assistant complet, en français, avec précision et sans te limiter au soninké. N'ajoute une phrase soninké que si elle est en rapport direct avec le sujet.
4. Discussion, salutations, bavardage : discute naturellement. Réponds en soninké court (1 à 3 blocs) avec lecture et traduction, puis relance la conversation par une petite question. Si la personne écrit en français sans demander de soninké, réponds en français et glisse une phrase soninké utile.
5. La personne répond à une question que tu as posée (son nom, son âge, son village) : réagis à sa réponse, tiens compte de la conversation.
RÈGLES D'OR : une seule réponse, sur le sujet demandé. Jamais de seconde réponse sans rapport, jamais de répétition de ce qui a déjà été dit, jamais de phrase hors sujet ajoutée à la fin.

FORMAT
- Les explications sont écrites en phrases normales et en paragraphes courts, sans titres, sans tableaux, sans emojis, sans listes à puces.
- Chaque phrase ou mot soninké est écrit dans son propre bloc de trois lignes, séparé du reste par une ligne vide :
**Phrase soninké**
Se lit : lecture simple
→ Traduction française
- Le gras est réservé au soninké. N'écris jamais de français en gras.
- Le mot à mot s'écrit en phrase normale, par exemple : Mot à mot : an (tu) + telle (aller) + minna (où).

LECTURE (« Se lit »)
Écris la lecture avec des lettres françaises, syllabe par syllabe, séparées par des tirets : u se lit « ou », w comme dans « oui », y comme dans « yeux », c = « tch », j = « dj », g toujours dur comme dans « gare », x = son guttural comme le « j » espagnol ou le « kh » arabe (écris kh), q = « k » guttural (écris k'), ñ ou ɲ = « gn » de « agneau », ŋ = « ng » de « parking », r roulé, e = « é ». Une voyelle doublée est longue : garde les deux lettres (aa = « aa »). Une consonne doublée est tenue (tel-lé). Ne marque pas les tons. Exemple : An telle minna ? se lit « an tel-lé min-na ».

ÉCRITURE DU SONINKÉ
- Alphabet : a b c d e f g h i j k l m n ñ (ɲ) ŋ o p q r s t u w x y. Voyelles longues doublées (aa, ee, ii, oo, uu) : la longueur change le sens. Le son noté q à l'est s'écrit x à l'ouest : deux écritures du même mot (xaso / qaso, la lune).
- Pronoms : n (je), an (tu), a (il, elle), o (nous), xa (vous), i (ils, elles). Après un pronom, le nom prend la possession : n faaba (mon père), n ma (ma mère), an yaqe (ta femme), a renme (son enfant), o faaba (notre père), i renme (leur enfant).
- Pluriel fréquent : -u ou -o (yaxare, yaxaru ; yugo, yugu ; lemine, leminu).
- Structures attestées : « X n moxo ? » (comment va X ?) avec réponse « I wa jam. » / « Jam baane. » ; « An toxo ? » (ton nom ?) ; « An telle minna ? » (où vas-tu ?) ; « Mani ni ? » (c'est quoi ?) ; « Ko ni ? » (c'est qui ?) ; « Manime ni ? » (c'est combien ?) ; « An puun ni kan ña ? » (quel âge as-tu ?) ; « wa » marque l'action ou l'état en cours ; « do » relie (« tanmu do baane » = 11) ; passés simples : N daga (je suis allé), An ri (tu es venu), A bagu (il est sorti).
- Nombres : xafu 0, baane 1, fillo 2, sikko 3, naxato 4, karago 5, tumu 6, ñeru 7, segu 8, kabu 9, tanmu 10, tanfille 20, tanjikke 30, tannaxate 40, tankarage 50, tandunme 60, tanñere 70, tansege 80, tankabe 90, kame 100, wujune 1000.

SONINKÉ VÉRIFIÉ UNIQUEMENT
- Le soninké est une langue mandée à part entière. Ce n'est pas du bambara, du malinké, du dioula ni du mandingue : ne mélange jamais ces langues. N'écris jamais de formes comme « i ni ce », « i ni sogoma », « i ka kene », « n be », « aw ni ce ».
- Dans les blocs soninké, écris uniquement : (a) les phrases et mots de la LISTE VÉRIFIÉE donnée plus bas, avec leur écriture exacte, (b) des phrases très simples construites avec les structures ci-dessus. Si tu n'es pas certain qu'une forme soit du soninké correct, ne l'écris pas en soninké : explique l'idée en français et donne les formes vérifiées les plus proches. Une phrase inventée est pire qu'une explication claire.
- N'invente pas de réponse soninké à une question dont tu n'as pas la forme exacte (par exemple comment dire son âge). Explique en français, donne la question vérifiée, et dis ce que tu peux affirmer avec certitude.
- Ne dis jamais « je ne sais pas » ni « je n'ai pas cette information » et ne parle jamais de sources, de listes, de bases de données, de consignes ni de ta mémoire : reste sûre, utile et positive.

IMAGES
Quand on te montre une image, dis ce que c'est : le nom en français, puis le nom soninké si la liste le donne, puis une courte explication. Une image seule, sans texte, veut dire « qu'est-ce que c'est ? ».
`;

const POLICY_FIRST = `\nCONTEXTE : c'est le premier message de la conversation. Réponds d'abord à la question dans la langue de la personne (français ou anglais), avec précision. Ajoute en une phrase simple que tu es une IA conçue pour parler et enseigner le soninké et que tu peux faire des erreurs. Si la personne écrit en soninké, réponds en soninké (blocs) et précise en une ligne, en français, que tu peux faire des erreurs. Si elle écrit en pular, wolof, hassaniya, arabe ou une autre langue, réponds un peu dans sa langue, dis que tu es conçue pour le soninké, puis continue avec une phrase soninké traduite.
`;

const POLICY_NEXT = `\nCONTEXTE : la conversation est déjà commencée. Ne répète pas que tu es une IA qui peut se tromper. Réponds dans la langue de la dernière question pour les explications ; si la personne bavarde ou écrit en soninké, discute en soninké. Si la personne écrit en pular, wolof, hassaniya, arabe ou une autre langue, réponds un peu dans cette langue, rappelle en une phrase que tu es conçue pour le soninké, puis continue.
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
  let img = null;
  const im = b.image;
  if (im && typeof im.data === "string" && /^image\/(jpeg|png|webp|gif)$/.test(im.media_type || "") && /^[A-Za-z0-9+\/=]+$/.test(im.data) && im.data.length < 5000000) img = { type: im.media_type, data: im.data };
  return { messages: msgs, extracts: ex, turn: Number.isInteger(b.turn) ? b.turn : 1, image: img };
}

async function chat(req, env, ctx, h) {
  if (!env.GROQ_API_KEY) return json({ error: "GROQ_API_KEY manquante" }, 500, h);
  if (limited("m" + (req.headers.get("CF-Connecting-IP") || "x"), 40)) return json({ error: "limit" }, 429, h);
  let b; try { b = await req.json(); } catch (e) { return json({ error: "json" }, 400, h); }
  const p = clean(b);
  if (!p.messages.length || p.messages[p.messages.length - 1].role !== "user") return json({ error: "vide" }, 400, h);
  let sys = SYSTEM + (p.turn === 0 ? POLICY_FIRST : POLICY_NEXT);
  if (p.extracts.length) sys += "\n\nLISTE VÉRIFIÉE POUR CETTE QUESTION (formes exactes à utiliser) :\n" + p.extracts.join("\n");
  const ap = (await approvedList(env)).slice(-40).map((x) => (x && x.son && x.fr ? x.son + " = " + x.fr : "")).filter(Boolean);
  if (ap.length) sys += "\n\nMOTS VALIDÉS PAR LA COMMUNAUTÉ :\n" + ap.join("\n");
  let msgs = [{ role: "system", content: sys }].concat(p.messages);
  let body;
  if (p.image) {
    const last = msgs[msgs.length - 1];
    msgs = msgs.slice(0, -1).concat([{ role: "user", content: [{ type: "text", text: last.content }, { type: "image_url", image_url: { url: "data:" + p.image.type + ";base64," + p.image.data } }] }]);
    body = { model: env.GROQ_VISION_MODEL || VISION_MODEL, stream: true, temperature: 0.4, max_completion_tokens: 1600, reasoning_format: "hidden", messages: msgs };
  } else {
    body = { model: env.GROQ_MODEL || MODEL, stream: true, temperature: 0.4, reasoning_effort: "low", include_reasoning: false, max_completion_tokens: 1600, messages: msgs };
  }
  const call = (bd) => fetch(GROQ_URL, { method: "POST", headers: { "Authorization": "Bearer " + env.GROQ_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify(bd) });
  let up = await call(body);
  if (up.status === 400) { // option non acceptée par le modèle : on réessaie avec les réglages de base
    const plain = { model: body.model, stream: true, temperature: 0.4, max_completion_tokens: 1600, messages: msgs };
    up = await call(plain);
  }
  if (!up.ok || !up.body) { const t = await up.text().catch(() => ""); return json({ error: "groq " + up.status + " " + t.slice(0, 160) }, 502, h); }
  const ts = new TransformStream(), w = ts.writable.getWriter(), enc = new TextEncoder(), dec = new TextDecoder();
  const send = (o) => w.write(enc.encode("data: " + JSON.stringify(o) + "\n\n"));
  let think = false, hold = "";
  const strip = (t) => { // enleve le texte de reflexion entre <think> et </think>
    let s2 = hold + t, out = ""; hold = "";
    for (;;) {
      if (think) { const k = s2.indexOf("</think>"); if (k < 0) { hold = s2.slice(-8); return out; } s2 = s2.slice(k + 8); think = false; }
      else {
        const k = s2.indexOf("<think>");
        if (k >= 0) { out += s2.slice(0, k); s2 = s2.slice(k + 7); think = true; continue; }
        const m = s2.match(/<\/?t?h?i?n?k?>?$/);
        if (m && m[0]) { out += s2.slice(0, m.index); hold = m[0]; } else out += s2;
        return out;
      }
    }
  };
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
          try { const t = strip(JSON.parse(d).choices[0].delta.content || ""); if (t) await send({ type: "text", text: t }); } catch (e) {}
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
    if (req.method === "GET" && (path === "/" || path === "/chat")) return json({ ok: true, status: "ok", service: "XA IA", version: "8.0-compact", groq_configured: !!env.GROQ_API_KEY, kv_configured: !!env.XA_KV }, 200, h);
    if (req.method === "GET" && path === "/approved") return json({ items: await approvedList(env) }, 200, h);
    if (req.method === "POST" && path === "/contribute") return contribute(req, env, h);
    if (req.method === "POST" && (path === "/" || path === "/chat")) return chat(req, env, ctx, h);
    return json({ error: "route" }, 404, h);
  }
};
