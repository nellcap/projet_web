<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

// params de connexion à la base de données contenant les tables objets et scores 
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


// route pour récupérer les informations sur les objets de la carte stockés sur notre serveur 
// on peut avoir des infos sur l'objet dont l'id est égal à n en ajoutant "?id=n" à la
// fin de l'url
Flight::route('GET /api/objets', function () {

    $link = Flight::get('connexion_db');  

    // on recupere l'id de l'objet dont on veut voir les infos si y en a un (via le ?id=n dans l'url) 
    $id = Flight::request()->query['id'] ?? null;

    // si y a pas de id tapé dans l'url, on affiche tous les objets qui doivent être sur la carte 
    // début du jeu (dans la requete sql c'est le WHERE depart = TRUE)
    if (!$id) {

        $sql = "SELECT id, nom, ST_X(position) as long, ST_Y(position) as lat FROM objets WHERE depart = TRUE";

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

    // requête securisée (sinon utilisateur peut mofidier la base de données en y mettant une requête sql)
    $requete = pg_query_params($link, $sql, [$id]);
    $objet = pg_fetch_all($requete, PGSQL_ASSOC);
    pg_close($link);

    // si id ne correspond à aucun objet dans la table, erreur 
    Flight::json($objet ?: ['error' => 'aucun objet ne corresond à cet id']);
});

// route pour envoyer les données de l'utilisateur (pseudo et scores) à notre serveur 
// à la fin de la partie  
Flight::route('POST /api/scores', function() {
    $link = Flight::get('connexion_db');
    
    // récupère les infos données par l'utilisateur 
    $donneesFin = Flight::request();
    
    // stocke le json du pseudo et du score de l'utilisateur (récupérés via POST)
    $pseudo = $donneesFin->data->pseudo ?? '';
    $score = $donneesFin->data->score ?? 0;
    
    // si pas de pseudo rentré, on dit de mettre un pseudo
    if (empty($pseudo)) {
        Flight::json(['error' => 'Mets un pseudo stp'], 400);
        return;
    }
    
    // insère dans la table score les infos de l'utilisateur : pseudo et score
    // on veut récupérer l'id associé à l'utilisateur ($1 et $2 sont équivalents à $pseudo et $score)
    $sql = 'INSERT INTO scores (pseudo, score) VALUES ($1, $2) RETURNING id';
    $requete = pg_query_params($link, $sql, [$pseudo, $score]);
    

    if ($requete) {
        // si la requête marche bien 
        // on sort le résultat de la requête sous forme de tableau json
        $resultat = pg_fetch_all($requete, PGSQL_ASSOC);
        Flight::json(['success' => true, 'id' => $resultat['id']]);
    } else {
        Flight::json(['error' => 'Erreur sauvegarde'], 500);
    }
});

// route pour récupérer le top 10 des utilisateurs (pseudo et scores)
Flight::route('GET /api/scores', function() {
    $link = Flight::get('connexion_db');
    
    $sql = "SELECT pseudo, score FROM scores ORDER BY score DESC LIMIT 10";
    
    $requete = pg_query($link, $sql);
    
    if ($requete) {
        $scores = pg_fetch_all($requete);
        // si la requête ne ressort aucun utilisateur, on renvoie une liste vide (personne
        // n'a encore joué au jeu)
        Flight::json($scores ?: []); 
    } else {
        Flight::json(['error' => 'Erreur requête'], 500);
    }
});



Flight::route('/carte', function() {
    Flight::render('carte');
});


Flight::start();

?>