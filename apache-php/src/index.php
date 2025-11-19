<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

$host = 'db';
$port = 5432;
$dbname = 'mydb';
$user = 'postgres';
$pass = 'postgres';

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
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");
    
    if (!$link) {
        Flight::json(['error' => 'connexion marche pas'], 500);
        return;
    }
    
    
    $sql = "SELECT id, nom, ST_X(position) as long, ST_Y(position) as lat, minZoomVisible, depart, typeObjet, code, messageDebut, messageFin, url_image
            FROM objets 
            WHERE depart = TRUE";
    
    $query = pg_query($link, $sql);
    
    if (!$query) {
        Flight::json(['error' => 'erreur de requete'], 500);
        return;
    }
    
    $objets = pg_fetch_all($query);
    pg_close($link);
    
    Flight::json($objets);
});

Flight::route('/carte', function() {
    Flight::render('carte');
});

Flight::start();

?>