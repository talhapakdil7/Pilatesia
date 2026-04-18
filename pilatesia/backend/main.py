import os
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.routers import auth, lessons, reservations, membership
from app.routers import admin_lessons
from app.routers import admin_users
from app.routers import warmups
from app.db import engine
from app.scripts.init_db import main as init_db_main

app = FastAPI(title="Pilatesia API")

default_allow_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

allow_origins_env = os.getenv("CORS_ALLOW_ORIGINS", "")
if allow_origins_env.strip():
    allow_origins = [o.strip() for o in allow_origins_env.split(",") if o.strip()]
else:
    allow_origins = default_allow_origins[:]

vercel_url = os.getenv("VERCEL_URL")
if vercel_url and f"https://{vercel_url}" not in allow_origins:
    allow_origins.append(f"https://{vercel_url}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def wait_for_db(max_attempts=30):
    """DB hazır olana kadar bekler (Railway container start sırası için)."""
    for i in range(max_attempts):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return
        except Exception:
            if i == max_attempts - 1:
                raise
            time.sleep(2)


def tables_exist():
    """'studios' tablosu varsa şema hazır varsayılır."""
    try:
        with engine.connect() as conn:
            r = conn.execute(text(
                "SELECT tablename FROM pg_tables "
                "WHERE schemaname = 'public' AND tablename = 'studios'"
            )).fetchone()
            return r is not None
    except Exception:
        return False


@app.on_event("startup")
def ensure_tables_on_startup():
    wait_for_db()
    if not tables_exist():
        init_db_main()


app.include_router(auth.router)
app.include_router(lessons.router)
app.include_router(reservations.router)
app.include_router(membership.router)

app.include_router(admin_lessons.router)
app.include_router(admin_users.router)
app.include_router(warmups.router)