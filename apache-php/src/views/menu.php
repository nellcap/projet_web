<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Des macarons pour Macron</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<div id='app'>
    <h1>Des macarons pour Macron</h1>
    <h2 class='soustitre'>Un escape game créé par Nell Capelle et Clara Bouvier</h2>
<div class='grosseboite'>
    <div class='regles'>
        <h3>
            Règles de l'escape game
        </h3>
        <p>
            Notre cher président Emmanuel Macron a terriblement envie de délicieux macarons. Malheuresement, son chef pâtissier est malade et ne peut pas lui concocter ces délicieuses confiseries.
        </p>
        <p> Ton rôle est de trouver tous les ingrédients nécessaires à la préparation de macarons à la framboise.</p>
        <ul>
            <li>
                Ton terrain de jeu sera la <b>France métropolitaine</b>.
            </li>
            <li>
                Chaque objet trouvé te donnera un <b>indice</b> sur l'objet suivant à chercher sous forme de pop up texte. 
            </li>
            <li>
                Tu peux stocker des objets dans ton <b>inventaire</b> en cliquant sur ceux-ci.
            </li>
            <li>
                Certains objets nécessitent un <b>code</b> ou un <b>autre objet</b> que tu as récupéré antérieurement dans ton inventaire pour être dévérouillés.
            </li>
            <li>
                Rends-toi à <b>la ferme qui a produit le meilleur beurre agricole de 2025</b> pour commencer l'aventure !
            </li>
        </ul>

    </div>
    <div class='classement'>
        <div class="fleche-coin" @click="scrollBas">↓</div>
        <h3>
            Hall of fame
        </h3>
        <div class="scores-container" ref="scoresContainer" id="scoresContainer">
            <!-- si la variable chargement est true, on affiche un texte -->
            <div v-if="chargement" class="chargement">
                Chargement des scores...
            </div>
            <!-- si le chargement est fini, on affiche le top 10 des meilleurs scores avec le
            pseudo associé -->
            <div v-else>
                <!-- si la liste des scores est non vide, on liste les scores -->
                <ul v-if="scores.length > 0" class="liste_scores">
                    <li v-for="(score, index) in scores" :key="index" class='li_scores'>
                        <span class="rang_scores">#{{ index + 1 }}</span>
                        <span class="pseudo_scores">{{ score.pseudo }}</span>
                        <span class="valeur_scores">{{ score.score }} pts</span>
                    </li>
                </ul>
                <!-- sinon, on affiche un texte -->
                <p v-else >Personne n'a encore joué à notre jeu... </p>
            </div>
        </div>
    </div>

</div>
<div class="boitebouton">
    <button @click="commencerJeu" class='bouton'><b>C'est parti !</b></button>
</div>

 
</div>
</div>

<script src="/assets/menu.js"></script>

</body>
</html>