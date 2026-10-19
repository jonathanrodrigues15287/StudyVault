import os
import time
import subprocess
import logging
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger("dbms_mini.database")

# Project root directory
import sys
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:jonu0607@localhost:5432/notes_db"
).strip()

# SQLAlchemy 1.4+ / 2.0 requires postgresql:// instead of postgres://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Enforce PostgreSQL
if not DATABASE_URL.startswith("postgresql"):
    raise ValueError(
        f"Invalid database dialect '{DATABASE_URL.split('://')[0]}'. "
        "This project has been transitioned exclusively to PostgreSQL."
    )

# PostgreSQL engine with connection pooling and keepalive
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency to yield a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def find_postgres_service_name() -> Optional[str]:
    """Auto-detect PostgreSQL Windows service name if running on Windows."""
    if os.name != "nt":
        return None

    candidates = [
        "postgresql-x64-18",
        "postgresql-x64-17",
        "postgresql-x64-16",
        "postgresql-x64-15",
        "postgresql-x64-14",
        "postgresql"
    ]
    for name in candidates:
        try:
            res = subprocess.run(
                ["sc", "query", name],
                capture_output=True,
                text=True,
                timeout=3
            )
            if res.returncode == 0 and "SERVICE_NAME" in res.stdout:
                return name
        except Exception:
            continue

    try:
        res = subprocess.run(
            ["powershell", "-NoProfile", "-Command", "(Get-Service *postgres* -ErrorAction SilentlyContinue | Select-Object -First 1).Name"],
            capture_output=True,
            text=True,
            timeout=4
        )
        if res.returncode == 0 and res.stdout.strip():
            return res.stdout.strip()
    except Exception:
        pass

    return None


def start_postgres_service() -> bool:
    """Attempt to bring the PostgreSQL Windows service online if it is stopped."""
    if os.name != "nt":
        try:
            subprocess.run(["systemctl", "start", "postgresql"], capture_output=True, timeout=5)
            return True
        except Exception:
            return False

    service_name = find_postgres_service_name()
    if not service_name:
        return False

    # Check if already running
    try:
        query_res = subprocess.run(["sc", "query", service_name], capture_output=True, text=True, timeout=3)
        if "RUNNING" in query_res.stdout:
            return True
    except Exception:
        pass

    # Attempt to start service via 'net start'
    try:
        start_res = subprocess.run(["net", "start", service_name], capture_output=True, text=True, timeout=10)
        out_msg = (start_res.stdout + start_res.stderr).lower()
        if start_res.returncode == 0 or "already been started" in out_msg:
            time.sleep(2)
            return True
    except Exception:
        pass

    # Fallback to PowerShell Start-Service
    try:
        subprocess.run(
            ["powershell", "-NoProfile", "-Command", f"Start-Service -Name '{service_name}' -ErrorAction SilentlyContinue"],
            capture_output=True,
            text=True,
            timeout=10
        )
        time.sleep(2)
        return True
    except Exception:
        pass

    return False


def ensure_database_exists():
    """Ensure the target PostgreSQL database (notes_db) exists; creates it if absent."""
    db_name = engine.url.database or "notes_db"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1;"))
            return True
    except Exception as e:
        err_str = str(e).lower()
        if "does not exist" in err_str or "3d000" in err_str:
            # Connect to maintenance database 'postgres' to create notes_db
            try:
                maintenance_url = engine.url.set(database="postgres")
                m_engine = create_engine(maintenance_url, isolation_level="AUTOCOMMIT")
                with m_engine.connect() as m_conn:
                    m_conn.execute(text(f'CREATE DATABASE "{db_name}";'))
                m_engine.dispose()
                time.sleep(1)
                return True
            except Exception as ce:
                logger.warning(f"Failed to auto-create database {db_name}: {ce}")
        return False


def ensure_database_online(max_retries: int = 5, retry_delay: float = 1.5) -> dict:
    """
    Ensure the PostgreSQL database service is running, connected, and all tables
    (users, notes, subjects) and schema constraints are online whenever the app is open.
    """
    last_error = None
    service_started = False

    for attempt in range(1, max_retries + 1):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1;"))

            # Create all registered tables (users, notes, subjects)
            Base.metadata.create_all(bind=engine)

            # Ensure notes table has user_id foreign key column
            with engine.connect() as conn:
                conn.execute(
                    text("ALTER TABLE notes ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;")
                )
                conn.commit()

            logger.info("🟢 PostgreSQL database is ONLINE and schema verified.")
            return {
                "online": True,
                "status": "online",
                "message": "Database is online and ready.",
                "database": engine.url.database,
                "host": engine.url.host,
                "attempts": attempt
            }
        except Exception as e:
            last_error = str(e)
            logger.warning(f"Database connection attempt {attempt}/{max_retries} failed: {e}")

            # Try starting Windows service on first failure
            if not service_started:
                service_started = start_postgres_service()
                if service_started:
                    logger.info("Attempted to start PostgreSQL service.")

            # Try checking if database needs to be created
            ensure_database_exists()
            time.sleep(retry_delay)

    return {
        "online": False,
        "status": "offline",
        "message": f"Unable to bring database online automatically: {last_error}",
        "database": engine.url.database,
        "host": engine.url.host,
        "attempts": max_retries
    }


def get_database_info():
    """Get metadata about the active PostgreSQL database, status, and health."""
    db_name = engine.url.database or "notes_db"
    size_formatted = "Unknown"
    pg_version = "PostgreSQL"
    is_online = False
    status_msg = "Offline"

    try:
        with engine.connect() as conn:
            is_online = True
            status_msg = "Online"
            size_res = conn.execute(
                text("SELECT pg_size_pretty(pg_database_size(current_database()));")
            ).scalar()
            if size_res:
                size_formatted = str(size_res)
            version_res = conn.execute(text("SHOW server_version;")).scalar()
            if version_res:
                pg_version = f"PostgreSQL {version_res}"
    except Exception as e:
        status_msg = f"Offline: {str(e)[:100]}"

    return {
        "online": is_online,
        "status": status_msg,
        "engine": pg_version,
        "database": db_name,
        "host": engine.url.host or "localhost",
        "port": engine.url.port or 5432,
        "username": engine.url.username or "postgres",
        "is_sqlite": False,
        "file_name": f"{db_name}",
        "file_path": f"{engine.url.host}:{engine.url.port}/{db_name}",
        "file_size_bytes": 0,
        "file_size_formatted": size_formatted
    }
