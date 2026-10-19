# StudyVault — Student Notes Manager

StudyVault is a full-stack notes application for creating, organizing, searching, and revising study notes. It combines a FastAPI backend, a vanilla HTML/CSS/JavaScript frontend, and PostgreSQL persistence.

## Features

- Create, edit, delete, pin, and search notes.
- Organize notes by subject and tags.
- Filter notes by subject, tag, pinned status, and user.
- Register users, log in, switch users, and filter notes to the current user.
- Manage custom subjects and view note counts.
- View dashboard statistics and database health.
- Use dark/light themes and responsive grid/list layouts.
- Scan images in the browser with Tesseract.js OCR.
- Create notes with browser speech recognition or dictate directly into the editor.
- Continue using a localStorage-backed replica when the API is unavailable.
- Explore the generated API documentation with Swagger UI or ReDoc.

## Technology

- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn
- **Database:** PostgreSQL
- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **Browser integrations:** Tesseract.js OCR and Web Speech API

## Project Structure

```text
dbms_mini/
├── backend/
│   ├── main.py                 # FastAPI application and static frontend serving
│   ├── database.py             # PostgreSQL engine, startup checks, and sessions
│   ├── models/                 # SQLAlchemy models for users, notes, and subjects
│   ├── schemas/                # Pydantic request and response schemas
│   ├── routers/                # Authentication and notes API routes
│   └── services/               # Authentication and notes business logic
├── frontend/
│   ├── index.html              # Single-page application shell
│   ├── css/
│   │   ├── style.css           # Main styles and components
│   │   └── responsive.css      # Responsive layout rules
│   └── js/
│       ├── api.js              # API client and localStorage fallback
│       ├── notes.js             # Notes state and operations
│       └── ui.js                # UI controllers and browser integrations
├── .env.example                # Environment variable template
├── requirements.txt            # Python dependencies
├── start_app.bat               # Windows launcher
└── test_lecture_slide.png      # Sample image for OCR testing
```

## Requirements

- Python 3.10 or newer
- PostgreSQL 14 or newer
- `pip`
- A modern browser

The application is configured for PostgreSQL. The bundled `notes.db` file is not used by the backend.

## Setup

### 1. Install dependencies

From the project directory:

```powershell
python -m pip install -r requirements.txt
```

Using a virtual environment is recommended:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

### 2. Configure PostgreSQL

Create a PostgreSQL database, or allow the application to create `notes_db` if the configured PostgreSQL user has permission to create databases.

Copy `.env.example` to `.env` and set the connection details:

```env
DATABASE_URL=postgresql://postgres:<your_password>@localhost:5432/notes_db
HOST=127.0.0.1
PORT=8000
CORS_ORIGINS=*
```

Do not commit `.env` or database credentials.

### 3. Start the application

#### Windows launcher

```powershell
.\start_app.bat
```

The launcher attempts to start a local PostgreSQL Windows service, opens the application URL, and starts the FastAPI server.

#### Run from the command line

```powershell
python backend\main.py
```

For development with automatic reload:

```powershell
python -m uvicorn backend.main:app --reload
```

On startup, the backend checks the database connection and creates the registered tables when needed. On Windows it also attempts to detect and start an installed PostgreSQL service.

## URLs

| URL | Purpose |
| --- | --- |
| `http://127.0.0.1:8000` | StudyVault web application |
| `http://127.0.0.1:8000/docs` | Swagger UI |
| `http://127.0.0.1:8000/redoc` | ReDoc |
| `http://127.0.0.1:8000/api/health` | API and database health |

If the frontend is opened directly from a file or another local server, its API client uses `http://127.0.0.1:8000`. Serving the frontend through FastAPI is recommended.

## REST API

All API routes use the `/api` prefix.

### Notes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/notes` | List notes; supports `search`, `subject`, `tag`, `is_pinned`, `sort_by`, and `user_id` |
| `POST` | `/api/notes` | Create a note |
| `GET` | `/api/notes/{note_id}` | Retrieve one note |
| `PUT` | `/api/notes/{note_id}` | Update a note |
| `PATCH` | `/api/notes/{note_id}/pin` | Toggle a note's pinned state |
| `DELETE` | `/api/notes/{note_id}` | Delete a note |
| `GET` | `/api/notes/stats` | Retrieve aggregate note statistics |
| `GET` | `/api/notes/subjects` | List subject names |
| `GET` | `/api/notes/subjects/details` | List subjects with colors and note counts |
| `POST` | `/api/notes/subjects` | Create a subject |
| `DELETE` | `/api/notes/subjects/{subject_name}` | Delete a subject |

Supported `sort_by` values are `newest`, `oldest`, `title_asc`, `title_desc`, and `pinned`.

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/auth/me` | Retrieve a user profile |
| `GET` | `/api/auth/users` | List registered users |
| `POST` | `/api/auth/logout` | End the client-side session |

The frontend stores the active session in localStorage and sends the user ID in the `X-User-Id` header. The generated token is also sent as an `Authorization` header.

### System

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Return service and database health |
| `GET` | `/api/database` | Return PostgreSQL connection metadata |
| `POST` | `/api/database/bring-online` | Retry database startup and connection |

## Offline local replica

The frontend initializes sample notes, users, and subjects in localStorage. If a request to the backend fails, the API client uses this local replica for supported notes, subjects, authentication, and health operations. Data written while offline remains in the browser's localStorage and is not automatically migrated to PostgreSQL.

To clear the local replica, remove the `studyvault_*` entries from the browser's localStorage and reload the application.

## Troubleshooting

- **Database connection failure:** Confirm PostgreSQL is installed and running, then verify `DATABASE_URL` in `.env`.
- **Permission errors when creating `notes_db`:** Create the database manually or grant the configured PostgreSQL user permission to create databases.
- **Port already in use:** Change `PORT` in `.env` and open the corresponding URL.
- **OCR unavailable:** OCR loads in the browser through Tesseract.js and requires network access to load its client-side resources.
- **Voice input unavailable:** Speech recognition depends on browser support and microphone permissions.
- **CORS errors:** Set `CORS_ORIGINS` to a comma-separated list of trusted frontend origins instead of `*` when serving the frontend separately.

## Dependencies

See [requirements.txt](requirements.txt) for the complete list:

- `fastapi` and `uvicorn[standard]` — web API and ASGI server.
- `sqlalchemy` and `psycopg2-binary` — PostgreSQL persistence.
- `pydantic` — request validation and serialization.
- `python-dotenv` — environment configuration.
- `httpx` — HTTP client and test utilities.

## License

MIT License — created for students and developers.
