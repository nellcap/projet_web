<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Des macarons pour Macron</title>
    <link rel="stylesheet" href="/assets/style.css">
    <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
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
        <p> Ton rôle est de chercher tous les ingrédients nécessaires à la préparation de macarons à la framboise.</p>
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
                Rends-toi dans <b>la ferme </b> pour commencer l'aventure !
            </li>
        </ul>

    </div>
    <div class='classement'>
        <h3>
            Hall of fame
        </h3> 
        <div v-if="loading" class="loading">
            Chargement des scores...
        </div>
            
        <div v-else>
            <ul v-if="scores.length > 0" class="scores-list">
                <li v-for="(score, index) in scores" :key="index" class="score-item">
                    <span class="score-rank">#{{ index + 1 }}</span>
                    <span class="score-pseudo">{{ score.pseudo }}</span>
                    <span class="score-value">{{ score.score }} pts</span>
                </li>
            </ul>
            <p v-else class="no-scores">Aucun score pour le moment. Sois le premier !</p>
        </div>
    </div>

</div>
<div class="boitebouton">
    <button @click="startGame">C'est parti !</button>
</div>

 
</div>
</div>

</body>
</html>