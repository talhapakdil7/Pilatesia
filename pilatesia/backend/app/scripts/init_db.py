"""
PostgreSQL veritabanı tablolarını oluşturur.
Kullanım: python -m app.scripts.init_db
veya: uv run python -m app.scripts.init_db
"""
import os
import sys

# Proje kökünü path'e ekle
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import text

from app.db import engine


def main():
    sql_path = os.path.join(os.path.dirname(__file__), "..", "..", "scripts", "init_db.sql")
    if not os.path.exists(sql_path):
        print(f"init_db.sql bulunamadı: {sql_path}")
        sys.exit(1)

    with open(sql_path, encoding="utf-8") as f:
        sql = f.read()

    with engine.connect() as conn:
        for stmt in sql.split(";"):
            stmt = stmt.strip()
            if stmt and not stmt.startswith("--"):
                conn.execute(text(stmt))
        conn.commit()

    print("Tablo yapısı oluşturuldu.")
    print("İlk stüdyo oluşturmak için API: POST /register-studio")


if __name__ == "__main__":
    main()
