import re
import hashlib
import secrets
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.models.user import User
from backend.schemas.user import UserRegister


def hash_password(password: str) -> str:
    """Hash a plaintext password using PBKDF2-HMAC-SHA256 with a unique salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100_000
    )
    return f"{salt}${key.hex()}"


def verify_password(stored_password: str, provided_password: str) -> bool:
    """Verify a plaintext password against the stored salt$hash string."""
    if not stored_password or "$" not in stored_password:
        return False
    try:
        salt, key_hex = stored_password.split("$", 1)
        new_key = hashlib.pbkdf2_hmac(
            "sha256",
            provided_password.encode("utf-8"),
            salt.encode("utf-8"),
            100_000
        )
        return secrets.compare_digest(new_key.hex(), key_hex)
    except Exception:
        return False


def generate_auth_token(user: User) -> str:
    """Generate a lightweight bearer authentication token."""
    return f"usr_{user.id}_{secrets.token_urlsafe(24)}"


def register_user(db: Session, user_data: UserRegister) -> User:
    """
    Validate and register a new user with username and password.
    Raises ValueError if username is invalid or already taken.
    """
    username = user_data.username.strip()
    password = user_data.password.strip()

    # Username format validation: alphanumeric + underscores/hyphens, 3-30 chars
    if not re.match(r"^[a-zA-Z0-9_.-]{3,30}$", username):
        raise ValueError(
            "Username must be 3-30 characters long and contain only letters, numbers, '.', '_', or '-'"
        )

    if len(password) < 4:
        raise ValueError("Password must be at least 4 characters long")

    # Check case-insensitive uniqueness
    existing_user = db.query(User).filter(func.lower(User.username) == username.lower()).first()
    if existing_user:
        raise ValueError(f"Username '{username}' is already taken. Please choose another.")

    pwd_hash = hash_password(password)
    new_user = User(
        username=username,
        password_hash=pwd_hash
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception:
        db.rollback()
        raise


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Find a user and verify their password. Returns User if valid, None otherwise."""
    username_clean = username.strip()
    user = db.query(User).filter(func.lower(User.username) == username_clean.lower()).first()
    if not user:
        return None
    if not verify_password(user.password_hash, password.strip()):
        return None
    return user


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Get a user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get a user by username."""
    return db.query(User).filter(func.lower(User.username) == username.strip().lower()).first()


def get_all_users(db: Session) -> List[User]:
    """Return all registered users ordered by registration date."""
    return db.query(User).order_by(User.id.asc()).all()


def delete_user(db: Session, user_id: int) -> bool:
    """Permanently delete a user and cascade delete their notes."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    try:
        db.delete(user)
        db.commit()
        return True
    except Exception:
        db.rollback()
        raise

