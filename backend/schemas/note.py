from typing import Optional, List, Union
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title of the note")
    content: str = Field(..., min_length=1, description="Body content of the note")
    subject: str = Field(default="General", max_length=100, description="Academic subject / category")
    tags: Optional[Union[str, List[str]]] = Field(default="", description="Tags associated with the note")
    is_pinned: bool = Field(default=False, description="Whether the note is pinned to top")
    color: str = Field(default="default", max_length=30, description="Visual theme or color accent")
    user_id: Optional[int] = Field(default=None, description="Owner user ID if created by authenticated user")

    @field_validator("tags", mode="before")
    @classmethod
    def normalize_tags(cls, v):
        if isinstance(v, list):
            return ", ".join([str(item).strip() for item in v if str(item).strip()])
        if isinstance(v, str):
            return ", ".join([t.strip() for t in v.split(",") if t.strip()])
        return ""


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    subject: Optional[str] = Field(None, max_length=100)
    tags: Optional[Union[str, List[str]]] = None
    is_pinned: Optional[bool] = None
    color: Optional[str] = None
    user_id: Optional[int] = None

    @field_validator("tags", mode="before")
    @classmethod
    def normalize_tags(cls, v):
        if v is None:
            return None
        if isinstance(v, list):
            return ", ".join([str(item).strip() for item in v if str(item).strip()])
        if isinstance(v, str):
            return ", ".join([t.strip() for t in v.split(",") if t.strip()])
        return ""


class NoteResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    author: Optional[str] = None
    title: str
    content: str
    subject: str
    tags: List[str]
    is_pinned: bool
    color: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags_to_list(cls, v):
        if isinstance(v, list):
            return v
        if isinstance(v, str) and v:
            return [t.strip() for t in v.split(",") if t.strip()]
        return []

    class Config:
        from_attributes = True


class NoteStats(BaseModel):
    total_notes: int
    total_subjects: int
    total_pinned: int
    subjects: List[str]


class SubjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Subject name")
    color: Optional[str] = Field(default="blue", max_length=30)


class SubjectDetail(BaseModel):
    name: str
    color: str = "blue"
    note_count: int = 0

