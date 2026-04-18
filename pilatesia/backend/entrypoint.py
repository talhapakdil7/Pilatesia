"""
Docker entrypoint: MySQL hazır olana kadar bekler, tablolar yoksa init_db çalıştırır, sonra uvicorn başlatır.
"""
import os
import sys
import time

def wait_for_db(max_attempts=30):
    from sqlalchemy import text
    from app.db import engine
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
    from sqlalchemy import text
    from app.db import engine
    try:
        with engine.connect() as conn:
            r = conn.execute(text(
                "SELECT tablename FROM pg_tables "
                "WHERE schemaname = 'public' AND tablename = 'studios'"
            )).fetchone()
            return r is not None
    except Exception:
        return False

def main():
    wait_for_db()
    if not tables_exist():
        import subprocess
        subprocess.run([sys.executable, "-m", "app.scripts.init_db"], check=True)
    port = os.getenv("PORT", "8000")
    os.execvp(
        "uvicorn",
        ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", str(port)],
    )

if __name__ == "__main__":
    main()
