from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.auth import UserRegister
from app.core.security import hash_password, verify_password, create_token, get_current_user

router = APIRouter(tags=["auth"])


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing = db.execute(
        text("SELECT id FROM users WHERE email=:email"),
        {"email": user.email},
    ).fetchone()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    password_hash = hash_password(user.password)

    db.execute(
        text("""
            INSERT INTO users (full_name, email, password_hash)
            VALUES (:full_name, :email, :password_hash)
        """),
        {"full_name": user.full_name, "email": user.email, "password_hash": password_hash},
    )
    db.commit()
    return {"message": "User created"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form_data.username
    password = form_data.password

    db_user = db.execute(
        text("SELECT id, password_hash FROM users WHERE email=:email"),
        {"email": email},
    ).fetchone()

    if not db_user or not verify_password(password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(db_user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
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
        raise HTTPException(status_code=400, detail="Nothing to update")

    fields = {}

    if body.full_name is not None:
        fields["full_name"] = body.full_name

    if body.password is not None:
        if body.password.strip() == "":
            raise HTTPException(status_code=400, detail="Password cannot be empty")
        fields["password_hash"] = hash_password(body.password)

    set_clause = ", ".join([f"{k} = :{k}" for k in fields.keys()])
    fields["id"] = current_user.id

    db.execute(text(f"UPDATE users SET {set_clause} WHERE id=:id"), fields)
    db.commit()

    return {"message": "Profile updated"}