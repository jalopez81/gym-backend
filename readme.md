# Pasos para configurar postgresql en mac os:


## Instalación
1. Descargar postgresql 18 
Postgres.app with PostgreSQL 18 (Universal)
https://postgresapp.com/downloads.html

2. Configurar PATH:
sudo mkdir -p /etc/paths.d &&
echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp

3. Abrir Postgres.app
4. server settings
5. crear password
6. iniciar server

## pgAdmin 4
1. Descargar pgAdmin 4
2. Abrir pgAdmin 4
3. Crear nuevo servidor
4. ponerle cualquier nombre
5. connections -> host -> localhost

 
