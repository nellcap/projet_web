var inventory = [];
var draggedItem = null;

function addToInventory(itemName) {
    inventory.push({ name: itemName});
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
                itemDiv.innerHTML = '</span><span class="item-name">' + item.name + '</span>';
                container.appendChild(itemDiv);
            });
        }
    }

var map = L.map('map').setView([48.754300819108934, 2.1585445744449885], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var elysee = L.marker([48.8708852, 2.3170585]);
var message1 = "Merci beaucoup d'avoir accepté de nous aider. Je commençais à désespérer. Dépechez-vous le temps presse. Le premier ingrédient se trouve dans la silicon valley française.";
elysee.addTo(map);
elysee.bindPopup(message1).openPopup();



var fermeIcon = L.icon({
    iconUrl: 'data/lait.jpg',  // ton image
    iconSize: [48, 48],           // taille de l’image (à ajuster)
    iconAnchor: [24, 48],         // point de l’image placé exactement sur la position
    popupAnchor: [0, -48]         // optionnel : position du popup
});

var fermeviltain = L.marker([48.754300819108934, 2.1585445744449885], { icon: fermeIcon, draggable: true });
var message2 = "Super, nous avons du lait. Il faut maintenant que nous fassions notre propre beurre.";


var draggedItem = null


var targetLat = 48.754300819108934;
var targetLng = 2.1585445744449885;
var tolerance = 0.005;

map.on('zoomend moveend', function () {
    var zoom = map.getZoom();
    var center = map.getCenter();

    // Vérifier si on est "assez proche" de l'endroit cible
    var inTarget = Math.abs(center.lat - targetLat) <= tolerance &&
                   Math.abs(center.lng - targetLng) <= tolerance;

    if (zoom >= 10 && inTarget) {
        fermeviltain.addTo(map);
        fermeviltain.bindPopup(message2).openPopup();
        // Début du drag
        fermeviltain.on('dragstart', function(e) {
            draggedItem = fermeviltain;  // On stocke le marqueur
            console.log("Marqueur en cours de déplacement :", draggedItem);
        });

        fermeviltain.on('dragend', function () {
            addToInventory(fermeviltain);
        });
    }
});

