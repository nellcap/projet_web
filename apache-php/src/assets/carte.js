var map = L.map('map').setView([48.8708852, 2.3170585], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var elysee = L.marker([48.8708852, 2.3170585]);
var message1 = "Merci beaucoup d'avoir accepté de nous aider. Je commençais à désespérer. Dépechez-vous le temps presse. Le premier ingrédient se trouve dans la silicon valley française.";
elysee.addTo(map);
elysee.bindPopup(message1).openPopup();

var fermeviltain = L.marker([48.754300819108934, 2.1585445744449885]);
var message2 = "Super, nous avons du lait. Il faut maintenant que nous fassions notre propre beurre.";

var targetLat = 48.754300819108934;
var targetLng = 2.1585445744449885;
var tolerance = 0.005;

map.on('zoomend moveend', function () {
    var zoom = map.getZoom();
    var center = map.getCenter();

    // Vérifier si on est "assez proche" de l'endroit cible
    var inTarget = Math.abs(center.lat - targetLat) <= tolerance &&
                   Math.abs(center.lng - targetLng) <= tolerance;

    if (zoom >= 15 && inTarget) {
        fermeviltain.addTo(map);
        fermeviltain.bindPopup(message2).openPopup();
    }
});