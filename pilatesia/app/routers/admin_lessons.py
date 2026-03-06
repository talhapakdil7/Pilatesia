from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/admin", tags=["admin-lessons"])


def require_admin(user=Depends(get_current_user)):
    # user.role DB'den geliyor olmalı (users tablosu)
    if getattr(user, "role", None) != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


class LessonCreate(BaseModel):
    title: str
    description: str | None = None
    instructor_name: str
    start_time: str  # "2026-03-05 10:00"
    duration: int
    capacity: int


class LessonUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    instructor_name: str | None = None
    start_time: str | None = None
    duration: int | None = None
    capacity: int | None = None


@router.get("/lessons")
def admin_list_lessons(
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    rows = db.execute(text("""
        SELECT id, title, description, instructor_name, start_time, duration, capacity
        FROM lessons
        ORDER BY start_time
    """)).fetchall()

    return [
        {
            "id": x.id,
            "title": x.title,
            "description": x.description,
            "instructor_name": x.instructor_name,
            "start_time": x.start_time,
            "duration": x.duration,
            "capacity": x.capacity,
        }
        for x in rows
    ]


@router.post("/lessons")
def admin_create_lesson(
    body: LessonCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    db.execute(text("""
        INSERT INTO lessons (title, description, instructor_name, start_time, duration, capacity)
        VALUES (:title, :description, :instructor_name, :start_time, :duration, :capacity)
    """), body.model_dump())
    db.commit()
    return {"message": "Lesson created"}


@router.put("/lessons/{lesson_id}")
def admin_update_lesson(
    lesson_id: int,
    body: LessonUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    existing = db.execute(text("SELECT id FROM lessons WHERE id=:id"), {"id": lesson_id}).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Lesson not found")

    data = {k: v for k, v in body.model_dump().items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    set_clause = ", ".join([f"{k} = :{k}" for k in data.keys()])
    data["id"] = lesson_id

    db.execute(text(f"UPDATE lessons SET {set_clause} WHERE id=:id"), data)
    db.commit()
    return {"message": "Lesson updated", "lesson_id": lesson_id}


@router.delete("/lessons/{lesson_id}")
def admin_delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    existing = db.execute(text("SELECT id FROM lessons WHERE id=:id"), {"id": lesson_id}).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Lesson not found")

    db.execute(text("DELETE FROM lessons WHERE id=:id"), {"id": lesson_id})
    db.commit()
    return {"message": "Lesson deleted", "lesson_id": lesson_id}