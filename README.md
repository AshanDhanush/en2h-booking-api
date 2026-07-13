# EN2H Booking Platform API

A REST API for managing services and customer bookings, built as a technical assignment for EN2H.

Authenticated users can create and manage services. Customers can book those services without needing an account.

## Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (access token + refresh token) with Passport.js
- **Validation:** class-validator + global ValidationPipe
- **API Documentation:** Swagger (OpenAPI)

## Features

### Authentication
- Register a new user
- Login (returns access token + refresh token)
- Refresh access token
- Update password (authenticated)

### Service Management (authenticated users only)
- Create, update, and delete services
- Get all services / get service by ID (public)

### Booking Management (public — customers do not need an account)
- Create a booking
- Get all bookings, with optional filter by status (`pending`, `confirmed`, `cancelled`, `completed`)
- Get booking by ID
- Update booking status (authenticated)
- Cancel a booking

## Business Rules Implemented

| Rule | How it's enforced |
|---|---|
| A booking must belong to an existing service | Service is looked up before creating the booking — returns `404` if not found |
| Booking dates cannot be in the past | Date + time are validated against the current time — returns `400` |
| Cancelled bookings cannot be marked as completed | Status transition check — returns `400` |
| Only authenticated users can manage services | JWT guard on create/update/delete service routes |
| Customers can create bookings without authentication | Booking creation route is public |
| Prevent duplicate bookings (bonus) | Same service + date + time is rejected with `409 Conflict` (cancelled bookings free up the slot) |

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | — | Register a new user |
| POST | `/api/v1/auth/login` | — | Login |
| POST | `/api/v1/auth/refresh-token` | — | Get a new access token |
| PATCH | `/api/v1/auth/update-password` | 🔒 | Change password |
| POST | `/api/v1/services` | 🔒 | Create a service |
| GET | `/api/v1/services` | — | Get all services |
| GET | `/api/v1/services/:id` | — | Get service by ID |
| PATCH | `/api/v1/services/:id` | 🔒 | Update a service |
| DELETE | `/api/v1/services/:id` | 🔒 | Delete a service |
| POST | `/api/v1/bookings` | — | Create a booking |
| GET | `/api/v1/bookings?status=` | — | Get all bookings (optional status filter) |
| GET | `/api/v1/bookings/:id` | — | Get booking by ID |
| PATCH | `/api/v1/bookings/:id/status` | 🔒 | Update booking status |
| DELETE | `/api/v1/bookings/:id/cancel` | — | Cancel a booking |

Full interactive documentation is available in Swagger once the app is running:

```
http://localhost:3000/api/docs
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally (or use Docker)

### 1. Clone the repository

```bash
git clone https://github.com/AshanDhanush/en2h-booking-api.git
cd en2h-booking-api
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in your PostgreSQL credentials and JWT secrets:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=en2h_booking

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the database

Create an empty database in PostgreSQL (e.g. with pgAdmin or psql):

```sql
CREATE DATABASE en2h_booking;
```

Tables are created automatically on first run (TypeORM `synchronize` is enabled for this assignment — see note below).

### 5. Run the app

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1` and Swagger at `http://localhost:3000/api/docs`.

## How to Test the Business Rules

1. **Register + login** via Swagger, copy the `accessToken`, click **Authorize** and paste it.
2. **Create a service** (POST `/services`) and copy its `id`.
3. **Create a booking** (POST `/bookings`) with that `serviceId` and a future date → `201`.
4. **Send the same booking again** → `409` duplicate slot.
5. **Try a past date** → `400`.
6. **Try a fake serviceId** → `404`.
7. **Cancel the booking** (DELETE `/bookings/:id/cancel`) → status becomes `cancelled`.


## Project Structure

```
src/
├── auth/                  # Register, login, refresh token, update password
├── services/              # Service CRUD (authenticated)
├── bookings/              # Booking creation and management (public)
├── common/
│   ├── guards/            # JWT auth guard
│   ├── filters/           # Global exception filter
│   └── decorators/        # @CurrentUser() decorator
└── database/
    └── entities/          # User, Service, Booking entities
```

