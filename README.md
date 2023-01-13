<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repo
2. Ejecutar

```
npm install
```

3. Tener Nest CLI instalado

4. Levantar la DB
```
docker compose up -d
```

5. Crear el archivo __.env__ usando __.env.template__ como base

6. Correr la aplicacion
```
npm run start:dev
```

7. Reconstruir la base de datos con la semilla
```
http://localhost:3000/api/seed
```
