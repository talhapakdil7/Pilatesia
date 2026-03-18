from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db
from app.core.security import get_current_user, hash_password
from app.core.membership_logic import get_or_create_membership

router = APIRouter(prefix="/admin", tags=["admin-users"])


def require_admin(user=Depends(get_current_user)):
    if getattr(user, "role", None) != "admin":
        raise HTTPException(status_code=403, detail="Sadece admin")
    return user


@router.get("/users")
def list_users(db: Session = Depends(get_db), admin=Depends(require_admin)):
    rows = db.execute(
        text("""
            SELECT u.id, u.full_name, u.email, u.role, u.created_at,
                   COALESCE(m.remaining_cred, 0) AS remaining_cred
            FROM users u
            LEFT JOIN memberships m ON m.user_id = u.id
            WHERE u.studio_id = :sid
            ORDER BY u.id DESC
        """),
        {"sid": admin.studio_id},
    ).fetchall()

    return [
        {
            "id": r.id,
            "full_name": r.full_name,
            "email": r.email,
            "role": r.role,
            "created_at": str(r.created_at) if r.created_at else None,
            "remaining_cred": r.remaining_cred,
        }
        for r in rows
    ]


class AdminUserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "user"


@router.post("/users")
def create_user(body: AdminUserCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    existing = db.execute(
        text("SELECT id FROM users WHERE email = :email AND studio_id = :sid"),
        {"email": body.email, "sid": admin.studio_id},
    ).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı")

    db.execute(
        text("""
            INSERT INTO users (studio_id, full_name, email, password_hash, role)
            VALUES (:studio_id, :full_name, :email, :password_hash, :role)
        """),
        {
            "studio_id": admin.studio_id,
            "full_name": body.full_name,
            "email": body.email,
            "password_hash": hash_password(body.password),
            "role": body.role,
        },
    )
    db.commit()
    return {"message": "Kullanıcı oluşturuldu"}


class AdminUserUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    password: str | None = None
    role: str | None = None


@router.patch("/users/{user_id}")
def update_user(
    user_id: int,
    body: AdminUserUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    existing = db.execute(
        text("SELECT id FROM users WHERE id = :id AND studio_id = :sid"),
        {"id": user_id, "sid": admin.studio_id},
    ).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    fields = {}
    if body.full_name is not None:
        fields["full_name"] = body.full_name
    if body.email is not None:
        e = db.execute(
            text("SELECT id FROM users WHERE email = :email AND studio_id = :sid AND id != :id"),
            {"email": body.email, "sid": admin.studio_id, "id": user_id},
        ).fetchone()
        if e:
            raise HTTPException(status_code=400, detail="Bu e-posta zaten kullanılıyor")
        fields["email"] = body.email
    if body.password is not None:
        if body.password.strip() == "":
            raise HTTPException(status_code=400, detail="Şifre boş olamaz")
        fields["password_hash"] = hash_password(body.password)
    if body.role is not None:
        fields["role"] = body.role

    if not fields:
        raise HTTPException(status_code=400, detail="Güncellenecek alan yok")

    set_clause = ", ".join([f"{k} = :{k}" for k in fields.keys()])
    fields["id"] = user_id
    db.execute(text(f"UPDATE users SET {set_clause} WHERE id = :id"), fields)
    db.commit()
    return {"message": "Kullanıcı güncellendi", "user_id": user_id}


class AddCreditsBody(BaseModel):
    add_credits: int


@router.patch("/users/{user_id}/credits")
def add_user_credits(
    user_id: int,
    body: AddCreditsBody,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    existing = db.execute(
        text("SELECT id FROM users WHERE id = :id AND studio_id = :sid"),
        {"id": user_id, "sid": admin.studio_id},
    ).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    if body.add_credits <= 0:
        raise HTTPException(status_code=400, detail="add_credits pozitif olmalı")

    get_or_create_membership(db, user_id)
    db.execute(
        text("""
            UPDATE memberships SET remaining_cred = remaining_cred + :amt
            WHERE user_id = :uid AND status = 'active'
        """),
        {"uid": user_id, "amt": body.add_credits},
    )
    db.commit()
    return {"message": "Kredi eklendi", "user_id": user_id, "added": body.add_credits}


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    existing = db.execute(
        text("SELECT id FROM users WHERE id = :id AND studio_id = :sid"),
        {"id": user_id, "sid": admin.studio_id},
    ).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    db.execute(text("DELETE FROM users WHERE id = :id"), {"id": user_id})
    db.commit()
    return {"message": "Kullanıcı silindi", "user_id": user_id}
