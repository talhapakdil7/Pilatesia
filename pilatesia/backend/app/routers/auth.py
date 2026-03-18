from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.auth import UserRegister, StudioRegister
from app.core.security import hash_password, verify_password, create_token, get_current_user

router = APIRouter(tags=["auth"])


@router.post("/register-studio")
def register_studio(body: StudioRegister, db: Session = Depends(get_db)):
    """Yeni stüdyo oluşturur ve ilk admin kullanıcıyı ekler (herkese açık)."""
    # Stüdyo kodu benzersiz mi?
    existing = db.execute(
        text("SELECT id FROM studios WHERE code = :code"),
        {"code": body.studio_code.strip().lower()},
    ).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Bu stüdyo kodu zaten kullanılıyor")

    # Stüdyo oluştur
    db.execute(
        text("INSERT INTO studios (name, code) VALUES (:name, :code)"),
        {"name": body.studio_name.strip(), "code": body.studio_code.strip().lower()},
    )
    db.commit()
    r = db.execute(text("SELECT LAST_INSERT_ID() AS id")).fetchone()
    studio_id = r.id

    # Aynı stüdyoda email kullanılmış mı?
    existing_user = db.execute(
        text("SELECT id FROM users WHERE email = :email AND studio_id = :sid"),
        {"email": body.admin_email, "sid": studio_id},
    ).fetchone()
    if existing_user:
        db.execute(text("DELETE FROM studios WHERE id = :id"), {"id": studio_id})
        db.commit()
        raise HTTPException(status_code=400, detail="Bu e-posta bu stüdyoda zaten kayıtlı")

    # Admin kullanıcı oluştur
    db.execute(
        text("""
            INSERT INTO users (studio_id, full_name, email, password_hash, role)
            VALUES (:studio_id, :full_name, :email, :password_hash, 'admin')
        """),
        {
            "studio_id": studio_id,
            "full_name": body.admin_name,
            "email": body.admin_email,
            "password_hash": hash_password(body.admin_password),
        },
    )
    db.commit()
    return {"message": "Stüdyo oluşturuldu. Admin hesabıyla giriş yapabilirsiniz.", "studio_code": body.studio_code}


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    code = user.studio_code.strip().lower()
    studio = db.execute(
        text("SELECT id FROM studios WHERE code = :code"),
        {"code": code},
    ).fetchone()
    if not studio:
        raise HTTPException(status_code=400, detail="Geçersiz stüdyo kodu")

    existing = db.execute(
        text("SELECT id FROM users WHERE email = :email AND studio_id = :sid"),
        {"email": user.email, "sid": studio.id},
    ).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Bu e-posta bu stüdyoda zaten kayıtlı")

    db.execute(
        text("""
            INSERT INTO users (studio_id, full_name, email, password_hash)
            VALUES (:studio_id, :full_name, :email, :password_hash)
        """),
        {
            "studio_id": studio.id,
            "full_name": user.full_name,
            "email": user.email,
            "password_hash": hash_password(user.password),
        },
    )
    db.commit()
    return {"message": "Kayıt başarılı. Giriş yapabilirsiniz."}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form_data.username
    password = form_data.password

    db_user = db.execute(
        text("SELECT id, studio_id, password_hash FROM users WHERE email = :email LIMIT 1"),
        {"email": email},
    ).fetchone()

    if not db_user or not verify_password(password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Geçersiz e-posta veya şifre")

    token = create_token(db_user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "studio_id": current_user.studio_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at,
    }


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    password: str | None = None


@router.put("/profile")
def update_profile(
    body: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if body.full_name is None and body.password is None:
        raise HTTPException(status_code=400, detail="Güncellenecek alan yok")

    fields = {}
    if body.full_name is not None:
        fields["full_name"] = body.full_name
    if body.password is not None:
        if body.password.strip() == "":
            raise HTTPException(status_code=400, detail="Şifre boş olamaz")
        fields["password_hash"] = hash_password(body.password)

    set_clause = ", ".join([f"{k} = :{k}" for k in fields.keys()])
    fields["id"] = current_user.id
    db.execute(text(f"UPDATE users SET {set_clause} WHERE id = :id"), fields)
    db.commit()
    return {"message": "Profil güncellendi"}


@router.get("/studios/check")
def check_studio_code(studio_code: str, db: Session = Depends(get_db)):
    """Stüdyo kodu geçerli mi kontrol eder (kayıt formu için)."""
    row = db.execute(
        text("SELECT id, name FROM studios WHERE code = :code"),
        {"code": studio_code.strip().lower()},
    ).fetchone()
    if not row:
        return {"valid": False}
    return {"valid": True, "name": row.name}
