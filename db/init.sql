-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;


CREATE TABLE IF NOT EXISTS public.objets (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    position geometry(Point, 4326) NOT NULL,
    minZoomVisible INT DEFAULT 10,
    depart BOOLEAN DEFAULT FALSE,
    typeObjet VARCHAR(50) NOT NULL CHECK (typeObjet IN ('debloquant', 'debloqué', 'code', 'obj_debloque_code', 'final')),
    code VARCHAR(4),
    messageDebut VARCHAR(250),
    messageFin VARCHAR(250),
    url_image VARCHAR(255)

);

--ALTER TABLE IF EXISTS public.objets
    --OWNER to postgres;


-- TRUNCATE objets;
INSERT INTO objets (nom, position, minZoomVisible, depart, typeObjet, code, messageDebut, messageFin, url_image)
VALUES ('lait',ST_GeomFromText('POINT(2.1585 48.7543)', 4326),9,TRUE,'debloquant',NULL,'quoicoubeh','Maintenant, allez voir le gagnant du prix agricole du beurre en 2024.','/data/lait.jpg');


-- objet_bloquant_id INT REFERENCES objets(id), -- Pour type 'bloque_objet'
-- objet_libere_id INT REFERENCES objets(id), -- Objet libéré après déblocage
-- objet_code_id INT REFERENCES objets(id) -- Pour type 'bloque_code', référence l'objet qui contient le code
-- public.obj
-- image, nom, texte, geom, zoom