var inventory = [];
var chronometre = {
    secondes: 0,
    minutes: 0,
    heures: 0,
    intervalId: null,
    estEnCours: false
};
var map = L.map('map').setView([48.754300819108934, 2.1585445744449885], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var elysee = L.marker([48.8708852, 2.3170585]);
var message1 = "Merci beaucoup d'avoir accepté de nous aider. Je commençais à désespérer. Dépechez-vous le temps presse. Le premier ingrédient se trouve dans la silicon valley française.";
elysee.addTo(map);
elysee.bindPopup(message1).openPopup();

// Créer la couche WMS de heatmap (invisible par défaut)
var heatmapLayer = L.tileLayer.wms('http://localhost:8080/geoserver/projet_nell_clara/wms', {
    layers: 'projet_nell_clara:heatmap', // Remplacez par le nom de votre layer
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    attribution: 'GeoServer',
    crs: L.CRS.EPSG4326,
    tiled: true
});

// Variable pour suivre l'état de la heatmap
var heatmapVisible = false;

// Fonction pour activer/désactiver la heatmap
function toggleHeatmap() {
    if (heatmapVisible) {
        map.removeLayer(heatmapLayer);
        heatmapVisible = false;
    } else {
        heatmapLayer.addTo(map);
        heatmapVisible = true;
    }
}

function demarrerChronometre() {
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
};

function afficherChronometre() {
    var h = chronometre.heures < 10 ? '0' + chronometre.heures : chronometre.heures;
    var m = chronometre.minutes < 10 ? '0' + chronometre.minutes : chronometre.minutes;
    var s = chronometre.secondes < 10 ? '0' + chronometre.secondes : chronometre.secondes;
    
    var affichage = h + ':' + m + ':' + s;
    document.getElementById('chronometre').textContent = affichage;
};

demarrerChronometre();

function addToInventory(itemName, icone) {
    console.log('addToInventory appelé pour:', itemName);
    inventory.push({ name: itemName, icone: icone});
    console.log('Contenu de inventory:', inventory);
    console.log('Longueur de inventory:', inventory.length);
    updateInventoryDisplay();
};

function removeFromInventory(itemName, icone) {    
    inventory = inventory.filter(item => !(item.name === itemName && item.icone === icone));
    updateInventoryDisplay();
}

function updateInventoryDisplay() {
    var container = document.getElementById('inventory-items');
    if (inventory.length === 0) {
        container.innerHTML = '<div class="empty-inventory">Votre inventaire est vide</div>';
    } else {
        container.innerHTML = '';
        inventory.forEach(function(item) {
            var itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                // Utilisation de <img> pour afficher l'image
                itemDiv.innerHTML = '<img src="' + item.icone + '" alt="' + item.name + '" class="item-icone"><span class="item-name">' + item.name + '</span>';
                container.appendChild(itemDiv);
        });
    }
};

//var map = L.map('map').setView([48.754300819108934, 2.1585445744449885], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var elysee = L.marker([48.8708852, 2.3170585]);
var message1 = "Merci beaucoup d'avoir accepté de nous aider. Je commençais à désespérer. Dépechez-vous le temps presse. Le premier ingrédient se trouve dans la silicon valley française.";
elysee.addTo(map);
elysee.bindPopup(message1).openPopup();

var beurreIcon = L.icon({
    iconUrl: 'data/beurre.jpg',  // ton image
    iconSize: [48, 48],           // taille de l’image (à ajuster)
    iconAnchor: [24, 48],         // point de l’image placé exactement sur la position
    popupAnchor: [0, -48]         // optionnel : position du popup
});

var fromagerie = L.marker([48.22118448647317, -0.6951406610558623], { icon: beurreIcon});
fromagerie.addTo(map);
var message4 = "Super, nous avons du beurre."
var message5 = "<div> <p>Nous avons besoin d'un code : </p><input type='text' id='reponse' placeholder='Votre texte...'><button onclick='verif_reponse(reponse)'>Valider</button></div>";
var message3 = "<div> <p>Nous avons besoin de lait.<button onclick='debloquer_objet(\"lait\")'>Donner du lait</button></div>"
fromagerie.bindPopup(message3).openPopup();


function verif_reponse(reponse) {
    var answer = reponse.value;
    if (answer === '1312') {
        fromagerie.bindPopup(message4).openPopup(); 
    } else {
        alert('Essayez encore...');
    }
};

function debloquer_objet(objet) {
    inventory.forEach(function(item) {
        if (objet === item.name) {
            fromagerie.bindPopup(message4).openPopup();
            removeFromInventory("lait","data/lait.jpg")
            fromagerie.on('click', function () {
                map.removeLayer(fromagerie);
                addToInventory('beurre', 'data/beurre.jpg');
                ajout_inv = true
            });
        }
    });
    if (ajout_inv === false) {
        alert("Vous n'avez pas de lait dans votre inventaire.");
    }
};

var fermeIcon = L.icon({
    iconUrl: 'data/lait.jpg',  // ton image
    iconSize: [48, 48],           // taille de l’image (à ajuster)
    iconAnchor: [24, 48],         // point de l’image placé exactement sur la position
    popupAnchor: [0, -48]         // optionnel : position du popup
});

var fermeviltain = L.marker([48.754300819108934, 2.1585445744449885], { icon: fermeIcon});
var message2 = "Super, nous avons du lait. Il faut maintenant que nous fassions notre propre beurre.";

var targetLat = 48.754300819108934;
var targetLng = 2.1585445744449885;
var tolerance = 0.01;

var ajout_inv = false

fermeviltain.on('click', function () {
    map.removeLayer(fermeviltain);
    addToInventory('lait', 'data/lait.jpg');
    ajout_inv = true
});

map.on('zoomend moveend', function () {
    var zoom = map.getZoom();
    var center = map.getCenter();

    // Vérifier si on est "assez proche" de l'endroit cible
    var inTarget = Math.abs(center.lat - targetLat) <= tolerance &&
                   Math.abs(center.lng - targetLng) <= tolerance;

    if (zoom >= 10 && inTarget) {
        if (ajout_inv == false) {
            fermeviltain.addTo(map);
            fermeviltain.bindPopup(message2).openPopup();
        }
    }
});