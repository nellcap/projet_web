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
      etape: 0,
      recupererable: false,
      map: null,
      objets: []
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
      console.log(objets);
      this.objets = objets;
      this.creation_pop_up(this.objets);
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


    // Gestion inventaire

    ajouter_inventaire(nom_objet, icone) {
      inventory.push({ nom: nom_objet, image: icone});
      changer_affichage_inventaire();
    },

    retirer_inventaire(nom_objet, icone) {    
      inventory = inventory.filter(item => !(item.nom === nom_objet && item.image === icone));
      changer_affichage_inventaire();
    },

    changer_affichage_inventaire() {
      var container = document.getElementById('inventory-items');
      if (inventory.length === 0) {
        container.innerHTML = '<div class="empty-inventory">Votre inventaire est vide</div>';
      } else {
        container.innerHTML = '';
        inventory.forEach(function(item) {
          var itemDiv = document.createElement('div');
          itemDiv.className = 'item';
          itemDiv.innerHTML = '<img src="' + item.image + '" alt="' + item.nom + '" class="item-icone"><span class="item-name">' + item.nom + '</span>';
          container.appendChild(itemDiv);
        });
      }
    },

    // Gestion pop-up

    creation_pop_up (objets) {
      for (let obj of objets) {
        var Image = L.icon({
          iconUrl: obj.url_image,
          iconSize: [48, 48],  
        });
        var pop_up = L.marker([parseFloat(obj.lat),parseFloat(obj.long)], { icon: Image});
        pop_up.addTo(this.map)
      }
    },

    apparition_pop_up(pop_up,objet) {
      var ajout_inv = false
      map.on('zoomend moveend', function () {
        var zoom = map.getZoom();
        var centre = map.getCenter();
        var lat = objet.lat;
        var lgn = objet.long
        var tolerance = 0.01;
        

        var inTarget = Math.abs(centre.lat - lat) <= tolerance &&
                    Math.abs(centre.lng - lng) <= tolerance;

        if (zoom >= objet.minZoomVisible && inTarget) {
            if (ajout_inv == false) {
              pop_up.addTo(this.map);
              pop_up.bindPopup(objet.messageDebut).openPopup();
              ajout_inv = true;
            }
        }
      });
    },

    verif_reponse(pop_up,reponse,objet) {
      var answer = reponse.value;
      if (answer === objet.code) {
        pop_up.bindPopup(messageFin).openPopup(); 
        objet.recupererable = true
        return objet.recupererable
      } else {
        alert('Essayez encore...');
      }
    },

    debloquer_objet(objet_a_debloquer,objet_debloquant) {
      inventory.forEach(function(item) {
        if (objet === item.nom) {
          objet_a_debloquer.bindPopup(message).openPopup();
          retirer_inventaire(objet_debloquant.nom,objet_debloquant.Image)
                  var recupererable = true
        return recupererable
        }
      });
      if (ajout_inv === false) {
        alert("Vous n'avez pas de lait dans votre inventaire.");
      }
    },

    ajouter_objet_inventaire(objet) {
      objet.on('click', function () {
        if (recupererable === true) {
          map.removeLayer(objet);
          ajouter_inventaire(objet.nom, objet.chemin_image);
          objet.ajout_inv = true
        }
      })
    },
  }
}).mount('#app');