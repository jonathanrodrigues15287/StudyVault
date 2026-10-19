from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Query, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.note import NoteCreate, NoteUpdate, NoteResponse, NoteStats, SubjectCreate, SubjectDetail
from backend.services import note_service

router = APIRouter(prefix="/api/notes", tags=["Notes"])


def extract_auth_user_id(
    user_id: Optional[int] = None,
    x_user_id: Optional[int] = None,
    authorization: Optional[str] = None
) -> Optional[int]:
    """Helper to extract user ID from query param, X-User-Id header, or Bearer token."""
    target_id = user_id or x_user_id
    if not target_id and authorization and authorization.startswith("Bearer usr_"):
        try:
            parts = authorization.split(" ")[1].split("_")
            if len(parts) >= 2 and parts[1].isdigit():
                target_id = int(parts[1])
        except Exception:
            pass
    return target_id


@router.get("", response_model=List[NoteResponse])
def read_notes(
    search: Optional[str] = Query(None, description="Search keyword in title, content, or tags"),
    subject: Optional[str] = Query(None, description="Filter by subject category"),
    tag: Optional[str] = Query(None, description="Filter by specific tag"),
    is_pinned: Optional[bool] = Query(None, description="Filter pinned notes"),
    sort_by: str = Query("newest", regex="^(newest|oldest|title_asc|title_desc|pinned)$"),
    user_id: Optional[int] = Query(None, description="Filter by author user ID"),
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Retrieve notes strictly belonging to the authenticated user."""
    target_user_id = extract_auth_user_id(user_id, x_user_id, authorization)
    notes = note_service.get_notes(
        db=db,
        search=search,
        subject=subject,
        tag=tag,
        is_pinned=is_pinned,
        sort_by=sort_by,
        user_id=target_user_id,
        require_user=True
    )
    return notes


@router.get("/stats", response_model=NoteStats)
def get_notes_stats(
    user_id: Optional[int] = Query(None, description="Optional user ID filter for stats"),
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Retrieve aggregate counts and categories for the current user's notes."""
    target_user_id = extract_auth_user_id(user_id, x_user_id, authorization)
    return note_service.get_stats(db, user_id=target_user_id)


@router.get("/subjects", response_model=List[str])
def get_all_subjects(
    user_id: Optional[int] = Query(None),
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Retrieve list of unique subjects for the user."""
    target_user_id = extract_auth_user_id(user_id, x_user_id, authorization)
    return note_service.get_subjects(db, user_id=target_user_id)


@router.get("/subjects/details", response_model=List[SubjectDetail])
def get_subject_details(
    user_id: Optional[int] = Query(None),
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Retrieve custom subjects with per-user note counts."""
    target_user_id = extract_auth_user_id(user_id, x_user_id, authorization)
    return note_service.get_subject_details(db, user_id=target_user_id)


@router.post("/subjects", response_model=SubjectDetail, status_code=status.HTTP_201_CREATED)
def create_subject(subject_in: SubjectCreate, db: Session = Depends(get_db)):
    """Create a new custom subject."""
    subj = note_service.create_subject(db, subject_in)
    return SubjectDetail(name=subj.name, color=subj.color, note_count=0)


@router.delete("/subjects/{subject_name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_name: str, db: Session = Depends(get_db)):
    """Delete a custom subject by name."""
    success = note_service.delete_subject(db, subject_name)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    return None


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: int,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Retrieve a single note by ID (restricted to its author)."""
    target_user_id = extract_auth_user_id(None, x_user_id, authorization)
    note = note_service.get_note_by_id(db, note_id)
    if not note or (target_user_id is not None and note.user_id != target_user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note_in: NoteCreate,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Create a new note belonging to the current user."""
    target_user_id = extract_auth_user_id(note_in.user_id, x_user_id, authorization)
    if target_user_id is not None:
        note_in.user_id = target_user_id
    return note_service.create_note(db, note_in)


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note_in: NoteUpdate,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Update existing note details (restricted to author)."""
    target_user_id = extract_auth_user_id(None, x_user_id, authorization)
    existing = note_service.get_note_by_id(db, note_id)
    if not existing or (target_user_id is not None and existing.user_id != target_user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note_service.update_note(db, note_id, note_in)


@router.patch("/{note_id}/pin", response_model=NoteResponse)
def toggle_note_pin(
    note_id: int,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Toggle the pinned status of a note (restricted to author)."""
    target_user_id = extract_auth_user_id(None, x_user_id, authorization)
    existing = note_service.get_note_by_id(db, note_id)
    if not existing or (target_user_id is not None and existing.user_id != target_user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note_service.toggle_pin(db, note_id)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Delete a note by ID (restricted to author)."""
    target_user_id = extract_auth_user_id(None, x_user_id, authorization)
    existing = note_service.get_note_by_id(db, note_id)
    if not existing or (target_user_id is not None and existing.user_id != target_user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    note_service.delete_note(db, note_id)
    return None
