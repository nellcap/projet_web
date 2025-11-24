// vue pour le hall of fame dans le menu, contrôle les éléments de la div 'app'
Vue.createApp({
    data() {
        return {
            scores: [],         // tableau quo contient la liste des scores
            chargement: true    // booleen qui indique si les scores chargent ou non
        }
    },
    mounted() {
        this.chargementScores(); // chargement des scores dès l'arrivée sur la page du menu
    },
    methods: {
        chargementScores() {
            fetch('/api/scores')  // requete GET sur la route /api/scores 
                .then(response => response.json())
                // stocke le tableau de scores dans la variable scores definie dans data 
                .then(data => {
                    this.scores = data;
                })
                // affichage erreur
                .catch(error => {
                    console.error('Erreur chargement scores:', error);
                })
                // indique que le chargement des scores est fini
                .finally(() => {
                    this.chargement = false;
                });
        },
        // méthode qui emmène le joueur vers la route /carte pour commencer le jeu
        // quand on va appuyer sur le bouton 'c'est parti!'
        commencerJeu() {
            window.location.href = '/carte';
        },
        // méthode qui fait descendre la boîte de classement quand on appuie
        // sur la flèche en haut à gauche
        // ça incite le joueur à scroller vers le bas pour voir le top 10 en entier 
        scrollBas() {  
            // chercher l'élément html dont l'id est boiteScores
            const container = document.getElementById('boiteScores');
            if (container) {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
        
    }
}).mount('#app');