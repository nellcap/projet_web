# Des macarons pour Macron

Ce jeu est un escape game géographique. Après avoir lu les consignes (dont le
premier indice), appuyez sur le bouton "C'est parti !". Rendez-vous au premier endroit 
décrit par l'indice sur la page d'accueil (vous pouvez activer la heat map avec la check
box en haut à droite de la carte). Pour passer le texte ou pour récupérer l'objet,
il faut appuyer sur celui-ci. Si vous voulez débloquer un objet, il suffit d'avoir l'objet débloquant 
dans son inventaire. 


# Solutions (long, lat)
1. Objet bloqué, libérable avec le lait : beurre de la ferme qui a produit le meilleur beurre agricole de 2025 (-0.6951, 48.2211)
2. Objet récupérable, libérant le beurre : lait de la Sillicon Valley française pour récupérer le beurre (2.1585 48.7543)
3. Objet récupérable : oeufs de chez Garance (2.6459, 49.2499)
4. Objet bloqué par un code : framboises de chez mère-grand (0.7506, 45.1038)
5. Objet code débloquant les framboises : Matignon - code 1312 (2.3207, 48.8547)
6. Objet récupérable : sucre glace de la Khôlocscopie (2.5838, 48.8459)
7. Objet récupérable : amandes chez Louise Gouget (0.6162, 44.2030)
8. Retour à l'Élysée : (2.3170, 48.87088)

# Fichiers

## Apache-PHP
- Dans le dossier 'apache-php/src/assets', il y a deux fichiers en JavaScript qui contrôle la vue du menu (menu.js) et la vue de la carte (app.js) qui contient la mécanique de l'escape game. Il y a aussi deux fichiers
CSS qui définissent le style du menu (style.css) et de la carte (carte.css).

- Le dossier 'apache-php/src/data' contient toutes les images des objets sur la carte ainsi qu'un élément 
de décoration dans le menu.

- Le dossier 'apache-php/src/views' contient deux fichiers PHP qui commandent le menu (menu.php) et la carte de jeu (carte.php). 

- apache-php/src/index.php gère toutes les routes du jeu.

## Postgres/PostGIS et pgAdmin

- db/init.sql crée les tables objets et scores et insère les objets de la carte dans la table objets.

## Geoserver


## Fichier docker-compose.yml

Nous avons modifié le fichier docker-compose.yml pour pouvoir utiliser Docker sur MacOS et Windows. 
On a ajouté la ligne 'platform: linux/amd64' pour chaque service utilisé (pgAdmin, Geoserver, Postgres/PostGIS). Cette ligne est ignorée par Docker sur des ordinateurs qui ont Windows.

# Docker Starter Kit

Construit un environnement Docker avec Apache+PHP+Flight, Postgres/PostGIS, pgAdmin, GeoServer.

## Structure générale

L’environnement est composé de 4 services (définis dans `docker-compose.yml`) :

| Service                | Nom interne | Rôle                                    | Ports exposés (hôte:docker) | Volume principal                         |
| ---------------------- | ----------- | --------------------------------------- | --------------------------- | ---------------------------------------- |
| **Apache+PHP**         | web         | Serveur web pour application Flight PHP | `1234:80`                   | `./apache-php/src:/var/www/html`         |
| **PostgreSQL+PostGIS** | db          | Base de données spatiale                | `5432`                      | `pg_data:/var/lib/postgresql/data`       |
| **pgAdmin**            | pgadmin     | Interface web pour gérer Postgres       | `5050:80`                   | `pgadmin_data:/var/lib/pgadmin`          |
| **GeoServer**          | geoserver   | Serveur cartographique (WMS, WFS, WCS)  | `8080:8080`                 | `geoserver_data:/opt/geoserver/data_dir` |

## Détails des services

### Apache+PHP+Flight

- basé sur `./apache-php/Dockerfile`
- fichiers sources dans `./apache-php/src`
- http://localhost:1234

### Postgres+PostGIS

- user: `postgres`, pass: `postgres`, base: `mydb`, port: `5432`
- exécute `./db/init.sql` au premier démarrage (contruit une table points, avec 3 points)

### pgadmin

- user: `admin@admin.com`, pass: `admin`
- permet de se connecter à postgres si besoin (host `db`, port `5432`, user/pass, sans SSL)
- http://localhost:5050

### GeoServer

- user: `admin`, pass: `geoserver`
- http://localhost:8080/geoserver

## Volumes & persistance

Les volumes Docker permettent de conserver les données même si le conteneur est supprimé et/ou relancé :

- un volume pour Apache+PHP (monté sur le dossier `./apache-php/src`)
- trois autres volumes Docker pour les données (attention, les données de ces volumes ne sont pas accessibles en local, voir «Sauvegarde» plus loin)

```yml
volumes:
  pg_data:
  pgadmin_data:
  geoserver_data:
```

- `pg_data` stocke la base PostGIS (schémas, données, utilisateurs)
- `pgadmin_data` stocke les données pgadmin (connexions)
- `geoserver_data` stocke la configuration GeoServer (workspaces)

## Commandes de base

```sh
# lance la stack Docker
docker compose up
docker compose up -d # en mode daemon

# arrête la stack
docker compose down
docker compose down -v # supprime en plus les volumes
```

## Sauvegarde

Pour récupérer en local les données de la BDD et de GeoServer, exécutez les scripts respectifs depuis la racine du projet

```sh
# Copie des workspaces GeoServer
# docker compose cp <container>:<from> <to>
docker compose cp geoserver:/opt/geoserver/data_dir/workspaces/. ./geoserver-workspaces/

# Export SQL de la base (dump)
docker compose exec -t db pg_dump --inserts -U postgres -d mydb > "./db/backup.sql"
```

- un dossier `./geoserver-workspaces` est créé pour les données des workspaces GeoServer
- un fichier `./db/backup.sql` est créé pour un dump de la BDD
