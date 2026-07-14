# Event Registration Web

React + TypeScript frontend for the Event Registration System.

## Requirements

- **Node.js** 20.19+ (required by Vite 8)
- Backend API running at `http://localhost:5080` (or configure via `.env`)

## Setup

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Type-check + production build |
| `npm run lint` | Run ESLint               |
| `npm run preview` | Preview production build |

## Features

- **Dashboard** — overview stats from the API, with quick links into upcoming events
- **Category Management** — create, edit, view, activate/deactivate, and delete categories
- **Events** — search/filter (by name, location, category, active status, and date range), paginated table, create, edit, delete, and a detail view (category, status, capacity, available seats, and registration deadline)
- **Participants** — search, filter, view details, create, edit, and delete participants
- **Registrations** — register participants to an event (with live capacity checks), search/filter an event's registrations, and cancel active registrations

## Routing

The app uses the browser History API (`src/utils/navigation.ts`) instead of in-memory-only state, so refreshing the page or sharing a URL keeps you on the same screen. Supported routes: `/dashboard`, `/categories`, `/events`, `/events/:id`, and `/participants`; anything else renders a 404 page.

## Environment

| Variable            | Default                        | Description        |
|---------------------|---------------------------------|--------------------|
| `VITE_API_BASE_URL` | `http://localhost:5080/api`    | Backend API base   |
| `VITE_APP_NAME`     | `Event Registration System`    | App display name   |

## Known limitations

- No authentication/authorization — the app assumes a single trusted user against a local API.
- No optimistic UI or client-side caching between pages; every navigation re-fetches from the API.
- Category and Event forms validate against the same rules as the backend, but the backend remains the source of truth (e.g. server-side capacity checks on update).
- The registrations list/counts are refetched independently by `RegistrationsSection`; there's no shared cache invalidation across the dashboard, events list, and event detail pages.
