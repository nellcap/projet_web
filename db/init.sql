-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Création de la table des scores avec le pseudo et le score associé
CREATE TABLE IF NOT EXISTS public.scores (
    id SERIAL PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL,
    score INT NOT NULL
);


-- Création de la table des objets de la carte
CREATE TABLE IF NOT EXISTS public.objets (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    position geometry(Point, 4326) NOT NULL,
    minZoomVisible INT DEFAULT 10,
    depart BOOLEAN DEFAULT FALSE,
    typeObjet VARCHAR(50) NOT NULL CHECK (typeObjet IN ('obj_recuperable', 'obj_code', 'obj_bloque_par_code', 'obj_bloque_par_objet', 'final')),
    code INT,
    id_debloquable INT,
    messageDebut VARCHAR(250),
    messageFin VARCHAR(250),
    url_image VARCHAR(255)

);


-- Insertion d'objets dans la table
INSERT INTO objets (nom, position, minZoomVisible, depart, typeObjet, code, messageDebut, messageFin, url_image)
VALUES 
('lait', ST_GeomFromText('POINT(2.1585 48.7543)', 4326), 9, TRUE, 'obj_recuperable', NULL, NULL,'Bienvenue dans la Silicon Valley française ! Initiée par Nicolas Sarkozy en 2010, elle a détruit l''agriculture du plateau de Saclay, ayant pourtant une des terres les plus fertiles de France.','Maintenant, va faire du beurre avec ce lait.','/data/lait.jpg'),
('beurre', ST_GeomFromText('POINT(-0.6951 48.2211)',4326), 9, TRUE, 'obj_bloque_par_objet', NULL, 1, 'Je crois bien que tu vas avoir besoin de lait pour faire du beurre... Va le chercher dans la Silicon Valley française.', 'En voilà du bon beurre préparé avec le lait que tu as apporté ! Maintenant, va chercher des oeufs chez Garance.', '/data/beurre.png'),
('oeufs', ST_GeomFromText('POINT(2.6459 49.2499)',4326), 9, FALSE, 'obj_recuperable', NULL, NULL, 'Bravo ! Tu es bien arrivé.e chez Garance. Elle te donne des oeufs de ses poules Bella et Ciao.', 'Direction la maison de mère-grand pour récupérer des framboises.', '/data/oeuf.jpg'),
('framboises', ST_GeomFromText('POINT(0.7506 45.1038)',4326), 9, FALSE, 'obj_bloque_par_code', NULL, 5, 'Mère-grand ne donne pas ses framboises à n''importe qui... Le code pour débloquer les framboises se trouve dans la demeure du premier ministre.', 'Des framboises en veux-tu en voilà ! Va chercher du sucre à la Khôlocscopie ! ', '/data/framboises.jpeg'),
('matignon', ST_GeomFromText('POINT(2.3207 48.8547)',4326), 9, FALSE, 'obj_code', 1312, NULL, 'Et voilà le code pour récupérer les framboises', 'Va retrouver mère-grand.', '/data/code_framboise.jpg'),
('sucreglace', ST_GeomFromText('POINT(2.5838 48.8459)',4326), 9, FALSE, 'obj_recuperable', NULL, NULL,'Les filles de la Khôloscopie te donnent du sucre glace !', 'Rends-toi maintenant à la mairie du fief de Louise Gouget.', '/data/sucre.jpg'),
('amande', ST_GeomFromText('POINT(0.6162 44.2030)',4326), 9, FALSE, 'obj_recuperable', NULL, NULL,'Louise te donne de la poudre d''amande qu''elle a failli confondre avec de l''arsenic...', 'Tu as tous les ingrédients, rends-toi à l''Elysée pour finir le jeu !', '/data/amande.jpg'),
('macaron', ST_GeomFromText('POINT(2.3170 48.87088)',4326), 9, FALSE, 'final', NULL, NULL,'Bravo ! Tu as réussi à rassembler tous les ingrédients pour faire les macarons à la framboise !', 'Macron est ravi !', '/data/macaron.jpg');


