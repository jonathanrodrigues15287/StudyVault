from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Query, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.user import UserRegister, UserLogin, UserResponse, AuthResponse
from backend.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
@router.post("/join", response_model=AuthResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Join / Register a new user with a username and password."""
    try:
        user = auth_service.register_user(db, user_data)
        token = auth_service.generate_auth_token(user)
        return AuthResponse(
            id=user.id,
            username=user.username,
            token=token,
            message=f"Welcome to StudyVault, {user.username}! Your account has been created.",
            created_at=user.created_at
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=AuthResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Log in an existing user with username and password."""
    user = auth_service.authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. Please verify your credentials."
        )

    token = auth_service.generate_auth_token(user)
    return AuthResponse(
        id=user.id,
        username=user.username,
        token=token,
        message=f"Welcome back, {user.username}!",
        created_at=user.created_at
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    user_id: Optional[int] = Query(None, description="Optional user ID query param"),
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get the currently logged in user profile."""
    target_id = user_id or x_user_id
    if not target_id and authorization and authorization.startswith("Bearer usr_"):
        try:
            # Parse usr_{id}_{token}
            parts = authorization.split(" ")[1].split("_")
            if len(parts) >= 2 and parts[1].isdigit():
                target_id = int(parts[1])
        except Exception:
            pass

    if not target_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please log in or provide user credentials."
        )

    user = auth_service.get_user_by_id(db, target_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserResponse(
        id=user.id,
        username=user.username,
        created_at=user.created_at,
        notes_count=len(user.notes) if user.notes else 0
    )


@router.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    """List all registered users (for user switching, discovery, and stats)."""
    users = auth_service.get_all_users(db)
    return [
        UserResponse(
            id=u.id,
            username=u.username,
            created_at=u.created_at,
            notes_count=len(u.notes) if u.notes else 0
        )
        for u in users
    ]


@router.post("/logout")
def logout():
    """Client-side logout endpoint."""
    return {"message": "Logged out successfully"}
