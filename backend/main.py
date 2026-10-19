import os
import sys
from pathlib import Path

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.database import engine, get_database_info, ensure_database_online
from backend.routers import notes_router, auth_router


# Lifespan context: automatically bring database online and ensure schema on app start
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure PostgreSQL service is online, database exists, and all tables are migrated
    ensure_database_online()
    yield


app = FastAPI(
    title="Student Notes Manager API",
    description="RESTful API for managing student notes, subjects, study tags, and user authentication.",
    version="1.1.0",
    lifespan=lifespan
)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "*").split(",")
allow_all = origins == ["*"] or "*" in origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else [o.strip() for o in origins],
    allow_credentials=False if allow_all else True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(notes_router)


# Health & Database status endpoints
@app.get("/api/health", tags=["Health"])
def health_check():
    db_info = get_database_info()
    return {
        "status": "healthy" if db_info.get("online") else "degraded",
        "service": "Student Notes Manager API",
        "database": engine.url.drivername,
        "database_info": db_info
    }


@app.get("/api/database", tags=["Database"])
def database_info():
    """Detailed PostgreSQL metadata, host, database size, and connection stats."""
    return get_database_info()


@app.post("/api/database/bring-online", tags=["Database"])
def trigger_bring_database_online():
    """Trigger on-demand database wake and reconnection."""
    result = ensure_database_online()
    db_info = get_database_info()
    return {
        "result": result,
        "database_info": db_info
    }


# Mount Frontend Static Assets
frontend_dir = Path(__file__).resolve().parent.parent / "frontend"
if frontend_dir.exists():
    css_dir = frontend_dir / "css"
    js_dir = frontend_dir / "js"
    if css_dir.exists():
        app.mount("/css", StaticFiles(directory=str(css_dir)), name="css")
    if js_dir.exists():
        app.mount("/js", StaticFiles(directory=str(js_dir)), name="js")

    @app.get("/", include_in_schema=False)
    def serve_frontend():
        index_file = frontend_dir / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        return {"message": "Student Notes Manager API is running. Check /docs for API documentation."}


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
