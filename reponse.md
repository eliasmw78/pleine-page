# Lab Projet Angular : Pleine Page

**Adresse GitHub Pages (Catalogue en ligne) :** https://eliasmw78.github.io/pleine-page/
**Adresse du dépôt GitHub (Code source) :** https://github.com/eliasmw78/pleine-page

---

## Réponses aux questions

**Q1. Le texte « Hello, pleine-page » vient de quelle ligne de app.ts ?**
Il provient de la propriété générée par défaut dans la classe `App` : `title = 'pleine-page';`. Cette valeur était ensuite affichée dans l'ancien HTML généré par le CLI via l'interpolation `{{ title }}`.

**Q2. Sous l'en-tête, la page est vide. Pourtant `<router-outlet />` est bien dans app.html. Ouvrez app.routes.ts : pourquoi rien ne s'affiche ?**
Rien ne s'affiche car le tableau `routes` dans le fichier `app.routes.ts` est actuellement vide (`[]`). Le routeur ne sait donc pas quel composant afficher pour l'adresse racine (`/`).

**Q3. Le texte « Hello, pleine-page » a disparu. Quel fichier le contenait ?**
Ce texte était contenu dans l'ancienne version du fichier `src/app/app.html`, qui a été intégralement remplacé à l'étape 2 par notre nouvel en-tête.

**Q4. Réponse de Q2 : qu'est-ce qui a changé dans app.routes.ts pour que le catalogue apparaisse à la place réservée ?**
Nous avons ajouté une configuration de route dans le tableau : `{ path: '', component: Catalogue }`. Le routeur sait désormais qu'il doit charger le composant `Catalogue` quand l'adresse est vide (la racine).

**Q5. Ajoutez un neuvième livre dans livres.ts sans toucher au HTML. Que se passe-t-il à l'écran, et pourquoi ? Retirez-le ensuite.**
Le neuvième livre apparaît instantanément à l'écran dans la liste. C'est parce que le fichier HTML utilise la boucle `@for` pour itérer dynamiquement sur les éléments du tableau `livres`. Si les données changent, l'affichage s'adapte tout seul sans avoir besoin de modifier le code HTML.

**Q6. Le compteur « 2 livre(s) » se met à jour sans que vous ayez écrit une ligne pour lui. Quelle déclaration de catalogue.ts s'en charge ?**
C'est la fonction `computed(...)` assignée à la variable `resultats`. Comme `resultats` est calculé en fonction du signal `filtre`, Angular met à jour automatiquement sa valeur et le HTML (via `resultats().length`) à chaque fois que l'utilisateur tape une lettre.

**Q7. Tapez FERRAND en majuscules. Le résultat est le même : quelle partie du code le permet ?**
C'est l'utilisation de la méthode `.toLowerCase()` dans la fonction `computed`. Le code convertit à la fois le nom de l'auteur du livre et la valeur tapée dans le champ en minuscules avant de les comparer (`l.auteur.toLowerCase().includes(this.filtre().toLowerCase())`).

**Q8. Retirez withComponentInputBinding() de app.config.ts et rechargez /livre/1000. Que voyez-vous dans la console du navigateur (F12) ? Remettez-le ensuite.**
Une erreur Angular (NG0302 / NG0950) apparaît dans la console indiquant qu'une entrée requise (`id`) n'a pas reçu de valeur. Sans `withComponentInputBinding`, le routeur ne transmet plus l'ID de l'URL au paramètre d'entrée (`input.required`) du composant.

**Q9. Quand seul le paramètre id change, Angular garde le même objet Fiche et lui donne la nouvelle valeur de id. Que devient alors ajoute, et pourquoi le bouton reste gris ?**
Avant la correction de l'étape 7, `ajoute` était un signal booléen basique initialisé à `false`. Une fois passé à `true` suite à un clic, il conserve cette valeur car le composant n'est pas détruit puis recréé (Angular recycle l'instance pour des raisons de performance). Le bouton reste donc sur l'état désactivé.

**Q10. Rechargez la page avec F5 sur ce même livre. Le bouton redevient bleu : expliquez pourquoi avec votre réponse à Q9.**
La touche F5 recharge entièrement la page et réinitialise toute l'application JavaScript en mémoire. Une toute nouvelle instance du composant `Fiche` est instanciée depuis zéro. Le signal `ajoute` reprend donc sa valeur de départ (`false`).

**Q11. Le panier est perdu au rechargement (F5). Où faudrait-il le garder pour qu'il survive ?**
Pour que les données du panier persistent après un rafraîchissement, il faudrait les sauvegarder dans le `localStorage` du navigateur web.

**Q12. Dans l'onglet Réseau (F12), quel code HTTP reçoit la page /pleine-page/livre/1003 ? Pourquoi la fiche s'affiche-t-elle malgré ce code ?**
Le navigateur reçoit une erreur HTTP 404 (Not Found). Cependant, GitHub Pages ne trouvant pas de fichier correspondant à cette route, il sert par défaut le fichier `404.html` (qui est une copie exacte de notre `index.html` générée à l'étape 8). Angular démarre alors sur cette page, le routeur lit l'URL et affiche le composant `Fiche` correctement.

**Q13. Cliquez sur « Catalogue » dans l'en-tête. Vers quelle adresse partez-vous, et quel réglage de l'étape 8 l'explique ?**
Le lien pointe virtuellement vers `/`, mais on atterrit sur `/pleine-page/`. Cela est dû au paramètre `--base-href /pleine-page/` passé lors du build de l'étape 8. Il ajoute la balise `<base href="/pleine-page/">` dans l'index, ce qui indique au navigateur et au routeur Angular que la racine du site commence à ce dossier, et non à la racine du domaine de GitHub.
