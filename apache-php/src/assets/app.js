Vue.createApp({
  data() {
    return {
      inventory: [],
      chronometre: {
        secondes: 0,
        minutes: 0,
        heures: 0,
        intervalId: null,
        estEnCours: false
      },
      chronometreAffichage: '00:00:00',
      etape: 2,
      recupererable: false,
      map: null,
      objets: [],
      pop_up:[],
      heatmapLayer: L.tileLayer.wms('http://localhost:8080/geoserver/projet_nell_clara/wms', {
        layers: 'projet_nell_clara:heatmap',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: 'GeoServer',
        crs: L.CRS.EPSG4326,
        tiled: true
      }),
      heatmapVisible: false,
      pseudo: null,
      score: 0,
    };
  },

  mounted() {
    this.map = L.map('map').setView([48.8708852, 2.3170585], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.demarrer_chronometre();

    fetch("api/objets")
      .then(r => r.json())
      .then(objets => {
      this.objets = objets;
      this.initialisation_carte();
      });

  },

  methods: {
    // Gestion chronomètre
    demarrer_chronometre() {
      if (!this.chronometre.estEnCours) {
        this.chronometre.estEnCours = true;
        this.chronometre.intervalId = setInterval(() => {
          this.chronometre.secondes++;
            
          if (this.chronometre.secondes >= 60) {
            this.chronometre.secondes = 0;
            this.chronometre.minutes++;
          }
            
          if (this.chronometre.minutes >= 60) {
            this.chronometre.minutes = 0;
            this.chronometre.heures++;
          }
            
          this.afficher_chronometre();
        }, 1000); // Met à jour toutes les secondes
      }
    },

    afficher_chronometre() {
      var h = this.chronometre.heures < 10 ? '0' + this.chronometre.heures : this.chronometre.heures;
      var m = this.chronometre.minutes < 10 ? '0' + this.chronometre.minutes : this.chronometre.minutes;
      var s = this.chronometre.secondes < 10 ? '0' + this.chronometre.secondes : this.chronometre.secondes;
        
      this.chronometreAffichage = h + ':' + m + ':' + s;
    },

    stopper_chronometre() {},

    // Gestion carte de chaleur
    toggleHeatmap() {
        if (this.heatmapVisible) {
            this.map.removeLayer(this.heatmapLayer);
            this.heatmapVisible = false;
        } else {
            this.heatmapLayer.addTo(this.map);
            this.heatmapVisible = true;
        }
    },
    // Gestion inventaire

    ajouter_inventaire(nom_objet, icone) {
      var existe = this.inventory.some(item => item.nom === nom_objet);
      if (!existe) {
        this.inventory.push({ nom: nom_objet, image: icone });
        this.etape = this.etape + 1
      }
    },

    retirer_inventaire(nom_objet) {    
      this.inventory = this.inventory.filter(item => item.nom !== nom_objet );
    },

    // Gestion pop-up
    initialisation_carte () {
      for (let obj of this.objets) {
        var Image = L.icon({
          iconUrl: obj.url_image,
          iconSize: [48, 48],  
        });
        var pop_up = L.marker([parseFloat(obj.lat),parseFloat(obj.long)], { icon: Image});
        this.pop_up.push({ marqueur:pop_up, objet: obj,visible: false});
      }
      this.apparition_pop_up();
    },

    creation_pop_up (objet) {
      var Image = L.icon({
        iconUrl: objet.url_image,
        iconSize: [48, 48],  
      });
      var pop_up = L.marker([parseFloat(objet.lat),parseFloat(objet.long)], { icon: Image});
      this.pop_up.push({ marqueur:pop_up, objet: objet,visible: false,ramasse: false});
    },

    apparition_pop_up() {
      this.map.on('zoomend moveend', () => {      
        for (let pop of this.pop_up) {
          if (pop.ramasse) {
            continue;
          }
          var zoom = this.map.getZoom();
          var centre = this.map.getCenter();
          var lat =parseFloat(pop.objet.lat);
          var lgn = parseFloat(pop.objet.long);
          var tolerance = 0.05;          

          var inTarget = Math.abs(centre.lat - lat) <= tolerance &&
                      Math.abs(centre.lng - lgn) <= tolerance;

          if (zoom >= parseFloat(pop.objet.minzoomvisible) && inTarget && !(pop.objet.id == 8 && this.etape!=9)) {
            if (pop.visible == false) {
              pop.marqueur.addTo(this.map);
              pop.marqueur.bindPopup(pop.objet.messagedebut).openPopup();
              pop.visible = true;
              this.ajouter_objet_inventaire(pop)
            }
          } else {
            if (pop.visible) {
              this.map.removeLayer(pop.marqueur);
              pop.visible = false;
            }
          }
        };
      });
    },

    ajouter_objet_inventaire(pop) {
      pop.marqueur.off('click');
      pop.marqueur.on('click', () => {
        if (pop.objet.typeobjet == 'final') {
          this.fin()
        } else if (pop.objet.typeobjet == 'obj_bloque_par_code') {
          this.verif_reponse(pop)
        } else if (pop.objet.typeobjet == 'obj_bloque_par_objet') {
          this.debloquer_objet(pop)
        } else {
          pop.marqueur.bindPopup(pop.objet.messagefin).openPopup();
          pop.ramasse = true;
          pop.visible = false;
          setTimeout(() => {
            this.map.removeLayer(pop.marqueur);
            this.objets = this.objets.filter(objet => objet.nom !== pop.objet.nom);
            this.pop_up= this.pop_up.filter(pop_up => pop_up.objet.nom !== pop.objet.nom);
            this.ajouter_inventaire(pop.objet.nom, pop.objet.url_image);
            if (this.etape <= 8) {
              var lien = "api/objets?id=" + this.etape.toString()
              fetch(lien)
                .then(r => r.json())
                .then(nouvelobjet => {
                this.objets.push(...nouvelobjet);
                this.creation_pop_up(...nouvelobjet)
                });
            }
          }, 2000);    
        }
      });
    },

    verif_reponse(pop) {
      var reponse = prompt("Entrez le code:")
      if (reponse == pop.objet.code) {
        pop.marqueur.bindPopup(pop.objet.messagefin).openPopup();
        let id_code = Number(pop.objet.id) + 1
        var lien = "api/objets?id=" + id_code.toString()
        fetch(lien)
          .then(r => r.json())
          .then(nouvelobjet => {
            this.retirer_inventaire(nouvelobjet[0].nom)
            pop.objet.typeobjet ='objet_recuperable'
            this.ajouter_objet_inventaire(pop)
          });  
      } else {
        reponse = prompt('Ratez! Essayez encore:');
      }
    },

    debloquer_objet(pop) {
      var ajout_inv = false
      this.inventory.forEach((item) => {
        if (pop.objet.code === item.nom) {
          pop.marqueur.bindPopup(pop.objet.messagefin).openPopup();
          this.retirer_inventaire(item.nom)
          ajout_inv = true
          pop.objet.typeobjet = 'objet_recuperable'
          this.ajouter_objet_inventaire(pop)
        }
      });
      if (ajout_inv === false) {
        alert("Vous n'avez pas de lait dans votre inventaire.");
      }
    },
    

    fin() {
      this.stopper_chronometre(); 
      this.pseudo = prompt('Entrez votre pseudo:');

      let tempsSecondes = this.chronometre.heures * 3600 + this.chronometre.minutes * 60 + this.chronometre.secondes;
      
      // on enlève 10 points par secondes, le score max étant de 10000 si le jeu est réalisé en 0 sec (impossible)
      this.score = Math.max(0, 10000 - (tempsSecondes * 10));

      // envoie le pseudo et le score à notre serveur avec la route /api/scores qu'on a créé dans le index.php
      fetch('http://localhost:1234/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pseudo: this.pseudo,
          score: this.score
        })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          alert(`Votre score de ${this.score} pts a été enregistré.`);
          window.location.href = '/';
        } else {
          alert('Erreur : ' + (data.error || 'inconnue'));
        }
      })
      .catch(err => {
        console.error(err);
        alert('Erreur réseau lors de l\'envoi du score.');
      });
    }

    }
  }
).mount('#app');