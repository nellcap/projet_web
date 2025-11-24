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
      heatmapVisibl: false,
      pseudo: null,
      score: 0,
      objets_ramasses: []
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
      console.log(this.objets)
      this.creation_pop_up();
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
      this.inventory.push({ nom: nom_objet, image: icone});
    },

    retirer_inventaire(nom_objet) {    
      this.inventory = this.inventory.filter(item => item.nom !== nom_objet );
    },

    // Gestion pop-up

    creation_pop_up () {
      for (let obj of this.objets) {
        var existe = this.pop_up.some(item => item.objet.nom === obj.nom);
        if (!existe && !this.objets_ramasses.includes(obj.id)) {
          var Image = L.icon({
            iconUrl: obj.url_image,
            iconSize: [48, 48],  
          });
          var pop_up = L.marker([parseFloat(obj.lat),parseFloat(obj.long)], { icon: Image});
          this.pop_up.push({ marqueur:pop_up, objet: obj,visible: false});
        }
      }
      this.apparition_pop_up();

    },

    apparition_pop_up() {
      this.map.on('zoomend moveend', () => {      
        for (let pop of this.pop_up) {
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
        }
        if (pop.objet.typeobjet == 'obj_bloque_par_code') {
          this.verif_reponse(pop)
        } else {
          if (pop.objet.typeobjet == 'obj_bloque_par_objet') {
            this.debloquer_objet(pop)
          } else {
            pop.marqueur.bindPopup(pop.objet.messagefin).openPopup();
            this.objets_ramasses.push(pop.objet.id);
            setTimeout(() => {
              this.map.removeLayer(pop.marqueur);
              pop.visible = false;
              console.log('DEBUT')
              console.log(this.objets, this.pop_up)
              this.objets = this.objets.filter(objet => objet.nom !== pop.objet.nom);
              this.pop_up= this.pop_up.filter(pop_up => pop_up.objet.nom !== pop.objet.nom);
              console.log('FIN')
              console.log(this.objets, this.pop_up)
              this.ajouter_inventaire(pop.objet.nom, pop.objet.url_image);
              this.etape = this.etape + 1
              if (this.etape <= 8) {
                var lien = "api/objets?id=" + this.etape.toString()
                fetch(lien)
                  .then(r => r.json())
                  .then(nouvelobjet => {
                  this.objets.push(...nouvelobjet);
                  this.creation_pop_up()
                  });
              }
            }, 2000);
            
          }
        };
      });
    },

    verif_reponse(pop) {
      var reponse = prompt("Entrez le code:")
      if (reponse == pop.objet.code) {
        pop.marqueur.bindPopup(pop.objet.messagefin).openPopup();
        // this.retirer_inventaire(item.nom,item.image)
        pop.objet.typeobjet ='objet_recuperable'
        this.ajouter_objet_inventaire(pop)
      } else {
        reponse = prompt('Ratez! Essayez encore:');
      }
    },

    debloquer_objet(pop) {
      var ajout_inv = false
      let lien = "api/objets?id=" + pop.objet.id_debloquable
      console.log('lien', lien)
      fetch(lien)
        .then(r => r.json())
        .then(nouvelobjet => {
            if (this.inventory.some(item => item.nom === nouvelobjet[0].nom)) {
              console.log(nouvelobjet[0].nom)
              pop.marqueur.bindPopup(pop.objet.messagefin).openPopup();
              this.retirer_inventaire(nouvelobjet[0].nom)
              pop.objet.typeobjet = 'objet_recuperable'
            } else {
              alert("Vous n'avez pas de lait dans votre inventaire.")
            };
        })
    },
    

    fin() {
      this.stopper_chronometre()
      this.pseudo = prompt('Entrez votre nom:')
      this.score = chronometre
    }
  }
}).mount('#app');