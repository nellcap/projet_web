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
  },
  methods: {
    initialisation_carte () {
      var map = L.map('map').setView([48.8708852, 2.3170585], 15);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      var elysee = L.marker([48.8708852, 2.3170585]);
      var message1 = "Merci beaucoup d'avoir accepté de nous aider. Je commençais à désespérer. Dépechez-vous le temps presse. Le premier ingrédient se trouve dans la silicon valley française.";
      elysee.addTo(map);
      elysee.bindPopup(message1).openPopup();
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

    ajouter_inventaire(itemName, icone) {
      inventory.push({ name: itemName, icone: icone});
      changer_affichage_inventaire();
    },

    retirer_inventaire(itemName, icone) {    
      inventory = inventory.filter(item => !(item.name === itemName && item.icone === icone));
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
          itemDiv.innerHTML = '<img src="' + item.icone + '" alt="' + item.name + '" class="item-icone"><span class="item-name">' + item.name + '</span>';
          container.appendChild(itemDiv);
        });
      }
    },

    // Gestion pop-up

    apparition_pop_up() {
      map.on('zoomend moveend', function () {
      var zoom = map.getZoom();
      var center = map.getCenter();
      var inTarget = Math.abs(center.lat - targetLat) <= tolerance &&
                   Math.abs(center.lng - targetLng) <= tolerance;

      if (zoom >= 10 && inTarget) {
          if (ajout_inv == false) {
            fermeviltain.addTo(map);
            fermeviltain.bindPopup(message2).openPopup();
          }
      }
      });
    },

    verif_reponse(reponse) {
      var answer = reponse.value;
      if (answer === '1312') {
        fromagerie.bindPopup(message4).openPopup(); 
      } else {
        alert('Essayez encore...');
      }
    },

    debloquer_objet(objet) {
      inventory.forEach(function(item) {
        if (objet === item.name) {
          fromagerie.bindPopup(message4).openPopup();
          retirer_inventaire("lait","data/lait.jpg")
          fromagerie.on('click', function () {
            map.removeLayer(fromagerie);
              ajouter_inventaire('beurre', 'data/beurre.jpg');
              ajout_inv = true
          });
        }
      });
      if (ajout_inv === false) {
        alert("Vous n'avez pas de lait dans votre inventaire.");
      }
    },

    ajouter_objet_inventaire(objet) {
      fermeviltain.on('click', function () {
      map.removeLayer(fermeviltain);
      ajouter_inventaire('lait', 'data/lait.jpg');
      ajout_inv = true
      })
    },
  }
}).mount('#jeu');