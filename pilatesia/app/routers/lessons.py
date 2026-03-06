from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from app.db import get_db
router = APIRouter(tags=["lessons"])

@router.get("/lessons")
def get_lessons(db: Session = Depends(get_db)):
    # Sadece gelecek dersler (start_time >= şu an); tarihi geçenler listelenmez
    lessons = db.execute(text("""
        SELECT id, title, description, instructor_name, start_time, duration, capacity
        FROM lessons
        WHERE start_time >= datetime('now', 'localtime')
        ORDER BY start_time
    """)).fetchall()

    return [
        {
            "id": l.id,
            "title": l.title,
            "description": l.description,
            "instructor_name": l.instructor_name,
            "start_time": l.start_time,
            "duration": l.duration,
            "capacity": l.capacity,
        }
        for l in lessons
    ]

@router.get("/lessons/{lesson_id}")
def get_lesson_detail(lesson_id: int, db: Session = Depends(get_db)):

    lesson = db.execute(
        text("""
        SELECT id, title, description, instructor_name, start_time, duration, capacity
        FROM lessons
        WHERE id = :lesson_id
        """),
        {"lesson_id": lesson_id}
    ).fetchone()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    return {
        "id": lesson.id,
        "title": lesson.title,
        "description": lesson.description,
        "instructor_name": lesson.instructor_name,
        "start_time": lesson.start_time,
        "duration": lesson.duration,
        "capacity": lesson.capacity
    }