# Movie Reservation System

API REST for a movie reservation system.

---

## Setup

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root of the project using `.env.example` as reference.

```bash
cp .env.example .env
```

Example:

```env
JWT_SECRET=f06ea39b5e0d6031a7a70a1668c317ad59eff969abc042af7d1ca92bdc68a4a8
SALT_ROUNDS=5
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=movies
DB_USER=root
DB_PASSWORD=1234
```

Update the database values according to your local MySQL configuration.

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `SALT_ROUNDS` | Number of bcrypt salt rounds used to hash passwords |
| `PORT` | Port where the server will run |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_NAME` | MySQL database name |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |

### Setup Database

Create a **MySQL** database, preferably called `movies`, then run the schema and seed files.

```sql
CREATE DATABASE movies;
```

Schema and seed files are located in:

```txt
db/init/schema.sql
db/init/seed.sql
```

You can load them with:

```bash
mysql -u root -p movies < db/init/schema.sql
mysql -u root -p movies < db/init/seed.sql
```

---

## Running the Project

Start the server in development mode:

```bash
pnpm run dev
```

By default, the API will be available at:

```txt
http://localhost:3000
```

---

# API Documentation

## Base URL

```txt
http://localhost:3000
```

Requests with body must be sent as JSON:

```http
Content-Type: application/json
```

---

# Authentication

Most endpoints require authentication.

To access protected resources, first log in with one of the test users.

```http
POST http://localhost:3000/auth/login
Content-Type: application/json
```

Example request:

```json
{
  "username": "admin",
  "password": "1234"
}
```

After a successful login, the API returns an HTTP-only cookie named `authToken`.

```http
Set-Cookie: authToken=<jwt_token>; Path=/; HttpOnly; Expires=<date>
```

The cookie is automatically sent by the browser or API client in the next requests.

When testing with Postman, make sure cookies are enabled for:

```txt
http://localhost:3000
```

## Test Users

| Username | Password | Role |
|---|---|---|
| `admin` | `1234` | `admin` |
| `customer` | `1234` | `customer` |
| `ticket_seller` | `1234` | `ticket_seller` |

Each role has access to different resources depending on its permissions.

---

# Endpoints

## Auth

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/users/:id`
- `PATCH /auth/users/:id`
- `DELETE /auth/users/:id`

## Movies

- `GET /movies`
- `GET /movies/:id`
- `POST /movies`
- `PATCH /movies/:id`
- `DELETE /movies/:id`

### Genres

- `GET /movies/genres`
- `GET /movies/genres/:id`
- `POST /movies/genres`
- `PATCH /movies/genres/:id`
- `DELETE /movies/genres/:id`

## Schedules

- `GET /schedules`
- `GET /schedules/:id`
- `POST /schedules`
- `PATCH /schedules/:id`
- `DELETE /schedules/:id`

### Schedule States

- `GET /schedules/states`
- `POST /schedules/states`
- `PATCH /schedules/states/:id`
- `DELETE /schedules/states/:id`

## Reservations

- `GET /schedules/reservations`
- `GET /schedules/reservations/:id`
- `GET /schedules/:id/reservations`
- `POST /schedules/:id/reservations`
- `PATCH /schedules/reservations/:id`
- `DELETE /schedules/reservations/:id`

### Reservation States

- `GET /schedules/reservations/states`
- `GET /schedules/reservations/states/:id`
- `POST /schedules/reservations/states`
- `PATCH /schedules/reservations/states/:id`
- `DELETE /schedules/reservations/states/:id`

## Rooms

- `GET /rooms`
- `GET /rooms/:id`
- `POST /rooms`
- `PATCH /rooms/:id`
- `DELETE /rooms/:id`

### Seats

- `GET /rooms/seats`
- `GET /rooms/seats/:id`
- `GET /rooms/:id/seats`
- `POST /rooms/:id/seats`
- `PATCH /rooms/seats/:id`
- `DELETE /rooms/seats/:id`

---

# Request Body Examples

## Auth

### Login

```http
POST /auth/login
```

```json
{
  "username": "admin",
  "password": "1234"
}
```

### Register

```http
POST /auth/register
```

```json
{
  "username": "customer",
  "password": "1234",
  "role": "customer"
}
```

Available roles:

```txt
admin
customer
ticket_seller
```

---

# Movies

## Get All Movies

```http
GET /movies?limit=5&offset=5
```

Query params:

| Param | Type | Required | Description |
|---|---|---|---|
| `limit` | number | No | Number of movies to return |
| `offset` | number | No | Number of movies to skip |

Required permission:

```txt
movies:read
```

## Get Movie By ID

```http
GET /movies/:id
```

Path params:

| Param | Type | Required | Description |
|---|---|---|---|
| `id` | number | Yes | Movie ID |

Required permission:

```txt
movies:read
```

## Create Movie

```http
POST /movies
```

Required permission:

```txt
movies:create
```

Request body:

```json
{
  "title": "Inception 5",
  "description": "A skilled thief enters people's dreams to steal secrets, but is offered a chance at redemption through one last mission.",
  "poster_url": "https://example.com/posters/inception.jpg",
  "duration_minutes": 148,
  "genres": ["Action", "Science Fiction", "Thriller"]
}
```

## Update Movie

```http
PATCH /movies/:id
```

Required permission:

```txt
movies:update
```

Request body:

```json
{
  "title": "Inception 2",
  "genres": ["Action", "Science Fiction", "Thriller", "Horror"]
}
```

## Delete Movie

```http
DELETE /movies/:id
```

Required permission:

```txt
movies:delete
```

---

# Genres

## Get All Genres

```http
GET /movies/genres
```

Required permission:

```txt
movies:read
```

## Get Genre By ID

```http
GET /movies/genres/:id
```

Required permission:

```txt
movies:read
```

## Create Genre

```http
POST /movies/genres
```

Required permission:

```txt
movies:create
```

Request body:

```json
{
  "genre": "Martial Arts"
}
```

## Update Genre

```http
PATCH /movies/genres/:id
```

Required permission:

```txt
movies:update
```

Request body:

```json
{
  "genre": "Action"
}
```

## Delete Genre

```http
DELETE /movies/genres/:id
```

Required permission:

```txt
movies:delete
```

---

# Schedules

## Get All Schedules

```http
GET /schedules
```

Optional query params:

```http
GET /schedules?startDate=2026-03-12&endDate=2026-03-12&startTime=18:00:00&endTime=20:00:00
```

| Param | Type | Required | Description |
|---|---|---|---|
| `startDate` | string | No | Filter schedules from this date |
| `endDate` | string | No | Filter schedules until this date |
| `startTime` | string | No | Filter schedules from this time |
| `endTime` | string | No | Filter schedules until this time |

Required permission:

```txt
schedules:read
```

## Get Schedule By ID

```http
GET /schedules/:id
```

Required permission:

```txt
schedules:read
```

## Create Schedule

```http
POST /schedules
```

Required permission:

```txt
schedules:create
```

Request body:

```json
{
  "movieId": 2,
  "roomId": 2,
  "stateId": 1,
  "startTime": "14:30:00",
  "startDate": "2032-03-12"
}
```

## Update Schedule

```http
PATCH /schedules/:id
```

Required permission:

```txt
schedules:update
```

Request body:

```json
{
  "movieId": 6
}
```

## Delete Schedule

```http
DELETE /schedules/:id
```

Required permission:

```txt
schedules:delete
```

---

# Schedule States

## Get All Schedule States

```http
GET /schedules/states
```

Required permission:

```txt
schedules:read
```

## Create Schedule State

```http
POST /schedules/states
```

Required permission:

```txt
schedules:create
```

Request body:

```json
{
  "state": "confirmed"
}
```

## Update Schedule State

```http
PATCH /schedules/states/:id
```

Required permission:

```txt
schedules:update
```

Request body:

```json
{
  "state": "cancelled"
}
```

## Delete Schedule State

```http
DELETE /schedules/states/:id
```

Required permission:

```txt
schedules:delete
```

---

# Reservations

## Get All Reservations

```http
GET /schedules/reservations
```

Required permission:

```txt
reservations:read
```

## Get Reservation By ID

```http
GET /schedules/reservations/:id
```

Required permission:

```txt
reservations:read
```

## Get Reservations By Schedule ID

```http
GET /schedules/:id/reservations
```

Path params:

| Param | Type | Required | Description |
|---|---|---|---|
| `id` | number | Yes | Schedule ID |

Required permission:

```txt
reservations:read
```

## Create Reservation

```http
POST /schedules/:id/reservations
```

In this route, `:id` is the schedule ID.

Required permission:

```txt
reservations:create
```

Request body:

```json
{
  "seatId": 3,
  "stateId": 3
}
```

## Update Reservation

```http
PATCH /schedules/reservations/:id
```

In this route, `:id` is the reservation ID.

Required permission:

```txt
reservations:update
```

Request body:

```json
{
  "seatId": 5
}
```

## Delete Reservation

```http
DELETE /schedules/reservations/:id
```

Required permission:

```txt
reservations:delete
```

---

# Reservation States

## Get All Reservation States

```http
GET /schedules/reservations/states
```

Required permission:

```txt
reservations:read
```

## Get Reservation State By ID

```http
GET /schedules/reservations/states/:id
```

Required permission:

```txt
reservations:read
```

## Create Reservation State

```http
POST /schedules/reservations/states
```

Required permission:

```txt
reservations:create
```

Request body:

```json
{
  "state": "pending"
}
```

## Update Reservation State

```http
PATCH /schedules/reservations/states/:id
```

Required permission:

```txt
reservations:update
```

Request body:

```json
{
  "state": "cancelled"
}
```

## Delete Reservation State

```http
DELETE /schedules/reservations/states/:id
```

Required permission:

```txt
reservations:delete
```

---

# Rooms

## Get All Rooms

```http
GET /rooms
```

Required permission:

```txt
rooms:read
```

## Get Room By ID

```http
GET /rooms/:id
```

Required permission:

```txt
rooms:read
```

## Create Room

```http
POST /rooms
```

Required permission:

```txt
rooms:create
```

Request body:

```json
{
  "name": "room 4"
}
```

## Update Room

```http
PATCH /rooms/:id
```

Required permission:

```txt
rooms:update
```

Request body:

```json
{
  "name": "room 5"
}
```

## Delete Room

```http
DELETE /rooms/:id
```

Required permission:

```txt
rooms:delete
```

---

# Seats

## Get All Seats

```http
GET /rooms/seats
```

Required permission:

```txt
rooms:read
```

## Get Seat By ID

```http
GET /rooms/seats/:id
```

Required permission:

```txt
rooms:read
```

## Get Seats By Room ID

```http
GET /rooms/:id/seats
```

In this route, `:id` is the room ID.

Required permission:

```txt
rooms:read
```

## Create Seat

```http
POST /rooms/:id/seats
```

In this route, `:id` is the room ID.

Required permission:

```txt
rooms:update
```

Request body:

```json
{
  "roomId": 1,
  "row": "E",
  "column": 3
}
```

## Update Seat

```http
PATCH /rooms/seats/:id
```

In this route, `:id` is the seat ID.

Required permission:

```txt
rooms:update
```

Request body:

```json
{
  "row": "D"
}
```

## Delete Seat

```http
DELETE /rooms/seats/:id
```

Required permission:

```txt
rooms:update
```

---

# Roles and Permissions

## Admin

The `admin` role has all permissions:

```txt
movies:create
movies:read
movies:update
movies:delete

rooms:create
rooms:read
rooms:update
rooms:delete

schedules:create
schedules:read
schedules:update
schedules:delete

reservations:create
reservations:read
reservations:update
reservations:cancel
reservations:delete

users:create
users:read
users:update
users:delete
```

## Customer

The `customer` role can read movies and schedules, and manage reservations:

```txt
movies:read
schedules:read
reservations:create
reservations:read
reservations:cancel
```

## Ticket Seller

The `ticket_seller` role can read movies, rooms and schedules, and manage reservations:

```txt
movies:read
rooms:read
schedules:read
reservations:create
reservations:read
reservations:cancel
```
