import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, lessons, reservations, membership
from app.routers import admin_lessons
from app.routers import admin_users
from app.routers import warmups

app = FastAPI(title="Pilatesia API")

default_allow_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

allow_origins_env = os.getenv(
    "CORS_ALLOW_ORIGINS",
    ",".join(default_allow_origins),
)
allow_origins = [o.strip() for o in allow_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(lessons.router)
app.include_router(reservations.router)
app.include_router(membership.router)

app.include_router(admin_lessons.router)
app.include_router(admin_users.router)
app.include_router(warmups.router)