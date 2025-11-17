-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS public.joueurs
(
    id SERIAL PRIMARY KEY,
    pseudo VARCHAR(30) NOT NULL,
    score INT NOT NULL, 
    date_jeu TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- public.obj
-- image, nom, texte, geom, zoom