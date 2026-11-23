# Relier XA IA à son serveur

Le serveur apporte à XA IA : les réponses complètes en soninké sur tous les sujets, la recherche sur le web, la recherche approfondie, la lecture d'image et la réception des mots proposés par la communauté.
Sans lui, XA IA répond seulement avec sa base locale (dictionnaire, thèmes, quiz).

Tout se fait depuis le navigateur, sans terminal.

## 1. Mettre le code sur Cloudflare

1. Va sur dash.cloudflare.com, « Workers & Pages ».
2. Ouvre ton worker existant `xa-ia-worker` (ou crée-en un avec ce nom), puis « Edit code ».
3. Efface tout, colle le contenu de `worker/xa-ia-worker.js`, clique « Deploy ».
4. L'adresse est du type `https://xa-ia-worker.TON-COMPTE.workers.dev`. Si elle diffère de celle écrite dans `xa-ia/config.js`, corrige `config.js`.

## 2. Ajouter les clés (Settings, Variables and secrets)

- `ANTHROPIC_API_KEY` (secret) : clé créée sur console.anthropic.com. Meilleure qualité, avec recherche web et lecture d'image.
- `GROQ_API_KEY` (secret, solution de secours) : utilisée seulement si `ANTHROPIC_API_KEY` est absente. Texte seulement.
- `ADMIN_TOKEN` (secret) : un mot de passe long de ton choix, pour la page `xa-ia-admin.html`.

Ne mets jamais une clé dans le code ni dans GitHub.

## 3. Stockage des mots proposés

1. Cloudflare, « Storage & Databases », « KV », « Create a namespace » : nomme-le `xa-ia`.
2. Dans le worker, « Settings », « Bindings », « Add », « KV namespace » : nom de variable `XA_KV`, namespace `xa-ia`. Enregistre.

## 4. Vérifier

- Ouvre l'adresse du worker dans le navigateur : tu dois voir `{"ok":true,"service":"xa-ia", ...}`.
- Sur le site, la page Assistant répond en soninké, le menu « + » permet la recherche web, la recherche approfondie et l'import d'image.
- Propose un mot sur la page Soutenir, puis ouvre `xa-ia-admin.html`, entre ton `ADMIN_TOKEN` et valide-le. XA IA l'utilise tout de suite.

## Coûts et protection

- Chaque réponse est facturée par Anthropic selon le modèle ; la recherche web coûte en plus. Fixe un plafond de dépense dans ta console.
- Le serveur limite chaque visiteur à 40 messages par 10 minutes et à 6 propositions de mots par 10 minutes.
- Pour réduire le coût de la recherche approfondie : variable `MODEL_DEEP` = `claude-sonnet-5-5`.

## Mettre à jour la base de soninké du serveur

La base vérifiée est copiée dans `xa-ia-worker.js`. Après tout changement de `xa-ia/corpus.json`, relance `python3 worker/build.py`, puis recolle le nouveau fichier dans Cloudflare.
