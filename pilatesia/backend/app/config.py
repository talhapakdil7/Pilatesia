import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
DB_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://localhost:5432/pilatesia",
)
