var map = L.map('map').setView([48.22118448647317, -0.6951406610558623], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var elysee = L.marker([48.8708852, 2.3170585]);
var message1 = "Merci beaucoup d'avoir accepté de nous aider. Je commençais à désespérer. Dépechez-vous le temps presse. Le premier ingrédient se trouve dans la silicon valley française.";
elysee.addTo(map);
elysee.bindPopup(message1).openPopup();

var fermeviltain = L.marker([48.754300819108934, 2.1585445744449885]);
var message2 = "Super, nous avons du lait. Il faut maintenant que nous fassions notre propre beurre.";

var fromagerie = L.marker([48.22118448647317, -0.6951406610558623]);
fromagerie.addTo(map);
var message4 = "Super, nous avons du beurre."
var message5 = "<div> <p>Nous avons besoin d'un code : </p><input type='text' id='reponse' placeholder='Votre texte...'><button onclick='verif_reponse(reponse)'>Valider</button></div>";
fromagerie.bindPopup(message5).openPopup(); 
function verif_reponse(reponse) {
    var answer = reponse.value;
    if (answer === '1312') {
        fromagerie.bindPopup(message4).openPopup(); 
    } else {
        alert('Essayez encore...');
    }
}

var message3 = "Nous avons besoin d'un code."


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
    }
});


