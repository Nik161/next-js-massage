# REST API

The web app and the future mobile app use the same JSON API under `/api`.
Route handlers live in `app/api`, the booking logic in `app/lib/bookings.ts`.

## Authentication

Two ways to authenticate, checked in this order:

1. **Bearer token** (mobile): `Authorization: Bearer <token>`. Get a token from
   `POST /api/auth/token`. It is signed with `AUTH_SECRET` and is valid for
   30 days. There is no refresh or revocation yet: sign in again when it expires.
2. **Session cookie** (web): the Auth.js cookie set when signing in on `/login`.
   The browser sends it automatically.

`/api` is not covered by the proxy, so every protected handler checks access
itself (`requireUser` / `requireAdmin` in `app/lib/api/auth.ts`).

## Roles

| Role    | Can do                                                      |
| ------- | ----------------------------------------------------------- |
| `user`  | See and create **their own** bookings, look up free slots   |
| `admin` | See all bookings, edit and delete them, change their status |

A regular user asking for someone else's booking gets `404`, not `403`, so
the API does not reveal that the booking exists.

## Errors

Every error has the same shape:

```json
{
  "error": "Missing Fields. Failed to create Booking.",
  "fieldErrors": { "time": ["Please select a time."] }
}
```

`fieldErrors` is only present for validation errors.

| Status | Meaning                                              |
| ------ | ---------------------------------------------------- |
| 400    | Invalid JSON, query or body (see `fieldErrors`)      |
| 401    | Not signed in, wrong credentials or invalid token    |
| 403    | Signed in, but the action is admin only              |
| 404    | Booking does not exist or is not visible to the user |
| 409    | The time slot is already taken                       |
| 500    | Unexpected server error (details are only logged)    |

## Endpoints

### `POST /api/auth/token`

Public. Exchanges credentials for a Bearer token.

```http
POST /api/auth/token
Content-Type: application/json

{ "email": "user@example.com", "password": "secret1" }
```

```json
{
  "token": "eyJhbGciOi…",
  "expiresIn": 2592000,
  "user": {
    "id": "…",
    "name": "Анна",
    "email": "user@example.com",
    "role": "user"
  }
}
```

`expiresIn` is in seconds. Wrong credentials → `401`.

### `GET /api/me`

Signed in. Returns `{ "user": { id, name, email, role } }`.

### `GET /api/therapists`

Public. Returns `{ "therapists": [{ id, name, description, image_url }] }`.

### `GET /api/massage_types`

Public. Returns `{ "massageTypes": [{ id, name, description }] }`.
A booking's `massage_type` is the `id` of one of these.

### `GET /api/massage_slots`

Signed in. Free start times for a therapist on a day.

| Query param        | Required | Description                                     |
| ------------------ | -------- | ----------------------------------------------- |
| `therapistId`      | yes      | Therapist uuid                                  |
| `date`             | yes      | `YYYY-MM-DD`                                    |
| `duration`         | yes      | Minutes, one of `MASSAGE_DURATIONS`             |
| `excludeBookingId` | no       | When editing: the booking must not block itself |

Returns `{ "slots": ["09:00", "09:30", …] }` (salon local time).

### `GET /api/bookings`

Signed in. Users get their own bookings, admins get everyone's.
Six bookings per page, newest first.

| Query param | Default | Description                                                          |
| ----------- | ------- | -------------------------------------------------------------------- |
| `query`     | `""`    | Search by client name, email, status, massage type, date or duration |
| `page`      | `1`     | Page number, starting at 1                                           |

```json
{ "bookings": [Booking, …], "totalPages": 3 }
```

### `POST /api/bookings`

Signed in. Creates a booking for the current user with status `booked` and
emails the therapist and the client. Returns `201 { "booking": Booking }`.

```json
{
  "therapist_id": "e67190e7-db41-4612-9963-6ada87745747",
  "massage_type": "thai",
  "duration": 60,
  "date": "2026-10-20",
  "time": "14:00"
}
```

The time must be one of the free slots from `/api/massage_slots`,
otherwise the response is `409`.

### `GET /api/bookings/:id`

Signed in. Returns `{ "booking": Booking }`. Users can only open their own.

### `PUT /api/bookings/:id`

Admin. Replaces the booking's details; same body as `POST /api/bookings`.
Emails the therapist and the client. Returns `{ "booking": Booking }`.

### `DELETE /api/bookings/:id`

Admin. Returns `204` with no body.

### `PATCH /api/bookings/:id/status`

Admin. Body `{ "status": "confirmed" }` or `{ "status": "completed" }`.
Confirming a booking emails the client.
Returns `204` with no body.

## The `Booking` object

```json
{
  "id": "17a132f6-59a9-4b57-b004-a1f166bd491e",
  "date": "2026-10-20 14:00",
  "massage_type": "thai",
  "duration": 60,
  "status": "booked",
  "is_social": true,
  "user_id": "…",
  "user_name": "Анна",
  "email": "user@example.com",
  "image_url": null,
  "therapist_id": "…",
  "therapist_name": "Нико"
}
```

`date` is the start in salon local time, `YYYY-MM-DD HH:MI`.
`status` is one of `booked`, `confirmed`, `canceled`, `completed`. A confirmed
booking is returned as `completed` once its session (start + duration) is over.

## Example: mobile client

```ts
const BASE = "https://luxury-massage.vercel.app/api";

const { token } = await fetch(`${BASE}/auth/token`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
}).then((r) => r.json());

const { bookings } = await fetch(`${BASE}/bookings?page=1`, {
  headers: { Authorization: `Bearer ${token}` },
}).then((r) => r.json());
```

Native apps don't need CORS. A browser client on another origin would need
CORS headers added to the API first.
