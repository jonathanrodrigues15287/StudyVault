from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.note import NoteCreate, NoteUpdate, NoteResponse, NoteStats, SubjectCreate, SubjectDetail
from backend.services import note_service

router = APIRouter(prefix="/api/notes", tags=["Notes"])


@router.get("", response_model=List[NoteResponse])
def read_notes(
    search: Optional[str] = Query(None, description="Search keyword in title, content, or tags"),
    subject: Optional[str] = Query(None, description="Filter by subject category"),
    tag: Optional[str] = Query(None, description="Filter by specific tag"),
    is_pinned: Optional[bool] = Query(None, description="Filter pinned notes"),
    sort_by: str = Query("newest", regex="^(newest|oldest|title_asc|title_desc|pinned)$"),
    user_id: Optional[int] = Query(None, description="Filter by author user ID"),
    db: Session = Depends(get_db)
):
    """Retrieve all notes matching filter criteria."""
    notes = note_service.get_notes(
        db=db,
        search=search,
        subject=subject,
        tag=tag,
        is_pinned=is_pinned,
        sort_by=sort_by,
        user_id=user_id
    )
    return notes


@router.get("/stats", response_model=NoteStats)
def get_notes_stats(
    user_id: Optional[int] = Query(None, description="Optional user ID filter for stats"),
    db: Session = Depends(get_db)
):
    """Retrieve aggregate counts and categories for notes."""
    return note_service.get_stats(db, user_id=user_id)


@router.get("/subjects", response_model=List[str])
def get_all_subjects(db: Session = Depends(get_db)):
    """Retrieve list of all unique subjects (merged from subjects table + existing notes)."""
    return note_service.get_subjects(db)


@router.get("/subjects/details", response_model=List[SubjectDetail])
def get_subject_details(db: Session = Depends(get_db)):
    """Retrieve all custom subjects with note counts."""
    return note_service.get_subject_details(db)


@router.post("/subjects", response_model=SubjectDetail, status_code=status.HTTP_201_CREATED)
def create_subject(subject_in: SubjectCreate, db: Session = Depends(get_db)):
    """Create a new custom subject."""
    subj = note_service.create_subject(db, subject_in)
    count = 0
    return SubjectDetail(name=subj.name, color=subj.color, note_count=count)


@router.delete("/subjects/{subject_name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_name: str, db: Session = Depends(get_db)):
    """Delete a custom subject by name."""
    success = note_service.delete_subject(db, subject_name)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    return None


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    """Retrieve a single note by ID."""
    note = note_service.get_note_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(note_in: NoteCreate, db: Session = Depends(get_db)):
    """Create a new note."""
    return note_service.create_note(db, note_in)


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note_in: NoteUpdate, db: Session = Depends(get_db)):
    """Update existing note details."""
    updated = note_service.update_note(db, note_id, note_in)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return updated


@router.patch("/{note_id}/pin", response_model=NoteResponse)
def toggle_note_pin(note_id: int, db: Session = Depends(get_db)):
    """Toggle the pinned status of a note."""
    updated = note_service.toggle_pin(db, note_id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return updated


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    """Delete a note by ID."""
    success = note_service.delete_note(db, note_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return None
