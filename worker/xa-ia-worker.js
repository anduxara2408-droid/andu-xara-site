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

const VERIFIED = [
[
"N",
"Je"
],
[
"An",
"Tu"
],
[
"A",
"Il / Elle"
],
[
"O",
"Nous"
],
[
"Xa",
"Vous (pluriel)"
],
[
"I",
"Ils / Elles"
],
[
"Yaxare",
"Une femme"
],
[
"Yaxaru",
"Des femmes"
],
[
"Yugo",
"Un homme"
],
[
"Yugu",
"Des hommes"
],
[
"Xuso",
"Une fille"
],
[
"Xusu",
"Des filles"
],
[
"Murunte",
"Un garçon"
],
[
"Murunto",
"Des garçons"
],
[
"Lemine",
"Un enfant"
],
[
"Leminu",
"Des enfants"
],
[
"Ka-dunko",
"Une famille"
],
[
"Saaxe",
"Mère"
],
[
"Faabe",
"Père"
],
[
"Yaqqe",
"Épouse"
],
[
"Kiine",
"Mari"
],
[
"Gidan-yaxare",
"Sœur"
],
[
"Gidan-yugo",
"Frère"
],
[
"Suxuba",
"Matin"
],
[
"Kinsiga",
"Midi"
],
[
"Lelle",
"Après-midi"
],
[
"Wuro",
"Nuit"
],
[
"Suxuban-fo",
"Petit-déjeuner"
],
[
"Yaraxate",
"Déjeuner"
],
[
"Ñaxame",
"Dîner"
],
[
"Kiye",
"Jour"
],
[
"Koye",
"Semaine"
],
[
"Xaso",
"Mois"
],
[
"Siine",
"Année"
],
[
"Salaamu aleykum",
"Que la paix soit sur toi (à toute heure de la journée)"
],
[
"Aleykum salaam",
"Et sur toi aussi (réponse à la salutation)"
],
[
"An wuyi jam",
"Bonjour (le matin)"
],
[
"Lella",
"Bon après-midi"
],
[
"Sunka",
"Bonsoir"
],
[
"Xori an wa jam?",
"Es-tu en paix ?"
],
[
"Jam baane",
"Paix seulement"
],
[
"An moxo?",
"Comment vas-tu ?"
],
[
"Ma jam",
"Je vais bien"
],
[
"Ka-dunko n moxo?",
"Comment va la famille ?"
],
[
"I wa jam",
"Ils vont bien"
],
[
"Golle n moxo?",
"Comment va le travail ?"
],
[
"Jam duuro",
"Ça va bien"
],
[
"An do tanpiye n moxo?",
"Comment vas-tu avec la fatigue ?"
],
[
"Leminu n moxo?",
"Comment vont tes enfants ?"
],
[
"Bisimilla!",
"Bienvenue !"
],
[
"Nawaari",
"Merci !"
],
[
"Baane",
"Un (1)"
],
[
"Fillo",
"Deux (2)"
],
[
"Sikko",
"Trois (3)"
],
[
"Naxato",
"Quatre (4)"
],
[
"Karago",
"Cinq (5)"
],
[
"Tumu",
"Six (6)"
],
[
"Ñeru",
"Sept (7)"
],
[
"Segu",
"Huit (8)"
],
[
"Kabu",
"Neuf (9)"
],
[
"Tanmu",
"Dix (10)"
],
[
"Tanmu do baane",
"Onze (11)"
],
[
"Tanmu do fillo",
"Douze (12)"
],
[
"Tanmu do sikko",
"Treize (13)"
],
[
"Tanmu do naxato",
"Quatorze (14)"
],
[
"Tanmu do karago",
"Quinze (15)"
],
[
"Tanmu do tumu",
"Seize (16)"
],
[
"Tanmu do ñeru",
"Dix-sept (17)"
],
[
"Tanmu do segu",
"Dix-huit (18)"
],
[
"Tanmu do kabu",
"Dix-neuf (19)"
],
[
"Tanfille",
"Vingt (20)"
],
[
"Tabeli",
"Une table"
],
[
"Siisi",
"Une chaise"
],
[
"Follaqqe",
"Une porte"
],
[
"Palanteeri",
"Une fenêtre"
],
[
"Safandi fo",
"Un stylo"
],
[
"Kereyon",
"Un crayon"
],
[
"Kaye",
"Un cahier"
],
[
"Kitabe",
"Un livre"
],
[
"Sakkoosi",
"Un sac"
],
[
"Kere",
"De la craie"
],
[
"Tablo",
"Un tableau"
],
[
"Palaati",
"Une assiette"
],
[
"Kuddu",
"Une cuillère"
],
[
"Labo",
"Un couteau"
],
[
"Sellaade",
"Un balai"
],
[
"Saxu-raxe",
"Un lit"
],
[
"Bajjo",
"Une couverture"
],
[
"Derebu",
"Un drap"
],
[
"Leeso",
"Une natte"
],
[
"Yiraamu",
"Des vêtements"
],
[
"Simisi",
"Une chemise"
],
[
"Wuno",
"Un pantalon"
],
[
"Teppuni",
"Des chaussures"
],
[
"Mexensi",
"Un vélo"
],
[
"Yaaxan-duqqeru",
"Des lunettes"
],
[
"Ji",
"Eau"
],
[
"Attaaye",
"Thé"
],
[
"Kefe",
"Café"
],
[
"Xatti",
"Lait"
],
[
"Sukkara",
"Sucre"
],
[
"Sappe",
"Sel"
],
[
"Maaro",
"Riz"
],
[
"Ñexe",
"Poisson"
],
[
"Tiye",
"Viande"
],
[
"Xaran-ra",
"École"
],
[
"Kalaasi",
"Salle de classe"
],
[
"Jooxe",
"Toilettes"
],
[
"Waaño",
"Cuisine"
],
[
"Biire",
"Hangar (toit de paille sous lequel on s'assoit)"
],
[
"Ka",
"Maison"
],
[
"Konpe",
"Chambre"
],
[
"Tilliise",
"Tente"
],
[
"Dispenseeri",
"Dispensaire"
],
[
"Saxa",
"Marché"
],
[
"Butiki",
"Boutique"
],
[
"Biro",
"Bureau"
],
[
"Fanqqe",
"Rivière"
],
[
"Gede",
"Un puits"
],
[
"Ponpe",
"Pompe"
],
[
"Faara",
"Jardin"
],
[
"Te",
"Champ"
],
[
"Golliñan-raxe",
"Lieu de travail"
],
[
"Misiide",
"Mosquée"
],
[
"Banke",
"Banque"
],
[
"Garaasi",
"Gare routière"
],
[
"Kanda",
"Aéroport"
],
[
"Tineeni",
"Lundi"
],
[
"Talaata",
"Mardi"
],
[
"Araba",
"Mercredi"
],
[
"Alaxamisa",
"Jeudi"
],
[
"Al juma",
"Vendredi"
],
[
"Sibiti",
"Samedi"
],
[
"Alahadi",
"Dimanche"
],
[
"Koota su",
"Tous les jours"
],
[
"Suxuba su",
"Tous les matins"
],
[
"Lelle su",
"Tous les après-midi"
],
[
"Wuro su",
"Toutes les nuits"
],
[
"Tineeni su",
"Tous les lundis"
],
[
"Al juma su",
"Tous les vendredis"
],
[
"Koye su",
"Toutes les semaines"
],
[
"Xaso su",
"Tous les mois"
],
[
"Siine su",
"Toutes les années"
],
[
"N toxo n ni Souleymane",
"Je m'appelle Souleymane"
],
[
"N janmu n ni Sall",
"Mon nom de famille est Sall"
],
[
"An toxo?",
"Comment t'appelles-tu ?"
],
[
"An janmu?",
"Quel est ton nom de famille ?"
],
[
"N bakka Moritani n ya",
"Je viens de Mauritanie"
],
[
"N yaqqe n bakka Moritani n ya",
"Mon épouse vient de Mauritanie"
],
[
"An bakka minna?",
"D'où viens-tu ?"
],
[
"An yaqqe n bakka minna?",
"D'où vient ton épouse ?"
],
[
"A toxo n ni John",
"Il s'appelle John"
],
[
"A janmu n ni Hogan",
"Son nom de famille est Hogan"
],
[
"John feti Moritaninke",
"John n'est pas mauritanien"
],
[
"Amerikinke n ya ni",
"Il est d'Amérique"
],
[
"Amerikinke n ya ni an qa?",
"Es-tu d'Amérique ?"
],
[
"Ayi, Amerikinke feti in qa",
"Non, je ne suis pas d'Amérique"
],
[
"Moritaninke n ya ni an qa?",
"Es-tu de Mauritanie ?"
],
[
"Iyo, Moritaninke n ya ni in qa",
"Oui, je suis de Mauritanie"
],
[
"Xaranmoxe n ya ni in qa",
"Je suis enseignant(e)"
],
[
"N yaqqe n feti xaranmoxe",
"Mon épouse n'est pas enseignante"
],
[
"John ni wolonteeri n ya",
"John est volontaire"
],
[
"A yaqqe n feti wolonteeri",
"Son épouse n'est pas volontaire"
],
[
"John yaqqe n ni doktooru n ya",
"L'épouse de John est médecin"
],
[
"Hari na o koyi me!",
"Au revoir !"
],
[
"O na me wari jam!",
"À la prochaine !"
],
[
"Jam na kira",
"Bonne journée"
],
[
"Jam na wuyi",
"Bonne nuit"
],
[
"Hari na xeeri ro wuro n qa",
"Que nous passions une bonne nuit"
],
[
"Na jam dallandi",
"Reste en paix"
],
[
"Anmiina!",
"Amen !"
],
[
"O wa suxuba qa",
"On se voit le matin"
],
[
"O wa lelle qa",
"On se voit l'après-midi"
],
[
"O wa kinsiga qa",
"On se voit vers midi"
],
[
"O wa wuro qa",
"On se voit le soir"
],
[
"O wa xunbane",
"À demain"
],
[
"O n katta kaane",
"À bientôt / À plus tard"
],
[
"N tanpi",
"Je suis fatigué(e)"
],
[
"Xenqo n wa in qa",
"J'ai sommeil"
],
[
"Dulle n wa in qa",
"J'ai faim"
],
[
"Dulle nta in qa",
"Je n'ai pas faim"
],
[
"Daqqu n wa in qa",
"J'ai soif"
],
[
"Daqqu nta in qa",
"Je n'ai pas soif"
],
[
"A tewe n ya ni",
"Il fait chaud"
],
[
"A tewe fe",
"Il ne fait pas chaud"
],
[
"A mulle n ya ni",
"Il fait froid"
],
[
"A mulle fe",
"Il ne fait pas froid"
],
[
"Haqqe toxo",
"Excusez-moi"
],
[
"Haqqe nta an qa",
"Tu es excusé(e)"
],
[
"An telle minna?",
"Où vas-tu ?"
],
[
"N telle o ka n ya",
"Je rentre à la maison"
],
[
"N telle xaran-ra n ya",
"Je vais à l'école"
],
[
"John wa telle saxa",
"John va au marché"
],
[
"John wa telle butiki",
"Il va à la boutique"
],
[
"An wa Soninke n mukku?",
"Parles-tu soninké ?"
],
[
"Iyo, n wa Soninke n mukku fonne",
"Oui, je parle un peu soninké"
],
[
"John nta Soninke n mukku",
"John ne parle pas soninké"
],
[
"N nta Faranse n mulla",
"Je n'aime pas le français"
],
[
"N nta kefe mulla",
"Je n'aime pas le café"
],
[
"Jennifer wa Soninke n mulla",
"Jennifer aime le soninké"
],
[
"N xarana ya",
"J'étudie"
],
[
"N yigene ya",
"Je mange"
],
[
"N golliñana ya",
"Je travaille"
],
[
"A nta xarana",
"Il n'étudie pas"
],
[
"A nta yigene",
"Elle ne mange pas"
],
[
"I nta golliñana",
"Ils ne travaillent pas"
],
[
"N wa xenqene fonne",
"Je dors un peu"
],
[
"N nta golliñana saasa",
"Je ne travaille pas maintenant"
],
[
"N wa a mulla in nan tuuma",
"Je veux me reposer"
],
[
"toxo [tóxò]",
"Nom individuel"
],
[
"janmu [jànmû]",
"Nom de famille"
],
[
"yaxare [yàxàrê]",
"Femme"
],
[
"yugo [yúgò]",
"Homme (vir)"
],
[
"sere [sèrê]",
"Homme (homo)"
],
[
"lemine [lémínè]",
"Enfant"
],
[
"haabe [hàabê]",
"Père"
],
[
"daaba [dáabà]",
"Animal"
],
[
"gunduho [gùndùhô]",
"Animal sauvage"
],
[
"yelinŋe [yèlínŋè]",
"Oiseau"
],
[
"wulle [wùllê]",
"Chien"
],
[
"duuñe [dúuñè]",
"Pou"
],
[
"samaqqe [sámáqqè]",
"Serpent"
],
[
"quudo [qúudò]",
"Ver"
],
[
"yitte [yíttè]",
"Arbre"
],
[
"diga [dígà]",
"Forêt"
],
[
"gunne [gùnnê]",
"Brousse"
],
[
"guma [gùmâ]",
"Bâton"
],
[
"yittirenme [yíttírénmè]",
"Fruit"
],
[
"hunce [húncè]",
"Graine"
],
[
"dare [dárè]",
"Feuille"
],
[
"ñiime [ñìimê]",
"Racine"
],
[
"korome [kórómè]",
"Écorce"
],
[
"huuge [hùugê]",
"Fleur"
],
[
"sokke [sókkè]",
"Herbe"
],
[
"kacce [káccè]",
"Corde"
],
[
"hate [hàtê]",
"Peau"
],
[
"hore [hòrê]",
"Sang"
],
[
"qotte [qóttè]",
"Os"
],
[
"katoye [kátóyè]",
"Graisse"
],
[
"yelle [yèllê]",
"Œuf"
],
[
"benne [bénnè]",
"Corne"
],
[
"qoqqe [qóqqè]",
"Queue"
],
[
"yinte [yìntê]",
"Plume"
],
[
"yinte [yìntê]",
"Cheveu, poil"
],
[
"yinme [yínmè]",
"Tête"
],
[
"taro [tárò]",
"Oreille"
],
[
"yaaxe [yáaxè]",
"Œil"
],
[
"nuxunne [núxúnnè]",
"Nez"
],
[
"laqqe [láqqè]",
"Bouche"
],
[
"kanbe [kànbê]",
"Dent"
],
[
"neene [néenè]",
"Langue (organe)"
],
[
"segeñe [ségéñè]",
"Ongle"
],
[
"ta [tâ]",
"Pied"
],
[
"ta [tâ]",
"Jambe"
],
[
"qurungo [qúrúngò]",
"Genou"
],
[
"kitte [kíttè]",
"Main"
],
[
"kanpe [kánpè]",
"Aile"
],
[
"noxo [nòxô]",
"Ventre"
],
[
"nuxullenme [nùxùllénmè]",
"Intestins"
],
[
"qanne [qánnè]",
"Cou"
],
[
"qoodo [qóodò]",
"Dos"
],
[
"gijinme [gíjínmè]",
"Poitrine"
],
[
"sondonme [sòndònmê]",
"Cœur"
],
[
"butte [búttè]",
"Foie"
],
[
"kiye [kìyê]",
"Soleil"
],
[
"qaso [qásò]",
"Lune"
],
[
"saane [sàanê]",
"Étoile"
],
[
"kanme [kànmê]",
"Pluie"
],
[
"lanbe [lànbê]",
"Rivière"
],
[
"hanŋe [hànŋê]",
"Fleuve"
],
[
"dala [dálà]",
"Lac"
],
[
"geeji [gèejî]",
"Mer"
],
[
"gide [gídè]",
"Pierre"
],
[
"seyenŋe [sèyénŋè]",
"Sable"
],
[
"qobe [qòbê]",
"Poussière"
],
[
"ŋuñe [ŋùñê]",
"Terre (sol)"
],
[
"qaba, tabulle [qàbâ, tábúllè]",
"Nuage"
],
[
"minaaxe [mínáaxè]",
"Brouillard"
],
[
"kanme [kànmê]",
"Ciel"
],
[
"hanke [hànkê]",
"Vent"
],
[
"tiide [tìidê]",
"Fumée"
],
[
"yinbe [yìnbê]",
"Feu"
],
[
"qame [qàmê]",
"Cendre"
],
[
"kille [kìllê]",
"Route"
],
[
"gide [gídè]",
"Montagne"
],
[
"An moxo ? [Án mòxô ?]",
"Bonjour, comment ça va ? (à une personne)"
],
[
"Qa moxo ? [Qá mòxô ?]",
"Bonjour, comment ça va ? (à plusieurs personnes)"
],
[
"An toxo ? [Án tòxô ?]",
"Quel est ton prénom ?"
],
[
"N toxo Muusa [Ń tòxô Múusá]",
"Mon prénom est Moussa"
],
[
"An janmu ? [Án jànmû ?]",
"Quel est ton nom de famille ?"
],
[
"N janmu Jagana [Ń jànmû Jágáná]",
"Mon nom de famille est Diagana"
],
[
"An puun ni kan ña ? [Án pùún nì kán ñà ?]",
"Quel âge as-tu ?"
],
[
"An puun ni manime yi ? [Án pùún nì mànímè yí ?]",
"Tu as combien d'années ?"
],
[
"An li Haranci kan ciine yi ? [Án lí Hàráncì kân cìinè yí ?]",
"En quelle année es-tu arrivé en France ?"
],
[
"Axa kundan nan laato yere yi ba ? [Áxá kùndán nàn láató yèré yì bá ?]",
"Tu habites loin d'ici ?"
],
[
"An la wa sooninkanqannen cahana ba ? [Án là wá sòonìnkanqánnèn cáhàná bà ?]",
"Est-ce que tu sais écrire le soninké ?"
],
[
"An la wa an toxon cahana ba ? [Án là wá án tòxôn cáhàná bà ?]",
"Est-ce que tu sais écrire ton nom ?"
],
[
"An kayen koyi in ŋa ! [Án kàyén kòyí ín ŋà !]",
"Montre-moi ton cahier !"
],
[
"An kitaaben qa ? [Án kìtàabén qà ?]",
"Où est ton livre ?"
],
[
"An kitaaben ŋa an maxa ba ? [Án kìtàabên ŋá án màxá bà ?]",
"Est-ce que tu as ton livre avec toi ?"
],
[
"Haranci linŋo an da ba ? [Hàráncì línŋó án dà bá ?]",
"Es-tu content d'être en France ?"
],
[
"Kanme texe",
"Il a plu"
],
[
"Dundo giri",
"La tempête a commencé"
],
[
"Mulle ŋa’di buru",
"Il fait très froid"
],
[
"O wa tele gunne xunbene",
"Demain, nous irons aux champs"
],
[
"Bakeri ta golle munda",
"Bakeri n'aime pas travailler"
],
[
"Muusa wa goridini",
"Moussa pêche à la ligne"
],
[
"N nta a tu",
"Je ne sais pas"
],
[
"Kaagume",
"Chef de famille"
],
[
"N faaba",
"Mon père"
],
[
"N ma",
"Ma mère"
],
[
"Renme",
"Enfant (de quelqu’un)"
],
[
"Renyugo",
"Fils"
],
[
"Renyaxare",
"Fille (enfant)"
],
[
"Gidanyugo",
"Grand frère"
],
[
"Gidanyaxare",
"Grande sœur"
],
[
"Xoxone",
"Petit frère, petite sœur"
],
[
"Kisima",
"Grand-père"
],
[
"Maama",
"Grand-mère"
],
[
"Neega",
"Oncle (côté de la mère)"
],
[
"Kaawu",
"Oncle (côté de la mère)"
],
[
"Baayi",
"Tante (sœur du père)"
],
[
"Maaxoore",
"Tante (grande sœur de la mère)"
],
[
"Maarenme",
"Parent"
],
[
"Kallungoora",
"Cousin à plaisanterie"
],
[
"Menjanŋe",
"Ami, amie"
],
[
"Lemine",
"Petit enfant"
],
[
"Kaagunyaxare",
"Épouse"
],
[
"In",
"Je"
],
[
"Axa",
"Vous (pluriel)"
],
[
"N daga.",
"Je suis allé."
],
[
"An ri.",
"Tu es venu."
],
[
"A bagu.",
"Il est sorti."
],
[
"O daga.",
"Nous sommes allés."
],
[
"Axa ri.",
"Vous êtes venus."
],
[
"I bagu.",
"Ils sont sortis."
],
[
"An yaqe.",
"Ta femme."
],
[
"A renme.",
"Son enfant."
],
[
"O faaba.",
"Notre père."
],
[
"Axa ma.",
"Votre mère."
],
[
"I renme.",
"Leur enfant."
],
[
"Xa nawari !",
"Salut à vous tous !"
],
[
"Nawaari.",
"Bonjour (salutation de rencontre)."
],
[
"An xubaare.",
"Salutation en retour."
],
[
"An wuyi jamu ?",
"As-tu passé une bonne nuit ?"
],
[
"Wuyijamu sire.",
"Oui, j’ai bien dormi."
],
[
"Xori toora ma wuyi ?",
"As-tu bien dormi ?"
],
[
"Ma jamu baane.",
"Je vais très bien."
],
[
"Ma jamu.",
"Je vais bien."
],
[
"An faten moxo ?",
"Comment va ta santé ?"
],
[
"Anba",
"Merci (dit à un homme)"
],
[
"Nba",
"Merci (dit à un homme)"
],
[
"Marahaba",
"Merci (dit à un homme)"
],
[
"Yawuri",
"Merci (dit à une femme)"
],
[
"Beeta",
"Bonjour (le matin, vers 10 h)"
],
[
"Xa lella",
"Bon après-midi"
],
[
"Xa sunka",
"Bonsoir"
],
[
"Anba. Bisimilla !",
"Merci. Au nom de Dieu !"
],
[
"Sa",
"Allez-y, je vous en prie (formule d’accueil)"
],
[
"Lenki nan faso.",
"Aujourd’hui ça va mieux."
],
[
"An faaba do an ma xa ?",
"Et ton père et ta mère ?"
],
[
"Toora su nt’i ya.",
"Ils vont bien."
],
[
"Kaadunkon moxo ?",
"Comment va ta famille ?"
],
[
"Ma jamu. Alla nan nawaari.",
"Ils vont bien. Dieu merci."
],
[
"N daga.",
"Je m’en vais."
],
[
"Katta kaane.",
"À bientôt."
],
[
"Katti kaane.",
"À bientôt."
],
[
"Tenenŋe",
"Lundi"
],
[
"Tarata",
"Mardi"
],
[
"Arijuma",
"Vendredi"
],
[
"Juma",
"Vendredi"
],
[
"Bita",
"Jour"
],
[
"Koota",
"Jour"
],
[
"Soxuba",
"Matin"
],
[
"Beetaye",
"Matin (entre 9 h et 11 h)"
],
[
"Kiye",
"Midi"
],
[
"Kira",
"Midi"
],
[
"Nelle",
"Après-midi"
],
[
"Futuro",
"Crépuscule"
],
[
"Huturo",
"Crépuscule"
],
[
"Wuro",
"Soir, nuit"
],
[
"Sanwiyenxaso",
"Janvier"
],
[
"Fewiriyenxaso",
"Février"
],
[
"Marisinxaso",
"Mars"
],
[
"Awirilinxaso",
"Avril"
],
[
"Menxaso",
"Mai"
],
[
"Suwenxaso",
"Juin"
],
[
"Suluyenxaso",
"Juillet"
],
[
"Utunxaso",
"Août"
],
[
"Seputanburunxaso",
"Septembre"
],
[
"Okutoburunxaso",
"Octobre"
],
[
"Nowanburunxaso",
"Novembre"
],
[
"Desanburunxaso",
"Décembre"
],
[
"Sunxaso",
"Ramadan"
],
[
"Yinkolla",
"Tête"
],
[
"Yinte",
"Cheveux"
],
[
"Teŋe",
"Front"
],
[
"Yaaxe",
"Œil, yeux"
],
[
"Yaaxo",
"Œil, yeux"
],
[
"Toro",
"Oreille"
],
[
"Toru",
"Oreille"
],
[
"Xume",
"Joue"
],
[
"Fentelle",
"Joue"
],
[
"Raqe",
"Bouche"
],
[
"Laqe",
"Bouche"
],
[
"Kanbe",
"Dent, dents"
],
[
"Kanbo",
"Dent, dents"
],
[
"Kanbu",
"Dent, dents"
],
[
"Gonme",
"Estomac"
],
[
"Sondome",
"Cœur"
],
[
"Furutu",
"Poumon"
],
[
"Faradinlenme",
"Rein"
],
[
"Tinkanbe",
"Fesses"
],
[
"Toge",
"Cuisse"
],
[
"Ta",
"Jambe, pied"
],
[
"Tandoronme",
"Orteil"
],
[
"Neene",
"Langue"
],
[
"Sinqe",
"Menton"
],
[
"Kunke",
"Épaule"
],
[
"Kitte",
"Main, bras"
],
[
"Kitti nooge",
"Main gauche"
],
[
"Kitti teye",
"Main droite"
],
[
"Doronme",
"Doigt"
],
[
"Konbo",
"Sein"
],
[
"Yille",
"Mil"
],
[
"Tiga",
"Arachide"
],
[
"Molle",
"Haricot"
],
[
"Mollo",
"Haricot"
],
[
"Makka",
"Maïs"
],
[
"Jaxatanŋe",
"Gombo"
],
[
"Sangunme",
"Oseille"
],
[
"Sangume",
"Oseille"
],
[
"Saabali",
"Moringa"
],
[
"Sahe",
"Moringa"
],
[
"Saayisaayi",
"Moringa"
],
[
"Basalle",
"Oignon"
],
[
"Jaba",
"Oignon"
],
[
"Yigande",
"Nourriture"
],
[
"Maxafonji",
"Sauce"
],
[
"Moxonji",
"Sauce"
],
[
"Na",
"Vache"
],
[
"Sugo",
"Chèvre"
],
[
"Jaxe",
"Mouton"
],
[
"Si",
"Cheval"
],
[
"Fare",
"Âne"
],
[
"Hare",
"Âne"
],
[
"Ɲogome",
"Chameau"
],
[
"Muusine",
"Chat"
],
[
"Seliŋe",
"Poule"
],
[
"Wottoro",
"Charrette"
],
[
"Sareti",
"Charrette"
],
[
"Labo",
"Couteau"
],
[
"Tefu",
"Chaussure"
],
[
"Teppu",
"Chaussure"
],
[
"Doroke",
"Vêtement"
],
[
"Xaalisi",
"Argent"
],
[
"Gode",
"Argent"
],
[
"Xureye",
"Lumière"
],
[
"Xuraye",
"Lumière"
],
[
"Bite",
"Obscurité"
],
[
"Mara",
"Grenier"
],
[
"Kanme",
"Ciel, pluie"
],
[
"Ɲiiɲe",
"Terre"
],
[
"Ŋuɲe",
"Terre"
],
[
"Fanŋe",
"Fleuve"
],
[
"Fore",
"Sang"
],
[
"Kinŋu",
"Cuisine"
],
[
"Debe",
"Village"
],
[
"Kaara",
"Village"
],
[
"Jamaane",
"Pays"
],
[
"Gede",
"Puits"
],
[
"An toxo ?",
"Quel est ton nom ?"
],
[
"Ko ni ?",
"C’est qui ?"
],
[
"Mani ni ?",
"C’est quoi ?"
],
[
"Manime ni ?",
"C’est combien ?"
],
[
"An wa telle minna ?",
"Où vas-tu ?"
],
[
"Saxan na minna ?",
"Où est le marché ?"
],
[
"An w’in tu ba ?",
"Tu me connais ?"
],
[
"Yaqen w’an maxa ba ?",
"As-tu une femme ?"
],
[
"Kan bire ?",
"Quand ?"
],
[
"Xafu",
"Zéro (0)"
],
[
"Tunmu",
"Six (6)"
],
[
"Tanpille",
"Vingt (20)"
],
[
"Tanfille do baane",
"Vingt et un (21)"
],
[
"Tanfille do fillo",
"Vingt-deux (22)"
],
[
"Tanfille do sikko",
"Vingt-trois (23)"
],
[
"Tanjikke",
"Trente (30)"
],
[
"Tannaxate",
"Quarante (40)"
],
[
"Tankarage",
"Cinquante (50)"
],
[
"Tandunme",
"Soixante (60)"
],
[
"Tanɲere",
"Soixante-dix (70)"
],
[
"Tansege",
"Quatre-vingts (80)"
],
[
"Tankabe",
"Quatre-vingt-dix (90)"
],
[
"Kame",
"Cent (100)"
],
[
"Kamo filli",
"Deux cents (200)"
],
[
"Kamo sikki",
"Trois cents (300)"
],
[
"Kamo naxati",
"Quatre cents (400)"
],
[
"Kamo karagi",
"Cinq cents (500)"
],
[
"Wujune",
"Mille (1000)"
],
[
"Wujunu filli",
"Deux mille (2000)"
],
[
"Wujunu tanmi",
"Dix mille (10 000)"
],
[
"Godo baane",
"Cinq francs (CFA)"
],
[
"Godo tanmi",
"Cinquante francs"
],
[
"Tanfille gode",
"Cent francs"
],
[
"Kame gode",
"Cinq cents francs"
],
[
"Kamo filli gode",
"Mille francs"
],
[
"Wujune gode",
"Cinq mille francs"
]
];

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
  return { messages: alt, web: !!body.web, deep: !!body.deep, image, turn };
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
    model: env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    stream: true, max_tokens: 1400, temperature: 0.4,
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
  const url = useClaude ? (env.UPSTREAM_URL || 'https://api.anthropic.com/v1/messages')
                        : (env.GROQ_URL || 'https://api.groq.com/openai/v1/chat/completions');
  if (!useClaude) p.image = null; // le modèle de secours ne lit pas les images
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

    if (path === '/' && request.method === 'GET') {
      return json({ ok: true, service: 'xa-ia', model: env.ANTHROPIC_API_KEY ? 'claude' : (env.GROQ_API_KEY ? 'groq' : 'none'), contributions: !!env.XA_KV }, 200, cors);
    }
    if (path === '/approved' && request.method === 'GET') {
      const rows = await loadApproved(env);
      return json({ items: rows.map((r) => ({ son: r.son, fr: r.fr })) }, 200, { ...cors, 'Cache-Control': 'public, max-age=60' });
    }
    if (path === '/contribute' && request.method === 'POST') return contribute(request, env, cors);
    if (path.startsWith('/admin/')) return admin(request, env, cors, path);
    if (path === '/' && request.method === 'POST') return chat(request, env, ctx, cors);
    return json({ error: 'route' }, path === '/' ? 405 : 404, cors);
  },
};
