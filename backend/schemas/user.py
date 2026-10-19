from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Unique username (3-50 characters)")
    password: str = Field(..., min_length=8, max_length=16, description="Password (8-16 characters)")


class UserLogin(BaseModel):
    username: str = Field(..., min_length=1, max_length=50, description="Username")
    password: str = Field(..., min_length=8, max_length=16, description="Password (8-16 characters)")


class UserResponse(BaseModel):
    id: int
    username: str
    created_at: Optional[datetime] = None
    notes_count: Optional[int] = 0

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    id: int
    username: str
    token: str
    message: str
    created_at: Optional[datetime] = None
