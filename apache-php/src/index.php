<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

// params de connexion a la base de données contenant les tables objets et joueurs 
define('DB_HOST', 'db'); 
define('DB_PORT', '5432'); 
define('DB_NAME', 'mydb'); 
define('DB_USER', 'postgres'); 
define('DB_PASSWORD', 'postgres'); 

// string qui sert à la connexion à la base
$string_connexion = "host=" . DB_HOST . " port=" . DB_PORT . " dbname=" . DB_NAME . " user=" . DB_USER . " password=" . DB_PASSWORD;
$connexion_db = pg_connect($string_connexion);

// regarde si y a connexion à la base de données
if (!$connexion_db) {
    exit("errreur connexion bdd : " . pg_last_error());
}

Flight::set('connexion_db', $connexion_db);


Flight::route('/', function() {

    Flight::render('menu');
});

Flight::route('/test-db', function () {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $sql = "SELECT * FROM points";
    $query = pg_query($link, $sql);
    $results = pg_fetch_all($query);
    Flight::json($results);
});

Flight::route('GET /api/objets', function() {

    $link = Flight::get('connexion_db');  

    // requete SQL qui recupere seulement l'objet utile pour commencer le jeu 
    // c'est à dire le lait, premier objet à trouver 
    $sql = "SELECT id, nom, ST_X(position) as long, ST_Y(position) as lat, minZoomVisible, depart, typeObjet, code, messageDebut, messageFin, url_image FROM objets WHERE depart = TRUE";
    
    $requete = pg_query($link, $sql);
    
    if (!$query) {
        Flight::json(['error' => 'erreur de requete'], 500);
        return;
    }
    
    $objets = pg_fetch_all($requete);
    pg_close($link);
    
    Flight::json($objets);
});

Flight::route('GET /api/objets/@id', function($id) {
    
    $link = Flight::get('connexion_db');  
    
    $sql = "SELECT id, nom, ST_X(position) as longitude, ST_Y(position) as latitude 
            FROM objets WHERE id = $1";
    
    $query = pg_query_params($link, $sql, [$id]);
    $objet = pg_fetch_assoc($query);
    
    Flight::json($objet ?: ['error' => 'Objet non trouvé']);
});


Flight::route('/carte', function() {
    Flight::render('carte');
});

Flight::start();

?>