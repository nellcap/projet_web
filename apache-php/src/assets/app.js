Vue.createApp({
  data() {
    var inventory = [];
    var chronometre = {
    secondes: 0,
    minutes: 0,
    heures: 0,
    intervalId: null,
    estEnCours: false
    };
    var etape = 0
    var recupererable = false
  },
  methods: {
    initialisation_carte () {
      var map = L.map('map').setView([48.8708852, 2.3170585], 15);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    },

    // Gestion chronomètre
    demarrer_chronometre() {
      if (!chronometre.estEnCours) {
        chronometre.estEnCours = true;
        chronometre.intervalId = setInterval(function() {
          chronometre.secondes++;
            
          if (chronometre.secondes >= 60) {
            chronometre.secondes = 0;
            chronometre.minutes++;
          }
            
          if (chronometre.minutes >= 60) {
            chronometre.minutes = 0;
            chronometre.heures++;
          }
            
          afficherChronometre();
        }, 1000); // Met à jour toutes les secondes
      }
    },

    afficher_chronometre() {
      var h = chronometre.heures < 10 ? '0' + chronometre.heures : chronometre.heures;
      var m = chronometre.minutes < 10 ? '0' + chronometre.minutes : chronometre.minutes;
      var s = chronometre.secondes < 10 ? '0' + chronometre.secondes : chronometre.secondes;
        
      var affichage = h + ':' + m + ':' + s;
      document.getElementById('chronometre').textContent = affichage;
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

    creation_pop_up (chemin_image,geom) {
      var Image = L.icon({
        iconUrl: chemin_image,
        iconSize: [48, 48],  
      });
      return pop_up = L.marker(geom, { icon: Image});
    },

    apparition_pop_up(pop_up,geom, message1) {
      var ajout_inv = false
      map.on('zoomend moveend', function () {
        var zoom = map.getZoom();
        var centre = map.getCenter();
        var coordonnees = geom;
        var tolerance = 0.01;
        

        var inTarget = Math.abs(centre.lat - coordonnees.lat) <= tolerance &&
                    Math.abs(centre.lng - coordonnees.lng) <= tolerance;

        if (zoom >= 10 && inTarget) {
            if (ajout_inv == false) {
              pop_up.addTo(map);
              pop_up.bindPopup(message1).openPopup();
              ajout_inv = true;
            }
        }
      });
    },

    verif_reponse(reponse) {
      var answer = reponse.value;
      if (answer === '1312') {
        fromagerie.bindPopup(message).openPopup(); 
        var recupererable = true
        return recupererable
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
}).mount('#jeu');