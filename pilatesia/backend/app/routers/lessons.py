from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.db import get_db
from app.core.security import get_current_user

router = APIRouter(tags=["lessons"])


@router.get("/lessons")
def get_lessons(db: Session = Depends(get_db), user=Depends(get_current_user)):
    studio_id = user.studio_id
    lessons = db.execute(text("""
        SELECT
            l.id, l.title, l.description, l.instructor_name, l.start_time, l.duration, l.capacity,
            (l.capacity - (SELECT COUNT(*) FROM reservations r WHERE r.lesson_id = l.id AND r.status = 'active')) AS remaining_seats
        FROM lessons l
        WHERE l.studio_id = :studio_id
          AND l.start_time >= NOW()
        ORDER BY l.start_time
    """), {"studio_id": studio_id}).fetchall()

    return [
        {
            "id": l.id,
            "title": l.title,
            "description": l.description,
            "instructor_name": l.instructor_name,
            "start_time": str(l.start_time) if l.start_time else None,
            "duration": l.duration,
            "capacity": l.capacity,
            "remaining_seats": max(0, l.remaining_seats or 0),
        }
        for l in lessons
    ]


@router.get("/lessons/{lesson_id}")
def get_lesson_detail(lesson_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    lesson = db.execute(
        text("""
            SELECT
                l.id, l.title, l.description, l.instructor_name, l.start_time, l.duration, l.capacity,
                (l.capacity - (SELECT COUNT(*) FROM reservations r WHERE r.lesson_id = l.id AND r.status = 'active')) AS remaining_seats
            FROM lessons l
            WHERE l.id = :lesson_id AND l.studio_id = :studio_id
        """),
        {"lesson_id": lesson_id, "studio_id": user.studio_id},
    ).fetchone()

    if not lesson:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Ders bulunamadı")

    return {
        "id": lesson.id,
        "title": lesson.title,
        "description": lesson.description,
        "instructor_name": lesson.instructor_name,
        "start_time": str(lesson.start_time) if lesson.start_time else None,
        "duration": lesson.duration,
        "capacity": lesson.capacity,
        "remaining_seats": max(0, lesson.remaining_seats or 0),
    }
