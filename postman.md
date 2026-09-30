# Postman — Moto Routes API

Colección/documentación para probar los endpoints de la API.

## Variables

Usa estas variables en Postman:

```text
baseUrl = http://localhost:3000
routeId = reemplazar_por_un_uuid
```

---
## 1. Health check

**GET**

```text
{{baseUrl}}/health
```

### Respuesta esperada

```json
{
  "ok": true
}
```

---
## 2. Listar routes

**GET**

```text
{{baseUrl}}/api/routes
```

### Respuesta esperada

```json
[
  {
    "_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Puerto de la Bonaigua en moto",
    "region": "Lleida",
    "distanceKm": 78.5,
    "difficulty": "media",
    "description": "Curvas de montaña con vistas al Pirineo catalán.",
    "createdAt": "2026-09-16T09:00:00.000Z",
    "updatedAt": "2026-09-16T09:00:00.000Z"
  }
]
```

---
## 3. Obtener una route

**GET**

```text
{{baseUrl}}/api/routes/{{routeId}}
```

> Sustituye `routeId` por el `_id` obtenido al crear una route o al listar.

---
## 4. Crear una route

**POST**

```text
{{baseUrl}}/api/routes
```

### Headers

```text
Content-Type: application/json
```

### Body → raw → JSON

```json
{
  "title": "Puerto de la Bonaigua en moto",
  "region": "Lleida",
  "distanceKm": 78.5,
  "difficulty": "media",
  "description": "Curvas de montaña con vistas al Pirineo catalán, firme en buen estado."
}
```

### Respuesta esperada

**201 Created**

El campo `_id` será un UUID generado por la aplicación.

---
## 5. Actualizar una route

**PATCH**

```text
{{baseUrl}}/api/routes/{{routeId}}
```

### Headers

```text
Content-Type: application/json
```

### Body

Puedes actualizar solo los campos que necesites:

```json
{
  "distanceKm": 80,
  "difficulty": "dificil"
}
```

---
## 6. Eliminar una route

**DELETE**

```text
{{baseUrl}}/api/routes/{{routeId}}
```

### Respuesta esperada

**204 No Content**

No debe devolver body.

---
# Pruebas de errores

## ID inválido

**GET**

```text
{{baseUrl}}/api/routes/123
```

### Respuesta esperada

**400 Bad Request**

```json
{
  "message": "Invalid route id"
}
```

## Route inexistente

Usa un UUID válido que no exista:

```text
{{baseUrl}}/api/routes/550e8400-e29b-41d4-a716-446655440099
```

### Respuesta esperada

**404 Not Found**

```json
{
  "message": "Route not found"
}
```

## Crear sin campos obligatorios

**POST**

```text
{{baseUrl}}/api/routes
```

Body:

```json
{
  "description": "Route sin title, region ni distanceKm"
}
```

La API devuelve **400 Bad Request** porque `title`, `region`, `distanceKm` y `difficulty`
son obligatorios.

## Difficulty inválida

**POST**

```text
{{baseUrl}}/api/routes
```

Body:

```json
{
  "title": "Ruta de prueba",
  "region": "Valencia",
  "distanceKm": 30,
  "difficulty": "imposible"
}
```

### Respuesta esperada

**400 Bad Request**

```json
{
  "message": "Invalid difficulty (allowed: facil, media, dificil)"
}
```

---
# Flujo recomendado de prueba

1. `GET /health`
2. `POST /api/routes`
3. Copiar el `_id` de la respuesta a `routeId`
4. `GET /api/routes/{{routeId}}`
5. `GET /api/routes`
6. `PATCH /api/routes/{{routeId}}`
7. `DELETE /api/routes/{{routeId}}`
8. Volver a hacer `GET` para comprobar que devuelve `404`

## Configuración previa

Levanta el Postgres de este proyecto con Docker (puerto 5433, ver README.md):

```bash
docker compose up -d
```

Después:

```bash
npm install
cp .env.example .env
npm run dev
```

Por defecto la API estará disponible en:

```text
http://localhost:3000
```
