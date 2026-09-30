# Moto Routes API

API REST mínima con Express + PostgreSQL para una experiencia estilo Wikiloc, pero enfocada
en **rutas en moto**, organizada por capas:

- `controllers`: HTTP/request-response.
- `services`: reglas de negocio y validación.
- `repositories`: acceso a PostgreSQL mediante SQL parametrizado.
- `models`: definición de la estructura de datos.
- `routes`: endpoints.
- `config`: conexión y creación de la tabla PostgreSQL.

## Campos de una route (ruta en moto)

Pocos campos, al estilo Wikiloc simplificado:

- `title`: string, obligatorio, máximo 120 caracteres.
- `region`: string, obligatorio, máximo 80 caracteres (provincia/zona de la ruta).
- `distanceKm`: number, obligatorio, >= 0 (distancia en kilómetros).
- `difficulty`: string, obligatorio, uno de `facil` | `media` | `dificil`.
- `description`: string, opcional, máximo 500 caracteres.
- `id`: UUID generado por la aplicación.
- `createdAt` y `updatedAt`: gestionados por PostgreSQL.

## Requisitos

- Node.js 18+ recomendado.
- PostgreSQL 13+ recomendado (ver sección Docker más abajo).

## Configuración

```bash
npm install
cp .env.example .env
```

Configura `DATABASE_URL` en `.env`, por ejemplo:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/moto_routes
```

La aplicación crea automáticamente la tabla `routes` al arrancar.

## Ejecutar

```bash
npm run dev
```

o:

```bash
npm start
```

Para cargar datos de ejemplo:

```bash
npm run seed
```

## Endpoints

| Método | Endpoint | Acción |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/routes` | Listar |
| GET | `/api/routes/:id` | Obtener una |
| POST | `/api/routes` | Crear |
| PATCH | `/api/routes/:id` | Actualizar |
| DELETE | `/api/routes/:id` | Eliminar |

### Ejemplo POST

```json
{
  "title": "Puerto de la Bonaigua en moto",
  "region": "Lleida",
  "distanceKm": 78.5,
  "difficulty": "media",
  "description": "Curvas de montaña con vistas al Pirineo catalán."
}
```

La respuesta devuelve `_id` como UUID para mantener el mismo contrato de respuesta de la API.

---

## Docker: cómo crear un segundo Postgres para este proyecto

Como ya usas Docker para levantar el Postgres de `airbnb-api_v4`, lo más sencillo es
**crear un segundo contenedor de Postgres independiente**, con su propio nombre, su propio
volumen y un puerto de host distinto (para no chocar con el que ya tienes ocupando el 5432).

Este proyecto incluye un `docker-compose.yml` listo para eso:

```yaml
services:
  moto-routes-db:
    image: postgres:16-alpine
    container_name: moto-routes-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: moto_routes
    ports:
      - "5433:5432"   # host:contenedor -> distinto del 5432 que ya usas
    volumes:
      - moto_routes_data:/var/lib/postgresql/data

volumes:
  moto_routes_data:
```

### Pasos

1. Levanta el contenedor:

   ```bash
   docker compose up -d
   ```

2. Comprueba que está corriendo:

   ```bash
   docker ps
   ```

   Deberías ver `moto-routes-db` escuchando en `0.0.0.0:5433->5432/tcp`, además del
   contenedor que ya tenías para `airbnb-api_v4` (normalmente en el 5432).

3. Tu `.env` de este proyecto debe apuntar al puerto `5433`:

   ```text
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/moto_routes
   ```

4. Arranca la API normalmente (`npm run dev`); al iniciar creará la tabla `routes` sola.

### Notas

- Si prefieres usar el **mismo contenedor** de Postgres que ya tienes para `airbnb-api_v4`
  en vez de uno nuevo, basta con crear una base de datos adicional dentro de él:

  ```bash
  docker exec -it <nombre_contenedor_airbnb> psql -U postgres -c "CREATE DATABASE moto_routes;"
  ```

  y apuntar `DATABASE_URL` al mismo host/puerto (`5432`) pero con `/moto_routes` al final.
  Esto ahorra recursos, pero significa que ambos proyectos comparten el mismo servidor
  Postgres (mismo contenedor, mismo proceso).

- Si en cambio quieres aislamiento total (por ejemplo, para poder parar/borrar uno sin
  afectar al otro, o usar versiones distintas de Postgres), usa el `docker-compose.yml`
  de este proyecto con un puerto distinto, como se explica arriba.

- Para parar y eliminar este contenedor sin perder datos:

  ```bash
  docker compose stop
  ```

  Para eliminarlo completamente (incluyendo el volumen de datos):

  ```bash
  docker compose down -v
  ```
