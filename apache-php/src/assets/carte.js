var map = L.map('map').setView([48.8708852, 2.3170585], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([48.8708852, 2.3170585]).addTo(map)
    .bindPopup("Merci beaucoup d'avoir accepté de nous aider. Je commençais à désesperer. Dépechez-vous le temps presse. Le premier indice se trouve dans la silicon valley française.")
    .openPopup();
