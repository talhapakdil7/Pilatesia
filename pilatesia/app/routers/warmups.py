from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db
from app.core.security import get_current_user

router = APIRouter(tags=["warmups"])


def require_admin(user=Depends(get_current_user)):
    if getattr(user, "role", None) != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


class WarmupMoveCreate(BaseModel):
    title: str
    description: str | None = None
    video_url: str | None = None


class WarmupMoveUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    video_url: str | None = None


@router.get("/warmup-moves")
def list_warmup_moves(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT id, title, description, video_url
        FROM warmup_moves
        ORDER BY id
    """)).fetchall()

    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "video_url": r.video_url
        }
        for r in rows
    ]


@router.post("/warmup-moves")
def create_warmup_move(
    body: WarmupMoveCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    db.execute(
        text("""
            INSERT INTO warmup_moves (title, description, video_url)
            VALUES (:title, :description, :video_url)
        """),
        {
            "title": body.title,
            "description": body.description,
            "video_url": body.video_url,
        },
    )
    db.commit()
    return {"message": "Warmup move created"}


@router.put("/warmup-moves/{move_id}")
def update_warmup_move(
    move_id: int,
    body: WarmupMoveUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    existing = db.execute(
        text("SELECT id FROM warmup_moves WHERE id=:id"),
        {"id": move_id},
    ).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Warmup move not found")

    data = {k: v for k, v in body.model_dump().items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    set_clause = ", ".join([f"{k} = :{k}" for k in data.keys()])
    data["id"] = move_id
    db.execute(text(f"UPDATE warmup_moves SET {set_clause} WHERE id=:id"), data)
    db.commit()
    return {"message": "Warmup move updated", "move_id": move_id}


@router.delete("/warmup-moves/{move_id}")
def delete_warmup_move(
    move_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    existing = db.execute(
        text("SELECT id FROM warmup_moves WHERE id=:id"),
        {"id": move_id},
    ).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Warmup move not found")

    db.execute(text("DELETE FROM warmup_moves WHERE id=:id"), {"id": move_id})
    db.commit()
    return {"message": "Warmup move deleted", "move_id": move_id}