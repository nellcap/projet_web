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
pg_set_client_encoding($connexion_db, "UTF8");

// regarde si y a connexion à la base de données
if (!$connexion_db) {
    exit("errreur connexion bdd : " . pg_last_error());
}


session_start();

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


Flight::route('GET /api/objets', function () {

    $link = Flight::get('connexion_db');  

    // on recupere l'id de l'objet dont on veut voir les infos si y en a un (via le ?id=n dans l'url) 
    $id = Flight::request()->query['id'] ?? null;

    // si y a pas de id tapé dans l'url, on affiche tous les objets qui doivent être la au 
    // début de la carte (dans la requete sql c'est le WHERE depart = TRUE)
    if (!$id) {

        $sql = "SELECT id, nom, ST_X(position) as long, ST_Y(position) as lat, minZoomVisible, depart, typeObjet, code, messageDebut, messageFin, url_image FROM objets WHERE depart = TRUE";

        $requete = pg_query($link, $sql);

        // si pbm de requete sql, erreur 
        if (!$requete) {
            Flight::json(['error' => 'erreur requete'], 500);
            return;
        }

        $objets = pg_fetch_all($requete);
        pg_close($link);

        Flight::json($objets);
        return;
    }

    // si il y a bien un id dans l'url
    $sql = "SELECT id, nom, ST_X(position) as long, ST_Y(position) as lat, minZoomVisible, depart, typeObjet, code, messageDebut, messageFin, url_image FROM objets WHERE id = $1";

    // requete securisee (sinon utilisateur peut mofidier la base de donnees en y mettant une requete sql)
    $requete = pg_query_params($link, $sql, [$id]);
    $objet = pg_fetch_all($requete, PGSQL_ASSOC);
    pg_close($link);

    // si id ne correspond à aucun objet dans la table, erreur 
    Flight::json($objet ?: ['error' => 'aucun objet ne corresond à cet id']);
});



Flight::route('/carte', function() {
    Flight::render('carte');
});

Flight::route('/carte_essai', function() {
    Flight::render('carte_essai');
});

Flight::start();

?>