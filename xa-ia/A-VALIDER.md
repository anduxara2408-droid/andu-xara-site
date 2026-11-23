# XA IA — points à faire valider par un locuteur soninké

XA IA n'utilise que `corpus.json` (315 entrées : 209 des leçons Peace Corps Mauritanie, 106 du lexique CNRS).
Les fichiers suivants du dépôt n'ont PAS été repris, car ils se contredisent ou n'ont pas de source :
`dictionnaire_base.json`, `final-dictionary.json`, `andu-xara-soninke-CORRECT.txt`, `soninke_dataset.csv`,
`vocabulaire_suite.json`, ancienne config XA IA.

## Contradictions trouvées dans les anciens fichiers
| Mot | Ce que disent les anciens fichiers | Source retenue |
|---|---|---|
| aaxi | « frère » (dictionnaire_base) / « cher, coûteux » (ancienne config) | non repris : aucune source ne le confirme |
| gidan-yugo / gidan-yaxare | frère / sœur (Peace Corps) | repris |
| lella | « bonsoir » (dictionnaire_base) / « bon après-midi » (Peace Corps) | « bon après-midi » |
| sunka | « bonsoir » (Peace Corps) | repris |
| beeta, kira, wuyijamu, diom | utilisés dans les anciens fichiers, absents des leçons Peace Corps et du CNRS | non repris |
| bisimilla | « de rien » (ancienne config) / « bienvenue » (Peace Corps) | « bienvenue » |
| nawaari | « bienvenue » (dictionnaire_base) / « merci » (Peace Corps) | « merci » |
| hari na o koyi me | « au revoir » | repris (Peace Corps) |

## Points à vérifier dans les sources retenues
- `N wa telle biro` : le document traduit « Je ne vais pas au bureau », mais la forme est affirmative (comme « John wa telle saxa » = John va au marché). NON reprise tant qu'elle n'est pas validée.
- `A bakka minna?` : le document donne la même phrase pour « D'où vient-il ? » et « D'où vient-elle ? ». NON reprise tant qu'elle n'est pas validée.
- Écriture : le Peace Corps écrit sans tons (qa, xa), le CNRS écrit avec les tons et ajoute `q` pour certaines consonnes. XA IA affiche la forme Peace Corps et montre la forme avec tons en italique quand elle existe.
- Certaines entrées CNRS ont une orthographe qui diffère de celle du Peace Corps (ex. « père » : faabe / haabe). Les deux sont affichées avec leur source.

## Comment ajouter du soninké vérifié
1. Faire valider le mot ou la phrase par un locuteur.
2. Ajouter une ligne dans `xa-ia/corpus.json` : `{"id":"...","son":"...","fr":"...","cat":"...","kind":"mot|phrase","src":"..."}`
3. Déclarer la source dans `sources` si elle est nouvelle.

## Citations et proverbes
- `xa-ia/citations.json` : citations affichées sur le site. Toutes viennent de phrases présentes dans `corpus.json`.
- `xa-ia/a-valider-proverbes.json` : proverbes de l'ancien dépôt dont aucune source n'est vérifiable. Ils ne sont pas affichés. Après validation par un locuteur, ajoute-les à `citations.json`.

## Le serveur de XA IA
Le serveur (dossier `worker/`) donne à XA IA la liste vérifiée comme seule référence pour le soninké. Pour qu'elle écrive de plus longues phrases, il faut agrandir cette liste avec des phrases validées : c'est le seul moyen fiable d'avancer.
