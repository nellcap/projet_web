
// vue pour le hall of fame dans le menu
Vue.createApp({
    data() {
        return {
            scores: [],         // tableau quo contient la liste des scores
            chargement: true    // indique si les scores chargent ou non
        }
    },
    mounted() {
        this.chargementScores();
    },
    methods: {
        chargementScores() {
            fetch('/api/scores')  // requete GET sur la route /api/scores 
                .then(response => response.json())
                // stocke le tableau de scores dans la variable scores definie dans data 
                .then(data => {
                    this.scores = data;
                })
                .catch(error => {
                    console.error('Erreur chargement scores:', error);
                })
                // indique que le chargement des scores est fini
                .finally(() => {
                    this.chargement = false;
                });
        },
        
        commencerJeu() {
            window.location.href = '/carte';
        }
    }
}).mount('#app');