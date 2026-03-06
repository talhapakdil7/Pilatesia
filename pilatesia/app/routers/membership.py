from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.core.membership_logic import get_or_create_membership
from app.db import get_db

router = APIRouter(tags=["membership"])


@router.get("/membership")
def get_membership(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = current_user.id

    row = db.execute(
        text("""
            SELECT id, user_id, status, remaining_cred
            FROM memberships
            WHERE user_id = :uid
            LIMIT 1
        """),
        {"uid": user_id},
    ).fetchone()

    if not row:
        get_or_create_membership(db, user_id)
        row = db.execute(
            text("""
                SELECT id, user_id, status, remaining_cred
                FROM memberships
                WHERE user_id = :uid
                LIMIT 1
            """),
            {"uid": user_id},
        ).fetchone()

    return {
        "id": row.id,
        "user_id": row.user_id,
        "status": row.status,
        "remaining_cred": row.remaining_cred,
    }