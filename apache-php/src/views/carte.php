<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Carte</title>
    <link rel="stylesheet" href="assets/carte.css">

  </head>

  <body>

    <div id="map" ></div>
    <div id="inventaire">
        <h2>Inventaire</h2>
        <div id="inventory-items">
            <div class="empty-inventory">Votre inventaire est vide</div>
        </div>
    </div>
    <div id="chronometre-container">
      <div id="chronometre">00:00:00</div>
    </div>
    <div id="heatmap-control" style="position: fixed; top: 80px; right: 20px; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 1000;">
    <label>
        <input type="checkbox" id="heatmap-checkbox" onchange="toggleHeatmap()">
        Mode triche (Carte de chaleur)
    </label>
</div>

    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="assets/carte.js"></script>

  </body>
</html> 