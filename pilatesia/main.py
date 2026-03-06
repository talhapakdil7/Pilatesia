from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, lessons, reservations, membership
from app.routers import admin_lessons
from app.routers import admin_users
from app.routers import warmups

app = FastAPI(title="Pilatesia API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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