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

// let ghost = document.getElementById("ghost");
let inventaire = document.getElementById("inventaire");
console.log(inventaire)
var draggedItem = null
let dragging = false

var targetLat = 48.754300819108934;
var targetLng = 2.1585445744449885;
var tolerance = 0.005;

function createDraggableItem(icon, name) {
    var itemDiv = document.createElement('div');
            itemDiv.className = 'map-item';
            itemDiv.innerHTML = icon;
            itemDiv.draggable = true;
            itemDiv.name = name;
            itemDiv.icon = icon;
            
            itemDiv.addEventListener('dragstart', function(e) {
                draggedItem = { name: name, icon: icon, element: itemDiv };
                e.dataTransfer.effectAllowed = 'move';
            });
            
            return itemDiv;
};

function verif_zone() {
    let zone = document.getElementById("inventaire");
    let dedans = false

    document.addEventListener("mousemove", function(e) {
    let rect = zone.getBoundingClientRect();

    let inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

    if (inside) {
        dedans = true ;
    } else {
        dedans = false;
    }
    });
    return dedans
};

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
            if (verif_zone() === true) {
                console.log("dans la zone")
                var lait = createDraggableItem('data/lait.jpg', lait);
                lait.style.left = e.pageX + "px";
                lait.style.top  = e.pageY + "px";
                document.body.appendChild(lait);
            }
        });

        // 🔹 Quand on arrête de drag le marker
        fermeviltain.on('dragend', function(e) {
            dragging = false;
           // ghost.style.display = "none";
            document.removeEventListener("mousemove", followMouse);

            // vérifier si on lâche dans l'inventaire
            let rect = inventaire.getBoundingClientRect();

            let inside =
                e.originalEvent.clientX >= rect.left &&
                e.originalEvent.clientX <= rect.right &&
                e.originalEvent.clientX >= rect.left &&
                e.originalEvent.clientY >= rect.top &&
                e.originalEvent.clientY <= rect.bottom;

            if (inside) {
                addToInventory();
            }
        });
    }
});