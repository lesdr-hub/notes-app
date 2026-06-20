# [ noted ]

A Google Keep–style note-taking app built with Node.js, Express, MongoDB, and EJS. Built as a midterm project for a Software Development Bootcamp, focused on server-side fundamentals: routing, authentication, RESTful API design, and database modeling.

## Features

- **Note CRUD** - create, edit, pin/unpin, recolor, and delete notes
- **Pinned / unpinned sections** - notes are sorted and grouped server-side
- **Local authentication** - register/login with hashed passwords (bcrypt), persistent sessions stored in MongoDB
- **Account management** - log out or permanently delete your account (and all associated notes) from an account panel
- **Theme preference** - light/dark mode, persisted per-user in the database
- **Partial re-rendering** - note list updates via a dedicated server-rendered partial route, fetched and swapped into the DOM on the client, instead of full page reloads

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js + Express |
| Database | MongoDB + Mongoose |
| Sessions | express-session, persisted via connect-mongo |
| Auth | Passport (passport-local) + bcrypt |
| Views | EJS |
| Client | Vanilla JS (fetch + DOM manipulation, no frontend framework) |

## Project Structure

```
notes-app/
├── server.js                  # App entry point, middleware setup
├── config/
│   ├── db.js                  # MongoDB connection
│   └── passport.js            # Passport local strategy + serialization
├── src/
│   ├── routes/                # auth.js, dashboard.js (pages), api.js
│   ├── controllers/
│   │   ├── pages/             # res.render() - dashboard, auth
│   │   └── api/                # res.json() - notes, users, settings
│   ├── models/                 # User.js, Note.js (Mongoose schemas)
│   └── middleware/             # auth guards, error handlers, locals
├── views/
│   ├── pages/                  # full-page templates
│   └── partials/               # note cards, note-list, settings, account panels
└── public/
    ├── css/
    └── js/                     # client-side fetch logic, DOM event handling
```

Routes are split deliberately into two categories: **pages** (use `res.render()`, return HTML - including partials used for client-side re-rendering) and **api** (use `res.json()`, used purely for data mutations like create/update/delete).

## Setup

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance - either a local install or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/lesdr-hub/notes-app.git
   cd notes-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:

   | Variable | Description |
   |---|---|
   | `PORT` | Port the server runs on (e.g. `3000`) |
   | `MONGODB_URI` | Your MongoDB connection string |
   | `SESSION_SECRET` | A long, random string used to sign session cookies |

   Example:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/notes-app
   SESSION_SECRET=replace-this-with-something-random
   ```

4. Start the dev server
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## API Reference

All `/api` routes require an authenticated session and return JSON. Page routes (`/dashboard`, `/auth/*`) return rendered HTML.

### Notes - `/api/notes`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Get all notes for the logged-in user, split into `pinnedNotes` / `unpinnedNotes` |
| GET | `/api/notes/:id` | Get a single note by ID (must belong to the requesting user) |
| POST | `/api/notes` | Create a note. Body: `{ title, content, color, pinned }` |
| PATCH | `/api/notes/:id` | Update a note. Accepts any subset of `{ title, content, color, pinned }` |
| DELETE | `/api/notes/:id` | Delete a note by ID |

Notes with empty `title` and `content` are automatically discarded rather than saved.

### User - `/api/users`

| Method | Endpoint | Description |
|---|---|---|
| PATCH | `/api/users` | Update `username` and/or `password` |
| DELETE | `/api/users` | Permanently delete the account and all associated notes, then log out |

### Settings - `/api/settings`

| Method | Endpoint | Description |
|---|---|---|
| PATCH | `/api/settings` | Update user preferences. Body: `{ preferences: { theme } }` |

### Auth - `/auth`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/auth/login` | Render login page |
| POST | `/auth/login` | Authenticate and create a session |
| GET | `/auth/register` | Render registration page |
| POST | `/auth/register` | Create a new account |
| POST | `/auth/logout` | Destroy the session and log out |

### Dashboard - `/dashboard`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Full dashboard page (notes, user info) |
| GET | `/dashboard/partials/note-list` | Re-rendered note list partial - fetched by the client after any note mutation to refresh the grid without a full page reload |

## Known Limitations

- The entire note list is re-fetched and re-rendered after every single create/edit/delete/pin action, rather than patching just the affected note. This is fine at small scale but won't hold up well with a large number of notes - see "Future Plans" below.
- No rate limiting on auth or API routes yet.
- No pagination or cap on number of notes per user.
- Color picker on note cards currently opens the full note editor rather than a lightweight inline swatch picker.

## Future Plans

**Security**
- Google OAuth + email verification
- Password recovery flow

**Stability**
- Rate limiting on auth and API routes
- Pagination / limits on notes returned per request, instead of fetching a user's entire note collection at once
- General query and render optimizations

**Features**
- Archiving system (a core part of the Google Keep–style workflow this project is modeled after)
- Embedded to-do list / task system
- Basic usage analytics

**Quality of Life**
- Visual polish pass on the dashboard
- A basic landing page
- Possibly porting the frontend to Next.js + React + Tailwind, mainly to get TypeScript validation on the client and a more familiar component model - EJS was a bit of a learning curve syntactically, though it became much easier with use, and writing render logic server-side genuinely helped with reasoning about data flow during development.

## Reflections

See ```reflections.md``` in ```/dev/notes```.