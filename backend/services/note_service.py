from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc, func
from backend.models.note import Note, Subject
from backend.schemas.note import NoteCreate, NoteUpdate, NoteStats, SubjectCreate, SubjectDetail


def get_notes(
    db: Session,
    search: Optional[str] = None,
    subject: Optional[str] = None,
    tag: Optional[str] = None,
    is_pinned: Optional[bool] = None,
    sort_by: str = "newest",
    user_id: Optional[int] = None
) -> List[Note]:
    query = db.query(Note)

    if user_id is not None:
        query = query.filter(Note.user_id == user_id)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Note.title.ilike(search_pattern),
                Note.content.ilike(search_pattern),
                Note.subject.ilike(search_pattern),
                Note.tags.ilike(search_pattern)
            )
        )

    if subject and subject.strip().lower() != "all":
        query = query.filter(Note.subject.ilike(subject.strip()))

    if tag and tag.strip():
        tag_pattern = f"%{tag.strip()}%"
        query = query.filter(Note.tags.ilike(tag_pattern))

    if is_pinned is not None:
        query = query.filter(Note.is_pinned == is_pinned)

    # Sorting
    if sort_by == "oldest":
        query = query.order_by(Note.created_at.asc())
    elif sort_by == "title_asc":
        query = query.order_by(Note.title.asc())
    elif sort_by == "title_desc":
        query = query.order_by(Note.title.desc())
    elif sort_by == "pinned":
        query = query.order_by(desc(Note.is_pinned), desc(Note.updated_at))
    else:  # newest (default)
        query = query.order_by(desc(Note.is_pinned), desc(Note.updated_at))

    return query.all()


def get_note_by_id(db: Session, note_id: int) -> Optional[Note]:
    return db.query(Note).filter(Note.id == note_id).first()


def create_note(db: Session, note_data: NoteCreate) -> Note:
    subject_cleaned = note_data.subject.strip() if note_data.subject and note_data.subject.strip() else "General"
    db_note = Note(
        title=note_data.title.strip(),
        content=note_data.content.strip(),
        subject=subject_cleaned,
        tags=note_data.tags if isinstance(note_data.tags, str) else "",
        is_pinned=note_data.is_pinned,
        color=note_data.color or "default",
        user_id=note_data.user_id
    )
    try:
        db.add(db_note)
        # Ensure subject is also saved to subjects table
        if subject_cleaned.lower() != "general":
            existing_subj = db.query(Subject).filter(Subject.name.ilike(subject_cleaned)).first()
            if not existing_subj:
                db.add(Subject(name=subject_cleaned, color="blue"))
        db.commit()
        db.refresh(db_note)
        return db_note
    except Exception:
        db.rollback()
        raise


def update_note(db: Session, note_id: int, note_data: NoteUpdate) -> Optional[Note]:
    db_note = get_note_by_id(db, note_id)
    if not db_note:
        return None

    update_dict = note_data.model_dump(exclude_unset=True)
    try:
        for key, value in update_dict.items():
            if key == "title" and value is not None:
                db_note.title = value.strip()
            elif key == "content" and value is not None:
                db_note.content = value.strip()
            elif key == "subject" and value is not None:
                new_subj = value.strip() if value.strip() else "General"
                db_note.subject = new_subj
                if new_subj.lower() != "general":
                    existing_subj = db.query(Subject).filter(Subject.name.ilike(new_subj)).first()
                    if not existing_subj:
                        db.add(Subject(name=new_subj, color="blue"))
            elif key == "tags" and value is not None:
                db_note.tags = value
            elif key == "is_pinned" and value is not None:
                db_note.is_pinned = value
            elif key == "color" and value is not None:
                db_note.color = value
            elif key == "user_id":
                db_note.user_id = value

        db.commit()
        db.refresh(db_note)
        return db_note
    except Exception:
        db.rollback()
        raise


def toggle_pin(db: Session, note_id: int) -> Optional[Note]:
    db_note = get_note_by_id(db, note_id)
    if not db_note:
        return None

    try:
        db_note.is_pinned = not db_note.is_pinned
        db.commit()
        db.refresh(db_note)
        return db_note
    except Exception:
        db.rollback()
        raise


def delete_note(db: Session, note_id: int) -> bool:
    db_note = get_note_by_id(db, note_id)
    if not db_note:
        return False

    try:
        db.delete(db_note)
        db.commit()
        return True
    except Exception:
        db.rollback()
        raise


def get_subjects(db: Session) -> List[str]:
    """Return distinct subject names from the subjects table + notes table (merged)."""
    # Custom subjects from the subjects table
    custom = db.query(Subject.name).order_by(Subject.name.asc()).all()
    custom_names = [s[0] for s in custom if s[0]]

    # Also gather subjects from existing notes (backwards compat)
    note_subjects = db.query(Note.subject).distinct().filter(Note.subject != None).all()
    note_names = [s[0] for s in note_subjects if s[0]]

    combined = sorted(set(custom_names + note_names))
    return combined


def get_subject_details(db: Session) -> List[SubjectDetail]:
    """Return all custom subjects with their note counts."""
    subjects = db.query(Subject).order_by(Subject.name.asc()).all()
    result = []
    for subj in subjects:
        count = db.query(func.count(Note.id)).filter(
            Note.subject.ilike(subj.name)
        ).scalar() or 0
        result.append(SubjectDetail(name=subj.name, color=subj.color, note_count=count))
    return result


def create_subject(db: Session, subject_data: SubjectCreate) -> Subject:
    """Create a new custom subject."""
    existing = db.query(Subject).filter(
        Subject.name.ilike(subject_data.name.strip())
    ).first()
    if existing:
        return existing  # idempotent - return existing if same name
    db_subject = Subject(
        name=subject_data.name.strip(),
        color=subject_data.color or 'blue'
    )
    try:
        db.add(db_subject)
        db.commit()
        db.refresh(db_subject)
        return db_subject
    except Exception:
        db.rollback()
        raise


def delete_subject(db: Session, subject_name: str) -> bool:
    """Delete a subject by name. Does NOT delete its associated notes."""
    subj = db.query(Subject).filter(Subject.name.ilike(subject_name.strip())).first()
    if not subj:
        return False
    try:
        db.delete(subj)
        db.commit()
        return True
    except Exception:
        db.rollback()
        raise


def get_stats(db: Session, user_id: Optional[int] = None) -> NoteStats:
    notes_query = db.query(Note)
    if user_id is not None:
        notes_query = notes_query.filter(Note.user_id == user_id)

    total_notes = notes_query.count()
    total_pinned = notes_query.filter(Note.is_pinned == True).count()
    subjects = get_subjects(db)
    return NoteStats(
        total_notes=total_notes,
        total_subjects=len(subjects),
        total_pinned=total_pinned,
        subjects=subjects
    )
