from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.reservations import ReservationCreate
from app.core.security import get_current_user
from app.core.membership_logic import get_or_create_membership, consume_credit_or_400, refund_credit

router = APIRouter(tags=["reservations"])


@router.post("/reservations")
def create_reservation(
    body: ReservationCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    user_id = user.id
    lesson_id = body.lesson_id

    # 0) üyelik yoksa oluştur (ilk rezervasyonda kredi tanımlanır), sonra kredi düş
    get_or_create_membership(db, user_id)
    consume_credit_or_400(db, user_id)

    # 1) Lesson var mı + capacity + kullanıcının stüdyosuna ait mi
    lesson = db.execute(
        text("SELECT id, capacity FROM lessons WHERE id = :lesson_id AND studio_id = :sid"),
        {"lesson_id": lesson_id, "sid": user.studio_id},
    ).fetchone()
    if not lesson:
        # kredi geri ver (lesson yoksa)
        refund_credit(db, user_id)
        raise HTTPException(status_code=404, detail="Lesson not found")

    # 2) Aynı derse aktif rezervasyon var mı?
    existing = db.execute(
        text("""
            SELECT id FROM reservations
            WHERE user_id=:user_id AND lesson_id=:lesson_id AND status='active'
            LIMIT 1
        """),
        {"user_id": user_id, "lesson_id": lesson_id},
    ).fetchone()
    if existing:
        refund_credit(db, user_id)
        raise HTTPException(status_code=400, detail="Already reserved")

    # 3) kapasite kontrol
    active_count = db.execute(
        text("SELECT COUNT(*) as cnt FROM reservations WHERE lesson_id = :lesson_id AND status = 'active'"),
        {"lesson_id": lesson_id},
    ).fetchone()
    if active_count.cnt >= lesson.capacity:
        refund_credit(db, user_id)
        raise HTTPException(status_code=400, detail="Lesson is full")

    # 4) rezervasyon oluştur
    db.execute(
        text("INSERT INTO reservations (user_id, lesson_id, status) VALUES (:uid, :lid, 'active')"),
        {"uid": user_id, "lid": lesson_id},
    )
    db.commit()
    return {"message": "Reservation created", "lesson_id": lesson_id}


@router.get("/my-reservations")
def my_reservations(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """SADECE aktif rezervasyonlar"""
    user_id = user.id

    # Sadece dersi henüz bitmemiş aktif rezervasyonlar (ders bittikten sonra listede görünmez)
    rows = db.execute(
        text("""
            SELECT
                r.id as reservation_id,
                r.status,
                r.created_at,
                l.id as lesson_id,
                l.title,
                l.instructor_name,
                l.start_time,
                l.duration
            FROM reservations r
            JOIN lessons l ON l.id = r.lesson_id
            WHERE r.user_id = :user_id
              AND r.status = 'active'
              AND l.start_time IS NOT NULL
              AND DATE_ADD(l.start_time, INTERVAL l.duration MINUTE) > NOW()
            ORDER BY l.start_time ASC
        """),
        {"user_id": user_id},
    ).fetchall()

    return [
        {
            "reservation_id": x.reservation_id,
            "status": x.status,
            "created_at": str(x.created_at) if x.created_at else None,
            "lesson": {
                "id": x.lesson_id,
                "title": x.title,
                "instructor_name": x.instructor_name,
                "start_time": str(x.start_time) if x.start_time else None,
                "duration": x.duration,
            },
        }
        for x in rows
    ]


@router.get("/my-reservations/history")
def my_reservations_history(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Tüm geçmiş (active + cancelled)"""
    user_id = user.id

    rows = db.execute(
        text("""
            SELECT
                r.id as reservation_id,
                r.status,
                r.created_at,
                l.id as lesson_id,
                l.title,
                l.instructor_name,
                l.start_time,
                l.duration
            FROM reservations r
            JOIN lessons l ON l.id = r.lesson_id
            WHERE r.user_id = :user_id
            ORDER BY r.created_at DESC
        """),
        {"user_id": user_id},
    ).fetchall()

    return [
        {
            "reservation_id": x.reservation_id,
            "status": x.status,
            "created_at": str(x.created_at) if x.created_at else None,
            "lesson": {
                "id": x.lesson_id,
                "title": x.title,
                "instructor_name": x.instructor_name,
                "start_time": str(x.start_time) if x.start_time else None,
                "duration": x.duration,
            },
        }
        for x in rows
    ]


@router.delete("/reservations/{reservation_id}")
def cancel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    user_id = user.id

    r = db.execute(
        text("""
            SELECT r.id, r.status, l.start_time
            FROM reservations r
            JOIN lessons l ON l.id = r.lesson_id
            WHERE r.id = :rid AND r.user_id = :uid
        """),
        {"rid": reservation_id, "uid": user_id},
    ).fetchone()
    if not r:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if r.status != "active":
        raise HTTPException(status_code=400, detail="Reservation already cancelled")

    # Ders başladıysa iptal etme
    if r.start_time:
        from datetime import datetime
        try:
            start = datetime.strptime(str(r.start_time).strip()[:16], "%Y-%m-%d %H:%M")
            if start <= datetime.now():
                raise HTTPException(
                    status_code=400,
                    detail="Ders başladıktan sonra iptal edilemez.",
                )
        except ValueError:
            pass

    # 1) rezervasyonu iptal et
    db.execute(
        text("UPDATE reservations SET status='cancelled' WHERE id=:rid"),
        {"rid": reservation_id},
    )

    # 2) kredi iade et
    refund_credit(db, user_id)

    db.commit()
    return {"message": "Reservation cancelled", "reservation_id": reservation_id}
