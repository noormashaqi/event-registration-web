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

- **Dashboard** — overview stats from the API
- **Category Management** — create, edit, view, activate/deactivate, and delete categories

## Environment

| Variable            | Default                        | Description        |
|---------------------|--------------------------------|--------------------|
| `VITE_API_BASE_URL` | `http://localhost:5080/api`    | Backend API base   |
| `VITE_APP_NAME`     | `Event Registration System`    | App display name   |
